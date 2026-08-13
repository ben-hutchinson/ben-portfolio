import { createContext, useCallback, useContext, useReducer, useState, type Dispatch, type ReactNode } from 'react';
import { useHashNavigation } from '../hooks/useHashNavigation';
import { portfolioReducer, type PortfolioAction } from './portfolioReducer';
import { createInitialPortfolioState, type PortfolioState } from './portfolioState';

interface PortfolioContextValue {
  readonly state: PortfolioState;
  readonly dispatch: Dispatch<PortfolioAction>;
  readonly hashRecoveryMessage: string;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { readonly children: ReactNode }) {
  const [state, dispatch] = useReducer(portfolioReducer, undefined, createInitialPortfolioState);
  const [hashRecoveryMessage, setHashRecoveryMessage] = useState('');
  const onInvalidHash = useCallback(() => {
    setHashRecoveryMessage('That portfolio address was not found. Recovered to Desktop.');
  }, []);
  const onKnownHash = useCallback(() => setHashRecoveryMessage(''), []);
  useHashNavigation(state.route, dispatch, onInvalidHash, onKnownHash);
  return <PortfolioContext.Provider value={{ state, dispatch, hashRecoveryMessage }}>{children}</PortfolioContext.Provider>;
}

// The locked context module intentionally colocates its provider and consumer hook.
// eslint-disable-next-line react-refresh/only-export-components
export function usePortfolio(): PortfolioContextValue {
  const context = useContext(PortfolioContext);
  if (context === null) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return context;
}
