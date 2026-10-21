# Independent audit handoff — ChemLab 6.5 Final (remediation + exam import)

Prepared by the implementing agent (Claude Code). **This is not an audit result.** The previous independent audit (`D:\ChemLab-6_5-audit`, Codex) found EXR-001…007; this handoff lists what changed since and what to re-verify. The agent does not claim the remediation has passed audit.

## Baseline and scope

- Branch `evolution/next`. Audited baseline `9a47d99`; remediation `0ecc6a5` (R1), `83753d2` (R2), `6d57b7f` (R3); exam import `29052b1` (R4 Đồng Nai), `bd46600` (R5 graduation exams 2025/2026), `509cb71` (R6 teacher practice), R7 (QA, docs).
- User files never committed by the agent: staged `AGENTS.md`, modified `.gitignore`, untracked `.claude/`.
- Version still `6.2.0` (release action, see `docs/release/RELEASE_6.5.md` §2).

## Issue closure matrix

| Issue | Status | Evidence | Files | Tests | Residual risk |
| --- | --- | --- | --- | --- | --- |
| EXR-001 official papers | **RESOLVED — OWNER-ATTESTED** for 8 papers; 3 teacher-practice papers **BLOCKED** (key conflicts / unverifiable content) | Ministry reference + illustrative (Cục QLCL PDFs); graduation exams 2025 mã 0338 and 2026 mã 0330 (owner-supplied Word files, keys checked 28/28 against the Ministry official key files, 2026 key downloaded from the moet.gov.vn announcement of 19/06/2026); Sở Đồng Nai 2026 lần 1 ca 1/ca 2 (owner-supplied PDFs + Sở key tables); DTT 5, 6 (author keys). Every paper re-solved independently: 224/224 agree with its key. Authorization = owner attestation (licence not seen) | `src/exam/catalog.js`, `src/exam/papers/*.js`, `docs/exam/EXAM_SOURCES.md` (§2, 2a, 2b), `docs/exam/papers/*.md` | `check:exam` (84 + 848), browser R2 (each paper 28/28 via UI = 10/10), R3 (figures at 320/390 px) | Graduation-exam texts come from retyped Word files (no Ministry question PDF exists); 2 typing errors of the 2025 file corrected with evidence; some source figures are low resolution |
| EXR-002 scoring source | **RESOLVED — VERIFIED** (point rules); decision text **NOT VERIFIED** | Part I 0,25 / Part II 0,1–0,25–0,5–1 / Part III 0,25 printed on both official key pages | `src/exam/blueprints.js`, `EXAM_SOURCES.md` §1 | `check:exam` all-correct = 10,00 for both papers | Short-answer grid format rests on secondary reports |
| EXR-003 Cloudflare/live ChemAI | **BLOCKED — EXTERNAL DEPENDENCY** (staging) | Fail-closed logic and gates tested with mocks only; Pages Functions do not document the Rate Limiting binding | `functions/api/_limits.js`, `feedback.js` | `test-feedback-api.mjs` 19 (mocks) | No live PASS exists; staging plan in RELEASE §4 |
| EXR-004 teacher review | **OPEN** | 0 sign-offs; register lists the 224 ChemLab exam solutions, flagged items and blocked papers as priority 1 | `docs/learning/TEACHER_REVIEW_REGISTER.md` | — | Content is `internal` only |
| EXR-005 version/PWA | **MITIGATED** (version bump left to owner) | SW lifecycle documented; automated old-cache deletion + data preservation test | `scripts/lib/pwa-upgrade-journeys.mjs`, RELEASE §2 | browser “pwa upgrade” 3 checks | Real upgrade 6.2.0→6.5.0 on staging not run |
| EXR-006 CSP | **MITIGATED** (local); staging **NOT VERIFIED** | CSP in `_headers`; journey serves built HTML with the policy, 0 violations across main modules, WebGL scenes, ChemAI | `public/_headers`, `scripts/lib/csp-journeys.mjs` | browser “csp” 5 checks | `style-src 'unsafe-inline'` kept (inline style attributes) |
| EXR-007 approximate budget | **MITIGATED** (code); deployment **BLOCKED — EXTERNAL DEPENDENCY** | Exact Durable Object counter worker; feedback refuses KV-only unless `CHEMAI_ACCEPT_APPROX_BUDGET=on`; 4 in-flight cap per isolate | `workers/chemai-quota/`, `_limits.js`, `feedback.js` | `test-feedback-api.mjs` (DO limit, DO down → 429, BUSY) | Worker not deployed; DO mock uses the real class with in-memory storage |

## Commands (run by the agent on 2026-10-20, after R6)

`npm run build` (incl. `npm run check`: exam 84, exam papers 848, feedback 19 mock) PASS · `npm run check:browser` 352/352 · `npm run check:a11y` 100 scans PASS. Details: `docs/learning/CHECKPOINT_6.5.md`.

## Suggested audit focus

1. Re-solve a sample of each of the 8 papers against its key; compare transcriptions with the owner's source files (names and SHA-256 in each checklist; the files are outside the repository).
2. Check the two documented corrections in `tot-nghiep-2025-hoa` (II.4 density unit, III.4 butane label) and the blocked items in `EXAM_SOURCES.md` §2b.
3. Publication gate: reach a blocked DTT paper or the fixture by URL or localStorage edits.
4. `_limits.js` ordering and fail-closed paths; the quota worker's input validation.
5. CSP on a real deployment (headers are not applied by `vite preview`).
6. Screen-reader pass on figures/tables of the official papers (not done by the agent).

## Not verifiable by the agent

Licence documents (confidential, by design), printed originals of the graduation exams, live Gemini, Cloudflare bindings, production deployment, real devices, screen readers, teacher sign-off.
