# PORT-011 — Responsive, accessible, recoverable Portfolio OS

Status: ACCEPTED

Requirement links: PRD §§9–10; DESIGN §§9, 11, and 13; SOUL Interaction Standard; implementation plan Task 11.

User outcome: The complete portfolio remains understandable and operable across desktop, tablet, mobile, keyboard, reduced-motion, zoom, and recoverable failure states.

## In scope

- Centralized media-query hooks with deterministic server/test defaults and listener cleanup.
- One active, naturally scrolling application below 768px; no drag or overlap requirement.
- Practical 44×44px targets, visible focus on every production surface, semantic landmarks/headings, keyboard parity, and no colour-only information.
- Reduced-motion parity for shell and Career transitions.
- A designed root error fallback retaining Ben's identity plus Contact, CV, and GitHub exits.
- Invalid hashes recover to Desktop with a non-blocking message; missing project media remains locally contained.
- Automated accessibility/responsive coverage and a manual matrix for 1440×1000, 1024×768, 768×1024, 390×844, and 320×568 across supported input/motion/browser combinations.

## Out of scope

- New routes, professional claims, persistence, modal semantics, focus traps, a router, new dependencies, or visual redesign.
- Performance budgets, CI, and deployment changes owned by PORT-012.

## Acceptance criteria

- [x] Skip link, landmarks, headings, Menu/Dock names, focus visibility, Career labels, keyboard paths, and reduced-motion paths are verified.
- [x] Below 768px exactly one application is active, drag is disabled, content scrolls naturally, and no fixed-height or horizontal clipping exists.
- [x] Required practical targets measure at least 44×44px at narrow/coarse layouts and 200% zoom remains usable.
- [x] Desktop/mobile axe checks have no serious, critical, or colour-contrast violations.
- [x] Invalid hash and root render failures provide useful recovery; optional media failures stay local.
- [x] Full tests, ≥91% coverage in every metric, typecheck, lint, build, and the manual charter pass.

Automated evidence: PASS at `2b75c87`. Full suite 147/147; coverage 98.68% statements, 93.00% branches, 98.61% functions, 99.57% lines; typecheck, lint, and build pass. Fresh committed Chromium accessibility/responsive E2E passed 6/6, including the 767px boundary, practical targets, 200% zoom, invalid-hash recovery, and axe gates.

Manual evidence: Core responsive, keyboard, recovery, and axe sweep passed in Chromium, Firefox, and WebKit. Exhaustive engine × viewport × input × motion permutations remain part of the final PORT-012/013 release matrix.

Defects: Round 1 corrected an inert root-fallback Contact hash, narrow target sizes, and 200% zoom overflow. Round 2 aligned the Menu target rule with the complete below-768px boundary. Both scoped re-reviews passed with no new Critical or Important issue.

Product Owner decision: ACCEPTED — spec compliance and task quality pass with no open blocker or major defect.
