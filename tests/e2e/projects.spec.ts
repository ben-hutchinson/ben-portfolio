import { expect, test } from '@playwright/test';

const frame = '[data-window-id="projects"]';

type FeaturedProjectMeasurement = {
  readonly row: DOMRect;
  readonly copy: DOMRect;
  readonly media: DOMRect;
  readonly mediaContentHeight: number;
  readonly image: DOMRect;
  readonly imageNaturalWidth: number;
  readonly imageNaturalHeight: number;
};

type FeaturedProjectScenario = {
  readonly name: string;
  readonly viewport: { readonly width: number; readonly height: number };
  readonly zoom?: number;
};

const featuredProjectScenarios: readonly FeaturedProjectScenario[] = [
  { name: 'desktop', viewport: { width: 1440, height: 1000 } },
  { name: 'tablet', viewport: { width: 1024, height: 768 } },
  { name: 'mobile', viewport: { width: 390, height: 844 } },
  { name: 'narrow-mobile', viewport: { width: 320, height: 568 } },
  { name: '200-percent-zoom', viewport: { width: 390, height: 844 }, zoom: 2 },
];

function overlapArea(first: DOMRect, second: DOMRect): number {
  const width = Math.max(0, Math.min(first.right, second.right) - Math.max(first.left, second.left));
  const height = Math.max(0, Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top));

  return width * height;
}

function isContainedBy(child: DOMRect, parent: DOMRect): boolean {
  return child.left >= parent.left
    && child.top >= parent.top
    && child.right <= parent.right
    && child.bottom <= parent.bottom;
}

test.describe('Projects application', () => {
  test('selects canonical IDs, supports direct hashes and browser history, and keeps external actions safe', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Desktop Projects journey runs in Chromium.');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('./#projects');
    const projects = page.locator(frame);
    await expect(projects.getByRole('heading', { level: 1, name: 'Engineering projects' })).toBeVisible();
    await expect(projects.getByTestId('project-entry-pokeleximon')).toHaveAttribute('data-featured', 'true');
    await page.screenshot({ path: '/private/tmp/portfolio-os-task9-desktop.png', fullPage: true });

    await projects.getByRole('button', { name: 'Open Pokeleximon Daily case study' }).click();
    await expect(page).toHaveURL(/#projects\/pokeleximon$/);
    await expect(projects.getByRole('heading', { level: 1, name: 'Pokeleximon Daily' })).toBeVisible();
    const links = projects.locator('footer[aria-label="Pokeleximon Daily links"]');
    const overview = links.getByRole('link', { name: 'Overview' });
    await expect(overview).toHaveCount(1);
    await expect(overview).toHaveAttribute('href', 'https://github.com/ben-hutchinson/pokeleximon');
    await expect(overview).toHaveAttribute('target', '_blank');
    await expect(overview).toHaveAttribute('rel', 'noreferrer noopener');
    await expect(links.getByRole('link', { name: 'Live' })).toHaveCount(0);
    expect(await links.locator('a').evaluateAll((anchors) => new Set(anchors.map((anchor) => (anchor as HTMLAnchorElement).href)).size)).toBe(1);
    await page.screenshot({ path: '/private/tmp/portfolio-os-task9-pokeleximon.png', fullPage: true });

    await page.goto('./#projects/safelog');
    await expect(projects.getByRole('heading', { level: 1, name: 'Safelog' })).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/#projects\/pokeleximon$/);
    await page.goBack();
    await expect(page).toHaveURL(/#projects$/);
    await page.goForward();
    await expect(page).toHaveURL(/#projects\/pokeleximon$/);
    await projects.getByRole('button', { name: 'Back to projects' }).click();
    await expect(page).toHaveURL(/#projects$/);
  });

  test('retains case content when project media fails', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Broken media journey runs in Chromium.');
    await page.route('**/assets/ui/project-safelog.webp', (route) => route.abort());
    await page.goto('./#projects/safelog');
    await expect(page.getByRole('img', { name: 'Safelog project preview unavailable' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Safelog' })).toBeVisible();
    await expect(page.locator(frame).getByRole('link', { name: 'GitHub' })).toBeVisible();
  });

  test('switches projects on mobile without horizontal overflow', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-Chrome', 'Mobile Projects journey runs in mobile Chromium.');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#projects');
    await page.getByRole('button', { name: 'Open Safelog case study' }).click();
    await expect(page).toHaveURL(/#projects\/safelog$/);
    await page.getByRole('button', { name: 'Back to projects' }).click();
    await page.getByRole('button', { name: 'Open Pokeleximon Daily case study' }).click();
    await expect(page).toHaveURL(/#projects\/pokeleximon$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: '/private/tmp/portfolio-os-task9-mobile.png', fullPage: true });
  });

  test('keeps featured Pokeleximon copy and complete media within their row at every required size', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Featured project geometry runs in Chromium.');

    for (const scenario of featuredProjectScenarios) {
      await page.setViewportSize(scenario.viewport);
      await page.goto('./#projects');
      if (scenario.zoom !== undefined) await page.locator('body').evaluate((body, zoom) => { body.style.zoom = String(zoom); }, scenario.zoom);

      const featured = page.getByTestId('project-entry-pokeleximon');
      const title = featured.getByRole('heading', { level: 2, name: 'Pokeleximon Daily' });
      const copy = title.locator('..');
      const media = featured.getByTestId('project-media-pokeleximon');
      const image = media.getByRole('img', { name: 'Pokeleximon Daily project interface' });

      await expect(title).toBeVisible();
      await expect(media).toBeVisible();
      await expect.poll(async () => image.evaluate((element) => {
        const imageElement = element as HTMLImageElement;
        return imageElement.complete && imageElement.naturalWidth > 0 && imageElement.naturalHeight > 0;
      })).toBe(true);

      const measurement = await featured.evaluate((row, selectors): FeaturedProjectMeasurement => {
        const copyHeading = row.querySelector<HTMLElement>(selectors.copyHeading);
        const mediaElement = row.querySelector<HTMLElement>(selectors.media);
        const imageElement = row.querySelector<HTMLImageElement>(selectors.image);
        const copyElement = copyHeading?.parentElement;
        if (!copyElement || !mediaElement || !imageElement) throw new Error('Pokeleximon layout targets are missing.');

        return {
          row: row.getBoundingClientRect(),
          copy: copyElement.getBoundingClientRect(),
          media: mediaElement.getBoundingClientRect(),
          mediaContentHeight: mediaElement.clientHeight,
          image: imageElement.getBoundingClientRect(),
          imageNaturalWidth: imageElement.naturalWidth,
          imageNaturalHeight: imageElement.naturalHeight,
        };
      }, {
        copyHeading: 'h2',
        media: '[data-testid="project-media-pokeleximon"]',
        image: 'img',
      });

      expect(overlapArea(measurement.copy, measurement.media), `${scenario.name}: copy and media overlap`).toBe(0);
      expect(isContainedBy(measurement.copy, measurement.row), `${scenario.name}: copy escapes featured row`).toBe(true);
      expect(isContainedBy(measurement.media, measurement.row), `${scenario.name}: media escapes featured row`).toBe(true);
      expect(measurement.image.height, `${scenario.name}: image has positive height`).toBeGreaterThan(0);
      await page.screenshot({ path: `/private/tmp/portfolio-os-port-017-${scenario.name}.png`, fullPage: true });
      expect(Math.abs(measurement.mediaContentHeight - measurement.image.height), `${scenario.name}: media has empty Ink below image`).toBeLessThanOrEqual(2);
      expect(
        Math.abs((measurement.image.width / measurement.image.height) / (measurement.imageNaturalWidth / measurement.imageNaturalHeight) - 1),
        `${scenario.name}: image differs from its intrinsic aspect ratio`,
      ).toBeLessThanOrEqual(0.02);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${scenario.name}: horizontal overflow`).toBe(true);

      expect(await copy.evaluate((copyElement) => (
        copyElement.nextElementSibling?.getAttribute('data-testid') === 'project-media-pokeleximon'
      )), `${scenario.name}: copy precedes media in document order`).toBe(true);
    }
  });
});
