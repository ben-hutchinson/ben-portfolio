# PORT-012 — Verified static delivery and performance budgets

Status: READY

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

- [ ] Manifest-aware bundle checker fails above 204800 gzip bytes and current build passes.
- [ ] All supported production hashes, refresh, history, and local resources work beneath `/ben-portfolio/` without console errors.
- [ ] Image, LCP, Lighthouse Performance, and Accessibility budgets pass with reproducible evidence.
- [ ] Desktop/Career visual baselines exist for desktop and mobile and intentional diffs are reviewed.
- [ ] Quality and Pages workflows use Node 24, least privileges, required gates, default-branch-only deployment, and `dist`-only upload.
- [ ] Release report records fresh automated, manual, budget, browser, and commit evidence.

Automated evidence: pending Tester gate.

Manual evidence: pending Tester gate.

Defects: none recorded.

Product Owner decision: READY for Tester RED, Developer GREEN, and independent release verification.
