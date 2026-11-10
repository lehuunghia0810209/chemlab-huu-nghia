# ChemLab 6.5.3 — Controlled implementation

## Release-candidate identity

| Item | Value |
|---|---|
| Decision | **READY FOR PREVIEW APPROVAL** |
| Base SHA | d6fcffc4d3302cbbf1ff97e51d52001b2cc4ae4b |
| Base ref | origin/main |
| RC branch | rc/chemlab-6.5.3-codex |
| RC worktree | D:\EduLab\.worktrees\chemlab-6.5.3-codex-rc |
| Package/app/HTML/manifest name | 6.5.3 |
| Service-worker cache | chemlab-6.5.3-brand-1 |
| Vite | exactly 8.3.6 |

The existing dirty D:\EduLab\ChemLab worktree and the dirty Gemini worktree were not modified, reset, stashed, or cleaned. Final RC validation was completed on 2026-11-10 without commit, push, merge, rebase, Preview, or Production deployment.

## Changes integrated

- Vite 8.3.6 is pinned in package.json and package-lock.json.
- CSP replaces broad style-src unsafe-inline with the Vite-built boot-style SHA-256 hash while retaining the narrower style-src-attr compatibility rule.
- Periodic Workspace is route-lazy-loaded; callers await route readiness before opening an element.
- Atomic Explorer focus containment and post-render focus restoration are corrected.
- Browser smoke supports Chromium, Firefox, and WebKit; suites can be selected individually or by layout, lab, learning, practice, exam, pwa, security, tools, and ai groups.
- Every suite has START/END timing, a 240-second default deadline, trace-on-timeout, context cleanup, and a 20-minute global runner deadline.
- Exam journeys are split into core, scoring, recovery, and per-paper/per-viewport layout suites without removing assertions.
- PWA upgrade test covers the 6.5.2 cache namespace to 6.5.3, offline lazy Periodic assets, interrupted install, rollback, learner persistence, and exam autosave.
- Be Vietnam Pro keeps weights 400/500/600/700 but loads only latin and vietnamese subsets, removing unused latin-ext requests.

No functions, src/ai, provider, relay, service, secret, or environment file differs from origin/main.

## Version and build controls

- release synchronization ran twice with identical hashes, and a final run changed zero files.
- Two clean builds each contained 304 files; relative paths and SHA-256 hashes matched with zero differences.
- The built inline-style hash is UhC6pIeolfu/DM5EERJQ3cg84WVpGdG3N2aysDdqifA= and matches public/_headers.
- npm audit and npm audit --omit=dev both report zero known vulnerabilities.
- npm run build completed the unchanged publication prebuild gates and Vite production build.

## Mobile LCP

All measurements used Lighthouse 13.6.0, mobile simulated throttling, the same local production build, and three sequential runs.

| Measurement | Performance | FCP | LCP | CLS | TBT | Speed Index |
|---|---:|---:|---:|---:|---:|---:|
| Diagnostic baseline median | 86 | 963 ms | 2,985 ms | 0 | 358 ms | 1,670 ms |
| RC before font subset median | 91 | 1,282 ms | 2,816 ms | 0 | 222 ms | 1,314 ms |
| RC final median | 95 | 1,278 ms | **2,351 ms** | 0 | 199 ms | 1,480 ms |

Final LCP runs were 2,355 / 2,346 / 2,351 ms. The target LCP ≤2,500 ms was met in all three runs. The LCP remains the visible hero paragraph; no content was hidden or removed. Font requests fell from 12/193,496 bytes to 8/138,152 bytes.

JSON evidence is in reports/chemlab-6.5.3/implementation/.

## Browser and regression results

| Check | Result |
|---|---|
| Chromium full browser matrix after final runner state | **PASS — 411/411; 42/42 suites; 00:04:11.371** |
| Firefox full browser matrix, first run | 410/411; exposed a PWA setup race |
| Firefox affected PWA group after root-cause fix | PASS — 17/17 |
| Firefox full browser matrix after fix | **PASS — 411/411 in one run; 42/42 suites; 00:08:00.408** |
| WebKit full browser matrix after final runner state | **PASS — 411/411; 42/42 suites; 00:07:29.256** |
| Chromium affected PWA group after fix | PASS — 17/17 |
| WebKit affected PWA group after fix | PASS — 17/17 |
| Timeout/trace self-tests | PASS — suite and global timeout both failed intentionally with trace ZIP and complete diagnostics |
| Accessibility, first final-validation run | FAIL — one transient `.lx-grade` focus-indicator reading |
| Accessibility, unchanged-build rerun | PASS — 104 axe-core scans plus keyboard-focus checks; 201.810 s |
| Chemistry | PASS — 49 checks |
| Learning | PASS — 242 checks |
| Questions | PASS — 783 checks / 537 questions |
| Exam logic | PASS — 84 checks |
| Exam papers | PASS — 850 checks |
| UI validation | PASS — 76 checks |
| Existing AI publication tests | PASS — mocks only; no real provider call |

The Firefox failure was not suppressed: the test initially observed an active 6.5.2 worker without proving the tab was controlled. The setup now reloads only when needed and requires navigator.serviceWorker.controller before deploying 6.5.3. No product service-worker behavior was weakened.

Final full-run logs and durations for Chromium, Firefox, and WebKit are in `implementation/final-validation/`. The accessibility finding did not reproduce: the computed focus ring was present and 18 repeated focused/blurred comparisons passed; the complete unchanged-build rerun then passed. Both the initial failure and rerun logs are retained. No CSS, assertion, or audit rule was changed.

## CSP and PWA status

- CSP journey applies the policy to the built document and passes Home, Periodic, Tools, Lab, Learning, Exam, WebGL scenes, and the existing ChemAI panel.
- The production artifact contains one inline boot style with `sha256-UhC6pIeolfu/DM5EERJQ3cg84WVpGdG3N2aysDdqifA=`; that hash is present in `dist/_headers`, which is byte-identical to `public/_headers`.
- PWA upgrade, offline lazy route, interrupted install, rollback, persistence, and exam autosave pass on all three browser engines.
- No Preview or Production deployment was performed. Real Cloudflare header verification remains a deployment-stage check requiring owner approval.

## Remaining items

- Fifteen existing reaction records intentionally remain validator warnings because they have no visual effect classification.
- The first final accessibility run produced one non-reproducible focus-indicator false negative; the original failure log is retained even though direct repeated measurement and the complete rerun passed.
- Chromium, Firefox, and WebKit were each rerun as a complete 411-check suite after the final runner/PWA test state; all passed.
- Lighthouse was not rerun during final validation because rendering code did not change after the three final 2,355/2,346/2,351 ms measurements.
- Live Cloudflare headers, branch controls, PWA behavior on the Preview edge, real devices, and screen readers remain Preview-stage or owner-stage checks.
- The RC is intentionally uncommitted. Owner review is required before any commit, push, merge, Preview, or Production action.

## Release decision

**READY FOR PREVIEW APPROVAL.** There is no known product-code blocker in the tested non-AI scope. Preview remains unperformed; owner approval is required before any commit/push that would trigger the Git-integrated Preview.
