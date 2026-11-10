# ChemLab 6.5.3 — Browser test matrix

## Full-suite results

| Browser | Result | Scope | Timing/evidence |
|---|---|---|---|
| Chromium | **PASS — 411/411** | 42/42 suites in one uninterrupted final run | 00:04:11.371; `implementation/final-validation/chromium-full.log` |
| Firefox | **PASS — 411/411** | 42/42 suites in one uninterrupted final run | 00:08:00.408; `implementation/final-validation/firefox-full.log` |
| WebKit | **PASS — 411/411** | 42/42 suites in one uninterrupted final run | 00:07:29.256; `implementation/final-validation/webkit-full.log` |

The first Firefox run before the PWA test-only controller fix was 410/411. The affected PWA group then passed 17/17 on Chromium, Firefox, and WebKit. Final validation reran all Firefox suites together and achieved the required 411/411.

## Firefox final run by group

| Group | Suites | Checks | Result |
|---|---:|---:|---|
| Layout/interaction/brand | 3 | 124 | PASS |
| Tools | 1 | 18 | PASS |
| Lab | 6 | 48 | PASS |
| Learning | 4 | 54 | PASS |
| Practice | 2 | 21 | PASS |
| Exam core/scoring/layout/recovery | 19 | 100 | PASS |
| Security/CSP | 1 | 5 | PASS |
| PWA upgrade/shell | 2 | 17 | PASS |
| Existing AI UI behavior with stubs/off state | 4 | 24 | PASS; no provider call |
| **Total** | **42** | **411** | **PASS** |

## Reliability controls verified

- Each suite prints `START` and `END`, check count, and duration.
- Default suite deadline: 240,000 ms.
- Global runner deadline: 1,200,000 ms.
- Timeout diagnostics include browser, group, suite, elapsed time, error, and trace path.
- Timeout self-tests intentionally failed and produced trace ZIP files with diagnostics.
- Layout, Learning, Practice, Exam, Lab, PWA, Security, Tools, and AI groups can run independently; Exam is further split into core, scoring, recovery, and per-paper/per-viewport layout suites.
- No assertion or test was removed to obtain PASS.

## Accessibility browser check

`npm run check:a11y` uses Chromium. The first final-validation run reported one transient `.lx-grade` focus-indicator reading. Direct computed-style inspection showed the expected focus ring, 18 repeated focused/blurred comparisons passed, and the unchanged full rerun passed all 104 axe scans plus keyboard-focus checks in 201.810 seconds. Both logs are retained.

## Evidence

- `implementation/final-validation/firefox-full.log`
- `implementation/final-validation/firefox-duration.txt`
- `implementation/final-validation/chromium-full.log`
- `implementation/final-validation/chromium-duration.txt`
- `implementation/final-validation/webkit-full.log`
- `implementation/final-validation/webkit-duration.txt`
- `implementation/final-validation/firefox-artifacts/`
- `implementation/final-validation/a11y.log`
- `implementation/final-validation/a11y-rerun.log`
- `implementation/final-validation/a11y-rerun-duration.txt`
