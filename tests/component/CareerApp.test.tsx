import { fireEvent, render, screen } from '@testing-library/react';
import { hasReducedMotionListener, prefersReducedMotion } from 'motion-dom';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PortfolioProvider, usePortfolio } from '../../src/app/PortfolioContext';
import { careerStages } from '../../src/data/career';
import { PortfolioShell } from '../../src/shell/PortfolioShell';

const directYears = ['2022', '2024', '2025', 'Now'] as const;

function StateProbe() {
  const { state } = usePortfolio();
  return <output aria-label="portfolio state">{JSON.stringify(state)}</output>;
}

function installMedia(reducedMotion = false) {
  hasReducedMotionListener.current = false;
  prefersReducedMotion.current = null;
  let reducedMotionEnabled = reducedMotion;
  const mediaQueries = new Map<string, MediaQueryList>();
  const listeners = new Map<string, Set<(event: MediaQueryListEvent) => void>>();

  const matches = (query: string) => query === '(pointer: fine)'
    || (query === '(prefers-reduced-motion)' && reducedMotionEnabled);
  const notify = (query: string) => {
    const event = { matches: matches(query), media: query } as MediaQueryListEvent;
    for (const listener of listeners.get(query) ?? []) listener(event);
    mediaQueries.get(query)?.onchange?.(event);
  };

  vi.stubGlobal('matchMedia', vi.fn((query: string) => {
    const existing = mediaQueries.get(query);
    if (existing !== undefined) return existing;

    const queryListeners = new Set<(event: MediaQueryListEvent) => void>();
    listeners.set(query, queryListeners);
    const mediaQuery = {
      get matches() { return matches(query); },
      media: query,
      onchange: null,
      addEventListener: (type: string, listener: EventListenerOrEventListenerObject | null) => {
        if (type === 'change' && typeof listener === 'function') queryListeners.add(listener as (event: MediaQueryListEvent) => void);
      },
      removeEventListener: (type: string, listener: EventListenerOrEventListenerObject | null) => {
        if (type === 'change' && typeof listener === 'function') queryListeners.delete(listener as (event: MediaQueryListEvent) => void);
      },
      addListener: (listener: (event: MediaQueryListEvent) => void) => queryListeners.add(listener),
      removeListener: (listener: (event: MediaQueryListEvent) => void) => queryListeners.delete(listener),
      dispatchEvent: (event: Event) => {
        for (const listener of queryListeners) listener(event as MediaQueryListEvent);
        return true;
      },
    } as MediaQueryList;
    mediaQueries.set(query, mediaQuery);
    return mediaQuery;
  }));

  return {
    setReducedMotion(next: boolean) {
      if (reducedMotionEnabled === next) return;
      reducedMotionEnabled = next;
      notify('(prefers-reduced-motion)');
    },
  };
}

function renderCareer(reducedMotion = false) {
  installMedia(reducedMotion);
  window.history.replaceState(null, '', '#career');
  return render(
    <PortfolioProvider>
      <PortfolioShell />
      <StateProbe />
    </PortfolioProvider>,
  );
}

function state() {
  return JSON.parse(screen.getByRole('status', { name: 'portfolio state' }).textContent ?? '{}') as {
    activeCareerStageId: string;
    route: { kind: string };
  };
}

afterEach(() => {
  hasReducedMotionListener.current = false;
  prefersReducedMotion.current = null;
  vi.unstubAllGlobals();
  window.history.replaceState(null, '', '#desktop');
});

describe('Career.app RED contract', () => {
  it('renders the first canonical stage and a native labelled 0..3 range', () => {
    renderCareer();

    const range = screen.getByRole('slider', { name: 'Career stage' });
    expect(range).toHaveAttribute('min', '0');
    expect(range).toHaveAttribute('max', '3');
    expect(range).toHaveAttribute('step', '1');
    expect(range).toHaveValue('0');
    expect(range).toHaveAttribute('aria-valuetext', '2022 — Technology Graduate');
    expect(screen.getByText(careerStages[0].year, { exact: true })).toBeVisible();
    expect(screen.getByText(careerStages[0].role, { exact: true })).toBeVisible();
    expect(screen.getByRole('heading', { name: careerStages[0].headline })).toBeVisible();
    expect(screen.getByText(careerStages[0].evidence, { exact: true })).toBeVisible();
    expect(screen.getByText(careerStages[0].description, { exact: true })).toBeVisible();
  });

  it('names the focusable Career stage viewport from the stable timeline heading', () => {
    renderCareer();

    const viewport = screen.getByTestId('career-stage').parentElement;
    expect(viewport).not.toBeNull();
    expect(viewport).toHaveAttribute('tabindex', '0');
    expect(viewport).toHaveAttribute('role', 'region');
    expect(viewport).toHaveAttribute('aria-labelledby', 'career-timeline-heading');
    expect(screen.getByRole('heading', { name: 'Career timeline' })).toHaveAttribute('id', 'career-timeline-heading');
  });

  it('offers the four direct year buttons and keeps their pressed state synchronized', async () => {
    const user = userEvent.setup();
    renderCareer();

    for (const year of directYears) expect(screen.getByRole('button', { name: year })).toBeVisible();
    await user.click(screen.getByRole('button', { name: '2025' }));

    expect(screen.getByRole('button', { name: '2025' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '2022' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('slider', { name: 'Career stage' })).toHaveValue('2');
    expect(state()).toMatchObject({ route: { kind: 'career' }, activeCareerStageId: 'associate' });
  });

  it('uses the range ArrowRight path to dispatch the reducer stage selection without a local mirror', () => {
    renderCareer();

    const range = screen.getByRole('slider', { name: 'Career stage' });
    range.focus();
    fireEvent.keyDown(range, { key: 'ArrowRight' });
    fireEvent.input(range, { target: { value: '1' } });

    expect(range).toHaveValue('1');
    expect(range).toHaveAttribute('aria-valuetext', '2024 — Degree Work: Observability Improvements');
    expect(state().activeCareerStageId).toBe('observability');
    expect(screen.getByRole('heading', { name: careerStages[1].headline })).toBeVisible();
  });

  it('atomically replaces all visible and accessible stage content during rapid direct selection', async () => {
    const user = userEvent.setup();
    renderCareer();

    await user.click(screen.getByRole('button', { name: 'Now' }));
    await user.click(screen.getByRole('button', { name: '2024' }));

    const liveStatus = screen.getByRole('status', { name: 'Current career stage' });
    expect(liveStatus).toHaveTextContent('2024 — Degree Work: Observability Improvements');
    expect(screen.getByRole('heading', { name: careerStages[1].headline })).toBeVisible();
    expect(screen.queryByText(careerStages[3].headline, { exact: true })).not.toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Career stage' })).toHaveAttribute(
      'aria-valuetext',
      '2024 — Degree Work: Observability Improvements',
    );
  });

  it('swaps the same controlled stage immediately in reduced-motion mode', async () => {
    const user = userEvent.setup();
    renderCareer(true);

    await user.click(screen.getByRole('button', { name: 'Now' }));

    const stage = screen.getByTestId('career-stage');
    expect(stage).toHaveAttribute('data-reduced-motion', 'true');
    expect(stage).toHaveAttribute('data-motion-duration-ms', '0');
    expect(screen.getByRole('heading', { name: careerStages[3].headline })).toBeVisible();
    expect(state().activeCareerStageId).toBe('skao');
  });
});
