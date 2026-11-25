// ChemLab 7.0 round 4 — evidence for the copper–ammonia complex and the 3D close-ups (real app, Playwright/Chromium).
// Usage: node scripts/dlab-round4-evidence.mjs [baseUrl] → reports/chemlab-7.0/final/round4/<SHOTS_DIR|shots>/
// The reagents are added through the app's own command API (the same commands the pour/drop UI sends); the X06 journey
// in dlab-e2e.mjs separately drives the same Sandbox cards with real pointer input.
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const base = process.argv[2] || 'http://localhost:5173/'
const out = path.resolve(root, 'reports', 'chemlab-7.0', 'final', 'round4', process.env.SHOTS_DIR || 'shots')
await fs.mkdir(out, { recursive: true })
const browser = await chromium.launch({ headless: true })
const errors = []
const facts = []

async function page({ video = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, ...(video ? { recordVideo: { dir: out, size: { width: 1280, height: 800 } } } : {}) })
  await ctx.addInitScript(() => { try { localStorage.setItem('chemlab-dlab-onboarded', '1'); localStorage.setItem('chemlab-dlab-tip-tongs', '1') } catch {} })
  const p = await ctx.newPage()
  p.on('pageerror', e => errors.push(String(e)))
  p.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  await p.goto(`${base}#dlab`)
  await p.waitForFunction(() => window.ChemLabDynamicLab?.ready, null, { timeout: 30000 })
  p.L = (fn, a) => p.evaluate(([f, x]) => new Function('L', 'a', `return (${f})(L, a)`)(window.ChemLabDynamicLab, x), [fn.toString(), a])
  return p
}
const sideTab = async (p, name) => { // as the E2E journeys do: open the side drawer, then its tab
  if (!(await p.locator('.dlab-sidetabs').isVisible())) await p.locator('.dlab-fab--side').click()
  await p.getByRole('tab', { name }).click()
}
const shot = async (p, name) => p.screenshot({ path: path.join(out, `${name}.png`), clip: await p.locator('.dlab-stage').boundingBox() })
async function to3d(p) {
  await p.evaluate(() => { const b = document.querySelector('[data-hd="quality"]'); if (b && /Tiết kiệm/.test(b.textContent)) b.click() })
  await p.L(L => L.toggle3d())
  await p.waitForFunction(() => window.ChemLabDynamicLab.is3d() && window.ChemLabDynamicLab.camera3d(), null, { timeout: 30000 })
  await p.evaluate(() => document.querySelector('.dlab-toast')?.setAttribute('hidden', ''))
  await p.waitForTimeout(1200)
}
const state = (p, id) => p.L((L, i) => { const c = L.state.objects.find(o => o.id === i); return { ppt: c.contents.precipitates['Cu(OH)2'] || 0, pH: c.pH, title: document.querySelector('.dlab-chip-title, .dlab-sel-title')?.textContent || null, rgb: c.vis.target.slice(0, 3).map(Math.round) } }, id)

// 1. Copper–ammonia sequence, 3D close-up, recorded as video: CuSO₄ → pale-blue Cu(OH)₂ → deep-blue [Cu(NH₃)₄]²⁺.
{
  const p = await page({ video: true })
  const id = await p.L(L => { for (const o of [...L.state.objects]) L.dispatch({ type: 'remove', id: o.id }, { record: false }); const v = L.dispatch({ type: 'add', equipmentType: 'beaker100', x: 300, y: 0 }).id; L.dispatch({ type: 'addReagentTo', id: v, reagent: 'cuso4', mL: 5 }); L.dispatch({ type: 'addReagentTo', id: v, reagent: 'water', mL: 20 }); L.fit(); return v })
  await to3d(p)
  await p.L((L, i) => L.select(i), id)
  await p.locator('[data-tb="focus3d"]').click()
  await p.waitForTimeout(1500)
  await shot(p, 'r4-ammine-1-cuso4')
  facts.push(['CuSO₄ 5 mL + nước 20 mL', await state(p, id)])
  const steps = [[2, 'r4-ammine-2-cu-oh-2', 'NH₃ 2 M tổng 2 mL'], [5, 'r4-ammine-3-partly-dissolved', 'NH₃ 2 M tổng 7 mL'], [23, 'r4-ammine-4-deep-blue', 'NH₃ 2 M tổng 30 mL']]
  for (const [mL, name, what] of steps) {
    for (let i = 0; i < mL; i += 1) { await p.L((L, i2) => L.dispatch({ type: 'addReagentTo', id: i2, reagent: 'nh3-2m', mL: 1 }), id); await p.waitForTimeout(250) }
    // Stir with the rod, as the procedure says (NH₃ solution is lighter than water and stays on top unstirred).
    for (let i = 0; i < 4; i += 1) { await p.L((L, i2) => L.dispatch({ type: 'stir', id: i2, amount: 1 }), id); await p.waitForTimeout(400) }
    await p.waitForTimeout(2500)
    await shot(p, name)
    facts.push([what, await state(p, id)])
  }
  // The same bench in 2D, with the observation panel open.
  await p.L(L => L.toggle3d())
  await p.waitForTimeout(1500)
  await sideTab(p, 'Quan sát')
  await p.screenshot({ path: path.join(out, 'r4-ammine-5-2d-observations.png') })
  const notes = await p.L(L => L.state.log.map(e => e.text).filter(t => /phức|tan trong NH₃|kết tủa/.test(t)))
  facts.push(['Ghi chú engine', notes])
  const video = p.video()
  await p.context().close()
  await fs.rename(await video.path(), path.join(out, 'r4-ammine-sequence-3d.webm'))
}

// 2. AgCl dissolves in NH₃, AgI does not — side by side, 3D.
{
  const p = await page()
  await p.L(L => {
    for (const o of [...L.state.objects]) L.dispatch({ type: 'remove', id: o.id }, { record: false })
    const a = L.dispatch({ type: 'add', equipmentType: 'beaker100', x: 260, y: 0 }).id
    const b = L.dispatch({ type: 'add', equipmentType: 'beaker100', x: 380, y: 0 }).id
    L.dispatch({ type: 'addReagentTo', id: a, reagent: 'agno3', mL: 10 }); L.dispatch({ type: 'addReagentTo', id: a, reagent: 'nacl', mL: 2 })
    L.dispatch({ type: 'addReagentTo', id: b, reagent: 'agno3', mL: 10 }); L.dispatch({ type: 'addReagentTo', id: b, reagent: 'ki', mL: 10 })
    for (let i = 0; i < 15; i += 1) { L.dispatch({ type: 'addReagentTo', id: a, reagent: 'nh3-2m', mL: 1 }); L.dispatch({ type: 'addReagentTo', id: b, reagent: 'nh3-2m', mL: 1 }) }
    L.fit()
  })
  await p.waitForTimeout(3000)
  await to3d(p)
  await shot(p, 'r4-agcl-dissolves-agi-stays-3d')
  await p.context().close()
}

// 3. Gas while it is being produced (Mg in HCl), close-up; precipitate suspension and settling; metal coating.
for (const [name, setup, wait] of [
  ['r4-closeup-gas-live', L => { const v = L.dispatch({ type: 'add', equipmentType: 'beaker100', x: 300, y: 0 }).id; L.dispatch({ type: 'addReagentTo', id: v, reagent: 'hcl', mL: 40 }); const k = L.dispatch({ type: 'add', equipmentType: 'tongs', x: 300, y: 160 }).id; L.dispatch({ type: 'pick', tool: k, reagent: 'mg', massG: 0.05 }, { confirmed: true }); L.dispatch({ type: 'release', tool: k }, { confirmed: true }); L.dispatch({ type: 'remove', id: k }, { record: false }); return v }, 600],
  ['r4-closeup-precipitate-suspended', L => { const v = L.dispatch({ type: 'add', equipmentType: 'beaker100', x: 300, y: 0 }).id; L.dispatch({ type: 'addReagentTo', id: v, reagent: 'cuso4', mL: 40 }); L.dispatch({ type: 'addReagentTo', id: v, reagent: 'naoh', mL: 8 }); return v }, 300],
  ['r4-closeup-precipitate-settled', L => { const v = L.dispatch({ type: 'add', equipmentType: 'beaker100', x: 300, y: 0 }).id; L.dispatch({ type: 'addReagentTo', id: v, reagent: 'cuso4', mL: 40 }); L.dispatch({ type: 'addReagentTo', id: v, reagent: 'naoh', mL: 8 }); return v }, 12000],
  ['r4-closeup-metal-coat', L => { const v = L.dispatch({ type: 'add', equipmentType: 'beaker100', x: 300, y: 0 }).id; L.dispatch({ type: 'addReagentTo', id: v, reagent: 'cuso4', mL: 40 }); const k = L.dispatch({ type: 'add', equipmentType: 'tongs', x: 300, y: 160 }).id; L.dispatch({ type: 'pick', tool: k, reagent: 'fe', massG: 2 }, { confirmed: true }); L.dispatch({ type: 'release', tool: k }, { confirmed: true }); L.dispatch({ type: 'remove', id: k }, { record: false }); return v }, 9000]
]) {
  const p = await page()
  await p.click('[data-speed="4"]').catch(() => {})
  const id = await p.L((L, f) => { for (const o of [...L.state.objects]) L.dispatch({ type: 'remove', id: o.id }, { record: false }); const v = new Function('return ' + f)()(L); L.fit(); return v }, setup.toString())
  await to3d(p)
  await p.waitForTimeout(wait)
  await p.L((L, i) => L.select(i), id)
  await p.locator('[data-tb="focus3d"]').click()
  await p.waitForTimeout(1200)
  await shot(p, name)
  await p.context().close()
}

// 4. Sandbox: the Discover tab with the new complex cards.
{
  const p = await page()
  await sideTab(p, 'Khám phá')
  await p.waitForTimeout(600)
  await p.getByText('Phức chất', { exact: false }).first().scrollIntoViewIfNeeded().catch(() => {})
  await p.waitForTimeout(400)
  await p.screenshot({ path: path.join(out, 'r4-sandbox-discover.png') })
  await p.context().close()
}

await browser.close()
await fs.writeFile(path.join(out, 'r4-facts.json'), JSON.stringify({ facts, errors }, null, 2))
console.log(JSON.stringify(facts, null, 1))
console.log(errors.length ? `console errors:\n${errors.join('\n')}` : 'console errors: 0')
