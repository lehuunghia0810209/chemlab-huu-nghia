import {
  elements
} from './data/elements.js'

import './compoundStudio.css'


/* =========================================================
   CHEMLAB 5.1
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
  context = null
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
              CHEMLAB 5.1
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
            CÔNG THỨC
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
              CÔNG THỨC ĐANG PHÂN TÍCH
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
              'MOLAR MASS',
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
                  COMPOSITION
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
                  STRUCTURE HINT
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

        </section>


        <aside class="cs5-sidebar">

          <section class="cs5-card cs5-converter">

            <header>

              <div>

                <span>
                  SAMPLE
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
                  RECENT
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
                  CHEM FLOW
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
                  Molar Mass
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

  function close() {

    document.removeEventListener(
      'keydown',
      keyboard
    )


    overlay.remove()


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

function parseFormula(
  original
) {

  let formula =
    normalizeFormulaInput(
      original
    )


  if (!formula) {

    throw new Error(
      'Công thức đang trống.'
    )

  }


  /*
    Hydrate:
    CuSO4·5H2O
  */

  const hydrateParts =
    formula.split(
      /[·.]/g
    )


  const total =
    new Map()


  for (
    let part
    of hydrateParts
  ) {

    if (!part) {
      continue
    }


    let multiplier =
      1


    const coefficient =
      part.match(
        /^(\d+)(?=[A-Z([{])/
      )


    if (coefficient) {

      multiplier =
        Number(
          coefficient[1]
        )


      part =
        part.slice(
          coefficient[1].length
        )

    }


    const counts =
      parseFormulaPart(
        part
      )


    for (
      const [
        symbol,
        count
      ]
      of counts
    ) {

      total.set(

        symbol,

        (
          total.get(symbol) ||
          0
        ) +
        count *
        multiplier

      )

    }

  }


  if (
    total.size ===
    0
  ) {

    throw new Error(
      'Không đọc được công thức.'
    )

  }


  return total

}


/* =========================================================
   PARSE ONE PART
========================================================= */

function parseFormulaPart(
  formula
) {

  const stack = [
    new Map()
  ]


  const bracketStack =
    []


  let index =
    0


  while (
    index <
    formula.length
  ) {

    const char =
      formula[index]


    /* -----------------------------------------------
       OPEN BRACKET
    ----------------------------------------------- */

    if (
      char === '(' ||
      char === '[' ||
      char === '{'
    ) {

      stack.push(
        new Map()
      )


      bracketStack.push(
        char
      )


      index++

      continue

    }


    /* -----------------------------------------------
       CLOSE BRACKET
    ----------------------------------------------- */

    if (
      char === ')' ||
      char === ']' ||
      char === '}'
    ) {

      if (
        stack.length ===
        1
      ) {

        throw new Error(
          'Ngoặc trong công thức không hợp lệ.'
        )

      }


      const open =
        bracketStack.pop()


      if (
        !bracketsMatch(
          open,
          char
        )
      ) {

        throw new Error(
          'Các loại ngoặc không khớp.'
        )

      }


      const group =
        stack.pop()


      index++


      const number =
        readNumber(
          formula,
          index
        )


      index =
        number.next


      const multiplier =
        number.value


      const parent =
        stack[
          stack.length -
          1
        ]


      for (
        const [
          symbol,
          count
        ]
        of group
      ) {

        parent.set(

          symbol,

          (
            parent.get(symbol) ||
            0
          ) +
          count *
          multiplier

        )

      }


      continue

    }


    /* -----------------------------------------------
       ELEMENT
    ----------------------------------------------- */

    if (
      /[A-Z]/.test(
        char
      )
    ) {

      let symbol =
        char


      index++


      if (
        index <
          formula.length &&
        /[a-z]/.test(
          formula[index]
        )
      ) {

        symbol +=
          formula[index]


        index++

      }


      if (
        !ELEMENT_MAP.has(
          symbol
        )
      ) {

        throw new Error(
          `"${symbol}" không phải ký hiệu nguyên tố hợp lệ.`
        )

      }


      const number =
        readNumber(
          formula,
          index
        )


      index =
        number.next


      const current =
        stack[
          stack.length -
          1
        ]


      current.set(

        symbol,

        (
          current.get(symbol) ||
          0
        ) +
        number.value

      )


      continue

    }


    throw new Error(
      `Ký tự "${char}" không hợp lệ trong công thức.`
    )

  }


  if (
    stack.length !==
    1
  ) {

    throw new Error(
      'Công thức còn ngoặc chưa đóng.'
    )

  }


  return stack[0]

}


/* =========================================================
   READ NUMBER
========================================================= */

function readNumber(
  formula,
  start
) {

  let index =
    start


  let digits =
    ''


  while (
    index <
      formula.length &&
    /\d/.test(
      formula[index]
    )
  ) {

    digits +=
      formula[index]


    index++

  }


  return {

    value:
      digits
        ? Number(digits)
        : 1,

    next:
      index

  }

}


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

function bracketsMatch(
  open,
  close
) {

  return (
    (
      open === '(' &&
      close === ')'
    ) ||
    (
      open === '[' &&
      close === ']'
    ) ||
    (
      open === '{' &&
      close === '}'
    )
  )

}


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