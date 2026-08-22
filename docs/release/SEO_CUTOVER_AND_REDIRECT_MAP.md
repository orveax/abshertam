# SEO Cutover & Redirect Map — AIBSHER TAMM Website v2

Status: RELEASE PREPARATION / PARTIAL PASS
Date: 2026-08-22
Branch: `feature/website-transformation-foundation`
Production `main`: UNCHANGED

## Canonical route model
Default language: Arabic.
Production origin: `https://abshertam.qa`

The public v2 model contains 12 semantic route groups × 2 languages = 24 canonical URLs.

| Legacy / Source | Arabic canonical | English canonical |
| --- | --- | --- |
| `/` | `/ar/` | `/en/` |
| Services directory: new | `/ar/services/` | `/en/services/` |
| Company transactions: new | `/ar/services/company-transactions/` | `/en/services/company-transactions/` |
| Work/residence/visas: new | `/ar/services/work-residence-visas/` | `/en/services/work-residence-visas/` |
| Attestation/documents: new | `/ar/services/attestation-documents/` | `/en/services/attestation-documents/` |
| Certificates/records: new | `/ar/services/certificates-records/` | `/en/services/certificates-records/` |
| `/connect.html` | `/ar/connect/` | `/en/connect/` |
| `/contact.html` | `/ar/contact/` | `/en/contact/` |
| `/location.html` | `/ar/location/` | `/en/location/` |
| `/faq.html` | `/ar/faq/` | `/en/faq/` |
| `/terms.html` | `/ar/terms/` | `/en/terms/` |
| `/privacy.html` | `/ar/privacy/` | `/en/privacy/` |

## hreflang contract
Every v2 semantic page must expose reciprocal:
- `hreflang="ar"` → Arabic equivalent
- `hreflang="en"` → English equivalent
- `hreflang="x-default"` → Arabic equivalent because Arabic is the approved default language

Each page must canonicalize to itself, never to the other language.

## Sitemap state
`sitemap.xml` on the transformation branch now lists all 24 semantic URLs and includes reciprocal AR/EN/x-default alternates.
Legacy `.html` URLs are removed from the v2 sitemap.

## Indexing state
All v2 pages intentionally remain:
`noindex,nofollow`

Do not remove staging indexing protection until the Production Candidate gate is approved and redirects/canonical routing have been deployment-tested.

## Legacy redirect intent
The following legacy routes must permanently redirect at production cutover:

| Legacy path | Default target | Required status |
| --- | --- | --- |
| `/` | `/ar/` | 301/308 |
| `/connect.html` | `/ar/connect/` | 301/308 |
| `/contact.html` | `/ar/contact/` | 301/308 |
| `/location.html` | `/ar/location/` | 301/308 |
| `/faq.html` | `/ar/faq/` | 301/308 |
| `/terms.html` | `/ar/terms/` | 301/308 |
| `/privacy.html` | `/ar/privacy/` | 301/308 |

Historical aliases discovered before cutover must be added to this map.

## Language preservation rule
A legacy URL with no reliable language signal uses Arabic because Arabic is the approved default language.
Do not infer English from browser locale inside a permanent redirect rule unless product policy explicitly changes.

If historical production links contain an explicit supported language parameter, preserve that intent only after confirming the exact legacy query contract from production evidence.

## Hosting/router gate — OPEN
Repository search found no authoritative deployment routing configuration such as `wrangler.toml`, Cloudflare Pages `_redirects`, or equivalent production router rules.

Therefore platform-specific redirect syntax is deliberately NOT committed yet.

Before redirect activation, confirm the production host/router and implement the map using that platform's native permanent redirect mechanism.

## Runtime canonical/hreflang fallback
`assets/js/core/site-v2.js` currently creates canonical and reciprocal hreflang links for the v2 semantic route tree during Release Preparation.

This provides a deterministic metadata contract for browser QA while pages remain staging `noindex`.

Preferred Production Candidate outcome: convert these links to static `<head>` markup during the final build/cutover process if the selected hosting/build workflow supports reliable static injection. Runtime metadata must not be treated as a substitute for the final production head audit.

## Release checks still required
1. Automated 24-route canonical/hreflang validation.
2. Validate `sitemap.xml` contains exactly the approved semantic URL set and no legacy `.html` entries.
3. Confirm production hosting/router mechanism.
4. Implement and test permanent legacy redirects.
5. Check for redirect loops, especially `/` → `/ar/`.
6. Confirm deployed HTTP status codes and final URL behavior.
7. Replace runtime metadata with static head tags if practical in the final production build.
8. Only then remove `noindex,nofollow` at Production Candidate.

## Gate position
Sitemap v2: IMPLEMENTED.
Canonical/hreflang contract: IMPLEMENTED AS RELEASE-PREP RUNTIME FALLBACK.
Redirect map: FROZEN.
Platform-specific permanent redirects: BLOCKED ON HOSTING/ROUTER CONFIRMATION.
Production indexing: NOT AUTHORIZED.
