(() => {
  'use strict';
  const form = document.getElementById('connect-v2-form');
  if (!form) return;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
  const t = (ar, en) => lang === 'en' ? en : ar;
  const services = (window.AIBSHER_DATA && window.AIBSHER_DATA.services) || [];
  const config = window.AIBSHER_CONFIG || {};
  const steps = $$('.connect-v2__step-screen', form);
  const navSteps = $$('.connect-v2__step');
  const storageKey = `aibshertam-connect-v2-${lang}`;
  const params = new URLSearchParams(location.search);
  let current = 0;
  let maxReached = 0;
  let submitting = false;

  const store = (() => {
    try {
      const s = sessionStorage, k = '__at_connect_v2__';
      s.setItem(k, '1'); s.removeItem(k); return s;
    } catch (_) {
      const m = new Map(); return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};
    }
  })();

  const serviceById = id => services.find(s => s.id === id);
  const pathById = id => {
    for (const service of services) {
      const path = service.paths.find(p => p.id === id);
      if (path) return {service, path};
    }
    return null;
  };

  function setHidden(name, value='') {
    const el = form.elements.namedItem(name);
    if (el && !(el instanceof RadioNodeList)) el.value = value;
  }

  function getValue(name) {
    const f = form.elements.namedItem(name);
    if (!f) return '';
    if (f instanceof RadioNodeList) return f.value || '';
    if (f.type === 'checkbox') return f.checked ? (f.value || 'on') : '';
    return String(f.value || '').trim();
  }

  function setNamedValue(name, value) {
    const f = form.elements.namedItem(name);
    if (!f || value === undefined || value === null) return;
    if (f instanceof RadioNodeList) {
      [...form.querySelectorAll(`[name="${CSS.escape(name)}"]`)].forEach(el => el.checked = el.value === String(value));
    } else if (f.type === 'checkbox') {
      f.checked = value === true || value === 'true' || value === 'on' || value === f.value;
    } else f.value = String(value);
  }

  function renderTransactionChooser() {
    const wrap = $('[data-transaction-chooser]');
    if (!wrap) return;
    wrap.innerHTML = '';
    services.forEach((service, index) => {
      const article = document.createElement('article');
      article.className = 'connect-v2__service';
      article.dataset.serviceId = service.id;
      const head = document.createElement('label');
      head.className = 'connect-v2__service-head';
      head.innerHTML = `<input type="radio" name="master_service_choice" value="${service.id}"><span><strong>${service[lang]}</strong><small>${String(index+1).padStart(2,'0')} / ${service.id}</small></span><span aria-hidden="true">+</span>`;
      const paths = document.createElement('div');
      paths.className = 'connect-v2__paths';
      service.paths.forEach(path => {
        const label = document.createElement('label');
        label.className = 'connect-v2__path';
        label.innerHTML = `<input type="radio" name="path_choice" value="${path.id}"><span><strong>${path[lang]}</strong></span>`;
        paths.append(label);
      });
      article.append(head, paths);
      wrap.append(article);
    });
  }

  function selectedServiceId() { return getValue('master_service_id'); }
  function selectedPathId() { return getValue('path_id'); }
  function isNotSure() { return getValue('not_sure') === 'true'; }

  function selectService(serviceId, {clearPath=true}={}) {
    if (!serviceById(serviceId)) return;
    setHidden('master_service_id', serviceId);
    if (clearPath) setHidden('path_id', '');
    setHidden('not_sure', 'false');
    $$('[name="master_service_choice"]').forEach(r => r.checked = r.value === serviceId);
    $$('[data-service-id]').forEach(card => card.classList.toggle('is-selected', card.dataset.serviceId === serviceId));
    if (clearPath) $$('[name="path_choice"]').forEach(r => r.checked = false);
    const ns = $('[name="not_sure_choice"]'); if (ns) ns.checked = false;
    syncConditionalFields();
  }

  function selectPath(pathId) {
    const found = pathById(pathId); if (!found) return;
    selectService(found.service.id, {clearPath:false});
    setHidden('path_id', pathId);
    setHidden('not_sure', 'false');
    $$('[name="path_choice"]').forEach(r => r.checked = r.value === pathId);
    syncConditionalFields();
  }

  function selectNotSure() {
    setHidden('master_service_id', '');
    setHidden('path_id', '');
    setHidden('not_sure', 'true');
    $$('[name="master_service_choice"],[name="path_choice"]').forEach(r => r.checked = false);
    $$('[data-service-id]').forEach(card => card.classList.remove('is-selected'));
    const ns = $('[name="not_sure_choice"]'); if (ns) ns.checked = true;
    syncConditionalFields();
  }

  function applyEntryContext() {
    const pathId = params.get('path_id');
    const serviceId = params.get('master_service_id');
    let loaded = false;
    if (pathId && pathById(pathId)) { selectPath(pathId); loaded = true; }
    else if (serviceId && serviceById(serviceId)) { selectService(serviceId); loaded = true; }
    const source = params.get('source_id') || 'direct';
    setHidden('source_id', source);
    setHidden('website_language', lang);
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(k => setHidden(k, params.get(k) || ''));
    const box = $('[data-context-loaded]');
    if (box) {
      box.hidden = !loaded;
      const label = $('[data-context-label]', box);
      if (loaded && label) {
        const p = pathById(selectedPathId());
        const s = serviceById(selectedServiceId());
        label.textContent = p ? `${p.service[lang]} — ${p.path[lang]}` : (s ? s[lang] : '');
      }
    }
  }

  function syncConditionalFields() {
    const pathId = selectedPathId();
    const orgRelevant = ['P01','P02','P03','P04','P05','P06','P09'].includes(pathId);
    const orgWrap = $('[data-org-fields]');
    if (orgWrap) {
      orgWrap.hidden = !orgRelevant;
      $$('input,select', orgWrap).forEach(el => el.disabled = !orgRelevant);
    }
    const nextStep = getValue('preferred_next_step');
    const appointment = $('[data-appointment-fields]');
    if (appointment) {
      const active = nextStep === 'appointment';
      appointment.hidden = !active;
      $$('input,select', appointment).forEach(el => { el.disabled = !active; el.required = false; });
      const note = $('[data-appointment-note]'); if (note) note.hidden = !active;
    }
  }

  function save() {
    const data = {current, maxReached};
    new FormData(form).forEach((v,k) => { if (!(v instanceof File)) data[k] = v; });
    data.not_sure = isNotSure();
    try { store.setItem(storageKey, JSON.stringify(data)); } catch (_) {}
  }

  function restore() {
    let data = {};
    try { data = JSON.parse(store.getItem(storageKey) || '{}'); } catch (_) {}
    Object.entries(data).forEach(([k,v]) => {
      if (k === 'current' || k === 'maxReached' || k === 'not_sure') return;
      setNamedValue(k, v);
    });
    if (data.not_sure === true) setHidden('not_sure','true');
    if (Number.isInteger(data.current)) current = Math.max(0, Math.min(steps.length-1, data.current));
    if (Number.isInteger(data.maxReached)) maxReached = Math.max(current, Math.min(steps.length-1, data.maxReached));
    const sid = getValue('master_service_id'), pid = getValue('path_id');
    if (pid && pathById(pid)) selectPath(pid);
    else if (sid && serviceById(sid)) selectService(sid, {clearPath:false});
    else if (data.not_sure === true) selectNotSure();
  }

  function clearInvalid(step) {
    $$('.is-invalid', step).forEach(el => el.classList.remove('is-invalid'));
    $$('[aria-invalid="true"]', step).forEach(el => el.removeAttribute('aria-invalid'));
    const summary = $('[data-error-summary]', step); if (summary) summary.classList.remove('is-visible');
  }

  function markInvalid(el) {
    const group = el.closest('.connect-v2__field, fieldset, .connect-v2__consent') || el.parentElement;
    group?.classList.add('is-invalid');
    el.setAttribute?.('aria-invalid','true');
  }

  function validateCurrent() {
    const step = steps[current];
    clearInvalid(step);
    let ok = true;
    if (current === 0) {
      if (!isNotSure() && !selectedPathId()) {
        ok = false;
        const chooser = $('[data-transaction-chooser]', step) || step;
        chooser.classList.add('is-invalid');
      }
    }
    const radioNames = new Set();
    $$('[required]', step).forEach(el => {
      if (el.disabled) return;
      if (el.type === 'radio') radioNames.add(el.name);
      else if (el.type === 'checkbox') { if (!el.checked) { ok=false; markInvalid(el); } }
      else if (!String(el.value || '').trim() || !el.checkValidity()) { ok=false; markInvalid(el); }
    });
    radioNames.forEach(name => {
      if (!$(`[name="${CSS.escape(name)}"]:checked`, step)) {
        ok=false; const first=$(`[name="${CSS.escape(name)}"]`, step); if(first) markInvalid(first);
      }
    });
    if (current === 3) {
      const phone = getValue('mobile').replace(/[^0-9+]/g,'');
      const digits = phone.replace(/\D/g,'');
      if (digits.length < 8 || digits.length > 15) { ok=false; markInvalid(form.elements.namedItem('mobile')); }
    }
    if (!ok) {
      const summary = $('[data-error-summary]', step); if (summary) summary.classList.add('is-visible');
      step.querySelector('[aria-invalid="true"], .is-invalid input, .is-invalid textarea, .is-invalid select')?.focus();
    }
    return ok;
  }

  function labelForStep(i) {
    const n = navSteps[i]; return n ? n.dataset.label || '' : '';
  }

  function render() {
    steps.forEach((s,i) => s.hidden = i !== current);
    navSteps.forEach((n,i) => {
      n.classList.toggle('is-current', i === current);
      n.classList.toggle('is-complete', i < current);
      const b = $('button', n);
      if (b) { const canJump = i < current && i <= maxReached; b.disabled = !canJump; b.setAttribute('aria-disabled', String(!canJump)); }
    });
    const pct = Math.round(((current+1)/steps.length)*100);
    document.documentElement.style.setProperty('--connect-progress', `${pct}%`);
    const pc = $('[data-progress-percent]'); if (pc) pc.textContent = `${pct}%`;
    const pl = $('[data-progress-label]'); if (pl) pl.textContent = labelForStep(current);
    const prev = $('[data-prev]'), next = $('[data-next]'), submit = $('[data-submit]');
    if (prev) prev.hidden = current === 0;
    if (next) next.hidden = current === steps.length-1;
    if (submit) submit.hidden = current !== steps.length-1;
    if (current === steps.length-1) renderReview();
    syncConditionalFields();
    save();
  }

  function go(index, focus=true) {
    current = Math.max(0, Math.min(steps.length-1, index));
    maxReached = Math.max(maxReached, current);
    render();
    if (focus) {
      const h = $('h2', steps[current]);
      if (h) { h.tabIndex = -1; h.focus({preventScroll:true}); }
      $('.connect-v2__workspace')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    }
  }

  const progressLabels = {
    not_started:t('لم أبدأ','Not started'), started:t('بدأت','Started'), submitted:t('تم التقديم','Submitted'), problem:t('لدي مشكلة أو إجراء مطلوب','Problem or action required')
  };
  const readinessLabels = {
    most:t('معظم المعلومات أو المستندات متوفرة','Most information/documents available'), some:t('بعض المعلومات أو المستندات متوفرة','Some information/documents available'), unsure:t('لست متأكدًا مما هو مطلوب','Not sure what is required')
  };
  const nextLabels = {whatsapp:'WhatsApp', call:t('اتصال هاتفي','Phone call'), appointment:t('طلب موعد','Appointment request'), visit:t('زيارة نقطة الخدمة','Visit service point')};

  function transactionLabel() {
    if (isNotSure()) return t('لست متأكدًا — مراجعة بشرية','Not Sure — human triage');
    const p = pathById(selectedPathId());
    if (p) return `${p.service[lang]} — ${p.path[lang]}`;
    const s = serviceById(selectedServiceId());
    return s ? s[lang] : '—';
  }

  function renderReview() {
    const box = $('[data-review]'); if (!box) return;
    const rows = [
      {title:t('معاملتك','Your Transaction'), step:0, rows:[[t('الخدمة والمسار','Service & Path'),transactionLabel()],[t('مصدر الدخول','Entry Source'),getValue('source_id')||'direct']]},
      {title:t('نفهم طلبك','Understand Your Request'), step:1, rows:[[t('النتيجة المطلوبة','Desired Outcome'),getValue('desired_outcome')||'—'],[t('حالة التقدم','Progress'),progressLabels[getValue('progress_state')]||'—'],[t('موعد نهائي / سبب','Deadline / Reason'),getValue('deadline_reason')||t('غير مضاف','Not provided')]]},
      {title:t('جاهزية المعاملة','Readiness'), step:2, rows:[[t('الجاهزية','Readiness'),readinessLabels[getValue('readiness_summary')]||'—'],[t('المنشأة','Organisation'),getValue('organization_name')||t('غير مطلوب / غير مضاف','Not required / not provided')],[t('صفة الممثل','Representative Role'),getValue('representative_role')||t('غير مطلوب / غير مضاف','Not required / not provided')]]},
      {title:t('بيانات التواصل','Contact Details'), step:3, rows:[[t('الاسم','Name'),getValue('full_name')||'—'],[t('الهاتف','Mobile'),getValue('mobile')||'—'],[t('البريد','Email'),getValue('email')||t('غير مضاف','Not provided')],[t('اللغة المفضلة','Preferred Language'),getValue('preferred_language')||lang]]},
      {title:t('كيف نكمل؟','Preferred Next Step'), step:4, rows:[[t('الاختيار','Preference'),nextLabels[getValue('preferred_next_step')]||'—'],[t('تفضيل الموعد','Appointment Preference'),getValue('preferred_next_step')==='appointment' ? [getValue('appointment_date'),getValue('appointment_time')].filter(Boolean).join(' · ') || t('لم تحدد','Not specified') : t('غير مطلوب','Not required')]]}
    ];
    box.innerHTML = '';
    rows.forEach(group => {
      const sec = document.createElement('section'); sec.className='connect-v2__review-group';
      const head = document.createElement('div'); head.className='connect-v2__review-head';
      const h = document.createElement('h3'); h.textContent=group.title;
      const edit = document.createElement('button'); edit.type='button'; edit.dataset.editStep=String(group.step); edit.textContent=t('تعديل','Edit');
      head.append(h,edit); sec.append(head);
      group.rows.forEach(([k,v]) => { const row=document.createElement('div'); row.className='connect-v2__review-row'; const strong=document.createElement('strong'); strong.textContent=k; const span=document.createElement('span'); span.textContent=v; row.append(strong,span); sec.append(row); });
      box.append(sec);
    });
  }

  function normalizedPayload() {
    const fd = new FormData(form);
    const obj = {};
    fd.forEach((v,k) => { if (!(v instanceof File) && !['master_service_choice','path_choice','not_sure_choice'].includes(k)) obj[k]=v; });
    obj.master_service_id = selectedServiceId() || null;
    obj.path_id = selectedPathId() || null;
    obj.not_sure = isNotSure();
    obj.website_language = lang;
    obj.source_id = getValue('source_id') || 'direct';
    obj.consent = Boolean($('[name="consent"]')?.checked);
    obj.consent_version = 'connect-v2.1-2026-08-21';
    obj.client_state = 'READY_TO_SUBMIT';
    return obj;
  }

  function handoffText(payload) {
    const lines = [
      t('طلب جديد من Connect (نسخة ما قبل الربط)','New Connect request (pre-integration build)'),
      `${t('المعاملة','Transaction')}: ${transactionLabel()}`,
      `${t('النتيجة المطلوبة','Desired outcome')}: ${payload.desired_outcome || '—'}`,
      `${t('حالة التقدم','Progress')}: ${progressLabels[payload.progress_state] || '—'}`,
      `${t('الاسم','Name')}: ${payload.full_name || '—'}`,
      `${t('الخطوة المفضلة','Preferred next step')}: ${nextLabels[payload.preferred_next_step] || '—'}`,
      t('ملاحظة: لم يتم إنشاء Request ID لأن ربط CRM/API غير مفعّل في هذه النسخة.','Note: No Request ID has been created because CRM/API integration is not enabled in this build.')
    ];
    return lines.join('\n');
  }

  function showStagingHandoff(payload) {
    form.hidden = true;
    const panel = $('[data-staging-handoff]'); if (!panel) return;
    panel.classList.add('is-visible');
    const number = String(config.whatsappNumber || '').replace(/\D/g,'');
    const wa = $('[data-handoff-whatsapp]', panel);
    if (wa) {
      wa.href = number ? `https://wa.me/${number}?text=${encodeURIComponent(handoffText(payload))}` : '#';
      wa.hidden = !number;
    }
    const copy = $('[data-copy-handoff]', panel);
    if (copy) copy.dataset.copyText = handoffText(payload);
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function showSuccess(data) {
    form.hidden = true;
    const panel = $('[data-real-success]'); if (!panel) return;
    panel.classList.add('is-visible');
    const id = data.request_id || data.requestId;
    $('[data-request-id]', panel).textContent = id;
    const number = String(config.whatsappNumber || '').replace(/\D/g,'');
    const wa = $('[data-success-whatsapp]', panel);
    if (wa && number) wa.href = `https://wa.me/${number}?text=${encodeURIComponent(t(`مرحبًا، أتابع الطلب رقم ${id}.`,`Hello, I am following up request ${id}.`))}`;
    store.removeItem(storageKey);
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  }

  async function submitRequest() {
    if (submitting || !validateCurrent()) return;
    const payload = normalizedPayload();
    const endpoint = String(config.requestEndpoint || '').trim();
    if (!endpoint) { showStagingHandoff(payload); return; }
    submitting = true;
    const button = $('[data-submit]');
    const original = button.textContent;
    button.disabled = true; button.textContent = t('جارٍ الإرسال…','Submitting…');
    try {
      const response = await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const data = await response.json().catch(()=>({}));
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
      const id = data.request_id || data.requestId;
      if (!id) throw new Error('missing_request_id');
      showSuccess(data);
    } catch (err) {
      const box = $('[data-submit-error]');
      if (box) { box.textContent=t('تعذر إرسال الطلب. لم تُفقد بياناتك ويمكنك المحاولة مرة أخرى.','The request could not be submitted. Your information is still available and you can try again.'); box.classList.add('is-visible'); }
      form.hidden = false;
    } finally {
      submitting=false; button.disabled=false; button.textContent=original;
    }
  }

  function initAppointment() {
    const date = form.elements.namedItem('appointment_date');
    if (!date) return;
    try { date.min = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Qatar',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()); } catch (_) {}
  }

  function initPreferredLanguage() {
    const field = form.elements.namedItem('preferred_language');
    if (field && !field.value) field.value = lang;
  }

  renderTransactionChooser();
  restore();
  applyEntryContext();
  initPreferredLanguage();
  initAppointment();
  syncConditionalFields();

  form.addEventListener('change', e => {
    if (e.target.name === 'master_service_choice') selectService(e.target.value);
    if (e.target.name === 'path_choice') selectPath(e.target.value);
    if (e.target.name === 'not_sure_choice' && e.target.checked) selectNotSure();
    if (e.target.name === 'preferred_next_step') syncConditionalFields();
    save();
  });
  form.addEventListener('input', save);
  $('[data-next]')?.addEventListener('click', () => { if (validateCurrent()) go(current+1); });
  $('[data-prev]')?.addEventListener('click', () => go(current-1));
  form.addEventListener('submit', e => { e.preventDefault(); submitRequest(); });
  navSteps.forEach((n,i) => $('button',n)?.addEventListener('click',()=>{ if(i<current&&i<=maxReached) go(i); }));
  document.addEventListener('click', e => {
    const edit = e.target.closest('[data-edit-step]'); if (edit) { go(Number(edit.dataset.editStep)||0); return; }
    const change = e.target.closest('[data-change-transaction]'); if (change) { const box=$('[data-context-loaded]'); if(box) box.hidden=true; go(0); return; }
    const back = e.target.closest('[data-back-to-form]'); if (back) { $('[data-staging-handoff]')?.classList.remove('is-visible'); form.hidden=false; go(5); return; }
    const copy = e.target.closest('[data-copy-handoff]'); if (copy) { const text=copy.dataset.copyText||''; navigator.clipboard?.writeText(text).then(()=>{ const old=copy.textContent; copy.textContent=t('تم النسخ','Copied'); setTimeout(()=>copy.textContent=old,1200); }).catch(()=>{}); }
  });
  render();
})();
