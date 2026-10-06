import './ionEngine.css'
import { elements } from './data/elements.js'


/* =========================================================
   CHEMLAB 4.5
   ION ENGINE
========================================================= */

const ATOMIC_DATA =
  buildAtomicData()


/* =========================================================
   ION DATABASE
========================================================= */

const IONS = [

  /* =====================================================
     CATIONS +1
  ===================================================== */

  {
    id: 'h',
    formula: 'H',
    charge: 1,
    name: 'Hydrogen',
    type: 'cation',
    family: 'Cation +1'
  },

  {
    id: 'li',
    formula: 'Li',
    charge: 1,
    name: 'Lithium',
    type: 'cation',
    family: 'Kim loại kiềm',
    solubilityId: 'li'
  },

  {
    id: 'na',
    formula: 'Na',
    charge: 1,
    name: 'Sodium',
    type: 'cation',
    family: 'Kim loại kiềm',
    solubilityId: 'na'
  },

  {
    id: 'k',
    formula: 'K',
    charge: 1,
    name: 'Potassium',
    type: 'cation',
    family: 'Kim loại kiềm',
    solubilityId: 'k'
  },

  {
    id: 'rb',
    formula: 'Rb',
    charge: 1,
    name: 'Rubidium',
    type: 'cation',
    family: 'Kim loại kiềm'
  },

  {
    id: 'cs',
    formula: 'Cs',
    charge: 1,
    name: 'Cesium',
    type: 'cation',
    family: 'Kim loại kiềm'
  },

  {
    id: 'ag',
    formula: 'Ag',
    charge: 1,
    name: 'Silver',
    type: 'cation',
    family: 'Kim loại',
    solubilityId: 'ag'
  },

  {
    id: 'cu1',
    formula: 'Cu',
    charge: 1,
    name: 'Copper(I)',
    type: 'cation',
    family: 'Kim loại chuyển tiếp'
  },

  {
    id: 'au1',
    formula: 'Au',
    charge: 1,
    name: 'Gold(I)',
    type: 'cation',
    family: 'Kim loại chuyển tiếp'
  },

  {
    id: 'nh4',
    formula: 'NH4',
    charge: 1,
    name: 'Ammonium',
    type: 'cation',
    family: 'Ion đa nguyên tử',
    polyatomic: true,
    solubilityId: 'nh4'
  },


  /* =====================================================
     CATIONS +2
  ===================================================== */

  {
    id: 'mg',
    formula: 'Mg',
    charge: 2,
    name: 'Magnesium',
    type: 'cation',
    family: 'Kim loại kiềm thổ',
    solubilityId: 'mg'
  },

  {
    id: 'ca',
    formula: 'Ca',
    charge: 2,
    name: 'Calcium',
    type: 'cation',
    family: 'Kim loại kiềm thổ',
    solubilityId: 'ca'
  },

  {
    id: 'sr',
    formula: 'Sr',
    charge: 2,
    name: 'Strontium',
    type: 'cation',
    family: 'Kim loại kiềm thổ'
  },

  {
    id: 'ba',
    formula: 'Ba',
    charge: 2,
    name: 'Barium',
    type: 'cation',
    family: 'Kim loại kiềm thổ',
    solubilityId: 'ba'
  },

  {
    id: 'zn',
    formula: 'Zn',
    charge: 2,
    name: 'Zinc',
    type: 'cation',
    family: 'Kim loại',
    solubilityId: 'zn'
  },

  {
    id: 'cd',
    formula: 'Cd',
    charge: 2,
    name: 'Cadmium',
    type: 'cation',
    family: 'Kim loại'
  },

  {
    id: 'cu2',
    formula: 'Cu',
    charge: 2,
    name: 'Copper(II)',
    type: 'cation',
    family: 'Kim loại chuyển tiếp',
    solubilityId: 'cu'
  },

  {
    id: 'fe2',
    formula: 'Fe',
    charge: 2,
    name: 'Iron(II)',
    type: 'cation',
    family: 'Kim loại chuyển tiếp',
    solubilityId: 'fe2'
  },

  {
    id: 'co2',
    formula: 'Co',
    charge: 2,
    name: 'Cobalt(II)',
    type: 'cation',
    family: 'Kim loại chuyển tiếp'
  },

  {
    id: 'ni2',
    formula: 'Ni',
    charge: 2,
    name: 'Nickel(II)',
    type: 'cation',
    family: 'Kim loại chuyển tiếp'
  },

  {
    id: 'mn2',
    formula: 'Mn',
    charge: 2,
    name: 'Manganese(II)',
    type: 'cation',
    family: 'Kim loại chuyển tiếp'
  },

  {
    id: 'pb2',
    formula: 'Pb',
    charge: 2,
    name: 'Lead(II)',
    type: 'cation',
    family: 'Kim loại',
    solubilityId: 'pb'
  },

  {
    id: 'sn2',
    formula: 'Sn',
    charge: 2,
    name: 'Tin(II)',
    type: 'cation',
    family: 'Kim loại'
  },

  {
    id: 'hg2',
    formula: 'Hg',
    charge: 2,
    name: 'Mercury(II)',
    type: 'cation',
    family: 'Kim loại'
  },


  /* =====================================================
     CATIONS +3
  ===================================================== */

  {
    id: 'al',
    formula: 'Al',
    charge: 3,
    name: 'Aluminium',
    type: 'cation',
    family: 'Kim loại',
    solubilityId: 'al'
  },

  {
    id: 'fe3',
    formula: 'Fe',
    charge: 3,
    name: 'Iron(III)',
    type: 'cation',
    family: 'Kim loại chuyển tiếp',
    solubilityId: 'fe3'
  },

  {
    id: 'cr3',
    formula: 'Cr',
    charge: 3,
    name: 'Chromium(III)',
    type: 'cation',
    family: 'Kim loại chuyển tiếp'
  },

  {
    id: 'co3',
    formula: 'Co',
    charge: 3,
    name: 'Cobalt(III)',
    type: 'cation',
    family: 'Kim loại chuyển tiếp'
  },

  {
    id: 'au3',
    formula: 'Au',
    charge: 3,
    name: 'Gold(III)',
    type: 'cation',
    family: 'Kim loại chuyển tiếp'
  },

  {
    id: 'sc3',
    formula: 'Sc',
    charge: 3,
    name: 'Scandium',
    type: 'cation',
    family: 'Kim loại chuyển tiếp'
  },


  /* =====================================================
     OTHER CATIONS
  ===================================================== */

  {
    id: 'ti4',
    formula: 'Ti',
    charge: 4,
    name: 'Titanium(IV)',
    type: 'cation',
    family: 'Kim loại chuyển tiếp'
  },

  {
    id: 'sn4',
    formula: 'Sn',
    charge: 4,
    name: 'Tin(IV)',
    type: 'cation',
    family: 'Kim loại'
  },

  {
    id: 'pb4',
    formula: 'Pb',
    charge: 4,
    name: 'Lead(IV)',
    type: 'cation',
    family: 'Kim loại'
  },


  /* =====================================================
     ANIONS -1
  ===================================================== */

  {
    id: 'f',
    formula: 'F',
    charge: -1,
    name: 'Fluoride',
    type: 'anion',
    family: 'Halide'
  },

  {
    id: 'cl',
    formula: 'Cl',
    charge: -1,
    name: 'Chloride',
    type: 'anion',
    family: 'Halide',
    solubilityId: 'cl'
  },

  {
    id: 'br',
    formula: 'Br',
    charge: -1,
    name: 'Bromide',
    type: 'anion',
    family: 'Halide',
    solubilityId: 'br'
  },

  {
    id: 'i',
    formula: 'I',
    charge: -1,
    name: 'Iodide',
    type: 'anion',
    family: 'Halide',
    solubilityId: 'i'
  },

  {
    id: 'oh',
    formula: 'OH',
    charge: -1,
    name: 'Hydroxide',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true,
    solubilityId: 'oh'
  },

  {
    id: 'no3',
    formula: 'NO3',
    charge: -1,
    name: 'Nitrate',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true,
    solubilityId: 'no3'
  },

  {
    id: 'no2',
    formula: 'NO2',
    charge: -1,
    name: 'Nitrite',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true
  },

  {
    id: 'hco3',
    formula: 'HCO3',
    charge: -1,
    name: 'Hydrogen carbonate',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true
  },

  {
    id: 'h2po4',
    formula: 'H2PO4',
    charge: -1,
    name: 'Dihydrogen phosphate',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true
  },

  {
    id: 'cn',
    formula: 'CN',
    charge: -1,
    name: 'Cyanide',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true
  },

  {
    id: 'scn',
    formula: 'SCN',
    charge: -1,
    name: 'Thiocyanate',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true
  },

  {
    id: 'mno4',
    formula: 'MnO4',
    charge: -1,
    name: 'Permanganate',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true
  },

  {
    id: 'clo',
    formula: 'ClO',
    charge: -1,
    name: 'Hypochlorite',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true
  },

  {
    id: 'clo3',
    formula: 'ClO3',
    charge: -1,
    name: 'Chlorate',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true
  },

  {
    id: 'clo4',
    formula: 'ClO4',
    charge: -1,
    name: 'Perchlorate',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true
  },

  {
    id: 'ch3coo',
    formula: 'CH3COO',
    charge: -1,
    name: 'Acetate',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true
  },


  /* =====================================================
     ANIONS -2
  ===================================================== */

  {
    id: 'o',
    formula: 'O',
    charge: -2,
    name: 'Oxide',
    type: 'anion',
    family: 'Anion -2'
  },

  {
    id: 's',
    formula: 'S',
    charge: -2,
    name: 'Sulfide',
    type: 'anion',
    family: 'Anion -2',
    solubilityId: 's'
  },

  {
    id: 'so4',
    formula: 'SO4',
    charge: -2,
    name: 'Sulfate',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true,
    solubilityId: 'so4'
  },

  {
    id: 'so3',
    formula: 'SO3',
    charge: -2,
    name: 'Sulfite',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true
  },

  {
    id: 'co3a',
    formula: 'CO3',
    charge: -2,
    name: 'Carbonate',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true,
    solubilityId: 'co3'
  },

  {
    id: 'hpo4',
    formula: 'HPO4',
    charge: -2,
    name: 'Hydrogen phosphate',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true
  },

  {
    id: 'cro4',
    formula: 'CrO4',
    charge: -2,
    name: 'Chromate',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true
  },

  {
    id: 'cr2o7',
    formula: 'Cr2O7',
    charge: -2,
    name: 'Dichromate',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true
  },

  {
    id: 'c2o4',
    formula: 'C2O4',
    charge: -2,
    name: 'Oxalate',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true
  },


  /* =====================================================
     ANIONS -3
  ===================================================== */

  {
    id: 'n',
    formula: 'N',
    charge: -3,
    name: 'Nitride',
    type: 'anion',
    family: 'Anion -3'
  },

  {
    id: 'p',
    formula: 'P',
    charge: -3,
    name: 'Phosphide',
    type: 'anion',
    family: 'Anion -3'
  },

  {
    id: 'po4',
    formula: 'PO4',
    charge: -3,
    name: 'Phosphate',
    type: 'anion',
    family: 'Ion đa nguyên tử',
    polyatomic: true,
    solubilityId: 'po4'
  }

]


/* =========================================================
   INIT
========================================================= */

export function initIonEngine() {

  const tools =
    document.querySelector(
      '#tools'
    )


  if (!tools) {
    return
  }


  document
    .querySelector(
      '#ion-engine'
    )
    ?.remove()


  let filter =
    'all'


  let query =
    ''


  let selectedCation =
    IONS.find(
      ion =>
        ion.id ===
        'na'
    )


  let selectedAnion =
    IONS.find(
      ion =>
        ion.id ===
        'cl'
    )


  let activeIon =
    selectedCation


  tools.insertAdjacentHTML(
    'beforeend',
    `
      <section
        id="ion-engine"
        class="ion-engine"
      >

        <!-- ===============================================
             HEADER
        ================================================ -->

        <div class="ion-head">

          <div>

            <span class="ion-eyebrow">
              ION ENGINE
            </span>

            <h2>
              Không gian ion
            </h2>

            <p>
              Tra cứu ion, điện tích và tự động ghép
              ion để tạo công thức hợp chất trung hòa.
            </p>

          </div>


          <div class="ion-engine-status">

            <i></i>

            <span>
              ${IONS.length} ion
            </span>

          </div>

        </div>


        <!-- ===============================================
             MAIN
        ================================================ -->

        <div class="ion-layout">


          <!-- =============================================
               LIBRARY
          ============================================== -->

          <div class="ion-library">

            <div class="ion-library-top">

              <label class="ion-search">

                <span>
                  ⌕
                </span>

                <input
                  id="ion-search"
                  type="search"
                  placeholder="Tìm Na⁺, sulfate, Fe..."
                  autocomplete="off"
                >

              </label>


              <div
                class="ion-filter"
                id="ion-filter"
              >

                <button
                  class="active"
                  type="button"
                  data-ion-filter="all"
                >
                  Tất cả
                </button>

                <button
                  type="button"
                  data-ion-filter="cation"
                >
                  Cation
                </button>

                <button
                  type="button"
                  data-ion-filter="anion"
                >
                  Anion
                </button>

              </div>

            </div>


            <div class="ion-library-count">

              <span>
                THƯ VIỆN ION
              </span>

              <strong id="ion-result-count">
                ${IONS.length}
              </strong>

            </div>


            <div
              id="ion-grid"
              class="ion-grid"
            ></div>

          </div>


          <!-- =============================================
               RIGHT
          ============================================== -->

          <aside class="ion-workspace">


            <!-- ===========================================
                 SELECTED ION
            ============================================ -->

            <div
              id="ion-detail"
              class="ion-detail"
            ></div>


            <!-- ===========================================
                 BUILDER
            ============================================ -->

            <div class="compound-builder">

              <div class="compound-builder-head">

                <span>
                  TẠO HỢP CHẤT
                </span>

                <h3>
                  Ghép ion
                </h3>

                <p>
                  ChemLab tự cân bằng tổng điện tích
                  để tạo công thức trung hòa.
                </p>

              </div>


              <div class="ion-pair">

                <button
                  id="selected-cation"
                  type="button"
                  class="selected-ion cation"
                ></button>


                <span class="ion-plus">
                  ＋
                </span>


                <button
                  id="selected-anion"
                  type="button"
                  class="selected-ion anion"
                ></button>

              </div>


              <div
                id="compound-result"
                class="compound-result"
              ></div>


              <button
                id="ion-to-solubility"
                class="ion-to-solubility"
                type="button"
              >
                Xem trong bảng tính tan →
              </button>


              <p
                id="ion-solubility-note"
                class="ion-solubility-note"
              ></p>

            </div>

          </aside>

        </div>

      </section>
    `
  )


  const ionGrid =
    tools.querySelector(
      '#ion-grid'
    )


  const searchInput =
    tools.querySelector(
      '#ion-search'
    )


  const filterHost =
    tools.querySelector(
      '#ion-filter'
    )


  /* =====================================================
     RENDER
  ===================================================== */

  renderGrid()

  renderDetail()

  renderCompound()


  /* =====================================================
     SEARCH
  ===================================================== */

  searchInput.addEventListener(
    'input',
    () => {

      query =
        searchInput.value
          .trim()
          .toLowerCase()


      renderGrid()

    }
  )


  /* =====================================================
     FILTER
  ===================================================== */

  filterHost.addEventListener(
    'click',
    event => {

      const button =
        event.target.closest(
          '[data-ion-filter]'
        )


      if (!button) {
        return
      }


      filter =
        button.dataset
          .ionFilter


      filterHost
        .querySelectorAll(
          '[data-ion-filter]'
        )
        .forEach(
          item => {

            item.classList.toggle(
              'active',
              item === button
            )

          }
        )


      renderGrid()

    }
  )


  /* =====================================================
     ION CLICK
  ===================================================== */

  ionGrid.addEventListener(
    'click',
    event => {

      const button =
        event.target.closest(
          '[data-ion-id]'
        )


      if (!button) {
        return
      }


      const ion =
        IONS.find(
          item =>
            item.id ===
            button.dataset
              .ionId
        )


      if (!ion) {
        return
      }


      activeIon =
        ion


      if (
        ion.type ===
        'cation'
      ) {

        selectedCation =
          ion

      }

      else {

        selectedAnion =
          ion

      }


      renderGrid()

      renderDetail()

      renderCompound()

    }
  )


  /* =====================================================
     SELECTED BUTTONS
  ===================================================== */

  tools
    .querySelector(
      '#selected-cation'
    )
    .addEventListener(
      'click',
      () => {

        filter =
          'cation'


        query =
          ''


        searchInput.value =
          ''


        syncFilterButtons()

        renderGrid()

        tools
          .querySelector(
            '#ion-engine'
          )
          .scrollIntoView({

            behavior:
              'smooth',

            block:
              'start'

          })

      }
    )


  tools
    .querySelector(
      '#selected-anion'
    )
    .addEventListener(
      'click',
      () => {

        filter =
          'anion'


        query =
          ''


        searchInput.value =
          ''


        syncFilterButtons()

        renderGrid()

        tools
          .querySelector(
            '#ion-engine'
          )
          .scrollIntoView({

            behavior:
              'smooth',

            block:
              'start'

          })

      }
    )


  /* =====================================================
     SOLUBILITY LINK
  ===================================================== */

  tools
    .querySelector(
      '#ion-to-solubility'
    )
    .addEventListener(
      'click',
      openSolubility
    )


  /* =====================================================
     GRID
  ===================================================== */

  function renderGrid() {

    const visible =
      IONS.filter(
        ion => {

          const typeMatch =
            filter ===
              'all' ||
            ion.type ===
              filter


          const searchText =
            [
              ion.formula,
              ion.name,
              ion.family,
              chargeText(
                ion.charge
              )
            ]
              .join(' ')
              .toLowerCase()


          const searchMatch =
            !query ||
            searchText.includes(
              query
            )


          return (
            typeMatch &&
            searchMatch
          )

        }
      )


    tools
      .querySelector(
        '#ion-result-count'
      )
      .textContent =
      visible.length


    if (
      visible.length === 0
    ) {

      ionGrid.innerHTML = `
        <div class="ion-empty">

          <strong>
            Không tìm thấy ion
          </strong>

          <span>
            Thử từ khóa khác hoặc đổi bộ lọc.
          </span>

        </div>
      `


      return

    }


    ionGrid.innerHTML =
      visible
        .map(
          ion => {

            const selected =
              ion.id ===
                selectedCation?.id ||
              ion.id ===
                selectedAnion?.id


            return `
              <button
                type="button"
                class="
                  ion-card
                  ${ion.type}
                  ${
                    selected
                      ? 'selected'
                      : ''
                  }
                "
                data-ion-id="${ion.id}"
              >

                <span class="ion-card-type">

                  ${
                    ion.type ===
                    'cation'
                      ? 'CATION'
                      : 'ANION'
                  }

                </span>


                <strong class="ion-card-formula">
                  ${ionFormulaHTML(ion)}
                </strong>


                <span class="ion-card-name">
                  ${ion.name}
                </span>


                <small>
                  ${ion.family}
                </small>

              </button>
            `

          }
        )
        .join('')

  }


  /* =====================================================
     DETAIL
  ===================================================== */

  function renderDetail() {

    const host =
      tools.querySelector(
        '#ion-detail'
      )


    const electronCount =
      calculateElectronCount(
        activeIon
      )


    const mass =
      calculateMolarMass(
        activeIon.formula
      )


    const atoms =
      countAtoms(
        activeIon.formula
      )


    host.innerHTML = `
      <div class="ion-detail-head">

        <div>

          <span>
            ION ĐANG CHỌN
          </span>

          <h3>
            ${activeIon.name}
          </h3>

        </div>


        <strong
          class="
            ion-detail-symbol
            ${activeIon.type}
          "
        >
          ${ionFormulaHTML(activeIon)}
        </strong>

      </div>


      <div class="ion-detail-grid">

        <div>

          <span>
            Điện tích
          </span>

          <strong>
            ${chargeText(
              activeIon.charge
            )}
          </strong>

        </div>


        <div>

          <span>
            Loại
          </span>

          <strong>
            ${
              activeIon.type ===
              'cation'
                ? 'Cation'
                : 'Anion'
            }
          </strong>

        </div>


        <div>

          <span>
            Electron
          </span>

          <strong>
            ${
              Number.isFinite(
                electronCount
              )
                ? electronCount
                : '—'
            }
          </strong>

        </div>


        <div>

          <span>
            Khối lượng mol
          </span>

          <strong>
            ${
              Number.isFinite(
                mass
              )
                ? `${formatNumber(
                    mass,
                    3
                  )} g/mol`
                : '—'
            }
          </strong>

        </div>

      </div>


      <div class="ion-composition">

        <span>
          THÀNH PHẦN
        </span>

        <div>

          ${
            Object
              .entries(atoms)
              .map(
                ([symbol,count]) => `
                  <b>
                    ${symbol}
                    ${
                      count > 1
                        ? `<sub>${count}</sub>`
                        : ''
                    }
                  </b>
                `
              )
              .join('')
          }

        </div>

      </div>


      <p class="ion-detail-note">

        ${
          activeIon.charge > 0

            ? `Ion này có điện tích dương vì đã mất
               ${activeIon.charge}
               electron so với trạng thái trung hòa.`

            : `Ion này có điện tích âm vì đã nhận thêm
               ${Math.abs(
                 activeIon.charge
               )}
               electron so với trạng thái trung hòa.`
        }

      </p>
    `

  }


  /* =====================================================
     COMPOUND
  ===================================================== */

  function renderCompound() {

    const cationButton =
      tools.querySelector(
        '#selected-cation'
      )


    const anionButton =
      tools.querySelector(
        '#selected-anion'
      )


    cationButton.innerHTML =
      selectedIonHTML(
        selectedCation
      )


    anionButton.innerHTML =
      selectedIonHTML(
        selectedAnion
      )


    const result =
      buildCompound(
        selectedCation,
        selectedAnion
      )


    const host =
      tools.querySelector(
        '#compound-result'
      )


    host.innerHTML = `
      <div class="compound-result-label">
        HỢP CHẤT TRUNG HÒA
      </div>


      <strong class="compound-formula">
        ${result.html}
      </strong>


      <div class="compound-balance">

        <div>

          <span>
            Tỉ lệ ion
          </span>

          <strong>
            ${result.cationCount}
            :
            ${result.anionCount}
          </strong>

        </div>


        <div>

          <span>
            Tổng điện tích +
          </span>

          <strong>
            +${result.positiveCharge}
          </strong>

        </div>


        <div>

          <span>
            Tổng điện tích −
          </span>

          <strong>
            −${result.negativeCharge}
          </strong>

        </div>

      </div>


      <div class="compound-equation">

        ${result.cationCount}
        ×
        ${chargeText(
          selectedCation.charge
        )}

        <span>
          ＋
        </span>

        ${result.anionCount}
        ×
        ${chargeText(
          selectedAnion.charge
        )}

        <span>
          ＝
        </span>

        0

      </div>
    `


    updateSolubilityButton()

  }


  /* =====================================================
     SOLUBILITY BUTTON
  ===================================================== */

  function updateSolubilityButton() {

    const button =
      tools.querySelector(
        '#ion-to-solubility'
      )


    const note =
      tools.querySelector(
        '#ion-solubility-note'
      )


    const supported =
      Boolean(
        selectedCation
          .solubilityId &&
        selectedAnion
          .solubilityId
      )


    button.disabled =
      !supported


    if (supported) {

      note.textContent =
        'Cặp ion này có trong bảng tính tan của ChemLab.'

    }

    else {

      note.textContent =
        'Bảng tính tan hiện chưa có đầy đủ cặp ion này.'

    }

  }


  /* =====================================================
     OPEN SOLUBILITY
  ===================================================== */

  function openSolubility() {

    if (
      !selectedCation
        .solubilityId ||
      !selectedAnion
        .solubilityId
    ) {
      return
    }


    const cationSelect =
      document.querySelector(
        '#sol-cation'
      )


    const anionSelect =
      document.querySelector(
        '#sol-anion'
      )


    const solubilityTool =
      document.querySelector(
        '#solubility-tool'
      )


    if (
      !cationSelect ||
      !anionSelect ||
      !solubilityTool
    ) {
      return
    }


    cationSelect.value =
      selectedCation
        .solubilityId


    anionSelect.value =
      selectedAnion
        .solubilityId


    cationSelect.dispatchEvent(
      new Event(
        'change',
        {
          bubbles: true
        }
      )
    )


    anionSelect.dispatchEvent(
      new Event(
        'change',
        {
          bubbles: true
        }
      )
    )


    solubilityTool
      .scrollIntoView({

        behavior:
          'smooth',

        block:
          'start'

      })

  }


  /* =====================================================
     FILTER BUTTON SYNC
  ===================================================== */

  function syncFilterButtons() {

    filterHost
      .querySelectorAll(
        '[data-ion-filter]'
      )
      .forEach(
        button => {

          button.classList.toggle(
            'active',

            button.dataset
              .ionFilter ===
            filter
          )

        }
      )

  }

}


/* =========================================================
   SELECTED ION HTML
========================================================= */

function selectedIonHTML(
  ion
) {

  return `
    <span>
      ${
        ion.type ===
        'cation'
          ? 'CATION'
          : 'ANION'
      }
    </span>

    <strong>
      ${ionFormulaHTML(ion)}
    </strong>

    <small>
      ${ion.name}
    </small>
  `

}


/* =========================================================
   BUILD COMPOUND
========================================================= */

function buildCompound(
  cation,
  anion
) {

  const positive =
    Math.abs(
      cation.charge
    )


  const negative =
    Math.abs(
      anion.charge
    )


  const divisor =
    gcd(
      positive,
      negative
    )


  const cationCount =
    negative /
    divisor


  const anionCount =
    positive /
    divisor


  const cationHTML =
    formulaWithCount(
      cation,
      cationCount
    )


  const anionHTML =
    formulaWithCount(
      anion,
      anionCount
    )


  return {

    cationCount,

    anionCount,

    positiveCharge:
      cationCount *
      positive,

    negativeCharge:
      anionCount *
      negative,

    html:
      cationHTML +
      anionHTML

  }

}


/* =========================================================
   FORMULA COUNT
========================================================= */

function formulaWithCount(
  ion,
  count
) {

  const formula =
    formulaHTML(
      ion.formula
    )


  if (
    count === 1
  ) {

    return formula

  }


  if (
    ion.polyatomic
  ) {

    return `
      (${formula})<sub>${count}</sub>
    `

  }


  return `
    ${formula}<sub>${count}</sub>
  `

}


/* =========================================================
   ION FORMULA
========================================================= */

function ionFormulaHTML(
  ion
) {

  const charge =
    Math.abs(
      ion.charge
    )


  const sign =
    ion.charge > 0
      ? '+'
      : '−'


  return `
    ${formulaHTML(
      ion.formula
    )}

    <sup>
      ${
        charge === 1
          ? sign
          : `${charge}${sign}`
      }
    </sup>
  `

}


/* =========================================================
   FORMULA HTML
========================================================= */

function formulaHTML(
  formula
) {

  return String(
    formula
  )
    .replace(
      /(\d+)/g,
      '<sub>$1</sub>'
    )

}


/* =========================================================
   CHARGE TEXT
========================================================= */

function chargeText(
  charge
) {

  if (
    charge > 0
  ) {

    return `+${charge}`

  }


  return String(
    charge
  )

}


/* =========================================================
   ELECTRON COUNT
========================================================= */

function calculateElectronCount(
  ion
) {

  const atoms =
    countAtoms(
      ion.formula
    )


  let electrons =
    0


  for (
    const [
      symbol,
      amount
    ]
    of Object.entries(
      atoms
    )
  ) {

    const atomic =
      ATOMIC_DATA.get(
        symbol
      )


    if (!atomic) {
      return NaN
    }


    electrons +=
      atomic.number *
      amount

  }


  return (
    electrons -
    ion.charge
  )

}


/* =========================================================
   MOLAR MASS
========================================================= */

function calculateMolarMass(
  formula
) {

  const atoms =
    countAtoms(
      formula
    )


  let total =
    0


  for (
    const [
      symbol,
      amount
    ]
    of Object.entries(
      atoms
    )
  ) {

    const atomic =
      ATOMIC_DATA.get(
        symbol
      )


    if (
      !atomic ||
      !Number.isFinite(
        atomic.mass
      )
    ) {
      return NaN
    }


    total +=
      atomic.mass *
      amount

  }


  return total

}


/* =========================================================
   COUNT ATOMS
========================================================= */

function countAtoms(
  formula
) {

  const result =
    {}


  const regex =
    /([A-Z][a-z]?)(\d*)/g


  let match


  while (
    (
      match =
        regex.exec(
          formula
        )
    )
  ) {

    const symbol =
      match[1]


    const amount =
      match[2]
        ? Number(
            match[2]
          )
        : 1


    result[
      symbol
    ] =
      (
        result[
          symbol
        ] ||
        0
      ) +
      amount

  }


  return result

}


/* =========================================================
   ATOMIC DATA
========================================================= */

function buildAtomicData() {

  const map =
    new Map()


  elements
    .forEach(
      (
        raw,
        index
      ) => {

        let number

        let symbol

        let mass


        if (
          Array.isArray(
            raw
          )
        ) {

          number =
            Number(
              raw[0] ??
              index + 1
            )


          symbol =
            raw[1]


          mass =
            raw[3]

        }

        else {

          number =
            Number(
              raw.number ??
              raw.atomicNumber ??
              raw.atomic_number ??
              index + 1
            )


          symbol =
            raw.symbol


          mass =
            raw.mass ??
            raw.atomicMass ??
            raw.atomic_mass

        }


        if (!symbol) {
          return
        }


        const massMatch =
          String(
            mass
          )
            .replace(
              ',',
              '.'
            )
            .match(
              /\d+(?:\.\d+)?/
            )


        map.set(
          symbol,
          {

            number,

            mass:
              massMatch
                ? Number(
                    massMatch[0]
                  )
                : NaN

          }
        )

      }
    )


  return map

}


/* =========================================================
   GCD
========================================================= */

function gcd(
  a,
  b
) {

  a =
    Math.abs(
      a
    )


  b =
    Math.abs(
      b
    )


  while (b) {

    const temp =
      b


    b =
      a %
      b


    a =
      temp

  }


  return a

}


/* =========================================================
   NUMBER
========================================================= */

function formatNumber(
  value,
  decimals
) {

  return Number(
    value.toFixed(
      decimals
    )
  )
    .toLocaleString(
      'vi-VN',
      {
        maximumFractionDigits:
          decimals
      }
    )

}