# PORT-019 Tester release-hardening report

Status: **PASS — final Tester release certification complete; ready for Product Owner acceptance.**

## Candidate and scope

- Product Owner base: `3d33b2ba570165ec8bc4bf05ac092ec40982d166` on `terminal-redesign`.
- Tester owns only `tests/unit/release-audit.test.ts`, the removal of the test-only `TITLE_BAR_HEIGHT` coupling in `tests/unit/windowGeometry.test.ts`, and this report.
- Production source, workflows, package metadata, `.gitignore`, tracked artefacts, `.DS_Store`, and `.playwright-cli/` are outside this RED checkpoint.

## Acceptance contracts introduced

- PRD/DESIGN must describe the accepted identity-only menu, five application controls plus utilities, Desktop-only Micro terminal, typed Work catalogue/detail routes, no Work technology inventory, and the accepted default composition. They must no longer describe menu navigation, Command windows/apps, a Work technology field, background statement, or `workEntries`.
- `.playwright-cli/` must be ignored; tracked Finder/Playwright-MCP artefacts, five obsolete screenshots, and four obsolete asset documents must leave the release tree. Protected CV/favicon/WebPs, all approved visual baselines, and the historical command-centre plan/spec must remain.
- Only the named dead CSS/token/hook/export/command metadata may leave. The live Projects `.blurb`, project rendering, Work command data derivation, parser-facing execution API, and public window geometry functions must remain.
- The six approved official Actions must use their exact SHA plus `# v4` comment. `package.json`, `package-lock.json`, and `index.html` must equal `151456d` byte-for-byte.

## Final GREEN/manual charter

At the exact combined Tester head, verify:

1. Production preview beneath `/ben-portfolio/` at 1440×1000, 1024×768, 390×844, and 320×568.
2. Direct/reload/history routes for Desktop, Work catalogue/detail, Career, Projects/project detail, and Contact; unknown-hash recovery.
3. Keyboard focus, Work/Project detail Back, maximize/restore route retention, reduced-motion equivalence, one-active-app mobile behavior, and Desktop-only Micro terminal.
4. GitHub, LinkedIn, and CV actions; static assets and visual baselines without updates.
5. Exact-head typecheck, lint, coverage, build, bundle, E2E, axe, no-update visual, both high-severity npm audits, merge-tree, whitespace, tracked/ignored-artifact inventory, and clean ordinary status checks from PORT-019.

## RED evidence

Executed at Tester RED head before any PORT-019 production/configuration/documentation implementation:

```text
PATH=/opt/homebrew/opt/node@24/bin:$PATH npm test -- tests/unit/release-audit.test.ts tests/unit/windowGeometry.test.ts tests/unit/parseCommand.test.ts tests/component/CareerApp.test.tsx tests/component/ProjectsApp.test.tsx
```

Result: **1 failed / 4 passed files; 4 failed / 41 passed tests**.

The four failures are intentional and confined to `PORT-019 release hardening` acceptance contracts:

1. PRD/DESIGN do not yet contain the accepted Kernel/identity-only/Micro-terminal/typed-Work documentation (first missing required text: `Kernel mark`).
2. `.gitignore` does not yet contain `.playwright-cli/`; subsequent tracked-tree/deletion requirements are deliberately held in the same release-tree contract.
3. `WindowLayer.module.css` still contains `.appContent` (and the test also protects the remaining named dead-code, Motion, geometry, command, and Projects `.blurb` contracts).
4. Workflows still reference mutable `@v4` Action tags rather than the approved SHA/comment pins.

No unrelated failure occurred: `windowGeometry`, `parseCommand`, `CareerApp`, and `ProjectsApp` suites all passed (**41 tests**). The intentional geometry-test maintenance removed only the test-only `TITLE_BAR_HEIGHT` import/assertion; all public `constrainWindowSize` and `clampWindowPosition` cases remain covered and green.

## Tester harness correction — Motion reduced motion

The initial `CareerApp` test helper modelled only `(prefers-reduced-motion: reduce)`, while Motion's `useReducedMotion()` queries `(prefers-reduced-motion)`. Its previous listener methods were no-ops, making preference changes unfaithful. The Tester-owned mock now caches query objects, exposes Motion's actual query with the requested state, and maintains `change`/legacy listener registration and dispatch semantics. Production was not changed and the existing reduced-motion assertion remains exact (`data-reduced-motion="true"` and zero duration).

Focused GREEN at the production candidate `238880aa9a2fd1370c803e8af9564e43d6f1f871` before this evidence-only checkpoint:

```text
PATH=/opt/homebrew/opt/node@24/bin:$PATH npm test -- tests/unit/release-audit.test.ts tests/unit/windowGeometry.test.ts tests/unit/parseCommand.test.ts tests/component/CareerApp.test.tsx tests/component/ProjectsApp.test.tsx
```

Result: **5 files passed, 45 tests passed, 0 failed**. The Motion hook now initialises from the faithful `(prefers-reduced-motion)` mock rather than a stale module-level state; the assertion verifies the same reduced-motion output contract without weakening it.

## Final exact-head GREEN certification

- Exact tested code-and-tests head: `08aeb1d30ff1dd5c94f12bbe9f88814efde062e4` (`test: model Motion reduced motion`). This is the complete PORT-019 candidate before this evidence-only report commit.
- Date: 2026-08-25. Toolchain: Node `v24.19.0` (`/opt/homebrew/opt/node@24/bin`), npm `11.17.0`, Vitest `4.1.10`, Playwright `1.62.1`.
- Fresh ports: full browser matrix `4243`; axe `4244`; no-update visual comparison `4245`; Browser manual production preview `4246`. No baseline update command was used.

| Command | Result |
| --- | --- |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm test -- tests/unit/release-audit.test.ts tests/unit/windowGeometry.test.ts tests/unit/parseCommand.test.ts tests/component/CareerApp.test.tsx tests/component/ProjectsApp.test.tsx` | PASS — **5 files, 45 tests**, 0 failed. |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run typecheck` | PASS — exit 0. |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run lint` | PASS — exit 0, zero warnings. |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run test:coverage` | PASS — **22 files, 179 tests**, 0 failed. Statements **98.46%** (577/586), branches **91.29%** (430/471), functions **99.34%** (152/153), lines **99.60%** (510/512); all configured 91% thresholds met. |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run build` | PASS — static Vite build. Initial CSS 31.19 kB (5.91 kB gzip), initial JS 309.09 kB (**99.22 kB gzip**). |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm run check:bundle` | PASS — initial JS **97,959 gzip bytes** / 204,800 budget; initial images **118,529 bytes** / 1,048,576 budget; three deployable images, each below the non-hero budget. |
| `CI=1 PATH=/opt/homebrew/opt/node@24/bin:$PATH PLAYWRIGHT_PORT=4243 npm run test:e2e` | PASS — **53 passed, 172 intentional project skips, 0 failed** (225 total). |
| `CI=1 PATH=/opt/homebrew/opt/node@24/bin:$PATH PLAYWRIGHT_PORT=4244 npm run test:e2e:a11y` | PASS — **3 passed, 12 intentional project skips, 0 failed**. |
| `CI=1 PATH=/opt/homebrew/opt/node@24/bin:$PATH PLAYWRIGHT_PORT=4245 npm run test:e2e:visual` | PASS — **4 passed, 16 intentional project skips, 0 failed**. Existing baselines were compared only; none were updated. |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm audit --audit-level=high` | PASS — `found 0 vulnerabilities`. |
| `PATH=/opt/homebrew/opt/node@24/bin:$PATH npm audit --omit=dev --audit-level=high` | PASS — `found 0 vulnerabilities`. |
| `git merge-tree --write-tree master HEAD` | PASS — clean merged-tree object `f095db9ba6203479e5cd119934552053d112445e`; no conflict output. |
| `git diff --check` | PASS — no whitespace errors. |

### Browser/manual production-preview evidence

The connected Browser inspected the built Vite preview under `http://127.0.0.1:4246/ben-portfolio/`, not the development server. The static GitHub Pages base path was retained in every result.

| Viewport / flow | Evidence | Result |
| --- | --- | --- |
| 1440×1000 Desktop | `#desktop` displayed Ben Hutchinson and the permanent Micro terminal; no horizontal overflow or framework error overlay. Dock utilities were GitHub (`_blank`, `noopener noreferrer`), LinkedIn (`_blank`, `noopener noreferrer`), and base-safe CV download `/ben-portfolio/cv/ben-hutchinson-cv.pdf` with `download="ben-hutchinson-cv.pdf"`. | PASS |
| Work and history | `#work` exposed the named Python Dependency Migration case-study action. Opening it produced exact `#work/uv-ruff-migration`, visible Back and approved outcome. Browser Back restored `#work`; Forward restored the exact detail hash. | PASS |
| Work and Project maximize | Maximize then Restore retained exact Work detail hash and Back control. The Project Safelog sentinel retained exact `#projects/safelog` and heading through Maximize/Restore. | PASS |
| Direct hashes | Desktop, Work catalogue/detail, Career, Projects/catalogue detail, and Contact each loaded directly under `/ben-portfolio/` with their expected heading/content. At 1024×768 Work detail reload preserved the direct hash and Back. | PASS |
| 390×844 and 320×568 | Mobile direct Work detail and narrow Contact rendered with no horizontal overflow or error overlay. At 390×844 only focused Work was visible; switching via Career dock produced only focused Career. | PASS |
| Keyboard, motion, terminal | At desktop width, Tab exposed solid 3px focus outlines on Close Work, Minimize Work, Maximize Work, and the named catalogue action. Career direct route omitted the Micro terminal; full E2E retained the reduced-motion regression. | PASS |

The static-hosting browser suite independently covered same-origin resource failures, no runtime API requests, and browser history. The axe suite found no serious, critical, or contrast violation in its desktop, mobile, Work catalogue, and Work detail checks. No console error, page error, framework overlay, layout clipping, or visual-baseline regression was observed.

### Release-boundary and local-artifact audit

- `git diff --exit-code 151456d -- package.json package-lock.json index.html` returned no output: the dependency lock/manifest and HTML security metadata remain byte-for-byte unchanged.
- Both workflows contain exactly the six required SHA pins with `# v4` comments, including `upload-pages-artifact` at its supplied v4 SHA. Triggers, permissions, jobs, artifact name/path, environment, and deploy guard remain covered by the release-audit test.
- `git ls-files` contains no root `.DS_Store`, `.playwright-mcp/`, `.playwright-cli/`, named obsolete screenshot, or obsolete asset-document path. It retains the production CV, favicon, WebPs, four visual baselines, and both historical command-centre documents.
- Local `.DS_Store` SHA-1 is `08c1372d09e6e56db51a532ba076b208269b556e`, matching the pre-index record. `.playwright-cli/` remains ignored and all 18 pre-recorded names/sizes/SHA-1 values match the Developer inventory. `.playwright-mcp/` remains a local ignored diagnostic directory with no tracked entry.
- Immediately before this evidence-only report update, ordinary `git status --short` was clean. `git status --short --ignored` showed only expected ignored local artefacts/caches, including `.DS_Store`, `.playwright-cli/`, `.playwright-mcp/`, `.superpowers/`, build/test output, and local worktrees; no protected local artifact was staged.

### Defects and disposition

The initial test-only Motion media-query defect is corrected in `08aeb1d`; production was already correct. No production, dependency, CSP/referrer, deployment, visual-baseline, or protected-artifact drift was introduced. **No open PORT-019 defect remains.**
