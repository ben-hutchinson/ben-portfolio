import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import { useHashNavigation } from '../hooks/useHashNavigation';
import { portfolioReducer, type PortfolioAction } from './portfolioReducer';
import { createInitialPortfolioState, type PortfolioState } from './portfolioState';

interface PortfolioContextValue {
  readonly state: PortfolioState;
  readonly dispatch: Dispatch<PortfolioAction>;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { readonly children: ReactNode }) {
  const [state, dispatch] = useReducer(portfolioReducer, undefined, createInitialPortfolioState);
  useHashNavigation(state.route, dispatch);
  return <PortfolioContext.Provider value={{ state, dispatch }}>{children}</PortfolioContext.Provider>;
}

// The locked context module intentionally colocates its provider and consumer hook.
// eslint-disable-next-line react-refresh/only-export-components
export function usePortfolio(): PortfolioContextValue {
  const context = useContext(PortfolioContext);
  if (context === null) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return context;
}
