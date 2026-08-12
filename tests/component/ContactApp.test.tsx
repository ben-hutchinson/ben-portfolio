import { render, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PortfolioProvider } from '../../src/app/PortfolioContext';
import { externalLinks } from '../../src/data/externalLinks';
import { profile } from '../../src/data/profile';
import { PortfolioShell } from '../../src/shell/PortfolioShell';

afterEach(() => { vi.unstubAllGlobals(); window.history.replaceState(null, '', '#desktop'); });

describe('ContactApp', () => {
  it('renders direct canonical contact actions and the checked-in CV', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
    window.history.replaceState(null, '', '#contact');
    render(<PortfolioProvider><PortfolioShell /></PortfolioProvider>);
    const frame = document.querySelector<HTMLElement>('[data-window-id="contact"]');
    if (frame === null) throw new Error('Contact frame missing');

    expect(within(frame).getByRole('heading', { level: 1, name: 'Contact Ben' })).toBeVisible();
    expect(frame).toHaveTextContent(profile.location);
    expect(frame).toHaveTextContent(profile.availability);
    for (const link of externalLinks) expect(within(frame).getByRole('link', { name: link.label })).toHaveAttribute('href', link.href);
    expect(within(frame).getByRole('link', { name: 'Email' })).not.toHaveAttribute('target');
    for (const label of ['LinkedIn', 'GitHub']) {
      expect(within(frame).getByRole('link', { name: label })).toHaveAttribute('target', '_blank');
      expect(within(frame).getByRole('link', { name: label })).toHaveAttribute('rel', 'noreferrer noopener');
    }
    expect(within(frame).getByRole('link', { name: 'Download CV' })).toHaveAttribute(
      'href',
      `${import.meta.env.BASE_URL}cv/ben-hutchinson-cv.pdf`,
    );
  });
});
