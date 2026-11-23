// ChemLab 7.0 Dynamic Lab — reproduction journey for the guided "metals" lab (iron nail, CuSO₄, HCl),
// driven with real mouse input through visible controls. Runs against any build (before/after a fix):
// every step records what happened instead of failing, so the JSON is evidence either way.
// Usage: node scripts/dlab-tongs-journey.mjs <label> [baseUrl] → reports/chemlab-7.0/tongs/<label>-*.png + <label>.json
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const label = process.argv[2] || 'after'
const base = process.argv[3] || 'http://localhost:5173/'
const outDir = path.join(root, 'reports', 'chemlab-7.0', 'tongs')
await fs.mkdir(outDir, { recursive: true })
const browser = await chromium.launch({ headless: true })
const report = { label, base, steps: [], console: [], requests: [] }
const step = (name, ok, data = {}) => { report.steps.push({ name, ok, ...data }); console.log(ok ? 'OK  ' : 'FAIL', name, JSON.stringify(data)) }

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', deviceScaleFactor: 1 })
await ctx.addInitScript(() => { try { localStorage.setItem('chemlab-dlab-onboarded', '1') } catch {} })
const p = await ctx.newPage()
p.on('console', m => { if (m.type() === 'error') report.console.push(m.text().slice(0, 200)) })
p.on('pageerror', e => report.console.push(`pageerror ${e.message.slice(0, 200)}`))
p.on('request', r => { if (/\/api\/(chat|ai)/.test(r.url())) report.requests.push(r.url()) })
await p.goto(`${base}#dlab`)
await p.waitForFunction(() => window.ChemLabDynamicLab?.ready, null, { timeout: 30000 })
await p.evaluate(() => new Promise(r => { const q = indexedDB.deleteDatabase('chemlab-dynamic-lab'); q.onsuccess = q.onerror = q.onblocked = () => r() }))
await p.reload()
await p.waitForFunction(() => window.ChemLabDynamicLab?.ready, null, { timeout: 30000 })
await p.waitForTimeout(800)

const L = (fn, a) => p.evaluate(([f, x]) => new Function('L', 'a', `return (${f})(L, a)`)(window.ChemLabDynamicLab, x), [fn.toString(), a])
const snap = name => p.screenshot({ path: path.join(outDir, `${label}-${name}.png`) })
const is3d = () => L(L => L.is3d())
// Screen point of a world point in whichever view is showing.
const at = async (x, y) => (await is3d()) ? L((L, a) => L.worldToScreen3d(a.x, a.y), { x, y }) : L((L, a) => L.worldToScreen(a.x, a.y), { x, y })
const obj = id => L((L, id) => JSON.parse(JSON.stringify(L.state.objects.find(o => o.id === id) || null)), id)
const nail = () => L(L => JSON.parse(JSON.stringify(L.state.objects.find(o => o.type === 'solid' && o.reagent === 'fe') || null)))
async function clickWorld(x, y) { const s = await at(x, y); await p.mouse.move(s.x, s.y); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(250) }
async function dragWorld(a, b) {
  const s = await at(a.x, a.y)
  const e = await at(b.x, b.y)
  await p.mouse.move(s.x, s.y); await p.mouse.down()
  for (let i = 1; i <= 12; i += 1) { await p.mouse.move(s.x + (e.x - s.x) * i / 12, s.y + (e.y - s.y) * i / 12); await p.waitForTimeout(16) }
  await p.mouse.up(); await p.waitForTimeout(300)
}
const bar = p.locator('.dlab-actionbar')

// 1. Start the guided lab from the header, like a student.
await p.getByRole('button', { name: 'Có hướng dẫn' }).click()
await p.locator('.dlab-choice', { hasText: 'Kim loại' }).click()
await p.waitForTimeout(500)
const roles = await L(L => { const s = L.state; const by = t => s.objects.filter(o => o.type === t); const b = by('beaker100'); return { cu: b[0].id, acid: b[1].id, dish: by('dish')[0].id, tongs: by('tongs')[0].id } })
step('guided lab started', true, { guided: await L(L => L.guided()) })
await snap('1-start')

// 2. Select the tongs on the bench: what does the action bar offer?
const tongs0 = await obj(roles.tongs)
await clickWorld(tongs0.x, tongs0.y + 60)
const offer = await bar.evaluate(b => ({ solid: b.querySelector('[data-qa-in="solid"]')?.value, mass: b.querySelector('[data-qa-in="mass"]')?.value, text: b.innerText.replace(/\s+/g, ' ').slice(0, 200) }))
step('tongs selected: default solid offered', offer.solid === 'fe', offer)
await snap('2-tongs-selected')

// 3. Choose the iron nail (if not already), take it, drop it into the CuSO₄ beaker.
if (offer.solid !== 'fe') await bar.locator('[data-qa-in="solid"]').selectOption('fe')
await p.waitForTimeout(200)
const massShown = await bar.locator('[data-qa-in="mass"]').inputValue()
step('mass offered for the nail', Number(massShown) >= 1, { massShown })
await bar.getByRole('button', { name: 'Lấy', exact: true }).click()
await p.waitForTimeout(300)
const toSel = bar.locator('[data-qa-in="to"]')
if (await toSel.count()) await toSel.selectOption(roles.cu)
await bar.getByRole('button', { name: 'Thả', exact: true }).click()
await p.waitForTimeout(1200)
let n = await nail()
step('nail is in the CuSO₄ beaker', n?.in === roles.cu, { massG: n?.massG, in: n?.in })

// 4. Wait at 4× and measure real time until the guided step "copper coat" completes (cap 90 s).
await p.getByRole('button', { name: '4×' }).click()
const t0 = Date.now()
const sim0 = await L(L => L.state.t)
let done = 0
while (Date.now() - t0 < 90000) { done = (await L(L => L.guided()?.done)) || 0; if (done >= 2) break; await p.waitForTimeout(500) }
const realS = (Date.now() - t0) / 1000
const simS = (await L(L => L.state.t)) - sim0
step('copper coat step completes at 4×', done >= 2, { realSeconds: +realS.toFixed(1), simSeconds: +simS.toFixed(1), ratio: +(simS / realS).toFixed(2) })
await snap('3-coated')
if (done < 2 && await p.locator('[data-gs="ffwd"]').count()) {
  await p.locator('[data-gs="ffwd"]').click()
  await p.waitForFunction(() => window.ChemLabDynamicLab.guided().done >= 2, null, { timeout: 60000 }).catch(() => {})
  step('fast-forward to the phenomenon', (await L(L => L.guided().done)) >= 2, {})
}

// 5. Take the nail out with the tongs: select tongs, then click the nail inside the beaker.
const tongs1 = await obj(roles.tongs)
await clickWorld(tongs1.x, tongs1.y + 60)
n = await nail()
const cu = await obj(roles.cu)
const nailPoint = { x: cu.x + (n.lx || 0), y: cu.y + 14 } // middle of the nail as drawn (it stands on the bottom)
await clickWorld(nailPoint.x, nailPoint.y)
n = await nail()
step('click the nail with the tongs selected → grabbed', Boolean(n?.holder), { holder: n?.holder ?? null, in: n?.in, selected: await L(L => L.selected()) })
await snap('4-grab-attempt')

if (!n?.holder) {
  // Baseline fallback: try to drag the nail itself out of the beaker.
  await dragWorld(nailPoint, { x: cu.x + 140, y: 20 })
  n = await nail()
  step('drag the nail out directly', n?.in == null, { in: n?.in, holder: n?.holder ?? null })
}
if (n?.holder) {
  // 6. Carry it to the bench and let go: it lies on the bench, chemistry kept.
  const coat = n.coat?.Cu || 0
  const t = await obj(n.holder)
  await dragWorld({ x: t.x, y: t.y + 60 }, { x: cu.x - 120, y: 60 })
  n = await nail()
  step('nail put down on the bench by dragging the tongs', !n.in && !n.holder && n.y === 0, { x: Math.round(n.x), y: n.y, coatCu: n.coat?.Cu, coatKept: (n.coat?.Cu || 0) >= coat })
  await snap('5-on-bench')
  // 7. Undo returns the nail to the beaker; redo by the action bar's "Gắp ra, đặt lên bàn".
  await p.getByRole('button', { name: 'Hoàn tác' }).click()
  await p.waitForTimeout(200)
  n = await nail()
  step('undo reverses the last gesture (put-down → held again)', Boolean(n.holder), { in: n.in, holder: n.holder ?? null })
  // The action bar's "Đặt lên bàn" does the same put-down without dragging.
  await bar.getByRole('button', { name: 'Đặt lên bàn' }).click()
  await p.waitForTimeout(300)
  n = await nail()
  step('"Đặt lên bàn" button puts the held nail on the bench', !n.in && !n.holder && n.y === 0, { x: Math.round(n.x), y: n.y })
}

// 8. Next step through the UI: zinc into the HCl beaker; the tongs now offer zinc for this step.
await p.mouse.click(5, 5)
const tongs2 = await obj(roles.tongs)
await clickWorld(tongs2.x, tongs2.y + 60)
const offer2 = await bar.evaluate(b => ({ solid: b.querySelector('[data-qa-in="solid"]')?.value, mass: b.querySelector('[data-qa-in="mass"]')?.value }))
offer2.selected = await L(L => L.selected())
offer2.tongs = await obj(roles.tongs).then(t => ({ x: t.x, y: t.y, load: t.load }))
step('next step: tongs offer zinc', offer2.solid === 'zn', offer2)
if (offer2.solid !== 'zn') await bar.locator('[data-qa-in="solid"]').selectOption('zn')
await bar.getByRole('button', { name: 'Lấy', exact: true }).click()
if (await toSel.count()) await toSel.selectOption(roles.acid)
await bar.getByRole('button', { name: 'Thả', exact: true }).click()
await p.waitForFunction(() => window.ChemLabDynamicLab.guided().done >= 3, null, { timeout: 30000 }).catch(() => {})
step('zinc step completes', (await L(L => L.guided().done)) >= 3, { done: await L(L => L.guided().done) })
await snap('6-zinc')

// 9. 3D: labels from state; grab the nail in 3D and check 2D sees the same hold.
if (await p.getByRole('button', { name: 'Xem 3D' }).count()) {
  await p.getByRole('button', { name: 'Xem 3D' }).click()
  await p.locator('.dlab-3d canvas').waitFor()
  await p.waitForTimeout(1200)
  const labels = await L(L => (L.labels ? L.labels() : []))
  step('3D labels name vessels by contents', labels.some(t => /CuSO₄/.test(t)) && labels.some(t => /HCl/.test(t)), { labels })
  await snap('7-3d-labels')
  n = await nail()
  if (n && !n.holder && !n.in) {
    const t = await obj(roles.tongs)
    await clickWorld(t.x, t.y + 60)
    await clickWorld(n.x, n.y + 2)
    n = await nail()
    step('3D: tongs selected, click the nail → grabbed', Boolean(n?.holder), { holder: n?.holder ?? null })
    await snap('8-3d-held')
    await p.getByRole('button', { name: 'Xem 2D' }).click()
    await p.waitForTimeout(400)
    const n2 = await nail()
    const count = await L(L => L.state.objects.filter(o => o.reagent === 'fe').length)
    step('switch to 2D while holding: same piece, still held, no duplicate', n2?.holder === n?.holder && count === 1, { holder: n2?.holder ?? null, nails: count })
    await snap('9-2d-held')
  }
}
step('no ChemAI request', report.requests.length === 0, { requests: report.requests.length })
step('no console errors', report.console.length === 0, { console: report.console })
await fs.writeFile(path.join(outDir, `${label}.json`), JSON.stringify(report, null, 2))
await browser.close()
