// Deterministic exam scoring. Pure functions: no DOM, no storage, no AI.
import { getBlueprint } from './blueprints.js'

// Answer-sheet characters for Part III: digits, “-” and “,”. A typed “.” is read
// as the decimal comma because the on-screen keyboard may offer only “.”.
export function normalizeShortAnswer(raw) {
  return String(raw ?? '').trim().replace(/\s+/g, '').replace(/\./g, ',')
}

export function validateShortAnswer(raw, maxChars) {
  const value = normalizeShortAnswer(raw)
  if (!value) return { ok: true, value: '' }
  if (!/^[0-9,-]+$/.test(value)) return { ok: false, value, message: 'Chỉ dùng chữ số, dấu “-” và dấu “,”.' }
  if (value.length > maxChars) return { ok: false, value, message: `Tối đa ${maxChars} kí tự.` }
  if (!/^-?(\d+(,\d+)?|,\d+)$/.test(value)) return { ok: false, value, message: 'Kết quả không đúng dạng số.' }
  return { ok: true, value }
}

function scoreSingle(question, response, part) {
  if (response === undefined || response === null || response === '') return { status: 'unanswered', points: 0 }
  if (!question.options.some(option => option.id === response)) return { status: 'invalid', points: 0 }
  const correct = response === question.answer
  return { status: correct ? 'correct' : 'wrong', points: correct ? part.pointsHundredths : 0 }
}

function scoreTrueFalse(question, response, part) {
  const answered = question.statements.filter(statement => typeof response?.[statement.id] === 'boolean')
  if (!answered.length) return { status: 'unanswered', points: 0, statementsCorrect: 0 }
  const statementsCorrect = question.statements
    .filter(statement => response[statement.id] === question.answer[statement.id]).length
  const points = part.tableHundredths[statementsCorrect]
  const status = statementsCorrect === question.statements.length ? 'correct' : statementsCorrect ? 'partial' : 'wrong'
  return { status, points, statementsCorrect }
}

function scoreShort(question, response, part) {
  const check = validateShortAnswer(response, part.maxChars)
  if (!check.value) return { status: 'unanswered', points: 0 }
  if (!check.ok) return { status: 'invalid', points: 0 }
  const accepted = [question.answer, ...(question.accept || [])].map(normalizeShortAnswer)
  const correct = accepted.includes(check.value)
  return { status: correct ? 'correct' : 'wrong', points: correct ? part.pointsHundredths : 0 }
}

const SCORERS = { single: scoreSingle, truefalse: scoreTrueFalse, short: scoreShort }

export function scoreQuestion(question, response, part) {
  return SCORERS[part.type](question, response, part)
}

// paper: validated exam paper; responses: { [questionId]: response }.
export function scoreExam(paper, responses = {}) {
  const blueprint = getBlueprint(paper.blueprint)
  if (!blueprint) throw new Error(`Unknown blueprint ${paper.blueprint}`)
  const questions = []
  const parts = paper.sections.map(section => {
    const part = blueprint.parts.find(item => item.id === section.part)
    let earned = 0
    let possible = 0
    for (const question of section.questions) {
      const result = scoreQuestion(question, responses[question.id], part)
      earned += result.points
      possible += part.type === 'truefalse' ? part.tableHundredths.at(-1) : part.pointsHundredths
      questions.push({ id: question.id, part: part.id, ...result })
    }
    return { id: part.id, title: part.title, earned, possible }
  })
  const earned = parts.reduce((sum, part) => sum + part.earned, 0)
  const possible = parts.reduce((sum, part) => sum + part.possible, 0)
  return { earned, possible, parts, questions }
}

// Chapter / level breakdown from question metadata. Questions whose metadata is
// not verified are left out and counted, so the UI can say the data is partial.
export function analyse(paper, scored) {
  const byId = new Map(scored.questions.map(item => [item.id, item]))
  const chapters = new Map()
  const levels = new Map()
  let unverified = 0
  const add = (map, key, entry, possible) => {
    const bucket = map.get(key) || { key, earned: 0, possible: 0, count: 0 }
    bucket.earned += entry.points
    bucket.possible += possible
    bucket.count += 1
    map.set(key, bucket)
  }
  const blueprint = getBlueprint(paper.blueprint)
  for (const section of paper.sections) {
    const part = blueprint.parts.find(item => item.id === section.part)
    const possible = part.type === 'truefalse' ? part.tableHundredths.at(-1) : part.pointsHundredths
    for (const question of section.questions) {
      const entry = byId.get(question.id)
      if (question.meta?.status !== 'verified') {
        unverified += 1
        continue
      }
      for (const chapterId of question.meta.chapters) add(chapters, chapterId, entry, possible)
      add(levels, question.meta.level, entry, possible)
    }
  }
  return { chapters: [...chapters.values()], levels: [...levels.values()], unverified }
}
