/* =========================================================================
   THEMAJORD'HOME — property.html interactions
   Reads the property from the ?p= query param (see properties-data.js)
   and renders the entire page from that single object. Text content is
   re-rendered whenever the language changes (see js/i18n.js); the gallery,
   lightbox and event listeners are built once since they don't depend on
   the selected language.
   ========================================================================= */

const ICONS = {
  guests: '<path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  bed: '<path d="M2 20v-9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9"/><path d="M2 12v-2a2 2 0 0 1 2-2h5v4"/><path d="M2 17h20"/>',
  bath: '<path d="M4 12h16M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6M7 12V6a2 2 0 0 1 2-2h1"/><circle cx="10" cy="6" r="0"/>',
  location: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  pin: '<path d="M12 22s8-7.58 8-13A8 8 0 0 0 4 9c0 5.42 8 13 8 13z"/><circle cx="12" cy="9" r="2.5"/>'
};

function svgIcon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
}

/* Escapes property fields (editable via the admin panel) before they're
   interpolated into innerHTML, so stored text can't inject markup/scripts. */
function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', () => {

  const prop = getPropertyFromQuery();
  const root = document.getElementById('propRoot');
  const notFound = document.getElementById('notFound');

  if (!prop) {
    root.style.display = 'none';
    notFound.style.display = 'block';
    initHeaderAndMenu();
    I18N.initLanguageSwitcher();
    return;
  }

  /* ---------- Gallery (built once — images don't change with language) ---------- */
  const images = prop.images && prop.images.length ? prop.images : [null];
  const galleryGrid = document.getElementById('galleryGrid');
  const mainImg = images[0];
  const thumbImgs = images.slice(1, 5);

  function imgOrPlaceholder(src, alt) {
    if (src) return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy">`;
    return `<div class="ph ph-${(prop.placeholderTone || 'baixa').length % 5 + 1}" style="width:100%;height:100%;"></div>`;
  }

  galleryGrid.innerHTML = `
    <div class="gallery-main" data-index="0" role="button" tabindex="0" aria-label="${images.length > 1 ? `Ver foto 1 de ${images.length}` : 'Ver foto'}">${imgOrPlaceholder(mainImg, prop.name)}</div>
    ${thumbImgs.map((src, i) => `
      <div class="gallery-thumb" data-index="${i + 1}" role="button" tabindex="0" aria-label="Ver foto ${i + 2} de ${images.length}">
        ${imgOrPlaceholder(src, prop.name)}
        ${(i === thumbImgs.length - 1 && images.length > 5) ? `<div class="gallery-more">+${images.length - 5} fotos</div>` : ''}
      </div>
    `).join('')}
    ${images.length > 1 ? `<div class="gallery-count-badge">${svgIcon('pin')} 1 / ${images.length}</div>` : ''}
  `;

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCounter = document.getElementById('lightboxCounter');
  let lbIndex = 0;

  function openLightbox(index) {
    if (!images[0]) return; // no real photos yet
    lbIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
  }
  function updateLightbox() {
    lightboxImg.src = images[lbIndex];
    lightboxCounter.textContent = `${lbIndex + 1} / ${images.length}`;
  }
  function closeLightbox() { lightbox.classList.remove('open'); }
  function nextImg() { lbIndex = (lbIndex + 1) % images.length; updateLightbox(); }
  function prevImg() { lbIndex = (lbIndex - 1 + images.length) % images.length; updateLightbox(); }

  galleryGrid.querySelectorAll('.gallery-main, .gallery-thumb').forEach(el => {
    el.addEventListener('click', () => openLightbox(parseInt(el.dataset.index, 10)));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        openLightbox(parseInt(el.dataset.index, 10));
      }
    });
  });
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxNext').addEventListener('click', nextImg);
  document.getElementById('lightboxPrev').addEventListener('click', prevImg);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImg();
    if (e.key === 'ArrowLeft') prevImg();
  });

  // Swipe support (mobile)
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx > 0 ? prevImg() : nextImg(); }
  });
  // Mobile: tap the count badge opens lightbox at 0
  const countBadge = galleryGrid.querySelector('.gallery-count-badge');
  if (countBadge) countBadge.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(0); });

  /* ---------- Localized text content (re-run on every language change) ---------- */
  const ratingEl = document.getElementById('propRating');
  const descEl = document.getElementById('propDescription');
  const readMoreBtn = document.getElementById('readMoreBtn');

  function renderLocalizedContent() {
    const lp = I18N.getLocalizedProperty(prop.slug, prop);

    document.title = `${lp.name} — TheMajord'Home`;
    document.getElementById('breadcrumbName').textContent = lp.name;

    /* Header (name / subtitle / rating) */
    document.getElementById('propName').textContent = lp.name;
    document.getElementById('propSubtitle').textContent = lp.subtitle || '';
    document.getElementById('propLocLine').textContent = `${lp.district}, ${lp.city}, ${lp.country}`.toUpperCase();

    if (lp.rating) {
      ratingEl.style.display = '';
      ratingEl.innerHTML = `<span class="star">★</span> <b>${I18N.formatRating(lp.rating)}</b> · ${escapeHtml(lp.reviews)} ${I18N.t('property.reviews')}`;
    } else {
      ratingEl.style.display = 'none';
      ratingEl.innerHTML = '';
    }

    /* Info row */
    document.getElementById('infoRow').innerHTML = `
      <div class="prop-info-item">${svgIcon('guests')}<div class="val">${lp.guests}</div><div class="lbl">${I18N.nounGuest(lp.guests)}</div></div>
      <div class="prop-info-item">${svgIcon('bed')}<div class="val">${lp.bedrooms === 0 ? '' : lp.bedrooms}</div><div class="lbl">${lp.bedrooms === 0 ? I18N.t('unit.studio') : I18N.nounBedroom(lp.bedrooms)}</div></div>
      <div class="prop-info-item">${svgIcon('bed')}<div class="val">${lp.beds}</div><div class="lbl">${I18N.nounBed(lp.beds)}</div></div>
      <div class="prop-info-item">${svgIcon('bath')}<div class="val">${lp.bathrooms}</div><div class="lbl">${I18N.nounBathroom(lp.bathrooms)}</div></div>
      <div class="prop-info-item">${svgIcon('location')}<div class="val" style="font-size:15px;">${escapeHtml(lp.district)}</div><div class="lbl">${I18N.t('property.location')}</div></div>
    `;

    /* Description with "read more" */
    descEl.classList.remove('clamped');
    descEl.textContent = lp.description || '';
    requestAnimationFrame(() => {
      if (descEl.scrollHeight > 150) {
        descEl.classList.add('clamped');
        readMoreBtn.style.display = 'inline-block';
        readMoreBtn.textContent = I18N.t('property.readMore');
      } else {
        readMoreBtn.style.display = 'none';
      }
    });

    /* Location */
    document.getElementById('neighborhoodText').textContent = lp.neighborhood || '';
    const nearbyList = document.getElementById('nearbyList');
    if (lp.nearby && lp.nearby.length) {
      nearbyList.innerHTML = lp.nearby.map(n => `
        <div class="nearby-item"><span>${escapeHtml(I18N.translateNearbyLabel(n.label))}</span><span>${escapeHtml(I18N.translateDistance(n.distance))}</span></div>
      `).join('');
    } else {
      nearbyList.innerHTML = '';
    }

    /* Amenities */
    const amenitiesGrid = document.getElementById('amenitiesGrid');
    if (lp.amenities) {
      amenitiesGrid.innerHTML = Object.entries(lp.amenities).map(([cat, items]) => `
        <div class="amenity-cat">
          <h4>${escapeHtml(I18N.translateAmenityCategory(cat))}</h4>
          <ul>${items.map(i => `<li>${svgIcon('check')}${escapeHtml(I18N.translateAmenityItem(i))}</li>`).join('')}</ul>
        </div>
      `).join('');
    }

    /* House rules. Check-in/check-out and max guests come from per-apartment
       data (present on all 55). Baby kit is a general company service, not
       something sourced per Airbnb listing, so it always shows. */
    const houseRulesSection = document.getElementById('houseRulesSection');
    const houseRulesGrid = document.getElementById('houseRulesGrid');
    const hasSafetyNotes = lp.safety && (lp.safety.smokeAlarm === false || lp.safety.coAlarm === false);
    let rows = '';
    if (lp.checkIn) rows += `<div class="house-rule-item"><span>${I18N.t('houseRules.checkIn')}</span><span>${escapeHtml(lp.checkIn)}</span></div>`;
    if (lp.checkOut) rows += `<div class="house-rule-item"><span>${I18N.t('houseRules.checkOut')}</span><span>${escapeHtml(lp.checkOut)}</span></div>`;
    rows += `<div class="house-rule-item"><span>${I18N.t('houseRules.maxGuests')}</span><span>${lp.guests}</span></div>`;
    if (hasSafetyNotes) {
      const notes = [];
      if (lp.safety.smokeAlarm === false) notes.push(I18N.t('houseRules.noSmokeAlarm'));
      if (lp.safety.coAlarm === false) notes.push(I18N.t('houseRules.noCoAlarm'));
      rows += `<div class="house-rule-item"><span>${I18N.t('houseRules.safety')}</span><span>${notes.join(' · ')}</span></div>`;
    }
    rows += `<div class="house-rule-item"><span>${I18N.t('houseRules.babyKit')}</span><span>${I18N.t('houseRules.onRequest')}</span></div>`;
    houseRulesGrid.innerHTML = rows;
    houseRulesSection.style.display = '';

    /* Booking sidebar */
    const priceLine = document.getElementById('priceLine');
    if (lp.priceFrom) {
      priceLine.innerHTML = `<span class="amt">${I18N.formatPrice(lp.priceFrom)}€</span><span class="unit">${I18N.t('property.perNightFrom')}</span>`;
    } else {
      priceLine.innerHTML = `<span class="amt" style="font-size:19px;">${I18N.t('property.priceOnRequest')}</span>`;
    }
    // Preço final por reserva vem do Beds24 (ver README) — o que está aqui é só
    // uma indicação de arranque enquanto a ligação em tempo real não entra.
    populateGuestSelects(lp);
  }

  /* Substitui {chave} por valores num texto traduzido (I18N.t não tem
     placeholders nativos — ver js/i18n.js). */
  function fillTemplate(str, vals) {
    return Object.keys(vals).reduce((s, k) => s.split('{' + k + '}').join(vals[k]), str);
  }

  /* Adultos / crianças: opções e limite dependem da capacidade do próprio
     alojamento (lp.guests), por isso são geradas em vez de fixas no HTML. */
  function populateGuestSelects(lp) {
    const adultsSel = document.getElementById('bookAdults');
    const childrenSel = document.getElementById('bookChildren');
    if (!adultsSel || !childrenSel) return;
    const max = lp.guests || 1;
    const prevAdults = adultsSel.value ? parseInt(adultsSel.value, 10) : Math.min(2, max);
    const prevChildren = childrenSel.value ? parseInt(childrenSel.value, 10) : 0;

    adultsSel.innerHTML = '';
    for (let n = 1; n <= max; n++) {
      const opt = document.createElement('option');
      opt.value = n;
      opt.textContent = `${n} ${I18N.t(n === 1 ? 'booking.adultsWord.singular' : 'booking.adultsWord.plural')}`;
      adultsSel.appendChild(opt);
    }
    adultsSel.value = Math.min(prevAdults, max);

    childrenSel.innerHTML = '';
    for (let n = 0; n <= Math.max(0, max - 1); n++) {
      const opt = document.createElement('option');
      opt.value = n;
      opt.textContent = `${n} ${I18N.t(n === 1 ? 'booking.childrenWord.singular' : 'booking.childrenWord.plural')}`;
      childrenSel.appendChild(opt);
    }
    childrenSel.value = Math.min(prevChildren, max - 1);
  }


  readMoreBtn.onclick = () => {
    const expanded = descEl.classList.toggle('clamped');
    readMoreBtn.textContent = expanded ? I18N.t('property.readMore') : I18N.t('property.showLess');
  };

  // Set property capacity for BookingWizard
  const bookForm = document.getElementById('bookForm');
  if (bookForm && prop.guests) {
    bookForm.setAttribute('data-max-capacity', prop.guests);
  }

  // Booking form is initialized by BookingWizard (js/booking-wizard.js) and BookingCalendar (js/booking-calendar.js)

  /* ---------- Guest reviews (aprovadas no painel; não dependem do idioma) ---------- */
  function renderReviews() {
    const section = document.getElementById('reviewsSection');
    const list = document.getElementById('reviewsList');
    const propReviews = (typeof REVIEWS !== 'undefined' && REVIEWS[prop.slug]) || [];
    if (!propReviews.length) return;

    list.innerHTML = propReviews.map(r => `
      <div class="review-card">
        <div class="review-card-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        <p class="review-card-text">${escapeHtml(r.text)}</p>
        <div class="review-card-name">${escapeHtml(r.guestName)}</div>
      </div>
    `).join('');
    section.style.display = '';
  }

  renderLocalizedContent();
  renderReviews();
  initHeaderAndMenu();
  I18N.initLanguageSwitcher(renderLocalizedContent);

  /* ---------- Deep link: land on the booking/description section ---------- */
  if (window.location.hash === '#propDetails') {
    requestAnimationFrame(() => {
      const target = document.getElementById('propDetails');
      if (target) {
        const headerOffset = 100;
        const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  }
});

/* ---------- Shared header scroll + mobile menu (same as homepage) ---------- */
function initHeaderAndMenu() {
  const header = document.getElementById('siteHeader');
  if (header) header.classList.add('solid');

  const menuToggle = document.getElementById('menuToggle');
  const mobilePanel = document.getElementById('mobilePanel');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  if (menuToggle && mobilePanel && mobileBackdrop) {
    function closeMenu() {
      menuToggle.classList.remove('open');
      mobilePanel.classList.remove('open');
      mobileBackdrop.classList.remove('open');
    }
    menuToggle.addEventListener('click', () => {
      const isOpen = mobilePanel.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      mobileBackdrop.classList.toggle('open', isOpen);
    });
    mobileBackdrop.addEventListener('click', closeMenu);
    mobilePanel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }
}
