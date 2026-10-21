// Staging acceptance smoke for a deployed ChemLab (Cloudflare Pages preview).
// usage: node scripts/staging-smoke.mjs https://<preview>.pages.dev [--ai]
// Without --ai no Gemini request is sent (no cost). With --ai, a few real
// feedback requests are sent: run it only on staging with a small daily limit.
// Prints PASS/FAIL per check; exit code 1 when any check fails.
import fs from 'node:fs'

const [base, ...flags] = process.argv.slice(2)
// http://localhost is accepted only to dry-run the script (vite preview has no _headers or Functions).
if (!/^(https:\/\/|http:\/\/localhost)/.test(base || '')) {
  console.error('usage: node scripts/staging-smoke.mjs https://<staging-host> [--ai]')
  process.exit(2)
}
const root = base.replace(/\/$/, '')
const expectedVersion = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version
const results = []
const check = (name, pass, detail = '') => results.push({ name, pass: Boolean(pass), detail })
const get = (path, init) => fetch(`${root}${path}`, { redirect: 'manual', ...init })

const home = await get('/')
const html = await home.text()
const csp = home.headers.get('content-security-policy') || ''
check('home loads (200)', home.status === 200)
check(`home shows ChemLab ${expectedVersion}`, html.includes(`ChemLab ${expectedVersion}`))
check('CSP header present with script-src \'self\' and frame-ancestors \'none\'', /script-src 'self'/.test(csp) && /frame-ancestors 'none'/.test(csp), csp)
check('X-Frame-Options DENY and nosniff', home.headers.get('x-frame-options') === 'DENY' && home.headers.get('x-content-type-options') === 'nosniff')

const sw = await get('/sw.js')
const swText = await sw.text()
check(`service worker caches under chemlab-${expectedVersion}`, sw.status === 200 && swText.includes(`chemlab-${expectedVersion}`))
check('service worker is revalidated on every load', /max-age=0/.test(sw.headers.get('cache-control') || ''))
const manifest = await get('/manifest.webmanifest')
check('manifest served as application/manifest+json', manifest.status === 200 && /manifest\+json/.test(manifest.headers.get('content-type') || ''))

const asset = /\/assets\/[^"']+\.js/.exec(html)?.[0]
if (asset) {
  const response = await get(asset)
  check('hashed assets are immutable', response.status === 200 && /immutable/.test(response.headers.get('cache-control') || ''), asset)
}

const status = await get('/api/chat')
const statusJson = await status.json().catch(() => null)
check('/api/chat status responds with no-store', status.status === 200 && /no-store/.test(status.headers.get('cache-control') || ''), JSON.stringify(statusJson))
check(`/api/chat reports release ${expectedVersion}`, statusJson?.release === expectedVersion, JSON.stringify(statusJson))
const feedback = await (await get('/api/feedback')).json().catch(() => null)
check('/api/feedback reports its feature gate', typeof feedback?.enabled === 'boolean', JSON.stringify(feedback))

const crossOrigin = await get('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example' }, body: '{}' })
check('cross-origin POST is refused (403)', crossOrigin.status === 403)

if (flags.includes('--ai')) {
  const post = body => get('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: root }, body: JSON.stringify(body) })
  check('feedback is enabled on staging for the AI run', feedback?.enabled === true, JSON.stringify(feedback))
  const invalid = await post({ rubricId: 'missing', answer: 'x'.repeat(80) })
  check('invalid rubric is rejected before any Gemini call (4xx)', invalid.status >= 400 && invalid.status < 500)
  const answer = 'Khi cho dung dịch NaOH vào dung dịch CuSO₄ xuất hiện kết tủa xanh Cu(OH)₂ do ion Cu²⁺ kết hợp với OH⁻.'
  const first = await post({ rubricId: 'g11-l20-w1', answer })
  const firstJson = await first.json().catch(() => null)
  check('one real feedback request succeeds (200, rubric criteria returned)', first.status === 200 && Array.isArray(firstJson?.feedback?.criteria), `${first.status} ${JSON.stringify(firstJson).slice(0, 200)}`)
  console.log('Next: set CHEMAI_DAILY_LIMIT_FEEDBACK to the number of calls already made today, repeat once, expect 429; then unbind CHEMAI_BUDGET and expect enabled:false or 429. See docs/release/CLOUDFLARE_STAGING_VERIFICATION.md.')
}

for (const item of results) console.log(`${item.pass ? 'PASS' : 'FAIL'} ${item.name}${item.pass || !item.detail ? '' : ` — ${item.detail}`}`)
const failed = results.filter(item => !item.pass).length
console.log(`${results.length - failed}/${results.length} staging checks passed against ${root}`)
process.exit(failed ? 1 : 0)
