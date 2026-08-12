import type { PortfolioAction } from '../../app/portfolioReducer';
import type { ProjectId } from '../../data/models';

export type CommandResult =
  | { readonly kind: 'action'; readonly output: string; readonly action: PortfolioAction }
  | { readonly kind: 'message'; readonly output: string }
  | { readonly kind: 'download'; readonly output: string }
  | { readonly kind: 'clear' };

export interface CommandDefinition {
  readonly name: string;
  readonly usage: string;
  readonly description: string;
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
    name: 'help', usage: 'help', description: 'Show this command guide',
    execute: () => ({ kind: 'message', output: 'Try: help, about, work, career, projects, project <pokeleximon|safelog>, contact, cv, reset, clear.' }),
  },
  {
    name: 'about', usage: 'about', description: 'Open Ben’s profile',
    execute: () => ({ kind: 'action', output: 'Opening about.', action: { type: 'OPEN_APP', appId: 'about' } }),
  },
  { name: 'work', usage: 'work', description: 'Open the flagship work case', execute: route('work') },
  { name: 'career', usage: 'career', description: 'Open the career timeline', execute: route('career') },
  { name: 'projects', usage: 'projects', description: 'Open the project catalogue', execute: route('projects') },
  {
    name: 'project', usage: 'project <pokeleximon|safelog>', description: 'Open a project case study',
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
  { name: 'contact', usage: 'contact', description: 'Open direct contact options', execute: route('contact') },
  {
    name: 'cv', usage: 'cv', description: 'Show the CV download',
    execute: () => ({ kind: 'download', output: 'CV ready to download.' }),
  },
  {
    name: 'reset', usage: 'reset', description: 'Restore the desktop layout',
    execute: () => ({ kind: 'action', output: 'Desktop layout reset.', action: { type: 'RESET_LAYOUT' } }),
  },
  { name: 'clear', usage: 'clear', description: 'Clear command output', execute: () => ({ kind: 'clear' }) },
];
