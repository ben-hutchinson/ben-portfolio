import { expect, type Page } from '@playwright/test';

export async function expectLoadedInterDisplayFace(page: Page): Promise<void> {
  const evidence = await page.evaluate(() => {
    const displayElement = [...document.querySelectorAll<HTMLElement>('body *')].find((element) => {
      const family = getComputedStyle(element).fontFamily.split(',')[0]?.replace(/["']/g, '').trim();
      return family === 'Inter' && element.getClientRects().length > 0;
    });
    const faces = [...document.fonts]
      .filter((face) => face.family.replace(/["']/g, '') === 'Inter')
      .map((face) => ({
        family: face.family.replace(/["']/g, ''),
        status: face.status,
        style: face.style,
        weight: face.weight,
      }));
    const fontResourcePaths = performance.getEntriesByType('resource')
      .map((entry) => new URL(entry.name).pathname)
      .filter((pathname) => pathname.endsWith('.woff2'));

    return {
      computedFamily: displayElement ? getComputedStyle(displayElement).fontFamily : null,
      faces,
      fontResourcePaths,
    };
  });

  expect(evidence.computedFamily?.split(',')[0]?.replace(/["']/g, '').trim()).toBe('Inter');
  expect(evidence.faces).toEqual([{
    family: 'Inter',
    status: 'loaded',
    style: 'normal',
    weight: '100 900',
  }]);
  expect(evidence.fontResourcePaths).toContain('/ben-portfolio/fonts/InterVariable.woff2');
}
