<?php
/**
 * POST api/reservations.php   (JSON — ver docs/INTEGRACAO-BEDS24-STRIPE.md)
 *   1. valida o pedido e recalcula o preço no servidor (Beds24 offers);
 *   2. cria a reserva no Beds24 em espera ('request') — bloqueia as datas;
 *   3. com Stripe ativo: cria a página de pagamento e devolve checkoutUrl.
 *      A confirmação final chega pelo webhook (api/stripe-webhook.php).
 *      Sem Stripe / sem preço: fica como pedido e a equipa confirma por email.
 *   → 201 { "id", "token", "status": "pending_payment" | "request", "checkoutUrl": url|null }
 *
 * GET api/reservations.php?id=TMH-…&token=…
 *   → { "id", "status", "property", "checkIn", "checkOut", "total", "currency" }
 *   status: pending_payment | confirmed | request | expired | cancelled
 */
require_once __DIR__ . '/lib.php';

api_run(function () {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $r = load_reservation($_GET['id'] ?? '');
        if (!$r || !hash_equals($r['token'], (string) ($_GET['token'] ?? ''))) {
            json_error('not_found', 'Reserva não encontrada.', 404);
        }
        json_out(public_reservation($r));
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_error('invalid_request', 'Método não suportado.', 405);

    $in = json_decode((string) file_get_contents('php://input'), true);
    if (!is_array($in)) json_error('invalid_request', 'Pedido sem JSON.', 400);

    /* ---- 1. Validação ---- */
    $slug = $in['property'] ?? '';
    $property = require_property($slug);
    $nights = require_stay($in['checkIn'] ?? '', $in['checkOut'] ?? '');
    [$adults, $children] = require_guests($property, $in['adults'] ?? 0, $in['children'] ?? 0);

    $guest = $in['guest'] ?? [];
    $name = trim((string) ($guest['name'] ?? ''));
    $email = trim((string) ($guest['email'] ?? ''));
    $phone = trim((string) ($guest['phone'] ?? ''));
    if (mb_strlen($name) < 2 || mb_strlen($name) > 120) json_error('invalid_request', 'Nome inválido.', 400);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) json_error('invalid_request', 'Email inválido.', 400);
    if (!preg_match('/^[0-9 +().-]{6,30}$/', $phone)) json_error('invalid_request', 'Telefone inválido.', 400);

    $extrasIn = $in['extras'] ?? [];
    $extras = ['transfer' => null, 'babyKit' => null];
    if (!empty($extrasIn['transfer'])) {
        $t = $extrasIn['transfer'];
        $extras['transfer'] = [
            'people' => max(1, min(10, (int) ($t['people'] ?? 1))),
            'vehicle' => ($t['vehicle'] ?? '') === 'van' ? 'van' : 'car',
            'flightNumber' => mb_substr(trim((string) ($t['flightNumber'] ?? '')), 0, 20),
            'flightArrival' => mb_substr(trim((string) ($t['flightArrival'] ?? '')), 0, 20),
        ];
    }
    if (!empty($extrasIn['babyKit'])) {
        $extras['babyKit'] = ['quantity' => max(1, min(3, (int) ($extrasIn['babyKit']['quantity'] ?? 1)))];
    }

    $cfg = api_config();
    $r = [
        'id' => new_reservation_id(),
        'token' => bin2hex(random_bytes(16)),
        'status' => 'request',
        'property' => $slug,
        'checkIn' => $in['checkIn'],
        'checkOut' => $in['checkOut'],
        'nights' => $nights,
        'adults' => $adults,
        'children' => $children,
        'guest' => ['name' => $name, 'email' => $email, 'phone' => $phone],
        'extras' => $extras,
        'notes' => mb_substr(trim((string) ($in['notes'] ?? '')), 0, 1000),
        'lang' => in_array($in['lang'] ?? '', ['pt', 'en', 'fr'], true) ? $in['lang'] : 'pt',
        'currency' => $cfg['currency'],
        'total' => null,
        'amountCharged' => null,
        'beds24BookingId' => null,
        'stripeSessionId' => null,
        'createdAt' => date('c'),
    ];

    /* ---- Modo mock: só regista o pedido ---- */
    if (!is_live()) {
        if (array_intersect(stay_nights($r['checkIn'], $r['checkOut']), mock_unavailable($slug))) {
            json_error('unavailable', 'Datas indisponíveis.', 409);
        }
        save_reservation($r);
        send_reservation_emails($r, 'request');
        json_out(['id' => $r['id'], 'token' => $r['token'], 'status' => 'request', 'checkoutUrl' => null], 201);
    }

    /* ---- 2. Preço (sempre calculado aqui) e reserva em espera no Beds24 ---- */
    $roomId = beds24_room_for($slug);
    $r['total'] = beds24_offer_total($roomId, $r['checkIn'], $r['checkOut'], $adults, $children);
    if ($r['total'] === null) json_error('unavailable', 'Datas indisponíveis.', 409);

    $stripeOn = !empty($cfg['stripe']['enabled']);
    $r['beds24BookingId'] = beds24_create_booking($r, $roomId, $stripeOn ? $cfg['beds24']['hold_status'] : 'request');

    /* ---- 3. Pagamento ---- */
    if (!$stripeOn) {
        save_reservation($r);
        send_reservation_emails($r, 'request');
        json_out(['id' => $r['id'], 'token' => $r['token'], 'status' => 'request', 'checkoutUrl' => null], 201);
    }

    $percent = max(1, min(100, (int) ($cfg['stripe']['charge_percent'] ?? 100)));
    $r['amountCharged'] = round($r['total'] * $percent / 100, 2);
    $r['status'] = 'pending_payment';
    try {
        $session = stripe_create_checkout($r, $r['amountCharged'], $property['name'] ?? $slug);
    } catch (Throwable $e) {
        // Sem página de pagamento não se pode segurar as datas.
        beds24_set_booking_status($r['beds24BookingId'], 'cancelled', 'Stripe indisponível: ' . $e->getMessage());
        throw $e;
    }
    $r['stripeSessionId'] = $session['id'];
    save_reservation($r);

    json_out(['id' => $r['id'], 'token' => $r['token'], 'status' => 'pending_payment', 'checkoutUrl' => $session['url']], 201);
});
