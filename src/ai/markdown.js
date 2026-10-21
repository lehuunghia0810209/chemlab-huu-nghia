// ChemAI answer Markdown → safe HTML. Pure functions (no DOM), so they run in Node tests.
// Math is cut out BEFORE Markdown/escaping and left as escaped placeholders
// (<span class="chemai-math">source</span>); mathRender.js typesets them with KaTeX.

export function escapeHTML(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const TOKEN = /\u0000(\d+)\u0000/g
// Undelimited LaTeX: a run of ASCII math characters that contains a \command.
// Only locates the run; KaTeX parses it. Vietnamese letters end a run, so prose stays text.
const COMMAND_RUN = /[A-Za-z0-9_^{}\\=+\-*/().,·×→⇌≈<>|' ]*\\[A-Za-z]+[A-Za-z0-9_^{}\\=+\-*/().,·×→⇌≈<>|' ]*/g

function balanced(tex) {
  let depth = 0
  for (const char of tex) {
    if (char === '{') depth += 1
    if (char === '}' && --depth < 0) return false
  }
  return depth === 0
}

function lineEnd(source, from) {
  const end = source.indexOf('\n', from)
  return end === -1 ? source.length : end
}

// Splits `source` into text with \u0000n\u0000 tokens and the list of math pieces.
export function extractMath(source) {
  const maths = []
  const token = (tex, display) => {
    maths.push({ tex: tex.trim(), display })
    return `\u0000${maths.length - 1}\u0000`
  }
  let out = ''
  let index = 0
  while (index < source.length) {
    const char = source[index]
    if (char === '`') {
      const end = source.indexOf('`', index + 1)
      if (end > index) {
        out += source.slice(index, end + 1)
        index = end + 1
        continue
      }
    }
    if (source.startsWith('$$', index)) {
      const end = source.indexOf('$$', index + 2)
      // A single $ inside means this $$ was never closed; do not borrow the next formula's $$.
      if (end > index + 2 && !source.slice(index + 2, end).includes('$')) {
        out += token(source.slice(index + 2, end), true)
        index = end + 2
        continue
      }
      // Unclosed $$ (e.g. `$$V \approx 2,48$ L$`): the rest of the line, stray $ removed.
      const stop = lineEnd(source, index)
      const rest = source.slice(index + 2, stop).replace(/\$/g, ' ').replace(/ {2,}/g, ' ').trim()
      out += rest ? token(rest, true) : ''
      index = stop
      continue
    }
    if (source.startsWith('\\[', index) || source.startsWith('\\(', index)) {
      const display = source[index + 1] === '['
      const end = source.indexOf(display ? '\\]' : '\\)', index + 2)
      if (end > index + 2) {
        out += token(source.slice(index + 2, end), display)
        index = end + 2
        continue
      }
    }
    if (char === '$') {
      const end = source.indexOf('$', index + 1)
      if (end > index + 1 && end < lineEnd(source, index) && source[index + 1] !== ' ' && source[end - 1] !== ' ') {
        out += token(source.slice(index + 1, end), false)
        index = end + 1
        continue
      }
    }
    out += char
    index += 1
  }
  if (out.includes('\\')) {
    out = out.replace(COMMAND_RUN, run => {
      const tex = run.trim()
      if (!balanced(tex)) return run
      const lead = run.slice(0, run.indexOf(tex))
      return `${lead}${token(tex, false)}${run.slice(lead.length + tex.length)}`
    })
  }
  return { text: out, maths }
}

function mathHTML(piece) {
  return piece.display
    ? `<span class="chemai-math chemai-math--display" data-display="1" tabindex="0">${escapeHTML(piece.tex)}</span>`
    : `<span class="chemai-math" data-display="0">${escapeHTML(piece.tex)}</span>`
}

function inlineMarkdown(value, maths) {
  return escapeHTML(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(TOKEN, (_, number) => maths[Number(number)] ? mathHTML(maths[Number(number)]) : '')
}

export function markdownToHTML(markdown) {
  const source = String(markdown ?? '').replace(/\r\n/g, '\n').replace(/\u0000/g, '').trim()
  if (!source) return ''

  const blocks = source.split(/```/)
  const html = []

  blocks.forEach((block, index) => {
    if (index % 2 === 1) {
      const cleaned = block.replace(/^\w+\n/, '').trim()
      html.push(`<pre><code>${escapeHTML(cleaned)}</code></pre>`)
      return
    }

    const { text, maths } = extractMath(block)
    const inline = value => inlineMarkdown(value, maths)
    const lines = text.split('\n')
    let listType = null
    let listItems = []

    const flushList = () => {
      if (!listType || !listItems.length) return
      html.push(`<${listType}>${listItems.join('')}</${listType}>`)
      listType = null
      listItems = []
    }

    for (const rawLine of lines) {
      const line = rawLine.trim()

      if (!line) {
        flushList()
        continue
      }

      const bullet = line.match(/^[-*]\s+(.+)$/)
      const ordered = line.match(/^\d+[.)]\s+(.+)$/)

      if (bullet) {
        if (listType && listType !== 'ul') flushList()
        listType = 'ul'
        listItems.push(`<li>${inline(bullet[1])}</li>`)
        continue
      }

      if (ordered) {
        if (listType && listType !== 'ol') flushList()
        listType = 'ol'
        listItems.push(`<li>${inline(ordered[1])}</li>`)
        continue
      }

      flushList()

      if (/^###\s+/.test(line)) {
        html.push(`<h4>${inline(line.replace(/^###\s+/, ''))}</h4>`)
        continue
      }

      if (/^##\s+/.test(line)) {
        html.push(`<h3>${inline(line.replace(/^##\s+/, ''))}</h3>`)
        continue
      }

      if (/^>\s+/.test(line)) {
        html.push(`<blockquote>${inline(line.replace(/^>\s+/, ''))}</blockquote>`)
        continue
      }

      const equationLike =
        /(?:→|⇌|↔)/.test(line) &&
        /[A-Z][A-Za-z₀-₉⁺⁻²³⁴⁵⁶⁷⁸⁹()\[\]]*/.test(line)

      if (equationLike) {
        html.push(`<div class="chemai-equation">${inline(line)}</div>`)
        continue
      }

      html.push(`<p>${inline(line)}</p>`)
    }

    flushList()
  })

  return html.join('')
}
