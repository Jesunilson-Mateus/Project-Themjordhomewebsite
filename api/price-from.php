<?php
/**
 * GET api/price-from.php?property=<slug>[,<slug>…]
 * → { "currency": "EUR", "prices": { "<slug>": 85.0, "<slug>": null, … } }
 * Preço por noite mais baixo dos próximos dias, vindo do Beds24 (para
 * "desde X € / noite"). null → o site mostra "Preço sob consulta".
 * Apartamentos inexistentes ou inativos são ignorados.
 */
require_once __DIR__ . '/lib.php';

api_run(function () {
    $slugs = array_slice(array_unique(array_filter(explode(',', (string) ($_GET['property'] ?? '')))), 0, 100);
    if (!$slugs) json_error('invalid_request', 'Falta o apartamento.', 400);

    $properties = load_site_properties();
    $prices = [];
    foreach ($slugs as $slug) {
        if (!isset($properties[$slug]) || !property_is_active($properties[$slug])) continue;
        $prices[$slug] = price_from_for($slug);
    }
    json_out(['currency' => api_config()['currency'], 'prices' => $prices]);
});
