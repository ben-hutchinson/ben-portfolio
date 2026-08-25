import { useCallback, useEffect, useRef, useState, type PointerEventHandler } from 'react';
import type { AppId } from '../data/models';
import type { Point } from '../app/portfolioState';
import {
  clampWindowPosition,
  type WindowSize,
  type WindowWorkArea,
} from '../utils/windowGeometry';

export interface UseWindowDragOptions {
  readonly appId: AppId;
  readonly position: Point;
  readonly size: WindowSize;
  readonly workArea: WindowWorkArea;
  readonly enabled: boolean;
  readonly onFocus: () => void;
  readonly onPositionChange: (position: Point) => void;
}

export interface UseWindowDragResult {
  readonly isDragging: boolean;
  readonly onTitleBarPointerDown: PointerEventHandler<HTMLElement>;
}

interface ActiveDrag {
  readonly pointerId: number;
  readonly offset: Point;
  readonly titleBar: HTMLElement;
}

export function useWindowDrag(options: UseWindowDragOptions): UseWindowDragResult {
  const optionsRef = useRef(options);
  const activeDragRef = useRef<ActiveDrag | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  optionsRef.current = options;

  const endDrag = useCallback((pointerId?: number) => {
    const active = activeDragRef.current;
    if (active === null || (pointerId !== undefined && active.pointerId !== pointerId)) return;

    const { titleBar } = active;
    try {
      if (typeof titleBar.releasePointerCapture === 'function'
        && (typeof titleBar.hasPointerCapture !== 'function' || titleBar.hasPointerCapture(active.pointerId))) {
        titleBar.releasePointerCapture(active.pointerId);
      }
    } catch {
      // Capture can already be released when the pointer leaves the document.
    }

    activeDragRef.current = null;
    setIsDragging(false);
  }, []);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    const active = activeDragRef.current;
    if (active === null || event.pointerId !== active.pointerId) return;
    const current = optionsRef.current;
    const nextPosition = clampWindowPosition(
      { x: event.clientX - active.offset.x, y: event.clientY - active.offset.y },
      current.position,
      current.size,
      current.workArea,
    );
    current.onPositionChange(nextPosition);
  }, []);

  const handlePointerEnd = useCallback((event: PointerEvent) => {
    endDrag(event.pointerId);
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerEnd);
    document.removeEventListener('pointercancel', handlePointerEnd);
  }, [endDrag, handlePointerMove]);

  const removeDocumentListeners = useCallback(() => {
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerEnd);
    document.removeEventListener('pointercancel', handlePointerEnd);
  }, [handlePointerEnd, handlePointerMove]);

  const onTitleBarPointerDown = useCallback<PointerEventHandler<HTMLElement>>((event) => {
    const current = optionsRef.current;
    if (!current.enabled || event.button !== 0) return;

    removeDocumentListeners();
    endDrag();
    current.onFocus();
    activeDragRef.current = {
      pointerId: event.pointerId,
      offset: {
        x: event.clientX - current.position.x,
        y: event.clientY - current.position.y,
      },
      titleBar: event.currentTarget,
    };

    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {
      // Document listeners preserve dragging where pointer capture is unavailable.
    }

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerEnd);
    document.addEventListener('pointercancel', handlePointerEnd);
    setIsDragging(true);
  }, [endDrag, handlePointerEnd, handlePointerMove, removeDocumentListeners]);

  useEffect(() => {
    if (!options.enabled) {
      endDrag();
      removeDocumentListeners();
    }
  }, [endDrag, options.enabled, removeDocumentListeners]);

  useEffect(() => () => {
    endDrag();
    removeDocumentListeners();
  }, [endDrag, removeDocumentListeners]);

  return { isDragging, onTitleBarPointerDown };
}
