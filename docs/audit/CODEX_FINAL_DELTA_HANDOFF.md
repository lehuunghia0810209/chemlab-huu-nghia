# Codex final delta handoff — ChemLab 6.5.0

Prepared by the implementing agent (Claude Code), 2026-10-21. **Not an audit result.** Baseline: Codex final audit at `94b9a40` (`D:\ChemLab-6_5-final-audit`, verdict TECHNICAL PASS — PUBLIC RELEASE CONDITIONAL NO-GO). Only the changes below need independent verification; the rest of 6.5 is unchanged.

## 1. Changed files since `94b9a40`

| Area | Files | Change |
| --- | --- | --- |
| Version 6.5.0 (AUD-007) | `package.json`, `package-lock.json` (root fields), and via `npm run release:sync`: `src/appMeta.js`, `index.html`, `public/manifest.webmanifest`, `public/sw.js` | 6.2.0 → 6.5.0; SW cache namespace `chemlab-6.5.0-brand-1` |
| ChemAI default version | `src/ai/chemAI.js` | default `version` = `APP_VERSION` (was a literal `'6.2.0'`; callers already passed `APP_VERSION`) |
| Cost control (G7) | `functions/api/_limits.js`, `functions/api/chat.js` | new `consumeBudget`; `checkShared` = limiter + `consumeBudget`; chat calls `consumeBudget` before every retry/fallback attempt (`beforeRetry`), so one budget unit = one Gemini call |
| Editorial notes (AUD-006) | `src/exam/papers/tot-nghiep-2025-hoa.js`, `tot-nghiep-2026-hoa.js`, `src/exam/validate.js`, `src/exam/examApp.js` | `editorialNote` (optional string, validated) shown as “Ghi chú biên tập” on the preparation page; **no question, key or `dataVersion` changed** |
| Tests | `scripts/test-feedback-api.mjs` (+1: retries charged and stopped by the DO budget), `scripts/test-chemai-api.mjs` (version assertion follows `APP_VERSION`), `scripts/test-exam-papers.mjs` (+2: retyped Ministry papers carry an editorial note), `scripts/lib/pwa-upgrade-journeys.mjs` (rewritten: real SW lifecycle 6.2 → 6.5, 10 checks) | — |
| New tools | `scripts/staging-smoke.mjs` (deployed-site smoke, optional `--ai`), `scripts/local-cloudflare-check.mjs` (wrangler pages dev + quota Worker, no cloud), `scripts/build-review-packet.mjs` | not part of the product bundle |
| Docs | `docs/release/RELEASE_6.5.md` (gates G1–G10, playbook, rollback), `docs/release/CLOUDFLARE_STAGING_VERIFICATION.md`, `docs/release/PWA_6_2_TO_6_5_UPGRADE.md`, `docs/release/FINAL_6_5_0_COMPLETION.md`, `docs/exam/EXAM_RELEASE_MATRIX.md`, `docs/review/TEACHER_REVIEW_PACKET_6.5.md`, `docs/learning/TEACHER_REVIEW_REGISTER.md`, `docs/learning/CHECKPOINT_6.5.md` | — |

## 2. Critical diffs to read

1. `functions/api/chat.js` `requestGeminiResilient`: the `beforeRetry` check at the top of the loop (index > 0) returns the last upstream result or rethrows the last network error when the budget refuses. Verify no path makes an upstream call without a prior budget unit, and that with no budget binding behaviour is identical to 6.2 (`consumeBudget` returns allowed).
2. `functions/api/_limits.js`: `checkShared` still fails closed on limiter/DO/KV errors; `consumeBudget` keeps the DO-first, KV-second order.
3. `scripts/lib/pwa-upgrade-journeys.mjs`: rewrites `dist/sw.js` during the test and restores it in `finally` — check the restore and that no assertion is vacuous (each asserts cache names / stored data).

## 3. New evidence produced by the agent

| Command | Result |
| --- | --- |
| `npm run build` (incl. `npm run check`: exam 84, papers 850, feedback/limits 20) | PASS, 262 modules |
| `npm run check:browser` | 359/359 twice (one earlier run: PWA journey timeout at 15 s → waits raised to 30 s) |
| `npm run check:a11y` | 100 scans PASS |
| `npm audit --omit=dev --audit-level=high` | 0 vulnerabilities |
| `node scripts/local-cloudflare-check.mjs` | 12/12 (local workerd runtime; not staging) |

## 4. What Codex must independently verify

1. The cost-control change (§2.1–2.2) by reading and by running `scripts/test-feedback-api.mjs`.
2. Version consistency: `npm run release:sync` then `git diff` is empty; `dist/sw.js` and the UI show 6.5.0.
3. The PWA journey validity (§2.3) and that learner data keys are untouched by the SW.
4. Editorial notes are accurate and do not alter exam data (diff of the two paper files = one added field each).
5. That DTT 2–4 are still blocked and no paper changed states.
6. Optionally re-run `node scripts/local-cloudflare-check.mjs` (needs network for `npx wrangler@4`).

## 5. Remaining risks (not closable by the agent)

Staging and live Gemini (G6/G7), real devices and screen readers, printed originals of the 2025/2026 papers, teacher sign-off (G8), licence documents (owner attestation only), owner approval (G10). CSP keeps `style-src 'unsafe-inline'` (37 inline `style="…"` attributes in templates).
