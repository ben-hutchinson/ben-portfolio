import { expect, test } from '@playwright/test';

const workFrame = '[data-window-id="work"]';

test.describe('Work.app', () => {
  test('preserves a direct Work detail through maximize and restore', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Focused Work acceptance runs in Chromium.');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('./#work/uv-ruff-migration');
    await page.getByRole('button', { name: 'Maximize Work' }).click();
    await expect(page).toHaveURL(/#work\/uv-ruff-migration$/);
    await expect(page.getByRole('button', { name: 'Back to work' })).toBeVisible();
    await page.getByRole('button', { name: 'Restore Work' }).click();
    await expect(page).toHaveURL(/#work\/uv-ruff-migration$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Python Dependency Migration' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Back to work' })).toBeVisible();
  });

  test('supports direct catalogue/detail loading, reload, click, keyboard and browser history at desktop and mobile widths', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Focused Work acceptance runs in Chromium.');
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await page.goto('./#work/uv-ruff-migration');
      await expect(page).toHaveURL(/#work\/uv-ruff-migration$/);
      await expect(page.getByRole('heading', { level: 1, name: 'Python Dependency Migration' })).toBeVisible();
      await page.reload();
      await expect(page).toHaveURL(/#work\/uv-ruff-migration$/);
      await page.goto('./#work');
      await expect(page).toHaveURL(/#work$/);
      const catalogue = page.locator(workFrame);
      await expect(catalogue.getByText(/featured case study/i)).toBeVisible();
      const open = catalogue.getByRole('button', { name: 'Open Python Dependency Migration case study' });
      await open.focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/#work\/uv-ruff-migration$/);
      await page.reload();
      await expect(page.getByRole('heading', { level: 1, name: 'Python Dependency Migration' })).toBeVisible();
      await page.getByRole('button', { name: 'Back to work' }).click();
      await expect(page).toHaveURL(/#work$/);
      await page.goBack();
      await expect(page).toHaveURL(/#work\/uv-ruff-migration$/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      if (viewport.width === 390) {
        await page.getByRole('button', { name: 'Career' }).click();
        await expect(page).toHaveURL(/#career$/);
        expect(await page.locator('[data-window-id]').evaluateAll((frames) => frames
          .filter((frame) => getComputedStyle(frame).display !== 'none')
          .map((frame) => frame.getAttribute('data-window-id')))).toEqual(['career']);
      }
    }
  });

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
