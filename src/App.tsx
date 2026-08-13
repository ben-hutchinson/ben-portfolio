import { ErrorBoundary } from './components/ErrorBoundary';
import { PortfolioRoot } from './app/PortfolioRoot';

export default function App() {
  return <ErrorBoundary><PortfolioRoot /></ErrorBoundary>;
}
