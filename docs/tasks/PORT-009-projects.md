# PORT-009 — Engineering project case studies

Status: ACCEPTED

## Outcome

Projects presents Pokeleximon and Safelog as deliberately unequal engineering case studies, with Pokeleximon carrying the richer evidence and both entries centred on system shape and delivery judgement.

## Delivered contract

- Typed project data drives catalogue and detail views using stable project IDs.
- Direct project hashes, catalogue-to-detail selection, history navigation, and return-to-catalogue behaviour are covered.
- Project media uses optimized WebP assets and a labelled fallback that preserves the surrounding case study.
- Meaningful alternatives and safe external-link attributes are present.
- The two optimized images total about 118KB; each is below the 350KB non-hero limit.
- Desktop and mobile retain the accepted tactile Portfolio OS styling without horizontal overflow.

## Evidence

- Implementation and tests: `a08a43a`.
- Full tests: 124/124 passed.
- Coverage: 98.64% statements, 93.42% branches, 99.11% functions, 99.49% lines.
- Typecheck, lint, and production build passed.
- Projects E2E: 3/3 applicable cases passed on a fresh owned preview; three unavailable-project cases were intentionally skipped.
- Rendered evidence: `/private/tmp/portfolio-os-task9-desktop.png`, `/private/tmp/portfolio-os-task9-pokeleximon.png`, and `/private/tmp/portfolio-os-task9-mobile.png`.

## Decision

ACCEPTED — SPEC COMPLIANCE: PASS. TASK QUALITY: PASS. The project views are evidence-led rather than a generic card grid, responsive, and visually faithful. The focused skip link visible in the automated mobile capture is a test-focus state, not the default presentation; general focus-state polish remains in PORT-011.
