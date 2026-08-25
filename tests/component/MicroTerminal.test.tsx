import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PortfolioProvider } from '../../src/app/PortfolioContext';
import { PortfolioShell } from '../../src/shell/PortfolioShell';

function renderTerminal(hash = '#desktop') {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  window.history.replaceState(null, '', hash);
  return render(<PortfolioProvider><PortfolioShell /></PortfolioProvider>);
}

function terminal() {
  return screen.getByTestId('micro-terminal');
}

function input() {
  return within(terminal()).getByRole('textbox', { name: 'Portfolio command' });
}

afterEach(() => { vi.unstubAllGlobals(); window.history.replaceState(null, '', '#desktop'); });

describe('MicroTerminal', () => {
  it('renders the permanent Desktop-only terminal with semantic hooks and no Command-window clutter', () => {
    renderTerminal();

    const surface = terminal();
    expect(surface).toHaveAttribute('data-micro-terminal');
    expect(surface).toHaveTextContent('portfolio command');
    expect(input()).toBeVisible();
    expect(within(surface).getByRole('button', { name: 'Run command' })).toBeVisible();
    expect(screen.queryByRole('button', { name: /^Command$/ })).not.toBeInTheDocument();
    expect(document.querySelector('[data-window-id="command"]')).toBeNull();
    expect(screen.queryByText('Optional shortcut')).not.toBeInTheDocument();
    expect(screen.queryByText('Command palette')).not.toBeInTheDocument();
    expect(within(surface).queryByRole('log')).not.toBeInTheDocument();
  });

  it('does not render outside the Desktop route', () => {
    renderTerminal('#career');

    expect(screen.queryByTestId('micro-terminal')).not.toBeInTheDocument();
  });

  it('shows only the latest inert result and clear removes it', async () => {
    const user = userEvent.setup();
    renderTerminal();

    await user.type(input(), 'carear{Enter}');
    expect(within(terminal()).getByRole('status')).toHaveTextContent('Did you mean “career”?');
    await user.type(input(), '<script>alert(1)</script>{Enter}');
    expect(within(terminal()).getByRole('status')).toHaveTextContent('<script>alert(1)</script>');
    expect(within(terminal()).getByRole('status')).not.toHaveTextContent('Did you mean “career”?');
    expect(document.querySelector('script')).toBeNull();
    await user.type(input(), 'clear{Enter}');
    expect(within(terminal()).queryByRole('status')).not.toBeInTheDocument();
  });

  it('dispatches parser actions and retains the base-safe CV download', async () => {
    const user = userEvent.setup();
    renderTerminal();

    await user.type(input(), 'cv{Enter}');
    const cv = within(terminal()).getByRole('link', { name: 'Download CV' });
    expect(cv).toHaveAttribute('download', 'ben-hutchinson-cv.pdf');
    expect(cv).toHaveAttribute('href', `${import.meta.env.BASE_URL}cv/ben-hutchinson-cv.pdf`);

    await user.type(input(), 'reset{Enter}');
    expect(within(terminal()).getByRole('status')).toHaveTextContent('Desktop layout reset.');
    await user.type(input(), 'career{Enter}');
    expect(window.location.hash).toBe('#career');
    expect(screen.getByRole('region', { name: 'Career' })).toBeVisible();
    expect(screen.queryByTestId('micro-terminal')).not.toBeInTheDocument();
  });
});
