const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';

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

const pages = routeGroups.flatMap(suffix => [
  `/ar${suffix === '/' ? '/' : suffix}`,
  `/en${suffix === '/' ? '/' : suffix}`
]);

const failures = [];
const discovered = new Map();

for (const pagePath of pages) {
  const response = await fetch(`${baseURL}${pagePath}`);
  if (!response.ok) {
    failures.push(`${pagePath}: source page HTTP ${response.status}`);
    continue;
  }
  const html = await response.text();
  const hrefs = [...html.matchAll(/\shref\s*=\s*["']([^"']+)["']/gi)].map(m => m[1]);
  for (const href of hrefs) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const url = new URL(href, baseURL);
    const target = url.pathname;
    if (/\.html$/i.test(target)) failures.push(`${pagePath}: legacy internal link ${href}`);
    if (!discovered.has(target)) discovered.set(target, new Set());
    discovered.get(target).add(pagePath);
  }
}

for (const [target, sources] of discovered) {
  const response = await fetch(`${baseURL}${target}`, { redirect: 'manual' });
  if (response.status >= 400) failures.push(`${target}: HTTP ${response.status}; linked from ${[...sources].join(', ')}`);
}

if (failures.length) {
  console.error(`Internal link QA: ${failures.length} failure(s)`);
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}

console.log(`Internal link QA PASS: ${pages.length} source pages scanned, ${discovered.size} unique internal targets resolved, no legacy .html links detected.`);
