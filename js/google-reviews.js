/* =========================================================================
   THEMAJORD'HOME — Avaliações do Google (widget Elfsight)

   Preparado, mas desligado: só aparece quando js/analytics-config.js tiver
   `elfsightReviewsId` preenchido (ver docs/GOOGLE-ADS-SEO.md, secção 4).

   O widget é de um serviço externo (Elfsight), que carrega as avaliações do
   Perfil da Empresa no Google. Por isso só é carregado depois de o visitante
   aceitar os cookies (window.TMHConsent, js/cookie-consent.js). Antes disso,
   a secção mostra uma nota com um botão que abre o aviso de cookies.
   ========================================================================= */

(function () {
  'use strict';

  var cfg = window.ANALYTICS_CONFIG || {};
  var id = String(cfg.elfsightReviewsId || '').trim();
  var box = document.getElementById('googleReviews');
  if (!box || !/^[a-z0-9-]+$/i.test(id)) return;   // vazio ou inválido → nada aparece

  var widget = box.querySelector('.google-reviews-widget');
  var notice = box.querySelector('.google-reviews-consent');
  var loaded = false;

  function accepted() {
    return !!(window.TMHConsent && window.TMHConsent.isAccepted());
  }

  function load() {
    if (loaded) return;
    loaded = true;
    var app = document.createElement('div');
    app.className = 'elfsight-app-' + id;
    app.setAttribute('data-elfsight-app-lazy', '');
    widget.appendChild(app);
    var s = document.createElement('script');
    s.src = 'https://static.elfsight.com/platform/platform.js';
    s.async = true;
    document.body.appendChild(s);
  }

  function render() {
    var ok = accepted();
    notice.hidden = ok;
    widget.hidden = !ok;
    if (ok) load();
  }

  box.hidden = false;
  var btn = notice.querySelector('button');
  if (btn && window.TMHConsent && typeof window.TMHConsent.open === 'function') {
    btn.addEventListener('click', function () { window.TMHConsent.open(); });
  } else if (btn) {
    btn.hidden = true;
  }
  render();
  if (window.TMHConsent && typeof window.TMHConsent.onChange === 'function') {
    // Se recusar depois de aceitar, o widget já carregado só desaparece ao recarregar a página.
    window.TMHConsent.onChange(function () {
      if (!accepted() && loaded) { window.location.reload(); return; }
      render();
    });
  }
})();
