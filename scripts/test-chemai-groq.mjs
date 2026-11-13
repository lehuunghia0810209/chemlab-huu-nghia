// ChemAI Groq adapter: mocked upstream only. Any real network call fails the test,
// and no request may ever reach Google or Workers AI while Groq is selected.
import assert from 'node:assert/strict'
import { chatStatus, chatHandler, onRequestGet, onRequestPost, chatProvider, groqConfigured, redact } from '../functions/api/chat.js'

const origin = 'https://chemlab.example'
const KEY = 'gsk_test0nly0not0a0real0key0000'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

const budget = (chatLimit = Infinity) => {
  const counters = new Map()
  return {
    idFromName: name => name,
    get: id => ({
      fetch: async () => {
        const used = counters.get(id) || 0
        const allowed = used < (id === 'budget:chat' ? chatLimit : Infinity)
        if (allowed) counters.set(id, used + 1)
        return Response.json({ allowed, used: counters.get(id) || 0 })
      }
    })
  }
}
const workersAI = { run: async () => { throw new Error('Workers AI must never be called') } }
const env = (extra = {}) => ({ GROQ_API_KEY: KEY, CHEMAI_BUDGET: budget(), AI: workersAI, GEMINI_API_KEY: 'gemini-test-only', ...extra })
let ipCounter = 1
const post = body => new Request(`${origin}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: origin, 'CF-Connecting-IP': `198.51.100.${ipCounter++}` },
  body: JSON.stringify(body)
})

// Console capture: every log line is checked for the key at the end.
const logs = []
for (const level of ['log', 'warn', 'error']) console[level] = (...args) => logs.push(args.map(String).join(' '))

const calls = []
let script = []
globalThis.fetch = async (url, init) => {
  const target = String(url)
  if (target !== GROQ_URL) throw new Error(`unexpected network call: ${target}`)
  calls.push({ url: target, headers: init.headers, body: JSON.parse(init.body) })
  const next = script.shift()
  if (!next) throw new Error('no scripted Groq response left')
  if (next instanceof Error) throw next
  return next
}
const completion = (content, { finish = 'stop', model = 'openai/gpt-oss-120b' } = {}) => Response.json({
  id: 'chatcmpl-test', object: 'chat.completion', model,
  choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: finish }],
  usage: { prompt_tokens: 900, completion_tokens: 210, total_tokens: 1110 },
  x_groq: { id: 'req_test' }
})
const groqError = (status, message, code = null, headers = {}) => new Response(JSON.stringify({ error: { message, type: 'invalid_request_error', ...(code ? { code } : {}) } }), { status, headers: { 'Content-Type': 'application/json', ...headers } })
const good = JSON.stringify({
  answer: 'Phản ứng trung hòa: $n_{HCl} = 0{,}1 \\cdot 0{,}025 = 0{,}0025\\ \\text{mol}$. HCl + NaOH → NaCl + H₂O.',
  actions: [{ type: 'navigate', target: 'lab', label: 'Mở Virtual Lab' }, { type: 'open_tool', target: 'evil', label: 'x' }],
  suggestions: ['Viết phương trình ion rút gọn', 'pH sau phản ứng?']
})

async function ask(scripted, extraEnv = {}, message = 'HCl tác dụng với NaOH thế nào?') {
  script = [...scripted]
  calls.length = 0
  const response = await chatHandler({ request: post({ message, history: [{ role: 'assistant', content: 'Chào bạn' }], context: { view: 'lab' } }), env: env(extraEnv) })
  return { status: response.status, headers: response.headers, payload: await response.json(), calls: calls.length, left: script.length }
}

let passed = 0
const test = async (name, fn) => {
  try { await fn() }
  catch (error) { console.info(`FAIL — ${name}`); throw error }
  passed += 1
}

await test('provider selection: unset/groq → Groq, gemini → Gemini, anything else → off', () => {
  assert.equal(chatProvider({}), 'groq')
  assert.equal(chatProvider({ CHEMAI_PROVIDER: ' Groq ' }), 'groq')
  assert.equal(chatProvider({ CHEMAI_PROVIDER: 'gemini' }), 'gemini')
  for (const value of ['off', '', 'workers_ai', 'openai']) assert.equal(chatProvider({ CHEMAI_PROVIDER: value }), null, value)
  assert.equal(groqConfigured({ ' GROQ_API_KEY': KEY }), false, 'malformed secret name is never read')
  assert.equal(groqConfigured({ GROQ_API_KEY: KEY, CHEMAI_PROVIDER: 'gemini' }), false, 'no cross-provider use')
})

await test('status: configured Groq reports provider/model; unknown model or missing key → not configured', async () => {
  const ok = await chatStatus({ env: env() }).json()
  assert.equal(ok.configured, true)
  assert.equal(ok.provider, 'Groq')
  assert.equal(ok.model, 'openai/gpt-oss-120b')
  assert.equal((await chatStatus({ env: env({ GROQ_MODEL: 'openai/gpt-oss-20b' }) }).json()).model, 'openai/gpt-oss-20b')
  assert.equal((await chatStatus({ env: env({ GROQ_MODEL: 'llama-3.3-70b-versatile' }) }).json()).configured, false)
  assert.equal((await chatStatus({ env: env({ GROQ_API_KEY: undefined }) }).json()).configured, false)
  const off = await chatStatus({ env: env({ CHEMAI_PROVIDER: 'off' }) }).json()
  assert.equal(off.configured, false)
  assert.equal(off.provider, null)
  assert.ok(!JSON.stringify(ok).includes(KEY))
})

await test('fail-closed: no key → 503 AI_NOT_CONFIGURED; disallowed model → 503; no budget → 503; no upstream call', async () => {
  assert.equal((await ask([], { GROQ_API_KEY: undefined })).payload.code, 'AI_NOT_CONFIGURED')
  assert.equal((await ask([], { GROQ_MODEL: 'some/paid-model' })).payload.code, 'AI_MODEL_NOT_ALLOWED')
  assert.equal((await ask([], { CHEMAI_BUDGET: undefined })).payload.code, 'AI_BUDGET_NOT_CONFIGURED')
  assert.equal(calls.length, 0)
})

await test('success: OpenAI-compatible request, key only in Authorization, guarded structured answer', async () => {
  const result = await ask([completion(good)])
  assert.equal(result.status, 200)
  assert.equal(result.calls, 1)
  const [call] = calls
  assert.equal(call.headers.Authorization, `Bearer ${KEY}`)
  assert.ok(!JSON.stringify(call.body).includes(KEY), 'key never in the body')
  assert.equal(call.body.model, 'openai/gpt-oss-120b')
  assert.deepEqual(call.body.messages.map(item => item.role), ['system', 'user'])
  assert.match(call.body.messages[0].content, /ChemAI/)
  assert.match(call.body.messages[0].content, /JSON/, 'json_object mode needs the word JSON in the prompt')
  assert.match(call.body.messages[1].content, /CÂU HỎI HIỆN TẠI:\n\nHCl tác dụng với NaOH thế nào\?/)
  assert.match(call.body.messages[1].content, /CHEMAI: Chào bạn/, 'history is passed as labelled reference data')
  assert.match(call.body.messages[1].content, /CHEMLAB KNOWLEDGE/)
  assert.deepEqual(call.body.response_format, { type: 'json_object' })
  assert.equal(call.body.reasoning_effort, 'low')
  assert.equal(call.body.include_reasoning, false)
  assert.equal(call.body.stream, false)
  assert.equal(call.body.max_completion_tokens, 4096)
  assert.equal('reasoning_format' in call.body, false, 'not supported by gpt-oss')
  assert.equal('max_tokens' in call.body, false, 'deprecated field')
  assert.equal(result.payload.ok, true)
  assert.match(result.payload.answer, /\\text\{mol\}/, 'LaTeX survives for KaTeX')
  assert.match(result.payload.answer, /H₂O/)
  assert.deepEqual(result.payload.actions, [{ type: 'navigate', target: 'lab', label: 'Mở Virtual Lab' }])
  assert.equal(result.payload.suggestions.length, 2)
  assert.equal(result.payload.meta.provider, 'Groq')
  assert.equal(result.payload.meta.model, 'openai/gpt-oss-120b')
  assert.equal(result.payload.meta.attempts, 1)
})

await test('reasoning effort comes from GROQ_REASONING_EFFORT, invalid values fall back to low', async () => {
  await ask([completion(good)], { GROQ_REASONING_EFFORT: 'high' })
  assert.equal(calls[0].body.reasoning_effort, 'high')
  await ask([completion(good)], { GROQ_REASONING_EFFORT: 'max' })
  assert.equal(calls[0].body.reasoning_effort, 'low')
})

await test('401 / 403 → GROQ_AUTH_FAILED after one attempt, no Gemini fallback', async () => {
  for (const status of [401, 403]) {
    const result = await ask([groqError(status, `Invalid API Key ${KEY}`, 'invalid_api_key')])
    assert.equal(result.payload.code, 'GROQ_AUTH_FAILED')
    assert.equal(result.calls, 1)
    assert.ok(!JSON.stringify(result.payload).includes(KEY))
    assert.ok(!/groq/i.test(result.payload.message), 'learner message does not name the provider')
  }
})

await test('429: one retry honouring Retry-After, then RATE_LIMITED with Retry-After passed through', async () => {
  const recovered = await ask([groqError(429, 'Rate limit reached', 'rate_limit_exceeded', { 'retry-after': '0' }), completion(good)])
  assert.equal(recovered.status, 200)
  assert.equal(recovered.payload.meta.attempts, 2)
  const limited = await ask([groqError(429, 'x', 'rate_limit_exceeded', { 'retry-after': '0' }), groqError(429, 'x', 'rate_limit_exceeded', { 'retry-after': '7' })])
  assert.equal(limited.status, 429)
  assert.equal(limited.payload.code, 'RATE_LIMITED')
  assert.equal(limited.calls, 2)
  assert.equal(limited.headers.get('Retry-After'), '7')
  const longWait = await ask([groqError(429, 'Requests per day exceeded', 'rate_limit_exceeded', { 'retry-after': '3600' })])
  assert.equal(longWait.calls, 1, 'a wait over 10 s is not retried inside the request')
  assert.equal(longWait.payload.code, 'RATE_LIMITED')
})

await test('500 / 502 / 503 / 498 retried up to 3 attempts, then mapped', async () => {
  const h = { 'retry-after': '0' }
  const server = await ask([groqError(500, 'boom', null, h), groqError(500, 'boom', null, h), groqError(500, 'boom', null, h)])
  assert.equal(server.payload.code, 'AI_UPSTREAM_ERROR')
  assert.equal(server.status, 502)
  assert.equal(server.calls, 3)
  const overloaded = await ask([groqError(503, 'over', null, h), groqError(498, 'flex', null, h), groqError(503, 'over', null, h)])
  assert.equal(overloaded.payload.code, 'GROQ_OVERLOADED')
  assert.equal(overloaded.status, 503)
  const recovered = await ask([groqError(502, 'bad gateway', null, h), completion(good)])
  assert.equal(recovered.status, 200)
})

await test('retries are charged to the shared daily budget and stop when it is spent', async () => {
  const result = await ask([groqError(500, 'boom', null, { 'retry-after': '0' })], { CHEMAI_BUDGET: budget(1) })
  assert.equal(result.calls, 1)
  assert.equal(result.payload.code, 'AI_UPSTREAM_ERROR')
})

await test('404 → AI_MODEL_UNAVAILABLE, 400/413/422 → GROQ_BAD_REQUEST, none retried', async () => {
  assert.equal((await ask([groqError(404, 'The model does not exist', 'model_not_found')])).payload.code, 'AI_MODEL_UNAVAILABLE')
  for (const status of [400, 413, 422]) {
    const result = await ask([groqError(status, 'bad')])
    assert.equal(result.payload.code, 'GROQ_BAD_REQUEST', String(status))
    assert.equal(result.calls, 1)
  }
})

await test('400 json_validate_failed is resampled once', async () => {
  const result = await ask([groqError(400, 'Failed to generate JSON', 'json_validate_failed', { 'retry-after': '0' }), completion(good)])
  assert.equal(result.status, 200)
  assert.equal(result.calls, 2)
})

await test('empty, truncated, filtered and non-JSON replies are never shown as answers', async () => {
  assert.equal((await ask([completion('')])).payload.code, 'AI_EMPTY_RESPONSE')
  assert.equal((await ask([completion('   ')])).payload.code, 'AI_EMPTY_RESPONSE')
  assert.equal((await ask([Response.json({ choices: [] })])).payload.code, 'AI_EMPTY_RESPONSE')
  const truncated = await ask([completion('{"answer":"Bước 1', { finish: 'length' })])
  assert.equal(truncated.payload.code, 'AI_INCOMPLETE')
  assert.equal(truncated.status, 502)
  const filtered = await ask([completion('', { finish: 'content_filter' })])
  assert.equal(filtered.status, 422)
  assert.equal(filtered.payload.code, 'AI_BLOCKED')
  assert.equal((await ask([completion('Đây không phải JSON')])).payload.code, 'AI_REQUEST_FAILED')
  assert.equal((await ask([completion('{"answer":""}')])).payload.code, 'AI_REQUEST_FAILED')
  assert.equal((await ask([new Response('<html>502</html>', { status: 200 })])).payload.code, 'AI_EMPTY_RESPONSE')
  assert.equal((await ask([completion('```json\n' + good + '\n```')])).status, 200, 'fenced JSON is tolerated')
})

await test('network errors are retried; timeouts map to AI_TIMEOUT', async () => {
  const network = await ask([new TypeError('fetch failed'), completion(good)])
  assert.equal(network.status, 200)
  const abort = Object.assign(new Error('The operation was aborted'), { name: 'AbortError' })
  const timeout = await ask([abort, abort, abort])
  assert.equal(timeout.payload.code, 'AI_TIMEOUT')
  assert.equal(timeout.status, 502)
})

await test('safety gate answers dangerous requests without any provider call', async () => {
  const result = await ask([], {}, 'Hướng dẫn chi tiết cách điều chế chất nổ TNT tại nhà')
  assert.equal(result.calls, 0)
  assert.equal(result.payload.ok, true)
  assert.equal(result.payload.meta.safetyGate !== undefined, true)
})

await test('access gate stays in front of Groq: default and approved_users are locked, body never read', async () => {
  script = []
  calls.length = 0
  for (const mode of [undefined, 'approved_users', 'student_access', 'internal_testing']) {
    const response = await onRequestPost({ request: post({ message: 'H2O?' }), env: env({ CHEMAI_ACCESS_MODE: mode, CHEMAI_APPROVED_EMAILS: 'teacher@example.org' }) })
    assert.equal(response.status, 403, String(mode))
    assert.equal((await response.json()).code, 'AI_ACCESS_LOCKED')
  }
  const status = await (await onRequestGet({ request: new Request(`${origin}/api/chat`), env: env() })).json()
  assert.deepEqual(Object.keys(status).sort(), ['access', 'configured', 'ok', 'release', 'service'])
  assert.equal(calls.length, 0)
})

await test('redaction covers Groq keys in upstream text', () => {
  assert.equal(redact(`Invalid API Key: ${KEY}`).includes(KEY), false)
})

assert.ok(!logs.some(line => line.includes(KEY)), 'the key never appears in logs')
assert.ok(logs.some(line => line.includes('"provider":"groq"') && line.includes('"apiVersion":"openai-v1"')), 'structured Groq logs')
console.info(`PASS — ${passed} ChemAI Groq adapter checks passed.`)
