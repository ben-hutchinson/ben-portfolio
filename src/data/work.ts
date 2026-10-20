import type { WorkCaseStudy } from './models';

export const workItems = [
  {
    id: 'uv-ruff-migration',
    title: 'Python Dependency Migration',
    context: 'Platform tooling at SKAO.',
    friction: 'Poetry was slow in the existing developer workflow.',
    ownership: 'I proposed the uv/ruff migration.',
    technicalApproach: 'I designed the base-Makefile implementation and rollout.',
    rollout: 'Migrated the shared baseline across 50+ repositories.',
    outcome: 'The shared developer workflow became faster across the migrated repositories.',
    result: 'Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes',
    publicDetail: 'The work is internal, so no public repository or implementation detail is published.',
    links: [],
  },
  {
    id: 'skao-software-catalogue',
    title: 'SKAO Software Catalogue',
    context: 'Software visibility across SKAO sites.',
    friction: 'Version history and deployment information need to be visible across software deployed at different SKAO sites.',
    ownership: 'I built the software catalogue and its bespoke Kubernetes agent.',
    technicalApproach: 'I used a bespoke Kubernetes agent and Backstage to bring software version history and deployment information into one catalogue.',
    rollout: 'The catalogue covers software across SKAO’s different sites.',
    outcome: 'Teams can see software version history and deployment information, including drift and time to release, across sites.',
    result: 'Built a software catalogue using a bespoke Kubernetes agent and Backstage to show version history and deployment information, including drift and time to release, across SKAO’s sites.',
    publicDetail: 'This case study describes the catalogue at a high level; implementation details are not published here.',
    links: [],
  },
] as const satisfies readonly [WorkCaseStudy, ...WorkCaseStudy[]];

export type WorkId = (typeof workItems)[number]['id'];

export const workIds = workItems.map(({ id }) => id) as readonly WorkId[];

export const flagshipWork = workItems[0];

export function isWorkId(value: string): value is WorkId {
  return workIds.some((id) => id === value);
}
