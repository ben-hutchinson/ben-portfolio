# PRD.md

## Product Vision

Create a memorable portfolio website that feels like a polished retro game character-select screen set in space. It should showcase creativity, technical ability, personality, and professional experience while remaining fast, accessible, and suitable for hiring audiences.

## Goals

* Impress recruiters, hiring managers, and peers.
* Encourage exploration and interaction.
* Present career, skills, projects, and personality clearly.
* Demonstrate frontend craftsmanship.

## Audience

Mixed: recruiters, hiring managers, engineers, creative visitors.

## Success Signals

* Users interact with character select.
* Users open multiple sections.
* Users click project links.
* Users leave with strong impression: wow / creative / knowledgeable.

## Core Experience

1. Press Start screen.
2. Loading bar.
3. Character grid.
4. Select character.
5. Selected character animates to center as a floating front-facing sprite.
6. Right panel updates with chosen section content.
7. Bottom persistent links: LinkedIn / GitHub / CV.

## Characters

* Ben (main)
* Dog
* Cat

## Sections

* About
* Career
* Skills
* Projects

## Functional Requirements

* Single-page React + Vite app.
* Menu-state navigation.
* Floating selected character with idle animation.
* Character-specific panel labels/text variants.
* Career as retro story timeline.
* Skills grouped by category.
* Projects shown as 4 equal cards with screenshot, blurb, external links.
* Remember intro skip state in localStorage.
* Remember mute state in localStorage.
* Audio only on character select screen.
* Responsive mobile layout.
* Keyboard-accessible controls.
* Optimized for GitHub Pages static hosting.

## Non-Functional Requirements

* Fast initial load.
* No visible lag on mobile.
* Accessible contrast and semantics.
* Clean codebase and maintainability.
* No security anti-patterns.
