# Ben Portfolio

Retro character-select portfolio built with React, Vite, TypeScript, and Framer Motion.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Audit

```bash
npm run lint
npm run typecheck
npm audit --audit-level=moderate
```

## Deployment

The app is configured for GitHub Pages with base path `/ben-portfolio/`.

## Assets

Character art is served from `public/assets/characters/*/pixellab` and referenced through
`src/utils/assets.ts`, so GitHub Pages paths stay rooted under `/ben-portfolio/`.
