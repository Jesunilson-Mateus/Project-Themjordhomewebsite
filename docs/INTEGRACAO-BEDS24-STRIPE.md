# Integração Beds24 + Stripe — guia para quem vai ligar

O site já está preparado para as reservas reais. Falta **ligar as contas**
(Beds24 e Stripe), **confirmar 4 respostas da API do Beds24** e **mudar um
interruptor**. Este documento diz exatamente o quê e onde.

> Estado atual: `mode: 'mock'` — o site funciona sem servidor, com
> disponibilidade de exemplo, sem preços e sem pagamento.

---

## 1. Como funciona

```
 Browser (site estático)                 Servidor PHP (api/)                     Serviços
 ───────────────────────                 ───────────────────                     ────────
 calendário ── GET availability.php ───▶ Beds24 /inventory/rooms/availability ─▶ Beds24
 pesquisa   ── GET search.php ─────────▶ (idem, por apartamento)
 resumo     ── GET quote.php ──────────▶ Beds24 /inventory/rooms/offers
 confirmar  ── POST reservations.php ──▶ 1. preço (offers, calculado no servidor)
                                         2. POST /bookings  status "request"  ──▶ Beds24 (bloqueia as datas)
                                         3. Checkout Session  ─────────────────▶ Stripe
            ◀── { checkoutUrl } ─────────
 redireciona para o Stripe ─────────────────────────────────────────────────────▶ Stripe (paga)
                                         stripe-webhook.php ◀── checkout.session.completed ── Stripe
                                           → POST /bookings  status "confirmed" ─▶ Beds24
                                           → emails (equipa + hóspede)
 reserva.html ── GET reservations.php ─▶ estado: pending_payment → confirmed
```

- **O preço nunca vem do browser.** É sempre recalculado no servidor (Beds24).
- **As datas ficam bloqueadas enquanto o cliente paga** (reserva em `request`
  no Beds24). Se o cliente não pagar dentro do prazo (30 min), o Stripe envia
  `checkout.session.expired` e a reserva é cancelada no Beds24.
- **A reserva só é confirmada pelo webhook do Stripe**, nunca pela página de
  regresso (que só mostra o estado).
- **Transfer e kit de bebé** são pagos em dinheiro no local: vão para os
  comentários da reserva no Beds24 e no email da equipa, não são cobrados online.

### Ficheiros

| Ficheiro | O quê |
|---|---|
| `js/booking-config.js` | **Interruptor** `mode: 'mock' \| 'live'` e `apiBase`. |
| `js/booking-api.js` | Única camada do browser que fala com a API (contrato abaixo). Tem também o modo mock. |
| `js/booking-calendar.js`, `js/booking-wizard.js`, `js/search-results.js`, `js/booking-result.js` | Usam só a `BookingAPI`. |
| `reserva.html` | Página para onde o Stripe devolve o cliente. |
| `api/config.example.php` | Modelo da configuração → copiar para **`api/config.php`** (fora do git). |
| `api/beds24.php` | Cliente Beds24 v2 (autenticação pronta; 4 respostas a confirmar — marcadas `VERIFICAR`). |
| `api/stripe.php` | Checkout Session + verificação da assinatura do webhook (pronto). |
| `api/*.php` (resto) | Endpoints: `availability`, `search`, `quote`, `reservations`, `stripe-webhook`. |
| `data/beds24-rooms.json` | **Mapa apartamento do site → `roomId` do Beds24** (60 entradas, por preencher). |
| `data/reservations/` | Criada automaticamente. Reservas + cache do token. Fora do git, protegida por `data/.htaccess`. |

---

## 2. Passos para ligar

### 2.1 Servidor
- PHP 8.1+ com **curl** e **mbstring** (o mesmo servidor do painel `admin/`).
- **Não funciona no Netlify** (só ficheiros estáticos). Tem de ser o alojamento com PHP.
- Apache: os `.htaccess` de `api/` e `data/` já bloqueiam o acesso a
  `config.php`, bibliotecas e reservas. **Em nginx** é preciso replicar estas
  regras (`deny` para `/data/` e para `api/(lib|beds24|stripe|config).php`).
- O PHP tem de poder escrever em `data/reservations/`.

### 2.2 Beds24
1. Beds24 → *Settings → Apps & Integrations → API* → criar um **invite code**
   com permissões de leitura de inventário/propriedades e leitura/escrita de
   reservas. Expira em 24 h.
2. Trocar o código por um **refresh token** (uma vez):
   `GET https://beds24.com/api/v2/authentication/setup` com o cabeçalho `code: <invite code>`
   (confirmar no Swagger se é GET ou POST).
3. Pôr o refresh token em `api/config.php` → `beds24.refresh_token`.
   O resto (tokens de 24 h, cache) é automático. ⚠ O refresh token expira se
   não for usado durante 30 dias.
4. Preencher **`data/beds24-rooms.json`** com o `roomId` (e `propertyId`) de
   cada apartamento. Os IDs aparecem no painel do Beds24 e em `GET /properties`
   (com os quartos incluídos — ver o parâmetro no Swagger).
5. **Confirmar no Swagger** (https://beds24.com/api/v2) com a conta real os
   pontos `VERIFICAR` em `api/beds24.php`:
   - formato de `GET /inventory/rooms/availability`;
   - formato de `GET /inventory/rooms/offers` e qual oferta usar se houver várias;
   - resposta de `POST /bookings` (id da reserva criada) e estados aceites
     (`request`, `confirmed`, `cancelled`);
   - campo de notas internas usado ao confirmar (`notes`).
6. (Recomendado) Registar o pagamento do Stripe na reserva do Beds24
   (`invoiceItems`) para o saldo aparecer pago — `TODO` em `beds24_set_booking_status()`.

### 2.3 Stripe
1. Chave secreta (`sk_test_…` para testar, depois `sk_live_…`) → `stripe.secret_key`.
2. Stripe → *Developers → Webhooks* → endpoint
   `https://<site>/api/stripe-webhook.php` com os eventos
   **`checkout.session.completed`** e **`checkout.session.expired`** →
   copiar o *signing secret* (`whsec_…`) para `stripe.webhook_secret`.
3. `stripe.charge_percent`: 100 = cobra tudo; 30 = sinal de 30 %.
4. `stripe.enabled = false` → sem pagamento online: as reservas ficam como
   pedido (`request`) no Beds24 e a equipa confirma por email.

### 2.4 Ligar
1. `api/config.php`: `mode => 'live'`, `site_url` correto.
2. `js/booking-config.js`: `mode: 'live'`.
3. Atualizar o texto `property.finePrint` em `js/i18n.js` (ainda diz que os
   preços em tempo real "chegam em breve").
4. Testar com chaves `sk_test_` e cartão `4242 4242 4242 4242` antes de passar às chaves live.

### 2.5 Antes de produção (a decidir pelos engenheiros)
- **Pesquisa** (`api/search.php`): hoje faz 1 pedido ao Beds24 por apartamento
  (60 por pesquisa). O limite do Beds24 é ~100 créditos / 5 min por conta →
  usar um pedido com vários `roomId` ou cache de ~10 min.
- **Emails**: `send_reservation_emails()` usa `mail()` do PHP — trocar por SMTP
  ou serviço transacional para não ir para spam.
- **Anti-spam** no `POST reservations.php` (limite por IP / captcha), porque
  cada pedido cria uma reserva em espera no Beds24.
- **Política de cancelamento / reembolsos**: hoje não há reembolsos automáticos.
- **Webhooks do Beds24**: não são necessários (a disponibilidade é lida em
  tempo real), mas podem servir para avisar de cancelamentos vindos de outros canais.
- **Alternativa mais simples**: o Beds24 tem integração nativa com o Stripe e
  motor de reservas próprio. Em vez desta API, o botão podia levar ao motor do
  Beds24 — perde-se o assistente do site, mas não é preciso servidor.

---

## 3. Contrato da API (o que o site espera)

Datas sempre `YYYY-MM-DD`. Erros sempre:
`{ "error": { "code": "...", "message": "..." } }`

| code | HTTP | quando |
|---|---|---|
| `invalid_request` | 400 | parâmetros em falta/inválidos |
| `capacity` | 400 | mais hóspedes do que o apartamento permite |
| `unavailable` | 409 | datas ocupadas / sem oferta |
| `not_found` | 404 | reserva inexistente ou token errado |
| `server` | 500 | erro interno (detalhes só no log do servidor) |

### `GET api/availability.php?property=<slug>&from=&to=`
```json
{ "property": "so-gracy-porto", "unavailable": ["2026-12-24", "2026-12-25"], "minStay": 1 }
```
`unavailable` = noites que não podem ser reservadas.

### `GET api/search.php?checkIn=&checkOut=&adults=&children=`
```json
{ "available": ["fabrica-no-jardim", "casa-bonfim"] }
```

### `GET api/quote.php?property=&checkIn=&checkOut=&adults=&children=`
```json
{ "property": "so-gracy-porto", "currency": "EUR", "nights": 3, "total": 345.5 }
```
`total: null` → sem preço online (o site mostra "preço confirmado por email").

### `POST api/reservations.php`
```json
{
  "property": "so-gracy-porto",
  "checkIn": "2026-12-01", "checkOut": "2026-12-04",
  "adults": 2, "children": 0,
  "guest": { "name": "Maria da Silva", "email": "maria@example.com", "phone": "+351 910 000 000" },
  "extras": {
    "transfer": { "people": 2, "vehicle": "car", "flightNumber": "TP1234", "flightArrival": "2026-12-01T14:30" },
    "babyKit": { "quantity": 1 }
  },
  "notes": "Chegada tarde",
  "lang": "pt"
}
```
→ `201`
```json
{ "id": "TMH-261201-A1B2C3", "token": "…", "status": "pending_payment", "checkoutUrl": "https://checkout.stripe.com/…" }
```
Com `checkoutUrl` o site redireciona; sem ele (`status: "request"`) mostra "pedido enviado".

### `GET api/reservations.php?id=&token=`
```json
{ "id": "TMH-…", "status": "confirmed", "property": "so-gracy-porto", "checkIn": "2026-12-01", "checkOut": "2026-12-04", "total": 345.5, "currency": "EUR" }
```
`status`: `pending_payment` · `confirmed` · `request` · `expired` · `cancelled`

### `POST api/stripe-webhook.php`
Só para o Stripe. Verifica o cabeçalho `Stripe-Signature` (rejeita
assinaturas erradas e eventos com mais de 5 min). É idempotente: eventos
repetidos não voltam a alterar o Beds24 nem a enviar emails.

---

## 4. Testar sem contas reais

- **Só o site**: `js/booking-config.js` em `mock` — não precisa de servidor.
- **Site + API**: `js/booking-config.js` em `live` e `api/config.php` em
  `mock` → o site fala com o PHP, que responde com dados de exemplo
  (as mesmas datas ocupadas que o modo mock do browser).
  ```
  php -S 127.0.0.1:8000 -t .
  ```
- **Fluxo live com serviços simulados**: `beds24.api_base` e `stripe.api_base`
  em `api/config.php` podem apontar para servidores falsos (ou para o
  [`stripe-mock`](https://github.com/stripe/stripe-mock) oficial). Foi assim
  que este fluxo foi testado: preço → reserva em espera → Checkout → webhook
  pago → reserva confirmada, incluindo webhook repetido e assinatura falsa.
- **Webhooks do Stripe em local**: `stripe listen --forward-to localhost:8000/api/stripe-webhook.php`.

Referências: [Beds24 API v2](https://beds24.com/api/v2) ·
[wiki Beds24 API V2](https://wiki.beds24.com/index.php/Category:API_V2) ·
[Stripe Checkout](https://docs.stripe.com/payments/checkout) ·
[Stripe webhooks](https://docs.stripe.com/webhooks)
