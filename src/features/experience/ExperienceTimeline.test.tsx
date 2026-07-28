import { screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import type { TimelineEvent } from '@/data/types';
import { renderWithProviders } from '@/test/render';
import { ExperienceTimeline } from './ExperienceTimeline';

const events: TimelineEvent[] = [
  {
    year: 'Present',
    title: 'Junior Software Engineer at SKAO',
    description: 'Current operating context.',
  },
  {
    year: '2022 - 2025',
    title: 'Software Engineer at Flutter UKI',
    description: 'Previous operating context.',
  },
];

it('shows the current SKAO entry before Flutter UKI without expansion', () => {
  renderWithProviders(<ExperienceTimeline id="experience" events={events} />);

  const skaoEntry = screen.getByRole('heading', {
    name: 'Junior Software Engineer at SKAO',
  });
  const flutterEntry = screen.getByRole('heading', {
    name: 'Software Engineer at Flutter UKI',
  });

  expect(skaoEntry.compareDocumentPosition(flutterEntry)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  );
  expect(screen.getByText('Current operating context.')).toBeVisible();
  expect(screen.getByText('Previous operating context.')).toBeVisible();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});
