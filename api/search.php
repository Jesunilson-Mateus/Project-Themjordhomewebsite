<?php
/**
 * GET api/search.php?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&adults=2&children=0
 * → { "available": ["slug", …] }
 * Apartamentos com capacidade suficiente e todas as noites livres.
 */
require_once __DIR__ . '/lib.php';

api_run(function () {
    $checkIn = $_GET['checkIn'] ?? '';
    $checkOut = $_GET['checkOut'] ?? '';
    require_stay($checkIn, $checkOut);
    $guests = max(1, (int) ($_GET['adults'] ?? 1)) + max(0, (int) ($_GET['children'] ?? 0));
    $nights = stay_nights($checkIn, $checkOut);
    $lastNight = end($nights);

    $available = [];
    foreach (load_site_properties() as $slug => $p) {
        if (!property_is_active($p) || (int) ($p['guests'] ?? 0) < $guests) continue;
        if (is_live()) {
            // TODO (engenheiros): com 60 apartamentos isto são 60 pedidos ao
            // Beds24 por pesquisa (limite: 100 créditos / 5 min por conta).
            // Antes de ir para produção, trocar por um único pedido com vários
            // roomId, ou por uma cache (ex.: 10 min) — ver o doc.
            try {
                $busy = beds24_unavailable_dates(beds24_room_for($slug), $checkIn, $lastNight);
            } catch (Throwable $e) {
                error_log('[api/search] ' . $e->getMessage());
                continue;
            }
        } else {
            $busy = mock_unavailable($slug, $checkIn, $lastNight);
        }
        if (!array_intersect($nights, $busy)) $available[] = $slug;
    }
    json_out(['available' => $available]);
});
