import { usePortfolio } from '../app/PortfolioContext';

export function LiveRegion() {
  const { state, hashRecoveryMessage } = usePortfolio();
  const message = hashRecoveryMessage || (state.route.kind === 'desktop' ? '' : `${state.focusedAppId} selected`);

  return (
    <div className="srOnly" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
}
