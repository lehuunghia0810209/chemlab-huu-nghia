import { holdDialogFocus } from './shell/dialogFocus.js'
import { findMolecule } from './chem/molecules.js'
import { parseFormula as parseSharedFormula } from './chem/formula.js'
import { APP_VERSION } from './appMeta.js'

import {
  elements
} from './data/elements.js'

import './compoundStudio.css'


/* =========================================================
   CHEMLAB
   COMPOUND STUDIO
========================================================= */

const AVOGADRO =
  6.02214076e23


const HISTORY_KEY =
  'chemlab-v5-compounds'


let currentStudio =
  null


/* =========================================================
   ELEMENT DATABASE
========================================================= */

const ELEMENT_DATABASE =
  elements
    .map(
      (
        raw,
        index
      ) =>
        normalizeElement(
          raw,
          index
        )
    )
    .filter(
      element =>
        element.symbol &&
        Number.isFinite(
          element.mass
        )
    )


const ELEMENT_MAP =
  new Map(
    ELEMENT_DATABASE.map(
      element => [
        element.symbol,
        element
      ]
    )
  )


/* =========================================================
   COMMON GROUPS
========================================================= */

const COMMON_GROUPS = [

  {
    token: 'NH4',
    name: 'Ammonium',
    formula: 'NH₄⁺'
  },

  {
    token: 'OH',
    name: 'Hydroxide',
    formula: 'OH⁻'
  },

  {
    token: 'NO3',
    name: 'Nitrate',
    formula: 'NO₃⁻'
  },

  {
    token: 'NO2',
    name: 'Nitrite',
    formula: 'NO₂⁻'
  },

  {
    token: 'SO4',
    name: 'Sulfate',
    formula: 'SO₄²⁻'
  },

  {
    token: 'SO3',
    name: 'Sulfite',
    formula: 'SO₃²⁻'
  },

  {
    token: 'CO3',
    name: 'Carbonate',
    formula: 'CO₃²⁻'
  },

  {
    token: 'HCO3',
    name: 'Hydrogen carbonate',
    formula: 'HCO₃⁻'
  },

  {
    token: 'PO4',
    name: 'Phosphate',
    formula: 'PO₄³⁻'
  },

  {
    token: 'MnO4',
    name: 'Permanganate',
    formula: 'MnO₄⁻'
  }

]


const PRESETS = [

  'H2O',
  'NaCl',
  'CaCO3',
  'H2SO4',
  'NaOH',
  'CuSO4',
  'CuSO4·5H2O',
  'C6H12O6'

]


/* =========================================================
   OPEN
========================================================= */

export function openCompoundStudio({
  context = null,
  showMolecule = false
} = {}) {

  closeCompoundStudio()


  const initialFormula =
    context
      ?.compound
      ?.formula ||
    context
      ?.formula ||
    'H2O'


  const overlay =
    document.createElement(
      'div'
    )


  overlay.className =
    'cs5-overlay'


  overlay.innerHTML = `
    <section
      class="cs5-window"
      role="dialog"
      aria-modal="true"
      aria-label="Compound Studio"
    >

      <header class="cs5-header">

        <div class="cs5-brand">

          <div class="cs5-brand-icon">
            ◇
          </div>


          <div>

            <span>
              CHEMLAB ${APP_VERSION}
            </span>

            <h2>
              Compound Studio
            </h2>

            <p>
              Phân tích và làm việc với công thức hóa học.
            </p>

          </div>

        </div>


        <button
          type="button"
          class="cs5-close"
          data-cs-close
        >
          ×
        </button>

      </header>


      <section class="cs5-input-section">

        <div class="cs5-formula-input">

          <span>
            Công thức
          </span>


          <div>

            <input
              type="text"
              value="${escapeHTML(initialFormula)}"
              spellcheck="false"
              autocomplete="off"
              data-cs-formula
              placeholder="VD: CaCO3, H2SO4, CuSO4·5H2O"
            >


            <button
              type="button"
              data-cs-analyze
            >
              Phân tích
            </button>

          </div>


          <small>
            Hỗ trợ ngoặc, hệ số và hydrate.
            Ví dụ: Ca(OH)₂, Al₂(SO₄)₃, CuSO₄·5H₂O.
          </small>

        </div>


        <div class="cs5-presets">

          ${
            PRESETS
              .map(
                formula => `
                  <button
                    type="button"
                    data-cs-preset="${formula}"
                  >
                    ${formatFormula(formula)}
                  </button>
                `
              )
              .join('')
          }

        </div>

      </section>


      <div
        class="cs5-error"
        data-cs-error
        hidden
      ></div>


      <main class="cs5-main">

        <section class="cs5-primary">

          <div class="cs5-formula-hero">

            <span>
              Công thức đang phân tích
            </span>


            <strong data-cs-formula-display>
              —
            </strong>


            <small data-cs-classification>
              —
            </small>

          </div>


          <div class="cs5-metrics">

            ${metricCard(
              'Khối lượng mol',
              '—',
              'g/mol',
              'mass'
            )}

            ${metricCard(
              'NGUYÊN TỐ',
              '—',
              'loại',
              'elements'
            )}

            ${metricCard(
              'TỔNG NGUYÊN TỬ',
              '—',
              'nguyên tử',
              'atoms'
            )}

          </div>


          <section class="cs5-card">

            <header>

              <div>

                <span>
                  Thành phần
                </span>

                <h3>
                  Thành phần nguyên tố
                </h3>

              </div>

            </header>


            <div
              class="cs5-composition"
              data-cs-composition
            ></div>

          </section>


          <section class="cs5-card">

            <header>

              <div>

                <span>
                  Gợi ý cấu trúc
                </span>

                <h3>
                  Nhóm ion nhận diện
                </h3>

              </div>

            </header>


            <div
              class="cs5-groups"
              data-cs-groups
            ></div>

          </section>


          <section
            class="cs5-card cs5-molecule"
            data-cs-molecule
            hidden
          >

            <header>
              <div>
                <span>Hình học phân tử</span>
                <h3 data-cs-molecule-title>Mô hình 3D</h3>
              </div>
            </header>

            <dl class="cs5-molecule-facts" data-cs-molecule-facts></dl>

            <div class="cs5-molecule-stage" data-cs-molecule-stage>
              <button type="button" class="cs5-molecule-load" data-cs-molecule-load>
                Hiển thị mô hình 3D
              </button>
            </div>

            <div class="cs5-molecule-tools" data-cs-molecule-tools hidden>
              <div class="cs5-segmented" role="group" aria-label="Kiểu mô hình">
                <button type="button" data-cs-molecule-style="ball" aria-pressed="true">Que – cầu</button>
                <button type="button" data-cs-molecule-style="space" aria-pressed="false">Đặc</button>
              </div>
              <button type="button" data-cs-molecule-reset>Đặt lại góc nhìn</button>
            </div>

            <p class="cs5-molecule-note">
              Độ dài và góc liên kết: giá trị thực nghiệm ở pha khí, đã làm tròn. Mô hình que – cầu thu nhỏ nguyên tử để thấy liên kết; mô hình đặc dùng bán kính van der Waals. Kéo để xoay, cuộn hoặc chụm hai ngón để thu phóng.
            </p>

          </section>

        </section>


        <aside class="cs5-sidebar">

          <section class="cs5-card cs5-converter">

            <header>

              <div>

                <span>
                  Mẫu chất
                </span>

                <h3>
                  Khối lượng → mol
                </h3>

              </div>

            </header>


            <label>

              <span>
                Khối lượng mẫu
              </span>


              <div>

                <input
                  type="number"
                  min="0"
                  step="any"
                  value="1"
                  data-cs-grams
                >

                <b>
                  g
                </b>

              </div>

            </label>


            <div class="cs5-conversion-result">

              <div>

                <span>
                  Số mol
                </span>

                <strong data-cs-moles>
                  —
                </strong>

              </div>


              <div>

                <span>
                  Số hạt
                </span>

                <strong data-cs-particles>
                  —
                </strong>

              </div>

            </div>

          </section>


          <section class="cs5-card">

            <header>

              <div>

                <span>
                  Gần đây
                </span>

                <h3>
                  Công thức gần đây
                </h3>

              </div>

            </header>


            <div
              class="cs5-history"
              data-cs-history
            ></div>

          </section>


          <section class="cs5-card cs5-workflow">

            <header>

              <div>

                <span>
                  Chem Flow
                </span>

                <h3>
                  Tiếp tục với hợp chất
                </h3>

              </div>

            </header>


            <button
              type="button"
              data-cs-flow="molar"
            >
              <span>∑</span>

              <div>
                <strong>
                  Khối lượng mol
                </strong>

                <small>
                  Chuyển sang máy tính
                </small>
              </div>

              <b>→</b>
            </button>


            <button
              type="button"
              data-cs-flow="solubility"
            >
              <span>◫</span>

              <div>
                <strong>
                  Tính tan
                </strong>

                <small>
                  Tra cứu dung dịch
                </small>
              </div>

              <b>→</b>
            </button>


            <button
              type="button"
              data-cs-flow="lab"
            >
              <span>⌁</span>

              <div>
                <strong>
                  Virtual Lab
                </strong>

                <small>
                  Đưa vào phòng thí nghiệm
                </small>
              </div>

              <b>→</b>
            </button>

          </section>

        </aside>

      </main>


      <footer class="cs5-footer">

        <div>

          <span>
            Ctrl + Enter
          </span>

          để lưu vào Chem Flow

        </div>


        <div>

          <button
            type="button"
            class="secondary"
            data-cs-close
          >
            Đóng
          </button>


          <button
            type="button"
            class="primary"
            data-cs-save
          >
            Lưu vào Chem Flow
          </button>

        </div>

      </footer>

    </section>
  `


  document.body.appendChild(
    overlay
  )

  const releaseFocus = holdDialogFocus(overlay, { initial: '[data-cs-formula]' })


  const formulaInput =
    overlay.querySelector(
      '[data-cs-formula]'
    )


  const gramsInput =
    overlay.querySelector(
      '[data-cs-grams]'
    )


  let currentAnalysis =
    null


  /* =====================================================
     ANALYZE
  ===================================================== */

  function analyze() {

    const formula =
      formulaInput.value
        .trim()


    if (!formula) {

      showError(
        'Hãy nhập công thức hóa học.'
      )

      return

    }


    try {

      const counts =
        parseFormula(
          formula
        )


      const analysis =
        analyzeCompound(
          formula,
          counts
        )


      currentAnalysis =
        analysis


      hideError()


      renderAnalysis(
        analysis
      )


      updateConverter()

      renderMolecule(
        Object.fromEntries(counts)
      )

    }

    catch (error) {

      currentAnalysis =
        null


      showError(
        error.message ||
        'Không thể đọc công thức.'
      )

    }

  }


  /* =====================================================
     RENDER
  ===================================================== */

  function renderAnalysis(
    analysis
  ) {

    overlay.querySelector(
      '[data-cs-formula-display]'
    ).innerHTML =
      formatFormula(
        analysis.formula
      )


    overlay.querySelector(
      '[data-cs-classification]'
    ).textContent =
      analysis.classification


    setMetric(
      'mass',
      formatNumber(
        analysis.molarMass,
        3
      )
    )


    setMetric(
      'elements',
      analysis.elementCount
    )


    setMetric(
      'atoms',
      analysis.atomCount
    )


    renderComposition(
      analysis
    )


    renderGroups(
      analysis
    )


    saveFormulaHistory(
      analysis.formula
    )


    renderHistory()

  }


  /* =====================================================
     COMPOSITION
  ===================================================== */

  function renderComposition(
    analysis
  ) {

    const host =
      overlay.querySelector(
        '[data-cs-composition]'
      )


    host.innerHTML =
      analysis.composition
        .map(
          item => `
            <article class="cs5-element-row">

              <div class="cs5-element-symbol">
                ${item.symbol}
              </div>


              <div class="cs5-element-info">

                <div>

                  <strong>
                    ${item.name}
                  </strong>

                  <span>
                    ${item.count}
                    nguyên tử
                  </span>

                </div>


                <div class="cs5-element-bar">

                  <i
                    style="
                      width:
                      ${Math.max(
                        2,
                        item.percent
                      )}%;
                    "
                  ></i>

                </div>

              </div>


              <div class="cs5-element-percent">

                <strong>
                  ${formatNumber(
                    item.percent,
                    2
                  )}%
                </strong>

                <span>
                  ${formatNumber(
                    item.massContribution,
                    3
                  )} g/mol
                </span>

              </div>

            </article>
          `
        )
        .join('')

  }


  /* =====================================================
     GROUPS
  ===================================================== */

  function renderGroups(
    analysis
  ) {

    const host =
      overlay.querySelector(
        '[data-cs-groups]'
      )


    if (
      !analysis.groups.length
    ) {

      host.innerHTML = `
        <div class="cs5-empty">

          Không nhận diện nhóm ion đa nguyên tử
          phổ biến trong công thức này.

        </div>
      `


      return

    }


    host.innerHTML =
      analysis.groups
        .map(
          group => `
            <div class="cs5-group-chip">

              <strong>
                ${group.formula}
              </strong>

              <span>
                ${group.name}
              </span>

            </div>
          `
        )
        .join('')

  }


  /* =====================================================
     CONVERTER
  ===================================================== */

  function updateConverter() {

    const molesOutput =
      overlay.querySelector(
        '[data-cs-moles]'
      )


    const particlesOutput =
      overlay.querySelector(
        '[data-cs-particles]'
      )


    if (
      !currentAnalysis
    ) {

      molesOutput.textContent =
        '—'


      particlesOutput.textContent =
        '—'


      return

    }


    const grams =
      Number(
        gramsInput.value
      )


    if (
      !Number.isFinite(grams) ||
      grams < 0
    ) {

      molesOutput.textContent =
        '—'


      particlesOutput.textContent =
        '—'


      return

    }


    const moles =
      grams /
      currentAnalysis.molarMass


    const particles =
      moles *
      AVOGADRO


    molesOutput.textContent =
      formatScientific(
        moles,
        5
      )


    particlesOutput.textContent =
      formatScientific(
        particles,
        4
      )

  }


  /* =====================================================
     HISTORY
  ===================================================== */

  function renderHistory() {

    const host =
      overlay.querySelector(
        '[data-cs-history]'
      )


    const history =
      loadFormulaHistory()


    if (!history.length) {

      host.innerHTML = `
        <div class="cs5-empty small">
          Chưa có công thức gần đây.
        </div>
      `


      return

    }


    host.innerHTML =
      history
        .map(
          formula => `
            <button
              type="button"
              data-cs-history-formula="${escapeHTML(formula)}"
            >

              <strong>
                ${formatFormula(formula)}
              </strong>

              <span>
                Mở lại
              </span>

            </button>
          `
        )
        .join('')

  }


  /* =====================================================
     SAVE FLOW
  ===================================================== */

  function saveToFlow() {

    if (
      !currentAnalysis
    ) {

      analyze()

    }


    if (
      !currentAnalysis
    ) {
      return false
    }


    window.ChemLabContext
      ?.captureCompound?.({

        formula:
          currentAnalysis.formula,

        name:
          `Hợp chất ${currentAnalysis.formula}`

      })


    return true

  }


  /* =====================================================
     FLOW ACTION
  ===================================================== */

  async function sendTo(
    destination
  ) {

    if (
      !saveToFlow()
    ) {
      return
    }


    close()


    await window
      .ChemLabContext
      ?.go?.(
        destination
      )

  }


  /* =====================================================
     EVENTS
  ===================================================== */

  overlay
    .querySelector(
      '[data-cs-analyze]'
    )
    .addEventListener(
      'click',
      analyze
    )


  formulaInput.addEventListener(
    'keydown',
    event => {

      if (
        event.key ===
        'Enter'
      ) {

        analyze()

      }

    }
  )


  gramsInput.addEventListener(
    'input',
    updateConverter
  )


  overlay
    .querySelectorAll(
      '[data-cs-preset]'
    )
    .forEach(
      button => {

        button.addEventListener(
          'click',
          () => {

            formulaInput.value =
              button.dataset
                .csPreset


            analyze()

          }
        )

      }
    )


  overlay.addEventListener(
    'click',
    event => {

      const history =
        event.target.closest(
          '[data-cs-history-formula]'
        )


      if (history) {

        formulaInput.value =
          history.dataset
            .csHistoryFormula


        analyze()

        return

      }


      const flow =
        event.target.closest(
          '[data-cs-flow]'
        )


      if (flow) {

        sendTo(
          flow.dataset
            .csFlow
        )

      }

    }
  )


  overlay
    .querySelector(
      '[data-cs-save]'
    )
    .addEventListener(
      'click',
      saveToFlow
    )


  overlay
    .querySelectorAll(
      '[data-cs-close]'
    )
    .forEach(
      button => {

        button.addEventListener(
          'click',
          close
        )

      }
    )


  overlay.addEventListener(
    'click',
    event => {

      if (
        event.target ===
        overlay
      ) {

        close()

      }

    }
  )


  const keyboard =
    event => {

      if (
        event.key ===
        'Escape'
      ) {

        close()

      }


      if (
        event.ctrlKey &&
        event.key ===
        'Enter'
      ) {

        event.preventDefault()

        saveToFlow()

      }

    }


  document.addEventListener(
    'keydown',
    keyboard
  )


  /* =====================================================
     CLOSE
  ===================================================== */


  /* =====================================================
     MOLECULE 3D (lazy: Three.js loads on request)
  ===================================================== */

  let molecule = null
  let moleculeHost = null
  let moleculeView = null

  function disposeMoleculeView() {
    moleculeHost?.dispose()
    moleculeHost = null
    moleculeView = null
    overlay.querySelector('[data-cs-molecule-tools]').hidden = true
    overlay.querySelector('[data-cs-molecule-stage]').innerHTML = `
      <button type="button" class="cs5-molecule-load" data-cs-molecule-load>
        Hiển thị mô hình 3D
      </button>
    `
  }

  function renderMolecule(atoms) {
    const card = overlay.querySelector('[data-cs-molecule]')
    const next = findMolecule(atoms)

    if (next === molecule && moleculeHost) return

    disposeMoleculeView()
    molecule = next
    card.hidden = !molecule
    if (!molecule) return

    overlay.querySelector('[data-cs-molecule-title]').textContent = `${molecule.name} · ${molecule.shape}`

    const facts = [
      ['Hình dạng', molecule.shape],
      molecule.angle && ['Góc liên kết', `${molecule.angle[0]} ≈ ${String(molecule.angle[1]).replace('.', ',')}°`],
      ['Độ dài liên kết', `${molecule.length[0]} ≈ ${String(molecule.length[1]).replace('.', ',')} Å`],
      molecule.lonePairs !== undefined && [`Cặp e không liên kết ở ${molecule.atoms[0][0]}`, String(molecule.lonePairs)]
    ].filter(Boolean)

    overlay.querySelector('[data-cs-molecule-facts]').innerHTML = facts
      .map(([term, value]) => `<div><dt>${escapeHTML(term)}</dt><dd>${escapeHTML(value)}</dd></div>`)
      .join('')
  }

  async function showMoleculeView() {
    if (!molecule || moleculeHost) return
    const stage = overlay.querySelector('[data-cs-molecule-stage]')
    const target = molecule
    stage.innerHTML = '<p class="cs5-molecule-loading">Đang tải mô hình 3D…</p>'

    try {
      const [{ createSceneHost }, { createMoleculeScene }] = await Promise.all([
        import('./three/sceneHost.js'),
        import('./atomic/moleculeScene.js')
      ])
      // The studio may have closed or switched formula while loading.
      if (!overlay.isConnected || molecule !== target) return

      stage.innerHTML = ''
      moleculeHost = createSceneHost({
        container: stage,
        cameraPosition: { x: 0, y: 0, z: 8 },
        label: `Mô hình 3D phân tử ${molecule.formula}`
      })
      if (!moleculeHost) return

      moleculeView = createMoleculeScene(moleculeHost, molecule)
      // Seen from above and to the side so no atom hides behind the central one.
      const distance = Math.max(3.4, moleculeView.radius * 2.6 + 2.4)
      const home = new moleculeHost.THREE.Vector3(0.35, 0.9, 1).setLength(distance)
      moleculeHost.camera.position.copy(home)
      moleculeHost.setHome(home)
      moleculeHost.controls.update()
      moleculeHost.requestRender()

      overlay.querySelector('[data-cs-molecule-tools]').hidden = false
      overlay.querySelectorAll('[data-cs-molecule-style]').forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.csMoleculeStyle === 'ball'))
      })
    }
    catch {
      stage.innerHTML = '<p class="cs5-molecule-loading">Không tải được mô hình 3D. Hãy thử lại.</p>'
    }
  }

  overlay.addEventListener('click', event => {
    if (event.target.closest('[data-cs-molecule-load]')) {
      showMoleculeView()
      return
    }
    const styleButton = event.target.closest('[data-cs-molecule-style]')
    if (styleButton && moleculeView) {
      moleculeView.setStyle(styleButton.dataset.csMoleculeStyle)
      overlay.querySelectorAll('[data-cs-molecule-style]').forEach(button => {
        button.setAttribute('aria-pressed', String(button === styleButton))
      })
      return
    }
    if (event.target.closest('[data-cs-molecule-reset]')) {
      moleculeHost?.resetView()
    }
  })

  function close() {

    moleculeHost?.dispose()
    moleculeHost = null

    document.removeEventListener(
      'keydown',
      keyboard
    )


    overlay.remove()
    releaseFocus()


    if (
      currentStudio?.overlay ===
      overlay
    ) {

      currentStudio =
        null

    }

  }


  /* =====================================================
     ERROR
  ===================================================== */

  function showError(
    message
  ) {

    const error =
      overlay.querySelector(
        '[data-cs-error]'
      )


    error.textContent =
      message


    error.hidden =
      false

  }


  function hideError() {

    overlay.querySelector(
      '[data-cs-error]'
    ).hidden =
      true

  }


  /* =====================================================
     METRIC
  ===================================================== */

  function setMetric(
    id,
    value
  ) {

    overlay.querySelector(
      `[data-cs-metric="${id}"]`
    ).textContent =
      value

  }


  /* =====================================================
     START
  ===================================================== */

  currentStudio = {
    overlay,
    close
  }


  renderHistory()

  analyze()

  if (showMolecule) {
    showMoleculeView()
  }

}


/* =========================================================
   CLOSE PUBLIC
========================================================= */

export function closeCompoundStudio() {

  currentStudio
    ?.close?.()

}


/* =========================================================
   ANALYZE COMPOUND
========================================================= */

function analyzeCompound(
  formula,
  counts
) {

  let molarMass =
    0


  let atomCount =
    0


  const items =
    []


  for (
    const [
      symbol,
      count
    ]
    of counts.entries()
  ) {

    const element =
      ELEMENT_MAP.get(
        symbol
      )


    if (!element) {

      throw new Error(
        `Không tìm thấy nguyên tố "${symbol}".`
      )

    }


    const massContribution =
      element.mass *
      count


    molarMass +=
      massContribution


    atomCount +=
      count


    items.push({

      symbol,

      name:
        element.name,

      count,

      atomicMass:
        element.mass,

      massContribution

    })

  }


  if (
    molarMass <=
    0
  ) {

    throw new Error(
      'Không thể tính khối lượng mol.'
    )

  }


  items.forEach(
    item => {

      item.percent =
        (
          item.massContribution /
          molarMass
        ) *
        100

    }
  )


  items.sort(
    (
      a,
      b
    ) =>
      b.percent -
      a.percent
  )


  return {

    formula:
      normalizeFormulaInput(
        formula
      ),

    molarMass,

    atomCount,

    elementCount:
      counts.size,

    composition:
      items,

    groups:
      detectGroups(
        formula
      ),

    classification:
      classifyCompound(
        counts
      )

  }

}


/* =========================================================
   FORMULA PARSER
========================================================= */

function parseFormula(formula) {
  return new Map(Object.entries(parseSharedFormula(formula)))
}


/* =========================================================
   PARSE ONE PART
========================================================= */



/* =========================================================
   READ NUMBER
========================================================= */



/* =========================================================
   GROUP DETECTION
========================================================= */

function detectGroups(
  formula
) {

  const plain =
    normalizeFormulaInput(
      formula
    )
      .replace(
        /[()[\]{}]/g,
        ''
      )


  return COMMON_GROUPS
    .filter(
      group =>
        plain.includes(
          group.token
        )
    )

}


/* =========================================================
   CLASSIFICATION
========================================================= */

function classifyCompound(
  counts
) {

  if (
    counts.size ===
    1
  ) {

    return 'Đơn chất'

  }


  if (
    counts.size ===
    2
  ) {

    return 'Hợp chất gồm 2 nguyên tố'

  }


  if (
    counts.has('C') &&
    counts.has('H')
  ) {

    return 'Hợp chất chứa carbon và hydrogen'

  }


  return `Hợp chất gồm ${counts.size} nguyên tố`

}


/* =========================================================
   ELEMENT NORMALIZATION
========================================================= */

function normalizeElement(
  raw,
  index
) {

  const data =
    Array.isArray(raw)
      ? {

          number:
            raw[0],

          symbol:
            raw[1],

          name:
            raw[2],

          mass:
            raw[3]

        }
      : {
          ...raw
        }


  const mass =
    parseMass(
      data.mass ??
      data.atomicMass ??
      data.atomic_mass
    )


  return {

    number:
      Number(
        data.number ??
        data.atomicNumber ??
        data.atomic_number ??
        index + 1
      ),

    symbol:
      data.symbol,

    name:
      data.name ||
      data.symbol,

    mass

  }

}


/* =========================================================
   MASS
========================================================= */

function parseMass(
  value
) {

  const match =
    String(
      value ??
      ''
    )
      .replace(
        ',',
        '.'
      )
      .match(
        /\d+(?:\.\d+)?/
      )


  if (!match) {
    return NaN
  }


  return Number(
    match[0]
  )

}


/* =========================================================
   FORMULA NORMALIZATION
========================================================= */

function normalizeFormulaInput(
  value
) {

  return String(
    value || ''
  )
    .trim()
    .replace(
      /\s+/g,
      ''
    )
    .replace(
      /₀/g,
      '0'
    )
    .replace(
      /₁/g,
      '1'
    )
    .replace(
      /₂/g,
      '2'
    )
    .replace(
      /₃/g,
      '3'
    )
    .replace(
      /₄/g,
      '4'
    )
    .replace(
      /₅/g,
      '5'
    )
    .replace(
      /₆/g,
      '6'
    )
    .replace(
      /₇/g,
      '7'
    )
    .replace(
      /₈/g,
      '8'
    )
    .replace(
      /₉/g,
      '9'
    )

}


/* =========================================================
   BRACKETS
========================================================= */



/* =========================================================
   UI HELPERS
========================================================= */

function metricCard(
  title,
  value,
  unit,
  id
) {

  return `
    <article>

      <span>
        ${title}
      </span>

      <strong
        data-cs-metric="${id}"
      >
        ${value}
      </strong>

      <small>
        ${unit}
      </small>

    </article>
  `

}


/* =========================================================
   FORMAT FORMULA
========================================================= */

function formatFormula(
  formula
) {

  const safe =
    escapeHTML(
      formula
    )


  return safe.replace(
    /(\d+)/g,
    '<sub>$1</sub>'
  )

}


/* =========================================================
   NUMBERS
========================================================= */

function formatNumber(
  value,
  digits = 3
) {

  return Number(value)
    .toLocaleString(
      'vi-VN',
      {
        maximumFractionDigits:
          digits
      }
    )

}


function formatScientific(
  value,
  digits
) {

  if (
    !Number.isFinite(
      value
    )
  ) {
    return '—'
  }


  if (
    value ===
    0
  ) {
    return '0'
  }


  if (
    Math.abs(value) >=
      100000 ||
    Math.abs(value) <
      .001
  ) {

    return value
      .toExponential(
        digits
      )

  }


  return formatNumber(
    value,
    digits
  )

}


/* =========================================================
   HISTORY
========================================================= */

function saveFormulaHistory(
  formula
) {

  try {

    const old =
      loadFormulaHistory()


    const list = [

      formula,

      ...old.filter(
        item =>
          item !==
          formula
      )

    ]
      .slice(
        0,
        8
      )


    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(
        list
      )
    )

  }

  catch {

    /* ignore */

  }

}


function loadFormulaHistory() {

  try {

    const list =
      JSON.parse(
        localStorage.getItem(
          HISTORY_KEY
        ) ||
        '[]'
      )


    return Array.isArray(list)
      ? list
      : []

  }

  catch {

    return []

  }

}


/* =========================================================
   ESCAPE
========================================================= */

function escapeHTML(
  value
) {

  return String(
    value || ''
  )
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;')

}