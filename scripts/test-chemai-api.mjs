import assert from 'node:assert/strict'

import {
  onRequestGet,
  onRequestPost
} from '../functions/api/chat.js'

import {
  retrieveChemKnowledge
} from '../functions/api/_knowledge.js'

const origin = 'https://chemlab.example'

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
assert.equal(statusPayload.provider, 'Gemini')
assert.equal(statusPayload.release, '6.2.0')

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
  env: { GEMINI_API_KEY: 'test-only-key' }
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
      GEMINI_API_KEY: 'test-only-key',
      GEMINI_MODEL: 'gemini-3.8-flash',
      GEMINI_THINKING_LEVEL: 'low'
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
  assert.match(upstreamHeaders['x-goog-api-client'], /chemlab\/6\.2\.0/)
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

let resilienceCallCount = 0
const resilienceUrls = []

globalThis.fetch = async (url) => {
  resilienceCallCount += 1
  resilienceUrls.push(String(url))

  if (resilienceCallCount <= 2) {
    return new Response(
      JSON.stringify({
        error: {
          code: 503,
          status: 'UNAVAILABLE',
          message: 'This model is currently experiencing high demand.'
        }
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

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
      modelVersion: 'gemini-3.7-flash'
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

try {
  const fallbackResponse = await onRequestPost({
    request: makeRequest(
      { message: 'H2O là gì?' },
      { 'CF-Connecting-IP': '203.0.113.20' }
    ),
    env: {
      GEMINI_API_KEY: 'test-only-key',
      GEMINI_MODEL: 'gemini-3.8-flash',
      GEMINI_THINKING_LEVEL: 'low'
    }
  })

  const fallbackPayload = await fallbackResponse.json()
  assert.equal(fallbackResponse.status, 200)
  assert.equal(fallbackPayload.ok, true)
  assert.equal(fallbackPayload.meta.fallbackUsed, true)
  assert.equal(fallbackPayload.meta.attempts, 3)
  assert.equal(fallbackPayload.meta.model, 'gemini-3.7-flash')
  assert.equal(resilienceCallCount, 3)
  assert.match(resilienceUrls[0], /gemini-3\.8-flash:generateContent/)
  assert.match(resilienceUrls[1], /gemini-3\.8-flash:generateContent/)
  assert.match(resilienceUrls[2], /gemini-3\.7-flash:generateContent/)
}
finally {
  globalThis.fetch = originalFetch
}

console.log('\nPASS — ChemAI Gemini API mock tests passed.\n')
