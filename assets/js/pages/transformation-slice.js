(() => {
  const menuButton = document.querySelector('[data-slice-menu-toggle]');
  const nav = document.querySelector('[data-slice-nav]');
  const whatsapp = document.querySelector('[data-slice-whatsapp]');

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

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  if (whatsapp) {
    const reveal = () => {
      const show = window.scrollY > Math.min(window.innerHeight * 0.65, 520);
      whatsapp.classList.toggle('is-visible', show);
    };
    reveal();
    window.addEventListener('scroll', reveal, { passive: true });
  }
})();
