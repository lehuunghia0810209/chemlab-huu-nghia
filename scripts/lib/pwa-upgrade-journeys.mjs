// 6.5.2 → 6.5.3 cache upgrade. The built dist/sw.js is temporarily rewritten
// (cache VERSION, or an install that is interrupted) and always restored, so the
// browser runs the genuine install/activate/fetch lifecycle for an "old" 6.5.2
// worker, the new worker, a broken update and a rollback. Request interception
// is not used because Chromium bypasses service workers when it is on.
// Learner data in localStorage must survive every step.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const OLD = 'chemlab-6.5.2-brand-1'
const BROKEN = 'chemlab-6.5.3-broken-test'
const STORE_KEY = 'chemlab-v1-exam'
const EXAM = 'tham-khao-2025-hoa'

export function swVersion(file = new URL('../../public/sw.js', import.meta.url)) {
  return /const VERSION =\s*'([^']+)'/.exec(fs.readFileSync(file, 'utf8'))?.[1] || null
}

const cacheKeys = page => page.evaluate(() => caches.keys())
const onlyNamespace = (keys, prefix) => keys.length > 0 && keys.every(key => key.startsWith(`${prefix}-`))
const learnerData = page => page.evaluate(key => ({
  progress: localStorage.getItem('chemlab-v1-progress'),
  chat: localStorage.getItem('chemlab-v62-ai-session'),
  exam: JSON.parse(localStorage.getItem(key) || 'null')
}), STORE_KEY)

async function update(page) {
  return page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration()
    try {
      await registration.update()
    }
    catch (error) {
      return `update failed: ${error.name}`
    }
    const worker = registration.installing || registration.waiting
    if (worker && worker.state !== 'installed' && worker.state !== 'redundant') {
      await new Promise(resolve => {
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' || worker.state === 'redundant' || worker.state === 'activated') resolve()
        })
        setTimeout(resolve, 10000)
      })
    }
    return registration.waiting ? 'waiting' : registration.installing ? 'installing' : 'none'
  })
}

export async function pwaUpgradeJourneys(browser, baseURL, options) {
  const buildDir = process.env.CHEMLAB_BUILD_DIR
    ? path.resolve(process.env.CHEMLAB_BUILD_DIR)
    : fileURLToPath(new URL('../../dist', import.meta.url))
  const built = path.join(buildDir, 'sw.js')
  const original = fs.readFileSync(built, 'utf8')
  const stage = { name: 'start' }
  try {
    await run(browser, baseURL, options, stage, kind => {
      let body = original
      if (kind === 'old') body = body.replace(/'chemlab-[^']+'/, `'${OLD}'`)
      if (kind === 'broken') body = body.replace(/'chemlab-[^']+'/, `'${BROKEN}'`).replace(/cache\.addAll\(\s*CORE_FILES\s*\)/, "Promise.reject(new Error('install interrupted (test)'))")
      fs.writeFileSync(built, body)
    })
  }
  catch (error) {
    throw new Error(`[${stage.name}] ${error.message.split('\n')[0]}`)
  }
  finally {
    fs.writeFileSync(built, original)
  }
}

async function run(browser, baseURL, { newPage, record }, stage, deploy) {
  const version = swVersion()
  deploy('old')
  const { context, page: initialPage, errors } = await newPage(browser, { width: 1280, height: 800, theme: 'light', serviceWorkers: 'allow' })
  const watch = target => {
    target.on('pageerror', error => errors.push(error.message))
    target.on('console', message => { if (message.type() === 'error' && !/install interrupted|Failed to load resource|ERR_INTERNET_DISCONNECTED/.test(message.text())) errors.push(message.text()) })
  }
  let page = initialPage

  stage.name = '6.5.2 worker installation'
  /* 1. A learner on 6.5.2: an active worker, progress, chat history and a running exam. */
  await page.goto(`${baseURL}/#home`, { waitUntil: 'load' })
  await page.waitForFunction(async () => (await navigator.serviceWorker.getRegistration())?.active?.state === 'activated', null, { timeout: 15000 })
  const activePage = await context.newPage()
  watch(activePage)
  await activePage.goto(`${baseURL}/#home`, { waitUntil: 'load' })
  if (!await activePage.evaluate(() => Boolean(navigator.serviceWorker.controller))) {
    await activePage.reload({ waitUntil: 'load' })
  }
  await activePage.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 15000 })
  await page.close()
  page = activePage
  const legacyState = await page.evaluate(async () => ({
    controlled: Boolean(navigator.serviceWorker.controller),
    active: (await navigator.serviceWorker.getRegistration())?.active?.state || null,
    caches: await caches.keys()
  }))
  record('PWA A: the 6.5.2 worker activates and caches under its own namespace',
    legacyState.controlled && legacyState.active === 'activated' && onlyNamespace(legacyState.caches, OLD), JSON.stringify(legacyState))
  await page.evaluate(() => {
    localStorage.setItem('chemlab-v1-progress', JSON.stringify({ version: 1, marker: 'progress-kept' }))
    localStorage.setItem('chemlab-v62-ai-session', JSON.stringify({ messages: [{ role: 'user', text: 'chat-kept' }] }))
  })
  await page.goto(`${baseURL}/#learning/exam/${EXAM}`, { waitUntil: 'load' })
  await page.waitForSelector('[data-ex-start]')
  await page.click('[data-ex-start]')
  await page.waitForSelector('.ex-workspace')
  await page.check('input[name="ex-tk25-1"][value="A"]')
  await page.waitForFunction(key => JSON.parse(localStorage.getItem(key) || '{}').sessions?.['tham-khao-2025-hoa']?.answers?.['tk25-1'] === 'A', STORE_KEY)
  const before = await learnerData(page)

  stage.name = 'update with tabs open'
  /* 2. 6.5.3 is deployed while the tab is open: the new worker waits, the old tab keeps working. */
  deploy('new')
  const state = await update(page)
  const during = await cacheKeys(page)
  record('PWA E: with a 6.5.2 tab open, 6.5.3 installs and waits instead of taking over (no skipWaiting)',
    state === 'waiting' && during.some(key => key.startsWith(`${OLD}-`)) && during.includes(`${version}-static`), `${state} ${JSON.stringify(during)}`)
  const second = await context.newPage()
  watch(second)
  await second.goto(`${baseURL}/#learning`, { waitUntil: 'load' })
  await second.waitForSelector('#app-shell')
  record('PWA E: a second tab opened during the update still works on the old worker', await second.evaluate(() => Boolean(navigator.serviceWorker.controller) && Boolean(document.querySelector('#app-shell'))))

  stage.name = 'activation'
  /* 3. All 6.5.2 tabs closed → 6.5.3 activates, old caches go, learner data stays. */
  await page.close()
  await second.close()
  const third = await context.newPage()
  watch(third)
  await third.goto(`${baseURL}/#home`, { waitUntil: 'load' })
  await third.waitForFunction(async ([old, current]) => {
    const keys = await caches.keys()
    return keys.length && !keys.some(key => key.startsWith(`${old}-`)) && keys.includes(`${current}-static`)
  }, [OLD, version], { timeout: 30000 }).catch(() => {})
  const afterKeys = await cacheKeys(third)
  const after = await learnerData(third)
  record(`PWA B: after the old tabs close, ${version} activates and the 6.5.2 caches are deleted`, onlyNamespace(afterKeys, version), JSON.stringify(afterKeys))
  const session = after.exam?.sessions?.[EXAM]
  record('PWA C/D: progress, ChemAI chat and the unfinished exam (answer and deadline) survive the upgrade',
    JSON.parse(after.progress || '{}').marker === 'progress-kept' && after.chat === before.chat && session?.status === 'active' && session.answers['tk25-1'] === 'A' && session.deadline === before.exam.sessions[EXAM].deadline,
    JSON.stringify({ progress: after.progress, status: session?.status }))
  await third.goto(`${baseURL}/#learning/exam/${EXAM}`, { waitUntil: 'load' })
  await third.waitForSelector('[data-ex-heading]')
  record('PWA F: reopening after the update offers to resume the running exam', await third.isVisible('a[href$="/take"]') && /Tiếp tục làm bài/.test(await third.textContent('.px-actions')))

  stage.name = 'offline'
  /* 4. Cache a dynamically loaded route, then verify both it and the shell offline. */
  await third.goto(`${baseURL}/#periodic`, { waitUntil: 'load' })
  await third.waitForSelector('.pt-cell', { timeout: 15000 })
  let periodicAssetsCached = false
  try {
    await third.waitForFunction(async () => {
      const assets = [...new Set(
        performance.getEntriesByType('resource')
          .map(entry => entry.name)
          .filter(name => new URL(name).origin === location.origin && new URL(name).pathname.startsWith('/assets/'))
      )]
      return assets.length > 0 && (await Promise.all(assets.map(asset => caches.match(asset)))).every(Boolean)
    }, null, { timeout: 10000 })
    periodicAssetsCached = true
  }
  catch (error) {
    if (error?.name !== 'TimeoutError') throw error
  }
  record('PWA G: the dynamically loaded Periodic workspace assets are cached before offline use', periodicAssetsCached)
  await context.setOffline(true)
  await third.reload({ waitUntil: 'load' })
  const offline = await third.waitForSelector('#app-shell', { timeout: 30000 }).then(() => true).catch(() => false)
  const offlinePeriodic = await third.waitForSelector('.pt-cell', { timeout: 15000 }).then(() => true).catch(() => false)
  await context.setOffline(false)
  record('PWA G: the updated app shell reloads offline', offline)
  record('PWA G: the previously loaded Periodic workspace reopens offline', offlinePeriodic)

  stage.name = 'interrupted update'
  /* 5. A broken deployment (a precache file missing) must not replace the working version. */
  deploy('broken')
  const broken = await update(third)
  await third.reload({ waitUntil: 'load' })
  await third.waitForSelector('#app-shell')
  const brokenKeys = await cacheKeys(third)
  const brokenState = await third.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration()
    return { waiting: Boolean(registration.waiting), controlled: Boolean(navigator.serviceWorker.controller) }
  })
  record('PWA interrupted update: a failed install is discarded, the current version keeps serving with its caches',
    !brokenState.waiting && brokenState.controlled && brokenKeys.includes(`${version}-static`), `${broken} ${JSON.stringify(brokenKeys)}`)

  stage.name = 'rollback'
  /* 6. Rollback to the 6.5.2 cache namespace: data stays, the 6.5.3 caches are replaced. */
  deploy('old')
  const rollbackWorkerEvent = browser.browserType().name() === 'chromium'
    ? context.waitForEvent('serviceworker', { timeout: 30000 })
    : null
  await update(third)
  await third.close()
  let rollbackReady = false
  if (rollbackWorkerEvent) {
    const rollbackWorker = await rollbackWorkerEvent
    rollbackReady = await rollbackWorker.evaluate(async old => {
      const deadline = Date.now() + 30000
      while (Date.now() < deadline) {
        const keys = await caches.keys()
        if (keys.length > 0 && keys.every(key => key.startsWith(`${old}-`))) return true
        await new Promise(resolve => setTimeout(resolve, 50))
      }
      return false
    }, OLD)
  }
  const fourth = await context.newPage()
  watch(fourth)
  await fourth.goto(`${baseURL}/#home`, { waitUntil: 'load' })
  if (!rollbackReady) {
    rollbackReady = await fourth.waitForFunction(async old => {
      const keys = await caches.keys()
      return keys.length > 0 && keys.every(key => key.startsWith(`${old}-`))
    }, OLD, { timeout: 30000 }).then(() => true).catch(error => {
      if (error?.name !== 'TimeoutError') throw error
      return false
    })
  }
  const rolled = await learnerData(fourth)
  const rollbackState = await fourth.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration()
    return {
      controlled: Boolean(navigator.serviceWorker.controller),
      active: registration?.active?.state || null,
      waiting: registration?.waiting?.state || null,
      installing: registration?.installing?.state || null,
      caches: await caches.keys()
    }
  })
  record('PWA H: rolling back to the 6.5.2 namespace keeps learner and exam data; caches switch namespace',
    rollbackReady && onlyNamespace(rollbackState.caches, OLD) && JSON.parse(rolled.progress || '{}').marker === 'progress-kept' && rolled.exam?.sessions?.[EXAM]?.answers?.['tk25-1'] === 'A',
    JSON.stringify({ rollbackReady, ...rollbackState }))
  record('console clean during the PWA upgrade journeys', errors.length === 0, errors.join(' | '))
  await context.close()
}
