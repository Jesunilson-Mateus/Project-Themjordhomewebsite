/* =========================================================================
   THEMAJORD'HOME — Search Results Page
   Filters and displays available properties based on search criteria
   ========================================================================= */

class SearchResults {
  constructor() {
    this.properties = window.properties || [];
    this.parseSearchParams();
    this.filterResults();
    this.renderResults();
  }

  parseSearchParams() {
    const params = new URLSearchParams(window.location.search);
    this.checkIn = params.get('checkIn');
    this.checkOut = params.get('checkOut');
    this.guests = parseInt(params.get('guests')) || 1;

    // Parse date format dd-mm-yyyy to object
    this.checkInDate = this.parseDate(this.checkIn);
    this.checkOutDate = this.parseDate(this.checkOut);
  }

  parseDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const year = parseInt(parts[2]);
    return new Date(year, month - 1, day);
  }

  filterResults() {
    this.availableByZone = {};

    this.properties.forEach(prop => {
      if (!prop.guests || prop.guests < this.guests) {
        return;
      }

      // Check availability (mock data for now)
      // TODO: Integrate with Beds24 API
      const isAvailable = this.checkAvailability(prop);

      if (isAvailable) {
        const zone = prop.zone || 'Sem zona';
        if (!this.availableByZone[zone]) {
          this.availableByZone[zone] = [];
        }
        this.availableByZone[zone].push(prop);
      }
    });
  }

  checkAvailability(prop) {
    // Mock availability check
    // TODO: Replace with Beds24 API call
    if (!prop.reservedDates) return true;

    const reserved = prop.reservedDates.map(d => new Date(d));
    const searchRange = this.getDateRange();

    for (let date of searchRange) {
      if (reserved.some(r => r.getTime() === date.getTime())) {
        return false;
      }
    }
    return true;
  }

  getDateRange() {
    const range = [];
    let current = new Date(this.checkInDate);
    while (current < this.checkOutDate) {
      range.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return range;
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
    const image = prop.images && prop.images[0] ? prop.images[0] : '';
    const price = prop.price || '—';
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
          <p style="margin: 0 0 10px 0; opacity: 0.7; font-size: 13px;">${prop.location || ''}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              ${rating !== '—' ? `<div style="font-size: 14px;">★ ${rating} <span style="opacity: 0.6;">(${reviews})</span></div>` : ''}
              <div style="font-size: 15px; font-weight: 600; margin-top: 4px;">€${price}</div>
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
