# PORT-020 CI Portability Test Report

Date: 2026-08-25

## Tester RED scope

- Authoritative base: `7573a0243292ed9d6b765a55c0f18c62053c2e7f` on `terminal-redesign`.
- Tester owns the focused WindowFrame and release-audit acceptance tests, the seven portable Playwright evidence-path corrections, the byte-preserving Darwin baseline move, and this report.
- Production components/styles, `playwright.config.ts`, workflows, package files, visual assertions/tolerances, and Linux baselines remain outside this RED checkpoint.

## Contracts specified

1. Every shared WindowFrame content area is a sequentially keyboard-focusable region named `<title> content`; keyboard order is Close, Minimize, Maximize/Restore, content region, then the content's first interactive control.
2. The shared content region has an explicit `:focus-visible` outline using Portfolio focus tokens and a negative outline offset that keeps it inside the clipped frame. Pointer focus must not gain a persistent focus ring.
3. Playwright uses the exact platform snapshot template and the exact list-plus-HTML reporter contract; the HTML report is written to `playwright-report/` and never auto-opened.
4. The quality workflow uploads `playwright-report/` and `test-results/` as `playwright-failure-evidence-linux` only on failure, with the approved immutable upload-artifact reference and `if-no-files-found: warn`.
5. All official Action references remain within the exact six approved SHA/comment values, allowing reuse of the approved upload-artifact pin.
6. Tracked source/tests contain no macOS-only temporary-root path. All seven existing manual-evidence screenshot calls use unique `testInfo.outputPath(...)` names while retaining `fullPage: true`, scenarios, and assertions.
7. The four accepted Darwin images live under `tests/e2e/visual.spec.ts-snapshots/darwin/` with unchanged bytes. No Linux image is manufactured on macOS.

## Darwin baseline custody

The files were moved with Git; no snapshot generation or update command was used.

| Baseline | Pre-move SHA-256 | Post-move SHA-256 | Result |
| --- | --- | --- | --- |
| `career-1440x1000.png` | `c151b736c0f6252985eac25bd9e24a21dd680956b58b7b3d3a3a15e9539b2c05` | `c151b736c0f6252985eac25bd9e24a21dd680956b58b7b3d3a3a15e9539b2c05` | MATCH |
| `career-390x844.png` | `a85282d027c421af4a511208a146762866fefb24962e050dd400fd7023d3f41a` | `a85282d027c421af4a511208a146762866fefb24962e050dd400fd7023d3f41a` | MATCH |
| `desktop-1440x1000.png` | `7b71e9ddffc335c79177b8820a471c7649d1c2d58f80837a61e958dfcc3cd194` | `7b71e9ddffc335c79177b8820a471c7649d1c2d58f80837a61e958dfcc3cd194` | MATCH |
| `desktop-390x844.png` | `fdeae2f4763ac7095dd780534a650cf1c55d6934c8050f93b5dd6e41af42f922` | `fdeae2f4763ac7095dd780534a650cf1c55d6934c8050f93b5dd6e41af42f922` | MATCH |

## Linux calibration charter

1. Developer first reaches local GREEN without editing Tester-owned tests/baselines, relaxing visuals, or creating Linux images.
2. On the user-authorized calibration push, require every non-visual quality step to pass. The only allowed failure is exactly four absent-Linux-baseline visual comparisons.
3. Confirm the failure-only artifact is named `playwright-failure-evidence-linux` and contains the HTML report plus `test-results/`, including the four expected Linux `*-actual.png` candidates.
4. Download the artifact, record run URL/ID/SHA and source-image names/checksums, and inspect every candidate at full size against its Darwin counterpart. Reject clipping, missing fonts/assets/content, overflow, layout drift, or any unapproved design difference.
5. If all four are faithful, copy only those inspected CI actuals into `tests/e2e/visual.spec.ts-snapshots/linux/` under the four exact accepted names; extend audit custody to their SHA-256 values and commit the Tester-owned baseline checkpoint. Never use snapshot-update mode in CI.
6. Push the Linux-baseline checkpoint and require the final GitHub quality run to pass at that exact SHA. Record the final run URL/conclusion and verify no Pages deployment occurred.

## Final GREEN and manual charter

- Run focused component/release tests, typecheck, lint, full coverage, build, bundle, full E2E, axe, and no-update visuals on fresh ports. Record exact versions, counts, coverage percentages, bundle bytes, both platform checksum sets, and GitHub conclusions.
- At 1440×1000, 1024×768, 390×844, and 320×568, use keyboard-only navigation to enter each open WindowFrame content region, confirm the focus indicator is visible and contained, scroll overflowing content with the keyboard, and Tab onward without a trap.
- Confirm mobile and non-overflowing regions remain harmless focus stops with natural page scrolling, no nested scroll trap, no horizontal overflow, and no layout change.
- Recheck controls, drag, maximize/restore, shortcuts, dock, Desktop-only Micro terminal, direct hashes/history, reduced motion, external/CV actions, axe `scrollable-region-focusable`, and console/framework-overlay health.
- Confirm all seven named evidence screenshots are created below their Playwright output directories; both baseline platform directories contain exactly four images; assertions still use `animations: 'disabled'` without tolerance or update changes.
- Finish with exact Action-reference, tracked temporary-root, artifact, `git diff --check`, and ordinary clean-status audits. No deploy is authorized.

## RED evidence

Executed against the pre-implementation component/configuration/workflow candidate:

```text
PATH=/opt/homebrew/opt/node@24/bin:$PATH npm test -- tests/component/WindowFrame.test.tsx tests/unit/release-audit.test.ts
```

Result: **2 failed files; 5 failed / 14 passed tests**. Every failure is an intentional PORT-020 pre-implementation contract:

1. WindowFrame has no accessible region named `Work content`, so the required `tabIndex="0"` focus stop and its locked position between controls and body action are absent.
2. `WindowFrame.module.css` has no `.content:focus-visible` rule with the Portfolio focus outline and inside-the-frame negative offset.
3. `snapshotPathTemplate` is still `{testDir}/{testFilePath}-snapshots/{arg}{ext}` rather than the required platform tree.
4. Playwright has no explicit list-plus-HTML reporter configuration (`reporter` is `undefined`).
5. The quality workflow lacks the exact failure-only `playwright-failure-evidence-linux` upload step.

No unrelated failure occurred. The new custody/portability contracts already pass: the four Darwin baselines are tracked at their exact platform paths with matching SHA-256 values; tracked source/tests contain no macOS-only temporary-root reference; and every official Action reference remains one of the exact six approved immutable pins. All existing WindowFrame and PORT-013/014/019 release contracts remain green.

Tester-file maintenance checks:

```text
PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run typecheck  PASS
PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run lint       PASS — zero warnings
```

All seven manual screenshot calls now use `testInfo.outputPath(...)` with their original unique filenames and `fullPage: true`. No Linux baseline exists in this checkpoint, and no snapshot-update command was used.

## Tester maintenance after Developer handoff

At Developer candidate `bc786d514f5f91b0f92584f6fa92306f7f1c2cd5`, full coverage exposed one stale Tester-owned keyboard sequence: `PortfolioShell.test.tsx` still expected `Close Work` immediately after `Maximize About`. The accepted shared WindowFrame contract now places labelled, focusable content regions after each frame's controls. The test sequence now explicitly requires `About content` before `Close Work` and `Work content` before the existing `View Work` body action; every prior control, body, shell, terminal, dock, and utility-link assertion remains in order.

Retest evidence:

| Command | Result |
| --- | --- |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm test -- tests/component/PortfolioShell.test.tsx tests/component/WindowFrame.test.tsx` | PASS — **2 files, 12 tests**, 0 failed. |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run test:coverage` | PASS — **22 files, 185 tests**, 0 failed. Statements **98.46%** (577/586), branches **91.29%** (430/471), functions **99.34%** (152/153), lines **99.60%** (510/512). Every dimension remains above 90% and every checked-in 91% threshold passes. |

Disposition: the stale Tester sequence is corrected without changing production or weakening navigation coverage. No open concern remains from this maintenance fix.

## First Linux calibration — rejected display-font fallback

- GitHub quality run: [32829755322](https://github.com/ben-hutchinson/ben-portfolio/actions/runs/32829755322).
- Result boundary: every non-visual check passed; Playwright reported **49 passed, 172 skipped, exactly 4 failed**, all four caused by absent Linux expected baselines.
- Artifact: `playwright-failure-evidence-linux`, downloaded to `/tmp/portfolio-port020-32829755322.uLrq7A` for Tester inspection only.

Each actual was inspected at full size against the corresponding accepted Darwin baseline:

| Candidate source | SHA-256 | Inspection finding | Decision |
| --- | --- | --- | --- |
| `test-results/visual-PORT-012-approved-v-096fd-ed-Portfolio-OS-composition-Chromium/desktop-1440x1000-actual.png` | `a9153208d1796acd18540f14f98eeb1369b61cb88152caff8363d545869dbe7d` | Display fallback makes Ben's name wrap to two lines, materially reflows Work, and clips About copy at the frame bottom. | REJECT |
| `test-results/visual-PORT-012-approved-v-c6c49-ed-Portfolio-OS-composition-Chromium/desktop-390x844-actual.png` | `8d5dd56b3d314944a377fa6cc98add11afc5f728fb68143a9ae9eedaa7685995` | Fallback metrics reflow the About composition and push `Hutchinson` into the right frame edge. | REJECT |
| `test-results/visual-PORT-012-approved-v-5e8e3-ed-Portfolio-OS-composition-Chromium/career-1440x1000-actual.png` | `772f9841d762e409ecc29093323ca3ef1de0d9f27f26ff7c1eee0d69d2450de2` | Career headline/evidence typography reflows; `SYSTEMS` is absent from the visible headline and evidence copy clips. | REJECT |
| `test-results/visual-PORT-012-approved-v-52a1c-ed-Portfolio-OS-composition-Chromium/career-390x844-actual.png` | `420267029d725c44378219e6d5642b9591ec6be58c890a5c3b5dc8a481bb1742` | Large stage/evidence typography and wrapping materially differ from the accepted composition. | REJECT |

Root cause: the display token names Inter but the release neither ships nor loads it, so Ubuntu falls through to a system sans-serif with different metrics. No rejected actual was copied into the expected-baseline tree. The accepted bounded correction is the official immutable Inter 4.1 normal variable face and OFL custody files, self-hosted under `/ben-portfolio/fonts/`.

Official custody sources for the replacement acceptance contract:

- Inter 4.1 normal variable WOFF2: `https://raw.githubusercontent.com/rsms/inter/refs/tags/v4.1/docs/font-files/InterVariable.woff2`; SHA-256 `693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3`; 352,240 bytes.
- Inter 4.1 SIL OFL 1.1: `https://raw.githubusercontent.com/rsms/inter/refs/tags/v4.1/LICENSE.txt`; SHA-256 `262481e844521b326f5ecd053e59b98c8b2da78c8ee1bdbb6e8174305e54935a`; 4,380 bytes.

## Deterministic display-font Tester RED

Acceptance coverage now requires exact source-file custody, a single normal 100–900 `@font-face` with `font-display: block`, the unchanged display token and no external runtime font service, built-preview publication and response integrity, and observable browser evidence consisting of the loaded document face, the Inter computed family, and the `/ben-portfolio/fonts/InterVariable.woff2` resource. `document.fonts.check()` remains an explicit visual precondition but is not accepted alone.

The four existing screenshot tests now await `document.fonts.ready`, assert the current 900-weight normal face check, prove the actual loaded face/resource/computed family, and only then run their unchanged filenames and `animations: 'disabled'` screenshot assertions. No tolerance, retry, skip, timeout, or update mode was added.

RED executed against Product Owner candidate `58e0ddd` with no production, configuration, workflow, package, or font-asset change.

| Command | RED result |
| --- | --- |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm test -- tests/unit/release-audit.test.ts` | Expected RED — **1 failed file; 2 failed / 12 passed tests**. Failures are limited to the absent tracked Inter/OFL files and the absent sole local `@font-face`. |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run typecheck` | PASS. |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run lint` | PASS — zero warnings. |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run build` | PASS; inspection confirmed both `dist/fonts/InterVariable.woff2` and `dist/fonts/OFL-1.1.txt` are absent as expected before implementation. |
| `CI=1 PATH=/opt/homebrew/opt/node@24/bin:$PATH PLAYWRIGHT_PORT=4253 npx playwright test tests/e2e/github-pages.spec.ts tests/e2e/visual.spec.ts --project=Chromium` | Expected RED — **5 failed / 2 passed tests**. The built-preview font URL falls through to HTML rather than a WOFF2 response, and each of four visual paths reports no loaded Inter `FontFace`. Existing GitHub Pages route/resource/history tests pass. |

The focused browser result demonstrates why `document.fonts.check('900 16px Inter')` is insufficient alone: on this macOS host it returns true for the locally installed face, while `document.fonts` contains no page-defined loaded Inter face and the WOFF2 resource is absent. The additional face/resource/computed-family contract fails deterministically before any screenshot comparison and will require the shipped face to be genuinely loaded.

All prior release assertions remain green. The unchanged visual assertion still has the same four filenames and `{ animations: 'disabled' }`; no tolerance or snapshot-update setting exists. These failures are solely the missing approved font custody, declaration, production publication, and browser-load behavior requested by the bounded change.

## Deterministic Inter Darwin baseline recertification

Product Owner ruling `950134c` authorized one manual replacement of the four fallback-font Darwin baselines. Tester reviewed the fresh no-update actuals produced from exact Developer candidate `d3dce89e2dc20b957ec24bdf6262ee8797607d6a` on macOS 26.5.2 (Build 25F84), Apple Silicon, Playwright 1.62.1, and Chrome for Testing 151.0.7922.34. The visual test contract awaited `document.fonts.ready`, passed `document.fonts.check('900 16px Inter')`, and required the one loaded normal `Inter` variable `FontFace`, computed `Inter` display family, and `/ben-portfolio/fonts/InterVariable.woff2` performance resource before each capture.

Retired fallback Darwin custody:

| Exact baseline path | Retired SHA-256 |
| --- | --- |
| `tests/e2e/visual.spec.ts-snapshots/darwin/desktop-1440x1000.png` | `7b71e9ddffc335c79177b8820a471c7649d1c2d58f80837a61e958dfcc3cd194` |
| `tests/e2e/visual.spec.ts-snapshots/darwin/desktop-390x844.png` | `fdeae2f4763ac7095dd780534a650cf1c55d6934c8050f93b5dd6e41af42f922` |
| `tests/e2e/visual.spec.ts-snapshots/darwin/career-1440x1000.png` | `c151b736c0f6252985eac25bd9e24a21dd680956b58b7b3d3a3a15e9539b2c05` |
| `tests/e2e/visual.spec.ts-snapshots/darwin/career-390x844.png` | `a85282d027c421af4a511208a146762866fefb24962e050dd400fd7023d3f41a` |

Reviewed Inter actual and replacement custody:

| Actual source path | Recertified SHA-256 | Full-size inspection decision |
| --- | --- | --- |
| `test-results/visual-PORT-012-approved-v-096fd-ed-Portfolio-OS-composition-Chromium/desktop-1440x1000-actual.png` | `1af2a4174ff0afc2ba5f6ab3d2a44df0018c9548cdac3d360da3e0da641f8d28` | ACCEPT — only intended Inter glyph metrics/rasterization changed. About and Work retain exact window geometry, complete copy, hierarchy, controls, action visibility, spacing relationships, and clipping/overflow state. |
| `test-results/visual-PORT-012-approved-v-c6c49-ed-Portfolio-OS-composition-Chromium/desktop-390x844-actual.png` | `0920132148245ebb7a0cc3ca6c02549cb966ff0649715b88ba2a74230e5b4544` | ACCEPT — Ben's name, role, summary, opportunity copy, frame controls, Micro terminal, reset action, and dock remain visible in the same responsive composition with no new edge collision, clipping, or horizontal overflow. |
| `test-results/visual-PORT-012-approved-v-5e8e3-ed-Portfolio-OS-composition-Chromium/career-1440x1000-actual.png` | `fc956593d39fcfccde07264879d4bcee12c559435796b2274c117c7660bae8dc` | ACCEPT — stage year, headline, evidence card, slider, direct-stage controls, window bounds, and background geometry remain in place; all copy and affordances retain their approved visibility with no overflow or clipping regression. |
| `test-results/visual-PORT-012-approved-v-52a1c-ed-Portfolio-OS-composition-Chromium/career-390x844-actual.png` | `c234b733fb60f44f3e8dc8e99795554e9e6328b627d28fa1506dde91623568fb` | ACCEPT — the approved narrow composition, headline wrapping, evidence-card viewport continuation, frame chrome, and scrollable-content boundary are unchanged apart from Inter rasterization; no new clipping, collision, or horizontal overflow is present. |

Each reviewed actual was copied manually to its exact same-named Darwin baseline path. No snapshot-update command, CI update, tolerance, filename, assertion option, copy, layout, route, or production change was used. The directory still contains exactly the four approved names, and the release audit now binds those names to the recertified hashes above. The rejected Linux candidates remain retired and were not copied.

Recertification gates:

| Command | Result |
| --- | --- |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm test -- tests/unit/release-audit.test.ts` | PASS — **1 file, 14 tests**, 0 failed. Exact Darwin set/checksums and deterministic-font custody remain enforced. |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run typecheck` | PASS. |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run lint` | PASS — zero warnings. |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run build` | PASS — Vite 8.2.1 built 475 modules; CSS 31.36 kB / 5.97 kB gzip and JS 309.12 kB / 99.22 kB gzip. |
| `CI=1 PATH=/opt/homebrew/opt/node@24/bin:$PATH PLAYWRIGHT_PORT=4259 npm run test:e2e -- tests/e2e/github-pages.spec.ts` | PASS — **3 passed / 12 intentional project skips**, 0 failed. The pinned WOFF2/OFL response digests, font-compatible response, static and relative base paths, loaded `FontFace`, resource, and computed display family all passed. |
| `CI=1 PATH=/opt/homebrew/opt/node@24/bin:$PATH PLAYWRIGHT_PORT=4260 npm run test:e2e:visual` | PASS in normal no-update mode — **4 passed / 16 intentional project skips**, 0 failed. All four recertified Darwin comparisons are exact. |

Custody disposition: the four fallback Darwin hashes are retired under the PO exception; the four Inter-loaded hashes above are the only approved Darwin set. The git commit containing this section, the updated checksum contract, and exactly those four PNG replacements is the recertification custody commit; its immutable SHA is reported in the Tester handoff because a commit cannot contain its own hash.
