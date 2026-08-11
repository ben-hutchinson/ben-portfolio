import type { AppId, CareerStageId, ProjectId } from '../data/models';
import {
  createInitialPortfolioState,
  type Point,
  type PortfolioRoute,
  type PortfolioState,
} from './portfolioState';

const CAREER_STAGE_IDS: readonly CareerStageId[] = ['graduate', 'observability', 'associate', 'skao'];
const PROJECT_IDS: readonly ProjectId[] = ['pokeleximon', 'safelog'];

export type PortfolioAction =
  | { type: 'NAVIGATE'; route: PortfolioRoute }
  | { type: 'OPEN_APP'; appId: AppId }
  | { type: 'FOCUS_WINDOW'; appId: AppId }
  | { type: 'MINIMIZE_WINDOW'; appId: AppId }
  | { type: 'MAXIMIZE_WINDOW'; appId: AppId }
  | { type: 'CLOSE_WINDOW'; appId: AppId }
  | { type: 'MOVE_WINDOW'; appId: AppId; position: Point }
  | { type: 'SELECT_CAREER_STAGE'; stageId: CareerStageId }
  | { type: 'SELECT_PROJECT'; projectId: ProjectId }
  | { type: 'RESET_LAYOUT' };

function routesEqual(left: PortfolioRoute, right: PortfolioRoute): boolean {
  return left.kind === right.kind
    && (left.kind !== 'project' || (right.kind === 'project' && left.projectId === right.projectId));
}

function without<T>(values: readonly T[], value: T): readonly T[] {
  return values.filter((candidate) => candidate !== value);
}

function addOnce<T>(values: readonly T[], value: T): readonly T[] {
  return values.includes(value) ? values : [...values, value];
}

function moveToEnd<T>(values: readonly T[], value: T): readonly T[] {
  if (values[values.length - 1] === value) return values;
  return [...without(values, value), value];
}

function appRoute(appId: AppId): PortfolioRoute | null {
  switch (appId) {
    case 'work':
      return { kind: 'work' };
    case 'career':
      return { kind: 'career' };
    case 'projects':
      return { kind: 'projects' };
    case 'contact':
      return { kind: 'contact' };
    case 'about':
    case 'command':
      return null;
  }
}

function routeTarget(route: PortfolioRoute): AppId | null {
  switch (route.kind) {
    case 'work':
    case 'career':
    case 'projects':
    case 'contact':
      return route.kind;
    case 'project':
      return 'projects';
    case 'desktop':
      return null;
  }
}

function isInitialState(state: PortfolioState): boolean {
  const initial = createInitialPortfolioState();
  return routesEqual(state.route, initial.route)
    && state.focusedAppId === initial.focusedAppId
    && state.maximizedAppId === initial.maximizedAppId
    && state.activeCareerStageId === initial.activeCareerStageId
    && state.activeProjectId === initial.activeProjectId
    && state.openAppIds.length === initial.openAppIds.length
    && state.openAppIds.every((value, index) => value === initial.openAppIds[index])
    && state.minimizedAppIds.length === 0
    && state.windowOrder.length === initial.windowOrder.length
    && state.windowOrder.every((value, index) => value === initial.windowOrder[index])
    && Object.keys(initial.windowPositions).every((appId) => {
      const id = appId as AppId;
      return state.windowPositions[id].x === initial.windowPositions[id].x
        && state.windowPositions[id].y === initial.windowPositions[id].y;
    });
}

function openAndFocus(
  state: PortfolioState,
  appId: AppId,
  route: PortfolioRoute,
  maximizedAppId: AppId | null,
  activeProjectId: ProjectId | null = state.activeProjectId,
): PortfolioState {
  const openAppIds = addOnce(state.openAppIds, appId);
  const minimizedAppIds = without(state.minimizedAppIds, appId);
  const windowOrder = moveToEnd(state.windowOrder, appId);
  const unchanged = routesEqual(state.route, route)
    && openAppIds === state.openAppIds
    && minimizedAppIds.length === state.minimizedAppIds.length
    && windowOrder === state.windowOrder
    && state.focusedAppId === appId
    && state.maximizedAppId === maximizedAppId
    && state.activeProjectId === activeProjectId;

  if (unchanged) return state;
  return {
    ...state,
    route,
    openAppIds,
    focusedAppId: appId,
    minimizedAppIds,
    maximizedAppId,
    windowOrder,
    activeProjectId,
  };
}

function routeForOpen(state: PortfolioState, appId: AppId): PortfolioRoute {
  return appRoute(appId) ?? state.route;
}

export function portfolioReducer(state: PortfolioState, action: PortfolioAction): PortfolioState {
  switch (action.type) {
    case 'NAVIGATE': {
      if (action.route.kind === 'desktop') {
        return isInitialState(state) ? state : createInitialPortfolioState();
      }
      const target = routeTarget(action.route);
      if (target === null) return state;
      const projectId = action.route.kind === 'project'
        ? action.route.projectId
        : action.route.kind === 'projects' ? null : state.activeProjectId;
      const maximizedAppId = state.maximizedAppId === target ? target : null;
      return openAndFocus(state, target, action.route, maximizedAppId, projectId);
    }
    case 'OPEN_APP': {
      const route = routeForOpen(state, action.appId);
      const projectId = action.appId === 'projects' ? null : state.activeProjectId;
      const maximizedAppId = state.maximizedAppId === action.appId ? action.appId : null;
      return openAndFocus(state, action.appId, route, maximizedAppId, projectId);
    }
    case 'FOCUS_WINDOW': {
      if (!state.openAppIds.includes(action.appId) || state.minimizedAppIds.includes(action.appId)) return state;
      const windowOrder = moveToEnd(state.windowOrder, action.appId);
      const maximizedAppId = state.maximizedAppId === action.appId ? action.appId : null;
      if (state.focusedAppId === action.appId && windowOrder === state.windowOrder && maximizedAppId === state.maximizedAppId) return state;
      return { ...state, focusedAppId: action.appId, maximizedAppId, windowOrder };
    }
    case 'MINIMIZE_WINDOW': {
      if (!state.openAppIds.includes(action.appId) || state.minimizedAppIds.includes(action.appId)) return state;
      const minimizedAppIds = [...state.minimizedAppIds, action.appId];
      const windowOrder = without(state.windowOrder, action.appId);
      const focusedAppId = windowOrder[windowOrder.length - 1] ?? null;
      const route = routeTarget(state.route) === action.appId ? { kind: 'desktop' } as const : state.route;
      return {
        ...state,
        route,
        focusedAppId,
        minimizedAppIds,
        maximizedAppId: state.maximizedAppId === action.appId ? null : state.maximizedAppId,
        windowOrder,
      };
    }
    case 'MAXIMIZE_WINDOW': {
      const route = routeForOpen(state, action.appId);
      const projectId = action.appId === 'projects' ? null : state.activeProjectId;
      return openAndFocus(state, action.appId, route, action.appId, projectId);
    }
    case 'CLOSE_WINDOW': {
      if (!state.openAppIds.includes(action.appId)) return state;
      const openAppIds = without(state.openAppIds, action.appId);
      const minimizedAppIds = without(state.minimizedAppIds, action.appId);
      const windowOrder = without(state.windowOrder, action.appId);
      const focusedAppId = windowOrder[windowOrder.length - 1] ?? null;
      const route = routeTarget(state.route) === action.appId ? { kind: 'desktop' } as const : state.route;
      return {
        ...state,
        route,
        openAppIds,
        focusedAppId,
        minimizedAppIds,
        maximizedAppId: state.maximizedAppId === action.appId ? null : state.maximizedAppId,
        windowOrder,
      };
    }
    case 'MOVE_WINDOW': {
      if (!state.openAppIds.includes(action.appId)) return state;
      const previous = state.windowPositions[action.appId];
      if (previous.x === action.position.x && previous.y === action.position.y) return state;
      return {
        ...state,
        windowPositions: { ...state.windowPositions, [action.appId]: action.position },
      };
    }
    case 'SELECT_CAREER_STAGE': {
      if (!CAREER_STAGE_IDS.includes(action.stageId)) return state;
      const next = openAndFocus(
        state,
        'career',
        { kind: 'career' },
        state.maximizedAppId === 'career' ? 'career' : null,
      );
      if (next.activeCareerStageId === action.stageId) return next;
      return { ...next, activeCareerStageId: action.stageId };
    }
    case 'SELECT_PROJECT':
      if (!PROJECT_IDS.includes(action.projectId)) return state;
      return openAndFocus(
        state,
        'projects',
        { kind: 'project', projectId: action.projectId },
        state.maximizedAppId === 'projects' ? 'projects' : null,
        action.projectId,
      );
    case 'RESET_LAYOUT':
      return isInitialState(state) ? state : createInitialPortfolioState();
  }
}
