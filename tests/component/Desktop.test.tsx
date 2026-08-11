import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PortfolioProvider, usePortfolio } from '../../src/app/PortfolioContext';
import { profile } from '../../src/data/profile';
import { flagshipWork } from '../../src/data/work';
import { PortfolioShell } from '../../src/shell/PortfolioShell';

function StateProbe() {
  const { state } = usePortfolio();
  return <output aria-label="portfolio state">{JSON.stringify(state)}</output>;
}

function installViewport(width: number, finePointer: boolean) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn(() => ({
      matches: finePointer,
      media: '(pointer: fine)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as unknown as MediaQueryList),
  });
}

function renderDesktop(width = 1440, finePointer = true) {
  installViewport(width, finePointer);
  window.history.replaceState(null, '', '#desktop');
  return render(
    <PortfolioProvider>
      <PortfolioShell />
      <StateProbe />
    </PortfolioProvider>,
  );
}

function readState() {
  return JSON.parse(screen.getByRole('status', { name: 'portfolio state' }).textContent ?? '{}') as {
    route: { kind: string };
    openAppIds: string[];
    focusedAppId: string | null;
    windowOrder: string[];
    windowPositions: Record<'about' | 'work' | 'command', { x: number; y: number }>;
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState(null, '', '#desktop');
});

describe('recruiter-first Desktop', () => {
  it('exposes the complete canonical ten-second contract without interaction', () => {
    renderDesktop();

    expect(profile.location).toBe('Manchester, UK');
    expect(screen.getAllByText(profile.name).length).toBeGreaterThan(0);
    expect(screen.getByText(profile.role, { exact: true })).toBeVisible();
    expect(screen.getByText(profile.location, { exact: true })).toBeVisible();
    expect(screen.getByText(profile.availability, { exact: true })).toBeVisible();
    expect(screen.getByText(profile.positioning, { exact: true })).toBeVisible();
    expect(screen.getAllByText(flagshipWork.result, { exact: true })).toHaveLength(1);
    expect(screen.getByText(flagshipWork.result, { exact: true })).toBeVisible();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: profile.name })).toBeVisible();
  });

  it('uses the accepted asymmetric default state and restores About as topmost', async () => {
    const user = userEvent.setup();
    renderDesktop();

    const initial = readState();
    expect(initial.openAppIds).toEqual(['about', 'work', 'command']);
    expect(initial.focusedAppId).toBe('about');
    expect(initial.windowOrder[initial.windowOrder.length - 1]).toBe('about');
    expect(initial.windowPositions.work.y).toBeLessThan(initial.windowPositions.about.y);
    expect(initial.windowPositions.command.x).toBeGreaterThan(initial.windowPositions.about.x);
    expect(initial.windowPositions.command.y).toBeGreaterThan(initial.windowPositions.about.y);

    const about = document.querySelector<HTMLElement>('[data-window-id="about"]');
    const work = document.querySelector<HTMLElement>('[data-window-id="work"]');
    const command = document.querySelector<HTMLElement>('[data-window-id="command"]');
    expect(Number(about?.style.zIndex)).toBeGreaterThan(Number(work?.style.zIndex));
    expect(Number(about?.style.zIndex)).toBeGreaterThan(Number(command?.style.zIndex));

    await user.click(screen.getByRole('region', { name: 'Work' }));
    await user.click(screen.getByRole('button', { name: 'Reset layout' }));
    expect(readState()).toMatchObject({ focusedAppId: 'about', openAppIds: ['about', 'work', 'command'] });
    const reset = readState();
    expect(reset.windowOrder[reset.windowOrder.length - 1]).toBe('about');
  });

  it('provides the three locked reducer-backed secondary shortcuts', async () => {
    const user = userEvent.setup();
    renderDesktop();

    const shortcuts = ['about', 'career', 'work'] as const;
    expect(shortcuts.map((appId) => (
      screen.getByRole('button', { name: `Open ${appId[0].toUpperCase()}${appId.slice(1)}` })
        .getAttribute('data-desktop-shortcut-app-id')
    ))).toEqual(shortcuts);

    await user.click(screen.getByRole('button', { name: 'Open Work' }));
    expect(readState()).toMatchObject({ route: { kind: 'work' }, focusedAppId: 'work' });
    await user.click(screen.getByRole('button', { name: 'Open About' }));
    expect(readState()).toMatchObject({ route: { kind: 'work' }, focusedAppId: 'about' });
    await user.click(screen.getByRole('button', { name: 'Open Career' }));
    expect(readState()).toMatchObject({ route: { kind: 'career' }, focusedAppId: 'career' });
  });

  it('keeps every recruiter exit one action away', async () => {
    const user = userEvent.setup();
    renderDesktop();

    expect(screen.getByRole('button', { name: 'Open Work' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Open Career' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Download CV' })).toHaveAttribute('download', 'ben-hutchinson-cv.pdf');
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/ben-hutchinson');
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/ben-hutchinson0412/');
    await user.click(screen.getByRole('button', { name: 'Contact' }));
    expect(window.location.hash).toBe('#contact');
  });

  it('shows only About with the page h1 in coarse mobile mode and omits shortcut dependency', () => {
    renderDesktop(390, false);

    const visibleFrames = [...document.querySelectorAll<HTMLElement>('[data-window-id]')]
      .filter((frame) => getComputedStyle(frame).display !== 'none');
    expect(visibleFrames.map((frame) => frame.dataset.windowId)).toEqual(['about']);
    expect(screen.getByRole('heading', { level: 1, name: profile.name })).toBeVisible();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.queryByRole('button', { name: 'Open About' })).toBeNull();
    expect(visibleFrames[0]).not.toHaveAttribute('data-drag-enabled');
  });
});
