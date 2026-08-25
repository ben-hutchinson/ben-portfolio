# PORT-020 — Make CI browser checks portable across macOS and Linux

Status: READY FOR TESTER RED

Requirement links: `docs/AGENTS.md` §§3–6, 15–20; GitHub Actions failure transcript supplied 2026-08-25; user-approved PORT-020 design.

User outcome: The accepted Portfolio OS behaves and looks the same, while keyboard users can enter every scrollable app region and the complete Playwright suite produces reliable, inspectable evidence on both local macOS and GitHub-hosted Linux runners.

## Failure evidence and bounded cause

The supplied Ubuntu CI run has twelve failures with three causes:

- axe reports `scrollable-region-focusable` for the shared `WindowFrame` content region in About, Work catalogue, and Work detail;
- seven manual-evidence screenshots write to macOS-only `/private/tmp` paths and fail with `ENOENT` on Linux;
- all four visual tests compare Ubuntu output against the four accepted macOS baselines because the snapshot template has no platform segment.

These are portability/accessibility defects, not grounds to alter the accepted UI or weaken visual assertions.

## Exact scope

### Keyboard-focusable window content

Update `src/shell/WindowFrame.tsx` and `src/shell/WindowFrame.module.css` so the shared `.content` element:

- is reachable in sequential keyboard navigation with `tabIndex={0}` and has the stable accessible name ``${title} content``;
- displays a clear Portfolio OS-aligned `:focus-visible` outline that remains inside the window boundary and is not clipped;
- preserves mouse/touch behavior, current scrolling, window controls, maximize/restore, dimensions, and content layout;
- remains a harmless labelled focus stop when responsive CSS makes content non-scrollable: it must not create a nested scroll trap, unexpected page scroll, persistent mouse-focus ring, overflow, or mobile layout change.

The shared fix must cover every framed application and resolve axe's `scrollable-region-focusable` rule. Do not add per-app exceptions.

### Portable Playwright evidence paths

Tester owns the affected Playwright files and replaces every hardcoded `/private/tmp` screenshot path with a unique `testInfo.outputPath(...)` value:

- `tests/e2e/contact-command.spec.ts`;
- `tests/e2e/projects.spec.ts`;
- `tests/e2e/work.spec.ts`.

Add `testInfo` to the test callback where it is not already available. Preserve screenshot names, `fullPage: true`, assertions, scenarios, and coverage. A repository search over tracked source and tests must find no `/private/tmp` reference.

### Platform-specific visual contract

Update `playwright.config.ts` to use exactly:

```ts
snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{platform}/{arg}{ext}',
```

The four current approved baselines move byte-for-byte, preferably with `git mv`, into:

```text
tests/e2e/visual.spec.ts-snapshots/darwin/desktop-1440x1000.png
tests/e2e/visual.spec.ts-snapshots/darwin/desktop-390x844.png
tests/e2e/visual.spec.ts-snapshots/darwin/career-1440x1000.png
tests/e2e/visual.spec.ts-snapshots/darwin/career-390x844.png
```

Record their pre-move and post-move SHA-256 checksums; every pair must match. Do not regenerate or visually alter the Darwin baselines.

Final acceptance also requires the same four filenames under `tests/e2e/visual.spec.ts-snapshots/linux/`. Linux images must come from the GitHub runner calibration evidence described below, receive individual visual inspection, and be committed by the Tester. Both `darwin/` and `linux/` sets are required. No Windows baseline is in scope.

Keep the four `toHaveScreenshot` assertions and their existing `animations: 'disabled'` option unchanged. Do not add or raise `threshold`, `maxDiffPixels`, `maxDiffPixelRatio`, or any other tolerance, and never run snapshot-update mode in CI.

### Actionable failure evidence

In `.github/workflows/quality.yml`, ensure CI produces an HTML report at `playwright-report/` while retaining concise console reporting. After the browser-test step, add a failure-only evidence step using the already approved immutable Action pin:

```yaml
- name: Upload Playwright failure evidence
  if: failure()
  uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4
  with:
    name: playwright-failure-evidence-linux
    path: |
      playwright-report/
      test-results/
    if-no-files-found: warn
```

The uploaded `test-results/` must contain the four Linux `*-actual.png` snapshot candidates on the expected first calibration failure; those actual images are the source for the Linux baselines. Do not copy actuals into the expected-baseline tree or update snapshots automatically in CI.

Retain the existing quality commands, triggers, permissions, build artifact, and job topology. The Pages workflow and deployment behavior are untouched. Every official Action reference must continue to use these exact six approved pins/comments; the new failure step reuses the existing upload-artifact pin rather than introducing a seventh Action version:

```yaml
actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4
actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4
actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4
actions/download-artifact@d3f86a106a0bac45b974a628896c90dbdf5c8093 # v4
actions/upload-pages-artifact@7b1f4a764d45c48632c6b24a0339c27f5614fb0b # v4
actions/deploy-pages@d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e # v4
```

## Role handoff and checkpoints

### 1. Tester RED

Before production/configuration implementation, the Tester:

- extends the focused `WindowFrame` component test to require the labelled `tabIndex="0"` content region and adds an assertion for the visible keyboard-focus contract;
- extends `tests/unit/release-audit.test.ts` to require the exact `{platform}` template, unchanged Darwin bytes/location, absence of `/private/tmp`, the failure-evidence step/path/name/condition, and the exact six Action pins/comments;
- converts the seven manual screenshots to `testInfo.outputPath(...)` and moves the four unchanged Darwin baselines into `darwin/` as Tester-owned evidence changes;
- creates `docs/testing/PORT-020-ci-portability-report.md` with a local/CI calibration charter;
- runs the focused tests against the pre-implementation product/configuration, records the expected deterministic failures, and commits only Tester-owned tests/baselines/report.

RED must demonstrate missing focusability, the non-platform snapshot template, and missing failure evidence. It must not weaken an existing assertion or manufacture Linux baselines locally.

### 2. Developer implementation and local gates

The Developer implements only the shared `WindowFrame`, stylesheet, Playwright configuration/reporter, and quality-workflow changes above. The Developer does not edit Tester-owned tests or baselines. Before handoff, run and record:

```bash
npm run typecheck
npm run lint
npm test -- tests/component/WindowFrame.test.tsx tests/unit/release-audit.test.ts
npm run test:coverage
npm run build
npm run check:bundle
CI=1 PLAYWRIGHT_PORT=4250 npm run test:e2e
CI=1 PLAYWRIGHT_PORT=4251 npm run test:e2e:a11y
CI=1 PLAYWRIGHT_PORT=4252 npm run test:e2e:visual
git diff --check
```

The local no-update visual run must use and pass the preserved Darwin baselines. Commit the bounded implementation before the CI calibration handoff.

### 3. Linux calibration handoff

After local Tester GREEN and only as the user-authorized calibration step, push the exact candidate and observe the GitHub quality run. One failure is temporarily acceptable: the four Linux expected baselines do not yet exist. All non-visual tests and checks must pass, and the visual failure must name exactly those four missing Linux snapshots. Any accessibility, path, build, assertion, workflow, or additional visual failure is a defect and blocks calibration.

The Tester downloads `playwright-failure-evidence-linux`, inspects the report plus every actual image at full size against the accepted UI and its corresponding Darwin baseline, and records the comparison. If faithful, copy only the four inspected Linux actuals to the exact `linux/` baseline paths, extend the release audit to require exactly the four named Linux files, and commit them together. Do not use CI snapshot update, relax assertions, or accept a diff blindly. If any candidate shows clipping, font failure, overflow, missing content, changed layout, or other product regression, reject it and return to the Developer.

Push the Linux-baseline checkpoint and require the final GitHub quality run to pass. The initial calibration run ID/result, artifact identity, four source image names/checksums, inspection decision, baseline commit, and final successful run URL/SHA belong in the Tester report.

### 4. Final Tester GREEN

At the exact final candidate, the Tester runs all local gates above plus the full required browser matrix on fresh ports, without updating snapshots. Record versions, commands, pass/skip/fail counts, all four coverage percentages, bundle bytes, Darwin checksums, Linux checksums, axe results, and GitHub check conclusions. Manually verify at 1440×1000, 1024×768, 390×844, and 320×568:

- Tab reaches each open window content region, focus is visible, content can be keyboard-scrolled, and focus can leave the region;
- mobile/non-overflowing regions do not trap scroll or alter layout;
- window controls, dragging, maximize/restore, Desktop shortcuts, dock, Micro terminal, direct hashes/history, reduced motion, and external/CV actions remain unchanged;
- all seven evidence screenshots are created within their Playwright output directories;
- both platform baseline sets contain exactly the four expected named images and no baseline was updated during verification.

Final evidence also includes `git diff --check`, clean ordinary status, an audit of tracked `/private/tmp` references, exact Action references, and confirmation that no deploy occurred.

### 5. Product Owner acceptance

Product Owner accepts only the exact tested candidate after a clean task-scoped review, no open defect, a successful final GitHub quality run, and evidence for every criterion below. The allowed first calibration failure must be documented and limited to four absent Linux baselines.

## Product Owner change request — deterministic approved display font

### Decision and rejection

**Status: RETURNED TO DEVELOPER — bounded PORT-020 portability defect.** The first Linux calibration candidate is rejected under the explicit calibration clause: all four `*-actual.png` images are materially unfaithful. Linux resolves the existing `Inter` display-token name to a fallback because the repository neither ships nor loads Inter. The resulting fallback metrics reflow or clip approved content: desktop 1440 About and Work, desktop 390 Hutchinson, career 1440 headline/Evidence, and career 390 typography/layout. No Linux baseline may be committed from this candidate.

The accepted Darwin design is preserved. This request supplies the already-approved display family deterministically; it does not approve a redesign, a different typeface, adjusted copy or layout, changed routes, changed visual tolerances, altered Pages behavior, or a dependency/lockfile change.

### Exact implementation scope

Developer adds these source-controlled static files, without an npm package, remote runtime fetch, or lockfile change:

```text
public/fonts/InterVariable.woff2
public/fonts/OFL-1.1.txt
```

- `InterVariable.woff2` must be the unmodified normal/roman variable WOFF2 at the official immutable Inter 4.1 tag: `https://raw.githubusercontent.com/rsms/inter/refs/tags/v4.1/docs/font-files/InterVariable.woff2`. Do not fetch from `master`, a CDN, Google Fonts, or a third-party repackager. Record this source URL, release/tag, and the downloaded file's SHA-256 in the Tester report before final calibration.
- `OFL-1.1.txt` must be the complete SIL Open Font License 1.1 at `https://raw.githubusercontent.com/rsms/inter/refs/tags/v4.1/LICENSE.txt`, supplied by the same official immutable Inter distribution. Preserve the filename and text; it is the required attribution/license custody for the shipped binary.
- Add exactly one normal-face `@font-face` in `src/styles/tokens.css` before `:root`. It must use `font-family: "Inter"`, `font-style: normal`, `font-weight: 100 900`, and `src: url("/ben-portfolio/fonts/InterVariable.woff2") format("woff2")`. Do not synthesize a different family, weight, style, or font asset. The existing `--font-display: Inter, ...` token remains unchanged.
- Set `font-display: block` on that face. The screenshot contract must never capture system fallback or a swap/reflow: `block` prevents a fallback flash, and the visual suite must wait for the loaded face as specified below. Do not use `swap`, `fallback`, `optional`, or a timeout/polling workaround.
- No italic face is required because PORT-020's approved display use is normal-only. Do not add preloads, external font CSS, JavaScript font loaders, npm packages, or changes outside the files necessary to ship this binary, its license, and the single face declaration.

### Tester-owned acceptance and calibration additions

The Tester extends PORT-020 acceptance coverage without weakening any current assertion:

- Add a release-audit contract that requires both exact `public/fonts/` files; validates the sole normal `@font-face` values above, including the literal base-path URL and `font-display: block`; and rejects an external Inter import/URL, a dependency/lockfile change, or an alteration to `--font-display`.
- Build the site and assert that the production output contains `fonts/InterVariable.woff2` and `fonts/OFL-1.1.txt`, that the WOFF2 response is non-empty with a font-compatible content type, and that an app page's computed display-family resolves to `Inter` rather than its fallback. Test both the static preview under `/ben-portfolio/` and the normal local base path.
- In the four screenshot tests, explicitly await `document.fonts.ready` before each `toHaveScreenshot` assertion and assert `document.fonts.check('900 16px Inter')` (and the applicable current normal display weight) is true. This is a Tester-owned synchronization requirement, not permission to defer, retry, skip, or relax screenshots. Keep all four existing assertions, filenames, `animations: 'disabled'`, and every visual tolerance unchanged.
- The original four Darwin images are now proven fallback-font artifacts, so the superseded byte-preservation rule does not apply to them. Follow the deterministic-font Darwin recertification ruling below; no other baseline may be regenerated or altered.
- Only after that local result is GREEN may the user-authorized Linux calibration be repeated. The expected first calibration failure remains exactly the four absent Linux baseline files; the actuals must be free of the listed clipping/reflow defects and undergo full-size inspection against their Darwin counterparts before any Linux baseline commit. Any font-load, asset, test, layout, or additional visual failure rejects the candidate.
- The final exact-head Linux quality run, after the four inspected baselines are committed, must pass without snapshot-update mode. The Tester report must record the Inter source URL, release/tag, WOFF2 SHA-256, license file SHA-256, asset-bundling/loaded-face evidence, calibration run/artifact details, image checksums, inspection decision, and final successful run URL/SHA.

### Additional acceptance criteria

- [ ] A pinned official Inter 4.1 normal variable WOFF2 and complete OFL 1.1 attribution are shipped from `public/fonts/`; no runtime font dependency or network request is required.
- [ ] The one face maps the existing `Inter` token to normal variable weights 100–900, serves from `/ben-portfolio/fonts/InterVariable.woff2`, uses `font-display: block`, and leaves the existing token/fallback list intact.
- [ ] Production build evidence proves both files are published and the browser proves the intended Inter face is loaded before every visual assertion.
- [ ] Deterministic-font Darwin visual baselines are recertified exactly once under the ruling below; the repeated Linux calibration contains only the four absent-baseline failures and produces four faithful, reviewed candidates before Linux baselines are accepted.

### Deterministic-font Darwin baseline recertification ruling

**Ruling: APPROVED — limited baseline replacement required.** The four originally accepted Darwin images, and the four rejected first-calibration Linux actuals, were all rendered with fallback display metrics. Retaining fallback pixels conflicts with the approved deterministic Inter requirement. Retire those eight artifacts from PORT-020 visual custody; do not accept or commit any rejected Linux actual. The Tester may replace only the four Darwin expected images with visually recertified, Inter-loaded macOS actuals. This exception supersedes only the earlier `byte-for-byte` preservation requirement for those four fallback Darwin files; it does not permit tolerance changes, CI snapshot updates, new visual files, design/copy/layout/route changes, or automatic snapshot acceptance.

1. Starting from the exact Developer candidate with the staged font implementation, run the four macOS visual tests in normal no-update mode. They must fail only at the four existing Darwin comparisons and produce `desktop-1440x1000`, `desktop-390x844`, `career-1440x1000`, and `career-390x844` actuals. Focused release audit (`14/14`), production-font publication, and GitHub Pages loaded-face test evidence must remain GREEN; any other failure blocks recertification.
2. For each current Darwin baseline, record its retired fallback SHA-256 and exact source path. For each corresponding macOS actual, record the actual filename/path, SHA-256, rendered platform/browser/version, exact candidate SHA, and proof that `document.fonts.ready` completed and `document.fonts.check('900 16px Inter')` passed before capture.
3. The Tester must inspect each of the four current Darwin actuals at full size against the approved design and the retired fallback image. Confirm the observed difference is restricted to the intended Inter typeface/rasterization; composition, copy, geometry, responsive behavior, visibility, clipping, overflow, and interaction affordances must be unchanged. Record this per-image decision in `docs/testing/PORT-020-ci-portability-report.md`. The controller's present inspection—12,447 px / 1%, 2,366 px / 1%, 9,182 px / 1%, and 4,113 px / 2%, respectively, with no clipping or overflow—is preliminary evidence, not a substitute for Tester custody.
4. Only after all four inspections pass may the Tester manually copy those four reviewed macOS actuals to the existing exact Darwin baseline paths. Do not run a snapshot-update command or update snapshots in CI. Preserve exactly four named PNGs under `tests/e2e/visual.spec.ts-snapshots/darwin/`; commit the four replacements and the Tester report together as Tester-owned evidence. Record both retired and recertified checksum tables, the test command/result, candidate SHA, and custody commit SHA.
5. Run the four macOS visual tests again in no-update mode against the recertified files. All must pass. This second run, its rendered-face proof, and `git diff --check` are mandatory before the user-authorized Linux calibration repeats.
6. Repeat Linux calibration from that exact committed candidate. The only permissible first failure is the four absent Linux expected baselines. Each Linux actual must prove the loaded Inter face, undergo the existing full-size inspection/custody process, and be accepted only if faithful to the recertified deterministic-font Darwin counterpart. Any fallback load, clipping, overflow, layout drift, extra visual failure, or non-visual failure rejects the candidate.

The Tester report and release audit must assert exactly four Darwin and exactly four Linux filenames, with no retired Linux actual tracked in either baseline tree. Final evidence must distinguish retired fallback checksums from recertified deterministic-font checksums and include all eight final platform baseline checksums.

## Acceptance criteria

- [ ] Shared WindowFrame content is labelled, sequentially keyboard-focusable, visibly focused for keyboard users, keyboard-scrollable when overflowing, and non-trapping/non-disruptive on mobile and non-overflowing content.
- [ ] axe reports no `scrollable-region-focusable` violation for About, Work catalogue, Work detail, or any other framed app.
- [ ] Every Playwright screenshot path uses `testInfo.outputPath(...)`; tracked source/tests contain no `/private/tmp` reference and Linux creates all seven evidence screenshots.
- [ ] `snapshotPathTemplate` contains `{platform}` exactly as specified. Exactly four Tester-recertified deterministic-Inter Darwin baselines are present under `darwin/` with recorded custody checksums, and four separately inspected CI-derived deterministic-Inter baselines are present under `linux/`.
- [ ] Visual assertions and tolerances are unchanged; no CI command or workflow updates snapshots.
- [ ] A failure-only, immutable-pinned upload step captures `playwright-report/` and `test-results/`, including Linux actual candidates on calibration failure, without altering normal build or Pages deployment behavior.
- [ ] All workflow Action references use only the six exact approved SHA pins/comments. Workflow triggers, permissions, existing commands/build artifact, Pages workflow, and deploy guards are unchanged except for the bounded report/evidence additions.
- [ ] The first calibration failure, if used, contains exactly four absent-Linux-baseline failures; all four candidates are inspected before their Tester-owned commit, and the subsequent exact-head GitHub quality run passes.
- [ ] Final typecheck, lint, coverage, build, bundle, full E2E, axe, and no-update visual suites pass; all four coverage dimensions remain above 90% and every required manual viewport/keyboard/route check passes.
- [ ] No dependency/lockfile, professional copy, application route, design/layout, security header, snapshot tolerance, or Pages deployment change is present; the worktree is clean and no deployment occurred.

## Excluded scope

- Dependency or lockfile changes; copy/content edits; new routes, commands, apps, or interactions; redesign or layout adjustment.
- CSP/referrer changes, analytics, runtime APIs, Pages workflow/deploy behavior changes, push beyond the approved calibration/final-check sequence, PR, merge, publish, or deploy.
- Per-app accessibility workarounds, focus auto-management, focus rings on pointer interaction, or mobile scrolling redesign.
- Regenerating Darwin baselines other than the one explicitly authorized deterministic-font recertification above; deriving Linux baselines on macOS; sharing one baseline across platforms; increasing visual tolerance; or any CI snapshot-update mode.
- Changing existing test intent, skipping a browser/platform to obtain GREEN, or committing reports/downloads other than the four reviewed Linux baseline images and the Tester report.
