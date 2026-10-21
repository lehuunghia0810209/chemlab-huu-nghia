import assert from 'node:assert/strict'
import { APP_VERSION } from '../src/appMeta.js'

import {
  onRequestGet,
  onRequestPost
} from '../functions/api/chat.js'

import {
  retrieveChemKnowledge
} from '../functions/api/_knowledge.js'

const origin = 'https://chemlab.example'

// Durable Object budget mock: an exact, synchronous counter (limit = Infinity by default).
function budget(limit = Infinity) {
  let used = 0
  return {
    calls: 0,
    idFromName: name => name,
    get() {
      const namespace = this
      return {
        async fetch() {
          namespace.calls += 1
          const allowed = used < limit
          if (allowed) used += 1
          return Response.json({ allowed, used })
        }
      }
    }
  }
}

function makeRequest(body, extraHeaders = {}) {
  return new Request(`${origin}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': origin,
      'CF-Connecting-IP': '203.0.113.10',
      ...extraHeaders
    },
    body: JSON.stringify(body)
  })
}

const knowledge = retrieveChemKnowledge(
  'Fe và HCl tác dụng như thế nào?',
  { view: 'lab', element: { symbol: 'Fe', name: 'Iron' } }
)

assert.ok(Array.isArray(knowledge.elements))
assert.ok(Array.isArray(knowledge.chemicals))
assert.ok(Array.isArray(knowledge.reactions))
assert.ok(Array.isArray(knowledge.lessons))
assert.ok(
  knowledge.elements.length +
  knowledge.chemicals.length +
  knowledge.reactions.length +
  knowledge.lessons.length > 0,
  'Knowledge retrieval phải tìm thấy dữ liệu ChemLab liên quan.'
)
assert.ok(
  knowledge.elements.some(item => item.symbol === 'Fe'),
  'Knowledge retrieval phải tìm thấy nguyên tố Fe.'
)

const statusResponse = onRequestGet({
  env: {}
})
const statusPayload = await statusResponse.json()
assert.equal(statusResponse.status, 200)
assert.equal(statusPayload.configured, false)
assert.equal(statusPayload.provider, 'Workers AI')
assert.equal(statusPayload.release, APP_VERSION)

const noKeyResponse = await onRequestPost({
  request: makeRequest({ message: 'Giải thích H2O' }),
  env: {}
})
const noKeyPayload = await noKeyResponse.json()
assert.equal(noKeyResponse.status, 503)
assert.equal(noKeyPayload.code, 'AI_NOT_CONFIGURED')

const badOriginRequest = new Request(`${origin}/api/chat`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Origin': 'https://attacker.example',
    'CF-Connecting-IP': '203.0.113.11'
  },
  body: JSON.stringify({ message: 'test' })
})
const badOriginResponse = await onRequestPost({
  request: badOriginRequest,
  env: { CHEMAI_PROVIDER: 'gemini', GEMINI_API_KEY: 'test-only-key' }
})
assert.equal(badOriginResponse.status, 403)

const originalFetch = globalThis.fetch
let upstreamUrl = null
let upstreamHeaders = null
let upstreamBody = null

globalThis.fetch = async (url, options) => {
  upstreamUrl = String(url)
  upstreamHeaders = options.headers
  upstreamBody = JSON.parse(options.body)

  return new Response(
    JSON.stringify({
      candidates: [
        {
          content: {
            role: 'model',
            parts: [
              {
                text: JSON.stringify({
                  answer: 'HCl + NaOH → NaCl + H₂O. Đây là phản ứng trung hòa.',
                  actions: [
                    { type: 'open_tool', target: 'reaction', label: 'Mở Reaction Studio' },
                    { type: 'navigate', target: 'lab', label: 'Mở phòng thí nghiệm' },
                    { type: 'open_tool', target: 'not-allowed', label: 'Không hợp lệ' }
                  ],
                  suggestions: [
                    'Vì sao đây là phản ứng trung hòa?',
                    'Viết phương trình ion rút gọn',
                    'Thử trong Virtual Lab',
                    'Gợi ý thừa phải bị cắt'
                  ]
                })
              }
            ]
          },
          finishReason: 'STOP'
        }
      ],
      usageMetadata: {
        promptTokenCount: 200,
        candidatesTokenCount: 80,
        totalTokenCount: 280
      },
      modelVersion: 'gemini-3.8-flash'
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

try {
  const successResponse = await onRequestPost({
    request: makeRequest({
      message: 'HCl + NaOH có hiện tượng gì?',
      history: [
        { role: 'user', content: 'Tôi đang học acid-base.' }
      ],
      context: {
        view: 'lab',
        tool: null,
        visibleText: 'Virtual Lab HCl NaOH'
      }
    }, {
      'CF-Connecting-IP': '203.0.113.12'
    }),
    env: {
      CHEMAI_PROVIDER: 'gemini', GEMINI_API_KEY: 'test-only-key',
      GEMINI_MODEL: 'gemini-3.8-flash',
      GEMINI_THINKING_LEVEL: 'low',
      CHEMAI_BUDGET: budget()
    }
  })

  const successPayload = await successResponse.json()

  assert.equal(successResponse.status, 200)
  assert.equal(successPayload.ok, true)
  assert.match(successPayload.answer, /HCl \+ NaOH/)
  assert.equal(successPayload.actions.length, 2)
  assert.equal(successPayload.actions[0].target, 'reaction')
  assert.equal(successPayload.actions[1].target, 'lab')
  assert.equal(successPayload.suggestions.length, 3)
  assert.equal(successPayload.meta.provider, 'Gemini')
  assert.equal(successPayload.meta.model, 'gemini-3.8-flash')
  assert.ok('groundedElements' in successPayload.meta)

  assert.match(upstreamUrl, /generativelanguage\.googleapis\.com\/v1beta\/models\/gemini-3\.8-flash:generateContent/)
  assert.equal(upstreamHeaders['x-goog-api-key'], 'test-only-key')
  assert.equal(upstreamHeaders['x-goog-api-client'], `chemlab/${APP_VERSION}`)
  assert.equal(upstreamBody.generationConfig.responseMimeType, 'application/json')
  assert.equal(upstreamBody.generationConfig.thinkingConfig.thinkingLevel, 'low')
  assert.equal(upstreamBody.generationConfig.maxOutputTokens, 1800)
  assert.match(upstreamBody.system_instruction.parts[0].text, /tiếng Việt/)
  assert.match(upstreamBody.system_instruction.parts[0].text, /công thức hóa học/)
  assert.match(upstreamBody.contents[0].parts[0].text, /CHEMLAB CONTEXT/)
  assert.match(upstreamBody.contents[0].parts[0].text, /CHEMLAB KNOWLEDGE/)
  assert.match(upstreamBody.contents[0].parts[0].text, /LỊCH SỬ GẦN NHẤT/)
}
finally {
  globalThis.fetch = originalFetch
}

function geminiSuccess(model = 'gemini-3.6-flash') {
  return new Response(
    JSON.stringify({
      candidates: [{
        content: {
          role: 'model',
          parts: [{
            text: JSON.stringify({
              answer: 'H₂O là nước, gồm hai nguyên tử H và một nguyên tử O.',
              actions: [],
              suggestions: ['Vì sao H₂O phân cực?']
            })
          }]
        },
        finishReason: 'STOP'
      }],
      modelVersion: model
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

function geminiError(status, providerCode, message, extraHeaders = {}) {
  return new Response(
    JSON.stringify({
      error: {
        code: status,
        status: providerCode,
        message
      }
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...extraHeaders
      }
    }
  )
}

let scenarioIp = 20

async function requestWithMock(fetchMock, env = {}) {
  globalThis.fetch = fetchMock
  scenarioIp += 1

  try {
    const response = await onRequestPost({
      request: makeRequest(
        { message: 'H2O là gì?' },
        { 'CF-Connecting-IP': `203.0.113.${scenarioIp}` }
      ),
      env: {
        CHEMAI_PROVIDER: 'gemini', GEMINI_API_KEY: 'test-only-key',
        GEMINI_MODEL: 'gemini-3.8-flash',
        GEMINI_THINKING_LEVEL: 'low',
        CHEMAI_BUDGET: budget(),
        ...env
      }
    })

    return { response, payload: await response.json() }
  }
  finally {
    globalThis.fetch = originalFetch
  }
}

const modelFallbackUrls = []
const modelFallback = await requestWithMock(async (url) => {
  modelFallbackUrls.push(String(url))

  return modelFallbackUrls.length === 1
    ? geminiError(
        404,
        'NOT_FOUND',
        'models/gemini-3.8-flash is not found for API version v1beta, or is not supported for generateContent.'
      )
    : geminiSuccess()
}, {
  GEMINI_FALLBACK_MODELS: 'gemini-3.8-flash, gemini-3.6-flash, gemini-3.6-flash'
})

assert.equal(modelFallback.response.status, 200)
assert.equal(modelFallback.payload.ok, true)
assert.equal(modelFallback.payload.meta.fallbackUsed, true)
assert.equal(modelFallback.payload.meta.attempts, 2)
assert.equal(modelFallback.payload.meta.model, 'gemini-3.6-flash')
assert.equal(modelFallbackUrls.length, 2)
assert.match(modelFallbackUrls[0], /gemini-3\.8-flash:generateContent/)
assert.match(modelFallbackUrls[1], /gemini-3\.6-flash:generateContent/)

let endpoint404Calls = 0
const endpoint404 = await requestWithMock(async () => {
  endpoint404Calls += 1
  return geminiError(404, 'NOT_FOUND', 'Requested endpoint was not found.')
})

assert.equal(endpoint404.response.status, 502)
assert.equal(endpoint404.payload.code, 'AI_UPSTREAM_ERROR')
assert.equal(endpoint404.payload.upstreamCode, 'NOT_FOUND')
assert.equal(endpoint404.payload.attempts, 1)
assert.equal(endpoint404Calls, 1)

let transientCalls = 0
const transientUrls = []
const transientFallback = await requestWithMock(async (url) => {
  transientCalls += 1
  transientUrls.push(String(url))

  return transientCalls <= 2
    ? geminiError(
        503,
        'UNAVAILABLE',
        'This model is currently experiencing high demand.',
        { 'Retry-After': '0' }
      )
    : geminiSuccess()
})

assert.equal(transientFallback.response.status, 200)
assert.equal(transientFallback.payload.meta.fallbackUsed, true)
assert.equal(transientFallback.payload.meta.attempts, 3)
assert.equal(transientCalls, 3)
assert.match(transientUrls[0], /gemini-3\.8-flash:generateContent/)
assert.match(transientUrls[1], /gemini-3\.8-flash:generateContent/)
assert.match(transientUrls[2], /gemini-3\.6-flash:generateContent/)

let rateLimitCalls = 0
const rateLimit = await requestWithMock(async () => {
  rateLimitCalls += 1
  return geminiError(
    429,
    'RATE_LIMIT_EXCEEDED',
    'Too many requests.',
    { 'Retry-After': '0' }
  )
})

assert.equal(rateLimit.response.status, 429)
assert.equal(rateLimit.payload.code, 'RATE_LIMITED')
assert.equal(rateLimit.payload.attempts, 2)
assert.equal(rateLimit.payload.fallbackUsed, false)
assert.equal(rateLimitCalls, 2)

let longRetryAfterCalls = 0
const longRetryAfter = await requestWithMock(async () => {
  longRetryAfterCalls += 1
  return geminiError(
    429,
    'RATE_LIMIT_EXCEEDED',
    'Retry later.',
    { 'Retry-After': '60' }
  )
})

assert.equal(longRetryAfter.response.status, 429)
assert.equal(longRetryAfter.payload.code, 'RATE_LIMITED')
assert.equal(longRetryAfter.payload.attempts, 1)
assert.equal(longRetryAfterCalls, 1)

let quotaCalls = 0
const quota = await requestWithMock(async () => {
  quotaCalls += 1
  return new Response(
    JSON.stringify({
      error: {
        code: 'quota_exceeded',
        message: 'Daily quota exhausted.'
      }
    }),
    {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    }
  )
})

assert.equal(quota.response.status, 429)
assert.equal(quota.payload.code, 'RATE_LIMITED')
assert.match(quota.payload.message, /hết hạn mức/)
assert.equal(quota.payload.attempts, 1)
assert.equal(quotaCalls, 1)

let badRequestCalls = 0
const badRequest = await requestWithMock(async () => {
  badRequestCalls += 1
  return geminiError(400, 'INVALID_ARGUMENT', 'Invalid request payload.')
})

assert.equal(badRequest.response.status, 502)
assert.equal(badRequest.payload.code, 'GEMINI_BAD_REQUEST')
assert.equal(badRequestCalls, 1)

for (const authStatus of [401, 403]) {
  let authCalls = 0
  const authFailure = await requestWithMock(async () => {
    authCalls += 1
    return geminiError(authStatus, 'PERMISSION_DENIED', 'Credentials rejected.')
  })

  assert.equal(authFailure.response.status, 502)
  assert.equal(authFailure.payload.code, 'GEMINI_AUTH_FAILED')
  assert.equal(authCalls, 1)
}

let exhaustedCalls = 0
const exhaustedFallback = await requestWithMock(async (url) => {
  exhaustedCalls += 1
  const model = String(url).includes('gemini-3.8-flash')
    ? 'gemini-3.8-flash'
    : 'gemini-3.6-flash'

  return geminiError(
    404,
    'NOT_FOUND',
    `models/${model} is not found for API version v1beta, or is not supported for generateContent.`
  )
})

assert.equal(exhaustedFallback.response.status, 502)
assert.equal(exhaustedFallback.payload.code, 'GEMINI_MODEL_UNAVAILABLE')
assert.equal(exhaustedFallback.payload.attempts, 2)
assert.equal(exhaustedFallback.payload.fallbackUsed, true)
assert.equal(exhaustedCalls, 2)

let networkCalls = 0
const networkRecovery = await requestWithMock(async () => {
  networkCalls += 1
  if (networkCalls === 1) throw new TypeError('fetch failed')
  return geminiSuccess('gemini-3.8-flash')
})

assert.equal(networkRecovery.response.status, 200)
assert.equal(networkRecovery.payload.meta.attempts, 2)
assert.equal(networkRecovery.payload.meta.fallbackUsed, false)
assert.equal(networkCalls, 2)

let timeoutCalls = 0
const networkTimeout = await requestWithMock(async () => {
  timeoutCalls += 1
  throw new DOMException('Upstream timed out.', 'AbortError')
})

assert.equal(networkTimeout.response.status, 502)
assert.equal(networkTimeout.payload.code, 'AI_TIMEOUT')
assert.equal(timeoutCalls, 3)

/* Account prerequisites (400 FAILED_PRECONDITION): one call, no retry, no fallback, own code. */
for (const [upstreamMessage, reason] of [
  ['User location is not supported for the API use.', 'REGION_NOT_SUPPORTED'], // verbatim from production, 2026-10-21
  ['User location is not supported for the API use without a billing account linked.', 'REGION_NOT_SUPPORTED'],
  ['Gemini API free tier is not available in your country. Please enable billing on your project in Google AI Studio.', 'REGION_NOT_SUPPORTED'],
  ['Billing is disabled for this project.', 'BILLING_REQUIRED'],
  ['Precondition check failed.', 'ACCOUNT_PRECONDITION']
]) {
  let calls = 0
  const result = await requestWithMock(async () => {
    calls += 1
    return geminiError(400, 'FAILED_PRECONDITION', upstreamMessage)
  }, { GEMINI_FALLBACK_MODELS: 'gemini-3.6-flash' })
  assert.equal(result.response.status, 503)
  assert.equal(result.payload.code, 'GEMINI_PRECONDITION_FAILED')
  assert.equal(result.payload.reason, reason, upstreamMessage)
  assert.equal(result.payload.attempts, 1)
  assert.equal(result.payload.fallbackUsed, false)
  assert.ok(result.payload.requestId)
  assert.ok(!result.payload.message.includes('billing') && !result.payload.message.includes('GEMINI'), 'no backend detail shown to learners')
  assert.equal(calls, 1)
}

/* Logs: structured, correlated by requestId, without key, IP or conversation text. */
{
  const logged = []
  const originalError = console.error
  console.error = (...items) => logged.push(items.join(' '))
  let result
  try {
    result = await requestWithMock(async () => geminiError(400, 'FAILED_PRECONDITION', 'Region blocked for key=AIzaSyTESTONLY1234567890abcd.'))
  }
  finally {
    console.error = originalError
  }
  const line = logged.find(item => item.includes('chemai.chat'))
  assert.ok(line, 'one structured log line')
  const entry = JSON.parse(line)
  assert.equal(entry.requestId, result.payload.requestId)
  assert.equal(entry.upstreamStatus, 400)
  assert.equal(entry.upstreamCode, 'FAILED_PRECONDITION')
  assert.equal(entry.model, 'gemini-3.8-flash')
  assert.equal(entry.apiVersion, 'v1beta')
  assert.equal(entry.attempts, 1)
  assert.equal(entry.budgetUnits, 1)
  assert.ok(Number.isFinite(entry.durationMs))
  assert.ok(!line.includes('AIza') && !line.includes('test-only-key') && !line.includes('H2O là gì') && !line.includes('203.0.113'), line)
}

/* P1 fail-open: no budget binding → zero upstream calls. */
for (const [label, env] of [
  ['no budget binding', {}],
  ['rate limiter only', { CHEMAI_LIMITER: { async limit() { return { success: true } } } }],
  ['KV without explicit acceptance', { CHEMAI_QUOTA: { async get() { return null }, async put() {} } }]
]) {
  let calls = 0
  globalThis.fetch = async () => { calls += 1; return geminiSuccess() }
  try {
    const response = await onRequestPost({ request: makeRequest({ message: 'H2O là gì?' }, { 'CF-Connecting-IP': '203.0.113.240' }), env: { CHEMAI_PROVIDER: 'gemini', GEMINI_API_KEY: 'test-only-key', ...env } })
    assert.equal(response.status, 503, label)
    assert.equal((await response.json()).code, 'AI_BUDGET_NOT_CONFIGURED', label)
    assert.equal(calls, 0, label)
  }
  finally {
    globalThis.fetch = originalFetch
  }
}

/* Input is validated before the budget is charged. */
{
  const charged = budget()
  globalThis.fetch = async () => { throw new Error('must not be called') }
  try {
    for (const [body, code] of [['{not json', 'INVALID_JSON'], [{ message: '   ' }, 'EMPTY_MESSAGE']]) {
      const response = await onRequestPost({
        request: new Request(`${origin}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin, 'CF-Connecting-IP': '203.0.113.241' }, body: typeof body === 'string' ? body : JSON.stringify(body) }),
        env: { CHEMAI_PROVIDER: 'gemini', GEMINI_API_KEY: 'test-only-key', CHEMAI_BUDGET: charged }
      })
      assert.equal(response.status, 400)
      assert.equal((await response.json()).code, code)
    }
    assert.equal(charged.calls, 0, 'invalid input costs no budget')
  }
  finally {
    globalThis.fetch = originalFetch
  }
}

/* Concurrent requests never exceed the budget: 8 at once, budget 3 → exactly 3 upstream calls. */
{
  const shared = budget(3)
  let calls = 0
  globalThis.fetch = async () => { calls += 1; return geminiSuccess() }
  try {
    const responses = await Promise.all(Array.from({ length: 8 }, (_, index) => onRequestPost({
      request: makeRequest({ message: 'H2O là gì?' }, { 'CF-Connecting-IP': `203.0.113.${242 + index}` }),
      env: { CHEMAI_PROVIDER: 'gemini', GEMINI_API_KEY: 'test-only-key', CHEMAI_BUDGET: shared }
    })))
    assert.equal(responses.filter(item => item.status === 200).length, 3)
    assert.equal(responses.filter(item => item.status === 429).length, 5)
    assert.equal(calls, 3)
  }
  finally {
    globalThis.fetch = originalFetch
  }
}

async function localRateResponse(ip, extraHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'Origin': origin,
    ...extraHeaders
  }
  if (ip !== null) headers['CF-Connecting-IP'] = ip

  return onRequestPost({
    request: new Request(`${origin}/api/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message: 'Kiểm tra giới hạn request' })
    }),
    env: {}
  })
}

const activeIps = await Promise.all(
  Array.from({ length: 32 }, (_, index) =>
    localRateResponse(`203.0.113.${index + 100}`)
  )
)
assert.ok(activeIps.every(response => response.status === 503))

const limitedIp = '192.0.2.200'
let limitedResponse
for (let index = 0; index < 19; index += 1) {
  limitedResponse = await localRateResponse(limitedIp)
}
assert.equal(limitedResponse.status, 429)
assert.ok(Number(limitedResponse.headers.get('Retry-After')) >= 1)

const concurrent = await Promise.all(
  Array.from({ length: 20 }, () => localRateResponse('192.0.2.201'))
)
assert.equal(concurrent.filter(response => response.status === 503).length, 18)
assert.equal(concurrent.filter(response => response.status === 429).length, 2)

let sharedResponse
for (let index = 0; index < 18; index += 1) {
  sharedResponse = await localRateResponse(null)
}
assert.equal(sharedResponse.status, 503)
assert.equal((await localRateResponse('not-an-ip')).status, 429)
assert.equal((await localRateResponse(null, { 'X-Forwarded-For': '198.51.100.90' })).status, 429)

const floodStatuses = []
for (let index = 0; index < 650; index += 1) {
  const response = await localRateResponse(
    `198.18.${Math.floor(index / 256)}.${index % 256}`
  )
  floodStatuses.push(response.status)
}
assert.ok(floodStatuses.includes(429))
assert.equal((await localRateResponse(limitedIp)).status, 429)

const originalNow = Date.now
let now = originalNow() + 61_000
Date.now = () => now

try {
  const resetIp = '192.0.2.202'
  for (let index = 0; index < 18; index += 1) {
    assert.equal((await localRateResponse(resetIp)).status, 503)
  }
  assert.equal((await localRateResponse(resetIp)).status, 429)

  now += 61_000
  assert.equal((await localRateResponse(resetIp)).status, 503)
}
finally {
  Date.now = originalNow
}

console.log('\nPASS — ChemAI Gemini API mock tests passed.\n')
