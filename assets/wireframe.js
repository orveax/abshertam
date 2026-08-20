(function () {
  'use strict';

  const config = window.AIBSHER_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ICONS = {
    home: '<path d="M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3z"/>',
    company: '<rect x="4" y="4" width="16" height="17" rx="2"/><path d="M8 8h2m4 0h2M8 12h2m4 0h2M9 21v-5h6v5"/>',
    person: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21c.8-4.2 3.3-6.5 7.5-6.5s6.7 2.3 7.5 6.5"/>',
    investor: '<path d="M4 20V10m6 10V4m6 16v-7m4 7V7"/><path d="m3 8 6-5 5 4 7-5"/>',
    building: '<path d="M3 21h18M5 21V7l7-4v18m0-12h7v12M8 9h1m-1 4h1m-1 4h1m7-4h1m-1 4h1"/>',
    passport: '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="11" r="3"/><path d="M9 11h6M12 8c1.5 1.7 1.5 4.3 0 6m0-6c-1.5 1.7-1.5 4.3 0 6M9 17h6"/>',
    userdoc: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 14h8M8 18h6"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3"/>',
    shield: '<path d="M12 3 20 6v6c0 5-3.4 8.1-8 10-4.6-1.9-8-5-8-10V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
    location: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    whatsapp: '<path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"/><path d="M9 8.5c.5 2.8 2.7 5 5.5 5.5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
    file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
    review: '<path d="M4 4h16v16H4z"/><path d="M8 9h8m-8 4h8m-8 4h5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.4 2.4 0 1 1 3.4 2.2c-.8.4-1.1.9-1.1 1.8M12 17h.01"/>',
    download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16"/>',
    document: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h4M9 12h7m-7 4h7"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    arrow: '<path d="m9 18 6-6-6-6"/>',
    facebook: '<path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v6h4v-6h3l1-4h-4V9c0-.7.3-1 1-1Z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>',
    tiktok: '<path d="M14 4v10a4 4 0 1 1-3-3.9"/><path d="M14 4c.7 2.3 2.3 3.7 5 4"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    weather: '<path d="M7 17h10a4 4 0 0 0 0-8 6 6 0 0 0-11.2 2.2A3 3 0 0 0 7 17Z"/>',
    profile: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="9" r="3"/><path d="M7.5 18c.6-2.5 2.1-3.8 4.5-3.8s3.9 1.3 4.5 3.8"/>'
  };

  function icon(name, label) {
    const content = ICONS[name] || ICONS.question;
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${content}</svg>`;
  }

  function hydrateIcons() {
    $$('[data-icon]').forEach((el) => {
      if (el.dataset.iconReady) return;
      el.innerHTML = icon(el.dataset.icon, el.getAttribute('aria-label') || '');
      el.dataset.iconReady = 'true';
    });
  }

  function getLanguage() {
    return localStorage.getItem('aibshertam-lang') === 'en' ? 'en' : 'ar';
  }

  function setLanguage(lang) {
    const safe = lang === 'en' ? 'en' : 'ar';
    const html = document.documentElement;
    html.lang = safe;
    html.dir = safe === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('aibshertam-lang', safe);
    $$('[data-ar][data-en]').forEach((el) => { el.textContent = el.dataset[safe]; });
    $$('[data-lang-panel]').forEach((el) => { el.hidden = el.dataset.langPanel !== safe; });
    $$('[data-lang-toggle]').forEach((button) => {
      button.textContent = safe === 'ar' ? 'English' : 'العربية';
      button.setAttribute('aria-label', safe === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    });
    document.dispatchEvent(new CustomEvent('aibshertam:language', { detail: { lang: safe } }));
  }

  function initLanguage() {
    setLanguage(getLanguage());
    $$('[data-lang-toggle]').forEach((button) => button.addEventListener('click', () => setLanguage(getLanguage() === 'ar' ? 'en' : 'ar')));
    $$('[data-preserve-lang]').forEach((link) => link.addEventListener('click', () => {
      try {
        const url = new URL(link.href, location.href);
        url.searchParams.set('lang', getLanguage());
        link.href = url.toString();
      } catch (_) {}
    }));
    const requested = new URLSearchParams(location.search).get('lang');
    if (requested === 'ar' || requested === 'en') setLanguage(requested);
  }

  function applyConfigLinks() {
    $$('[data-company-profile]').forEach((el) => {
      const url = config.companyProfileUrl || '';
      if (!url) { el.hidden = true; return; }
      el.hidden = false;
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener';
    });
    Object.entries(config.socials || {}).forEach(([network, url]) => {
      $$(`[data-social="${network}"]`).forEach((el) => {
        if (!url) { el.hidden = true; return; }
        el.hidden = false; el.href = url; el.target = '_blank'; el.rel = 'noopener';
      });
    });
    $$('[data-location-link]').forEach((el) => {
      el.href = config.locationUrl || 'home.html#service-point';
    });
  }

  function qatarParts() {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: config.dohaTimeZone || 'Asia/Qatar', year: 'numeric', month: '2-digit', day: '2-digit',
      weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(new Date()).reduce((acc, part) => { if (part.type !== 'literal') acc[part.type] = part.value; return acc; }, {});
  }

  function updateDynamicStatus() {
    const p = qatarParts();
    const mins = Number(p.hour) * 60 + Number(p.minute);
    const [sh, sm] = (config.operatingHours?.start || '06:30').split(':').map(Number);
    const [eh, em] = (config.operatingHours?.end || '15:30').split(':').map(Number);
    const open = mins >= sh * 60 + sm && mins <= eh * 60 + em;
    const lang = getLanguage();
    const status = open ? (lang === 'ar' ? 'متاحة الآن' : 'Open now') : (lang === 'ar' ? 'غير متاحة حاليًا' : 'Currently closed');
    const date = `${p.weekday} · ${p.day}/${p.month}/${p.year}`;
    const time = `${p.hour}:${p.minute}`;
    $$('[data-unit-status]').forEach((el) => { el.textContent = status; el.dataset.state = open ? 'open' : 'closed'; });
    $$('[data-doha-time]').forEach((el) => { el.textContent = `${time} · ${date}`; });
  }

  async function updateWeather() {
    const lang = getLanguage();
    const fallback = lang === 'ar' ? 'طقس الدوحة غير متاح الآن' : 'Doha weather is unavailable';
    const nodes = $$('[data-doha-weather]');
    if (!nodes.length) return;
    if (!config.weatherEndpoint) { nodes.forEach((el) => { el.textContent = fallback; }); return; }
    try {
      const response = await fetch(config.weatherEndpoint, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('weather');
      const data = await response.json();
      const temp = data.temperature ?? data.current?.temperature_2m;
      const label = data.label ?? (lang === 'ar' ? 'الدوحة' : 'Doha');
      nodes.forEach((el) => { el.textContent = Number.isFinite(Number(temp)) ? `${label} · ${Math.round(Number(temp))}°C` : fallback; });
    } catch (_) { nodes.forEach((el) => { el.textContent = fallback; }); }
  }

  function initDynamicStatus() {
    updateDynamicStatus(); updateWeather();
    setInterval(updateDynamicStatus, 60000);
    document.addEventListener('aibshertam:language', () => { updateDynamicStatus(); updateWeather(); });
  }

  function initMenu() {
    const shell = $('#mobile-menu');
    const openButton = $('[data-menu-open]');
    if (!shell || !openButton) return;
    const panel = $('.premium-menu-panel', shell);
    const closeButtons = $$('[data-menu-close]', shell);
    let previousFocus = null;

    function focusable() { return $$('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])', panel).filter((el) => !el.hidden); }
    function open() {
      previousFocus = document.activeElement;
      shell.hidden = false;
      requestAnimationFrame(() => shell.classList.add('is-open'));
      document.body.classList.add('menu-open');
      openButton.setAttribute('aria-expanded', 'true');
      panel.focus();
    }
    function close() {
      shell.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      openButton.setAttribute('aria-expanded', 'false');
      setTimeout(() => { shell.hidden = true; previousFocus?.focus?.(); }, reducedMotion() ? 0 : 180);
    }
    openButton.addEventListener('click', open);
    closeButtons.forEach((button) => button.addEventListener('click', close));
    $$('a', panel).forEach((link) => link.addEventListener('click', close));
    document.addEventListener('keydown', (event) => {
      if (shell.hidden) return;
      if (event.key === 'Escape') close();
      if (event.key !== 'Tab') return;
      const items = focusable(); if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }

  function initServices() {
    const cards = $$('.service-card');
    cards.forEach((card) => {
      const toggle = $('.service-toggle', card);
      if (!toggle) return;
      toggle.addEventListener('click', () => {
        const opening = card.getAttribute('aria-expanded') !== 'true';
        cards.forEach((item) => { item.setAttribute('aria-expanded', 'false'); $('.service-panel', item)?.setAttribute('hidden', ''); });
        if (opening) { card.setAttribute('aria-expanded', 'true'); $('.service-panel', card)?.removeAttribute('hidden'); }
        toggle.setAttribute('aria-expanded', String(opening));
      });
      const category = card.dataset.category || '';
      const request = $('[data-request-service]', card);
      if (request) request.href = `connect.html?category=${encodeURIComponent(category)}&source=service-card`;
      const whatsapp = $('[data-whatsapp-service]', card);
      if (whatsapp) whatsapp.addEventListener('click', () => {
        const lang = getLanguage();
        const title = card.dataset[lang === 'ar' ? 'titleAr' : 'titleEn'] || category;
        const msg = lang === 'ar' ? `مرحبًا، أريد الاستفسار عن فئة: ${title}` : `Hello, I would like to ask about: ${title}`;
        whatsapp.href = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(msg)}`;
      });
    });
  }

  function initScrollStates() {
    const header = $('.header-frame');
    const navLinks = $$('[data-scroll-link]');
    const sections = $$('[data-scroll-section]');
    const topButton = $('[data-back-to-top]');
    let topLock = false;

    function setActive(id) {
      navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
    }
    const observer = new IntersectionObserver((entries) => {
      if (topLock) return;
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-25% 0px -60%', threshold: [0, .1, .35, .7] });
    sections.forEach((section) => observer.observe(section));

    function update() {
      const y = window.scrollY;
      header?.classList.toggle('is-scrolled', y > 24);
      if (topButton) {
        topButton.classList.toggle('is-visible', y > 500);
        const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
        topButton.style.setProperty('--progress', `${Math.min(360, y / max * 360)}deg`);
      }
      if (y < 100 && !topLock) setActive('hero');
    }
    window.addEventListener('scroll', update, { passive: true }); update();
    topButton?.addEventListener('click', () => {
      topLock = true; setActive('hero');
      window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
      const release = () => {
        if (window.scrollY <= 12) { topLock = false; setActive('hero'); window.removeEventListener('scroll', release); }
      };
      window.addEventListener('scroll', release, { passive: true });
      setTimeout(() => { topLock = false; setActive('hero'); }, reducedMotion() ? 50 : 1200);
    });
  }

  function initReviewBoard() {
    const frame = $('#preview-frame');
    const device = $('.preview-device');
    if (!frame || !device) return;
    $$('[data-viewport]').forEach((button) => button.addEventListener('click', () => {
      $$('[data-viewport]').forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      device.className = `preview-device ${button.dataset.viewport}`;
    }));
    $$('[data-preview-src]').forEach((button) => button.addEventListener('click', () => {
      $$('[data-preview-src]').forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active'); frame.src = button.dataset.previewSrc;
    }));
  }

  function initFooterGroups() {
    $$('.footer-group-toggle').forEach((button) => button.addEventListener('click', () => {
      if (innerWidth > 640) return;
      const group = button.closest('.footer-group');
      const open = group.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    hydrateIcons(); initLanguage(); applyConfigLinks(); initDynamicStatus(); initMenu(); initServices(); initScrollStates(); initReviewBoard(); initFooterGroups();
  });
})();
