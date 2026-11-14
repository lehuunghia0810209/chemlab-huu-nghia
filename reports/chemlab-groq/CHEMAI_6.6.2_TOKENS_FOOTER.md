# ChemLab 6.6.2: ChemAI footer removed, prompt halved

Date: 2026-11-14

## 1. Real usage measured on Production 6.6.1 (before)

One real request to `https://chemlab-edulab.pages.dev/api/chat`, shaped like the frontend's (home screen, no history), question "Khối lượng của 0,5 mol H2SO4 là bao nhiêu gam?". Groq's own `usage`:

| Field | Tokens |
|---|---|
| prompt_tokens | 1,335 |
| completion_tokens | 199 (of which reasoning 83) |
| total_tokens | 1,534 |
| cached_tokens | 0 |

This matches the owner's observation (20,000 → 18,471 = 1,529). Input was 87% of the cost.

Breakdown of the 1,335 input tokens (o200k tokenizer on the exact request; the remaining ~55 tokens are the provider's chat-format overhead):

| Part | Tokens | Share |
|---|---|---|
| Fixed system prompt (core) | 797 | 60% |
| Retrieved ChemLab knowledge (three neutralisation reactions, unrelated to a molar-mass question) | ~300 | 23% |
| Labels, empty history block, view-name-only context | ~85 | 6% |
| Checking rule for calculations | 47 | 4% |
| The question | ~20 | 1.5% |

Scraped screen text was already not sent (6.6.1). History was empty.

Groq reported no cache hit (`cached_tokens: 0`), so the fixed core cannot be counted on to be cheaper.

## 2. Changes (Groq path only)

| Change | Effect on the H₂SO₄ question |
|---|---|
| Core prompt rewritten tersely; every rule kept (language, answer length, Unicode formulas and LaTeX, balanced equations only when sure, missing data, data-not-instructions, safety, JSON schema, actions, suggestions) | 797 → ~536 |
| Retrieved reactions are sent only when the question is about a reaction (equation, reaction, phenomena, precipitate, mixtures, excess/limiting, "+", "→"). Substances, names, formulas, acid/base strength and colours are always sent | ~300 → ~86 |
| Empty sections are not sent (empty history, empty knowledge). A context that only names the current view is dropped; structured state (element, reaction, lesson, lab) is kept | −~70 |
| `reasoning_effort: low` for simple questions | unchanged |

Unchanged: the Gemini adapter and prompt, the chemistry guard, the safety gate, the quota mechanism, the question text.

Input measured with the tokenizer, before → after:

| Question | 6.6.1 | 6.6.2 |
|---|---|---|
| Khối lượng của 0,5 mol H2SO4 là bao nhiêu gam? | 1,280 | 709 |
| Tính pH của dung dịch HCl 0,01 M. | — | 695 |
| Axit là gì? | — | 951 |
| Cho dung dịch NaOH vào dung dịch CuSO4, nêu hiện tượng. (reactions kept) | — | 1,055 |

Projected real total for the H₂SO₄ question: about 765 prompt + about 200 completion ≈ **950 tokens**, within the 700–1,100 target. The real figure after deployment is in section 4.

## 3. UI: footer removed

The two footer lines ("ChemAI · trả lời tiếng Việt · …" and "ChemAI có thể sai kiến thức…") are removed entirely and nothing replaces them. The composer now closes the panel; its bottom padding went from 10 to 14 px on desktop (mobile already had 14 px + safe area).

Note: the second line was the only permanent reliability notice. The model is still instructed to say when it is unsure and to suggest checking the textbook (SGK).

Layout metrics, real Chromium, `reports/chemlab-groq/screenshots-6.6.2/after/`:

| Width | Footer | Composer gap to panel bottom | Composer on screen | Chip overlap or spill | Page overflow |
|---|---|---|---|---|---|
| 320 | none | 0 | yes | no | 0 |
| 375 | none | 0 | yes | no | 0 |
| 390 | none | 0 | yes | no | 0 |
| 440 | none | 0 | yes | no | 0 |
| 768 | none | 1 (border) | yes | no | 0 |
| 1440 | none | 1 (border) | yes | no | 0 |

The quota figure in the screenshots comes from the mocked API.

## 4. Tests and release

| Check | Result |
|---|---|
| `npm run check` | PASS |
| `npm run build` | PASS |
| Groq adapter mock / public mode and token quota / Markdown-KaTeX | PASS 16 / 30 / 14 (one new check: sections and knowledge focus) |
| Browser smoke Chromium | PASS 426/426 |
| Browser smoke WebKit | PASS 426/426 |
| Browser smoke Firefox | FLAKY: 425/426 on the full run. The one failure was "console clean during the PWA upgrade journeys": `import('../periodicDataV5.js')` failed once while the service worker swapped caches, and the app caught the error and retries on the next call. Rerunning that suite alone gave PASS 12/12 three times in a row. The same check was flaky in 6.6.0, and this release does not touch that code. |
| Accessibility (axe, 104 scans) | PASS |
| Six-viewport layout script | PASS (section 3) |
| Secret scan | only the fake test key |

Test thresholds that depended on the reservation size were re-tuned, not removed: smaller prompts mean smaller reservations. The input-cap test now sets `CHEMAI_MAX_INPUT_TOKENS=1500`, because a 3,900-character question now fits under 2,500.

| | State |
|---|---|
| Commit | `35e549b` on `feature/chemlab-groq-chemai` |
| Preview `b4740a35` | 6.6.2, `internal_testing`, Access protects it (302 for anonymous), `GROQ_API_KEY` and `CHEMAI_BUDGET` present |
| Production | still 6.6.1 (`c7d06ae0`), ChemAI open |

The owner set `CHEMAI_PUBLIC_APPROVAL=groq:6.6.2` first; Pages freezes variables per deployment, so the running 6.6.1 deployment was not affected. Then `main` was fast-forwarded `06d14e5 → 35e549b`. Production `9c61d178`: `GET /api/chat` → `release 6.6.2, access:true, configured:true, provider Groq`; service worker `chemlab-6.6.2-access-1`. Rollback: `c7d06ae0` (6.6.1).

## 5. Real usage after (Production 6.6.2)

Same request shape as section 1 (Groq `usage`):

| Question | prompt | completion (reasoning) | total |
|---|---|---|---|
| Khối lượng của 0,5 mol H2SO4… (run 1) | 818 | 214 (64) | **1,032** |
| Khối lượng của 0,5 mol H2SO4… (run 2) | 818 | 212 (52) | **1,030** |
| Cho dung dịch NaOH vào dung dịch CuSO4, nêu hiện tượng. | 1,164 | 549 (444) | 1,713 |

For the H₂SO₄ question: **1,534 → 1,031 tokens (−33%)**, prompt 1,335 → 818 (−39%), within the 700–1,100 target. No cache hit (`cached_tokens: 0`).

## 6. Regression found after release, fixed in 6.6.3

In both 6.6.2 answers the model wrote the unit as LaTeX `\text{g·mol^{-1}}`. KaTeX rejects `^` inside `\text`, so the formula fell back to its raw source and the learner saw backslashes. In one of the two runs the model also left a whole expression outside `$…$`. 6.6.1 answered in plain Unicode (`98,08 g·mol⁻¹`).

Cause: while shortening the prompt, "formulas: no LaTeX" and "close every $" were dropped and a `\text{mol}` example was added.

Fix (6.6.3):
- Prompt: formulas and single-line calculations in Unicode (`m = n × M = 0,5 × 98 = 49 g`); LaTeX only for fractions or multi-level expressions, always inside `$…$`; decimal comma. Cost: +56 prompt tokens (709 → 765 measured with the tokenizer).
- Renderer: only after KaTeX has failed, it moves an exponent out of `\text{…}` (`\text{g·mol}^{-1}`) and tries once more. Valid formulas are never rewritten, and anything still invalid shows its raw source as before. One new regression test.

## 7. Owner report on a phone: raw `\frac`, `\text{g}\,\text{mol}^{-1}` (butane answer), fixed in 6.6.3

Two real answers to "Tính thể tích khí CO2 … đốt cháy hoàn toàn 1 g butan C4H10 ở 25°C, 1 bar" were taken from Production 6.6.2 and traced through API JSON → `markdownToHTML` → KaTeX → visible text.

| Layer | Fault (real example) | Responsible | Fix |
|---|---|---|---|
| Model content | LaTeX without `$…$` (`n = \frac{1}{58.12}\,\text{mol}`); newlines written as the two characters `\n`; `\frac{13}{2}` inside an equation | model, encouraged by the terse 6.6.2 prompt | prompt (6.6.3): Unicode for formulas and one-line calculations, LaTeX only inside `$…$`, integer coefficients in equations |
| Parser: undelimited-LaTeX detector | a run started or ended inside a word: `Ph`+`ản ứng`, `Th`+`ể tích`, `O`+`\n2. S`; it swallowed sentence full stops, inline list numbers (`… mol. 2.`) and a stray `)` | parser | runs stop at word and formula boundaries; punctuation, list numbers and brackets go back to the prose |
| Parser | `\,` outside math (`4\,CO₂`) was not a "command", so it showed raw | parser | `\,` `\;` `\:` in prose become a thin space; nothing else is replaced |
| Parser | a lone `\n` was read as a LaTeX command | parser | a lone `\n` (not `\nu`, `\neq`, nor the `n` after a `\\` line break) becomes a newline |
| KaTeX | `\text{g·mol^{-1}}` is invalid LaTeX | model content | renderer retry from section 6 |

Not changed: the chemistry guard, the token quota, CSS. The 6.6.2 guard warning "2O₂ → 4CO₂ + 5H₂O chưa cân bằng" came from the LaTeX fraction inside the model's equation; the prompt now asks for integer coefficients.

Before → after on the two real answers (real KaTeX):

| | 6.6.2 | 6.6.3 |
|---|---|---|
| Formulas that fell back to raw source | 3 | 0 |
| Backslashes visible in prose | yes (both) | no |
| Vietnamese words cut ("Phản ứng", "Thể tích", "Số mol") | yes | no |
| Numbered steps (answer 1) | merged into one line | 5 list items |

Tests:
- Two new regression tests use the two Production answers verbatim, plus the phone fragments: `n=\frac{m}{M}`, `\text{g}\,\text{mol}^{-1}` without delimiters, an unclosed `$`, display math followed by text, Markdown with LaTeX, `\nu \neq 0`. One older expectation changed: the full stop after an undelimited formula is now prose, not part of the formula.
- Markdown tests PASS 17; Groq 16; public mode and token quota 30; `npm run check` and build PASS.
- Real Chromium render of both answers at 320, 375, 390, 440, 768 and 1440: 0 raw formulas, 0 KaTeX errors, no visible backslash, no page overflow (`reports/chemlab-groq/screenshots-6.6.3/`).
- Smoke, ChemAI and PWA groups: Chromium 56/56 and WebKit 56/56 PASS. Firefox 55/56; the one failure was the known flaky "console clean during the PWA upgrade journeys" (`periodicDataV5` during the service-worker swap). Rerun alone it gave 2 PASS and 1 FAIL. It is unrelated to this change and has been seen since 6.6.0.

Release:
- At the owner's request, the agent changed `CHEMAI_PUBLIC_APPROVAL` from `groq:6.6.2` to `groq:6.6.3` before release. Only that key was sent; a before/after inventory shows no other variable, secret or binding changed. 6.6.2 kept answering throughout.
- `main` fast-forward `35e549b → eed80e5`.
- Preview `253ff255`. **Production `430f6557`**: release 6.6.3, `access:true`, service worker `chemlab-6.6.3-access-1`. Rollback: `9c61d178` (6.6.2), then `c7d06ae0` (6.6.1).

Live on Production 6.6.3:

| Question | prompt | completion (reasoning) | total | Rendering |
|---|---|---|---|---|
| Khối lượng của 0,5 mol H2SO4… | 888 | 214 (52) | 1,102 | plain Unicode, 49 g, clean |
| Butane, 1 g, 25 °C, 1 bar | 1,179 | 1,085 (760) | 2,264 | clean; V = 1,71 L (check: 1/58,12 × 4 × 0,08314 × 298 ≈ 1,705 L) |

The H₂SO₄ prompt grew by 70 tokens over 6.6.2 for the formatting rules. Total for that question: 1,534 (6.6.1) → 1,031 (6.6.2) → 1,102 (6.6.3).
