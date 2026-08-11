import type { PortfolioRoute } from './portfolioState';

export interface HashParseResult {
  readonly route: PortfolioRoute;
  readonly isKnown: boolean;
}

const HASH_ROUTES: Readonly<Record<string, PortfolioRoute>> = {
  '#desktop': { kind: 'desktop' },
  '#work': { kind: 'work' },
  '#career': { kind: 'career' },
  '#projects': { kind: 'projects' },
  '#projects/pokeleximon': { kind: 'project', projectId: 'pokeleximon' },
  '#projects/safelog': { kind: 'project', projectId: 'safelog' },
  '#contact': { kind: 'contact' },
};

export function parseHash(hash: string): HashParseResult {
  const route = HASH_ROUTES[hash];
  return route
    ? { route, isKnown: true }
    : { route: { kind: 'desktop' }, isKnown: false };
}

export function serializeHash(route: PortfolioRoute): string {
  switch (route.kind) {
    case 'desktop':
      return '#desktop';
    case 'work':
      return '#work';
    case 'career':
      return '#career';
    case 'projects':
      return '#projects';
    case 'project':
      return `#projects/${route.projectId}`;
    case 'contact':
      return '#contact';
  }
}
