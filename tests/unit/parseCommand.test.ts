import { describe, expect, it } from 'vitest';
import { parseCommand } from '../../src/apps/command/parseCommand';
import { workIds } from '../../src/data/work';
import { projectIds } from '../../src/data/projects';

describe('parseCommand', () => {
  it.each(projectIds)('selects canonical project %s with an exact shared action', (projectId) => {
    expect(parseCommand(`project ${projectId}`)).toMatchObject({
      kind: 'action', action: { type: 'SELECT_PROJECT', projectId },
    });
    expect(parseCommand(`  PROJECT   ${projectId.toUpperCase()}  `)).toMatchObject({
      kind: 'action', action: { type: 'SELECT_PROJECT', projectId },
    });
  });

  it.each(['help', 'project', 'project unknown'])('offers every canonical project in %j recovery choices', (input) => {
    const result = parseCommand(input);
    expect(result.kind).toBe('message');
    if (result.kind !== 'message') throw new Error('Expected project discovery message');
    for (const projectId of projectIds) expect(result.output).toContain(projectId);
  });

  it.each([
    'project pokeleximon extra', 'project safelog extra',
    'project trivialise extra', 'project taskmon extra',
    'project taskmon trivialise', 'project trivialise/extra', 'project unknown',
  ])('rejects surplus or invalid project arguments without an action: %s', (input) => {
    expect(parseCommand(input)).toMatchObject({ kind: 'message', output: expect.stringMatching(/unknown project/i) });
  });

  it.each([
    ['  WoRK  ', 'action', 'NAVIGATE'],
    ['work uv-ruff-migration', 'action', 'SELECT_WORK'],
    ['career', 'action', 'NAVIGATE'],
    ['PROJECTS', 'action', 'NAVIGATE'],
    ['project POKELEXIMON', 'action', 'SELECT_PROJECT'],
    ['project safelog', 'action', 'SELECT_PROJECT'],
    ['contact', 'action', 'NAVIGATE'],
    ['about', 'action', 'OPEN_APP'],
    ['reset', 'action', 'RESET_LAYOUT'],
    ['clear', 'clear', undefined],
    ['cv', 'download', undefined],
    ['help', 'message', undefined],
  ])('normalizes and parses %j', (input, kind, actionType) => {
    const result = parseCommand(input);
    expect(result.kind).toBe(kind);
    if (result.kind === 'action') expect(result.action.type).toBe(actionType);
  });

  it('helps recover from empty, missing project, missing or unknown Work ID, and misspelled commands', () => {
    expect(parseCommand('')).toEqual({ kind: 'message', output: 'Type help for supported commands.' });
    expect(parseCommand('help')).toMatchObject({
      kind: 'message',
      output: expect.stringContaining(`work <${workIds.join(', ')}>`),
    });
    expect(parseCommand('project')).toMatchObject({ kind: 'message', output: expect.stringMatching(/pokeleximon.*safelog/i) });
    expect(parseCommand('project other')).toMatchObject({ kind: 'message', output: expect.stringMatching(/unknown project/i) });
    expect(parseCommand('work other')).toMatchObject({
      kind: 'message',
      output: expect.stringContaining(workIds.join(', ')),
    });
    expect(parseCommand('carear')).toMatchObject({ kind: 'message', output: expect.stringMatching(/career/i) });
  });

  it.each(['help; reset', '$(reset)', '<script>alert(1)</script>', 'project safelog && clear'])('keeps shell-like input inert: %s', (input) => {
    const result = parseCommand(input);
    expect(result.kind).toBe('message');
    expect(result).toMatchObject({ output: expect.stringMatching(/unknown command/i) });
  });
});
