
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
    registrationState.active && registrationState.cacheNames.some(name => name.startsWith('chemlab-6.2.0-evolution-1-')),
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

const server = await preview({
  root: rootDir,
  logLevel: 'silent',
  preview: { port: 4179, strictPort: false, open: false }
})
const baseURL = server.resolvedUrls.local[0].replace(/\/$/, '')
const browser = await launchBrowser()

try {
  for (const [name, run] of [['layout sweep', layoutSweep], ['interactions', interactionChecks], ['tools', toolChecks], ['lab pH', labPHChecks], ['lab amounts', labStoichChecks], ['guided pH', guidedPHChecks], ['observations', observationChecks], ['guided sulfite', guidedSulfiteChecks], ['lab state', labStateChecks], ['lesson models', lessonModelChecks], ['chemai phone', chemAIPhoneCheck], ['pwa', pwaCheck]]) {
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
