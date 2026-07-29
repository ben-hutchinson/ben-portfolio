import { expect, test } from '@playwright/test';

test('catches same-origin images, styles, and scripts that bypass the GitHub Pages base path', async ({ page }) => {
  await page.goto('/');

  const assetUrls = await page.evaluate(() => {
    const urls = [
      ...Array.from(document.images, (image) => image.currentSrc || image.src),
      ...Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel~="stylesheet"]'), (link) => link.href),
      ...Array.from(document.scripts, (script) => script.src),
    ];

    return urls.filter((url) => url && new URL(url, window.location.href).origin === window.location.origin);
  });

  expect(assetUrls.length).toBeGreaterThan(0);
  expect(assetUrls).toEqual(expect.arrayContaining([expect.stringContaining('/ben-portfolio/assets/')]));

  for (const assetUrl of assetUrls) {
    expect(new URL(assetUrl).pathname).toMatch(/^\/ben-portfolio\//);
  }
});
