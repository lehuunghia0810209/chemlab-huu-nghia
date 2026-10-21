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
  return controls.strictBudget || (controls.budget && env?.CHEMAI_ACCEPT_APPROX_BUDGET === 'on')
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
export async function consumeBudget(env, { scope, limit, cost = 1, now = new Date() }) {
  const controls = sharedControls(env)
  const day = now.toISOString().slice(0, 10)
  if (controls.strictBudget) {
    try {
      const stub = env.CHEMAI_BUDGET.get(env.CHEMAI_BUDGET.idFromName(`budget:${scope}`))
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
    const budgetKey = `budget:${scope}:${day}`
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

// Returns over-reserved units. Best effort: a failed refund only leaves the
// budget more conservative, never larger.
export async function refundBudget(env, { scope, units, now = new Date() }) {
  if (!Number.isInteger(units) || units < 1) return
  const day = now.toISOString().slice(0, 10)
  try {
    if (sharedControls(env).strictBudget) {
      const stub = env.CHEMAI_BUDGET.get(env.CHEMAI_BUDGET.idFromName(`budget:${scope}`))
      await stub.fetch('https://chemai-quota/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, units })
      })
    }
    else if (costBudgetConfigured(env)) {
      const budgetKey = `budget:${scope}:${day}`
      const used = Number(await env.CHEMAI_QUOTA.get(budgetKey)) || 0
      await env.CHEMAI_QUOTA.put(budgetKey, String(Math.max(0, used - units)), { expirationTtl: 2 * 86400 })
    }
  }
  catch {
  }
}
