<?php
/**
 * Sitemap para o Google (servido como /sitemap.xml — regra no .htaccess).
 * Gerado na hora a partir de data/properties.json: inclui as páginas do site
 * e todos os apartamentos ativos. Um apartamento desativado no painel sai do
 * sitemap automaticamente. Submeter em Google Search Console → Sitemaps.
 */

header('Content-Type: application/xml; charset=utf-8');

$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https') ? 'https' : 'http';
$base = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'www.themajordhome.com') . '/';

$propertiesFile = __DIR__ . '/data/properties.json';
$properties = json_decode((string) @file_get_contents($propertiesFile), true) ?: [];

// Páginas fixas: endereço → prioridade
$pages = [
    '' => '1.0',
    'apartments.html' => '0.9',
    'proprietarios.html' => '0.8',
    'servico-gestao.html' => '0.7',
    'servico-concierge.html' => '0.7',
    'servico-limpeza.html' => '0.7',
    'servico-manutencao.html' => '0.7',
    'faq.html' => '0.6',
    'condicoes-gerais.html' => '0.3',
    'legal-notice.html' => '0.2',
];

function lastmod($file) {
    return file_exists($file) ? date('Y-m-d', filemtime($file)) : date('Y-m-d');
}

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

foreach ($pages as $path => $priority) {
    $file = __DIR__ . '/' . ($path === '' ? 'index.html' : $path);
    printf("  <url><loc>%s</loc><lastmod>%s</lastmod><priority>%s</priority></url>\n",
        htmlspecialchars($base . $path), lastmod($file), $priority);
}

$propsModified = lastmod($propertiesFile);
foreach ($properties as $slug => $p) {
    if (isset($p['active']) && $p['active'] === false) continue;   // inativos não aparecem
    printf("  <url><loc>%s</loc><lastmod>%s</lastmod><priority>0.8</priority></url>\n",
        htmlspecialchars($base . 'property.html?p=' . rawurlencode($slug)), $propsModified);
}

echo "</urlset>\n";
