// Experiment Library phase 2 evidence (real app, Chromium): Discover tab with the three groups at laptop sizes (light/dark),
// then representative experiments done through the action bar, captured in 2D and 3D.
// Usage: node scripts/dlab-library-shot2.mjs <baseUrl> <outDir> [experiment ids, comma-separated]
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
  const TOOLS = ['bottle', 'tongs', 'spatula', 'electrodes', 'power', 'bridge', 'voltmeter']
  const vessels = laid.filter(o => !TOOLS.includes(o.type)).map(o => o.id)
  const tool = Object.fromEntries(laid.filter(o => TOOLS.includes(o.type)).map(o => [o.type, o.id]))
  // Electrochemistry steps use the same commands as the Chi tiết controls (the UI path is covered by the EXP E2E).
  const cmd = (c, confirmed = true) => page.evaluate(([c, k]) => window.ChemLabDynamicLab.dispatch(c, { confirmed: k }), [c, confirmed])
  const bottle = Object.fromEntries(laid.filter(o => o.type === 'bottle').map(o => [o.reagent, o.id]))
  const tongs = laid.find(o => o.type === 'tongs')?.id
  const sel = oid => page.evaluate(x => window.ChemLabDynamicLab.select(x), oid)
  for (const s of e.steps) {
    const a = s.act
    if (a.dip != null) { const v = await page.evaluate(id => { const L = window.ChemLabDynamicLab; const o = L.state.objects.find(x => x.id === id); return { x: o.x, y: o.y, top: L.surface(id) } }, vessels[a.dip]); await cmd({ type: 'move', id: tool.electrodes, x: v.x, y: Math.max(v.y + 3, v.top - a.mm) }); continue }
    if (a.power != null) { await cmd({ type: 'wire', from: tool.power, to: tool.electrodes }); await cmd({ type: 'power', id: tool.power, on: true, volts: a.power }); continue }
    if (a.bridge) { await cmd({ type: 'link', id: tool.bridge, a: vessels[a.bridge[0]], b: vessels[a.bridge[1]] }); continue }
    if (a.voltmeter) { for (const m of a.voltmeter) { const id = await (await page.waitForFunction(q => window.ChemLabDynamicLab.state.objects.find(o => o.type === 'solid' && o.reagent === q.m && q.v.includes(o.in))?.id, { m, v: vessels })).jsonValue(); await cmd({ type: 'wire', from: tool.voltmeter, to: id }) } continue }
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
      a.state.every(x => { if (x.object) { const o = L.state.objects.find(y => y.id === a.tool[x.object]); return (!x.reading || (o.reading >= x.reading[0] && o.reading <= x.reading[1])) && (!x.deposit || (o.cuDeposit || 0) > 0) }
        const d = L.describe(a.vessels[x.vessel]); return (!x.pH || (d.pH >= x.pH[0] && d.pH <= x.pH[1])) && (!x.coat || d.solids.some(s => (s.coat[x.coat] || 0) > 0)) && (!x.gas || (d.gasReleased[x.gas] || 0) > 0) }) },
  { expect: e.expect, state: e.expectState || [], vessels, tool }, { timeout: 180000 })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(1200)
  vesselsOf[id] = vessels
  facts[id] = await page.evaluate(([v, t]) => { const L = window.ChemLabDynamicLab; const o = id => L.state.objects.find(x => x.id === id); return { vessels: v.map(x => { const d = L.describe(x); return { pH: d.pH, coat: d.solids.map(s => s.coat), gas: d.gasReleased, precipitates: d.precipitates, dissolved: d.dissolved } }), voltmeter: t.voltmeter ? o(t.voltmeter).reading : undefined, cathodeCu: t.electrodes ? o(t.electrodes).cuDeposit : undefined } }, [vessels, tool])
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
const IDS = process.argv[4] ? process.argv[4].split(',') : ['exp-phenolphthalein-endpoint', 'exp-weak-acid-titration', 'exp-iron-copper-sulfate', 'exp-metals-in-acid', 'exp-copper-silver-nitrate']
for (const id of IDS) {
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
