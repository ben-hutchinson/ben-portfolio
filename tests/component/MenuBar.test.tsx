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
      const activeElement = document.activeElement;
      if (window.location.hash === '#main-content' && activeElement instanceof HTMLElement) activeElement.blur();
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

  it('removes the primary route controls while retaining the skip link', () => {
    renderMenu('#career');

    expect(screen.queryByRole('navigation', { name: /primary navigation/i })).not.toBeInTheDocument();
    for (const name of ['Desktop', 'Work', 'Career', 'Projects']) {
      expect(screen.queryByRole('link', { name })).not.toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute('href', '#main-content');
  });

  it('keeps the simplified identity chrome stable for a project-detail hash', () => {
    renderMenu('#projects/pokeleximon');

    expect(screen.queryByRole('navigation', { name: /primary navigation/i })).not.toBeInTheDocument();
    expect(screen.getByText('Ben Hutchinson')).toBeVisible();
    expect(screen.getByText('Manchester, UK')).toBeVisible();
  });

  it('shows the Kernel identity and Manchester status without role or availability copy', () => {
    renderMenu();

    expect(screen.getByText('Ben Hutchinson')).toBeVisible();
    expect(screen.getByTestId('portfolio-os-mark')).toBeInTheDocument();
    expect(screen.getByText('Manchester, UK')).toBeVisible();
    expect(screen.queryByText(/mid-level platform engineer/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/open to platform and backend engineering opportunities/i)).not.toBeInTheDocument();
  });
});
