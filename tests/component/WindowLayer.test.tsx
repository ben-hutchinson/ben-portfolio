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

function installFinePointer(matches = true) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const query = {
    matches,
    media: '(pointer: fine)',
    onchange: null,
    addEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener)),
    removeEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener)),
    addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList;
  const matchMedia = vi.fn(() => query);
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: matchMedia });
  return { query, matchMedia, listeners };
}

function expectFocusInFrame(title: string) {
  const frame = screen.getByRole('region', { name: title });
  const firstControl = screen.getByRole('button', { name: `Close ${title}` });
  expect([screen.getByRole('heading', { name: title }), firstControl]).toContain(document.activeElement);
  expect(frame).toContainElement(document.activeElement as HTMLElement);
}

function StateProbe() {
  const { state } = usePortfolio();
  return <output aria-label="portfolio state">{JSON.stringify(state)}</output>;
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

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState(null, '', '#desktop');
  ResizeObserverMock.instances = [];
});

describe('WindowLayer', () => {
  it('keeps the fixed window source order even when focus changes visual stacking', async () => {
    installFinePointer();
    renderLayer();

    expect(WINDOW_APP_ORDER).toEqual(['about', 'work', 'career', 'projects', 'contact', 'command']);
    expect([...document.querySelectorAll('[data-window-id]')].map((node) => node.getAttribute('data-window-id')))
      .toEqual(['about', 'work', 'command']);
    const about = document.querySelector('[data-window-id="about"]') as HTMLElement;
    const command = document.querySelector('[data-window-id="command"]') as HTMLElement;
    expect(Number(command.style.zIndex)).toBeGreaterThan(Number(about.style.zIndex));

    await userEvent.setup().click(screen.getByRole('region', { name: 'About' }));
    expect([...document.querySelectorAll('[data-window-id]')].map((node) => node.getAttribute('data-window-id')))
      .toEqual(['about', 'work', 'command']);
    expect(Number(about.style.zIndex)).toBeGreaterThan(Number(command.style.zIndex));
  });

  it('renders the canonical flagship result exactly once and retains reset recovery when frames disappear', async () => {
    installFinePointer();
    const user = userEvent.setup();
    renderLayer();

    expect(screen.getAllByText(flagshipWork.result)).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Reset layout' })).toHaveAttribute('data-window-control', 'reset-layout');
    for (const app of ['about', 'work', 'command'] as const) {
      await user.click(screen.getByRole('button', { name: `Close ${app === 'about' ? 'About' : app === 'work' ? 'Work' : 'Command'}` }));
    }
    expect(document.querySelectorAll('[data-window-id]')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: 'Reset layout' }));
    expect([...document.querySelectorAll('[data-window-id]')].map((node) => node.getAttribute('data-window-id')))
      .toEqual(['about', 'work', 'command']);
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

    await user.click(screen.getByRole('button', { name: 'Maximize Work' }));
    expect(screen.getByRole('button', { name: 'Restore Work' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Restore Work' }));
    expect(screen.getByRole('button', { name: 'Maximize Work' })).toBeVisible();
    expect(window.location.hash).toBe('#desktop');
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
    expect(screen.getByRole('status', { name: 'portfolio state' })).toHaveTextContent('"work"');
    unmount();
    expect(observer.disconnect).toHaveBeenCalledOnce();
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
});
