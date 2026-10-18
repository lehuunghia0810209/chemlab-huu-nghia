/* =========================================================
   CHEMLAB — REAL BROWSER SMOKE TEST
   Builds nothing: run `npm run build` first. Serves dist/ with
   `vite preview`, drives the system Chrome (or Edge) through
   Playwright and checks every route at phone → desktop widths
   in both themes.

   npm run check:browser
   CHEMLAB_BROWSER_CHANNEL=msedge npm run check:browser
========================================================= */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'
import { chromium } from 'playwright-core'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(rootDir, 'test-results', 'browser-smoke')
const VIEWS = ['home', 'periodic', 'tools', 'learning', 'lab']
const WIDTHS = [320, 360, 390, 430, 768, 1024, 1440, 1920]
const THEMES = ['dark', 'light']
const PREFS_KEY = 'chemlab-v5-user-preferences'

/* Errors that only exist because `vite preview` has no Pages Functions. */
const IGNORED_ERRORS = [/\/api\/chat/, /Failed to load resource: the server responded with a status of 404/]

const results = []

function record(name, pass, detail = '') {
  results.push({ name, pass: Boolean(pass), detail: pass ? '' : String(detail).slice(0, 160) })
}

async function launchBrowser() {
  const channels = [process.env.CHEMLAB_BROWSER_CHANNEL, 'chrome', 'msedge'].filter(Boolean)
  for (const channel of channels) {
    try {
      return await chromium.launch({ channel })
    }
    catch {
      /* try next channel */
    }
  }
  throw new Error(`Không tìm thấy trình duyệt (${channels.join(', ')}). Cài Chrome/Edge hoặc đặt CHEMLAB_BROWSER_CHANNEL.`)
}

async function newPage(browser, { width, height, theme, serviceWorkers = 'block' }) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    serviceWorkers,
    hasTouch: width < 1024,
    isMobile: width < 768
  })
  await context.addInitScript(([key, value]) => {
    localStorage.setItem(key, value)
  }, [PREFS_KEY, JSON.stringify({ theme })])

  const page = await context.newPage()
  const errors = []
  page.on('console', message => {
    if (message.type() !== 'error') return
    const text = message.text()
    if (!IGNORED_ERRORS.some(pattern => pattern.test(text))) errors.push(text)
  })
  page.on('pageerror', error => errors.push(error.message))
  return { context, page, errors }
}

async function openView(page, baseURL, view) {
  await page.goto(`${baseURL}/#${view}`, { waitUntil: 'load' })
  await page.waitForFunction(v => document.querySelector('#app-shell')?.dataset.currentView === v, view)
  await page.waitForFunction(v => !document.querySelector(`#view-${v} .app-view-loader`), view, { timeout: 15000 })
  await page.waitForFunction(() => !document.querySelector('#chemlab-production-boot'), null, { timeout: 5000 })
  await page.waitForTimeout(250)
}

async function screenshotOnFail(page, name) {
  await fs.mkdir(outDir, { recursive: true })
  await page.screenshot({ path: path.join(outDir, `${name}.png`) }).catch(() => {})
}

/* ---------- layout sweep: every view × width × theme ---------- */
async function layoutSweep(browser, baseURL) {
  for (const theme of THEMES) {
    for (const width of WIDTHS) {
      const height = width < 768 ? 844 : 900
      const { context, page, errors } = await newPage(browser, { width, height, theme })

      for (const view of VIEWS) {
        const label = `${view} @${width} ${theme}`
        await openView(page, baseURL, view)

        const state = await page.evaluate(() => {
          const doc = document.documentElement
          const section = document.querySelector('.app-view.active')
          const bottomNav = document.querySelector('.app-bottom-nav')
          const navVisible = bottomNav && getComputedStyle(bottomNav).display !== 'none'
          const covered = navVisible
            ? [...bottomNav.querySelectorAll('.app-bottom-nav__item')].filter(item => {
                const r = item.getBoundingClientRect()
                const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
                return !item.contains(hit)
              }).map(item => item.dataset.view)
            : []
          return {
            theme: doc.dataset.theme,
            overflow: doc.scrollWidth - window.innerWidth,
            visible: Boolean(section && !section.hidden && section.getBoundingClientRect().height > 0),
            moduleError: Boolean(section?.querySelector('.app-route-error, .app-module-error')),
            navVisible,
            covered
          }
        })

        const pass =
          state.theme === theme &&
          state.overflow <= 1 &&
          state.visible &&
          !state.moduleError &&
          (width >= 768 || state.navVisible) &&
          state.covered.length === 0

        record(`layout ${label}`, pass, JSON.stringify(state))
        if (!pass) await screenshotOnFail(page, `layout-${view}-${width}-${theme}`)
      }

      record(`console clean @${width} ${theme}`, errors.length === 0, errors.join(' | '))
      await context.close()
    }
  }
}

/* ---------- interactions ---------- */
async function interactionChecks(browser, baseURL) {
  const { context, page, errors } = await newPage(browser, { width: 1440, height: 900, theme: 'dark' })
  await openView(page, baseURL, 'home')

  await page.keyboard.press('Control+k')
  const paletteOpen = await page.locator('#command-palette').isVisible()
  await page.keyboard.type('orbital')
  await page.keyboard.press('Enter')
  await page.waitForFunction(() => location.hash === '#tools/orbital', null, { timeout: 15000 }).catch(() => {})
  record('command palette opens and runs a tool command', paletteOpen && (await page.evaluate(() => location.hash)) === '#tools/orbital')

  await openView(page, baseURL, 'tools')
  const tools = await page.$$eval('.tool-selector [data-tool]', nodes => nodes.map(node => node.dataset.tool))
  record('Tool Hub lists all 7 tools', tools.length === 7, tools.join(','))


  await page.click('.app-sidebar [data-open-settings]')
  const dialogOpen = await page.locator('#user-settings').isVisible()
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)
  record('settings dialog opens and closes with Esc', dialogOpen && !(await page.locator('#user-settings').isVisible()))

  const themes = await page.evaluate(() => {
    const toggle = document.querySelector('.app-sidebar [data-theme-toggle]')
    const before = document.documentElement.dataset.theme
    toggle.click()
    const after = document.documentElement.dataset.theme
    const stored = JSON.parse(localStorage.getItem('chemlab-v5-user-preferences')).theme
    toggle.click()
    return { before, after, stored }
  })
  record('theme toggle switches and persists', themes.before !== themes.after && themes.stored === themes.after, JSON.stringify(themes))

  await openView(page, baseURL, 'home')
  await page.click('[data-open-element]')
  await page.waitForTimeout(800)
  const drawer = await page.evaluate(() => ({
    view: document.querySelector('#app-shell').dataset.currentView,
    open: document.querySelector('#element-drawer').classList.contains('open')
  }))
  record('dashboard element card opens the element drawer', drawer.view === 'periodic' && drawer.open, JSON.stringify(drawer))

  /* periodic: detail sheet, keyboard navigation, correct exception data */
  await openView(page, baseURL, 'periodic')
  await page.focus('.pt-cell[data-number="24"]')
  await page.keyboard.press('ArrowRight')
  const arrowed = await page.evaluate(() => document.activeElement?.dataset.number)
  record('periodic arrow keys move between cells (Cr → Mn)', arrowed === '25', arrowed)

  await page.keyboard.press('Enter')
  await page.waitForSelector('#element-drawer.open')
  await page.click('[data-ptd-tab="electron"]')
  const config = await page.textContent('.ptd-config')
  record('drawer shows the Mn ground state [Ar] 3d⁵ 4s²', config.includes('[Ar] 3d⁵ 4s²'), config)

  await page.click('[data-ptd-next]')
  await page.click('[data-ptd-prev]')
  await page.evaluate(() => window.ChemLabPeriodic.openElement(29))
  await page.click('[data-ptd-tab="electron"]')
  const copper = await page.textContent('.ptd-config')
  record('copper exception 3d¹⁰ 4s¹ is shown', copper.includes('[Ar] 3d¹⁰ 4s¹'), copper)

  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)
  record('Esc closes the sheet', !(await page.evaluate(() => document.querySelector('#element-drawer').classList.contains('open'))))

  /* atomic explorer: renders, switches mode, disposes its WebGL canvas */
  await page.evaluate(() => window.ChemLabPeriodic.openElement(26))
  await page.click('[data-ptd-atom]')
  await page.waitForSelector('.ax.is-open canvas', { timeout: 10000 })
  await page.click('.ax-modes [data-mode="orbital"]')
  await page.waitForFunction(() => document.querySelector('[data-ax-busy]')?.hidden === true, null, { timeout: 15000 })
  const subshell = await page.getAttribute('.ax-sub.is-selected', 'data-subshell')
  record('atomic explorer opens and picks the 3d subshell for Fe', subshell === '3d', subshell)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)
  record('atomic explorer closes and removes its canvas', await page.evaluate(() => !document.querySelector('.ax canvas')))

  /* orbital atlas */
  await page.goto(`${baseURL}/#tools/orbital`, { waitUntil: 'load' })
  await page.waitForSelector('#orbital-atlas')
  await page.evaluate(() => document.querySelector('#orbital-atlas').scrollIntoView())
  await page.waitForSelector('#orbital-atlas canvas', { timeout: 10000 })
  await page.click('#orbital-atlas [data-family="d"]')
  await page.waitForFunction(() => document.querySelector('[data-oa-busy]')?.hidden === true, null, { timeout: 15000 })
  record('orbital atlas renders and switches family', Boolean(await page.$('#orbital-atlas [data-variant="dz2"][aria-pressed="true"]')))

  /* virtual lab: a data-driven precipitation and a guided experiment */
  await openView(page, baseURL, 'lab')
  for (const id of ['agno3', 'nacl']) {
    await page.click(`.reagent-card[data-reagent="${id}"]`)
    await page.click('#add-reagent')
    await page.waitForTimeout(350)
  }
  const lab = await page.evaluate(() => ({
    title: document.querySelector('#observation-title')?.textContent.trim(),
    equation: document.querySelector('#reaction-equation')?.textContent.trim(),
    precipitate: document.querySelector('#precipitate-layer')?.classList.contains('has-precipitate'),
    canvas: Boolean(document.querySelector('.liquid-mask canvas.beaker-effects'))
  }))
  record('lab: AgNO₃ + NaCl gives a white precipitate (Vietnamese observation)',
    lab.precipitate && lab.canvas && /kết tủa/i.test(lab.title) && lab.equation.includes('AgCl'), JSON.stringify(lab))

  await page.evaluate(() => window.dispatchEvent(new CustomEvent('chemlab:open-guided-lesson', {
    detail: { grade: 10, lessonId: 'g10-l22', experimentId: 'g10-halide-chloride' }
  })))
  await page.waitForSelector('.guided-lab-shell.guided-running', { timeout: 10000 })
  await page.click('[data-guided-mode="free"]')
  record('guided experiment opens and returns to free mode',
    await page.evaluate(() => !document.querySelector('.vl-layout').hidden))

  /* learning: answer one question, reload, progress must persist */
  await openView(page, baseURL, 'learning')
  const answersBefore = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('chemlab-v1-progress') || '{}').statistics?.totalAnswers || 0)
  await page.click('#cl-start')
  await page.waitForSelector('[data-answer]', { timeout: 10000 })
  await page.click('[data-answer]')
  await page.waitForTimeout(400)
  await page.reload({ waitUntil: 'load' })
  await page.waitForFunction(() => document.querySelector('#app-shell')?.dataset.currentView === 'learning')
  const answersAfter = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('chemlab-v1-progress') || '{}').statistics?.totalAnswers || 0)
  record('learning: an answer is saved and survives reload', answersAfter === answersBefore + 1, `${answersBefore} → ${answersAfter}`)

  record('console clean during interactions', errors.length === 0, errors.join(' | '))
  await context.close()
}

/* ---------- ChemAI on a phone ---------- */
async function chemAIPhoneCheck(browser, baseURL) {
  const { context, page, errors } = await newPage(browser, { width: 390, height: 844, theme: 'dark' })
  await openView(page, baseURL, 'home')
  await page.click('.app-topbar__ai')
  await page.waitForSelector('.chemai-root.is-open .chemai-panel', { timeout: 10000 })
  await page.waitForTimeout(500)
  const state = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('.chemai-panel button')].filter(b => b.offsetParent && !b.closest('.chemai-suggestions'))
    const offscreen = buttons.filter(b => b.getBoundingClientRect().right > innerWidth + 1).map(b => b.getAttribute('aria-label') || b.textContent.trim())
    const send = document.querySelector('.chemai-panel button[type="submit"], .chemai-send')
    const r = send?.getBoundingClientRect()
    const hit = r && document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
    return { offscreen, sendReachable: Boolean(send && send.contains(hit)), sendSize: r ? [Math.round(r.width), Math.round(r.height)] : null }
  })
  record('ChemAI phone sheet: controls on screen, send button reachable and ≥ 44px',
    !state.offscreen.length && state.sendReachable && state.sendSize[0] >= 44 && state.sendSize[1] >= 44, JSON.stringify(state))
  await page.keyboard.press('Escape')
  record('console clean in ChemAI phone flow', errors.length === 0, errors.join(' | '))
  await context.close()
}

/* ---------- PWA ---------- */
async function pwaCheck(browser, baseURL) {
  const { context, page } = await newPage(browser, { width: 1280, height: 800, theme: 'dark', serviceWorkers: 'allow' })
  await page.goto(baseURL, { waitUntil: 'load' })
  const registered = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false
    const registration = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise(resolve => setTimeout(() => resolve(null), 8000))
    ])
    return Boolean(registration?.active)
  })
  record('service worker registers and activates', registered)
  await context.close()
}

/* ---------- chemistry tools: real input → result ---------- */
async function toolChecks(browser, baseURL) {
  const { context, page, errors } = await newPage(browser, { width: 1440, height: 900, theme: 'dark' })
  await openView(page, baseURL, 'tools')
  // Balancer: typed coefficients count in the live check; ions and redox are balanced with charge.
  await page.click('.tool-selector [data-tool="balancer"]')
  await page.fill('#balance-reactants', '2H₂ + O₂')
  await page.fill('#balance-products', '2H₂O')
  const typed = await page.textContent('#balance-status-text')
  record('balancer: typed coefficients 2H₂ + O₂ → 2H₂O read as balanced', typed.trim() === 'Đã cân bằng', typed)
  await page.fill('#balance-reactants', 'H2 + O2')
  await page.fill('#balance-products', 'H2O')
  const mismatch = await page.$$eval('#atom-balance-grid .atom-check-card.unbalanced .atom-check-symbol', nodes => nodes.map(node => node.textContent.trim()))
  record('balancer: live check highlights the unbalanced element (O)', mismatch.join() === 'O', mismatch.join())
  await page.fill('#balance-reactants', 'Fe^2+ + MnO4^- + H^+')
  await page.fill('#balance-products', 'Fe^3+ + Mn^2+ + H2O')
  await page.click('#balance-button')
  await page.waitForSelector('#balance-result.success', { timeout: 5000 }).catch(() => {})
  const ratio = (await page.textContent('#mole-ratio')).replace(/\s+/g, ' ')
  record('balancer: ionic redox Fe²⁺/MnO₄⁻ balanced 5:1:8:5:1:4', ratio.includes('5 : 1 : 8 : 5 : 1 : 4'), ratio)
  await page.fill('#balance-reactants', 'Hcl + NaOH')
  await page.fill('#balance-products', 'NaCl + H2O')
  await page.click('#balance-button')
  await page.waitForSelector('#balance-error:not(.hidden)', { timeout: 5000 }).catch(() => {})
  const symbolError = await page.textContent('#balance-error')
  record('balancer: wrong capitalisation (Hcl) is rejected with a hint', /Hc/.test(symbolError), symbolError)

  await page.click('.tool-selector [data-tool="calculator"]')
  await page.fill('#cc-formula', 'CuSO₄·5H₂O')
  await page.click('#cc-analyze')
  const molar = await page.textContent('#cc-result-mass')
  record('calculator: Unicode formula CuSO₄·5H₂O → 249.6 g/mol', Math.abs(Number(molar.replace(',', '.')) - 249.68) < 0.1, molar)
  await page.click('.tool-selector [data-tool="compound"]')
  await page.fill('[data-cs-formula]', 'Al₂(SO₄)₃')
  await page.click('[data-cs-analyze]')
  const compoundMass = await page.textContent('[data-cs-metric="mass"]')
  record('compound studio: Al₂(SO₄)₃ → 342.1 g/mol', Math.abs(Number(compoundMass.replace(',', '.')) - 342.14) < 0.1, compoundMass)
  await page.fill('[data-cs-formula]', 'Xy2O')
  await page.click('[data-cs-analyze]')
  const compoundError = await page.textContent('[data-cs-error]')
  record('compound studio rejects an unknown element symbol', /Xy/.test(compoundError), compoundError)
  await page.click('[data-cs-close]')

  await page.click('.tool-selector [data-tool="reaction"]')
  await page.fill('[data-rs-input]', 'Cu + HNO3 -> Cu(NO3)2 + NO + H2O')
  await page.click('[data-rs-analyze]')
  const reactionEquation = (await page.textContent('[data-rs-equation]')).replace(/\s+|\([a-z]+\)/g, '')
  record('reaction studio balances Cu + HNO₃ (3 : 8 : 3 : 2 : 4)', /^3Cu\+8HNO/.test(reactionEquation) && /2NO\+4H/.test(reactionEquation), reactionEquation)
  await page.fill('[data-rs-input]', 'H2O2 + KMnO4 + H2SO4 -> O2 + MnSO4 + K2SO4 + H2O')
  await page.click('[data-rs-analyze]')
  const reactionNote = await page.locator('.rs52-message').textContent().catch(() => '')
  record('reaction studio warns when the balance is not unique (redox)', /Nhiều bộ hệ số/.test(reactionNote), reactionNote)
  await page.click('[data-rs-close]')

  record('console clean in chemistry tools', errors.length === 0, errors.join(' | '))
  await context.close()
}

/* ---------- virtual lab: pH from moles ---------- */
async function labPHChecks(browser, baseURL) {
  const { context, page, errors } = await newPage(browser, { width: 390, height: 844, theme: 'light' })
  await openView(page, baseURL, 'lab')
  const add = async (id, volume = 25) => {
    await page.click(`.reagent-card[data-reagent="${id}"]`)
    await page.click(`[data-volume="${volume}"]`)
    await page.click('#add-reagent')
    await page.waitForTimeout(200)
  }
  const read = () => page.evaluate(() => ({
    pH: document.querySelector('#ph-value').textContent.trim(),
    mode: document.querySelector('#ph-mode').textContent.trim()
  }))
  const litmus = async () => {
    await page.click('.reagent-card[data-reagent="litmusPaper"]')
    await page.click('#add-reagent')
    await page.waitForTimeout(200)
    return page.textContent('#litmus-paper-label')
  }

  await add('hcl')
  const acid = await read()
  record('lab pH: 25 mL HCl 0.1 M → 1.0 (quantitative)', acid.pH === '1.0' && /số mol/.test(acid.mode), JSON.stringify(acid))
  record('lab litmus: HCl → red', /đỏ/.test(await litmus()))
  await add('naoh')
  const neutral = await read()
  record('lab pH: + 25 mL NaOH → 7.0', neutral.pH === '7.0', JSON.stringify(neutral))
  record('lab litmus: equal HCl/NaOH → stays purple', /tím/.test(await litmus()))
  await add('naoh', 10)
  const base = await read()
  record('lab pH: NaOH excess 1 mmol in 60 mL → 12.2', base.pH === '12.2', JSON.stringify(base))
  record('lab litmus: excess NaOH → blue', /xanh/.test(await litmus()))
  await page.click('#reset-lab')
  await page.waitForTimeout(300)
  const reset = await read()
  record('lab pH: reset → 7.0, empty beaker', reset.pH === '7.0' && reset.mode === 'Cốc trống', JSON.stringify(reset))
  await add('ethanoic')
  const weak = await read()
  record('lab pH: weak acid shown only as < 7, not as a number', weak.pH === '< 7' && /định tính/.test(weak.mode), JSON.stringify(weak))
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  record('lab pH meter fits at 390px', overflow <= 1, overflow)
  record('console clean in lab pH flow', errors.length === 0, errors.join(' | '))
  await context.close()
}

/* ---------- run ---------- */
const server = await preview({
  root: rootDir,
  logLevel: 'silent',
  preview: { port: 4179, strictPort: false, open: false }
})
const baseURL = server.resolvedUrls.local[0].replace(/\/$/, '')
const browser = await launchBrowser()

try {
  for (const [name, run] of [['layout sweep', layoutSweep], ['interactions', interactionChecks], ['tools', toolChecks], ['lab pH', labPHChecks], ['chemai phone', chemAIPhoneCheck], ['pwa', pwaCheck]]) {
    try {
      await run(browser, baseURL)
    }
    catch (error) {
      record(`${name} finished without crashing`, false, error.message.split('\n')[0])
    }
  }
}
finally {
  await browser.close()
  await new Promise(resolve => server.httpServer.close(resolve))
}

const failures = results.filter(result => !result.pass)
console.log(`\nChemLab browser smoke — ${results.length} checks`)
if (failures.length) {
  console.table(failures)
  console.error(`\nFAIL — ${failures.length}/${results.length} checks failed. Screenshots: ${path.relative(rootDir, outDir)}`)
  process.exitCode = 1
}
else {
  console.log(`PASS — ${results.length}/${results.length} checks passed.\n`)
}
