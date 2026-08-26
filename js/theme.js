/* =========================================================================
   THEMAJORD'HOME — alternância de tema claro/escuro (site público)
   A escolha guardada já foi aplicada por um pequeno script inline no
   <head> de cada página (evita o "flash" da cor errada); este ficheiro
   só liga o clique do botão às trocas seguintes.
   ========================================================================= */
(function () {
  'use strict';

  function currentIsDark() {
    var attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function toggle() {
    var next = currentIsDark() ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('tmh_theme', next); } catch (e) {}
  }

  function init() {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', toggle);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
