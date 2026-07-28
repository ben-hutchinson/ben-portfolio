import { describe, expect, it } from 'vitest';
import { projects } from './projects';

describe('featured project briefings', () => {
  it('provides complete verified briefings for the two flagship projects', () => {
    const featured = projects.filter((project) => project.featured);
    expect(featured.map((project) => project.id)).toEqual(['pokeleximon', 'safelog']);
    for (const project of featured) {
      expect(project.category).toBeTruthy();
      expect(project.systemShape?.length ?? 0).toBeGreaterThan(0);
      expect(project.engineeringStory).toBeTruthy();
      expect(project.briefing?.context).toBeTruthy();
      expect(project.briefing?.decisions.length).toBeGreaterThan(0);
    }
  });

  it('uses secure external URLs', () => {
    for (const project of projects) {
      for (const link of project.links) expect(link.href).toMatch(/^https:\/\//);
    }
  });
});
