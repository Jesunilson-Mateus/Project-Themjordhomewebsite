<?php
/**
 * Stripe — TheMajord'Home
 * Checkout Session (página de pagamento alojada pelo Stripe) + verificação
 * da assinatura dos webhooks. Sem SDK: pedidos HTTP diretos à API do
 * Stripe (https://docs.stripe.com/api), para não precisar de Composer.
 *
 * Configurar no painel do Stripe (Developers → Webhooks) um endpoint:
 *   https://<site>/api/stripe-webhook.php
 * com os eventos: checkout.session.completed, checkout.session.expired
 * e copiar o "Signing secret" (whsec_…) para api/config.php.
 */

function stripe_http($method, $path, $params = []) {
    $secret = api_config()['stripe']['secret_key'] ?? '';
    if ($secret === '') throw new RuntimeException('Falta stripe.secret_key em api/config.php');

    $base = api_config()['stripe']['api_base'] ?? 'https://api.stripe.com/v1';
    $ch = curl_init(rtrim($base, '/') . $path);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERPWD => $secret . ':',
        CURLOPT_POSTFIELDS => $method === 'GET' ? null : http_build_query($params),
        CURLOPT_TIMEOUT => 20,
    ]);
    $raw = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $data = json_decode((string) $raw, true);
    if ($status >= 400 || !is_array($data)) {
        throw new RuntimeException("Stripe $method $path → HTTP $status: " . ($data['error']['message'] ?? substr((string) $raw, 0, 300)));
    }
    return $data;
}

/**
 * Cria a página de pagamento para a reserva. O valor cobrado é calculado
 * no servidor (nunca vem do browser).
 * @return array ['id' => cs_…, 'url' => https://checkout.stripe.com/…]
 */
function stripe_create_checkout($r, $amount, $propertyName) {
    $cfg = api_config();
    $site = rtrim($cfg['site_url'], '/');
    $back = "$site/reserva.html?id=" . urlencode($r['id']) . '&t=' . urlencode($r['token']);
    $minutes = max(30, (int) ($cfg['stripe']['checkout_minutes'] ?? 30));

    $session = stripe_http('POST', '/checkout/sessions', [
        'mode' => 'payment',
        'customer_email' => $r['guest']['email'],
        'client_reference_id' => $r['id'],
        'locale' => in_array($r['lang'], ['pt', 'en', 'fr'], true) ? $r['lang'] : 'auto',
        'line_items' => [[
            'quantity' => 1,
            'price_data' => [
                'currency' => strtolower($r['currency']),
                'unit_amount' => (int) round($amount * 100),
                'product_data' => [
                    'name' => "$propertyName — {$r['checkIn']} → {$r['checkOut']}",
                ],
            ],
        ]],
        'metadata' => ['reservation_id' => $r['id']],
        'payment_intent_data' => ['metadata' => ['reservation_id' => $r['id']]],
        // +60 s de margem: o Stripe recusa expires_at a menos de 30 min da criação.
        'expires_at' => time() + $minutes * 60 + 60,
        'success_url' => $back,
        'cancel_url' => $back . '&status=cancelled',
    ]);
    return ['id' => $session['id'], 'url' => $session['url']];
}

/**
 * Verifica o cabeçalho Stripe-Signature (HMAC-SHA256 de "timestamp.payload"
 * com o webhook secret) — https://docs.stripe.com/webhooks#verify-manually
 * @return array o evento, ou lança exceção se a assinatura não bater certo
 */
function stripe_verify_webhook($payload, $sigHeader, $tolerance = 300) {
    $secret = api_config()['stripe']['webhook_secret'] ?? '';
    if ($secret === '') throw new RuntimeException('Falta stripe.webhook_secret em api/config.php');

    $timestamp = null;
    $signatures = [];
    foreach (explode(',', (string) $sigHeader) as $part) {
        [$k, $v] = array_pad(explode('=', trim($part), 2), 2, '');
        if ($k === 't') $timestamp = (int) $v;
        if ($k === 'v1') $signatures[] = $v;
    }
    if (!$timestamp || !$signatures) throw new RuntimeException('Stripe-Signature inválido');
    if (abs(time() - $timestamp) > $tolerance) throw new RuntimeException('Stripe webhook fora do prazo');

    $expected = hash_hmac('sha256', $timestamp . '.' . $payload, $secret);
    foreach ($signatures as $sig) {
        if (hash_equals($expected, $sig)) {
            $event = json_decode($payload, true);
            if (!is_array($event)) throw new RuntimeException('Stripe webhook sem JSON');
            return $event;
        }
    }
    throw new RuntimeException('Stripe-Signature não corresponde');
}
