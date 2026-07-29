# Command Centre Portfolio PRD

## Product vision

Create a memorable but recruiter-first portfolio for a backend/platform engineer. The professional story must be visible on initial load: visitors should understand Ben's role, strengths, flagship work, and ownership without a timed intro or game interaction.

## Audience and goals

Recruiters and hiring managers need quick evidence; engineers and curious visitors can explore deeper. The portfolio should communicate reliable backend systems, developer tooling, operational platforms, and practical engineering judgement while remaining accessible, fast, and static-host friendly.

## Core experience

1. Immediate command-centre hero: `Backend / platform engineer · Manchester, UK` and a route into Mission Logs or Experience.
2. Positioning proof for production mindset, systems/tooling, clarity/ownership, and human-friendly interfaces.
3. Two flagship engineering briefings: Pokeleximon Daily and Safelog, each with screenshots, verified links, and a detailed project sheet.
4. Systems topology, concise experience timeline, and command crew for technical and personal depth.
5. Optional lazy Signal Sprint training dialog, available after explicit intent and never required for navigation.
6. Contact links and a base-safe CV download.

## Functional requirements

- Single-page React + Vite application with semantic landmarks and accessible anchor navigation.
- Accessible mobile command-index sheet, project briefing sheets, topology focus controls, and training dialog with keyboard support and visible focus.
- `prefers-reduced-motion` support; no autoplay audio and no essential content confined to animation or artwork.
- Static GitHub Pages deployment under `/ben-portfolio/`; use `src/utils/assets.ts` for every public asset and CV path.
- Lazy-load Signal Sprint and below-the-fold crew artwork after relevant user/viewport intent.
- Keep claims verified: do not invent scale, performance, or business metrics.

## Quality and release requirements

- Run `npm ci`, `npm run check`, `npm run test:e2e`, and `node scripts/check-dist-budget.mjs` from a clean checkout.
- Preserve the 250 KB gzip initial-JavaScript cap, 1.5 MB initial-image target, and 350 KB per below-fold runtime-image cap defined in the approved design specification.
- Maintain E2E coverage across Chromium, Firefox, and WebKit, plus committed 390×844 and 1440×1000 visual baselines.
- GitHub Pages deploys only from `main`; branch release evidence is a production-equivalent local preview and the live redesign check remains a post-merge gate.
