<?php
/**
 * GET api/quote.php?property=<slug>&checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&adults=2&children=0
 * → { "property", "currency": "EUR", "nights": 3, "total": 420.00 }
 *   "total": null → sem preço online (o site mostra "confirmado por email").
 * Erro 409 "unavailable" se as datas não estiverem livres.
 */
require_once __DIR__ . '/lib.php';

api_run(function () {
    $slug = $_GET['property'] ?? '';
    $property = require_property($slug);
    $checkIn = $_GET['checkIn'] ?? '';
    $checkOut = $_GET['checkOut'] ?? '';
    $nights = require_stay($checkIn, $checkOut);
    [$adults, $children] = require_guests($property, $_GET['adults'] ?? 1, $_GET['children'] ?? 0);

    $total = null;
    if (is_live()) {
        $total = beds24_offer_total(beds24_room_for($slug), $checkIn, $checkOut, $adults, $children);
        if ($total === null) json_error('unavailable', 'Datas indisponíveis.', 409);
    } elseif (array_intersect(stay_nights($checkIn, $checkOut), mock_unavailable($slug))) {
        json_error('unavailable', 'Datas indisponíveis.', 409);
    }

    json_out([
        'property' => $slug,
        'currency' => api_config()['currency'],
        'nights' => $nights,
        'total' => $total,
    ]);
});
