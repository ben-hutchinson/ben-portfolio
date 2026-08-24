import type { PortfolioAction } from '../../app/portfolioReducer';
import type { ProjectId } from '../../data/models';
import { isWorkId, workIds } from '../../data/work';

export type CommandResult =
  | { readonly kind: 'action'; readonly output: string; readonly action: PortfolioAction }
  | { readonly kind: 'message'; readonly output: string }
  | { readonly kind: 'download'; readonly output: string }
  | { readonly kind: 'clear' };

export interface CommandDefinition {
  readonly name: string;
  execute(args: readonly string[]): CommandResult;
}

const route = (kind: 'work' | 'career' | 'projects' | 'contact'): CommandDefinition['execute'] => () => ({
  kind: 'action',
  output: `Opening ${kind}.`,
  action: { type: 'NAVIGATE', route: { kind } },
});

const projectIds: readonly ProjectId[] = ['pokeleximon', 'safelog'];

export const commandRegistry: readonly CommandDefinition[] = [
  {
    name: 'help',
    execute: () => ({
      kind: 'message',
      output: `Try: help, about, work, work <${workIds.join(', ')}>, career, projects, project <pokeleximon|safelog>, contact, cv, reset, clear.`,
    }),
  },
  {
    name: 'about',
    execute: () => ({ kind: 'action', output: 'Opening about.', action: { type: 'OPEN_APP', appId: 'about' } }),
  },
  {
    name: 'work',
    execute: (args) => {
      const workId = args[0];
      if (workId === undefined) return route('work')([]);
      if (args.length !== 1 || !isWorkId(workId)) {
        return { kind: 'message', output: `Unknown work case “${workId}”. Try: ${workIds.join(', ')}.` };
      }
      return {
        kind: 'action',
        output: `Opening ${workId}.`,
        action: { type: 'SELECT_WORK', workId },
      };
    },
  },
  { name: 'career', execute: route('career') },
  { name: 'projects', execute: route('projects') },
  {
    name: 'project',
    execute: (args) => {
      const projectId = args[0];
      if (projectId === undefined) return { kind: 'message', output: 'Choose a project: pokeleximon or safelog.' };
      if (!projectIds.includes(projectId as ProjectId)) return { kind: 'message', output: `Unknown project “${projectId}”. Try pokeleximon or safelog.` };
      return {
        kind: 'action',
        output: `Opening ${projectId}.`,
        action: { type: 'SELECT_PROJECT', projectId: projectId as ProjectId },
      };
    },
  },
  { name: 'contact', execute: route('contact') },
  {
    name: 'cv',
    execute: () => ({ kind: 'download', output: 'CV ready to download.' }),
  },
  {
    name: 'reset',
    execute: () => ({ kind: 'action', output: 'Desktop layout reset.', action: { type: 'RESET_LAYOUT' } }),
  },
  { name: 'clear', execute: () => ({ kind: 'clear' }) },
];
