import { APP_VERSION } from './appMeta.js'

import {
  elements
} from './data/elements.js'

import './periodicV5.css'
import './periodicV5Readable.css'
import './periodicPhase3.css'


/* =========================================================
   CHEMLAB 5.0
   PERIODIC WORKSPACE
   STABLE CORE BUILD
========================================================= */

const STORAGE_KEY =
  'chemlab-v5-periodic'


/* =========================================================
   OPTIONAL MODULE CACHE

   Các module phụ KHÔNG được phép làm chết bảng tuần hoàn.
========================================================= */

let periodicDataAPI =
  null


let periodicDataPromise =
  null


function loadPeriodicData() {

  if (
    periodicDataAPI
  ) {

    return Promise.resolve(
      periodicDataAPI
    )

  }


  if (
    periodicDataPromise
  ) {

    return periodicDataPromise

  }


  periodicDataPromise =
    import(
      './periodicDataV5.js'
    )
      .then(
        module => {

          periodicDataAPI =
            module


          return module

        }
      )
      .catch(
        error => {

          console.error(
            '[ChemLab] periodicDataV5:',
            error
          )


          return null

        }
      )


  return periodicDataPromise

}


/* =========================================================
   CATEGORY
========================================================= */

const CATEGORY_META = {

  alkali: {
    label:
      'Kim loại kiềm',

    color:
      '#fb7185'
  },

  alkaline: {
    label:
      'Kiềm thổ',

    color:
      '#f59e0b'
  },

  transition: {
    label:
      'Kim loại chuyển tiếp',

    color:
      '#38bdf8'
  },

  postTransition: {
    label:
      'Kim loại sau chuyển tiếp',

    color:
      '#818cf8'
  },

  metalloid: {
    label:
      'Á kim',

    color:
      '#2dd4bf'
  },

  nonmetal: {
    label:
      'Phi kim',

    color:
      '#4ade80'
  },

  halogen: {
    label:
      'Halogen',

    color:
      '#22d3ee'
  },

  noble: {
    label:
      'Khí hiếm',

    color:
      '#a78bfa'
  },

  lanthanide: {
    label:
      'Lantan',

    color:
      '#f472b6'
  },

  actinide: {
    label:
      'Actini',

    color:
      '#fb923c'
  },

  unknown: {
    label:
      'Khác',

    color:
      '#94a3b8'
  }

}


/* =========================================================
   STATES
========================================================= */

const GAS_ELEMENTS =
  new Set([
    1,
    2,
    7,
    8,
    9,
    10,
    17,
    18,
    36,
    54,
    86
  ])


const LIQUID_ELEMENTS =
  new Set([
    35,
    80
  ])


/* =========================================================
   POSITIONS
========================================================= */

const PERIOD_ROWS = {

  1: {
    1: 1,
    2: 18
  },

  2: {
    3: 1,
    4: 2,
    5: 13,
    6: 14,
    7: 15,
    8: 16,
    9: 17,
    10: 18
  },

  3: {
    11: 1,
    12: 2,
    13: 13,
    14: 14,
    15: 15,
    16: 16,
    17: 17,
    18: 18
  },

  4:
    sequentialRow(
      19,
      36
    ),

  5:
    sequentialRow(
      37,
      54
    ),

  6: {

    55: 1,

    56: 2,

    ...sequentialRow(
      72,
      86,
      4
    )

  },

  7: {

    87: 1,

    88: 2,

    ...sequentialRow(
      104,
      118,
      4
    )

  }

}


/* =========================================================
   ELECTRON FILLING ORDER
========================================================= */

const ORBITAL_ORDER = [

  ['1s',2],
  ['2s',2],
  ['2p',6],

  ['3s',2],
  ['3p',6],

  ['4s',2],
  ['3d',10],
  ['4p',6],

  ['5s',2],
  ['4d',10],
  ['5p',6],

  ['6s',2],
  ['4f',14],
  ['5d',10],
  ['6p',6],

  ['7s',2],
  ['5f',14],
  ['6d',10],
  ['7p',6]

]


/* =========================================================
   ELEMENT DATABASE
========================================================= */

const ELEMENTS =
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
    .filter(Boolean)


const ELEMENT_MAP =
  new Map(
    ELEMENTS.map(
      element => [
        element.number,
        element
      ]
    )
  )


/* =========================================================
   MAIN INIT
========================================================= */

export function initPeriodicWorkspace({
  root,
  drawer
} = {}) {

  root ??=
    document.querySelector(
      '#periodic-workspace-root'
    )


  drawer ??=
    document.querySelector(
      '#element-drawer'
    )


  if (
    !root ||
    !drawer
  ) {

    console.error(
      '[ChemLab] Periodic Workspace không tìm thấy root hoặc drawer.'
    )


    return

  }


  /* =====================================================
     RESET OLD DRAWER
  ===================================================== */

  resetOldDrawer(
    drawer
  )


  /* =====================================================
     STATE
  ===================================================== */

  const preferences =
    readPreferences()


  const state = {

    search:
      '',

    category:
      'all',

    layout:
      preferences.layout ===
        'compact'
        ? 'compact'
        : 'standard',

    colorMode:
      [
        'category',
        'block',
        'state'
      ].includes(
        preferences.colorMode
      )
        ? preferences.colorMode
        : 'category',

    currentElement:
      null,

    tab:
      'overview',

    compare:
      null

  }


  /* =====================================================
     ROOT HTML
  ===================================================== */

  root.innerHTML = `
    <section class="pv5">

      <header class="pv5-head">

        <div>

          <span class="pv5-eyebrow">
            PERIODIC EXPLORER
          </span>


          <h1>
            Bảng tuần hoàn
          </h1>


          <p>
            Khám phá 118 nguyên tố,
            cấu hình electron, ion,
            đồng vị và mô hình 3D.
          </p>

        </div>


        <div class="pv5-head-stats">

          ${headerStat(
            '118',
            'nguyên tố'
          )}

          ${headerStat(
            '7',
            'chu kỳ'
          )}

          ${headerStat(
            '18',
            'nhóm'
          )}

        </div>

      </header>


      <section class="pv5-toolbar">

        <label class="pv5-search">

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >

            <circle
              cx="11"
              cy="11"
              r="7"
            />

            <path
              d="m20 20-3.7-3.7"
            />

          </svg>


          <input
            id="periodic-search"
            type="search"
            autocomplete="off"
            placeholder="Tìm H, Oxygen, 8..."
            aria-label="Tìm nguyên tố"
          >


          <kbd>
            /
          </kbd>

        </label>


        <div
          class="pv5-segmented"
          data-layout-controls
        >

          <button
            type="button"
            data-layout="standard"
          >
            Tiêu chuẩn
          </button>


          <button
            type="button"
            data-layout="compact"
          >
            Gọn
          </button>

        </div>


        <div
          class="pv5-segmented"
          data-color-controls
        >

          <button
            type="button"
            data-color="category"
          >
            Loại
          </button>


          <button
            type="button"
            data-color="block"
          >
            Block
          </button>


          <button
            type="button"
            data-color="state"
          >
            Trạng thái
          </button>

        </div>

      </section>


      <div
        class="pv5-category-filter"
        id="periodic-category-filter"
      ></div>


      <div class="pv5-result-bar">

        <span>
          HIỂN THỊ
        </span>


        <strong id="periodic-result-count">
          118 nguyên tố
        </strong>


        <button
          type="button"
          id="periodic-reset"
        >
          Đặt lại bộ lọc
        </button>

      </div>


      <section
        class="
          pv5-table-shell
          ${state.layout}
        "
        id="periodic-table-shell"
      >

        <div
          class="pv5-main-table"
          id="periodic-main-table"
        ></div>


        <div class="pv5-fblock-divider">

          <span>
            KHỐI f
          </span>

          <i></i>

        </div>


        <div
          class="pv5-f-table"
          id="periodic-f-table"
        ></div>

      </section>


      <footer class="pv5-legend">

        <div>

          <span>
            CHÚ THÍCH
          </span>

          <strong>
            Màu theo
            <b id="periodic-legend-mode">
              loại nguyên tố
            </b>
          </strong>

        </div>


        <div
          class="pv5-legend-items"
          id="periodic-legend"
        ></div>

      </footer>

    </section>
  `


  /* =====================================================
     DOM REFERENCES
  ===================================================== */

  const searchInput =
    root.querySelector(
      '#periodic-search'
    )


  const categoryRoot =
    root.querySelector(
      '#periodic-category-filter'
    )


  const resultLabel =
    root.querySelector(
      '#periodic-result-count'
    )


  const mainTable =
    root.querySelector(
      '#periodic-main-table'
    )


  const fTable =
    root.querySelector(
      '#periodic-f-table'
    )


  const tableShell =
    root.querySelector(
      '#periodic-table-shell'
    )


  const resetButton =
    root.querySelector(
      '#periodic-reset'
    )


  /* =====================================================
     SAFE FIRST RENDER

     Core render trước.
     Không gọi bất kỳ module phụ nào.
  ===================================================== */

  renderCategories()

  renderPeriodicTable()

  renderLegend()

  syncControls()


  /* =====================================================
     SEARCH
  ===================================================== */

  searchInput
    .addEventListener(
      'input',
      () => {

        state.search =
          normalizeText(
            searchInput.value
          )


        renderPeriodicTable()

      }
    )


  searchInput
    .addEventListener(
      'keydown',
      event => {

        if (
          event.key !==
          'Enter'
        ) {

          return

        }


        const first =
          root.querySelector(
            '.workspace-element-card:not([hidden])'
          )


        first?.click()

      }
    )


  /* =====================================================
     CATEGORY
  ===================================================== */

  categoryRoot
    .addEventListener(
      'click',
      event => {

        const button =
          event.target.closest(
            '[data-category]'
          )


        if (!button) {
          return
        }


        state.category =
          button.dataset
            .category


        renderCategories()

        renderPeriodicTable()

      }
    )


  /* =====================================================
     LAYOUT
  ===================================================== */

  root
    .querySelector(
      '[data-layout-controls]'
    )
    .addEventListener(
      'click',
      event => {

        const button =
          event.target.closest(
            '[data-layout]'
          )


        if (!button) {
          return
        }


        state.layout =
          button.dataset
            .layout


        tableShell.classList
          .remove(
            'standard',
            'compact'
          )


        tableShell.classList
          .add(
            state.layout
          )


        savePreferences()

        syncControls()

      }
    )


  /* =====================================================
     COLOR MODE
  ===================================================== */

  root
    .querySelector(
      '[data-color-controls]'
    )
    .addEventListener(
      'click',
      event => {

        const button =
          event.target.closest(
            '[data-color]'
          )


        if (!button) {
          return
        }


        state.colorMode =
          button.dataset
            .color


        savePreferences()

        syncControls()

        renderPeriodicTable()

        renderLegend()

      }
    )


  /* =====================================================
     RESET
  ===================================================== */

  resetButton
    .addEventListener(
      'click',
      () => {

        state.search =
          ''


        state.category =
          'all'


        searchInput.value =
          ''


        renderCategories()

        renderPeriodicTable()

      }
    )


  /* =====================================================
     TABLE CLICK
  ===================================================== */

  root.addEventListener(
    'click',
    event => {

      /* SERIES */

      const series =
        event.target.closest(
          '[data-series]'
        )


      if (series) {

        jumpToSeries(
          series.dataset
            .series
        )


        return

      }


      /* ELEMENT */

      const card =
        event.target.closest(
          '.workspace-element-card[data-number]'
        )


      if (!card) {
        return
      }


      openElement(
        Number(
          card.dataset.number
        )
      )

    }
  )


  /* =====================================================
     DRAWER CLICK
  ===================================================== */

  drawer.addEventListener(
    'click',
    async event => {

      event.stopPropagation()


      /* CLOSE */

      if (
        event.target.closest(
          '[data-ew-close]'
        )
      ) {

        closeDrawer()

        return

      }


      /* TABS */

      const tab =
        event.target.closest(
          '[data-ew-tab]'
        )


      if (tab) {

        state.tab =
          tab.dataset
            .ewTab


        if (
          state.tab ===
            'ion' ||
          state.tab ===
            'isotope'
        ) {

          await loadPeriodicData()

        }


        renderDrawer()

        return

      }


      /* PREVIOUS */

      if (
        event.target.closest(
          '[data-ew-prev]'
        )
      ) {

        if (
          !state.currentElement
        ) {
          return
        }


        openElement(
          Math.max(
            1,
            state.currentElement.number -
            1
          )
        )


        return

      }


      /* NEXT */

      if (
        event.target.closest(
          '[data-ew-next]'
        )
      ) {

        if (
          !state.currentElement
        ) {
          return
        }


        openElement(
          Math.min(
            118,
            state.currentElement.number +
            1
          )
        )


        return

      }


      /* ATOM 3D */

      if (
        event.target.closest(
          '[data-ew-atom3d]'
        )
      ) {

        openAtom3DSafe(
          state.currentElement
        )


        return

      }


      /* ORBITAL */

      if (
        event.target.closest(
          '[data-ew-orbital3d]'
        )
      ) {

        openOrbital3DSafe(
          state.currentElement
        )


        return

      }


      /* PHASE 3 */

      const action =
        event.target.closest(
          '[data-ew-action]'
        )


      if (action) {

        await runQuickAction(
          action.dataset
            .ewAction
        )

      }

    }
  )


  /* =====================================================
     COMPARE
  ===================================================== */

  drawer.addEventListener(
    'change',
    event => {

      if (
        !event.target.matches(
          '[data-ew-compare-select]'
        )
      ) {

        return

      }


      state.compare =
        Number(
          event.target.value
        )


      renderDrawer()

    }
  )


  /* =====================================================
     ESCAPE
  ===================================================== */

  document.addEventListener(
    'keydown',
    event => {

      if (
        event.key ===
          'Escape' &&
        drawer.classList.contains(
          'open'
        )
      ) {

        closeDrawer()

      }


      if (
        event.key ===
          '/' &&
        !isTyping(
          event.target
        )
      ) {

        event.preventDefault()

        searchInput.focus()

      }

    }
  )


  /* =====================================================
     CATEGORIES
  ===================================================== */

  function renderCategories() {

    const counts =
      countCategories()


    const categories = [

      {
        id:
          'all',

        label:
          'Tất cả',

        color:
          '#a78bfa',

        count:
          ELEMENTS.length
      },

      ...Object
        .entries(
          CATEGORY_META
        )
        .filter(
          ([key]) =>
            key !==
            'unknown'
        )
        .filter(
          ([key]) =>
            counts[key] >
            0
        )
        .map(
          ([key,meta]) => ({

            id:
              key,

            label:
              meta.label,

            color:
              meta.color,

            count:
              counts[key]

          })
        )

    ]


    categoryRoot.innerHTML =
      categories
        .map(
          category => `
            <button
              type="button"
              class="
                pv5-filter-chip
                ${
                  state.category ===
                  category.id
                    ? 'active'
                    : ''
                }
              "
              data-category="${category.id}"
              style="
                --chip-color:
                ${category.color};
              "
            >

              <i></i>

              <span>
                ${category.label}
              </span>

              <b>
                ${category.count}
              </b>

            </button>
          `
        )
        .join('')

  }


  /* =====================================================
     PERIODIC TABLE
  ===================================================== */

  function renderPeriodicTable() {

    const visible =
      getVisibleElements()


    const visibleSet =
      new Set(
        visible.map(
          element =>
            element.number
        )
      )


    resultLabel.textContent =
      `${visible.length} nguyên tố`


    /* ===================================================
       MAIN TABLE
    =================================================== */

    const pieces =
      []


    /* GROUP NUMBERS */

    for (
      let group =
        1;

      group <=
        18;

      group++
    ) {

      pieces.push(`
        <span
          class="pv5-group-label"
          style="
            grid-column:
            ${group + 1};

            grid-row:
            1;
          "
        >
          ${group}
        </span>
      `)

    }


    /* PERIOD NUMBERS */

    for (
      let period =
        1;

      period <=
        7;

      period++
    ) {

      pieces.push(`
        <span
          class="pv5-period-label"
          style="
            grid-column:
            1;

            grid-row:
            ${period + 1};
          "
        >
          ${period}
        </span>
      `)

    }


    /* ELEMENTS */

    for (
      const element
      of ELEMENTS
    ) {

      if (
        isFBlock(
          element.number
        )
      ) {

        continue

      }


      const position =
        findMainPosition(
          element.number
        )


      if (!position) {

        continue

      }


      pieces.push(
        createElementCard(
          element,
          visibleSet.has(
            element.number
          ),
          position.period +
          1,
          position.column +
          1
        )
      )

    }


    /* LANTHANIDE PLACEHOLDER */

    pieces.push(
      createSeriesCard({

        row:
          7,

        id:
          'lanthanide-row',

        range:
          '57–71',

        symbol:
          'La–Lu',

        label:
          'Dãy Lantan',

        color:
          CATEGORY_META
            .lanthanide
            .color

      })
    )


    /* ACTINIDE PLACEHOLDER */

    pieces.push(
      createSeriesCard({

        row:
          8,

        id:
          'actinide-row',

        range:
          '89–103',

        symbol:
          'Ac–Lr',

        label:
          'Dãy Actini',

        color:
          CATEGORY_META
            .actinide
            .color

      })
    )


    mainTable.innerHTML =
      pieces.join('')


    /* ===================================================
       F BLOCK
    =================================================== */

    const lanthanides =
      ELEMENTS.filter(
        element =>
          element.number >=
            57 &&
          element.number <=
            71
      )


    const actinides =
      ELEMENTS.filter(
        element =>
          element.number >=
            89 &&
          element.number <=
            103
      )


    fTable.innerHTML = `
      ${createFRow(
        'lanthanide-row',
        '57–71',
        'Dãy Lantan',
        lanthanides,
        visibleSet
      )}

      ${createFRow(
        'actinide-row',
        '89–103',
        'Dãy Actini',
        actinides,
        visibleSet
      )}
    `

  }


  /* =====================================================
     ELEMENT CARD
  ===================================================== */

  function createElementCard(
    element,
    visible,
    row = null,
    column = null
  ) {

    const color =
      getElementColor(
        element,
        state.colorMode
      )


    const grid =
      row &&
      column
        ? `
            grid-row:${row};
            grid-column:${column};
          `
        : ''


    return `
      <button
        type="button"
        class="
          workspace-element-card
          pv5-element
        "
        data-number="${element.number}"
        ${
          visible
            ? ''
            : 'hidden'
        }
        style="
          ${grid}

          --element-accent:
          ${color};
        "
        title="${element.name}"
      >

        <span class="pv5-element-number">
          ${element.number}
        </span>


        <strong class="pv5-element-symbol">
          ${element.symbol}
        </strong>


        <span class="pv5-element-name">
          ${element.name}
        </span>


        <small class="pv5-element-mass">
          ${formatMass(
            element.mass
          )}
        </small>


        <i class="pv5-element-glow"></i>

      </button>
    `

  }


  /* =====================================================
     F ROW
  ===================================================== */

  function createFRow(
    id,
    range,
    label,
    list,
    visibleSet
  ) {

    return `
      <div
        class="pv5-f-row"
        id="${id}"
      >

        <div class="pv5-f-label">

          <span>
            ${range}
          </span>

          <strong>
            ${label}
          </strong>

        </div>


        <div class="pv5-f-elements">

          ${
            list
              .map(
                element =>
                  createElementCard(
                    element,
                    visibleSet.has(
                      element.number
                    )
                  )
              )
              .join('')
          }

        </div>

      </div>
    `

  }


  /* =====================================================
     SERIES JUMP
  ===================================================== */

  function jumpToSeries(
    target
  ) {

    const row =
      root.querySelector(
        `#${target}`
      )


    if (!row) {
      return
    }


    row.scrollIntoView({

      behavior:
        prefersReducedMotion()
          ? 'auto'
          : 'smooth',

      block:
        'center',

      inline:
        'nearest'

    })


    row.classList
      .remove(
        'pv5-series-focus'
      )


    void row.offsetWidth


    row.classList
      .add(
        'pv5-series-focus'
      )


    setTimeout(
      () => {

        row.classList
          .remove(
            'pv5-series-focus'
          )

      },
      1500
    )

  }


  /* =====================================================
     LEGEND
  ===================================================== */

  function renderLegend() {

    const modeLabel =
      root.querySelector(
        '#periodic-legend-mode'
      )


    const host =
      root.querySelector(
        '#periodic-legend'
      )


    if (
      state.colorMode ===
      'block'
    ) {

      modeLabel.textContent =
        'block electron'


      host.innerHTML = `

        ${legend(
          '#60a5fa',
          'Block s'
        )}

        ${legend(
          '#4ade80',
          'Block p'
        )}

        ${legend(
          '#38bdf8',
          'Block d'
        )}

        ${legend(
          '#f472b6',
          'Block f'
        )}

      `


      return

    }


    if (
      state.colorMode ===
      'state'
    ) {

      modeLabel.textContent =
        'trạng thái'


      host.innerHTML = `

        ${legend(
          '#60a5fa',
          'Khí'
        )}

        ${legend(
          '#22d3ee',
          'Lỏng'
        )}

        ${legend(
          '#a78bfa',
          'Rắn'
        )}

      `


      return

    }


    modeLabel.textContent =
      'loại nguyên tố'


    host.innerHTML =
      Object
        .entries(
          CATEGORY_META
        )
        .filter(
          ([key]) =>
            key !==
            'unknown'
        )
        .map(
          ([,meta]) =>
            legend(
              meta.color,
              meta.label
            )
        )
        .join('')

  }


  /* =====================================================
     SYNC BUTTONS
  ===================================================== */

  function syncControls() {

    root
      .querySelectorAll(
        '[data-layout]'
      )
      .forEach(
        button => {

          button.classList.toggle(
            'active',
            button.dataset.layout ===
            state.layout
          )

        }
      )


    root
      .querySelectorAll(
        '[data-color]'
      )
      .forEach(
        button => {

          button.classList.toggle(
            'active',
            button.dataset.color ===
            state.colorMode
          )

        }
      )

  }


  /* =====================================================
     VISIBLE ELEMENTS
  ===================================================== */

  function getVisibleElements() {

    return ELEMENTS.filter(
      element => {

        const categoryMatches =
          state.category ===
            'all' ||
          element.categoryKey ===
            state.category


        if (
          !categoryMatches
        ) {

          return false

        }


        if (
          !state.search
        ) {

          return true

        }


        const searchable =
          normalizeText(
            [
              element.number,
              element.symbol,
              element.name,
              CATEGORY_META[
                element.categoryKey
              ]?.label
            ].join(' ')
          )


        return searchable
          .includes(
            state.search
          )

      }
    )

  }


  /* =====================================================
     OPEN DRAWER
  ===================================================== */

  async function openElement(
    number
  ) {

    const element =
      ELEMENT_MAP.get(
        number
      )


    if (!element) {
      return
    }


    state.currentElement =
      element


    state.tab =
      'overview'


    if (
      !state.compare ||
      state.compare ===
      number
    ) {

      state.compare =
        number <
        118
          ? number + 1
          : number - 1

    }


    renderDrawer()

    openBackdrop()


    drawer.classList
      .add(
        'open'
      )


    drawer.setAttribute(
      'aria-hidden',
      'false'
    )

  }


  /* =====================================================
     DRAWER
  ===================================================== */

  function renderDrawer() {

    const element =
      state.currentElement


    if (!element) {
      return
    }


    const category =
      CATEGORY_META[
        element.categoryKey
      ] ||
      CATEGORY_META
        .unknown


    const ions =
      safeIons(
        element
      )


    drawer.style
      .setProperty(
        '--element-accent',
        category.color
      )


    drawer.innerHTML = `
      <div class="ew5">

        <header class="ew5-top">

          <div>

            <span>
              ELEMENT
            </span>

            <strong>
              ${element.number}
              / 118
            </strong>

          </div>


          <button
            type="button"
            class="ew5-close"
            data-ew-close
          >
            ×
          </button>

        </header>


        <section class="ew5-hero">

          <div class="ew5-symbol">

            <span>
              ${element.number}
            </span>

            <strong>
              ${element.symbol}
            </strong>

            <small>
              ${formatMass(
                element.mass
              )}
            </small>

          </div>


          <div class="ew5-hero-copy">

            <span
              class="ew5-category"
              style="
                --category-color:
                ${category.color};
              "
            >

              <i></i>

              ${category.label}

            </span>


            <h2>
              ${element.name}
            </h2>


            <p>

              Chu kỳ

              <strong>
                ${element.period}
              </strong>

              ·

              ${
                element.group
                  ? `
                      Nhóm

                      <strong>
                        ${element.group}
                      </strong>

                      ·
                    `
                  : ''
              }

              Block

              <strong>
                ${element.block}
              </strong>

            </p>

          </div>

        </section>


        ${createQuickActions(
          element,
          ions
        )}


        <nav class="ew5-tabs">

          ${drawerTab(
            'overview',
            'Tổng quan'
          )}

          ${drawerTab(
            'electron',
            'Electron'
          )}

          ${drawerTab(
            'ion',
            'Ion'
          )}

          ${drawerTab(
            'isotope',
            'Đồng vị'
          )}

          ${drawerTab(
            '3d',
            '3D'
          )}

          ${drawerTab(
            'compare',
            'So sánh'
          )}

        </nav>


        <section class="ew5-content">

          ${renderDrawerContent(
            element
          )}

        </section>


        <footer class="ew5-bottom">

          <button
            type="button"
            data-ew-prev
            ${
              element.number ===
              1
                ? 'disabled'
                : ''
            }
          >
            ← Nguyên tố trước
          </button>


          <span>
            ${element.number}
            / 118
          </span>


          <button
            type="button"
            data-ew-next
            ${
              element.number ===
              118
                ? 'disabled'
                : ''
            }
          >
            Nguyên tố sau →
          </button>

        </footer>

      </div>
    `

  }


  /* =====================================================
     TAB
  ===================================================== */

  function drawerTab(
    id,
    label
  ) {

    return `
      <button
        type="button"
        data-ew-tab="${id}"
        class="${
          state.tab ===
          id
            ? 'active'
            : ''
        }"
      >
        ${label}
      </button>
    `

  }


  /* =====================================================
     DRAWER CONTENT
  ===================================================== */

  function renderDrawerContent(
    element
  ) {

    switch (
      state.tab
    ) {

      case 'electron':

        return electronPanel(
          element
        )


      case 'ion':

        return ionPanel(
          element
        )


      case 'isotope':

        return isotopePanel(
          element
        )


      case '3d':

        return threeDPanel(
          element
        )


      case 'compare':

        return comparePanel(
          element
        )


      default:

        return overviewPanel(
          element
        )

    }

  }


  /* =====================================================
     OVERVIEW
  ===================================================== */

  function overviewPanel(
    element
  ) {

    return `
      ${sectionHeading(
        'TỔNG QUAN',
        'Thông tin nguyên tố'
      )}


      <div class="ew5-stat-grid">

        ${propertyCard(
          'Số hiệu nguyên tử',
          element.number
        )}

        ${propertyCard(
          'Khối lượng nguyên tử',
          formatMass(
            element.mass
          )
        )}

        ${propertyCard(
          'Chu kỳ',
          element.period
        )}

        ${propertyCard(
          'Nhóm',
          element.group ||
          '—'
        )}

        ${propertyCard(
          'Block',
          element.block
        )}

        ${propertyCard(
          'Trạng thái',
          element.state
        )}

      </div>


      <div class="ew5-property-list">

        ${propertyRow(
          'Phân loại',
          CATEGORY_META[
            element.categoryKey
          ]?.label ||
          '—'
        )}

        ${propertyRow(
          'Độ âm điện',
          element.electronegativity ||
          '—'
        )}

        ${propertyRow(
          'Mật độ',
          withUnit(
            element.density,
            'g/cm³'
          )
        )}

        ${propertyRow(
          'Nhiệt độ nóng chảy',
          withUnit(
            element.meltingPoint,
            '°C'
          )
        )}

        ${propertyRow(
          'Nhiệt độ sôi',
          withUnit(
            element.boilingPoint,
            '°C'
          )
        )}

      </div>
    `

  }


  /* =====================================================
     ELECTRON
  ===================================================== */

  function electronPanel(
    element
  ) {

    const electron =
      calculateElectronData(
        element
      )


    return `
      ${sectionHeading(
        'CẤU HÌNH ELECTRON',
        'Phân bố electron'
      )}


      <div class="ew5-electron-config">

        <span>
          Cấu hình electron
        </span>

        <strong>
          ${electron.config}
        </strong>

      </div>


      <div class="ew5-shells">

        ${
          electron.shells
            .map(
              (
                count,
                index
              ) => `
                <div>

                  <span>
                    Lớp ${index + 1}
                  </span>

                  <strong>
                    ${count}
                  </strong>

                  <small>
                    electron
                  </small>

                </div>
              `
            )
            .join('')
        }

      </div>


      <div class="ew5-electron-facts">

        ${propertyRow(
          'Tổng electron',
          element.number
        )}

        ${propertyRow(
          'Electron lớp ngoài cùng',
          electron.valence
        )}

        ${propertyRow(
          'Block',
          element.block
        )}

      </div>
    `

  }


  /* =====================================================
     ION
  ===================================================== */

  function ionPanel(
    element
  ) {

    const ions =
      safeIons(
        element
      )


    const oxidation =
      getOxidationStates(
        element,
        ions
      )


    return `
      ${sectionHeading(
        'ION & OXIDATION',
        'Trạng thái ion'
      )}


      ${
        ions.length

          ? `
              <div class="ew5-ion-grid">

                ${
                  ions
                    .map(
                      ion => `
                        <div class="ew5-ion-card">

                          <strong>
                            ${ion.formula}
                          </strong>

                          <span>
                            Điện tích
                            ${ion.charge}
                          </span>

                          <small>
                            ${ion.type}
                          </small>

                        </div>
                      `
                    )
                    .join('')
                }

              </div>
            `

          : `
              <div class="ew5-empty">

                <strong>
                  Không có ion đơn nguyên tử phổ biến
                </strong>

                <p>
                  Nguyên tố này không thường
                  tồn tại dưới dạng ion đơn nguyên tử
                  phổ biến trong hóa học phổ thông.
                </p>

              </div>
            `
      }


      <div class="ew5-subsection">

        <span>
          SỐ OXI HÓA THƯỜNG GẶP
        </span>


        <div class="ew5-oxidation-list">

          ${
            oxidation.length
              ? oxidation
                  .map(
                    value => `
                      <b>
                        ${signed(
                          value
                        )}
                      </b>
                    `
                  )
                  .join('')
              : `
                  <small>
                    Chưa có dữ liệu.
                  </small>
                `
          }

        </div>

      </div>
    `

  }


  /* =====================================================
     ISOTOPE
  ===================================================== */

  function isotopePanel(
    element
  ) {

    const isotopes =
      safeIsotopes(
        element
      )


    if (
      !isotopes.length
    ) {

      return `
        ${sectionHeading(
          'ĐỒNG VỊ',
          'Dữ liệu đồng vị'
        )}


        <div class="ew5-empty large">

          <strong>
            Đang tải dữ liệu đồng vị
          </strong>

          <p>
            Hãy chuyển tab rồi mở lại Đồng vị
            nếu dữ liệu vừa được tải.
          </p>

        </div>
      `

    }


    return `
      ${sectionHeading(
        'ĐỒNG VỊ',
        'Dữ liệu đồng vị'
      )}


      <div class="ew5-isotope-list">

        ${
          isotopes
            .map(
              isotope => `
                <div class="ew5-isotope-card">

                  <strong>
                    ${isotope.name}
                  </strong>


                  <div>

                    <span>
                      Số khối
                    </span>

                    <b>
                      ${isotope.mass}
                    </b>

                  </div>


                  <div>

                    <span>
                      Thông tin
                    </span>

                    <b>
                      ${isotope.abundance}
                    </b>

                  </div>


                  <small
                    class="${
                      isotope.status ||
                      ''
                    }"
                  >
                    ${
                      isotope.status ===
                      'radioactive'

                        ? 'Phóng xạ'

                        : isotope.status ===
                          'reference'

                          ? 'Tham khảo'

                          : 'Tự nhiên'
                    }
                  </small>

                </div>
              `
            )
            .join('')
        }

      </div>
    `

  }


  /* =====================================================
     3D
  ===================================================== */

  function threeDPanel(
    element
  ) {

    return `
      ${sectionHeading(
        'TRỰC QUAN HÓA 3D',
        'Mô hình nguyên tử và orbital'
      )}


      <div class="ew5-3d-grid">

        <button
          type="button"
          class="ew5-3d-card"
          data-ew-atom3d
        >

          <div class="ew5-3d-icon">
            ◎
          </div>

          <span>
            ATOM 3D ${APP_VERSION}
          </span>

          <strong>
            Nguyên tử
            ${element.symbol}
          </strong>

          <p>
            Quan sát proton,
            neutron và các lớp electron.
          </p>

          <i>
            Mở Atom 3D →
          </i>

        </button>


        <button
          type="button"
          class="ew5-3d-card"
          data-ew-orbital3d
        >

          <div class="ew5-3d-icon">
            ◉
          </div>

          <span>
            ORBITAL 3D
          </span>

          <strong>
            Orbital
            ${element.symbol}
          </strong>

          <p>
            Quan sát orbital ngoài cùng
            dạng s, p, d hoặc f.
          </p>

          <i>
            Mở Orbital 3D →
          </i>

        </button>

      </div>
    `

  }


  /* =====================================================
     COMPARE
  ===================================================== */

  function comparePanel(
    element
  ) {

    const other =
      ELEMENT_MAP.get(
        state.compare
      )


    if (!other) {

      return ''

    }


    const rows = [

      [
        'Số hiệu',
        element.number,
        other.number
      ],

      [
        'Khối lượng',
        formatMass(
          element.mass
        ),
        formatMass(
          other.mass
        )
      ],

      [
        'Chu kỳ',
        element.period,
        other.period
      ],

      [
        'Nhóm',
        element.group ||
        '—',
        other.group ||
        '—'
      ],

      [
        'Block',
        element.block,
        other.block
      ],

      [
        'Trạng thái',
        element.state,
        other.state
      ]

    ]


    return `
      <div class="ew5-section-head compare">

        <div>

          <span>
            SO SÁNH
          </span>

          <h3>
            So sánh nguyên tố
          </h3>

        </div>


        <label>

          <span>
            So với
          </span>


          <select
            data-ew-compare-select
          >

            ${
              ELEMENTS
                .filter(
                  item =>
                    item.number !==
                    element.number
                )
                .map(
                  item => `
                    <option
                      value="${item.number}"
                      ${
                        item.number ===
                        other.number
                          ? 'selected'
                          : ''
                      }
                    >
                      ${item.symbol}
                      ·
                      ${item.name}
                    </option>
                  `
                )
                .join('')
            }

          </select>

        </label>

      </div>


      <div class="ew5-compare-head">

        <div>

          <strong>
            ${element.symbol}
          </strong>

          <span>
            ${element.name}
          </span>

        </div>


        <b>
          VS
        </b>


        <div>

          <strong>
            ${other.symbol}
          </strong>

          <span>
            ${other.name}
          </span>

        </div>

      </div>


      <div class="ew5-compare-table">

        ${
          rows
            .map(
              row => `
                <div>

                  <span>
                    ${row[0]}
                  </span>

                  <strong>
                    ${row[1]}
                  </strong>

                  <strong>
                    ${row[2]}
                  </strong>

                </div>
              `
            )
            .join('')
        }

      </div>
    `

  }


  /* =====================================================
     QUICK ACTIONS
  ===================================================== */

  function createQuickActions(
    element,
    ions
  ) {

    return `
      <section class="ew5-quick">

        <div class="ew5-quick-head">

          <div>

            <span>
              QUICK ACTIONS
            </span>

            <strong>
              Dùng ${element.symbol}
              trong ChemLab
            </strong>

          </div>


          ${
            ions[0]
              ? `
                  <small>
                    Ion chính:
                    <b>
                      ${ions[0].formula}
                    </b>
                  </small>
                `
              : ''
          }

        </div>


        <div class="ew5-quick-grid">

          ${quickAction(
            'ion',
            '±',
            'Ion Engine',
            'Ghép ion'
          )}

          ${quickAction(
            'molar',
            '∑',
            'Molar Mass',
            `Tính ${element.symbol}`
          )}

          ${quickAction(
            'solubility',
            '◫',
            'Tính tan',
            'Tra dung dịch'
          )}

          ${quickAction(
            'lab',
            '⌁',
            'Virtual Lab',
            'Thử nghiệm'
          )}

        </div>

      </section>
    `

  }


  /* =====================================================
     PHASE 3
  ===================================================== */

  async function runQuickAction(
    destination
  ) {

    if (
      !state.currentElement
    ) {
      return
    }


    try {

      const module =
        await import(
          './chemContextBridge.js'
        )


      if (
        typeof module
          .openElementDestination !==
        'function'
      ) {

        throw new Error(
          'openElementDestination không tồn tại.'
        )

      }


      await loadPeriodicData()


      const ions =
        safeIons(
          state.currentElement
        )


      closeDrawer()


      module
        .openElementDestination(

          destination,

          state.currentElement,

          {
            ions
          }

        )

    }

    catch (
      error
    ) {

      console.error(
        '[ChemLab] Phase 3 Quick Action:',
        error
      )

    }

  }


  /* =====================================================
     PERIODIC DATA SAFE ACCESS
  ===================================================== */

  function safeIons(
    element
  ) {

    try {

      return periodicDataAPI
        ?.getCommonIons
        ?.(
          element
        ) ||
        fallbackIons(
          element
        )

    }

    catch {

      return fallbackIons(
        element
      )

    }

  }


  function safeIsotopes(
    element
  ) {

    try {

      return periodicDataAPI
        ?.getIsotopes
        ?.(
          element
        ) ||
        []

    }

    catch {

      return []

    }

  }


  /* =====================================================
     BACKDROP
  ===================================================== */

  function openBackdrop() {

    let backdrop =
      document.querySelector(
        '#element-drawer-backdrop'
      )


    if (!backdrop) {

      backdrop =
        document.createElement(
          'button'
        )


      backdrop.type =
        'button'


      backdrop.id =
        'element-drawer-backdrop'


      backdrop.className =
        'drawer-backdrop ew5-backdrop'


      backdrop.setAttribute(
        'aria-label',
        'Đóng bảng thông tin nguyên tố'
      )


      backdrop.addEventListener(
        'click',
        event => {

          if (
            event.target ===
            backdrop
          ) {

            closeDrawer()

          }

        }
      )


      const parent =
        drawer.parentElement ||
        document.body


      parent.insertBefore(
        backdrop,
        drawer
      )

    }


    backdrop.hidden =
      false


    backdrop.style.display =
      'block'


    backdrop.style.pointerEvents =
      'auto'

  }


  /* =====================================================
     CLOSE DRAWER
  ===================================================== */

  function closeDrawer() {

    drawer.classList
      .remove(
        'open'
      )


    drawer.setAttribute(
      'aria-hidden',
      'true'
    )


    const backdrop =
      document.querySelector(
        '#element-drawer-backdrop'
      )


    if (backdrop) {

      backdrop.hidden =
        true


      backdrop.style.display =
        'none'


      backdrop.style.pointerEvents =
        'none'

    }

  }


  /* =====================================================
     SAVE
  ===================================================== */

  function savePreferences() {

    try {

      localStorage.setItem(
        STORAGE_KEY,

        JSON.stringify({

          layout:
            state.layout,

          colorMode:
            state.colorMode

        })
      )

    }

    catch {

      /* ignore */

    }

  }


  /*
    Tải data phụ sau khi bảng đã render.
    Nếu file này lỗi, bảng vẫn hoạt động.
  */

  loadPeriodicData()

}


/* =========================================================
   OPTIONAL 3D
========================================================= */

async function openAtom3DSafe(
  element
) {

  if (!element) {
    return
  }


  try {

    const module =
      await import(
        './atom3d.js'
      )


    const fn =
      module.openAtom3D ||
      module.showAtom3D ||
      module.initAtom3D ||
      module.default


    if (
      typeof fn ===
      'function'
    ) {

      await fn(
        element
      )

    }

  }

  catch (
    error
  ) {

    console.error(
      '[ChemLab] Atom 3D:',
      error
    )

  }

}


async function openOrbital3DSafe(
  element
) {

  if (!element) {
    return
  }


  try {

    const module =
      await import(
        './elementOrbital3D.js'
      )


    const fn =
      module.openElementOrbital3D ||
      module.openOrbital3D ||
      module.showOrbital3D ||
      module.default


    if (
      typeof fn ===
      'function'
    ) {

      await fn(
        element
      )

    }

  }

  catch (
    error
  ) {

    console.error(
      '[ChemLab] Orbital 3D:',
      error
    )

  }

}


/* =========================================================
   RESET OLD DRAWER
========================================================= */

function resetOldDrawer(
  drawer
) {

  drawer.classList
    .remove(
      'open'
    )


  drawer.setAttribute(
    'aria-hidden',
    'true'
  )


  document
    .querySelectorAll(
      '#element-drawer-backdrop'
    )
    .forEach(
      backdrop => {

        backdrop.hidden =
          true


        backdrop.style.display =
          'none'


        backdrop.style.pointerEvents =
          'none'

      }
    )

}


/* =========================================================
   NORMALIZE ELEMENT
========================================================= */

function normalizeElement(
  raw,
  index
) {

  if (!raw) {
    return null
  }


  const data =
    Array.isArray(
      raw
    )
      ? {

          number:
            raw[0],

          symbol:
            raw[1],

          name:
            raw[2],

          mass:
            raw[3],

          category:
            raw[4]

        }

      : {
          ...raw
        }


  const number =
    Number(
      data.number ??
      data.atomicNumber ??
      data.atomic_number ??
      index + 1
    )


  const position =
    getPositionInfo(
      number
    )


  return {

    ...data,

    number,

    symbol:
      data.symbol ||
      `E${number}`,

    name:
      data.name ||
      `Element ${number}`,

    mass:
      firstValue(
        data.mass,
        data.atomicMass,
        data.atomic_mass,
        '—'
      ),

    categoryKey:
      classifyCategory(
        data.category,
        number
      ),

    period:
      firstValue(
        data.period,
        position.period,
        '—'
      ),

    group:
      firstValue(
        data.group,
        position.group,
        null
      ),

    block:
      firstValue(
        data.block,
        position.block,
        '?'
      ),

    state:
      getMatterState(
        number
      ),

    electronegativity:
      firstValue(
        data.electronegativity,
        data.electronegativityPauling,
        data.electronegativity_pauling,
        null
      ),

    density:
      firstValue(
        data.density,
        null
      ),

    meltingPoint:
      firstValue(
        data.meltingPoint,
        data.melting_point,
        data.melt,
        null
      ),

    boilingPoint:
      firstValue(
        data.boilingPoint,
        data.boiling_point,
        data.boil,
        null
      ),

    electronConfiguration:
      firstValue(
        data.electronConfiguration,
        data.electron_configuration,
        data.electronConfig,
        data.electron_config,
        null
      ),

    oxidationStates:
      firstValue(
        data.oxidationStates,
        data.oxidation_states,
        null
      )

  }

}


/* =========================================================
   CATEGORY CLASSIFICATION
========================================================= */

function classifyCategory(
  category,
  number
) {

  if (
    number >=
      57 &&
    number <=
      71
  ) {

    return 'lanthanide'

  }


  if (
    number >=
      89 &&
    number <=
      103
  ) {

    return 'actinide'

  }


  const text =
    normalizeText(
      category ||
      ''
    )


  if (
    text.includes(
      'alkali metal'
    ) ||
    text.includes(
      'kim loai kiem'
    )
  ) {

    return 'alkali'

  }


  if (
    text.includes(
      'alkaline'
    ) ||
    text.includes(
      'kiem tho'
    )
  ) {

    return 'alkaline'

  }


  if (
    text.includes(
      'post-transition'
    ) ||
    text.includes(
      'post transition'
    ) ||
    text.includes(
      'sau chuyen tiep'
    )
  ) {

    return 'postTransition'

  }


  if (
    text.includes(
      'transition'
    ) ||
    text.includes(
      'chuyen tiep'
    )
  ) {

    return 'transition'

  }


  if (
    text.includes(
      'metalloid'
    ) ||
    text.includes(
      'a kim'
    )
  ) {

    return 'metalloid'

  }


  if (
    text.includes(
      'halogen'
    )
  ) {

    return 'halogen'

  }


  if (
    text.includes(
      'noble'
    ) ||
    text.includes(
      'khi hiem'
    )
  ) {

    return 'noble'

  }


  if (
    text.includes(
      'nonmetal'
    ) ||
    text.includes(
      'phi kim'
    )
  ) {

    return 'nonmetal'

  }


  const special = {

    noble:
      [
        2,
        10,
        18,
        36,
        54,
        86,
        118
      ],

    halogen:
      [
        9,
        17,
        35,
        53,
        85,
        117
      ],

    alkali:
      [
        3,
        11,
        19,
        37,
        55,
        87
      ],

    alkaline:
      [
        4,
        12,
        20,
        38,
        56,
        88
      ],

    metalloid:
      [
        5,
        14,
        32,
        33,
        51,
        52
      ],

    nonmetal:
      [
        1,
        6,
        7,
        8,
        15,
        16,
        34
      ]

  }


  for (
    const [
      categoryName,
      numbers
    ]
    of Object.entries(
      special
    )
  ) {

    if (
      numbers.includes(
        number
      )
    ) {

      return categoryName

    }

  }


  const info =
    getPositionInfo(
      number
    )


  if (
    info.block ===
    'd'
  ) {

    return 'transition'

  }


  return 'postTransition'

}


/* =========================================================
   POSITION INFO
========================================================= */

function getPositionInfo(
  number
) {

  if (
    number >=
      57 &&
    number <=
      71
  ) {

    return {

      period:
        6,

      group:
        null,

      block:
        'f'

    }

  }


  if (
    number >=
      89 &&
    number <=
      103
  ) {

    return {

      period:
        7,

      group:
        null,

      block:
        'f'

    }

  }


  const position =
    findMainPosition(
      number
    )


  if (!position) {

    return {

      period:
        '—',

      group:
        null,

      block:
        '?'

    }

  }


  let block =
    'p'


  if (
    position.column <=
    2
  ) {

    block =
      's'

  }


  if (
    position.column >=
      3 &&
    position.column <=
      12
  ) {

    block =
      'd'

  }


  if (
    number ===
    2
  ) {

    block =
      's'

  }


  return {

    period:
      position.period,

    group:
      position.column,

    block

  }

}


/* =========================================================
   MAIN POSITION
========================================================= */

function findMainPosition(
  number
) {

  for (
    const [
      period,
      row
    ]
    of Object.entries(
      PERIOD_ROWS
    )
  ) {

    if (
      row[number] !==
      undefined
    ) {

      return {

        period:
          Number(
            period
          ),

        column:
          row[number]

      }

    }

  }


  return null

}


/* =========================================================
   ROW GENERATOR
========================================================= */

function sequentialRow(
  start,
  end,
  column = 1
) {

  const result =
    {}


  for (
    let number =
      start;

    number <=
      end;

    number++
  ) {

    result[number] =
      column +
      number -
      start

  }


  return result

}


/* =========================================================
   F BLOCK
========================================================= */

function isFBlock(
  number
) {

  return (
    (
      number >=
        57 &&
      number <=
        71
    ) ||
    (
      number >=
        89 &&
      number <=
        103
    )
  )

}


/* =========================================================
   CATEGORY COUNTS
========================================================= */

function countCategories() {

  const counts =
    {}


  for (
    const element
    of ELEMENTS
  ) {

    counts[
      element.categoryKey
    ] =
      (
        counts[
          element.categoryKey
        ] ||
        0
      ) +
      1

  }


  return counts

}


/* =========================================================
   COLOR
========================================================= */

function getElementColor(
  element,
  mode
) {

  if (
    mode ===
    'block'
  ) {

    return {

      s:
        '#60a5fa',

      p:
        '#4ade80',

      d:
        '#38bdf8',

      f:
        '#f472b6'

    }[
      element.block
    ] ||
    '#94a3b8'

  }


  if (
    mode ===
    'state'
  ) {

    if (
      element.state ===
      'Khí'
    ) {

      return '#60a5fa'

    }


    if (
      element.state ===
      'Lỏng'
    ) {

      return '#22d3ee'

    }


    return '#a78bfa'

  }


  return (
    CATEGORY_META[
      element.categoryKey
    ]?.color ||
    '#94a3b8'
  )

}


/* =========================================================
   MATTER STATE
========================================================= */

function getMatterState(
  number
) {

  if (
    GAS_ELEMENTS.has(
      number
    )
  ) {

    return 'Khí'

  }


  if (
    LIQUID_ELEMENTS.has(
      number
    )
  ) {

    return 'Lỏng'

  }


  return 'Rắn'

}


/* =========================================================
   ELECTRON DATA
========================================================= */

function calculateElectronData(
  element
) {

  let remaining =
    element.number


  const shells =
    []


  const config =
    []


  for (
    const [
      orbital,
      capacity
    ]
    of ORBITAL_ORDER
  ) {

    if (
      remaining <=
      0
    ) {

      break

    }


    const count =
      Math.min(
        remaining,
        capacity
      )


    config.push(
      `${orbital}${superscript(
        count
      )}`
    )


    const shell =
      Number(
        orbital[0]
      ) -
      1


    shells[shell] =
      (
        shells[shell] ||
        0
      ) +
      count


    remaining -=
      count

  }


  return {

    config:
      element.electronConfiguration ||
      config.join(' '),

    shells:
      shells.map(
        value =>
          value ||
          0
      ),

    valence:
      shells[
        shells.length -
        1
      ] ||
      0

  }

}


/* =========================================================
   FALLBACK IONS
========================================================= */

function fallbackIons(
  element
) {

  const chargeByGroup = {

    1:
      1,

    2:
      2,

    17:
      -1

  }


  let charge =
    chargeByGroup[
      element.group
    ]


  if (
    element.group ===
      16 &&
    element.number <=
      52
  ) {

    charge =
      -2

  }


  if (
    element.categoryKey ===
      'lanthanide'
  ) {

    charge =
      3

  }


  if (
    element.categoryKey ===
      'actinide'
  ) {

    charge =
      3

  }


  if (
    !charge
  ) {

    return []

  }


  const absolute =
    Math.abs(
      charge
    )


  const magnitude =
    absolute ===
      1
      ? ''
      : superscript(
          absolute
        )


  const sign =
    charge >
      0
      ? '⁺'
      : '⁻'


  return [
    {

      formula:
        `${element.symbol}${magnitude}${sign}`,

      charge:
        charge >
          0
          ? `+${charge}`
          : `−${absolute}`,

      type:
        charge >
          0
          ? 'Cation'
          : 'Anion'

    }
  ]

}


/* =========================================================
   OXIDATION
========================================================= */

function getOxidationStates(
  element,
  ions
) {

  const raw =
    element.oxidationStates


  if (
    Array.isArray(
      raw
    )
  ) {

    return raw

  }


  if (
    typeof raw ===
    'string'
  ) {

    const parsed =
      raw
        .split(
          /[,;\s]+/
        )
        .map(
          item =>
            Number(
              item
                .replace(
                  '+',
                  ''
                )
                .replace(
                  '−',
                  '-'
                )
            )
        )
        .filter(
          Number.isFinite
        )


    if (
      parsed.length
    ) {

      return parsed

    }

  }


  const values =
    ions
      .map(
        ion =>
          Number(
            ion.charge
              .replace(
                '+',
                ''
              )
              .replace(
                '−',
                '-'
              )
          )
      )
      .filter(
        Number.isFinite
      )


  if (
    values.length
  ) {

    return [
      ...new Set(
        values
      )
    ]

  }


  if (
    element.group ===
    18
  ) {

    return [0]

  }


  return []

}


/* =========================================================
   UI
========================================================= */

function headerStat(
  value,
  label
) {

  return `
    <div>

      <strong>
        ${value}
      </strong>

      <span>
        ${label}
      </span>

    </div>
  `

}


function createSeriesCard({
  row,
  id,
  range,
  symbol,
  label,
  color
}) {

  return `
    <button
      type="button"
      class="
        pv5-series-card
        series-jump-card
      "
      data-series="${id}"
      style="
        grid-row:${row};
        grid-column:4;

        --element-accent:
        ${color};
      "
    >

      <span>
        ${range}
      </span>

      <strong>
        ${symbol}
      </strong>

      <small>
        ${label}
      </small>

      <b>
        ↓
      </b>

    </button>
  `

}


function sectionHeading(
  eyebrow,
  title
) {

  return `
    <div class="ew5-section-head">

      <div>

        <span>
          ${eyebrow}
        </span>

        <h3>
          ${title}
        </h3>

      </div>

    </div>
  `

}


function propertyCard(
  label,
  value
) {

  return `
    <div>

      <span>
        ${label}
      </span>

      <strong>
        ${value}
      </strong>

    </div>
  `

}


function propertyRow(
  label,
  value
) {

  return `
    <div>

      <span>
        ${label}
      </span>

      <strong>
        ${value}
      </strong>

    </div>
  `

}


function quickAction(
  action,
  icon,
  title,
  description
) {

  return `
    <button
      type="button"
      class="ew5-quick-action"
      data-ew-action="${action}"
    >

      <span>
        ${icon}
      </span>


      <div>

        <strong>
          ${title}
        </strong>

        <small>
          ${description}
        </small>

      </div>


      <b>
        →
      </b>

    </button>
  `

}


function legend(
  color,
  label
) {

  return `
    <span>

      <i
        style="
          background:
          ${color};
        "
      ></i>

      ${label}

    </span>
  `

}


/* =========================================================
   FORMAT
========================================================= */

function formatMass(
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

    return String(
      value ??
      '—'
    )

  }


  return Number(
    match[0]
  )
    .toLocaleString(
      'vi-VN',
      {
        maximumFractionDigits:
          4
      }
    )

}


function withUnit(
  value,
  unit
) {

  if (
    value ===
      undefined ||
    value ===
      null ||
    value ===
      ''
  ) {

    return '—'

  }


  return `${value} ${unit}`

}


function signed(
  value
) {

  const number =
    Number(
      value
    )


  if (
    number >
    0
  ) {

    return `+${number}`

  }


  if (
    number <
    0
  ) {

    return `−${Math.abs(
      number
    )}`

  }


  return '0'

}


function superscript(
  value
) {

  const map = {

    0: '⁰',
    1: '¹',
    2: '²',
    3: '³',
    4: '⁴',
    5: '⁵',
    6: '⁶',
    7: '⁷',
    8: '⁸',
    9: '⁹'

  }


  return String(
    value
  )
    .split('')
    .map(
      char =>
        map[char] ||
        char
    )
    .join('')

}


function normalizeText(
  value
) {

  return String(
    value
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


function firstValue(
  ...values
) {

  return values.find(
    value =>
      value !==
        undefined &&
      value !==
        null &&
      value !==
        ''
  )

}


/* =========================================================
   UTILS
========================================================= */

function isTyping(
  element
) {

  return (
    element instanceof
      HTMLInputElement ||

    element instanceof
      HTMLTextAreaElement ||

    element instanceof
      HTMLSelectElement ||

    element?.isContentEditable
  )

}


function prefersReducedMotion() {

  return window
    .matchMedia(
      '(prefers-reduced-motion: reduce)'
    )
    .matches

}


/* =========================================================
   PREFERENCES
========================================================= */

function readPreferences() {

  try {

    return JSON.parse(
      localStorage.getItem(
        STORAGE_KEY
      ) ||
      '{}'
    )

  }

  catch {

    return {}

  }

}