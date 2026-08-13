# PORT-011 manual test charter — resilience

Status: pending Developer GREEN and Tester re-verification.

## Environment

Use the production build served at `/ben-portfolio/`. Start every row from a hard reload at `#desktop`; record browser version, operating system, zoom, input emulation, motion preference, route, and a screenshot or screen-reader note for every failure.

## Viewport and platform matrix

| Viewport | Input journeys | Motion | Browsers |
| --- | --- | --- | --- |
| 1440×1000 | Mouse and keyboard | Normal and reduced | Chromium, Firefox, WebKit |
| 1024×768 | Mouse and keyboard | Normal and reduced | Chromium, Firefox, WebKit |
| 768×1024 | Mouse and keyboard | Normal and reduced | Chromium, Firefox, WebKit |
| 390×844 | Touch emulation and keyboard | Normal and reduced | Chromium, Firefox, WebKit |
| 320×568 | Touch emulation and keyboard | Normal and reduced | Chromium, Firefox, WebKit |

## Charter

| Journey | Method | Expected evidence |
| --- | --- | --- |
| Keyboard-only primary paths | Tab from the skip link through menu, window controls, Career range/year controls, dock, CV, GitHub, LinkedIn, and Contact; use Enter/Space, arrows, and Escape. | Every control is reachable in document order, focus remains visible on mint, paper, orange, yellow, and blue, and each keyboard action matches its mouse/touch result. No modal role or focus trap appears in a window. |
| Responsive application recovery | At each mobile viewport, switch About → Work → Career → Projects → Contact → Command from the dock; close/minimize then recover through the dock or Reset Layout. Attempt title/body/control drags. | Exactly one application is displayed below 768px, no drag moves it, no overlap hides content, and the document—not a fixed app pane—scrolls naturally with no horizontal clipping. |
| Touch target and zoom | At 390×844 and 320×568 inspect menu, dock, window controls, Career years/range, Contact, CV, and external links; repeat at 200% browser zoom. | Practical targets are at least 44×44 CSS px, labels remain visible, no required action is obscured, and horizontal scrolling is not introduced. |
| Reduced-motion parity | Enable reduced motion; open/minimize/maximize an app and change Career rapidly with range arrows and year buttons. | Same content and recovery paths work without waiting for an animation; Career stage text and selected control update immediately. |
| Invalid hash and history | Load `#not-a-portfolio-route`, then use direct supported hashes; exercise back/forward after menu/dock navigation. | Invalid input returns to `#desktop`, keeps the page operable, and announces a non-blocking recovery. Supported direct hashes and history restore the matching application. |
| Root and local failure recovery | Trigger the documented root-render failure harness; block a project-preview image and open its project. | The root fallback retains Ben Hutchinson plus direct Contact, CV, and GitHub exits. A missing preview remains local: title, summary, and actions continue to work. |
| Screen-reader spot check | With VoiceOver/NVDA equivalent, inspect landmarks, heading sequence, Menu/Dock names, live messages, Career range value text, and active-state wording. | One understandable landmark path, meaningful names, a sensible heading hierarchy, a labelled Career stage/value, and state not conveyed by colour alone. |
| Visual focus and colour | Inspect focused controls and active/available states across every surface colour. | Focus is conspicuous independently of colour; selected/available states have text, pressed/current, or other non-colour cues. |

## Evidence record

For each executed matrix row, append to `docs/tasks/PORT-011-resilience.md`:

`date | build/commit | browser/version | viewport | input | motion | journey | PASS/FAIL | route | exact observation | screenshot/log path | defect ID`.

Failures must include reproduction steps, expected behaviour, actual behaviour, requirement link, severity, and evidence. Re-run the full row after any Developer fix.
