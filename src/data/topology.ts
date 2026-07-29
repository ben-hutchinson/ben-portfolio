import type { TopologyGroupId, TopologyNode } from './types';

export const topologyGroups: { id: TopologyGroupId; label: string }[] = [
  { id: 'platform', label: 'Platform & reliability' },
  { id: 'product', label: 'Product systems' },
  { id: 'tooling', label: 'Developer tooling' },
];

export const topologyNodes: TopologyNode[] = [
  {
    id: 'skao',
    label: 'SKAO',
    description: 'Mission-driven Python control systems',
    groups: ['platform'],
  },
  {
    id: 'flutter',
    label: 'Flutter UKI',
    description: 'Production systems and operational ownership',
    groups: ['platform', 'product'],
  },
  {
    id: 'pokeleximon',
    label: 'Pokeleximon',
    description: 'API, data, automation and frontend',
    groups: ['product', 'tooling'],
  },
  {
    id: 'safelog',
    label: 'Safelog',
    description: 'Privacy-first developer workflow',
    groups: ['tooling'],
  },
  {
    id: 'observability',
    label: 'Observability',
    description: 'Useful signals and targeted alerts',
    groups: ['platform', 'tooling'],
  },
];
