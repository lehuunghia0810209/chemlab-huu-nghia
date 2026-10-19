// Learning foundation checks: catalog integrity, lesson content schema,
// worked-example arithmetic, progress migration and the coverage report.
//   node scripts/test-learning.mjs          → run checks (fails if the report is stale)
//   node scripts/test-learning.mjs --write  → regenerate docs/learning/CURRICULUM_COVERAGE.md
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// In-memory localStorage so progressStorage runs under Node.
const store = new Map()
globalThis.localStorage = {
  getItem: key => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: key => store.delete(key),
  clear: () => store.clear()
}
globalThis.window = { dispatchEvent() {} }
globalThis.CustomEvent = class { constructor(type, init) { this.type = type; this.detail = init?.detail } }

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const COVERAGE_PATH = path.join(rootDir, 'docs', 'learning', 'CURRICULUM_COVERAGE.md')

const { GRADES, STATUS, allLessons, findLesson, loadLessonContent, CURRICULUM_SOURCES } = await import('../src/learning/catalog.js')
const { buildLegacyLesson } = await import('../src/learning/legacyAdapter.js')
const { parseRoute, routeHash } = await import('../src/learning/routes.js')
const { FIGURES } = await import('../src/learning/figures.js')
const progressApi = await import('../src/learning/lessonProgress.js')
const { PROGRESS_STORAGE_KEY, loadProgress } = await import('../src/progress/progressStorage.js')
const { getExperimentById } = await import('../src/lab/experiments/experiments.js')
const { STANDARD_POTENTIALS } = await import('../src/learning/lessons/g12-l15.js')

let passed = 0
const failures = []
function globalCheck(name, condition, detail = '') {
  if (condition) passed += 1
  else failures.push(`${name}${detail ? ` — ${detail}` : ''}`)
}
const check = globalCheck
const near = (a, b, tolerance) => Math.abs(a - b) <= tolerance

/* ---------- Catalog ---------- */

// Chapter/lesson counts of SGK Hóa học 10/11/12 Kết nối tri thức (core programme, no chuyên đề).
const EXPECTED = { 10: { chapters: 7, lessons: 23 }, 11: { chapters: 6, lessons: 25 }, 12: { chapters: 8, lessons: 30 } }

for (const grade of GRADES) {
  const lessons = grade.chapters.flatMap(chapter => chapter.lessons)
  check(`grade ${grade.grade}: chapter count`, grade.chapters.length === EXPECTED[grade.grade].chapters, grade.chapters.length)
  check(`grade ${grade.grade}: lesson count`, lessons.length === EXPECTED[grade.grade].lessons, lessons.length)
  check(`grade ${grade.grade}: chapters numbered 1..n`, grade.chapters.every((chapter, index) => chapter.number === index + 1))
  check(`grade ${grade.grade}: lessons numbered 1..n in order`, lessons.every((lesson, index) => lesson.number === index + 1))
  check(`grade ${grade.grade}: each chapter ends with its review lesson`,
    grade.chapters.every(chapter => chapter.lessons.at(-1).review && chapter.lessons.at(-1).title === `Ôn tập chương ${chapter.number}`))
}

const lessons = allLessons()
check('lesson ids unique', new Set(lessons.map(lesson => lesson.id)).size === lessons.length)
check('lesson ids keep the g<grade>-l<number> form', lessons.every(lesson => lesson.id === `g${lesson.grade}-l${lesson.number}`))
check('every lesson has a known status', lessons.every(lesson => STATUS[lesson.status]))
check('activity references resolve', lessons.every(lesson => lesson.activityIds.every(id => getExperimentById(id))))
check('only lessons without content are catalogued', lessons.filter(lesson => lesson.status === 'catalogued').every(lesson => !lesson.activityIds.length))
check('curriculum sources carry document references', CURRICULUM_SOURCES.every(source => source.title && source.reference))

const published = lessons.filter(lesson => lesson.status === 'published')
check('a published lesson exists for each grade', [10, 11, 12].every(grade => published.some(lesson => lesson.grade === grade)))

/* ---------- Lesson content ---------- */

const KINDS = new Set(['objectives', 'concept', 'example', 'practice', 'check', 'summary'])
const BLOCKS = new Set(['p', 'heading', 'list', 'equation', 'table', 'callout', 'figure', 'worked', 'quiz', 'activity'])
const TOOLS = new Set(['balancer', 'calculator', 'solubility', 'ions', 'orbital', 'compound', 'reaction'])

function validateAction(action) {
  if (action.kind === 'atomic') return Number.isInteger(action.element) && action.element >= 1 && action.element <= 118
  if (action.kind === 'guided') {
    const experiment = getExperimentById(action.experimentId)
    return Boolean(experiment && experiment.lessonId === action.lessonId && experiment.grade === action.grade)
  }
  if (action.kind === 'tool') return TOOLS.has(action.tool)
  if (action.kind === 'periodic') return Number.isInteger(action.element)
  return false
}

function validateContent(content, label, { full }) {
  const problems = []
  const check = (name, condition, detail = '') => {
    if (!condition) problems.push(`${name}${detail ? ` (${detail})` : ''}`)
  }
  const ids = content.steps.map(step => step.id)
  check(`${label}: step ids unique`, new Set(ids).size === ids.length)
  check(`${label}: has steps`, ids.length >= 2)
  const quizIds = []
  for (const step of content.steps) {
    check(`${label}/${step.id}: kind`, KINDS.has(step.kind), step.kind)
    check(`${label}/${step.id}: title`, typeof step.title === 'string' && step.title.length > 0)
    check(`${label}/${step.id}: blocks`, Array.isArray(step.blocks) && step.blocks.length > 0)
    for (const block of step.blocks) {
      check(`${label}/${step.id}: block type ${block.type}`, BLOCKS.has(block.type))
      if (block.type === 'quiz') {
        quizIds.push(block.id)
        check(`${label}/${block.id}: correct option exists`, block.options.some(option => option.id === block.correct))
        check(`${label}/${block.id}: option ids unique`, new Set(block.options.map(option => option.id)).size === block.options.length)
        check(`${label}/${block.id}: explanation`, Boolean(block.explanation))
      }
      if (block.type === 'figure') check(`${label}: figure ${block.figure} exists`, Boolean(FIGURES[block.figure]))
      if (block.type === 'activity') check(`${label}: activity ${JSON.stringify(block.action)} resolves`, validateAction(block.action))
      if (block.type === 'table') check(`${label}: table rows match header`, block.rows.every(row => row.length === block.head.length))
      if (block.type === 'worked') check(`${label}: worked example complete`, block.problem && block.steps.length && block.answer)
      if (block.table) check(`${label}: worked table rows match header`, block.table.rows.every(row => row.length === block.table.head.length))
    }
  }
  check(`${label}: quiz ids unique`, new Set(quizIds).size === quizIds.length)
  if (full) {
    check(`${label}: begins with objectives`, content.steps[0].kind === 'objectives')
    check(`${label}: ends with summary`, content.steps.at(-1).kind === 'summary')
    for (const kind of ['concept', 'example', 'check']) check(`${label}: has ${kind} step`, content.steps.some(step => step.kind === kind))
    check(`${label}: has at least 3 quick-check questions`, quizIds.length >= 3)
    check(`${label}: requirements, prerequisites, sources`, content.requirements?.length && content.prerequisites?.length && content.sources?.length)
    check(`${label}: verification is labelled internal, not expert-approved`, content.verification?.level === 'internal' && /Chưa qua thẩm định/.test(content.verification.note))
    check(`${label}: contentVersion`, Number.isInteger(content.contentVersion) && content.contentVersion >= 1)
  }
  globalCheck(`${label}: content schema`, !problems.length, problems.slice(0, 3).join('; '))
}

const contents = {}
for (const lesson of published) {
  const content = await loadLessonContent(lesson.id)
  contents[lesson.id] = content
  check(`${lesson.id}: content id matches`, content.id === lesson.id)
  validateContent(content, lesson.id, { full: true })
}

for (const lesson of lessons.filter(item => item.status === 'legacy')) {
  validateContent(buildLegacyLesson(lesson), `legacy ${lesson.id}`, { full: false })
}

/* ---------- Worked-example arithmetic ---------- */

const ME_AMU = 9.1093837e-31 / 1.66053907e-27
check('g10-l1: electron ≈ 0,00055 amu', near(ME_AMU, 0.00055, 0.000002))
check('g10-l1: mp/me ≈ 1836', Math.round(1.67262192e-27 / 9.1093837e-31) === 1836)
const naMass = 11 + 12 + 11 * 0.00055
check('g10-l1: m(Na) ≈ 23,006 amu', near(naMass, 23.006, 0.0005))
check('g10-l1: electron share ≈ 0,026%', near(11 * 0.00055 / naMass * 100, 0.026, 0.0005))
const solveParticles = (total, excess) => ({ p: (total + excess) / 4, n: (total - excess) / 2 })
check('g10-l1: 40/12 → p = 13, n = 14 (Al)', JSON.stringify(solveParticles(40, 12)) === JSON.stringify({ p: 13, n: 14 }))
check('g10-l1: 58/18 → p = 19, n = 20 (K)', JSON.stringify(solveParticles(58, 18)) === JSON.stringify({ p: 19, n: 20 }))
check('g10-l1: Cl has 17 + 18 = 35 amu', 17 + 18 === 35)

const kc = 0.786 ** 2 / (0.107 * 0.107)
check('g11-l1: KC from equilibrium concentrations ≈ 54', near(kc, 54, 0.1), kc.toFixed(2))
const root54 = Math.sqrt(54)
const x = 0.5 * root54 / (2 + root54)
check('g11-l1: KC = 54 gives x ≈ 0,393 M', near(x, 0.393, 0.0005), x.toFixed(4))
check('g11-l1: [HI] ≈ 0,786 M and [H₂] ≈ 0,107 M', near(2 * x, 0.786, 0.001) && near(0.5 - x, 0.107, 0.001))
check('g11-l1: NH₃ synthesis Δn(gas) = 2 − 4', 2 - (1 + 3) === -2)

const potential = pair => STANDARD_POTENTIALS.find(([name]) => name === pair)[2]
const emf = (cathode, anode) => Math.round((potential(cathode) - potential(anode)) * 100) / 100
check('g12-l15: E°(Zn–Cu) = 1,10 V', emf('Cu²⁺/Cu', 'Zn²⁺/Zn') === 1.1)
check('g12-l15: E°(Fe–Ag) = 1,24 V', emf('Ag⁺/Ag', 'Fe²⁺/Fe') === 1.24)
check('g12-l15: E°(Ni–Cu) = 0,60 V', emf('Cu²⁺/Cu', 'Ni²⁺/Ni') === 0.6)
check('g12-l15: 0,34 − 2,00 = −1,66 V is Al³⁺/Al', near(potential('Cu²⁺/Cu') - 2.0, potential('Al³⁺/Al'), 1e-9))
const reductants = ['Mg²⁺/Mg', 'Zn²⁺/Zn', 'Fe²⁺/Fe', 'Cu²⁺/Cu'].sort((a, b) => potential(a) - potential(b))
check('g12-l15: Mg is the strongest reductant of Mg, Zn, Fe, Cu', reductants[0] === 'Mg²⁺/Mg')
check('g12-l15: potentials ascend down the table', STANDARD_POTENTIALS.every((row, index, rows) => !index || rows[index - 1][2] <= row[2]))
check('g12-l15: Fe + Cu²⁺ is spontaneous, Cu + Fe²⁺ is not', potential('Cu²⁺/Cu') > potential('Fe²⁺/Fe'))

/* ---------- Routes ---------- */

check('route: home', parseRoute('#learning').name === 'home')
check('route: grade', parseRoute('#learning/grade-11').grade === 11)
check('route: lesson round-trips', parseRoute(routeHash({ name: 'lesson', lessonId: 'g12-l15' })).lessonId === 'g12-l15')
check('route: practice', parseRoute('#learning/practice').name === 'practice')
check('route: unknown grade falls back to home', parseRoute('#learning/grade-9').name === 'home')
check('route: malformed escape does not throw', parseRoute('#learning/lesson/%E0').name === 'lesson')
check('route: other views ignored', parseRoute('#lab') === null)

/* ---------- Progress & migration ---------- */

const g10l1 = findLesson('g10-l1').lesson
const content10 = contents['g10-l1']
const stepIds = content10.steps.map(step => step.id)

// Legacy v1 record: completed before 6.3, none of the reader fields.
store.clear()
store.set(PROGRESS_STORAGE_KEY, JSON.stringify({
  version: 1,
  learning: {
    grade10: { lessons: { 'g10-l1': { grade: 10, lessonId: 'g10-l1', started: true, completed: true, progress: 100 }, 'g10-l99': { lastOpened: '2026-01-01T00:00:00.000Z', started: true } }, chapters: {}, completedLessons: ['g10-l1'] },
    grade11: { lessons: { 'g11-l1': { started: true, lastOpened: '2026-02-01T00:00:00.000Z', currentStep: 'not-a-step', viewedSteps: 'corrupt', answers: { x: 1, 'g11-l1-c1': { choice: 'b', correct: true } } } }, chapters: {}, completedLessons: [] },
    grade12: { lessons: {}, chapters: {}, completedLessons: [] }
  },
  statistics: { completedLessons: 1, totalAnswers: 4 }
}))

const legacyState = progressApi.readLessonState(g10l1, content10)
check('migration: legacy completion kept', legacyState.completed === true)
check('migration: missing currentStep → first step', legacyState.currentStep === stepIds[0])
check('migration: no viewed steps invented', legacyState.viewed.size === 0)

const g11l1 = findLesson('g11-l1').lesson
const state11 = progressApi.readLessonState(g11l1, contents['g11-l1'])
check('migration: invalid step id → first step', state11.currentStep === 'objectives')
check('migration: corrupt viewedSteps tolerated', state11.viewed.size === 0)
check('migration: malformed answers dropped, valid kept', Object.keys(state11.answers).join() === 'g11-l1-c1')

const resume = progressApi.findContinueLesson(loadProgress())
check('continue: deleted lesson ids ignored, unfinished lesson preferred', resume?.entry.lesson.id === 'g11-l1')

// Reader saves keep legacy fields and unknown step ids from other content versions.
store.set(PROGRESS_STORAGE_KEY, JSON.stringify({
  ...JSON.parse(store.get(PROGRESS_STORAGE_KEY)),
  learning: {
    ...JSON.parse(store.get(PROGRESS_STORAGE_KEY)).learning,
    grade10: { lessons: { 'g10-l1': { started: true, viewedSteps: ['old-step'], note: 'keep' } }, chapters: {}, completedLessons: [] }
  }
}))
const fresh = progressApi.readLessonState(g10l1, content10)
fresh.viewed.add('objectives')
fresh.currentStep = 'structure'
progressApi.saveLessonState(g10l1, content10, fresh)
let record = JSON.parse(store.get(PROGRESS_STORAGE_KEY)).learning.grade10.lessons['g10-l1']
check('save: unknown fields preserved', record.note === 'keep')
check('save: step ids from other versions preserved', record.viewedSteps.includes('old-step') && record.viewedSteps.includes('objectives'))
check('save: current step stored', record.currentStep === 'structure')
check('save: opening is not completion', record.completed !== true)
check('save: progress percent from learned steps', record.progress === Math.round(1 / stepIds.length * 100))
check('save: last activity points to the lesson', JSON.parse(store.get(PROGRESS_STORAGE_KEY)).lastActivity?.lessonId === 'g10-l1')

check('completion: final step needs earlier steps learned', progressApi.missingSteps(stepIds, fresh.viewed).length === stepIds.length - 2)
const before = JSON.parse(store.get(PROGRESS_STORAGE_KEY)).statistics.completedLessons
stepIds.forEach(id => fresh.viewed.add(id))
check('completion: nothing missing once all steps learned', progressApi.missingSteps(stepIds, fresh.viewed).length === 0)
progressApi.completeLesson(g10l1, content10, fresh)
progressApi.completeLesson(g10l1, content10, fresh)
const afterProgress = JSON.parse(store.get(PROGRESS_STORAGE_KEY))
record = afterProgress.learning.grade10.lessons['g10-l1']
check('completion: lesson marked completed', record.completed === true && record.progress === 100)
check('completion: counted once', afterProgress.statistics.completedLessons === before + 1)
progressApi.saveLessonState(g10l1, content10, { ...fresh, viewed: new Set(['objectives']) })
check('completion: later saves keep 100%', JSON.parse(store.get(PROGRESS_STORAGE_KEY)).learning.grade10.lessons['g10-l1'].progress === 100)

// Legacy lessons still count guided Lab completion.
const legacyLesson = findLesson('g10-l22').lesson
store.set(PROGRESS_STORAGE_KEY, JSON.stringify({
  experiments: { grade10: Object.fromEntries(legacyLesson.activityIds.map(id => [id, { completed: true, started: true }])) }
}))
check('summary: legacy lesson completed through its Lab activities', progressApi.lessonSummary(legacyLesson).completed === true)

// Corrupt storage is backed up, not silently lost.
store.clear()
store.set(PROGRESS_STORAGE_KEY, '{not json')
loadProgress()
check('corrupt progress: raw payload backed up', store.get(`${PROGRESS_STORAGE_KEY}-corrupt-backup`) === '{not json')
check('corrupt progress: defaults written', JSON.parse(store.get(PROGRESS_STORAGE_KEY)).version === 1)

/* ---------- Coverage report ---------- */

const VERIFICATION = {
  published: 'Kiểm tra nội bộ: phép tính tự động, đối chiếu nguồn; chưa thẩm định độc lập',
  legacy: 'Nội dung cũ, chưa rà soát lại',
  catalogued: '—'
}

function buildCoverage() {
  const lines = [
    '# Curriculum Coverage — ChemLab Learning',
    '',
    'Generated by `node scripts/test-learning.mjs --write`; `npm run check:learning` fails when this file is stale.',
    '',
    'Scope: core Hóa học 10–12 programme (no chuyên đề), lesson list of SGK *Kết nối tri thức với cuộc sống*.',
    '',
    '## Sources',
    '',
    ...CURRICULUM_SOURCES.map(source => `- **${source.title}** — ${source.reference}. ${source.note}`),
    '',
    '## Summary',
    '',
    '| Grade | Chapters | Lessons | Full lessons | Short (legacy) | Catalogued only |',
    '| --- | --- | --- | --- | --- | --- |',
    ...GRADES.map(grade => {
      const list = grade.chapters.flatMap(chapter => chapter.lessons)
      const count = status => list.filter(lesson => lesson.status === status).length
      return `| ${grade.grade} | ${grade.chapters.length} | ${list.length} | ${count('published')} | ${count('legacy')} | ${count('catalogued')} |`
    }),
    '',
    'Every lesson is reachable at `#learning/lesson/<id>` (checked by `npm run check:browser`).',
    '',
    '## Matrix',
    '',
    '| Grade | Chapter | Lesson | Requirement | Source | Content status | UI | Verification |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |'
  ]
  for (const grade of GRADES) {
    for (const chapter of grade.chapters) {
      for (const lesson of chapter.lessons) {
        const requirement = contents[lesson.id]
          ? `${contents[lesson.id].requirements.length} yêu cầu cần đạt (diễn đạt lại)`
          : 'Chưa trích'
        lines.push(`| ${grade.grade} | ${chapter.number}. ${chapter.title} | ${lesson.number}. ${lesson.title} | ${requirement} | SGK KNTT | ${STATUS[lesson.status].label} | \`#learning/lesson/${lesson.id}\` | ${VERIFICATION[lesson.status]} |`)
      }
    }
  }
  return `${lines.join('\n')}\n`
}

const coverage = buildCoverage()
if (process.argv.includes('--write')) {
  fs.mkdirSync(path.dirname(COVERAGE_PATH), { recursive: true })
  fs.writeFileSync(COVERAGE_PATH, coverage)
  console.log(`Wrote ${path.relative(rootDir, COVERAGE_PATH)}`)
}
const existing = fs.existsSync(COVERAGE_PATH) ? fs.readFileSync(COVERAGE_PATH, 'utf8').replace(/\r\n/g, '\n') : ''
check('coverage report is up to date (run with --write)', existing === coverage)

if (failures.length) {
  console.error(`FAIL — ${failures.length} learning checks failed:`)
  for (const failure of failures) console.error(`  ✗ ${failure}`)
  process.exit(1)
}
console.log(`PASS — ${passed} learning checks passed.`)
