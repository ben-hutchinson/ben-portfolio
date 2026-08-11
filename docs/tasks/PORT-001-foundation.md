# PORT-001 — Establish the Portfolio OS foundation and quality gates

Status: READY

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

- [ ] `.nvmrc` contains exactly `24`, and a clean `npm ci` succeeds using Node.js 24 LTS.
- [ ] `package.json` and `package-lock.json` resolve React and React DOM 19.2 with their 19.2 type packages, TypeScript 6, Vite 8, `@vitejs/plugin-react` 6, and `motion` 12; `framer-motion` is absent.
- [ ] Vitest, jsdom, React Testing Library, user-event, jest-dom, Playwright, axe-core, and the V8 coverage provider are development dependencies and install from the committed lockfile.
- [ ] `package.json` exposes `test`, `test:watch`, `test:coverage`, `test:e2e`, `test:e2e:a11y`, and `test:e2e:visual`; `build`, `lint`, and `typecheck` remain independently runnable.
- [ ] TypeScript remains in strict mode with unused-symbol checking, and ESLint retains React Hooks rules while recognising the required test globals.
- [ ] `tests/setup.ts` installs jest-dom matchers and performs Testing Library cleanup after each test; Vitest uses jsdom and V8 coverage.
- [ ] `vitest.config.ts` includes all `src/**/*.{ts,tsx}` and excludes only `src/main.tsx`, `src/vite-env.d.ts`, `src/**/*.d.ts`, and `src/**/*.types.ts` from global coverage.
- [ ] Coverage thresholds are exactly `{ statements: 91, branches: 91, functions: 91, lines: 91 }`; a result of exactly 90% fails for every metric.
- [ ] Playwright uses `baseURL: http://127.0.0.1:4173/ben-portfolio/`, `webServer.command: npm run preview -- --host 127.0.0.1`, and Chromium, Firefox, WebKit, mobile-Chrome, and mobile-Safari projects.
- [ ] Before production UI work begins, `tests/unit/foundation.test.tsx` asserts Ben Hutchinson, “Mid-level platform engineer”, and “Migrated 50+ repositories and reduced average build time by four minutes.”; the Tester runs it against the legacy UI and records the expected RED result.
- [ ] After the RED evidence is recorded, the Developer replaces the legacy root with a semantic, unstyled foundation view containing only the three required assertions; all three are visible on initial load without interaction.
- [ ] Before legacy modules or data are removed, their verified timeline and project content is transferred to the PORT-002 content packet; the old intro, character select, character viewer, mission runner, audio manager, panels, chroma-key hook, stage machine, obsolete components, data, utilities, and styles do not remain in the new root.
- [ ] `.gitignore` retains every existing entry and adds `coverage/`, `playwright-report/`, `test-results/`, and `.superpowers/`.
- [ ] The committed dependency tree contains none of the excluded frameworks or replacement packages listed under Out of scope.
- [ ] The Tester records current results for `npm test -- tests/unit/foundation.test.tsx`, `npm run typecheck`, `npm run lint`, and `npm run build` against the tested commit.
- [ ] The Product Owner confirms the dependency lock matches the locked technology decisions, the foundation text is visible without interaction, and no excluded framework entered the dependency tree.

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

- Setup baseline — `node --version`; `npm ci`: Not yet run; record Node version, exit status, and lockfile result.
- Required RED gate — `npm test -- tests/unit/foundation.test.tsx` against the unchanged legacy UI: Not yet run; Tester must record the failing assertion and tested commit before production UI work.
- Focused GREEN — `npm test -- tests/unit/foundation.test.tsx`: Not yet run; record passing test count and tested commit.
- Coverage gate — `npm run test:coverage`: Not yet run; record statement, branch, function, and line percentages and confirm every metric is at least 91%.
- Developer quality checks — `npm run typecheck`; `npm run lint`; `npm run build`: Not yet run; record each exit status and tested commit.
- Browser command/configuration check — `npm run test:e2e`; `npm run test:e2e:a11y`; `npm run test:e2e:visual`: Not yet run; record project coverage or any explicitly approved infrastructure limitation without treating an unrun check as a pass.
- Dependency audit — `npm ls --all`: Not yet run; record locked versions and confirm excluded frameworks are absent.

Manual evidence:

- Desktop — production preview at `http://127.0.0.1:4173/ben-portfolio/`, 1440 × 1000 viewport, pointer and keyboard: Not yet run; confirm all three required texts are visible without interaction and the document has semantic readable structure.
- Mobile — production preview at `http://127.0.0.1:4173/ben-portfolio/`, 390 × 844 viewport, touch emulation and keyboard: Not yet run; confirm all three required texts are visible without interaction, naturally scrollable, and not clipped.
- GitHub Pages path — direct load and refresh at `/ben-portfolio/`: Not yet run; confirm the foundation and assets load without a history fallback or runtime API.

Defects: None recorded. For each defect, add severity, reproduction steps, expected behaviour, actual behaviour, affected requirement, evidence, owner, and retest result.

Product Owner decision: PENDING — acceptance requires a Tester pass for the tested commit and Product Owner confirmation of every acceptance criterion; otherwise record a bounded change request.
