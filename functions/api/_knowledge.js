import { CHEMICALS } from '../../src/lab/chemicals.js'
import { REACTIONS } from '../../src/lab/reactions.js'
import { CURRICULUM } from '../../src/lab/experiments/curriculum.js'
import { elements as ELEMENTS } from '../../src/data/elements.js'

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
  'ket', 'tua', 'tao', 'trung', 'hoa', 'oxi', 'khu'
])

function formulaTokens(value) {
  const plain = String(value ?? '')
    .replace(/[₀-₉]/g, char => SUBSCRIPT_DIGITS[char] || char)
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]/g, char => SUPERSCRIPT_DIGITS[char] || char)

  const matches = plain.match(/\b(?:[A-Z][a-z]?\d*)+(?:\([A-Za-z0-9]+\)\d*)*(?:\^?[0-9]*[+-])?\b/g) || []

  return matches
    .map(item => item.toLowerCase())
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

function selectTop(items, limit) {
  return items
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score, ...item }) => item)
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

  if (!queryTokens.length) {
    return {
      elements: [],
      chemicals: [],
      reactions: [],
      lessons: []
    }
  }

  const elements = selectTop(
    ELEMENTS.map(element => ({
      score: scoreText(queryTokens, [
        element.number,
        element.symbol,
        element.name,
        element.category
      ]),
      number: element.number,
      symbol: element.symbol,
      name: element.name,
      mass: element.mass,
      category: element.category
    })),
    5
  )

  const chemicals = selectTop(
    Object.values(CHEMICALS).map(chemical => ({
      score: scoreText(queryTokens, [
        chemical.id,
        chemical.name,
        chemical.formula,
        chemical.family,
        chemical.category,
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
    6
  )

  const reactions = selectTop(
    REACTIONS.map(reaction => ({
      score: scoreText(queryTokens, [
        reaction.id,
        reaction.title,
        reaction.equation,
        reaction.description,
        reaction.category,
        ...(reaction.reactants || [])
      ]),
      id: reaction.id,
      title: reaction.title,
      equation: reaction.equation,
      description: reaction.description,
      category: reaction.category,
      conditions: reaction.conditions || {}
    })),
    6
  )

  const lessons = selectTop(
    LESSONS.map(lesson => ({
      score: scoreText(queryTokens, [
        lesson.id,
        lesson.grade,
        lesson.chapter,
        lesson.title,
        lesson.type
      ]),
      ...lesson
    })),
    6
  )

  return {
    elements,
    chemicals,
    reactions,
    lessons
  }
}
