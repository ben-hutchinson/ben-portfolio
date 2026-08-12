import { useCallback, useEffect, useLayoutEffect, useRef, useState, type JSX, type ReactNode } from 'react';
import { AboutApp } from '../apps/about/AboutApp';
import { CareerApp } from '../apps/career/CareerApp';
import { FeaturedWork } from '../apps/work/FeaturedWork';
import { WorkApp } from '../apps/work/WorkApp';
import { usePortfolio } from '../app/PortfolioContext';
import type { PortfolioState } from '../app/portfolioState';
import type { AppId } from '../data/models';
import { clampWindowPosition, type WindowSize, type WindowWorkArea } from '../utils/windowGeometry';
import { WindowFrame } from './WindowFrame';
import styles from './WindowLayer.module.css';

export const WINDOW_APP_ORDER = ['about', 'work', 'career', 'projects', 'contact', 'command'] as const;

const WINDOW_TITLES: Readonly<Record<AppId, string>> = {
  about: 'About',
  work: 'Work',
  career: 'Career',
  projects: 'Projects',
  contact: 'Contact',
  command: 'Command',
};

const WINDOW_SIZES: Readonly<Record<AppId, WindowSize>> = {
  about: { width: 520, height: 360 },
  work: { width: 620, height: 340 },
  career: { width: 1080, height: 650 },
  projects: { width: 520, height: 320 },
  contact: { width: 480, height: 300 },
  command: { width: 540, height: 220 },
};

function appContent(appId: AppId, isWorkRoute: boolean): ReactNode {
  switch (appId) {
    case 'about':
      return <AboutApp />;
    case 'work':
      return isWorkRoute ? <WorkApp /> : <FeaturedWork />;
    case 'career':
      return <CareerApp />;
    case 'command':
      return (
        <div className={styles.appContent}>
          <p className={styles.eyebrow}>Command</p>
          <p>The command application is available as an optional way to explore this portfolio.</p>
        </div>
      );
    case 'projects':
    case 'contact':
      return (
        <div className={styles.appContent}>
          <p>This application is ready to open. Its full content arrives in the next portfolio section.</p>
        </div>
      );
  }
}

function getWorkArea(element: HTMLElement | null): WindowWorkArea {
  if (element === null) return { width: 0, height: 0 };
  const rect = element.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

function getDesktopCapability(): { finePointer: boolean; wideViewport: boolean } {
  return {
    finePointer: typeof window.matchMedia === 'function'
      && window.matchMedia('(pointer: fine)').matches,
    wideViewport: window.innerWidth >= 768,
  };
}

function visibleAppIds(state: PortfolioState): readonly AppId[] {
  return WINDOW_APP_ORDER.filter((appId) => (
    state.openAppIds.includes(appId) && !state.minimizedAppIds.includes(appId)
  ));
}

function focusFrameHeading(appId: AppId): void {
  const frame = document.querySelector<HTMLElement>(`[data-window-id="${appId}"]`);
  const heading = frame?.querySelector<HTMLElement>('h2');
  const firstControl = frame?.querySelector<HTMLElement>('[data-window-control]');
  (heading ?? firstControl)?.focus();
}

export function WindowLayer(): JSX.Element {
  const { state, dispatch } = usePortfolio();
  const layerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  const previousVisibleRef = useRef<readonly AppId[]>(visibleAppIds(state));
  const previousMaximizedRef = useRef<AppId | null>(state.maximizedAppId);
  const pendingFocusFallbackRef = useRef<AppId | null>(null);
  const [workArea, setWorkArea] = useState<WindowWorkArea>(() => getWorkArea(null));
  const [capability, setCapability] = useState(getDesktopCapability);
  stateRef.current = state;

  const desktopCapable = capability.finePointer && capability.wideViewport;
  const desktopCapableRef = useRef(desktopCapable);
  desktopCapableRef.current = desktopCapable;
  const allVisibleIds = visibleAppIds(state);
  const activeDisplayedIds = desktopCapable
    ? allVisibleIds
    : allVisibleIds.filter((appId) => appId === state.focusedAppId).slice(0, 1);
  const displayedIds = activeDisplayedIds.length > 0
    ? activeDisplayedIds
    : desktopCapable ? activeDisplayedIds : allVisibleIds.slice(0, 1);

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');
    const updateCapability = () => setCapability({
      finePointer: media.matches,
      wideViewport: window.innerWidth >= 768,
    });

    updateCapability();
    if (typeof media.addEventListener === 'function') media.addEventListener('change', updateCapability);
    else media.addListener(updateCapability);
    window.addEventListener('resize', updateCapability);
    return () => {
      if (typeof media.removeEventListener === 'function') media.removeEventListener('change', updateCapability);
      else media.removeListener(updateCapability);
      window.removeEventListener('resize', updateCapability);
    };
  }, []);

  useLayoutEffect(() => {
    const element = layerRef.current;
    if (element === null) return undefined;

    const updateWorkArea = (next: WindowWorkArea) => {
      setWorkArea((current) => (
        current.width === next.width && current.height === next.height ? current : next
      ));
    };
    if (desktopCapableRef.current) updateWorkArea(getWorkArea(element));

    if (typeof ResizeObserver !== 'function') return undefined;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry && desktopCapableRef.current) {
        updateWorkArea({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const frames = layerRef.current?.querySelectorAll<HTMLElement>('[data-window-id]') ?? [];
    for (const frame of frames) {
      const isMobileInactive = !capability.wideViewport
        && frame.dataset.windowId !== state.focusedAppId;
      frame.style.display = isMobileInactive ? 'none' : '';
    }
  }, [capability.wideViewport, state.focusedAppId, state.openAppIds, state.minimizedAppIds]);

  useEffect(() => {
    if (!desktopCapable || workArea.width <= 0 || workArea.height <= 0) return;
    for (const appId of visibleAppIds(state)) {
      if (state.maximizedAppId === appId) continue;
      const current = state.windowPositions[appId];
      const normalized = clampWindowPosition(current, current, WINDOW_SIZES[appId], workArea);
      if (normalized.x !== current.x || normalized.y !== current.y) {
        dispatch({ type: 'MOVE_WINDOW', appId, position: normalized });
      }
    }
  }, [desktopCapable, dispatch, state, workArea]);

  useLayoutEffect(() => {
    const pendingFallback = pendingFocusFallbackRef.current;
    if (pendingFallback !== null) {
      pendingFocusFallbackRef.current = null;
      const activeElement = document.activeElement;
      if (activeElement === document.body || activeElement === null) {
        const dockControl = document.querySelector<HTMLButtonElement>(
          `[data-dock-app-id="${pendingFallback}"]`,
        );
        if (dockControl && !dockControl.disabled) dockControl.focus();
        else document.getElementById('main-content')?.focus();
      }
    }

    const previousVisible = previousVisibleRef.current;
    const newlyDisplayed = displayedIds.find((appId) => !previousVisible.includes(appId));
    const restored = previousMaximizedRef.current !== null
      && previousMaximizedRef.current === state.focusedAppId
      && state.maximizedAppId !== previousMaximizedRef.current
      ? previousMaximizedRef.current
      : null;
    const focusTarget = newlyDisplayed ?? restored;
    if (focusTarget !== undefined && focusTarget !== null) {
      const activeElement = document.activeElement;
      const dockControl = document.querySelector(`[data-dock-app-id="${focusTarget}"]`);
      const resetControl = document.querySelector('[data-window-control="reset-layout"]');
      const frame = document.querySelector(`[data-window-id="${focusTarget}"]`);
      const restoredFromInsideFrame = restored !== null && frame?.contains(activeElement);
      if (activeElement === dockControl || activeElement === resetControl || restoredFromInsideFrame) {
        focusFrameHeading(focusTarget);
      }
    }

    previousVisibleRef.current = displayedIds;
    previousMaximizedRef.current = state.maximizedAppId;
  }, [displayedIds, state.focusedAppId, state.maximizedAppId]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const maximizedAppId = stateRef.current.maximizedAppId;
      if (maximizedAppId === null || !(event.target instanceof Node)) return;
      const frame = document.querySelector(`[data-window-id="${maximizedAppId}"]`);
      if (!frame?.contains(event.target)) return;
      event.preventDefault();
      dispatch({ type: 'RESTORE_WINDOW', appId: maximizedAppId });
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [dispatch]);

  const hideWindow = useCallback((appId: AppId, type: 'CLOSE_WINDOW' | 'MINIMIZE_WINDOW') => {
    const frame = document.querySelector(`[data-window-id="${appId}"]`);
    if (frame?.contains(document.activeElement)) pendingFocusFallbackRef.current = appId;
    dispatch({ type, appId });
  }, [dispatch]);

  return (
    <div
      className={styles.layer}
      data-desktop-windows={desktopCapable || undefined}
      data-mobile-windows={!capability.wideViewport || undefined}
      ref={layerRef}
    >
      {allVisibleIds.map((appId) => {
        const title = WINDOW_TITLES[appId];
        const isMaximized = state.maximizedAppId === appId;
        const size = appId === 'work' && state.route.kind === 'work'
          ? { width: 1040, height: 650 }
          : WINDOW_SIZES[appId];
        return (
          <WindowFrame
            appId={appId}
            title={title}
            position={state.windowPositions[appId]}
            size={size}
            workArea={workArea}
            zIndex={state.windowOrder.indexOf(appId) + 1}
            isFocused={state.focusedAppId === appId}
            isMaximized={isMaximized}
            dragEnabled={desktopCapable}
            onFocus={() => dispatch({ type: 'FOCUS_WINDOW', appId })}
            onPositionChange={(position) => dispatch({ type: 'MOVE_WINDOW', appId, position })}
            onClose={() => hideWindow(appId, 'CLOSE_WINDOW')}
            onMinimize={() => hideWindow(appId, 'MINIMIZE_WINDOW')}
            onMaximize={() => {
              dispatch({ type: isMaximized ? 'RESTORE_WINDOW' : 'MAXIMIZE_WINDOW', appId });
            }}
            key={appId}
          >
            {appContent(appId, state.route.kind === 'work')}
          </WindowFrame>
        );
      })}
      <div className={styles.utilities}>
        <button
          className={styles.resetButton}
          type="button"
          data-window-control="reset-layout"
          onClick={() => dispatch({ type: 'RESET_LAYOUT' })}
        >
          Reset layout
        </button>
      </div>
    </div>
  );
}
