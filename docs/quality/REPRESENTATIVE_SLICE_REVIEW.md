# Representative Static Slice — Review Gate

Status: Built / Source-structure verified / Owner direction approved 2026-08-21 / Source QA patch applied 2026-08-22 / Visual-device QA pending

## Review files
- Arabic: `review/ar/index.html`
- English: `review/en/index.html`
- Shared CSS: `assets/css/pages/transformation-slice.css`
- Shared JS: `assets/js/pages/transformation-slice.js`
- Shared config/data: `assets/config.js`, `assets/data/routes.js`, `assets/data/services.js`, `assets/data/resources.js`

## Owner approval recorded
On 2026-08-21 the owner approved the transformation direction and authorized continued execution under the **Static Now / Astro Last** rule. This approval locks the experience direction and allows the project to proceed toward component freeze and the static 12-page rollout, but it does **not** substitute for browser/device QA.

## What the slice validates
- separate Arabic and English HTML outputs;
- shared Design System tokens;
- premium dark Hero + light operational sections;
- transaction-first gateway;
- 4 Master Services visible without audience-first segmentation;
- Master Service Launch Paths as sequential sections, not 10 separate pages;
- contextual Start This Transaction URLs carrying `master_service_id` / `path_id` / `source_id`;
- resource cards with truthful disabled state until final PDFs are configured;
- delayed WhatsApp support rather than an equal Hero CTA;
- responsive layout contract;
- keyboard focus and reduced-motion support.

## Source QA patch — 22 Aug 2026
The first implementation QA pass identified source-level drift before component freeze. The following corrections were applied only on `feature/website-transformation-foundation`; production `main` remains unchanged.

1. **Canonical service-data binding**
   - Both AR and EN review pages now load the shared `services.js` contract.
   - Service-family and Launch Path elements carry canonical IDs.
   - Page JS rehydrates canonical service/path labels from the shared data source where available.
   - Arabic drift corrected for P08, P09 and P10.

2. **Route and Connect-context binding**
   - Both review pages now load `routes.js`.
   - Global Start Request and service-family routes are governed by the shared route contract.
   - Contextual transaction CTAs are regenerated from the shared Connect route while preserving `master_service_id`, `path_id` and `source_id`.

3. **Config-driven operational behavior**
   - Both review pages now load `config.js` and `resources.js`.
   - WhatsApp destination is read from the central `whatsappNumber` configuration rather than relying only on duplicated page markup.
   - Resource actions remain disabled when their governed URL is empty and automatically become usable only when a real configured file URL exists.

4. **Arabic presentation cleanup**
   - Removed Egyptian/internal implementation language from the representative service sample.
   - Replaced mixed internal terms with clear public-facing Arabic where the review content is customer-visible.

5. **Floating-support hardening**
   - Added safe-area-aware positioning for devices with screen insets.
   - Added dynamic footer lift so the floating WhatsApp control does not sit on top of the Footer.
   - The action remains delayed until after the initial Hero scroll threshold.

6. **Mobile menu behavior**
   - Existing Escape and link-close behavior is retained.
   - Added outside-click close behavior without changing the protected navigation direction.

## Source checks completed
- AR document: `lang=ar`, `dir=rtl`, `noindex` review state.
- EN document: `lang=en`, `dir=ltr`, `noindex` review state.
- Both language pages load the same `fonts.css`, `tokens.css`, representative CSS and JS.
- Both language pages now consume the same central config, route, service and resource contracts.
- JavaScript remains isolated to representative-page behavior and shared-data binding.
- No Astro/framework dependency.
- Production `main` is unchanged.
- Protected rollback branch remains outside this patch.

## Browser/device QA status
**NOT PASSED YET.** A real browser/device render is still required. The current execution environment could not complete a trustworthy headless Chromium render, so no visual/device PASS is claimed from source inspection alone.

## Required visual QA before production component freeze
- Desktop: 1920x1080, 1536x864, 1440x900, 1366x768, 1280x800.
- Tablet: portrait + landscape.
- Mobile: ~360px, large Android, standard and large iPhone classes.
- Arabic and English on every representative class.
- Validate typography wrapping, Hero media crop, CTA hierarchy, service-family density, sequential service section readability, resource-row behavior and floating-control collisions.

## Acceptance gate
Production component freeze requires:
1. Hero feels premium but not theatrical/heavy.
2. Transaction Gateway is understandable within seconds.
3. Master Service sample clearly avoids card-grid fatigue.
4. One dominant CTA is obvious in each viewport.
5. WhatsApp remains supportive and non-competing.
6. AR/EN visual parity passes without forcing identical line breaks.
7. Mobile composition feels purpose-built, not scaled desktop.
8. No accessibility or overflow blocker appears.

Owner direction approval is PASS. Source QA correction is applied. **Browser/device QA remains the current engineering gate.** After that gate passes, promote the component patterns to the 12-page static implementation. Astro remains deferred.
