# ChemAI Groq — Production restoration (ChemLab 6.6.0)

Date: 2026-11-13/14 · Release commit `1447e6d` · Production deployment `56a6f0aa`

## Verdict

| Area | Status |
|---|---|
| ChemLab 6.6.0 code on Production | **DEPLOYED AND VERIFIED** |
| ChemAI code path (Groq, token quota, public mode) | **READY** (mock-tested; shipped, switched off) |
| ChemAI answering on the main site | **BLOCKED** — three owner actions, section 6 |
| Live Groq inference | **NOT RUN** |
| Rollback | not needed; target `afea91b9` (6.5.4) available |

Production serves 6.6.0 with ChemAI still locked, exactly as 6.5.4 behaved for visitors. No configuration, secret or Access policy was changed by the agent, and no real Groq call was made.

## 1. What was released

- `main` fast-forwarded `873417b` → `1447e6d` (no force, no merge commit).
- Production deployment `56a6f0aa`, built by the GitHub integration, success.
- Preview deployment `93683dd7` (same commit, `internal_testing`, behind Cloudflare Access).

Files changed since 6.5.4 (`873417b..1447e6d`):

| File | Change |
|---|---|
| `functions/api/chat.js` | Groq adapter, provider selection, public limits, input fitting, token reservation/reconciliation, anonymous session, quota in responses |
| `functions/api/_access.js` | every provider limited to `internal_testing`; `public` mode with its gate |
| `functions/api/_limits.js` | fixed-window counter, token buckets (`reserveTokens`, `settleTokens`, `peekTokens`) |
| `src/ai/chemAI.js`, `src/ai/chemAI.css` | new error codes; one line showing the remaining token budget |
| `scripts/test-chemai-groq.mjs`, `scripts/test-chemai-public.mjs` | new mock suites (16 + 25 checks) |
| `scripts/browser-smoke.mjs`, other test scripts | quota-line check; Gemini tests select the provider explicitly |
| `package.json`, `package-lock.json`, `src/appMeta.js`, `index.html`, `public/sw.js`, `public/manifest.webmanifest` | version 6.6.0, service-worker cache `chemlab-6.6.0-access-1` |
| `.dev.vars.example`, `scripts/validate-final-ui.mjs`, `scripts/local-cloudflare-check.mjs`, `scripts/chemai-eval.mjs` | configuration documentation and checks |
| `reports/chemlab-groq/*` | reports |

Learning, Practice, Exam, Virtual Lab, the Gemini adapter and the `chemai-quota` Worker are unchanged.

## 2. Token quota (replaces the question count)

There is no per-day question limit on the Groq path. Use is limited by tokens.

| Budget | Default | Variable |
|---|---|---|
| Per learner (anonymous session) per day | 20,000 | `CHEMAI_TOKENS_PER_CLIENT_DAY` |
| Per network address per day | 60,000 | `CHEMAI_TOKENS_PER_NETWORK_DAY` |
| Whole site per day | 100,000 | `CHEMAI_TOKENS_GLOBAL_DAY` |
| Whole site per minute | 6,000 | `CHEMAI_TOKENS_GLOBAL_MINUTE` |
| Input cap per request (estimated) | 2,500 | `CHEMAI_MAX_INPUT_TOKENS` |
| Output cap per request (reasoning included) | 1,600 | `GROQ_MAX_COMPLETION_TOKENS` |

Checked against the Groq limits for `openai/gpt-oss-120b` on the Developer tier as read on 2026-11-13: 8K tokens/minute, 200K tokens/day, 30 requests/minute, 1K requests/day. The defaults sit inside them. The account's actual tier was not verified.

**Accounting per request:**
1. Identify the learner: a random session id in an HttpOnly cookie, signed by the server (HMAC). A browser cannot mint, edit or reuse one across keys. No personal data is stored.
2. Estimate the input and reserve input + output cap in all four buckets, atomically per bucket in `CHEMAI_BUDGET`; if any bucket refuses, the earlier ones are refunded and no call is made.
3. Call Groq.
4. Charge exactly `usage.total_tokens` (reasoning tokens are part of it) and refund the rest.
5. Every retry first settles the failed attempt, then reserves in full again; without room the retry is not made.

**Attempts that report no usage:** provider answered with an error → 0 tokens; no answer at all (network, timeout) → the input estimate.

Spam protection, separate from the quota: 3 s cooldown, 20 requests/minute site-wide, one question in flight per network address (public mode), 200 upstream calls/day.

The learner sees: "Bạn còn 17.850 / 20.000 token hôm nay." The number comes from the server; nothing in the browser can change the budget.

## 3. Verification

| Check | Result |
|---|---|
| `npm run check` (project, chemistry 49, learning 242, questions 783, exam 84 + 850, UI 78, ChemAI suites) | PASS |
| Groq adapter mock | PASS 16 |
| Public mode + token quota mock (reservation, refund, retries, concurrency, forged cookies, cleared cookies, body-supplied limits, counter outage, input too long) | PASS 25 |
| Access control | PASS 15 |
| Chemistry guard | PASS 23 |
| Build | PASS |
| Browser smoke — Chromium | PASS 423/423 |
| Browser smoke — WebKit | PASS 423/423 |
| Browser smoke — Firefox | FLAKY: first run 422/423 (one console message in the PWA-upgrade journey), rerun 423/423 |
| Accessibility (axe, 104 scans) | PASS |
| PWA journeys (inside smoke) | PASS |
| Local Cloudflare runtime (workerd) | PASS 10/10 |
| Secret scan (source and `dist/`) | PASS — only the fake test key in test files |
| `npm audit` | 0 vulnerabilities |
| **Live Groq inference (3 chemistry questions)** | **NOT RUN** — Preview is behind Access; the agent cannot sign in and the Chrome extension was not connected |
| Token usage and latency from a real call | NOT RUN |

Mock PASS is not live PASS.

## 4. Production after release (real requests)

| Check | Result |
|---|---|
| `/`, `/sw.js`, `/manifest.webmanifest` | 200 |
| Page and service worker version | 6.6.0, cache `chemlab-6.6.0-access-1` |
| `GET /api/chat` | `release 6.6.0, access:false, configured:false` |
| `POST /api/chat` (anonymous) | 403 `AI_ACCESS_LOCKED`, no provider call |
| `POST /api/feedback` | 403 |
| Read-only journeys in Chromium, Firefox, WebKit: learner data kept across SW update, Practice answer saved, Virtual Lab pH 1.0 → 7.0, Learning renders, console clean | PASS (the script's one "only the 6.5.4 cache" line is a stale expectation: the caches present are only the 6.6.0 ones, which is correct) |
| Preview still behind Cloudflare Access | 302 |
| Gemini / Workers AI called | no code path: Workers AI has no reference; Gemini needs `CHEMAI_PROVIDER=gemini` |

Production configuration seen through the API (names and types only): `GROQ_API_KEY` (secret, present), `CHEMAI_PROVIDER` (secret, value unreadable), `" GEMINI_API_KEY"` (malformed name, never read), `CHEMAI_DAILY_NEURONS=6000` (unused), `CHEMAI_BUDGET` Durable Object, `AI` binding (unused). There is no old per-day question-limit variable; the Groq path ignores question counts in any case.

## 5. Not verified, and why

| Item | Reason |
|---|---|
| Production really selects Groq | `CHEMAI_PROVIDER` is a secret. Any value other than `groq` (or unset) switches Groq off. It only becomes visible once access is open (`provider` in the status). |
| ChemAI opens on the main site | Needs the owner's variables, section 6. |
| Quota with real token numbers | Needs one real call. The 3 chars/token estimate is uncalibrated. |

## 6. Conditions still missing (owner)

1. **Provider terms.** Groq's Services Agreement, as read on 2026-11-13, requires users aged 18+ and excludes consumer use; ChemLab's users are school students. `CHEMAI_PUBLIC_APPROVAL` is the owner's record that the terms allow the real audience. The agent did not set it and must not: it would be a compliance statement made on the owner's behalf.
2. **Live validation on Preview.** Signed in as the approved tester, open `https://feature-chemlab-groq-chemai.chemlab-edulab.pages.dev`, and ask in ChemAI:
   - Khối lượng của 0,5 mol H2SO4 là bao nhiêu gam? → 49 g
   - Cân bằng phương trình: Fe + O2 → Fe3O4 → 3Fe + 2O2 → Fe3O4
   - Tính pH của dung dịch HCl 0,01 M. → pH = 2

   Check the answers, the formula rendering and that the token line decreases. The agent can tail the deployment at the same time to record usage and latency.
3. **Production variables** (Dashboard → `chemlab-edulab` → Settings → Production), then redeploy `56a6f0aa` (Deployments → Retry deployment):

   | Variable | Value |
   |---|---|
   | `CHEMAI_PROVIDER` | delete it, or set it to `groq` |
   | `CHEMAI_ACCESS_MODE` | `public` |
   | `CHEMAI_PUBLIC_HOSTS` | `chemlab-edulab.pages.dev` |
   | `CHEMAI_PUBLIC_APPROVAL` | `groq:6.6.0` — only after condition 1 |

   After the redeploy `GET /api/chat` must show `access:true, configured:true, provider:"Groq"` and a `quota` object.

## 7. Remaining risks

- **Capacity.** One request reserves about 3,800 tokens of the 6,000/minute site budget, so in practice about one or two questions per minute for the whole site; others get "try again in a minute". This follows Groq's 8K tokens/minute on the Developer tier. A public launch for a class needs a higher tier, then higher `CHEMAI_TOKENS_GLOBAL_MINUTE`.
- **Output cap 1,600 including reasoning.** Long multi-step solutions may be cut and reported as incomplete; watch `reasoningTokens` in the logs.
- **Input cap 2,500 (estimated).** The system prompt alone is estimated at about 1,660, leaving little for history; older turns are dropped first. Calibrate after the first real call.
- Clearing cookies gives a new 20,000-token session; the network bucket (60,000) bounds that.
- A budget of fewer tokens than one reservation is refused although the line still shows a small remainder.
- Cooldown and per-minute caps are fixed windows.
- The session cookie is signed with the provider key unless `CHEMAI_SESSION_SECRET` is set; rotating the key resets sessions (not budgets per network).
- Anonymous questions are sent to a third-party processor; the site has no notice for that yet.

## 8. Rollback

- Switch ChemAI off: `CHEMAI_ACCESS_MODE=disabled` (or remove `CHEMAI_PUBLIC_APPROVAL`) and redeploy.
- Whole release: Dashboard → Deployments → `afea91b9` (6.5.4) → Rollback. Older target: `a522519a` (6.5.3).
- No deployment was deleted.

## 9. Git

- `origin/main` = `1447e6d`; `origin/feature/chemlab-groq-chemai` = `1447e6d` plus this report.
- No force push. No other EduLab repository touched.
