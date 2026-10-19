import './balancer.css'
import {
  balanceSpecies,
  compareSides,
  parseSide,
  sideTotals,
  splitSpecies
} from './chem/equation.js'

export function initEquationBalancer() {
  const tools = document.querySelector('#tools')
  if (!tools) return

  tools.innerHTML = `
    <section id="equation-balancer" class="balance-tool">

      <div class="balance-header">
        <div>
          <div class="balance-eyebrow">Cân bằng tương tác</div>
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
          <span>Chất phản ứng</span>
          <strong id="left-atom-total">0 nguyên tử</strong>
        </div>

        <div class="stage-side-info right">
          <span>Sản phẩm</span>
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
              <strong>Chất phản ứng</strong>
              <small>Các chất trước phản ứng</small>
            </div>
          </div>

          <input
            class="ui-input"
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
              <strong>Sản phẩm</strong>
              <small>Các chất tạo thành</small>
            </div>
          </div>

          <input
            class="ui-input"
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
          <span>Phương trình</span>
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
        <span>Thử nhanh</span>

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
            <span>Kiểm tra</span>
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

      const springForce = difference * 0.032

      velocity += springForce

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
          sideTotals(compounds).atoms

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
          sideTotals(compounds).atoms

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

    const reactants = parseSide(leftText)
    const products = parseSide(rightText)
    const comparison = compareSides(reactants, products)

    renderAnalysis(comparison, null)

    if (comparison.balanced) {
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

      const mismatched = comparison.rows
        .filter(row => row.left !== row.right)
        .map(row => row.symbol)

      if (comparison.charge.left !== comparison.charge.right) {
        mismatched.push('điện tích')
      }

      stageMessage.innerHTML = `
        <strong>Hai vế chưa cân bằng</strong>
        <span>Lệch: ${mismatched.join(', ')}. Sửa hệ số hoặc nhấn “Tự động cân bằng”.</span>
      `
    }
  }


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

          const solution =
            balanceSpecies(
              reactants,
              products
            )

          if (!solution) {
            throw new Error(
              'Không tìm được hệ số cân bằng dương. Kiểm tra lại sản phẩm: mỗi nguyên tố (và tổng điện tích) phải xuất hiện được ở cả hai vế.'
            )
          }

          const { coefficients } = solution

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

          leftAtomTotal.textContent =
            `${totalAtoms(sideTotals(reactants, leftCoefficients).atoms)} nguyên tử`

          rightAtomTotal.textContent =
            `${totalAtoms(sideTotals(products, rightCoefficients).atoms)} nguyên tử`

          renderAnalysis(
            compareSides(
              reactants,
              products,
              leftCoefficients,
              rightCoefficients
            ),
            coefficients
          )

          if (!solution.unique) {
            showError(
              'Lưu ý: chỉ bảo toàn nguyên tố và điện tích thì phương trình này có nhiều bộ hệ số đúng. ChemLab chọn bộ nhỏ nhất; với phản ứng oxi hóa – khử, hãy kiểm tra thêm bằng thăng bằng electron.',
              'note'
            )
          }
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

      500
    )
  }


  function renderAnalysis(
    comparison,
    coefficients
  ) {
    const rows = [...comparison.rows]

    if (comparison.charge.left || comparison.charge.right) {
      rows.push({
        symbol: '±',
        label: 'Điện tích',
        left: comparison.charge.left,
        right: comparison.charge.right
      })
    }

    atomGrid.innerHTML =
      rows.map(
        ({ symbol, label, left, right }) => {
          const ok = left === right

          return `
            <div class="atom-check-card ${ok ? 'balanced' : 'unbalanced'}">

              <div class="atom-check-symbol"${label ? ` title="${label}" aria-label="${label}"` : ''}>
                ${symbol}
              </div>

              <div class="atom-side-count">
                <span>Trái</span>
                <strong>${left}</strong>
              </div>

              <div class="atom-check-equal" aria-label="${ok ? 'bằng' : 'khác'}">
                ${ok ? '=' : '≠'}
              </div>

              <div class="atom-side-count">
                <span>Phải</span>
                <strong>${right}</strong>
              </div>

            </div>
          `
        }
      ).join('')

    moleRatio.hidden = !coefficients

    moleRatio.innerHTML = coefficients
      ? `
      <span>Tỉ lệ mol</span>

      <strong>
        ${coefficients.join(' : ')}
      </strong>
    `
      : ''

    analysis.classList.remove(
      'hidden'
    )
  }

  function totalAtoms(atoms) {
    return Object
      .values(atoms)
      .reduce(
        (sum, value) => sum + value,
        0
      )
  }


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


  function setStatus(
    state,
    text
  ) {
    statusText.textContent = text
    statusDot.className = state
  }


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


  function showError(message, tone = 'error') {
    errorBox.classList.toggle('is-note', tone === 'note')
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
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(
        /(?<=[A-Za-z)\]])(\d+)/g,
        '<sub>$1</sub>'
      )
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



  setBeamAngle(0)
  previewEquation()
}