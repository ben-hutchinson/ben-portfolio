import { expect, test } from '@playwright/test';

const workFrame = '[data-window-id="work"]';

test.describe('Work.app', () => {
  test('opens directly with a keyboard-readable case outline and CV exit', async ({ page }) => {
    await page.goto('./#work');
    await expect(page).toHaveURL(/#work$/);
    const frame = page.locator(workFrame);
    await expect(frame.getByRole('heading', { level: 1, name: 'Python Dependency Migration' })).toBeVisible();
    const headings = await frame.getByRole('heading', { level: 2 }).allTextContents();
    expect(headings.slice(1, 6)).toEqual(['Problem', 'Ownership', 'Approach', 'Rollout', 'Outcome']);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Download CV' })).toHaveAttribute('download', 'ben-hutchinson-cv.pdf');
    if (test.info().project.name === 'Chromium') {
      await page.screenshot({ path: '/private/tmp/portfolio-os-task8-desktop.png', fullPage: true });
    }
  });

  test('keeps the complete case readable without horizontal overflow on narrow screens', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#work');
    await expect(page.getByText('The work is internal, so no public repository or implementation detail is published.')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole('link', { name: 'Download CV' }).scrollIntoViewIfNeeded();
    await expect(page.getByRole('link', { name: 'Download CV' })).toBeVisible();
    if (test.info().project.name === 'mobile-Chrome') {
      await page.screenshot({ path: '/private/tmp/portfolio-os-task8-mobile.png', fullPage: true });
    }
  });
});
