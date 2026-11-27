// Production smoke test for ChemLab 7 (read-only: no ChemAI question is sent, nothing is saved server-side).
// WebKit: Playwright's screenshot injects a <style> that the site's strict CSP blocks and logs ("Refused to apply a
// stylesheet"). That one message is ignored only while a screenshot is being taken; every other error counts.
// Usage: node scripts/dlab-prod-smoke.mjs <origin> <expectedVersion> <outDir> [chromium|firefox|webkit]
import path from 'node:path'
import fs from 'node:fs/promises'
import * as pw from 'playwright-core'
import { EXPERIMENTS } from '../src/dlab/data/experiments.js'

const origin = (process.argv[2] || 'https://chemlab-edulab.pages.dev').replace(/\/$/, '')
const version = process.argv[3] || '7.0.0'
const out = path.resolve(process.argv[4] || 'reports/chemlab-7.0/release/prod-smoke')
const browserName = process.argv[5] || 'chromium'
await fs.mkdir(out, { recursive: true })
const results = []
const check = (name, ok, detail = '') => { results.push({ name, ok: Boolean(ok), detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`) }

const browser = await pw[browserName].launch({ headless: true })
async function open(viewport) {
  const ctx = await browser.newContext({ viewport, serviceWorkers: 'allow' })
  const page = await ctx.newPage()
  const errors = []
  const bad = []
  page.on('pageerror', e => errors.push(String(e).slice(0, 200)))
  page.on('console', m => { if (m.type() === 'error' && !(page.shooting && m.text().startsWith('Refused to apply a stylesheet'))) errors.push(m.text().slice(0, 200)) })
  page.on('response', r => { if (r.status() >= 400 && !r.url().includes('/cdn-cgi/')) bad.push(`${r.status()} ${r.url()}`) })
  page.on('request', r => { if (r.url().includes('/api/chat') && r.method() !== 'GET') bad.push(`ChemAI request ${r.method()} ${r.url()}`) })
  await page.addInitScript(() => {
    try { localStorage.setItem('chemlab-dlab-onboarded', '1') } catch {}
    // CSP violations with the blocked resource, so a console "Refused to apply…" can be traced to its source.
    document.addEventListener('securitypolicyviolation', e => console.warn(`CSP ${e.violatedDirective} blocked=${e.blockedURI} source=${e.sourceFile}:${e.lineNumber} sample=${e.sample}`))
  })
  page.on('console', m => { if (m.type() === 'warning' && m.text().startsWith('CSP ')) console.log(`      ${m.text().slice(0, 300)}`) })
  return { ctx, page, errors, bad }
}
async function shot(page, file) {
  page.shooting = true
  await page.screenshot({ path: path.join(out, file) })
  await page.waitForTimeout(400) // the CSP report arrives just after the capture
  page.shooting = false
}

// 1. Home, version, sidebar entry → Dynamic Lab.
{
  const { ctx, page, errors, bad } = await open({ width: 1440, height: 900 })
  const r = await page.goto(`${origin}/`)
  check('home 200', r.status() === 200, String(r.status()))
  await page.waitForSelector('.app-nav')
  check(`version ${version} shown`, (await page.content()).includes(`ChemLab ${version}`))
  await page.locator('.app-sidebar [data-view="dlab"]').click()
  await page.waitForFunction(() => window.ChemLabDynamicLab?.ready, null, { timeout: 60000 })
  check('sidebar "Phòng thí nghiệm động" opens #dlab', page.url().endsWith('#dlab'))
  await shot(page, `${browserName}-dlab-1440.png`)
  // Catalog.
  await page.getByRole('button', { name: 'Tự do', exact: true }).click()
  if (!(await page.locator('.dlab-sidetabs').isVisible())) await page.locator('.dlab-fab--side').click()
  await page.getByRole('tab', { name: 'Khám phá' }).click()
  const cards = await page.locator('[data-exp-card]').count()
  check(`catalog lists ${EXPERIMENTS.length} experiments`, cards === EXPERIMENTS.length, String(cards))
  await page.locator('[data-exp-f="group"]').selectOption('electrochem')
  const ec = await page.locator('[data-exp-card]:visible').count()
  check('catalog group filter', ec === EXPERIMENTS.filter(e => e.group === 'electrochem').length, String(ec))
  await page.locator('[data-exp-f="group"]').selectOption('')
  await page.locator('[data-exp-search]').fill('dien phan')
  check('catalog accent-free search', (await page.locator('[data-exp-card]:visible').count()) >= 1)
  await page.locator('[data-exp-search]').fill('')
  // Empty Sandbox.
  await page.locator('[data-exp-clear]').click()
  await page.getByRole('button', { name: 'Tôi hiểu, tiếp tục' }).click()
  check('"Về bàn trống" empties the bench', (await page.evaluate(() => window.ChemLabDynamicLab.state.objects.length)) === 0)
  // A representative reaction done through the UI: Cu²⁺ + I⁻ (pour bar).
  const card = page.locator('[data-exp-card="exp-copper-iodide"]')
  await card.getByRole('button', { name: 'Bày dụng cụ' }).click()
  const ids = await page.evaluate(() => { const o = window.ChemLabDynamicLab.state.objects; return { v: o.filter(x => x.type === 'beaker100').map(x => x.id), ki: o.find(x => x.reagent === 'ki')?.id } })
  for (const [i, mL] of [[0, 20], [1, 50]]) {
    await page.evaluate(id => window.ChemLabDynamicLab.select(id), ids.ki)
    await page.locator('[data-qa-in="to"]').selectOption(ids.v[i])
    await page.locator('[data-qa-in="ml"]').fill(String(mL))
    await page.locator('.dlab-actionbar [data-qa="pour"]').click()
  }
  await page.waitForFunction(v => v.every(id => (window.ChemLabDynamicLab.describe(id).precipitates.CuI || 0) > 0), ids.v, { timeout: 30000 })
  const d = await page.evaluate(v => v.map(id => window.ChemLabDynamicLab.describe(id)), ids.v)
  check('Cu²⁺ + I⁻ through the UI: CuI in both beakers, Cu²⁺ left in A, I⁻ left in B',
    d[0].precipitates.CuI > 0 && d[1].precipitates.CuI > 0 && d[0].dissolved['Cu2+'] > 1e-6 && d[1].dissolved['I-'] > 1e-6 && !(d[1].dissolved['Cu2+'] > 1e-6))
  check('2D canvas drawn', await page.locator('.dlab-stage canvas, canvas').first().isVisible())
  await shot(page, `${browserName}-copper-iodide-2d.png`)
  await page.getByRole('button', { name: 'Xem 3D', exact: true }).click()
  await page.waitForFunction(() => window.ChemLabDynamicLab.is3d(), null, { timeout: 30000 })
  await page.locator('.dlab-3d canvas').waitFor({ timeout: 30000 })
  await page.waitForTimeout(2500)
  check('3D view initialises', await page.locator('.dlab-3d canvas').isVisible())
  await shot(page, `${browserName}-copper-iodide-3d.png`)
  await page.getByRole('button', { name: 'Xem 2D', exact: true }).click()
  // Guided lab.
  await page.getByRole('button', { name: 'Có hướng dẫn', exact: true }).click()
  await page.evaluate(() => window.ChemLabDynamicLab.startGuided('acid-base'))
  await page.waitForFunction(() => window.ChemLabDynamicLab.guided()?.id === 'acid-base', null, { timeout: 30000 })
  check('Guided lab starts', true)
  // Direct reload of the lab route.
  await page.reload()
  await page.waitForFunction(() => window.ChemLabDynamicLab?.ready, null, { timeout: 60000 })
  check('reload of #dlab works', page.url().endsWith('#dlab'))
  // Earlier ChemLab features still load.
  for (const [view, sel] of [['periodic', '#view-periodic'], ['tools', '#view-tools'], ['learning', '#view-learning'], ['lab', '#view-lab']]) {
    await page.locator(`.app-sidebar [data-view="${view}"]`).click()
    await page.waitForTimeout(1200)
    check(`view ${view} opens`, await page.locator(sel).isVisible())
  }
  check('lab page has the 7.0 entry card', await page.locator('.dlab-entry').isVisible())
  check('no console / page errors', errors.length === 0, errors.slice(0, 3).join(' | '))
  check('no failed requests, no ChemAI question sent', bad.length === 0, bad.slice(0, 3).join(' | '))
  await ctx.close()
}

// 2. Phone width: bottom nav → Thí nghiệm → entry card → lab.
{
  const { ctx, page, errors } = await open({ width: 390, height: 844 })
  await page.goto(`${origin}/#lab`)
  await page.locator('.dlab-entry').waitFor({ timeout: 30000 })
  await page.locator('.dlab-entry').click()
  await page.waitForFunction(() => window.ChemLabDynamicLab?.ready, null, { timeout: 60000 })
  check('phone 390: entry card opens the lab', page.url().endsWith('#dlab'))
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  check('phone 390: no horizontal page scroll', overflow <= 1, String(overflow))
  await shot(page, `${browserName}-dlab-390.png`)
  check('phone 390: no console errors', errors.length === 0, errors.slice(0, 2).join(' | '))
  await ctx.close()
}

// 3. ChemAI configuration (GET only) and service worker identity.
const api = await (await fetch(`${origin}/api/chat`)).json()
check(`ChemAI release ${version}, access and configured (GET only)`, api.release === version && api.access === true && api.configured === true, JSON.stringify({ release: api.release, access: api.access, configured: api.configured }))
const sw = await (await fetch(`${origin}/sw.js`)).text()
check(`service worker cache chemlab-${version}`, sw.includes(`chemlab-${version}-`))
await browser.close()
await fs.writeFile(path.join(out, `${browserName}-results.json`), JSON.stringify({ origin, version, browserName, at: new Date().toISOString(), results }, null, 1))
const failed = results.filter(r => !r.ok)
console.log(`Production smoke (${browserName}): ${results.length - failed.length}/${results.length}`)
process.exitCode = failed.length ? 1 : 0
