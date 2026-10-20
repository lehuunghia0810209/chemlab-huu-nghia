// Structural validation of exam papers. Used when a paper is loaded and by
// scripts/test-exam.mjs. Returns a list of human-readable problems.
import { getBlueprint } from './blueprints.js'
import { validateShortAnswer } from './scoring.js'

export const LEVELS = Object.freeze({ biet: 'Biết', hieu: 'Hiểu', vandung: 'Vận dụng' })
export const LICENSES = ['licensed', 'pending', 'not-licensed', 'internal-fixture']
export const KINDS = ['official-reference', 'official-exam', 'fixture']

const nonEmpty = value => typeof value === 'string' && value.trim().length > 0

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
  if (paper.kind !== 'fixture' && (!nonEmpty(paper.source?.authority) || !nonEmpty(paper.source?.url))) fail('official paper needs source authority and url')
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
      if (!nonEmpty(question.content)) fail(`${where}: no content`)
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
      if (!meta || !['verified', 'unverified'].includes(meta.status)) fail(`${where}: meta.status must be verified or unverified`)
      else if (meta.status === 'verified') {
        if (!LEVELS[meta.level]) fail(`${where}: unknown level ${meta.level}`)
        if (!Array.isArray(meta.chapters) || !meta.chapters.length) fail(`${where}: verified meta needs chapters`)
        else if (chapterIds) meta.chapters.filter(id => !chapterIds.has(id)).forEach(id => fail(`${where}: unknown chapter ${id}`))
      }
    }
  })
  if (paper.kind !== 'fixture' && paper.sections.length !== blueprint.parts.length) fail('paper does not contain every blueprint part')
  return errors
}
