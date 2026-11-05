import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PortfolioProvider } from '../../src/app/PortfolioContext';
import { PortfolioShell } from '../../src/shell/PortfolioShell';

function renderTerminal(hash = '#desktop') {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  window.history.replaceState(null, '', hash);
  return render(<PortfolioProvider><PortfolioShell /></PortfolioProvider>);
}

function terminal() {
  return screen.getByTestId('micro-terminal');
}

function input() {
  return within(terminal()).getByRole('combobox', { name: 'Portfolio command' });
}

afterEach(() => { vi.unstubAllGlobals(); window.history.replaceState(null, '', '#desktop'); });

describe('MicroTerminal', () => {
  it('opens six unselected examples on focus with linked combobox/listbox semantics', async () => {
    const user = userEvent.setup();
    renderTerminal();
    const field = input();
    expect(field).not.toHaveFocus();
    expect(field).toHaveAttribute('aria-autocomplete', 'list');
    expect(field).toHaveAttribute('aria-expanded', 'false');
    expect(within(terminal()).queryByRole('listbox')).not.toBeInTheDocument();

    await user.click(field);
    const list = within(terminal()).getByRole('listbox');
    const options = within(list).getAllByRole('option');
    expect(field).toHaveAttribute('aria-expanded', 'true');
    expect(list.id).not.toBe('');
    expect(field).toHaveAttribute('aria-controls', list.id);
    expect(field).not.toHaveAttribute('aria-activedescendant');
    expect(options).toHaveLength(6);
    for (const [index, command] of ['help', 'work', 'career', 'projects', 'contact', 'cv'].entries()) {
      expect(options[index]).toHaveTextContent(command);
      expect(options[index]).toHaveAttribute('aria-selected', 'false');
      expect(options[index].id).not.toBe('');
    }
    expect(new Set(options.map(({ id }) => id)).size).toBe(6);
    expect(terminal()).toHaveTextContent(/Enter/);
    expect(field).toHaveFocus();
    expect(window.location.hash).toBe('#desktop');
    expect(within(terminal()).queryByRole('status')).not.toBeInTheDocument();
  });

  it('explicitly selects, wraps and announces arrows while keeping DOM focus in the input', async () => {
    const user = userEvent.setup();
    renderTerminal();
    await user.click(input());
    const options = within(terminal()).getAllByRole('option');
    for (const [key, selectedIndex] of [
      ['{ArrowDown}', 0], ['{ArrowUp}', 5], ['{ArrowDown}', 0], ['{ArrowDown}', 1],
    ] as const) {
      await user.keyboard(key);
      expect(input()).toHaveAttribute('aria-activedescendant', options[selectedIndex].id);
      expect(options[selectedIndex]).toHaveAttribute('aria-selected', 'true');
      expect(options.filter((option) => option.getAttribute('aria-selected') === 'true')).toHaveLength(1);
      expect(input()).toHaveFocus();
      expect(input()).toHaveValue('');
    }
  });

  it('accepts a keyboard completion without execution and executes only on the next Enter', async () => {
    const user = userEvent.setup();
    renderTerminal();
    await user.type(input(), 'triv');
    expect(input()).toHaveValue('triv');
    expect(input()).not.toHaveAttribute('aria-activedescendant');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(input()).toHaveValue('project trivialise');
    expect(input()).toHaveFocus();
    expect(within(terminal()).queryByRole('listbox')).not.toBeInTheDocument();
    expect(within(terminal()).queryByRole('status')).not.toBeInTheDocument();
    expect(window.location.hash).toBe('#desktop');
    await user.keyboard('{Enter}');
    expect(window.location.hash).toBe('#projects/trivialise');
    expect(screen.queryByTestId('micro-terminal')).not.toBeInTheDocument();
  });

  it('survives mouse pointer blur, completes and refocuses without replacing the latest result', async () => {
    const user = userEvent.setup();
    renderTerminal();
    await user.type(input(), 'carear{Enter}');
    await user.type(input(), 'task');
    await user.click(within(terminal()).getByRole('option', { name: /project taskmon/i }));
    expect(input()).toHaveValue('project taskmon');
    expect(input()).toHaveFocus();
    expect(within(terminal()).queryByRole('listbox')).not.toBeInTheDocument();
    expect(within(terminal()).getByRole('status')).toHaveTextContent('Did you mean “career”?');
    expect(window.location.hash).toBe('#desktop');
    await user.click(within(terminal()).getByRole('button', { name: 'Run command' }));
    expect(window.location.hash).toBe('#projects/taskmon');
  });

  it.each(['clear', 'cv'])('does not execute a %s completion before explicit submission', async (command) => {
    const user = userEvent.setup();
    renderTerminal();
    await user.type(input(), 'carear{Enter}');
    await user.type(input(), command);
    await user.keyboard('{ArrowDown}{Enter}');
    expect(input()).toHaveValue(command);
    expect(within(terminal()).getByRole('status')).toHaveTextContent('Did you mean “career”?');
    expect(within(terminal()).queryByRole('link', { name: 'Download CV' })).not.toBeInTheDocument();
    await user.keyboard('{Enter}');
    if (command === 'clear') expect(within(terminal()).queryByRole('status')).not.toBeInTheDocument();
    else expect(within(terminal()).getByRole('link', { name: 'Download CV' })).toHaveAttribute('download', 'ben-hutchinson-cv.pdf');
  });

  it('dismisses with Escape and blur, preserves text and leaves Tab in natural order', async () => {
    const user = userEvent.setup();
    renderTerminal();
    await user.click(input());
    const ids = within(terminal()).getAllByRole('option').map(({ id }) => id);
    await user.keyboard('{Escape}');
    expect(input()).toHaveValue('');
    expect(input()).toHaveAttribute('aria-expanded', 'false');
    await user.tab();
    expect(within(terminal()).getByRole('button', { name: 'Run command' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(input()).toHaveFocus();
    expect(within(terminal()).getAllByRole('option').map(({ id }) => id)).toEqual(ids);
    await user.type(input(), 'task');
    await user.keyboard('{Escape}');
    expect(input()).toHaveValue('task');
    expect(within(terminal()).queryByRole('listbox')).not.toBeInTheDocument();
    await user.type(input(), 'm');
    expect(within(terminal()).getByRole('listbox')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Open About' }));
    expect(within(terminal()).queryByRole('listbox')).not.toBeInTheDocument();
    expect(input()).toHaveValue('taskm');
    expect(window.location.hash).toBe('#desktop');
  });

  it('clears stale selection on edits and keeps an unmatched raw Enter inert', async () => {
    const user = userEvent.setup();
    renderTerminal();
    await user.type(input(), 'career');
    await user.keyboard('{ArrowDown}');
    expect(input()).toHaveAttribute('aria-activedescendant');
    await user.clear(input());
    await user.type(input(), 'zzzzq');
    expect(input()).not.toHaveAttribute('aria-activedescendant');
    expect(within(terminal()).queryAllByRole('option')).toHaveLength(0);
    expect(within(terminal()).getByText('No matching commands. Try help.')).toBeVisible();
    await user.keyboard('{Enter}');
    expect(window.location.hash).toBe('#desktop');
    expect(within(terminal()).getByRole('status')).toHaveTextContent(/unknown command.*zzzzq/i);
  });

  it.each([false, true])('ignores IME Enter with explicit selection=%s until composition ends', async (selected) => {
    const user = userEvent.setup();
    renderTerminal();
    await user.type(input(), 'career');
    if (selected) await user.keyboard('{ArrowDown}');
    fireEvent.compositionStart(input());
    fireEvent.keyDown(input(), { key: 'Enter', code: 'Enter', isComposing: true });
    await user.keyboard('{Enter}');
    expect(input()).toHaveValue('career');
    expect(input()).toHaveAttribute('aria-expanded', 'true');
    expect(within(terminal()).queryByRole('status')).not.toBeInTheDocument();
    expect(window.location.hash).toBe('#desktop');
    fireEvent.compositionEnd(input());
    await user.keyboard('{Enter}');
    if (selected) {
      expect(window.location.hash).toBe('#desktop');
      expect(input()).toHaveValue('career');
      await user.keyboard('{Enter}');
    }
    expect(window.location.hash).toBe('#career');
  });

  it('discards stale open/selection state after route departure and Desktop return', async () => {
    const user = userEvent.setup();
    renderTerminal();
    await user.type(input(), 'task');
    await user.keyboard('{ArrowDown}');
    await user.click(screen.getByRole('button', { name: 'Career' }));
    expect(screen.queryByTestId('micro-terminal')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reset layout' }));
    expect(window.location.hash).toBe('#desktop');
    expect(input()).not.toHaveAttribute('aria-activedescendant');
    expect(input()).toHaveAttribute('aria-expanded', 'false');
    expect(within(terminal()).queryByRole('listbox')).not.toBeInTheDocument();
    await user.clear(input());
    await user.type(input(), 'career{Enter}');
    expect(window.location.hash).toBe('#career');
  });

  it('renders the permanent Desktop-only terminal with semantic hooks and no Command-window clutter', () => {
    renderTerminal();

    const surface = terminal();
    expect(surface).toHaveAttribute('data-micro-terminal');
    expect(surface).toHaveTextContent('portfolio command');
    expect(input()).toBeVisible();
    expect(within(surface).getByRole('button', { name: 'Run command' })).toBeVisible();
    expect(screen.queryByRole('button', { name: /^Command$/ })).not.toBeInTheDocument();
    expect(document.querySelector('[data-window-id="command"]')).toBeNull();
    expect(screen.queryByText('Optional shortcut')).not.toBeInTheDocument();
    expect(screen.queryByText('Command palette')).not.toBeInTheDocument();
    expect(within(surface).queryByRole('log')).not.toBeInTheDocument();
  });

  it('does not render outside the Desktop route', () => {
    renderTerminal('#career');

    expect(screen.queryByTestId('micro-terminal')).not.toBeInTheDocument();
  });

  it('shows only the latest inert result and clear removes it', async () => {
    const user = userEvent.setup();
    renderTerminal();

    await user.type(input(), 'carear{Enter}');
    expect(within(terminal()).getByRole('status')).toHaveTextContent('Did you mean “career”?');
    await user.type(input(), '<script>alert(1)</script>{Enter}');
    expect(within(terminal()).getByRole('status')).toHaveTextContent('<script>alert(1)</script>');
    expect(within(terminal()).getByRole('status')).not.toHaveTextContent('Did you mean “career”?');
    expect(document.querySelector('script')).toBeNull();
    await user.type(input(), 'clear{Enter}');
    expect(within(terminal()).queryByRole('status')).not.toBeInTheDocument();
  });

  it('dispatches parser actions and retains the base-safe CV download', async () => {
    const user = userEvent.setup();
    renderTerminal();

    await user.type(input(), 'cv{Enter}');
    const cv = within(terminal()).getByRole('link', { name: 'Download CV' });
    expect(cv).toHaveAttribute('download', 'ben-hutchinson-cv.pdf');
    expect(cv).toHaveAttribute('href', `${import.meta.env.BASE_URL}cv/ben-hutchinson-cv.pdf`);

    await user.type(input(), 'reset{Enter}');
    expect(within(terminal()).getByRole('status')).toHaveTextContent('Desktop layout reset.');
    await user.type(input(), 'career{Enter}');
    expect(window.location.hash).toBe('#career');
    expect(screen.getByRole('region', { name: 'Career' })).toBeVisible();
    expect(screen.queryByTestId('micro-terminal')).not.toBeInTheDocument();
  });
});
