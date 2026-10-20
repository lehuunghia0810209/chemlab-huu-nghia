# ChemLab 6.5 — release checklist (NOT executed)

Status: the local branch is implementation-complete for the approved technical scope; **nothing has been released**. Every step below needs the owner's explicit approval.

## 1. Gates before any public release

| Gate | Owner action | Evidence / where |
| --- | --- | --- |
| Independent audit | Codex (or another auditor) runs the handoff in `docs/audit/CODEX_HANDOFF_6.5.md` | — |
| Official exam rights | Obtain permission for at least one paper, then follow `docs/exam/EXAM_SOURCES.md` §3 | 0/4 papers licensed today |
| Exam scoring rule wording | Confirm the Ministry's original text for Phần II / Phần III rules | `docs/exam/EXAM_SOURCES.md` §1 |
| Teacher review | Work through `docs/learning/TEACHER_REVIEW_REGISTER.md` | Not started |
| ChemAI cost control | Configure a shared limit (below) **before** enabling feedback; decide whether chat also needs it at the expected traffic | Code ready, bindings absent |

## 2. Version and cache (Issue CL-64-001)

1. Set `"version": "6.5.0"` in `package.json` (only this file by hand).
2. `npm run release:sync` — rewrites `src/appMeta.js`, `index.html`, `public/manifest.webmanifest`, `public/sw.js` (cache namespace becomes `chemlab-6.5.0-brand-1`). Review `git diff`.
3. `npm run build` (runs release:sync + `npm run check` first), `npm run check:browser`, `npm run check:a11y`. Version assertions now read the synced values, so no test edits are needed.
4. Update/offline check from a browser that has the 6.2.0 cache: open the old build, deploy preview, reload twice; old caches must be deleted on `activate`, learning progress (`chemlab-v1-progress`), practice and exam data (`chemlab-v1-exam`) must remain.

## 3. Cloudflare configuration (owner, dashboard or wrangler — not in Git)

| Name | Type | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | Secret | Existing |
| `CHEMAI_LIMITER` | Rate Limiting binding (if available to the Pages project) | Cross-isolate per-client limit, keys `chat:<ip>` / `feedback:<ip>` |
| `CHEMAI_QUOTA` | KV namespace | Approximate per-day budget per scope (`budget:<scope>:<date>`) |
| `CHEMAI_DAILY_LIMIT_CHAT`, `CHEMAI_DAILY_LIMIT_FEEDBACK` | Vars | Defaults 2000 / 300 requests per day |
| `CHEMAI_FEEDBACK` | Var `on` | Turns rubric feedback on; ignored unless a shared limit exists |

Without `CHEMAI_LIMITER`/`CHEMAI_QUOTA`, chat keeps the previous in-memory burst limit only (as in 6.4) and feedback stays off. Verify with `GET /api/feedback` → `{"enabled": true}` only after configuration.

## 4. Never

Push/merge/deploy without approval; enable the exam fixture flag in production documentation; label any paper “đề chính thức” without the gates in §1.
