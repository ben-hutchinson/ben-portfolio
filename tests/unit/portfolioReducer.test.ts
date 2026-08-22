import { describe, expect, it } from 'vitest';
import {
  createInitialPortfolioState,
  DEFAULT_WINDOW_POSITIONS,
  type PortfolioRoute,
  type PortfolioState,
} from '../../src/app/portfolioState';
import { portfolioReducer, type PortfolioAction } from '../../src/app/portfolioReducer';

const routeCases: readonly [PortfolioRoute, string, string | null][] = [
  [{ kind: 'desktop' }, 'desktop', null],
  [{ kind: 'work' }, 'work', 'work'],
  [{ kind: 'workDetail', workId: 'uv-ruff-migration' }, 'workDetail', 'work'],
  [{ kind: 'career' }, 'career', 'career'],
  [{ kind: 'projects' }, 'projects', 'projects'],
  [{ kind: 'project', projectId: 'pokeleximon' }, 'project', 'projects'],
  [{ kind: 'project', projectId: 'safelog' }, 'project', 'projects'],
  [{ kind: 'contact' }, 'contact', 'contact'],
];

function reduce(actions: readonly PortfolioAction[]) {
  return actions.reduce(portfolioReducer, createInitialPortfolioState());
}

function last<T>(values: readonly T[]): T | undefined {
  return values[values.length - 1];
}

function expectWindowInvariants(state: PortfolioState) {
  expect(new Set(state.openAppIds).size).toBe(state.openAppIds.length);
  expect(new Set(state.minimizedAppIds).size).toBe(state.minimizedAppIds.length);
  expect(new Set(state.windowOrder).size).toBe(state.windowOrder.length);
  expect(state.windowOrder.every((appId) => state.openAppIds.includes(appId))).toBe(true);
  expect(state.windowOrder.every((appId) => !state.minimizedAppIds.includes(appId))).toBe(true);
  expect(state.focusedAppId === null || state.openAppIds.includes(state.focusedAppId)).toBe(true);
  expect(state.focusedAppId === null || !state.minimizedAppIds.includes(state.focusedAppId)).toBe(true);
  expect(state.focusedAppId === null || last(state.windowOrder) === state.focusedAppId).toBe(true);
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
      openAppIds: ['about', 'work'],
      focusedAppId: 'about',
      minimizedAppIds: [],
      maximizedAppId: null,
      windowOrder: ['work', 'about'],
      windowPositions: DEFAULT_WINDOW_POSITIONS,
      activeCareerStageId: 'graduate',
      activeProjectId: null,
      activeWorkId: null,
    });
    expect(reset).toEqual(initial);
    expect(initial.windowPositions.work.y).toBeLessThan(initial.windowPositions.about.y);
    expect(Object.keys(initial.windowPositions)).toEqual(['about', 'work', 'career', 'projects', 'contact']);
    expect([...initial.openAppIds] as readonly string[]).not.toContain('command');
    expect([...initial.windowOrder] as readonly string[]).not.toContain('command');
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
      expect(last(state.windowOrder)).toBe(target);
      if (route.kind === 'project') expect(state.activeProjectId).toBe(route.projectId);
      if (route.kind === 'workDetail') expect(state.activeWorkId).toBe(route.workId);
      if (kind === 'projects') expect(state.activeProjectId).toBeNull();
      if (kind === 'work') expect(state.activeWorkId).toBeNull();
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
      expect(last(next.windowOrder)).toBe('about');
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
    ['MAXIMIZE_WINDOW and RESTORE_WINDOW preserve selected Work and Project detail routes', (state) => {
      const workDetail = portfolioReducer(state, { type: 'SELECT_WORK', workId: 'uv-ruff-migration' });
      const maximizedWork = portfolioReducer(workDetail, { type: 'MAXIMIZE_WINDOW', appId: 'work' });
      const restoredWork = portfolioReducer(maximizedWork, { type: 'RESTORE_WINDOW', appId: 'work' });
      expect(maximizedWork).toMatchObject({
        route: { kind: 'workDetail', workId: 'uv-ruff-migration' },
        activeWorkId: 'uv-ruff-migration',
        maximizedAppId: 'work',
      });
      expect(restoredWork).toMatchObject({
        route: { kind: 'workDetail', workId: 'uv-ruff-migration' },
        activeWorkId: 'uv-ruff-migration',
        maximizedAppId: null,
      });

      const projectDetail = portfolioReducer(state, { type: 'SELECT_PROJECT', projectId: 'safelog' });
      const maximizedProject = portfolioReducer(projectDetail, { type: 'MAXIMIZE_WINDOW', appId: 'projects' });
      const restoredProject = portfolioReducer(maximizedProject, { type: 'RESTORE_WINDOW', appId: 'projects' });
      expect(maximizedProject).toMatchObject({
        route: { kind: 'project', projectId: 'safelog' },
        activeProjectId: 'safelog',
        maximizedAppId: 'projects',
      });
      expect(restoredProject).toMatchObject({
        route: { kind: 'project', projectId: 'safelog' },
        activeProjectId: 'safelog',
        maximizedAppId: null,
      });
    }],
    ['RESTORE_WINDOW clears only the matching maximized state', (state) => {
      const moved = portfolioReducer(state, { type: 'MOVE_WINDOW', appId: 'work', position: { x: 144, y: 88 } });
      const maximized = portfolioReducer(moved, { type: 'MAXIMIZE_WINDOW', appId: 'work' });
      const next = portfolioReducer(maximized, { type: 'RESTORE_WINDOW', appId: 'work' });
      expect(next).toEqual({ ...maximized, maximizedAppId: null });
      expectWindowInvariants(next);
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
    ['SELECT_WORK selects an accepted detail route and opens Work', (state) => {
      const next = portfolioReducer(state, { type: 'SELECT_WORK', workId: 'uv-ruff-migration' } as never);
      expect(next).toMatchObject({
        route: { kind: 'workDetail', workId: 'uv-ruff-migration' },
        activeWorkId: 'uv-ruff-migration',
        focusedAppId: 'work',
      });
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
    ['OPEN_APP for already focused about', { type: 'OPEN_APP', appId: 'about' }, createInitialPortfolioState()],
    ['FOCUS_WINDOW for a closed app', { type: 'FOCUS_WINDOW', appId: 'career' }, createInitialPortfolioState()],
    ['MINIMIZE_WINDOW for a closed app', { type: 'MINIMIZE_WINDOW', appId: 'career' }, createInitialPortfolioState()],
    ['RESTORE_WINDOW for a normal app', { type: 'RESTORE_WINDOW', appId: 'work' }, createInitialPortfolioState()],
    ['CLOSE_WINDOW for a closed app', { type: 'CLOSE_WINDOW', appId: 'career' }, createInitialPortfolioState()],
    ['MOVE_WINDOW for a closed app', { type: 'MOVE_WINDOW', appId: 'career', position: { x: 1, y: 1 } }, createInitialPortfolioState()],
  ])('%s preserves the previous state reference', (_name, action, state) => {
    expect(portfolioReducer(state, action)).toBe(state);
  });

  it('returns the existing state for repeated career and project selections', () => {
    const career = portfolioReducer(createInitialPortfolioState(), {
      type: 'SELECT_CAREER_STAGE',
      stageId: 'skao',
    });
    const project = portfolioReducer(createInitialPortfolioState(), {
      type: 'SELECT_PROJECT',
      projectId: 'safelog',
    });

    expect(portfolioReducer(career, { type: 'SELECT_CAREER_STAGE', stageId: 'skao' })).toBe(career);
    expect(portfolioReducer(project, { type: 'SELECT_PROJECT', projectId: 'safelog' })).toBe(project);
  });

  it('does not duplicate, reopen, refocus, maximize, move, minimize, or close without a state change', () => {
    const initial = createInitialPortfolioState();
    const maximized = portfolioReducer(initial, { type: 'MAXIMIZE_WINDOW', appId: 'work' });
    const moved = portfolioReducer(initial, {
      type: 'MOVE_WINDOW',
      appId: 'work',
      position: initial.windowPositions.work,
    });
    const minimized = portfolioReducer(initial, { type: 'MINIMIZE_WINDOW', appId: 'work' });
    const closed = portfolioReducer(initial, { type: 'CLOSE_WINDOW', appId: 'work' });

    expect(portfolioReducer(initial, { type: 'OPEN_APP', appId: 'about' })).toBe(initial);
    expect(portfolioReducer(initial, { type: 'FOCUS_WINDOW', appId: 'about' })).toBe(initial);
    expect(portfolioReducer(maximized, { type: 'MAXIMIZE_WINDOW', appId: 'work' })).toBe(maximized);
    expect(moved).toBe(initial);
    expect(portfolioReducer(minimized, { type: 'MINIMIZE_WINDOW', appId: 'work' })).toBe(minimized);
    expect(portfolioReducer(closed, { type: 'CLOSE_WINDOW', appId: 'work' })).toBe(closed);
  });

  it('ignores impossible unrecognised selection identifiers', () => {
    const state = createInitialPortfolioState();
    expect(portfolioReducer(state, { type: 'SELECT_CAREER_STAGE', stageId: 'unknown' as never })).toBe(state);
    expect(portfolioReducer(state, { type: 'SELECT_PROJECT', projectId: 'unknown' as never })).toBe(state);
    expect(portfolioReducer(state, { type: 'SELECT_WORK', workId: 'unknown' } as never)).toBe(state);
  });
});

describe('portfolioReducer edge transitions', () => {
  it('keeps terminal-free window state while opening, focusing, maximizing, minimizing, and closing applications', () => {
    const work = portfolioReducer(createInitialPortfolioState(), { type: 'NAVIGATE', route: { kind: 'work' } });
    const openedAbout = portfolioReducer(work, { type: 'OPEN_APP', appId: 'about' });
    const maximizedContact = portfolioReducer(openedAbout, { type: 'MAXIMIZE_WINDOW', appId: 'contact' });
    const minimizedAbout = portfolioReducer(maximizedContact, { type: 'MINIMIZE_WINDOW', appId: 'about' });
    const closedContact = portfolioReducer(minimizedAbout, { type: 'CLOSE_WINDOW', appId: 'contact' });

    expect(openedAbout.route).toEqual({ kind: 'work' });
    expect(maximizedContact.route).toEqual({ kind: 'contact' });
    expect(minimizedAbout.route).toEqual({ kind: 'contact' });
    expect(closedContact.route).toEqual({ kind: 'desktop' });
    expect(maximizedContact.maximizedAppId).toBe('contact');
    expect(closedContact.maximizedAppId).toBeNull();
    expectWindowInvariants(closedContact);
  });

  it('minimizes a nonfocused app without changing the focused topmost app and clears a maximized target', () => {
    const focused = portfolioReducer(createInitialPortfolioState(), { type: 'FOCUS_WINDOW', appId: 'about' });
    const minimizedWork = portfolioReducer(focused, { type: 'MINIMIZE_WINDOW', appId: 'work' });
    const maximized = portfolioReducer(createInitialPortfolioState(), { type: 'MAXIMIZE_WINDOW', appId: 'work' });
    const minimizedMaximized = portfolioReducer(maximized, { type: 'MINIMIZE_WINDOW', appId: 'work' });

    expect(minimizedWork.focusedAppId).toBe('about');
    expect(last(minimizedWork.windowOrder)).toBe('about');
    expect(minimizedMaximized).toMatchObject({ route: { kind: 'desktop' }, maximizedAppId: null });
    expectWindowInvariants(minimizedMaximized);
  });

  it('closes minimized and non-route apps while retaining valid focus and selected content', () => {
    const selected = portfolioReducer(createInitialPortfolioState(), { type: 'SELECT_PROJECT', projectId: 'pokeleximon' });
    const minimized = portfolioReducer(selected, { type: 'MINIMIZE_WINDOW', appId: 'about' });
    const closedMinimized = portfolioReducer(minimized, { type: 'CLOSE_WINDOW', appId: 'about' });
    const closedOther = portfolioReducer(closedMinimized, { type: 'CLOSE_WINDOW', appId: 'work' });

    expect(closedMinimized.activeProjectId).toBe('pokeleximon');
    expect(closedOther.route).toEqual({ kind: 'project', projectId: 'pokeleximon' });
    expect(closedOther.focusedAppId).toBe('projects');
    expectWindowInvariants(closedOther);
  });

  it('keeps a career selection when navigating career and clears a project detail when navigating its catalogue', () => {
    const career = portfolioReducer(
      portfolioReducer(createInitialPortfolioState(), { type: 'SELECT_CAREER_STAGE', stageId: 'observability' }),
      { type: 'NAVIGATE', route: { kind: 'career' } },
    );
    const project = portfolioReducer(createInitialPortfolioState(), { type: 'SELECT_PROJECT', projectId: 'safelog' });
    const catalogue = portfolioReducer(project, { type: 'NAVIGATE', route: { kind: 'projects' } });
    const workDetail = portfolioReducer(createInitialPortfolioState(), { type: 'SELECT_WORK', workId: 'uv-ruff-migration' } as never);
    const workCatalogue = portfolioReducer(workDetail, { type: 'NAVIGATE', route: { kind: 'work' } });

    expect(career.activeCareerStageId).toBe('observability');
    expect(catalogue).toMatchObject({ route: { kind: 'projects' }, activeProjectId: null, focusedAppId: 'projects' });
    expect(workCatalogue).toMatchObject({ route: { kind: 'work' }, activeWorkId: null, focusedAppId: 'work' });
  });

  it('navigates to an already current route without changing its state reference', () => {
    const state = portfolioReducer(createInitialPortfolioState(), { type: 'NAVIGATE', route: { kind: 'contact' } });
    expect(portfolioReducer(state, { type: 'NAVIGATE', route: { kind: 'contact' } })).toBe(state);
  });
});
