
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'
import { chromium } from 'playwright-core'
import { practiceJourneys } from './lib/practice-journeys.mjs'
import { examJourneys } from './lib/exam-journeys.mjs'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(rootDir, 'test-results', 'browser-smoke')
const VIEWS = ['home', 'periodic', 'tools', 'learning', 'lab']
const WIDTHS = [320, 360, 390, 430, 768, 1024, 1440, 1920]
const THEMES = ['dark', 'light']
const PREFS_KEY = 'chemlab-v5-user-preferences'

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

  await page.goto(`${baseURL}/#tools/orbital`, { waitUntil: 'load' })
  await page.waitForSelector('#orbital-atlas')
  await page.evaluate(() => document.querySelector('#orbital-atlas').scrollIntoView())
  await page.waitForSelector('#orbital-atlas canvas', { timeout: 10000 })
  await page.click('#orbital-atlas [data-family="d"]')
  await page.waitForFunction(() => document.querySelector('[data-oa-busy]')?.hidden === true, null, { timeout: 15000 })
  record('orbital atlas renders and switches family', Boolean(await page.$('#orbital-atlas [data-variant="dz2"][aria-pressed="true"]')))

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

  await page.goto(`${baseURL}/#learning/practice/topics`, { waitUntil: 'load' })
  await page.waitForSelector('#cl-start', { timeout: 15000 })
  const answersBefore = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('chemlab-v1-progress') || '{}').statistics?.totalAnswers || 0)
  await page.click('#cl-start')
  await page.waitForSelector('[data-answer]', { timeout: 10000 })
  await page.click('[data-answer]')
  await page.waitForTimeout(400)
  await page.reload({ waitUntil: 'load' })
  await page.waitForFunction(() => document.querySelector('#app-shell')?.dataset.currentView === 'learning')
  await page.waitForSelector('#cl-start', { timeout: 15000 })
  const answersAfter = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('chemlab-v1-progress') || '{}').statistics?.totalAnswers || 0)
  record('learning practice: an answer is saved and the practice view survives reload', answersAfter === answersBefore + 1, `${answersBefore} → ${answersAfter}`)

  record('console clean during interactions', errors.length === 0, errors.join(' | '))
  await context.close()
}

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

async function pwaCheck(browser, baseURL) {
  const { context, page } = await newPage(browser, { width: 1280, height: 800, theme: 'dark', serviceWorkers: 'allow' })
  const legacyProgress = {
    version: 1,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    learning: {
      grade10: {
        lessons: {
          'g10-l1': {
            grade: 10,
            lessonId: 'g10-l1',
            started: true,
            completed: true,
            progress: 100
          }
        },
        chapters: {},
        completedLessons: ['g10-l1']
      },
      grade11: { lessons: {}, chapters: {}, completedLessons: [] },
      grade12: { lessons: {}, chapters: {}, completedLessons: [] },
      quizzes: {},
      totalXP: 120,
      totalCorrect: 3,
      totalQuestions: 4
    },
    experiments: {
      grade10: {
        'g10-halide-chloride': {
          grade: 10,
          experimentId: 'g10-halide-chloride',
          currentStep: 2,
          completedSteps: [0, 1],
          score: 2,
          answers: {},
          started: true,
          completed: false
        }
      },
      grade11: {},
      grade12: {},
      completed: [],
      totalCompleted: 0
    },
    statistics: {
      completedLessons: 1,
      completedExperiments: 0,
      correctAnswers: 3,
      totalAnswers: 4,
      totalLearningTimeSeconds: 300,
      totalExperimentTimeSeconds: 120
    },
    lastActivity: {
      type: 'experiment',
      grade: 10,
      experimentId: 'g10-halide-chloride'
    }
  }
  await context.addInitScript(progress => {
    if (sessionStorage.getItem('chemlab-pwa-progress-seeded')) return
    localStorage.setItem('chemlab-v1-progress', JSON.stringify(progress))
    sessionStorage.setItem('chemlab-pwa-progress-seeded', '1')
  }, legacyProgress)
  await page.goto(baseURL, { waitUntil: 'load' })
  const registrationState = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false
    const registration = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise(resolve => setTimeout(() => resolve(null), 8000))
    ])
    return {
      active: Boolean(registration?.active),
      cacheNames: await caches.keys()
    }
  })
  record('service worker registers the release-specific cache',
    registrationState.active && registrationState.cacheNames.some(name => name.startsWith('chemlab-6.2.0-brand-1-')),
    JSON.stringify(registrationState))

  await page.reload({ waitUntil: 'load' })
  await page.waitForFunction(() => document.querySelector('#app-shell') && !document.querySelector('#chemlab-production-boot'))
  record('service worker controls the next navigation without claiming the old tab',
    await page.evaluate(() => Boolean(navigator.serviceWorker.controller)))

  const persisted = await page.evaluate(() => {
    const progress = JSON.parse(localStorage.getItem('chemlab-v1-progress') || '{}')
    const summary = window.ChemLabApp.context().progress
    return {
      lesson: progress.learning?.grade10?.lessons?.['g10-l1']?.completed,
      experimentStep: progress.experiments?.grade10?.['g10-halide-chloride']?.currentStep,
      completedLessons: summary.completedLessons,
      totalAnswers: summary.totalAnswers
    }
  })
  record('v1 learning and guided progress survives the release load',
    persisted.lesson === true && persisted.experimentStep === 2 && persisted.completedLessons === 1 && persisted.totalAnswers === 4,
    JSON.stringify(persisted))

  await openView(page, baseURL, 'lab')
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('chemlab:open-guided-lesson', {
    detail: { grade: 10, lessonId: 'g10-l22', experimentId: 'g10-halide-chloride' }
  })))
  await page.waitForSelector('.guided-lab-shell.guided-running', { timeout: 10000 })
  const guidedStep = await page.evaluate(() =>
    Number(/Bước (\d+)\//.exec(document.querySelector('.guided-lab-shell').innerText)?.[1]) || 0)
  record('Guided Experiment resumes the stored v1 step', guidedStep === 3, guidedStep)

  await context.setOffline(true)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => document.querySelector('#app-shell')?.dataset.currentView === 'lab', null, { timeout: 10000 })
  const offlineState = await page.evaluate(() => ({
    controlled: Boolean(navigator.serviceWorker.controller),
    experimentStep: JSON.parse(localStorage.getItem('chemlab-v1-progress') || '{}').experiments?.grade10?.['g10-halide-chloride']?.currentStep,
    moduleError: Boolean(document.querySelector('.app-route-error, .app-module-error'))
  }))
  record('offline reload keeps the app and stored progress available',
    offlineState.controlled && offlineState.experimentStep === 2 && !offlineState.moduleError,
    JSON.stringify(offlineState))
  await context.setOffline(false)
  await context.close()
}

async function toolChecks(browser, baseURL) {
  const { context, page, errors } = await newPage(browser, { width: 1440, height: 900, theme: 'dark' })
  await openView(page, baseURL, 'tools')
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

  await page.fill('[data-cs-formula]', 'C6H12O6')
  await page.click('[data-cs-analyze]')
  record('molecule card hidden for formulas without verified geometry', await page.locator('[data-cs-molecule]').isHidden())
  await page.fill('[data-cs-formula]', 'H₂O')
  await page.click('[data-cs-analyze]')
  const facts = await page.textContent('[data-cs-molecule-facts]')
  record('molecule card shows H₂O bent, 104,5°', /Gấp khúc/.test(facts) && /104,5°/.test(facts), facts)
  const threeBefore = await page.evaluate(() => performance.getEntriesByType('resource').some(entry => /sceneHost-/.test(entry.name)))
  await page.click('[data-cs-molecule-load]')
  await page.waitForSelector('[data-cs-molecule-stage] canvas', { timeout: 10000 }).catch(() => {})
  await page.click('[data-cs-molecule-style="space"]')
  const viewer = await page.evaluate(() => ({
    canvas: Boolean(document.querySelector('[data-cs-molecule-stage] canvas')),
    space: document.querySelector('[data-cs-molecule-style="space"]').getAttribute('aria-pressed')
  }))
  record('molecule 3D loads Three.js only on request and switches to space-filling', !threeBefore && viewer.canvas && viewer.space === 'true', JSON.stringify({ threeBefore, ...viewer }))
  await page.click('[data-cs-close]')
  record('closing the studio removes the molecule canvas', !(await page.$('[data-cs-molecule-stage] canvas')))

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

  await page.click('.tool-selector [data-tool="solubility"]')
  const solubility = async (cation, anion) => {
    await page.selectOption('#sol-cation', cation)
    await page.selectOption('#sol-anion', anion)
    return (await page.textContent('#sol-status')).trim()
  }
  record('solubility: Ag₂SO₄ is "Ít tan"', (await solubility('ag', 'so4')) === 'Ít tan')
  record('solubility: Li₃PO₄ is "Ít tan" (alkali exception)', (await solubility('li', 'po4')) === 'Ít tan')
  record('solubility: BaSO₄ stays "Không tan"', (await solubility('ba', 'so4')) === 'Không tan')
  const aluminiumCarbonate = await solubility('al', 'co3')
  const hydrolysis = await page.textContent('#sol-description-text')
  record('solubility: Al₂(CO₃)₃ marked as not existing in water, with the hydrolysis equation',
    aluminiumCarbonate === '—' && /Al\(OH\)₃/.test(hydrolysis), `${aluminiumCarbonate} ${hydrolysis}`)

  record('console clean in chemistry tools', errors.length === 0, errors.join(' | '))
  await context.close()
}

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
  await page.click('#undo-button')
  await page.waitForTimeout(200)
  const undone = await read()
  record('lab undo: removing the last 10 mL NaOH returns pH to 7.0', undone.pH === '7.0', JSON.stringify(undone))
  await page.click('#empty-button')
  await page.click('#undo-button')
  await page.waitForTimeout(200)
  const refilled = await page.evaluate(() => ({ pH: document.querySelector('#ph-value').textContent.trim(), count: document.querySelector('#solution-count').textContent.trim() }))
  record('lab undo: emptying the beaker can be undone', refilled.pH === '7.0' && refilled.count === '2 chất', JSON.stringify(refilled))

  await page.click('#reset-lab')
  await page.waitForTimeout(300)
  record('lab undo: disabled after reset', await page.isDisabled('#undo-button'))
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

async function lessonModelChecks(browser, baseURL) {
  const { context, page, errors } = await newPage(browser, { width: 390, height: 844, theme: 'dark' })
  await openView(page, baseURL, 'lab')
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('chemlab:open-guided-lesson', {
    detail: { grade: 10, lessonId: 'g10-l12', experimentId: 'g10-lesson-12' }
  })))
  await page.waitForSelector('.guided-lab-shell.guided-running', { timeout: 10000 })
  const buttons = await page.$$eval('[data-open-molecule]', nodes => nodes.map(node => node.dataset.openMolecule))
  record('lesson g10-l12 offers 3D models H₂, O₂, N₂', buttons.join() === 'H2,O2,N2', buttons.join())
  await page.click('[data-open-molecule="N2"]')
  await page.waitForSelector('[data-cs-molecule-stage] canvas', { timeout: 15000 }).catch(() => {})
  const studio = await page.evaluate(() => ({
    canvas: Boolean(document.querySelector('[data-cs-molecule-stage] canvas')),
    title: document.querySelector('[data-cs-molecule-title]')?.textContent.trim()
  }))
  record('lesson model button opens the N₂ model directly', studio.canvas && /Nitrogen/.test(studio.title), JSON.stringify(studio))
  await page.click('[data-cs-close]')
  const back = await page.evaluate(() => Boolean(document.querySelector('[data-open-molecule="N2"]')) && !document.querySelector('.cs5-overlay'))
  record('closing the studio returns to the same lesson step', back)
  record('console clean in lesson → model flow', errors.length === 0, errors.join(' | '))
  await context.close()
}

async function openLearning(page, baseURL, hash) {
  await page.goto(`${baseURL}/${hash}`, { waitUntil: 'load' })
  await page.waitForFunction(() => document.querySelector('#app-shell')?.dataset.currentView === 'learning')
  await page.waitForSelector('#learning-host .lx h1', { timeout: 15000 })
  await page.waitForFunction(() => !document.querySelector('#chemlab-production-boot'), null, { timeout: 5000 })
}

const readerState = page => page.evaluate(() => ({
  hash: location.hash,
  title: document.querySelector('.lx-reader__title')?.textContent.trim() || null,
  stepTitle: document.querySelector('#lx-step-title')?.textContent.trim() || null,
  count: document.querySelector('.lx-stepcount')?.textContent.trim() || null,
  focused: document.activeElement?.id || null
}))

const storedLesson = (page, grade, lessonId) => page.evaluate(([grade, lessonId]) => {
  const progress = JSON.parse(localStorage.getItem('chemlab-v1-progress') || '{}')
  return { record: progress.learning?.[`grade${grade}`]?.lessons?.[lessonId] || null, statistics: progress.statistics || {} }
}, [grade, lessonId])

async function learningJourneys(browser, baseURL) {
  const { context, page, errors } = await newPage(browser, { width: 1440, height: 900, theme: 'dark' })

  await openView(page, baseURL, 'home')
  await page.click('.dash-continue [data-app-hash]')
  await page.waitForSelector('#lx-step-title', { timeout: 15000 })
  record('learning: home "start" button opens the first lesson directly', (await readerState(page)).hash === '#learning/lesson/g10-l1')
  await page.evaluate(() => localStorage.removeItem('chemlab-v1-progress'))

  // A: new learner → Learning → grade → chapter list → lesson
  await openLearning(page, baseURL, '#learning')
  const home = await page.evaluate(() => ({
    resume: document.querySelector('.lx-resume__title')?.textContent.trim(),
    grades: document.querySelectorAll('.lx-grade').length
  }))
  record('learning A: home offers the first lesson and three grades', /Thành phần của nguyên tử/.test(home.resume) && home.grades === 3, JSON.stringify(home))
  await page.click('a.lx-grade[href="#learning/grade-10"]')
  await page.waitForSelector('.lx-chapter')
  const grade = await page.evaluate(() => ({
    hash: location.hash,
    title: document.querySelector('.lx-title')?.textContent.trim(),
    chapters: document.querySelectorAll('.lx-chapter').length,
    lessons: document.querySelectorAll('.lx-chapter .lx-row').length,
    focused: document.activeElement?.matches('[data-lx-heading]')
  }))
  record('learning A: grade 10 browser lists 7 chapters and 23 lessons', grade.hash === '#learning/grade-10' && grade.title === 'Hóa học 10' && grade.chapters === 7 && grade.lessons === 23, JSON.stringify(grade))
  record('learning A: focus moves to the page heading after navigation', grade.focused)
  await page.click('a.lx-row[href="#learning/lesson/g10-l1"]')
  await page.waitForSelector('#lx-step-title')
  let state = await readerState(page)
  record('learning A: lesson opens at step 1', state.title === 'Thành phần của nguyên tử' && state.count === 'Bước 1/9', JSON.stringify(state))

  // B: step forward, back, forward
  await page.focus('[data-step-next]')
  await page.keyboard.press('Enter')
  await page.waitForFunction(() => document.querySelector('.lx-stepcount')?.textContent.includes('2/9'))
  state = await readerState(page)
  record('learning B: keyboard Next moves to step 2 and focuses its heading', state.focused === 'lx-step-title' && /hạt nhân và lớp vỏ/.test(state.stepTitle), JSON.stringify(state))
  await page.click('[data-step-next]')
  await page.click('[data-step-prev]')
  state = await readerState(page)
  let stored = await storedLesson(page, 10, 'g10-l1')
  record('learning B: Back returns to step 2 and progress is saved',
    state.count === 'Bước 2/9' && stored.record?.currentStep === 'structure' && stored.record.viewedSteps.includes('objectives') && stored.record.viewedSteps.includes('structure') && stored.record.completed !== true,
    JSON.stringify({ state, record: stored.record }))

  // C: reload restores the same lesson and step
  await page.reload({ waitUntil: 'load' })
  await page.waitForSelector('#lx-step-title', { timeout: 15000 })
  state = await readerState(page)
  record('learning C: reload returns to the same lesson step', state.hash === '#learning/lesson/g10-l1' && state.count === 'Bước 2/9', JSON.stringify(state))

  // D: quick check with feedback, kept after reload, retry clears it
  await page.click('.lx-steps [data-step-index="7"]')
  await page.click('[data-quiz="g10-l1-c1"] [data-quiz-option="b"]')
  await page.click('[data-quiz="g10-l1-c2"] [data-quiz-option="a"]')
  const feedback = await page.evaluate(() => ({
    right: document.querySelector('[data-quiz="g10-l1-c1"] .lx-quiz__verdict')?.textContent.trim(),
    wrong: document.querySelector('[data-quiz="g10-l1-c2"] .lx-quiz__verdict')?.textContent.trim(),
    explanation: Boolean(document.querySelector('[data-quiz="g10-l1-c2"] .lx-quiz__feedback p + p'))
  }))
  record('learning D: quick check gives right/wrong feedback with explanation',
    /Chính xác/.test(feedback.right) && /Chưa đúng.*C/.test(feedback.wrong) && feedback.explanation, JSON.stringify(feedback))
  await page.reload({ waitUntil: 'load' })
  await page.waitForSelector('[data-quiz="g10-l1-c2"]', { timeout: 15000 })
  const kept = await page.evaluate(() => document.querySelector('[data-quiz="g10-l1-c2"] [data-quiz-option="c"]')?.classList.contains('is-correct'))
  record('learning D: answers survive reload', kept)
  await page.click('[data-quiz="g10-l1-c2"] [data-quiz-retry]')
  const cleared = await page.evaluate(() => !document.querySelector('[data-quiz="g10-l1-c2"] .lx-quiz__verdict'))
  record('learning D: retry clears an answer', cleared)

  // E: 3D model overlay returns to the same step; Lab round trip keeps the lesson
  await page.click('.lx-steps [data-step-index="6"]')
  await page.click('[data-activity="1"]')
  await page.waitForSelector('.ax.is-open', { timeout: 15000 })
  await page.click('[data-ax-close]')
  await page.waitForFunction(() => !document.querySelector('.ax.is-open'), null, { timeout: 5000 })
  state = await readerState(page)
  record('learning E: closing Atomic Explorer returns to the same step', state.count === 'Bước 7/9', JSON.stringify(state))
  await page.click('[data-activity="2"]')
  await page.waitForSelector('.guided-lab-shell.guided-running', { timeout: 15000 })
  const lab = await page.evaluate(() => ({ view: document.querySelector('#app-shell').dataset.currentView, experiment: window.ChemLabGuidedLab?.context()?.experiment?.id }))
  record('learning E: guided activity opens the matching Lab experiment', lab.view === 'lab' && lab.experiment === 'g10-lesson-01', JSON.stringify(lab))
  await page.click('.app-sidebar [data-nav-item][data-view="learning"]')
  await page.waitForSelector('#lx-step-title')
  state = await readerState(page)
  record('learning E: returning to Learning restores lesson and step', state.hash === '#learning/lesson/g10-l1' && state.count === 'Bước 7/9', JSON.stringify(state))

  // Completion: learn every step, then finish
  await page.click('.lx-steps [data-step-index="0"]')
  for (let index = 0; index < 8; index += 1) await page.click('[data-step-next]')
  const before = (await storedLesson(page, 10, 'g10-l1')).statistics.completedLessons || 0
  await page.click('[data-lesson-complete]')
  stored = await storedLesson(page, 10, 'g10-l1')
  const done = await page.evaluate(() => document.querySelector('.lx-finish.is-done h3')?.textContent.trim())
  record('learning: finishing the last step completes the lesson once',
    stored.record?.completed === true && stored.record.progress === 100 && stored.statistics.completedLessons === before + 1 && /hoàn thành/.test(done || ''),
    JSON.stringify({ done, record: stored.record, before, after: stored.statistics.completedLessons }))
  await page.click('.lx-finish a[href="#learning/grade-10"]')
  await page.waitForSelector('.lx-chapter')
  const row = await page.evaluate(() => document.querySelector('a.lx-row[href="#learning/lesson/g10-l1"] .lx-done')?.textContent.trim())
  record('learning: completed lesson is marked in the browser', row === 'Đã học', row)

  // Every catalogued lesson can be opened
  const toVisit = []
  for (const g of [10, 11, 12]) {
    await page.evaluate(g => { location.hash = `#learning/grade-${g}` }, g)
    await page.waitForFunction(g => document.querySelector('.lx-title')?.textContent === `Hóa học ${g}`, g)
    toVisit.push(...await page.$$eval('.lx-chapter .lx-row', nodes => nodes.map(node => node.getAttribute('href').split('/').pop())))
  }
  const broken = []
  for (const id of toVisit) {
    await page.evaluate(id => { location.hash = `#learning/lesson/${id}` }, id)
    const ok = await page.waitForFunction(() => {
      const heading = document.querySelector('.lx-reader__title, .lx-message .lx-title')
      return heading && !document.querySelector('.lx-message[role="alert"]') && !/Đang tải/.test(document.querySelector('.lx-lead')?.textContent || '')
    }, null, { timeout: 8000 }).then(() => true).catch(() => false)
    if (!ok) broken.push(id)
  }
  record('learning: all 78 catalogued lessons open without error', toVisit.length === 78 && broken.length === 0, `${toVisit.length} visited; broken: ${broken.join(',')}`)

  // Error states
  await page.evaluate(() => { location.hash = '#learning/lesson/khong-ton-tai' })
  await page.waitForSelector('.lx-message[role="alert"]')
  record('learning: unknown lesson shows a recoverable message', await page.evaluate(() => /Không tìm thấy/.test(document.querySelector('.lx-message')?.textContent) && Boolean(document.querySelector('.lx-message a[href="#learning"]'))))

  // H: theme switch inside the reader keeps the step
  await page.evaluate(() => { location.hash = '#learning/lesson/g11-l1' })
  await page.waitForSelector('#lx-step-title')
  await page.click('[data-step-next]')
  await page.click('.app-sidebar [data-theme-toggle], [data-theme-toggle]')
  state = await readerState(page)
  const theme = await page.evaluate(() => document.documentElement.dataset.theme)
  record('learning H: switching theme keeps the reader on the same step', theme === 'light' && state.count === 'Bước 2/9', JSON.stringify({ theme, state }))

  record('console clean in learning journeys', errors.length === 0, errors.join(' | '))
  await context.close()
}

async function learningLegacyData(browser, baseURL) {
  const { context, page, errors } = await newPage(browser, { width: 1024, height: 800, theme: 'light' })
  // F: progress written by 6.2 (reader fields absent) must still count
  await context.addInitScript(() => {
    if (sessionStorage.getItem('legacy-seeded')) return
    localStorage.setItem('chemlab-v1-progress', JSON.stringify({
      version: 1,
      learning: {
        grade10: { lessons: { 'g10-l1': { grade: 10, lessonId: 'g10-l1', started: true, completed: true, progress: 100 } }, chapters: {}, completedLessons: ['g10-l1'] },
        grade11: { lessons: {}, chapters: {}, completedLessons: [] },
        grade12: { lessons: {}, chapters: {}, completedLessons: [] },
        quizzes: {}, totalXP: 120, totalCorrect: 3, totalQuestions: 4
      },
      experiments: {
        grade10: {
          'g10-halide-chloride': { grade: 10, experimentId: 'g10-halide-chloride', started: true, completed: true, completedSteps: [0, 1] },
          'g10-halide-iodide': { grade: 10, experimentId: 'g10-halide-iodide', started: true, completed: true, completedSteps: [0, 1] }
        },
        grade11: {}, grade12: {}, completed: [], totalCompleted: 0
      },
      statistics: { completedLessons: 1, completedExperiments: 2, correctAnswers: 3, totalAnswers: 4, totalLearningTimeSeconds: 300, totalExperimentTimeSeconds: 120 },
      lastActivity: { type: 'learning', grade: 10, lessonId: 'g10-l1', completed: true }
    }))
    sessionStorage.setItem('legacy-seeded', '1')
  })
  await openLearning(page, baseURL, '#learning/grade-10')
  const marks = await page.evaluate(() => ({
    l1: document.querySelector('a.lx-row[href="#learning/lesson/g10-l1"] .lx-done')?.textContent.trim(),
    l22: document.querySelector('a.lx-row[href="#learning/lesson/g10-l22"] .lx-done')?.textContent.trim()
  }))
  record('learning F: 6.2 lesson completion counts as learned; finished Lab activities stay visible as such', marks.l1 === 'Đã học' && marks.l22 === 'Đã làm thí nghiệm', JSON.stringify(marks))
  await page.click('a.lx-row[href="#learning/lesson/g10-l1"]')
  await page.waitForSelector('#lx-step-title')
  const reader = await page.evaluate(() => Boolean(document.querySelector('.lx-reader__status .lx-done')))
  const stored = await storedLesson(page, 10, 'g10-l1')
  record('learning F: opening a completed legacy lesson keeps completion and counters',
    reader && stored.record.completed === true && stored.statistics.completedLessons === 1 && stored.statistics.totalAnswers === 4,
    JSON.stringify(stored))
  await page.click('.lx-crumbs a')
  await page.click('a.lx-row[href="#learning/lesson/g10-l23"]')
  await page.waitForSelector('#lx-step-title')
  record('learning: g10-l23, missing in 6.3, now opens as a full lesson',
    await page.evaluate(() => /Bài học đầy đủ/.test(document.querySelector('.lx-reader__status').textContent)))
  await page.evaluate(() => { location.hash = '#learning/lesson/g12-l29' })
  await page.waitForSelector('#lx-step-title')
  // 6.4 published all 78 lessons, so the last short-content sample (g12-l29) now opens in full.
  record('learning: g12-l29, the last short-content lesson, now opens as a full lesson',
    await page.evaluate(() => /Bài học đầy đủ/.test(document.querySelector('.lx-reader__status').textContent) && document.querySelectorAll('.lx-steps li').length > 2))
  record('console clean with legacy progress', errors.length === 0, errors.join(' | '))
  await context.close()

  // Corrupt storage: page still works and the payload is backed up
  const corrupt = await newPage(browser, { width: 390, height: 844, theme: 'dark' })
  await corrupt.context.addInitScript(() => {
    if (sessionStorage.getItem('corrupt-seeded')) return
    localStorage.setItem('chemlab-v1-progress', '{"learning": broken')
    sessionStorage.setItem('corrupt-seeded', '1')
  })
  await openLearning(corrupt.page, baseURL, '#learning/lesson/g12-l15')
  await corrupt.page.waitForSelector('#lx-step-title')
  const backup = await corrupt.page.evaluate(() => localStorage.getItem('chemlab-v1-progress-corrupt-backup'))
  record('learning: corrupt progress is backed up and the lesson still opens', backup === '{"learning": broken')
  await corrupt.context.close()
}

async function learningReaderLayout(browser, baseURL) {
  // G: phone and desktop reader layout in both themes
  for (const theme of ['dark', 'light']) {
    for (const width of [320, 390, 768, 1024, 1440, 1920]) {
      const { context, page, errors } = await newPage(browser, { width, height: width < 768 ? 844 : 900, theme })
      await openLearning(page, baseURL, '#learning/lesson/g12-l15')
      await page.waitForSelector('#lx-step-title')
      if (width < 1200) {
        await page.click('.lx-steps-toggle')
        await page.click('.lx-steps [data-step-index="3"]')
      }
      else {
        await page.click('.lx-steps [data-step-index="3"]')
      }
      await page.waitForFunction(() => document.querySelector('.lx-stepcount')?.textContent.includes('4/'))
      const state = await page.evaluate(() => {
        const doc = document.documentElement
        const small = [...document.querySelectorAll('.lx-reader button, .lx-reader a')]
          .filter(node => node.offsetParent && !node.closest('.lx-steps:not(.is-open)'))
          .filter(node => {
            const r = node.getBoundingClientRect()
            return r.height < 44 && !node.closest('.lx-crumbs, .lx-steps, .lx-meta')
          })
          .map(node => node.textContent.trim().slice(0, 30))
        const body = document.querySelector('.lx-step__body p')
        return {
          overflow: doc.scrollWidth - innerWidth,
          bodySize: parseFloat(getComputedStyle(body).fontSize),
          table: Boolean(document.querySelector('.lx-table')),
          small
        }
      })
      record(`learning G reader @${width} ${theme}: no page overflow, ≥16px text, ≥44px controls`,
        state.overflow <= 1 && state.bodySize >= 16 && state.small.length === 0 && state.table, JSON.stringify(state))
      if (state.overflow > 1) await screenshotOnFail(page, `learning-reader-${width}-${theme}`)
      record(`console clean in reader @${width} ${theme}`, errors.length === 0, errors.join(' | '))
      await context.close()
    }
  }
}

async function labStoichChecks(browser, baseURL) {
  const { context, page, errors } = await newPage(browser, { width: 1440, height: 900, theme: 'dark' })
  await openView(page, baseURL, 'lab')
  const add = async (id, volume = 25) => {
    await page.click(`.reagent-card[data-reagent="${id}"]`)
    await page.click(`[data-volume="${volume}"]`)
    await page.click('#add-reagent')
    await page.waitForTimeout(150)
  }
  const panel = () => page.evaluate(() => ({
    hidden: document.querySelector('#stoich-box').hidden,
    text: document.querySelector('#stoich-body').innerText.replace(/\s+/g, ' ').trim()
  }))

  await add('hcl')
  await add('naoh', 10)
  const a = await panel()
  record('lab amounts: 2.5 mmol HCl + 1 mmol NaOH → NaOH limiting, 1,50 mmol HCl left, 1,00 mmol NaCl',
    !a.hidden && /hạn chế\) NaOH/.test(a.text) && /Còn dư HCl 1,50 mmol/.test(a.text) && /NaCl 1,00 mmol/.test(a.text), a.text)
  await add('naoh', 25)
  const b = await panel()
  record('lab amounts update after more NaOH (now HCl limiting, NaOH 1,00 mmol left)', /hạn chế\) HCl/.test(b.text) && /Còn dư NaOH 1,00 mmol/.test(b.text), b.text)

  await page.click('#reset-lab')
  await add('baoh2')
  await add('h2so4', 10)
  const c = await panel()
  record('lab amounts: BaSO₄ precipitate 1,00 mmol ≈ 0,233 g', /BaSO₄↓ 1,00 mmol \(0,233 g\)/.test(c.text), c.text)

  const drawn = () => page.evaluate(() => ({
    amount: document.querySelector('.liquid-mask').dataset.precipitateAmount || null,
    layer: document.querySelector('#precipitate-layer').classList.contains('has-precipitate'),
    title: document.querySelector('#observation-title').textContent.trim()
  }))

  await page.click('#reset-lab')
  await add('agno3')
  await add('nacl', 10)
  const silver = await panel()
  const silverDrawn = await drawn()
  record('lab amounts: AgNO₃ 2,5 + NaCl 1 mmol → AgCl↓ 1,00 mmol, AgNO₃ left; drawing scaled to 0.40',
    /AgCl↓ 1,00 mmol/.test(silver.text) && /Còn dư AgNO₃ 1,50 mmol/.test(silver.text) && silverDrawn.amount === '0.40', `${silver.text} ${JSON.stringify(silverDrawn)}`)
  await add('nacl', 25)
  const silverMore = await drawn()
  record('lab amounts: more NaCl → AgCl↓ 2,50 mmol and a larger precipitate (1.00)', /AgCl↓ 2,50 mmol/.test((await panel()).text) && silverMore.amount === '1.00', JSON.stringify(silverMore))
  await page.click('#undo-button')
  await page.waitForTimeout(200)
  record('lab amounts: undo restores AgCl↓ 1,00 mmol and the smaller drawing', /AgCl↓ 1,00 mmol/.test((await panel()).text) && (await drawn()).amount === '0.40')

  await page.click('#reset-lab')
  record('lab amounts: reset clears the panel and the precipitate', (await panel()).hidden && (await drawn()).amount === null)
  await add('bacl2')
  await add('na2so4')
  record('lab amounts: BaCl₂ + Na₂SO₄ equal amounts → "vừa đủ", BaSO₄↓ 2,50 mmol', /vừa đủ/.test((await panel()).text) && /BaSO₄↓ 2,50 mmol/.test((await panel()).text), (await panel()).text)

  await page.click('#reset-lab')
  await add('cuso4')
  await add('naoh')
  record('lab amounts: CuSO₄ + 2NaOH → Cu(OH)₂↓ 1,25 mmol, NaOH limiting', /Cu\(OH\)₂↓ 1,25 mmol/.test((await panel()).text) && /hạn chế\) NaOH/.test((await panel()).text), (await panel()).text)
  const liquidLook = () => page.evaluate(() => getComputedStyle(document.querySelector('.liquid')).getPropertyValue('--liquid-opacity').trim())
  const tinted = await liquidLook()
  await add('naoh', 25)
  const cleared = await liquidLook()
  record('solution colour follows the chemistry: Cu²⁺ left → blue; all Cu²⁺ precipitated → colourless, see-through',
    tinted === '0.9' && cleared === '0.42', `${tinted} → ${cleared}`)

  await page.click('#reset-lab')
  await add('alcl3')
  await add('naoh', 50)
  const alumina = await drawn()
  await add('naoh', 50)
  await page.waitForTimeout(1200)
  const dissolved = await drawn()
  const dissolvedText = (await panel()).text
  record('lab amounts: Al(OH)₃↓ forms, then dissolves completely in excess NaOH (10 mmol OH⁻ per 2,5 mmol Al³⁺)',
    alumina.layer && !dissolved.layer && dissolved.amount === null && /tan hết/.test(dissolved.title) && /Na\[Al\(OH\)₄\] 2,50 mmol/.test(dissolvedText),
    `${JSON.stringify(alumina)} ${JSON.stringify(dissolved)} ${dissolvedText}`)
  await page.click('#undo-button')
  await page.waitForTimeout(200)
  record('lab amounts: undo brings the Al(OH)₃ precipitate back', (await drawn()).layer)

  const bursts = () => page.evaluate(() => Number(document.querySelector('.liquid-mask').dataset.gasBursts || 0))
  const observed = () => page.evaluate(() => ({
    title: document.querySelector('#observation-title').textContent.trim(),
    equation: document.querySelector('#reaction-equation').textContent.trim()
  }))
  await page.click('#reset-lab')
  const before = await bursts()
  await add('na2co3')
  await add('hcl', 10)
  const stage1 = await observed()
  record('carbonate: 1 mmol HCl into 2,5 mmol Na₂CO₃ → no bubbles, stage 1 HCO₃⁻ shown',
    (await bursts()) === before && /Chưa có khí/.test(stage1.title) && /HCO₃⁻/.test(stage1.equation) && /CO₂↑ đã thoát ra chưa có/.test((await panel()).text), `${await bursts() - before} ${JSON.stringify(stage1)} ${(await panel()).text}`)
  await add('hcl', 25)
  const stage2 = await observed()
  record('carbonate: more HCl → stage 2, CO₂ 1,00 mmol released and bubbles start',
    (await bursts()) > before && /Có khí CO₂/.test(stage2.title) && /CO₂↑ đã thoát ra 1,00 mmol/.test((await panel()).text), `${JSON.stringify(stage2)} ${(await panel()).text}`)
  await page.click('#undo-button')
  await page.waitForTimeout(200)
  const undoBursts = await bursts()
  record('carbonate: undo returns to stage 1 without new bubbles', /Chưa có khí/.test((await observed()).title) && /chưa có/.test((await panel()).text), (await panel()).text)
  await page.click('#stir-button')
  record('carbonate: stirring at stage 1 releases no bubbles', (await bursts()) === undoBursts)

  await page.click('#reset-lab')
  const reverse = await bursts()
  await add('hcl')
  await add('na2co3', 10)
  record('carbonate: Na₂CO₃ into excess HCl → gas at once (1,00 mmol CO₂)', (await bursts()) > reverse && /CO₂↑ đã thoát ra 1,00 mmol/.test((await panel()).text), (await panel()).text)

  await page.click('#reset-lab')
  const plain = await bursts()
  await add('agno3')
  await add('nacl')
  await page.click('#stir-button')
  record('no false bubbling: AgNO₃ + NaCl and stirring produce no gas', (await bursts()) === plain)

  record('console clean in lab amounts flow', errors.length === 0, errors.join(' | '))
  await context.close()
}

async function guidedPHChecks(browser, baseURL) {
  const { context, page, errors } = await newPage(browser, { width: 1440, height: 900, theme: 'light' })
  await openView(page, baseURL, 'lab')
  const plan = ['info', 'quiz:a', 'add:hcl', 'litmus:acid', 'observation', 'add:naoh', 'litmus:neutral', 'observation', 'add:naoh', 'litmus:base', 'observation', 'quiz:b']
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('chemlab:open-guided-lesson', {
    detail: { grade: 11, lessonId: 'g11-l2', experimentId: 'g11-lesson-02' }
  })))
  await page.waitForSelector('.guided-lab-shell.guided-running', { timeout: 10000 })
  const litmus = []
  for (let guard = 0; guard < 40; guard += 1) {
    await page.waitForTimeout(300)
    const state = await page.evaluate(() => ({
      step: Number(/Bước (\d+)\/12/.exec(document.querySelector('.guided-lab-shell').innerText)?.[1]) || 0,
      confirm: Boolean(document.querySelector('[data-confirm-lab-result]')),
      done: /Bạn đã hoàn thành 12\/12 bước/.test(document.querySelector('.guided-lab-shell').innerText)
    }))
    if (state.done) break
    if (state.confirm) { await page.click('[data-confirm-lab-result]'); continue }
    const [kind, value] = plan[state.step - 1].split(':')
    if (kind === 'quiz') await page.click(`[data-prediction-option="${value}"]`)
    else if (kind === 'add') {
      await page.click(`.reagent-card[data-reagent="${value}"]`)
      await page.click('#add-reagent')
    }
    else if (kind === 'litmus') {
      await page.click('.reagent-card[data-reagent="litmusPaper"]')
      await page.click('#add-reagent')
      litmus.push((await page.textContent('#litmus-paper-label')).trim())
    }
    else await page.click('[data-continue-learning]')
  }
  const done = await page.evaluate(() => /Bạn đã hoàn thành 12\/12 bước/.test(document.querySelector('.guided-lab-shell').innerText))
  record('guided g11-l2 completes: litmus red → purple → blue with the mole-based pH',
    done && /đỏ/.test(litmus[0]) && /tím/.test(litmus[1]) && /xanh/.test(litmus[2]), `${done} ${litmus.join(' | ')}`)
  record('console clean in guided pH lesson', errors.length === 0, errors.join(' | '))
  await context.close()
}

async function observationChecks(browser, baseURL) {
  const { context, page, errors } = await newPage(browser, { width: 390, height: 844, theme: 'dark' })
  await openView(page, baseURL, 'lab')
  const add = async (id, volume = 25) => {
    await page.click(`.reagent-card[data-reagent="${id}"]`)
    await page.click(`[data-volume="${volume}"]`)
    await page.click('#add-reagent')
    await page.waitForTimeout(150)
  }
  const seen = () => page.evaluate(() => ({
    title: document.querySelector('#observation-title').textContent.trim(),
    text: document.querySelector('#observation-text').textContent.trim(),
    bursts: Number(document.querySelector('.liquid-mask').dataset.gasBursts || 0),
    solid: document.querySelector('#precipitate-layer').classList.contains('has-precipitate')
  }))
  const cases = [
    [['agno3', 'ki'], o => /Kết tủa vàng/.test(o.title) && /AgI/.test(o.text) && o.solid, 'AgNO₃ + KI → yellow AgI named from the table'],
    [['feso4', 'naoh'], o => /trắng xanh/.test(o.title), 'FeSO₄ + NaOH → "trắng xanh" Fe(OH)₂ (textbook name, not a guess from the colour)'],
    [['cuso4', 'na2s'], o => /Kết tủa đen/.test(o.title), 'CuSO₄ + Na₂S → black CuS'],
    [['hcl', 'naoh'], o => /Không thấy biến đổi rõ/.test(o.text) && !o.solid && o.bursts === 0, 'HCl + NaOH: no visible change is stated, nothing drawn'],
    [['fecl3', 'kscn'], o => /đổi màu/.test(o.title), 'FeCl₃ + KSCN → colour change'],
    [['nacl', 'kno3'], o => /Chưa có hiện tượng|làm trống/.test(o.title + o.text) && !o.solid && o.bursts === 0, 'NaCl + KNO₃: no reaction, no effects']
  ]
  for (const [ids, check, label] of cases) {
    await page.click('#reset-lab')
    await page.evaluate(() => { document.querySelector('.liquid-mask').dataset.gasBursts = '0' })
    for (const id of ids) await add(id)
    const observed = await seen()
    record(`observation: ${label}`, check(observed), JSON.stringify(observed))
  }
  const panelHidden = await page.evaluate(() => document.querySelector('#stoich-box').hidden)
  record('observation: no reaction → no amounts panel', panelHidden)
  record('console clean in observation checks', errors.length === 0, errors.join(' | '))
  await context.close()
}

async function guidedSulfiteChecks(browser, baseURL) {
  const { context, page, errors } = await newPage(browser, { width: 1440, height: 900, theme: 'dark' })
  await openView(page, baseURL, 'lab')
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('chemlab:open-guided-lesson', {
    detail: { grade: 11, lessonId: 'g11-l7', experimentId: 'g11-lesson-07' }
  })))
  await page.waitForSelector('.guided-lab-shell.guided-running', { timeout: 10000 })
  const step = () => page.evaluate(() => Number(/Bước (\d+)\/6/.exec(document.querySelector('.guided-lab-shell').innerText)?.[1]) || 0)
  const add = async id => {
    await page.click(`.reagent-card[data-reagent="${id}"]`)
    await page.click('[data-volume="25"]')
    await page.click('#add-reagent')
    await page.waitForTimeout(300)
  }
  await page.click('[data-continue-learning]')
  await page.waitForTimeout(300)
  await page.click('[data-prediction-option="a"]')
  await page.waitForTimeout(300)
  await add('na2so3')
  await add('hcl')
  const afterFirst = { step: await step(), title: (await page.textContent('#observation-title')).trim() }
  await add('hcl')
  if (await page.$('[data-confirm-lab-result]')) await page.click('[data-confirm-lab-result]')
  await page.waitForTimeout(300)
  const afterSecond = { step: await step(), title: (await page.textContent('#observation-title')).trim() }
  record('guided g11-l7: 25 mL HCl (1:1) stays at the step with no SO₂ yet; excess HCl advances with SO₂ released',
    afterFirst.step === 4 && /Chưa có khí/.test(afterFirst.title) && afterSecond.step === 5 && /SO₂/.test(afterSecond.title),
    `${JSON.stringify(afterFirst)} ${JSON.stringify(afterSecond)}`)
  record('console clean in guided sulfite lesson', errors.length === 0, errors.join(' | '))
  await context.close()
}

async function labStateChecks(browser, baseURL) {
  const { context, page, errors } = await newPage(browser, { width: 390, height: 844, theme: 'light' })
  await openView(page, baseURL, 'lab')
  await page.click('.reagent-card[data-reagent="agno3"]')
  await page.click('[data-volume="50"]')
  for (let i = 0; i < 4; i += 1) await page.click('#add-reagent', { delay: 0 })
  await page.click('.reagent-card[data-reagent="nacl"]')
  for (let i = 0; i < 6; i += 1) await page.click('#add-reagent', { delay: 0 })
  await page.waitForTimeout(400)
  const state = await page.evaluate(() => ({
    volume: document.querySelector('#volume-text, [id*="volume"]')?.textContent,
    message: document.querySelector('#lab-message-title').textContent.trim(),
    panel: document.querySelector('#stoich-body').innerText.replace(/\s+/g, ' ')
  }))
  record('rapid additions: beaker capped at 250 mL, amounts follow what actually went in',
    /Cốc đã đầy/.test(state.message) && /AgCl↓ 5,00 mmol/.test(state.panel) && /Còn dư AgNO₃ 15,00 mmol/.test(state.panel), JSON.stringify(state))
  await openView(page, baseURL, 'periodic')
  await openView(page, baseURL, 'lab')
  const back = await page.evaluate(() => document.querySelector('#stoich-body').innerText.replace(/\s+/g, ' '))
  record('route switch: the lab keeps its chemistry state', back === state.panel, back)
  for (let i = 0; i < 5; i += 1) await page.click('#reset-lab')
  record('repeated reset leaves an empty, consistent lab', await page.evaluate(() => document.querySelector('#stoich-box').hidden && !document.querySelector('.liquid-mask').dataset.precipitateAmount))
  record('console clean under rapid input', errors.length === 0, errors.join(' | '))
  await context.close()
}

async function brandChecks(browser, baseURL) {
  for (const [width, theme] of [[1440, 'dark'], [390, 'light']]) {
    const { context, page, errors } = await newPage(browser, { width, height: width < 768 ? 844 : 900, theme })
    await openView(page, baseURL, 'home')
    const head = await page.evaluate(async () => {
      const links = [...document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]')].map(link => link.href)
      const manifest = await (await fetch(document.querySelector('link[rel="manifest"]').href)).json()
      const icons = [...manifest.icons, ...manifest.shortcuts.flatMap(item => item.icons)]
      const measure = src => new Promise(resolve => {
        const image = new Image()
        image.onload = () => resolve(`${image.naturalWidth}x${image.naturalHeight}`)
        image.onerror = () => resolve('error')
        image.src = src
      })
      return {
        links: await Promise.all(links.map(async href => [href.split('/').pop(), await measure(href)])),
        icons: await Promise.all(icons.map(async icon => [icon.src, icon.sizes, icon.purpose || 'any', await measure(icon.src)])),
        purposes: manifest.icons.map(icon => icon.purpose)
      }
    })
    const expected = { 'favicon-32.png': '32x32', 'favicon-48.png': '48x48', 'apple-touch-icon.png': '180x180' }
    record(`brand @${width} ${theme}: favicons and apple-touch icon load at their declared sizes`,
      head.links.length === 3 && head.links.every(([name, size]) => size === expected[name]), JSON.stringify(head.links))
    record(`brand @${width} ${theme}: every manifest icon (any + maskable, shortcuts) matches its declared size`,
      head.icons.every(([, sizes, , size]) => sizes === size) && head.purposes.includes('maskable') && head.purposes.includes('any'), JSON.stringify(head.icons))

    const marks = await page.evaluate(() => [...document.querySelectorAll('img.app-brand__svg')]
      .filter(image => image.getClientRects().length)
      .map(image => ({ src: image.getAttribute('src'), loaded: image.complete && image.naturalWidth > 0, box: Math.round(image.getBoundingClientRect().width) })))
    record(`brand @${width} ${theme}: the visible app mark is the new logo symbol`,
      marks.length >= 1 && marks.every(mark => mark.loaded && /chemlab-mark/.test(mark.src) && mark.box === 32), JSON.stringify(marks))

    // On phones the launcher lives in the collapsed sidebar: open it through the product API there.
    if (await page.isVisible('[data-product-toggle]')) await page.click('[data-product-toggle]')
    else await page.evaluate(() => window.ChemLabProduct.openMenu())
    await page.waitForTimeout(200)
    const menu = await page.evaluate(() => {
      const image = document.querySelector('.clprod-menu-logo img')
      return Boolean(image?.complete && image.naturalWidth > 0)
    })
    record(`brand @${width} ${theme}: product menu shows the logo symbol`, menu)

    if (await page.isVisible('[data-product-about]')) await page.click('[data-product-about]')
    else await page.evaluate(() => window.ChemLabProduct.openAbout())
    await page.waitForTimeout(400)
    const about = await page.evaluate(() => {
      const image = document.querySelector('.clprod-about-logo img')
      const box = image?.getBoundingClientRect()
      return {
        loaded: Boolean(image?.complete && image.naturalWidth > 0),
        alt: image?.alt,
        ratio: box ? +(box.width / box.height).toFixed(2) : 0,
        card: image ? getComputedStyle(image.parentElement).backgroundColor : ''
      }
    })
    // 640×559 source: an undistorted logo keeps ≈ 1.14 : 1, on a white card in both themes.
    record(`brand @${width} ${theme}: About shows the full logo, undistorted, on a white card`,
      about.loaded && /Chemistry Laboratory/.test(about.alt) && Math.abs(about.ratio - 640 / 559) < 0.02 && about.card === 'rgb(255, 255, 255)', JSON.stringify(about))
    record(`console clean in brand checks @${width} ${theme}`, errors.length === 0, errors.join(' | '))
    await context.close()
  }
}

const server = await preview({
  root: rootDir,
  logLevel: 'silent',
  preview: { port: 4179, strictPort: false, open: false }
})
const baseURL = server.resolvedUrls.local[0].replace(/\/$/, '')
const browser = await launchBrowser()

try {
  for (const [name, run] of [['layout sweep', layoutSweep], ['interactions', interactionChecks], ['tools', toolChecks], ['lab pH', labPHChecks], ['lab amounts', labStoichChecks], ['guided pH', guidedPHChecks], ['observations', observationChecks], ['guided sulfite', guidedSulfiteChecks], ['lab state', labStateChecks], ['brand', brandChecks], ['lesson models', lessonModelChecks], ['learning journeys', learningJourneys], ['learning legacy data', learningLegacyData], ['learning reader layout', learningReaderLayout], ['practice journeys', (browser, baseURL) => practiceJourneys(browser, baseURL, { newPage, record })], ['exam journeys', (browser, baseURL) => examJourneys(browser, baseURL, { newPage, record })], ['chemai phone', chemAIPhoneCheck], ['pwa', pwaCheck]]) {
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
