(() => {
  const language = document.documentElement.lang === 'en' ? 'en' : 'ar';
  const data = window.AIBSHER_DATA || {};
  const config = window.AIBSHER_CONFIG || {};
  const services = Array.isArray(data.services) ? data.services : [];
  const routeMap = data.routes || {};

  const serviceById = new Map(services.map((service) => [service.id, service]));
  const pathById = new Map();
  services.forEach((service) => {
    (service.paths || []).forEach((path) => pathById.set(path.id, path));
  });

  document.querySelectorAll('[data-service-id]').forEach((element) => {
    const service = serviceById.get(element.dataset.serviceId);
    const title = element.querySelector('h3');
    if (service && title && service[language]) title.textContent = service[language];
  });

  document.querySelectorAll('[data-path-id]').forEach((element) => {
    const path = pathById.get(element.dataset.pathId);
    if (!path || !path[language]) return;

    if (element.matches('.slice-family__paths span')) {
      element.textContent = path[language];
      return;
    }

    const title = element.querySelector('h3');
    if (title) title.textContent = path[language];
  });

  document.querySelectorAll('[data-route-key]').forEach((link) => {
    const route = routeMap[link.dataset.routeKey];
    if (route && route[language]) link.href = route[language];
  });

  document.querySelectorAll('[data-connect-service][data-connect-path]').forEach((link) => {
    const connectRoute = routeMap.connect && routeMap.connect[language];
    if (!connectRoute) return;
    const params = new URLSearchParams({
      master_service_id: link.dataset.connectService,
      path_id: link.dataset.connectPath,
      source_id: 'service-page'
    });
    link.href = `${connectRoute}?${params.toString()}`;
  });

  document.querySelectorAll('[data-resource-key]').forEach((button) => {
    const key = button.dataset.resourceKey;
    const url = typeof data.resourceUrl === 'function' ? data.resourceUrl(key) : '';
    if (!url) return;

    button.disabled = false;
    button.textContent = language === 'ar' ? 'عرض الملف' : 'View PDF';
    button.addEventListener('click', () => {
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });

  const menuButton = document.querySelector('[data-slice-menu-toggle]');
  const nav = document.querySelector('[data-slice-nav]');
  const whatsapp = document.querySelector('[data-slice-whatsapp]');
  const footer = document.querySelector('.slice-footer');

  if (menuButton && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
    };

    menuButton.addEventListener('click', () => {
      setOpen(!nav.classList.contains('is-open'));
    });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !menuButton.contains(event.target)) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  if (whatsapp) {
    const whatsappNumber = String(config.whatsappNumber || '').replace(/\D/g, '');
    if (whatsappNumber) whatsapp.href = `https://wa.me/${whatsappNumber}`;

    const updateFloatingState = () => {
      const show = window.scrollY > Math.min(window.innerHeight * 0.65, 520);
      whatsapp.classList.toggle('is-visible', show);

      if (!footer) return;
      const footerRect = footer.getBoundingClientRect();
      const footerOverlap = Math.max(0, window.innerHeight - footerRect.top);
      whatsapp.style.setProperty('--slice-wa-footer-lift', `${Math.ceil(footerOverlap)}px`);
    };

    updateFloatingState();
    window.addEventListener('scroll', updateFloatingState, { passive: true });
    window.addEventListener('resize', updateFloatingState, { passive: true });
  }
})();
