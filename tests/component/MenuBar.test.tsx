import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { PortfolioProvider } from '../../src/app/PortfolioContext';
import { MenuBar } from '../../src/shell/MenuBar';

function renderMenu(hash = '#desktop') {
  window.history.replaceState(null, '', hash);
  return render(
    <PortfolioProvider>
      <MenuBar />
      <main id="main-content" tabIndex={-1}>Portfolio content</main>
    </PortfolioProvider>,
  );
}

afterEach(() => window.history.replaceState(null, '', '#desktop'));

describe('MenuBar', () => {
  it('keeps focus on main and the Portfolio route after the skip-link hash event', async () => {
    const user = userEvent.setup();
    const modelBrowserFragmentFocus = () => {
      if (window.location.hash === '#main-content') document.activeElement?.blur();
    };
    window.addEventListener('hashchange', modelBrowserFragmentFocus);

    try {
      renderMenu();

      await user.tab();
      const skipLink = screen.getByRole('link', { name: /skip to main content/i });
      expect(skipLink).toHaveFocus();
      expect(skipLink).toHaveAttribute('href', '#main-content');

      await user.click(skipLink);
      window.dispatchEvent(new HashChangeEvent('hashchange'));

      await waitFor(() => {
        expect(window.location.hash).toBe('#desktop');
        expect(screen.getByRole('main')).toHaveFocus();
      });
    } finally {
      window.removeEventListener('hashchange', modelBrowserFragmentFocus);
    }
  });

  it('exposes the labelled primary routes and identifies the active base route', () => {
    renderMenu('#career');

    const navigation = screen.getByRole('navigation', { name: /primary navigation/i });
    expect(navigation).toHaveTextContent(/desktop/i);
    expect(screen.getByRole('link', { name: 'Desktop' })).toHaveAttribute('href', '#desktop');
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '#work');
    expect(screen.getByRole('link', { name: 'Career' })).toHaveAttribute('href', '#career');
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects');
    expect(screen.getByRole('link', { name: 'Career' })).toHaveAttribute('aria-current', 'page');
  });

  it('treats a project-detail hash as the active Projects route', () => {
    renderMenu('#projects/pokeleximon');

    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Work' })).not.toHaveAttribute('aria-current');
  });

  it('shows the typed identity, Platform Engineer positioning, Manchester status, and availability', () => {
    renderMenu();

    expect(screen.getByText('Ben Hutchinson')).toBeVisible();
    expect(screen.getByText(/platform engineer/i)).toBeVisible();
    expect(screen.getByText('Manchester, UK')).toBeVisible();
    expect(screen.getByText(/open to platform and backend engineering opportunities/i)).toBeVisible();
  });
});
