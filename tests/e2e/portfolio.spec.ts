import { expect, test } from '@playwright/test';

const primaryAnchors = [
  { label: 'Mission logs', sectionHeading: 'PROOF, NOT JUST A STACK LIST.' },
  { label: 'Systems', sectionHeading: 'Connected by operating context.' },
  { label: 'Experience', sectionHeading: 'Experience with operating context.' },
  { label: 'Crew', sectionHeading: 'Meet the operators' },
  { label: 'Training sim', sectionHeading: 'Put the command reflexes to work.' },
] as const;

test('catches a missing recruiter path from the hero to the Pokeleximon engineering briefing', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: /engineer the calm/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Pokeleximon Daily' })).toBeVisible();
  await page.getByRole('button', { name: 'Open Pokeleximon Daily engineering briefing' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Pokeleximon Daily engineering briefing' }),
  ).toBeVisible();
});

for (const { label, sectionHeading } of primaryAnchors) {
  test(`catches a broken primary ${label} anchor that no longer reaches its section`, async ({ page }) => {
    await page.goto('/');

    const navigation = page.getByRole('navigation', { name: 'Primary' });
    await navigation.getByRole('link', { name: label, exact: true }).click();

    await expect(page.getByRole('heading', { name: sectionHeading, exact: true })).toBeVisible();
  });
}
