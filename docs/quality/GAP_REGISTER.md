# Website Transformation Gap Register

Status: Initial baseline register
Date: 2026-08-21
Baseline reviewed: main / R2.7 frozen stabilization baseline

## G-001 — Public route architecture is incomplete for the approved 12-page model
Severity: S2 Major
Domain: IA / maintainability / SEO
Evidence: repository root currently exposes Home, Connect, Contact, Location, FAQ, Terms and Privacy as standalone HTML files; there is no Services Hub or four Master Service pages in the current root baseline.
Target: 12 page types with Arabic and English route trees.
Acceptance: all approved page types exist under /ar and /en with equivalent language mapping.

## G-002 — Current bilingual model is runtime text swapping inside shared pages
Severity: S2 Major
Domain: bilingual / SEO / maintainability
Evidence: current HTML uses data-ar/data-en attributes and a runtime language toggle inside the same document; canonical URLs point to single .html routes.
Target: separate /ar and /en public outputs sharing CSS/JS/assets/data.
Acceptance: equivalent AR/EN URLs, correct lang/dir, hreflang and canonical mapping; no primary JS text-replacement architecture.

## G-003 — Connect starts with customer identity instead of transaction need
Severity: S1 Critical product-journey gap
Domain: conversion / UX / service architecture
Evidence: current Connect progress begins with “Customer Type / نوع العميل”, followed by Transaction Type, and the first form question is “Who is requesting the service?”.
Target: transaction-first six-step journey defined by the approved Content Freeze.
Acceptance: Step 1 = transaction; customer/company information appears only when operationally required.

## G-004 — Connect still contains legacy audience-driven service routing
Severity: S1 Critical product-journey gap
Domain: service truth / UX / maintainability
Evidence: current Connect filters categories using company/individual/investor audience data and exposes legacy categories including Corporate Services, Individual Services and Field Business Solutions.
Target: canonical 4 Master Services / 10 Launch Paths.
Acceptance: incoming or selected service uses MS01–MS04 and P01–P10; no production routing depends on legacy audience categories.

## G-005 — Premium menu still exposes audience-first homepage architecture
Severity: S2 Major
Domain: navigation / positioning
Evidence: current menu includes “Start by Role / ابدأ حسب صفتك” with Company, Individual, Investor and legacy single-page anchors.
Target: Home / Services / Unit Location / FAQ / Contact / Start Request plus compact service discovery.
Acceptance: audience-first menu item removed from the transformed navigation.

## G-006 — Current code has versioned page/global CSS debt
Severity: S2 Major
Domain: code architecture / maintainability
Evidence: current CSS inventory includes files such as global-shell-v21.css, contact-v19.css, location-v18.css and support-legal-v18.css alongside design-system.css and tokens.css; home.css is very large.
Target: protected global component ownership, semantic tokens, reusable components and page-family styles without version-name cascade debt.
Acceptance: no page CSS overrides protected global shell; obsolete version-specific layers removed after parity/regression validation.

## G-007 — Resource governance is incomplete
Severity: S3 Minor now / S2 when M3 assets ship
Domain: resources / conversion
Evidence: config currently has companyProfileUrl but no Service Brochure key; current menu links directly to a specific PDF path rather than a fully governed resource contract.
Target: config-driven companyProfileUrl + serviceBrochureUrl and resource visibility only when real approved files exist.
Acceptance: no broken/placeholder public resource actions.

## G-008 — Current canonical/SEO structure is tied to legacy .html routes
Severity: S2 Major
Domain: SEO / bilingual
Evidence: current Connect canonical is /connect.html and Open Graph URL uses the same single-language route.
Target: clean localized routes, reciprocal hreflang and sitemap entries for both language trees.
Acceptance: canonical and hreflang pass on every localized page.

## G-009 — WhatsApp competes with structured conversion in global menu
Severity: S3 Major conversion concern
Domain: CTA / funnel
Evidence: current premium-menu action area presents Start Transaction and WhatsApp as adjacent prominent buttons.
Target: Start Request is the only primary transaction conversion; WhatsApp is contextual support.
Acceptance: WhatsApp treatment follows the approved distribution contract and is not presented as an equal intake action.

## G-010 — Measurement layer is not yet formalized
Severity: S3
Domain: sales intelligence / analytics
Target events: start_request_click, service_family_view, service_path_select, connect_start, connect_step_complete, request_submit_success (real only), whatsapp_click, call_click, directions_click, resource downloads and language_switch.
Acceptance: event taxonomy documented and implemented without collecting unnecessary personal data.

## G-011 — Accessibility and performance targets need transformation-level evidence
Severity: S2 Release Gate
Domain: quality
Target: WCAG 2.2 AA audit target; LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 where measurable.
Acceptance: browser + real-device + production evidence captured before Production Stable.

## G-012 — Astro must not be introduced before static architecture closure
Severity: Governance control
Domain: architecture / change management
Decision: Astro is deferred.
Acceptance: static 12-page architecture, AR/EN parity, Connect context, component freeze and QA pass before any Astro migration assessment.

## Execution priority
P0: G-003, G-004, G-005 — customer journey/service truth.
P1: G-001, G-002, G-008 — routes/language/SEO architecture.
P2: G-006, G-007, G-009 — maintainability/resources/CTA governance.
P3: G-010, G-011 — measurement and final quality evidence.
P-last: G-012 — optional Astro migration assessment only after all prior gates.
