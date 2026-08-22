(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const lang=document.documentElement.lang==='en'?'en':'ar';
  const t=(ar,en)=>lang==='en'?en:ar;
  const config=window.AIBSHER_CONFIG||{};

  function applyConfigLinks(){
    const phone=String(config.phoneNumber||config.whatsappNumber||'').replace(/\D/g,'');
    const wa=String(config.whatsappNumber||'').replace(/\D/g,'');
    $$('[data-config-phone]').forEach(a=>{ if(phone){a.href=`tel:+${phone}`; if(a.dataset.showValue==='true')a.textContent=`+${phone}`;} });
    $$('[data-config-whatsapp]').forEach(a=>{ if(wa)a.href=`https://wa.me/${wa}`; });
    $$('[data-config-map]').forEach(a=>{ if(config.locationUrl)a.href=config.locationUrl; });
    $$('[data-config-email]').forEach(a=>{ const key=a.dataset.configEmail||'general'; const email=config.emails&&config.emails[key]; if(email){a.href=`mailto:${email}`; if(a.dataset.showValue==='true')a.textContent=email;} });
  }

  function dohaNow(){
    const zone=config.dohaTimeZone||'Asia/Qatar';
    const now=new Date();
    const parts=new Intl.DateTimeFormat('en-GB',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false,weekday:'short'}).formatToParts(now).reduce((o,p)=>(o[p.type]=p.value,o),{});
    return {minutes:Number(parts.hour)*60+Number(parts.minute),parts,now,zone};
  }

  function initLocationStatus(){
    const status=$('[data-live-status]'); if(!status)return;
    const start=config.operatingHours?.start||'06:00', end=config.operatingHours?.end||'15:30';
    const toMin=v=>{const [h,m]=String(v).split(':').map(Number);return h*60+m;};
    const startM=toMin(start),endM=toMin(end);
    const render=()=>{
      let d; try{d=dohaNow();}catch(_){return;}
      const open=d.minutes>=startM&&d.minutes<endM;
      status.classList.toggle('is-open',open);
      const label=$('[data-status-label]',status); if(label)label.textContent=open?t('مفتوح الآن','Open now'):t('مغلق الآن','Closed now');
      const time=$('[data-doha-time]'); if(time)time.textContent=new Intl.DateTimeFormat(lang==='en'?'en-QA':'ar-QA',{timeZone:d.zone,hour:'numeric',minute:'2-digit'}).format(d.now);
      const date=$('[data-doha-date]'); if(date)date.textContent=new Intl.DateTimeFormat(lang==='en'?'en-QA':'ar-QA',{timeZone:d.zone,weekday:'short',day:'numeric',month:'short'}).format(d.now);
    };
    render(); setInterval(render,60000);
  }

  function initContactForm(){
    const form=$('[data-contact-form]'); if(!form)return;
    const endpoint=String(config.contactEndpoint||'').trim();
    const markInvalid=el=>{const w=el.closest('.support-v2__field,.support-v2__consent');w?.classList.add('is-invalid');el.setAttribute('aria-invalid','true');};
    const clear=()=>{form.querySelectorAll('.is-invalid').forEach(x=>x.classList.remove('is-invalid'));form.querySelectorAll('[aria-invalid="true"]').forEach(x=>x.removeAttribute('aria-invalid'));};
    const validate=()=>{clear();let ok=true;form.querySelectorAll('[required]').forEach(el=>{if(el.type==='checkbox'){if(!el.checked){ok=false;markInvalid(el)}}else if(!String(el.value||'').trim()||!el.checkValidity()){ok=false;markInvalid(el)}});if(!ok)form.querySelector('[aria-invalid="true"]')?.focus();return ok;};
    const payload=()=>Object.fromEntries([...new FormData(form).entries()].filter(([,v])=>!(v instanceof File)));
    const genericHandoffText=()=>t('مرحبًا، لدي استفسار عام من موقع أبشر تم.','Hello, I have a general enquiry from the AIBSHER TAMM website.');
    form.addEventListener('submit',async e=>{
      e.preventDefault();if(!validate())return;
      const d=payload();
      if(!endpoint){
        const box=$('[data-contact-handoff]');
        if(box){
          box.classList.add('is-visible');
          const wa=$('[data-contact-handoff-wa]',box);
          const num=String(config.whatsappNumber||'').replace(/\D/g,'');
          if(wa&&num)wa.href=`https://wa.me/${num}?text=${encodeURIComponent(genericHandoffText())}`;
          const mail=$('[data-contact-handoff-mail]',box);
          const email=config.emails?.general;
          if(mail&&email)mail.href=`mailto:${email}?subject=${encodeURIComponent(t('استفسار عام من الموقع','Website general enquiry'))}`;
        }
        return;
      }
      const submit=$('[type="submit"]',form);const old=submit.textContent;submit.disabled=true;submit.textContent=t('جارٍ الإرسال…','Sending…');
      try{const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});if(!r.ok)throw new Error();$('[data-contact-success]')?.classList.add('is-visible');form.reset();}catch(_){const box=$('[data-contact-error]');if(box){box.textContent=t('تعذر إرسال الاستفسار. بياناتك ما زالت موجودة ويمكنك المحاولة مرة أخرى.','The enquiry could not be sent. Your information is still available and you can try again.');box.classList.add('is-visible');}}finally{submit.disabled=false;submit.textContent=old;}
    });
  }

  applyConfigLinks();
  initLocationStatus();
  initContactForm();
})();
