import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../../src/App';

describe('Portfolio OS foundation', () => {
  it('keeps Ben Hutchinson visible as the initial semantic heading', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Ben Hutchinson' })).toBeVisible();
  });

  it('keeps the mid-level platform engineer role visible without interaction', () => {
    render(<App />);

    expect(screen.getByText('Mid-level platform engineer', { exact: true })).toBeVisible();
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
