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

export function consume(state, { day, limit }) {
  if (state.day !== day) {
    state.day = day
    state.used = 0
  }
  if (state.used >= limit) return { allowed: false, used: state.used }
  state.used += 1
  return { allowed: true, used: state.used }
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
    const limit = Number(body?.limit)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !Number.isInteger(limit) || limit < 1) {
      return Response.json({ allowed: false, error: 'invalid day/limit' }, { status: 400 })
    }
    const state = (await this.ctx.storage.get('state')) || { day: '', used: 0 }
    const outcome = consume(state, { day, limit })
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
