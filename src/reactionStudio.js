import { APP_VERSION } from './appMeta.js'

import {
  elements
} from './data/elements.js'

import './reactionStudio.css'


/* =========================================================
   CHEMLAB
   REACTION STUDIO
========================================================= */

let activeStudio =
  null


/* =========================================================
   ELEMENT MASSES
========================================================= */

const ELEMENT_MASS =
  new Map(
    elements
      .map(
        (
          raw,
          index
        ) => {

          const data =
            Array.isArray(raw)
              ? {
                  number: raw[0],
                  symbol: raw[1],
                  name: raw[2],
                  mass: raw[3]
                }
              : raw


          return {

            number:
              Number(
                data.number ??
                data.atomicNumber ??
                index + 1
              ),

            symbol:
              data.symbol,

            name:
              data.name ||
              data.symbol,

            mass:
              parseMass(
                data.mass ??
                data.atomicMass ??
                data.atomic_mass
              )

          }

        }
      )
      .filter(
        item =>
          item.symbol &&
          Number.isFinite(
            item.mass
          )
      )
      .map(
        item => [
          item.symbol,
          item
        ]
      )
  )


/* =========================================================
   REACTION LIBRARY
========================================================= */

const REACTION_LIBRARY = [

  /* ACID BASE */

  reaction(
    ['HCl','NaOH'],
    ['NaCl','H2O'],
    'Trung hòa axit – bazơ',
    [
      'Dung dịch có thể ấm lên do phản ứng trung hòa.'
    ]
  ),

  reaction(
    ['HCl','KOH'],
    ['KCl','H2O'],
    'Trung hòa axit – bazơ',
    [
      'Phản ứng trung hòa tạo muối và nước.'
    ]
  ),

  reaction(
    ['HNO3','KOH'],
    ['KNO3','H2O'],
    'Trung hòa axit – bazơ',
    [
      'Phản ứng trung hòa tạo muối và nước.'
    ]
  ),

  reaction(
    ['H2SO4','NaOH'],
    ['Na2SO4','H2O'],
    'Trung hòa axit – bazơ',
    [
      'Dung dịch có thể tỏa nhiệt.'
    ]
  ),

  reaction(
    ['HCl','Ca(OH)2'],
    ['CaCl2','H2O'],
    'Trung hòa axit – bazơ',
    [
      'Axit và bazơ phản ứng tạo muối và nước.'
    ]
  ),


  /* PRECIPITATION */

  reaction(
    ['AgNO3','NaCl'],
    ['AgCl','NaNO3'],
    'Phản ứng trao đổi – kết tủa',
    [
      'Xuất hiện kết tủa trắng AgCl.'
    ]
  ),

  reaction(
    ['BaCl2','Na2SO4'],
    ['BaSO4','NaCl'],
    'Phản ứng trao đổi – kết tủa',
    [
      'Xuất hiện kết tủa trắng BaSO₄.'
    ]
  ),

  reaction(
    ['Pb(NO3)2','KI'],
    ['PbI2','KNO3'],
    'Phản ứng trao đổi – kết tủa',
    [
      'Xuất hiện kết tủa vàng PbI₂.'
    ]
  ),

  reaction(
    ['CuSO4','NaOH'],
    ['Cu(OH)2','Na2SO4'],
    'Phản ứng trao đổi – kết tủa',
    [
      'Xuất hiện kết tủa xanh Cu(OH)₂.'
    ]
  ),

  reaction(
    ['FeCl3','NaOH'],
    ['Fe(OH)3','NaCl'],
    'Phản ứng trao đổi – kết tủa',
    [
      'Xuất hiện kết tủa nâu đỏ Fe(OH)₃.'
    ]
  ),


  /* GAS */

  reaction(
    ['Na2CO3','HCl'],
    ['NaCl','H2O','CO2'],
    'Axit + carbonate',
    [
      'Có khí CO₂ thoát ra.',
      'Xuất hiện hiện tượng sủi bọt.'
    ]
  ),

  reaction(
    ['NaHCO3','HCl'],
    ['NaCl','H2O','CO2'],
    'Axit + hydrogencarbonate',
    [
      'Khí CO₂ thoát ra mạnh.',
      'Có hiện tượng sủi bọt.'
    ]
  ),


  /* METAL ACID */

  reaction(
    ['Zn','HCl'],
    ['ZnCl2','H2'],
    'Kim loại + axit',
    [
      'Có bọt khí H₂.',
      'Kẽm tan dần.'
    ]
  ),

  reaction(
    ['Mg','HCl'],
    ['MgCl2','H2'],
    'Kim loại + axit',
    [
      'Có khí H₂ thoát ra.',
      'Magnesium tan dần.'
    ]
  ),

  reaction(
    ['Fe','HCl'],
    ['FeCl2','H2'],
    'Kim loại + axit',
    [
      'Có khí H₂ thoát ra.',
      'Sắt tan dần.'
    ]
  ),


  /* COMBUSTION */

  reaction(
    ['CH4','O2'],
    ['CO2','H2O'],
    'Phản ứng cháy',
    [
      'Tỏa nhiệt.',
      'Tạo CO₂ và hơi nước.'
    ]
  ),

  reaction(
    ['C2H6','O2'],
    ['CO2','H2O'],
    'Phản ứng cháy',
    [
      'Phản ứng cháy tỏa nhiệt.'
    ]
  ),

  reaction(
    ['C3H8','O2'],
    ['CO2','H2O'],
    'Phản ứng cháy',
    [
      'Phản ứng cháy tỏa nhiệt.'
    ]
  ),

  reaction(
    ['C2H5OH','O2'],
    ['CO2','H2O'],
    'Phản ứng cháy',
    [
      'Ethanol cháy tạo CO₂ và nước.'
    ]
  ),


  /* SYNTHESIS */

  reaction(
    ['H2','O2'],
    ['H2O'],
    'Phản ứng hóa hợp',
    [
      'Phản ứng tỏa nhiệt mạnh.'
    ]
  ),

  reaction(
    ['Fe','S'],
    ['FeS'],
    'Phản ứng hóa hợp',
    [
      'Khi đun nóng tạo iron sulfide.'
    ]
  ),

  reaction(
    ['Na','Cl2'],
    ['NaCl'],
    'Phản ứng hóa hợp',
    [
      'Phản ứng xảy ra mạnh tạo sodium chloride.'
    ]
  ),


  /* DECOMPOSITION */

  reaction(
    ['CaCO3'],
    ['CaO','CO2'],
    'Phản ứng phân hủy',
    [
      'Khi nung nóng giải phóng CO₂.'
    ]
  ),

  reaction(
    ['KClO3'],
    ['KCl','O2'],
    'Phản ứng phân hủy',
    [
      'Giải phóng khí O₂ khi đun nóng thích hợp.'
    ]
  ),

  reaction(
    ['H2O2'],
    ['H2O','O2'],
    'Phản ứng phân hủy',
    [
      'Có khí O₂ thoát ra.'
    ]
  )

]


const REACTION_MAP =
  new Map(
    REACTION_LIBRARY.map(
      item => [
        reactantKey(
          item.reactants
        ),
        item
      ]
    )
  )


/* =========================================================
   STATES
========================================================= */

const STATE_MAP = {

  H2O: 'l',

  H2: 'g',
  O2: 'g',
  N2: 'g',
  F2: 'g',
  Cl2: 'g',

  CO2: 'g',
  NH3: 'g',
  SO2: 'g',
  NO2: 'g',

  CH4: 'g',
  C2H6: 'g',
  C3H8: 'g',

  Br2: 'l',

  AgCl: 's',
  BaSO4: 's',
  PbI2: 's',
  CuOH2: 's',
  'Cu(OH)2': 's',
  'Fe(OH)3': 's',

  FeS: 's',
  CaCO3: 's',
  CaO: 's',

  Fe: 's',
  Zn: 's',
  Mg: 's',
  Na: 's',
  S: 's'

}


/* =========================================================
   EXAMPLES
========================================================= */

const EXAMPLES = [

  'HCl + NaOH',

  'AgNO3 + NaCl',

  'Na2CO3 + HCl',

  'CH4 + O2',

  'H2 + O2 -> H2O',

  'Al + O2 -> Al2O3',

  'Fe + HCl -> FeCl2 + H2'

]


/* =========================================================
   OPEN
========================================================= */

export function openReactionStudio({
  context = null
} = {}) {

  closeReactionStudio()


  const overlay =
    document.createElement(
      'div'
    )


  overlay.className =
    'rs52-overlay'


  overlay.innerHTML = `
    <section
      class="rs52-window"
      role="dialog"
      aria-modal="true"
      aria-label="Reaction Studio"
    >

      <header class="rs52-header">

        <div class="rs52-brand">

          <div class="rs52-brand-icon">
            ⇌
          </div>


          <div>

            <span>
              CHEMLAB ${APP_VERSION}
            </span>

            <h2>
              Reaction Studio
            </h2>

            <p>
              Dự đoán, cân bằng và phân tích phản ứng hóa học.
            </p>

          </div>

        </div>


        <button
          type="button"
          class="rs52-close"
          data-rs-close
          aria-label="Đóng"
        >
          ×
        </button>

      </header>


      <section class="rs52-input-zone">

        <div class="rs52-input-head">

          <div>

            <span>
              REACTION INPUT
            </span>

            <strong>
              Nhập chất phản ứng hoặc phương trình
            </strong>

          </div>


          <small>
            Có thể dùng →, = hoặc ->
          </small>

        </div>


        <div class="rs52-input-row">

          <textarea
            data-rs-input
            spellcheck="false"
            placeholder="VD: HCl + NaOH hoặc H2 + O2 -> H2O"
          ></textarea>


          <button
            type="button"
            data-rs-analyze
          >
            <span>
              ⇌
            </span>

            <strong>
              Phân tích
            </strong>
          </button>

        </div>


        <div class="rs52-examples">

          ${
            EXAMPLES
              .map(
                example => `
                  <button
                    type="button"
                    data-rs-example="${escapeHTML(example)}"
                  >
                    ${renderRawEquation(example)}
                  </button>
                `
              )
              .join('')
          }

        </div>

      </section>


      <div
        class="rs52-message"
        data-rs-message
        hidden
      ></div>


      <main class="rs52-main">

        <section class="rs52-result-column">

          <section class="rs52-equation-card">

            <div class="rs52-equation-label">

              <span>
                BALANCED EQUATION
              </span>

              <b data-rs-status>
                Chưa phân tích
              </b>

            </div>


            <div
              class="rs52-equation"
              data-rs-equation
            >
              —
            </div>


            <div class="rs52-equation-actions">

              <button
                type="button"
                data-rs-copy
                disabled
              >
                Sao chép phương trình
              </button>


              <button
                type="button"
                data-rs-save
                disabled
              >
                Lưu vào Chem Flow
              </button>

            </div>

          </section>


          <section class="rs52-metrics">

            ${metric(
              'TYPE',
              '—',
              'type'
            )}

            ${metric(
              'RATIO',
              '—',
              'ratio'
            )}

            ${metric(
              'ELEMENTS',
              '—',
              'elements'
            )}

            ${metric(
              'STATUS',
              '—',
              'balance'
            )}

          </section>


          <section class="rs52-card">

            <header>

              <div>

                <span>
                  STOICHIOMETRY
                </span>

                <h3>
                  Tỉ lệ mol
                </h3>

              </div>

            </header>


            <div
              class="rs52-ratio"
              data-rs-ratio
            >
              <div class="rs52-empty">
                Chưa có dữ liệu.
              </div>
            </div>

          </section>


          <section class="rs52-card">

            <header>

              <div>

                <span>
                  ATOM AUDIT
                </span>

                <h3>
                  Kiểm tra bảo toàn nguyên tố
                </h3>

              </div>

            </header>


            <div
              class="rs52-atom-audit"
              data-rs-audit
            >
              <div class="rs52-empty">
                Chưa có dữ liệu.
              </div>
            </div>

          </section>


          <section class="rs52-card">

            <header>

              <div>

                <span>
                  SPECIES
                </span>

                <h3>
                  Các chất trong phản ứng
                </h3>

              </div>

            </header>


            <div
              class="rs52-species"
              data-rs-species
            >
              <div class="rs52-empty">
                Chưa có dữ liệu.
              </div>
            </div>

          </section>

        </section>


        <aside class="rs52-sidebar">

          <section class="rs52-card">

            <header>

              <div>

                <span>
                  OBSERVATION
                </span>

                <h3>
                  Hiện tượng dự kiến
                </h3>

              </div>

            </header>


            <div
              class="rs52-observations"
              data-rs-observations
            >

              <div class="rs52-empty">
                Hãy phân tích một phản ứng.
              </div>

            </div>

          </section>


          <section class="rs52-card">

            <header>

              <div>

                <span>
                  SOURCE
                </span>

                <h3>
                  Cách xác định sản phẩm
                </h3>

              </div>

            </header>


            <div
              class="rs52-source"
              data-rs-source
            >
              —
            </div>

          </section>


          <section class="rs52-card rs52-context-card">

            <header>

              <div>

                <span>
                  CHEM CONTEXT
                </span>

                <h3>
                  Dữ liệu từ ChemLab
                </h3>

              </div>

            </header>


            <div data-rs-context>

              ${
                renderContext(
                  context
                )
              }

            </div>

          </section>


          <section class="rs52-card rs52-workflow">

            <header>

              <div>

                <span>
                  CHEM FLOW
                </span>

                <h3>
                  Tiếp tục phản ứng
                </h3>

              </div>

            </header>


            <button
              type="button"
              data-rs-lab
              disabled
            >

              <span>
                ⌁
              </span>

              <div>

                <strong>
                  Run in Virtual Lab
                </strong>

                <small>
                  Chuyển dữ liệu phản ứng sang Lab
                </small>

              </div>

              <b>
                →
              </b>

            </button>


            <button
              type="button"
              data-rs-compound
              disabled
            >

              <span>
                ◇
              </span>

              <div>

                <strong>
                  Compound Studio
                </strong>

                <small>
                  Phân tích sản phẩm đầu tiên
                </small>

              </div>

              <b>
                →
              </b>

            </button>

          </section>


          <div class="rs52-note">

            <span>
              i
            </span>

            <p>
              Dự đoán sản phẩm sử dụng thư viện phản ứng
              phổ thông. Nếu phản ứng không có trong thư viện,
              hãy nhập đầy đủ cả hai vế để ChemLab cân bằng.
            </p>

          </div>

        </aside>

      </main>

    </section>
  `


  document.body
    .appendChild(
      overlay
    )


  const input =
    overlay.querySelector(
      '[data-rs-input]'
    )


  let currentResult =
    null


  /* =====================================================
     CONTEXT START
  ===================================================== */

  if (
    context
      ?.reaction
      ?.input
  ) {

    input.value =
      context.reaction.input

  }


  /* =====================================================
     ANALYZE
  ===================================================== */

  function analyze() {

    const raw =
      input.value
        .trim()


    if (!raw) {

      showMessage(
        'Hãy nhập chất phản ứng hoặc phương trình.',
        'error'
      )


      return

    }


    try {

      let parsed =
        parseReactionInput(
          raw
        )


      let source =
        'user'


      let metadata =
        null


      /* =================================================
         PREDICT PRODUCTS
      ================================================= */

      if (
        !parsed.products.length
      ) {

        const predicted =
          predictReaction(
            parsed.reactants
          )


        if (!predicted) {

          currentResult =
            null


          resetResult()


          showMessage(
            'ChemLab chưa có quy tắc dự đoán đáng tin cậy cho phản ứng này. Hãy nhập thêm sản phẩm, ví dụ: Fe + O2 -> Fe2O3.',
            'warning'
          )


          overlay.querySelector(
            '[data-rs-source]'
          ).innerHTML = `
            <strong>
              Cần nhập sản phẩm
            </strong>

            <span>
              Reaction Studio không đoán ngẫu nhiên
              các phản ứng ngoài thư viện.
            </span>
          `


          return

        }


        parsed.products =
          predicted.products
            .map(
              parseSpeciesToken
            )


        metadata =
          predicted


        source =
          'prediction'

      }


      /* =================================================
         BALANCE
      ================================================= */

      const coefficients =
        balanceEquation(
          parsed.reactants,
          parsed.products
        )


      if (
        !coefficients
      ) {

        throw new Error(
          'Không tìm được hệ số cân bằng hợp lệ cho phương trình này.'
        )

      }


      const reactantCoefficients =
        coefficients.slice(
          0,
          parsed.reactants.length
        )


      const productCoefficients =
        coefficients.slice(
          parsed.reactants.length
        )


      const reactants =
        parsed.reactants
          .map(
            (
              species,
              index
            ) =>
              enrichSpecies(
                species,
                reactantCoefficients[
                  index
                ]
              )
          )


      const products =
        parsed.products
          .map(
            (
              species,
              index
            ) =>
              enrichSpecies(
                species,
                productCoefficients[
                  index
                ]
              )
          )


      const balanced =
        equationText(
          reactants,
          products
        )


      const type =
        metadata?.type ||
        detectReactionType(
          reactants,
          products
        )


      const observations =
        metadata?.observations ||
        detectObservations(
          products
        )


      const audit =
        createAtomAudit(
          reactants,
          products
        )


      currentResult = {

        input:
          raw,

        source,

        type,

        balanced,

        reactants,

        products,

        observations,

        audit

      }


      renderResult(
        currentResult
      )


      hideMessage()

    }

    catch (
      error
    ) {

      currentResult =
        null


      resetResult()


      showMessage(
        error.message ||
        'Không thể phân tích phản ứng.',
        'error'
      )

    }

  }


  /* =====================================================
     RENDER RESULT
  ===================================================== */

  function renderResult(
    result
  ) {

    const equation =
      overlay.querySelector(
        '[data-rs-equation]'
      )


    equation.innerHTML =
      renderBalancedEquation(
        result.reactants,
        result.products
      )


    overlay.querySelector(
      '[data-rs-status]'
    ).textContent =
      result.source ===
      'prediction'
        ? 'Đã dự đoán + cân bằng'
        : 'Đã cân bằng'


    setMetric(
      'type',
      result.type
    )


    setMetric(
      'ratio',
      result
        .reactants
        .concat(
          result.products
        )
        .map(
          species =>
            species.coefficient
        )
        .join(' : ')
    )


    setMetric(
      'elements',
      result.audit.length
    )


    setMetric(
      'balance',
      result.audit.every(
        item =>
          item.left ===
          item.right
      )
        ? 'Cân bằng'
        : 'Kiểm tra lại'
    )


    renderRatio(
      result
    )


    renderAudit(
      result.audit
    )


    renderSpecies(
      result
    )


    renderObservations(
      result
    )


    renderSource(
      result
    )


    overlay
      .querySelector(
        '[data-rs-copy]'
      )
      .disabled =
      false


    overlay
      .querySelector(
        '[data-rs-save]'
      )
      .disabled =
      false


    overlay
      .querySelector(
        '[data-rs-lab]'
      )
      .disabled =
      false


    overlay
      .querySelector(
        '[data-rs-compound]'
      )
      .disabled =
      !result.products.length

  }


  /* =====================================================
     RATIO
  ===================================================== */

  function renderRatio(
    result
  ) {

    const host =
      overlay.querySelector(
        '[data-rs-ratio]'
      )


    host.innerHTML = `

      <div class="rs52-ratio-side">

        <span>
          CHẤT PHẢN ỨNG
        </span>

        ${
          result.reactants
            .map(
              species =>
                ratioChip(
                  species
                )
            )
            .join('')
        }

      </div>


      <div class="rs52-ratio-arrow">
        →
      </div>


      <div class="rs52-ratio-side">

        <span>
          SẢN PHẨM
        </span>

        ${
          result.products
            .map(
              species =>
                ratioChip(
                  species
                )
            )
            .join('')
        }

      </div>

    `

  }


  /* =====================================================
     AUDIT
  ===================================================== */

  function renderAudit(
    audit
  ) {

    const host =
      overlay.querySelector(
        '[data-rs-audit]'
      )


    host.innerHTML = `
      <div class="rs52-audit-head">

        <span>
          Nguyên tố
        </span>

        <span>
          Vế trái
        </span>

        <span>
          Vế phải
        </span>

        <span>
          Kết quả
        </span>

      </div>


      ${
        audit
          .map(
            item => `
              <div class="rs52-audit-row">

                <strong>
                  ${item.element}
                </strong>

                <span>
                  ${item.left}
                </span>

                <span>
                  ${item.right}
                </span>

                <b
                  class="${
                    item.left ===
                    item.right
                      ? 'ok'
                      : 'bad'
                  }"
                >
                  ${
                    item.left ===
                    item.right
                      ? '✓'
                      : '!'
                  }
                </b>

              </div>
            `
          )
          .join('')
      }
    `

  }


  /* =====================================================
     SPECIES
  ===================================================== */

  function renderSpecies(
    result
  ) {

    const host =
      overlay.querySelector(
        '[data-rs-species]'
      )


    const all = [

      ...result.reactants.map(
        species => ({
          ...species,
          side: 'Reactant'
        })
      ),

      ...result.products.map(
        species => ({
          ...species,
          side: 'Product'
        })
      )

    ]


    host.innerHTML =
      all
        .map(
          species => `
            <article class="rs52-species-card">

              <div>

                <span>
                  ${species.side}
                </span>

                <strong>
                  ${
                    renderFormula(
                      species.formula
                    )
                  }
                </strong>

              </div>


              <div>

                <span>
                  Hệ số
                </span>

                <strong>
                  ${species.coefficient}
                </strong>

              </div>


              <div>

                <span>
                  Trạng thái
                </span>

                <strong>
                  (${species.state})
                </strong>

              </div>


              <div>

                <span>
                  Molar mass
                </span>

                <strong>
                  ${
                    Number.isFinite(
                      species.molarMass
                    )
                      ? `${formatNumber(
                          species.molarMass,
                          3
                        )} g/mol`
                      : '—'
                  }
                </strong>

              </div>

            </article>
          `
        )
        .join('')

  }


  /* =====================================================
     OBSERVATIONS
  ===================================================== */

  function renderObservations(
    result
  ) {

    const host =
      overlay.querySelector(
        '[data-rs-observations]'
      )


    if (
      !result.observations.length
    ) {

      host.innerHTML = `
        <div class="rs52-empty">

          Không có hiện tượng đặc trưng
          được lưu trong dữ liệu hiện tại.

        </div>
      `


      return

    }


    host.innerHTML =
      result.observations
        .map(
          observation => `
            <div class="rs52-observation">

              <span>
                •
              </span>

              <p>
                ${escapeHTML(
                  observation
                )}
              </p>

            </div>
          `
        )
        .join('')

  }


  /* =====================================================
     SOURCE
  ===================================================== */

  function renderSource(
    result
  ) {

    const host =
      overlay.querySelector(
        '[data-rs-source]'
      )


    if (
      result.source ===
      'prediction'
    ) {

      host.innerHTML = `
        <strong>
          Thư viện phản ứng ChemLab
        </strong>

        <span>
          Sản phẩm được dự đoán từ một
          quy tắc phản ứng phổ thông đã định nghĩa,
          sau đó được cân bằng bằng engine đại số.
        </span>
      `

    }

    else {

      host.innerHTML = `
        <strong>
          Phương trình do người dùng cung cấp
        </strong>

        <span>
          Reaction Studio chỉ xác định hệ số
          cân bằng và phân tích phản ứng.
        </span>
      `

    }

  }


  /* =====================================================
     RESET
  ===================================================== */

  function resetResult() {

    overlay.querySelector(
      '[data-rs-equation]'
    ).textContent =
      '—'


    overlay.querySelector(
      '[data-rs-status]'
    ).textContent =
      'Chưa phân tích'


    setMetric(
      'type',
      '—'
    )


    setMetric(
      'ratio',
      '—'
    )


    setMetric(
      'elements',
      '—'
    )


    setMetric(
      'balance',
      '—'
    )


    overlay.querySelector(
      '[data-rs-ratio]'
    ).innerHTML = `
      <div class="rs52-empty">
        Chưa có dữ liệu.
      </div>
    `


    overlay.querySelector(
      '[data-rs-audit]'
    ).innerHTML = `
      <div class="rs52-empty">
        Chưa có dữ liệu.
      </div>
    `


    overlay.querySelector(
      '[data-rs-species]'
    ).innerHTML = `
      <div class="rs52-empty">
        Chưa có dữ liệu.
      </div>
    `


    overlay.querySelector(
      '[data-rs-copy]'
    ).disabled =
      true


    overlay.querySelector(
      '[data-rs-save]'
    ).disabled =
      true


    overlay.querySelector(
      '[data-rs-lab]'
    ).disabled =
      true


    overlay.querySelector(
      '[data-rs-compound]'
    ).disabled =
      true

  }


  /* =====================================================
     METRIC
  ===================================================== */

  function setMetric(
    name,
    value
  ) {

    overlay.querySelector(
      `[data-rs-metric="${name}"]`
    ).textContent =
      value

  }


  /* =====================================================
     SAVE
  ===================================================== */

  function saveReaction() {

    if (
      !currentResult
    ) {
      return false
    }


    window
      .ChemLabContext
      ?.captureReaction
      ?.(
        currentResult
      )


    studioToast(
      'Đã lưu phản ứng vào Chem Flow.'
    )


    return true

  }


  /* =====================================================
     RUN LAB
  ===================================================== */

  async function runLab() {

    if (
      !saveReaction()
    ) {
      return
    }


    close()


    await window
      .ChemLabContext
      ?.go?.(
        'lab'
      )

  }


  /* =====================================================
     OPEN PRODUCT
  ===================================================== */

  async function openProduct() {

    if (
      !currentResult
        ?.products
        ?.length
    ) {
      return
    }


    const product =
      currentResult
        .products[0]


    window
      .ChemLabContext
      ?.captureCompound
      ?.({

        formula:
          product.formula,

        name:
          `Sản phẩm ${product.formula}`

      })


    close()


    await window
      .ChemLabContext
      ?.go?.(
        'studio'
      )

  }


  /* =====================================================
     COPY
  ===================================================== */

  async function copyEquation() {

    if (
      !currentResult
    ) {
      return
    }


    try {

      await navigator
        .clipboard
        .writeText(
          currentResult.balanced
        )


      studioToast(
        'Đã sao chép phương trình.'
      )

    }

    catch {

      studioToast(
        'Không thể sao chép tự động.'
      )

    }

  }


  /* =====================================================
     EVENTS
  ===================================================== */

  overlay
    .querySelector(
      '[data-rs-analyze]'
    )
    .addEventListener(
      'click',
      analyze
    )


  input.addEventListener(
    'keydown',
    event => {

      if (
        event.key ===
          'Enter' &&
        !event.shiftKey
      ) {

        event.preventDefault()

        analyze()

      }

    }
  )


  overlay
    .querySelectorAll(
      '[data-rs-example]'
    )
    .forEach(
      button => {

        button.addEventListener(
          'click',
          () => {

            input.value =
              button.dataset
                .rsExample


            analyze()

          }
        )

      }
    )


  overlay
    .querySelector(
      '[data-rs-copy]'
    )
    .addEventListener(
      'click',
      copyEquation
    )


  overlay
    .querySelector(
      '[data-rs-save]'
    )
    .addEventListener(
      'click',
      saveReaction
    )


  overlay
    .querySelector(
      '[data-rs-lab]'
    )
    .addEventListener(
      'click',
      runLab
    )


  overlay
    .querySelector(
      '[data-rs-compound]'
    )
    .addEventListener(
      'click',
      openProduct
    )


  overlay
    .querySelectorAll(
      '[data-rs-close]'
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
      activeStudio?.overlay ===
      overlay
    ) {

      activeStudio =
        null

    }

  }


  activeStudio = {
    overlay,
    close
  }

}


/* =========================================================
   PUBLIC CLOSE
========================================================= */

export function closeReactionStudio() {

  activeStudio
    ?.close?.()

}


/* =========================================================
   PARSE REACTION INPUT
========================================================= */

function parseReactionInput(
  raw
) {

  let value =
    normalizeReactionString(
      raw
    )


  let left =
    value


  let right =
    ''


  if (
    value.includes(
      '->'
    )
  ) {

    const parts =
      value.split(
        '->'
      )


    if (
      parts.length !==
      2
    ) {

      throw new Error(
        'Phương trình chỉ nên có một mũi tên phản ứng.'
      )

    }


    left =
      parts[0]

    right =
      parts[1]

  }


  const reactants =
    splitSpecies(
      left
    )


  const products =
    right.trim()
      ? splitSpecies(
          right
        )
      : []


  if (
    !reactants.length
  ) {

    throw new Error(
      'Không tìm thấy chất phản ứng.'
    )

  }


  return {
    reactants,
    products
  }

}


/* =========================================================
   SPLIT
========================================================= */

function splitSpecies(
  side
) {

  return side
    .split('+')
    .map(
      token =>
        token.trim()
    )
    .filter(Boolean)
    .map(
      parseSpeciesToken
    )

}


/* =========================================================
   SPECIES
========================================================= */

function parseSpeciesToken(
  token
) {

  let value =
    normalizeFormulaInput(
      token
    )


  value =
    value.replace(
      /^\d+(?=[A-Z([{])/,
      ''
    )


  const state =
    value.match(
      /\((aq|s|l|g)\)$/i
    )


  if (
    state
  ) {

    value =
      value.slice(
        0,
        -state[0].length
      )

  }


  const atoms =
    parseFormula(
      value
    )


  return {

    formula:
      value,

    atoms,

    explicitState:
      state
        ? state[1]
            .toLowerCase()
        : null

  }

}


/* =========================================================
   PREDICT
========================================================= */

function predictReaction(
  reactants
) {

  const key =
    reactantKey(
      reactants.map(
        item =>
          item.formula
      )
    )


  return REACTION_MAP.get(
    key
  ) ||
  null

}


/* =========================================================
   LIBRARY ENTRY
========================================================= */

function reaction(
  reactants,
  products,
  type,
  observations
) {

  return {
    reactants,
    products,
    type,
    observations
  }

}


/* =========================================================
   KEY
========================================================= */

function reactantKey(
  reactants
) {

  return reactants
    .map(
      normalizeFormulaInput
    )
    .sort()
    .join('|')

}


/* =========================================================
   BALANCE EQUATION
========================================================= */

function balanceEquation(
  reactants,
  products
) {

  const species = [

    ...reactants,

    ...products

  ]


  const elements =
    [
      ...new Set(
        species.flatMap(
          item =>
            [
              ...item.atoms.keys()
            ]
        )
      )
    ]


  if (
    !elements.length
  ) {
    return null
  }


  const matrix =
    elements.map(
      element => {

        return species.map(
          (
            item,
            index
          ) => {

            const count =
              item.atoms.get(
                element
              ) ||
              0


            return new Fraction(
              BigInt(
                index <
                reactants.length
                  ? count
                  : -count
              )
            )

          }
        )

      }
    )


  return nullspacePositiveInteger(
    matrix
  )

}


/* =========================================================
   NULL SPACE
========================================================= */

function nullspacePositiveInteger(
  matrix
) {

  const {
    matrix: rref,
    pivotColumns
  } =
    toRREF(
      matrix
    )


  const columnCount =
    matrix[0].length


  const freeColumns =
    []


  for (
    let column =
      0;

    column <
      columnCount;

    column++
  ) {

    if (
      !pivotColumns.includes(
        column
      )
    ) {

      freeColumns.push(
        column
      )

    }

  }


  if (
    !freeColumns.length
  ) {

    return null

  }


  const maxTry =
    freeColumns.length <=
      3
      ? 7
      : 2


  let answer =
    null


  const assignments =
    Array(
      freeColumns.length
    ).fill(1)


  function search(
    index
  ) {

    if (answer) {
      return
    }


    if (
      index ===
      assignments.length
    ) {

      const vector =
        solveFromFree(

          rref,

          pivotColumns,

          freeColumns,

          assignments

        )


      const integers =
        fractionsToIntegers(
          vector
        )


      if (
        integers &&
        integers.every(
          value =>
            value >
            0
        )
      ) {

        answer =
          integers

      }


      return

    }


    for (
      let value =
        1;

      value <=
        maxTry;

      value++
    ) {

      assignments[index] =
        value


      search(
        index + 1
      )


      if (answer) {
        return
      }

    }

  }


  search(0)


  return answer

}


/* =========================================================
   RREF
========================================================= */

function toRREF(
  source
) {

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
    matrix[0].length


  const pivotColumns =
    []


  let pivotRow =
    0


  for (
    let column =
      0;

    column <
      columns &&
    pivotRow <
      rows;

    column++
  ) {

    let row =
      pivotRow


    while (
      row <
        rows &&
      matrix[row][column]
        .isZero()
    ) {

      row++

    }


    if (
      row ===
      rows
    ) {

      continue

    }


    if (
      row !==
      pivotRow
    ) {

      [
        matrix[row],
        matrix[pivotRow]
      ] = [
        matrix[pivotRow],
        matrix[row]
      ]

    }


    const pivot =
      matrix[
        pivotRow
      ][column]


    for (
      let c =
        0;

      c <
        columns;

      c++
    ) {

      matrix[pivotRow][c] =
        matrix[pivotRow][c]
          .div(
            pivot
          )

    }


    for (
      let r =
        0;

      r <
        rows;

      r++
    ) {

      if (
        r ===
        pivotRow
      ) {
        continue
      }


      const factor =
        matrix[r][column]


      if (
        factor.isZero()
      ) {
        continue
      }


      for (
        let c =
          0;

        c <
          columns;

        c++
      ) {

        matrix[r][c] =
          matrix[r][c]
            .sub(

              factor.mul(
                matrix[
                  pivotRow
                ][c]
              )

            )

      }

    }


    pivotColumns.push(
      column
    )


    pivotRow++

  }


  return {
    matrix,
    pivotColumns
  }

}


/* =========================================================
   SOLVE FREE VARIABLES
========================================================= */

function solveFromFree(
  rref,
  pivotColumns,
  freeColumns,
  assignments
) {

  const columnCount =
    rref[0].length


  const vector =
    Array.from(
      {
        length:
          columnCount
      },
      () =>
        new Fraction(0n)
    )


  freeColumns.forEach(
    (
      column,
      index
    ) => {

      vector[column] =
        new Fraction(
          BigInt(
            assignments[index]
          )
        )

    }
  )


  for (
    let row =
      pivotColumns.length -
      1;

    row >=
      0;

    row--
  ) {

    const pivotColumn =
      pivotColumns[row]


    let sum =
      new Fraction(0n)


    for (
      const freeColumn
      of freeColumns
    ) {

      sum =
        sum.add(

          rref[row][freeColumn]
            .mul(
              vector[
                freeColumn
              ]
            )

        )

    }


    vector[pivotColumn] =
      sum.neg()

  }


  return vector

}


/* =========================================================
   FRACTIONS -> INTEGER
========================================================= */

function fractionsToIntegers(
  vector
) {

  let commonDenominator =
    1n


  for (
    const value
    of vector
  ) {

    commonDenominator =
      lcmBigInt(

        commonDenominator,

        value.denominator

      )

  }


  let integers =
    vector.map(
      value =>
        Number(

          value.numerator *
          (
            commonDenominator /
            value.denominator
          )

        )
    )


  if (
    integers.every(
      value =>
        value <
        0
    )
  ) {

    integers =
      integers.map(
        value =>
          -value
      )

  }


  if (
    integers.some(
      value =>
        !Number.isFinite(
          value
        ) ||
        value ===
        0
    )
  ) {

    return null

  }


  let gcd =
    Math.abs(
      integers[0]
    )


  for (
    let index =
      1;

    index <
      integers.length;

    index++
  ) {

    gcd =
      gcdNumber(
        gcd,
        Math.abs(
          integers[index]
        )
      )

  }


  if (
    gcd >
    1
  ) {

    integers =
      integers.map(
        value =>
          value /
          gcd
      )

  }


  return integers

}


/* =========================================================
   FRACTION CLASS
========================================================= */

class Fraction {

  constructor(
    numerator,
    denominator = 1n
  ) {

    if (
      denominator ===
      0n
    ) {

      throw new Error(
        'Division by zero'
      )

    }


    if (
      denominator <
      0n
    ) {

      numerator =
        -numerator

      denominator =
        -denominator

    }


    const gcd =
      gcdBigInt(
        absBigInt(
          numerator
        ),
        denominator
      )


    this.numerator =
      numerator /
      gcd


    this.denominator =
      denominator /
      gcd

  }


  clone() {

    return new Fraction(
      this.numerator,
      this.denominator
    )

  }


  add(
    other
  ) {

    return new Fraction(

      this.numerator *
      other.denominator +

      other.numerator *
      this.denominator,

      this.denominator *
      other.denominator

    )

  }


  sub(
    other
  ) {

    return new Fraction(

      this.numerator *
      other.denominator -

      other.numerator *
      this.denominator,

      this.denominator *
      other.denominator

    )

  }


  mul(
    other
  ) {

    return new Fraction(

      this.numerator *
      other.numerator,

      this.denominator *
      other.denominator

    )

  }


  div(
    other
  ) {

    return new Fraction(

      this.numerator *
      other.denominator,

      this.denominator *
      other.numerator

    )

  }


  neg() {

    return new Fraction(
      -this.numerator,
      this.denominator
    )

  }


  isZero() {

    return this.numerator ===
      0n

  }

}


/* =========================================================
   ENRICH
========================================================= */

function enrichSpecies(
  species,
  coefficient
) {

  return {

    ...species,

    coefficient,

    state:
      species.explicitState ||
      inferState(
        species.formula
      ),

    molarMass:
      calculateMolarMass(
        species.atoms
      )

  }

}


/* =========================================================
   STATE INFERENCE
========================================================= */

function inferState(
  formula
) {

  if (
    STATE_MAP[
      formula
    ]
  ) {

    return STATE_MAP[
      formula
    ]

  }


  /* NITRATES */

  if (
    formula.includes(
      'NO3'
    )
  ) {

    return 'aq'

  }


  /* COMMON ACIDS */

  if (
    [
      'HCl',
      'HNO3',
      'H2SO4',
      'H3PO4'
    ].includes(
      formula
    )
  ) {

    return 'aq'

  }


  /* ALKALI COMPOUNDS */

  if (
    /^(Li|Na|K|Rb|Cs)/.test(
      formula
    )
  ) {

    return 'aq'

  }


  /* COMMON HYDROXIDES */

  if (
    [
      'NaOH',
      'KOH',
      'Ba(OH)2',
      'Ca(OH)2'
    ].includes(
      formula
    )
  ) {

    return 'aq'

  }


  /* DEFAULT FOR COMMON REACTION SOLUTIONS */

  if (
    /^[A-Z][a-z]?[A-Z(]/.test(
      formula
    )
  ) {

    return 'aq'

  }


  return 's'

}


/* =========================================================
   MOLAR MASS
========================================================= */

function calculateMolarMass(
  atoms
) {

  let total =
    0


  for (
    const [
      symbol,
      count
    ]
    of atoms
  ) {

    const mass =
      ELEMENT_MASS
        .get(
          symbol
        )
        ?.mass


    if (
      !Number.isFinite(
        mass
      )
    ) {

      return NaN

    }


    total +=
      mass *
      count

  }


  return total

}


/* =========================================================
   ATOM AUDIT
========================================================= */

function createAtomAudit(
  reactants,
  products
) {

  const elements =
    new Set()


  reactants
    .concat(
      products
    )
    .forEach(
      species => {

        species.atoms
          .forEach(
            (
              count,
              element
            ) => {

              elements.add(
                element
              )

            }
          )

      }
    )


  return [
    ...elements
  ]
    .sort()
    .map(
      element => {

        return {

          element,

          left:
            atomTotal(
              reactants,
              element
            ),

          right:
            atomTotal(
              products,
              element
            )

        }

      }
    )

}


/* =========================================================
   ATOM TOTAL
========================================================= */

function atomTotal(
  species,
  element
) {

  return species.reduce(
    (
      total,
      item
    ) => {

      return total +
        (
          item.atoms.get(
            element
          ) ||
          0
        ) *
        item.coefficient

    },
    0
  )

}


/* =========================================================
   DETECT TYPE
========================================================= */

function detectReactionType(
  reactants,
  products
) {

  const reactantFormulas =
    reactants.map(
      item =>
        item.formula
    )


  const productFormulas =
    products.map(
      item =>
        item.formula
    )


  if (
    reactants.length ===
      1 &&
    products.length >
      1
  ) {

    return 'Phản ứng phân hủy'

  }


  if (
    reactants.length >
      1 &&
    products.length ===
      1
  ) {

    return 'Phản ứng hóa hợp'

  }


  if (
    reactantFormulas.includes(
      'O2'
    ) &&
    productFormulas.includes(
      'CO2'
    )
  ) {

    return 'Phản ứng cháy'

  }


  if (
    productFormulas.includes(
      'H2O'
    ) &&
    reactantFormulas.some(
      formula =>
        formula.startsWith(
          'H'
        )
    )
  ) {

    return 'Phản ứng trao đổi / trung hòa'

  }


  if (
    products.some(
      product =>
        product.state ===
        's'
    )
  ) {

    return 'Phản ứng tạo kết tủa'

  }


  if (
    products.some(
      product =>
        product.state ===
        'g'
    )
  ) {

    return 'Phản ứng tạo khí'

  }


  if (
    reactants.length ===
      2 &&
    products.length ===
      2
  ) {

    return 'Phản ứng trao đổi'

  }


  return 'Phản ứng hóa học'

}


/* =========================================================
   OBSERVATIONS
========================================================= */

function detectObservations(
  products
) {

  const observations =
    []


  const formulas =
    products.map(
      product =>
        product.formula
    )


  if (
    formulas.includes(
      'CO2'
    )
  ) {

    observations.push(
      'Có khí CO₂ thoát ra.'
    )

  }


  if (
    formulas.includes(
      'H2'
    )
  ) {

    observations.push(
      'Có khí H₂ thoát ra.'
    )

  }


  if (
    formulas.includes(
      'O2'
    )
  ) {

    observations.push(
      'Có khí O₂ thoát ra.'
    )

  }


  if (
    formulas.includes(
      'AgCl'
    )
  ) {

    observations.push(
      'Xuất hiện kết tủa trắng AgCl.'
    )

  }


  if (
    formulas.includes(
      'BaSO4'
    )
  ) {

    observations.push(
      'Xuất hiện kết tủa trắng BaSO₄.'
    )

  }


  if (
    formulas.includes(
      'PbI2'
    )
  ) {

    observations.push(
      'Xuất hiện kết tủa vàng PbI₂.'
    )

  }


  if (
    formulas.includes(
      'Cu(OH)2'
    )
  ) {

    observations.push(
      'Xuất hiện kết tủa xanh Cu(OH)₂.'
    )

  }


  if (
    formulas.includes(
      'Fe(OH)3'
    )
  ) {

    observations.push(
      'Xuất hiện kết tủa nâu đỏ Fe(OH)₃.'
    )

  }


  return observations

}


/* =========================================================
   EQUATION TEXT
========================================================= */

function equationText(
  reactants,
  products
) {

  return [
    reactants
      .map(
        plainSpecies
      )
      .join(
        ' + '
      ),

    '→',

    products
      .map(
        plainSpecies
      )
      .join(
        ' + '
      )
  ]
    .join(
      ' '
    )

}


/* =========================================================
   PLAIN SPECIES
========================================================= */

function plainSpecies(
  species
) {

  const coefficient =
    species.coefficient ===
      1
      ? ''
      : species.coefficient


  return `${coefficient}${species.formula}(${species.state})`

}


/* =========================================================
   RENDER EQUATION
========================================================= */

function renderBalancedEquation(
  reactants,
  products
) {

  return `
    <div class="rs52-equation-side">

      ${
        reactants
          .map(
            species =>
              renderSpeciesEquation(
                species
              )
          )
          .join(
            '<i>+</i>'
          )
      }

    </div>


    <b class="rs52-main-arrow">
      →
    </b>


    <div class="rs52-equation-side">

      ${
        products
          .map(
            species =>
              renderSpeciesEquation(
                species
              )
          )
          .join(
            '<i>+</i>'
          )
      }

    </div>
  `

}


/* =========================================================
   SPECIES EQUATION
========================================================= */

function renderSpeciesEquation(
  species
) {

  return `
    <span class="rs52-equation-species">

      ${
        species.coefficient ===
        1
          ? ''
          : `
              <em>
                ${species.coefficient}
              </em>
            `
      }

      <strong>
        ${renderFormula(
          species.formula
        )}
      </strong>

      <small>
        (${species.state})
      </small>

    </span>
  `

}


/* =========================================================
   RATIO CHIP
========================================================= */

function ratioChip(
  species
) {

  return `
    <div class="rs52-ratio-chip">

      <strong>
        ${species.coefficient}
      </strong>

      <span>
        ${renderFormula(
          species.formula
        )}
      </span>

    </div>
  `

}


/* =========================================================
   PARSE FORMULA
========================================================= */

function parseFormula(
  formula
) {

  const parts =
    formula.split(
      /[·.]/g
    )


  const total =
    new Map()


  for (
    let part
    of parts
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


    if (
      coefficient
    ) {

      multiplier =
        Number(
          coefficient[1]
        )


      part =
        part.slice(
          coefficient[1]
            .length
        )

    }


    const parsed =
      parseFormulaPart(
        part
      )


    parsed.forEach(
      (
        count,
        symbol
      ) => {

        total.set(

          symbol,

          (
            total.get(
              symbol
            ) ||
            0
          ) +
          count *
          multiplier

        )

      }
    )

  }


  return total

}


/* =========================================================
   FORMULA PART
========================================================= */

function parseFormulaPart(
  formula
) {

  const stack = [
    new Map()
  ]


  const brackets =
    []


  let index =
    0


  while (
    index <
    formula.length
  ) {

    const char =
      formula[index]


    /* OPEN */

    if (
      char === '(' ||
      char === '[' ||
      char === '{'
    ) {

      stack.push(
        new Map()
      )


      brackets.push(
        char
      )


      index++

      continue

    }


    /* CLOSE */

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
        brackets.pop()


      if (
        !bracketsMatch(
          open,
          char
        )
      ) {

        throw new Error(
          'Ngoặc trong công thức không khớp.'
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


      const parent =
        stack[
          stack.length -
          1
        ]


      group.forEach(
        (
          count,
          symbol
        ) => {

          parent.set(

            symbol,

            (
              parent.get(
                symbol
              ) ||
              0
            ) +
            count *
            number.value

          )

        }
      )


      continue

    }


    /* ELEMENT */

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
        !ELEMENT_MASS.has(
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
          current.get(
            symbol
          ) ||
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
   NUMBER
========================================================= */

function readNumber(
  formula,
  start
) {

  let digits =
    ''


  let index =
    start


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
        ? Number(
            digits
          )
        : 1,

    next:
      index

  }

}


/* =========================================================
   NORMALIZATION
========================================================= */

function normalizeReactionString(
  value
) {

  return normalizeFormulaInput(
    value
  )
    .replace(
      /→|⇒|⟶|=>/g,
      '->'
    )
    .replace(
      /\s*=\s*/g,
      '->'
    )
    .replace(
      /\s+/g,
      ''
    )

}


function normalizeFormulaInput(
  value
) {

  const subscripts = {

    '₀': '0',
    '₁': '1',
    '₂': '2',
    '₃': '3',
    '₄': '4',
    '₅': '5',
    '₆': '6',
    '₇': '7',
    '₈': '8',
    '₉': '9'

  }


  return String(
    value || ''
  )
    .trim()
    .replace(
      /[₀₁₂₃₄₅₆₇₈₉]/g,
      value =>
        subscripts[
          value
        ]
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
   GCD
========================================================= */

function gcdNumber(
  a,
  b
) {

  a =
    Math.abs(
      Math.round(a)
    )


  b =
    Math.abs(
      Math.round(b)
    )


  while (b) {

    [
      a,
      b
    ] = [
      b,
      a % b
    ]

  }


  return a || 1

}


function absBigInt(
  value
) {

  return value <
    0n
    ? -value
    : value

}


function gcdBigInt(
  a,
  b
) {

  if (
    a ===
    0n
  ) {

    return b ||
    1n

  }


  while (
    b !==
    0n
  ) {

    [
      a,
      b
    ] = [
      b,
      a % b
    ]

  }


  return a ||
  1n

}


function lcmBigInt(
  a,
  b
) {

  return (
    a /
    gcdBigInt(
      a,
      b
    )
  ) *
  b

}


/* =========================================================
   MASS
========================================================= */

function parseMass(
  value
) {

  const match =
    String(
      value ?? ''
    )
      .replace(
        ',',
        '.'
      )
      .match(
        /\d+(?:\.\d+)?/
      )


  return match
    ? Number(
        match[0]
      )
    : NaN

}


/* =========================================================
   UI
========================================================= */

function metric(
  label,
  value,
  id
) {

  return `
    <article>

      <span>
        ${label}
      </span>

      <strong
        data-rs-metric="${id}"
      >
        ${value}
      </strong>

    </article>
  `

}


/* =========================================================
   CONTEXT
========================================================= */

function renderContext(
  context
) {

  if (
    context
      ?.compound
      ?.formula
  ) {

    return `
      <div class="rs52-context-value">

        <span>
          Hợp chất hiện tại
        </span>

        <strong>
          ${renderFormula(
            context.compound
              .formula
          )}
        </strong>

      </div>
    `

  }


  if (
    context
      ?.element
      ?.symbol
  ) {

    return `
      <div class="rs52-context-value">

        <span>
          Nguyên tố hiện tại
        </span>

        <strong>
          ${escapeHTML(
            context.element
              .symbol
          )}
        </strong>

      </div>
    `

  }


  return `
    <div class="rs52-empty">
      Chưa có dữ liệu từ Chem Flow.
    </div>
  `

}


/* =========================================================
   FORMULA HTML
========================================================= */

function renderFormula(
  formula
) {

  return escapeHTML(
    formula
  )
    .replace(
      /(\d+)/g,
      '<sub>$1</sub>'
    )

}


/* =========================================================
   RAW EQUATION HTML
========================================================= */

function renderRawEquation(
  equation
) {

  return escapeHTML(
    equation
  )
    .replace(
      /(\d+)/g,
      '<sub>$1</sub>'
    )
    .replace(
      /-&gt;/g,
      '→'
    )

}


/* =========================================================
   FORMAT
========================================================= */

function formatNumber(
  value,
  digits = 3
) {

  return Number(
    value
  )
    .toLocaleString(
      'vi-VN',
      {
        maximumFractionDigits:
          digits
      }
    )

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
  message,
  type
) {

  const host =
    document.querySelector(
      '.rs52-overlay [data-rs-message]'
    )


  if (!host) {
    return
  }


  host.hidden =
    false


  host.className =
    `rs52-message ${type}`


  host.textContent =
    message

}


function hideMessage() {

  const host =
    document.querySelector(
      '.rs52-overlay [data-rs-message]'
    )


  if (
    host
  ) {

    host.hidden =
      true

  }

}


/* =========================================================
   TOAST
========================================================= */

function studioToast(
  message
) {

  document
    .querySelector(
      '.rs52-toast'
    )
    ?.remove()


  const toast =
    document.createElement(
      'div'
    )


  toast.className =
    'rs52-toast'


  toast.textContent =
    message


  document.body.appendChild(
    toast
  )


  requestAnimationFrame(
    () =>
      toast.classList.add(
        'show'
      )
  )


  setTimeout(
    () => {

      toast.classList.remove(
        'show'
      )


      setTimeout(
        () =>
          toast.remove(),
        200
      )

    },
    1800
  )

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