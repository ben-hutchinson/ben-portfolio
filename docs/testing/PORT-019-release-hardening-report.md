# PORT-019 Tester release-hardening report

Status: **RED — implementation has not started.**

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
