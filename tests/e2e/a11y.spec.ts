import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const expectNoSeriousOrCriticalViolations = async (page: Page) => {
  const results = await new AxeBuilder({ page })
    // Base UI's inert, visually clipped focus guards are non-user controls and WebKit's Axe
    // adapter incorrectly reports them as unnamed buttons.
    .exclude('[data-base-ui-focus-guard]')
    .analyze();
  const seriousOrCritical = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  );

  expect(seriousOrCritical).toEqual([]);
};

test('catches serious or critical accessibility regressions on the main recruiter page', async ({ page }) => {
  await page.goto('/');

  await expectNoSeriousOrCriticalViolations(page);
});

test('catches serious or critical accessibility regressions in a project briefing sheet', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: /engineer the calm/i })).toBeVisible();
  await page.getByRole('button', { name: 'Open Pokeleximon Daily engineering briefing' }).click();
  await expect(page.getByRole('dialog', { name: 'Pokeleximon Daily engineering briefing' })).toBeVisible();

  await expectNoSeriousOrCriticalViolations(page);
});

test('catches serious or critical accessibility regressions in the Signal Sprint dialog', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Launch Signal Sprint' }).click();
  await expect(page.getByRole('dialog', { name: 'Signal Sprint training simulation' })).toBeVisible();

  await expectNoSeriousOrCriticalViolations(page);
});

test('catches topology focus buttons that no longer respond to keyboard activation', async ({ page }) => {
  await page.goto('/');

  const tooling = page.getByRole('button', { name: 'Developer tooling', exact: true });
  await tooling.focus();
  await tooling.press('Enter');

  await expect(tooling).toHaveAttribute('aria-pressed', 'true');
});

test('catches Escape closing a project briefing without restoring focus to its trigger', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: /engineer the calm/i })).toBeVisible();

  const trigger = page.getByRole('button', { name: 'Open Pokeleximon Daily engineering briefing' });
  await trigger.click();
  await expect(page.getByRole('dialog', { name: 'Pokeleximon Daily engineering briefing' })).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(page.getByRole('dialog', { name: 'Pokeleximon Daily engineering briefing' })).toBeHidden();
  await expect(trigger).toBeFocused();
});
