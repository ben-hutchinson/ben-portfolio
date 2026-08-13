import { expect, test, type Page } from '@playwright/test';
import axe from 'axe-core';

async function seriousCriticalAndContrastViolations(page: Page) {
  await page.addScriptTag({ content: axe.source });
  return page.evaluate(async () => {
    const axeRunner = (window as unknown as {
      axe: { run: () => Promise<{ violations: readonly { id: string; impact: string | null }[] }> };
    }).axe;
    const results = await axeRunner.run();
    return results.violations.filter(({ id, impact }) => (
      id === 'color-contrast' || impact === 'serious' || impact === 'critical'
    ));
  });
}

test.describe('PORT-011 accessible shell', () => {
  test('keeps named landmarks, ordered headings, labelled Career controls, and visible keyboard focus @a11y', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Desktop accessibility coverage runs in Chromium.');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('./#career');

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();

    await expect(page.getByRole('banner')).toHaveCount(1);
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toHaveCount(0);
    await expect(page.getByRole('navigation', { name: 'Portfolio applications' })).toHaveCount(1);
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);

    const headingOrderIsValid = await page.evaluate(() => {
      const headings = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')]
        .filter((heading) => (heading as HTMLElement).offsetParent !== null)
        .map((heading) => Number(heading.tagName.slice(1)));
      return headings.length > 0 && headings[0] === 1 && headings.every((level, index) => (
        index === 0 || level <= headings[index - 1]! + 1
      ));
    });
    expect(headingOrderIsValid).toBe(true);

    const careerRange = page.getByRole('slider', { name: 'Career stage' });
    await expect(careerRange).toHaveAttribute('aria-valuetext', '2022 — Technology Graduate');
    await careerRange.focus();
    await page.keyboard.press('ArrowRight');
    await expect(careerRange).toHaveAttribute('aria-valuetext', '2024 — Degree Work: Observability Improvements');

    const focusIsVisible = await page.getByRole('button', { name: 'Now' }).evaluate((element) => {
      element.focus();
      const style = window.getComputedStyle(element);
      return style.outlineStyle !== 'none' && Number.parseFloat(style.outlineWidth) > 0;
    });
    expect(focusIsVisible).toBe(true);
  });

  test('has no serious, critical, or contrast axe violations on desktop and mobile @a11y', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Viewport accessibility coverage runs in Chromium.');
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await page.goto('./#desktop');
      expect(await seriousCriticalAndContrastViolations(page)).toEqual([]);
    }
  });

  test('recovers an invalid hash to Desktop and announces the non-blocking recovery', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Invalid-hash accessibility coverage runs in Chromium.');
    await page.goto('./#not-a-portfolio-route');

    await expect(page).toHaveURL(/#desktop$/);
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('status').first()).toContainText(/desktop/i);
  });
});
