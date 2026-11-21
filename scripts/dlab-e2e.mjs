// ChemLab 7.0 Dynamic Lab — real-browser E2E (Playwright). Asserts simulation state AND what is drawn.
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'
import { chromium, firefox, webkit } from 'playwright-core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = process.env.CHEMLAB_QA_OUTPUT_DIR || path.join(root, 'test-results', 'dlab-e2e')
const browserName = (process.env.CHEMLAB_BROWSER || 'chromium').toLowerCase()
const only = process.env.DLAB_ONLY ? new Set(process.env.DLAB_ONLY.split(',')) : null
await fs.mkdir(outDir, { recursive: true })

const server = await preview({ root, preview: { port: 4317 + Math.floor(Math.random() * 400), strictPort: false }, logLevel: 'silent' })
const base = server.resolvedUrls.local[0]
const browser = await ({ chromium, firefox, webkit }[browserName]).launch({ headless: true })
const results = []
const aiRequests = []

async function newPage(width = 1440, height = 900, touch = false) {
  const context = await browser.newContext({ viewport: { width, height }, hasTouch: touch, isMobile: touch && browserName !== 'firefox' })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', e => errors.push(String(e)))
  page.on('console', m => { if (m.type() === 'error' && !/api\/chat|404/.test(m.text())) errors.push(m.text()) })
  // GET /api/chat is ChemAI's status/quota check (no model call); a POST is a question that spends tokens.
  page.on('request', r => { if (/\/api\/(chat|ai|chemai)/.test(r.url()) && r.method() !== 'GET') aiRequests.push(`${r.method()} ${r.url()}`) })
  await page.goto(`${base}#dlab`)
  await page.waitForFunction(() => window.ChemLabDynamicLab?.ready, null, { timeout: 30000 })
  await page.evaluate(() => indexedDB.deleteDatabase('chemlab-dynamic-lab'))
  return { page, context, errors }
}

// Fresh bench with a few named objects; returns their ids.
async function bench(page, spec) {
  return page.evaluate(spec => {
    const L = window.ChemLabDynamicLab
    L.dispatch({ type: 'cleanup' }, { record: false })
    for (const o of [...L.state.objects]) L.dispatch({ type: 'remove', id: o.id }, { record: false })
    L.state.log = []
    L.state.gas = { H2: 0, CO2: 0, Cl2: 0 }
    const ids = {}
    for (const [name, s] of Object.entries(spec)) {
      const r = L.dispatch({ type: 'add', equipmentType: s.type, x: s.x, y: s.y ?? 0, reagent: s.reagent, label: s.label }, { record: false })
      ids[name] = r.id
      if (s.fill) for (const [reagent, mL] of s.fill) L.dispatch({ type: 'addReagentTo', id: r.id, reagent, mL }, { record: false })
    }
    return ids
  }, spec)
}
const st = (page, fn, arg) => page.evaluate(([f, a]) => new Function('L', 'a', `return (${f})(L, a)`)(window.ChemLabDynamicLab, a), [fn.toString(), arg])
const wait = (page, fn, arg, timeout = 20000) => page.waitForFunction(([f, a]) => new Function('L', 'a', `return (${f})(L, a)`)(window.ChemLabDynamicLab, a), [fn.toString(), arg], { timeout, polling: 100 })
async function screen(page, x, y) { return page.evaluate(([x, y]) => window.ChemLabDynamicLab.worldToScreen(x, y), [x, y]) }
async function pixel(page, x, y) {
  const p = await screen(page, x, y)
  return page.evaluate(([sx, sy]) => {
    const c = document.querySelector('.dlab-canvas')
    const r = c.getBoundingClientRect()
    const dpr = c.width / r.width
    const d = c.getContext('2d').getImageData(Math.round((sx - r.left) * dpr), Math.round((sy - r.top) * dpr), 1, 1).data
    return [d[0], d[1], d[2]]
  }, [p.x, p.y])
}
async function dragWorld(page, from, to, steps = 12) {
  const a = await screen(page, from.x, from.y)
  const b = await screen(page, to.x, to.y)
  await page.mouse.move(a.x, a.y)
  await page.mouse.down()
  await page.mouse.move(b.x, b.y, { steps })
  return async () => page.mouse.up()
}

async function test(name, fn, opts = {}) {
  if (only && !only.has(name.split(' ')[0])) return
  const env = await newPage(opts.width, opts.height, opts.touch)
  try {
    await fn(env.page, env)
    if (env.errors.length) throw new Error(`console errors: ${env.errors.join(' | ')}`)
    results.push({ name, pass: true })
  }
  catch (e) {
    results.push({ name, pass: false, error: String(e.message || e).slice(0, 600) })
    await env.page.screenshot({ path: path.join(outDir, `${browserName}-${name.split(' ')[0]}-fail.png`) }).catch(() => {})
  }
  finally { await env.context.close() }
}

const tests = await import('./lib/dlab-journeys.mjs')
await tests.default({ test, bench, st, wait, pixel, screen, dragWorld, outDir, browserName, aiRequests })

await browser.close()
await server.close()
for (const r of results) console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.pass ? '' : `\n      ${r.error}`}`)
const failed = results.filter(r => !r.pass).length
console.log(`\nDynamic Lab E2E (${browserName}): ${results.length - failed}/${results.length} passed`)
process.exit(failed ? 1 : 0)
