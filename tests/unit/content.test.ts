import { careerStages } from '../../src/data/career';
import { externalLinks } from '../../src/data/externalLinks';
import type { AppId, CareerStage, CareerStageId, ProjectId } from '../../src/data/models';
import { profile } from '../../src/data/profile';
import { projects } from '../../src/data/projects';
import * as workData from '../../src/data/work';
import { WINDOW_APP_ORDER } from '../../src/shell/WindowLayer';
import { describe, expect, it } from 'vitest';

const canonicalMigrationSentence =
  'Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes';

const supportedAppIds: readonly AppId[] = ['about', 'work', 'career', 'projects', 'contact'];
const expectedCareerIds: readonly CareerStageId[] = ['graduate', 'observability', 'associate', 'skao'];
const expectedProjectIds: readonly ProjectId[] = ['pokeleximon', 'safelog'];
const allowedCareerAccents = ['orange', 'yellow', 'blue', 'mint'];
const supportedProjectHashes = ['#projects/pokeleximon', '#projects/safelog'];

type WorkRecord = {
  readonly id: string;
  readonly title: string;
  readonly context: string;
  readonly friction: string;
  readonly ownership: string;
  readonly technicalApproach: string;
  readonly rollout: string;
  readonly outcome: string;
  readonly result: string;
  readonly publicDetail: string;
  readonly links: readonly unknown[];
};

const workCatalogue = workData as typeof workData & {
  readonly workItems?: readonly WorkRecord[];
  readonly workIds?: readonly string[];
  readonly isWorkId?: (value: string) => boolean;
};

function workItems(): readonly WorkRecord[] {
  return workCatalogue.workItems ?? [];
}

function flagshipWork(): WorkRecord | undefined {
  return workData.flagshipWork as WorkRecord | undefined;
}

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
    expect(supportedAppIds).toEqual(['about', 'work', 'career', 'projects', 'contact']);
    expect(WINDOW_APP_ORDER).toEqual(['about', 'work', 'career', 'projects', 'contact']);
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

  it('exposes one exact Pokeleximon repository Overview action', () => {
    const pokeleximon = projects.find(({ id }) => id === 'pokeleximon');

    expect(pokeleximon?.links).toEqual([
      { label: 'Overview', href: 'https://github.com/ben-hutchinson/pokeleximon' },
    ]);
  });

  it('preserves the verified Safelog repository action', () => {
    const safelog = projects.find(({ id }) => id === 'safelog');

    expect(collectHrefs(safelog)).toContain('https://github.com/ben-hutchinson/safelog');
  });

  it('uses only HTTPS or mailto external actions', () => {
    const hrefs = collectHrefs([externalLinks, projects]);

    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.every((href) => /^(https:\/\/|mailto:)/.test(href))).toBe(true);
    expect(hrefs).not.toContain('#');
  });

  it('keeps non-public SKAO actions absent instead of publishing placeholders', () => {
    const skaoHrefs = collectHrefs(flagshipWork());

    expect(skaoHrefs).toEqual([]);
    expect(skaoHrefs).not.toContain('#');
  });

  it('stores the flagship migration sentence exactly once across canonical data', () => {
    const canonicalStrings = collectStrings([profile, careerStages, flagshipWork(), projects, externalLinks]);
    const sentenceOccurrences = canonicalStrings.filter((value) => value === canonicalMigrationSentence);

    expect(sentenceOccurrences).toHaveLength(1);
  });

  it('keeps the flagship Work evidence in the approved first-person wording without Work technology data', () => {
    expect(flagshipWork()?.result).toBe(
      'Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes',
    );
    expect(flagshipWork()?.ownership).toBe('I proposed the uv/ruff migration.');
    expect(flagshipWork()?.technicalApproach).toBe(
      'I designed the base-Makefile implementation and rollout.',
    );
    expect(flagshipWork()).not.toHaveProperty('technologies');
    expect(projects.every((project) => project.tags.length > 0)).toBe(true);
  });

  it('does not turn the verified result into annualised or extrapolated savings', () => {
    const canonicalText = collectStrings([profile, careerStages, flagshipWork(), projects, externalLinks]).join(' ');

    expect(canonicalText).not.toMatch(/\b(annuali[sz]ed|annual|yearly|per[- ]year|a year|savings?)\b/i);
  });

  it('derives the professional Work catalogue and accepted IDs from the single typed collection', () => {
    const items = workItems();

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: 'uv-ruff-migration',
      outcome: 'The shared developer workflow became faster across the migrated repositories.',
      result: canonicalMigrationSentence,
    });
    expect(flagshipWork()).toBe(items[0]);
    expect(workCatalogue.workIds).toEqual(items.map(({ id }) => id));
    expect(workCatalogue.workIds).toEqual(['uv-ruff-migration']);
    expect(workCatalogue.isWorkId?.('uv-ruff-migration')).toBe(true);
    expect(workCatalogue.isWorkId?.('Python Dependency Migration')).toBe(false);
    expect(items[0]).not.toHaveProperty('technologies');
  });
});
