# ChemLab 6.5 — release checklist (NOT executed)

Status: the local branch holds the implementation and eight exam papers; **nothing has been released**. Every step below needs the owner's explicit approval.

## 1. Gates before any public release

| Gate | Owner action | Evidence / where |
| --- | --- | --- |
| Independent audit | Codex (or another auditor) runs `docs/audit/CODEX_HANDOFF_6.5.md` | — |
| Exam content | 8 papers READY_FOR_OWNER_RELEASE: Ministry reference + illustrative 2025, graduation exams 2025 (mã 0338) and 2026 (mã 0330), Sở Đồng Nai survey 2026 lần 1 (ca 1, ca 2), teacher practice DTT 5 and 6. Authorization owner-attested; keys checked against the issuing authority (or re-solved for the author's key). 3 teacher-practice papers blocked pending a decision. Owner decides which to publish | `docs/exam/EXAM_SOURCES.md` §2, §2b; `docs/exam/papers/*.md` |
| Exam scoring rule wording | Point rules confirmed on the two official answer-key pages; the Ministry decision text itself was not retrieved | `docs/exam/EXAM_SOURCES.md` §1 |
| Teacher review | Work through `docs/learning/TEACHER_REVIEW_REGISTER.md` | Not started (0 sign-offs) |
| ChemAI cost control | Deploy the quota worker (§3) **before** enabling feedback; run the staging plan (§4) | Code ready, nothing deployed |
| CSP | Run §5 on a staging deployment | Verified locally only |

## 2. Version and cache (EXR-005)

The version stays `6.2.0` on the branch on purpose: bumping it changes the production cache namespace, which is a release action.

**Where the version lives.** `package.json` is the only hand-edited source. `npm run release:sync` (`scripts/sync-release.mjs`, also run by `prebuild`) rewrites `src/appMeta.js`, `index.html`, `public/manifest.webmanifest` and `VERSION` in `public/sw.js` (cache names `<VERSION>-static`, `<VERSION>-runtime`). Version assertions in the checks read the synced values.

**Service-worker lifecycle (read from `public/sw.js`, `src/production.js`).**
- No `skipWaiting()` / `clients.claim()`: a new worker installs in the background and takes control only after every tab of the old version is closed (or on the next navigation of a new tab). An open lesson or exam is never switched mid-session.
- `activate` deletes every cache whose name is not the current `STATIC`/`RUNTIME` cache, so 6.2.0 caches are removed once 6.5.0 activates.
- The worker never touches `localStorage`: learning progress (`chemlab-v1-progress`), practice and exam sessions/results (`chemlab-v1-exam`) survive. Exam deadlines are stored timestamps, so an update during an exam cannot extend or reset the time.

**Automated evidence.** `npm run check:browser` → “pwa upgrade” journey (`scripts/lib/pwa-upgrade-journeys.mjs`): seeds `chemlab-6.1.0-legacy-*` caches plus progress and exam data, installs the real `sw.js`, asserts only `<current VERSION>-*` caches remain and the data is intact. The existing PWA check covers registration, v1 progress and offline reload.

**Release steps (owner).**
1. Set `"version": "6.5.0"` in `package.json`.
2. `npm run release:sync`; review `git diff` (4 files).
3. `npm run build`, `npm run check:browser`, `npm run check:a11y`.
4. Manual upgrade check on staging from a browser holding the 6.2.0 build: open old site, deploy, reload twice / close all tabs; DevTools → Application → Cache Storage shows only `chemlab-6.5.0-brand-1-*`; Learning progress and exam results unchanged.

## 3. Cloudflare configuration (owner, dashboard or wrangler — not in Git)

| Name | Type | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | Secret | Existing |
| `CHEMAI_BUDGET` | Durable Object binding → worker `chemai-quota`, class `QuotaCounter` | **Exact** per-day budget per scope (preferred). Deploy from `workers/chemai-quota` using `wrangler.toml.example` |
| `CHEMAI_QUOTA` | KV namespace | Approximate per-day budget (KV is eventually consistent; concurrent requests can overshoot). Used only without `CHEMAI_BUDGET` |
| `CHEMAI_ACCEPT_APPROX_BUDGET` | Var `on` | Required for feedback to run on the KV budget alone (owner accepts overshoot) |
| `CHEMAI_LIMITER` | Rate Limiting binding | Per-client burst limit. Cloudflare documents this binding for Workers; Pages Functions do not list it, so it is optional and **not** a cost budget |
| `CHEMAI_DAILY_LIMIT_CHAT`, `CHEMAI_DAILY_LIMIT_FEEDBACK` | Vars | Defaults 2000 / 300 requests per day |
| `CHEMAI_FEEDBACK` | Var `on` | Turns rubric feedback on |

Feedback is enabled only when `CHEMAI_FEEDBACK=on`, the key exists and there is either `CHEMAI_BUDGET` or (`CHEMAI_QUOTA` + `CHEMAI_ACCEPT_APPROX_BUDGET=on`). Any budget error fails closed (429). Each isolate also caps feedback at 4 requests in flight (503 `BUSY`).

## 4. Staging plan for ChemAI (EXR-003, not executed)

| Case | Setup | Expected |
| --- | --- | --- |
| Not configured | no `CHEMAI_FEEDBACK` | `GET /api/feedback` → `enabled:false`; UI shows “chưa bật” |
| Configured | DO binding + flag + key | `enabled:true`; a written answer returns rubric feedback |
| Quota exhausted | `CHEMAI_DAILY_LIMIT_FEEDBACK=2`, send 3 | 200, 200, 429; Gemini usage shows 2 calls |
| Binding failure | point `CHEMAI_BUDGET` at a non-existent class / undeploy worker | 429 (fail closed), no Gemini call |
| KV only | remove DO, add KV, no acceptance flag | `enabled:false` |

Record request IDs and Gemini usage as evidence. Mocked results (`scripts/test-feedback-api.mjs`) are **not** a live PASS.

## 5. CSP (EXR-006)

`public/_headers` now sends `Content-Security-Policy` (scripts `'self'` only; inline styles allowed because components set `style=` attributes; images `data:`/`blob:`; `connect-src 'self'`; `frame-ancestors 'none'`). Local evidence: browser journey “csp” serves `dist/index.html` with this policy and opens Home, Periodic, Compound Studio, Lab, Learning, Exam, Atomic Explorer/Orbital Atlas (WebGL) and the ChemAI panel with zero violations. Staging: open the same views on the deployed preview and check the console for `Refused to …`; if a violation appears, roll back `_headers` rather than widening the policy blindly.

## 6. Never

Push/merge/deploy without approval; enable the exam fixture flag in production documentation; mark a paper READY without every state in `src/exam/catalog.js`; record a teacher sign-off that did not happen.
