import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { SystemsTopology } from './SystemsTopology';

it('updates pressed state and highlighted nodes', async () => {
  const user = userEvent.setup();

  renderWithProviders(<SystemsTopology id="systems" />);

  const product = screen.getByRole('button', { name: 'Product systems' });
  await user.click(product);

  expect(product).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByTestId('topology-node-pokeleximon')).toHaveAttribute(
    'data-active',
    'true',
  );
  expect(screen.getByTestId('topology-node-safelog')).toHaveAttribute(
    'data-active',
    'false',
  );
});

it('keeps every node label in the DOM after changing focus', async () => {
  const user = userEvent.setup();

  renderWithProviders(<SystemsTopology id="systems" />);

  await user.click(
    screen.getByRole('button', { name: 'Developer tooling' }),
  );

  for (const label of [
    'SKAO',
    'Flutter UKI',
    'Pokeleximon',
    'Safelog',
    'Observability',
  ]) {
    expect(screen.getByText(label)).toBeInTheDocument();
  }
});
