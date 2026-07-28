import { LazyMotion, domAnimation } from 'framer-motion';
import { screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { profile } from '@/data/profile';
import { HeroSection } from './HeroSection';

beforeAll(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      readonly root = null;
      readonly rootMargin = '';
      readonly thresholds = [];

      disconnect() {}
      observe() {}
      takeRecords() {
        return [];
      }
      unobserve() {}
    },
  );
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe('HeroSection', () => {
  it('introduces the mission and links to the portfolio evidence', () => {
    renderWithProviders(
      <LazyMotion features={domAnimation}>
        <HeroSection benHeroSrc="/ben-command.png" />
      </LazyMotion>,
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /engineer the calm/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /explore mission logs/i }),
    ).toHaveAttribute('href', '#work');

    for (const proof of profile.proof) {
      expect(screen.getByText(proof)).toBeInTheDocument();
    }
  });
});
