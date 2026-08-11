# Portfolio OS Design Specification

Date: 2026-08-11

Status: Approved visual and interaction direction

## 1. Design Summary

The portfolio is a modern operating-system interface built from semantic web content.

The operating system is the primary visual language. It is not a replica of a real desktop environment and not a wrapper around a conventional portfolio page. The desktop, windows, applications, menu bar, dock, and command interface form one coherent product.

Career is a distinct application inside that system. It may maximize to occupy the work area, but the shell remains visible and understandable. Its kinetic colour and typography are allowed to be more expressive than the desktop because it represents movement over time.

## 2. Design Principles

### Tactile, not ornamental

Controls should look operable and respond with clear state changes. Hard shadows, borders, focus, and movement create tactility.

### Bounded complexity

The shell can support overlapping windows, but the default composition is intentional. Opening an application should reduce chaos, not add to it.

### Content before simulation

The desktop metaphor must not simulate unnecessary computer behaviour. There is no boot screen, filesystem puzzle, fake network delay, or hidden directory required to find content.

### Applications have distinct jobs

Each application owns one content domain and one interaction pattern.

### Mobile is a translation

Narrow layouts keep the application model but replace overlapping drag surfaces with one clear active view.

## 3. Visual Tokens

### Core palette

| Token | Value | Use |
| --- | --- | --- |
| Ink | #13221B | Text, borders, active controls, hard shadows |
| Desktop mint | #A9F2D3 | Main desktop surface and platform identity |
| Window paper | #F6FFEB | Window bodies and readable content surfaces |
| Menu paper | #EFFFF0 | Menu bar and dock surfaces |
| Signal orange | #FF653D | Primary emphasis, first career stage, alerts |
| Action coral | #FF4E2A | Active underline, focus accent, commands |
| Control yellow | #FFDC39 | Window bars, active dock items, key metrics |
| Career blue | #74D7F0 | Selected career-stage variation |
| Success green | #30C982 | Availability and successful state |
| Outer charcoal | #0B0D11 | Page background surrounding the OS shell |
| Muted green-grey | #40584C | Secondary copy on light surfaces |

### Stage palette

Career stages use one dominant surface at a time:

- 2022: signal orange
- 2024: warm yellow
- 2025: career blue
- Now: desktop mint

Text and controls remain Ink unless contrast testing requires an approved darkened variant.

### Borders and shadows

- Primary outline: 2 CSS pixels in Ink
- Small-control outline: 1.5 to 2 CSS pixels in Ink
- Default window shadow: 8 pixels right and 8 pixels down in Ink at 90 to 95 percent opacity
- Focused application shadow: 12 pixels right and 12 pixels down at reduced opacity plus a broad soft elevation shadow
- No soft, diffuse glass-card borders
- No excessive border radii

### Radius

- OS shell: 12 to 16 pixels
- Windows: 0 to 4 pixels
- Dock controls: 4 pixels
- Pills: reserved for compact status or year controls

## 4. Typography

Two families are sufficient.

### Interface mono

Use a highly readable monospace stack for:

- Menu labels
- Window titles
- Commands
- Status text
- File and application names
- Eyebrows
- Tags

Preferred approach: system monospace or a small self-hosted variable monospace subset.

### Display grotesk

Use a bold grotesk or system sans for:

- Hero positioning statement
- Window headlines
- Career year
- Career stage title
- Large evidence metrics

The display face should support heavy weights and tight tracking without looking like a startup landing-page default.

### Scale

- Desktop background statement: fluid 64 to 170 pixels
- Career year: fluid 92 to 210 pixels
- Career headline: fluid 29 to 63 pixels
- Window headline: 24 to 32 pixels
- Body: 15 to 18 pixels in production, never the tiny scale used in mockup thumbnails
- Interface label: 11 to 13 pixels

Prototype text sizes were compressed to fit comparison screens. Production body text must meet normal readability expectations.

## 5. Shell Anatomy

The desktop shell contains:

1. Menu bar
2. Work area
3. Desktop shortcuts
4. Default windows
5. Application layer
6. Dock

### Menu bar

The menu bar remains at the top of the shell.

Left:

- BH mark
- Ben Hutchinson
- Platform Engineer

Centre on wide screens:

- Desktop
- Work
- Career
- Projects

Right:

- Manchester, UK
- Availability state

The menu bar is navigation, not decoration. Active state uses the coral underline and a subtle surface change.

### Dock

The dock remains visible at the bottom of the shell on desktop.

Required items:

- About
- Work
- Career
- Projects
- Contact
- Command
- CV

The dock provides a predictable recovery path when windows overlap or an application is closed. Active applications show a small state indicator.

### Desktop shortcuts

Desktop shortcuts are an optional secondary path for About, Career, and Work. Their icon language uses simple abstract glyphs in outlined paper tiles. Avoid external operating-system logos and skeuomorphic folder art.

### Default composition

On initial load, the desktop shows:

- Profile window toward the upper left
- Featured Work window toward the upper right
- Command window lower and near the centre
- Large, low-contrast background statement

The flagship impact must remain readable without moving windows.

## 6. Window System

### Window anatomy

Each window has:

- Accessible application title
- Title bar
- Traffic-light-style controls
- Bounded content region
- Strong border and hard shadow

The traffic controls borrow the general idea of close, minimize, and maximize without copying a specific operating system.

### Window behaviour

- Pointer dragging uses the title bar.
- Focusing a window raises its stack order.
- Closing hides the window but preserves a dock route.
- Minimizing returns it to the dock.
- Maximizing fills the work area between menu bar and dock.
- Escape exits a maximized application when focus is inside it.
- Reset Layout restores the intentional default positions.

Window movement is an enhancement. Keyboard users can focus, open, close, minimize, maximize, and reset without repositioning windows.

### Position constraints

- At least the full title bar remains recoverable.
- Windows cannot be permanently moved outside the shell.
- Shell resize revalidates positions.
- Arbitrary positions do not persist across breakpoints.
- Layout persistence is omitted from the initial release.

### Semantics

Non-modal desktop windows are labelled sections, not modal dialogs. A maximized application remains part of the page shell and does not trap focus unless it presents a true modal subtask.

## 7. Career.app

Career.app is the signature application.

### Launch behaviour

Career can open from:

- Menu bar
- Dock
- Desktop shortcut
- Command interface
- Direct #career hash

The application opens in a large focused window. The user may maximize, minimize, or close it.

### Layout

Title bar:

- Window controls
- Path label such as ~/portfolio/Career.app
- Scrub Mode state

Main content:

- Stage number and role label
- Dominant year
- Large outcome-led headline
- Evidence card
- Supporting description

Bottom controls:

- Stage count
- Native range input
- Direct year buttons

### Interaction

Changing stage transforms:

- Background colour
- Geometric colour field
- Year
- Role label
- Headline
- Evidence
- Description

The stage change should snap with brief, intentional motion. Use opacity, small translation, and colour interpolation. Do not scroll-jack the overall page.

### Career stages

#### 2022

- Role: Technology Graduate
- Headline: Learning to operate production systems
- Evidence theme: Build. Observe. Improve.

#### 2024

- Role: Distinction project or observability work
- Headline: Turning evidence into better reliability
- Evidence theme: Measure. Signal. Respond.

#### 2025

- Role: Associate Software Engineer
- Headline: Owning delivery across changing stacks
- Evidence theme: Adapt. Ship. Support.

#### Now

- Role: SKAO platform tooling
- Headline: Building paved roads for engineering teams
- Evidence: 50+ repositories. Four minutes saved per build.

Final production wording must come from the canonical career data file.

## 8. Other Applications

### About

About presents:

- Concise identity and positioning
- Location
- Working style
- Platform-engineering direction
- Short evidence summary

Avoid a long biography.

### Work

Work opens with the SKAO case study and provides supporting professional evidence. Its default view is structured like a technical work file:

- Problem
- Ownership
- Approach
- Rollout
- Outcome

Use diagrams only when they can be truthful without exposing confidential details.

### Projects

Projects opens a catalogue view with Pokeleximon and Safelog. Selecting a project opens a focused project window or replaces the application content. Project screenshots should feel like artefacts inside the OS, not generic marketing cards.

### Contact

Contact is deliberately simple. It surfaces direct external actions with obvious labels and does not mimic an email client.

### Command

The command interface supports:

- help
- about
- work
- career
- projects
- project followed by a known project identifier
- contact
- cv
- reset
- clear

Unknown commands return a helpful suggestion. Commands dispatch the same application actions used by the visible UI.

## 9. Responsive Behaviour

### Wide desktop: 1200 pixels and above

- Full menu bar
- Multiple visible windows
- Dragging enabled
- Dock centred
- Career uses two-column content

### Compact desktop and tablet: 768 to 1199 pixels

- Reduced default overlap
- Fewer default windows visible at once
- Menu navigation may collapse
- Dock remains primary
- Dragging may remain if a precise pointer is available
- Career evidence card reduces in size

### Mobile: below 768 pixels

- One active application at a time
- No required window dragging
- Applications fill the work area
- Dock becomes horizontally scrollable or a compact application switcher
- Menu status becomes secondary
- Desktop shortcuts may be omitted
- Career uses a single content column
- Range input remains, with year buttons above or below
- Body content uses normal document scrolling

Mobile must feel like Ben OS, not like a squeezed desktop screenshot.

## 10. Motion

Use Framer Motion through LazyMotion for:

- Application open and close
- Minimize and maximize
- Window focus feedback
- Career content transitions
- Dock activation
- Project-detail transitions

Use CSS for:

- Hover states
- Focus states
- Small control presses
- Colour tokens

Do not use:

- Continuous parallax
- Background particle loops
- Mouse-following effects
- Page-wide scroll hijacking
- Artificial loading
- Autoplay audio

## 11. Accessibility

### Keyboard

- Skip link enters primary portfolio content.
- Menu and dock use ordinary buttons or links.
- Tab order follows application and content order, not visual z-index.
- Window title bars are not the only focus target.
- Career range supports arrow keys.
- Year buttons provide direct alternatives.
- Escape exits maximized applications.
- Reset Layout is keyboard accessible.

### Screen readers

- Shell, desktop, navigation, and applications have clear labels.
- Application state changes are announced sparingly.
- Window position is not announced because it is not meaningful content.
- Decorative desktop pattern and background statement are hidden.
- Project and career content exists as text in the document.

### Reduced motion

- Open and close become immediate visibility changes.
- Career stage content changes without spatial travel.
- Colour changes may remain if contrast is maintained.
- No essential cue depends on motion.

### Contrast and targets

- All production tokens must pass WCAG AA for their intended text size.
- Focus indicators must be visible on mint, yellow, orange, blue, and paper surfaces.
- Interactive targets should be at least 44 by 44 CSS pixels where practical.

## 12. Application Architecture

Recommended composition:

PortfolioRoot
  PortfolioShell
    MenuBar
    Desktop
      DesktopShortcuts
      WindowLayer
        ProfileWindow
        FeaturedWorkWindow
        CommandWindow
        ApplicationWindow
    Dock
    LiveRegion

ApplicationWindow renders one of:

- WorkApp
- CareerApp
- ProjectsApp
- ProjectDetailApp
- ContactApp

### State

Use one reducer for:

- Active application
- Open applications
- Focused window
- Minimized windows
- Maximized window
- Desktop window positions
- Active career stage
- Active project

Do not distribute shell state across unrelated local hooks.

### URL state

Map supported hashes to application state:

- #desktop
- #work
- #career
- #projects
- #projects/pokeleximon
- #projects/safelog
- #contact

Unknown hashes fall back to Desktop and may show a non-blocking message.

### Data

Keep professional content in typed data modules:

- profile
- careerStages
- workEntries
- projects
- externalLinks
- commandRegistry

Components render these models. They do not own canonical copy.

## 13. Error Handling

- Unknown command: show help and closest supported commands.
- Unknown hash: return to Desktop without a blank screen.
- Missing project image: retain title, summary, and links with a designed fallback surface.
- Invalid window position: reset that window to its default.
- Local-storage failure: continue with in-memory defaults.
- Motion-library failure or disabled JavaScript animation: content remains present and usable.

## 14. Performance and Delivery

- Use no WebGL engine in the approved initial design.
- Lazy-load non-default applications where it reduces initial JavaScript.
- Keep Profile and Featured Work in the initial bundle.
- Prefer system or self-hosted subset fonts.
- Optimise project screenshots to AVIF or WebP with useful fallbacks.
- Use import.meta.env.BASE_URL for public asset paths.
- Keep all core content in the build.
- Preserve GitHub Pages project base path /ben-portfolio/.

## 15. Visual Acceptance Checklist

- The first view unmistakably reads as a designed operating system.
- The interface does not copy a specific commercial OS.
- Mint, paper, ink, orange, and yellow dominate the shell.
- Hard shadows and crisp borders create tactility.
- Body copy is comfortably readable at production scale.
- Default windows feel composed, not randomly scattered.
- Career.app feels bolder while remaining part of the same product.
- The 50+ repository and four-minute result is visible on Desktop and in Career or Work.
- Mobile uses the application metaphor without overlapping chaos.
- No legacy pixel-game or command-centre styling remains.
