# ChemLab 6.6.4: equation layout, repeated questions, follow-up tokens

Date: 2026-11-14 · Commit `6846d41` · Production `12f7fbc8` · Preview `68b397a2` · Rollback `430f6557` (6.6.3)

Three problems reported by the owner on Production 6.6.3. Evidence is from real Groq answers taken from Production and from Production logs.

## 1. Explanations in a sideways-scrolling one-line box

**Cause (parser, confirmed).** `markdownToHTML` put any non-list line containing an arrow (→ ⇌ ↔) and a capital letter into `.chemai-equation`. That box was `white-space: nowrap; overflow-x: auto`. Lines such as "**Bước 1:** Viết công thức phản ứng chưa cân bằng: N₂ + H₂ → NH₃." and "**Bước 2:** Cân bằng nitơ: N₂ → 2 NH₃ ⇒ cần 2 NH₃ ở vế sản phẩm…" therefore became one-line monospace boxes cut off at the screen edge. The model's content was fine: these are ordinary explanations.

**Fix (`src/ai/markdown.js`, `src/ai/chemAI.css`):**
- A line goes in the box only when it is an equation: formulas, coefficients, `+`, an arrow, state symbols and conditions, with no prose.
- "label: equation" is split: the label is a paragraph, the equation a box.
- Any other line with an arrow is a paragraph.
- Equation boxes wrap between species (`white-space: normal; overflow-wrap: anywhere`); the sideways scroll stays only as a last resort.
- A fenced block with no language (or text/markdown) whose content is Vietnamese prose is rendered as text. Fenced code with a language (for example `python`) stays a code box.

Note: the model separates coefficients with U+202F narrow no-break spaces ("3 Fe"); they are handled as spaces.

Real answer (NH₃ steps from Production 6.6.3 plus the NH₃ explanation), Chromium:

| Width | 6.6.3 boxes / with prose / scrolling sideways | 6.6.4 boxes / with prose / scrolling sideways |
|---|---|---|
| 320 | 6 / 5 / 5 | 5 / 0 / 0 |
| 375 | 6 / 5 / 5 | 5 / 0 / 0 |
| 390 | 6 / 5 / 4 | 5 / 0 / 0 |
| 440 | 6 / 5 / 2 | 5 / 0 / 0 |
| 768 | 6 / 5 / 4 | 5 / 0 / 0 |
| 1440 | 6 / 5 / 4 | 5 / 0 / 0 |

Page overflow is 0 in both. Screenshots: `reports/chemlab-groq/screenshots-6.6.4/before/` (6.6.3 build of `eed80e5`) and `after/`.

## 2. The NH₃ question shown three times

**Cause (frontend, confirmed by reproduction).** `ask()` adds the question to the conversation before the request. On any failure (busy, provider error, timeout, stop) the question stayed in the conversation and in the saved session. "Thử lại", or sending it again, added another copy. Two failures and one retry give three identical bubbles, and the history sent to the server carried the copies too. With the fix disabled, the new browser test reproduces exactly that: `user messages 3`.

Ruled out:
- **Frontend double send.** `pending` is set synchronously before the first `await`, so one press cannot send twice.
- **Backend retries.** They happen inside one request and add no message.

Why failures happen in practice:
- `AI_BUSY` when the site-wide per-minute token budget is in use.
- A provider error seen during this investigation: `502 GROQ_BAD_REQUEST` on a question that answered normally minutes earlier and in four later attempts. The provider's error code for that request was not captured (the log tail was started afterwards), so its cause is **unconfirmed**. Future occurrences log `upstreamCode`.

**Fix (`src/ai/chemAI.js`).** A question that got no answer leaves the conversation and the saved session, and goes back into the empty input. Its bubble stays visible next to the error until the next send, which then shows it once. Retry and resend both show it once and send it once.

## 3. Tokens growing in a conversation

Real usage per request, Production, measured by the server from Groq's `usage`. The script sends the history exactly as the frontend does.

| Turn (history items) | 6.6.3 prompt / total | 6.6.4 prompt / total (cached) |
|---|---|---|
| Fe + O₂ → Fe₃O₄ (0) | 1,270 / 1,490–1,598 (4 runs) | 1,006 / 1,287 (768 cached, charged 519) |
| Cân bằng … NH₃ (6.6.3: 1, 6.6.4: 2) | 1,564 / 1,857 | 1,174 / 1,502 |
| Tại sao … cần xúc tác? (3 / 4) | 1,634 / 2,094 | 1,497 / 2,390 (reasoning 675) |
| Tính khối lượng NH₃ … 2 mol N₂ (5 / 6) | 1,690 / 2,163 | 1,578 / 2,125 |
| Khối lượng của 0,5 mol H2SO4 (0) | 888 / 1,102 | 888 / 1,119 |

The 6.6.3 run had its first turn fail, so its later turns carried one history item less than the 6.6.4 run. Per turn, the 6.6.4 prompts are smaller even with more history.

Where the tokens went (o200k tokenizer, offline, same requests):

| Part | 6.6.3 | 6.6.4 |
|---|---|---|
| Checking rules on every short follow-up | all 8 = 423 | rules of the question plus the previous question: 47–167 |
| Retrieved knowledge, Fe question | 351 (H₂O₂ decompositions sharing O₂, permanganate, 3 lesson titles) | 87 (Fe data, Fe₃O₄ colour) |
| Retrieved knowledge, NH₃ question | 358 | 70 |
| History (5 items) | 333 | 333 (unchanged) |
| Fixed core prompt | 606 | 606 |

Changes (`functions/api/chat.js`, Groq path only):
- `groqRules(message, previousQuestion)`: a short follow-up is matched together with the previous question. Only when nothing matches are all rules sent.
- `focusKnowledge`: a retrieved reaction must contain the substances the question names (two of them when it names two or more). Lesson titles are sent only when the question is about lessons.
- `speciesIn` reads formulas without treating Vietnamese capitals ("Cân") as elements.
- The reaction a question is about stays, with its colours and precipitates (NaOH + CuSO₄ keeps "Cu(OH)₂↓ xanh lam").

What still grows: history (full previous answers, up to 6 items) and reasoning. `medium` reasoning on "why" questions used 675 tokens in one turn. Each turn's quota charge is shown to the learner as before.

Unchanged: chemistry guard, token quota and its limits, Gemini path, CSS outside the equation box.

## 4. Tests

| Check | Result |
|---|---|
| `npm run check`, `npm run build` | PASS |
| Markdown tests (2 new from the real Fe and NH₃ answers: boxes, labels, explanations, fenced prose vs code) | PASS 19 |
| Public mode and token quota (follow-up rules; knowledge filter with the real Fe case; NaOH + CuSO₄ keeps its reaction) | PASS 31 |
| Groq adapter | PASS 16 |
| Browser: busy → retry → provider error → resend shows the question once and sends it once; a failed question returns to the input | PASS. With the fix disabled it fails with `user messages 3` |
| Browser: real NH₃ answer at 320, 375, 390, 440: only equations boxed, none scrolling, nothing outside the panel | PASS |
| Smoke, ChemAI and PWA groups (66 checks) | Chromium, Firefox, WebKit PASS 66/66 |
| Accessibility (axe, 104 scans) | PASS |

## 5. Release

| | |
|---|---|
| `CHEMAI_PUBLIC_APPROVAL` | changed `groq:6.6.3` → `groq:6.6.4` before release (only that key; before/after inventory identical otherwise); 6.6.3 kept answering |
| `main` | fast-forward `eed80e5 → 6846d41` |
| Preview | `68b397a2` (Access: 302 for anonymous) |
| Production | `12f7fbc8`: release 6.6.4, `access:true`, `configured:true`, service worker `chemlab-6.6.4-access-1`, home 200 |
| Rollback | `430f6557` (6.6.3), `9c61d178` (6.6.2) |

## 6. Remaining

- A balanced equation written in bold inside a sentence ("Kết quả: Phương trình đã cân bằng: **3 Fe + 2 O₂ → Fe₃O₄**.") stays a wrapped bold paragraph, not a box. It is readable; a box would need bold markers allowed inside equations.
- The `GROQ_BAD_REQUEST` cause is unconfirmed (see section 2).
- Long conversations still send full previous answers; trimming older answers would save more but risks losing what a follow-up refers to.
