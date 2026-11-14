// ChemAI answer rendering: Markdown + math placeholders + KaTeX, and XSS safety.
// KaTeX runs here with the same options as the browser (mathRender.js).
import assert from 'node:assert/strict'
import katex from 'katex'
import { markdownToHTML, extractMath, undoubleBackslashes } from '../src/ai/markdown.js'
import { renderMathInto } from '../src/ai/mathRender.js'

let passed = 0
function test(name, fn) {
  try {
    fn()
    passed += 1
  }
  catch (error) {
    console.error(`FAIL — ${name}`)
    throw error
  }
}

const maths = text => extractMath(text).maths.map(item => `${item.display ? 'D' : 'I'}:${item.tex}`)

// Minimal DOM node for renderMathInto (KaTeX's render needs only these members).
function node(tex, display) {
  const element = {
    textContent: tex,
    dataset: { display: display ? '1' : '0' },
    classList: { added: [], add(name) { this.added.push(name) } },
    html: '',
    set innerHTML(value) { this.html = value },
    get innerHTML() { return this.html }
  }
  return element
}
const fakeKatex = { render: (tex, element, options) => { element.innerHTML = katex.renderToString(tex, options) } }
const typeset = (tex, display = false) => {
  const element = node(tex, display)
  renderMathInto(fakeKatex, element)
  return element
}

test('6.6.3: an exponent inside \\text (a unit like g·mol⁻¹) still typesets; broken math stays raw', () => {
  for (const tex of ['M = 98\\ \\text{g·mol^{-1}}', 'M = 98\\ \\text{g\\,mol^{-1}}', '98\\ \\text{g mol^-}']) {
    const element = typeset(tex)
    assert.deepEqual(element.classList.added, [], tex)
    assert.match(element.innerHTML, /katex/, tex)
  }
  assert.match(typeset('m = 49\\ \\text{g}').innerHTML, /katex/, 'valid units untouched')
  assert.deepEqual(typeset('\\frac{1}{').classList.added, ['chemai-math--raw'])
})

test('delimiters: $…$, $$…$$, \\(…\\), \\[…\\]', () => {
  assert.deepEqual(maths('a $n = \\frac{m}{M}$ b'), ['I:n = \\frac{m}{M}'])
  assert.deepEqual(maths('$$C_M = \\frac{n}{V}$$'), ['D:C_M = \\frac{n}{V}'])
  assert.deepEqual(maths('x \\(3Fe + 2O_2 \\rightarrow Fe_3O_4\\) y'), ['I:3Fe + 2O_2 \\rightarrow Fe_3O_4'])
  assert.deepEqual(maths('\\[ V = 0,1 \\times 24,79 = 2,479 \\text{ L} \\]'), ['D:V = 0,1 \\times 24,79 = 2,479 \\text{ L}'])
})

test('multi-line display math stays one formula', () => {
  assert.deepEqual(maths('$$\nn = \\frac{4,48}{22,4}\n= 0,2\n$$'), ['D:n = \\frac{4,48}{22,4}\n= 0,2'])
})

test('broken delimiters fall back to readable math, the rest of the answer survives', () => {
  const html = markdownToHTML('Kết quả:\n$$V \\approx 2,48$ L$\nĐơn vị là lít.')
  assert.match(html, /chemai-math--display[^>]*>V \\approx 2,48 L</)
  assert.match(html, /<p>Đơn vị là lít\.<\/p>/)
  assert.deepEqual(maths('Giá 5$ và 7$'), [], 'a lone or spaced $ is text')
  assert.deepEqual(maths('$$V \\approx 2,48$ L$\n$$m = 5 \\text{ g}$$'), ['D:V \\approx 2,48 L', 'D:m = 5 \\text{ g}'], 'a broken line does not swallow the next formula')
})

test('LaTeX without delimiters is found; Vietnamese prose stays text', () => {
  // 6.6.3: the sentence's full stop is prose, not part of the formula.
  assert.deepEqual(maths('Thay số: n = \\frac{5,6}{56} = 0,1 mol.'), ['I:n = \\frac{5,6}{56} = 0,1 mol'])
  assert.deepEqual(maths('Ta có \\text{unbalanced{ here'), [])
  assert.deepEqual(maths('Không có công thức nào ở đây.'), [])
})

test('code spans and code blocks are never math', () => {
  assert.deepEqual(maths('dùng `$x$` trong code'), [])
  assert.doesNotMatch(markdownToHTML('```\n$$a$$\n```'), /chemai-math/)
})

test('Markdown, numbered steps and math together', () => {
  const html = markdownToHTML('**Bước 1:** tính $n$\n\n1. $n = \\frac{m}{M}$\n2. $m = 49\\text{ g}$\n\n3Fe + 2O₂ → Fe₃O₄')
  assert.match(html, /<strong>Bước 1:<\/strong> tính <span class="chemai-math"/)
  assert.match(html, /<ol><li><span class="chemai-math" data-display="0">n = \\frac\{m\}\{M\}<\/span><\/li><li>/)
  assert.match(html, /<div class="chemai-equation">3Fe \+ 2O₂ → Fe₃O₄<\/div>/)
})

test('KaTeX renders the five required formula kinds with MathML', () => {
  for (const tex of ['n = \\frac{m}{M}', '3Fe + 2O_2 \\rightarrow Fe_3O_4', 'C_M = \\frac{n}{V}', 'm = 0,5 \\text{ mol} \\times 98 \\text{ g/mol} = 49 \\text{ g}', '\\ce{CuSO4 + 2NaOH -> Cu(OH)2 v + Na2SO4}']) {
    const element = typeset(tex, true)
    if (tex.startsWith('\\ce')) continue // mhchem is loaded in the browser bundle only
    assert.match(element.innerHTML, /class="katex-display"/, tex)
    assert.match(element.innerHTML, /<math/, tex)
    assert.equal(element.classList.added.length, 0, tex)
  }
})

test('Vietnamese decimal commas render without a gap (0,1 not "0, 1"); list commas keep theirs', () => {
  const spaces = element => (element.innerHTML.match(/class="mspace"/g) || []).length
  for (const number of ['0,1', '24,79', '2,479']) assert.equal(spaces(typeset(number)), 0, number)
  assert.equal(spaces(typeset('f(x, y)')), 1)
  const fallback = typeset('\\frac{0,5}{', false)
  assert.equal(fallback.textContent, '\\frac{0,5}{', 'the raw fallback keeps the original source')
})

test('invalid TeX keeps the readable source', () => {
  const element = typeset('\\frac{a}{', false)
  assert.deepEqual(element.classList.added, ['chemai-math--raw'])
  assert.equal(element.textContent, '\\frac{a}{')
})

test('XSS: HTML, javascript: links and dangerous TeX never become live markup', () => {
  const html = markdownToHTML('<img src=x onerror=alert(1)> $<script>alert(1)</script>$ **<b onclick=x>b</b>** [x](javascript:alert(1))')
  assert.doesNotMatch(html, /<img|<script|<b |<a /, 'no live tag')
  assert.doesNotMatch(html, /<[^>]*\son\w+=/, 'no event handler inside a real tag')
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/)
  for (const tex of ['\\href{javascript:alert(1)}{x}', '\\url{javascript:alert(1)}', '\\htmlClass{x}{y}', '\\includegraphics{https://evil.example/a.png}']) {
    const element = typeset(tex, false)
    // The source may appear as escaped text in <annotation>; what matters is that no link, image or custom class is produced.
    assert.doesNotMatch(element.innerHTML, /<a[\s>]|\shref=|\ssrc=|<img|class="x"/, tex)
  }
  const flood = typeset('\\def\\a{\\a\\a}\\a', false)
  assert.ok(flood.classList.added.includes('chemai-math--raw'), 'macro expansion bomb is stopped')
})

test('NUL characters from the model cannot forge math tokens', () => {
  assert.doesNotMatch(markdownToHTML('a \u00000\u0000 b'), /chemai-math/)
})

// 6.6.1: the model sometimes escapes LaTeX twice; a lone backslash must never reach the page.
const BS = String.fromCharCode(92)
const typeset661 = html => [...html.matchAll(/<span class="chemai-math[^"]*" data-display="(\d)"[^>]*>([^<]*)<\/span>/g)].map(([, display, tex]) => {
  const source = tex.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  return katex.renderToString(source, { displayMode: display === '1', throwOnError: true, strict: 'ignore' })
})
const visibleText = html => html.replace(/<span class="chemai-math[^>]*>[^<]*<\/span>/g, '').replace(/<[^>]+>/g, '')
// tex`…` keeps backslashes as typed; D doubles every backslash, like an over-escaped answer.
const tex = String.raw
const D = value => value.split(BS).join(BS + BS)

test('delimiters escaped twice become one display formula, no stray backslash', () => {
  const formula = tex`m = 0{,}5\ \text{mol} \times 98\ \text{g/mol} = 49\ \text{g}`
  const answer = ['Công thức:', '', D(tex`\[`), D(formula), D(tex`\]`), '', 'Vậy m = 49 g.'].join('\n')
  const html = markdownToHTML(answer)
  assert.deepEqual(maths(answer), [`D:${formula}`])
  assert.ok(!visibleText(html).includes(BS), visibleText(html))
  assert.equal(typeset661(html).length, 1)
  const inline = markdownToHTML(`Ta có ${D(tex`\(n = \dfrac{m}{M}\)`)} nên m = n·M.`)
  assert.ok(!visibleText(inline).includes(BS), visibleText(inline))
  assert.equal(typeset661(inline).length, 1)
})

test('an answer escaped twice throughout is undone exactly once; a mixed answer is left alone', () => {
  const correct = tex`Khối lượng: $m = n \times M = 0{,}5 \times 98 = 49\ \text{g}$`
  assert.equal(undoubleBackslashes(D(correct)), correct)
  assert.equal(undoubleBackslashes(correct), correct)
  const html = markdownToHTML(D(correct))
  assert.ok(!visibleText(html).includes(BS), visibleText(html))
  assert.match(typeset661(html)[0], /×/)
  // Correct LaTeX with a real line break keeps its double backslash.
  const aligned = tex`$$\begin{aligned} n &= 0{,}1\ \text{mol} \\ m &= 5{,}6\ \text{g} \end{aligned}$$`
  assert.equal(undoubleBackslashes(aligned), aligned)
  assert.equal(typeset661(markdownToHTML(aligned)).length, 1)
})

test('6.6.1 rendering set: formulas, fractions, indices, equations, multi-line, Markdown with LaTeX', () => {
  const cases = {
    'unicode formula': ['Dung dịch H₂SO₄ loãng.', 0],
    'm = n × M': [tex`Công thức $m = n \times M$.`, 1],
    'fraction': [tex`$C_M = \dfrac{n}{V} = \dfrac{0{,}1}{0{,}5} = 0{,}2\ \text{M}$`, 1],
    'indices': [tex`Ion $Fe^{3+}$ và $SO_4^{2-}$; $M_{H_2SO_4} = 98$`, 3],
    'chemical equation': ['2NaOH + H₂SO₄ → Na₂SO₄ + 2H₂O', 0],
    'multi-line display': [['$$', tex`\begin{aligned}`, tex`n &= 0{,}5\ \text{mol} \\`, tex`m &= 49\ \text{g}`, tex`\end{aligned}`, '$$'].join('\n'), 1],
    'markdown + latex': [[tex`1. **Bước 1:** $n = \dfrac{m}{M}$`, tex`2. **Kết quả:** $m = 49\ \text{g}$`, '', tex`- pH = $-\log[H^+] = 2$`].join('\n'), 3],
    'display delimiters': [tex`\[ pH = -\log(0{,}01) = 2 \]`, 1]
  }
  for (const [name, [answer, count]] of Object.entries(cases)) {
    const html = markdownToHTML(answer)
    assert.equal(typeset661(html).length, count, name)
    assert.ok(!visibleText(html).includes(BS), `${name}: ${visibleText(html)}`)
    assert.ok(!visibleText(html).includes('$'), name)
  }
  assert.match(markdownToHTML(cases['chemical equation'][0]), /chemai-equation/)
})

// 6.6.3: real Groq answers from Production 6.6.2 (butane, 1 g, 25 °C, 1 bar), verbatim from the API.
// They mix Unicode formulas with LaTeX, often without $…$, and escape some newlines twice.
const REAL_BUTANE = [
  JSON.parse(String.raw`"**ChemLab đối chiếu tự động và thấy điểm cần lưu ý trong câu trả lời bên dưới:**\n- Phương trình 2O₂ → 4CO₂ + 5H₂O chưa cân bằng.\n\n1. Phương trình đốt cháy: C₄H₁₀ + \\frac{13}{2}\\,O₂ → 4\\,CO₂ + 5\\,H₂O\\n2. Số mol butan: $n_{C₄H₁₀}=\\frac{1\\ \\text{g}}{58.12\\ \\text{g·mol^{-1}}}=0.0172\\ \\text{mol}$\\n3. Theo tỉ lệ 1 mol C₄H₁₀ sinh 4 mol CO₂: $n_{CO₂}=0.0172\\times4=0.0688\\ \\text{mol}$\\n4. Thể tích CO₂ ở 25°C, 1 bar: $V=n\\cdot V_m=0.0688\\ \\text{mol}\\times24.79\\ \\text{L·mol^{-1}}=1.70\\ \\text{L}$"`),
  JSON.parse(String.raw`"1. Khối lượng C₄H₁₀ = 1 g ⇒ n = \\frac{1}{58.12}\\,\\text{mol}=0.0172\\,\\text{mol}. 2. Phản ứng: C₄H₁₀+ \\frac{13}{2}O₂ → 4\\,CO₂+5\\,H₂O, mỗi mol C₄H₁₀ tạo 4\\,mol CO₂ ⇒ n(CO₂)=0.0172×4=0.0688\\,\\text{mol}. 3. Thể tích CO₂ ở 25 °C, 1 bar: V = n·RT/P = 0.0688·0.08314·298 = 1.70\\,\\text{L} ≈ 1.7\\,\\text{L}."`)
]
// What the learner sees: every math placeholder typeset by real KaTeX, plus the prose around it.
const learnerView = answer => {
  const html = markdownToHTML(answer)
  const spans = [...html.matchAll(/<span class="chemai-math[^"]*" data-display="(\d)"[^>]*>([^<]*)<\/span>/g)]
    .map(([, display, tex]) => typeset(tex.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&'), display === '1'))
  const prose = html.replace(/<span class="chemai-math[^>]*>[^<]*<\/span>/g, ' ').replace(/<[^>]+>/g, ' ')
  return { html, spans, raw: spans.filter(span => span.classList.added.includes('chemai-math--raw')).length, prose }
}

test('6.6.3: real butane answers render with no raw LaTeX and no broken Vietnamese words', () => {
  for (const [index, answer] of REAL_BUTANE.entries()) {
    const view = learnerView(answer)
    assert.equal(view.raw, 0, `answer ${index}: every formula typesets`)
    assert.ok(!view.prose.includes('\\'), `answer ${index}: no backslash in prose: ${view.prose}`)
    assert.ok(view.spans.length >= 4, `answer ${index}: formulas found`)
    for (const word of ['Phản ứng', 'Thể tích', 'CO₂']) if (answer.includes(word)) assert.ok(view.prose.includes(word), `answer ${index}: "${word}" intact`)
  }
  // Newlines escaped twice become real list items again.
  assert.equal((learnerView(REAL_BUTANE[0]).html.match(/<li>/g) || []).length, 5)
  assert.match(learnerView(REAL_BUTANE[0]).prose, /Số mol butan/)
})

test('6.6.3: fragments seen on the phone, delimiters missing or broken', () => {
  const cases = [
    String.raw`Ta có n=\frac{m}{M} nên m = n·M.`,
    String.raw`M(C₄H₁₀) = 58 \text{g}\,\text{mol}^{-1}`,
    String.raw`Đơn vị: \text{g}\,\text{mol}^{-1}; thể tích mol 24,79 L/mol.`,
    String.raw`Kết quả $V = 1,70\ \text{L}`,
    String.raw`**Bước 2:** $n_{CO_2} = 4 \times 0,0172 = 0,0688\ \text{mol}$ và 2C₄H₁₀ + 13O₂ → 8CO₂ + 10H₂O`,
    String.raw`$$n = \frac{m}{M}$$` + '\n' + String.raw`m = 1\ \text{g}`
  ]
  for (const answer of cases) {
    const view = learnerView(answer)
    assert.equal(view.raw, 0, answer)
    assert.ok(!view.prose.includes('\\'), `${answer} → ${view.prose}`)
  }
  // Equations and subscripts written in Unicode stay text and keep their equation styling.
  assert.match(learnerView(cases[4]).html, /chemai-equation|8CO₂/)
  // \nu and \neq are commands, never newlines.
  assert.equal(learnerView(String.raw`$\nu \neq 0$`).raw, 0)
  assert.match(learnerView(String.raw`$\nu \neq 0$`).spans[0].innerHTML, /katex/)
})

console.log(`PASS — ${passed} ChemAI rendering checks passed.`)
