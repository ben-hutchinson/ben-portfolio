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

describe('PORT-014 release audit', () => {
  it('ships the approved Kernel favicon geometry and palette', async () => {
    const favicon = await readFile(path.join(repositoryRoot, 'public/favicon.svg'), 'utf8');
    const elements = [...favicon.matchAll(/<(rect|path)\s+([^>]+?)(?:\s*\/?\s*>)/g)].map(([, name, attributes]) => ({
      name,
      attributes: Object.fromEntries([...attributes.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value])),
    }));

    expect(favicon).toContain('viewBox="0 0 64 64"');
    expect(elements).toEqual(expect.arrayContaining([
      {
        name: 'rect',
        attributes: {
          x: '3', y: '3', width: '58', height: '58', rx: '5', fill: '#132218',
        },
      },
      {
        name: 'path',
        attributes: {
          d: 'M16 15v34h20c9 0 14-4 14-10 0-5-3-8-8-9 4-2 6-5 6-8 0-5-4-7-12-7H16Zm9 8h10c3 0 4 1 4 3s-1 3-4 3H25v-6Zm0 13h12c3 0 5 1 5 3s-2 3-5 3H25v-6Z',
          fill: '#d9f7c5',
        },
      },
      {
        name: 'rect',
        attributes: {
          x: '47', y: '47', width: '9', height: '9', fill: '#ff6542',
        },
      },
    ]));
  });
});
