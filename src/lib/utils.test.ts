import { describe, expect, it } from 'vitest';

import { cn } from './utils';

describe('cn', () => {
  it('combines conditional classes and keeps the final conflicting Tailwind utility', () => {
    expect(cn('p-2', ['font-mono', { hidden: false, block: true }], 'p-4')).toBe(
      'font-mono block p-4',
    );
  });
});
