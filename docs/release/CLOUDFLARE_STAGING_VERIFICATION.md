# Cloudflare staging verification — ChemLab 6.5.0

Updated 2026-10-21. Covers AUD-004 / AUD-005 (EXR-003, EXR-006, EXR-007).

**Status: LOCAL RUNTIME VERIFIED — STAGING NOT RUN — LIVE GEMINI NOT RUN.** No Cloudflare resource was created, deployed or changed by the agent. Nothing below is a staging or live PASS.

## 1. Infrastructure inventory (from the repository)

| Item | Finding |
| --- | --- |
| Hosting | Cloudflare Pages, Git integration (`origin` = GitHub `chemlab-huu-nghia`). No Pages `wrangler.toml` in the repo; build output `dist/` (Vite), Functions in `functions/api/` |
| Routes | `/api/chat` (GET status, POST chat), `/api/feedback` (GET gate, POST rubric feedback); SPA files and `public/_headers` |
| Headers | `public/_headers`: CSP, `X-Frame-Options: DENY`, nosniff, Referrer-Policy, Permissions-Policy; `/sw.js` and manifest revalidated; `/assets/*` immutable; `/api/*` no-store |
| Quota Worker | `workers/chemai-quota/` — Durable Object `QuotaCounter`; template `wrangler.toml.example`; **not deployed** |
| Bindings expected by Functions | `GEMINI_API_KEY` (secret); `CHEMAI_BUDGET` (DO namespace, exact budget); optional `CHEMAI_QUOTA` (KV, approximate) + `CHEMAI_ACCEPT_APPROX_BUDGET=on`; optional `CHEMAI_LIMITER`; `CHEMAI_FEEDBACK=on`; `CHEMAI_DAILY_LIMIT_CHAT/FEEDBACK`; `GEMINI_MODEL`, `GEMINI_FALLBACK_MODELS`, `GEMINI_THINKING_LEVEL` |
| Local tooling | `.dev.vars.example` (placeholder key only). Wrangler is not a project dependency; it was run through `npx wrangler@4` (4.151.3) for local checks only |

Cloudflare documentation (Pages Functions → Bindings, read 2026-10-21): a Durable Object namespace from another Worker is bound in **Settings → Bindings → Add → Durable Object**; bindings and variables can be set for both **Production** and **Preview** environments; local development uses `wrangler dev` for the Worker plus `wrangler pages dev --do <BINDING>=<CLASS>@<SCRIPT>`. The page does not list a Rate Limiting binding for Pages, so `CHEMAI_LIMITER` stays optional.

## 2. Cost model of ChemAI (after 6.5.0 changes)

- **One budget unit = one upstream Gemini call.** `checkShared` charges the first call; chat retries and model fallbacks now call `consumeBudget` before every extra attempt (`functions/api/chat.js`, `functions/api/_limits.js`). Before this change one counted request could make up to 4 Gemini calls.
- Per-call size is bounded: chat input ≤ 4 000-character message + 10 × 2 600-character history + 3 200-character context, `maxOutputTokens` 1 800; feedback answer ≤ rubric limit, body ≤ 8 KB, `maxOutputTokens` 900, one attempt only.
- Feedback concurrency: ≤ 4 in flight per isolate (503 BUSY). Chat: burst limit per client per isolate.
- Daily cost ceiling ≈ `CHEMAI_DAILY_LIMIT_CHAT` × max cost of one chat call + `CHEMAI_DAILY_LIMIT_FEEDBACK` × max cost of one feedback call, for the model in `GEMINI_MODEL`. The DO budget is exact (single object per scope, transactional storage); KV is approximate and needs explicit acceptance.
- Thinking tokens: billing of reasoning (“thinking”) tokens depends on the model; keep `GEMINI_THINKING_LEVEL=low` and confirm the per-call cost in the staging usage report before setting production limits.
- Any budget error fails closed (429). Without `CHEMAI_BUDGET`/`CHEMAI_QUOTA`, chat keeps the 6.2 behaviour (per-isolate limits only) — configure the DO before relying on the budget.

## 3. Local runtime evidence (`node scripts/local-cloudflare-check.mjs`, 2026-10-21)

Real workerd runtime via `wrangler pages dev dist` + `wrangler dev` (quota Worker), invalid Gemini key (Google answers 400 → no billing):

| Check | Result |
| --- | --- |
| `scripts/staging-smoke.mjs` against the local runtime: home 200, version 6.5.0, CSP + frame-ancestors, X-Frame-Options/nosniff, sw.js revalidated and named `chemlab-6.5.0`, manifest type, immutable assets, `/api/chat` no-store + release 6.5.0, `/api/feedback` gate, cross-origin POST 403 | **12/12 PASS** |
| Feedback limit 2: 502, 502, then **429** | PASS |
| Chat limit 3: 502 ×3, then **429** | PASS |
| Quota Worker stopped, limit 50 (not exhausted): feedback **429**, chat **429** (fail closed) | PASS |
| Quota Worker restarted on its stored state: requests pass again | PASS |
| Total | **12/12 PASS** |

Unit/mock evidence (`npm run check:ai`): 20 feedback/limit checks incl. “every chat retry is charged and stops when the budget is spent”, DO unreachable → 429, KV needs acceptance, concurrency cap.

Note: force-stopped local dev processes leave entries in wrangler's dev registry that break cross-process DO bindings (the binding then fails closed). The script removes only the entries it created. This is a local tooling effect, not a production behaviour.

## 4. Staging plan (requires one owner approval — NOT RUN)

Staging = a Pages **Preview** deployment (non-production branch) with Preview-only bindings; production settings untouched.

1. Deploy the quota Worker: `cd workers/chemai-quota && cp wrangler.toml.example wrangler.toml && npx wrangler@4 deploy` (owner's account; creates Worker `chemai-quota` with DO class `QuotaCounter`).
2. Pages project → Settings → Bindings → **Preview**: Durable Object `CHEMAI_BUDGET` → `chemai-quota` / `QuotaCounter`. Variables (Preview): `CHEMAI_FEEDBACK=on`, `CHEMAI_DAILY_LIMIT_FEEDBACK=5`, `CHEMAI_DAILY_LIMIT_CHAT=20`; secret `GEMINI_API_KEY` (a key with a small Google-side quota is preferable).
3. Push branch `evolution/next` (creates `https://evolution-next.<project>.pages.dev`; does not touch production while the production branch is `main`).
4. `node scripts/staging-smoke.mjs https://evolution-next.<project>.pages.dev` → expect 12/12.
5. `node scripts/staging-smoke.mjs <url> --ai` → one real feedback request (cost: one call).
6. Budget: send requests until 429; Gemini usage in Google AI Studio must equal the number of allowed calls.
7. Binding failure: remove the Preview DO binding (or point it to a missing class), redeploy → `/api/feedback` POST 429, no Gemini call.
8. PWA: follow `docs/release/PWA_6_2_TO_6_5_UPGRADE.md` §5 on the preview URL and on two phones.
9. Record request IDs, screenshots and Gemini usage here; only then mark G6/G7.

Rollback of staging: delete the preview deployment, remove Preview bindings/variables, `npx wrangler@4 delete chemai-quota` if the Worker is not kept.

## 5. Outstanding

| Gate | Needs |
| --- | --- |
| G6 Cloudflare | Owner approval for steps 1–3, then steps 4, 7 |
| G7 ChemAI | Steps 5–6 with a real key; keep `CHEMAI_FEEDBACK` off in Production until then |
| Device PWA/CSP | Step 8 |
