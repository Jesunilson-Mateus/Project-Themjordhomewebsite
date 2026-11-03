<?php
/**
 * Cliente Beds24 API v2 — TheMajord'Home
 *
 * Documentação: https://beds24.com/api/v2 (Swagger interativo) e
 * https://wiki.beds24.com/index.php/Category:API_V2
 *
 * ⚠ PARA O ENGENHEIRO: os caminhos e parâmetros seguem a documentação v2,
 * mas a FORMA EXATA DAS RESPOSTAS tem de ser confirmada no Swagger com a
 * conta real antes de passar para 'live' (pontos marcados "VERIFICAR").
 * Todas as funções lançam exceção se a resposta não tiver o formato
 * esperado — nunca devolvem dados inventados.
 */

/* =========================================================================
   Autenticação
   1. (uma vez) Beds24 → Settings → Apps & Integrations → API → criar um
      "invite code" com as permissões: read/write bookings, read inventory,
      read properties. O código expira em 24 h.
   2. (uma vez) Trocar o código por um refresh token:
        GET https://beds24.com/api/v2/authentication/setup   header: code: <invite code>
      → guardar "refreshToken" em api/config.php (beds24.refresh_token).
   3. (automático, aqui) O refresh token gera tokens de 24 h:
        GET /authentication/token   header: refreshToken: <refresh token>
      O token é guardado em cache em data/reservations/.beds24-token.json.
   O refresh token expira se não for usado durante 30 dias.
   ========================================================================= */

function beds24_token() {
    $cache = RESERVATIONS_DIR . '/.beds24-token.json';
    $cached = json_decode((string) @file_get_contents($cache), true);
    if ($cached && ($cached['expiresAt'] ?? 0) > time() + 300) {
        return $cached['token'];
    }

    $cfg = api_config()['beds24'];
    if (empty($cfg['refresh_token'])) throw new RuntimeException('Falta beds24.refresh_token em api/config.php');

    $res = beds24_http('GET', '/authentication/token', null, null, ['refreshToken: ' . $cfg['refresh_token']]);
    if (empty($res['token'])) throw new RuntimeException('Beds24: resposta sem token');

    if (!is_dir(RESERVATIONS_DIR)) @mkdir(RESERVATIONS_DIR, 0775, true);
    file_put_contents($cache, json_encode(['token' => $res['token'], 'expiresAt' => time() + (int) ($res['expiresIn'] ?? 86400)]), LOCK_EX);
    return $res['token'];
}

function beds24_http($method, $path, $query = null, $body = null, $headers = null) {
    $cfg = api_config()['beds24'];
    $url = rtrim($cfg['api_base'], '/') . $path . ($query ? '?' . http_build_query($query) : '');
    $headers = $headers ?? ['token: ' . beds24_token()];
    $headers[] = 'Accept: application/json';
    if ($body !== null) $headers[] = 'Content-Type: application/json';

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 20,
    ]);
    if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    $raw = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    if ($raw === false) throw new RuntimeException("Beds24: $err");
    $data = json_decode($raw, true);
    if ($status >= 400 || !is_array($data)) {
        throw new RuntimeException("Beds24 $method $path → HTTP $status: " . substr((string) $raw, 0, 300));
    }
    return $data;
}

/* =========================================================================
   Disponibilidade
   GET /inventory/rooms/availability?roomId=&startDate=&endDate=
   Devolve, por dia, true/false. false = não pode ser noite de estadia
   (mas pode ser dia de check-out se o anterior for true).
   ========================================================================= */

/** @return string[] noites indisponíveis (YYYY-MM-DD) entre $from e $to */
function beds24_unavailable_dates($roomId, $from, $to) {
    $res = beds24_http('GET', '/inventory/rooms/availability', [
        'roomId' => $roomId, 'startDate' => $from, 'endDate' => $to,
    ]);
    // VERIFICAR: formato esperado { data: [ { roomId, availability: { "YYYY-MM-DD": bool, … } } ] }
    $days = $res['data'][0]['availability'] ?? null;
    if (!is_array($days)) throw new RuntimeException('Beds24 availability: formato inesperado');

    $out = [];
    foreach ($days as $date => $open) if (!$open) $out[] = $date;
    return $out;
}

/* =========================================================================
   Preço
   GET /inventory/rooms/offers?roomId=&arrival=&departure=&numAdults=&numChildren=
   Preço calculado pelo Beds24 para as datas e ocupação (inclui as regras
   de preço/estadia mínima configuradas lá).
   ========================================================================= */

/** @return float|null total da estadia, ou null se não houver oferta (indisponível / estadia mínima) */
function beds24_offer_total($roomId, $checkIn, $checkOut, $adults, $children) {
    $res = beds24_http('GET', '/inventory/rooms/offers', [
        'roomId' => $roomId, 'arrival' => $checkIn, 'departure' => $checkOut,
        'numAdults' => $adults, 'numChildren' => $children,
    ]);
    // VERIFICAR: formato esperado { data: [ { roomId, offers: [ { offerId, price, unitsAvailable, … } ] } ] }
    // Se houver várias ofertas (ex.: reembolsável / não reembolsável), decidir
    // qual usar — aqui usa-se a primeira com unidades disponíveis.
    $offers = $res['data'][0]['offers'] ?? null;
    if (!is_array($offers)) throw new RuntimeException('Beds24 offers: formato inesperado');
    foreach ($offers as $o) {
        if (($o['unitsAvailable'] ?? 1) > 0 && isset($o['price'])) return (float) $o['price'];
    }
    return null;
}

/* =========================================================================
   Preço "desde" (página do apartamento e resultados da pesquisa)
   GET /inventory/rooms/calendar?roomId=&startDate=&endDate=&includePrices=true
   Preço por noite configurado no Beds24 para cada período. O site mostra o
   mais baixo dos próximos dias que ainda têm disponibilidade.
   ========================================================================= */

/** @return float|null preço por noite mais baixo entre $from e $to, ou null se não houver */
function beds24_lowest_nightly_price($roomId, $from, $to) {
    $res = beds24_http('GET', '/inventory/rooms/calendar', [
        'roomId' => $roomId, 'startDate' => $from, 'endDate' => $to,
        'includePrices' => 'true', 'includeNumAvail' => 'true',
    ]);
    // VERIFICAR: formato esperado { data: [ { roomId, calendar: [ { from, to, price1, numAvail }, … ] } ] }
    // "price1" é o preço base por noite; se a conta usar outro campo de preço
    // (price2…, preços por ocupação), ajustar aqui.
    $ranges = $res['data'][0]['calendar'] ?? null;
    if (!is_array($ranges)) throw new RuntimeException('Beds24 calendar: formato inesperado');

    $min = null;
    foreach ($ranges as $r) {
        if (isset($r['numAvail']) && (int) $r['numAvail'] < 1) continue;   // noites já ocupadas
        $price = (float) ($r['price1'] ?? 0);
        if ($price > 0 && ($min === null || $price < $min)) $min = $price;
    }
    return $min;
}

/* =========================================================================
   Reservas
   POST /bookings  (array; sem "id" cria, com "id" atualiza)
   ⚠ O Beds24 NÃO calcula o preço de reservas criadas pela API: tem de ir
   no campo "price". Usar allowWebhooks=true se se quiser receber o webhook
   de reservas também para estas.
   ========================================================================= */

/** Cria a reserva no Beds24 (estado $status) e devolve o id do Beds24. */
function beds24_create_booking($r, $roomId, $status) {
    [$first, $last] = array_pad(preg_split('/\s+/', trim($r['guest']['name']), 2), 2, '');
    $booking = [
        'roomId' => $roomId,
        'status' => $status,                 // VERIFICAR valores aceites: confirmed, request, new, cancelled…
        'arrival' => $r['checkIn'],
        'departure' => $r['checkOut'],
        'numAdult' => $r['adults'],
        'numChild' => $r['children'],
        'firstName' => $first,
        'lastName' => $last,
        'email' => $r['guest']['email'],
        'phone' => $r['guest']['phone'],
        'price' => $r['total'],
        'apiReference' => $r['id'],          // a nossa referência (TMH-…)
        'comments' => trim($r['notes'] . "\n" . reservation_extras_text($r['extras'])),
        'lang' => $r['lang'],
    ];
    $res = beds24_http('POST', '/bookings', null, [$booking]);
    // VERIFICAR: formato esperado [ { success: true, new: { id: 123 } } ] ou { success:false, errors:[…] }
    $item = $res[0] ?? null;
    if (empty($item['success']) || empty($item['new']['id'])) {
        throw new RuntimeException('Beds24 POST /bookings falhou: ' . json_encode($item));
    }
    return (int) $item['new']['id'];
}

/** Muda o estado de uma reserva (ex.: request → confirmed / cancelled). */
function beds24_set_booking_status($beds24Id, $status, $note = '') {
    $update = ['id' => (int) $beds24Id, 'status' => $status];
    // TODO (engenheiros): registar também o pagamento do Stripe na reserva
    // (invoice item / payment) para o saldo aparecer pago no Beds24 —
    // ver no Swagger o campo "invoiceItems" de POST /bookings.
    // Nota interna (não "comments", que tem as notas do hóspede e seria substituído).
    // VERIFICAR no Swagger o nome do campo de notas internas da reserva ("notes").
    if ($note !== '') $update['notes'] = $note;
    $res = beds24_http('POST', '/bookings', null, [$update]);
    if (empty($res[0]['success'])) throw new RuntimeException('Beds24 update falhou: ' . json_encode($res[0] ?? null));
}

function reservation_extras_text($extras) {
    $lines = [];
    if (!empty($extras['transfer'])) {
        $t = $extras['transfer'];
        $lines[] = "Transfer: {$t['people']} pessoa(s), {$t['vehicle']}, voo {$t['flightNumber']} {$t['flightArrival']}";
    }
    if (!empty($extras['babyKit'])) $lines[] = "Kit de bebé: {$extras['babyKit']['quantity']}";
    return implode("\n", $lines);
}
