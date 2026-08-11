import { expect, test } from '@playwright/test';

const workFrame = '[data-window-id="work"]';
const workTitlebar = '[data-titlebar="work"]';
const resetLayout = '[data-window-control="reset-layout"]';

test.describe('window system desktop', () => {
  test('keeps drag recoverable, source order stable, and controls keyboard-operable', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Desktop coverage runs in Chromium.');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('./#desktop');

    await expect(page.locator(workFrame)).toBeVisible();
    const before = await page.locator(workFrame).boundingBox();
    await page.locator(workTitlebar).dragTo(page.locator('main'), { targetPosition: { x: 1, y: 1 } });
    const after = await page.locator(workFrame).boundingBox();
    expect(after?.x).toBeGreaterThanOrEqual(0);
    expect(after?.y).toBeGreaterThanOrEqual(0);
    expect(after?.x).toBeLessThanOrEqual(1440 - (after?.width ?? 0));
    expect(after?.y).toBeLessThanOrEqual(1000 - (after?.height ?? 0));
    await page.getByRole('button', { name: 'Close Work' }).click();
    await expect(page.getByRole('button', { name: 'Work' })).toBeFocused();
    await page.getByRole('button', { name: 'Work' }).click();
    await expect(page.locator(workFrame).getByRole('heading', { name: 'Work' })).toBeFocused();
    await page.getByRole('button', { name: 'Maximize Work' }).click();
    await page.locator(workFrame).getByRole('button', { name: 'Close Work' }).focus();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Maximize Work' })).toBeVisible();

    await page.locator(resetLayout).click();
    expect(await page.locator('[data-window-id]').evaluateAll((frames) => frames.map((frame) => frame.getAttribute('data-window-id'))))
      .toEqual(['about', 'work', 'command']);
    await expect(page.getByText('Migrated 50+ repositories and reduced average build time by four minutes.')).toHaveCount(1);
    expect(before).not.toBeNull();
  });
});

test.describe('window system mobile', () => {
  test('uses one normal-flow active application with dock recovery and no horizontal overflow', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-Chrome', 'Coarse-pointer coverage runs in mobile Chromium.');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#desktop');

    await expect(page.locator('[data-window-id]')).toHaveCount(1);
    await page.getByRole('button', { name: 'Work' }).click();
    await expect(page.locator(workFrame)).toBeVisible();
    const before = await page.locator(workFrame).boundingBox();
    await page.locator(workTitlebar).hover();
    await page.mouse.down();
    await page.mouse.move(300, 600);
    await page.mouse.up();
    const after = await page.locator(workFrame).boundingBox();
    expect(after?.x).toBe(before?.x);
    expect(after?.y).toBe(before?.y);
    await page.getByRole('button', { name: 'Command' }).click();
    await expect(page.locator('[data-window-id="command"]')).toBeVisible();
    await expect(page.locator(resetLayout)).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(before).not.toBeNull();
  });
});
