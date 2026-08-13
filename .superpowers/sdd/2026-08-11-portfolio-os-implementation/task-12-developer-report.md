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

## Fix round 1 — reviewer delivery blockers

### Root cause and implementation

- Confirmed the configured remote default is `origin/master`; Pages now pushes only from `master`, and both the artifact-upload and deploy jobs include `if: github.ref == 'refs/heads/master'`. A manual dispatch from any feature branch can run quality but cannot upload or deploy.
- Vite deploys the whole `public` directory. Source references only `assets/ui/project-pokeleximon.webp` and `assets/ui/project-safelog.webp`; the legacy audio, background, character, and old UI PNG assets were therefore unreferenced but still deployable. Removed them while preserving the CV PDF, favicon, the two active WebPs, and all `.DS_Store` files.
- Extended `check:bundle` without dependencies. Alongside manifest-aware initial JavaScript gzip accounting, it now reads initial HTML/JS/CSS asset text to total deduplicated initial local image references, recursively inspects all deployable image files, and fails if initial images exceed 1MB or any deployable image is at or above 350KB. No current hero contract exists, so enforcement applies the stricter limit to every deployable image.

### Fresh verification

| Command | Result |
| --- | --- |
| `git symbolic-ref --short refs/remotes/origin/HEAD` | `origin/master` |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS |
| `npm run check:bundle` | PASS: 96,857 gzip JS bytes; 118,519 initial image bytes; 3 deployable images; none at or above 350KB |
| `npm test` | PASS: 21 files, 147 tests |
| `npm run test:coverage` | PASS: 98.68% statements, 93.00% branches, 98.61% functions, 99.57% lines |
| `rg` runtime-reference inspection | Only the two retained project WebPs are referenced by source. |
| `find dist` image-size inspection | Exactly `project-safelog.webp` (85,390 bytes), `project-pokeleximon.webp` (32,772 bytes), and `favicon.svg` (357 bytes); all below 350KB. |
| `git diff --check` | PASS |

No Tester-owned test, visual baseline, or release-report change was made in this fix round.

## Fix round 2 — Career browser regressions

### Diagnosis and implementation

- The desktop 200% zoom contract failed because the fixed-width Career window's usable inline size becomes narrow under page zoom while viewport media queries remain desktop-sized. The two-column stage then reduced its lead column to roughly 106 rendered pixels, making the headline extremely tall and preventing the contract from keeping the content usefully reachable.
- Added an inline-size container to the Career app and a `max-width: 42rem` container query that switches the stage and controls to their existing one-column responsive layout based on the actual window width. This preserves the wide desktop composition while handling zoomed/narrow app windows without horizontal overflow or emergency word breaking.
- The mobile Career route had two visible h1 elements: the global MenuBar identity and the Career route heading. MenuBar now renders the identity as h1 only for the Desktop route, which preserves the recruiter contract at `#desktop`. Career's route h1 is now screen-reader-only on wide layouts and visible on mobile, yielding exactly one visible, route-appropriate Career h1 on mobile while preserving a valid desktop heading hierarchy.

### Fresh verification

| Command | Result |
| --- | --- |
| `npm run build` | PASS |
| `npx playwright test tests/e2e/career.spec.ts --project=Chromium --grep "keeps the Now stage readable"` | PASS |
| `npx playwright test tests/e2e/career.spec.ts --project=mobile-Chrome --grep "sole visible Career h1"` | PASS |
| `npx playwright test tests/e2e/accessibility.spec.ts --project=Chromium` | PASS |
| `npx playwright test tests/e2e/recruiter-scan.spec.ts --project=Chromium` | PASS |
| `npx playwright test tests/e2e/recruiter-scan.spec.ts --project=mobile-Chrome` | PASS |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS: 21 files, 147 tests |
| `npm run check:bundle` | PASS: 96,879 gzip JS bytes; 118,519 initial image bytes; 3 deployable images below 350KB |
| `git diff --check` | PASS |

No Tester-owned test, visual baseline, release report, task packet, plan, ledger, or `.DS_Store` change was staged or modified by this fix.

## Fix round 4 — preserve route heading semantics

### Diagnosis and implementation

- On every non-Desktop hash, the persistent Menu identity heading could coexist with a route h1. Retained desktop windows also allowed headings from a prior route to remain in the accessibility tree, producing duplicate h1s and `h1 → h2 → h1` drops after hash navigation.
- MenuBar now uses the profile name as an h1 only on `#desktop`; it is ordinary text on every route that has application content. Career, Projects, and Contact promote their content title to h1 only when they own the active route and use h2 when retained in the background. Project detail already owns its route h1.
- WindowLayer explicitly maps each supported route to its owning application. The owning route window renders first in source order and has a focusable, labelled titlebar div rather than an h2; other desktop window titlebars remain h2. This produces an assistive-technology order of route h1 followed by h2 sections without changing the titlebar's visual or keyboard order.
- Career retains a screen-reader route title on wide layouts, adds a supporting hidden h2 before its stage h3, and makes the route title visible on mobile. The existing Career stage heading remains h3 for the focused browser contract.

### Fresh verification

| Command | Result |
| --- | --- |
| Headless Chromium direct and sequential route inspection: `#desktop`, `#work`, `#career`, `#projects`, `#projects/pokeleximon`, `#projects/safelog`, `#contact` | PASS: each visible heading sequence starts at h1 and has no level jump greater than one. |
| `PLAYWRIGHT_PORT=4341 CI=1 npx playwright test tests/e2e/accessibility.spec.ts --project=Chromium` | PASS: 3 tests. |
| `PLAYWRIGHT_PORT=4342 CI=1 npx playwright test tests/e2e/career.spec.ts --project=Chromium --grep "keeps the Now stage readable"` | PASS: 1 test. |
| `PLAYWRIGHT_PORT=4343 CI=1 npx playwright test tests/e2e/career.spec.ts --project=mobile-Chrome --grep "sole visible Career h1"` | PASS: 1 test. |
| `PLAYWRIGHT_PORT=4344 CI=1 npx playwright test tests/e2e/recruiter-scan.spec.ts --project=Chromium` | PASS: 1 passed, 1 intended skip. |
| `PLAYWRIGHT_PORT=4345 CI=1 npx playwright test tests/e2e/recruiter-scan.spec.ts --project=mobile-Chrome` | PASS: 1 passed, 1 intended skip. |
| `npm run typecheck` | PASS. |
| `npm run lint` | PASS. |
| `npm run build` | PASS. |
| `npm run check:bundle` | PASS: 97,012 gzip JS bytes; 118,519 initial image bytes; 3 deployable images below 350KB. |
| `npm test` | Expected current result: 19 files / 145 tests pass; 2 Tester-owned assertions are stale because they require the active direct-route titlebar to remain an h2. Tester confirmed those assertions will be amended. |
| `git diff --check` | PASS. |

No visual baselines, Tester-owned tests, release report, task packet, plan, ledger, or `.DS_Store` files are included in the production commit.

## Fix round 3 — release-matrix heading and zoom stability

### Diagnosis and implementation

- The wide Career heading-order test filters elements by `offsetParent`. The prior screen-reader-only Career h1 remained in that order after the Career window h2, causing an h2-to-h1 drop. The MenuBar now always contains the identity h1 in semantic/offset-parent order; it is visually clipped on wide non-Desktop routes, while Career's route h1 is `display: none` on wide layouts. On mobile non-Desktop routes the Menu h1 is `display: none` and Career's h1 is visible, preserving the one-visible-Career-h1 contract.
- Instrumenting the exact zoom predicate in headless Chromium showed `usesProfessionalWrapping: true` and no document overflow. Every reachability check failed because the Career default `x: 180` offset doubles under `body.style.zoom = '2'`, placing the controls at x=600–1564 in a 1440px viewport. Reduced the default Career inset to `x: 72`; at 200% the window remains deliberately inset while all controls stay inside the viewport.
- Updated Playwright preview configuration to take `PLAYWRIGHT_PORT`, pass Vite `--strictPort`, and use the matching base URL. This supports genuinely fresh local production checks and prevents Vite from silently selecting a stale alternate port.

### Fresh strict-port verification

| Command | Result |
| --- | --- |
| `PLAYWRIGHT_PORT=4312 CI=1 npx playwright test tests/e2e/accessibility.spec.ts --project=Chromium --grep "ordered headings"` | PASS: 1 test |
| `PLAYWRIGHT_PORT=4313 CI=1 npx playwright test tests/e2e/career.spec.ts --project=Chromium --grep "keeps the Now stage readable"` | PASS: 1 test |
| `PLAYWRIGHT_PORT=4314 CI=1 npx playwright test tests/e2e/career.spec.ts --project=mobile-Chrome --grep "sole visible Career h1"` | PASS: 1 test |
| `PLAYWRIGHT_PORT=4315 CI=1 npx playwright test tests/e2e/recruiter-scan.spec.ts --project=Chromium` | PASS: 1 passed, 1 intended skip |
| `PLAYWRIGHT_PORT=4316 CI=1 npx playwright test tests/e2e/recruiter-scan.spec.ts --project=mobile-Chrome` | PASS: 1 passed, 1 intended skip |
| `npm run build` | PASS |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS: 21 files, 147 tests |
| `npm run check:bundle` | PASS: 96,867 gzip JS bytes; 118,519 initial image bytes; 3 deployable images below 350KB |
| `git diff --check` | PASS |

No Tester-owned test, visual baseline, release report, task packet, plan, ledger, or `.DS_Store` change was staged or modified by this fix.
