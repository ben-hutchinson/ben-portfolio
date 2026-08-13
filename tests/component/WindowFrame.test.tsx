import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { WindowFrame } from '../../src/shell/WindowFrame';

function renderFrame(overrides: Partial<ComponentProps<typeof WindowFrame>> = {}) {
  const callbacks = {
    onFocus: vi.fn(),
    onPositionChange: vi.fn(),
    onClose: vi.fn(),
    onMinimize: vi.fn(),
    onMaximize: vi.fn(),
  };
  const rendered = render(
    <WindowFrame
      appId="work"
      title="Work"
      position={{ x: 80, y: 120 }}
      size={{ width: 480, height: 320 }}
      workArea={{ width: 1200, height: 800 }}
      zIndex={3}
      isFocused={false}
      isMaximized={false}
      dragEnabled
      {...callbacks}
      {...overrides}
    >
      <button type="button">Body action</button>
    </WindowFrame>,
  );
  return { ...callbacks, unmount: rendered.unmount };
}

describe('WindowFrame', () => {
  it('is a labelled non-modal application section with a visible non-heading titlebar label', () => {
    renderFrame({ titleIsHeading: false });

    const frame = screen.getByRole('region', { name: 'Work' });
    expect(frame).toHaveAttribute('data-window-id', 'work');
    expect(frame.tagName).toBe('SECTION');
    expect(frame.querySelector('[data-window-title]')).toHaveTextContent('Work');
    expect(screen.queryByRole('heading', { name: 'Work' })).toBeNull();
    expect(frame).not.toHaveAttribute('role', 'dialog');
    expect(frame).not.toHaveAttribute('aria-modal');
  });

  it('renders the named controls in the locked DOM order and dispatches each callback', async () => {
    const user = userEvent.setup();
    const callbacks = renderFrame();
    const frame = screen.getByRole('region', { name: 'Work' });
    const controls = [...frame.querySelectorAll('[data-window-control]')];

    expect(controls.map((control) => control.getAttribute('data-window-control')))
      .toEqual(['close', 'minimize', 'maximize']);
    expect(screen.getByRole('button', { name: 'Close Work' })).toHaveAttribute('data-window-control', 'close');
    expect(screen.getByRole('button', { name: 'Minimize Work' })).toHaveAttribute('data-window-control', 'minimize');
    expect(screen.getByRole('button', { name: 'Maximize Work' })).toHaveAttribute('data-window-control', 'maximize');

    await user.click(screen.getByRole('button', { name: 'Close Work' }));
    await user.click(screen.getByRole('button', { name: 'Minimize Work' }));
    await user.click(screen.getByRole('button', { name: 'Maximize Work' }));
    expect(callbacks.onClose).toHaveBeenCalledOnce();
    expect(callbacks.onMinimize).toHaveBeenCalledOnce();
    expect(callbacks.onMaximize).toHaveBeenCalledOnce();
  });

  it('renames the final control to Restore while maximized', () => {
    renderFrame({ isMaximized: true });

    expect(screen.getByRole('button', { name: 'Restore Work' })).toHaveAttribute('data-window-control', 'maximize');
    expect(screen.queryByRole('button', { name: 'Maximize Work' })).toBeNull();
  });

  it('allows pointer drag entry only through the title bar and isolates named controls', () => {
    const callbacks = renderFrame();
    const titlebar = document.querySelector('[data-titlebar="work"]') as HTMLElement;
    const bodyAction = screen.getByRole('button', { name: 'Body action' });
    const close = screen.getByRole('button', { name: 'Close Work' });

    expect(titlebar).toBeTruthy();
    fireEvent.pointerDown(titlebar, { button: 0, pointerId: 7, clientX: 100, clientY: 120 });
    expect(callbacks.onFocus).toHaveBeenCalled();

    callbacks.onFocus.mockClear();
    callbacks.onPositionChange.mockClear();
    fireEvent.pointerDown(bodyAction, { button: 0, pointerId: 8, clientX: 100, clientY: 120 });
    fireEvent.pointerDown(close, { button: 0, pointerId: 9, clientX: 100, clientY: 120 });
    fireEvent.pointerMove(document, { pointerId: 8, clientX: 400, clientY: 400 });

    expect(callbacks.onPositionChange).not.toHaveBeenCalled();
    expect(document.querySelectorAll('[data-titlebar="work"]')).toHaveLength(1);
  });

  it('keeps window controls and interactive body content in ordinary keyboard focus order', async () => {
    const user = userEvent.setup();
    renderFrame();

    for (const name of ['Close Work', 'Minimize Work', 'Maximize Work', 'Body action']) {
      await user.tab();
      expect(screen.getByRole('button', { name })).toHaveFocus();
    }
  });

  it('releases capture on cancellation and removes the fallback document listeners on unmount', () => {
    const onPositionChange = vi.fn();
    const { unmount } = renderFrame({ onPositionChange });
    const titlebar = document.querySelector('[data-titlebar="work"]') as HTMLElement;
    const setPointerCapture = vi.fn();
    const releasePointerCapture = vi.fn();
    const hasPointerCapture = vi.fn(() => true);
    Object.assign(titlebar, { setPointerCapture, releasePointerCapture, hasPointerCapture });

    fireEvent.pointerDown(titlebar, { button: 0, pointerId: 11, clientX: 100, clientY: 140 });
    fireEvent.pointerMove(document, { pointerId: 11, clientX: 400, clientY: 400 });
    expect(onPositionChange).toHaveBeenCalledWith({ x: 380, y: 380 });
    fireEvent.pointerCancel(document, { pointerId: 11 });

    expect(setPointerCapture).toHaveBeenCalledWith(11);
    expect(hasPointerCapture).toHaveBeenCalledWith(11);
    expect(releasePointerCapture).toHaveBeenCalledWith(11);
    expect(document.querySelector('[data-window-id="work"]')).not.toHaveAttribute('data-dragging');

    fireEvent.pointerDown(titlebar, { button: 0, pointerId: 12, clientX: 100, clientY: 140 });
    unmount();
    onPositionChange.mockClear();
    fireEvent.pointerMove(document, { pointerId: 12, clientX: 500, clientY: 500 });
    expect(onPositionChange).not.toHaveBeenCalled();
  });
});
