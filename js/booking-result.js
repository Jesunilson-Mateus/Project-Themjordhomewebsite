/* =========================================================================
   THEMAJORD'HOME — Página de regresso do pagamento (reserva.html)

   O Stripe Checkout devolve o cliente para:
     reserva.html?id=<reserva>&t=<token>                → sucesso
     reserva.html?id=<reserva>&t=<token>&status=cancelled → cancelou

   O pagamento só conta como feito quando o servidor recebe o webhook do
   Stripe — por isso esta página pergunta o estado à API (e volta a
   perguntar durante ~1 minuto enquanto estiver 'pending_payment').
   ========================================================================= */

(function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const token = params.get('t');
  const t = (k) => window.I18N ? window.I18N.t(k) : k;

  const titleEl = document.getElementById('resultTitle');
  const textEl = document.getElementById('resultText');
  const refEl = document.getElementById('resultRef');
  const backEl = document.getElementById('resultBack');

  function show(titleKey, textKey) {
    titleEl.setAttribute('data-i18n', titleKey);
    textEl.setAttribute('data-i18n', textKey);
    titleEl.textContent = t(titleKey);
    textEl.textContent = t(textKey);
  }

  function showReservation(r) {
    if (r.property) backEl.href = 'property.html?p=' + encodeURIComponent(r.property);
    refEl.hidden = false;
    refEl.textContent = t('booking.result.reference') + ': ' + r.id;
  }

  if (!id) {
    show('booking.result.cancelledTitle', 'booking.result.cancelledText');
    return;
  }
  if (params.get('status') === 'cancelled') {
    show('booking.result.cancelledTitle', 'booking.result.cancelledText');
    return;
  }

  let attempts = 0;
  async function check() {
    try {
      const r = await window.BookingAPI.getReservation(id, token);
      showReservation(r);
      if (r.status === 'confirmed') return show('booking.result.successTitle', 'booking.result.successText');
      if (r.status === 'request') return show('booking.result.requestTitle', 'booking.requestSent');
      if (r.status === 'cancelled' || r.status === 'expired') return show('booking.result.cancelledTitle', 'booking.result.cancelledText');
      // 'pending_payment': o webhook do Stripe ainda não chegou.
      show('booking.result.pendingTitle', 'booking.result.pendingText');
    } catch (e) {
      show('booking.result.pendingTitle', 'booking.result.pendingText');
    }
    if (++attempts < 20) setTimeout(check, 3000);
  }
  check();
})();
