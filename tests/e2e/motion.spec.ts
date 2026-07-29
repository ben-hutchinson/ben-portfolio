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

    await playfield.focus();
    await page.keyboard.press('Space');
    await expect
      .poll(async () => (await readRunnerMotion(playfield)).score)
      .toBe('Score 3');
    await expect(playfield).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect
      .poll(async () => (await readRunnerMotion(playfield)).score)
      .toBe('Score 6');

    await page.keyboard.press('w');
    await expect
      .poll(async () => (await readRunnerMotion(playfield)).score)
      .toBe('Score 9');
  });

  test('ignores reduced-motion jump keys from unrelated controls', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Launch Signal Sprint' }).click();

    const dialog = page.getByRole('dialog', { name: 'Signal Sprint training simulation' });
    const playfield = dialog.getByRole('application', {
      name: 'Side scrolling jump mission. Press Space, W, Arrow Up, or tap to jump.',
    });
    await expect(playfield).toBeVisible();

    const stationary = await readRunnerMotion(playfield);
    const audio = dialog.getByRole('button', { name: 'Enable training audio' });
    await audio.focus();
    await page.keyboard.press('Space');
    await expect(dialog.getByRole('button', { name: 'Mute training audio' })).toBeFocused();
    expect(await readRunnerMotion(playfield)).toEqual(stationary);

    const back = dialog.getByRole('button', { name: 'Back to Portfolio' });
    await back.focus();
    await page.keyboard.down('Space');
    expect(await readRunnerMotion(playfield)).toEqual(stationary);
    await page.keyboard.up('Space');
    await expect(dialog).toBeHidden();

    await page.getByRole('button', { name: 'Launch Signal Sprint' }).click();
    await expect(playfield).toBeVisible();
    const resetStationary = await readRunnerMotion(playfield);
    const close = dialog.getByRole('button', { name: 'Close' });
    await close.focus();
    await page.keyboard.down('Space');
    expect(await readRunnerMotion(playfield)).toEqual(resetStationary);
    await page.keyboard.up('Space');
    await expect(dialog).toBeHidden();
  });
});
