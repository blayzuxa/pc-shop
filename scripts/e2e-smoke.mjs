import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = 'http://127.0.0.1:4173';
const routes = [
  '/', '/scout-start.html', '/scout-gamer.html', '/scout-pro.html',
  '/scout-elite.html', '/sborka-pk-krasnodar.html',
  '/igrovye-kompyutery-krasnodar.html',
  '/apgreyd-i-obsluzhivanie-pk-krasnodar.html',
  '/vykup-videokart-i-komplektuyushchih-krasnodar.html',
  '/privacy-policy.html', '/pdn-consent.html'
];
const browser = await chromium.launch({ headless: true });
try {
  // Smoke-check all commercial routes on desktop and on a narrow smartphone.
  for (const [device, viewport] of [
    ['desktop', { width: 1366, height: 900 }],
    ['mobile', { width: 390, height: 844 }],
    ['small-mobile', { width: 320, height: 700 }],
  ]) {
    const context = await browser.newContext({ viewport, locale: 'ru-RU' });
    await context.route('**/mc.yandex.ru/**', route =>
      route.fulfill({ body: '', contentType: 'application/javascript' }));
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const path of routes) {
      const response = await page.goto(base + path, { waitUntil: 'domcontentloaded' });
      assert.equal(response?.status(), 200, device + ' ' + path + ': HTTP not 200');
      assert.ok((await page.title()).includes('ScoutPC'), device + ' ' + path + ': title missing');
      if (device !== 'desktop' && await page.locator('#hamburger').count()) {
        await page.locator('#hamburger').click();
        assert.equal(await page.locator('#mobileMenuOverlay').evaluate(
          el => getComputedStyle(el).visibility), 'visible',
          device + ' ' + path + ': mobile menu not visible');
        assert.equal(await page.locator('#hamburger').getAttribute('aria-expanded'), 'true');
        await page.locator('#mobileMenuClose').click();
        assert.equal(await page.locator('#hamburger').getAttribute('aria-expanded'), 'false');
        assert.equal(await page.evaluate(() => document.body.style.overflow), '',
          device + ' ' + path + ': body remains locked');
      }
    }
    assert.deepEqual(errors, [], device + ': uncaught script errors');
    console.log('PASS route navigation + mobile menu', device, routes.length);
    await context.close();
  }

  // Catalog and carousel regression checks.
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await context.newPage();
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  if (await page.locator('#privacyDecline').isVisible()) await page.locator('#privacyDecline').click();
  assert.equal(await page.locator('.pc-card').count(), 8);
  assert.equal(await page.locator('.pc-card .pc-model-link').count(), 8);
  assert.equal(await page.locator('.pc-card .consult-menu').count(), 8);
  assert.equal(await page.locator('.pc-fps .fps-sub').count(), 8);
  const subs = await page.locator('.pc-fps .fps-sub').allInnerTexts();
  assert.ok(subs.every(s => s.includes('Медианный FPS по 10 играм')));
  const warranty = page.locator('.hero-stat-value[data-count="12"]');
  assert.equal(await warranty.innerText(), '12');
  assert.equal(await warranty.getAttribute('data-static'), 'true');

  await page.locator('.tab-btn[data-tab="intel"]').click();
  assert.equal(await page.locator('#intel-group').evaluate(el => getComputedStyle(el).display !== 'none'), true);
  await page.locator('.budget-btn[data-budget="1"]').click();
  assert.equal(await page.locator('#intel-group .pc-card:not(.budget-hidden)').count(), 1);
  await page.locator('.tab-btn[data-tab="amd"]').click();
  assert.equal(await page.locator('#amd-group .pc-card:not(.budget-hidden)').count(), 1);

  assert.equal(await page.locator('#prevSlide').evaluate(el => el.tagName), 'BUTTON');
  assert.equal(await page.locator('#nextSlide').evaluate(el => el.tagName), 'BUTTON');
  assert.equal(await page.locator('#sliderDots button').count(), 8);
  await page.locator('#nextSlide').click();
  assert.equal(await page.locator('#sliderDots button[aria-pressed="true"]').count(), 1);
  assert.equal(await page.locator('#sliderDots button[aria-pressed="true"]').first().getAttribute('aria-label'),
    'Показать фото 2 из 8');
  await page.locator('#sliderDots button').nth(3).focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#sliderDots button[aria-pressed="true"]').first().getAttribute('aria-label'),
    'Показать фото 4 из 8');
  console.log('PASS catalog, warranty, median FPS, accessible carousel');
  await context.close();

  // Consent-gated conversion tracking: no completion goal just for seeing the summary.
  const flowContext = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  await flowContext.addInitScript(() => {
    window.__qaGoals = [];
    window.ym = (...a) => window.__qaGoals.push(a);
    window.open = url => { window.__qaOpened = url; return null; };
  });
  await flowContext.route('**/mc.yandex.ru/**', route =>
    route.fulfill({ body: '', contentType: 'application/javascript' }));
  const flow = await flowContext.newPage();
  await flow.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await flow.locator('#privacyAccept').click();
  await flow.locator('.choice-grid[data-group="platform"] .choice-btn').first().click();
  await flow.locator('#builderNext').click();
  await flow.locator('#builderBudgetAmount').fill('100000');
  await flow.locator('#builderBudgetAmount').blur();
  await flow.locator('#builderNext').click();
  await flow.locator('.choice-grid[data-group="goal"] .choice-btn').first().click();
  await flow.locator('#builderNext').click();
  await flow.locator('#builderNext').click();
  assert.ok((await flow.locator('#builderSummary').innerText()).includes('100 000'));
  const goals = () => flow.evaluate(() =>
    window.__qaGoals.filter(a => a[1] === 'reachGoal').map(a => a[2]));
  assert.equal((await goals()).filter(g => g === 'builder_complete').length, 0,
    'Builder completion incorrectly fires on preview');
  await flow.locator('#builderNext').click();
  assert.equal((await goals()).filter(g => g === 'builder_complete').length, 1);
  assert.equal((await goals()).filter(g => g === 'contact_telegram').length, 1);
  const opened = await flow.evaluate(() => window.__qaOpened);
  assert.ok(opened.startsWith('https://t.me/Scout_PC?text='));
  assert.ok(decodeURIComponent(opened).includes('100 000'));
  console.log('PASS builder flow and analytics');
  await flowContext.close();

  // Model CTA must carry actual series, not silently open a generic chat.
  const model = await browser.newPage();
  for (const series of ['start', 'gamer', 'pro', 'elite']) {
    await model.goto(base + '/scout-' + series + '.html', { waitUntil: 'domcontentloaded' });
    for (const selector of ['.product-actions .product-primary', '.product-cta-actions a:first-child']) {
      const href = await model.locator(selector).getAttribute('href');
      assert.ok(href?.startsWith('https://t.me/Scout_PC?text='));
      assert.ok(decodeURIComponent(href).toLowerCase().includes('scout ' + series));
    }
  }
  await model.goto(base + '/terms.html', { waitUntil: 'domcontentloaded' });
  assert.ok((await model.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'));
  await model.close();
  console.log('PASS model CTAs, terms noindex');
} finally {
  await browser.close();
}
