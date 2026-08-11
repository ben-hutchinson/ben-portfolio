# PORT-006 — Compose the recruiter-first desktop

Status: READY

Requirement links: [PRD §7](../PRD.md#7-approved-information-architecture), [PRD §8](../PRD.md#8-core-user-journeys), [PRD §9](../PRD.md#9-functional-requirements), [DESIGN §5](../DESIGN.md#5-shell-anatomy), [DESIGN §6](../DESIGN.md#6-window-system), [DESIGN §9](../DESIGN.md#9-responsive-behaviour), [DESIGN §14](../DESIGN.md#14-performance-and-delivery), [AGENTS §§8–13](../AGENTS.md#8-state-architecture), and [Implementation plan Task 6](../superpowers/plans/2026-08-11-portfolio-os-implementation.md#task-6-compose-the-recruiter-first-desktop).

User outcome: Within ten seconds and without clicking at 1440×1000, a recruiter understands Ben’s role, direction, location, availability, flagship impact, and has a one-action path to the next relevant evidence.

Dependencies: PORT-001 through PORT-005 are accepted. PORT-005’s non-blocking mobile `page-has-heading-one` P3 is closed by this packet.

## Scope and ownership

| File | Change | Responsibility |
| --- | --- | --- |
| `src/shell/Desktop.tsx` | Create the desktop work-area composition and shortcut region. | Developer |
| `src/shell/Desktop.module.css` | Create only the asymmetric desktop and responsive layout rules. | Developer |
| `src/shell/DesktopShortcut.tsx` | Create the semantic reducer-backed secondary application shortcuts. | Developer |
| `src/apps/about/AboutApp.tsx` | Create the canonical Profile application interior. | Developer |
| `src/apps/about/AboutApp.module.css` | Create readable Profile content styling. | Developer |
| `src/apps/work/FeaturedWork.tsx` | Create the bounded, evidence-led Featured Work preview. | Developer |
| `src/apps/work/FeaturedWork.module.css` | Create its editorial preview treatment. | Developer |
| `src/shell/WindowLayer.tsx` and `.module.css` | Mount the two new interiors and accept the Desktop composition seam without changing window-system contracts. | Developer |
| `src/shell/PortfolioShell.tsx` and `.module.css` | Compose `Desktop` around `WindowLayer`; retain existing landmarks and decorative background statement. | Developer |
| `src/shell/MenuBar.tsx` | Read the canonical profile location rather than a local duplicate. | Developer |
| `src/data/profile.ts` | Canonicalize `location` to exactly `Manchester, UK`. | Developer |
| `src/app/portfolioState.ts` | Amend initial/reset defaults only: keep About, Work, Command open; make About focused and last/topmost; establish the approved asymmetric default points. | Developer |
| `tests/component/Desktop.test.tsx` | Add recruiter-contract, shortcut, composition, and mobile-h1 tests. | Tester |
| `tests/component/PortfolioShell.test.tsx`, `tests/component/WindowLayer.test.tsx`, `tests/unit/portfolioReducer.test.ts` | Update only stale default-state/composition expectations. | Tester |
| `tests/e2e/recruiter-scan.spec.ts` | Add desktop/mobile recruiter journey, selectors, and accessibility coverage. | Tester |

The listed state amendment is authorized despite PORT-003’s earlier initial-focus/default-layout decision. No reducer action, action-union member, hash, or route is added or redefined.

## Locked composition and data contract

At 1440×1000 with a fine pointer, render one intentional, asymmetric composition:

- A vertical shortcut group sits left of the application cluster.
- Featured Work is upper-right and visibly exposes the exact flagship result.
- Profile is offset lower than Featured Work, distinct from a symmetric card grid.
- Command is lower-right.
- The existing low-contrast background statement remains decorative behind the composition.

Use the existing `DEFAULT_WINDOW_POSITIONS` as the only source of the amended initial/reset points. The resulting rendered relationships—not ad-hoc component-local positions—are: shortcuts left of Profile/Work, Work above Profile, and Command below/right of Profile. `createInitialPortfolioState()` and `RESET_LAYOUT` keep exactly `about`, `work`, and `command` open and unminimized; `focusedAppId` is `about`; `windowOrder` ends in `about`. Thus About is visual topmost at desktop and the sole default active normal-flow application at 390×844.

`AboutApp` reads only from `profile`; it owns the page’s only visible `h1`, exactly `profile.name`, at desktop and at 390×844. It visibly provides the typed role, location, availability, positioning/direction, and focus without inventing copy. Set `profile.location` to exactly `Manchester, UK`; `MenuBar` must render `profile.location`, never a literal duplicate.

`FeaturedWork` reads only from `flagshipWork`. It is an editorial evidence preview—not a metric/card grid—with one clear action to Work. `flagshipWork.result` is visibly rendered exactly once in the document at desktop default composition. Do not copy its sentence, annualise it, or add any new metric.

The zero-click recruiter contract at 1440×1000 is all of the following in the first viewport: `Ben Hutchinson`; exact role `Mid-level platform engineer`; `Manchester, UK`; typed availability; the backend-to-platform direction from `profile.positioning`; and exactly one visible occurrence of `Migrated 50+ repositories and reduced average build time by four minutes.` Work, Career, CV, GitHub, LinkedIn, and Contact each have a visible, keyboard-operable one-action path through the existing menu, dock, shortcut, or persistent external action.

## Interaction, accessibility, and visual rules

`DesktopShortcut` is a native button with `data-desktop-shortcut-app-id` and the exact accessible names `Open About`, `Open Career`, and `Open Work`. It dispatches the existing `{ type: 'OPEN_APP', appId }` action only; no shortcut writes a hash, owns local active state, or implements another transition. About/Work/Career shortcuts are optional secondary paths, never the only recovery/navigation path.

Retain PORT-005’s labelled non-modal sections, stable DOM/keyboard order, focus recovery, drag gate, dock, Reset Layout, and supported seven-hash boundary. The desktop composition changes no window action semantics. On mobile or coarse pointer, omit/hide shortcuts, show About as the sole default visible application, preserve ordinary scrolling and no overflow, and keep dock/external actions reachable.

Use the approved tactile mint/paper/Ink/yellow/coral palette, strong outlines, hard shadows, compact radii, bold display type, and readable production body sizes. The intended asymmetry is layered applications, not generic dashboard cards. Do not introduce glass, glow, gradients, command-centre/space visuals, copied operating-system marks, pixel art, commercial icon dependencies, or a generic equal-card grid.

## Explicit exclusions

- Full Career interior, stages, controls, range input, motion, and copy (PORT-007).
- Full Work case study, expanded evidence, and technical detail (PORT-008).
- Project, Contact, and Command application content; command parsing; desktop persistence; shortcuts beyond About/Career/Work.
- Window-frame/layer semantics, geometry, pointer drag mechanics, z-index algorithm, focus-recovery rules, supported hashes, reducer action union, routing adapter, and any breakpoint-specific reducer branch.
- New professional claims, location variants, duplicated canonical data, external URLs, router/state/icon dependencies, runtime fetches, or local storage.
- PORT-009 visual finish beyond the rules above.

## Tester RED → Developer GREEN → Tester evidence

### Tester RED gate

- [ ] Before production changes, add `Desktop.test.tsx`. It fails on the PORT-005 production shell and proves the zero-click desktop contract, one exact flagship result, one visible `h1`, canonical MenuBar location, asymmetric relationships, initial About topness, mobile About-only default, and shortcut action mapping.
- [ ] Update stale state/shell expectations to make the new initial-focus amendment observable: same three default open apps, About focused/topmost, no new route/hash/action.
- [ ] Add `recruiter-scan.spec.ts` against the production shell. At 1440×1000, assert the first-viewport contract, one-action Work → Desktop → Career → CV journey, and semantic selector coverage. At 390×844, assert About-only default, one visible `h1`, no shortcut requirement, dock recovery, natural scrolling, and no horizontal overflow.
- [ ] Record Node 24 command, baseline commit, expected failing assertion, and confirmation that no production file changed.

### Developer GREEN handoff

- [ ] Implement only the listed production files/seams; use typed `profile`, `flagshipWork`, and `externalLinks`, and keep all defaults in canonical state/data modules.
- [ ] Run focused Desktop/state/shell tests, `npm run typecheck`, `npm run lint`, `npm run build`, and record commit plus limitations without declaring Tester acceptance.

### Tester verification and manual charter

- [ ] Run focused tests, full `npm test`, `npm run test:coverage` with all four thresholds at least 91%, typecheck, lint, build, recruiter E2E, and relevant axe checks.
- [ ] At 1440×1000, perform a timed ten-second zero-click scan, then use mouse and keyboard to open Work, return Desktop, open Career, use CV/GitHub/LinkedIn/Contact, and verify focus/route recovery.
- [ ] At 390×844 with coarse/touch input and keyboard, start at Desktop and confirm About alone is visible with the one visible `h1`; switch through the dock; verify no drag, clipping, overlap, or horizontal overflow.
- [ ] Confirm the prior mobile `page-has-heading-one` axe P3 is closed with no serious or critical accessibility violation introduced.

## Acceptance criteria

- [ ] The 1440×1000 zero-click first viewport exposes every locked recruiter-contract item, including the exact flagship sentence exactly once and one-action paths to Work, Career, CV, GitHub, LinkedIn, and Contact.
- [ ] Desktop composition is asymmetric and ordered shortcuts-left / Work-upper-right / Profile-offset-lower / Command-lower-right; no generic cards or duplicate professional copy appear.
- [ ] Profile and Featured Work use only their canonical typed data; MenuBar reads the exact canonical `Manchester, UK` location.
- [ ] About is initially focused/topmost while the same three default apps remain open, and Reset Layout restores that state; no action/hash/reducer semantics change.
- [ ] `AboutApp` owns one visible `h1` for `profile.name` at 1440×1000 and 390×844, closing PORT-005’s mobile heading P3.
- [ ] About, Career, and Work shortcuts are secondary native controls using existing `OPEN_APP` actions; mobile has no shortcut dependency and initially shows only About.
- [ ] Desktop/mobile keyboard, focus, dock recovery, no-drag mobile access, ordinary scrolling, accessibility checks, and all 91% coverage gates pass.

## Evidence record

Tester RED evidence: Not yet run.

Developer GREEN evidence: Not yet run.

Tester verification: Not yet run.

Automated evidence: Not yet run.

Manual evidence: Not yet run.

Defects: PORT-005 mobile `page-has-heading-one` P3 is carried here for closure; no other defect recorded.

Product Owner decision: PENDING — READY packet issued; implementation awaits Tester RED evidence.
