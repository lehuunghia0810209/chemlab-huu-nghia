// Browser journeys for the Practice Workspace. Correct answers come from the
// question bank itself (loaded in Node), keyed by the question id the page
// exposes through window.ChemLabLearning.context().
import { loadQuestionsById } from '../../src/learning/questionBank.js'

async function currentQuestion(page) {
  const id = await page.evaluate(() => window.ChemLabLearning?.context()?.practice?.question?.id)
  if (!id) return null
  const [question] = await loadQuestionsById([id])
  return question
}

async function answer(page, question, { correct = true } = {}) {
  switch (question.type) {
    case 'single': {
      const id = correct ? question.correctAnswer : question.options.find(option => option.id !== question.correctAnswer).id
      await page.check(`.px-option input[value="${id}"]`)
      break
    }
    case 'multiple':
      for (const option of question.options) {
        const want = question.correctAnswer.includes(option.id) === correct
        if (want) await page.check(`.px-option input[value="${option.id}"]`)
      }
      break
    case 'truefalse':
      for (const statement of question.statements) {
        const value = correct ? question.correctAnswer[statement.id] : !question.correctAnswer[statement.id]
        await page.click(`input[name="px-${question.id}-${statement.id}"][value="${value}"] + span`)
      }
      break
    case 'short':
      await page.fill('.px-input', correct ? question.correctAnswer.accepted[0] : 'không biết')
      break
    case 'numeric':
      await page.fill('.px-input', correct ? String(question.correctAnswer.value).replace('.', ',') : '123456')
      break
  }
}

export async function practiceJourneys(browser, baseURL, { newPage, record }) {
  const { context, page, errors } = await newPage(browser, { width: 1280, height: 900, theme: 'light' })

  // Lesson → practice link
  await page.goto(`${baseURL}/#learning/lesson/g10-l2`, { waitUntil: 'load' })
  await page.waitForSelector('#lx-step-title', { timeout: 15000 })
  const last = await page.$$eval('.lx-steps [data-step-index]', nodes => nodes.length - 1)
  await page.click(`.lx-steps [data-step-index="${last}"]`)
  await page.waitForSelector('[data-lesson-practice] a', { timeout: 10000 })
  record('practice: lesson summary links to its practice set', /7 câu hỏi/.test(await page.textContent('[data-lesson-practice]')))
  await page.click('[data-lesson-practice] a')
  await page.waitForSelector('.px-question', { timeout: 10000 })

  // Invalid input is an input error, not a wrong answer
  let total = await page.evaluate(() => window.ChemLabLearning.context().practice.total)
  let numericSeen = false
  let allRight = true
  for (let index = 0; index < total; index += 1) {
    const question = await currentQuestion(page)
    if (question.type === 'numeric' && !numericSeen) {
      numericSeen = true
      await page.fill('.px-input', '1.000.5')
      await page.click('.px-answer button[type="submit"]')
      const state = await page.evaluate(() => ({
        error: document.querySelector('[data-px-input-error]')?.textContent.trim(),
        graded: Boolean(document.querySelector('.px-feedback'))
      }))
      record('practice: unreadable number shows an input error and is not graded', state.error && !state.graded, JSON.stringify(state))
    }
    await answer(page, question)
    await page.click('.px-answer button[type="submit"]')
    await page.waitForSelector('.px-feedback')
    allRight = allRight && await page.evaluate(() => document.querySelector('.px-feedback').classList.contains('is-correct'))
    if (index < total - 1) await page.click('[data-px-next]')
  }
  record('practice: every correct answer from the bank is graded correct in the browser', allRight)
  await page.click('.px-nav [data-px-finish]')
  await page.waitForSelector('.px-results')
  record('practice: result summary shows the full score', (await page.textContent('.px-results h1')).trim() === `Đúng ${total}/${total} câu`)
  await page.reload({ waitUntil: 'load' })
  await page.waitForSelector('.px-results', { timeout: 15000 })
  const stored = await page.evaluate(() => {
    const progress = JSON.parse(localStorage.getItem('chemlab-v1-progress'))
    return { sessions: progress.learning.practice.sessions.length, answers: Object.keys(progress.learning.practice.answers).length }
  })
  record('practice: results and answer history survive reload', stored.sessions === 1 && stored.answers === total, JSON.stringify(stored))

  // Test mode from Practice Home: wrong answers, a skipped question, review
  await page.goto(`${baseURL}/#learning/practice`, { waitUntil: 'load' })
  await page.waitForSelector('[data-px-setup]', { timeout: 15000 })
  await page.selectOption('[name="chapterId"]', 'g10-c1')
  await page.waitForSelector('[name="lessonId"]:not([disabled])')
  await page.selectOption('[name="count"]', '5')
  await page.click('input[name="mode"][value="test"] + span')
  await page.waitForFunction(() => !document.querySelector('[data-px-start]').disabled)
  await page.click('[data-px-start]')
  await page.waitForSelector('.px-question')
  total = 5
  for (let index = 0; index < total; index += 1) {
    const question = await currentQuestion(page)
    if (index > 0) await answer(page, question, { correct: index % 2 === 0 })
    if (index < total - 1) await page.click('[data-px-next]')
  }
  const feedbackHidden = !(await page.$('.px-feedback'))
  await page.click('.px-nav [data-px-finish]')
  await page.waitForSelector('.px-results')
  const tally = await page.$$eval('.px-tally dd', nodes => nodes.map(node => Number(node.textContent)))
  record('practice: test mode hides feedback until submission and counts skipped questions',
    feedbackHidden && tally.join() === '2,2,1', tally.join())
  record('practice: results list lessons to review', await page.$$eval('.px-results .lx-row', nodes => nodes.length) >= 1)

  await page.goto(`${baseURL}/#learning/practice`, { waitUntil: 'load' })
  await page.waitForSelector('[data-px-review]', { timeout: 15000 })
  record('practice: wrong answers are offered for review', /Ôn \d+ câu sai/.test(await page.textContent('[data-px-review]')))

  // Keyboard: choose an option with the keyboard
  await page.goto(`${baseURL}/#learning/practice/lesson/g10-l1`, { waitUntil: 'load' })
  await page.waitForSelector('.px-question', { timeout: 15000 })
  let keyboardOk = false
  for (let index = 0; index < 7 && !keyboardOk; index += 1) {
    const question = await currentQuestion(page)
    if (question.type === 'single') {
      await page.focus('.px-option input')
      await page.keyboard.press('Space')
      await page.keyboard.press('Enter')
      keyboardOk = await page.evaluate(() => Boolean(document.querySelector('.px-feedback')))
    }
    else if (index < 6) await page.click('[data-px-next]')
  }
  record('practice: a single-choice question can be answered and checked with the keyboard', keyboardOk)

  record('console clean in practice journeys', errors.length === 0, errors.join(' | '))
  await context.close()
}
