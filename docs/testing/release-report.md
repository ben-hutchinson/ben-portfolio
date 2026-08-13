# PORT-012 release report

Status: RED baseline — awaiting Developer GREEN and consolidated release verification.

## Tested revision

- Commit: `50fb01f` (`docs: queue PORT-012 delivery`)
- Preview target: `http://127.0.0.1:4173/ben-portfolio/`
- Test environment: pending final verification.

## Automated evidence

| Gate | Command | Result | Evidence / follow-up |
| --- | --- | --- | --- |
| Type checking | `npm run typecheck` | Pending | Run after Developer GREEN. |
| Lint | `npm run lint` | Pending | Run after Developer GREEN. |
| Unit tests | `npm test` | Pending | Run after Developer GREEN. |
| Coverage | `npm run test:coverage` | Pending | Record statements, branches, functions, and lines. |
| Production build | `npm run build` | Pending | Required before preview checks. |
| Bundle budget | `npm run check:bundle` | RED | Command and manifest do not yet exist. |
| Browser production preview | `npm run test:e2e -- tests/e2e/github-pages.spec.ts` | Pending | Direct base-path, reload, history, local-resource, console, and no-runtime-API coverage added. |
| Visual regression | `npm run test:e2e:visual` | Pending | Four first-review baselines required; no automated approval of diffs. |

## Browser and manual evidence

| Area | Required evidence | Result | Notes |
| --- | --- | --- | --- |
| Desktop browser matrix | Chromium, Firefox, WebKit at 1440×1000 | Pending | Run the relevant manual-charter rows after GREEN. |
| Mobile browser matrix | Chromium, Firefox, WebKit at 390×844 | Pending | Run the relevant manual-charter rows after GREEN. |
| Production hashes | `#desktop`, `#career`, `#projects/pokeleximon`, `#projects/safelog` | Pending | Covered by `github-pages.spec.ts`. |
| Refresh and history | Reload each supported hash; browser back/forward across projects | Pending | Covered by `github-pages.spec.ts`. |
| Local resources / console | No failed local assets, HTTP failures, page errors, console errors, or XHR/fetch runtime dependency | Pending | Covered by `github-pages.spec.ts`. |
| Visual review | Desktop and Career at 1440×1000 and 390×844 | Pending | New screenshot baselines must be visually reviewed before acceptance. |
| Manual charter | Keyboard, recovery, touch/zoom, reduced motion, invalid hash, root/media failure, screen reader, focus/colour | Pending | Follow `docs/testing/manual-test-charter.md`; record all failures with artefacts. |

## Performance and budget evidence

| Gate | Requirement | Result | Evidence / follow-up |
| --- | --- | --- | --- |
| Initial JavaScript | ≤204800 gzip bytes | RED | Await manifest-aware `check:bundle` implementation. |
| Initial images | ≤1MB transfer | Pending | Measure final production assets. |
| Non-hero images | <350KB each | Pending | Measure final production assets. |
| Mobile LCP | <2.5s | Pending | Run on agreed mobile profile. |
| Lighthouse Performance | ≥90 | Pending | Run after final preview build. |
| Lighthouse Accessibility | ≥95 | Pending | Run after final preview build. |

## Delivery / CI evidence

| Gate | Requirement | Result | Evidence / follow-up |
| --- | --- | --- | --- |
| Vite manifest | Build emits manifest | RED | `vite.config.ts` currently has no manifest setting. |
| Bundle script | `scripts/check-bundle.mjs` and package command | RED | Both are absent. |
| Quality workflow | Node 24, all required quality gates, PR-safe | RED | `.github/workflows/quality.yml` is absent. |
| Pages workflow | Node 24, least privilege, default-branch-only deploy, `dist` upload | RED | Re-check after Developer GREEN. |

## Known issues and decision

No product defect has been established in this RED baseline. Delivery acceptance is blocked only by the unimplemented manifest/bundle/CI gates and by final browser, manual, performance, Lighthouse, and visual evidence.
