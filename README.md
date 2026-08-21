# AIBSHER TAMM Website

Production-source repository for the AIBSHER TAMM website.

## Current production baseline
- Source package supplied by owner: `v6.zip`
- Internal release: `R2.0.21`
- Version: `v2.7`
- Baseline status: `R2.7 Frozen Stabilization Baseline`
- Source package SHA256: `349e5298bd730a26edc12f120a439e587df02996b109a02bba2c7f113848638f`
- Protected backup branch: `backup/21-august-2026`

## Active transformation branch
`feature/website-transformation-foundation`

This branch establishes the approved transformation contracts before page implementation:
- 12-page Transaction-Need First architecture;
- 4 Master Services / 10 Launch Paths;
- separate `/ar` and `/en` public route model;
- shared configuration/data/component ownership;
- governed Company Profile and Service Brochure resources;
- conversion/WhatsApp/channel rules;
- accessibility, performance, SEO and release quality gates;
- static HTML/CSS/JavaScript implementation now;
- Astro explicitly deferred until the final migration gate.

See:
- `docs/architecture/TRANSFORMATION_BLUEPRINT.md`
- `docs/architecture/STATIC_NOW_ASTRO_LATER.md`
- `docs/architecture/ROUTE_LANGUAGE_AND_CONVERSION_CONTRACT.md`
- `docs/quality/GAP_REGISTER.md`
- `docs/quality/QUALITY_GATES.md`

## Governance
- GitHub owns code history, baseline commits, defects, branches, patches and releases.
- Notion owns approved business facts, services, content, positioning, design decisions and operating boundaries.
- `main` remains protected until the transformation foundation and representative slice pass their gates.
- No framework migration is allowed to reopen approved content/IA/UX decisions.

## Positioning constraint
AIBSHER TAMM is a transaction-follow-up and services company in Qatar. The Mobile Service Unit is an important delivery/marketing channel and differentiator, but it is not the business model itself.
