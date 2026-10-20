// Written-response practice with a rubric. Learners can always self-check
// against the criteria; ChemAI feedback is optional, on request only, and
// labelled as reference feedback (no score). Never used in Exam mode.
import { icon } from '../shell/icons.js'
import { findLesson } from './catalog.js'
import { escapeHTML, rich } from './format.js'
import { routeHash } from './routes.js'
import { findRubric, ANSWER_LIMITS } from './rubrics.js'

const DRAFT_KEY = 'chemlab-v1-written-drafts'
const COOLDOWN_MS = 20_000
const STATUS = { met: 'Đã đạt', partial: 'Đạt một phần', missing: 'Chưa có' }

let availability = null // Promise<boolean>, checked once per page load
let lastRequestAt = 0

function readDrafts() {
  try {
    const value = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}')
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  }
  catch {
    return {}
  }
}

function saveDraft(id, text) {
  try {
    const drafts = readDrafts()
    if (text.trim()) drafts[id] = text.slice(0, ANSWER_LIMITS.max)
    else delete drafts[id]
    localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts))
  }
  catch { /* drafts are a convenience only */ }
}

function feedbackAvailable() {
  if (!availability) {
    availability = fetch('/api/feedback', { headers: { Accept: 'application/json' } })
      .then(response => (response.ok ? response.json() : { enabled: false }))
      .then(data => data?.enabled === true)
      .catch(() => false)
  }
  return availability
}

export function renderWritten({ root, rubricId, announce, crumbs, focus, scrollToTop }) {
  const rubric = findRubric(rubricId)
  if (!rubric) {
    root.innerHTML = `
      <div class="lx-page">
        ${crumbs('<a href="#learning/practice">Luyện tập</a>')}
        <div class="lx-empty" role="alert">
          <h1 class="lx-title" data-lx-heading tabindex="-1">Không tìm thấy bài tự luận</h1>
          <a class="ui-btn" href="#learning/practice">Về Luyện tập</a>
        </div>
      </div>
    `
    return
  }
  const lesson = findLesson(rubric.lessonId)
  const draft = readDrafts()[rubric.id] || ''

  root.innerHTML = `
    <div class="lx-page px-written">
      ${crumbs('<a href="#learning/practice">Luyện tập</a>')}
      <header class="lx-head">
        <p class="ui-eyebrow">Tự luận${lesson ? ` · <a href="${routeHash({ name: 'lesson', lessonId: lesson.lesson.id })}">Lớp ${lesson.grade.grade} · Bài ${lesson.lesson.number}. ${escapeHTML(lesson.lesson.title)}</a>` : ''}</p>
        <h1 class="lx-title" data-lx-heading tabindex="-1">${escapeHTML(rubric.title)}</h1>
      </header>
      <div class="px-question__content">${rich(rubric.prompt)}</div>

      <form class="px-written__form" data-wr-form novalidate>
        <label class="px-label" for="wr-answer">Bài làm của em</label>
        <textarea class="ui-input px-written__input" id="wr-answer" rows="8" maxlength="${ANSWER_LIMITS.max}" aria-describedby="wr-count">${escapeHTML(draft)}</textarea>
        <p class="px-hint" id="wr-count" data-wr-count></p>
        <p class="px-input-error" data-wr-error role="alert"></p>
        <div class="px-actions" data-wr-actions>
          <p class="px-hint" data-wr-availability role="status">Đang kiểm tra ChemAI…</p>
        </div>
      </form>

      <section class="px-written__result" data-wr-result aria-live="polite"></section>

      <details class="px-written__rubric" data-wr-rubric>
        <summary>Tự đối chiếu: một bài làm đầy đủ cần có</summary>
        <ul class="px-written__checks">
          ${rubric.criteria.map(item => `<li><label><input type="checkbox"> <span>${rich(item.text)}</span></label></li>`).join('')}
        </ul>
        <p class="px-feedback__label">Lỗi hay gặp</p>
        <ul>${rubric.criticalMistakes.map(item => `<li>${rich(item)}</li>`).join('')}</ul>
        <p class="px-hint">Tiêu chí do ChemLab biên soạn, chưa được giáo viên thẩm định.</p>
      </details>
    </div>
  `

  const textarea = root.querySelector('#wr-answer')
  const count = root.querySelector('[data-wr-count]')
  const error = root.querySelector('[data-wr-error]')
  const updateCount = () => {
    count.textContent = `${textarea.value.trim().length}/${ANSWER_LIMITS.max} kí tự (tối thiểu ${ANSWER_LIMITS.min} để nhờ nhận xét).`
  }
  updateCount()
  textarea.addEventListener('input', () => {
    updateCount()
    error.textContent = ''
    saveDraft(rubric.id, textarea.value)
  })

  void feedbackAvailable().then(enabled => {
    const actions = root.querySelector('[data-wr-actions]')
    if (!actions?.isConnected) return
    actions.innerHTML = enabled
      ? `<button class="ui-btn ui-btn--primary" type="submit" data-wr-submit>${icon('sparkle')}Nhờ ChemAI nhận xét</button>
         <p class="px-hint">Nhận xét tham khảo theo tiêu chí, không chấm điểm. Chỉ gửi khi em bấm nút.</p>`
      : '<p class="px-hint" data-wr-availability>Nhận xét bằng ChemAI chưa được bật. Hãy tự đối chiếu bài làm với các tiêu chí bên dưới.</p>'
    if (!enabled) root.querySelector('[data-wr-rubric]').open = true
  })

  root.querySelector('[data-wr-form]').addEventListener('submit', async event => {
    event.preventDefault()
    const button = root.querySelector('[data-wr-submit]')
    if (!button || button.disabled) return
    const answer = textarea.value.trim()
    if (answer.length < ANSWER_LIMITS.min) {
      error.textContent = `Hãy viết ít nhất ${ANSWER_LIMITS.min} kí tự trước khi nhờ nhận xét.`
      textarea.focus()
      return
    }
    const wait = lastRequestAt + COOLDOWN_MS - Date.now()
    if (wait > 0) {
      error.textContent = `Hãy chờ ${Math.ceil(wait / 1000)} giây rồi thử lại.`
      return
    }
    lastRequestAt = Date.now()
    button.disabled = true
    button.setAttribute('aria-busy', 'true')
    const result = root.querySelector('[data-wr-result]')
    result.innerHTML = '<p class="px-hint">ChemAI đang đọc bài làm…</p>'
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rubricId: rubric.id, answer })
      })
      const data = await response.json().catch(() => null)
      if (!response.ok || !data?.ok) throw new Error(data?.message || 'ChemAI chưa nhận xét được.')
      renderFeedback(result, data.feedback)
      announce('ChemAI đã gửi nhận xét tham khảo.')
    }
    catch (failure) {
      result.innerHTML = `<div class="px-feedback is-wrong" role="alert"><p>${escapeHTML(failure.message || 'ChemAI chưa nhận xét được.')}</p><p>Em vẫn có thể tự đối chiếu với các tiêu chí bên dưới.</p></div>`
      root.querySelector('[data-wr-rubric]').open = true
    }
    finally {
      button.disabled = false
      button.removeAttribute('aria-busy')
    }
  })

  if (focus) {
    scrollToTop()
    root.querySelector('[data-lx-heading]')?.focus({ preventScroll: true })
  }
}

function renderFeedback(container, feedback) {
  container.innerHTML = `
    <div class="px-feedback px-written__feedback">
      <p class="px-feedback__verdict">${icon('sparkle')}Nhận xét tham khảo</p>
      <p class="px-hint">ChemAI có thể nhầm. Nhận xét không phải điểm và không thay thế giáo viên.</p>
      <ul class="px-written__criteria">
        ${feedback.criteria.map(item => `
          <li class="is-${item.status}">
            <strong>${STATUS[item.status]}:</strong> ${escapeHTML(item.text)}
            ${item.comment ? `<p>${escapeHTML(item.comment)}</p>` : ''}
          </li>
        `).join('')}
      </ul>
      ${feedback.mistakes.length ? `<p class="px-feedback__label">Cần sửa</p><ul>${feedback.mistakes.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>` : ''}
      ${feedback.suggestions.length ? `<p class="px-feedback__label">Gợi ý cải thiện</p><ul>${feedback.suggestions.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>` : ''}
      ${feedback.summary ? `<p>${escapeHTML(feedback.summary)}</p>` : ''}
    </div>
  `
}
