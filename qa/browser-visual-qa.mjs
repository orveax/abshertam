import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const outDir = process.env.QA_OUT_DIR || 'qa-artifacts';

const routes = [
  ['home-ar', '/ar/'],
  ['home-en', '/en/'],
  ['services-ar', '/ar/services/'],
  ['services-en', '/en/services/'],
  ['master-ar', '/ar/services/company-transactions/'],
  ['master-en', '/en/services/company-transactions/'],
  ['connect-ar', '/ar/connect/'],
  ['connect-en', '/en/connect/'],
  ['faq-ar', '/ar/faq/'],
  ['faq-en', '/en/faq/'],
  ['terms-ar', '/ar/terms/'],
  ['terms-en', '/en/terms/']
];

const viewports = [
  ['desktop-1440', { width: 1440, height: 900 }],
  ['tablet-834', { width: 834, height: 1194 }],
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
            return {
              tag: el.tagName,
              text: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 80),
              width: Math.round(r.width),
              height: Math.round(r.height)
            };
          });
        return {
          scrollWidth: Math.max(html.scrollWidth, body?.scrollWidth || 0),
          innerWidth: window.innerWidth,
          horizontalOverflow: Math.max(html.scrollWidth, body?.scrollWidth || 0) > window.innerWidth + 1,
          undersizedTargets: interactive.filter(x => x.width < 44 || x.height < 44).slice(0, 30)
        };
      });

      entry.metrics = metrics;
      if (metrics.horizontalOverflow) entry.issues.push(`horizontal-overflow:${metrics.scrollWidth}>${metrics.innerWidth}`);

      if (viewport.width <= 834 && metrics.undersizedTargets.length) {
        entry.issues.push(`undersized-touch-targets:${metrics.undersizedTargets.length}`);
      }

      await page.screenshot({ path: path.join(outDir, `${routeName}__${viewportName}.png`), fullPage: true });

      if (route.includes('/connect/')) {
        await page.keyboard.press('Tab');
        const focusVisible = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return false;
          const s = getComputedStyle(el);
          return s.outlineStyle !== 'none' || s.boxShadow !== 'none';
        });
        if (!focusVisible) entry.issues.push('focus-visible-not-detected-on-first-tab');
      }

      if (entry.issues.length) {
        entry.status = 'REVIEW';
        report.issues.push({ routeName, viewportName, issues: entry.issues, metrics });
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
