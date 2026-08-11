# PORT-005 — Implement a recoverable, accessible window system

Status: IN_TEST

Requirement links:

- [PRD §8 — Explorer journey](../PRD.md#8-core-user-journeys), [§9 — Operating-system shell and Mobile](../PRD.md#9-functional-requirements), [§10 — Accessibility and Reliability](../PRD.md#10-non-functional-requirements), [§11 — Technical Direction](../PRD.md#11-technical-direction), and [§13 — Release Acceptance](../PRD.md#13-release-acceptance)
- [DESIGN §5 — Shell Anatomy, Default composition](../DESIGN.md#5-shell-anatomy), [§6 — Window System](../DESIGN.md#6-window-system), and [§12 — Application Architecture](../DESIGN.md#12-application-architecture)
- [AGENTS §8 — State Architecture](../AGENTS.md#8-state-architecture), [§9 — Component Boundaries](../AGENTS.md#9-component-boundaries), [§11 — Interaction Rules](../AGENTS.md#11-interaction-rules), [§12 — Accessibility Gates](../AGENTS.md#12-accessibility-gates), [§13 — Responsive Rules](../AGENTS.md#13-responsive-rules), and [§18 — Testing Expectations](../AGENTS.md#18-testing-expectations)
- [Implementation plan — Task 5](../superpowers/plans/2026-08-11-portfolio-os-implementation.md#task-5-implement-the-recoverable-window-system)

User outcome: A visitor can explore playful desktop windows on capable screens, then always recover, operate, and reach the same content with keyboard, dock, and mobile controls without relying on drag.

Dependencies: PORT-001, PORT-002, PORT-003, and PORT-004 are accepted. PORT-003 at `16b51b7` remains the state, hash, and default-layout contract, with the narrow `RESTORE_WINDOW` action amendment recorded below. PORT-004 at `11c45c9` is the accepted semantic shell.

## Scope and ownership

In scope:

| File | Change | Responsibility |
| --- | --- | --- |
| `src/utils/windowGeometry.ts` | Create pure runtime-safe size/position normalization and clamping. | Developer |
| `src/app/portfolioReducer.ts` | Add the route-preserving `RESTORE_WINDOW` action authorized by the Product Owner. | Developer |
| `src/hooks/useWindowDrag.ts` | Create title-bar pointer-drag enhancement. | Developer |
| `src/shell/WindowFrame.tsx` | Create reusable labelled non-modal application frame and its named controls. | Developer |
| `src/shell/WindowFrame.module.css` | Create frame/chrome, focus, maximize, and motion-safe rules. | Developer |
| `src/shell/WindowLayer.tsx` | Create stable-order state-backed layer, focus/recovery behaviour, and bounded interim application content. | Developer |
| `src/shell/WindowLayer.module.css` | Create work-area, stack, wide-screen geometry, and non-drag/mobile flow rules. | Developer |
| `src/shell/PortfolioShell.tsx` | Replace the PORT-004 interim recruiter summary with `WindowLayer` inside the existing `main`; retain the decorative hidden statement and existing landmarks. | Developer |
| `src/shell/PortfolioShell.module.css` | Change only the main/work-area rules needed to host the layer and natural mobile scrolling; remove summary-specific styling with the removed summary. | Developer |
| `src/shell/Dock.tsx` | Add only the stable `data-dock-app-id` attribute to existing application buttons, so WindowLayer can return focus to the matching recovery control. No control order, label, reducer intent, or public component API changes. | Developer |
| `tests/unit/windowGeometry.test.ts` | Add pure geometry boundary tables. | Tester |
| `tests/component/WindowFrame.test.tsx` | Add frame semantic/control/focus tests. | Tester |
| `tests/component/WindowLayer.test.tsx` | Add layer ordering, reducer, drag-gating, resize, and recovery tests. | Tester |
| `tests/e2e/window-system.spec.ts` | Add browser journeys and stable selector coverage. | Tester |

The authorized integration seam is deliberate: Playwright and manual window journeys must exercise the production shell, so `PortfolioShell` and its CSS are in scope for this task. It must mount `WindowLayer` rather than a test-only route, harness, hash, or alternate shell. The old in-flow `section.summary` and every summary-only CSS rule are removed when the layer is mounted; do not render it in parallel, hide it with CSS, or create a mobile duplicate.

`WindowLayer` supplies bounded interim content for the existing default `about`, `work`, and `command` frames. About reads only from `profile`; Work reads only from `flagshipWork`; Command may show a brief non-canonical availability message and its existing title. The Work frame renders `flagshipWork.result` exactly once, so the exact sentence remains visible at the desktop default composition after the current summary is removed. Do not copy that sentence, profile positioning, or any other professional claim into JSX. PORT-006 owns final Profile/Featured Work composition, copy treatment, desktop shortcuts, and application layout; PORT-009 owns later visual polish.

Out of scope:

- Changing `src/app/portfolioState.ts`, `src/app/portfolioReducer.ts`, `src/app/hashState.ts`, `src/app/PortfolioContext.tsx`, `src/hooks/useHashNavigation.ts`, their exports, the `PortfolioAction` union, default position literals, supported hashes, or reducer semantics.
- Any hash other than PORT-003's exact seven supported hashes. In particular, do not add `#about`, `#command`, a window-test hash, or a test-only production branch.
- Final application composition or professional copy for About, Work, Career, Projects, Contact, or Command; Career timeline controls; command parsing; desktop shortcuts; persistence; breakpoint-specific reducer state; React Router; local storage; modal dialogs, focus traps, and drag handles other than the title bar.
- Reinstating a duplicate recruiter summary, duplicating canonical claims, or inventing metrics.
- Task-009 visual finishing. This task needs clear, token-based, tactile chrome and responsive behaviour, but no new visual language, animation system, or final screen composition.

## Locked contracts and implementation decisions

The following files and named exports are the public Tester/Developer contract for this packet. Do not rename them, add an alternate public state API, or move their responsibilities into the reducer.

### Geometry: `src/utils/windowGeometry.ts`

```ts
import type { Point } from '../app/portfolioState';

export interface WindowSize {
  readonly width: number;
  readonly height: number;
}

export interface WindowWorkArea {
  readonly width: number;
  readonly height: number;
}

export const TITLE_BAR_HEIGHT: number;

export function constrainWindowSize(size: WindowSize, workArea: WindowWorkArea): WindowSize;
export function clampWindowPosition(
  candidate: Point,
  fallback: Point,
  size: WindowSize,
  workArea: WindowWorkArea,
): Point;
```

Both functions are pure: no DOM reads, reducer dispatches, CSS reads, time, mutation, or persistence. `TITLE_BAR_HEIGHT` is the shared positive CSS-pixel title-bar height (44px minimum) used for measurement and tests. Treat non-finite, negative, or zero work-area measurements as an empty work area; treat invalid candidate coordinates and invalid size measurements as invalid runtime input, not as values to pass through. `constrainWindowSize` returns finite non-negative dimensions no larger than the finite work area, with a height that can retain a title bar where the work area permits. `clampWindowPosition` first selects the finite `candidate`, otherwise the finite `fallback`, otherwise `{ x: 0, y: 0 }`; it then clamps the selected point to the position range produced by the constrained size. Thus every normal window is fully inside the work area, and an oversized requested window is shrunk before position calculation so its entire title bar is visible/recoverable. At left/top it returns `0`; at right/bottom it returns exactly `workArea - constrainedSize`; it cannot emit `NaN`, `Infinity`, negative coordinates, or coordinates beyond those edges.

Measure the layer work area with `ResizeObserver` (with a safe non-observer initial measurement) and revalidate every open, non-minimized, non-maximized position after the observed size changes. Revalidation calls the pure functions and dispatches `MOVE_WINDOW` only when the normalized point differs; a CSS viewport resize must never leave a window irretrievable.

### Drag enhancement: `src/hooks/useWindowDrag.ts`

```ts
import type { PointerEventHandler } from 'react';
import type { AppId } from '../data/models';
import type { Point } from '../app/portfolioState';
import type { WindowSize, WindowWorkArea } from '../utils/windowGeometry';

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

export function useWindowDrag(options: UseWindowDragOptions): UseWindowDragResult;
```

Only `WindowFrame` attaches `onTitleBarPointerDown`, and only to its element bearing `data-titlebar`; frame contents and controls must never begin drag. A primary pointer press first focuses/raises the application, records the pointer offset, and calls `setPointerCapture(pointerId)` on the title bar. `pointermove` clamps the requested position through `clampWindowPosition`; `pointerup` and `pointercancel` end the gesture and release capture when held. The hook installs and removes any fallback document/window listeners with stable references, and cleanup/unmount always ends a gesture and removes all listeners/capture references. Tests must prove no duplicate callback after remount/unmount.

Drag is an enhancement only. It is enabled only when `window.matchMedia('(pointer: fine)').matches` and the current viewport width is at least 768 CSS px. It is disabled for coarse/unknown pointers, any width below 768px, and maximized frames; no mouse or touch gesture may move a frame in those states. The media-query and resize listeners must be cleaned up on unmount. Keyboard, control buttons, dock, hash navigation, and Reset Layout remain complete alternatives.

### Frame: `src/shell/WindowFrame.tsx`

```ts
import type { ReactNode } from 'react';
import type { AppId } from '../data/models';
import type { Point } from '../app/portfolioState';
import type { WindowSize, WindowWorkArea } from '../utils/windowGeometry';

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

export function WindowFrame(props: WindowFrameProps): JSX.Element;
```

Render each frame as `section` with `aria-labelledby` pointing to its visible title. This is a non-modal labelled application section, never `role="dialog"`, `aria-modal`, or a focus trap. Clicking/focusing anywhere in the frame raises it using `onFocus`, but source/keyboard order is not changed. The visible title bar has `data-titlebar={appId}` and contains the heading plus these three `button` controls in this exact DOM order:

1. `aria-label="Close ${title}"`, `data-window-control="close"`
2. `aria-label="Minimize ${title}"`, `data-window-control="minimize"`
3. `aria-label="Maximize ${title}"` when normal, or `aria-label="Restore ${title}"` when maximized; `data-window-control="maximize"`

Each control stops pointer-drag initiation and uses a visible, non-colour-only symbol/state plus its accessible name. The title bar is the only drag source but must not be the only keyboard focusable target: all controls and interactive body content stay in ordinary tab order. The frame must expose `data-window-id={appId}`. Apply `zIndex` as visual style only; it must not determine DOM order, tab order, heading order, or accessible reading order.

### Layer: `src/shell/WindowLayer.tsx`

```ts
export const WINDOW_APP_ORDER: readonly ['about', 'work', 'career', 'projects', 'contact', 'command'];
export function WindowLayer(): JSX.Element;
```

`WindowLayer` consumes only `usePortfolio()` for shell state/actions. `WINDOW_APP_ORDER` is the stable source, reading, and keyboard order. It filters that list by reducer-open/non-minimized state and maps it directly to frames; it never maps `windowOrder`. It derives visual z-index from `state.windowOrder` only, with the focused/topmost application highest. A frame click/focus dispatches `FOCUS_WINDOW`; drag dispatches bounded `MOVE_WINDOW`; close/minimize/maximize/restore dispatch their corresponding actions. Normal maximize dispatches `MAXIMIZE_WINDOW`; restore dispatches `RESTORE_WINDOW` for the same `appId`.

Product Owner amendment, 2026-08-11: `PortfolioAction` adds `{ type: 'RESTORE_WINDOW'; appId: AppId }`. It is valid only when `state.maximizedAppId === appId`; then it clears only `maximizedAppId`, preserving the current route, selections, open/minimized membership, focus, order, and position. Otherwise it returns the same state reference. This resolves the prior `OPEN_APP` mismatch without resetting layout, mutating history, or changing `OPEN_APP` semantics.

Close/minimize cannot strand focus. If the action originated inside the disappearing focused frame, after the state commit move focus to the matching existing dock button `[data-dock-app-id="${appId}"]`; if it is absent or disabled, focus `#main-content`; do not focus a hidden frame. When a dock/control opens or restores a frame, place focus on that frame's title heading or first named window control after it mounts. These programmatic focus changes must not alter hashes and should be skipped when the user has already moved focus elsewhere before the deferred focus executes.

Register one document-level `keydown` listener while the layer is mounted. It handles `Escape` only when `state.maximizedAppId` is non-null **and** `event.target` is contained by that maximized frame; it prevents default and dispatches `RESTORE_WINDOW` for that exact app, restoring the frame without changing its route. Escape anywhere else—including shell navigation, dock, a normal window, or a maximized frame that no longer contains focus—does nothing. Remove that listener on cleanup.

Provide one visible `Reset layout` button in the layer work-area utility region with accessible name `Reset layout`, `data-window-control="reset-layout"`, and `dispatch({ type: 'RESET_LAYOUT' })`. It is reachable in normal document order, including when every frame is closed/minimized and on mobile. Reset restores the reducer's accepted default composition; do not add local defaults or persistence.

## Required responsive and CSS behaviour

At wide desktop (`min-width: 768px`) and only while a fine pointer permits drag:

- `WindowLayer` fills the existing main work area between the accepted menu and dock. Frames are positioned from reducer points relative to that area, have token-based strong Ink borders/hard shadows, bounded content regions, and no arbitrary root-height rule.
- Normal frames use constrained dimensions (`max-inline-size: 100%` and `max-block-size: 100%` relative to the measured work area) so geometry can keep the full title bar recoverable. A maximized frame fills that work area, not the browser viewport or menu/dock surfaces.
- Visual stacking uses z-index from `windowOrder`; DOM order remains `about`, `work`, `career`, `projects`, `contact`, `command` after filtering. Do not reorder nodes, use CSS `order`, or alter tab indices to match stacking.

At widths below 768px or without a fine pointer:

- Disable free positioning/drag entirely. Render at most one active/unminimized application as a full-width, normal-flow section; choose the reducer-focused open frame, otherwise the first open application in `WINDOW_APP_ORDER`.
- Keep all non-focused open apps minimized/available through the existing dock rather than visually overlapping them. Do not mutate reducer state merely because the layout is narrow.
- The main work area and window content use natural vertical scrolling, no fixed-height clipping, and no horizontal overflow. The Reset Layout control and dock remain reachable in ordinary scrolling/tab order.
- Preserve labelled sections, named controls, visible focus, 44×44 CSS-pixel practical touch targets, and reduced-motion behaviour. Open/close/maximize/restore must remain readable with spatial transition disabled; no essential cue may rely on animation.

These rules intentionally define behaviour, not PORT-009's finished composition, breakpoints beyond the 768px drag gate, or decorative polish.

## Tester RED → Developer GREEN → Tester → Product Owner evidence

### Tester RED gate (required before production implementation)

- [ ] Add `tests/unit/windowGeometry.test.ts` before any Developer production edit. Use table-driven assertions for finite normal points, left/top `(0, 0)`, exact right/bottom positions, oversized requested widths/heights, viewport/work-area shrink, zero/negative/non-finite work-area dimensions, invalid candidate and fallback coordinates, and a valid fallback after invalid input. Assert every returned size/point is finite, non-negative, bounded, and leaves the constrained title bar recoverable.
- [ ] Add `tests/component/WindowFrame.test.tsx` before production edits. It must fail on the current shell/import boundary and specify `section`/visible-title labelling, absence of dialog semantics, exact named controls and data attributes, title-bar-only drag entry, control pointer isolation, visible keyboard focus, normal/maximized maximise/restore naming, and callback dispatches.
- [ ] Add `tests/component/WindowLayer.test.tsx` before production edits. It must fail on the current shell and specify stable source order despite inverted z-index/focus, reducer action dispatches for focus/close/minimize/maximize/restore/reset, focus fallback/open focus placement, Escape containment, resize revalidation, fine-pointer/768px gating, no-drag touch/coarse state, and listener cleanup.
- [ ] Add `tests/e2e/window-system.spec.ts` before production edits. It may initially fail because the current accepted PORT-004 shell has no window selectors; record that expected selector failure rather than adding a hidden test path. Use real desktop and touch-emulated browser contexts against the production shell/base path.
- [ ] Record the exact Node 24 command, Playwright command, date, tested commit, expected failure(s), and no-production-change confirmation below. The default Node 25 `simdjson` environment fault remains unrelated; use the known Node 24 executable/path when needed.

### Required automated assertions and selectors

Browser and component tests prefer semantic roles/names. Where a role/name cannot distinguish a particular visible frame or control, use only these stable production attributes:

| Target | Required selector |
| --- | --- |
| Frame | `[data-window-id="about"]`, `[data-window-id="work"]`, or `[data-window-id="command"]` (substitute any supported `AppId` when opened) |
| Title bar drag source | `[data-titlebar="work"]` |
| Per-frame close/minimize/maximise-or-restore control | `[data-window-id="work"] [data-window-control="close"]`, `[data-window-id="work"] [data-window-control="minimize"]`, `[data-window-id="work"] [data-window-control="maximize"]` |
| Reset control | `[data-window-control="reset-layout"]` |
| Dock recovery target | `[data-dock-app-id="work"]` |

Do not use CSS-module class names, coordinates, nth-child selectors, arbitrary text fragments, test IDs, query parameters, or an unsupported hash as E2E selectors. Assert named controls with `getByRole('button', { name: 'Close Work' })`, etc., wherever unique; attributes only disambiguate the frame/control instance.

The Playwright suite must cover these production journeys:

1. At 1440×1000 with a fine mouse, drag Work by `[data-titlebar="work"]` to each boundary and beyond it. Confirm the final bounding box remains in the work area, the title bar is visible, and it can be re-focused/controlled. Dragging Work body or traffic controls does not move it.
2. Focus windows in a deliberately different sequence, then tab through the layer. Confirm visual topness changes but section/heading/control tab order follows `WINDOW_APP_ORDER`, not z-index.
3. Close and minimize a focused frame; focus returns to its named dock recovery button. Use that dock control to restore/open it and confirm focus enters the mounted frame. Confirm dock navigation still works after all default frames are closed/minimized.
4. Maximize Work, focus a control inside it, press Escape, and assert it restores. Repeat Escape while focus is in menu/dock/normal frame and assert no restore occurs.
5. Move a frame, activate Reset layout, and assert the three reducer defaults reappear: About upper-left, Work upper-right, Command lower/near centre; verify the exact flagship text appears once in the rendered document.
6. Resize the desktop browser while frames meet all four edges, including an intentionally constrained large frame; verify revalidation and title-bar recovery.
7. At 390×844 with touch emulation/coarse pointer, verify no overlap/drag movement, one active normal-flow application, dock switching, named controls, Reset Layout, natural vertical content access, and no horizontal overflow.

Run focused unit/component tests, all unit/component coverage, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test:e2e -- window-system.spec.ts`, and the relevant `npm run test:e2e:a11y` subset. Preserve the checked-in 91% threshold in every coverage metric and restore coverage with meaningful branches, not exclusions.

### Developer GREEN handoff

- [ ] Implement only the listed production files and contracts. Keep pure geometry before pointer code; do not change PORT-003 state/reducer/hash exports or add a new provider/local state machine.
- [ ] Replace (not conceal) the PORT-004 current summary when `WindowLayer` is mounted. Verify the exact flagship value comes from `flagshipWork.result` and occurs once in rendered canonical content.
- [ ] Run and record current focused tests, coverage, typecheck, lint, build, and the focused Playwright/browser result with the tested commit. State remaining limitations without claiming Tester acceptance.

### Tester manual charter

At 1440×1000 with mouse and keyboard, and at 390×844 with touch and keyboard:

- [ ] Start at the Desktop default composition. Within ten seconds, confirm the Work frame visibly exposes the exact flagship result; ensure the old in-flow recruiter summary is gone and no duplicate claim is present.
- [ ] Drag each default frame until it contacts left, right, top, and bottom work-area edges. Resize narrower and wider at each edge. Every title bar must remain fully visible and controls must remain reachable.
- [ ] Use only keyboard controls to focus, close, minimize, maximize/restore, reopen from dock, and Reset Layout. Confirm focus does not disappear, focus rings are visible on each surface, and non-modal sections do not trap tab navigation.
- [ ] Verify Escape restores only a maximized application containing focus. Verify it does not steal/alter normal shell, dock, or window operation elsewhere.
- [ ] On mobile/coarse pointer, try title, body, and control drags; none may reposition a window. Switch applications through dock and confirm natural scrolling, no fixed-height clipping, no overlapping chaos, and Reset Layout/recovery access.
- [ ] Inspect with a screen reader/accessibility tree: every application is a labelled section, controls have exact names, no dialog/focus trap exists, source order remains stable after focus changes, and window position is not announced as content.

Record viewport, pointer/input method, scenario, observed result, tested commit, and screenshots or browser evidence. Record any defect with severity, reproduction, expected behaviour, actual behaviour, and the affected requirement.

## Acceptance criteria

- [ ] Production `PortfolioShell` mounts `WindowLayer` in its existing main landmark; the prior summary is removed rather than duplicated or hidden, no test-only route/hash exists, and the exact flagship sentence remains visibly rendered once from canonical Work data.
- [ ] `windowGeometry` is pure and deterministically handles normal, edge, oversized, resize, zero, negative, and non-finite inputs without emitting invalid/unrecoverable geometry; constrained frames preserve a full recoverable title bar.
- [ ] Windows are labelled non-modal sections with accessible application titles, exact close/minimize/maximise-or-restore control names, visible focus, and no dialog semantics or focus trap.
- [ ] Drag starts only from the title bar, uses pointer capture, ends on up/cancel, cleans up listeners/capture on unmount, and is available only for fine pointers at viewport widths of at least 768px.
- [ ] Focus changes raise a window visually but source, heading, screen-reader, and keyboard order always follow the fixed `WINDOW_APP_ORDER`, never z-index or interaction order.
- [ ] Close, minimize, maximize, restore, reducer reset, dock recovery, focus fallback, and Escape use the accepted actions plus the authorized route-preserving `RESTORE_WINDOW` amendment and preserve route/window invariants; Escape restores only when focus is inside the maximized frame.
- [ ] Resize revalidates every applicable window position. Reset Layout is visibly and keyboard-reachable whether frames are open, closed, minimized, normal, or maximized.
- [ ] Wide screens offer bounded overlapping windows; mobile/coarse pointer screens use no free dragging, at most one active normal-flow application, natural scrolling, practical touch targets, and no horizontal/fixed-height clipping.
- [ ] Tester records RED-before-production evidence followed by focused GREEN, full coverage at or above all checked-in 91% thresholds, typecheck, lint, build, desktop/mobile Playwright, accessibility, and manual recovery evidence for the tested commit.

## Evidence record

Tester RED evidence: 2026-08-11 at base commit `246cf7b`, before any PORT-005 production edit. Command: `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm test -- tests/unit/windowGeometry.test.ts tests/component/WindowFrame.test.tsx tests/component/WindowLayer.test.tsx`. Result: 3 expected failing suites / 0 executed tests, solely because `src/utils/windowGeometry`, `src/shell/WindowFrame`, and `src/shell/WindowLayer` do not exist yet. The failures were Vite import-resolution errors at the three public contract boundaries; no test-authoring failure was observed. Added the four required Tester files only; no production files were changed.

Developer GREEN evidence: Production implementation commit `59ce4a9` was inspected against `422aca3..59ce4a9`. The Tester made no production-file changes; only tester-owned configuration, test, and packet evidence files are pending in this verification commit.

Tester verification: PASS_WITH_MINOR — 2026-08-11 at production commit `59ce4a9` with Node 24 (`PATH=/opt/homebrew/opt/node@24/bin:$PATH`). Focused unit/component command `npm test -- tests/component/WindowFrame.test.tsx tests/component/WindowLayer.test.tsx tests/component/PortfolioShell.test.tsx` passed 19/19. Full `npm test` passed 11 files / 106 tests. `npm run test:coverage` passed all locked thresholds: statements 97.19% (346/356), branches 91.95% (263/286), functions 100% (79/79), and lines 97.76% (306/313). `npm run typecheck`, `npm run lint`, and `npm run build` all passed; the build emitted the GitHub Pages base-path bundle at `/ben-portfolio/`.

Automated evidence: Vitest now excludes `tests/e2e/**` from test discovery, preserving the existing 91% thresholds rather than allowing Playwright's `test.describe()` API to be loaded by Vitest. The legacy 4173 preview remains owned by `/Users/ben.hutchinson/code/personal/ben-portfolio/.worktrees/isometric-portfolio-redesign` and was neither changed nor stopped. An ignored temporary config targeting a separately built production preview at `http://127.0.0.1:4175/ben-portfolio/` ran `PATH=/opt/homebrew/opt/node@24/bin:$PATH npx playwright test tests/e2e/window-system.spec.ts --config=.superpowers/port-005-playwright.config.ts --project=Chromium --project=mobile-Chrome --reporter=line`: 2 passed, 2 expected project skips. The first sandboxed attempt could not launch Chromium because of macOS Mach-port permissions; the authorized rerun passed. No `@a11y`-tagged E2E specification exists (the only E2E file is `window-system.spec.ts`); a subsequent focused `--grep @a11y` run was unavailable because the approval service reached its usage limit.

Manual evidence: Controller Browser QA against `http://127.0.0.1:4175/ben-portfolio/` completed at 1440×1000 and 390×844. Both views had the correct identity/title, meaningful DOM, no framework overlay, and empty console errors/warnings. Desktop began in stable `about`, `work`, `command` order with the exact flagship claim once. Closing Work removed its frame and focused the Work dock control; reopening mounted Work, focused its heading, and set `#work`. Maximize followed by Escape restored Work without changing `#work`. Reset Layout returned `#desktop` and restored `about`, `work`, `command`. At 390×844, `#desktop` showed only Command, body height and viewport height were both 844, and `scrollWidth === innerWidth === 390`; opening Work through the dock left only Work visible, exposed no `data-drag-enabled`, focused its heading, and set `#work`. Direct/reload `#career` retained `#career`, one Career frame, and `aria-current="page"` on Career.

Accessibility evidence: A temporary axe Playwright check passed in Chromium desktop and mobile-Chrome. Desktop had zero violations. Mobile had one moderate `page-has-heading-one` violation and zero serious/critical violations: with Command as the sole mobile application, the rendered page lacks a page-level `h1`. Record this as non-blocking P3 follow-up for PORT-006, which owns permanent desktop/mobile composition and heading hierarchy; it does not invalidate PORT-005's labelled non-modal frame, named-control, stable-order, or recoverability contract.

Defects: P3 / non-blocking — mobile `page-has-heading-one` axe violation, assigned to PORT-006 as above. The controller-observed direct/reload `#career` defect did not reproduce at `59ce4a9`: after direct navigation and reload the URL remained `#career`, `[data-window-id="career"]` had count 1, and `[aria-current="page"]` was the Career link.

Product Owner decision: PENDING — READY packet issued; acceptance awaits independent Tester evidence and Product Owner comparison against every criterion.
