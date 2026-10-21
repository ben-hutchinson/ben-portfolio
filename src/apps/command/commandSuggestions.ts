import { projects } from '../../data/projects';
import { workItems } from '../../data/work';
import { commandRegistry } from './commandRegistry';
import { editDistance } from './parseCommand';

export interface CommandSuggestion {
  readonly command: string;
  readonly label: string;
  readonly description: string;
}

interface Candidate {
  readonly suggestion: CommandSuggestion;
  readonly context: 'root' | 'project' | 'work';
  readonly searchText: string;
}

const defaultCommands = ['help', 'work', 'career', 'projects', 'contact', 'cv'];

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function words(value: string): readonly string[] {
  return normalize(value).match(/[\p{L}\p{N}]+/gu) ?? [];
}

function candidates(): readonly Candidate[] {
  const roots: readonly Candidate[] = commandRegistry.map(({ name, label, description }) => ({
    suggestion: { command: name, label, description },
    context: 'root',
    searchText: `${name} ${label} ${description}`,
  }));
  const projectDetails: readonly Candidate[] = projects.map((project) => ({
    suggestion: {
      command: `project ${project.id}`,
      label: project.title,
      description: project.blurb.split('. ')[0] ?? project.blurb,
    },
    context: 'project',
    searchText: `project ${project.id} ${project.title} ${project.blurb}`,
  }));
  const workDetails: readonly Candidate[] = workItems.map((work) => ({
    suggestion: { command: `work ${work.id}`, label: work.title, description: work.context },
    context: 'work',
    searchText: `work ${work.id} ${work.title} ${work.context}`,
  }));
  const unique = new Map<string, Candidate>();
  for (const candidate of [...roots, ...projectDetails, ...workDetails]) {
    if (!unique.has(candidate.suggestion.command)) unique.set(candidate.suggestion.command, candidate);
  }
  return [...unique.values()];
}

function isSubsequence(query: string, word: string): boolean {
  let position = 0;
  for (const character of word) {
    if (query[position] === character) position += 1;
  }
  return position === query.length;
}

function tokenRank(query: string, searchWords: readonly string[]): number {
  if (searchWords.some((word) => word.startsWith(query))) return 1;
  if (searchWords.some((word) => word.includes(query))) return 2;
  if (searchWords.some((word) => isSubsequence(query, word))) return 3;
  if (query.length >= 4 && searchWords.some((word) => editDistance(query, word) <= 2)) return 4;
  return Infinity;
}

function rank(candidate: Candidate, query: string, context: string | undefined): number {
  if (candidate.suggestion.command === query) return 0;
  const queryText = context === undefined ? query : query.slice(context.length).trim();
  if (context !== undefined && queryText === '') return 1;
  const searchText = context === undefined
    ? candidate.searchText
    : `${candidate.suggestion.command.slice(context.length + 1)} ${candidate.suggestion.label}`;
  const searchWords = words(searchText);
  const queryWords = words(queryText);
  if (queryWords.length === 0) return Infinity;
  return Math.max(...queryWords.map((word) => tokenRank(word, searchWords)));
}

export function getCommandSuggestions(input: string, limit = 6): readonly CommandSuggestion[] {
  if (/[;&|`$<>]/.test(input)) return [];
  const query = normalize(input);
  const context = input.trimStart().toLowerCase().match(/^(project|work)\s/)?.[1];
  const choices = candidates();
  if (query === '') {
    return defaultCommands.flatMap((command) => choices
      .filter((candidate) => candidate.suggestion.command === command)
      .map(({ suggestion }) => suggestion)).slice(0, Math.max(0, limit));
  }
  return choices
    .filter((candidate) => context === undefined || candidate.context === context)
    .map((candidate, order) => ({ candidate, order, rank: rank(candidate, query, context) }))
    .filter((match) => Number.isFinite(match.rank))
    .sort((left, right) => left.rank - right.rank || left.order - right.order)
    .slice(0, Math.max(0, limit))
    .map(({ candidate }) => candidate.suggestion);
}
