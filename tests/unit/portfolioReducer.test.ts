import { describe, expect, it } from 'vitest';
import { createInitialPortfolioState, DEFAULT_WINDOW_POSITIONS, type PortfolioRoute } from '../../src/app/portfolioState';
import { portfolioReducer, type PortfolioAction } from '../../src/app/portfolioReducer';

const routeCases: readonly [PortfolioRoute, string, string | null][] = [
  [{ kind: 'desktop' }, 'desktop', null],
  [{ kind: 'work' }, 'work', 'work'],
  [{ kind: 'career' }, 'career', 'career'],
  [{ kind: 'projects' }, 'projects', 'projects'],
  [{ kind: 'project', projectId: 'pokeleximon' }, 'project', 'projects'],
  [{ kind: 'project', projectId: 'safelog' }, 'project', 'projects'],
  [{ kind: 'contact' }, 'contact', 'contact'],
];

function reduce(actions: readonly PortfolioAction[]) {
  return actions.reduce(portfolioReducer, createInitialPortfolioState());
}

function expectWindowInvariants(state: ReturnType<typeof createInitialPortfolioState>) {
  expect(new Set(state.openAppIds).size).toBe(state.openAppIds.length);
  expect(new Set(state.minimizedAppIds).size).toBe(state.minimizedAppIds.length);
  expect(new Set(state.windowOrder).size).toBe(state.windowOrder.length);
  expect(state.windowOrder.every((appId) => state.openAppIds.includes(appId))).toBe(true);
  expect(state.windowOrder.every((appId) => !state.minimizedAppIds.includes(appId))).toBe(true);
  expect(state.focusedAppId === null || state.openAppIds.includes(state.focusedAppId)).toBe(true);
  expect(state.focusedAppId === null || !state.minimizedAppIds.includes(state.focusedAppId)).toBe(true);
  expect(state.focusedAppId === null || state.windowOrder.at(-1) === state.focusedAppId).toBe(true);
  expect(state.maximizedAppId === null || state.maximizedAppId === state.focusedAppId).toBe(true);
  expect(state.maximizedAppId === null || state.openAppIds.includes(state.maximizedAppId)).toBe(true);
  expect(state.maximizedAppId === null || !state.minimizedAppIds.includes(state.maximizedAppId)).toBe(true);
}

describe('createInitialPortfolioState', () => {
  it('creates the one stable desktop layout and reset restores it exactly', () => {
    const initial = createInitialPortfolioState();
    const reset = portfolioReducer(reduce([{ type: 'SELECT_PROJECT', projectId: 'safelog' }]), { type: 'RESET_LAYOUT' });

    expect(initial).toEqual({
      route: { kind: 'desktop' },
      openAppIds: ['about', 'work', 'command'],
      focusedAppId: 'command',
      minimizedAppIds: [],
      maximizedAppId: null,
      windowOrder: ['about', 'work', 'command'],
      windowPositions: DEFAULT_WINDOW_POSITIONS,
      activeCareerStageId: 'graduate',
      activeProjectId: null,
    });
    expect(reset).toEqual(initial);
    expectWindowInvariants(initial);
  });
});

describe('portfolioReducer routes', () => {
  it.each(routeCases)('NAVIGATE %o opens and focuses its available target', (route, kind, target) => {
    const state = portfolioReducer(createInitialPortfolioState(), { type: 'NAVIGATE', route });

    expect(state.route).toEqual(route);
    if (target === null) expect(state).toEqual(createInitialPortfolioState());
    else {
      expect(state.openAppIds).toContain(target);
      expect(state.minimizedAppIds).not.toContain(target);
      expect(state.focusedAppId).toBe(target);
      expect(state.windowOrder.at(-1)).toBe(target);
      if (kind === 'project') expect(state.activeProjectId).toBe(route.projectId);
      if (kind === 'projects') expect(state.activeProjectId).toBeNull();
    }
    expectWindowInvariants(state);
  });
});

describe('portfolioReducer action contract', () => {
  const cases: readonly [string, (state: ReturnType<typeof createInitialPortfolioState>) => void][] = [
    ['NAVIGATE restores a minimized route target and clears another maximization', (state) => {
      const next = portfolioReducer(portfolioReducer(state, { type: 'MAXIMIZE_WINDOW', appId: 'work' }), { type: 'NAVIGATE', route: { kind: 'career' } });
      expect(next).toMatchObject({ route: { kind: 'career' }, focusedAppId: 'career', maximizedAppId: null });
      expect(next.openAppIds).toContain('career');
    }],
    ['OPEN_APP restores and focuses an app while selecting only its base hash route', (state) => {
      const next = portfolioReducer(portfolioReducer(state, { type: 'MINIMIZE_WINDOW', appId: 'work' }), { type: 'OPEN_APP', appId: 'projects' });
      expect(next).toMatchObject({ route: { kind: 'projects' }, focusedAppId: 'projects', activeProjectId: null });
      expect(next.openAppIds).toContain('projects');
    }],
    ['FOCUS_WINDOW changes only an open non-minimized window and topmost order', (state) => {
      const next = portfolioReducer(state, { type: 'FOCUS_WINDOW', appId: 'about' });
      expect(next.focusedAppId).toBe('about');
      expect(next.windowOrder.at(-1)).toBe('about');
    }],
    ['MINIMIZE_WINDOW hides an open route target and recovers its route to desktop', (state) => {
      const next = portfolioReducer(portfolioReducer(state, { type: 'NAVIGATE', route: { kind: 'work' } }), { type: 'MINIMIZE_WINDOW', appId: 'work' });
      expect(next.route).toEqual({ kind: 'desktop' });
      expect(next.minimizedAppIds).toContain('work');
      expect(next.focusedAppId).not.toBe('work');
    }],
    ['MAXIMIZE_WINDOW opens restores focuses and exclusively maximizes its app', (state) => {
      const next = portfolioReducer(state, { type: 'MAXIMIZE_WINDOW', appId: 'contact' });
      expect(next).toMatchObject({ route: { kind: 'contact' }, focusedAppId: 'contact', maximizedAppId: 'contact' });
      expect(next.minimizedAppIds).not.toContain('contact');
    }],
    ['CLOSE_WINDOW removes a route target and recovers to desktop without deleting selections', (state) => {
      const selected = portfolioReducer(state, { type: 'SELECT_PROJECT', projectId: 'pokeleximon' });
      const next = portfolioReducer(selected, { type: 'CLOSE_WINDOW', appId: 'projects' });
      expect(next).toMatchObject({ route: { kind: 'desktop' }, activeProjectId: 'pokeleximon' });
      expect(next.openAppIds).not.toContain('projects');
      expect(next.minimizedAppIds).not.toContain('projects');
      expect(next.windowOrder).not.toContain('projects');
    }],
    ['MOVE_WINDOW changes an open app position only', (state) => {
      const next = portfolioReducer(state, { type: 'MOVE_WINDOW', appId: 'work', position: { x: 123, y: 456 } });
      expect(next.windowPositions.work).toEqual({ x: 123, y: 456 });
      expect(next.route).toEqual(state.route);
      expect(next.focusedAppId).toBe(state.focusedAppId);
    }],
    ['SELECT_CAREER_STAGE selects an accepted stage and opens career on its route', (state) => {
      const next = portfolioReducer(state, { type: 'SELECT_CAREER_STAGE', stageId: 'skao' });
      expect(next).toMatchObject({ route: { kind: 'career' }, activeCareerStageId: 'skao', focusedAppId: 'career' });
    }],
    ['SELECT_PROJECT selects an accepted detail route and opens projects', (state) => {
      const next = portfolioReducer(state, { type: 'SELECT_PROJECT', projectId: 'safelog' });
      expect(next).toMatchObject({ route: { kind: 'project', projectId: 'safelog' }, activeProjectId: 'safelog', focusedAppId: 'projects' });
    }],
    ['RESET_LAYOUT discards all transient window and selection state', (state) => {
      const next = portfolioReducer(portfolioReducer(state, { type: 'SELECT_PROJECT', projectId: 'safelog' }), { type: 'RESET_LAYOUT' });
      expect(next).toEqual(createInitialPortfolioState());
    }],
  ];

  it.each(cases)('%s', (_name, exercise) => {
    const before = createInitialPortfolioState();
    exercise(before);
  });
});

describe('portfolioReducer no-ops', () => {
  it.each<readonly [string, PortfolioAction, ReturnType<typeof createInitialPortfolioState>]>([
    ['NAVIGATE to the existing desktop state', { type: 'NAVIGATE', route: { kind: 'desktop' } }, createInitialPortfolioState()],
    ['OPEN_APP for already focused command', { type: 'OPEN_APP', appId: 'command' }, createInitialPortfolioState()],
    ['FOCUS_WINDOW for a closed app', { type: 'FOCUS_WINDOW', appId: 'career' }, createInitialPortfolioState()],
    ['MINIMIZE_WINDOW for a closed app', { type: 'MINIMIZE_WINDOW', appId: 'career' }, createInitialPortfolioState()],
    ['CLOSE_WINDOW for a closed app', { type: 'CLOSE_WINDOW', appId: 'career' }, createInitialPortfolioState()],
    ['MOVE_WINDOW for a closed app', { type: 'MOVE_WINDOW', appId: 'career', position: { x: 1, y: 1 } }, createInitialPortfolioState()],
  ])('%s preserves the previous state reference', (_name, action, state) => {
    expect(portfolioReducer(state, action)).toBe(state);
  });
});
