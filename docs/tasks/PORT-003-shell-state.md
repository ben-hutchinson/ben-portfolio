# PORT-003 — Make shell and hash state deterministic

Status: IN PROGRESS — Tester RED complete; awaiting Developer GREEN

Requirement links:

- [PRD §9 — Operating-system shell, Navigation and URLs, and Mobile](../PRD.md#9-functional-requirements)
- [PRD §10 — Accessibility and Reliability](../PRD.md#10-non-functional-requirements)
- [PRD §11 — Technical Direction](../PRD.md#11-technical-direction)
- [PRD §13 — Release Acceptance](../PRD.md#13-release-acceptance)
- [DESIGN §5 — Shell Anatomy and Default composition](../DESIGN.md#5-shell-anatomy)
- [DESIGN §6 — Window System](../DESIGN.md#6-window-system)
- [DESIGN §7 — Career.app, Launch behaviour](../DESIGN.md#7-careerapp)
- [DESIGN §12 — Application Architecture, State, and URL state](../DESIGN.md#12-application-architecture)
- [DESIGN §13 — Error Handling](../DESIGN.md#13-error-handling)
- [AGENTS §8 — State Architecture](../AGENTS.md#8-state-architecture) and [§18 — Testing Expectations](../AGENTS.md#18-testing-expectations)
- [Implementation plan — Task 3](../superpowers/plans/2026-08-11-portfolio-os-implementation.md#task-3-implement-reducer-and-hash-state-contracts)

User outcome: Every navigation path, shared hash link, browser-history action, and window control resolves to one predictable shell state without a blank or unreachable application.

Dependencies:

- PORT-001 and PORT-002 are accepted.
- The accepted `src/data/models.ts` exports remain the source of `AppId`, `CareerStageId`, and `ProjectId`; this task must not change the accepted content models.

## Scope and ownership

In scope:

- Developer production files only: `src/app/portfolioState.ts`, `src/app/portfolioReducer.ts`, `src/app/hashState.ts`, `src/app/PortfolioContext.tsx`, and `src/hooks/useHashNavigation.ts`.
- Tester-owned acceptance files only: `tests/unit/portfolioReducer.test.ts`, `tests/unit/hashState.test.ts`, and `tests/component/PortfolioContext.test.tsx`.
- A typed reducer, pure hash parsing/serialization, one provider/hook contract, and browser `hashchange` synchronization.

Out of scope:

- Shell visuals, menu, dock, shortcuts, windows, command UI/command parsing, Career controls, project UI, responsive layout, drag listeners, viewport measurement, bounding/clamping positions, z-index CSS, animation, local-storage persistence, React Router, or a state-library dependency.
- Numeric window geometry and CSS breakpoints. Task 4 and later visual/window tasks own coordinates, sizing, drag constraints, revalidation after resize, and rendering; this task only stores a declared `Point` and restores the semantic default layout.
- New hashes. The only supported hashes are the exact seven listed below.

## Locked route and application registry

`PortfolioRoute` is a discriminated union with these and only these values:

| Route value | Serialized hash | Route target |
| --- | --- | --- |
| `{ kind: 'desktop' }` | `#desktop` | Intentional default desktop composition |
| `{ kind: 'work' }` | `#work` | Work |
| `{ kind: 'career' }` | `#career` | Career |
| `{ kind: 'projects' }` | `#projects` | Projects catalogue |
| `{ kind: 'project'; projectId: 'pokeleximon' }` | `#projects/pokeleximon` | Pokeleximon detail |
| `{ kind: 'project'; projectId: 'safelog' }` | `#projects/safelog` | Safelog detail |
| `{ kind: 'contact' }` | `#contact` | Contact |

The supported-hash set is exactly: `#desktop`, `#work`, `#career`, `#projects`, `#projects/pokeleximon`, `#projects/safelog`, and `#contact`. Matching is exact and case-sensitive; query strings, trailing slashes, extra path segments, display titles, and every other hash are unknown.

The accepted application registry is fixed for this task:

| `AppId` | Hash-backed route | Initial desktop state | Notes |
| --- | --- | --- | --- |
| `about` | none | open | Profile window, upper-left default position |
| `work` | `work` | open | Featured Work, upper-right default position |
| `career` | `career` | closed | Uses the first accepted career stage when state is first created |
| `projects` | `projects` / `project` | closed | Catalogue has no selected project; project route selects its ID |
| `contact` | `contact` | closed | Open/focused on its route |
| `command` | none | open | Command window, lower-centre default position |

`about` and `command` deliberately have no public hash. Opening, focusing, minimizing, maximizing, or closing either must not invent `#about` or `#command`; it preserves the current supported route. They remain reachable through the later dock/shortcut/command UI. CV is an external action and is not an `AppId`, route, reducer action, or hash.

## Initial state and reducer contract

`createInitialPortfolioState()` returns the stable Desktop state: route `desktop`; `about`, `work`, and `command` open and not minimized; the other three applications closed; `command` focused; no maximized app; no selected project; and `graduate` as the active career stage. Its default positions place Profile upper left, Featured Work upper right, and Command lower/near centre. The task does not prescribe numeric points; the exported default-layout constant is the sole temporary owner of those values and must be used by both initial state and reset.

`PortfolioState` must contain exactly the behaviour state needed by this task: `route`, `openAppIds`, `focusedAppId`, `minimizedAppIds`, `maximizedAppId`, `windowOrder`, `windowPositions`, `activeCareerStageId`, and `activeProjectId`. `windowOrder` is an ordered, duplicate-free `AppId` list whose last item is the focused/topmost open, non-minimized application. Collections must be readonly in the public state type.

The exhaustive action union is locked to the implementation-plan shape:

```ts
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
```

Reducer behaviour is pure and deterministic:

- `NAVIGATE` is the sole hash-derived transition. `desktop` restores the complete initial/default layout. A non-desktop route opens and focuses its target, restores it from minimized, and clears a maximization on a different application. `projects` clears `activeProjectId`; a `project` route sets its matching accepted `ProjectId`; `career` preserves the current selected stage.
- `OPEN_APP` opens, restores, and focuses the named application. For hash-backed applications it also selects the corresponding base route (`projects`, not a detail); for `about` and `command` it retains the current route.
- `FOCUS_WINDOW` only affects an open, non-minimized application, moves it to the top of `windowOrder`, and clears maximization when a different application had been maximized. It does not silently restore a minimized or closed window; `OPEN_APP` is the restore action.
- `MINIMIZE_WINDOW` only affects an open application, removes focus and its topmost presence, and clears maximization if needed. If it is the current route target, the route becomes `desktop`, ensuring a shared link never names a hidden application.
- `MAXIMIZE_WINDOW` opens, restores, and focuses the named application, and makes it the only maximized app. Its route follows the same base-route rule as `OPEN_APP`.
- `CLOSE_WINDOW` removes the application from open/minimized/order state and clears focus/maximization as appropriate. It does not delete content selection. If it closes the current route target, the route becomes `desktop`; no state may retain `#work`, `#career`, `#projects`, a project detail, or `#contact` while that target is closed.
- `MOVE_WINDOW` changes only the stored point of an open application. This task does not clamp, infer, persist, or measure geometry; later window code must validate bounds before dispatching it.
- `SELECT_CAREER_STAGE` accepts only the four accepted IDs. It selects the stage, opens/restores/focuses Career, and selects route `career`.
- `SELECT_PROJECT` accepts only `pokeleximon` or `safelog`. It selects that project, opens/restores/focuses Projects, and selects its detail route.
- `RESET_LAYOUT` is exactly equivalent to `createInitialPortfolioState()`: it restores all three default windows, default positions/order/focus, `graduate`, no selected project, no maximization, no minimized windows, and route `desktop`.

No-op actions must return the previous state where no observable field changes. The reducer must not read `window`, time, viewport, storage, or DOM state.

## Window invariants

- An app ID appears at most once in every collection.
- A minimized or closed application cannot be focused, topmost, or maximized.
- `maximizedAppId` is either `null` or an open, focused, non-minimized app; at most one app is maximized.
- A focused app is open and non-minimized; `focusedAppId` may be `null` only when no open, non-minimized window remains after an action.
- A closed app has no required position deletion; retaining its last point is allowed, while `RESET_LAYOUT` restores all default points.
- Closing/minimizing/focusing must never leave a hash route naming an unavailable route target. `#desktop` is always the deterministic recovery route and the dock remains a recovery surface after any close.
- Layout is in-memory only. No persistence or breakpoint-specific branches belong in this reducer.

## Hash adapter and history contract

`parseHash` and `serializeHash` are pure and have no `window` dependency. Parsing an empty hash yields the Desktop route with `isKnown: false`; parsing an unknown hash does the same. Serialization produces one of the exact seven strings above, never an empty string.

`useHashNavigation` owns the browser boundary only:

1. On mount it parses `window.location.hash`, dispatches `NAVIGATE` with the parsed route, and normalizes empty or unknown input to `#desktop` with `history.replaceState` so recovery does not add a dead history entry.
2. It registers one `hashchange` listener that repeats that parse/dispatch/recovery path; cleanup removes that same listener on unmount.
3. When reducer state changes route, it serializes the route and writes `location.hash` only if the current serialized hash differs. The subsequent browser `hashchange` is safe because `NAVIGATE` is idempotent; no loop or duplicate history write occurs.
4. Back and forward are native hash history: a historical supported hash opens/focuses the applicable application, and a historical empty/unknown hash recovers to Desktop rather than blanking the shell.

The hook does not use `pushState` for application navigation, React Router, pathname routes, or a navigation-surface-specific synchronization path.

## Required public exports and file ownership

These names are the Tester/Developer contract; do not rename or add alternate public state APIs during this task.

| File | Required exports | Ownership |
| --- | --- | --- |
| `src/app/portfolioState.ts` | `Point`, `PortfolioRoute`, `PortfolioState`, `DEFAULT_WINDOW_POSITIONS`, `createInitialPortfolioState` | Developer |
| `src/app/portfolioReducer.ts` | `PortfolioAction`, `portfolioReducer` | Developer |
| `src/app/hashState.ts` | `HashParseResult`, `parseHash`, `serializeHash` | Developer |
| `src/app/PortfolioContext.tsx` | `PortfolioProvider`, `usePortfolio` | Developer |
| `src/hooks/useHashNavigation.ts` | `useHashNavigation` | Developer |
| `tests/unit/portfolioReducer.test.ts` | reducer acceptance coverage only | Tester |
| `tests/unit/hashState.test.ts` | pure hash and hook lifecycle acceptance coverage only | Tester |
| `tests/component/PortfolioContext.test.tsx` | provider/context acceptance coverage only | Tester |

`PortfolioProvider` owns `useReducer(portfolioReducer, ..., createInitialPortfolioState)` and exposes exactly readonly `state` plus `dispatch` through `usePortfolio`. It must not expose `setState`, mutable collection setters, or a second reducer. Calling `usePortfolio()` outside `PortfolioProvider` must throw exactly: `usePortfolio must be used within a PortfolioProvider`.

Menu, dock, desktop shortcut, command, and later UI components dispatch the same listed actions (normally `NAVIGATE`, `OPEN_APP`, `SELECT_CAREER_STAGE`, or `SELECT_PROJECT`) through `usePortfolio`. They may differ only in accessible presentation and their intent-to-action mapping; they must not own alternate reducer logic, write hashes themselves, or branch state transitions by navigation surface.

## Tester RED → Developer GREEN → Tester → Product Owner evidence

### Tester RED gate (required before production implementation)

- [ ] `tests/unit/portfolioReducer.test.ts` contains failing tests for open, focus, minimize, restore through `OPEN_APP`, maximize, close, reset layout, career-stage selection, and project selection. It asserts reset creates the one stable default state and close/minimize never leaves an unavailable hash target.
- [ ] `tests/unit/hashState.test.ts` contains failing exact tests for all seven hashes; empty and unknown recovery; exact/case-sensitive rejection; serialization; and `hashchange` listener cleanup.
- [ ] `tests/component/PortfolioContext.test.tsx` contains failing tests for dispatch-backed state updates and the exact outside-provider error.
- [ ] Record the focused RED command, expected failure, date, Node version, and tested commit below before the Developer changes production files.

### Developer GREEN handoff

- [ ] Implement only the five listed production files and all locked exports/contracts.
- [ ] Run and record current results for `npm test -- tests/unit/portfolioReducer.test.ts tests/unit/hashState.test.ts tests/component/PortfolioContext.test.tsx`, `npm run typecheck`, `npm run lint`, and `npm run build`.
- [ ] State the tested commit and any known limitation; do not claim Tester acceptance.

### Tester verification

- [ ] Re-run the three focused files and `npm run test:coverage`; add reducer/hash branch cases until all statements, branches, functions, and lines are above the checked-in 91% thresholds.
- [ ] At desktop and mobile viewports, use only controls/keyboard and direct hash entry to verify no required drag/command path and that closing/minimizing always retains a recovery route. Visual shell assertions wait for PORT-004, but the state transition must be independently observable through the provider test harness.
- [ ] Verify initial/direct hashes, browser back/forward, unknown/empty recovery, and listener cleanup against the tested commit.

### Product Owner acceptance review

- [ ] Inspect the reducer and hook for a single action path shared by menu, dock, shortcut, command, and hashes; reject any surface-specific state branch or direct UI hash writer.
- [ ] Inspect the seven-hash boundary, default reset state, selection transitions, outside-provider error, and current Tester evidence.

## Acceptance criteria

- [ ] The public route registry recognizes and serializes exactly the seven supported hashes, with `#projects/pokeleximon` and `#projects/safelog` tied to the accepted `ProjectId`s.
- [ ] Empty and unknown hashes recover to Desktop, normalize to `#desktop` without a blank screen or dead history entry, and `hashchange` registration is cleaned up.
- [ ] Browser back and forward replay supported hashes through the same parse → `NAVIGATE` reducer path.
- [ ] One pure exhaustive reducer owns route, open/focus/minimized/maximized/order/position state, career selection, and project selection; it has no DOM, storage, timing, or viewport dependency.
- [ ] Initial load and `RESET_LAYOUT` produce the same intentional three-window Desktop composition: Profile upper left, Featured Work upper right, Command lower centre; Career begins at `graduate` and no project is selected.
- [ ] Open, focus, minimize/restore, maximize, close, move, and reset preserve every window invariant and always leave a valid dock-recoverable route.
- [ ] Selecting a career stage opens/focuses Career and selects `#career`; selecting a project opens/focuses Projects and selects its exact project-detail hash.
- [ ] Menu, dock, shortcut, command, and hashes converge on the same action union and reducer transitions, with no navigation-surface-specific state or hash-writing branch.
- [ ] `usePortfolio` exposes reducer state and dispatch only and throws `usePortfolio must be used within a PortfolioProvider` outside the provider.
- [ ] Tester records focused RED evidence before production changes, then focused GREEN, coverage above 91% in all metrics, typecheck, lint, build, hash-history, and manual recovery evidence for the tested commit.

## Evidence record

Tester RED evidence: 2026-08-11 — Node v24.19.0, tested commit `2887e36`. Command: `npm test -- tests/unit/portfolioReducer.test.ts tests/unit/hashState.test.ts tests/component/PortfolioContext.test.tsx` (with the Node 24 runtime first on `PATH`; the default Node 25 executable cannot load its missing Homebrew `simdjson` dependency). Expected RED result: all three suites fail import resolution because the five Developer-owned production modules do not yet exist: `src/app/portfolioState.ts`, `src/app/portfolioReducer.ts`, `src/app/hashState.ts`, `src/app/PortfolioContext.tsx`, and `src/hooks/useHashNavigation.ts`. The new tests define the initial/reset state, all ten action contracts and no-op/reference cases, route and window invariants, seven exact parse/serialize routes plus recovery, hash hook lifecycle, and provider boundary/state dispatch.

Developer GREEN evidence: Not yet run.

Tester verification: Not yet run.

Automated evidence: Not yet run.

Manual evidence: Not yet run.

Defects: None recorded. If found, record severity, reproduction steps, expected behaviour, actual behaviour, affected requirement, evidence, owner, and retest result.

Product Owner decision: PENDING — task is READY for the Tester RED gate.
