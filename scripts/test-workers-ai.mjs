// ChemAI on Cloudflare Workers AI: mocked env.AI binding and an exact
// Durable Object budget mock. No Neurons are consumed and Gemini must never be called.
import assert from 'node:assert/strict'
import { onRequestGet, onRequestPost } from '../functions/api/chat.js'
import { estimateNeurons, actualNeurons, dailyClientKey, classifyWorkersAIError, WORKERS_AI_MODELS, DEFAULT_WORKERS_AI_MODEL, MAX_OUTPUT_TOKENS } from '../functions/api/_workersAI.js'
import { consume, refund } from '../workers/chemai-quota/src/index.js'

const origin = 'https://chemlab.example'
const GLM = '@cf/zai-org/glm-4.7-flash'
const GEMMA = '@cf/google/gemma-4-26b-a4b-it'
let ipCounter = 0
const nextIp = () => `198.51.100.${(ipCounter += 1)}`

// Durable Object namespace mock: one serial counter per name, same consume/refund as the Worker.
function budget() {
  const states = new Map()
  const namespace = {
    calls: 0,
    costs: [],
    used: name => states.get(`budget:${name}`)?.used || 0,
    idFromName: name => name,
    get(id) {
      return {
        async fetch(url, init) {
          namespace.calls += 1
          const body = JSON.parse(init.body)
          if (!states.has(id)) states.set(id, { day: '', used: 0 })
          if (new URL(url).pathname === '/refund') return Response.json(refund(states.get(id), body))
          namespace.costs.push([id, body.cost])
          return Response.json(consume(states.get(id), body))
        }
      }
    }
  }
  return namespace
}

function completion(content, { finish = 'stop', usage = { prompt_tokens: 1500, completion_tokens: 300 } } = {}) {
  return { id: 'x', object: 'chat.completion', choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: finish }], usage }
}

// env.AI mock: `behave(model, callIndex)` returns a result or throws.
function ai(behave) {
  const binding = {
    calls: [],
    async run(model, inputs) {
      binding.calls.push({ model, inputs })
      return behave(model, binding.calls.length)
    }
  }
  return binding
}
const aiError = (code, text) => new Error(`InferenceUpstreamError: ${code}: ${text}`)

let geminiCalls = 0
globalThis.fetch = async () => {
  geminiCalls += 1
  throw new Error('no network call is allowed in this test')
}

function env(extra = {}) {
  return { AI: ai(() => completion('Nước có công thức **H₂O**.')), CHEMAI_BUDGET: budget(), GEMINI_API_KEY: 'present-but-unused', ...extra }
}

async function ask(environment, body = { message: 'H2O là gì?' }, ip = nextIp()) {
  const response = await onRequestPost({
    request: new Request(`${origin}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: origin, 'CF-Connecting-IP': ip },
      body: typeof body === 'string' ? body : JSON.stringify(body)
    }),
    env: environment
  })
  return { status: response.status, payload: await response.json() }
}

let passed = 0
async function test(name, fn) {
  const originalError = console.error
  const originalLog = console.log
  console.error = () => {}
  console.log = () => {}
  try {
    await fn()
    passed += 1
  }
  catch (error) {
    console.error = originalError
    console.error(`FAIL — ${name}`)
    throw error
  }
  finally {
    console.error = originalError
    console.log = originalLog
  }
}

await test('price table holds only free models; default is GLM 4.7 Flash', () => {
  assert.equal(DEFAULT_WORKERS_AI_MODEL, GLM)
  for (const paid of ['@cf/zai-org/glm-5.2', '@cf/zai-org/glm-5.3', '@cf/zai-org/glm-5.3-flash', '@cf/moonshotai/kimi-k2.6', '@cf/deepseek-ai/deepseek-v4-pro-0813']) {
    assert.equal(Object.hasOwn(WORKERS_AI_MODELS, paid), false, paid)
  }
  assert.equal(estimateNeurons(GLM, 6000), Math.ceil((3000 * 5500 + MAX_OUTPUT_TOKENS * 36400) / 1e6))
  assert.equal(actualNeurons(GLM, { prompt_tokens: 2000, completion_tokens: 500 }), Math.ceil((2000 * 5500 + 500 * 36400) / 1e6))
  assert.equal(actualNeurons(GLM, null), null)
})

await test('status endpoint reports Workers AI and fails closed without the AI binding', async () => {
  const ready = await onRequestGet({ env: env() }).json()
  assert.deepEqual([ready.configured, ready.provider, ready.model], [true, 'Workers AI', GLM])
  const missing = await onRequestGet({ env: { CHEMAI_BUDGET: budget() } }).json()
  assert.equal(missing.configured, false)
})

await test('valid Vietnamese question with history: Workers AI only, Markdown prompt, bounded output', async () => {
  const environment = env()
  const { status, payload } = await ask(environment, {
    message: 'Tính số mol của 4,48 lít khí CO₂ ở đktc.',
    history: [{ role: 'user', content: 'Mình đang học chương mol.' }, { role: 'assistant', content: 'Được, hãy hỏi nhé.' }],
    context: { view: 'learning' }
  })
  assert.equal(status, 200)
  assert.equal(payload.answer, 'Nước có công thức **H₂O**.')
  assert.deepEqual([payload.actions, payload.suggestions], [[], []])
  assert.equal(payload.meta.provider, 'Workers AI')
  assert.equal(payload.meta.model, GLM)
  const [call] = environment.AI.calls
  assert.equal(call.model, GLM)
  assert.equal(call.inputs.max_completion_tokens, MAX_OUTPUT_TOKENS)
  assert.equal(MAX_OUTPUT_TOKENS, 1800)
  assert.deepEqual(call.inputs.chat_template_kwargs, { enable_thinking: false }, 'GLM hidden reasoning off')
  assert.match(call.inputs.messages[0].content, /không viết phần nháp/)
  assert.equal(call.inputs.messages[0].role, 'system')
  assert.match(call.inputs.messages[0].content, /Markdown/)
  assert.match(call.inputs.messages[0].content, /bảo toàn nguyên tố/)
  assert.doesNotMatch(call.inputs.messages[0].content, /JSON object hợp lệ|actions: array/)
  const user = call.inputs.messages[1].content
  assert.match(user, /Mình đang học chương mol/)
  assert.match(user, /4,48 lít khí CO₂/)
  assert.match(user, /CHEMLAB KNOWLEDGE/)
  assert.equal(geminiCalls, 0)
})

await test('fail closed: no AI binding, unknown provider, no budget → zero model calls', async () => {
  assert.equal((await ask({ CHEMAI_BUDGET: budget(), GEMINI_API_KEY: 'k' })).payload.code, 'AI_NOT_CONFIGURED')
  const unknown = env({ CHEMAI_PROVIDER: 'openai' })
  assert.equal((await ask(unknown)).payload.code, 'AI_NOT_CONFIGURED')
  const noBudget = env({ CHEMAI_BUDGET: undefined })
  const result = await ask(noBudget)
  assert.equal(result.status, 503)
  assert.equal(result.payload.code, 'AI_BUDGET_NOT_CONFIGURED')
  assert.equal(unknown.AI.calls.length + noBudget.AI.calls.length, 0)
})

await test('a model outside the free list (paid-only or unknown) is refused before any call', async () => {
  for (const model of ['@cf/zai-org/glm-5.3', '@cf/vendor/does-not-exist']) {
    const environment = env({ CHEMAI_MODEL: model })
    const { status, payload } = await ask(environment)
    assert.equal(status, 503)
    assert.equal(payload.code, 'AI_MODEL_NOT_ALLOWED')
    assert.equal(environment.AI.calls.length, 0)
  }
  const fallbackPaid = env({ CHEMAI_FALLBACK_MODEL: '@cf/zai-org/glm-5.3', AI: ai(() => { throw aiError(5007, 'No such model') }) })
  const { payload } = await ask(fallbackPaid)
  assert.equal(payload.code, 'AI_MODEL_UNAVAILABLE')
  assert.deepEqual(fallbackPaid.AI.calls.map(call => call.model), [GLM], 'a paid fallback is ignored')
})

await test('invalid input is rejected before any budget or model call', async () => {
  const environment = env()
  for (const [body, code] of [['{not json', 'INVALID_JSON'], [{ message: '   ' }, 'EMPTY_MESSAGE']]) {
    const { status, payload } = await ask(environment, body)
    assert.equal(status, 400)
    assert.equal(payload.code, code)
  }
  assert.equal(environment.CHEMAI_BUDGET.calls, 0)
  assert.equal(environment.AI.calls.length, 0)
})

await test('Neurons are reserved before the call and the unused part is refunded from usage', async () => {
  const environment = env({ AI: ai(() => completion('Đáp án: 0,2 mol.', { usage: { prompt_tokens: 1000, completion_tokens: 200 } })) })
  await ask(environment)
  const [, reservedCost] = environment.CHEMAI_BUDGET.costs.find(([id]) => id === 'budget:chat-neurons')
  assert.ok(reservedCost > actualNeurons(GLM, { prompt_tokens: 1000, completion_tokens: 200 }))
  assert.equal(environment.CHEMAI_BUDGET.used('chat-neurons'), actualNeurons(GLM, { prompt_tokens: 1000, completion_tokens: 200 }))
})

await test('daily Neuron budget exhausted → 429 without a model call', async () => {
  const environment = env({ CHEMAI_DAILY_NEURONS: '10' })
  const { status, payload } = await ask(environment)
  assert.equal(status, 429)
  assert.equal(payload.code, 'AI_BUDGET_LIMITED')
  assert.equal(environment.AI.calls.length, 0)
})

await test('per-client daily limit; IPv6 addresses in one /64 share it', async () => {
  const environment = env({ CHEMAI_DAILY_LIMIT_PER_CLIENT: '2' })
  const statuses = []
  for (const ip of ['2001:db8:1:2::1', '2001:db8:1:2:ffff::9', '2001:0db8:0001:0002::42']) statuses.push((await ask(environment, { message: `Câu ${statuses.length}` }, ip)).payload.code || 200)
  assert.deepEqual(statuses, [200, 200, 'AI_CLIENT_LIMIT'])
  assert.equal(environment.AI.calls.length, 2)
  assert.equal((await ask(environment, { message: 'Câu khác' }, '2001:db8:1:3::1')).status, 200, 'another /64 is another client')
  assert.equal(dailyClientKey('2001:db8::1'), '2001:0db8:0000:0000::/64')
  assert.equal(dailyClientKey('203.0.113.7'), '203.0.113.7')
})

await test('3036 daily free allocation used up → 429 AI_DAILY_LIMIT, no retry, no fallback', async () => {
  const environment = env({ AI: ai(() => { throw aiError(3036, 'You have used up your daily free allocation of 10,000 neurons.') }) })
  const { status, payload } = await ask(environment)
  assert.equal(status, 429)
  assert.equal(payload.code, 'AI_DAILY_LIMIT')
  assert.equal(environment.AI.calls.length, 1)
})

await test('3040 capacity → one retry, then one free fallback; every call charged', async () => {
  const environment = env({ AI: ai(() => { throw aiError(3040, 'Capacity temporarily exceeded, please try again.') }) })
  const { status, payload } = await ask(environment)
  assert.equal(status, 503)
  assert.equal(payload.code, 'AI_OVERLOADED')
  assert.deepEqual(environment.AI.calls.map(call => call.model), [GLM, GLM, GEMMA])
  assert.equal(environment.CHEMAI_BUDGET.costs.filter(([id]) => id === 'budget:chat-neurons').length, 3)
})

await test('5035 paid plan required / 5007 no such model → free fallback answers', async () => {
  for (const code of [5035, 5007]) {
    const environment = env({ AI: ai(model => {
      if (model === GLM) throw aiError(code, 'unavailable')
      return completion('Gemma trả lời.')
    }) })
    const { status, payload } = await ask(environment)
    assert.equal(status, 200)
    assert.equal(payload.meta.model, GEMMA)
    assert.equal(payload.meta.fallbackUsed, true)
    assert.equal(environment.AI.calls.length, 2)
  }
})

await test('retry stops when the budget cannot pay for it', async () => {
  const probe = env()
  await ask(probe)
  const [, cost] = probe.CHEMAI_BUDGET.costs.find(([id]) => id === 'budget:chat-neurons')
  const environment = env({ AI: ai(() => { throw aiError(3040, 'Capacity temporarily exceeded') }) })
  environment.CHEMAI_DAILY_NEURONS = String(cost * 2 - 1) // the first call fits, the retry does not
  const { payload } = await ask(environment)
  assert.equal(payload.code, 'AI_OVERLOADED')
  assert.equal(environment.AI.calls.length, 1)
})

await test('timeout → AI_TIMEOUT after one call (no retry)', async () => {
  const environment = env({ CHEMAI_TIMEOUT_MS: '30', AI: ai(() => new Promise(() => {})) })
  const { status, payload } = await ask(environment)
  assert.equal(status, 502)
  assert.equal(payload.code, 'AI_TIMEOUT')
  assert.equal(environment.AI.calls.length, 1)
})

await test('output shapes: JSON-wrapped, <think> block, legacy response field, empty, truncated', async () => {
  const cases = [
    [completion('```json\n{"answer":"Fe + 2HCl → FeCl₂ + H₂"}\n```'), 'Fe + 2HCl → FeCl₂ + H₂'],
    [completion('<think>nháp</think>\nKết quả: 0,1 mol.'), 'Kết quả: 0,1 mol.'],
    [{ response: 'Dạng cũ vẫn đọc được.' }, 'Dạng cũ vẫn đọc được.']
  ]
  for (const [result, expected] of cases) {
    const { status, payload } = await ask(env({ AI: ai(() => result) }))
    assert.equal(status, 200)
    assert.equal(payload.answer, expected)
  }
  const empty = await ask(env({ AI: ai(() => completion('')) }))
  assert.deepEqual([empty.status, empty.payload.code], [502, 'AI_INCOMPLETE'])
  const cut = await ask(env({ AI: ai(() => completion('Bước 1…', { finish: 'length' })) }))
  assert.match(cut.payload.answer, /chưa hoàn chỉnh do vượt giới hạn độ dài/)
})

await test('concurrency: 8 at once → 6 enter (2 AI_BUSY), budget pays exactly 3 model calls', async () => {
  const probe = env()
  await ask(probe)
  const [, cost] = probe.CHEMAI_BUDGET.costs.find(([id]) => id === 'budget:chat-neurons')
  let release
  const gate = new Promise(resolve => { release = resolve })
  const environment = env({ CHEMAI_DAILY_NEURONS: String(cost * 3 + cost - 1), AI: ai(async () => { await gate; return completion('ok', { usage: null }) }) })
  const pending = Array.from({ length: 8 }, () => ask(environment))
  await new Promise(resolve => setTimeout(resolve, 20))
  release()
  const results = await Promise.all(pending)
  const count = code => results.filter(item => (item.payload.code || 200) === code).length
  assert.deepEqual([count(200), count('AI_BUDGET_LIMITED'), count('AI_BUSY')], [3, 3, 2])
  assert.equal(environment.AI.calls.length, 3)
})

await test('duplicate: the same question from the same client while it is running → 409', async () => {
  let release
  const gate = new Promise(resolve => { release = resolve })
  const environment = env({ AI: ai(async () => { await gate; return completion('ok') }) })
  const ip = nextIp()
  const first = ask(environment, { message: 'Cân bằng Fe + O2' }, ip)
  await new Promise(resolve => setTimeout(resolve, 10))
  const second = await ask(environment, { message: 'Cân bằng Fe + O2' }, ip)
  release()
  assert.equal(second.status, 409)
  assert.equal(second.payload.code, 'DUPLICATE_REQUEST')
  assert.equal((await first).status, 200)
  assert.equal(environment.AI.calls.length, 1)
})

await test('error classification covers documented codes', () => {
  assert.equal(classifyWorkersAIError(aiError(3036, 'x')).kind, 'daily_limit')
  assert.equal(classifyWorkersAIError(new Error('Capacity temporarily exceeded')).kind, 'capacity')
  assert.equal(classifyWorkersAIError(aiError(3042, 'The model name is invalid')).kind, 'model_missing')
  assert.equal(classifyWorkersAIError(new Error('This model requires a Workers Paid plan.')).kind, 'paid_required')
  assert.equal(classifyWorkersAIError(aiError(3006, 'Request is too large')).kind, 'too_large')
})

await test('structured log: no question text, no IP, no key', async () => {
  const lines = []
  const environment = env()
  const originalLog = console.log
  console.log = line => lines.push(String(line))
  await ask(environment, { message: 'Câu hỏi riêng tư của học sinh' }, '203.0.113.77')
  console.log = originalLog
  const line = lines.find(item => item.includes('chemai.chat'))
  const entry = JSON.parse(line)
  assert.equal(entry.provider, 'workers_ai')
  assert.ok(Number.isInteger(entry.neuronsReserved))
  assert.ok(!/riêng tư|203\.0\.113\.77|present-but-unused/.test(line), line)
})

await test('Preview and Production share one namespace but not counters; refunds go to the right one', async () => {
  const shared = budget()
  const usage = { prompt_tokens: 1000, completion_tokens: 200 }
  const production = env({ CHEMAI_BUDGET: shared, AI: ai(() => completion('ok', { usage })) })
  const preview = env({ CHEMAI_BUDGET: shared, CHEMAI_BUDGET_SCOPE: 'preview', CHEMAI_DAILY_NEURONS: '2000', AI: ai(() => completion('ok', { usage })) })
  await ask(production)
  await ask(preview)
  await ask(preview, { message: 'Câu thứ hai' })
  const one = actualNeurons(GLM, usage)
  assert.equal(shared.used('chat-neurons'), one, 'production counter')
  assert.equal(shared.used('preview:chat-neurons'), one * 2, 'preview counter, refunded to actual')
  const invalid = env({ CHEMAI_BUDGET_SCOPE: 'Preview Env!' })
  assert.equal((await ask(invalid)).payload.code, 'AI_BUDGET_NOT_CONFIGURED', 'a malformed scope fails closed')
  assert.equal(invalid.AI.calls.length, 0)
})

await test('cut off mid-answer by hidden reasoning: visible note, measured log, refund to usage', async () => {
  const lines = []
  const usage = { prompt_tokens: 1400, completion_tokens: MAX_OUTPUT_TOKENS, completion_tokens_details: { reasoning_tokens: 1700 } }
  const environment = env({ AI: ai(() => ({
    choices: [{ message: { role: 'assistant', content: '**3Fe + 2O₂ → Fe₃O₄**\n\n1. Cân bằng oxygen:', reasoning_content: 'x'.repeat(5000) }, finish_reason: 'length' }],
    usage
  })) })
  const originalLog = console.log
  console.log = line => lines.push(String(line))
  const { status, payload } = await ask(environment, { message: 'Hãy cân bằng phương trình Fe + O₂ → Fe₃O₄ và giải thích từng bước.' })
  console.log = originalLog
  assert.equal(status, 200)
  assert.match(payload.answer, /^\*\*3Fe \+ 2O₂ → Fe₃O₄\*\*/)
  assert.match(payload.answer, /chưa hoàn chỉnh do vượt giới hạn độ dài/)
  assert.doesNotMatch(payload.answer, /xxxx/, 'reasoning text is never shown')
  const entry = JSON.parse(lines.find(item => item.includes('chemai.chat')))
  assert.deepEqual([entry.finishReason, entry.completionTokens, entry.reasoningTokens, entry.reasoningChars], ['length', MAX_OUTPUT_TOKENS, 1700, 5000])
  assert.equal(entry.answerChars, '**3Fe + 2O₂ → Fe₃O₄**\n\n1. Cân bằng oxygen:'.length)
  assert.equal(environment.CHEMAI_BUDGET.used('chat-neurons'), actualNeurons(GLM, usage))
})

await test('a complete multi-step answer is passed through untouched; gemma gets no GLM-only options', async () => {
  const long = Array.from({ length: 12 }, (_, index) => `${index + 1}. Bước ${index + 1}: n = m / M = 5,6 / 56 = 0,1 mol.`).join('\n')
  const environment = env({ CHEMAI_MODEL: GEMMA, AI: ai(() => completion(long, { finish: 'stop' })) })
  const { payload } = await ask(environment)
  assert.equal(payload.answer, long)
  assert.equal('chat_template_kwargs' in environment.AI.calls[0].inputs, false)
})

await test('Gemini is never called on the default path', () => {
  assert.equal(geminiCalls, 0)
})

console.log(`PASS — ${passed} ChemAI Workers AI checks passed.`)
