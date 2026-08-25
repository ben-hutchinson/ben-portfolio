import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { parseHash, serializeHash } from '../../src/app/hashState';
import type { PortfolioRoute } from '../../src/app/portfolioState';
import { useHashNavigation } from '../../src/hooks/useHashNavigation';

const exactRoutes: readonly [string, PortfolioRoute][] = [
  ['#desktop', { kind: 'desktop' }],
  ['#work', { kind: 'work' }],
  ['#work/uv-ruff-migration', { kind: 'workDetail', workId: 'uv-ruff-migration' }],
  ['#career', { kind: 'career' }],
  ['#projects', { kind: 'projects' }],
  ['#projects/pokeleximon', { kind: 'project', projectId: 'pokeleximon' }],
  ['#projects/safelog', { kind: 'project', projectId: 'safelog' }],
  ['#contact', { kind: 'contact' }],
];

describe('hash state', () => {
  it.each(exactRoutes)('parses and serializes %s exactly', (hash, route) => {
    expect(parseHash(hash)).toEqual({ route, isKnown: true });
    expect(serializeHash(route)).toBe(hash);
  });

  it.each([
    '', '#WORK', '#projects/', '#projects/Pokeleximon', '#projects/safelog/more', '#contact?hello=true', '#about',
    '#work/', '#work/UV-RUFF-MIGRATION', '#work/uv-ruff-migration/', '#work/unknown',
    '#work/uv-ruff-migration/extra', '#work/uv-ruff-migration?x=1',
  ])(
    'recovers invalid hash %s to desktop without accepting it',
    (hash) => expect(parseHash(hash)).toEqual({ route: { kind: 'desktop' }, isKnown: false }),
  );
});

describe('useHashNavigation', () => {
  it('normalizes an invalid mount hash and recovers an invalid hashchange to desktop', () => {
    window.history.replaceState(null, '', '#not-a-route');
    const dispatch = vi.fn();
    const replaceState = vi.spyOn(window.history, 'replaceState');

    const { unmount } = renderHook(
      ({ route }) => useHashNavigation(route, dispatch),
      { initialProps: { route: { kind: 'desktop' } as PortfolioRoute } },
    );

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({ type: 'NAVIGATE', route: { kind: 'desktop' } });
    expect(window.location.hash).toBe('#desktop');
    expect(replaceState).toHaveBeenCalledWith(null, '', '#desktop');

    act(() => {
      window.history.replaceState(null, '', '#unknown-again');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(dispatch).toHaveBeenLastCalledWith({ type: 'NAVIGATE', route: { kind: 'desktop' } });
    expect(window.location.hash).toBe('#desktop');

    unmount();
    replaceState.mockRestore();
  });

  it('dispatches a supported mount and supported hashchange without recovery writes', () => {
    window.history.replaceState(null, '', '#work');
    const dispatch = vi.fn();
    const replaceState = vi.spyOn(window.history, 'replaceState');

    const { unmount } = renderHook(
      ({ route }) => useHashNavigation(route, dispatch),
      { initialProps: { route: { kind: 'desktop' } as PortfolioRoute } },
    );

    expect(dispatch).toHaveBeenCalledWith({ type: 'NAVIGATE', route: { kind: 'work' } });
    expect(replaceState).not.toHaveBeenCalled();

    act(() => {
      window.location.hash = '#career';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(dispatch).toHaveBeenLastCalledWith({ type: 'NAVIGATE', route: { kind: 'career' } });
    expect(replaceState).not.toHaveBeenCalled();

    unmount();
    replaceState.mockRestore();
  });

  it('writes state routes once and cleans up the exact registered hashchange listener', () => {
    window.history.replaceState(null, '', '#desktop');
    const dispatch = vi.fn();
    const addListener = vi.spyOn(window, 'addEventListener');
    const removeListener = vi.spyOn(window, 'removeEventListener');

    const { rerender, unmount } = renderHook(
      ({ route }) => useHashNavigation(route, dispatch),
      { initialProps: { route: { kind: 'desktop' } as PortfolioRoute } },
    );
    const hashListener = addListener.mock.calls.find(([eventName]) => eventName === 'hashchange')?.[1];
    expect(hashListener).toEqual(expect.any(Function));

    rerender({ route: { kind: 'contact' } });
    expect(window.location.hash).toBe('#contact');
    const dispatchesAfterContact = dispatch.mock.calls.length;
    rerender({ route: { kind: 'contact' } });
    expect(dispatch).toHaveBeenCalledTimes(dispatchesAfterContact);

    unmount();
    expect(removeListener).toHaveBeenCalledWith('hashchange', hashListener);
    addListener.mockRestore();
    removeListener.mockRestore();
  });
});
