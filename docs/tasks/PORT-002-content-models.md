# PORT-002 — Create canonical content models

Status: IN_PROGRESS

Requirement links: [PRD §2 — Positioning](../PRD.md#2-positioning), [PRD §7 — Approved Information Architecture](../PRD.md#7-approved-information-architecture), [PRD §9 — Content](../PRD.md#9-functional-requirements), [DESIGN §7 — Career.app](../DESIGN.md#7-careerapp), [DESIGN §8 — Other Applications](../DESIGN.md#8-other-applications), and [implementation plan — Task 2](../superpowers/plans/2026-08-11-portfolio-os-implementation.md#task-2-create-canonical-content-models).

User outcome: Portfolio content has one typed, local, evidence-based source of truth.

Dependencies:

- **Developer implementation cannot start until PORT-001 is ACCEPTED.**
- This committed inventory is the preservation gate before PORT-001 deletes legacy `src/data/timeline.ts` or `src/data/projects.ts`.

## Tester RED gate evidence

- `tests/unit/content.test.ts` defines the canonical-data contract for the six future modules and their exports.
- Node 24.19.0 focused suite (2026-08-11): RED as expected — Vitest could not resolve `../../src/data/career` because the canonical `src/data/*` modules do not yet exist; 1 test file failed before test collection.

In scope:

- Create `src/data/models.ts`, `src/data/profile.ts`, `src/data/career.ts`, `src/data/work.ts`, `src/data/projects.ts`, `src/data/externalLinks.ts`, and `tests/unit/content.test.ts`.
- Preserve exact approved copy from PRD §§2 and 7 and the verified legacy inventory below.
- Keep professional Work separate from the personal-project catalogue. Preserve verified Pokeleximon and Safelog links; represent non-public SKAO links as absent, not `#`.

Out of scope:

- Rendering applications, changing the shell, or adding a runtime content API.
- New product copy, unverified links, extrapolated savings, and invented team or reliability metrics.

## Required Task 2 handoff

- Tester adds failing data-contract tests proving IDs are unique, every career stage has year/role/headline/evidence/description/accent, all internal project IDs match supported hashes, external links use HTTPS or a `mailto:` URL, and the exact flagship sentence occurs once in canonical data.
- Developer defines narrow readonly models using this contract:

```ts
export type AppId = 'about' | 'work' | 'career' | 'projects' | 'contact' | 'command';
export type CareerStageId = 'graduate' | 'observability' | 'associate' | 'skao';
export type ProjectId = 'pokeleximon' | 'safelog';
export interface CareerStage {
  id: CareerStageId;
  year: string;
  role: string;
  headline: string;
  evidence: string;
  description: string;
  accent: 'orange' | 'yellow' | 'blue' | 'mint';
}
```

- Developer moves all professional copy into the new modules and removes generic equal-weight Work entries from the personal-project catalogue.
- Tester runs `npm test -- tests/unit/content.test.ts` and `npm run test:coverage`; inspect the report to ensure content helpers, if any, remain measured.
- Product Owner reads every rendered claim in the data modules, compares it with source docs and verified content, and accepts or returns exact copy changes.

## Locked claims and IDs

Canonical migration sentence (one canonical data literal): “Migrated 50+ repositories and reduced average build time by four minutes.” Do not annualise it or introduce an invented claim or metric.

- Career IDs, in order: `graduate`, `observability`, `associate`, `skao`.
- Personal Project IDs: `pokeleximon`, `safelog`.
- SKAO Work must state: Poetry was slow; Ben proposed the uv/ruff migration; Ben designed the base-Makefile implementation and rollout; 50+ repositories migrated; four minutes average build time removed.

## Acceptance criteria

- [ ] IDs are unique; Career stages provide year, role, headline, evidence, description, and accent.
- [ ] The Career ID order is `graduate`, `observability`, `associate`, `skao`; personal Project IDs are exactly `pokeleximon` and `safelog`.
- [ ] Internal project IDs match the supported hashes; external links are HTTPS or `mailto:`.
- [ ] The canonical migration sentence occurs once in canonical data.
- [ ] All professional copy is in the new modules; generic equal-weight Work entries are absent from the personal-project catalogue.
- [ ] Verified Pokeleximon and Safelog links are preserved; non-public SKAO links are absent, not `#`.
- [ ] `npm test -- tests/unit/content.test.ts` and `npm run test:coverage` are run, with content helpers measured if present.
- [ ] The Product Owner has compared every rendered claim with source docs and verified content.

Automated evidence: record the focused test and coverage results on the implementation commit.

Manual evidence: Product Owner verifies every rendered canonical value against this packet, PRD §§2 and 7, DESIGN §§7 and 8, and the inventory below.

Defects: record severity, reproduction, expected, actual, and evidence.

Product Owner decision: ACCEPTED only after all criteria pass; otherwise return a bounded copy change request.

## Preserved legacy source inventory

The following entries are copied verbatim from the current legacy data files. Preserve their strings, IDs, tags, and links when migrating the relevant content.

### `src/data/timeline.ts`

```ts
{
  year: 'Present',
  title: 'Junior Software Engineer at SKAO',
  description:
    'Working with Python and control systems in a high-reliability engineering environment, with a focus on maintainability, operational clarity, and high-quality delivery standards.',
},
{
  year: '2024 - 2025',
  title: 'Associate Software Engineer',
  description:
    'Upskilled across Java and Scala during stack migration, and helped deliver Acca Freeze to address a clear product gap at scale.',
},
{
  year: '2024',
  title: 'Degree Work: Observability Improvements',
  description:
    'Delivered a distinction-level dissertation focused on improving observability through better latency metrics and targeted alerting to reduce on-call noise.',
},
{
  year: '2022 - 2024',
  title: 'Technology Graduate',
  description:
    'Completed a Level 7 digital solutions apprenticeship while shipping low-latency event-streaming systems using JavaScript, Kotlin, cloud infrastructure, and CI/CD pipelines.',
},
```

### `src/data/projects.ts`

```ts
{
  id: 'pokeleximon',
  kind: 'personal',
  title: 'Pokeleximon Daily',
  blurb:
    'Pokeleximon is a full-stack daily puzzle app for Pokemon fans, with crosswords, cryptic clues, and Connections-style games. Built with React, TypeScript, Vite, FastAPI, PostgreSQL, Redis, and Docker, it includes custom puzzle-generation pipelines, publishing workflows, admin tooling, and player analytics.',
  image: projectAssetPath('project-pokeleximon.png'),
  tags: ['React', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
  links: [
    { label: 'Live', href: 'https://pokeleximon.com/daily' },
    { label: 'Overview', href: 'https://pokeleximon.com/daily' },
  ],
},
{
  id: 'safelog',
  kind: 'personal',
  title: 'Safelog',
  blurb:
    'Privacy-first log analysis for developers. Detect, redact, and analyze logs locally so you can debug without leaking sensitive data.',
  image: projectAssetPath('project-safelog.png'),
  tags: ['Python', 'CLI', 'Privacy', 'Log Analysis'],
  links: [{ label: 'GitHub', href: 'https://github.com/ben-hutchinson/safelog' }],
},
{
  id: 'dependency-migration',
  kind: 'work',
  title: 'Python Dependency Migration',
  blurb:
    'Migrated development tooling from Poetry to uv and ruff, improving dependency resolution, linting consistency, and the baseline developer workflow that underpinned day-to-day engineering work.',
  tags: ['Python', 'uv', 'ruff', 'Developer Experience'],
  links: [],
},
{
  id: 'acca-freeze',
  kind: 'work',
  title: 'Acca Freeze',
  blurb:
    'Greenfield feature project built in Java, using Maven and Gradle. Took ownership of the testing scaffold (Cucumber) to ensure maximal coverage.',
  tags: ['Java', 'Maven', 'Gradle', 'Cucumber'],
  links: [],
},
```
