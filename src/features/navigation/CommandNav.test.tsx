import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { CommandNav } from './CommandNav';

describe('CommandNav', () => {
  it('provides the primary section links', () => {
    renderWithProviders(<CommandNav />);

    const navigation = screen.getByRole('navigation', { name: 'Primary' });
    expect(navigation).toBeInTheDocument();
    expect(
      within(navigation).getByRole('link', { name: 'Mission logs' }),
    ).toHaveAttribute('href', '#work');
  });

  it('makes the section links available in the mobile sheet', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommandNav />);

    await user.click(screen.getByRole('button', { name: 'Open navigation' }));

    const sheet = await screen.findByRole('dialog');
    expect(
      within(sheet).getByRole('link', { name: 'Mission logs' }),
    ).toHaveAttribute('href', '#work');
    expect(within(sheet).getByRole('link', { name: 'Systems' })).toHaveAttribute(
      'href',
      '#systems',
    );
    expect(
      within(sheet).getByRole('link', { name: 'Experience' }),
    ).toHaveAttribute('href', '#experience');
    expect(within(sheet).getByRole('link', { name: 'Crew' })).toHaveAttribute(
      'href',
      '#crew',
    );
    expect(
      within(sheet).getByRole('link', { name: 'Training sim' }),
    ).toHaveAttribute('href', '#training');
  });
});
