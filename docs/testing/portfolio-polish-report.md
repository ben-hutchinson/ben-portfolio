# PORT-014 Tester GREEN report

Status: **PASS — ready for Product Owner acceptance.**

## Candidate and environment

- Production candidate: `568a0538be42c3abf3092bcab3e9aef8db228dc2` (`fix: complete PORT-014 shell chrome`), based on production implementation `8f68eaa`.
- Branch: `terminal-redesign`.
- Date: 2026-08-13.
- Node: `v26.7.0`; Vitest: `4.1.10`; Playwright: `1.62.1`; Chromium project.
- Manual production preview: `npm run preview -- --host 127.0.0.1 --port 4226 --strictPort`, served at `http://127.0.0.1:4226/ben-portfolio/` (HTTP 200).
- The pre-existing `.DS_Store` worktree modification was not changed or staged.

## Automated verification

| Command | Result |
| --- | --- |
| `npm test -- tests/unit/foundation.test.tsx tests/unit/release-audit.test.ts` | PASS — 2 files, 10 tests. |
| `CI=1 PLAYWRIGHT_PORT=4224 npx playwright test tests/e2e/responsive.spec.ts tests/e2e/window-system.spec.ts tests/e2e/accessibility.spec.ts --project=Chromium` | PASS — 10 passed, 1 intentional non-Chromium project-guard skip. |
| `npm run typecheck` | PASS — `tsc -b`. |
| `npm run lint` | PASS — zero warnings/errors. |
| `npm run build` | PASS — static Vite build completed. |
| `npm run check:bundle` | PASS — 97,654 gzip JS bytes / 204,800; 118,529 initial image bytes / 1,048,576. |
| `npm run test:coverage` | PASS — 22 files, 154 tests; statements 98.72%, branches 91.92%, functions 98.63%, lines 99.58%. Every configured 91% threshold is met. |
| `CI=1 PLAYWRIGHT_PORT=4228 npx playwright test tests/e2e/career.spec.ts --project=Chromium --grep "reduced motion"` | PASS — 1 passed. |

The first focused Chromium command had no test failures. The single skip is an explicit project guard in the mobile-Chrome-only window-system test, which cannot run under the requested Chromium project.

## Manual matrix

| Viewport / input | Route and checks | Evidence and result |
| --- | --- | --- |
| 1440×1000 / mouse + keyboard | `#desktop`; simplified header, favicon/mark contract, utility links, shell gutter, titlebar rule, first keyboard focus. | PASS. Shell left gutter = 20px, width = 1400px; no horizontal overflow; no `Primary navigation`; GitHub → LinkedIn → Download CV are grouped inline-SVG utilities; external links retain `noopener noreferrer`; CV has `download="ben-hutchinson-cv.pdf"`. Work titlebar has `border-bottom: 0px`, Ink inset shadow `rgb(19, 34, 24) 0px -3px 0px 0px inset`, and maximize/control bottom equals titlebar bottom (192.1953125px). Screenshots: `.playwright-cli/port14-1440-desktop.png`, `.playwright-cli/port14-1440-keyboard-focus.png`. |
| 1280×800 / mouse + keyboard | Hard-load `#work`; inspect heading order and focused Work state. | PASS. Work is visible, `h1` is `Python Dependency Migration`, heading sequence begins at H1 and has no skipped level, and no horizontal overflow. Screenshot: `.playwright-cli/port14-1280-work.png`. |
| 390×844 / narrow-layout keyboard | Hard-load `#desktop`; inspect single-app mobile mode, target sizes, edge spacing, no overflow. | PASS. Only About is displayed; shell left edge = 9.59375px; no horizontal overflow. Dock Work = 52.4765625×44px; Close About = 44×44px; Download CV = 121.078125×44px. Screenshot: `.playwright-cli/port14-390-desktop.png`. |
| 390×844 / 200% zoom | `#desktop`; set page zoom to 200% and inspect overflow/required controls. | PASS. No horizontal overflow and required dock/window controls remain rendered. Screenshot: `.playwright-cli/port14-390-200zoom.png`. |
| 320×568 / narrow-layout keyboard | Hard-load `#desktop`; inspect safe edges, single app, overflow, and visible dock focus. | PASS. Only About is displayed; shell left edge = 19.1953125px; dock left edge = 25.1953125px; no horizontal overflow. Focused dock Work reports solid 3px outline. Screenshots: `.playwright-cli/port14-320-desktop.png`, `.playwright-cli/port14-320-focus.png`. |
| Direct hashes + history / keyboard | Hard-load `#desktop`, `#work`, `#career`, `#projects`, `#projects/pokeleximon`, `#projects/safelog`, and `#contact`; use Back then Forward from Contact. | PASS. Each direct hash opened its matching application/page heading; Back returned to `#projects/safelog`, Forward restored `#contact` with `Contact Ben` as H1. |
| Reduced motion / Chromium | Emulate reduced motion, then open/use Career stage control. | PASS (automated browser parity check). The stage renders `data-reduced-motion="true"` with immediate stage update; no motion-dependent interaction path was found. |

## Acceptance evidence

- Header retains the decorative Kernel mark, semantic desktop H1, Ben Hutchinson, Manchester, and skip link; it has no primary-navigation landmark, no route links, and no header role/availability copy.
- `public/favicon.svg` parsing test confirms exact approved 64×64 Kernel geometry and Ink `#132218`, pale-green `#d9f7c5`, and signal-orange `#ff6542` palette.
- Dock applications retain labels and `data-dock-app-id`; CV is not an application button. GitHub, LinkedIn, and CV are a right-side icon-and-label group with their required contracts.
- `BUILD CLEAR PATHS` is absent; Work remains the desktop focal point.
- Shell geometry is positive and reduced at desktop, safe at narrow widths, and overflow-free at 320px.
- The titlebar lower Ink rule is continuous beneath all controls, including maximize; controls retain 44px targets and focus is visible.
- Direct hash, history, keyboard, mobile single-app, axe, and reduced-motion gates remain intact.

## Defects / retest

During the first full coverage run, eight stale assertions failed because they expected PORT-014-removed header navigation or the prior CV-first utility tab order:

- `tests/component/MenuBar.test.tsx`: 3 stale primary-navigation/role/availability expectations.
- `tests/component/PortfolioShell.test.tsx`: 3 stale primary-navigation/menu-link/keyboard-order expectations.
- `tests/component/Dock.test.tsx`: 1 stale utility tab order expectation.
- `tests/component/Desktop.test.tsx`: 1 stale exact-text expectation for role/availability now combined in the retained About content.

Tester updated only those expectations to preserve or strengthen coverage of absent primary nav, retained dock application navigation, grouped utility order, direct hash route state, header identity, and retained About content. Retest: PASS — 18 focused component tests and the full 154-test coverage suite pass. No production defect remains.

## Post-PO correction / retest

The Product Owner identified one remaining stale PORT-011 name in the 767px responsive assertion: it queried the removed top-menu Work link. `tests/e2e/responsive.spec.ts` now calls the retained dock control `[data-dock-app-id="work"]`, names the local measurement `dockWork`, and labels the test as a dock-target check. The unchanged acceptance remains a minimum 44×44 CSS-pixel target; no primary-navigation assertion was changed.

Retest command:

```bash
CI=1 PLAYWRIGHT_PORT=4232 npx playwright test tests/e2e/responsive.spec.ts tests/e2e/window-system.spec.ts tests/e2e/accessibility.spec.ts --project=Chromium
```

Result: **PASS — 10 passed, 1 skipped, 0 failed (2.8s).** The skip is the existing `mobile-Chrome` project guard in `window-system.spec.ts`, expected when the command is limited to the Chromium project.

---

# PORT-015 Tester GREEN report

Status: **PASS — ready for Product Owner acceptance.**

## Candidate and environment

- Candidate: `459caf6 fix: align micro terminal help copy`; Tester verification changes are recorded in the accompanying Tester commit.
- Branch: `terminal-redesign`; date: 2026-08-18.
- Node `v26.7.0`; Vitest `4.1.10`; Playwright `1.62.1`; Chromium project.
- Manual preview: `npm run preview -- --host 127.0.0.1 --port 4250 --strictPort`, at `http://127.0.0.1:4250/ben-portfolio/`. Automated browser checks used fresh ports 4251, 4254, and 4255.
- Browser validation used the connected Chrome browser for DOM, keyboard, interaction, console, and geometry checks. Responsive screenshots were captured separately with Playwright to `/private/tmp` only.
- Existing `.DS_Store` and `.playwright-cli/` worktree entries were not modified or staged.

## Automated verification

| Command | Result |
| --- | --- |
| `npm test -- tests/unit/portfolioReducer.test.ts tests/unit/content.test.ts tests/unit/foundation.test.tsx tests/unit/parseCommand.test.ts` | PASS — 4 files, 67 tests, 0 failed. |
| `npm test -- tests/component/Dock.test.tsx tests/component/Desktop.test.tsx tests/component/MicroTerminal.test.tsx tests/component/PortfolioShell.test.tsx tests/component/WindowLayer.test.tsx` | PASS — 5 files, 27 tests, 0 failed. |
| `CI=1 PLAYWRIGHT_PORT=4254 npx playwright test tests/e2e/contact-command.spec.ts tests/e2e/window-system.spec.ts tests/e2e/responsive.spec.ts --project=Chromium` | PASS — 13 passed, 1 expected `mobile-Chrome` project-guard skip, 0 failed. |
| `CI=1 PLAYWRIGHT_PORT=4255 npx playwright test tests/e2e/accessibility.spec.ts --project=Chromium` | PASS — 3 passed, 0 failed; axe reported no serious, critical, or contrast violations at desktop and 390×844. |
| `CI=1 PLAYWRIGHT_PORT=4251 npx playwright test tests/e2e/career.spec.ts --project=Chromium --grep "reduced motion\|200% zoom"` | PASS — 2 passed, 0 failed. |
| `npm run typecheck` | PASS — `tsc -b`, exit 0. |
| `npm run lint` | PASS — zero warnings/errors. |
| `npm run build` | PASS — static Vite build completed, exit 0. |
| `npm run check:bundle` | PASS — 97,477 gzip JS bytes / 204,800 budget; 118,529 initial image bytes / 1,048,576 budget. |
| `npm run test:coverage` | PASS — 22 files, 156 tests; statements 98.88%, branches 92.08%, functions 99.29%, lines 99.57%. All configured 91% thresholds are met. |

## Test-suite maintenance

The first full-coverage run exposed 11 stale expectations for the removed framed Command application. They were test debt, not a production defect: Dock (3: sixth Command application button, command activation, command keyboard stop); Desktop (1: command default window state); PortfolioShell (1: command frame/suggestion/history keyboard stops); WindowLayer (3: Command in source order, reset recovery, and default position); CommandApp (3: all framed-app/history expectations).

Tester replaced that obsolete component coverage with `MicroTerminal.test.tsx`, preserving or strengthening the surface contract: Desktop-only rendering, `data-micro-terminal` and `data-testid`, programmatic input label, submit control, no Command dock/window or explanatory/suggestion/history UI, latest-result replacement, `clear`, inert script-shaped input, parser action navigation, `reset`, and base-safe CV download. The affected-component retest passed 27/27; the subsequent full coverage run passed 156/156.

The one parser correction changes only blank input from a vague suggestion match to the approved exact result: `Type help for supported commands.` All allow-list, malicious-character, edit-distance, project, action, CV, clear, and reset coverage remains intact.

## Manual and security matrix

| Viewport / input | Route and checks | Result |
| --- | --- | --- |
| 1440×1000 / mouse + keyboard | `#desktop`; permanent terminal visible, `data-micro-terminal` present, accessible textbox and Run command control available, no Command dock button/window, terminal below focused application content and above dock. Terminal bounds 949×776.94, 448×109.09; dock begins at y=906.03; no horizontal overflow. | PASS. Screenshot: `/private/tmp/port015-green-1440-desktop.png`. |
| Desktop / keyboard only | Fresh-tab Tab order reaches `#portfolio-command` after Reset layout; keyboard-only `help` submission returns the bounded guide result. | PASS. |
| Desktop / command safety | `carear` yields `Did you mean “career”?`; `<script>alert(1)</script>` remains literal unknown-command text with no JavaScript dialog; `clear` removes the terminal status; `cv` provides `/ben-portfolio/cv/ben-hutchinson-cv.pdf` with `download="ben-hutchinson-cv.pdf"`; `reset` retains the terminal; `career` navigates to `#career` and unmounts it. | PASS. |
| Desktop / ordinary navigation and hash recovery | Visible Dock buttons independently opened Work, Career, Projects, and Contact. `#command` normalized to `#desktop`; the terminal textbox was visible and received focus. Browser console had zero warning/error entries; direct Desktop had no overflow. | PASS. |
| 390×844 / narrow Desktop | Terminal visible in normal Desktop flow, no horizontal overflow; absent on Career, Work, Projects, and Contact. | PASS. Screenshot: `/private/tmp/port015-green-390-playwright.png`. |
| 320×568 / narrow Desktop | Terminal visible in normal Desktop flow with no horizontal overflow. | PASS. Screenshot: `/private/tmp/port015-green-320-playwright.png`. |
| Reduced motion / 200% zoom | Chromium regression checks exercised reduced-motion Career behavior and 200%-zoom usability; responsive acceptance suite also checks no overflow at 320/390 and usable narrow targets. | PASS — 2 reduced-motion/zoom tests and 13 PORT-015 Chromium acceptance tests passed. |

## Defects and concerns

No production defect remains. The stale component assertions above were repaired and retested as Tester-owned coverage maintenance. The only intentional automated skip is the existing `mobile-Chrome` project guard when PORT-015 acceptance runs under the required Chromium-only project.

---

# PORT-016 Tester GREEN report

Status: **PASS — ready for Product Owner acceptance.**

## Candidate and environment

- Production candidate: `a2d8534` (`feat: refine Work and Career evidence`); production review is approved with no findings.
- Branch: `terminal-redesign`; date: 2026-08-18.
- Node `v26.7.0`; npm `11.19.0`; Vitest `4.1.10`; Playwright `1.62.1`; Chromium project.
- Manual production preview: `npm run preview -- --host 127.0.0.1 --port 4262 --strictPort`, served from `http://127.0.0.1:4262/ben-portfolio/` with HTTP 200.
- Screenshots: `/private/tmp/port016-green-1440x1000.png`, `/private/tmp/port016-green-1280x800.png`, `/private/tmp/port016-green-390x844.png`, and `/private/tmp/port016-green-200pct.png`.
- Existing `.DS_Store` and untracked `.playwright-cli/` entries were not modified or staged.

## Tester coverage maintenance

The exact-head production copy migration invalidated three specified assertions: the canonical-data exact-once literal in `tests/unit/content.test.ts`, the Desktop-visible Work-result assertion in `tests/unit/foundation.test.tsx`, and the Work-result count in `tests/e2e/window-system.spec.ts`. Each now uses exactly:

```text
Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes
```

Their original data-source, visibility, and count semantics are unchanged. Exact-head coverage then found the two corresponding legacy visibility/count checks in `tests/component/PortfolioShell.test.tsx`; Product Owner authorization was obtained before updating those same two literals. Component retest and full coverage passed afterwards. No assertions were weakened.

The earlier Tester RED scratch report had accidentally been tracked. This GREEN commit removes only `.superpowers/sdd/2026-08-13-portfolio-os-polish/task-3-tester-red.md` from Git tracking while preserving the local ignored file; no other SDD material is staged.

## Automated verification

| Command | Result |
| --- | --- |
| `npm test -- tests/unit/content.test.ts tests/unit/foundation.test.tsx` | PASS — 2 files, 19 tests, 0 failed (1.91s). |
| `CI=1 PLAYWRIGHT_PORT=4260 npx playwright test tests/e2e/work.spec.ts tests/e2e/career.spec.ts tests/e2e/accessibility.spec.ts --project=Chromium` | PASS — 11 passed, 4 intentional mobile-project skips, 0 failed (4.4s). |
| `CI=1 PLAYWRIGHT_PORT=4261 npx playwright test tests/e2e/window-system.spec.ts tests/e2e/responsive.spec.ts tests/e2e/contact-command.spec.ts --project=Chromium` | PASS — 13 passed, 1 intentional `mobile-Chrome` project-guard skip, 0 failed (2.8s). |
| `CI=1 PLAYWRIGHT_PORT=4263 npx playwright test tests/e2e/work.spec.ts tests/e2e/career.spec.ts tests/e2e/accessibility.spec.ts --project=Chromium` | PASS — post-build retest: 11 passed, 4 intentional mobile-project skips, 0 failed (4.2s). |
| `CI=1 PLAYWRIGHT_PORT=4264 npx playwright test tests/e2e/accessibility.spec.ts --project=Chromium` | PASS — 3 passed, 0 failed (2.2s); axe reports no serious, critical, or contrast violation. |
| `npm run test:coverage` | PASS — 22 files, 158 tests; statements 98.88%, branches 92.04%, functions 99.28%, lines 99.57%. Every configured 91% threshold is met. |
| `npm run typecheck` | PASS — `tsc -b`, exit 0. |
| `npm run lint` | PASS — zero warnings/errors, exit 0. |
| `npm run build` | PASS — static Vite build, exit 0. |
| `npm run check:bundle` | PASS — 97,418 gzip JS bytes / 204,800; 118,529 initial image bytes / 1,048,576. |

## Manual Career matrix

Manual measurement waits for the selected direct-stage button's `aria-pressed="true"` state, then scrolls the whole active stage into view before reading the existing native range's parent control rail. This avoids changing the outer page scroll while measuring the fixed rail.

| Scenario | Stage rail y values (graduate, observability, associate, SKAO) | Delta | Readability, internal scrolling, overflow, motion | Result |
| --- | --- | --- | --- | --- |
| 1440×1000 | 694.141, 694.141, 694.141, 694.141 | 0px | Every heading readable; no page overflow. Internal viewport is 356px high; Associate/SKAO need up to 10px/21px internal scroll. Offset `0`, normal duration `200ms`. | PASS |
| 1280×800 | 586.547, 586.547, 586.547, 586.547 | 0px | Every heading readable; no page overflow; all stage content fits the 357px internal viewport. Offset `0`, normal duration `200ms`. | PASS |
| 390×844 | 581.953, 581.594, 581.594, 581.594 | 0.359px | Every heading readable; no page overflow. The 562px internal viewport scrolls by 82px, 51px, 37px, and 150px respectively. Offset `0`, normal duration `200ms`. | PASS |
| 200% zoom (1440×1000) | 627.969, 627.969, 627.969, 627.969 | 0px | Every heading readable; no page overflow. The 294px internal viewport scrolls by 210.5px, 186.5px, 199px, and 282px. Offset `0`, normal duration `200ms`. | PASS |

All rail deltas are within the one-CSS-pixel acceptance limit. Reduced-motion verification returns `data-reduced-motion="true"`, `data-motion-offset-px="0"`, and `data-motion-duration-ms="0"`; normal-stage metadata is zero offset with a 200ms duration. No vertical stage motion was observed.

Keyboard-only verification: the native labelled Career range moved from `0` to `1` with ArrowRight (next) and back to `0` with ArrowLeft (previous); direct `Now` selection reported `aria-pressed="true"`. The preserved interface has no separate previous/next buttons, so these native range keys are its prior/next operation. Direct `#career`, dock Career navigation, Back to `#desktop`, and Forward to `#career` all passed.

## PORT-014/PORT-015 regression confirmation

- Shared Chromium regression suite passed 13/13 with one intentional mobile-project guard skip.
- Desktop has a visible MicroTerminal; Career has none. No Command dock control or framed Command window is present.
- Focused accessibility checks retain named landmarks, labelled Career range/direct controls, keyboard focus, invalid-hash recovery, and axe compliance.

## Defects and retest

No open product defect.

During manual checking, an initial 390×844 script independently scrolled each stage headline before reading rail geometry and produced a spurious 30.641px delta. Investigation showed this altered outer page scroll rather than the rail's layout. Reproduction with the acceptance test's whole-stage scrolling method measured a 0.359px delta, and the fresh post-build focused Chromium suite passed. This was a Tester measurement-procedure issue, not a production defect; no production change was made.

---

# PORT-017 exact-head Tester checkpoint

Status: **BLOCKED — non-browser gates pass; browser, visual, and manual release gates remain pending.**

## Candidate, scope, and root-cause correction

- Production candidate: `ed67e899d6459a7570ffddc68053ef9ac34b4b3d` (`fix: correct Pokeleximon project presentation`), reviewed approved with no findings.
- Tester checkpoint source: `ed67e89` plus the uncommitted Tester-only `tests/e2e/projects.spec.ts` coordinate-space correction recorded below.
- Branch: `terminal-redesign`; date: 2026-08-18.
- Node `v26.7.0`; npm `11.19.0`; Vitest `4.1.10`; Playwright `1.62.1`.
- Protected worktree artifacts `.DS_Store` and `.playwright-cli/` were not modified or staged. No production, configuration, Product Owner packet, visual baseline, or snapshot file was changed.

The first production GREEN focused run exposed a Tester measurement defect only at CSS 200% zoom: `HTMLElement.clientHeight` is in unscaled layout CSS pixels, while `getBoundingClientRect().height` is zoom-scaled. The media-height assertion compared those two coordinate spaces. It now compares the existing `mediaContentHeight` to `imageContentHeight`, both from `clientHeight`, retaining the exact 2-CSS-pixel tolerance. The independently required `getBoundingClientRect()` checks for zero copy/media overlap, featured-row containment, positive rendered image dimensions, and the 2% intrinsic aspect-ratio tolerance are unchanged, as is no-horizontal-overflow coverage. The five required scenarios remain 1440×1000, 1024×768, 390×844, 320×568, and 390×844 at CSS 200% zoom.

## Clean exact-head non-browser matrix

| Command | Result |
| --- | --- |
| `npm ci` | PASS — exit 0 from the lockfile-consistent clean install. npm reported only existing dependency deprecation and optional install-script notices. |
| `npm run typecheck` | PASS — `tsc -b`, exit 0. |
| `npm run lint` | PASS — zero warnings/errors, exit 0. |
| `npm run test:coverage` | PASS — 22 files, 159 tests; statements 98.88%, branches 92.04%, functions 99.28%, lines 99.57%. All configured 91% thresholds remain met. |
| `npm run build` | PASS — static Vite build, exit 0. |
| `npm run check:bundle` | PASS — 97,401 gzip JavaScript bytes / 204,800; initial images 118,529 bytes / 1,048,576. Pokeleximon image: 32,772 bytes; Safelog image: 85,390 bytes; favicon: 367 bytes. |
| `git diff --check` | PASS — exit 0, no whitespace errors. |

## Pending browser and release evidence

No current browser result is claimed. The execution environment denied both the fresh-localhost bind escalation and separate in-app Browser access to a localhost preview. Therefore the following required commands were **not run** at this checkpoint:

- `CI=1 PLAYWRIGHT_PORT=4224 npx playwright test tests/e2e/projects.spec.ts tests/e2e/responsive.spec.ts --project=Chromium`
- `CI=1 PLAYWRIGHT_PORT=4225 npm run test:e2e`
- `CI=1 PLAYWRIGHT_PORT=4226 npm run test:e2e:a11y`
- `CI=1 PLAYWRIGHT_PORT=4227 npm run test:e2e:visual`

No visual baseline was updated. The four approved baseline files retain their generic established names, and none was inspected or modified at this exact head. Consequently the required Chromium pass/skip/fail counts, axe outcome, direct-hash/history/link/media geometry results, keyboard-only and reduced-motion evidence, `/ben-portfolio/` preview smoke test, five-viewport/zoom measurements, and manual inspection of Kernel mark/header/frame/MicroTerminal/Career/Pokeleximon/focus/clipping/blank regions are all pending a browser-capable verification environment.

## Defects and disposition

| Item | Severity | Reproduction | Disposition |
| --- | --- | --- | --- |
| PORT-017 200%-zoom media-height assertion mixed unscaled `clientHeight` with scaled `getBoundingClientRect().height`. | Tester measurement defect | CSS zoom = 200% in the featured Pokeleximon geometry scenario. | Corrected in Tester acceptance code; browser retest pending. |
| Browser/visual/manual release execution unavailable. | Release blocker | Fresh local-preview bind and in-app browser localhost access are denied by the environment. | Open; do not accept PORT-017 or the combined PORT-014–017 release until the pending browser matrix is run and recorded at one exact head. |

---

# PORT-017 exact-head Tester FAIL checkpoint

Status: **FAIL — Developer handoff required before release verification can continue.**

Candidate: `182192e0433b04d1450a2b1e34ad201cd1b2ab67` (`test: checkpoint PORT-017 release verification`) on `terminal-redesign`, based on production `ed67e89` (`fix: correct Pokeleximon project presentation`). Date: 2026-08-20. Node `v26.7.0`; npm `11.19.0`; Playwright `1.62.1`.

## Completed gates

| Command | Result |
| --- | --- |
| `npm ci` | PASS — exit 0, lockfile-consistent clean install. Existing dependency deprecation/optional install-script notices only. |
| `npm run typecheck` | PASS — `tsc -b`, exit 0. |
| `npm run lint` | PASS — zero warnings/errors, exit 0. |
| `npm run test:coverage` | PASS — 22 files, 159 tests; statements 98.88%, branches 92.04%, functions 99.28%, lines 99.57%. Configured 91% thresholds remain met. |
| `npm run build` | PASS — static Vite build, exit 0. |
| `npm run check:bundle` | PASS — 97,401 gzip JavaScript bytes / 204,800; 118,529 initial image bytes / 1,048,576. |
| `CI=1 PLAYWRIGHT_PORT=4344 npx playwright test tests/e2e/projects.spec.ts tests/e2e/responsive.spec.ts --project=Chromium` | PASS — 8 passed, 1 established project-guard skip, 0 failed (4.2s). The Pokeleximon geometry test covers 1440×1000, 1024×768, 390×844, 320×568, and 200% zoom. |
| `CI=1 PLAYWRIGHT_PORT=4345 npm run test:e2e` | FAIL — 41 passed, 156 skipped, 8 failed (26.6s). The blocking product failure is detailed below. |
| `git diff --check` | PASS — no whitespace errors before this report append. |

## Blocking product defect

| Severity | Reproduction | Expected | Actual | Affected criterion | Owner | Retest/disposition |
| --- | --- | --- | --- | --- | --- | --- |
| Serious accessibility defect | In mobile Chromium at 390×844, load `http://127.0.0.1:4350/ben-portfolio/#career`, inject axe 4.13, then run `axe.run()`. The required full suite independently reproduces it in `tests/e2e/career.spec.ts` (`Career.app mobile > has no serious or critical accessibility violation at the Career route`). | The scrollable Career stage region is keyboard reachable. Axe serious/critical violations equal zero. | Axe returns one serious `scrollable-region-focusable` violation. Target `._stageViewport_1dyup_62` is `<div class="_stageViewport_1dyup_62">`; axe reports it has neither focusable content nor focusability. | PORT-017 keyboard reachability and preserved PORT-016 mobile Career accessibility/regression contract. | Developer | Open. Do not continue release acceptance, update visual baselines, or claim browser GREEN until the region is keyboard reachable and the exact full matrix is rerun. |

## Non-blocking observed test debt and visual drift

The same full run also found Tester-owned expectations that predate accepted PORT-014–016 behavior; they are not a reason to change production while the accessibility defect is open:

- `tests/e2e/recruiter-scan.spec.ts` still expects removed header role text (`Mid-level platform engineer`) and the pre-PORT-016 Work sentence with a trailing period.
- `tests/e2e/window-system.spec.ts` still expects MicroTerminal to remain visible after switching a narrow viewport to Work, contrary to the accepted Desktop-only Micro terminal contract.
- The four approved visual baselines differ: desktop 1440×1000 (0.26 pixel ratio), desktop 390×844 (0.26), Career 1440×1000 (0.31), Career 390×844 (0.26). Whether each difference is solely approved styling has not been manually assessed; no snapshot was updated because behavioral release gates are not green.

## Pending gates

The dedicated accessibility command at port 4346, no-update visual command at 4347, any baseline update/retest at 4348/4349, and all manual keyboard/reduced-motion/direct-hash/history/static-base-path/visual inspection evidence are pending the Developer correction. Protected `.DS_Store` and untracked `.playwright-cli/` remain untouched and unstaged.

---

# PORT-017 exact-head Tester GREEN report

Status: **PASS — ready for Product Owner acceptance.**

## Candidate, scope, and retest

- Production candidate: `533235c2bc34523bf125d2193321ccda26ad5c96` (`fix: make Career stage viewport keyboard reachable`), after scoped review approval of the Career focus repair.
- Branch: `terminal-redesign`; date: 2026-08-20; Node `v26.7.0`; npm `11.19.0`; Vitest `4.1.10`; Playwright `1.62.1`; Chromium.
- Clean production preview: `npm run preview -- --host 127.0.0.1 --port 4380 --strictPort`, served from `http://127.0.0.1:4380/ben-portfolio/` (HTTP 200).
- The former mobile Career axe defect was first retested on a fresh port with `npm run build && CI=1 PLAYWRIGHT_PORT=4373 npx playwright test tests/e2e/career.spec.ts --project=mobile-Chrome --grep "has no serious or critical accessibility violation"`: **1 passed, 0 failed (1.7s)**. The focusable stage viewport repair resolves axe's former serious `scrollable-region-focusable` finding.
- `.DS_Store` and `.playwright-cli/` were neither modified nor staged. Evidence screenshots are outside the repository in `/private/tmp`.

## Exact-head automated matrix

| Command | Result |
| --- | --- |
| `npm ci` | PASS — lockfile-consistent clean dependency install. |
| `npm run typecheck` | PASS — `tsc -b`, 0 errors. |
| `npm run lint` | PASS — 0 warnings/errors. |
| `npm run test:coverage` | PASS — 22 files, 159 tests; statements 98.88% (530/536), branches 92.04% (382/415), functions 99.28% (139/140), lines 99.57% (469/471). Every 91% threshold is met. |
| `npm run build` | PASS — static Vite build. |
| `npm run check:bundle` | PASS — 97,403 gzip JavaScript bytes / 204,800; initial images 118,529 bytes / 1,048,576; Pokeleximon 32,772 bytes, Safelog 85,390 bytes, favicon 367 bytes. |
| `git diff --check` | PASS — no whitespace errors. |
| `CI=1 PLAYWRIGHT_PORT=4374 npx playwright test tests/e2e/projects.spec.ts tests/e2e/responsive.spec.ts --project=Chromium` | PASS — 8 passed, 1 intentional project-guard skip, 0 failed (3.0s). |
| `CI=1 PLAYWRIGHT_PORT=4375 npm run test:e2e` | Initial result: 45 passed, 156 skipped, 4 failed — only the four approved visual baselines differed. Post-baseline final exact-head rerun on port 4381: **49 passed, 156 skipped, 0 failed (16.5s)**. |
| `CI=1 PLAYWRIGHT_PORT=4376 npm run test:e2e:a11y` | PASS — 2 passed, 8 intentional project-guard skips, 0 failed (3.9s). |
| `CI=1 PLAYWRIGHT_PORT=4377 npm run test:e2e:visual` | Initial result: 4 visual failures, 16 intentional skips only; desktop 1440×1000 ratio 0.26, desktop 390×844 ratio 0.26, Career 1440×1000 ratio 0.31, Career 390×844 ratio 0.26. Behavioural and axe gates were already green. |
| `CI=1 PLAYWRIGHT_PORT=4378 npm run test:e2e:visual -- --update-snapshots` | PASS — 4 passed, 16 skipped. |
| `CI=1 PLAYWRIGHT_PORT=4379 npm run test:e2e:visual` | PASS — 4 passed, 16 skipped, 0 failed (3.8s). |

## Tester test maintenance and visual baselines

Two stale E2E expectations conflicted with accepted PORT-014–016 behaviour and were corrected without weakening their behavioural intent:

- `tests/e2e/recruiter-scan.spec.ts` now asserts the accepted canonical Work claim, the existing combined About role/location and availability/supporting-copy text, and Back-history recovery after opening Work rather than the PORT-014-removed header Desktop link.
- `tests/e2e/window-system.spec.ts` retains desktop Reset-layout visibility of MicroTerminal and now asserts its approved absence after narrow mobile navigation to Work.

Only these approved generic visual baselines were regenerated after the initial drift was confirmed to be approved PORT-014–017 styling: `desktop-1440x1000.png`, `desktop-390x844.png`, `career-1440x1000.png`, and `career-390x844.png` in `tests/e2e/visual.spec.ts-snapshots/`. Manual inspection found the Kernel/header/frame/MicroTerminal/dock and Career composition present with expected styling; no unexpected clipping or blank region was observed in any final PNG.

## Manual evidence

| Scenario | Result |
| --- | --- |
| `#projects` at 1440×1000 | PASS — Pokeleximon copy bounds `[303.398, 578.953, 747.992, 1157.594]`; media `[747.992, 578.953, 1291.398, 830.477]`; featured-row bounds `[300.398, 575.953, 1294.398, 1160.594]`; overlap 0; media/image client-height delta 0px; rendered ratio 2.18293 versus intrinsic 2.18878 (0.27%); scroll width = inner width = 1440. |
| Pokeleximon detail/security | PASS — exactly one `Overview` link, exact href `https://github.com/ben-hutchinson/pokeleximon`, `target="_blank"`, `rel="noreferrer noopener"`; no Live link and no duplicate destination. |
| 1440×1000, 1024×768, 390×844, 320×568, and CSS 200% zoom | PASS — each geometry capture reports 0 overlap, 0px client-height delta, copy/media containment, correct DOM order, and no horizontal overflow. Rendered-to-intrinsic aspect deviation: 0.00483%, 0.00684%, 0.00780%, 0.01371%, and 0.01553% respectively, all below 2%. Screenshots: `/private/tmp/port017-manual-desktop.png`, `/private/tmp/port017-manual-tablet.png`, `/private/tmp/port017-manual-mobile.png`, `/private/tmp/port017-manual-narrow-mobile.png`, `/private/tmp/port017-manual-200-percent-zoom.png`. |
| Keyboard, direct hashes, and history | PASS — keyboard Enter on Work opens `#work`; opening Work from `#desktop` then Back restores `#desktop`; static-base routes were exercised from `/ben-portfolio/`; mobile Desktop retains MicroTerminal while Work omits it. |
| Career reduced motion and keyboard | PASS — exact Chromium coverage confirms reduced-motion attributes `data-reduced-motion="true"`, offset `0`, duration `0`; native labelled Career range accepts ArrowRight/ArrowLeft, direct stage selection updates `aria-pressed`, and the formerly inaccessible mobile stage viewport has zero serious/critical axe findings. |

## Defects, disposition, and remaining risk

The former serious mobile Career `scrollable-region-focusable` defect is fixed by `533235c` and reproduced green before the matrix. No product defect remains under the approved 320px minimum support contract.

The PORT-017 geometry test's former CSS-zoom coordinate-space defect remains corrected: media and image height compare `clientHeight` to `clientHeight` (unscaled layout CSS pixels) within 2px; bounding-client-rect overlap, containment, rendered-ratio, and overflow assertions remain independent.

One compatibility caveat remains: CSS-scale 200% zoom meets the defined acceptance checks, but an approximately 195px effective viewport (the equivalent of browser 200% zoom from 390px) is below the supported 320px floor and visually clips. This is recorded as a scope risk, not a release defect; Product Owner clarification is needed before treating sub-320 effective-width zoom as supported.

---

# PORT-017 PO change-request RED checkpoint

Status: **RED — Developer correction required; do not accept PORT-017 at `e88fd4b`.**

## Bounded rendered-order acceptance

Product Owner identified that the feature media is visually ordered ahead of the copy at widths at or below 700px despite the required copy-first narrow stack. Tester added the smallest rendered-order check to `tests/e2e/projects.spec.ts`: for the existing narrow scenarios only, Pokeleximon copy `getBoundingClientRect().bottom` must be less than or equal to the media `getBoundingClientRect().top`. Existing DOM-adjacency, overlap, containment, client-height, intrinsic-ratio, image-completion, and no-overflow assertions are unchanged. `expect.soft` deliberately records every failing scenario in this one required geometry journey rather than stopping at the first, while still failing the test.

## Fresh-port RED evidence

| Command | Result |
| --- | --- |
| `CI=1 PLAYWRIGHT_PORT=4382 npx playwright test tests/e2e/projects.spec.ts tests/e2e/responsive.spec.ts --project=Chromium` | RED — 7 passed, 1 intentional project-guard skip, 1 failed (2.4s). The first hard assertion reproduced the mobile order failure. |
| `CI=1 PLAYWRIGHT_PORT=4383 npx playwright test tests/e2e/projects.spec.ts tests/e2e/responsive.spec.ts --project=Chromium` | RED — 7 passed, 1 intentional project-guard skip, 1 failed (2.5s). The final soft assertion reports all three affected narrow scenarios below. |

| Scenario | Required relationship | Actual bounds | Result |
| --- | --- | --- | --- |
| mobile, 390×844 | copy bottom ≤ media top | 1177.28125 ≤ 433.890625 | FAIL — media visibly precedes copy. |
| narrow-mobile, 320×568 | copy bottom ≤ media top | 1318.671875 ≤ 433.890625 | FAIL — media visibly precedes copy. |
| CSS 200%, 390×844 | copy bottom ≤ media top | 3659.265625 ≤ 865.953125 | FAIL — media visibly precedes copy. |

Desktop 1440×1000 and tablet 1024×768 do not enter the narrow assertion and retain their accepted side-by-side geometry. Across the failing run, the preserved featured-row checks still complete: image completion/natural dimensions, no copy-media intersection, row containment, media/image client-height tolerance, intrinsic aspect tolerance, document order, and no horizontal overflow. No production files or visual baselines were changed; `.DS_Store` and `.playwright-cli/` remain untouched and unstaged.

## Developer handoff

Correct the <=700px featured-project visual ordering in `src/apps/projects/ProjectsApp.module.css` so copy is rendered above media, then rerun the focused command and the full release matrix before a new GREEN claim. This is a bounded production layout defect, not a snapshot-only change.

---

# PORT-017 exact-head Tester GREEN report — copy-first retest

Status: **PASS — ready for Product Owner acceptance.**

## Candidate, environment, and defect disposition

- Production candidate: `2c99bd60406b74eebc32f98cd2f4ac58e1acf991` (`fix: keep featured project copy first`), scoped-review approved. This retests the bounded order defect recorded in Tester change-request commit `2fa2c5b`.
- Branch: `terminal-redesign`; date: 2026-08-20; Node `v26.7.0`; npm `11.19.0`; Vitest `4.1.10`; Playwright `1.62.1`; Chromium.
- Clean preview: `npm run preview -- --host 127.0.0.1 --port 4400 --strictPort`, serving `http://127.0.0.1:4400/ben-portfolio/` with HTTP 200. Manual browser inspection used that exact static `/ben-portfolio/` base path.
- Defect retest: the <=700px CSS order correction makes featured Pokeleximon copy render before media at 390×844, 320×568, and CSS 200%. The former values where copy was below the media are no longer reproducible. No production, configuration, or baseline change was made by Tester.

## Clean exact-head release matrix

| Command | Result |
| --- | --- |
| `npm ci` | PASS — clean lockfile-consistent install; 301 packages audited, 0 vulnerabilities. Existing deprecation and optional install-script notices only. |
| `npm run typecheck` | PASS — `tsc -b`, 0 errors. |
| `npm run lint` | PASS — 0 warnings/errors. |
| `npm run test:coverage` | PASS — 22 files, 159 tests; statements 98.88% (530/536), branches 92.04% (382/415), functions 99.28% (139/140), lines 99.57% (469/471). Each configured 91% threshold is met. |
| `npm run build` | PASS — static Vite build. |
| `npm run check:bundle` | PASS — 97,403 gzip JavaScript bytes / 204,800; initial images 118,529 bytes / 1,048,576; Pokeleximon 32,772, Safelog 85,390, favicon 367 bytes. |
| `CI=1 PLAYWRIGHT_PORT=4394 npx playwright test tests/e2e/projects.spec.ts tests/e2e/responsive.spec.ts --project=Chromium` | PASS — 8 passed, 1 intentional project-guard skip, 0 failed (2.5s). |
| `CI=1 PLAYWRIGHT_PORT=4395 npm run test:e2e` | PASS — 49 passed, 156 intentional project-guard skips, 0 failed (17.9s). |
| `CI=1 PLAYWRIGHT_PORT=4396 npm run test:e2e:a11y` | PASS — 2 passed, 8 intentional project-guard skips, 0 failed (3.3s). No serious or critical axe violation. |
| `CI=1 PLAYWRIGHT_PORT=4397 npm run test:e2e:visual` | PASS — 4 passed, 16 intentional skips, 0 failed (3.6s). No-update visual baseline gate is green; no baseline was regenerated. |
| `git diff --check` | PASS — no whitespace errors. |

## Featured Pokeleximon rendered-layout evidence

Every measurement waits for image completion and positive natural dimensions. All scenarios have zero copy/media intersection, row containment for both boxes, media/image `clientHeight` delta 0px, positive image height, and no horizontal overflow. Desktop/tablet retain their accepted copy-left/media-right composition; the narrow scenarios now use the required rendered copy-above-media stack.

| Scenario | Rendered order / boundary | Overlap | Height delta | Intrinsic ratio delta | Overflow |
| --- | --- | ---: | ---: | ---: | --- |
| 1440×1000 | desktop side-by-side, copy left of media | 0 | 0px | 0.00165% | none |
| 1024×768 | tablet side-by-side, copy left of media | 0 | 0px | 0.00178% | none |
| 390×844 | copy bottom = media top = 1042.3515625px | 0 | 0px | 0.00218% | none |
| 320×568 | copy bottom = media top = 1215.7421875px | 0 | 0px | 0.00620% | none |
| CSS 200%, 390×844 | copy bottom = media top = 3571.421875px | 0 | 0px | 0.01553% | none |

Focused acceptance supplies the DOM-adjacency check; the manual rendered-order measurements above prove the required visual narrow stack rather than relying on DOM order alone. Screenshots: `/private/tmp/portfolio-os-port-017-desktop.png`, `/private/tmp/portfolio-os-port-017-tablet.png`, `/private/tmp/portfolio-os-port-017-mobile.png`, `/private/tmp/portfolio-os-port-017-narrow-mobile.png`, `/private/tmp/portfolio-os-port-017-200-percent-zoom.png`, and `/private/tmp/port017-round2-css-200.png`.

## Manual interaction, security, and regression evidence

- Keyboard and history: pressing Enter on the Work dock control at `#desktop` opened `#work`; browser Back restored `#desktop`. The reduced-motion Career range accepted ArrowLeft from `Now` value `3` to `2025` value `2`, with visible focus.
- Reduced motion: `data-reduced-motion="true"`, `data-motion-offset-px="0"`, and `data-motion-duration-ms="0"`; no horizontal overflow. Evidence: `/private/tmp/port017-round2-career-reduced.png`.
- Direct static hashes all resolved with their matching H1: `#desktop` Ben Hutchinson, `#work` Python Dependency Migration, `#career` Career, `#projects` Engineering projects, `#projects/pokeleximon` Pokeleximon Daily, `#projects/safelog` Safelog, and `#contact` Contact Ben.
- Pokeleximon detail exposes exactly one link: Overview to `https://github.com/ben-hutchinson/pokeleximon`, `target="_blank"`, `rel="noreferrer noopener"`; Live count is 0 and no duplicate destination exists.
- PORT-014/015 regression: at 390×844, Desktop has one MicroTerminal and Work has none; both have no horizontal overflow. PORT-016 Career reduced-motion/range interaction and axe retest are green. Browser console had no warnings/errors.

## Visual inspection and remaining risk

All four final generic baselines were manually inspected without alteration:

- `desktop-1440x1000.png`: Kernel mark, simplified header, window frame, Work/About, MicroTerminal, dock, and utility group are present; no blank or clipped region.
- `desktop-390x844.png`: compact header, About, MicroTerminal, and dock are legible with no unexpected blank region.
- `career-1440x1000.png`: full Career stage, rail/direct controls, frame, and focusable stage composition are stable.
- `career-390x844.png`: compact Career stage/evidence/controls render without unexpected blank region or clipping.

CSS-scale 200% remains green against the specified geometry/overflow contract. As already recorded in the prior exact-head report, a real effective 195px viewport from browser zooming a 390px layout is below the supported 320px floor; its magnified visual framing remains a compatibility-scope caveat, not an open PORT-017 defect.

Protected `.DS_Store` and `.playwright-cli/` were not modified or staged. No open product defect remains at this exact production head.

---

# Final-review accessibility RED checkpoint

Status: **RED — two bounded production accessibility fixes required.**

## Candidate and scope

- Reviewed head: `415c440e09e454f6853a4df195fd2bac9ce76cff` (`docs: accept Portfolio OS polish release`).
- Tester changed only the requested acceptance assertions in `tests/e2e/window-system.spec.ts` and `tests/component/CareerApp.test.tsx`; no production code, baseline, configuration, `.DS_Store`, or `.playwright-cli/` entry was touched.

## Expected focused RED evidence

| Command | Result | Intended failure |
| --- | --- | --- |
| `npm test -- tests/component/CareerApp.test.tsx` | RED — 1 file failed; 5 passed, 1 failed (6 total). | The `tabindex="0"` Career stage viewport has no `role="region"`; it cannot yet be named from the stable `Career timeline` heading via `aria-labelledby="career-timeline-heading"`. |
| `CI=1 PLAYWRIGHT_PORT=4401 npx playwright test tests/e2e/window-system.spec.ts --project=Chromium` | RED — 3 passed, 1 intentional project-guard skip, 1 failed. | At `#command`, URL normalization reaches `#desktop` and the Portfolio command textbox is visible, but Playwright reports it as inactive rather than focused after the 5s focused-state wait. |

## Required correction and retest

1. On obsolete `#command` hash recovery, autofocus the existing labelled Portfolio command input once the route normalizes to `#desktop`; do not restore the removed Command application or alter ordinary focus behavior.
2. Make the existing focusable Career stage scroll viewport a semantic `region` named through `aria-labelledby="career-timeline-heading"`, with that ID on the stable Career timeline heading. This prevents the repaired scroll viewport from remaining an anonymous tab stop.

All pre-existing assertions remain intact; the manual `input.focus()` call that masked the command-recovery contract was removed. The component test retains `tabindex="0"` in addition to the new semantic expectations. Rerun these focused tests and the applicable release matrix after production correction.
