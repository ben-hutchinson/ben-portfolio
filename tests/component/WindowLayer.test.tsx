import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PortfolioProvider, usePortfolio } from '../../src/app/PortfolioContext';
import { Dock } from '../../src/shell/Dock';
import { WindowLayer, WINDOW_APP_ORDER } from '../../src/shell/WindowLayer';
import { flagshipWork } from '../../src/data/work';

class ResizeObserverMock {
  static instances: ResizeObserverMock[] = [];
  readonly observe = vi.fn();
  readonly unobserve = vi.fn();
  readonly disconnect = vi.fn();
  constructor(private readonly callback: ResizeObserverCallback) { ResizeObserverMock.instances.push(this); }
  emit(width: number, height: number) {
    this.callback([{ contentRect: { width, height } } as ResizeObserverEntry], this as unknown as ResizeObserver);
  }
}

function installFinePointer(matches = true, legacyListeners = false) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const query = {
    matches,
    media: '(pointer: fine)',
    onchange: null,
    addEventListener: legacyListeners ? undefined : vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener)),
    removeEventListener: legacyListeners ? undefined : vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener)),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList;
  const matchMedia = vi.fn(() => query);
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: matchMedia });
  return { query, matchMedia, listeners };
}

function expectFocusInFrame(title: string) {
  const frame = screen.getByRole('region', { name: title });
  const firstControl = screen.getByRole('button', { name: `Close ${title}` });
  const titlebarLabel = frame.querySelector<HTMLElement>('[data-window-title]');
  if (titlebarLabel === null) throw new Error(`Window title for ${title} was not rendered`);
  expect([titlebarLabel, firstControl]).toContain(document.activeElement);
  expect(frame).toContainElement(document.activeElement as HTMLElement);
}

function StateProbe() {
  const { state } = usePortfolio();
  return <output aria-label="portfolio state">{JSON.stringify(state)}</output>;
}

function desktopPositions() {
  const state = JSON.parse(screen.getByRole('status', { name: 'portfolio state' }).textContent ?? '{}') as {
    windowPositions: Record<'about' | 'work' | 'career' | 'projects' | 'contact', { x: number; y: number }>;
  };
  const { about, work, career, projects, contact } = state.windowPositions;
  return { about, work, career, projects, contact };
}

function renderLayer() {
  window.history.replaceState(null, '', '#desktop');
  return render(
    <PortfolioProvider>
      <main id="main-content" tabIndex={-1}>
        <WindowLayer />
      </main>
      <Dock />
      <StateProbe />
    </PortfolioProvider>,
  );
}

function renderLayerWithoutDock() {
  window.history.replaceState(null, '', '#desktop');
  return render(
    <PortfolioProvider>
      <main id="main-content" tabIndex={-1}>
        <WindowLayer />
      </main>
    </PortfolioProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState(null, '', '#desktop');
  ResizeObserverMock.instances = [];
});

describe('WindowLayer', () => {
  it('keeps the fixed window source order even when focus changes visual stacking', async () => {
    installFinePointer();
    renderLayer();

    expect(WINDOW_APP_ORDER).toEqual(['about', 'work', 'career', 'projects', 'contact']);
    expect([...document.querySelectorAll('[data-window-id]')].map((node) => node.getAttribute('data-window-id')))
      .toEqual(['about', 'work']);
    const about = document.querySelector('[data-window-id="about"]') as HTMLElement;
    const work = document.querySelector('[data-window-id="work"]') as HTMLElement;
    expect(Number(about.style.zIndex)).toBeGreaterThan(Number(work.style.zIndex));

    await userEvent.setup().click(screen.getByRole('region', { name: 'About' }));
    expect([...document.querySelectorAll('[data-window-id]')].map((node) => node.getAttribute('data-window-id')))
      .toEqual(['about', 'work']);
    expect(Number(about.style.zIndex)).toBeGreaterThan(Number(work.style.zIndex));
  });

  it('renders the canonical flagship result exactly once and retains reset recovery when frames disappear', async () => {
    installFinePointer();
    const user = userEvent.setup();
    renderLayer();

    expect(screen.getAllByText(flagshipWork.result)).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Reset layout' })).toHaveAttribute('data-window-control', 'reset-layout');
    for (const app of ['About', 'Work'] as const) {
      await user.click(screen.getByRole('button', { name: `Close ${app}` }));
    }
    expect(document.querySelectorAll('[data-window-id]')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: 'Reset layout' }));
    expect([...document.querySelectorAll('[data-window-id]')].map((node) => node.getAttribute('data-window-id')))
      .toEqual(['about', 'work']);
    expect(screen.getByRole('status', { name: 'portfolio state' })).toHaveTextContent('"focusedAppId":"about"');
  });

  it('uses the full Work window for a direct selected case study and recovers it to Desktop when closed', async () => {
    installFinePointer();
    window.history.replaceState(null, '', '#work/uv-ruff-migration');
    const user = userEvent.setup();
    render(
      <PortfolioProvider>
        <main id="main-content" tabIndex={-1}><WindowLayer /></main>
        <Dock />
        <StateProbe />
      </PortfolioProvider>,
    );

    expect(screen.getByRole('region', { name: 'Work' })).toHaveTextContent('The shared developer workflow became faster across the migrated repositories.');
    expect(screen.getByRole('status', { name: 'portfolio state' })).toHaveTextContent('"activeWorkId":"uv-ruff-migration"');
    await user.click(screen.getByRole('button', { name: 'Close Work' }));
    expect(window.location.hash).toBe('#desktop');
  });

  it('preserves direct Work detail content and hash while maximizing then restoring the Work window', async () => {
    installFinePointer();
    window.history.replaceState(null, '', '#work/uv-ruff-migration');
    const user = userEvent.setup();
    render(
      <PortfolioProvider>
        <main id="main-content" tabIndex={-1}><WindowLayer /></main>
        <Dock />
        <StateProbe />
      </PortfolioProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Maximize Work' }));
    expect(window.location.hash).toBe('#work/uv-ruff-migration');
    expect(screen.getByRole('button', { name: 'Back to work' })).toBeVisible();
    expect(screen.getByRole('status', { name: 'portfolio state' })).toHaveTextContent('"activeWorkId":"uv-ruff-migration"');
    await user.click(screen.getByRole('button', { name: 'Restore Work' }));
    expect(window.location.hash).toBe('#work/uv-ruff-migration');
    expect(screen.getByRole('button', { name: 'Back to work' })).toBeVisible();
    expect(screen.getByRole('region', { name: 'Work' })).toHaveTextContent('The shared developer workflow became faster across the migrated repositories.');
  });

  it('uses existing actions for close, minimize, maximize, restore, dock recovery, and focus placement', async () => {
    installFinePointer();
    const user = userEvent.setup();
    renderLayer();

    await user.click(screen.getByRole('region', { name: 'About' }));
    await user.click(screen.getByRole('button', { name: 'Close About' }));
    expect(screen.getByRole('button', { name: 'About' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'About' }));
    await waitFor(() => expectFocusInFrame('About'));

    await user.click(screen.getByRole('region', { name: 'Work' }));
    await user.click(screen.getByRole('button', { name: 'Minimize Work' }));
    expect(screen.getByRole('button', { name: 'Work' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Work' }));
    await waitFor(() => expectFocusInFrame('Work'));

    const hashBeforeMaximize = window.location.hash;
    await user.click(screen.getByRole('button', { name: 'Maximize Work' }));
    expect(screen.getByRole('button', { name: 'Restore Work' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Restore Work' }));
    expect(screen.getByRole('button', { name: 'Maximize Work' })).toBeVisible();
    expect(window.location.hash).toBe(hashBeforeMaximize);
  });

  it('restores only the maximized frame that contains the Escape event target', async () => {
    installFinePointer();
    const user = userEvent.setup();
    renderLayer();

    await user.click(screen.getByRole('button', { name: 'Maximize Work' }));
    await user.click(screen.getByRole('button', { name: 'Minimize Work' }));
    fireEvent.keyDown(screen.getByRole('button', { name: 'Work' }), { key: 'Escape' });
    expect(screen.queryByRole('button', { name: 'Restore Work' })).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Work' }));
    await user.click(screen.getByRole('button', { name: 'Maximize Work' }));
    fireEvent.keyDown(screen.getByRole('button', { name: 'Close Work' }), { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'Maximize Work' })).toBeVisible();
  });

  it('does not restore a maximized frame when Escape originates from the dock', async () => {
    installFinePointer();
    const user = userEvent.setup();
    renderLayer();

    await user.click(screen.getByRole('button', { name: 'Maximize Work' }));
    const workDock = screen.getByRole('button', { name: 'Work' });
    await user.click(workDock);
    fireEvent.keyDown(workDock, { key: 'Escape' });

    expect(screen.getByRole('button', { name: 'Restore Work' })).toBeVisible();
  });

  it('uses ResizeObserver to revalidate a moved normal frame and disconnects on unmount', () => {
    installFinePointer();
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    const { unmount } = renderLayer();
    const work = document.querySelector('[data-window-id="work"]') as HTMLElement;
    fireEvent.focus(work);
    fireEvent.pointerDown(document.querySelector('[data-titlebar="work"]') as HTMLElement, { button: 0, pointerId: 1, clientX: 650, clientY: 100 });
    fireEvent.pointerMove(document, { pointerId: 1, clientX: 2500, clientY: 2500 });
    fireEvent.pointerUp(document, { pointerId: 1 });

    const observer = ResizeObserverMock.instances[0];
    observer.emit(320, 220);
    expect(screen.getByRole('status', { name: 'portfolio state' })).toHaveTextContent('"work":{"x":0,"y":0}');
    unmount();
    expect(observer.disconnect).toHaveBeenCalledOnce();
  });

  it('preserves desktop reducer positions through a coarse mobile measurement before returning wide', async () => {
    const media = installFinePointer(true);
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 });
    renderLayer();
    const observer = ResizeObserverMock.instances[0];
    observer.emit(1440, 900);

    const expectedDesktopPositions = desktopPositions();
    expect(expectedDesktopPositions.work.y).toBeLessThan(expectedDesktopPositions.about.y);
    expect(desktopPositions()).toEqual(expectedDesktopPositions);

    (media.query as unknown as { matches: boolean }).matches = false;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 390 });
    fireEvent(window, new Event('resize'));
    observer.emit(390, 400);

    (media.query as unknown as { matches: boolean }).matches = true;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 });
    fireEvent(window, new Event('resize'));
    observer.emit(1440, 900);

    await waitFor(() => expect(desktopPositions()).toEqual(expectedDesktopPositions));
  });

  it('gates title-bar drag for fine pointers at 768px and cleans media and resize listeners on unmount', () => {
    const media = installFinePointer(false);
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 767 });
    const { unmount } = renderLayer();
    const original = (document.querySelector('[data-window-id="work"]') as HTMLElement).style.transform;
    fireEvent.pointerDown(document.querySelector('[data-titlebar="work"]') as HTMLElement, { button: 0, pointerId: 3, clientX: 650, clientY: 100 });
    fireEvent.pointerMove(document, { pointerId: 3, clientX: 1000, clientY: 400 });
    fireEvent.pointerUp(document, { pointerId: 3 });
    expect((document.querySelector('[data-window-id="work"]') as HTMLElement).style.transform).toBe(original);
    unmount();

    expect(media.query.removeEventListener).toHaveBeenCalled();
    expect(ResizeObserverMock.instances[0].disconnect).toHaveBeenCalledOnce();
  });

  it('uses legacy media listeners and returns focus to main when a disappearing frame has no dock control', async () => {
    const media = installFinePointer(true, true);
    const user = userEvent.setup();
    const { unmount } = renderLayerWithoutDock();

    await user.click(screen.getByRole('region', { name: 'About' }));
    await user.click(screen.getByRole('button', { name: 'Close About' }));
    expect(document.getElementById('main-content')).toHaveFocus();
    unmount();

    expect(media.query.addListener).toHaveBeenCalledOnce();
    expect(media.query.removeListener).toHaveBeenCalledOnce();
  });
});
