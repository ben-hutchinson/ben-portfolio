import { expect, test, type Page } from '@playwright/test';

const previewBasePath = '/ben-portfolio/';
const supportedRoutes = [
  { hash: '#desktop', windowId: 'about' },
  { hash: '#career', windowId: 'career' },
  { hash: '#projects/pokeleximon', windowId: 'projects' },
  { hash: '#projects/safelog', windowId: 'projects' },
] as const;

function recordPreviewFailures(page: Page): string[] {
  const failures: string[] = [];
  const isPreviewResource = (url: string) => {
    const parsed = new URL(url);
    return parsed.origin === 'http://127.0.0.1:4173' && parsed.pathname.startsWith(previewBasePath);
  };

  page.on('console', (message) => {
    if (message.type() === 'error') failures.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`));
  page.on('requestfailed', (request) => {
    if (isPreviewResource(request.url())) failures.push(`request failed: ${request.url()}`);
  });
  page.on('response', (response) => {
    if (isPreviewResource(response.url()) && response.status() >= 400) {
      failures.push(`HTTP ${response.status()}: ${response.url()}`);
    }
  });
  return failures;
}

test.describe('PORT-012 GitHub Pages preview', () => {
  test('serves supported hashes below the repository base path without local failures or runtime API requests', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Production-preview contract runs in Chromium.');
    await page.setViewportSize({ width: 1440, height: 1000 });
    const failures = recordPreviewFailures(page);
    const runtimeRequests: string[] = [];
    page.on('request', (request) => {
      if (['fetch', 'xhr'].includes(request.resourceType())) runtimeRequests.push(request.url());
    });

    for (const route of supportedRoutes) {
      await page.goto(`${previewBasePath}${route.hash}`);
      await expect(page).toHaveURL(new RegExp(`/ben-portfolio/${route.hash}$`));
      await expect(page.locator(`[data-window-id="${route.windowId}"]`)).toBeVisible();
      await page.reload();
      await expect(page).toHaveURL(new RegExp(`/ben-portfolio/${route.hash}$`));
      await expect(page.locator(`[data-window-id="${route.windowId}"]`)).toBeVisible();
    }

    expect(runtimeRequests).toEqual([]);
    expect(failures).toEqual([]);
  });

  test('restores project routes through browser back and forward beneath the repository base path', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Production-preview history runs in Chromium.');
    const failures = recordPreviewFailures(page);

    await page.goto(`${previewBasePath}#projects/pokeleximon`);
    await expect(page.getByRole('heading', { level: 1, name: 'Pokeleximon Daily' })).toBeVisible();
    await page.goto(`${previewBasePath}#projects/safelog`);
    await expect(page.getByRole('heading', { level: 1, name: 'Safelog' })).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/\/ben-portfolio\/#projects\/pokeleximon$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Pokeleximon Daily' })).toBeVisible();
    await page.goForward();
    await expect(page).toHaveURL(/\/ben-portfolio\/#projects\/safelog$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Safelog' })).toBeVisible();

    expect(failures).toEqual([]);
  });
});
