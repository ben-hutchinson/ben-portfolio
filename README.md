# Ben Hutchinson — Portfolio OS

This repository contains Ben Hutchinson's static Portfolio OS: a recruiter-first portfolio for a mid-level platform engineer. It is a client-side application designed to deploy unchanged to GitHub Pages.

## Requirements and install

Use Node 24 and the committed lockfile:

```bash
npm ci
```

## Run locally

Start the development server:

```bash
npm run dev
```

Build the production site, then serve the exact static output:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Open [http://127.0.0.1:4173/ben-portfolio/](http://127.0.0.1:4173/ben-portfolio/). The supported views use hash URLs, for example `#desktop`, `#work`, `#career`, `#projects`, `#projects/pokeleximon`, `#projects/safelog`, and `#contact`.

For an isolated browser run, choose a free strict port consistently, for example:

```bash
PLAYWRIGHT_PORT=4174 npm run preview -- --host 127.0.0.1 --port 4174 --strictPort
```

## Quality commands

Run these checks before handing implementation work to the Tester:

```bash
npm run typecheck
npm run lint
npm test
npm run test:coverage
npm run build
npm run check:bundle
npm run test:e2e
npm run test:e2e:a11y
npm run test:e2e:visual
```

`check:bundle` validates the manifest-aware initial JavaScript and image budgets against the generated `dist` output. The Playwright commands launch the production preview at the configured `PLAYWRIGHT_PORT` (4173 by default).

## Architecture

The application uses React and TypeScript with Vite. Component-specific styling is CSS Modules, with shared visual tokens in `src/styles`. Motion provides bounded application and Career transitions through `LazyMotion`.

`src/app` owns hash parsing, the Portfolio context, and the reducer that coordinates route, focused application, window, Career, and project state. `src/shell` composes the Menu, Desktop, Dock, and shared window chrome. `src/apps` contains the independently readable portfolio applications; canonical professional content lives in typed `src/data` modules. Tests use Vitest, Testing Library, and Playwright.

## Static GitHub Pages deployment

Vite builds with the exact `/ben-portfolio/` base path. Internal static URLs are generated from that base (or imported modules), and navigation is hash-based, so direct links do not need server rewrites. The deployed artifact is `dist` only; core content has no runtime content API.

The quality workflow runs before the Pages artifact is uploaded. GitHub Pages deployment is restricted to the default `master` branch and publishes the verified `dist` artifact with no server rewrites or runtime content API.

Protected release assets are the CV PDF, favicon, and the two verified project WebPs under `public`. Do not replace them or alter canonical professional evidence without Product Owner direction.
