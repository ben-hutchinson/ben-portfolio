import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PortfolioProvider } from '../../src/app/PortfolioContext';
import { flagshipWork } from '../../src/data/work';
import { PortfolioShell } from '../../src/shell/PortfolioShell';

function renderWork() {
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })));
  window.history.replaceState(null, '', '#work');
  return render(<PortfolioProvider><PortfolioShell /></PortfolioProvider>);
}

function workFrame(): HTMLElement {
  const frame = document.querySelector<HTMLElement>('[data-window-id="work"]');
  if (frame === null) throw new Error('Work frame was not rendered');
  return frame;
}

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState(null, '', '#desktop');
});

describe('Work.app', () => {
  it('maps a featured catalogue entry to a named direct case-study route and supports keyboard return', async () => {
    const user = userEvent.setup();
    renderWork();

    const frame = workFrame();
    expect(within(frame).getByText(/featured case study/i)).toBeVisible();
    expect(within(frame).getByText(flagshipWork.context, { exact: true })).toBeVisible();
    expect(within(frame).getByText(flagshipWork.result, { exact: true })).toBeVisible();
    const open = within(frame).getByRole('button', { name: `Open ${flagshipWork.title} case study` });
    open.focus();
    await user.keyboard('{Enter}');

    expect(window.location.hash).toBe('#work/uv-ruff-migration');
    expect(within(workFrame()).getByRole('heading', { level: 1, name: flagshipWork.title })).toBeVisible();
    expect(within(workFrame()).getByText('The shared developer workflow became faster across the migrated repositories.')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Back to work' }));
    expect(window.location.hash).toBe('#work');
  });

  it('presents the flagship case file with a scoped accessible outline', () => {
    renderWork();
    const frame = workFrame();
    expect(within(frame).getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(within(frame).getByRole('heading', { level: 1 })).toHaveTextContent(flagshipWork.title);
    expect(frame.querySelector('[data-window-title]')).toHaveTextContent('Work');
    expect(within(frame).getAllByRole('heading', { level: 2 }).map(({ textContent }) => textContent)).toEqual([
      'Problem', 'Ownership', 'Approach', 'Rollout', 'Outcome', 'Public detail',
    ]);
  });

  it('uses only canonical evidence and states the exact result once', () => {
    renderWork();
    const frame = workFrame();
    expect(within(frame).getAllByText(flagshipWork.result, { exact: true })).toHaveLength(1);
    expect(frame).toHaveTextContent('Poetry');
    for (const technology of ['Python', 'uv', 'ruff', 'Makefile']) expect(frame).toHaveTextContent(technology);
    expect(frame).toHaveTextContent('base-Makefile');
    expect(frame).toHaveTextContent(flagshipWork.publicDetail);
    expect(frame).not.toHaveTextContent(/annual|per year|hours saved/i);
  });
});
