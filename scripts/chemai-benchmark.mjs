// ChemAI 6.7 benchmark (scripts/lib/chemai-benchmark-cases.mjs, 56 questions).
//
// Offline (default, no network, no key): runs ChemLab Engine and the router on every
// question. Measures the share answered with 0 tokens, engine correctness and routing errors.
//   node scripts/chemai-benchmark.mjs [--out report.json]
//
// Live (real Groq calls, real tokens): runs the /api/chat handler in this process with an
// in-memory quota counter, so Production's Durable Object quota is never touched. Groq's own
// per-key limits ARE shared with Production when the same key is used: prefer a separate key.
//   GROQ_API_KEY=… node scripts/chemai-benchmark.mjs --live --confirm [--modes off,hybrid]
//     [--only E1,P4] [--max-tokens 120000] [--pace 4000] [--label text] [--out report.json]
// Questions run in pairs (every mode for one question, then the next), and a pair starts only
// if the largest pair seen so far (3,000 before the first) still fits under --max-tokens, so a
// budget stop leaves complete pairs and never overspends by more than one unusual pair.
// --modes off = the 6.6.4 path (CHEMAI_ROUTING=off: one model, no engine, full history).
import { writeFileSync } from 'node:fs'
import { CASES, gradeAnswer, routeMatches } from './lib/chemai-benchmark-cases.mjs'
import { engineAnswer } from '../functions/api/_chemEngine.js'
import { routeModel, SMALL_MODEL } from '../functions/api/chat.js'
import { APP_VERSION } from '../src/appMeta.js'

const args = process.argv.slice(2)
const option = name => args.includes(name) ? args[args.indexOf(name) + 1] : null
const only = option('--only')?.split(',')
// --only keeps the given order, so the most informative questions run first under a tight budget.
const cases = only ? only.map(id => CASES.find(item => item.id === id)).filter(Boolean) : CASES
const outFile = option('--out')
const live = args.includes('--live')

const pct = (part, whole) => whole ? `${(100 * part / whole).toFixed(1)}%` : '—'
const routeOf = item => {
  const solved = engineAnswer(item.question)
  if (solved) return { route: 'engine', solved }
  return { route: routeModel(item.question, item.history || []).model === SMALL_MODEL ? '20b' : '120b' }
}

function offline() {
  const rows = cases.map(item => {
    const { route, solved } = routeOf(item)
    const grade = solved ? gradeAnswer(item, solved.answer) : null
    return { id: item.id, category: item.category, expectedRoute: item.route, route, routeOk: routeMatches(item.route, route), engineCorrect: grade ? grade.pass : null, ...(grade && !grade.pass ? { grade } : {}) }
  })
  const engine = rows.filter(row => row.route === 'engine')
  console.log(`ChemAI ${APP_VERSION} offline benchmark — ${rows.length} questions, no network.\n`)
  console.log('| id | category | expected | route | ok | engine answer |')
  console.log('|---|---|---|---|---|---|')
  for (const row of rows) console.log(`| ${row.id} | ${row.category} | ${row.expectedRoute} | ${row.route} | ${row.routeOk ? 'ok' : 'ROUTING ERROR'} | ${row.engineCorrect === null ? '' : row.engineCorrect ? 'correct' : 'WRONG'} |`)
  const summary = {
    questions: rows.length,
    engine: engine.length,
    engineShare: pct(engine.length, rows.length),
    engineCorrect: engine.filter(row => row.engineCorrect).length,
    routes: Object.fromEntries(['engine', '20b', '120b'].map(name => [name, rows.filter(row => row.route === name).length])),
    routingErrors: rows.filter(row => !row.routeOk).map(row => `${row.id}: expected ${row.expectedRoute}, got ${row.route}`)
  }
  console.log('\n', JSON.stringify(summary, null, 2))
  if (outFile) writeFileSync(outFile, JSON.stringify({ mode: 'offline', version: APP_VERSION, summary, rows }, null, 2))
  return summary
}

// ---------------- live ----------------

const quotaCounter = () => {
  const states = new Map()
  return {
    idFromName: name => name,
    get: id => ({
      fetch: async (url, init) => {
        const body = JSON.parse(init.body)
        const state = states.get(id) || { day: '', used: 0 }
        states.set(id, state)
        if (new URL(url).pathname === '/refund') {
          if (state.day === body.day) state.used = Math.max(0, state.used - body.units)
          return Response.json({ used: state.used })
        }
        if (state.day !== body.day) Object.assign(state, { day: body.day, used: 0 })
        const cost = body.cost || 1
        const allowed = state.used + cost <= body.limit
        if (allowed) state.used += cost
        return Response.json({ allowed, used: state.used })
      }
    })
  }
}

async function liveRun() {
  if (!args.includes('--confirm') || !process.env.GROQ_API_KEY) {
    console.error('Live mode spends real Groq tokens. Set GROQ_API_KEY and pass --confirm.')
    console.error(`Upper bound: ${cases.length} questions × modes × (input ≤ 2,500 + output ≤ 2,400) tokens; stopped by --max-tokens.`)
    process.exit(2)
  }
  const { onRequestPost } = await import('../functions/api/chat.js')
  const modes = (option('--modes') || 'off,hybrid').split(',')
  const maxTokens = Number(option('--max-tokens')) || 120_000
  const pace = Number(option('--pace')) || 4000
  // Names what is compared, e.g. 'corrected-off vs corrected-hybrid' after a guard/prompt fix shared by both modes.
  const label = option('--label') || modes.join(' vs ')
  console.log(`ChemAI ${APP_VERSION} live benchmark: ${label}`)
  const HOST = 'benchmark.chemlab.local'
  // The handler's own log lines are kept for the report, not printed.
  const logs = []
  const print = console.log.bind(console)
  console.log = console.warn = console.error = (...parts) => logs.push(parts.join(' '))
  // Every raw model answer, shown or withheld, so a blocked draft can still be read by hand.
  const drafts = []
  const realFetch = globalThis.fetch
  globalThis.fetch = async (...args) => {
    const response = await realFetch(...args)
    try {
      const body = await response.clone().json()
      const content = body.choices?.[0]?.message?.content
      if (content) drafts.push({ model: body.model, content })
    }
    catch { /* not JSON: nothing to record */ }
    return response
  }
  let spent = 0
  let ip = 1
  let largestPair = 3000
  let stopped = null
  const results = []
  const envFor = mode => ({
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    CHEMAI_BUDGET: quotaCounter(),
    CHEMAI_ACCESS_MODE: 'public',
    CHEMAI_PUBLIC_APPROVAL: `groq:${APP_VERSION}`,
    CHEMAI_PUBLIC_HOSTS: HOST,
    CHEMAI_ROUTING: mode === 'off' ? 'off' : 'hybrid',
    CHEMAI_TOKENS_PER_CLIENT_DAY: '1000000',
    CHEMAI_TOKENS_PER_NETWORK_DAY: '1000000',
    CHEMAI_TOKENS_GLOBAL_DAY: '1000000',
    CHEMAI_TOKENS_GLOBAL_MINUTE: '1000000'
  })
  const envs = Object.fromEntries(modes.map(mode => [mode, envFor(mode)]))
  const save = () => outFile && writeFileSync(outFile, JSON.stringify({ mode: 'live', label, version: APP_VERSION, date: new Date().toISOString(), maxTokens, spent, stopped, results }, null, 2))
  for (const item of cases) {
    if (spent + largestPair > maxTokens) {
      stopped = `${spent} tokens spent; the next pair could need ${largestPair} and --max-tokens is ${maxTokens}.`
      print(`STOP before ${item.id}: ${stopped}`)
      break
    }
    let pairTokens = 0
    for (const mode of modes) {
      const env = envs[mode]
      let response
      let payload
      const started = Date.now()
      const firstLog = logs.length
      const firstDraft = drafts.length
      let waits = 0
      for (let attempt = 0; attempt < 2; attempt += 1) {
        response = await onRequestPost({
          env,
          request: new Request(`https://${HOST}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Origin: `https://${HOST}`, 'CF-Connecting-IP': `203.0.113.${ip++ % 250}` },
            body: JSON.stringify({ message: item.question, history: item.history || [], context: { view: 'learning' } })
          })
        })
        payload = await response.json()
        spent += payload.usage?.totalTokens || 0
        pairTokens += payload.usage?.totalTokens || 0
        // Groq's per-minute limit: wait once, then record whatever comes back.
        if (![429, 503].includes(response.status) || payload.code === 'AI_UNVERIFIED') break
        waits += 1
        print(`${mode} ${item.id}: ${response.status} ${payload.code}, waiting 60 s`)
        await new Promise(resolve => setTimeout(resolve, 60_000))
      }
      const ms = Date.now() - started
      const usage = payload.usage || null
      const trace = logs.slice(firstLog).map(line => { try { return JSON.parse(line) } catch { return null } }).filter(entry => entry?.provider || entry?.route).at(-1) || null
      const route = payload.meta?.route || trace?.route || null
      const grade = payload.ok ? gradeAnswer(item, payload.answer) : { pass: false, missing: [`HTTP ${response.status} ${payload.code}`], forbidden: [] }
      results.push({
        mode, id: item.id, category: item.category, question: item.question, expectedRoute: item.route, expected: item.expected, route,
        routeOk: mode === 'off' || routeMatches(item.route, route),
        escalated: Boolean(payload.meta?.escalated || trace?.escalatedFrom), replaced: payload.meta?.replaced || null, escalationReason: trace?.escalationReason || null, escalationRefused: trace?.escalationRefused || null,
        corrections: payload.meta?.corrections ?? null, guardFindings: trace?.guardFindings || trace?.withheld || [],
        status: response.status, code: payload.code || null, outcome: outcome(response.status, payload, grade.pass), rateLimitWaits: waits, ms, usage, pass: grade.pass, grade,
        answer: payload.answer || payload.message || '',
        drafts: drafts.slice(firstDraft)
      })
      print(`${mode.padEnd(6)} ${item.id.padEnd(4)} ${String(route).padEnd(6)} ${String(usage?.totalTokens ?? 0).padStart(5)} tok ${String(ms).padStart(6)} ms ${grade.pass ? 'pass' : 'FAIL ' + [...grade.missing, ...grade.forbidden].join(' ')}`)
      save()
      if (route !== 'engine') await new Promise(resolve => setTimeout(resolve, pace))
    }
    largestPair = Math.max(largestPair, pairTokens)
  }
  console.log = print
  const summary = {}
  for (const mode of modes) {
    const rows = results.filter(row => row.mode === mode)
    if (!rows.length) continue
    const tokens = rows.reduce((sum, row) => sum + (row.usage?.totalTokens || 0), 0)
    const byCategory = {}
    for (const row of rows) {
      const bucket = byCategory[row.category] ||= { n: 0, tokens: 0, pass: 0, ms: 0 }
      bucket.n += 1
      bucket.tokens += row.usage?.totalTokens || 0
      bucket.pass += row.pass ? 1 : 0
      bucket.ms += row.ms
    }
    for (const bucket of Object.values(byCategory)) Object.assign(bucket, { avgTokens: Math.round(bucket.tokens / bucket.n), avgMs: Math.round(bucket.ms / bucket.n) })
    summary[mode] = {
      questions: rows.length,
      correct: rows.filter(row => row.pass).length,
      accuracy: pct(rows.filter(row => row.pass).length, rows.length),
      zeroTokenShare: pct(rows.filter(row => row.route === 'engine').length, rows.length),
      totalTokens: tokens,
      avgTokens: Math.round(tokens / rows.length),
      reasoningTokens: rows.reduce((sum, row) => sum + (row.usage?.reasoningTokens || 0), 0),
      cachedTokens: rows.reduce((sum, row) => sum + (row.usage?.cachedTokens || 0), 0),
      avgMs: Math.round(rows.reduce((sum, row) => sum + row.ms, 0) / rows.length),
      routes: Object.fromEntries(['engine', '20b', '120b'].map(name => [name, rows.filter(row => row.route === name).length])),
      escalations: rows.filter(row => row.escalated).map(row => row.id),
      routingErrors: rows.filter(row => !row.routeOk).map(row => `${row.id}: ${row.expectedRoute} → ${row.route}`),
      failures: rows.filter(row => !row.pass).map(row => row.id),
      // Wrong answers a learner would have read, vs answers ChemLab withheld (AI_UNVERIFIED) or replaced by the engine.
      wrongShown: rows.filter(row => row.status === 200 && !row.pass).map(row => row.id),
      withheld: rows.filter(row => row.code === 'AI_UNVERIFIED').map(row => row.id),
      replacedByEngine: rows.filter(row => row.replaced).map(row => row.id),
      // Estimate only: list prices below × the tokens of every call (reasoning is part of completion).
      usdEstimate: Number(rows.reduce((sum, row) => sum + (row.usage?.calls || []).reduce((cost, call) => cost + callUsd(call), 0), 0).toFixed(6)),
      outcomes: Object.fromEntries(OUTCOMES.map(name => [name, rows.filter(row => row.outcome === name).map(row => row.id)])),
      // SafeBlocked is never counted as correct; blockRate = wrong answers stopped / all wrong answers.
      correctRate: pct(rows.filter(row => ['Correct', 'ReplacedByEngine'].includes(row.outcome)).length, rows.length),
      blockRate: pct(rows.filter(row => row.outcome === 'SafeBlocked').length, rows.filter(row => ['SafeBlocked', 'WrongShown'].includes(row.outcome)).length),
      byModel: Object.fromEntries(['engine', '20b', '120b'].map(name => [name, { n: rows.filter(row => row.route === name).length, correct: rows.filter(row => row.route === name && row.pass).length }])),
      errors: rows.filter(row => row.status !== 200).map(row => `${row.id}: ${row.status} ${row.code}`),
      byCategory
    }
  }
  if (summary.off && summary.hybrid) {
    const paired = results.filter(row => row.mode === 'hybrid').map(row => [results.find(other => other.mode === 'off' && other.id === row.id), row]).filter(([off]) => off)
    const offTokens = paired.reduce((sum, [off]) => sum + (off.usage?.totalTokens || 0), 0)
    const hybridTokens = paired.reduce((sum, [, hybrid]) => sum + (hybrid.usage?.totalTokens || 0), 0)
    summary.comparison = {
      pairedQuestions: paired.length,
      tokens: { off: offTokens, hybrid: hybridTokens, saved: offTokens - hybridTokens, savedShare: pct(offTokens - hybridTokens, offTokens) },
      // Token saving and USD saving are different metrics: 20b is cheaper per token even when it uses as many.
      usdEstimate: { off: summary.off.usdEstimate, hybrid: summary.hybrid.usdEstimate, savedShare: pct(summary.off.usdEstimate - summary.hybrid.usdEstimate, summary.off.usdEstimate) },
      // Where the token saving comes from: questions the engine answered (0 tokens) vs questions sent to 20b.
      savedByEngine: paired.filter(([, hybrid]) => hybrid.route === 'engine').reduce((sum, [off]) => sum + (off.usage?.totalTokens || 0), 0),
      savedByModel: paired.filter(([, hybrid]) => hybrid.route !== 'engine').reduce((sum, [off, hybrid]) => sum + (off.usage?.totalTokens || 0) - (hybrid.usage?.totalTokens || 0), 0),
      onlyOffCorrect: paired.filter(([off, hybrid]) => off.pass && !hybrid.pass).map(([off]) => off.id),
      onlyHybridCorrect: paired.filter(([off, hybrid]) => !off.pass && hybrid.pass).map(([off]) => off.id)
    }
  }
  print(JSON.stringify(summary, null, 2))
  const report = JSON.stringify({ mode: 'live', label, version: APP_VERSION, date: new Date().toISOString(), maxTokens, spent, stopped, summary, results, logs }, null, 2)
  // The key must never reach the saved report.
  if (report.includes(process.env.GROQ_API_KEY)) throw new Error('API key found in the report; nothing written.')
  if (outFile) writeFileSync(outFile, report)
}

// USD per 1M tokens, on-demand list prices read from console.groq.com/docs/models on 2026-11-15.
// Cached-input discounts are not applied, so this is an upper estimate.
const PRICES = { 'openai/gpt-oss-120b': { input: 0.15, output: 0.60 }, 'openai/gpt-oss-20b': { input: 0.075, output: 0.30 } }
const callUsd = call => ((call.promptTokens || 0) * (PRICES[call.model]?.input || 0) + (call.completionTokens || 0) * (PRICES[call.model]?.output || 0)) / 1e6

// What the learner got. SafeBlocked = AI_UNVERIFIED (the grade of the withheld draft is unknown: read it by hand).
const OUTCOMES = ['Correct', 'WrongShown', 'SafeBlocked', 'ReplacedByEngine', 'ProviderError']
function outcome(status, payload, pass) {
  if (payload.code === 'AI_UNVERIFIED') return 'SafeBlocked'
  if (status !== 200) return 'ProviderError'
  if (!pass) return 'WrongShown'
  return payload.meta?.replaced ? 'ReplacedByEngine' : 'Correct'
}

if (live) await liveRun()
else offline()
