import type { WorkCaseStudy } from './models';

export const flagshipWork = {
  title: 'Python Dependency Migration',
  context: 'Platform tooling at SKAO.',
  friction: 'Poetry was slow in the existing developer workflow.',
  ownership: 'I proposed the uv/ruff migration.',
  technicalApproach: 'I designed the base-Makefile implementation and rollout.',
  rollout: 'Migrated the shared baseline across 50+ repositories.',
  result: 'Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes',
  publicDetail: 'The work is internal, so no public repository or implementation detail is published.',
  links: [],
} as const satisfies WorkCaseStudy;
