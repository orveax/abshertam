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

  /* Release-preparation SEO contract.
     v2 remains noindex in staging; these links prepare canonical/hreflang pairing
     without changing indexing state. Static head tags should replace this runtime
     fallback at Production Candidate if the final hosting/build process supports it. */
  const siteOrigin = String(config.siteUrl || 'https://abshertam.qa').replace(/\/$/, '');
  const pathname = window.location.pathname.endsWith('/') ? window.location.pathname : `${window.location.pathname}/`;
  const isArRoute = /^\/ar(?:\/|$)/.test(pathname);
  const isEnRoute = /^\/en(?:\/|$)/.test(pathname);
  const isHomeRoute = pathname === '/ar/' || pathname === '/en/';

  if (isHomeRoute) {
    html.classList.add('is-v2-home');
    if (!document.head.querySelector('link[data-home-enhancement]')) {
      const homeCss = document.createElement('link');
      homeCss.rel = 'stylesheet';
      homeCss.href = '/assets/css/pages/home-enhancement.css';
      homeCss.dataset.homeEnhancement = 'true';
      document.head.appendChild(homeCss);
    }
  }

  if (isArRoute || isEnRoute) {
    const arPath = isArRoute ? pathname : pathname.replace(/^\/en(?=\/|$)/, '/ar');
    const enPath = isEnRoute ? pathname : pathname.replace(/^\/ar(?=\/|$)/, '/en');
    const currentPath = lang === 'en' ? enPath : arPath;
    const ensureLink = (rel, href, hreflang = '') => {
      const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]:not([hreflang])`;
      let link = document.head.querySelector(selector);
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        if (hreflang) link.hreflang = hreflang;
        document.head.appendChild(link);
      }
      link.href = href;
    };
    ensureLink('canonical', `${siteOrigin}${currentPath}`);
    ensureLink('alternate', `${siteOrigin}${arPath}`, 'ar');
    ensureLink('alternate', `${siteOrigin}${enPath}`, 'en');
    ensureLink('alternate', `${siteOrigin}${arPath}`, 'x-default');
  }

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

  const replaceTrustLabel = (el, label) => {
    if (!el) return;
    const marker = el.querySelector('i');
    el.textContent = '';
    if (marker) el.appendChild(marker);
    el.appendChild(document.createTextNode(label));
  };

  const initHomePresentation = () => {
    if (!isHomeRoute) return;

    const heroLead = hero && hero.querySelector('.v2-hero__lead');
    if (heroLead) {
      heroLead.textContent = lang === 'en'
        ? 'We help you understand your transaction requirements, prepare what is needed, and follow up the steps within our service scope — clearly and systematically.'
        : 'نساعدك على فهم متطلبات معاملتك، تجهيز ما يلزم، ومتابعة الخطوات التي تدخل ضمن نطاق خدمتنا — بصورة واضحة ومنظمة.';
    }

    const trustItems = hero ? [...hero.querySelectorAll('.v2-trust span')] : [];
    const trustLabels = lang === 'en'
      ? ['Private company licensed in Qatar', 'We start with your transaction', 'Not a government authority']
      : ['شركة خاصة مرخصة في قطر', 'نبدأ من معاملتك', 'لسنا جهة حكومية'];
    trustItems.forEach((item, index) => replaceTrustLabel(item, trustLabels[index] || item.textContent));

    document.querySelectorAll('#services .v2-family__no').forEach((el, index) => {
      el.textContent = String(index + 1).padStart(2, '0');
    });

    const unitMedia = document.querySelector('main > .v2-section--warm .v2-split .v2-media');
    if (unitMedia) {
      unitMedia.classList.add('is-home-unit-media');
      const unitImage = unitMedia.querySelector('img');
      if (unitImage) {
        unitImage.loading = 'lazy';
        unitImage.decoding = 'async';
      }
      const unitSection = unitMedia.closest('.v2-section');
      const title = unitSection && unitSection.querySelector('.v2-title');
      const lead = unitSection && unitSection.querySelector('.v2-lead');
      const proof = unitSection ? [...unitSection.querySelectorAll('.v2-proof-list div')] : [];
      if (title) title.textContent = lang === 'en'
        ? 'A mobile service channel designed to bring support closer to you.'
        : 'الوحدة المتنقلة تقرّب الخدمة منك.';
      if (lead) lead.textContent = lang === 'en'
        ? 'Part of the AIBSHER TAMM service experience for selected transaction support, depending on the requirements of each case.'
        : 'جزء من تجربة أبشر تم لتقديم الدعم ومراجعة معاملات مختارة بصورة أقرب وأسهل، بحسب نوع المعاملة وما تتطلبه من حضور أو متابعة.';
      const proofLabels = lang === 'en'
        ? ['A real service and support channel.', 'Clear location and operating hours.', 'Visit requirements depend on the transaction.']
        : ['قناة فعلية لتقديم الخدمة والدعم.', 'موقع وساعات تشغيل واضحة.', 'احتياج الزيارة يعتمد على نوع المعاملة.'];
      proof.forEach((item, index) => { if (proofLabels[index]) item.textContent = proofLabels[index]; });
    }

    const process = document.querySelector('.v2-steps');
    if (process) {
      const processSection = process.closest('.v2-section');
      const eyebrow = processSection && processSection.querySelector('.v2-eyebrow');
      const title = processSection && processSection.querySelector('.v2-title');
      if (eyebrow) eyebrow.textContent = lang === 'en' ? 'After you submit your request' : 'بعد إرسال طلبك';
      if (title) title.textContent = lang === 'en'
        ? 'A clear journey from request receipt to the next step.'
        : 'رحلة واضحة من استلام الطلب إلى الخطوة التالية.';
    }

    const heroImage = hero && hero.querySelector('.v2-hero__frame img');
    if (heroImage) {
      heroImage.setAttribute('fetchpriority', 'high');
      heroImage.decoding = 'async';
    }

    const resourceControls = [...document.querySelectorAll('.v2-resource-strip [data-resource-key]')];
    if (resourceControls.length) {
      let activeCount = 0;
      resourceControls.forEach(control => {
        const key = control.getAttribute('data-resource-key');
        const enabled = Boolean(window.AIBSHER_DATA && window.AIBSHER_DATA.resourceEnabled && window.AIBSHER_DATA.resourceEnabled(key));
        const card = control.closest('.v2-resource');
        if (!enabled && card) card.hidden = true;
        if (enabled) activeCount += 1;
      });
      if (activeCount === 0) {
        document.querySelector('.v2-resource-strip')?.closest('.v2-section')?.classList.add('is-home-resources-hidden');
      }
    }
  };

  initHomePresentation();

  if (whatsapp) {
    const number = String(config.whatsappNumber || '').replace(/\D/g, '');
    if (number) whatsapp.href = `https://wa.me/${number}`;
  }

  const updateFloating = () => {
    const threshold = hero ? Math.max(260, hero.offsetHeight * .68) : 360;
    const show = window.scrollY > threshold;
    if (whatsapp) whatsapp.classList.toggle('is-visible', show);
    if (mobileCta) mobileCta.classList.toggle('is-visible', show);
    if (isHomeRoute) document.querySelector('.v2-header')?.classList.toggle('is-home-scrolled', window.scrollY > 24);
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
