import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { projects } from '@/data/projects';
import { renderWithProviders } from '@/test/render';
import { MissionLogsSection } from './MissionLogsSection';

it('presents the accepted mission-log editorial framing', () => {
  renderWithProviders(<MissionLogsSection id="work" projects={projects} />);

  expect(screen.getByText('01 / SELECTED MISSION LOGS')).toBeVisible();
  expect(
    screen.getByRole('heading', { name: 'PROOF, NOT JUST A STACK LIST.' }),
  ).toBeVisible();
  expect(
    screen.getByText(
      'Each case study opens like an engineering briefing: context, constraints, decisions, delivery and what changed—not a wall of technology badges.',
    ),
  ).toBeVisible();
});

it('opens a complete engineering briefing', async () => {
  const user = userEvent.setup();
  renderWithProviders(<MissionLogsSection id="work" projects={projects} />);

  await user.click(
    screen.getByRole('button', {
      name: 'Open Pokeleximon Daily engineering briefing',
    }),
  );

  expect(
    screen.getByRole('dialog', {
      name: 'Pokeleximon Daily engineering briefing',
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Key decisions' }),
  ).toBeInTheDocument();
});
