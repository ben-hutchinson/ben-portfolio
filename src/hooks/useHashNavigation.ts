import { useEffect, useRef } from 'react';
import type { Dispatch } from 'react';
import { parseHash, serializeHash } from '../app/hashState';
import type { PortfolioAction } from '../app/portfolioReducer';
import type { PortfolioRoute } from '../app/portfolioState';

export function useHashNavigation(route: PortfolioRoute, dispatch: Dispatch<PortfolioAction>): void {
  const initialRouteHashRef = useRef<string | null>(null);
  const hasReconciledInitialHashRef = useRef(false);

  useEffect(() => {
    const navigateFromHash = () => {
      const parsed = parseHash(window.location.hash);
      if (!parsed.isKnown) window.history.replaceState(null, '', '#desktop');
      if (initialRouteHashRef.current === null) {
        initialRouteHashRef.current = serializeHash(parsed.route);
      }
      dispatch({ type: 'NAVIGATE', route: parsed.route });
    };

    navigateFromHash();
    window.addEventListener('hashchange', navigateFromHash);
    return () => window.removeEventListener('hashchange', navigateFromHash);
  }, [dispatch]);

  useEffect(() => {
    const hash = serializeHash(route);
    if (!hasReconciledInitialHashRef.current) {
      if (hash === initialRouteHashRef.current) hasReconciledInitialHashRef.current = true;
      return;
    }
    if (window.location.hash !== hash) window.location.hash = hash;
  }, [route]);
}
