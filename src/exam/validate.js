// Structural validation of exam papers. Used when a paper is loaded and by
// scripts/test-exam.mjs. Returns a list of human-readable problems.
import { getBlueprint } from './blueprints.js'
import { validateShortAnswer } from './scoring.js'

const nonEmpty = value => typeof value === 'string' && value.trim().length > 0

export const LEVELS = Object.freeze({ biet: 'Biết', hieu: 'Hiểu', vandung: 'Vận dụng' })
// owner-attested: the project owner states ChemLab may use the paper; the
// licence document itself was not seen by the agent (kept private by the owner).
export const LICENSES = ['licensed', 'owner-attested', 'pending', 'not-licensed', 'internal-fixture']
export const META_STATUSES = ['verified', 'internal', 'unverified']
const BLOCK_TYPES = ['p', 'list', 'equation', 'table', 'figure']

// Question content is a string or a list of blocks (paragraph, list, equation
// with condition, table, figure cropped from the original paper).
export function contentProblems(content) {
  if (typeof content === 'string') return content.trim() ? [] : ['no content']
  if (!Array.isArray(content) || !content.length) return ['no content']
  const problems = []
  for (const [index, block] of content.entries()) {
    if (!BLOCK_TYPES.includes(block?.type)) problems.push(`block ${index}: unknown type ${block?.type}`)
    else if (block.type === 'p' && !nonEmpty(block.text)) problems.push(`block ${index}: empty paragraph`)
    else if (block.type === 'list' && (!Array.isArray(block.items) || !block.items.length || !block.items.every(nonEmpty))) problems.push(`block ${index}: bad list`)
    else if (block.type === 'equation' && !nonEmpty(block.text)) problems.push(`block ${index}: empty equation`)
    else if (block.type === 'table' && (!Array.isArray(block.head) || !Array.isArray(block.rows) || block.rows.some(row => row.length !== block.head.length))) problems.push(`block ${index}: table rows do not match the header`)
    else if (block.type === 'figure' && (!nonEmpty(block.src) || !nonEmpty(block.alt) || block.alt.length < 20 || !(block.width > 0) || !(block.height > 0))) problems.push(`block ${index}: figure needs src, a descriptive alt, width and height`)
  }
  return problems
}
// provincial-exam: a Sở GD&ĐT survey/mock exam; teacher-practice: a practice
// paper written by a named teacher. Neither is a Ministry paper.
export const KINDS = ['official-reference', 'official-exam', 'provincial-exam', 'teacher-practice', 'fixture']
// official: key published by the issuing authority; author: key supplied by the
// paper's author (teacher-practice); chemlab: key written by ChemLab.
export const ANSWER_KEYS = ['official', 'author', 'chemlab']
const SHA256 = /^[0-9a-f]{64}$/


export function validatePaper(paper, { chapterIds = null } = {}) {
  const errors = []
  const fail = message => errors.push(`${paper?.id || '?'}: ${message}`)
  if (!paper || typeof paper !== 'object') return ['paper is not an object']
  if (!nonEmpty(paper.id) || !nonEmpty(paper.title)) fail('missing id/title')
  if (!KINDS.includes(paper.kind)) fail(`unknown kind ${paper.kind}`)
  if (!LICENSES.includes(paper.license)) fail(`unknown license ${paper.license}`)
  if (!Number.isInteger(paper.dataVersion) || paper.dataVersion < 1) fail('dataVersion must be a positive integer')
  const blueprint = getBlueprint(paper.blueprint)
  if (!blueprint) {
    fail(`unknown blueprint ${paper.blueprint}`)
    return errors
  }
  if (paper.kind === 'fixture' && paper.license !== 'internal-fixture') fail('fixtures must use license internal-fixture')
  // A source is a public page (url) or a file supplied by the owner, identified by its hash.
  if (paper.kind !== 'fixture' && (!nonEmpty(paper.source?.authority) || !(nonEmpty(paper.source?.url) || SHA256.test(paper.source?.file?.sha256 || '')))) fail('paper needs a source authority and a url or a source file hash')
  if (paper.kind !== 'fixture' && !ANSWER_KEYS.includes(paper.answerKey)) fail('paper must say whether its answer key is official, from the author or ChemLab-written')
  if (paper.kind === 'teacher-practice' && paper.answerKey === 'official') fail('a teacher practice paper has no official answer key')
  if (paper.editorialNote !== undefined && !nonEmpty(paper.editorialNote)) fail('editorialNote must be a non-empty string')
  if (paper.variant !== undefined && !/^\d{3,4}$/.test(paper.variant)) fail('variant (mã đề) must be 3–4 digits')
  if (!Number.isFinite(paper.timeLimitMinutes) || paper.timeLimitMinutes <= 0) fail('timeLimitMinutes must be positive')
  if (paper.kind !== 'fixture' && paper.timeLimitMinutes !== blueprint.timeLimitMinutes) fail('time limit differs from blueprint')
  if (!Array.isArray(paper.sections)) {
    fail('sections missing')
    return errors
  }

  const order = blueprint.parts.map(part => part.id)
  const seen = new Set()
  paper.sections.forEach((section, index) => {
    const part = blueprint.parts.find(item => item.id === section.part)
    if (!part) return fail(`section ${index}: unknown part ${section.part}`)
    if (order.indexOf(section.part) !== index) fail(`section ${section.part} out of blueprint order`)
    if (!Array.isArray(section.questions) || !section.questions.length) return fail(`part ${part.id}: no questions`)
    if (paper.kind !== 'fixture' && section.questions.length !== part.count) fail(`part ${part.id}: ${section.questions.length} questions, blueprint has ${part.count}`)
    for (const question of section.questions) {
      const where = `question ${question.id}`
      if (!nonEmpty(question.id) || seen.has(question.id)) fail(`${where}: missing or duplicate id`)
      seen.add(question.id)
      contentProblems(question.content).forEach(problem => fail(`${where}: ${problem}`))
      if (part.type === 'single') {
        if (!Array.isArray(question.options) || question.options.length !== 4) fail(`${where}: needs 4 options`)
        else if (!question.options.some(option => option.id === question.answer)) fail(`${where}: answer not among options`)
        if (question.options?.some(option => !nonEmpty(option.text))) fail(`${where}: empty option`)
      }
      if (part.type === 'truefalse') {
        if (!Array.isArray(question.statements) || question.statements.length !== part.statements) fail(`${where}: needs ${part.statements} statements`)
        else if (question.statements.some(statement => typeof question.answer?.[statement.id] !== 'boolean' || !nonEmpty(statement.text))) fail(`${where}: every statement needs text and a boolean answer`)
      }
      if (part.type === 'short') {
        const check = validateShortAnswer(question.answer, part.maxChars)
        if (!check.ok || !check.value) fail(`${where}: answer “${question.answer}” does not fit the answer grid`)
      }
      if (!nonEmpty(question.solution?.text)) fail(`${where}: no solution`)
      if (typeof question.solution?.official !== 'boolean') fail(`${where}: solution.official must say whether it is the official solution`)
      const meta = question.meta
      if (!meta || !META_STATUSES.includes(meta.status)) fail(`${where}: meta.status must be one of ${META_STATUSES.join(', ')}`)
      else if (meta.status !== 'unverified') {
        if (meta.level !== undefined && !LEVELS[meta.level]) fail(`${where}: unknown level ${meta.level}`)
        if (!Array.isArray(meta.chapters) || !meta.chapters.length) fail(`${where}: verified meta needs chapters`)
        else if (chapterIds) meta.chapters.filter(id => !chapterIds.has(id)).forEach(id => fail(`${where}: unknown chapter ${id}`))
      }
    }
  })
  if (paper.kind !== 'fixture' && paper.sections.length !== blueprint.parts.length) fail('paper does not contain every blueprint part')
  return errors
}
