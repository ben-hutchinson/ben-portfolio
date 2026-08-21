# PORT-018 Tester RED report

## Checkpoint

- Tester baseline: `c9f4af703e04725a20e81b63f7516dfdc61a3dcb`
- Branch: `terminal-redesign`
- Node: `v26.7.0` (note: the product lock is Node 24 LTS; see concern below)
- Playwright: `1.62.1`, Chromium project
- Protected worktree entries observed but untouched: `M .DS_Store`, `?? .playwright-cli/`

## Acceptance coverage added

- `tests/unit/content.test.ts`: single typed Work collection contract, derived flagship/ID behaviour, exact data-backed outcome and no Work technologies.
- `tests/unit/hashState.test.ts`: exact Work catalogue/detail parsing and serialization, including malformed/unknown Work hash recovery.
- `tests/unit/portfolioReducer.test.ts`: Work-detail routing, selection, reset/catalogue clearing, and unknown selection safety.
- `tests/unit/parseCommand.test.ts`: `work <id>` selection plus safe unknown-ID recovery.
- `tests/component/WorkApp.test.tsx`: catalogue featured entry, named keyboard activation, detail outcome, and Back control.
- `tests/component/Desktop.test.tsx`: Featured Work opens the direct hash.
- `tests/component/WindowLayer.test.tsx`: direct-detail content and close-to-Desktop recovery.
- `tests/e2e/work.spec.ts`: direct catalogue/detail/reload, keyboard, click/back/history, desktop/mobile overflow, and mobile route switch.
- `tests/e2e/accessibility.spec.ts`: axe coverage for both Work hashes at 1440×1000 and 390×844.

## Intentional RED results

### Focused unit/component command

```text
npm test -- tests/unit/content.test.ts tests/unit/hashState.test.ts tests/unit/portfolioReducer.test.ts tests/unit/parseCommand.test.ts tests/component/WorkApp.test.tsx tests/component/Desktop.test.tsx tests/component/WindowLayer.test.tsx

Test Files  7 failed (7)
Tests  12 failed | 96 passed (108)
Exit 1
```

All 12 failures are deliberate evidence that the old implementation remains a singleton, single-route Work application:

1. `workItems`/derived IDs are absent (one content failure).
2. `#work/uv-ruff-migration` recovers to Desktop instead of parsing/serializing as a Work detail (one hash failure).
3. `work <id>` is ignored as an argument and unknown Work values navigate to the catalogue instead of returning an allow-listed message (two command failures).
4. `activeWorkId`, the `workDetail` route, and `SELECT_WORK` are absent; this produces the expected Work-state failures, including the dependent state-transition test (five reducer failures).
5. The current `#work` page has no featured catalogue marker/named open action; Featured Work still targets `#work`; direct detail still resolves to the desktop/compact feature surface (three component failures).

No pre-existing assertion failed outside those missing PORT-018 interfaces and behaviours.

### Focused Chromium command

```text
CI=1 PLAYWRIGHT_PORT=4231 npx playwright test tests/e2e/work.spec.ts tests/e2e/accessibility.spec.ts --project=Chromium

Running 7 tests using 2 workers
2 failed, 5 passed
Exit 1
```

The two failures are intentional:

1. Direct `#work/uv-ruff-migration` is normalised to `#desktop`, proving the detail hash is not registered yet.
2. Axe reports `scrollable-region-focusable` (serious) for the current Work window content. The catalogue's required named action will provide keyboard-reachable content; the Developer must verify the final catalogue/detail structure resolves this gate rather than suppressing axe.

The five existing scoped browser checks passed. The initial sandboxed run could not bind the preview server (`EPERM` on `127.0.0.1:4231`); the recorded result above is the exact rerun with local-port permission and exercised the intended browser suite.

## Manual-test charter for GREEN

At the Developer implementation head, verify and record:

1. At 1440×1000, 1024×768, 390×844, and 320×568: direct `#work` and `#work/uv-ruff-migration`, reload, context/title/result, all detail sections, readable text, and no horizontal overflow.
2. Keyboard only: Tab-visible focus, Enter/Space on `Open Python Dependency Migration case study`, `Back to work`, and dock/menu Work recovery.
3. Browser Back/Forward from catalogue ↔ detail and unknown Work hash recovery to Desktop.
4. Mobile: one visible active application while switching Work to Career and back; no dragging/terminal required.
5. Reduced-motion-equivalent Work content/navigation, `/ben-portfolio/` production-base-path loading, a Project direct hash, and Micro terminal Desktop-only presence.
6. Axe Work catalogue/detail at desktop and mobile, plus full configured coverage/build/bundle/E2E gates.

## Concerns / Developer handoff

- The local process is Node 26.7.0, not the locked Node 24 LTS. Re-run release gates under the repository's Node 24 toolchain if available before Product Owner acceptance.
- Do not weaken the new axe assertion. The expected green implementation needs an actual keyboard-operable catalogue action and a valid detail reading surface.
- Do not touch `.DS_Store` or `.playwright-cli/`.
