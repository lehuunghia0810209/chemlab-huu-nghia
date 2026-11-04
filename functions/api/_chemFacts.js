// Deterministic chemistry facts and checks for ChemAI. They run after the model, cost no
// Neurons and work the same offline, so a rule here can be proven by a test. They catch
// known classes of error; a clean result does not mean an answer has been verified.
import { PRECIPITATES } from '../../src/lab/engine/precipitates.js'
import { compareSides, parseEquation } from '../../src/chem/equation.js'

const WB = '(?<![\\p{L}\\p{N}])'
const WE = '(?![\\p{L}\\p{N}])'

// Text for matching: math unwrapped, reaction arrows unified, Unicode sub/superscripts to ASCII, decimal comma to dot.
export function plainChem(text) {
  return String(text)
    .replace(/\$+/g, ' ')
    .replace(/\\x(?:long)?(?:left)?(?:right)?arrow\s*(?:\[[^\]]*\])?\s*\{(?:[^{}]|\{[^{}]*\})*\}/g, '→')
    .replace(/\\(?:overset|stackrel)\s*\{(?:[^{}]|\{[^{}]*\})*\}\s*\{\s*\\?(?:rightarrow|longrightarrow|to|→)\s*\}/g, '→')
    .replace(/->\[[^\]]*\]/g, '→')
    .replace(/\\(?:text|mathrm|mathbf|ce)\s*\{([^{}]*)\}/g, '$1')
    .replace(/\\d?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '$1/$2')
    .replace(/\\(?:rightarrow|longrightarrow|to)\b/g, '→')
    .replace(/\\rightleftharpoons\b/g, '⇌')
    .replace(/\\downarrow\b/g, '↓')
    .replace(/\\uparrow\b/g, '↑')
    .replace(/\\approx\b/g, '≈')
    .replace(/\\times\b/g, '×')
    .replace(/\\cdot\b/g, '·')
    .replace(/\\circ\b/g, '°')
    .replace(/\\Delta\b/g, '')
    .replace(/\\(?:left|right)\b|\\[,;:! ]|\\[()[\]]/g, ' ')
    .replace(/[_^]\{([^{}]*)\}/g, '$1')
    .replace(/[_^]/g, '')
    .replace(/[{}]/g, '')
    .replace(/[₀-₉]/g, char => String(char.charCodeAt(0) - 0x2080))
    .replace(/[⁰¹²³⁴-⁹]/g, char => String('⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(char)))
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/\s+/g, ' ')
}

const lines = text => String(text).normalize('NFC').split('\n').map(plainChem)
const sentences = text => lines(text).flatMap(line => line.split(/[.;:!?](?=\s|$)/)).map(item => item.trim()).filter(Boolean)

// ---------------- verified properties ----------------

// PRECIPITATES is what the Virtual Lab shows. These oxides are not lab precipitates.
const OXIDE_COLORS = Object.freeze({ CuO: 'đen', Fe2O3: 'đỏ nâu', Fe3O4: 'đen', ZnO: 'trắng', MgO: 'trắng', Al2O3: 'trắng', CaO: 'trắng' })
export const SOLID_COLORS = Object.freeze({
  ...Object.fromEntries(Object.entries(PRECIPITATES).map(([formula, item]) => [formula, item.label])),
  ...OXIDE_COLORS
})

// Fe(OH)₂ darkens in air and textbooks word it differently, so its colour is not checked.
const UNCHECKED_COLORS = new Set(['trắng xanh'])
const ACCEPTED_COLORS = Object.freeze({
  'xanh lam': ['xanh lam', 'xanh dương', 'xanh da trời', 'xanh'],
  xanh: ['xanh', 'xanh lam', 'xanh lục', 'xanh lá', 'xanh dương'],
  'nâu đỏ': ['nâu đỏ', 'đỏ nâu', 'nâu'],
  'đỏ nâu': ['nâu đỏ', 'đỏ nâu', 'nâu'],
  'keo trắng': ['trắng'],
  trắng: ['trắng'],
  'vàng nhạt': ['vàng'],
  vàng: ['vàng'],
  'đỏ gạch': ['đỏ gạch', 'đỏ'],
  'nâu đen': ['nâu đen', 'đen', 'nâu'],
  đen: ['đen']
})
const COLOR_WORD = 'xanh (?:lục|lá|lam|dương|da trời|thẫm|đậm|nhạt)|xanh|trắng|đen|vàng|nâu đỏ|đỏ nâu|nâu đen|đỏ gạch|nâu|đỏ|tím|cam|hồng|xám'

const STRONG_BASES = new Set(['NaOH', 'KOH', 'LiOH', 'RbOH', 'CsOH', 'Ca(OH)2', 'Sr(OH)2', 'Ba(OH)2'])
const ALKALI = new Set(['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr'])
const STRONG_ACIDS = new Set(['HCl', 'HBr', 'HI', 'HNO3', 'H2SO4', 'HClO4'])
const WEAK_ACIDS = new Set(['CH3COOH', 'HCOOH', 'H2CO3', 'HF', 'H2S', 'H2SO3', 'HClO', 'HNO2'])
const STRONG_ANIONS = ['ClO4', 'NO3', 'SO4', 'Cl', 'Br', 'I']
const WEAK_ANIONS = ['CH3COO', 'HCO3', 'CO3', 'HSO3', 'SO3', 'PO4', 'F', 'S']
const METAL = '(?:Li|Na|K|Rb|Cs|Mg|Ca|Sr|Ba|Al|Zn|Fe|Cu|Ag|Pb|Mn|Cr|Ni|Hg|Sn)'
const HYDROXIDE = new RegExp(`(?<![A-Za-z0-9)])(${METAL})(?:OH|\\(OH\\)\\d)(?![A-Za-z0-9])`, 'g')
const FORMULA_AT = formula => formula.replace(/[()]/g, char => `\\${char}`)

// Formulas are matched as ASCII and shown to the learner with subscripts.
const shown = formula => formula.replace(/(?<=[A-Za-z)])\d+/g, digits => [...digits].map(digit => '₀₁₂₃₄₅₆₇₈₉'[digit]).join(''))

const has = (formula, text) => new RegExp(`(?<![A-Za-z0-9)])${FORMULA_AT(formula)}(?![A-Za-z0-9])`).test(text)

function saltParts(formula) {
  for (const anion of [...STRONG_ANIONS, ...WEAK_ANIONS]) {
    const match = new RegExp(`^(NH4|${METAL})\\d*(?:\\(${anion}\\)\\d|${anion}\\d*)$`).exec(formula)
    if (match) return { cation: match[1], anion }
  }
  return null
}
const baseIsStrong = cation => ['Na', 'K', 'Li', 'Rb', 'Cs', 'Ca', 'Sr', 'Ba'].includes(cation)

// Facts for the model: only properties ChemLab holds, for substances the question names.
export function substanceFacts(text) {
  const scan = lines(text).join(' ')
  const facts = []
  for (const [formula, color] of Object.entries(SOLID_COLORS)) {
    if (UNCHECKED_COLORS.has(color) || !has(formula, scan)) continue
    facts.push({ formula, color })
  }
  const add = (formula, kind) => {
    const known = facts.find(item => item.formula === formula)
    if (known) known.kind = kind
    else facts.push({ formula, kind })
  }
  for (const match of scan.matchAll(HYDROXIDE)) add(match[0], STRONG_BASES.has(match[0]) ? 'base mạnh' : 'base yếu')
  for (const formula of STRONG_ACIDS) if (has(formula, scan)) add(formula, 'acid mạnh')
  for (const formula of WEAK_ACIDS) if (has(formula, scan)) add(formula, 'acid yếu')
  return facts
}

// ---------------- checks ----------------

const NOT_THIS = /không phải|không thuộc|không là|khác với|chứ không/i

function colorFindings(text) {
  const found = []
  const flag = (formula, said) => {
    const label = SOLID_COLORS[formula]
    if (UNCHECKED_COLORS.has(label) || ACCEPTED_COLORS[label]?.includes(said)) return
    found.push({ id: `color:${formula}`, severity: 'error', note: `${shown(formula)} có màu ${label} theo dữ liệu ChemLab.` })
  }
  const solids = Object.keys(SOLID_COLORS)
  const scan = lines(text).join('\n')
  const equationSolids = [...new Set(solids.filter(formula => new RegExp(`${FORMULA_AT(formula)}\\s*↓`).test(scan)))]
  const afterPrecipitate = new RegExp(`${WB}kết tủa(?: có)?(?: màu)? (${COLOR_WORD})${WE}`, 'iu')
  for (const sentence of sentences(text)) {
    if (NOT_THIS.test(sentence)) continue
    const named = solids.filter(formula => has(formula, sentence))
    for (const formula of named) {
      const adjacent = new RegExp(`(?<![A-Za-z0-9)])${FORMULA_AT(formula)}(?![A-Za-z0-9])\\s*[(,]?\\s*(?:(?:là|có|kết tủa|chất rắn|màu)\\s+)*(${COLOR_WORD})${WE}`, 'iu').exec(sentence)
      if (adjacent) flag(formula, adjacent[1].toLowerCase())
    }
    const precipitate = afterPrecipitate.exec(sentence)
    if (!precipitate) continue
    const candidates = named.length ? named : equationSolids
    if (candidates.length === 1) flag(candidates[0], precipitate[1].toLowerCase())
  }
  return found
}

function classificationFindings(text) {
  const found = []
  const scan = lines(text).join('\n')
  const hydroxides = [...new Set([...scan.matchAll(HYDROXIDE)].map(match => match[1]))]
  if (hydroxides.length && hydroxides.every(metal => !ALKALI.has(metal))) {
    for (const sentence of sentences(text)) {
      if (!NOT_THIS.test(sentence) && new RegExp(`${WB}hydroxide(?: của)?(?: một)? kim loại kiềm(?! thổ)${WE}`, 'iu').test(sentence)) {
        found.push({ id: 'class:alkali-hydroxide', severity: 'error', note: `Hydroxide của ${hydroxides.join(', ')} không phải hydroxide của kim loại kiềm (kim loại kiềm thuộc nhóm IA).` })
      }
    }
  }
  for (const sentence of sentences(text)) {
    if (NOT_THIS.test(sentence)) continue
    for (const match of sentence.matchAll(HYDROXIDE)) {
      const strong = STRONG_BASES.has(match[0])
      const rest = sentence.slice(match.index, match.index + match[0].length + 40)
      if (!strong && /(?:base|bazơ|kiềm) mạnh/iu.test(rest)) found.push({ id: `class:base:${match[0]}`, severity: 'error', note: `${shown(match[0])} là base yếu.` })
      if (strong && /base yếu/iu.test(rest)) found.push({ id: `class:base:${match[0]}`, severity: 'error', note: `${shown(match[0])} là base mạnh.` })
    }
    for (const formula of STRONG_ACIDS) {
      if (has(formula, sentence) && new RegExp(`${FORMULA_AT(formula)}[^,]{0,30}acid yếu`, 'iu').test(sentence)) found.push({ id: `class:acid:${formula}`, severity: 'error', note: `${shown(formula)} là acid mạnh.` })
    }
    for (const formula of WEAK_ACIDS) {
      if (has(formula, sentence) && new RegExp(`${FORMULA_AT(formula)}[^,]{0,30}acid mạnh`, 'iu').test(sentence)) found.push({ id: `class:acid:${formula}`, severity: 'error', note: `${shown(formula)} là acid yếu.` })
    }
    const origin = /muối (?:của|tạo bởi|tạo từ|từ) acid (mạnh|yếu) (?:và|với) base (mạnh|yếu)/iu.exec(sentence)
    if (origin) {
      for (const token of sentence.match(/(?<![A-Za-z0-9)])(?:NH4|[A-Z][a-z]?)\d*(?:\([A-Za-z0-9]+\)\d|[A-Z][A-Za-z0-9]*)(?![A-Za-z0-9])/g) || []) {
        const salt = saltParts(token)
        if (!salt) continue
        const acid = STRONG_ANIONS.includes(salt.anion) ? 'mạnh' : 'yếu'
        const base = baseIsStrong(salt.cation) ? 'mạnh' : 'yếu'
        if (acid !== origin[1].toLowerCase() || base !== origin[2].toLowerCase()) found.push({ id: `class:salt:${token}`, severity: 'error', note: `${shown(token)} là muối của acid ${acid} và base ${base}.` })
      }
    }
  }
  if (!/polyme|polymer|monome|monomer|nhựa|cao su|polyethylene|polypropylene|PVC|n ?CH2/iu.test(scan)) {
    for (const sentence of sentences(text)) {
      if (!NOT_THIS.test(sentence) && new RegExp(`${WB}phản ứng trùng hợp${WE}`, 'iu').test(sentence)) {
        found.push({ id: 'reaction:polymerization', severity: 'error', note: 'Trùng hợp là phản ứng tạo polymer từ monomer. Hai dung dịch tạo kết tủa là phản ứng trao đổi ion.' })
      }
    }
  }
  return found
}

function formulaFindings(text) {
  const found = []
  const scan = lines(text).join('\n')
  if (/(?<![PpA-Za-z0-9·*×]\s?)V[A-Za-z0-9]*\s*=\s*n[A-Za-z0-9]*\s*[×x*·]?\s*R\s*[×x*·]?\s*T(?![A-Za-z0-9]*\s*\/)/.test(scan)) {
    found.push({ id: 'formula:ideal-gas', severity: 'error', note: 'Phương trình khí lý tưởng là PV = nRT, nên V = nRT/P.' })
  }
  if (/R\s*(?:=|≈)\s*0\.082\d*[^\n]{0,25}bar/iu.test(scan) || /R\s*(?:=|≈)\s*0\.0831\d*[^\n]{0,25}atm/iu.test(scan)) {
    found.push({ id: 'formula:gas-constant', severity: 'error', note: 'R ≈ 0,082 L·atm/(mol·K) dùng với atm; R ≈ 0,0831 L·bar/(mol·K) dùng với bar.' })
  }
  for (const sentence of sentences(text)) {
    if (/đkc|điều kiện chuẩn/iu.test(sentence) && !/đktc|tiêu chuẩn/iu.test(sentence) && /22\.4/.test(sentence)) {
      found.push({ id: 'formula:molar-volume', severity: 'error', note: 'Ở đkc (25 °C, 1 bar), thể tích mol khí là 24,79 L/mol; 22,4 L/mol là của đktc (0 °C, 1 atm).' })
    }
    if (/đktc|điều kiện tiêu chuẩn/iu.test(sentence) && !/đkc|điều kiện chuẩn/iu.test(sentence) && /24\.79/.test(sentence)) {
      found.push({ id: 'formula:molar-volume', severity: 'error', note: 'Ở đktc (0 °C, 1 atm), thể tích mol khí là 22,4 L/mol; 24,79 L/mol là của đkc (25 °C, 1 bar).' })
    }
    if (/số mol nhỏ nhất/iu.test(sentence) && /giới hạn|hết trước/iu.test(sentence) && !/hệ số/iu.test(sentence)) {
      found.push({ id: 'logic:limiting-reagent', severity: 'error', note: 'Chất phản ứng hết được xác định bằng cách so sánh tỉ số n/hệ số của từng chất; chất có tỉ số nhỏ nhất hết trước.' })
    }
    if (/chu k[ìy][^.]{0,50}số lớp electron ngoài cùng/iu.test(sentence)) {
      found.push({ id: 'wording:period', severity: 'imprecise', note: 'Số thứ tự chu kì bằng số lớp electron của nguyên tử.' })
    }
  }
  return found
}

const SPECIES = '\\d*\\s*[A-Z][A-Za-z0-9()\\[\\]]*\\s*[↓↑]?'
const EQUATION = new RegExp(`(${SPECIES}(?:\\s*\\+\\s*${SPECIES})*)\\s*(?:→|⇌|⟶|->)\\s*(${SPECIES}(?:\\s*\\+\\s*${SPECIES})*)`, 'g')
const clean = side => side.replace(/[↓↑\s]/g, '').replace(/\+/g, ' + ')

export function extractEquations(text) {
  const out = []
  for (const line of lines(text)) {
    for (const match of line.matchAll(EQUATION)) {
      // Ionic right side (HCl → H⁺ + Cl⁻): this pattern reads molecular species only, so it is not judged.
      if (/^\d*[+-]/.test(line.slice(match.index + match[0].length))) continue
      out.push({ left: clean(match[1]), right: clean(match[2]), line })
    }
  }
  return out
}

function balanced({ left, right }) {
  try {
    const { reactants, products } = parseEquation(`${left} → ${right}`)
    return compareSides(reactants, products).balanced
  }
  catch {
    return null
  }
}

function equationFindings(text, question) {
  const found = []
  const asked = new Set(extractEquations(question || '').map(item => `${item.left}>${item.right}`))
  for (const equation of extractEquations(text)) {
    const key = `${equation.left}>${equation.right}`
    if (/^\d*(Cu|Ag|Au|Pt|Hg) \+ \d*(HCl|H2SO4)$/.test(equation.left) && /(^| )\d*H2( |$)/.test(equation.right)) {
      found.push({ id: 'reaction:no-hydrogen', severity: 'error', note: 'Cu, Ag, Au, Pt và Hg đứng sau H trong dãy hoạt động hóa học nên không đẩy được H₂ khỏi dung dịch acid.' })
    }
    if (asked.has(key) || /ban đầu|chưa cân bằng|sơ đồ/iu.test(equation.line)) continue
    if (balanced(equation) === false) found.push({ id: `equation:${key}`, severity: 'error', note: `Phương trình ${shown(equation.left)} → ${shown(equation.right)} chưa cân bằng.` })
  }
  return found
}

export function scienceFindings(answer, question = '') {
  const text = stripGuardNote(answer)
  const all = [...colorFindings(text), ...classificationFindings(text), ...formulaFindings(text), ...equationFindings(text, question)]
  return [...new Map(all.map(item => [item.id, item])).values()]
}

// ---------------- terminology ----------------

// One-to-one names only (GDPT 2018, as ChemLab's lessons write them). Style, not science:
// these are rewritten silently and never reported to the learner as an error.
const TERMS = [
  ['nhóm metan', 'nhóm methyl'], ['nhóm etan', 'nhóm ethyl'],
  ['hiđroxit', 'hydroxide'], ['hidroxit', 'hydroxide'], ['hydroxit', 'hydroxide'],
  ['đioxit', 'dioxide'], ['dioxit', 'dioxide'], ['oxit', 'oxide'],
  ['axit', 'acid'], ['bazơ', 'base'],
  ['hiđro', 'hydrogen'], ['hidro', 'hydrogen'], ['hydro', 'hydrogen'],
  ['khí oxi', 'khí oxygen'], ['cacbon', 'carbon'],
  ['etyl', 'ethyl'], ['metyl', 'methyl'], ['ancol', 'alcohol']
]

export function normalizeTerminology(answer) {
  let fixes = 0
  const swap = part => {
    let out = part
    for (const [from, to] of TERMS) {
      out = out.replace(new RegExp(`${WB}${from}${WE}`, 'giu'), match => {
        fixes += 1
        return match[0] === match[0].toUpperCase() && match[0] !== match[0].toLowerCase() ? to[0].toUpperCase() + to.slice(1) : to
      })
    }
    // "oxy hóa" and "oxi hóa" stay: they name the process, not the element.
    return out.replace(new RegExp(`${WB}oxy${WE}(?!\\s*h[oó][aá])`, 'giu'), match => {
      fixes += 1
      return match[0] === 'O' ? 'Oxygen' : 'oxygen'
    })
  }
  const text = String(answer).normalize('NFC').split(/(`[^`]*`)/).map((part, index) => index % 2 ? part : swap(part)).join('')
  return { answer: text, fixes }
}

// ---------------- guard ----------------

const NOTE_HEAD = '**ChemLab đối chiếu tự động và thấy điểm cần lưu ý trong câu trả lời bên dưới:**'

export function stripGuardNote(answer) {
  const value = String(answer)
  if (!value.startsWith(NOTE_HEAD)) return value
  const end = value.indexOf('\n\n')
  return end < 0 ? '' : value.slice(end + 2)
}

// The model's text stays visible: rewriting it could introduce new errors. The correction
// comes first so a learner reads it before the wrong statement.
export function answerGuard(answer, { question = '' } = {}) {
  const { answer: normalized, fixes } = normalizeTerminology(answer)
  const findings = scienceFindings(normalized, question)
  if (!findings.length) return { answer: normalized, findings, termFixes: fixes }
  const list = findings.map(item => `- ${item.note}`).join('\n')
  return { answer: `${NOTE_HEAD}\n${list}\n\n${normalized}`, findings, termFixes: fixes }
}
