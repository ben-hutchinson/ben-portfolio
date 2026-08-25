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
