# Google Ads, Analytics e publicação no Google — guia para quem vai ligar

O código está preparado: falta **criar as contas, preencher os IDs e submeter o
site no Google**. Nada do Google nem do Elfsight é carregado enquanto os IDs
estiverem vazios.

Ordem recomendada: publicar o site (ver [`DEPLOY.md`](../DEPLOY.md)) → ligar
Beds24 e Stripe ([`INTEGRACAO-BEDS24-STRIPE.md`](INTEGRACAO-BEDS24-STRIPE.md))
→ este guia.

---

## 1. O que já está no código

| Ficheiro | O quê |
|---|---|
| `js/analytics-config.js` | **Os IDs a preencher**: `ga4Id`, `adsId`, `adsConversionLabel` e `elfsightReviewsId` (avaliações do Google). |
| `js/analytics.js` | Carrega o Google (gtag.js) e liga-o ao aviso de cookies com o **Consent Mode v2**. Envia a conversão de reserva. Incluído em todas as páginas. |
| `js/cookie-consent.js` | Aviso de cookies (Aceitar / Rejeitar), com `window.TMHConsent`. |
| `js/google-reviews.js` | Avaliações do Google na página inicial (widget Elfsight), por baixo de "O que dizem os hóspedes"; só carrega depois de o visitante aceitar os cookies. |
| `js/booking-result.js` | Na página de regresso do pagamento (`reserva.html`), chama `TMHAnalytics.bookingConversion()` quando a reserva fica `confirmed`. |
| `robots.txt` | Bloqueia `/admin/`, `/api/`, `/data/`, páginas de resultado e de reserva; indica o sitemap. |
| `sitemap.php` → `/sitemap.xml` | Sitemap gerado na hora: páginas do site + todos os apartamentos **ativos** (um apartamento desativado no painel sai sozinho). |
| `.htaccess` | `/sitemap.xml`; redirecionamentos 301 dos endereços do site antigo (`/lang-pt/…`, `apartamentos.php`, …); regra HTTPS + www **comentada**. |
| `favicon.svg` | Ícone do site (logótipo), ligado em todas as páginas. |
| `<meta name="description">` | Em todas as páginas. Na página de cada apartamento é atualizada com o subtítulo e a zona. |

### Como funciona o consentimento

- Por omissão tudo fica **recusado** (`ad_storage`, `ad_user_data`,
  `ad_personalization`, `analytics_storage` = `denied`).
- O `gtag.js` **só é carregado depois de o visitante aceitar** os cookies
  (modo "básico" do Consent Mode). Se aceitar mais tarde, carrega nesse
  momento; se recusar depois, o consentimento passa a `denied`.
- Para usar o modo "avançado" (carregar sempre, com pings sem cookies antes
  do consentimento), alterar `apply()`/`load()` em `js/analytics.js` — é uma
  decisão de privacidade da empresa, a validar com quem trata do RGPD.

### Conversão "Reserva"

Quando o Stripe confirma o pagamento (webhook) e o cliente volta a
`reserva.html`, o site envia **uma vez por reserva**:

- Google Ads: `conversion` com `send_to: AW-…/<etiqueta>`, `value`, `currency`, `transaction_id`;
- GA4: `purchase` com o mesmo valor e id.

Só funciona com reservas pagas online (Stripe ligado). Pedidos de reserva sem
pagamento (`request`) não contam como conversão.

---

## 2. Passos — Google Analytics 4 e Google Ads

1. **GA4**: o site antigo já usa a propriedade `G-R9MSJV8KK4`. Para manter o
   histórico, usar esse ID em `ga4Id` (e confirmar que o fluxo de dados Web é
   `https://www.themajordhome.com`). Se a empresa preferir uma propriedade nova,
   criá-la em analytics.google.com e copiar o **ID de medição** (`G-…`).
2. Na conta **Google Ads**: Objetivos → Conversões → Nova ação de conversão →
   Website → configurar manualmente:
   - categoria **Compra**, nome "Reserva";
   - valor: "usar valores diferentes para cada conversão" (o site envia o total);
   - contagem: **uma**.
   Copiar o **ID da etiqueta** (`AW-…`) para `adsId` e a **etiqueta de
   conversão** (o texto depois da `/` em `send_to`) para `adsConversionLabel`.
3. Ligar o GA4 ao Google Ads (Administrador do GA4 → Ligações de produtos).
4. Publicar, abrir o site, **aceitar os cookies** e confirmar com o
   **Tag Assistant** (tagassistant.google.com) que a etiqueta dispara e que o
   consentimento muda para `granted`.
5. Fazer uma reserva de teste paga (Stripe em modo teste) e confirmar a
   conversão no Tag Assistant / em "Diagnóstico" da ação de conversão.

---

## 3. Passos — publicação no Google (Search Console)

1. Com o certificado HTTPS instalado, **ativar** no `.htaccess` a regra
   "Endereço canónico" (tirar os `#`), para todo o tráfego ir para
   `https://www.themajordhome.com/`.
2. **Google Search Console** (search.google.com/search-console): adicionar a
   propriedade **de domínio** `themajordhome.com` e verificar com o registo
   TXT no DNS.
3. Sitemaps → submeter `https://www.themajordhome.com/sitemap.xml`.
4. Inspeção de URL → pedir indexação da página inicial e de alguns apartamentos.
5. Confirmar os redirecionamentos do site antigo (ex.: abrir
   `/lang-pt/index.php` → deve ir para `/`). Se houver endereços antigos que
   apareçam no Search Console como "não encontrados", acrescentar a regra no
   `.htaccess`, na secção "Endereços do site antigo".
6. **Perfil da Empresa no Google** (business.google.com): confirmar a morada,
   o telefone e o site, e ligar ao Google Ads se houver campanhas locais.

---

## 4. Avaliações do Google (Elfsight)

O site antigo mostra as avaliações do Perfil da Empresa no Google com um widget
**Elfsight** ("Google Reviews", conta da TheMajord'Home). O site novo tem o
espaço preparado na página inicial, mas desligado.

1. Em `js/analytics-config.js`, preencher `elfsightReviewsId` com o ID do widget
   do site antigo: `7cde6675-7bac-4745-a0f5-702a9bc66652` (é o código que aparece depois de
   `elfsight-app-`).
2. Na conta Elfsight: confirmar o plano (o gratuito tem limite de visualizações
   e mostra a marca Elfsight), autorizar o domínio do site novo se houver
   restrição de domínios e escolher os filtros (ex.: só 4 e 5 estrelas).
3. Acrescentar o Elfsight à `politica-privacidade.html` (serviço externo que
   carrega as avaliações e as fotos dos autores).

Comportamento: com o campo vazio, a secção não aparece. Com o ID preenchido, o
widget só é carregado depois de o visitante aceitar os cookies; antes disso
aparece uma nota com o botão "Gerir cookies".

---

## 5. Antes de lançar campanhas

- **Política de privacidade e cookies**: `politica-privacidade.html` (PT/EN/FR), ligada
  no rodapé e no aviso de cookies. Descreve o GA4, o Google Ads, o Stripe e os cookies;
  se forem acrescentadas outras ferramentas, atualizá-la.
- Confirmar que as páginas de aterragem dos anúncios (ex.: um apartamento ou
  a coleção) carregam bem no telemóvel.
- As campanhas, orçamentos e palavras-chave são decididos com a TheMajord'Home.
