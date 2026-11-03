/* =========================================================================
   THEMAJORD'HOME — Search Results Page
   Filters and displays available properties based on search criteria
   ========================================================================= */

class SearchResults {
  constructor() {
    // PROPERTIES é a const global de properties-data.js (chave = slug).
    const all = typeof PROPERTIES !== 'undefined' ? PROPERTIES : {};
    this.properties = Object.entries(all)
      .filter(([, p]) => typeof isPropertyActive !== 'function' || isPropertyActive(p))   // inativos não aparecem
      .map(([slug, p]) => ({ slug, ...p }));
    this.parseSearchParams();
    this.availableByZone = {};
    this.load();
  }

  async load() {
    await this.filterResults();
    this.renderResults();
  }

  parseSearchParams() {
    const params = new URLSearchParams(window.location.search);
    this.checkIn = params.get('checkIn');
    this.checkOut = params.get('checkOut');
    this.guests = parseInt(params.get('guests')) || 1;
  }

  // Disponibilidade: BookingAPI.search (Beds24 em modo live, exemplo em mock).
  async filterResults() {
    this.availableByZone = {};
    const api = window.BookingAPI;
    const checkIn = api && api.displayToIso(this.checkIn);
    const checkOut = api && api.displayToIso(this.checkOut);
    if (!checkIn || !checkOut || checkOut <= checkIn) return;

    let available = [];
    try {
      ({ available } = await api.search({ checkIn, checkOut, adults: this.guests, children: 0 }));
    } catch (e) {
      return;
    }

    this.properties.forEach(prop => {
      if (!available.includes(prop.slug) || (prop.guests || 0) < this.guests) return;
      const zone = prop.district || 'Porto';
      (this.availableByZone[zone] = this.availableByZone[zone] || []).push(prop);
    });
  }

  renderResults() {
    const container = document.getElementById('resultsContainer');
    const searchParamsEl = document.getElementById('searchParams');

    // Display search criteria
    const checkInStr = this.checkIn || '—';
    const checkOutStr = this.checkOut || '—';
    const guestLabel = window.I18N ? window.I18N.t('search.guests') : 'Hóspedes';
    searchParamsEl.textContent = `${checkInStr} até ${checkOutStr} · ${this.guests} ${guestLabel}`;

    // Check if no results
    if (Object.keys(this.availableByZone).length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <p style="font-size: 18px; opacity: 0.7;">Nenhum apartamento disponível para as datas selecionadas.</p>
          <a href="index.html#colecao" class="cta-btn" style="margin-top: 20px;">← Voltar à coleção</a>
        </div>
      `;
      return;
    }

    // Render results by zone
    let html = '';
    const zones = Object.keys(this.availableByZone).sort();

    zones.forEach(zone => {
      html += `<div style="margin-bottom: 40px;">
        <h2 style="margin-bottom: 20px; font-size: 20px;">${zone}</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
      `;

      this.availableByZone[zone].forEach(prop => {
        html += this.renderPropertyCard(prop);
      });

      html += `
        </div>
      </div>`;
    });

    container.innerHTML = html;
  }

  renderPropertyCard(prop) {
    const image = prop.heroImage || (prop.images && prop.images[0]) || '';
    const priceLabel = prop.priceFrom ? `€${prop.priceFrom}` : (window.I18N ? window.I18N.t('property.priceOnRequest') : 'Preço sob consulta');
    const rating = prop.rating || '—';
    const reviews = prop.reviews || 0;

    return `
      <a href="property.html?p=${prop.slug}" class="result-card" style="
        text-decoration: none;
        color: inherit;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s;
      " onmouseenter="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.1)'" onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
        <div style="width: 100%; height: 180px; background: #f0f0f0; overflow: hidden;">
          ${image ? `<img src="${image}" alt="${prop.name}" style="width: 100%; height: 100%; object-fit: cover;">` : '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #999;">Sem imagem</div>'}
        </div>
        <div style="padding: 15px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px;">${prop.name}</h3>
          <p style="margin: 0 0 10px 0; opacity: 0.7; font-size: 13px;">${prop.district || ''}, ${prop.city || ''}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              ${rating !== '—' ? `<div style="font-size: 14px;">★ ${rating} <span style="opacity: 0.6;">(${reviews})</span></div>` : ''}
              <div style="font-size: 15px; font-weight: 600; margin-top: 4px;">${priceLabel}</div>
            </div>
            <div style="text-align: right; font-size: 12px; color: #4F8864; font-weight: 500;">→</div>
          </div>
        </div>
      </a>
    `;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new SearchResults();
});
