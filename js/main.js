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

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Header background on scroll ---- */
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ---- Hero slideshow ---- */
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('heroDots');
  let current = 0;
  let timer;

  if (slides.length && dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `${window.I18N ? window.I18N.t('aria.goToSlide') : 'Ir para o slide'} ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    let paused = false;
    const pauseBtn = document.getElementById('heroPause');

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
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
