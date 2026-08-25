import { expect, test, type Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import { expectLoadedInterDisplayFace } from './helpers/displayFont';

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
  test('publishes and loads the pinned Inter face below both static and relative preview paths', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Production font contract runs in Chromium.');
    const fontResponse = await page.request.get(`${previewBasePath}fonts/InterVariable.woff2`);
    const licenseResponse = await page.request.get(`${previewBasePath}fonts/OFL-1.1.txt`);

    expect(fontResponse.status()).toBe(200);
    expect(fontResponse.headers()['content-type']).toMatch(/(?:font\/woff2|application\/(?:font-woff|octet-stream))/i);
    expect(createHash('sha256').update(await fontResponse.body()).digest('hex'))
      .toBe('693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3');
    expect(licenseResponse.status()).toBe(200);
    expect(createHash('sha256').update(await licenseResponse.body()).digest('hex'))
      .toBe('262481e844521b326f5ecd053e59b98c8b2da78c8ee1bdbb6e8174305e54935a');

    for (const route of [`${previewBasePath}#desktop`, './#career']) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.fonts.check('900 16px Inter'))).toBe(true);
      await expectLoadedInterDisplayFace(page);
    }
  });

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
