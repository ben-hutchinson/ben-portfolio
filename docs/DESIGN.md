# Command Centre Design

## Purpose

The portfolio is a recruiter-first command centre for a backend/platform engineer. A visitor can identify Ben's role, inspect Pokeleximon Daily and Safelog, understand systems and ownership, and reach the CV without completing an intro, selecting a character, or opening a game.

## Information flow

The default page is a semantic scrolling document in this order: sticky command navigation; hero and Ben's observation window; four-item positioning proof; mission logs; systems topology; experience timeline; command crew; optional Signal Sprint; and contact links. Desktop navigation uses in-page anchors; mobile navigation uses an accessible sheet. Project detail appears in sheets, and Signal Sprint appears in an accessible dialog after explicit intent.

## Visual system

| Token | Value | Role |
| --- | --- | --- |
| Command navy | `#0E2148` | Primary panels and crew backdrop |
| Deep violet | `#483AA0` | Actions and selected states |
| Orbit lilac | `#7965C1` | Paths and restrained glow |
| Silver | `#C7CCD8` | Borders, metadata, instrumentation |
| Signal white | `#F7F8FC` | High-emphasis text and surfaces |

Use a contemporary sans for readable copy and a monospaced face for telemetry. Panels are deep translucent navy with thin silver borders and limited lilac illumination. Motion clarifies focus and hierarchy; meaningful content is present before animation, and reduced motion makes state changes immediate.

## Optional playfulness

Ben, Blue, and Toni are the command crew, not a character-selection gate. Signal Sprint preserves the playful retro element as an optional, lazy-loaded training simulation. It is muted by default, starts only after interaction, and never blocks portfolio content.

## Static-hosting discipline

The site remains a static Vite build under `/ben-portfolio/`. Asset URLs must use `import.meta.env.BASE_URL` through `src/utils/assets.ts`; no runtime path may assume `/`. Use anchors and modal state rather than history routes so direct GitHub Pages loads remain reliable.
