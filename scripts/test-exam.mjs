// Exam engine tests: blueprint, scoring, validation, publication gate, sessions.
// Runs without a browser: storage and clock are injected.
import { BLUEPRINTS, getBlueprint, formatPoints } from '../src/exam/blueprints.js'
import { scoreExam, scoreQuestion, validateShortAnswer, normalizeShortAnswer, analyse } from '../src/exam/scoring.js'
import { validatePaper } from '../src/exam/validate.js'
import { EXAMS, isTakeable, visibleExams, findExam, FIXTURE_FLAG, REQUIRED_STATES, stateList } from '../src/exam/catalog.js'
import { createExamStore, STORE_KEY, CORRUPT_KEY } from '../src/exam/session.js'
import fixture from '../src/exam/papers/fixture-kiem-thu.js'
import { GRADES } from '../src/learning/catalog.js'

let passed = 0
const failures = []
function check(name, condition, detail = '') {
  if (condition) passed += 1
  else failures.push(`${name}${detail ? ` — ${detail}` : ''}`)
}

function memoryStorage({ failWrites = false } = {}) {
  const map = new Map()
  return {
    failWrites,
    getItem: key => (map.has(key) ? map.get(key) : null),
    setItem(key, value) {
      if (this.failWrites) throw new Error('QuotaExceededError')
      map.set(key, String(value))
    },
    removeItem: key => map.delete(key),
    raw: map
  }
}

/* ---------- Blueprint ---------- */
const blueprint = getBlueprint('thpt-2025-hoa')
check('blueprint exists', Boolean(blueprint))
const total = blueprint.parts.reduce((sum, part) => sum + part.count * (part.type === 'truefalse' ? part.tableHundredths.at(-1) : part.pointsHundredths), 0)
check('blueprint totals exactly 10 points', total === 1000 && blueprint.maxPointsHundredths === 1000, String(total))
check('blueprint 18 + 4 + 6 questions, 50 minutes', blueprint.parts.map(part => part.count).join() === '18,4,6' && blueprint.timeLimitMinutes === 50)
check('true/false table 0 / 0,1 / 0,25 / 0,5 / 1', blueprint.parts[1].tableHundredths.join() === '0,10,25,50,100')
check('blueprint applies to 2025 and 2026', blueprint.appliesTo.join() === '2025,2026')
check('points formatted with decimal comma', formatPoints(825) === '8,25' && formatPoints(1000) === '10')
check('every blueprint frozen', Object.values(BLUEPRINTS).every(Object.isFrozen))

/* ---------- Scoring primitives ---------- */
const [partI, partII, partIII] = blueprint.parts
const single = { id: 's', options: ['A', 'B', 'C', 'D'].map(id => ({ id, text: id })), answer: 'B' }
check('single correct = 0,25', scoreQuestion(single, 'B', partI).points === 25)
check('single wrong = 0', scoreQuestion(single, 'A', partI).status === 'wrong' && scoreQuestion(single, 'A', partI).points === 0)
check('single unanswered = 0', scoreQuestion(single, undefined, partI).status === 'unanswered')
check('single invalid choice = 0', scoreQuestion(single, 'E', partI).status === 'invalid')

const tf = { id: 't', statements: ['a', 'b', 'c', 'd'].map(id => ({ id, text: id })), answer: { a: true, b: false, c: true, d: false } }
let tfCases = 0
let tfOk = true
const values = [true, false, undefined]
for (const a of values) for (const b of values) for (const c of values) for (const d of values) {
  const response = {}
  ;[['a', a], ['b', b], ['c', c], ['d', d]].forEach(([id, value]) => { if (value !== undefined) response[id] = value })
  const correctCount = ['a', 'b', 'c', 'd'].filter(id => response[id] === tf.answer[id]).length
  const expected = [0, 10, 25, 50, 100][correctCount]
  const result = scoreQuestion(tf, response, partII)
  const expectedStatus = !Object.keys(response).length ? 'unanswered' : correctCount === 4 ? 'correct' : correctCount ? 'partial' : 'wrong'
  if (result.points !== expected || result.status !== expectedStatus) tfOk = false
  tfCases += 1
}
check('true/false: all 81 answered/unanswered combinations score by the official table', tfOk && tfCases === 81)

const short = { id: 'x', answer: '0,2' }
check('short exact', scoreQuestion(short, '0,2', partIII).points === 25)
check('short dot read as comma', scoreQuestion(short, '0.2', partIII).points === 25)
check('short spaces ignored', scoreQuestion(short, ' 0,2 ', partIII).points === 25)
check('short no hidden tolerance (0,20 ≠ 0,2)', scoreQuestion(short, '0,20', partIII).status === 'wrong')
check('short no numeric tolerance (0,21)', scoreQuestion(short, '0,21', partIII).points === 0)
check('short over 4 chars invalid', scoreQuestion(short, '0,200', partIII).status === 'invalid')
check('short letters invalid', scoreQuestion(short, '0,2g', partIII).status === 'invalid')
check('short unanswered', scoreQuestion(short, '', partIII).status === 'unanswered')
check('short negative', scoreQuestion({ answer: '-1,5' }, '-1,5', partIII).points === 25)
check('short zero', scoreQuestion({ answer: '0' }, '0', partIII).points === 25 && scoreQuestion({ answer: '0' }, '-0', partIII).status === 'wrong')
check('short accept list honoured', scoreQuestion({ answer: '2,5', accept: ['2,50'] }, '2,50', partIII).points === 25)
check('short malformed number invalid', !validateShortAnswer('1,2,3', 4).ok && !validateShortAnswer('1-2', 4).ok && !validateShortAnswer('--1', 4).ok)
check('normalizeShortAnswer', normalizeShortAnswer(' 1.5 ') === '1,5')

/* ---------- Full synthetic paper (structure only, no chemistry content) ---------- */
function syntheticPaper() {
  let n = 0
  const id = () => `q${(n += 1)}`
  return {
    id: 'synthetic', title: 'Synthetic', kind: 'official-reference', blueprint: 'thpt-2025-hoa', license: 'licensed', dataVersion: 1,
    timeLimitMinutes: 50, answerKey: 'official', source: { authority: 'test', url: 'https://example.org' },
    sections: [
      { part: 'I', questions: Array.from({ length: 18 }, () => ({ id: id(), content: 'c', options: ['A', 'B', 'C', 'D'].map(o => ({ id: o, text: o })), answer: 'A', solution: { text: 's', official: true }, meta: { status: 'verified', chapters: ['g10-c1'], level: 'biet' } })) },
      { part: 'II', questions: Array.from({ length: 4 }, () => ({ id: id(), content: 'c', statements: ['a', 'b', 'c', 'd'].map(s => ({ id: s, text: s })), answer: { a: true, b: true, c: false, d: false }, solution: { text: 's', official: true }, meta: { status: 'verified', chapters: ['g10-c2'], level: 'hieu' } })) },
      { part: 'III', questions: Array.from({ length: 6 }, () => ({ id: id(), content: 'c', answer: '1,5', solution: { text: 's', official: true }, meta: { status: 'verified', chapters: ['g10-c3'], level: 'vandung' } })) }
    ]
  }
}
const chapterIds = new Set(GRADES.flatMap(grade => grade.chapters.map(chapter => chapter.id)))
const paper = syntheticPaper()
check('synthetic paper validates', validatePaper(paper, { chapterIds }).length === 0, validatePaper(paper, { chapterIds }).join('; '))
const allRight = {}
const allWrong = {}
for (const section of paper.sections) for (const q of section.questions) {
  if (section.part === 'I') { allRight[q.id] = 'A'; allWrong[q.id] = 'B' }
  if (section.part === 'II') { allRight[q.id] = { ...q.answer }; allWrong[q.id] = { a: false, b: false, c: true, d: true } }
  if (section.part === 'III') { allRight[q.id] = '1,5'; allWrong[q.id] = '2' }
}
check('all correct = 10 điểm', scoreExam(paper, allRight).earned === 1000)
check('all wrong = 0', scoreExam(paper, allWrong).earned === 0)
check('unanswered = 0', scoreExam(paper, {}).earned === 0 && scoreExam(paper, {}).questions.every(q => q.status === 'unanswered'))
// Mixed: 10 single right (2,5) + TF with 4/3/2/1 statements right (1+0,5+0,25+0,1) + 3 short right (0,75) = 5,1
const mixed = {}
paper.sections[0].questions.forEach((q, i) => { mixed[q.id] = i < 10 ? 'A' : 'C' })
const tfQs = paper.sections[1].questions
mixed[tfQs[0].id] = { a: true, b: true, c: false, d: false }
mixed[tfQs[1].id] = { a: true, b: true, c: false, d: true }
mixed[tfQs[2].id] = { a: true, b: true }
mixed[tfQs[3].id] = { a: true, b: false, c: true, d: true }
paper.sections[2].questions.forEach((q, i) => { mixed[q.id] = i < 3 ? '1.5' : '' })
const mixedScore = scoreExam(paper, mixed)
check('mixed answers total exactly 5,1', mixedScore.earned === 510, String(mixedScore.earned))
check('mixed per part 2,5 / 1,85 / 0,75', mixedScore.parts.map(p => p.earned).join() === '250,185,75', mixedScore.parts.map(p => p.earned).join())
check('possible = 10 điểm', mixedScore.possible === 1000)
const analysis = analyse(paper, mixedScore)
check('analysis by chapter and level', analysis.chapters.length === 3 && analysis.levels.length === 3 && analysis.unverified === 0)
check('analysis earned sums to total', analysis.levels.reduce((s, l) => s + l.earned, 0) === 510)

const broken = syntheticPaper()
broken.sections[0].questions.pop()
check('validator: wrong question count rejected', validatePaper(broken).some(e => e.includes('17 questions')))
const broken2 = syntheticPaper()
broken2.sections[2].questions[0].answer = '1,234'
check('validator: short key that cannot be written on the grid rejected', validatePaper(broken2).some(e => e.includes('answer grid')))
const broken3 = syntheticPaper()
broken3.sections[0].questions[0].answer = 'E'
broken3.sections[1].questions[0].answer.a = 'yes'
broken3.sections[0].questions[1].solution = { text: 'x' }
check('validator: bad keys and unlabeled solutions rejected', validatePaper(broken3).length >= 3)
const broken4 = syntheticPaper()
broken4.sections[0].questions[0].meta.chapters = ['g99-c1']
check('validator: unknown chapter rejected', validatePaper(broken4, { chapterIds }).some(e => e.includes('g99-c1')))
const broken5 = syntheticPaper()
broken5.timeLimitMinutes = 45
check('validator: official paper must follow blueprint time', validatePaper(broken5).some(e => e.includes('time limit')))

/* ---------- Fixture ---------- */
check('fixture validates against learning chapters', validatePaper(fixture, { chapterIds }).length === 0, validatePaper(fixture, { chapterIds }).join('; '))
check('fixture is labelled internal and not official', fixture.kind === 'fixture' && fixture.license === 'internal-fixture' && /không phải đề chính thức/.test(fixture.title))
check('fixture solutions are not presented as official', fixture.sections.every(s => s.questions.every(q => q.solution.official === false)))
const fixtureFull = {}
for (const s of fixture.sections) for (const q of s.questions) fixtureFull[q.id] = s.part === 'II' ? { ...q.answer } : q.answer
const fixtureScore = scoreExam(fixture, fixtureFull)
check('fixture all-correct = 3×0,25 + 2×1 + 3×0,25 = 3,5', fixtureScore.earned === 350 && fixtureScore.possible === 350)
check('fixture analysis reports one unverified question', analyse(fixture, fixtureScore).unverified === 1)

/* ---------- Publication gate ---------- */
const flagOff = memoryStorage()
const flagOn = memoryStorage()
flagOn.setItem(FIXTURE_FLAG, '1')
const official = EXAMS.filter(e => e.kind !== 'fixture')
check('only papers with every required state are takeable', official.every(e => isTakeable(e) === REQUIRED_STATES.every(state => e.states.includes(state))))
check('owner attestation recorded without claiming the licence was seen', official.every(e => e.rights.basis === 'owner_attestation' && e.rights.status === 'OWNER_ATTESTED' && e.rights.documentSeenByAgent === false))
check('official entries keep https source links', official.every(e => e.source.url.startsWith('https://')))
check('untranscribed papers stay metadata-only', official.filter(e => !e.states.includes('CONTENT_TRANSCRIBED')).every(e => !e.load && !isTakeable(e)))
check('READY_FOR_OWNER_RELEASE is derived, never declared', official.every(e => !e.states.includes('READY_FOR_OWNER_RELEASE')) && stateList(findExam('tham-khao-2025-hoa')).includes('READY_FOR_OWNER_RELEASE'))
check('fixture hidden and not takeable without flag', !isTakeable(findExam('fixture-kiem-thu'), { storage: flagOff }) && !visibleExams({ storage: flagOff }).some(e => e.kind === 'fixture'))
check('fixture takeable with flag', isTakeable(findExam('fixture-kiem-thu'), { storage: flagOn }))
const almost = { kind: 'official-exam', load: () => null, states: REQUIRED_STATES.filter(state => state !== 'ANSWER_KEY_VERIFIED') }
check('a paper missing one state (answer key) is blocked', !isTakeable(almost) && isTakeable({ ...almost, states: [...REQUIRED_STATES] }))

/* ---------- Sessions ---------- */
const entry = findExam('fixture-kiem-thu')
let clock = Date.UTC(2026, 9, 20, 8, 0, 0)
const storage = memoryStorage()
const store = createExamStore({ storage, now: () => clock })
const { session } = store.start(entry, fixture)
check('session deadline = start + time limit', session.deadline - session.startedAt === 15 * 60_000)
check('answer saved', store.setAnswer(entry.id, session.id, 'f-1', 'A').ok)
store.setFlag(entry.id, session.id, 'f-2', true)
store.setCurrent(entry.id, session.id, 3)
const reloaded = createExamStore({ storage, now: () => clock }).getSession(entry.id)
check('reload restores answers, flags and position', reloaded.answers['f-1'] === 'A' && reloaded.flags['f-2'] === true && reloaded.current === 3)
check('start again resumes the active session', store.start(entry, fixture).resumed === true && store.start(entry, fixture).session.id === session.id)
clock += 5 * 60_000
check('remaining time from persisted deadline', store.remainingMs(store.getSession(entry.id)) === 10 * 60_000)
store.setAnswer(entry.id, session.id, 'f-4', { a: true })
clock -= 3 * 60_000 // device clock moved back
check('clock rollback does not add time', store.remainingMs(store.getSession(entry.id)) === 10 * 60_000)
store.setAnswer(entry.id, session.id, 'f-6', '0,2')
check('large rollback flagged', store.getSession(entry.id).clockAnomaly === true)
clock += 3 * 60_000

// Two tabs: each writes from a stale view; both answers must survive.
const tabB = createExamStore({ storage, now: () => clock })
store.setAnswer(entry.id, session.id, 'f-7', '2,5')
tabB.setAnswer(entry.id, session.id, 'f-8', '2')
const merged = store.getSession(entry.id).answers
check('two tabs do not overwrite each other', merged['f-7'] === '2,5' && merged['f-8'] === '2' && merged['f-1'] === 'A')
check('clearing an answer is explicit', store.setAnswer(entry.id, session.id, 'f-8', '').ok && !('f-8' in store.getSession(entry.id).answers))
check('write for another session id refused', store.setAnswer(entry.id, 'other', 'f-1', 'B').reason === 'missing')

// Interrupted save: failing storage keeps the previous data.
storage.failWrites = true
const failed = store.setAnswer(entry.id, session.id, 'f-1', 'B')
storage.failWrites = false
check('failed write reported', failed.ok === false && failed.reason === 'storage')
check('failed write leaves stored answer intact', store.getSession(entry.id).answers['f-1'] === 'A')

check('version mismatch blocks submit', store.submit(entry.id, session.id, { ...fixture, dataVersion: 2 }).reason === 'version')
const submitted = store.submit(entry.id, session.id, fixture)
check('submit scores stored answers', submitted.ok && submitted.result.earned === 25 + 10 + 25 + 25 && submitted.result.reason === 'manual', JSON.stringify(submitted.result?.earned))
const again = store.submit(entry.id, session.id, fixture)
check('duplicate submit returns the same result', again.duplicate === true && again.result.id === submitted.result.id && store.results(entry.id).length === 1)
check('no edits after submit', store.setAnswer(entry.id, session.id, 'f-2', 'C').reason === 'submitted')
check('reload after submit shows submitted state', createExamStore({ storage, now: () => clock }).getSession(entry.id).status === 'submitted')
check('result keeps clock anomaly flag', submitted.result.clockAnomaly === true)

// Expiry while the tab was closed.
store.discard(entry.id)
const late = store.start(entry, fixture).session
store.setAnswer(entry.id, late.id, 'f-1', 'A')
clock += 16 * 60_000
check('expired session detected', store.isExpired(store.getSession(entry.id)) && store.remainingMs(store.getSession(entry.id)) === 0)
check('answers refused after deadline', store.setAnswer(entry.id, late.id, 'f-2', 'C').reason === 'expired')
const timeout = store.submit(entry.id, late.id, fixture)
check('expired session submits as timeout at the deadline', timeout.result.reason === 'timeout' && timeout.result.submittedAt === late.deadline && timeout.result.earned === 25)
check('result history keeps both attempts', store.results(entry.id).length === 2)

// Corrupt and old data.
const corrupt = memoryStorage()
corrupt.setItem(STORE_KEY, '{not json')
const corruptStore = createExamStore({ storage: corrupt, now: () => clock })
check('corrupt JSON resets with notice and backup', corruptStore.getSession(entry.id) === null && corruptStore.takeNotice() && corrupt.getItem(CORRUPT_KEY) === '{not json')
const oldVersion = memoryStorage()
oldVersion.setItem(STORE_KEY, JSON.stringify({ version: 0, sessions: {} }))
check('unknown store version is not trusted', createExamStore({ storage: oldVersion }).getSession(entry.id) === null && oldVersion.getItem(CORRUPT_KEY))
const badSession = memoryStorage()
badSession.setItem(STORE_KEY, JSON.stringify({ version: 1, sessions: { [entry.id]: { id: 'x', examId: entry.id, deadline: 'soon' } }, results: [] }))
const badStore = createExamStore({ storage: badSession })
check('malformed session dropped with notice', badStore.getSession(entry.id) === null && /bỏ qua/.test(badStore.takeNotice()))
const throwing = { getItem() { throw new Error('denied') }, setItem() { throw new Error('denied') }, removeItem() {} }
const throwingStore = createExamStore({ storage: throwing, now: () => clock })
check('blocked storage does not crash', throwingStore.getSession(entry.id) === null && throwingStore.start(entry, fixture).saved === false)

// Separate exams do not mix.
const multi = createExamStore({ storage: memoryStorage(), now: () => clock })
const s1 = multi.start(entry, fixture).session
const s2 = multi.start({ id: 'other-exam' }, { ...fixture, id: 'other-exam' }).session
multi.setAnswer(entry.id, s1.id, 'f-1', 'A')
multi.setAnswer('other-exam', s2.id, 'f-1', 'D')
check('sessions of two exams stay separate', multi.getSession(entry.id).answers['f-1'] === 'A' && multi.getSession('other-exam').answers['f-1'] === 'D')

if (failures.length) {
  console.error(`FAIL — ${failures.length} exam checks failed:`)
  failures.forEach(failure => console.error(`  ✗ ${failure}`))
  process.exit(1)
}
console.log(`PASS — ${passed} exam checks passed.`)
