# Portfolio OS Recruiter Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved recruiter-polish pass to Portfolio OS: simplify shell chrome, add the Kernel identity and permanent Micro terminal, stabilize Career, correct flagship Work copy, and repair Pokeleximon links/layout.

**Architecture:** Keep the existing React reducer/window architecture for ordinary applications, but remove Command from `AppId` and render a self-contained `MicroTerminal` as a desktop utility. Put identity SVGs in small dependency-free React components and the favicon in `public`. Treat shell, content/Career, and Projects as separate acceptance packets, then run one release packet across the combined exact head.

**Tech Stack:** React 19.2, TypeScript 6 strict mode, Vite 8, Motion/LazyMotion, CSS Modules, Vitest/Testing Library, Playwright, axe-core, static GitHub Pages at `/ben-portfolio/`.

## Global Constraints

- Source of truth: `docs/superpowers/specs/2026-08-13-portfolio-os-polish-design.md`.
- Preserve the Ink, pale-green, signal-orange, hard-border, hard-shadow Portfolio OS direction.
- Canonical result: `Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes`.
- Never annualize or extrapolate the migration metric.
- The command parser remains allow-listed and never evaluates arbitrary input.
- Recruiter-critical content remains reachable without drag or typed commands.
- Keep static GitHub Pages deployment under `/ben-portfolio/`; add no server, router, icon package, WebGL engine, runtime API, or analytics.
- Keep checked-in coverage thresholds at 91% and actual statements, branches, functions, and lines above 90%.
- Preserve keyboard, direct-hash, browser-history, reduced-motion, mobile, 200%-zoom, and 320-CSS-pixel behavior.
- Never modify or stage `.DS_Store`.
- Required handoff per packet: Product Owner task packet → Tester RED evidence → Developer implementation → Tester GREEN/manual evidence → Product Owner acceptance.

## File Map

**Create**

- `src/shell/BrandMark.tsx` — reusable accessible/decorative Kernel monogram SVG.
- `src/shell/UtilityIcon.tsx` — three local SVG icon variants: `github`, `linkedin`, `cv`.
- `src/apps/command/MicroTerminal.tsx` — permanent allow-listed command form with one bounded result.
- `src/apps/command/MicroTerminal.module.css` — compact terminal presentation and desktop/mobile placement.
- `docs/tasks/PORT-014-shell-polish.md` — Product Owner packet for identity, viewport, dock, overlay, and titlebar.
- `docs/tasks/PORT-015-micro-terminal.md` — Product Owner packet for Command-to-utility refactor.
- `docs/tasks/PORT-016-work-career-polish.md` — Product Owner packet for exact Work copy and stable Career controls.
- `docs/tasks/PORT-017-projects-release.md` — Product Owner packet for Pokeleximon and final release gates.
- `docs/testing/portfolio-polish-report.md` — exact-head Tester evidence and Product Owner outcome.

**Modify**

- `public/favicon.svg` — Kernel monogram favicon.
- `src/shell/MenuBar.tsx`, `src/shell/MenuBar.module.css` — simplified identity/location header.
- `src/shell/Dock.tsx`, `src/shell/Dock.module.css` — app navigation plus icon-and-label utility group.
- `src/shell/PortfolioShell.module.css` — larger framed viewport and safe responsive gutters.
- `src/shell/Desktop.tsx`, `src/shell/Desktop.module.css` — remove wallpaper statement and mount Micro terminal.
- `src/shell/WindowFrame.module.css` — uninterrupted titlebar lower rule.
- `src/shell/WindowLayer.tsx` — remove Command window registration and rendering.
- `src/data/models.ts`, `src/app/portfolioState.ts`, `src/app/portfolioReducer.ts` — remove Command from window-managed application state.
- `src/apps/career/CareerApp.tsx`, `src/apps/career/CareerStage.tsx`, `src/apps/career/CareerApp.module.css` — stable content/control rows and opacity-only transition.
- `src/apps/work/WorkApp.tsx`, `src/apps/work/WorkApp.module.css`, `src/apps/work/FeaturedWork.tsx`, `src/apps/work/FeaturedWork.module.css`, `src/data/work.ts`, `src/data/models.ts` — exact claim, first-person ownership, no Work tags.
- `src/data/projects.ts`, `src/apps/projects/ProjectsApp.module.css`, `src/components/ProjectMedia.module.css` — repository-only Pokeleximon link and non-overlapping featured layout.
- Existing tests under `tests/unit` and `tests/e2e` — replace obsolete assertions and add acceptance coverage.
- `tests/e2e/visual.spec.ts-snapshots/*.png` — regenerate only after all behavioral/a11y gates pass and manually inspect every changed baseline.

**Delete after references are removed**

- `src/apps/command/CommandApp.tsx`.
- `src/apps/command/CommandApp.module.css`.

---

### Task 1 / PORT-014: Shell Identity, Utility Dock, Viewport, and Shared Chrome

**Files:**

- Create: `src/shell/BrandMark.tsx`
- Create: `src/shell/UtilityIcon.tsx`
- Create: `docs/tasks/PORT-014-shell-polish.md`
- Modify: `public/favicon.svg`
- Modify: `src/shell/MenuBar.tsx`
- Modify: `src/shell/MenuBar.module.css`
- Modify: `src/shell/Dock.tsx`
- Modify: `src/shell/Dock.module.css`
- Modify: `src/shell/PortfolioShell.module.css`
- Modify: `src/shell/Desktop.tsx`
- Modify: `src/shell/Desktop.module.css`
- Modify: `src/shell/WindowFrame.module.css`
- Test: `tests/unit/foundation.test.tsx`
- Test: `tests/unit/release-audit.test.ts`
- Test: `tests/e2e/responsive.spec.ts`
- Test: `tests/e2e/window-system.spec.ts`
- Test: `tests/e2e/accessibility.spec.ts`

**Interfaces:**

- Produces: `BrandMark({ className?: string, decorative?: boolean }): JSX.Element`.
- Produces: `UtilityIcon({ kind: 'github' | 'linkedin' | 'cv' }): JSX.Element` with `aria-hidden="true"`.
- Preserves: bottom-dock `data-dock-app-id` controls and visible text labels for ordinary applications.
- Preserves: `WindowFrame` pointer/control APIs; only shared chrome styling changes.

- [x] **Step 1: Product Owner records the ready packet**

Write `PORT-014` acceptance criteria covering: no top navigation, role, availability, or wallpaper statement; visible Kernel mark and matching favicon; location retained; GitHub/LinkedIn/CV as icon-and-label utility links; reduced outer gutter; uninterrupted titlebar rule; direct hashes, headings, mobile, and keyboard unchanged. Explicitly exclude Command behavior, Work/Career copy, and Project layout.

- [x] **Step 2: Tester writes focused RED acceptance tests**

Add component assertions equivalent to:

```tsx
expect(screen.queryByRole('navigation', { name: 'Primary navigation' })).not.toBeInTheDocument();
expect(screen.queryByText('Mid-level platform engineer')).not.toBeInTheDocument();
expect(screen.queryByText(/open to platform and backend/i)).not.toBeInTheDocument();
expect(screen.getByTestId('portfolio-os-mark')).toBeInTheDocument();
expect(screen.getByText('Manchester, UK')).toBeVisible();
expect(screen.getByRole('link', { name: 'GitHub' })).toContainHTML('<svg');
expect(screen.getByRole('link', { name: 'LinkedIn' })).toContainHTML('<svg');
expect(screen.getByRole('link', { name: 'Download CV' })).toHaveAttribute('download', 'ben-hutchinson-cv.pdf');
expect(screen.queryByText('BUILD CLEAR PATHS')).not.toBeInTheDocument();
```

Extend the release audit to parse `public/favicon.svg` and assert the Ink `#132218`, pale-green `#d9f7c5`, and signal-orange `#ff6542` geometry. Add browser geometry assertions that the frame's left gutter is smaller than the accepted baseline but remains positive, the page has no horizontal overflow at 320 CSS pixels, and the titlebar lower edge spans beneath the maximize control.

- [x] **Step 3: Tester proves the new tests fail for the expected reasons**

Run:

```bash
npm test -- tests/unit/foundation.test.tsx tests/unit/release-audit.test.ts
CI=1 PLAYWRIGHT_PORT=4221 npx playwright test tests/e2e/responsive.spec.ts tests/e2e/window-system.spec.ts tests/e2e/accessibility.spec.ts --project=Chromium
```

Expected: RED only for the still-present navigation/copy/overlay, old favicon, ungrouped CV utility, old gutter geometry, or interrupted titlebar rule. Existing unrelated assertions remain green.

- [x] **Step 4: Developer implements dependency-free SVG identity and utilities**

Implement the stable component signatures:

```tsx
export interface BrandMarkProps {
  readonly className?: string;
  readonly decorative?: boolean;
}

export function BrandMark({ className, decorative = true }: BrandMarkProps): JSX.Element {
  return (
    <svg className={className} data-testid="portfolio-os-mark" viewBox="0 0 64 64"
      aria-hidden={decorative || undefined} role={decorative ? undefined : 'img'}>
      {decorative ? null : <title>Portfolio OS</title>}
      <rect x="3" y="3" width="58" height="58" rx="5" fill="#132218" />
      <path d="M16 15v34h20c9 0 14-4 14-10 0-5-3-8-8-9 4-2 6-5 6-8 0-5-4-7-12-7H16Zm9 8h10c3 0 4 1 4 3s-1 3-4 3H25v-6Zm0 13h12c3 0 5 1 5 3s-2 3-5 3H25v-6Z" fill="#d9f7c5" />
      <rect x="47" y="47" width="9" height="9" fill="#ff6542" />
    </svg>
  );
}
```

Mirror the same geometry in `public/favicon.svg`. Implement `UtilityIcon` with a discriminated `kind` prop and local paths; do not install a package:

```tsx
export type UtilityIconKind = 'github' | 'linkedin' | 'cv';

const paths: Readonly<Record<UtilityIconKind, JSX.Element>> = {
  github: <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.84c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />,
  linkedin: <path d="M5.2 7.8H1.8V22h3.4V7.8ZM3.5 2A2 2 0 1 0 3.5 6a2 2 0 0 0 0-4ZM22 13.9c0-4.3-2.3-6.3-5.4-6.3-2.5 0-3.6 1.4-4.2 2.3V7.8H9V22h3.4v-7c0-1.8.4-3.6 2.7-3.6s2.3 2.1 2.3 3.7V22H22v-8.1Z" />,
  cv: <><path d="M5 2h10l4 4v16H5V2Zm9 1v5h5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M8 12h8M8 16h5M15 19l2 2 2-2M17 14v7" fill="none" stroke="currentColor" strokeWidth="2" /></>,
};

export function UtilityIcon({ kind }: { readonly kind: UtilityIconKind }): JSX.Element {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{paths[kind]}</svg>;
}
```

- [x] **Step 5: Developer simplifies shell composition and corrects shared styling**

Remove `menuItems`, route-selection helpers, role, and availability rendering from `MenuBar`; keep skip-link logic, semantic desktop `h1`, Ben's name, BrandMark, and location. Move CV beside GitHub/LinkedIn in `Dock.utilityLinks`, render each `UtilityIcon`, and remove the old CV application styling.

Set the desktop shell to a smaller responsive outer gutter and larger frame, for example:

```css
.page { padding: clamp(var(--space-2), 1.5vw, var(--space-4)); }
.frame { width: min(100%, 98rem); min-height: calc(100vh - 2 * clamp(var(--space-2), 1.5vw, var(--space-4))); }
```

Remove `backgroundStatement` markup/styles. Make the shared titlebar rule independent of child backgrounds by drawing it at titlebar level with an inset rule:

```css
.titleBar {
  border-bottom: 0;
  box-shadow: inset 0 calc(-1 * var(--border-heavy)) 0 var(--color-ink);
}
```

Keep the controls above the rule without masking it and retain 44-pixel hit areas.

- [x] **Step 6: Developer runs focused checks and commits production files only**

Run:

```bash
npm run typecheck
npm run lint
npm test -- tests/unit/foundation.test.tsx tests/unit/release-audit.test.ts
npm run build
npm run check:bundle
```

Then commit the production and PO task files without Tester-owned tests:

```bash
git add public/favicon.svg src/shell/BrandMark.tsx src/shell/UtilityIcon.tsx src/shell/MenuBar.tsx src/shell/MenuBar.module.css src/shell/Dock.tsx src/shell/Dock.module.css src/shell/PortfolioShell.module.css src/shell/Desktop.tsx src/shell/Desktop.module.css src/shell/WindowFrame.module.css docs/tasks/PORT-014-shell-polish.md
git commit -m "feat: polish Portfolio OS shell"
```

- [x] **Step 7: Tester runs GREEN, manual geometry/a11y checks, and commits tests**

Run the focused commands from Step 3 plus typecheck, lint, build, bundle, and coverage. Manually inspect 1440×1000, 1280×800, 390×844, 320×568, keyboard focus, 200% zoom, and all direct hashes. Record exact measurements/screenshots in `docs/testing/portfolio-polish-report.md` and commit only Tester files with `test: verify PORT-014 shell polish`.

- [x] **Step 8: Product Owner accepts PORT-014**

Compare the exact head and evidence to PORT-014 and the design spec. Accept only when every item is visible and the top-bar simplification does not break heading order or navigation.

**Task 1 Product Owner acceptance: ACCEPTED at `a98894a` on 2026-08-13.** Production candidate `568a053`, Tester GREEN evidence `1384fbd`, and the corrected exact-head breakpoint evidence at `a98894a` satisfy PORT-014. The focused Chromium suite passes 10 tests with one intentional project-guard skip and no failures; no production defect or open bounded change request remains.

---

### Task 2 / PORT-015: Permanent Micro Terminal

**Files:**

- Create: `src/apps/command/MicroTerminal.tsx`
- Create: `src/apps/command/MicroTerminal.module.css`
- Create: `docs/tasks/PORT-015-micro-terminal.md`
- Modify: `src/shell/Desktop.tsx`
- Modify: `src/shell/Dock.tsx`
- Modify: `src/shell/WindowLayer.tsx`
- Modify: `src/data/models.ts`
- Modify: `src/app/portfolioState.ts`
- Modify: `src/app/portfolioReducer.ts`
- Delete: `src/apps/command/CommandApp.tsx`
- Delete: `src/apps/command/CommandApp.module.css`
- Test: `tests/unit/portfolioReducer.test.ts`
- Test: `tests/unit/content.test.ts`
- Test: `tests/unit/foundation.test.tsx`
- Test: `tests/e2e/contact-command.spec.ts`
- Test: `tests/e2e/window-system.spec.ts`
- Test: `tests/e2e/responsive.spec.ts`

**Interfaces:**

- Consumes unchanged: `parseCommand(rawInput: string): CommandResult`.
- Produces: `MicroTerminal(): JSX.Element`, mounted by `Desktop`.
- Produces: `AppId = 'about' | 'work' | 'career' | 'projects' | 'contact'`.
- Produces: `data-micro-terminal` root, `#portfolio-command` input, and `role="status"` bounded output.

- [x] **Step 1: Product Owner records the ready packet**

Require: permanent bottom-right Micro terminal on desktop; compact Desktop-only mobile presentation; no Command dock item or framed window; no visible explanation/suggestions/history; Enter submission; latest bounded output; allow-listed parser; `cv` download retained; `#command` safely recovers to Desktop; no critical navigation dependency.

- [x] **Step 2: Tester replaces obsolete Command-window tests with RED Micro-terminal tests**

Add assertions equivalent to:

```tsx
const terminal = screen.getByTestId('micro-terminal');
expect(terminal).toHaveTextContent('portfolio command');
expect(within(terminal).getByRole('textbox', { name: 'Portfolio command' })).toBeVisible();
expect(screen.queryByRole('button', { name: 'Command', exact: true })).not.toBeInTheDocument();
expect(screen.queryByText('Optional shortcut')).not.toBeInTheDocument();
expect(screen.queryByText('Command palette')).not.toBeInTheDocument();
```

Browser tests must submit `carear`, verify the bounded status contains `Did you mean “career”?`, submit `<script>alert(1)</script>`, verify inert text and no dialog/script execution, submit `career`, and verify `#career`. At 390×844, verify the terminal exists on `#desktop` but not `#career`. At `#command`, verify the application recovers to `#desktop` and the input can receive focus.

- [x] **Step 3: Tester proves RED against the old framed Command app**

Run:

```bash
npm test -- tests/unit/portfolioReducer.test.ts tests/unit/content.test.ts tests/unit/foundation.test.tsx tests/unit/parseCommand.test.ts
CI=1 PLAYWRIGHT_PORT=4222 npx playwright test tests/e2e/contact-command.spec.ts tests/e2e/window-system.spec.ts tests/e2e/responsive.spec.ts --project=Chromium
```

Expected: RED for the missing Micro terminal and obsolete Command state/window assumptions; parser tests remain green.

- [x] **Step 4: Developer implements the bounded command surface**

Use a single latest result, not a growing history:

```tsx
export function MicroTerminal(): JSX.Element {
  const { state, dispatch } = usePortfolio();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Exclude<CommandResult, { readonly kind: 'clear' }> | null>(null);
  const cvUrl = `${import.meta.env.BASE_URL}cv/ben-hutchinson-cv.pdf`;
  if (state.route.kind !== 'desktop') return <></>;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = parseCommand(input);
    setInput('');
    if (next.kind === 'clear') { setResult(null); return; }
    setResult(next);
    if (next.kind === 'action') dispatch(next.action);
  };

  return (
    <aside className={styles.terminal} data-testid="micro-terminal" aria-label="Portfolio command terminal">
      <div className={styles.titleBar}>
        <span>portfolio command</span>
        <span className={styles.signalDots} aria-hidden="true">● ● ●</span>
      </div>
      <form className={styles.form} onSubmit={submit}>
        <label className={styles.visuallyHidden} htmlFor="portfolio-command">Portfolio command</label>
        <span className={styles.prompt} aria-hidden="true">&gt;_</span>
        <input id="portfolio-command" value={input} onChange={(event) => setInput(event.target.value)}
          autoComplete="off" spellCheck="false" placeholder="type a command…" />
        <button type="submit" aria-label="Run command">↵</button>
      </form>
      {result === null ? null : (
        <div className={styles.result} role="status" aria-live="polite">
          <span>{result.output}</span>
          {result.kind === 'download'
            ? <a href={cvUrl} download="ben-hutchinson-cv.pdf">Download CV</a>
            : null}
        </div>
      )}
    </aside>
  );
}
```

Anchor the desktop surface above the dock with a narrow max width and high-enough shell z-index, but below focused/maximized application content. At mobile/coarse-pointer breakpoints, use normal full-width flow at the end of Desktop and hide it whenever the route is not Desktop.

- [x] **Step 5: Developer removes Command from window-managed state**

Remove `command` from `AppId`, `DEFAULT_WINDOW_POSITIONS`, initial open/order arrays, `WINDOW_APP_ORDER`, titles, sizes, `appContent`, Dock apps, and reducer switch exhaustiveness. Delete `CommandApp` files after `rg "CommandApp|appId: 'command'|data-window-id=\"command\"" src tests` confirms every production reference is accounted for. Preserve parser/registry files unchanged except copy that must reflect the compact surface.

Because `#command` is not a declared route, keep `parseHash`'s known-route contract and verify it normalizes the unknown hash to `#desktop`; on initial Desktop mount, the terminal is present and focusable.

- [x] **Step 6: Developer runs focused checks and commits production files only**

Run typecheck, lint, the focused unit tests, build, and bundle. Commit:

```bash
git add src/apps/command/MicroTerminal.tsx src/apps/command/MicroTerminal.module.css src/apps/command/CommandApp.tsx src/apps/command/CommandApp.module.css src/shell/Desktop.tsx src/shell/Dock.tsx src/shell/WindowLayer.tsx src/data/models.ts src/app/portfolioState.ts src/app/portfolioReducer.ts docs/tasks/PORT-015-micro-terminal.md
git commit -m "feat: add permanent micro terminal"
```

- [x] **Step 7: Tester runs GREEN, security/mobile/manual checks, and commits tests**

Run the focused suite, full coverage, axe, 320/390 mobile, desktop keyboard-only, direct `#command`, invalid characters, `cv`, `clear`, `reset`, and visible-navigation-without-command checks. Append exact evidence and commit Tester files with `test: verify PORT-015 micro terminal`.

- [x] **Step 8: Product Owner accepts PORT-015**

Reject any implementation that behaves as a large window, shows instructional clutter, appears over non-Desktop mobile content, or keeps a duplicate Command dock action.

**Task 2 Product Owner acceptance: ACCEPTED at `6b1e0ce` on 2026-08-18.** Production commits `c18649a` and `459caf6` and Tester commits `88d26bb` and `6b1e0ce` implement and verify the permanent optional Micro terminal. Fresh exact-head evidence: 67/67 focused units, 27/27 components, 13 Chromium passes with one intentional mobile-project guard skip, 3/3 axe checks, 2/2 reduced-motion/200%-zoom checks, and 156/156 coverage tests at 98.88/92.08/99.29/99.57. Typecheck, lint, build, bundle, security, mobile, keyboard, visible navigation, CV, clear/reset, and `#command` recovery all pass. No production defect or bounded change request remains.

---

### Task 3 / PORT-016: Flagship Work Copy and Stable Career Controls

**Files:**

- Create: `docs/tasks/PORT-016-work-career-polish.md`
- Modify: `src/data/work.ts`
- Modify: `src/data/models.ts`
- Modify: `src/apps/work/WorkApp.tsx`
- Modify: `src/apps/work/WorkApp.module.css`
- Modify: `src/apps/work/FeaturedWork.tsx`
- Modify: `src/apps/work/FeaturedWork.module.css`
- Modify: `src/apps/career/CareerApp.tsx`
- Modify: `src/apps/career/CareerStage.tsx`
- Modify: `src/apps/career/CareerApp.module.css`
- Test: `tests/unit/content.test.ts`
- Test: `tests/unit/foundation.test.tsx`
- Test: `tests/e2e/work.spec.ts`
- Test: `tests/e2e/career.spec.ts`
- Test: `tests/e2e/accessibility.spec.ts`

**Interfaces:**

- Produces: `WorkCaseStudy` without the presentation-only `technologies` field; Projects retain their separate `Project.tags` data.
- Preserves: `CareerControls` props and reducer `SELECT_CAREER_STAGE` behavior.
- Changes: `CareerStage` motion metadata to zero vertical offset; opacity may animate for 200ms unless reduced motion is active.

- [x] **Step 1: Product Owner records the ready packet**

Require the exact canonical result, first-person ownership/base-Makefile sentences, absence of Work technology pills, fixed-y Career controls across all four stages, internal content scrolling where required, opacity-only transition, reduced-motion equivalence, and existing Career semantics.

- [x] **Step 2: Tester writes exact-copy and geometry RED tests**

Add unit assertions:

```ts
expect(flagshipWork.result).toBe('Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes');
expect(flagshipWork.ownership).toBe('I proposed the uv/ruff migration.');
expect(flagshipWork.technicalApproach).toBe('I designed the base-Makefile implementation and rollout.');
expect(screen.queryByRole('list', { name: /technologies used/i })).not.toBeInTheDocument();
```

In Playwright, record `controls.boundingBox()?.y` for graduate, observability, associate, and SKAO after each selection and require every value to be within 1 CSS pixel of the first. Assert `data-motion-offset-px="0"` or equivalent metadata, run the same journey at 1440×1000, 1280×800, 390×844, and 200% zoom, and verify the active stage remains readable without page-level horizontal overflow.

- [x] **Step 3: Tester proves RED against old copy/tags/jumping geometry**

Run:

```bash
npm test -- tests/unit/content.test.ts tests/unit/foundation.test.tsx
CI=1 PLAYWRIGHT_PORT=4223 npx playwright test tests/e2e/work.spec.ts tests/e2e/career.spec.ts tests/e2e/accessibility.spec.ts --project=Chromium
```

Expected: RED for exact copy, visible Work tags, nonzero `y` motion, or control-rail movement.

- [x] **Step 4: Developer updates Work data and removes tag presentation**

Set:

```ts
ownership: 'I proposed the uv/ruff migration.',
technicalApproach: 'I designed the base-Makefile implementation and rollout.',
result: 'Migrated 50+ repositories to uv and ruff, reducing average build time by four minutes',
```

Remove the Work pills from `WorkApp` and the technology line from `FeaturedWork`. Remove `technologies` from `WorkCaseStudy` and `flagshipWork`, then delete the now-unused `.technologies` rules in both Work CSS Modules. Keep the unrelated `Project.tags` model and Projects technology lists unchanged.

- [x] **Step 5: Developer fixes Career layout and transition**

Give the Career app stable rows:

```css
.app {
  grid-template-rows: minmax(0, 1fr) auto auto;
  block-size: 100%;
}
.stageViewport { min-height: 0; overflow: auto; }
.controls { align-self: end; }
```

Wrap `CareerStage` in `.stageViewport` when needed so long content scrolls independently. Remove vertical motion:

```tsx
initial={{ opacity: reducedMotion ? 1 : 0.01 }}
animate={{ opacity: 1 }}
transition={{ duration: reducedMotion ? 0 : 0.2, ease: [0.2, 0.8, 0.2, 1] }}
```

Do not hard-code a stage-specific height. On mobile, allow the stage viewport to grow naturally while keeping controls in a consistent flow position and removing any keyed vertical jump.

- [x] **Step 6: Developer runs focused checks and commits production files only**

Run typecheck, lint, focused unit, focused Chromium, build, and bundle. Commit production and PO packet files with `feat: refine Work and Career evidence`.

- [x] **Step 7: Tester runs GREEN, geometry/motion/a11y checks, and commits tests**

Run focused tests, coverage, axe, reduced-motion, keyboard/range/direct-stage controls, 200% zoom, and visual inspection at the four target viewports. Append evidence and commit with `test: verify PORT-016 Work and Career polish`.

- [x] **Step 8: Product Owner accepts PORT-016**

Acceptance requires exact user-supplied copy, no visible Work pills, and stable control geometry without clipping content.

**Task 3 Product Owner acceptance: ACCEPTED at `2bb9d04` on 2026-08-18.** Production commit `a2d8534` and Tester commit `2bb9d04` implement and verify the exact flagship copy, removal of Work technology pills/data, stable Career control geometry, internally scrollable readable evidence, opacity-only motion, and reduced-motion equivalence. Fresh exact-head evidence: 19/19 focused units; 11 focused Chromium passes with four intentional mobile-project guards; 13 shared PORT-014/PORT-015 Chromium passes with one intentional guard; and 158/158 coverage tests at 98.88/92.04/99.28/99.57. Typecheck, lint, build, and bundle checks pass. Recorded rail deltas are 0px at 1440×1000, 0px at 1280×800, 0.359px at 390×844, and 0px at 200% zoom, all within the 1-CSS-pixel ruling. Production review is approved with no findings; no bounded change request remains.

---

### Task 4 / PORT-017: Pokeleximon Corrections and Exact-Head Release

**Files:**

- Create: `docs/tasks/PORT-017-projects-release.md`
- Modify: `src/data/projects.ts`
- Modify: `src/apps/projects/ProjectsApp.module.css`
- Modify: `src/components/ProjectMedia.module.css`
- Modify: `tests/unit/content.test.ts`
- Modify: `tests/e2e/projects.spec.ts`
- Modify: `tests/e2e/responsive.spec.ts`
- Modify: `tests/e2e/visual.spec.ts`
- Modify: `tests/e2e/visual.spec.ts-snapshots/desktop-1440x1000.png`
- Modify: `tests/e2e/visual.spec.ts-snapshots/desktop-390x844.png`
- Modify: `tests/e2e/visual.spec.ts-snapshots/career-1440x1000.png`
- Modify: `tests/e2e/visual.spec.ts-snapshots/career-390x844.png`
- Modify: `docs/testing/portfolio-polish-report.md`

**Interfaces:**

- Produces: Pokeleximon `links` containing one action: `{ label: 'Overview', href: 'https://github.com/ben-hutchinson/pokeleximon' }`.
- Preserves: `ProjectMedia({ project }): JSX.Element` and `Project` model.
- Produces: final exact-head acceptance report covering PORT-014 through PORT-017.

- [ ] **Step 1: Product Owner records the ready packet**

Require no Pokeleximon Live link, Overview to the exact repository URL, no duplicate destination, non-overlapping full screenshot at desktop/tablet/mobile/200%, full combined regression, and exact-head release acceptance. Exclude new project content.

- [ ] **Step 2: Tester writes link and layout RED tests**

Add:

```ts
const pokeleximon = projects.find(({ id }) => id === 'pokeleximon');
expect(pokeleximon?.links).toEqual([
  { label: 'Overview', href: 'https://github.com/ben-hutchinson/pokeleximon' },
]);
```

In Playwright, assert the Pokeleximon title/copy and `ProjectMedia` boxes do not intersect, neither element exceeds its featured-row bounds, the screenshot has a positive rendered height with an aspect ratio close to its intrinsic asset, and there is no large media-column Ink block below the image. Repeat at 1440×1000, 1024×768, 390×844, 320×568, and 200% zoom.

- [ ] **Step 3: Tester proves RED against old links and stretched media row**

Run:

```bash
npm test -- tests/unit/content.test.ts
CI=1 PLAYWRIGHT_PORT=4224 npx playwright test tests/e2e/projects.spec.ts tests/e2e/responsive.spec.ts --project=Chromium
```

Expected: RED for old Live URL and the accepted screenshot overlap/stretch reproduction.

- [ ] **Step 4: Developer updates Pokeleximon data and defensive project layout**

Set the exact single Overview link. In the featured grid, use defensive tracks and top alignment:

```css
.featured {
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  align-items: start;
}
.copy,
.media { min-width: 0; }
.copy h2 { max-width: 100%; overflow-wrap: anywhere; }
```

Ensure `ProjectMedia` does not stretch to the copy height:

```css
.media { align-self: start; height: auto; }
.media img { display: block; width: 100%; height: auto; object-fit: contain; }
```

Keep the existing narrow-width stack and verify copy appears before media in DOM order.

- [ ] **Step 5: Developer runs focused checks and commits production files only**

Run typecheck, lint, focused unit/Chromium, build, and bundle. Commit `src/data/projects.ts`, project/media CSS, and the PO packet with `fix: correct Pokeleximon project presentation`.

- [ ] **Step 6: Tester runs the full exact-head release matrix**

Run from a clean dependency install and isolated ports:

```bash
npm ci
npm run typecheck
npm run lint
npm run test:coverage
npm run build
npm run check:bundle
CI=1 PLAYWRIGHT_PORT=4225 npm run test:e2e
CI=1 PLAYWRIGHT_PORT=4226 npm run test:e2e:a11y
CI=1 PLAYWRIGHT_PORT=4227 npm run test:e2e:visual
git diff --check
```

Record exact pass counts, coverage percentages, bundle bytes, browsers/viewports, axe result, manual keyboard/reduced-motion/zoom evidence, and source commit in `docs/testing/portfolio-polish-report.md`.

- [ ] **Step 7: Tester regenerates visual baselines only after behavioral GREEN**

If the no-update visual run fails only because approved styling changed, run:

```bash
CI=1 PLAYWRIGHT_PORT=4228 npm run test:e2e:visual -- --update-snapshots
CI=1 PLAYWRIGHT_PORT=4229 npm run test:e2e:visual
```

Manually inspect all four PNGs for the Kernel mark, simplified header, larger frame, Micro terminal, stable Career composition, correct Pokeleximon media, focus rings, clipping, and unexpected blank regions. Commit tests, baselines, and report with `test: verify Portfolio OS polish release`.

- [ ] **Step 8: Product Owner performs final acceptance**

Compare the exact Tester head to every section of the polish design spec and all four PORT packets. Mark PORT-014 through PORT-017 accepted only when current evidence is green and `.DS_Store` is the sole allowed unrelated worktree modification. Commit acceptance records with `docs: accept Portfolio OS polish release`.

- [ ] **Step 9: Controller checkpoints and deploys locally for Ben's manual review**

Build exact accepted head and start an isolated production preview:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4230
```

Open `http://127.0.0.1:4230/ben-portfolio/#desktop`, report the exact accepted commit and preview URL, and leave the server running for Ben's manual verification.
