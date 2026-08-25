# Release Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the accepted Portfolio OS documentation, repository tree, dead-code boundary, and GitHub Actions references without changing product behavior, dependencies, or deployment.

**Architecture:** Treat this as one release-boundary task: Tester first codifies the approved tree/source/workflow contracts, Developer applies only audited removals and documentation/config changes, and Tester certifies the exact combined head. No application interface is added; public runtime behavior remains the accepted PORT-018 release.

**Tech Stack:** Node.js 24 LTS, React 19.2, TypeScript 6, Vite 8, CSS Modules, Motion, Vitest/V8 coverage, Playwright/axe, GitHub Actions, and static GitHub Pages under `/ben-portfolio/`.

**Spec:** docs/tasks/PORT-019-release-hardening.md

**Status:** ACCEPTED — 2026-08-25 at Tester report commit `62f7efb` for exact code-and-tests candidate `43c1e6c6f646bebd58e7c0121fb559aa03fabf87`.

## Global Constraints

- Pre-task authoritative head is `151456d`; `package.json`, `package-lock.json`, and `index.html` must remain byte-for-byte unchanged from it.
- Preserve all accepted PORT-014–018 user-visible behavior and exact professional copy.
- Remove `.DS_Store` and `.playwright-mcp/` from the index only; preserve local `.DS_Store` bytes, never touch `.playwright-cli/` contents, and add `.playwright-cli/` to `.gitignore`.
- Preserve `src/apps/projects/ProjectsApp.module.css` `.blurb`, production assets/baselines, and the historical command-centre plan/spec.
- Use only the six exact official Action SHAs/comments in the spec. Do not change triggers, permissions, jobs, commands, artifacts, environments, or deploy behavior.
- No dependency, CSP, referrer, product behavior, route, command-output, coverage-threshold, visual-baseline, push, PR, merge, publish, or deploy change.

---

### Task 1: Release documentation, hygiene, dead code, and workflow pins

**Files:**

- Create (Tester): `docs/testing/PORT-019-release-hardening-report.md`.
- Modify: `docs/PRD.md`, `docs/DESIGN.md`, `.gitignore`, `.github/workflows/quality.yml`, `.github/workflows/gh-pages.yml`, `src/shell/WindowLayer.module.css`, `src/styles/tokens.css`, `src/apps/career/CareerApp.tsx`, `src/utils/windowGeometry.ts`, and `src/apps/command/commandRegistry.ts`.
- Delete: `src/hooks/usePrefersReducedMotion.ts`, five named root PNGs, `public/cv/README.md`, `docs/ASSET_ATTRIBUTION.md`, `docs/ASSET_PIPELINE.md`, and `docs/PIXELLAB_MCP.md`.
- Remove from index only: `.DS_Store` and all 16 tracked `.playwright-mcp/` paths.
- Modify/Test (Tester): `tests/unit/release-audit.test.ts`, `tests/unit/windowGeometry.test.ts`, plus any focused existing tests required to preserve Career/command/Projects behavior.
- Preserve unchanged: `src/apps/projects/ProjectsApp.module.css` `.blurb`, `package.json`, `package-lock.json`, `index.html`, production assets/baselines, and both historical command-centre plan/spec files.

**Interfaces:**

- Consumes: accepted PORT-018 application interfaces; `CareerApp`'s Motion `useReducedMotion(): boolean | null`; `constrainWindowSize(size, workArea): WindowSize`; `clampWindowPosition(candidate, fallback, size, workArea): Point`; `CommandDefinition.name` and `execute(args): CommandResult`; existing workflow behavior.
- Produces: the same runtime interfaces, except `CommandDefinition` becomes exactly `{ readonly name: string; execute(args: readonly string[]): CommandResult }`; `TITLE_BAR_HEIGHT` and `usePrefersReducedMotion` cease to be exported. Repository/docs/workflows satisfy every PORT-019 static contract.

- [x] **Step 1: Tester writes and commits focused RED release contracts**

  Add a `PORT-019 release hardening` block to `tests/unit/release-audit.test.ts`. Use `execFile('git', ['ls-files'])` through `promisify`, `readFile`, and `stat`/ENOENT checks to assert:

  - exact PRD/DESIGN accepted phrases and absence of obsolete menu navigation, Command-window, background-statement, and Work-technologies descriptions;
  - `.playwright-cli/` in `.gitignore`; no tracked `.DS_Store`, `.playwright-mcp/`, five named root PNGs, or four obsolete documents; protected CV/assets/baselines and both historical command-centre files present;
  - no named dead selectors/token/hook/export/metadata, while Projects CSS contains `.blurb` and `ProjectsApp.tsx` contains `styles.blurb`;
  - exact workflow strings `uses: <approved SHA> # v4`, with no remaining movable official Action tags;
  - `package.json`, `package-lock.json`, and `index.html` equal `git show 151456d:<path>`.

  Remove only the `TITLE_BAR_HEIGHT` import and its title-bar-specific test from `tests/unit/windowGeometry.test.ts`; keep all public geometry assertions. Create the Tester report with the viewport/hash/history/keyboard/maximize/reduced-motion/static/actions/audit/merge-tree/status charter. Run:

  ```bash
  npm test -- tests/unit/release-audit.test.ts tests/unit/windowGeometry.test.ts tests/unit/parseCommand.test.ts tests/component/CareerApp.test.tsx tests/component/ProjectsApp.test.tsx
  ```

  Expected RED is limited to the approved pre-hardening docs/tree/dead-code/workflow contracts. Commit Tester files only as `test: specify release hardening`.

- [x] **Step 2: Developer applies the bounded hardening implementation**

  Before index operations, record `shasum .DS_Store` and a name/size/checksum inventory of `.playwright-cli/` without changing its files. Then use `git rm --cached .DS_Store` and `git rm -r --cached .playwright-mcp`; do not delete either local artifact. Add `.playwright-cli/` to `.gitignore`. Use `git rm` for only the five root PNGs and four obsolete documents named in the spec.

  Update PRD/DESIGN to the exact accepted behavior in the spec. In `CareerApp`, retain `const reducedMotion = useReducedMotion() === true;`, remove the custom-hook import/subscription, and delete its now-unreferenced hook file. Remove only the named CSS/token/export/test metadata and retain Projects `.blurb`. Simplify every command definition to `{ name, execute }` without changing execution/output.

  Replace each workflow Action value with the exact SHA plus `# v4`; make no other workflow edit. Confirm `upload-pages-artifact` moves from v3 to the supplied v4 SHA.

- [x] **Step 3: Developer verifies and commits**

  Run the focused command from Step 1, then typecheck, lint, build, bundle, and `git diff --check`. Verify no `usage`, `description`, `TITLE_BAR_HEIGHT`, `usePrefersReducedMotion`, named dead CSS, or `--duration-standard` remains; verify `styles.blurb`/`.blurb` remains; verify the local `.DS_Store` checksum and `.playwright-cli/` inventory match Step 2; verify `git diff 151456d -- package.json package-lock.json index.html` is empty. Commit only implementation/config/docs/deletions as `chore: harden portfolio release`.

- [x] **Step 4: Tester performs exact-head GREEN and release certification**

  Re-run focused tests, then run the full commands in the packet: typecheck, lint, coverage, build, bundle, full E2E on port 4243, axe on 4244, no-update visuals on 4245, both npm audits, `git merge-tree --write-tree master HEAD`, and `git diff --check`. Do not update baselines.

  Complete the four-viewport production-preview charter and all route/history/keyboard/maximize/reduced-motion/Micro-terminal/external-action checks. Record exact commits, versions, pass totals, coverage, bundle, audits, workflow pins, merge tree, unchanged files, local-artifact preservation, and `git status --short` clean; ignored output may contain only documented local caches/artifacts. Commit only Tester report/test maintenance as `test: certify release hardening`.

- [x] **Step 5: Product Owner accepts or issues one bounded change request**

  Compare the exact Tester head against every PORT-019 criterion. Accept only with a clean final review, no open defect, exact SHA pins, unchanged product/dependency/security-header behavior, clean ordinary status, and preserved ignored local artifacts. Mark packet/plan accepted and commit only PO docs as `docs: accept release hardening`; otherwise return an exact criterion-linked change request.

## Decision log

| Decision | Rationale | Status |
| --- | --- | --- |
| One bounded task | All changes harden the same accepted release boundary and require one combined regression gate. | ACCEPTED |
| Index-only `.DS_Store`/`.playwright-mcp/` removal | Removes machine artifacts from releases while preserving local evidence, especially `.DS_Store` bytes. | ACCEPTED |
| Ignore but never touch `.playwright-cli/` | It is local tool output outside product/release scope. | ACCEPTED |
| Keep Motion reduced-motion source | Career already uses Motion; removing the duplicate custom subscription avoids two listeners without changing behavior. | ACCEPTED |
| Remove `TITLE_BAR_HEIGHT` and command metadata | Audit proves they are production/test coupling or unused data, not public behavior. | ACCEPTED |
| Preserve Projects `.blurb` and historical command-centre docs | Both are verified useful: `.blurb` is live UI and the plan/spec are intentional history. | ACCEPTED |
| Pin official Actions to supplied SHAs | Immutable references harden CI while comments retain readable version intent. | ACCEPTED |
| Accept candidate `43c1e6c` at report `62f7efb` | All automated, manual, shallow-checkout, artifact-integrity, review, and clean-status gates are green with no open defect. | ACCEPTED |
