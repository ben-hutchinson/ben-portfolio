import { careerStages } from '../../src/data/career';
import { externalLinks } from '../../src/data/externalLinks';
import type { AppId, CareerStage, CareerStageId, ProjectId } from '../../src/data/models';
import { profile } from '../../src/data/profile';
import { projects } from '../../src/data/projects';
import { flagshipWork } from '../../src/data/work';
import { describe, expect, it } from 'vitest';

const canonicalMigrationSentence =
  'Migrated 50+ repositories and reduced average build time by four minutes.';

const supportedAppIds: readonly AppId[] = ['about', 'work', 'career', 'projects', 'contact', 'command'];
const expectedCareerIds: readonly CareerStageId[] = ['graduate', 'observability', 'associate', 'skao'];
const expectedProjectIds: readonly ProjectId[] = ['pokeleximon', 'safelog'];
const allowedCareerAccents = ['orange', 'yellow', 'blue', 'mint'];
const supportedProjectHashes = ['#projects/pokeleximon', '#projects/safelog'];

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);

  return [];
}

function collectHrefs(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(collectHrefs);
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return [
      ...(typeof record.href === 'string' ? [record.href] : []),
      ...Object.values(record).flatMap(collectHrefs),
    ];
  }

  return [];
}

describe('canonical portfolio content', () => {
  it('exports the locked app, career, and project ID contracts', () => {
    expect(supportedAppIds).toEqual(['about', 'work', 'career', 'projects', 'contact', 'command']);
    expect(expectedCareerIds).toEqual(['graduate', 'observability', 'associate', 'skao']);
    expect(expectedProjectIds).toEqual(['pokeleximon', 'safelog']);
  });

  it('keeps career stages unique, ordered, and complete', () => {
    const stages: readonly CareerStage[] = careerStages;

    expect(stages.map(({ id }) => id)).toEqual(expectedCareerIds);
    expect(new Set(stages.map(({ id }) => id)).size).toBe(stages.length);

    for (const stage of stages) {
      expect(stage.year.trim()).not.toBe('');
      expect(stage.role.trim()).not.toBe('');
      expect(stage.headline.trim()).not.toBe('');
      expect(stage.evidence.trim()).not.toBe('');
      expect(stage.description.trim()).not.toBe('');
      expect(allowedCareerAccents).toContain(stage.accent);
    }
  });

  it('keeps the personal-project catalogue limited to supported hash destinations', () => {
    const projectIds: readonly ProjectId[] = projects.map(({ id }) => id);

    expect(projectIds).toEqual(expectedProjectIds);
    expect(new Set(projectIds).size).toBe(projectIds.length);
    expect(projectIds.map((id) => `#projects/${id}`)).toEqual(supportedProjectHashes);
    expect(projects.every(({ kind }) => kind === 'personal')).toBe(true);
  });

  it('uses base-safe project asset paths for the configured Vite deployment base', () => {
    for (const project of projects) {
      expect(project.image).not.toMatch(/^\//);
    }
  });

  it('preserves the verified Pokeleximon and Safelog actions', () => {
    const linksByProject = Object.fromEntries(
      projects.map((project) => [project.id, collectHrefs(project)]),
    );

    expect(linksByProject.pokeleximon).toContain('https://pokeleximon.com/daily');
    expect(linksByProject.safelog).toContain('https://github.com/ben-hutchinson/safelog');
  });

  it('uses only HTTPS or mailto external actions', () => {
    const hrefs = collectHrefs([externalLinks, projects]);

    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.every((href) => /^(https:\/\/|mailto:)/.test(href))).toBe(true);
    expect(hrefs).not.toContain('#');
  });

  it('keeps non-public SKAO actions absent instead of publishing placeholders', () => {
    const skaoHrefs = collectHrefs(flagshipWork);

    expect(skaoHrefs).toEqual([]);
    expect(skaoHrefs).not.toContain('#');
  });

  it('stores the flagship migration sentence exactly once across canonical data', () => {
    const canonicalStrings = collectStrings([profile, careerStages, flagshipWork, projects, externalLinks]);
    const sentenceOccurrences = canonicalStrings.filter((value) => value === canonicalMigrationSentence);

    expect(sentenceOccurrences).toHaveLength(1);
  });

  it('does not turn the verified result into annualised or extrapolated savings', () => {
    const canonicalText = collectStrings([profile, careerStages, flagshipWork, projects, externalLinks]).join(' ');

    expect(canonicalText).not.toMatch(/\b(annuali[sz]ed|annual|yearly|per[- ]year|a year|savings?)\b/i);
  });
});
