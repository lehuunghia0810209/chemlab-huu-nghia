// Cloudflare Workers AI provider for ChemAI (binding env.AI).
// Workers Free: 10,000 Neurons per day per account, shared by every project;
// past it Workers AI answers 429 (code 3036) until 00:00 UTC.

// Neurons per million tokens, from developers.cloudflare.com/workers-ai/platform/pricing
// (checked 2026-10-21). Only models NOT on the "requires a paid billing method"
// list may be added here: the server refuses any model outside this table, so a
// configuration mistake can never select a paid model.
export const WORKERS_AI_MODELS = Object.freeze({
  // GLM reasons before answering by default; hidden reasoning tokens used up the
  // whole output budget and cut answers short (Preview, 2026-10-21). The GLM chat
  // template's enable_thinking switch turns it off. Not documented by Cloudflare:
  // verify on Preview through the reasoningTokens/reasoningChars log fields.
  '@cf/zai-org/glm-4.7-flash': Object.freeze({ input: 5500, output: 36400, options: Object.freeze({ chat_template_kwargs: { enable_thinking: false } }) }),
  '@cf/google/gemma-4-26b-a4b-it': Object.freeze({ input: 9091, output: 27273 })
})
export const DEFAULT_WORKERS_AI_MODEL = '@cf/zai-org/glm-4.7-flash'
export const DEFAULT_WORKERS_AI_FALLBACK = '@cf/google/gemma-4-26b-a4b-it'
// Same ceiling as the Gemini path (1800). Reasoning tokens count too. The Neuron
// reservation (estimateNeurons) uses this value, and the refund settles to `usage`.
export const MAX_OUTPUT_TOKENS = 1800
export const WORKERS_AI_TIMEOUT_MS = 30_000

export function workersAIModels(env) {
  const primary = String(env?.CHEMAI_MODEL || DEFAULT_WORKERS_AI_MODEL)
  const requested = String(env?.CHEMAI_FALLBACK_MODEL ?? DEFAULT_WORKERS_AI_FALLBACK)
  if (!Object.hasOwn(WORKERS_AI_MODELS, primary)) return { primary, fallback: null, allowed: false }
  const fallback = requested !== primary && Object.hasOwn(WORKERS_AI_MODELS, requested) ? requested : null
  return { primary, fallback, allowed: true }
}

export function workersAIConfigured(env) {
  return typeof env?.AI?.run === 'function'
}

// Upper bound for one call, charged before the call. shortcut: ~2 characters per
// token over-estimates Vietnamese text; the difference is refunded from `usage`.
export function estimateNeurons(model, inputChars, maxOutput = MAX_OUTPUT_TOKENS) {
  const price = WORKERS_AI_MODELS[model]
  return Math.ceil((Math.ceil(inputChars / 2) * price.input + maxOutput * price.output) / 1e6)
}

export function actualNeurons(model, usage) {
  const input = Number(usage?.prompt_tokens)
  const output = Number(usage?.completion_tokens)
  if (!Number.isFinite(input) || !Number.isFinite(output)) return null
  const price = WORKERS_AI_MODELS[model]
  return Math.ceil((input * price.input + output * price.output) / 1e6)
}

// Error codes: developers.cloudflare.com/workers-ai/platform/errors
const KINDS = {
  3036: 'daily_limit',
  3040: 'capacity',
  5007: 'model_missing',
  3042: 'model_missing',
  5035: 'paid_required',
  5018: 'model_forbidden',
  3041: 'model_forbidden',
  3023: 'account_blocked',
  3006: 'too_large',
  3007: 'timeout',
  3008: 'timeout'
}

export function classifyWorkersAIError(error) {
  if (error?.name === 'TimeoutError') return { kind: 'timeout', code: null }
  const text = String(error?.message || error || '')
  const code = Number(/\b(3\d{3}|5\d{3})\b/.exec(text)?.[1]) || null
  if (code && KINDS[code]) return { kind: KINDS[code], code }
  if (/daily free allocation|neurons/i.test(text)) return { kind: 'daily_limit', code }
  if (/capacity/i.test(text)) return { kind: 'capacity', code }
  if (/no such model|model name is invalid/i.test(text)) return { kind: 'model_missing', code }
  if (/paid plan/i.test(text)) return { kind: 'paid_required', code }
  return { kind: 'unknown', code }
}

export async function runWorkersAI(env, { model, messages, timeoutMs = WORKERS_AI_TIMEOUT_MS }) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(Object.assign(new Error('Workers AI timeout'), { name: 'TimeoutError' })), timeoutMs)
  })
  try {
    return await Promise.race([
      env.AI.run(model, { messages, max_completion_tokens: MAX_OUTPUT_TOKENS, temperature: 0.3, ...WORKERS_AI_MODELS[model].options }),
      timeout
    ])
  }
  finally {
    clearTimeout(timer)
  }
}

// Chat-completions shape (choices[0].message.content), or the older `response`.
export function extractWorkersAIText(result) {
  const content = result?.choices?.[0]?.message?.content ?? result?.response
  const value = Array.isArray(content)
    ? content.map(part => typeof part === 'string' ? part : part?.text || '').join('')
    : content
  return String(value ?? '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .trim()
}

// The answer should be Markdown. A model that still wraps it as JSON is unwrapped.
export function workersAIAnswer(textValue) {
  const cleaned = String(textValue || '').trim().replace(/^```(?:json|markdown|md)?\s*/i, '').replace(/\s*```$/, '').trim()
  if (cleaned.startsWith('{')) {
    try {
      const parsed = JSON.parse(cleaned)
      if (typeof parsed?.answer === 'string') return parsed.answer.trim()
    }
    catch {
    }
  }
  return String(textValue || '').trim()
}

// Daily per-client key. CF-Connecting-IP is set by Cloudflare's edge (clients
// cannot forge it there); IPv6 clients are grouped by /64 so address rotation
// inside one allocation does not multiply the allowance.
export function dailyClientKey(ip) {
  if (!ip.includes(':')) return ip
  const [head, tail = ''] = ip.split('::')
  const left = head ? head.split(':') : []
  const right = tail ? tail.split(':') : []
  const groups = ip.includes('::') ? [...left, ...Array(Math.max(0, 8 - left.length - right.length)).fill('0'), ...right] : left
  return `${groups.slice(0, 4).map(group => group.padStart(4, '0')).join(':')}::/64`
}

// Measurements for the log: where the output tokens went (no text is logged).
export function usageDetails(result) {
  const usage = result?.usage || {}
  const message = result?.choices?.[0]?.message || {}
  const reasoning = message.reasoning_content ?? message.reasoning
  return {
    promptTokens: usage.prompt_tokens ?? null,
    completionTokens: usage.completion_tokens ?? null,
    reasoningTokens: usage.completion_tokens_details?.reasoning_tokens ?? null,
    reasoningChars: typeof reasoning === 'string' ? reasoning.length : 0
  }
}
