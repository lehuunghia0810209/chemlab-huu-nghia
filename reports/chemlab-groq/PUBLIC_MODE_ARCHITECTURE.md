# ChemAI — unified public-ready architecture

Date: 2026-11-13 · Branch `feature/chemlab-groq-chemai` (local, on top of `360c533`)

**Verdict: PUBLIC MODE IMPLEMENTED AND MOCK-TESTED — NOT ACTIVATED.** One ChemAI, one UI, one `/api/chat`. No deployment, Production change, secret change or live Groq call was made in this task.

## 1. One assistant, three operating modes

| `CHEMAI_ACCESS_MODE` | Who can ask | Use |
|---|---|---|
| `disabled` (default, and any unknown value) | nobody | emergency stop, rollback |
| `internal_testing` | Access-verified, allowlisted identity on a listed preview host | testing (current Preview, unchanged) |
| `public` | anonymous visitors, chat route only | the product mode, after an approved release |

`approved_users` and `student_access` keep their previous behaviour (locked). There is no second chatbot, site or UI: the same panel calls the same endpoint in every mode.

## 2. The public gate (requirement 11)

Setting `CHEMAI_ACCESS_MODE=public` alone opens nothing. All of these must hold, otherwise the answer is the usual 403 `AI_ACCESS_LOCKED`:

| Condition | Purpose |
|---|---|
| `CHEMAI_PUBLIC_APPROVAL` equals `<provider>:<release>`, e.g. `groq:6.6.0` | The owner's record that this provider's terms allow the real audience. It is tied to one provider and one release: a new build or a provider switch closes ChemAI again until re-approved. |
| Request host is listed in `CHEMAI_PUBLIC_HOSTS` | Preview and stray hosts never become public by accident. |
| `CHEMAI_BUDGET` Durable Object is bound | Public traffic needs the exact counter; the approximate KV budget is refused. |
| Provider key present, model on the allowlist | Existing fail-closed checks. |

The feedback route never opens in public mode. Anonymous status responses carry no configuration warnings.

## 3. Quotas and abuse controls (requirements 8, 9)

All counters live in `CHEMAI_BUDGET`. The client key is the network address Cloudflare reports (IPv6 grouped by /64). Nothing sent by the browser (cookies, session ids, `X-Forwarded-For`) is trusted, so there is no browser "session" quota to reset.

| Control | Default | Server variable |
|---|---|---|
| Questions per guest per day | 5 | `CHEMAI_PUBLIC_DAILY_LIMIT_PER_CLIENT` |
| Cooldown between questions per guest | 10 s | `CHEMAI_PUBLIC_COOLDOWN_SECONDS` |
| Site-wide questions per day | 200 | `CHEMAI_DAILY_LIMIT` |
| Site-wide questions per minute | 20 (Groq allows 30) | `CHEMAI_PUBLIC_REQUESTS_PER_MINUTE` |
| Questions in flight per guest | 1 | — |
| Concurrent model calls per isolate | 6 (existing) | — |
| Retries | each charged to the site-wide budget (existing) | — |

Order per request: origin check → burst limit → size limits → configuration → safety gate (no charge) → in-flight check → cooldown → per-minute cap → guest daily limit → site-wide daily budget → Groq.

Known limits:
- The cooldown and per-minute cap are fixed windows, so two requests can straddle a window edge. A sliding window needs a change and redeploy of the `chemai-quota` Worker, which was out of scope (it is shared with Production).
- Visitors behind one shared address (a school network) share the 5/day allowance. Raising the limit is a variable change.

## 4. Token control for `openai/gpt-oss-120b` (requirements 6, 7)

Groq counts prompt plus `max_completion_tokens` against the per-minute token limit (8K on the Developer tier), so both sides are bounded.

**Deterministic preprocessing (Groq path):**
- Question text: invisible characters, repeated spaces and 3+ blank lines are removed. Digits, symbols, units and line structure are untouched (tested character-for-character).
- Interface context: empty values, the URL hash and the app version are dropped.
- History: exact repeats are dropped; public mode sends at most 6 turns.
- If the estimated input is still over `CHEMAI_MAX_INPUT_TOKENS` (default 3600), cuts happen in a fixed order: scraped screen text to 800 characters → oldest history turns (the last question/answer pair stays) → scraped screen text and progress → remaining history.
- **Never cut:** the question, the retrieved ChemLab knowledge (computed from the full context first), and the structured state (`element`, `chemFlow`, `learning`, `lab`).

History is not filtered by "relevance": a deterministic rule cannot tell whether an older turn holds a number the new question depends on, so only repeats and the oldest turns under budget pressure are removed.

**Output:**
- `max_completion_tokens` from `GROQ_MAX_COMPLETION_TOKENS` (default 4096, clamped 512–8192). Reasoning tokens count against it; `reasoning_effort` stays `low` and reasoning text is not returned.
- A cut-off answer (`finish_reason: length`) is reported as `AI_INCOMPLETE`, never shown as a fragment. Prompt, completion and reasoning tokens are logged, so a truncation caused by reasoning is visible.
- Groq 413 (over the token-per-minute limit) now maps to `AI_INPUT_TOO_LARGE` with a "ask shorter / start a new chat" message, not retried.

The token estimate (2.5 characters per token) is deliberately pessimistic and **not calibrated**: no live call has been made. The first live test will show real `prompt_tokens` to tune the two variables.

## 5. Changes

| File | Change |
|---|---|
| `functions/api/_access.js` | `public` mode and its gate |
| `functions/api/_limits.js` | `consumeWindow` (cooldown / per-minute on the existing counter) |
| `functions/api/chat.js` | public limits in `chargeChat`, `fitInput`, `compactText`, `pruneEmpty`, configurable output cap, reasoning-token logging, 413 mapping |
| `src/ai/chemAI.js` | two new error codes recognised (`AI_COOLDOWN`, `AI_INPUT_TOO_LARGE`); no UI change |
| `scripts/test-chemai-public.mjs` | new, 19 checks |
| `scripts/test-chemai-groq.mjs` | 413 expectation updated |
| `package.json`, `.dev.vars.example` | suite added to `check:ai`; variables documented |

Unchanged: Gemini adapter (kept, no automatic fallback), UI, Markdown/KaTeX, Learning, Practice, Exam, Virtual Lab, the `chemai-quota` Worker, Cloudflare configuration.

## 6. Verification (all local, mocked)

| Check | Result |
|---|---|
| `test-chemai-public.mjs` — gate (9 ways the flag alone fails), anonymous answer, cooldown, 5/day, spoofed headers / cookies / IPv6 rotation, site-wide day and minute caps, concurrency, budget outage, cross-origin, oversized body, safety gate, request shape, truncated/empty answers, lossless clean-up, input fitting, other modes locked | PASS 19 |
| `test-chemai-groq.mjs` | PASS 16 |
| `test-chemai-access.mjs` | PASS 15 |
| `npm run build` (prebuild `npm run check`: Gemini mock, feedback 20, rendering 11, eval grader 9, guard 23, UI validation…) | PASS |
| `local-cloudflare-check.mjs` (workerd) | PASS 10/10 |
| `dist/` scan for `gsk_`, `GROQ_API_KEY`, `api.groq.com`, `CHEMAI_PUBLIC` | 0 hits |
| Browser smoke (Chromium/Firefox/WebKit), accessibility | NOT RUN for this change (frontend delta is two entries in an error-code set); last full run was on `5d3f9da` |
| Public mode on a deployed runtime | NOT RUN |
| Live Groq inference | NOT RUN |

## 7. Blockers before public mode can go to Production

1. **Provider terms for the real audience.** Groq's Services Agreement, as read on 2026-11-13, requires users aged 18+ and excludes consumer use. ChemLab's audience is school students. Until the owner obtains terms that cover that audience (a different Groq agreement, written permission, or another provider), `CHEMAI_PUBLIC_APPROVAL` must stay unset. This is the decisive blocker; the code cannot resolve it.
2. **Live calibration.** The 3-question internal test (approved in principle; tester's age/role still unconfirmed by the owner) is needed to measure real token usage and latency.
3. **Capacity.** 200 questions/day and 20/minute fit the Developer tier (1K requests/day, 30/minute, 8K tokens/minute). The token-per-minute limit allows roughly one full-size answer per minute at worst case; real capacity must be measured, and a higher tier may be needed.
4. **Release gates.** Version bump (service-worker cache), full browser smoke and accessibility on the release candidate, a Preview soak of public mode on a dedicated host, and privacy wording for anonymous use (questions are sent to a third-party processor).
5. **Optional hardening.** Sliding-window cooldown in the quota Worker; bot protection (e.g. Turnstile) if abuse appears.

## 8. Activation runbook (for a later, approved release — not executed)

1. Resolve blocker 1 and record the decision.
2. Release a version containing this code; run the release gates.
3. In the target environment set `CHEMAI_PUBLIC_HOSTS`, the limit variables if different from defaults, then `CHEMAI_PUBLIC_APPROVAL=groq:<that release>`, then `CHEMAI_ACCESS_MODE=public`, and redeploy.
4. Rollback: set `CHEMAI_ACCESS_MODE=disabled` (or remove the approval) and redeploy, or roll back to the previous deployment.
