import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { PortfolioProvider } from '../../src/app/PortfolioContext';
import { PortfolioShell } from '../../src/shell/PortfolioShell';

function renderShell(hash = '#desktop') {
  window.history.replaceState(null, '', hash);
  return render(<PortfolioProvider><PortfolioShell /></PortfolioProvider>);
}

afterEach(() => window.history.replaceState(null, '', '#desktop'));

describe('PortfolioShell', () => {
  it('provides the shell landmarks and one canonical recruiter claim in the main summary', () => {
    renderShell();

    expect(screen.getByRole('banner')).toBeVisible();
    expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeVisible();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    expect(screen.getByRole('contentinfo')).toBeVisible();
    expect(screen.getByText('Migrated 50+ repositories and reduced average build time by four minutes.')).toBeVisible();
    expect(screen.getAllByText('Migrated 50+ repositories and reduced average build time by four minutes.')).toHaveLength(1);
    expect(screen.getByText(/mid-level platform engineer/i)).toBeVisible();
    expect(screen.getByText('Manchester, UK')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Work' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Career' })).toBeVisible();
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
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });

  it('converges menu hash navigation and dock intent on the same observable Career state', async () => {
    const user = userEvent.setup();
    const { unmount } = renderShell('#career');

    expect(screen.getByRole('link', { name: 'Career' })).toHaveAttribute('aria-current', 'page');
    unmount();
    renderShell();

    await user.click(screen.getByRole('button', { name: 'Career' }));
    expect(window.location.hash).toBe('#career');
    expect(screen.getByRole('link', { name: 'Career' })).toHaveAttribute('aria-current', 'page');
  });
});
