
import { elements } from '../data/elements.js'
import { icon } from '../shell/icons.js'

const TOTALS = Object.freeze({
  10: { lessons: 22, experiments: 23 },
  11: { lessons: 25, experiments: 25 },
  12: { lessons: 30, experiments: 30 }
})
const TOTAL_LESSONS = 77
const TOTAL_EXPERIMENTS = 78

const CATEGORY_VI = Object.freeze({
  'Nonmetal': 'Phi kim',
  'Noble gas': 'Khí hiếm',
  'Alkali metal': 'Kim loại kiềm',
  'Alkaline earth metal': 'Kim loại kiềm thổ',
  'Metalloid': 'Á kim',
  'Halogen': 'Halogen',
  'Post-transition metal': 'Kim loại sau chuyển tiếp',
  'Transition metal': 'Kim loại chuyển tiếp',
  'Lanthanide': 'Họ Lanthanide',
  'Actinide': 'Họ Actinide'
})

const WORKSPACES = [
  { view: 'periodic', icon: 'table', title: 'Bảng tuần hoàn', copy: 'Tra cứu 118 nguyên tố, cấu hình electron, mô hình nguyên tử và orbital.', meta: '118 nguyên tố' },
  { view: 'tools', icon: 'tools', title: 'Công cụ', copy: 'Cân bằng phương trình, tính mol – nồng độ, tra ion và độ tan.', meta: '7 công cụ' },
  { view: 'learning', icon: 'learn', title: 'Học tập', copy: 'Học theo chương trình lớp 10–12, luyện tập và theo dõi mức thành thạo.', meta: '21 chương · 77 bài' },
  { view: 'lab', icon: 'lab', title: 'Phòng thí nghiệm', copy: 'Trộn hóa chất, quan sát hiện tượng và làm thí nghiệm có hướng dẫn.', meta: '103 hóa chất · 96 phản ứng' }
]

const TOOLS = [
  { tool: 'balancer', icon: 'scale', label: 'Cân bằng PTHH' },
  { tool: 'calculator', icon: 'calculator', label: 'Máy tính hóa học' },
  { tool: 'solubility', icon: 'droplets', label: 'Bảng tính tan' },
  { tool: 'ions', icon: 'ion', label: 'Ion Engine' },
  { tool: 'orbital', icon: 'atom', label: 'Orbital Atlas' },
  { tool: 'compound', icon: 'compound', label: 'Compound Studio' },
  { tool: 'reaction', icon: 'reaction', label: 'Reaction Studio' }
]

const FLOW = [
  { attr: 'data-app-view="periodic"', title: 'Nguyên tố', where: 'Bảng tuần hoàn' },
  { attr: 'data-app-tool="ions"', title: 'Ion', where: 'Ion Engine' },
  { attr: 'data-app-tool="compound"', title: 'Hợp chất', where: 'Compound Studio' },
  { attr: 'data-app-tool="reaction"', title: 'Phản ứng', where: 'Reaction Studio' },
  { attr: 'data-app-view="lab"', title: 'Thí nghiệm', where: 'Phòng thí nghiệm' },
  { attr: 'data-app-view="learning"', title: 'Hiểu sâu', where: 'Học tập' }
]

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Number(value) || 0))
}

function percent(done, total) {
  if (!total) return 0
  return Math.round(clamp((Number(done) / Number(total)) * 100))
}

function formatMinutes(seconds) {
  const minutes = Math.round((Number(seconds) || 0) / 60)
  if (minutes < 60) return `${minutes} phút`
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return remainder ? `${hours} giờ ${remainder} phút` : `${hours} giờ`
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char])
}

function greeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 11) return 'Chào buổi sáng'
  if (hour < 14) return 'Chào buổi trưa'
  if (hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

function elementOfTheDay(date = new Date()) {
  const dayIndex = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000
  )
  return elements[dayIndex % elements.length]
}

function formatMass(mass) {
  const value = Number(mass)
  if (!Number.isFinite(value)) return '—'
  return Number.isInteger(value) ? `[${value}]` : value.toLocaleString('vi-VN', { maximumFractionDigits: 3 })
}

function continueTarget(activity) {
  if (!activity) {
    return {
      view: 'learning',
      kind: 'Bắt đầu',
      title: 'Bài 1 · Thành phần của nguyên tử',
      copy: 'Lớp 10 · Cấu tạo nguyên tử. Bắt đầu từ nền tảng: proton, neutron và electron.'
    }
  }

  if (activity.type === 'experiment') {
    return {
      view: 'lab',
      kind: activity.completed ? 'Thí nghiệm gần nhất' : 'Tiếp tục thí nghiệm',
      title: `Thí nghiệm lớp ${activity.grade || ''}`.trim(),
      copy: 'Quay lại thí nghiệm có hướng dẫn và tiếp tục từ tiến độ đã lưu.'
    }
  }

  return {
    view: 'learning',
    kind: activity.completed ? 'Bài gần nhất' : 'Tiếp tục học',
    title: `Bài học lớp ${activity.grade || ''}`.trim(),
    copy: 'Tiếp tục bài gần nhất hoặc chọn bài mới trong Học tập.'
  }
}

async function resolveActivityTitle(activity) {
  if (!activity) return null

  try {
    if (activity.type === 'experiment' && activity.experimentId) {
      const { getExperimentById } = await import('../lab/experiments/experiments.js')
      return getExperimentById(activity.experimentId)?.title || null
    }

    if (activity.lessonId) {
      const { getLessonById } = await import('../lab/experiments/curriculum.js')
      const lesson = getLessonById(activity.grade, activity.lessonId)
      return lesson ? `Bài ${lesson.number} · ${lesson.title}` : null
    }
  }
  catch {
  }

  return null
}

function ring(value, label) {
  const circumference = 2 * Math.PI * 22
  const offset = circumference * (1 - clamp(value) / 100)
  return `
    <svg class="dash-ring" viewBox="0 0 52 52" role="img" aria-label="${label}">
      <circle cx="26" cy="26" r="22" class="dash-ring__track"/>
      <circle cx="26" cy="26" r="22" class="dash-ring__value"
        stroke-dasharray="${circumference.toFixed(2)}"
        stroke-dashoffset="${offset.toFixed(2)}"/>
    </svg>
  `
}

export function createHomeDashboard({ root, getProgressSummary, getGradeSummary }) {
  if (!root) {
    return Object.freeze({ refresh() {} })
  }

  let renderToken = 0

  function refresh() {
    const token = ++renderToken
    const summary = getProgressSummary?.() || {}
    const completedLessons = Number(summary.completedLessons) || 0
    const completedExperiments = Number(summary.completedExperiments) || 0
    const totalAnswers = Number(summary.totalAnswers) || 0
    const correctAnswers = Number(summary.correctAnswers) || 0
    const accuracy = totalAnswers ? Math.round((correctAnswers / totalAnswers) * 100) : null
    const overall = percent(completedLessons + completedExperiments, TOTAL_LESSONS + TOTAL_EXPERIMENTS)
    const isNewLearner = !summary.lastActivity && !completedLessons && !completedExperiments && !totalAnswers
    const target = continueTarget(summary.lastActivity)
    const element = elementOfTheDay()

    const grades = [10, 11, 12].map(grade => {
      const data = getGradeSummary?.(grade) || {}
      const totals = TOTALS[grade]
      const lessons = Number(data.completedLessons) || 0
      const experiments = Number(data.completedExperiments) || 0
      return {
        grade,
        lessons,
        experiments,
        totals,
        combined: percent(lessons + experiments, totals.lessons + totals.experiments)
      }
    })

    root.innerHTML = `
      <div class="dash">
        <section class="dash-hero" aria-labelledby="dash-title">
          <div class="dash-hero__copy">
            <span class="ui-eyebrow">${greeting()} · Phòng thí nghiệm Hóa học số</span>
            <h1 id="dash-title">Hôm nay bạn muốn khám phá điều gì?</h1>
            <p>
              Tra cứu nguyên tố, giải bài tập bằng công cụ, học theo chương trình THPT
              và kiểm chứng kiến thức trong phòng thí nghiệm ảo.
            </p>
            <div class="dash-hero__actions">
              <button class="ui-btn ui-btn--primary ui-btn--lg" type="button" data-app-view="${target.view}">
                ${icon('play')}
                <span>${isNewLearner ? 'Bắt đầu học' : 'Tiếp tục'}</span>
              </button>
              <button class="ui-btn ui-btn--lg" type="button" data-app-view="periodic">
                ${icon('table')}
                <span>Bảng tuần hoàn</span>
              </button>
              <button class="ui-btn ui-btn--ghost ui-btn--lg" type="button" data-chemai-open>
                ${icon('ai')}
                <span>Hỏi ChemAI</span>
              </button>
            </div>
          </div>

          <article class="dash-element" aria-labelledby="dash-element-title">
            <header class="dash-element__head">
              <span class="ui-eyebrow">Nguyên tố hôm nay</span>
              <span class="ui-badge">${CATEGORY_VI[element.category] || element.category}</span>
            </header>
            <div class="dash-element__body">
              <div class="dash-element__tile" aria-hidden="true">
                <span class="dash-element__z">${element.number}</span>
                <strong>${element.symbol}</strong>
                <span class="dash-element__mass">${formatMass(element.mass)}</span>
              </div>
              <dl class="dash-element__facts">
                <div><dt>Tên</dt><dd id="dash-element-title">${escapeHTML(element.name)}</dd></div>
                <div><dt>Số hiệu nguyên tử</dt><dd>Z = ${element.number}</dd></div>
                <div><dt>Nguyên tử khối</dt><dd>${formatMass(element.mass)}</dd></div>
              </dl>
            </div>
            <button class="ui-btn ui-btn--block dash-element__cta" type="button" data-open-element="${element.number}">
              Xem chi tiết ${escapeHTML(element.symbol)}
              ${icon('arrowRight')}
            </button>
          </article>
        </section>

        <section class="dash-row" aria-label="Tiến độ của bạn">
          <article class="dash-continue ui-card">
            <span class="ui-eyebrow">${target.kind}</span>
            <h2 data-continue-title>${escapeHTML(target.title)}</h2>
            <p>${target.copy}</p>
            <button class="ui-btn ui-btn--primary" type="button" data-app-view="${target.view}">
              ${isNewLearner ? 'Bắt đầu bài học' : 'Mở lại'}
              ${icon('arrowRight')}
            </button>
          </article>

          <article class="dash-progress ui-card" aria-labelledby="dash-progress-title">
            <header>
              <h2 id="dash-progress-title">Tiến độ tổng</h2>
              ${isNewLearner ? '<span class="ui-badge">Chưa bắt đầu</span>' : `<strong class="dash-progress__value">${overall}%</strong>`}
            </header>
            <div class="ui-progress" role="progressbar" aria-label="Tiến độ tổng" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${overall}">
              <span style="--value:${overall}%"></span>
            </div>
            <dl class="dash-stats">
              <div><dt>${icon('learn')}Bài học</dt><dd>${completedLessons}<small>/${TOTAL_LESSONS}</small></dd></div>
              <div><dt>${icon('lab')}Thí nghiệm</dt><dd>${completedExperiments}<small>/${TOTAL_EXPERIMENTS}</small></dd></div>
              <div><dt>${icon('target')}Độ chính xác</dt><dd>${accuracy === null ? '—' : `${accuracy}%`}</dd></div>
              <div><dt>${icon('clock')}Thời gian học</dt><dd>${formatMinutes(summary.learningTimeSeconds)}</dd></div>
            </dl>
          </article>
        </section>

        <section class="dash-section" aria-labelledby="dash-workspaces">
          <div class="ui-section-head">
            <div>
              <h2 id="dash-workspaces">Không gian làm việc</h2>
              <p>Mỗi khu vực chia sẻ ngữ cảnh với nhau và với ChemAI.</p>
            </div>
          </div>
          <div class="dash-workspaces">
            ${WORKSPACES.map(item => `
              <button class="dash-workspace ui-card ui-card--interactive" type="button" data-app-view="${item.view}" data-accent="${item.view}">
                <span class="dash-workspace__icon">${icon(item.icon)}</span>
                <strong>${item.title}</strong>
                <span class="dash-workspace__copy">${item.copy}</span>
                <span class="dash-workspace__meta">${item.meta}${icon('arrowRight')}</span>
              </button>
            `).join('')}
          </div>
        </section>

        <section class="dash-section" aria-labelledby="dash-tools">
          <div class="ui-section-head">
            <div>
              <h2 id="dash-tools">Công cụ nhanh</h2>
              <p>Mở thẳng công cụ bạn cần.</p>
            </div>
            <button class="ui-btn ui-btn--ghost ui-btn--sm" type="button" data-app-view="tools">Tất cả công cụ ${icon('arrowRight')}</button>
          </div>
          <div class="dash-tools">
            ${TOOLS.map(item => `
              <button class="dash-tool" type="button" data-app-tool="${item.tool}">
                <span>${icon(item.icon)}</span>
                ${item.label}
              </button>
            `).join('')}
          </div>
        </section>

        <section class="dash-section" aria-labelledby="dash-flow">
          <div class="ui-section-head">
            <div>
              <h2 id="dash-flow">Chem Flow</h2>
              <p>Đi từ một nguyên tố đến phản ứng và thí nghiệm — ngữ cảnh được mang theo ở mỗi bước.</p>
            </div>
          </div>
          <ol class="dash-flow">
            ${FLOW.map((step, index) => `
              <li>
                <button type="button" ${step.attr}>
                  <span class="dash-flow__index">${String(index + 1).padStart(2, '0')}</span>
                  <strong>${step.title}</strong>
                  <small>${step.where}</small>
                </button>
              </li>
            `).join('')}
          </ol>
        </section>

        <section class="dash-section" aria-labelledby="dash-grades">
          <div class="ui-section-head">
            <div>
              <h2 id="dash-grades">Lộ trình theo khối</h2>
              <p>Bài học và thí nghiệm có hướng dẫn của từng lớp.</p>
            </div>
            <button class="ui-btn ui-btn--ghost ui-btn--sm" type="button" data-app-view="learning">Mở Học tập ${icon('arrowRight')}</button>
          </div>
          <div class="dash-grades">
            ${grades.map(item => `
              <button class="dash-grade ui-card ui-card--interactive" type="button" data-app-view="learning">
                <span class="dash-grade__ring">
                  ${ring(item.combined, `Lớp ${item.grade}: hoàn thành ${item.combined}%`)}
                  <span>${item.combined}%</span>
                </span>
                <span class="dash-grade__copy">
                  <strong>Hóa học ${item.grade}</strong>
                  <small>${item.lessons}/${item.totals.lessons} bài · ${item.experiments}/${item.totals.experiments} thí nghiệm</small>
                </span>
              </button>
            `).join('')}
          </div>
        </section>
      </div>
    `

    resolveActivityTitle(summary.lastActivity).then(resolved => {
      if (!resolved || token !== renderToken) return
      const heading = root.querySelector('[data-continue-title]')
      if (heading) heading.textContent = resolved
    })
  }

  root.addEventListener('click', event => {
    const trigger = event.target.closest('[data-open-element]')
    if (!trigger) return
    window.ChemLabApp?.navigate('periodic')
    window.ChemLabPeriodic?.openElement(trigger.dataset.openElement)
  })

  window.addEventListener('chemlab:progress-changed', () => {
    if (!root.closest('[hidden]')) refresh()
  })

  refresh()

  return Object.freeze({ refresh })
}
