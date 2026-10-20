# Independent audit handoff — ChemLab 6.5 (after remediation)

Prepared by the implementing agent (Claude Code). **This is not an audit result.** The previous independent audit (`D:\ChemLab-6_5-audit`, Codex) found EXR-001…007; this handoff lists what changed since and what to re-verify. The agent does not claim the remediation has passed audit.

## Baseline and scope

- Branch `evolution/next`. Audited baseline `9a47d99`; remediation commits `0ecc6a5` (R1), `83753d2` (R2) and the R3 commit “EXR-003/005/006/007” (see `git log`).
- User files never committed by the agent: staged `AGENTS.md`, modified `.gitignore`, untracked `.claude/`.
- Version still `6.2.0` (release action, see `docs/release/RELEASE_6.5.md` §2).

## Issue closure matrix

| Issue | Status | Evidence | Files | Tests | Residual risk |
| --- | --- | --- | --- | --- | --- |
| EXR-001 official papers | **RESOLVED — OWNER-ATTESTED** for 2 papers; **BLOCKED — EXTERNAL DEPENDENCY** for 4 | Two Ministry papers (đề tham khảo 2025, đề minh họa) downloaded from the Cục QLCL pages, SHA-256 recorded, transcribed 28/28 each, official keys entered twice and every key independently re-solved (56/56 agree). Authorization = owner attestation (licence not seen). 2025 exam: authority publishes keys only; 2026: image republication only; Đồng Nai: third-party copies only | `src/exam/catalog.js`, `src/exam/papers/*.js`, `docs/exam/EXAM_SOURCES.md`, `docs/exam/papers/*.md` | `check:exam` (79 + 213), browser journeys R/R2 (both papers 10/10 via UI) | Rights rest on the owner's statement; figures are crops of scans |
| EXR-002 scoring source | **RESOLVED — VERIFIED** (point rules); decision text **NOT VERIFIED** | Part I 0,25 / Part II 0,1–0,25–0,5–1 / Part III 0,25 printed on both official key pages | `src/exam/blueprints.js`, `EXAM_SOURCES.md` §1 | `check:exam` all-correct = 10,00 for both papers | Short-answer grid format rests on secondary reports |
| EXR-003 Cloudflare/live ChemAI | **BLOCKED — EXTERNAL DEPENDENCY** (staging) | Fail-closed logic and gates tested with mocks only; Pages Functions do not document the Rate Limiting binding | `functions/api/_limits.js`, `feedback.js` | `test-feedback-api.mjs` 19 (mocks) | No live PASS exists; staging plan in RELEASE §4 |
| EXR-004 teacher review | **OPEN** | 0 sign-offs; register now lists the 56 ChemLab solutions as priority 1 | `docs/learning/TEACHER_REVIEW_REGISTER.md` | — | Content is `internal` only |
| EXR-005 version/PWA | **MITIGATED** (version bump left to owner) | SW lifecycle documented; automated old-cache deletion + data preservation test | `scripts/lib/pwa-upgrade-journeys.mjs`, RELEASE §2 | browser “pwa upgrade” 3 checks | Real upgrade 6.2.0→6.5.0 on staging not run |
| EXR-006 CSP | **MITIGATED** (local); staging **NOT VERIFIED** | CSP in `_headers`; journey serves built HTML with the policy, 0 violations across main modules, WebGL scenes, ChemAI | `public/_headers`, `scripts/lib/csp-journeys.mjs` | browser “csp” 5 checks | `style-src 'unsafe-inline'` kept (inline style attributes) |
| EXR-007 approximate budget | **MITIGATED** (code); deployment **BLOCKED — EXTERNAL DEPENDENCY** | Exact Durable Object counter worker; feedback refuses KV-only unless `CHEMAI_ACCEPT_APPROX_BUDGET=on`; 4 in-flight cap per isolate | `workers/chemai-quota/`, `_limits.js`, `feedback.js` | `test-feedback-api.mjs` (DO limit, DO down → 429, BUSY) | Worker not deployed; DO mock uses the real class with in-memory storage |

## Commands (run by the agent on 2026-10-20)

`npm run build` (incl. `npm run check`: exam 79, exam papers 213, feedback 19 mock) PASS · `npm run check:browser` 334/334 · `npm run check:a11y` 100 scans PASS. Details: `docs/learning/CHECKPOINT_6.5.md`.

## Suggested audit focus

1. Re-solve a sample of both papers against the official keys; compare the transcription with the PDFs (SHA in the checklists).
2. Publication gate: reach `tot-nghiep-2025-hoa` / fixture by URL or localStorage edits.
3. `_limits.js` ordering and fail-closed paths; the quota worker's input validation.
4. CSP on a real deployment (headers are not applied by `vite preview`).
5. Screen-reader pass on figures/tables of the official papers (not done by the agent).

## Not verifiable by the agent

Licence documents (confidential, by design), live Gemini, Cloudflare bindings, production deployment, real devices, screen readers, teacher sign-off.
