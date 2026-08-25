# Portfolio OS task packets

Task packets are the delivery contract between the Product Owner, Tester, and Developer. The Product Owner creates a packet from [TEMPLATE.md](./TEMPLATE.md), resolves product ambiguity, links the exact approved requirements, and marks only one implementation packet `READY` at a time unless two packets are explicitly independent.

## Status workflow

- `READY`: the Product Owner has approved the outcome, scope, exclusions, acceptance criteria, and dependencies. The Tester may now create the focused failing acceptance test and manual charter.
- `IN_PROGRESS`: the required failing acceptance evidence has been recorded and the Developer may change production code. A packet returned with `CHANGES_REQUESTED` re-enters this state for the bounded fix.
- `IN_TEST`: the Developer has recorded current focused-test, type-check, lint, and build results. The Tester owns independent automated, coverage, browser, accessibility, responsive, and manual verification for the affected scope.
- `CHANGES_REQUESTED`: the Product Owner or Tester has identified a bounded failure. Record severity, reproduction steps, expected behaviour, actual behaviour, and the affected requirement before returning the packet to `IN_PROGRESS`.
- `ACCEPTED`: the Tester has issued a pass for the tested commit and the Product Owner has compared the implementation and evidence with every acceptance criterion. Only the Product Owner may set this status.

The normal delivery path is `READY` → `IN_PROGRESS` → `IN_TEST` → `ACCEPTED`. `CHANGES_REQUESTED` creates a documented fix-and-retest loop; it is not an alternate completion state. No task is complete until the Tester passes it and the Product Owner marks it `ACCEPTED`.

## Evidence rules

- Record the exact command, result, and tested commit for automated evidence. Do not rely on an earlier run.
- Record viewport, input method, scenario, and observed result for manual evidence.
- Keep failed evidence in the packet when it is required to prove a RED test-first gate.
- Use `Not yet run` for evidence that is pending at `READY`; do not imply a pass before execution.
- A defect record must include severity, reproduction, expected result, actual result, and the affected requirement.
- A Product Owner decision is either `ACCEPTED` or a bounded change request. It remains `PENDING` while the task is `READY`, `IN_PROGRESS`, or `IN_TEST`.

## PORT-001 setup exception

PORT-001 needs a runnable test harness before the Tester can write and execute the first UI acceptance test. For this task only, while the packet remains `READY`, the Developer may install dependencies and create or update toolchain and test-runner configuration. The Developer must not change `src/App.tsx`, `src/styles/global.css`, delete legacy production modules, or write any other production UI code until the Tester has added `tests/unit/foundation.test.tsx`, run it against the legacy UI, and recorded the expected failing result in [PORT-001-foundation.md](./PORT-001-foundation.md). This exception changes sequencing only: the Tester still owns the acceptance test and independent verification, and the Product Owner still owns acceptance.
