import { chromium } from 'playwright';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const failures = [];

const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

try {
  await page.goto(`${baseURL}/ar/connect/?source_id=%3Cscript%3Ebad%3C%2Fscript%3E&utm_source=${'x'.repeat(220)}`, {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  await page.locator('[name="path_choice"][value="P01"]').waitFor({ state: 'attached' });

  const sourceId = await page.locator('[name="source_id"]').inputValue();
  const utmSource = await page.locator('[name="utm_source"]').inputValue();
  expect(sourceId === 'direct', `unsafe-source-id-not-rejected:${sourceId}`);
  expect(utmSource.length <= 120, `utm-source-not-bounded:${utmSource.length}`);

  await page.locator('[name="path_choice"][value="P01"]').check();
  await page.locator('[data-next]').click();

  const sensitiveOutcome = 'SECURITY-TEST-SENSITIVE-OUTCOME';
  await page.locator('[name="desired_outcome"]').fill(sensitiveOutcome);
  await page.locator('[name="progress_state"][value="not_started"]').check();
  await page.locator('[data-next]').click();

  await page.locator('[name="readiness_summary"]').selectOption('some');
  await page.locator('[data-next]').click();

  const sensitiveName = 'Security Test Person';
  const sensitivePhone = '+97455551234';
  const sensitiveEmail = 'security-test@example.invalid';
  await page.locator('[name="full_name"]').fill(sensitiveName);
  await page.locator('[name="mobile"]').fill(sensitivePhone);
  await page.locator('[name="email"]').fill(sensitiveEmail);

  const storageDump = await page.evaluate(() => JSON.stringify(sessionStorage));
  for (const value of [sensitiveOutcome, sensitiveName, sensitivePhone, sensitiveEmail]) {
    expect(!storageDump.includes(value), `pii-persisted-in-session-storage:${value}`);
  }

  await page.locator('[data-next]').click();
  await page.locator('[name="preferred_next_step"][value="whatsapp"]').check();
  await page.locator('[data-next]').click();
  await page.locator('[name="consent"]').check();
  await page.locator('[data-submit]').click();

  await page.locator('[data-staging-handoff].is-visible').waitFor({ state: 'visible' });
  const handoffHref = await page.locator('[data-handoff-whatsapp]').getAttribute('href');
  const decodedHref = decodeURIComponent(handoffHref || '');
  for (const value of [sensitiveOutcome, sensitiveName, sensitivePhone, sensitiveEmail]) {
    expect(!decodedHref.includes(value), `pii-leaked-in-handoff-url:${value}`);
  }

  const copyText = await page.locator('[data-copy-handoff]').getAttribute('data-copy-text');
  expect(Boolean(copyText && copyText.includes(sensitiveName)), 'explicit-copy-summary-missing-request-details');
} catch (error) {
  failures.push(`security-qa-exception:${error?.message || error}`);
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`Connect security QA failed (${failures.length}):`);
  failures.forEach(item => console.error(`- ${item}`));
  process.exitCode = 1;
} else {
  console.log('Connect security QA passed: query bounds, session storage minimization, and handoff URL privacy.');
}
