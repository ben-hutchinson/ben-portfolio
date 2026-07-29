# Command Centre motion and accessibility review

Audit date: 29 July 2026

Scope: `/ben-portfolio/` from initial load through the primary navigation, every main section, both project briefing sheets, the mobile command index, Signal Sprint, and the footer. This is a production-readiness review only; no production, QA, configuration, or asset file was changed.

## Environment and method

- Browser-plugin rendered inspection: Google Chrome selected by the Browser runtime, `http://127.0.0.1:4173/ben-portfolio/`, desktop `1440×1000` and mobile `390×844`, `prefers-reduced-motion: no-preference`. Page title was `Ben Hutchinson | Portfolio`; the DOM snapshot contained the full recruiter page, there was no framework error overlay, and the browser console had no warning or error entries.
- Keyboard evidence: 28 consecutive `Tab` steps at `1440×1000` traversed the identity link, all five primary-navigation destinations, hero actions, mission links and briefing triggers, all topology filters and information controls, Signal Sprint, then GitHub, LinkedIn, and Download CV in the footer before returning to the document. Responsive controls mounted inside a `display:none` ancestor were skipped rather than receiving focus.
- Dialog evidence: Chrome restored focus to `Open Pokeleximon Daily engineering briefing` after Escape. The focused WebKit Playwright run reproduced the cross-browser failure: the sheet closed, but the opener remained inactive until the 5 s assertion timed out. Mobile inspection covered the command-index sheet and the Signal Sprint dialog.
- Motion evidence: installed Chromium at `390×844` was run with both media preferences. At 250 ms after launch, `no-preference` was still `Score 0` with no obstacle, while `reduce` was already `Score 2` with one obstacle. At 700 ms, `no-preference` was `Score 2` and `reduce` was `Score 11`. CSS ambient animation names were absent under `reduce`, but the JavaScript runner continued.
- Contrast evidence: computed tokens and rendered surfaces were sampled. Signal white on deep violet is 8.28:1, muted on void is 7.75:1, muted on command navy is 6.70:1, silver on void is 11.35:1, and status green on void is 14.38:1. Orbit lilac on void is only 3.86:1; the translucent training panel reduces it to approximately 3.55:1.
- Automated support: `npm run test:e2e:a11y` exercised Chromium, Firefox, and WebKit main-page, sheet, dialog, topology, and focus cases. The isolated WebKit Escape case failed exactly at `expect(trigger).toBeFocused()`; the equivalent Chrome Browser interaction passed. Axe reported no serious or critical issues other than the separately measured contrast usage below.

Severity meaning: **High** blocks release for a keyboard or motion-preference path; **Medium** is an AA or practical operability defect that should be corrected before release; **Low** is a bounded usability, semantic, or integration cleanup.

## Semantics and keyboard order

Landmarks and heading order: No findings. The page exposes one banner, one main landmark, one contentinfo landmark, labelled primary/contact navigation, one `h1`, and section `h2` headings with card/detail headings nested below them.

Hidden focusable controls: No findings. Desktop and mobile alternatives remain mounted, but the inactive branch is removed from sequential keyboard navigation by its hidden ancestor.

| Severity | Owner | File:line | Finding | Required correction | Verification |
| --- | --- | --- | --- | --- | --- |
| High | Mission logs / UI systems | `src/features/mission-logs/ProjectBriefingSheet.tsx:27` | In WebKit, Escape closes a project briefing sheet but focus is lost instead of returning to the button that opened it. Chromium and Firefox restore focus, so this is a cross-browser keyboard regression rather than a universal primitive failure. | Keep a ref to the opening mission-card button and pass that element as the sheet's final-focus target (or use the primitive's trigger relationship) instead of the boolean `finalFocus` value. Apply the same ownership pattern to both project cards. | Run `npm run test:e2e:a11y`; specifically, the Escape restoration case must pass in Chromium, Firefox, and WebKit and `document.activeElement` must be the corresponding opener after close. |
| Low | Command footer | `src/features/command-footer/CommandFooter.tsx:36` | The accessible name says `Download CV`, but the link has no `download` attribute and navigates in the current tab. It also always renders an external-link arrow even though this asset is internal, so the visible action cue and behavior disagree. | Add the intended `download` behavior and render the arrow only for external destinations, or rename/restyle the action to describe an in-tab PDF view. | Inspect the footer accessibility tree and activate the link: its announced name, icon, and resulting download/navigation behavior must agree. |

## Motion

Content reveal delay, below-fold ambient motion, and layout shift outside the opt-in training dialog: No findings. Hero orbiting is paused when the hero leaves view, section reveals do not remove content from the DOM, and CSS reduced-motion overrides suppress transitions and ambient keyframes.

| Severity | Owner | File:line | Finding | Required correction | Verification |
| --- | --- | --- | --- | --- | --- |
| High | Training simulation | `src/features/mission-runner/MissionRunner.tsx:187` | Signal Sprint ignores `prefers-reduced-motion: reduce` for its core JavaScript motion. Reduced mode auto-starts after 120 ms—earlier than the 560 ms default—and continues moving the player/obstacles with `requestAnimationFrame`; at 250 ms it had already reached Score 2 while the default mode remained at Score 0. CSS scenery keyframes stop, but the motion that matters survives. | In reduced mode, keep the simulation in a stationary ready state until an explicit user action and provide a reduced-motion play model (for example, discrete/step-based obstacle changes without automatic parallax). Do not make the reduced path start sooner than the default path. | In Playwright contexts with `reducedMotion: 'reduce'` and `'no-preference'`, open the dialog without further input and sample score, transforms, and obstacle positions for at least 1 s. Reduce must remain stationary; no-preference may begin after its disclosed countdown. |

## Contrast

Body copy, muted metadata, silver copy, navigation, sheets, dialog surfaces, topology selected-state text, focus indicators, and game status green: No findings beyond the orbit-lilac usage below.

| Severity | Owner | File:line | Finding | Required correction | Verification |
| --- | --- | --- | --- | --- | --- |
| Medium | UI systems / Crew / Training | `src/features/crew/CrewSection.module.css:20`; `src/features/training/TrainingModule.module.css:23` | Small 600-weight metadata (`Command crew / 03`, `Optional training / Signal Sprint`, and `Simulation ready`) uses orbit lilac `#7965c1`. It measures 3.86:1 on `#07142f` and about 3.55:1 on the translucent navy panel, below the 4.5:1 AA requirement for 10.56–10.88 px text. | Use a lighter lilac-derived text token that reaches at least 4.5:1 on the darkest and translucent surfaces, while retaining the existing lilac for non-text decoration if desired. | Measure all three rendered labels at desktop and mobile with a contrast checker or Axe; each text/background pair must be at least 4.5:1. |

## Touch targets

| Severity | Owner | File:line | Finding | Required correction | Verification |
| --- | --- | --- | --- | --- | --- |
| Medium | Systems topology | `src/features/systems-topology/SystemsTopology.module.css:173` | All five information buttons render at `23×23` CSS px on desktop and mobile. They are isolated but unnecessarily difficult touch targets. | Preserve the visual 23 px circle if desired, but expand each interactive box to at least `44×44` with padding or a pseudo-element and keep clear spacing between targets. | At `390×844` and `1440×1000`, assert every `More information about …` button has a bounding box of at least `44×44` and still exposes its unique accessible name. |
| Medium | UI primitives | `src/components/ui/sheet.tsx:62`; `src/components/ui/dialog.tsx:60` | The shared sheet and dialog close controls render at `24×24` CSS px. This affects the mobile command index, both project briefings, and Signal Sprint. | Give the rendered close buttons a minimum `44×44` interactive box while retaining the icon size and top-right placement. | Open each sheet/dialog at `390×844`; the `Close` button bounding box must be at least `44×44`, remain fully visible, and close with touch, Enter, Space, and Escape. |
| Medium | Training simulation | `src/features/training/TrainingModule.module.css:122`; `src/features/mission-runner/MissionRunner.module.css:32` | Signal Sprint's audio, Back to Portfolio, Retry, and Back buttons render only `36` px high on mobile. These are primary recovery/exit controls in a touch-led game. | Set a `44px` minimum block size on all game buttons and preserve separation inside the failure overlay. | At `390×844`, inspect ready, running, and game-over states; every button must be at least `44×44`, non-overlapping, and activatable without triggering a playfield jump. |
| Low | Primary navigation | `src/features/navigation/CommandNav.module.css:20`; `src/features/navigation/CommandNav.module.css:71` | At `1440×1000`, the identity link is 34 px high, four plain navigation links are 20 px high, and the Training sim link is 40 px high. The mobile menu correctly uses 44/58 px controls, but desktop navigation remains undersized for touch-capable laptops. | Expand the desktop anchor hit areas to at least 44 px high without changing the sticky header's visual density. | At widths above 900 px, assert every link in the banner has a bounding box of at least `44×44` or an equivalent non-overlapping 44 px activation area. |
| Low | Mission logs | `src/features/mission-logs/MissionLogsSection.module.css:166` | Mission preview links render as 17 px-high inline targets (`Live`, `Overview`, and `GitHub`) on both inspected viewports. The list layout has room to provide larger discrete hit areas. | Style preview links as at least 44 px-high inline-flex targets with sufficient separation; preserve their current text and URL semantics. | At `390×844` and `1440×1000`, measure every mission preview link and confirm at least a 44 px block target without overlap. |
| Low | Command footer | `src/features/command-footer/CommandFooter.module.css:53` | Footer links render at 22 px high on desktop and mobile despite being a discrete, spacious action row. | Add padding/minimum height so each contact/profile link provides a 44 px-high hit area while maintaining wrapping at 390 px. | Measure GitHub, LinkedIn, and the CV action at both audited viewports; each must be at least 44 px high and the row must not overflow horizontally. |

## Deferred integration minor

This is not a motion or accessibility failure, but it was independently confirmed while tracing ownership and should remain in the integration ledger.

| Severity | Owner | File:line | Finding | Required correction | Verification |
| --- | --- | --- | --- | --- | --- |
| Low | Data modelling / Crew | `src/data/characters.ts:1` | The data module imports the UI-owned `CrewMember` type from `features/crew/CrewSection`, reversing the intended dependency direction and coupling content data to a rendered component. | Move `CrewMember` to `src/data/types.ts` (or derive it from data-domain types) and import that domain type from both the data builder and crew UI. | Run `npm run typecheck` and verify `src/data` has no imports from `src/features` or `src/components`. |

## Release note

The runtime project-image transfer budget was observed but is intentionally excluded from this motion/accessibility finding count; it belongs to the Task 12 release ledger and performance owner.
