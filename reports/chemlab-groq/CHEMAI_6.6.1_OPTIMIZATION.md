# ChemLab 6.6.1 — ChemAI token optimization and UI fixes

Date: 2026-11-14 · Release commit `06d14e5` · Production `a7f0850c` · Preview `011c8540`

## Verdict

| Area | Status |
|---|---|
| 6.6.1 on Preview and Production | **DEPLOYED AND VERIFIED** |
| Prompt size (measured with a tokenizer) | −34% on average, −41% for the H₂SO₄ question |
| UI defects (chips, footer, stray backslash) | fixed, verified at 6 viewports |
| Real Groq usage before/after | **NOT RUN** by the agent (see section 8) |
| ChemAI on the main site | **still locked**: the owner's approval names 6.6.0 (section 7) |

## 1. Why a simple question cost about 2,350 tokens

The quota was not charged twice and no reservation was left unreturned. The accounting charges exactly `usage.total_tokens` once (mock-tested: reserve, refund, retries, concurrency).

The cost was the input. Every question carried about 2,190 input tokens whatever its size:

| Part of the request (6.6.0, question "Khối lượng của 0,5 mol H₂SO₄…") | Tokens |
|---|---|
| System prompt (the full Gemini-era prompt, all checking rules) | 1,494 |
| Retrieved ChemLab knowledge | 321 |
| Interface context (of which scraped screen text: 242) | 270 |
| Labels, empty history | 84 |
| The question itself | 20 |
| **Input total** | **2,189** |

Add 150–600 output tokens (answer, reasoning, JSON) and the total is the 2,350–2,800 the owner saw. The question was under 1% of the input; the system prompt was 68%.

Method: token counts come from the o200k tokenizer run offline on the exact request bodies. They are not provider usage, but the totals agree with the owner's two observed deltas (2,804 and 2,350).

## 2. What changed

| Change | Effect |
|---|---|
| Groq gets its own short fixed core prompt (797 tokens) instead of the shared 1,494-token prompt | −697 per question |
| Checking rules are sent per question (equation, calculation, element position, phenomena, classification, gases, limiting reagent, organic). Nothing recognised, or a short follow-up → all rules | 47–195 instead of all, always |
| Scraped screen text is sent only when the question points at the screen ("trên màn hình", "bài này"…), capped at 600 characters. Structured state (element, reaction, lesson, lab) is always sent | −240 typical |
| Internal ids and empty fields removed from the knowledge copy sent to the model | small |
| `reasoning_effort` by a local rule: simple → low; everything else → medium | see section 4 |
| Output cap by the same rule: simple 1,000, normal 1,600, complex 2,400 | smaller reservations; long problems get more room |
| Cached prompt tokens are logged and not charged to the learner | applies when Groq reports a cache hit |
| Log line per request: sizes of each input part (characters only), estimate, reserved, refunded, charged, reasoning and cached tokens | measurement |

The fixed core is the first message and identical for every question, which is what Groq's automatic prompt cache needs (exact-prefix match; per Groq's documentation cached tokens are half price and do not count towards rate limits). Whether a 797-token prefix reaches the model's minimum cacheable length is not stated in the documentation, so cache hits are not assumed anywhere.

Unchanged: the Gemini adapter and its prompt, the chemistry guard (`_chemFacts.js`), the safety gate, the quota mechanism, the question text (never cut).

## 3. Token breakdown before and after (tokenizer, 12 questions)

| Question | Class | Input 6.6.0 | Input 6.6.1 | Change |
|---|---|---|---|---|
| Khối lượng của 0,5 mol H₂SO₄… | simple | 2,189 | 1,281 | −41% |
| Tính pH của dung dịch HCl 0,01 M | simple | 2,114 | 1,206 | −43% |
| Cân bằng Fe + O2 → Fe3O4 | simple | 2,266 | 1,478 | −35% |
| Axit là gì? | simple | 2,123 | 1,512 | −29% |
| Cấu hình electron của Na | simple | 1,979 | 1,130 | −43% |
| Khối lượng mol của glucose | simple | 2,098 | 1,475 | −30% |
| HCl + NaOH, viết phương trình | normal | 2,185 | 1,310 | −40% |
| Vị trí của K trong bảng tuần hoàn | normal | 2,125 | 1,276 | −40% |
| Nồng độ mol NaCl 5,85 g / 500 mL | normal | 2,275 | 1,445 | −36% |
| 5,6 g Fe + HCl dư, V H2 (đkc) | normal | 2,066 | 1,564 | −24% |
| NaOH + CuSO4, hiện tượng | normal | 2,088 | 1,574 | −25% |
| Hỗn hợp Fe, Cu + HCl, hiệu suất 80% | complex | 2,165 | 1,663 | −23% |
| **Mean** | | **2,139** | **1,410** | **−34%** |

These rows were measured before the knowledge slimming was added, so the shipped inputs are slightly lower. Output tokens cannot be measured offline.

**Expected per-question charge:** input 1,130–1,660 plus output. For the H₂SO₄ question that is roughly 1,450–1,600 instead of 2,350, if the output stays the same. This is a projection, not a measurement.

## 4. Accuracy

- Nothing that carries chemistry was removed: the question, all numbers and units, retrieved knowledge (names, formulas, equations, colours, strengths, conditions) and the structured interface state are always sent. Tests assert this.
- Every rule of the old prompt still exists; it is sent when its trigger appears, and all of them are sent when the question is not recognised.
- Reasoning: simple questions keep `low` (what 6.6.0 used for everything). Other questions now use `medium`, as specified. That raises output tokens for multi-step problems compared with 6.6.0; it was chosen for accuracy, not saving. `high` is used only if `GROQ_REASONING_EFFORT=high` is set.
- Chemistry regression suites (guard 23, chemistry core 49, eval grader 9) pass. They do not exercise the live model.
- **The effect on real answer quality is NOT measured.** The new core prompt has never been used in a live call.

## 5. UI fixes

Screenshots: `reports/chemlab-groq/screenshots-6.6.1/before/` and `after/`, widths 320, 375, 390, 440, 768, 1440.

| Defect | Cause | Fix |
|---|---|---|
| Suggestion text overlapping the next chip and running out of the panel | chips had `white-space: nowrap` and a `max-width` but no overflow rule, so long text painted outside its chip | text is cut with an ellipsis inside the chip; full text in the tooltip; the row scrolls sideways with snap; the prompt asks for suggestions under 60 characters |
| Footer squeezed into two wrapping columns | two long texts in one `space-between` row inside a 420 px panel | footer stacks in one column |
| Lone `\` lines and raw LaTeX in answers | the model escaped LaTeX twice, including the delimiters (`\\[ … \\]`); the renderer matched the inner `\[` and left the outer backslashes as text | doubled delimiters are recognised; an answer whose every command is doubled is unescaped exactly once; a correct answer with a real `\\` line break is left alone; the prompt now says "exactly once" and forbids `\[ \]` |
| Composer hint and character count colliding on narrow panels | no shrink rule | the hint truncates, the count keeps its width |

Layout metrics from a real browser (Chromium), before → after, all 6 widths:

| Metric | Before | After |
|---|---|---|
| Chip text spilling out of its chip | yes (6/6 widths) | no |
| Footer columns (768, 1440) | 2, four lines | 1 |
| Stray backslash or raw LaTeX in the answer | yes (6/6) | no |
| KaTeX formulas rendered / errors | 4 / 0 | 5 / 0 |
| Chip height on phones | 44 px | 44 px |
| Suggestions inside the panel and above the input | yes | yes |
| Token line visible, page overflow | yes, 0 | yes, 0 |

The "before" answer in the screenshots is a constructed double-escaped sample, not a captured model reply; the owner's actual text was not available.

## 6. Tests

| Check | Result |
|---|---|
| `npm run check` (chemistry 49, learning 242, questions 783, exam 84 + 850, UI 78, ChemAI suites) | PASS |
| Groq adapter mock | PASS 16 |
| Public mode + token quota (now also: prompt core, rule selection, complexity, context focus, cached tokens) | PASS 29 |
| Markdown/KaTeX (3 new tests: doubled delimiters, doubled answer, the 6.6.1 rendering set) | PASS 14 |
| Build | PASS |
| Browser smoke Chromium / Firefox / WebKit, with new chip and footer regression checks at 1280, 390, 320 | PASS 429/429 each, first run |
| Accessibility (axe, 104 scans) | PASS |
| Six-viewport layout script | PASS (table above) |
| Local Cloudflare runtime | PASS 10/10 |
| `npm audit`, secret scan (source and `dist/`) | 0 vulnerabilities; only the fake test key |
| Phone on-screen keyboard | NOT RUN (no real device; layout checked at phone widths only) |
| Live Groq benchmark | NOT RUN |

## 7. Preview and Production

| | State |
|---|---|
| Preview `011c8540` | 6.6.1, `internal_testing`, behind Cloudflare Access (302 for anonymous) |
| Production `a7f0850c` | 6.6.1; `/`, service worker, manifest 200; cache `chemlab-6.6.1-access-1`; Learning, Practice, Virtual Lab and learner data across the service-worker update PASS in three browsers |
| Production ChemAI | **locked**: `GET /api/chat` → `access:false`; anonymous POST → 403 |
| Rollback | `56a6f0aa` (6.6.0); older `afea91b9` (6.5.4). Nothing deleted. |

Production variables found (names and non-secret values only): `CHEMAI_ACCESS_MODE=public`, `CHEMAI_PUBLIC_HOSTS=chemlab-edulab.pages.dev`, `CHEMAI_PUBLIC_APPROVAL=groq:6.6.0`, `GROQ_API_KEY` (secret), `CHEMAI_BUDGET` binding. `CHEMAI_PROVIDER` is gone, so Groq is the default.

Two facts follow:
- **6.6.0 never answered on the main site.** Deployment `56a6f0aa` was created before these variables were set, and Pages freezes variables per deployment; it was checked locked before this release. The real answers the owner saw came from the Preview.
- **6.6.1 is locked for a different reason:** the approval is bound to one release and still says `groq:6.6.0`. This is the gate working as designed. The agent did not change the variable: it is the owner's statement about the provider's terms.

**To open ChemAI on the main site:** set `CHEMAI_PUBLIC_APPROVAL` to `groq:6.6.1` in Production and retry deployment `a7f0850c`. Then `GET /api/chat` should return `access:true, configured:true, provider:"Groq"` and a `quota` object.

## 8. Limits and open items

- **No real Groq measurement by the agent.** The Preview is behind Access, the Chrome extension was not connected, and Production is locked. The owner can measure in one minute on the Preview: ask the same H₂SO₄ question and compare the token line before and after; the response JSON also carries `usage` (`promptTokens`, `completionTokens`, `reasoningTokens`, `cachedTokens`, `charged`).
- Answer quality with the shorter prompt and `medium` reasoning is untested live. Watch for cut-off answers (`AI_INCOMPLETE`) on long problems and for wrong classification of a hard question as simple.
- The complexity and rule triggers are keyword rules. A miss on the rule side falls back to all rules; a hard question worded like a simple one would get `low` reasoning and a 1,000-token cap.
- Groq's terms (18+, not for consumer use) versus a student audience remain the owner's decision; nothing in this release changes that.
- Site capacity is still bounded by the provider's tokens-per-minute limit; smaller reservations (about 2,200–3,300 instead of 3,800) allow roughly two to three questions a minute instead of one to two.
- Suggestions longer than a chip are truncated; the full text is in the tooltip, which touch screens do not show. Tapping still sends the full question.
- Firefox's PWA-upgrade console check was flaky in 6.6.0; it passed first time here.
