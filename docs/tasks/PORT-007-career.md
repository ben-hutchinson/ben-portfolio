# PORT-007 — Make Career the inspectable signature interaction

Status: READY

Requirement links: [PRD §7 Career application](../PRD.md#career-application), [PRD §13 release acceptance](../PRD.md#13-release-acceptance), [DESIGN §7 Career.app](../DESIGN.md#7-careerapp), [SOUL: Product Worldview](../SOUL.md#product-worldview), [SOUL: Motion Character](../SOUL.md#motion-character), [AGENTS §§8–13](../AGENTS.md#8-state-architecture), and [Implementation plan Task 7](../superpowers/plans/2026-08-11-portfolio-os-implementation.md#task-7-build-the-kinetic-career-application).

User outcome: A recruiter can directly open Career, inspect any professional stage at their own pace, and immediately understand how Ben’s role and evidence changed over time without learning a novel interaction.

Dependencies: PORT-001 through PORT-006 are accepted; use their canonical data, seven-hash boundary, reducer, window system, and `LazyMotion` root unchanged unless this packet explicitly authorizes a seam.

## Scope and ownership

| File | Change | Owner |
| --- | --- | --- |
| `src/apps/career/CareerApp.tsx` | Create the reducer-controlled Career application composition. | Developer |
| `src/apps/career/CareerApp.module.css` | Create tactile stage, evidence, colour-field, responsive, and reduced-motion presentation. | Developer |
| `src/apps/career/CareerControls.tsx` | Create native range and direct-year controls. | Developer |
| `src/apps/career/CareerStage.tsx` | Create one semantic, animated active-stage renderer. | Developer |
| `src/shell/WindowLayer.tsx` | Replace only Career's placeholder with `CareerApp`; allow a larger bounded Career window and Career-only title-bar metadata. | Developer |
| `src/shell/WindowFrame.tsx` and `.module.css` | Only if required, add an optional, typed title-bar metadata slot used solely by Career; preserve every existing frame/control/focus/drag contract. | Developer |
| `tests/component/CareerApp.test.tsx` | Add unit/component contracts for stage, controls, reducer action, accessibility, and reduced motion. | Tester |
| `tests/e2e/career.spec.ts` | Add desktop/mobile hash, history, window-control, keyboard, zoom, and motion journey coverage. | Tester |
| `tests/component/WindowLayer.test.tsx`, `tests/unit/portfolioReducer.test.ts`, `tests/e2e/window-system.spec.ts` | Amend only expectations made stale by mounting Career; no broad refactor. | Tester |

`src/data/career.ts`, `src/data/models.ts`, `src/app/portfolioState.ts`, `src/app/portfolioReducer.ts`, `src/app/hashState.ts`, `src/app/PortfolioRoot.tsx`, MenuBar, Dock, DesktopShortcut, and WindowFrame actions are canonical integration seams. Do not change them for this task unless an existing-contract test proves a narrowly necessary compatibility fix. In particular, retain the existing `SELECT_CAREER_STAGE`, `activeCareerStageId`, `#career`, Menu, Dock, shortcut, and close/minimize/maximize behaviour; `LazyMotion features={domAnimation}` is already provided at the root.

## Locked stage and interaction contract

`careerStages` is the sole typed source, in this exact array order and accent mapping: index 0 `graduate` (direct button `2022`, displayed period `2022 - 2024`, orange); index 1 `observability` (`2024`, yellow); index 2 `associate` (`2025`, displayed period `2024 - 2025`, blue); index 3 `skao` (`Now`, mint). Render each stage’s existing year, role, headline, evidence, and description verbatim. No claim, metric, title, date, or accent may be invented, reworded, duplicated as a new fact, or assembled from a separate data copy.

`CareerApp` derives the sole active index from reducer-owned `state.activeCareerStageId`; it has no local active-stage mirror. It maps index to the canonical ID and dispatches only `{ type: 'SELECT_CAREER_STAGE', stageId }`. `CareerControls` receives the derived index and callback; its native labelled range has `min=0`, `max=3`, `step=1`, and integer conversion on input/change. Its four native buttons are visibly labelled `2022`, `2024`, `2025`, and `Now`. Native ArrowLeft/ArrowRight (and Home/End where the browser supplies them) must change the range and dispatch the same action while bounds remain 0 and 3.

One reducer stage selection atomically drives the colour field/accent, visible year, role, headline, evidence, description, range value, pressed/current year button, range `aria-valuetext`, and a concise live stage status. No stale/mixed-stage text may remain exposed during rapid changes. The title bar retains the accessible `Career` name and, if the optional slot is used, visibly supplies `~/portfolio/Career.app` plus a non-essential Scrub Mode/stage state.

Career opens and restores through direct `#career`, native browser back/forward hash history, Menu, Dock, desktop `Open Career` shortcut, and the existing window controls. Opening focuses/reveals Career under the established reducer contract; maximize, minimize, close, and Dock recovery remain recoverable. Command parsing is not added in PORT-007.

## Visual, motion, responsive, and accessibility rules

Inside the existing tactile OS frame, render stage number/role, dominant fluid year, outcome-led headline, strong evidence surface, supporting description, then stage count and controls. It should feel kinetic and distinct without becoming a dashboard, fake terminal, OS imitation, autoplay, scroll-jack, persistent loop, or mandatory scrub interaction.

Use only `motion/react` inside the root's existing `LazyMotion`. A stage swap may animate opacity and at most 16px translation for 160–240ms; no other spatial transition or continuous animation. `prefers-reduced-motion: reduce` swaps content immediately (zero-duration/no displacement) while preserving focus, controls, and all content. Accent derives from existing tokens; do not introduce a motion library, canvas/WebGL, or a new global animation system.

At narrow/coarse layouts Career is one normal-flow column with ordinary document scrolling, no drag requirement, no clipping/overlap/horizontal overflow, and all controls available. At 200% zoom its controls, evidence, text, and focus indicator remain readable and operable. Use native controls, programmatic names, visible labels, semantic headings/status, deterministic DOM order, and sufficient contrast; animation is never the only signal of a stage change.

## Explicit exclusions

- Any Career data/model rewrite, new reducer action/state field, route/hash, storage, server/API, analytics, router, dependency, command parser, or desktop persistence.
- Changes to About, Work, Projects, Contact, default desktop composition, canonical professional copy, links, or the flagship sentence.
- Invented SKAO architecture, team/reliability metrics, annualised savings, private implementation detail, stages beyond the four locked records, or career content hidden behind interaction.
- Scroll-jacking, autoplay, timeline canvas, decorative endless motion, fake-hacker/space styling, generic equal cards, or a breakpoint-specific reducer path.

## Tester RED → Developer GREEN → Tester evidence

### Tester RED gate

- [ ] Add failing `CareerApp.test.tsx` contracts proving four locked stage records, native labelled range/bounds, direct buttons, range arrow changes, one `SELECT_CAREER_STAGE` path, synchronized visible/accessible stage text, reduced-motion immediate mode, and no local-stage behaviour.
- [ ] Add failing `career.spec.ts` journeys for `#career`, Menu/Dock/shortcut, browser back/forward, range and direct buttons, close/minimize/maximize/recovery, rapid stage changes, reduced motion, 390px ordinary scroll, and 200% zoom.
- [ ] Record Node 24 command, baseline commit, expected semantic failure, and no production edits.

### Developer GREEN handoff

- [ ] Implement only the bounded files/seams; preserve existing reducer/hash/window contracts and use canonical `careerStages` plus existing `LazyMotion`.
- [ ] Run focused Career/state/window tests, typecheck, lint, build, and document the commit and any limitation without declaring Tester acceptance.

### Tester verification and manual charter

- [ ] Run focused Career/state/window tests, full `npm test`, coverage with each metric ≥91%, typecheck, lint, build, Career E2E, and relevant axe checks.
- [ ] At desktop, rapidly scrub 0↔3, use range arrows and every year button, then exercise direct hash, history, Menu, Dock, shortcut, minimize/maximize/close/recovery, keyboard order/focus, and reduced motion.
- [ ] At 390px coarse/touch and 200% zoom, verify every stage/label/control, ordinary scroll, no drag/clipping/overlap/horizontal overflow, and readable immediate reduced-motion stage swaps.

## Acceptance criteria

- [ ] Career is a large focused, recoverable OS application with all four locked records and atomic accent/year/role/headline/evidence/description transformation.
- [ ] Reducer state is the only active-stage source; the native 0–3 range, four direct year buttons, and keyboard range changes dispatch the existing selection action and remain synchronized in visual and accessibility text.
- [ ] `#career`, browser history, Menu, Dock, shortcut, and window controls reach or recover Career without a new route/action/parser or broken focus.
- [ ] Motion uses existing LazyMotion only, is 160–240ms with ≤16px displacement, and is immediate with reduced motion while every stage remains readable without animation.
- [ ] Desktop visual hierarchy is kinetic but recognisably Portfolio OS; mobile is single-column, scrollable, no-drag, no-overflow, accessible, and usable at 200% zoom.
- [ ] All 91% coverage gates, automated accessibility checks, manual rapid-scrub/keyboard/reduced-motion checks, and production build gates pass.

## Evidence record

Tester RED evidence: Not yet run.

Developer GREEN evidence: Not yet run.

Tester verification: Not yet run.

Automated evidence: Not yet run.

Manual evidence: Not yet run.

Defects: None recorded.

Product Owner decision: PENDING — READY packet issued; Tester RED is next.
