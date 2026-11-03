<?php
/**
 * API de reservas — TheMajord'Home
 * Base comum: configuração, respostas JSON, validação, reservas guardadas
 * em data/reservations/ (pasta protegida por data/.htaccess), emails.
 *
 * Contrato dos endpoints: docs/INTEGRACAO-BEDS24-STRIPE.md
 */

define('API_ROOT', dirname(__DIR__));
define('API_DATA_DIR', API_ROOT . '/data');
define('RESERVATIONS_DIR', API_DATA_DIR . '/reservations');

require_once __DIR__ . '/beds24.php';
require_once __DIR__ . '/stripe.php';

date_default_timezone_set('Europe/Lisbon');

function api_config() {
    static $config = null;
    if ($config === null) {
        $file = file_exists(__DIR__ . '/config.php') ? __DIR__ . '/config.php' : __DIR__ . '/config.example.php';
        $config = require $file;
    }
    return $config;
}

function is_live() { return (api_config()['mode'] ?? 'mock') === 'live'; }

/* =========================================================================
   Respostas
   ========================================================================= */

function json_out($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Erros: { "error": { "code": "...", "message": "..." } } — códigos no doc. */
function json_error($code, $message, $status) {
    json_out(['error' => ['code' => $code, 'message' => $message]], $status);
}

/** Executa o endpoint e converte exceções em erro 500 sem expor detalhes. */
function api_run(callable $handler) {
    try {
        $handler();
    } catch (Throwable $e) {
        error_log('[api] ' . $e->getMessage());
        json_error('server', 'Erro interno. Tente novamente mais tarde.', 500);
    }
}

/* =========================================================================
   Validação de entrada
   ========================================================================= */

function load_site_properties() {
    static $props = null;
    if ($props === null) {
        $props = json_decode((string) @file_get_contents(API_DATA_DIR . '/properties.json'), true) ?: [];
    }
    return $props;
}

function require_property($slug) {
    $props = load_site_properties();
    // Inativos (painel → "active": false) contam como inexistentes: não se reservam.
    if (!is_string($slug) || !isset($props[$slug]) || !property_is_active($props[$slug])) {
        json_error('invalid_request', 'Alojamento desconhecido.', 400);
    }
    return $props[$slug];
}

/** Sem o campo "active" o apartamento conta como ativo (igual a js/properties-data.js). */
function property_is_active($p) {
    return ($p['active'] ?? true) !== false;
}

function valid_iso_date($s) {
    if (!is_string($s) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $s)) return false;
    [$y, $m, $d] = array_map('intval', explode('-', $s));
    return checkdate($m, $d, $y);
}

/** Valida check-in/check-out (ISO, futuro, máx. 60 noites) e devolve o nº de noites. */
function require_stay($checkIn, $checkOut) {
    if (!valid_iso_date($checkIn) || !valid_iso_date($checkOut)) {
        json_error('invalid_request', 'Datas inválidas (formato YYYY-MM-DD).', 400);
    }
    $nights = (int) ((strtotime($checkOut) - strtotime($checkIn)) / 86400);
    if ($checkIn < date('Y-m-d') || $nights < 1 || $nights > 60) {
        json_error('invalid_request', 'Período de estadia inválido.', 400);
    }
    return $nights;
}

function require_guests($property, $adults, $children) {
    $adults = (int) $adults;
    $children = (int) $children;
    if ($adults < 1 || $children < 0) json_error('invalid_request', 'Número de hóspedes inválido.', 400);
    if ($adults + $children > (int) ($property['guests'] ?? 0)) {
        json_error('capacity', 'Excede a capacidade do alojamento.', 400);
    }
    return [$adults, $children];
}

/** Lista de noites (YYYY-MM-DD) entre check-in (incl.) e check-out (excl.). */
function stay_nights($checkIn, $checkOut) {
    $out = [];
    for ($t = strtotime($checkIn); $t < strtotime($checkOut); $t += 86400) $out[] = date('Y-m-d', $t);
    return $out;
}

/* =========================================================================
   Mapa apartamento do site → quarto do Beds24 (data/beds24-rooms.json)
   ========================================================================= */

function beds24_room_for($slug) {
    $map = json_decode((string) @file_get_contents(API_DATA_DIR . '/beds24-rooms.json'), true) ?: [];
    $roomId = $map[$slug]['roomId'] ?? null;
    if (!$roomId) {
        throw new RuntimeException("Sem roomId do Beds24 para '$slug' em data/beds24-rooms.json");
    }
    return (int) $roomId;
}

/* =========================================================================
   Modo mock — mesmos dados de exemplo que js/booking-api.js
   ========================================================================= */

function mock_unavailable($slug, $from = null, $to = null) {
    $hash = 0;
    foreach (str_split($slug) as $c) $hash = ($hash * 31 + ord($c)) & 0xFFFFFFFF;
    $out = [];
    foreach ([2, 3, 8, 9, 10] as $n) {
        $d = date('Y-m-d', strtotime('today +' . ($n + $hash % 5) . ' days'));
        if ((!$from || $d >= $from) && (!$to || $d <= $to)) $out[] = $d;
    }
    return $out;
}

/* =========================================================================
   Reservas guardadas localmente (data/reservations/<id>.json)
   Servem para a página de regresso do Stripe e para ligar o pagamento à
   reserva do Beds24. A fonte de verdade das reservas continua o Beds24.
   ========================================================================= */

/* =========================================================================
   Preço "desde" de cada apartamento (Beds24), com cache em
   data/reservations/.price-from.json. Em modo mock não há preços.
   ========================================================================= */

/** @return float|null preço por noite mais baixo dos próximos dias */
function price_from_for($slug) {
    if (!is_live()) return null;

    $cfg = api_config()['beds24'];
    $ttl = 3600 * (float) ($cfg['price_from_cache_hours'] ?? 6);
    $cacheFile = RESERVATIONS_DIR . '/.price-from.json';
    $cache = json_decode((string) @file_get_contents($cacheFile), true) ?: [];
    if (isset($cache[$slug]) && ($cache[$slug]['at'] ?? 0) > time() - $ttl) {
        return $cache[$slug]['price'];
    }

    try {
        $days = (int) ($cfg['price_from_days'] ?? 90);
        $price = beds24_lowest_nightly_price(beds24_room_for($slug), date('Y-m-d'), date('Y-m-d', strtotime("+$days days")));
    } catch (Throwable $e) {
        // Sem preço para este apartamento (ex.: ainda sem roomId) — o site
        // mostra "Preço sob consulta". Não guarda em cache: tenta de novo.
        error_log('[api/price-from] ' . $slug . ': ' . $e->getMessage());
        return null;
    }

    $cache[$slug] = ['price' => $price, 'at' => time()];
    if (!is_dir(RESERVATIONS_DIR)) @mkdir(RESERVATIONS_DIR, 0775, true);
    file_put_contents($cacheFile, json_encode($cache), LOCK_EX);
    return $price;
}

function new_reservation_id() {
    return 'TMH-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
}

function reservation_path($id) {
    if (!preg_match('/^TMH-\d{6}-[A-F0-9]{6}$/', (string) $id)) return null;
    return RESERVATIONS_DIR . '/' . $id . '.json';
}

function save_reservation($r) {
    if (!is_dir(RESERVATIONS_DIR)) @mkdir(RESERVATIONS_DIR, 0775, true);
    $r['updatedAt'] = date('c');
    file_put_contents(reservation_path($r['id']), json_encode($r, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);
    return $r;
}

function load_reservation($id) {
    $path = reservation_path($id);
    if (!$path || !file_exists($path)) return null;
    return json_decode(file_get_contents($path), true);
}

/** O que a página reserva.html pode ver (sem dados pessoais). */
function public_reservation($r) {
    return [
        'id' => $r['id'],
        'status' => $r['status'],
        'property' => $r['property'],
        'checkIn' => $r['checkIn'],
        'checkOut' => $r['checkOut'],
        'total' => $r['total'],
        'currency' => $r['currency'],
    ];
}

/* =========================================================================
   Emails (equipa + hóspede)
   TODO (engenheiros): trocar mail() por um fornecedor SMTP/transacional
   (ex.: o SMTP do alojamento, Postmark, Brevo…) para não cair em spam.
   ========================================================================= */

function send_reservation_emails($r, $event) {
    $cfg = api_config()['mail'];
    $props = load_site_properties();
    $name = $props[$r['property']]['name'] ?? $r['property'];
    $total = $r['total'] !== null ? number_format($r['total'], 2, ',', ' ') . ' ' . $r['currency'] : 'sob consulta';

    $subjects = [
        'confirmed' => "Reserva confirmada — $name ({$r['id']})",
        'request'   => "Pedido de reserva — $name ({$r['id']})",
    ];
    $subject = $subjects[$event] ?? "Reserva {$r['id']}";
    $body = "Alojamento: $name\nCheck-in: {$r['checkIn']}\nCheck-out: {$r['checkOut']}\n"
        . "Hóspedes: {$r['adults']} adulto(s), {$r['children']} criança(s)\nTotal: $total\n"
        . "Referência: {$r['id']}\n";
    $teamBody = $body . "\nHóspede: {$r['guest']['name']} <{$r['guest']['email']}> {$r['guest']['phone']}\n"
        . 'Extras: ' . json_encode($r['extras'], JSON_UNESCAPED_UNICODE) . "\nNotas: {$r['notes']}\n"
        . 'Beds24: ' . ($r['beds24BookingId'] ?? '—') . "\n";

    if (!is_live()) {
        // Em mock não se envia nada: fica registado para se poder ver.
        @file_put_contents(RESERVATIONS_DIR . '/mail.log', date('c') . " [$event] $subject\n", FILE_APPEND);
        return;
    }
    $headers = 'From: ' . $cfg['from'] . "\r\nContent-Type: text/plain; charset=UTF-8";
    @mail($cfg['team'], '=?UTF-8?B?' . base64_encode($subject) . '?=', $teamBody, $headers);
    @mail($r['guest']['email'], '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers);
}
