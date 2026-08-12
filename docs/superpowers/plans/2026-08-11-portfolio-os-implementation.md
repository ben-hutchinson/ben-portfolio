# Portfolio OS Multi-Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing character-select portfolio with a recruiter-first Portfolio OS whose signature interaction is a kinetic Career application, while preserving static GitHub Pages delivery and achieving more than 90% automated coverage.

**Architecture:** A single React client owns shell state in one typed reducer. Menu, dock, shortcuts, hashes, and commands dispatch the same actions. Applications render semantic, data-driven content inside a shared window layer; DOM pointer events provide recoverable desktop dragging, while narrow layouts render one active application with no required drag. All routes are hashes and all core content ships in the static build.

**Tech Stack:** Node.js 24 LTS; React 19.2; TypeScript 6 strict mode; Vite 8; Motion for React 12 through `LazyMotion`; CSS Modules and CSS custom-property tokens; React context plus `useReducer`; Vitest with V8 coverage; React Testing Library, user-event, and jest-dom; Playwright with axe-core; GitHub Actions and GitHub Pages.

## Global Constraints

- Product truth lives in `docs/PRD.md`; interaction and visual truth in `docs/DESIGN.md`; product character in `docs/SOUL.md`; role boundaries in `docs/AGENTS.md`.
- Work only on `terminal-redesign` until the user chooses an integration path.
- Preserve the exact production base path `/ben-portfolio/`.
- Do not introduce a server, runtime content API, React Router, global state library, component-system dependency, CMS, WebGL engine, persistent animation loop, intro gate, character select, command-centre styling, or space-theme decoration.
- The flagship claim is exactly: “Migrated 50+ repositories and reduced average build time by four minutes.” Do not extrapolate annual savings.
- Every new interaction must reveal evidence, explain a relationship, or navigate.
- The configured coverage threshold is 91% for statements, branches, functions, and lines. This makes the user's “greater than 90%” requirement executable.
- Test exclusions are limited to `src/main.tsx`, `src/vite-env.d.ts`, generated declarations, and type-only modules. Application, reducer, hook, parser, and geometry logic stays in scope.
- A task is complete only after the Tester passes it and the Product Owner accepts it.

## Locked Technology Decisions

| Concern | Decision | Reason |
| --- | --- | --- |
| Rendering | React 19.2 SPA | The UI is stateful and component-driven; no server rendering is required. |
| Language | TypeScript 6 strict | Typed content and reducer actions prevent shell routes and professional copy from drifting. |
| Build | Vite 8 | Emits a static `dist` directory and supports the repository base path. |
| Motion | `motion` 12 via `motion/react` and `LazyMotion` | Provides bounded window and Career transitions without a render loop. CSS handles simple hover/focus states. |
| Styling | CSS Modules + `src/styles/tokens.css` | Preserves the bespoke visual language without a runtime styling or component-system cost. |
| State | React context + `useReducer` | One small deterministic state graph; no need for Redux, Zustand, or XState. |
| Routing | Native `location.hash` adapter | GitHub Pages has no history fallback; direct hashes and browser history remain reliable. |
| Pointer input | Native Pointer Events with capture | Supports mouse, pen, and touch while keeping drag optional. |
| Unit/component tests | Vitest + Testing Library + user-event | Fast, behaviour-focused tests within the Vite ecosystem. |
| Coverage | Vitest V8 provider, global threshold 91 | Enforces strictly greater than 90% across all four metrics. |
| Browser tests | Playwright on Chromium, Firefox, and WebKit | Covers recruiter journeys, viewports, input modes, and production preview. |
| Accessibility | semantic queries + `@axe-core/playwright` + manual keyboard review | Automated rules catch regressions; manual review covers interaction quality. |
| CI/deployment | Node 24 LTS + GitHub Actions Pages artifact | The deployed output is static and the currently supported LTS replaces the repository's EOL Node 20 runner. |

Official references used for the lock:

- [React versions](https://react.dev/versions)
- [Vite 8 announcement and Node requirements](https://vite.dev/blog/announcing-vite8)
- [Vite static deployment to GitHub Pages](https://vite.dev/guide/static-deploy.html)
- [Motion for React installation](https://motion.dev/docs/react-installation)
- [Vitest coverage](https://vitest.dev/guide/coverage.html)
- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [Node.js release status](https://nodejs.org/en/about/previous-releases)

## Role Workflow for Every Task

1. The Product Owner creates `docs/tasks/PORT-NNN-<slug>.md` from the approved plan task and marks it `READY`.
2. The Tester adds the smallest failing acceptance test and records the initial failure in the task packet.
3. The Developer writes production code until focused tests, type checking, linting, and the build pass.
4. The Tester expands coverage, runs the full affected suite, performs the manual charter, and records evidence.
5. The Developer resolves reproducible defects; the Tester re-runs the failed and regression checks.
6. The Product Owner compares the implementation and evidence with the acceptance criteria, then marks the packet `ACCEPTED` or `CHANGES_REQUESTED`.

Use this exact task-packet contract:

```md
# PORT-NNN — Outcome-led title

Status: READY | IN_PROGRESS | IN_TEST | CHANGES_REQUESTED | ACCEPTED
Requirement links: exact numbered sections from docs/PRD.md and docs/DESIGN.md
User outcome: one observable result
In scope: explicit files and behaviour
Out of scope: explicit exclusions
Acceptance criteria:
- [ ] observable criterion
Automated evidence: command and result
Manual evidence: viewport/input/scenario and result
Defects: severity, reproduction, expected, actual
Product Owner decision: ACCEPTED or bounded change request
```

## Task 1: Establish Governance, Toolchain, and Test Gates

**Product Owner task packet:** `docs/tasks/PORT-001-foundation.md`

**Files:**

- Create: `docs/tasks/README.md`
- Create: `docs/tasks/TEMPLATE.md`
- Create: `docs/tasks/PORT-001-foundation.md`
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `.nvmrc`
- Modify: `tsconfig.app.json`
- Modify: `tsconfig.node.json`
- Modify: `.eslintrc.cjs`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `tests/setup.ts`
- Create: `tests/unit/foundation.test.tsx`
- Delete: `src/features/**`
- Delete: obsolete `src/components/**`, `src/hooks/**`, `src/utils/**`, and `src/data/**`
- Replace: `src/App.tsx`
- Replace: `src/styles/global.css`
- Delete: `src/App.module.css`
- Modify: `.gitignore`

- [ ] **Product Owner:** Create the task directory, copy the contract above into `docs/tasks/TEMPLATE.md`, explain the READY → IN_PROGRESS → IN_TEST → ACCEPTED states in `docs/tasks/README.md`, and queue PORT-001 with these acceptance criteria: supported Node version is explicit; the new stable stack installs; unit, coverage, and browser commands exist; coverage cannot pass at 90%; local generated test artefacts are ignored.
- [ ] **Developer:** Write `24` to `.nvmrc`; upgrade React/React DOM and their types to 19.2, TypeScript to 6, Vite to 8, and `@vitejs/plugin-react` to 6; replace `framer-motion` with `motion` 12; add Vitest, jsdom, Testing Library packages, Playwright, and axe-core as development dependencies.
- [ ] **Developer:** Add scripts `test`, `test:watch`, `test:coverage`, `test:e2e`, `test:e2e:a11y`, and `test:e2e:visual` to `package.json`. Keep `build`, `lint`, and `typecheck` independently runnable.
- [ ] **Developer:** Update TypeScript and ESLint configuration for React 19 and test globals without weakening strict mode, unused-symbol checking, or hook rules.
- [ ] **Tester:** Add `tests/setup.ts` with jest-dom cleanup; configure jsdom and V8 collection in `vitest.config.ts`. Set `coverage.thresholds` to `{ statements: 91, branches: 91, functions: 91, lines: 91 }` and include all `src/**/*.{ts,tsx}` except the allowed global exclusions.
- [ ] **Tester:** Configure Playwright with `baseURL: http://127.0.0.1:4173/ben-portfolio/`, `webServer.command: npm run preview -- --host 127.0.0.1`, and Chromium, Firefox, WebKit, mobile-Chrome, and mobile-Safari projects.
- [ ] **Tester:** Add `tests/unit/foundation.test.tsx` asserting the root renders Ben Hutchinson, “Mid-level platform engineer”, and the exact flagship claim. Run `npm test -- tests/unit/foundation.test.tsx` and record the expected failure because the legacy UI does not satisfy the new contract.
- [ ] **Developer:** Replace the legacy root with a semantic, unstyled foundation view containing only the three required assertions. Before deleting old modules, use the existing timeline and project data to populate the PORT-002 content packet; then remove the intro, character-select, character viewer, mission runner, audio manager, panels, chroma-key hook, legacy components, legacy data, legacy utilities, and obsolete styles. Do not carry their stage machine into the new root.
- [ ] **Developer:** Add `coverage/`, `playwright-report/`, `test-results/`, and `.superpowers/` to `.gitignore` without removing existing entries.
- [ ] **Tester:** Run `npm test -- tests/unit/foundation.test.tsx`, `npm run typecheck`, `npm run lint`, and `npm run build`; record exact results in PORT-001.
- [ ] **Product Owner:** Confirm the dependency lock matches the table above, the foundation text is visible without interaction, and no excluded framework entered the dependency tree; mark PORT-001 accepted.
- [ ] Commit with `chore: establish Portfolio OS toolchain and quality gates`.

The required coverage block is:

```ts
coverage: {
  provider: 'v8',
  include: ['src/**/*.{ts,tsx}'],
  exclude: ['src/main.tsx', 'src/vite-env.d.ts', 'src/**/*.d.ts', 'src/**/*.types.ts'],
  thresholds: { statements: 91, branches: 91, functions: 91, lines: 91 },
}
```

## Task 2: Create Canonical Content Models

**Product Owner task packet:** `docs/tasks/PORT-002-content-models.md`

**Files:**

- Create: `src/data/models.ts`
- Create: `src/data/profile.ts`
- Create: `src/data/career.ts`
- Create: `src/data/work.ts`
- Create: `src/data/projects.ts`
- Create: `src/data/externalLinks.ts`
- Create: `tests/unit/content.test.ts`

- [ ] **Product Owner:** Queue PORT-002 with exact approved copy from PRD sections 2 and 7 plus the verified existing timeline/project data. Require the SKAO case study to state: Poetry was slow; Ben proposed the uv/ruff migration; Ben designed the base-Makefile implementation and rollout; 50+ repositories migrated; four minutes average build time removed. Reject any extrapolated savings or invented team/reliability metrics.
- [ ] **Tester:** Add failing data-contract tests proving IDs are unique, every career stage has year/role/headline/evidence/description/accent, all internal project IDs match supported hashes, external links use HTTPS or a `mailto:` URL, and the exact flagship sentence occurs once in canonical data.
- [ ] **Developer:** Define narrow readonly models. Use this contract:

```ts
export type AppId = 'about' | 'work' | 'career' | 'projects' | 'contact' | 'command';
export type CareerStageId = 'graduate' | 'observability' | 'associate' | 'skao';
export type ProjectId = 'pokeleximon' | 'safelog';
export interface CareerStage {
  id: CareerStageId;
  year: string;
  role: string;
  headline: string;
  evidence: string;
  description: string;
  accent: 'orange' | 'yellow' | 'blue' | 'mint';
}
```

- [ ] **Developer:** Move all professional copy into the new modules. Remove generic equal-weight work entries from the personal-project catalogue. Preserve verified Pokeleximon and Safelog links; represent non-public SKAO links as absent, not `#`.
- [ ] **Tester:** Run `npm test -- tests/unit/content.test.ts` and `npm run test:coverage`; inspect the report to ensure content helpers, if any, remain measured.
- [ ] **Product Owner:** Read every rendered claim in the data modules, compare it with source docs and existing verified content, and accept or return exact copy changes.
- [ ] Commit with `feat: define canonical portfolio content models`.

## Task 3: Implement Reducer and Hash-State Contracts

**Product Owner task packet:** `docs/tasks/PORT-003-shell-state.md`

**Files:**

- Create: `src/app/portfolioState.ts`
- Create: `src/app/portfolioReducer.ts`
- Create: `src/app/hashState.ts`
- Create: `src/app/PortfolioContext.tsx`
- Create: `src/hooks/useHashNavigation.ts`
- Create: `tests/unit/portfolioReducer.test.ts`
- Create: `tests/unit/hashState.test.ts`
- Create: `tests/component/PortfolioContext.test.tsx`

- [ ] **Product Owner:** Queue PORT-003 covering all documented shell states, the seven supported hash shapes, unknown-hash recovery, and the rule that menu, dock, shortcut, and command navigation share actions.
- [ ] **Tester:** Write failing reducer tests for open, focus, minimize, restore, maximize, close, reset layout, select career stage, and select project. Assert closing a window keeps a valid dock route and reset produces one stable default state.
- [ ] **Tester:** Write failing hash tests for `#desktop`, `#work`, `#career`, `#projects`, `#projects/pokeleximon`, `#projects/safelog`, and `#contact`; include empty and unknown hashes plus browser `hashchange` cleanup.
- [ ] **Developer:** Implement an exhaustive discriminated action union and pure reducer:

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

- [ ] **Developer:** Keep parsing/serialization pure. The hook listens to `hashchange`, dispatches parsed routes, and writes hashes only when the serialized value changes, preventing feedback loops.
- [ ] **Developer:** Provide a context hook that throws a useful error outside its provider; do not expose raw `setState`.
- [ ] **Tester:** Run the three focused files, then `npm run test:coverage`; add branch tests until every current metric is above 91%.
- [ ] **Product Owner:** Inspect action convergence and unknown-hash behaviour; accept only if history state can be reasoned about without navigation-surface-specific code.
- [ ] Commit with `feat: add deterministic shell and hash state`.

## Task 4: Build the Visual Shell and Navigation Frame

**Product Owner task packet:** `docs/tasks/PORT-004-shell-frame.md`

**Files:**

- Replace: `src/styles/global.css`
- Create: `src/styles/tokens.css`
- Create: `src/app/PortfolioRoot.tsx`
- Create: `src/shell/PortfolioShell.tsx`
- Create: `src/shell/PortfolioShell.module.css`
- Create: `src/shell/MenuBar.tsx`
- Create: `src/shell/MenuBar.module.css`
- Create: `src/shell/Dock.tsx`
- Create: `src/shell/Dock.module.css`
- Create: `src/shell/LiveRegion.tsx`
- Modify: `src/App.tsx`
- Create: `tests/component/MenuBar.test.tsx`
- Create: `tests/component/Dock.test.tsx`
- Create: `tests/component/PortfolioShell.test.tsx`

- [ ] **Product Owner:** Queue PORT-004 with DESIGN sections 3–5 as acceptance criteria. Require the first viewport to identify Ben, role, location, availability, primary navigation, and flagship result within ten seconds.
- [ ] **Tester:** Add failing semantic tests for the skip link, labelled primary navigation, active route state, dock buttons, persistent CV action, and sparing live-region announcements. Query by role/name, not CSS class.
- [ ] **Developer:** Implement the approved colour, border, radius, shadow, type, spacing, motion-duration, and focus tokens in `tokens.css`; import tokens before global rules.
- [ ] **Developer:** Build the shell as semantic header/navigation/main/footer regions. Keep decorative pattern and background statement `aria-hidden`; use buttons for application actions and anchors for hashes/downloads.
- [ ] **Developer:** Use local abstract SVG glyph components or CSS shapes. Do not add an icon package or copy commercial operating-system marks.
- [ ] **Developer:** Compose `PortfolioRoot` with `LazyMotion`, the portfolio provider, and hash navigation. `App.tsx` becomes a thin root export.
- [ ] **Tester:** Run component tests in keyboard order, then use Testing Library to verify active state and focus visibility hooks. Run coverage and close uncovered behavioural branches.
- [ ] **Product Owner:** Compare the rendered shell against the approved mint/paper/ink/orange/yellow language and reject glassmorphism, generic cards, tiny copy, or commercial-OS imitation.
- [ ] Commit with `feat: build the Portfolio OS shell`.

## Task 5: Implement the Recoverable Window System

**Product Owner task packet:** `docs/tasks/PORT-005-window-system.md`

**Files:**

- Create: `src/shell/WindowLayer.tsx`
- Create: `src/shell/WindowLayer.module.css`
- Create: `src/shell/WindowFrame.tsx`
- Create: `src/shell/WindowFrame.module.css`
- Create: `src/hooks/useWindowDrag.ts`
- Create: `src/utils/windowGeometry.ts`
- Create: `tests/unit/windowGeometry.test.ts`
- Create: `tests/component/WindowFrame.test.tsx`
- Create: `tests/component/WindowLayer.test.tsx`
- Create: `tests/e2e/window-system.spec.ts`

- [ ] **Product Owner:** Queue PORT-005 for focus, drag, bounds, close, minimize, maximize, restore, Escape, and Reset Layout. State explicitly that drag is an enhancement and that source order never follows z-index.
- [ ] **Tester:** Write failing geometry boundary tables for oversized windows, each shell edge, viewport shrink, and invalid numeric input. Write component tests for labelled non-modal sections and all window controls.
- [ ] **Developer:** Implement pure clamping and position validation before the pointer hook. Preserve at least the entire title bar and constrain positions to the work area.
- [ ] **Developer:** Implement title-bar-only dragging with `setPointerCapture`, `pointermove`, `pointerup`, and `pointercancel`; cancel listeners on unmount. Disable drag below 768px and when `(pointer: fine)` is false.
- [ ] **Developer:** Render focus order from a stable application list and apply z-index only visually. Maximize within the menu/dock work area; Escape restores only when focus is inside the maximized application.
- [ ] **Tester:** Add Playwright journeys for drag bounds, focus order, reset, minimize/restore, maximize/Escape, and touch-emulated non-drag access. Run unit, component, and browser tests.
- [ ] **Tester:** Manually resize while a window touches every edge; verify its title bar remains recoverable and every application remains launchable from the dock.
- [ ] **Product Owner:** Accept only when window playfulness cannot trap content or become necessary navigation.
- [ ] Commit with `feat: add accessible recoverable windows`.

## Task 6: Compose the Recruiter-First Desktop

**Product Owner task packet:** `docs/tasks/PORT-006-desktop.md`

**Files:**

- Create: `src/shell/Desktop.tsx`
- Create: `src/shell/Desktop.module.css`
- Create: `src/shell/DesktopShortcut.tsx`
- Create: `src/apps/about/AboutApp.tsx`
- Create: `src/apps/about/AboutApp.module.css`
- Create: `src/apps/work/FeaturedWork.tsx`
- Create: `src/apps/work/FeaturedWork.module.css`
- Create: `tests/component/Desktop.test.tsx`
- Create: `tests/e2e/recruiter-scan.spec.ts`

- [x] **Product Owner:** Queue PORT-006 with the ten-second recruiter contract: name, “Mid-level platform engineer”, Manchester, availability, backend-to-platform direction, exact flagship claim, and one-action routes to Work, Career, CV, GitHub, LinkedIn, and Contact.
- [x] **Tester:** Add a failing desktop component test for all contract content without clicks and an e2e recruiter journey that opens Work, returns to Desktop, opens Career, and reaches the CV action.
- [x] **Developer:** Compose Profile and Featured Work as intentional default windows, with the low-contrast background statement behind them. Keep the flagship sentence visible at 1440×1000 without moving a window.
- [x] **Developer:** Add About, Career, and Work shortcuts as secondary paths; duplicate no canonical professional copy in JSX.
- [x] **Developer:** Make `FeaturedWork` an evidence preview with one clear Work action, not a dashboard metric card.
- [x] **Tester:** Run the recruiter scan at 1440×1000 and 390×844, keyboard-only and mouse; capture results in PORT-006 and add stable screenshot assertions for both viewports.
- [x] **Product Owner:** Perform a timed ten-second scan without prior orientation and record whether all required positioning is understood; reject if interaction obscures evidence.
- [x] Commit with `feat: compose recruiter-first desktop`.

## Task 7: Build the Kinetic Career Application

**Product Owner task packet:** `docs/tasks/PORT-007-career.md`

**Files:**

- Create: `src/apps/career/CareerApp.tsx`
- Create: `src/apps/career/CareerApp.module.css`
- Create: `src/apps/career/CareerControls.tsx`
- Create: `src/apps/career/CareerStage.tsx`
- Create: `tests/component/CareerApp.test.tsx`
- Create: `tests/e2e/career.spec.ts`

- [x] **Product Owner:** Queue PORT-007 with DESIGN section 7 verbatim. The application must open from menu, dock, shortcut, command, and `#career`; expose 2022, 2024, 2025, and Now; and transform year, role, headline, evidence, description, and accent together.
- [x] **Tester:** Add failing tests for the native labelled range input, four direct stage buttons, arrow-key stage changes, synchronized accessible text, bounds, and reducer dispatch. Add a reduced-motion branch test.
- [x] **Developer:** Implement one controlled stage index. The range value is `0..3`; buttons dispatch the same `SELECT_CAREER_STAGE` action. Do not mirror the active stage in component-local state.
- [x] **Developer:** Use `LazyMotion` features already loaded by the root. Stage transitions use opacity and at most 16px translation for 160–240ms; accent changes use tokens. With reduced motion, content swaps immediately and retains focus.
- [x] **Developer:** Use fluid type for the dominant year and headline, a strong evidence surface, and a single-column mobile layout. Do not scroll-jack, autoplay, or require scrubbing.
- [x] **Tester:** Add Playwright cases for direct hash, year-button clicks, range arrow keys, maximize/minimize/close, browser back/forward, mobile scrolling, and emulated reduced motion.
- [x] **Tester:** Manually verify that rapid scrubbing never leaves mixed-stage content, every stage is readable without animation, and controls remain usable at 200% zoom.
- [x] **Product Owner:** Confirm Career feels like the signature interaction while remaining recognisably inside Portfolio OS; accept exact content and accent mapping.
- [x] Commit with `feat: add kinetic Career application`.

## Task 8: Build the Flagship Work Case Study

**Product Owner task packet:** `docs/tasks/PORT-008-work.md`

**Files:**

- Create: `src/apps/work/WorkApp.tsx`
- Create: `src/apps/work/WorkApp.module.css`
- Create: `src/apps/work/CaseStudySection.tsx`
- Create: `tests/component/WorkApp.test.tsx`
- Create: `tests/e2e/work.spec.ts`

- [x] **Product Owner:** Queue PORT-008 with five required sections—Problem, Ownership, Approach, Rollout, Outcome—and the exact facts from PORT-002. Mark confidential implementation details and unverified numbers out of scope.
- [x] **Tester:** Add a failing accessible-outline test for one `h1`, ordered section headings, the exact flagship sentence, Poetry/uv/ruff/base-Makefile references, and absence of annualized values.
- [x] **Developer:** Render a scan-friendly technical case file from `src/data/work.ts`. Lead with outcome, then explain context, personal initiative, reusable base Makefile, staged repository rollout, and result.
- [x] **Developer:** If a system-shape visual is useful, build it from semantic HTML and CSS with equivalent text; do not fabricate private architecture or use canvas.
- [x] **Tester:** Add direct `#work`, keyboard navigation, narrow-screen reading, and CV-exit e2e coverage; manually check that the whole story is understandable without a diagram.
- [x] **Product Owner:** Compare every statement with the approved evidence and accept only if Ben's ownership is clear without exaggeration.
- [x] Commit with `feat: present flagship platform migration case study`.

## Task 9: Build Personal Project Catalogue and Details

**Product Owner task packet:** `docs/tasks/PORT-009-projects.md`

**Files:**

- Create: `src/apps/projects/ProjectsApp.tsx`
- Create: `src/apps/projects/ProjectsApp.module.css`
- Create: `src/apps/projects/ProjectDetailApp.tsx`
- Create: `src/apps/projects/ProjectDetailApp.module.css`
- Create: `src/components/ProjectMedia.tsx`
- Create: `tests/component/ProjectsApp.test.tsx`
- Create: `tests/component/ProjectMedia.test.tsx`
- Create: `tests/e2e/projects.spec.ts`

- [x] **Product Owner:** Queue PORT-009 for Pokeleximon and Safelog as unequal, evidence-led engineering case studies covering purpose, system shape, decisions, delivery/operations, technologies, and verified actions.
- [x] **Tester:** Add failing tests for catalogue-to-detail selection, supported project hashes, verified external-link attributes, meaningful image alternatives, and the designed missing-image fallback.
- [x] **Developer:** Render projects from typed data. Use buttons or hash anchors for selection and dispatch `SELECT_PROJECT`; never derive routing from display titles.
- [x] **Developer:** Implement `ProjectMedia` so an image error swaps to a labelled paper fallback without removing title, summary, or actions. Use module imports or `import.meta.env.BASE_URL`, never root-absolute asset paths.
- [x] **Developer:** Optimize selected screenshots to AVIF/WebP with useful dimensions; keep each non-hero image under 350KB and initial image transfer under 1MB.
- [x] **Tester:** Add e2e journeys for `#projects`, both direct project hashes, back/forward, broken-media simulation, mobile project switching, and external actions without following off-site URLs.
- [x] **Product Owner:** Confirm each project demonstrates platform/backend judgement rather than reading as a generic card or tool list.
- [x] Commit with `feat: add engineering project case studies`.

## Task 10: Add Contact and Optional Command Paths

**Product Owner task packet:** `docs/tasks/PORT-010-contact-command.md`

**Files:**

- Create: `src/apps/contact/ContactApp.tsx`
- Create: `src/apps/contact/ContactApp.module.css`
- Create: `src/apps/command/commandRegistry.ts`
- Create: `src/apps/command/parseCommand.ts`
- Create: `src/apps/command/CommandApp.tsx`
- Create: `src/apps/command/CommandApp.module.css`
- Create: `tests/unit/parseCommand.test.ts`
- Create: `tests/component/ContactApp.test.tsx`
- Create: `tests/component/CommandApp.test.tsx`
- Create: `tests/e2e/contact-command.spec.ts`

- [ ] **Product Owner:** Queue PORT-010 for direct email, LinkedIn, GitHub, CV, location, and availability plus the documented command set: `help`, `about`, `work`, `career`, `projects`, `project <known-id>`, `contact`, `cv`, `reset`, and `clear`.
- [ ] **Tester:** Add a command parsing table before implementation, including case/whitespace normalization, missing or unknown project IDs, closest-command suggestions, empty input, clear, and proof that shell syntax remains inert text.
- [ ] **Developer:** Implement a typed registry whose entries dispatch ordinary portfolio actions:

```ts
export interface CommandDefinition {
  name: string;
  usage: string;
  description: string;
  execute(args: readonly string[]): CommandResult;
}
```

- [ ] **Developer:** Render visible command suggestions and a labelled input. Never call `eval`, `Function`, a shell, dynamic import from input, or `dangerouslySetInnerHTML`. Limit in-memory output history to 30 entries.
- [ ] **Developer:** Keep Contact deliberately simple and semantic. External links expose useful accessible names; CV uses the checked-in PDF and download filename.
- [ ] **Tester:** Add e2e coverage proving visible navigation reaches everything commands can reach, command execution updates the hash, unknown input helps recovery, and `#contact` works directly.
- [ ] **Product Owner:** Accept only if the command interface rewards exploration without becoming a prerequisite or a hacker-terminal theme.
- [ ] Commit with `feat: add contact and optional command paths`.

## Task 11: Integrate Responsive, Accessibility, and Failure Behaviour

**Product Owner task packet:** `docs/tasks/PORT-011-resilience.md`

**Files:**

- Create: `src/hooks/usePrefersReducedMotion.ts`
- Create: `src/hooks/useMediaQuery.ts`
- Create: `src/components/ErrorBoundary.tsx`
- Create: `tests/unit/useMediaQuery.test.tsx`
- Create: `tests/component/ErrorBoundary.test.tsx`
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `tests/e2e/responsive.spec.ts`
- Create: `docs/testing/manual-test-charter.md`

- [ ] **Product Owner:** Queue PORT-011 using PRD sections 9–10 and DESIGN sections 9, 11, and 13. Require one active application below 768px, natural scrolling, 44×44px practical targets, keyboard parity, reduced-motion parity, useful error recovery, and no colour-only information.
- [ ] **Tester:** Write failing e2e checks for skip link, heading/landmark order, menu/dock accessible names, focus visibility, Career range labels, no serious/critical axe violations, one-app mobile mode, natural scroll, and 200% zoom.
- [ ] **Developer:** Centralize media-query behaviour, return deterministic server/test defaults, and clean up listeners. Use the result to disable drag and overlap on narrow/coarse-pointer layouts without deleting content.
- [ ] **Developer:** Add an error boundary whose designed fallback retains Ben's identity and direct Contact/CV/GitHub paths. Invalid hashes return to Desktop with a non-blocking message; optional media errors remain local.
- [ ] **Developer:** Audit controls so keyboard focus is visible against mint, paper, orange, yellow, and blue. Keep non-modal windows free of dialog semantics and focus traps.
- [ ] **Tester:** Create the manual charter with a matrix for 1440×1000, 1024×768, 768×1024, 390×844, and 320×568; mouse, touch emulation, and keyboard; normal/reduced motion; Chromium, Firefox, and WebKit.
- [ ] **Tester:** Perform keyboard-only primary journeys, window recovery, rapid Career input, 200% zoom, missing image, invalid hash, back/forward, and screen-reader spot checks; record exact pass/fail evidence in PORT-011.
- [ ] **Product Owner:** Review failures by user impact, return all blocker/major issues to the Developer, and accept only after Tester re-verification.
- [ ] Commit with `feat: harden responsive and accessible behaviour`.

## Task 12: Enforce Performance, CI, and GitHub Pages Delivery

**Product Owner task packet:** `docs/tasks/PORT-012-delivery.md`

**Files:**

- Modify: `vite.config.ts`
- Modify: `.github/workflows/gh-pages.yml`
- Create: `.github/workflows/quality.yml`
- Create: `scripts/check-bundle.mjs`
- Create: `tests/e2e/github-pages.spec.ts`
- Create: `tests/e2e/visual.spec.ts`
- Create: `docs/testing/release-report.md`

- [ ] **Product Owner:** Queue PORT-012 with delivery gates: static `dist`, `/ben-portfolio/` asset resolution, no runtime API dependency, initial JavaScript at or below 200KB gzip, initial images at or below 1MB, non-hero images below 350KB, LCP below 2.5s on the agreed mobile profile, Lighthouse Performance at least 90, and Accessibility at least 95.
- [ ] **Tester:** Add a production-preview test that opens `/ben-portfolio/#desktop`, `/ben-portfolio/#career`, and both project hashes, asserts no failed local assets or console errors, and verifies refresh plus browser history.
- [ ] **Developer:** Keep `base: '/ben-portfolio/'`, enable a build manifest, and add `scripts/check-bundle.mjs` to read the manifest, identify initial entry chunks, gzip them with Node's built-in `zlib`, and fail above 204800 bytes. Add `npm run check:bundle` after `npm run build`.
- [ ] **Developer:** Update GitHub Actions to Node 24, run `npm ci`, typecheck, lint, unit coverage, build, bundle check, and Playwright before Pages upload. Deploy only from the default branch; pull requests run quality without deploying.
- [ ] **Developer:** Keep GitHub Pages actions least-privileged and upload only `dist`. Do not add server rewrites; hashes are the route fallback.
- [ ] **Tester:** Add visual snapshots at 1440×1000 and 390×844 for Desktop and Career. Review intentional diffs instead of automatically updating baselines.
- [ ] **Tester:** Run the production matrix and produce `docs/testing/release-report.md` containing command outputs, all four coverage percentages, browser/project results, manual charter results, asset/bundle budgets, Lighthouse results, known low-severity issues, and the tested commit hash.
- [ ] **Product Owner:** Compare the release report with every PRD success criterion and DESIGN visual checklist item. Return gaps as bounded defects; mark PORT-012 accepted only when required gates pass.
- [ ] Commit with `ci: verify and deploy static Portfolio OS`.

## Task 13: Audit Legacy Removal and Conduct Final Acceptance

**Product Owner task packet:** `docs/tasks/PORT-013-release-acceptance.md`

**Files:**

- Audit: `src/**`
- Audit: `public/**`
- Audit: `package.json`
- Modify: `README.md`
- Modify: `docs/testing/release-report.md`

- [ ] **Product Owner:** Queue PORT-013 requiring zero reachable legacy intro, character-select, mission, audio, space, or command-centre product paths and a current README for setup, quality commands, architecture, and GitHub Pages deployment.
- [ ] **Developer:** Use `rg` and `npm run build` to prove the Task 1 legacy removal stayed complete. Remove any later-introduced dead dependency, asset, export, CSS rule, or data entry without touching the CV or verified project media.
- [ ] **Tester:** Run `rg -n "character-select|mission-runner|IntroScreen|LoadingScreen|AudioManager|starfield|command centre" src package.json` and require no product-code matches. Documentation history may retain references explicitly labelled historical.
- [ ] **Developer:** Update README commands and architecture to match the locked stack and current implementation; include the `/ben-portfolio/` preview URL.
- [ ] **Tester:** From a clean install, run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run test:coverage`, `npm run build`, `npm run check:bundle`, and `npm run test:e2e`. Require every command to pass and each coverage metric to be at least 91%.
- [ ] **Tester:** Re-run the full manual charter on the production preview and update the release report with the final commit hash and evidence. Do not reuse results from an earlier commit.
- [ ] **Product Owner:** Perform the recruiter scan, hiring-manager journey, explorer journey, and every direct-link journey from PRD section 8. Check all nine success criteria and all DESIGN section 15 visual checks.
- [ ] **Product Owner:** Mark PORT-013 accepted only if there are no blocker/major defects, no invented claims, and no required gate failure. Record minor accepted risks explicitly.
- [ ] Commit with `feat: complete Portfolio OS redesign`.

## Final Verification Commands

Run these from `/Users/ben.hutchinson/code/personal/ben-portfolio` at the final commit:

```bash
npm ci
npm run typecheck
npm run lint
npm run test:coverage
npm run build
npm run check:bundle
npm run test:e2e
```

Expected outcome:

- Every command exits 0.
- Statements, branches, functions, and lines are each at least 91%.
- The built entry JavaScript is no more than 204800 gzip bytes.
- All local resources load under `/ben-portfolio/`.
- Chromium, Firefox, WebKit, mobile Chrome, mobile Safari, accessibility, direct-hash, responsive, and visual projects pass.
- The final Product Owner task packet and release report say `ACCEPTED` for the same tested commit.

## Plan Self-Review Checklist

- [x] Every PRD success criterion maps to at least one task and test.
- [x] Every DESIGN application, interaction, responsive state, motion rule, error state, and visual acceptance check maps to a task.
- [x] Product Owner, Developer, and Tester responsibilities remain distinct.
- [x] The Tester owns both automated tests and manual testing.
- [x] Coverage is enforceably greater than 90%, not rounded to 90%.
- [x] GitHub Pages base-path, static-output, direct-hash, and refresh behaviour are tested from production output.
- [x] No task relies on an unspecified server, private API, unverified claim, or placeholder decision.
- [x] File paths, commands, action types, route IDs, project IDs, and application IDs are internally consistent.
- [x] Each task ends in Tester evidence and Product Owner acceptance.
