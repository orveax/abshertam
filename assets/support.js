(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setLanguage(lang) {
    const safe = lang === 'en' ? 'en' : 'ar';
    document.documentElement.lang = safe;
    document.documentElement.dir = safe === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('aibshertam-lang', safe);
    $$('[data-lang-panel]').forEach((el) => { el.hidden = el.dataset.langPanel !== safe; });
    $$('[data-ar][data-en]').forEach((el) => { el.textContent = el.dataset[safe]; });
    $$('[data-lang-toggle]').forEach((button) => { button.textContent = safe === 'ar' ? 'English' : 'العربية'; });
    updateTocLabel();
    document.dispatchEvent(new CustomEvent('aibshertam:language', {detail:{lang:safe}}));
  }
  function language() { return localStorage.getItem('aibshertam-lang') === 'en' ? 'en' : 'ar'; }

  function initLanguage() {
    const requested = new URLSearchParams(location.search).get('lang');
    setLanguage(requested === 'en' || requested === 'ar' ? requested : language());
    $$('[data-lang-toggle]').forEach((button) => button.addEventListener('click', () => setLanguage(language() === 'ar' ? 'en' : 'ar')));
    $$('[data-preserve-lang]').forEach((link) => link.addEventListener('click', () => {
      try { const url = new URL(link.href, location.href); url.searchParams.set('lang', language()); link.href = url.toString(); } catch (_) {}
    }));
  }

  function initSupportMenu() {
    const shell = $('#support-menu'); const openBtn = $('[data-support-menu-open]');
    if (!shell || !openBtn) return;
    const panel = $('.support-menu-panel', shell);
    function open() { shell.hidden = false; requestAnimationFrame(() => shell.classList.add('is-open')); document.body.classList.add('menu-open'); openBtn.setAttribute('aria-expanded','true'); panel.focus(); }
    function close() { shell.classList.remove('is-open'); document.body.classList.remove('menu-open'); openBtn.setAttribute('aria-expanded','false'); setTimeout(() => shell.hidden = true, reduced() ? 0 : 180); }
    openBtn.addEventListener('click', open); $$('[data-support-menu-close]', shell).forEach((el) => el.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (!shell.hidden && e.key === 'Escape') close(); });
  }

  const tocButton = () => $('[data-toc-toggle]');
  const tocDrawer = () => $('[data-toc-drawer]');
  function updateTocLabel(active) {
    const button = tocButton(); if (!button) return;
    const current = active || $('.support-section.is-active h2') || $('.faq-category.is-active h2');
    const fallback = language() === 'ar' ? 'اختر قسمًا' : 'Choose a section';
    const label = current?.textContent?.trim() || fallback;
    const target = $('[data-toc-current]', button); if (target) target.textContent = label;
  }
  function initCompactToc() {
    const button = tocButton(), drawer = tocDrawer(); if (!button || !drawer) return;
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open)); drawer.hidden = !open;
    });
    $$('a', drawer).forEach((link) => link.addEventListener('click', () => { button.setAttribute('aria-expanded','false'); drawer.hidden = true; }));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { button.setAttribute('aria-expanded','false'); drawer.hidden = true; } });
  }

  function initSectionSpy() {
    const sections = $$('[data-support-section]'); if (!sections.length) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries.filter((x) => x.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
      if (!entry) return;
      sections.forEach((section) => section.classList.toggle('is-active', section === entry.target));
      $$('[data-toc-link]').forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
      updateTocLabel(entry.target.querySelector('h2'));
    }, { rootMargin: '-20% 0px -65%', threshold: [.05,.2,.6] });
    sections.forEach((section) => observer.observe(section));
  }

  function initFaq() {
    const details = $$('.faq-item');
    details.forEach((item) => item.addEventListener('toggle', () => {
      if (!item.open) return;
      details.filter((other) => other !== item).forEach((other) => { other.open = false; });
    }));
  }

  function initBackToTop() {
    const button = $('[data-back-to-top]'); if (!button) return;
    function update() {
      const y = scrollY, max = Math.max(document.documentElement.scrollHeight-innerHeight,1);
      button.classList.toggle('is-visible', y > 500); button.style.setProperty('--progress', `${Math.min(360,y/max*360)}deg`);
    }
    addEventListener('scroll', update, { passive:true }); update();
    button.addEventListener('click', () => scrollTo({ top:0, behavior: reduced() ? 'auto':'smooth' }));
  }

  function initPrint() { $$('[data-print]').forEach((button) => button.addEventListener('click', () => print())); }

  function updateDohaStatus() {
    const config = window.AIBSHER_CONFIG || {};
    const parts = new Intl.DateTimeFormat('en-GB', {timeZone: config.dohaTimeZone || 'Asia/Qatar', weekday:'short', hour:'2-digit', minute:'2-digit', hour12:false}).formatToParts(new Date()).reduce((a,p)=>{if(p.type!=='literal')a[p.type]=p.value;return a;},{});
    const mins = Number(parts.hour) * 60 + Number(parts.minute);
    const [sh,sm] = (config.operatingHours?.start || '06:30').split(':').map(Number);
    const [eh,em] = (config.operatingHours?.end || '15:30').split(':').map(Number);
    const open = mins >= sh*60+sm && mins <= eh*60+em;
    const ar = language() === 'ar';
    $$('[data-unit-status]').forEach(el => { el.textContent = open ? (ar ? 'متاحة الآن' : 'Open now') : (ar ? 'غير متاحة حاليًا' : 'Currently closed'); el.dataset.state = open ? 'open':'closed'; });
    $$('[data-doha-time]').forEach(el => { el.textContent = `${parts.hour}:${parts.minute} · ${parts.weekday}`; });
  }

  document.addEventListener('DOMContentLoaded', () => { initLanguage(); initSupportMenu(); initCompactToc(); initSectionSpy(); initFaq(); initBackToTop(); initPrint(); updateDohaStatus(); setInterval(updateDohaStatus,60000); document.addEventListener('aibshertam:language', updateDohaStatus); });
})();
