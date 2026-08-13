# Portfolio OS Recruiter Polish

Date: 2026-08-13

Status: Approved design direction; ready for implementation planning

Audience: Product Owner, Developer, Tester, and repository maintainers

## 1. Objective

Polish the accepted Portfolio OS release using Ben's manual-review notes. The pass must make the shell quieter, enlarge the usable workspace, strengthen the identity, stabilize the Career interaction, and correct Work and Projects content without changing the site's established visual direction.

This is a bounded refinement of Portfolio OS, not a new redesign. The ink, pale-green, and signal-orange palette; hard borders and shadows; application-window metaphor; bottom dock; recruiter-first content hierarchy; and GitHub Pages architecture remain in force.

## 2. Approved Direction

Ben approved the following visual pairing from the 2026-08-13 comparison:

- **Kernel monogram** for the Portfolio OS badge and favicon.
- **Micro terminal** for the permanent compact desktop command surface.

The implementation should remove visual repetition instead of adding more chrome. The desktop must feel more spacious and intentional, while every recruiter-critical destination remains available without using the command surface.

## 3. Success Criteria

The polish succeeds when:

1. The top bar presents a distinctive Portfolio OS identity without duplicating bottom-dock navigation or repeating Ben's role and availability.
2. GitHub, LinkedIn, and CV actions form one recognizable icon-and-label utility group.
3. The desktop has visibly more usable space and no decorative `BUILD CLEAR PATHS` overlay.
4. The command interface is a small, persistent bottom-right desktop feature rather than a normal explanatory application window.
5. Shared window chrome draws an uninterrupted lower rule beneath the title and all window controls.
6. The flagship migration claim uses Ben's exact wording and first-person ownership.
7. Career navigation stays on a fixed vertical axis while its content changes.
8. Pokeleximon contains no dead live-site action, its Overview action opens the repository, and its catalogue media never overlaps or clips the adjacent copy.
9. Existing keyboard, hash-navigation, mobile, reduced-motion, coverage, bundle, accessibility, and GitHub Pages gates continue to pass.

## 4. Shell Simplification

### 4.1 Menu bar

The menu bar keeps:

- the new Portfolio OS mark;
- `Ben Hutchinson` as the identity label;
- `Manchester, UK` as restrained location context;
- the existing skip link and correct route-heading semantics.

The menu bar removes:

- the Desktop, Work, Career, and Projects navigation buttons;
- `Mid-level platform engineer` beneath Ben's name;
- `Open to platform and backend engineering opportunities` from the right side.

The bottom dock remains the visible application navigation. Removing the top navigation must not remove direct-hash support, keyboard access, browser history behavior, or route headings.

### 4.2 Kernel monogram

The approved mark is a compact square system tile containing a bold custom `BH` monogram and one signal-orange cursor/status block. It must:

- read clearly at menu-bar size;
- remain recognizable at 16, 32, and 48 CSS pixels;
- use the existing Ink, pale-green, and signal-orange palette;
- be authored as a lightweight vector asset with no runtime dependency;
- provide the source for `public/favicon.svg` and the visible top-left mark;
- avoid tiny decorative details that disappear at favicon size.

The visible menu mark is decorative when Ben's adjacent name supplies the accessible identity. The favicon needs an appropriate document title but no separate DOM announcement.

### 4.3 External utility group

GitHub, LinkedIn, and Download CV become one utility group at the right side of the bottom dock. Each action uses a familiar icon plus its text label:

- GitHub: GitHub mark + `GitHub`;
- LinkedIn: LinkedIn mark + `LinkedIn`;
- CV: document/download mark + `Download CV`.

Use local inline SVG or repository-owned vector components. Do not add an icon package for three marks. Preserve external-link security attributes and the CV's download behavior. The CV is removed from the main application-button group.

### 4.4 Larger usable viewport

Reduce the shell's outer page padding and allow the framed Portfolio OS surface to occupy more of large displays. Keep enough Ink surround to preserve the physical-device composition, but do not let the black gutter dominate.

The change must remain token-driven and responsive. On small viewports, preserve the existing safe edge spacing and avoid horizontal overflow. The application frame and dock must not touch the browser edge.

### 4.5 Desktop overlay removal

Remove the `BUILD CLEAR PATHS` wallpaper statement and its supporting decorative overlay styles. The flagship Work window remains the default desktop focal point.

## 5. Permanent Micro Terminal

### 5.1 Presentation

Replace the normal Command application window with a small, permanent command surface anchored to the bottom-right of the desktop work area, above and clear of the dock.

The desktop version contains:

- a narrow terminal title strip labelled `portfolio command`;
- three restrained signal dots or equivalent terminal chrome;
- one prompt row with a `>_` prompt, command input, and Enter affordance;
- no introductory paragraph, command suggestions, explanatory copy, oversized Run button, draggable frame, minimize control, maximize control, or close control.

It should look like a real terminal utility, not a recruiter call-to-action. It remains visually subordinate to Work and Career content. Focus may increase its border/shadow contrast, but it must not animate continuously.

### 5.2 Behaviour

Reuse the existing allow-listed command parser and shell dispatch behavior. The surface must never evaluate arbitrary code. Enter submits; ordinary form semantics and an accessible label remain available even though visible explanation is removed.

Command output should be concise and contained. The most recent response may appear in a small bounded line or popover without expanding the desktop layout. Command history must not turn the surface back into a large window.

The Command dock application entry and ordinary Command window are removed because the permanent surface replaces them. The `#command` compatibility route, if present, should recover to the desktop and focus the command input rather than opening obsolete chrome.

On mobile, show a compact full-width version only on the Desktop view, positioned above the dock and outside application content. Do not overlay it on an open Work, Career, Projects, or Contact view. Recruiter-critical navigation and content continue to work without it.

## 6. Shared Window Chrome

The lower edge of every title bar must render as one uninterrupted Ink rule beneath both:

- the title/drag region; and
- close, minimize, and maximize controls.

Implement the fix in the shared `WindowFrame` chrome so Work, Projects, Contact, and any remaining framed application receive the same result. The rule must not depend on application-specific markup, and control hit areas, visible focus states, and draggable regions must remain intact.

## 7. Work Content Refinement

The canonical flagship result line becomes exactly:

> Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes

Remove the technology pills from the Work window, including `uv`, `ruff`, and `Python`. The engineering story should carry the evidence without tag decoration.

Change third-person ownership language to first person. In particular:

- `Ben proposed the uv/ruff migration.` becomes `I proposed the uv/ruff migration.`
- `Ben designed the base-Makefile implementation and rollout.` becomes `I designed the base-Makefile implementation and rollout.`

Equivalent sentences may be combined only if the meaning, explicit ownership, base-Makefile detail, repository count, and four-minute average build-time reduction remain unchanged. Do not annualize or extrapolate the metric.

## 8. Stable Career Interaction

The Career stage selector and previous/next controls must occupy a stable horizontal rail at a fixed vertical position. Changing the selected stage must not move that rail up or down.

Use a stable application layout with explicit content and control rows. The changing stage content may scroll within its own bounded region when needed, especially at shorter desktop heights and mobile breakpoints. Do not use hard clipping to force equal heights.

Stage transitions should use opacity and restrained horizontal emphasis only. Remove vertical entrance motion that makes content appear to jump. Under reduced motion, switch content without spatial animation.

Keyboard controls, stage semantics, current-stage announcement, direct Career hash behavior, and touch targets remain unchanged or improve.

## 9. Projects Corrections

### 9.1 Pokeleximon links

Remove the Pokeleximon `Live` action because the deployed project is offline.

The Pokeleximon `Overview` action must open:

`https://github.com/ben-hutchinson/pokeleximon`

If another repository-labelled action would point to the same URL in the same action group, deduplicate it rather than rendering two identical destinations. External-link semantics and security attributes remain intact.

### 9.2 Featured-project media layout

Correct the featured Pokeleximon catalogue row so its title, body copy, controls, and screenshot remain in their own grid areas. The title must wrap within the copy column and never render beneath the media column.

The desktop media panel should align to the top of the project row and size to the screenshot rather than stretching to the full height of long copy and leaving a large empty Ink block. Preserve the screenshot's aspect ratio without distortion. Use cropping only if the complete image remains understandable; the preferred behavior is to display the full supplied screenshot.

At narrow widths, stack copy and media in document order with no overlap, horizontal scrolling, or inaccessible clipped content. Apply defensive `min-width: 0`, overflow wrapping, and bounded media sizing at the shared layout boundary rather than special-casing title text.

## 10. Responsive and Accessibility Contract

- All interactive elements remain keyboard reachable with visible focus.
- The new icon-and-label links retain readable accessible names; icons are decorative when labels are visible.
- The Micro terminal input has a programmatic label and useful invalid-command feedback.
- The stable Career rail remains reachable at 200% zoom and at supported mobile widths.
- Shell enlargement must not create horizontal overflow at 320 CSS pixels.
- No essential information depends on color, animation, hover, drag, or typed commands.
- Reduced-motion behavior remains equivalent.
- The Kernel mark and all affected text/control colors meet existing contrast gates.

## 11. Technical Boundaries

Remain within the locked stack: React, TypeScript, Vite, CSS Modules, Motion through LazyMotion, reducer/context state, Vitest, Playwright, and axe. Continue to generate a static GitHub Pages build under `/ben-portfolio/`.

Do not add:

- WebGL or a 3D engine;
- a routing library;
- an icon package;
- new analytics or runtime APIs;
- a server component;
- a global design-system dependency.

Prefer changes to shared shell components, typed content data, and existing styles. Remove obsolete Command-window code only after call sites, route recovery, tests, and bundle behavior are accounted for.

## 12. Verification Expectations

Tester evidence must cover at least:

- menu simplification and heading order on every direct hash;
- favicon and visible Kernel mark asset resolution under `/ben-portfolio/`;
- dock utility links, icons, CV download, and external attributes;
- desktop and mobile Micro terminal submission, focus, invalid command, and compatibility-route behavior;
- absence of the Command dock entry and ordinary Command window;
- uninterrupted shared title-bar border at representative desktop sizes and 200% zoom;
- exact Work copy and absence of Work technology pills;
- stable Career control-rail geometry across every stage;
- Pokeleximon link destinations and absence of `Live`;
- featured-project layout at desktop, tablet, mobile, and 200% zoom;
- 320-pixel horizontal-overflow audit;
- keyboard-only, reduced-motion, axe, visual-regression, full unit/component, coverage, type, lint, production build, bundle, and isolated GitHub Pages E2E gates.

Global coverage remains above 90% for statements, branches, functions, and lines with the repository's configured 91% thresholds.

## 13. Excluded Scope

This pass does not:

- add new portfolio projects or career claims;
- rewrite the overall information architecture;
- add a new theme or alternate palette;
- add persistence for window positions;
- reintroduce a space scene, command-centre theme, or 3D interaction;
- change the accepted deployment workflow;
- perform the previously waived screen-reader narration tree exercise.

## 14. Acceptance Boundary

The Product Owner may accept this polish only when every visible note in this specification is implemented, the Tester supplies current evidence, and no regression turns the optional command surface into required navigation. Minor pixel-level differences from the visual comparison are acceptable; the approved Kernel monogram geometry, Micro terminal hierarchy, and established Portfolio OS styling are not.
