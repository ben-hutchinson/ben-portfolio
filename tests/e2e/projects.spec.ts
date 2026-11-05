import { expect, test } from '@playwright/test';

const frame = '[data-window-id="projects"]';

type FeaturedProjectMeasurement = {
  readonly row: DOMRect;
  readonly copy: DOMRect;
  readonly media: DOMRect;
  readonly mediaArea: DOMRect;
  readonly mediaContentHeight: number;
  readonly image: DOMRect;
  readonly imageContentHeight: number;
  readonly imageNaturalWidth: number;
  readonly imageNaturalHeight: number;
  readonly catalogue: DOMRect;
  readonly background: string;
  readonly objectFit: string;
  readonly rem: number;
  readonly mediaAreaContentWidth: number;
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
    await expect(projects.getByTestId('project-entry-trivialise')).toHaveAttribute('data-featured', 'true');
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

  for (const interaction of ['click', 'keyboard', 'tap'] as const) {
    test(`opens every original screenshot from its image by ${interaction}`, async ({ page, context }, testInfo) => {
      test.skip(testInfo.project.name !== (interaction === 'tap' ? 'mobile-Chrome' : 'Chromium'), 'Native image activation runs on the matching desktop/mobile device.');
      const consoleErrors: string[] = [];
      page.on('pageerror', (error) => consoleErrors.push(error.message));
      await page.goto('./#projects');
      await expect(page).toHaveTitle(/Ben Hutchinson/);
      await expect(page.locator(frame).getByRole('heading', { level: 1, name: 'Engineering projects' })).toBeVisible();
      for (const project of [
        { id: 'trivialise', title: 'TRIVIALISE!' },
        { id: 'pokeleximon', title: 'Pokeleximon Daily' },
        { id: 'safelog', title: 'Safelog' },
        { id: 'taskmon', title: 'Taskmon' },
      ]) {
        const link = page.getByTestId(`project-entry-${project.id}`).getByRole('link', { name: `View ${project.title} screenshot full size` });
        const image = link.getByRole('img', { name: `${project.title} project interface` });
        await expect(link).toHaveAttribute('href', `/ben-portfolio/assets/ui/project-${project.id}.webp`);
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', /noopener/);
        await expect(link).toHaveAttribute('rel', /noreferrer/);
        await expect(link).toHaveText('');
        await image.scrollIntoViewIfNeeded();
        const popupPromise = context.waitForEvent('page');
        if (interaction === 'keyboard') {
          const precedingAction = page.getByTestId(`project-entry-${project.id}`).getByRole('button', { name: `Open ${project.title} case study` });
          await precedingAction.focus();
          await page.keyboard.press('Tab');
          const repositoryLink = page.getByTestId(`project-entry-${project.id}`).getByRole('link', { name: /GitHub/i });
          if (await repositoryLink.count()) {
            await expect(repositoryLink).toBeFocused();
            await page.keyboard.press('Tab');
          }
          await expect(link).toBeFocused();
          expect(await link.evaluate((element) => {
            const style = getComputedStyle(element);
            return style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
          })).toBe(true);
          await page.keyboard.press('Enter');
        } else if (interaction === 'tap') {
          await image.tap();
        } else {
          await image.click();
        }
        const popup = await popupPromise;
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(new URL(`/ben-portfolio/assets/ui/project-${project.id}.webp`, page.url()).href);
        expect(await popup.evaluate(() => window.opener === null)).toBe(true);
        await expect.poll(() => popup.locator('img').evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
        await popup.close();
        await expect(page).toHaveURL(/#projects$/);
      }
      expect(consoleErrors).toEqual([]);
    });
  }

  for (const scenario of featuredProjectScenarios) {
    test(`stages TRIVIALISE hero and staggered mixed-palette cards at ${scenario.name}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'Chromium', 'Catalogue geometry runs in Chromium.');
      await page.setViewportSize(scenario.viewport);
      await page.goto('./#projects');
      await page.locator('body').evaluate((body, zoom) => { body.style.zoom = String(zoom); }, scenario.zoom ?? 1);
      const header = page.locator(frame).locator('article > header');
      const headerBounds = await header.evaluate((element) => ({
        container: element.getBoundingClientRect(),
        content: [...element.children].map((child) => child.getBoundingClientRect()),
      }));
      for (const bounds of headerBounds.content) {
        expect.soft(isContainedBy(bounds, headerBounds.container), `${scenario.name}: catalogue heading and introduction stay within header`).toBe(true);
      }
      const entries = [
        { id: 'trivialise', title: 'TRIVIALISE!', side: 'right', alignment: 'full', color: 'rgb(246, 255, 235)' },
        { id: 'pokeleximon', title: 'Pokeleximon Daily', side: 'left', alignment: 'left', color: 'rgb(255, 220, 57)' },
        { id: 'safelog', title: 'Safelog', side: 'right', alignment: 'right', color: 'rgb(169, 242, 211)' },
        { id: 'taskmon', title: 'Taskmon', side: 'left', alignment: 'left', color: 'rgb(246, 255, 235)' },
      ];
      await expect(page.locator(frame).locator('[data-featured="true"]')).toHaveCount(1);

      for (const entry of entries) {
        const row = page.getByTestId(`project-entry-${entry.id}`);
        const title = row.getByRole('heading', { level: 2, name: entry.title });
        const copy = title.locator('..');
        const media = row.getByTestId(`project-media-${entry.id}`);
        const image = media.getByRole('img', { name: `${entry.title} project interface` });
        await expect(title).toBeVisible();
        await expect.poll(async () => image.evaluate((element) => {
          const imageElement = element as HTMLImageElement;
          return imageElement.complete && imageElement.naturalWidth > 0 && imageElement.naturalHeight > 0;
        })).toBe(true);
        const measurement = await row.evaluate((element): FeaturedProjectMeasurement => {
          const copyElement = element.querySelector('h2')?.parentElement;
          const mediaElement = element.querySelector<HTMLElement>('[data-testid^="project-media-"]');
          const imageElement = element.querySelector('img');
          const mediaArea = [...element.children].find((child) => mediaElement && child.contains(mediaElement));
          if (!copyElement || !mediaElement || !mediaArea || !imageElement || !element.parentElement) throw new Error('Project layout targets are missing.');
          return {
            row: element.getBoundingClientRect(),
            copy: copyElement.getBoundingClientRect(),
            media: mediaElement.getBoundingClientRect(),
            mediaArea: mediaArea.getBoundingClientRect(),
            mediaContentHeight: mediaElement.clientHeight,
            image: imageElement.getBoundingClientRect(),
            imageContentHeight: imageElement.clientHeight,
            imageNaturalWidth: imageElement.naturalWidth,
            imageNaturalHeight: imageElement.naturalHeight,
            catalogue: element.parentElement.getBoundingClientRect(),
            background: getComputedStyle(element).backgroundColor,
            objectFit: getComputedStyle(imageElement).objectFit,
            rem: Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
            mediaAreaContentWidth: mediaArea.clientWidth - Number.parseFloat(getComputedStyle(mediaArea).paddingLeft) - Number.parseFloat(getComputedStyle(mediaArea).paddingRight),
          };
        });
        const context = `${scenario.name} ${entry.id}`;
        expect.soft(overlapArea(measurement.copy, measurement.media), `${context}: copy/media overlap`).toBe(0);
        expect.soft(isContainedBy(measurement.copy, measurement.row), `${context}: copy containment`).toBe(true);
        expect.soft(isContainedBy(measurement.media, measurement.row), `${context}: media containment`).toBe(true);
        expect.soft(measurement.image.height, `${context}: image height`).toBeGreaterThan(0);
        expect.soft(Math.abs(measurement.mediaContentHeight - measurement.imageContentHeight), `${context}: empty media space`).toBeLessThanOrEqual(2);
        expect.soft(Math.abs((measurement.image.width / measurement.image.height) / (measurement.imageNaturalWidth / measurement.imageNaturalHeight) - 1), `${context}: intrinsic image ratio`).toBeLessThanOrEqual(0.02);
        expect.soft(measurement.objectFit, `${context}: complete screenshot`).toBe('contain');
        expect.soft(measurement.background, `${context}: agreed card color`).toBe(entry.color);
        expect.soft(await copy.evaluate((element, id) => {
          const mediaElement = element.parentElement?.querySelector(`[data-testid="project-media-${id}"]`);
          return mediaElement !== null && mediaElement !== undefined && element.nextElementSibling?.contains(mediaElement);
        }, entry.id), `${context}: copy precedes media area in DOM`).toBe(true);
        if (entry.id === 'taskmon') {
          const portraitCap = scenario.viewport.width <= 700 ? 24 : 27;
          expect.soft(measurement.image.height, `${context}: portrait height leaves comfortable space`).toBeLessThanOrEqual(portraitCap * measurement.rem * (scenario.zoom ?? 1) + 1);
        }
        const inset = 12 * (scenario.zoom ?? 1);
        for (const gap of [
          measurement.media.left - measurement.mediaArea.left,
          measurement.mediaArea.right - measurement.media.right,
          measurement.media.top - measurement.mediaArea.top,
          measurement.mediaArea.bottom - measurement.media.bottom,
        ]) expect.soft(gap, `${context}: screenshot breathing room`).toBeGreaterThanOrEqual(inset);
        expect.soft(Math.abs((measurement.media.left + measurement.media.right) - (measurement.mediaArea.left + measurement.mediaArea.right)), `${context}: media centered horizontally`).toBeLessThanOrEqual(2);
        if (entry.id === 'taskmon') {
          expect.soft(Math.abs((measurement.media.top + measurement.media.bottom) - (measurement.mediaArea.top + measurement.mediaArea.bottom)), `${context}: portrait centered vertically`).toBeLessThanOrEqual(2);
        } else {
          expect.soft(measurement.copy.bottom, `${context}: landscape follows copy in stacked card`).toBeLessThanOrEqual(measurement.media.top);
          expect.soft(measurement.mediaArea.width, `${context}: landscape area fills card width`).toBeGreaterThanOrEqual(measurement.row.width - 8 * (scenario.zoom ?? 1));
          const availableImageWidth = (measurement.mediaAreaContentWidth - 6) * (scenario.zoom ?? 1);
          expect.soft(measurement.image.width, `${context}: landscape fills available media width`).toBeGreaterThanOrEqual(availableImageWidth * 0.98);
          if (scenario.viewport.width === 1440) expect.soft(measurement.image.width, `${context}: landscape is materially larger`).toBeGreaterThanOrEqual(entry.id === 'trivialise' ? 900 : 730);

        }

        const fullSize = row.getByRole('link', { name: `View ${entry.title} screenshot full size` });
        await expect(fullSize.getByRole('img', { name: `${entry.title} project interface` })).toHaveCount(1);
        await expect(fullSize).toHaveText('');
        const linkBounds = await fullSize.boundingBox();
        expect.soft(linkBounds, `${context}: screenshot link has a rendered hit area`).not.toBeNull();
        if (linkBounds) {
          expect.soft(linkBounds.width, `${context}: screenshot is entirely clickable`).toBeGreaterThanOrEqual(measurement.image.width - 1);
          expect.soft(linkBounds.height, `${context}: screenshot is entirely clickable`).toBeGreaterThanOrEqual(measurement.image.height - 1);
        }
        const linkRect = await fullSize.evaluate((link) => link.getBoundingClientRect());
        expect.soft(isContainedBy(linkRect, measurement.row), `${context}: full-size link stays within card`).toBe(true);

        if (scenario.viewport.width <= 700) {
          expect.soft(measurement.copy.bottom, `${context}: copy above image on mobile`).toBeLessThanOrEqual(measurement.media.top);
          expect.soft(Math.abs(measurement.row.width - measurement.catalogue.width), `${context}: mobile full width`).toBeLessThanOrEqual(2);
        } else {
          if (entry.id === 'taskmon') {
            expect.soft(Math.abs((measurement.media.top + measurement.media.bottom) - (measurement.copy.top + measurement.copy.bottom)), `${context}: portrait centered beside copy`).toBeLessThanOrEqual(2);
            expect.soft(measurement.media.right, `${context}: portrait image left`).toBeLessThanOrEqual(measurement.copy.left);
          }
          if (entry.alignment === 'full') {
            expect.soft(Math.abs(measurement.row.width - measurement.catalogue.width), `${context}: hero full width`).toBeLessThanOrEqual(2);
          } else {
            expect.soft(measurement.row.width, `${context}: compact row`).toBeLessThan(measurement.catalogue.width - 2);
            const alignedEdge = entry.alignment === 'left' ? 'left' : 'right';
            expect.soft(Math.abs(measurement.row[alignedEdge] - measurement.catalogue[alignedEdge]), `${context}: staggered ${alignedEdge}`).toBeLessThanOrEqual(2);
          }
        }
        const action = row.getByRole('button', { name: `Open ${entry.title} case study` });
        await action.scrollIntoViewIfNeeded();
        await expect(action).toBeInViewport();
        await action.focus();
        await expect(action).toBeFocused();
        const github = row.getByRole('link', { name: /GitHub/i }).or(row.getByRole('button', { name: /GitHub/i }));
        await expect(github).toHaveCount(1);
        await expect(github).toBeVisible();
        await expect(github).toHaveText('');
        const githubIcon = github.locator('svg');
        await expect(githubIcon).toBeVisible();
        await expect(githubIcon).toHaveAttribute('aria-hidden', 'true');
        await expect(githubIcon).toHaveAttribute('focusable', 'false');
        await expect(githubIcon.locator('path')).toHaveAttribute('d', /\S/);
        await expect(github).toHaveAccessibleName(new RegExp(entry.title));
        const actions = await action.evaluate((element) => element.parentElement?.getBoundingClientRect());
        const githubRect = await github.evaluate((element) => element.getBoundingClientRect());
        const actionRect = await action.evaluate((element) => element.getBoundingClientRect());
        expect.soft(githubRect.width, `${context}: GitHub touch target width`).toBeCloseTo(44 * (scenario.zoom ?? 1), 0);
        expect.soft(githubRect.height, `${context}: GitHub touch target height`).toBeCloseTo(44 * (scenario.zoom ?? 1), 0);
        const iconRect = await githubIcon.evaluate((element) => element.getBoundingClientRect());
        expect.soft(iconRect.width, `${context}: GitHub logo width`).toBeCloseTo(24 * (scenario.zoom ?? 1), 0);
        expect.soft(iconRect.height, `${context}: GitHub logo height`).toBeCloseTo(24 * (scenario.zoom ?? 1), 0);
        expect.soft(isContainedBy(iconRect, githubRect), `${context}: GitHub logo stays within its control`).toBe(true);
        expect.soft(actionRect.height, `${context}: case-study touch target`).toBeGreaterThanOrEqual(44 * (scenario.zoom ?? 1));
        expect.soft(overlapArea(actionRect, githubRect), `${context}: actions never overlap`).toBe(0);
        const textLayout = await action.evaluate((element) => {
          const range = document.createRange();
          range.selectNodeContents(element);
          return { control: element.getBoundingClientRect(), text: [...range.getClientRects()] };
        });
        for (const textRect of textLayout.text) {
          expect.soft(isContainedBy(textRect, textLayout.control), `${context}: case-study text stays within its control`).toBe(true);
        }
        const currentRow = await row.evaluate((element) => element.getBoundingClientRect());
        expect.soft(isContainedBy(githubRect, currentRow), `${context}: GitHub stays within card`).toBe(true);
        expect.soft(actions, `${context}: action group exists`).toBeDefined();
        if (actions) expect.soft(isContainedBy(githubRect, actions), `${context}: GitHub shares the case-study action group`).toBe(true);
        if (await github.isEnabled()) {
          await page.keyboard.press('Tab');
          await expect(github).toBeFocused();
          expect.soft(await github.evaluate((element) => {
            const style = getComputedStyle(element);
            return style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
          }), `${context}: GitHub keyboard focus visible`).toBe(true);
        }
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${scenario.name}: horizontal overflow`).toBe(true);
      await page.screenshot({ path: testInfo.outputPath(`portfolio-layout-${scenario.name}.png`), fullPage: true });
    });
  }
});
