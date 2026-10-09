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
      id: 'interaction_test_62',
      model: 'gemini-3.8-flash',
      status: 'completed',
      steps: [
        {
          type: 'model_output',
          content: [
            {
              type: 'text',
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
        }
      ],
      usage: {
        total_input_tokens: 200,
        total_output_tokens: 80,
        total_tokens: 280
      }
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

  assert.match(upstreamUrl, /generativelanguage\.googleapis\.com\/v1\/interactions/)
  assert.equal(upstreamHeaders['x-goog-api-key'], 'test-only-key')
  assert.equal(upstreamBody.model, 'gemini-3.8-flash')
  assert.equal(upstreamBody.store, false)
  assert.equal(upstreamBody.stream, false)
  assert.equal(upstreamBody.response_format.type, 'text')
  assert.equal(upstreamBody.response_format.mime_type, 'application/json')
  assert.equal(upstreamBody.response_format.schema.type, 'object')
  assert.equal(upstreamBody.generation_config.thinking_level, 'low')
  assert.match(upstreamBody.system_instruction, /tiếng Việt/)
  assert.match(upstreamBody.system_instruction, /công thức hóa học/)
  assert.match(upstreamBody.input, /CHEMLAB CONTEXT/)
  assert.match(upstreamBody.input, /CHEMLAB KNOWLEDGE/)
  assert.match(upstreamBody.input, /LỊCH SỬ GẦN NHẤT/)
}
finally {
  globalThis.fetch = originalFetch
}

console.log('\nPASS — ChemAI Gemini API mock tests passed.\n')
