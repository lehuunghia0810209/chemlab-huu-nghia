# ChemLab 6.5.0 — release checklist and production playbook (NOT executed)

Status 2026-10-21: version **6.5.0** synced on branch `evolution/next` (local commits only). **Nothing has been pushed, merged or deployed.** Production (`origin/main`, last commit 2026-10-19) still serves 6.2.0. Every action in §3–§6 needs the owner's explicit approval.

## 1. Release gates

| Gate | Standard | Status | Evidence |
| --- | --- | --- | --- |
| G1 Source code | build + regression PASS | **PASS (local)** | `docs/release/FINAL_6_5_0_COMPLETION.md` §QA |
| G2 Exam integrity | 8 papers verified in release scope | **PASS with conditions** — 2025/2026 printed originals not compared (editorial notes shown) | `docs/exam/EXAM_RELEASE_MATRIX.md` |
| G3 Exam scoring | scores, autosave, timer | **PASS (local)** | `npm run check:exam`, browser journeys B–I, R2 |
| G4 PWA | 6.5.0 + migration | **PASS (local)** — real devices NOT RUN | `docs/release/PWA_6_2_TO_6_5_UPGRADE.md` |
| G5 Security | no open P0/P1 | **PASS (local)** — headers on staging NOT RUN | CSP journey, `npm audit` 0, bundle secret scan |
| G6 Cloudflare | staging bindings/routes | **NOT RUN** (local runtime 12/12) | `docs/release/CLOUDFLARE_STAGING_VERIFICATION.md` |
| G7 ChemAI | live staging PASS before enabling | **NOT RUN** — feedback stays off | same |
| G8 Educational review | human sign-off for the published scope | **OPEN** (0 sign-offs) | `docs/learning/TEACHER_REVIEW_REGISTER.md`, `docs/review/TEACHER_REVIEW_PACKET_6.5.md` |
| G9 Authorization | owner attestation respected | **OWNER_ATTESTED** (licence not seen) | `docs/exam/EXAM_SOURCES.md` §0 |
| G10 Owner approval | public deployment allowed | **OPEN** | — |

## 2. Version and cache

`package.json` is the single source; `npm run release:sync` (also run by `prebuild`) rewrites `src/appMeta.js`, `index.html`, `public/manifest.webmanifest` and `public/sw.js` (`VERSION` → cache namespace `chemlab-6.5.0-brand-1`). Already done on the branch; `npm run build` reproduces it with no diff. Upgrade behaviour and tests: `PWA_6_2_TO_6_5_UPGRADE.md`.

## 3. Cloudflare configuration (owner — dashboard or wrangler, never in Git)

| Name | Type | Production (6.5.0 launch) | Preview (staging) |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | Secret | existing | staging key with small Google quota |
| `CHEMAI_BUDGET` | Durable Object → Worker `chemai-quota`, class `QuotaCounter` | **bind before relying on chat budget** | bind |
| `CHEMAI_DAILY_LIMIT_CHAT` / `_FEEDBACK` | Var (Gemini calls per day; retries count) | set from cost estimate | 20 / 5 |
| `CHEMAI_FEEDBACK` | Var | **leave unset (off)** until G7 | `on` |
| `CHEMAI_QUOTA`, `CHEMAI_ACCEPT_APPROX_BUDGET` | KV + Var | not needed with the DO | not needed |
| `CHEMAI_LIMITER` | Rate Limiting | optional (not listed for Pages) | optional |

Cost model and the per-call budget: `CLOUDFLARE_STAGING_VERIFICATION.md` §2.

## 4. Staging (one approval for all steps)

`CLOUDFLARE_STAGING_VERIFICATION.md` §4: deploy quota Worker → Preview bindings → push `evolution/next` (preview URL) → `node scripts/staging-smoke.mjs <url>` (+ `--ai`) → budget/binding-failure cases → PWA on devices → record evidence → mark G6/G7.

## 5. Production playbook (owner executes)

### Before deployment
1. Final commit chosen on `evolution/next`; `git status` shows only the owner's own files (`AGENTS.md`, `.gitignore`, `.claude/`), decide whether they ship.
2. `npm ci && npm run build && npm run check:browser && npm run check:a11y && npm audit --omit=dev --audit-level=high` — all PASS; `git diff` clean after build (release:sync idempotent).
3. Version: `package.json` 6.5.0; `dist/sw.js` contains `chemlab-6.5.0-brand-1`.
4. Bindings (§3) set for **Production**; `CHEMAI_FEEDBACK` absent; Worker `chemai-quota` deployed if `CHEMAI_BUDGET` is bound.
5. Exam selection made (`EXAM_RELEASE_MATRIX.md`); DTT 2–4 blocked.
6. Rollback target noted: current production deployment ID in Pages → Deployments (6.2.0, commit `e8e204b`).
7. G8/G10 decisions recorded.

### Deployment (Pages Git integration)
1. Merge `evolution/next` into `main` (owner, after review) and push `main`; Pages builds with the project's build settings (`npm run build`, output `dist`).
2. Watch the build log in Pages → Deployments; do not change settings during the build.

### After deployment (within 30 minutes)
1. `node scripts/staging-smoke.mjs https://<production-host>` → 12/12 (no `--ai`).
2. Open Home, Learning lesson, Practice, Exam catalog + one paper (start, answer, reload, submit), Virtual Lab, Periodic + Atomic Explorer, ChemAI panel; DevTools console: no `Refused to …` (CSP), no 404.
3. PWA: from a browser with the 6.2 app, close all tabs, reopen → Cache Storage only `chemlab-6.5.0-brand-1-*`, progress present.
4. Monitor: Pages Functions logs (errors, 429 rate), Google AI Studio usage vs `CHEMAI_DAILY_LIMIT_*`.

### Recovery
| Situation | Action |
| --- | --- |
| Site broken / CSP violations block features | Pages → Deployments → previous deployment → **Rollback**. The 6.2.0 worker re-installs on next visits; learner data stays (tested, `PWA_6_2_TO_6_5_UPGRADE.md` H). |
| ChemAI cost or abuse | Remove `CHEMAI_FEEDBACK` (feedback off) and/or lower `CHEMAI_DAILY_LIMIT_CHAT` (e.g. 1); redeploy. Emergency: remove the `GEMINI_API_KEY` secret → chat answers “chưa cấu hình”. |
| Quota Worker failing | Requests fail closed (429). Fix or `npx wrangler@4 rollback` in `workers/chemai-quota`; Pages needs no change. |
| An exam paper must be withdrawn | Remove one required state (e.g. `UI_TESTED`) from its entry in `src/exam/catalog.js`, build, deploy; sessions in progress show the paper as not available, results stay stored. |
| Old cached clients | Nothing to do: `sw.js` is revalidated on every load; activation deletes old caches. |
| Leaked secret | Rotate in Google AI Studio, update the Pages secret, redeploy; never paste keys into issues or docs. |

## 6. Never

Push/merge/deploy without approval; enable `CHEMAI_FEEDBACK` in Production before G7; publish DTT 2–4; label a paper “đề chính thức” outside its kind; record a teacher sign-off that did not happen.
