# ChemAI on Cloudflare Workers AI (Free) — ChemLab 6.5

> **Superseded in 6.5.4:** ChemAI uses Gemini only (`functions/api/chat.js`); the Workers AI path and `_workersAI.js` were removed. See `reports/chemlab-6.5.4/GEMINI_RESTORATION.md`. Kept for history.

Why: Google Gemini refuses this deployment ("User location is not supported for the API use.", verified 2026-10-21, see `CHEMAI_PRODUCTION_HOTFIX_6.5.md`). ChemAI now uses **Cloudflare Workers AI** through the Pages binding `env.AI` by default. Gemini code is kept and runs only when `CHEMAI_PROVIDER=gemini`.

## 1. Design

| Item | Value |
| --- | --- |
| Provider selection | `CHEMAI_PROVIDER` = `workers_ai` (default) \| `gemini`. Any other value fails closed (`AI_NOT_CONFIGURED`) |
| Primary model | `@cf/zai-org/glm-4.7-flash` (`CHEMAI_MODEL`) |
| Fallback | `@cf/google/gemma-4-26b-a4b-it` (`CHEMAI_FALLBACK_MODEL`). Used only after `3040` capacity (after one retry), `5007`/`3042` no such model, `5035` paid plan required, or `5018`/`3041` |
| Free-model allowlist | `functions/api/_workersAI.js` `WORKERS_AI_MODELS`. A model outside it is refused before any call (`AI_MODEL_NOT_ALLOWED`); a paid fallback is ignored. **Never** falls back to Gemini or a paid model |
| API contract | `/api/chat` request and response unchanged: `{ok, answer, actions, suggestions, meta}` plus error `{ok:false, code, requestId, message}`. Workers AI answers are Markdown; `actions`/`suggestions` are `[]`, so the UI shows its local suggestions |
| Prompt | Same ChemLab system instructions, knowledge retrieval, context and last 10 history items. Adds a “check before answering” block (element and charge balance, units, missing data → say so). No JSON mode: it is not documented for these two models; JSON-wrapped output is unwrapped |
| Output limit | `max_completion_tokens` 1800 (same as the Gemini path; reasoning included), GLM hidden reasoning switched off with `chat_template_kwargs: {enable_thinking: false}` (to be confirmed on Preview via the `reasoningTokens`/`reasoningChars` log fields), `temperature` 0.3, answer ≤ 12,000 characters. A truncated answer (`finish_reason=length`, the model ran out of tokens; ChemLab never cuts) carries a note; an empty answer → `AI_INCOMPLETE` |
| Timeout | `CHEMAI_TIMEOUT_MS` (default 30,000, max 50,000) → `AI_TIMEOUT`, no retry |

## 2. Cost control (all inference paths)

Workers Free includes **10,000 Neurons/day per account**, shared with every project on the account. When they are used up, Workers AI returns `3036` (mapped to `429 AI_DAILY_LIMIT`, no retry). Neurons are tokens × model price, so they are **not** a number of questions.

| Control | Where | Default |
| --- | --- | --- |
| Site-wide daily Neurons, exact (Durable Object `CHEMAI_BUDGET`, scope `chat-neurons`) | before **every** model call, including the retry and the fallback | `CHEMAI_DAILY_NEURONS` = 8000 (headroom under 10,000) |
| Reservation | worst case: input ≈ characters/2 tokens + 1800 output tokens at the model's price (measured: 77–82 Neurons per question); after the answer, the unused part is refunded from `usage` | — |
| Questions per client per day, exact (DO scope `chat-client:<ip or IPv6 /64>`) | before the first call | `CHEMAI_DAILY_LIMIT_PER_CLIENT` = 40 |
| Client identity | `CF-Connecting-IP`, set by Cloudflare's edge and not forgeable by the client there; IPv6 grouped by /64 | — |
| Burst | 18 requests/min per client per isolate (unchanged) | — |
| Concurrency / duplicates | ≤ 6 Workers AI calls per isolate (`AI_BUSY`); the same question from the same client while it is running → `409 DUPLICATE_REQUEST` | — |
| Retries | at most 1 retry (capacity) + 1 fallback = 3 calls, each charged separately | — |
| Input | body ≤ 64 KB, question ≤ 4000 characters, history ≤ 10 items × 2600 characters; validated **before** any budget charge | — |
| Fail closed | no `AI` binding, unknown provider, model not allowed, or no budget binding: 0 model calls. Durable Object unreachable: 429 | — |

Expected capacity: with 8000 Neurons and the reservation, at least about **97 questions/day** (Preview 2000 → about 24); typically more after refunds (to be measured on Preview). Durable Object use per question: 3 requests and 3 row writes (Free plan: 100,000 per day each). The quota Worker uses SQLite-backed Durable Objects (`new_sqlite_classes`), which Workers Free supports.

## 3. Cloudflare setup (owner, Dashboard)

The Pages project is configured in the Dashboard (it has no `wrangler.toml`, and adding one would take over the project's settings, so none is added).

1. **Check the plan is Free.** Dashboard → Workers & Pages → Plans, or Account → Billing. The agent could not read the plan: the wrangler token has no access to subscriptions. Both models exist in the account's Workers AI catalogue.
2. **Quota Worker.** `cd workers/chemai-quota`, then `cp wrangler.toml.example wrangler.toml`, then `npx wrangler deploy`. This creates the `chemai-quota` Worker with the `QuotaCounter` SQLite Durable Object (Free plan).
3. **Preview environment first.** Workers & Pages → `chemlab-edulab` → Settings → choose **Preview**:
   1. Bindings → Add → **Workers AI**, variable name `AI`.
   2. Bindings → Add → **Durable Object**, variable name `CHEMAI_BUDGET`, namespace `chemai-quota` / `QuotaCounter`.
   3. Variables (optional, plain text):
      - `CHEMAI_PROVIDER=workers_ai`;
      - `CHEMAI_DAILY_NEURONS=2000` (a lower cap for testing);
      - `CHEMAI_DAILY_LIMIT_PER_CLIENT=40`.
4. Redeploy the Preview (push the branch) and run the checks in §5.
5. **Production.** Repeat step 3 for **Production** with `CHEMAI_DAILY_NEURONS=8000`. Do not change or delete `GEMINI_API_KEY`; it is unused while `CHEMAI_PROVIDER` is `workers_ai`.

**Preview and Production bind the same namespace** (`chemai-quota_QuotaCounter`). Preview **must** set `CHEMAI_BUDGET_SCOPE=preview`, so that its counters (`budget:preview:chat-neurons`, …) stay separate from Production's (`budget:chat-neurons`); Production leaves it unset. A malformed scope (allowed: `a-z`, `0-9` and `-`, 1–32 characters) fails closed. The 10,000 free Neurons are per account, so keep Preview + Production ≤ 10,000 (2000 + 8000).

`CHEMAI_BUDGET` must be bound **in each environment**. Without it, ChemAI answers `AI_BUDGET_NOT_CONFIGURED` (hotfix `1f33ce9`, unchanged).

## 4. Verification done locally (no Neurons spent)

| Test | Result |
| --- | --- |
| `scripts/test-workers-ai.mjs` (20 groups) | **PASS**. Covers: valid request, Vietnamese text and history, Markdown prompt; missing AI binding, unknown provider or missing budget → 0 calls; paid or unknown model refused; paid fallback ignored; invalid input → no charge; reserve + refund; Neuron budget exhausted; per-client limit incl. IPv6 /64; 3036; 3040 retry + fallback (each charged); 5035/5007 → free fallback; retry stops when unpaid; timeout; output shapes (JSON-wrapped, `<think>`, legacy `response`, empty, truncated); 8 concurrent → 3 calls paid, 2 `AI_BUSY`; duplicate 409; logs without question text, IP or key; Gemini never called |
| `scripts/test-chemai-api.mjs` (Gemini path pinned with `CHEMAI_PROVIDER=gemini`) | PASS. The Gemini request is still byte-identical to 6.2 |
| `scripts/test-feedback-api.mjs` (incl. `QuotaCounter` cost/refund) | PASS, 20 groups |
| `npm run build` (incl. `npm run check`) | PASS |
| `node scripts/local-cloudflare-check.mjs` (workerd, real quota Durable Object) | **PASS, 16/16**. New: default provider without the AI binding → `503 AI_NOT_CONFIGURED`, status `Workers AI configured=false`. Workers AI itself is not run locally, because `--ai` uses real Neurons |
| `npm run check:browser` / `check:a11y` / `npm audit` | 362/362 · 100 scans · 0 vulnerabilities |
| Real Workers AI, model quality | **NOT RUN** (needs a Free-plan check and owner approval) |

## 5. Preview checks (after §3, owner approval for real Neurons)

1. `node scripts/staging-smoke.mjs <preview-url>`: headers, version, `/api/chat` status (`provider: Workers AI`, `configured: true`).
2. `node scripts/chemai-eval.mjs <preview-url>` prints the plan. With `--confirm`, it sends **13 chemistry questions with reference answers** (≈ 13 × 77–82 Neurons reserved, less after refunds) and checks:
   - moles at đktc and at đkc (CT 2018);
   - mass, molar mass and molarity;
   - a stoichiometry problem;
   - balancing `Fe + O₂ → Fe₃O₄`;
   - neutralisation, pH, electron configuration, CuSO₄ + NaOH observation;
   - a missing-data question (the model must say what is missing);
   - ethanol's formula.

   A response passes only if it contains the reference facts.
3. Optional comparison: set `CHEMAI_MODEL=@cf/google/gemma-4-26b-a4b-it` on Preview, redeploy and rerun step 2.
4. Desktop and phone: ask one question in the UI and check the Markdown rendering and the error notices.
5. Read the `chemai.chat` log lines (`wrangler pages deployment tail <id> --project-name chemlab-edulab`): check `neuronsReserved`, `neuronsUsed` and `finishReason`.

Production only after these pass and the owner approves the merge.

## 6. Answer quality and math rendering (2026-10-21, after the first real evaluation)

The first Preview evaluation of GLM-4.7-Flash had 12/13 correct final answers and every answer complete (`finish_reason=stop`), using about 18.5 Neurons per question. It found two groups of defects:
- **Raw LaTeX.** The ChemAI renderer only knew bold, code and lists.
- **Chemistry mistakes:**
  - a wrong coefficient in a balancing explanation;
  - Na placed in group IVA;
  - Cu(OH)₂ described as green and "oxidised by air", with an unbalanced decomposition;
  - "nhóm metan" instead of methyl.

| Change | Where |
| --- | --- |
| **KaTeX 0.19.0** for `$…$`, `$$…$$`, `\(…\)`, `\[…\]` and `\ce{}` (mhchem). | `src/ai/markdown.js`, `src/ai/mathRender.js` |
| Math handling, step by step: | |
| — Math is cut out before Markdown and escaping, kept as escaped placeholders, then typeset with `trust: false`, `maxExpand 300` and MathML output. | `src/ai/markdown.js`, `src/ai/mathRender.js` |
| — Invalid TeX, or KaTeX not loaded yet (offline), keeps the readable source. | `src/ai/mathRender.js` |
| — An unclosed `$$` becomes the rest of its line and never swallows the next formula. | `src/ai/markdown.js` |
| — LaTeX without delimiters is detected only in ASCII runs, so Vietnamese prose stays text. | `src/ai/markdown.js` |
| — KaTeX is lazy-loaded only when an answer contains math (≈ 78 kB + 8 kB CSS + 8 kB mhchem, gzip). The main bundle is unchanged; the ChemAI chunk grows by 1 kB gzip. | |
| — Long display formulas scroll inside their box, are focusable, and follow the theme colour. | `src/ai/chemAI.css` |
| Knowledge: every retrieved element now carries its electron configuration, period and A/B group, from ChemLab's `getElectronConfiguration` engine. This is shared with the Gemini path, whose system prompt is unchanged. | `functions/api/_knowledge.js` |
| Prompt (Workers AI only) adds general accuracy rules: | `functions/api/chat.js` |
| — atom counts after each balancing step, with explained coefficients that match the final equation; | |
| — positions taken from CHEMLAB KNOWLEDGE; | |
| — observations: only certain ones, room temperature vs heating, no extra mechanisms; | |
| — GDPT 2018 terms (acid, base, oxide, hydrogen, methyl…); | |
| — math in closed `$…$` / `$$…$$`, chemical formulas in Unicode. | |
| Fixed two latent prompt bugs: a `\t` in `\text` became a TAB, and `String.replace` turned `$$` into `$`. | `functions/api/chat.js` |
| Prompt growth | ≈ +1,200 characters (≈ +2 Neurons per question; reservation 80–86) |
| Evaluation: 19 cases, graded per category; PASS only if all pass, and fabrication is always checked by a person. The 6 new variant cases cover the four defects without reusing the 13 questions' answers. | `scripts/lib/chemai-eval-cases.mjs`, `scripts/chemai-eval.mjs [--only ids]` |
| — Categories: final answer, steps, facts/phenomena, terminology, display, completeness. | |
| — Variant cases: Al₂O₃ balancing, K and Cl positions, heating Cu(OH)₂, FeCl₃ + NaOH, alkyl names. | |
| Tests | `test-chemai-markdown` (10), `test-chemai-eval` (9), `test-workers-ai` (25), browser math journey (desktop dark and 390 px light), a11y scenario "ChemAI answer with math" |

Not done here: no real Workers AI call. The next Preview run should use `node scripts/chemai-eval.mjs <preview-url> --confirm` (19 questions, ≈ 400 Neurons), after approval.

## 7. Accuracy and reliability hotfix (2026-11-04, ChemLab 6.5.2)

The owner-approved evaluation of 6.5.1 on Preview (2026-11-04) **failed G7**: 13/19 automatic passes, and reading the answers found errors the grader had passed. Full record: `CHEMAI_EVAL_2026-11-04.md` in the EduLab root, outside this repository. 6.5.0 runs the same `functions/` and model, so these errors also apply to production 6.5.0.

**G7 is still not passed.** Nothing below has been measured against the real model. It needs a new owner-approved run and a person reading the answers.

| Root cause | Evidence | Change |
| --- | --- | --- |
| The verified colour never reached the model | Retrieval sent "Copper(II) hydroxide precipitate forms."; `PRECIPITATES` and `reactionsVi` hold "xanh lam" | Reactions carry the Vietnamese title and `solids`; new `substances` block (colour, base/acid strength) |
| Retrieval noise and misses | `K (Z = 19)` returned Y; `mol` matched Mo; `Cu(OH)2` could not match; `đ` was deleted from words; an equation about Fe returned carbonates | Elements by exact symbol, Z or name; reactions by the species in the equation; floor on weak matches. Knowledge JSON on the 19 questions: average 2927 → 982 characters |
| Rules existed only as prompt text, and hidden reasoning is off (`enable_thinking: false`), so nothing checked an answer | Old defects returned (Cu(OH)₂ "xanh lục") | `answerGuard`: deterministic checks after the model, no extra call |
| The grader read keywords | `\xrightarrow{\Delta}` failed a correct equation; `\b` never matched "bazơ"; `V = nRT`, "trùng hợp" and "kim loại kiềm" passed | Unicode-aware terms, more arrow forms, new `science` category, separate verdicts |
| Timeout | Same output size took 8 s or 27.5 s (390–411 tokens, 14–50 tokens/s), and a short question hit 30 s. Time does not follow tokens, so this looks like upstream queueing (strong hypothesis, not confirmed) | Smaller input. Timeout, retry policy and model unchanged: a timeout stays one call, one charge, no retry, no fallback. The timed-out call is not cancelled upstream and may still be billed |

### `answerGuard` (`functions/api/_chemFacts.js`)

Runs on the Workers AI path only; the Gemini path is unchanged.

| Check | Source of truth |
| --- | --- |
| Colour of a named solid or of "kết tủa …" | `PRECIPITATES` (Virtual Lab) plus common oxides |
| Hydroxide, acid and salt class; polymerization label | Tables in the module |
| `V = nRT`, R against pressure unit, 22,4 vs 24,79 L/mol, limiting reagent, period wording | Rules in the module |
| Equation balance | `src/chem/equation.js`. Skips the question's own skeleton and ionic right sides |
| Cu, Ag, Au, Pt, Hg + acid → H₂ | Activity series |

- A finding puts a correction **above** the model's text, which stays visible: rewriting it could add new errors. No badge is shown for a clean answer, because passing these checks does not mean the answer is correct.
- Old names with a one-to-one current name (axit → acid) are rewritten silently. This is style, not a science error.
- The guard catches known error classes only. A wrong statement outside these rules passes through.
- Balance is judged only for an equation with a coefficient and at least three species. Ions, half-reactions, chains, structural formulas and shorthand such as `NaCl → Na + Cl₂` are skipped: a false correction costs more than a miss.
- `test-chemai-guard` runs the guard and the safety gate over ChemLab's own lessons, questions and papers (over 10,000 strings). The first run found 65 kinds of false alarm, now fixed. The only accepted findings are three statements written to be wrong (common-mistake items and a true/false option).
- Phones previously hid the footer and with it the only reliability notice. It now shows at every width.

### Safety gate (`functions/api/_chemSafety.js`)

Requests to make something dangerous, household chemical mixing, and hazardous experiments at home or without protection get fixed text before any budget or model call. Learning questions (why dangerous, first aid, textbook equations, supervised lab practice) reach the model, whose prompt forbids amounts and procedures. Pattern matching cannot catch every wording, and the model's safety behaviour is unmeasured.

### Evaluation

`scripts/chemai-eval.mjs`: 41 cases (the 19 plus 22 new: same error classes on other substances, false premises, and safety), of which 37 reach the model. Estimate 555–1110 Neurons; `--max-neurons` stops the run, `--only` selects cases, `--out` saves JSON. Verdicts are `AUTO PASS`/`AUTO FAIL` and `SCIENTIFIC FAIL`/`HUMAN REVIEW REQUIRED`/`NO ANSWER`; only a person's review can set `SCIENTIFIC PASS`. `scripts/test-chemai-guard.mjs` replays the recorded answers offline (`scripts/fixtures/`).

### Stopping ChemAI without a code change

Set `CHEMAI_PROVIDER=off` for Production in the Pages settings, then create a new deployment. Any unknown value fails closed: no model call, no budget, `configured: false`. Learning data and other tools are untouched. Undo by restoring `workers_ai` and redeploying.
