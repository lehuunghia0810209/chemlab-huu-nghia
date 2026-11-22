// ChemLab 7.0 Dynamic Lab — rendering performance, 3D lazy-load cost and resource lifecycle (Chromium + CDP).
// Usage: npx vite build && node scripts/dlab-perf-audit.mjs  → reports/chemlab-7.0/perf-audit.json
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'
import { chromium } from 'playwright-core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const headed = process.env.HEADED === '1'
const server = await preview({ root, preview: { port: 5100 + Math.floor(Math.random() * 300) }, logLevel: 'silent' })
const base = server.resolvedUrls.local[0]
const browser = await chromium.launch({ headless: !headed, args: ['--enable-precise-memory-info', '--js-flags=--expose-gc'] })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const cdp = await ctx.newCDPSession(page)
await cdp.send('Performance.enable')
await page.addInitScript(() => {
  window.__raf = 0
  const raf = window.requestAnimationFrame.bind(window)
  window.requestAnimationFrame = cb => { window.__raf += 1; return raf(cb) }
})
const out = { env: { browser: `Chromium ${browser.version()}`, headless: !headed, gpu: 'software (SwiftShader) in headless', viewport: '1440×900', os: process.platform } }
const run = (fn, arg) => page.evaluate(([f, a]) => new Function('L', 'a', `return (${f})(L, a)`)(window.ChemLabDynamicLab, a), [fn.toString(), arg])
const metrics = async () => {
  await cdp.send('HeapProfiler.collectGarbage')
  const { metrics } = await cdp.send('Performance.getMetrics')
  const m = Object.fromEntries(metrics.map(x => [x.name, x.value]))
  return { heapMB: +(m.JSHeapUsedSize / 1e6).toFixed(2), listeners: m.JSEventListeners, nodes: m.Nodes, documents: m.Documents }
}
async function open() {
  await page.goto(`${base}#dlab`)
  await page.waitForFunction(() => window.ChemLabDynamicLab?.ready)
}
const scene = n => run((L, n) => {
  L.dispatch({ type: 'cleanup' }, { record: false })
  for (const o of [...L.state.objects]) L.dispatch({ type: 'remove', id: o.id }, { record: false })
  for (let i = 0; i < n; i += 1) {
    const r = L.dispatch({ type: 'add', equipmentType: 'beaker100', x: 120 + i * 95 }, { record: false })
    L.dispatch({ type: 'addReagentTo', id: r.id, reagent: i % 2 ? 'cuso4' : 'agno3', mL: 40 }, { record: false })
    if (n > 4) L.dispatch({ type: 'addReagentTo', id: r.id, reagent: i % 2 ? 'naoh' : 'nacl', mL: 30 }, { record: false })
  }
  L.fit()
  return L.state.objects.reduce((s, o) => s + (o.vis?.parts.length || 0), 0)
}, n)
const fps = () => page.evaluate(() => new Promise(resolve => {
  const t = []
  let last = performance.now()
  const tick = now => { t.push(now - last); last = now; if (t.length < 180) requestAnimationFrame(tick); else { const s = t.slice(10).sort((a, b) => a - b); resolve({ fps: +(1000 / (s.reduce((a, b) => a + b, 0) / s.length)).toFixed(1), p95ms: +s[Math.floor(s.length * 0.95)].toFixed(1) }) } }
  requestAnimationFrame(tick)
}))
const toggle3d = async on => { await run((L, on) => { if (L.is3d() !== on) return L.toggle3d() }, on); if (on) await page.locator('.dlab-3d canvas').waitFor(); await page.waitForTimeout(500) }
const quality = async q => page.evaluate(q => { const b = document.querySelector('[data-hd="quality"]'); if (b && !b.textContent.includes(q === 'low' ? 'Tiết kiệm' : 'Cao')) b.click() }, q)

await open()
// 1. Rendering performance
out.render = {}
for (const [name, n, mode, q] of [['2D thường (3 cốc)', 3, '2d', 'high'], ['2D nhiều dụng cụ + hạt (8 cốc)', 8, '2d', 'high'], ['2D tiết kiệm (8 cốc)', 8, '2d', 'low'], ['3D thường (3 cốc)', 3, '3d', 'high'], ['3D nhiều hạt (8 cốc)', 8, '3d', 'high'], ['3D tiết kiệm (8 cốc)', 8, '3d', 'low']]) {
  await toggle3d(false); await quality(q)
  const particles = await scene(n)
  await toggle3d(mode === '3d')
  await page.waitForTimeout(600)
  out.render[name] = { ...(await fps()), particles }
  console.log(name, JSON.stringify(out.render[name]))
}
await toggle3d(false); await quality('high')
// 2. 3D lazy-load cost (fresh page, cold chunk cache within this context is not guaranteed → measure transfer + time)
{
  const p2 = await ctx.newPage()
  const bytes = []
  p2.on('response', async r => { if (/render3d|sceneHost|three/.test(r.url())) bytes.push({ url: r.url().split('/').pop(), kB: +((await r.body().catch(() => Buffer.alloc(0))).length / 1024).toFixed(1) }) })
  await p2.goto(`${base}#dlab`); await p2.waitForFunction(() => window.ChemLabDynamicLab?.ready)
  const t0 = Date.now()
  await p2.evaluate(() => window.ChemLabDynamicLab.toggle3d())
  await p2.locator('.dlab-3d canvas').waitFor()
  out.lazy3d = { msToCanvas: Date.now() - t0, files: bytes }
  console.log('3D lazy', JSON.stringify(out.lazy3d))
  await p2.close()
}
// 3. Resource lifecycle over repeated cycles
out.cycles = []
await open()
out.cycles.push({ cycle: 0, ...(await metrics()) })
for (let i = 1; i <= 8; i += 1) {
  await scene(4)
  await run(L => { const c = L.state.objects.find(o => o.type === 'beaker100'); L.dispatch({ type: 'stir', id: c.id }) })
  await page.waitForTimeout(500)
  await run(L => L.reset())
  await toggle3d(true); await toggle3d(false)
  await page.evaluate(() => { location.hash = '#home' }); await page.waitForTimeout(400)
  const r0 = await page.evaluate(() => window.__raf); await page.waitForTimeout(1000); const rafIdle = (await page.evaluate(() => window.__raf)) - r0
  await page.evaluate(() => { location.hash = '#dlab' }); await page.waitForTimeout(500)
  out.cycles.push({ cycle: i, rafPerSecWhileAway: rafIdle, webglCanvases: await page.locator('.dlab-3d canvas').count(), dlabShells: await page.locator('.dlab-shell').count(), ...(await metrics()) })
  console.log('cycle', JSON.stringify(out.cycles.at(-1)))
}
await fs.writeFile(path.join(root, 'reports', 'chemlab-7.0', 'perf-audit.json'), JSON.stringify(out, null, 2))
await browser.close(); await server.close()
