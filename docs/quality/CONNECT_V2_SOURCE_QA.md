# Connect v2 — Source QA Checkpoint

Status: BUILT / SOURCE QA PASS / API-CRM INTEGRATION NOT ENABLED / VISUAL-DEVICE QA PENDING
Date: 2026-08-22
Branch: `feature/website-transformation-foundation`
Production `main`: UNCHANGED

## Source authority
- Connect System v1.0 — current v2.1 architecture override.
- Connect Architecture Pack v2.0 — Definition Ready v2.1 / Implementation Locked.
- Website Content Freeze v2.0.
- Service System v3.0 / Service Content Master v2.0.

## Routes
- `/ar/connect/`
- `/en/connect/`

## Six-step flow implemented
1. Your Transaction / معاملتك.
2. Understand Your Request / نفهم طلبك.
3. Transaction Readiness / جاهزية المعاملة.
4. Contact Details / بيانات التواصل.
5. Preferred Next Step / كيف نكمل؟.
6. Review & Submit / راجع وأرسل.

## Source checks — PASS
- Transaction-Need First is the first decision.
- Company / Individual / Investor is not a standalone opening step.
- 4 canonical Master Services + 10 canonical Launch Paths are rendered from shared `services.js`.
- `master_service_id` and `path_id` are validated against canonical service data before preselection.
- Valid Path context automatically restores the parent Master Service.
- Valid Master Service context opens its related paths.
- Missing/invalid service context falls back to Step 1.
- `Not Sure` is an explicit human-triage alternative.
- Session state preserves in-progress answers and reachable prior steps.
- Desired outcome + progress state are mandatory.
- Readiness is mandatory; sensitive upload is not part of the MVP.
- Organisation/representative fields appear only for P01–P06 and P09.
- Name + mobile are mandatory; email is optional.
- Preferred language is retained separately from page language.
- Preferred next step supports WhatsApp / Call / Appointment Request / Visit.
- Appointment preference is conditional and explicitly not a confirmed appointment.
- Review screen groups answers and supports Edit by section.
- Consent is required before submission.
- No floating WhatsApp exists inside the active intake flow.
- No `customer_type` field controls entry routing.
- No `Math.random` or client-side Request ID generator exists.
- No fake success state is shown when `requestEndpoint` is empty.
- Pre-integration state uses an explicit manual-review handoff and states that no Request ID was created.
- Real Success requires an HTTP success response containing `request_id` / `requestId`.
- API failure preserves the form data and exposes a recoverable error.
- Double-submit is blocked while `SUBMITTING`.
- Stage routes remain `noindex,nofollow`.

## CRM/API boundary
Current `window.AIBSHER_CONFIG.requestEndpoint` is intentionally optional/not configured. Until a real approved endpoint is configured:
- no CRM record is created;
- no Request ID is created;
- no success claim is displayed;
- the user may explicitly hand off the prepared summary to WhatsApp for manual review in staging.

When the endpoint is later enabled, the frontend sends a CRM-neutral JSON payload and requires a real Request ID before success.

## Pending engineering QA
- QA-C01 direct entry.
- QA-C02 valid Master Service context.
- QA-C03 valid Path context.
- QA-C04 invalid context fallback.
- QA-C05 Not Sure triage.
- QA-C06 conditional organisation fields.
- QA-C07 validation recovery.
- QA-C08 back/edit/refresh state preservation.
- QA-C09 double-submit prevention.
- QA-C10 real backend success + Request ID — blocked until backend exists.
- QA-C11 API failure + retry — blocked until endpoint test exists.
- QA-C12 CRM success / WhatsApp failure — backend/integration gate.
- QA-C15/16 complete AR/EN browser journeys.
- QA-C17/18 mobile/tablet visual QA.
- QA-C19 keyboard-only journey.
- QA-C20 analytics privacy validation when analytics is introduced.

## Gate
Architecture-to-code translation: PASS.
Source logic: PASS.
Truthful pre-integration behavior: PASS.
Backend integration: PENDING.
Browser/device QA: PENDING.
Production merge: NOT AUTHORIZED YET.
