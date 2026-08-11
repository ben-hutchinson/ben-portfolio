# PORT-001 — Establish the Portfolio OS foundation and quality gates

Status: ACCEPTED

Requirement links:

- [PRD §2 — Positioning](../PRD.md#2-positioning): use the role “Mid-level platform engineer” and the canonical flagship evidence statement.
- [PRD §6 — Success Criteria, criteria 1–2 and 8](../PRD.md#6-success-criteria): expose the role and flagship impact immediately and retain a fast, stable GitHub Pages build.
- [PRD §10 — Non-Functional Requirements](../PRD.md#10-non-functional-requirements): preserve accessibility, performance, reliability, and the `/ben-portfolio/` production base path.
- [PRD §11 — Technical Direction](../PRD.md#11-technical-direction): use React, TypeScript, Vite, Vitest, Testing Library, and Playwright.
- [PRD §12 — Out of Scope for Initial Release](../PRD.md#12-out-of-scope-for-initial-release): do not introduce the excluded engines, legacy interactions, server features, or persistence.
- [PRD §13 — Release Acceptance](../PRD.md#13-release-acceptance): keep build, lint, type checking, direct GitHub Pages loading, and keyboard/reduced-motion checks independently verifiable.
- [DESIGN §5 — Shell Anatomy, Default composition](../DESIGN.md#5-shell-anatomy): keep the flagship impact readable without moving windows.
- [DESIGN §11 — Accessibility](../DESIGN.md#11-accessibility): start from semantic, readable content that does not require interaction.
- [DESIGN §14 — Performance and Delivery](../DESIGN.md#14-performance-and-delivery): preserve static delivery and the `/ben-portfolio/` base path.
- [AGENTS §3 — Multi-Agent Delivery Model](../AGENTS.md#3-multi-agent-delivery-model): preserve Product Owner, Developer, and Tester decision boundaries.
- [AGENTS §5 — Locked Technical Stack](../AGENTS.md#5-locked-technical-stack) and [§6 — Required Quality Commands](../AGENTS.md#6-required-quality-commands): implement the locked versions and independently runnable quality gates.
- [Implementation plan — Task 1](../superpowers/plans/2026-08-11-portfolio-os-implementation.md#task-1-establish-governance-toolchain-and-test-gates): source task, file list, role assignments, and required coverage block.

User outcome: A recruiter can load the foundation view and immediately read Ben Hutchinson, “Mid-level platform engineer”, and the exact flagship claim, while contributors have a reproducible Node 24 toolchain and enforceable automated quality gates for the Portfolio OS build.

In scope:

- Product Owner governance: `docs/tasks/README.md`, `docs/tasks/TEMPLATE.md`, and this task packet.
- Toolchain and dependency files: `.nvmrc`, `package.json`, `package-lock.json`, `tsconfig.app.json`, `tsconfig.node.json`, `.eslintrc.cjs`, `vitest.config.ts`, and `playwright.config.ts`.
- Tester-owned harness and acceptance coverage: `tests/setup.ts` and `tests/unit/foundation.test.tsx`.
- Production foundation: replace `src/App.tsx` and `src/styles/global.css`; delete `src/App.module.css`; remove the legacy `src/features/**` tree and obsolete files under `src/components/**`, `src/hooks/**`, `src/utils/**`, and `src/data/**` only after their timeline and project content has been transferred into the PORT-002 content packet.
- Generated-artifact hygiene: append the required test artefact paths to `.gitignore` without removing existing entries.
- Required foundation behaviour: a semantic, unstyled root containing only Ben Hutchinson, “Mid-level platform engineer”, and the following canonical claim verbatim:

> Migrated 50+ repositories and reduced average build time by four minutes.

Out of scope:

- The Portfolio OS shell, design tokens, windows, dock, menu bar, hashes, commands, Career interaction, Work detail, Projects, Contact, final responsive styling, and motion.
- New or revised professional claims, including any annualised or extrapolated version of the flagship metric.
- React Router, a global state package, a component-system dependency, a server runtime, a CMS, a WebGL engine, an intro gate, character-select navigation, command-centre styling, or a persistent animation loop.
- Persisting arbitrary window positions or adding runtime content APIs.
- Production implementation or acceptance-test authorship by the Product Owner.

Dependencies:

- Approved sources: `docs/PRD.md`, `docs/DESIGN.md`, `docs/SOUL.md`, `docs/AGENTS.md`, and the Portfolio OS implementation plan.
- Branch: `terminal-redesign`.
- PORT-002 content packet must contain the verified legacy timeline and project content before the Developer deletes the corresponding legacy data or modules.

Delivery sequence and setup exception:

1. While this packet is `READY`, the Developer may write `.nvmrc`, install or update dependencies, update TypeScript and ESLint configuration, add scripts, and configure Vitest and Playwright so that the Tester has a runnable harness.
2. This is a PORT-001 setup exception to the normal Tester-first sequence. It permits test-toolchain installation and configuration only; it does not transfer acceptance-test ownership to the Developer.
3. The Tester then creates `tests/setup.ts` and `tests/unit/foundation.test.tsx`, runs `npm test -- tests/unit/foundation.test.tsx` against the unchanged legacy UI, and records the expected RED evidence below.
4. No production UI code may be written and no legacy production module may be deleted before that RED evidence is recorded. In particular, `src/App.tsx`, `src/styles/global.css`, `src/App.module.css`, and the legacy source directories stay unchanged through step 3.
5. After RED is recorded, set the packet to `IN_PROGRESS`; the Developer may implement the semantic foundation and legacy cleanup within scope.
6. The Developer records current focused-test, type-check, lint, and build results. Set the packet to `IN_TEST` for the Tester's independent verification.
7. The Product Owner sets `ACCEPTED` only after the Tester passes the tested commit and every acceptance criterion below has evidence.

Acceptance criteria:

- [x] `.nvmrc` contains exactly `24`, and a clean `npm ci` succeeds using Node.js 24 LTS.
- [x] `package.json` and `package-lock.json` resolve React and React DOM 19.2 with their 19.2 type packages, TypeScript 6, Vite 8, `@vitejs/plugin-react` 6, and `motion` 12; `framer-motion` is absent.
- [x] Vitest, jsdom, React Testing Library, user-event, jest-dom, Playwright, axe-core, and the V8 coverage provider are development dependencies and install from the committed lockfile.
- [x] `package.json` exposes `test`, `test:watch`, `test:coverage`, `test:e2e`, `test:e2e:a11y`, and `test:e2e:visual`; `build`, `lint`, and `typecheck` remain independently runnable.
- [x] TypeScript remains in strict mode with unused-symbol checking, and ESLint retains React Hooks rules while recognising the required test globals.
- [x] `tests/setup.ts` installs jest-dom matchers and performs Testing Library cleanup after each test; Vitest uses jsdom and V8 coverage.
- [x] `vitest.config.ts` includes all `src/**/*.{ts,tsx}` and excludes only `src/main.tsx`, `src/vite-env.d.ts`, `src/**/*.d.ts`, and `src/**/*.types.ts` from global coverage.
- [x] Coverage thresholds are exactly `{ statements: 91, branches: 91, functions: 91, lines: 91 }`; a result of exactly 90% fails for every metric.
- [x] Playwright uses `baseURL: http://127.0.0.1:4173/ben-portfolio/`, `webServer.command: npm run preview -- --host 127.0.0.1`, and Chromium, Firefox, WebKit, mobile-Chrome, and mobile-Safari projects.
- [x] Before production UI work begins, `tests/unit/foundation.test.tsx` asserts Ben Hutchinson, “Mid-level platform engineer”, and “Migrated 50+ repositories and reduced average build time by four minutes.”; the Tester runs it against the legacy UI and records the expected RED result.
- [x] After the RED evidence is recorded, the Developer replaces the legacy root with a semantic, unstyled foundation view containing only the three required assertions; all three are visible on initial load without interaction.
- [x] Before legacy modules or data are removed, their verified timeline and project content is transferred to the PORT-002 content packet; the old intro, character select, character viewer, mission runner, audio manager, panels, chroma-key hook, stage machine, obsolete components, data, utilities, and styles do not remain in the new root.
- [x] `.gitignore` retains every existing entry and adds `coverage/`, `playwright-report/`, `test-results/`, and `.superpowers/`.
- [x] The committed dependency tree contains none of the excluded frameworks or replacement packages listed under Out of scope.
- [x] The Tester records current results for `npm test -- tests/unit/foundation.test.tsx`, `npm run typecheck`, `npm run lint`, and `npm run build` against the tested commit.
- [x] The Product Owner confirms the dependency lock matches the locked technology decisions, the foundation text is visible without interaction, and no excluded framework entered the dependency tree.

Required coverage configuration:

```ts
coverage: {
  provider: 'v8',
  include: ['src/**/*.{ts,tsx}'],
  exclude: ['src/main.tsx', 'src/vite-env.d.ts', 'src/**/*.d.ts', 'src/**/*.types.ts'],
  thresholds: { statements: 91, branches: 91, functions: 91, lines: 91 },
}
```

Automated evidence:

- Setup baseline — Node `v24.19.0`; `.nvmrc` is exactly `24`; bootstrap commit `b648226180bc295ce82a14042918ac3fd431a405` records clean `npm ci` exit 0. Independent lockfile/package inspection and `npm ls --all` on tested commit `99ab57a106cab473136633c0e1ae988e0347df6a` exited 0.
- Required RED gate — `npm test -- tests/unit/foundation.test.tsx` against the unchanged legacy UI: 2026-08-11, tested commit `b648226180bc295ce82a14042918ac3fd431a405`; expected RED. The real legacy initial render exposed only the `Press start screen`, so the semantic `Ben Hutchinson` heading, role, and canonical flagship impact were absent. See `.superpowers/sdd/2026-08-11-portfolio-os-implementation/task-1-tester-red-report.md`.
- Focused GREEN — `npm test -- tests/unit/foundation.test.tsx` at `99ab57a106cab473136633c0e1ae988e0347df6a`: exit 0; 1 file and 3 tests passed in 1.92s with no warnings or errors.
- Coverage gate — `npm run test:coverage`: exit 0; statements 100% (2/2), branches 100% (0/0), functions 100% (1/1), lines 100% (2/2); every 91% threshold passed.
- Developer quality checks — fresh Tester runs of `npm run typecheck`, `npm run lint`, and `npm run build`: all exit 0; build used Vite 8.2.1, transformed 16 modules, and completed in 727ms.
- Browser command/configuration check — Playwright loaded `playwright.config.ts` and accepted Chromium, Firefox, WebKit, mobile-Chrome, and mobile-Safari. `test:e2e`, `test:e2e:a11y`, and `test:e2e:visual` list checks each reported the expected `0 tests in 0 files`; PORT-001 supplies configuration and manual checks, not browser specs.
- Dependency audit — `npm ls --all`: exit 0; required top-level versions match the lock. `npm ls react-router react-router-dom redux @reduxjs/toolkit zustand three @react-three/fiber --all` returned `(empty)`. Required `motion@12.43.0` transitively contains `framer-motion@12.43.0`, but `framer-motion` is absent from direct dependencies and application source.

Manual evidence:

- Desktop — controller-assisted in-app Browser verification at `http://127.0.0.1:4174/ben-portfolio/`, 1440 × 1000: PASS. The title is `Ben Hutchinson | Portfolio`; the semantic h1, role, and exact flagship claim are visible without interaction; no overlay or console error was observed. Screenshot: `/private/tmp/portfolio-os-task1-desktop.png`.
- Mobile — controller-assisted in-app Browser verification at the same exact `/ben-portfolio/` path, 390 × 844 touch-emulated viewport: PASS. All three strings are visible, naturally laid out, and unclipped; `scrollWidth` equals `clientWidth` at 390. Screenshot: `/private/tmp/portfolio-os-task1-mobile.png`.
- GitHub Pages path — direct load and reload at `/ben-portfolio/`: PASS with the foundation intact and no console errors. Port 4174 was used only because 4173 was occupied in the verification environment; committed Playwright `baseURL` remains the required `http://127.0.0.1:4173/ben-portfolio/`.

Defects: None recorded. For each defect, add severity, reproduction steps, expected behaviour, actual behaviour, affected requirement, evidence, owner, and retest result.

Tester verification: PASS for exact commit `99ab57a106cab473136633c0e1ae988e0347df6a`. Automated, coverage, dependency, configuration, desktop, mobile, and direct-path checks satisfy the PORT-001 Tester gate. Product Owner acceptance remains pending.

Product Owner decision: ACCEPTED — 2026-08-11. Reviewed tested production commit `99ab57a106cab473136633c0e1ae988e0347df6a` and Tester evidence commit `dc59ea7fa197d3029e3ddcc9051435518d0196bb`: Node 24.19 focused suite reported 3/3 passing, V8 coverage reported 100% statements/branches/functions/lines against the exact 91% thresholds, and typecheck, lint, build, lock/dependency, browser configuration, desktop, mobile, and direct `/ben-portfolio/` checks were recorded as passing. Product Owner inspection confirmed `.nvmrc` is exactly `24`, the manifest/lock use the locked stack with direct/source `framer-motion` absent (the required `motion` package carries it transitively), the foundation renders only the required visible semantic content, the legacy inventory was preserved in PORT-002 before deletion, and no excluded framework is a direct dependency or source import. No Important or Critical issue found.
