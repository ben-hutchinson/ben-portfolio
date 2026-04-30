# AGENTS.md

## Suggested Build Agents / Workstreams

## 1. Foundation Agent

Responsibilities:

* Setup React + Vite.
* Configure base path for GitHub Pages.
* ESLint / formatting.
* GitHub Actions deploy workflow.

## 2. UI Systems Agent

Responsibilities:

* App shell.
* Responsive layout.
* Reusable buttons, panels, cards.
* Accessibility states.

## 3. Animation Agent

Responsibilities:

* Framer Motion transitions.
* Floating idle motion.
* Select animations.
* Parallax background.
* Ambient particle effects.

## 4. Content Agent

Responsibilities:

* Data models for characters, sections, projects, timeline.
* Easy editable JSON/TS config files.

## 5. Audio Agent

Responsibilities:

* Music playback manager.
* localStorage mute state.
* UI SFX triggers.

## 6. Performance Agent

Responsibilities:

* Asset optimization.
* Lazy loading assets.
* Bundle size checks.
* Mobile FPS testing.

## 7. QA Agent

Responsibilities:

* Cross-browser checks.
* Touch testing.
* Accessibility audit.
* Broken link checks.

## Suggested File Structure

* src/components
* src/features/intro
* src/features/character-select
* src/features/character-viewer
* src/features/panels
* src/features/audio
* src/data
* src/assets
* src/hooks
* src/utils
* docs

## Key Data Models

* characters[]
* sections[]
* projects[]
* timelineEvents[]
* settings { muted, skipIntro }
