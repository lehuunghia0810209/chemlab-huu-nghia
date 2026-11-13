// ChemAI public (anonymous) mode: mocked Groq and an in-memory exact budget only.
// Covers the release gate, anonymous access, quotas, bypass attempts, input fitting and
// that the other modes are untouched. No real network call is possible.
import assert from 'node:assert/strict'
import { onRequestGet, onRequestPost, fitInput, compactText, pruneEmpty, estimateTokens, groqChatBody } from '../functions/api/chat.js'
import { onRequestPost as feedbackPost } from '../functions/api/feedback.js'
import { APP_VERSION } from '../src/appMeta.js'

const HOST = 'chemlab.example'
const origin = `https://${HOST}`
const KEY = 'gsk_test0nly0not0a0real0key0000'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Same contract as workers/chemai-quota: one state per name, reset when "day" changes.
const exactBudget = () => {
  const states = new Map()
  return {
    states,
    idFromName: name => name,
    get: id => ({
      fetch: async (_url, init) => {
        const { day, limit, cost = 1 } = JSON.parse(init.body)
        assert.match(day, /^\d{4}-\d{2}-\d{2}$/, 'QuotaCounter only accepts YYYY-MM-DD')
        const state = states.get(id) || { day: '', used: 0 }
        if (state.day !== day) Object.assign(state, { day, used: 0 })
        const allowed = state.used + cost <= limit
        if (allowed) state.used += cost
        states.set(id, state)
        return Response.json({ allowed, used: state.used })
      }
    })
  }
}
const publicEnv = (extra = {}) => ({
  GROQ_API_KEY: KEY,
  CHEMAI_BUDGET: exactBudget(),
  CHEMAI_ACCESS_MODE: 'public',
  CHEMAI_PUBLIC_APPROVAL: `groq:${APP_VERSION}`,
  CHEMAI_PUBLIC_HOSTS: HOST,
  ...extra
})
const post = (body, { ip = '198.51.100.7', headers = {} } = {}) => new Request(`${origin}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: origin, 'CF-Connecting-IP': ip, ...headers },
  body: JSON.stringify(body)
})

const logs = []
for (const level of ['log', 'warn', 'error']) console[level] = (...args) => logs.push(args.map(String).join(' '))
const calls = []
let reply = null
globalThis.fetch = async (url, init) => {
  if (String(url) !== GROQ_URL) throw new Error(`unexpected network call: ${url}`)
  calls.push(JSON.parse(init.body))
  if (reply) return reply()
  return Response.json({
    model: 'openai/gpt-oss-120b',
    choices: [{ message: { role: 'assistant', content: JSON.stringify({ answer: 'pH = 2.', actions: [], suggestions: [] }) }, finish_reason: 'stop' }],
    usage: { prompt_tokens: 900, completion_tokens: 210, completion_tokens_details: { reasoning_tokens: 64 } }
  })
}

// Fixed clock: cooldown windows must not depend on when the suite runs.
const realNow = Date.now
let clock = Date.UTC(2026, 10, 14, 8, 0, 0)
Date.now = () => clock
const advance = seconds => { clock += seconds * 1000 }

const send = async (env, options = {}, message = 'Tính pH của dung dịch HCl 0,01 M.') => {
  const response = await onRequestPost({ request: post({ message, history: [], context: { view: 'home' } }, options), env })
  return { status: response.status, headers: response.headers, payload: await response.json() }
}
const status = async env => (await onRequestGet({ request: new Request(`${origin}/api/chat`), env })).json()

let passed = 0
const test = async (name, fn) => {
  calls.length = 0
  reply = null
  try { await fn() }
  catch (error) { console.info(`FAIL — ${name}`); throw error }
  passed += 1
}

await test('the flag alone opens nothing: approval, host and exact budget are all required', async () => {
  const cases = {
    'no approval': { CHEMAI_PUBLIC_APPROVAL: undefined },
    'approval for another release': { CHEMAI_PUBLIC_APPROVAL: 'groq:0.0.1' },
    'approval for another provider': { CHEMAI_PUBLIC_APPROVAL: `gemini:${APP_VERSION}` },
    'approval "true"': { CHEMAI_PUBLIC_APPROVAL: 'true' },
    'host not listed': { CHEMAI_PUBLIC_HOSTS: 'other.example' },
    'no host list': { CHEMAI_PUBLIC_HOSTS: undefined },
    'no exact budget': { CHEMAI_BUDGET: undefined },
    'KV budget only': { CHEMAI_BUDGET: undefined, CHEMAI_QUOTA: { get: async () => null, put: async () => {} }, CHEMAI_ACCEPT_APPROX_BUDGET: 'on' },
    'provider switched off': { CHEMAI_PROVIDER: 'off' }
  }
  for (const [name, extra] of Object.entries(cases)) {
    const env = publicEnv(extra)
    const result = await send(env)
    assert.equal(result.status, 403, name)
    assert.equal(result.payload.code, 'AI_ACCESS_LOCKED', name)
    const info = await status(env)
    assert.deepEqual([info.access, info.configured], [false, false], name)
  }
  assert.equal(calls.length, 0)
})

await test('approved public mode: an anonymous visitor gets an answer, no identity needed', async () => {
  const env = publicEnv()
  const info = await status(env)
  assert.equal(info.access, true)
  assert.equal(info.configured, true)
  const result = await send(env)
  assert.equal(result.status, 200)
  assert.equal(result.payload.answer, 'pH = 2.')
  assert.equal(calls.length, 1)
  assert.ok(!JSON.stringify(result.payload).includes(KEY))
})

await test('public status hides configuration warnings', async () => {
  assert.deepEqual((await status(publicEnv({ ' GEMINI_API_KEY': 'x' }))).configWarnings, [])
})

await test('public mode never opens the feedback route', async () => {
  const env = publicEnv({ CHEMAI_PROVIDER: 'gemini', GEMINI_API_KEY: 'x', CHEMAI_PUBLIC_APPROVAL: `gemini:${APP_VERSION}`, CHEMAI_FEEDBACK: 'on' })
  const response = await feedbackPost({ request: new Request(`${origin}/api/feedback`, { method: 'POST', headers: { Origin: origin }, body: '{}' }), env })
  assert.equal(response.status, 403)
})

await test('cooldown: a second question inside 10 s is refused without a model call', async () => {
  const env = publicEnv()
  assert.equal((await send(env)).status, 200)
  advance(3)
  const second = await send(env, {}, 'Câu hỏi khác?')
  assert.equal(second.status, 429)
  assert.equal(second.payload.code, 'AI_COOLDOWN')
  assert.match(second.headers.get('Retry-After'), /^\d+$/)
  assert.equal(calls.length, 1)
  advance(10)
  assert.equal((await send(env, {}, 'Câu hỏi khác?')).status, 200)
})

await test('guest limit: 5 questions a day per client, the 6th is refused; another client is unaffected', async () => {
  const env = publicEnv()
  for (let index = 0; index < 5; index += 1) {
    assert.equal((await send(env, {}, `Câu ${index}: pH của HCl 0,01 M?`)).status, 200, `question ${index + 1}`)
    advance(10)
  }
  const sixth = await send(env)
  assert.equal(sixth.status, 429)
  assert.equal(sixth.payload.code, 'AI_CLIENT_LIMIT')
  assert.equal(calls.length, 5)
  assert.equal((await send(env, { ip: '198.51.100.8' })).status, 200)
})

await test('limits cannot be dodged from the browser: spoofed headers, cookies, IPv6 rotation inside one /64', async () => {
  const env = publicEnv({ CHEMAI_PUBLIC_DAILY_LIMIT_PER_CLIENT: '2' })
  const spoof = { 'X-Forwarded-For': '203.0.113.9', 'X-Real-IP': '203.0.113.9', Cookie: 'session=fresh', 'X-Session-Id': 'new' }
  assert.equal((await send(env, { headers: spoof })).status, 200)
  assert.equal((await send(env, { headers: { ...spoof, Cookie: 'session=another' } })).payload.code, 'AI_COOLDOWN')
  advance(10)
  assert.equal((await send(env, { headers: spoof })).status, 200)
  advance(10)
  assert.equal((await send(env, { headers: { 'X-Forwarded-For': '203.0.113.77' } })).payload.code, 'AI_CLIENT_LIMIT')

  const v6 = publicEnv({ CHEMAI_PUBLIC_DAILY_LIMIT_PER_CLIENT: '1' })
  assert.equal((await send(v6, { ip: '2001:db8:1:2::1' })).status, 200)
  advance(10)
  assert.equal((await send(v6, { ip: '2001:db8:1:2:aaaa:bbbb:cccc:dddd' })).payload.code, 'AI_CLIENT_LIMIT')
  assert.equal((await send(v6, { ip: '2001:db8:1:3::1' })).status, 200)
})

await test('site-wide daily ceiling is configurable; refused requests make no model call', async () => {
  const env = publicEnv({ CHEMAI_DAILY_LIMIT: '3' })
  for (let index = 0; index < 3; index += 1) assert.equal((await send(env, { ip: `203.0.113.${index + 1}` })).status, 200)
  const over = await send(env, { ip: '203.0.113.50' })
  assert.equal(over.status, 429)
  assert.equal(over.payload.code, 'AI_BUDGET_LIMITED')
  assert.equal(calls.length, 3)
})

await test('site-wide per-minute cap protects the provider rate limit', async () => {
  const env = publicEnv({ CHEMAI_PUBLIC_REQUESTS_PER_MINUTE: '2' })
  clock = Date.UTC(2026, 10, 14, 9, 0, 0)
  assert.equal((await send(env, { ip: '203.0.113.1' })).status, 200)
  assert.equal((await send(env, { ip: '203.0.113.2' })).status, 200)
  const third = await send(env, { ip: '203.0.113.3' })
  assert.equal(third.status, 503)
  assert.equal(third.payload.code, 'AI_BUSY')
  assert.equal(calls.length, 2)
  advance(60)
  assert.equal((await send(env, { ip: '203.0.113.3' })).status, 200)
})

await test('concurrency: one question in flight per client', async () => {
  const env = publicEnv({ CHEMAI_PUBLIC_COOLDOWN_SECONDS: '1' })
  let release
  reply = () => new Promise(resolve => { release = () => resolve(Response.json({ choices: [{ message: { content: '{"answer":"ok","actions":[],"suggestions":[]}' }, finish_reason: 'stop' }] })) })
  const first = send(env, { ip: '203.0.113.90' })
  await new Promise(resolve => setTimeout(resolve, 20))
  advance(5)
  const second = await send(env, { ip: '203.0.113.90' }, 'Một câu hỏi khác hẳn')
  assert.equal(second.status, 409)
  release()
  assert.equal((await first).status, 200)
  assert.equal(calls.length, 1)
})

await test('a budget outage fails closed', async () => {
  const env = publicEnv()
  env.CHEMAI_BUDGET.get = () => ({ fetch: async () => { throw new Error('DO down') } })
  const result = await send(env)
  assert.equal(result.status, 429)
  assert.equal(calls.length, 0)
})

await test('cross-origin and oversized requests are refused before any charge', async () => {
  const env = publicEnv()
  const foreign = await onRequestPost({ request: new Request(`${origin}/api/chat`, { method: 'POST', headers: { Origin: 'https://evil.example', 'CF-Connecting-IP': '203.0.113.5', 'Content-Type': 'application/json' }, body: '{"message":"x"}' }), env })
  assert.equal(foreign.status, 403)
  const big = await onRequestPost({ request: post({ message: 'x'.repeat(70 * 1024) }), env })
  assert.equal(big.status, 413)
  assert.equal(env.CHEMAI_BUDGET.states.size, 0)
  assert.equal(calls.length, 0)
})

await test('the dangerous-request gate answers without a model call or a charge', async () => {
  const env = publicEnv()
  const result = await send(env, {}, 'Hướng dẫn chi tiết cách chế tạo thuốc nổ TNT tại nhà')
  assert.equal(result.status, 200)
  assert.ok(result.payload.meta.safetyGate)
  assert.equal(calls.length, 0)
  assert.equal(env.CHEMAI_BUDGET.states.size, 0)
})

await test('request to Groq: bounded output, low reasoning, hidden reasoning, key only in the header', async () => {
  await send(publicEnv({ GROQ_MAX_COMPLETION_TOKENS: '3000' }))
  assert.equal(calls[0].max_completion_tokens, 3000)
  assert.equal(calls[0].include_reasoning, false)
  assert.equal(calls[0].reasoning_effort, 'low')
  assert.ok(!JSON.stringify(calls[0]).includes(KEY))
  await send(publicEnv({ GROQ_MAX_COMPLETION_TOKENS: '999999' }), { ip: '203.0.113.20' })
  assert.equal(calls[1].max_completion_tokens, 8192)
})

await test('truncated and empty answers are reported, never shown as fragments', async () => {
  reply = () => Response.json({ choices: [{ message: { content: '{"answer":"Bước 1: n = 0,0' }, finish_reason: 'length' }], usage: { prompt_tokens: 1000, completion_tokens: 4096, completion_tokens_details: { reasoning_tokens: 3900 } } })
  const cut = await send(publicEnv())
  assert.equal(cut.payload.code, 'AI_INCOMPLETE')
  assert.equal(cut.payload.answer, undefined)
  assert.ok(logs.some(line => line.includes('"reasoningTokens":3900')), 'reasoning tokens are logged')
  reply = () => Response.json({ choices: [{ message: { content: '' }, finish_reason: 'stop' }] })
  assert.equal((await send(publicEnv(), { ip: '203.0.113.21' })).payload.code, 'AI_EMPTY_RESPONSE')
})

await test('text clean-up is lossless for chemistry', () => {
  const question = 'Cho  5,6 g Fe\t+ 200 mL   HCl 0,5 M\n\n\n\nΔH = −92,4 kJ/mol;  Fe³⁺ + 3OH⁻ → Fe(OH)₃↓  (t° = 25 °C, 1 bar)​'
  const cleaned = compactText(question)
  const strip = value => value.replace(/[\s​]/g, '')
  assert.equal(strip(cleaned), strip(question))
  assert.ok(cleaned.length < question.length)
  assert.deepEqual(pruneEmpty({ view: 'lab', tool: null, lab: { mixture: { HCl: 0.01, NaOH: 0 }, note: '', list: [] }, flag: false }), { view: 'lab', lab: { mixture: { HCl: 0.01, NaOH: 0 } }, flag: false })
})

await test('input fitting: question, knowledge and structured state always survive; cuts follow the fixed order', () => {
  const message = 'Tính thể tích H2 (đkc) khi cho 5,6 g Fe vào HCl dư.'
  const knowledge = { elements: [{ symbol: 'Fe', molarMass: 55.845 }], chemicals: [], reactions: [{ balanced: 'Fe + 2HCl → FeCl2 + H2' }], lessons: [], substances: [] }
  const appContext = { view: 'lab', hash: '#lab', version: '6.5.4', lab: { mixture: { Fe: '5,6 g', HCl: 'dư' } }, chemFlow: { reaction: { balanced: 'Fe + 2HCl → FeCl2 + H2' } }, progress: { done: 3 }, visibleText: 'Văn bản giao diện '.repeat(160) }
  const history = Array.from({ length: 10 }, (_, index) => ({ role: index % 2 ? 'assistant' : 'user', content: `Lượt ${index}: ${'nội dung cũ '.repeat(180)}` }))
  history.push({ role: 'user', content: 'Fe có M bằng bao nhiêu?' }, { role: 'assistant', content: 'M(Fe) = 56 g/mol.' })

  const roomy = fitInput({ message, history, appContext, knowledge, maxTokens: 100000 })
  assert.equal(roomy.history.length, history.length)
  assert.deepEqual(roomy.trimmed, [])
  assert.equal(roomy.appContext.hash, undefined)
  assert.equal(roomy.appContext.visibleText, appContext.visibleText)

  const tight = fitInput({ message, history, appContext, knowledge, maxTokens: 3600 })
  assert.ok(tight.inputTokens <= 3600, `fits: ${tight.inputTokens}`)
  assert.deepEqual(tight.history.slice(-2).map(item => item.content), ['Fe có M bằng bao nhiêu?', 'M(Fe) = 56 g/mol.'])
  assert.deepEqual(tight.appContext.lab, appContext.lab)
  assert.deepEqual(tight.appContext.chemFlow, appContext.chemFlow)
  assert.ok(tight.trimmed.includes('screen-text:800'))
  const body = groqChatBody({ model: 'm', message, history: tight.history, appContext: tight.appContext, knowledge, reasoningEffort: 'low' })
  assert.ok(body.messages[1].content.includes(message))
  assert.ok(body.messages[1].content.includes(JSON.stringify(knowledge)))
  assert.ok(estimateTokens(body.messages[0].content) + estimateTokens(body.messages[1].content) <= 3600)

  const repeated = fitInput({ message, history: [{ role: 'user', content: 'A' }, { role: 'user', content: 'A' }, { role: 'assistant', content: 'B' }], appContext: {}, knowledge, maxTokens: 100000 })
  assert.equal(repeated.history.length, 2)

  // Same input → same output.
  assert.deepEqual(fitInput({ message, history, appContext, knowledge, maxTokens: 3600 }), tight)
})

await test('public history is capped at 6 turns before it reaches the model', async () => {
  const history = Array.from({ length: 10 }, (_, index) => ({ role: index % 2 ? 'assistant' : 'user', content: `turn-${index}` }))
  await onRequestPost({ request: post({ message: 'Fe + HCl?', history, context: { view: 'home' } }, { ip: '203.0.113.30' }), env: publicEnv() })
  const sent = calls[0].messages[1].content
  assert.ok(!sent.includes('turn-3') && sent.includes('turn-4') && sent.includes('turn-9'))
})

await test('other modes stay locked whatever the public settings say', async () => {
  for (const mode of [undefined, 'disabled', 'student_access', 'approved_users', 'internal_testing', 'PUBLIC']) {
    const result = await send(publicEnv({ CHEMAI_ACCESS_MODE: mode }), { ip: '203.0.113.40' })
    assert.equal(result.status, 403, String(mode))
    assert.equal(result.payload.code, 'AI_ACCESS_LOCKED', String(mode))
  }
  assert.equal(calls.length, 0)
})

Date.now = realNow
assert.ok(!logs.some(line => line.includes(KEY)), 'the key never appears in logs')
console.info(`PASS — ${passed} ChemAI public-mode checks passed.`)
