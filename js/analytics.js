/* =========================================================================
   THEMAJORD'HOME — Google Analytics 4 e Google Ads

   IDs em js/analytics-config.js (vazios = nada é carregado).

   Consentimento (RGPD + Consent Mode v2 do Google):
   - por omissão tudo fica recusado (ad_storage, ad_user_data,
     ad_personalization, analytics_storage = 'denied');
   - o script do Google (gtag.js) só é carregado depois de o visitante
     aceitar no aviso de cookies (window.TMHConsent, js/cookie-consent.js);
   - se aceitar mais tarde, carrega nesse momento; se recusar depois de ter
     aceitado, o consentimento passa a 'denied'.

   Conversão: reserva.html chama TMHAnalytics.bookingConversion(reserva)
   quando a reserva fica 'confirmed' (pagamento recebido pelo Stripe).
   Envia a conversão do Google Ads e o evento 'purchase' do GA4, uma só vez
   por reserva.
   ========================================================================= */

(function () {
  'use strict';

  var cfg = window.ANALYTICS_CONFIG || {};
  var ids = [cfg.ga4Id, cfg.adsId].filter(Boolean);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function consent(granted) {
    var v = granted ? 'granted' : 'denied';
    return { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v };
  }

  gtag('consent', 'default', consent(false));

  var loaded = false;
  function load() {
    if (loaded || !ids.length) return;
    loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ids[0]);
    document.head.appendChild(s);
    gtag('js', new Date());
    ids.forEach(function (id) { gtag('config', id); });
  }

  function accepted() {
    return !!(window.TMHConsent && window.TMHConsent.isAccepted());
  }

  function apply(isAccepted) {
    gtag('consent', 'update', consent(isAccepted));
    if (isAccepted) load();
  }

  if (accepted()) apply(true);
  if (window.TMHConsent && typeof window.TMHConsent.onChange === 'function') {
    window.TMHConsent.onChange(function (status) { apply(status === 'accepted'); });
  }

  window.TMHAnalytics = {
    enabled: ids.length > 0,

    /** Reserva paga (estado 'confirmed'): conversão Google Ads + 'purchase' GA4. */
    bookingConversion: function (r) {
      if (!ids.length || !r || !r.id || !accepted()) return;
      var key = 'tmh_conversion_' + r.id;
      try { if (localStorage.getItem(key)) return; } catch (e) {}

      var value = Number(r.total) || 0;
      var currency = r.currency || 'EUR';
      if (cfg.adsId && cfg.adsConversionLabel) {
        gtag('event', 'conversion', {
          send_to: cfg.adsId + '/' + cfg.adsConversionLabel,
          value: value, currency: currency, transaction_id: r.id
        });
      }
      if (cfg.ga4Id) {
        gtag('event', 'purchase', {
          transaction_id: r.id, value: value, currency: currency,
          items: [{ item_id: r.property, item_name: r.property, quantity: 1, price: value }]
        });
      }
      try { localStorage.setItem(key, '1'); } catch (e) {}
    }
  };
})();
