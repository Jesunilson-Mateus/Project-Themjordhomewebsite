<?php
require_once __DIR__ . '/config.php';

/* =========================================================================
   Autenticação
   ========================================================================= */

function current_user() {
    return isset($_SESSION['tmh_user']) ? $_SESSION['tmh_user'] : null;
}

function require_login() {
    if (!current_user()) {
        header('Location: login.php');
        exit;
    }
}

function load_users() {
    if (!file_exists(USERS_JSON)) return [];
    $data = json_decode(file_get_contents(USERS_JSON), true);
    return is_array($data) ? $data : [];
}

function save_users($users) {
    file_put_contents(USERS_JSON, json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

/* =========================================================================
   Proteção contra força bruta no login (por IP)
   ========================================================================= */

function login_attempts_load() {
    if (!file_exists(LOGIN_ATTEMPTS_JSON)) return [];
    $data = json_decode(file_get_contents(LOGIN_ATTEMPTS_JSON), true);
    return is_array($data) ? $data : [];
}

function login_attempts_save($attempts) {
    if (!is_dir(DATA_DIR)) @mkdir(DATA_DIR, 0775, true);
    file_put_contents(LOGIN_ATTEMPTS_JSON, json_encode($attempts));
}

/** Remove entradas antigas para o ficheiro não crescer indefinidamente. */
function login_attempts_cleanup(&$attempts, $now) {
    foreach ($attempts as $ip => $entry) {
        $lockedUntil = $entry['lockedUntil'] ?? 0;
        $windowExpired = ($now - ($entry['first'] ?? 0)) > LOGIN_WINDOW_SECONDS;
        if ($lockedUntil < $now && $windowExpired) {
            unset($attempts[$ip]);
        }
    }
}

/**
 * Verifica se o IP está temporariamente bloqueado por demasiadas tentativas
 * falhadas. Devolve ['blocked' => bool, 'wait' => segundos restantes].
 */
function login_throttle_check($ip) {
    $attempts = login_attempts_load();
    $entry = $attempts[$ip] ?? null;
    if (!$entry) return ['blocked' => false, 'wait' => 0];

    $now = time();
    $lockedUntil = $entry['lockedUntil'] ?? 0;
    if ($lockedUntil > $now) {
        return ['blocked' => true, 'wait' => $lockedUntil - $now];
    }
    return ['blocked' => false, 'wait' => 0];
}

function login_throttle_register_failure($ip) {
    $attempts = login_attempts_load();
    $now = time();
    $entry = $attempts[$ip] ?? ['count' => 0, 'first' => $now, 'lockedUntil' => 0];

    if (($now - $entry['first']) > LOGIN_WINDOW_SECONDS) {
        $entry = ['count' => 0, 'first' => $now, 'lockedUntil' => 0];
    }

    $entry['count']++;
    if ($entry['count'] >= LOGIN_MAX_ATTEMPTS) {
        $entry['lockedUntil'] = $now + LOGIN_LOCKOUT_SECONDS;
    }

    $attempts[$ip] = $entry;
    login_attempts_cleanup($attempts, $now);
    login_attempts_save($attempts);
}

function login_throttle_clear($ip) {
    $attempts = login_attempts_load();
    if (isset($attempts[$ip])) {
        unset($attempts[$ip]);
        login_attempts_save($attempts);
    }
}

/* =========================================================================
   CSRF
   ========================================================================= */

function csrf_token() {
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_field() {
    return '<input type="hidden" name="csrf" value="' . htmlspecialchars(csrf_token()) . '">';
}

function require_csrf() {
    $sent = isset($_POST['csrf']) ? $_POST['csrf'] : '';
    if (empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], $sent)) {
        http_response_code(400);
        die('Pedido inválido (csrf). Volta atrás e tenta novamente.');
    }
}

/* =========================================================================
   Dados: leitura / escrita
   ========================================================================= */

function load_json($path) {
    if (!file_exists($path)) return [];
    $data = json_decode(file_get_contents($path), true);
    return is_array($data) ? $data : [];
}

function save_json($path, $data) {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    file_put_contents($path, $json);
}

function load_properties() { return load_json(PROPERTIES_JSON); }
function load_translations() { return load_json(TRANSLATIONS_JSON); }
function load_amenity_categories() { return load_json(AMENITY_CATEGORIES_JSON); }
function load_amenity_items() { return load_json(AMENITY_ITEMS_JSON); }

/**
 * Guarda uma cópia de segurança dos dados atuais antes de qualquer alteração,
 * para se puder recuperar caso algo corra mal.
 */
function backup_data() {
    if (!is_dir(BACKUPS_DIR)) {
        @mkdir(BACKUPS_DIR, 0775, true);
    }
    $stamp = date('Y-m-d_His');
    $dir = BACKUPS_DIR . '/' . $stamp;
    @mkdir($dir, 0775, true);
    if (file_exists(PROPERTIES_JSON)) copy(PROPERTIES_JSON, $dir . '/properties.json');
    if (file_exists(TRANSLATIONS_JSON)) copy(TRANSLATIONS_JSON, $dir . '/translations.json');

    // Não deixar acumular infinitamente: mantém só as últimas 60 cópias.
    $all = glob(BACKUPS_DIR . '/*', GLOB_ONLYDIR);
    sort($all);
    while (count($all) > 60) {
        $oldest = array_shift($all);
        array_map('unlink', glob($oldest . '/*'));
        @rmdir($oldest);
    }
}

/* =========================================================================
   Regeneração dos ficheiros .js a partir dos dados (JSON continua a ser a
   fonte de verdade; os .js são sempre recriados a partir do JSON para que
   o site continue a funcionar exatamente como antes, sem alterações ao
   código de apresentação).
   ========================================================================= */

function find_matching_brace($str, $openBracePos) {
    $depth = 0;
    $len = strlen($str);
    for ($i = $openBracePos; $i < $len; $i++) {
        if ($str[$i] === '{') {
            $depth++;
        } elseif ($str[$i] === '}') {
            $depth--;
            if ($depth === 0) return $i;
        }
    }
    return -1;
}

/**
 * Substitui o objeto literal que começa em `needle` (ex: "const PROPERTIES = {")
 * pelo JSON fornecido, mantendo tudo o resto do ficheiro intacto.
 */
function splice_js_object($filePath, $needle, $newData) {
    $src = file_get_contents($filePath);
    $pos = strpos($src, $needle);
    if ($pos === false) {
        throw new Exception("Não encontrei \"$needle\" em " . basename($filePath));
    }
    $openBrace = strpos($src, '{', $pos);
    $closeBrace = find_matching_brace($src, $openBrace);
    if ($closeBrace === -1) {
        throw new Exception("Chavetas desequilibradas em " . basename($filePath));
    }
    $json = json_encode($newData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $newSrc = substr($src, 0, $openBrace) . $json . substr($src, $closeBrace + 1);
    file_put_contents($filePath, $newSrc);
}

function regenerate_properties_js($properties) {
    splice_js_object(PROPERTIES_JS, 'const PROPERTIES = {', $properties);
}

function regenerate_translations_js($translations) {
    splice_js_object(I18N_JS, 'var PROPERTY_TRANSLATIONS = {', $translations);
}

function regenerate_amenity_items_js($items) {
    splice_js_object(I18N_JS, 'var AMENITY_ITEMS = {', $items);
}

function regenerate_amenity_categories_js($categories) {
    splice_js_object(I18N_JS, 'var AMENITY_CATEGORIES = {', $categories);
}

/* =========================================================================
   Avaliações de hóspedes
   ========================================================================= */

function load_reviews() {
    if (!file_exists(REVIEWS_JSON)) return [];
    $data = json_decode(file_get_contents(REVIEWS_JSON), true);
    return is_array($data) ? $data : [];
}

function save_reviews($reviews) {
    if (!is_dir(DATA_DIR)) @mkdir(DATA_DIR, 0775, true);
    file_put_contents(REVIEWS_JSON, json_encode($reviews, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

/**
 * Reconstrói js/reviews-data.js só com as avaliações aprovadas, agrupadas
 * por apartamento — é o único ficheiro público, por isso nunca deve conter
 * avaliações pendentes/rejeitadas nem os tokens dos links de convite.
 */
function regenerate_reviews_js($reviews) {
    $bySlug = [];
    foreach ($reviews as $r) {
        if (($r['status'] ?? '') !== 'approved') continue;
        $bySlug[$r['slug']][] = [
            'guestName' => $r['guestName'],
            'rating' => $r['rating'],
            'text' => $r['text'],
            'submittedAt' => $r['submittedAt'],
        ];
    }
    if (!file_exists(REVIEWS_JS)) {
        file_put_contents(REVIEWS_JS, "var REVIEWS = {};\n");
    }
    $src = file_get_contents(REVIEWS_JS);
    if (strpos($src, 'var REVIEWS = {') === false) {
        file_put_contents(REVIEWS_JS, "var REVIEWS = {};\n");
    }
    splice_js_object(REVIEWS_JS, 'var REVIEWS = {', $bySlug);
}

function new_review_token() {
    return bin2hex(random_bytes(16));
}


/**
 * Grava as alterações: atualiza o JSON (fonte de verdade) e reconstrói os
 * ficheiros .js que o site carrega. Chamar sempre depois de mexer nos dados
 * em memória.
 */
function persist_all($properties, $translations, $amenityItems = null, $amenityCategories = null) {
    backup_data();
    save_json(PROPERTIES_JSON, $properties);
    save_json(TRANSLATIONS_JSON, $translations);
    regenerate_properties_js($properties);
    regenerate_translations_js($translations);
    if ($amenityItems !== null) {
        save_json(AMENITY_ITEMS_JSON, $amenityItems);
        regenerate_amenity_items_js($amenityItems);
    }
    if ($amenityCategories !== null) {
        save_json(AMENITY_CATEGORIES_JSON, $amenityCategories);
        regenerate_amenity_categories_js($amenityCategories);
    }
}

/* =========================================================================
   Fotos
   ========================================================================= */

function slug_img_dir($slug) {
    return IMG_DIR . '/' . $slug;
}

/**
 * Redimensiona e volta a gravar como JPEG de qualidade consistente com as
 * fotos já existentes no site (largura 1800px, qualidade 78).
 */
function process_uploaded_image($tmpPath, $destPath) {
    $info = @getimagesize($tmpPath);
    if (!$info) return false;

    switch ($info[2]) {
        case IMAGETYPE_JPEG: $src = imagecreatefromjpeg($tmpPath); break;
        case IMAGETYPE_PNG:  $src = imagecreatefrompng($tmpPath); break;
        case IMAGETYPE_WEBP: $src = imagecreatefromwebp($tmpPath); break;
        default: return false;
    }
    if (!$src) return false;

    $srcW = imagesx($src);
    $srcH = imagesy($src);
    $targetW = 1800;

    if ($srcW > $targetW) {
        $targetH = (int) round($srcH * ($targetW / $srcW));
        $dst = imagecreatetruecolor($targetW, $targetH);
        // fundo branco para PNGs com transparência antes de converter para JPEG
        imagefill($dst, 0, 0, imagecolorallocate($dst, 255, 255, 255));
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $targetW, $targetH, $srcW, $srcH);
    } else {
        $dst = imagecreatetruecolor($srcW, $srcH);
        imagefill($dst, 0, 0, imagecolorallocate($dst, 255, 255, 255));
        imagecopy($dst, $src, 0, 0, 0, 0, $srcW, $srcH);
    }

    $ok = imagejpeg($dst, $destPath, 78);
    imagedestroy($src);
    imagedestroy($dst);
    return $ok;
}

/**
 * Devolve um nome de ficheiro seguro e único dentro da pasta do apartamento,
 * ex: 11-foto.jpg, evitando substituir fotos existentes.
 */
function next_photo_filename($slug, $originalName) {
    $dir = slug_img_dir($slug);
    if (!is_dir($dir)) @mkdir($dir, 0775, true);

    $base = pathinfo($originalName, PATHINFO_FILENAME);
    $base = preg_replace('/[^a-z0-9\-]+/i', '-', strtolower($base));
    $base = trim($base, '-');
    if ($base === '') $base = 'foto';

    // número sequencial a seguir ao maior já existente (NN-*.jpg)
    $max = 0;
    foreach (glob($dir . '/*.*') as $f) {
        if (preg_match('/^(\d+)-/', basename($f), $m)) {
            $max = max($max, (int) $m[1]);
        }
    }
    $n = str_pad((string) ($max + 1), 2, '0', STR_PAD_LEFT);
    return "{$n}-{$base}.jpg";
}

/* =========================================================================
   Utilitários
   ========================================================================= */

function h($s) {
    return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
}

/**
 * Caminho de uma foto para usar em <img src="..."> dentro do painel (que
 * vive em /admin/, um nível abaixo da raiz do site). A maior parte das
 * fotos são caminhos relativos ("img/slug/1.jpg"), mas alguns apartamentos
 * antigos usam URLs completos do Airbnb (https://a0.muscache.com/...) —
 * esses não podem levar "../" à frente.
 */
function admin_img_src($path) {
    $path = (string) $path;
    if ($path === '') return '';
    if (preg_match('#^https?://#i', $path)) return $path;
    return '../' . $path;
}

function redirect_with_message($url, $type, $message) {
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
    header('Location: ' . $url);
    exit;
}

function pop_flash() {
    if (empty($_SESSION['flash'])) return null;
    $f = $_SESSION['flash'];
    unset($_SESSION['flash']);
    return $f;
}
