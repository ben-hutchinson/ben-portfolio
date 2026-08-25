# Portfolio OS Product Requirements

Date: 2026-08-11

Status: Approved concept; written specification awaiting user review

Owner: Ben Hutchinson

## 1. Product Vision

Create a greenfield portfolio for Ben Hutchinson that wins mid-level platform-engineering interviews.

The portfolio is presented as a modern, tactile operating system. The main desktop provides immediate professional positioning and fast access to evidence. Focused applications present work, career, projects, and contact information. Career is a dedicated, maximizable application built around a kinetic timeline scrubber.

The experience must be memorable because its interaction model reinforces Ben's platform-engineering story, not because it obstructs the content.

## 2. Positioning

Primary role:

- Mid-level platform engineer

Supporting positioning:

- Backend engineer moving deeper into platform engineering
- Production-minded systems builder
- Developer-experience and internal-tooling advocate
- Engineer who removes friction and creates reliable paths for teams

Primary evidence statement:

> Migrated 50+ repositories and reduced average build time by four minutes.

This statement must appear on the initial desktop and inside the relevant work detail.

## 3. Audience

### Primary

- Technical recruiters screening platform-engineering candidates
- Engineering managers hiring mid-level platform engineers
- Platform, SRE, infrastructure, and developer-experience engineers evaluating technical judgement

### Secondary

- Backend-engineering hiring teams
- Professional peers
- Open-source users evaluating Ben's personal projects

## 4. User Problem

Most portfolios either present a generic grid of projects or prioritize novelty over evidence. Ben needs a portfolio that:

- Establishes platform-engineering relevance immediately
- Demonstrates ownership and measurable impact
- Makes professional and personal work easy to inspect
- Shows technical creativity without looking junior or gimmicky
- Remains accessible and fast on GitHub Pages

## 5. Product Principles

### Evidence is always one action away

The visitor never needs to complete an intro, enter a command, or understand the desktop metaphor before seeing meaningful proof.

### Interaction expresses the work

Windows, applications, commands, and the dock represent bounded tools and paved roads. The metaphor supports the positioning.

### Two valid browsing modes

Explorers can drag windows, use the Desktop-owned Micro terminal, scrub the career timeline, and open applications. Scanners can use desktop shortcuts, the dock, keyboard, or direct hash links.

### Professional content is canonical

The playful shell never changes, hides, or fictionalizes career and project evidence.

### Static by design

The production site requires no server runtime or runtime content API.

## 6. Success Criteria

The redesign succeeds when:

1. A first-time visitor identifies Ben as a mid-level platform engineer within ten seconds.
2. The 50+ repository and four-minute build-time result is visible without opening an application.
3. Career, work, projects, CV, and contact are reachable with one clear action.
4. The Portfolio OS feels tactile and distinctive on desktop.
5. Career.app feels like a special, integrated application rather than a separate visual theme.
6. Every important task is possible by keyboard and without dragging.
7. The full professional story remains available on mobile.
8. The site remains fast and stable on GitHub Pages.
9. The interface works with reduced motion and when optional assets fail.

## 7. Approved Information Architecture

The portfolio contains one Desktop shell and five primary applications:

1. About
2. Work
3. Career
4. Projects
5. Contact

The dock has exactly five application controls—About, Work, Career, Projects, Contact—plus GitHub, LinkedIn, and Download CV utility actions.

### Desktop

The identity-only menu bar contains the Kernel mark, Ben Hutchinson, and Manchester, UK; it has no duplicated application navigation, role, or availability. The default Desktop composition has Featured Work upper-right, Profile lower-left, Desktop shortcuts on capable viewports, and a permanent compact Micro terminal bottom-right. The Micro terminal is an optional expert path, not a sixth application or a draggable window. There is no background statement.

There is no splash screen, boot sequence, loading bar, character selection, or artificial delay.

### Work application

Work is a typed catalogue with reusable detail and stable `#work/<work-id>` hashes, including the accepted `#work/uv-ruff-migration` route. It foregrounds Problem, ownership, approach, rollout, outcome, result, and public-detail boundaries. There are no Work technologies, technology pills, or technology inventory.

Professional work with limited public detail uses an honest, concise summary rather than invented diagrams or metrics.

### Career application

Career.app is a dedicated application with a kinetic timeline.

Required stages:

- 2022: Technology Graduate
- 2024: Observability or distinction project
- 2025: Associate Software Engineer
- Now: SKAO and platform tooling

Visitors can:

- Drag or keyboard-operate a range control
- Jump directly to a year
- Use arrow keys
- Read every stage without animation
- Minimize, maximize, and close the application
- Open Career directly through a hash link

Each stage changes:

- Dominant year
- Headline
- Role label
- Evidence statement
- Supporting copy
- Accent colour

### Projects application

Projects presents personal projects as engineering case studies, not equal generic cards.

Initial featured projects:

- Pokeleximon Daily
- Safelog

Each case study includes:

- Product purpose
- System shape
- Ben's technical decisions
- Delivery and operational concerns
- Technologies
- Live and source links where available
- Screenshots or diagrams that add evidence

### Contact application

Contact provides:

- Email action
- LinkedIn
- GitHub
- CV download
- Location
- Availability statement

The Micro terminal may open Contact, but terminal use is optional.

## 8. Core User Journeys

### Recruiter scan

1. Land on the desktop.
2. Read role, positioning, and flagship impact.
3. Open Work or Career.
4. Download CV or visit LinkedIn.

### Hiring-manager evaluation

1. Open the SKAO work detail.
2. Inspect ownership, approach, and result.
3. Open Career to understand progression.
4. Review Pokeleximon or Safelog for independent execution.

### Explorer journey

1. Drag and focus desktop windows.
2. Launch applications from the dock.
3. Scrub Career.
4. Use the Micro terminal.
5. Discover optional small personal details.

### Direct-link journey

1. Open a shared hash URL.
2. The relevant application opens immediately.
3. Browser back and forward restore prior application state.

## 9. Functional Requirements

### Operating-system shell

- Identity-only menu bar with the Kernel mark, Ben Hutchinson, and Manchester, UK
- Desktop with bounded draggable windows on capable viewports
- Dock with exactly five application controls and GitHub, LinkedIn, and Download CV utilities
- Focused window rises above other windows
- Minimize, maximize, close, and restore states
- Reset-layout action
- Window positions constrained to a recoverable visible area
- Essential content unaffected by window position

### Micro terminal

- The permanent compact Micro terminal belongs to Desktop and is not an application
- Supports discoverable commands for career, work, projects, contact, help, and reset
- Provides visible command suggestions
- Never executes arbitrary code
- Never becomes the only navigation method
- Gives clear feedback for unknown commands

### Navigation and URLs

- Uses static-host-safe hash navigation
- Supports Desktop, Work, `#work/<work-id>` detail routes including `#work/uv-ruff-migration`, Career, Projects, individual project details, and Contact
- Synchronizes UI state with browser back and forward
- Does not require a history fallback

### Content

- Typed, data-driven career, `workItems`, and project entries
- No professional evidence hardcoded across multiple components
- No runtime fetch required for core content
- External links are verified before release
- Claims remain evidence-based

### Mobile

- One active application at a time
- No overlapping draggable-window requirement
- Dock becomes compact application navigation while the menu remains identity-only
- Career retains year buttons and a range control
- Project details use a readable full-width view
- All content scrolls naturally
- No fixed-height content clipping

## 10. Non-Functional Requirements

### Accessibility

- WCAG 2.2 AA target
- Semantic landmarks and heading order
- Visible focus states
- Complete keyboard navigation
- Range-control labels and year-jump alternatives
- Minimum practical touch target of 44 by 44 CSS pixels
- Reduced-motion support
- No information conveyed by colour alone
- No essential content available only through dragging or terminal commands

### Performance

- No 3D engine in the initial approved direction
- No persistent animation loop
- Initial JavaScript target at or below 200 KB gzip
- Initial image transfer target at or below 1 MB
- No single non-hero image above 350 KB
- Largest Contentful Paint target below 2.5 seconds on a representative mobile profile
- Lighthouse Performance target at least 90
- Lighthouse Accessibility target at least 95

### Reliability

- No runtime dependency on an external API
- Graceful recovery from invalid hash state
- Graceful fallback when local storage is unavailable or corrupt
- Missing optional images do not break navigation or content
- Production build works under the /ben-portfolio/ GitHub Pages base path

## 11. Technical Direction

- React
- TypeScript
- Vite
- CSS Modules and central design tokens
- Motion for React through LazyMotion for bounded transitions
- Native pointer events for window movement
- A reducer or small state machine for shell and application state
- Vitest and React Testing Library for component behaviour
- Playwright for end-to-end, responsive, accessibility, and hash-navigation coverage

Exact dependency versions are selected from current stable releases during implementation.

## 12. Out of Scope for Initial Release

- Three.js, Babylon.js, PlayCanvas, or another WebGL engine
- Character-select navigation
- Runner minigame
- Autoplay audio
- Multiplayer or shared desktop state
- Authentication
- CMS or admin interface
- Server-side rendering
- Runtime analytics that require a custom backend
- Persisting arbitrary desktop layouts across devices

Optional personal easter eggs may be reconsidered after the recruiter experience passes all release gates.

## 13. Release Acceptance

The initial release is accepted only when:

- Production build, lint, and type checking pass.
- Direct GitHub Pages loading succeeds.
- Desktop and mobile recruiter journeys pass.
- Hash navigation and browser history pass.
- Keyboard-only operation passes.
- Reduced-motion behaviour passes.
- The Career application is readable and operable without animation.
- No horizontal overflow exists at 320, 390, 768, 1024, and 1440 CSS pixels.
- The visual result matches DESIGN.md and the product character in SOUL.md.
