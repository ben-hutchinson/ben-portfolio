import { usePortfolio } from '../app/PortfolioContext';

export function LiveRegion() {
  const { state } = usePortfolio();
  const message = state.route.kind === 'desktop' ? '' : `${state.focusedAppId} selected`;

  return (
    <div className="srOnly" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
}
