# ChemAI Groq — Preview deployment (locked)

Date: 2026-11-13 · Branch `feature/chemlab-groq-chemai` · Code commit `5d3f9da`

**Verdict: GROQ PREVIEW DEPLOYED — LOCKED; access configuration (Access AUD, allowlist, internal_testing) missing before a live call.**

> **Correction (same day):** the first version of this report stated that `CHEMAI_BUDGET` was missing. That was wrong. The inspection script printed `env_vars`, `ai_bindings`, `kv_namespaces` and `d1_databases`, but never `durable_object_namespaces`. Re-checked through the API:
>
> - Preview config, Production config and the `66052d2f` deployment snapshot all contain `CHEMAI_BUDGET → namespace d435a6efcd7d4a08ad6189c717e7b25c`.
> - That id is `chemai-quota/QuotaCounter`.
> - There is no `wrangler.toml` that could override it.
>
> The binding was already in place when `66052d2f` was created (2026-11-13T14:38Z), because the snapshot holds it.

No Groq inference has been performed. The API key value was never read or printed: the Cloudflare API does not return secret values, and only the name and type were checked.

## 1. Deployment

| Item | Value |
|---|---|
| Deployment | `66052d2f` (preview, `uses_functions=true`) |
| Alias | `https://feature-chemlab-groq-chemai.chemlab-edulab.pages.dev` |
| Built from | `5d3f9da`, `npm run build` (prebuild check PASS) |
| `dist/` scan for `gsk_`, `GROQ_API_KEY`, `api.groq.com` | 0 hits |
| `wrangler.toml` | none; Dashboard config is authoritative |

## 2. Cloudflare configuration (verified through the API; names and types only)

| Variable or binding | Preview | Production |
|---|---|---|
| `GROQ_API_KEY` | secret_text, exact name, no whitespace | — |
| `CHEMAI_PROVIDER` | unset → code default **groq** | secret (value unreadable); prod runs 6.5.4 code (Gemini-only) |
| `CHEMAI_BUDGET_SCOPE` / `CHEMAI_DAILY_NEURONS` | `preview` / `2000` | — / `6000` |
| `CHEMAI_ACCESS_MODE` | **missing** → `disabled` | missing → `disabled` |
| `CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD`, `CHEMAI_APPROVED_EMAILS`, `CHEMAI_INTERNAL_HOSTS` | **missing** | missing |
| `CHEMAI_BUDGET` (Durable Object) | present → `chemai-quota/QuotaCounter`; also in the `66052d2f` snapshot | present (same namespace) |
| `CHEMAI_QUOTA` (KV) | not set (not needed when the DO is bound) | not set |
| `AI` (Workers AI binding) | present, unused | present, unused by 6.5.4 |

The deployment snapshot of `66052d2f` contains:
- env vars `CHEMAI_BUDGET_SCOPE`, `CHEMAI_DAILY_NEURONS` and `GROQ_API_KEY`;
- bindings `CHEMAI_BUDGET` (DO) and `AI`.

**Workers AI inventory:** Groq-branch Functions contain 0 references to `env.AI`. The `AI` binding is left unchanged. Removing it would affect only old Workers-AI preview deployments, which are already behind Cloudflare Access. Leaving it costs nothing because no code calls it.

**Existing resources:**
- Worker `chemai-quota` with Durable Object class `QuotaCounter` exists in the account, and it is bound to Pages as `CHEMAI_BUDGET`.
- There are no KV namespaces.
- The Cloudflare Access app list is empty through the OAuth token, most likely because the token has no Access scope. The redirect still carries the application AUD: 64 hex characters, starting `521895…`, identical on the alias and the hash URL.

## 3. Lock verification (anonymous, real network)

| Request | Result |
|---|---|
| GET/POST `/api/chat`, GET `/api/feedback`, GET `/` on alias and hash URL (8 requests) | 302 → `chemlab-edulab-pages.cloudflareaccess.com` login |
| POST `/api/chat` with a forged `Cf-Access-Jwt-Assertion` | 302 → Access login |
| `wrangler pages deployment tail 66052d2f` during the probes | 0 Function events, 0 mentions of `groq` or `gsk_` (no positive control; supporting evidence only) |

**Defence in depth: if Access were bypassed, the Function would still refuse.**
- The mode is `disabled`, so the response is 403 `AI_ACCESS_LOCKED` before any provider call.
- This is covered by `test-chemai-access.mjs` and the local workerd check, 10/10 with a fake Groq key.
- Access is the only gate still closed: the budget binding is present, so once access is configured an approved request would reach Groq.

**Production is unchanged.**
- The canonical deployment is still `afea91b9`.
- `GET https://chemlab-edulab.pages.dev/api/chat` returns `{"release":"6.5.4","access":false,"configured":false}`.
- `/` returns 200.

## 4. Missing configuration — owner steps (Preview environment only)

Set these in Dashboard → Workers & Pages → `chemlab-edulab` → Settings → **Preview**. Do not edit Production.

1. **Budget binding** — already present (`CHEMAI_BUDGET`). Do **not** add another.
2. **Variables (plain text)**

   | Name | Value |
   |---|---|
   | `CHEMAI_ACCESS_MODE` | `internal_testing` |
   | `CHEMAI_INTERNAL_HOSTS` | `feature-chemlab-groq-chemai.chemlab-edulab.pages.dev` |
   | `CF_ACCESS_TEAM_DOMAIN` | `https://chemlab-edulab-pages.cloudflareaccess.com` |
   | `CF_ACCESS_AUD` | the "Application Audience (AUD) Tag" from Zero Trust → Access → Applications → the Pages app. It should start `521895`. |
   | `CHEMAI_APPROVED_EMAILS` | comma-separated emails of **adult (18+) internal testers** only |

   - Optional: `GROQ_MODEL` (default `openai/gpt-oss-120b`) and `GROQ_REASONING_EFFORT` (default `low`).
   - Do not set `CHEMAI_PROVIDER` to anything other than `groq`.
3. **Access policy**
   - The Access application's Allow policy must include those same tester emails.
   - The two lists are independent layers: an email must pass both.
4. **Redeploy**
   - Pages snapshots env vars per deployment, so `66052d2f` will never see the new values.
   - Ask me to redeploy the branch after steps 2–3.
5. **Live-call precondition (owner/legal)**
   - Groq's Services Agreement requires users to be 18 or older, and the service is not for consumer use.
   - Confirm that every tester is an adult staff member. ChemAI stays closed to students: `student_access` is refused in code.

Notes:
- The Preview env vars apply to every preview branch. That is safe here: `CHEMAI_INTERNAL_HOSTS` names only the Groq alias, and 6.5.4-branch code treats an unset provider as off.
- Hash URLs such as `66052d2f.…` are deliberately not in `CHEMAI_INTERNAL_HOSTS`, so they stay locked.

## 5. After configuration (planned; NOT RUN)

1. Redeploy and run the anonymous probe again: expect 302.
2. Have a signed-in **unapproved** account call `GET /api/chat`: expect `access:false`, and a POST should return 403 with 0 provider calls.
3. Have a signed-in approved tester call `GET /api/chat`: expect `access:true` and `configured:true`. This step makes no inference.
4. One owner-approved live question, with tail running: check the answer, Markdown/KaTeX rendering, and that the key never appears in logs.

## 6. Status

| Check | Status |
|---|---|
| Preview deploy | PASS |
| Anonymous / forged-JWT lock | PASS |
| Function not invoked (tail) | PASS (no control) |
| Production unchanged | PASS |
| Approved / unapproved signed-in checks | BLOCKED (configuration missing) |
| Live Groq inference | NOT RUN (by design) |

Nothing was pushed or merged to `main`. No Production deploy, secret or Access change was made. The Workers AI binding was not touched.

## 7. Redeploy with internal_testing configuration (2026-11-13 ~15:23Z) — BLOCKED

**Preview configuration, re-verified through the API** (names and types only; no secret values read):

| Name | Type | Check |
|---|---|---|
| `CF_ACCESS_AUD` | plain_text | 64 hex characters; **equals** the AUD in the live Access login redirect |
| `CF_ACCESS_TEAM_DOMAIN` | plain_text | `https://chemlab-edulab-pages.cloudflareaccess.com`; **equals** the redirect origin |
| `CHEMAI_ACCESS_MODE` | plain_text | `internal_testing` |
| `CHEMAI_INTERNAL_HOSTS` | plain_text | `feature-chemlab-groq-chemai.chemlab-edulab.pages.dev` |
| `CHEMAI_APPROVED_EMAILS` | plain_text | 1 entry, well-formed (value not reported) |
| `CHEMAI_BUDGET_SCOPE` / `CHEMAI_DAILY_NEURONS` | plain_text | `preview` / `2000` |
| `GROQ_API_KEY` | secret_text | present |
| `CHEMAI_BUDGET` | Durable Object | `chemai-quota/QuotaCounter`, present once (nothing added) |

No variable name contains whitespace.

**Deploy:**
- Build of `7e1a5c7` PASS; `dist/` key scan 0 hits.
- Three `wrangler pages deploy` attempts all failed at the publish stage:

  | Deployment | Error |
  |---|---|
  | `385c507d` | `Failed to publish your Function. Got error: Unknown internal error occurred.` |
  | `b2df561c` | same |
  | `306a8411` | same |

- Each failed snapshot holds the new variables and `CHEMAI_BUDGET`.
- The only difference from the successful `66052d2f` is the five new access variables; the Functions bundle is identical.
- Cloudflare Status at that time reported **Workers: degraded_performance**.
- Root cause is **not confirmed**. Strong hypothesis: a platform-side issue. Unverified possibility: something in the new Dashboard values that the publisher rejects.
- Retries stopped after 3 attempts.

**State after the attempts:**
- The alias still serves `66052d2f`, which has the old env (mode `disabled`). Anonymous access → 302 to Access.
- Production is unchanged: `release 6.5.4`, `access:false`, `configured:false`.
- The failed deployments were left in place; deleting them needs owner approval.

| Step | Status |
|---|---|
| Configuration names, types, AUD, domain, budget binding | PASS |
| New Preview deploy | BLOCKED (Cloudflare publish error) |
| Runtime snapshot of a live new deployment | BLOCKED |
| Anonymous blocked (current alias) | PASS |
| Unapproved signed-in → 403 | BLOCKED (no new deployment; needs the owner's browser session) |
| Approved → `access:true`, `configured:true` | BLOCKED (same) |
| Live Groq inference | NOT RUN (by design) |
