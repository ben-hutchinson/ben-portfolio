import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../../src/App';
import { PortfolioProvider } from '../../src/app/PortfolioContext';
import { WorkApp } from '../../src/apps/work/WorkApp';

describe('Portfolio OS foundation', () => {
  it('keeps Ben Hutchinson visible as the initial semantic heading', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Ben Hutchinson' })).toBeVisible();
  });

  it('removes the former primary navigation and status copy from the menu bar', () => {
    render(<App />);

    const menuBar = screen.getByRole('banner');
    expect(screen.queryByRole('navigation', { name: 'Primary navigation' })).not.toBeInTheDocument();
    expect(within(menuBar).queryByText('Mid-level platform engineer', { exact: true })).not.toBeInTheDocument();
    expect(within(menuBar).queryByText(/open to platform and backend/i)).not.toBeInTheDocument();
  });

  it('retains the Kernel mark and location in the simplified menu bar', () => {
    render(<App />);

    expect(screen.getByTestId('portfolio-os-mark')).toBeInTheDocument();
    expect(screen.getByText('Manchester, UK')).toBeVisible();
  });

  it('renders icon-and-label dock utilities with the CV download contract', () => {
    render(<App />);

    const github = screen.getByRole('link', { name: 'GitHub' });
    const linkedIn = screen.getByRole('link', { name: 'LinkedIn' });
    const cv = screen.getByRole('link', { name: 'Download CV' });

    expect(github.querySelector('svg')).not.toBeNull();
    expect(linkedIn.querySelector('svg')).not.toBeNull();
    expect(cv.querySelector('svg')).not.toBeNull();
    expect(cv).toHaveAttribute('download', 'ben-hutchinson-cv.pdf');
  });

  it('groups the CV action beside GitHub and LinkedIn rather than with applications', () => {
    render(<App />);

    const github = screen.getByRole('link', { name: 'GitHub' });
    const linkedIn = screen.getByRole('link', { name: 'LinkedIn' });
    const cv = screen.getByRole('link', { name: 'Download CV' });

    expect(github.parentElement).toBe(linkedIn.parentElement);
    expect(linkedIn.parentElement).toBe(cv.parentElement);
  });

  it('removes the decorative desktop wallpaper statement', () => {
    render(<App />);

    expect(screen.queryByText('BUILD CLEAR PATHS')).not.toBeInTheDocument();
  });

  it('keeps the canonical flagship impact visible without interaction', () => {
    render(<App />);

    expect(
      screen.getByText('Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes', {
        exact: true,
      }),
    ).toBeVisible();
  });

  it('does not render a technology list or named Work technologies in the case study', () => {
    render(<PortfolioProvider><WorkApp /></PortfolioProvider>);

    expect(screen.queryByRole('list', { name: /technologies used/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('list', { name: /technologies/i })).not.toBeInTheDocument();
    expect(screen.queryByText('Python', { exact: true })).not.toBeInTheDocument();
    expect(screen.queryByText('uv', { exact: true })).not.toBeInTheDocument();
    expect(screen.queryByText('ruff', { exact: true })).not.toBeInTheDocument();
  });

  it('mounts the compact terminal on Desktop without retaining Command-window UI', () => {
    render(<App />);

    const terminal = screen.getByTestId('micro-terminal');
    expect(terminal).toHaveAttribute('data-micro-terminal');
    expect(terminal).toHaveTextContent('portfolio command');
    expect(within(terminal).getByRole('textbox', { name: 'Portfolio command' })).toBeVisible();
    expect(screen.queryByRole('button', { name: /^Command$/ })).not.toBeInTheDocument();
    expect(screen.queryByText('Optional shortcut')).not.toBeInTheDocument();
    expect(screen.queryByText('Command palette')).not.toBeInTheDocument();
  });
});
