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

  record('console clean during interactions', errors.length === 0, errors.join(' | '))
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

/* ---------- run ---------- */
const server = await preview({
  root: rootDir,
  logLevel: 'silent',
  preview: { port: 4179, strictPort: false, open: false }
})
const baseURL = server.resolvedUrls.local[0].replace(/\/$/, '')
const browser = await launchBrowser()

try {
  await layoutSweep(browser, baseURL)
  await interactionChecks(browser, baseURL)
  await pwaCheck(browser, baseURL)
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
