import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { projects } from '@/data/projects';
import { renderWithProviders } from '@/test/render';
import { MissionLogsSection } from './MissionLogsSection';

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
