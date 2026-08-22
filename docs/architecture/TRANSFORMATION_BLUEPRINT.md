# AIBSHER TAMM Website Transformation Blueprint v1.0

Status: Approved working architecture
Date: 2026-08-21
Branch: feature/website-transformation-foundation

## Objective
Rebuild the AIBSHER TAMM website as a maintainable bilingual transaction-first service experience while preserving validated production UX and deferring Astro until the static architecture is stable.

## Non-negotiable product rules
- Transaction-Need First.
- 12 public routes per approved content freeze.
- 4 Master Services / 10 Launch Paths.
- One primary conversion: Start Your Request -> /connect.
- WhatsApp is support/follow-up, not a parallel intake system.
- Mobile Service Unit is a delivery channel and differentiator, not the business model.
- No guarantee of government decisions or processing time.
- Preserve approved Terms/Privacy legal body until legal review.

## Delivery layers
1. Business and content truth: Notion.
2. Route/content architecture: this repository documentation + approved content pack.
3. Visual system: AIBSHER TAMM Design System / Presentation System.
4. Static implementation: HTML/CSS/JavaScript now.
5. Build-system migration: Astro only after the static implementation is stable and frozen.

## Page families
- Premium Marketing: Home, Services.
- Master Services: four Master Service pages.
- Operational: Connect, Contact, Location.
- Support/Legal: FAQ, Terms, Privacy.

## Experience rules
- One dominant CTA per viewport.
- Avoid repetitive card-grid stacking.
- Use progressive disclosure for deeper service detail.
- Preserve current app-like Connect behavior while changing Step 1 to transaction-first.
- Mobile is recomposed, not a scaled desktop layout.
- RTL/LTR is a composition rule, not only a direction attribute.

## Engineering rules
- Shared tokens and shared component CSS ownership.
- Page CSS must not override protected global components.
- Central configuration for phone, WhatsApp, location, operating hours, resource URLs and social links.
- AR and EN public URLs are separate; shared CSS/JS/assets stay common.
- No inline CSS or inline event handlers in new work.
- No fake success states or unsupported integrations.
- Root-cause fixes before CSS patches.

## Quality targets
- WCAG 2.2 AA target.
- Core Web Vitals target: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1.
- Real-device QA across desktop/laptop, iPad/tablet, Android and iPhone classes.
- Full regression across Arabic and English before release.

## Controlled rollout
T0 Baseline verification
T1 Gap register
T2 Static engineering foundation
T3 Representative homepage slice
T4 Component freeze
T5 12-page implementation
T6 Connect/context integration
T7 Quality engineering
T8 Production candidate
T9 Production stable
T10 Optional Astro migration assessment

## Astro boundary
Astro is explicitly deferred. Current implementation must be structured so later migration is mechanical: page content, shared components, data/config and assets must have clear ownership boundaries.
