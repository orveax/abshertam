# Website Transformation Quality Gates

## Quality policy
No stage is declared complete without evidence. Static/source checks, browser checks, real-device checks and production checks are different evidence states.

## Gate Q0 — Baseline integrity
- backup branch exists and is readable;
- main is unchanged by transformation work;
- current baseline/version recorded;
- route and asset inventory captured.

## Gate Q1 — Architecture
- 12 page types mapped;
- AR/EN route mapping complete;
- protected global components identified;
- content/service source hierarchy documented;
- no legacy audience-first or 24/32-service production source is introduced.

## Gate Q2 — Representative slice
Validate Header + Hero + Transaction Gateway + one Master Service sample + resource treatment + WhatsApp behavior on:
- Arabic RTL;
- English LTR;
- desktop/laptop;
- tablet/iPad;
- mobile.

No full-site rollout before owner approval.

## Gate Q3 — Component freeze
Required components have documented states:
- buttons;
- navigation/drawer;
- service-family module;
- path CTA;
- forms/validation/upload;
- accordion;
- status indicator;
- resource card;
- floating support;
- footer;
- legal reader controls.

States: default, hover, focus, active, disabled, loading, success, error where applicable.

## Gate Q4 — Page implementation
For every page:
- one H1;
- semantic landmark structure;
- no duplicated IDs;
- no horizontal overflow;
- correct AR/EN direction and language;
- correct CTA destination;
- no broken assets/links;
- service claims match approved sources.

## Gate Q5 — Connect integrity
- transaction-first Step 1;
- valid service/path preselection;
- selection editable;
- conditional customer/company fields only when required;
- validation and state preservation;
- truthful submit/success state;
- Request ID only when actually produced;
- no competing floating WhatsApp during active form flow.

## Gate Q6 — Accessibility
Target WCAG 2.2 AA:
- keyboard navigation;
- visible focus;
- labels/errors programmatically associated;
- touch targets >= 44px where practical;
- contrast verified;
- motion reduction supported;
- no hover-only information;
- logical heading order;
- screen-reader sensible control names.

## Gate Q7 — Performance
Targets at 75th percentile where measurable:
- LCP <= 2.5s;
- INP <= 200ms;
- CLS <= 0.1.

Controls:
- optimized responsive images;
- explicit image dimensions;
- limited font weights;
- no unnecessary JS libraries;
- deferred/non-blocking scripts where possible;
- cacheable static assets.

## Gate Q8 — SEO / bilingual indexing
- localized titles/descriptions;
- canonical tags;
- reciprocal hreflang;
- sitemap reflects /ar and /en routes;
- robots policy intentional;
- structured data only when factual and supported;
- no duplicate-language canonical conflicts.

## Gate Q9 — Functional / real-device
Validate:
- premium menu;
- language switch;
- all links/anchors;
- Connect flow;
- upload if enabled;
- WhatsApp;
- Contact;
- Location/directions;
- FAQ accordion;
- legal navigation;
- resource downloads;
- back-to-top / fixed controls;
- browser back/forward and refresh.

Reference classes:
- 1920 desktop;
- 1536/1440/1366/1280 laptop;
- tablet portrait/landscape;
- large Android;
- standard/large iPhone;
- narrow ~360px mobile.

## Gate Q10 — Regression / release
For each fix:
Fix -> defect retest -> surrounding component -> other pages -> other breakpoints -> AR/EN.

Release requires:
- no S0/S1 defects;
- S2 explicitly resolved or accepted;
- console/network smoke pass;
- production URLs/HTTPS/assets pass;
- legal/resource links valid;
- source-of-truth state reconciled after deployment.

## Defect severity
- S0 Blocker: critical journey/site unusable.
- S1 Critical: major navigation/form/responsive failure.
- S2 Major: material layout/function defect.
- S3 Minor: visual/spacing/typography inconsistency.
- S4 Polish: enhancement only.
