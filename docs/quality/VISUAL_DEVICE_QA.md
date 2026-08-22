# Visual & Device QA — AIBSHER TAMM Website v2

Status: PASS
Date: 2026-08-22
Branch: `feature/website-transformation-foundation`
Production `main`: UNCHANGED
PR: #4 — Draft / unmerged

## Final automated evidence
Workflow: `Website v2 Browser QA`
Final run: #17
Run ID: `32549037773`
Validated branch head: `d472cd9ef42ae1fe60544f5ffc13206d7a215d32`

Final result:
- 96 checks
- 0 failures
- 0 review items

## Coverage matrix
All 24 semantic implementations were validated: 12 route groups × Arabic/English.

Viewports:
- Desktop: 1440×900
- Tablet portrait: 834×1194
- Tablet landscape: 1194×834
- Mobile: 390×844

## Browser checks
- horizontal overflow
- `lang` and `dir` correctness
- practical touch targets
- expanded mobile navigation containment
- Connect step count = 6
- Connect submit hidden before Review
- Connect Next visible on initial step
- Connect mobile progress remains inside viewport
- basic keyboard focus visibility
- full-page screenshot capture per route/viewport

## Defects corrected during QA
1. RTL mobile process spacing changed from physical left padding to logical inline spacing.
2. Header language control, mobile menu, local service navigation, FAQ navigation and support actions brought to practical touch-target size.
3. FAQ horizontal overflow corrected on mobile/tablet layouts.
4. Global hidden-state contract hardened with `[hidden]{display:none!important}` after author button display rules exposed Connect Submit before Step 6.
5. Connect mobile progress re-composed so all six step indicators remain visible in the viewport.
6. Footer, service-card, resource, mini-FAQ, legal identity and Contact consent interactive targets corrected.

## Manual representative screenshot review
Representative screenshots were reviewed for:
- Home desktop/mobile
- Connect mobile
- FAQ mobile
- Contact mobile
- Legal reader mobile

No S0/S1 visual defect remained after the final corrections.

## Scope limitation
This gate validates Chromium rendering/layout at the defined viewport dimensions. It does not claim physical-device Safari/WebKit acceptance testing. Native Safari/WebKit validation may be executed as an optional final acceptance check before launch.

## Gate decision
Visual & Device QA: PASS.
Issue #5: CLOSED / COMPLETED.

## Release posture
This PASS does not authorize merge to `main` by itself. Remaining Release Preparation gates include SEO cutover, backend/CRM submission, Contact handoff/endpoint, Qatar legal alignment, governed resource URLs, QA CSS consolidation, and final Production Candidate indexing controls.
