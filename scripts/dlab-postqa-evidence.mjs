// ChemLab 7.0 — screenshots for the post-Codex QA fix report (library shelves, precipitate progress,
// nail on the bench, 3D drop feedback). Usage: node scripts/dlab-postqa-evidence.mjs [baseUrl]
// → reports/chemlab-7.0/post-codex/*.png + evidence.json
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const base = process.argv[2] || 'http://localhost:5173/'
const out = path.join(root, 'reports', 'chemlab-7.0', 'post-codex')
await fs.mkdir(out, { recursive: true })
const browser = await chromium.launch({ headless: true })
const evidence = {}

async function page(width = 1440, height = 900) {
  const ctx = await browser.newContext({ viewport: { width, height } })
  await ctx.addInitScript(() => { try { localStorage.setItem('chemlab-dlab-onboarded', '1'); localStorage.setItem('chemlab-dlab-tip-tongs', '1') } catch {} })
  const p = await ctx.newPage()
  await p.goto(`${base}#dlab`)
  await p.waitForFunction(() => window.ChemLabDynamicLab?.ready, null, { timeout: 30000 })
  p.L = (fn, a) => p.evaluate(([f, x]) => new Function('L', 'a', `return (${f})(L, a)`)(window.ChemLabDynamicLab, x), [fn.toString(), a])
  return p
}
const shot = (p, name, clip) => p.screenshot({ path: path.join(out, `${name}.png`), ...(clip ? { clip } : {}) })

// 1. Library: chemical cabinet, tool shelf, formula search
{
  const p = await page()
  const lib = () => p.locator('.dlab-lib').boundingBox()
  await p.getByRole('tab', { name: 'Tủ hóa chất' }).click()
  await shot(p, 'after-1-tu-hoa-chat', await lib())
  await p.getByRole('tab', { name: 'Kệ dụng cụ' }).click()
  await shot(p, 'after-2-ke-dung-cu', await lib())
  await p.locator('.dlab-search').fill('CuSO4')
  await shot(p, 'after-3-tim-cong-thuc', await lib())
  await p.context().close()
}
// 2. Precipitate: progress after 0.5 mL, then the precipitate
{
  const p = await page()
  await p.getByRole('button', { name: 'Có hướng dẫn' }).click()
  await p.locator('.dlab-choice', { hasText: 'Tạo kết tủa' }).click()
  await p.locator('.dlab-gstrip .dlab-gstep', { hasText: 'Bước 1/5' }).waitFor()
  const r = await p.L(L => ({ d: L.state.objects.find(o => o.type === 'dropper').id, naoh: L.state.objects.find(o => o.reagent === 'naoh').id }))
  await p.L((L, id) => L.select(id), r.d)
  const bar = p.locator('.dlab-actionbar')
  await bar.locator('[data-qa-in="from"]').selectOption(r.naoh)
  await bar.getByRole('button', { name: 'Hút 2 mL', exact: true }).click()
  await bar.getByRole('button', { name: '10 giọt', exact: true }).click()
  await p.waitForTimeout(800)
  evidence.progressAfter10Drops = await p.locator('.dlab-gprogress').innerText()
  await shot(p, 'after-4-ket-tua-tien-do')
  let actions = 2
  while (!(await p.L(L => L.guided().done)) && actions < 14) {
    const left = await p.L((L, id) => Object.values(L.state.objects.find(o => o.id === id).contents.liquids).reduce((a, b) => a + b, 0), r.d)
    await bar.getByRole('button', { name: left < 0.5 - 1e-6 ? 'Hút 2 mL' : '10 giọt', exact: true }).click()
    actions += 1
    await p.waitForTimeout(500)
  }
  evidence.precipitateActions = actions
  await p.waitForTimeout(1500)
  await shot(p, 'after-5-ket-tua-xuat-hien')
  await p.context().close()
}
// 3. Metals: a coated nail taken out onto the bench (2D shape), and held by the tongs in 3D
{
  const p = await page()
  await p.getByRole('button', { name: 'Có hướng dẫn' }).click()
  await p.locator('.dlab-choice', { hasText: 'Kim loại' }).click()
  await p.locator('.dlab-gstrip .dlab-gstep', { hasText: 'Bước 1/5' }).waitFor()
  const r = await p.L(L => ({ k: L.state.objects.find(o => o.type === 'tongs').id, cu: L.state.objects.find(o => o.type === 'beaker100').id }))
  await p.L((L, id) => L.select(id), r.k)
  const bar = p.locator('.dlab-actionbar')
  await bar.getByRole('button', { name: 'Lấy', exact: true }).click()
  await bar.locator('[data-qa-in="to"]').selectOption(r.cu)
  await bar.getByRole('button', { name: 'Thả', exact: true }).click()
  await p.locator('.dlab-gstrip .dlab-gstep', { hasText: 'Bước 2/5' }).waitFor()
  await p.locator('[data-gs="ffwd"]').click()
  await p.locator('.dlab-gstrip .dlab-gstep', { hasText: 'Bước 3/5' }).waitFor({ timeout: 30000 })
  evidence.copperStepSimSeconds = +(await p.L(L => L.state.t)).toFixed(1)
  const nail = await p.L(L => L.state.objects.find(o => o.reagent === 'fe').id)
  await p.L((L, id) => L.select(id), nail)
  await bar.getByRole('button', { name: 'Gắp ra, đặt lên bàn', exact: true }).click()
  await p.waitForTimeout(600)
  await shot(p, 'after-6-dinh-tren-ban-2d')
  await p.L((L, id) => L.select(id), nail)
  await bar.getByRole('button', { name: 'Gắp lên', exact: true }).click()
  await p.waitForTimeout(400)
  await shot(p, 'after-7-dinh-dang-kep-2d')
  await p.getByRole('button', { name: 'Xem 3D' }).click()
  await p.locator('.dlab-3d canvas').waitFor()
  await p.waitForTimeout(1200)
  await shot(p, 'after-8-3d-nhan-va-kep')
  await p.getByRole('button', { name: /Nhìn vật chọn/ }).click()
  await p.waitForTimeout(900)
  await shot(p, 'after-9-3d-nhin-vat-chon')
  await p.context().close()
}
await fs.writeFile(path.join(out, 'evidence.json'), JSON.stringify(evidence, null, 2))
console.log(JSON.stringify(evidence))
await browser.close()
