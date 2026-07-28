import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CommandButton } from './CommandButton';

describe('CommandButton', () => {
  it('renders links without losing their destination', () => {
    render(<CommandButton href="#work">Explore mission logs</CommandButton>);
    expect(screen.getByRole('link', { name: 'Explore mission logs' })).toHaveAttribute('href', '#work');
  });

  it('renders a native button for actions', () => {
    render(<CommandButton type="button">Launch training</CommandButton>);
    expect(screen.getByRole('button', { name: 'Launch training' })).toHaveAttribute('type', 'button');
  });
});
