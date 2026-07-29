import { expect, test } from '@playwright/test';

const viewports = [320, 390, 768, 1024, 1440] as const;

for (const width of viewports) {
  test(`catches horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('catches a mobile Mission logs link that does not close the navigation sheet or reach the work section', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.getByRole('button', { name: 'Open navigation' }).click();
  const sheet = page.getByRole('dialog', { name: 'Command index' });
  await expect(sheet).toBeVisible();

  await sheet.getByRole('link', { name: 'Mission logs', exact: true }).click();

  await expect(sheet).toBeHidden();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.getByRole('heading', { name: 'PROOF, NOT JUST A STACK LIST.', exact: true })).toBeVisible();
});
