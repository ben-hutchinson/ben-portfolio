import { expect, test } from '@playwright/test';

test.describe('Contact and optional Micro terminal paths', () => {
  test('loads Contact directly with all semantic actions and no external navigation', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Desktop contact journey runs in Chromium.');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('./#contact');
    const contact = page.locator('[data-window-id="contact"]');
    await expect(contact.getByRole('heading', { level: 1, name: 'Contact Ben' })).toBeVisible();
    await expect(contact.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:benhutchinson0412@gmail.com');
    await expect(contact.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('target', '_blank');
    await expect(contact.getByRole('link', { name: 'GitHub' })).toHaveAttribute('rel', 'noreferrer noopener');
    await expect(contact.getByRole('link', { name: 'Download CV' })).toHaveAttribute('download', 'ben-hutchinson-cv.pdf');
    await page.screenshot({ path: testInfo.outputPath('portfolio-os-task10-contact-desktop.png'), fullPage: true });
  });

  test('keeps one bounded Micro terminal optional, inert, and connected to shared navigation', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Desktop Micro terminal journey runs in Chromium.');
    await page.goto('./#desktop');
    const terminal = page.getByTestId('micro-terminal');
    const input = terminal.getByRole('textbox', { name: 'Portfolio command' });
    const status = terminal.getByRole('status');

    await expect(terminal).toHaveAttribute('data-micro-terminal');
    await expect(terminal).toContainText('portfolio command');
    await expect(input).toBeVisible();
    await expect(page.getByRole('button', { name: 'Command', exact: true })).toHaveCount(0);
    await expect(page.locator('[data-window-id="command"]')).toHaveCount(0);

    await input.fill('carear');
    await input.press('Enter');
    await expect(status).toContainText('Did you mean “career”?');

    let unexpectedDialog: string | null = null;
    page.on('dialog', async (dialog) => {
      unexpectedDialog = dialog.message();
      await dialog.dismiss();
    });
    await input.fill('<script>alert(1)</script>');
    await input.press('Enter');
    await expect(status).toContainText('<script>alert(1)</script>');
    expect(unexpectedDialog).toBeNull();

    await input.fill('clear');
    await input.press('Enter');
    await expect(status).toHaveCount(0);

    await input.fill('cv');
    await input.press('Enter');
    await expect(status.getByRole('link', { name: 'Download CV' })).toHaveAttribute('download', 'ben-hutchinson-cv.pdf');

    await page.locator('[data-window-control="reset-layout"]').click();
    await expect(terminal).toBeVisible();

    await input.fill('career');
    await input.press('Enter');
    await expect(page).toHaveURL(/#career$/);
    await expect(terminal).toHaveCount(0);
  });

  test('keeps recruiter-critical destinations reachable through visible navigation without commands', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Visible navigation journey runs in Chromium.');

    for (const [label, hash] of [
      ['Work', '#work'],
      ['Career', '#career'],
      ['Projects', '#projects'],
      ['Contact', '#contact'],
    ] as const) {
      await page.goto('./#desktop');
      await page.getByRole('button', { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${hash}$`));
    }
  });

  test('keeps Contact usable without exposing a Micro terminal outside Desktop on mobile', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Mobile-sized journey runs in Chromium.');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#contact');
    await expect(page.getByRole('heading', { level: 1, name: 'Contact Ben' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.getByTestId('micro-terminal')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
