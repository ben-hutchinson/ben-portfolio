# PORT-017 — Correct Pokeleximon presentation and certify the exact-head polish release

Status: READY

Requirement links: `docs/superpowers/specs/2026-08-13-portfolio-os-polish-design.md` §§3, 9–14; `docs/AGENTS.md` §§3, 5–6, 8–9, 13–16; approved implementation brief Task 4 / PORT-017; SDD ledger rulings in `.superpowers/sdd/2026-08-13-portfolio-os-polish/progress.md`.

User outcome: A recruiter sees a single working Pokeleximon repository action and a complete, undistorted catalogue screenshot beside readable project copy at every supported size, while the final exact head proves the accepted Portfolio OS polish as one release.

## Exact scope

- Update `src/data/projects.ts` so the Pokeleximon `links` value is exactly:

  ```ts
  [{ label: 'Overview', href: 'https://github.com/ben-hutchinson/pokeleximon' }]
  ```

  Do not retain a `Live` action. Do not add a repository-labelled action, or any other action in the same Pokeleximon action group, that duplicates that destination.
- Update `src/apps/projects/ProjectsApp.module.css` and `src/components/ProjectMedia.module.css` only as needed to keep the featured Pokeleximon copy and media in separate grid areas. At desktop/tablet widths use defensive tracks and top alignment; the established narrow-width stack must retain copy before media in DOM order. Shared layout boundaries must use `min-width: 0`, wrapping/bounded sizing, and media that sizes to its image rather than its adjacent copy.
- Preserve `ProjectMedia({ project }): JSX.Element`, the `Project` model, project content other than Pokeleximon actions, external-link semantics/security attributes, and the supplied screenshot asset. The media image remains full and undistorted (`display: block`, `width: 100%`, `height: auto`, `object-fit: contain`, or a behaviorally equivalent implementation).
- Tester-owned updates are limited to `tests/unit/content.test.ts`, `tests/e2e/projects.spec.ts`, `tests/e2e/responsive.spec.ts`, `tests/e2e/visual.spec.ts`, and its four approved baselines: `tests/e2e/visual.spec.ts-snapshots/desktop-1440x1000.png`, `desktop-390x844.png`, `career-1440x1000.png`, and `career-390x844.png`.
- Update `docs/testing/portfolio-polish-report.md` only with current exact-head Tester evidence and final release evidence after behavioral GREEN. It must state the tested commit, environment/browser, exact commands and outcomes, pass counts, coverage percentages, bundle bytes, viewports/zoom, axe results, manual keyboard/reduced-motion evidence, static-base-path evidence, visual inspection, and defects/retests.

## Dependencies and sequence

1. PORT-014, PORT-015, and PORT-016 are accepted at `a98894a`, `6b1e0ce`, and `2bb9d04` respectively; their accepted behavior is a required regression contract. PORT-017 is the sole READY implementation task.
2. Tester first adds Pokeleximon link and media-layout RED acceptance coverage and records only the expected old-link/overlap/stretch failures:

   ```bash
   npm test -- tests/unit/content.test.ts
   CI=1 PLAYWRIGHT_PORT=4224 npx playwright test tests/e2e/projects.spec.ts tests/e2e/responsive.spec.ts --project=Chromium
   ```

3. Developer implements only the production scope, then records typecheck, lint, focused unit/Chromium, build, bundle, changed files, targeted link/layout inspection, and implementation commit. Developer does not modify Tester-owned tests, baselines, or release evidence.
4. Tester turns the focused suite GREEN and runs the complete exact-head matrix below. Regenerate visual baselines only if behavioral GREEN is established and the no-update visual run fails solely because the approved styling changed.
5. Product Owner compares the exact Tester head against every PORT-014–017 packet and every section of the approved polish specification. Acceptance is forbidden with an open defect, stale evidence, an unintentional worktree change, or a failed release/visual check.

## Measurable layout contract

At each required viewport/zoom, measure the featured Pokeleximon copy area, media container, and rendered screenshot after layout is settled:

- The copy and media bounding boxes do not intersect (their overlap area is zero CSS pixels).
- Neither copy nor media exceeds its featured-row bounds. The title wraps within the copy column and does not render under the media column.
- The media container height differs from the rendered image height by no more than **2 CSS pixels**. This is the definition of no large media-column Ink block.
- The rendered screenshot aspect ratio is within **2%** of its intrinsic asset ratio; it is neither stretched nor materially cropped. A positive rendered image height is required.
- At narrow widths, copy precedes media in DOM/document order; there is no horizontal scrolling, overlap, or inaccessible clipping.

The 2-CSS-pixel and 2% tolerances are ledger rulings, not targets to relax. Any browser-fractional-layout exception requires a documented Product Owner ruling before an assertion changes; non-overlap remains absolute.

## Excluded scope

- New project content, claims, screenshots, live deployment, or new Pokeleximon destinations beyond the exact single Overview action.
- PORT-014 shell identity, Kernel/favicon, dock utilities, viewport, wallpaper, titlebar, hash/history, and accessibility work.
- PORT-015 Micro terminal/parser/app-state/Command-route recovery behavior.
- PORT-016 Work content, Career rail/motion, its minimal shared WindowFrame sizing contract, and all accepted interfaces.
- Routing/state libraries, dependencies, analytics/runtime APIs, server work, deployment-workflow changes, a visual redesign, or changes to the locked stack and established Portfolio OS direction.
- Modifying, deleting, staging, or otherwise touching the pre-existing `.DS_Store` modification or untracked `.playwright-cli/` directory. They are protected artifacts. Every other tracked or untracked worktree change must be intentional and attributable to this task.

## Acceptance criteria

- [ ] Pokeleximon exposes exactly one action: `Overview` to `https://github.com/ben-hutchinson/pokeleximon`.
- [ ] No Pokeleximon `Live` action renders; no action in its group duplicates the exact Overview destination; external-link semantics and security attributes remain intact.
- [ ] At 1440×1000, 1024×768, 390×844, 320×568, and 200% zoom, the Pokeleximon title/copy, controls, media container, and image satisfy every measurable-layout threshold above.
- [ ] The screenshot is complete, visibly positive in height, and proportionate to the supplied intrinsic asset; there is no large Ink media-column block beneath it.
- [ ] Keyboard reachability, visible focus, reduced-motion equivalence, supported mobile behavior, 320-pixel no-horizontal-overflow, direct hashes/history, and important visible no-command/no-drag paths remain functional.
- [ ] Every accepted PORT-014, PORT-015, and PORT-016 behavior remains covered and green: simplified Kernel shell/utilities/titlebar, five-app state and Desktop-only safe Micro terminal, exact Work evidence/no Work pills, and the stable zero-offset Career rail.
- [ ] The exact accepted build remains static and works under `/ben-portfolio/`; no dependency is added.
- [ ] All full release, axe, coverage, bundle, visual, and `git diff --check` gates are current and green at one exact Tester head. Visual baselines are regenerated only after approved behavioral GREEN and manually inspected.
- [ ] At final acceptance, `.DS_Store` and pre-existing `.playwright-cli/` remain untouched/unstaged, and every other worktree change is intentional.

## Evidence contract

### Tester RED evidence (required before production implementation)

- Record commit, environment, browser, exact output, pass/fail counts, and expected failure causes for the dependency commands. The only intended new RED causes are the old Pokeleximon link, duplicate/Live action, overlap/out-of-bounds layout, image stretch, missing/zero-height image, or media-container Ink-block reproduction.
- Add the exact unit assertion:

  ```ts
  const pokeleximon = projects.find(({ id }) => id === 'pokeleximon');
  expect(pokeleximon?.links).toEqual([
    { label: 'Overview', href: 'https://github.com/ben-hutchinson/pokeleximon' },
  ]);
  ```

- Add Chromium measurements for the full geometry contract at 1440×1000, 1024×768, 390×844, 320×568, and 200% zoom. Assert title/copy and `ProjectMedia` boxes do not intersect, row bounds contain both areas, image height is positive, aspect-ratio delta is at most 2%, and media-container/image-height delta is at most 2 CSS pixels. Preserve PORT-015 mobile terminal and PORT-016 Work/Career regression assertions in the shared responsive suite.

### Developer handoff evidence

- At the production implementation commit, record exit-0 output for:

  ```bash
  npm run typecheck
  npm run lint
  npm test -- tests/unit/content.test.ts
  CI=1 PLAYWRIGHT_PORT=4224 npx playwright test tests/e2e/projects.spec.ts tests/e2e/responsive.spec.ts --project=Chromium
  npm run build
  npm run check:bundle
  ```

- Record changed production files, exact commit, targeted proof of the one Pokeleximon link/no `Live`, and the geometry decisions. Do not change Tester-owned files.

### Tester GREEN and exact-head release matrix

Run from a clean dependency install and isolated ports at one exact head. Record all output and the source commit in `docs/testing/portfolio-polish-report.md`:

| Gate | Exact command | Required evidence |
| --- | --- | --- |
| Clean dependencies | `npm ci` | exit 0 and lockfile-consistent environment |
| Types and lint | `npm run typecheck`<br>`npm run lint` | both exit 0 |
| Full coverage | `npm run test:coverage` | pass count and statements/branches/functions/lines, each above 90% and enforcing configured 91% thresholds |
| Static build and size | `npm run build`<br>`npm run check:bundle` | exit 0, emitted static build, JavaScript/image bytes and budgets |
| Full E2E | `CI=1 PLAYWRIGHT_PORT=4225 npm run test:e2e` | browsers, pass/skip/fail counts, direct hashes/history, keyboard and responsive regressions |
| Accessibility | `CI=1 PLAYWRIGHT_PORT=4226 npm run test:e2e:a11y` | axe result/count and affected viewports |
| No-update visuals | `CI=1 PLAYWRIGHT_PORT=4227 npm run test:e2e:visual` | exact visual outcome before any baseline update |
| Approved baseline update, only if needed | `CI=1 PLAYWRIGHT_PORT=4228 npm run test:e2e:visual -- --update-snapshots`<br>`CI=1 PLAYWRIGHT_PORT=4229 npm run test:e2e:visual` | behavioral GREEN precedes update; regenerated baseline list and passing confirmation |
| Diff integrity | `git diff --check` | no whitespace error; worktree audit identifies only intentional task changes plus protected `.DS_Store`/`.playwright-cli/` |

- The release report must include the focused Pokeleximon matrix (1440×1000, 1024×768, 390×844, 320×568, and 200% zoom), all measured box/ratio/height values, keyboard-only and reduced-motion result, and `/ben-portfolio/` static-base-path verification.
- Manually inspect the four visual PNGs (`desktop-1440x1000`, `desktop-390x844`, `career-1440x1000`, `career-390x844`) for the Kernel mark, simplified header, enlarged frame, Micro terminal, stable Career composition, correct Pokeleximon media, focus rings, clipping, and unexpected blank regions. State the result for each.
- Log each defect with severity, reproduction, expected behavior, actual behavior, affected acceptance criterion, owner, retest result, and final disposition. Product Owner acceptance requires no open defect.

## Final Product Owner acceptance

Accept PORT-017—and mark PORT-014 through PORT-017 accepted as the combined Portfolio OS polish release—only when the exact Tester head has current green evidence for every criterion above, every visible requirement in the approved design specification, and every prior packet. The final release record must identify the accepted commit, all prior implementation/tester commits, full release/visual matrix results, manual visual and interaction evidence, static `/ben-portfolio/` verification, and the intentional worktree audit. Otherwise return a bounded change request; do not accept on partial, historical, or mixed-head evidence.
