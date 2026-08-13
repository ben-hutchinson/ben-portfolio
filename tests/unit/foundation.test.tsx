import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../../src/App';

describe('Portfolio OS foundation', () => {
  it('keeps Ben Hutchinson visible as the initial semantic heading', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Ben Hutchinson' })).toBeVisible();
  });

  it('removes the former primary navigation and status copy from the menu bar', () => {
    render(<App />);

    expect(screen.queryByRole('navigation', { name: 'Primary navigation' })).not.toBeInTheDocument();
    expect(screen.queryByText('Mid-level platform engineer', { exact: true })).not.toBeInTheDocument();
    expect(screen.queryByText(/open to platform and backend/i)).not.toBeInTheDocument();
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
      screen.getByText('Migrated 50+ repositories and reduced average build time by four minutes.', {
        exact: true,
      }),
    ).toBeVisible();
  });
});
