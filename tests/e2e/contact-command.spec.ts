import { expect, test } from '@playwright/test';

test.describe('Contact and optional command paths', () => {
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
    await page.screenshot({ path: '/private/tmp/portfolio-os-task10-contact-desktop.png', fullPage: true });
  });

  test('keeps command optional, discoverable, inert, and connected to shared navigation', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Desktop command journey runs in Chromium.');
    await page.goto('./#desktop');
    await page.getByRole('button', { name: 'Command', exact: true }).click();
    const command = page.locator('[data-window-id="command"]');
    const input = command.getByRole('textbox', { name: 'Portfolio command' });
    await expect(command.getByRole('button', { name: 'career' })).toBeVisible();
    await input.fill('contact');
    await input.press('Enter');
    await expect(page).toHaveURL(/#contact$/);
    await page.getByRole('button', { name: 'Command', exact: true }).click();
    await input.fill('project pokeleximon');
    await input.press('Enter');
    await expect(page).toHaveURL(/#projects\/pokeleximon$/);
    await page.getByRole('button', { name: 'Command', exact: true }).click();
    await input.fill('carear');
    await input.press('Enter');
    await expect(command.getByRole('log')).toContainText('Did you mean “career”?');
    await input.fill('<script>alert(1)</script>');
    await input.press('Enter');
    await expect(command.getByRole('log')).toContainText('<script>alert(1)</script>');
    await expect(page.locator('script')).toHaveCount(1);
    await page.screenshot({ path: '/private/tmp/portfolio-os-task10-command-desktop.png', fullPage: true });

    await page.getByRole('link', { name: 'Career' }).click();
    await expect(page).toHaveURL(/#career$/);
    await page.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/#projects$/);
    await page.getByRole('button', { name: 'Contact', exact: true }).click();
    await expect(page).toHaveURL(/#contact$/);
  });

  test('keeps Contact and Command usable in normal mobile flow without overflow', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-Chrome', 'Mobile journey runs in mobile Chromium.');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#contact');
    await expect(page.getByRole('heading', { level: 1, name: 'Contact Ben' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'Command', exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Portfolio command' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: '/private/tmp/portfolio-os-task10-mobile.png', fullPage: true });
  });
});
