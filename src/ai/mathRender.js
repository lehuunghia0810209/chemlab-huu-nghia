// Typesets the math placeholders produced by markdown.js with KaTeX.
// KaTeX (+ mhchem for \ce{…}) and its CSS/fonts are loaded only when an answer
// contains math. If loading fails (offline before first use) or a formula is
// invalid, the readable source text stays in place.
const OPTIONS = Object.freeze({
  throwOnError: true,
  trust: false, // no \href, \url, \includegraphics, \html*
  strict: 'ignore',
  maxSize: 20,
  maxExpand: 300,
  output: 'htmlAndMathml' // MathML for screen readers
})

let loading = null

function loadKatex() {
  loading ||= Promise.all([
    import('katex'),
    import('katex/contrib/mhchem'),
    import('katex/dist/katex.min.css')
  ]).then(([module]) => module.default)
  return loading
}

export function renderMathInto(katex, node) {
  const tex = node.textContent
  node.dataset.typeset = '1'
  // Vietnamese decimal comma: in math mode "0,1" is punctuation + thin space ("0, 1").
  // shortcut: a digit-comma-digit pair like (1,2) is also read as a decimal; fine for chemistry answers.
  const prepared = tex.replace(/(\d),(?=\d)/g, '$1{,}')
  try {
    katex.render(prepared, node, { ...OPTIONS, displayMode: node.dataset.display === '1' })
  }
  catch {
    node.classList.add('chemai-math--raw')
    node.textContent = tex
  }
}

export function typesetMath(root) {
  const nodes = [...root.querySelectorAll('.chemai-math:not([data-typeset])')]
  if (!nodes.length) return Promise.resolve()
  return loadKatex()
    .then(katex => nodes.forEach(node => renderMathInto(katex, node)))
    .catch(() => {
      loading = null
    })
}
