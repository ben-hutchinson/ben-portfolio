import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { TrainingDialog } from './TrainingDialog';
import { TrainingModule } from './TrainingModule';

let playSpy: ReturnType<typeof vi.spyOn>;
const storedValues = new Map<string, string>();
const localStorageStub: Storage = {
  get length() {
    return storedValues.size;
  },
  clear: () => storedValues.clear(),
  getItem: (key) => storedValues.get(key) ?? null,
  key: (index) => Array.from(storedValues.keys())[index] ?? null,
  removeItem: (key) => storedValues.delete(key),
  setItem: (key, value) => storedValues.set(key, value),
};

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: localStorageStub,
  });
  window.localStorage.clear();
  playSpy = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('opens the runner only after explicit launch and restores close state', async () => {
  const user = userEvent.setup();
  const onOpenChange = vi.fn();

  renderWithProviders(<TrainingDialog open onOpenChange={onOpenChange} />);

  expect(
    await screen.findByRole('dialog', { name: 'Signal Sprint training simulation' }),
  ).toBeInTheDocument();

  await user.keyboard('{Escape}');

  expect(onOpenChange).toHaveBeenCalledWith(false);
});

it('does not render runner instructions while closed', () => {
  renderWithProviders(<TrainingDialog open={false} onOpenChange={vi.fn()} />);

  expect(
    screen.queryByText('Jump with Space, Arrow Up, W, or a pointer press. Avoid incoming obstacles.'),
  ).not.toBeInTheDocument();
});

it('waits for an audio-control interaction before honoring an unmuted preference', async () => {
  const user = userEvent.setup();
  window.localStorage.setItem('portfolio.muted', JSON.stringify(false));

  renderWithProviders(<TrainingDialog open onOpenChange={vi.fn()} />);

  expect(await screen.findByRole('button', { name: 'Enable training audio' })).toBeInTheDocument();
  expect(playSpy).not.toHaveBeenCalled();

  await user.click(screen.getByRole('button', { name: 'Enable training audio' }));

  await waitFor(() => expect(playSpy).toHaveBeenCalledTimes(1));
});

it('launches training from the optional module', async () => {
  const user = userEvent.setup();
  const onLaunch = vi.fn();

  const { container } = renderWithProviders(<TrainingModule onLaunch={onLaunch} />);

  expect(container.querySelector('section#training')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Launch Signal Sprint' }));

  expect(onLaunch).toHaveBeenCalledTimes(1);
});
