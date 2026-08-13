# PORT-014 — Polish shell identity, utilities, viewport, and shared chrome

Status: READY — 2026-08-13

Requirement links: `docs/superpowers/specs/2026-08-13-portfolio-os-polish-design.md` §§2–4, 6, 10–12; `docs/AGENTS.md` §§2–6, 8–9; approved implementation brief Task 1 / PORT-014.

User outcome: A recruiter sees a quieter, more distinctive Portfolio OS shell with a recognizable Kernel identity, grouped utility actions, more usable desktop space, and consistent window chrome—without losing a direct, keyboard-accessible path to every important application.

## Exact scope

- Create `src/shell/BrandMark.tsx` exporting `BrandMark({ className?: string, decorative?: boolean }): JSX.Element`; use the approved 64×64 Kernel monogram geometry verbatim:

  ```tsx
  <rect x="3" y="3" width="58" height="58" rx="5" fill="#132218" />
  <path d="M16 15v34h20c9 0 14-4 14-10 0-5-3-8-8-9 4-2 6-5 6-8 0-5-4-7-12-7H16Zm9 8h10c3 0 4 1 4 3s-1 3-4 3H25v-6Zm0 13h12c3 0 5 1 5 3s-2 3-5 3H25v-6Z" fill="#d9f7c5" />
  <rect x="47" y="47" width="9" height="9" fill="#ff6542" />
  ```

  The SVG uses `viewBox="0 0 64 64"`, `data-testid="portfolio-os-mark"`, and is decorative by default. When non-decorative, it exposes `role="img"` and the title `Portfolio OS`.
- Mirror that exact mark geometry and the Ink `#132218`, pale-green `#d9f7c5`, and signal-orange `#ff6542` palette in `public/favicon.svg`.
- Create `src/shell/UtilityIcon.tsx` exporting `UtilityIcon({ kind: 'github' | 'linkedin' | 'cv' }): JSX.Element`; use local inline SVG paths, with `aria-hidden="true"` and `focusable="false"`. Do not add an icon package.
- Update `MenuBar.tsx` and `MenuBar.module.css` to retain the skip link, semantic desktop `h1`, Ben Hutchinson, decorative BrandMark, and `Manchester, UK`; remove top navigation, route-selection helpers, `Mid-level platform engineer`, and `Open to platform and backend engineering opportunities`.
- Update `Dock.tsx` and `Dock.module.css` so GitHub, LinkedIn, and Download CV form one right-side icon-and-label utility group. Preserve their accessible names, existing external-link security attributes, CV download attribute/value `ben-hutchinson-cv.pdf`, ordinary application labels, and `data-dock-app-id` controls. Remove CV from the main application-button group and its obsolete application styling.
- Update `PortfolioShell.module.css` so the page padding is `clamp(var(--space-2), 1.5vw, var(--space-4))`; the frame is `width: min(100%, 98rem)` with `min-height: calc(100vh - 2 * clamp(var(--space-2), 1.5vw, var(--space-4)))`. Preserve safe responsive spacing and keep the frame/dock off browser edges.
- Update `Desktop.tsx` and `Desktop.module.css` to remove the `BUILD CLEAR PATHS` `backgroundStatement` markup and all supporting overlay styling while retaining the flagship Work focal point.
- Update only `WindowFrame.module.css` shared chrome styling to draw the titlebar lower rule at titlebar level: no `border-bottom`; use `box-shadow: inset 0 calc(-1 * var(--border-heavy)) 0 var(--color-ink)`. The rule must continue under the close, minimize, and maximize controls while controls remain above it with 44-pixel hit areas.
- Tester-owned files for this packet are `tests/unit/foundation.test.tsx`, `tests/unit/release-audit.test.ts`, `tests/e2e/responsive.spec.ts`, `tests/e2e/window-system.spec.ts`, and `tests/e2e/accessibility.spec.ts`.

## Dependencies and sequence

1. This Product Owner packet is the sole ready implementation task in this polish pass.
2. Tester first adds focused RED acceptance coverage and records the expected failures:

   ```bash
   npm test -- tests/unit/foundation.test.tsx tests/unit/release-audit.test.ts
   CI=1 PLAYWRIGHT_PORT=4221 npx playwright test tests/e2e/responsive.spec.ts tests/e2e/window-system.spec.ts tests/e2e/accessibility.spec.ts --project=Chromium
   ```

3. Developer then implements only the production scope above, runs typecheck, lint, the focused unit checks, build, and bundle check, and hands off to Tester.
4. Tester completes GREEN automation, accessibility, responsive, keyboard, direct-hash, 200%-zoom, and manual geometry evidence before Product Owner review.

## Excluded scope

- Command behavior, permanent Micro terminal presentation, Command dock removal, and `#command` recovery behavior.
- Work and Career content or interaction changes, including canonical migration copy, technology-pill removal, ownership wording, and stable Career rail behavior.
- Project layout/content/link changes, including Pokeleximon actions and media layout.
- Changes to hash-navigation behavior, browser history, route headings, keyboard semantics, WindowFrame pointer/control APIs, motion behavior, deployment configuration, dependencies, or the established palette/design direction beyond this shell refinement.

## Acceptance criteria

- [ ] There is no top navigation with accessible name `Primary navigation`; the Desktop, Work, Career, and Projects menu controls are absent.
- [ ] `Mid-level platform engineer` and `Open to platform and backend engineering opportunities` do not render in the menu bar.
- [ ] The menu bar visibly retains the Kernel mark, `Ben Hutchinson`, `Manchester, UK`, skip-link behavior, and the correct semantic desktop `h1`.
- [ ] The visible mark has `data-testid="portfolio-os-mark"`; its favicon is the same approved Kernel geometry using `#132218`, `#d9f7c5`, and `#ff6542`.
- [ ] GitHub, LinkedIn, and Download CV appear as one icon-and-label dock utility group. Each visible link retains its readable accessible name, contains a decorative inline SVG, and preserves its existing external-link security behavior; Download CV has `download="ben-hutchinson-cv.pdf"`.
- [ ] Application dock controls retain `data-dock-app-id` and visible text labels; CV is not presented as an ordinary application button.
- [ ] `BUILD CLEAR PATHS` and the decorative wallpaper overlay are absent, with the flagship Work window still the desktop focal point.
- [ ] At desktop sizes, the framed shell has a visibly reduced but positive left outer gutter and a larger usable frame. At 320 CSS pixels, the page has no horizontal overflow and the frame/dock retain safe edge spacing.
- [ ] Every shared framed application titlebar renders one uninterrupted Ink lower rule beneath its drag/title region and beneath close, minimize, and maximize controls. Controls remain operable with 44-pixel hit areas, pointer/control APIs are unchanged, and visible focus remains intact.
- [ ] Direct hashes, route headings, browser-history behavior, keyboard navigation, mobile single-application behavior, reduced-motion behavior, accessibility gates, GitHub Pages static build support, and existing important no-drag/no-command paths remain unchanged.
- [ ] No icon, routing, state-management, server, or other dependency is added.

## Evidence contract

### Tester RED evidence (required before production implementation)

- Record the exact command output for the two focused commands in Dependencies and sequence. Failures must be limited to the still-present navigation/copy/overlay, old favicon, ungrouped CV utility, old gutter geometry, or interrupted titlebar rule; existing unrelated assertions remain green.
- Add unit assertions for absent primary navigation/role/availability/wallpaper statement; present Kernel mark/location; inline SVG in GitHub and LinkedIn links; and CV download behavior.
- Extend the release audit to parse `public/favicon.svg` and assert the three approved colors and geometry.
- Add browser assertions for a positive but smaller accepted left gutter, no 320-pixel horizontal overflow, and a titlebar lower edge spanning beneath the maximize control.

### Developer handoff evidence

- At the implementation commit, record exit-0 output for:

  ```bash
  npm run typecheck
  npm run lint
  npm test -- tests/unit/foundation.test.tsx tests/unit/release-audit.test.ts
  npm run build
  npm run check:bundle
  ```

- State the commit hash, changed production files, and any known limitation. Do not modify Tester-owned tests.

### Tester GREEN and manual evidence

- Re-run the focused unit and Chromium commands above, then typecheck, lint, build, bundle, and coverage; record exact commit, outputs, environment, and browser version. Coverage remains at the repository's 91% thresholds.
- Manually record viewport, input method, observed result, and screenshot/measurement evidence for 1440×1000, 1280×800, 390×844, 320×568, keyboard-only operation, 200% zoom, reduced motion, and every direct hash. Confirm the mark/favicon under `/ben-portfolio/`, utility-link attributes, heading order, direct hashes/history, mobile behavior, gutter/no-overflow geometry, titlebar continuity, and focus visibility.
- Log each defect with severity, reproduction, expected behavior, actual behavior, affected acceptance criterion, owner, and retest result in the Tester report.

Product Owner decision: PENDING — await Tester GREEN evidence and Product Owner comparison against this packet.
