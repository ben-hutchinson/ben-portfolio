# PORT-019 — Harden the accepted release and repository boundary

Status: READY FOR TESTER RED

Requirement links: accepted PORT-014–018 behavior; `docs/AGENTS.md` §§2–6, 15–20; user-approved 2026-08-23 release-hardening audit.

User outcome: The Portfolio OS release remains visually and behaviorally unchanged, while its authoritative documentation, repository contents, CI action references, and small production boundaries are accurate, minimal, and ready to merge safely.

## Exact scope

### Authoritative documentation

Update `docs/PRD.md` and `docs/DESIGN.md` from the pre-polish concept to the accepted PORT-014–018 product:

- the menu bar is identity-only: Kernel mark, Ben Hutchinson, and Manchester, UK; it has no duplicated application navigation, role, or availability;
- the dock has exactly five application controls—About, Work, Career, Projects, Contact—plus GitHub, LinkedIn, and Download CV utility actions;
- Desktop owns a permanent compact Micro terminal as an optional expert path; it is not a sixth application or a draggable Command window;
- Work is a typed catalogue with reusable detail, stable `#work/<work-id>` hashes, and the accepted `#work/uv-ruff-migration` route;
- Work foregrounds problem, ownership, approach, rollout, outcome, result, and public-detail boundaries, with no Work technologies field, pills, or inventory;
- the default composition is Featured Work upper-right, Profile lower-left, Desktop shortcuts on capable viewports, and Micro terminal bottom-right, with no background statement;
- architecture/state/hash sections use the five-app model, `MicroTerminal`, `workItems`, `activeWorkId`, and Work detail routing. Remove obsolete `CommandWindow`/`CommandApp`, menu-navigation, Work-technologies, background-statement, and singleton-Work descriptions.

Preserve the recruiter-first positioning, exact professional claims, Career/Projects/Contact requirements, Portfolio OS visual language, accessibility rules, static `/ben-portfolio/` hosting, and historical command-centre plan/spec.

### Repository hygiene

- Add `.playwright-cli/` to `.gitignore`. Its name/size/checksum inventory may be recorded, but never edit, delete, move, or stage its local contents.
- Remove the tracked root `.DS_Store` from the Git index with `git rm --cached .DS_Store`. Its current local bytes must remain unchanged and the existing `.DS_Store` ignore rule remains.
- Remove every tracked `.playwright-mcp/` path from the index with `git rm -r --cached .playwright-mcp`; its already-ignored local diagnostic contents may remain.
- Delete the five obsolete tracked root screenshots: `hover-roster.png`, `runner-desktop-polish.png`, `runner-desktop-running-polish.png`, `runner-mobile-polish.png`, and `space-chamber-iteration.png`.
- Delete `public/cv/README.md`, `docs/ASSET_ATTRIBUTION.md`, `docs/ASSET_PIPELINE.md`, and `docs/PIXELLAB_MCP.md`.
- Preserve `public/cv/ben-hutchinson-cv.pdf`, production assets and visual baselines, `docs/superpowers/plans/2026-07-28-command-centre-portfolio-redesign.md`, and `docs/superpowers/specs/2026-07-28-command-centre-portfolio-redesign-design.md`.

### Verified dead-code removal

- Remove only `.appContent`, `.appContent > :first-child`, `.appContent > :last-child`, and `.eyebrow` from `src/shell/WindowLayer.module.css`.
- Remove unused `--duration-standard` from `src/styles/tokens.css`.
- Keep Motion's `useReducedMotion()` as Career's sole reduced-motion subscription; remove `usePrefersReducedMotion` from `CareerApp.tsx` and delete now-unreferenced `src/hooks/usePrefersReducedMotion.ts`.
- Remove the unused production export `TITLE_BAR_HEIGHT` from `src/utils/windowGeometry.ts` and its test-only import/assertion from `tests/unit/windowGeometry.test.ts`. Preserve `constrainWindowSize` and `clampWindowPosition` behavior and coverage.
- Remove unused `usage` and `description` properties from `CommandDefinition` and every registry entry. Preserve names, execution functions, help output, data-derived Work IDs, suggestions, and parser safety.
- Explicitly preserve `.blurb` in `src/apps/projects/ProjectsApp.module.css`; `ProjectsApp.tsx` uses `styles.blurb`.

### GitHub Actions pinning

Pin only the existing official Actions, with version comments, to these exact values:

```yaml
actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4
actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4
actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4
actions/download-artifact@d3f86a106a0bac45b974a628896c90dbdf5c8093 # v4
actions/upload-pages-artifact@7b1f4a764d45c48632c6b24a0339c27f5614fb0b # v4
actions/deploy-pages@d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e # v4
```

Do not change workflow triggers, permissions, jobs, commands, artifact names/paths, environments, or deployment behavior.

## Handoff sequence

1. Tester adds focused RED release-audit assertions and creates `docs/testing/PORT-019-release-hardening-report.md` with the manual/release charter.
2. Developer performs only this packet, runs focused and developer gates, and commits production/config/docs/deletions without modifying Tester-owned files.
3. Tester runs exact-head focused tests, typecheck, lint, coverage, build, bundle, full E2E, axe, no-update visuals, npm audits, merge-tree, manual/static checks, and a clean-status audit.
4. Product Owner accepts only current complete evidence with no open defect or scope drift.

## Excluded scope

- Any user-visible redesign, content claim, route/command behavior change, dependency/package-lock change, CSP or referrer-policy change, analytics, runtime API, or deployment.
- Removing or rewriting the historical command-centre plan/spec, Projects `.blurb`, production CV, project screenshots, or checked-in visual baselines.
- Updating visual baselines, weakening coverage/a11y assertions, or adding release-audit exclusions.
- Pushing, opening a PR, merging, publishing, or deploying.
- Modifying local `.DS_Store` bytes or any `.playwright-cli/` contents.

## Acceptance criteria

- [ ] PRD and DESIGN accurately describe the accepted identity-only menu, five-app dock/utilities, Desktop-only Micro terminal, technology-free Work catalogue/detail, and Work hashes; obsolete descriptions listed above are absent.
- [ ] `.DS_Store` and `.playwright-mcp/` are untracked and ignored; the local `.DS_Store` checksum is unchanged; `.playwright-cli/` is ignored and its local contents/checksum inventory is unchanged.
- [ ] The five root screenshots, four obsolete asset documents, and all tracked `.playwright-mcp/` entries are absent from the release tree; protected production assets, visual baselines, and historical command-centre plan/spec remain.
- [ ] Only the named dead code is removed. Career has one Motion reduced-motion subscription; window geometry behavior, command output/safety, and Projects `.blurb` are preserved.
- [ ] Both workflows use exactly the six approved SHA pins/comments and otherwise retain their existing behavior; `upload-pages-artifact` is v4.
- [ ] `package.json`, `package-lock.json`, and `index.html` are byte-for-byte unchanged from pre-task head `151456d`; therefore no dependency, CSP, or referrer change occurred.
- [ ] Focused RED precedes implementation. Final typecheck, lint, coverage, build, bundle, full E2E, axe, and no-update visual gates pass at one exact Tester head; all four coverage dimensions remain above 90% with checked-in 91% thresholds.
- [ ] `npm audit --audit-level=high` and `npm audit --omit=dev --audit-level=high` pass, `git merge-tree --write-tree master HEAD` reports no conflict, and no push/PR/merge/deploy occurs.
- [ ] Final `git status --short` is clean. `git status --short --ignored` may show only intentionally preserved ignored local artifacts/caches documented by the Tester; no protected local artifact was staged.

## Evidence contracts

### Tester RED

Extend `tests/unit/release-audit.test.ts` before implementation to assert the exact documentation, tracked-file, ignore, deletion/preservation, dead-code, Projects `.blurb`, workflow SHA/comment, and unchanged-file contracts above. Update `tests/unit/windowGeometry.test.ts` to remove the test-only `TITLE_BAR_HEIGHT` coupling while retaining public geometry behavior coverage. Record exact expected failures at pre-implementation head; do not edit production/config/docs.

### Developer handoff

Record changed files, deletion/index-only commands, before/after local artifact checksums/inventory, exact workflow pins, targeted searches, and current output for:

```bash
npm run typecheck
npm run lint
npm test -- tests/unit/release-audit.test.ts tests/unit/windowGeometry.test.ts tests/unit/parseCommand.test.ts tests/component/CareerApp.test.tsx tests/component/ProjectsApp.test.tsx
npm run build
npm run check:bundle
git diff --check
```

Commit implementation as `chore: harden portfolio release` without staging local ignored artifacts or Tester-owned files.

### Tester GREEN and release charter

At one exact head, record Node/npm/browser versions, commands, pass/skip/fail totals, coverage percentages, audit results, bundle bytes, visual baseline status, merge-tree result, and worktree/index/ignored-artifact evidence. Run:

```bash
npm run typecheck
npm run lint
npm run test:coverage
npm run build
npm run check:bundle
CI=1 PLAYWRIGHT_PORT=4243 npm run test:e2e
CI=1 PLAYWRIGHT_PORT=4244 npm run test:e2e:a11y
CI=1 PLAYWRIGHT_PORT=4245 npm run test:e2e:visual
npm audit --audit-level=high
npm audit --omit=dev --audit-level=high
git merge-tree --write-tree master HEAD
git diff --check
```

Do not update snapshots. Manually verify the production preview under `/ben-portfolio/` at 1440×1000, 1024×768, 390×844, and 320×568; direct Desktop/Work detail/Career/Project/Contact hashes and history; keyboard/focus/maximize/reduced-motion; Micro terminal Desktop-only behavior; CV/GitHub/LinkedIn actions; and unchanged visual baselines. Report every defect and retest. Product Owner acceptance requires no open defect.

## Product Owner acceptance

Accept only if every checklist item has exact-head Tester evidence, the final whole-change review is clean, the repository status contract is met, and the task contains no product/dependency/security-header/deployment drift.
