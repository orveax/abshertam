# Representative Static Slice — Review Gate

Status: Built / Source-structure verified / Owner direction approved 2026-08-21 / Visual-device QA pending

## Review files
- Arabic: `review/ar/index.html`
- English: `review/en/index.html`
- Shared CSS: `assets/css/pages/transformation-slice.css`
- Shared JS: `assets/js/pages/transformation-slice.js`

## Owner approval recorded
On 2026-08-21 the owner approved the transformation direction and authorized continued execution under the **Static Now / Astro Last** rule. This approval locks the experience direction and allows the project to proceed toward component freeze and the static 12-page rollout, but it does **not** substitute for browser/device QA.

## What the slice validates
- separate Arabic and English HTML outputs;
- shared Design System tokens;
- premium dark Hero + light operational sections;
- transaction-first gateway;
- 4 Master Services visible without audience-first segmentation;
- Master Service Launch Paths as sequential sections, not 10 separate pages;
- contextual Start This Transaction URLs carrying master_service_id/path_id/source_id;
- resource cards with truthful disabled state until final PDFs are configured;
- delayed WhatsApp support rather than an equal Hero CTA;
- responsive layout contract;
- keyboard focus and reduced-motion support.

## Source checks completed
- AR document: `lang=ar`, `dir=rtl`, noindex review state.
- EN document: `lang=en`, `dir=ltr`, noindex review state.
- Both language pages load the same `fonts.css`, `tokens.css`, representative CSS and JS.
- JavaScript is isolated and limited to mobile menu state + delayed WhatsApp reveal.
- No Astro/framework dependency.
- Production `main` is unchanged.

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

Owner direction approval is PASS. Browser/device QA remains an engineering gate. After that gate, promote the component patterns to the 12-page static implementation. Astro remains deferred.