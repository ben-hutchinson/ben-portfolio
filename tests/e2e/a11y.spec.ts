import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const expectNoSeriousOrCriticalViolations = async (page: Page, scope?: string) => {
  const axe = new AxeBuilder({ page })
    // Base UI's inert, visually clipped focus guards are non-user controls and WebKit's Axe
    // adapter incorrectly reports them as unnamed buttons.
    .exclude('[data-base-ui-focus-guard]');
  if (scope) axe.include(scope);

  const results = await axe.analyze();
  const seriousOrCritical = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  );

  expect(seriousOrCritical).toEqual([]);
};

const renderedContrastRatio = async (page: Page, text: string) =>
  page.getByText(text, { exact: true }).evaluate((element) => {
    interface Color {
      alpha: number;
      blue: number;
      green: number;
      red: number;
    }

    const parseColor = (value: string): Color => {
      const channels = value.match(/[\d.]+/g)?.map(Number) ?? [];
      return {
        red: channels[0] ?? 0,
        green: channels[1] ?? 0,
        blue: channels[2] ?? 0,
        alpha: channels[3] ?? 1,
      };
    };

    const compositeOver = (foreground: Color, background: Color): Color => {
      const alpha = foreground.alpha + background.alpha * (1 - foreground.alpha);
      if (alpha === 0) return { red: 0, green: 0, blue: 0, alpha: 0 };

      return {
        red:
          (foreground.red * foreground.alpha +
            background.red * background.alpha * (1 - foreground.alpha)) /
          alpha,
        green:
          (foreground.green * foreground.alpha +
            background.green * background.alpha * (1 - foreground.alpha)) /
          alpha,
        blue:
          (foreground.blue * foreground.alpha +
            background.blue * background.alpha * (1 - foreground.alpha)) /
          alpha,
        alpha,
      };
    };

    let background: Color = { red: 0, green: 0, blue: 0, alpha: 0 };
    let current: HTMLElement | null = element as HTMLElement;
    while (current && background.alpha < 1) {
      background = compositeOver(background, parseColor(getComputedStyle(current).backgroundColor));
      current = current.parentElement;
    }

    const foreground = parseColor(getComputedStyle(element).color);
    const luminance = ({ red, green, blue }: Color) => {
      const channels = [red, green, blue].map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const foregroundLuminance = luminance(foreground);
    const backgroundLuminance = luminance(background);

    return (
      (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
      (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
    );
  });

test('catches serious or critical accessibility regressions on the main recruiter page', async ({ page }) => {
  await page.goto('/');

  await expectNoSeriousOrCriticalViolations(page);
});

test('catches serious or critical accessibility regressions in a project briefing sheet', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: /engineer the calm/i })).toBeVisible();
  await page.getByRole('button', { name: 'Open Pokeleximon Daily engineering briefing' }).click();
  await expect(page.getByRole('dialog', { name: 'Pokeleximon Daily engineering briefing' })).toBeVisible();

  await expectNoSeriousOrCriticalViolations(page, '[role="dialog"]');
});

test('catches serious or critical accessibility regressions in the Signal Sprint dialog', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Launch Signal Sprint' }).click();
  await expect(page.getByRole('dialog', { name: 'Signal Sprint training simulation' })).toBeVisible();

  await expectNoSeriousOrCriticalViolations(page);
});

test('catches topology focus buttons that no longer respond to keyboard activation', async ({ page }) => {
  await page.goto('/');

  const tooling = page.getByRole('button', { name: 'Developer tooling', exact: true });
  await tooling.focus();
  await tooling.press('Enter');

  await expect(tooling).toHaveAttribute('aria-pressed', 'true');
});

test('catches Escape closing a project briefing without restoring focus to its trigger', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: /engineer the calm/i })).toBeVisible();

  const trigger = page.getByRole('button', { name: 'Open Pokeleximon Daily engineering briefing' });
  await trigger.click();
  await expect(page.getByRole('dialog', { name: 'Pokeleximon Daily engineering briefing' })).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(page.getByRole('dialog', { name: 'Pokeleximon Daily engineering briefing' })).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('orbit-lilac metadata meets AA contrast', async ({ page }) => {
  const labels = [
    'Command crew / 03',
    'Optional training / Signal Sprint',
    'Simulation ready',
  ];

  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto('/');

    for (const label of labels) {
      expect(await renderedContrastRatio(page, label), `${label} at ${width}px`).toBeGreaterThanOrEqual(
        4.5,
      );
    }
  }
});

test('topology information controls meet the 44px target', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto('/');

    const controls = page.locator('button[aria-label^="More information about"]');
    await expect(controls).toHaveCount(5);

    for (const control of await controls.all()) {
      const box = await control.boundingBox();
      expect(box).not.toBeNull();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  }
});

test('sheet and dialog close controls meet the 44px target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const surfaces = [
    {
      open: page.getByRole('button', { name: 'Open navigation' }),
      surface: page.getByRole('dialog', { name: 'Command index' }),
    },
    {
      open: page.getByRole('button', {
        name: 'Open Pokeleximon Daily engineering briefing',
      }),
      surface: page.getByRole('dialog', {
        name: 'Pokeleximon Daily engineering briefing',
      }),
    },
    {
      open: page.getByRole('button', { name: 'Launch Signal Sprint' }),
      surface: page.getByRole('dialog', { name: 'Signal Sprint training simulation' }),
    },
  ];

  for (const { open, surface } of surfaces) {
    await open.click();
    await expect(surface).toBeVisible();

    const close = surface.getByRole('button', { name: 'Close' });
    const box = await close.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);

    await close.press('Enter');
    await expect(surface).toBeHidden();
  }
});

test('Signal Sprint controls meet the 44px target in all states', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Launch Signal Sprint' }).click();

  const dialog = page.getByRole('dialog', { name: 'Signal Sprint training simulation' });
  await expect(dialog).toBeVisible();

  for (const control of [
    dialog.getByRole('button', { name: 'Enable training audio' }),
    dialog.getByRole('button', { name: 'Back to Portfolio' }),
  ]) {
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }

  await expect(dialog.getByText('Mission failed', { exact: true })).toBeVisible({
    timeout: 15_000,
  });

  const retry = dialog.getByRole('button', { name: 'Retry' });
  const back = dialog.getByRole('button', { name: 'Back', exact: true });
  const retryBox = await retry.boundingBox();
  const backBox = await back.boundingBox();

  for (const box of [retryBox, backBox]) {
    expect(box).not.toBeNull();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }

  const overlapWidth = Math.min(retryBox!.x + retryBox!.width, backBox!.x + backBox!.width) -
    Math.max(retryBox!.x, backBox!.x);
  const overlapHeight = Math.min(retryBox!.y + retryBox!.height, backBox!.y + backBox!.height) -
    Math.max(retryBox!.y, backBox!.y);
  expect(overlapWidth <= 0 || overlapHeight <= 0).toBe(true);
});

test('desktop primary navigation meets the 44px target', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');

  const banner = page.getByRole('banner');
  const identity = banner.getByRole('link', { name: 'Ben Hutchinson, back to top' });
  const primaryLinks = page.getByRole('navigation', { name: 'Primary' }).getByRole('link');
  await expect(primaryLinks).toHaveCount(5);

  for (const link of [identity, ...(await primaryLinks.all())]) {
    const box = await link.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});

test('mission preview links meet the 44px target', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto('/');

    for (const listName of ['Pokeleximon Daily links', 'Safelog links']) {
      const links = page.getByRole('list', { name: listName }).getByRole('link');
      const boxes = [];

      for (const link of await links.all()) {
        const box = await link.boundingBox();
        expect(box).not.toBeNull();
        expect(box?.width).toBeGreaterThanOrEqual(44);
        expect(box?.height).toBeGreaterThanOrEqual(44);
        boxes.push(box!);
      }

      for (let index = 1; index < boxes.length; index += 1) {
        const previous = boxes[index - 1];
        const current = boxes[index];
        const overlapWidth =
          Math.min(previous.x + previous.width, current.x + current.width) -
          Math.max(previous.x, current.x);
        const overlapHeight =
          Math.min(previous.y + previous.height, current.y + current.height) -
          Math.max(previous.y, current.y);
        expect(overlapWidth <= 0 || overlapHeight <= 0).toBe(true);
      }
    }
  }
});

test('footer links meet the 44px target without overflow', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto('/');

    const links = page
      .getByRole('navigation', { name: 'Contact and profile links' })
      .getByRole('link');
    await expect(links).toHaveCount(3);

    for (const link of await links.all()) {
      const box = await link.boundingBox();
      expect(box).not.toBeNull();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
});
