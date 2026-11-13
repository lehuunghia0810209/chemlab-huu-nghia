// ChemAI public (anonymous) mode and token budgets: mocked Groq and an in-memory exact
// counter only. Covers the release gate, anonymous access, token reservation and
// reconciliation, bypass attempts, input fitting and that the other modes are untouched.
// No real network call is possible.
import assert from 'node:assert/strict'
import { onRequestGet, onRequestPost, fitInput, compactText, pruneEmpty, estimateTokens, groqChatBody, groqRules, questionComplexity, focusContext, slimKnowledge } from '../functions/api/chat.js'
import { onRequestPost as feedbackPost } from '../functions/api/feedback.js'
import { APP_VERSION } from '../src/appMeta.js'

const HOST = 'chemlab.example'
const origin = `https://${HOST}`
const KEY = 'gsk_test0nly0not0a0real0key0000'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Same contract as workers/chemai-quota (consume / refund, one state per name).
const exactBudget = () => {
  const states = new Map()
  return {
    states,
    used: prefix => [...states].filter(([name]) => name.startsWith(prefix)).reduce((sum, [, state]) => sum + state.used, 0),
    idFromName: name => name,
    get: id => ({
      fetch: async (url, init) => {
        const body = JSON.parse(init.body)
        assert.match(body.day, /^\d{4}-\d{2}-\d{2}$/, 'QuotaCounter only accepts YYYY-MM-DD')
        const state = states.get(id) || { day: '', used: 0 }
        states.set(id, state)
        if (new URL(url).pathname === '/refund') {
          assert.ok(Number.isInteger(body.units) && body.units > 0, 'refund units')
          if (state.day === body.day) state.used = Math.max(0, state.used - body.units)
          return Response.json({ used: state.used })
        }
        const { day, limit, cost = 1 } = body
        assert.ok(Number.isInteger(limit) && limit >= 1 && Number.isInteger(cost) && cost >= 1, 'consume limit/cost')
        if (state.day !== day) Object.assign(state, { day, used: 0 })
        const allowed = state.used + cost <= limit
        if (allowed) state.used += cost
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
const completion = (total = 1110, extra = {}) => Response.json({
  model: 'openai/gpt-oss-120b',
  choices: [{ message: { role: 'assistant', content: JSON.stringify({ answer: 'pH = 2.', actions: [], suggestions: [] }) }, finish_reason: 'stop' }],
  usage: { prompt_tokens: total - 210, completion_tokens: 210, total_tokens: total, completion_tokens_details: { reasoning_tokens: 64 } },
  ...extra
})
globalThis.fetch = async (url, init) => {
  if (String(url) !== GROQ_URL) throw new Error(`unexpected network call: ${url}`)
  calls.push(JSON.parse(init.body))
  return reply ? reply() : completion()
}

// Fixed clock: cooldown and minute windows must not depend on when the suite runs.
const realNow = Date.now
let clock = Date.UTC(2026, 10, 14, 8, 0, 0)
Date.now = () => clock
const advance = seconds => { clock += seconds * 1000 }

const send = async (env, options = {}, message = 'Tính pH của dung dịch HCl 0,01 M.') => {
  const response = await onRequestPost({ request: post({ message, history: [], context: { view: 'home' } }, options), env })
  return { status: response.status, headers: response.headers, payload: await response.json(), cookie: (response.headers.get('Set-Cookie') || '').split(';')[0] }
}
const status = async (env, headers = {}) => (await onRequestGet({ request: new Request(`${origin}/api/chat`, { headers }), env })).json()

let passed = 0
const test = async (name, fn) => {
  calls.length = 0
  reply = null
  advance(120)
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
  assert.deepEqual(info.quota, { limit: 20000, remaining: 20000 })
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

await test('no question count: a learner may ask many questions while tokens remain', async () => {
  const env = publicEnv({ CHEMAI_TOKENS_GLOBAL_MINUTE: '1000000', CHEMAI_PUBLIC_REQUESTS_PER_MINUTE: '1000' })
  let cookie = ''
  for (let index = 0; index < 12; index += 1) {
    const result = await send(env, { headers: cookie ? { Cookie: cookie } : {} }, `Câu ${index}: pH của HCl 0,01 M?`)
    assert.equal(result.status, 200, `question ${index + 1}`)
    cookie ||= result.cookie
    advance(5)
  }
  assert.equal(calls.length, 12)
  assert.ok(!logs.some(line => line.includes('AI_CLIENT_LIMIT')))
})

await test('token accounting uses the provider usage: reserve, then refund down to total_tokens', async () => {
  const env = publicEnv()
  reply = () => completion(1234)
  const first = await send(env)
  assert.match(first.cookie, /^chemai_sid=[0-9a-f]{32}\.[0-9a-f]{64}$/)
  assert.match(first.headers.get('Set-Cookie'), /HttpOnly; Secure; SameSite=Strict/)
  assert.deepEqual(first.payload.quota, { limit: 20000, remaining: 20000 - 1234 })
  assert.equal(first.payload.usage.totalTokens, 1234)
  for (const prefix of ['budget:tokens-session:', 'budget:tokens-network:', 'budget:tokens-minute']) assert.equal(env.CHEMAI_BUDGET.used(prefix), 1234, prefix)
  assert.equal(env.CHEMAI_BUDGET.states.get('budget:tokens').used, 1234)
  assert.ok(logs.some(line => line.includes('"totalTokens":1234') && line.includes('"tokensCharged":1234') && line.includes('"reasoningTokens":64')))

  // The same session keeps counting; the status call reads it without spending.
  advance(5)
  reply = () => completion(1000)
  const second = await send(env, { headers: { Cookie: first.cookie } })
  assert.equal(second.cookie, '', 'a valid session is not re-issued')
  assert.equal(second.payload.quota.remaining, 20000 - 2234)
  assert.deepEqual((await status(env, { Cookie: first.cookie })).quota, { limit: 20000, remaining: 20000 - 2234 })
  assert.equal(env.CHEMAI_BUDGET.used('budget:tokens-session:'), 2234)
})

await test('the client budget stops a learner when tokens run out, without a model call', async () => {
  const env = publicEnv({ CHEMAI_TOKENS_PER_CLIENT_DAY: '7000' })
  reply = () => completion(2400)
  const first = await send(env)
  const headers = { Cookie: first.cookie }
  advance(70)
  assert.equal((await send(env, { headers })).status, 200) // 4800 used
  advance(70)
  const third = await send(env, { headers }) // reservation (input estimate + 1600) > 2200 left
  assert.equal(third.status, 429)
  assert.equal(third.payload.code, 'AI_TOKEN_LIMIT')
  assert.equal(calls.length, 2)
  assert.equal(env.CHEMAI_BUDGET.used('budget:tokens-session:'), 4800, 'a refused reservation leaves no charge')
  assert.equal(env.CHEMAI_BUDGET.states.get('budget:tokens').used, 4800)
})

await test('a browser cannot reset or raise its budget', async () => {
  const env = publicEnv({ CHEMAI_TOKENS_PER_CLIENT_DAY: '4000', CHEMAI_TOKENS_PER_NETWORK_DAY: '7000' })
  reply = () => completion(2400)
  const first = await send(env)
  advance(70)
  // Forged or edited cookies are not sessions: the request gets a new one…
  const forged = await send(env, { headers: { Cookie: `chemai_sid=${'a'.repeat(32)}.${'b'.repeat(64)}`, 'X-Forwarded-For': '203.0.113.9', 'X-Session-Id': 'new' } })
  assert.equal(forged.status, 200)
  assert.notEqual(forged.cookie, first.cookie)
  assert.match(forged.cookie, /^chemai_sid=/)
  advance(70)
  // …and clearing cookies does not help: the network bucket (4800 of 7000) cannot fit another reservation.
  const cleared = await send(env)
  assert.equal(cleared.payload.code, 'AI_TOKEN_LIMIT')
  assert.equal(calls.length, 2)
  // Request bodies cannot set limits either.
  const other = publicEnv({ CHEMAI_TOKENS_PER_CLIENT_DAY: '4000' })
  const response = await onRequestPost({ request: post({ message: 'pH của HCl 0,01 M?', quota: { limit: 999999 }, limit: 999999, tokens: 0 }, { ip: '198.51.100.99' }), env: other })
  assert.equal((await response.json()).quota.limit, 4000)
  // A session signed with another key is rejected.
  const stolen = await status(publicEnv({ CHEMAI_SESSION_SECRET: 'another-secret', CHEMAI_BUDGET: env.CHEMAI_BUDGET }), { Cookie: first.cookie })
  assert.equal(stolen.quota.remaining, 20000)
})

await test('learners on one network have separate budgets (shared school address)', async () => {
  const env = publicEnv({ CHEMAI_TOKENS_PER_CLIENT_DAY: '5000' })
  reply = () => completion(2400)
  const a = await send(env)
  advance(70)
  const b = await send(env)
  assert.equal(a.status, 200)
  assert.equal(b.status, 200)
  assert.notEqual(a.cookie, b.cookie)
  assert.equal(b.payload.quota.remaining, 2600)
})

await test('site-wide token budgets: per day and per minute', async () => {
  const day = publicEnv({ CHEMAI_TOKENS_GLOBAL_DAY: '4000' })
  reply = () => completion(2400)
  assert.equal((await send(day, { ip: '203.0.113.1' })).status, 200)
  advance(70)
  const over = await send(day, { ip: '203.0.113.2' })
  assert.equal(over.status, 429)
  assert.equal(over.payload.code, 'AI_BUDGET_LIMITED')

  const minute = publicEnv()
  reply = () => completion(2000)
  assert.equal((await send(minute, { ip: '203.0.113.3' })).status, 200) // 2000 of 6000 this minute
  advance(5)
  assert.equal((await send(minute, { ip: '203.0.113.4' })).status, 200) // 4000; the next reservation (~2200) no longer fits
  advance(5)
  const busy = await send(minute, { ip: '203.0.113.5' })
  assert.equal(busy.status, 503)
  assert.equal(busy.payload.code, 'AI_BUSY')
  advance(60)
  assert.equal((await send(minute, { ip: '203.0.113.5' })).status, 200)
  assert.equal(calls.length, 4)
})

await test('concurrent requests cannot overspend: reservations are taken before the call', async () => {
  const env = publicEnv({ CHEMAI_TOKENS_PER_NETWORK_DAY: '5000', CHEMAI_PUBLIC_COOLDOWN_SECONDS: '1' })
  const waiting = []
  reply = () => new Promise(resolve => waiting.push(() => resolve(completion(1500))))
  // Three sessions on one network at once; each reserves about 2000, the bucket holds 5000.
  const inFlight = ['a', 'b', 'c'].map(name => onRequestPost({ request: post({ message: `Câu hỏi ${name}: pH của HCl 0,01 M?` }, { ip: '203.0.113.60' }), env }))
  await new Promise(resolve => setTimeout(resolve, 30))
  // (public mode also allows one question in flight per network address)
  assert.equal(calls.length, 1)
  waiting.forEach(release => release())
  const statuses = (await Promise.all(inFlight)).map(response => response.status).sort()
  assert.deepEqual(statuses, [200, 409, 409])
  assert.ok(env.CHEMAI_BUDGET.used('budget:tokens-network:') <= 5000)
})

await test('retries: settled and reserved again per attempt, never past the budget', async () => {
  const overloaded = () => new Response('{"error":{"message":"overloaded"}}', { status: 503, headers: { 'retry-after': '0' } })
  const script = steps => { const queue = [...steps]; reply = () => queue.shift()() }

  // Provider error then success: the failed attempt costs 0, the answer its real usage.
  const env = publicEnv()
  script([overloaded, () => completion(1500)])
  const ok = await send(env)
  assert.equal(ok.status, 200)
  assert.equal(calls.length, 2)
  assert.equal(env.CHEMAI_BUDGET.used('budget:tokens-session:'), 1500)
  assert.equal(ok.payload.quota.remaining, 20000 - 1500)

  // No answer (network) then success: the lost attempt is charged its input estimate.
  const lossy = publicEnv({ CHEMAI_TOKENS_GLOBAL_MINUTE: '100000' })
  script([() => { throw new TypeError('network down') }, () => completion(1500)])
  const recovered = await send(lossy, { ip: '203.0.113.70' })
  assert.equal(recovered.status, 200)
  const estimate = lossy.CHEMAI_BUDGET.used('budget:tokens-session:') - 1500
  assert.ok(estimate > 500 && estimate < 2500, String(estimate))
  assert.equal(recovered.payload.quota.remaining, 20000 - 1500 - estimate)

  // Not enough budget left for another full reservation: the retry is not made.
  const tight = publicEnv({ CHEMAI_TOKENS_PER_CLIENT_DAY: '3000', CHEMAI_TOKENS_GLOBAL_MINUTE: '100000' })
  calls.length = 0
  script([() => { throw new TypeError('network down') }, () => completion(1500)])
  const stopped = await send(tight, { ip: '203.0.113.71' })
  assert.equal(stopped.status, 502)
  assert.equal(calls.length, 1)
  assert.equal(tight.CHEMAI_BUDGET.used('budget:tokens-session:'), estimate)
  assert.equal(tight.CHEMAI_BUDGET.states.get('budget:tokens').used, estimate)
})

await test('a failed call with no usage is charged the input estimate, the rest is refunded', async () => {
  const env = publicEnv()
  reply = () => { throw new TypeError('network down') }
  const result = await send(env)
  assert.equal(result.status, 502)
  const used = env.CHEMAI_BUDGET.used('budget:tokens-session:')
  assert.ok(used > 0 && used < 3 * 1600, String(used))
  assert.equal(env.CHEMAI_BUDGET.states.get('budget:tokens').used, used)
})

await test('usage above the reservation is still recorded in full', async () => {
  const env = publicEnv()
  reply = () => completion(9000)
  const result = await send(env)
  assert.equal(result.status, 200)
  assert.equal(env.CHEMAI_BUDGET.used('budget:tokens-session:'), 9000)
  assert.equal(result.payload.quota.remaining, 11000)
})

await test('spam protection: cooldown, per-minute request cap, one question in flight', async () => {
  const cooldown = publicEnv({ CHEMAI_PUBLIC_COOLDOWN_SECONDS: '10' })
  clock = Date.UTC(2026, 10, 15, 9, 0, 0)
  assert.equal((await send(cooldown)).status, 200)
  advance(3)
  const second = await send(cooldown, {}, 'Câu hỏi khác?')
  assert.equal(second.status, 429)
  assert.equal(second.payload.code, 'AI_COOLDOWN')
  assert.match(second.headers.get('Retry-After'), /^\d+$/)
  assert.equal(calls.length, 1)

  const capped = publicEnv({ CHEMAI_PUBLIC_REQUESTS_PER_MINUTE: '2', CHEMAI_TOKENS_GLOBAL_MINUTE: '1000000' })
  clock = Date.UTC(2026, 10, 15, 10, 0, 0)
  assert.equal((await send(capped, { ip: '203.0.113.1' })).status, 200)
  assert.equal((await send(capped, { ip: '203.0.113.2' })).status, 200)
  const third = await send(capped, { ip: '203.0.113.3' })
  assert.equal([third.status, third.payload.code].join(' '), '503 AI_BUSY')
})

await test('a counter outage fails closed', async () => {
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

await test('a question too long for the input cap is refused with guidance, never silently cut', async () => {
  const env = publicEnv()
  const long = `Cho hỗn hợp X gồm ${'Fe 5,6 g; Cu 6,4 g; Al 2,7 g; '.repeat(130)} tính khối lượng muối.`
  const result = await send(env, {}, long.slice(0, 3900))
  assert.equal(result.status, 413)
  assert.equal(result.payload.code, 'AI_INPUT_TOO_LARGE')
  assert.match(result.payload.message, /rút gọn/)
  assert.equal(calls.length, 0)
  assert.equal(env.CHEMAI_BUDGET.used('budget:tokens'), 0)
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
  await send(publicEnv())
  assert.equal(calls[0].max_completion_tokens, 1000, 'simple question: small reservation')
  assert.equal(calls[0].include_reasoning, false)
  assert.equal(calls[0].reasoning_effort, 'low')
  assert.ok(!JSON.stringify(calls[0]).includes(KEY))
  const roomy = { CHEMAI_TOKENS_GLOBAL_MINUTE: '100000' }
  await send(publicEnv(roomy), { ip: '203.0.113.20' }, 'Cho dung dịch NaOH vào dung dịch CuSO4, nêu hiện tượng.')
  assert.deepEqual([calls[1].reasoning_effort, calls[1].max_completion_tokens], ['medium', 1600], 'unclassified question')
  await send(publicEnv(roomy), { ip: '203.0.113.22' }, 'Hỗn hợp X gồm 5,6 g Fe và 6,4 g Cu tác dụng với 200 mL HCl 2 M, hiệu suất 80%. Tính V khí (đkc).')
  assert.deepEqual([calls[2].reasoning_effort, calls[2].max_completion_tokens], ['medium', 2400], 'multi-step problem gets more room')
  await send(publicEnv({ ...roomy, GROQ_MAX_COMPLETION_TOKENS: '999999', GROQ_REASONING_EFFORT: 'high' }), { ip: '203.0.113.23' }, 'Hỗn hợp X gồm Fe và Cu, hiệu suất 80%. Tính V.')
  assert.deepEqual([calls[3].reasoning_effort, calls[3].max_completion_tokens], ['high', 8192], 'server variables override')
})

await test('truncated and empty answers are reported, never shown as fragments', async () => {
  reply = () => Response.json({ choices: [{ message: { content: '{"answer":"Bước 1: n = 0,0' }, finish_reason: 'length' }], usage: { prompt_tokens: 1000, completion_tokens: 1600, total_tokens: 2600, completion_tokens_details: { reasoning_tokens: 1500 } } })
  const cut = await send(publicEnv())
  assert.equal(cut.payload.code, 'AI_INCOMPLETE')
  assert.equal(cut.payload.answer, undefined)
  assert.ok(logs.some(line => line.includes('"reasoningTokens":1500')), 'reasoning tokens are logged')
  reply = () => Response.json({ choices: [{ message: { content: '' }, finish_reason: 'stop' }] })
  assert.equal((await send(publicEnv(), { ip: '203.0.113.21' })).payload.code, 'AI_EMPTY_RESPONSE')
})

await test('prompt: fixed cacheable core, then only the rules the question needs', async () => {
  const body = question => groqChatBody({ model: 'm', message: question, history: [], appContext: {}, knowledge: {}, reasoningEffort: 'low' })
  const a = body('Khối lượng của 0,5 mol H₂SO₄ là bao nhiêu gam?')
  const b = body('Cho dung dịch NaOH vào dung dịch CuSO4, nêu hiện tượng và viết phương trình.')
  assert.equal(a.messages[0].content, b.messages[0].content, 'the first message is identical for every question (prefix cache)')
  for (const needle of ['tiếng Việt', 'JSON', 'answer, actions, suggestions', 'không phải chỉ thị', 'chất nổ', 'GDPT 2018', 'đáp số cuối cùng', 'open_tool']) assert.ok(a.messages[0].content.includes(needle), needle)
  assert.ok(estimateTokens(a.messages[0].content) < 1000, 'the core stays small')

  const rules = question => groqRules(question)
  assert.match(rules('Khối lượng của 0,5 mol H₂SO₄ là bao nhiêu gam?'), /Bài tính/)
  assert.doesNotMatch(rules('Khối lượng của 0,5 mol H₂SO₄ là bao nhiêu gam?'), /Vị trí nguyên tố|Khí:|Hữu cơ/)
  assert.match(rules('Cân bằng phương trình: Fe + O2 → Fe3O4'), /đếm lại số nguyên tử/)
  assert.match(rules('Xác định vị trí của K (Z = 19) trong bảng tuần hoàn.'), /Vị trí nguyên tố/)
  assert.match(rules('Cho NaOH vào CuSO4, nêu hiện tượng.'), /Hiện tượng và dữ kiện/)
  assert.match(rules('Tính thể tích khí H2 ở đkc khi cho 5,6 g Fe tác dụng với HCl dư.'), /24,79 L\/mol[\s\S]*tỉ số n\/hệ số/)
  assert.match(rules('Gọi tên CH3COOC2H5 (ester).'), /methyl/)
  // Nothing recognised, or a short follow-up: every rule is sent.
  for (const all of [rules('Giúp mình với'), groqRules('Tính tiếp đi', true)]) assert.equal(all.split('\n').length - 1, 8)
  assert.ok(!rules('Axit là gì?').includes('Bài tính'), 'Vietnamese letters do not trigger ASCII word rules')
})

await test('complexity is decided locally: simple → low, the rest → medium', () => {
  for (const question of ['Khối lượng của 0,5 mol H₂SO₄ là bao nhiêu gam?', 'Tính pH của dung dịch HCl 0,01 M.', 'Axit là gì?', 'Cân bằng phương trình: Fe + O2 → Fe3O4']) assert.equal(questionComplexity(question), 'simple', question)
  for (const question of ['Vì sao kim loại kiềm hoạt động mạnh?', 'Cho 5,6 gam Fe tác dụng hết với dung dịch HCl dư. Tính thể tích khí H2 thu được ở đkc.', 'Giúp mình với']) assert.equal(questionComplexity(question), 'normal', question)
  for (const question of ['Hỗn hợp X gồm Fe và Cu tác dụng với HCl. Tính % khối lượng.', 'Điện phân dung dịch CuSO4 với I = 2 A trong 965 s. Tính m Cu.', 'Cho 1,2 g Mg; 2,7 g Al; 5,6 g Fe vào 500 mL HCl 1 M, tính V.']) assert.equal(questionComplexity(question), 'complex', question)
})

await test('context: screen text only when the question points at the screen; structured state always', () => {
  const context = { view: 'lab', lab: { mixture: { HCl: '25 mL 0,1 M' } }, chemFlow: { reaction: { balanced: 'HCl + NaOH → NaCl + H2O' } }, progress: { lessons: 3 }, visibleText: 'x'.repeat(3000) }
  const plain = focusContext(context, 'Tính pH của dung dịch HCl 0,01 M.')
  assert.deepEqual(plain, { view: 'lab', lab: context.lab, chemFlow: context.chemFlow })
  const pointed = focusContext(context, 'Giải thích thí nghiệm trên màn hình này')
  assert.equal(pointed.visibleText.length, 600)
  assert.deepEqual(focusContext(context, 'Tiến độ của mình đến đâu rồi?').progress, { lessons: 3 })
  // Knowledge for the model: ids and empties go, chemistry stays.
  const slim = pruneEmpty(slimKnowledge({ elements: [], reactions: [{ id: 'h2so4-naoh', equation: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O', conditions: {}, solids: [{ formula: 'BaSO4', color: 'trắng' }] }] }))
  assert.deepEqual(slim, { reactions: [{ equation: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O', solids: [{ formula: 'BaSO4', color: 'trắng' }] }] })
})

await test('cached prompt tokens are reported and not charged', async () => {
  const env = publicEnv()
  reply = () => completion(1400, { usage: { prompt_tokens: 1200, completion_tokens: 200, total_tokens: 1400, prompt_tokens_details: { cached_tokens: 768 }, completion_tokens_details: { reasoning_tokens: 40 } } })
  const result = await send(env)
  assert.equal(result.payload.usage.totalTokens, 1400)
  assert.equal(result.payload.usage.cachedTokens, 768)
  assert.equal(result.payload.usage.charged, 632)
  assert.equal(result.payload.quota.remaining, 20000 - 632)
  assert.equal(env.CHEMAI_BUDGET.used('budget:tokens-session:'), 632)
  assert.ok(logs.some(line => line.includes('"cachedTokens":768') && line.includes('"tokensCharged":632') && line.includes('"inputChars"') && line.includes('"complexity":"simple"')))
  assert.ok(!logs.some(line => line.includes('Tính pH của dung dịch')), 'logs carry sizes, never the question text')
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

  const tight = fitInput({ message, history, appContext, knowledge, maxTokens: 2500 })
  assert.ok(tight.inputTokens <= 2500, `fits: ${tight.inputTokens}`)
  assert.deepEqual(tight.history.slice(-2).map(item => item.content), ['Fe có M bằng bao nhiêu?', 'M(Fe) = 56 g/mol.'])
  assert.deepEqual(tight.appContext.lab, appContext.lab)
  assert.deepEqual(tight.appContext.chemFlow, appContext.chemFlow)
  assert.ok(tight.trimmed.includes('screen-text:800'))
  const body = groqChatBody({ model: 'm', message, history: tight.history, appContext: tight.appContext, knowledge, reasoningEffort: 'low' })
  assert.ok(body.messages.at(-1).content.includes(message))
  assert.ok(body.messages.at(-1).content.includes(JSON.stringify(knowledge)))
  assert.ok(body.messages.reduce((sum, item) => sum + estimateTokens(item.content), 0) <= 2500)

  const repeated = fitInput({ message, history: [{ role: 'user', content: 'A' }, { role: 'user', content: 'A' }, { role: 'assistant', content: 'B' }], appContext: {}, knowledge, maxTokens: 100000 })
  assert.equal(repeated.history.length, 2)

  // Same input → same output.
  assert.deepEqual(fitInput({ message, history, appContext, knowledge, maxTokens: 2500 }), tight)
})

await test('public history is capped at 6 turns before it reaches the model', async () => {
  const history = Array.from({ length: 10 }, (_, index) => ({ role: index % 2 ? 'assistant' : 'user', content: `turn-${index}` }))
  await onRequestPost({ request: post({ message: 'Fe + HCl?', history, context: { view: 'home' } }, { ip: '203.0.113.30' }), env: publicEnv() })
  const sent = calls[0].messages.at(-1).content
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
console.info(`PASS — ${passed} ChemAI public-mode and token-budget checks passed.`)
