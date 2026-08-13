import { expect, test, type Page } from '@playwright/test';

const previewBasePath = '/ben-portfolio/';
const supportedRoutes = [
  { hash: '#desktop', windowId: 'about' },
  { hash: '#career', windowId: 'career' },
  { hash: '#projects/pokeleximon', windowId: 'projects' },
  { hash: '#projects/safelog', windowId: 'projects' },
] as const;

function recordPreviewFailures(page: Page) {
  const consoleAndPageFailures: string[] = [];
  const failedRequests: { errorText: string; url: string }[] = [];
  const errorResponses: { status: number; url: string }[] = [];
  const requestUrls = new Set<string>();

  page.on('console', (message) => {
    if (message.type() === 'error') consoleAndPageFailures.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => consoleAndPageFailures.push(`pageerror: ${error.message}`));
  page.on('request', (request) => {
    requestUrls.add(request.url());
  });
  page.on('requestfailed', (request) => {
    failedRequests.push({
      errorText: request.failure()?.errorText ?? 'unknown request failure',
      url: request.url(),
    });
  });
  page.on('response', (response) => {
    if (response.status() >= 400) errorResponses.push({ status: response.status(), url: response.url() });
  });
  return () => {
    const previewOrigin = new URL(page.url()).origin;
    const isSameOrigin = (url: string) => new URL(url).origin === previewOrigin;
    const localResourcePaths = [...requestUrls]
      .filter(isSameOrigin)
      .map((url) => new URL(url).pathname);
    return {
      failures: [
        ...consoleAndPageFailures,
        ...failedRequests
          .filter(({ errorText, url }) => isSameOrigin(url) && errorText !== 'net::ERR_ABORTED')
          .map(({ errorText, url }) => `request failed (${errorText}): ${url}`),
        ...errorResponses
          .filter(({ url }) => isSameOrigin(url))
          .map(({ status, url }) => `HTTP ${status}: ${url}`),
      ],
      localResourcePaths,
    };
  };
}

test.describe('PORT-012 GitHub Pages preview', () => {
  test('serves supported hashes below the repository base path without local failures or runtime API requests', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Production-preview contract runs in Chromium.');
    await page.setViewportSize({ width: 1440, height: 1000 });
    const inspectPreview = recordPreviewFailures(page);
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

    const { failures, localResourcePaths } = inspectPreview();
    expect(runtimeRequests).toEqual([]);
    expect([...localResourcePaths]).not.toEqual([]);
    expect([...localResourcePaths]).toEqual(expect.arrayContaining([
      expect.stringMatching(/^\/ben-portfolio\//),
    ]));
    expect([...localResourcePaths].every((path) => path.startsWith(previewBasePath))).toBe(true);
    expect(failures).toEqual([]);
  });

  test('restores project routes through browser back and forward beneath the repository base path', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Production-preview history runs in Chromium.');
    const inspectPreview = recordPreviewFailures(page);

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

    expect(inspectPreview().failures).toEqual([]);
  });
});
