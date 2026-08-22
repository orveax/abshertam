(() => {
  const html = document.documentElement;
  const lang = html.lang === 'en' ? 'en' : 'ar';
  const menuButton = document.querySelector('[data-v2-menu-toggle]');
  const nav = document.querySelector('[data-v2-nav]');
  const whatsapp = document.querySelector('[data-v2-whatsapp]');
  const mobileCta = document.querySelector('[data-v2-mobile-cta]');
  const footer = document.querySelector('.v2-footer');
  const hero = document.querySelector('.v2-hero');
  const routes = window.AIBSHER_DATA && window.AIBSHER_DATA.routes;
  const services = window.AIBSHER_DATA && window.AIBSHER_DATA.services;
  const config = window.AIBSHER_CONFIG || {};

  if (menuButton && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
    };
    menuButton.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    nav.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
    document.addEventListener('click', e => {
      if (!nav.classList.contains('is-open')) return;
      if (!nav.contains(e.target) && !menuButton.contains(e.target)) setOpen(false);
    });
  }

  if (routes) {
    document.querySelectorAll('[data-route-key]').forEach(el => {
      const key = el.getAttribute('data-route-key');
      if (routes[key] && routes[key][lang]) el.setAttribute('href', routes[key][lang]);
    });
    document.querySelectorAll('[data-connect-service][data-connect-path]').forEach(el => {
      const base = routes.connect && routes.connect[lang] ? routes.connect[lang] : `/${lang}/connect/`;
      const serviceId = el.getAttribute('data-connect-service');
      const pathId = el.getAttribute('data-connect-path');
      const sourceId = el.getAttribute('data-source-id') || 'service-page';
      const params = new URLSearchParams({ master_service_id: serviceId, path_id: pathId, source_id: sourceId });
      el.setAttribute('href', `${base}?${params.toString()}`);
    });
  }

  if (Array.isArray(services)) {
    services.forEach(service => {
      document.querySelectorAll(`[data-service-id="${service.id}"] [data-service-title]`).forEach(el => { el.textContent = service[lang]; });
      service.paths.forEach(path => {
        document.querySelectorAll(`[data-path-id="${path.id}"] [data-path-title], [data-path-label="${path.id}"]`).forEach(el => { el.textContent = path[lang]; });
      });
    });
  }

  document.querySelectorAll('[data-resource-key]').forEach(control => {
    const key = control.getAttribute('data-resource-key');
    const enabled = window.AIBSHER_DATA && window.AIBSHER_DATA.resourceEnabled && window.AIBSHER_DATA.resourceEnabled(key);
    const url = enabled && window.AIBSHER_DATA.resourceUrl ? window.AIBSHER_DATA.resourceUrl(key) : '';
    if (!url) return;
    if (control.tagName === 'A') control.setAttribute('href', url);
    if (control.tagName === 'BUTTON') {
      const link = document.createElement('a');
      link.className = control.className;
      link.textContent = control.dataset.enabledLabel || control.textContent;
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener';
      control.replaceWith(link);
    }
  });

  if (whatsapp) {
    const number = String(config.whatsappNumber || '').replace(/\D/g, '');
    if (number) whatsapp.href = `https://wa.me/${number}`;
  }

  const updateFloating = () => {
    const threshold = hero ? Math.max(260, hero.offsetHeight * .68) : 360;
    const show = window.scrollY > threshold;
    if (whatsapp) whatsapp.classList.toggle('is-visible', show);
    if (mobileCta) mobileCta.classList.toggle('is-visible', show);
    if (footer && whatsapp && show) {
      const rect = footer.getBoundingClientRect();
      const overlap = Math.max(0, window.innerHeight - rect.top);
      if (overlap > 0) whatsapp.style.marginBottom = `${Math.min(overlap + 12, 220)}px`;
      else whatsapp.style.marginBottom = '';
    }
  };
  updateFloating();
  window.addEventListener('scroll', updateFloating, { passive: true });
  window.addEventListener('resize', updateFloating, { passive: true });
})();
