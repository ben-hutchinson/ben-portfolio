import { useEffect, useState } from 'react';

function matchesMediaQuery(query: string): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia(query).matches;
}

/**
 * Reads a browser media query without making server and test rendering depend
 * on a browser-only API. A missing matchMedia API always resolves to false.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => matchesMediaQuery(query));

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      setMatches(false);
      return undefined;
    }

    const media = window.matchMedia(query);
    const updateMatches = (event?: MediaQueryListEvent) => setMatches(event?.matches ?? media.matches);
    updateMatches();

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', updateMatches);
      return () => media.removeEventListener('change', updateMatches);
    }

    media.addListener(updateMatches);
    return () => media.removeListener(updateMatches);
  }, [query]);

  return matches;
}
