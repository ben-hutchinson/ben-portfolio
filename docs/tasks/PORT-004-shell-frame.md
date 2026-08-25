# PORT-004 — Build the visual shell and navigation frame

Status: ACCEPTED — Product Owner review complete

Requirement links:

- [PRD §6 — Success Criteria](../PRD.md#6-success-criteria): immediate role and flagship impact; one clear route to each primary destination; keyboard and reduced-motion operation.
- [PRD §7 — Approved Information Architecture, Desktop](../PRD.md#7-approved-information-architecture): identity, status, shortcuts, and persistent dock in a shell with no entry gate.
- [PRD §9 — Operating-system shell, Navigation and URLs, and Mobile](../PRD.md#9-functional-requirements): menu/status, dock, static-host-safe hashes, and compact mobile navigation.
- [PRD §10 — Accessibility and Reliability](../PRD.md#10-non-functional-requirements) and [§13 — Release Acceptance](../PRD.md#13-release-acceptance): keyboard, reduced motion, GitHub Pages, and responsive release requirements.
- [DESIGN §3 — Visual Tokens](../DESIGN.md#3-visual-tokens), [§4 — Typography](../DESIGN.md#4-typography), and [§5 — Shell Anatomy](../DESIGN.md#5-shell-anatomy): the locked visual and shell contract.
- [DESIGN §11 — Accessibility](../DESIGN.md#11-accessibility) and [§12 — Application Architecture](../DESIGN.md#12-application-architecture): semantic shell, sparse announcements, and a single reducer-backed state path.
- [SOUL — Recruiter Contract and Visual Character](../SOUL.md#recruiter-contract): the OS is an invitation, not an obstacle.
- [AGENTS §8 — State Architecture](../AGENTS.md#8-state-architecture), [§10 — Styling Rules](../AGENTS.md#10-styling-rules), and [§18 — Testing Expectations](../AGENTS.md#18-testing-expectations).
- [Implementation plan — Task 4](../superpowers/plans/2026-08-11-portfolio-os-implementation.md#task-4-build-the-visual-shell-and-navigation-frame).

User outcome: A visitor immediately lands in a recognisable, tactile Portfolio OS shell, can understand whose portfolio it is and where the primary routes lead, and can reach every primary application or persistent external action without relying on drag or commands.

Dependencies: PORT-001 and PORT-002 are accepted; PORT-003 is accepted at production commit `16b51b7` and supplies the only shell reducer/context/hash contract. This task must use that contract unchanged.

## Scope and file ownership

Developer production files (only these production files):

| File | Change | Responsibility |
| --- | --- | --- |
| `src/styles/global.css` | Replace | Imports token definitions first; establishes reset, readable global defaults, base-safe layout, focus baseline, and reduced-motion baseline. |
| `src/styles/tokens.css` | Create | Defines the approved colour, border, radius, shadow, type, spacing, duration, and focus custom properties once. |
| `src/app/PortfolioRoot.tsx` | Create | Composes `LazyMotion`, `PortfolioProvider`, and `PortfolioShell`. |
| `src/shell/PortfolioShell.tsx` | Create | Semantic shell composition, reducer-backed primary menu/dock mapping, temporary recruiter summary, and landmark targets. |
| `src/shell/PortfolioShell.module.css` | Create | Shell/work-area/responsive composition only. |
| `src/shell/MenuBar.tsx` | Create | Identity, labelled primary navigation, status, and active-route presentation. |
| `src/shell/MenuBar.module.css` | Create | Menu visual treatment and responsive layout only. |
| `src/shell/Dock.tsx` | Create | Application dock and persistent CV/GitHub/LinkedIn actions. |
| `src/shell/Dock.module.css` | Create | Dock visual treatment and responsive layout only. |
| `src/shell/LiveRegion.tsx` | Create | One restrained status-announcement boundary. |
| `src/App.tsx` | Modify | Thin `PortfolioRoot` export only. |

Tester-owned files (create before Developer production changes):

| File | RED coverage |
| --- | --- |
| `tests/component/MenuBar.test.tsx` | Skip link, labelled navigation, routes, active state, status, keyboard order, and semantic controls. |
| `tests/component/Dock.test.tsx` | All six app controls, persistent CV/GitHub/LinkedIn actions, reducer action mapping, active indicators, and keyboard order. |
| `tests/component/PortfolioShell.test.tsx` | Landmarks, first-viewport recruiter summary, sparse live announcements, reduced motion, and cross-surface reducer convergence. |

`src/app/portfolioState.ts`, `src/app/portfolioReducer.ts`, `src/app/hashState.ts`, `src/app/PortfolioContext.tsx`, and `src/hooks/useHashNavigation.ts` remain PORT-003-owned contracts. Do not alter their exports, add component-local navigation state, or add a second state provider. Existing typed content models remain canonical; components must not duplicate professional claims in JSX.

## Locked composition and visual direction

The rendered page is a charcoal outer gutter surrounding a mint OS frame. Its reading surfaces are paper with Ink text; title-bar and key-control surfaces are yellow; orange carries CTA, active emphasis, and availability/status. Use 3px Ink outlines where the visual hierarchy needs the heavier shell treatment, with hard Ink offset shadows; the underlying DESIGN token remains the 2px default primary outline. The OS frame is rounded (12–16px), while controls and future windows are rounded only enough to feel tactile (0–4px). Interface labels use a readable mono stack; outcomes and headings use a bold display grotesk/system sans.

The exact DESIGN palette remains authoritative: Ink `#13221B`, desktop mint `#A9F2D3`, window paper `#F6FFEB`, menu paper `#EFFFF0`, signal orange `#FF653D`, action coral `#FF4E2A`, control yellow `#FFDC39`, outer charcoal `#0B0D11`, muted green-grey `#40584C`, and success green `#30C982`. Define compatible semantic tokens for focus and accessible status contrast; do not scatter raw colour values through CSS Modules. Define compact/comfortable spacing, 160–240ms motion durations, and a visible focus-ring token. Text remains readable: body 15–18px and interface labels 11–13px, never compressed mock-up copy.

This style is accepted only as crisp, bounded, and tool-like: charcoal gutter; mint frame; paper/Ink content; yellow title bars; orange CTA/status; mono UI plus bold display type; hard shadows; rounded-but-tactile controls. It must not contain glass, glow, space imagery, a command-centre/hacker-terminal theme, commercial OS marks, generic dashboard grids/cards, pixel fonts, or skeuomorphic folders. Use only local abstract SVG glyphs or CSS shapes; every decorative glyph, desktop pattern, and low-contrast background statement is `aria-hidden="true"`.

## Semantic shell and navigation contract

`PortfolioRoot` loads Motion through `LazyMotion`, wraps exactly one `PortfolioProvider`, and renders `PortfolioShell`; it does not introduce another navigation/state path. `App.tsx` contains no shell state machine or screen content beyond rendering that root.

`PortfolioShell` renders, in document/keyboard order, a skip link, `header`, primary `nav`, one `main` target, and `footer`. The skip link visibly appears on focus and moves focus to the main portfolio content. The menu navigation has an accessible name such as `Primary navigation`; use ordinary hash anchors for hash-backed routes and buttons only for reducer application actions. Links must use the exact PORT-003 route boundary: `#desktop`, `#work`, `#career`, `#projects`, and `#contact`. The active base route has both a visible coral underline/subtle surface change and `aria-current="page"`; a project-detail route makes Projects the active menu item. Never write `location.hash` from a component: hash navigation remains the PORT-003 adapter.

The menu bar contains the BH mark (a local abstract text/SVG mark, not a copied OS logo), `Ben Hutchinson`, `Platform Engineer`, centre navigation on wide screens (Desktop, Work, Career, Projects), and right-side `Manchester, UK` plus availability. Use the typed profile model for name, role, positioning, and availability; the shell's displayed availability is a compact status, not a newly invented professional claim. The product-approved visible location for this shell is `Manchester, UK`. On narrower screens the navigation may wrap or compact while retaining accessible names and ordinary, reachable controls; no desktop-only hover or drag path can be necessary.

Until PORT-006 replaces it with the Profile and Featured Work windows, `PortfolioShell` includes an intentionally small, in-flow recruiter summary in `main` (not an app interior or faux window). At 1440×1000, without clicking, its first viewport must expose identity, the mid-level platform-engineer role/trajectory, `Manchester, UK`, availability, the exact flagship sentence below, and a clear visual route to Work and Career. It draws its professional copy from the typed profile/work sources and does not create a second canonical content source. The exact flagship sentence is:

> Migrated 50+ repositories and reduced average build time by four minutes.

This summary is interim shell orientation only. PORT-006 owns the permanent default desktop composition, profile and featured-work application content, desktop shortcuts, and its fuller ten-second recruiter scan. The background statement may support the composition but cannot be the sole semantic source of any required information.

The desktop dock remains visible at the bottom of the OS frame where viewport space permits and presents labelled controls in this stable order: About, Work, Career, Projects, Contact, Command, CV. About/Work/Career/Projects/Contact/Command are buttons that dispatch the PORT-003 action union through `usePortfolio`; their mapping is shared and explicit: Work/Career/Projects/Contact dispatch `NAVIGATE` to their corresponding base route; About and Command dispatch `OPEN_APP` with their `AppId`. No dock control owns hash writing or a local selected state. An open/focused application has a small, non-colour-only active/state indicator. The CV is a persistent download anchor, not an `AppId` or reducer action. GitHub and LinkedIn are also persistent external anchors, visibly available from the shell footer/dock utility area with useful accessible names.

Build the CV URL from `import.meta.env.BASE_URL` (for example, `${import.meta.env.BASE_URL}cv/ben-hutchinson-cv.pdf`) so it works at `/ben-portfolio/`; provide a sensible download filename. Do not use root-absolute public-asset URLs. GitHub and LinkedIn use the verified typed `externalLinks` values and open as external links with the appropriate safe external-link behaviour. No placeholder `#` links, commercial-brand icon dependency, or route outside PORT-003's supported hashes is allowed.

Menu, dock, later shortcuts, future commands, and hashes must converge through the PORT-003 reducer action union. For this task, tests must demonstrate that menu/dock intent produces the same observable state as its matching reducer/hash route; there is no navigation-surface-specific branch, direct URL mutation, duplicated transition function, or local `activeApp` state. Application interiors and their separate window frame/layer are not rendered here.

`LiveRegion` uses one polite, atomic `role="status"` region. It announces meaningful route/application changes once (for example, a selected primary application), does not announce initial static identity/summary content, window geometry, duplicate state, hover, focus, or decorative changes, and is empty when there is no new meaningful event. Decorative visual text never enters the accessibility tree.

## Explicit exclusions and handoff boundaries

Out of scope for PORT-004:

- Window layer/frame/app interiors; drag, pointer capture, geometry constraints, z-index behaviour, close/minimize/maximize/restore, Escape, and Reset Layout (PORT-005).
- Default desktop windows, shortcuts, permanent Profile/Featured Work composition, and final recruiter scan layout (PORT-006).
- Career controls/content/motion, Work case study, Project views, Contact content, and Command parser/content (PORT-007 through PORT-010).
- Adding a router, global-state package, icon package, commercial marks, server runtime, runtime content fetch, or persistence.
- Replacing canonical data models or adding unsupported routes.

The temporary recruiter summary is deliberately in-flow so it cannot claim to be a draggable application. It must be removed/recomposed by PORT-006 rather than expanded into a second desktop implementation.

## Tester RED → Developer GREEN → Tester → Product Owner evidence

### Tester RED gate (required before production implementation)

- [ ] Create the three listed component files and run them against the PORT-003 baseline before the Developer changes any production file. Tests query roles, accessible names, text, and attributes—not CSS classes, coordinates, or implementation-only props.
- [ ] `MenuBar.test.tsx` fails for a focusable skip link to main; one labelled primary navigation; Desktop/Work/Career/Projects controls; active coral-state semantics via `aria-current`; route changes through the shared reducer; and name/role/location/availability status.
- [ ] `Dock.test.tsx` fails for the six labelled application buttons in order, `OPEN_APP`/`NAVIGATE` reducer mapping, active indicators with text/ARIA state, persistent CV download, and visible GitHub/LinkedIn external actions. Assert the CV href respects a non-root `import.meta.env.BASE_URL` test value.
- [ ] `PortfolioShell.test.tsx` fails for header/nav/main/footer landmarks, the interim recruiter summary including the exact flagship sentence, decorative `aria-hidden` handling, one sparing polite live region, reduced-motion-safe rendering, and menu/dock convergence on the PORT-003 observable state.
- [ ] Record date, Node version, baseline commit, focused command, and the expected RED failure below before production implementation begins.

### Developer GREEN handoff

- [ ] Implement only the production files listed above. Keep token import order before global rules, native semantic controls, reducer-backed action mapping, and base-safe public links.
- [ ] Run and record current results for `npm test -- tests/component/MenuBar.test.tsx tests/component/Dock.test.tsx tests/component/PortfolioShell.test.tsx`, `npm run typecheck`, `npm run lint`, and `npm run build`.
- [ ] State tested commit and any known limitation. Do not claim Tester acceptance.

### Tester verification

- [ ] Re-run the three component files in keyboard order and `npm run test:coverage`; add behavioural branches until all checked-in statements, branches, functions, and lines meet the 91% thresholds.
- [ ] Run the applicable accessibility browser test and manually inspect focus visibility, skip-link focus placement, active route semantics, dock recovery controls, and no duplicate/noisy live announcement.
- [ ] Visual QA at 1440×1000 and 390×844: confirm the locked charcoal/mint/paper/Ink/yellow/orange language; normal readable text; no glass, glow, space/command-centre styling, commercial marks, generic grid, or horizontal overflow. At desktop, confirm identity/location/availability and the exact flagship sentence are in the first viewport. At mobile, confirm compact navigation and dock/external actions remain reachable in normal scrolling order.
- [ ] Enable reduced motion and repeat keyboard-only navigation. Focus treatment remains visible on every surface; no essential state cue depends on animation; all required controls remain operable without dragging or typing a command.
- [ ] Record tested commit, exact commands/results, viewport/input/scenarios, and any defect using severity, reproduction, expected, actual, requirement, and evidence.

### Product Owner acceptance review

- [x] Inspect the rendered shell against DESIGN §§3–5 and the locked visual direction. Reject a themed replica, decorative-only menu, hidden recruiter evidence, generic-card/dashboard treatment, or unreadably small production text.
- [x] Inspect the first viewport at 1440×1000 in a ten-second recruiter scan: identity, role/trajectory, Manchester location, availability, primary navigation, Work/Career route, and exact flagship sentence are comprehensible without interaction.
- [x] Inspect action convergence: menu, dock, and URL input all use the PORT-003 reducer/hash route, and CV/GitHub/LinkedIn are safe persistent actions under the GitHub Pages base path.
- [x] Confirm no PORT-005/006 functionality has leaked into this packet.

## Acceptance criteria

- [x] `tokens.css` is imported before global rules and provides the approved palette, typography, borders, hard shadows, compact radii, spacing, motion durations, and cross-surface focus treatment; component styles consume semantic tokens.
- [x] The page presents a semantic, keyboard-operable shell with a working skip link, labelled primary navigation, `header`/`main`/`footer` landmarks, and a dock containing About, Work, Career, Projects, Contact, Command, and CV in stable order.
- [x] The wide first viewport exposes Ben Hutchinson, platform-engineer role/trajectory, `Manchester, UK`, availability, primary navigation, and exactly `Migrated 50+ repositories and reduced average build time by four minutes.` without dragging, command input, or opening an application.
- [x] Desktop/Work/Career/Projects route links, dock application actions, and active state are reducer/hash-backed; active menu route exposes `aria-current="page"`; project details correctly make Projects active; no UI component writes a hash or owns alternate navigation state.
- [x] CV is a persistent base-safe download from the checked-in PDF, and GitHub/LinkedIn remain verified, labelled persistent external actions. None is an unsupported hash route or reducer action.
- [x] Decorations are hidden from assistive technology, while a single polite live region announces only meaningful state changes and does not repeat static content or focus/hover noise.
- [x] The output visibly follows the locked tactile mint/paper/Ink/yellow/orange language with local abstract glyphs and excludes glass, glow, space/command-centre visuals, commercial OS imitation, generic dashboard grids/cards, and tiny copy.
- [x] At 1440×1000 and 390×844 the shell has no horizontal overflow; keyboard focus is conspicuous; compact mobile navigation/actions work in natural document order; and reduced motion leaves all required routes/actions usable.
- [x] No drag, application interior, or recoverable window-system behaviour is introduced before PORT-005, and the interim recruiter summary remains bounded until PORT-006.

## Evidence record

Tester RED evidence: 2026-08-11 — Node v24.13.0 executable selected at `/opt/homebrew/opt/node@24/bin/node`; baseline commit `16b51b719fa36e107b4584b7e3c2752614b56f68`; focused command: `/opt/homebrew/opt/node@24/bin/node node_modules/vitest/vitest.mjs run tests/component/MenuBar.test.tsx tests/component/Dock.test.tsx tests/component/PortfolioShell.test.tsx`; result: 3 failed suites / 0 discovered tests, each failing solely in Vite import analysis because Task 4 public modules (`src/shell/MenuBar`, `src/shell/Dock`, and `src/shell/PortfolioShell`) are not yet present. The package-script launcher could not be used because the default Node 25 binary aborts on a missing Homebrew `simdjson` dylib; direct Node 24 invocation avoids that unrelated environment fault. API assumptions: each is a named, zero-prop public component; `MenuBar` and `Dock` consume the existing `PortfolioProvider` context; shell owns provider composition separately and exposes its landmarks directly. Tests cover public roles, text, attributes, reducer/hash effects, and native interaction only.

Developer GREEN evidence: The Developer report records production commit `f970373`: focused 3 files / 11 tests, full 8 files / 75 tests with 98.64% statements, 91.60% branches, 100% functions, and 99.23% lines, plus typecheck, lint, and build passing under Node 24. The later skip-link regression was fixed in production commit `11c45c9`; the final Tester verification below supersedes the Developer's test-only typecheck/build handoff limitation after that fix.

Tester verification: 2026-08-11 — Node v24.13.0 executable `/opt/homebrew/opt/node@24/bin/node`; production reverified at `11c45c9`. Focused command `/opt/homebrew/opt/node@24/bin/node node_modules/vitest/vitest.mjs run tests/component/MenuBar.test.tsx tests/component/Dock.test.tsx tests/component/PortfolioShell.test.tsx`: PASS, 3 files / 13 tests. Full coverage command `/opt/homebrew/opt/node@24/bin/node node_modules/vitest/vitest.mjs run --coverage`: PASS, 8 files / 77 tests; statements 98.65%, branches 91.60%, functions 100%, lines 99.23% (all at or above 91%). `/opt/homebrew/opt/node@24/bin/node node_modules/typescript/bin/tsc -b`: PASS. `/opt/homebrew/opt/node@24/bin/node node_modules/eslint/bin/eslint.js . --ext ts,tsx --max-warnings=0`: PASS. `/opt/homebrew/opt/node@24/bin/node node_modules/typescript/bin/tsc -b && /opt/homebrew/opt/node@24/bin/node node_modules/vite/bin/vite.js build`: PASS. The Controller-modeled native fragment sequence in `MenuBar.test.tsx` now passes: after skip-link activation and the adapter event, `main#main-content` retains focus and `window.location.hash` remains `#desktop`. P1 resolved. Earlier visual/static audit remains valid: raw palette values occur only in `tokens.css`; shell modules contain no direct hash writing, component-local state, unsupported CSS syntax, Task 5 window/drag behavior, or root-absolute CV URL; one polite atomic live region and global reduced-motion rule are present. Browser QA previously confirmed 1440×1000 and 390×844 have no horizontal overflow, readable shell language, first-viewport recruiter evidence, reachable compact actions, and no console errors/warnings; browser media emulation is unavailable in this binding, so reduced-motion verification remains static-rule plus no-motion-dependency component coverage.

Product Owner visual/manual evidence: 2026-08-11 — Compared accepted concept `/private/tmp/portfolio-os-accepted-desktop.png` with rendered desktop `/private/tmp/portfolio-os-task4-desktop.png` and mobile/focus `/private/tmp/portfolio-os-task4-skip-focused.png`. At 1440×1000 the charcoal gutter, bounded mint shell, paper/Ink reading surface, yellow utility/dock surfaces, coral/orange emphasis, crisp heavy outlines, hard shadows, mono interface labels, bold display type, low-contrast background statement, menu hierarchy, and dock hierarchy faithfully carry the approved visual character without commercial-OS imitation, command-centre styling, generic cards, or compressed copy. The first viewport visibly contains Ben Hutchinson, the mid-level platform-engineering trajectory, Manchester, availability, primary navigation, direct Work/Career actions, and the exact flagship result. The single in-flow recruiter summary is the intentional PORT-004 delta from the accepted multi-window concept; no window chrome, drag, application interior, or PORT-005/006 behavior appears early. Controller IAB evidence confirms 1440×1000 and 390×844 have no horizontal overflow and a clean console; at 390×844 the footer bottom is 832.7px within the viewport, compact controls remain in natural order, and real skip-link activation leaves focus on `MAIN#main-content`, preserves `#desktop`, and shows a solid 3px coral outline.

Defects: None open. Resolved P1 — Skip link lost keyboard focus after unsupported-fragment recovery at `f970373`; production `11c45c9` prevents the default fragment navigation, and the Controller-modeled regression confirms focus remains on `main#main-content` with route `#desktop`.

Product Owner decision: ACCEPTED — 2026-08-11. Reviewed production commit `11c45c9`, Tester evidence commit `a2c5f1a`, review range `3a219bb..a2c5f1a`, the Task 4 Developer and Tester reports, source/tests, packet requirements, and the accepted/rendered visual evidence. All nine acceptance criteria are satisfied: the shell is semantic and reducer-backed, the recruiter evidence and persistent actions are immediately reachable, the visual system is faithful and readable, desktop/mobile overflow and keyboard focus are verified, and the interim summary stays within the explicit PORT-004 boundary until PORT-006. Tester records final focused 13/13, full 77/77, coverage 98.65%/91.60%/100%/99.23%, typecheck, lint, build, desktop/mobile/hash/action checks, and the fixed skip-link focus regression. No Important or Critical finding.
