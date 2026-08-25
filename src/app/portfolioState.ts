import type { AppId, CareerStageId, ProjectId } from '../data/models';
import type { WorkId } from '../data/work';

export interface Point {
  readonly x: number;
  readonly y: number;
}

export type PortfolioRoute =
  | { readonly kind: 'desktop' }
  | { readonly kind: 'work' }
  | { readonly kind: 'workDetail'; readonly workId: WorkId }
  | { readonly kind: 'career' }
  | { readonly kind: 'projects' }
  | { readonly kind: 'project'; readonly projectId: ProjectId }
  | { readonly kind: 'contact' };

export interface PortfolioState {
  readonly route: PortfolioRoute;
  readonly openAppIds: readonly AppId[];
  readonly focusedAppId: AppId | null;
  readonly minimizedAppIds: readonly AppId[];
  readonly maximizedAppId: AppId | null;
  readonly windowOrder: readonly AppId[];
  readonly windowPositions: Readonly<Record<AppId, Point>>;
  readonly activeCareerStageId: CareerStageId;
  readonly activeProjectId: ProjectId | null;
  readonly activeWorkId: WorkId | null;
}

export const DEFAULT_WINDOW_POSITIONS: Readonly<Record<AppId, Point>> = {
  about: { x: 220, y: 300 },
  work: { x: 650, y: 36 },
  career: { x: 72, y: 104 },
  projects: { x: 240, y: 120 },
  contact: { x: 360, y: 152 },
};

export function createInitialPortfolioState(): PortfolioState {
  return {
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
  };
}
