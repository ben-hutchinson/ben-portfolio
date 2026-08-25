import { describe, expect, it } from 'vitest';
import {
  clampWindowPosition,
  constrainWindowSize,
  type WindowSize,
  type WindowWorkArea,
} from '../../src/utils/windowGeometry';

function expectFiniteBoundedSize(size: WindowSize, workArea: WindowWorkArea) {
  expect(Number.isFinite(size.width)).toBe(true);
  expect(Number.isFinite(size.height)).toBe(true);
  expect(size.width).toBeGreaterThanOrEqual(0);
  expect(size.height).toBeGreaterThanOrEqual(0);
  expect(size.width).toBeLessThanOrEqual(Math.max(0, Number.isFinite(workArea.width) ? workArea.width : 0));
  expect(size.height).toBeLessThanOrEqual(Math.max(0, Number.isFinite(workArea.height) ? workArea.height : 0));
}

function expectFiniteBoundedPoint(
  point: { x: number; y: number },
  size: WindowSize,
  workArea: WindowWorkArea,
) {
  const constrained = constrainWindowSize(size, workArea);
  expect(Number.isFinite(point.x)).toBe(true);
  expect(Number.isFinite(point.y)).toBe(true);
  expect(point.x).toBeGreaterThanOrEqual(0);
  expect(point.y).toBeGreaterThanOrEqual(0);
  expect(point.x).toBeLessThanOrEqual(Math.max(0, workArea.width - constrained.width));
  expect(point.y).toBeLessThanOrEqual(Math.max(0, workArea.height - constrained.height));
}

describe('windowGeometry', () => {
  it.each([
    { name: 'normal requested dimensions', size: { width: 480, height: 320 }, workArea: { width: 1200, height: 800 }, expected: { width: 480, height: 320 } },
    { name: 'an oversized window', size: { width: 1600, height: 1000 }, workArea: { width: 1200, height: 800 }, expected: { width: 1200, height: 800 } },
    { name: 'a work-area shrink', size: { width: 640, height: 480 }, workArea: { width: 375, height: 280 }, expected: { width: 375, height: 280 } },
    { name: 'zero and negative requested dimensions', size: { width: 0, height: -20 }, workArea: { width: 1200, height: 800 }, expected: { width: 0, height: 0 } },
    { name: 'an empty work area', size: { width: 480, height: 320 }, workArea: { width: 0, height: -1 }, expected: { width: 0, height: 0 } },
    { name: 'non-finite runtime measurements', size: { width: Number.POSITIVE_INFINITY, height: Number.NaN }, workArea: { width: Number.POSITIVE_INFINITY, height: Number.NaN }, expected: { width: 0, height: 0 } },
  ])('constrains $name to finite recoverable dimensions', ({ size, workArea, expected }) => {
    const constrained = constrainWindowSize(size, workArea);

    expect(constrained).toEqual(expected);
    expectFiniteBoundedSize(constrained, workArea);
  });

  it.each([
    {
      name: 'a normal finite candidate',
      candidate: { x: 48, y: 72 }, fallback: { x: 1, y: 1 }, size: { width: 480, height: 320 }, workArea: { width: 1200, height: 800 },
      expected: { x: 48, y: 72 },
    },
    {
      name: 'left and top edges',
      candidate: { x: -100, y: -1 }, fallback: { x: 1, y: 1 }, size: { width: 480, height: 320 }, workArea: { width: 1200, height: 800 },
      expected: { x: 0, y: 0 },
    },
    {
      name: 'exact right and bottom edges',
      candidate: { x: 9000, y: 9000 }, fallback: { x: 1, y: 1 }, size: { width: 480, height: 320 }, workArea: { width: 1200, height: 800 },
      expected: { x: 720, y: 480 },
    },
    {
      name: 'an oversized requested window',
      candidate: { x: 400, y: 100 }, fallback: { x: 1, y: 1 }, size: { width: 1600, height: 1000 }, workArea: { width: 1200, height: 800 },
      expected: { x: 0, y: 0 },
    },
    {
      name: 'a valid fallback after invalid candidate input',
      candidate: { x: Number.NaN, y: Number.POSITIVE_INFINITY }, fallback: { x: 620, y: 96 }, size: { width: 480, height: 320 }, workArea: { width: 1200, height: 800 },
      expected: { x: 620, y: 96 },
    },
    {
      name: 'zero, negative, and non-finite candidates and fallbacks',
      candidate: { x: Number.NEGATIVE_INFINITY, y: Number.NaN }, fallback: { x: Number.POSITIVE_INFINITY, y: Number.NaN }, size: { width: Number.NaN, height: -1 }, workArea: { width: -20, height: Number.POSITIVE_INFINITY },
      expected: { x: 0, y: 0 },
    },
  ])('clamps $name without emitting unrecoverable coordinates', ({ candidate, fallback, size, workArea, expected }) => {
    const position = clampWindowPosition(candidate, fallback, size, workArea);

    expect(position).toEqual(expected);
    expectFiniteBoundedPoint(position, size, workArea);
  });
});
