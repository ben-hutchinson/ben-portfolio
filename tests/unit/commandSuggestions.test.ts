import { afterEach, describe, expect, it, vi } from 'vitest';
import { commandRegistry, type CommandDefinition } from '../../src/apps/command/commandRegistry';
import { parseCommand } from '../../src/apps/command/parseCommand';
import { projects } from '../../src/data/projects';
import { workItems } from '../../src/data/work';

interface Suggestion {
  readonly command: string;
  readonly label: string;
  readonly description: string;
}

type Matcher = (input: string, limit?: number) => readonly Suggestion[];
const matcherModules = import.meta.glob<{ getCommandSuggestions: Matcher }>(
  '../../src/apps/command/commandSuggestions.ts',
);

async function loadMatcher(): Promise<Matcher> {
  const loader = matcherModules['../../src/apps/command/commandSuggestions.ts'];
  expect(loader, 'The pure command suggestion matcher should be available').toBeTypeOf('function');
  const module = await loader!();
  expect(module.getCommandSuggestions).toBeTypeOf('function');
  return module.getCommandSuggestions;
}

function commands(suggestions: readonly Suggestion[]): readonly string[] {
  return suggestions.map(({ command }) => command);
}

async function registryFixture(entries: readonly { readonly name: string; readonly label?: string; readonly description?: string }[]) {
  vi.resetModules();
  const definitions = entries.map(({ name, label = name, description = 'Navigation choice' }) => ({
    name, label, description,
    execute: vi.fn<CommandDefinition['execute']>(() => ({ kind: 'message', output: 'Fixture command' })),
  }));
  vi.doMock('../../src/apps/command/commandRegistry', () => ({ commandRegistry: definitions }));
  vi.doMock('../../src/data/projects', async () => ({
    ...await vi.importActual<typeof import('../../src/data/projects')>('../../src/data/projects'),
    projects: [],
  }));
  vi.doMock('../../src/data/work', async () => ({
    ...await vi.importActual<typeof import('../../src/data/work')>('../../src/data/work'),
    workItems: [],
  }));
  return { get: await loadMatcher(), definitions };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.doUnmock('../../src/apps/command/commandRegistry');
  vi.doUnmock('../../src/data/projects');
  vi.doUnmock('../../src/data/work');
  vi.resetModules();
});

describe('command suggestions with canonical portfolio data', () => {
  it('gives every registered root command readable discovery metadata', () => {
    for (const definition of commandRegistry) {
      const metadata = definition as CommandDefinition & { readonly label?: string; readonly description?: string };
      expect(metadata.label, definition.name).toBeTypeOf('string');
      expect(metadata.label?.trim(), definition.name).not.toBe('');
      expect(metadata.description, definition.name).toBeTypeOf('string');
      expect(metadata.description?.trim(), definition.name).not.toBe('');
    }
  });

  it.each(['', '   ', '\t\n'])('offers the six useful focused-empty examples for %j', async (query) => {
    const get = await loadMatcher();
    const results = get(query);
    expect(commands(results)).toEqual(['help', 'work', 'career', 'projects', 'contact', 'cv']);
    for (const result of results) {
      expect(result.label.trim()).not.toBe('');
      expect(result.description.trim()).not.toBe('');
    }
  });

  it.each([
    ['triv', 'project trivialise'], ['task', 'project taskmon'],
    ['catalog', 'work skao-software-catalogue'], ['carrer', 'career'],
    ['phone', 'project trivialise'], ['daily', 'project pokeleximon'],
  ])('finds %j as exact canonical command %s', async (query, expected) => {
    const get = await loadMatcher();
    expect(commands(get(query))).toContain(expected);
  });

  it('normalizes case and repeated whitespace for matching', async () => {
    const get = await loadMatcher();
    const query = '  PROJECT   taSk  ';
    expect(get(query)).toEqual(get('project task'));
  });

  it.each(['project', 'work'])('ranks the exact bare %s root command before detail matches', async (query) => {
    const get = await loadMatcher();
    expect(get(query)[0]?.command).toBe(query);
  });

  it('detects trailing-space project and Work contexts before trimming', async () => {
    const get = await loadMatcher();
    expect(commands(get('project '))).toEqual([
      'project pokeleximon', 'project safelog', 'project trivialise', 'project taskmon',
    ]);
    expect(commands(get('work '))).toEqual(['work uv-ruff-migration', 'work skao-software-catalogue']);
    expect(get('  PROJECT   ')).toEqual(get('project '));
    expect(get('  WoRK   ')).toEqual(get('work '));
    expect(commands(get('project task'))).toEqual(['project taskmon']);
    expect(commands(get('work catalog'))).toEqual(['work skao-software-catalogue']);
  });

  it('requires every query token to match while searching title and description words', async () => {
    const get = await loadMatcher();
    expect(commands(get('trivia phone'))).toContain('project trivialise');
    expect(commands(get('software catalogue'))).toContain('work skao-software-catalogue');
    expect(get('triv zzzq')).toEqual([]);
  });

  it.each(projects)('discovers and parses the canonical project $id', async (project) => {
    const get = await loadMatcher();
    const result = get(`project ${project.id}`)[0];
    expect(result?.command).toBe(`project ${project.id}`);
    expect(result?.label).toContain(project.title);
    expect(result?.description.trim()).not.toBe('');
    expect(parseCommand(result!.command)).toMatchObject({
      kind: 'action', action: { type: 'SELECT_PROJECT', projectId: project.id },
    });
  });

  it.each(workItems)('discovers and parses the canonical Work case $id', async (work) => {
    const get = await loadMatcher();
    const result = get(`work ${work.id}`)[0];
    expect(result?.command).toBe(`work ${work.id}`);
    expect(result?.label).toContain(work.title);
    expect(result?.description.trim()).not.toBe('');
    expect(parseCommand(result!.command)).toMatchObject({
      kind: 'action', action: { type: 'SELECT_WORK', workId: work.id },
    });
  });

  it.each(['zzzzq', 'help; reset', '$(reset)', '`reset`', 'work | clear', 'cv && reset', '<script>alert(1)</script>'])(
    'offers no executable completion for unmatched or hostile input %j', async (query) => {
      const get = await loadMatcher();
      expect(get(query)).toEqual([]);
    },
  );

  it('never invokes a command while generating navigation, clear or download suggestions', async () => {
    const executions = commandRegistry.map((definition) => vi.spyOn(definition, 'execute'));
    const get = await loadMatcher();
    const hashBefore = window.location.hash;
    for (const query of ['', 'career', 'reset', 'clear', 'cv', 'project taskmon', 'work skao-software-catalogue']) get(query);
    for (const execution of executions) expect(execution).not.toHaveBeenCalled();
    expect(window.location.hash).toBe(hashBefore);
  });
});

describe('command suggestion ranking with independent candidate fixtures', () => {
  it('orders exact, stable prefixes, substring, subsequence and fuzzy tiers; deduplicates and limits', async () => {
    const { get, definitions } = await registryFixture(
      ['plat', 'playstation', 'explanatory', 'planet', 'planned', 'plan', 'planet', 'planets'].map((name) => ({ name })),
    );
    expect(commands(get('plan', 20))).toEqual([
      'plan', 'planet', 'planned', 'planets', 'explanatory', 'playstation', 'plat',
    ]);
    expect(commands(get('plan'))).toEqual(['plan', 'planet', 'planned', 'planets', 'explanatory', 'playstation']);
    expect(commands(get('plan', 3))).toEqual(['plan', 'planet', 'planned']);
    for (const definition of definitions) expect(definition.execute).not.toHaveBeenCalled();
  });

  it('treats title punctuation as word boundaries before substring matching', async () => {
    const { get } = await registryFixture([
      { name: 'abetamax' },
      { name: 'one', label: 'Alpha-beta! Gamma' },
    ]);
    expect(commands(get('beta'))).toEqual(['one', 'abetamax']);
  });

  it('requires all query tokens even when they match different candidate fields', async () => {
    const { get } = await registryFixture([
      { name: 'one', label: 'Alpha', description: 'Beta' },
      { name: 'two', label: 'Alpha', description: 'Unrelated' },
    ]);
    expect(commands(get('alpha beta'))).toEqual(['one']);
  });

  it('allows edit distance two but rejects three', async () => {
    const { get } = await registryFixture([{ name: 'qxan' }, { name: 'qxzn' }]);
    expect(commands(get('plan'))).toEqual(['qxan']);
  });

  it('reserves edit-distance matching for query tokens of at least four characters', async () => {
    const { get } = await registryFixture([{ name: 'abd' }]);
    expect(get('abc')).toEqual([]);
    expect(commands(get('abdc'))).toEqual(['abd']);
  });
});
