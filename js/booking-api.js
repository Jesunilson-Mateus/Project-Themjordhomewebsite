/* =========================================================================
   THEMAJORD'HOME — Camada de reservas (único ponto de contacto com o backend)

   Todo o site (calendário, pesquisa, assistente de reserva, página de
   confirmação) passa por aqui. Em modo 'live' faz pedidos à API em
   BOOKING_CONFIG.apiBase; em modo 'mock' devolve dados de exemplo para o
   site funcionar sem servidor.

   Contrato completo (pedidos, respostas, erros):
   docs/INTEGRACAO-BEDS24-STRIPE.md

   Datas no contrato: sempre ISO "YYYY-MM-DD". O site mostra dd-mm-yyyy,
   por isso há helpers de conversão no fim do ficheiro.
   ========================================================================= */

(function () {
  const config = window.BOOKING_CONFIG || { mode: 'mock', apiBase: 'api' };

  class BookingApiError extends Error {
    constructor(code, message, status) {
      super(message || code);
      this.code = code;        // 'unavailable' | 'invalid_request' | 'capacity' | 'payment' | 'server' | 'network'
      this.status = status || 0;
    }
  }

  /* ---------------------------------------------------------------------
     Modo 'live' — pedidos HTTP à API (api/*.php)
     --------------------------------------------------------------------- */
  async function request(path, { method = 'GET', query, body } = {}) {
    let url = `${config.apiBase}/${path}`;
    if (query) url += '?' + new URLSearchParams(query).toString();

    let res;
    try {
      res = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'same-origin'
      });
    } catch (e) {
      throw new BookingApiError('network', e.message);
    }

    let data = null;
    try { data = await res.json(); } catch (e) { /* resposta sem JSON */ }
    if (!res.ok) {
      const err = (data && data.error) || {};
      throw new BookingApiError(err.code || 'server', err.message, res.status);
    }
    return data;
  }

  const live = {
    getAvailability: (property, from, to) =>
      request('availability.php', { query: { property, from, to } }),

    search: ({ checkIn, checkOut, adults, children }) =>
      request('search.php', { query: { checkIn, checkOut, adults, children } }),

    getQuote: ({ property, checkIn, checkOut, adults, children }) =>
      request('quote.php', { query: { property, checkIn, checkOut, adults, children } }),

    createReservation: (reservation) =>
      request('reservations.php', { method: 'POST', body: reservation }),

    getReservation: (id, token) =>
      request('reservations.php', { query: { id, token } })
  };

  /* ---------------------------------------------------------------------
     Modo 'mock' — mesmo formato de resposta, dados de exemplo
     --------------------------------------------------------------------- */
  function mockUnavailable(property, from, to) {
    // Alguns dias ocupados, sempre os mesmos para o mesmo apartamento.
    let hash = 0;
    for (const c of property) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
    const offsets = [2, 3, 8, 9, 10].map(n => n + (hash % 5));
    const today = new Date();
    return offsets
      .map(n => toIso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + n)))
      .filter(d => (!from || d >= from) && (!to || d <= to));
  }

  function nightsBetween(checkIn, checkOut) {
    const out = [];
    const d = fromIso(checkIn), end = fromIso(checkOut);
    while (d < end) { out.push(toIso(d)); d.setDate(d.getDate() + 1); }
    return out;
  }

  const delay = (v) => new Promise(r => setTimeout(() => r(v), 150));

  const mock = {
    getAvailability: (property, from, to) =>
      delay({ property, unavailable: mockUnavailable(property, from, to), minStay: 1 }),

    search: ({ checkIn, checkOut, adults, children }) => {
      const guests = (+adults || 1) + (+children || 0);
      const nights = nightsBetween(checkIn, checkOut);
      const all = typeof PROPERTIES !== 'undefined' ? PROPERTIES : {};   // const global de properties-data.js
      const available = Object.keys(all).filter(slug => {
        if (all[slug].active === false || (all[slug].guests || 0) < guests) return false;
        const busy = mockUnavailable(slug, checkIn, checkOut);
        return !nights.some(n => busy.includes(n));
      });
      return delay({ available });
    },

    // Sem Beds24 não há preço: o site mostra "preço sob consulta".
    getQuote: ({ property, checkIn, checkOut }) =>
      delay({ property, currency: 'EUR', nights: nightsBetween(checkIn, checkOut).length, total: null }),

    createReservation: async (reservation) => {
      const busy = mockUnavailable(reservation.property, reservation.checkIn, reservation.checkOut);
      if (nightsBetween(reservation.checkIn, reservation.checkOut).some(n => busy.includes(n))) {
        throw new BookingApiError('unavailable', 'Datas indisponíveis', 409);
      }
      return delay({ id: 'MOCK-' + Date.now().toString(36).toUpperCase(), status: 'request', checkoutUrl: null });
    },

    getReservation: (id) => delay({ id, status: 'request' })
  };

  /* ---------------------------------------------------------------------
     Helpers de datas
     --------------------------------------------------------------------- */
  function toIso(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function fromIso(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  // "dd-mm-yyyy" (formato mostrado no site) → "yyyy-mm-dd"
  function displayToIso(str) {
    const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec((str || '').trim());
    return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
  }

  window.BookingAPI = Object.assign(config.mode === 'live' ? live : mock, {
    mode: config.mode === 'live' ? 'live' : 'mock',
    Error: BookingApiError,
    toIso, fromIso, displayToIso
  });
})();
