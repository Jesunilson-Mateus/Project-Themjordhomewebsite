<?php
/**
 * GET api/availability.php?property=<slug>&from=YYYY-MM-DD&to=YYYY-MM-DD
 * → { "property": "...", "unavailable": ["YYYY-MM-DD", …], "minStay": 1 }
 * "unavailable" = noites que não podem ser reservadas (o calendário bloqueia-as).
 */
require_once __DIR__ . '/lib.php';

api_run(function () {
    $slug = $_GET['property'] ?? '';
    require_property($slug);
    $from = $_GET['from'] ?? date('Y-m-d');
    $to = $_GET['to'] ?? date('Y-m-d', strtotime('+18 months'));
    if (!valid_iso_date($from) || !valid_iso_date($to) || $to < $from) {
        json_error('invalid_request', 'Intervalo de datas inválido.', 400);
    }

    $unavailable = is_live()
        ? beds24_unavailable_dates(beds24_room_for($slug), $from, $to)
        : mock_unavailable($slug, $from, $to);

    json_out(['property' => $slug, 'unavailable' => array_values($unavailable), 'minStay' => 1]);
});
