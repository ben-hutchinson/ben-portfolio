# Command Centre Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the gated character-select portfolio with the approved recruiter-first command-centre experience while preserving Signal Sprint as an optional, lazy-loaded minigame.

**Architecture:** The application becomes a semantic scrolling React document composed from independent section features and typed data modules. Framer Motion provides restrained progressive enhancement, selected shadcn primitives provide accessible sheets/dialogs/tooltips, and all URLs remain compatible with the Vite `/ben-portfolio/` GitHub Pages base path.

**Tech Stack:** React 18, TypeScript 5.6, Vite 8, Framer Motion 11, CSS Modules, Tailwind/shadcn primitives, Vitest, Testing Library, Playwright, axe-core, GitHub Actions.

## Global Constraints

- Preserve the Vite base path `/ben-portfolio/`.
- Use anchor navigation and modal state; do not add history-based routes.
- Keep CSS Modules for branded surfaces and centralise tokens in `src/styles/global.css`.
- Use only `Sheet`, `Dialog`, `Tooltip`, and `Separator` from shadcn unless this plan is revised.
- Initial JavaScript must be at most 250 KB gzip.
- Initial image transfer must be at most 1.5 MB.
- No individual below-the-fold image may exceed 350 KB.
- Lighthouse Performance must be at least 90 on a mobile profile.
- Lighthouse Accessibility must be at least 95.
- No horizontal overflow at 320, 390, 768, 1024, or 1440 CSS pixels.
- No autoplay audio and no artificial intro/loading delay.
- Do not fabricate scale metrics, percentages, traffic figures, reliability claims, or business outcomes.
- All public asset paths must resolve through `import.meta.env.BASE_URL` helpers.
- Existing sprite files remain in place until the full replacement set is accepted.
- The user must approve Ben v2 before page sections consume the final artwork.

---

## Execution Topology

The integration lead owns shared configuration, dependency files, `src/App.tsx`, `src/main.tsx`, final `src/data/characters.ts` edits, and final cross-workstream changes to `src/styles/global.css`.

| Wave | Parallel workers | Tasks | Merge gate |
| --- | --- | --- | --- |
| 0 | Integration lead | Task 1 | Baseline and toolchain pass |
| 1 | Foundation, Content, Art | Tasks 2–4 | Gate A: data, primitives, and approved Ben v2 |
| 2 | Shell/Crew, Missions/Experience, Topology | Tasks 5–7 | Gate B: section tests pass independently |
| 2 integration | Integration lead | Task 8 | Recruiter-facing scrolling page builds and renders |
| 3A | Training worker + integration lead | Task 9 | Signal Sprint is integrated and lazy |
| 3B | QA, Reviewer | Tasks 10–11 | Gate C: test matrix and findings complete |
| Final | Integration lead + original owners | Tasks 12–13 | Release matrix and Pages smoke pass |

Every implementation worker uses a dedicated worktree created from the latest integration commit. Every worker returns a commit hash, files changed, commands run, results, and remaining risks. Reviewer workers do not edit production files; the original owner handles fixes.

## Specification Coverage Map

| Approved specification area | Implemented by |
| --- | --- |
| Recruiter-first information architecture | Tasks 5, 6, 7, 8 |
| Navy/violet/silver design system | Tasks 1 and 4 |
| Hero, proof strip, navigation, crew, footer | Task 5 |
| Engineering briefings and experience | Tasks 2 and 6 |
| Systems topology | Tasks 2 and 7 |
| Ben v2 and complete crew asset contract | Task 3, wired in Task 8 |
| Optional lazy Signal Sprint | Task 9, integrated before Tasks 10–11 |
| GitHub Pages base-path safety | Tasks 1, 8, 10, 13 |
| Accessibility and reduced motion | Tasks 4–11 |
| Performance budgets | Tasks 3, 9, 10, 12 |
| Multi-agent gates and conflict control | Execution Topology, Tasks 1–13 |

## Locked File Ownership

### Integration lead only

- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `tsconfig*.json`
- `src/App.tsx`
- `src/main.tsx`
- `.github/workflows/**`
- final `src/data/characters.ts` wiring
- final cross-feature edits to `src/styles/global.css`

### Foundation worker

- `components.json`
- `src/components/ui/**`
- `src/lib/**`
- `src/test/**`
- proposed token patch recorded in its handoff

### Content worker

- `src/data/types.ts`
- `src/data/projects.ts`
- `src/data/timeline.ts`
- `src/data/profile.ts`
- `src/data/topology.ts`
- `src/data/*.test.ts`

### Art worker

- new versioned files under `public/assets/characters/**/command-v2/**`
- `public/assets/characters/command-v2-manifest.json`
- `docs/ASSET_PIPELINE.md`

### Wave 2 feature workers

- Shell/Crew: `src/features/navigation/**`, `src/features/hero/**`, `src/features/proof-strip/**`, `src/features/crew/**`, `src/features/command-footer/**`
- Missions/Experience: `src/features/mission-logs/**`, `src/features/experience/**`
- Topology: `src/features/systems-topology/**`

### Wave 3 workers

- Training: `src/features/training/**` and targeted edits under `src/features/mission-runner/**`
- QA: `tests/**`, `playwright.config.ts`, `scripts/check-*.mjs`
- Reviewer: `docs/reviews/command-centre-*.md` only

---

### Task 1: Establish the Integration Baseline and Test Harness

**Owner:** Integration lead

**Files:**
- Create: `docs/baselines/command-centre-before.md`
- Create: `src/test/setup.ts`
- Create: `src/test/render.tsx`
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `vite.config.ts`
- Modify: `tsconfig.app.json`
- Modify: `src/styles/global.css`
- Generate: `src/components/ui/dialog.tsx`
- Generate: `src/components/ui/sheet.tsx`
- Generate: `src/components/ui/tooltip.tsx`
- Generate: `src/components/ui/separator.tsx`

**Interfaces:**
- Consumes: current `master` at the approved design-spec commit.
- Produces: `cn(...inputs: ClassValue[]): string`, Vitest/jsdom setup, shadcn primitives, and a reproducible baseline all later workers use.

- [ ] **Step 1: Create the integration worktree**

Run from the current checkout:

```bash
git worktree add ../ben-portfolio-command-centre -b codex/command-centre-redesign master
cd ../ben-portfolio-command-centre
```

Expected: the new worktree is on `codex/command-centre-redesign` and `git status --short` is empty.

- [ ] **Step 2: Record the current baseline**

Run:

```bash
npm ci
npm run lint
npm run typecheck
npm run build
du -sh dist
find dist/assets -type f -maxdepth 1 -print -exec du -h {} \;
```

Create `docs/baselines/command-centre-before.md` with the exact command outputs, current desktop/mobile screenshots, and current route/base-path behaviour. Do not add qualitative scores.

- [ ] **Step 3: Install the test and shadcn toolchain**

Run:

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom @playwright/test @axe-core/playwright tailwindcss @tailwindcss/vite @types/node
npm install clsx tailwind-merge class-variance-authority lucide-react @radix-ui/react-dialog @radix-ui/react-tooltip @radix-ui/react-separator
npx shadcn@latest init -d
npx shadcn@latest add dialog sheet tooltip separator
```

Keep only those four shadcn components. If the generator modifies the Vite base path, restore `base: '/ben-portfolio/'` before continuing.

- [ ] **Step 4: Add exact test scripts**

Update `package.json` scripts to include:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "test:e2e:a11y": "playwright test tests/e2e/a11y.spec.ts",
  "test:e2e:visual": "playwright test tests/e2e/visual.spec.ts",
  "check": "npm run lint && npm run typecheck && npm run test && npm run build"
}
```

- [ ] **Step 5: Configure Vitest and aliases**

Update `vite.config.ts` without changing `base`:

```ts
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ben-portfolio/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
```

Add the matching `@/*` path alias to `tsconfig.app.json`.

- [ ] **Step 6: Add shared test utilities**

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});
```

Create `src/test/render.tsx`:

```tsx
import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';

export const renderWithProviders = (ui: ReactElement) =>
  render(<TooltipProvider delayDuration={0}>{ui}</TooltipProvider>);
```

- [ ] **Step 7: Verify the baseline after dependency setup**

Run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Expected: every command exits 0; the generated production asset URLs still begin with `/ben-portfolio/`.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.app.json components.json src/lib src/test src/components/ui src/styles/global.css docs/baselines/command-centre-before.md
git commit -m "chore: establish redesign foundation"
```

---

### Task 2: Define Typed Portfolio Content

**Owner:** Content/data worker, branch `codex/redesign-content`

**Files:**
- Modify: `src/data/types.ts`
- Modify: `src/data/projects.ts`
- Modify: `src/data/timeline.ts`
- Create: `src/data/profile.ts`
- Create: `src/data/topology.ts`
- Create: `src/data/projects.test.ts`
- Create: `src/data/topology.test.ts`

**Interfaces:**
- Consumes: `projectAssetPath(file: string): string` from `src/utils/assets.ts`.
- Produces: `profile`, `projects`, `timelineEvents`, `topologyGroups`, and the exact types `ProjectBriefing`, `TopologyNode`, and `TopologyGroupId`.

- [ ] **Step 1: Write failing content-contract tests**

Create `src/data/projects.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { projects } from './projects';

describe('featured project briefings', () => {
  it('provides complete verified briefings for the two flagship projects', () => {
    const featured = projects.filter((project) => project.featured);
    expect(featured.map((project) => project.id)).toEqual(['pokeleximon', 'safelog']);
    for (const project of featured) {
      expect(project.category).toBeTruthy();
      expect(project.systemShape?.length ?? 0).toBeGreaterThan(0);
      expect(project.engineeringStory).toBeTruthy();
      expect(project.briefing?.context).toBeTruthy();
      expect(project.briefing?.decisions.length).toBeGreaterThan(0);
    }
  });

  it('uses secure external URLs', () => {
    for (const project of projects) {
      for (const link of project.links) expect(link.href).toMatch(/^https:\/\//);
    }
  });
});
```

Create `src/data/topology.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { topologyGroups, topologyNodes } from './topology';

describe('systems topology', () => {
  it('contains the five approved nodes', () => {
    expect(topologyNodes.map((node) => node.id)).toEqual([
      'skao',
      'flutter',
      'pokeleximon',
      'safelog',
      'observability',
    ]);
  });

  it('has at least one node in every focus group', () => {
    for (const group of topologyGroups) {
      expect(topologyNodes.some((node) => node.groups.includes(group.id))).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test -- src/data/projects.test.ts src/data/topology.test.ts`

Expected: FAIL because the new fields and topology module do not exist.

- [ ] **Step 3: Add the exact content types**

Extend `src/data/types.ts` with:

```ts
export interface ProjectBriefing {
  context: string;
  constraint: string;
  responsibilities: string[];
  decisions: string[];
  delivery: string;
  outcome: string;
}

export interface ProjectEntry {
  id: string;
  kind: 'personal' | 'work';
  title: string;
  blurb: string;
  image?: string;
  tags: string[];
  links: ProjectLink[];
  featured?: boolean;
  category?: string;
  systemShape?: string[];
  engineeringStory?: string;
  briefing?: ProjectBriefing;
}

export type TopologyGroupId = 'platform' | 'product' | 'tooling';

export interface TopologyNode {
  id: 'skao' | 'flutter' | 'pokeleximon' | 'safelog' | 'observability';
  label: string;
  description: string;
  groups: TopologyGroupId[];
}
```

Update every entry in `src/data/projects.ts` with `systemShape`, using the existing tag values rather than inventing metrics. Character-specific joke projects may omit it because the field is optional.

- [ ] **Step 4: Create the profile and topology data**

Create `src/data/profile.ts`:

```ts
export const profile = {
  name: 'Ben Hutchinson',
  role: 'Backend / platform engineer',
  location: 'Manchester, UK',
  headline: 'I engineer the calm inside complexity.',
  summary:
    'I build reliable backend systems, developer tooling and operational platforms—the sort of software teams can understand, run and trust when the pressure rises.',
  proof: ['Python', 'Java / JVM', 'PostgreSQL', 'Docker', 'Observability', 'On-call'],
} as const;
```

Create `src/data/topology.ts` with all five nodes and these groups:

```ts
import type { TopologyGroupId, TopologyNode } from './types';

export const topologyGroups: { id: TopologyGroupId; label: string }[] = [
  { id: 'platform', label: 'Platform & reliability' },
  { id: 'product', label: 'Product systems' },
  { id: 'tooling', label: 'Developer tooling' },
];

export const topologyNodes: TopologyNode[] = [
  { id: 'skao', label: 'SKAO', description: 'Mission-driven Python control systems', groups: ['platform'] },
  { id: 'flutter', label: 'Flutter UKI', description: 'Production systems and operational ownership', groups: ['platform', 'product'] },
  { id: 'pokeleximon', label: 'Pokeleximon', description: 'API, data, automation and frontend', groups: ['product', 'tooling'] },
  { id: 'safelog', label: 'Safelog', description: 'Privacy-first developer workflow', groups: ['tooling'] },
  { id: 'observability', label: 'Observability', description: 'Useful signals and targeted alerts', groups: ['platform', 'tooling'] },
];
```

- [ ] **Step 5: Add verified project briefing copy**

Mark only Pokeleximon and Safelog as `featured: true`. Populate their briefing fields exclusively from existing repository copy. Use `outcome` for a verified learning or shipped capability; do not add numeric performance claims.

- [ ] **Step 6: Run focused and full checks**

Run:

```bash
npm run test -- src/data/projects.test.ts src/data/topology.test.ts
npm run lint
npm run typecheck
```

Expected: all commands exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/data
git commit -m "feat: define command centre portfolio content"
```

---

### Task 3: Produce the Command Crew Asset Set

**Owner:** Art worker, branch `codex/redesign-art`

**Files:**
- Create: `public/assets/characters/ben/command-v2/candidate-a.png`
- Create: `public/assets/characters/ben/command-v2/candidate-b.png`
- Create after approval: `public/assets/characters/ben/command-v2/hero.webp`
- Create after approval: `public/assets/characters/ben/command-v2/rotations/south.png`
- Create after approval: `public/assets/characters/ben/command-v2/rotations/east.png`
- Create after approval: `public/assets/characters/ben/command-v2/runner/frame_000.png` through `frame_007.png`
- Create: equivalent `hero.webp`, rotations, and runner frames under `dog/command-v2` and `cat/command-v2`
- Create: `public/assets/characters/command-v2-manifest.json`
- Modify: `docs/ASSET_PIPELINE.md`

**Interfaces:**
- Consumes: source photographs in `public/assets/characters/*/source/` and the approved Blue/Toni concept traits in the design specification.
- Produces: a manifest mapping `ben`, `dog`, and `cat` to `hero`, `front`, `runnerStill`, and eight `runnerFrames` paths.

- [ ] **Step 1: Generate two Ben v2 concepts**

Use the image-generation workflow with the source photo that actually contains Ben. Use this prompt for both variants, changing only `candidate A` to `candidate B`:

```text
Use case: stylized-concept
Asset type: portfolio command-crew character, candidate A
Primary request: create a premium full-body 32-bit pixel-art character based closely on the man in the reference photo. Preserve his face shape, curly dark hair silhouette, short beard, eyes, relaxed smile, and approachable expression. Reduce the generic action-hero look. Dress him in a practical deep-navy command-centre overshirt with simple silver piping and one restrained violet accent, dark straight-leg trousers, and practical boots. No ornamental straps or superhero armour.
Scene/backdrop: flat #0E2148.
Composition: front-facing slight three-quarter stance, full body, centered, generous padding.
Style: crisp modern 32-bit pixel art matching the approved Blue and Toni concepts, readable at 128 px.
Constraints: no text, no logo, no props, no cast shadow, no extra characters, no scenery.
```

Candidate A should be more naturalistic; candidate B should use slightly chunkier pixel clusters. Do not change clothing or identity requirements between candidates.

- [ ] **Step 2: Obtain the Ben approval gate**

Present both candidates at 512 px and 128 px beside the source photo and approved Blue/Toni art. Stop this workstream until the user selects one candidate or requests a targeted revision.

- [ ] **Step 3: Produce hero assets**

Create matching Blue and Toni command portraits from their source photos and approved traits. Export all selected hero assets as WebP at a maximum of 1024×1024 and a maximum of 350 KB each. Preserve the original generated PNG outside runtime paths for future editing.

- [ ] **Step 4: Produce transparent gameplay sprites**

For each character, generate a south-facing still and an east-facing eight-frame run sheet on a perfectly flat chroma-key background. Split the run sheet into `frame_000.png` through `frame_007.png`, remove the key colour, and validate transparent corners and stable character proportions. Use nearest-neighbour resampling only.

- [ ] **Step 5: Create the manifest**

Create `public/assets/characters/command-v2-manifest.json`:

```json
{
  "ben": {
    "hero": "assets/characters/ben/command-v2/hero.webp",
    "front": "assets/characters/ben/command-v2/rotations/south.png",
    "runnerStill": "assets/characters/ben/command-v2/rotations/east.png",
    "runnerFrames": [
      "assets/characters/ben/command-v2/runner/frame_000.png",
      "assets/characters/ben/command-v2/runner/frame_001.png",
      "assets/characters/ben/command-v2/runner/frame_002.png",
      "assets/characters/ben/command-v2/runner/frame_003.png",
      "assets/characters/ben/command-v2/runner/frame_004.png",
      "assets/characters/ben/command-v2/runner/frame_005.png",
      "assets/characters/ben/command-v2/runner/frame_006.png",
      "assets/characters/ben/command-v2/runner/frame_007.png"
    ]
  },
  "dog": {
    "hero": "assets/characters/dog/command-v2/hero.webp",
    "front": "assets/characters/dog/command-v2/rotations/south.png",
    "runnerStill": "assets/characters/dog/command-v2/rotations/east.png",
    "runnerFrames": [
      "assets/characters/dog/command-v2/runner/frame_000.png",
      "assets/characters/dog/command-v2/runner/frame_001.png",
      "assets/characters/dog/command-v2/runner/frame_002.png",
      "assets/characters/dog/command-v2/runner/frame_003.png",
      "assets/characters/dog/command-v2/runner/frame_004.png",
      "assets/characters/dog/command-v2/runner/frame_005.png",
      "assets/characters/dog/command-v2/runner/frame_006.png",
      "assets/characters/dog/command-v2/runner/frame_007.png"
    ]
  },
  "cat": {
    "hero": "assets/characters/cat/command-v2/hero.webp",
    "front": "assets/characters/cat/command-v2/rotations/south.png",
    "runnerStill": "assets/characters/cat/command-v2/rotations/east.png",
    "runnerFrames": [
      "assets/characters/cat/command-v2/runner/frame_000.png",
      "assets/characters/cat/command-v2/runner/frame_001.png",
      "assets/characters/cat/command-v2/runner/frame_002.png",
      "assets/characters/cat/command-v2/runner/frame_003.png",
      "assets/characters/cat/command-v2/runner/frame_004.png",
      "assets/characters/cat/command-v2/runner/frame_005.png",
      "assets/characters/cat/command-v2/runner/frame_006.png",
      "assets/characters/cat/command-v2/runner/frame_007.png"
    ]
  }
}
```

- [ ] **Step 6: Validate asset completeness and size**

Run:

```bash
find public/assets/characters -path '*/command-v2/*' -type f -print
find public/assets/characters -path '*/command-v2/*' -type f -size +350k -print
```

Expected: every manifest path exists; the second command prints nothing for runtime WebP and gameplay PNG files.

- [ ] **Step 7: Commit**

```bash
git add public/assets/characters docs/ASSET_PIPELINE.md
git commit -m "feat: add command crew v2 assets"
```

---

### Task 4: Build Command-Centre Tokens and UI Primitives

**Owner:** Foundation worker, branch `codex/redesign-foundation`

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/lib/utils.ts`
- Create: `src/lib/motion.ts`
- Create: `src/components/CommandButton.tsx`
- Create: `src/components/CommandButton.module.css`
- Create: `src/components/CommandButton.test.tsx`
- Test: `src/components/ui/dialog.tsx`
- Test: `src/components/ui/sheet.tsx`

**Interfaces:**
- Consumes: `cn()` and shadcn files created in Task 1.
- Produces: global colour/typography tokens, reduced-motion-safe section variants, and `CommandButton` with `variant: 'primary' | 'secondary' | 'quiet'`.

- [ ] **Step 1: Write the failing button test**

Create `src/components/CommandButton.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CommandButton } from './CommandButton';

describe('CommandButton', () => {
  it('renders links without losing their destination', () => {
    render(<CommandButton href="#work">Explore mission logs</CommandButton>);
    expect(screen.getByRole('link', { name: 'Explore mission logs' })).toHaveAttribute('href', '#work');
  });

  it('renders a native button for actions', () => {
    render(<CommandButton type="button">Launch training</CommandButton>);
    expect(screen.getByRole('button', { name: 'Launch training' })).toHaveAttribute('type', 'button');
  });
});
```

- [ ] **Step 2: Run the test to verify failure**

Run: `npm run test -- src/components/CommandButton.test.tsx`

Expected: FAIL because `CommandButton` does not exist.

- [ ] **Step 3: Add global tokens**

Replace the old cyan-led root tokens with:

```css
:root {
  --color-void: #07142f;
  --color-command-navy: #0e2148;
  --color-deep-violet: #483aa0;
  --color-orbit-lilac: #7965c1;
  --color-silver: #c7ccd8;
  --color-signal-white: #f7f8fc;
  --color-muted: #9da9c5;
  --color-status: #a9f4d0;
  --color-line: rgb(199 204 216 / 18%);
  --color-line-strong: rgb(221 231 255 / 38%);
  --focus-ring: #f7f8fc;
  color-scheme: dark;
}
```

Change `html`, `body`, and `#root` to `min-height: 100%` without fixed height. Set `body { overflow-x: hidden; overflow-y: auto; }`. Keep the reduced-motion media query.

- [ ] **Step 4: Add reduced-motion-safe motion presets**

Create `src/lib/motion.ts`:

```ts
import type { Variants } from 'framer-motion';

export const sectionReveal = (reducedMotion: boolean): Variants => ({
  hidden: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: reducedMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' },
  },
});

export const revealViewport = { once: true, amount: 0.18 } as const;
```

Feature workers use these presets with Framer `m` components inside the single `LazyMotion` provider added in Task 8. Do not add independent motion constants inside feature files.

- [ ] **Step 5: Implement CommandButton**

Create `src/components/CommandButton.tsx`:

```tsx
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import styles from './CommandButton.module.css';

type Variant = 'primary' | 'secondary' | 'quiet';

interface CommandButtonProps {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  disabled?: boolean;
}

export const CommandButton = ({
  children,
  className,
  variant = 'secondary',
  href,
  onClick,
  type = 'button',
  ariaLabel,
  disabled,
}: CommandButtonProps) => {
  const classes = cn(styles.button, styles[variant], className);

  if (href) {
    return (
      <a aria-label={ariaLabel} className={classes} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button aria-label={ariaLabel} className={classes} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
};
```

Create `CommandButton.module.css` with a shared minimum height of 44 px. The primary variant uses the violet gradient; secondary uses navy with a silver border; quiet has no filled surface. Preserve the global focus-visible ring.

- [ ] **Step 6: Verify primitives and commit**

Run:

```bash
npm run test -- src/components/CommandButton.test.tsx
npm run lint
npm run typecheck
```

Expected: all commands exit 0.

Commit:

```bash
git add src/styles/global.css src/lib/utils.ts src/lib/motion.ts src/components/CommandButton.tsx src/components/CommandButton.module.css src/components/CommandButton.test.tsx
git commit -m "feat: add command centre design primitives"
```

---

### Task 5: Build Navigation, Hero, Proof Strip, Crew, and Footer

**Owner:** Shell/Crew worker, branch `codex/redesign-shell`

**Files:**
- Create: `src/features/navigation/CommandNav.tsx`
- Create: `src/features/navigation/CommandNav.module.css`
- Create: `src/features/navigation/CommandNav.test.tsx`
- Create: `src/features/hero/HeroSection.tsx`
- Create: `src/features/hero/HeroSection.module.css`
- Create: `src/features/hero/HeroSection.test.tsx`
- Create: `src/features/proof-strip/ProofStrip.tsx`
- Create: `src/features/proof-strip/ProofStrip.module.css`
- Create: `src/features/crew/CrewSection.tsx`
- Create: `src/features/crew/CrewSection.module.css`
- Create: `src/features/command-footer/CommandFooter.tsx`
- Create: `src/features/command-footer/CommandFooter.module.css`

**Interfaces:**
- Consumes: `profile` from `src/data/profile.ts`, `CharacterProfile[]`, `CommandButton`, `Sheet`, and a `onLaunchTraining(): void` callback.
- Produces: section components with IDs `top`, `crew`, and a navigation API that does not own global app state.

- [ ] **Step 1: Write failing navigation and hero tests**

Create tests asserting:

```tsx
expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
expect(screen.getByRole('link', { name: 'Mission logs' })).toHaveAttribute('href', '#work');
expect(screen.getByRole('heading', { level: 1, name: /engineer the calm/i })).toBeInTheDocument();
expect(screen.getByRole('link', { name: /explore mission logs/i })).toHaveAttribute('href', '#work');
```

The mobile sheet test must click a unique `Open navigation` button and assert the same anchors are available in the sheet.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test -- src/features/navigation src/features/hero`

Expected: FAIL because the components do not exist.

- [ ] **Step 3: Implement the semantic shell sections**

Use these exact public interfaces:

```tsx
export interface HeroSectionProps {
  benHeroSrc: string;
}

export interface CrewMember {
  id: 'ben' | 'dog' | 'cat';
  name: string;
  heroSrc: string;
  assignment: string;
  callSign: string;
}

export interface CrewSectionProps {
  members: CrewMember[];
}
```

`CommandNav` renders a sticky `<header>`, a `<nav aria-label="Primary">`, these exact anchors, and a `Training sim` link to `#training`:

```tsx
const links = [
  { href: '#work', label: 'Mission logs' },
  { href: '#systems', label: 'Systems' },
  { href: '#experience', label: 'Experience' },
  { href: '#crew', label: 'Crew' },
  { href: '#training', label: 'Training sim' },
] as const;
```

`HeroSection` renders `profile.headline`, `profile.summary`, the six proof values, and:

```tsx
<div className={styles.actions}>
  <CommandButton href="#work" variant="primary">Explore mission logs</CommandButton>
  <CommandButton href="#experience">View experience</CommandButton>
</div>
```

`HeroSection` uses `<section id="top">`. `ProofStrip` uses `<aside aria-label="Positioning summary">` so it does not create an unlabeled main section. `CrewSection` uses `<section id="crew">` and renders one `<article>` per `CrewMember`; use the approved assignments and call signs from the specification. `CommandFooter` uses the existing verified GitHub, LinkedIn, and CV URLs rather than `#` placeholders.

Use `m.section` with `sectionReveal(reducedMotion)` for the hero and crew entry only. In `HeroSection`, create `const heroRef = useRef<HTMLElement>(null)` and `const heroInView = useInView(heroRef, { amount: 0.2 })`; set `data-ambient-active={heroInView && !reducedMotion}`. The orbit CSS defaults to `animation-play-state: paused` and switches to `running` only under `[data-ambient-active='true']`. Reduced-motion CSS disables it.

- [ ] **Step 4: Add responsive CSS**

Use a `min(1320px, calc(100% - 48px))` content width on desktop and `calc(100% - 28px)` below 680 px. The hero becomes one column below 1020 px. The crew is three columns on desktop and one column below 680 px. Do not use fixed viewport height.

- [ ] **Step 5: Run focused verification**

Run:

```bash
npm run test -- src/features/navigation src/features/hero
npm run lint
npm run typecheck
```

Expected: all commands exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/features/navigation src/features/hero src/features/proof-strip src/features/crew src/features/command-footer
git commit -m "feat: build command centre shell sections"
```

---

### Task 6: Build Mission Logs, Project Briefings, and Experience

**Owner:** Missions/Experience worker, branch `codex/redesign-missions`

**Files:**
- Create: `src/features/mission-logs/MissionLogsSection.tsx`
- Create: `src/features/mission-logs/MissionCard.tsx`
- Create: `src/features/mission-logs/ProjectBriefingSheet.tsx`
- Create: `src/features/mission-logs/MissionLogsSection.module.css`
- Create: `src/features/mission-logs/MissionLogsSection.test.tsx`
- Create: `src/features/experience/ExperienceTimeline.tsx`
- Create: `src/features/experience/ExperienceTimeline.module.css`
- Create: `src/features/experience/ExperienceTimeline.test.tsx`

**Interfaces:**
- Consumes: `ProjectEntry[]`, `TimelineEvent[]`, shadcn `Sheet`, and `Separator`.
- Produces: `<MissionLogsSection id="work" projects={projects} />` and `<ExperienceTimeline id="experience" events={timelineEvents} />`.

- [ ] **Step 1: Write the failing mission-log test**

```tsx
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { projects } from '@/data/projects';
import { renderWithProviders } from '@/test/render';
import { MissionLogsSection } from './MissionLogsSection';

it('opens a complete engineering briefing', async () => {
  const user = userEvent.setup();
  renderWithProviders(<MissionLogsSection projects={projects} />);
  await user.click(screen.getByRole('button', { name: 'Open Pokeleximon Daily engineering briefing' }));
  expect(screen.getByRole('dialog', { name: 'Pokeleximon Daily engineering briefing' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Key decisions' })).toBeInTheDocument();
});
```

Write an experience test that asserts the current SKAO entry appears before Flutter UKI and requires no expansion click.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test -- src/features/mission-logs src/features/experience`

Expected: FAIL because the feature components do not exist.

- [ ] **Step 3: Implement the mission previews and sheet**

Use these exact interfaces:

```tsx
interface MissionLogsSectionProps {
  id: string;
  projects: ProjectEntry[];
}

interface ProjectBriefingSheetProps {
  project: ProjectEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

Render only `projects.filter((project) => project.featured)`. Each card owns a button with:

```tsx
<button
  type="button"
  aria-label={`Open ${project.title} engineering briefing`}
  onClick={() => setSelectedProjectId(project.id)}
>
  Open engineering briefing
</button>
```

The sheet title is `${project.title} engineering briefing`. Render headings for Context, Constraint, Responsibilities, Key decisions, System shape, Delivery and operations, Outcome or learning, and Links. Omit an optional field when it is absent; never insert filler copy.

- [ ] **Step 4: Implement the experience timeline**

Use:

```tsx
interface ExperienceTimelineProps {
  id: string;
  events: TimelineEvent[];
}

export const ExperienceTimeline = ({ id, events }: ExperienceTimelineProps) => (
  <section id={id} aria-labelledby={`${id}-heading`}>
    <h2 id={`${id}-heading`}>Experience with operating context.</h2>
    <ol>
      {events.map((event) => (
        <li key={`${event.year}-${event.title}`}>
          {event.year && <time>{event.year}</time>}
          <h3>{event.title}</h3>
          {event.description && <p>{event.description}</p>}
        </li>
      ))}
    </ol>
  </section>
);
```

- [ ] **Step 5: Add responsive styling and run checks**

Mission cards use image/copy columns above 900 px and stack below. Project images use `loading="lazy"`, explicit width/height, and `object-fit: cover`.

Use `m.article` with `sectionReveal(reducedMotion)` on first entry. Hover motion is limited to `y: -2` on the card and `scale: 1.025` on its image; disable both when reduced motion is active.

Run:

```bash
npm run test -- src/features/mission-logs src/features/experience
npm run lint
npm run typecheck
```

- [ ] **Step 6: Commit**

```bash
git add src/features/mission-logs src/features/experience
git commit -m "feat: add engineering mission briefings"
```

---

### Task 7: Build the Accessible Systems Topology

**Owner:** Topology worker, branch `codex/redesign-topology`

**Files:**
- Create: `src/features/systems-topology/SystemsTopology.tsx`
- Create: `src/features/systems-topology/SystemsTopology.module.css`
- Create: `src/features/systems-topology/SystemsTopology.test.tsx`

**Interfaces:**
- Consumes: `topologyGroups`, `topologyNodes`, `TopologyGroupId`, and shadcn `Tooltip`.
- Produces: `<SystemsTopology id="systems" />` with internal selected focus state and deterministic node classes.

- [ ] **Step 1: Write the failing interaction test**

```tsx
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import { SystemsTopology } from './SystemsTopology';

it('updates pressed state and highlighted nodes', async () => {
  const user = userEvent.setup();
  renderWithProviders(<SystemsTopology id="systems" />);
  const product = screen.getByRole('button', { name: 'Product systems' });
  await user.click(product);
  expect(product).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByTestId('topology-node-pokeleximon')).toHaveAttribute('data-active', 'true');
  expect(screen.getByTestId('topology-node-safelog')).toHaveAttribute('data-active', 'false');
});
```

Add a test asserting all five node labels remain in the DOM after switching focus.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm run test -- src/features/systems-topology`

Expected: FAIL because `SystemsTopology` does not exist.

- [ ] **Step 3: Implement deterministic topology state**

Use:

```ts
const [activeGroup, setActiveGroup] = useState<TopologyGroupId>('platform');
const isActive = (node: TopologyNode) => node.groups.includes(activeGroup);
```

Render three native buttons with `aria-pressed`. Render all nodes as articles with `data-active={isActive(node)}`. Use a fixed SVG path layer marked `aria-hidden="true"`; do not calculate positions at runtime.

Use Framer `m.article` only to interpolate active-node opacity and a maximum 3 px vertical offset. Pass `transition={{ duration: reducedMotion ? 0 : 0.2 }}`; node content and order never animate.

- [ ] **Step 4: Implement the narrow-screen form**

At widths below 680 px, hide decorative SVG paths and place every node in a vertical connected list. Retain the three focus buttons and active-state border; do not hide inactive nodes.

- [ ] **Step 5: Run checks and commit**

```bash
npm run test -- src/features/systems-topology
npm run lint
npm run typecheck
git add src/features/systems-topology
git commit -m "feat: add interactive systems topology"
```

---

### Task 8: Compose the Scrolling Portfolio and Wire Assets

**Owner:** Integration lead

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.module.css`
- Modify: `src/data/characters.ts`
- Modify: `src/utils/assets.ts`
- Modify: `src/styles/global.css`
- Create: `src/App.test.tsx`
- Delete after verification: obsolete intro/character-select imports from `src/App.tsx` only; retain source files until release cleanup.

**Interfaces:**
- Consumes: all Wave 1 and Wave 2 section components, data exports, and the command-v2 manifest.
- Produces: the complete recruiter-facing document through the Crew section. Task 9 Step 7 adds the optional training section and dialog before QA starts.

- [ ] **Step 1: Cherry-pick Wave 1 and Wave 2 commits**

Cherry-pick in dependency order: Foundation, Content, Art, Shell/Crew, Missions/Experience, Topology. After each cherry-pick run `npm run typecheck`. Resolve reserved-file proposals manually.

- [ ] **Step 2: Write the failing app-flow test**

Create `src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('portfolio document', () => {
  it('shows professional evidence without an intro gate', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /engineer the calm/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pokeleximon Daily' })).toBeInTheDocument();
    expect(screen.queryByText(/press start/i)).not.toBeInTheDocument();
  });

  it('uses the approved section order', () => {
    render(<App />);
    const ids = Array.from(document.querySelectorAll('main > section')).map((section) => section.id);
    expect(ids).toEqual(['top', 'work', 'systems', 'experience', 'crew']);
  });
});
```

- [ ] **Step 3: Run the test to verify failure**

Run: `npm run test -- src/App.test.tsx`

Expected: FAIL because the current app still renders the intro/staged character selector.

- [ ] **Step 4: Add command-v2 asset helpers**

Extend `CharacterAssets` with `hero: string`. Add `commandCharacterAssetPath(characterId, file)` in `src/utils/assets.ts`, implemented through the existing `withBase`. Wire final approved manifest paths in `src/data/characters.ts`; keep the existing character copy for the minigame only.

- [ ] **Step 5: Replace staged App state**

`App.tsx` has no top-level interaction state in this task. Compose the recruiter-facing sections in this order:

```tsx
const App = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const crewMembers = buildCrewMembers(characters);

  return (
    <LazyMotion features={domAnimation} strict>
      <TooltipProvider delayDuration={150}>
        <div className={styles.app} data-reduced-motion={prefersReducedMotion}>
          <CommandNav />
          <main>
            <HeroSection benHeroSrc={crewMembers[0].heroSrc} />
            <ProofStrip />
            <MissionLogsSection id="work" projects={projects} />
            <SystemsTopology id="systems" />
            <ExperienceTimeline id="experience" events={timelineEvents} />
            <CrewSection members={crewMembers} />
          </main>
          <CommandFooter />
        </div>
      </TooltipProvider>
    </LazyMotion>
  );
};
```

Define `buildCrewMembers(characters: CharacterProfile[]): CrewMember[]` beside the character data or in `src/data/characters.ts`; it maps the approved assignments/call signs and the new `assets.hero` paths without duplicating public URLs.

- [ ] **Step 6: Replace viewport-locked layout CSS**

Remove `height: 100dvh`, fixed grid rows, and app-level `overflow: hidden`. Keep background layers fixed and pointer-free. Add `scroll-margin-top` to section IDs so sticky navigation never covers headings.

- [ ] **Step 7: Run the integration gate**

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

Expected: all commands exit 0; `dist/index.html` references `/ben-portfolio/assets/`.

- [ ] **Step 8: Commit**

```bash
git add src/App.tsx src/App.module.css src/App.test.tsx src/data/characters.ts src/utils/assets.ts src/styles/global.css
git commit -m "feat: compose recruiter-first portfolio"
```

---

### Task 9: Adapt Signal Sprint into a Lazy Training Dialog

**Owner:** Training worker, branch `codex/redesign-training`

**Files:**
- Create: `src/features/training/TrainingModule.tsx`
- Create: `src/features/training/TrainingModule.module.css`
- Create: `src/features/training/TrainingDialog.tsx`
- Create: `src/features/training/TrainingDialog.test.tsx`
- Modify: `src/features/mission-runner/MissionRunner.tsx`
- Modify: `src/features/mission-runner/MissionRunner.module.css`
- Modify: `src/features/audio/AudioManager.tsx`

**Interfaces:**
- Consumes: `open: boolean`, `onOpenChange(open: boolean): void`, `characters`, `MissionRunner`, and shadcn `Dialog`.
- Produces: `<TrainingModule onLaunch(): void />` as `<section id="training">` and `<TrainingDialog open onOpenChange />` with lazy runner import.

- [ ] **Step 1: Write the failing dialog lifecycle test**

```tsx
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { TrainingDialog } from './TrainingDialog';

it('opens the runner only after explicit launch and restores close state', async () => {
  const user = userEvent.setup();
  const onOpenChange = vi.fn();
  renderWithProviders(<TrainingDialog open onOpenChange={onOpenChange} />);
  expect(await screen.findByRole('dialog', { name: 'Signal Sprint training simulation' })).toBeInTheDocument();
  await user.keyboard('{Escape}');
  expect(onOpenChange).toHaveBeenCalledWith(false);
});
```

Add a test that renders the closed dialog and asserts runner instructions are absent.

- [ ] **Step 2: Run the test to verify failure**

Run: `npm run test -- src/features/training`

Expected: FAIL because the training components do not exist.

- [ ] **Step 3: Implement lazy loading**

Use:

```tsx
export interface TrainingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LazyMissionRunner = lazy(() =>
  import('../mission-runner/MissionRunner').then(({ MissionRunner }) => ({ default: MissionRunner })),
);

export const TrainingDialog = ({ open, onOpenChange }: TrainingDialogProps) => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="signal-sprint-description">
        <DialogHeader>
          <DialogTitle>Signal Sprint training simulation</DialogTitle>
          <DialogDescription id="signal-sprint-description">
            Jump with Space, Arrow Up, W, or a pointer press. Avoid incoming obstacles.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <Suspense fallback={<p>Preparing Signal Sprint…</p>}>
            <LazyMissionRunner
              character={characters[0]}
              reducedMotion={reducedMotion}
              onExit={() => onOpenChange(false)}
            />
          </Suspense>
        )}
      </DialogContent>
    </Dialog>
  );
};
```

Render it only inside an open Dialog with `Suspense`. The fallback text is `Preparing Signal Sprint…`; it may not use a timed fake loading screen.

- [ ] **Step 4: Adapt runner controls and naming**

Change visible title to `Signal Sprint`. Preserve pointer, Space, ArrowUp, and W controls. Ensure global key handlers are attached only while the dialog is open and removed on unmount. Keep `portfolio.runnerBestScore` unchanged.

- [ ] **Step 5: Gate audio on explicit interaction**

Audio may mount inside the open training dialog but starts muted. The existing persisted mute setting may be honoured only after the user presses an audio control.

- [ ] **Step 6: Run checks and commit**

```bash
npm run test -- src/features/training src/features/mission-runner
npm run lint
npm run typecheck
npm run build
git add src/features/training src/features/mission-runner src/features/audio
git commit -m "feat: make signal sprint an optional training module"
```

Inspect the production chunks and confirm the runner is not in the initial JavaScript chunk.

- [ ] **Step 7: Integrate the training module before QA begins**

The integration lead cherry-picks the Task 9 commit, then adds this state and composition to `src/App.tsx`:

```tsx
const [trainingOpen, setTrainingOpen] = useState(false);

<TrainingModule onLaunch={() => setTrainingOpen(true)} />
<TrainingDialog open={trainingOpen} onOpenChange={setTrainingOpen} />
```

Place `TrainingModule` after `CrewSection` inside `<main>` and `TrainingDialog` after `CommandFooter`. Update the App section-order test to expect `['top', 'work', 'systems', 'experience', 'crew', 'training']`. Run `npm run test -- src/App.test.tsx src/features/training` and `npm run build`, then commit:

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: integrate signal sprint training"
```

Tasks 10 and 11 start from this integration commit.

---

### Task 10: Add End-to-End, Accessibility, Base-Path, and Visual Tests

**Owner:** QA worker, branch `codex/redesign-qa`

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/portfolio.spec.ts`
- Create: `tests/e2e/mobile.spec.ts`
- Create: `tests/e2e/a11y.spec.ts`
- Create: `tests/e2e/base-path.spec.ts`
- Create: `tests/e2e/visual.spec.ts`
- Create: `scripts/check-dist-budget.mjs`

**Interfaces:**
- Consumes: the integrated Task 9 app served by `npm run dev -- --host 127.0.0.1`.
- Produces: deterministic release gates callable from package scripts.

- [ ] **Step 1: Configure Playwright**

Create a config with Chromium, Firefox, and WebKit projects; `baseURL: 'http://127.0.0.1:4173/ben-portfolio/'`; and web server command `npm run preview -- --host 127.0.0.1 --port 4173`. Use screenshot retention only on failure outside visual tests.

- [ ] **Step 2: Write recruiter-path tests**

`portfolio.spec.ts` must assert:

```ts
await expect(page.getByRole('heading', { level: 1, name: /engineer the calm/i })).toBeVisible();
await expect(page.getByRole('heading', { name: 'Pokeleximon Daily' })).toBeVisible();
await page.getByRole('button', { name: 'Open Pokeleximon Daily engineering briefing' }).click();
await expect(page.getByRole('dialog', { name: 'Pokeleximon Daily engineering briefing' })).toBeVisible();
```

Also click each primary anchor and assert its section heading is visible.

- [ ] **Step 3: Write mobile and overflow tests**

At widths 320, 390, 768, 1024, and 1440, assert:

```ts
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
expect(overflow).toBeLessThanOrEqual(0);
```

At 390 px, open the mobile navigation sheet and follow the Mission Logs link.

- [ ] **Step 4: Write accessibility tests**

Use `AxeBuilder` on the main page, open project sheet, and open Signal Sprint dialog. Assert no violations with impact `serious` or `critical`. Add keyboard tests for topology focus buttons and Escape-close restoration.

- [ ] **Step 5: Write base-path and visual tests**

`base-path.spec.ts` collects every loaded image `src` and stylesheet/script URL and asserts same-origin asset paths begin with `/ben-portfolio/`. `visual.spec.ts` captures full-page screenshots at 390×844 and 1440×1000 with animations disabled.

- [ ] **Step 6: Add the bundle budget script**

`scripts/check-dist-budget.mjs` must gzip each entry JavaScript file, sum initial entry chunks, fail above `250 * 1024`, and fail when any below-the-fold runtime image exceeds `350 * 1024` bytes. Print exact byte totals.

- [ ] **Step 7: Run the QA gate and commit**

```bash
npm run build
npm run test:e2e
node scripts/check-dist-budget.mjs
git add playwright.config.ts tests scripts/check-dist-budget.mjs
git commit -m "test: add command centre release gates"
```

Expected: all commands exit 0.

---

### Task 11: Perform the Motion and Accessibility Review

**Owner:** Read-only reviewer, branch `codex/redesign-review`

**Files:**
- Create: `docs/reviews/command-centre-motion-a11y.md`

**Interfaces:**
- Consumes: integrated Task 8 page plus Task 9 training dialog.
- Produces: a severity-ranked review with exact file/line references and owning workstream for every finding.

- [ ] **Step 1: Review semantics and keyboard order**

Inspect the DOM and keyboard path from top navigation through footer. Record missing landmarks, heading-order defects, ambiguous names, focus loss, and hidden-but-focusable controls.

- [ ] **Step 2: Review motion with both preferences**

Test `prefers-reduced-motion: no-preference` and `reduce`. Record any animation that delays content, runs continuously below the fold, causes layout shift, or remains active in reduce mode.

- [ ] **Step 3: Review contrast and touch targets**

Check body copy, muted metadata, lilac selected states, navigation, sheets, dialog, and game controls. Record any AA failure or target below 44×44 px that is practical to enlarge.

- [ ] **Step 4: Write the review report**

Use this exact table schema:

```markdown
| Severity | Owner | File:line | Finding | Required correction | Verification |
| --- | --- | --- | --- | --- | --- |
```

If there are no findings in a category, write `No findings` under that category. Do not edit production code.

- [ ] **Step 5: Commit the report**

```bash
git add docs/reviews/command-centre-motion-a11y.md
git commit -m "docs: review command centre motion and accessibility"
```

---

### Task 12: Integrate Wave 3 and Close Review Findings

**Owner:** Integration lead coordinating original owners

**Files:**
- Modify: files identified by the Task 11 report
- Modify: `src/App.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/styles/global.css`
- Modify: `.github/workflows/gh-pages.yml` only if the base-path test exposes a defect
- Delete: obsolete runtime-only components after all imports are removed

**Interfaces:**
- Consumes: the integrated Task 9 release candidate plus Task 10 and Task 11 commits.
- Produces: release candidate with every serious/critical finding closed and every test wired to scripts.

- [ ] **Step 1: Cherry-pick Wave 3 commits**

Cherry-pick QA and Reviewer commits. Training was integrated in Task 9 Step 7. Run `npm run typecheck` after each cherry-pick. The integration lead resolves only shared-file conflicts.

- [ ] **Step 2: Dispatch findings to original owners**

For each report row, send the exact finding to the owner named in the report. Require a focused fix commit and the verification command from the row. Do not create a broad cleanup agent.

- [ ] **Step 3: Remove obsolete staged-experience runtime code**

After `rg` confirms there are no imports, remove unused IntroScreen, LoadingScreen, CharacterRoster, CharacterViewer, PanelTabs, ContentPanel, and old FooterBar runtime files. Retain data or hooks still used by Signal Sprint. Run TypeScript after each feature-directory removal.

- [ ] **Step 4: Run the full release matrix**

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
node scripts/check-dist-budget.mjs
```

Expected: every command exits 0; Playwright reports all configured projects passing; the budget script prints totals under each ceiling.

- [ ] **Step 5: Commit integration**

```bash
git add -A
git commit -m "feat: complete command centre redesign"
```

---

### Task 13: Validate GitHub Pages and Prepare the Pull Request

**Owner:** Integration lead

**Files:**
- Modify: `README.md`
- Modify: `docs/DESIGN.md`
- Modify: `docs/PRD.md`
- Modify: `docs/AGENTS.md`
- Create: `docs/reviews/command-centre-release.md`

**Interfaces:**
- Consumes: the Task 12 release candidate.
- Produces: documented deployment evidence and a reviewable pull request from `codex/command-centre-redesign`.

- [ ] **Step 1: Update repository documentation**

Document the new recruiter-first flow, command-centre tokens, optional Signal Sprint, asset paths, test commands, and the final agent ownership model. Remove descriptions that say Press Start or character selection is the default experience.

- [ ] **Step 2: Run final local verification from a clean install**

```bash
git status --short
npm ci
npm run check
npm run test:e2e
node scripts/check-dist-budget.mjs
```

Expected: status is clean before generated test artifacts; every command exits 0.

- [ ] **Step 3: Push and open a draft pull request**

```bash
git push -u origin codex/command-centre-redesign
```

The PR description must include the design-spec link, implementation-plan link, screenshots at 390×844 and 1440×1000, test results, budget totals, and the explicit note that GitHub Pages remains static and base-path aware.

- [ ] **Step 4: Validate the deployed Pages preview**

Open the deployed URL and verify the hero, both project images, CV link, command crew images, mobile navigation, project sheet, topology, and Signal Sprint. Check the console for asset 404s and errors.

- [ ] **Step 5: Record release evidence**

Create `docs/reviews/command-centre-release.md` with commit SHA, deployment URL, check results, asset/bundle totals, screenshots, and any accepted low-severity limitations. Do not mark the redesign complete while a required gate is failing.

- [ ] **Step 6: Commit documentation**

```bash
git add README.md docs
git commit -m "docs: record command centre release"
git push
```

---

## Agent Brief Templates

### Implementation worker brief

Use the following fully specified example for the Shell/Crew worker; substitute only the task-specific ownership block already written in this plan when dispatching another worker:

```text
You own Task 5 from docs/superpowers/plans/2026-07-28-command-centre-portfolio-redesign.md.
Work only in branch codex/redesign-shell and only in src/features/navigation/**, src/features/hero/**, src/features/proof-strip/**, src/features/crew/**, and src/features/command-footer/**.
Read the approved design spec and your task, then follow every checkbox using TDD where specified.
Do not edit integration-lead-reserved files. Record proposed reserved-file changes in your handoff.
Before returning, run every verification command in your task and commit your work.
Return: scope completed, files changed, commands/results, risks, and commit hash.
```

### Reviewer brief

```text
Review the integrated redesign against Sections 10–12 of the approved design specification.
Do not edit production files. Write only the required review report.
Every finding must include severity, exact file and line, owning workstream, required correction, and verification command.
Return the report commit hash and a count by severity.
```

### Integration lead merge checklist

```text
1. Confirm the worker edited only owned paths.
2. Read the worker summary and inspect its commit diff.
3. Cherry-pick onto codex/command-centre-redesign.
4. Run the task's focused checks.
5. Run npm run typecheck after every cherry-pick.
6. Run the full current suite at the end of each wave.
7. Return failures to the original owner with exact evidence.
```
