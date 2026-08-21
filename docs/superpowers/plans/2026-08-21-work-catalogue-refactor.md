# Work Catalogue Refactor Implementation Plan

> **For agentic workers:** Follow `docs/AGENTS.md`'s required Product Owner → Tester → Developer → Tester → Product Owner loop. Do not begin production work until the Tester has recorded focused RED evidence for PORT-018.

**Goal:** Turn Work from a one-off flagship rendering into a typed professional-work catalogue with reusable case-study detail and stable shareable Work hashes.

**Architecture:** Reuse the proven Projects catalogue/detail route pattern, but keep Work evidence distinct: records come from `workItems`, Work IDs are inferred from that collection, the reducer and hash adapter validate against derived IDs, and the Desktop card resolves its flagship from the first Work item. Work remains one existing window-managed application; no router, server, dependency, or alternate navigation system is introduced.

**Tech stack:** Existing Node 24, React 19.2, strict TypeScript 6, Vite 8, CSS Modules, `useReducer`/context, native hash navigation, Vitest/Testing Library, Playwright/axe, and static GitHub Pages at `/ben-portfolio/`.

## Global constraints

- Source of truth order remains user instruction → `docs/PRD.md` → `docs/DESIGN.md` → `docs/SOUL.md` → implementation.
- Preserve the exact approved uv/ruff migration copy and confidentiality boundary. Never add professional claims or Work technology pills.
- Preserve the accepted tactile Portfolio OS visual language, five-app window model, optional allow-listed terminal, and mobile one-active-app behaviour.
- Hashes are exact/case-sensitive and static-host-safe. Work IDs/routes are data-derived; Project routing is out of scope.
- No new dependency, router, CMS, server, runtime fetch, analytics, WebGL, or deployment change.
- Coverage thresholds stay checked in at 91%; statements, branches, functions, and lines must all be above 90% at the exact Tester head.
- Never modify/stage `.DS_Store` or `.playwright-cli/`.

## File map

**Create**

- `src/apps/work/WorkDetailApp.tsx` — reusable selected Work case-study renderer.
- `src/apps/work/WorkDetailApp.module.css` only if the existing module cannot cleanly own detail styles without a misleading name.
- `docs/tasks/PORT-018-work-catalogue.md` — Product Owner acceptance packet.

**Modify**

- `src/data/models.ts` — Work record ID contract.
- `src/data/work.ts` — non-empty typed `workItems`, derived `WorkId`/accepted IDs, derived flagship compatibility export if needed.
- `src/app/portfolioState.ts` — Work detail route and selected Work state.
- `src/app/portfolioReducer.ts` — `SELECT_WORK` and derived Work validation/state transitions.
- `src/app/hashState.ts` — exact dynamic Work hash parse/serialize.
- `src/apps/work/WorkApp.tsx`, `src/apps/work/WorkApp.module.css` — collection-mapped catalogue.
- `src/apps/work/FeaturedWork.tsx` — derived flagship and direct detail selection.
- `src/apps/command/commandRegistry.ts` — optional typed Work ID command argument.
- `src/shell/WindowLayer.tsx` — Work catalogue/detail content and full-size route handling.
- Tester-owned focused unit/component/e2e/a11y coverage determined by the Tester.

## Task flow

- [x] **1. Product Owner: ready packet and decisions**

  Confirm `docs/tasks/PORT-018-work-catalogue.md` is ready; record all scope, route, copy, accessibility, responsive, exclusions, and evidence requirements. This plan and packet are documentation-only Product Owner output.

- [ ] **2. Tester: focused RED acceptance coverage**

  Extend content, hash/reducer, command, Work/Desktop/WindowLayer, and Work browser/a11y coverage. Prove the singleton old implementation cannot pass collection, direct-detail hash, selection/back, and command-ID expectations. Record exact RED commands and causes; do not edit production files.

- [ ] **3. Developer: introduce canonical typed Work data**

  In `src/data/work.ts`, model the initial case with ID `uv-ruff-migration`; infer `WorkId` from `workItems` and derive valid runtime Work IDs. Preserve exact current professional strings, empty links, no Work technologies, and a data-backed Outcome string. If retained, `flagshipWork` is a derived alias to the first collection item only.

- [ ] **4. Developer: extend state and hashes without a second Work ID list**

  Add `{ kind: 'workDetail'; workId: WorkId }`, `activeWorkId`, and `SELECT_WORK`. Update route equality, target resolution, navigation/open/minimize/maximize/close/reset behaviour, and `WindowLayer` route detection/size to treat both Work routes as the same Work application. Parse/serialize only exact `#work/<derived-id>` values; malformed/unknown values retain the established Desktop recovery. Keep other hash semantics unchanged.

- [ ] **5. Developer: render reusable catalogue/detail and entry points**

  Make `WorkApp` map `workItems` and make `WorkDetailApp` find/render the selected record. Use semantic headings, labelled open/back buttons, and current data fields. Make Desktop Featured Work derive the first record and dispatch `SELECT_WORK`; map `work` to catalogue and `work <derived-id>` to detail in the allow-listed command registry. Add only responsive, tactile CSS necessary for the new catalogue.

- [ ] **6. Developer: self-verification handoff**

  Run current typecheck, lint, listed focused tests/Chromium, build, bundle, and `git diff --check`. Record current output, changed production files, and no-touch protected-artifact audit. Do not edit Tester coverage while making GREEN.

- [ ] **7. Tester: GREEN automation and manual charter**

  Run focused/full coverage and relevant E2E/axe at fresh ports; verify direct hashes/reload/history, command/open/back, keyboard/focus, reduced motion, 1440×1000/1024×768/390×844/320×568 layout, no overflow, `/ben-portfolio/`, and regression sentinels. Return a defect report or exact-head pass evidence.

- [ ] **8. Product Owner: acceptance**

  Compare exact Tester evidence to PORT-018. Mark its checkboxes/decision log and packet status accepted only with no open defect and no scope drift; otherwise issue a narrow Developer change request.

## Decision log

| Decision | Rationale | Status |
| --- | --- | --- |
| Treat this as a bounded refactor, not a new application | Projects already establishes the matching catalogue/detail and hash/window pattern; Work reuses those existing seams. | Approved by user |
| Use `workItems` with inferred `WorkId` | Future records should not require synchronised reducer/hash/command ID edits. | Approved by user |
| Keep uv/ruff first and derived as flagship | It preserves the recruiter-first SKAO evidence while allowing additional professional work later. | Approved by user |
| Use `#work` for catalogue and `#work/uv-ruff-migration` for detail | Catalogue is the durable discoverability route; direct detail is shareable and recruiter-efficient. | Approved by user |
| Keep `work` command as catalogue, add optional ID | The terminal remains optional but mirrors the direct route without inventing a second command surface. | Planned |
| Keep Work tags/technologies absent | PORT-016 accepted their removal; a case study should foreground evidence rather than tool inventory. | Locked regression |
| Leave Project IDs/routing unchanged | The user approved Work extensibility; unrelated refactoring adds risk without improving the requested path. | Excluded |
