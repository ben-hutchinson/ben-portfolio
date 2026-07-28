import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('portfolio document', () => {
  it('shows professional evidence without an intro gate', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /engineer the calm/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pokeleximon Daily' })).toBeInTheDocument();
    expect(screen.queryByText(/press start/i)).not.toBeInTheDocument();
  });

  it('uses the approved section order', () => {
    render(<App />);
    const ids = Array.from(document.querySelectorAll('main > section')).map((section) => section.id);
    expect(ids).toEqual(['top', 'work', 'systems', 'experience', 'crew', 'training']);
  });
});
