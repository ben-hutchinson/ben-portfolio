import { careerStages } from '../../src/data/career';
import { externalLinks } from '../../src/data/externalLinks';
import type { AppId, CareerStage, CareerStageId, ProjectId } from '../../src/data/models';
import { profile } from '../../src/data/profile';
import * as projectData from '../../src/data/projects';
import * as workData from '../../src/data/work';
import { WINDOW_APP_ORDER } from '../../src/shell/WindowLayer';
import { describe, expect, it } from 'vitest';

const canonicalMigrationSentence =
  'Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes';

const supportedAppIds: readonly AppId[] = ['about', 'work', 'career', 'projects', 'contact'];
const expectedCareerIds: readonly CareerStageId[] = ['graduate', 'observability', 'associate', 'skao'];
const expectedProjectIds = ['pokeleximon', 'safelog', 'trivialise', 'taskmon'];
const allowedCareerAccents = ['orange', 'yellow', 'blue', 'mint'];
const supportedProjectHashes = [
  '#projects/pokeleximon',
  '#projects/safelog',
  '#projects/trivialise',
  '#projects/taskmon',
];

type ProjectRecord = (typeof projectData.projects)[number] & {
  readonly category?: string;
  readonly trailer?: {
    readonly src: string;
    readonly poster: string;
    readonly captions: string;
    readonly description: string;
  };
};

const projects: readonly ProjectRecord[] = projectData.projects;
const projectCatalogue = projectData as typeof projectData & {
  readonly projectIds?: readonly string[];
  readonly isProjectId?: (value: string) => boolean;
};

const addedProjectImages = [
  'assets/ui/project-trivialise.webp',
  'assets/ui/project-taskmon.webp',
  'assets/ui/project-trivialise-trailer-poster.webp',
];

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
    expect(expectedProjectIds).toEqual(['pokeleximon', 'safelog', 'trivialise', 'taskmon']);
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
      for (const asset of [
        project.image,
        ...(project.trailer
          ? [project.trailer.src, project.trailer.poster, project.trailer.captions]
          : []),
      ]) {
        expect(asset).toMatch(/^assets\//);
        expect(asset).not.toMatch(/(^\/|\.\.|https?:)/);
      }
    }
  });

  it('exports runtime project IDs that match the canonical catalogue', () => {
    expect(projectCatalogue.projectIds).toEqual(expectedProjectIds);
    expect(projectCatalogue.projectIds).toEqual(projects.map(({ id }) => id));
    expect(projectCatalogue.isProjectId).toBeTypeOf('function');
    for (const id of expectedProjectIds) {
      expect(projectCatalogue.isProjectId?.(id), id).toBe(true);
    }
  });

  it.each([
    '', 'unknown', 'TRIVIALISE!', 'Trivialise', 'Taskmon', 'Pokeleximon Daily',
    'project trivialise', '#projects/taskmon', 'trivialise/extra', ' taskmon', 'taskmon ',
  ])('rejects non-canonical project identifier %j', (id) => {
    expect(projectCatalogue.isProjectId?.(id)).toBe(false);
  });

  it('gives every project its own data-backed catalogue category', () => {
    expect(projects.map(({ category }) => category)).toEqual([
      'Featured build', 'Focused utility', 'Realtime board game', 'Mini project',
    ]);
  });

  it('preserves the original featured and utility project records', () => {
    expect(projects.slice(0, 2)).toMatchObject([
      {
        id: 'pokeleximon', title: 'Pokeleximon Daily', kind: 'personal',
        image: 'assets/ui/project-pokeleximon.webp',
        tags: ['React', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
        links: [{ label: 'Overview', href: 'https://github.com/ben-hutchinson/pokeleximon' }],
      },
      {
        id: 'safelog', title: 'Safelog', kind: 'personal',
        image: 'assets/ui/project-safelog.webp',
        tags: ['Python', 'CLI', 'Privacy', 'Log Analysis'],
        links: [{ label: 'GitHub', href: 'https://github.com/ben-hutchinson/safelog' }],
      },
    ]);
  });

  it('provides the new projects with screenshots and verified public actions only', () => {
    const trivialise = projects.find(({ id }) => String(id) === 'trivialise');
    const taskmon = projects.find(({ id }) => String(id) === 'taskmon');

    expect(trivialise).toMatchObject({
      title: 'TRIVIALISE!', image: 'assets/ui/project-trivialise.webp', links: [],
    });
    expect(taskmon).toMatchObject({
      title: 'Taskmon', category: 'Mini project', image: 'assets/ui/project-taskmon.webp',
    });
    expect(collectHrefs(taskmon)).toEqual(['https://taskmon.pages.dev']);
  });

  it('attaches a local captioned trailer and descriptive transcript only to TRIVIALISE!', () => {
    expect(projects.filter(({ trailer }) => trailer).map(({ id }) => id)).toEqual(['trivialise']);
    const trailer = projects.find(({ id }) => String(id) === 'trivialise')?.trailer;

    expect(trailer).toMatchObject({
      src: 'assets/video/trivialise-trailer.mp4',
      poster: 'assets/ui/project-trivialise-trailer-poster.webp',
      captions: 'assets/video/trivialise-trailer.en.vtt',
      description: expect.any(String),
    });
    expect(trailer?.description.trim().length).toBeGreaterThan(0);
  });

  it.each(addedProjectImages)('ships %s as a non-empty WebP below the per-image budget', (asset) => {
    const path = resolve('public', asset);

    expect(existsSync(path), asset).toBe(true);
    expect(statSync(path).size).toBeGreaterThan(0);
    expect(statSync(path).size).toBeLessThan(358400);
    const bytes = readFileSync(path);
    expect(bytes.subarray(0, 4).toString()).toBe('RIFF');
    expect(bytes.subarray(8, 12).toString()).toBe('WEBP');
  });

  it('ships the original 4,443,726-byte trailer locally', () => {
    const path = resolve('public/assets/video/trivialise-trailer.mp4');

    expect(existsSync(path)).toBe(true);
    expect(statSync(path).size).toBe(4443726);
  });

  it('ships a non-empty WebVTT caption track for the trailer', () => {
    const path = resolve('public/assets/video/trivialise-trailer.en.vtt');

    expect(existsSync(path)).toBe(true);
    const captions = readFileSync(path, 'utf8');
    expect(captions).toMatch(/^WEBVTT\b/);
    expect(captions).toMatch(/\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}\.\d{3}\s+\S/);
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

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      id: 'uv-ruff-migration',
      outcome: 'The shared developer workflow became faster across the migrated repositories.',
      result: canonicalMigrationSentence,
    });
    expect(flagshipWork()).toBe(items[0]);
    expect(workCatalogue.workIds).toEqual(items.map(({ id }) => id));
    expect(workCatalogue.workIds).toEqual(['uv-ruff-migration', 'skao-software-catalogue']);
    for (const item of items) {
      expect(workCatalogue.isWorkId?.(item.id)).toBe(true);
      expect(item).not.toHaveProperty('technologies');
    }
    expect(workCatalogue.isWorkId?.('Python Dependency Migration')).toBe(false);
  });
});
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
