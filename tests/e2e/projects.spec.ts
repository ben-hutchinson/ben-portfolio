import { expect, test } from '@playwright/test';

const frame = '[data-window-id="projects"]';

type FeaturedProjectMeasurement = {
  readonly row: DOMRect;
  readonly copy: DOMRect;
  readonly media: DOMRect;
  readonly mediaContentHeight: number;
  readonly image: DOMRect;
  readonly imageContentHeight: number;
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
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    test(`defers trailer transfer until explicit play and stops it on departure at ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'Chromium', 'Focused native trailer acceptance runs in Chromium.');
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const trailerRequests: string[] = [];
      page.on('request', (request) => {
        if (new URL(request.url()).pathname.endsWith('/assets/video/trivialise-trailer.mp4')) trailerRequests.push(request.url());
      });
      await page.goto('./#desktop');
      await expect(page.getByRole('button', { name: 'Projects', exact: true })).toBeVisible();
      expect(trailerRequests).toEqual([]);
      await page.getByRole('button', { name: 'Projects', exact: true }).click();
      await expect(page.locator(frame).getByRole('heading', { level: 1, name: 'Engineering projects' })).toBeVisible();
      expect(await page.locator(frame).locator('video').count()).toBe(0);
      expect(trailerRequests).toEqual([]);
      await page.getByRole('button', { name: 'Open TRIVIALISE! case study' }).click();
      const video = page.locator(frame).locator('video');
      await expect(video).toHaveCount(1);
      await expect(video).toHaveAccessibleName(/trivialise.*trailer/i);
      await expect(video).toHaveAttribute('preload', 'none');
      await expect(video).toHaveAttribute('poster', '/ben-portfolio/assets/ui/project-trivialise-trailer-poster.webp');
      await expect(video).toHaveJSProperty('paused', true);
      await expect(video).toHaveJSProperty('readyState', 0);
      expect(trailerRequests).toEqual([]);
      await video.scrollIntoViewIfNeeded();
      await page.screenshot({ path: testInfo.outputPath(`trailer-paused-${viewport.width}.png`) });
      expect(trailerRequests).toEqual([]);
      await expect(video).toHaveJSProperty('readyState', 0);
      const mediaResponse = page.waitForResponse((response) => new URL(response.url()).pathname.endsWith('/assets/video/trivialise-trailer.mp4'));
      await video.focus();
      await page.keyboard.press('Space');
      expect([200, 206]).toContain((await mediaResponse).status());
      await expect(video).toHaveJSProperty('paused', false);
      await expect.poll(async () => video.evaluate((element) => (element as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
      expect(trailerRequests.length).toBeGreaterThan(0);
      expect(trailerRequests.every((url) => new URL(url).pathname === '/ben-portfolio/assets/video/trivialise-trailer.mp4')).toBe(true);
      await page.keyboard.press('Space');
      await expect(video).toHaveJSProperty('paused', true);

      await video.evaluate(async (element) => {
        const player = element as HTMLVideoElement;
        const seeked = new Promise<void>((resolve) => player.addEventListener('seeked', () => resolve(), { once: true }));
        player.currentTime = 10;
        await seeked;
        player.muted = true;
        player.volume = 0.5;
        player.textTracks[0].mode = 'showing';
      });
      await expect(video).toHaveJSProperty('currentTime', 10);
      await expect(video).toHaveJSProperty('videoWidth', 1920);
      await expect(video).toHaveJSProperty('muted', true);
      await expect(video).toHaveJSProperty('volume', 0.5);
      await expect.poll(async () => video.evaluate((element) => {
        const track = (element as HTMLVideoElement).textTracks[0];
        return { label: track.label, language: track.language, text: [...(track.activeCues ?? [])].map((cue) => (cue as VTTCue).text).join(' ') };
      })).toMatchObject({ label: 'English', language: 'en', text: expect.stringContaining('Trivia earns progress') });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

      const previousVideo = await video.elementHandle();
      await video.evaluate((element) => (element as HTMLVideoElement).play());
      await expect(video).toHaveJSProperty('paused', false);
      await page.locator(frame).getByRole('button', { name: 'Back to projects' }).click();
      await expect(page).toHaveURL(/#projects$/);
      await expect.poll(async () => previousVideo!.evaluate((element) => (element as HTMLVideoElement).paused)).toBe(true);
      await expect(page.locator(frame).locator('video')).toHaveCount(0);
    });

    test(`retains useful detail and transcript when trailer loading fails at ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'Chromium', 'Focused trailer failure acceptance runs in Chromium.');
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.route('**/assets/video/trivialise-trailer.mp4', (route) => route.abort());
      await page.goto('./#projects/trivialise');
      const detail = page.locator(frame);
      const video = detail.locator('video');
      await expect(video).toHaveCount(1);
      await video.scrollIntoViewIfNeeded();
      await video.focus();
      await page.keyboard.press('Space');
      await expect(detail.getByText(/(trailer|video).*(unavailable|could not|failed)/i)).toBeVisible();
      await expect(detail.getByRole('img', { name: 'TRIVIALISE! project interface' })).toBeVisible();
      await expect(detail.getByText(/Upbeat instrumental music accompanies this 20-second animated trailer/)).toBeVisible();
      await expect(detail.getByText(/A shared display and private phone controllers/)).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await page.screenshot({ path: testInfo.outputPath(`trailer-failed-${viewport.width}.png`) });
      await detail.getByRole('button', { name: 'Back to projects' }).click();
      await expect(page).toHaveURL(/#projects$/);
      await detail.getByRole('button', { name: 'Open Taskmon case study' }).click();
      await expect(detail.getByRole('heading', { level: 1, name: 'Taskmon' })).toBeInViewport();
    });
  }

  for (const project of [
    { id: 'trivialise', title: 'TRIVIALISE!' },
    { id: 'taskmon', title: 'Taskmon' },
  ]) {
    test(`shares, reloads and restores ${project.id} through browser history at desktop and mobile sizes`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'Chromium', 'Focused new-project acceptance runs in Chromium.');
      for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
        await page.setViewportSize(viewport);
        await page.goto(`./#projects/${project.id}`);
        const detail = page.locator(frame);
        const heading = detail.getByRole('heading', { level: 1, name: project.title });
        const back = detail.getByRole('button', { name: 'Back to projects' });
        await expect(page).toHaveURL(new RegExp(`#projects/${project.id}$`));
        await expect(heading).toBeInViewport();
        await expect(back).toBeInViewport();
        await page.reload();
        await expect(heading).toBeInViewport();
        await expect(back).toBeInViewport();

        await back.click();
        await expect(page).toHaveURL(/#projects$/);
        await detail.getByRole('button', { name: `Open ${project.title} case study` }).click();
        await expect(page).toHaveURL(new RegExp(`#projects/${project.id}$`));
        await expect(heading).toBeInViewport();
        await back.click();
        await expect(page).toHaveURL(/#projects$/);
        await page.goBack();
        await expect(page).toHaveURL(new RegExp(`#projects/${project.id}$`));
        await expect(heading).toBeInViewport();
        await expect(back).toBeInViewport();
        await page.goForward();
        await expect(page).toHaveURL(/#projects$/);
        await expect(detail.getByRole('heading', { level: 1, name: 'Engineering projects' })).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      }
    });
  }

  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    for (const project of [
      { id: 'safelog', title: 'Safelog' },
      { id: 'taskmon', title: 'Taskmon' },
    ]) {
      test(`opens ${project.id} at its title and Back control after catalogue scrolling at ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'Chromium', 'Real viewport scrolling acceptance runs in Chromium.');
        await page.setViewportSize(viewport);
        await page.goto('./#projects');
        const projects = page.locator(frame);
        const content = projects.getByRole('region', { name: 'Projects content' });
        const open = projects.getByRole('button', { name: `Open ${project.title} case study` });
        await content.evaluate((element) => { element.scrollTop = element.scrollHeight; });
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await open.scrollIntoViewIfNeeded();
        await expect.poll(async () => page.evaluate(() => {
          const content = document.querySelector('[aria-label="Projects content"]');
          return Math.max(content?.scrollTop ?? 0, window.scrollY);
        })).toBeGreaterThan(0);
        await expect(projects.getByRole('heading', { level: 1, name: 'Engineering projects' })).not.toBeInViewport();

        await open.click();
        await page.screenshot({ path: testInfo.outputPath(`detail-scroll-${project.id}-${viewport.width}.png`) });
        await expect(page).toHaveURL(new RegExp(`#projects/${project.id}$`));
        // Do not scroll or focus another element before checking real viewport intersection.
        await expect.soft(projects.getByRole('heading', { level: 1, name: project.title })).toBeInViewport();
        await expect.soft(projects.getByRole('button', { name: 'Back to projects' })).toBeInViewport();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      });
    }
  }

  test('selects canonical IDs, supports direct hashes and browser history, and keeps external actions safe', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Desktop Projects journey runs in Chromium.');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('./#projects');
    const projects = page.locator(frame);
    await expect(projects.getByRole('heading', { level: 1, name: 'Engineering projects' })).toBeVisible();
    await expect(projects.getByTestId('project-entry-pokeleximon')).toHaveAttribute('data-featured', 'true');
    await page.screenshot({ path: testInfo.outputPath('portfolio-os-task9-desktop.png'), fullPage: true });

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
    await page.screenshot({ path: testInfo.outputPath('portfolio-os-task9-pokeleximon.png'), fullPage: true });

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
    await page.evaluate(() => { window.location.hash = '#projects/pokeleximon'; });
    await expect(page).toHaveURL(/#projects\/pokeleximon$/);
    await expect(page.locator(frame).getByRole('heading', { level: 1, name: 'Pokeleximon Daily' })).toBeVisible();
    const nextImage = page.locator(frame).getByRole('img', { name: 'Pokeleximon Daily project interface' });
    await expect(nextImage).toBeVisible();
    await expect.poll(async () => nextImage.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator(frame).getByRole('img', { name: /preview unavailable/ })).toHaveCount(0);
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
    await page.screenshot({ path: testInfo.outputPath('portfolio-os-task9-mobile.png'), fullPage: true });
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
          imageContentHeight: imageElement.clientHeight,
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
      await page.screenshot({ path: testInfo.outputPath(`portfolio-os-port-017-${scenario.name}.png`), fullPage: true });
      expect(Math.abs(measurement.mediaContentHeight - measurement.imageContentHeight), `${scenario.name}: media has empty Ink below image`).toBeLessThanOrEqual(2);
      expect(
        Math.abs((measurement.image.width / measurement.image.height) / (measurement.imageNaturalWidth / measurement.imageNaturalHeight) - 1),
        `${scenario.name}: image differs from its intrinsic aspect ratio`,
      ).toBeLessThanOrEqual(0.02);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${scenario.name}: horizontal overflow`).toBe(true);

      if (scenario.viewport.width <= 700) {
        expect.soft(measurement.copy.bottom, `${scenario.name}: copy renders above media on narrow screens`).toBeLessThanOrEqual(measurement.media.top);
      }

      expect(await copy.evaluate((copyElement) => (
        copyElement.nextElementSibling?.getAttribute('data-testid') === 'project-media-pokeleximon'
      )), `${scenario.name}: copy precedes media in document order`).toBe(true);
    }
  });
});
