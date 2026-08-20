(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const normalize=v=>(v||'').toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f\u064b-\u065f]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').trim();
  function initFaqSearch(){
    const input=$('[data-faq-search]'); if(!input)return;
    const clear=$('[data-faq-clear]'), count=$('[data-faq-count]'), empty=$('[data-faq-empty]');
    const items=$$('[data-faq-item]'), cats=$$('.faq-category-modern');
    const syncPlaceholder=()=>{input.placeholder=document.documentElement.lang==='en'?input.dataset.enPlaceholder:input.dataset.arPlaceholder;};
    const run=()=>{const q=normalize(input.value);let visible=0;items.forEach(item=>{const hay=normalize(item.textContent+' '+[...item.querySelectorAll('[data-ar],[data-en]')].map(x=>`${x.dataset.ar||''} ${x.dataset.en||''}`).join(' '));const show=!q||hay.includes(q);item.hidden=!show;if(show)visible++;});cats.forEach(cat=>cat.hidden=!$$('[data-faq-item]',cat).some(x=>!x.hidden));if(count)count.textContent=String(visible);if(empty)empty.hidden=visible!==0;};
    input.addEventListener('input',run);clear?.addEventListener('click',()=>{input.value='';run();input.focus();});document.addEventListener('aibshertam:language',()=>{syncPlaceholder();run();});syncPlaceholder();run();
  }
  function initReadingProgress(){
    if(!document.body.classList.contains('support-legal-v18'))return;
    const bar=document.createElement('div');bar.className='support-reading-progress';bar.setAttribute('aria-hidden','true');document.body.prepend(bar);
    const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;const p=max>0?Math.min(100,Math.max(0,scrollY/max*100)):0;document.documentElement.style.setProperty('--support-read-progress',`${p}%`);};addEventListener('scroll',update,{passive:true});addEventListener('resize',update,{passive:true});update();
  }
  function initLegalDisclosures(){
    const sections=$$('.legal-reader-section');if(!sections.length)return;
    const openSection=(target,focus=false)=>{
      const sec=typeof target==='string'?document.getElementById(target.replace(/^#/,'')):target;
      if(!sec||!sec.classList.contains('legal-reader-section'))return;
      const article=sec.closest('.legal-reader-article');
      $$('.legal-reader-section.is-open',article).forEach(other=>{if(other!==sec){other.classList.remove('is-open');const b=$('.legal-disclosure-trigger',other),p=$('.legal-disclosure-panel',other);b?.setAttribute('aria-expanded','false');if(p)p.hidden=true;}});
      sec.classList.add('is-open');const button=$('.legal-disclosure-trigger',sec),panel=$('.legal-disclosure-panel',sec);button?.setAttribute('aria-expanded','true');if(panel)panel.hidden=false;if(focus)button?.focus({preventScroll:true});
    };
    sections.forEach((sec,index)=>{
      if(sec.classList.contains('is-disclosure-ready'))return;
      const number=sec.querySelector(':scope > .legal-reader-number');const content=sec.querySelector(':scope > div');const title=content?.querySelector(':scope > h2');
      if(!number||!content||!title)return;
      const heading=document.createElement('h2');heading.className='legal-disclosure-heading';
      const button=document.createElement('button');button.type='button';button.className='legal-disclosure-trigger';button.setAttribute('aria-expanded','false');
      const panel=document.createElement('div');panel.className='legal-disclosure-panel';panel.id=`${sec.id}-panel`;panel.hidden=true;button.setAttribute('aria-controls',panel.id);
      const titleText=document.createElement('span');titleText.className='legal-disclosure-title';titleText.textContent=title.textContent.trim();
      const chevron=document.createElement('i');chevron.className='legal-disclosure-chevron';chevron.setAttribute('aria-hidden','true');
      number.remove();title.remove();button.append(number,titleText,chevron);heading.append(button);
      while(content.firstChild)panel.append(content.firstChild);content.remove();sec.replaceChildren(heading,panel);sec.classList.add('is-disclosure-ready');
      button.addEventListener('click',()=>{const opening=!sec.classList.contains('is-open');if(opening)openSection(sec);else{sec.classList.remove('is-open');button.setAttribute('aria-expanded','false');panel.hidden=true;}});
      if(index===0||sec.previousElementSibling?.closest('[data-lang-panel]')!==sec.closest('[data-lang-panel]'))openSection(sec);
    });
    window.AIBSHER_OPEN_LEGAL_SECTION=openSection;
    $$('.legal-toc a[href^="#"]').forEach(a=>a.addEventListener('click',()=>openSection(a.hash)));
    if(location.hash)openSection(location.hash);
    addEventListener('hashchange',()=>openSection(location.hash));
    document.addEventListener('aibshertam:language',()=>{const panel=$(`.legal-reader-article[data-lang-panel="${document.documentElement.lang==='en'?'en':'ar'}"]`);const current=$('.legal-reader-section.is-open',panel)||$('.legal-reader-section',panel);if(current)openSection(current);});
  }
  function init(){initFaqSearch();initReadingProgress();initLegalDisclosures();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
