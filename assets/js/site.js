(() => {
  'use strict';
  const root = document.documentElement;
  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => [...r.querySelectorAll(s)];
  const config = window.AIBSHER_CONFIG || {};
  const pageMeta = {
    'index.html':{ar:['أبشر تم | معاملات وخدمات متنقلة في قطر','أبشر تم شركة قطرية خاصة ومرخصة لتنظيم ومتابعة طلبات المعاملات والخدمات عبر تجربة تشغيلية واضحة ووحدة خدمة متنقلة في قطر.'],en:['AIBSHER TAMM | Mobile Transaction Services in Qatar','AIBSHER TAMM is a licensed private Qatari company providing structured transaction follow-up and service-request support through a clear mobile service experience.']},
    'connect.html':{ar:['ابدأ طلب خدمة | أبشر تم','ابدأ طلبك لدى أبشر تم وحدد نوع العميل والمعاملة وبيانات التواصل والموعد المفضل والمرفقات المطلوبة للمراجعة الأولية.'],en:['Start a Service Request | AIBSHER TAMM','Start your AIBSHER TAMM request by providing your customer type, transaction details, contact information, preferred appointment, and optional review documents.']},
    'contact.html':{ar:['تواصل معنا | أبشر تم','تواصل مع أبشر تم للاستفسارات العامة أو طلب الخدمة أو واتساب أو معرفة القناة المناسبة لبدء معاملتك.'],en:['Contact Us | AIBSHER TAMM','Contact AIBSHER TAMM for general enquiries, service requests, WhatsApp support, or guidance on the right channel to start your transaction.']},
    'location.html':{ar:['موقع الوحدة المتنقلة | أبشر تم','اعرف موقع وحدة أبشر تم المتنقلة في ويست باي بالدوحة، وتحقق من حالة التشغيل قبل التوجه إلى نقطة الخدمة.'],en:['Mobile Unit Location | AIBSHER TAMM','Find the AIBSHER TAMM mobile service unit in West Bay, Doha, and check its operating status before visiting the service point.']},
    'faq.html':{ar:['الأسئلة الشائعة | أبشر تم','إجابات مختصرة عن خدمات أبشر تم، بدء الطلب، المواعيد، المستندات، الرسوم، المتابعة، الخصوصية وحدود دور الشركة.'],en:['Frequently Asked Questions | AIBSHER TAMM','Practical answers about AIBSHER TAMM services, requests, appointments, documents, fees, follow-up, privacy, and the company’s role.']},
    'terms.html':{ar:['الشروط والأحكام | أبشر تم','الشروط والأحكام المنظمة لاستخدام موقع أبشر تم وطلبات الخدمة والمسؤوليات والرسوم وحدود الدور التشغيلي.'],en:['Terms & Conditions | AIBSHER TAMM','Terms and conditions governing use of the AIBSHER TAMM website, service requests, responsibilities, fees, and operating boundaries.']},
    'privacy.html':{ar:['سياسة الخصوصية | أبشر تم','سياسة الخصوصية الخاصة بأبشر تم وتوضيح كيفية التعامل مع بيانات العملاء والمستندات وطلبات الخدمة وحقوق المستخدم.'],en:['Privacy Policy | AIBSHER TAMM','AIBSHER TAMM privacy policy explaining how customer data, documents, service requests, and user rights are handled.']}
  };
  const socialPlatforms = [
    ['instagram','IG','Instagram'],['facebook','f','Facebook'],['linkedin','in','LinkedIn'],['tiktok','♪','TikTok'],['youtube','▶','YouTube']
  ];
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const icons = {
    home:'<path d="M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3z"/>',
    company:'<rect x="4" y="4" width="16" height="17" rx="2"/><path d="M8 8h2m4 0h2M8 12h2m4 0h2M9 21v-5h6v5"/>',
    person:'<circle cx="12" cy="8" r="4"/><path d="M4.5 21c.8-4.2 3.3-6.5 7.5-6.5s6.7 2.3 7.5 6.5"/>',
    investor:'<path d="M4 20V10m6 10V4m6 16v-7m4 7V7"/><path d="m3 8 6-5 5 4 7-5"/>',
    building:'<path d="M3 21h18M5 21V7l7-4v18m0-12h7v12M8 9h1m-1 4h1m-1 4h1m7-4h1m-1 4h1"/>',
    passport:'<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="11" r="3"/><path d="M9 11h6M12 8c1.5 1.7 1.5 4.3 0 6m0-6c-1.5 1.7-1.5 4.3 0 6M9 17h6"/>',
    userdoc:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 14h8M8 18h6"/>',
    route:'<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3"/>',
    shield:'<path d="M12 3 20 6v6c0 5-3.4 8.1-8 10-4.6-1.9-8-5-8-10V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
    location:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    whatsapp:'<path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"/><path d="M9 8.5c.5 2.8 2.7 5 5.5 5.5"/>',
    file:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 14h8M8 18h6"/>',
    review:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8m-8 4h8m-8 4h5"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    question:'<circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.4 2.4 0 1 1 3.4 2.2c-.8.4-1.1.9-1.1 1.8M12 17h.01"/>',
    arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    signpost:'<path d="M12 22V4M6 6h11l2 3-2 3H6zM5 14h10l2 3-2 3H5z"/>',
    profile:'<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="9" r="3"/><path d="M7.5 18c.7-3 2.2-4.5 4.5-4.5s3.8 1.5 4.5 4.5"/>'
  };
  let lang = 'ar';
  let lastFocus = null;

  function hydrateIcons(){
    $$('[data-icon]').forEach(el => {
      if(el.dataset.iconReady) return;
      const path = icons[el.dataset.icon] || icons.question;
      el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
      el.dataset.iconReady = '1';
    });
  }
  function syncPageMetadata(){
    const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    const data=pageMeta[file]?.[lang]; if(!data)return;
    const [title,description]=data; document.title=title;
    const set=(selector,value)=>{const el=$(selector);if(el)el.setAttribute('content',value);};
    set('meta[name="description"]',description); set('meta[property="og:title"]',title); set('meta[property="og:description"]',description);
    set('meta[name="twitter:title"]',title); set('meta[name="twitter:description"]',description);
  }
  function renderSocials(){
    const socials=config.socials||{};
    $$('[data-social-links]').forEach(container=>{
      const nodes=socialPlatforms.map(([key,mark,label])=>{
        const url=String(socials[key]||'').trim();
        const el=document.createElement(url?'a':'span');
        el.className='global-social-v21__link'+(url?'':' is-pending');
        el.setAttribute('aria-label',url?label:(lang==='ar'?`${label} — الرابط قيد الإضافة`:`${label} — link pending`));
        el.title=url?label:(lang==='ar'?'الرابط قيد الإضافة':'Link pending');
        if(url){el.href=url;el.target='_blank';el.rel='noopener noreferrer';}
        else el.setAttribute('aria-disabled','true');
        const icon=document.createElement('b');icon.setAttribute('aria-hidden','true');icon.textContent=mark;
        const sr=document.createElement('span');sr.className='sr-only';sr.textContent=label;
        el.append(icon,sr);return el;
      });
      container.replaceChildren(...nodes);
    });
  }
  function storedLang(){
    try { return localStorage.getItem('aibshertam-language') === 'en' ? 'en' : 'ar'; } catch(_) { return 'ar'; }
  }
  function setLanguage(next){
    lang = next === 'en' ? 'en' : 'ar';
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    $$('[data-ar][data-en]').forEach(el => { el.textContent = el.dataset[lang] || el.textContent; });
    $$('[data-lang-panel]').forEach(el => { el.hidden = el.dataset.langPanel !== lang; });
    $$('[data-lang-label]').forEach(el => { el.textContent = lang === 'ar' ? 'EN' : 'AR'; });
    $$('[data-lang-toggle]').forEach(el => el.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'));
    try { localStorage.setItem('aibshertam-language',lang); } catch(_) {}
    syncPageMetadata(); renderSocials();
    document.dispatchEvent(new CustomEvent('aibshertam:language',{detail:{lang}}));
  }
  function initMenu(){
    const menu = $('#site-menu'); const open = $('[data-menu-open]'); const panel = menu?.querySelector('.slice-menu__panel');
    if(!menu || !open || !panel) return;
    const close = () => {
      menu.classList.remove('is-open'); document.body.classList.remove('menu-open'); open.setAttribute('aria-expanded','false');
      setTimeout(() => { menu.hidden = true; lastFocus?.focus?.(); }, reduced()?0:300);
    };
    open.addEventListener('click',() => {
      lastFocus = document.activeElement; menu.hidden = false; requestAnimationFrame(()=>menu.classList.add('is-open'));
      document.body.classList.add('menu-open'); open.setAttribute('aria-expanded','true'); setTimeout(()=>panel.focus(),reduced()?0:160);
    });
    $$('[data-menu-close]',menu).forEach(b=>b.addEventListener('click',close));
    $$('[data-menu-link]',menu).forEach(a=>a.addEventListener('click',close));
    document.addEventListener('keydown',e=>{
      if(menu.hidden) return;
      if(e.key==='Escape'){e.preventDefault();close();return;}
      if(e.key!=='Tab') return;
      const items=$$('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])',panel).filter(x=>!x.hidden);
      if(!items.length) return; const first=items[0],last=items.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    });
  }
  function initAnchors(){
    $$('a[href*="#"]').forEach(link=>link.addEventListener('click',e=>{
      let url; try{url=new URL(link.href,location.href);}catch(_){return;}
      if(url.pathname!==location.pathname || !url.hash) return;
      const target=$(url.hash); if(!target) return;
      e.preventDefault(); const run=()=>{target.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});history.replaceState(null,'',url.hash);};
      setTimeout(run,link.hasAttribute('data-menu-link')?320:0);
    }));
  }
  function unitStatus(){
    const parseClock=(value,fallback)=>{const m=/^(\d{1,2}):(\d{2})$/.exec(String(value||''));if(!m)return fallback;const n=Number(m[1])*60+Number(m[2]);return Number.isFinite(n)?n:fallback;};
    const zone=config.dohaTimeZone||'Asia/Qatar';let numeric={},display={};
    try{numeric=new Intl.DateTimeFormat('en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).reduce((a,p)=>{if(p.type!=='literal')a[p.type]=p.value;return a;},{});display=new Intl.DateTimeFormat(lang==='ar'?'ar-QA':'en-GB',{timeZone:zone,weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).reduce((a,p)=>{if(p.type!=='literal')a[p.type]=p.value;return a;},{});}catch(_){return;}
    const hours=config.operatingHours||{},mins=Number(numeric.hour)*60+Number(numeric.minute),start=parseClock(hours.start,390),end=parseClock(hours.end,930),open=mins>=start&&mins<end;
    $$('[data-unit-status]').forEach(el=>{el.textContent=open?(lang==='ar'?'متاحة الآن':'Open now'):(lang==='ar'?'غير متاحة حاليًا':'Currently closed');const p=el.closest('.at-status,.premium-menu-status,.footer-operating-v21,[data-unit-indicator]');p?.classList.toggle('is-open',open);p?.classList.toggle('is-closed',!open);});
    $$('[data-unit-indicator]').forEach(indicator=>{indicator.classList.toggle('is-open',open);indicator.classList.toggle('is-closed',!open);indicator.setAttribute('aria-label',open?(lang==='ar'?'حالة الوحدة — متاحة الآن':'Unit status — open now'):(lang==='ar'?'حالة الوحدة — غير متاحة حاليًا':'Unit status — currently closed'));});
    $$('[data-doha-time]').forEach(el=>{el.textContent=`${display.weekday} · ${display.hour}:${display.minute}`;el.dir='ltr';});
    document.dispatchEvent(new CustomEvent('aibshertam:unit-status',{detail:{open,start,end,timeZone:zone}}));
  }
  function markCurrentPage(){
    const name=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    const standalone=new Set(['faq.html','terms.html','privacy.html','contact.html','location.html','connect.html']);
    $$('a[href]').forEach(a=>{
      let url;try{url=new URL(a.getAttribute('href'),location.href);}catch(_){return;}
      const target=(url.pathname.split('/').pop()||'index.html').toLowerCase();
      const directCurrent=standalone.has(name)&&target===name&&!url.hash;
      a.classList.toggle('is-current-page',directCurrent);
      if(directCurrent)a.setAttribute('aria-current','page');
      else if(a.getAttribute('aria-current')==='page')a.removeAttribute('aria-current');
    });
  }
  function initBack(){
    const button=$('[data-back-to-top]');const header=$('[data-header]');const footer=$('.site-footer');
    const update=()=>{header?.classList.toggle('is-scrolled',scrollY>16);button?.classList.toggle('is-visible',scrollY>500);if(button&&footer){const r=footer.getBoundingClientRect();button.classList.toggle('is-over-footer',r.top<innerHeight&&r.bottom>0);}};
    addEventListener('scroll',update,{passive:true});addEventListener('resize',update,{passive:true});update();button?.addEventListener('click',()=>scrollTo({top:0,behavior:reduced()?'auto':'smooth'}));
  }
  function init(){
    hydrateIcons(); const q=new URLSearchParams(location.search).get('lang'); setLanguage(q==='en'||q==='ar'?q:storedLang());
    $$('[data-lang-toggle]').forEach(b=>b.addEventListener('click',()=>setLanguage(lang==='ar'?'en':'ar')));
    markCurrentPage();initMenu();initAnchors();initBack();unitStatus();setInterval(unitStatus,60000);document.addEventListener('aibshertam:language',unitStatus);
    $$('[data-location-link]').forEach(a=>{if(config.locationUrl)a.href=config.locationUrl;});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
