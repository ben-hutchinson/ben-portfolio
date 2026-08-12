import { expect, test } from '@playwright/test';

const frame = '[data-window-id="projects"]';

test.describe('Projects application', () => {
  test('selects canonical IDs, supports direct hashes and browser history, and keeps external actions safe', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Desktop Projects journey runs in Chromium.');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('./#projects');
    const projects = page.locator(frame);
    await expect(projects.getByRole('heading', { level: 1, name: 'Engineering projects' })).toBeVisible();
    await expect(projects.getByTestId('project-entry-pokeleximon')).toHaveAttribute('data-featured', 'true');
    await page.screenshot({ path: '/private/tmp/portfolio-os-task9-desktop.png', fullPage: true });

    await projects.getByRole('button', { name: 'Open Pokeleximon Daily case study' }).click();
    await expect(page).toHaveURL(/#projects\/pokeleximon$/);
    await expect(projects.getByRole('heading', { level: 1, name: 'Pokeleximon Daily' })).toBeVisible();
    const live = projects.getByRole('link', { name: 'Live' });
    await expect(live).toHaveAttribute('href', 'https://pokeleximon.com/daily');
    await expect(live).toHaveAttribute('target', '_blank');
    await expect(live).toHaveAttribute('rel', 'noreferrer noopener');
    await page.screenshot({ path: '/private/tmp/portfolio-os-task9-pokeleximon.png', fullPage: true });

    await page.goto('./#projects/safelog');
    await expect(projects.getByRole('heading', { level: 1, name: 'Safelog' })).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/#projects\/pokeleximon$/);
    await page.goBack();
    await expect(page).toHaveURL(/#projects$/);
    await page.goForward();
    await expect(page).toHaveURL(/#projects\/pokeleximon$/);
    await projects.getByRole('button', { name: 'Back to projects' }).click();
    await expect(page).toHaveURL(/#projects$/);
  });

  test('retains case content when project media fails', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Broken media journey runs in Chromium.');
    await page.route('**/assets/ui/project-safelog.webp', (route) => route.abort());
    await page.goto('./#projects/safelog');
    await expect(page.getByRole('img', { name: 'Safelog project preview unavailable' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Safelog' })).toBeVisible();
    await expect(page.locator(frame).getByRole('link', { name: 'GitHub' })).toBeVisible();
  });

  test('switches projects on mobile without horizontal overflow', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-Chrome', 'Mobile Projects journey runs in mobile Chromium.');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#projects');
    await page.getByRole('button', { name: 'Open Safelog case study' }).click();
    await expect(page).toHaveURL(/#projects\/safelog$/);
    await page.getByRole('button', { name: 'Back to projects' }).click();
    await page.getByRole('button', { name: 'Open Pokeleximon Daily case study' }).click();
    await expect(page).toHaveURL(/#projects\/pokeleximon$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: '/private/tmp/portfolio-os-task9-mobile.png', fullPage: true });
  });
});
