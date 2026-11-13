// Local Cloudflare runtime check (no cloud resource, no cost, no AI call):
// `wrangler pages dev dist` (workerd + public/_headers + functions/) with every AI
// setting present (Groq and Gemini invalid keys, feedback on) to prove the 6.5.4
// access gate holds in the real runtime: headers/routes (staging-smoke), locked
// status without backend detail, and 403 for chat/feedback in disabled,
// student_access and approved_users-without-identity modes. The exact daily budget
// behind the gate is covered by the Node tests (check:ai).
// Requires `npm run build` first and network access for npx.
// usage: node scripts/local-cloudflare-check.mjs
import { spawn, execSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'chemlab-cf-'))
const started = Date.now()
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
const pages = (bindings = []) => start(`pages (${bindings.join(' ') || 'default access'})`, ['pages', 'dev', 'dist', '--port', '8790', '--compatibility-date=2025-06-01', '--persist-to', path.join(work, 'pages-state'),
  '--binding', 'CHEMAI_FEEDBACK=on', '--binding', 'GEMINI_API_KEY=invalid-local-test-key', '--binding', 'GROQ_API_KEY=invalid-local-test-key', '--binding', 'CHEMAI_ACCEPT_APPROX_BUDGET=on',
  ...bindings.flatMap(item => ['--binding', item])], root)

const base = 'http://localhost:8790'
let ip = 1
async function call(kind, headers = {}) {
  const body = kind === 'feedback'
    ? { rubricId: 'g11-l20-w1', answer: 'Khi cho dung dịch NaOH vào dung dịch CuSO4 xuất hiện kết tủa xanh Cu(OH)2 do ion Cu2+ kết hợp với ion OH- tạo kết tủa.' }
    : { message: 'H2O là gì?' }
  const response = await fetch(`${base}/api/${kind}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: base, 'CF-Connecting-IP': `198.51.100.${ip++}`, ...headers }, body: JSON.stringify(body) })
  const payload = await response.json().catch(() => ({}))
  return `${response.status} ${payload.code || ''}`
}
const results = []
const expect = (name, got, pattern) => {
  const pass = pattern.test(got)
  results.push(pass)
  log(pass ? 'PASS' : 'FAIL', name, '→', got)
}
const restart = async (site, bindings) => {
  stop(site)
  await port(8790, false)
  clearOwnRegistry()
  const next = pages(bindings)
  await port(8790)
  return next
}
const b64 = value => Buffer.from(JSON.stringify(value)).toString('base64url')

try {
  let site = pages()
  await port(8790)
  try {
    execSync(`node scripts/staging-smoke.mjs ${base}`, { cwd: root, stdio: 'inherit' })
    results.push(true)
  }
  catch {
    results.push(false)
  }
  const status = await (await fetch(`${base}/api/chat`)).json()
  expect('default: status says locked and names no provider/model', JSON.stringify(Object.keys(status).sort()) + ` access=${status.access}`, /^\["access","configured","ok","release","service"\] access=false$/)
  expect('default: feedback status disabled', `enabled=${(await (await fetch(`${base}/api/feedback`)).json()).enabled}`, /^enabled=false$/)
  expect('default (fully configured): chat refused before any AI call', await call('chat'), /^403 AI_ACCESS_LOCKED$/)
  expect('default (fully configured): feedback refused before any AI call', await call('feedback'), /^403 AI_ACCESS_LOCKED$/)
  site = await restart(site, ['CHEMAI_ACCESS_MODE=student_access'])
  expect('student_access flag cannot open chat', await call('chat'), /^403 AI_ACCESS_LOCKED$/)
  expect('student_access flag cannot open feedback', await call('feedback'), /^403 AI_ACCESS_LOCKED$/)
  site = await restart(site, ['CHEMAI_ACCESS_MODE=approved_users', 'CF_ACCESS_TEAM_DOMAIN=https://chemlab-local-test.cloudflareaccess.com', 'CF_ACCESS_AUD=local-test', 'CHEMAI_APPROVED_EMAILS=teacher@example.org'])
  expect('approved_users: direct request without identity refused', await call('chat'), /^403 AI_ACCESS_LOCKED$/)
  expect('approved_users: spoofed identity headers refused', await call('chat', { 'X-User-Email': 'teacher@example.org', Cookie: 'CF_Authorization=forged' }), /^403 AI_ACCESS_LOCKED$/)
  const unsigned = `${b64({ alg: 'none', kid: 'k' })}.${b64({ email: 'teacher@example.org', aud: ['local-test'], iss: 'https://chemlab-local-test.cloudflareaccess.com', exp: 9999999999 })}.`
  expect('approved_users: unsigned (alg none) Access token refused', await call('chat', { 'Cf-Access-Jwt-Assertion': unsigned }), /^403 AI_ACCESS_LOCKED$/)
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
