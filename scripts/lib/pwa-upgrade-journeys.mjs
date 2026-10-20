// EXR-005: cache migration on a version change. A fresh service-worker install
// runs the real `activate` handler of public/sw.js, which must delete caches of
// older releases and never touch learner data in localStorage.
import fs from 'node:fs'

const OLD = 'chemlab-6.1.0-legacy'

export function swVersion(file = new URL('../../public/sw.js', import.meta.url)) {
  return /const VERSION =\s*'([^']+)'/.exec(fs.readFileSync(file, 'utf8'))?.[1] || null
}

export async function pwaUpgradeJourneys(browser, baseURL, { newPage, record }) {
  const version = swVersion()
  const { context, page, errors } = await newPage(browser, { width: 1280, height: 800, theme: 'light', serviceWorkers: 'allow' })
  await page.goto(`${baseURL}/#home`, { waitUntil: 'load' })
  await page.waitForFunction(async () => Boolean(await navigator.serviceWorker?.getRegistration()), null, { timeout: 15000 })

  // A learner arriving from an older release: old caches and stored progress.
  await page.evaluate(async old => {
    for (const registration of await navigator.serviceWorker.getRegistrations()) await registration.unregister()
    for (const key of await caches.keys()) await caches.delete(key)
    await (await caches.open(`${old}-static`)).put('/legacy-asset.js', new Response('old'))
    await caches.open(`${old}-runtime`)
    localStorage.setItem('chemlab-v1-progress', JSON.stringify({ version: 1, marker: 'progress-kept' }))
    localStorage.setItem('chemlab-v1-exam', JSON.stringify({ version: 1, sessions: {}, results: [{ id: 'r-keep' }] }))
  }, OLD)

  // The new release installs and activates.
  await page.evaluate(async () => {
    await navigator.serviceWorker.register('/sw.js')
    await navigator.serviceWorker.ready
  })
  await page.waitForFunction(async old => !(await caches.keys()).some(key => key.startsWith(old)), OLD, { timeout: 15000 }).catch(() => {})
  const after = await page.evaluate(async () => ({
    keys: await caches.keys(),
    progress: localStorage.getItem('chemlab-v1-progress'),
    exam: localStorage.getItem('chemlab-v1-exam')
  }))
  record(`PWA upgrade: activate deletes older-release caches and keeps only ${version}-*`,
    Boolean(version) && after.keys.length > 0 && after.keys.every(key => key.startsWith(`${version}-`)), JSON.stringify(after.keys))
  record('PWA upgrade: learner progress and exam data survive the cache migration',
    /progress-kept/.test(after.progress || '') && /r-keep/.test(after.exam || ''))
  record('console clean during PWA upgrade', errors.length === 0, errors.join(' | '))
  await context.close()
}
