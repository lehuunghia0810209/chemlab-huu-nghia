// Round 4 — where the time goes in the P01 scene (8 beakers CuSO₄ + NaOH, 2D bench): Chromium CPU profile (CDP),
// self time grouped by module. Usage: node scripts/dlab-profile-p01.mjs [root] [label] → JSON on stdout.
// arg: a project folder with a built dist/ (default: this repo). Same scene and steps as the P01 E2E test.
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'
import { chromium } from 'playwright-core'

// root may also be a running dev-server URL (unminified modules, so the profile names chemistry.js, render2d.js…).
const arg = process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const label = process.argv[3] || 'build'
const server = arg.startsWith('http') ? null : await preview({ root: path.resolve(arg), preview: { port: 4700 + Math.floor(Math.random() * 200), strictPort: false }, logLevel: 'silent' })
const url = server ? server.resolvedUrls.local[0] : arg
const browser = await chromium.launch({ headless: true })
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await ctx.addInitScript(() => { try { localStorage.setItem('chemlab-dlab-onboarded', '1') } catch {} })
  const page = await ctx.newPage()
  await page.goto(`${url}#dlab`)
  await page.waitForFunction(() => window.ChemLabDynamicLab?.ready, null, { timeout: 30000 })
  await page.evaluate(() => {
    const L = window.ChemLabDynamicLab
    for (const o of [...L.state.objects]) L.dispatch({ type: 'remove', id: o.id }, { record: false })
    for (let i = 0; i < 8; i += 1) { const id = L.dispatch({ type: 'add', equipmentType: 'beaker100', x: 140 + i * 70, y: 0 }, { record: false }).id; L.dispatch({ type: 'addReagentTo', id, reagent: 'cuso4', mL: 40 }, { record: false }) }
    for (const o of L.state.objects) L.dispatch({ type: 'addReagentTo', id: o.id, reagent: 'naoh', mL: 30 }, { record: false })
  })
  await page.waitForTimeout(500)
  const cdp = await ctx.newCDPSession(page)
  await cdp.send('Profiler.enable')
  await cdp.send('Profiler.setSamplingInterval', { interval: 200 })
  await cdp.send('Profiler.start')
  const fps = await page.evaluate(() => new Promise(r => { let n = 0; const t0 = performance.now(); const f = () => { if (++n < 240) requestAnimationFrame(f); else r(240000 / (performance.now() - t0)) }; requestAnimationFrame(f) }))
  const { profile } = await cdp.send('Profiler.stop')
  const dt = {}
  profile.samples.forEach((s, i) => { dt[s] = (dt[s] || 0) + (profile.timeDeltas[i] || 0) })
  const groups = {}
  const fnTop = {}
  let total = 0
  for (const n of profile.nodes) {
    const t = (dt[n.id] || 0) / 1000
    if (!t) continue
    total += t
    const file = (n.callFrame.url.split('/').pop() || n.callFrame.functionName || '(native)').replace(/-[A-Za-z0-9_]{8}\.js$/, '.js')
    groups[file] = (groups[file] || 0) + t
    const k = `${n.callFrame.functionName || '(anon)'} @${file}`
    fnTop[k] = (fnTop[k] || 0) + t
  }
  const sort = o => Object.fromEntries(Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([k, v]) => [k, Math.round(v)]))
  console.log(JSON.stringify({ label, fps: Math.round(fps * 10) / 10, profiledMs: Math.round(total), byFile: sort(groups), topFunctions: sort(fnTop) }, null, 1))
} finally {
  await browser.close()
  await server?.close()
}
