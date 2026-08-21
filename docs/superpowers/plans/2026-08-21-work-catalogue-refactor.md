# Work Catalogue Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make professional Work an extensible typed catalogue with reusable case-study detail and stable direct hashes, while retaining the SKAO uv/ruff migration as the recruiter-first flagship.

**Architecture:** Keep Work as one existing window-managed application. Replace its singleton source with a non-empty `workItems` tuple that infers `WorkId`, and make state, hash parsing, command validation, catalogue rendering, and direct-detail rendering consume that single source. Reuse the established Projects catalogue/detail application boundary, but do not inherit Projects' personal-project tags or alter its routing.

**Tech Stack:** Node.js 24 LTS, React 19.2, TypeScript 6 strict mode, Vite 8, CSS Modules, React context plus `useReducer`, native hash navigation, Vitest/React Testing Library, Playwright, axe-core, and static GitHub Pages under `/ben-portfolio/`.

**Spec:** docs/tasks/PORT-018-work-catalogue.md

## Global Constraints

- Preserve these exact approved fields for the initial record: `ownership: 'I proposed the uv/ruff migration.'`, `technicalApproach: 'I designed the base-Makefile implementation and rollout.'`, and `result: 'Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes'`.
- The initial and only work record ID is exactly `uv-ruff-migration`; it is the first collection item and therefore the derived flagship.
- The Work data model includes data-backed `outcome: 'The shared developer workflow became faster across the migrated repositories.'`; do not duplicate that sentence in JSX.
- `workItems` is the only canonical Work collection. `WorkId`, the runtime accepted ID list, direct-hash validation, and optional command argument validation derive from it; no second manually maintained Work ID list/union is permitted.
- `#work` is the Work catalogue. `#work/uv-ruff-migration` is its direct case-study detail. Hashes are exact/case-sensitive; malformed, unknown, query-string, trailing-slash, extra-segment, title-shaped, or case-varied Work values retain current unknown-hash recovery to `#desktop`.
- Preserve the five-app window model, the optional allow-listed Micro terminal, all existing non-Work hashes, Project routes, current window/focus/minimize/maximize/reset behaviour, browser history, keyboard access, reduced-motion equivalence, and mobile one-active-app behaviour.
- Keep the Portfolio OS tactile style: Ink borders and hard shadows, yellow/coral emphasis, readable copy, and small radii. Do not add generic dashboard grids, Work technology pills/lists, a router, dependency, CMS, server, runtime fetch, analytics, WebGL, or deployment change.
- Keep checked-in coverage thresholds at 91%; exact-head statements, branches, functions, and lines must all remain above 90%.
- Never modify or stage `.DS_Store` or `.playwright-cli/`.

---

### Task 1: Extensible Work catalogue and detail

**Files:**

- Create: `src/apps/work/WorkDetailApp.tsx` — selected Work case-study detail boundary.
- Create: `src/apps/work/WorkDetailApp.module.css` — only if detail styles cannot remain accurately named inside `WorkApp.module.css`.
- Modify: `src/data/models.ts` — add the generic Work data fields `id: string` and `outcome: string` to `WorkCaseStudy`.
- Modify: `src/data/work.ts` — export the non-empty typed `workItems`, inferred `WorkId`, derived `workIds`, `isWorkId`, and derived `flagshipWork`.
- Modify: `src/app/portfolioState.ts` — add the `workDetail` route and `activeWorkId` state.
- Modify: `src/app/portfolioReducer.ts` — add `SELECT_WORK`; derive Work validation from `src/data/work.ts`; preserve all existing routes/actions.
- Modify: `src/app/hashState.ts` — parse/serialize exact `#work/<WorkId>` using `isWorkId` rather than a literal hash table.
- Modify: `src/apps/work/WorkApp.tsx` and `src/apps/work/WorkApp.module.css` — map the Work catalogue and render the featured first entry.
- Modify: `src/apps/work/FeaturedWork.tsx` — resolve the derived flagship and dispatch its direct Work selection.
- Modify: `src/apps/command/commandRegistry.ts` — keep `work` as catalogue; add optional derived Work ID selection without evaluating arbitrary input.
- Modify: `src/shell/WindowLayer.tsx` — select catalogue/detail content and full Work sizing for both Work routes.
- Modify/Test (Tester-owned): `tests/unit/content.test.ts`, `tests/unit/hashState.test.ts`, `tests/unit/portfolioReducer.test.ts`, `tests/unit/parseCommand.test.ts`, `tests/component/WorkApp.test.tsx`, `tests/component/Desktop.test.tsx`, `tests/component/WindowLayer.test.tsx`, `tests/e2e/work.spec.ts`, and `tests/e2e/accessibility.spec.ts`.

**Interfaces:**

- Consumes: `WorkCaseStudy`, `ExternalLink`, existing `PortfolioRoute`, `PortfolioState`, `PortfolioAction`, `usePortfolio`, `CaseStudySection`, `WindowLayer` Work window registration, existing Projects hash/reducer semantics, and the existing allow-listed command result types.
- Produces:

  ```ts
  // src/data/models.ts
  export interface WorkCaseStudy {
    id: string;
    title: string;
    context: string;
    friction: string;
    ownership: string;
    technicalApproach: string;
    rollout: string;
    outcome: string;
    result: string;
    publicDetail: string;
    links: readonly ExternalLink[];
  }

  // src/data/work.ts — workItems is the literal non-empty tuple declared in Step 2.
  export type WorkId = (typeof workItems)[number]['id'];
  export const workIds: readonly WorkId[];
  export const flagshipWork: (typeof workItems)[0];
  export function isWorkId(value: string): value is WorkId;

  // src/app/portfolioState.ts
  export type PortfolioRoute =
    | { readonly kind: 'desktop' }
    | { readonly kind: 'work' }
    | { readonly kind: 'workDetail'; readonly workId: WorkId }
    | { readonly kind: 'career' }
    | { readonly kind: 'projects' }
    | { readonly kind: 'project'; readonly projectId: ProjectId }
    | { readonly kind: 'contact' };

  export interface PortfolioState {
    // existing members unchanged
    readonly activeWorkId: WorkId | null;
  }

  // src/app/portfolioReducer.ts
  export type PortfolioAction =
    | { type: 'SELECT_WORK'; workId: WorkId }
    // existing action variants unchanged;

  // src/apps/work/WorkDetailApp.tsx
  export function WorkDetailApp(): JSX.Element | null;
  ```

- State rules: `NAVIGATE { kind: 'work' }` and `OPEN_APP { appId: 'work' }` clear `activeWorkId`; `NAVIGATE { kind: 'workDetail', workId }` and `SELECT_WORK` set it and open/focus Work; `RESET_LAYOUT` restores `activeWorkId: null`. Closing/minimizing a detail route retains existing route-to-Desktop recovery because its target is `work`. Work detail route equality compares `workId`; `routeTarget`, `routeAppId`, and `windowSize` treat `work` and `workDetail` as app ID `work`.
- Hash rules: `parseHash('#work')` returns `{ route: { kind: 'work' }, isKnown: true }`; `parseHash('#work/uv-ruff-migration')` returns `{ route: { kind: 'workDetail', workId: 'uv-ruff-migration' }, isKnown: true }`; `serializeHash` returns the exact inverse. Unknown input returns the established Desktop/`isKnown: false` result.
- Command rules: `work` yields `NAVIGATE { route: { kind: 'work' } }`; `work uv-ruff-migration` yields `SELECT_WORK`; missing/unknown extra values yield a message naming derived `workIds` and no state action.

- [ ] **Step 1: Tester RED checkpoint — add exact acceptance coverage and record intentional failures**

  Tester changes only the listed test files. Add assertions equivalent to the following, adapting imports to established test helpers:

  ```ts
  import { flagshipWork, isWorkId, workIds, workItems } from '../../src/data/work';

  expect(workItems).toHaveLength(1);
  expect(workItems[0]).toMatchObject({
    id: 'uv-ruff-migration',
    outcome: 'The shared developer workflow became faster across the migrated repositories.',
    result: 'Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes',
  });
  expect(flagshipWork).toBe(workItems[0]);
  expect(workIds).toEqual(['uv-ruff-migration']);
  expect(isWorkId('uv-ruff-migration')).toBe(true);
  expect(isWorkId('Python Dependency Migration')).toBe(false);
  expect(workItems[0]).not.toHaveProperty('technologies');
  ```

  ```ts
  expect(parseHash('#work/uv-ruff-migration')).toEqual({
    route: { kind: 'workDetail', workId: 'uv-ruff-migration' },
    isKnown: true,
  });
  expect(serializeHash({ kind: 'workDetail', workId: 'uv-ruff-migration' })).toBe('#work/uv-ruff-migration');
  for (const hash of ['#work/', '#work/UV-RUFF-MIGRATION', '#work/uv-ruff-migration/', '#work/unknown', '#work/uv-ruff-migration/extra', '#work/uv-ruff-migration?x=1']) {
    expect(parseHash(hash)).toEqual({ route: { kind: 'desktop' }, isKnown: false });
  }
  expect(portfolioReducer(createInitialPortfolioState(), { type: 'SELECT_WORK', workId: 'uv-ruff-migration' }))
    .toMatchObject({ route: { kind: 'workDetail', workId: 'uv-ruff-migration' }, activeWorkId: 'uv-ruff-migration', focusedAppId: 'work' });
  ```

  ```tsx
  await user.click(screen.getByRole('button', { name: 'Open Python Dependency Migration case study' }));
  expect(readState()).toMatchObject({ route: { kind: 'workDetail', workId: 'uv-ruff-migration' } });
  expect(screen.getByRole('heading', { name: 'Python Dependency Migration' })).toBeVisible();
  expect(screen.getByText('The shared developer workflow became faster across the migrated repositories.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Back to work' }));
  expect(readState()).toMatchObject({ route: { kind: 'work' }, activeWorkId: null });
  ```

  ```ts
  expect(parseCommand('work')).toMatchObject({ kind: 'action', action: { type: 'NAVIGATE', route: { kind: 'work' } } });
  expect(parseCommand('work uv-ruff-migration')).toMatchObject({ kind: 'action', action: { type: 'SELECT_WORK', workId: 'uv-ruff-migration' } });
  expect(parseCommand('work unknown')).toMatchObject({ kind: 'message' });
  ```

  Extend `tests/e2e/work.spec.ts` to load/reload both Work hashes, open/detail/back via click and Enter, assert URL/history, assert `document.documentElement.scrollWidth <= window.innerWidth` at 1440×1000 and 390×844, and retain recruiter-scan behaviour. Extend `tests/e2e/accessibility.spec.ts` to run axe on both Work hashes at those two viewports.

  Run and record the exact HEAD, Node/browser versions, command output, and intended old-singleton failures only:

  ```bash
  npm test -- tests/unit/content.test.ts tests/unit/hashState.test.ts tests/unit/portfolioReducer.test.ts tests/unit/parseCommand.test.ts tests/component/WorkApp.test.tsx tests/component/Desktop.test.tsx tests/component/WindowLayer.test.tsx
  CI=1 PLAYWRIGHT_PORT=4231 npx playwright test tests/e2e/work.spec.ts tests/e2e/accessibility.spec.ts --project=Chromium
  ```

  Commit only Tester-owned tests/evidence as `test: specify extensible work catalogue`.

- [ ] **Step 2: Developer implementation — make data, state, navigation, and rendering satisfy the RED contract**

  Implement the interfaces above in the listed production files. Use a tuple-preserving data declaration so the collection is non-empty and `flagshipWork` has no undefined branch:

  ```ts
  export const workItems = [
    {
      id: 'uv-ruff-migration',
      title: 'Python Dependency Migration',
      context: 'Platform tooling at SKAO.',
      friction: 'Poetry was slow in the existing developer workflow.',
      ownership: 'I proposed the uv/ruff migration.',
      technicalApproach: 'I designed the base-Makefile implementation and rollout.',
      rollout: 'Migrated the shared baseline across 50+ repositories.',
      outcome: 'The shared developer workflow became faster across the migrated repositories.',
      result: 'Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes',
      publicDetail: 'The work is internal, so no public repository or implementation detail is published.',
      links: [],
    },
  ] as const satisfies readonly [WorkCaseStudy, ...WorkCaseStudy[]];

  export type WorkId = (typeof workItems)[number]['id'];
  export const workIds = workItems.map(({ id }) => id) as readonly WorkId[];
  export const flagshipWork = workItems[0];
  export function isWorkId(value: string): value is WorkId {
    return workIds.some((id) => id === value);
  }
  ```

  Catalogue requirements: map `workItems`; use the first mapped item as featured; provide `<button aria-label={`Open ${work.title} case study`}>`; read visible context/title/result from the record; dispatch `SELECT_WORK`. Detail requirements: resolve `workItems.find(({ id }) => id === state.activeWorkId)`, return `null` only for impossible stale state, render a `Back to work` button dispatching `OPEN_APP { appId: 'work' }`, and map the existing `CaseStudySection` through data fields including `outcome`. Do not duplicate professional copy in JSX. `FeaturedWork` dispatches `SELECT_WORK` for `flagshipWork.id`.

  In `WindowLayer`, render `WorkApp` only for route kind `work`, render `WorkDetailApp` for `workDetail`, and use full Work dimensions for either. In reducer/hash code, import Work types/runtime validator from `src/data/work.ts`; do not create a `WORK_IDS` literal. In the command registry, use its existing normalized arguments and `isWorkId` to choose catalogue/detail/message paths; error/help text uses `workIds.join(', ')`.

  Add CSS only for catalogue entry hierarchy and responsive stacking. Preserve 44px controls, normal document reading order, hard outlines/shadows, no Work tags, and no page-overflow workaround that clips content. Do not change Tester-owned files or protected artifacts.

- [ ] **Step 3: Developer verification and commit**

  From the production implementation HEAD, run:

  ```bash
  npm run typecheck
  npm run lint
  npm test -- tests/unit/content.test.ts tests/unit/hashState.test.ts tests/unit/portfolioReducer.test.ts tests/unit/parseCommand.test.ts tests/component/WorkApp.test.tsx tests/component/Desktop.test.tsx tests/component/WindowLayer.test.tsx
  CI=1 PLAYWRIGHT_PORT=4231 npx playwright test tests/e2e/work.spec.ts tests/e2e/recruiter-scan.spec.ts --project=Chromium
  npm run build
  npm run check:bundle
  git diff --check
  ```

  Record exit codes, changed production files, Work-ID derivation proof (`rg -n "WORK_IDS|uv-ruff-migration" src/app src/apps/command src/data`), and `git status --short` showing `.DS_Store`/`.playwright-cli/` untouched. Commit production files only as `feat: add extensible work catalogue`.

- [ ] **Step 4: Tester GREEN — run independent exact-head automated and manual verification**

  Re-run the focused RED commands at the Developer commit, then run:

  ```bash
  npm run typecheck
  npm run lint
  npm run test:coverage
  npm run build
  npm run check:bundle
  CI=1 PLAYWRIGHT_PORT=4232 npm run test:e2e
  CI=1 PLAYWRIGHT_PORT=4233 npm run test:e2e:a11y
  git diff --check
  ```

  Manually verify at 1440×1000, 1024×768, 390×844, and 320×568: direct `#work` and `#work/uv-ruff-migration`, reload, browser Back/Forward, click/keyboard Enter open/detail/back, visible focus, no horizontal overflow, readable full detail, mobile one-active-app switching, and reduced-motion equivalence. Verify production preview under `/ben-portfolio/`, a Project direct hash, and Micro terminal Desktop-only presence as regression sentinels. Record exact commit, environment, coverage percentages, browser pass/skip/fail totals, bundle result, manual evidence, and defects/retests. Commit Tester-only updates as `test: verify extensible work catalogue`.

- [ ] **Step 5: Product Owner acceptance**

  Compare the exact Tester commit and report against `docs/tasks/PORT-018-work-catalogue.md`. Confirm every acceptance checkbox: data-only extensibility, exact approved SKAO copy, catalogue/detail semantics, command boundaries, routing/history/window recovery, responsive/a11y/reduced-motion/static-hosting evidence, coverage threshold, no dependency, and protected-artifact audit. If every item is current and green, set the packet status to ACCEPTED, append the accepted commit and concise evidence to its Product Owner acceptance section, mark this task complete in the plan/ledger, and commit only those PO docs as `docs: accept extensible work catalogue`. Otherwise issue a narrowly scoped defect record without accepting.

## Decision log

| Decision | Rationale | Status |
| --- | --- | --- |
| Treat this as one independently reviewable task | Projects already contains the required catalogue/detail and state/hash seams; adding another split would produce no independently valuable release. | Approved |
| Infer `WorkId` from `workItems` | A future data record must not require synchronised component, reducer, hash, or command ID edits. | Approved |
| Keep uv/ruff first and expose it as `flagshipWork` | It preserves the accepted recruiter-first SKAO story while the collection can grow. | Approved |
| Use `#work` catalogue plus `#work/uv-ruff-migration` detail | Catalogue is durable discovery; direct detail is shareable and efficient for recruiter evaluation. | Approved |
| Add optional `work <id>` rather than a new command | It preserves the optional expert path and keeps all input allow-listed/data-derived. | Approved |
| Keep Work technologies absent | PORT-016 accepted their removal; evidence should lead, not a tool inventory. | Locked regression |
| Leave Project routes unchanged | The user approved Work extensibility; Project refactoring is unrelated risk. | Excluded |
