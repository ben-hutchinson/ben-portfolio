import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 1000 },
] as const;

test.skip(({ browserName }) => browserName !== 'chromium', 'Visual baselines are captured deterministically in Chromium.');

for (const viewport of viewports) {
  test(`catches a visual regression in the ${viewport.name} command centre viewport`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await expect(page).toHaveScreenshot(`command-centre-${viewport.width}x${viewport.height}.png`, {
      animations: 'disabled',
      fullPage: true,
    });
  });
}
