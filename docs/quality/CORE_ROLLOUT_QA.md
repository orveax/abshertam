# Core Website Rollout QA — Home + Services + 4 Master Services

Status: BUILT ON TRANSFORMATION BRANCH / SOURCE QA CHECKPOINT / VISUAL-DEVICE QA PENDING
Date: 2026-08-22
Branch: `feature/website-transformation-foundation`
Production `main`: UNCHANGED

## Source authority
- Website Content Freeze v2.0 — 12 Pages AR/EN | Transaction-Need First.
- Website Presentation System v1.0.
- Service Content Master v2.0 — 4 Master Services + 10 approved Launch Paths.
- FAQ approved content for mini-FAQ reuse.

## Routes built in this checkpoint
Arabic:
- `/ar/`
- `/ar/services/`
- `/ar/services/company-transactions/`
- `/ar/services/work-residence-visas/`
- `/ar/services/attestation-documents/`
- `/ar/services/certificates-records/`

English:
- `/en/`
- `/en/services/`
- `/en/services/company-transactions/`
- `/en/services/work-residence-visas/`
- `/en/services/attestation-documents/`
- `/en/services/certificates-records/`

## Shared implementation promoted
- `assets/css/pages/site-v2.css`
- `assets/js/core/site-v2.js`
- existing `assets/css/tokens.css`
- existing `assets/config.js`
- existing `assets/data/routes.js`
- existing `assets/data/services.js`
- existing `assets/data/resources.js`

## Source QA checks
- Arabic output uses `lang=ar` + `dir=rtl`.
- English output uses `lang=en` + `dir=ltr`.
- Homepage remains Transaction-Need First.
- No Company / Individual / Investor entry segmentation is introduced.
- 4 Master Services only.
- 10 Launch Paths remain inside 4 Master Service pages; no Launch Path subpages created.
- Canonical `MS01`–`MS04` and `P01`–`P10` IDs are present.
- Contextual CTAs pass `master_service_id`, `path_id`, and `source_id=service-page` into Connect.
- Global primary conversion remains Start Your Request / ابدأ طلبك.
- WhatsApp remains delayed/supportive and does not replace Connect.
- Mobile Service Unit remains a delivery channel / proof point, not the business definition.
- Service-point hours remain 06:00–15:30 Doha time and are not merged with WhatsApp hours.
- Company Profile / Service Brochure remain config-driven and truthful-disabled until real final URLs exist.
- Stage pages are `noindex,nofollow` until the production release gate.
- No Astro dependency introduced.

## Page-family checks
### Home
- Dark Signature Hero.
- Essential trust only.
- 4-service Transaction Gateway.
- Mobile Service Unit split.
- 4-step post-request rail.
- Location / operating-boundary preview.
- Config-driven resources.
- Dark final conversion.

### Services Directory
- Compact dark opening.
- Four full-width service-family bands.
- Launch Path labels visible under each family.
- One family CTA per block.

### Master Service pages
- Compact dark family hero.
- Local path selector.
- Sequential Launch Path sections.
- Canonical Value / Description / What We Do / How to Start content.
- Contextual Start This Transaction CTA.
- What Happens Next rail.
- Mini FAQ subset sourced from approved FAQ.
- Boundary/important notes preserved where present in Service Content Master.
- Strong final conversion.

## Pending before production
1. Browser visual QA for all 12 outputs in this checkpoint.
2. Real-device QA: desktop/laptop, tablet/iPad, Android, iPhone classes.
3. Header/Premium Menu full component freeze and resource-menu behavior.
4. Connect AR/EN 6-step Transaction-First rollout.
5. Contact + Location operational rollout.
6. FAQ full 15-question support page rollout.
7. Terms 21 AR + 21 EN sections preserved exactly.
8. Privacy 15 AR + 15 EN sections preserved exactly.
9. Route/redirect/sitemap/canonical QA.
10. Remove staging `noindex` only at Production Candidate gate.

## Gate
Core content architecture: PASS.
Source-level rollout: PASS.
Visual/device QA: PENDING.
Production merge: NOT AUTHORIZED YET.
