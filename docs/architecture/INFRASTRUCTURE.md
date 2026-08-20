# AIBSHER TAMM Website — Astro-Lite Infrastructure Baseline

Status: Infrastructure foundation only — no page migration or content/UI rewrite is authorized by this baseline.

## Governance

- Canonical repository: `orveax/abshertam`.
- Protected reference snapshot: `backup/21-august-2026`.
- Active implementation baseline: `main` after infrastructure acceptance.
- Existing root HTML/CSS/JS files remain untouched until page-by-page migration begins.
- Notion remains the authority for approved business, service, content, legal and page-contract decisions.
- GitHub remains the authority for code history and implementation state.

## Technical Direction

- Astro: architecture, routing, components and static build layer.
- HTML5: semantic markup.
- CSS3: custom design system and page styling.
- Bootstrap 5.3.8: selected infrastructure/grid/utilities only where justified.
- Vanilla JavaScript: interaction layer only.
- No React, Vue, jQuery, SPA runtime or mandatory client-side framework.
- Default Astro output: static.

## Language Architecture

Arabic and English are independent production page trees under one shared component/design system:

- `src/pages/ar/`
- `src/pages/en/`

The language switch must route between equivalent pages; it must not translate a single DOM at runtime.

## Source Structure

- `src/layouts/` — shared page shells.
- `src/components/global/` — header, footer, navigation and shared global UI.
- `src/components/home/` — homepage-only components.
- `src/components/services/` — service-system components.
- `src/components/conversion/` — Connect and Contact components.
- `src/components/support/` — FAQ, Location and support components.
- `src/components/legal/` — legal-reader components.
- `src/components/utilities/` — 404, Coming Soon and recovery states.
- `src/styles/tokens/` — design tokens.
- `src/styles/foundations/` — reset, typography, grids and foundations.
- `src/styles/components/` — reusable component styles.
- `src/styles/pages/` — page-specific styles only.
- `src/scripts/` — Vanilla JavaScript modules.
- `src/data/` — structured approved website data.
- `src/config/` — non-secret website configuration.
- `public/assets/` — production static assets.
- `docs/page-contracts/` — Page Implementation Contracts.
- `docs/design-briefs/` — page-level design briefs.
- `docs/qa/` — QA evidence and registers.

## Migration Rule

Migration is controlled page-by-page. A page is not migrated merely because a route folder exists. Each page requires an approved Page Implementation Contract covering purpose, user intent, content authority, IA, design brief, components, CTA hierarchy, SEO, responsive behavior, accessibility, functional requirements, exclusions and acceptance criteria.

## Current Boundary

This infrastructure baseline creates folders/configuration only. It does not change current production content, current page behavior, current Connect/Contact logic, or current visual design.
