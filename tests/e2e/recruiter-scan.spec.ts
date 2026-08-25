import { expect, test } from '@playwright/test';

const exactClaim = 'Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes';

test.describe('recruiter-first desktop', () => {
  test('exposes the zero-click contract and every one-action recruiter route', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Desktop recruiter scan runs in Chromium.');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('./#desktop');

    for (const locator of [
      page.getByText('Ben Hutchinson').first(),
      page.getByText('Mid-level platform engineer · Manchester, UK', { exact: true }),
      page.getByText('Manchester, UK', { exact: true }),
      page.getByText('Open to platform and backend engineering opportunities. Production-minded systems, developer experience, and internal tooling.', { exact: true }),
      page.getByText('Backend engineer moving deeper into platform engineering, building reliable paths and reducing friction for engineering teams.', { exact: true }),
      page.getByText(exactClaim, { exact: true }),
    ]) {
      await expect(locator).toBeVisible();
      expect((await locator.boundingBox())?.y).toBeLessThan(1000);
    }
    await expect(page.getByText(exactClaim, { exact: true })).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1, name: 'Ben Hutchinson' })).toHaveCount(1);

    const shortcuts = ['about', 'career', 'work'] as const;
    for (const appId of shortcuts) {
      const name = `Open ${appId[0].toUpperCase()}${appId.slice(1)}`;
      await expect(page.getByRole('button', { name })).toHaveAttribute('data-desktop-shortcut-app-id', appId);
    }

    await page.getByRole('button', { name: 'Open Work' }).click();
    await expect(page).toHaveURL(/#work$/);
    await page.goBack();
    await expect(page).toHaveURL(/#desktop$/);
    await page.getByRole('button', { name: 'Open Career' }).click();
    await expect(page).toHaveURL(/#career$/);

    await expect(page.getByRole('link', { name: 'Download CV' })).toHaveAttribute('download', 'ben-hutchinson-cv.pdf');
    await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/ben-hutchinson');
    await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/ben-hutchinson0412/');
    await page.getByRole('button', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/#contact$/);
  });
});

test.describe('recruiter-first mobile', () => {
  test('shows About with one h1 and keeps the mobile window model recoverable', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-Chrome', 'Mobile recruiter scan runs in mobile Chromium.');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#desktop');

    const visibleIds = await page.locator('[data-window-id]').evaluateAll((frames) => frames
      .filter((frame) => getComputedStyle(frame).display !== 'none')
      .map((frame) => frame.getAttribute('data-window-id')));
    expect(visibleIds).toEqual(['about']);
    await expect(page.getByRole('heading', { level: 1, name: 'Ben Hutchinson' })).toHaveCount(1);
    await expect(page.locator('[data-desktop-shortcut-app-id]:visible')).toHaveCount(0);
    await expect(page.locator('[data-window-id="about"]')).not.toHaveAttribute('data-drag-enabled');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await page.getByRole('button', { name: 'Work' }).click();
    await expect(page.locator('[data-window-id="work"]')).toBeVisible();
    await expect(page.getByText(exactClaim, { exact: true })).toBeVisible();
  });
});
