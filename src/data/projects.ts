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
];
