// EXR-005 / 6.2 → 6.5 upgrade. The built dist/sw.js is temporarily rewritten
// (cache VERSION, or an install that is interrupted) and always restored, so the
// browser runs the genuine install/activate/fetch lifecycle for an "old" 6.2.0
// worker, the new worker, a broken update and a rollback. Request interception
// is not used because Chromium bypasses service workers when it is on.
// Learner data in localStorage must survive every step.
import fs from 'node:fs'

const OLD = 'chemlab-6.2.0-brand-1'
const BROKEN = 'chemlab-6.5.1-broken-test'
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
  const built = new URL('../../dist/sw.js', import.meta.url)
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
  const { context, page, errors } = await newPage(browser, { width: 1280, height: 800, theme: 'light', serviceWorkers: 'allow' })
  const watch = target => {
    target.on('pageerror', error => errors.push(error.message))
    target.on('console', message => { if (message.type() === 'error' && !/install interrupted|Failed to load resource|ERR_INTERNET_DISCONNECTED/.test(message.text())) errors.push(message.text()) })
  }

  stage.name = '6.2 client'
  /* 1. A learner on 6.2.0: controlled tab, progress, chat history and a running exam. */
  await page.goto(`${baseURL}/#home`, { waitUntil: 'load' })
  await page.waitForFunction(async () => Boolean((await navigator.serviceWorker.getRegistration())?.active), null, { timeout: 30000 })
  await page.reload({ waitUntil: 'load' })
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, { timeout: 30000 })
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
  record('PWA A: a 6.2.0 worker controls the page and caches under its own namespace', onlyNamespace(await cacheKeys(page), OLD), JSON.stringify(await cacheKeys(page)))

  stage.name = 'update with tabs open'
  /* 2. 6.5.0 is deployed while the tab is open: the new worker waits, the old tab keeps working. */
  deploy('new')
  const state = await update(page)
  const during = await cacheKeys(page)
  record('PWA E: with a 6.2 tab open, 6.5.0 installs and waits instead of taking over (no skipWaiting)',
    state === 'waiting' && during.some(key => key.startsWith(`${OLD}-`)) && during.includes(`${version}-static`), `${state} ${JSON.stringify(during)}`)
  const second = await context.newPage()
  watch(second)
  await second.goto(`${baseURL}/#learning`, { waitUntil: 'load' })
  await second.waitForSelector('#app-shell')
  record('PWA E: a second tab opened during the update still works on the old worker', await second.evaluate(() => Boolean(navigator.serviceWorker.controller) && Boolean(document.querySelector('#app-shell'))))

  stage.name = 'activation'
  /* 3. All 6.2 tabs closed → 6.5.0 activates, old caches go, learner data stays. */
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
  record(`PWA B: after the old tabs close, ${version} activates and the 6.2.0 caches are deleted`, onlyNamespace(afterKeys, version), JSON.stringify(afterKeys))
  const session = after.exam?.sessions?.[EXAM]
  record('PWA C/D: progress, ChemAI chat and the unfinished exam (answer and deadline) survive the upgrade',
    JSON.parse(after.progress || '{}').marker === 'progress-kept' && after.chat === before.chat && session?.status === 'active' && session.answers['tk25-1'] === 'A' && session.deadline === before.exam.sessions[EXAM].deadline,
    JSON.stringify({ progress: after.progress, status: session?.status }))
  await third.goto(`${baseURL}/#learning/exam/${EXAM}`, { waitUntil: 'load' })
  await third.waitForSelector('[data-ex-heading]')
  record('PWA F: reopening after the update offers to resume the running exam', await third.isVisible('a[href$="/take"]') && /Tiếp tục làm bài/.test(await third.textContent('.px-actions')))

  stage.name = 'offline'
  /* 4. Offline after the update. */
  await context.setOffline(true)
  await third.reload({ waitUntil: 'load' })
  const offline = await third.waitForSelector('#app-shell', { timeout: 30000 }).then(() => true).catch(() => false)
  await context.setOffline(false)
  record('PWA G: the updated app shell reloads offline', offline)

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
  /* 6. Rollback deployment to the 6.2.0 worker: data stays, the 6.5 caches are replaced. */
  deploy('old')
  await update(third)
  await third.close()
  const fourth = await context.newPage()
  watch(fourth)
  await fourth.goto(`${baseURL}/#home`, { waitUntil: 'load' })
  await fourth.waitForFunction(async old => (await caches.keys()).some(key => key.startsWith(`${old}-`)), OLD, { timeout: 30000 }).catch(() => {})
  const rolled = await learnerData(fourth)
  record('PWA H: rolling back to the 6.2.0 worker keeps learner and exam data; caches switch namespace',
    onlyNamespace(await cacheKeys(fourth), OLD) && JSON.parse(rolled.progress || '{}').marker === 'progress-kept' && rolled.exam?.sessions?.[EXAM]?.answers?.['tk25-1'] === 'A', JSON.stringify(await cacheKeys(fourth)))
  record('console clean during the PWA upgrade journeys', errors.length === 0, errors.join(' | '))
  await context.close()
}
