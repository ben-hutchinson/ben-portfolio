# PORT-010 — Direct contact and optional command paths

Status: ACCEPTED

Requirement links: PRD §§8 and 13; DESIGN §§8, 10, and 13; SOUL Product Worldview; AGENTS §§8–13; implementation plan Task 10.

User outcome: A recruiter can contact Ben or download his CV immediately, while curious visitors can use a playful command palette without needing it to reach any portfolio content.

## Scope

- Contact exposes the canonical email, LinkedIn, GitHub, CV, Manchester location, and current availability.
- Command supports `help`, `about`, `work`, `career`, `projects`, `project <known-id>`, `contact`, `cv`, `reset`, and `clear` through a typed registry.
- Parsing normalizes case and whitespace, explains empty/missing/unknown input, suggests close commands, and treats shell-like text as inert.
- Commands dispatch the same portfolio actions as visible navigation; no typed route is command-only.
- Output history is bounded to 30 entries and `clear` removes it.
- Contact and Command remain semantic, keyboard-operable, responsive, and visually within the tactile Portfolio OS system.

## Excluded scope

- No terminal emulation, arbitrary code evaluation, shell execution, router, persistence, analytics, server, or new dependency.
- No invented contact or availability claims.

## Acceptance criteria

- [x] Direct `#contact` exposes all canonical details and checked-in CV download.
- [x] Every documented command returns the expected typed message/action/download/clear result.
- [x] Parser edge cases and prohibited execution paths are covered.
- [x] Visible controls reach every command destination.
- [x] Desktop and mobile have usable focus order, no horizontal overflow, and no serious/critical/contrast axe violation.
- [x] Full coverage remains above 91% in every metric; typecheck, lint, build, and focused E2E pass.

## Evidence

Developer implementation: `e10440e`. Developer gate: 144/144 tests; 98.64% statements, 93.52% branches, 98.54% functions, 99.55% lines; typecheck, lint, build, security source scan, and 3/3 applicable fresh-port browser cases passed. Visual evidence: `/private/tmp/portfolio-os-task10-contact-desktop.png`, `/private/tmp/portfolio-os-task10-command-desktop.png`, and `/private/tmp/portfolio-os-task10-mobile.png`.

Tester verification: PASS at `e10440e`. Focused 20/20 and full 144/144 tests passed; coverage was 98.64% statements, 93.58% branches, 98.54% functions, and 99.55% lines. Typecheck, lint, build, and 3/3 applicable fresh-port E2E passed. Independent desktop/mobile command, link, keyboard, history-cap, visible-navigation, overflow, and axe matrices passed with no blocking violation.

Product Owner decision: ACCEPTED — the direct recruiter path is complete and the command palette rewards exploration without becoming necessary navigation or adopting a hacker-terminal theme. No unresolved production defect remains.
