<?php
/**
 * Painel de administração — TheMajord'Home
 * Configuração central: caminhos e arranque da sessão.
 */

define('ROOT_DIR', dirname(__DIR__));
define('ADMIN_DIR', __DIR__);
define('DATA_DIR', ROOT_DIR . '/data');
define('IMG_DIR', ROOT_DIR . '/img');

define('PROPERTIES_JSON', DATA_DIR . '/properties.json');
define('TRANSLATIONS_JSON', DATA_DIR . '/translations.json');
define('AMENITY_CATEGORIES_JSON', DATA_DIR . '/amenity-categories.json');
define('AMENITY_ITEMS_JSON', DATA_DIR . '/amenity-items.json');
define('AMENITY_CATALOG_JSON', DATA_DIR . '/amenity-catalog.json');
define('BACKUPS_DIR', DATA_DIR . '/backups');

define('USERS_JSON', ADMIN_DIR . '/users.json');
define('REVIEWS_JSON', DATA_DIR . '/reviews.json');

define('PROPERTIES_JS', ROOT_DIR . '/js/properties-data.js');
define('I18N_JS', ROOT_DIR . '/js/i18n.js');
define('REVIEWS_JS', ROOT_DIR . '/js/reviews-data.js');

// Tamanho máximo por foto enviada (bytes) — 15 MB antes de redimensionar.
define('MAX_UPLOAD_BYTES', 15 * 1024 * 1024);

// Proteção contra força bruta no login: tentativas falhadas máximas por IP
// dentro da janela de tempo, antes de bloquear temporariamente.
define('LOGIN_MAX_ATTEMPTS', 5);
define('LOGIN_WINDOW_SECONDS', 15 * 60);
define('LOGIN_LOCKOUT_SECONDS', 15 * 60);
define('LOGIN_ATTEMPTS_JSON', DATA_DIR . '/login-attempts.json');

// Sessão: nome próprio para não colidir com outras apps no mesmo domínio,
// e cookie restrito (HttpOnly sempre; Secure quando servido por HTTPS).
$tmh_isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (($_SERVER['SERVER_PORT'] ?? null) == 443)
    || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '',
    'secure' => $tmh_isHttps,
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_name('tmh_admin_session');
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

date_default_timezone_set('Europe/Lisbon');
