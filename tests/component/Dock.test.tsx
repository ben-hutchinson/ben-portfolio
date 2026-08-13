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

  it('maps every application control through the shared reducer and exposes an ARIA active state', async () => {
    const user = userEvent.setup();
    renderDock();

    await user.click(screen.getByRole('button', { name: 'About' }));
    expect(screen.getByRole('button', { name: 'About' })).toHaveAttribute('aria-pressed', 'true');
    expect(window.location.hash).toBe('#desktop');

    for (const [label, hash] of [
      ['Work', '#work'],
      ['Career', '#career'],
      ['Projects', '#projects'],
      ['Contact', '#contact'],
    ]) {
      await user.click(screen.getByRole('button', { name: label }));
      expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true');
      expect(window.location.hash).toBe(hash);
    }

    await user.click(screen.getByRole('button', { name: 'Command' }));
    expect(screen.getByRole('button', { name: 'Command' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('status', { name: /shell state/i })).toHaveTextContent('contact');
    expect(window.location.hash).toBe('#contact');
  });

  it('keeps dock controls reachable in their visual reading order by keyboard', async () => {
    const user = userEvent.setup();
    renderDock();

    for (const name of ['About', 'Work', 'Career', 'Projects', 'Contact', 'Command', 'GitHub', 'LinkedIn', 'Download CV']) {
      await user.tab();
      expect(screen.getByRole(name === 'Download CV' || name === 'GitHub' || name === 'LinkedIn' ? 'link' : 'button', { name })).toHaveFocus();
    }
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
