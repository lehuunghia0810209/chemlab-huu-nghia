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
// Errors from a configured binding fail closed.

export function sharedControls(env) {
  return {
    strictBudget: typeof env?.CHEMAI_BUDGET?.idFromName === 'function' && typeof env?.CHEMAI_BUDGET?.get === 'function',
    budget: typeof env?.CHEMAI_QUOTA?.get === 'function' && typeof env?.CHEMAI_QUOTA?.put === 'function',
    limiter: typeof env?.CHEMAI_LIMITER?.limit === 'function'
  }
}

export function dailyLimit(env, scope, fallback) {
  const value = Number(env?.[`CHEMAI_DAILY_LIMIT_${scope.toUpperCase()}`] ?? env?.CHEMAI_DAILY_LIMIT)
  return Number.isInteger(value) && value > 0 ? value : fallback
}

export async function checkShared(env, { key, scope, limit, now = new Date() }) {
  const controls = sharedControls(env)
  const day = now.toISOString().slice(0, 10)
  if (controls.limiter) {
    try {
      const outcome = await env.CHEMAI_LIMITER.limit({ key: `${scope}:${key}` })
      if (!outcome?.success) return { allowed: false, code: 'RATE_LIMITED' }
    }
    catch {
      return { allowed: false, code: 'LIMITER_UNAVAILABLE' }
    }
  }
  if (controls.strictBudget) {
    try {
      const stub = env.CHEMAI_BUDGET.get(env.CHEMAI_BUDGET.idFromName(`budget:${scope}`))
      const response = await stub.fetch('https://chemai-quota/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, limit })
      })
      const outcome = response.ok ? await response.json() : null
      if (outcome?.allowed !== true) return { allowed: false, code: outcome ? 'DAILY_BUDGET_EXHAUSTED' : 'LIMITER_UNAVAILABLE' }
    }
    catch {
      return { allowed: false, code: 'LIMITER_UNAVAILABLE' }
    }
  }
  else if (controls.budget) {
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
