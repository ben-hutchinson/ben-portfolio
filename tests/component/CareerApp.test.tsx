import { fireEvent, render, screen } from '@testing-library/react';
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
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    matches: query === '(pointer: fine)' || (query === '(prefers-reduced-motion: reduce)' && reducedMotion),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })));
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
