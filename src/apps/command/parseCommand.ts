import { commandRegistry, type CommandResult } from './commandRegistry';

function editDistance(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(
        (current[rightIndex - 1] ?? 0) + 1,
        (previous[rightIndex] ?? 0) + 1,
        (previous[rightIndex - 1] ?? 0) + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length] ?? Math.max(left.length, right.length);
}

export function parseCommand(input: string): CommandResult {
  const normalized = input.trim().toLowerCase();
  if (normalized === '') return { kind: 'message', output: 'Choose a visible suggestion or type help.' };
  if (/[;&|`$<>]/.test(normalized)) {
    return { kind: 'message', output: `Unknown command “${input.trim()}”. Type help for supported commands.` };
  }
  const [name = '', ...args] = normalized.split(/\s+/);
  const definition = commandRegistry.find((command) => command.name === name);
  if (definition !== undefined) return definition.execute(args);

  const closest = commandRegistry.reduce((best, command) => (
    editDistance(name, command.name) < editDistance(name, best.name) ? command : best
  ));
  const suggestion = editDistance(name, closest.name) <= 3 ? ` Did you mean “${closest.name}”?` : ' Type help for supported commands.';
  return { kind: 'message', output: `Unknown command “${input.trim()}”.${suggestion}` };
}
