// ChemLab 7.0 Dynamic Lab — walk through all five Guided Labs with visible controls only
// (canvas clicks/drags, action bar, detail panel, step strip). Switches 2D ⇄ 3D once per lab.
// Usage: node scripts/dlab-guided-walk.mjs [baseUrl] → reports/chemlab-7.0/tongs/guided-walk.json
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const base = process.argv[2] || 'http://localhost:5173/'
const outDir = path.join(root, 'reports', 'chemlab-7.0', process.env.WALK_OUT || 'tongs')
await fs.mkdir(outDir, { recursive: true })
const browser = await chromium.launch({ headless: true })
const report = { base, labs: [], console: [], aiRequests: 0 }

for (const [id, title, walk] of [
  ['acid-base', 'Nhận biết dung dịch', acidBase],
  ['precipitate', 'Tạo kết tủa', precipitate],
  ['metals', 'Kim loại', metals],
  ['electrolysis', 'Điện phân', electrolysis],
  ['organic', 'Axit axetic', organic]
]) {
  if (process.env.WALK_ONLY && !process.env.WALK_ONLY.split(',').includes(id)) continue
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await ctx.addInitScript(() => { try { localStorage.setItem('chemlab-dlab-onboarded', '1'); localStorage.setItem('chemlab-dlab-tip-tongs', '1') } catch {} })
  const p = await ctx.newPage()
  p.on('pageerror', e => report.console.push(`${id}: ${e.message.slice(0, 160)}`))
  p.on('console', m => { if (m.type() === 'error') report.console.push(`${id}: ${m.text().slice(0, 160)}`) })
  p.on('request', r => { if (/\/api\/(chat|ai|chemai)/.test(r.url()) && r.method() !== 'GET') report.aiRequests += 1 })
  await p.goto(`${base}#dlab`)
  await p.waitForFunction(() => window.ChemLabDynamicLab?.ready, null, { timeout: 30000 })
  const L = (fn, a) => p.evaluate(([f, x]) => new Function('L', 'a', `return (${f})(L, a)`)(window.ChemLabDynamicLab, x), [fn.toString(), a])
  const lab = { id, steps: [], switched3d: null }
  const t0 = Date.now()
  const h = makeHelpers(p, L)
  try {
    await p.getByRole('button', { name: 'Có hướng dẫn', exact: true }).click()
    await p.locator('.ulab-card', { hasText: title }).first().click() // 7.1: the guided chooser page
    await p.locator('.dlab-gstrip .dlab-gstep', { hasText: 'Bước 1/' }).waitFor()
    await walk(h, lab)
  }
  catch (e) { lab.error = String(e.message).split('\n')[0].slice(0, 300) }
  const g = await L(L => L.guided())
  lab.done = `${g?.done}/${g?.total}`
  lab.complete = g?.done === g?.total
  lab.realSeconds = +((Date.now() - t0) / 1000).toFixed(1)
  lab.simSeconds = +(await L(L => L.state.t)).toFixed(1)
  await p.screenshot({ path: path.join(outDir, `walk-${id}.png`) })
  report.labs.push(lab)
  console.log(lab.complete ? 'DONE' : 'STUCK', id, lab.done, lab.error || '', JSON.stringify(lab.steps.map(s => `${s.n}:${s.how}`)))
  await ctx.close()
}
await fs.writeFile(path.join(outDir, 'guided-walk.json'), JSON.stringify(report, null, 2))
console.log('console errors', report.console.length, 'ChemAI requests', report.aiRequests)
await browser.close()

function makeHelpers(p, L) {
  const bar = p.locator('.dlab-actionbar')
  const is3d = () => L(L => L.is3d())
  const at = async (x, y) => (await is3d()) ? L((L, a) => L.worldToScreen3d(a.x, a.y), { x, y }) : L((L, a) => L.worldToScreen(a.x, a.y), { x, y })
  const objs = () => L(L => JSON.parse(JSON.stringify(L.state.objects)))
  const find = async pred => (await objs()).find(pred)
  const done = () => L(L => L.guided().done)
  const h = {
    p, L, bar, objs, find, done,
    // Click an object on the bench the way a student would; returns true if it became selected.
    async pick(o, dy = 0.5) {
      const def = { dropper: 90, rod: 140, spatula: 110, tongs: 120, litmusPaper: 70, bottle: 80, beaker100: 70, testTube: 110, dish: 40, power: 50, voltmeter: 50, bridge: 60, electrodes: 120 }[o.type] || 40
      const s = await at(o.x, o.y + def * dy)
      await p.mouse.click(s.x, s.y)
      await p.waitForTimeout(150)
      return (await L(L => L.selected())) === o.id
    },
    async drag(from, to) {
      const a = await at(from.x, from.y)
      const b = await at(to.x, to.y)
      await p.mouse.move(a.x, a.y); await p.mouse.down(); await p.mouse.move(b.x, b.y, { steps: 14 }); await p.mouse.up()
      await p.waitForTimeout(300)
    },
    qa: name => { if (process.env.WALK_TRACE) console.log('  click', name); return bar.getByRole('button', { name, exact: true }) },
    async to(id) { const s = bar.locator('[data-qa-in="to"]'); await s.waitFor({ timeout: 3000 }); await s.selectOption(id) }, // the list appears once the bar repaints
    async confirm() { for (let i = 0; i < 3; i += 1) { await p.waitForTimeout(250); const b = p.getByRole('button', { name: 'Tôi hiểu, tiếp tục' }); if (await b.count()) await b.click() } },
    async details() { if (!(await p.locator('.dlab-detail-pane').isVisible())) { const fab = p.locator('.dlab-fab--side'); if (await fab.isVisible()) await fab.click(); await p.getByRole('tab', { name: 'Chi tiết', exact: true }).click() } },
    // Wait for the step to complete; use the strip's fast-forward when the step offers it.
    async finish(lab, n, how, timeout = 20000) {
      const until = Date.now() + timeout
      let ff = false
      while ((await done()) < n && Date.now() < until) {
        const b = p.locator('[data-gs="ffwd"]')
        if (await b.count() && await b.isEnabled({ timeout: 500 }).catch(() => false)) ff = (await b.click({ timeout: 1500 }).then(() => true, () => false)) || ff // the step may finish on its own meanwhile
        await p.waitForTimeout(400)
      }
      const ok = (await done()) >= n
      lab.steps.push({ n, how: `${how}${ff ? '+tua' : ''}`, ok })
      if (!ok) throw new Error(`step ${n} not completed (${how})`)
    },
    async toggle3d(lab) {
      await p.getByRole('button', { name: 'Xem 3D' }).click()
      await p.locator('.dlab-3d canvas').waitFor()
      await p.waitForTimeout(900)
      const n3 = (await objs()).length
      const labels = await L(L => L.labels())
      await p.getByRole('button', { name: 'Xem 2D' }).click()
      await p.waitForTimeout(300)
      lab.switched3d = { sameObjects: n3 === (await objs()).length, labels: labels.length }
    }
  }
  return h
}

async function acidBase(h, lab) {
  const { p, find, bar } = h
  const tubes = (await h.objs()).filter(o => o.type === 'testTube')
  const dip = async (tube, n) => {
    let paper = await find(o => o.type === 'litmusPaper' && !o.touched?.length)
    if (!paper) {
      await p.getByRole('tab', { name: 'Tủ hóa chất' }).click(); await p.locator('.dlab-chip', { hasText: 'Chất chỉ thị' }).click()
      await p.locator('.dlab-lib-item', { hasText: 'Giấy quỳ tím' }).first().click()
      await p.waitForTimeout(200)
      paper = await find(o => o.type === 'litmusPaper' && !o.touched?.length)
    }
    if ((await p.evaluate(() => window.ChemLabDynamicLab.selected())) !== paper.id) await h.pick(paper)
    await h.to(tube.id)
    await h.qa('Nhúng').click()
    await h.finish(lab, n, 'giấy quỳ: Nhúng')
    await h.qa('Lấy ra').click({ timeout: 2000 }).catch(() => {})
  }
  await dip(tubes[0], 1)
  await h.toggle3d(lab)
  await dip(tubes[1], 2)
  await dip(tubes[2], 3)
  const dropper = await find(o => o.type === 'dropper')
  const phph = await find(o => o.type === 'bottle' && o.reagent === 'phenolphthalein')
  await h.pick(dropper)
  await bar.locator('[data-qa-in="from"]').selectOption(phph.id)
  await h.qa('Hút 2 mL').click()
  await h.to(tubes[1].id)
  await h.qa('5 giọt').click()
  await h.finish(lab, 4, 'ống nhỏ giọt: Hút → 5 giọt')
  const acid = await find(o => o.type === 'bottle' && o.reagent === 'hcl')
  await h.pick(acid)
  await bar.locator('[data-qa-in="ml"]').fill('9')
  await h.to(tubes[1].id)
  await h.qa('Rót').click()
  await h.finish(lab, 5, 'chai HCl: Rót 9 mL')
}

async function precipitate(h, lab) {
  const { find, bar } = h
  const beakers = (await h.objs()).filter(o => o.type === 'beaker100')
  const naoh = await find(o => o.type === 'bottle' && o.reagent === 'naoh')
  // CL7-QA-001: the dropper path a student follows — fill 2 mL, 10 drops at a time, "Hút thêm" when low.
  // Count every click; the strip's progress line must say how much is still needed.
  const progress = h.p.locator('.dlab-gprogress')
  await h.pick(await find(o => o.type === 'dropper'))
  await bar.locator('[data-qa-in="from"]').selectOption(naoh.id)
  await h.qa('Hút 2 mL').click()
  let clicks = 1
  const seen = []
  while ((await h.done()) < 1 && clicks < 30) {
    const refill = bar.getByRole('button', { name: 'Hút thêm', exact: true })
    const left = await h.L(L => { const d = L.state.objects.find(o => o.type === 'dropper'); return Object.values(d.contents.liquids).reduce((a, b) => a + b, 0) })
    if (left < 0.5 - 1e-6) { if (await refill.count()) await refill.click(); else await h.qa('Hút 2 mL').click() }
    else { await h.to(beakers[0].id); await h.qa('10 giọt').click() }
    clicks += 1
    await h.p.waitForTimeout(700)
    seen.push(await progress.textContent({ timeout: 500 }).catch(() => ''))
  }
  if (!seen.some(t => /Cần thêm khoảng/.test(t))) throw new Error('progress line never said how much NaOH is still needed: ' + seen.join(' / '))
  h.note = `ống nhỏ giọt: ${clicks} thao tác (Hút 2 mL, 10 giọt, Hút thêm); tiến độ: ${seen.slice(0, 2).join(' → ')}`
  console.log('  precipitate step 1:', h.note)
  await h.finish(lab, 1, `ống nhỏ giọt: ${clicks} thao tác`)
  await h.finish(lab, 2, 'chờ lắng', 40000)
  await h.toggle3d(lab)
  await h.pick(await find(o => o.type === 'rod'))
  await h.to(beakers[0].id)
  await h.qa('Khuấy').click()
  await h.finish(lab, 3, 'đũa: Khuấy')
  await h.pick(await find(o => o.type === 'bottle' && o.reagent === 'hcl'))
  await bar.locator('[data-qa-in="ml"]').fill('15')
  await h.to(beakers[0].id)
  await h.qa('Rót').click()
  await h.finish(lab, 4, 'chai HCl: Rót 15 mL', 40000)
  await h.pick(await find(o => o.type === 'spatula'))
  const offered = await bar.locator('[data-qa-in="solid"]').inputValue()
  if (offered !== 'nacl-s') throw new Error(`spatula offered ${offered}, step needs nacl-s`)
  await h.qa('Lấy').click()
  await h.to(beakers[1].id)
  await h.qa('Thả').click()
  await h.finish(lab, 5, 'thìa: Lấy muối (gợi ý đúng) → Thả', 40000)
}

async function metals(h, lab) {
  const { find } = h
  const beakers = (await h.objs()).filter(o => o.type === 'beaker100')
  const dish = await find(o => o.type === 'dish')
  const useTongs = async (reagent, target, n, how, confirm = false) => {
    await h.pick(await find(o => o.type === 'tongs'))
    const offered = await h.bar.locator('[data-qa-in="solid"]').inputValue()
    if (offered !== reagent) throw new Error(`tongs offered ${offered}, step needs ${reagent}`)
    await h.qa('Lấy').click()
    if (confirm) await h.confirm()
    await h.to(target.id)
    await h.qa('Thả').click()
    if (confirm) await h.confirm()
    await h.finish(lab, n, how, 40000)
  }
  await useTongs('fe', beakers[0], 1, 'kẹp: Lấy đinh (gợi ý đúng) → Thả')
  await h.finish(lab, 2, 'chờ lớp Cu', 40000)
  // Take the nail out (the reported blocker), then continue.
  const nail = await find(o => o.reagent === 'fe')
  const c = beakers[0]
  await h.pick(await find(o => o.type === 'tongs'))
  const s = await h.L((L, a) => L.worldToScreen(a.x, a.y), { x: c.x + (nail.lx || 0), y: c.y + 16 })
  await h.p.mouse.click(s.x, s.y)
  await h.p.waitForTimeout(200)
  await h.qa('Đặt lên bàn').click()
  const out = await find(o => o.reagent === 'fe')
  lab.steps.push({ n: '2b', how: 'kẹp: bấm đinh → Đặt lên bàn', ok: !out.in && !out.holder && out.y === 0 })
  await h.toggle3d(lab)
  await useTongs('zn', beakers[1], 3, 'kẹp: Lấy kẽm (gợi ý đúng) → Thả')
  await useTongs('na', dish, 4, 'kẹp: Lấy natri → xác nhận → Thả', true)
  await h.finish(lab, 5, 'chờ natri tan', 40000)
}

async function electrolysis(h, lab) {
  const { p, find } = h
  const cell = (await h.objs()).filter(o => o.type === 'beaker100')[0]
  const el = await find(o => o.type === 'electrodes')
  await h.drag({ x: el.x, y: el.y + 60 }, { x: cell.x, y: el.y + 60 - (el.y - 10) })
  await h.finish(lab, 1, 'kéo điện cực vào cốc')
  const power = await find(o => o.type === 'power')
  await h.pick(power)
  await h.details()
  const insp = p.locator('.dlab-inspector')
  await insp.getByRole('button', { name: 'Nối dây', exact: true }).click()
  await insp.locator('[data-in="volts"]').fill('6')
  await insp.getByRole('button', { name: 'Bật nguồn', exact: true }).click()
  await h.confirm()
  await h.finish(lab, 2, 'nguồn: Nối dây → 6 V → Bật')
  await h.finish(lab, 3, 'chờ Cu bám catot', 40000)
  await h.toggle3d(lab)
  const [, zn, cuB] = (await h.objs()).filter(o => o.type === 'beaker100')
  for (const [r, target] of [['zn', zn], ['cu', cuB]]) {
    await h.pick(await find(o => o.type === 'tongs'))
    await h.bar.locator('[data-qa-in="solid"]').selectOption(r)
    await h.qa('Lấy').click()
    await h.to(target.id)
    await h.qa('Thả').click()
    await p.waitForTimeout(800)
  }
  await h.finish(lab, 4, 'kẹp: Zn → Cốc B, Cu → Cốc C')
  await h.pick(await find(o => o.type === 'bridge'))
  await h.details()
  await insp.locator('[data-in="la"]').selectOption(zn.id)
  await insp.locator('[data-in="lb"]').selectOption(cuB.id)
  await insp.getByRole('button', { name: 'Đặt cầu muối', exact: true }).click()
  await h.pick(await find(o => o.type === 'voltmeter'))
  await h.details()
  for (const r of ['zn', 'cu']) {
    const m = await find(o => o.reagent === r && o.in)
    await insp.locator('[data-in="lead"]').selectOption(m.id)
    await insp.getByRole('button', { name: 'Nối dây', exact: true }).click()
  }
  await h.finish(lab, 5, 'cầu muối + vôn kế (bảng Chi tiết)')
}

async function organic(h, lab) {
  const { p, find } = h
  const [acid, t2, t3] = (await h.objs()).filter(o => o.type === 'testTube')
  await h.pick(await find(o => o.type === 'litmusPaper'))
  await h.to(acid.id)
  await h.qa('Nhúng').click()
  await h.finish(lab, 1, 'giấy quỳ: Nhúng')
  await h.qa('Lấy ra').click({ timeout: 2000 }).catch(() => {})
  await h.pick(await find(o => o.type === 'spatula'))
  const offered = await h.bar.locator('[data-qa-in="solid"]').inputValue()
  if (offered !== 'nahco3-s') throw new Error(`spatula offered ${offered}`)
  await h.qa('Lấy').click()
  await h.to(acid.id)
  await h.qa('Thả').click()
  await h.finish(lab, 2, 'thìa: NaHCO₃ (gợi ý đúng) → Thả', 40000)
  await h.toggle3d(lab)
  for (const [reagent, tube, n] of [['oil', t2, 3], ['ethanol', t3, 4]]) {
    await h.pick(await find(o => o.type === 'bottle' && o.reagent === reagent))
    await h.bar.locator('[data-qa-in="ml"]').fill('3')
    await h.to(tube.id)
    await h.qa('Rót').click()
    await h.finish(lab, n, `chai ${reagent}: Rót 3 mL`)
  }
  void p
}
