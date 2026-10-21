# ChemAI production hotfix — 6.5.0 (2026-10-21)

Symptom on `https://chemlab-edulab.pages.dev`: every ChemAI question returned
`400 FAILED_PRECONDITION` → `GEMINI_BAD_REQUEST`, attempts 1, no fallback. AI Studio
Playground answers normally with the same account.

## 1. Root cause analysis

| Candidate | Evidence | Verdict |
| --- | --- | --- |
| Model / endpoint / payload (code) | `GET /api/chat` on production: `configured: true`, `model: gemini-3.8-flash`. The official model list has `gemini-3.8-flash` and `gemini-3.6-flash` as stable models with a free tier. Endpoint `v1beta/models/{model}:generateContent`, `x-goog-api-key`. A malformed payload returns `INVALID_ARGUMENT`, and a wrong model returns `404 NOT_FOUND`, not `FAILED_PRECONDITION` | **Not the cause** (no evidence of a code defect) |
| Account prerequisite (Google) | Google's error reference: `failed_precondition`, 400 — “a prerequisite is not met (for example, disabled billing)… Verify project billing status or account prerequisites.” The key's project is on the Free Tier | **Cause class confirmed** (CASE 3/4) |
| Region of the calling server | `/cdn-cgi/trace` shows `colo=HKG` for one client network. A colo alone does not prove which location Google attributes the request to | **Hypothesis only, not verified** |

### 1b. Regression check 6.2 → 6.5 (owner confirmed the key was not changed)

Production deployments (`wrangler pages deployment list`):
- `69508b59` — `e8e204b`, 6.2, the last version that worked.
- `8583adb3` — `2ce2914`, 6.5, failing.

`GET /api/chat` on both: `configured: true`, `model: gemini-3.8-flash`.

The exact upstream request was captured offline (fetch stubbed, no Google call) from `e8e204b`, `37f30b6` and `1f33ce9` with the same input:

| Item | 6.2 `e8e204b` | 6.5 `37f30b6` / hotfix `1f33ce9` |
| --- | --- | --- |
| URL | `…/v1beta/models/gemini-3.8-flash:generateContent` | identical |
| Method / auth | POST, `x-goog-api-key` | identical |
| Fallback | `gemini-3.6-flash` | identical |
| Body (system prompt, user part, history, knowledge, `generationConfig` = `maxOutputTokens 1800`, `responseMimeType application/json`, `thinkingLevel low`) | 6438 bytes | **byte-identical** |
| `x-goog-api-client` | `chemlab/6.2.0` | `chemlab/6.5.0` (only difference; a client-telemetry header) |
| Knowledge data (`src/lab/chemicals.js`, `reactions.js`, `curriculum.js`, `src/data/elements.js`) | — | unchanged |
| Changes in `chat.js` between versions | — | budget checks before and between calls (`96c0ecd`, `fb4636f`, `1f33ce9`), exported helpers; none touch the request |

**Finding: no code change between 6.2 and 6.5 alters the request sent to Google.** The first commits touching `/api/chat` after 6.2 are `96c0ecd` (M5 shared limits) and `fb4636f` (per-retry budget); they only decide *whether* to call. Not proven: whether something outside the repository changed between the two deployments, such as Cloudflare variables, the Google project state, or the network origin. Reading the Cloudflare project configuration through the API was not permitted in this session.

Not done on purpose: no billing change, no key change, no proxy/VPN, no change of where Functions run in order to change the region Google sees, and no repeated Gemini calls.

## 2. Software defects fixed

1. **P1 fail-open (security/cost).** `/api/chat` called Gemini when the key existed but no budget binding did. Now `consumeBudget` refuses without an exact Durable Object budget (or KV with `CHEMAI_ACCEPT_APPROX_BUDGET=on`). `/api/chat` answers `503 AI_BUDGET_NOT_CONFIGURED` with **0 upstream calls**. `costBudgetConfigured` is shared with `/api/feedback`.
2. **Quota charged before validation.** Invalid JSON or an empty message used to consume a budget unit. Now the request is validated first, then charged.
3. **Error mapping.** `400 FAILED_PRECONDITION` → `503 GEMINI_PRECONDITION_FAILED` with `reason` (`REGION_NOT_SUPPORTED` | `BILLING_REQUIRED` | `ACCOUNT_PRECONDITION`, derived from Google's message). It is never retried and never falls back to another model. `INVALID_ARGUMENT` stays `GEMINI_BAD_REQUEST`.
4. **Observability.** Every request is logged on one structured line, `{"event":"chemai.chat", requestId, model, activeModel, apiVersion, colo, upstreamStatus, upstreamCode, upstreamMessage (redacted), attempts, fallbackUsed, budgetUnits, quota, status, durationMs}`. The log never contains the key, headers, IP or conversation text. `requestId` is returned in error responses so a learner's report can be matched to a log line.
5. **Frontend.**
   - Configuration errors (`GEMINI_PRECONDITION_FAILED`, `GEMINI_AUTH_FAILED`, `AI_BUDGET_NOT_CONFIGURED`) show a plain notice with no useless “Thử lại” button.
   - Transient errors keep “Thử lại”.
   - A 65 s client timeout prevents endless loading.
   - The conversation is kept in all cases.

## 3. Verification (local, 2026-10-21)

| Test | Result |
| --- | --- |
| `scripts/test-chemai-api.mjs` (new cases: precondition ×4 reasons, structured redacted log, fail-open ×3 env shapes, validation before charge, 8 concurrent requests on budget 3 → exactly 3 upstream calls) | PASS |
| `scripts/test-feedback-api.mjs` | PASS, 20 checks |
| `npm run build` (incl. `npm run check`) | PASS |
| `node scripts/local-cloudflare-check.mjs` (real workerd, real `_headers`, quota Worker Durable Object; invalid key so Google refuses at no cost) | **PASS, 14/14**. New: no budget binding → `503 AI_BUDGET_NOT_CONFIGURED`; 8 concurrent chats on the real Durable Object with 4 units left → exactly 4 pass |
| `npm run check:browser` | **PASS, 362/362** (new: precondition notice without retry, overload → retry → answer, history kept) |
| `npm run check:a11y` | PASS, 100 scans |
| `npm audit --omit=dev --audit-level=high` | 0 vulnerabilities |
| Cloudflare Preview / production | **NOT RUN** (no credentials, needs owner approval) |
| Real Gemini call | **NOT RUN** |

## 4. Effect after deployment (expected)

Production has no `CHEMAI_BUDGET` binding (`/api/feedback` reports `enabled: false`). After this hotfix is deployed, ChemAI answers **`AI_BUDGET_NOT_CONFIGURED`** — disabled at the backend, safely — until the owner binds the budget. This is intended: it closes the P1.

## 5. Owner actions, in order

1. **Two safe checks that settle the regression question** (one question each, typed by the owner; a refused `FAILED_PRECONDITION` call produces no answer):
   1. Read Google's exact message. Run `npx wrangler pages deployment tail --project-name chemlab-edulab --environment production` (or use Dashboard → Functions → Real-time logs), ask one question on `chemlab-edulab.pages.dev`, and read the line `[ChemAI] Gemini upstream error 400 FAILED_PRECONDITION …`.
   2. Ask one question on the 6.2 deployment `https://69508b59.chemlab-edulab.pages.dev`. It runs the exact 6.2 code with today's production variables.
      - If it **also fails**, the cause is outside the code (account/project state or origin), and rolling back would not help.
      - If it **works**, there is a 6.5 regression to find. The request comparison above should then be repeated with the real production variables.
   3. Compare Settings → Variables and Secrets (Production) with what was set during 6.2 (names, `GEMINI_MODEL`, `GEMINI_FALLBACK_MODELS`, `GEMINI_THINKING_LEVEL`).
2. **Bind the exact budget** (needed regardless of the cause):
   1. Deploy `workers/chemai-quota` (`wrangler.toml.example`).
   2. In Pages → Settings → Bindings, add a Durable Object binding `CHEMAI_BUDGET` → `chemai-quota` / `QuotaCounter` (Preview first, then Production).
   3. Set `CHEMAI_DAILY_LIMIT_CHAT` to the daily number of Gemini calls you accept.
3. **Act on Google's exact message** from step 1. Billing is not recommended until that message shows it is required.
4. **Approve** the Preview run and then the production deployment of this hotfix (see `CLOUDFLARE_STAGING_VERIFICATION.md` §4 and `scripts/staging-smoke.mjs`).
