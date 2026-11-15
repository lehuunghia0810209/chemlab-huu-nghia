# ChemAI 6.7.0 — Release Candidate

Date: 2026-11-15 · Branch `feature/chemai-6.7-hybrid` (base `cc03ca6`, main = `6846d41`) ·
Production today: ChemLab 6.6.4, deployment `12f7fbc8` (rollback target) ·
Status: **READY FOR PRODUCTION RELEASE** (head `2813174` + this report; see the X5 limitation below)

Technical detail and every benchmark stage: `CHEMAI_6.7_HYBRID_ROUTING.md` (§9–§14).

## Changelog

### Added
- **Smart Hybrid routing** behind one `/api/chat` and one UI: ChemLab Engine (0 Groq tokens)
  → `openai/gpt-oss-20b` → `openai/gpt-oss-120b`. `CHEMAI_ROUTING=off` restores the 6.6.4
  single-model path without a redeploy of code.
- **ChemLab Engine** (`functions/api/_chemEngine.js`): molar mass, mol ↔ mass, gas volume at
  đkc / đktc, molar concentration, strong acid / base pH, electron configuration, element
  lookup. It answers only when the question is inside its verified scope; anything ambiguous
  (hydrates, ions, extra data, follow-ups) goes to a model.
- **Escalation** 20b → 120b at most once, only on evidence (cut-off, invalid JSON, a guard
  error). Every call reserves and settles tokens; no call is made without quota.
- **`AI_UNVERIFIED`** (HTTP 503): an answer the Chemistry Guard proves wrong in its result is
  never shown. If the engine can compute the question its answer replaces it; otherwise the
  learner sees the correction and a retry button.
- Benchmark tooling: `scripts/chemai-benchmark.mjs` (paired off/hybrid, budget guard, outcome
  classes, raw drafts, USD estimate) and 56 hand-solved cases.

### Fixed
- Gas volume: the guard reads the condition from the question (its own T and P, then đkc
  24,79 L/mol, then đktc 22,4 L/mol) and flags the wrong molar volume wherever the answer
  breaks its lines. Live stage 1: both models used 22,4 at đkc.
- Fe + Cl₂: `Fe + Cl₂ → FeCl₂` is withheld; the unbalanced `Fe + Cl₂ → FeCl₃` is shown with the
  balanced equation above it. Valid iron equations (Fe + HCl, Fe + FeCl₃) are not touched.
- The SGK atomic-mass rule now reaches the Groq prompt (it had only been in the Gemini prompt).
- A literal `\n` from double-escaped JSON becomes a line break (present on 6.6.4 too).
- A theory section is no longer added to calculation answers.

### Changed behaviour to know about
- On both paths a calculation or equation the guard proves wrong is now withheld instead of
  shown under a correction note (6.6.4 showed it). Descriptive errors (colour, classification)
  keep the 6.6.4 behaviour.
- `usage.calls` in the response lists prompt / completion tokens per model call.

## Evidence

| Check | Result |
|---|---|
| `npm run check` (routing 26, public 31, Groq adapter 16, accuracy 23, …) | PASS |
| `npm run build` | PASS |
| `npm run check:browser` (Chromium, full) | PASS 448/448 |
| ChemAI suites on Firefox and WebKit (`CHEMLAB_GROUPS=ai`) | PASS |
| `AI_UNVERIFIED` journey at 320, 390, 768, 1440 on Chromium, Firefox, WebKit | PASS 12/12 each |
| `npm run check:a11y` (axe, 104 scans) | PASS |
| Offline router audit, 56 cases | 0 routing errors; engine 19/19 correct |
| Replay of all live answers of stages 1–4 through the guard | 6 wrong/incomplete caught, 0 false positives |

Live Groq (benchmark key, never Production quota), each stage on the code of its day — not one
pooled measurement:

| Stage | Pairs | Manual accuracy off / hybrid | Tokens off → hybrid | Notes |
|---|---|---|---|---|
| 1 (6.6.4 guard) | 3 | 2/3 · 2/3 | 4,666 → 2,882 | P1 wrong on both (22,4 at đkc) |
| 2 | 8 | 7/8 · 7/8 | 11,679 → 6,832 (−41.5 %) | X5 wrong on both (FeCl₂) |
| 3 | 4 | 4/4 · 4/4 result; P1, X5 incomplete on both | 6,628 → 6,913 (+4.3 %) | Fe 55,845; unbalanced Fe + Cl₂ |
| 4 | 2 | 2/2 · 2/2 | 3,687 → 4,038 (+9.5 %); USD est. −16 % | B4 and P1 complete; X5 not reached |

Token saving comes from the engine share (0 tokens); 20b uses about as many tokens as 120b
but costs half per token (list prices 2026-11-15: 120b $0.15 / $0.60, 20b $0.075 / $0.30 per
1M in / out). Latency: stage 2 1,739 → 625 ms, stage 3 equal, stage 4 1,952 → 1,710 ms.

### RC run of X5 (live, 2026-11-15, code `7c1edbf`, 2,969 tokens) — did not pass

| | Route | Draft | Learner saw | Outcome |
|---|---|---|---|---|
| off | 120b, 1,588 tok | "Đúng … Fe + Cl₂ → FeCl₂" (wrong) | 503 `AI_UNVERIFIED` with the FeCl₃ correction | SafeBlocked — first time the path fired against live Groq |
| hybrid | 20b, 1,381 tok | "Không, … tạo FeCl₃ (Fe trioxide chloride). FeCl₂ được tạo khi Fe phản ứng với Cl₂ trong điều kiện thiếu oxy…" | the draft, unchanged | **WrongShown** |

The 20b conclusion (FeCl₃) is right, but it adds a false statement in prose (FeCl₂ from Fe and
Cl₂ "without oxygen"), a wrong name, and no equation. The guard only read equations, so it saw
nothing. No escalation, no secret in the file. Neither side counts as correct.

Fix (`_chemFacts.js`, `ironChlorideProse`): a sentence that names FeCl₂ as what Fe and Cl₂
produce, with no negation and no acid, raises `reaction:fe-cl2`. Replay of both real drafts:
the 20b draft is re-checked once by 120b; a wrong 120b answer is withheld, a right one shown.
All other live answers of stages 1–4 and 8 valid iron sentences stay clean (routing 27/27).
The verified lesson corpus has one hit, the deliberately wrong statement in g10-l21 (`wrong:`
field), now listed as intended in test-chemai-guard.mjs.

### RC2 run of X5 (live, 2026-11-15, code `2813174`, 5,029 tokens) — no wrong answer shown

| | Calls | Drafts | Learner saw | Outcome |
|---|---|---|---|---|
| off | 120b 1,662 | "Đúng … Fe + Cl₂ → FeCl₂ (cân bằng…)" — wrong | 503 `AI_UNVERIFIED` + FeCl₃ correction | SafeBlocked |
| hybrid | 20b 1,838 → 120b 1,529 | 20b: "Fe + Cl₂ → FeCl₃; FeCl₂ không thường được hình thành…" (right product, unbalanced); 120b: "Đúng. … Fe + Cl₂ → FeCl₂" — wrong | 503 `AI_UNVERIFIED` + FeCl₃ correction | SafeBlocked |

- WrongShown 0, Correct 0, SafeBlocked 2. A blocked answer is not counted as correct.
- What the learner reads is the verified fact: "Fe tác dụng với Cl₂ tạo FeCl₃ (2Fe + 3Cl₂ →
  2FeCl₃), không tạo FeCl₂…". 6.6.4 in Production shows the wrong "Đúng, FeCl₂" answer today.
- Escalation: one, 20b → 120b, reason `guard` (unbalanced skeleton); both calls charged
  (3,367 tokens). No third call. No secret in the file.
- Known limitation, accepted for 6.7.0: 120b answered this question wrongly in 4 of 5 live
  runs despite the iron rule in the prompt, so X5 is usually blocked and "Thử lại" will often
  block again. Across all live hybrid rows since withholding exists (16), this is the only
  blocked one. Here the escalation also replaced a 20b draft that only needed the balanced
  equation with a wrong 120b answer.

## Release procedure (next turn)

Cloudflare Pages freezes environment variables into each deployment. `CHEMAI_PUBLIC_APPROVAL`
must equal `groq:<APP_VERSION>` exactly, so the flag is changed **before** the push: the
running 6.6.4 deployment keeps its frozen `groq:6.6.4` and keeps answering, and the 6.7.0
deployment is built with `groq:6.7.0`. Changing it after the push would lock ChemAI on the new
deployment until a redeploy.

1. Confirm the branch head and a clean worktree; `git fetch`; origin/main must still be `6846d41`.
2. Production variables, names and types only (never values): `GROQ_API_KEY` present,
   `CHEMAI_BUDGET` Durable Object binding present, `CHEMAI_ACCESS_MODE=public`,
   `CHEMAI_PUBLIC_HOSTS` unchanged, `CHEMAI_ROUTING` absent (hybrid is the default) or not `off`.
   Save the inventory.
3. Set `CHEMAI_PUBLIC_APPROVAL=groq:6.7.0` in Production (only that key); diff the inventory.
   Confirm Production 6.6.4 still answers (GET `/api/chat`: `access:true`, `configured:true`).
4. Push the branch head to `main` as a fast-forward, no force: `git push origin feature/chemai-6.7-hybrid:main`
   (origin/main `6846d41` is an ancestor of the branch; the local `main` branch is stale at `da21745`, do not push it).
5. Preview: confirm it is still behind Cloudflare Access (anonymous → 302). Do **not** send AI
   questions to Preview: it shares the `CHEMAI_BUDGET` Durable Object with Production.
6. Production deployment: record its ID. Check home 200, release 6.7.0, service worker
   version, GET `/api/chat` `access:true`, `configured:true`.
7. Smoke test on Production with three real questions (one of each route), then read quota:
   - "Khối lượng của 0,5 mol H2SO4 là bao nhiêu?" → engine, 49 g, 0 tokens charged.
   - "Viết cấu hình electron của ion Fe³⁺" → 20b.
   - "Trộn 100 mL dung dịch HCl 0,1M với 100 mL dung dịch NaOH 0,05M. Tính pH." → 120b, pH 1,60.
8. Rollback, fastest first:
   - Routing only: set `CHEMAI_ROUTING=off` and redeploy (6.6.4 single-model path, 6.7.0 fixes kept).
   - Whole release: roll Production back to `12f7fbc8` (6.6.4). Its frozen approval is
     `groq:6.6.4`, so it answers immediately; set the variable back before the next 6.6.x deploy.

## Backlog after 6.7.0 (not blockers)

- X5-type facts: answer Fe + Cl₂ deterministically (engine fact or verified knowledge entry) so the
  learner gets an answer instead of a blocked notice; when an escalated 120b answer is withheld,
  consider showing the 20b draft that only needed a correction note.

- Full 56-question live benchmark for a pooled token / cost figure on one code version.
- Guard: judge unbalanced equations without coefficients in general (today only Fe + Cl₂).
- Cached-token discount in the USD estimate; Groq reports few cache hits so far.
- Gemini path does not have the withholding rule (Gemini is not active).
