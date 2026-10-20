// Practice Workspace: Practice Home → Question Workspace (with feedback) →
// Result Summary → review. Questions come from the chapter question bank.
import './practice.css'
import { icon } from '../shell/icons.js'
import { GRADES, getGrade, findLesson } from './catalog.js'
import { escapeHTML, rich } from './format.js'
import { routeHash } from './routes.js'
import { loadQuestions, loadQuestionsById } from './questionBank.js'
import { RUBRICS } from './rubrics.js'
import { DIFFICULTIES, QUESTION_TYPES, evaluate, formatCorrectAnswer } from './answerEngine.js'
import {
  loadSession,
  saveSession,
  recordPracticeAnswer,
  recordPracticeSession,
  readPractice,
  wrongQuestionIds
} from './practiceProgress.js'

const TYPE_HINTS = {
  single: 'Chọn một đáp án.',
  multiple: 'Chọn tất cả đáp án đúng.',
  truefalse: 'Chọn Đúng hoặc Sai cho từng ý.',
  short: 'Nhập câu trả lời ngắn.',
  numeric: 'Nhập kết quả. Dùng dấu phẩy cho số thập phân, ví dụ 2,24.'
}

const LETTERS = 'ABCDEFGH'

function shuffle(list) {
  const copy = [...list]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[other]] = [copy[other], copy[index]]
  }
  return copy
}

function scopeTitle({ grade, chapterId, lessonId, review }) {
  if (review) return 'Ôn lại câu làm sai'
  if (lessonId) {
    const entry = findLesson(lessonId)
    return entry ? `Lớp ${entry.grade.grade} · Bài ${entry.lesson.number}. ${entry.lesson.title}` : 'Luyện tập'
  }
  if (chapterId) {
    const chapter = getGrade(grade)?.chapters.find(item => item.id === chapterId)
    return chapter ? `Lớp ${grade} · Chương ${chapter.number}. ${chapter.title}` : 'Luyện tập'
  }
  return `Lớp ${grade} · Tất cả chương`
}

function responseText(question, response) {
  if (response === undefined || response === null || response === '') return 'Chưa trả lời'
  switch (question.type) {
    case 'single': {
      const index = question.options.findIndex(option => option.id === response)
      return index >= 0 ? `${LETTERS[index]}. ${question.options[index].text}` : 'Chưa trả lời'
    }
    case 'multiple':
      return response.length
        ? response.map(id => {
            const index = question.options.findIndex(option => option.id === id)
            return `${LETTERS[index]}. ${question.options[index].text}`
          }).join('; ')
        : 'Chưa trả lời'
    case 'truefalse':
      return question.statements.map(statement => `${statement.id}) ${response[statement.id] === true ? 'Đúng' : response[statement.id] === false ? 'Sai' : '—'}`).join(' · ')
    default:
      return String(response)
  }
}

function isEmptyResponse(question, response) {
  if (response === undefined || response === null) return true
  if (question.type === 'multiple') return !response.length
  if (question.type === 'truefalse') return !Object.keys(response).length
  return String(response).trim() === ''
}

export function createPractice({ root, announce, scrollToTop, onLegacyTopics }) {
  let active = null // { session, questions }
  let homeState = { grade: 10, chapterId: '', lessonId: '', difficulty: '', mode: 'practice', count: '10' }

  function focusHeading() {
    root.querySelector('[data-lx-heading]')?.focus({ preventScroll: true })
  }

  function crumbs(extra = '') {
    return `
      <nav class="lx-crumbs" aria-label="Vị trí">
        <a href="#learning">${icon('arrowLeft')}Học tập</a>
        ${extra}
      </nav>
    `
  }

  async function render(route, { focus = false } = {}) {
    if (route.view === 'topics') {
      onLegacyTopics()
      return
    }
    if (route.view === 'start') {
      await startFromScope(route)
      return
    }
    if (route.view === 'session') {
      await renderSession({ focus })
      return
    }
    if (route.view === 'written') {
      const { renderWritten } = await import('./writtenPractice.js')
      renderWritten({ root, rubricId: route.id, announce, crumbs, focus, scrollToTop })
      return
    }
    await renderHome({ focus })
  }

  /* ---------- Practice Home ---------- */

  async function renderHome({ focus }) {
    const grade = getGrade(homeState.grade)
    const chapter = grade.chapters.find(item => item.id === homeState.chapterId) || null
    const practice = readPractice()
    const wrong = wrongQuestionIds().length
    const last = practice.sessions[0]

    root.innerHTML = `
      <div class="lx-page">
        ${crumbs()}
        <header class="lx-head">
          <p class="ui-eyebrow">Ngân hàng câu hỏi theo bài</p>
          <h1 class="lx-title" data-lx-heading tabindex="-1">Luyện tập</h1>
          <p class="lx-lead">Chọn phạm vi và cách luyện tập. Mỗi câu đều có đáp án, giải thích và lời giải cho bài tính toán.</p>
        </header>

        <form class="px-setup" data-px-setup>
          <fieldset class="px-field">
            <legend>Lớp</legend>
            <div class="ui-segmented px-segmented">
              ${GRADES.map(item => `
                <label><input type="radio" name="grade" value="${item.grade}"${item.grade === grade.grade ? ' checked' : ''}><span>Lớp ${item.grade}</span></label>
              `).join('')}
            </div>
          </fieldset>

          <div class="px-row">
            <label class="px-field">
              <span class="px-label">Chương</span>
              <select class="ui-select px-select" name="chapterId">
                <option value="">Tất cả chương</option>
                ${grade.chapters.map(item => `<option value="${item.id}"${item.id === homeState.chapterId ? ' selected' : ''}>Chương ${item.number}. ${escapeHTML(item.title)}</option>`).join('')}
              </select>
            </label>
            <label class="px-field">
              <span class="px-label">Bài</span>
              <select class="ui-select px-select" name="lessonId"${chapter ? '' : ' disabled'}>
                <option value="">${chapter ? 'Tất cả bài trong chương' : 'Chọn chương trước'}</option>
                ${(chapter?.lessons || []).map(item => `<option value="${item.id}"${item.id === homeState.lessonId ? ' selected' : ''}>Bài ${item.number}. ${escapeHTML(item.title)}</option>`).join('')}
              </select>
            </label>
          </div>

          <div class="px-row">
            <label class="px-field">
              <span class="px-label">Mức độ</span>
              <select class="ui-select px-select" name="difficulty">
                <option value="">Tất cả mức độ</option>
                ${Object.entries(DIFFICULTIES).map(([id, label]) => `<option value="${id}"${id === homeState.difficulty ? ' selected' : ''}>${label}</option>`).join('')}
              </select>
            </label>
            <label class="px-field">
              <span class="px-label">Số câu</span>
              <select class="ui-select px-select" name="count">
                ${['5', '10', '20', 'all'].map(value => `<option value="${value}"${value === homeState.count ? ' selected' : ''}>${value === 'all' ? 'Tất cả' : `${value} câu`}</option>`).join('')}
              </select>
            </label>
          </div>

          <fieldset class="px-field">
            <legend>Cách làm</legend>
            <div class="px-modes">
              <label class="px-mode">
                <input type="radio" name="mode" value="practice"${homeState.mode === 'practice' ? ' checked' : ''}>
                <span><strong>Luyện tập</strong><small>Kiểm tra và xem giải thích ngay sau mỗi câu.</small></span>
              </label>
              <label class="px-mode">
                <input type="radio" name="mode" value="test"${homeState.mode === 'test' ? ' checked' : ''}>
                <span><strong>Kiểm tra</strong><small>Làm hết rồi nộp bài, xem kết quả và lời giải sau.</small></span>
              </label>
            </div>
          </fieldset>

          <p class="px-available" data-px-available role="status">Đang đếm câu hỏi…</p>
          <div class="px-actions">
            <button class="ui-btn ui-btn--primary ui-btn--lg" type="submit" data-px-start disabled>Bắt đầu ${icon('arrowRight')}</button>
          </div>
        </form>

        <section class="lx-section lx-aside px-more" aria-labelledby="px-more-title">
          <div>
            <h2 class="lx-section__title" id="px-more-title">Ôn lại</h2>
            <p class="lx-section__note">
              ${wrong ? `Có ${wrong} câu em đã làm sai ở lần gần nhất.` : 'Chưa có câu làm sai nào cần ôn.'}
              ${last ? ` Lần luyện gần nhất: ${escapeHTML(last.title)} — đúng ${last.correct}/${last.total}.` : ''}
            </p>
          </div>
          <div class="px-more__actions">
            ${wrong ? `<button class="ui-btn" type="button" data-px-review>Ôn ${wrong} câu sai</button>` : ''}
            <a class="ui-btn ui-btn--ghost" href="${routeHash({ name: 'practice', view: 'topics' })}">Bộ câu hỏi theo chủ đề (bản cũ)</a>
          </div>
        </section>

        <section class="lx-section px-more" aria-labelledby="px-written-title">
          <div>
            <h2 class="lx-section__title" id="px-written-title">Tự luận có tiêu chí</h2>
            <p class="lx-section__note">Viết lời giải, tự đối chiếu với tiêu chí và có thể nhờ ChemAI nhận xét tham khảo.</p>
          </div>
          <ul class="px-written-list">
            ${RUBRICS.map(rubric => `<li><a href="${routeHash({ name: 'practice', view: 'written', id: rubric.id })}">${escapeHTML(rubric.title)}</a></li>`).join('')}
          </ul>
        </section>
      </div>
    `

    const form = root.querySelector('[data-px-setup]')
    form.addEventListener('change', event => {
      const field = event.target.name
      if (field === 'grade') homeState = { ...homeState, grade: Number(event.target.value), chapterId: '', lessonId: '' }
      else if (field === 'chapterId') homeState = { ...homeState, chapterId: event.target.value, lessonId: '' }
      else if (field) homeState = { ...homeState, [field]: event.target.value }
      if (field === 'grade' || field === 'chapterId') {
        void renderHome({ focus: false }).then(() => root.querySelector(`[name="${field}"]${field === 'grade' ? ':checked' : ''}`)?.focus())
        return
      }
      void updateAvailable()
    })
    form.addEventListener('submit', event => {
      event.preventDefault()
      void startFromHome()
    })
    root.querySelector('[data-px-review]')?.addEventListener('click', () => void startReview())

    if (focus) {
      scrollToTop()
      focusHeading()
    }
    await updateAvailable()
  }

  async function candidates() {
    const { grade, chapterId, lessonId, difficulty } = homeState
    let questions = []
    try {
      questions = await loadQuestions({ grade, chapterId: chapterId || null, lessonId: lessonId || null })
    }
    catch (error) {
      console.error('[ChemLab Practice] Không tải được câu hỏi:', error)
      return null
    }
    return difficulty ? questions.filter(question => question.difficulty === difficulty) : questions
  }

  async function updateAvailable() {
    const status = root.querySelector('[data-px-available]')
    const start = root.querySelector('[data-px-start]')
    if (!status) return
    const questions = await candidates()
    if (!root.contains(status)) return
    if (questions === null) {
      status.textContent = 'Không tải được câu hỏi. Kiểm tra kết nối mạng rồi thử lại.'
      start.disabled = true
      return
    }
    status.textContent = questions.length
      ? `Có ${questions.length} câu phù hợp.`
      : 'Chưa có câu hỏi cho phạm vi này. Hãy chọn chương hoặc mức độ khác.'
    start.disabled = !questions.length
  }

  function newSession({ title, mode, questions, config }) {
    return {
      version: 1,
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      mode,
      config,
      questionIds: questions.map(question => question.id),
      index: 0,
      responses: {},
      results: {},
      startedAt: new Date().toISOString(),
      finishedAt: null
    }
  }

  function begin(session, questions) {
    active = { session, questions }
    saveSession(session)
    if (location.hash === '#learning/practice/session') void renderSession({ focus: true })
    else location.hash = '#learning/practice/session'
  }

  async function startFromHome() {
    const questions = await candidates()
    if (!questions?.length) return
    const picked = shuffle(questions)
    const count = homeState.count === 'all' ? picked.length : Number(homeState.count)
    const chosen = picked.slice(0, count)
    const config = { grade: homeState.grade, chapterId: homeState.chapterId || null, lessonId: homeState.lessonId || null, difficulty: homeState.difficulty || null }
    begin(newSession({ title: scopeTitle(config), mode: homeState.mode, questions: chosen, config }), chosen)
  }

  async function startReview() {
    const questions = shuffle(await loadQuestionsById(wrongQuestionIds())).slice(0, 20)
    if (!questions.length) return
    begin(newSession({ title: 'Ôn lại câu làm sai', mode: 'practice', questions, config: { review: true } }), questions)
  }

  async function startFromScope(route) {
    const entry = route.scope === 'lesson' ? findLesson(route.id) : null
    const chapter = route.scope === 'chapter'
      ? GRADES.flatMap(grade => grade.chapters).find(item => item.id === route.id)
      : null
    if (!entry && !chapter) {
      renderMessage('Không tìm thấy phạm vi luyện tập', 'Liên kết có thể đã cũ. Hãy chọn lại trong trang Luyện tập.')
      return
    }
    const config = entry
      ? { grade: entry.grade.grade, chapterId: entry.chapter.id, lessonId: entry.lesson.id }
      : { grade: chapter.grade, chapterId: chapter.id, lessonId: null }
    let questions = []
    try {
      questions = await loadQuestions(config)
    }
    catch (error) {
      console.error('[ChemLab Practice] Không tải được câu hỏi:', error)
    }
    if (!questions.length) {
      renderMessage('Chưa có câu hỏi', 'Phạm vi này chưa có câu hỏi luyện tập. Hãy chọn phạm vi khác.')
      return
    }
    const chosen = shuffle(questions).slice(0, 20)
    const session = newSession({ title: scopeTitle(config), mode: 'practice', questions: chosen, config })
    active = { session, questions: chosen }
    saveSession(session)
    history.replaceState(null, '', '#learning/practice/session')
    await renderSession({ focus: true })
  }

  function renderMessage(title, text) {
    root.innerHTML = `
      <div class="lx-page">
        ${crumbs(`<a href="#learning/practice">Luyện tập</a>`)}
        <div class="lx-message" role="alert">
          <h1 class="lx-title" data-lx-heading tabindex="-1">${escapeHTML(title)}</h1>
          <p class="lx-lead">${escapeHTML(text)}</p>
          <div class="lx-message__actions"><a class="ui-btn ui-btn--primary" href="#learning/practice">Về trang Luyện tập</a></div>
        </div>
      </div>
    `
    focusHeading()
  }

  /* ---------- Workspace ---------- */

  async function ensureActive() {
    if (active) return true
    const session = loadSession()
    if (!session) return false
    let questions = []
    try {
      questions = await loadQuestionsById(session.questionIds)
    }
    catch (error) {
      console.error('[ChemLab Practice] Không tải được câu hỏi:', error)
      return false
    }
    // Questions removed from the bank since the session started are dropped.
    session.questionIds = questions.map(question => question.id)
    if (!questions.length) return false
    session.index = Math.min(Math.max(0, Number(session.index) || 0), questions.length - 1)
    session.responses = session.responses && typeof session.responses === 'object' ? session.responses : {}
    session.results = session.results && typeof session.results === 'object' ? session.results : {}
    active = { session, questions }
    return true
  }

  async function renderSession({ focus }) {
    if (!(await ensureActive())) {
      renderMessage('Không có bài luyện tập đang làm', 'Hãy chọn phạm vi và bắt đầu một lượt luyện tập mới.')
      return
    }
    if (active.session.finishedAt) renderResults({ focus })
    else renderQuestion({ focus })
  }

  function persist() {
    saveSession(active.session)
  }

  function currentQuestion() {
    return active.questions[active.session.index]
  }

  function renderQuestion({ focus = false, focusSelector = null } = {}) {
    const { session, questions } = active
    const question = currentQuestion()
    const result = session.results[question.id]
    const locked = session.mode === 'practice' && result && result.kind !== 'invalid'
    const answered = questions.filter(item => session.results[item.id]?.kind && session.results[item.id].kind !== 'invalid').length
    const isLast = session.index === questions.length - 1
    const lesson = findLesson(question.lessonId)

    root.innerHTML = `
      <div class="lx-page px-workspace">
        ${crumbs(`<a href="#learning/practice">Luyện tập</a>`)}
        <header class="px-head">
          <p class="ui-eyebrow">${session.mode === 'test' ? 'Kiểm tra' : 'Luyện tập'} · ${escapeHTML(session.title)}</p>
          <div class="px-head__row">
            <h1 class="px-counter" data-lx-heading tabindex="-1">Câu ${session.index + 1}<span>/${questions.length}</span></h1>
            <button class="ui-btn ui-btn--sm" type="button" data-px-finish>${session.mode === 'test' ? 'Nộp bài' : 'Kết thúc'}</button>
          </div>
          <div class="lx-meter" role="progressbar" aria-label="Số câu đã ${session.mode === 'test' ? 'trả lời' : 'kiểm tra'}" aria-valuemin="0" aria-valuemax="${questions.length}" aria-valuenow="${session.mode === 'test' ? Object.keys(session.responses).length : answered}">
            <span style="width:${Math.round((session.mode === 'test' ? Object.keys(session.responses).length : answered) / questions.length * 100)}%"></span>
          </div>
        </header>

        <section class="px-question" aria-labelledby="px-q-title">
          <p class="px-question__meta">
            <span class="lx-status">${DIFFICULTIES[question.difficulty]}</span>
            <span>${QUESTION_TYPES[question.type]}</span>
            ${lesson ? `<span>Bài ${lesson.lesson.number}. ${escapeHTML(lesson.lesson.title)}</span>` : ''}
          </p>
          <div class="px-question__content" id="px-q-title">${rich(question.content)}</div>
          <p class="px-hint" id="px-hint">${TYPE_HINTS[question.type]}</p>
          <form class="px-answer" data-px-answer novalidate>
            ${renderInput(question, session.responses[question.id], { locked, showTruth: locked })}
            <p class="px-input-error" data-px-input-error role="alert">${result?.kind === 'invalid' ? escapeHTML(result.message) : ''}</p>
            ${session.mode === 'practice' && !locked
              ? '<div class="px-actions"><button class="ui-btn ui-btn--primary" type="submit">Kiểm tra</button></div>'
              : ''}
          </form>
          ${locked ? renderFeedback(question, session.responses[question.id], result) : ''}
        </section>

        <nav class="px-nav" aria-label="Chuyển câu">
          ${session.index > 0 ? `<button class="ui-btn ui-btn--ghost" type="button" data-px-prev>${icon('arrowLeft')}Câu trước</button>` : '<span></span>'}
          ${isLast
            ? `<button class="ui-btn ui-btn--primary" type="button" data-px-finish>${session.mode === 'test' ? 'Nộp bài' : 'Xem kết quả'} ${icon('arrowRight')}</button>`
            : `<button class="ui-btn ${locked || session.mode === 'test' ? 'ui-btn--primary' : ''}" type="button" data-px-next>Câu tiếp ${icon('arrowRight')}</button>`}
        </nav>

        <details class="px-palette">
          <summary>Danh sách câu (${questions.length})</summary>
          <ol>
            ${questions.map((item, index) => {
              const itemResult = session.results[item.id]
              const state = session.mode === 'practice' && itemResult && itemResult.kind !== 'invalid'
                ? (itemResult.correct ? 'is-correct' : 'is-wrong')
                : session.responses[item.id] !== undefined ? 'is-answered' : ''
              const label = state === 'is-correct' ? 'đúng' : state === 'is-wrong' ? 'sai' : state === 'is-answered' ? 'đã trả lời' : 'chưa làm'
              return `<li><button type="button" class="${state}" data-px-goto="${index}"${index === session.index ? ' aria-current="step"' : ''} aria-label="Câu ${index + 1}, ${label}">${index + 1}</button></li>`
            }).join('')}
          </ol>
        </details>
      </div>
    `

    bindQuestion(question)
    if (focus) {
      scrollToTop()
      focusHeading()
    }
    if (focusSelector) root.querySelector(focusSelector)?.focus()
  }

  function renderInput(question, response, { locked = false, showTruth = false } = {}) {
    const name = `px-${question.id}`
    const disabled = locked ? ' disabled' : ''
    const optionState = option => {
      if (!showTruth) return ''
      const correct = question.type === 'single' ? option.id === question.correctAnswer : question.correctAnswer.includes(option.id)
      const chosen = question.type === 'single' ? response === option.id : (response || []).includes(option.id)
      return correct ? ' is-correct' : chosen ? ' is-wrong' : ''
    }

    switch (question.type) {
      case 'single':
      case 'multiple': {
        const type = question.type === 'single' ? 'radio' : 'checkbox'
        return `
          <fieldset class="px-options" aria-describedby="px-hint"${disabled}>
            <legend class="sr-only">Các lựa chọn</legend>
            ${question.options.map((option, index) => {
              const checked = question.type === 'single' ? response === option.id : (response || []).includes(option.id)
              return `
                <label class="px-option${optionState(option)}">
                  <input type="${type}" name="${name}" value="${escapeHTML(option.id)}"${checked ? ' checked' : ''}>
                  <span class="lx-option__letter" aria-hidden="true">${LETTERS[index]}</span>
                  <span>${rich(option.text)}</span>
                </label>
              `
            }).join('')}
          </fieldset>
        `
      }
      case 'truefalse':
        return `
          <div class="px-statements">
            ${question.statements.map(statement => {
              const value = response?.[statement.id]
              const truth = question.correctAnswer[statement.id]
              const state = showTruth ? (value === truth ? ' is-correct' : ' is-wrong') : ''
              return `
                <fieldset class="px-statement${state}"${disabled}>
                  <legend><span class="px-statement__id">${escapeHTML(statement.id)})</span> ${rich(statement.text)}</legend>
                  <div class="px-tf">
                    <label><input type="radio" name="${name}-${escapeHTML(statement.id)}" value="true"${value === true ? ' checked' : ''}><span>Đúng</span></label>
                    <label><input type="radio" name="${name}-${escapeHTML(statement.id)}" value="false"${value === false ? ' checked' : ''}><span>Sai</span></label>
                  </div>
                  ${showTruth ? `<p class="px-statement__truth">${truth ? 'Đúng' : 'Sai'} — ${rich(statement.explanation)}</p>` : ''}
                </fieldset>
              `
            }).join('')}
          </div>
        `
      case 'short':
      case 'numeric': {
        const unit = question.type === 'numeric' ? question.correctAnswer.unit : null
        return `
          <div class="px-text">
            <label class="px-label" for="${name}">${question.type === 'numeric' ? 'Kết quả' : 'Câu trả lời'}</label>
            <div class="px-text__row">
              <input class="ui-input px-input" id="${name}" name="${name}" type="text" autocomplete="off" spellcheck="false"
                ${question.type === 'numeric' ? 'inputmode="decimal"' : ''} aria-describedby="px-hint${unit ? ` ${name}-unit` : ''}"
                value="${escapeHTML(response ?? '')}"${disabled}>
              ${unit ? `<span class="px-unit" id="${name}-unit">Đơn vị: ${escapeHTML(unit)}</span>` : ''}
            </div>
            ${question.placeholder ? `<p class="px-hint">${escapeHTML(question.placeholder)}</p>` : ''}
          </div>
        `
      }
      default:
        return ''
    }
  }

  function renderFeedback(question, response, result) {
    const wrongOption = question.type === 'single' && !result.correct
      ? question.options.find(option => option.id === response)
      : null
    const wrongMulti = question.type === 'multiple' && !result.correct
      ? question.options.filter(option => (response || []).includes(option.id) !== question.correctAnswer.includes(option.id) && option.feedback)
      : []
    return `
      <div class="px-feedback ${result.correct ? 'is-correct' : 'is-wrong'}">
        <p class="px-feedback__verdict">
          ${result.correct ? `${icon('check')}Chính xác` : 'Chưa đúng'}${result.detail ? ` · ${escapeHTML(result.detail)}` : ''}
        </p>
        ${result.note ? `<p class="px-feedback__note">${escapeHTML(result.note)}</p>` : ''}
        ${question.type !== 'truefalse' ? `<p><strong>Đáp án đúng:</strong> ${rich(formatCorrectAnswer(question))}</p>` : ''}
        ${wrongOption?.feedback ? `<p><strong>Vì sao ${LETTERS[question.options.indexOf(wrongOption)]} sai:</strong> ${rich(wrongOption.feedback)}</p>` : ''}
        ${wrongMulti.map(option => `<p><strong>${LETTERS[question.options.indexOf(option)]}:</strong> ${rich(option.feedback)}</p>`).join('')}
        <p>${rich(question.explanation)}</p>
        ${question.solution?.length ? `
          <p class="px-feedback__label">Lời giải</p>
          <ol class="px-solution">${question.solution.map(step => `<li>${rich(step)}</li>`).join('')}</ol>
        ` : ''}
      </div>
    `
  }

  function readResponse(question, form) {
    const name = `px-${question.id}`
    switch (question.type) {
      case 'single':
        return form.querySelector(`input[name="${CSS.escape(name)}"]:checked`)?.value
      case 'multiple':
        return [...form.querySelectorAll(`input[name="${CSS.escape(name)}"]:checked`)].map(input => input.value)
      case 'truefalse': {
        const value = {}
        for (const statement of question.statements) {
          const input = form.querySelector(`input[name="${CSS.escape(`${name}-${statement.id}`)}"]:checked`)
          if (input) value[statement.id] = input.value === 'true'
        }
        return value
      }
      default:
        return form.querySelector(`input[name="${CSS.escape(name)}"]`)?.value ?? ''
    }
  }

  function storeResponse(question, form) {
    const response = readResponse(question, form)
    if (isEmptyResponse(question, response)) delete active.session.responses[question.id]
    else active.session.responses[question.id] = response
    // Editing an unchecked or invalid answer clears its old error.
    if (active.session.results[question.id]?.kind === 'invalid') delete active.session.results[question.id]
    persist()
  }

  function checkCurrent() {
    const question = currentQuestion()
    const response = active.session.responses[question.id]
    const result = evaluate(question, response)
    const error = root.querySelector('[data-px-input-error]')
    if (result.kind === 'invalid') {
      error.textContent = result.message
      root.querySelector('.px-answer input:not([type="hidden"])')?.focus()
      return
    }
    active.session.results[question.id] = result
    persist()
    recordPracticeAnswer(question, result)
    announce(result.correct ? 'Chính xác.' : 'Chưa đúng. Xem đáp án và giải thích.')
    renderQuestion({ focusSelector: '.px-feedback__verdict' })
  }

  // In test mode a readable answer is required before leaving a question,
  // so input mistakes are fixed now instead of counting as wrong answers.
  function canLeaveTestQuestion() {
    if (active.session.mode !== 'test') return true
    const question = currentQuestion()
    const response = active.session.responses[question.id]
    if (isEmptyResponse(question, response)) return true
    const result = evaluate(question, response)
    if (result.kind !== 'invalid' || question.type === 'truefalse') return true
    root.querySelector('[data-px-input-error]').textContent = `${result.message} Sửa lại hoặc xóa câu trả lời để bỏ qua.`
    root.querySelector('.px-answer input')?.focus()
    return false
  }

  function goTo(index) {
    if (!canLeaveTestQuestion()) return
    active.session.index = Math.max(0, Math.min(active.questions.length - 1, index))
    persist()
    renderQuestion({ focus: true })
  }

  function bindQuestion(question) {
    const form = root.querySelector('[data-px-answer]')
    form.addEventListener('change', () => storeResponse(question, form))
    form.addEventListener('input', event => {
      if (event.target.matches('.px-input')) storeResponse(question, form)
    })
    form.addEventListener('submit', event => {
      event.preventDefault()
      if (active.session.mode === 'practice') checkCurrent()
      else goTo(active.session.index + 1)
    })
    root.querySelector('[data-px-prev]')?.addEventListener('click', () => goTo(active.session.index - 1))
    root.querySelector('[data-px-next]')?.addEventListener('click', () => goTo(active.session.index + 1))
    root.querySelectorAll('[data-px-goto]').forEach(button => {
      button.addEventListener('click', () => goTo(Number(button.dataset.pxGoto)))
    })
    root.querySelectorAll('[data-px-finish]').forEach(button => button.addEventListener('click', finish))
  }

  function finish() {
    if (!canLeaveTestQuestion()) return
    const { session, questions } = active
    const unanswered = questions.filter(question => !session.results[question.id] || session.results[question.id].kind === 'invalid')
    if (session.mode === 'test') {
      for (const question of unanswered) {
        const response = session.responses[question.id]
        if (isEmptyResponse(question, response)) continue
        const result = evaluate(question, response)
        if (result.kind === 'invalid') continue
        session.results[question.id] = result
        recordPracticeAnswer(question, result)
      }
    }
    else if (unanswered.length && !window.confirm(`Còn ${unanswered.length} câu chưa kiểm tra. Kết thúc lượt luyện tập?`)) {
      return
    }
    session.finishedAt = new Date().toISOString()
    const correct = questions.filter(question => session.results[question.id]?.correct).length
    recordPracticeSession({ title: session.title, mode: session.mode, total: questions.length, correct })
    persist()
    renderResults({ focus: true })
  }

  /* ---------- Results & review ---------- */

  function renderResults({ focus }) {
    const { session, questions } = active
    const graded = question => session.results[question.id] && session.results[question.id].kind !== 'invalid'
    const correct = questions.filter(question => session.results[question.id]?.correct)
    const wrong = questions.filter(question => graded(question) && !session.results[question.id].correct)
    const skipped = questions.filter(question => !graded(question))
    const percent = Math.round(correct.length / questions.length * 100)
    const lessonsToReview = [...new Set(wrong.concat(skipped).map(question => question.lessonId))]
      .map(findLesson).filter(Boolean)

    root.innerHTML = `
      <div class="lx-page px-results">
        ${crumbs(`<a href="#learning/practice">Luyện tập</a>`)}
        <header class="lx-head">
          <p class="ui-eyebrow">Kết quả · ${escapeHTML(session.title)}</p>
          <h1 class="lx-title" data-lx-heading tabindex="-1">Đúng ${correct.length}/${questions.length} câu</h1>
          <div class="lx-meter px-score" role="progressbar" aria-label="Tỉ lệ câu đúng" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div>
          <dl class="px-tally">
            <div><dt>Đúng</dt><dd>${correct.length}</dd></div>
            <div><dt>Sai</dt><dd>${wrong.length}</dd></div>
            <div><dt>Chưa làm</dt><dd>${skipped.length}</dd></div>
          </dl>
        </header>

        ${lessonsToReview.length ? `
          <section class="lx-section" aria-labelledby="px-review-lessons">
            <h2 class="lx-section__title" id="px-review-lessons">Nội dung cần ôn lại</h2>
            <ul class="lx-list">
              ${lessonsToReview.map(({ lesson, grade }) => `
                <li><a class="lx-row" href="${routeHash({ name: 'lesson', lessonId: lesson.id })}">
                  <span class="lx-row__num">Lớp ${grade.grade} · Bài ${lesson.number}</span>
                  <span class="lx-row__title">${escapeHTML(lesson.title)}</span>
                  <span class="lx-row__meta"></span>
                  ${icon('chevronRight', 'ui-icon lx-chevron')}
                </a></li>
              `).join('')}
            </ul>
          </section>
        ` : ''}

        <div class="px-actions px-actions--results">
          <button class="ui-btn ui-btn--primary" type="button" data-px-retry>Làm lại lượt này</button>
          ${wrong.length || skipped.length ? `<button class="ui-btn" type="button" data-px-retry-wrong>Làm lại ${wrong.length + skipped.length} câu chưa đúng</button>` : ''}
          <a class="ui-btn ui-btn--ghost" href="#learning/practice">Lượt luyện tập mới</a>
        </div>

        <section class="lx-section" aria-labelledby="px-review-title">
          <h2 class="lx-section__title" id="px-review-title">Xem lại lời giải</h2>
          <ol class="px-review">
            ${questions.map((question, index) => {
              const result = session.results[question.id]
              const state = graded(question) ? (result.correct ? 'is-correct' : 'is-wrong') : 'is-skipped'
              const label = state === 'is-correct' ? 'Đúng' : state === 'is-wrong' ? 'Sai' : 'Chưa làm'
              return `
                <li class="px-review__item ${state}">
                  <details${state !== 'is-correct' && wrong.length + skipped.length <= 5 ? ' open' : ''}>
                    <summary><span class="px-review__mark">${label}</span> Câu ${index + 1}. ${escapeHTML(question.content.replace(/\*\*/g, '').slice(0, 90))}${question.content.length > 90 ? '…' : ''}</summary>
                    <div class="px-review__body">
                      <p>${rich(question.content)}</p>
                      <p><strong>Em trả lời:</strong> ${rich(responseText(question, session.responses[question.id]))}</p>
                      ${graded(question)
                        ? renderFeedback(question, session.responses[question.id], result)
                        : `<p><strong>Đáp án đúng:</strong> ${rich(formatCorrectAnswer(question))}</p><p>${rich(question.explanation)}</p>`}
                    </div>
                  </details>
                </li>
              `
            }).join('')}
          </ol>
        </section>
      </div>
    `

    root.querySelector('[data-px-retry]').addEventListener('click', () => {
      begin(newSession({ title: session.title, mode: session.mode, questions, config: session.config }), questions)
    })
    root.querySelector('[data-px-retry-wrong]')?.addEventListener('click', () => {
      const retry = wrong.concat(skipped)
      begin(newSession({ title: `${session.title} · làm lại`, mode: session.mode, questions: retry, config: session.config }), retry)
    })

    if (focus) {
      scrollToTop()
      focusHeading()
    }
  }

  function context() {
    if (!active) return { view: 'practice-home' }
    const question = active.session.finishedAt ? null : currentQuestion()
    return {
      view: active.session.finishedAt ? 'practice-results' : 'practice-question',
      title: active.session.title,
      mode: active.session.mode,
      index: active.session.index + 1,
      total: active.questions.length,
      question: question ? { id: question.id, type: question.type, content: question.content, lessonId: question.lessonId } : null,
      topicName: active.session.title
    }
  }

  return { render, context }
}
