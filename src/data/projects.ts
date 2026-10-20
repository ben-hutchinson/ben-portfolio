import type { Project, ProjectId } from './models';

export const projects = [
  {
    id: 'pokeleximon',
    kind: 'personal',
    category: 'Featured build',
    title: 'Pokeleximon Daily',
    blurb:
      'Pokeleximon is a full-stack daily puzzle app for Pokemon fans, with crosswords, cryptic clues, and Connections-style games. Built with React, TypeScript, Vite, FastAPI, PostgreSQL, Redis, and Docker, it includes custom puzzle-generation pipelines, publishing workflows, admin tooling, and player analytics.',
    image: 'assets/ui/project-pokeleximon.webp',
    tags: ['React', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    links: [{ label: 'Overview', href: 'https://github.com/ben-hutchinson/pokeleximon' }],
  },
  {
    id: 'safelog',
    kind: 'personal',
    category: 'Focused utility',
    title: 'Safelog',
    blurb:
      'Privacy-first log analysis for developers. Detect, redact, and analyze logs locally so you can debug without leaking sensitive data.',
    image: 'assets/ui/project-safelog.webp',
    tags: ['Python', 'CLI', 'Privacy', 'Log Analysis'],
    links: [{ label: 'GitHub', href: 'https://github.com/ben-hutchinson/safelog' }],
  },
  {
    id: 'trivialise',
    kind: 'personal',
    category: 'Realtime board game',
    title: 'TRIVIALISE!',
    blurb:
      'An online trivia board game where knowledge earns movement, branching routes create choices, and tactical cards add chaos. A shared display and private phone controllers connect to authoritative realtime rooms, with reconnect recovery and deterministic game rules.',
    image: 'assets/ui/project-trivialise.webp',
    tags: ['React', 'TypeScript', 'PixiJS', 'Cloudflare Durable Objects', 'WebSockets'],
    links: [],
    trailer: {
      src: 'assets/video/trivialise-trailer.mp4',
      poster: 'assets/ui/project-trivialise-trailer-poster.webp',
      captions: 'assets/video/trivialise-trailer.en.vtt',
      description:
        'Upbeat instrumental music accompanies this 20-second animated trailer. “Trivia was too calm” appears on purple, followed by the TRIVIALISE! logo and three mascot tokens. “Pick your question” introduces easy, medium and hard offers worth one, three and five spaces. Under “Trivia earns progress,” a token hops along a branching board. “Everyone else · buzz now” leads into “Steal!” and four buzzer symbols. A Double Draw card flips into view beside “One card can change the story.” The trailer ends with the logo and “Tension. Answer. Reveal. Hop. Chaos.”',
    },
  },
  {
    id: 'taskmon',
    kind: 'personal',
    category: 'Mini project',
    title: 'Taskmon',
    blurb:
      'A small habit tracker that turns everyday tasks into Pokémon encounters. An installable React and TypeScript PWA with offline play, local IndexedDB saves, catching and Pokédex progression.',
    image: 'assets/ui/project-taskmon.webp',
    tags: ['React', 'TypeScript', 'PWA', 'IndexedDB'],
    links: [{ label: 'Live app', href: 'https://taskmon.pages.dev' }],
  },
] as const satisfies readonly Project[];

export const projectIds: readonly ProjectId[] = projects.map(({ id }) => id);

export function isProjectId(value: string): value is ProjectId {
  return projectIds.some((id) => id === value);
}
