// ChemLab 7.0 Dynamic Lab — visual evidence capture: sets up the key experiments and saves canvas screenshots.
// Usage: node scripts/dlab-visual-audit.mjs [label]   (needs `vite build` first; writes reports/chemlab-7.0/visual/<label>-*.png)
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'
import { chromium } from 'playwright-core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const label = process.argv[2] || 'after'
const outDir = path.join(root, 'reports', 'chemlab-7.0', 'visual')
await fs.mkdir(outDir, { recursive: true })
const server = await preview({ root, preview: { port: 4800 + Math.floor(Math.random() * 300) }, logLevel: 'silent' })
const base = server.resolvedUrls.local[0]
const browser = await chromium.launch({ headless: true })

async function page(scheme = 'light', width = 1440, height = 900) {
  const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: scheme, deviceScaleFactor: 1 })
  const p = await ctx.newPage()
  await p.goto(`${base}#dlab`)
  await p.waitForFunction(() => window.ChemLabDynamicLab?.ready)
  await p.waitForFunction(() => { const b = document.getElementById('chemlab-production-boot'); return !b || !b.isConnected || getComputedStyle(b).display === 'none' || getComputedStyle(b).opacity === '0' }, null, { timeout: 15000 }).catch(() => {})
  await p.waitForTimeout(1200)
  await p.evaluate(() => indexedDB.deleteDatabase('chemlab-dynamic-lab'))
  return { p, ctx }
}
const run = (p, fn, arg) => p.evaluate(([f, a]) => new Function('L', 'a', `return (${f})(L, a)`)(window.ChemLabDynamicLab, a), [fn.toString(), arg])
const setup = (p, spec) => run(p, (L, spec) => {
  L.dispatch({ type: 'cleanup' }, { record: false })
  for (const o of [...L.state.objects]) L.dispatch({ type: 'remove', id: o.id }, { record: false })
  L.state.log = []
  const ids = {}
  for (const [n, s] of Object.entries(spec)) {
    const r = L.dispatch({ type: 'add', equipmentType: s.type, x: s.x, y: s.y ?? 0, reagent: s.reagent }, { record: false })
    ids[n] = r.id
    for (const [reagent, mL] of s.fill || []) L.dispatch({ type: 'addReagentTo', id: r.id, reagent, mL }, { record: false })
  }
  return ids
}, spec)
async function shot(p, name, clip = true) {
  await run(p, L => L.fit && L.fit())
  const box = clip ? await p.locator('.dlab-stage, .dlab-canvas').first().boundingBox() : null
  await p.screenshot({ path: path.join(outDir, `${label}-${name}.png`), clip: box || undefined })
  console.log('saved', `${label}-${name}.png`)
}
const drag = async (p, from, to, steps = 12) => {
  const a = await run(p, (L, a) => L.worldToScreen(a.x, a.y), from)
  const b = await run(p, (L, a) => L.worldToScreen(a.x, a.y), to)
  await p.mouse.move(a.x, a.y); await p.mouse.down(); await p.mouse.move(b.x, b.y, { steps })
}

const scenes = {
  async litmus(p) {
    const ids = await setup(p, { A: { type: 'beaker100', x: 360, fill: [['hcl', 60]] }, B: { type: 'beaker100', x: 560, fill: [['naoh', 60]] } })
    const s = await run(p, (L, id) => L.surface(id), ids.A)
    await run(p, L => L.dispatch({ type: 'newLitmus', x: 460 }, { record: false }))
    await drag(p, { x: 460, y: 155 }, { x: 360, y: s - 14 + 35 })
    await p.waitForTimeout(1600); await shot(p, 'litmus-dip')
    await p.mouse.up()
  },
  async pour(p) {
    await setup(p, { A: { type: 'beaker100', x: 300, fill: [['cuso4', 60]] }, B: { type: 'beaker250', x: 352 } })
    await drag(p, { x: 300, y: 35 }, { x: 300, y: 155 })
    for (let i = 0; i < 15; i += 1) await p.mouse.wheel(0, 100)
    await p.waitForTimeout(1500); await shot(p, 'pour'); await p.mouse.up()
  },
  async indicator(p) {
    const ids = await setup(p, { A: { type: 'beaker250', x: 400, fill: [['naoh', 150]] } })
    await run(p, (L, id) => L.dispatch({ type: 'addReagentTo', id, reagent: 'phenolphthalein', mL: 0.5, u: -0.3, v: 0.95 }, { record: false }), ids.A)
    await p.waitForTimeout(700); await shot(p, 'indicator-0.7s')
    await p.waitForTimeout(3000); await shot(p, 'indicator-3.7s')
  },
  async sodium(p) {
    const ids = await setup(p, { A: { type: 'beaker250', x: 400, fill: [['water', 150], ['phenolphthalein', 0.5]] } })
    await run(p, (L, id) => {
      const A = L.state.objects.find(o => o.id === id)
      const t = L.dispatch({ type: 'add', equipmentType: 'tongs', x: A.x, y: A.y + 140 }, { record: false })
      L.dispatch({ type: 'pick', tool: t.id, reagent: 'na', massG: 0.1 }, { record: false, confirmed: true })
      L.dispatch({ type: 'release', tool: t.id }, { record: false, confirmed: true })
    }, ids.A)
    await p.waitForTimeout(1500); await shot(p, 'sodium-1.5s')
    await p.waitForTimeout(4000); await shot(p, 'sodium-5.5s')
  },
  async precipitate(p) {
    const ids = await setup(p, { A: { type: 'beaker100', x: 380, fill: [['cuso4', 40]] } })
    await run(p, (L, id) => L.dispatch({ type: 'addReagentTo', id, reagent: 'naoh', mL: 20 }, { record: false }), ids.A)
    await p.waitForTimeout(800); await shot(p, 'precipitate-forming')
    await p.waitForTimeout(8000); await shot(p, 'precipitate-settled')
  },
  async damage(p) {
    const ids = await setup(p, { A: { type: 'beaker100', x: 260 }, B: { type: 'beaker100', x: 400 }, C: { type: 'beaker100', x: 540 } })
    await run(p, (L, ids) => {
      const A = L.state.objects.find(o => o.id === ids.A); const B = L.state.objects.find(o => o.id === ids.B); const C = L.state.objects.find(o => o.id === ids.C)
      A.condition = 'WARNING'; B.condition = 'CRACKED'; C.condition = 'UNUSABLE'
    }, ids)
    await p.waitForTimeout(400); await shot(p, 'damage-states')
  },
  async full(p) { await shot(p, 'workspace-light', false) },
}
for (const [name, fn] of Object.entries(scenes)) {
  const { p, ctx } = await page()
  try { await fn(p) } catch (e) { console.log('FAIL', name, e.message.slice(0, 300)) }
  await ctx.close()
}
{ const { p, ctx } = await page('dark'); await shot(p, 'workspace-dark', false); await ctx.close() }
{ const { p, ctx } = await page('light', 390, 844); await shot(p, 'mobile-390', false); await ctx.close() }
await browser.close(); await server.close()
