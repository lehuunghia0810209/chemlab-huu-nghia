// Journey L — written practice with rubric feedback. /api/feedback is mocked in
// the browser (no Gemini key locally): this proves the UI contract, not live AI.
const HASH = '#learning/practice/written/g11-l20-w1'
const ANSWER = 'Hai chất cùng phân tử khối. Ethanol có nhóm OH nên tạo liên kết hydrogen giữa các phân tử, dimethyl ether thì không, nên ethanol sôi cao hơn.'

const FEEDBACK = {
  ok: true,
  label: 'Nhận xét tham khảo',
  feedback: {
    criteria: [
      { id: 'c1', text: 'Cùng phân tử khối', status: 'met', comment: 'Đã nêu.' },
      { id: 'c2', text: 'Liên kết hydrogen của ethanol', status: 'met', comment: 'Đúng.' },
      { id: 'c3', text: 'Ether không có liên kết hydrogen', status: 'partial', comment: 'Nêu rõ vì sao.' },
      { id: 'c4', text: 'Kết luận năng lượng', status: 'missing', comment: '<img src=x onerror=alert(1)>' }
    ],
    mistakes: [],
    suggestions: ['Giải thích vì sao ether không tạo liên kết hydrogen.'],
    summary: 'Bài làm đúng hướng.'
  }
}

async function openWritten(page, baseURL, { enabled, post }) {
  let posts = 0
  await page.route('**/api/feedback', async route => {
    if (route.request().method() === 'GET') return route.fulfill({ json: { ok: true, enabled } })
    posts += 1
    return post(route)
  })
  await page.goto(`${baseURL}/${HASH}`, { waitUntil: 'load' })
  await page.waitForSelector('#wr-answer', { timeout: 15000 })
  await page.waitForFunction(() => !/Đang kiểm tra/.test(document.querySelector('[data-wr-actions]').textContent))
  return () => posts
}

export async function writtenJourneys(browser, baseURL, { newPage, record }) {
  {
    const { context, page, errors } = await newPage(browser, { width: 1280, height: 900, theme: 'light' })
    const posts = await openWritten(page, baseURL, { enabled: true, post: route => route.fulfill({ json: FEEDBACK }) })
    record('ChemAI L: practice home lists rubric tasks', await page.evaluate(async () => {
      location.hash = '#learning/practice'
      await new Promise(resolve => setTimeout(resolve, 600))
      return document.querySelectorAll('.px-written-list a').length >= 3
    }))
    await page.goto(`${baseURL}/${HASH}`, { waitUntil: 'load' })
    await page.waitForSelector('[data-wr-submit]')
    record('ChemAI L: no request is sent before the learner asks', posts() === 0)
    await page.fill('#wr-answer', 'ngắn quá')
    await page.click('[data-wr-submit]')
    record('ChemAI L: too-short answer stopped in the browser', /ít nhất 30/.test(await page.textContent('[data-wr-error]')) && posts() === 0)
    await page.fill('#wr-answer', ANSWER)
    await page.click('[data-wr-submit]')
    await page.waitForSelector('.px-written__feedback')
    const shown = await page.evaluate(() => ({
      label: document.querySelector('.px-written__feedback').textContent.includes('Nhận xét tham khảo'),
      disclaimer: /không phải điểm/.test(document.querySelector('.px-written__feedback').textContent),
      statuses: [...document.querySelectorAll('.px-written__criteria li')].map(li => li.className).join(),
      injected: Boolean(document.querySelector('.px-written__feedback img'))
    }))
    record('ChemAI L: feedback labelled as reference, per criterion, AI text escaped', shown.label && shown.disclaimer && shown.statuses === 'is-met,is-met,is-partial,is-missing' && !shown.injected, JSON.stringify(shown))
    await page.click('[data-wr-submit]')
    record('ChemAI L: client cooldown prevents rapid repeats', /chờ/.test(await page.textContent('[data-wr-error]')) && posts() === 1)
    await page.reload({ waitUntil: 'load' })
    await page.waitForSelector('#wr-answer')
    record('ChemAI L: draft kept after reload', (await page.inputValue('#wr-answer')) === ANSWER)
    record('console clean in written practice', errors.length === 0, errors.join(' | '))
    await context.close()
  }
  {
    const { context, page, errors } = await newPage(browser, { width: 390, height: 844, theme: 'dark' })
    await openWritten(page, baseURL, { enabled: false, post: route => route.fulfill({ status: 503, json: { ok: false } }) })
    const fallback = await page.evaluate(() => ({
      button: Boolean(document.querySelector('[data-wr-submit]')),
      note: /chưa được bật/.test(document.querySelector('[data-wr-actions]').textContent),
      open: document.querySelector('[data-wr-rubric]').open,
      overflow: document.documentElement.scrollWidth > innerWidth
    }))
    record('ChemAI L: disabled server → no AI button, self-check rubric opened, 390 px fits', !fallback.button && fallback.note && fallback.open && !fallback.overflow, JSON.stringify(fallback))
    record('console clean with ChemAI feedback disabled', errors.length === 0, errors.join(' | '))
    await context.close()
  }
  {
    const { context, page, errors } = await newPage(browser, { width: 1280, height: 900, theme: 'dark' })
    await openWritten(page, baseURL, { enabled: true, post: route => route.fulfill({ status: 429, json: { ok: false, code: 'RATE_LIMITED', message: 'Em đang yêu cầu nhận xét quá nhanh.' } }) })
    await page.fill('#wr-answer', ANSWER)
    await page.click('[data-wr-submit]')
    await page.waitForSelector('.px-written__result [role="alert"]')
    record('ChemAI L: server error shown with self-check fallback, button usable again',
      /quá nhanh/.test(await page.textContent('.px-written__result')) && await page.evaluate(() => document.querySelector('[data-wr-rubric]').open) && await page.isEnabled('[data-wr-submit]'))
    record('console clean after ChemAI feedback error', errors.filter(text => !/429/.test(text)).length === 0, errors.join(' | '))
    await context.close()
  }
}
