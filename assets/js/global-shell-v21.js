(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const mobile=()=>matchMedia('(max-width:48rem)').matches;
  const lang=()=>document.documentElement.lang==='en'?'en':'ar';
  function localizeLabels(){
    $$('[data-ar-label][data-en-label]').forEach(el=>el.setAttribute('aria-label',el.dataset[lang()==='en'?'enLabel':'arLabel']||el.getAttribute('aria-label')||''));
  }
  function currentYear(){
    const y=String(new Date().getFullYear());$$('[data-current-year]').forEach(el=>el.textContent=y);
  }
  function currentPage(){
    const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    document.body.dataset.currentPage=file.replace('.html','');
    $$('a[href]').forEach(a=>{
      let target='';try{target=new URL(a.getAttribute('href'),location.href).pathname.split('/').pop().toLowerCase();}catch(_){return;}
      if(!target)target='index.html';
      const same=target===file || (file==='index.html'&&target==='index.html');
      if(same && !a.hash){a.classList.add('is-current-page');a.setAttribute('aria-current','page');}
    });
  }
  function footerAccordion(){
    const groups=$$('[data-footer-group]');
    if(!groups.length)return;
    groups.forEach((group,i)=>{
      const btn=$('[data-footer-toggle]',group),panel=$('[data-footer-panel]',group);if(!btn||!panel)return;
      if(!panel.id)panel.id=`footer-panel-v21-${i+1}`;btn.setAttribute('aria-controls',panel.id);
      const set=open=>{btn.setAttribute('aria-expanded',String(open));panel.hidden=!open;};
      btn.addEventListener('click',()=>{if(!mobile())return;const willOpen=btn.getAttribute('aria-expanded')!=='true';groups.forEach(g=>{const b=$('[data-footer-toggle]',g),p=$('[data-footer-panel]',g);if(b&&p){b.setAttribute('aria-expanded','false');p.hidden=true;}});set(willOpen);});
      group._footerSet=set;
    });
    const sync=()=>{
      if(!mobile())groups.forEach(g=>g._footerSet?.(true));
      else {
        const current=groups.find(g=>g.querySelector('a.is-current-page,a[aria-current="page"]'))||groups[0];
        groups.forEach(g=>g._footerSet?.(g===current));
      }
    };
    matchMedia('(max-width:48rem)').addEventListener?.('change',sync);sync();
  }
  function trackerA11y(){
    const links=$$('[data-progress-target]');if(!links.length)return;
    const sync=()=>links.forEach(a=>{if(a.classList.contains('is-active'))a.setAttribute('aria-current','location');else if(a.getAttribute('aria-current')==='location')a.removeAttribute('aria-current');});
    links.forEach(a=>new MutationObserver(sync).observe(a,{attributes:true,attributeFilter:['class']}));sync();
  }
  function menuState(){
    const trigger=$('[data-menu-open]'),menu=$('#site-menu');if(!trigger||!menu)return;
    const sync=()=>menu.setAttribute('aria-hidden',String(menu.hidden));
    new MutationObserver(sync).observe(menu,{attributes:true,attributeFilter:['hidden']});sync();
  }
  function init(){currentYear();currentPage();localizeLabels();footerAccordion();trackerA11y();menuState();document.addEventListener('aibshertam:language',localizeLabels);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
