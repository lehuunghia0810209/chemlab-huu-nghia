// ChemAI chemistry evaluation against a deployed site (Cloudflare Preview).
// Each answer is graded per category (scripts/lib/chemai-eval-cases.mjs); HTTP 200
// alone is never a pass, and a human still reviews fabrication and the chemistry.
// Spends real Workers AI Neurons (≈ 15–25 per question): nothing is sent without --confirm.
// usage: node scripts/chemai-eval.mjs <https://preview-url> [--confirm] [--only id,id]
import { CASES, grade } from './lib/chemai-eval-cases.mjs'

const base = process.argv[2]?.replace(/\/$/, '')
const confirmed = process.argv.includes('--confirm')
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1].split(',') : null
const cases = only ? CASES.filter(item => only.includes(item.id)) : CASES
if (!/^https:\/\/|^http:\/\/localhost/.test(base || '') || !cases.length) {
  console.error('usage: node scripts/chemai-eval.mjs <https://preview-url> [--confirm] [--only id,id]')
  process.exit(2)
}

if (!confirmed) {
  console.log(`Plan: ${cases.length} questions to ${base}/api/chat (one request each, sequential). Add --confirm to send.`)
  cases.forEach(item => console.log(`- ${item.id} (${item.topic}): ${item.question}`))
  process.exit(0)
}

const mark = value => value === null ? '—' : value ? 'ok' : 'FAIL'
const rows = []
for (const item of cases) {
  const started = Date.now()
  const response = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: base },
    body: JSON.stringify({ message: item.question, history: [], context: { view: 'learning' } })
  })
  const payload = await response.json().catch(() => ({}))
  const result = response.ok && payload.ok ? grade(item, payload.answer) : { categories: {}, pass: false, notes: [`HTTP ${response.status} ${payload.code || ''}`] }
  const attempts = payload.meta?.attempts ?? payload.attempts ?? '?'
  const ms = Date.now() - started
  rows.push({ item, result, ms })
  const c = result.categories
  console.log(`${result.pass ? 'PASS' : 'FAIL'} ${item.id} — final ${mark(c.final)} · steps ${mark(c.steps)} · facts ${mark(c.facts)} · terms ${mark(c.terminology)} · display ${mark(c.display)} · complete ${mark(c.complete)} — ${payload.meta?.model || ''} attempts=${attempts} ${ms} ms`)
  if (result.notes.length) console.log(`     ${result.notes.join(' | ')}`)
  // Full answer: a person grades the chemistry and checks for invented data.
  console.log(String(payload.answer || payload.message || '').replace(/^/gm, '     '))
  if (payload.code === 'AI_DAILY_LIMIT' || payload.code === 'AI_BUDGET_LIMITED') break
  // An approved run is one model call per question: stop on any retry or fallback.
  if (attempts !== 1 || payload.meta?.fallbackUsed || payload.fallbackUsed) {
    console.log('STOP: a retry or fallback happened; the run was approved for one call per question.')
    break
  }
}
const passed = rows.filter(row => row.result.pass).length
const average = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.ms, 0) / rows.length) : 0
console.log(`${passed}/${cases.length} answers passed every automatic category · average ${average} ms · Neurons: see the chemai.chat log lines. Human review still required (fabrication, chemistry).`)
process.exit(rows.length === cases.length && passed === cases.length ? 0 : 1)
