import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import playwrightConfig from '../../playwright.config';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const execFileAsync = promisify(execFile);
const releaseInputSha256 = {
  'package.json': '8683a71b1187d9bffd610e3a8cbc78d1340e6135c5c95d8daa52e24d04872d71',
  'package-lock.json': '9673b4caf416cde42bcfc5e87635381c279d81f4fe54695151ff70aa559f5f00',
  'index.html': 'a3c6b6a4c021ff9480dc4effafc4fb581ea6d875088cce8039b6077ee47c210d',
} as const;
const darwinVisualBaselines = {
  'career-1440x1000.png': 'fc956593d39fcfccde07264879d4bcee12c559435796b2274c117c7660bae8dc',
  'career-390x844.png': 'c234b733fb60f44f3e8dc8e99795554e9e6328b627d28fa1506dde91623568fb',
  'desktop-1440x1000.png': '1af2a4174ff0afc2ba5f6ab3d2a44df0018c9548cdac3d360da3e0da641f8d28',
  'desktop-390x844.png': '0920132148245ebb7a0cc3ca6c02549cb966ff0649715b88ba2a74230e5b4544',
} as const;
const approvedActionPins = [
  'actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4',
  'actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4',
  'actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4',
  'actions/download-artifact@d3f86a106a0bac45b974a628896c90dbdf5c8093 # v4',
  'actions/upload-pages-artifact@7b1f4a764d45c48632c6b24a0339c27f5614fb0b # v4',
  'actions/deploy-pages@d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e # v4',
] as const;
const interSourceSha256 = {
  'InterVariable.woff2': '693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3',
  'OFL-1.1.txt': '262481e844521b326f5ecd053e59b98c8b2da78c8ee1bdbb6e8174305e54935a',
} as const;

async function trackedFiles(): Promise<readonly string[]> {
  const { stdout } = await execFileAsync('git', ['ls-files'], { cwd: repositoryRoot });
  return stdout.split('\n').filter(Boolean);
}

async function expectMissing(relativePath: string): Promise<void> {
  await expect(stat(path.join(repositoryRoot, relativePath))).rejects.toMatchObject({ code: 'ENOENT' });
}

function sha256(contents: Uint8Array): string {
  return createHash('sha256').update(contents).digest('hex');
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
      'tests/e2e/visual.spec.ts-snapshots/darwin/desktop-1440x1000.png',
      'tests/e2e/visual.spec.ts-snapshots/darwin/desktop-390x844.png',
      'tests/e2e/visual.spec.ts-snapshots/darwin/career-1440x1000.png',
      'tests/e2e/visual.spec.ts-snapshots/darwin/career-390x844.png',
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
      readFile(path.join(repositoryRoot, 'package.json')),
      readFile(path.join(repositoryRoot, 'package-lock.json')),
      readFile(path.join(repositoryRoot, 'index.html')),
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
    expect(sha256(packageManifest)).toBe(releaseInputSha256['package.json']);
    expect(sha256(packageLock)).toBe(releaseInputSha256['package-lock.json']);
    expect(sha256(html)).toBe(releaseInputSha256['index.html']);
  });
});

describe('PORT-020 CI portability', () => {
  it('selects the exact platform-specific visual snapshot tree', () => {
    expect(playwrightConfig.snapshotPathTemplate).toBe(
      '{testDir}/{testFilePath}-snapshots/{platform}/{arg}{ext}',
    );
  });

  it('preserves the accepted Darwin baselines byte-for-byte and keeps tracked source portable', async () => {
    const tracked = await trackedFiles();
    const baselineRoot = path.join(repositoryRoot, 'tests/e2e/visual.spec.ts-snapshots/darwin');
    const baselineNames = Object.keys(darwinVisualBaselines).sort();
    const privateTemporaryRoot = ['', 'private', 'tmp'].join('/');
    const portableSource = tracked.filter((relativePath) => (
      relativePath === 'playwright.config.ts'
      || relativePath.startsWith('src/')
      || relativePath.startsWith('tests/')
    ) && /\.(?:[cm]?[jt]sx?|css)$/.test(relativePath));
    const nonPortableSource = (await Promise.all(portableSource.map(async (relativePath) => ({
      relativePath,
      contents: await readFile(path.join(repositoryRoot, relativePath), 'utf8'),
    })))).filter(({ contents }) => contents.includes(privateTemporaryRoot));

    expect((await readdir(baselineRoot)).sort()).toEqual(baselineNames);
    for (const baselineName of baselineNames) {
      const relativePath = `tests/e2e/visual.spec.ts-snapshots/darwin/${baselineName}`;
      expect(tracked).toContain(relativePath);
      expect(sha256(await readFile(path.join(repositoryRoot, relativePath))))
        .toBe(darwinVisualBaselines[baselineName as keyof typeof darwinVisualBaselines]);
    }
    expect(nonPortableSource.map(({ relativePath }) => relativePath)).toEqual([]);
  });

  it('retains concise console output while writing the inspectable HTML report', () => {
    expect(playwrightConfig.reporter).toEqual([
      ['list'],
      ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ]);
  });

  it('uploads the exact Linux Playwright evidence only when browser verification fails', async () => {
    const qualityWorkflow = await readFile(path.join(repositoryRoot, '.github/workflows/quality.yml'), 'utf8');
    const exactFailureEvidenceStep = `      - name: Upload Playwright failure evidence
        if: failure()
        uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4
        with:
          name: playwright-failure-evidence-linux
          path: |
            playwright-report/
            test-results/
          if-no-files-found: warn`;

    expect(qualityWorkflow).toContain(exactFailureEvidenceStep);
  });

  it('uses only the six approved immutable official Action references', async () => {
    const [qualityWorkflow, pagesWorkflow] = await Promise.all([
      readFile(path.join(repositoryRoot, '.github/workflows/quality.yml'), 'utf8'),
      readFile(path.join(repositoryRoot, '.github/workflows/gh-pages.yml'), 'utf8'),
    ]);
    const workflows = `${qualityWorkflow}\n${pagesWorkflow}`;
    const officialActionReferences = [...workflows.matchAll(/uses:\s+(actions\/[^\s]+\s+#\s+v\d+)/g)]
      .map(([, reference]) => reference);

    expect(new Set(officialActionReferences)).toEqual(new Set(approvedActionPins));
    expect(officialActionReferences.every((reference) => approvedActionPins.includes(
      reference as typeof approvedActionPins[number],
    ))).toBe(true);
  });

  it('ships the exact official Inter 4.1 display font and complete OFL custody files', async () => {
    const tracked = await trackedFiles();
    const expectedFontFiles = Object.keys(interSourceSha256).sort();
    const fontRoot = path.join(repositoryRoot, 'public/fonts');

    expect(tracked).toEqual(expect.arrayContaining(expectedFontFiles.map((name) => `public/fonts/${name}`)));
    expect((await readdir(fontRoot)).sort()).toEqual(expectedFontFiles);
    for (const filename of expectedFontFiles) {
      expect(sha256(await readFile(path.join(fontRoot, filename))))
        .toBe(interSourceSha256[filename as keyof typeof interSourceSha256]);
    }
  });

  it('maps the unchanged display token to one local normal variable Inter face without a runtime font service', async () => {
    const tracked = await trackedFiles();
    const tokensPath = path.join(repositoryRoot, 'src/styles/tokens.css');
    const tokens = await readFile(tokensPath, 'utf8');
    const faceMatches = [...tokens.matchAll(/@font-face\s*\{([^}]+)\}/g)];
    const faceDeclarations = Object.fromEntries(
      (faceMatches[0]?.[1] ?? '')
        .split(';')
        .map((declaration) => declaration.trim())
        .filter(Boolean)
        .map((declaration) => {
          const separator = declaration.indexOf(':');
          return [declaration.slice(0, separator).trim(), declaration.slice(separator + 1).trim()];
        }),
    );
    const auditableSource = tracked.filter((relativePath) => (
      relativePath === 'index.html'
      || relativePath.startsWith('src/')
    ) && /\.(?:html|css|[jt]sx?)$/.test(relativePath));
    const externalFontReferences = (await Promise.all(auditableSource.map(async (relativePath) => ({
      relativePath,
      contents: await readFile(path.join(repositoryRoot, relativePath), 'utf8'),
    })))).filter(({ contents }) => (
      /fonts\.(?:googleapis|gstatic)\.com/i.test(contents)
      || /@import\s+(?:url\()?['"]?https?:\/\//i.test(contents)
      || /url\(['"]?https?:\/\/[^)]*\.(?:woff2?|ttf|otf)/i.test(contents)
    ));

    expect(faceMatches).toHaveLength(1);
    expect(tokens.indexOf('@font-face')).toBeLessThan(tokens.indexOf(':root'));
    expect(faceDeclarations).toEqual({
      'font-family': '"Inter"',
      'font-style': 'normal',
      'font-weight': '100 900',
      src: 'url("/ben-portfolio/fonts/InterVariable.woff2") format("woff2")',
      'font-display': 'block',
    });
    expect(tokens).toContain('--font-display: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;');
    expect(externalFontReferences).toEqual([]);
  });
});
