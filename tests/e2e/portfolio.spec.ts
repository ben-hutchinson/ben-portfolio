import { expect, test } from '@playwright/test';

const primaryAnchors = [
  { label: 'Mission logs', hash: '#work', sectionHeading: 'PROOF, NOT JUST A STACK LIST.' },
  { label: 'Systems', hash: '#systems', sectionHeading: 'Connected by operating context.' },
  { label: 'Experience', hash: '#experience', sectionHeading: 'Experience with operating context.' },
  { label: 'Crew', hash: '#crew', sectionHeading: 'Meet the operators' },
  { label: 'Training sim', hash: '#training', sectionHeading: 'Put the command reflexes to work.' },
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

for (const { label, hash, sectionHeading } of primaryAnchors) {
  test(`catches a broken primary ${label} anchor that no longer reaches its section`, async ({ page }) => {
    await page.goto('/');

    const navigation = page.getByRole('navigation', { name: 'Primary' });
    await navigation.getByRole('link', { name: label, exact: true }).click();

    const heading = page.getByRole('heading', { name: sectionHeading, exact: true });
    await expect(page).toHaveURL(new RegExp(`${hash}$`));
    await expect(heading).toBeInViewport();
  });
}

test('downloads the CV from the footer action', async ({ page }) => {
  await page.goto('/');

  const cvLink = page.getByRole('link', { name: 'Download CV' });
  await expect(cvLink).toHaveAttribute('download', 'ben-hutchinson-cv.pdf');

  const downloadPromise = page.waitForEvent('download', { timeout: 5_000 });
  await cvLink.click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('ben-hutchinson-cv.pdf');
});
