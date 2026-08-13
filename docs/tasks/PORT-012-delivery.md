# PORT-012 — Verified static delivery and performance budgets

Status: ACCEPTED — 2026-08-13

Requirement links: PRD §§6, 10–11, and 13; DESIGN §§14–15; implementation plan Task 12.

User outcome: The accepted Portfolio OS builds and deploys reliably to GitHub Pages at `/ben-portfolio/`, loads within explicit budgets, and is protected by CI and production-browser checks.

## In scope

- Static `dist`, Vite manifest, and exact `/ben-portfolio/` base-path asset resolution with no runtime API dependency or server rewrite.
- Initial JavaScript ≤204800 gzip bytes, initial image transfer ≤1MB, and every non-hero image <350KB.
- Representative mobile LCP <2.5s, Lighthouse Performance ≥90, and Lighthouse Accessibility ≥95.
- Node 24 CI for install, typecheck, lint, coverage, build, bundle budget, and Playwright; Pages deployment only from the default branch with least privileges and only `dist` uploaded.
- Production-preview route/refresh/history/local-resource/console checks and approved Desktop/Career snapshots at 1440×1000 and 390×844.
- Release report with current commit, all gates, budgets, browser/manual evidence, Lighthouse results, and explicit low-severity risks.

## Out of scope

- Server hosting, history rewrites, analytics, runtime content APIs, design changes, or new professional claims.
- Legacy asset removal and README finalization owned by PORT-013 unless an asset violates an active delivery budget.

## Acceptance criteria

- [x] Manifest-aware bundle checker fails above 204800 gzip bytes and current build passes.
- [x] All supported production hashes, refresh, history, and local resources work beneath `/ben-portfolio/` without console errors.
- [x] Image, LCP, Lighthouse Performance, and Accessibility budgets pass with reproducible evidence.
- [x] Desktop/Career visual baselines exist for desktop and mobile and intentional diffs are reviewed.
- [x] Quality and Pages workflows use Node 24, least privileges, required gates, default-branch-only deployment, and `dist`-only upload.
- [x] Release report records fresh automated, manual, budget, browser, and commit evidence.

Automated evidence: `CI=1 PLAYWRIGHT_PORT=4203 npm run test:e2e` passed at the final delivery evidence revision (41 passed, 124 explicit project skips, 0 failures). Typecheck, lint, unit tests, coverage (98.72% statements, 92.60% branches, 98.63% functions, 99.58% lines), build, and the manifest-aware bundle/image gate passed. Initial JavaScript measured 97,012 gzip bytes; initial images measured 118,519 bytes; all three deployable images are below 350KB.

Browser and visual evidence: production-preview direct hashes, refresh, project back/forward, local-resource prefixing, console/page-error, no-runtime-API, responsive, keyboard/recovery, reduced-motion, zoom, and axe checks passed across the configured Playwright matrix. Controller intentionally approved the four portable Chromium Desktop/Career baselines at 1440×1000 and 390×844. Lighthouse mobile evidence recorded Performance 96, Accessibility 100, and LCP 2,187ms.

Delivery evidence: `base: '/ben-portfolio/'` and the Vite manifest are retained. Quality uses Node 24 and runs install, typecheck, lint, coverage, build, bundle/image checks, and all five configured Playwright projects before artifact upload. Pages is guarded to the actual default branch (`master`), accepts only the verified `dist` artifact, and uses reduced job permissions.

Scope disposition: legacy asset removal was pulled forward from PORT-013 because Vite deploys all of `public`, and the retained legacy PNG/JPEG files violated PORT-012's active deployable non-hero image budget. Removing the unreachable assets is accepted as the necessary, bounded delivery-budget exception; the CV, favicon, and two verified project WebPs remain. PORT-013 still owns the broader legacy/README audit.

Accepted low-severity follow-up: complete a full VoiceOver/NVDA-style narration sweep as part of PORT-013's final manual charter. Automated semantic heading, landmark, focus, keyboard, and axe evidence is green, so this is not a PORT-012 release blocker.

Defects: no release-blocking defect remains.

Product Owner decision: ACCEPTED at `d25ec9f` (`test: verify PORT-012 delivery`). The production implementation was verified at `9c92022`; `d25ec9f` adds the reviewed portable baselines, final assertions, and release evidence without changing the deployable application. Evidence considered: the committed Tester release report, Controller visual approval, Lighthouse artifacts, workflow/bundle inspection, scoped reviews, and the uncommitted Developer report's final heading/quality verification.
