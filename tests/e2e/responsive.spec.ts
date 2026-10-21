import { expect, test } from '@playwright/test';

test('keeps focused command suggestions bounded above the field at required sizes and zoom', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'Chromium', 'Suggestion geometry runs in Chromium.');
  for (const scenario of [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'tablet', width: 1024, height: 768 },
    { name: 'reduced-height', width: 1440, height: 650 },
    { name: 'mobile', width: 390, height: 844 },
    { name: '200-percent-zoom', width: 390, height: 844, zoom: 2 },
  ]) {
    await page.setViewportSize({ width: scenario.width, height: scenario.height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./#desktop');
    if (scenario.zoom) await page.locator('body').evaluate((body, zoom) => { body.style.zoom = String(zoom); }, scenario.zoom);
    const terminal = page.getByTestId('micro-terminal');
    const input = terminal.getByRole('combobox', { name: 'Portfolio command' });
    await input.click();
    const list = terminal.getByRole('listbox');
    await expect(list).toBeVisible();
    await expect(list.getByRole('option')).toHaveCount(6);
    await expect(input).toBeInViewport();
    await expect(terminal.getByRole('button', { name: 'Run command' })).toBeInViewport();
    const listBox = await list.boundingBox();
    const fieldBox = await input.boundingBox();
    expect(listBox).not.toBeNull();
    expect(fieldBox).not.toBeNull();
    expect(listBox!.x, scenario.name).toBeGreaterThanOrEqual(0);
    expect(listBox!.y, scenario.name).toBeGreaterThanOrEqual(0);
    expect(listBox!.x + listBox!.width, scenario.name).toBeLessThanOrEqual(scenario.width + 1);
    expect(listBox!.y + listBox!.height, scenario.name).toBeLessThanOrEqual(fieldBox!.y + 1);

    await input.fill('project ');
    await expect(list.getByRole('option')).toHaveCount(4);
    expect(await list.evaluate((element) => element.scrollWidth <= element.clientWidth), scenario.name).toBe(true);
    for (const option of await list.getByRole('option').all()) {
      expect(await option.evaluate((element) => element.clientHeight), scenario.name).toBeGreaterThanOrEqual(44);
    }
    await input.press('ArrowUp');
    await expect(list.getByRole('option', { name: /project taskmon/i })).toBeInViewport();
    await page.screenshot({ path: testInfo.outputPath(`suggestions-${scenario.name}.png`) });
    await input.press('Escape');
    await expect(list).toHaveCount(0);
    await expect(input).toHaveValue('project ');
    await input.press('Tab');
    await expect(terminal.getByRole('button', { name: 'Run command' })).toBeFocused();
    await expect(page).toHaveURL(/#desktop$/);
    await input.click();
    await input.fill('zzzzq');
    await expect(terminal.getByText('No matching commands. Try help.')).toBeVisible();
    await expect(terminal.getByRole('option')).toHaveCount(0);
    await page.getByRole('button', { name: 'About', exact: true }).click();
    await expect(list).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), scenario.name).toBe(true);
  }
});

test.describe('PORT-011 responsive shell', () => {
  test('uses a positive, reduced desktop gutter and does not overflow at 320 CSS pixels', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'PORT-014 shell geometry runs in Chromium.');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('./#desktop');

    const shell = page.locator('#root > div > div');
    const desktopGutter = (await shell.boundingBox())?.x;
    expect(desktopGutter).toBeGreaterThan(0);
    expect(desktopGutter).toBeLessThan(30);

    await page.setViewportSize({ width: 320, height: 568 });
    await expect(page.getByTestId('micro-terminal')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test('shows one drag-free, naturally scrolling application below 768px without horizontal clipping', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Narrow responsive coverage runs in Chromium.');
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('./#desktop');

    await expect(page.getByTestId('micro-terminal')).toBeVisible();

    const displayedWindowIds = await page.locator('[data-window-id]').evaluateAll((frames) => frames
      .filter((frame) => getComputedStyle(frame).display !== 'none')
      .map((frame) => frame.getAttribute('data-window-id')));
    expect(displayedWindowIds).toEqual(['about']);
    await expect(page.locator('[data-window-id="about"]')).not.toHaveAttribute('data-drag-enabled');

    await page.getByRole('button', { name: 'Work' }).click();
    await expect(page.locator('[data-window-id="work"]')).toBeVisible();
    expect(await page.locator('[data-window-id]').evaluateAll((frames) => (
      frames.filter((frame) => getComputedStyle(frame).display !== 'none').length
    ))).toBe(1);

    const scrollsNaturallyWithoutClipping = await page.evaluate(() => {
      const root = document.scrollingElement;
      if (root === null || root.scrollHeight <= root.clientHeight) return false;
      window.scrollTo({ top: root.scrollHeight, behavior: 'auto' });
      return window.scrollY > 0 && document.documentElement.scrollWidth <= window.innerWidth;
    });
    expect(scrollsNaturallyWithoutClipping).toBe(true);
  });

  test('shows the compact terminal only in Desktop flow at 390 CSS pixels', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Mobile-sized terminal coverage runs in Chromium.');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#desktop');

    const terminal = page.getByTestId('micro-terminal');
    await expect(terminal).toBeVisible();
    await expect(terminal.getByRole('combobox', { name: 'Portfolio command' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await page.goto('./#career');
    await expect(page).toHaveURL(/#career$/);
    await expect(terminal).toHaveCount(0);
  });

  test('keeps primary narrow-layout targets at least 44 by 44 CSS pixels and usable at 200% zoom', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Narrow target-size coverage runs in Chromium.');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#desktop');

    for (const target of [
      page.locator('[data-dock-app-id="work"]'),
      page.getByRole('button', { name: 'Close About' }),
      page.getByRole('button', { name: 'Work' }),
      page.getByRole('link', { name: 'Download CV' }),
    ]) {
      const box = await target.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }

    await page.getByRole('button', { name: 'Career' }).click();
    await page.evaluate(() => { document.body.style.zoom = '2'; });
    await expect(page.getByRole('slider', { name: 'Career stage' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Now' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test('keeps dock targets practical at the 767px mobile breakpoint', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Mobile breakpoint coverage runs in Chromium.');
    await page.setViewportSize({ width: 767, height: 844 });
    await page.goto('./#desktop');

    const dockWork = await page.locator('[data-dock-app-id="work"]').boundingBox();
    expect(dockWork?.width).toBeGreaterThanOrEqual(44);
    expect(dockWork?.height).toBeGreaterThanOrEqual(44);
  });
});
