# Ben Portfolio

Ben Hutchinson's recruiter-first command-centre portfolio, built with React, Vite, TypeScript, and Framer Motion. The default route is a semantic, scrollable engineering portfolio: the role, evidence, mission logs, systems topology, experience, crew, and contact links are available immediately. Signal Sprint is an optional, lazy-loaded training simulation; it never gates the professional story.

## Experience

The page follows this fixed order:

1. Command navigation and hero
2. Positioning proof strip
3. Pokeleximon Daily and Safelog mission logs
4. Systems topology and experience timeline
5. Command crew
6. Optional Signal Sprint training
7. Contact and CV links

The command-centre visual system uses command navy (`#0E2148`), deep violet (`#483AA0`), orbit lilac (`#7965C1`), silver (`#C7CCD8`), and signal white (`#F7F8FC`). The visible surfaces are custom CSS modules with restrained instrumentation styling rather than stock dashboard components.

## Development

```bash
npm install
npm run dev
```

For a production-equivalent local preview:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Open `http://127.0.0.1:4173/ben-portfolio/`.

## Release checks

```bash
npm ci
npm run check
npm run test:e2e
node scripts/check-dist-budget.mjs
```

`npm run check` runs linting, TypeScript, unit tests, and the production build. The E2E suite covers Chromium, Firefox, and WebKit; committed visual baselines live in `tests/e2e/visual.spec.ts-snapshots/` at 390×844 and 1440×1000.

## GitHub Pages and assets

The production site is a static Vite build deployed to GitHub Pages under `/ben-portfolio/`. Keep public-asset URLs base-safe: use the helpers in `src/utils/assets.ts`, which prefix paths with `import.meta.env.BASE_URL`; do not hard-code root-relative `/assets/...` or `/cv/...` paths. Anchor navigation and dialog/sheet state avoid history-routing requirements on static hosting.

Pages deploys on pushes to `main` (or a manual workflow dispatch). A feature branch has no separate production Pages preview; validate it locally at the production-equivalent base path, then perform the live Pages check after merge.

## References

- [Approved design specification](docs/superpowers/specs/2026-07-28-command-centre-portfolio-redesign-design.md)
- [Implementation plan](docs/superpowers/plans/2026-07-28-command-centre-portfolio-redesign.md)
- [Release evidence](docs/reviews/command-centre-release.md)
