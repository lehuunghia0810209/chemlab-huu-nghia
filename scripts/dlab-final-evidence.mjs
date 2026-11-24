// ChemLab 7.0 — screenshots for the complete-rebuild acceptance report (3D bench per guided lab at both
// graphics qualities, solvent and iodide scenes). Usage: node scripts/dlab-final-evidence.mjs [label] [baseUrl]
// → reports/chemlab-7.0/final/shots/<label>-*.png
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const label = process.argv[2] || 'after'
const base = process.argv[3] || 'http://localhost:5173/'
const out = path.join(root, 'reports', 'chemlab-7.0', 'final', 'shots')
await fs.mkdir(out, { recursive: true })
const browser = await chromium.launch({ headless: true })
const errors = []

async function page(width = 1440, height = 900) {
  const ctx = await browser.newContext({ viewport: { width, height } })
  await ctx.addInitScript(() => { try { localStorage.setItem('chemlab-dlab-onboarded', '1'); localStorage.setItem('chemlab-dlab-tip-tongs', '1') } catch {} })
  const p = await ctx.newPage()
  p.on('pageerror', e => errors.push(String(e)))
  p.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  await p.goto(`${base}#dlab`)
  await p.waitForFunction(() => window.ChemLabDynamicLab?.ready, null, { timeout: 30000 })
  p.L = (fn, a) => p.evaluate(([f, x]) => new Function('L', 'a', `return (${f})(L, a)`)(window.ChemLabDynamicLab, x), [fn.toString(), a])
  return p
}
const stage = p => p.locator('.dlab-stage').boundingBox()
const shot = async (p, name) => p.screenshot({ path: path.join(out, `${label}-${name}.png`), clip: await stage(p) })

async function to3d(p, quality) {
  if (quality === 'high') { // pick "Cao" explicitly, as a user with a GPU gets by default
    await p.evaluate(() => { const b = document.querySelector('[data-hd="quality"]'); if (b && /Tiết kiệm/.test(b.textContent)) b.click() })
  }
  await p.L(L => L.toggle3d())
  await p.waitForFunction(() => window.ChemLabDynamicLab.is3d() && window.ChemLabDynamicLab.camera3d(), null, { timeout: 30000 })
  await p.evaluate(() => document.querySelector('.dlab-toast')?.setAttribute('hidden', ''))
  await p.waitForTimeout(1500)
}

for (const quality of ['high', 'low']) {
  for (const lab of ['acid-base', 'precipitate', 'metals', 'electrolysis', 'organic']) {
    const p = await page()
    await p.L((L, id) => L.startGuided(id), lab)
    await p.waitForTimeout(400)
    await p.L(L => L.fastForward(3))
    await to3d(p, quality)
    await shot(p, `3d-${quality}-${lab}`)
    await p.context().close()
  }
}

// Sandbox scenes from the new models: oil in ethanol vs water, CuCl₂ + KI.
{
  const p = await page()
  const ids = await p.L(L => {
    const add = (t, x, e = {}) => L.dispatch({ type: 'add', equipmentType: t, x, y: 0, ...e }).id
    const a = add('beaker100', 220); const b = add('beaker100', 330); const c = add('beaker100', 440)
    L.dispatch({ type: 'addReagentTo', id: a, reagent: 'water', mL: 40 }); L.dispatch({ type: 'addReagentTo', id: a, reagent: 'oil', mL: 15 })
    L.dispatch({ type: 'addReagentTo', id: b, reagent: 'ethanol', mL: 40 }); L.dispatch({ type: 'addReagentTo', id: b, reagent: 'oil', mL: 15 })
    L.dispatch({ type: 'addReagentTo', id: c, reagent: 'cucl2', mL: 20 }); L.dispatch({ type: 'addReagentTo', id: c, reagent: 'ki', mL: 30 })
    L.fit()
    return { a, b, c }
  })
  await p.waitForTimeout(2500)
  await shot(p, '2d-oil-water-ethanol-cui')
  await to3d(p, 'high')
  await shot(p, '3d-high-oil-water-ethanol-cui')
  await p.context().close()
  console.log(JSON.stringify(ids))
}

await browser.close()
console.log(errors.length ? `console errors:\n${errors.join('\n')}` : 'console errors: 0')
