import { screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { timelineEvents } from '@/data/timeline';
import { renderWithProviders } from '@/test/render';
import { ExperienceTimeline } from './ExperienceTimeline';

it('shows the current SKAO entry before Flutter UKI without expansion', () => {
  renderWithProviders(
    <ExperienceTimeline id="experience" events={timelineEvents} />,
  );

  const skaoEntry = screen.getByRole('heading', {
    name: 'Junior Software Engineer at SKAO',
  });
  const flutterEntry = screen.getByRole('heading', {
    name: 'Associate Software Engineer at Flutter UKI',
  });

  expect(skaoEntry.compareDocumentPosition(flutterEntry)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  );
  expect(
    screen.getByText(/Working with Python and control systems/),
  ).toBeVisible();
  expect(
    screen.getByText(/Upskilled across Java and Scala during stack migration/),
  ).toBeVisible();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});
