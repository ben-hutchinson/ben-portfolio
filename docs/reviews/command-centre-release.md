# Command Centre release evidence

Release status: **verification in progress**

## Target

- Branch: `codex/command-centre-redesign`
- Release-candidate SHA: `23b7732037c1ce4ad992a5d399b9c45ed7c9a027` (documentation-final SHA recorded after the clean-install gate)
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
| Clean worktree before install | `git status --short` | Pending final gate |
| Deterministic install | `npm ci` | Pending final gate |
| Lint, types, unit tests, build | `npm run check` | Pending final gate |
| Cross-browser E2E | `npm run test:e2e` | Pending final gate |
| Production budget | `node scripts/check-dist-budget.mjs` | Pending final gate |
| Browser local preview | `http://127.0.0.1:4173/ben-portfolio/` | Pending final gate |
| Existing Pages baseline | `https://ben-hutchinson.github.io/ben-portfolio/` | Pending inspection; it is deployed `main`, not this branch |

## Release totals

Final build totals are recorded after the clean-install release-matrix run:

- Initial JavaScript gzip: pending
- Below-fold runtime images: pending
- Initial image transfer: pending
- Individual below-fold image limit: 350 KB

## Deployment limitation and accepted risk

The Pages workflow deploys only a push to `main` or a manual dispatch. This feature branch must **not** be manually deployed to the production Pages environment. There is no isolated production Pages preview for the branch. Local verification uses the static production build at `/ben-portfolio/`; live redesign verification (hero, images, CV, crew, mobile navigation, project sheet, topology, Signal Sprint, and console/network health) remains required immediately after merge and Pages deployment.

Accepted low-severity limitations and any remaining browser-specific observations are recorded with the final matrix results. This document does not claim that the current live Pages site includes the branch.
