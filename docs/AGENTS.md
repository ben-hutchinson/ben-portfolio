# Portfolio OS Implementation Guide for Agents

Date: 2026-08-11

This document defines repository-wide implementation expectations for the Portfolio OS redesign.

## 1. Mission

Replace the existing retro character-select portfolio with the approved Portfolio OS.

This is a greenfield product redesign. Reuse verified content, deployment configuration, and useful utilities where appropriate. Do not preserve the old interaction model merely because code already exists.

The target user is a recruiter or engineering manager hiring a mid-level platform engineer.

## 2. Source-of-Truth Order

When requirements conflict, use this order:

1. Direct user instruction
2. docs/PRD.md
3. docs/DESIGN.md
4. docs/SOUL.md
5. Existing implementation

The old command-centre specification and character-select documentation are historical context, not active requirements.

## 3. Non-Negotiable Product Invariants

- No intro gate, boot sequence, fake loading, or Press Start screen
- No character-select navigation
- No command-centre visual direction
- Portfolio OS is the primary shell
- Career is a dedicated kinetic application
- The desktop shows role and flagship impact immediately
- The command interface is optional
- All important content is reachable without dragging
- All important content is reachable without typing commands
- Mobile uses one active application at a time
- GitHub Pages static hosting remains supported
- Professional claims are never invented

The canonical flagship line is:

> Migrated 50+ repositories and reduced average build time by four minutes.

Do not annualise or extrapolate this metric without new user-supplied evidence.

## 4. Repository Assumptions

Current foundation:

- React
- TypeScript
- Vite
- Framer Motion
- CSS Modules
- GitHub Pages base path /ben-portfolio/

The implementation may replace the current src feature structure. Avoid layering the new shell on top of the old stage machine.

## 5. Required Quality Commands

Before handoff, run the relevant available commands:

- npm run build
- npm run typecheck
- npm run lint
- npm test, after a test script exists
- npm run test:e2e, after the end-to-end script exists

Do not claim success from an earlier run. Capture the current output after the final change.

## 6. Recommended Source Structure

Suggested structure:

- src/app
  - PortfolioRoot
  - portfolioReducer
  - hashState
- src/shell
  - PortfolioShell
  - MenuBar
  - Desktop
  - Dock
  - WindowLayer
  - WindowFrame
  - DesktopShortcut
- src/apps
  - about
  - work
  - career
  - projects
  - contact
  - command
- src/data
  - profile
  - career
  - work
  - projects
  - externalLinks
  - commands
- src/hooks
  - useHashNavigation
  - usePrefersReducedMotion
  - useWindowDrag
- src/styles
  - global.css
  - tokens.css
- src/utils
  - assets
  - focus
- tests
- public
- docs

Keep files focused. App.tsx should compose the root and not contain the desktop state machine.

## 7. State Architecture

Use a reducer or explicit state machine for shell state.

State should cover:

- Current hash-backed view
- Open applications
- Focused window
- Minimized applications
- Maximized application
- Window positions
- Active career stage
- Active project
- Command history needed for the current session

Application actions should be shared by dock controls, menu controls, desktop shortcuts, hashes, and commands. Do not implement separate navigation logic for each surface.

Do not persist window positions in the initial release. Persisting arbitrary positions creates recovery and breakpoint problems without improving the recruiter journey.

## 8. Component Boundaries

### PortfolioShell

Owns shell composition and reducer wiring.

### MenuBar

Owns identity, primary navigation, and status presentation.

### Desktop

Owns wallpaper, shortcuts, and default composition.

### WindowLayer

Owns stacking, focus, bounds, maximize, minimize, close, and reset.

### WindowFrame

Provides shared application chrome and semantics. It does not own application content.

### Dock

Dispatches application actions and exposes open or active state.

### CareerApp

Owns the kinetic career presentation and direct stage controls. Career content comes from typed data.

### CommandApp

Parses only known commands and dispatches ordinary shell actions. It never evaluates code or arbitrary input.

## 9. Styling Rules

- Define approved tokens once in src/styles/tokens.css.
- Use CSS Modules for component-specific styling.
- Use bold grotesk type for large statements.
- Use readable monospace type for interface labels.
- Use Ink borders and hard offset shadows.
- Use small radii for application chrome.
- Keep body copy at normal readable sizes.
- Treat the comparison prototype as a composition reference, not a source of production pixel values.

Do not introduce:

- Glassmorphism
- Generic dashboard cards
- Neon-on-black hacker styling
- Pixel fonts
- Starfields
- Command-centre panels
- Excessive rounded cards
- A design-system dependency that overrides the approved visual language

## 10. Interaction Rules

### Windows

- Drag only from the title bar.
- Use pointer capture.
- Constrain windows to a recoverable area.
- Revalidate after viewport changes.
- Raise focused windows predictably.
- Provide Reset Layout.
- Keep required actions independent of drag.

### Career

- Use a native range input.
- Provide direct year buttons.
- Support arrow keys.
- Update visible and accessible text together.
- Keep motion brief and cancellable.
- Preserve content with reduced motion.

### Commands

- Keep a typed command registry.
- Show visible suggestions.
- Return useful errors.
- Dispatch existing application actions.
- Never parse shell syntax or execute user-provided code.

## 11. Accessibility Gates

Every feature must pass these gates before it is considered complete:

- Keyboard operation
- Visible focus
- Logical focus order
- Correct control names
- No required drag gesture
- No required command entry
- Reduced-motion behaviour
- Colour contrast
- Touch target review
- Mobile content access

Non-modal windows should be labelled sections. Do not add dialog semantics or focus traps unless an actual modal blocks the rest of the interface.

Window position is presentation, not content. Screen-reader order remains stable regardless of z-index.

## 12. Responsive Rules

Wide screens may show multiple overlapping windows.

At narrower breakpoints:

- Reduce default overlap.
- Prefer one focused application.
- Disable free dragging when it harms usability.
- Convert the dock into a compact application switcher.
- Allow natural vertical scrolling.
- Keep Career controls usable.

Never restore root-level height and overflow rules that clip content on mobile.

## 13. Motion Rules

Use Framer Motion through LazyMotion for application transitions and Career stage changes.

Use CSS for direct hover, focus, and pressed states.

Avoid:

- requestAnimationFrame loops for decoration
- Mouse-following parallax
- Continuous ambient motion
- Scroll-jacking
- Long stagger sequences
- Animation that delays text

## 14. Content Integrity

- Keep canonical copy in typed data modules.
- Do not duplicate professional claims across JSX.
- Do not invent scale, revenue, adoption, reliability, or time-saved figures.
- Mark links as external where appropriate.
- Confirm every external URL before release.
- Preserve confidentiality by using high-level technical diagrams when necessary.

If a required claim is unclear, ask the user instead of guessing.

## 15. Static Hosting

- Preserve Vite base path /ben-portfolio/.
- Build all internal asset URLs from import.meta.env.BASE_URL or module imports.
- Use hash navigation rather than history routes.
- Core content must not depend on runtime fetches.
- Verify direct loading and asset resolution in the production preview.

## 16. Performance Gates

- No WebGL engine in the initial approved build.
- No persistent animation loop.
- Lazy-load non-default applications when beneficial.
- Keep initial JavaScript at or below 200 KB gzip where practical.
- Keep initial images at or below 1 MB.
- Optimise screenshots and responsive sources.
- Review layout shifts and font loading.

If a dependency is proposed, justify it against bundle cost, accessibility, and maintainability.

## 17. Testing Expectations

### Unit and component

- Reducer transitions
- Command parsing
- Hash parsing and serialization
- Career stage selection
- Window bounds and reset behaviour
- Reduced-motion branches

### Integration

- Dock, menu, shortcut, command, and hash actions converge on the same state
- Window minimize, maximize, close, restore, and focus
- Browser back and forward
- Missing image fallback
- Unknown command and hash recovery

### End to end

- Recruiter scan from Desktop to Work to CV
- Direct #career load
- Career keyboard journey
- Mobile application switching
- Keyboard-only primary journey
- GitHub Pages base-path smoke test
- Automated accessibility checks
- Visual snapshots at 390 by 844 and 1440 by 1000

## 18. Change Protocol

Before making a change:

1. Identify the relevant requirement in PRD.md and DESIGN.md.
2. Inspect current code and tests.
3. Add or update the smallest useful test.
4. Implement within the existing component boundary or improve that boundary if necessary.
5. Run proportionate verification.
6. Report user-facing impact and remaining risk.

Do not perform unrelated refactors.

## 19. Definition of Done

A change is done when:

- It satisfies the written requirement.
- It follows the Portfolio OS visual system.
- It is keyboard operable.
- It behaves correctly with reduced motion.
- It works at affected responsive sizes.
- Relevant tests pass.
- Build, type check, and lint pass.
- No unverified professional claim was added.
- No essential content became dependent on the desktop gimmick.
