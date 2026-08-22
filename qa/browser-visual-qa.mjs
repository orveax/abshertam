import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const outDir = process.env.QA_OUT_DIR || 'qa-artifacts';

const routeGroups = [
  ['home', '/'],
  ['services', '/services/'],
  ['company-transactions', '/services/company-transactions/'],
  ['work-residence-visas', '/services/work-residence-visas/'],
  ['attestation-documents', '/services/attestation-documents/'],
  ['certificates-records', '/services/certificates-records/'],
  ['connect', '/connect/'],
  ['contact', '/contact/'],
  ['location', '/location/'],
  ['faq', '/faq/'],
  ['terms', '/terms/'],
  ['privacy', '/privacy/']
];

const routes = routeGroups.flatMap(([name, suffix]) => [
  [`${name}-ar`, `/ar${suffix === '/' ? '/' : suffix}`],
  [`${name}-en`, `/en${suffix === '/' ? '/' : suffix}`]
]);

const viewports = [
  ['desktop-1440', { width: 1440, height: 900 }],
  ['tablet-portrait-834', { width: 834, height: 1194 }],
  ['tablet-landscape-1194', { width: 1194, height: 834 }],
  ['mobile-390', { width: 390, height: 844 }]
];

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = { generatedAt: new Date().toISOString(), baseURL, checks: [], issues: [] };

for (const [routeName, route] of routes) {
  for (const [viewportName, viewport] of viewports) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    const entry = { routeName, route, viewportName, viewport, status: 'PASS', issues: [] };
    try {
      await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.evaluate(() => document.fonts?.ready);

      const metrics = await page.evaluate(() => {
        const html = document.documentElement;
        const body = document.body;
        const interactive = [...document.querySelectorAll('a,button,input,select,textarea,summary')]
          .filter(el => {
            const s = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return s.visibility !== 'hidden' && s.display !== 'none' && r.width > 0 && r.height > 0;
          })
          .map(el => {
            const r = el.getBoundingClientRect();
            const type = (el.getAttribute('type') || '').toLowerCase();
            const inlineLegalLink = el.tagName === 'A' && !!el.closest('.legal-v2__section p, .legal-v2__section li');
            const labelledSmallControl = el.tagName === 'INPUT' && ['radio', 'checkbox'].includes(type) && !!el.closest('label');
            return {
              tag: el.tagName,
              type,
              text: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 80),
              width: Math.round(r.width),
              height: Math.round(r.height),
              excludeFromTouchAudit: inlineLegalLink || labelledSmallControl
            };
          });
        return {
          lang: html.lang,
          dir: html.dir,
          scrollWidth: Math.max(html.scrollWidth, body?.scrollWidth || 0),
          innerWidth: window.innerWidth,
          horizontalOverflow: Math.max(html.scrollWidth, body?.scrollWidth || 0) > window.innerWidth + 1,
          undersizedTargets: interactive.filter(x => !x.excludeFromTouchAudit && (x.width < 44 || x.height < 44)).slice(0, 50)
        };
      });

      entry.metrics = metrics;
      if (metrics.horizontalOverflow) entry.issues.push(`horizontal-overflow:${metrics.scrollWidth}>${metrics.innerWidth}`);

      if (viewport.width <= 834 && metrics.undersizedTargets.length) {
        entry.issues.push(`undersized-touch-targets:${metrics.undersizedTargets.length}`);
      }

      const expectedLang = route.includes('/en/') ? 'en' : 'ar';
      const expectedDir = expectedLang === 'ar' ? 'rtl' : 'ltr';
      if (metrics.lang !== expectedLang || metrics.dir !== expectedDir) {
        entry.issues.push(`language-direction-mismatch:${metrics.lang}/${metrics.dir}`);
      }

      if (viewport.width <= 1024) {
        const menuButton = page.locator('[data-v2-menu-toggle]');
        if (await menuButton.count() && await menuButton.isVisible()) {
          await menuButton.click();
          const menuState = await page.evaluate(() => {
            const nav = document.querySelector('[data-v2-nav]');
            if (!nav) return null;
            const nr = nav.getBoundingClientRect();
            const links = [...nav.querySelectorAll('a')].map(a => {
              const r = a.getBoundingClientRect();
              return { width: Math.round(r.width), height: Math.round(r.height) };
            });
            return {
              left: Math.round(nr.left), right: Math.round(nr.right), width: Math.round(nr.width),
              viewport: window.innerWidth,
              outside: nr.left < -1 || nr.right > window.innerWidth + 1,
              undersizedLinks: links.filter(x => x.width < 44 || x.height < 44).length
            };
          });
          if (menuState?.outside) entry.issues.push('mobile-menu-outside-viewport');
          if (menuState?.undersizedLinks) entry.issues.push(`mobile-menu-undersized-links:${menuState.undersizedLinks}`);
          await page.keyboard.press('Escape');
        }
      }

      if (route.includes('/connect/')) {
        const connectState = await page.evaluate(() => {
          const submit = document.querySelector('[data-submit]');
          const next = document.querySelector('[data-next]');
          const steps = [...document.querySelectorAll('.connect-v2__step')];
          const visible = el => !!el && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0;
          const stepRects = steps.map(el => {
            const r = el.getBoundingClientRect();
            return { left: r.left, right: r.right, width: r.width };
          });
          return {
            stepCount: steps.length,
            submitVisible: visible(submit),
            nextVisible: visible(next),
            stepsOutsideViewport: stepRects.filter(r => r.left < -1 || r.right > window.innerWidth + 1).length
          };
        });
        entry.connectState = connectState;
        if (connectState.stepCount !== 6) entry.issues.push(`connect-step-count:${connectState.stepCount}`);
        if (connectState.submitVisible) entry.issues.push('connect-submit-visible-before-review');
        if (!connectState.nextVisible) entry.issues.push('connect-next-hidden-on-first-step');
        if (viewport.width <= 480 && connectState.stepsOutsideViewport) entry.issues.push(`connect-progress-steps-outside-viewport:${connectState.stepsOutsideViewport}`);

        await page.keyboard.press('Tab');
        const focusVisible = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return false;
          const s = getComputedStyle(el);
          return s.outlineStyle !== 'none' || s.boxShadow !== 'none';
        });
        if (!focusVisible) entry.issues.push('focus-visible-not-detected-on-first-tab');
      }

      await page.screenshot({ path: path.join(outDir, `${routeName}__${viewportName}.png`), fullPage: true });

      if (entry.issues.length) {
        entry.status = 'REVIEW';
        report.issues.push({ routeName, viewportName, issues: entry.issues, metrics, connectState: entry.connectState || null });
      }
    } catch (error) {
      entry.status = 'FAIL';
      entry.issues.push(String(error?.message || error));
      report.issues.push({ routeName, viewportName, issues: entry.issues });
    } finally {
      report.checks.push(entry);
      await page.close();
    }
  }
}

await browser.close();
await fs.writeFile(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));

const failures = report.checks.filter(x => x.status === 'FAIL').length;
const reviews = report.checks.filter(x => x.status === 'REVIEW').length;
console.log(`Browser QA complete: ${report.checks.length} checks, ${failures} failures, ${reviews} review items.`);
if (failures) process.exitCode = 1;
