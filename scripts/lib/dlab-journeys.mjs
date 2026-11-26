// Dynamic Lab journeys: each checks the simulation state and what the canvas actually shows.
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import { DISCOVER } from '../../src/dlab/data/manifest.js'
import { EXPERIMENTS, experimentValidation } from '../../src/dlab/data/experiments.js'
import { oilBelow } from '../../src/dlab/engine/chemistry.js'
import { checkInvariants } from '../../src/dlab/engine/sim.js'
const axeSource = await fs.readFile(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8')

export default async function ({ test, bench, st, wait, pixel, screen, dragWorld, outDir, browserName, aiRequests }) {
  const obj = (page, id) => st(page, (L, id) => JSON.parse(JSON.stringify(L.state.objects.find(o => o.id === id))), id)
  const surface = (page, id) => st(page, (L, id) => L.surface(id), id)
  const select = (page, id) => st(page, (L, id) => { L.select(id); return true }, id)
  const btn = (page, name) => page.getByRole('button', { name, exact: true })
  // Advanced controls live in the side panel's "Chi tiết vật" tab; open it the way a user would.
  async function showDetails(page) {
    if (await page.locator('.dlab-detail-pane').isVisible()) return
    const fab = page.locator('.dlab-fab--side')
    if (await fab.isVisible()) await fab.click()
    await page.getByRole('tab', { name: 'Chi tiết vật' }).click()
  }
  const panelBtn = (page, name) => ({ click: async () => { await showDetails(page); await page.locator('.dlab-inspector').getByRole('button', { name, exact: true }).click() } })
  // Library: choose the shelf, then the group chip (Tủ hóa chất / Kệ dụng cụ).
  const libGroup = async (page, shelf, group) => { await page.getByRole('tab', { name: shelf }).click(); await page.locator('.dlab-chip', { hasText: group }).click() }
  const menu = async (page, name) => { await page.locator('.dlab-menu summary').click(); await btn(page, name).click() }
  const redDominant = c => c[0] > c[2] + 50 && c[0] > c[1] + 50
  const violet = c => c[2] > c[1] + 40 && c[0] > c[1] + 20 && Math.abs(c[0] - c[2]) < 60

  async function dipPaper(page) {
    const ids = await bench(page, { A: { type: 'beaker100', x: 400, fill: [['hcl', 60]] } })
    ids.P = await st(page, L => L.dispatch({ type: 'newLitmus', x: 560 }, { record: false }).id)
    await settled(page) // the bench is framed once more after layout; aim after that
    const s = await surface(page, ids.A)
    return { ids, s }
  }

  await test('S01 lấy giấy quỳ từ thư viện', async page => {
    await bench(page, {})
    await libGroup(page, 'Tủ hóa chất', 'Chất chỉ thị')
    await page.locator('.dlab-lib-item', { hasText: 'Giấy quỳ tím' }).first().click()
    await wait(page, L => L.state.objects.some(o => o.type === 'litmusPaper'))
  })

  await test('S02 nhúng một phần giấy quỳ: đúng vùng đổi màu', async page => {
    const { ids, s } = await dipPaper(page)
    const up = await dragWorld(page, { x: 560, y: 155 }, { x: 400, y: s - 10 + 35 })
    await page.waitForTimeout(1500)
    const p = await obj(page, ids.P)
    const under = p.seg.filter((seg, i) => p.y + (i + 0.5) * 70 / 28 < s)
    assert.ok(under.length >= 3 && under.every(x => x.wet > 0.5 && redDominant(x.rgb)), 'dipped part red')
    assert.ok(violet(p.seg[27].rgb) && p.seg[27].wet === 0, 'top dry & violet')
    assert.ok(redDominant(await pixel(page, 400, p.y + 3)), `tip pixel red: ${await pixel(page, 400, p.y + 3)}`)
    assert.ok(violet(await pixel(page, 400, p.y + 66)), `top pixel violet: ${await pixel(page, 400, p.y + 66)}`)
    await up()
  })

  await test('S03 nhúng sâu hơn: vùng đổi màu dài hơn', async page => {
    const { ids, s } = await dipPaper(page)
    const up = await dragWorld(page, { x: 560, y: 155 }, { x: 400, y: s - 8 + 35 })
    await page.waitForTimeout(1200)
    const shallow = (await obj(page, ids.P)).seg.filter(x => x.wet > 0.5).length
    const pos = await screen(page, 400, s - 30 + 35)
    await page.mouse.move(pos.x, pos.y, { steps: 6 })
    await page.waitForTimeout(1200)
    const deep = (await obj(page, ids.P)).seg.filter(x => x.wet > 0.5).length
    assert.ok(deep >= shallow + 6, `deeper ${deep} vs ${shallow}`)
    await up()
  })

  await test('S04 lấy giấy ra: giữ màu đã đổi', async page => {
    const { ids, s } = await dipPaper(page)
    const up = await dragWorld(page, { x: 560, y: 155 }, { x: 400, y: s - 12 + 35 })
    await page.waitForTimeout(1300)
    const pos = await screen(page, 600, 220)
    await page.mouse.move(pos.x, pos.y, { steps: 8 })
    await up()
    await page.waitForTimeout(1500)
    const p = await obj(page, ids.P)
    assert.equal(p.inside, null)
    assert.ok(redDominant(p.seg[0].rgb), 'kept red')
    assert.ok(redDominant(await pixel(page, p.x, p.y + 3)), 'drawn red after removal')
  })

  await test('S05 rót chất lỏng giữa hai bình bằng thao tác nghiêng', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['naoh', 60]] }, B: { type: 'beaker250', x: 352 } })
    const up = await dragWorld(page, { x: 300, y: 35 }, { x: 300, y: 155 })
    for (let i = 0; i < 15; i += 1) await page.mouse.wheel(0, 100)
    await page.waitForTimeout(2500)
    const mid = await st(page, L => ({ streams: L.state.streams.length }))
    await page.screenshot({ path: `${outDir}/${browserName}-s05-pour.png` })
    await up()
    const r = await st(page, (L, ids) => {
      const v = o => Object.values(o.contents.liquids).reduce((s, x) => s + x, 0)
      const a = L.state.objects.find(o => o.id === ids.A)
      const b = L.state.objects.find(o => o.id === ids.B)
      return { a: v(a), b: v(b), spill: L.state.spill.mL, angle: a.angle, na: (a.contents.ions['Na+'] || 0) + (b.contents.ions['Na+'] || 0) + (L.state.spill.contents.ions['Na+'] || 0) }
    }, ids)
    assert.ok(mid.streams > 0, 'stream drawn while pouring')
    assert.ok(r.b > 15, `B got ${r.b}`)
    assert.ok(Math.abs(r.a + r.b + r.spill - 60) < 1e-6, `volume conserved ${r.a + r.b + r.spill}`)
    assert.ok(Math.abs(r.na - 0.03) < 1e-9, 'Na+ conserved')
    assert.equal(r.angle, 0, 'set upright on release')
  })

  async function dropperBench(page) {
    const ids = await bench(page, { A: { type: 'beaker250', x: 300, fill: [['naoh', 150]] }, I: { type: 'bottle', x: 520, reagent: 'phenolphthalein' }, D: { type: 'dropper', x: 520, y: 10 } })
    await st(page, L => L.markInitial())
    await select(page, ids.D)
    await panelBtn(page, 'Hút 1 mL').click()
    await st(page, (L, id) => L.dispatch({ type: 'move', id, x: 322, y: 120 }), ids.D)
    return ids
  }

  await test('S06 nhỏ từng giọt chất chỉ thị', async page => {
    const ids = await dropperBench(page)
    for (let i = 0; i < 3; i += 1) await panelBtn(page, 'Nhỏ 1 giọt').click()
    await wait(page, (L, id) => (L.state.objects.find(o => o.id === id).contents.indicators.phenolphthalein || 0) > 2.9, ids.A)
    const d = await obj(page, ids.D)
    assert.ok(Math.abs(Object.values(d.contents.liquids).reduce((s, x) => s + x, 0) - 0.85) < 1e-6, 'dropper lost 3 × 0.05 mL')
  })

  await test('S07 màu chỉ thị lan từ vị trí tiếp xúc', async page => {
    // The colour gradient is a "Đồ họa: Cao" feature ("Tiết kiệm" fills one mean colour). Pick "Cao" in the menu, as a
    // student would: on a machine under 25 fps the automatic fallback otherwise switches to "Tiết kiệm" after ~4 s.
    await menu(page, 'Đồ họa: Cao')
    await menu(page, 'Đồ họa: Tiết kiệm')
    assert.equal((await page.locator('[data-hd="quality"]').textContent()).trim(), 'Đồ họa: Cao')
    const ids = await dropperBench(page)
    await st(page, L => { L.state.speed = 0.25 })
    for (let i = 0; i < 3; i += 1) await panelBtn(page, 'Nhỏ 1 giọt').click()
    await wait(page, (L, id) => (L.state.objects.find(o => o.id === id).contents.indicators.phenolphthalein || 0) > 2.9, ids.A)
    // Sample at a fixed MODEL time after the drops (0,1 s = the 400 ms at 0,25× this test was written for), then let two
    // frames draw it. A wall-clock wait read the canvas too early when a busy browser skipped model time (frames > 0,25 s).
    const tLand = await st(page, L => L.state.t)
    await wait(page, (L, t) => L.state.t >= t + 0.1, tLand, 10000)
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))
    const a = await obj(page, ids.A)
    const s = await surface(page, ids.A)
    const pink = c => c[0] - c[1]
    const strongest = async xs => { let best = [0, 255, 0]; for (const x of xs) for (const dy of [2, 4, 6]) { const c = await pixel(page, x, s - dy); if (pink(c) > pink(best)) best = c } return best }
    assert.equal((await page.locator('[data-hd="quality"]').textContent()).trim(), 'Đồ họa: Cao', 'measured in the mode named')
    const near = await strongest([316, 320, 324, 328, 332])
    const far = await strongest([268, 272, 276, 280, 284])
    assert.ok(pink(near) > pink(far) + 25, `pink near ${near} vs far ${far}`)
    const f = a.vis.field
    const mean0 = f.reduce((x, y) => x + y, 0) / f.length
    assert.ok(Math.max(...f.slice(130, 140)) > 5 * mean0, 'tracer concentrated at the surface contact')
    const t1 = await st(page, L => { L.state.speed = 4; return L.state.t })
    await wait(page, (L, t) => L.state.t >= t + 24, t1, 60000) // 24 s of model time (6 s at 4×)
    const lf = (await obj(page, ids.A)).vis.field
    const mean = lf.reduce((x, y) => x + y, 0) / lf.length
    assert.ok(Math.min(...lf) / mean > Math.min(...f) / mean0 + 0.1, 'spreads with time')
  })

  await test('S08 khuấy bằng đũa thủy tinh', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['water', 60]] }, R: { type: 'rod', x: 300, y: 8 } })
    const p = await screen(page, 300, 8 + 100)
    await page.mouse.move(p.x, p.y)
    await page.mouse.down()
    for (let i = 0; i < 6; i += 1) {
      const l = await screen(page, 285, 108)
      const r = await screen(page, 315, 108)
      await page.mouse.move(l.x, l.y, { steps: 4 })
      await page.mouse.move(r.x, r.y, { steps: 4 })
    }
    const stir = (await obj(page, ids.A)).vis.stir
    await page.mouse.up()
    assert.ok(stir > 0.3, `stir ${stir}`)
  })

  await test('S09 kết tủa hình thành và lắng xuống', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['cuso4', 30]] }, N: { type: 'bottle', x: 480, reagent: 'naoh' } })
    await select(page, ids.N)
    await showDetails(page); await page.locator('[data-in="pour-ml"]').fill('20')
    await showDetails(page); await page.locator('[data-in="pour-to"]').selectOption(ids.A)
    await panelBtn(page, 'Rót').click()
    await wait(page, (L, id) => L.state.objects.find(o => o.id === id).vis.parts.length > 10, ids.A)
    await st(page, L => { L.state.speed = 4 })
    await wait(page, (L, id) => { const p = L.state.objects.find(o => o.id === id).vis.parts; return p.filter(x => x.settled).length / p.length > 0.8 }, ids.A, 40000)
    const bottom = await pixel(page, 300, 4)
    assert.ok(bottom[2] > bottom[0] + 40, `settled layer drawn blue: ${bottom}`)
    assert.ok((await obj(page, ids.A)).contents.precipitates['Cu(OH)2'] > 1e-3)
  })

  await test('S10 chất rắn hòa tan (kéo từ thư viện)', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 360, fill: [['water', 40]] } })
    await libGroup(page, 'Tủ hóa chất', 'Chất rắn')
    const item = page.locator('.dlab-lib-item', { hasText: 'Muối ăn' }).first()
    await item.scrollIntoViewIfNeeded() // the list scrolls; a student scrolls to the item before dragging it
    const box = await item.boundingBox()
    const target = await screen(page, 360, 40)
    await page.mouse.move(box.x + 20, box.y + 15)
    await page.mouse.down()
    await page.mouse.move(target.x, target.y, { steps: 10 })
    await page.mouse.up()
    await page.locator('.dlab-dialog button[type="submit"]').click()
    await wait(page, (L, id) => L.state.objects.some(o => o.type === 'solid' && o.in === id), ids.A)
    await st(page, L => { L.state.speed = 4 })
    await wait(page, (L, id) => { const s = L.state.objects.find(o => o.type === 'solid' && o.in === id); return s.massG < 1 }, ids.A, 30000)
    assert.ok((await obj(page, ids.A)).contents.ions['Na+'] > 0.015)
  })

  await test('S11 kim loại: đinh sắt trong CuSO4', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 360, fill: [['cuso4', 40]] } })
    await select(page, ids.A)
    await libGroup(page, 'Tủ hóa chất', 'Chất rắn')
    await page.locator('.dlab-lib-item', { hasText: 'Đinh sắt' }).first().click()
    await page.locator('.dlab-dialog button[type="submit"]').click()
    await st(page, L => { L.state.speed = 4 })
    await wait(page, (L, id) => L.state.objects.some(o => o.reagent === 'fe' && o.in === id && (o.coat.Cu || 0) > 2e-4), ids.A, 30000)
    await page.screenshot({ path: `${outDir}/${browserName}-s11-fe-cu.png` })
  })

  await test('S12 điện phân CuCl2', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 360, fill: [['cucl2', 50]] }, E: { type: 'electrodes', x: 360, y: 10 }, P: { type: 'power', x: 180 } })
    await select(page, ids.P)
    await showDetails(page); await page.locator('[data-in="wire"]').selectOption(ids.E)
    await panelBtn(page, 'Nối dây').click()
    await showDetails(page); await page.locator('[data-in="volts"]').fill('6')
    await panelBtn(page, 'Bật nguồn').click()
    await page.getByRole('button', { name: 'Tôi hiểu, tiếp tục' }).click()
    await wait(page, (L, id) => (L.state.objects.find(o => o.id === id).current || 0) > 1, ids.P)
    await st(page, L => { L.state.speed = 4 })
    await wait(page, (L, id) => (L.state.objects.find(o => o.id === id).cuDeposit || 0) > 1e-4, ids.E, 30000)
    assert.ok(await st(page, L => L.state.gas.Cl2 > 1e-4))
  })

  await test('S13 hữu cơ: dầu ăn tách lớp trên nước', async page => {
    const ids = await bench(page, { T: { type: 'beaker100', x: 300, fill: [['water', 30]] }, O: { type: 'bottle', x: 460, reagent: 'oil' } })
    await select(page, ids.O)
    await showDetails(page); await page.locator('[data-in="pour-ml"]').fill('20')
    await showDetails(page); await page.locator('[data-in="pour-to"]').selectOption(ids.T)
    await panelBtn(page, 'Rót').click()
    const t = await obj(page, ids.T)
    assert.equal(t.contents.liquids.oil, 20)
    await wait(page, L => L.state.streams.length === 0) // sample after the pour stream has gone
    await page.waitForTimeout(300)
    await settled(page) // the details panel may re-frame the bench once the pointer rests; sample the settled frame
    await page.waitForTimeout(100)
    const s = await surface(page, ids.T)
    const top = await pixel(page, 300, s - 3)
    const low = await pixel(page, 300, 4)
    assert.ok(top[0] > top[2] + 60 && top[1] > top[2] + 30, `oil layer yellow on top: ${top}`)
    assert.ok(!(low[0] > low[2] + 60), `water below not yellow: ${low}`)
  })

  await test('S14 cảnh báo an toàn trước thao tác', async page => {
    const ids = await bench(page, { D: { type: 'dish', x: 360, fill: [['water', 150]] }, K: { type: 'tongs', x: 520, y: 150 } })
    await select(page, ids.K)
    await showDetails(page); await page.locator('[data-in="solid"]').selectOption('na')
    await showDetails(page); await page.locator('[data-in="mass"]').fill('0.5')
    await panelBtn(page, 'Lấy').click()
    await page.locator('.dlab-toast', { hasText: 'vượt giới hạn an toàn' }).waitFor()
    await showDetails(page); await page.locator('[data-in="mass"]').fill('0.1')
    await panelBtn(page, 'Lấy').click()
    await page.locator('.dlab-dialog', { hasText: 'Natri phản ứng mãnh liệt' }).waitFor()
    await page.getByRole('button', { name: 'Hủy', exact: true }).click()
    assert.equal((await obj(page, ids.K)).load, null, 'cancelled: nothing picked')
  })

  await test('S15 dụng cụ bị hỏng bị giới hạn chức năng', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300 }, W: { type: 'bottle', x: 460, reagent: 'water' }, H: { type: 'burner', x: 620 } })
    await st(page, (L, id) => { L.state.objects.find(o => o.id === id).T = 220 }, ids.A)
    await select(page, ids.W)
    await showDetails(page); await page.locator('[data-in="pour-ml"]').fill('20')
    await showDetails(page); await page.locator('[data-in="pour-to"]').selectOption(ids.A)
    await panelBtn(page, 'Rót').click()
    await page.locator('.dlab-dialog', { hasText: 'sốc nhiệt' }).waitFor()
    await page.getByRole('button', { name: 'Tôi hiểu, tiếp tục' }).click()
    await select(page, ids.A)
    await page.locator('.dlab-cond', { hasText: 'Bị nứt' }).waitFor()
    await st(page, (L, ids) => { L.dispatch({ type: 'move', id: ids.A, x: 620, y: 0 }) }, ids)
    await select(page, ids.H)
    await panelBtn(page, 'Bật bếp').click()
    await page.locator('.dlab-toast', { hasText: 'nứt' }).waitFor()
    assert.equal((await obj(page, ids.H)).on, false, 'heating a cracked vessel is blocked')
  })

  await test('S16 Pause và Resume', async page => {
    await bench(page, { A: { type: 'beaker100', x: 300 } })
    await btn(page, 'Tạm dừng').click()
    const t0 = await st(page, L => L.state.t)
    await page.waitForTimeout(800)
    assert.equal(await st(page, L => L.state.t), t0, 'paused')
    await btn(page, 'Tiếp tục').click()
    await page.waitForTimeout(800)
    assert.ok(await st(page, L => L.state.t) > t0 + 0.4, 'resumed')
  })

  await test('S17 thay đổi tốc độ mô phỏng', async page => {
    await bench(page, {})
    await btn(page, '4×').click()
    const t0 = await st(page, L => L.state.t)
    const w0 = Date.now()
    await page.waitForTimeout(1500)
    const rate = (await st(page, L => L.state.t) - t0) / ((Date.now() - w0) / 1000)
    assert.ok(rate > 2.8 && rate < 4.4, `4× rate ${rate}`)
    await btn(page, '0,25×').click()
    const t1 = await st(page, L => L.state.t)
    const w1 = Date.now()
    await page.waitForTimeout(1500)
    const slow = (await st(page, L => L.state.t) - t1) / ((Date.now() - w1) / 1000)
    assert.ok(slow > 0.15 && slow < 0.3, `0.25× rate ${slow}`)
  })

  await test('S18 Undo', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['hcl', 20]] } })
    await select(page, ids.A)
    await page.locator('.dlab-canvas').focus()
    for (let i = 0; i < 4; i += 1) await page.keyboard.press('ArrowRight')
    assert.equal((await obj(page, ids.A)).x, 320)
    await st(page, (L, id) => L.dispatch({ type: 'addReagentTo', id, reagent: 'naoh', mL: 10 }), ids.A)
    await btn(page, 'Hoàn tác').click()
    const a = await obj(page, ids.A)
    assert.ok(Math.abs(Object.values(a.contents.liquids).reduce((s, x) => s + x, 0) - 20) < 1e-9 && !a.contents.ions['Na+'], 'composition restored')
    for (let i = 0; i < 4; i += 1) await btn(page, 'Hoàn tác').click()
    assert.equal((await obj(page, ids.A)).x, 300, 'position restored')
  })

  await test('S19 Reset', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['hcl', 20]] } })
    await st(page, L => L.markInitial())
    await st(page, (L, id) => { L.dispatch({ type: 'addReagentTo', id, reagent: 'naoh', mL: 10 }); L.dispatch({ type: 'add', equipmentType: 'flask', x: 500 }) }, ids.A)
    await btn(page, 'Đặt lại').click()
    await page.getByRole('button', { name: 'Tôi hiểu, tiếp tục' }).click()
    const r = await st(page, L => ({ n: L.state.objects.length, vol: Object.values(L.state.objects[0].contents.liquids).reduce((s, x) => s + x, 0) }))
    assert.deepEqual(r, { n: 1, vol: 20 })
  })

  await test('S20 Save và Load sau khi tải lại trang', async page => {
    await bench(page, { A: { type: 'beaker100', x: 300, fill: [['cuso4', 25]] }, B: { type: 'testTube', x: 420, fill: [['hcl', 5]] } })
    await menu(page, 'Lưu')
    await page.locator('.dlab-dialog input').fill('E2E lưu thử')
    await page.locator('.dlab-dialog button[type="submit"]').click()
    await page.locator('.dlab-toast', { hasText: 'Đã lưu' }).waitFor()
    const before = await st(page, L => L.state.objects.map(o => [o.type, Object.values(o.contents?.liquids || {}).reduce((s, x) => s + x, 0)]))
    await page.reload()
    await page.waitForFunction(() => window.ChemLabDynamicLab?.ready)
    await menu(page, 'Mở')
    await page.locator('.dlab-choice', { hasText: 'E2E lưu thử' }).click()
    await page.locator('.dlab-toast', { hasText: 'Đã mở' }).waitFor()
    const after = await st(page, L => L.state.objects.map(o => [o.type, Object.values(o.contents?.liquids || {}).reduce((s, x) => s + x, 0)]))
    assert.deepEqual(after, before)
  })

  await test('S21 chuyển 2D/3D không mất trạng thái', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['cuso4', 40]] } })
    await btn(page, 'Tạm dừng').click()
    const before = JSON.stringify((await obj(page, ids.A)).contents)
    await btn(page, 'Xem 3D').click()
    await page.locator('.dlab-3d canvas').waitFor({ timeout: 15000 })
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${outDir}/${browserName}-s21-3d.png` })
    assert.equal(await st(page, L => L.is3d()), true)
    assert.equal(JSON.stringify((await obj(page, ids.A)).contents), before)
    await btn(page, 'Xem 2D').click()
    assert.equal(await st(page, L => L.is3d()), false)
    assert.equal(JSON.stringify((await obj(page, ids.A)).contents), before)
  })

  await test('S22 hoàn thành một Guided Lab', async page => {
    await btn(page, 'Có hướng dẫn').click()
    await page.locator('.dlab-choice', { hasText: 'Nhận biết dung dịch' }).click()
    await page.locator('.dlab-guided', { hasText: 'Tiến độ: 0/5' }).waitFor()
    const roles = await st(page, L => {
      const find = label => L.state.objects.find(o => o.label === label).id
      return { A: find('Ống A'), B: find('Ống B'), C: find('Ống C') }
    })
    const dip = async tube => {
      await st(page, (L, tube) => {
        const paper = L.dispatch({ type: 'newLitmus', x: 100 }, { record: false }).id
        const t = L.state.objects.find(o => o.id === tube)
        L.dispatch({ type: 'move', id: paper, x: t.x, y: L.surface(tube) - 10 })
      }, tube)
      await page.waitForTimeout(700)
    }
    await dip(roles.A)
    await dip(roles.B)
    await dip(roles.C)
    await page.locator('.dlab-guided', { hasText: 'Tiến độ: 3/5' }).waitFor()
    await st(page, (L, B) => {
      const d = L.state.objects.find(o => o.type === 'dropper')
      const ph = L.state.objects.find(o => o.reagent === 'phenolphthalein')
      L.dispatch({ type: 'move', id: d.id, x: ph.x, y: 10 })
      L.dispatch({ type: 'aspirate', tool: d.id, from: ph.id, mL: 1 })
      const b = L.state.objects.find(o => o.id === B)
      L.dispatch({ type: 'move', id: d.id, x: b.x, y: 140 })
      L.dispatch({ type: 'dispense', tool: d.id, drops: 3 })
    }, roles.B)
    await page.locator('.dlab-guided', { hasText: 'Tiến độ: 4/5' }).waitFor()
    await st(page, (L, B) => { const acid = L.state.objects.find(o => o.reagent === 'hcl'); L.dispatch({ type: 'pourExact', from: acid.id, to: B, mL: 9 }) }, roles.B)
    await page.locator('.dlab-guided', { hasText: 'Tiến độ: 5/5' }).waitFor()
    await page.locator('.dlab-result', { hasText: 'Kết luận' }).waitFor()
    await page.screenshot({ path: `${outDir}/${browserName}-s22-guided.png` })
  })

  await test('S23 thực hành Sandbox từ thư viện', async page => {
    await btn(page, 'Tự do').click()
    await bench(page, {})
    await libGroup(page, 'Kệ dụng cụ', 'Cốc, bình, ống')
    await page.locator('.dlab-lib-item', { hasText: 'Cốc thủy tinh 100 mL' }).first().click()
    const beaker = await st(page, L => L.state.objects.find(o => o.type === 'beaker100').id)
    await libGroup(page, 'Tủ hóa chất', 'Dung dịch')
    await page.locator('.dlab-lib-item', { hasText: 'Axit clohiđric' }).first().click()
    await showDetails(page); await page.locator('[data-in="pour-ml"]').fill('10')
    await showDetails(page); await page.locator('[data-in="pour-to"]').selectOption(beaker)
    await panelBtn(page, 'Rót').click()
    await select(page, beaker)
    await showDetails(page)
    await page.locator('.dlab-kv', { hasText: 'pH' }).waitFor()
    const b = await obj(page, beaker)
    assert.equal(b.contents.liquids.water, 10)
    assert.ok(Math.abs(b.pH - 0.301) < 0.01, `pH ${b.pH}`)
  })

  // ── Foundation: open-ended Sandbox from an EMPTY bench, through the visible controls only (library + action bar) ──
  const fromLibrary = async (page, shelf, group, name, sub) => {
    await libGroup(page, shelf, group)
    let item = page.locator('.dlab-lib-item', { hasText: name })
    if (sub) item = item.filter({ hasText: sub })
    const before = await st(page, L => L.state.objects.map(o => o.id))
    await item.first().click()
    return st(page, (L, b) => L.state.objects.filter(o => !b.includes(o.id)).map(o => o.id).at(-1), before)
  }
  const pourUI = async (page, bottle, to, mL) => {
    await select(page, bottle)
    await page.locator('[data-qa-in="to"]').selectOption(to)
    await page.locator('[data-qa-in="ml"]').fill(String(mL))
    await page.locator('.dlab-actionbar [data-qa="pour"]').click()
  }
  const emptyBench = async page => { await btn(page, 'Tự do').click(); await bench(page, {}) }

  await test('F01 Sandbox mở từ bàn trống: axit – bazơ, thay đổi lượng NaOH, pH theo lời giải tay', async page => {
    await emptyBench(page)
    const beaker = await fromLibrary(page, 'Kệ dụng cụ', 'Cốc, bình, ống', 'Cốc thủy tinh 100 mL')
    const hcl = await fromLibrary(page, 'Tủ hóa chất', 'Dung dịch', 'Axit clohiđric')
    const naoh = await fromLibrary(page, 'Tủ hóa chất', 'Dung dịch', 'Natri hiđroxit')
    await pourUI(page, hcl, beaker, 20)
    await pourUI(page, naoh, beaker, 10)
    let d = await st(page, (L, id) => L.describe(id), beaker)
    assert.ok(Math.abs(d.pH - -Math.log10(0.005 / 0.03)) < 0.03, `under-neutralised pH ${d.pH}`)
    await pourUI(page, naoh, beaker, 20)
    d = await st(page, (L, id) => L.describe(id), beaker)
    assert.ok(Math.abs(d.pH - (14 + Math.log10(0.005 / 0.05))) < 0.03, `excess base pH ${d.pH}`)
    const ev = await st(page, (L, id) => L.events().filter(e => e.container === id).map(e => `${e.key}:${e.outcome}`), beaker)
    assert.ok(ev.some(e => e.startsWith('neutral-') && e.endsWith(':APPLIED')), ev.join(' '))
  })

  await test('F02 Sandbox mở từ bàn trống: CuSO₄ + NH₃ 2 M từng phần — kết tủa rồi phức, không qua thẻ', async page => {
    await emptyBench(page)
    const beaker = await fromLibrary(page, 'Kệ dụng cụ', 'Cốc, bình, ống', 'Cốc thủy tinh 100 mL')
    const cu = await fromLibrary(page, 'Tủ hóa chất', 'Dung dịch', 'Đồng(II) sunfat')
    const nh3 = await fromLibrary(page, 'Tủ hóa chất', 'Dung dịch', 'Dung dịch amoniac', '2 M')
    assert.equal(await st(page, (L, id) => L.state.objects.find(o => o.id === id).reagent, nh3), 'nh3-2m')
    await pourUI(page, cu, beaker, 5)
    await pourUI(page, nh3, beaker, 2)
    let d = await st(page, (L, id) => L.describe(id), beaker)
    assert.ok(d.precipitates['Cu(OH)2'] > 3e-4, `pale-blue Cu(OH)₂ first: ${JSON.stringify(d.precipitates)}`)
    for (let i = 0; i < 4; i += 1) await pourUI(page, nh3, beaker, 7)
    d = await st(page, (L, id) => L.describe(id), beaker)
    assert.ok(!(d.precipitates['Cu(OH)2'] > 1e-9), `dissolved: ${JSON.stringify(d.precipitates)}`)
    assert.ok(Math.abs(d.complexes['Cu2+'] - 2.5e-3) < 3e-5, `complex ${d.complexes['Cu2+']}`)
    // 2D canvas agrees with the state: stirred, the deep-blue complex fills the liquid (pixel inside the beaker).
    for (let i = 0; i < 4; i += 1) await st(page, (L, id) => L.dispatch({ type: 'stir', id, amount: 1 }), beaker)
    await page.waitForTimeout(2500)
    const bx = await st(page, (L, id) => L.state.objects.find(o => o.id === id).x, beaker)
    const px = await pixel(page, bx, 12)
    assert.ok(px[2] > px[0] + 60 && px[0] < 170, `liquid pixel deep blue: ${px}`)
    const label = await st(page, (L, id) => L.state.objects.find(o => o.id === id).label || null, beaker)
    const ev = await st(page, (L, id) => L.events().filter(e => e.container === id).map(e => e.key.replace(/-o\d+$/, '')), beaker)
    assert.ok(ev.indexOf('ppt-Cu(OH)2') >= 0 && ev.indexOf('ppt-Cu(OH)2') < ev.indexOf('ammine-dis-Cu(OH)2'), `${label}: ${ev.join(',')}`)
  })

  await test('F03 Sandbox mở: lệnh sai (qua API của trang) bị từ chối, bàn không đổi', async page => {
    await emptyBench(page)
    const beaker = await fromLibrary(page, 'Kệ dụng cụ', 'Cốc, bình, ống', 'Cốc thủy tinh 100 mL')
    // Paused, and without the per-frame display fields (vis), so only a real change of the bench can differ.
    const bench = () => st(page, L => { L.state.paused = true; return JSON.stringify(L.state.objects.map(({ vis, ...o }) => o)) })
    const before = await bench()
    const r = await st(page, (L, id) => L.dispatch({ type: 'addReagentTo', id, reagent: 'hcl', mL: -5 }), beaker)
    assert.equal(r.outcome, 'INVALID_INPUT')
    assert.equal(await bench(), before)
  })

  await test('F04 Sandbox mở từ bàn trống: kết tủa AgCl, đổi lượng NaCl — chất hết trước đổi theo lượng', async page => {
    await emptyBench(page)
    const beaker = await fromLibrary(page, 'Kệ dụng cụ', 'Cốc, bình, ống', 'Cốc thủy tinh 100 mL')
    const ag = await fromLibrary(page, 'Tủ hóa chất', 'Dung dịch', 'Bạc nitrat')
    const cl = await fromLibrary(page, 'Tủ hóa chất', 'Dung dịch', 'Natri clorua')
    await pourUI(page, ag, beaker, 20) // 2 mmol Ag⁺
    await pourUI(page, cl, beaker, 2) // 1 mmol Cl⁻: Cl⁻ is limiting
    let d = await st(page, (L, id) => L.describe(id), beaker)
    assert.ok(d.precipitates.AgCl <= 1e-3 && d.precipitates.AgCl > 1e-3 - 1e-5, `Cl⁻ limiting: AgCl ${d.precipitates.AgCl}`)
    assert.ok(Math.abs(d.dissolved['Ag+'] - (2e-3 - d.precipitates.AgCl)) < 1e-8, 'Ag⁺ in excess stays dissolved')
    await pourUI(page, cl, beaker, 6) // 4 mmol Cl⁻ in total: Ag⁺ is now limiting
    d = await st(page, (L, id) => L.describe(id), beaker)
    assert.ok(d.precipitates.AgCl <= 2e-3 && d.precipitates.AgCl > 2e-3 - 1e-5, `Ag⁺ limiting: AgCl ${d.precipitates.AgCl}`)
    const ev = await st(page, (L, id) => L.events().filter(e => e.container === id && e.key.startsWith('ppt-AgCl')).map(e => `${e.outcome}/${e.validation}`), beaker)
    assert.deepEqual(ev, ['APPLIED/VALIDATED'])
  })

  await test('F05 Sandbox mở từ bàn trống: chuỗi Cu(OH)₂ → HCl hòa tan → đinh sắt (kẹp qua giao diện) đẩy Cu', async page => {
    await emptyBench(page)
    await page.locator('[data-speed="4"]').first().click()
    const beaker = await fromLibrary(page, 'Kệ dụng cụ', 'Cốc, bình, ống', 'Cốc thủy tinh 250 mL')
    const cu = await fromLibrary(page, 'Tủ hóa chất', 'Dung dịch', 'Đồng(II) sunfat')
    const naoh = await fromLibrary(page, 'Tủ hóa chất', 'Dung dịch', 'Natri hiđroxit')
    const hcl = await fromLibrary(page, 'Tủ hóa chất', 'Dung dịch', 'Axit clohiđric')
    await pourUI(page, cu, beaker, 20)
    await pourUI(page, naoh, beaker, 30)
    let d = await st(page, (L, id) => L.describe(id), beaker)
    assert.ok(d.precipitates['Cu(OH)2'] > 7e-3, `Cu(OH)₂ ${d.precipitates['Cu(OH)2']}`)
    for (let i = 0; i < 3; i += 1) await pourUI(page, hcl, beaker, 20)
    d = await st(page, (L, id) => L.describe(id), beaker)
    assert.ok(!(d.precipitates['Cu(OH)2'] > 0) && d.pH < 2, `dissolved in acid: pH ${d.pH}`)
    const tongs = await fromLibrary(page, 'Kệ dụng cụ', 'Lấy, chuyển, khuấy', 'Kẹp hóa chất')
    await select(page, tongs)
    const confirm = async () => { const b = page.getByRole('button', { name: 'Tôi hiểu, tiếp tục' }); if (await b.isVisible({ timeout: 700 }).catch(() => false)) await b.click() }
    await page.locator('[data-qa-in="solid"]').selectOption('fe')
    await page.locator('[data-qa-in="mass"]').fill('2')
    await page.locator('.dlab-actionbar [data-qa="pick"]').click()
    await confirm()
    await page.locator('[data-qa-in="to"]').selectOption(beaker)
    await page.locator('.dlab-actionbar [data-qa="drop-solid"]').click()
    await confirm()
    await wait(page, (L, id) => (L.describe(id).solids.find(s => s.reagent === 'fe')?.coat?.Cu || 0) > 1e-5, beaker, 60000)
    const ev = await st(page, (L, id) => L.events().filter(e => e.container === id).map(e => e.key.replace(/-o\d+$/, '')), beaker)
    // Cu(OH)₂ + 2H⁺ dissolves the solid (no free OH⁻ left: not a neutralisation note); in the excess acid the nail
    // both plates out copper and gives H₂ (Fe + 2H⁺), as a real nail does.
    for (const k of ['ppt-Cu(OH)2', 'rx-fe-cu', 'rx-fe-acid']) assert.ok(ev.includes(k), `${k} in ${ev.join(',')}`)
  })

  await test('S24 phản ứng chưa hỗ trợ không tạo kết quả giả', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['hcl', 30]] }, B: { type: 'beaker100', x: 450, fill: [['hno3', 30]] }, K: { type: 'tongs', x: 600, y: 150 } })
    await st(page, (L, ids) => {
      const drop = (c, reagent, massG) => {
        const cont = L.state.objects.find(o => o.id === c)
        L.dispatch({ type: 'move', id: ids.K, x: cont.x, y: 150 })
        L.dispatch({ type: 'pick', tool: ids.K, reagent, massG }, { confirmed: true })
        L.dispatch({ type: 'release', tool: ids.K }, { confirmed: true })
      }
      drop(ids.A, 'cu', 1)
      drop(ids.B, 'zn', 0.5)
    }, ids)
    await page.waitForTimeout(2500)
    assert.equal(await st(page, L => L.state.gas.H2), 0, 'no hydrogen invented')
    if (!(await page.locator('.dlab-obs').isVisible())) await page.locator('.dlab-fab--side').click()
    await page.locator('.dlab-obs-block', { hasText: 'Không có phản ứng' }).waitFor()
    await select(page, ids.B)
    await showDetails(page)
    await page.locator('.dlab-inspector', { hasText: 'Chưa có mô hình' }).waitFor()
  })

  await test('S25 không có request ChemAI/Groq tự động', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['hcl', 30]] } })
    await st(page, (L, id) => { L.state.speed = 4; L.dispatch({ type: 'addReagentTo', id, reagent: 'naoh', mL: 10 }) }, ids.A)
    await page.waitForTimeout(3000)
    assert.deepEqual(aiRequests, [], 'no AI requests while simulating')
    await btn(page, 'Hỏi ChemAI').click()
    await page.waitForFunction(() => [...document.querySelectorAll('textarea, input')].some(el => el.value.includes('thí nghiệm ảo')), null, { timeout: 15000 })
    await page.waitForTimeout(1500)
    assert.deepEqual(aiRequests, [], `opening ChemAI only pre-fills the question: ${aiRequests.join(', ')}`)
  })

  await test('M01 điện thoại 390px: thư viện, thao tác, không tràn ngang', async page => {
    for (const w of [390, 320]) {
      await page.setViewportSize({ width: w, height: 800 })
      await page.waitForTimeout(300)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      assert.ok(overflow <= 0, `horizontal overflow ${overflow}px at ${w}`)
    }
    await page.setViewportSize({ width: 390, height: 844 })
    await bench(page, {})
    await btn(page, 'Thư viện').click()
    await page.locator('.dlab-lib-item', { hasText: 'Cốc thủy tinh 100 mL' }).first().click()
    const id = await st(page, L => L.state.objects.find(o => o.type === 'beaker100').id)
    const o = await obj(page, id)
    const up = await dragWorld(page, { x: o.x, y: 35 }, { x: o.x + 60, y: 35 })
    await up()
    assert.ok(Math.abs((await obj(page, id)).x - (o.x + 60)) < 2, 'dragged on phone layout')
    await page.screenshot({ path: `${outDir}/${browserName}-m01-390.png` })
  }, { width: 390, height: 844, touch: true })

  await test('R01 bố cục 768/1024/1920', async page => {
    for (const [w, h] of [[768, 1024], [1024, 768], [1920, 1080]]) {
      await page.setViewportSize({ width: w, height: h })
      await page.waitForTimeout(300)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      assert.ok(overflow <= 0, `overflow at ${w}`)
      const canvas = await page.locator('.dlab-canvas').boundingBox()
      assert.ok(canvas.width > 250 && canvas.height > 250, `stage usable at ${w}: ${canvas.width}×${canvas.height}`)
      await page.screenshot({ path: `${outDir}/${browserName}-r01-${w}.png` })
    }
  })

  await test('A01 axe WCAG 2.2 AA trên Phòng thí nghiệm động (sáng/tối)', async page => {
    for (const theme of ['light', 'dark']) {
      await page.evaluate(t => { document.documentElement.dataset.theme = t }, theme)
      await page.waitForTimeout(300)
      await page.addScriptTag({ content: axeSource })
      const r = await page.evaluate(async () => {
        const res = await window.axe.run(document.querySelector('#view-dlab'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } })
        return res.violations.map(v => `${v.id} (${v.impact}): ${v.nodes.length} — ${v.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | ')}`)
      })
      assert.deepEqual(r, [], `${theme}: ${r.join(' || ')}`)
    }
  })

  for (const mode of ['high', 'low']) await test(`P01${mode === 'low' ? 'b' : ''} hiệu năng khung hình với cảnh bận (${mode === 'low' ? 'đồ họa tiết kiệm' : 'đồ họa cao'})`, async page => {
    // Both modes are picked in the menu, so the automatic slow-machine fallback never swaps the mode being measured.
    await menu(page, 'Đồ họa: Cao')
    if (mode === 'high') await menu(page, 'Đồ họa: Tiết kiệm')
    await bench(page, Object.fromEntries(Array.from({ length: 8 }, (_, i) => [`B${i}`, { type: 'beaker100', x: 140 + i * 70, fill: [['cuso4', 40]] }])))
    await page.evaluate(() => {
      const L = window.ChemLabDynamicLab
      for (const o of L.state.objects) L.dispatch({ type: 'addReagentTo', id: o.id, reagent: 'naoh', mL: 30 }, { record: false })
    })
    const r = await page.evaluate(() => new Promise(resolve => {
      const times = []
      let last = performance.now()
      let longTasks = 0
      new PerformanceObserver(list => { longTasks += list.getEntries().length }).observe({ type: 'longtask', buffered: false })
      const tick = now => {
        times.push(now - last)
        last = now
        if (times.length < 240) requestAnimationFrame(tick)
        else {
          const sorted = times.slice(10).sort((a, b) => a - b)
          resolve({ fps: 1000 / (sorted.reduce((a, b) => a + b, 0) / sorted.length), p95: sorted[Math.floor(sorted.length * 0.95)], longTasks, particles: window.ChemLabDynamicLab.state.objects.reduce((s, o) => s + (o.vis?.parts.length || 0), 0) })
        }
      }
      requestAnimationFrame(tick)
    }))
    await fs.writeFile(`${outDir}/${browserName}-p01-${mode}-perf.json`, JSON.stringify(r, null, 2))
    console.log(`      perf ${browserName} ${mode}: ${r.fps.toFixed(1)} fps, p95 ${r.p95.toFixed(1)} ms, long tasks ${r.longTasks}, particles ${r.particles}`)
    assert.equal((await page.locator('[data-hd="quality"]').textContent()).trim(), mode === 'high' ? 'Đồ họa: Cao' : 'Đồ họa: Tiết kiệm', 'measured in the mode named')
    assert.ok(r.fps > 30, `fps ${r.fps}`)
  })

  // Slow machine (emulated by CPU throttling, Chromium/CDP only): "Cao" not picked by the student → falls back once
  // to "Tiết kiệm" and says so; a quality the student picked is never overridden.
  if (browserName === 'chromium') await test('P03 máy chậm: tự chuyển Đồ họa Tiết kiệm và báo rõ, không ghi đè lựa chọn', async page => {
    await bench(page, Object.fromEntries(Array.from({ length: 8 }, (_, i) => [`B${i}`, { type: 'beaker100', x: 140 + i * 70, fill: [['cuso4', 40]] }])))
    const cdp = await page.context().newCDPSession(page)
    const fps = () => page.evaluate(() => new Promise(r => { let n = 0; const t0 = performance.now(); const f = () => { if (++n < 20) requestAnimationFrame(f); else r(20000 / (performance.now() - t0)) }; requestAnimationFrame(f) }))
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 10 })
    const slow = await fps()
    assert.ok(slow < 25 && slow > 2, `throttled frame rate is in the fallback window: ${slow}`) // proves the condition really occurred
    await page.locator('.dlab-toast', { hasText: 'Máy đang chạy chậm' }).waitFor({ timeout: 30000 })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 })
    assert.equal((await page.locator('[data-hd="quality"]').textContent()).trim(), 'Đồ họa: Tiết kiệm')
    // The student picks "Cao" again: kept even when slow.
    await menu(page, 'Đồ họa: Tiết kiệm')
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 10 })
    const slow2 = await fps()
    await page.waitForTimeout(6000)
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 })
    assert.ok(slow2 < 25, `still slow while the choice is tested: ${slow2}`)
    assert.equal((await page.locator('[data-hd="quality"]').textContent()).trim(), 'Đồ họa: Cao', 'student choice kept')
  })

  await test('P02 mở/đóng 3D nhiều lần không rò rỉ', async page => {
    await bench(page, { A: { type: 'beaker100', x: 300, fill: [['cuso4', 40]] } })
    const heap = () => page.evaluate(() => performance.memory?.usedJSHeapSize ?? null)
    const toggle = async () => { await btn(page, 'Xem 3D').click(); await page.locator('.dlab-3d canvas').waitFor(); await btn(page, 'Xem 2D').click() }
    await toggle()
    const h0 = await heap()
    for (let i = 0; i < 6; i += 1) await toggle()
    const canvases = await page.locator('.dlab-3d canvas').count()
    const h1 = await heap()
    console.log(`      heap ${browserName}: ${h0} → ${h1}`)
    assert.equal(canvases, 0, 'WebGL canvases removed')
    if (h0 && h1) assert.ok(h1 - h0 < 15e6, `heap grew ${(h1 - h0) / 1e6} MB`)
  })

  // ── 3D interaction: real pointer events on the WebGL canvas, same commands as 2D ──
  async function open3d(page) {
    await btn(page, 'Xem 3D').click()
    await page.locator('.dlab-3d canvas').waitFor({ timeout: 15000 })
    await page.waitForTimeout(900) // camera damping settles
  }
  const s3 = (page, x, y) => st(page, (L, a) => L.worldToScreen3d(a.x, a.y), { x, y })
  async function drag3d(page, from, to, { hold, steps = 14 } = {}) {
    const a = await s3(page, from.x, from.y)
    const b = await s3(page, to.x, to.y)
    await page.mouse.move(a.x, a.y)
    await page.mouse.down()
    await page.mouse.move(b.x, b.y, { steps })
    if (hold) await hold()
    await page.mouse.up()
  }

  const near30 = v => assert.ok(Math.abs(v - 30) < 1e-6, `volume kept: ${v}`)
  const pose = o => JSON.stringify({ x: o.x, y: o.y, angle: o.angle, contents: o.contents, condition: o.condition })

  await test('T01 3D: chọn vật, khung chọn và inspector', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['cuso4', 40]] }, B: { type: 'beaker100', x: 450 } })
    await open3d(page)
    const p = await s3(page, 450, 30)
    await page.mouse.click(p.x, p.y)
    await wait(page, (L, id) => L.selected() === id, ids.B)
    await showDetails(page)
    await page.locator('.dlab-inspector', { hasText: 'Thể tích' }).waitFor()
    await page.screenshot({ path: `${outDir}/${browserName}-t01-3d-select.png` })
  })

  await test('T02 3D: kéo cốc trên mặt bàn, nhấc lên và đặt xuống', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['water', 30]] } })
    await open3d(page)
    let lifted = null
    await drag3d(page, { x: 300, y: 30 }, { x: 420, y: 110 }, { hold: async () => { lifted = await obj(page, ids.A) } })
    assert.ok(lifted.y > 40 && Math.abs(lifted.x - 420) < 15, `lifted at ${lifted.x},${lifted.y}`)
    await page.waitForTimeout(400)
    const a = await obj(page, ids.A)
    assert.ok(Math.abs(a.x - 420) < 15 && a.y === 0, `placed at ${a.x},${a.y}`)
    near30(await st(page, (L, id) => Object.values(L.state.objects.find(o => o.id === id).contents.liquids).reduce((s, v) => s + v, 0), ids.A))
  })

  await test('T03 3D: nhúng giấy quỳ vào axit', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 400, fill: [['hcl', 60]] } })
    ids.P = await st(page, L => L.dispatch({ type: 'newLitmus', x: 560 }, { record: false }).id)
    await settled(page) // the bench is framed once more after layout; aim after that
    const s = await surface(page, ids.A)
    await open3d(page)
    const p0 = await obj(page, ids.P)
    await drag3d(page, { x: p0.x, y: p0.y + 50 }, { x: 400, y: s - 14 + 50 }, { hold: () => page.waitForTimeout(1600) })
    const p = await obj(page, ids.P)
    assert.ok(p.seg.filter(x => x.wet > 0.5 && redDominant(x.rgb)).length >= 3, 'dipped part red in 3D')
    assert.ok(p.seg[27].wet === 0, 'top dry')
    await page.screenshot({ path: `${outDir}/${browserName}-t03-3d-litmus.png` })
  })

  await test('T04 3D: giữ cốc, lăn chuột để nghiêng và rót', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['naoh', 60]] }, B: { type: 'beaker250', x: 352 } })
    await open3d(page)
    await drag3d(page, { x: 300, y: 35 }, { x: 300, y: 155 }, {
      hold: async () => {
        for (let i = 0; i < 15; i += 1) await page.mouse.wheel(0, 100)
        await page.waitForTimeout(2500)
        await page.screenshot({ path: `${outDir}/${browserName}-t04-3d-pour.png` })
      }
    })
    const r = await st(page, (L, ids) => {
      const v = o => Object.values(o.contents.liquids).reduce((s, x) => s + x, 0)
      return { a: v(L.state.objects.find(o => o.id === ids.A)), b: v(L.state.objects.find(o => o.id === ids.B)), spill: L.state.spill.mL }
    }, ids)
    assert.ok(r.b > 5, `poured into B: ${r.b}`)
    assert.ok(Math.abs(r.a + r.b + r.spill - 60) < 1e-6, `conserved ${JSON.stringify(r)}`)
  })

  await test('T05 3D: xoay camera ở vùng trống không đổi trạng thái; Undo dùng chung', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['water', 30]] } })
    await open3d(page)
    await drag3d(page, { x: 300, y: 30 }, { x: 380, y: 30 })
    await page.waitForTimeout(300)
    const before = pose(await obj(page, ids.A))
    const box = await page.locator('.dlab-3d canvas').boundingBox()
    await page.mouse.move(box.x + 20, box.y + 20)
    await page.mouse.down()
    await page.mouse.move(box.x + 160, box.y + 60, { steps: 10 })
    await page.mouse.up()
    await page.waitForTimeout(300)
    assert.equal(pose(await obj(page, ids.A)), before, 'orbit does not touch the simulation')
    await st(page, L => L.select(null))
    await page.locator('.dlab-3d canvas').focus()
    await page.keyboard.press('Control+z')
    assert.ok(Math.abs((await obj(page, ids.A)).x - 300) < 1, 'Ctrl+Z in 3D undoes the 3D move')
    await btn(page, 'Xem 2D').click()
    assert.ok(Math.abs((await obj(page, ids.A)).x - 300) < 1, 'state kept after returning to 2D')
  })

  // ── Touch (emulated): real touch events through the DevTools protocol → pointerType "touch".
  // Chromium only (CDP). This is emulation, not a physical device.
  async function touch(page) {
    const cdp = await page.context().newCDPSession(page)
    const send = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], id) => ({ x, y, id })) })
    return {
      async drag(from, to, { steps = 12, hold } = {}) {
        const a = await screen(page, from.x, from.y)
        const b = await screen(page, to.x, to.y)
        await send('touchStart', [[a.x, a.y]])
        for (let i = 1; i <= steps; i += 1) await send('touchMove', [[a.x + (b.x - a.x) * i / steps, a.y + (b.y - a.y) * i / steps]])
        if (hold) await hold()
        await send('touchEnd', [])
      },
      async pinch(cx, cy, d0, d1) {
        await send('touchStart', [[cx - d0, cy], [cx + d0, cy]])
        for (let i = 1; i <= 8; i += 1) { const d = d0 + (d1 - d0) * i / 8; await send('touchMove', [[cx - d, cy], [cx + d, cy]]) }
        await send('touchEnd', [])
      }
    }
  }
  if (browserName === 'chromium') {
    for (const [w, h] of [[320, 640], [390, 844], [768, 1024]]) {
      await test(`TC${w} cảm ứng ${w}px: kéo cốc, nhúng quỳ, pinch không đổi trạng thái`, async page => {
        const t = await touch(page)
        const ids = await bench(page, { A: { type: 'beaker100', x: 380, fill: [['hcl', 60]] }, B: { type: 'beaker100', x: 520, fill: [['water', 30]] } })
        await st(page, L => L.fit())
        await t.drag({ x: 520, y: 30 }, { x: 470, y: 30 })
        await wait(page, (L, id) => Math.abs(L.state.objects.find(o => o.id === id).x - 470) < 3, ids.B)
        ids.P = await st(page, L => L.dispatch({ type: 'newLitmus', x: 450 }, { record: false }).id)
        await st(page, L => L.fit())
        const s = await surface(page, ids.A)
        const p0 = await obj(page, ids.P)
        await t.drag({ x: p0.x, y: p0.y + 50 }, { x: 380, y: s - 12 + 50 }, { hold: () => page.waitForTimeout(1500) })
        const p = await obj(page, ids.P)
        assert.ok(p.seg.filter(x => x.wet > 0.5 && redDominant(x.rgb)).length >= 3, 'dipped by touch')
        const before = await st(page, L => JSON.stringify(L.state.objects.map(o => [o.id, o.x, o.y])))
        const box = await page.locator('.dlab-canvas').boundingBox()
        await t.pinch(box.x + box.width / 2, box.y + 40, 30, 70)
        assert.equal(await st(page, L => JSON.stringify(L.state.objects.map(o => [o.id, o.x, o.y]))), before, 'pinch only zooms the view')
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        assert.ok(overflow <= 0, `overflow ${overflow}`)
        await page.screenshot({ path: `${outDir}/${browserName}-tc${w}.png` })
      }, { width: w, height: h, touch: true })
    }
  }

  await test('TC02 nhập thông số thay cho kéo: nhúng quỳ 15 mm rồi lấy ra', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 380, fill: [['naoh', 60]] } })
    ids.P = await st(page, L => L.dispatch({ type: 'newLitmus', x: 480 }, { record: false }).id)
    await select(page, ids.P)
    const drawer = page.getByRole('button', { name: 'Chi tiết', exact: true })
    if (await drawer.isVisible()) await drawer.click()
    await showDetails(page); await page.locator('[data-in="dip-mm"]').fill('15')
    await panelBtn(page, 'Nhúng').click()
    await wait(page, (L, id) => L.state.objects.find(o => o.id === id).inside, ids.P)
    await page.waitForTimeout(1500)
    await panelBtn(page, 'Lấy ra').click()
    await wait(page, (L, id) => !L.state.objects.find(o => o.id === id).inside, ids.P)
    const p = await obj(page, ids.P)
    const blue = c => c[2] > c[0] + 40
    const wet = p.seg.filter(x => x.wet > 0.5)
    assert.ok(wet.length >= 4 && wet.every(x => blue(x.rgb)), `blue zone after dip: ${wet.length}`)
    assert.ok(p.seg[27].wet === 0, 'top stays dry')
  }, { width: 390, height: 844, touch: true })

  // ── UX rescue (ChemLab 7.0): newcomer flows through visible controls only ──
  await test('U01 hướng dẫn nhanh: hiện lần đầu, bỏ qua được, mở lại bằng nút ?', async page => {
    const coach = page.locator('.dlab-coach')
    await coach.waitFor()
    assert.match(await coach.innerText(), /1\/4/)
    await page.locator('.dlab-lib.is-coach-target').waitFor()
    await btn(page, 'Tiếp').click()
    assert.match(await coach.innerText(), /2\/4/)
    await btn(page, 'Bỏ qua').click()
    await coach.waitFor({ state: 'hidden' })
    await page.reload()
    await page.waitForFunction(() => window.ChemLabDynamicLab?.ready)
    await page.waitForTimeout(500)
    assert.equal(await coach.isVisible(), false, 'not shown again after skipping')
    await page.getByRole('button', { name: 'Hướng dẫn sử dụng' }).click()
    await coach.waitFor()
  }, { onboarding: true })

  await test('U02 natri + nước chỉ bằng điều khiển nhìn thấy: tìm, cảnh báo, quan sát, kết luận', async page => {
    const ids = await bench(page, { A: { type: 'beaker250', x: 400 } })
    await select(page, ids.A)
    await page.locator('.dlab-search').fill('nước')
    await page.locator('.dlab-lib-item').first().click()
    await page.locator('[data-qa-in="ml"]').fill('100')
    await page.locator('.dlab-actionbar [data-qa="pour"]').click()
    await wait(page, (L, id) => Object.values(L.state.objects.find(o => o.id === id).contents.liquids).reduce((s, v) => s + v, 0) > 99, ids.A)
    await page.locator('.dlab-search').fill('phenol')
    await page.locator('.dlab-lib-item').first().click()
    await page.locator('.dlab-actionbar [data-qa="drops"]').click()
    await wait(page, (L, id) => (L.state.objects.find(o => o.id === id).contents.indicators.phenolphthalein || 0) > 0, ids.A)
    await page.locator('.dlab-search').fill('natri')
    assert.match(await page.locator('.dlab-lib-item').first().innerText(), /Natri \(mẩu\)/, 'sodium metal ranks first')
    await page.locator('.dlab-lib-item').first().click()
    await page.locator('.dlab-dialog input').fill('0.1')
    await page.locator('.dlab-dialog button[type="submit"]').click()
    await page.locator('.dlab-dialog', { hasText: 'Natri phản ứng mãnh liệt' }).waitFor()
    await page.getByRole('button', { name: 'Tôi hiểu, tiếp tục' }).click()
    for (let i = 0; i < 2; i += 1) {
      await page.waitForTimeout(300)
      if (await page.locator('.dlab-dialog[open]').count()) await page.getByRole('button', { name: 'Tôi hiểu, tiếp tục' }).click()
    }
    await wait(page, (L, id) => L.state.objects.some(o => o.type === 'solid' && o.reagent === 'na' && o.in === id), ids.A)
    await page.locator('.dlab-now', { hasText: 'natri' }).waitFor()
    const tongs = await st(page, L => L.state.objects.find(o => o.type === 'tongs'))
    assert.equal(tongs.y, 0, 'tongs put back on the bench, not floating')
    await btn(page, '4×').click()
    await page.locator('.dlab-conclusion', { hasText: '2Na + 2H₂O' }).waitFor({ timeout: 60000 })
    const text = await page.locator('.dlab-conclusion').innerText()
    const pH = await st(page, (L, id) => L.state.objects.find(o => o.id === id).pH, ids.A)
    assert.ok(/chuyển hồng/.test(text) && text.includes(pH.toLocaleString('vi-VN', { maximumFractionDigits: 1 })), `conclusion uses the real pH: ${text}`)
  })

  await test('U03 nghiêng tay bằng thanh trượt: mô phỏng quyết định lượng rót, bảo toàn thể tích', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['cuso4', 60]] }, B: { type: 'beaker250', x: 430 } })
    await select(page, ids.A)
    await page.locator('[data-qa-in="to"]').selectOption(ids.B)
    const slider = page.locator('[data-qa-in="tilt"]')
    await slider.focus()
    for (let i = 0; i < 14; i += 1) await page.keyboard.press('ArrowRight')
    await wait(page, (L, ids) => Object.values(L.state.objects.find(o => o.id === ids.B).contents.liquids).reduce((s, v) => s + v, 0) > 5, ids)
    for (let i = 0; i < 14; i += 1) await page.keyboard.press('ArrowLeft')
    await wait(page, L => !L.state.streams.length)
    const v = await st(page, (L, ids) => ['A', 'B'].map(k => Object.values(L.state.objects.find(o => o.id === ids[k]).contents.liquids).reduce((s, x) => s + x, 0)), ids)
    assert.ok(Math.abs(v[0] + v[1] - 60) < 1e-6, `volume conserved: ${v}`)
    const a = await obj(page, ids.A)
    assert.equal(a.angle, 0, 'upright again')
    assert.equal(a.y, 0, 'back on the bench')
  })

  await test('U04 dụng cụ thả giữa không trung rơi về mặt bàn', async page => {
    const ids = await bench(page, { D: { type: 'dropper', x: 500, y: 0 }, A: { type: 'beaker100', x: 300 } })
    const up = await dragWorld(page, { x: 500, y: 40 }, { x: 420, y: 160 })
    await up()
    await wait(page, (L, id) => L.state.objects.find(o => o.id === id).y === 0, ids.D)
    const d = await obj(page, ids.D)
    const up2 = await dragWorld(page, { x: d.x, y: 40 }, { x: 300, y: 120 })
    await up2()
    await page.waitForTimeout(200)
    assert.ok((await obj(page, ids.D)).y > 60, 'held over a beaker it stays in place (ready to drip)')
  })

  await test('U05 thanh thao tác theo ngữ cảnh và bảng Quan sát gộp nhật ký', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['water', 30]] } })
    await select(page, ids.A)
    await page.locator('.dlab-actionbar', { hasText: 'Cốc A' }).waitFor() // vessels are named with a letter since the label rework
    for (let i = 0; i < 3; i += 1) await st(page, L => L.dispatch({ type: 'cleanup' }))
    await st(page, L => { L.state.spill.mL = 2; L.dispatch({ type: 'cleanup' }) })
    const journal = await st(page, L => L.state.log.filter(e => e.text.startsWith('Dọn bàn')).length)
    assert.equal(journal, 1, 'only the cleanup that cleaned something is logged')
    if (!(await page.locator('.dlab-journal').isVisible())) await page.locator('.dlab-fab--side').click()
    await page.locator('.dlab-journal summary').click()
    await page.locator('.dlab-journal', { hasText: 'Dọn bàn' }).waitFor()
  })

  await test('U06 3D: góc mặc định, vừa khung, nhãn khi rê chuột, vòng chọn', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['cuso4', 40]] }, B: { type: 'flask', x: 420 } })
    await btn(page, 'Xem 3D').click()
    await page.locator('.dlab-3d canvas').waitFor()
    await page.waitForTimeout(900)
    const p = await st(page, (L, id) => { const o = L.state.objects.find(x => x.id === id); return L.worldToScreen3d(o.x, o.y + 30) }, ids.B)
    await page.mouse.move(p.x, p.y)
    await page.mouse.move(p.x + 1, p.y)
    await page.locator('.dlab-label.is-hover', { hasText: 'Bình tam giác' }).waitFor() // hover label (shared 2D/3D overlay)
    await page.mouse.click(p.x, p.y)
    assert.equal(await st(page, L => L.selected()), ids.B)
    await btn(page, 'Vừa khung').click()
    await btn(page, 'Góc mặc định').click()
    await page.waitForTimeout(800)
    const q = await st(page, (L, id) => { const o = L.state.objects.find(x => x.id === id); return L.worldToScreen3d(o.x, o.y + 35) }, ids.A)
    const box = await page.locator('.dlab-3d canvas').boundingBox()
    assert.ok(q.x > box.x && q.x < box.x + box.width && q.y > box.y && q.y < box.y + box.height, 'home view keeps objects in frame')
    await page.screenshot({ path: `${outDir}/${browserName}-u06-3d.png` })
  })

  await test('U07 điện thoại 390 px: thư viện là bảng trượt, tự đóng sau khi lấy', async page => {
    await bench(page, {})
    const lib = page.locator('.dlab-lib')
    assert.equal(await lib.isVisible(), false, 'bench first: library closed on phones')
    await btn(page, 'Thư viện').click()
    await lib.waitFor()
    await page.locator('.dlab-lib-item', { hasText: 'Cốc thủy tinh 100 mL' }).first().click()
    await lib.waitFor({ state: 'hidden' })
    await wait(page, L => L.state.objects.length === 1)
    for (const name of ['Hoàn tác', 'Đặt lại', 'Vừa khung', 'Tạm dừng']) assert.ok(await btn(page, name).isVisible(), `${name} reachable`)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    assert.ok(overflow <= 1, `no horizontal scroll: ${overflow}`)
  }, { width: 390, height: 844, touch: true })

  // ── Tongs, guided strip, labels (ChemLab 7.0 guided-lab fix): real mouse input only ──
  const nailId = page => st(page, L => L.state.objects.find(o => o.type === 'solid' && o.reagent === 'fe')?.id)
  async function nailInBeaker(page, fill) {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill }, K: { type: 'tongs', x: 470 } })
    await st(page, (L, ids) => {
      const a = L.state.objects.find(o => o.id === ids.A)
      L.dispatch({ type: 'move', id: ids.K, x: a.x, y: 160 }, { record: false })
      L.dispatch({ type: 'pick', tool: ids.K, reagent: 'fe', massG: 2 }, { record: false })
      L.dispatch({ type: 'release', tool: ids.K }, { record: false })
      L.dispatch({ type: 'move', id: ids.K, x: 470, y: 0 }, { record: false })
    }, ids)
    ids.N = await nailId(page)
    await wait(page, (L, id) => L.state.objects.find(o => o.id === id).in, ids.N)
    // With CuSO₄ the first reaction opens the "Quan sát" panel and the bench re-frames: wait for that.
    if (fill.length) await page.locator('.dlab-now').first().waitFor()
    return ids
  }
  // The bench re-frames when a drawer opens (first reaction opens "Quan sát") or the action bar changes
  // height; click only once the view has settled, as a person would.
  async function settled(page) {
    let prev = ''
    for (let i = 0; i < 20; i += 1) {
      const v = JSON.stringify(await st(page, L => { const v = L.view(); return [v.x, v.y, v.zoom, v.ox] }))
      if (v === prev) return
      prev = v
      await page.waitForTimeout(120)
    }
  }
  const clickWorld = async (page, x, y) => { await settled(page); const p = await screen(page, x, y); await page.mouse.click(p.x, p.y); await page.waitForTimeout(150) }

  await test('G01 kẹp: chọn kẹp → bấm đinh trong dung dịch → kéo ra bàn → thả; hóa học giữ nguyên; hoàn tác', async page => {
    const ids = await nailInBeaker(page, [['cuso4', 40]])
    await st(page, L => L.state.objects.find(o => o.type === 'solid').coat.Cu = 9e-4) // as after reacting: the coat must survive
    await clickWorld(page, 470, 60)
    assert.equal(await st(page, L => L.selected()), ids.K, 'tongs selected')
    await page.locator('.dlab-label.is-grab', { hasText: 'Đinh sắt' }).waitFor() // grabbable piece is marked
    await page.locator('.dlab-actionbar [data-qa-in="piece"]').waitFor() // the bench re-frames when the bar changes height
    await page.waitForTimeout(300)
    await clickWorld(page, 300, 16) // the middle of the nail standing in the beaker
    let n = await obj(page, ids.N)
    assert.equal(n.holder, ids.K, 'clicking the nail with the tongs grabs it')
    assert.equal(n.in, null)
    const coatAtGrab = n.coat.Cu
    assert.ok(coatAtGrab >= 9e-4, 'coat from the reaction is carried with the nail')
    const k = await obj(page, ids.K)
    const up = await dragWorld(page, { x: k.x, y: k.y + 60 }, { x: 150, y: 70 })
    await up()
    await page.waitForTimeout(300)
    n = await obj(page, ids.N)
    assert.deepEqual([n.in, n.holder, n.y], [null, null, 0], 'nail lies on the bench')
    assert.equal(n.coat.Cu, coatAtGrab, 'copper coat kept; no reaction out of the liquid')
    await btn(page, 'Hoàn tác').click()
    await btn(page, 'Hoàn tác').click()
    n = await obj(page, ids.N)
    assert.equal(n.in, ids.A, 'two undo steps: put-down, then the grab')
  })

  await test('G02 kéo đinh ra trực tiếp (không chọn kẹp trước): dùng kẹp trên bàn; bình rỗng', async page => {
    const ids = await nailInBeaker(page, [])
    const up = await dragWorld(page, { x: 300, y: 16 }, { x: 150, y: 80 })
    let n = await obj(page, ids.N)
    assert.equal(n.holder, ids.K, 'dragging the nail picks it up with the free tongs')
    await up()
    await page.waitForTimeout(300)
    n = await obj(page, ids.N)
    assert.deepEqual([n.in, n.holder, n.y], [null, null, 0])
    assert.equal(await st(page, L => L.state.objects.filter(o => o.type === 'tongs').length), 1, 'no extra tongs created')
  })

  await test('G03 thanh thao tác: "Gắp ra, đặt lên bàn"; vật đã phản ứng hết không gắp được', async page => {
    const ids = await nailInBeaker(page, [['cuso4', 40]])
    await clickWorld(page, 300, 16)
    assert.equal(await st(page, L => L.selected()), ids.N, 'the nail itself can be selected inside the beaker')
    await btn(page, 'Gắp ra, đặt lên bàn').click()
    await page.waitForTimeout(300)
    let n = await obj(page, ids.N)
    assert.deepEqual([n.in, n.holder, n.y], [null, null, 0])
    // A piece used up by reaction is not offered and cannot be grabbed.
    await st(page, (L, id) => { L.state.objects.find(o => o.id === id).massG = 0 }, ids.N)
    await select(page, ids.K)
    await page.waitForTimeout(200)
    assert.equal(await page.locator('[data-qa-in="piece"]').count(), 0, 'nothing to grab is offered')
    await clickWorld(page, n.x, 3)
    n = await obj(page, ids.N)
    assert.equal(n.holder ?? null, null)
  })

  await test('G04 3D: gắp đinh bằng chuột, chuyển 2D vẫn đang kẹp (không nhân bản), thả trong 2D', async page => {
    const ids = await nailInBeaker(page, [['cuso4', 40]])
    await btn(page, 'Xem 3D').click()
    await page.locator('.dlab-3d canvas').waitFor()
    await page.waitForTimeout(900)
    const at3 = (x, y) => st(page, (L, a) => L.worldToScreen3d(a[0], a[1]), [x, y])
    let p = await at3(470, 60)
    await page.mouse.click(p.x, p.y)
    await page.waitForTimeout(200)
    assert.equal(await st(page, L => L.selected()), ids.K, 'thin tongs can be clicked in 3D')
    const n0 = await obj(page, ids.N)
    p = await at3(n0.x, n0.y + 10)
    await page.mouse.click(p.x, p.y)
    await page.waitForTimeout(200)
    assert.equal((await obj(page, ids.N)).holder, ids.K, 'nail grabbed in 3D (not the beaker around it)')
    await page.screenshot({ path: `${outDir}/${browserName}-g04-3d-held.png` })
    await btn(page, 'Xem 2D').click()
    await page.waitForTimeout(300)
    const n = await obj(page, ids.N)
    assert.equal(n.holder, ids.K, 'still held after switching to 2D')
    assert.equal(await st(page, L => L.state.objects.filter(o => o.reagent === 'fe').length), 1, 'no duplicate')
    await btn(page, 'Đặt lên bàn').click()
    await page.waitForTimeout(200)
    assert.deepEqual([(await obj(page, ids.N)).holder ?? null, (await obj(page, ids.N)).y], [null, 0])
  })

  await test('G05 Guided Lab kim loại: thanh bước, kẹp gợi ý đúng chất, tốc độ 4× thật, tua đến hiện tượng', async page => {
    await btn(page, 'Có hướng dẫn').click()
    await page.locator('.dlab-choice', { hasText: 'Kim loại' }).click()
    const strip = page.locator('.dlab-gstrip')
    await strip.locator('.dlab-gstep', { hasText: 'Bước 1/5' }).waitFor()
    await page.locator('[data-gs="help"]').click() // the completion sign is in the help, keeping the strip short
    assert.match(await page.locator('.dlab-ghelp').innerText(), /Hoàn thành khi:/)
    await page.locator('[data-gs="help"]').click()
    const roles = await st(page, L => { const b = L.state.objects.filter(o => o.type === 'beaker100'); return { cu: b[0].id, tongs: L.state.objects.find(o => o.type === 'tongs').id } })
    const k = await obj(page, roles.tongs)
    await clickWorld(page, k.x, k.y + 60)
    assert.equal(await page.locator('[data-qa-in="solid"]').inputValue(), 'fe', 'step 1 needs the nail: tongs offer it')
    assert.equal(await page.locator('[data-qa-in="mass"]').inputValue(), '2')
    await page.locator('[data-qa-in="solid"]').selectOption('na')
    assert.equal(await page.locator('[data-qa-in="mass"]').inputValue(), '0.1', 'each solid gets its own mass')
    await page.locator('[data-qa-in="solid"]').selectOption('fe')
    assert.equal(await page.locator('[data-qa-in="mass"]').inputValue(), '2')
    await btn(page, 'Lấy').click()
    await page.locator('[data-qa-in="to"]').selectOption(roles.cu)
    await btn(page, 'Thả').click()
    await strip.locator('.dlab-gstep', { hasText: 'Bước 2/5' }).waitFor({ timeout: 10000 })
    // 4× really runs the model 4× faster than real time.
    await btn(page, '4×').click()
    const [s0, r0] = await st(page, L => [L.state.t, performance.now()])
    await page.waitForTimeout(1500)
    const [s1, r1] = await st(page, L => [L.state.t, performance.now()])
    const ratio = (s1 - s0) / ((r1 - r0) / 1000)
    assert.ok(ratio > 3.2 && ratio < 4.4, `simulated/real time at 4× = ${ratio.toFixed(2)}`)
    assert.match(await page.locator('.dlab-time').innerText(), /Mô phỏng \d+:\d\d/)
    // A small nail, then jump to the phenomenon with the model.
    await st(page, L => { const n = L.state.objects.find(o => o.reagent === 'fe'); n.massG = 0.1; n.mass0 = 0.1; n.coat = {} })
    await btn(page, '1×').click()
    await page.locator('[data-gs="ffwd"]').click()
    await strip.locator('.dlab-gstep', { hasText: 'Bước 3/5' }).waitFor({ timeout: 30000 })
    await page.locator('.dlab-toast', { hasText: 'thời gian mô phỏng' }).waitFor()
    const coat = await st(page, L => L.state.objects.find(o => o.reagent === 'fe').coat.Cu)
    // Same layer as 0.8 mmol on a 2 g nail; a nail's area is proportional to its mass (fixed radius).
    assert.ok(coat > 8e-4 * (0.1 / 2) * 0.98, `copper really deposited by the model: ${coat}`)
    assert.equal(await page.locator('[data-gs="ffwd"]').count(), 0, 'no fast-forward on an action step')
    await page.locator('[data-gs="help"]').click()
    await page.locator('.dlab-ghelp', { hasText: 'Kẽm' }).waitFor()
  })

  await test('G06 nhãn: theo thành phần thật, đổi khi rót, không chặn thao tác, ẩn được', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['cuso4', 40]] }, B: { type: 'beaker100', x: 430, fill: [['hcl', 30]] } })
    await page.locator('.dlab-label', { hasText: 'Cốc A — CuSO₄' }).waitFor()
    await page.locator('.dlab-label', { hasText: 'Cốc B — HCl' }).waitFor()
    await st(page, (L, ids) => { L.dispatch({ type: 'pourExact', from: ids.B, to: ids.A, mL: 10 }) }, ids)
    await page.locator('.dlab-label', { hasText: 'Cốc A — CuSO₄ + HCl' }).waitFor()
    // A click on the label goes through to the object under it.
    const box = await page.locator('.dlab-label', { hasText: 'Cốc A' }).boundingBox()
    const a = await obj(page, ids.A)
    const top = await screen(page, a.x, a.y + 60)
    await page.mouse.click(top.x, Math.max(top.y, box.y + box.height + 2))
    assert.equal(await st(page, L => L.selected()), ids.A)
    // Labels in 3D come from the same state and stay inside the view.
    await btn(page, 'Xem 3D').click()
    await page.locator('.dlab-3d canvas').waitFor()
    await page.waitForTimeout(900)
    const cv = await page.locator('.dlab-3d canvas').boundingBox()
    const lb = await page.locator('.dlab-label', { hasText: 'Cốc B — HCl' }).boundingBox()
    assert.ok(lb && lb.x >= cv.x - 1 && lb.x + lb.width <= cv.x + cv.width + 1, '3D label inside the canvas')
    await page.screenshot({ path: `${outDir}/${browserName}-g06-3d-labels.png` })
    for (const mode of ['Khi chọn', 'Ẩn']) {
      await page.locator('[data-tb="labels"]').click()
      assert.match(await page.locator('[data-tb="labels"]').innerText(), new RegExp(mode))
    }
    assert.equal(await page.locator('.dlab-labels').isVisible(), false, 'labels can be hidden to watch the reaction')
    await page.locator('[data-tb="labels"]').click()
  })

  await test('G07 điện thoại 390 px: thanh bước gọn, gắp bằng nút, không cuộn ngang', async page => {
    await btn(page, 'Có hướng dẫn').click()
    await page.locator('.dlab-choice', { hasText: 'Kim loại' }).click()
    await page.locator('.dlab-gstrip .dlab-gstep', { hasText: 'Bước 1/5' }).waitFor()
    const h = (await page.locator('.dlab-gstrip').boundingBox()).height
    assert.ok(h < 170, `strip height ${h}`)
    const roles = await st(page, L => ({ cu: L.state.objects.find(o => o.type === 'beaker100').id, tongs: L.state.objects.find(o => o.type === 'tongs').id }))
    await select(page, roles.tongs)
    await btn(page, 'Lấy').click()
    await page.locator('[data-qa-in="to"]').selectOption(roles.cu)
    await btn(page, 'Thả').click()
    const n = await wait(page, (L, id) => L.state.objects.some(o => o.reagent === 'fe' && o.in === id), roles.cu).then(() => nailId(page))
    await select(page, n)
    await btn(page, 'Gắp ra, đặt lên bàn').click()
    await wait(page, (L, id) => { const o = L.state.objects.find(x => x.id === id); return !o.in && !o.holder && o.y === 0 }, n)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    assert.ok(overflow <= 1, `no horizontal scroll: ${overflow}`)
    await page.screenshot({ path: `${outDir}/${browserName}-g07-phone.png` })
  }, { width: 390, height: 844, touch: true })

  // ── Post-Codex QA (CL7-QA-001 and UX follow-ups) ──
  const approx = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, msg + ': ' + a + ' vs ' + b)
  await test('G08 kết tủa (CL7-QA-001): ống nhỏ giọt hút 2 mL, 10 giọt, tiến độ định lượng, Cu(OH)₂ sau ≤ 10 thao tác', async page => {
    await btn(page, 'Có hướng dẫn').click()
    await page.locator('.dlab-choice', { hasText: 'Tạo kết tủa' }).click()
    const strip = page.locator('.dlab-gstrip')
    await strip.locator('.dlab-gstep', { hasText: 'Bước 1/5' }).waitFor()
    assert.match(await strip.innerText(), /3 mL/, 'the task states the amount the model needs')
    const progress = page.locator('.dlab-gprogress')
    assert.match(await progress.innerText(), /Chưa nhỏ NaOH/)
    const r = await st(page, L => ({ d: L.state.objects.find(o => o.type === 'dropper'), naoh: L.state.objects.find(o => o.reagent === 'naoh').id, a: L.state.objects.find(o => o.type === 'beaker100').id }))
    await clickWorld(page, r.d.x, r.d.y + 45)
    assert.equal(await st(page, L => L.selected()), r.d.id)
    await page.locator('[data-qa-in="from"]').selectOption(r.naoh)
    await btn(page, 'Hút 2 mL').click()
    let actions = 1
    const texts = []
    while (!(await st(page, L => L.guided().done)) && actions < 12) {
      const left = await st(page, (L, id) => Object.values(L.state.objects.find(o => o.id === id).contents.liquids).reduce((a, b) => a + b, 0), r.d.id)
      if (left < 0.5 - 1e-6) {
        assert.equal(await page.locator('[data-qa-in="from"]').inputValue(), r.naoh, 'refilling offers the NaOH bottle again, not the beaker')
        await btn(page, 'Hút 2 mL').click()
      }
      else {
        assert.equal(await page.locator('[data-qa-in="to"]').inputValue(), r.a)
        await btn(page, '10 giọt').click()
        await page.waitForTimeout(600)
        texts.push(await progress.innerText().catch(() => ''))
      }
      actions += 1
    }
    assert.ok(await st(page, L => L.guided().done) >= 1, `step 1 done after ${actions} actions`)
    assert.ok(actions <= 10, `actions ${actions}`)
    assert.ok(texts.some(t => /Đã thêm 0,5 mL NaOH .* Cần thêm khoảng \d+(,\d+)? mL \(\d+ giọt\)/.test(t)), texts.join(' | '))
    const a = await obj(page, r.a)
    assert.ok(a.contents.precipitates['Cu(OH)2'] > 2e-4, 'Cu(OH)₂ formed by the engine')
    approx(a.contents.ions['Na+'] * 1000 / 0.5, (actions - 2) * 0.5, 0.05, 'every drop reached the beaker (mL of NaOH)')
    await page.screenshot({ path: `${outDir}/${browserName}-g08-precipitate.png` })
  })

  await test('L01 Tủ hóa chất / Kệ dụng cụ: hai khu, nhóm không cuộn ngang, tìm có/không dấu và công thức', async page => {
    await bench(page, {})
    const lib = page.locator('.dlab-lib')
    for (let i = 0; i < 12; i += 1) await page.getByRole('tab', { name: i % 2 ? 'Kệ dụng cụ' : 'Tủ hóa chất' }).click()
    assert.equal(await page.getByRole('tab', { name: 'Tủ hóa chất' }).getAttribute('aria-selected'), 'false')
    const names = async () => page.locator('.dlab-lib-item .dlab-lib-name').allInnerTexts()
    for (const g of ['Kẹp hóa chất', 'Ống nhỏ giọt', 'Đũa thủy tinh', 'Pipet 10 mL', 'Giấy quỳ tím', 'Cốc thủy tinh 100 mL', 'Máy đo pH']) assert.ok((await names()).includes(g), `tool shelf lists ${g}`)
    await page.getByRole('tab', { name: 'Tủ hóa chất' }).click()
    for (const chip of ['Dung dịch', 'Chất rắn', 'Chất lỏng', 'Chất khí', 'Chất chỉ thị']) {
      const c = page.locator('.dlab-chip', { hasText: chip })
      assert.ok(await c.isVisible(), `chip ${chip} visible`)
      await c.click()
      assert.ok((await names()).length > 0, `${chip} has items`)
    }
    const overflow = await lib.evaluate(el => [...el.querySelectorAll('.dlab-shelves, .dlab-groups, .dlab-lib-list')].map(n => n.scrollWidth - n.clientWidth))
    assert.ok(overflow.every(v => v <= 1), `no sideways scrolling: ${overflow}`)
    for (const [q, want] of [['muoi an', 'Muối ăn (tinh thể)'], ['CuSO4', 'Đồng(II) sunfat'], ['CuSO₄', 'Đồng(II) sunfat'], ['kep', 'Kẹp hóa chất'], ['naoh', 'Natri hiđroxit']]) {
      await page.locator('.dlab-search').fill(q)
      assert.equal((await names())[0], want, `search “${q}”`)
    }
    await page.locator('.dlab-search').fill('kep')
    await page.locator('.dlab-lib-item', { hasText: 'Kẹp hóa chất' }).first().click()
    await wait(page, L => L.state.objects.some(o => o.type === 'tongs'))
  })

  await test('W01 bàn 2D đứng yên: chọn dụng cụ, mở/đóng Quan sát, đổi thanh thao tác không làm vật dịch chuyển', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 380, fill: [['water', 30]] }, D: { type: 'dropper', x: 450, y: 0 }, K: { type: 'tongs', x: 330 } })
    await settled(page)
    const where = () => st(page, (L, id) => { const o = L.state.objects.find(x => x.id === id); return L.worldToScreen(o.x, o.y + 20) }, ids.A)
    const p0 = await where()
    const moved = async what => { const p = await where(); assert.ok(Math.hypot(p.x - p0.x, p.y - p0.y) < 1.5, `${what}: beaker moved ${JSON.stringify(p0)} → ${JSON.stringify(p)}`) }
    await clickWorld(page, 450, 45); await moved('select dropper (action bar changes)')
    await clickWorld(page, 330, 60); await moved('select tongs')
    await btn(page, 'Lấy').click()
    const warn = page.getByRole('button', { name: 'Tôi hiểu, tiếp tục' })
    if (await warn.isVisible().catch(() => false)) await warn.click() // sodium is the first solid: confirm the safety note
    await page.waitForTimeout(300); await moved('take a piece (object count changes)')
    // Opening the panel: nothing moves right after the click. Later (pointer at rest) the view may re-frame,
    // but only if the panel or a narrower, wrapped action bar really hides something.
    await page.locator('.dlab-fab--side').click()
    await page.waitForTimeout(300); await moved('open Quan sát, just after the click')
    const hidden = await st(page, L => L.hiddenObject())
    await page.waitForTimeout(1300)
    if (!hidden) await moved('open Quan sát (nothing hidden)')
    else assert.equal(await st(page, L => L.hiddenObject()), false, 'after re-framing nothing is hidden')
    const p1 = await where()
    await page.locator('[data-close="side"]').click(); await page.waitForTimeout(1300)
    const p2 = await where()
    assert.ok(Math.hypot(p2.x - p1.x, p2.y - p1.y) < 1.5, 'closing the panel hides nothing, so nothing moves')
  })

  await test('W02 bàn 2D: dụng cụ bị che chỉ được căn lại khi chuột đã dừng, không trong lúc kéo', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['water', 30]] }, B: { type: 'beaker100', x: 760 } })
    await settled(page)
    const view0 = await st(page, L => L.view())
    // Drag beaker A; while the pointer is down the view must not change, whatever else happens.
    const a = await screen(page, 300, 30)
    await page.mouse.move(a.x, a.y); await page.mouse.down()
    await page.mouse.move(a.x + 60, a.y - 20, { steps: 6 })
    await st(page, L => { L.dispatch({ type: 'add', equipmentType: 'beaker250', x: 1400, y: 0 }, { record: false }) }) // far off-screen
    await page.waitForTimeout(1200)
    assert.deepEqual(await st(page, L => L.view()), view0, 'no re-framing during a drag')
    await page.mouse.up()
    await page.waitForTimeout(1500)
    const v1 = await st(page, L => L.view())
    assert.notDeepEqual(v1, view0, 'after the pointer rests, the hidden beaker is brought into view')
    const far = await st(page, L => { const o = L.state.objects.find(x => x.type === 'beaker250'); return L.worldToScreen(o.x, o.y + 40) })
    const box = await page.locator('.dlab-canvas').boundingBox()
    assert.ok(far.x < box.x + box.width, 'the new beaker is visible')
    assert.ok(ids.B)
  })

  await test('T02 3D: kéo vật không xoay camera, xoay camera không dời vật, phản hồi thả đúng/sai, nhìn vật chọn', async page => {
    const ids = await bench(page, {
      T: { type: 'testTube', x: 300, fill: [['water', 10]] }, D: { type: 'dish', x: 470, fill: [['water', 150]] }, K: { type: 'tongs', x: 620 }, B: { type: 'beaker100', x: 380 }
    })
    await btn(page, 'Xem 3D').click()
    await page.locator('.dlab-3d canvas').waitFor()
    await page.waitForTimeout(900)
    const at3 = (x, y) => st(page, (L, a) => L.worldToScreen3d(a[0], a[1]), [x, y])
    const cam = () => st(page, L => L.camera3d())
    // Orbit on empty space: camera moves, objects stay.
    const before = JSON.stringify(await st(page, L => L.state.objects.map(o => [o.id, o.x, o.y])))
    const c0 = await cam()
    const e = await at3(470, 150) // empty space above the dish (the library drawer covers the left edge)
    assert.equal(await page.evaluate(p => document.elementFromPoint(p.x, p.y)?.tagName, e), 'CANVAS', 'the "empty space" point is on the 3D canvas, not under a panel')
    await page.mouse.move(e.x, e.y); await page.mouse.down(); await page.mouse.move(e.x + 120, e.y + 10, { steps: 8 }); await page.mouse.up()
    await page.waitForTimeout(300)
    assert.notDeepEqual((await cam()).pos, c0.pos, 'dragging empty space orbits the camera')
    assert.equal(JSON.stringify(await st(page, L => L.state.objects.map(o => [o.id, o.x, o.y]))), before, 'orbiting moved no object')
    // Take sodium with the tongs, carry it: over the test tube → red, over the dish → green; the camera holds still.
    await st(page, (L, id) => { L.dispatch({ type: 'pick', tool: id, reagent: 'na', massG: 0.1 }, { record: false, confirmed: true }) }, ids.K)
    const k = await obj(page, ids.K)
    for (let i = 0, prev = ''; i < 30; i += 1) { const c = JSON.stringify(await cam()); if (c === prev) break; prev = c; await page.waitForTimeout(120) } // orbit damping (inertia) has run out
    const c1 = await cam()
    let p = await at3(k.x, k.y + 60)
    await page.mouse.move(p.x, p.y); await page.mouse.down()
    const tube = await obj(page, ids.T)
    p = await at3(tube.x, 150)
    await page.mouse.move(p.x, p.y, { steps: 10 })
    await page.waitForTimeout(250)
    const bad = await st(page, L => L.drop())
    assert.equal(bad?.id, ids.T); assert.equal(bad.ok, false, 'sodium over a test tube is refused')
    assert.ok(await page.locator('.dlab-label.is-drop-bad').isVisible(), 'the refusal is shown on the target')
    const dish = await obj(page, ids.D)
    p = await at3(dish.x, 110)
    await page.mouse.move(p.x, p.y, { steps: 10 })
    await page.waitForTimeout(250)
    const good = await st(page, L => L.drop())
    assert.equal(good?.id, ids.D); assert.equal(good.ok, true)
    assert.ok(await page.locator('.dlab-label.is-drop-ok').isVisible())
    await page.screenshot({ path: `${outDir}/${browserName}-t02-drop-ok.png` })
    const c2 = (await cam()).pos
    assert.ok(Math.hypot(c2[0] - c1.pos[0], c2[1] - c1.pos[1], c2[2] - c1.pos[2]) < 1e-3, `carrying an object did not rotate the camera: ${c1.pos} → ${c2}`)
    await page.mouse.up()
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: 'Tôi hiểu, tiếp tục' }).click()
    await wait(page, (L, id) => L.state.objects.some(o => o.reagent === 'na' && o.in === id), ids.D)
    assert.equal(await st(page, L => L.drop()), null, 'feedback cleared after the drop')
    // Focus the selected beaker: the camera comes closer and looks at it.
    await select(page, ids.B)
    const d0 = await cam()
    await btn(page, 'Nhìn vật chọn').click()
    await page.waitForTimeout(800)
    const d1 = await cam()
    const dist = c => Math.hypot(c.pos[0] - c.target[0], c.pos[1] - c.target[1], c.pos[2] - c.target[2])
    assert.ok(dist(d1) < dist(d0), `camera closer: ${dist(d0).toFixed(2)} → ${dist(d1).toFixed(2)}`)
    await btn(page, 'Góc mặc định').click()
    await btn(page, 'Vừa khung').click()
  })

  await test('G10 Guided: cất cốc của bài không làm treo, có hướng dẫn phục hồi; Hoàn tác lùi cả tiến độ', async page => {
    await btn(page, 'Có hướng dẫn').click()
    await page.locator('.dlab-choice', { hasText: 'Nhận biết' }).click()
    const strip = page.locator('.dlab-gstrip')
    await strip.locator('.dlab-gstep', { hasText: 'Bước 1/5' }).waitFor()
    const r = await st(page, L => ({ A: L.state.objects.find(o => o.label === 'Ống A').id, B: L.state.objects.find(o => o.label === 'Ống B').id, P: L.state.objects.find(o => o.type === 'litmusPaper').id }))
    await select(page, r.P)
    await page.locator('[data-qa-in="to"]').selectOption(r.A)
    await btn(page, 'Nhúng').click()
    await strip.locator('.dlab-gstep', { hasText: 'Bước 2/5' }).waitFor()
    // Put Ống B away with the keyboard: the render loop must keep running and say how to recover.
    await select(page, r.B)
    await page.locator('.dlab-canvas').focus()
    await page.keyboard.press('Delete')
    await page.locator('.dlab-gprogress', { hasText: 'bị cất khỏi bàn' }).waitFor()
    const t0 = await st(page, L => L.state.t)
    await page.waitForTimeout(600)
    assert.ok(await st(page, L => L.state.t) > t0, 'simulation still running')
    await page.keyboard.press('Control+z')
    await page.locator('.dlab-gprogress', { hasText: 'bị cất khỏi bàn' }).waitFor({ state: 'detached' })
    assert.ok(await st(page, (L, id) => Boolean(L.state.objects.find(o => o.id === id)), r.B), 'Ống B is back')
    // Undo once more takes back the dip into A: the lesson goes back to step 1 with it.
    await page.keyboard.press('Control+z')
    await page.keyboard.press('Control+z')
    await strip.locator('.dlab-gstep', { hasText: 'Bước 1/5' }).waitFor()
  })

  await test('G09 kết tủa bước 4–5 với đích MẶC ĐỊNH: HCl vào Cốc A, muối vào Cốc B; thả nhầm cốc thì có hướng dẫn phục hồi', async page => {
    await btn(page, 'Có hướng dẫn').click()
    await page.locator('.dlab-choice', { hasText: 'Tạo kết tủa' }).click()
    const strip = page.locator('.dlab-gstrip')
    await strip.locator('.dlab-gstep', { hasText: 'Bước 1/5' }).waitFor()
    const r = await st(page, L => { const o = L.state.objects; return { A: o.find(x => x.type === 'beaker100' && x.contents.ions['Cu2+']).id, B: o.find(x => x.type === 'beaker100' && !x.contents.ions['Cu2+']).id, naoh: o.find(x => x.reagent === 'naoh').id, hcl: o.find(x => x.reagent === 'hcl').id, sp: o.find(x => x.type === 'spatula').id, rod: o.find(x => x.type === 'rod').id } })
    // Steps 1–3 through the bar (pour NaOH, wait, stir): the defaults must already point at Cốc A.
    await select(page, r.naoh)
    assert.equal(await page.locator('[data-qa-in="to"]').inputValue(), r.A, 'step 1: NaOH defaults to Cốc A')
    await page.locator('[data-qa-in="ml"]').fill('4')
    await page.locator('.dlab-actionbar [data-qa="pour"]').click()
    await strip.locator('.dlab-gstep', { hasText: 'Bước 2/5' }).waitFor()
    await page.locator('[data-gs="ffwd"]').click()
    await strip.locator('.dlab-gstep', { hasText: 'Bước 3/5' }).waitFor({ timeout: 30000 })
    await select(page, r.rod)
    await btn(page, 'Khuấy').click()
    await strip.locator('.dlab-gstep', { hasText: 'Bước 4/5' }).waitFor()
    // Step 4: the HCl bottle sits next to Cốc B (water), but the step's vessel is Cốc A. Look at Cốc B first,
    // as a student might: no earlier pick may decide the target.
    await select(page, r.B)
    await page.waitForTimeout(200)
    await select(page, r.hcl)
    assert.equal(await page.locator('[data-qa-in="to"]').inputValue(), r.A, 'step 4: HCl defaults to the step vessel, not the nearest one')
    await page.locator('[data-qa-in="ml"]').fill('15')
    await page.locator('.dlab-actionbar [data-qa="pour"]').click()
    await strip.locator('.dlab-gstep', { hasText: 'Bước 5/5' }).waitFor({ timeout: 30000 })
    assert.equal((await obj(page, r.B)).contents.ions['Cl-'] ?? 0, 0, 'no HCl in the water beaker')
    // Step 5: the spatula's "Thả vào" must not inherit the HCl bottle's pick (Cốc A).
    await select(page, r.sp)
    await btn(page, 'Lấy').click()
    await page.locator('[data-qa-in="to"]').waitFor()
    assert.equal(await page.locator('[data-qa-in="to"]').inputValue(), r.B, 'step 5: salt defaults to the water beaker')
    // Recovery: drop it into the wrong vessel on purpose, the strip says what happened and what to do.
    await page.locator('[data-qa-in="to"]').selectOption(r.A)
    await btn(page, 'Thả').click()
    await page.locator('.dlab-gprogress', { hasText: 'không phải Cốc B' }).waitFor()
    assert.equal(await st(page, L => L.guided().done), 4, 'a wrong vessel does not complete the step')
    await select(page, r.sp)
    await btn(page, 'Lấy').click()
    await page.locator('[data-qa-in="to"]').waitFor()
    assert.equal(await page.locator('[data-qa-in="to"]').inputValue(), r.B)
    await btn(page, 'Thả').click()
    await page.locator('[data-gs="ffwd"]').click({ timeout: 5000 }).catch(() => {})
    await strip.locator('.dlab-gstep', { hasText: 'Hoàn thành 5/5' }).waitFor({ timeout: 40000 })
  })

  // ── Sandbox scenarios beyond the five guided labs (real clicks on the visible controls) ──
  const sideTab = async (page, name) => {
    if (!(await page.locator('.dlab-sidetabs').isVisible())) await page.locator('.dlab-fab--side').click()
    await page.getByRole('tab', { name }).click()
  }
  const pourBar = async (page, bottle, to, mL) => {
    await select(page, bottle)
    await page.locator('[data-qa-in="to"]').selectOption(to)
    await page.locator('[data-qa-in="ml"]').fill(String(mL))
    await page.locator('.dlab-actionbar [data-qa="pour"]').click()
  }

  await test('X01 Sandbox "Khám phá": bày dụng cụ Cu(OH)₂, học sinh tự rót, kết tủa từ mô hình', async page => {
    await btn(page, 'Tự do').click()
    await sideTab(page, 'Khám phá')
    const card = page.locator('.dlab-disc li', { hasText: 'Cu(OH)2↓' })
    await card.getByRole('button', { name: 'Bày dụng cụ' }).click()
    const r = await st(page, L => { const o = L.state.objects; return { v: o.find(x => x.contents?.ions?.['Cu2+'] > 0).id, b: o.find(x => x.type === 'bottle' && x.reagent === 'naoh').id, sel: L.selected() } })
    assert.equal(r.sel, r.b, 'the NaOH bottle is selected, nothing was poured for the student')
    assert.equal(await st(page, (L, id) => Object.keys(L.state.objects.find(o => o.id === id).contents.precipitates).length, r.v), 0, 'no precipitate before the student acts')
    await pourBar(page, r.b, r.v, 6)
    await wait(page, (L, id) => (L.state.objects.find(o => o.id === id).contents.precipitates['Cu(OH)2'] || 0) > 1e-5, r.v)
    await sideTab(page, 'Quan sát')
    await page.locator('.dlab-obs', { hasText: 'Cu(OH)' }).waitFor()
  })

  await test('X02 rót nhầm cốc rồi Hoàn tác: cốc nhầm trở lại như cũ, rót đúng thì có kết tủa', async page => {
    await btn(page, 'Tự do').click()
    const ids = await bench(page, { A: { type: 'beaker100', x: 280, fill: [['water', 20]] }, B: { type: 'beaker100', x: 400, fill: [['agno3', 20]] }, N: { type: 'bottle', x: 540, reagent: 'nacl' } })
    await pourBar(page, ids.N, ids.A, 10)
    await wait(page, (L, id) => (L.state.objects.find(o => o.id === id).contents.ions['Na+'] || 0) > 0, ids.A)
    await page.locator('[data-tb="undo"]').click()
    const a = await obj(page, ids.A)
    assert.ok(!(a.contents.ions['Na+'] > 0) && Math.abs(a.contents.liquids.water - 20) < 1e-9, 'undo restores the wrong beaker')
    await pourBar(page, ids.N, ids.B, 10)
    await wait(page, (L, id) => (L.state.objects.find(o => o.id === id).contents.precipitates.AgCl || 0) > 1e-6, ids.B)
  })

  await test('X03 CuCl₂ + KI từ tủ hóa chất: CuI↓ và I₂, điện phân sau đó bị từ chối trung thực', async page => {
    await btn(page, 'Tự do').click()
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['cucl2', 10]] }, E: { type: 'electrodes', x: 300, y: 12 }, P: { type: 'power', x: 470 } })
    await libGroup(page, 'Tủ hóa chất', 'Dung dịch')
    await page.locator('.dlab-lib-item', { hasText: 'Kali iotua' }).first().click()
    const ki = await st(page, L => L.state.objects.find(o => o.type === 'bottle' && o.reagent === 'ki').id)
    await pourBar(page, ki, ids.A, 20)
    await wait(page, (L, id) => { const c = L.state.objects.find(o => o.id === id).contents; return c.precipitates.CuI > 1e-6 && c.ions.I2 > 1e-6 }, ids.A)
    await wait(page, L => L.labels().join('|').includes('I₂')) // the label names the iodine (labels refresh on the next frame)
    await st(page, (L, ids) => { L.dispatch({ type: 'wire', from: ids.P, to: ids.E }); L.dispatch({ type: 'power', id: ids.P, on: true, volts: 6 }, { confirmed: true }); return true }, ids)
    await page.waitForTimeout(1500)
    const p = await obj(page, ids.P)
    assert.match(p.status, /Chưa hỗ trợ/)
    assert.ok(!(await st(page, L => L.state.gas.Cl2 > 0)), 'no Cl₂ invented')
  })

  // Every Sandbox "Khám phá" card, done by hand: lay out, then the student's own action through the action bar
  // (pour from the bottle, or take the solid with the tool and drop it in), at 4× speed. The result must be what
  // the manifest claims and what the engine registry test gets for the same demo.
  for (const e of DISCOVER) await test(`X06 Khám phá qua giao diện — ${e.id}: ${e.title}`, async page => {
    await btn(page, 'Tự do').click()
    const before = await st(page, L => L.state.objects.map(o => o.id))
    await sideTab(page, 'Khám phá')
    await page.locator('.dlab-disc li', { hasText: e.title }).first().getByRole('button', { name: 'Bày dụng cụ' }).click()
    const d = e.demo
    const ids = await st(page, (L, a) => {
      const fresh = L.state.objects.filter(o => !a.before.includes(o.id))
      return { v: fresh.find(o => o.type === a.vessel)?.id, helper: L.selected() }
    }, { before, vessel: d.vessel })
    assert.ok(ids.v && ids.helper, 'vessel and bottle/tool laid out, the helper selected')
    await page.locator('[data-speed="4"]').first().click()
    const confirm = async () => { const b = page.getByRole('button', { name: 'Tôi hiểu, tiếp tục' }); if (await b.isVisible({ timeout: 700 }).catch(() => false)) await b.click() }
    if (d.pour) await pourBar(page, ids.helper, ids.v, d.pour[1])
    else {
      await page.locator('[data-qa-in="solid"]').selectOption(d.solid[0])
      await page.locator('[data-qa-in="mass"]').fill(String(d.solid[1]))
      await page.locator('.dlab-actionbar [data-qa="pick"]').click()
      await confirm()
      await page.locator('[data-qa-in="to"]').selectOption(ids.v)
      await page.locator('.dlab-actionbar [data-qa="drop-solid"]').click()
      await confirm()
    }
    const x = d.expect
    await wait(page, (L, a) => {
      const s = L.state
      const c = s.objects.find(o => o.id === a.v)
      const solid = s.objects.find(o => o.type === 'solid' && o.in === c.id)
      return (!a.x.gas || (c.gasOut?.[a.x.gas] || 0) > 0) && (!a.x.ion || (c.contents.ions[a.x.ion] || 0) > 1e-7) &&
        (!a.x.deposit || (solid?.coat?.[a.x.deposit] || 0) > 0) && (!a.x.ppt || (c.contents.precipitates[a.x.ppt] || 0) > 1e-9) &&
        (!a.x.note || Object.keys(s.notes).some(k => k.startsWith(a.x.note))) && (!a.x.noPH || c.pH == null)
    }, { v: ids.v, x }, d.run / 4 * 1000 + 25000)
    if (x.oilBelow) assert.ok(oilBelow((await obj(page, ids.v)).contents), 'oil below the ethanol')
    assert.equal(checkInvariants(await st(page, L => JSON.parse(JSON.stringify(L.state)))), null, 'invariants')
  })

  // Experiment Library: every experiment done by hand from its card (lay out, read the guide, pour step by step).
  const BADGE_WORD = { VALIDATED: 'Đã kiểm chứng định lượng', 'EDUCATIONAL APPROXIMATION': 'Xấp xỉ giáo dục', UNVERIFIED: 'Chưa kiểm chứng' }
  for (const e of EXPERIMENTS) await test(`EXP Thư viện thí nghiệm qua giao diện — ${e.id}: ${e.title}`, async page => {
    await btn(page, 'Tự do').click()
    await bench(page, {})
    await sideTab(page, 'Khám phá')
    const card = page.locator(`[data-exp-card="${e.id}"]`)
    assert.equal((await card.locator('.dlab-exp-badge').textContent()).trim(), BADGE_WORD[experimentValidation(e)], 'badge = derived validation')
    await card.locator('summary').click()
    await card.locator('.dlab-exp-eq', { hasText: e.equation.split(';')[0].trim() }).waitFor()
    await card.getByRole('button', { name: 'Bày dụng cụ' }).click()
    const laid = await st(page, L => L.state.objects.map(o => ({ id: o.id, type: o.type, reagent: o.reagent || null })))
    const vessels = laid.filter(o => o.type !== 'bottle').map(o => o.id)
    const bottle = Object.fromEntries(laid.filter(o => o.type === 'bottle').map(o => [o.reagent, o.id]))
    assert.equal(vessels.length, e.setup.vessels.length, 'vessels laid out')
    for (const r of e.setup.bottles) assert.ok(bottle[r], `bottle ${r}`)
    for (const s of e.steps) await pourUI(page, bottle[s.act.pour], vessels[s.act.to], s.act.mL)
    await wait(page, (L, a) => a.expect.every(x => L.events().some(ev => ev.container === a.vessels[x.vessel] && ev.key.startsWith(x.key))), { expect: e.expect, vessels })
    const bad = await st(page, (L, v) => L.events().filter(ev => v.includes(ev.container) && ev.outcome === 'UNSUPPORTED').length, vessels)
    assert.equal(bad, 0, 'nothing unsupported')
  })

  await test('X04 đổi bài giữa chừng: bài mới sạch, không mang trạng thái/tiến độ của bài cũ, không Hoàn tác về bài cũ', async page => {
    await btn(page, 'Có hướng dẫn').click()
    await page.locator('.dlab-choice', { hasText: 'Tạo kết tủa' }).click()
    await page.locator('.dlab-gstrip .dlab-gstep', { hasText: 'Bước 1/5' }).waitFor()
    const r = await st(page, L => { const o = L.state.objects; return { A: o.find(x => x.contents?.ions?.['Cu2+'] > 0).id, naoh: o.find(x => x.reagent === 'naoh').id } })
    await pourBar(page, r.naoh, r.A, 4)
    await page.locator('.dlab-gstrip .dlab-gstep', { hasText: 'Bước 2/5' }).waitFor()
    await btn(page, 'Có hướng dẫn').click()
    await page.locator('.dlab-choice', { hasText: 'Axit' }).first().click()
    await page.locator('.dlab-gstrip .dlab-gstep', { hasText: 'Bước 1/' }).waitFor()
    const g = await st(page, L => ({ guided: L.guided(), ppt: L.state.objects.some(o => Object.values(o.contents?.precipitates || {}).some(v => v > 0)), cu: L.state.objects.some(o => o.contents?.ions?.['Cu2+'] > 0) }))
    assert.equal(g.guided.done, 0); assert.ok(!g.ppt && !g.cu, 'nothing of the old lesson on the bench')
    assert.ok(await page.locator('[data-tb="undo"]').isDisabled(), 'undo cannot jump back into the old lesson')
  })

  await test('X05 rót quá nhiều: cốc tràn, phần dư chảy ra bàn, thể tích không vượt dung tích', async page => {
    await btn(page, 'Tự do').click()
    const ids = await bench(page, { A: { type: 'beaker100', x: 300, fill: [['water', 90]] }, N: { type: 'bottle', x: 460, reagent: 'nacl' } })
    await pourBar(page, ids.N, ids.A, 30)
    await page.waitForTimeout(800)
    const v = await st(page, (L, id) => Object.values(L.state.objects.find(o => o.id === id).contents.liquids).reduce((a, b) => a + b, 0), ids.A)
    assert.ok(v <= 100 + 1e-6, `volume ${v}`)
    assert.ok(await st(page, L => L.state.log.some(e => /tràn/.test(e.text))), 'overflow reported')
  })

}
