import { chromium } from 'playwright';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const failures = [];

const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

const setChecked = async selector => {
  await page.locator(selector).evaluate(el => {
    el.checked = true;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });
};

try {
  await page.goto(`${baseURL}/connect.html`, { waitUntil: 'networkidle', timeout: 30000 });
  expect(new URL(page.url()).pathname === '/ar/connect/', `legacy-connect-not-redirected:${page.url()}`);

  await page.goto(`${baseURL}/ar/connect/?source_id=%3Cscript%3Ebad%3C%2Fscript%3E&utm_source=${'x'.repeat(220)}`, {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  await page.locator('[name="path_choice"][value="P01"]').waitFor({ state: 'attached' });

  const sourceId = await page.locator('[name="source_id"]').inputValue();
  const utmSource = await page.locator('[name="utm_source"]').inputValue();
  expect(sourceId === 'direct', `unsafe-source-id-not-rejected:${sourceId}`);
  expect(utmSource.length <= 120, `utm-source-not-bounded:${utmSource.length}`);

  await setChecked('[name="path_choice"][value="P01"]');
  await page.locator('[data-next]').click();

  const sensitiveOutcome = 'SECURITY-TEST-SENSITIVE-OUTCOME';
  await page.locator('[name="desired_outcome"]').fill(sensitiveOutcome);
  await setChecked('[name="progress_state"][value="not_started"]');
  await page.locator('[data-next]').click();

  await page.locator('[name="readiness_summary"]').selectOption('some');
  await page.locator('[data-next]').click();

  const sensitiveName = 'Security Test Person';
  const sensitivePhone = '+97455551234';
  const sensitiveEmail = 'security-test@example.invalid';
  await page.locator('[name="full_name"]').fill(sensitiveName);
  await page.locator('[name="mobile"]').fill(sensitivePhone);
  await page.locator('[name="email"]').fill(sensitiveEmail);

  const storageDump = await page.evaluate(() => JSON.stringify(Object.fromEntries(Object.entries(sessionStorage))));
  for (const value of [sensitiveOutcome, sensitiveName, sensitivePhone, sensitiveEmail]) {
    expect(!storageDump.includes(value), `pii-persisted-in-session-storage:${value}`);
  }

  await page.locator('[data-next]').click();
  await setChecked('[name="preferred_next_step"][value="whatsapp"]');
  await page.locator('[data-next]').click();
  await setChecked('[name="consent"]');
  await page.locator('[data-submit]').click();

  await page.locator('[data-staging-handoff].is-visible').waitFor({ state: 'visible' });
  const handoffHref = await page.locator('[data-handoff-whatsapp]').getAttribute('href');
  const decodedHref = decodeURIComponent(handoffHref || '');
  for (const value of [sensitiveOutcome, sensitiveName, sensitivePhone, sensitiveEmail]) {
    expect(!decodedHref.includes(value), `pii-leaked-in-connect-handoff-url:${value}`);
  }

  const copyText = await page.locator('[data-copy-handoff]').getAttribute('data-copy-text');
  expect(Boolean(copyText && copyText.includes(sensitiveName)), 'explicit-copy-summary-missing-request-details');

  await page.goto(`${baseURL}/ar/contact/`, { waitUntil: 'networkidle', timeout: 30000 });
  const contactName = 'Contact Security Person';
  const contactEmail = 'contact-security@example.invalid';
  const contactSubject = 'SECURITY-CONTACT-SUBJECT';
  const contactMessage = 'SECURITY-CONTACT-SENSITIVE-MESSAGE';
  await page.locator('[name="full_name"]').fill(contactName);
  await page.locator('[name="email"]').fill(contactEmail);
  await page.locator('[name="subject"]').fill(contactSubject);
  await page.locator('[name="message"]').fill(contactMessage);
  await setChecked('[name="consent"]');
  await page.locator('[data-contact-form] [type="submit"]').click();
  await page.locator('[data-contact-handoff].is-visible').waitFor({ state: 'visible' });

  const contactWa = decodeURIComponent((await page.locator('[data-contact-handoff-wa]').getAttribute('href')) || '');
  const contactMail = decodeURIComponent((await page.locator('[data-contact-handoff-mail]').getAttribute('href')) || '');
  for (const value of [contactName, contactEmail, contactSubject, contactMessage]) {
    expect(!contactWa.includes(value), `pii-leaked-in-contact-whatsapp-url:${value}`);
    expect(!contactMail.includes(value), `pii-leaked-in-contact-mailto-url:${value}`);
  }
} catch (error) {
  failures.push(`security-qa-exception:${error?.message || error}`);
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`Connect/Contact security QA failed (${failures.length}):`);
  failures.forEach(item => console.error(`- ${item}`));
  process.exitCode = 1;
} else {
  console.log('Connect/Contact security QA passed: legacy redirect, query bounds, storage minimization, and handoff URL privacy.');
}
