import type { PortfolioAction } from '../../app/portfolioReducer';
import { isProjectId, projectIds } from '../../data/projects';
import { isWorkId, workIds } from '../../data/work';

export type CommandResult =
  | { readonly kind: 'action'; readonly output: string; readonly action: PortfolioAction }
  | { readonly kind: 'message'; readonly output: string }
  | { readonly kind: 'download'; readonly output: string }
  | { readonly kind: 'clear' };

export interface CommandDefinition {
  readonly name: string;
  readonly label: string;
  readonly description: string;
  execute(args: readonly string[]): CommandResult;
}

const route = (kind: 'work' | 'career' | 'projects' | 'contact'): CommandDefinition['execute'] => () => ({
  kind: 'action',
  output: `Opening ${kind}.`,
  action: { type: 'NAVIGATE', route: { kind } },
});

export const commandRegistry: readonly CommandDefinition[] = [
  {
    name: 'help',
    label: 'Command help',
    description: 'See the supported portfolio commands.',
    execute: () => ({
      kind: 'message',
      output: `Try: help, about, work, work <${workIds.join(', ')}>, career, projects, project <${projectIds.join('|')}>, contact, cv, reset, clear.`,
    }),
  },
  {
    name: 'about',
    label: 'About Ben',
    description: 'Read about Ben and his engineering approach.',
    execute: () => ({ kind: 'action', output: 'Opening about.', action: { type: 'OPEN_APP', appId: 'about' } }),
  },
  {
    name: 'work',
    label: 'Professional work',
    description: 'Explore engineering case studies from SKAO.',
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
  { name: 'career', label: 'Career', description: 'Explore roles and milestones through the career timeline.', execute: route('career') },
  { name: 'projects', label: 'Personal projects', description: 'Browse independent builds and focused utilities.', execute: route('projects') },
  {
    name: 'project',
    label: 'Open a project',
    description: 'Choose a personal project case study.',
    execute: (args) => {
      const projectId = args[0];
      if (projectId === undefined) return { kind: 'message', output: `Choose a project: ${projectIds.join(', ')}.` };
      if (args.length !== 1 || !isProjectId(projectId)) {
        return { kind: 'message', output: `Unknown project “${projectId}”. Try: ${projectIds.join(', ')}.` };
      }
      return {
        kind: 'action',
        output: `Opening ${projectId}.`,
        action: { type: 'SELECT_PROJECT', projectId },
      };
    },
  },
  { name: 'contact', label: 'Contact', description: 'Find email and professional profile links.', execute: route('contact') },
  {
    name: 'cv',
    label: 'Download CV',
    description: 'Get Ben’s CV as a PDF.',
    execute: () => ({ kind: 'download', output: 'CV ready to download.' }),
  },
  {
    name: 'reset',
    label: 'Reset layout',
    description: 'Return windows to the starting desktop layout.',
    execute: () => ({ kind: 'action', output: 'Desktop layout reset.', action: { type: 'RESET_LAYOUT' } }),
  },
  { name: 'clear', label: 'Clear terminal', description: 'Clear the latest command result.', execute: () => ({ kind: 'clear' }) },
];
