// ChemAI quota Worker — a strict global request budget for ChemLab's AI
// endpoints (EXR-007). Pages Functions cannot define Durable Objects, so this
// small Worker is deployed separately and bound to the Pages project as a
// Durable Object namespace named CHEMAI_BUDGET (see wrangler.toml.example and
// docs/release/RELEASE_6.5.md). NOT deployed by the agent.
//
// One Durable Object instance per scope (“chat”, “feedback”). A Durable Object
// processes requests one at a time with transactional storage, so the count is
// exact across all locations — unlike KV (eventually consistent) or the
// Workers Rate Limiting API (per location).

// cost: units charged by this call (1 request, or an estimate of Workers AI
// Neurons). A call that would exceed the limit is refused whole.
export function consume(state, { day, limit, cost = 1 }) {
  if (state.day !== day) {
    state.day = day
    state.used = 0
  }
  if (state.used + cost > limit) return { allowed: false, used: state.used }
  state.used += cost
  return { allowed: true, used: state.used }
}

// Gives back over-reserved units (estimate − actual) for the same day only.
export function refund(state, { day, units }) {
  if (state.day === day) state.used = Math.max(0, state.used - units)
  return { used: state.used }
}

export class QuotaCounter {
  constructor(ctx) {
    this.ctx = ctx
  }

  async fetch(request) {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 })
    let body
    try {
      body = await request.json()
    }
    catch {
      return Response.json({ allowed: false, error: 'invalid body' }, { status: 400 })
    }
    const day = String(body?.day || '')
    const isRefund = new URL(request.url).pathname === '/refund'
    const limit = Number(body?.limit)
    const cost = Number(body?.cost ?? 1)
    const units = Number(body?.units)
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(day) && (isRefund
      ? Number.isInteger(units) && units > 0
      : Number.isInteger(limit) && limit >= 1 && Number.isInteger(cost) && cost >= 1)
    if (!valid) {
      return Response.json({ allowed: false, error: 'invalid day/limit/cost' }, { status: 400 })
    }
    const state = (await this.ctx.storage.get('state')) || { day: '', used: 0 }
    const outcome = isRefund ? refund(state, { day, units }) : consume(state, { day, limit, cost })
    await this.ctx.storage.put('state', state)
    return Response.json(outcome)
  }
}

// The Worker itself exposes nothing: only the Pages project reaches the
// Durable Object, through its binding.
export default {
  fetch() {
    return new Response('Not found', { status: 404 })
  }
}
