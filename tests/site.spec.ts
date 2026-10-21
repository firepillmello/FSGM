import { test, expect } from '@playwright/test';
test('pages, article deep links, search and categories', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('./'); await expect(page.getByRole('heading', { level: 1 })).toContainText('Every Grant');
  for (const [path, title] of [['about','Experience'],['services','Financial clarity'],['who-we-serve','Different missions'],['resources','Educate first'],['contact','strengthen your grant']]) {
    await page.goto(`./#/${path}`); await expect(page.getByRole('heading',{level:1})).toContainText(title);
  }
  await page.goto('./#/resources'); await page.getByRole('searchbox').fill('budget'); await expect(page.locator('.resource-card')).toHaveCount(1);
  await page.getByRole('searchbox').fill(''); await page.getByRole('combobox').selectOption('Audit readiness'); await expect(page.locator('.resource-card')).toHaveCount(1);
  await page.getByRole('link',{name:/Preparing for a Government Grant/}).click(); await page.reload(); await expect(page.getByRole('heading',{level:1})).toContainText('Financial Review');
  await page.goto('./#/missing'); await expect(page.getByRole('heading',{level:1})).toContainText('back on course');
  expect(errors).toEqual([]);
});
test('contact validates and never sends demo data', async ({page}) => {
  await page.goto('./#/contact'); await page.getByRole('button',{name:'Preview inquiry'}).click(); await expect(page.locator('input:invalid').first()).toBeVisible();
  await page.getByLabel('Organization name').fill('Community Example'); await page.getByLabel('Contact person').fill('Test Person'); await page.getByLabel('Email address').fill('test@example.org');
  await page.getByLabel('Organization type').selectOption('Nonprofits & Community Organizations'); await page.getByLabel('General assistance').selectOption('Not sure yet'); await page.getByLabel('How can we help').fill('Looking for budget reporting support.');
  const posts: string[] = []; page.on('request',req => {if(req.method()==='POST') posts.push(req.url());});
  await page.getByRole('button',{name:'Preview inquiry'}).click(); await expect(page.getByRole('status')).toContainText('Nothing was sent or saved'); expect(posts).toEqual([]);
});
test('responsive navigation and no horizontal overflow',async ({page}) => {
  for (const width of [360,390,768,1440]) { await page.setViewportSize({width,height:900}); await page.goto('./'); await expect(page.getByRole('heading',{level:1})).toBeVisible(); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy(); }
  await page.setViewportSize({width:390,height:844}); await page.getByRole('button',{name:'Open navigation'}).click(); await expect(page.getByRole('button',{name:'Close navigation'})).toHaveAttribute('aria-expanded','true'); await page.getByRole('navigation').getByRole('link',{name:'Resources',exact:true}).click(); await expect(page.getByRole('heading',{level:1})).toContainText('Educate first'); await expect(page.getByRole('button',{name:'Open navigation'})).toHaveAttribute('aria-expanded','false');
});
test('all articles and pages fit mobile, with keyboard skip link', async ({page}) => {
  await page.setViewportSize({width:360,height:800});
  for(const route of ['about','services','who-we-serve','resources','contact','resources/after-the-award','resources/budget-versus-actual','resources/common-financial-mistakes','resources/financial-review-preparation','resources/internal-controls','resources/fractional-fiscal-director']) {
    await page.goto(`./#/${route}`); await expect(page.getByRole('heading',{level:1})).toBeVisible(); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),route).toBeTruthy();
    expect(await page.title()).not.toContain('Page Not Found');
  }
  await page.goto('./'); await expect(page.getByRole('heading',{level:1})).toBeVisible(); await page.keyboard.press('Tab'); await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused(); await page.keyboard.press('Enter'); await expect(page.locator('main')).toBeFocused();
});
