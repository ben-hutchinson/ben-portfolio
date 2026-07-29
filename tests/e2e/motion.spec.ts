import { expect, test, type Locator } from '@playwright/test';

interface RunnerMotionSnapshot {
  obstacleTransforms: string[];
  score: string;
}

const readRunnerMotion = async (playfield: Locator): Promise<RunnerMotionSnapshot> =>
  playfield.evaluate((element) => {
    const score = element.querySelector('[aria-live="polite"] span')?.textContent ?? '';
    const obstacleTransforms = Array.from(
      element.querySelectorAll<HTMLElement>('[aria-hidden="true"][style*="transform"]'),
    )
      .filter((candidate) => !candidate.querySelector('img'))
      .map((candidate) => candidate.style.transform);

    return { obstacleTransforms, score };
  });

test.describe('reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('keeps Signal Sprint stationary until input in reduced motion', async ({ page }) => {
    await page.goto('/');
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(
      true,
    );
    await expect(page.locator('[data-reduced-motion="true"]')).toBeVisible();
    await page.getByRole('button', { name: 'Launch Signal Sprint' }).click();

    const dialog = page.getByRole('dialog', { name: 'Signal Sprint training simulation' });
    const playfield = dialog.getByRole('application', {
      name: 'Side scrolling jump mission. Press Space, W, Arrow Up, or tap to jump.',
    });
    await expect(playfield).toBeVisible();

    const before = await readRunnerMotion(playfield);
    await page.waitForTimeout(1_000);
    const withoutInput = await readRunnerMotion(playfield);

    expect(withoutInput).toEqual(before);

    await page.keyboard.press('Space');
    const afterInput = await readRunnerMotion(playfield);

    expect(afterInput).not.toEqual(withoutInput);
  });
});
