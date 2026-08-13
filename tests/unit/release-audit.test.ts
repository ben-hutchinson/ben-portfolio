import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

async function filesBelow(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(entryPath) : [entryPath];
  }));
  return nested.flat();
}

describe('PORT-013 release audit', () => {
  it('keeps legacy product source and packages absent while retaining release assets', async () => {
    const legacyDirectories = [
      'src/features/audio',
      'src/features/character-select',
      'src/features/character-viewer',
      'src/features/intro',
      'src/features/mission-runner',
      'src/features/panels',
    ];
    const legacyFiles = (await Promise.all(legacyDirectories.map(async (directory) => {
      const absoluteDirectory = path.join(repositoryRoot, directory);
      try {
        return await filesBelow(absoluteDirectory);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
        throw error;
      }
    }))).flat();
    const packageManifest = JSON.parse(await readFile(path.join(repositoryRoot, 'package.json'), 'utf8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const packages = { ...packageManifest.dependencies, ...packageManifest.devDependencies };

    expect(legacyFiles).toEqual([]);
    expect(packages).not.toHaveProperty('framer-motion');
    for (const protectedAsset of [
      'public/cv/ben-hutchinson-cv.pdf',
      'public/favicon.svg',
      'public/assets/ui/project-pokeleximon.webp',
      'public/assets/ui/project-safelog.webp',
    ]) {
      expect((await stat(path.join(repositoryRoot, protectedAsset))).isFile()).toBe(true);
    }
  });

  it('gives contributors a current static Portfolio OS operating guide', async () => {
    const readme = await readFile(path.join(repositoryRoot, 'README.md'), 'utf8');

    for (const requiredContract of [
      'Portfolio OS',
      'Node 24',
      'npm ci',
      'npm run typecheck',
      'npm run lint',
      'npm test',
      'npm run test:coverage',
      'npm run build',
      'npm run check:bundle',
      'npm run test:e2e',
      'npm run test:e2e:a11y',
      'npm run test:e2e:visual',
      'React',
      'TypeScript',
      'Vite',
      'CSS Modules',
      'Motion',
      'context',
      'reducer',
      'Playwright',
      'http://127.0.0.1:4173/ben-portfolio/',
      '/ben-portfolio/',
      'hash',
      'dist',
      'master',
      'no server rewrites',
      'no runtime content API',
    ]) {
      expect(readme).toContain(requiredContract);
    }
    expect(readme).not.toMatch(/retro character-select|Framer Motion|assets\/characters/i);
  });
});
