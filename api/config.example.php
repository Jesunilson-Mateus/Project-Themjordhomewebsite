<?php
/**
 * API de reservas — TheMajord'Home
 * Modelo de configuração. NO SERVIDOR: copiar para api/config.php e
 * preencher. O api/config.php nunca vai para o git (tem chaves secretas).
 *
 * Ver docs/INTEGRACAO-BEDS24-STRIPE.md.
 */

return [
    // 'mock' → respostas de exemplo, sem Beds24 nem Stripe (para testar o site).
    // 'live' → Beds24 + Stripe a sério.
    'mode' => 'mock',

    // Endereço público do site, sem barra no fim (usado nos links de regresso do Stripe).
    'site_url' => 'https://www.themajordhome.com',

    'currency' => 'EUR',

    'beds24' => [
        'api_base' => 'https://beds24.com/api/v2',
        // Refresh token obtido uma vez a partir de um código de convite
        // (Beds24 → Settings → Apps & Integrations → API). Ver o doc.
        'refresh_token' => '',
        // Estado com que a reserva é criada no Beds24 enquanto o cliente paga
        // (bloqueia as datas). Passa a 'confirmed' quando o Stripe confirma.
        'hold_status' => 'request',
        // Preço "desde X € / noite": o mais baixo dos próximos N dias, guardado
        // em cache durante X horas (para não pedir ao Beds24 a cada visita).
        'price_from_days' => 90,
        'price_from_cache_hours' => 6,
    ],

    'stripe' => [
        // false → sem pagamento online: as reservas ficam como pedido
        // ('request') e a equipa confirma por email.
        'enabled' => true,
        'api_base' => 'https://api.stripe.com/v1',
        'secret_key' => '',        // sk_test_… / sk_live_…
        'webhook_secret' => '',    // whsec_… (do endpoint api/stripe-webhook.php)
        // Percentagem cobrada online (100 = tudo; 30 = sinal de 30%).
        'charge_percent' => 100,
        // Minutos que a página de pagamento fica válida (mínimo do Stripe: 30).
        'checkout_minutes' => 30,
    ],

    'mail' => [
        'from' => 'TheMajord\'Home <resa@themajordhome.com>',
        'team' => 'resa@themajordhome.com',
    ],
];
