/* =========================================================================
   THEMAJORD'HOME — index.html interactions
   ========================================================================= */

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

/* The 9 apartments that had a hand-picked hero photo before the slideshow
   became data-driven — keep those exactly as chosen. */
var HERO_KEEP_IMAGE = [
  'fabrica-no-jardim', 'arty-porto', 'volta-do-patio-porto', 'casa-senhorinha',
  'casa-bonfim', 'balcony-porto-view', 'shiny-porto', 'sky-de-loios-porto',
  'cocoon-almada-porto'
];

/* Every other apartment shows a living-room photo in the slide. Picks the
   first image whose filename points at the living area, in order of
   preference; falls back to heroImage when the listing has no such photo. */
function heroPhotoFor(p) {
  if (HERO_KEEP_IMAGE.indexOf(p.slug) !== -1) return p.heroImage;
  var imgs = (p.images && p.images.length) ? p.images : [];
  var ranks = [/living/i, /lounge|sitting|salon/i, /studio|overview/i, /sofa|tv-wall|tv-console|fireplace/i, /dining/i];
  for (var r = 0; r < ranks.length; r++) {
    for (var i = 0; i < imgs.length; i++) {
      if (ranks[r].test(imgs[i])) return imgs[i];
    }
  }
  return p.heroImage;
}

/* Builds one hero slide per apartment in properties-data.js and injects them
   before the dots. Units and the CTA use data-i18n so they follow the language
   switcher; name / district come straight from the data (identical in every
   language). Background images load in a small window around the current slide
   (see loadSlideImg below) so the homepage doesn't fetch 60 photos at once. */
function renderHeroSlides() {
  const anchor = document.getElementById('heroDots');
  if (!anchor || typeof getAllProperties !== 'function') return;

  const html = getAllProperties().map((p, i) => {
    const words = String(p.name).trim().split(/\s+/);
    const last = escapeHtml(words.pop());
    const lead = words.length ? escapeHtml(words.join(' ')) + ' ' : '';
    const bedCell = p.bedrooms === 0
      ? '<span data-i18n="unit.studio">Estúdio</span>'
      : `<span><b>${p.bedrooms}</b>&nbsp;<span data-i18n="unit.bedroom.${p.bedrooms === 1 ? 'singular' : 'plural'}">${p.bedrooms === 1 ? 'quarto' : 'quartos'}</span></span>`;
    const tail = p.size_m2 ? `${p.size_m2} m²` : escapeHtml(p.district);
    const photo = heroPhotoFor(p);
    const imgAttr = i === 0
      ? `src="${escapeHtml(photo)}"`
      : `data-src="${escapeHtml(photo)}" loading="lazy"`;
    return `
      <div class="slide${i === 0 ? ' active' : ''}" data-index="${i}">
        <div class="slide-bg"><img ${imgAttr} alt="${escapeHtml(p.name)}"></div>
        <div class="slide-content wrap">
          <div class="slide-eyebrow"><span class="dash"></span> ${escapeHtml(p.district)}, ${escapeHtml(p.city)}</div>
          <h1 class="slide-title">${lead}<em>${last}</em></h1>
          <div class="slide-meta">
            ${bedCell}
            <span><b>${p.guests}</b>&nbsp;<span data-i18n="unit.guest.${p.guests === 1 ? 'singular' : 'plural'}">${p.guests === 1 ? 'hóspede' : 'hóspedes'}</span></span>
            <span>${tail}</span>
          </div>
          <a class="slide-link" href="property.html?p=${encodeURIComponent(p.slug)}#propDetails" data-i18n="hero.cta">Ver apartamento →</a>
        </div>
      </div>`;
  }).join('');

  anchor.insertAdjacentHTML('beforebegin', html);
  if (window.I18N && I18N.applyStaticTranslations) {
    I18N.applyStaticTranslations(document.getElementById('hero'));
  }
}

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Header background on scroll ---- */
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ---- Hero slideshow ---- */
  renderHeroSlides();
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('heroDots');
  let current = 0;
  let timer;

  /* Load a slide's background image on demand (see renderHeroSlides: only the
     first slide ships with a real src, the rest carry data-src). */
  function loadSlideImg(index) {
    const slide = slides[(index % slides.length + slides.length) % slides.length];
    if (!slide) return;
    const img = slide.querySelector('.slide-bg img');
    if (img && !img.getAttribute('src') && img.dataset.src) {
      img.src = img.dataset.src;
    }
  }

  if (slides.length && dotsWrap) {
    // Poucos apartamentos → uma bolinha por slide. Muitos → as bolinhas não
    // caberiam na barra, por isso mostra-se um contador "n / total".
    const useCounter = slides.length > 14;
    let counter = null;
    if (useCounter) {
      dotsWrap.classList.add('hero-dots--counter');
      counter = document.createElement('span');
      counter.className = 'hero-counter';
      counter.textContent = '1 / ' + slides.length;
      dotsWrap.appendChild(counter);
    } else {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `${window.I18N ? window.I18N.t('aria.goToSlide') : 'Ir para o slide'} ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      });
    }
    const dots = Array.from(dotsWrap.querySelectorAll('button'));

    let paused = false;
    const pauseBtn = document.getElementById('heroPause');

    // Pré-carrega a primeira imagem e as vizinhas imediatas.
    loadSlideImg(0);
    loadSlideImg(1);
    loadSlideImg(-1);

    function goTo(index) {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
      if (counter) counter.textContent = (current + 1) + ' / ' + slides.length;
      loadSlideImg(current);
      loadSlideImg(current + 1);
      loadSlideImg(current - 1);
      resetTimer();
    }

    function resetTimer() {
      clearInterval(timer);
      if (paused) return;
      timer = setInterval(() => goTo(current + 1), 5500);
    }

    function setPaused(next) {
      paused = next;
      if (paused) {
        clearInterval(timer);
      } else {
        resetTimer();
      }
      if (pauseBtn) {
        pauseBtn.classList.toggle('is-paused', paused);
        pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
        const key = paused ? 'aria.playSlideshow' : 'aria.pauseSlideshow';
        const label = window.I18N ? window.I18N.t(key) : (paused ? 'Retomar apresentação' : 'Pausar apresentação');
        pauseBtn.setAttribute('aria-label', label);
      }
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => setPaused(!paused));
    }

    const nextBtn = document.getElementById('nextSlide');
    const prevBtn = document.getElementById('prevSlide');
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));

    // Respeita quem pede menos movimento no sistema — começa em pausa.
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPaused(reduceMotion);

    /* Whole slide is clickable — lands on the availability/description section */
    slides.forEach(slide => {
      const link = slide.querySelector('.slide-link');
      if (!link) return;
      slide.classList.add('slide-clickable');
      slide.addEventListener('click', (e) => {
        if (e.target.closest('.slide-link')) return; // let the link's own navigation happen
        window.location.href = link.getAttribute('href');
      });
    });
  }

  /* ---- Booking bar: a submissão é tratada em js/booking-bar.js (abre a
     página de resultados, que pergunta a disponibilidade à BookingAPI) ---- */

  /* ---- Mobile menu ---- */
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

  /* ---- Scroll reveal ---- */
  let revealObserver = null;
  function observeReveal(els) {
    if (!els || !els.length) return;
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
    }
    els.forEach(el => revealObserver.observe(el));
  }
  observeReveal(document.querySelectorAll('.reveal:not(.apt-card):not(.district-group)'));

  /* ---- Pesquisa na coleção: nome, zona e nº de hóspedes ----
     index.html      → filtra os cartões já desenhados em #featuredGrid.
     apartments.html → volta a desenhar a lista só com os resultados (sem
                       paginação enquanto houver filtro). */
  const normalize = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  // "Baixa · Trindade" pertence à zona "Baixa".
  const zoneOf = (district) => String(district || '').split('·')[0].trim();
  const MAX_SEARCH_GUESTS = 10;

  function fillCollectionSearchOptions() {
    const zoneSel = document.getElementById('csZone');
    if (!zoneSel) return;
    const all = getAllProperties();

    const zones = [...new Set(all.map(p => zoneOf(p.district)))].sort((a, b) => a.localeCompare(b, 'pt'));
    const prevZone = zoneSel.value;
    zoneSel.innerHTML = `<option value="">${escapeHtml(I18N.t('collection.search.anyZone'))}</option>`
      + zones.map(z => `<option value="${escapeHtml(z)}">${escapeHtml(z)}</option>`).join('');
    zoneSel.value = zones.includes(prevZone) ? prevZone : '';
  }

  /* Lê os campos da barra. Nº de hóspedes exato (1–10): mostra os
     apartamentos com capacidade para pelo menos esse número; acima de 10
     passa a 10; vazio = qualquer número. */
  function readCollectionFilter() {
    if (!document.getElementById('collectionSearch')) return { active: false };
    const q = normalize(document.getElementById('csQuery').value.trim());
    const zone = document.getElementById('csZone').value;
    const guestsInput = document.getElementById('csGuests');
    let guests = parseInt(guestsInput.value, 10) || 0;
    if (guests > MAX_SEARCH_GUESTS) { guests = MAX_SEARCH_GUESTS; guestsInput.value = guests; }
    if (guestsInput.value !== '' && guests < 1) { guests = 0; guestsInput.value = ''; }
    return { q, zone, guests, active: !!(q || zone || guests) };
  }

  function matchesCollectionFilter(f, search, zone, guests) {
    return (!f.q || search.includes(f.q)) && (!f.zone || zone === f.zone) && (!f.guests || guests >= f.guests);
  }

  function showCollectionSearchStatus(f, shown, total) {
    if (!document.getElementById('collectionSearch')) return;
    document.getElementById('csCount').textContent = I18N.t('collection.search.count')
      .replace('{n}', shown).replace('{total}', total);
    document.getElementById('csClear').hidden = !f.active;
    document.getElementById('csEmpty').hidden = shown > 0;
  }

  function applyCollectionSearch() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    const f = readCollectionFilter();
    const cards = [...grid.querySelectorAll('.apt-card')];
    let shown = 0;
    cards.forEach(card => {
      const match = matchesCollectionFilter(f, card.dataset.search, card.dataset.zone, +card.dataset.guests);
      card.hidden = !match;
      if (match) { shown++; card.classList.add('in'); }
    });
    showCollectionSearchStatus(f, shown, cards.length);
  }

  const collectionSearch = document.getElementById('collectionSearch');
  if (collectionSearch) {
    const onSearch = () => document.getElementById('directoryGroups')
      ? renderCollection({ animate: false })
      : applyCollectionSearch();
    collectionSearch.addEventListener('submit', (e) => e.preventDefault());
    collectionSearch.addEventListener('input', onSearch);
    collectionSearch.addEventListener('change', onSearch);
    // "reset" limpa os campos só depois do evento — filtrar no tick seguinte.
    collectionSearch.addEventListener('reset', () => setTimeout(onSearch, 0));
  }

  /* ---- Collection grid + directory (rendered from properties-data.js, localized) ---- */
  function renderCollection(opts) {
    opts = opts || {};
    const grid = document.getElementById('featuredGrid');
    const directoryGroups = document.getElementById('directoryGroups');
    if (!grid && !directoryGroups) return;

    if (grid) {
      const featured = getFeaturedProperties().map(p => I18N.getLocalizedProperty(p.slug, p));
      grid.innerHTML = featured.map(p => `
        <a class="apt-card reveal" href="property.html?p=${encodeURIComponent(p.slug)}" data-search="${escapeHtml(normalize(p.name + ' ' + p.district))}" data-zone="${escapeHtml(zoneOf(p.district))}" data-guests="${p.guests || 0}">
          <div class="apt-photo">
            <span class="badge">${p.rating ? '★ ' + I18N.formatRating(p.rating) + ' · ' + p.reviews : I18N.t('collection.badgeFeatured')}</span>
            <img class="ph" src="${escapeHtml(p.heroImage)}" alt="${escapeHtml(p.name)}">
          </div>
          <div class="apt-name">${escapeHtml(p.name)}</div>
          <div class="apt-loc">${escapeHtml(p.district)}, ${escapeHtml(p.city)}</div>
          <div class="apt-specs">
            <span>${I18N.bedroomLabel(p.bedrooms)}</span>
            <span>${p.guests} ${I18N.nounGuest(p.guests)}</span>
            <span>${p.size_m2 ? p.size_m2 + ' m²' : ''}</span>
          </div>
        </a>
      `).join('');
      fillCollectionSearchOptions();   // rótulos das listas na língua atual
      applyCollectionSearch();
    }

    if (directoryGroups) {
      // Full collection page: split into 3 pages you can flip through
      // (?page=1..3). Each page keeps the district grouping for its slice.
      const PAGES = 3;
      const all = getAllProperties().map(p => I18N.getLocalizedProperty(p.slug, p));
      const per = Math.ceil(all.length / PAGES);
      let page = parseInt(new URLSearchParams(window.location.search).get('page'), 10);
      if (!(page >= 1 && page <= PAGES)) page = 1;
      fillCollectionSearchOptions();   // rótulos das listas na língua atual
      const filter = readCollectionFilter();
      // Com pesquisa ativa mostram-se todos os resultados numa só lista.
      const directory = filter.active
        ? all.filter(p => matchesCollectionFilter(filter, normalize(p.name + ' ' + p.district), zoneOf(p.district), p.guests || 0))
        : all.slice((page - 1) * per, (page - 1) * per + per);
      showCollectionSearchStatus(filter, filter.active ? directory.length : all.length, all.length);

      const groups = {};
      const order = [];
      directory.forEach(p => {
        const key = p.district;
        if (!groups[key]) { groups[key] = []; order.push(key); }
        groups[key].push(p);
      });

      const dotClass = (district) => {
        const d = district.toLowerCase();
        if (d.includes('baixa')) return 'dot-baixa';
        if (d.includes('bonfim')) return 'dot-bonfim';
        if (d.includes('fontaínhas') || d.includes('fontainhas')) return 'dot-fontainhas';
        if (d.includes('ribeira')) return 'dot-ribeira';
        return 'dot-cedofeita';
      };

      directoryGroups.innerHTML = order.map(district => `
        <div class="district-group reveal">
          <div class="district-label"><span class="dot ${dotClass(district)}"></span>${escapeHtml(district)}</div>
          ${groups[district].map(p => `
            <a class="dir-row" href="property.html?p=${encodeURIComponent(p.slug)}">
              <div class="dir-photo"><img src="${escapeHtml(p.heroImage)}" alt="${escapeHtml(p.name)}" loading="lazy"></div>
              <div class="dir-name">${escapeHtml(p.name)}</div>
              <div class="dir-specs">${p.size_m2 ? p.size_m2 + ' m² · ' : ''}${p.guests} ${I18N.nounGuest(p.guests)} · ${I18N.bedroomLabel(p.bedrooms)}${p.priceFrom ? ' <span class="price">' + I18N.t('common.from') + ' ' + I18N.formatPrice(p.priceFrom) + '€</span>' : ''}</div>
              <div class="dir-desc">${escapeHtml(p.description)}</div>
            </a>
          `).join('')}
        </div>
      `).join('');

      const countEl = document.getElementById('directoryCount');
      if (countEl) {
        countEl.textContent = all.length + ' ' + I18N.t('collection.countSuffix')
          + (filter.active ? '' : ' · ' + I18N.t('collection.page') + ' ' + page + '/' + PAGES);
      }

      /* Pager (‹ 1 2 3 ›). Real hrefs so it works without JS / links are
         shareable; JS upgrades it to an in-page switch, no full reload.
         Escondido enquanto há pesquisa (os resultados vêm todos juntos). */
      const pager = document.getElementById('directoryPager');
      if (pager) pager.hidden = filter.active;
      if (pager && !filter.active) {
        const cell = (n, label) => {
          if (n < 1 || n > PAGES) return `<span class="is-disabled">${label}</span>`;
          if (n === page) return `<span class="is-current" aria-current="page">${label}</span>`;
          return `<a href="apartments.html?page=${n}" data-page="${n}">${label}</a>`;
        };
        let out = cell(page - 1, '‹');
        for (let n = 1; n <= PAGES; n++) out += cell(n, n);
        out += cell(page + 1, '›');
        pager.innerHTML = out;
        pager.querySelectorAll('a[data-page]').forEach(a => {
          a.addEventListener('click', (e) => {
            e.preventDefault();
            history.pushState(null, '', 'apartments.html?page=' + a.dataset.page);
            renderCollection({ animate: false });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        });
      }
    }

    const dynamicReveal = document.querySelectorAll('#featuredGrid .reveal, #directoryGroups .reveal');
    if (opts.animate === false) {
      dynamicReveal.forEach(el => el.classList.add('in'));
    } else {
      observeReveal(dynamicReveal);
    }
  }

  renderCollection({ animate: true });

  /* Back / forward between collection pages */
  window.addEventListener('popstate', () => {
    if (document.getElementById('directoryGroups')) renderCollection({ animate: false });
  });

  /* ---- Testimonials (avaliações aprovadas no painel, de todos os apartamentos) ---- */
  function renderTestimonials() {
    const section = document.getElementById('testemunhos');
    const grid = document.getElementById('testimonialsGrid');
    if (!section || !grid || typeof REVIEWS === 'undefined') return;

    const all = [];
    Object.keys(REVIEWS).forEach(slug => {
      // avaliações de apartamentos inativos não aparecem (o link daria "não encontrado")
      if (typeof PROPERTIES !== 'undefined' && !isPropertyActive(PROPERTIES[slug])) return;
      REVIEWS[slug].forEach(r => all.push(Object.assign({ slug }, r)));
    });
    if (!all.length) return;

    all.sort((a, b) => (b.rating - a.rating) || (new Date(b.submittedAt) - new Date(a.submittedAt)));
    const picked = all.slice(0, 6);
    const properties = (typeof PROPERTIES !== 'undefined') ? PROPERTIES : {};

    grid.innerHTML = picked.map(r => {
      const propName = properties[r.slug] ? properties[r.slug].name : '';
      return `
        <a class="testimonial-card" href="property.html?p=${encodeURIComponent(r.slug)}">
          <div class="testimonial-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
          <p class="testimonial-text">${escapeHtml(r.text)}</p>
          <div class="testimonial-meta">${escapeHtml(r.guestName)} · ${escapeHtml(propName)}</div>
        </a>
      `;
    }).join('');
    section.style.display = '';
  }
  renderTestimonials();

  /* ---- Language switcher ---- */
  I18N.initLanguageSwitcher(() => renderCollection({ animate: false }));

});
