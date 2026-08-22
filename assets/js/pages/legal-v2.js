(() => {
  'use strict';
  const select=document.querySelector('[data-legal-jump]');
  if(select){select.addEventListener('change',()=>{const target=document.querySelector(select.value);if(target)target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});});}
})();
