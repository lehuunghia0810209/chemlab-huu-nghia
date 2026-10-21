// CSP compatibility check (EXR-006): every document is served from the built
// dist/index.html with the policy declared in public/_headers (vite preview
// does not apply _headers, and editor extensions can inject inline scripts into
// the local preview). Any securitypolicyviolation in key modules — including
// WebGL scenes and the ChemAI panel — fails the check.
import fs from 'node:fs'

export function cspFromHeaders(file = new URL('../../public/_headers', import.meta.url)) {
  const text = fs.readFileSync(file, 'utf8')
  return /Content-Security-Policy:\s*(.+)/.exec(text)?.[1].trim() || null
}

const INLINE_SCRIPT = /<script(?![^>]*\ssrc=)[^>]*>/i

export async function cspJourneys(browser, baseURL, { newPage, record }) {
  const policy = cspFromHeaders()
  record('CSP: public/_headers declares a Content-Security-Policy', Boolean(policy), String(policy))
  if (!policy) return
  const html = fs.readFileSync(new URL('../../dist/index.html', import.meta.url), 'utf8')
  const inline = html.match(INLINE_SCRIPT)
  record('CSP: built index.html contains no inline script', !inline, inline ? html.slice(inline.index, inline.index + 120) : '')

  const { context, page, errors } = await newPage(browser, { width: 1280, height: 900, theme: 'dark' })
  await context.route('**/*', route => (route.request().resourceType() === 'document'
    ? route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html, headers: { 'content-security-policy': policy } })
    : route.continue()))
  await context.addInitScript(() => {
    window.__csp = []
    document.addEventListener('securitypolicyviolation', event => {
      window.__csp.push(`${event.violatedDirective} ${event.blockedURI}`)
    })
  })

  const steps = [
    ['home', () => page.waitForSelector('#app-shell')],
    ['periodic', () => page.waitForTimeout(800)],
    ['tools/compound', () => page.waitForTimeout(2000)],
    ['lab', () => page.waitForTimeout(800)],
    ['learning/lesson/g10-l3', () => page.waitForSelector('#lx-step-title')],
    ['learning/exam/tham-khao-2025-hoa', () => page.waitForSelector('[data-ex-start]')]
  ]
  const violations = []
  for (const [hash, wait] of steps) {
    await page.goto(`${baseURL}/#${hash}`, { waitUntil: 'load' })
    await wait()
    violations.push(...(await page.evaluate(() => window.__csp)).map(item => `${hash}: ${item}`))
  }
  // Two real Three.js/WebGL scenes under the policy, on a fresh page.
  const scenePage = await context.newPage()
  scenePage.on('pageerror', error => errors.push(error.message))
  await scenePage.goto(`${baseURL}/#periodic`, { waitUntil: 'load' })
  await scenePage.waitForFunction(() => window.ChemLabPeriodic?.openElement, null, { timeout: 15000 })
  await scenePage.evaluate(() => window.ChemLabPeriodic.openElement(26))
  await scenePage.waitForSelector('[data-ptd-atom]', { state: 'visible', timeout: 15000 })
  await scenePage.click('[data-ptd-atom]')
  await scenePage.waitForSelector('.ax.is-open canvas', { timeout: 15000 })
  await scenePage.click('.ax-modes [data-mode="orbital"]')
  await scenePage.waitForFunction(() => document.querySelector('[data-ax-busy]')?.hidden === true, null, { timeout: 15000 })
  const webgl = await scenePage.evaluate(() => {
    const canvas = document.querySelector('.ax canvas')
    return Boolean(canvas && (canvas.getContext('webgl2') || canvas.getContext('webgl')))
  })
  await scenePage.keyboard.press('Escape')
  await scenePage.goto(`${baseURL}/#tools/orbital`, { waitUntil: 'load' })
  await scenePage.waitForSelector('#orbital-atlas')
  await scenePage.evaluate(() => document.querySelector('#orbital-atlas').scrollIntoView())
  await scenePage.waitForSelector('#orbital-atlas canvas', { timeout: 15000 })
  violations.push(...(await scenePage.evaluate(() => window.__csp)).map(item => `3d: ${item}`))
  record('CSP: Atomic Explorer and Orbital Atlas render WebGL scenes under the policy', webgl && Boolean(await scenePage.$('#orbital-atlas canvas')))
  const canvases = await scenePage.evaluate(() => document.querySelectorAll('canvas').length)

  // ChemAI panel on a fresh page (lazy chunk, its styles, same-origin API).
  const aiPage = await context.newPage()
  aiPage.on('pageerror', error => errors.push(error.message))
  await aiPage.goto(`${baseURL}/#home`, { waitUntil: 'load' })
  await aiPage.waitForSelector('.app-ai-entry')
  await aiPage.click('.app-ai-entry')
  await aiPage.waitForSelector('.chemai-panel', { timeout: 10000 })
  violations.push(...(await aiPage.evaluate(() => window.__csp)).map(item => `chemai: ${item}`))

  record(`CSP: no violation in Home, Periodic, Tools (Compound Studio), Lab, Learning, Exam, 3D scenes and ChemAI (canvases on the 3D page: ${canvases})`, violations.length === 0, violations.join(' | '))
  record('console clean under CSP', errors.filter(text => !/api\/(chat|feedback)|404/.test(text)).length === 0, errors.join(' | '))
  await context.close()
}
