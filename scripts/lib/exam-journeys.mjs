// Browser journeys for the Exam Workspace, run against the internal fixture
// (enabled per test through the fixture flag). Expected scores are computed
// from the fixture answer key in Node.
import fixture from '../../src/exam/papers/fixture-kiem-thu.js'
import { scoreExam } from '../../src/exam/scoring.js'
import { formatPoints } from '../../src/exam/blueprints.js'

const STORE_KEY = 'chemlab-v1-exam'
const EXAM = '#learning/exam/fixture-kiem-thu'

async function openWithFlag(page, baseURL, hash, { flag = true } = {}) {
  await page.goto(`${baseURL}/#home`, { waitUntil: 'load' })
  await page.evaluate(on => {
    if (on) localStorage.setItem('chemlab-exam-fixtures', '1')
    else localStorage.removeItem('chemlab-exam-fixtures')
  }, flag)
  await page.goto(`${baseURL}/${hash}`, { waitUntil: 'load' })
  await page.waitForSelector('[data-ex-heading]', { timeout: 15000 })
}

async function goTo(page, index) {
  await page.click(`.ex-grid__list [data-ex-go="${index}"]`)
  await page.waitForSelector(`.ex-grid__list [data-ex-go="${index}"][aria-current="step"]`)
}

async function startFresh(page, baseURL) {
  await openWithFlag(page, baseURL, EXAM)
  await page.evaluate(key => localStorage.removeItem(key), STORE_KEY)
  await page.reload({ waitUntil: 'load' })
  await page.waitForSelector('[data-ex-start]')
  await page.click('[data-ex-start]')
  await page.waitForSelector('.ex-workspace [data-ex-heading]')
}

const stored = page => page.evaluate(key => JSON.parse(localStorage.getItem(key) || 'null'), STORE_KEY)

export async function examJourneys(browser, baseURL, { newPage, record }) {
  /* A — catalog, publication gate */
  {
    const { context, page, errors } = await newPage(browser, { width: 1280, height: 900, theme: 'light' })
    await openWithFlag(page, baseURL, '#learning/exam', { flag: false })
    const catalog = await page.evaluate(() => ({
      empty: /Chưa có đề chính thức nào được phép/.test(document.body.innerText),
      fixture: /Đề kiểm thử nội bộ/.test(document.querySelector('.lx-page').innerText),
      pending: document.querySelectorAll('.ex-row.is-pending').length,
      sourceLinks: [...document.querySelectorAll('.ex-row.is-pending a[target="_blank"]')].every(a => a.rel.includes('noopener') && a.href.startsWith('https://')),
      startButtons: document.querySelectorAll('.ex-row:not(.is-pending) a').length
    }))
    record('exam A: without rights no paper is takeable; honest empty state; sources linked', catalog.empty && !catalog.fixture && catalog.pending === 4 && catalog.sourceLinks && catalog.startButtons === 0, JSON.stringify(catalog))
    await page.goto(`${baseURL}/${EXAM}`, { waitUntil: 'load' })
    await page.waitForSelector('[data-ex-heading]')
    record('exam A: a gated paper cannot be opened by URL', /chưa thể làm/.test(await page.textContent('[data-ex-heading]')))
    await page.evaluate(() => localStorage.setItem('chemlab-exam-fixtures', '1'))
    await page.goto(`${baseURL}/#learning/exam`, { waitUntil: 'load' })
    await page.waitForSelector('.ex-row:not(.is-pending) a')
    await page.click('.ex-row:not(.is-pending) a')
    await page.waitForSelector('[data-ex-start]')
    const prep = await page.textContent('.lx-page')
    record('exam A: preparation shows time, parts, scoring and the fixture label', /15 phút/.test(prep) && /Phần II/.test(prep) && /0,1 · 2 ý 0,25/.test(prep) && /không phải đề chính thức/.test(prep) && /tự lưu/.test(prep))
    record('console clean in exam catalog', errors.length === 0, errors.join(' | '))
    await context.close()
  }

  /* B, C, D, F, G, I — take an exam, autosave, timer, theme, results */
  {
    const { context, page, errors } = await newPage(browser, { width: 1280, height: 900, theme: 'light' })
    await startFresh(page, baseURL)
    record('exam B: no hint, solution or AI entry while the exam runs', await page.evaluate(() =>
      !document.querySelector('.px-feedback, .px-solution') &&
      [...document.querySelectorAll('[data-chemai-open]')].every(node => !node.offsetParent) &&
      document.documentElement.dataset.examRunning === 'true'))
    await page.check('input[name="ex-f-1"][value="A"]')
    await page.click('[data-ex-go="1"].ui-btn')
    await page.check('input[name="ex-f-2"][value="A"]')
    await page.click('[data-ex-flag]')
    await goTo(page, 3)
    for (const [id, value] of Object.entries(fixture.sections[1].questions[0].answer)) await page.click(`input[name="ex-f-4-${id}"][value="${value}"] + span`)
    await goTo(page, 4)
    await page.click('input[name="ex-f-5-a"][value="true"] + span')
    await page.click('input[name="ex-f-5-b"][value="true"] + span')
    await page.click('input[name="ex-f-5-c"][value="true"] + span')
    await goTo(page, 5)
    await page.fill('.ex-short', '0.2')
    await goTo(page, 6)
    await page.fill('.ex-short', '2,500')
    const tooLong = await page.textContent('[data-ex-error]')
    await page.fill('.ex-short', '2,5')
    record('exam G: short answer longer than the 4-character grid is flagged while typing', /Tối đa 4/.test(tooLong), tooLong)

    // C/D — reload keeps answers, flags, position and the running clock.
    const before = await page.textContent('[data-ex-clock]')
    await page.waitForTimeout(1500)
    await page.reload({ waitUntil: 'load' })
    await page.waitForSelector('.ex-workspace [data-ex-heading]')
    const after = await page.textContent('[data-ex-clock]')
    const restored = await page.evaluate(() => ({
      heading: document.querySelector('[data-ex-heading]').textContent,
      short: document.querySelector('.ex-short')?.value,
      answered: document.querySelectorAll('.ex-grid__list .is-answered').length,
      flagged: document.querySelectorAll('.ex-grid__list .is-flagged').length
    }))
    const seconds = text => Number(text.split(':')[0]) * 60 + Number(text.split(':')[1])
    record('exam C: reload restores answers, flags and current question', /Câu 7/.test(restored.heading) && restored.short === '2,5' && restored.answered === 6 && restored.flagged === 1, JSON.stringify(restored))
    record('exam D: reload does not reset the timer', seconds(after) < seconds(before) && seconds(after) < 15 * 60, `${before} → ${after}`)
    await goTo(page, 0)
    record('exam C: chosen option restored after reload', await page.isChecked('input[name="ex-f-1"][value="A"]'))

    // I — theme switch keeps the selection.
    await page.click('.app-topbar__theme, [data-theme-toggle] >> visible=true')
    await page.waitForTimeout(200)
    record('exam I: switching theme keeps the selected answer and the session', await page.isChecked('input[name="ex-f-1"][value="A"]') && (await stored(page)).sessions['fixture-kiem-thu'].answers['f-1'] === 'A')

    // Submit confirmation, then a double click on confirm.
    await page.click('.ex-bar [data-ex-submit]')
    await page.waitForSelector('[data-ex-dialog][open]')
    const dialog = await page.evaluate(() => {
      const box = document.querySelector('[data-ex-dialog]').getBoundingClientRect()
      return { text: document.querySelector('[data-ex-dialog-text]').textContent, fits: box.top >= 0 && box.bottom <= innerHeight, focus: document.activeElement?.matches('[data-ex-cancel]') }
    })
    record('exam B: submit asks for confirmation, counts unanswered and flagged, focuses “continue”', /Còn 2 câu chưa trả lời/.test(dialog.text) && /1 câu đang đánh dấu/.test(dialog.text) && dialog.fits && dialog.focus, JSON.stringify(dialog))
    await page.click('[data-ex-cancel]')
    record('exam B: cancelling keeps the exam running', await page.isVisible('.ex-workspace') && !(await page.isVisible('[data-ex-dialog][open]')))
    await page.click('.ex-bar [data-ex-submit]')
    await page.waitForSelector('[data-ex-dialog][open]')
    await page.dblclick('[data-ex-confirm]')
    await page.waitForSelector('.ex-results [data-ex-heading]')

    const expected = scoreExam(fixture, { 'f-1': 'A', 'f-2': 'A', 'f-4': { ...fixture.sections[1].questions[0].answer }, 'f-5': { a: true, b: true, c: true }, 'f-6': '0,2', 'f-7': '2,5' })
    const result = await page.evaluate(() => ({
      heading: document.querySelector('[data-ex-heading]').textContent.replace(/\s+/g, ' '),
      parts: [...document.querySelectorAll('.ex-results table')[0].querySelectorAll('td')].map(td => td.textContent),
      unofficial: /không phải lời giải chính thức/.test(document.querySelector('.ex-review').textContent),
      unverified: /1 câu chưa có thông tin chương/.test(document.body.innerText),
      byLevel: /Vận dụng/.test(document.body.innerText),
      running: document.documentElement.dataset.examRunning
    }))
    record('exam F/G: score matches the answer key (single, true/false partial, short with “.”)',
      result.heading.includes(`${formatPoints(expected.earned)}/${formatPoints(expected.possible)}`) && expected.earned === 200, `${result.heading} expected ${expected.earned}`)
    record('exam F: per-part scores shown', result.parts.join('|') === expected.parts.map(part => `${formatPoints(part.earned)}/${formatPoints(part.possible)}`).join('|'), result.parts.join('|'))
    record('exam F: solutions labelled as not official; unverified metadata disclosed; level analysis', result.unofficial && result.unverified && result.byLevel)
    record('exam: AI entry points return after the exam', result.running === undefined && await page.evaluate(() => [...document.querySelectorAll('[data-chemai-open]')].some(node => node.offsetParent)))
    const data = await stored(page)
    record('exam: double confirm stores exactly one result', data.results.length === 1 && data.sessions['fixture-kiem-thu'].status === 'submitted')
    await page.click('.ex-review__item:nth-child(5) summary')
    record('exam F: review shows statement-by-statement key for true/false', await page.isVisible('.ex-review__item:nth-child(5) .ex-tf'))

    // Reload after submit stays on the result; the workspace route redirects to it.
    await page.goto(`${baseURL}/${EXAM}/take`, { waitUntil: 'load' })
    await page.waitForSelector('.ex-results [data-ex-heading]')
    record('exam: reopening the workspace after submit shows the result, not a new attempt', (await stored(page)).results.length === 1)
    record('console clean in exam journey', errors.length === 0, errors.join(' | '))
    await context.close()
  }

  /* E — time expired while the tab was closed */
  {
    const { context, page, errors } = await newPage(browser, { width: 1280, height: 900, theme: 'dark' })
    await startFresh(page, baseURL)
    await page.check('input[name="ex-f-1"][value="A"]')
    await page.evaluate(key => {
      const data = JSON.parse(localStorage.getItem(key))
      const session = data.sessions['fixture-kiem-thu']
      session.deadline = Date.now() - 1000
      localStorage.setItem(key, JSON.stringify(data))
    }, STORE_KEY)
    await page.reload({ waitUntil: 'load' })
    await page.waitForSelector('.ex-results [data-ex-heading]', { timeout: 10000 })
    const text = await page.textContent('.ex-results')
    record('exam E: an expired session is submitted automatically with its saved answers', /hết giờ, nộp tự động/.test(text) && /0,25\/3,5/.test(text.replace(/\s+/g, '')), text.slice(0, 120))
    record('console clean in exam expiry', errors.length === 0, errors.join(' | '))
    await context.close()
  }

  /* Two tabs, corrupt storage */
  {
    const { context, page, errors } = await newPage(browser, { width: 1280, height: 900, theme: 'light' })
    await startFresh(page, baseURL)
    const other = await context.newPage()
    await other.goto(`${baseURL}/${EXAM}/take`, { waitUntil: 'load' })
    await other.waitForSelector('.ex-workspace [data-ex-heading]')
    await page.check('input[name="ex-f-1"][value="B"]')
    await other.waitForFunction(() => /tab khác/.test(document.querySelector('[data-ex-saved]')?.textContent || ''), null, { timeout: 5000 })
    await other.check('input[name="ex-f-1"][value="A"]')
    await goTo(other, 1)
    await other.check('input[name="ex-f-2"][value="C"]')
    const answers = (await stored(page)).sessions['fixture-kiem-thu'].answers
    record('exam: a second tab syncs and neither tab wipes the other’s answers', answers['f-1'] === 'A' && answers['f-2'] === 'C', JSON.stringify(answers))
    await other.close()

    await page.evaluate(key => localStorage.setItem(key, '{broken'), STORE_KEY)
    await page.goto(`${baseURL}/#learning/exam`, { waitUntil: 'load' })
    await page.waitForSelector('[data-ex-heading]')
    record('exam: corrupt saved data does not break the catalog and is backed up', await page.evaluate(() => Boolean(localStorage.getItem('chemlab-v1-exam-corrupt'))))
    record('console clean with corrupt exam data', errors.length === 0, errors.join(' | '))
    await context.close()
  }

  /* H — 320 / 390 px, both themes */
  for (const [width, theme] of [[320, 'light'], [390, 'dark']]) {
    const { context, page, errors } = await newPage(browser, { width, height: 760, theme })
    await startFresh(page, baseURL)
    await goTo(page, 3)
    const layout = await page.evaluate(() => {
      const scroller = document.querySelector('#workspace-main')
      scroller?.scrollTo(0, 99999)
      window.scrollTo(0, 99999)
      const bar = document.querySelector('.ex-bar').getBoundingClientRect()
      const nav = document.querySelector('.app-bottom-nav, .app-tabbar, nav[aria-label*="Điều hướng"]')?.getBoundingClientRect()
      const lastButton = [...document.querySelectorAll('.ex-grid__list button')].at(-1).getBoundingClientRect()
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        barVisible: bar.top >= -1 && bar.bottom <= 200,
        targets: [...document.querySelectorAll('.ex-grid__list button, .px-tf label span')].every(node => node.getBoundingClientRect().height >= 40),
        lastAboveNav: !nav || lastButton.bottom <= nav.top + 1 || lastButton.bottom <= innerHeight
      }
    })
    record(`exam H @${width} ${theme}: no horizontal overflow, timer bar stays visible, touch targets ≥ 40 px`, !layout.overflow && layout.barVisible && layout.targets, JSON.stringify(layout))
    await page.click('.ex-bar [data-ex-submit]')
    await page.waitForSelector('[data-ex-dialog][open]')
    const fits = await page.evaluate(() => {
      const box = document.querySelector('[data-ex-dialog]').getBoundingClientRect()
      return box.left >= 0 && box.right <= innerWidth && box.top >= 0 && box.bottom <= innerHeight
    })
    record(`exam H @${width} ${theme}: submit dialog fits the screen`, fits)
    await page.click('[data-ex-confirm]')
    await page.waitForSelector('.ex-results [data-ex-heading]')
    record(`exam H @${width} ${theme}: results without horizontal overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    record(`console clean in exam @${width} ${theme}`, errors.length === 0, errors.join(' | '))
    await context.close()
  }

  /* M — cross-module navigation while an exam is running */
  {
    const { context, page, errors } = await newPage(browser, { width: 1280, height: 900, theme: 'light' })
    await startFresh(page, baseURL)
    await page.check('input[name="ex-f-1"][value="D"]')
    await page.goto(`${baseURL}/#lab`, { waitUntil: 'load' })
    await page.waitForTimeout(400)
    const inLab = await page.evaluate(() => document.documentElement.dataset.examRunning)
    await page.goto(`${baseURL}/#learning/exam`, { waitUntil: 'load' })
    await page.waitForSelector('.ex-row:not(.is-pending) a')
    const resume = await page.textContent('.ex-row:not(.is-pending) a')
    await page.click('.ex-row:not(.is-pending) a')
    await page.waitForSelector('[data-ex-heading]')
    await page.click('.px-actions a.ui-btn--primary')
    await page.waitForSelector('.ex-workspace')
    const kept = await page.isChecked('input[name="ex-f-1"][value="D"]')
    await page.goto(`${baseURL}/#learning/practice`, { waitUntil: 'load' })
    await page.waitForSelector('[data-lx-heading]')
    await page.goto(`${baseURL}/#home`, { waitUntil: 'load' })
    await page.waitForTimeout(400)
    record('exam M: Lab → Exam → Practice → Home keeps the attempt and re-enables AI outside the exam',
      inLab === undefined && /Tiếp tục/.test(resume) && kept && await page.evaluate(() => !document.documentElement.dataset.examRunning), JSON.stringify({ inLab, resume, kept }))
    record('console clean across modules with an exam running', errors.length === 0, errors.join(' | '))
    await context.close()
  }
}
