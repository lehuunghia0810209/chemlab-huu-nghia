
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { preview } from 'vite'
import { chromium } from 'playwright-core'

const require = createRequire(import.meta.url)
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const AXE_PATH = require.resolve('axe-core/axe.min.js')
const PREFS_KEY = 'chemlab-v5-user-preferences'
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
const VIEWPORTS = [
  { width: 390, height: 844, mobile: true },
  { width: 1440, height: 900, mobile: false }
]
const THEMES = ['dark', 'light']

async function openView(page, baseURL, view) {
  await page.goto(`${baseURL}/#${view}`, { waitUntil: 'load' })
  await page.waitForFunction(v => document.querySelector('#app-shell')?.dataset.currentView === v, view)
  await page.waitForFunction(v => !document.querySelector(`#view-${v} .app-view-loader`), view, { timeout: 15000 })
  await page.waitForFunction(() => !document.querySelector('#chemlab-production-boot'), null, { timeout: 5000 })
  await page.waitForTimeout(400)
}

const SCENARIOS = [
  { name: 'home', view: 'home' },
  { name: 'periodic', view: 'periodic' },
  { name: 'tools', view: 'tools' },
  { name: 'learning', view: 'learning' },
  { name: 'lab', view: 'lab' },
  {
    name: 'lab with reaction',
    view: 'lab',
    async setup(page) {
      for (const id of ['cuso4', 'naoh']) {
        await page.click(`.reagent-card[data-reagent="${id}"]`)
        await page.click('#add-reagent')
      }
    }
  },
  {
    name: 'element drawer',
    view: 'periodic',
    scope: '#element-drawer',
    async setup(page) {
      await page.click('[data-number="26"]')
      await page.waitForSelector('#element-drawer.open')
      await page.waitForTimeout(400)
    }
  },
  {
    name: 'settings dialog',
    view: 'home',
    scope: '#user-settings',
    async setup(page) {
      await page.evaluate(() => document.querySelector('[data-open-settings]')?.click())
      await page.waitForSelector('#user-settings', { state: 'visible' })
    }
  },
  {
    name: 'compound studio + 3D',
    view: 'tools',
    scope: '.cs5-overlay',
    async setup(page) {
      await page.click('.tool-selector [data-tool="compound"]')
      await page.fill('[data-cs-formula]', 'H2O')
      await page.click('[data-cs-analyze]')
      await page.click('[data-cs-molecule-load]')
      await page.waitForSelector('[data-cs-molecule-stage] canvas', { timeout: 15000 })
    }
  },
  {
    name: 'reaction studio',
    view: 'tools',
    scope: '.rs52-overlay, [data-rs-close]',
    async setup(page) {
      await page.click('.tool-selector [data-tool="reaction"]')
      await page.fill('[data-rs-input]', 'Cu + HNO3 -> Cu(NO3)2 + NO + H2O')
      await page.click('[data-rs-analyze]')
    }
  },
  {
    name: 'guided lesson',
    view: 'lab',
    async setup(page) {
      await page.evaluate(() => window.dispatchEvent(new CustomEvent('chemlab:open-guided-lesson', {
        detail: { grade: 10, lessonId: 'g10-l12', experimentId: 'g10-lesson-12' }
      })))
      await page.waitForSelector('.guided-lab-shell.guided-running', { timeout: 10000 })
    }
  }
]

const server = await preview({
  root: rootDir,
  logLevel: 'silent',
  preview: { port: 4181, strictPort: false, open: false }
})
const baseURL = server.resolvedUrls.local[0].replace(/\/$/, '')
const channels = [process.env.CHEMLAB_BROWSER_CHANNEL, 'chrome', 'msedge'].filter(Boolean)
let browser = null
for (const channel of channels) {
  try {
    browser = await chromium.launch({ channel })
    break
  }
  catch {
  }
}
if (!browser) {
  await new Promise(resolve => server.httpServer.close(resolve))
  throw new Error(`Không tìm thấy trình duyệt (${channels.join(', ')}).`)
}

const findings = new Map()
let runs = 0

function keyboardFinding(id, help, where, node = '') {
  const entry = findings.get(id) || { id, impact: 'serious', help, where: new Set(), nodes: new Set() }
  entry.where.add(where)
  if (node) entry.nodes.add(node)
  findings.set(id, entry)
}

async function keyboardChecks() {
  for (const theme of THEMES) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block', reducedMotion: 'reduce' })
    await context.addInitScript(([key, value]) => localStorage.setItem(key, value), [PREFS_KEY, JSON.stringify({ theme })])
    const page = await context.newPage()

    for (const view of ['home', 'periodic', 'tools', 'learning', 'lab']) {
      await openView(page, baseURL, view)
      await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0) })
      for (let step = 0; step < 25; step += 1) {
        await page.keyboard.press('Tab')
        const look = () => page.evaluate(() => {
          const element = window.__a11yFocus || document.activeElement
          const chain = [element, element.parentElement, element.parentElement?.parentElement].filter(Boolean)
          return chain.map(node => {
            const style = getComputedStyle(node)
            return `${style.outlineStyle} ${style.outlineWidth} ${style.boxShadow} ${style.borderColor} ${style.backgroundColor}`
          }).join('|')
        })
        const target = await page.evaluate(() => {
          const element = document.activeElement
          if (!element || element === document.body) return null
          window.__a11yFocus = element
          const rect = element.getBoundingClientRect()
          const name = element.id ? `#${element.id}` : `${element.tagName.toLowerCase()}.${[...element.classList].slice(0, 2).join('.')} "${(element.getAttribute('aria-label') || element.textContent).trim().slice(0, 30)}"`
          return { name, skip: element.matches('.skip-link'), visible: rect.width > 0 && rect.height > 0 }
        })
        let state = null
        if (target) {
          await page.waitForTimeout(60)
          const focused = await look()
          await page.evaluate(() => window.__a11yFocus.blur())
          await page.waitForTimeout(60)
          const blurred = await look()
          await page.evaluate(() => window.__a11yFocus.focus({ preventScroll: true }))
          state = { ...target, indicator: target.skip || focused !== blurred }
        }
        if (!state) continue
        if (!state.visible) keyboardFinding('focus-hidden', 'Tab focuses an element that is not visible', `${view} ${theme}`, state.name)
        else if (!state.indicator) keyboardFinding('focus-indicator', 'Focused element shows no focus indicator', `${view} ${theme}`, state.name)
      }
    }

    const dialogCheck = async (label, open, dialogSelector) => {
      const opener = await open()
      await page.waitForSelector(dialogSelector, { state: 'visible', timeout: 10000 })
      await page.waitForTimeout(300)
      const inside = await page.evaluate(selector => Boolean(document.activeElement?.closest(selector)), dialogSelector)
      if (!inside) keyboardFinding('dialog-focus', 'Opening a dialog does not move focus into it', `${label} ${theme}`)
      await page.keyboard.press('Escape')
      await page.waitForTimeout(400)
      const closed = await page.evaluate(selector => {
        const dialog = document.querySelector(selector)
        return !dialog || dialog.hidden || getComputedStyle(dialog).visibility === 'hidden' || !dialog.getClientRects().length || dialog.getAttribute('aria-hidden') === 'true'
      }, dialogSelector)
      if (!closed) keyboardFinding('dialog-escape', 'Esc does not close the dialog', `${label} ${theme}`)
      const returned = await page.evaluate(selector => document.activeElement?.matches(selector), opener)
      if (closed && !returned) keyboardFinding('dialog-return-focus', 'Closing a dialog does not return focus to the control that opened it', `${label} ${theme}`, opener)
    }

    await openView(page, baseURL, 'periodic')
    await dialogCheck('element drawer', async () => {
      await page.focus('[data-number="26"]')
      await page.keyboard.press('Enter')
      return '[data-number="26"]'
    }, '#element-drawer.open')

    await openView(page, baseURL, 'tools')
    for (const [tool, dialog] of [['compound', '.cs5-overlay'], ['reaction', '.rs52-overlay']]) {
      await dialogCheck(`${tool} studio`, async () => {
        await page.focus(`.tool-selector [data-tool="${tool}"]`)
        await page.keyboard.press('Enter')
        return `.tool-selector [data-tool="${tool}"]`
      }, dialog)
    }

    await openView(page, baseURL, 'home')
    await dialogCheck('settings', async () => {
      await page.focus('.app-sidebar [data-open-settings]')
      await page.keyboard.press('Enter')
      return '.app-sidebar [data-open-settings]'
    }, '#user-settings')

    await context.close()
  }
}

try {
  for (const theme of THEMES) {
    for (const viewport of VIEWPORTS) {
      for (const scenario of SCENARIOS) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          isMobile: viewport.mobile,
          hasTouch: viewport.mobile,
          serviceWorkers: 'block',
          reducedMotion: 'reduce'
        })
        await context.addInitScript(([key, value]) => localStorage.setItem(key, value), [PREFS_KEY, JSON.stringify({ theme })])
        const page = await context.newPage()
        const label = `${scenario.name} @${viewport.width} ${theme}`
        try {
          await openView(page, baseURL, scenario.view)
          await scenario.setup?.(page)
          await page.addScriptTag({ path: AXE_PATH })
          const result = await page.evaluate(async ({ tags, scope }) => {
            const target = scope ? { include: [scope] } : document
            const { violations } = await window.axe.run(target, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] })
            return violations.map(v => ({
              id: v.id,
              impact: v.impact,
              help: v.help,
              nodes: v.nodes.map(node => `${node.target.join(' ')} — ${node.failureSummary?.split('\n').slice(1, 2).join(' ').trim()}`)
            }))
          }, { tags: TAGS, scope: scenario.scope })
          runs += 1
          for (const violation of result) {
            const key = violation.id
            const entry = findings.get(key) || { ...violation, where: new Set(), nodes: new Set() }
            entry.where.add(label)
            violation.nodes.forEach(node => entry.nodes.add(node))
            findings.set(key, entry)
          }
        }
        catch (error) {
          findings.set(`crash:${label}`, { id: 'scenario-crash', impact: 'critical', help: error.message.split('\n')[0], where: new Set([label]), nodes: new Set() })
        }
        await context.close()
      }
    }
  }
}
finally {
  try {
    await keyboardChecks()
  }
  catch (error) {
    findings.set('keyboard-crash', { id: 'keyboard-crash', impact: 'critical', help: error.message.split('\n')[0], where: new Set(['keyboard']), nodes: new Set() })
  }
  await browser.close()
  await new Promise(resolve => server.httpServer.close(resolve))
}

console.log(`\nChemLab accessibility audit — axe-core, ${runs} scans (${SCENARIOS.length} areas × ${VIEWPORTS.length} widths × ${THEMES.length} themes)`)
if (!findings.size) {
  console.log('PASS — no WCAG A/AA violations found by axe; keyboard focus checks passed.\n')
}
else {
  const verbose = process.env.CHEMLAB_A11Y_VERBOSE === '1'
  for (const finding of findings.values()) {
    console.log(`\n[${finding.impact}] ${finding.id}: ${finding.help}`)
    console.log(`  in: ${[...finding.where].slice(0, 6).join(', ')}${finding.where.size > 6 ? ` … (+${finding.where.size - 6})` : ''}`)
    const nodes = [...finding.nodes]
    nodes.slice(0, verbose ? nodes.length : 6).forEach(node => console.log(`  - ${node}`))
    if (!verbose && nodes.length > 6) console.log(`  … ${nodes.length - 6} more (CHEMLAB_A11Y_VERBOSE=1)`)
  }
  console.error(`\nFAIL — ${findings.size} axe rule(s) violated.`)
  process.exitCode = 1
}
