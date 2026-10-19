// ChemLab Learning: Learning Home → Curriculum Browser → Step-by-Step Reader,
// plus the earlier quiz practice. Routes live in the hash:
//   #learning · #learning/grade-10 · #learning/lesson/g10-l1 · #learning/practice
import './learning.css'
import { icon } from '../shell/icons.js'
import { getProgressSummary, loadProgress } from '../progress/progressStorage.js'
import { GRADES, STATUS, CURRICULUM_SOURCES, getGrade, findLesson, loadLessonContent } from './catalog.js'
import { buildLegacyLesson } from './legacyAdapter.js'
import { parseRoute, routeHash } from './routes.js'
import { FIGURES } from './figures.js'
import {
  readLessonState,
  saveLessonState,
  completeLesson,
  missingSteps,
  lessonSummary,
  findContinueLesson
} from './lessonProgress.js'

const KIND_LABELS = {
  objectives: 'Mục tiêu',
  concept: 'Kiến thức',
  example: 'Ví dụ',
  practice: 'Thực hành',
  check: 'Kiểm tra nhanh',
  summary: 'Tổng kết'
}

const ACTION_LABELS = {
  atomic: 'Mở mô hình 3D',
  guided: 'Mở trong Phòng thí nghiệm',
  tool: 'Mở công cụ',
  periodic: 'Mở bảng tuần hoàn'
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char])
}

// Lesson text is plain text with **bold** as the only markup.
function rich(text) {
  return escapeHTML(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

function lessonCount(grade) {
  return grade.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0)
}

function statusBadge(status) {
  return `<span class="lx-status lx-status--${status}">${STATUS[status].label}</span>`
}

function nextLessonOf(lesson) {
  const lessons = getGrade(lesson.grade).chapters.flatMap(chapter => chapter.lessons)
  return lessons[lessons.findIndex(item => item.id === lesson.id) + 1] || null
}

export function initLearning(host) {
  const root = document.createElement('div')
  root.className = 'lx'
  host.appendChild(root)

  let route = parseRoute(location.hash) || { name: 'home' }
  let reader = null
  let practiceRoot = null
  let listsStale = false
  let renderToken = 0

  window.addEventListener('hashchange', () => {
    const next = parseRoute(location.hash)
    if (!next) return
    route = next
    render({ focus: true })
  })

  // Lists only change when progress is written elsewhere (Lab, practice);
  // redraw them the next time Learning is shown instead of while hidden.
  window.addEventListener('chemlab:progress-changed', () => {
    if (route.name === 'home' || route.name === 'grade') listsStale = true
  })

  window.addEventListener('chemlab:view-change', event => {
    if (event.detail?.view !== 'learning') return
    if (listsStale) render()
  })

  window.ChemLabLearning = Object.freeze({
    context,
    route: () => routeHash(route),
    open(hash) {
      location.hash = hash
    }
  })

  render()

  function go(hash) {
    if (location.hash === hash) render({ focus: true })
    else location.hash = hash
  }

  function announce(message) {
    const announcer = document.querySelector('#app-announcer')
    if (!announcer) return
    announcer.textContent = ''
    requestAnimationFrame(() => {
      announcer.textContent = message
    })
  }

  function scrollToTop() {
    document.querySelector('#workspace-main')?.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  function focusHeading(selector) {
    const heading = root.querySelector(selector)
    heading?.focus({ preventScroll: true })
  }

  function render({ focus = false } = {}) {
    listsStale = false
    renderToken += 1
    if (route.name !== 'lesson') reader = null

    if (route.name === 'grade') renderGrade(route.grade)
    else if (route.name === 'lesson') {
      void openLesson(route.lessonId, renderToken, focus)
      return
    }
    else if (route.name === 'practice') void renderPractice()
    else renderHome()

    if (focus) {
      scrollToTop()
      focusHeading('[data-lx-heading]')
    }
  }

  /* ---------- Learning Home ---------- */

  function renderHome() {
    const progress = loadProgress()
    const resume = findContinueLesson(progress)
    const first = findLesson('g10-l1')
    const target = resume?.entry || first

    const resumeCopy = resume
      ? (resume.completed ? 'Bài gần nhất' : 'Tiếp tục học')
      : 'Bắt đầu học'
    const resumeSummary = lessonSummary(target.lesson, progress)
    const resumeMeta = [
      `Lớp ${target.grade.grade}`,
      `Chương ${target.chapter.number}`,
      resume
        ? (resumeSummary.completed ? 'Đã hoàn thành' : `Đã học ${resumeSummary.progress}%`)
        : 'Bài đầu tiên của chương trình lớp 10'
    ].join(' · ')

    const published = GRADES.flatMap(grade => grade.chapters.flatMap(chapter => chapter.lessons))
      .filter(lesson => lesson.status === 'published')

    root.innerHTML = `
      <div class="lx-page">
        <header class="lx-head">
          <p class="ui-eyebrow">Hóa học THPT · Chương trình GDPT 2018</p>
          <h1 class="lx-title" data-lx-heading tabindex="-1">Học tập</h1>
          <p class="lx-lead">Học từng bài theo chương trình lớp 10–12. Mỗi bài chia thành các bước ngắn, có ví dụ giải mẫu và kiểm tra nhanh.</p>
        </header>

        <section class="lx-resume" aria-labelledby="lx-resume-title">
          <p class="lx-kicker">${resumeCopy}</p>
          <h2 class="lx-resume__title" id="lx-resume-title">Bài ${target.lesson.number} · ${escapeHTML(target.lesson.title)}</h2>
          <p class="lx-resume__meta">${escapeHTML(resumeMeta)}</p>
          ${resume ? `<div class="lx-meter" role="progressbar" aria-label="Tiến độ bài học" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${resumeSummary.progress}"><span style="width:${resumeSummary.progress}%"></span></div>` : ''}
          <a class="ui-btn ui-btn--primary ui-btn--lg lx-resume__action" href="${routeHash({ name: 'lesson', lessonId: target.lesson.id })}">
            ${resume && !resume.completed ? 'Tiếp tục bài học' : 'Mở bài học'} ${icon('arrowRight')}
          </a>
        </section>

        <section class="lx-section" aria-labelledby="lx-grades-title">
          <h2 class="lx-section__title" id="lx-grades-title">Chọn lớp</h2>
          <ul class="lx-grades">
            ${GRADES.map(grade => {
              const lessons = grade.chapters.flatMap(chapter => chapter.lessons)
              const done = lessons.filter(lesson => lessonSummary(lesson, progress).completed).length
              return `
                <li>
                  <a class="lx-grade" href="${routeHash({ name: 'grade', grade: grade.grade })}">
                    <span class="lx-grade__num" aria-hidden="true">${grade.grade}</span>
                    <span class="lx-grade__copy">
                      <strong>${escapeHTML(grade.title)}</strong>
                      <span>${grade.chapters.length} chương · ${lessons.length} bài</span>
                    </span>
                    <span class="lx-grade__done">${done}/${lessons.length} bài đã học</span>
                    ${icon('chevronRight', 'ui-icon lx-chevron')}
                  </a>
                </li>
              `
            }).join('')}
          </ul>
        </section>

        <section class="lx-section" aria-labelledby="lx-full-title">
          <h2 class="lx-section__title" id="lx-full-title">Bài học đầy đủ</h2>
          <p class="lx-section__note">Các bài đã biên soạn đủ lý thuyết, ví dụ và kiểm tra nhanh. Những bài còn lại đang ở dạng rút gọn từ phiên bản trước và sẽ được bổ sung dần.</p>
          <ul class="lx-list">
            ${published.map(lesson => lessonRow(lesson, progress, { showGrade: true })).join('')}
          </ul>
        </section>

        <section class="lx-section lx-aside" aria-labelledby="lx-practice-title">
          <div>
            <h2 class="lx-section__title" id="lx-practice-title">Luyện tập trắc nghiệm</h2>
            <p class="lx-section__note">Ôn theo chủ đề với câu hỏi ngẫu nhiên; các câu làm sai được đưa vào danh sách ôn lại.</p>
          </div>
          <a class="ui-btn" href="#learning/practice">Mở luyện tập ${icon('arrowRight')}</a>
        </section>
      </div>
    `
  }

  function lessonRow(lesson, progress, { showGrade = false } = {}) {
    const summary = lessonSummary(lesson, progress)
    const entry = findLesson(lesson.id)
    const state = summary.completed
      ? `<span class="lx-done">${icon('check')}Đã học</span>`
      : summary.started
        ? `<span class="lx-started">Đang học${summary.progress ? ` · ${summary.progress}%` : ''}</span>`
        : ''
    const label = showGrade
      ? `Lớp ${lesson.grade} · Chương ${entry.chapter.number} · Bài ${lesson.number}`
      : `Bài ${lesson.number}`
    return `
      <li>
        <a class="lx-row" href="${routeHash({ name: 'lesson', lessonId: lesson.id })}">
          <span class="lx-row__num">${escapeHTML(label)}</span>
          <span class="lx-row__title">${escapeHTML(lesson.title)}</span>
          <span class="lx-row__meta">${lesson.status === 'published' && !showGrade ? statusBadge('published') : lesson.status === 'catalogued' ? statusBadge('catalogued') : ''}${state}</span>
          ${icon('chevronRight', 'ui-icon lx-chevron')}
        </a>
      </li>
    `
  }

  /* ---------- Curriculum Browser ---------- */

  function renderGrade(gradeNumber) {
    const grade = getGrade(gradeNumber)
    const progress = loadProgress()

    root.innerHTML = `
      <div class="lx-page">
        <nav class="lx-crumbs" aria-label="Vị trí">
          <a href="#learning">${icon('arrowLeft')}Học tập</a>
        </nav>
        <header class="lx-head lx-head--split">
          <div>
            <p class="ui-eyebrow">Lớp ${grade.grade} · ${escapeHTML(grade.subtitle)}</p>
            <h1 class="lx-title" data-lx-heading tabindex="-1">${escapeHTML(grade.title)}</h1>
            <p class="lx-lead">${grade.chapters.length} chương · ${lessonCount(grade)} bài theo SGK Kết nối tri thức với cuộc sống.</p>
          </div>
          <nav class="ui-segmented lx-grade-switch" aria-label="Chọn lớp">
            ${GRADES.map(item => `<a href="${routeHash({ name: 'grade', grade: item.grade })}"${item.grade === grade.grade ? ' aria-current="page"' : ''}>Lớp ${item.grade}</a>`).join('')}
          </nav>
        </header>

        <p class="lx-legend">
          ${statusBadge('published')} ${escapeHTML(STATUS.published.description)}
          Các bài khác là bản rút gọn từ phiên bản trước.
        </p>

        ${grade.chapters.map(chapter => `
          <section class="lx-chapter" aria-labelledby="lx-${chapter.id}">
            <h2 class="lx-chapter__title" id="lx-${chapter.id}">
              <span class="lx-chapter__num">Chương ${chapter.number}</span>
              ${escapeHTML(chapter.title)}
            </h2>
            <ol class="lx-list">
              ${chapter.lessons.map(lesson => lessonRow(lesson, progress)).join('')}
            </ol>
          </section>
        `).join('')}
      </div>
    `
  }

  /* ---------- Step-by-Step Reader ---------- */

  function renderMessage({ title, text, actions = '', crumbs = '<a href="#learning">' + icon('arrowLeft') + 'Học tập</a>', role = 'status' }) {
    root.innerHTML = `
      <div class="lx-page">
        <nav class="lx-crumbs" aria-label="Vị trí">${crumbs}</nav>
        <div class="lx-message" role="${role}">
          <h1 class="lx-title" data-lx-heading tabindex="-1">${escapeHTML(title)}</h1>
          <p class="lx-lead">${text}</p>
          ${actions ? `<div class="lx-message__actions">${actions}</div>` : ''}
        </div>
      </div>
    `
  }

  async function openLesson(lessonId, token, focus) {
    const entry = findLesson(lessonId)
    if (!entry) {
      reader = null
      renderMessage({
        title: 'Không tìm thấy bài học',
        text: 'Liên kết có thể đã cũ hoặc bài học đã được đổi tên. Hãy chọn lại bài trong danh mục.',
        actions: '<a class="ui-btn ui-btn--primary" href="#learning">Về trang Học tập</a>',
        role: 'alert'
      })
      if (focus) focusHeading('[data-lx-heading]')
      return
    }

    const { lesson, chapter, grade } = entry
    const crumbs = `<a href="${routeHash({ name: 'grade', grade: grade.grade })}">${icon('arrowLeft')}${escapeHTML(grade.title)}</a>`

    if (reader?.lesson.id === lesson.id) {
      renderReader({ focus })
      return
    }

    if (lesson.status === 'catalogued') {
      reader = null
      const siblings = chapter.lessons.filter(item => item.id !== lesson.id)
      renderMessage({
        title: `Bài ${lesson.number}. ${lesson.title}`,
        text: `Bài này đã có trong danh mục chương trình (Chương ${chapter.number} · ${escapeHTML(chapter.title)}) nhưng chưa có nội dung. Trong lúc chờ, em có thể ôn lại các bài của chương:`,
        actions: `<ul class="lx-list">${siblings.map(item => lessonRow(item, loadProgress())).join('')}</ul>`,
        crumbs
      })
      if (focus) focusHeading('[data-lx-heading]')
      return
    }

    let content = null
    if (lesson.status === 'published') {
      renderMessage({ title: lesson.title, text: 'Đang tải bài học…', crumbs })
      try {
        content = await loadLessonContent(lesson.id)
      }
      catch (error) {
        console.error('[ChemLab Learning] Không tải được bài học:', error)
      }
      if (token !== renderToken) return
      if (!content) {
        renderMessage({
          title: lesson.title,
          text: 'Không tải được nội dung bài học. Hãy kiểm tra kết nối mạng rồi thử lại.',
          actions: '<button class="ui-btn ui-btn--primary" type="button" data-lx-retry>Thử lại</button>',
          crumbs,
          role: 'alert'
        })
        root.querySelector('[data-lx-retry]').addEventListener('click', () => render({ focus: true }))
        return
      }
    }
    else {
      content = buildLegacyLesson(lesson)
    }

    const state = readLessonState(lesson, content)
    const stepIndex = Math.max(0, content.steps.findIndex(step => step.id === state.currentStep))
    reader = { lesson, chapter, grade, content, state, stepIndex, finished: false }
    state.opened.add(content.steps[stepIndex].id)
    persist()
    renderReader({ focus, scroll: focus })
  }

  function persist() {
    try {
      saveLessonState(reader.lesson, reader.content, reader.state)
    }
    catch (error) {
      console.error('[ChemLab Learning] Không lưu được tiến độ:', error)
    }
  }

  function goToStep(index, { learned = false } = {}) {
    const { content, state } = reader
    if (learned) state.viewed.add(content.steps[reader.stepIndex].id)
    reader.stepIndex = Math.max(0, Math.min(content.steps.length - 1, index))
    const step = content.steps[reader.stepIndex]
    state.currentStep = step.id
    state.opened.add(step.id)
    persist()
    renderReader({ focus: true, scroll: true })
  }

  function renderReader({ focus = false, scroll = false } = {}) {
    const { lesson, chapter, grade, content, state, stepIndex } = reader
    const steps = content.steps
    const step = steps[stepIndex]
    const isLast = stepIndex === steps.length - 1
    const percent = Math.round((stepIndex + 1) / steps.length * 100)

    root.innerHTML = `
      <div class="lx-reader">
        <header class="lx-reader__head">
          <nav class="lx-crumbs" aria-label="Vị trí">
            <a href="${routeHash({ name: 'grade', grade: grade.grade })}">${icon('arrowLeft')}${escapeHTML(grade.title)}</a>
            <span>Chương ${chapter.number} · Bài ${lesson.number}</span>
          </nav>
          <h1 class="lx-reader__title">${escapeHTML(lesson.title)}</h1>
          <div class="lx-reader__status">
            ${statusBadge(content.status)}
            ${state.completed ? `<span class="lx-done">${icon('check')}Đã hoàn thành</span>` : ''}
            <span class="lx-stepcount">Bước ${stepIndex + 1}/${steps.length}</span>
            <button class="ui-btn ui-btn--sm lx-steps-toggle" type="button" aria-expanded="false" aria-controls="lx-steps">Các bước</button>
          </div>
          <div class="lx-meter" aria-hidden="true"><span style="width:${percent}%"></span></div>
        </header>

        <div class="lx-reader__body">
          <nav class="lx-steps" id="lx-steps" aria-label="Các bước của bài">
            <ol>
              ${steps.map((item, index) => {
                const learned = state.viewed.has(item.id)
                return `
                  <li>
                    <button type="button" data-step-index="${index}" class="${learned ? 'is-learned' : ''}"${index === stepIndex ? ' aria-current="step"' : ''}>
                      <span class="lx-steps__mark" aria-hidden="true">${learned ? icon('check') : index + 1}</span>
                      <span class="lx-steps__copy">
                        <small>${KIND_LABELS[item.kind] || 'Bước'}${learned ? '<span class="sr-only"> · đã học</span>' : ''}</small>
                        ${escapeHTML(item.title)}
                      </span>
                    </button>
                  </li>
                `
              }).join('')}
            </ol>
          </nav>

          <article class="lx-step lx-step--${step.kind}" aria-labelledby="lx-step-title">
            <p class="lx-step__kind">${KIND_LABELS[step.kind] || 'Bước'}</p>
            <h2 class="lx-step__title" id="lx-step-title" tabindex="-1">${escapeHTML(step.title)}</h2>
            ${content.status === 'legacy' && stepIndex === 0 ? `<div class="lx-callout lx-callout--note"><strong>Bản rút gọn</strong><p>${escapeHTML(STATUS.legacy.description)} Bài học đầy đủ sẽ được bổ sung trong các phiên bản tới.</p></div>` : ''}
            <div class="lx-step__body">
              ${step.blocks.map((block, index) => renderBlock(block, index)).join('')}
            </div>
            ${step.kind === 'objectives' && content.status === 'published' ? lessonMeta(content) : ''}
            ${isLast ? finishPanel() : ''}
            <footer class="lx-step__nav">
              ${stepIndex > 0
                ? `<button class="ui-btn ui-btn--ghost" type="button" data-step-prev>${icon('arrowLeft')}Bước trước</button>`
                : '<span></span>'}
              ${isLast
                ? ''
                : `<button class="ui-btn ui-btn--primary" type="button" data-step-next>Tiếp tục ${icon('arrowRight')}</button>`}
            </footer>
          </article>
        </div>
      </div>
    `

    bindReader()
    if (scroll) scrollToTop()
    if (focus) focusHeading('#lx-step-title')
  }

  function lessonMeta(content) {
    return `
      <details class="lx-meta">
        <summary>Yêu cầu cần đạt, nguồn và mức kiểm chứng</summary>
        <h3>Yêu cầu cần đạt</h3>
        <ul>${content.requirements.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
        <h3>Kiến thức cần có</h3>
        <ul>${content.prerequisites.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
        <h3>Nguồn tham khảo</h3>
        <ul>${content.sources.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
        <h3>Căn cứ chương trình</h3>
        <ul>${CURRICULUM_SOURCES.map(source => `<li><strong>${escapeHTML(source.title)}</strong> — ${escapeHTML(source.reference)}.</li>`).join('')}</ul>
        <h3>Mức kiểm chứng</h3>
        <p>${escapeHTML(content.verification.note)} Phiên bản nội dung ${content.contentVersion}, cập nhật ${escapeHTML(content.verification.date)}.</p>
      </details>
    `
  }

  function finishPanel() {
    const { lesson, content, state } = reader
    const next = nextLessonOf(lesson)
    const nextLink = next
      ? `<a class="ui-btn ui-btn--primary" href="${routeHash({ name: 'lesson', lessonId: next.id })}">Bài tiếp theo: Bài ${next.number} ${icon('arrowRight')}</a>`
      : ''
    const backLink = `<a class="ui-btn" href="${routeHash({ name: 'grade', grade: lesson.grade })}">Về danh mục lớp ${lesson.grade}</a>`

    if (state.completed) {
      return `
        <section class="lx-finish is-done" aria-labelledby="lx-finish-title">
          <h3 id="lx-finish-title">${icon('check')}${reader.finished ? 'Em đã hoàn thành bài học' : 'Bài học đã hoàn thành'}</h3>
          ${next ? `<p>Tiếp theo là <strong>Bài ${next.number}. ${escapeHTML(next.title)}</strong>.</p>` : '<p>Đây là bài cuối cùng của lớp này.</p>'}
          <div class="lx-finish__actions">${nextLink}${backLink}</div>
        </section>
      `
    }

    const stepIds = content.steps.map(step => step.id)
    const missing = missingSteps(stepIds, state.viewed)
    if (missing.length) {
      return `
        <section class="lx-finish" aria-labelledby="lx-finish-title">
          <h3 id="lx-finish-title">Còn ${missing.length} bước chưa học</h3>
          <p>Một bước được tính là đã học khi em bấm “Tiếp tục” ở bước đó. Hãy xem lại:</p>
          <ul class="lx-finish__missing">
            ${missing.map(id => {
              const index = stepIds.indexOf(id)
              return `<li><button class="lx-link" type="button" data-step-index="${index}">Bước ${index + 1}: ${escapeHTML(content.steps[index].title)}</button></li>`
            }).join('')}
          </ul>
        </section>
      `
    }

    return `
      <section class="lx-finish" aria-labelledby="lx-finish-title">
        <h3 id="lx-finish-title">Em đã học hết các bước</h3>
        <p>Đánh dấu hoàn thành để lưu vào tiến độ học tập.</p>
        <div class="lx-finish__actions">
          <button class="ui-btn ui-btn--primary" type="button" data-lesson-complete>${icon('check')}Hoàn thành bài học</button>
        </div>
      </section>
    `
  }

  /* ---------- Content blocks ---------- */

  function renderBlock(block, index) {
    switch (block.type) {
      case 'p':
        return `<p>${rich(block.text)}</p>`
      case 'heading':
        return `<h3 class="lx-h3">${rich(block.text)}</h3>`
      case 'list': {
        const items = (block.items || []).filter(Boolean)
        if (!items.length) return ''
        const tag = block.ordered ? 'ol' : 'ul'
        return `<${tag} class="lx-bullets">${items.map(item => `<li>${rich(item)}</li>`).join('')}</${tag}>`
      }
      case 'equation':
        return `
          <div class="lx-equation">
            <p class="lx-equation__text">${escapeHTML(block.text)}</p>
            ${block.note ? `<p class="lx-equation__note">${rich(block.note)}</p>` : ''}
          </div>
        `
      case 'table':
        return renderTable(block)
      case 'callout':
        return `
          <div class="lx-callout lx-callout--${block.tone || 'key'}">
            ${block.title ? `<strong>${escapeHTML(block.title)}</strong>` : ''}
            <p>${rich(block.text)}</p>
          </div>
        `
      case 'figure': {
        const figure = FIGURES[block.figure]
        if (!figure) return ''
        return `
          <figure class="lx-figure">
            ${figure.svg}
            <figcaption>${escapeHTML(figure.caption)}</figcaption>
          </figure>
        `
      }
      case 'worked':
        return `
          <div class="lx-worked">
            <p class="lx-worked__label">Đề bài</p>
            <p class="lx-worked__problem">${rich(block.problem)}</p>
            <p class="lx-worked__label">Lời giải</p>
            ${block.table ? renderTable(block.table) : ''}
            <ol class="lx-worked__steps">${block.steps.map(item => `<li>${rich(item)}</li>`).join('')}</ol>
            <p class="lx-worked__answer"><strong>Kết luận:</strong> ${rich(block.answer)}</p>
          </div>
        `
      case 'quiz':
        return renderQuiz(block)
      case 'activity':
        return `
          <div class="lx-activity">
            <div class="lx-activity__copy">
              <strong>${escapeHTML(block.title)}</strong>
              <p>${rich(block.text)}</p>
            </div>
            <button class="ui-btn" type="button" data-activity="${index}">
              ${ACTION_LABELS[block.action.kind] || 'Mở'} ${icon('arrowRight')}
            </button>
          </div>
        `
      default:
        return ''
    }
  }

  function renderTable(block) {
    return `
      <div class="lx-table" role="region" aria-label="${escapeHTML(block.caption || 'Bảng')}" tabindex="0">
        <table>
          ${block.caption ? `<caption>${escapeHTML(block.caption)}</caption>` : ''}
          <thead><tr>${block.head.map(cell => cell ? `<th scope="col">${escapeHTML(cell)}</th>` : '<td></td>').join('')}</tr></thead>
          <tbody>${block.rows.map(row => `<tr>${row.map((cell, column) => column === 0 ? `<th scope="row">${escapeHTML(cell)}</th>` : `<td>${escapeHTML(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>
    `
  }

  function renderQuiz(block) {
    const answer = reader.state.answers[block.id]
    const letters = ['A', 'B', 'C', 'D', 'E', 'F']
    const correctIndex = block.options.findIndex(option => option.id === block.correct)
    return `
      <fieldset class="lx-quiz${answer ? ' is-answered' : ''}" data-quiz="${escapeHTML(block.id)}">
        <legend>${rich(block.question)}</legend>
        <div class="lx-quiz__options">
          ${block.options.map((option, index) => {
            const chosen = answer?.choice === option.id
            const state = answer
              ? option.id === block.correct ? ' is-correct' : chosen ? ' is-wrong' : ''
              : ''
            return `
              <button type="button" class="lx-option${state}" data-quiz-option="${escapeHTML(option.id)}" aria-pressed="${chosen}"${answer ? ' aria-disabled="true"' : ''}>
                <span class="lx-option__letter" aria-hidden="true">${letters[index]}</span>
                <span>${rich(option.text)}</span>
              </button>
            `
          }).join('')}
        </div>
        <div class="lx-quiz__feedback">
          ${answer ? `
            <p class="lx-quiz__verdict ${answer.correct ? 'is-correct' : 'is-wrong'}">
              ${answer.correct ? `${icon('check')}Chính xác.` : `Chưa đúng. Đáp án đúng: ${letters[correctIndex]}.`}
            </p>
            <p>${rich(block.explanation)}</p>
            <button class="lx-link" type="button" data-quiz-retry>Làm lại câu này</button>
          ` : ''}
        </div>
      </fieldset>
    `
  }

  function bindReader() {
    const toggle = root.querySelector('.lx-steps-toggle')
    const stepsNav = root.querySelector('.lx-steps')
    toggle?.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true'
      toggle.setAttribute('aria-expanded', String(open))
      stepsNav.classList.toggle('is-open', open)
      if (open) stepsNav.querySelector('[aria-current="step"]')?.focus()
    })

    root.querySelector('[data-step-prev]')?.addEventListener('click', () => goToStep(reader.stepIndex - 1))
    root.querySelector('[data-step-next]')?.addEventListener('click', () => goToStep(reader.stepIndex + 1, { learned: true }))
    root.querySelectorAll('[data-step-index]').forEach(button => {
      button.addEventListener('click', () => goToStep(Number(button.dataset.stepIndex)))
    })

    root.querySelector('[data-lesson-complete]')?.addEventListener('click', () => {
      const { lesson, content, state } = reader
      state.viewed.add(content.steps[reader.stepIndex].id)
      state.completed = true
      reader.finished = true
      try {
        completeLesson(lesson, content, state)
      }
      catch (error) {
        console.error('[ChemLab Learning] Không lưu được trạng thái hoàn thành:', error)
      }
      renderReader()
      root.querySelector('#lx-finish-title')?.setAttribute('tabindex', '-1')
      root.querySelector('#lx-finish-title')?.focus()
    })

    root.querySelectorAll('[data-quiz]').forEach(fieldset => {
      const id = fieldset.dataset.quiz
      bindQuiz(fieldset, reader.content.steps[reader.stepIndex].blocks.find(item => item.type === 'quiz' && item.id === id))
    })

    root.querySelectorAll('[data-activity]').forEach(button => {
      const block = reader.content.steps[reader.stepIndex].blocks[Number(button.dataset.activity)]
      button.addEventListener('click', () => void runActivity(block.action, button))
    })
  }

  function replaceQuiz(fieldset, block, focusSelector) {
    const template = document.createElement('template')
    template.innerHTML = renderQuiz(block).trim()
    const next = template.content.firstElementChild
    fieldset.replaceWith(next)
    bindQuiz(next, block)
    next.querySelector(focusSelector)?.focus()
  }

  function bindQuiz(fieldset, block) {
    fieldset.addEventListener('click', event => {
      const option = event.target.closest('[data-quiz-option]')
      const retry = event.target.closest('[data-quiz-retry]')
      if (retry) {
        delete reader.state.answers[block.id]
        persist()
        replaceQuiz(fieldset, block, '[data-quiz-option]')
        return
      }
      if (!option || reader.state.answers[block.id]) return
      const choice = option.dataset.quizOption
      reader.state.answers[block.id] = { choice, correct: choice === block.correct }
      persist()
      announce(choice === block.correct ? 'Chính xác.' : 'Chưa đúng. Xem đáp án và giải thích bên dưới.')
      replaceQuiz(fieldset, block, `[data-quiz-option="${CSS.escape(choice)}"]`)
    })
  }

  async function runActivity(action, button) {
    button.disabled = true
    try {
      if (action.kind === 'atomic') {
        const { openAtomicExplorer } = await import('../atomic/atomicExplorer.js')
        await openAtomicExplorer(action.element, { mode: action.mode || 'shell' })
      }
      else if (action.kind === 'guided') {
        await openGuidedActivity(action)
      }
      else if (action.kind === 'tool') {
        await window.ChemLabApp?.openTool(action.tool)
      }
      else if (action.kind === 'periodic') {
        window.ChemLabApp?.navigate('periodic')
        window.ChemLabPeriodic?.openElement(action.element)
      }
    }
    catch (error) {
      console.error('[ChemLab Learning] Không mở được hoạt động:', error)
      const note = document.createElement('p')
      note.className = 'lx-error'
      note.setAttribute('role', 'alert')
      note.textContent = 'Không mở được hoạt động này. Hãy thử lại sau.'
      button.closest('.lx-activity')?.append(note)
    }
    finally {
      button.disabled = false
    }
  }

  // The Lab registers its guided-lesson listener when its route finishes
  // loading, so wait for it before dispatching the request.
  async function openGuidedActivity(action) {
    window.ChemLabApp?.navigate('lab')
    const started = performance.now()
    while (!window.ChemLabGuidedLab) {
      if (performance.now() - started > 15000) throw new Error('Guided Lab chưa sẵn sàng')
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    window.dispatchEvent(new CustomEvent('chemlab:open-guided-lesson', {
      detail: { grade: action.grade, lessonId: action.lessonId, experimentId: action.experimentId }
    }))
  }

  /* ---------- Practice (quiz from earlier versions) ---------- */

  async function renderPractice() {
    const token = renderToken
    root.innerHTML = `
      <div class="lx-page lx-page--wide lx-practice">
        <nav class="lx-crumbs" aria-label="Vị trí">
          <a href="#learning">${icon('arrowLeft')}Học tập</a>
        </nav>
        <header class="lx-head">
          <h1 class="lx-title" data-lx-heading tabindex="-1">Luyện tập trắc nghiệm</h1>
          <p class="lx-lead">Chọn chủ đề, độ khó và số câu. Câu làm sai được lưu để ôn lại.</p>
        </header>
        <div data-practice-host><p class="lx-lead" role="status">Đang tải phần luyện tập…</p></div>
      </div>
    `

    try {
      if (!practiceRoot) {
        const { initQuiz } = await import('../quiz.js')
        practiceRoot = initQuiz(document.createElement('div'))
      }
    }
    catch (error) {
      console.error('[ChemLab Learning] Không tải được phần luyện tập:', error)
      if (token !== renderToken) return
      root.querySelector('[data-practice-host]').innerHTML = `
        <div class="lx-message" role="alert">
          <p class="lx-lead">Không tải được phần luyện tập. Hãy kiểm tra kết nối mạng rồi thử lại.</p>
          <button class="ui-btn ui-btn--primary" type="button" data-lx-retry>Thử lại</button>
        </div>
      `
      root.querySelector('[data-lx-retry]').addEventListener('click', () => render({ focus: true }))
      return
    }

    if (token !== renderToken) return
    root.querySelector('[data-practice-host]').replaceChildren(practiceRoot)
  }

  /* ---------- ChemAI context ---------- */

  function context() {
    const practice = route.name === 'practice' ? window.ChemLabPractice?.context?.() || null : null
    const step = reader ? reader.content.steps[reader.stepIndex] : null
    return {
      view: route.name,
      grade: reader?.grade.grade ?? (route.name === 'grade' ? route.grade : null),
      lesson: reader
        ? {
            id: reader.lesson.id,
            title: reader.lesson.title,
            number: reader.lesson.number,
            chapter: reader.chapter.title,
            status: reader.content.status
          }
        : null,
      step: step
        ? {
            id: step.id,
            title: step.title,
            kind: KIND_LABELS[step.kind] || step.kind,
            index: reader.stepIndex + 1,
            total: reader.content.steps.length
          }
        : null,
      topicName: reader
        ? `Lớp ${reader.grade.grade} · ${reader.lesson.title}`
        : practice?.topicName || null,
      practice,
      summary: getProgressSummary()
    }
  }
}
