import { expect, test } from '@playwright/test';
import axe from 'axe-core';

const years = ['2022', '2024', '2025', 'Now'] as const;
const careerFrame = '[data-window-id="career"]';
const stageJourneys = [
  { control: '2022', heading: 'Learning to operate production systems' },
  { control: '2024', heading: 'Turning evidence into better reliability' },
  { control: '2025', heading: 'Owning delivery across changing stacks' },
  { control: 'Now', heading: 'Building paved roads for engineering teams' },
] as const;

const careerGeometryScenarios = [
  { name: '1440x1000', viewport: { width: 1440, height: 1000 } },
  { name: '1280x800', viewport: { width: 1280, height: 800 } },
  { name: '390x844', viewport: { width: 390, height: 844 } },
  { name: '200% zoom', viewport: { width: 1440, height: 1000 }, zoom: 2 },
] as const;

test.describe('Career.app desktop', () => {
  test('opens through every existing route, supports history, and keeps controls synchronized', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Desktop Career coverage runs in Chromium.');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('./#career');

    await expect(page.locator(careerFrame)).toBeVisible();
    const range = page.getByRole('slider', { name: 'Career stage' });
    await expect(range).toHaveAttribute('min', '0');
    await expect(range).toHaveAttribute('max', '3');
    await expect(range).toHaveAttribute('step', '1');
    await expect(range).toHaveValue('0');
    for (const year of years) await expect(page.getByRole('button', { name: year })).toBeVisible();

    await page.getByRole('button', { name: '2025' }).click();
    await expect(range).toHaveValue('2');
    await expect(range).toHaveAttribute('aria-valuetext', '2025 — Associate Software Engineer');
    await range.focus();
    await page.keyboard.press('ArrowRight');
    await expect(range).toHaveValue('3');
    await expect(page.getByRole('heading', { name: 'Building paved roads for engineering teams' })).toBeVisible();

    await page.goto('./#desktop');
    await expect(page).toHaveURL(/#desktop$/);
    await page.locator('[data-dock-app-id="career"]').click();
    await expect(page).toHaveURL(/#career$/);
    await page.goBack();
    await expect(page).toHaveURL(/#desktop$/);
    await page.goForward();
    await expect(page).toHaveURL(/#career$/);

    await page.getByRole('button', { name: 'Minimize Career' }).click();
    await page.locator('[data-dock-app-id="career"]').click();
    await expect(page.locator(careerFrame)).toBeVisible();
    await page.getByRole('button', { name: 'Maximize Career' }).click();
    await expect(page.getByRole('button', { name: 'Restore Career' })).toBeVisible();
    await page.getByRole('button', { name: 'Close Career' }).click();
    await page.getByRole('button', { name: 'Open Career' }).click();
    await expect(page.locator(careerFrame)).toBeVisible();
  });

  test('uses immediate readable stage swaps with reduced motion', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Desktop reduced-motion coverage runs in Chromium.');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./#career');
    await page.getByRole('button', { name: 'Now' }).click();
    await expect(page.getByTestId('career-stage')).toHaveAttribute('data-reduced-motion', 'true');
    await expect(page.getByTestId('career-stage')).toHaveAttribute('data-motion-offset-px', '0');
    await expect(page.getByTestId('career-stage')).toHaveAttribute('data-motion-duration-ms', '0');
    await expect(page.getByRole('heading', { name: 'Building paved roads for engineering teams' })).toBeVisible();
  });

  test('publishes opacity-only, zero-offset motion metadata for every Career stage', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Career motion coverage runs in Chromium.');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('./#career');

    for (const stage of stageJourneys) {
      await page.getByRole('button', { name: stage.control }).click();
      await expect(page.getByRole('button', { name: stage.control })).toHaveAttribute('aria-pressed', 'true');
      await expect(page.getByTestId('career-stage')).toHaveAttribute('data-motion-offset-px', '0');
      await expect(page.getByTestId('career-stage')).toHaveAttribute('data-motion-duration-ms', '200');
    }
  });

  test('keeps the Career control rail fixed while every stage remains readable at each required viewport and zoom', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Career geometry coverage runs in Chromium.');

    for (const scenario of careerGeometryScenarios) {
      await page.setViewportSize(scenario.viewport);
      await page.goto('./#career');
      if ('zoom' in scenario) {
        await page.evaluate((zoom) => { document.body.style.zoom = String(zoom); }, scenario.zoom);
      }

      const controls = page.getByRole('slider', { name: 'Career stage' }).locator('..');
      const railYs: number[] = [];
      for (const stage of stageJourneys) {
        await page.getByRole('button', { name: stage.control }).click();
        await expect(page.getByRole('button', { name: stage.control })).toHaveAttribute('aria-pressed', 'true');
        await expect(page.getByRole('heading', { name: stage.heading })).toBeVisible();
        await page.getByTestId('career-stage').scrollIntoViewIfNeeded();

        const railBox = await controls.boundingBox();
        if (railBox === null) throw new Error(`Career controls were not measurable at ${scenario.name}.`);
        railYs.push(railBox.y);

        const activeStageIsReadableWithoutPageOverflow = await page.evaluate(() => {
          const stage = document.querySelector<HTMLElement>('[data-testid="career-stage"]');
          if (stage === null) return false;
          const bounds = stage.getBoundingClientRect();
          return stage.textContent?.trim().length !== 0
            && bounds.width > 0
            && bounds.left >= 0
            && bounds.right <= document.documentElement.clientWidth
            && document.documentElement.scrollWidth <= document.documentElement.clientWidth;
        });
        expect(activeStageIsReadableWithoutPageOverflow).toBe(true);
      }

      const baselineRailY = railYs[0];
      if (baselineRailY === undefined) throw new Error(`No Career rail measurements for ${scenario.name}.`);
      for (const railY of railYs) {
        expect(Math.abs(railY - baselineRailY), `${scenario.name}: rail y changed across stages`).toBeLessThanOrEqual(1);
      }
    }
  });

  test('keeps Reset layout clear of the focused Career scrub controls', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Desktop Career coverage runs in Chromium.');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('./#career');

    const controlsAreClear = await page.evaluate(() => {
      const reset = document.querySelector<HTMLElement>('[data-window-control="reset-layout"]');
      const targets = [
        document.querySelector<HTMLElement>('[data-window-id="career"] input[type="range"]'),
        ...document.querySelectorAll<HTMLElement>('[data-window-id="career"] button[aria-pressed]'),
      ].filter((target): target is HTMLElement => target !== null);
      if (reset === null || targets.length !== 5) return false;

      const resetBounds = reset.getBoundingClientRect();
      return targets.every((target) => {
        const bounds = target.getBoundingClientRect();
        return resetBounds.right <= bounds.left
          || resetBounds.left >= bounds.right
          || resetBounds.bottom <= bounds.top
          || resetBounds.top >= bounds.bottom;
      });
    });

    expect(controlsAreClear).toBe(true);
  });

  test('keeps the Now stage readable and reachable at 200% zoom', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'Chromium', 'Desktop Career coverage runs in Chromium.');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('./#career');
    await page.getByRole('button', { name: 'Now' }).click();
    await page.evaluate(() => { document.body.style.zoom = '2'; });

    const zoomContractHolds = await page.evaluate(() => {
      const stage = document.querySelector<HTMLElement>('[data-window-id="career"] [data-testid="career-stage"]');
      if (stage === null) return false;
      const selectors = [
        'div > p:first-child',
        'div > p:nth-of-type(2)',
        'h3',
        'aside p:nth-of-type(2)',
        '[data-window-id="career"] input[type="range"]',
        '[data-window-id="career"] button[aria-pressed="true"]',
      ];
      const elements = selectors.map((selector) => selector.startsWith('[data-window-id')
        ? document.querySelector<HTMLElement>(selector)
        : stage.querySelector<HTMLElement>(selector));
      const evidence = stage.querySelector<HTMLElement>('aside p:nth-of-type(2)');
      if (evidence === null || elements.some((element) => element === null)) return false;

      const evidenceStyle = window.getComputedStyle(evidence);
      const usesProfessionalWrapping = evidenceStyle.overflowWrap !== 'anywhere'
        && evidenceStyle.wordBreak !== 'break-all';
      const hasNoHorizontalOverflow = document.documentElement.scrollWidth <= window.innerWidth;
      const allReachable = elements.every((element) => {
        element?.scrollIntoView({ block: 'center', inline: 'nearest' });
        const bounds = element?.getBoundingClientRect();
        return bounds !== undefined
          && bounds.width > 0
          && bounds.height > 0
          && bounds.left >= 0
          && bounds.right <= window.innerWidth;
      });

      return usesProfessionalWrapping && hasNoHorizontalOverflow && allReachable;
    });

    expect(zoomContractHolds).toBe(true);
  });
});

test.describe('Career.app mobile', () => {
  test('retains the supported Career hash through real provider hydration', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-Chrome', 'Mobile hash hydration coverage runs in mobile Chromium.');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#career');

    await expect(page).toHaveURL(/#career$/);
    await expect(page.locator(careerFrame)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Learning to operate production systems' })).toBeVisible();
  });

  test('keeps the Career controls readable, scrollable, zoomable, and drag-free', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-Chrome', 'Mobile Career coverage runs in mobile Chromium.');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#career');

    await expect(page.locator(careerFrame)).toBeVisible();
    await expect(page.locator(careerFrame)).not.toHaveAttribute('data-drag-enabled');
    await expect(page.getByRole('slider', { name: 'Career stage' })).toBeVisible();
    await page.getByRole('button', { name: 'Now' }).click();
    await expect(page.getByRole('heading', { name: 'Building paved roads for engineering teams' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.evaluate(() => document.body.style.zoom = '2');
    await expect(page.getByRole('slider', { name: 'Career stage' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Now' })).toBeVisible();
  });

  test('has no serious or critical accessibility violation at the Career route', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-Chrome', 'Mobile Career axe coverage runs in mobile Chromium.');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#career');
    await page.addScriptTag({ content: axe.source });
    const seriousOrCritical = await page.evaluate(async () => {
      const axeRunner = (window as unknown as {
        axe: { run: () => Promise<{ violations: readonly { impact: string | null }[] }> };
      }).axe;
      const results = await axeRunner.run();
      return results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical').length;
    });
    expect(seriousOrCritical).toBe(0);
  });

  test('provides the sole visible Career h1 and clears the heading-one axe rule', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-Chrome', 'Mobile Career coverage runs in mobile Chromium.');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#career');
    await page.addScriptTag({ content: axe.source });

    const careerHeadingContractHolds = await page.evaluate(async () => {
      const visibleHeadings = [...document.querySelectorAll('h1')].filter((heading) => {
        const style = window.getComputedStyle(heading);
        const bounds = heading.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && bounds.width > 0 && bounds.height > 0;
      });
      const axeRunner = (window as unknown as {
        axe: { run: () => Promise<{ violations: readonly { id: string }[] }> };
      }).axe;
      const results = await axeRunner.run();
      const missingHeadingOne = results.violations.some(({ id }) => id === 'page-has-heading-one');
      return visibleHeadings.length === 1
        && visibleHeadings[0]?.textContent?.includes('Career') === true
        && !missingHeadingOne;
    });

    expect(careerHeadingContractHolds).toBe(true);
  });
});
