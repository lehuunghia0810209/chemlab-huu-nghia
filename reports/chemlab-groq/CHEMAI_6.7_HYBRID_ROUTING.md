# ChemAI 6.7: hybrid routing (ChemLab Engine → gpt-oss 20B → gpt-oss 120B)

Date: 2026-11-15 · Branch `feature/chemai-6.7-hybrid` (from `cc03ca6`, ChemLab 6.6.4) · not committed, not pushed, not deployed · Production stays 6.6.4 (`12f7fbc8`).

The app version is still 6.6.4 on this branch. 6.7.0 is proposed only after the live benchmark in §5 is run and accepted.

## 1. What changed

One ChemAI, one `/api/chat`, one UI. Each question takes exactly one of three paths, chosen by local rules (no model call is used to classify):

| Path | When | Groq tokens |
|---|---|---|
| **ChemLab Engine** (`functions/api/_chemEngine.js`) | The question matches one closed template, names exactly one substance and carries exactly the data that template needs | 0 (no call, no budget unit, no token reservation) |
| `openai/gpt-oss-20b` | Explanations, short questions, one-number exercises the engine does not cover | real usage |
| `openai/gpt-oss-120b` | Multi-step problems (≥ 2 data numbers, or a calculation with a reaction / dissolving / excess / heating), mixtures, yield, equilibrium, redox and electron balancing, long questions (the existing `questionComplexity` "complex" rule), follow-ups to any of these | real usage |

### Engine templates

All arithmetic uses the rounded atomic masses printed in Vietnamese textbooks (`TEXTBOOK_MASS`: H 1, O 16, Cl 35,5, Cu 64…). A question with any other element goes to the model.

- Element lookup by symbol, Vietnamese or GDPT 2018 name, or Z: Z, configuration, electrons per shell, period and group (`periodicPosition`), textbook and standard atomic mass, proton/electron count of the neutral atom.
- Electron configuration, Z ≤ 36 (Cr and Cu exceptions with ChemLab's note). Configuration → element only when it is exactly the ground state (written in full or with [He]/[Ne]/[Ar]/[Kr]).
- Molar mass of one formula.
- One amount of one substance → another: mol ↔ g, and gas volume only with a stated condition (đktc 22,4 L/mol, đkc 24,79 L/mol) and a known gas.
- Solution: solute (mol or g) + volume followed by "dung dịch" → CM; CM + solution volume → mol or g.
- pH of one strong monoprotic acid (HCl, HBr, HI, HNO₃, HClO₄) or strong base (NaOH, KOH, LiOH, Ba(OH)₂) when [H⁺] or [OH⁻] is between 10⁻⁵ and 1 M.

The engine returns null (model answers) for: any reaction, mixture, excess, yield, heating, dilution, hydrate (CuSO₄·5H₂O), ion or charge, isotope, percentage concentration, "why/explain/compare", words pointing at the conversation, a second substance, an extra or unplaceable number, H₂SO₄ pH (textbook full-dissociation convention vs the Virtual Lab's Ka₂ model), [H⁺] < 10⁻⁵ M (water's ions matter), a gas volume without conditions, a volume of water instead of solution, Z > 36 configurations, and excited configurations.

### Conversation

- Self-contained question: no history is sent.
- Follow-up (words such as "đó", "trên", "còn", "nếu", "thu được", "sau phản ứng", "giải thích kỹ hơn", or a short question with no formula): the learner's earlier questions (they carry the problem's data) plus only the last answer. Older answers are dropped.
- The list of follow-up words is liberal on purpose: a false positive only costs the kept history.

### Escalation 20B → 120B

At most one escalation per question, only on evidence:

- the 20B reply was cut off (`finish_reason: length`), empty, or not valid JSON (including Groq `json_validate_failed` after its own retry);
- ChemLab's deterministic chemistry checks (`answerGuard`, unchanged) found an error in the 20B answer.

The 120B call needs its own budget unit and its own token reservation; if either is refused, the 20B answer is returned with its correction note, as in 6.6.4. Nothing escalates after 25 s of the 52 s window. Both calls are charged exactly (usage minus cached tokens, reasoning included) and reported in `usage.calls`.

### Quota and accounting

- Unchanged limits and counters (`CHEMAI_TOKENS_*`, DO `CHEMAI_BUDGET`). Nothing was reset.
- The per-call reservation/settlement logic moved unchanged into `groqAttempt`; both the 6.6.4 path and the hybrid path use it.
- Each log line now has `route` (`engine` / `20b` / `120b`), `routeReason`, and, when it happens, `escalatedFrom`, `escalationReason`, `escalationRefused`, `requestTotalTokens`. Engine lines also record `kind`.
- The response's `meta.route` and `meta.escalated` say which path answered.

### Switch

`CHEMAI_ROUTING=off` restores the 6.6.4 behaviour exactly: no engine, `GROQ_MODEL` (default 120B) for every question, history as received. Unset or any other value → hybrid. `GROQ_MODEL` is not used in hybrid mode. Like every Pages variable it is frozen per deployment.

## 2. Files

| File | Change |
|---|---|
| `functions/api/_chemEngine.js` | new: ChemLab Engine |
| `functions/api/chat.js` | engine before quota; `routeModel`, `conversationHistory`, `isFollowUp`, `escalationReason`; `groqCall` split into `groqAttempt` + routing loop; `parseStructured` split out of `structuredAnswer` |
| `scripts/test-chemai-routing.mjs` | new: 16 checks (engine data, all 36 ground-state configurations, answers, refusals, 0-token path, routing, history, escalation accounting, refused escalation, `CHEMAI_ROUTING=off`) |
| `scripts/test-chemai-groq.mjs`, `scripts/test-chemai-public.mjs` | run with `CHEMAI_ROUTING: 'off'`: they test the adapter and budgets on the single-model path; every assertion is unchanged |
| `scripts/lib/chemai-benchmark-cases.mjs`, `scripts/chemai-benchmark.mjs` | new: 56-question benchmark, offline and live modes |
| `package.json` | `check:ai` runs the routing test |

No frontend file changed.

## 3. Verification

| Check | Result |
|---|---|
| `npm run check` (all suites, incl. 16 new routing checks) | PASS |
| `npm run build` | PASS |
| Engine answers through the frontend markdown pipeline (`markdownToHTML`) | PASS after two fixes (see §6) |
| `npm run check:browser` | PASS — 436/436 (Chromium) |
| `npm run check:a11y` | PASS — no WCAG A/AA violations (axe), keyboard focus checks pass |
| Real browser, real frontend + real `/api/chat` handler (engine + mocked Groq), 390 and 1440 px | PASS — engine answers (Fe configuration, NaCl CM) and a 20B→120B escalation render correctly; no horizontal overflow, no console errors; quota line shows 18.300 / 20.000 after 1.700 tokens (`screenshots-6.7/`) |
| Live Groq benchmark | **NOT RUN** — see §5 |

## 4. Offline benchmark (real, deterministic, no network)

`node scripts/chemai-benchmark.mjs` — 56 questions: element lookup 6, electron configuration 8, balancing 6, acid–base 7, amount/mass/concentration 10, multi-step 7, follow-ups 6, ambiguous/exceptions 6. Every expected result was solved by hand.

| | Count |
|---|---|
| Answered by ChemLab Engine (0 tokens) | **19 / 56 (33,9 %)** |
| Engine answers matching the expected result | **19 / 19** |
| Routed to 20B | 22 |
| Routed to 120B | 15 |
| Routing errors against the expected route | 0 (after fixing F2, see §6) |

The 33,9 % describes this question set, which I composed; it is not a measurement of what learners ask. The real share will come from the `route` field in Production logs after a release. The expected routes are also mine, so "0 routing errors" only shows the rules do what they were designed to do.

Per-question routes: `reports/chemlab-groq/benchmark-6.7-offline.json`.

## 5. Live benchmark: NOT RUN

Not run, for two reasons:

1. No Groq key exists on this machine (the key is a Cloudflare secret).
2. Running it on Preview would spend Production's quota: Preview and Production share the same `CHEMAI_BUDGET` Durable Object.

The live mode runs the `/api/chat` handler in this Node process with an in-memory quota counter, so the Durable Object is never touched. Groq's own limits are per key/organisation, though. With the Production key it spends from the same daily Groq allowance as learners. Estimated upper bound for `--modes off,hybrid` on 56 questions: about 115K tokens (≈ 73K for the 6.6.4 path, ≈ 40K for hybrid). The script stops at `--max-tokens` (default 120,000).

```sh
# PowerShell; the key stays in your shell, never in a file or in chat
$env:GROQ_API_KEY = '<key>'
node scripts/chemai-benchmark.mjs --live --confirm --modes off,hybrid --out reports/chemlab-groq/benchmark-6.7-live.json
Remove-Item Env:GROQ_API_KEY
```

It reports, per mode: accuracy, zero-token share, total/average tokens (overall and per category), reasoning and cached tokens, average latency, routes, escalations, routing errors and failed questions. For the paired run it reports the real tokens saved and the questions only one mode answered correctly. Answers are saved for human review: the patterns check final results, not the reasoning.

## 6. Defects found and fixed during this work

- Hydrates: `CuSO4.5H2O` was read as anhydrous CuSO₄ (M 160 instead of 250). Found by a refusal test. The engine now refuses hydrates.
- A full stop before a capital ("dung dịch. Tính") and a decimal before a unit ("0,5M") were briefly mistaken for hydrates. Fixed; both are covered by the answer tests.
- `Ba(OH)2`: the subscript 2 was read as a data number. Fixed.
- `[Ar]` in a configuration was read as a second substance. Fixed.
- F2 "Nếu dùng 11,2 g Fe thì…" was treated as self-contained (its history was dropped) and went to 20B. "nếu / giả sử / thay / trường hợp" now mark a follow-up; F2 routes to 120B with the conversation.
- Rendering: `_…_` is not supported by ChemAI's markdown and `C_M` showed raw. The note is now plain text and the notation is "CM".

## 7. Answers to the owner's questions (evidence so far)

1. **Share answered without Groq:** 33,9 % of this 56-question set, all of them correct. The share in real traffic is unknown until Production logs carry `route`.
2. **Real tokens saved:** not measured yet (§5). Two real 6.6.4 measurements are now 0 tokens, because the engine answers them and makes no call (proven by test): the Neon electron-configuration question (1,422 tokens, reported by the owner; the engine covers the usual wordings "Cấu hình electron của Neon / Ne / nguyên tử Neon") and "Khối lượng của 0,5 mol H2SO4 là bao nhiêu gam?" (1,119 tokens, Production measurement in the 6.6.4 report). No figure for the 20B savings is given because none has been measured.
3. **Is 20B accurate enough?** Unknown until the live benchmark. Safeguards: everything multi-step goes straight to 120B, and a 20B answer that fails the deterministic checks is re-asked on 120B once.
4. **Questions that must use 120B (by design, to be confirmed live):** multi-step stoichiometry (P1–P7), mixtures, yield, excess/limiting reagent, pH after mixing (A7), electron-method redox balancing (B5), equilibrium/kinetics/enthalpy, long or many-number problems, and follow-ups to any of these (F1, F2).
5. **Fine-tuning:** not needed now. The tokens are saved by not calling a model at all (engine), and correctness comes from deterministic checks. Re-evaluate only if the live benchmark shows 20B failing systematically in a category that neither the engine nor routing to 120B can cover.

## 8. Release conditions for 6.7.0 (proposal)

1. Owner approves and runs the live benchmark (§5) and reviews the saved answers.
2. Hybrid accuracy ≥ the 6.6.4 path on the same set, with no question that only 6.6.4 answered correctly left unexplained.
3. Version bump to 6.7.0. `CHEMAI_PUBLIC_APPROVAL=groq:6.7.0` must be set **before** main is pushed (release-bound gate).
4. Rollback: Production deployment `12f7fbc8` (6.6.4). Alternatively, `CHEMAI_ROUTING=off` with a redeploy restores the 6.6.4 behaviour.

## 9. Live benchmark, stage 1 (real Groq calls, 2026-11-15)

Separate benchmark key, in-memory quota counter, `--max-tokens 10000`. Three pairs completed, 7,548 tokens spent, stopped by the budget guard. Data: `benchmark-6.7-stage1.json`.

| id | off (6.6.4 path) | hybrid | Result |
|---|---|---|---|
| C1 Neon configuration | 120B, 1,011 tokens, 1,093 ms | engine, 0 tokens | both correct |
| X2 Cu + HCl | 120B, 1,732 tokens, 2,185 ms | 20B, 1,265 tokens, 961 ms, no escalation | both correct; the 20B answer gives no reason |
| P1 Fe + HCl, V(H₂) at đkc | 120B, 1,923 tokens → 2,25 L | 120B, 1,617 tokens → 2,24 L | **both wrong** (expected 2,479 L) |

- Totals: off 4,666, hybrid 2,882, saved 1,784 (38,2 %). Routing accounts for 1,478 of that (C1, X2); the 306 on P1 is run-to-run variation of the same model. Three questions are not a sample: no accuracy conclusion.
- P1 is a real model error on both paths, not a grader problem: both used 22,4 L/mol for đkc (hybrid even wrote "đkc (0 °C, 1 atm)") and M(Fe) = 55,845 instead of the textbook 56. The prompt already states đkc = 24,79 L/mol; the model ignored it.
- Guard gap (also in Production 6.6.4): `formula:molar-volume` only fires when "đkc" and "22,4" are in the same sentence. The hybrid answer separates them with a colon; the off answer never repeats "đkc". Not fixed here: the fix changes both paths and needs the owner's decision.
- Grader: unchanged verdicts. P1 and P5 now use a numeric check (whole number within ±0,5 %): "2,48 L" passes, "2,24 L" and "12,479 L" do not.
- After the `AI_UNVERIFIED` change (a 20B answer the guard marks wrong is never shown): `npm run check`, `npm run build`, `check:browser` 436/436, `check:a11y` — all PASS.

## 10. Approved accuracy fix (after stage 1)

Applies to both modes (`CHEMAI_ROUTING=off` and hybrid), so stage 2 compares **corrected-off vs corrected-hybrid**. Stage 1 (`benchmark-6.7-stage1.json`) is the comparison against the original Production 6.6.4 behaviour and is kept unchanged.

- Guard (`_chemFacts.js`, `questionMolarVolume` + `molarVolumeFindings`): the gas condition comes from the question (its own T and P first, then đkc 24,79 / đktc 22,4 L/mol). It flags 22,4 or 24,79 only when used as a factor (`× 22,4`, `n·22,4`, `V/22,4`, `22,4 L/mol × n`), on any line, and ignores lines naming the other condition (comparisons). Both real P1 answers are now caught; 9 correct or comparison answers are not.
- Withholding (`chat.js`): a final answer with a guard finding that makes a result wrong (`formula:*`, `equation:*`, `reaction:no-hydrogen`, `logic:limiting-reagent`) is never shown. If ChemLab Engine can compute the question, its answer replaces the model's; otherwise `503 AI_UNVERIFIED` with the guard's correction. No extra model call; the calls made stay charged exactly. Descriptive errors (colour, classification) keep the 6.6.4 note-first behaviour.
- Prompt: the existing gas line now says to follow the question's condition (and V = nRT/P for other T, P); the calculation line asks for textbook atomic masses (Fe 56, Cl 35,5, Cu 64…). No new section.
- Grader: unchanged expected answers; P1/P5 use a ±0,5 % numeric check (stage 1 verdicts unchanged under it).
- Verification: `npm run check` (routing 21/21), build, `check:browser` 436/436, `check:a11y`: PASS.

## 11. Live stage 2 (corrected-off vs corrected-hybrid) — manual review

Run by the owner on 2026-11-15 with the benchmark key, `--max-tokens 20000`. 8 complete pairs
(M1, A1, M5, B2, C6, X5, E6, M9); the script stopped at 18,511 tokens before F4, B4, A7.

| | off | hybrid |
|---|---|---|
| Tokens (real) | 11,679 | 6,832 (−41.5 %, 4,847 saved) |
| Avg latency | 1,739 ms | 625 ms |
| Routes | 120b × 8 | engine × 3 (0 tokens), 20b × 5, 120b × 0 |
| Script accuracy | 6/8 | 7/8 |
| Manual accuracy | **7/8** (X5 wrong) | **7/8** (X5 wrong) |
| Escalations / routing errors / withheld | 0 / 0 / 0 | 0 / 0 / 0 |

Manual verdicts:
- M1 off "49,0 g" and M5 off "0,50 mol L⁻¹" are correct; the regex grader missed the
  trailing zero / unit form (grader error). Expected values unchanged; patterns now accept
  49.0 g and 0.50 mol·L⁻¹ / mol L⁻¹. Both off answers used IUPAC masses (1,008; 22,99; 35,45)
  instead of SGK masses: not wrong here, style only.
- X5 is wrong on **both** paths. Fe + Cl₂ gives FeCl₃ (2Fe + 3Cl₂ → 2FeCl₃). 120b answered
  "Đúng. Fe + Cl₂ → FeCl₂" (it only mentioned FeCl₃ for excess Cl₂); the old grader passed it
  because it only looked for "FeCl3". 20b also wrote Fe + Cl₂ → FeCl₂. So this is not a 20b-only
  weakness; the grader now also rejects an answer that opens with "Đúng/Có".
- Guard: no false positives in stage 2; it missed X5 because it had no Fe + Cl₂ fact.

Fixes (mock-tested, no new live run):
- Guard `reaction:fe-cl2` (_chemFacts.js) — wrong-result class, so the answer is withheld
  (20b → one 120b re-check → AI_UNVERIFIED with the FeCl₃ correction).
- Prompt rule `iron` sent only for Fe/sắt questions; theory line no longer invites a theory
  section in calculations (B2 off printed "Lý thuyết (100‑250 từ)").
- Literal "\n" from double-escaped JSON (M1 off, B2 hybrid, M9 hybrid) becomes a line break
  outside $…$; existed on the 6.6.4 path too.
- Tests: routing 24/24 (X5 real answers, newline), public 31/31, full `npm run check`, build,
  check:browser 436/436, check:a11y PASS.

Still unmeasured live: 120b inside hybrid (A7, multi-step), F4, B4, and the fixes above.

## 12. Stage 3 preparation (local only, no Groq call)

- Browser (real Chromium, 390 px dark, `/api/chat` stubbed): new smoke journey `chemai withheld`.
  503 AI_UNVERIFIED shows "ChemAI chưa thể trả lời" with the FeCl₃ correction, no assistant
  answer, one question bubble, a working "Thử lại" (retry answers; one copy of the question
  sent). check:browser 439/439.
- Guard does not flag Fe + 2HCl → FeCl₂ + H₂, Fe + 2FeCl₃ → 3FeCl₂ or 2Fe + 3Cl₂ → 2FeCl₃
  (alone, ASCII or Unicode, or all three in one answer; end-to-end 200, no correction).
  Routing tests 25/25.
- Benchmark rows now carry `outcome`: Correct, WrongShown, SafeBlocked (AI_UNVERIFIED),
  ReplacedByEngine, ProviderError. Summary: `outcomes`, `correctRate` (Correct +
  ReplacedByEngine; SafeBlocked never counts) and `blockRate` (SafeBlocked / (SafeBlocked +
  WrongShown)). Each row also keeps `drafts`: every raw model answer, including withheld ones.
- Stage 3 order: A7, X5, P1, F4, B4; cap 15,000 tokens; mock dry run stops safely.

## 13. Live stage 3 — manual review

Owner run, 2026-11-15, cap 15,000: 4 complete pairs (A7, X5, P1, F4), stopped at 13,541
before B4. Every answer and draft read by hand.

| | off | hybrid |
|---|---|---|
| Correct (manual) | 4/4 | 4/4 |
| WrongShown / SafeBlocked / ReplacedByEngine / ProviderError | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |
| Tokens | 6,628 | 6,913 (+4.3 %) |
| Routes | 120b × 4 | 120b × 2 (A7, P1), 20b × 2 (X5, F4) |
| Escalations 20b → 120b | – | 0 |

- A7 (both 120b): 0,010 − 0,005 = 0,005 mol H⁺ in 0,200 L → 0,025 M → pH 1,60. Correct.
- X5 (120b / 20b): both now answer FeCl₃, not FeCl₂. Both wrote the unbalanced skeleton
  "Fe + Cl₂ → FeCl₃"; the guard does not judge equations without coefficients (known gap).
- P1 (both 120b): 24,79 L/mol at đkc in both. Still M(Fe) = 55,845 → 2,48 / 2,49 L instead of
  the SGK 2,479 L. Cause found: the SGK atomic-mass rule had only been added to the Gemini
  prompt, never to the Groq `calculation` rule. Fixed after this run. Off also printed a stray "⇌".
- F4 hybrid (20b) "pH = 3." is correct; the grader rejected the sentence-ending period
  (grader error, fixed: only a decimal continuation is rejected). Script said 3/4, manual 4/4.
- No guard false positive; nothing was withheld, so the AI_UNVERIFIED path has still never
  fired against live Groq (mock + browser only).
- Tokens: no engine question in this set, and 20b used as many tokens as 120b (X5 −29,
  F4 +205). Stages 2+3 together: off 18,307 vs hybrid 13,745 (−24.9 %); nearly all of it is
  the engine (0-token) share; 20b alone saved ~7 % over 7 samples.

After-run fixes (mock-tested only): SGK masses in the Groq calculation rule; iron rule now
gives the balanced 2Fe + 3Cl₂ → 2FeCl₃; grader trailing period.

## 14. Stage 4 preparation (local only, no Groq call)

- Graders, expected answers unchanged: P1 now checks the FINAL volume in litres (last "x L",
  molar volumes excluded) within ±0.5 % of 2,479, requires Fe = 56 and 24,79, rejects 55,8…;
  X5 requires the balanced 2Fe + 3Cl₂ → 2FeCl₃ and rejects the bare Fe + Cl₂ → FeCl₃.
  Under these rules stage 3 P1 (both) and X5 (both) are "incomplete", as reviewed by hand.
- Guard `balance:fe-cl3`: the unbalanced skeleton is not withheld (the product is right); the
  answer is shown with the balanced equation above it; a 20b draft is re-checked once by 120b.
- Replay of all 30 answers collected live in stages 1–3 through the current guard: the 6
  wrong/incomplete ones are all caught (P1 ×2 molar volume, X5 ×2 FeCl₂, X5 ×2 unbalanced);
  the 24 correct ones raise nothing. Pipeline replay (mocked fetch, real drafts) in
  test-chemai-routing.mjs: 26/26. Real-Groq evidence of AI_UNVERIFIED firing: none yet.
- Cost (list prices console.groq.com/docs/models, 2026-11-15: 120b $0.15 in / $0.60 out,
  20b $0.075 / $0.30 per 1M; cache discount not applied; estimate). Stages 2+3, 12 pairs:
  tokens 18,307 → 13,745 (−24.9 %; engine 3,897, model switch 665); reasoning 4,095 → 3,355;
  avg latency 1,780 → 1,037 ms; USD ≈ 0.005597 → 0.002674 (−52.2 %); engine 3/12 at 0 tokens.
- Benchmark summary now reports usdEstimate, savedByEngine, savedByModel; usage.calls carries
  prompt/completion tokens per call.
- check, build, check:browser 439/439, check:a11y PASS.
