import { chromium } from 'playwright';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const productionOrigin = 'https://abshertam.qa';

const routeGroups = [
  '/',
  '/services/',
  '/services/company-transactions/',
  '/services/work-residence-visas/',
  '/services/attestation-documents/',
  '/services/certificates-records/',
  '/connect/',
  '/contact/',
  '/location/',
  '/faq/',
  '/terms/',
  '/privacy/'
];

const expectedPaths = routeGroups.flatMap(suffix => [
  `/ar${suffix === '/' ? '/' : suffix}`,
  `/en${suffix === '/' ? '/' : suffix}`
]);

const browser = await chromium.launch({ headless: true });
const failures = [];

for (const pathname of expectedPaths) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  try {
    await page.goto(`${baseURL}${pathname}`, { waitUntil: 'networkidle', timeout: 30000 });
    const result = await page.evaluate(({ pathname, productionOrigin }) => {
      const isAr = pathname.startsWith('/ar/');
      const arPath = isAr ? pathname : pathname.replace(/^\/en(?=\/|$)/, '/ar');
      const enPath = isAr ? pathname.replace(/^\/ar(?=\/|$)/, '/en') : pathname;
      const href = selector => document.head.querySelector(selector)?.href || '';
      return {
        canonical: href('link[rel="canonical"]'),
        ar: href('link[rel="alternate"][hreflang="ar"]'),
        en: href('link[rel="alternate"][hreflang="en"]'),
        xdefault: href('link[rel="alternate"][hreflang="x-default"]'),
        robots: document.head.querySelector('meta[name="robots"]')?.content || '',
        expected: {
          canonical: `${productionOrigin}${pathname}`,
          ar: `${productionOrigin}${arPath}`,
          en: `${productionOrigin}${enPath}`,
          xdefault: `${productionOrigin}${arPath}`
        }
      };
    }, { pathname, productionOrigin });

    for (const key of ['canonical', 'ar', 'en', 'xdefault']) {
      if (result[key] !== result.expected[key]) failures.push(`${pathname}: ${key} expected ${result.expected[key]} got ${result[key] || '(missing)'}`);
    }
    if (!/noindex/i.test(result.robots)) failures.push(`${pathname}: staging robots must remain noindex during Release Preparation`);
  } catch (error) {
    failures.push(`${pathname}: ${error?.message || error}`);
  } finally {
    await page.close();
  }
}

try {
  const response = await fetch(`${baseURL}/sitemap.xml`);
  const xml = await response.text();
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  const expectedUrls = expectedPaths.map(pathname => `${productionOrigin}${pathname}`);
  if (locs.length !== expectedUrls.length) failures.push(`sitemap: expected ${expectedUrls.length} <loc> entries, got ${locs.length}`);
  for (const url of expectedUrls) {
    if (!locs.includes(url)) failures.push(`sitemap: missing ${url}`);
  }
  if (/\.html(?:<|\?|$)/i.test(xml)) failures.push('sitemap: legacy .html URL detected');
} catch (error) {
  failures.push(`sitemap fetch: ${error?.message || error}`);
}

await browser.close();

if (failures.length) {
  console.error(`SEO cutover QA: ${failures.length} failure(s)`);
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}

console.log(`SEO cutover QA PASS: ${expectedPaths.length} routes, canonical/hreflang pairs valid, sitemap contains ${expectedPaths.length} semantic URLs, staging noindex preserved.`);
