# ChemLab 6.5.3 — Final local regression

Validation date: 2026-11-10. Target: uncommitted RC in `D:\EduLab\.worktrees\chemlab-6.5.3-codex-rc`.

## Results

| Area | Result | Actual evidence |
|---|---|---|
| Production build | PASS | `npm run build`, exit 0, 27.954 s; existing prebuild publication gates ran |
| Chemistry | PASS | 49 checks |
| Learning | PASS | 242 checks |
| Question bank | PASS | 783 checks across 537 questions |
| Exam logic | PASS | 84 checks |
| Exam papers | PASS | 850 checks |
| UI validation | PASS | 76 checks |
| Existing AI gates | PASS | Mocks/stubs only; no real provider call |
| Firefox browser smoke | PASS | 411/411 in 00:08:00.408 |
| Chromium browser smoke | PASS | 411/411 in 00:04:11.371 after final runner state |
| WebKit browser smoke | PASS | 411/411 in 00:07:29.256 after final runner state |
| Accessibility and keyboard | PASS on complete unchanged-build rerun | 104 axe scans plus keyboard checks; 201.810 s |
| CSP browser behavior | PASS | Firefox security group 5/5; prior full runs PASS on Chromium/WebKit |
| PWA upgrade/offline/persistence | PASS | 6.5.2→6.5.3, offline lazy route, interrupted install, rollback, learner data and exam autosave |
| Build reproducibility | PASS | Two fresh builds; 304 files each; zero relative-path/SHA-256/length differences |
| Dependency audit | PASS | Full 0; production 0 |
| Release sync | PASS | Repeat invocation left Git diff hash byte-equivalent |
| Mobile Lighthouse | PASS, not rerun in this final pass | Final prior runs 2,355 / 2,346 / 2,351 ms LCP; no later rendering change |

## CSP and version artifact checks

- Package, lock root, app metadata and HTML identify 6.5.3.
- Manifest `name` identifies ChemLab 6.5.3; this manifest does not use a non-standard `version` field.
- Service-worker cache namespace is `chemlab-6.5.3-brand-1`.
- Vite is exactly 8.3.6 in package and lock.
- `dist/index.html` contains one inline boot style with `sha256-UhC6pIeolfu/DM5EERJQ3cg84WVpGdG3N2aysDdqifA=`.
- The hash is declared by `dist/_headers`; built and public `_headers` are byte-identical.
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, SW/manifest revalidation, immutable asset caching, and API no-store rules are present in the artifact.

## Accessibility investigation

The first final run failed one keyboard comparison for the grade-12 `.lx-grade` link. The shared focus rule was present in the built CSS and computed to the expected dark-theme ring. Eighteen repeated measurements on the same three grade links all passed, followed by a complete 104-scan PASS on the unchanged build. This is recorded as a non-reproducible audit timing false negative, not hidden as an unconditional first-run PASS. No product CSS or test assertion was changed.

## Not run locally

- Cloudflare Preview/Production and live response headers.
- Real AI provider or any AI evaluation.
- Physical mobile devices and screen readers.
- Exact 6.5.2→6.5.3 upgrade on a live Preview alias.

## Warnings and retained risks

- Fifteen existing reaction records still produce known “no effect” validator warnings; the build passes.
- Live Pages branch controls and environment configuration must be confirmed in the dashboard before push.
- The RC remains intentionally uncommitted.

## Evidence directory

`reports/chemlab-6.5.3/implementation/final-validation/` contains final Chromium/Firefox/WebKit logs and durations, both accessibility logs, build log, audit JSON, release-sync identity check, and reproducibility result.
