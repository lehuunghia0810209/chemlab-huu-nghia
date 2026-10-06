import './balancer.css'

export function initEquationBalancer() {
  const tools = document.querySelector('#tools')
  if (!tools) return

  tools.innerHTML = `
    <section id="equation-balancer" class="balance-tool">

      <div class="balance-header">
        <div>
          <div class="balance-eyebrow">INTERACTIVE STOICHIOMETRY</div>
          <h2>Cân bằng phương trình</h2>
          <p>Nhập chất vào từng vế. Cân sẽ phản ứng ngay theo số nguyên tử đang có.</p>
        </div>

        <div class="balance-status-pill">
          <i id="balance-status-dot" class="idle"></i>
          <span id="balance-status-text">Sẵn sàng</span>
        </div>
      </div>

      <div id="balance-stage" class="balance-stage">
        <div class="balance-stage-grid"></div>

        <div class="balance-scale">
          <div id="balance-beam-wrapper" class="balance-beam-wrapper">

            <div class="balance-beam">
              <div class="beam-markers"></div>

              <div class="beam-left-hook">
                <div class="balance-chain"></div>
                <div class="balance-pan">
                  <div id="left-pan-items" class="pan-items"></div>
                </div>
              </div>

              <div class="beam-right-hook">
                <div class="balance-chain"></div>
                <div class="balance-pan">
                  <div id="right-pan-items" class="pan-items"></div>
                </div>
              </div>
            </div>

            <div class="balance-pivot">
              <div class="pivot-ring"></div>
              <div id="balance-needle" class="balance-needle"></div>
            </div>
          </div>

          <div class="balance-stand">
            <div class="balance-column"></div>
            <div class="balance-foot"></div>
          </div>
        </div>

        <div class="stage-side-info left">
          <span>CHẤT PHẢN ỨNG</span>
          <strong id="left-atom-total">0 nguyên tử</strong>
        </div>

        <div class="stage-side-info right">
          <span>SẢN PHẨM</span>
          <strong id="right-atom-total">0 nguyên tử</strong>
        </div>

        <div id="balance-stage-message" class="balance-stage-message">
          <strong>Hãy thêm chất</strong>
          <span>Cân sẽ nghiêng ngay khi có chất ở một bên.</span>
        </div>
      </div>

      <div class="balance-equation-editor">

        <div class="equation-side">
          <div class="equation-side-title">
            <span class="side-badge reactant">R</span>

            <div>
              <strong>CHẤT PHẢN ỨNG</strong>
              <small>Các chất trước phản ứng</small>
            </div>
          </div>

          <input
            id="balance-reactants"
            type="text"
            placeholder="Ví dụ: H2 + O2"
            autocomplete="off"
            spellcheck="false"
          >
        </div>

        <div class="equation-arrow">→</div>

        <div class="equation-side">
          <div class="equation-side-title">
            <span class="side-badge product">P</span>

            <div>
              <strong>SẢN PHẨM</strong>
              <small>Các chất tạo thành</small>
            </div>
          </div>

          <input
            id="balance-products"
            type="text"
            placeholder="Ví dụ: H2O"
            autocomplete="off"
            spellcheck="false"
          >
        </div>
      </div>

      <div id="balance-result" class="balance-result empty">
        <div>
          <span>PHƯƠNG TRÌNH</span>
          <strong id="balance-result-equation">Chưa cân bằng</strong>
        </div>
      </div>

      <div class="balance-actions">

        <button id="balance-button" class="balance-main-button">
          <span class="balance-button-icon">⚖</span>
          Tự động cân bằng
        </button>

        <button id="balance-clear" class="balance-clear-button">
          ↻ Đặt lại
        </button>

        <span class="balance-shortcut">
          Enter để cân bằng
        </span>
      </div>

      <div class="balance-examples">
        <span>THỬ NHANH</span>

        <button
          data-reactants="H2 + O2"
          data-products="H2O"
        >
          H₂ + O₂ → H₂O
        </button>

        <button
          data-reactants="Fe + O2"
          data-products="Fe2O3"
        >
          Fe + O₂ → Fe₂O₃
        </button>

        <button
          data-reactants="Al + HCl"
          data-products="AlCl3 + H2"
        >
          Al + HCl → AlCl₃ + H₂
        </button>

        <button
          data-reactants="C2H6 + O2"
          data-products="CO2 + H2O"
        >
          C₂H₆ + O₂ → CO₂ + H₂O
        </button>
      </div>

      <div id="balance-analysis" class="balance-analysis hidden">

        <div class="balance-analysis-header">
          <div>
            <span>KIỂM TRA</span>
            <h3>Số nguyên tử hai vế</h3>
          </div>

          <div id="mole-ratio" class="mole-ratio"></div>
        </div>

        <div id="atom-balance-grid" class="atom-balance-grid"></div>
      </div>

      <div id="balance-error" class="balance-error hidden"></div>

    </section>
  `

  const reactantsInput = tools.querySelector('#balance-reactants')
  const productsInput = tools.querySelector('#balance-products')
  const balanceButton = tools.querySelector('#balance-button')
  const clearButton = tools.querySelector('#balance-clear')

  const resultBox = tools.querySelector('#balance-result')
  const resultEquation = tools.querySelector('#balance-result-equation')

  const analysis = tools.querySelector('#balance-analysis')
  const atomGrid = tools.querySelector('#atom-balance-grid')
  const moleRatio = tools.querySelector('#mole-ratio')

  const errorBox = tools.querySelector('#balance-error')

  const leftPan = tools.querySelector('#left-pan-items')
  const rightPan = tools.querySelector('#right-pan-items')

  const stage = tools.querySelector('#balance-stage')
  const stageMessage = tools.querySelector('#balance-stage-message')

  const statusText = tools.querySelector('#balance-status-text')
  const statusDot = tools.querySelector('#balance-status-dot')

  const beam = tools.querySelector('#balance-beam-wrapper')
  const needle = tools.querySelector('#balance-needle')

  const leftAtomTotal = tools.querySelector('#left-atom-total')
  const rightAtomTotal = tools.querySelector('#right-atom-total')

  /* =====================================================
     SMOOTH SPRING
  ===================================================== */

  let currentAngle = 0
  let targetAngle = 0
  let velocity = 0
  let animationFrame = null

  function setBeamAngle(angle) {
    targetAngle = clamp(angle, -11, 11)
    startSpringAnimation()
  }

  function startSpringAnimation() {
    if (animationFrame) return

    function animate() {
      const difference = targetAngle - currentAngle

      // Chậm và mềm hơn bản trước
      const springForce = difference * 0.032

      velocity += springForce

      // Quán tính
      velocity *= 0.84

      currentAngle += velocity

      beam.style.setProperty(
        '--beam-angle',
        `${currentAngle}deg`
      )

      needle.style.setProperty(
        '--needle-angle',
        `${currentAngle * -1.65}deg`
      )

      const finished =
        Math.abs(difference) < 0.008 &&
        Math.abs(velocity) < 0.008

      if (finished) {
        currentAngle = targetAngle
        velocity = 0

        beam.style.setProperty(
          '--beam-angle',
          `${currentAngle}deg`
        )

        needle.style.setProperty(
          '--needle-angle',
          `${currentAngle * -1.65}deg`
        )

        animationFrame = null
        return
      }

      animationFrame =
        requestAnimationFrame(animate)
    }

    animationFrame =
      requestAnimationFrame(animate)
  }

  /* =====================================================
     EVENTS
  ===================================================== */

  balanceButton.addEventListener(
    'click',
    balanceCurrentEquation
  )

  clearButton.addEventListener(
    'click',
    clearEquation
  )

  reactantsInput.addEventListener(
    'input',
    previewEquation
  )

  productsInput.addEventListener(
    'input',
    previewEquation
  )

  ;[
    reactantsInput,
    productsInput
  ].forEach(input => {
    input.addEventListener(
      'keydown',
      event => {
        if (event.key === 'Enter') {
          event.preventDefault()
          balanceCurrentEquation()
        }
      }
    )
  })

  tools
    .querySelectorAll('.balance-examples button')
    .forEach(button => {
      button.addEventListener(
        'click',
        () => {
          reactantsInput.value =
            button.dataset.reactants

          productsInput.value =
            button.dataset.products

          previewEquation()

          window.setTimeout(
            balanceCurrentEquation,
            300
          )
        }
      )
    })

  /* =====================================================
     LIVE PREVIEW
  ===================================================== */

  function previewEquation() {
    hideError()

    analysis.classList.add('hidden')

    resultBox.className =
      'balance-result empty'

    resultEquation.textContent =
      'Chưa cân bằng'

    const leftText =
      reactantsInput.value.trim()

    const rightText =
      productsInput.value.trim()

    const leftSpecies =
      splitSpecies(leftText)

    const rightSpecies =
      splitSpecies(rightText)

    renderPan(
      leftPan,
      leftSpecies
    )

    renderPan(
      rightPan,
      rightSpecies
    )

    if (
      !leftText &&
      !rightText
    ) {
      leftAtomTotal.textContent =
        '0 nguyên tử'

      rightAtomTotal.textContent =
        '0 nguyên tử'

      setBeamAngle(0)

      setStatus(
        'idle',
        'Sẵn sàng'
      )

      stageMessage.innerHTML = `
        <strong>Hãy thêm chất</strong>
        <span>Cân sẽ nghiêng ngay khi có chất ở một bên.</span>
      `

      return
    }

    let leftTotals = {}
    let rightTotals = {}

    let leftCount = 0
    let rightCount = 0

    let leftValid = false
    let rightValid = false

    if (leftText) {
      try {
        const compounds =
          parseSide(leftText)

        leftTotals =
          calculateAtomTotals(
            compounds,
            compounds.map(() => 1)
          )

        leftCount =
          totalAtoms(leftTotals)

        leftValid = true
      }

      catch {
        leftCount =
          Math.max(
            1,
            leftSpecies.length * 2
          )
      }
    }

    if (rightText) {
      try {
        const compounds =
          parseSide(rightText)

        rightTotals =
          calculateAtomTotals(
            compounds,
            compounds.map(() => 1)
          )

        rightCount =
          totalAtoms(rightTotals)

        rightValid = true
      }

      catch {
        rightCount =
          Math.max(
            1,
            rightSpecies.length * 2
          )
      }
    }

    leftAtomTotal.textContent =
      `${leftCount} nguyên tử`

    rightAtomTotal.textContent =
      `${rightCount} nguyên tử`

    setBeamAngle(
      calculateLiveAngle(
        leftCount,
        rightCount
      )
    )

    if (
      leftText &&
      !rightText
    ) {
      setStatus(
        'waiting',
        'Đang chờ sản phẩm'
      )

      stageMessage.innerHTML = `
        <strong>Vế trái đang nặng hơn</strong>
        <span>Thêm sản phẩm để hoàn thành phương trình.</span>
      `

      return
    }

    if (
      !leftText &&
      rightText
    ) {
      setStatus(
        'waiting',
        'Đang chờ chất phản ứng'
      )

      stageMessage.innerHTML = `
        <strong>Vế phải đang nặng hơn</strong>
        <span>Thêm chất phản ứng để hoàn thành phương trình.</span>
      `

      return
    }

    if (
      !leftValid ||
      !rightValid
    ) {
      setStatus(
        'warning',
        'Đang nhập công thức'
      )

      stageMessage.innerHTML = `
        <strong>Đang đọc công thức...</strong>
        <span>ChemLab sẽ tự cập nhật khi công thức hợp lệ.</span>
      `

      return
    }

    const balanced =
      atomMapsEqual(
        leftTotals,
        rightTotals
      )

    if (balanced) {
      setBeamAngle(0)

      setStatus(
        'balanced',
        'Đã cân bằng'
      )

      stageMessage.innerHTML = `
        <strong>Hai vế đã bằng nhau</strong>
        <span>Phương trình hiện tại đã cân bằng.</span>
      `
    }

    else {
      setStatus(
        'warning',
        'Chưa cân bằng'
      )

      stageMessage.innerHTML = `
        <strong>Hai vế chưa cân bằng</strong>
        <span>Nhấn “Tự động cân bằng” để tìm hệ số.</span>
      `
    }
  }

  /* =====================================================
     LIVE ANGLE
  ===================================================== */

  function calculateLiveAngle(
    left,
    right
  ) {
    if (
      left === 0 &&
      right === 0
    ) {
      return 0
    }

    if (right === 0) {
      return -10
    }

    if (left === 0) {
      return 10
    }

    const difference =
      right - left

    const largest =
      Math.max(
        left,
        right,
        1
      )

    const normalized =
      difference / largest

    let angle =
      normalized * 12

    if (
      difference !== 0 &&
      Math.abs(angle) < 2.5
    ) {
      angle =
        difference > 0
          ? 2.5
          : -2.5
    }

    return clamp(
      angle,
      -10,
      10
    )
  }

  /* =====================================================
     BALANCE
  ===================================================== */

  function balanceCurrentEquation() {
    const leftText =
      reactantsInput.value.trim()

    const rightText =
      productsInput.value.trim()

    hideError()

    if (
      !leftText ||
      !rightText
    ) {
      showError(
        'Hãy nhập cả chất phản ứng và sản phẩm trước khi tự động cân bằng.'
      )

      return
    }

    balanceButton.disabled = true
    balanceButton.classList.add('working')

    setStatus(
      'working',
      'Đang tính hệ số...'
    )

    stageMessage.innerHTML = `
      <strong>Đang tính hệ số</strong>
      <span>ChemLab đang so sánh số nguyên tử hai vế.</span>
    `

    window.setTimeout(
      () => {
        try {
          const reactants =
            parseSide(leftText)

          const products =
            parseSide(rightText)

          const coefficients =
            solveEquation(
              reactants,
              products
            )

          if (!coefficients) {
            throw new Error(
              'Không tìm được hệ số cân bằng dương.'
            )
          }

          const leftCoefficients =
            coefficients.slice(
              0,
              reactants.length
            )

          const rightCoefficients =
            coefficients.slice(
              reactants.length
            )

          resultBox.className =
            'balance-result success'

          resultEquation.innerHTML =
            createBalancedEquationHTML(
              reactants,
              products,
              leftCoefficients,
              rightCoefficients
            )

          setBeamAngle(0)

          stage.classList.add(
            'balanced'
          )

          window.setTimeout(
            () => {
              stage.classList.remove(
                'balanced'
              )
            },
            1200
          )

          setStatus(
            'balanced',
            'Đã cân bằng'
          )

          stageMessage.innerHTML = `
            <strong>Cân bằng hoàn tất</strong>
            <span>Số nguyên tử ở hai vế đã bằng nhau.</span>
          `

          renderPan(
            leftPan,
            reactants.map(
              (
                compound,
                index
              ) =>
                formatCoefficientLabel(
                  leftCoefficients[index],
                  compound.formula
                )
            )
          )

          renderPan(
            rightPan,
            products.map(
              (
                compound,
                index
              ) =>
                formatCoefficientLabel(
                  rightCoefficients[index],
                  compound.formula
                )
            )
          )

          const leftTotals =
            calculateAtomTotals(
              reactants,
              leftCoefficients
            )

          const rightTotals =
            calculateAtomTotals(
              products,
              rightCoefficients
            )

          leftAtomTotal.textContent =
            `${totalAtoms(leftTotals)} nguyên tử`

          rightAtomTotal.textContent =
            `${totalAtoms(rightTotals)} nguyên tử`

          renderAnalysis(
            reactants,
            products,
            leftCoefficients,
            rightCoefficients
          )
        }

        catch (error) {
          setStatus(
            'error',
            'Không thể cân bằng'
          )

          stageMessage.innerHTML = `
            <strong>Không thể cân bằng</strong>
            <span>Kiểm tra lại công thức hóa học.</span>
          `

          showError(
            error.message ||
            'Phương trình không hợp lệ.'
          )
        }

        balanceButton.disabled = false
        balanceButton.classList.remove('working')
      },

      // Chậm hơn bản trước
      500
    )
  }

  /* =====================================================
     ANALYSIS
  ===================================================== */

  function renderAnalysis(
    reactants,
    products,
    leftCoefficients,
    rightCoefficients
  ) {
    const leftTotals =
      calculateAtomTotals(
        reactants,
        leftCoefficients
      )

    const rightTotals =
      calculateAtomTotals(
        products,
        rightCoefficients
      )

    const allElements = [
      ...new Set([
        ...Object.keys(leftTotals),
        ...Object.keys(rightTotals)
      ])
    ]

    atomGrid.innerHTML =
      allElements.map(
        element => {
          const left =
            leftTotals[element] ?? 0

          const right =
            rightTotals[element] ?? 0

          return `
            <div class="atom-check-card balanced">

              <div class="atom-check-symbol">
                ${element}
              </div>

              <div class="atom-side-count">
                <span>Trái</span>
                <strong>${left}</strong>
              </div>

              <div class="atom-check-equal">
                =
              </div>

              <div class="atom-side-count">
                <span>Phải</span>
                <strong>${right}</strong>
              </div>

            </div>
          `
        }
      ).join('')

    moleRatio.innerHTML = `
      <span>TỈ LỆ MOL</span>

      <strong>
        ${
          [
            ...leftCoefficients,
            ...rightCoefficients
          ].join(' : ')
        }
      </strong>
    `

    analysis.classList.remove(
      'hidden'
    )
  }

  /* =====================================================
     PAN
  ===================================================== */

  function renderPan(
    container,
    species
  ) {
    container.innerHTML = ''

    species
      .slice(0, 6)
      .forEach(
        (
          item,
          index
        ) => {
          const token =
            document.createElement(
              'span'
            )

          token.className =
            'molecule-token'

          token.style.animationDelay =
            `${index * 55}ms`

          token.innerHTML =
            formatFormulaHTML(
              typeof item === 'string'
                ? item
                : item.formula
            )

          container.appendChild(
            token
          )
        }
      )
  }

  /* =====================================================
     STATUS
  ===================================================== */

  function setStatus(
    state,
    text
  ) {
    statusText.textContent = text
    statusDot.className = state
  }

  /* =====================================================
     RESET
  ===================================================== */

  function clearEquation() {
    reactantsInput.value = ''
    productsInput.value = ''

    leftPan.innerHTML = ''
    rightPan.innerHTML = ''

    leftAtomTotal.textContent =
      '0 nguyên tử'

    rightAtomTotal.textContent =
      '0 nguyên tử'

    analysis.classList.add('hidden')

    resultBox.className =
      'balance-result empty'

    resultEquation.textContent =
      'Chưa cân bằng'

    hideError()

    setBeamAngle(0)

    setStatus(
      'idle',
      'Sẵn sàng'
    )

    stageMessage.innerHTML = `
      <strong>Hãy thêm chất</strong>
      <span>Cân sẽ nghiêng ngay khi có chất ở một bên.</span>
    `

    reactantsInput.focus()
  }

  /* =====================================================
     ERRORS
  ===================================================== */

  function showError(message) {
    errorBox.textContent = message

    errorBox.classList.remove(
      'hidden'
    )
  }

  function hideError() {
    errorBox.classList.add(
      'hidden'
    )
  }

  /* =====================================================
     PARSER
  ===================================================== */

  function splitSpecies(text) {
    if (!text.trim()) return []

    return text
      .split(/\s*\+\s*/)
      .map(item => item.trim())
      .filter(Boolean)
  }

  function parseSide(text) {
    const species =
      splitSpecies(text)

    if (
      species.length === 0
    ) {
      throw new Error(
        'Không tìm thấy chất hóa học.'
      )
    }

    return species.map(
      rawFormula => {
        const formula =
          rawFormula.replace(
            /^\d+\s*/,
            ''
          )

        return {
          formula,
          atoms:
            parseCompound(formula)
        }
      }
    )
  }

  function parseCompound(formula) {
    const normalized =
      formula.replaceAll(' ', '')

    if (!normalized) {
      throw new Error(
        'Công thức hóa học đang trống.'
      )
    }

    const parts =
      normalized.split(/[·.]/)

    const finalCounts = {}

    parts.forEach(
      part => {
        const coefficientMatch =
          part.match(/^(\d+)(.*)$/)

        let multiplier = 1
        let formulaPart = part

        if (coefficientMatch) {
          multiplier =
            Number(
              coefficientMatch[1]
            )

          formulaPart =
            coefficientMatch[2]
        }

        const counts =
          parseFormulaPart(
            formulaPart
          )

        mergeCounts(
          finalCounts,
          counts,
          multiplier
        )
      }
    )

    return finalCounts
  }

  function parseFormulaPart(formula) {
    const stack = [{}]

    let index = 0

    while (
      index < formula.length
    ) {
      const char =
        formula[index]

      if (
        char === '(' ||
        char === '[' ||
        char === '{'
      ) {
        stack.push({})
        index++
        continue
      }

      if (
        char === ')' ||
        char === ']' ||
        char === '}'
      ) {
        if (
          stack.length === 1
        ) {
          throw new Error(
            `Ngoặc không hợp lệ trong ${formula}.`
          )
        }

        const group =
          stack.pop()

        index++

        const numberResult =
          readNumber(
            formula,
            index
          )

        index =
          numberResult.next

        mergeCounts(
          stack[
            stack.length - 1
          ],
          group,
          numberResult.value
        )

        continue
      }

      if (
        /[A-Z]/.test(char)
      ) {
        let symbol = char

        index++

        while (
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

        const numberResult =
          readNumber(
            formula,
            index
          )

        index =
          numberResult.next

        const current =
          stack[
            stack.length - 1
          ]

        current[symbol] =
          (
            current[symbol] ?? 0
          ) +
          numberResult.value

        continue
      }

      throw new Error(
        `Không hiểu ký tự "${char}" trong ${formula}.`
      )
    }

    if (
      stack.length !== 1
    ) {
      throw new Error(
        `Ngoặc chưa đóng trong ${formula}.`
      )
    }

    return stack[0]
  }

  function readNumber(
    text,
    start
  ) {
    let index = start
    let numberText = ''

    while (
      index < text.length &&
      /\d/.test(text[index])
    ) {
      numberText +=
        text[index]

      index++
    }

    return {
      value:
        numberText
          ? Number(numberText)
          : 1,

      next:
        index
    }
  }

  function mergeCounts(
    target,
    source,
    multiplier = 1
  ) {
    Object.entries(source)
      .forEach(
        ([
          element,
          amount
        ]) => {
          target[element] =
            (
              target[element] ?? 0
            ) +
            amount * multiplier
        }
      )
  }

  /* =====================================================
     ATOMS
  ===================================================== */

  function calculateAtomTotals(
    compounds,
    coefficients
  ) {
    const totals = {}

    compounds.forEach(
      (
        compound,
        index
      ) => {
        const coefficient =
          coefficients[index] ?? 1

        Object.entries(
          compound.atoms
        ).forEach(
          ([
            element,
            amount
          ]) => {
            totals[element] =
              (
                totals[element] ?? 0
              ) +
              amount * coefficient
          }
        )
      }
    )

    return totals
  }

  function totalAtoms(totals) {
    return Object
      .values(totals)
      .reduce(
        (
          sum,
          value
        ) =>
          sum + value,
        0
      )
  }

  function atomMapsEqual(
    first,
    second
  ) {
    const symbols =
      new Set([
        ...Object.keys(first),
        ...Object.keys(second)
      ])

    return [...symbols].every(
      symbol =>
        (
          first[symbol] ?? 0
        ) ===
        (
          second[symbol] ?? 0
        )
    )
  }

  /* =====================================================
     SOLVER
  ===================================================== */

  function solveEquation(
    reactants,
    products
  ) {
    const compounds = [
      ...reactants,
      ...products
    ]

    const elementSymbols = [
      ...new Set(
        compounds.flatMap(
          compound =>
            Object.keys(
              compound.atoms
            )
        )
      )
    ]

    const matrix =
      elementSymbols.map(
        symbol =>
          compounds.map(
            (
              compound,
              index
            ) => {
              const amount =
                compound.atoms[
                  symbol
                ] ?? 0

              return new Fraction(
                index <
                  reactants.length
                  ? amount
                  : -amount
              )
            }
          )
      )

    const {
      matrix: rref,
      pivotColumns
    } =
      toRREF(matrix)

    const columnCount =
      compounds.length

    const freeColumns = []

    for (
      let column = 0;
      column < columnCount;
      column++
    ) {
      if (
        !pivotColumns.includes(
          column
        )
      ) {
        freeColumns.push(column)
      }
    }

    if (
      freeColumns.length === 0
    ) {
      return null
    }

    const assignments =
      generateAssignments(
        freeColumns.length,
        1,
        5
      )

    let best = null

    for (
      const assignment
      of assignments
    ) {
      const vector =
        Array(columnCount)
          .fill(null)
          .map(
            () =>
              new Fraction(0)
          )

      freeColumns.forEach(
        (
          column,
          index
        ) => {
          vector[column] =
            new Fraction(
              assignment[index]
            )
        }
      )

      pivotColumns.forEach(
        (
          pivotColumn,
          row
        ) => {
          let sum =
            new Fraction(0)

          freeColumns.forEach(
            freeColumn => {
              sum =
                sum.add(
                  rref[row][freeColumn]
                    .multiply(
                      vector[
                        freeColumn
                      ]
                    )
                )
            }
          )

          vector[pivotColumn] =
            sum.negate()
        }
      )

      const integers =
        fractionsToIntegers(
          vector
        )

      if (
        integers.every(
          value =>
            value > 0
        )
      ) {
        const normalized =
          normalizeIntegerVector(
            integers
          )

        if (
          !best ||
          sumArray(normalized) <
          sumArray(best)
        ) {
          best = normalized
        }
      }
    }

    return best
  }

  function toRREF(source) {
    const matrix =
      source.map(
        row =>
          row.map(
            value =>
              value.clone()
          )
      )

    const rows =
      matrix.length

    const columns =
      matrix[0]?.length ?? 0

    const pivotColumns = []

    let pivotRow = 0

    for (
      let column = 0;
      column < columns &&
      pivotRow < rows;
      column++
    ) {
      let selected =
        pivotRow

      while (
        selected < rows &&
        matrix[selected][column]
          .isZero()
      ) {
        selected++
      }

      if (
        selected === rows
      ) {
        continue
      }

      ;[
        matrix[pivotRow],
        matrix[selected]
      ] = [
        matrix[selected],
        matrix[pivotRow]
      ]

      const pivot =
        matrix[pivotRow][column]

      for (
        let c = 0;
        c < columns;
        c++
      ) {
        matrix[pivotRow][c] =
          matrix[pivotRow][c]
            .divide(pivot)
      }

      for (
        let row = 0;
        row < rows;
        row++
      ) {
        if (
          row === pivotRow
        ) {
          continue
        }

        const factor =
          matrix[row][column]

        if (
          factor.isZero()
        ) {
          continue
        }

        for (
          let c = 0;
          c < columns;
          c++
        ) {
          matrix[row][c] =
            matrix[row][c]
              .subtract(
                factor.multiply(
                  matrix[
                    pivotRow
                  ][c]
                )
              )
        }
      }

      pivotColumns.push(column)
      pivotRow++
    }

    return {
      matrix,
      pivotColumns
    }
  }

  /* =====================================================
     FRACTION
  ===================================================== */

  class Fraction {
    constructor(
      numerator,
      denominator = 1
    ) {
      if (
        denominator === 0
      ) {
        throw new Error(
          'Phép tính không hợp lệ.'
        )
      }

      if (
        denominator < 0
      ) {
        numerator *= -1
        denominator *= -1
      }

      const divisor =
        gcd(
          Math.abs(numerator),
          Math.abs(denominator)
        )

      this.n =
        numerator / divisor

      this.d =
        denominator / divisor
    }

    add(other) {
      return new Fraction(
        this.n * other.d +
        other.n * this.d,

        this.d * other.d
      )
    }

    subtract(other) {
      return this.add(
        other.negate()
      )
    }

    multiply(other) {
      return new Fraction(
        this.n * other.n,
        this.d * other.d
      )
    }

    divide(other) {
      return new Fraction(
        this.n * other.d,
        this.d * other.n
      )
    }

    negate() {
      return new Fraction(
        -this.n,
        this.d
      )
    }

    isZero() {
      return this.n === 0
    }

    clone() {
      return new Fraction(
        this.n,
        this.d
      )
    }
  }

  /* =====================================================
     INTEGER HELPERS
  ===================================================== */

  function fractionsToIntegers(
    fractions
  ) {
    let denominatorLCM = 1

    fractions.forEach(
      fraction => {
        denominatorLCM =
          lcm(
            denominatorLCM,
            fraction.d
          )
      }
    )

    return fractions.map(
      fraction =>
        fraction.n *
        (
          denominatorLCM /
          fraction.d
        )
    )
  }

  function normalizeIntegerVector(
    values
  ) {
    let divisor = 0

    values.forEach(
      value => {
        divisor =
          gcd(
            divisor,
            Math.abs(value)
          )
      }
    )

    const result =
      values.map(
        value =>
          value /
          (divisor || 1)
      )

    if (
      result.every(
        value => value < 0
      )
    ) {
      return result.map(
        value => -value
      )
    }

    return result
  }

  function generateAssignments(
    length,
    min,
    max
  ) {
    const result = []

    function build(current) {
      if (
        current.length === length
      ) {
        result.push([
          ...current
        ])

        return
      }

      for (
        let value = min;
        value <= max;
        value++
      ) {
        current.push(value)

        build(current)

        current.pop()
      }
    }

    build([])

    return result
  }

  /* =====================================================
     FORMAT
  ===================================================== */

  function createBalancedEquationHTML(
    reactants,
    products,
    leftCoefficients,
    rightCoefficients
  ) {
    const left =
      reactants
        .map(
          (
            compound,
            index
          ) =>
            formatCompoundHTML(
              leftCoefficients[index],
              compound.formula
            )
        )
        .join(
          '<span class="equation-plus">+</span>'
        )

    const right =
      products
        .map(
          (
            compound,
            index
          ) =>
            formatCompoundHTML(
              rightCoefficients[index],
              compound.formula
            )
        )
        .join(
          '<span class="equation-plus">+</span>'
        )

    return `
      <span class="balanced-side">
        ${left}
      </span>

      <span class="balanced-arrow">
        →
      </span>

      <span class="balanced-side">
        ${right}
      </span>
    `
  }

  function formatCompoundHTML(
    coefficient,
    formula
  ) {
    return `
      <span class="balanced-compound">

        ${
          coefficient === 1
            ? ''
            : `<b>${coefficient}</b>`
        }

        ${formatFormulaHTML(formula)}

      </span>
    `
  }

  function formatCoefficientLabel(
    coefficient,
    formula
  ) {
    return `${
      coefficient === 1
        ? ''
        : coefficient
    }${formula}`
  }

  function formatFormulaHTML(
    formula
  ) {
    return String(formula)
      .replace(
        /(\d+)/g,
        '<sub>$1</sub>'
      )
  }

  /* =====================================================
     MATH
  ===================================================== */

  function gcd(a, b) {
    a =
      Math.round(
        Math.abs(a)
      )

    b =
      Math.round(
        Math.abs(b)
      )

    while (
      b !== 0
    ) {
      const temp = b

      b = a % b
      a = temp
    }

    return a || 1
  }

  function lcm(a, b) {
    return Math.abs(
      a * b
    ) /
    gcd(a, b)
  }

  function clamp(
    value,
    min,
    max
  ) {
    return Math.max(
      min,
      Math.min(
        max,
        value
      )
    )
  }

  function sumArray(values) {
    return values.reduce(
      (
        total,
        value
      ) =>
        total + value,
      0
    )
  }

  setBeamAngle(0)
  previewEquation()
}