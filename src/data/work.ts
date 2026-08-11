import type { WorkCaseStudy } from './models';

export const flagshipWork = {
  title: 'Python Dependency Migration',
  context: 'Platform tooling at SKAO.',
  friction: 'Poetry was slow in the existing developer workflow.',
  ownership: 'Ben proposed the uv/ruff migration.',
  technicalApproach: 'Ben designed the base-Makefile implementation and rollout.',
  rollout: 'Migrated the shared baseline across 50+ repositories.',
  result: 'Migrated 50+ repositories and reduced average build time by four minutes.',
  technologies: ['Python', 'uv', 'ruff', 'Makefile'],
  publicDetail: 'The work is internal, so no public repository or implementation detail is published.',
  links: [],
} as const satisfies WorkCaseStudy;
