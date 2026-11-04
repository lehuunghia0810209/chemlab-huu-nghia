import { CHEMICALS } from '../../src/lab/chemicals.js'
import { REACTIONS } from '../../src/lab/reactions.js'
import { reactionDescription, reactionTitle } from '../../src/lab/reactionsVi.js'
import { solidsOf } from '../../src/lab/engine/precipitates.js'
import { substanceFacts } from './_chemFacts.js'
import { CURRICULUM } from '../../src/lab/experiments/curriculum.js'
import { elements as ELEMENTS } from '../../src/data/elements.js'
import { getElectronConfiguration } from '../../src/chem/electronConfiguration.js'

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

// Configuration, period and group (A/B numbering used in Vietnamese textbooks),
// derived from ChemLab's electron configuration engine so the model does not
// have to recall them. s/p block → A groups; d block → B groups (8–10 → VIIIB,
// 11 → IB, 12 → IIB); f block → IIIB.
export function periodicPosition(atomicNumber) {
  const config = getElectronConfiguration(atomicNumber)
  if (!config) return {}
  // Pd ([Kr] 4d¹⁰) is the only element with an empty outer s subshell.
  if (atomicNumber === 46) return { electronConfiguration: config.full, period: 5, group: 'VIIIB' }
  const period = config.shells.length
  const last = config.energyOrder.at(-1)
  const ns = config.subshells.find(item => item.n === period && item.l === 0)?.electrons || 0
  let group
  if (atomicNumber === 2) group = 'VIIIA'
  else if (last.l <= 1) group = `${ROMAN[ns + (config.subshells.find(item => item.n === period && item.l === 1)?.electrons || 0)]}A`
  else if (last.l === 3) group = 'IIIB'
  else {
    const count = ns + last.electrons
    group = count <= 7 ? `${ROMAN[count]}B` : count <= 10 ? 'VIIIB' : count === 11 ? 'IB' : 'IIB'
  }
  return { electronConfiguration: config.full, period, group }
}

const SUBSCRIPT_DIGITS = Object.freeze({
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
})

const SUPERSCRIPT_DIGITS = Object.freeze({
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  '⁺': '+', '⁻': '-'
})

function normalize(value) {
  return String(value ?? '')
    .replace(/[₀-₉]/g, char => SUBSCRIPT_DIGITS[char] || char)
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]/g, char => SUPERSCRIPT_DIGITS[char] || char)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[→⇌↔=+]/g, ' ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function compactFormula(value) {
  return normalize(value).replace(/\s+/g, '')
}

const STOP_WORDS = new Set([
  'cho', 'toi', 'minh', 'ban', 'nay', 'kia', 'do', 'la', 'co', 'gi', 'nao',
  'tai', 'sao', 'nhu', 'the', 'voi', 'cua', 'va', 'hoac', 'trong', 'tren',
  'duoi', 'mot', 'cac', 'nhung', 'hay', 'giup', 'giai', 'thich', 'phan',
  'ung', 'hoa', 'hoc', 'dang', 'hien', 'tai', 'can', 'biet', 'lam', 'duoc',
  'ket', 'tua', 'tao', 'trung', 'hoa', 'oxi', 'khu', 'mol', 'tinh', 'khi', 'dung', 'dich', 'gam',
  'lit', 'nguyen', 'nhom', 'chat', 'nuoc', 'nhu', 'ten', 'viet', 'cong', 'thuc', 'vao', 'khi'
])

function formulaTokens(value) {
  const plain = String(value ?? '')
    .replace(/[₀-₉]/g, char => SUBSCRIPT_DIGITS[char] || char)
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]/g, char => SUPERSCRIPT_DIGITS[char] || char)

  const matches = plain.match(/\b(?:[A-Z][a-z]?\d*)+(?:\([A-Za-z0-9]+\)\d*)*(?:\^?[0-9]*[+-])?\b/g) || []

  // Same compact form as the data, so Cu(OH)2 can match at all.
  return matches
    .map(compactFormula)
    .filter(item => item.length >= 2)
}

function tokensFrom(query) {
  const normalized = normalize(query)
  const tokens = new Set(
    normalized
      .split(/\s+/)
      .map(token => token.trim())
      .filter(token => token.length >= 3 && !STOP_WORDS.has(token))
  )

  for (const formula of formulaTokens(query)) {
    tokens.add(formula)
  }

  const semanticAliases = [
    ['ket tua', ['precipitation', 'precipitate']],
    ['trung hoa', ['neutralization']],
    ['axit', ['acid']],
    ['acid', ['acid']],
    ['bazo', ['base']],
    ['base', ['base']],
    ['oxi hoa khu', ['redox']],
    ['oxi hoa', ['redox']],
    ['khu', ['redox']],
    ['phuc chat', ['complex']],
    ['chat khi', ['gas']]
  ]

  for (const [phrase, aliases] of semanticAliases) {
    if (!normalized.includes(phrase)) continue
    aliases.forEach(alias => tokens.add(alias))
  }

  return [...tokens]
}

function scoreText(queryTokens, fields) {
  const text = normalize(fields.join(' '))
  const compact = compactFormula(fields.join(' '))
  let score = 0

  for (const token of queryTokens) {
    if (!token) continue

    if (text === token || compact === token) {
      score += 12
      continue
    }

    if (text.split(' ').includes(token)) score += 6
    else if (text.includes(token)) score += 3

    if (compact.includes(token.replace(/\s+/g, ''))) score += 2
  }

  return score
}

// Weak matches are noise the model may treat as facts, and every one costs input tokens.
function selectTop(items, limit, minScore = 1) {
  const sorted = items.filter(item => item.score >= minScore).sort((a, b) => b.score - a.score)
  const floor = (sorted[0]?.score || 0) * 0.6
  return sorted
    .filter(item => item.score >= floor)
    .slice(0, limit)
    .map(({ score, ...item }) => item)
}

// An element is named by its exact symbol, Z or whole name; a single letter needs a word that says it is an element.
function elementScore(element, raw, normalized) {
  const atomicNumbers = [...raw.matchAll(/\bZ\s*=\s*(\d{1,3})\b/g)].map(match => Number(match[1]))
  if (atomicNumbers.includes(element.number)) return 20
  const symbol = element.symbol
  const name = normalize(element.name)
  if (name.length >= 3 && ` ${normalized} `.includes(` ${name} `)) return 12
  if (symbol.length > 1) return new RegExp(`(?<![A-Za-z0-9])${symbol}(?![a-z0-9(])`).test(raw) ? 12 : 0
  return new RegExp(`(?:nguyên tố|nguyên tử|kim loại|phi kim|element)\\s+${symbol}(?![A-Za-z0-9])`, 'iu').test(raw) ? 12 : 0
}

const formulaHits = (formulas, values) => formulas.filter(formula => values.includes(formula)).length

function speciesOfEquation(equation) {
  return String(equation).split(/→|⇌|\+/).map(part => compactFormula(part.replace(/[↓↑]/g, '')).replace(/^\d+/, '')).filter(Boolean)
}

function lessonRows() {
  const rows = []

  for (const grade of Object.values(CURRICULUM)) {
    for (const chapter of grade.chapters || []) {
      for (const lesson of chapter.lessons || []) {
        rows.push({
          id: lesson.id,
          grade: grade.grade,
          chapter: chapter.title,
          number: lesson.number,
          title: lesson.title,
          type: lesson.type
        })
      }
    }
  }

  return rows
}

const LESSONS = lessonRows()

export function retrieveChemKnowledge(query, context = {}) {
  const labMixtureIds = context?.lab?.mixture && typeof context.lab.mixture === 'object'
    ? Object.keys(context.lab.mixture).slice(0, 12)
    : []

  const contextText = [
    query,
    context?.element?.symbol,
    context?.element?.name,
    context?.chemFlow?.formula,
    context?.chemFlow?.compound?.formula,
    context?.chemFlow?.compound?.name,
    context?.chemFlow?.reaction?.balanced,
    context?.learning?.topicName,
    context?.learning?.session?.question,
    context?.lab?.guided?.experiment?.title,
    ...labMixtureIds
  ]
    .filter(Boolean)
    .join(' ')


  const queryTokens = tokensFrom(contextText)

  // "Nguyên tố K ở đâu?" has no searchable word but still names an element.
  if (!contextText.trim()) {
    return {
      elements: [],
      chemicals: [],
      reactions: [],
      lessons: [],
      substances: []
    }
  }

  const normalizedContext = normalize(contextText)
  const formulas = formulaTokens(contextText)

  const elements = selectTop(
    ELEMENTS.map(element => ({
      score: elementScore(element, contextText, normalizedContext),
      number: element.number,
      symbol: element.symbol,
      name: element.name,
      mass: element.mass,
      category: element.category
    })),
    5
  ).map(element => ({ ...element, ...periodicPosition(element.number) }))

  const chemicals = selectTop(
    Object.values(CHEMICALS).map(chemical => ({
      score: 12 * formulaHits(formulas, [compactFormula(chemical.formula), String(chemical.id).toLowerCase()]) + scoreText(queryTokens, [
        chemical.name,
        ...(chemical.tags || [])
      ]),
      id: chemical.id,
      name: chemical.name,
      formula: chemical.formula,
      family: chemical.family,
      state: chemical.state,
      acidBase: chemical.acidBase,
      hazards: chemical.hazards || []
    })),
    4,
    6
  )

  const reactions = selectTop(
    REACTIONS.map(reaction => {
      const solids = solidsOf(reaction).filter(item => item.label).map(item => ({ formula: item.formula, color: item.label }))
      return {
        // With formulas in the question, only a reaction containing them is relevant.
        score: formulas.length
          ? 12 * formulaHits(formulas, speciesOfEquation(reaction.equation))
          : scoreText(queryTokens, [reaction.id, reactionTitle(reaction), reactionDescription(reaction), reaction.category]),
        id: reaction.id,
        title: reactionTitle(reaction),
        equation: reaction.equation,
        description: reactionDescription(reaction),
        category: reaction.category,
        conditions: reaction.conditions || {},
        ...(solids.length ? { solids } : {})
      }
    }),
    3,
    6
  )

  const lessons = selectTop(
    LESSONS.map(lesson => ({
      score: scoreText(queryTokens, [lesson.title]),
      ...lesson
    })),
    3,
    6
  )

  const substances = substanceFacts([contextText, ...reactions.map(item => item.equation)].join(' '))

  return {
    elements,
    chemicals,
    reactions,
    lessons,
    substances
  }
}
