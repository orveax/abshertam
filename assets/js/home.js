(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initAudience(){
    const cards=$$('[data-audience-choice]');
    if(!cards.length)return;
    const select=card=>{
      cards.forEach(c=>{const on=c===card;c.classList.toggle('is-selected',on);c.setAttribute('aria-pressed',String(on));});
    };
    cards.forEach((card,index)=>{
      card.addEventListener('click',e=>{if(e.target.closest('a'))return;select(card);});
      card.addEventListener('keydown',e=>{
        if(e.key==='Enter'||e.key===' '){e.preventDefault();select(card);return;}
        if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(e.key))return;
        e.preventDefault();
        const rtl=document.documentElement.dir==='rtl';
        let next=index;
        if(e.key==='Home')next=0;
        else if(e.key==='End')next=cards.length-1;
        else if(e.key==='ArrowDown'||(e.key==='ArrowRight'&&!rtl)||(e.key==='ArrowLeft'&&rtl))next=(index+1)%cards.length;
        else next=(index-1+cards.length)%cards.length;
        cards[next].focus();select(cards[next]);
      });
    });
    select(cards.find(c=>c.getAttribute('aria-pressed')==='true')||cards[0]);
  }

  function initHomeHelp(){
    const wraps=$$('[data-home-help-wrap]');
    if(!wraps.length)return;
    const close=wrap=>{
      const trigger=$('[data-home-help-trigger]',wrap),panel=$('[data-home-help-panel]',wrap);
      if(!trigger||!panel)return;
      trigger.setAttribute('aria-expanded','false');
      panel.hidden=true;
      wrap.classList.remove('is-open');
    };
    wraps.forEach(wrap=>{
      const trigger=$('[data-home-help-trigger]',wrap),panel=$('[data-home-help-panel]',wrap);
      if(!trigger||!panel)return;
      trigger.addEventListener('click',event=>{
        event.stopPropagation();
        const open=trigger.getAttribute('aria-expanded')==='true';
        wraps.forEach(other=>{if(other!==wrap)close(other);});
        trigger.setAttribute('aria-expanded',String(!open));
        panel.hidden=open;
        wrap.classList.toggle('is-open',!open);
      });
      trigger.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();close(wrap);trigger.focus();}});
      panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();close(wrap);trigger.focus();}});
    });
    document.addEventListener('click',event=>{wraps.forEach(wrap=>{if(!wrap.contains(event.target))close(wrap);});});
  }

  function initServices(){
    const buttons=$$('[data-service-selector]');
    const panels=$$('[data-service-panel]');
    const accordions=$$('[data-service-accordion]');
    if(!buttons.length&&!accordions.length)return;
    const select=key=>{
      buttons.forEach(b=>{const on=b.dataset.serviceSelector===key;b.classList.toggle('is-selected',on);b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;});
      panels.forEach(p=>{const on=p.dataset.servicePanel===key;p.classList.toggle('is-active',on);p.hidden=!on;});
    };
    buttons.forEach((button,index)=>{
      button.addEventListener('click',()=>select(button.dataset.serviceSelector));
      button.addEventListener('keydown',e=>{
        if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
        e.preventDefault();
        let next=index;
        if(e.key==='Home')next=0;
        else if(e.key==='End')next=buttons.length-1;
        else if(e.key==='ArrowDown'||e.key==='ArrowRight')next=(index+1)%buttons.length;
        else next=(index-1+buttons.length)%buttons.length;
        buttons[next].focus();select(buttons[next].dataset.serviceSelector);
      });
    });
    accordions.forEach(item=>item.addEventListener('toggle',()=>{
      if(!item.open)return;
      accordions.forEach(other=>{if(other!==item)other.open=false;});
      select(item.dataset.serviceAccordion);
    }));
    select(buttons.find(b=>b.getAttribute('aria-selected')==='true')?.dataset.serviceSelector||accordions.find(a=>a.open)?.dataset.serviceAccordion||'corporate');
  }

  function initUnitExperience(){
    const stages=$$('[data-unit-stage]');
    const panel=$('.unit-operating-panel-v15');
    if(!stages.length||!panel)return;
    const number=$('[data-unit-current-number]',panel);
    const title=$('[data-unit-current-title]',panel);
    const description=$('[data-unit-current-description]',panel);
    const facts=$$('[data-unit-fact]',panel);
    const image=$('[data-alt-ar][data-alt-en]',panel);
    let current=stages.find(stage=>stage.getAttribute('aria-pressed')==='true')||stages[0];
    const apply=stage=>{
      current=stage;
      const lang=document.documentElement.lang==='en'?'en':'ar';
      stages.forEach(item=>{
        const on=item===stage;
        item.classList.toggle('is-selected',on);
        item.setAttribute('aria-pressed',String(on));
        const state=$('.unit-stage-v15__state',item);
        if(state)state.textContent=on?(lang==='en'?'Current stage':'المرحلة الحالية'):(lang==='en'?'View details':'اعرض التفاصيل');
      });
      if(number)number.textContent=stage.dataset.unitStage||'';
      if(title)title.textContent=stage.dataset[`stageTitle${lang==='en'?'En':'Ar'}`]||'';
      if(description)description.textContent=stage.dataset[`stageDescription${lang==='en'?'En':'Ar'}`]||'';
      facts.forEach((fact,index)=>{
        const n=index+1;
        const suffix=lang==='en'?'En':'Ar';
        const factTitle=$('[data-unit-fact-title]',fact);
        const factCopy=$('[data-unit-fact-copy]',fact);
        if(factTitle)factTitle.textContent=stage.dataset[`stageFact${n}Title${suffix}`]||'';
        if(factCopy)factCopy.textContent=stage.dataset[`stageFact${n}Copy${suffix}`]||'';
      });
      if(image)image.alt=image.dataset[`alt${lang==='en'?'En':'Ar'}`]||image.alt;
    };
    stages.forEach((stage,index)=>{
      stage.addEventListener('click',()=>apply(stage));
      stage.addEventListener('keydown',event=>{
        if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
        event.preventDefault();
        const rtl=document.documentElement.dir==='rtl';
        let next=index;
        if(event.key==='Home')next=0;
        else if(event.key==='End')next=stages.length-1;
        else if(event.key==='ArrowDown'||(event.key==='ArrowRight'&&!rtl)||(event.key==='ArrowLeft'&&rtl))next=(index+1)%stages.length;
        else next=(index-1+stages.length)%stages.length;
        stages[next].focus();apply(stages[next]);
      });
    });
    document.addEventListener('aibshertam:language',()=>apply(current));
    apply(current);
  }

  function initJourney(){
    const stages=$$('[data-journey-stage]');
    if(!stages.length)return;
    const select=stage=>{
      stages.forEach(s=>{
        const on=s===stage;
        s.setAttribute('aria-pressed',String(on));
        s.classList.toggle('is-selected',on);
        if(on)s.setAttribute('aria-current','step');else s.removeAttribute('aria-current');
      });
    };
    const move=(index,key)=>{
      const rtl=document.documentElement.dir==='rtl';
      if(key==='Home')return 0;
      if(key==='End')return stages.length-1;
      if(key==='ArrowDown')return (index+1)%stages.length;
      if(key==='ArrowUp')return (index-1+stages.length)%stages.length;
      if(key==='ArrowRight')return rtl?(index-1+stages.length)%stages.length:(index+1)%stages.length;
      if(key==='ArrowLeft')return rtl?(index+1)%stages.length:(index-1+stages.length)%stages.length;
      return index;
    };
    stages.forEach((stage,index)=>{
      stage.addEventListener('click',()=>select(stage));
      stage.addEventListener('keydown',event=>{
        if(event.key==='Enter'||event.key===' '){event.preventDefault();select(stage);return;}
        if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
        event.preventDefault();
        const next=move(index,event.key);
        stages[next].focus();
        select(stages[next]);
      });
    });
    select(stages.find(stage=>stage.getAttribute('aria-pressed')==='true')||stages[0]);
  }
  function initProgress(){
    const sections=$$('[data-progress-section]');const links=$$('[data-progress-target]');const compact=$('[data-home-progress-compact]');const rail=$('[data-home-progress]');const footer=$('.site-footer');
    if(!sections.length)return;
    let ticking=false;
    const set=section=>{
      const id=section?.id;if(!id)return;const active=links.find(a=>a.dataset.progressTarget===id);links.forEach(a=>a.classList.toggle('is-active',a===active));
      if(active&&compact){const lang=document.documentElement.lang==='en'?'en':'ar';$('[data-progress-current]',compact).textContent=active.dataset.progressIndex;$('[data-progress-current-label]',compact).textContent=section.dataset[`progressLabel${lang==='en'?'En':'Ar'}`]||active.querySelector('span')?.textContent||'';}
    };
    const syncFooterZone=()=>{const nearFooter=!!footer&&footer.getBoundingClientRect().top<=innerHeight;rail?.classList.toggle('is-footer-zone',nearFooter);compact?.classList.toggle('is-footer-zone',nearFooter);};
    const update=()=>{ticking=false;const marker=Math.min(innerHeight*.34,260);let current=sections[0];for(const section of sections){if(section.getBoundingClientRect().top<=marker)current=section;else break;}set(current);syncFooterZone();};
    const schedule=()=>{if(!ticking){ticking=true;requestAnimationFrame(update);}};
    addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});document.addEventListener('aibshertam:language',schedule);update();
  }
  function initNav(){
    const sections=$$('#main-content>section[id]'),links=$$('.slice-nav a[href^="#"]');if(!sections.length||!('IntersectionObserver'in window))return;
    const ob=new IntersectionObserver(entries=>{const cur=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!cur)return;links.forEach(a=>a.classList.toggle('is-active',a.hash===`#${cur.target.id}`));},{rootMargin:'-30% 0px -60% 0px',threshold:[.1,.3]});sections.forEach(s=>ob.observe(s));
  }
  function initMiniContact(){
    const form=$('#home-general-enquiry');if(!form)return;const status=$('[data-mini-contact-status]',form);const fields=$$('[required]',form);
    const validate=()=>{let ok=true;fields.forEach(el=>{const bad=!el.checkValidity();el.setAttribute('aria-invalid',String(bad));el.closest('label')?.classList.toggle('is-invalid',bad);const msg=el.closest('label')?.querySelector('.contact-field-error');if(msg)msg.hidden=!bad;if(bad&&ok){ok=false;el.focus();}});return ok;};
    fields.forEach(el=>el.addEventListener('input',()=>{if(el.checkValidity()){el.setAttribute('aria-invalid','false');el.closest('label')?.classList.remove('is-invalid');const msg=el.closest('label')?.querySelector('.contact-field-error');if(msg)msg.hidden=true;}}));
    form.addEventListener('submit',e=>{e.preventDefault();if(!validate()){status.textContent=document.documentElement.lang==='en'?'Please complete the required fields.':'يرجى استكمال الحقول المطلوبة.';status.dataset.state='error';return;}status.textContent=document.documentElement.lang==='en'?'Your enquiry has been prepared for review. The team will contact you through the supplied channel.':'تم تجهيز استفسارك للمراجعة، وسيتواصل الفريق عبر وسيلة التواصل المدخلة.';status.dataset.state='success';form.reset();});
  }
  function init(){initAudience();initHomeHelp();initServices();initUnitExperience();initJourney();initProgress();initMiniContact();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
