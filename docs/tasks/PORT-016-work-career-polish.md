# PORT-016 — Refine flagship Work evidence and stabilize Career controls

Status: ACCEPTED — 2026-08-18

Requirement links: `docs/superpowers/specs/2026-08-13-portfolio-os-polish-design.md` §§3, 7–8, 10–12; `docs/AGENTS.md` §§3, 5–6, 8–9, 13–16; approved implementation brief Task 3 / PORT-016; SDD ledger ruling in `.superpowers/sdd/2026-08-13-portfolio-os-polish/progress.md`.

User outcome: A recruiter sees the flagship engineering impact in exact, first-person language without decorative Work technology pills, and can compare every Career stage while the selector and previous/next rail remains fixed and the selected evidence stays readable.

## Exact scope

- Update `src/data/work.ts` so `flagshipWork` uses these exact canonical strings:

  ```ts
  ownership: 'I proposed the uv/ruff migration.',
  technicalApproach: 'I designed the base-Makefile implementation and rollout.',
  result: 'Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes',
  ```

- Update `src/data/models.ts` so `WorkCaseStudy` no longer declares the presentation-only `technologies` field, and remove that field from `flagshipWork`.
- Update `src/apps/work/WorkApp.tsx`, `src/apps/work/FeaturedWork.tsx`, and their CSS Modules to remove all Work technology-pill/list presentation and its obsolete `.technologies` styling. The engineering evidence remains in the typed Work data and rendered story.
- Update `src/apps/career/CareerApp.tsx`, `src/apps/career/CareerStage.tsx`, and `src/apps/career/CareerApp.module.css` to provide stable content/control rows. When changing evidence requires bounded scrolling, the active stage is inside a `stageViewport` with `min-height: 0` and `overflow: auto`; the controls align to the stable lower control row. Do not hard-code a stage-specific height.
- Change Career stage motion to no vertical offset: expose `data-motion-offset-px="0"` or equivalent verifiable metadata, animate opacity only for at most 200ms when reduced motion is off, and make the reduced-motion path spatially and functionally equivalent with zero-duration opacity change.
- Preserve `CareerControls` props, existing direct-stage/range/previous/next keyboard semantics, current-stage announcement, touch targets, `SELECT_CAREER_STAGE` reducer behavior, direct Career hashes, browser history, and existing relevant PORT-014/PORT-015 shell and Micro-terminal behavior.
- Tester-owned coverage is limited to `tests/unit/content.test.ts`, `tests/unit/foundation.test.tsx`, `tests/e2e/work.spec.ts`, `tests/e2e/career.spec.ts`, and `tests/e2e/accessibility.spec.ts`.

## Dependencies and sequence

1. PORT-014 and PORT-015 are accepted; this is the sole READY implementation task for the remaining Work/Career polish.
2. Tester first adds exact-copy, no-pill, geometry, motion, zoom, readability, overflow, and accessibility RED coverage, and records the intended failures:

   ```bash
   npm test -- tests/unit/content.test.ts tests/unit/foundation.test.tsx
   CI=1 PLAYWRIGHT_PORT=4223 npx playwright test tests/e2e/work.spec.ts tests/e2e/career.spec.ts tests/e2e/accessibility.spec.ts --project=Chromium
   ```

3. Developer implements only the production scope, runs typecheck, lint, focused units, focused Chromium, build, and bundle checks, and records the production handoff without modifying Tester-owned acceptance coverage.
4. Tester completes GREEN automation, coverage, axe, keyboard/range/direct-stage, reduced-motion, responsive, 200%-zoom, and manual evidence. Product Owner then decides acceptance against this packet.

## Excluded scope

- PORT-014 shell identity, dock utilities, viewport, wallpaper, shared titlebar, and all otherwise-accepted behavior.
- PORT-015 Micro-terminal presentation, parser, command vocabulary, Command-route recovery, app-state changes, and shell layering.
- Projects data and UI: `Project.tags` and all Projects technology lists remain separate and unchanged; Pokeleximon links/media are PORT-017.
- New Career claims, stage content, reducer actions, route values, hash formats, navigation model, dependencies, analytics/runtime APIs, server work, routing/state libraries, palette redesign, or deployment changes.
- Any stage-specific fixed height, page-level horizontal-overflow workaround that clips evidence, or motion that makes content/navigation depend on animation.

## Acceptance criteria

- [x] `flagshipWork.result` is exactly `Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes`.
- [x] `flagshipWork.ownership` is exactly `I proposed the uv/ruff migration.` and `flagshipWork.technicalApproach` is exactly `I designed the base-Makefile implementation and rollout.` The wording retains explicit first-person ownership, the base-Makefile detail, the 50+ repository count, and the four-minute average build-time reduction without annualizing or extrapolating it.
- [x] `WorkCaseStudy` and `flagshipWork` have no `technologies` field; Work renders no technology list or pills, including `uv`, `ruff`, and `Python`. `Project.tags` and project technology lists remain intact.
- [x] The Career controls occupy one stable horizontal rail. Career controls must remain within 1 CSS pixel of the same y coordinate across all four stages at 1440×1000, 1280×800, 390×844, and 200% zoom; mobile natural flow may grow but not stage-dependent rail movement.
- [x] Long Career evidence scrolls inside the stage viewport where needed, with readable active content and no clipping or page-level horizontal overflow. Mobile may grow naturally, but selection must not cause keyed or stage-dependent vertical rail movement.
- [x] Every Career stage change uses zero vertical motion offset (`data-motion-offset-px="0"` or equivalent) and opacity-only transition of no more than 200ms. Reduced motion changes the same content and semantics without spatial animation and with a zero-duration transition.
- [x] Existing Career `CareerControls` props, `SELECT_CAREER_STAGE` behavior, stage/range/previous/next keyboard operation, direct-stage controls, active/current announcement, direct hashes/history, touch access, and visible focus remain functional.
- [x] PORT-014/PORT-015 behavior remains unchanged: the accepted shell, dock utilities, routes, five-app state without Command, Desktop-only Micro terminal, parser safety, external actions, static GitHub Pages base path, and important no-drag/no-command content paths continue to work.
- [x] No dependency is added.

## Evidence contract

### Tester RED evidence (required before production implementation)

- Record commit, environment, and exact output for the two dependency commands. Intended failures are limited to old Work copy/pills, nonzero Career vertical motion, or Career rail movement; prior PORT-014/PORT-015 behavior remains green.
- Add exact assertions for the three canonical `flagshipWork` strings and assert `screen.queryByRole('list', { name: /technologies used/i })` is absent. Assert the Work model does not retain presentation-only technology data while project tags remain independent.
- In Chromium, select graduate, observability, associate, and SKAO. After each selection record `controls.boundingBox()?.y`; every value must be within 1 CSS pixel of the first at 1440×1000, 1280×800, 390×844, and 200% zoom. Assert zero vertical-motion metadata, active-stage readability, and no page-level horizontal overflow.

### Developer handoff evidence

- At the implementation commit, record exit-0 output for:

  ```bash
  npm run typecheck
  npm run lint
  npm test -- tests/unit/content.test.ts tests/unit/foundation.test.tsx
  CI=1 PLAYWRIGHT_PORT=4223 npx playwright test tests/e2e/work.spec.ts tests/e2e/career.spec.ts tests/e2e/accessibility.spec.ts --project=Chromium
  npm run build
  npm run check:bundle
  ```

- Record changed production files, the implementation commit, and results of a targeted search proving Work pill presentation and `WorkCaseStudy.technologies` were removed without changing `Project.tags`. Do not modify Tester-owned tests.

### Tester GREEN and manual evidence

- Re-run the focused unit and Chromium commands, current typecheck, lint, build, bundle, coverage, and relevant axe checks at the tested commit. Coverage remains at the configured 91% thresholds.
- Record viewport/zoom, selected stage, rail y coordinate, input method, content-scroll/readability result, horizontal-overflow measurement, motion/reduced-motion result, and screenshot or measurement evidence for 1440×1000, 1280×800, 390×844, and 200% zoom. Include keyboard-only range/direct-stage/previous/next operation, direct `#career` and history, and regression confirmation for PORT-014/PORT-015 behavior.
- Log every defect with severity, reproduction, expected behavior, actual behavior, affected criterion, owner, and retest result. Product Owner acceptance requires current Tester GREEN evidence and no open defect against this packet.

Product Owner decision: **ACCEPTED at `2bb9d04` on 2026-08-18.** Production commit `a2d8534` and Tester commit `2bb9d04` satisfy every PORT-016 acceptance criterion. Exact-head verification records 19/19 focused units; 11 focused Chromium passes with four intentional mobile-project guards; 13 shared PORT-014/PORT-015 Chromium passes with one intentional guard; 158/158 coverage tests at 98.88% statements, 92.04% branches, 99.28% functions, and 99.57% lines; and passing typecheck, lint, build, and bundle checks. Tester evidence records Career rail deltas of 0px at 1440×1000, 0px at 1280×800, 0.359px at 390×844, and 0px at 200% zoom, all within the 1-CSS-pixel ruling, with readable internally scrolling evidence, no page-level horizontal overflow, zero vertical motion, reduced-motion equivalence, preserved keyboard/hash/history semantics, and no PORT-014/PORT-015 regression. Production review is approved with no findings and no product defect remains.
