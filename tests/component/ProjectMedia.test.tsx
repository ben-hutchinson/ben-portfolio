import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectMedia } from '../../src/components/ProjectMedia';
import { projects } from '../../src/data/projects';

describe('ProjectMedia', () => {
  it('uses the deploy base and a meaningful image alternative', () => {
    render(<ProjectMedia project={projects[0]} />);
    const image = screen.getByRole('img', { name: 'Pokeleximon Daily project interface' });
    expect(image).toHaveAttribute('src', `${import.meta.env.BASE_URL}assets/ui/project-pokeleximon.webp`);
  });

  it('replaces a failed image with a labelled tactile fallback', () => {
    render(<ProjectMedia project={projects[1]} />);
    fireEvent.error(screen.getByRole('img', { name: 'Safelog project interface' }));

    expect(screen.queryByRole('img', { name: 'Safelog project interface' })).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Safelog project preview unavailable' })).toBeVisible();
    expect(screen.getByText('Preview unavailable')).toBeVisible();
  });
});
