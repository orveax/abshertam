# Static Now, Astro Later — Architecture Contract

## Decision
The current transformation is implemented with clean static HTML/CSS/JavaScript. Astro is not part of the current build.

## Why
- The site already has a validated static production baseline.
- The immediate goal is content, UX, routing, maintainability and quality closure.
- Introducing a framework now would mix architecture correction with stack migration.
- A clean static contract makes a future Astro move low-risk.

## Static architecture requirements

### Public language structure
Target public output:

/ar/
/ar/services/
/ar/services/company-transactions/
/ar/services/work-residence-visas/
/ar/services/attestation-documents/
/ar/services/certificates-records/
/ar/connect/
/ar/contact/
/ar/location/
/ar/faq/
/ar/terms/
/ar/privacy/

/en/
/en/services/
/en/services/company-transactions/
/en/services/work-residence-visas/
/en/services/attestation-documents/
/en/services/certificates-records/
/en/connect/
/en/contact/
/en/location/
/en/faq/
/en/terms/
/en/privacy/

### Shared implementation ownership
- assets/css/tokens.css: semantic design tokens only.
- assets/css/global.css: reset, typography, containers and global utilities.
- assets/css/components/: reusable components.
- assets/css/pages/: page-family or page-specific styles only.
- assets/js/core/: global navigation, language routing, config and utilities.
- assets/js/pages/: page behavior only.
- assets/config.js: operational and resource configuration.
- assets/data/: structured service/navigation/resource data where practical.
- assets/documents/: final governed public documents only.

### Protected global components
Header, Premium Menu, Footer, global CTA, language switch, floating support, form primitives, resource card, support/legal reader shell.

Page-level CSS must not redefine those components.

## Content separation
Arabic and English must have separate HTML output and separate content ownership. They share design tokens, components, scripts, icons and images when semantically appropriate.

## Future Astro mapping
Static -> Astro later:
- repeated shell -> layouts/components
- data files -> content/data collections
- /ar + /en routes -> Astro i18n/static routes
- config -> shared config module
- component CSS -> component-scoped/shared styles

No product, content, route or visual redesign is authorized by the Astro migration itself.

## Astro entry gate
Astro may be evaluated only after:
- 12-page static architecture is implemented;
- AR/EN parity passes;
- Connect routing/context passes;
- global components are frozen;
- quality/regression gates pass;
- a migration plan demonstrates no regression in SEO, performance, accessibility or deployment.
