// Shared (cross-isolate) request/cost controls for ChemAI endpoints.
// In-memory Maps only limit bursts inside one Workers isolate. Optional
// bindings, configured by the project owner on Cloudflare:
//   CHEMAI_BUDGET  — Durable Object namespace (workers/chemai-quota): an EXACT
//                    per-day budget per scope. Preferred cost control.
//   CHEMAI_QUOTA   — KV namespace: an APPROXIMATE per-day budget (KV is
//                    eventually consistent; concurrent writes can be lost, so
//                    the budget can be overshot). Used only without CHEMAI_BUDGET.
//   CHEMAI_LIMITER — Workers Rate Limiting binding (per Cloudflare location,
//                    eventually consistent). Pages Functions do not list this
//                    binding type; kept for a Workers deployment.
// Errors from a configured binding fail closed, and so does a missing budget:
// without one, no endpoint may call Gemini (no unbounded cost).

export function sharedControls(env) {
  return {
    strictBudget: typeof env?.CHEMAI_BUDGET?.idFromName === 'function' && typeof env?.CHEMAI_BUDGET?.get === 'function',
    budget: typeof env?.CHEMAI_QUOTA?.get === 'function' && typeof env?.CHEMAI_QUOTA?.put === 'function',
    limiter: typeof env?.CHEMAI_LIMITER?.limit === 'function'
  }
}

// A cost budget is the exact Durable Object, or KV only when the owner
// explicitly accepts its approximate count. A rate limiter is not a budget.
export function costBudgetConfigured(env) {
  const controls = sharedControls(env)
  if (env?.CHEMAI_BUDGET_SCOPE !== undefined && !/^[a-z0-9-]{1,32}$/.test(env.CHEMAI_BUDGET_SCOPE)) return false
  return controls.strictBudget || (controls.budget && env?.CHEMAI_ACCEPT_APPROX_BUDGET === 'on')
}

// Preview and Production may bind the same Durable Object namespace; CHEMAI_BUDGET_SCOPE
// (e.g. "preview") keeps their counters apart. Unset = the production names.
function budgetName(env, scope) {
  return env?.CHEMAI_BUDGET_SCOPE ? `budget:${env.CHEMAI_BUDGET_SCOPE}:${scope}` : `budget:${scope}`
}

export function dailyLimit(env, scope, fallback) {
  const value = Number(env?.[`CHEMAI_DAILY_LIMIT_${scope.toUpperCase()}`] ?? env?.CHEMAI_DAILY_LIMIT)
  return Number.isInteger(value) && value > 0 ? value : fallback
}

export async function checkShared(env, { key, scope, limit, cost = 1, now = new Date() }) {
  const controls = sharedControls(env)
  if (controls.limiter) {
    try {
      const outcome = await env.CHEMAI_LIMITER.limit({ key: `${scope}:${key}` })
      if (!outcome?.success) return { allowed: false, code: 'RATE_LIMITED' }
    }
    catch {
      return { allowed: false, code: 'LIMITER_UNAVAILABLE' }
    }
  }
  return consumeBudget(env, { scope, limit, cost, now })
}

// One budget unit = one upstream Gemini call. Endpoints that retry call this
// again before every extra attempt, so retries cannot exceed the daily budget.
// cost > 1 charges several units at once (Workers AI: estimated Neurons).
export async function consumeBudget(env, { scope, limit, cost = 1, now = new Date(), day = now.toISOString().slice(0, 10) }) {
  const controls = sharedControls(env)
  if (controls.strictBudget) {
    try {
      const stub = env.CHEMAI_BUDGET.get(env.CHEMAI_BUDGET.idFromName(budgetName(env, scope)))
      const response = await stub.fetch('https://chemai-quota/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, limit, cost })
      })
      const outcome = response.ok ? await response.json() : null
      if (outcome?.allowed !== true) return { allowed: false, code: outcome ? 'DAILY_BUDGET_EXHAUSTED' : 'LIMITER_UNAVAILABLE' }
    }
    catch {
      return { allowed: false, code: 'LIMITER_UNAVAILABLE' }
    }
  }
  else if (costBudgetConfigured(env)) {
    const budgetKey = `${budgetName(env, scope)}:${day}`
    try {
      const used = Number(await env.CHEMAI_QUOTA.get(budgetKey)) || 0
      if (used + cost > limit) return { allowed: false, code: 'DAILY_BUDGET_EXHAUSTED' }
      await env.CHEMAI_QUOTA.put(budgetKey, String(used + cost), { expirationTtl: 2 * 86400 })
    }
    catch {
      return { allowed: false, code: 'LIMITER_UNAVAILABLE' }
    }
  }
  else return { allowed: false, code: 'BUDGET_NOT_CONFIGURED' }
  return { allowed: true, controls }
}

// A short fixed window (cooldown, per-minute cap) on the same exact counter. The deployed
// QuotaCounter only accepts a YYYY-MM-DD "day", so the window index is written in that shape.
// shortcut: fixed window, two requests can straddle a boundary; a sliding cooldown needs a QuotaCounter change and redeploy.
export function windowKey(seconds, now = Date.now()) {
  const index = String(Math.floor(now / 1000 / seconds) % 1e8).padStart(8, '0')
  return `${index.slice(0, 4)}-${index.slice(4, 6)}-${index.slice(6)}`
}

export async function consumeWindow(env, { scope, seconds, limit, now = Date.now() }) {
  const outcome = await consumeBudget(env, { scope, limit, day: windowKey(seconds, now) })
  return { ...outcome, retryAfter: seconds - Math.floor(now / 1000) % seconds }
}

// ---- Token budgets (exact Durable Object only) ----------------------------------------
// A bucket is { name, scope, limit, day }. Tokens are reserved before a provider call and
// the unused part is refunded afterwards, so concurrent requests can never overspend.
async function counter(env, path, bucket, body) {
  const stub = env.CHEMAI_BUDGET.get(env.CHEMAI_BUDGET.idFromName(budgetName(env, bucket.scope)))
  const response = await stub.fetch(`https://chemai-quota/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ day: bucket.day, ...body })
  })
  if (!response.ok) throw new Error('quota counter refused the call')
  return response.json()
}

// Tokens used so far. The counter has no read call: a consume larger than the limit is
// always refused and reports the current count without changing it.
export async function peekTokens(env, bucket) {
  if (!sharedControls(env).strictBudget) return null
  try {
    const outcome = await counter(env, 'consume', bucket, { limit: bucket.limit, cost: bucket.limit + 1 })
    return Number.isInteger(outcome?.used) ? outcome.used : null
  }
  catch {
    return null
  }
}

async function giveBack(env, buckets, units) {
  if (units < 1) return
  await Promise.all(buckets.map(bucket => counter(env, 'refund', bucket, { units }).catch(() => null)))
}

// All buckets or none. Refused → { allowed: false, bucket } (name of the bucket that is full).
export async function reserveTokens(env, { buckets, tokens }) {
  if (!sharedControls(env).strictBudget) return { allowed: false, code: 'BUDGET_NOT_CONFIGURED' }
  const taken = []
  const used = {}
  try {
    for (const bucket of buckets) {
      const outcome = await counter(env, 'consume', bucket, { limit: bucket.limit, cost: tokens })
      if (outcome?.allowed !== true) {
        await giveBack(env, taken, tokens)
        return { allowed: false, code: 'TOKEN_BUDGET_EXHAUSTED', bucket: bucket.name, used: outcome?.used ?? null }
      }
      taken.push(bucket)
      used[bucket.name] = outcome.used
    }
  }
  catch {
    await giveBack(env, taken, tokens)
    return { allowed: false, code: 'LIMITER_UNAVAILABLE' }
  }
  return { allowed: true, used }
}

// reserved − actual goes back; actual above the reservation is recorded as real usage
// (limit lifted for that one write so the count stays true). Best effort: a failed refund
// only leaves the budget more conservative.
export async function settleTokens(env, { buckets, reserved, actual }) {
  if (actual < reserved) return giveBack(env, buckets, reserved - actual)
  if (actual > reserved) {
    await Promise.all(buckets.map(bucket => counter(env, 'consume', bucket, { limit: Number.MAX_SAFE_INTEGER, cost: actual - reserved }).catch(() => null)))
  }
}

// Returns over-reserved units. Best effort: a failed refund only leaves the
// budget more conservative, never larger.
export async function refundBudget(env, { scope, units, now = new Date() }) {
  if (!Number.isInteger(units) || units < 1) return
  const day = now.toISOString().slice(0, 10)
  try {
    if (sharedControls(env).strictBudget) {
      const stub = env.CHEMAI_BUDGET.get(env.CHEMAI_BUDGET.idFromName(budgetName(env, scope)))
      await stub.fetch('https://chemai-quota/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, units })
      })
    }
    else if (costBudgetConfigured(env)) {
      const budgetKey = `${budgetName(env, scope)}:${day}`
      const used = Number(await env.CHEMAI_QUOTA.get(budgetKey)) || 0
      await env.CHEMAI_QUOTA.put(budgetKey, String(Math.max(0, used - units)), { expirationTtl: 2 * 86400 })
    }
  }
  catch {
  }
}
