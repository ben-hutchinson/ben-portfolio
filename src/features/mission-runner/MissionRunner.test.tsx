import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { characters } from '@/data/characters';
import { MissionRunner } from './MissionRunner';

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
});

describe('MissionRunner', () => {
  it('presents the simulation as Signal Sprint', () => {
    render(
      <MissionRunner character={characters[0]} reducedMotion onExit={vi.fn()} />,
    );

    expect(screen.getByRole('heading', { name: 'Signal Sprint' })).toBeInTheDocument();
  });

  it('handles jump keys only while the runner is mounted', () => {
    const { unmount } = render(
      <MissionRunner character={characters[0]} reducedMotion onExit={vi.fn()} />,
    );
    const mountedEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      code: 'Space',
    });

    window.dispatchEvent(mountedEvent);

    expect(mountedEvent.defaultPrevented).toBe(true);

    unmount();

    const unmountedEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      code: 'Space',
    });
    window.dispatchEvent(unmountedEvent);

    expect(unmountedEvent.defaultPrevented).toBe(false);
  });
});
