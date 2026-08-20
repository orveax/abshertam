(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  function initFaq(){
    const items=$$('[data-faq-item]');items.forEach(item=>item.addEventListener('toggle',()=>{if(item.open)items.forEach(other=>{if(other!==item)other.open=false;});}));
    const cats=$$('.faq-category-modern'),links=$$('.faq-category-nav a[href^="#"]');if(cats.length&&'IntersectionObserver'in window){const ob=new IntersectionObserver(entries=>{const cur=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(cur)links.forEach(a=>a.classList.toggle('is-active',a.hash===`#${cur.target.id}`));},{rootMargin:'-25% 0px -65% 0px',threshold:[.08,.3]});cats.forEach(c=>ob.observe(c));}
  }
  function initLegal(){
    const select=$('[data-legal-jump]');
    const mobileToc=$('.legal-mobile-toc');
    let premiumNav=null;
    let premiumTrigger=null;
    let premiumCurrent=null;
    let premiumOptions=null;

    const getLang=()=>document.documentElement.lang==='en'?'en':'ar';
    const getSourceLinks=()=>{
      const panel=$(`.legal-toc [data-lang-panel="${getLang()}"]`);
      return panel?$$('a[href^="#"]',panel):[];
    };
    const currentLabel=()=>getLang()==='en'?'Jump to section':'انتقل إلى القسم';
    const chooseLabel=()=>getLang()==='en'?'Choose a section':'اختر قسمًا';

    const closePremium=()=>{
      if(!premiumNav||!premiumTrigger||!premiumOptions)return;
      premiumNav.classList.remove('is-open');
      premiumTrigger.setAttribute('aria-expanded','false');
      premiumOptions.hidden=true;
    };

    const syncPremium=(hash)=>{
      if(!premiumNav)return;
      const options=$$('a[href^="#"]',premiumNav);
      options.forEach(a=>a.classList.toggle('is-active',a.hash===hash));
      const active=options.find(a=>a.hash===hash);
      if(premiumCurrent){
        premiumCurrent.textContent=active?.querySelector('strong')?.textContent.trim()||chooseLabel();
      }
    };

    const buildPremium=()=>{
      if(!mobileToc)return;
      const links=getSourceLinks();
      if(!links.length)return;
      if(!premiumNav){
        premiumNav=document.createElement('div');
        premiumNav.className='legal-jump-premium';
        premiumTrigger=document.createElement('button');
        premiumTrigger.type='button';
        premiumTrigger.className='legal-jump-trigger';
        premiumTrigger.setAttribute('aria-expanded','false');
        premiumTrigger.innerHTML='<span class="legal-jump-trigger__label"></span><strong class="legal-jump-trigger__current"></strong><i aria-hidden="true"></i>';
        premiumCurrent=$('.legal-jump-trigger__current',premiumTrigger);
        premiumOptions=document.createElement('div');
        premiumOptions.className='legal-jump-options';
        premiumOptions.hidden=true;
        premiumNav.append(premiumTrigger,premiumOptions);
        mobileToc.append(premiumNav);
        mobileToc.classList.add('is-enhanced');
        premiumTrigger.addEventListener('click',()=>{
          const open=!premiumNav.classList.contains('is-open');
          premiumNav.classList.toggle('is-open',open);
          premiumTrigger.setAttribute('aria-expanded',String(open));
          premiumOptions.hidden=!open;
        });
      }
      $('.legal-jump-trigger__label',premiumTrigger).textContent=currentLabel();
      premiumOptions.replaceChildren(...links.map(source=>{
        const a=document.createElement('a');
        a.href=source.hash;
        const number=source.querySelector('span')?.textContent.trim()||'';
        const title=source.querySelector('strong')?.textContent.trim()||source.textContent.trim();
        a.innerHTML=`<span>${number}</span><strong></strong><i aria-hidden="true"></i>`;
        $('strong',a).textContent=title;
        a.addEventListener('click',e=>{
          e.preventDefault();
          const target=$(a.hash);
          if(target){
            window.AIBSHER_OPEN_LEGAL_SECTION?.(target);
            target.scrollIntoView({behavior:'smooth',block:'start'});
            history.replaceState(null,'',a.hash);
          }
          if(select)select.value=a.hash;
          syncPremium(a.hash);
          closePremium();
        });
        return a;
      }));
      const currentHash=select?.value||location.hash;
      syncPremium(currentHash);
    };

    const rebuildJump=()=>{
      const links=getSourceLinks();
      if(select){
        select.replaceChildren(new Option(chooseLabel(),''),...links.map(a=>new Option(a.querySelector('strong')?.textContent.trim()||a.textContent.trim(),a.hash)));
      }
      buildPremium();
    };

    if(select)select.addEventListener('change',()=>{const target=$(select.value);if(target){window.AIBSHER_OPEN_LEGAL_SECTION?.(target);target.scrollIntoView({behavior:'smooth',block:'start'});}if(select.value){history.replaceState(null,'',select.value);syncPremium(select.value);}});
    rebuildJump();
    document.addEventListener('aibshertam:language',()=>{closePremium();rebuildJump();});
    document.addEventListener('click',e=>{if(premiumNav&&!premiumNav.contains(e.target))closePremium();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closePremium();});
    $('[data-print-document]')?.addEventListener('click',()=>window.print());

    const sections=$$('.legal-reader-section'),links=$$('.legal-toc a[href^="#"]');
    if(sections.length&&'IntersectionObserver'in window){
      const ob=new IntersectionObserver(entries=>{
        const cur=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
        if(cur){
          const hash=`#${cur.target.id}`;
          links.forEach(a=>a.classList.toggle('is-active',a.hash===hash));
          if(select&&select.value!==hash)select.value=hash;
          syncPremium(hash);
        }
      },{rootMargin:'-20% 0px -70% 0px',threshold:[.05,.2]});
      sections.forEach(s=>ob.observe(s));
    }
  }
  function initContact(){
    const form=$('#general-contact-form');if(!form)return;const success=$('[data-contact-success]',form);
    form.addEventListener('submit',e=>{e.preventDefault();let ok=true;$$('[required]',form).forEach(el=>{const field=el.closest('.at-field,.at-check');const bad=!el.checkValidity();field?.classList.toggle('is-invalid',bad);const msg=field?.querySelector('.at-field__validation');if(msg)msg.hidden=!bad;if(bad)ok=false;});if(!ok){form.querySelector(':invalid')?.focus();return;}form.reset();setTimeout(()=>success.hidden=false,0);});
    form.addEventListener('reset',()=>setTimeout(()=>{success.hidden=true;$$('.is-invalid',form).forEach(x=>x.classList.remove('is-invalid'));},0));
  }
  function init(){initFaq();initLegal();initContact();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
