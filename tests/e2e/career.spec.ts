import { expect, test } from '@playwright/test';
import axe from 'axe-core';

const years = ['2022', '2024', '2025', 'Now'] as const;
const careerFrame = '[data-window-id="career"]';

test.describe('Career.app desktop', () => {
  test('opens through every existing route, supports history, and keeps controls synchronized', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Desktop Career coverage runs in Chromium.');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('./#career');

    await expect(page.locator(careerFrame)).toBeVisible();
    const range = page.getByRole('slider', { name: 'Career stage' });
    await expect(range).toHaveAttribute('min', '0');
    await expect(range).toHaveAttribute('max', '3');
    await expect(range).toHaveAttribute('step', '1');
    await expect(range).toHaveValue('0');
    for (const year of years) await expect(page.getByRole('button', { name: year })).toBeVisible();

    await page.getByRole('button', { name: '2025' }).click();
    await expect(range).toHaveValue('2');
    await expect(range).toHaveAttribute('aria-valuetext', '2025 — Associate Software Engineer');
    await range.focus();
    await page.keyboard.press('ArrowRight');
    await expect(range).toHaveValue('3');
    await expect(page.getByRole('heading', { name: 'Building paved roads for engineering teams' })).toBeVisible();

    await page.getByRole('link', { name: 'Desktop' }).click();
    await expect(page).toHaveURL(/#desktop$/);
    await page.getByRole('link', { name: 'Career' }).click();
    await expect(page).toHaveURL(/#career$/);
    await page.goBack();
    await expect(page).toHaveURL(/#desktop$/);
    await page.goForward();
    await expect(page).toHaveURL(/#career$/);

    await page.getByRole('button', { name: 'Minimize Career' }).click();
    await page.locator('[data-dock-app-id="career"]').click();
    await expect(page.locator(careerFrame)).toBeVisible();
    await page.getByRole('button', { name: 'Maximize Career' }).click();
    await expect(page.getByRole('button', { name: 'Restore Career' })).toBeVisible();
    await page.getByRole('button', { name: 'Close Career' }).click();
    await page.getByRole('button', { name: 'Open Career' }).click();
    await expect(page.locator(careerFrame)).toBeVisible();
  });

  test('uses immediate readable stage swaps with reduced motion', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Desktop reduced-motion coverage runs in Chromium.');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./#career');
    await page.getByRole('button', { name: 'Now' }).click();
    await expect(page.getByTestId('career-stage')).toHaveAttribute('data-reduced-motion', 'true');
    await expect(page.getByRole('heading', { name: 'Building paved roads for engineering teams' })).toBeVisible();
  });
});

test.describe('Career.app mobile', () => {
  test('retains the supported Career hash through real provider hydration', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-Chrome', 'Mobile hash hydration coverage runs in mobile Chromium.');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#career');

    await expect(page).toHaveURL(/#career$/);
    await expect(page.locator(careerFrame)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Learning to operate production systems' })).toBeVisible();
  });

  test('keeps the Career controls readable, scrollable, zoomable, and drag-free', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-Chrome', 'Mobile Career coverage runs in mobile Chromium.');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#career');

    await expect(page.locator(careerFrame)).toBeVisible();
    await expect(page.locator(careerFrame)).not.toHaveAttribute('data-drag-enabled');
    await expect(page.getByRole('slider', { name: 'Career stage' })).toBeVisible();
    await page.getByRole('button', { name: 'Now' }).click();
    await expect(page.getByRole('heading', { name: 'Building paved roads for engineering teams' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.evaluate(() => document.body.style.zoom = '2');
    await expect(page.getByRole('slider', { name: 'Career stage' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Now' })).toBeVisible();
  });

  test('has no serious or critical accessibility violation at the Career route', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-Chrome', 'Mobile Career axe coverage runs in mobile Chromium.');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#career');
    await page.addScriptTag({ content: axe.source });
    const seriousOrCritical = await page.evaluate(async () => {
      const axeRunner = (window as unknown as {
        axe: { run: () => Promise<{ violations: readonly { impact: string | null }[] }> };
      }).axe;
      const results = await axeRunner.run();
      return results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical').length;
    });
    expect(seriousOrCritical).toBe(0);
  });
});
