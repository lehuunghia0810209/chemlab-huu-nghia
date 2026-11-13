# ChemAI Groq — Preview deployment (locked)

Date: 2026-11-13 · Branch `feature/chemlab-groq-chemai` · Code commit `5d3f9da`

**Verdict: GROQ PREVIEW DEPLOYED — LOCKED; 3 configuration items missing before a live call.**

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
| `CHEMAI_BUDGET` (Durable Object) / `CHEMAI_QUOTA` (KV) | **missing** → chat answers 503 `AI_BUDGET_NOT_CONFIGURED` | missing |
| `AI` (Workers AI binding) | present, unused | present, unused by 6.5.4 |

The deployment snapshot of `66052d2f` contains exactly `CHEMAI_BUDGET_SCOPE`, `CHEMAI_DAILY_NEURONS` and `GROQ_API_KEY`.

**Workers AI inventory:** Groq-branch Functions contain 0 references to `env.AI`. The `AI` binding is left unchanged. Removing it would affect only old Workers-AI preview deployments, which are already behind Cloudflare Access. Leaving it costs nothing because no code calls it.

**Existing resources:**
- Worker `chemai-quota` with Durable Object class `QuotaCounter` exists in the account, but it is not bound to Pages.
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
- Even with access configured, the missing budget binding stops the request with 503 before any fetch to Groq.

**Production is unchanged.**
- The canonical deployment is still `afea91b9`.
- `GET https://chemlab-edulab.pages.dev/api/chat` returns `{"release":"6.5.4","access":false,"configured":false}`.
- `/` returns 200.

## 4. Missing configuration — owner steps (Preview environment only)

Set these in Dashboard → Workers & Pages → `chemlab-edulab` → Settings → **Preview**. Do not edit Production.

1. **Budget binding**
   - Bindings → Add → Durable Object namespace.
   - Variable name `CHEMAI_BUDGET`, namespace `chemai-quota` / `QuotaCounter`.
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
   - Ask me to redeploy the branch after steps 1–3.
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
