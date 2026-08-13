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
