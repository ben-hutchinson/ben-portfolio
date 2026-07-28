import { describe, expect, it } from 'vitest';
import { topologyGroups, topologyNodes } from './topology';

describe('systems topology', () => {
  it('contains the five approved nodes', () => {
    expect(topologyNodes.map((node) => node.id)).toEqual([
      'skao',
      'flutter',
      'pokeleximon',
      'safelog',
      'observability',
    ]);
  });

  it('has at least one node in every focus group', () => {
    for (const group of topologyGroups) {
      expect(topologyNodes.some((node) => node.groups.includes(group.id))).toBe(true);
    }
  });
});
