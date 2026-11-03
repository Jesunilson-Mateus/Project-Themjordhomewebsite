/* =========================================================================
   THEMAJORD'HOME — Perguntas frequentes (faq.html)

   Desenha as perguntas de js/faq-data.js (cópia de data/faq.json) na língua
   escolhida, em cada <section data-faq="guests|owners">. As perguntas
   "a confirmar" (draft) não aparecem. Sem tradução, mostra o português.
   ========================================================================= */
(function () {
  'use strict';

  function pickLang(obj) {
    if (!obj) return '';
    return obj[I18N.getLang()] || obj.pt || '';
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  /* Emails, telefones internacionais e endereços https:// ficam clicáveis.
     Recebe texto já escapado. */
  function linkify(html) {
    return html
      .replace(/https?:\/\/[^\s<]+[^\s<.,;:!?)]/g, function (url) {
        return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + '</a>';
      })
      .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, function (email) {
        return '<a href="mailto:' + email + '">' + email + '</a>';
      })
      .replace(/\+\d{1,3}(?: ?\d){8,12}/g, function (phone) {
        return '<a href="tel:' + phone.replace(/ /g, '') + '">' + phone + '</a>';
      });
  }

  /* Uma linha em branco separa parágrafos; uma quebra simples fica <br>. */
  function answerHtml(text) {
    return text.trim().split(/\n\s*\n/).map(function (para) {
      return '<p>' + linkify(escapeHtml(para.trim())).replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }

  function render() {
    document.querySelectorAll('[data-faq]').forEach(function (section) {
      var data = FAQ[section.getAttribute('data-faq')] || {};
      var items = (data.items || []).filter(function (item) { return !item.draft; });
      var list = section.querySelector('[data-faq-list]');

      // mantém abertas as perguntas que estavam abertas ao mudar de língua
      var open = {};
      list.querySelectorAll('details').forEach(function (d, i) { if (d.open) open[i] = true; });

      section.hidden = !items.length;
      document.querySelectorAll('.faq-jump a[href="#' + section.id + '"]').forEach(function (a) {
        a.hidden = !items.length;
      });
      section.querySelector('[data-faq-title]').textContent = pickLang(data.title);

      list.innerHTML = items.map(function (item, i) {
        return '<details class="faq-entry"' + (open[i] ? ' open' : '') + '>' +
          '<summary><span class="faq-entry-q">' + escapeHtml(pickLang(item.q)) + '</span>' +
          '<span class="faq-entry-icon" aria-hidden="true"></span></summary>' +
          '<div class="faq-entry-a">' + answerHtml(pickLang(item.a)) + '</div>' +
          '</details>';
      }).join('');
    });
  }

  render();
  I18N.onLangChange(render);
})();
