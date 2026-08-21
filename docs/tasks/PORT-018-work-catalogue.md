# PORT-018 — Make professional Work an extensible catalogue

Status: READY FOR TESTER RED

Requirement links: `docs/PRD.md` §§2, 6–9; `docs/DESIGN.md` §§1–2, 5–6; `docs/SOUL.md` Recruiter Contract and Interaction Standard; `docs/AGENTS.md` §§3, 5–6, 8–9, 12–16.

User outcome: Ben can add a further professional case study by extending typed Work data, while a recruiter can still reach the current SKAO uv/ruff migration immediately, read its complete evidence, and share a stable direct link.

## Exact scope

- Replace the singleton `flagshipWork` data source with a non-empty typed `workItems` collection in `src/data/work.ts`. The initial and only item has the stable ID `uv-ruff-migration` and preserves every approved current string exactly, including:

  ```ts
  ownership: 'I proposed the uv/ruff migration.',
  technicalApproach: 'I designed the base-Makefile implementation and rollout.',
  result: 'Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes',
  ```

  It remains the flagship by its collection position. Derive `WorkId` and the accepted work-ID collection from this typed data module; do not repeat a manually maintained work-ID union/list in state, hash, or command code. A compatibility `flagshipWork` export may remain only as a derived first-item alias while existing consumers are migrated to the collection/derived alias; it must not become a second source of truth.
- Add an ID to `WorkCaseStudy` and use the existing content fields as the canonical Work record. Do not restore a `technologies` property, tag list, or Work pills. The existing truthful no-public-detail boundary and empty external-link list remain intact.
- Extend the hash-backed route/state model with a Work-detail route, `activeWorkId`, and `SELECT_WORK`. Supported Work hashes are exact and case-sensitive:

  | Hash | Route | Behaviour |
  | --- | --- | --- |
  | `#work` | Work catalogue | Opens/focuses Work and clears Work selection. |
  | `#work/uv-ruff-migration` | Work detail | Opens/focuses Work and selects the matching case study. |

  Work IDs and hash recognition must be derived from `workItems`. An empty ID, trailing slash, extra path segment, title-shaped ID, unknown work ID, query string, or case variation is unknown and follows the established unknown-hash recovery to Desktop. Preserve all existing non-Work hashes and their behaviour.
- Refactor Work presentation into reusable catalogue and detail boundaries, following the established Projects pattern without copying its personal-project technology treatment:

  - `#work` presents a recruiter-first professional-work catalogue rendered by mapping `workItems`. The first item is visibly labelled as the featured case study, presents its context, title, and approved result, and exposes an accessible `Open <title> case study` action.
  - `#work/<id>` presents one reusable case-study detail, with a named heading, a keyboard-operable `Back to work` action, context, result, Problem, Ownership, Approach, Rollout, Outcome, and Public detail. The `Outcome` copy must come from typed Work data rather than JSX; for the migration it remains `The shared developer workflow became faster across the migrated repositories.`
  - The Desktop Featured Work window reads the derived flagship item and opens its direct detail route through `SELECT_WORK`; it keeps one exact visible approved result and does not duplicate professional copy in JSX.
  - The Work dock/menu/command `work` route continues to open the catalogue. Extend the allow-listed `work` command to accept an optional typed ID (`work uv-ruff-migration`) and select that detail; its help/error choices are derived from the data collection. It must not evaluate arbitrary input.
- Update shared route consumers coherently: `PortfolioState`, reducer, hash adapter, `WindowLayer` routing/content/large Work sizing, and Work command registry. Opening, focusing, minimizing, maximizing, restoring, closing, Reset Layout, direct hash load, browser back/forward, and mobile one-active-app behaviour must remain consistent with the established five-app window model.
- Add only the Work catalogue/detail CSS needed to preserve the approved tactile Portfolio OS: Ink outlines, hard shadows, yellow/coral evidence emphasis, readable body copy, no generic dashboard card grid, no excessive radius, no command-centre visual change. At narrow widths, catalogue entries stack naturally, buttons meet the existing touch target standard, and detail text has no horizontal clipping.

## Dependencies and handoff sequence

1. PORT-014–017 remain accepted regression contracts. PORT-018 is the sole READY implementation task.
2. Tester writes focused RED acceptance coverage and a manual charter before production code changes. Test ownership includes relevant unit/component/e2e files and no production files.
3. Developer implements only this packet, does not modify Tester-owned tests, and records the listed quality checks.
4. Tester independently turns coverage GREEN, runs the scoped browser/accessibility/responsive/manual matrix, and returns defects with reproducible evidence if any.
5. Product Owner accepts only a current exact Tester head with no open PORT-018 defect; otherwise return a bounded change request.

## Explicit exclusions

- New professional case-study claims, metrics, organisations, external links, screenshots, technology pills, or publication of confidential SKAO implementation detail.
- A Work-specific server, CMS, runtime API, React Router, global state library, dependency, analytics, deployment workflow, or visual redesign.
- Refactoring the Projects data/routing model beyond preserving its regression behaviour. Project IDs may remain as they are; this task derives Work IDs/routes where practical.
- Changes to accepted Kernel shell, dock utilities, Micro terminal placement/behaviour, Career timeline, external contact actions, favicon, project layout, or Portfolio OS token direction.
- Modifying, staging, deleting, or otherwise touching the pre-existing `.DS_Store` change or `.playwright-cli/` directory. Those are protected artifacts.

## Acceptance criteria

- [ ] `workItems` is the single typed canonical professional-work collection and contains exactly the initial `uv-ruff-migration` item; `WorkId` and runtime accepted IDs are derived from it. Adding a valid future item requires no Work component, reducer ID-list, hash-list, or command-list edit.
- [ ] The uv/ruff migration remains the derived flagship and retains all approved first-person/context/result/public-boundary copy exactly. It has no Work `technologies` field or rendered technology pills/list.
- [ ] `#work` opens a labelled Work catalogue. The featured entry visibly shows the current context, title, and exact result once in its catalogue content, and its accessible action selects the direct case-study route.
- [ ] `#work/uv-ruff-migration` directly opens the labelled detail with every required section and a keyboard-operable `Back to work` control. Detail navigation, Work dock/menu control, and `work` command return to `#work`.
- [ ] `work uv-ruff-migration` opens the direct detail; missing/unknown IDs produce a helpful allow-listed message with data-derived choices and do not change state. No arbitrary command input is executed.
- [ ] Exact direct hashes, reload, browser back/forward, focus/open/minimize/maximize/close/reset flows, and unknown-hash recovery work for catalogue and detail without regressing Projects or other applications.
- [ ] At 1440×1000, 1024×768, 390×844, and 320×568, Work catalogue/detail have readable complete content, visible focus, no horizontal page overflow, no required drag/command use, and the mobile single-active-app model remains intact. Keyboard-only activation and back navigation are possible.
- [ ] Scoped axe checks report no violations; reduced-motion leaves Work content and navigation equivalent; current static `/ben-portfolio/` build and bundle checks pass with no added dependency.
- [ ] Tester evidence records current passing focused and full relevant gates, coverage remains above the configured 91% thresholds, and the protected artifacts remain untouched/unstaged.

## Tester RED evidence contract

Before implementation, add failing acceptance coverage that proves the old singleton/one-route implementation cannot satisfy the new behaviour. At minimum cover:

- typed content: `workItems`, derived `WorkId`/accepted ID list, initial item ID, exact canonical strings, no technologies, and a derivation-oriented assertion that adding/reading a collection item does not depend on a second hard-coded Work ID list;
- reducer/hash: catalogue/detail parse and serialization, selection, reset/close/minimize recovery, invalid `SELECT_WORK`, exact unknown variants, and no regression of project routes;
- components: catalogue maps the collection, the first entry is featured, open/back controls have correct accessible names, the detail renders data-backed Outcome/Public detail, and Desktop Featured Work selects the direct detail;
- commands: `work`, `work uv-ruff-migration`, and missing/unknown ID output/action behaviour;
- Chromium: direct `#work` and direct detail loading/reload, click and keyboard catalogue/detail/back journey, history, 1440×1000 and 390×844 Work layout/no-overflow, and one mobile route-switch assertion;
- axe: both Work hashes at desktop and mobile viewports.

Record the current commit, Node/browser environment, exact commands/pass counts, and intended RED causes. Existing unrelated failures are not acceptable.

## Developer handoff evidence

At the production implementation commit, record changed production files, the data-derivation decision, and exit-0 output for:

```bash
npm run typecheck
npm run lint
npm test -- tests/unit/content.test.ts tests/unit/hashState.test.ts tests/unit/portfolioReducer.test.ts tests/unit/parseCommand.test.ts tests/component/WorkApp.test.tsx tests/component/WindowLayer.test.tsx tests/component/Desktop.test.tsx
CI=1 PLAYWRIGHT_PORT=4231 npx playwright test tests/e2e/work.spec.ts tests/e2e/recruiter-scan.spec.ts --project=Chromium
npm run build
npm run check:bundle
git diff --check
```

The Developer must not modify Tester-owned acceptance tests or protected artifacts.

## Tester GREEN and manual evidence

At one exact tested head, re-run current typecheck/lint, full coverage, build/bundle, applicable full E2E, and axe gates. Record commands, pass/skip/fail counts, Node/browser versions, coverage percentages, bundle result, and worktree audit. Manually verify:

- desktop and mobile direct catalogue/detail hashes, reload, back/forward, and unknown work hash recovery;
- keyboard-only open/detail/back and visible focus;
- desktop/mid/narrow layout at 1440×1000, 1024×768, 390×844, and 320×568, including no horizontal overflow and Work detail readability;
- reduced-motion equivalence and `/ben-portfolio/` static-base-path loading;
- existing Project detail direct hash and Micro terminal Desktop-only behaviour as regression sentinels.

Log every defect with severity, reproduction, expected/actual result, affected criterion, owner, retest evidence, and disposition.

## Product Owner acceptance

Accept only when all criteria and evidence above are green at one exact Tester head, the worktree contains only intentional PORT-018 changes plus the protected artifacts, no professional copy or confidential detail was invented, and the interface remains recognisably Portfolio OS rather than a generic project grid.
