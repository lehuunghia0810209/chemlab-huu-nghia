# ChemLab 6.5.3 — Release readiness

## Decision

**READY FOR PREVIEW APPROVAL**

The RC is locally reproducible and passes the required non-AI release checks. No commit, push, merge, rebase, Preview deployment, Production deployment, secret change, or AI-binding change was performed.

## RC identity

| Item | Value |
|---|---|
| Base/HEAD/origin/main | `d6fcffc4d3302cbbf1ff97e51d52001b2cc4ae4b` |
| Branch | `rc/chemlab-6.5.3-codex` |
| Worktree | `D:\EduLab\.worktrees\chemlab-6.5.3-codex-rc` |
| Version | `6.5.3` |
| Service-worker cache | `chemlab-6.5.3-brand-1` |
| Vite | `8.3.6` exact |

## Gate summary

| Gate | Result | Evidence |
|---|---|---|
| Diff integrity | PASS | 16 tracked product/test/config files; 507 insertions, 174 deletions before report-only additions |
| AI/provider/secrets | PASS | No diff in `functions/`, `src/ai/`, provider, relay, service, secret, environment, or binding paths |
| Publication gates | PASS | No gate file changed; `npm run build` executed the existing prebuild checks |
| Version synchronization | PASS | package, lock, app, HTML and manifest name = 6.5.3; SW cache = 6.5.3 |
| Release sync idempotency | PASS | Git diff hash unchanged: `4b4bed064c951a4869a44c62fab108dce6c41e00` |
| Static/project regression | PASS | Chemistry 49; Learning 242; Questions 783/537; Exam 84; papers 850; UI 76 |
| Firefox full browser suite | PASS | 411/411, 42/42 suites, 00:08:00.408 |
| Chromium full browser suite | PASS | 411/411, 42/42 suites, 00:04:11.371 after final runner state |
| WebKit full browser suite | PASS | 411/411, 42/42 suites, 00:07:29.256 after final runner state |
| Accessibility/keyboard | PASS after unchanged-build rerun | 104 axe scans; keyboard focus checks PASS; initial transient failure retained |
| CSP artifact | PASS local | Built hash matches `_headers`; CSP browser suite 5/5 |
| PWA/persistence | PASS local | Firefox final PWA 17/17; prior affected groups 17/17 on all three engines |
| Build reproducibility | PASS | 304 vs 304 files; zero path/SHA-256/length differences |
| Dependency audit | PASS | Full and production audits: 0 vulnerabilities |
| Mobile LCP | PASS | 2,355 / 2,346 / 2,351 ms; median 2,351 ms; CLS 0 |
| Cloudflare Preview | NOT RUN | Requires separate owner approval |

## Allowed RC scope

- Release metadata and cache identity.
- Exact Vite pin and CSP hash/header correction.
- Non-AI route loading, font subset loading, and Atomic Explorer focus behavior.
- Browser-runner reliability, exam suite partitioning, and PWA test reliability.
- RC validation reports and generated local evidence.

## Remaining approval gates

1. Owner reviews the uncommitted diff and report evidence.
2. Owner separately approves commit/push of the non-production RC branch, which may trigger Cloudflare Pages Preview through Git integration.
3. Before push, confirm the Pages project is `chemlab-edulab`, Production branch remains `main`, and Preview branch controls include `rc/chemlab-6.5.3-codex`.
4. Validate live headers/PWA on Preview without `--ai` and without changing secrets or AI bindings.

Production remains out of scope.
