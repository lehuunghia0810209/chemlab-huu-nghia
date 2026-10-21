// Local Cloudflare runtime check (no cloud resource, no cost):
// `wrangler pages dev dist` (workerd + public/_headers + functions/) bound to the
// quota Worker (`wrangler dev`, Durable Object QuotaCounter) through the local
// dev registry, with an invalid Gemini key so every upstream call is refused
// by Google before any billing. Verifies headers/routes (staging-smoke) and the
// exact daily budget: allowed → exhausted (429) → worker down (fail closed) →
// worker back. Requires `npm run build` first and network access for npx.
// usage: node scripts/local-cloudflare-check.mjs
import { spawn, execSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'chemlab-cf-'))
const started = Date.now()
const workerConfig = path.join(work, 'worker.toml')
fs.writeFileSync(workerConfig, fs.readFileSync(path.join(root, 'workers/chemai-quota/wrangler.toml.example'), 'utf8')
  .replace(/^main = .*$/m, `main = ${JSON.stringify(path.join(root, 'workers/chemai-quota/src/index.js').replace(/\\/g, '/'))}`))

// Force-stopped dev processes leave entries in wrangler's dev registry that break
// cross-process Durable Object bindings; remove only the entries this run created.
const registries = [path.join(os.homedir(), 'AppData/Roaming/xdg.config/.wrangler/registry'), path.join(os.homedir(), '.config/.wrangler/registry'), path.join(os.homedir(), 'Library/Preferences/.wrangler/registry')]
const clearOwnRegistry = () => {
  for (const dir of registries.filter(item => fs.existsSync(item))) {
    for (const name of fs.readdirSync(dir)) {
      const file = path.join(dir, name)
      if (fs.statSync(file).mtimeMs >= started) fs.rmSync(file, { force: true })
    }
  }
}
const log = (...items) => console.log(new Date().toISOString().slice(11, 19), ...items)
const children = []
const start = (name, args, cwd) => {
  const child = spawn('npx', ['--yes', 'wrangler@4', ...args], { cwd, shell: true, stdio: 'ignore' })
  children.push(child)
  log('start', name)
  return child
}
const stop = child => {
  try {
    if (process.platform === 'win32') execSync(`taskkill /T /F /PID ${child.pid}`, { stdio: 'ignore' })
    else process.kill(-child.pid, 'SIGKILL')
  }
  catch {}
}
const port = async (number, up = true) => {
  for (let index = 0; index < 180; index += 1) {
    if ((await fetch(`http://127.0.0.1:${number}/`).then(() => true, () => false)) === up) return
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  throw new Error(`port ${number} did not go ${up ? 'up' : 'down'}`)
}
const worker = () => start('quota worker', ['dev', '--config', workerConfig, '--port', '8788', '--persist-to', path.join(work, 'worker-state')], work)
const pages = (feedback, chat, { budget = true } = {}) => start(`pages (limits feedback ${feedback}, chat ${chat}${budget ? '' : ', no budget binding'})`, ['pages', 'dev', 'dist', '--port', '8790', '--compatibility-date=2025-06-01', '--persist-to', path.join(work, 'pages-state'),
  ...(budget ? ['--do', 'CHEMAI_BUDGET=QuotaCounter@chemai-quota'] : []), '--binding', 'CHEMAI_FEEDBACK=on', '--binding', 'GEMINI_API_KEY=invalid-local-test-key',
  '--binding', `CHEMAI_DAILY_LIMIT_FEEDBACK=${feedback}`, '--binding', `CHEMAI_DAILY_LIMIT_CHAT=${chat}`], root)

const base = 'http://localhost:8790'
let ip = 1
async function call(kind) {
  const body = kind === 'feedback'
    ? { rubricId: 'g11-l20-w1', answer: 'Khi cho dung dịch NaOH vào dung dịch CuSO4 xuất hiện kết tủa xanh Cu(OH)2 do ion Cu2+ kết hợp với ion OH- tạo kết tủa.' }
    : { message: 'H2O là gì?' }
  const response = await fetch(`${base}/api/${kind}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: base, 'CF-Connecting-IP': `198.51.100.${ip++}` }, body: JSON.stringify(body) })
  const payload = await response.json().catch(() => ({}))
  return `${response.status} ${payload.code || ''}`
}
const results = []
const expect = (name, got, pattern) => {
  const pass = pattern.test(got)
  results.push(pass)
  log(pass ? 'PASS' : 'FAIL', name, '→', got)
}

try {
  let quota = worker()
  await port(8788)
  let site = pages(2, 3)
  await port(8790)
  try {
    execSync(`node scripts/staging-smoke.mjs ${base}`, { cwd: root, stdio: 'inherit' })
    results.push(true)
  }
  catch {
    results.push(false)
  }
  expect('feedback 1 of 2 passes the budget (Gemini refuses the invalid key)', await call('feedback'), /^502/)
  expect('feedback 2 of 2 passes the budget', await call('feedback'), /^502/)
  expect('feedback 3 refused: budget exhausted', await call('feedback'), /^429 AI_BUDGET_LIMITED/)
  for (let index = 1; index <= 3; index += 1) expect(`chat ${index} of 3 passes the budget`, await call('chat'), /^502/)
  expect('chat 4 refused: budget exhausted', await call('chat'), /^429 AI_BUDGET_LIMITED/)
  stop(site)
  stop(quota)
  await port(8790, false)
  await port(8788, false)
  clearOwnRegistry()
  site = pages(50, 50)
  await port(8790)
  expect('quota worker down, budget not exhausted: feedback fails closed', await call('feedback'), /^429 AI_BUDGET_LIMITED/)
  expect('quota worker down: chat fails closed', await call('chat'), /^429 AI_BUDGET_LIMITED/)
  stop(site)
  await port(8790, false)
  clearOwnRegistry()
  site = pages(50, 50, { budget: false })
  await port(8790)
  expect('no budget binding: chat refuses before any Gemini call (P1 fail-open)', await call('chat'), /^503 AI_BUDGET_NOT_CONFIGURED/)
  expect('no budget binding: feedback stays disabled', await call('feedback'), /^503 FEEDBACK_DISABLED/)
  stop(site)
  await port(8790, false)
  clearOwnRegistry()
  quota = worker()
  await port(8788)
  site = pages(50, 7) // the Durable Object keeps today's 3 chat units from the first phase: 4 left
  await port(8790)
  expect('quota worker back: feedback reaches Gemini again', await call('feedback'), /^502/)
  const burst = (await Promise.all(Array.from({ length: 8 }, () => call('chat')))).map(item => item.split(' ')[0])
  expect('8 concurrent chats against the real Durable Object, 3 of 7 already used: exactly 4 reach Gemini', `${burst.filter(item => item === '502').length} passed, ${burst.filter(item => item === '429').length} refused`, /^4 passed, 4 refused$/)
}
finally {
  children.forEach(stop)
  clearOwnRegistry()
  try {
    fs.rmSync(work, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 })
  }
  catch {
    log(`could not remove ${work} (still locked); safe to delete later`)
  }
}
log(`${results.filter(Boolean).length}/${results.length} local Cloudflare runtime checks passed`)
process.exit(results.length && results.every(Boolean) ? 0 : 1)
