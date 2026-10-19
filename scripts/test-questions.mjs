// Answer engine unit tests and question bank validation.
//   node scripts/test-questions.mjs          → run checks (fails if QUESTION_BANK.md is stale)
//   node scripts/test-questions.mjs --write  → regenerate docs/learning/QUESTION_BANK.md
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { equationProblem } from './lib/equation-check.mjs'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const REPORT_PATH = path.join(rootDir, 'docs', 'learning', 'QUESTION_BANK.md')

const { evaluate, parseNumber, normalizeText, formatCorrectAnswer, numericTolerance, UNITS, QUESTION_TYPES, DIFFICULTIES } = await import('../src/learning/answerEngine.js')
const { GRADES, allLessons, findLesson } = await import('../src/learning/catalog.js')
const { QUESTION_CHAPTERS, loadChapterQuestions } = await import('../src/learning/questionBank.js')

let passed = 0
const failures = []
function check(name, condition, detail = '') {
  if (condition) passed += 1
  else failures.push(`${name}${detail ? ` — ${detail}` : ''}`)
}

/* ---------- Answer engine ---------- */

const number = text => parseNumber(text)
check('parse: comma decimal', number('2,24').value === 2.24)
check('parse: dot decimal', number('2.24').value === 2.24)
check('parse: integer with unit', number('56 g').value === 56 && number('56 g').unit === 'g')
check('parse: unit without space', number('1,1V').unit === 'V')
check('parse: negative and unicode minus', number('-0,76').value === -0.76 && number('−0,76').value === -0.76)
check('parse: e notation', number('6,02e23').value === 6.02e23)
check('parse: ×10^', Math.abs(number('6,02×10^23').value - 6.02e23) < 1e9)
check('parse: x10^ with spaces', Math.abs(number('1,6 x 10^-19').value - 1.6e-19) < 1e-30)
check('parse: superscript exponent', Math.abs(number('1,6×10⁻¹⁹').value - 1.6e-19) < 1e-30)
check('parse: unit with superscript', number('22,4 dm³').unit === 'dm³')
check('parse: empty rejected', !number('').ok && !number('   ').ok)
check('parse: text rejected', !number('abc').ok)
check('parse: two separators rejected', !number('1.000.000').ok && !number('1,2,3').ok)
check('parse: thousands space rejected', !number('1 000').ok)
check('parse: leading separator rejected with hint', !number('.5').ok && /0,5/.test(number('.5').error))
check('parse: trailing garbage rejected', !number('12abc!').ok)

const numericQ = { type: 'numeric', correctAnswer: { value: 5.6, unit: 'g' } }
check('numeric: exact', evaluate(numericQ, '5,6').correct)
check('numeric: with unit', evaluate(numericQ, '5,6 g').correct)
check('numeric: converted unit', evaluate(numericQ, '5600 mg').correct && evaluate(numericQ, '0,0056 kg').correct)
check('numeric: within 1% default tolerance', evaluate(numericQ, '5,64').correct && !evaluate(numericQ, '5,7').correct)
check('numeric: wrong value is a knowledge error', evaluate(numericQ, '11,2 g').kind === 'incorrect')
check('numeric: wrong unit is an input error', evaluate(numericQ, '5,6 L').kind === 'invalid')
check('numeric: M and m are not confused', evaluate({ type: 'numeric', correctAnswer: { value: 0.1, unit: 'M' } }, '0,1 m').kind === 'invalid')
check('numeric: missing unit accepted with a reminder', Boolean(evaluate(numericQ, '5,6').note))
check('numeric: unitless quantity rejects a unit', evaluate({ type: 'numeric', correctAnswer: { value: 2 } }, '2 g').kind === 'invalid')
check('numeric: explicit tolerance', evaluate({ type: 'numeric', correctAnswer: { value: 1.1, unit: 'V', tolerance: 0.005 } }, '1,10').correct &&
  !evaluate({ type: 'numeric', correctAnswer: { value: 1.1, unit: 'V', tolerance: 0.005 } }, '1,12').correct)
check('numeric: zero answer tolerance is tiny but positive', numericTolerance({ value: 0 }) > 0 && evaluate({ type: 'numeric', correctAnswer: { value: 0 } }, '0').correct)

const singleQ = { type: 'single', options: [{ id: 'a', text: '1' }, { id: 'b', text: '2' }, { id: 'c', text: '3' }], correctAnswer: 'b' }
check('single: correct', evaluate(singleQ, 'b').correct)
check('single: wrong', evaluate(singleQ, 'a').kind === 'incorrect')
check('single: empty is input error', evaluate(singleQ, undefined).kind === 'invalid')
check('single: unknown option is input error', evaluate(singleQ, 'z').kind === 'invalid')

const multiQ = { type: 'multiple', options: ['a', 'b', 'c', 'd'].map(id => ({ id, text: id })), correctAnswer: ['a', 'c'] }
check('multiple: exact set', evaluate(multiQ, ['c', 'a']).correct)
check('multiple: subset is wrong', !evaluate(multiQ, ['a']).correct && evaluate(multiQ, ['a']).detail === '3/4 lựa chọn được xác định đúng')
check('multiple: superset is wrong', !evaluate(multiQ, ['a', 'b', 'c']).correct)
check('multiple: empty is input error', evaluate(multiQ, []).kind === 'invalid')

const tfQ = { type: 'truefalse', statements: ['a', 'b', 'c', 'd'].map(id => ({ id, text: id, explanation: 'x' })), correctAnswer: { a: true, b: false, c: true, d: false } }
check('truefalse: all right', evaluate(tfQ, { a: true, b: false, c: true, d: false }).correct)
check('truefalse: partial score', evaluate(tfQ, { a: true, b: true, c: true, d: false }).score === 0.75)
check('truefalse: missing statement is input error', evaluate(tfQ, { a: true }).kind === 'invalid')

const shortQ = { type: 'short', correctAnswer: { accepted: ['H₂SO₄'], caseSensitive: true, compact: true } }
check('short: subscripts equal plain digits', evaluate(shortQ, 'H2SO4').correct && evaluate(shortQ, 'H₂SO₄').correct)
check('short: spaces ignored when compact', evaluate(shortQ, ' H2 SO4 ').correct)
check('short: case matters for formulas', !evaluate(shortQ, 'h2so4').correct)
check('short: empty is input error', evaluate(shortQ, '  ').kind === 'invalid')
check('short: Vietnamese text is case-insensitive by default',
  evaluate({ type: 'short', correctAnswer: { accepted: ['Liên kết ion'] } }, 'liên kết ION').correct)
check('normalize: trailing period removed', normalizeText('Neutron.') === 'neutron')
check('format: numeric answer uses comma', formatCorrectAnswer({ type: 'numeric', correctAnswer: { value: 2.24, unit: 'L' } }) === '2,24 L')

/* ---------- Question bank ---------- */

const ID_FORM = /^(g1[0-2]-l\d+)-q(\d+)$/
const STATUSES = new Set(['internal', 'ai-draft', 'teacher-reviewed'])
const MIN_PER_LESSON = 6

const bank = []
for (const chapterId of QUESTION_CHAPTERS) {
  const questions = await loadChapterQuestions(chapterId)
  check(`${chapterId}: question file loads`, questions.length > 0)
  bank.push(...questions)
}

function wrongResponse(question) {
  switch (question.type) {
    case 'single': return question.options.find(option => option.id !== question.correctAnswer).id
    case 'multiple': return question.correctAnswer.length > 1 ? question.correctAnswer.slice(1) : question.options.filter(option => !question.correctAnswer.includes(option.id)).map(option => option.id).slice(0, 1).concat(question.correctAnswer)
    case 'truefalse': return Object.fromEntries(question.statements.map((statement, index) => [statement.id, index === 0 ? !question.correctAnswer[statement.id] : question.correctAnswer[statement.id]]))
    case 'short': return 'zzz không phải đáp án'
    case 'numeric': return String(question.correctAnswer.value * 1.5 + 1).replace('.', ',')
    default: return null
  }
}

function rightResponse(question) {
  switch (question.type) {
    case 'numeric': return `${String(question.correctAnswer.value).replace('.', ',')}${question.correctAnswer.unit ? ` ${question.correctAnswer.unit}` : ''}`
    case 'short': return question.correctAnswer.accepted[0]
    default: return question.correctAnswer
  }
}

const seen = new Set()
const contentByLesson = new Map()
for (const question of bank) {
  const id = question.id
  const problems = []
  const need = (condition, message) => { if (!condition) problems.push(message) }

  need(!seen.has(id), 'duplicate id')
  seen.add(id)
  const match = ID_FORM.exec(id)
  need(match && match[1] === question.lessonId, 'id must be <lessonId>-q<n>')
  const entry = findLesson(question.lessonId)
  need(entry, `unknown lesson ${question.lessonId}`)
  need(entry && question.chapterId === entry.chapter.id && question.grade === entry.grade.grade, 'grade/chapter not filled from catalog')
  need(QUESTION_TYPES[question.type], `invalid type ${question.type}`)
  need(DIFFICULTIES[question.difficulty], `invalid difficulty ${question.difficulty}`)
  need(typeof question.objective === 'string' && question.objective.length >= 10, 'objective missing')
  need(typeof question.content === 'string' && question.content.length >= 10, 'content missing')
  need(typeof question.explanation === 'string' && question.explanation.length >= 20, 'explanation missing or too short')
  need(question.source, 'source missing')
  need(STATUSES.has(question.verificationStatus), `invalid verificationStatus ${question.verificationStatus}`)

  if (question.type === 'single' || question.type === 'multiple') {
    const ids = (question.options || []).map(option => option.id)
    need(ids.length >= (question.type === 'single' ? 3 : 4), 'too few options')
    need(new Set(ids).size === ids.length, 'option ids repeat')
    need(new Set((question.options || []).map(option => normalizeText(option.text))).size === ids.length, 'option texts repeat')
    if (question.type === 'single') need(ids.includes(question.correctAnswer), 'correctAnswer not an option')
    else {
      need(Array.isArray(question.correctAnswer) && question.correctAnswer.length >= 2 && question.correctAnswer.length < ids.length, 'multiple needs 2..n-1 correct options')
      need((question.correctAnswer || []).every(answer => ids.includes(answer)), 'correctAnswer not an option')
    }
  }
  if (question.type === 'truefalse') {
    const ids = (question.statements || []).map(statement => statement.id)
    need(ids.length >= 3 && ids.length <= 6, 'truefalse needs 3–6 statements')
    need(new Set(ids).size === ids.length, 'statement ids repeat')
    need((question.statements || []).every(statement => statement.text && statement.explanation), 'statement text/explanation missing')
    need(ids.every(statementId => typeof question.correctAnswer?.[statementId] === 'boolean'), 'correctAnswer must map every statement to true/false')
    need(ids.some(statementId => question.correctAnswer[statementId]) && ids.some(statementId => !question.correctAnswer[statementId]), 'truefalse should mix true and false')
  }
  if (question.type === 'short') {
    need(Array.isArray(question.correctAnswer?.accepted) && question.correctAnswer.accepted.length && question.correctAnswer.accepted.every(item => typeof item === 'string' && item.trim()), 'accepted answers missing')
  }
  if (question.type === 'numeric') {
    const answer = question.correctAnswer || {}
    need(Number.isFinite(answer.value), 'numeric value missing')
    need(!answer.unit || UNITS[answer.unit] || answer.units, `unknown unit ${answer.unit}`)
    const tolerance = numericTolerance(answer)
    need(tolerance > 0 && (answer.value === 0 || tolerance <= Math.abs(answer.value) * 0.05), 'tolerance must be positive and ≤ 5% of the value')
    need(typeof question.verify === 'function', 'numeric needs verify() to recompute the answer')
    if (typeof question.verify === 'function') {
      const recomputed = question.verify()
      need(Math.abs(recomputed - answer.value) <= tolerance, `verify() gives ${recomputed}, answer ${answer.value}`)
    }
    need(Array.isArray(question.solution) && question.solution.length >= 2, 'numeric needs solution steps')
  }
  for (const equation of question.equations || []) {
    let problem
    try {
      problem = equationProblem(equation)
    }
    catch (error) {
      problem = `không đọc được (${error.message})`
    }
    need(!problem, `equation ${equation}: ${problem}`)
  }

  if (!problems.length) {
    need(evaluate(question, rightResponse(question)).correct, 'engine rejects the correct answer')
    const wrong = evaluate(question, wrongResponse(question))
    need(wrong.kind === 'incorrect', `engine accepts a wrong answer (${wrong.kind})`)
  }

  const key = normalizeText(question.content)
  const lessonContents = contentByLesson.get(question.lessonId) || new Set()
  need(!lessonContents.has(key), 'duplicate question text in lesson')
  lessonContents.add(key)
  contentByLesson.set(question.lessonId, lessonContents)

  check(`question ${id}`, !problems.length, problems.join('; '))
}

// Every lesson of a chapter with a question file meets the per-lesson target.
for (const chapterId of QUESTION_CHAPTERS) {
  const chapter = GRADES.flatMap(grade => grade.chapters).find(item => item.id === chapterId)
  check(`${chapterId}: chapter exists`, Boolean(chapter))
  for (const lesson of chapter?.lessons || []) {
    const questions = bank.filter(question => question.lessonId === lesson.id)
    const types = new Set(questions.map(question => question.type))
    check(`${lesson.id}: at least ${MIN_PER_LESSON} questions`, questions.length >= MIN_PER_LESSON, questions.length)
    check(`${lesson.id}: at least 3 question types`, types.size >= 3, [...types].join(','))
  }
}

/* ---------- Report ---------- */

function buildReport() {
  const byType = type => bank.filter(question => question.type === type).length
  const byDifficulty = difficulty => bank.filter(question => question.difficulty === difficulty).length
  const lines = [
    '# Question Bank — ChemLab Learning',
    '',
    'Generated by `node scripts/test-questions.mjs --write`; `npm run check:learning` fails when this file is stale.',
    '',
    '## Schema',
    '',
    '`id` (`<lessonId>-q<n>`) · `lessonId` (grade and chapterId filled from the catalog) · `type` · `difficulty` · `objective` · `content` · `options` / `statements` · `correctAnswer` · `explanation` · `solution` (numeric) · `verify()` (numeric: recomputes the answer) · `equations` (checked for balance) · `source` · `verificationStatus`.',
    '',
    'Types: `single`, `multiple`, `truefalse`, `short`, `numeric`. Difficulty: `recognize` (Nhận biết), `understand` (Thông hiểu), `apply` (Vận dụng), `advanced` (Vận dụng cao).',
    '',
    '## Totals',
    '',
    `- Questions: **${bank.length}** in ${QUESTION_CHAPTERS.size}/21 chapters; lessons with ≥ ${MIN_PER_LESSON} questions: ${allLessons().filter(lesson => bank.filter(question => question.lessonId === lesson.id).length >= MIN_PER_LESSON).length}/78.`,
    `- By type: ${Object.keys(QUESTION_TYPES).map(type => `${type} ${byType(type)}`).join(' · ')}.`,
    `- By difficulty: ${Object.entries(DIFFICULTIES).map(([id, label]) => `${label} ${byDifficulty(id)}`).join(' · ')}.`,
    `- Verification: ${[...STATUSES].map(status => `${status} ${bank.filter(question => question.verificationStatus === status).length}`).join(' · ')}.`,
    '',
    '## Per lesson',
    '',
    '| Lesson | Questions | single | multiple | truefalse | short | numeric |',
    '| --- | --- | --- | --- | --- | --- | --- |'
  ]
  for (const lesson of allLessons()) {
    const questions = bank.filter(question => question.lessonId === lesson.id)
    const count = type => questions.filter(question => question.type === type).length
    lines.push(`| ${lesson.id} ${lesson.title} | ${questions.length} | ${count('single')} | ${count('multiple')} | ${count('truefalse')} | ${count('short')} | ${count('numeric')} |`)
  }
  return `${lines.join('\n')}\n`
}

const report = buildReport()
if (process.argv.includes('--write')) {
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true })
  fs.writeFileSync(REPORT_PATH, report)
  console.log(`Wrote ${path.relative(rootDir, REPORT_PATH)}`)
}
const existing = fs.existsSync(REPORT_PATH) ? fs.readFileSync(REPORT_PATH, 'utf8').replace(/\r\n/g, '\n') : ''
check('question bank report is up to date (run with --write)', existing === report)

if (failures.length) {
  console.error(`FAIL — ${failures.length} question checks failed:`)
  for (const failure of failures.slice(0, 60)) console.error(`  ✗ ${failure}`)
  process.exit(1)
}
console.log(`PASS — ${passed} question checks passed (${bank.length} questions).`)
