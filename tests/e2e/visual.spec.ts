import { expect, test } from '@playwright/test';

const snapshots = [
  { name: 'desktop-1440x1000.png', hash: '#desktop', viewport: { width: 1440, height: 1000 } },
  { name: 'desktop-390x844.png', hash: '#desktop', viewport: { width: 390, height: 844 } },
  { name: 'career-1440x1000.png', hash: '#career', viewport: { width: 1440, height: 1000 } },
  { name: 'career-390x844.png', hash: '#career', viewport: { width: 390, height: 844 } },
] as const;

test.describe('PORT-012 approved visual baselines @visual', () => {
  for (const snapshot of snapshots) {
    test(`${snapshot.name} matches the approved Portfolio OS composition`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'Chromium', 'Visual baselines run in Chromium.');
      await page.setViewportSize(snapshot.viewport);
      await page.goto(`/ben-portfolio/${snapshot.hash}`);
      await expect(page).toHaveScreenshot(snapshot.name, { animations: 'disabled' });
    });
  }
});
