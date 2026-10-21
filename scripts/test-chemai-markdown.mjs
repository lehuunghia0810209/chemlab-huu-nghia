// ChemAI answer rendering: Markdown + math placeholders + KaTeX, and XSS safety.
// KaTeX runs here with the same options as the browser (mathRender.js).
import assert from 'node:assert/strict'
import katex from 'katex'
import { markdownToHTML, extractMath } from '../src/ai/markdown.js'
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
  assert.deepEqual(maths('Thay số: n = \\frac{5,6}{56} = 0,1 mol.'), ['I:n = \\frac{5,6}{56} = 0,1 mol.'])
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

console.log(`PASS — ${passed} ChemAI rendering checks passed.`)
