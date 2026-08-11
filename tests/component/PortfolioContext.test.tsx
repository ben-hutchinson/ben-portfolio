import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { PortfolioProvider, usePortfolio } from '../../src/app/PortfolioContext';

describe('PortfolioContext', () => {
  it('throws the exact error outside the provider', () => {
    expect(() => renderHook(() => usePortfolio())).toThrow('usePortfolio must be used within a PortfolioProvider');
  });

  it('exposes reducer state and dispatch through the provider', () => {
    const wrapper = ({ children }: { children: ReactNode }) => <PortfolioProvider>{children}</PortfolioProvider>;
    const { result } = renderHook(() => usePortfolio(), { wrapper });

    expect(result.current.state.route).toEqual({ kind: 'desktop' });
    act(() => {
      result.current.dispatch({ type: 'SELECT_PROJECT', projectId: 'pokeleximon' });
    });
    expect(result.current.state).toMatchObject({
      route: { kind: 'project', projectId: 'pokeleximon' },
      activeProjectId: 'pokeleximon',
      focusedAppId: 'projects',
    });
  });
});
