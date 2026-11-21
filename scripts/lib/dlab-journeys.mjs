// Dynamic Lab journeys: each checks the simulation state and what the canvas actually shows.
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
const axeSource = await fs.readFile(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8')

export default async function ({ test, bench, st, wait, pixel, screen, dragWorld, outDir, browserName, aiRequests }) {
  const obj = (page, id) => st(page, (L, id) => JSON.parse(JSON.stringify(L.state.objects.find(o => o.id === id))), id)
  const surface = (page, id) => st(page, (L, id) => L.surface(id), id)
  const select = (page, id) => st(page, (L, id) => { L.select(id); return true }, id)
  const btn = (page, name) => page.getByRole('button', { name, exact: true })
  const panelBtn = (page, name) => page.locator('.dlab-inspector').getByRole('button', { name, exact: true })
  const redDominant = c => c[0] > c[2] + 50 && c[0] > c[1] + 50
  const violet = c => c[2] > c[1] + 40 && c[0] > c[1] + 20 && Math.abs(c[0] - c[2]) < 60

  async function dipPaper(page) {
    const ids = await bench(page, { A: { type: 'beaker100', x: 400, fill: [['hcl', 60]] } })
    ids.P = await st(page, L => L.dispatch({ type: 'newLitmus', x: 560 }, { record: false }).id)
    const s = await surface(page, ids.A)
    return { ids, s }
  }

  await test('S01 lấy giấy quỳ từ thư viện', async page => {
    await bench(page, {})
    await page.getByRole('tab', { name: 'Chỉ thị' }).click()
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
    const ids = await dropperBench(page)
    await st(page, L => { L.state.speed = 0.25 })
    for (let i = 0; i < 3; i += 1) await panelBtn(page, 'Nhỏ 1 giọt').click()
    await wait(page, (L, id) => (L.state.objects.find(o => o.id === id).contents.indicators.phenolphthalein || 0) > 2.9, ids.A)
    await page.waitForTimeout(400)
    const a = await obj(page, ids.A)
    const s = await surface(page, ids.A)
    const pink = c => c[0] - c[1]
    const strongest = async xs => { let best = [0, 255, 0]; for (const x of xs) for (const dy of [2, 4, 6]) { const c = await pixel(page, x, s - dy); if (pink(c) > pink(best)) best = c } return best }
    const near = await strongest([316, 320, 324, 328, 332])
    const far = await strongest([268, 272, 276, 280, 284])
    assert.ok(pink(near) > pink(far) + 25, `pink near ${near} vs far ${far}`)
    const f = a.vis.field
    const mean0 = f.reduce((x, y) => x + y, 0) / f.length
    assert.ok(Math.max(...f.slice(130, 140)) > 5 * mean0, 'tracer concentrated at the surface contact')
    await st(page, L => { L.state.speed = 4 })
    await page.waitForTimeout(6000)
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
    await page.locator('[data-in="pour-ml"]').fill('20')
    await page.locator('[data-in="pour-to"]').selectOption(ids.A)
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
    await page.getByRole('tab', { name: 'Chất rắn' }).click()
    const item = page.locator('.dlab-lib-item', { hasText: 'Muối ăn' }).first()
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
    await page.getByRole('tab', { name: 'Chất rắn' }).click()
    await page.locator('.dlab-lib-item', { hasText: 'Đinh sắt' }).first().click()
    await page.locator('.dlab-dialog button[type="submit"]').click()
    await st(page, L => { L.state.speed = 4 })
    await wait(page, (L, id) => L.state.objects.some(o => o.reagent === 'fe' && o.in === id && (o.coat.Cu || 0) > 2e-4), ids.A, 30000)
    await page.screenshot({ path: `${outDir}/${browserName}-s11-fe-cu.png` })
  })

  await test('S12 điện phân CuCl2', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 360, fill: [['cucl2', 50]] }, E: { type: 'electrodes', x: 360, y: 10 }, P: { type: 'power', x: 180 } })
    await select(page, ids.P)
    await page.locator('[data-in="wire"]').selectOption(ids.E)
    await panelBtn(page, 'Nối dây').click()
    await page.locator('[data-in="volts"]').fill('6')
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
    await page.locator('[data-in="pour-ml"]').fill('20')
    await page.locator('[data-in="pour-to"]').selectOption(ids.T)
    await panelBtn(page, 'Rót').click()
    const t = await obj(page, ids.T)
    assert.equal(t.contents.liquids.oil, 20)
    await page.waitForTimeout(300)
    const s = await surface(page, ids.T)
    const top = await pixel(page, 300, s - 3)
    const low = await pixel(page, 300, 4)
    assert.ok(top[0] > top[2] + 60 && top[1] > top[2] + 30, `oil layer yellow on top: ${top}`)
    assert.ok(!(low[0] > low[2] + 60), `water below not yellow: ${low}`)
  })

  await test('S14 cảnh báo an toàn trước thao tác', async page => {
    const ids = await bench(page, { D: { type: 'dish', x: 360, fill: [['water', 150]] }, K: { type: 'tongs', x: 520, y: 150 } })
    await select(page, ids.K)
    await page.locator('[data-in="solid"]').selectOption('na')
    await page.locator('[data-in="mass"]').fill('0.5')
    await panelBtn(page, 'Lấy').click()
    await page.locator('.dlab-toast', { hasText: 'vượt giới hạn an toàn' }).waitFor()
    await page.locator('[data-in="mass"]').fill('0.1')
    await panelBtn(page, 'Lấy').click()
    await page.locator('.dlab-dialog', { hasText: 'Natri phản ứng mãnh liệt' }).waitFor()
    await page.getByRole('button', { name: 'Hủy', exact: true }).click()
    assert.equal((await obj(page, ids.K)).load, null, 'cancelled: nothing picked')
  })

  await test('S15 dụng cụ bị hỏng bị giới hạn chức năng', async page => {
    const ids = await bench(page, { A: { type: 'beaker100', x: 300 }, W: { type: 'bottle', x: 460, reagent: 'water' }, H: { type: 'burner', x: 620 } })
    await st(page, (L, id) => { L.state.objects.find(o => o.id === id).T = 220 }, ids.A)
    await select(page, ids.W)
    await page.locator('[data-in="pour-ml"]').fill('20')
    await page.locator('[data-in="pour-to"]').selectOption(ids.A)
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
    await btn(page, 'Lưu').click()
    await page.locator('.dlab-dialog input').fill('E2E lưu thử')
    await page.locator('.dlab-dialog button[type="submit"]').click()
    await page.locator('.dlab-toast', { hasText: 'Đã lưu' }).waitFor()
    const before = await st(page, L => L.state.objects.map(o => [o.type, Object.values(o.contents?.liquids || {}).reduce((s, x) => s + x, 0)]))
    await page.reload()
    await page.waitForFunction(() => window.ChemLabDynamicLab?.ready)
    await btn(page, 'Mở').click()
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
    await btn(page, 'Guided Lab').click()
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
    await btn(page, 'Sandbox').click()
    await bench(page, {})
    await page.getByRole('tab', { name: 'Dụng cụ' }).click()
    await page.locator('.dlab-lib-item', { hasText: 'Cốc thủy tinh 100 mL' }).first().click()
    const beaker = await st(page, L => L.state.objects.find(o => o.type === 'beaker100').id)
    await page.getByRole('tab', { name: 'Dung dịch' }).click()
    await page.locator('.dlab-lib-item', { hasText: 'Axit clohiđric' }).first().click()
    await page.locator('[data-in="pour-ml"]').fill('10')
    await page.locator('[data-in="pour-to"]').selectOption(beaker)
    await panelBtn(page, 'Rót').click()
    await select(page, beaker)
    await page.locator('.dlab-kv', { hasText: 'pH' }).waitFor()
    const b = await obj(page, beaker)
    assert.equal(b.contents.liquids.water, 10)
    assert.ok(Math.abs(b.pH - 0.301) < 0.01, `pH ${b.pH}`)
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
    await page.locator('.dlab-log', { hasText: 'Không có phản ứng' }).waitFor()
    await select(page, ids.B)
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
    if (mode === 'low') await btn(page, 'Đồ họa: Cao').click()
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
    assert.ok(r.fps > 30, `fps ${r.fps}`)
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
}
