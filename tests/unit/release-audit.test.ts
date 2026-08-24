import { execFile } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const execFileAsync = promisify(execFile);

async function trackedFiles(): Promise<readonly string[]> {
  const { stdout } = await execFileAsync('git', ['ls-files'], { cwd: repositoryRoot });
  return stdout.split('\n').filter(Boolean);
}

async function expectMissing(relativePath: string): Promise<void> {
  await expect(stat(path.join(repositoryRoot, relativePath))).rejects.toMatchObject({ code: 'ENOENT' });
}

async function gitShow(revision: string, relativePath: string): Promise<string> {
  const { stdout } = await execFileAsync('git', ['show', `${revision}:${relativePath}`], { cwd: repositoryRoot });
  return stdout;
}

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

describe('PORT-019 release hardening', () => {
  it('documents the accepted identity-only shell, five-app dock, Micro terminal, and typed Work catalogue without obsolete concepts', async () => {
    const [prd, design] = await Promise.all([
      readFile(path.join(repositoryRoot, 'docs/PRD.md'), 'utf8'),
      readFile(path.join(repositoryRoot, 'docs/DESIGN.md'), 'utf8'),
    ]);
    const acceptedDocumentation = `${prd}\n${design}`;

    for (const acceptedContract of [
      'Kernel mark',
      'Manchester, UK',
      'About, Work, Career, Projects, Contact',
      'Micro terminal',
      'not a sixth application',
      'workItems',
      'activeWorkId',
      '#work/<work-id>',
      '#work/uv-ruff-migration',
      'Problem, ownership, approach, rollout, outcome, result, and public-detail boundaries',
      'no Work technologies',
      'Featured Work upper-right',
      'Profile lower-left',
      'Micro terminal bottom-right',
      'no background statement',
    ]) {
      expect(acceptedDocumentation).toContain(acceptedContract);
    }

    for (const obsoleteConcept of [
      /Menu bar with identity, primary navigation, and status/i,
      /The menu bar is navigation, not decoration/i,
      /Command window/i,
      /CommandWindow/i,
      /CommandApp/i,
      /workEntries/i,
      /- Technologies\n- Public-detail boundaries/i,
      /Large, low-contrast background statement/i,
    ]) {
      expect(acceptedDocumentation).not.toMatch(obsoleteConcept);
    }
  });

  it('keeps only release-safe tracked content while retaining the accepted historical documents, assets, and visual baselines', async () => {
    const [tracked, ignore] = await Promise.all([
      trackedFiles(),
      readFile(path.join(repositoryRoot, '.gitignore'), 'utf8'),
    ]);

    expect(ignore).toContain('.playwright-cli/');
    expect(tracked.filter((entry) => entry === '.DS_Store' || entry.startsWith('.playwright-mcp/'))).toEqual([]);
    expect(tracked.filter((entry) => [
      'hover-roster.png',
      'runner-desktop-polish.png',
      'runner-desktop-running-polish.png',
      'runner-mobile-polish.png',
      'space-chamber-iteration.png',
      'public/cv/README.md',
      'docs/ASSET_ATTRIBUTION.md',
      'docs/ASSET_PIPELINE.md',
      'docs/PIXELLAB_MCP.md',
    ].includes(entry))).toEqual([]);

    for (const obsoletePath of [
      'hover-roster.png',
      'runner-desktop-polish.png',
      'runner-desktop-running-polish.png',
      'runner-mobile-polish.png',
      'space-chamber-iteration.png',
      'public/cv/README.md',
      'docs/ASSET_ATTRIBUTION.md',
      'docs/ASSET_PIPELINE.md',
      'docs/PIXELLAB_MCP.md',
    ]) {
      await expectMissing(obsoletePath);
    }

    for (const protectedPath of [
      'public/cv/ben-hutchinson-cv.pdf',
      'public/favicon.svg',
      'public/assets/ui/project-pokeleximon.webp',
      'public/assets/ui/project-safelog.webp',
      'tests/e2e/visual.spec.ts-snapshots/desktop-1440x1000.png',
      'tests/e2e/visual.spec.ts-snapshots/desktop-390x844.png',
      'tests/e2e/visual.spec.ts-snapshots/career-1440x1000.png',
      'tests/e2e/visual.spec.ts-snapshots/career-390x844.png',
      'docs/superpowers/plans/2026-07-28-command-centre-portfolio-redesign.md',
      'docs/superpowers/specs/2026-07-28-command-centre-portfolio-redesign-design.md',
    ]) {
      expect(tracked).toContain(protectedPath);
      expect((await stat(path.join(repositoryRoot, protectedPath))).isFile()).toBe(true);
    }
  });

  it('removes only named dead release code while preserving Project blurbs and the live command contracts', async () => {
    const [windowLayerStyles, tokens, careerApp, commandRegistry, geometry, projectsStyles, projectsApp] = await Promise.all([
      readFile(path.join(repositoryRoot, 'src/shell/WindowLayer.module.css'), 'utf8'),
      readFile(path.join(repositoryRoot, 'src/styles/tokens.css'), 'utf8'),
      readFile(path.join(repositoryRoot, 'src/apps/career/CareerApp.tsx'), 'utf8'),
      readFile(path.join(repositoryRoot, 'src/apps/command/commandRegistry.ts'), 'utf8'),
      readFile(path.join(repositoryRoot, 'src/utils/windowGeometry.ts'), 'utf8'),
      readFile(path.join(repositoryRoot, 'src/apps/projects/ProjectsApp.module.css'), 'utf8'),
      readFile(path.join(repositoryRoot, 'src/apps/projects/ProjectsApp.tsx'), 'utf8'),
    ]);

    for (const deadSelector of ['.appContent', '.eyebrow']) expect(windowLayerStyles).not.toContain(deadSelector);
    expect(tokens).not.toContain('--duration-standard');
    expect(careerApp).not.toContain('usePrefersReducedMotion');
    expect((careerApp.match(/useReducedMotion\(/g) ?? [])).toHaveLength(1);
    expect(careerApp).toContain('const reducedMotion = motionPreference === true;');
    await expectMissing('src/hooks/usePrefersReducedMotion.ts');
    expect(geometry).not.toContain('TITLE_BAR_HEIGHT');
    expect(geometry).toContain('export function constrainWindowSize');
    expect(geometry).toContain('export function clampWindowPosition');
    expect(commandRegistry).not.toMatch(/\busage\s*:/);
    expect(commandRegistry).not.toMatch(/\bdescription\s*:/);
    expect(commandRegistry).toContain('readonly name: string;');
    expect(commandRegistry).toContain('execute(args: readonly string[]): CommandResult;');
    expect(commandRegistry).toContain('workIds');
    expect(projectsStyles).toContain('.blurb');
    expect(projectsApp).toContain('styles.blurb');
  });

  it('pins the approved official Actions without altering workflow behavior or package/security metadata inputs', async () => {
    const [qualityWorkflow, pagesWorkflow, packageManifest, packageLock, html] = await Promise.all([
      readFile(path.join(repositoryRoot, '.github/workflows/quality.yml'), 'utf8'),
      readFile(path.join(repositoryRoot, '.github/workflows/gh-pages.yml'), 'utf8'),
      readFile(path.join(repositoryRoot, 'package.json'), 'utf8'),
      readFile(path.join(repositoryRoot, 'package-lock.json'), 'utf8'),
      readFile(path.join(repositoryRoot, 'index.html'), 'utf8'),
    ]);
    const workflows = `${qualityWorkflow}\n${pagesWorkflow}`;

    for (const pinnedAction of [
      'actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4',
      'actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4',
      'actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4',
      'actions/download-artifact@d3f86a106a0bac45b974a628896c90dbdf5c8093 # v4',
      'actions/upload-pages-artifact@7b1f4a764d45c48632c6b24a0339c27f5614fb0b # v4',
      'actions/deploy-pages@d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e # v4',
    ]) {
      expect(workflows).toContain(`uses: ${pinnedAction}`);
    }
    expect(workflows).not.toMatch(/uses:\s+actions\/(?:checkout|setup-node|upload-artifact|download-artifact|upload-pages-artifact|deploy-pages)@v\d+/);
    expect(qualityWorkflow).toContain('npm run test:e2e');
    expect(pagesWorkflow).toContain("if: github.ref == 'refs/heads/master'");
    expect(packageManifest).toBe(await gitShow('151456d', 'package.json'));
    expect(packageLock).toBe(await gitShow('151456d', 'package-lock.json'));
    expect(html).toBe(await gitShow('151456d', 'index.html'));
  });
});
