# Personal Projects and Command Suggestions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add TRIVIALISE! with gameplay imagery and its existing trailer, add Taskmon as a mini project, and help visitors discover portfolio commands through live fuzzy suggestions.

**Architecture:** Extend the existing typed project catalogue and its hash-backed detail views. Derive runtime project validation and command choices from that catalogue, then add a pure suggestion matcher and an accessible suggestion list inside the existing Desktop Micro terminal. Suggestions complete an exact allow-listed command; the existing parser remains the only execution path.

**Tech Stack:** Node.js 24 LTS, React 19.2, TypeScript 6 strict mode, Vite 8, CSS Modules, native HTML video, existing React context/reducer and hash navigation, Vitest/Testing Library, Playwright and axe-core. No new runtime dependency.

**Spec:** The user-approved project approach and requested command improvement are recorded in [Scope and design brief](#scope-and-design-brief) below. Apply alongside `docs/PRD.md` §§Projects application, Micro terminal and Navigation; `docs/DESIGN.md` §§Projects and Micro terminal; `docs/SOUL.md`; and `docs/AGENTS.md`. The current user request supersedes historical two-project limits.

**Status:** Proposed for review. Planning only; implementation has not started.

## Global Constraints

- Preserve Portfolio OS, the five-application dock, Pokeleximon's featured position, existing project links and existing Work entries, including the new SKAO catalogue.
- All important content is reachable without dragging or typing commands. The Micro terminal remains a Desktop utility and is absent from other routes.
- Static GitHub Pages hosting remains at `/ben-portfolio/`; every added image, video and caption URL uses the deployment base.
- No autoplay, background video download, video service embed, fuzzy execution, shell evaluation, new router, CMS, server, analytics or runtime package.
- Preserve the existing `204800`-byte gzip initial-JavaScript budget, `1048576`-byte initial-image budget and individual image sizes below `358400` bytes. Trailer data is requested only when the visitor plays it.
- Keep checked-in coverage thresholds at 91% for statements, branches, functions and lines. Do not lower thresholds, weaken assertions or expand exclusions to pass.
- Keep the CV, favicon, existing project WebPs, `.DS_Store` and `.playwright-cli/` unchanged. Do not modify either source project while gathering evidence or media.
- Existing uncommitted changes belong to the prior SKAO Work task: `src/apps/work/WorkDetailApp.tsx`, `src/data/work.ts`, `tests/component/WorkApp.test.tsx`, `tests/e2e/work.spec.ts`, and `tests/unit/content.test.ts`. Preserve them; do not reset or sweep them into unrelated commits. The content test will need additive edits.
- Follow the repository's Product Owner → Tester RED → Developer → independent Tester GREEN → Product Owner acceptance loop. Only one implementation task is active at a time.

## Review Focus

1. Opening an entry after scrolling far down the catalogue must put its title and Back control in view on desktop and mobile; test actual viewport visibility, not just DOM visibility.
2. A suggestion click must survive the input's blur event, and Enter must never both select a suggestion and submit the form. Cover mouse and keyboard separately.
3. Newly added project and Work records must be offered as commands without another runtime ID list. Cover all current IDs and preserve strict invalid-hash recovery.
4. Trailer playback, captions and failure recovery must work under `/ben-portfolio/` without fetching the MP4 on Desktop or the Projects catalogue. Verify network requests and a failed media load.
5. Suggestions must remain visible near the bottom-right desktop edge at reduced heights and 200% zoom, without clipping, covering required controls or trapping Tab. Cover focused empty input, no matches, Escape, IME composition and reduced motion.

## Scope and design brief

### Personal projects

- Retain Pokeleximon Daily and Safelog, in that order. Append `trivialise` and `taskmon` with direct routes `#projects/trivialise` and `#projects/taskmon`.
- TRIVIALISE! is an online trivia board game with shared-screen play, private phone controllers, branching routes and tactical cards. Describe its React/TypeScript UI, PixiJS board presentation and authoritative Cloudflare Durable Object rooms using evidence from the local repository; do not describe planned features as shipped.
- Use a real gameplay screenshot in its catalogue entry. Show the same screenshot plus the existing landscape 20-second Brag trailer on its detail page. Give the trailer a poster, native playback controls, inline playback, captions and a nearby descriptive transcript. It starts paused; `preload="none"`; no autoplay or loop.
- Taskmon is a compact **Mini project** entry: an installable habit/task PWA where completions earn Pokémon encounters, with catching, Pokédex progression, offline support and IndexedDB saves. Use a real app screenshot from an isolated fresh browser with example habits; avoid the generated home-screen/concept mockups and the owner's saved tasks.
- Add Taskmon's live link `https://taskmon.pages.dev` after checking it at execution time. No remote is configured in either local source checkout; do not invent GitHub/source links or a live TRIVIALISE! address.
- Add a data-backed `category: string` to each project: `Featured build`, `Focused utility`, `Realtime board game`, `Mini project`, respectively. Keep the existing featured/compact layout and display the category instead of labelling every non-featured entry a utility. Derive the visible project count from the collection.
- The expanded project detail needs the same scroll-to-start behaviour established for Work. Apply it at the Project detail boundary without changing window positioning or unrelated applications.

### Command discovery and completion

- On input focus with no text, show six useful examples in this order: `help`, `work`, `career`, `projects`, `contact`, `cv`. The initial unfocused Desktop remains compact.
- While typing, show at most six matching commands, each with its exact command text and a short human-readable description. Include root commands, `project <id>` for every project and `work <id>` for every Work entry.
- Match command text, project/work titles and short descriptions. For example, `triv` offers `project trivialise`, `task` offers `project taskmon`, `catalog` offers `work skao-software-catalogue`, and `carrer` offers `career`.
- Normalize search text with trim, lowercase and collapsed whitespace; treat hyphens and punctuation in titles as word boundaries. Do not alter the actual typed value until the user accepts a suggestion.
- Rank exact canonical-command matches first, then command/word prefixes, substrings, ordered subsequences and finally edit distance of at most two for query tokens of at least four characters. Every query token must match candidate text; ties retain registry/catalogue order. Detect the `project ` and `work ` contexts before trimming trailing whitespace; they restrict results to their respective detail completions. Deduplicate by canonical command.
- No suggestion is selected automatically. Arrow Down selects the first match, Arrow Up the last; subsequent arrows wrap. Enter with an explicitly selected option fills the input and closes the list without running it. A second Enter, or **Run command**, submits through `parseCommand`. Clicking an option also fills and refocuses the input without execution. Tab follows normal focus order and never selects or executes.
- Escape closes suggestions without clearing text. Blur/outside focus closes them. Editing or a fresh focus opens them again. Route departure clears suggestion state; stale selection cannot survive a changed query. Enter during IME composition neither selects nor executes.
- No-match queries show `No matching commands. Try help.` Hostile shell-like text produces no executable suggestions and retains the parser's inert error path. Typing an unselected typo and pressing Enter still produces the existing correction message.
- Use the editable combobox/listbox pattern: input keeps accessible name **Portfolio command**, `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls` and `aria-activedescendant` only when an option is active. Options have stable IDs and `aria-selected`; keep DOM focus in the input. The result remains the latest-only polite status region.
- Keep suggestions in the terminal's existing visual language. Use an anchored, bounded list above the field at the desktop's bottom edge, with internal scrolling and readable wrapped descriptions. Remove clipping caused by the terminal's current `overflow: hidden` without changing its window layering. Keep a short keyboard hint visible while the list is open.

### Local evidence and media sources

All paths below are read-only inputs, not deployment-time dependencies:

| Input | Verified local path | Use |
| --- | --- | --- |
| TRIVIALISE! product/architecture | `/Users/ben.hutchinson/code/personal/trivialise!/PRD.md`, `DESIGN.md`, `apps/web/package.json`, `apps/worker/package.json` | Fact-check description and tags against implementation. |
| Gameplay screenshot | `/Users/ben.hutchinson/code/personal/trivialise!/output/playwright/task7-fidelity/current-question-choice-1920.png` | Clear 1920px board with four demo players and question offers; inspected during planning. |
| Landscape trailer | `/Users/ben.hutchinson/code/personal/trivialise!/brag-output/brag.mp4` | H.264/AAC, 1920×1080, 20 seconds, 4,443,726 bytes. Copy unchanged. |
| Trailer poster and script | `/Users/ben.hutchinson/code/personal/trivialise!/brag-output/brag.jpg`, `brag-plan.md` | Optimize poster; inspect actual video to verify captions/transcript. |
| Taskmon purpose/deployment | `/Users/ben.hutchinson/code/personal/taskmon/README.md`, `docs/setup.md`, `src/`, `tests/e2e/taskmon.spec.ts` | Verify offline/local-save scope and capture an example session. |
| Taskmon existing build | `/Users/ben.hutchinson/code/personal/taskmon/dist` | Serve read-only on an unused localhost port for screenshots. Do not rebuild or edit this repository. |

Suggested concise copy, to verify against those sources during Task 1:

- **TRIVIALISE!:** “An online trivia board game where knowledge earns movement, branching routes create choices, and tactical cards add chaos. A shared display and private phone controllers connect to authoritative realtime rooms, with reconnect recovery and deterministic game rules.” Tags: React, TypeScript, PixiJS, Cloudflare Durable Objects, WebSockets.
- **Taskmon:** “A small habit tracker that turns everyday tasks into Pokémon encounters. An installable React and TypeScript PWA with offline play, local IndexedDB saves, catching and Pokédex progression.” Tags: React, TypeScript, PWA, IndexedDB.

## File map

| Boundary | Files and responsibility |
| --- | --- |
| Canonical content | Modify `src/data/models.ts` and `src/data/projects.ts`: new entries, categories, optional trailer data, derived runtime IDs. |
| Existing navigation | Modify `src/app/hashState.ts`, `src/app/portfolioReducer.ts`, `src/apps/command/commandRegistry.ts`: accept canonical project IDs everywhere. |
| Project presentation | Modify `src/apps/projects/ProjectsApp.tsx`, `ProjectDetailApp.tsx` and their CSS Modules only as needed: labels/count, new details, scroll reset and trailer placement. |
| Trailer | Create `src/components/ProjectTrailer.tsx` and `ProjectTrailer.module.css`: isolated native video, transcript and failure presentation. Keep `ProjectMedia` responsible for screenshots. |
| Media | Create `public/assets/ui/project-trivialise.webp`, `project-taskmon.webp`, `project-trivialise-trailer-poster.webp`, and `public/assets/video/trivialise-trailer.mp4`, `trivialise-trailer.en.vtt`. |
| Suggestions | Create `src/apps/command/commandSuggestions.ts`; modify `commandRegistry.ts`, `MicroTerminal.tsx`, `MicroTerminal.module.css`. Keep ranking separate from component interaction and execution. |
| Tests | Extend existing content/hash/reducer/parser, Projects, ProjectMedia, MicroTerminal and browser tests; create `tests/unit/commandSuggestions.test.ts` and `tests/component/ProjectTrailer.test.tsx`. |
| Product docs | Update relevant Projects and Micro terminal paragraphs in `docs/PRD.md` and `docs/DESIGN.md` as each feature lands. Record final acceptance evidence in `docs/testing/2026-10-20-projects-and-command-suggestions.md`. |

## Delivery tasks

Each task uses the repository's Tester/Developer/acceptance boundaries. Commit only intentional task files and preserve prior Work edits. Tasks 1–3 deliver the project additions; Tasks 4–5 deliver completion, consuming the same catalogue. Task 6 accepts the combined result.

### Task 1: Add verified project content and portable media

**Files:** `src/data/models.ts`, `src/data/projects.ts`, the five media files above, `tests/unit/content.test.ts`.

**Interfaces:** Expand `ProjectId` to `'pokeleximon' | 'safelog' | 'trivialise' | 'taskmon'`. Add `category: string` and `trailer?: { readonly src: string; readonly poster: string; readonly captions: string; readonly description: string }` to `Project`. Export `projectIds: readonly ProjectId[]` derived from `projects`, and `isProjectId(value: string): value is ProjectId` from `src/data/projects.ts`. No separate runtime list.

- [ ] **Tester RED:** Update content expectations to four IDs in the specified order; assert all IDs pass `isProjectId`, unknown/title-shaped IDs fail, the original two entries/links remain intact, Taskmon is labelled `Mini project`, and only TRIVIALISE! has trailer metadata. Check every referenced added asset exists and fits its budget.
- [ ] **Verify RED:** `npm test -- tests/unit/content.test.ts`; expect failures for the missing entries/exports/assets, not unrelated prior Work changes.
- [ ] **Developer:** Check local implementation facts, inspect the trailer itself, capture Taskmon with fresh example data and copy/optimize media into this repo. Use a useful gameplay screenshot and an actual Taskmon screenshot, not mockups. Keep new WebPs below 358400 bytes. Retain the 4.4 MB original MP4 with its audio; captions/transcript describe relevant on-screen action and instrumental music. Add the canonical records/interfaces above.
- [ ] **Tester GREEN:** Rerun content tests and inspect image dimensions, readability and encoded video metadata. Verify Taskmon's live destination before adding its link. Leave TRIVIALISE!'s links empty unless a public destination is verified.
- [ ] **Checkpoint:** Review the content/media diff and commit only Task 1 changes. Do not accidentally stage the prior Work portion of `tests/unit/content.test.ts`.

### Task 2: Connect new project routes, labels and commands

**Files:** `src/app/hashState.ts`, `src/app/portfolioReducer.ts`, `src/apps/command/commandRegistry.ts`, `src/apps/projects/ProjectsApp.tsx`, `ProjectDetailApp.tsx`; `tests/unit/hashState.test.ts`, `portfolioReducer.test.ts`, `parseCommand.test.ts`; `tests/component/ProjectsApp.test.tsx`; `docs/PRD.md`, `docs/DESIGN.md`.

**Interfaces:** Consume `projectIds` and `isProjectId` from Task 1. Preserve `SELECT_PROJECT`, `PortfolioRoute` and existing `parseCommand(input: string): CommandResult`. Update project help/error choices from the catalogue; reject extra arguments to `project <id>` just as `work <id>` does.

- [ ] **Tester RED:** Cover both new direct hashes, serialization, reducer selection and `project trivialise`/`project taskmon`. Reject unknown IDs, case-varied hashes, trailing slashes, query strings, extra segments and surplus project arguments. Verify category labels, the derived count and retained Pokeleximon prominence.
- [ ] **Tester RED:** Reproduce selecting the last entry after scrolling down: assert the detail title and Back control intersect the viewport at 1440×1000 and 390×844. Cover direct-load/reload and browser Back/Forward for each new route.
- [ ] **Verify RED:** Run the focused content/hash/reducer/parser/Projects component files. Run the new browser regression after a production build and confirm the intended failures.
- [ ] **Developer:** Remove literal project runtime lists from hash/reducer/commands and validate with Task 1's helpers. Render category/count from data. Reset scrolling at the Project detail boundary for both document-scrolling mobile and internally scrolling desktop, preserving the Work fix and all window controls. Key its `ProjectMedia` by `project.id` so an image error cannot carry over when a command switches directly to another project. Document expanded project scope.
- [ ] **Tester GREEN:** Run focused tests, then `CI=1 PLAYWRIGHT_PORT=4231 npx playwright test tests/e2e/projects.spec.ts --project=Chromium --output=/tmp/portfolio-projects-checks` after rebuilding. Confirm malformed input remains inert and both new routes are shareable/reloadable. Fail one project's image request, switch directly to a different project and verify that its available image renders.
- [ ] **Checkpoint:** Review and commit Task 2 files; keep the catalogue usable even before trailer rendering lands.

### Task 3: Add deliberate trailer playback and accessible fallback

**Files:** `src/components/ProjectTrailer.tsx`, `ProjectTrailer.module.css`, `src/apps/projects/ProjectDetailApp.tsx`, optional detail CSS adjustments; `tests/component/ProjectTrailer.test.tsx`, `tests/e2e/projects.spec.ts`.

**Interfaces:** `ProjectTrailer({ project }: { readonly project: Project }): JSX.Element | null`; return null without `project.trailer`. Consume its four media fields and `import.meta.env.BASE_URL`. Render within the TRIVIALISE! detail after the gameplay screenshot; no trailer in catalogue cards.

- [ ] **Tester RED:** Assert native `controls`, `playsInline`, `preload="none"`, no autoplay/loop, base-safe source/poster/caption URLs, a named English caption track, and readable descriptive text. Assert other projects render no trailer. Trigger video failure and assert useful fallback text while screenshot/description remain usable.
- [ ] **Verify RED:** `npm test -- tests/component/ProjectTrailer.test.tsx tests/component/ProjectsApp.test.tsx`; expect missing-component/media behaviour failures.
- [ ] **Developer:** Implement native video with an accessible name, `<track kind="captions" srcLang="en" label="English">`, a descriptive transcript using verified scene content, and an error boundary local to the video. Preserve the original poster/screenshot aspect ratios and existing tactile frame styling.
- [ ] **Tester GREEN:** In a fresh browser, verify no MP4 request on Desktop/catalogue and no MP4 transfer before explicit play in the detail. Play/pause/seek, caption selection and audio controls work; leaving the detail stops playback. Block the video request and check fallback. Verify at desktop and mobile sizes with reduced motion and no horizontal clipping.
- [ ] **Checkpoint:** Run focused tests/build/bundle checks, review the new media behaviour and commit Task 3.

### Task 4: Build one data-driven command suggestion matcher

**Files:** `src/apps/command/commandSuggestions.ts`, `commandRegistry.ts`, `parseCommand.ts` only if sharing the existing edit-distance helper; create `tests/unit/commandSuggestions.test.ts`, extend `tests/unit/parseCommand.test.ts`.

**Interfaces:** Add readable `label: string` and `description: string` metadata to `CommandDefinition`. Export `CommandSuggestion { readonly command: string; readonly label: string; readonly description: string }` and `getCommandSuggestions(input: string, limit?: number): readonly CommandSuggestion[]`, default limit 6. Candidate generation consumes `commandRegistry`, `projects` and `workItems`; it never invokes `execute`.

- [ ] **Tester RED:** Pin the six focused-empty defaults; prefix before fuzzy ranking; stable ties; deduplication and maximum count; `triv`, `task`, `catalog`, `carrer`; contextual `project ` and `work `; whitespace/case normalization; no-match queries; shell-like input returning no candidates. Assert every canonical project/Work command is discoverable and parsable to its correct selection action.
- [ ] **Tester RED:** Keep the existing unselected typo behaviour and shell-input rejection tests. Test suggestions alone do not navigate, download, clear output or execute anything.
- [ ] **Verify RED:** `npm test -- tests/unit/commandSuggestions.test.ts tests/unit/parseCommand.test.ts`; expect missing matcher/metadata failures.
- [ ] **Developer:** Implement the ranking and contextual filtering in the design brief using small pure functions. Add registry descriptions and derive detail candidate labels from data. Use local string matching; do not install a search library or change parser execution to accept approximate commands.
- [ ] **Tester GREEN:** Rerun both unit files; inspect candidate examples and ensure root command/help/error metadata has no stale two-project restriction.
- [ ] **Checkpoint:** Review the pure matcher separately from UI behaviour and commit Task 4.

### Task 5: Expose accessible command suggestions in the Micro terminal

**Files:** `src/apps/command/MicroTerminal.tsx`, `MicroTerminal.module.css`; `tests/component/MicroTerminal.test.tsx`, `PortfolioShell.test.tsx`, relevant command-input locators in `tests/e2e/contact-command.spec.ts`, `window-system.spec.ts`, `responsive.spec.ts`; `docs/PRD.md`, `docs/DESIGN.md`.

**Interfaces:** Consume Task 4's matcher. Keep input text, open/dismissed state and active suggestion local to the terminal. Feed accepted canonical strings back into the existing input; only the form submit calls `parseCommand` and dispatches its result. The input's semantic role becomes `combobox`, retaining accessible name **Portfolio command**; update affected test locators accordingly.

- [ ] **Tester RED:** Focus opens the six defaults; typing filters; active descendant follows explicit arrow navigation; Enter accepts without submission, then Enter executes; mouse selection fills/refocuses; Tab leaves naturally; Escape preserves text and closes; no-match message appears; blur closes; edited queries reset active selection. Enter with no explicit selection preserves the parser's raw-input behaviour, including `carear` correction and inert script text.
- [ ] **Tester RED:** Cover `isComposing` so IME Enter does not submit or accept; selected options disappearing after edits; route exit/re-entry clearing stale state; latest-only status and `clear` behaviour; unchanged obsolete `#command` autofocus recovery. Verify focused-empty input causes no navigation.
- [ ] **Verify RED:** Run the MicroTerminal and PortfolioShell component files before implementation. Keep Tester-owned assertions independent of production code.
- [ ] **Developer:** Implement the described combobox/listbox semantics and event ordering, including preventing option pointer-down from losing selection to blur. Prevent the Enter default action when accepting an option. Use stable IDs, visible selected/focus styles and a bounded scrollable popup. Keep list content readable above the bottom-edge field; retain natural touch-sized options and route-only terminal visibility. Add the brief keyboard hint and update product docs.
- [ ] **Tester GREEN:** Run component tests and existing command/terminal browser tests. Manually check mouse, keyboard, screen-reader names, 200% zoom, 1024×768 and 1440×1000 layouts, 390×844 Desktop and off-Desktop mobile routes, reduced motion, outside clicks and foreground-window layering. Ensure screenshot baselines are updated only for deliberate reviewed changes.
- [ ] **Checkpoint:** Review and commit Task 5 after the command discoverability flow works without a memorized command.

### Task 6: Verify and accept the combined portfolio update

**Files:** Tester-owned coverage/browser tests and `docs/testing/2026-10-20-projects-and-command-suggestions.md`; update this plan's task/status checkboxes only after corresponding acceptance.

**Interfaces:** No new production interface. Consume Tasks 1–5 and exercise their complete recruiter/explorer journeys.

- [ ] **Developer handoff:** Record the exact code revision and intentional diff, then run `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run check:bundle`, and `git diff --check`. Resolve all new failures without weakening gates.
- [ ] **Tester verification:** Run `npm run test:coverage`, `CI=1 PLAYWRIGHT_PORT=4231 npm run test:e2e`, and `CI=1 PLAYWRIGHT_PORT=4231 npm run test:e2e:a11y` against the final production build. Record actual passes/skips/failures, browser/Node versions, four coverage percentages and bundle sizes at one exact revision.
- [ ] **Manual project journey:** Open Projects through the dock; inspect both new entries; open each by click and keyboard; reload direct links; navigate Back/Forward; verify title-in-viewport, image/video failures and useful media at 1440×1000, 1024×768, 390×844 and 320×568. Check that Taskmon remains a mini-project presentation and that no mockup is presented as an app screenshot.
- [ ] **Manual command journey:** Focus blank input → see examples → type `triv` → choose the result → inspect filled command → submit → arrive at TRIVIALISE! detail. Repeat for Taskmon and the SKAO catalogue. Verify typo/no-match recovery, natural Tab/Escape, keyboard selection visibility, composition input and popup fit at 200% zoom.
- [ ] **Regression/visual review:** Recheck Work/UV-Ruff, Career, Contact/CV, Pokeleximon/Safelog, window maximize/minimize/reset, mobile single-active-app behaviour and all visible navigation without commands. Inspect any changed visual baseline before approving it; never bulk-update snapshots to clear failures.
- [ ] **Product Owner acceptance:** Compare the final UI and exact-head Tester evidence with this brief. Mark accepted only with no unresolved defect; otherwise record the specific failed criterion and return a bounded fix. Link the local preview and preserve unrelated working-tree changes. No deployment or push is part of this plan.

## Planning review

- The two requested project entries, screenshot/trailer selection, Taskmon mini-project treatment, source verification and new direct routes are covered by Tasks 1–3.
- Discovery before typing, fuzzy ranking, canonical project/Work candidates, descriptions, no-match state, keyboard/mouse/IME behaviour and parser separation are covered by Tasks 4–5.
- Each Review Focus condition has explicit automated or manual evidence in its owning task; combined regression and exact-head acceptance belong to Task 6.
- The original Work changes remain outside this implementation's commit scope. No product code, assets, dependencies or test implementation has been changed by creating this plan.
