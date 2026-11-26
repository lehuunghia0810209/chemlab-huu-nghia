// Experiment Library phase 2 evidence (real app, Chromium): Discover tab with the three groups at laptop sizes (light/dark),
// then representative experiments done through the action bar, captured in 2D and 3D.
// Usage: node scripts/dlab-library-shot2.mjs <baseUrl> <outDir>
import path from 'node:path'
import fs from 'node:fs/promises'
import { chromium } from 'playwright-core'
import { EXPERIMENTS } from '../src/dlab/data/experiments.js'

const base = process.argv[2] || 'http://[::1]:5180/'
const out = path.resolve(process.argv[3] || 'reports/chemlab-7.0/library/shots')
await fs.mkdir(out, { recursive: true })
const browser = await chromium.launch({ headless: true })
const facts = {}
const vesselsOf = {}

async function open(viewport, theme = 'light') {
  const page = await browser.newPage({ viewport })
  await page.addInitScript(() => { try { localStorage.setItem('chemlab-dlab-onboarded', '1') } catch {} })
  await page.goto(`${base}#dlab`)
  await page.waitForFunction(() => window.ChemLabDynamicLab?.ready)
  await page.evaluate(t => { document.documentElement.dataset.theme = t }, theme)
  await page.getByRole('button', { name: 'Tự do', exact: true }).click()
  if (!(await page.locator('.dlab-sidetabs').isVisible())) await page.locator('.dlab-fab--side').click()
  await page.getByRole('tab', { name: 'Khám phá' }).click()
  return page
}
const confirm = async page => { const b = page.getByRole('button', { name: 'Tôi hiểu, tiếp tục' }); if (await b.isVisible({ timeout: 700 }).catch(() => false)) await b.click() }

async function run(page, id) {
  const e = EXPERIMENTS.find(x => x.id === id)
  const card = page.locator(`[data-exp-card="${id}"]`)
  await card.locator('summary').click()
  const before = await page.evaluate(() => window.ChemLabDynamicLab.state.objects.map(o => o.id))
  await card.getByRole('button', { name: 'Bày dụng cụ' }).click()
  // Only what the card laid out (the free bench may already hold the student's own equipment).
  const laid = await page.evaluate(b => window.ChemLabDynamicLab.state.objects.filter(o => !b.includes(o.id)).map(o => ({ id: o.id, type: o.type, reagent: o.reagent || null })), before)
  const vessels = laid.filter(o => !['bottle', 'tongs', 'spatula'].includes(o.type)).map(o => o.id)
  const bottle = Object.fromEntries(laid.filter(o => o.type === 'bottle').map(o => [o.reagent, o.id]))
  const tongs = laid.find(o => o.type === 'tongs')?.id
  const sel = oid => page.evaluate(x => window.ChemLabDynamicLab.select(x), oid)
  for (const s of e.steps) {
    if (s.act.pour || s.act.drops) {
      await sel(bottle[s.act.pour || s.act.drops])
      await page.locator('[data-qa-in="to"]').selectOption(vessels[s.act.to])
      if (s.act.drops) await page.locator('.dlab-actionbar [data-qa="drops"]').click()
      else { await page.locator('[data-qa-in="ml"]').fill(String(s.act.mL)); await page.locator('.dlab-actionbar [data-qa="pour"]').click() }
      await confirm(page)
      continue
    }
    await sel(tongs)
    await page.locator('[data-qa-in="solid"]').selectOption(s.act.solid)
    await page.locator('[data-qa-in="mass"]').fill(String(s.act.massG))
    await page.locator('.dlab-actionbar [data-qa="pick"]').click()
    await confirm(page)
    await page.locator('[data-qa-in="to"]').selectOption(vessels[s.act.to])
    await page.locator('.dlab-actionbar [data-qa="drop-solid"]').click()
    await confirm(page)
  }
  // Wait (at 4x) until the expected events and final-state checks of the experiment hold, as the E2E does.
  await page.evaluate(() => { window.ChemLabDynamicLab.state.speed = 4 })
  await page.waitForFunction(a => { const L = window.ChemLabDynamicLab
    return a.expect.every(x => L.events().some(ev => ev.container === a.vessels[x.vessel] && ev.key.startsWith(x.key))) &&
      a.state.every(x => { const d = L.describe(a.vessels[x.vessel]); return (!x.pH || (d.pH >= x.pH[0] && d.pH <= x.pH[1])) && (!x.coat || d.solids.some(s => (s.coat[x.coat] || 0) > 0)) && (!x.gas || (d.gasReleased[x.gas] || 0) > 0) }) },
  { expect: e.expect, state: e.expectState || [], vessels }, { timeout: 120000 })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(1200)
  vesselsOf[id] = vessels
  facts[id] = await page.evaluate(v => v.map(x => { const d = window.ChemLabDynamicLab.describe(x); return { pH: d.pH, coat: d.solids.map(s => s.coat), gas: d.gasReleased } }), vessels)
}

// 1. Library tab at laptop sizes, light and dark.
for (const [w, h] of [[1280, 720], [1366, 768], [1440, 900]]) {
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark' && w !== 1366) continue
    const page = await open({ width: w, height: h }, theme)
    await page.screenshot({ path: path.join(out, `library-${w}x${h}-${theme}.png`) })
    await page.close()
  }
}
// 2. Search + filter.
{
  const page = await open({ width: 1366, height: 768 })
  await page.locator('[data-exp-search]').fill('axit yeu')
  await page.screenshot({ path: path.join(out, 'library-search-axit-yeu.png') })
  await page.close()
}
// 3. Representative experiments, 2D then 3D.
for (const id of ['exp-phenolphthalein-endpoint', 'exp-weak-acid-titration', 'exp-iron-copper-sulfate', 'exp-metals-in-acid', 'exp-copper-silver-nitrate']) {
  const page = await open({ width: 1440, height: 900 })
  await run(page, id)
  await page.screenshot({ path: path.join(out, `${id}-2d.png`) })
  // Close-up of the first vessel (2D) so colour, deposit and bubbles can be read.
  const box = await page.evaluate(id => { const L = window.ChemLabDynamicLab; const o = L.state.objects.find(x => x.id === id); const a = L.worldToScreen(o.x - 45, 95); const b = L.worldToScreen(o.x + 45, -5); return { x: a.x, y: a.y, width: b.x - a.x, height: b.y - a.y } }, vesselsOf[id][0])
  await page.screenshot({ path: path.join(out, `${id}-2d-closeup.png`), clip: box, scale: 'device' })
  await page.evaluate(() => window.ChemLabDynamicLab.toggle3d())
  await page.waitForFunction(() => window.ChemLabDynamicLab.is3d())
  await page.waitForTimeout(1500)
  await page.screenshot({ path: path.join(out, `${id}-3d.png`) })
  await page.close()
}
await fs.writeFile(path.join(out, 'facts.json'), JSON.stringify(facts, null, 1))
await browser.close()
console.log('ok', out, JSON.stringify(facts))
