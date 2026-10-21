# ChemAI production hotfix — 6.5.0 (2026-10-21)

Symptom on `https://chemlab-edulab.pages.dev`: every ChemAI question returned
`400 FAILED_PRECONDITION` → `GEMINI_BAD_REQUEST`, attempts 1, no fallback. AI Studio
Playground answers normally with the same account.

## 1. Root cause analysis

| Candidate | Evidence | Verdict |
| --- | --- | --- |
| Model / endpoint / payload (code) | `GET /api/chat` on production: `configured: true`, `model: gemini-3.8-flash`. The official model list has `gemini-3.8-flash` and `gemini-3.6-flash` as stable models with a free tier. Endpoint `v1beta/models/{model}:generateContent`, `x-goog-api-key`. A malformed payload returns `INVALID_ARGUMENT`, and a wrong model returns `404 NOT_FOUND`, not `FAILED_PRECONDITION` | **Not the cause** (no evidence of a code defect) |
| Account prerequisite (Google) | Google's error reference: `failed_precondition`, 400 — “a prerequisite is not met (for example, disabled billing)… Verify project billing status or account prerequisites.” The key's project is on the Free Tier | **Cause class confirmed** (CASE 3/4) |
| Region of the calling server | `/cdn-cgi/trace` from the owner's network: `loc=VN`, `colo=HKG`. Pages Functions run in the serving data centre, so Google sees the request from Hong Kong, which is **not** on Gemini API's available-regions list (Vietnam is). AI Studio is called from the user's own location, so it works | **Most likely specific cause — high confidence, NOT yet confirmed.** Google's exact message is in the production Function logs, which the agent cannot read (no Cloudflare credentials) |

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

1. **Read Google's exact message.** Cloudflare dashboard → Workers & Pages → `chemlab-edulab` → production deployment → Functions → Real-time logs. Ask one question in ChemAI and read the line `[ChemAI] Gemini upstream error 400 FAILED_PRECONDITION …` (current code) or `chemai.chat … upstreamMessage …, colo` (after the hotfix). This confirms or refutes the region hypothesis.
2. **Bind the exact budget** (needed regardless of the cause):
   1. Deploy `workers/chemai-quota` (`wrangler.toml.example`).
   2. In Pages → Settings → Bindings, add a Durable Object binding `CHEMAI_BUDGET` → `chemai-quota` / `QuotaCounter` (Preview first, then Production).
   3. Set `CHEMAI_DAILY_LIMIT_CHAT` to the daily number of Gemini calls you accept.
3. **Resolve eligibility** (owner decision). If Google's message is about location or the free tier, the remedy Google itself names is enabling billing for the Gemini API project in Google AI Studio (Paid Tier). A Google AI Pro subscription does not do this. The budget from step 2 caps the number of calls, and you can also set a spending limit or budget alert in Google Cloud Billing. If you do not want billing, keep ChemAI disabled.
4. **Approve** the Preview run and then the production deployment of this hotfix (see `CLOUDFLARE_STAGING_VERIFICATION.md` §4 and `scripts/staging-smoke.mjs`).
