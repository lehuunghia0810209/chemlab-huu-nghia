import './solubilityTable.css'

export function initSolubilityTable() {
  const tools = document.querySelector('#tools')
  if (!tools) return

  document.querySelector('#solubility-tool')?.remove()

  const cations = [
    { id:'li', symbol:'Li', html:'Li⁺', charge:1, name:'Lithium', group:'alkali' },
    { id:'na', symbol:'Na', html:'Na⁺', charge:1, name:'Sodium', group:'alkali' },
    { id:'k', symbol:'K', html:'K⁺', charge:1, name:'Potassium', group:'alkali' },
    { id:'nh4', symbol:'NH4', html:'NH₄⁺', charge:1, name:'Ammonium', group:'ammonium', poly:true },
    { id:'mg', symbol:'Mg', html:'Mg²⁺', charge:2, name:'Magnesium' },
    { id:'ca', symbol:'Ca', html:'Ca²⁺', charge:2, name:'Calcium' },
    { id:'ba', symbol:'Ba', html:'Ba²⁺', charge:2, name:'Barium' },
    { id:'al', symbol:'Al', html:'Al³⁺', charge:3, name:'Aluminium' },
    { id:'zn', symbol:'Zn', html:'Zn²⁺', charge:2, name:'Zinc' },
    { id:'fe2', symbol:'Fe', html:'Fe²⁺', charge:2, name:'Iron(II)' },
    { id:'fe3', symbol:'Fe', html:'Fe³⁺', charge:3, name:'Iron(III)' },
    { id:'cu', symbol:'Cu', html:'Cu²⁺', charge:2, name:'Copper(II)' },
    { id:'ag', symbol:'Ag', html:'Ag⁺', charge:1, name:'Silver' },
    { id:'pb', symbol:'Pb', html:'Pb²⁺', charge:2, name:'Lead(II)' }
  ]

  const anions = [
    { id:'no3', symbol:'NO3', html:'NO₃⁻', charge:1, name:'Nitrate', poly:true },
    { id:'cl', symbol:'Cl', html:'Cl⁻', charge:1, name:'Chloride' },
    { id:'br', symbol:'Br', html:'Br⁻', charge:1, name:'Bromide' },
    { id:'i', symbol:'I', html:'I⁻', charge:1, name:'Iodide' },
    { id:'so4', symbol:'SO4', html:'SO₄²⁻', charge:2, name:'Sulfate', poly:true },
    { id:'co3', symbol:'CO3', html:'CO₃²⁻', charge:2, name:'Carbonate', poly:true },
    { id:'po4', symbol:'PO4', html:'PO₄³⁻', charge:3, name:'Phosphate', poly:true },
    { id:'oh', symbol:'OH', html:'OH⁻', charge:1, name:'Hydroxide', poly:true },
    { id:'s', symbol:'S', html:'S²⁻', charge:2, name:'Sulfide' }
  ]

  tools.insertAdjacentHTML('beforeend', `
    <section id="solubility-tool" class="sol-tool">

      <div class="sol-head">
        <div>
          <span>BẢNG TÍNH TAN</span>
          <h2>Tra cứu độ tan</h2>
          <p>
            Chọn cation và anion để tạo hợp chất
            và kiểm tra khả năng tan trong nước.
          </p>
        </div>

        <div class="sol-head-badge">
          <i></i>
          <span>Tra cứu nhanh</span>
        </div>
      </div>

      <div class="sol-query">

        <div class="sol-select-box">
          <label for="sol-cation">Cation</label>
          <select id="sol-cation"></select>
        </div>

        <div class="sol-combine">＋</div>

        <div class="sol-select-box">
          <label for="sol-anion">Anion</label>
          <select id="sol-anion"></select>
        </div>

        <div class="sol-arrow">→</div>

        <div id="sol-result-card" class="sol-result-card">
          <span>HỢP CHẤT</span>
          <strong id="sol-formula">NaCl</strong>
          <b id="sol-status">Tan</b>
        </div>

      </div>

      <div class="sol-description">
        <div id="sol-status-dot"></div>

        <div>
          <strong id="sol-description-title">
            Tan trong nước
          </strong>

          <p id="sol-description-text">
            Hợp chất này có khả năng tan trong nước.
          </p>
        </div>
      </div>

      <div class="sol-matrix-head">
        <div>
          <span>TRA NHANH</span>
          <h3>Bảng độ tan</h3>
        </div>

        <div class="sol-legend">
          <span><i class="soluble"></i> Tan</span>
          <span><i class="slight"></i> Ít tan</span>
          <span><i class="insoluble"></i> Không tan</span>
        </div>
      </div>

      <div class="sol-table-scroll" tabindex="0" role="region" aria-label="Bảng độ tan, cuộn ngang">
        <table class="sol-table">
          <caption class="sr-only">Độ tan của các hợp chất theo cation và anion</caption>
          <thead id="sol-table-head"></thead>
          <tbody id="sol-table-body"></tbody>
        </table>
      </div>

      <div class="sol-note">
        Bảng được thiết kế cho tra cứu hóa học phổ thông.
        Độ tan thực tế có thể thay đổi theo nhiệt độ và điều kiện dung dịch.
      </div>

    </section>
  `)

  const cationSelect =
    tools.querySelector('#sol-cation')

  const anionSelect =
    tools.querySelector('#sol-anion')

  cationSelect.innerHTML =
    cations.map(c => `
      <option value="${c.id}">
        ${c.html} — ${c.name}
      </option>
    `).join('')

  anionSelect.innerHTML =
    anions.map(a => `
      <option value="${a.id}">
        ${a.html} — ${a.name}
      </option>
    `).join('')

  cationSelect.value = 'na'
  anionSelect.value = 'cl'

  cationSelect.addEventListener(
    'change',
    updateResult
  )

  anionSelect.addEventListener(
    'change',
    updateResult
  )

  function getSolubility(cation, anion) {
    if (
      cation.group === 'alkali' ||
      cation.group === 'ammonium'
    ) {
      return result(
        'soluble',
        'Tan',
        'Tan trong nước',
        'Muối của kim loại kiềm và ion ammonium thường tan trong nước.'
      )
    }

    if (anion.id === 'no3') {
      return result(
        'soluble',
        'Tan',
        'Tan trong nước',
        'Các muối nitrate thường tan trong nước.'
      )
    }

    if (
      ['cl','br','i'].includes(
        anion.id
      )
    ) {
      if (cation.id === 'ag') {
        return result(
          'insoluble',
          'Không tan',
          'Tạo kết tủa',
          `${makeFormula(cation, anion)} hầu như không tan trong nước.`
        )
      }

      if (cation.id === 'pb') {
        return result(
          'slight',
          'Ít tan',
          'Ít tan trong nước',
          `${makeFormula(cation, anion)} có độ tan thấp trong nước.`
        )
      }

      return result(
        'soluble',
        'Tan',
        'Tan trong nước',
        'Phần lớn chloride, bromide và iodide tan trong nước.'
      )
    }

    if (anion.id === 'so4') {
      if (
        ['ba','pb'].includes(
          cation.id
        )
      ) {
        return result(
          'insoluble',
          'Không tan',
          'Tạo kết tủa',
          `${makeFormula(cation, anion)} rất ít tan và thường tạo kết tủa.`
        )
      }

      if (cation.id === 'ca') {
        return result(
          'slight',
          'Ít tan',
          'Ít tan trong nước',
          'Calcium sulfate chỉ tan một lượng nhỏ trong nước.'
        )
      }

      return result(
        'soluble',
        'Tan',
        'Tan trong nước',
        'Phần lớn muối sulfate tan trong nước.'
      )
    }

    if (
      anion.id === 'co3' ||
      anion.id === 'po4'
    ) {
      return result(
        'insoluble',
        'Không tan',
        'Tạo kết tủa',
        'Phần lớn carbonate và phosphate không tan, ngoại trừ muối kim loại kiềm và ammonium.'
      )
    }

    if (anion.id === 'oh') {
      if (cation.id === 'ba') {
        return result(
          'soluble',
          'Tan',
          'Tan trong nước',
          'Barium hydroxide có khả năng tan trong nước.'
        )
      }

      if (cation.id === 'ca') {
        return result(
          'slight',
          'Ít tan',
          'Ít tan trong nước',
          'Calcium hydroxide chỉ tan một lượng nhỏ trong nước.'
        )
      }

      return result(
        'insoluble',
        'Không tan',
        'Ít hoặc không tan',
        'Phần lớn hydroxide kim loại không tan trong nước.'
      )
    }

    if (anion.id === 's') {
      if (
        ['mg','ca','ba'].includes(
          cation.id
        )
      ) {
        return result(
          'soluble',
          'Tan',
          'Tan trong nước',
          'Sulfide của một số kim loại nhóm kiềm thổ có khả năng tan hoặc phản ứng với nước.'
        )
      }

      return result(
        'insoluble',
        'Không tan',
        'Tạo kết tủa',
        'Phần lớn sulfide kim loại chuyển tiếp không tan trong nước.'
      )
    }

    return result(
      'soluble',
      'Tan',
      'Tan trong nước',
      'Hợp chất được xem là tan trong điều kiện tra cứu này.'
    )
  }

  function result(
    type,
    label,
    title,
    description
  ) {
    return {
      type,
      label,
      title,
      description
    }
  }

  function makeFormula(
    cation,
    anion
  ) {
    const divisor =
      gcd(
        cation.charge,
        anion.charge
      )

    const cationCount =
      anion.charge /
      divisor

    const anionCount =
      cation.charge /
      divisor

    return (
      formatIon(
        cation,
        cationCount
      ) +
      formatIon(
        anion,
        anionCount
      )
    )
  }

  function formatIon(
    ion,
    count
  ) {
    let symbol =
      ion.symbol

    if (
      ion.poly &&
      count > 1
    ) {
      symbol =
        `(${symbol})`
    }

    if (count > 1) {
      symbol += count
    }

    return symbol
  }

  function formulaHTML(formula) {
    return formula.replace(
      /(\d+)/g,
      '<sub>$1</sub>'
    )
  }

  function updateResult() {
    const cation =
      cations.find(
        item =>
          item.id ===
          cationSelect.value
      )

    const anion =
      anions.find(
        item =>
          item.id ===
          anionSelect.value
      )

    const formula =
      makeFormula(
        cation,
        anion
      )

    const info =
      getSolubility(
        cation,
        anion
      )

    tools.querySelector(
      '#sol-formula'
    ).innerHTML =
      formulaHTML(formula)

    const status =
      tools.querySelector(
        '#sol-status'
      )

    status.textContent =
      info.label

    const card =
      tools.querySelector(
        '#sol-result-card'
      )

    card.className =
      `sol-result-card ${info.type}`

    const dot =
      tools.querySelector(
        '#sol-status-dot'
      )

    dot.className =
      info.type

    tools.querySelector(
      '#sol-description-title'
    ).textContent =
      info.title

    tools.querySelector(
      '#sol-description-text'
    ).textContent =
      info.description

    highlightCell(
      cation.id,
      anion.id
    )
  }

  function createMatrix() {
    const head =
      tools.querySelector(
        '#sol-table-head'
      )

    const body =
      tools.querySelector(
        '#sol-table-body'
      )

    head.innerHTML = `
      <tr>
        <th>
          Ion
        </th>

        ${
          anions.map(a => `
            <th title="${a.name}">
              ${a.html}
            </th>
          `).join('')
        }
      </tr>
    `

    body.innerHTML =
      cations.map(cation => `
        <tr>
          <th title="${cation.name}">
            ${cation.html}
          </th>

          ${
            anions.map(anion => {
              const info =
                getSolubility(
                  cation,
                  anion
                )

              const formula =
                makeFormula(
                  cation,
                  anion
                )

              return `
                <td
                  data-cation="${cation.id}"
                  data-anion="${anion.id}"
                >
                  <button
                    class="sol-cell ${info.type}"
                    title="${formula} — ${info.label}"
                    aria-label="${formula} — ${info.label}"
                  >
                    ${formulaHTML(formula)}
                  </button>
                </td>
              `
            }).join('')
          }

        </tr>
      `).join('')

    body
      .querySelectorAll(
        '[data-cation][data-anion]'
      )
      .forEach(cell => {
        cell.addEventListener(
          'click',
          () => {
            cationSelect.value =
              cell.dataset.cation

            anionSelect.value =
              cell.dataset.anion

            updateResult()

            tools
              .querySelector(
                '#solubility-tool'
              )
              .scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              })
          }
        )
      })
  }

  function highlightCell(
    cation,
    anion
  ) {
    tools
      .querySelectorAll(
        '.sol-cell.selected'
      )
      .forEach(cell =>
        cell.classList.remove(
          'selected'
        )
      )

    const selected =
      tools.querySelector(
        `[data-cation="${cation}"][data-anion="${anion}"] .sol-cell`
      )

    selected?.classList.add(
      'selected'
    )
  }

  function gcd(a,b) {
    while (b) {
      const temp = b
      b = a % b
      a = temp
    }

    return a
  }

  createMatrix()
  updateResult()
}
