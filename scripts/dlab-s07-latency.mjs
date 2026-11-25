// Round 4 — S07 investigation: after the 3rd indicator drop has landed in the model, how many rendered frames and how
// much wall time until the 2D canvas shows the pink at the contact? Optional CPU throttling (Chromium) emulates a slow
// frame rate. Usage: node scripts/dlab-s07-latency.mjs <baseUrl> [browser] [throttle]
import { chromium, firefox, webkit } from 'playwright-core'

const base = process.argv[2] || 'http://[::1]:5180/'
const name = process.argv[3] || 'webkit'
const throttle = Number(process.argv[4] || 1)
const browser = await { chromium, firefox, webkit }[name].launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
await ctx.addInitScript(() => { try { localStorage.setItem('chemlab-dlab-onboarded', '1') } catch {} })
const page = await ctx.newPage()
await page.goto(`${base}#dlab`)
await page.waitForFunction(() => window.ChemLabDynamicLab?.ready, null, { timeout: 30000 })
if (throttle > 1) await (await ctx.newCDPSession(page)).send('Emulation.setCPUThrottlingRate', { rate: throttle })
if (process.env.FIRST) await page.evaluate(() => { window.__S07_FIRST = true })
const out = await page.evaluate(async () => {
  const L = window.ChemLabDynamicLab
  for (const o of [...L.state.objects]) L.dispatch({ type: 'remove', id: o.id }, { record: false })
  const A = L.dispatch({ type: 'add', equipmentType: 'beaker250', x: 300, y: 0 }, { record: false }).id
  L.dispatch({ type: 'addReagentTo', id: A, reagent: 'naoh', mL: 150 }, { record: false })
  const I = L.dispatch({ type: 'add', equipmentType: 'bottle', x: 520, y: 0, reagent: 'phenolphthalein' }, { record: false }).id
  const D = L.dispatch({ type: 'add', equipmentType: 'dropper', x: 520, y: 10 }, { record: false }).id
  L.dispatch({ type: 'aspirate', tool: D, from: I, mL: 1 }) // what "Hút 1 mL" sends
  L.dispatch({ type: 'move', id: D, x: 322, y: 120 })
  L.fit?.()
  await new Promise(r => setTimeout(r, 800))
  L.state.speed = 0.25
  for (let i = 0; i < 3; i += 1) L.dispatch({ type: 'dispense', tool: D, drops: 1 })
  const P = await import('/src/dlab/engine/processes.js')
  window.__trace = []
  window.__modelPink = () => { const o = L.state.objects.find(x => x.id === A); const m = P.fieldMean(o); let best = -999; for (const j of [P.GH - 1, P.GH - 2]) for (let i = 5; i < 9; i += 1) { const col = P.cellColor(o, j * P.GW + i, m); best = Math.max(best, col[0] - col[1]) } return Math.round(best) }
  const c = document.querySelector('.dlab-canvas')
  const pinkAt = () => {
    const r = c.getBoundingClientRect(); const dpr = c.width / r.width
    const s = L.surface(A)
    let best = -999
    for (const x of [316, 320, 324, 328, 332]) for (const dy of [2, 4, 6]) {
      const p = L.worldToScreen(x, s - dy)
      const d = c.getContext('2d').getImageData(Math.round((p.x - r.left) * dpr), Math.round((p.y - r.top) * dpr), 1, 1).data
      best = Math.max(best, d[0] - d[1])
    }
    return best
  }
  const landed = () => (L.state.objects.find(o => o.id === A).contents.indicators.phenolphthalein || 0) > (window.__S07_FIRST ? 0.5 : 2.9)
  let frames = 0; let tLand = null; let fLand = null; const dts = []; let last = performance.now()
  return new Promise(resolve => {
    const tick = now => {
      frames += 1; dts.push(now - last); last = now
      if (tLand == null && landed()) { tLand = now; fLand = frames }
      if (tLand != null && window.__trace) window.__trace.push({ f: frames - fLand, canvas: pinkAt(), model: window.__modelPink() })
      if (tLand != null && pinkAt() > 40) return resolve({ framesAfterLanding: frames - fLand, msAfterLanding: Math.round(now - tLand), meanFrameMs: Math.round(dts.slice(1).reduce((a, b) => a + b, 0) / Math.max(1, dts.length - 1)) })
      if (frames > 600) return resolve({ timeout: true, landed: tLand != null, pink: pinkAt() })
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
})
console.log(JSON.stringify({ browser: name, throttle, ...out }))
if (process.env.TRACE) console.log(JSON.stringify(await page.evaluate(() => window.__trace.filter((_, i) => i % 3 === 0))))
await browser.close()
