import { projectAssetPath } from '../utils/assets';
import type { ProjectEntry } from './types';

export const projects: ProjectEntry[] = [
  {
    id: 'pokeleximon',
    kind: 'personal',
    title: 'Pokeleximon Daily',
    blurb:
      'Pokeleximon is a full-stack daily puzzle app for Pokemon fans, with crosswords, cryptic clues, and Connections-style games. Built with React, TypeScript, Vite, FastAPI, PostgreSQL, Redis, and Docker, it includes custom puzzle-generation pipelines, publishing workflows, admin tooling, and player analytics.',
    image: projectAssetPath('project-pokeleximon.png'),
    tags: ['React', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    featured: true,
    category: 'Daily puzzle app',
    systemShape: ['React', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    engineeringStory:
      'Built with React, TypeScript, Vite, FastAPI, PostgreSQL, Redis, and Docker, it includes custom puzzle-generation pipelines, publishing workflows, admin tooling, and player analytics.',
    briefing: {
      context:
        'Pokeleximon is a full-stack daily puzzle app for Pokemon fans, with crosswords, cryptic clues, and Connections-style games.',
      constraint:
        'Built with React, TypeScript, Vite, FastAPI, PostgreSQL, Redis, and Docker.',
      responsibilities: [
        'Custom puzzle-generation pipelines',
        'Publishing workflows',
        'Admin tooling',
        'Player analytics',
      ],
      decisions: [
        'React, TypeScript, and Vite',
        'FastAPI, PostgreSQL, Redis, and Docker',
      ],
      delivery:
        'It includes custom puzzle-generation pipelines, publishing workflows, admin tooling, and player analytics.',
      outcome:
        'Pokeleximon is a full-stack daily puzzle app for Pokemon fans, with crosswords, cryptic clues, and Connections-style games.',
    },
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
    featured: true,
    category: 'Privacy-first log analysis',
    systemShape: ['Python', 'CLI', 'Privacy', 'Log Analysis'],
    engineeringStory:
      'Detect, redact, and analyze logs locally so you can debug without leaking sensitive data.',
    briefing: {
      context: 'Privacy-first log analysis for developers.',
      constraint:
        'Detect, redact, and analyze logs locally so you can debug without leaking sensitive data.',
      responsibilities: ['Detect sensitive data', 'Redact sensitive data', 'Analyze logs locally'],
      decisions: ['Analyze logs locally.', 'Privacy-first log analysis for developers.'],
      delivery: 'Privacy-first log analysis for developers.',
      outcome:
        'Detect, redact, and analyze logs locally so you can debug without leaking sensitive data.',
    },
    links: [{ label: 'GitHub', href: 'https://github.com/ben-hutchinson/safelog' }],
  },
  {
    id: 'dependency-migration',
    kind: 'work',
    title: 'Python Dependency Migration',
    blurb:
      'Migrated development tooling from Poetry to uv and ruff, improving dependency resolution, linting consistency, and the baseline developer workflow that underpinned day-to-day engineering work.',
    tags: ['Python', 'uv', 'ruff', 'Developer Experience'],
    systemShape: ['Python', 'uv', 'ruff', 'Developer Experience'],
    links: [],
  },
  {
    id: 'acca-freeze',
    kind: 'work',
    title: 'Acca Freeze',
    blurb:
      'Greenfield feature project built in Java, using Maven and Gradle. Took ownership of the testing scaffold (Cucumber) to ensure maximal coverage.',
    tags: ['Java', 'Maven', 'Gradle', 'Cucumber'],
    systemShape: ['Java', 'Maven', 'Gradle', 'Cucumber'],
    links: [],
  },
];
