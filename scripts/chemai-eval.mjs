// ChemAI chemistry evaluation against a deployed site (Cloudflare Preview).
// Each answer is graded per category (scripts/lib/chemai-eval-cases.mjs); HTTP 200
// alone is never a pass, and a human still reviews fabrication and the chemistry.
// Spends real Workers AI Neurons (≈ 15–30 per question): nothing is sent without --confirm.
// usage: node scripts/chemai-eval.mjs <https://preview-url> [--confirm] [--only id,id] [--max-neurons n] [--out report.json]
import { writeFileSync } from 'node:fs'
import { CASES, grade, verdict } from './lib/chemai-eval-cases.mjs'

const base = process.argv[2]?.replace(/\/$/, '')
const confirmed = process.argv.includes('--confirm')
const option = name => process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : null
const only = option('--only')?.split(',') ?? null
const maxNeurons = Number(option('--max-neurons')) || Infinity
const outFile = option('--out')
const cases = only ? CASES.filter(item => only.includes(item.id)) : CASES
if (!/^https:\/\/|^http:\/\/localhost/.test(base || '') || !cases.length) {
  console.error('usage: node scripts/chemai-eval.mjs <https://preview-url> [--confirm] [--only id,id] [--max-neurons n] [--out report.json]')
  process.exit(2)
}

if (!confirmed) {
  const paid = cases.filter(item => !item.gate).length
  console.log(`Plan: ${cases.length} questions to ${base}/api/chat (one request each, sequential), ${paid} reach the model, ${cases.length - paid} are answered by the safety gate. Estimate ${paid * 15}–${paid * 30} Neurons. Add --confirm to send.`)
  cases.forEach(item => console.log(`- ${item.id} (${item.topic})${item.gate ? ' [gate]' : ''}: ${item.question}`))
  process.exit(0)
}

const mark = value => value === null ? '—' : value ? 'ok' : 'FAIL'
const rows = []
let spent = 0
let unmeasured = 0
let stopped = null
for (const item of cases) {
  const started = Date.now()
  const response = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: base },
    body: JSON.stringify({ message: item.question, history: [], context: { view: 'learning' } })
  })
  const payload = await response.json().catch(() => ({}))
  const result = response.ok && payload.ok ? grade(item, payload.answer) : { categories: {}, pass: false, notes: [`HTTP ${response.status} ${payload.code || ''}`] }
  // A gated question must be gated: reaching the model would be a failure of the gate.
  if (item.gate && !payload.meta?.safetyGate) { result.pass = false; result.notes.push('safety gate did not answer') }
  const attempts = payload.meta?.attempts ?? payload.attempts ?? '?'
  const ms = Date.now() - started
  const neurons = payload.meta?.neuronsUsed
  if (Number.isFinite(neurons)) spent += neurons
  else if (!item.gate) unmeasured += 1
  const judged = verdict(result)
  rows.push({ id: item.id, question: item.question, ...judged, categories: result.categories, notes: result.notes, corrections: payload.meta?.corrections ?? 0, safetyGate: payload.meta?.safetyGate ?? null, neurons: neurons ?? null, attempts, fallbackUsed: Boolean(payload.meta?.fallbackUsed ?? payload.fallbackUsed), ms, code: payload.code ?? null, answer: payload.answer ?? payload.message ?? '' })
  const c = result.categories
  console.log(`${result.pass ? 'PASS' : 'FAIL'} ${item.id} — ${judged.auto} · ${judged.scientific} — final ${mark(c.final)} · steps ${mark(c.steps)} · facts ${mark(c.facts)} · science ${mark(c.science)} · terms ${mark(c.terminology)} · display ${mark(c.display)} · complete ${mark(c.complete)} — ${payload.meta?.model || ''} attempts=${attempts} ${ms} ms neurons=${neurons ?? '?'}`)
  if (result.notes.length) console.log(`     ${result.notes.join(' | ')}`)
  // Full answer: a person grades the chemistry and checks for invented data.
  console.log(String(payload.answer || payload.message || '').replace(/^/gm, '     '))
  if (payload.code === 'AI_DAILY_LIMIT' || payload.code === 'AI_BUDGET_LIMITED') { stopped = payload.code; break }
  // An approved run is one model call per question: stop on any retry or fallback.
  if (!item.gate && (attempts !== 1 || payload.meta?.fallbackUsed || payload.fallbackUsed)) {
    stopped = 'a retry or fallback happened; the run was approved for one call per question'
    console.log(`STOP: ${stopped}.`)
    break
  }
  if (spent + 30 > maxNeurons) {
    stopped = `the next question could pass the approved ${maxNeurons} Neurons`
    console.log(`STOP: ${stopped}.`)
    break
  }
}
const passed = rows.filter(row => row.auto === 'AUTO PASS').length
const proven = rows.filter(row => row.scientific === 'SCIENTIFIC FAIL').length
const noAnswer = rows.filter(row => row.scientific === 'NO ANSWER').length
const average = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.ms, 0) / rows.length) : 0
const summary = { sent: rows.length, planned: cases.length, autoPass: passed, autoFail: rows.length - passed, scientificFail: proven, noAnswer, humanReviewRequired: rows.filter(row => row.scientific === 'HUMAN REVIEW REQUIRED').length, neuronsMeasured: spent, questionsUnmeasured: unmeasured, averageMs: average, stopped }
console.log(`${passed}/${cases.length} AUTO PASS · ${proven} SCIENTIFIC FAIL · ${noAnswer} NO ANSWER · ${summary.humanReviewRequired} HUMAN REVIEW REQUIRED · average ${average} ms · ${spent} Neurons measured, ${unmeasured} unmeasured. A person must still review every answer; this run cannot set SCIENTIFIC PASS.`)
if (outFile) writeFileSync(outFile, `${JSON.stringify({ base, at: new Date().toISOString(), summary, rows }, null, 1)}\n`)
process.exit(rows.length === cases.length && passed === cases.length ? 0 : 1)
