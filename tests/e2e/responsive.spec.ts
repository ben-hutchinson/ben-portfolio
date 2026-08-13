import { expect, test } from '@playwright/test';

test.describe('PORT-011 responsive shell', () => {
  test('shows one drag-free, naturally scrolling application below 768px without horizontal clipping', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Narrow responsive coverage runs in Chromium.');
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('./#desktop');

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

  test('keeps primary narrow-layout targets at least 44 by 44 CSS pixels and usable at 200% zoom', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Narrow target-size coverage runs in Chromium.');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#desktop');

    for (const target of [
      page.getByRole('link', { name: 'Work' }).first(),
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

  test('keeps Menu targets practical at the 767px mobile breakpoint', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Mobile breakpoint coverage runs in Chromium.');
    await page.setViewportSize({ width: 767, height: 844 });
    await page.goto('./#desktop');

    const menuWork = await page.getByRole('link', { name: 'Work' }).first().boundingBox();
    expect(menuWork?.width).toBeGreaterThanOrEqual(44);
    expect(menuWork?.height).toBeGreaterThanOrEqual(44);
  });
});
