# Command Centre Portfolio Redesign

Date: 2026-07-28

Status: Approved visual direction; implementation specification awaiting review

Audience: implementation agents, reviewers, and repository maintainers

## 1. Objective

Redesign the portfolio into a recruiter-first command-centre experience for a backend/platform engineer. The site must remain memorable and playful, but professional evidence must be visible without completing an intro, selecting a character, or opening a game.

The approved direction combines three ideas:

- a cinematic Mission Control shell for identity and atmosphere;
- editorial engineering briefings for fast project evaluation;
- a focused systems topology for technical depth.

The existing minigame and character personality remain, but become optional rewards rather than navigation gates.

## 2. Success Criteria

The redesign succeeds when:

1. A recruiter can identify Ben as a backend/platform engineer, understand his strengths, and reach the flagship work within ten seconds.
2. Pokeleximon and Safelog read as engineering stories rather than generic project cards.
3. The career timeline communicates operating context and ownership without requiring interaction.
4. Ben, Blue, and Toni feel like a coherent command crew; Blue and Toni preserve the approved concept art, while Ben receives a closer-likeness second pass.
5. The minigame is discoverable but never blocks the portfolio.
6. The site works as a static Vite build on GitHub Pages under `/ben-portfolio/`.
7. Motion, keyboard navigation, reduced-motion behaviour, and mobile layouts meet production accessibility expectations.
8. The final build passes the repository quality gates and the performance budgets in this document.

## 3. Product Principles

### Evidence before inventory

Show the role, engineering judgement, and concrete work before long skill lists. Technology names support the story; they do not replace it.

### Playfulness without a gate

The default experience is a semantic scrolling document. Character selection, audio, and the runner are optional enhancements.

### Calm motion

Motion should communicate hierarchy, focus, and system relationships. Avoid constant movement, long loading sequences, and animation that delays reading.

### Static-hosting discipline

All production behaviour runs in the browser from the generated Vite bundle. No server runtime, server-side rendering, runtime API dependency, or history-based route is required.

### No invented evidence

Do not fabricate scale metrics, percentages, traffic figures, reliability claims, or business outcomes. Add quantitative evidence only when Ben supplies a verified value.

## 4. Approved Visual System

### Palette

The core palette is:

| Token | Value | Use |
| --- | --- | --- |
| Command navy | `#0E2148` | Primary panels and sprite backdrop |
| Deep violet | `#483AA0` | Primary actions and selected states |
| Orbit lilac | `#7965C1` | Motion paths, graph focus, restrained glow |
| Silver | `#C7CCD8` | Borders, metadata, hardware detailing |
| Signal white | `#F7F8FC` | Primary text and high-emphasis surfaces |

Derived dark and muted tokens may be created for contrast, but the visible identity must remain navy-violet-silver. Green is reserved for small operational status signals and may not become a decorative theme colour.

### Typography

- Use a contemporary grotesk or system sans for display and body copy.
- Use a readable monospaced face for telemetry, labels, tags, and topology metadata.
- Retire `Press Start 2P` from body-facing navigation and headings. It may remain inside the minigame if it remains legible.
- The hero uses large, tightly tracked uppercase type with a stroked secondary phrase.

### Surfaces

Panels resemble restrained aerospace instrumentation: thin silver borders, deep translucent navy, limited lilac illumination, and minimal radii. Avoid stock dashboard cards, heavy glassmorphism, and dense sci-fi decoration.

## 5. Information Architecture

The default page order is fixed:

1. Sticky command navigation
2. Hero and command-crew portrait
3. Four-item positioning proof strip
4. Selected mission logs
5. Systems topology
6. Experience timeline
7. Command crew
8. Optional training module
9. Contact/footer links

Desktop navigation uses anchor links. Mobile navigation uses an accessible sheet. The page does not require a client-side router, which avoids GitHub Pages history fallback problems.

## 6. Section Specification

### 6.1 Command navigation

The navigation contains Ben's name, anchor links to Mission Logs, Systems, Experience, and Crew, a restrained availability signal, and a Training Sim action. It becomes compact on mobile. The navigation must never obscure the current section after anchor navigation.

### 6.2 Hero

Required content:

- label: `Backend / platform engineer · Manchester, UK`;
- headline: `I engineer the calm inside complexity.`;
- concise supporting statement focused on reliable backend systems, developer tooling, and operational platforms;
- primary action to Mission Logs;
- secondary action to Experience;
- proof tags for Python, Java/JVM, PostgreSQL, Docker, observability, and on-call ownership;
- Ben's command-crew artwork in an observation window with subtle telemetry.

The hero is immediately visible. There is no Press Start screen or artificial loading duration.

### 6.3 Positioning proof strip

Use four concise dimensions:

- Operating mode: Production-minded
- Sweet spot: Systems + tooling
- Working style: Clarity + ownership
- Interface: Human-friendly

These are positioning statements, not numeric claims.

### 6.4 Mission logs

Pokeleximon and Safelog are the two featured briefings. Each preview includes:

- project category;
- title and concise framing;
- product screenshot;
- system shape;
- engineering story;
- verified links;
- an action that opens a detailed project sheet.

The detailed sheet follows a consistent schema:

1. Context
2. Problem or constraint
3. Responsibilities
4. Key decisions
5. System shape
6. Delivery and operations
7. Verified outcome or learning
8. Links

The existing dependency migration and Acca Freeze entries appear as supporting evidence inside the project archive or experience timeline, not as equal-weight flagship cards.

### 6.5 Systems topology

The topology is a progressive enhancement, not the main navigation. It contains five nodes: SKAO, Flutter UKI, Pokeleximon, Safelog, and Observability. Three focus controls select Platform & Reliability, Product Systems, or Developer Tooling.

Selecting a focus must:

- update `aria-pressed`;
- illuminate matching nodes and paths;
- preserve all node labels in the document;
- remain understandable with motion disabled;
- collapse into a vertical connected list on narrow screens.

No WebGL, force simulation, or continuously running canvas is required.

### 6.6 Experience timeline

The timeline uses the verified entries in `src/data/timeline.ts`, revised for concise operating context. Each role communicates environment, scope, and type of ownership. It remains readable without expanding rows.

### 6.7 Command crew

The crew section presents:

- Ben — Systems architect / mission owner
- Blue — Reliability officer
- Toni — Chaos engineering

The humorous labels are optional flavour. Ben remains the only professional profile; Blue and Toni do not replace or remix Ben's career content.

### 6.8 Training module

The existing `MissionRunner` becomes `Signal Sprint`, opened from an accessible dialog. It is lazy-loaded after explicit user intent. Audio remains muted by default and can start only after interaction.

The dialog must support:

- keyboard focus trapping and Escape close;
- touch, keyboard, and pointer controls;
- visible instructions;
- best-score persistence;
- reduced-motion mode;
- restoration of focus to the launch control after close.

The training module must not affect initial content rendering or the largest contentful paint.

## 7. Sprite and Asset Direction

### Approved concept traits

Blue preserves the black coat, greying muzzle, brown eyes, asymmetric ears, purple harness, and silver command hardware. Toni preserves the black coat, white chest and toes, yellow-green eyes, head tilt, and restrained violet-silver collar.

### Ben second-pass requirements

The current command concept is not accepted as final. A revised Ben must:

- match the source photo more closely in face shape, hair silhouette, beard, eyes, and expression;
- feel like the same pixel-art family as Blue and Toni;
- reduce the generic action-hero appearance;
- keep a confident but approachable posture;
- use practical command-centre clothing with fewer ornamental straps;
- remain recognisable at crew-card and hero sizes.

The art workstream produces two Ben candidates for review. Only the selected candidate proceeds into production derivatives.

### Production asset contract

The concept images are art-direction references, not final runtime files. Production assets must include:

- an optimised hero/crew image for each character;
- a front/south transparent gameplay sprite;
- an east-facing runner still;
- an east-facing runner animation for Signal Sprint;
- stable paths referenced only through `src/data/characters.ts` and `src/utils/assets.ts`.

Hero/crew images should use WebP or AVIF where browser support and quality are acceptable. Gameplay sprites remain PNG with transparency and nearest-neighbour scaling. Existing asset filenames remain available until the replacement set passes browser review.

## 8. Frontend Architecture

### App state

Replace the current five-stage app state with a scrolling portfolio plus one optional training state:

```text
PortfolioShell
├── normal document flow
└── training dialog: closed | open
```

The old `intro`, `loading`, `main`, and `missionLoading` stages are removed. Legacy local-storage values such as `portfolio.skipIntro` may be ignored; do not add migration UI.

### Component boundaries

```text
App
└── PortfolioShell
    ├── CommandNav
    ├── HeroSection
    ├── ProofStrip
    ├── MissionLogsSection
    │   └── ProjectBriefingSheet
    ├── SystemsTopology
    ├── ExperienceTimeline
    ├── CrewSection
    ├── TrainingModule
    │   └── lazy(MissionRunner)
    └── CommandFooter
```

Each section owns its markup, local styling, and tests. `App.tsx` only composes sections and global providers.

### Data contracts

Extend `ProjectEntry` with optional, verified fields for `category`, `systemShape`, `engineeringStory`, and `briefing`. Add typed topology data in a dedicated module. Do not hardcode professional copy across JSX files.

### Styling

Keep CSS Modules for branded sections and centralise global tokens in `src/styles/global.css`. Remove the root `height: 100%` and `overflow: hidden` assumptions so the document can scroll normally.

### Motion

Use the existing Framer Motion dependency through `LazyMotion` and `domAnimation`. Motion is limited to:

- fast hero reveal;
- observation-window drift;
- section entry when first visible;
- project-image hover/press feedback;
- topology focus changes;
- dialog and sheet transitions.

All meaningful content exists before animation. Reduced motion converts transitions to immediate state changes and disables ambient drift.

### shadcn usage

Adopt only the shadcn primitives that provide meaningful accessibility and interaction value:

- `Sheet` for mobile navigation and project briefings;
- `Dialog` for Signal Sprint;
- `Tooltip` for supplementary topology descriptions;
- `Separator` where semantic section division is useful.

The visible surfaces remain custom CSS Modules using the command-centre tokens. Do not replace the design with stock shadcn cards, buttons, or dashboard layouts. Configure Tailwind/shadcn only once in the foundation workstream and remove unused generated components before release.

### Static asset paths

All public asset URLs continue to use `import.meta.env.BASE_URL` through `src/utils/assets.ts`. No source file may assume deployment at `/`.

## 9. GitHub Pages and Delivery Constraints

- Preserve Vite base path `/ben-portfolio/`.
- Preserve the existing GitHub Pages workflow unless a verified defect requires a targeted change.
- Use anchor navigation and modal state rather than history routes.
- Avoid runtime fetches for portfolio content.
- Lazy-load Signal Sprint and below-the-fold crew artwork.
- Ensure direct loading of the deployed index and every static asset succeeds under the repository subpath.

## 10. Accessibility Requirements

- Semantic landmarks and heading order.
- Visible focus at all times.
- Complete keyboard operation for navigation, topology, sheets, dialog, and game.
- Minimum WCAG AA contrast for body copy and interactive states.
- `prefers-reduced-motion` support for CSS and Framer Motion.
- Decorative telemetry hidden from assistive technology.
- Useful alt text for product and character artwork.
- Touch targets of at least 44 by 44 CSS pixels where practical.
- No autoplay audio.
- The full professional story remains readable when animations are disabled or images fail to load; no essential copy may exist only inside artwork or animated state.

## 11. Performance Budgets

Release targets on the production build:

- initial JavaScript: at most 250 KB gzip;
- initial image transfer: at most 1.5 MB;
- no individual below-the-fold image above 350 KB;
- Lighthouse Performance at least 90 on a mobile profile;
- Lighthouse Accessibility at least 95;
- no persistent animation loop outside the visible hero or open minigame;
- no horizontal overflow at 320, 390, 768, 1024, and 1440 CSS pixels.

If shadcn/Tailwind causes a budget miss, remove unused primitives and styles before weakening the budget.

## 12. Test Strategy

### Automated

- TypeScript build and existing ESLint gate.
- Component tests for topology focus, project-sheet opening, training-dialog lifecycle, and reduced-motion branches.
- Playwright smoke path from hero to each main section.
- Playwright mobile navigation and project-sheet flow.
- Keyboard-only topology and training-dialog tests.
- Automated accessibility scan on the main page and open dialog.
- Broken-link and GitHub Pages base-path checks.
- Visual regression snapshots at 390x844 and 1440x1000.

### Manual

- Safari, Chromium, and Firefox visual review.
- Touch review on a real or emulated narrow device.
- Sprite readability at runtime sizes.
- Motion review with reduced motion on and off.
- Audio remains off until explicitly enabled.
- Final content review for unsupported or inflated claims.

## 13. Multi-Agent Orchestration

### Operating model

Use one integration lead and up to three specialist agents concurrently. Each implementation agent works in a dedicated git worktree and branch. Agents receive focused, self-contained briefs and own non-overlapping paths. The integration lead alone edits shared composition and dependency files unless a task explicitly delegates one of them.

Integration branch: `codex/command-centre-redesign`

Workstream branches:

- `codex/redesign-foundation`
- `codex/redesign-content`
- `codex/redesign-art`
- `codex/redesign-missions`
- `codex/redesign-topology`
- `codex/redesign-training`
- `codex/redesign-qa`

Every agent returns:

1. scope completed;
2. files changed;
3. verification commands and results;
4. remaining risks;
5. commit hash.

### Files reserved for the integration lead

- `package.json`
- `package-lock.json`
- `src/App.tsx`
- `src/main.tsx`
- `vite.config.ts`
- `.github/workflows/**`
- final edits to `src/data/characters.ts`
- cross-workstream changes to `src/styles/global.css`

Specialists may propose changes to reserved files in their handoff, but do not edit them directly.

### Wave 0 — Integration baseline

Owner: integration lead.

1. Create the integration branch and worktrees.
2. Record baseline build, lint, bundle size, desktop/mobile screenshots, and accessibility findings.
3. Add the test harness and minimal shadcn foundation centrally.
4. Publish exact file-ownership briefs to the Wave 1 agents.

Gate: baseline is reproducible and all agents start from the same commit.

### Wave 1 — Independent foundations

Run three agents in parallel.

#### Foundation agent

Owns `src/components/ui/**`, new design-system utilities, and a proposed global token patch. Delivers the shadcn primitives, reusable command controls, and motion helpers. Does not compose page sections.

#### Content/data agent

Owns `src/data/types.ts`, `src/data/projects.ts`, `src/data/timeline.ts`, and new topology/profile data modules. Delivers verified, typed content with no visual components.

#### Art agent

Owns new versioned files under `public/assets/characters/**`. Produces two Ben v2 candidates, optimised Blue/Toni command artwork, and a manifest of intended runtime paths. Does not replace existing files or edit TypeScript.

Gate A:

- user selects the Ben v2 candidate;
- integration lead reviews all content claims;
- unit/type/lint checks pass after integration;
- production asset sizes meet the asset budget.

### Wave 2 — Page sections

After Gate A, run three agents in parallel from the updated integration commit.

#### Shell and crew agent

Owns new feature directories for command navigation, hero, proof strip, crew, and footer. Uses the approved asset manifest. Does not edit `App.tsx`.

#### Mission and experience agent

Owns mission-log cards, project briefing sheet content, and experience timeline feature directories. Uses only the typed data contract from Wave 1.

#### Topology agent

Owns the systems topology feature, focus interactions, narrow-screen list form, and component tests.

Gate B:

- integration lead composes sections in `App.tsx`;
- desktop and mobile reading order matches this specification;
- all section tests, lint, typecheck, and build pass;
- no agent-owned file conflicts remain.

### Wave 3 — Training, motion review, and QA

Run three agents in parallel after the full page is composed.

#### Training agent

Owns the Signal Sprint feature directory and adapts `MissionRunner` to the lazy dialog contract. Preserves game mechanics unless a verified bug requires a focused fix.

#### Motion/accessibility reviewer

Performs a read-only review of animation, focus, semantics, contrast, and reduced-motion behaviour. Produces findings mapped to the owning agent; does not perform broad cross-section edits.

#### QA/performance agent

Owns test files and test configuration, adds end-to-end, accessibility, base-path, and visual checks, and reports bundle and image budgets. It does not restyle production components.

Gate C:

- owning agents address reviewer findings;
- integration lead runs the complete verification matrix;
- visual review passes at all target widths;
- the deployed preview works under `/ben-portfolio/`;
- the user approves the final Ben sprite and representative desktop/mobile screenshots.

### Integration and conflict policy

1. Agents never edit another workstream's owned paths.
2. The integration lead cherry-picks one workstream at a time in dependency order.
3. After each cherry-pick, run targeted checks; after each wave, run the full current suite.
4. Conflicts in reserved files are resolved by the integration lead using the agent's handoff notes.
5. A failing gate returns work to the original owner with the exact failure and acceptance criterion.
6. Reviewer agents report findings; implementer agents make the fixes so ownership stays clear.
7. No pull request is opened until Gate C passes.

## 14. Release Checklist

- Approved Ben v2 and approved Blue/Toni derivatives are present.
- Recruiter path requires no intro or interaction.
- Pokeleximon and Safelog briefings contain only verified claims.
- Topology works with pointer, keyboard, touch, and reduced motion.
- Signal Sprint is lazy and optional.
- Audio is opt-in.
- All external links and CV download work under the Pages base path.
- Build, lint, typecheck, component tests, end-to-end tests, accessibility tests, and visual checks pass.
- Performance budgets pass on the production bundle.
- GitHub Pages deployment completes and the live smoke test passes.

## 15. Non-Goals

- Backend services, CMS, or database.
- Authentication, accounts, or analytics dashboards.
- WebGL, Three.js, or a physics rewrite of the minigame.
- A full design-system migration away from CSS Modules.
- Multiple portfolio routes that require server fallback configuration.
- Invented case-study metrics.
- Rewriting the runner before the recruiter-facing redesign is complete.
