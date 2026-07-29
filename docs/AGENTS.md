# Command Centre Delivery Ownership

## Final operating model

The integration lead owns the integration branch (`codex/command-centre-redesign`), shared composition, dependency/configuration files, release verification, documentation, and publication. Specialist work is scoped to non-overlapping feature, data, art, training, or QA paths. The integration lead reviews each contribution, runs the relevant gates, and is the sole owner of final release evidence and the pull request.

| Workstream | Ownership |
| --- | --- |
| Integration lead | `src/App.tsx`, `src/main.tsx`, `src/styles/global.css`, `package.json`, `package-lock.json`, `vite.config.ts`, `.github/workflows/**`, final character-data integration, docs and release handoff |
| Foundation | React/Vite setup, shared primitives, test setup, base-path discipline |
| Content | `src/data/**` profile, project, timeline, and topology data; only verified portfolio claims |
| Art | Versioned command-crew assets and asset manifest/pipeline documentation |
| Shell and crew | Navigation, hero, proof strip, command crew, and command footer |
| Missions and experience | Flagship mission logs, project briefings, and experience timeline |
| Topology | Systems topology, focus controls, and progressive-enhancement layout |
| Training | Optional lazy Signal Sprint dialog and scoped mission-runner integration |
| QA and review | Automated release gates, visual baselines, accessibility/motion review, and bounded review reports |

## Handoff contract

Every specialist handoff includes scope completed, files changed, exact verification commands/results, remaining risks, and commit SHA. Specialists do not edit integration-reserved paths; they record proposed changes for the integration lead instead. Reviewers do not change production code.

## Product guardrails

- The default experience is the recruiter-first command-centre page, not Press Start or character selection.
- Ben, Blue, and Toni are command crew; Signal Sprint is optional and lazy-loaded.
- Public URLs use `import.meta.env.BASE_URL` through `src/utils/assets.ts` so GitHub Pages remains safe under `/ben-portfolio/`.
- Release verification uses `npm ci`, `npm run check`, `npm run test:e2e`, and `node scripts/check-dist-budget.mjs`, plus rendered local preview QA at the GitHub Pages base path.
