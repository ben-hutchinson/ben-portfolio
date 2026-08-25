import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useMediaQuery } from '../../src/hooks/useMediaQuery';

function createMediaQueryList(initialMatches: boolean) {
  let matches = initialMatches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const addEventListener = vi.fn((event: string, listener: EventListenerOrEventListenerObject) => {
    if (event === 'change' && typeof listener === 'function') listeners.add(listener as (event: MediaQueryListEvent) => void);
  });
  const removeEventListener = vi.fn((event: string, listener: EventListenerOrEventListenerObject) => {
    if (event === 'change' && typeof listener === 'function') listeners.delete(listener as (event: MediaQueryListEvent) => void);
  });
  const media = {
    matches,
    media: '(max-width: 767px)',
    onchange: null,
    addEventListener,
    removeEventListener,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    setMatches(nextMatches: boolean) {
      matches = nextMatches;
      Object.defineProperty(media, 'matches', { configurable: true, value: matches });
      for (const listener of listeners) listener({ matches, media: media.media } as MediaQueryListEvent);
    },
  } as MediaQueryList & { setMatches: (matches: boolean) => void };
  return { media, addEventListener, removeEventListener };
}

afterEach(() => vi.unstubAllGlobals());

describe('useMediaQuery', () => {
  it('uses false as its deterministic non-browser default', () => {
    vi.stubGlobal('matchMedia', undefined);

    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'));

    expect(result.current).toBe(false);
  });

  it('updates from the browser media event and removes the same listener on unmount', () => {
    const { media, addEventListener, removeEventListener } = createMediaQueryList(false);
    vi.stubGlobal('matchMedia', vi.fn(() => media));

    const { result, unmount } = renderHook(() => useMediaQuery('(max-width: 767px)'));
    expect(result.current).toBe(false);

    act(() => media.setMatches(true));
    expect(result.current).toBe(true);

    unmount();
    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    expect(removeEventListener.mock.calls[0]?.[1]).toBe(addEventListener.mock.calls[0]?.[1]);
  });
});
