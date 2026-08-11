import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PortfolioProvider, usePortfolio } from '../../src/app/PortfolioContext';
import { Dock } from '../../src/shell/Dock';

function StateProbe() {
  const { state } = usePortfolio();
  return <output aria-label="shell state">{JSON.stringify(state.route)}</output>;
}

function renderDock(hash = '#desktop') {
  window.history.replaceState(null, '', hash);
  return render(<PortfolioProvider><Dock /><StateProbe /></PortfolioProvider>);
}

afterEach(() => {
  vi.unstubAllEnvs();
  window.history.replaceState(null, '', '#desktop');
});

describe('Dock', () => {
  it('keeps the six application buttons and CV control in the stable dock order', () => {
    renderDock();

    const controls = screen.getAllByRole('button').map((control) => control.textContent?.trim());
    expect(controls).toEqual(['About', 'Work', 'Career', 'Projects', 'Contact', 'Command']);
    expect(screen.getByRole('link', { name: /download cv/i })).toBeVisible();
  });

  it('maps application controls through the shared reducer and exposes a text or ARIA active state', async () => {
    const user = userEvent.setup();
    renderDock();

    await user.click(screen.getByRole('button', { name: 'Work' }));
    expect(screen.getByRole('button', { name: 'Work' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('status', { name: /shell state/i })).toHaveTextContent('work');
    expect(window.location.hash).toBe('#work');

    await user.click(screen.getByRole('button', { name: 'Command' }));
    expect(screen.getByRole('button', { name: 'Command' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('status', { name: /shell state/i })).toHaveTextContent('work');
  });

  it('provides a base-safe CV download and verified safe external profile links', () => {
    vi.stubEnv('BASE_URL', '/ben-portfolio/');
    renderDock();

    const cv = screen.getByRole('link', { name: /download cv/i });
    expect(cv).toHaveAttribute('href', '/ben-portfolio/cv/ben-hutchinson-cv.pdf');
    expect(cv).toHaveAttribute('download', expect.stringMatching(/ben-hutchinson.*cv/i));

    for (const name of ['GitHub', 'LinkedIn']) {
      const link = screen.getByRole('link', { name: new RegExp(name, 'i') });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
      expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
    }
  });
});
