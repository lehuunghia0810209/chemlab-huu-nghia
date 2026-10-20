// Exam Workspace: Catalog → Preparation → Workspace (+ submit confirmation) →
// Results. Scoring, timing and storage live in scoring.js / session.js; this
// file only renders. No hints, solutions or AI appear while an exam is running.
import '../learning/practice.css'
import './exam.css'
import { icon } from '../shell/icons.js'
import { GRADES } from '../learning/catalog.js'
import { escapeHTML, rich } from '../learning/format.js'
import { routeHash } from '../learning/routes.js'
import { getBlueprint, formatPoints } from './blueprints.js'
import { analyse, scoreExam, validateShortAnswer, normalizeShortAnswer } from './scoring.js'
import { validatePaper, LEVELS } from './validate.js'
import { visibleExams, findExam, isTakeable, loadPaper } from './catalog.js'
import { createExamStore, STORE_KEY } from './session.js'

const KIND_LABEL = {
  'official-reference': 'Đề tham khảo / minh họa của Bộ GD&ĐT',
  'official-exam': 'Đề thi chính thức của Bộ GD&ĐT',
  'provincial-exam': 'Đề khảo sát của Sở GD&ĐT (không phải đề của Bộ)',
  'teacher-practice': 'Đề ôn luyện do giáo viên biên soạn (không phải đề chính thức)',
  fixture: 'Đề kiểm thử nội bộ'
}

const KEY_BADGE = { official: 'Đáp án chính thức', author: 'Đáp án của tác giả đề' }
const KEY_TEXT = {
  official: 'Theo đáp án chính thức do đơn vị ra đề công bố.',
  author: 'Theo đáp án của tác giả đề, ChemLab đã giải lại để đối chiếu.',
  chemlab: 'Do ChemLab biên soạn, chưa có đáp án chính thức.'
}

const CHAPTERS = new Map(GRADES.flatMap(grade => grade.chapters.map(chapter => [chapter.id, { grade: grade.grade, chapter }])))
const CHAPTER_IDS = new Set(CHAPTERS.keys())

const STATUS_LABEL = { correct: 'Đúng', partial: 'Đúng một phần', wrong: 'Sai', unanswered: 'Chưa trả lời', invalid: 'Không hợp lệ' }

function clockText(ms) {
  const total = Math.ceil(ms / 1000)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function timeText(timestamp) {
  return new Date(timestamp).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Paper text: escaped, **bold**, and _{sub} / ^{sup} for notation such as Δ_{f}H°_{298}.
function examText(text) {
  return rich(text).replace(/_\{([^}]*)\}/g, '<sub>$1</sub>').replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>')
}

function equationHTML(block) {
  const text = examText(block.text)
  if (!block.condition) return `<p class="ex-eq">${text}</p>`
  // The reaction condition sits above the arrow, as in the printed paper.
  const symbol = text.includes('⇌') ? '⇌' : '→'
  const arrow = `<span class="ex-arrow"><span class="ex-arrow__cond">${examText(block.condition)}</span><span aria-hidden="true">${symbol === '⇌' ? '⇌' : '⟶'}</span><span class="sr-only"> (${symbol === '⇌' ? 'thuận nghịch, ' : ''}điều kiện: ${escapeHTML(block.condition)}) </span></span>`
  return `<p class="ex-eq">${text.replace(symbol, arrow)}</p>`
}

export function renderContent(content) {
  if (typeof content === 'string') return `<p>${examText(content)}</p>`
  return content.map(block => {
    if (block.type === 'p') return `<p>${examText(block.text)}</p>`
    if (block.type === 'list') return `<ul class="ex-content-list">${block.items.map(item => `<li>${examText(item)}</li>`).join('')}</ul>`
    if (block.type === 'equation') return equationHTML(block)
    if (block.type === 'table') {
      return `<div class="ex-scroll" tabindex="0" role="region" aria-label="Bảng số liệu"><table class="ex-table ex-data">
        <thead><tr>${block.head.map(cell => `<th scope="col">${examText(cell)}</th>`).join('')}</tr></thead>
        <tbody>${block.rows.map(row => `<tr>${row.map((cell, index) => (index ? `<td>${examText(cell)}</td>` : `<th scope="row">${examText(cell)}</th>`)).join('')}</tr>`).join('')}</tbody>
      </table></div>`
    }
    if (block.type === 'figure') {
      const width = Math.min(block.displayWidth || block.width, block.width)
      const height = Math.round(block.height * width / block.width)
      // Scrolls inside its own focusable box on narrow screens instead of shrinking to an unreadable size.
      const wide = width > 600
      return `<figure class="ex-figure${wide ? ' is-wide' : ''}" tabindex="0" role="group" aria-label="Hình trong đề"><img src="${escapeHTML(block.src)}" alt="${escapeHTML(block.alt)}" width="${width}" height="${height}" loading="lazy" decoding="async">${wide ? '<figcaption class="ex-figure__hint" aria-hidden="true">Vuốt ngang để xem đủ hình</figcaption>' : ''}</figure>`
    }
    return ''
  }).join('')
}

function flatQuestions(paper, blueprint) {
  return paper.sections.flatMap(section => {
    const part = blueprint.parts.find(item => item.id === section.part)
    return section.questions.map(question => ({ question, part }))
  })
}

function isAnswered(part, value) {
  if (value === undefined || value === null || value === '') return false
  if (part.type === 'truefalse') return Object.keys(value).length > 0
  return true
}

export function createExam({ root, announce, scrollToTop }) {
  const store = createExamStore()
  const papers = new Map()
  let active = null // { entry, paper, blueprint, items, session }
  let timer = null
  let warned = new Set()

  window.addEventListener('storage', event => {
    if (event.key !== STORE_KEY || !active) return
    const latest = store.getSession(active.entry.id)
    if (!latest || latest.id !== active.session.id) return
    active.session = latest
    if (latest.status === 'submitted') {
      announce('Bài thi đã được nộp ở một tab khác.')
      go({ name: 'exam', view: 'result', examId: active.entry.id, resultId: latest.resultId })
      return
    }
    renderWorkspace({ note: 'Đã đồng bộ câu trả lời từ một tab khác.' })
  })

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && active) tick()
  })

  function go(route) {
    const hash = routeHash(route)
    if (location.hash === hash) render(route, { focus: true })
    else location.hash = hash
  }

  function stopTimer() {
    clearInterval(timer)
    timer = null
  }

  function setRunning(running) {
    if (running) document.documentElement.dataset.examRunning = 'true'
    else delete document.documentElement.dataset.examRunning
  }

  // Leaving the workspace only stops the display: the deadline is stored.
  function leave() {
    stopTimer()
    setRunning(false)
    active = null
  }

  window.addEventListener('chemlab:view-change', event => {
    if (event.detail?.view !== 'learning') leave()
  })

  function focusHeading() {
    root.querySelector('[data-ex-heading]')?.focus({ preventScroll: true })
  }

  function crumbs(extra = '') {
    return `
      <nav class="lx-crumbs" aria-label="Đường dẫn">
        <a href="#learning">${icon('arrowLeft')}Học tập</a>
        ${extra}
      </nav>
    `
  }

  function message(title, text, actions = '') {
    root.innerHTML = `
      <div class="lx-page ex-page">
        ${crumbs('<a href="#learning/exam">Thi thử</a>')}
        <div class="lx-empty" role="alert">
          <h1 class="lx-title" data-ex-heading tabindex="-1">${escapeHTML(title)}</h1>
          <p>${escapeHTML(text)}</p>
          <div class="px-actions">${actions || '<a class="ui-btn" href="#learning/exam">Về danh sách đề</a>'}</div>
        </div>
      </div>
    `
  }

  async function paperFor(entry) {
    if (papers.has(entry.id)) return papers.get(entry.id)
    const paper = await loadPaper(entry)
    const errors = validatePaper(paper, { chapterIds: CHAPTER_IDS })
    if (errors.length) {
      console.error('[ChemLab Exam] Đề không hợp lệ:', errors)
      throw new Error('invalid-paper')
    }
    papers.set(entry.id, paper)
    return paper
  }

  async function render(route, { focus = false } = {}) {
    if (route.view !== 'take') stopTimer()
    const notice = store.takeNotice()
    if (route.view === 'catalog') renderCatalog()
    else {
      const entry = findExam(route.examId)
      if (!entry || !isTakeable(entry)) {
        leave()
        message('Đề này chưa thể làm', 'Đề không tồn tại hoặc chưa được phép sử dụng trong ChemLab.')
      }
      else {
        let paper
        try {
          paper = await paperFor(entry)
        }
        catch {
          leave()
          message('Không tải được đề', 'Hãy kiểm tra kết nối mạng rồi thử lại.', `<a class="ui-btn ui-btn--primary" href="${routeHash(route)}">Thử lại</a>`)
          return
        }
        const blueprint = getBlueprint(paper.blueprint)
        if (route.view === 'prepare') renderPrepare(entry, paper, blueprint)
        else if (route.view === 'take') {
          openWorkspace(entry, paper, blueprint)
          return
        }
        else if (route.view === 'result') renderResult(entry, paper, blueprint, route.resultId)
      }
    }
    if (notice) announce(notice)
    if (focus) {
      scrollToTop()
      focusHeading()
    }
  }

  /* ---------- Catalog ---------- */

  function renderCatalog() {
    leave()
    const exams = visibleExams()
    const takeable = exams.filter(entry => isTakeable(entry))
    const pending = exams.filter(entry => !isTakeable(entry))
    const results = store.results()
    root.innerHTML = `
      <div class="lx-page ex-page">
        ${crumbs()}
        <header class="lx-head">
          <p class="ui-eyebrow">Học tập</p>
          <h1 class="lx-title" data-ex-heading tabindex="-1">Thi thử</h1>
          <p class="lx-lead">Làm đề theo đúng cấu trúc kì thi tốt nghiệp THPT môn Hóa học: tính giờ, tự lưu bài, chấm điểm theo thang điểm của Bộ GD&ĐT.</p>
        </header>

        <section class="lx-section" aria-labelledby="ex-ready-title">
          <h2 class="lx-section__title" id="ex-ready-title">Đề có thể làm</h2>
          ${takeable.length
            ? `<ul class="ex-list">${takeable.map(entry => examRow(entry, true)).join('')}</ul>`
            : `<div class="ex-empty">
                <p><strong>Chưa có đề nào sẵn sàng.</strong></p>
                <p>ChemLab chỉ đưa đề lên khi đã xác minh nguồn, số hóa và đối chiếu đáp án. Trong lúc chờ, em có thể xem đề gốc tại nguồn (danh sách bên dưới) và ôn tập theo chương ở mục <a href="#learning/practice">Luyện tập</a>.</p>
              </div>`}
        </section>

        ${pending.length ? `
          <section class="lx-section" aria-labelledby="ex-pending-title">
            <h2 class="lx-section__title" id="ex-pending-title">Đề đang chuẩn bị — xem tại nguồn</h2>
            <p class="lx-lead ex-small">Các đề này chưa được số hóa hoặc chưa đối chiếu xong nên ChemLab chỉ dẫn liên kết đến nơi công bố.</p>
            <ul class="ex-list">${pending.map(entry => examRow(entry, false)).join('')}</ul>
          </section>
        ` : ''}

        ${results.length ? `
          <section class="lx-section" aria-labelledby="ex-history-title">
            <h2 class="lx-section__title" id="ex-history-title">Bài đã làm</h2>
            <ul class="ex-history">
              ${results.slice(0, 8).map(result => `
                <li>
                  <a href="${routeHash({ name: 'exam', view: 'result', examId: result.examId, resultId: result.id })}">
                    <span>${escapeHTML(result.title)}</span>
                    <span class="ex-history__score">${formatPoints(result.earned)}/${formatPoints(result.possible)} điểm</span>
                    <small>${timeText(result.submittedAt)}${result.reason === 'timeout' ? ' · hết giờ' : ''}</small>
                  </a>
                </li>
              `).join('')}
            </ul>
          </section>
        ` : ''}
      </div>
    `
  }

  function examRow(entry, takeable) {
    const session = takeable ? store.getSession(entry.id) : null
    const running = session?.status === 'active' && !store.isExpired(session)
    return `
      <li class="ex-row${takeable ? '' : ' is-pending'}">
        <div class="ex-row__main">
          <p class="ex-row__kind">${escapeHTML(KIND_LABEL[entry.kind])}${entry.year ? ` · ${entry.year}` : ''}</p>
          <h3 class="ex-row__title">${escapeHTML(entry.title)}</h3>
          <p class="ex-row__meta">${entry.timeLimitMinutes} phút · cấu trúc ${escapeHTML(getBlueprint(entry.blueprint).title.replace(/^.*\(cấu trúc /, '').replace(/\)$/, ''))}</p>
          ${entry.source ? `<p class="ex-row__meta">Nguồn: ${escapeHTML(entry.source.authority)}</p>` : ''}
          ${takeable
            ? (KEY_BADGE[entry.answerKey] ? `<p class="ex-row__note"><span class="lx-status">${KEY_BADGE[entry.answerKey]}</span></p>` : '')
            : `<p class="ex-row__note"><span class="lx-status">Chưa sẵn sàng</span></p><p class="ex-row__note">${escapeHTML(entry.note)}</p>`}
        </div>
        <div class="ex-row__actions">
          ${takeable
            ? `<a class="ui-btn ${running ? 'ui-btn--primary' : ''}" href="${routeHash({ name: 'exam', view: 'prepare', examId: entry.id })}">${running ? 'Tiếp tục bài đang làm' : 'Xem hướng dẫn'} ${icon('arrowRight')}</a>`
            : entry.source?.url ? `<a class="ui-btn ui-btn--ghost" href="${escapeHTML(entry.source.url)}" target="_blank" rel="noopener noreferrer">Mở nguồn<span class="sr-only"> (mở tab mới)</span></a>` : ''}
        </div>
      </li>
    `
  }

  /* ---------- Preparation ---------- */

  function sourceBlock(entry, paper) {
    const date = entry.source.publishedAt ? ` · ${escapeHTML(entry.source.publishedAt.split('-').reverse().join('/'))}` : ''
    const link = entry.source.documentUrl || entry.source.url
    const origin = link
      ? ` · <a href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer">Tài liệu gốc<span class="sr-only"> (mở tab mới)</span></a>`
      : ' · tệp gốc do chủ dự án cung cấp'
    return `
      <dl class="ex-source">
        <div><dt>Nguồn</dt><dd>${escapeHTML(entry.source.authority)}${date}${origin}</dd></div>
        ${paper.variant ? `<div><dt>Mã đề</dt><dd>${escapeHTML(paper.variant)}</dd></div>` : ''}
        <div><dt>Đáp án</dt><dd>${KEY_TEXT[paper.answerKey] || KEY_TEXT.chemlab} Lời giải từng câu là lời giải tham khảo do ChemLab biên soạn.</dd></div>
        <div><dt>Quyền sử dụng</dt><dd>Chủ dự án ChemLab xác nhận được phép sử dụng đề này.</dd></div>
      </dl>
    `
  }

  function renderPrepare(entry, paper, blueprint) {
    let session = store.getSession(entry.id)
    if (session?.status === 'active' && store.isExpired(session)) {
      const outcome = store.submit(entry.id, session.id, paper, { reason: 'timeout' })
      session = outcome.session
    }
    const running = session?.status === 'active'
    const outdated = running && session.contentVersion !== paper.dataVersion
    const counts = paper.sections.map(section => ({ part: blueprint.parts.find(item => item.id === section.part), count: section.questions.length }))
    const total = counts.reduce((sum, item) => sum + item.count, 0)
    root.innerHTML = `
      <div class="lx-page ex-page">
        ${crumbs('<a href="#learning/exam">Thi thử</a>')}
        <header class="lx-head">
          <p class="ui-eyebrow">${escapeHTML(KIND_LABEL[entry.kind])}</p>
          <h1 class="lx-title" data-ex-heading tabindex="-1">${escapeHTML(paper.title)}</h1>
        </header>
        ${entry.kind === 'fixture' ? '<p class="ex-banner" role="note">Đây là đề kiểm thử do ChemLab soạn để thử hệ thống thi, <strong>không phải đề chính thức</strong>.</p>' : ''}
        ${entry.source ? sourceBlock(entry, paper) : ''}
        <dl class="ex-facts">
          <div><dt>Thời gian</dt><dd>${paper.timeLimitMinutes} phút</dd></div>
          <div><dt>Số câu</dt><dd>${total} câu, ${counts.length} phần</dd></div>
          <div><dt>Thang điểm</dt><dd>${formatPoints(scoreExam(paper, {}).possible)} điểm</dd></div>
        </dl>
        <section class="lx-section" aria-labelledby="ex-parts-title">
          <h2 class="lx-section__title" id="ex-parts-title">Cấu trúc và cách tính điểm</h2>
          <ul class="ex-parts">
            ${counts.map(({ part, count }) => `
              <li>
                <strong>${escapeHTML(part.title)}</strong> — ${count} câu
                <p>${escapeHTML(part.instruction)}</p>
                <p class="ex-small">${part.type === 'truefalse'
                  ? 'Điểm mỗi câu theo số ý đúng: 1 ý 0,1 · 2 ý 0,25 · 3 ý 0,5 · 4 ý 1 điểm.'
                  : `Mỗi câu đúng ${formatPoints(part.pointsHundredths)} điểm; không trừ điểm câu sai.`}</p>
              </li>
            `).join('')}
          </ul>
        </section>
        <section class="lx-section" aria-labelledby="ex-rules-title">
          <h2 class="lx-section__title" id="ex-rules-title">Quy định</h2>
          <ul class="ex-rules">
            <li>Đồng hồ chạy theo thời gian thực từ lúc bắt đầu; tải lại trang hay đóng tab không làm dừng hoặc đặt lại giờ.</li>
            <li>Câu trả lời được tự lưu trên trình duyệt này ngay khi em chọn hoặc nhập; có thể quay lại làm tiếp.</li>
            <li>Trong lúc làm bài không có gợi ý, lời giải hay trợ lí AI.</li>
            <li>Khi hết giờ, bài được nộp tự động với các câu đã trả lời.</li>
            <li>Đây là môi trường thi thử trên thiết bị của em, không thay thế kì thi thật và không có chức năng chống gian lận.</li>
          </ul>
        </section>
        <div class="px-actions">
          ${outdated
            ? `<p class="ex-banner" role="alert">Đề đã được cập nhật sau khi em bắt đầu nên không thể làm tiếp bài cũ.</p>
               <button class="ui-btn ui-btn--primary" type="button" data-ex-restart>Làm lại từ đầu</button>`
            : running
              ? `<a class="ui-btn ui-btn--primary" href="${routeHash({ name: 'exam', view: 'take', examId: entry.id })}">Tiếp tục làm bài (còn ${clockText(store.remainingMs(session))}) ${icon('arrowRight')}</a>
                 <button class="ui-btn ui-btn--ghost" type="button" data-ex-restart>Hủy bài đang làm và làm lại</button>`
              : `<button class="ui-btn ui-btn--primary" type="button" data-ex-start>Bắt đầu làm bài ${icon('arrowRight')}</button>`}
          ${session?.status === 'submitted' ? `<a class="ui-btn ui-btn--ghost" href="${routeHash({ name: 'exam', view: 'result', examId: entry.id, resultId: session.resultId })}">Xem kết quả lần trước</a>` : ''}
        </div>
      </div>
    `
    root.querySelector('[data-ex-start]')?.addEventListener('click', () => {
      store.discard(entry.id)
      const started = store.start(entry, paper)
      if (started.saved === false) announce('Trình duyệt không cho lưu dữ liệu: bài làm sẽ mất nếu tải lại trang.')
      go({ name: 'exam', view: 'take', examId: entry.id })
    })
    root.querySelector('[data-ex-restart]')?.addEventListener('click', () => {
      if (!window.confirm('Hủy bài đang làm? Các câu trả lời hiện tại sẽ bị xóa.')) return
      store.discard(entry.id)
      renderPrepare(entry, paper, blueprint)
      root.querySelector('[data-ex-start]')?.focus()
    })
  }

  /* ---------- Workspace ---------- */

  function openWorkspace(entry, paper, blueprint) {
    const session = store.getSession(entry.id)
    if (!session) {
      go({ name: 'exam', view: 'prepare', examId: entry.id })
      return
    }
    if (session.status === 'submitted') {
      go({ name: 'exam', view: 'result', examId: entry.id, resultId: session.resultId })
      return
    }
    if (session.contentVersion !== paper.dataVersion) {
      go({ name: 'exam', view: 'prepare', examId: entry.id })
      return
    }
    active = { entry, paper, blueprint, items: flatQuestions(paper, blueprint), session }
    warned = new Set()
    if (store.isExpired(session)) {
      finish('timeout')
      return
    }
    setRunning(true)
    renderWorkspace({ focus: true })
    stopTimer()
    timer = setInterval(tick, 1000)
  }

  function tick() {
    if (!active) return
    const remaining = store.remainingMs(store.getSession(active.entry.id) || active.session)
    const clock = root.querySelector('[data-ex-clock]')
    if (clock) {
      clock.textContent = clockText(remaining)
      clock.closest('.ex-timer')?.classList.toggle('is-low', remaining <= 5 * 60_000)
    }
    for (const minutes of [5, 1]) {
      if (remaining <= minutes * 60_000 && remaining > 0 && !warned.has(minutes)) {
        warned.add(minutes)
        announce(`Còn ${minutes} phút.`)
      }
    }
    if (remaining <= 0) finish('timeout')
  }

  function answeredCount() {
    return active.items.filter(({ question, part }) => isAnswered(part, active.session.answers[question.id])).length
  }

  function renderWorkspace({ focus = false, note = '' } = {}) {
    const { entry, paper, items, session } = active
    const index = Math.min(Math.max(session.current || 0, 0), items.length - 1)
    const { question, part } = items[index]
    const value = session.answers[question.id]
    const flagged = Boolean(session.flags[question.id])
    const answered = answeredCount()
    const firstOfPart = items.findIndex(item => item.part.id === part.id)
    root.innerHTML = `
      <div class="ex-workspace">
        <header class="ex-bar">
          <p class="ex-bar__title">${escapeHTML(paper.title)}</p>
          <div class="ex-timer" role="timer" aria-label="Thời gian còn lại">
            ${icon('clock')}<span data-ex-clock>${clockText(store.remainingMs(session))}</span>
          </div>
          <button class="ui-btn ui-btn--sm ui-btn--primary" type="button" data-ex-submit>Nộp bài</button>
        </header>

        <div class="lx-page ex-stage">
          ${entry.kind === 'fixture' ? '<p class="ex-banner ex-banner--quiet">Đề kiểm thử nội bộ — không phải đề chính thức.</p>' : ''}
          ${paper.preamble ? `<details class="ex-preamble"><summary>Dữ kiện chung của đề</summary><p>${examText(paper.preamble)}</p></details>` : ''}
          <p class="ex-part">${escapeHTML(part.title)} · câu ${index - firstOfPart + 1} của phần</p>
          <div class="ex-qhead">
            <h1 class="px-counter" data-ex-heading tabindex="-1">Câu ${index + 1}<span>/${items.length}</span></h1>
            <button class="ui-btn ui-btn--sm ui-btn--ghost ex-flag${flagged ? ' is-on' : ''}" type="button" data-ex-flag aria-pressed="${flagged}">
              ${icon('flag')}${flagged ? 'Đã đánh dấu' : 'Đánh dấu xem lại'}
            </button>
          </div>
          ${index === firstOfPart ? `<p class="px-hint">${escapeHTML(paper.sections.find(section => section.part === part.id)?.instruction || part.instruction)}</p>` : ''}
          <section class="px-question ex-question" aria-labelledby="ex-q-title">
            <div class="px-question__content ex-content" id="ex-q-title">${renderContent(question.content)}</div>
            <form class="px-answer" data-ex-answer novalidate>
              ${renderInput(question, part, value)}
              <p class="px-input-error" data-ex-error role="alert"></p>
            </form>
          </section>
          <p class="ex-saved" data-ex-saved role="status">${escapeHTML(note)}</p>

          <nav class="px-nav" aria-label="Chuyển câu">
            ${index > 0 ? `<button class="ui-btn ui-btn--ghost" type="button" data-ex-go="${index - 1}">${icon('arrowLeft')}Câu trước</button>` : '<span></span>'}
            ${index < items.length - 1
              ? `<button class="ui-btn ui-btn--primary" type="button" data-ex-go="${index + 1}">Câu tiếp ${icon('arrowRight')}</button>`
              : '<button class="ui-btn ui-btn--primary" type="button" data-ex-submit>Nộp bài</button>'}
          </nav>

          <section class="ex-grid" aria-labelledby="ex-grid-title">
            <h2 class="ex-grid__title" id="ex-grid-title">Danh sách câu · đã trả lời ${answered}/${items.length}</h2>
            ${paper.sections.map(section => {
              const sectionPart = active.blueprint.parts.find(item => item.id === section.part)
              return `
                <p class="ex-grid__part">Phần ${escapeHTML(sectionPart.id)}</p>
                <ol class="ex-grid__list">
                  ${section.questions.map(item => {
                    const at = items.findIndex(entry => entry.question.id === item.id)
                    const done = isAnswered(sectionPart, session.answers[item.id])
                    const mark = session.flags[item.id]
                    const label = `Câu ${at + 1}, ${done ? 'đã trả lời' : 'chưa trả lời'}${mark ? ', đã đánh dấu' : ''}`
                    return `<li><button type="button" class="${done ? 'is-answered' : ''}${mark ? ' is-flagged' : ''}" data-ex-go="${at}"${at === index ? ' aria-current="step"' : ''} aria-label="${label}">${at + 1}</button></li>`
                  }).join('')}
                </ol>
              `
            }).join('')}
            <p class="ex-legend"><span class="is-answered"></span>Đã trả lời <span class="is-flagged"></span>Đánh dấu</p>
          </section>
        </div>

        <dialog class="ex-dialog" data-ex-dialog aria-labelledby="ex-dialog-title">
          <h2 id="ex-dialog-title">Nộp bài?</h2>
          <p data-ex-dialog-text></p>
          <div class="ex-dialog__actions">
            <button class="ui-btn" type="button" data-ex-cancel autofocus>Tiếp tục làm bài</button>
            <button class="ui-btn ui-btn--primary" type="button" data-ex-confirm>Nộp bài</button>
          </div>
        </dialog>
      </div>
    `
    bindWorkspace(question, part)
    if (focus) {
      scrollToTop()
      focusHeading()
    }
  }

  function renderInput(question, part, value) {
    const name = `ex-${question.id}`
    if (part.type === 'single') {
      return `
        <fieldset class="px-options">
          <legend class="sr-only">Chọn một phương án</legend>
          ${question.options.map(option => `
            <label class="px-option">
              <input type="radio" name="${name}" value="${escapeHTML(option.id)}"${value === option.id ? ' checked' : ''}>
              <span class="lx-option__letter" aria-hidden="true">${escapeHTML(option.id)}</span>
              <span>${examText(option.text)}</span>
            </label>
          `).join('')}
        </fieldset>
        <button class="ui-btn ui-btn--sm ui-btn--ghost ex-clear" type="button" data-ex-clear${value ? '' : ' hidden'}>Bỏ chọn</button>
      `
    }
    if (part.type === 'truefalse') {
      return `
        <div class="px-statements">
          ${question.statements.map(statement => `
            <fieldset class="px-statement">
              <legend><span class="px-statement__id">${escapeHTML(statement.id)})</span> ${examText(statement.text)}</legend>
              <div class="px-tf">
                <label><input type="radio" name="${name}-${escapeHTML(statement.id)}" value="true"${value?.[statement.id] === true ? ' checked' : ''}><span>Đúng</span></label>
                <label><input type="radio" name="${name}-${escapeHTML(statement.id)}" value="false"${value?.[statement.id] === false ? ' checked' : ''}><span>Sai</span></label>
              </div>
            </fieldset>
          `).join('')}
        </div>
        <button class="ui-btn ui-btn--sm ui-btn--ghost ex-clear" type="button" data-ex-clear${value ? '' : ' hidden'}>Xóa các lựa chọn</button>
      `
    }
    return `
      <div class="px-text">
        <label class="px-label" for="${name}">Kết quả (tối đa ${part.maxChars} kí tự)</label>
        <div class="px-text__row">
          <input class="ui-input px-input ex-short" id="${name}" name="${name}" type="text" inputmode="decimal" autocomplete="off" spellcheck="false"
            maxlength="${part.maxChars + 2}" aria-describedby="${name}-help" value="${escapeHTML(value ?? '')}">
        </div>
        <p class="px-hint" id="${name}-help">Dùng dấu phẩy cho số thập phân, ví dụ 2,5 hoặc -1,2. Làm tròn theo yêu cầu của đề.</p>
      </div>
    `
  }

  function readValue(question, part, form) {
    const name = `ex-${question.id}`
    if (part.type === 'single') return form.querySelector(`input[name="${CSS.escape(name)}"]:checked`)?.value
    if (part.type === 'truefalse') {
      const value = {}
      for (const statement of question.statements) {
        const input = form.querySelector(`input[name="${CSS.escape(`${name}-${statement.id}`)}"]:checked`)
        if (input) value[statement.id] = input.value === 'true'
      }
      return value
    }
    return normalizeShortAnswer(form.querySelector(`input[name="${CSS.escape(name)}"]`)?.value)
  }

  function save(question, value) {
    if (!active) return // late input/change event after submit
    const outcome = store.setAnswer(active.entry.id, active.session.id, question.id, value)
    const status = root.querySelector('[data-ex-saved]')
    if (outcome.session) active.session = outcome.session
    if (outcome.ok) {
      if (status) status.textContent = 'Đã lưu.'
      refreshGrid()
      return
    }
    if (outcome.reason === 'expired') finish('timeout')
    else if (outcome.reason === 'submitted') go({ name: 'exam', view: 'result', examId: active.entry.id, resultId: outcome.session.resultId })
    else if (status) status.textContent = 'Không lưu được vào trình duyệt (bộ nhớ đầy hoặc bị chặn). Đừng tải lại trang.'
  }

  // Updates answered/flag marks without re-rendering the question (keeps focus).
  function refreshGrid() {
    const answered = answeredCount()
    const title = root.querySelector('#ex-grid-title')
    if (title) title.textContent = `Danh sách câu · đã trả lời ${answered}/${active.items.length}`
    root.querySelectorAll('[data-ex-go]').forEach(button => {
      if (!button.closest('.ex-grid__list')) return
      const { question, part } = active.items[Number(button.dataset.exGo)]
      const done = isAnswered(part, active.session.answers[question.id])
      const mark = Boolean(active.session.flags[question.id])
      button.classList.toggle('is-answered', done)
      button.classList.toggle('is-flagged', mark)
      button.setAttribute('aria-label', `Câu ${Number(button.dataset.exGo) + 1}, ${done ? 'đã trả lời' : 'chưa trả lời'}${mark ? ', đã đánh dấu' : ''}`)
    })
    const clear = root.querySelector('[data-ex-clear]')
    if (clear) {
      const { question, part } = active.items[active.session.current || 0]
      clear.hidden = !isAnswered(part, active.session.answers[question.id])
    }
  }

  function bindWorkspace(question, part) {
    const form = root.querySelector('[data-ex-answer]')
    const error = root.querySelector('[data-ex-error]')
    form.addEventListener('submit', event => event.preventDefault())
    form.addEventListener('change', () => {
      if (part.type !== 'short') save(question, readValue(question, part, form))
    })
    form.addEventListener('input', event => {
      if (part.type !== 'short' || !event.target.matches('.ex-short')) return
      const check = validateShortAnswer(event.target.value, part.maxChars)
      error.textContent = check.ok ? '' : check.message
      event.target.setAttribute('aria-invalid', String(!check.ok))
      // Invalid text is stored too, so nothing typed is lost; it scores as invalid.
      save(question, check.value)
    })
    root.querySelector('[data-ex-clear]')?.addEventListener('click', () => {
      save(question, undefined)
      renderWorkspace()
      root.querySelector('.px-answer input')?.focus()
    })
    root.querySelector('[data-ex-flag]').addEventListener('click', () => {
      const outcome = store.setFlag(active.entry.id, active.session.id, question.id, !active.session.flags[question.id])
      if (outcome.session) active.session = outcome.session
      renderWorkspace()
      root.querySelector('[data-ex-flag]')?.focus()
    })
    root.querySelectorAll('[data-ex-go]').forEach(button => button.addEventListener('click', () => {
      const outcome = store.setCurrent(active.entry.id, active.session.id, Number(button.dataset.exGo))
      if (outcome.session) active.session = outcome.session
      if (outcome.reason === 'expired') return finish('timeout')
      if (!outcome.ok) active.session.current = Number(button.dataset.exGo)
      renderWorkspace({ focus: true })
    }))
    root.querySelectorAll('[data-ex-submit]').forEach(button => button.addEventListener('click', confirmSubmit))
  }

  function confirmSubmit() {
    const dialog = root.querySelector('[data-ex-dialog]')
    const unanswered = active.items.length - answeredCount()
    const flagged = Object.keys(active.session.flags).length
    const parts = []
    if (unanswered) parts.push(`Còn ${unanswered} câu chưa trả lời.`)
    if (flagged) parts.push(`Có ${flagged} câu đang đánh dấu xem lại.`)
    parts.push('Sau khi nộp, em không thể sửa câu trả lời.')
    root.querySelector('[data-ex-dialog-text]').textContent = parts.join(' ')
    const opener = document.activeElement
    const confirm = root.querySelector('[data-ex-confirm]')
    const close = () => {
      dialog.close()
      opener?.focus?.()
    }
    root.querySelector('[data-ex-cancel]').onclick = close
    confirm.onclick = () => {
      confirm.disabled = true
      dialog.close()
      finish('manual')
    }
    dialog.showModal()
  }

  function finish(reason) {
    if (!active) return
    stopTimer()
    const { entry, paper, session } = active
    const outcome = store.submit(entry.id, session.id, paper, { reason })
    active = null
    setRunning(false)
    if (!outcome.ok && !outcome.result) {
      message('Không nộp được bài', 'Trình duyệt không cho lưu dữ liệu. Hãy giải phóng bộ nhớ trình duyệt rồi thử lại; bài làm vẫn được giữ trong trang này.',
        `<a class="ui-btn ui-btn--primary" href="${routeHash({ name: 'exam', view: 'take', examId: entry.id })}">Quay lại bài thi</a>`)
      return
    }
    announce(outcome.result.reason === 'timeout' ? 'Hết giờ. Bài đã được nộp tự động.' : 'Đã nộp bài.')
    go({ name: 'exam', view: 'result', examId: entry.id, resultId: outcome.result.id })
  }

  /* ---------- Results ---------- */

  function renderResult(entry, paper, blueprint, resultId) {
    leave()
    const result = store.getResult(resultId)
    if (!result || result.examId !== entry.id) {
      message('Không tìm thấy kết quả', 'Kết quả này không còn trên trình duyệt (chỉ giữ 20 lần làm gần nhất).')
      return
    }
    if (result.contentVersion !== paper.dataVersion) {
      message('Đề đã được cập nhật', `Bài làm lúc ${timeText(result.submittedAt)} được ${formatPoints(result.earned)}/${formatPoints(result.possible)} điểm, nhưng đề đã thay đổi nên không thể hiển thị lại từng câu.`)
      return
    }
    // Re-score from the stored answers so the review always matches the key.
    const scored = scoreExam(paper, result.answers)
    const byId = new Map(scored.questions.map(item => [item.id, item]))
    const analysis = analyse(paper, scored)
    const items = flatQuestions(paper, blueprint)
    const percent = Math.round(result.earned / result.possible * 100)
    const weakChapters = analysis.chapters
      .filter(bucket => bucket.earned / bucket.possible < 0.6)
      .map(bucket => ({ ...bucket, info: CHAPTERS.get(bucket.key) }))
      .filter(bucket => bucket.info)

    root.innerHTML = `
      <div class="lx-page ex-page ex-results">
        ${crumbs('<a href="#learning/exam">Thi thử</a>')}
        <header class="lx-head">
          <p class="ui-eyebrow">Kết quả · ${escapeHTML(paper.title)}</p>
          <h1 class="lx-title" data-ex-heading tabindex="-1">${formatPoints(result.earned)}<span class="ex-outof">/${formatPoints(result.possible)} điểm</span></h1>
          <div class="lx-meter px-score" role="progressbar" aria-label="Tỉ lệ điểm" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div>
          <p class="ex-small">Nộp lúc ${timeText(result.submittedAt)}${result.reason === 'timeout' ? ' · <strong>hết giờ, nộp tự động</strong>' : ''}</p>
          ${result.clockAnomaly ? '<p class="ex-banner" role="note">Đồng hồ thiết bị đã bị chỉnh lùi trong lúc làm bài; thời gian được tính theo mốc muộn nhất ghi nhận được.</p>' : ''}
          ${entry.kind === 'fixture' ? '<p class="ex-banner ex-banner--quiet">Đề kiểm thử nội bộ — không phải đề chính thức.</p>' : ''}
        </header>

        <section class="lx-section" aria-labelledby="ex-parts-score">
          <h2 class="lx-section__title" id="ex-parts-score">Điểm theo phần</h2>
          <table class="ex-table">
            <thead><tr><th scope="col">Phần</th><th scope="col">Điểm</th></tr></thead>
            <tbody>
              ${scored.parts.map(part => `<tr><th scope="row">${escapeHTML(part.title)}</th><td>${formatPoints(part.earned)}/${formatPoints(part.possible)}</td></tr>`).join('')}
            </tbody>
          </table>
        </section>

        <section class="lx-section" aria-labelledby="ex-analysis-title">
          <h2 class="lx-section__title" id="ex-analysis-title">Phân tích</h2>
          ${analysis.chapters.length ? `
            <div class="ex-analysis">
              <table class="ex-table">
                <caption>Theo chương</caption>
                <thead><tr><th scope="col">Chương</th><th scope="col">Số câu</th><th scope="col">Điểm</th></tr></thead>
                <tbody>
                  ${analysis.chapters.map(bucket => {
                    const info = CHAPTERS.get(bucket.key)
                    return `<tr><th scope="row">${info ? `Lớp ${info.grade} · Chương ${info.chapter.number}. ${escapeHTML(info.chapter.title)}` : escapeHTML(bucket.key)}</th><td>${bucket.count}</td><td>${formatPoints(bucket.earned)}/${formatPoints(bucket.possible)}</td></tr>`
                  }).join('')}
                </tbody>
              </table>
              ${analysis.levels.length ? `<table class="ex-table">
                <caption>Theo mức độ</caption>
                <thead><tr><th scope="col">Mức độ</th><th scope="col">Số câu</th><th scope="col">Điểm</th></tr></thead>
                <tbody>
                  ${['biet', 'hieu', 'vandung'].map(key => analysis.levels.find(bucket => bucket.key === key)).filter(Boolean)
                    .map(bucket => `<tr><th scope="row">${LEVELS[bucket.key]}</th><td>${bucket.count}</td><td>${formatPoints(bucket.earned)}/${formatPoints(bucket.possible)}</td></tr>`).join('')}
                </tbody>
              </table>` : ''}
            </div>
          ` : ''}
          ${analysis.unverified
            ? `<p class="ex-small">${analysis.unverified} câu chưa có thông tin chương/mức độ được kiểm chứng nên không được tính trong phần phân tích (vẫn được tính điểm).</p>`
            : ''}
          ${analysis.internal ? '<p class="ex-small">Phân loại theo chương do ChemLab gán dựa trên nội dung từng câu, chưa được giáo viên thẩm định.</p>' : ''}
          ${analysis.chapters.length && !analysis.levels.length ? '<p class="ex-small">Đề gốc không công bố mức độ (Biết – Hiểu – Vận dụng) của từng câu nên không phân tích theo mức độ.</p>' : ''}
          ${!analysis.chapters.length ? '<p>Đề này chưa đủ dữ liệu để phân tích theo chương và mức độ.</p>' : ''}
          ${weakChapters.length ? `
            <p><strong>Nên ôn lại:</strong></p>
            <ul class="ex-review-links">
              ${weakChapters.map(bucket => `<li><a href="#learning/grade-${bucket.info.grade}">Lớp ${bucket.info.grade} · Chương ${bucket.info.chapter.number}. ${escapeHTML(bucket.info.chapter.title)}</a> · <a href="${routeHash({ name: 'practice', view: 'start', scope: 'chapter', id: bucket.key })}">Luyện tập chương</a></li>`).join('')}
            </ul>
          ` : ''}
        </section>

        <section class="lx-section" aria-labelledby="ex-review-title">
          <h2 class="lx-section__title" id="ex-review-title">Xem lại bài làm</h2>
          <ol class="ex-review">
            ${items.map(({ question, part }, index) => reviewItem(question, part, result.answers[question.id], byId.get(question.id), index)).join('')}
          </ol>
        </section>

        <div class="px-actions">
          <a class="ui-btn ui-btn--primary" href="${routeHash({ name: 'exam', view: 'prepare', examId: entry.id })}">Làm lại đề này</a>
          <a class="ui-btn ui-btn--ghost" href="#learning/exam">Danh sách đề</a>
        </div>
      </div>
    `
  }

  function reviewItem(question, part, value, scored, index) {
    let yours = 'Chưa trả lời'
    let key = ''
    if (part.type === 'single') {
      yours = value ? `${escapeHTML(value)}. ${examText(question.options.find(option => option.id === value)?.text || '')}` : yours
      key = `${escapeHTML(question.answer)}. ${examText(question.options.find(option => option.id === question.answer).text)}`
    }
    else if (part.type === 'short') {
      yours = value ? escapeHTML(value) : yours
      key = escapeHTML(question.answer)
    }
    const points = `${formatPoints(scored.points)} điểm`
    return `
      <li class="ex-review__item is-${scored.status}">
        <details>
          <summary>
            <span>Câu ${index + 1}</span>
            <span class="ex-review__status">${STATUS_LABEL[scored.status]}${part.type === 'truefalse' && scored.status !== 'unanswered' ? ` (${scored.statementsCorrect}/4 ý)` : ''} · ${points}</span>
          </summary>
          <div class="ex-review__body">
            <div class="px-question__content ex-content">${renderContent(question.content)}</div>
            ${part.type === 'truefalse' ? `
              <table class="ex-table ex-tf">
                <thead><tr><th scope="col">Ý</th><th scope="col">Em chọn</th><th scope="col">Đáp án</th></tr></thead>
                <tbody>
                  ${question.statements.map(statement => {
                    const chosen = value?.[statement.id]
                    const truth = question.answer[statement.id]
                    return `<tr class="${chosen === truth ? 'is-correct' : 'is-wrong'}"><th scope="row">${escapeHTML(statement.id)}) ${examText(statement.text)}</th><td>${chosen === true ? 'Đúng' : chosen === false ? 'Sai' : '—'}</td><td>${truth ? 'Đúng' : 'Sai'}</td></tr>`
                  }).join('')}
                </tbody>
              </table>
            ` : `
              <p><strong>Em trả lời:</strong> ${yours}</p>
              <p><strong>Đáp án:</strong> ${key}</p>
            `}
            <p class="px-feedback__label">${question.solution.official ? 'Lời giải chính thức' : 'Lời giải tham khảo do ChemLab biên soạn (không phải lời giải chính thức)'}</p>
            <p>${examText(question.solution.text)}</p>
          </div>
        </details>
      </li>
    `
  }

  function context() {
    if (!active) return null
    // No question text or answers: ChemAI must not help during an exam.
    return { mode: 'exam', examId: active.entry.id }
  }

  return { render, leave, context }
}
