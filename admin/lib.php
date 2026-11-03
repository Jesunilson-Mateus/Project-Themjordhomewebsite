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
    file_put_contents(USERS_JSON, json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE));
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

/* JSON formatado como o resto dos dados. Bytes que não são UTF-8 válido
   (ex.: texto colado de outra codificação) passam a "�" — sem isto o
   json_encode falhava e o ficheiro ficava vazio. */
function encode_json($data) {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    if ($json === false) {
        throw new Exception('Não foi possível gravar os dados: ' . json_last_error_msg());
    }
    return $json;
}

function save_json($path, $data) {
    file_put_contents($path, encode_json($data));
}

function load_properties() { return load_json(PROPERTIES_JSON); }

/* Ativo / inativo: um apartamento sem o campo "active" está ativo. Só se
   grava "active": false — os ativos ficam sem o campo, como sempre estiveram.
   Inativos desaparecem do site (coleção, pesquisa, mapa, reservas). */
function property_is_active($prop) {
    return ($prop['active'] ?? true) !== false;
}

/* =========================================================================
   Modo manutenção (ver .htaccess na raiz e manutencao.html)
   ========================================================================= */

/** null se desligado; senão ['since' => ISO, 'by' => utilizador]. */
function maintenance_status() {
    if (!file_exists(MAINTENANCE_FLAG)) return null;
    $data = json_decode((string) @file_get_contents(MAINTENANCE_FLAG), true);
    return is_array($data) ? $data : ['since' => null, 'by' => null];
}

function set_maintenance($on) {
    if ($on) {
        file_put_contents(MAINTENANCE_FLAG, json_encode(['since' => date('c'), 'by' => current_user()]));
    } elseif (file_exists(MAINTENANCE_FLAG)) {
        unlink(MAINTENANCE_FLAG);
    }
}

function active_badge($prop) {
    return property_is_active($prop)
        ? '<span class="status-badge status-active">Ativo</span>'
        : '<span class="status-badge status-inactive">Inativo</span>';
}

function set_property_active(&$prop, $active) {
    if ($active) {
        unset($prop['active']);
    } else {
        $prop['active'] = false;
    }
}
function load_translations() { return load_json(TRANSLATIONS_JSON); }
function load_amenity_categories() { return load_json(AMENITY_CATEGORIES_JSON); }
function load_amenity_items() { return load_json(AMENITY_ITEMS_JSON); }

/**
 * Guarda uma cópia de segurança dos dados atuais antes de qualquer alteração,
 * para se puder recuperar caso algo corra mal: todos os data/*.json
 * (apartamentos, traduções, comodidades, galerias, avaliações…) e as contas
 * do painel, em data/backups/AAAA-MM-DD_HHMMSS/. As fotos não são copiadas
 * (apagar uma foto no painel só a retira do site; o ficheiro fica em img/).
 */
function backup_data() {
    if (!is_dir(BACKUPS_DIR)) {
        @mkdir(BACKUPS_DIR, 0775, true);
    }
    $stamp = date('Y-m-d_His');
    $dir = BACKUPS_DIR . '/' . $stamp;
    @mkdir($dir, 0775, true);
    foreach (glob(DATA_DIR . '/*.json') as $file) {
        if (basename($file) === 'login-attempts.json') continue;   // registo técnico, sem valor
        copy($file, $dir . '/' . basename($file));
    }
    if (file_exists(USERS_JSON)) copy(USERS_JSON, $dir . '/users.json');

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

/* Ignora chavetas dentro de strings (ex.: um texto com "{"), como o
   findMatchingBrace do scripts/sync-data.js. */
function find_matching_brace($str, $openBracePos) {
    $depth = 0;
    $quote = null;
    $len = strlen($str);
    for ($i = $openBracePos; $i < $len; $i++) {
        $c = $str[$i];
        if ($quote !== null) {
            if ($c === '\\') $i++;
            elseif ($c === $quote) $quote = null;
            continue;
        }
        if ($c === '"' || $c === "'" || $c === '`') {
            $quote = $c;
        } elseif ($c === '{') {
            $depth++;
        } elseif ($c === '}') {
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
    $json = encode_json($newData);
    // Mesmas quebras de linha do ficheiro (igual a scripts/sync-data.js), para
    // não deixar o ficheiro com quebras misturadas.
    if (strpos($src, "\r\n") !== false) $json = str_replace("\n", "\r\n", $json);
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
   Galerias das páginas de serviços (servico-*.html, secção "Em imagens")
   data/service-galleries.json é a fonte de verdade; ao gravar, a galeria é
   reescrita dentro do HTML da página, entre
   <div class="service-gallery reveal"> e o </div> seguinte.
   O scripts/sync-data.js gera exatamente o mesmo HTML — se mudares o
   formato aqui, muda-o lá também.
   ========================================================================= */

function load_service_galleries() { return load_json(SERVICE_GALLERIES_JSON); }

function service_gallery_html($photos, $eol) {
    $lines = [];
    foreach ($photos as $p) {
        $lines[] = '      <figure><img src="' . h($p['src']) . '" alt="' . h($p['alt'] ?? '')
            . '" loading="lazy" onerror="this.closest(\'figure\').remove()"><figcaption>'
            . h($p['caption'] ?? '') . '</figcaption></figure>';
    }
    return implode($eol, $lines);
}

function regenerate_service_page($service) {
    $path = ROOT_DIR . '/' . basename($service['page']);
    $src = @file_get_contents($path);
    if ($src === false) throw new Exception('Não encontrei ' . basename($path));

    $open = '<div class="service-gallery reveal">';
    $start = strpos($src, $open);
    if ($start === false) throw new Exception('Não encontrei a galeria em ' . basename($path));
    $start += strlen($open);
    $end = strpos($src, '</div>', $start);
    if ($end === false) throw new Exception('Galeria sem fecho em ' . basename($path));
    // mantém a indentação da linha do </div>
    $lineStart = strrpos(substr($src, 0, $end), "\n");
    $indent = substr($src, $lineStart + 1, $end - $lineStart - 1);
    $eol = strpos($src, "\r\n") !== false ? "\r\n" : "\n";

    $body = $service['photos'] ? $eol . service_gallery_html($service['photos'], $eol) : '';
    $newSrc = substr($src, 0, $start) . $body . $eol . $indent . substr($src, $end);
    file_put_contents($path, $newSrc);
}

function persist_service_galleries($galleries, $changedKey) {
    backup_data();
    save_json(SERVICE_GALLERIES_JSON, $galleries);
    regenerate_service_page($galleries[$changedKey]);
}

/* =========================================================================
   Perguntas frequentes (faq.html)
   data/faq.json é a fonte de verdade; js/faq-data.js tem a cópia que a
   página lê. Cada secção ("guests", "owners") tem um título e uma lista de
   perguntas {q: {pt,en,fr}, a: {pt,en,fr}, draft}. As perguntas com
   "draft": true ficam "a confirmar" e não aparecem no site.
   ========================================================================= */

function load_faq() { return load_json(FAQ_JSON); }

function persist_faq($faq) {
    backup_data();
    save_json(FAQ_JSON, $faq);
    splice_js_object(FAQ_JS, 'var FAQ = {', $faq);
}

function faq_draft_count($faq) {
    $n = 0;
    foreach ($faq as $section) {
        foreach ($section['items'] ?? [] as $item) {
            if (!empty($item['draft'])) $n++;
        }
    }
    return $n;
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
    backup_data();
    file_put_contents(REVIEWS_JSON, json_encode($reviews, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE));
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
