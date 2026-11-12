// Read-only browser check of a deployed ChemLab (Preview) with ChemAI locked.
// Every non-GET /api/* request is aborted and counted, so no question can reach an AI provider.
// usage: CHEMLAB_BROWSER=chromium|firefox|webkit node scripts/preview-locked-check.mjs <baseURL>
import { chromium, firefox, webkit } from 'playwright-core'

const base = process.argv[2]?.replace(/\/$/, '')
if (!base) throw new Error('usage: node scripts/preview-locked-check.mjs <baseURL>')
const name = process.env.CHEMLAB_BROWSER || 'chromium'
const browser = await ({ chromium: () => chromium.launch({ channel: 'chrome', headless: true }), firefox: () => firefox.launch({ headless: true }), webkit: () => webkit.launch({ headless: true }) })[name]()
const results = []
const record = (label, pass, detail = '') => { results.push(pass); console.log(pass ? 'PASS' : 'FAIL', `[${name}] ${label}`, pass ? '' : `→ ${detail}`) }
const LOCKED = 'ChemAI đang được hoàn thiện và kiểm định. Tính năng hiện chưa được mở cho học sinh.'

try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, serviceWorkers: 'allow' })
    const page = await context.newPage()
    const errors = []
    const blocked = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    await context.route('**/api/**', route => route.request().method() === 'GET' ? route.continue() : (blocked.push(route.request().url()), route.abort()))
    await page.goto(`${base}/#home`, { waitUntil: 'load' })
    await page.waitForFunction(() => document.querySelector('#app-shell')?.dataset.currentView === 'home', null, { timeout: 30000 })
    await page.click('[data-chemai-open]:visible')
    await page.waitForFunction(() => /Chưa mở/.test(document.querySelector('#chemai-service-badge')?.textContent || ''), null, { timeout: 20000 })
    await page.evaluate(() => window.ChemLabApp.openChemAI('H2O là gì?'))
    await page.keyboard.press('Enter')
    await page.waitForTimeout(500)
    const ui = await page.evaluate(() => ({
      locked: document.querySelector('#chemai-locked')?.textContent.trim(),
      lockedVisible: Boolean(document.querySelector('#chemai-locked')?.offsetParent),
      sendVisible: Boolean(document.querySelector('#chemai-send')?.offsetParent),
      inputEnabled: !document.querySelector('#chemai-input')?.disabled,
      panelText: document.querySelector('.chemai-panel')?.innerText || '',
      overflow: document.documentElement.scrollWidth - innerWidth
    }))
    const w = viewport.width
    record(`${w}px: ChemAI panel opens and shows the locked notice`, ui.lockedVisible && ui.locked === LOCKED, JSON.stringify(ui.locked))
    record(`${w}px: no active composer (send hidden, input disabled)`, !ui.sendVisible && !ui.inputEnabled, JSON.stringify(ui))
    record(`${w}px: panel shows no provider/model`, !/Workers AI|Gemini|glm|gemma|@cf\//i.test(ui.panelText), ui.panelText.slice(0, 200))
    record(`${w}px: no horizontal overflow`, ui.overflow <= 1, String(ui.overflow))
    await page.keyboard.press('Escape')

    await page.goto(`${base}/#tools`, { waitUntil: 'load' })
    await page.waitForSelector('.tool-selector [data-tool="calculator"]', { timeout: 20000 })
    await page.click('.tool-selector [data-tool="calculator"]')
    await page.fill('#cc-formula', 'CuSO₄·5H₂O')
    await page.click('#cc-analyze')
    const molar = Number((await page.textContent('#cc-result-mass')).replace(',', '.'))
    record(`${w}px: calculator CuSO₄·5H₂O → 249.7 g/mol`, Math.abs(molar - 249.68) < 0.1, String(molar))
    await page.click('.tool-selector [data-tool="balancer"]')
    await page.fill('#balance-reactants', 'Fe^2+ + MnO4^- + H^+')
    await page.fill('#balance-products', 'Fe^3+ + Mn^2+ + H2O')
    await page.click('#balance-button')
    await page.waitForSelector('#balance-result.success', { timeout: 8000 }).catch(() => {})
    const ratio = (await page.textContent('#mole-ratio')).replace(/\s+/g, ' ')
    record(`${w}px: balancer Fe²⁺/MnO₄⁻ 5:1:8:5:1:4`, ratio.includes('5 : 1 : 8 : 5 : 1 : 4'), ratio)

    for (const view of ['periodic', 'lab', 'learning']) {
      await page.goto(`${base}/#${view}`, { waitUntil: 'load' })
      const ok = await page.waitForFunction(v => document.querySelector('#app-shell')?.dataset.currentView === v && !document.querySelector(`#view-${v} .app-view-loader`), view, { timeout: 30000 }).then(() => true, () => false)
      record(`${w}px: #${view} route loads`, ok)
    }
    // Exam lives under Learning; open the first paper's preparation page (no answers are submitted).
    await page.goto(`${base}/#learning/exam`, { waitUntil: 'load' })
    const paper = await page.waitForSelector('a[href^="#learning/exam/"]', { timeout: 30000 }).then(handle => handle.getAttribute('href'), () => null)
    if (paper) await page.click(`a[href="${paper}"]`)
    const prep = paper && await page.waitForSelector('[data-ex-start]', { timeout: 20000 }).then(() => true, () => false)
    record(`${w}px: exam catalog lists papers and a paper's start page opens`, Boolean(prep), String(paper))

    const sw = await page.evaluate(async () => {
      const registration = await Promise.race([navigator.serviceWorker.ready, new Promise(resolve => setTimeout(() => resolve(null), 15000))])
      return { active: Boolean(registration?.active), caches: await caches.keys() }
    })
    record(`${w}px: service worker active with the 6.5.4 cache identity`, sw.active && sw.caches.some(key => key.includes('chemlab-6.5.4-access-1')), JSON.stringify(sw))
    const csp = (await (await page.request.get(`${base}/`)).headers())['content-security-policy'] || ''
    record(`${w}px: CSP header present (script-src 'self', frame-ancestors 'none')`, /script-src 'self'/.test(csp) && /frame-ancestors 'none'/.test(csp), csp.slice(0, 120))
    record(`${w}px: no non-GET /api request attempted`, blocked.length === 0, blocked.join(','))
    record(`${w}px: console clean`, errors.length === 0, errors.join(' | '))
    await context.close()
  }
}
finally {
  await browser.close()
}
console.log(`[${name}] ${results.filter(Boolean).length}/${results.length} passed`)
process.exit(results.every(Boolean) ? 0 : 1)
