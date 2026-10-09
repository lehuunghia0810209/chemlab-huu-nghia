const TOTALS = Object.freeze({
  10: { lessons: 22, experiments: 23 },
  11: { lessons: 25, experiments: 25 },
  12: { lessons: 30, experiments: 30 }
})

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

function getContinueTarget(summary) {
  const activity = summary?.lastActivity
  if (!activity) {
    return {
      view: 'learning',
      eyebrow: 'BẮT ĐẦU HỌC',
      title: 'Khởi động hành trình Hóa học',
      description: 'Chọn lớp, bài học hoặc bắt đầu một phiên luyện tập thông minh.'
    }
  }

  if (activity.type === 'experiment') {
    return {
      view: 'lab',
      eyebrow: 'TIẾP TỤC THÍ NGHIỆM',
      title: `Thí nghiệm lớp ${activity.grade || ''}`.trim(),
      description: 'Quay lại Guided Lab gần nhất và tiếp tục từ tiến độ đã lưu.'
    }
  }

  return {
    view: 'learning',
    eyebrow: 'TIẾP TỤC HỌC',
    title: activity.lessonTitle || `Bài học lớp ${activity.grade || ''}`.trim(),
    description: 'Tiếp tục bài gần nhất hoặc chọn một bài mới trong Learning.'
  }
}

function icon(name) {
  const paths = {
    spark: '<path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2Z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"/>',
    table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v16M14 9v11"/>',
    tools: '<path d="m14.7 6.3 3-3a5 5 0 0 1-6.4 6.4l-7 7a2 2 0 0 0 2.8 2.8l7-7a5 5 0 0 1 6.4-6.4l-3 3-2.8-2.8Z"/>',
    learn: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H11v16H6.5A2.5 2.5 0 0 0 4 22V6.5Z"/><path d="M20 6.5A2.5 2.5 0 0 0 17.5 4H13v16h4.5A2.5 2.5 0 0 1 20 22V6.5Z"/>',
    lab: '<path d="M8 3h8M9 3v6l-5 9a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 18l-5-9V3M7 15h10"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    bolt: '<path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 2v3M22 12h-3M12 22v-3M2 12h3"/>'
  }

  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.spark}</svg>`
}

function quickAction(view, iconName, title, copy, accent) {
  return `
    <button class="cl6-quick-card ${accent}" type="button" data-app-view="${view}">
      <span class="cl6-quick-icon">${icon(iconName)}</span>
      <span class="cl6-quick-copy">
        <strong>${title}</strong>
        <small>${copy}</small>
      </span>
      <span class="cl6-quick-arrow">${icon('arrow')}</span>
    </button>
  `
}

export function createHomeDashboard({
  root,
  getProgressSummary,
  getGradeSummary
}) {
  if (!root) {
    return Object.freeze({ refresh() {} })
  }

  function refresh() {
    const summary = getProgressSummary?.() || {}
    const grades = [10, 11, 12].map(grade => {
      const data = getGradeSummary?.(grade) || {}
      const totals = TOTALS[grade]
      const lessonPercent = percent(data.completedLessons, totals.lessons)
      const experimentPercent = percent(data.completedExperiments, totals.experiments)
      const combined = Math.round((lessonPercent + experimentPercent) / 2)
      return { grade, data, totals, combined }
    })

    const completedLessons = Number(summary.completedLessons) || 0
    const completedExperiments = Number(summary.completedExperiments) || 0
    const totalAnswers = Number(summary.totalAnswers) || 0
    const correctAnswers = Number(summary.correctAnswers) || 0
    const accuracy = totalAnswers ? Math.round((correctAnswers / totalAnswers) * 100) : 0
    const overall = percent(completedLessons + completedExperiments, 77 + 78)
    const continueTarget = getContinueTarget(summary)

    root.innerHTML = `
      <div class="cl6-home">
        <section class="cl6-hero" aria-labelledby="cl6-home-title">
          <div class="cl6-hero-orbit" aria-hidden="true">
            <span class="cl6-orbit-core">Cl</span>
            <span class="cl6-orbit-ring ring-a"><i></i></span>
            <span class="cl6-orbit-ring ring-b"><i></i></span>
          </div>

          <div class="cl6-hero-copy">
            <span class="cl6-kicker">CHEMLAB 6.2 · FINAL</span>
            <h1 id="cl6-home-title">Một không gian Hóa học. Mọi thứ kết nối.</h1>
            <p>
              Khám phá nguyên tố, giải bài, học theo lộ trình và kiểm chứng kiến thức
              trong phòng thí nghiệm ảo — tất cả trong cùng một workspace.
            </p>
            <div class="cl6-hero-actions">
              <button class="cl6-button primary" type="button" data-app-view="${continueTarget.view}">
                ${icon('bolt')}
                <span>Tiếp tục ngay</span>
              </button>
              <button class="cl6-button ghost" type="button" data-app-view="periodic">
                ${icon('table')}
                <span>Khám phá bảng tuần hoàn</span>
              </button>
              <button class="cl6-button ghost cl6-ai-cta" type="button" data-chemai-open>
                ${icon('spark')}
                <span>Hỏi ChemAI</span>
              </button>
            </div>
          </div>

          <div class="cl6-hero-metrics" aria-label="Tổng quan tiến độ">
            <article>
              <span>Tiến độ tổng</span>
              <strong>${overall}%</strong>
              <div class="cl6-meter"><i style="--value:${overall}%"></i></div>
            </article>
            <article>
              <span>Độ chính xác</span>
              <strong>${accuracy}%</strong>
              <small>${correctAnswers}/${totalAnswers || 0} câu đúng</small>
            </article>
            <article>
              <span>Thời gian học</span>
              <strong>${formatMinutes(summary.learningTimeSeconds)}</strong>
              <small>${Number(summary.totalXP) || 0} XP tích lũy</small>
            </article>
          </div>
        </section>

        <section class="cl6-section cl6-continue-grid" aria-label="Tiếp tục hoạt động">
          <article class="cl6-continue-card">
            <div class="cl6-continue-top">
              <span class="cl6-chip live">${continueTarget.eyebrow}</span>
              <span class="cl6-continue-icon">${icon('spark')}</span>
            </div>
            <h2>${continueTarget.title}</h2>
            <p>${continueTarget.description}</p>
            <button class="cl6-text-action" type="button" data-app-view="${continueTarget.view}">
              Mở lại <span>${icon('arrow')}</span>
            </button>
          </article>

          <article class="cl6-stat-card">
            <span class="cl6-stat-icon violet">${icon('learn')}</span>
            <div><small>Bài đã hoàn thành</small><strong>${completedLessons}<em>/77</em></strong></div>
          </article>
          <article class="cl6-stat-card">
            <span class="cl6-stat-icon cyan">${icon('lab')}</span>
            <div><small>Thí nghiệm hoàn thành</small><strong>${completedExperiments}<em>/78</em></strong></div>
          </article>
        </section>

        <section class="cl6-section">
          <div class="cl6-section-head">
            <div>
              <span class="cl6-kicker">KHÔNG GIAN LÀM VIỆC</span>
              <h2>Đi thẳng đến điều bạn cần</h2>
            </div>
            <span class="cl6-section-note">Mọi module dùng chung context ChemLab</span>
          </div>
          <div class="cl6-quick-grid">
            ${quickAction('periodic', 'table', 'Bảng tuần hoàn', '118 nguyên tố · dữ liệu · orbital', 'violet')}
            ${quickAction('tools', 'tools', 'Công cụ', 'Tính toán · ion · phương trình', 'blue')}
            ${quickAction('learning', 'learn', 'Học tập', '77 bài · mastery · luyện tập', 'pink')}
            ${quickAction('lab', 'lab', 'Phòng thí nghiệm', '103 hóa chất · 96 phản ứng', 'cyan')}
          </div>
        </section>

        <section class="cl6-section cl6-flow-section">
          <div class="cl6-section-head">
            <div>
              <span class="cl6-kicker">CHEM FLOW</span>
              <h2>Một dòng chảy từ kiến thức đến thực nghiệm</h2>
            </div>
            <span class="cl6-section-note">Context được chuyển giữa các workspace</span>
          </div>
          <div class="cl6-flow">
            <button type="button" data-app-view="periodic"><strong>01</strong><span>Nguyên tố</span><small>Periodic</small></button>
            <i aria-hidden="true">→</i>
            <button type="button" data-app-tool="ions"><strong>02</strong><span>Ion</span><small>Ion Engine</small></button>
            <i aria-hidden="true">→</i>
            <button type="button" data-app-tool="compound"><strong>03</strong><span>Hợp chất</span><small>Compound Studio</small></button>
            <i aria-hidden="true">→</i>
            <button type="button" data-app-tool="reaction"><strong>04</strong><span>Phản ứng</span><small>Reaction Studio</small></button>
            <i aria-hidden="true">→</i>
            <button type="button" data-app-view="lab"><strong>05</strong><span>Thí nghiệm</span><small>Virtual Lab</small></button>
            <i aria-hidden="true">→</i>
            <button type="button" data-app-view="learning"><strong>06</strong><span>Hiểu sâu</span><small>Learning</small></button>
          </div>
        </section>

        <section class="cl6-section">
          <div class="cl6-section-head">
            <div>
              <span class="cl6-kicker">LỘ TRÌNH HỌC</span>
              <h2>Tiến độ theo khối</h2>
            </div>
            <button class="cl6-link-button" type="button" data-app-view="learning">Mở Learning ${icon('arrow')}</button>
          </div>

          <div class="cl6-grade-grid">
            ${grades.map(({ grade, data, totals, combined }) => `
              <article class="cl6-grade-card" style="--grade-progress:${combined}%">
                <div class="cl6-grade-ring"><span>${combined}%</span></div>
                <div class="cl6-grade-copy">
                  <span class="cl6-chip">LỚP ${grade}</span>
                  <h3>Hóa học ${grade}</h3>
                  <p>${data.completedLessons || 0}/${totals.lessons} bài · ${data.completedExperiments || 0}/${totals.experiments} thí nghiệm</p>
                  <div class="cl6-meter"><i style="--value:${combined}%"></i></div>
                </div>
              </article>
            `).join('')}
          </div>
        </section>

        <section class="cl6-section cl6-final-banner">
          <div>
            <span class="cl6-kicker">CHEMAI RELEASE</span>
            <h2>ChemLab 6.2 hoàn thiện toàn bộ trải nghiệm học, khám phá và thực hành Hóa học với ChemAI.</h2>
            <p>Periodic → Tools → Learning → Lab → ChemAI. Trợ lý hiểu ngữ cảnh của toàn bộ workspace.</p>
          </div>
          <span class="cl6-final-mark">6.2</span>
        </section>
      </div>
    `
  }

  refresh()

  return Object.freeze({ refresh })
}
