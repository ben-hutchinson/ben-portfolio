import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PortfolioProvider } from '../../src/app/PortfolioContext';
import { PortfolioShell } from '../../src/shell/PortfolioShell';

function renderShell(hash = '#desktop') {
  window.history.replaceState(null, '', hash);
  return render(<PortfolioProvider><PortfolioShell /></PortfolioProvider>);
}

afterEach(() => {
  vi.restoreAllMocks();
  window.history.replaceState(null, '', '#desktop');
});

describe('PortfolioShell', () => {
  it('provides the shell landmarks and one canonical recruiter claim in the window layer', () => {
    renderShell();

    expect(screen.getByRole('banner')).toBeVisible();
    expect(screen.queryByRole('navigation', { name: /primary navigation/i })).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Portfolio applications' })).toBeVisible();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    expect(screen.getByRole('contentinfo')).toBeVisible();
    expect(screen.getByText('Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes')).toBeVisible();
    expect(screen.getAllByText('Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes')).toHaveLength(1);
    expect(screen.getByRole('region', { name: 'About' })).toBeVisible();
    expect(screen.getByRole('region', { name: 'Work' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Work' })).toHaveAttribute('data-dock-app-id', 'work');
    expect(screen.getByRole('button', { name: 'Career' })).toHaveAttribute('data-dock-app-id', 'career');
  });

  it('keeps decorative shell visuals outside the accessibility tree and renders without motion dependencies', () => {
    renderShell();

    expect(document.querySelector('[aria-hidden="true"]')).not.toBeNull();
    expect(screen.getByRole('main')).toBeVisible();
  });

  it('uses one polite atomic live region that is initially empty and announces a meaningful action once', async () => {
    const user = userEvent.setup();
    renderShell();

    const liveRegion = screen.getByRole('status');
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    expect(liveRegion).toBeEmptyDOMElement();

    await user.click(screen.getByRole('button', { name: 'Career' }));
    expect(liveRegion).toHaveTextContent(/career/i);
    expect(screen.getAllByRole('status')).toHaveLength(2);
    expect(screen.getByRole('status', { name: 'Current career stage' })).toHaveTextContent(
      '2022 — Technology Graduate',
    );
  });

  it('converges direct hash navigation and dock intent on the same observable Career state', async () => {
    const user = userEvent.setup();
    const { unmount } = renderShell('#career');

    expect(window.location.hash).toBe('#career');
    expect(screen.getByRole('region', { name: 'Career' })).toBeVisible();
    unmount();
    renderShell();

    await user.click(screen.getByRole('button', { name: 'Career' }));
    expect(window.location.hash).toBe('#career');
    expect(screen.getByRole('region', { name: 'Career' })).toBeVisible();
  });

  it('keeps shell navigation and persistent actions in a natural keyboard order', async () => {
    const defaultMatchMedia = window.matchMedia;
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      ...defaultMatchMedia(query),
      matches: query === '(min-width: 768px) and (pointer: fine)',
    }));
    const user = userEvent.setup();
    renderShell();

    for (const [role, name] of [
      ['link', 'Skip to main content'],
      ['button', 'Open About'],
      ['button', 'Open Career'],
      ['button', 'Open Work'],
      ['button', 'Close About'],
      ['button', 'Minimize About'],
      ['button', 'Maximize About'],
      ['region', 'About content'],
      ['button', 'Close Work'],
      ['button', 'Minimize Work'],
      ['button', 'Maximize Work'],
      ['region', 'Work content'],
      ['button', 'View Work'],
      ['button', 'Reset layout'],
      ['textbox', 'Portfolio command'],
      ['button', 'Run command'],
      ['button', 'About'],
      ['button', 'Work'],
      ['button', 'Career'],
      ['button', 'Projects'],
      ['button', 'Contact'],
      ['link', 'GitHub'],
      ['link', 'LinkedIn'],
      ['link', 'Download CV'],
    ] as const) {
      await user.tab();
      expect(screen.getByRole(role, { name })).toHaveFocus();
    }
  });
});
