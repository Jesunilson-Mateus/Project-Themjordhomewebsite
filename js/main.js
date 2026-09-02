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

  /* ---- Booking bar (placeholder — will call Beds24-backed API later) ---- */
  const bookingBar = document.getElementById('bookingBar');
  if (bookingBar) {
    bookingBar.addEventListener('submit', function (e) {
      e.preventDefault();
      alert(I18N.t('booking.alert'));
    });
  }

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

  /* ---- Collection grid + directory (rendered from properties-data.js, localized) ---- */
  function renderCollection(opts) {
    opts = opts || {};
    const grid = document.getElementById('featuredGrid');
    const directoryGroups = document.getElementById('directoryGroups');
    if (!grid && !directoryGroups) return;

    if (grid) {
      const featured = getFeaturedProperties().map(p => I18N.getLocalizedProperty(p.slug, p));
      grid.innerHTML = featured.map(p => `
        <a class="apt-card reveal" href="property.html?p=${encodeURIComponent(p.slug)}">
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
    }

    if (directoryGroups) {
      // Full collection page: every property, grouped by district, in original order
      const directory = getAllProperties().map(p => I18N.getLocalizedProperty(p.slug, p));

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
      if (countEl) countEl.textContent = directory.length + ' ' + I18N.t('collection.countSuffix');
    }

    const dynamicReveal = document.querySelectorAll('#featuredGrid .reveal, #directoryGroups .reveal');
    if (opts.animate === false) {
      dynamicReveal.forEach(el => el.classList.add('in'));
    } else {
      observeReveal(dynamicReveal);
    }
  }

  renderCollection({ animate: true });

  /* ---- Testimonials (avaliações aprovadas no painel, de todos os apartamentos) ---- */
  function renderTestimonials() {
    const section = document.getElementById('testemunhos');
    const grid = document.getElementById('testimonialsGrid');
    if (!section || !grid || typeof REVIEWS === 'undefined') return;

    const all = [];
    Object.keys(REVIEWS).forEach(slug => {
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
