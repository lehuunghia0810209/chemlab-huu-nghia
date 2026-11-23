// ChemLab 7.0 Dynamic Lab — newcomer usability journey (sodium + water) driven only through visible UI.
// Usage: node scripts/dlab-ux-journey.mjs <label> [baseUrl]   → reports/chemlab-7.0/ux/<label>-*.png + <label>-journey.json
// It records each step a student must do and whether a visible control made it possible. Not a substitute for real users.
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const label = process.argv[2] || 'after'
const base = process.argv[3] || 'http://localhost:5173/'
const outDir = path.join(root, 'reports', 'chemlab-7.0', 'ux')
await fs.mkdir(outDir, { recursive: true })
const browser = await chromium.launch({ headless: true })
const report = { label, base, viewports: {}, steps: [], console: [] }

async function open(width, height, scheme = 'light') {
  const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: scheme, deviceScaleFactor: 1 })
  const p = await ctx.newPage()
  p.on('console', m => { if (m.type() === 'error') report.console.push(m.text().slice(0, 200)) })
  p.on('pageerror', e => report.console.push(`pageerror ${e.message.slice(0, 200)}`))
  await p.goto(`${base}#dlab`)
  await p.waitForFunction(() => window.ChemLabDynamicLab?.ready, null, { timeout: 30000 })
  await p.evaluate(() => { try { localStorage.removeItem('chemlab-dlab-onboarded') } catch {} return new Promise(r => { const q = indexedDB.deleteDatabase('chemlab-dynamic-lab'); q.onsuccess = q.onerror = q.onblocked = () => r() }) })
  await p.reload()
  await p.waitForFunction(() => window.ChemLabDynamicLab?.ready, null, { timeout: 30000 })
  await p.waitForFunction(() => { const b = document.getElementById('chemlab-production-boot'); return !b || !b.isConnected || getComputedStyle(b).display === 'none' || getComputedStyle(b).opacity === '0' }, null, { timeout: 15000 }).catch(() => {})
  await p.waitForTimeout(900)
  return { p, ctx }
}
const snap = (p, name) => p.screenshot({ path: path.join(outDir, `${label}-${name}.png`) })

async function measure(p) {
  return p.evaluate(() => {
    const stage = document.querySelector('.dlab-stage').getBoundingClientRect()
    const v = window.ChemLabDynamicLab.view()
    const buttons = [...document.querySelectorAll('.dlab button')].filter(b => b.offsetParent !== null && b.getBoundingClientRect().width > 0).length
    return { stageW: Math.round(stage.width), stageH: Math.round(stage.height), stageShare: +(stage.width * stage.height / (innerWidth * innerHeight)).toFixed(2), zoom: +v.zoom.toFixed(2), beaker100Px: Math.round(80 * v.zoom), visibleButtons: buttons }
  })
}

const step = (name, ok, note = '') => { report.steps.push({ name, ok, note }); console.log(ok ? 'OK  ' : 'MISS', name, note) }

for (const [w, h] of [[1440, 900], [1920, 1080], [1366, 768], [768, 1024], [390, 844]]) {
  const { p, ctx } = await open(w, h)
  report.viewports[w] = await measure(p)
  await snap(p, `first-${w}`)
  await ctx.close()
}

{
  const { p, ctx } = await open(1440, 900)
  const L = (fn, a) => p.evaluate(([f, x]) => new Function('L', 'a', `return (${f})(L, a)`)(window.ChemLabDynamicLab, x), [fn.toString(), a])
  const visible = async loc => (await loc.count()) > 0 && await loc.first().isVisible()

  step('Có hướng dẫn bước đầu khi mở Lab', await visible(p.locator('.dlab-coach, .dlab-onboard')))
  await snap(p, 'journey-0-open')
  // Skip onboarding if present, as a student who wants to try directly.
  const skip = p.getByRole('button', { name: /Bỏ qua|Đã hiểu/ })
  if (await visible(skip)) await skip.first().click()

  // Water: search the library as a student would.
  const search = p.getByRole('searchbox').or(p.getByRole('textbox', { name: /Tìm/ })).first()
  const libBtn = p.getByRole('button', { name: /Thư viện|Hóa chất & dụng cụ/ })
  if (!(await search.isVisible().catch(() => false)) && await visible(libBtn)) await libBtn.first().click()
  await search.fill('nước')
  await p.waitForTimeout(300)
  const waterItem = p.locator('.dlab-lib-item').filter({ hasText: /Nước cất/ })
  step('Tìm thấy "Nước" trong thư viện', await visible(waterItem))
  if (await visible(waterItem)) await waterItem.first().click()
  await p.waitForTimeout(500)
  await snap(p, 'journey-1-water-bottle')
  let poured = false
  for (const name of [/^Rót .*vào cốc/i, /^Rót$/]) {
    const b = p.getByRole('button', { name })
    if (await visible(b)) { await b.first().click(); poured = true; break }
  }
  await p.waitForTimeout(1200)
  const water = await L(L => Math.max(0, ...L.state.objects.filter(o => !o.stock && o.contents && o.type !== 'dropper').map(o => Object.values(o.contents.liquids).reduce((s, v) => s + v, 0))))
  step('Rót nước vào cốc bằng nút nhìn thấy được', poured && water > 1, `${water.toFixed(1)} mL trong cốc`)
  await snap(p, 'journey-2-water-poured')

  // Phenolphthalein (indicator) — optional but needed to see the colour spread.
  if (!(await search.isVisible().catch(() => false)) && await visible(libBtn)) await libBtn.first().click()
  await search.fill('phenol')
  await p.waitForTimeout(300)
  const phItem = p.locator('.dlab-lib-item').filter({ hasText: /Phenolphtalein/ })
  step('Tìm thấy phenolphtalein', await visible(phItem))
  if (await visible(phItem)) {
    await phItem.first().click()
    await p.waitForTimeout(400)
    for (const name of [/^Nhỏ .*vào cốc/i, /^Rót .*vào cốc/i, /^Rót$/]) {
      const b = p.getByRole('button', { name })
      if (await visible(b)) { await b.first().click(); break }
    }
  }
  await p.waitForTimeout(600)
  const ind = await L(L => L.state.objects.some(o => !o.stock && o.contents && Object.values(o.contents.indicators || {}).some(v => v > 0)))
  step('Thêm chất chỉ thị vào cốc nước', ind)

  // Sodium.
  if (!(await search.isVisible().catch(() => false)) && await visible(libBtn)) await libBtn.first().click()
  await search.fill('natri')
  await p.waitForTimeout(300)
  const naItem = p.locator('.dlab-lib-item').filter({ hasText: /Natri/ })
  step('Tìm thấy natri trong thư viện', await visible(naItem))
  if (await visible(naItem)) await naItem.first().click()
  await p.waitForTimeout(500)
  await snap(p, 'journey-3-after-sodium-click')
  const dlg = p.locator('dialog[open]')
  let sawWarning = false
  for (let i = 0; i < 3 && await dlg.count(); i += 1) {
    const txt = await dlg.innerText()
    if (/an toàn|nguy|cảnh báo/i.test(txt)) sawWarning = true
    await snap(p, `journey-4-dialog-${i}`)
    const okBtn = dlg.getByRole('button', { name: /Đồng ý|tiếp tục|Thả|Xác nhận/i })
    if (!(await okBtn.count())) break
    await okBtn.first().click()
    await p.waitForTimeout(400)
  }
  step('Nhận cảnh báo an toàn trước khi thả natri', sawWarning)
  await p.waitForTimeout(1200)
  await snap(p, 'journey-5-sodium-1s')
  const na = await L(L => { const s = L.state.objects.find(o => o.type === 'solid' && o.reagent === 'na'); return s ? { in: !!s.in, mass: +s.massG.toFixed(4) } : null })
  step('Natri đã vào nước', !!na?.in, JSON.stringify(na))
  await p.waitForTimeout(3500)
  await snap(p, 'journey-6-sodium-5s')
  const obs = await p.locator('.dlab-obs, .dlab-log').first().innerText().catch(() => '')
  report.observationText = obs.slice(0, 1500)
  step('Bảng Quan sát nêu hiện tượng natri', /natri/i.test(obs))
  const b3 = p.getByRole('button', { name: /3D/ })
  if (await visible(b3)) { await b3.first().click(); await p.waitForTimeout(2200); await snap(p, 'journey-7-3d'); step('Mở chế độ 3D', await L(L => L.is3d())) }
  await p.waitForTimeout(8000)
  await snap(p, 'journey-8-3d-later')
  report.sodiumLeft = await L(L => { const s = L.state.objects.find(o => o.type === 'solid' && o.reagent === 'na'); return s ? s.massG : null })
  report.logLength = await L(L => L.state.log.length)
  await ctx.close()
}
// 3. Key phenomena in 2D and 3D (state set up through the test hook, then observed through the real renderers).
{
  const scenes = {
    sodium: L => {
      for (const o of [...L.state.objects]) L.dispatch({ type: 'remove', id: o.id }, { record: false })
      const A = L.dispatch({ type: 'add', equipmentType: 'beaker250', x: 400 }, { record: false })
      L.dispatch({ type: 'addReagentTo', id: A.id, reagent: 'water', mL: 150 }, { record: false })
      L.dispatch({ type: 'addReagentTo', id: A.id, reagent: 'phenolphthalein', mL: 0.3 }, { record: false })
      const t = L.dispatch({ type: 'add', equipmentType: 'tongs', x: 400, y: 132 }, { record: false })
      L.dispatch({ type: 'pick', tool: t.id, reagent: 'na', massG: 0.1 }, { record: false, confirmed: true })
      L.dispatch({ type: 'release', tool: t.id }, { record: false, confirmed: true })
      L.dispatch({ type: 'move', id: t.id, x: 470, y: 0 }, { record: false })
      L.select(A.id)
    },
    precipitate: L => {
      for (const o of [...L.state.objects]) L.dispatch({ type: 'remove', id: o.id }, { record: false })
      const A = L.dispatch({ type: 'add', equipmentType: 'beaker100', x: 380 }, { record: false })
      L.dispatch({ type: 'addReagentTo', id: A.id, reagent: 'cuso4', mL: 40 }, { record: false })
      L.dispatch({ type: 'addReagentTo', id: A.id, reagent: 'naoh', mL: 20 }, { record: false })
      const B = L.dispatch({ type: 'add', equipmentType: 'testTube', x: 470 }, { record: false })
      L.dispatch({ type: 'addReagentTo', id: B.id, reagent: 'naoh', mL: 10 }, { record: false })
      const P = L.dispatch({ type: 'newLitmus', x: 470 }, { record: false })
      L.dispatch({ type: 'move', id: P.id, x: 470, y: 40 }, { record: false })
      L.select(A.id)
    },
    pour: L => {
      for (const o of [...L.state.objects]) L.dispatch({ type: 'remove', id: o.id }, { record: false })
      const A = L.dispatch({ type: 'add', equipmentType: 'beaker100', x: 300 }, { record: false })
      L.dispatch({ type: 'addReagentTo', id: A.id, reagent: 'cuso4', mL: 60 }, { record: false })
      L.dispatch({ type: 'add', equipmentType: 'beaker250', x: 420 }, { record: false })
      L.dispatch({ type: 'add', equipmentType: 'flask', x: 520 }, { record: false })
      L.select(A.id)
    }
  }
  for (const [name, fn] of Object.entries(scenes)) {
    const { p, ctx } = await open(1440, 900)
    await p.evaluate(() => { const s = [...document.querySelectorAll('.dlab-coach [data-coach="skip"]')]; s[0]?.click() })
    await p.evaluate(([f]) => new Function('L', `return (${f})(L)`)(window.ChemLabDynamicLab), [fn.toString()])
    await p.evaluate(() => window.ChemLabDynamicLab.fit())
    if (name === 'pour') {
      // Tilt with the visible slider (no wheel, no shortcut).
      const slider = p.locator('[data-qa-in="tilt"]')
      await slider.focus()
      for (let i = 0; i < 14; i += 1) await p.keyboard.press('ArrowRight')
      await p.waitForTimeout(1200)
      report.pourMoved = await p.evaluate(() => { const D = window.ChemLabDynamicLab; return D.state.objects.filter(o => o.contents).map(o => +Object.values(o.contents.liquids).reduce((s, v) => s + v, 0).toFixed(1)) })
    }
    else await p.waitForTimeout(name === 'sodium' ? 2500 : 6000)
    await snap(p, `scene-${name}-2d`)
    await p.getByRole('button', { name: 'Xem 3D' }).click()
    await p.waitForTimeout(1800)
    await snap(p, `scene-${name}-3d`)
    await ctx.close()
  }
}
await fs.writeFile(path.join(outDir, `${label}-journey.json`), JSON.stringify(report, null, 2))
console.log(JSON.stringify(report.viewports, null, 1), '\nconsole errors:', report.console)
await browser.close()
