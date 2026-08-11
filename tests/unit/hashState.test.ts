import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { parseHash, serializeHash } from '../../src/app/hashState';
import type { PortfolioRoute } from '../../src/app/portfolioState';
import { useHashNavigation } from '../../src/hooks/useHashNavigation';

const exactRoutes: readonly [string, PortfolioRoute][] = [
  ['#desktop', { kind: 'desktop' }],
  ['#work', { kind: 'work' }],
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

  it.each(['', '#WORK', '#projects/', '#projects/Pokeleximon', '#projects/safelog/more', '#contact?hello=true', '#about'])(
    'recovers invalid hash %s to desktop without accepting it',
    (hash) => expect(parseHash(hash)).toEqual({ route: { kind: 'desktop' }, isKnown: false }),
  );
});

describe('useHashNavigation', () => {
  it('normalizes an invalid mount hash, dispatches desktop once, synchronizes state changes, deduplicates writes, and removes its listener', () => {
    window.history.replaceState(null, '', '#not-a-route');
    const dispatch = vi.fn();
    const addListener = vi.spyOn(window, 'addEventListener');
    const removeListener = vi.spyOn(window, 'removeEventListener');

    const { rerender, unmount } = renderHook(
      ({ route }) => useHashNavigation(route, dispatch),
      { initialProps: { route: { kind: 'desktop' } as PortfolioRoute } },
    );

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({ type: 'NAVIGATE', route: { kind: 'desktop' } });
    expect(window.location.hash).toBe('#desktop');
    expect(addListener).toHaveBeenCalledWith('hashchange', expect.any(Function));

    act(() => {
      window.location.hash = '#career';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(dispatch).toHaveBeenLastCalledWith({ type: 'NAVIGATE', route: { kind: 'career' } });

    rerender({ route: { kind: 'contact' } });
    expect(window.location.hash).toBe('#contact');
    const writesAfterContact = dispatch.mock.calls.length;
    rerender({ route: { kind: 'contact' } });
    expect(dispatch).toHaveBeenCalledTimes(writesAfterContact);

    unmount();
    expect(removeListener).toHaveBeenCalledWith('hashchange', expect.any(Function));
  });
});
