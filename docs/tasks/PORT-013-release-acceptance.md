# PORT-013 — Final release audit and acceptance

Status: ACCEPTED — 2026-08-13

Requirement links: PRD §§6, 8–13; DESIGN §§14–15; SOUL §§Recruiter Contract, Interaction Standard, and Decision Rule; `docs/AGENTS.md` §§2, 4–6, 12, 15–18; implementation plan Task 13.

User outcome: The final Portfolio OS release is a clean, accurately documented, static GitHub Pages portfolio whose professional evidence, accessibility, visual character, and delivery gates have been re-verified at one final commit.

## In scope

- Audit `src/**`, `public/**`, `package.json`, and the deployed `dist` produced by the final build for reachable legacy product paths, dead dependencies, stale assets, exports, data, styles, and documentation claims.
- Require zero reachable legacy intro, character-select, mission/runner, audio, space/starfield, pixel-game, or command-centre product paths. Historical planning/documentation may mention them only when clearly labelled historical.
- Preserve the approved Portfolio OS: no new feature, layout, interaction model, content structure, framework, hosting mode, or professional claim is authorized by this task.
- Update `README.md` so a new contributor can install, run, test, build, preview, understand the current architecture, and understand GitHub Pages deployment at the exact `/ben-portfolio/` base path.
- Re-run final clean-install, static-budget, browser, accessibility, visual, and manual evidence at the final commit; update `docs/testing/release-report.md` with only current-commit results.
- Perform final Product Owner acceptance against every PRD success criterion, the four PRD §8 journeys, all DESIGN §15 visual checks, SOUL’s recruiter/clarity standards, and the no-invented-claims invariant.
- Complete the PORT-012 carried manual follow-up: a full assistive-technology narration sweep, not only automated axe/semantic checks. **Disposition: WAIVED BY USER on 2026-08-13; this is an explicit direct-user scope decision, not a passing narration result.**

## Prior disposition and protected assets

PORT-012 is accepted at `d25ec9f`. It pulled forward deletion of deployable legacy assets because Vite copies all of `public` and the files violated PORT-012’s active non-hero image budget. That deletion is already resolved, but this task must audit the resulting tree and `dist` again to ensure no reachable legacy path remains and no needed asset was removed.

Do not remove or alter without separate Product Owner direction:

- `public/cv/ben-hutchinson-cv.pdf`;
- `public/favicon.svg`;
- verified project media `public/assets/ui/project-pokeleximon.webp` and `public/assets/ui/project-safelog.webp`;
- canonical typed professional evidence and verified external links.

The existing accepted static-delivery configuration remains in force: Vite base `/ben-portfolio/`, hash navigation (no rewrite), no runtime content API, manifest-aware bundle/image checks, Node 24 quality workflow, and least-privilege Pages deployment from the default `master` branch only.

## Out of scope

- Product redesign, visual restyling, new applications, feature work, new dependencies, framework changes, server runtime, CMS, analytics, routing changes, Pages rewrites, or performance-budget relaxation.
- New professional claims, changed metrics, extrapolated results, unverified links, or confidential detail. The canonical flagship result remains: “Migrated 50+ repositories and reduced average build time by four minutes.”
- Restoring any deleted legacy art, audio, character, pixel-game, mission, or command-centre material merely to preserve historical files.
- Treating an automated axe pass as a substitute for the required assistive-technology narration sweep.

## Developer responsibilities

- Audit with targeted searches and final production output. Start with:

  ```bash
  rg -n "character-select|mission-runner|IntroScreen|LoadingScreen|AudioManager|starfield|command centre" src package.json
  npm run build
  ```

  The first command must produce no product-code matches. Do not use a documentation-only historical match to justify a source/package match. Inspect `dist` and public-file references after the build; remove only genuinely unreachable later-introduced dead production material while preserving the protected assets above.

- Update `README.md` to accurately cover:
  - Node 24 and clean install with `npm ci`;
  - development and production preview, including `http://127.0.0.1:4173/ben-portfolio/` (or a documented `PLAYWRIGHT_PORT` equivalent);
  - every current quality command: typecheck, lint, unit tests, coverage, build, bundle/image check, full Playwright, accessibility, and visual commands;
  - the current React/TypeScript/Vite/CSS Modules/Motion/context-reducer/Playwright architecture at a useful high level;
  - static GitHub Pages deployment: exact `/ben-portfolio/` base, hash URLs, `dist` artifact only, quality-before-upload, `master`-only deployment, and no server rewrites/runtime content API.
- Keep the change set audit/documentation-focused. If the audit reveals a user-visible defect, report it to the Tester/Product Owner rather than redesigning the product around it.
- Record the exact commands, outputs, commit, files removed (if any), and rationale in the Developer handoff. Run focused checks appropriate to any bounded cleanup and all required developer quality commands before handoff.

## Tester responsibilities

### Automated final gate

From a clean install at the final candidate commit, run exactly:

```bash
npm ci
npm run typecheck
npm run lint
npm run test:coverage
npm run build
npm run check:bundle
npm run test:e2e
```

Require every command to exit 0. Coverage must report at least 91% for statements, branches, functions, and lines. The build must retain the exact `/ben-portfolio/` base and emit a valid manifest. `check:bundle` must pass the 204,800-byte initial-JavaScript gzip limit, 1MB initial-image limit, and `<350KB` deployable non-hero image limit.

Record exact output, environment, browser versions, `PLAYWRIGHT_PORT` when used, and the final commit hash. Do not reuse PORT-012 results from an earlier commit.

### Legacy and static audit

- Re-run the exact legacy search in the Developer section against `src` and `package.json`; require no product-code match.
- Inspect source/public/dist references to confirm the deleted legacy deployable assets remain absent or unreachable, the protected CV/favicon/project media remain present, and no stale dependency/export/CSS/data entry exposes the previous product.
- Verify there is no runtime `fetch`/XHR dependency for core content, no root-absolute local asset regression, and no server rewrite assumption.

### Direct hashes and four PRD journeys

Use the production preview beneath `/ben-portfolio/`; hard-reload every route, verify the expected application/content, refresh, and use browser history where relevant:

| Hash | Required result |
| --- | --- |
| `#desktop` | Recruiter evidence, role, flagship result, primary navigation, and direct actions are clear without a drag or command. |
| `#work` | The SKAO case file exposes context, friction, ownership, technical approach, rollout, result, technologies, and honest public-detail boundary. |
| `#career` | All four stages, native range, direct year controls, arrows, readable non-animated content, and window recovery are available. |
| `#projects` | Both unequal project case studies and their verified media/actions are available. |
| `#projects/pokeleximon` | Pokeleximon detail, purpose/system shape, technologies, links, image fallback, refresh, and history work. |
| `#projects/safelog` | Safelog detail, purpose/system shape, technologies, links, image fallback, refresh, and history work. |
| `#contact` | Email, LinkedIn, GitHub, CV, location, and availability are present and verified. |

Execute and record the PRD §8 recruiter scan, hiring-manager evaluation, explorer journey, and each direct-link journey. Confirm that keyboard navigation, dock/menu/shortcut/command convergence, back/forward, invalid-hash recovery, optional image failure, reduced motion, and no-drag/no-command equivalents remain correct.

### Manual and assistive-technology follow-up

Re-run every row of `docs/testing/manual-test-charter.md` on the final production preview at its listed desktop/mobile viewports, browsers, normal/reduced motion, touch/keyboard, and 200% zoom. Record the mandated environment and artifact details in `docs/testing/release-report.md`.

The carried PORT-012 follow-up requires a real narration sweep with VoiceOver, NVDA, or an equivalent available assistive technology. Cover all seven hashes and inspect landmarks, the route-specific h1 and heading sequence, Menu/Dock/current-state narration, titlebar/window labels, skip-link/focus behaviour, Career range value and direct-year state, project image fallback, invalid-hash recovery, and external/CV action names. Record the screen reader, browser, operating system, route, observed narration, and pass/fail result. A semantic/axe-only result is insufficient.

### Release report

Replace stale evidence in `docs/testing/release-report.md` with the final tested commit and include:

- all required command outputs and all four coverage percentages;
- per-browser/project Playwright results, intentional skips, and any focused retest;
- clean-install, bundle, image, asset, manifest, base-path, and workflow evidence;
- final visual-baseline result and manual-charter/narration evidence;
- Lighthouse/mobile LCP evidence or a newly recorded, bounded blocking defect if it cannot be reproduced;
- every discovered defect with severity, reproduction, expected result, actual result, requirement, owner, evidence, and retest result;
- known accepted low-severity risks, if any.

## Product Owner acceptance checklist

Accept only when the Tester passes the final candidate commit and every item below is evidenced.

### PRD §6 success criteria

- [x] A first-time visitor identifies Ben as a mid-level platform engineer within ten seconds.
- [x] The 50+ repositories/four-minute build result is visible without opening an application.
- [x] Career, Work, Projects, CV, and Contact are each reachable with one clear action.
- [x] The desktop is tactile and distinctive.
- [x] Career.app feels integrated with the Portfolio OS.
- [x] Every important task is keyboard-operable and independent of dragging.
- [x] The full professional story is available on mobile.
- [x] The site is fast and stable on GitHub Pages.
- [x] Reduced motion and optional asset failure preserve the experience.

### DESIGN §15 visual acceptance

- [x] First view unmistakably reads as a designed operating system.
- [x] The interface does not copy a specific commercial OS.
- [x] Mint, paper, ink, orange, and yellow dominate the shell.
- [x] Hard shadows and crisp borders provide tactility.
- [x] Body copy remains comfortably readable at production scale.
- [x] Default windows are composed, not randomly scattered.
- [x] Career is bolder but remains part of the same product.
- [x] The flagship metric is visible on Desktop and in Career or Work.
- [x] Mobile preserves the application metaphor without overlap chaos.
- [x] No legacy pixel-game or command-centre styling/path remains.

### Final release conditions

- [x] Every listed clean-install command and quality gate passes at the final candidate (`59ee4da`); the full non-AT browser/visual matrix ran at `acaeca3`, whose only later product delta is a README clarification.
- [x] All seven direct hashes, refresh, and history behaviour pass beneath `/ben-portfolio/` with no local resource/console/page errors or runtime content API.
- [x] The README reflects the locked stack, current architecture, quality commands, production preview, and static Pages deployment.
- [x] The manual-charter scenarios are recorded in the Tester matrix. The required assistive-technology narration sweep is **WAIVED BY USER**, not passed.
- [x] No blocker or major defect remains, no professional claim is invented, and the accepted minor risk is explicit.
- [x] The Tester report is a GREEN / ACCEPTED CANDIDATE for `59ee4da`; this packet records the final Product Owner `ACCEPTED` decision. The report wording is retained per the direct user instruction not to edit it further.

Automated evidence: `a8cd5fd` (`test: verify PORT-013 release`) records clean `npm ci`, typecheck, lint, coverage (98.72% statements, 92.60% branches, 98.63% functions, 99.58% lines), build, bundle/image, Playwright (41 passed, 124 intentional guarded skips, 0 failed), and visual gates. The deployable product candidate is `59ee4da`; its only change after the full matrix commit `acaeca3` is a README-only correction.

Manual evidence: The final production matrix records recruiter, hiring-manager, explorer, direct-hash, keyboard, recovery, reduced-motion, image-fallback, 200% zoom, responsive, visual, and axe coverage. The real VoiceOver/NVDA-equivalent narration sweep was not run: **WAIVED BY USER on 2026-08-13**.

Defects: No blocker or major defect remains. Accepted minor risk: the waived assistive-technology narration sweep remains an unexecuted follow-up for any future release. This waiver is a direct-user scope decision, not evidence of assistive-technology narration compliance.

Product Owner decision: **ACCEPTED.** The final tester report at `a8cd5fd` passes all non-assistive-technology release gates for the `59ee4da` candidate, including the PRD §8 journeys, PRD §6 outcomes, DESIGN §15 visual acceptance, SOUL recruiter/clarity contract, static Pages delivery, and no-invented-claims invariant. The user explicitly waived only the carried narration sweep; no further product, test, or report edits are authorized or required for this acceptance.
