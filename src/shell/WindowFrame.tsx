import type { JSX, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import type { AppId } from '../data/models';
import type { Point } from '../app/portfolioState';
import { useWindowDrag } from '../hooks/useWindowDrag';
import { constrainWindowSize, type WindowSize, type WindowWorkArea } from '../utils/windowGeometry';
import styles from './WindowFrame.module.css';

export interface WindowFrameProps {
  readonly appId: AppId;
  readonly title: string;
  readonly children: ReactNode;
  readonly position: Point;
  readonly size: WindowSize;
  readonly workArea: WindowWorkArea;
  readonly zIndex: number;
  readonly isFocused: boolean;
  readonly isMaximized: boolean;
  readonly dragEnabled: boolean;
  readonly onFocus: () => void;
  readonly onPositionChange: (position: Point) => void;
  readonly onClose: () => void;
  readonly onMinimize: () => void;
  readonly onMaximize: () => void;
}

export function WindowFrame({
  appId,
  title,
  children,
  position,
  size,
  workArea,
  zIndex,
  isFocused,
  isMaximized,
  dragEnabled,
  onFocus,
  onPositionChange,
  onClose,
  onMinimize,
  onMaximize,
}: WindowFrameProps): JSX.Element {
  const titleId = `window-title-${appId}`;
  const constrainedSize = constrainWindowSize(size, workArea);
  const drag = useWindowDrag({
    appId,
    position,
    size: constrainedSize,
    workArea,
    enabled: dragEnabled && !isMaximized,
    onFocus,
    onPositionChange,
  });
  const stopControlPointer = (event: ReactPointerEvent<HTMLButtonElement>) => event.stopPropagation();
  const frameStyle = isMaximized
    ? { zIndex }
    : {
        zIndex,
        width: constrainedSize.width || undefined,
        height: constrainedSize.height || undefined,
        transform: dragEnabled ? `translate(${position.x}px, ${position.y}px)` : undefined,
      };

  return (
    <section
      className={styles.frame}
      aria-labelledby={titleId}
      data-window-id={appId}
      data-focused={isFocused || undefined}
      data-maximized={isMaximized || undefined}
      data-drag-enabled={dragEnabled || undefined}
      data-dragging={drag.isDragging || undefined}
      style={frameStyle}
      onFocusCapture={onFocus}
      onPointerDown={(event) => {
        if (!(event.target as Element).closest('[data-titlebar]')) onFocus();
      }}
    >
      <div
        className={styles.titleBar}
        data-titlebar={appId}
        onPointerDown={drag.onTitleBarPointerDown}
      >
        <h2 className={styles.title} id={titleId} tabIndex={-1}>{title}</h2>
        <div className={styles.controls}>
          <button
            className={styles.control}
            type="button"
            aria-label={`Close ${title}`}
            data-window-control="close"
            onPointerDown={stopControlPointer}
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
          <button
            className={styles.control}
            type="button"
            aria-label={`Minimize ${title}`}
            data-window-control="minimize"
            onPointerDown={stopControlPointer}
            onClick={onMinimize}
          >
            <span aria-hidden="true">−</span>
          </button>
          <button
            className={styles.control}
            type="button"
            aria-label={`${isMaximized ? 'Restore' : 'Maximize'} ${title}`}
            data-window-control="maximize"
            onPointerDown={stopControlPointer}
            onClick={onMaximize}
          >
            <span aria-hidden="true">{isMaximized ? '◱' : '□'}</span>
          </button>
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
