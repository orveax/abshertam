# 01 — Homepage Presentation Review

**Route:** `/ar/` + `/en/`
**Review date:** 2026-08-22
**Status:** IMPLEMENTED / AUTOMATED QA PASS / OWNER VISUAL SIGN-OFF PENDING

## Review scope
- first-screen impact
- visual hierarchy and page rhythm
- 4 Master Service presentation
- Mobile Service Unit presentation
- post-submit process visualization
- mobile density
- resources visibility
- shared code integrity and regression

## Enhancement round implemented

### Hero
- stronger editorial media frame and restrained gold accent
- improved visual balance between copy and vehicle artwork
- shorter customer-facing lead copy
- trust language simplified
- hero image marked high-priority and async-decoded
- reduced-motion behavior preserved

### Service gateway
- public-facing service numbers simplified to `01–04`
- internal `MS01–MS04` IDs remain preserved in `data-service-id` and the canonical data layer
- cards receive stronger hierarchy, restrained gold top rule, cleaner chips, stable details footer and subtle hover response
- no change to Master Service or Launch Path architecture

### Mobile Service Unit
- rewritten as a customer-facing service differentiator rather than an internal positioning explanation
- second use of vehicle artwork receives a distinct crop/treatment
- proof rows shortened and visually simplified
- image lazy-loading enabled below the fold

### Operational journey
- wording changed from "after you start" to "after you submit" to separate Connect intake from operational review
- desktop presentation converted to a continuous four-step timeline
- mobile presentation converted to a compact vertical timeline

### Resources
- inactive resources are hidden from the public presentation
- if no governed resource URL is active, the entire Resources section is hidden
- resources automatically become eligible for display when their canonical config becomes enabled

### Header / mobile density
- restrained scroll-condensed header treatment on the Homepage only
- active navigation indicator improved
- secondary mobile spacing reduced without changing section order

## Architecture protection
No changes were made to:
- route architecture
- 4 Master Services
- 10 Launch Paths
- Connect contract
- AR/EN semantic URL structure
- canonical/hreflang contract
- production `main`

## Automated regression evidence
GitHub Actions run: `32577123317`

Results:
- Browser/device QA: **96 checks / 0 failures / 0 review items**
- SEO cutover QA: **PASS — 24 routes**
- Internal-link QA: **PASS — 24 source pages / 30 unique internal targets / no legacy `.html` links**

## Representative visual review
Reviewed after the enhancement run:
- Arabic Desktop 1440
- Arabic Mobile 390
- English Desktop 1440

No S0/S1 presentation defect was found.

## Decision
Homepage presentation implementation is technically ready for Owner visual sign-off.
Do not mark the page `LOCKED` until Owner approval is explicit.
