import { LazyMotion, domAnimation } from 'motion/react';
import { PortfolioProvider } from './PortfolioContext';
import { PortfolioShell } from '../shell/PortfolioShell';

export function PortfolioRoot() {
  return (
    <LazyMotion features={domAnimation} strict>
      <PortfolioProvider>
        <PortfolioShell />
      </PortfolioProvider>
    </LazyMotion>
  );
}
