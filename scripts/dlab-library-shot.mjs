// Experiment Library evidence: the Discover tab with one guide expanded, then the bench after "Bày dụng cụ" and the
// steps (real app, Chromium). Usage: node scripts/dlab-library-shot.mjs <baseUrl> <outDir>
import path from 'node:path'
import fs from 'node:fs/promises'
import { chromium } from 'playwright-core'

const base = process.argv[2] || 'http://[::1]:5180/'
const out = path.resolve(process.argv[3] || 'reports/chemlab-7.0/foundation/exit/shots')
await fs.mkdir(out, { recursive: true })
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.addInitScript(() => { try { localStorage.setItem('chemlab-dlab-onboarded', '1') } catch {} })
await page.goto(`${base}#dlab`)
await page.waitForFunction(() => window.ChemLabDynamicLab?.ready)
await page.getByRole('button', { name: 'Tự do', exact: true }).click()
if (!(await page.locator('.dlab-sidetabs').isVisible())) await page.locator('.dlab-fab--side').click()
await page.getByRole('tab', { name: 'Thư viện', exact: true }).click()
const card = page.locator('[data-exp-card="exp-copper-ammine"]')
await card.locator('summary').click()
await card.scrollIntoViewIfNeeded()
await page.screenshot({ path: path.join(out, 'library-guide.png') })
await card.getByRole('button', { name: 'Bày dụng cụ' }).click()
const ids = await page.evaluate(() => { const L = window.ChemLabDynamicLab; const o = L.state.objects; return { v: o.filter(x => x.type === 'beaker100' && (x.contents?.ions?.['Cu2+'] || 0) > 0).at(-1).id, b: o.find(x => x.reagent === 'nh3-2m').id } }) // v: the beaker the experiment laid out (CuSO₄)
for (const mL of [2, 28]) {
  await page.evaluate(id => window.ChemLabDynamicLab.select(id), ids.b)
  await page.locator('[data-qa-in="to"]').selectOption(ids.v)
  await page.locator('[data-qa-in="ml"]').fill(String(mL))
  await page.locator('.dlab-actionbar [data-qa="pour"]').click()
  await page.waitForTimeout(1500)
  await page.screenshot({ path: path.join(out, `library-copper-ammine-${mL}mL.png`) })
}
await browser.close()
console.log('ok', out)
