import './experiments.css'


import {

  CURRICULUM,

  getGradeCurriculum,

  getLessonById

} from './curriculum.js'


import {

  getExperimentById,

  getExperimentsForLesson

} from './experiments.js'


import {

  createExperimentEngine

} from './experimentEngine.js'


import {

  getActivityStatus,

  getLessonProgress,

  getChapterProgress,

  getGradeProgress,

  findCurrentLesson,

  findNextLesson

} from './progressSummary.js'


export function initGuidedExperiments() {

  const lab =
    document.querySelector(
      '#lab'
    )


  if (!lab) {
    return
  }


  if (
    lab.querySelector(
      '#guided-lab-shell'
    )
  ) {

    return

  }


  const layout =
    lab.querySelector(
      '.vl-layout'
    )


  const head =
    lab.querySelector(
      '.vl-head'
    )


  if (
    !layout ||
    !head
  ) {

    return

  }


  /* =====================================================
     SHELL
  ===================================================== */

  const shell =
    document.createElement(
      'section'
    )


  shell.id =
    'guided-lab-shell'


  shell.className =
    'guided-lab-shell'


  shell.innerHTML = `

    <div
      class="guided-modebar panel"
      role="tablist"
      aria-label="Chế độ phòng thí nghiệm"
    >

      <button
        class="guided-mode-btn active"
        data-guided-mode="free"
        type="button"
        role="tab"
        aria-selected="true"
      >

        <span
          class="guided-mode-icon"
          aria-hidden="true"
        >
          ⚗
        </span>


        <span>

          <strong>
            Tự do
          </strong>

          <small>
            Tự chọn hóa chất và phản ứng
          </small>

        </span>

      </button>


      <button
        class="guided-mode-btn"
        data-guided-mode="guided"
        type="button"
        role="tab"
        aria-selected="false"
      >

        <span
          class="guided-mode-icon"
          aria-hidden="true"
        >
          ▤
        </span>


        <span>

          <strong>
            Bài thí nghiệm
          </strong>

          <small>
            Học theo chương trình lớp 10–12
          </small>

        </span>

      </button>

    </div>


    <div
      id="guided-panel"
      class="guided-panel panel"
      hidden
    ></div>

  `


  head.insertAdjacentElement(
    'afterend',
    shell
  )


  /* =====================================================
     REFERENCES
  ===================================================== */

  const panel =
    shell.querySelector(
      '#guided-panel'
    )


  const modeButtons = [

    ...shell.querySelectorAll(
      '[data-guided-mode]'
    )

  ]


  /* =====================================================
     STATE
  ===================================================== */

  let mode =
    'free'


  let currentGrade =
    null


  let currentLessonId =
    null


  let currentExperiment =
    null


  let engine =
    null


  let startingExperiment =
    false


  let gradeSearch =
    ''


  let gradeFilter =
    'all'


  /* =====================================================
     LAB VISIBILITY
  ===================================================== */

  function setLabVisible(
    visible
  ) {

    const show =
      visible ===
      true


    layout.hidden =
      !show


    layout.classList.toggle(
      'guided-lab-hidden',
      !show
    )

  }


  /* =====================================================
     LAB STEP HELPERS
  ===================================================== */

  function stepNeedsLab(
    step
  ) {

    return [

      'add',

      'heat',

      'reaction',

      'temperature'

    ].includes(
      step?.type
    )

  }


  function experimentNeedsLab(
    experiment
  ) {

    return (

      Array.isArray(
        experiment?.steps
      ) &&

      experiment.steps.some(
        step =>
          stepNeedsLab(
            step
          )
      )

    )

  }


  /* =====================================================
     DESTROY ENGINE
  ===================================================== */

  function destroyEngine() {

    engine?.destroy()

    engine =
      null

  }


  /* =====================================================
     MODE
  ===================================================== */

  function setMode(
    nextMode
  ) {

    mode =
      nextMode


    modeButtons.forEach(
      button => {

        const active =
          button.dataset
            .guidedMode ===
          nextMode


        button.classList.toggle(
          'active',
          active
        )


        button.setAttribute(
          'aria-selected',
          active
            ? 'true'
            : 'false'
        )

      }
    )


    if (
      nextMode ===
      'free'
    ) {

      destroyEngine()


      currentGrade =
        null


      currentLessonId =
        null


      currentExperiment =
        null


      gradeSearch =
        ''


      gradeFilter =
        'all'


      panel.hidden =
        true


      shell.classList.remove(
        'guided-running'
      )


      setLabVisible(
        true
      )


      return

    }


    panel.hidden =
      false


    shell.classList.remove(
      'guided-running'
    )


    setLabVisible(
      false
    )


    renderGradeHome()

  }


  modeButtons.forEach(
    button => {

      button.addEventListener(
        'click',
        () => {

          setMode(
            button.dataset
              .guidedMode
          )

        }
      )

    }
  )


  /* =====================================================
     GRADE HOME
  ===================================================== */

  function renderGradeHome() {

    currentGrade =
      null


    currentLessonId =
      null


    currentExperiment =
      null


    gradeSearch =
      ''


    gradeFilter =
      'all'


    destroyEngine()


    shell.classList.remove(
      'guided-running'
    )


    setLabVisible(
      false
    )


    panel.hidden =
      false


    const gradeCards =
      [
        10,
        11,
        12
      ]

        .map(
          grade => {

            const curriculum =
              CURRICULUM[
                grade
              ]


            const summary =
              getGradeProgress(
                grade
              )


            const current =
              findCurrentLesson(
                grade
              )


            return `

              <button
                class="guided-grade-card"
                data-grade="${grade}"
                type="button"
              >

                <div class="guided-grade-top">

                  <span class="guided-grade-number">
                    ${grade}
                  </span>


                  <span class="guided-grade-progress">
                    ${summary.progress}%
                  </span>

                </div>


                <strong>
                  ${escapeHTML(
                    curriculum.title
                  )}
                </strong>


                <p>
                  ${escapeHTML(
                    curriculum.subtitle
                  )}
                </p>


                <div class="guided-grade-meta">

                  <span>
                    ${summary.totalLessons}
                    bài học
                  </span>


                  <span>
                    ${summary.completedLessons}/${summary.totalLessons}
                    bài hoàn thành
                  </span>

                </div>


                <div
                  class="guided-progress-track"
                  aria-label="Tiến độ ${summary.progress}%"
                >

                  <i
                    style="
                      width:${summary.progress}%
                    "
                  ></i>

                </div>


                ${
                  current

                    ? `

                      <div class="guided-grade-resume">

                        <span>
                          ◐
                        </span>

                        <span>
                          Đang học:
                          ${escapeHTML(
                            current.lesson.title
                          )}
                        </span>

                      </div>

                    `

                    : ''
                }

              </button>

            `

          }
        )

        .join(
          ''
        )


    panel.innerHTML = `

      <div class="guided-hero">

        <div>

          <span class="guided-eyebrow">
            CHEMLAB GUIDED LEARNING
          </span>


          <h3>
            Chọn chương trình học
          </h3>


          <p>
            Học theo chương trình Hóa học THPT
            từ lớp 10 đến lớp 12.
            Tiến độ của từng bài được lưu tự động.
          </p>

        </div>


        <div class="guided-save-badge">

          <span>
            ●
          </span>

          Tự động lưu tiến độ

        </div>

      </div>


      <div class="guided-grade-grid">

        ${gradeCards}

      </div>


      <div class="guided-note">

        <strong>
          Hệ thống học theo tiến độ:
        </strong>

        lý thuyết, câu hỏi, thí nghiệm
        và trạng thái cốc đều có thể được
        lưu để bạn tiếp tục sau.

      </div>

    `


    panel
      .querySelectorAll(
        '[data-grade]'
      )
      .forEach(
        button => {

          button.addEventListener(
            'click',
            () => {

              gradeSearch =
                ''


              gradeFilter =
                'all'


              renderGrade(
                Number(
                  button.dataset
                    .grade
                )
              )

            }
          )

        }
      )

  }


  /* =====================================================
     GRADE
  ===================================================== */

  function renderGrade(
    grade
  ) {

    currentGrade =
      grade


    currentLessonId =
      null


    currentExperiment =
      null


    destroyEngine()


    setLabVisible(
      false
    )


    shell.classList.remove(
      'guided-running'
    )


    panel.hidden =
      false


    const curriculum =
      getGradeCurriculum(
        grade
      )


    if (!curriculum) {
      return
    }


    const gradeSummary =
      getGradeProgress(
        grade
      )


    const currentLesson =
      findCurrentLesson(
        grade
      )


    const suggestedLesson =
      currentLesson ||
      findNextLesson(
        grade
      )


    const chaptersHtml =
      curriculum.chapters

        .map(
          (
            chapter,
            chapterIndex
          ) => {

            const chapterProgress =
              getChapterProgress(
                grade,
                chapter
              )


            const hasCurrentLesson =
              chapter.lessons.some(
                lesson =>
                  currentLesson
                    ?.lesson
                    ?.id ===
                  lesson.id
              )


            const lessonsHtml =
              chapter.lessons

                .map(
                  lesson => {

                    const progress =
                      getLessonProgress(
                        grade,
                        lesson.id
                      )


                    const ready =
                      progress
                        .totalActivities >
                      0


                    let status =
                      'new'


                    let statusText =
                      '○ Chưa học'


                    if (
                      progress.completed
                    ) {

                      status =
                        'completed'


                      statusText =
                        '✓ Hoàn thành'

                    }

                    else if (
                      progress.started
                    ) {

                      status =
                        'active'


                      statusText =
                        `◐ Đang học ${progress.progress}%`

                    }


                    const searchText =
                      normalizeSearch(
                        [
                          lesson.number,
                          lesson.title,
                          chapter.title,
                          getTypeLabel(
                            lesson.type
                          )
                        ]
                          .join(
                            ' '
                          )
                      )


                    return `

                      <button
                        class="
                          guided-lesson-row
                          ${
                            ready
                              ? 'is-ready'
                              : 'is-planned'
                          }
                          status-${status}
                        "
                        data-lesson-id="${escapeHTML(
                          lesson.id
                        )}"
                        data-lesson-status="${status}"
                        data-lesson-search="${escapeHTML(
                          searchText
                        )}"
                        type="button"
                        ${
                          ready
                            ? ''
                            : 'disabled'
                        }
                      >

                        <span class="guided-lesson-number">
                          ${lesson.number}
                        </span>


                        <span class="guided-lesson-copy">

                          <strong>
                            ${escapeHTML(
                              lesson.title
                            )}
                          </strong>


                          <small>
                            ${escapeHTML(
                              getTypeLabel(
                                lesson.type
                              )
                            )}
                          </small>

                        </span>


                        <span class="guided-lesson-status">

                          ${statusText}

                        </span>

                      </button>

                    `

                  }
                )

                .join(
                  ''
                )


            return `

              <details
                class="guided-chapter"
                data-guided-chapter
                ${
                  chapterIndex ===
                    0 ||
                  hasCurrentLesson

                    ? 'open'

                    : ''
                }
              >

                <summary>

                  <span class="guided-chapter-number">
                    ${chapter.number}
                  </span>


                  <span class="guided-chapter-title">

                    <strong>
                      ${escapeHTML(
                        chapter.title
                      )}
                    </strong>


                    <small>

                      ${chapterProgress.completedLessons}
                      /
                      ${chapterProgress.totalLessons}
                      bài hoàn thành

                    </small>

                  </span>


                  <span class="guided-chapter-summary-progress">

                    <b>
                      ${chapterProgress.progress}%
                    </b>

                    <i>
                      ⌄
                    </i>

                  </span>

                </summary>


                <div class="guided-chapter-progress">

                  <span>

                    <i
                      style="
                        width:${chapterProgress.progress}%
                      "
                    ></i>

                  </span>

                </div>


                <div class="guided-chapter-lessons">

                  ${lessonsHtml}

                </div>

              </details>

            `

          }
        )

        .join(
          ''
        )


    panel.innerHTML = `

      <div class="guided-toolbar guided-grade-toolbar">

        <button
          class="guided-back-btn"
          data-back-home
          type="button"
        >
          ← Chọn lớp khác
        </button>


        <div class="guided-grade-title">

          <span class="guided-eyebrow">
            CHƯƠNG TRÌNH LỚP ${grade}
          </span>


          <h3>
            ${escapeHTML(
              curriculum.title
            )}
          </h3>


          <p>

            ${gradeSummary.completedLessons}
            /
            ${gradeSummary.totalLessons}
            bài hoàn thành

            ·

            ${gradeSummary.progress}%

          </p>

        </div>


        <div class="guided-grade-progress-ring">

          <strong>
            ${gradeSummary.progress}%
          </strong>

          <span>
            tiến độ
          </span>

        </div>

      </div>


      ${
        suggestedLesson

          ? `

            <section class="guided-continue-card">

              <div class="guided-continue-icon">

                ${
                  currentLesson
                    ? '▶'
                    : '★'
                }

              </div>


              <div class="guided-continue-copy">

                <span>

                  ${
                    currentLesson
                      ? 'TIẾP TỤC HỌC'
                      : 'GỢI Ý BẮT ĐẦU'
                  }

                </span>


                <strong>

                  Bài ${
                    suggestedLesson
                      .lesson
                      .number
                  }

                  ·

                  ${escapeHTML(
                    suggestedLesson
                      .lesson
                      .title
                  )}

                </strong>


                <small>

                  ${
                    currentLesson

                      ? `Đang hoàn thành ${suggestedLesson.progress.progress}%`

                      : 'Bài chưa hoàn thành tiếp theo'
                  }

                </small>

              </div>


              <button
                type="button"
                class="guided-primary-btn"
                data-continue-lesson="${escapeHTML(
                  suggestedLesson
                    .lesson
                    .id
                )}"
              >

                ${
                  currentLesson
                    ? 'Tiếp tục'
                    : 'Bắt đầu'
                }

              </button>

            </section>

          `

          : `

            <section
              class="
                guided-continue-card
                complete
              "
            >

              <div class="guided-continue-icon">
                ✓
              </div>


              <div class="guided-continue-copy">

                <span>
                  HOÀN THÀNH
                </span>

                <strong>
                  Bạn đã hoàn thành chương trình lớp ${grade}
                </strong>

                <small>
                  Tất cả bài học hiện có đều đã hoàn thành.
                </small>

              </div>

            </section>

          `
      }


      <div class="guided-grade-tools">

        <label class="guided-search">

          <span aria-hidden="true">
            ⌕
          </span>


          <input
            id="guided-lesson-search"
            type="search"
            value="${escapeHTML(
              gradeSearch
            )}"
            placeholder="Tìm tên bài, chương..."
            autocomplete="off"
            aria-label="Tìm bài học"
          >

        </label>


        <div
          class="guided-filter-tabs"
          role="group"
          aria-label="Lọc bài học"
        >

          <button
            type="button"
            data-grade-filter="all"
            class="${
              gradeFilter ===
                'all'
                ? 'active'
                : ''
            }"
          >
            Tất cả
          </button>


          <button
            type="button"
            data-grade-filter="active"
            class="${
              gradeFilter ===
                'active'
                ? 'active'
                : ''
            }"
          >
            Đang học
          </button>


          <button
            type="button"
            data-grade-filter="completed"
            class="${
              gradeFilter ===
                'completed'
                ? 'active'
                : ''
            }"
          >
            Hoàn thành
          </button>

        </div>


        <span
          id="guided-result-count"
          class="guided-result-count"
        ></span>

      </div>


      <div class="guided-chapter-list">

        ${chaptersHtml}

      </div>


      <div
        id="guided-no-lessons"
        class="guided-empty-search"
        hidden
      >

        Không tìm thấy bài học phù hợp.

      </div>

    `


    panel
      .querySelector(
        '[data-back-home]'
      )
      ?.addEventListener(
        'click',
        renderGradeHome
      )


    panel
      .querySelector(
        '[data-continue-lesson]'
      )
      ?.addEventListener(
        'click',
        event => {

          renderLesson(

            grade,

            event.currentTarget
              .dataset
              .continueLesson

          )

        }
      )


    const searchInput =
      panel.querySelector(
        '#guided-lesson-search'
      )


    searchInput
      ?.addEventListener(
        'input',
        () => {

          gradeSearch =
            searchInput.value


          applyGradeFilters()

        }
      )


    panel
      .querySelectorAll(
        '[data-grade-filter]'
      )
      .forEach(
        button => {

          button.addEventListener(
            'click',
            () => {

              gradeFilter =
                button.dataset
                  .gradeFilter


              panel
                .querySelectorAll(
                  '[data-grade-filter]'
                )
                .forEach(
                  item => {

                    item.classList.toggle(
                      'active',
                      item ===
                        button
                    )

                  }
                )


              applyGradeFilters()

            }
          )

        }
      )


    panel
      .querySelectorAll(
        '[data-lesson-id]'
      )
      .forEach(
        button => {

          button.addEventListener(
            'click',
            () => {

              if (
                button.disabled
              ) {

                return

              }


              renderLesson(

                grade,

                button.dataset
                  .lessonId

              )

            }
          )

        }
      )


    applyGradeFilters()

  }


  /* =====================================================
     GRADE SEARCH / FILTER
  ===================================================== */

  function applyGradeFilters() {

    if (
      !currentGrade
    ) {

      return

    }


    const query =
      normalizeSearch(
        gradeSearch
      )


    let visibleLessons =
      0


    panel
      .querySelectorAll(
        '[data-guided-chapter]'
      )
      .forEach(
        chapter => {

          let visibleInChapter =
            0


          chapter
            .querySelectorAll(
              '[data-lesson-id]'
            )
            .forEach(
              lesson => {

                const searchMatch =
                  !query ||
                  lesson.dataset
                    .lessonSearch
                    ?.includes(
                      query
                    )


                const status =
                  lesson.dataset
                    .lessonStatus


                const filterMatch =

                  gradeFilter ===
                    'all' ||

                  status ===
                    gradeFilter


                const visible =
                  searchMatch &&
                  filterMatch


                lesson.hidden =
                  !visible


                if (
                  visible
                ) {

                  visibleInChapter++

                  visibleLessons++

                }

              }
            )


          chapter.hidden =
            visibleInChapter ===
            0


          if (
            visibleInChapter >
              0 &&
            (
              query ||
              gradeFilter !==
                'all'
            )
          ) {

            chapter.open =
              true

          }

        }
      )


    const counter =
      panel.querySelector(
        '#guided-result-count'
      )


    if (
      counter
    ) {

      counter.textContent =
        `${visibleLessons} bài`

    }


    const empty =
      panel.querySelector(
        '#guided-no-lessons'
      )


    if (
      empty
    ) {

      empty.hidden =
        visibleLessons !==
        0

    }

  }


  /* =====================================================
     LESSON
  ===================================================== */

  function renderLesson(
    grade,
    lessonId
  ) {

    currentGrade =
      grade


    currentLessonId =
      lessonId


    currentExperiment =
      null


    destroyEngine()


    shell.classList.remove(
      'guided-running'
    )


    setLabVisible(
      false
    )


    panel.hidden =
      false


    const lesson =
      getLessonById(
        grade,
        lessonId
      )


    if (!lesson) {

      renderGrade(
        grade
      )

      return

    }


    const experiments =
      getExperimentsForLesson(
        lessonId
      )


    const lessonProgress =
      getLessonProgress(
        grade,
        lessonId
      )


    const experimentsHtml =
      experiments

        .map(
          experiment => {

            const status =
              getActivityStatus(
                experiment
              )


            const chemicals =
              Array.isArray(
                experiment.chemicals
              )

                ? experiment.chemicals

                : []


            const needsLab =
              experimentNeedsLab(
                experiment
              )


            return `

              <article
                class="
                  guided-experiment-card
                  ${
                    status.completed
                      ? 'is-completed'
                      : status.started
                        ? 'is-active'
                        : ''
                  }
                "
              >

                <div class="guided-experiment-card-head">

                  <span>
                    ${escapeHTML(
                      experiment.difficulty ||
                      'Cơ bản'
                    )}
                  </span>


                  <span>
                    ~${Number(
                      experiment.duration ||
                      5
                    )} phút
                  </span>

                </div>


                <h4>
                  ${escapeHTML(
                    experiment.title
                  )}
                </h4>


                <p>
                  ${escapeHTML(
                    experiment.subtitle ||
                    ''
                  )}
                </p>


                <div class="guided-exp-objective">

                  <span>
                    MỤC TIÊU
                  </span>


                  <p>
                    ${escapeHTML(
                      experiment.objective ||
                      ''
                    )}
                  </p>

                </div>


                <div class="guided-activity-info">

                  <span>

                    ${
                      needsLab
                        ? '⚗ Có thí nghiệm'
                        : '▤ Bài học tương tác'
                    }

                  </span>


                  <span>

                    ${
                      status.completed

                        ? '✓ Hoàn thành'

                        : status.started

                          ? `◐ ${status.progress}%`

                          : '○ Chưa học'
                    }

                  </span>

                </div>


                ${
                  chemicals.length

                    ? `

                      <div class="guided-chemical-chips">

                        ${
                          chemicals
                            .map(
                              id =>
                                `<span>${escapeHTML(id)}</span>`
                            )
                            .join(
                              ''
                            )
                        }

                      </div>

                    `

                    : ''
                }


                <button
                  class="guided-primary-btn"
                  data-open-experiment="${escapeHTML(
                    experiment.id
                  )}"
                  type="button"
                >

                  ${
                    status.completed

                      ? 'Xem kết quả'

                      : status.started

                        ? 'Tiếp tục bài'

                        : needsLab

                          ? 'Xem bài thí nghiệm'

                          : 'Xem bài học'
                  }

                </button>

              </article>

            `

          }
        )

        .join(
          ''
        )


    panel.innerHTML = `

      <div class="guided-toolbar">

        <button
          class="guided-back-btn"
          data-back-grade
          type="button"
        >
          ← Hóa học ${grade}
        </button>


        <div>

          <span class="guided-eyebrow">

            BÀI ${lesson.number}

            ·

            ${escapeHTML(
              lesson.chapterTitle ||
              ''
            )}

          </span>


          <h3>
            ${escapeHTML(
              lesson.title
            )}
          </h3>

        </div>


        <div class="guided-lesson-head-progress">

          <strong>
            ${lessonProgress.progress}%
          </strong>

          <span>
            tiến độ bài
          </span>

        </div>

      </div>


      <div class="guided-experiment-grid">

        ${
          experimentsHtml ||

          `

            <div class="guided-empty-search">
              Bài học này chưa có hoạt động.
            </div>

          `
        }

      </div>

    `


    panel
      .querySelector(
        '[data-back-grade]'
      )
      ?.addEventListener(
        'click',
        () => {

          renderGrade(
            grade
          )

        }
      )


    panel
      .querySelectorAll(
        '[data-open-experiment]'
      )
      .forEach(
        button => {

          button.addEventListener(
            'click',
            () => {

              renderExperimentOverview(

                getExperimentById(
                  button.dataset
                    .openExperiment
                )

              )

            }
          )

        }
      )

  }


  /* =====================================================
     OVERVIEW
  ===================================================== */

  function renderExperimentOverview(
    experiment
  ) {

    if (!experiment) {
      return
    }


    currentExperiment =
      experiment


    destroyEngine()


    shell.classList.remove(
      'guided-running'
    )


    setLabVisible(
      false
    )


    panel.hidden =
      false


    const status =
      getActivityStatus(
        experiment
      )


    const needsLab =
      experimentNeedsLab(
        experiment
      )


    const chemicals =
      Array.isArray(
        experiment.chemicals
      )

        ? experiment.chemicals

        : []


    panel.innerHTML = `

      <div class="guided-toolbar">

        <button
          class="guided-back-btn"
          data-back-lesson
          type="button"
        >
          ← Quay lại bài học
        </button>


        <div>

          <span class="guided-eyebrow">

            ${
              needsLab
                ? 'THÍ NGHIỆM HƯỚNG DẪN'
                : 'BÀI HỌC HƯỚNG DẪN'
            }

          </span>


          <h3>
            ${escapeHTML(
              experiment.title
            )}
          </h3>

        </div>

      </div>


      <div class="guided-overview-grid">

        <div class="guided-overview-main">

          <span class="guided-overview-label">
            MỤC TIÊU
          </span>


          <p>
            ${escapeHTML(
              experiment.objective ||
              ''
            )}
          </p>


          <span class="guided-overview-label">

            ${
              needsLab
                ? 'HÓA CHẤT SỬ DỤNG'
                : 'HÌNH THỨC HỌC'
            }

          </span>


          <div class="guided-chemical-chips large">

            ${
              needsLab &&
              chemicals.length

                ? chemicals
                    .map(
                      id =>
                        `<span>${escapeHTML(id)}</span>`
                    )
                    .join(
                      ''
                    )

                : `

                  <span>

                    ${
                      needsLab

                        ? 'Không cần hóa chất bổ sung'

                        : 'Lý thuyết + câu hỏi tương tác'
                    }

                  </span>

                `
            }

          </div>


          <div class="guided-overview-stats">

            <span>
              ${experiment.steps.length}
              bước
            </span>


            <span>
              ~${Number(
                experiment.duration ||
                5
              )}
              phút
            </span>


            <span>
              ${escapeHTML(
                experiment.difficulty ||
                'Cơ bản'
              )}
            </span>

          </div>

        </div>


        <aside class="guided-resume-card">

          <span class="guided-overview-label">
            TIẾN ĐỘ
          </span>


          <strong>

            ${
              status.completed

                ? 'Đã hoàn thành'

                : status.started

                  ? 'Đang học'

                  : 'Chưa bắt đầu'
            }

          </strong>


          <div class="guided-progress-track large">

            <i
              style="
                width:${status.progress}%
              "
            ></i>

          </div>


          <p>
            ${status.progress}%
          </p>


          <button
            class="guided-primary-btn"
            data-start-exp
            type="button"
          >

            ${
              status.completed

                ? 'Làm lại'

                : status.started

                  ? 'Tiếp tục'

                  : 'Bắt đầu'
            }

          </button>


          ${
            status.started &&
            !status.completed

              ? `

                <small>
                  Tiến độ trước đó sẽ
                  được khôi phục tự động.
                </small>

              `

              : ''
          }

        </aside>

      </div>

    `


    panel
      .querySelector(
        '[data-back-lesson]'
      )
      ?.addEventListener(
        'click',
        () => {

          renderLesson(
            experiment.grade,
            experiment.lessonId
          )

        }
      )


    panel
      .querySelector(
        '[data-start-exp]'
      )
      ?.addEventListener(
        'click',
        () => {

          startExperiment(
            experiment,
            status.completed
          )

        }
      )

  }


  /* =====================================================
     START EXPERIMENT
  ===================================================== */

  function startExperiment(
    experiment,
    restart = false
  ) {

    if (!experiment) {
      return
    }


    startingExperiment =
      true


    currentExperiment =
      experiment


    const requiresLab =
      experimentNeedsLab(
        experiment
      )


    destroyEngine()


    panel.hidden =
      false


    shell.classList.add(
      'guided-running'
    )


    /*
      renderCoach sẽ quyết định
      Lab có cần hiện ở từng bước hay không.
    */

    setLabVisible(
      false
    )


    try {

      engine =
        createExperimentEngine({

          experiment,


          onUpdate:
            state => {

              renderCoach(
                state
              )

            },


          onComplete:
            state => {

              renderCoach(
                state
              )

            }

        })


      let state


      if (
        restart
      ) {

        if (
          requiresLab
        ) {

          lab
            .querySelector(
              '#reset-lab'
            )
            ?.click()

        }


        engine.restart()


        state =
          engine.start()

      }

      else {

        state =
          engine.resume()

      }


      /*
        Khôi phục trạng thái cốc cũ.
      */

      if (
        requiresLab &&
        !restart &&
        state?.labSnapshot
      ) {

        window.dispatchEvent(

          new CustomEvent(
            'chemlab:restore-lab',

            {

              detail:
                state.labSnapshot

            }
          )

        )

      }


      else if (
        requiresLab &&
        restart
      ) {

        lab
          .querySelector(
            '#reset-lab'
          )
          ?.click()

      }


      renderCoach(
        engine.getState()
      )


      requestAnimationFrame(
        () => {

          shell.scrollIntoView({

            behavior:
              prefersReducedMotion()
                ? 'auto'
                : 'smooth',

            block:
              'start'

          })

        }
      )

    }

    catch (
      error
    ) {

      console.error(
        '[Guided Experiments] Không thể bắt đầu bài:',
        error
      )


      destroyEngine()


      shell.classList.remove(
        'guided-running'
      )


      setLabVisible(
        false
      )


      panel.hidden =
        false


      renderExperimentOverview(
        experiment
      )

    }

    finally {

      requestAnimationFrame(
        () => {

          startingExperiment =
            false

        }
      )

    }

  }


  /* =====================================================
     COACH
  ===================================================== */

  function renderCoach(
    state
  ) {

    if (
      !currentExperiment ||
      !state
    ) {

      return

    }


    const completed =
      state.completed ===
      true


    const step =
      state.currentStepData


    const stepNumber =
      Math.min(

        state.currentStep +
        1,

        state.totalSteps

      )


    /*
      Không để Lab chiếm màn hình
      trong bước lý thuyết hoặc quiz.
    */

    setLabVisible(

      !completed &&
      stepNeedsLab(
        step
      )

    )


    if (
      completed
    ) {

      panel.innerHTML = `

        <div
          class="
            guided-coach
            guided-coach-complete
          "
        >

          <div>

            <span class="guided-eyebrow">
              HOÀN THÀNH
            </span>


            <h3>
              ${escapeHTML(
                currentExperiment.title
              )}
            </h3>


            <p>

              Bạn đã hoàn thành
              ${state.totalSteps}/${state.totalSteps}
              bước.

              Tiến độ đã được lưu.

            </p>

          </div>


          <div class="guided-complete-actions">

            <span class="guided-score-pill">
              ✓ Hoàn thành
            </span>


            <button
              class="guided-secondary-btn"
              data-repeat
              type="button"
            >
              Làm lại
            </button>


            <button
              class="guided-primary-btn"
              data-back-results
              type="button"
            >
              Về bài học
            </button>

          </div>

        </div>

      `


      panel
        .querySelector(
          '[data-repeat]'
        )
        ?.addEventListener(
          'click',
          () => {

            startExperiment(
              currentExperiment,
              true
            )

          }
        )


      panel
        .querySelector(
          '[data-back-results]'
        )
        ?.addEventListener(
          'click',
          () => {

            shell.classList.remove(
              'guided-running'
            )


            setLabVisible(
              false
            )


            renderLesson(
              currentExperiment.grade,
              currentExperiment.lessonId
            )

          }
        )


      return

    }


    panel.innerHTML = `

      <div class="guided-coach">

        <div class="guided-coach-top">

          <div>

            <span class="guided-eyebrow">
              ${escapeHTML(
                currentExperiment.title
              )}
            </span>


            <h3>
              Bước
              ${stepNumber}/${state.totalSteps}
            </h3>

          </div>


          <div class="guided-coach-actions">

            <span class="guided-save-mini">
              ● Đã lưu
            </span>


            <button
              class="guided-secondary-btn"
              data-exit-exp
              type="button"
            >
              Thoát bài
            </button>

          </div>

        </div>


        <div class="guided-step-progress">

          ${
            currentExperiment
              .steps
              .map(
                (
                  item,
                  index
                ) => {

                  const done =
                    state.completedSteps
                      .includes(
                        index
                      )


                  const active =
                    index ===
                    state.currentStep


                  return `

                    <i
                      class="
                        ${
                          done
                            ? 'done'
                            : ''
                        }

                        ${
                          active
                            ? 'active'
                            : ''
                        }
                      "
                    ></i>

                  `

                }
              )

              .join(
                ''
              )
          }

        </div>


        <div class="guided-step-content">

          ${
            renderStepContent(
              step
            )
          }

        </div>


        ${
          state.lastResult
            ?.message

            ? `

              <div
                class="
                  guided-feedback
                  ${
                    state.lastResult
                      .type ===
                    'error'

                      ? 'error'

                      : 'success'
                  }
                "
              >

                ${escapeHTML(
                  state.lastResult.message
                )}

              </div>

            `

            : ''
        }

      </div>

    `


    panel
      .querySelector(
        '[data-exit-exp]'
      )
      ?.addEventListener(
        'click',
        () => {

          destroyEngine()


          shell.classList.remove(
            'guided-running'
          )


          setLabVisible(
            false
          )


          renderExperimentOverview(
            currentExperiment
          )

        }
      )


    panel
      .querySelector(
        '[data-continue-learning]'
      )
      ?.addEventListener(
        'click',
        () => {

          engine
            ?.continueStep()

        }
      )


    panel
      .querySelectorAll(
        '[data-prediction-option]'
      )
      .forEach(
        button => {

          button.addEventListener(
            'click',
            () => {

              engine
                ?.answerPrediction(
                  button.dataset
                    .predictionOption
                )

            }
          )

        }
      )

  }


  /* =====================================================
     STEP CONTENT
  ===================================================== */

  function renderStepContent(
    step
  ) {

    if (!step) {

      return `

        <p>
          Đang tải bước tiếp theo...
        </p>

      `

    }


    /* ===================================================
       INFO / THEORY / NOTE / OBSERVATION
    =================================================== */

    if (

      step.type ===
        'info' ||

      step.type ===
        'theory' ||

      step.type ===
        'note' ||

      step.type ===
        'observation'

    ) {

      const points =
        Array.isArray(
          step.points
        )

          ? step.points

          : []


      return `

        <div class="guided-learning-step">

          <span class="guided-step-kicker">

            ${escapeHTML(

              step.kicker ||

              (
                step.type ===
                  'observation'

                  ? 'QUAN SÁT & KẾT LUẬN'

                  : 'KIẾN THỨC'
              )

            )}

          </span>


          ${
            step.title

              ? `

                <h4>
                  ${escapeHTML(
                    step.title
                  )}
                </h4>

              `

              : ''
          }


          ${
            step.formula

              ? `

                <div class="guided-learning-formula">

                  ${escapeHTML(
                    step.formula
                  )}

                </div>

              `

              : ''
          }


          ${
            step.text

              ? `

                <p>
                  ${escapeHTML(
                    step.text
                  )}
                </p>

              `

              : ''
          }


          ${
            points.length

              ? `

                <ul class="guided-learning-points">

                  ${
                    points
                      .map(
                        item => `

                          <li>
                            ${escapeHTML(
                              item
                            )}
                          </li>

                        `
                      )
                      .join(
                        ''
                      )
                  }

                </ul>

              `

              : ''
          }


          <button
            type="button"
            class="guided-primary-btn"
            data-continue-learning
          >
            Tiếp tục
          </button>

        </div>

      `

    }


    /* ===================================================
       PREDICTION / QUIZ
    =================================================== */

    if (

      step.type ===
        'prediction' ||

      step.type ===
        'quiz'

    ) {

      const options =
        Array.isArray(
          step.options
        )

          ? step.options

          : []


      return `

        <div class="guided-prediction">

          <span class="guided-step-kicker">

            ${
              step.type ===
                'quiz'

                ? 'KIỂM TRA KIẾN THỨC'

                : 'DỰ ĐOÁN TRƯỚC KHI THỰC HIỆN'
            }

          </span>


          <strong>
            ${escapeHTML(
              step.question ||
              ''
            )}
          </strong>


          <div class="guided-prediction-options">

            ${
              options
                .map(
                  option => `

                    <button
                      type="button"
                      data-prediction-option="${escapeHTML(
                        option.id
                      )}"
                    >

                      ${escapeHTML(
                        option.text
                      )}

                    </button>

                  `
                )
                .join(
                  ''
                )
            }

          </div>

        </div>

      `

    }


    /* ===================================================
       ADD
    =================================================== */

    if (
      step.type ===
      'add'
    ) {

      return `

        <div class="guided-action-step">

          <span class="guided-step-kicker">
            THAO TÁC TRONG LAB
          </span>


          <strong>
            ${escapeHTML(
              step.text ||
              ''
            )}
          </strong>


          <p>

            ${escapeHTML(

              step.hint ||

              'Chọn đúng hóa chất trong kho bên dưới và thêm vào cốc.'

            )}

          </p>


          <span class="guided-target-chip">

            ${escapeHTML(
              step.chemical ||
              ''
            )}

          </span>

        </div>

      `

    }


    /* ===================================================
       HEAT
    =================================================== */

    if (
      step.type ===
      'heat'
    ) {

      return `

        <div class="guided-action-step">

          <span class="guided-step-kicker">
            GIA NHIỆT
          </span>


          <strong>
            ${escapeHTML(
              step.text ||
              ''
            )}
          </strong>


          <p>

            ${escapeHTML(

              step.hint ||

              'Sử dụng nút Bật lửa trong phòng thí nghiệm.'

            )}

          </p>

        </div>

      `

    }


    /* ===================================================
       TEMPERATURE
    =================================================== */

    if (
      step.type ===
      'temperature'
    ) {

      const min =
        step.minTemperature ??
        0


      const range =
        step.maxTemperature !==
          undefined

          ? `${min}–${step.maxTemperature} °C`

          : `≥ ${min} °C`


      return `

        <div class="guided-action-step">

          <span class="guided-step-kicker">
            NHIỆT ĐỘ MỤC TIÊU
          </span>


          <strong>

            ${escapeHTML(

              step.text ||

              `Gia nhiệt đến ${range}.`

            )}

          </strong>


          <p>
            ChemLab sẽ tự nhận biết khi
            nhiệt độ đạt điều kiện.
          </p>


          <span class="guided-target-chip">
            ${escapeHTML(
              range
            )}
          </span>

        </div>

      `

    }


    /* ===================================================
       REACTION
    =================================================== */

    if (
      step.type ===
      'reaction'
    ) {

      return `

        <div class="guided-action-step">

          <span class="guided-step-kicker">
            QUAN SÁT PHẢN ỨNG
          </span>


          <strong>
            ${escapeHTML(
              step.text ||
              ''
            )}
          </strong>


          <p>
            Hệ thống sẽ tự chuyển bước
            khi phản ứng đúng xảy ra.
          </p>

        </div>

      `

    }


    return `

      <div class="guided-action-step">

        <strong>

          ${escapeHTML(

            step.text ||
            'Thực hiện bước tiếp theo.'

          )}

        </strong>

      </div>

    `

  }


  /* =====================================================
     PROGRESS CHANGED
  ===================================================== */

  window.addEventListener(

    'chemlab:progress-changed',

    () => {

      if (
        startingExperiment
      ) {

        return

      }


      if (
        shell.classList.contains(
          'guided-running'
        )
      ) {

        return

      }


      if (
        mode !==
        'guided'
      ) {

        return

      }


      if (
        currentLessonId &&
        currentGrade
      ) {

        renderLesson(
          currentGrade,
          currentLessonId
        )


        return

      }


      if (
        currentGrade
      ) {

        renderGrade(
          currentGrade
        )


        return

      }


      renderGradeHome()

    }

  )


  /* =====================================================
     START
  ===================================================== */

  setMode(
    'free'
  )

}


/* =========================================================
   LESSON TYPE LABEL
========================================================= */

function getTypeLabel(
  type
) {

  const labels = {

    concept:
      'Concept Learning',

    reaction:
      'Reaction Lab',

    process:
      'Process Learning',

    challenge:
      'Challenge',

    theory:
      'Bài học',

    quiz:
      'Luyện tập'

  }


  return (
    labels[type] ||
    'Guided Learning'
  )

}


/* =========================================================
   SEARCH NORMALIZER
========================================================= */

function normalizeSearch(
  value
) {

  return String(
    value ??
    ''
  )

    .normalize(
      'NFD'
    )

    .replace(
      /[\u0300-\u036f]/g,
      ''
    )

    .toLowerCase()

    .trim()

}


/* =========================================================
   REDUCED MOTION
========================================================= */

function prefersReducedMotion() {

  return window
    .matchMedia(
      '(prefers-reduced-motion: reduce)'
    )
    .matches

}


/* =========================================================
   ESCAPE
========================================================= */

function escapeHTML(
  value
) {

  return String(
    value ??
    ''
  )

    .replace(
      /&/g,
      '&amp;'
    )

    .replace(
      /</g,
      '&lt;'
    )

    .replace(
      />/g,
      '&gt;'
    )

    .replace(
      /"/g,
      '&quot;'
    )

    .replace(
      /'/g,
      '&#039;'
    )

}