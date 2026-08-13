import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';

function BrokenPortfolio(): never {
  throw new Error('root render failed');
}

afterEach(() => vi.restoreAllMocks());

describe('ErrorBoundary', () => {
  it('replaces a root render failure with Ben identity and direct recovery exits', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(<ErrorBoundary><BrokenPortfolio /></ErrorBoundary>);

    expect(screen.getByRole('heading', { name: 'Ben Hutchinson' })).toBeVisible();
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '#contact');
    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute('download', 'ben-hutchinson-cv.pdf');
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/ben-hutchinson');
  });
});
