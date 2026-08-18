import { expect, test } from '@playwright/test';

const workFrame = '[data-window-id="work"]';

test.describe('Work.app', () => {
  test('opens directly with a keyboard-readable case outline and CV exit', async ({ page }) => {
    await page.goto('./#work');
    await expect(page).toHaveURL(/#work$/);
    const frame = page.locator(workFrame);
    await expect(frame.getByRole('heading', { level: 1, name: 'Python Dependency Migration' })).toBeVisible();
    await expect(frame.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(frame.locator('[data-window-title]')).toHaveText('Work');
    const headings = await frame.locator('h1, h2, h3, h4, h5, h6').evaluateAll((elements) => elements.map((element) => ({
      level: Number(element.tagName.slice(1)),
      text: element.textContent?.trim(),
    })));
    expect(headings).toEqual([
      { level: 1, text: 'Python Dependency Migration' },
      { level: 2, text: 'Problem' },
      { level: 2, text: 'Ownership' },
      { level: 2, text: 'Approach' },
      { level: 2, text: 'Rollout' },
      { level: 2, text: 'Outcome' },
      { level: 2, text: 'Public detail' },
    ]);
    await expect(frame.getByText(
      'Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes',
      { exact: true },
    )).toBeVisible();
    await expect(frame.getByText('I proposed the uv/ruff migration.', { exact: true })).toBeVisible();
    await expect(frame.getByText(
      'I designed the base-Makefile implementation and rollout.',
      { exact: true },
    )).toBeVisible();
    await expect(frame.getByRole('list', { name: /technologies/i })).toHaveCount(0);
    await expect(frame.getByText('Python', { exact: true })).toHaveCount(0);
    await expect(frame.getByText('uv', { exact: true })).toHaveCount(0);
    await expect(frame.getByText('ruff', { exact: true })).toHaveCount(0);
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
