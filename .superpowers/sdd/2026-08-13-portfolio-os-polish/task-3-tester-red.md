# PORT-016 Tester RED evidence

Date: 2026-08-18

Role: Tester RED only. No production, configuration, or Product Owner packet files changed.

## Environment

- Branch: `terminal-redesign`
- Baseline commit: `764acde` (`docs: define PORT-016 Work and Career polish`)
- Node: `v26.7.0`
- npm: `11.19.0`
- Playwright: `1.62.1`
- Browser command: Chromium only, local Vite preview on fresh port `4223`

The sandbox initially rejected the required local preview bind with `listen EPERM: operation not permitted 127.0.0.1:4223`. The same prescribed command was then rerun with approved local-bind permission; the final result below is from that fresh preview server.

## Added acceptance coverage

- `tests/unit/content.test.ts`
  - Exact `flagshipWork.result`, first-person `ownership`, and base-Makefile `technicalApproach` literals.
  - No `flagshipWork.technologies` property while `Project.tags` remains populated and independent.
- `tests/unit/foundation.test.tsx`
  - Work case study exposes neither a technology list nor the `Python`, `uv`, or `ruff` technology text.
- `tests/e2e/work.spec.ts`
  - Direct Work route exposes all three canonical strings and no technology list or named technology text.
- `tests/e2e/career.spec.ts`
  - Every direct stage selection waits for its `aria-pressed` selected state before checking motion or measuring geometry.
  - Normal motion requires `data-motion-offset-px="0"` and a 200ms opacity duration; reduced motion requires the same zero offset and a zero duration.
  - The current controls container (the labelled native range's parent rail) is measured after graduate, observability, associate, and SKAO selection at 1440×1000, 1280×800, 390×844, and 200% zoom. Every y value must be within one CSS pixel of the first value.
  - Every selection also requires a visible active-stage heading, non-empty and horizontally readable stage bounds, and no document-level horizontal overflow.
  - Corrected the stale pre-existing Desktop-link lookup to the current `data-dock-app-id="career"` control, preserving the existing direct `#desktop` / `#career` and browser-history contract. This avoids an unrelated failure caused by the accepted PORT-014 navigation model.

`tests/e2e/accessibility.spec.ts` remains unchanged; its existing Chromium axe, landmark, labelled-range, keyboard, focus, and invalid-hash coverage remains in the focused command.

## Focused unit RED run

Command:

```bash
npm test -- tests/unit/content.test.ts tests/unit/foundation.test.tsx
```

Result: exit 1 — `17 passed`, `2 failed`, `19 total` in `1.79s`.

Intended failures only:

1. `flagshipWork.result` is still `Migrated 50+ repositories and reduced average build time by four minutes.` rather than the approved `uv and ruff` result.
2. The Work case study still renders `<ul aria-label="Technologies">` containing `Python`, `uv`, `ruff`, and `Makefile`.

All prior focused-unit assertions outside those two contracts passed.

## Focused Chromium RED run

Command:

```bash
CI=1 PLAYWRIGHT_PORT=4223 npx playwright test tests/e2e/work.spec.ts tests/e2e/career.spec.ts tests/e2e/accessibility.spec.ts --project=Chromium
```

Final result: exit 1 — `7 passed`, `4 skipped`, `4 failed`, `15 total` in `16.2s`.

Intended failures only:

1. Work direct route does not expose the approved exact result (it still renders the old sentence; the subsequent first-person and no-pill assertions are deliberately gated behind that first observable failure).
2. Reduced-motion Career stage has no `data-motion-offset-px="0"` metadata. Existing reduced-motion metadata is `data-reduced-motion="true"` and `data-motion-duration-ms="0"`.
3. Normal-motion Career stages have no `data-motion-offset-px="0"` metadata. Existing normal metadata is `data-reduced-motion="false"` and `data-motion-duration-ms="200"`.
4. The control rail moves by `18.421875` CSS pixels at 1440×1000, exceeding the one-pixel contract. This is a real current-layout geometry failure; the test will continue through the remaining required viewport and zoom scenarios after the first scenario passes.

No failures were reported from existing PORT-014/PORT-015 shell, Micro-terminal, accessibility, direct-hash/history, range, direct-stage, visible-focus, reset-layout, or 200%-zoom regression coverage. The four skips are intentional project guards for mobile-specific tests in this Chromium-only command.

## Stability and scope notes

- No timing sleeps were added. Selection state is awaited through the selected direct-stage button before reading the stage metadata or rail bounding box.
- The first geometry measurement is intentionally deferred until the selected heading is visible and the stage is scrolled into view.
- `git diff --check` passed with no output.
- Pre-existing `.DS_Store` and untracked `.playwright-cli/` remain untouched and must not be staged.

## Developer handoff

To turn this suite GREEN, update only the approved PORT-016 production scope: canonical Work data and rendered Work technology presentation; then stable Career content/control rows plus zero-offset opacity-only metadata. Do not weaken the one-CSS-pixel rail tolerance, the four viewport/zoom scenarios, or reduced-motion equivalence.
