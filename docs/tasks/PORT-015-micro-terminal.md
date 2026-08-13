# PORT-015 — Replace the Command window with a permanent Micro terminal

Status: READY — 2026-08-13

Requirement links: `docs/superpowers/specs/2026-08-13-portfolio-os-polish-design.md` §§2, 5, 10–12; `docs/AGENTS.md` §§2–6, 8–12, 16, 18–20; approved implementation brief Task 2 / PORT-015.

User outcome: A recruiter can optionally enter a safe portfolio command in a compact, persistent terminal while viewing the Desktop, without losing ordinary visible navigation to any important portfolio content.

## Exact scope

- Create `src/apps/command/MicroTerminal.tsx` and `src/apps/command/MicroTerminal.module.css`. `MicroTerminal(): JSX.Element` consumes the unchanged `parseCommand(rawInput: string): CommandResult` allow-listed parser and uses ordinary form submission: Enter runs the command, clears the input, and dispatches only parser-produced shell actions. Arbitrary input is always inert text; it is never evaluated as code or shell syntax.
- Mount one Micro terminal from `Desktop`. Its root must expose both `data-micro-terminal` (an empty or `true` value is acceptable) and `data-testid="micro-terminal"`. It must have `aria-label="Portfolio command terminal"`, a programmatic input label `Portfolio command`, input id `portfolio-command`, and a submit control named `Run command`.
- Present a narrow desktop terminal above and clear of the dock at the bottom-right of the desktop work area. It has the `portfolio command` title strip, restrained terminal chrome, one `>_` prompt row, input, and Enter affordance. It is shell-layered above the desktop but below focused or maximized application content; focus may strengthen its contrast but it must not continuously animate.
- Present it at mobile/coarse-pointer breakpoints as compact, normal, full-width flow at the end of the Desktop view, above the dock. It renders only when the route is Desktop; it must not overlay, appear within, or obscure Work, Career, Projects, or Contact content.
- Keep exactly one latest non-`clear` parser result in a concise bounded `role="status"` / polite live region. `clear` removes that result. Do not render command history, introductory copy, suggestions, explanatory copy, a large Run button, or an expanding desktop layout. Preserve the parser's useful invalid-command feedback.
- Retain the existing `cv` command download, linking through `import.meta.env.BASE_URL` to `cv/ben-hutchinson-cv.pdf` with `download="ben-hutchinson-cv.pdf"`.
- Remove the ordinary Command application completely: delete `CommandApp.tsx` and `CommandApp.module.css`; remove `command` from `AppId`, all window state/order/default positions/titles/sizes/content, window layer, dock application entries, reducer cases, and associated framed-window behavior. The remaining `AppId` union is exactly `'about' | 'work' | 'career' | 'projects' | 'contact'`.
- Preserve known-route parsing. Do not add a `command` hash route. An initial or navigated `#command` remains an unknown hash that normalizes to `#desktop`; after recovery the Desktop-mounted terminal exists and `#portfolio-command` can receive focus. Preserve direct known hashes, browser history, route headings, and regular visible navigation.
- Update only the packet-listed tests owned by Tester: `tests/unit/portfolioReducer.test.ts`, `tests/unit/content.test.ts`, `tests/unit/foundation.test.tsx`, `tests/e2e/contact-command.spec.ts`, `tests/e2e/window-system.spec.ts`, and `tests/e2e/responsive.spec.ts`. Keep parser/registry behavior unchanged except compact-surface copy where required.

## Dependencies and sequence

1. PORT-014 is accepted. This packet is the sole READY Product Owner implementation task in the polish pass.
2. Tester first replaces obsolete Command-window assumptions with focused RED Micro-terminal acceptance coverage and records the expected failures:

   ```bash
   npm test -- tests/unit/portfolioReducer.test.ts tests/unit/content.test.ts tests/unit/foundation.test.tsx tests/unit/parseCommand.test.ts
   CI=1 PLAYWRIGHT_PORT=4222 npx playwright test tests/e2e/contact-command.spec.ts tests/e2e/window-system.spec.ts tests/e2e/responsive.spec.ts --project=Chromium
   ```

   The missing terminal and obsolete Command-window assumptions should be RED; parser tests must remain green.
3. Developer implements only this packet, runs typecheck, lint, focused unit checks, build, and bundle check, then records its production handoff without changing Tester-owned acceptance coverage.
4. Tester completes GREEN automation, coverage, accessibility, responsive, keyboard, direct-hash, invalid-command, and manual verification. Product Owner then compares current evidence to every criterion before acceptance.

## Excluded scope

- Shell identity/utilities, menu simplification, viewport enlargement, wallpaper removal, and shared WindowFrame lower-rule work covered by PORT-014.
- Work copy/pill removal, Career rail and motion work, and Pokeleximon link/media corrections.
- New command vocabulary, parser evaluation capabilities, command history/persistence, a command hash route, a routing library, new dependencies, analytics/runtime APIs, server work, or changes to the established palette and Portfolio OS direction.
- Any behavior that makes typing commands necessary for recruiter-critical navigation or content.

## Acceptance criteria

- [ ] Desktop shows exactly one small, permanent bottom-right Micro terminal above the dock, visually subordinate to application content; it is neither draggable nor framed-window chrome and has no minimize, maximize, or close controls.
- [ ] Its root has both `data-micro-terminal` and `data-testid="micro-terminal"`; it contains visible `portfolio command`, a visible and programmatically named `Portfolio command` textbox with id `portfolio-command`, a `>_` prompt, and a submit control named `Run command`.
- [ ] There is no Command dock button, `data-window-id="command"`, `CommandApp`, visible `Optional shortcut`, visible `Command palette`, explanation/suggestions, or command history.
- [ ] Enter submits via the unchanged allow-listed parser. Only the latest result is visible in a bounded polite `role="status"`; `clear` removes it, invalid input (including `<script>alert(1)</script>`) stays inert and gives useful parser feedback, and valid navigation commands retain their existing shell dispatch behavior.
- [ ] The `cv` command retains a download link to the base-path-safe PDF with `download="ben-hutchinson-cv.pdf"`.
- [ ] `command` is absent from `AppId`, default/open/order state, window positioning, window content/titles/sizes, reducer cases, WindowLayer, and Dock. No framed Command app remains.
- [ ] At 390×844 and 320×568, the compact terminal exists on `#desktop`, has no horizontal overflow, and is absent on `#career`, `#work`, `#projects`, and `#contact`; it appears in ordinary Desktop flow above the dock.
- [ ] Visiting `#command` does not declare or open a Command route: it safely normalizes to `#desktop`, where the terminal input is present and can receive focus. Known direct hashes, browser history, headings, keyboard operation, reduced-motion behavior, and visible navigation remain functional.
- [ ] No critical destination or content depends on typing a command, dragging, hover, animation, or color.
- [ ] No dependency is added and the static GitHub Pages base path remains supported.

## Evidence contract

### Tester RED evidence (required before production implementation)

- Record exact output, tested commit, and environment for the two dependency commands. The only expected new failures concern the missing Micro terminal or obsolete Command-window assumptions; parser coverage stays green.
- Add component assertions that locate `getByTestId('micro-terminal')`, confirm `portfolio command`, the named textbox, both root data hooks, and the absence of Command dock/explanatory UI.
- Add browser assertions that submit `carear` and observe `Did you mean “career”?`; submit `<script>alert(1)</script>` and observe inert feedback with no dialog/script execution; submit `career` and observe `#career`; and verify the required mobile/Desktop-only and `#command` normalization/focus behavior.

### Developer handoff evidence

- Record exit-0 output and implementation commit for:

  ```bash
  npm run typecheck
  npm run lint
  npm test -- tests/unit/portfolioReducer.test.ts tests/unit/content.test.ts tests/unit/foundation.test.tsx tests/unit/parseCommand.test.ts
  npm run build
  npm run check:bundle
  ```

- Record the changed production files, proof that `rg "CommandApp|appId: 'command'|data-window-id=\"command\"" src tests` accounted for all old production references before deletion, and any known limitation. Do not modify Tester-owned tests.

### Tester GREEN and manual evidence

- Re-run the focused unit and Chromium commands, then record current typecheck, lint, build, bundle, coverage, and relevant axe results for the tested commit. Coverage remains at the configured 91% thresholds.
- Record viewport, input method, result, and screenshot/measurement evidence for 1440×1000, 1280×800, 390×844, 320×568, keyboard-only operation, reduced motion, `#command`, every direct known hash/history, `clear`, `reset`, `cv`, invalid characters/script-like input, and visible navigation without commands.
- Log every defect with severity, reproduction, expected behavior, actual behavior, affected criterion, owner, and retest result.

Defects: None recorded; implementation has not started.

Product Owner decision: **PENDING — READY for Tester RED coverage.**
