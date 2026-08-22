# AIBSHER TAMM Website

Private production-source repository for the AIBSHER TAMM website.

## Current baseline
- Source package supplied by owner: `v6.zip`
- Internal release: `R2.0.21`
- Version: `v2.7`
- Baseline status: `R2.7 Frozen Stabilization Baseline`
- Source package SHA256: `349e5298bd730a26edc12f120a439e587df02996b109a02bba2c7f113848638f`
- Baseline accepted for Experience Simplification Audit: 2026-08-12
- Backup branch: `backup/21-august-2026`

## Transformation status — 21 Aug 2026
- Branch: `feature/website-transformation-foundation`
- Owner direction approval: PASS
- Public architecture target: 12 routes × Arabic/English semantic equivalents
- Build mode now: Static HTML + CSS + Vanilla JS
- Astro: DEFERRED to final technical migration gate
- Representative AR/EN slice: BUILT
- Source-structure checks: PASS
- Browser/device visual QA: PENDING ENGINEERING GATE
- Production `main`: UNCHANGED

## Governance
- GitHub owns code history, baseline commits, defects, patches, and releases.
- Notion owns approved business facts, services, content, positioning, design decisions, operating boundaries, and internal SOP operations.
- Public website transformation follows the locked `Website Content Freeze v2.0` and `Website Presentation System v1.0`.
- No direct production patching from planning documents; changes travel through a controlled branch/PR and QA gate.

## Engineering direction
- Separate `/ar/` and `/en/` route/content trees.
- Shared Design System tokens, component CSS, JS behavior, service data, route data and governed resources.
- 4 Master Services + 10 Launch Paths only.
- Transaction-Need First.
- `Start Your Request` remains the primary conversion into Connect with preserved service/path context.
- WhatsApp is support/follow-up, not a parallel transaction-intake route.
- Internal employee SOP/dashboard content is **not stored in the public website repository**.

## Positioning constraint
AIBSHER TAMM is positioned as a transaction-follow-up and services company in Qatar. The Mobile Service Unit is an important delivery/marketing channel and differentiator, but it is not the business model itself.

## Key transformation docs
- `docs/architecture/TRANSFORMATION_BLUEPRINT.md`
- `docs/architecture/STATIC_NOW_ASTRO_LATER.md`
- `docs/architecture/ROUTE_LANGUAGE_AND_CONVERSION_CONTRACT.md`
- `docs/quality/GAP_REGISTER.md`
- `docs/quality/QUALITY_GATES.md`
- `docs/quality/REPRESENTATIVE_SLICE_REVIEW.md`

## Representative review
- Arabic: `review/ar/index.html`
- English: `review/en/index.html`

The representative review routes are `noindex` and are not production routes.