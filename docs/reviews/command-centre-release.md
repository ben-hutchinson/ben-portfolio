# Command Centre release evidence

Release status: **branch release candidate verified locally; live Pages redesign check pending post-merge deployment**

## Target

- Branch: `codex/command-centre-redesign`
- Validated branch SHA: `38a9bde6975dd5e14a1b90d5c201143bbd0b0463` (clean-install and local-preview release candidate)
- Repository: <https://github.com/ben-hutchinson/ben-portfolio>
- Draft PR: pending creation after push
- GitHub Pages production URL: <https://ben-hutchinson.github.io/ben-portfolio/>
- Production-equivalent branch preview: <http://127.0.0.1:4173/ben-portfolio/>

## Evidence locations

- Desktop baseline, 1440×1000: `tests/e2e/visual.spec.ts-snapshots/command-centre-1440x1000.png`
- Mobile baseline, 390×844: `tests/e2e/visual.spec.ts-snapshots/command-centre-390x844.png`

## Verification matrix

| Gate | Command or environment | Result |
| --- | --- | --- |
| Clean worktree before install | `git status --short` | Pass; no output before `npm ci` |
| Deterministic install | `npm ci` | Pass; 584 packages installed and 585 audited |
| Lint, types, unit tests, build | `npm run check` | Pass; ESLint, `tsc -b`, 12/12 Vitest files and 25/25 tests, then production build |
| Cross-browser E2E | `npm run test:e2e` | Pass; 90 Playwright tests across Chromium, Firefox, and WebKit |
| Production budget | `node scripts/check-dist-budget.mjs` | Pass; exact totals below |
| Browser local preview | `http://127.0.0.1:4173/ben-portfolio/` | Pass at 1440×1000 and 390×844; no relevant console warnings/errors |
| Existing Pages baseline | `https://ben-hutchinson.github.io/ben-portfolio/` | Reachable, but it shows the legacy `Press start screen`; it is deployed `main`, not this branch |

## Release totals

| Measurement | Result | Limit | Status |
| --- | ---: | ---: | --- |
| Initial JavaScript gzip | 129,131 bytes (`assets/index-CE3sTAK6.js`) | 256,000 bytes | Pass |
| Initial observable image transfer | 241,982 bytes across `hero.webp` (37,402), Blue hero (64,906), Toni hero (44,000), and Pokeleximon runtime (95,674) | 1,572,864 bytes | Pass |
| Below-fold runtime images | 357,074 bytes across 2 files | n/a | Pass |
| Pokeleximon runtime image | 95,674 bytes | 358,400 bytes | Pass |
| Safelog runtime image | 261,400 bytes | 358,400 bytes | Pass |

The initial-image inventory is the Browser preview's observed static image set at `390×844`; later lazy-loaded images are covered separately by the runtime-image budget. The production-budget script enforces the JavaScript and per-runtime-image gates.

## Browser release flow

- At `1440×1000`, the command-centre hero rendered with the intended title and base path; both mission images and all three crew images completed successfully. The CV action emitted a download event. Opening the Pokeleximon briefing produced its dialog; Escape closed it and restored focus to `Open Pokeleximon Daily engineering briefing`. Product Systems set the corresponding topology control to `aria-pressed="true"`. Signal Sprint opened as an optional dialog after the explicit launch action.
- At `390×844`, the hero rendered at scroll position zero with no horizontal overflow. The mobile `Open navigation` control opened its command-index dialog; its Mission logs link closed the dialog and reached `#work`.
- Browser preview used `prefers-reduced-motion: no-preference` and had no relevant console warnings/errors. The full E2E matrix also passed the committed reduced-motion Signal Sprint tests.
- The committed screenshot evidence is `tests/e2e/visual.spec.ts-snapshots/command-centre-1440x1000.png` and `tests/e2e/visual.spec.ts-snapshots/command-centre-390x844.png`; both visual-regression checks passed in the E2E suite.

## Deployment limitation and accepted risk

The Pages workflow deploys only a push to `main` or a manual dispatch. This feature branch must **not** be manually deployed to the production Pages environment. There is no isolated production Pages preview for the branch. Local verification uses the static production build at `/ben-portfolio/`; live redesign verification (hero, images, CV, crew, mobile navigation, project sheet, topology, Signal Sprint, and console/network health) remains required immediately after merge and Pages deployment.

No branch UI limitation was accepted in lieu of a required release gate. `npm ci` reported four high-severity dependency-audit findings and deprecation warnings; they are pre-existing dependency supply-chain findings, were not introduced or modified by this documentation-only task, and are not a configured release-gate failure. They remain a maintenance concern.

This document does not claim that the current live Pages site includes the branch.
