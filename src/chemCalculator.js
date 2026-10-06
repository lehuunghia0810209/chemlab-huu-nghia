import './chemCalculator.css'
import { elements } from './data/elements.js'

export function initChemCalculator() {
  const tools = document.querySelector('#tools')
  if (!tools) return

  document.querySelector('#chem-calculator-v4')?.remove()

  const elementMap = new Map()

  elements.forEach(element => {
    const mass = getAtomicMass(element)

    if (!element.symbol || !mass) return

    elementMap.set(element.symbol, {
      symbol: element.symbol,
      name: element.name || element.symbol,
      mass
    })
  })

  tools.insertAdjacentHTML('beforeend', `
    <section id="chem-calculator-v4" class="chem-calc-v4">

      <div class="cc-header">
        <div>
          <span class="cc-eyebrow">TÍNH TOÁN HÓA HỌC</span>
          <h2>Máy tính hóa học</h2>
          <p>
            Tính khối lượng mol, số mol, nồng độ và thể tích khí
            với các bước tính rõ ràng.
          </p>
        </div>

        <div class="cc-badge">
          <i></i>
          <span>ChemLab 4.1</span>
        </div>
      </div>

      <nav class="cc-tabs" aria-label="Các công cụ tính toán">

        <button class="active" data-calc-tab="molar">
          <span class="cc-tab-icon">M</span>
          <div>
            <strong>Khối lượng mol</strong>
            <small>Phân tích công thức</small>
          </div>
        </button>

        <button data-calc-tab="moles">
          <span class="cc-tab-icon">n</span>
          <div>
            <strong>Số mol</strong>
            <small>n = m / M</small>
          </div>
        </button>

        <button data-calc-tab="concentration">
          <span class="cc-tab-icon">C</span>
          <div>
            <strong>Nồng độ mol</strong>
            <small>C = n / V</small>
          </div>
        </button>

        <button data-calc-tab="gas">
          <span class="cc-tab-icon">V</span>
          <div>
            <strong>Thể tích khí</strong>
            <small>Điều kiện tiêu chuẩn</small>
          </div>
        </button>

      </nav>

      <div class="cc-workspace">

        <!-- MOLAR MASS -->

        <section class="cc-panel active" data-calc-panel="molar">

          <div class="cc-panel-head">
            <div>
              <span>KHỐI LƯỢNG MOL</span>
              <h3>Phân tích công thức hóa học</h3>
              <p>
                Nhập công thức để xem tổng khối lượng và đóng góp
                của từng nguyên tố.
              </p>
            </div>
          </div>

          <div class="cc-formula-box">

            <label for="cc-formula">
              Công thức hóa học
            </label>

            <div class="cc-formula-row">

              <input
                id="cc-formula"
                type="text"
                placeholder="Ví dụ: H2SO4"
                spellcheck="false"
                autocomplete="off"
              >

              <button id="cc-analyze" class="cc-primary">
                Phân tích
              </button>

            </div>

            <div class="cc-examples">
              <span>Thử nhanh</span>

              <button data-formula="H2O">H₂O</button>
              <button data-formula="H2SO4">H₂SO₄</button>
              <button data-formula="Ca(OH)2">Ca(OH)₂</button>
              <button data-formula="Al2(SO4)3">Al₂(SO₄)₃</button>
              <button data-formula="CuSO4·5H2O">CuSO₄·5H₂O</button>
            </div>

          </div>

          <div id="cc-molar-empty" class="cc-empty-state">
            <div class="cc-empty-icon">⚗</div>
            <strong>Nhập một công thức hóa học</strong>
            <span>
              ChemLab sẽ tự động phân tích số nguyên tử
              và khối lượng của từng nguyên tố.
            </span>
          </div>

          <div id="cc-molar-result" class="cc-result hidden">

            <div class="cc-result-summary">

              <div>
                <span>CÔNG THỨC</span>
                <strong id="cc-result-formula">—</strong>
              </div>

              <div class="cc-main-value">
                <span>KHỐI LƯỢNG MOL</span>

                <strong>
                  <b id="cc-result-mass">0</b>
                  <small>g/mol</small>
                </strong>
              </div>

            </div>

            <div class="cc-breakdown-head">
              <div>
                <span>PHÂN TÍCH</span>
                <h4>Thành phần nguyên tố</h4>
              </div>

              <span id="cc-atom-count">
                0 nguyên tử
              </span>
            </div>

            <div id="cc-breakdown" class="cc-breakdown"></div>

          </div>

          <div id="cc-molar-error" class="cc-error hidden"></div>

        </section>


        <!-- MOLES -->

        <section class="cc-panel" data-calc-panel="moles">

          <div class="cc-panel-head">
            <div>
              <span>SỐ MOL</span>
              <h3>Tính số mol từ khối lượng</h3>
              <p>
                Công thức:
                <strong>n = m / M</strong>
              </p>
            </div>
          </div>

          <div class="cc-calc-grid">

            <div class="cc-input-card">

              <label for="cc-mole-formula">
                Công thức
              </label>

              <input
                id="cc-mole-formula"
                type="text"
                placeholder="Ví dụ: NaCl"
                spellcheck="false"
              >

            </div>

            <div class="cc-input-card">

              <label for="cc-mass-input">
                Khối lượng
              </label>

              <div class="cc-unit-input">

                <input
                  id="cc-mass-input"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Ví dụ: 10"
                >

                <span>g</span>

              </div>

            </div>

          </div>

          <button id="cc-calc-moles" class="cc-primary cc-wide">
            Tính số mol
          </button>

          <div id="cc-mole-result" class="cc-answer hidden">

            <div>
              <span>KHỐI LƯỢNG MOL</span>

              <strong>
                <b id="cc-mole-M">0</b>
                g/mol
              </strong>
            </div>

            <div>
              <span>SỐ MOL</span>

              <strong class="highlight">
                <b id="cc-mole-n">0</b>
                mol
              </strong>
            </div>

            <div class="cc-equation">
              n = m / M
            </div>

          </div>

          <div id="cc-mole-error" class="cc-error hidden"></div>

        </section>


        <!-- CONCENTRATION -->

        <section class="cc-panel" data-calc-panel="concentration">

          <div class="cc-panel-head">
            <div>
              <span>NỒNG ĐỘ MOL</span>
              <h3>Tính nồng độ dung dịch</h3>
              <p>
                Công thức:
                <strong>C = n / V</strong>
              </p>
            </div>
          </div>

          <div class="cc-calc-grid">

            <div class="cc-input-card">

              <label for="cc-concentration-moles">
                Số mol chất tan
              </label>

              <div class="cc-unit-input">

                <input
                  id="cc-concentration-moles"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Ví dụ: 0.5"
                >

                <span>mol</span>

              </div>

            </div>

            <div class="cc-input-card">

              <label for="cc-volume-input">
                Thể tích dung dịch
              </label>

              <div class="cc-unit-input">

                <input
                  id="cc-volume-input"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Ví dụ: 500"
                >

                <select id="cc-volume-unit">
                  <option value="ml">mL</option>
                  <option value="l">L</option>
                </select>

              </div>

            </div>

          </div>

          <button id="cc-calc-concentration" class="cc-primary cc-wide">
            Tính nồng độ
          </button>

          <div id="cc-concentration-result" class="cc-answer hidden">

            <div>
              <span>THỂ TÍCH</span>

              <strong>
                <b id="cc-volume-liters">0</b>
                L
              </strong>
            </div>

            <div>
              <span>NỒNG ĐỘ MOL</span>

              <strong class="highlight">
                <b id="cc-concentration-value">0</b>
                mol/L
              </strong>
            </div>

            <div class="cc-equation">
              C = n / V
            </div>

          </div>

          <div id="cc-concentration-error" class="cc-error hidden"></div>

        </section>


        <!-- GAS -->

        <section class="cc-panel" data-calc-panel="gas">

          <div class="cc-panel-head">
            <div>
              <span>CHẤT KHÍ</span>
              <h3>Tính thể tích khí</h3>
              <p>
                Sử dụng thể tích mol
                <strong>24,79 L/mol</strong>
                ở 25 °C và 1 bar.
              </p>
            </div>
          </div>

          <div class="cc-single-input">

            <div class="cc-input-card">

              <label for="cc-gas-moles">
                Số mol khí
              </label>

              <div class="cc-unit-input">

                <input
                  id="cc-gas-moles"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Ví dụ: 2"
                >

                <span>mol</span>

              </div>

            </div>

          </div>

          <button id="cc-calc-gas" class="cc-primary cc-wide">
            Tính thể tích
          </button>

          <div id="cc-gas-result" class="cc-answer hidden">

            <div>
              <span>SỐ MOL</span>

              <strong>
                <b id="cc-gas-n">0</b>
                mol
              </strong>
            </div>

            <div>
              <span>THỂ TÍCH KHÍ</span>

              <strong class="highlight">
                <b id="cc-gas-volume">0</b>
                L
              </strong>
            </div>

            <div class="cc-equation">
              V = n × 24,79
            </div>

          </div>

          <div class="cc-note">
            Giá trị 24,79 L/mol áp dụng ở 25 °C và 1 bar.
          </div>

          <div id="cc-gas-error" class="cc-error hidden"></div>

        </section>

      </div>

    </section>
  `)

  /* =====================================================
     TABS
  ===================================================== */

  const tabButtons =
    tools.querySelectorAll('[data-calc-tab]')

  const panels =
    tools.querySelectorAll('[data-calc-panel]')

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target =
        button.dataset.calcTab

      tabButtons.forEach(item => {
        item.classList.toggle(
          'active',
          item === button
        )
      })

      panels.forEach(panel => {
        panel.classList.toggle(
          'active',
          panel.dataset.calcPanel === target
        )
      })
    })
  })

  /* =====================================================
     MOLAR MASS
  ===================================================== */

  const formulaInput =
    tools.querySelector('#cc-formula')

  const analyzeButton =
    tools.querySelector('#cc-analyze')

  const molarEmpty =
    tools.querySelector('#cc-molar-empty')

  const molarResult =
    tools.querySelector('#cc-molar-result')

  const molarError =
    tools.querySelector('#cc-molar-error')

  analyzeButton.addEventListener(
    'click',
    analyzeFormula
  )

  formulaInput.addEventListener(
    'keydown',
    event => {
      if (event.key === 'Enter') {
        analyzeFormula()
      }
    }
  )

  tools
    .querySelectorAll('[data-formula]')
    .forEach(button => {
      button.addEventListener('click', () => {
        formulaInput.value =
          button.dataset.formula

        analyzeFormula()
      })
    })

  function analyzeFormula() {
    hideError(molarError)

    const formula =
      formulaInput.value.trim()

    if (!formula) {
      showError(
        molarError,
        'Hãy nhập công thức hóa học.'
      )

      return
    }

    try {
      const composition =
        parseChemicalFormula(formula)

      const result =
        calculateMolarMass(composition)

      tools.querySelector(
        '#cc-result-formula'
      ).innerHTML =
        formatFormulaHTML(formula)

      tools.querySelector(
        '#cc-result-mass'
      ).textContent =
        formatNumber(
          result.totalMass,
          3
        )

      const atomCount =
        Object
          .values(composition)
          .reduce(
            (sum, value) =>
              sum + value,
            0
          )

      tools.querySelector(
        '#cc-atom-count'
      ).textContent =
        `${atomCount} nguyên tử`

      renderBreakdown(
        composition,
        result
      )

      molarEmpty.classList.add(
        'hidden'
      )

      molarResult.classList.remove(
        'hidden'
      )
    }

    catch (error) {
      molarResult.classList.add(
        'hidden'
      )

      molarEmpty.classList.remove(
        'hidden'
      )

      showError(
        molarError,
        error.message
      )
    }
  }

  function renderBreakdown(
    composition,
    result
  ) {
    const container =
      tools.querySelector(
        '#cc-breakdown'
      )

    container.innerHTML = ''

    Object.entries(composition)
      .forEach(([symbol, count]) => {
        const element =
          elementMap.get(symbol)

        const contribution =
          element.mass * count

        const percentage =
          contribution /
          result.totalMass *
          100

        const row =
          document.createElement('div')

        row.className =
          'cc-element-row'

        row.innerHTML = `
          <div class="cc-element-symbol">
            ${symbol}
          </div>

          <div class="cc-element-info">

            <div class="cc-element-title">

              <strong>
                ${element.name}
              </strong>

              <span>
                ${symbol} × ${count}
              </span>

            </div>

            <div class="cc-mass-bar">
              <i
                style="width:${Math.max(
                  2,
                  percentage
                )}%"
              ></i>
            </div>

          </div>

          <div class="cc-element-mass">

            <strong>
              ${formatNumber(
                contribution,
                3
              )}
            </strong>

            <span>
              ${formatNumber(
                percentage,
                1
              )}%
            </span>

          </div>
        `

        container.appendChild(row)
      })
  }

  /* =====================================================
     MOLES
  ===================================================== */

  tools
    .querySelector('#cc-calc-moles')
    .addEventListener(
      'click',
      () => {
        const formula =
          tools
            .querySelector(
              '#cc-mole-formula'
            )
            .value
            .trim()

        const mass =
          Number(
            tools
              .querySelector(
                '#cc-mass-input'
              )
              .value
          )

        const result =
          tools.querySelector(
            '#cc-mole-result'
          )

        const error =
          tools.querySelector(
            '#cc-mole-error'
          )

        hideError(error)

        try {
          if (!formula) {
            throw new Error(
              'Hãy nhập công thức hóa học.'
            )
          }

          if (
            !Number.isFinite(mass) ||
            mass <= 0
          ) {
            throw new Error(
              'Khối lượng phải lớn hơn 0.'
            )
          }

          const composition =
            parseChemicalFormula(
              formula
            )

          const molarMass =
            calculateMolarMass(
              composition
            ).totalMass

          const moles =
            mass /
            molarMass

          tools.querySelector(
            '#cc-mole-M'
          ).textContent =
            formatNumber(
              molarMass,
              3
            )

          tools.querySelector(
            '#cc-mole-n'
          ).textContent =
            formatNumber(
              moles,
              5
            )

          result.classList.remove(
            'hidden'
          )
        }

        catch (err) {
          result.classList.add(
            'hidden'
          )

          showError(
            error,
            err.message
          )
        }
      }
    )

  /* =====================================================
     CONCENTRATION
  ===================================================== */

  tools
    .querySelector(
      '#cc-calc-concentration'
    )
    .addEventListener(
      'click',
      () => {
        const n =
          Number(
            tools
              .querySelector(
                '#cc-concentration-moles'
              )
              .value
          )

        const volume =
          Number(
            tools
              .querySelector(
                '#cc-volume-input'
              )
              .value
          )

        const unit =
          tools
            .querySelector(
              '#cc-volume-unit'
            )
            .value

        const result =
          tools.querySelector(
            '#cc-concentration-result'
          )

        const error =
          tools.querySelector(
            '#cc-concentration-error'
          )

        hideError(error)

        if (
          !Number.isFinite(n) ||
          n < 0
        ) {
          result.classList.add(
            'hidden'
          )

          showError(
            error,
            'Số mol không hợp lệ.'
          )

          return
        }

        if (
          !Number.isFinite(volume) ||
          volume <= 0
        ) {
          result.classList.add(
            'hidden'
          )

          showError(
            error,
            'Thể tích phải lớn hơn 0.'
          )

          return
        }

        const volumeLiters =
          unit === 'ml'
            ? volume / 1000
            : volume

        const concentration =
          n / volumeLiters

        tools.querySelector(
          '#cc-volume-liters'
        ).textContent =
          formatNumber(
            volumeLiters,
            4
          )

        tools.querySelector(
          '#cc-concentration-value'
        ).textContent =
          formatNumber(
            concentration,
            4
          )

        result.classList.remove(
          'hidden'
        )
      }
    )

  /* =====================================================
     GAS
  ===================================================== */

  tools
    .querySelector('#cc-calc-gas')
    .addEventListener(
      'click',
      () => {
        const n =
          Number(
            tools
              .querySelector(
                '#cc-gas-moles'
              )
              .value
          )

        const result =
          tools.querySelector(
            '#cc-gas-result'
          )

        const error =
          tools.querySelector(
            '#cc-gas-error'
          )

        hideError(error)

        if (
          !Number.isFinite(n) ||
          n < 0
        ) {
          result.classList.add(
            'hidden'
          )

          showError(
            error,
            'Số mol không hợp lệ.'
          )

          return
        }

        const volume =
          n * 24.79

        tools.querySelector(
          '#cc-gas-n'
        ).textContent =
          formatNumber(
            n,
            4
          )

        tools.querySelector(
          '#cc-gas-volume'
        ).textContent =
          formatNumber(
            volume,
            4
          )

        result.classList.remove(
          'hidden'
        )
      }
    )

  /* =====================================================
     FORMULA PARSER
  ===================================================== */

  function parseChemicalFormula(
    rawFormula
  ) {
    const formula =
      rawFormula
        .replace(/\s+/g, '')
        .replace(/∙/g, '·')

    if (!formula) {
      throw new Error(
        'Công thức đang trống.'
      )
    }

    const total = {}

    const parts =
      formula.split(/[·.]/)

    parts.forEach(part => {
      if (!part) {
        throw new Error(
          'Công thức không hợp lệ.'
        )
      }

      const match =
        part.match(
          /^(\d+)?(.*)$/
        )

      const multiplier =
        match[1]
          ? Number(match[1])
          : 1

      const body =
        match[2]

      if (!body) {
        throw new Error(
          'Công thức không hợp lệ.'
        )
      }

      const parsed =
        parseFormulaPart(body)

      mergeComposition(
        total,
        parsed,
        multiplier
      )
    })

    return total
  }

  function parseFormulaPart(formula) {
    const stack = [{}]

    const closingMap = {
      ')': '(',
      ']': '[',
      '}': '{'
    }

    const opening =
      new Set([
        '(',
        '[',
        '{'
      ])

    const bracketStack = []

    let i = 0

    while (i < formula.length) {
      const char =
        formula[i]

      if (opening.has(char)) {
        bracketStack.push(char)
        stack.push({})
        i++
        continue
      }

      if (closingMap[char]) {
        const expected =
          closingMap[char]

        const actual =
          bracketStack.pop()

        if (
          actual !== expected ||
          stack.length === 1
        ) {
          throw new Error(
            'Dấu ngoặc trong công thức không hợp lệ.'
          )
        }

        const group =
          stack.pop()

        i++

        const number =
          readNumber(
            formula,
            i
          )

        i =
          number.next

        mergeComposition(
          stack[
            stack.length - 1
          ],
          group,
          number.value
        )

        continue
      }

      if (/[A-Z]/.test(char)) {
        let symbol =
          char

        i++

        if (
          i < formula.length &&
          /[a-z]/.test(
            formula[i]
          )
        ) {
          symbol +=
            formula[i]

          i++
        }

        if (!elementMap.has(symbol)) {
          throw new Error(
            `Không tìm thấy nguyên tố "${symbol}".`
          )
        }

        const number =
          readNumber(
            formula,
            i
          )

        i =
          number.next

        const current =
          stack[
            stack.length - 1
          ]

        current[symbol] =
          (
            current[symbol] ||
            0
          ) +
          number.value

        continue
      }

      throw new Error(
        `Ký tự "${char}" không hợp lệ.`
      )
    }

    if (
      stack.length !== 1 ||
      bracketStack.length
    ) {
      throw new Error(
        'Công thức còn dấu ngoặc chưa đóng.'
      )
    }

    return stack[0]
  }

  function readNumber(
    text,
    start
  ) {
    let i = start
    let number = ''

    while (
      i < text.length &&
      /\d/.test(text[i])
    ) {
      number += text[i]
      i++
    }

    return {
      value:
        number
          ? Number(number)
          : 1,

      next: i
    }
  }

  function mergeComposition(
    target,
    source,
    multiplier = 1
  ) {
    Object
      .entries(source)
      .forEach(
        ([symbol, count]) => {
          target[symbol] =
            (
              target[symbol] ||
              0
            ) +
            count *
            multiplier
        }
      )
  }

  /* =====================================================
     MASS
  ===================================================== */

  function calculateMolarMass(
    composition
  ) {
    let totalMass = 0

    Object
      .entries(composition)
      .forEach(
        ([symbol, count]) => {
          const element =
            elementMap.get(symbol)

          if (!element) {
            throw new Error(
              `Không tìm thấy dữ liệu của ${symbol}.`
            )
          }

          totalMass +=
            element.mass *
            count
        }
      )

    return {
      totalMass
    }
  }

  function getAtomicMass(
    element
  ) {
    const raw =
      element.mass ??
      element.atomicMass ??
      element.atomic_mass ??
      element.atomicWeight ??
      element.atomic_weight

    if (
      raw === undefined ||
      raw === null
    ) {
      return null
    }

    const cleaned =
      String(raw)
        .replace(',', '.')
        .match(/\d+(?:\.\d+)?/)

    if (!cleaned) {
      return null
    }

    const value =
      Number(cleaned[0])

    return Number.isFinite(value)
      ? value
      : null
  }

  /* =====================================================
     UI HELPERS
  ===================================================== */

  function formatFormulaHTML(
    formula
  ) {
    return escapeHTML(formula)
      .replace(
        /(\d+)/g,
        '<sub>$1</sub>'
      )
  }

  function escapeHTML(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  function formatNumber(
    value,
    decimals = 3
  ) {
    if (!Number.isFinite(value)) {
      return '0'
    }

    return Number(
      value.toFixed(decimals)
    ).toLocaleString('vi-VN', {
      maximumFractionDigits:
        decimals
    })
  }

  function showError(
    element,
    message
  ) {
    element.textContent =
      message

    element.classList.remove(
      'hidden'
    )
  }

  function hideError(element) {
    element.classList.add(
      'hidden'
    )
  }
}