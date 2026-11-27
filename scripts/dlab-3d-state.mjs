// 3D state verification: for representative phenomena, the canonical state (describe) is compared with pixels read
// from the real 3D view, next to a reference beaker of water. Pixels are a check that the drawing follows the state,
// not scientific evidence on their own. Usage: node scripts/dlab-3d-state.mjs <baseUrl> <outDir>
import path from 'node:path'
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'

const base = process.argv[2] || 'http://[::1]:5180/'
const out = path.resolve(process.argv[3] || 'reports/chemlab-7.0/phase3/3d-state')
await fs.mkdir(out, { recursive: true })
const browser = await chromium.launch({ headless: true })

// Each scenario: liquids poured into beaker T (and R = water reference), an optional solid, seconds of model time,
// a state check on describe(T) and a pixel check comparing mean colours of T and R in 3D.
const SCENARIOS = [
  { id: 'indicator', pours: [['naoh', 20], ['phenolphthalein', 0.15]], run: 30,
    state: d => d.pH > 12, pixel: true, what: 'phenolphtalein trong NaOH: hồng' },
  { id: 'precipitate', pours: [['fecl3', 10], ['naoh', 20]], run: 30,
    state: d => (d.precipitates['Fe(OH)3'] || 0) > 0, pixel: true, what: 'Fe(OH)₃↓ nâu đỏ' },
  { id: 'dissolution', pours: [['cuso4', 20], ['naoh', 10], ['hcl', 20]], run: 30,
    state: d => !Object.values(d.precipitates).some(n => n > 1e-6) && (d.dissolved['Cu2+'] || 0) > 0, pixel: true, what: 'Cu(OH)₂ tan trong HCl: dung dịch xanh, không còn kết tủa',
    knownLimit: 'P2: dung dịch màu nhạt (Cu²⁺ ≈ 0,2 M, độ phủ 0,34) gần như không thấy màu trong 3D; 2D và state đúng' },
  { id: 'complex', pours: [['cuso4', 5], ['nh3-2m', 30]], run: 30,
    state: d => (d.complexes['Cu2+'] || 0) > 0, pixel: true, what: '[Cu(NH₃)₄]²⁺ xanh thẫm' },
  { id: 'coat', pours: [['cuso4', 40]], solid: ['fe', 2], run: 40,
    state: d => d.solids.some(s => (s.coat.Cu || 0) > 0), pixel: null, what: 'Cu bám trên đinh sắt (xem ảnh)' },
  { id: 'gas', pours: [['hcl', 30]], solid: ['mg', 0.05], run: 4,
    state: d => (d.gasReleased.H2 || 0) > 0, pixel: null, what: 'Mg + HCl: bọt H₂ (xem ảnh)' }
]

const results = []
for (const sc of SCENARIOS) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors = []
  page.on('pageerror', e => errors.push(String(e)))
  await page.addInitScript(() => { try { localStorage.setItem('chemlab-dlab-onboarded', '1') } catch {} })
  await page.goto(`${base}#dlab`)
  await page.waitForFunction(() => window.ChemLabDynamicLab?.ready)
  await page.getByRole('button', { name: 'Tự do', exact: true }).click()
  const ids = await page.evaluate(sc => {
    const L = window.ChemLabDynamicLab
    L.dispatch({ type: 'cleanup' }, { record: false })
    for (const o of [...L.state.objects]) L.dispatch({ type: 'remove', id: o.id }, { record: false })
    const R = L.dispatch({ type: 'add', equipmentType: 'beaker100', x: 260, y: 0 }, { record: false }).id
    const T = L.dispatch({ type: 'add', equipmentType: 'beaker100', x: 380, y: 0 }, { record: false }).id
    L.dispatch({ type: 'addReagentTo', id: R, reagent: 'water', mL: sc.pours.reduce((s, p) => s + p[1], 0) }, { record: false })
    for (const [reagent, mL] of sc.pours) L.dispatch({ type: 'addReagentTo', id: T, reagent, mL }, { record: false, confirmed: true })
    if (sc.solid) {
      const tg = L.dispatch({ type: 'add', equipmentType: 'tongs', x: 520, y: 0 }, { record: false }).id
      L.dispatch({ type: 'move', id: tg, x: 380, y: 160 }, { record: false })
      L.dispatch({ type: 'pick', tool: tg, reagent: sc.solid[0], massG: sc.solid[1] }, { confirmed: true, record: false })
      L.dispatch({ type: 'release', tool: tg }, { confirmed: true, record: false })
      L.dispatch({ type: 'move', id: tg, x: 560, y: 0 }, { record: false })
    }
    L.state.speed = 4
    return { R, T }
  }, { pours: sc.pours, solid: sc.solid || null })
  await page.waitForFunction(a => window.ChemLabDynamicLab.state.t >= a, sc.run, { timeout: 120000 })
  await page.evaluate(() => { window.ChemLabDynamicLab.state.paused = true })
  const d = await page.evaluate(id => window.ChemLabDynamicLab.describe(id), ids.T)
  // "Đồ họa: Cao" (the default with a GPU). Headless Chromium has no GPU and falls back to "Tiết kiệm", whose liquid
  // body is drawn almost clear; the check is made at "Cao", as a student with a GPU sees it.
  await page.evaluate(() => window.ChemLabDynamicLab.toggle3d())
  await page.waitForFunction(() => window.ChemLabDynamicLab.is3d())
  await page.waitForTimeout(800)
  if ((await page.locator('[data-hd="quality"]').textContent()).includes('Tiết kiệm')) { await page.locator('.dlab-menu summary').click(); await page.locator('[data-hd="quality"]').click() }
  const quality = (await page.locator('[data-hd="quality"]').textContent()).trim()
  await page.evaluate(() => window.ChemLabDynamicLab.toggle3d())
  await page.waitForFunction(() => !window.ChemLabDynamicLab.is3d())
  await page.evaluate(() => window.ChemLabDynamicLab.toggle3d())
  await page.waitForFunction(() => window.ChemLabDynamicLab.is3d())
  await page.locator('.dlab-3d canvas').waitFor()
  await page.waitForTimeout(2500)
  await page.keyboard.press('Escape')
  const shot = path.join(out, `${sc.id}-3d.png`)
  await page.screenshot({ path: shot })
  // Mean colour of a 14 px wide strip through each liquid column (the canvas is read back from the screenshot).
  // A vertical strip through the liquid column, from 20 % above the bottom to 15 % below the surface.
  const at = await page.evaluate(ids => {
    const L = window.ChemLabDynamicLab
    const p = id => { const o = L.state.objects.find(x => x.id === id); const top = L.surface(id); const lo = L.worldToScreen3d(o.x, o.y + 2 + (top - o.y - 2) * 0.2); const hi = L.worldToScreen3d(o.x, top - (top - o.y - 2) * 0.15); return { x: lo.x, y: (lo.y + hi.y) / 2, h: Math.max(6, lo.y - hi.y) } }
    return { R: p(ids.R), T: p(ids.T) }
  }, ids)
  const mean = async q => {
    const buf = await page.screenshot({ clip: { x: q.x - 7, y: q.y - q.h / 2, width: 14, height: q.h } })
    return page.evaluate(async b64 => {
      const img = new Image(); img.src = `data:image/png;base64,${b64}`; await img.decode()
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height
      const g = c.getContext('2d'); g.drawImage(img, 0, 0)
      const px = g.getImageData(0, 0, c.width, c.height).data; let r = 0, gg = 0, b = 0
      for (let i = 0; i < px.length; i += 4) { r += px[i]; gg += px[i + 1]; b += px[i + 2] }
      const n = px.length / 4; return { r: Math.round(r / n), g: Math.round(gg / n), b: Math.round(b / n) }
    }, buf.toString('base64'))
  }
  const t = await mean(at.T); const r = await mean(at.R)
  // The drawing follows the state when the colour shift T − R on screen points the same way as the shift the state
  // asks for (vis.target of T minus that of R): cosine ≥ 0.8 and a visible hue shift (≥ 12 of 255).
  const tg = await page.evaluate(ids => { const L = window.ChemLabDynamicLab; const v = id => L.state.objects.find(x => x.id === id).vis.target; return { T: v(ids.T), R: v(ids.R) } }, ids)
  // Hue only: the mean of the three channels (lightness) is removed — water is drawn nearly clear over the dark bench,
  // a coloured solution more opaque, so every channel rises and would swamp the hue.
  const chroma = v => { const m = (v[0] + v[1] + v[2]) / 3; return v.map(x => x - m) }
  const dS = chroma([t.r - r.r, t.g - r.g, t.b - r.b])
  const dE = chroma([0, 1, 2].map(i => tg.T[i] - tg.R[i]))
  const norm = v => Math.hypot(...v)
  const cos = dS.reduce((s, x, i) => s + x * dE[i], 0) / (norm(dS) * norm(dE) || 1)
  const stateOk = sc.state(d)
  const pixelOk = sc.pixel ? cos >= 0.8 && norm(dS) >= 12 : null
  results.push({ id: sc.id, what: sc.what, quality, stateOk, pixelOk, pixel: { test: t, reference: r, screenShift: dS, stateShift: dE, cosine: +cos.toFixed(3) }, target: tg, pH: d.pH, precipitates: d.precipitates, complexes: d.complexes, coat: d.solids.map(s => s.coat), gas: d.gasReleased, errors, shot: path.basename(shot) })
  console.log(`${stateOk && pixelOk !== false && !errors.length ? 'PASS' : 'FAIL'}  ${sc.id} [${quality}]: ${sc.what} — state ${stateOk}, pixel ${pixelOk} cos ${cos.toFixed(2)} |Δ| ${norm(dS).toFixed(0)} T ${JSON.stringify(t)} R ${JSON.stringify(r)}${errors.length ? ` errors ${errors}` : ''}`)
  await page.close()
}
await fs.writeFile(path.join(out, '3d-state.json'), JSON.stringify(results, null, 1))
await browser.close()
// A failing pixel check on a recorded limitation is still reported as FAIL, but does not stop the run; a state failure,
// a page error or an unrecorded pixel failure does.
const failed = results.filter(x => !x.stateOk || x.pixelOk === false || x.errors.length)
const known = failed.filter(x => x.stateOk && !x.errors.length && SCENARIOS.find(s => s.id === x.id).knownLimit)
console.log(`3D state: ${results.length - failed.length}/${results.length} pass; known limitation: ${known.map(x => `${x.id} (${SCENARIOS.find(s => s.id === x.id).knownLimit})`).join('; ') || 'none'}`)
assert.equal(failed.length - known.length, 0)
