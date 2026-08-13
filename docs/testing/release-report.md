# PORT-012 release report

Status: GREEN — all PORT-012 automated, browser, asset, visual, workflow, and Lighthouse gates passed.

## Tested revision

- Production commit: `9c92022`
- Local production preview: `http://127.0.0.1:4203/ben-portfolio/` for the final Playwright matrix (`CI=1`, isolated port).
- Screenshot engine: Chromium; platform-independent snapshot path is configured so Linux CI and macOS use the same approved baselines.

## Automated evidence

| Gate | Command | Result |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | PASS |
| Lint | `npm run lint` | PASS |
| Unit tests | `npm test` | PASS — 21 files, 147 tests |
| Coverage | `npm run test:coverage` | PASS — statements 98.72%, branches 92.60%, functions 98.63%, lines 99.58% (all above the 91% checked-in gate) |
| Production build | `npm run build` | PASS |
| JavaScript/image budgets | `npm run check:bundle` | PASS — 97,012 gzip JS bytes / 204,800; 118,519 initial image bytes / 1,048,576; 3 deployable images, each below 358,400 bytes |
| Full Playwright matrix | `CI=1 PLAYWRIGHT_PORT=4203 npm run test:e2e` | PASS — 41 passed, 124 intentional project skips, 0 failed |

## Production browser, responsive, and accessibility evidence

The production-preview suite exercises `#desktop`, `#career`, `#projects/pokeleximon`, and `#projects/safelog` beneath `/ben-portfolio/`, including refresh, back/forward project history, successful local resources, zero same-origin 4xx/5xx or genuine request failures, no console/page errors, and no runtime XHR/fetch dependency. Browser-cancelled `net::ERR_ABORTED` requests during immediate navigation are intentionally ignored; all other same-origin request failures fail the test.

The final matrix includes Chromium, Firefox, WebKit, mobile Chromium, and mobile Safari projects. Its explicit per-test guards produce the 124 skips; executed coverage includes the required visual, responsive/mobile-flow, keyboard/window recovery, reduced-motion, axe, and route-recovery checks. Focused post-fix Chromium verification also passed 17 component tests and 7 applicable Work/window/a11y browser tests (one explicitly mobile-only browser test skipped in that Chromium-focused command).

## Visual review

The four final, platform-independent Chromium baselines were regenerated and intentionally reviewed at `9c92022`:

| Route | 1440×1000 | 390×844 | Review |
| --- | --- | --- | --- |
| Desktop | `desktop-1440x1000.png` | `desktop-390x844.png` | PASS — accepted tactile desktop composition and natural mobile first viewport. |
| Career | `career-1440x1000.png` | `career-390x844.png` | PASS — corrected wide left inset (~132px) and deliberate natural mobile first viewport. |

The snapshot template omits the operating-system suffix; obsolete `*-Chromium-darwin.png` candidates were removed. This prevents Ubuntu CI from searching for untracked `*-Chromium-linux.png` files.

## Delivery and static hosting evidence

`vite.config.ts` retains `base: '/ben-portfolio/'` and emits the Vite manifest. The manifest-aware checker measures the initial static JavaScript closure and all deployable images. The quality workflow uses Node 24, `npm ci`, typecheck, lint, coverage, build, bundle/image budgets, Playwright installation, and the full Playwright suite. It is read-only and uploads only verified `dist`; Pages deployment is restricted to `master`, requires the quality workflow, and only uploads that verified `dist` artefact with least-privileged jobs.

## Lighthouse mobile navigation evidence

Existing local Lighthouse 12.8.2 reports were inspected:

- Performance report: `/private/tmp/portfolio-os-lighthouse.json`, mobile navigation URL `http://127.0.0.1:4193/ben-portfolio/`, fetched 2026-08-13T12:07:59Z — Performance **96**, LCP **2,187ms** (2.2s).
- Accessibility report: `/private/tmp/portfolio-os-lighthouse-a11y.json`, same mobile navigation target, fetched 2026-08-13T12:08:59Z — Accessibility **100**.

These meet the Performance ≥90, Accessibility ≥95, and LCP <2.5s requirements. The final commit changed semantics and layout positioning only; the production build/bundle/asset checks above were rerun at `9c92022`.

## Manual charter disposition

The automated final matrix covers the deferred PORT-011 resilience journeys: desktop/mobile application recovery, direct/invalid hashes and history, keyboard/focus, reduced motion, 200% zoom and overflow, and axe checks. No failures were observed. A full assistive-technology narration sweep remains a low-severity manual follow-up, not a PORT-012 delivery blocker.

## Decision

PORT-012 Tester gate: **PASS**. No known release-blocking defect remains.
