import type { Point } from '../app/portfolioState';

export interface WindowSize {
  readonly width: number;
  readonly height: number;
}

export interface WindowWorkArea {
  readonly width: number;
  readonly height: number;
}

function finiteNonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function isFinitePoint(point: Point): boolean {
  return Number.isFinite(point.x) && Number.isFinite(point.y);
}

export function constrainWindowSize(size: WindowSize, workArea: WindowWorkArea): WindowSize {
  const areaWidth = finiteNonNegative(workArea.width);
  const areaHeight = finiteNonNegative(workArea.height);
  const requestedWidth = finiteNonNegative(size.width);
  const requestedHeight = finiteNonNegative(size.height);

  return {
    width: Math.min(requestedWidth, areaWidth),
    height: Math.min(requestedHeight, areaHeight),
  };
}

export function clampWindowPosition(
  candidate: Point,
  fallback: Point,
  size: WindowSize,
  workArea: WindowWorkArea,
): Point {
  const selected = isFinitePoint(candidate)
    ? candidate
    : isFinitePoint(fallback) ? fallback : { x: 0, y: 0 };
  const constrainedSize = constrainWindowSize(size, workArea);
  const areaWidth = finiteNonNegative(workArea.width);
  const areaHeight = finiteNonNegative(workArea.height);

  return {
    x: Math.min(Math.max(0, selected.x), Math.max(0, areaWidth - constrainedSize.width)),
    y: Math.min(Math.max(0, selected.y), Math.max(0, areaHeight - constrainedSize.height)),
  };
}
