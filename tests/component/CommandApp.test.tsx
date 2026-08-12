import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PortfolioProvider } from '../../src/app/PortfolioContext';
import { PortfolioShell } from '../../src/shell/PortfolioShell';

function renderCommand() {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  window.history.replaceState(null, '', '#desktop');
  return render(<PortfolioProvider><PortfolioShell /></PortfolioProvider>);
}

afterEach(() => { vi.unstubAllGlobals(); window.history.replaceState(null, '', '#desktop'); });

describe('CommandApp', () => {
  it('shows discoverable suggestions and dispatches ordinary navigation actions', async () => {
    const user = userEvent.setup();
    renderCommand();
    await user.click(screen.getByRole('button', { name: 'Command' }));
    const frame = document.querySelector<HTMLElement>('[data-window-id="command"]');
    if (frame === null) throw new Error('Command frame missing');
    expect(within(frame).getByRole('textbox', { name: 'Portfolio command' })).toBeVisible();
    expect(within(frame).getByRole('button', { name: 'career' })).toBeVisible();

    await user.type(within(frame).getByRole('textbox', { name: 'Portfolio command' }), 'project safelog{Enter}');
    expect(window.location.hash).toBe('#projects/safelog');
    expect(screen.getByRole('heading', { level: 1, name: 'Safelog' })).toBeVisible();
  });

  it('returns helpful inert output and clear removes history', async () => {
    const user = userEvent.setup();
    renderCommand();
    await user.click(screen.getByRole('button', { name: 'Command' }));
    const input = screen.getByRole('textbox', { name: 'Portfolio command' });
    await user.type(input, 'carear{Enter}');
    expect(screen.getByRole('log')).toHaveTextContent(/career/i);
    await user.type(input, '<script>alert(1)</script>{Enter}');
    expect(screen.getByRole('log')).toHaveTextContent('<script>alert(1)</script>');
    expect(document.querySelector('script')).toBeNull();
    await user.type(input, 'clear{Enter}');
    expect(screen.getByRole('log')).toBeEmptyDOMElement();
  });

  it('retains only the latest 30 in-memory outputs', async () => {
    const user = userEvent.setup();
    renderCommand();
    await user.click(screen.getByRole('button', { name: 'Command' }));
    const input = screen.getByRole('textbox', { name: 'Portfolio command' });
    for (let index = 0; index < 31; index += 1) await user.type(input, `unknown-${index}{Enter}`);
    expect(screen.getByRole('log').children).toHaveLength(30);
    expect(screen.getByRole('log')).not.toHaveTextContent('unknown-0”');
    expect(screen.getByRole('log')).toHaveTextContent('unknown-30');
  });
});
