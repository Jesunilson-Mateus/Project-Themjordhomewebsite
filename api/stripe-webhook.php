<?php
/**
 * POST api/stripe-webhook.php — chamado pelo Stripe (não pelo site).
 *   checkout.session.completed → pagamento feito: reserva 'confirmed' no
 *                                Beds24 e emails para a equipa e o hóspede.
 *   checkout.session.expired   → o cliente não pagou a tempo: a reserva em
 *                                espera é cancelada no Beds24 (liberta as datas).
 * Responde 2xx depressa; o Stripe repete o envio se receber erro.
 */
require_once __DIR__ . '/lib.php';

$payload = (string) file_get_contents('php://input');
try {
    $event = stripe_verify_webhook($payload, $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '');
} catch (Throwable $e) {
    error_log('[stripe-webhook] ' . $e->getMessage());
    json_error('invalid_request', 'Assinatura inválida.', 400);
}

api_run(function () use ($event) {
    $session = $event['data']['object'] ?? [];
    $r = load_reservation($session['metadata']['reservation_id'] ?? '');
    if (!$r) json_out(['received' => true, 'ignored' => 'reserva desconhecida']);

    // O Stripe pode repetir eventos: só se age uma vez por estado.
    if ($event['type'] === 'checkout.session.completed' && ($session['payment_status'] ?? '') === 'paid') {
        if ($r['status'] !== 'confirmed') {
            beds24_set_booking_status($r['beds24BookingId'], 'confirmed',
                "Pago no Stripe: {$r['amountCharged']} {$r['currency']} (sessão {$session['id']})");
            $r['status'] = 'confirmed';
            $r['stripePaymentIntent'] = $session['payment_intent'] ?? null;
            save_reservation($r);
            send_reservation_emails($r, 'confirmed');
        }
    } elseif ($event['type'] === 'checkout.session.expired') {
        if ($r['status'] === 'pending_payment') {
            beds24_set_booking_status($r['beds24BookingId'], 'cancelled', 'Pagamento não concluído (sessão Stripe expirou)');
            $r['status'] = 'expired';
            save_reservation($r);
        }
    }
    json_out(['received' => true]);
});
