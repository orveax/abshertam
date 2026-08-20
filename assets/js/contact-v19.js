(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const lang=()=>document.documentElement.lang==='en'?'en':'ar';
  const tr=(ar,en)=>lang()==='en'?en:ar;

  const contactIcons={
    phone:'<path d="M8.4 4.2 6.8 5.8c-.8.8-.7 2.5.2 4.3 1.4 2.8 4.1 5.5 6.9 6.9 1.8.9 3.5 1 4.3.2l1.6-1.6-3.5-3.1-1.8 1.2c-.4.3-1 .3-1.5 0-1.2-.7-2.7-2.2-3.4-3.4-.3-.5-.3-1.1 0-1.5l1.2-1.8Z"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
    send:'<path d="M4 12 21 4l-7 17-2.5-6.5L4 12Z"/><path d="m11.5 14.5 4-4"/>'
  };

  function hydrateContactIcons(){
    $$('[data-contact-icon]').forEach(el=>{
      if(el.dataset.contactIconReady)return;
      const path=contactIcons[el.dataset.contactIcon]||contactIcons.mail;
      el.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
      el.dataset.contactIconReady='1';
    });
  }

  function validPhone(value){
    const v=value.trim();
    if(!v)return true;
    if(!/^[+0-9()\s-]+$/.test(v))return false;
    const digits=v.replace(/\D/g,'');
    return digits.length>=8&&digits.length<=15;
  }

  function validCombined(value){
    const v=value.trim();
    if(!v)return false;
    if(v.includes('@'))return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v);
    const digits=v.replace(/\\D/g,'');
    return digits.length>=8&&digits.length<=15;
  }

  function setFieldState(el,bad){
    el.setAttribute('aria-invalid',String(bad));
    const field=el.closest('.contact-v19-field,.contact-v19-consent');
    field?.classList.toggle('is-invalid',bad);
    const err=field?.querySelector('.contact-v19-error');
    if(err)err.hidden=!bad;
  }

  function validateField(el){
    let bad=false;
    const value=(el.value||'').trim();
    if(el.type==='checkbox')bad=!el.checked;
    else if(el.hasAttribute('data-contact-combined'))bad=!validCombined(value);
    else if(el.hasAttribute('data-contact-phone'))bad=!validPhone(value);
    else if(el.required)bad=!el.checkValidity()||value==='';
    else bad=!el.checkValidity();
    if(el.tagName==='TEXTAREA'&&el.minLength>0&&value.length<el.minLength)bad=true;
    setFieldState(el,bad);
    return !bad;
  }

  function initForm(form){
    const fields=$$('[data-contact-required],[data-contact-phone]',form);
    const status=$('[data-contact-status]',form);
    const success=$('[data-contact-success]',form);
    const liveValidate=e=>{if(e.target.matches('[data-contact-required],[data-contact-phone]'))validateField(e.target);};
    form.addEventListener('input',liveValidate);
    form.addEventListener('change',liveValidate);
    form.addEventListener('submit',e=>{
      e.preventDefault();
      let firstBad=null;
      fields.forEach(el=>{if(!validateField(el)&&!firstBad)firstBad=el;});
      if(firstBad){
        if(status){status.textContent=tr('راجع الحقول المعلّمة قبل المتابعة.','Review the highlighted fields before continuing.');status.dataset.state='error';}
        if(success)success.hidden=true;
        firstBad.focus();
        return;
      }
      if(status){status.textContent=tr('التحقق مكتمل. هذه النسخة لا ترسل البيانات إلى خادم بعد.','Validation complete. This build does not send data to a server yet.');status.dataset.state='success';}
      if(success)success.hidden=false;
    });
    form.addEventListener('reset',()=>setTimeout(()=>{
      fields.forEach(el=>setFieldState(el,false));
      if(status){status.textContent='';delete status.dataset.state;}
      if(success)success.hidden=true;
    },0));
  }

  function applyTopic(){
    const form=$('#contact-form-v19');if(!form)return;
    const topic=new URLSearchParams(location.search).get('topic');
    const select=$('select[name="subject"]',form);
    if(!select)return;
    const map={'company-profile':'profile','profile':'profile','partnership':'partnership','feedback':'feedback','general':'general'};
    if(map[topic])select.value=map[topic];
  }

  function init(){hydrateContactIcons();$$('[data-contact-form-v19]').forEach(initForm);applyTopic();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
