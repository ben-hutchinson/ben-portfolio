import type { Project } from './models';

export const projects = [
  {
    id: 'pokeleximon',
    kind: 'personal',
    title: 'Pokeleximon Daily',
    blurb:
      'Pokeleximon is a full-stack daily puzzle app for Pokemon fans, with crosswords, cryptic clues, and Connections-style games. Built with React, TypeScript, Vite, FastAPI, PostgreSQL, Redis, and Docker, it includes custom puzzle-generation pipelines, publishing workflows, admin tooling, and player analytics.',
    image: 'assets/ui/project-pokeleximon.png',
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
    image: 'assets/ui/project-safelog.png',
    tags: ['Python', 'CLI', 'Privacy', 'Log Analysis'],
    links: [{ label: 'GitHub', href: 'https://github.com/ben-hutchinson/safelog' }],
  },
] as const satisfies readonly Project[];
