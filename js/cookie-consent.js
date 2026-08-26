/* =========================================================================
   THEMAJORD'HOME — Cookie consent banner (aceitar / rejeitar)
   Guarda a escolha em localStorage e expõe window.TMHConsent para outros
   scripts (ex: analytics futuros) verificarem antes de correr.
   ========================================================================= */

(function () {
  'use strict';

  var STORAGE_KEY = 'tmh_cookie_consent';
  var listeners = [];
  var bannerEl = null;
  var toggleEl = null;

  var TEXT = {
    pt: {
      message: 'Usamos cookies essenciais para o site funcionar e, apenas com a sua autorização, cookies para medir a audiência. Pode aceitar ou rejeitar os cookies não essenciais a qualquer momento.',
      accept: 'Aceitar',
      reject: 'Rejeitar',
      manage: 'Cookies'
    },
    en: {
      message: 'We use essential cookies to run the site and, only with your consent, cookies to measure audience. You can accept or reject non-essential cookies at any time.',
      accept: 'Accept',
      reject: 'Reject',
      manage: 'Cookies'
    },
    fr: {
      message: 'Nous utilisons des cookies essentiels au fonctionnement du site et, uniquement avec votre accord, des cookies de mesure d’audience. Vous pouvez accepter ou refuser les cookies non essentiels à tout moment.',
      accept: 'Accepter',
      reject: 'Refuser',
      manage: 'Cookies'
    }
  };

  function currentLang() {
    if (window.I18N && typeof window.I18N.getLang === 'function') {
      var lang = window.I18N.getLang();
      if (TEXT[lang]) return lang;
    }
    return 'pt';
  }

  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(status) {
    var record = { status: status, ts: Date.now() };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(record)); } catch (e) {}
    listeners.forEach(function (fn) { fn(status); });
    try {
      window.dispatchEvent(new CustomEvent('tmh-cookie-consent', { detail: record }));
    } catch (e) {}
  }

  function buildBanner() {
    var wrap = document.createElement('div');
    wrap.id = 'cookieConsent';
    wrap.className = 'cookie-consent';
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', 'Cookies');
    wrap.innerHTML =
      '<p class="cookie-consent-text"></p>' +
      '<div class="cookie-consent-actions">' +
        '<button type="button" class="btn-cookie btn-cookie-reject"></button>' +
        '<button type="button" class="btn-cookie btn-cookie-accept"></button>' +
      '</div>';

    wrap.querySelector('.btn-cookie-reject').addEventListener('click', function () {
      writeConsent('rejected');
      hideBanner();
    });
    wrap.querySelector('.btn-cookie-accept').addEventListener('click', function () {
      writeConsent('accepted');
      hideBanner();
    });

    document.body.appendChild(wrap);
    return wrap;
  }

  function buildToggle() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'cookieConsentToggle';
    btn.className = 'cookie-consent-toggle';
    btn.addEventListener('click', showBanner);
    document.body.appendChild(btn);
    return btn;
  }

  function applyStrings() {
    var strings = TEXT[currentLang()];
    if (bannerEl) {
      bannerEl.querySelector('.cookie-consent-text').textContent = strings.message;
      bannerEl.querySelector('.btn-cookie-reject').textContent = strings.reject;
      bannerEl.querySelector('.btn-cookie-accept').textContent = strings.accept;
    }
    if (toggleEl) {
      toggleEl.textContent = strings.manage;
      toggleEl.setAttribute('aria-label', strings.manage);
    }
  }

  function showBanner() {
    if (!bannerEl) bannerEl = buildBanner();
    applyStrings();
    bannerEl.classList.add('visible');
    if (toggleEl) toggleEl.classList.remove('visible');
  }

  function hideBanner() {
    if (bannerEl) bannerEl.classList.remove('visible');
    if (!toggleEl) toggleEl = buildToggle();
    applyStrings();
    toggleEl.classList.add('visible');
  }

  function init() {
    if (!toggleEl) toggleEl = buildToggle();
    var consent = readConsent();
    if (consent && (consent.status === 'accepted' || consent.status === 'rejected')) {
      applyStrings();
      toggleEl.classList.add('visible');
    } else {
      showBanner();
    }
    if (window.I18N && typeof window.I18N.onLangChange === 'function') {
      window.I18N.onLangChange(applyStrings);
    }
  }

  function status() {
    var c = readConsent();
    return c ? c.status : null;
  }

  window.TMHConsent = {
    status: status,
    isAccepted: function () { return status() === 'accepted'; },
    onChange: function (fn) { listeners.push(fn); },
    open: showBanner
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
