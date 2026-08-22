# Dependency Audit — Website v2

Status: PASS
Date: 2026-08-22
Branch: `feature/website-transformation-foundation`

## Scope
This gate covers repository dependency reproducibility and QA-tool dependency security only. The website runtime remains static HTML/CSS/Vanilla JS and does not ship an npm runtime bundle.

## Baseline problem corrected
Before this gate the CI workflow created an ad-hoc npm project during every run and installed Playwright with:

```bash
npm init -y
npm install --no-save playwright@...
```

That meant the repository had no committed dependency manifest or lockfile.

## Current dependency control
Committed:
- `package.json`
- `package-lock.json` — lockfileVersion 3

Runtime dependencies: **0**

Direct dev dependency:
- `playwright@1.62.1`

Transitive package:
- `playwright-core@1.62.1`

Optional platform package:
- `fsevents@2.3.2` — Darwin only

Node policy:
- Node `>=22 <23`
- npm `>=10 <11`

## CI installation policy
CI now uses:

```bash
npm ci --ignore-scripts
npm audit --audit-level=high
./node_modules/.bin/playwright install --with-deps chromium
```

`package.json` and `package-lock.json` are included in the browser-QA workflow trigger paths.

## Upgrade decision
Playwright was upgraded from `1.55.1` to the current stable `1.62.1` during this dependency pass.

The upgrade changes the QA browser from the older Chromium 140 baseline to Chrome for Testing `151.0.7922.34` used by Playwright 1.62.1.

No pre-release `1.63.0-alpha` package was adopted.

## Verification result
Final workflow run: `32580033780`

Dependency install:
- `npm ci --ignore-scripts` — PASS
- packages installed: 2
- packages audited: 3
- vulnerabilities: **0**

Explicit dependency audit:
- `npm audit --audit-level=high` — PASS
- vulnerabilities: **0**

Post-upgrade regression:
- Browser/device QA: **96 checks / 0 failures / 0 review items**
- Connect/Contact security QA: **PASS**
- SEO cutover QA: **PASS** across 24 semantic routes
- Internal link QA: **PASS** across 24 source pages / 30 unique internal targets
- Legacy `.html` internal links: **0**

## Governance rule
Future dependency changes must update both `package.json` and `package-lock.json` and pass the full Website v2 Browser QA workflow before merge.

Do not add production/runtime npm dependencies to the static site without a separate architecture decision.

## Remaining repository-control note
GitHub `main` branch protection remains a separate repository-governance item. This dependency gate does not alter branch-protection settings.
