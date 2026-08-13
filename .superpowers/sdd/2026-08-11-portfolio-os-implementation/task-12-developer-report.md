# PORT-012 Developer GREEN report

Date: 2026-08-13

## Implementation

- Kept the exact GitHub Pages base path: `base: '/ben-portfolio/'`.
- Enabled Vite's production manifest at `dist/.vite/manifest.json`.
- Added `scripts/check-bundle.mjs`, which reads the emitted Vite manifest, follows static `imports` from every `isEntry` chunk, gzip-compresses each initial JavaScript asset with Node's built-in `node:zlib`, totals the unique files, and exits non-zero above `204800` bytes. It rejects a missing manifest, missing referenced entry, and manifest paths escaping `dist`.
- Added `npm run check:bundle`; the quality workflow executes it immediately after the production build.
- Added reusable `.github/workflows/quality.yml`. Pull requests run Node 24, `npm ci`, typecheck, lint, coverage, build, bundle budget, Playwright browser installation, and the full Playwright suite with `contents: read` only. The successful build is saved as the `portfolio-dist` artifact.
- Updated `.github/workflows/gh-pages.yml` to run the reusable quality workflow for pushes to `main`, then download and submit only `dist` to Pages. The upload job has only `contents: read` and `pages: write`; deployment has only `pages: write` and `id-token: write`. No PR-triggered workflow deploys Pages.

## Commands and results

| Command | Result |
| --- | --- |
| `npm run check:bundle` before implementation | RED: npm reported the script was missing. |
| `npm run typecheck` | PASS. |
| `npm run lint` | PASS. |
| `npm run build` | PASS; emitted `dist/.vite/manifest.json`. |
| `npm run check:bundle` | PASS; `assets/index-CKk4DrKE.js` is 96,857 gzip bytes, 107,943 bytes under budget. |
| `npm test` | PASS: 21 files, 147 tests. |
| `npm run test:coverage` | PASS: statements 98.68%, branches 93.00%, functions 98.61%, lines 99.57%. |
| `npx playwright test tests/e2e/github-pages.spec.ts --project=Chromium` | PASS after permitting the local 127.0.0.1 preview listener. The initial sandbox attempt was blocked with `EPERM` before test execution. |
| `node --check scripts/check-bundle.mjs` | PASS. |
| `git diff --check` | PASS. |

The full Playwright/visual/Lighthouse/manual matrix was not run, as directed. The committed quality workflow will run all five configured Playwright projects; the Tester must intentionally approve visual baselines before that complete CI gate can pass.

## Manifest and asset inspection

- The manifest has one `isEntry` (`index.html`) and one initial JavaScript file, `assets/index-CKk4DrKE.js`.
- The application references `project-pokeleximon.webp` (32,772 bytes) and `project-safelog.webp` (85,390 bytes), so its initial route has no image transfer and its referenced non-hero images are below 350KB.
- `dist` also includes pre-existing, unreferenced legacy PNG/JPEG files above the non-hero threshold, with the largest at 3,544,198 bytes (`assets/ui/project-dog-feature.png` and an old character source image). PORT-013 owns legacy cleanup, but this remains an acceptance concern if the criterion is interpreted as applying to every deployable static image rather than transferred/runtime images.

## Self-review

- Base path remains exactly `/ben-portfolio/`; hash navigation requires no server rewrites and no runtime API was added.
- The checker counts static dependency closure rather than a guessed filename or Vite's printed size, de-duplicates shared chunks, and ignores dynamic imports because they are not initial JavaScript.
- PR workflow has no Pages permission or deploy job. The default-branch Pages path cannot upload until the reusable quality job succeeds and uploads only `dist`.
- No Tester-owned tests, visual baselines, release report, task packet, plan, ledger, or `.DS_Store` were changed/staged.

## Remaining independent gates

- Tester: intentional visual baseline review, full browser/manual matrix, image-transfer interpretation/evidence, mobile LCP, Lighthouse Performance, Lighthouse Accessibility, and release-report evidence.
- Product Owner: final acceptance decision and disposition of the legacy oversized static images.
