# PORT-018 Tester verification report

Status: **PASS — ready for Product Owner acceptance.**

## Candidate and environment

- Production candidate: `e2fb5943d5ee305d7807c2bb0abf5b99207c73a4` (`fix: preserve complete work state and help`), based on `6e76bea`.
- Branch: `terminal-redesign`; date: 2026-08-21.
- Toolchain: Node `v24.19.0` from `/opt/homebrew/opt/node@24/bin`; Vitest `4.1.10`; Playwright `1.62.1`.
- Manual static preview: Node 24 `npm run preview -- --host 127.0.0.1 --port 4237 --strictPort`, served at `http://127.0.0.1:4237/ben-portfolio/`.
- Manual browser: connected Chrome, with viewport checks at 1440×1000, 1024×768, 390×844, and 320×568.
- Protected artifacts remained untouched: pre-existing `M .DS_Store` and `?? .playwright-cli/` only.

## RED evidence retained from the Tester checkpoint

At the original RED baseline `c9f4af7`, the focused unit/component command intentionally failed **12 tests with 96 passing** because the singleton Work source lacked the typed collection/derived IDs, direct detail hash, Work-detail state/action, command selection, and catalogue/direct-detail controls.

The focused Chromium command intentionally reported **2 failures with 5 passing**: direct `#work/uv-ruff-migration` recovered to Desktop, and axe found the existing Work reading surface's serious `scrollable-region-focusable` issue. The resulting implementation supplies the named catalogue action and direct detail rather than suppressing that check.

The first independent review found two additional gaps. Tester RED coverage at `a1dd515` correctly required an enumerable initial `activeWorkId: null` and data-derived `work <id>` help. The production fix at `e2fb594` made both pass.

## Automated verification

| Command | Result |
| --- | --- |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run typecheck` | PASS — exit 0. |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run lint` | PASS — zero warnings/errors. |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm test -- tests/unit/content.test.ts tests/unit/hashState.test.ts tests/unit/portfolioReducer.test.ts tests/unit/parseCommand.test.ts tests/component/WorkApp.test.tsx tests/component/Desktop.test.tsx tests/component/WindowLayer.test.tsx` | PASS — 7 files, 108 tests, 0 failed. |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run test:coverage` | PASS — 22 files, 174 tests, 0 failed. Statements **98.46%**, branches **91.22%**, functions **99.34%**, lines **99.61%**; all configured 91% thresholds met. |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run build` | PASS — static Vite build, 99,430 gzip JS bytes. |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run check:bundle` | PASS — 98,175 gzip JS bytes / 204,800 budget; 118,529 initial image bytes / 1,048,576 budget. |
| `CI=1 PATH=/opt/homebrew/opt/node@24/bin:$PATH PLAYWRIGHT_PORT=4235 npm run test:e2e` | PASS — 52 passed, 168 intentional project-guard skips, 0 failed. |
| `CI=1 PATH=/opt/homebrew/opt/node@24/bin:$PATH PLAYWRIGHT_PORT=4236 npm run test:e2e:a11y` | PASS — 3 passed, 12 intentional project-guard skips, 0 failed. This includes desktop/mobile Work catalogue and detail axe checks. |
| `git diff --check` | PASS — no whitespace errors. |

## Manual matrix

| Viewport / input | Route and checks | Result |
| --- | --- | --- |
| 1440×1000 / mouse + keyboard | Static `#work` catalogue: visible `01 / FEATURED CASE STUDY`, exact context/title/result, named open action, no horizontal overflow, no console warnings/errors. Keyboard Enter selected the direct Work route; detail showed the data-backed Outcome and keyboard Back returned to the catalogue. | PASS. |
| 1440×1000 / direct detail | `#work/uv-ruff-migration`: readable full-size Work detail, visible Back control, exact approved first-person ownership/approach/result, no technology list, no horizontal overflow, no console warnings/errors. | PASS. |
| 1024×768 / direct/reload | Direct detail route reloaded at the exact Work hash; Outcome remained visible and the document had no horizontal overflow. Direct `#projects/safelog` retained its Safelog H1. Unknown `#work/unknown` recovered to `#desktop` with About visible. | PASS. |
| 390×844 / click + mobile model | Catalogue open action and detail Back were visible; Public detail was readable; both routes had no horizontal overflow and exactly one visible Work window. Switching through the dock to Career resulted in exactly one visible Career window. | PASS. |
| 320×568 / direct detail | Direct Work detail rendered the Back control with no horizontal overflow and exactly one visible Work window; dock switch to Career kept the one-active-app model. | PASS. |
| History / keyboard focus | Back from catalogue returned to detail; Forward restored catalogue. Tab traversal exposed solid 3px outlines on Close Work, Minimize Work, Maximize Work, and `Open Python Dependency Migration case study`; keyboard activation worked for catalogue open and Back. | PASS. |
| Desktop-only terminal sentinel | Micro terminal was visible on `#desktop` and absent on `#career`; Work routing did not reintroduce a Command window. | PASS. |
| Reduced motion / static-hosting | Work has no motion-dependent interaction; the full browser suite includes the existing reduced-motion Career regression. The static preview served all checked hashes under `/ben-portfolio/` without asset/runtime errors. | PASS. |

## Tester coverage maintenance

The first full-coverage run found one test-harness failure, not a production defect: `tests/unit/foundation.test.tsx` rendered the newly interactive `WorkApp` without the required `PortfolioProvider`. The Work catalogue must dispatch its real reducer action, so the isolated test now provides the production context while retaining every original no-technology assertion. Focused retest: **1 file, 9 tests, 0 failed**. The subsequent full coverage result above is green.

## Defects and retest

No open production defect remains. No assertion was weakened, no production file was modified by the Tester, and no protected artifact was staged.
