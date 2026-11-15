// ChemAI 6.7 hybrid routing: ChemLab Engine (0 tokens) → openai/gpt-oss-20b → openai/gpt-oss-120b.
// Mocked Groq and an in-memory exact quota counter only; no real network call is possible.
import assert from 'node:assert/strict'
import { onRequestPost, routeModel, conversationHistory, isFollowUp, SMALL_MODEL, LARGE_MODEL } from '../functions/api/chat.js'
import { engineAnswer, TEXTBOOK_MASS, fmt } from '../functions/api/_chemEngine.js'
import { answerGuard, questionMolarVolume } from '../functions/api/_chemFacts.js'
import { elements } from '../src/data/elements.js'
import { getElectronConfiguration } from '../src/chem/electronConfiguration.js'
import { APP_VERSION } from '../src/appMeta.js'

const HOST = 'chemlab.example'
const origin = `https://${HOST}`
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Same contract as workers/chemai-quota (consume / refund, one state per name).
const exactBudget = () => {
  const states = new Map()
  return {
    used: prefix => [...states].filter(([name]) => name.startsWith(prefix)).reduce((sum, [, state]) => sum + state.used, 0),
    idFromName: name => name,
    get: id => ({
      fetch: async (url, init) => {
        const body = JSON.parse(init.body)
        const state = states.get(id) || { day: '', used: 0 }
        states.set(id, state)
        if (new URL(url).pathname === '/refund') {
          if (state.day === body.day) state.used = Math.max(0, state.used - body.units)
          return Response.json({ used: state.used })
        }
        const { day, limit, cost = 1 } = body
        if (state.day !== day) Object.assign(state, { day, used: 0 })
        const allowed = state.used + cost <= limit
        if (allowed) state.used += cost
        return Response.json({ allowed, used: state.used })
      }
    })
  }
}
const makeEnv = (extra = {}) => ({
  GROQ_API_KEY: 'gsk_test0nly0not0a0real0key0000',
  CHEMAI_BUDGET: exactBudget(),
  CHEMAI_ACCESS_MODE: 'public',
  CHEMAI_PUBLIC_APPROVAL: `groq:${APP_VERSION}`,
  CHEMAI_PUBLIC_HOSTS: HOST,
  ...extra
})
let ip = 1
const ask = (env, message, history = []) => onRequestPost({
  env,
  request: new Request(`${origin}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin, 'CF-Connecting-IP': `198.51.100.${ip++}` },
    body: JSON.stringify({ message, history, context: { view: 'learning' } })
  })
}).then(async response => ({ status: response.status, payload: await response.json() }))

const logs = []
for (const level of ['log', 'warn', 'error']) console[level] = (...args) => logs.push(args.map(String).join(' '))
const calls = []
let replies = []
globalThis.fetch = async (url, init) => {
  if (String(url) !== GROQ_URL) throw new Error(`unexpected network call: ${url}`)
  calls.push(JSON.parse(init.body))
  const next = replies.shift()
  if (!next) throw new Error('no scripted reply left')
  return next()
}
const reply = (answer, { total = 1000, finish = 'stop', raw = null } = {}) => () => Response.json({
  choices: [{ message: { role: 'assistant', content: raw ?? JSON.stringify({ answer, actions: [], suggestions: [] }) }, finish_reason: finish }],
  usage: { prompt_tokens: total - 200, completion_tokens: 200, total_tokens: total, completion_tokens_details: { reasoning_tokens: 50 } }
})

let passed = 0
const test = async (name, fn) => {
  calls.length = 0
  replies = []
  try { await fn() }
  catch (error) { console.info(`FAIL — ${name}`); throw error }
  passed += 1
}

// ---------------- engine: data ----------------

await test('textbook atomic masses agree with ChemLab element data (no typo can slip in)', () => {
  for (const [symbol, mass] of Object.entries(TEXTBOOK_MASS)) {
    const element = elements.find(item => item.symbol === symbol)
    assert.ok(element, symbol)
    assert.ok(Math.abs(element.mass - mass) <= 0.6, `${symbol}: ${mass} vs ${element.mass}`)
  }
  assert.equal(TEXTBOOK_MASS.Cl, 35.5)
  assert.equal(TEXTBOOK_MASS.Cu, 64)
})

await test('every ground-state configuration Z = 1…36 is recognised as exactly its element', () => {
  for (let z = 1; z <= 36; z += 1) {
    const { full } = getElectronConfiguration(z)
    const symbol = elements.find(item => item.number === z).symbol
    const result = engineAnswer(`${full} là cấu hình của nguyên tố nào?`)
    assert.ok(result, `Z=${z}`)
    assert.match(result.answer, new RegExp(`\\(${symbol}\\)\\*\\* — số hiệu nguyên tử Z = ${z}\\b`), `Z=${z}`)
  }
  // Excited or wrong configurations are not guessed: the model explains them.
  assert.equal(engineAnswer('1s2 2s2 2p6 3s2 3p6 4s2 3d4 là nguyên tố nào?'), null, 'Cr written by Aufbau is not its ground state')
  assert.equal(engineAnswer('1s2 2s1 2p1 là nguyên tố nào?'), null)
})

await test('number formatting: decimal comma, 5 significant figures, powers of ten', () => {
  assert.equal(fmt(49), '49')
  assert.equal(fmt(6.1975), '6,1975')
  assert.equal(fmt(0.1 * 3), '0,3')
  assert.equal(fmt(0.0015), '0,0015')
  assert.equal(fmt(0.00015), '1,5·10⁻⁴')
})

// ---------------- engine: answers ----------------

const SOLVED = [
  ['Cấu hình electron của Neon', /1s² 2s² 2p⁶/, 'element:configuration'],
  ['Viết cấu hình electron của Fe', /\[Ar\] 3d⁶ 4s²[\s\S]*chu kì 4, nhóm VIIIB/, 'element:configuration'],
  ['Cấu hình electron nguyên tử Cu', /3d¹⁰ 4s¹[\s\S]*Lưu ý/, 'element:configuration'],
  ['Nguyên tố có Z = 17 là gì?', /Chlorine – clo \(Cl\)[\s\S]*nhóm VIIA/, 'element:lookup'],
  ['Kí hiệu hóa học của kali là gì?', /\(K\)\*\* — số hiệu nguyên tử Z = 19/, 'element:lookup'],
  ['Neon có bao nhiêu electron?', /10 proton và 10 electron/, 'element:particles'],
  ['Nguyên tử khối của Cl', /35,5 \(SGK/, 'element:atomic-mass'],
  ['Khối lượng mol của H2SO4', /= \*\*98 g\/mol\*\*/, 'molar-mass'],
  ['Phân tử khối của Ba(OH)₂', /= \*\*171 g\/mol\*\*/, 'molar-mass'],
  ['Khối lượng của 0,5 mol H2SO4 là bao nhiêu?', /m\(H₂SO₄\) = n × M = 0,5 × 98 = 49 g/, 'amount:mol->mass'],
  ['Tính số mol của 9,8 gam H2SO4', /n\(H₂SO₄\) = m\/M = 9,8 \/ 98 = 0,1 mol/, 'amount:g->mol'],
  ['Tính số mol của 11,2 lít khí H2 (đktc)', /11,2 \/ 22,4 = 0,5 mol/, 'amount:L->mol'],
  ['Tính thể tích của 0,25 mol khí CO2 ở đkc', /0,25 × 24,79 = 6,1975 L/, 'amount:mol->volume'],
  ['Tính khối lượng của 6,72 lít khí CO2 ở đktc', /0,3 × 44 = 13,2 g/, 'amount:L->mass'],
  ['Hòa tan 5,85 g NaCl vào nước được 200 mL dung dịch. Tính nồng độ mol của dung dịch.', /CM\(NaCl\) = n\/V = 0,1 \/ 0,2 = 0,5 M/, 'solution:g->molarity'],
  ['Tính khối lượng NaOH có trong 200 mL dung dịch NaOH 0,5M', /0,1 × 40 = 4 g/, 'solution:molarity->mass'],
  ['Tính pH của dung dịch HCl 0,01M', /pH = −log\[H⁺\] = −log\(0,01\) = 2\*\*/, 'ph:strong-acid'],
  ['pH của dung dịch Ba(OH)2 0,005 M là bao nhiêu?', /\[OH⁻\] = 2 × 0,005 = 0,01 M[\s\S]*pH = 14 − pOH = 12/, 'ph:strong-base'],
  ['Tính pH của dung dịch NaOH 1,5.10⁻³ M', /pH = 14 − pOH = 11,18/, 'ph:strong-base']
]
await test('engine answers its templates with the textbook result', () => {
  for (const [question, expected, kind] of SOLVED) {
    const result = engineAnswer(question)
    assert.ok(result, question)
    assert.equal(result.kind, kind, question)
    assert.match(result.answer, expected, question)
  }
})

const NOT_SOLVED = [
  'Tính pH của dung dịch H2SO4 0,01M', // diprotic: textbook convention differs from the lab's Ka2 model
  'Tính pH của dung dịch HCl 10^-8 M', // water's ions are not negligible
  'Tính pH của dung dịch CH3COOH 0,1M',
  'Cấu hình electron của Fe3+', 'Cấu hình electron của ion Fe²⁺', 'Cấu hình electron của Ag',
  'Cho 5,6 g Fe tác dụng với HCl dư. Tính V H2 ở đktc',
  'Tính thể tích của 0,5 mol O2', // no stated conditions
  'Tính thể tích của 0,5 mol H2O ở đktc', // not a gas
  'Hòa tan 4 g NaOH vào 200 mL nước. Tính nồng độ mol', // water volume, not solution volume
  'Khối lượng của 0,5 mol H2SO4 và 0,2 mol NaOH',
  'Cân bằng phương trình Fe + O2 → Fe3O4',
  'Còn của Mg thì sao?', 'Tính khối lượng của 0,5 mol chất đó',
  'Tại sao cấu hình electron của Cr lại đặc biệt?',
  'Số electron lớp ngoài cùng của Na', 'Tính nồng độ phần trăm của dung dịch NaCl 0,5M',
  'Hòa tan 25 g CuSO4.5H2O vào nước được 500 mL dung dịch. Tính nồng độ mol', // hydrate
  'Khối lượng mol của C6H12O6 và C2H5OH'
]
await test('engine declines anything outside its exact templates', () => {
  for (const question of NOT_SOLVED) assert.equal(engineAnswer(question), null, question)
})

await test('an engine answer makes no model call, takes no budget unit and charges 0 tokens', async () => {
  const env = makeEnv()
  const { status, payload } = await ask(env, 'Viết cấu hình electron của Neon')
  assert.equal(status, 200)
  assert.equal(calls.length, 0)
  assert.equal(payload.meta.route, 'engine')
  assert.equal(payload.usage.totalTokens, 0)
  assert.equal(env.CHEMAI_BUDGET.used('budget:tokens'), 0)
  assert.equal(env.CHEMAI_BUDGET.used('budget:chat') - env.CHEMAI_BUDGET.used('budget:chat-'), 0)
  assert.ok(logs.some(line => line.includes('"route":"engine"')))
})

await test('the safety gate still comes before the engine', async () => {
  const { payload } = await ask(makeEnv(), 'Cách điều chế thuốc nổ TNT tại nhà')
  assert.ok(payload.meta.safetyGate)
  assert.equal(calls.length, 0)
})

// ---------------- routing ----------------

await test('routing: explanations → 20b; multi-step, redox and their follow-ups → 120b', () => {
  const small = ['Liên kết ion là gì?', 'Tại sao kim loại kiềm hoạt động mạnh?', 'Tính pH của dung dịch H2SO4 0,01M', 'Cân bằng phương trình Fe + O2 → Fe3O4', 'So sánh tính acid của HCl và HF']
  const large = [
    'Cho 5,6 g Fe tác dụng với 200 mL dung dịch HCl 1M. Tính thể tích H2 thu được ở đkc.',
    'Hòa tan 10 g hỗn hợp Mg và Fe vào HCl dư thu được 5,6 lít H2. Tính phần trăm khối lượng mỗi kim loại.',
    'Cân bằng phản ứng oxi hóa khử Cu + HNO3 → Cu(NO3)2 + NO + H2O bằng phương pháp thăng bằng electron',
    'Tính hằng số cân bằng Kc khi biết nồng độ các chất'
  ]
  for (const question of small) assert.equal(routeModel(question).model, SMALL_MODEL, question)
  for (const question of large) assert.equal(routeModel(question).model, LARGE_MODEL, question)
  const hard = [{ role: 'user', content: large[0] }, { role: 'assistant', content: 'V = 2,479 L' }]
  assert.equal(routeModel('Giải thích kỹ hơn bước 2', hard).model, LARGE_MODEL, 'follow-up to a 120b problem stays on 120b')
  assert.equal(routeModel('Giải thích kỹ hơn', [{ role: 'user', content: small[0] }, { role: 'assistant', content: '…' }]).model, SMALL_MODEL)
})

await test('history: none for a self-contained question; user turns + last answer for a follow-up', () => {
  const history = [
    { role: 'user', content: 'Cho 200 mL dung dịch HCl 0,1M.' }, { role: 'assistant', content: 'n = 0,02 mol' },
    { role: 'user', content: 'Thêm 100 mL NaOH 0,1M.' }, { role: 'assistant', content: 'NaOH hết, HCl dư 0,01 mol' }
  ]
  assert.deepEqual(conversationHistory(history, 'Liên kết cộng hóa trị phân cực là gì? Cho ví dụ với HCl.'), [])
  for (const followUp of ['Tính pH của dung dịch sau phản ứng', 'Còn nếu dùng KOH thì sao?', 'Giải thích kỹ hơn', 'Vì sao?']) {
    assert.ok(isFollowUp(followUp), followUp)
    assert.deepEqual(conversationHistory(history, followUp), [history[0], history[2], history[3]], followUp)
  }
})

await test('self-contained question: 20b, no history sent; follow-up keeps the data it needs', async () => {
  const env = makeEnv()
  const history = [{ role: 'user', content: 'Liên kết ion là gì?' }, { role: 'assistant', content: 'Liên kết ion là lực hút tĩnh điện giữa các ion trái dấu.' }]
  replies = [reply('Liên kết cộng hóa trị là liên kết tạo bởi cặp electron dùng chung.', { total: 700 })]
  const first = await ask(env, 'Liên kết cộng hóa trị được hình thành như thế nào trong phân tử H2?', history)
  assert.equal(first.status, 200)
  assert.equal(calls[0].model, SMALL_MODEL)
  assert.ok(!calls[0].messages.at(-1).content.includes('LỊCH SỬ'), 'no history for a self-contained question')
  assert.equal(first.payload.meta.route, '20b')
  replies = [reply('Ví dụ: NaCl.', { total: 800 })]
  await ask(env, 'Cho ví dụ khác', history)
  assert.ok(calls[1].messages.at(-1).content.includes('Liên kết ion là lực hút'), 'follow-up keeps the last answer')
})

await test('a clean 20b answer is final: one call, tokens charged exactly', async () => {
  const env = makeEnv()
  replies = [reply('Kim loại kiềm có 1 electron lớp ngoài cùng nên dễ nhường electron.', { total: 650 })]
  const { payload } = await ask(env, 'Tại sao kim loại kiềm hoạt động mạnh?')
  assert.equal(calls.length, 1)
  assert.equal(payload.meta.escalated, false)
  assert.equal(payload.usage.totalTokens, 650)
  assert.equal(payload.usage.charged, 650)
  assert.equal(env.CHEMAI_BUDGET.used('budget:tokens-session:'), 650, 'reservation settled to real usage')
})

await test('20b → 120b once when ChemLab finds a chemistry error; both calls are charged', async () => {
  const env = makeEnv()
  replies = [reply('Cu + 2HCl → CuCl2 + H2', { total: 600 }), reply('Cu không tác dụng với dung dịch HCl.', { total: 1200 })]
  const { payload } = await ask(env, 'Đồng có tác dụng với HCl không?')
  assert.deepEqual(calls.map(call => call.model), [SMALL_MODEL, LARGE_MODEL])
  assert.equal(payload.meta.route, '120b')
  assert.equal(payload.meta.escalated, true)
  assert.equal(payload.answer, 'Cu không tác dụng với dung dịch HCl.')
  assert.equal(payload.usage.totalTokens, 1800)
  assert.deepEqual(payload.usage.calls.map(call => call.totalTokens), [600, 1200])
  assert.equal(env.CHEMAI_BUDGET.used('budget:tokens-session:'), 1800)
  assert.equal(env.CHEMAI_BUDGET.used('budget:chat') - env.CHEMAI_BUDGET.used('budget:chat-'), 2, 'one budget unit per upstream call')
  assert.ok(logs.some(line => line.includes('"escalationReason":"guard"')))
})

await test('20b cut off or invalid JSON → 120b; the 120b answer is never escalated again', async () => {
  for (const broken of [reply('', { finish: 'length', total: 1100 }), reply(null, { raw: '{"answer": "x', total: 500 })]) {
    const env = makeEnv()
    calls.length = 0
    replies = [broken, reply('Cu + 2HCl → CuCl2 + H2', { total: 900 })]
    const { status, payload } = await ask(env, 'Đồng có tác dụng với HCl không?')
    assert.deepEqual(calls.map(call => call.model), [SMALL_MODEL, LARGE_MODEL], 'no third call')
    assert.equal(status, 503, 'a 120b answer with a wrong reaction is withheld, not re-asked')
    assert.equal(payload.code, 'AI_UNVERIFIED')
    assert.ok(!JSON.stringify(payload).includes('CuCl2'))
  }
})

// Real answers from the stage 1 live benchmark (P1, 2026-11-15): both used 22,4 L/mol at đkc.
const P1 = 'Cho 5,6 g Fe tác dụng hết với dung dịch HCl dư. Tính thể tích khí H2 thu được ở đkc.'
const P1_OFF = '1. Phản ứng: Fe + 2 HCl → FeCl₂ + H₂.\n2. n(Fe) = 5,6 g ÷ 55,845 g·mol⁻¹ = 0,1003 mol.\n3. n(H₂) = n(Fe) = 0,1003 mol → V = 0,1003 × 22,4 L·mol⁻¹ = 2,25 L.'
const P1_HYBRID = '1. Phản ứng: Fe + 2 HCl → FeCl₂ + H₂\n2. Số mol Fe: n = m/M = 5,6 g ÷ 55,845 g·mol⁻¹ = 0,100 mol\n3. Vì tỉ lệ Fe:H₂ = 1:1, n(H₂) = 0,100 mol\n4. Thể tích H₂ ở đkc (0 °C, 1 atm): V = n·22,4 L·mol⁻¹ = 0,100 mol × 22,4 L·mol⁻¹ = 2,24 L'

await test('guard: molar volume is checked against the question, wherever the answer breaks lines', () => {
  const ids = (answer, question) => answerGuard(answer, { question }).findings.map(item => item.id)
  assert.ok(ids(P1_OFF, P1).includes('formula:molar-volume'), 'P1 off')
  assert.ok(ids(P1_HYBRID, P1).includes('formula:molar-volume'), 'P1 hybrid')
  const H2 = 'Tính thể tích 0,5 mol H2 ở đktc'
  const flagged = [
    [P1, 'n(H2) = 0,1 mol\nV = 0,1\n× 22.4 = 2,24 L'], [P1, 'V = 22,4 L/mol × 0,1 mol = 2,24 L'], [P1, 'V = n·22,4 = 2,24 L'],
    [H2, 'V = 0,5 × 24,79 = 12,395 L'], ['Tính số mol của 4,958 L H2 ở đktc', 'n = 4,958/24,79 = 0,2 mol'],
    ['Tính thể tích 1 mol khí ở 27 °C, 1 atm', 'V = 1 × 22,4 = 22,4 L']
  ]
  const clean = [
    [P1, 'V = 0,1 × 24,79 = 2,479 L'], [P1, 'V = 0,1 × 24,79 = 2,479 L. (Nếu ở đktc thì V = 0,1 × 22,4 = 2,24 L.)'],
    [P1, 'Lưu ý 22,4 L/mol chỉ đúng ở 0 °C. V = 0,1 × 24,79 = 2,479 L'], [H2, 'V = 0,5 × 22,4 = 11,2 L'],
    ['Tính thể tích 2 mol khí ở 0 °C và 1 atm', 'V = 2 × 22,4 = 44,8 L'], ['Tính thể tích 1 mol khí ở 25 °C, 1 bar', 'V = 1 × 24,79 L'],
    ['Tính thể tích 1 mol khí ở 27 °C, 1 atm', 'V = nRT/P = 0,082 × 300 = 24,6 L'],
    ['Tính thể tích của 0,5 mol khí O2', 'Ở đktc: V = 0,5 × 22,4 = 11,2 L'], ['So sánh thể tích 1 mol khí ở đkc và đktc', 'đkc: 1 × 24,79; đktc: 1 × 22,4']
  ]
  for (const [question, answer] of flagged) assert.ok(ids(answer, question).includes('formula:molar-volume'), answer)
  for (const [question, answer] of clean) assert.ok(!ids(answer, question).includes('formula:molar-volume'), answer)
  assert.equal(questionMolarVolume('Tính thể tích 1 mol khí ở 27 °C, 1 atm').value.toFixed(2), '24.63')
  assert.equal(questionMolarVolume('Cho KOH ở đkc').value, 24.79, 'the K of KOH is not kelvin')
})

await test('P1: the wrong 2,24 L answer is never shown, on either path; tokens are still charged', async () => {
  for (const [mode, answer, models] of [['off', P1_OFF, [LARGE_MODEL]], ['hybrid', P1_HYBRID, [LARGE_MODEL]]]) {
    const env = makeEnv({ CHEMAI_ROUTING: mode })
    calls.length = 0
    replies = [reply(answer, { total: 1600 })]
    const { status, payload } = await ask(env, P1)
    assert.deepEqual(calls.map(call => call.model), models, mode)
    assert.equal(status, 503, mode)
    assert.equal(payload.code, 'AI_UNVERIFIED')
    assert.ok(!/2[,.]2[45] L/.test(JSON.stringify(payload)), 'no wrong number')
    assert.match(payload.message, /24,79 L\/mol/)
    assert.equal(payload.usage.totalTokens, 1600)
    assert.equal(env.CHEMAI_BUDGET.used('budget:tokens-session:'), 1600)
  }
})

// Real answers from the stage 2 live benchmark (X5, 2026-11-15): both models claimed Fe + Cl₂ → FeCl₂.
const X5 = 'Fe tác dụng với Cl2 tạo ra FeCl2 đúng không?'
const X5_OFF = 'Đúng. Phản ứng: Fe + Cl₂ → FeCl₂ (cân bằng). Trong điều kiện Cl₂ dư, Fe có thể bị oxy hoá tới FeCl₃.'
const X5_HYBRID = 'Phản ứng: Fe + Cl₂ → FeCl₂. Thực tế, Fe bị oxi hóa thành Fe²⁺ và Cl₂ bị khử thành 2Cl⁻. Phản ứng xảy ra khi Fe tiếp xúc với Cl₂ trong điều kiện nhiệt độ phù hợp.'
const VALID_IRON = 'Không. Fe tác dụng với Cl₂ tạo FeCl₃: 2Fe + 3Cl₂ → 2FeCl₃. FeCl₂ tạo ra khi Fe + 2HCl → FeCl₂ + H₂ hoặc Fe + 2FeCl₃ → 3FeCl₂.'

await test('X5: Fe + Cl₂ → FeCl₂ is caught; the right equations are not', () => {
  const ids = answer => answerGuard(answer, { question: X5 }).findings.map(item => item.id)
  for (const wrong of [X5_OFF, X5_HYBRID, '2Fe + 2Cl2 → 2FeCl2']) assert.ok(ids(wrong).includes('reaction:fe-cl2'), wrong)
  // Valid iron equations raise no error at all, in any notation.
  const errors = answer => answerGuard(answer, { question: X5 }).findings.filter(item => item.severity === 'error').map(item => item.id)
  for (const right of ['Không. 2Fe + 3Cl₂ → 2FeCl₃', '2Fe + 3Cl2 → 2FeCl3', 'Fe + 2HCl → FeCl₂ + H₂', 'Fe + 2HCl -> FeCl2 + H2', 'Fe + 2FeCl₃ → 3FeCl₂', VALID_IRON]) assert.deepEqual(errors(right), [], right)
})

// Real answers from the stage 3 live benchmark (X5): right product, unbalanced skeleton equation.
const X5_S3_OFF = 'Không, Fe phản ứng với Cl₂ cho ra FeCl₃, không phải FeCl₂:\nFe + Cl₂ → FeCl₃.'
const X5_S3_HYBRID = 'Phản ứng Fe + Cl₂ → FeCl₃, không phải FeCl₂. Fe (sắt) có thể oxi hóa tới +3 khi phản ứng với khí clo, tạo muối sắt(III).'

await test('X5 replay (stage 3): the unbalanced Fe + Cl₂ → FeCl₃ is shown with the balanced equation above it', async () => {
  // off: one call, shown with the note. hybrid: the 20b draft is re-checked once by 120b.
  for (const [mode, answers, models] of [['off', [X5_S3_OFF], [LARGE_MODEL]], ['hybrid', [X5_S3_HYBRID, X5_S3_OFF], [SMALL_MODEL, LARGE_MODEL]], ['hybrid', [X5_S3_HYBRID, VALID_IRON], [SMALL_MODEL, LARGE_MODEL]]]) {
    calls.length = 0
    replies = answers.map(answer => reply(answer, { total: 1500 }))
    const { status, payload } = await ask(makeEnv({ CHEMAI_ROUTING: mode }), X5)
    assert.deepEqual(calls.map(call => call.model), models, mode)
    assert.equal(status, 200, mode)
    if (answers.at(-1) === VALID_IRON) assert.equal(payload.answer, VALID_IRON)
    else assert.match(payload.answer, /^\*\*ChemLab đối chiếu tự động[\s\S]*2Fe \+ 3Cl₂ → 2FeCl₃[\s\S]*Fe \+ Cl₂ → FeCl₃/)
  }
})

// Real drafts from the 6.7.0 RC live run (X5, 2026-11-15). 120b was withheld live; 20b's prose claim was shown.
const X5_RC_OFF = 'Đúng, sắt phản ứng với clo tạo FeCl₂ theo phương trình: Fe + Cl₂ → FeCl₂. Tuy nhiên nếu cung cấp đủ Cl₂ hoặc môi trường oxi hoá, có thể tạo FeCl₃.'
const X5_RC_HYBRID = 'Không, Fe + Cl₂ tạo FeCl₃ (Fe trioxide chloride). FeCl₂ (Fe(II) chloride) được tạo khi Fe phản ứng với Cl₂ trong điều kiện thiếu oxy, nhưng thường là FeCl₃.'

await test('X5 replay (RC): a prose claim that Fe and Cl₂ give FeCl₂ is caught; negations and other iron chemistry are not', async () => {
  const errors = answer => answerGuard(answer, { question: X5 }).findings.filter(item => item.severity === 'error').map(item => item.id)
  for (const wrong of [X5_RC_OFF, X5_RC_HYBRID, 'Sắt tác dụng với khí clo tạo ra FeCl₂.', 'Fe phản ứng với Cl₂ thu được muối FeCl₂ màu lục nhạt.']) assert.ok(errors(wrong).includes('reaction:fe-cl2'), wrong)
  for (const right of ['Không. Fe tác dụng với Cl₂ tạo FeCl₃, không tạo FeCl₂.', 'Fe tác dụng với Cl₂ tạo ra FeCl₂ đúng không? Không, sản phẩm là FeCl₃.', 'FeCl₂ được tạo khi Fe dư tác dụng với FeCl₃.', 'FeCl₂ tạo ra khi Fe tác dụng với dung dịch HCl.', 'FeCl₂ tác dụng với Cl₂ tạo FeCl₃.', 'Sắt cháy trong khí clo tạo FeCl₃; còn FeCl₂ thu được từ Fe và HCl.', 'Phát biểu "Fe + Cl₂ tạo FeCl₂" là sai.']) assert.deepEqual(errors(right), [], right)
  // hybrid: the 20b draft is re-checked once by 120b; a wrong 120b answer is withheld, a right one is shown.
  for (const [second, status] of [[X5_RC_OFF, 503], [VALID_IRON, 200]]) {
    calls.length = 0
    replies = [reply(X5_RC_HYBRID, { total: 1381 }), reply(second, { total: 1588 })]
    const { status: got, payload } = await ask(makeEnv(), X5)
    assert.deepEqual(calls.map(call => call.model), [SMALL_MODEL, LARGE_MODEL])
    assert.equal(got, status)
    assert.ok(!JSON.stringify(payload).includes('thiếu oxy'), 'the 20b claim never reaches the learner')
    if (status === 503) assert.match(payload.message, /2Fe \+ 3Cl₂ → 2FeCl₃/)
    else assert.equal(payload.answer, VALID_IRON)
    assert.equal(payload.usage.totalTokens, 2969, 'both calls are charged')
  }
})

await test('X5: a correct answer with all three valid iron equations is shown untouched', async () => {
  for (const mode of ['off', 'hybrid']) {
    calls.length = 0
    replies = [reply(VALID_IRON, { total: 1200 })]
    const { status, payload } = await ask(makeEnv({ CHEMAI_ROUTING: mode }), X5)
    assert.equal(status, 200, mode)
    assert.equal(calls.length, 1, 'no escalation')
    assert.equal(payload.answer, VALID_IRON)
    assert.equal(payload.meta.corrections, 0)
  }
})

await test('X5: the wrong FeCl₂ claim is never shown; 20b escalates once, then it is withheld', async () => {
  for (const [mode, answers, models] of [['off', [X5_OFF], [LARGE_MODEL]], ['hybrid', [X5_HYBRID, X5_OFF], [SMALL_MODEL, LARGE_MODEL]]]) {
    calls.length = 0
    replies = answers.map(answer => reply(answer, { total: 1500 }))
    const { status, payload } = await ask(makeEnv({ CHEMAI_ROUTING: mode }), X5)
    assert.deepEqual(calls.map(call => call.model), models, mode)
    assert.equal(status, 503, mode)
    assert.equal(payload.code, 'AI_UNVERIFIED')
    assert.match(payload.message, /2Fe \+ 3Cl₂ → 2FeCl₃/)
    assert.ok(!/Đúng\./.test(JSON.stringify(payload)), 'no wrong claim')
  }
})

await test('a literal \\n from double-escaped JSON becomes a line break; LaTeX \\neq stays', async () => {
  replies = [reply('M = 98 g/mol;\\nm = 0,5 × 98 = 49 g. $a \\neq b$', { total: 900 })]
  const { status, payload } = await ask(makeEnv({ CHEMAI_ROUTING: 'off' }), 'Giải thích ngắn khối lượng mol của H2SO4 là gì')
  assert.equal(status, 200)
  assert.ok(payload.answer.includes('mol;\nm ='), payload.answer)
  assert.ok(payload.answer.includes('\\neq'))
})

await test('a wrong model result the engine can compute is replaced by the engine answer (6.6.4 path)', async () => {
  const env = makeEnv({ CHEMAI_ROUTING: 'off' })
  replies = [reply('V = 0,25 × 22,4 = 5,6 L', { total: 1000 })]
  const { status, payload } = await ask(env, 'Tính thể tích của 0,25 mol khí CO2 ở đkc')
  assert.equal(status, 200)
  assert.equal(payload.meta.route, 'engine')
  assert.equal(payload.meta.replaced, '120b')
  assert.match(payload.answer, /6,1975 L/)
  assert.ok(!payload.answer.includes('5,6 L'))
  assert.equal(payload.usage.totalTokens, 1000, 'the model call is still charged')
})

await test('a descriptive error (colour) keeps the 6.6.4 behaviour: answer shown with the correction first', async () => {
  replies = [reply('Cu(OH)2 là kết tủa màu trắng.', { total: 900 })]
  const { status, payload } = await ask(makeEnv({ CHEMAI_ROUTING: 'off' }), 'Cho NaOH vào dung dịch CuSO4 thấy hiện tượng gì?')
  assert.equal(status, 200)
  assert.match(payload.answer, /ChemLab đối chiếu tự động/)
})

await test('no tokens or calls left for 120b: the 20b answer marked wrong is withheld, its tokens still charged', async () => {
  for (const extra of [{ CHEMAI_TOKENS_PER_CLIENT_DAY: '3000' }, { CHEMAI_DAILY_LIMIT_CHAT: '1' }]) {
    const env = makeEnv(extra)
    calls.length = 0
    replies = [reply('Cu + 2HCl → CuCl2 + H2', { total: 600 })]
    const { status, payload } = await ask(env, 'Đồng có tác dụng với HCl không?')
    assert.equal(status, 503, JSON.stringify(extra))
    assert.equal(payload.code, 'AI_UNVERIFIED')
    assert.equal(payload.answer, undefined, 'the wrong answer never reaches the learner')
    assert.ok(!JSON.stringify(payload).includes('CuCl2'))
    assert.equal(calls.length, 1)
    assert.equal(payload.usage.totalTokens, 600)
    assert.equal(env.CHEMAI_BUDGET.used('budget:tokens-session:'), 600, 'the 20b call is charged exactly')
    assert.ok(logs.some(line => line.includes('"code":"AI_UNVERIFIED"') && line.includes('"withheld"')))
  }
})

await test('a clean 20b answer is shown even when no escalation would be possible', async () => {
  replies = [reply('Kim loại kiềm có 1 electron lớp ngoài cùng.', { total: 500 })]
  const { status } = await ask(makeEnv({ CHEMAI_DAILY_LIMIT_CHAT: '1' }), 'Tại sao kim loại kiềm hoạt động mạnh?')
  assert.equal(status, 200)
})

await test('multi-step problem goes straight to 120b with one call', async () => {
  replies = [reply('V(H₂) = 2,479 L', { total: 1500 })]
  const { payload } = await ask(makeEnv(), 'Cho 5,6 g Fe tác dụng với 200 mL dung dịch HCl 1M. Tính thể tích H2 thu được ở đkc.')
  assert.deepEqual(calls.map(call => call.model), [LARGE_MODEL])
  assert.equal(payload.meta.route, '120b')
})

await test('CHEMAI_ROUTING=off is the 6.6.4 path: no engine, one model, history as received', async () => {
  const env = makeEnv({ CHEMAI_ROUTING: 'off' })
  replies = [reply('Cấu hình: 1s² 2s² 2p⁶', { total: 1400 })]
  const history = [{ role: 'user', content: 'Liên kết ion là gì?' }, { role: 'assistant', content: 'Lực hút tĩnh điện.' }]
  const { payload } = await ask(env, 'Viết cấu hình electron của Neon', history)
  assert.deepEqual(calls.map(call => call.model), [LARGE_MODEL])
  assert.ok(calls[0].messages.at(-1).content.includes('Lực hút tĩnh điện.'))
  assert.equal(payload.meta.route, '120b')
})

const leaked = logs.filter(line => line.includes('gsk_test0nly'))
assert.equal(leaked.length, 0, 'the key never reaches a log line')
console.info(`PASS — ${passed} ChemAI 6.7 routing checks passed.`)
