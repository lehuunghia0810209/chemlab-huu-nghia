// Shared (cross-isolate) request/cost controls for ChemAI endpoints.
// In-memory Maps only limit bursts inside one Workers isolate; these optional
// bindings, configured by the project owner on Cloudflare, limit across isolates:
//   CHEMAI_LIMITER — Workers Rate Limiting binding: limit({ key }) → { success }
//   CHEMAI_QUOTA   — KV namespace holding a per-day request budget per scope.
//                    KV is eventually consistent, so the budget is approximate
//                    (it can overshoot by the requests in flight across regions).
// Errors from a configured binding fail closed.

export function sharedControls(env) {
  return {
    limiter: typeof env?.CHEMAI_LIMITER?.limit === 'function',
    budget: typeof env?.CHEMAI_QUOTA?.get === 'function' && typeof env?.CHEMAI_QUOTA?.put === 'function'
  }
}

export function dailyLimit(env, scope, fallback) {
  const value = Number(env?.[`CHEMAI_DAILY_LIMIT_${scope.toUpperCase()}`] ?? env?.CHEMAI_DAILY_LIMIT)
  return Number.isInteger(value) && value > 0 ? value : fallback
}

export async function checkShared(env, { key, scope, limit, now = new Date() }) {
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
  if (controls.budget) {
    const day = now.toISOString().slice(0, 10)
    const budgetKey = `budget:${scope}:${day}`
    try {
      const used = Number(await env.CHEMAI_QUOTA.get(budgetKey)) || 0
      if (used >= limit) return { allowed: false, code: 'DAILY_BUDGET_EXHAUSTED' }
      await env.CHEMAI_QUOTA.put(budgetKey, String(used + 1), { expirationTtl: 2 * 86400 })
    }
    catch {
      return { allowed: false, code: 'LIMITER_UNAVAILABLE' }
    }
  }
  return { allowed: true, controls }
}
