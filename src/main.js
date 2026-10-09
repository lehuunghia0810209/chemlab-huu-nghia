/* =========================================================
   CHEMLAB CORE APPLICATION
========================================================= */


/* =========================================================
   BASE STYLES
========================================================= */

import './style.css'
import './workspace.css'

import {
  APP_VERSION
} from './appMeta.js'

import {
  createRouteModuleLoader
} from './routeModuleLoader.js'


/* =========================================================
   PERIODIC
========================================================= */

import {
  initPeriodicWorkspace
} from './periodicWorkspace.js'


/* =========================================================
   ROUTE MODULES

   Tools / Learning / Lab are loaded on demand.
   This keeps the Periodic landing route fast and prevents
   Three.js + Lab/Learning data from blocking the first view.
========================================================= */


/* =========================================================
   PROGRESS
========================================================= */

import {
  initProgressStorage,
  getProgressSummary,
  getGradeSummary
} from './progress/progressStorage.js'

import {
  createHomeDashboard
} from './final/homeDashboard.js'


/* =========================================================
   OLD COMPATIBILITY DESIGN
========================================================= */

import './chemlab-v4.css'
import './design-system.css'


/* =========================================================
   CHEMLAB 5 — MUST LOAD LAST
========================================================= */

import './chemlab5.css'
import './responsive/tablet.css'
import './responsive/mobile.css'
import './userPreferences.css'
import './zperiodLight.css'
import './experience.css'
import './final/final-6.css'
import './ai/chemAI.css'


/* =========================================================
   ACCESSIBILITY
========================================================= */

import {
  initAccessibility
} from './accessibility.js'

import {
  applySavedPreferences,
  initUserPreferences
} from './userPreferences.js'


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEYS = {

  view:
    'chemlab-v6-last-view'

}


/* =========================================================
   USER PREFERENCES
========================================================= */

applySavedPreferences()


/* =========================================================
   ROUTES
========================================================= */

const VALID_VIEWS =
  new Set([
    'home',
    'periodic',
    'tools',
    'learning',
    'lab'
  ])


const VIEW_INFO = {

  home: {
    title: 'Tổng quan',
    subtitle: 'Học · khám phá · thí nghiệm · kết nối'
  },

  periodic: {

    title:
      'Bảng tuần hoàn',

    subtitle:
      '118 nguyên tố · dữ liệu · mô hình · so sánh'

  },


  tools: {

    title:
      'Công cụ hóa học',

    subtitle:
      'Tính toán · ion · phương trình · orbital'

  },


  learning: {

    title:
      'Learning',

    subtitle:
      'XP · mastery · luyện tập · ôn lại'

  },


  lab: {

    title:
      'Phòng thí nghiệm',

    subtitle:
      'Mô phỏng phản ứng hóa học tương tác'

  }

}


/* =========================================================
   SVG ICON SYSTEM
========================================================= */

function icon(
  name
) {

  const icons = {

    home: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5"/>
        <path d="M5 9.5V21h14V9.5"/>
        <path d="M9 21v-6h6v6"/>
      </svg>
    `,

    ai: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"/>
        <path d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/>
      </svg>
    `,

    flask: `
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M9 3h6"/>
        <path d="M10 3v6.3L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 9.3V3"/>
        <path d="M7.7 15h8.6"/>
      </svg>
    `,


    table: `
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="16" rx="2"/>
        <path d="M3 9h18"/>
        <path d="M8 4v16"/>
        <path d="M14 9v11"/>
      </svg>
    `,


    tools: `
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="3"/>
        <path d="M10.2 10.2 20 20"/>
        <path d="M15 5h6"/>
        <path d="M18 2v6"/>
      </svg>
    `,


    brain: `
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M9.5 4.5A3 3 0 0 0 4 6a3 3 0 0 0 0 6 3 3 0 0 0 3 5h2.5"/>
        <path d="M14.5 4.5A3 3 0 0 1 20 6a3 3 0 0 1 0 6 3 3 0 0 1-3 5h-2.5"/>
        <path d="M9.5 4.5v15"/>
        <path d="M14.5 4.5v15"/>
        <path d="M7 9h2.5"/>
        <path d="M14.5 9H17"/>
      </svg>
    `,


    lab: `
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M8 3h8"/>
        <path d="M9 3v6l-5 9a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 18l-5-9V3"/>
        <path d="M7 15h10"/>
      </svg>
    `,


    search: `
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7"/>
        <path d="m20 20-3.7-3.7"/>
      </svg>
    `,


    orbital: `
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="2"/>
        <ellipse cx="12" cy="12" rx="9" ry="4"/>
        <ellipse
          cx="12"
          cy="12"
          rx="9"
          ry="4"
          transform="rotate(60 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="9"
          ry="4"
          transform="rotate(120 12 12)"
        />
      </svg>
    `,


    ion: `
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="8"/>
        <path d="M8 12h8"/>
        <path d="M12 8v8"/>
      </svg>
    `,


    scale: `
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3v18"/>
        <path d="M5 6h14"/>
        <path d="m7 6-4 7h8L7 6Z"/>
        <path d="m17 6-4 7h8l-4-7Z"/>
        <path d="M8 21h8"/>
      </svg>
    `,


    calculator: `
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="5" y="3" width="14" height="18" rx="2"/>
        <path d="M8 7h8"/>
        <path d="M8 11h1"/>
        <path d="M12 11h1"/>
        <path d="M16 11h1"/>
        <path d="M8 15h1"/>
        <path d="M12 15h1"/>
        <path d="M16 15h1"/>
      </svg>
    `,


    droplets: `
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3S6 9 6 14a6 6 0 0 0 12 0c0-5-6-11-6-11Z"/>
      </svg>
    `

  }


  return (
    icons[name] ||
    icons.flask
  )

}


/* =========================================================
   COMMAND DATA
========================================================= */

const COMMANDS = [

  {
    group: 'Điều hướng',
    name: 'Tổng quan',
    description: 'Trang chủ ChemLab 6',
    icon: 'home',
    view: 'home',
    keywords: 'trang chu home dashboard tong quan'
  },

  {
    group: 'Trợ lý',
    name: 'ChemAI',
    description: 'Hỏi trợ lý Hóa học theo ngữ cảnh',
    icon: 'ai',
    ai: true,
    keywords: 'ai chemai tro ly hoa hoc hoi dap tutor'
  },

  {
    group:
      'Điều hướng',

    name:
      'Bảng tuần hoàn',

    description:
      'Khám phá 118 nguyên tố',

    icon:
      'table',

    view:
      'periodic',

    keywords:
      'bang tuan hoan periodic elements'
  },


  {
    group:
      'Điều hướng',

    name:
      'Công cụ hóa học',

    description:
      'Mở trung tâm công cụ',

    icon:
      'tools',

    view:
      'tools',

    keywords:
      'cong cu tools chemistry'
  },


  {
    group:
      'Điều hướng',

    name:
      'Learning Mode',

    description:
      'Luyện tập và theo dõi mastery',

    icon:
      'brain',

    view:
      'learning',

    keywords:
      'hoc learning quiz mastery'
  },


  {
    group:
      'Điều hướng',

    name:
      'Phòng thí nghiệm',

    description:
      'Mô phỏng phản ứng hóa học',

    icon:
      'lab',

    view:
      'lab',

    keywords:
      'lab thi nghiem laboratory'
  },


  {
    group:
      'Công cụ',

    name:
      'Cân bằng PTHH',

    description:
      'Cân bằng phương trình hóa học',

    icon:
      'scale',

    view:
      'tools',

    tool:
      'balancer',

    keywords:
      'can bang pthh equation balancer'
  },


  {
    group:
      'Công cụ',

    name:
      'Máy tính hóa học',

    description:
      'Mol, nồng độ và khối lượng',

    icon:
      'calculator',

    view:
      'tools',

    tool:
      'calculator',

    keywords:
      'may tinh mol concentration calculator'
  },


  {
    group:
      'Công cụ',

    name:
      'Bảng tính tan',

    description:
      'Tra khả năng tan của hợp chất',

    icon:
      'droplets',

    view:
      'tools',

    tool:
      'solubility',

    keywords:
      'tinh tan solubility'
  },


  {
    group:
      'Công cụ',

    name:
      'Ion Engine',

    description:
      'Tra ion và ghép công thức',

    icon:
      'ion',

    view:
      'tools',

    tool:
      'ions',

    keywords:
      'ion engine cation anion'
  },


  {
    group:
      'Công cụ',

    name:
      'Orbital Atlas',

    description:
      'Khám phá s, p, d, f trong 3D',

    icon:
      'orbital',

    view:
      'tools',

    tool:
      'orbital',

    keywords:
      'orbital spdf 3d'
  },


  {
    group: 'Công cụ',
    name: 'Compound Studio',
    description: 'Phân tích công thức và hợp chất',
    icon: 'flask',
    view: 'tools',
    tool: 'compound',
    keywords: 'compound studio cong thuc hop chat molar mass'
  },


  {
    group: 'Công cụ',
    name: 'Reaction Studio',
    description: 'Phân tích và dự đoán phản ứng',
    icon: 'lab',
    view: 'tools',
    tool: 'reaction',
    keywords: 'reaction studio phan ung du doan can bang'
  }

]


/* =========================================================
   ROOT
========================================================= */

const app =
  document.querySelector(
    '#app'
  )


if (!app) {

  throw new Error(
    `ChemLab ${APP_VERSION}: không tìm thấy #app.`
  )

}


/* =========================================================
   APP SHELL
========================================================= */

app.innerHTML = `

  <a
    class="skip-link"
    href="#workspace-main"
  >
    Đến nội dung chính
  </a>


  <div
    id="app-announcer"
    class="sr-only"
    aria-live="polite"
    aria-atomic="true"
  ></div>


  <div
    class="workspace-app is-booting"
    aria-busy="true"
  >

    <div
      id="v5-route-progress"
      class="v5-route-progress"
      aria-hidden="true"
    >
      <span></span>
    </div>


    <!-- ==================================================
         TOP BAR
    =================================================== -->

    <header class="workspace-topbar">


      <button
        class="workspace-brand v5-brand"
        type="button"
        data-app-view="home"
        aria-label="Mở Tổng quan ChemLab"
      >

        <span class="v5-brand-mark">
          ${icon('flask')}
        </span>


        <span class="v5-brand-copy">

          <strong class="v5-brand-name">
            ChemLab
          </strong>

          <span class="v5-version">
            ${APP_VERSION}
          </span>

        </span>

      </button>


      <div class="workspace-title-area">

        <strong id="workspace-view-title">
          Tổng quan
        </strong>

        <span id="workspace-view-subtitle">
          Học · khám phá · thí nghiệm · kết nối
        </span>

      </div>


      <div class="workspace-top-actions">


        <button
          id="open-command"
          class="v5-command-button"
          type="button"
          aria-label="Mở tìm kiếm nhanh"
        >

          ${icon('search')}

          <span>
            Tìm nhanh trong ChemLab
          </span>

          <kbd>
            Ctrl K
          </kbd>

        </button>


        <button
          class="v5-top-button chemai-top-button"
          type="button"
          data-chemai-open
          aria-label="Mở ChemAI"
          title="ChemAI"
        >
          ${icon('ai')}
        </button>


        <button
          class="v5-top-button"
          type="button"
          data-app-view="learning"
          aria-label="Mở Learning Mode"
          title="Learning Mode"
        >
          ${icon('brain')}
        </button>


        <button
          class="v5-top-button primary"
          type="button"
          data-app-view="lab"
          aria-label="Mở Phòng thí nghiệm"
          title="Phòng thí nghiệm"
        >
          ${icon('lab')}
        </button>

      </div>

    </header>


    <!-- ==================================================
         SIDEBAR
    =================================================== -->

    <nav
      class="workspace-sidebar"
      aria-label="Điều hướng chính"
    >

      <div class="v5-sidebar-label">
        KHÁM PHÁ
      </div>


      ${navButton(
        'home',
        'home',
        'Tổng quan',
        true
      )}


      ${navButton(
        'periodic',
        'table',
        'Bảng'
      )}


      ${navButton(
        'tools',
        'tools',
        'Công cụ'
      )}


      ${navButton(
        'learning',
        'brain',
        'Học tập'
      )}


      ${navButton(
        'lab',
        'lab',
        'Thí nghiệm'
      )}


      <div
        id="v5-app-status"
        class="sidebar-bottom-status is-ready"
        role="status"
        aria-live="polite"
      >

        <i aria-hidden="true"></i>

        <span>
          Sẵn sàng
        </span>

      </div>

    </nav>


    <!-- ==================================================
         MAIN
    =================================================== -->

    <main
      id="workspace-main"
      class="workspace-main"
      tabindex="-1"
    >


      <!-- HOME -->

      <section
        id="view-home"
        class="workspace-view active"
      >
        <div id="home-dashboard-root"></div>
      </section>


      <!-- PERIODIC -->

      <section
        id="view-periodic"
        class="workspace-view"
        hidden
      >

        <div
          id="periodic-workspace-root"
        ></div>

      </section>


      <!-- TOOLS -->

      <section
        id="view-tools"
        class="workspace-view"
        hidden
      >

        <div class="v4-page-head">

          <div>

            <span>
              TOOL CENTER
            </span>

            <h1>
              Công cụ hóa học
            </h1>

            <p>
              Tính toán, phân tích và trực quan hóa
              hóa học trong một workspace thống nhất.
            </p>

          </div>

        </div>


        <section
          id="tools"
          class="chem-tools-section"
        ></section>

      </section>


      <!-- LEARNING -->

      <section
        id="view-learning"
        class="workspace-view"
        hidden
      >

        <div class="v4-page-head">

          <div>

            <span>
              LEARNING
            </span>

            <h1>
              Học tập thông minh
            </h1>

            <p>
              Luyện tập, theo dõi mastery
              và tập trung vào những phần bạn còn yếu.
            </p>

          </div>

        </div>


        <div
          id="learning-host"
        ></div>

      </section>


      <!-- LAB -->

      <section
        id="view-lab"
        class="workspace-view"
        hidden
      >

        <div
          id="lab-host"
        ></div>

      </section>

    </main>


    <!-- ELEMENT DRAWER -->

    <aside
      id="element-drawer"
      class="element-drawer"
      aria-hidden="true"
    ></aside>


    <button
      class="chemai-launcher"
      type="button"
      data-chemai-open
      aria-label="Mở ChemAI — trợ lý Hóa học"
      title="Mở ChemAI"
    >
      <span class="chemai-launcher-orb">${icon('ai')}</span>
      <span class="chemai-launcher-copy">
        <strong>ChemAI</strong>
        <small>HỎI TRỢ LÝ</small>
      </span>
    </button>

  </div>


  <!-- ====================================================
       COMMAND PALETTE
  ===================================================== -->

  <div
    id="v5-command-layer"
    class="v5-command-layer"
    hidden
  >

    <section
      class="v5-command-panel"
      role="dialog"
      aria-modal="true"
      aria-label="Tìm kiếm nhanh ChemLab"
    >

      <div class="v5-command-search">

        ${icon('search')}

        <input
          id="v5-command-input"
          type="search"
          autocomplete="off"
          placeholder="Tìm công cụ hoặc khu vực..."
          aria-label="Tìm kiếm trong ChemLab"
        >

        <span class="v5-command-esc">
          ESC
        </span>

      </div>


      <div
        id="v5-command-results"
        class="v5-command-body"
      ></div>


      <footer class="v5-command-footer">

        <span>
          ↑ ↓ để di chuyển
        </span>

        <span>
          Enter để mở
        </span>

      </footer>

    </section>

  </div>
`


/* =========================================================
   NAV BUTTON BUILDER
========================================================= */

function navButton(
  view,
  iconName,
  label,
  active = false
) {

  return `
    <button
      class="
        sidebar-button
        ${active ? 'active' : ''}
      "
      type="button"
      data-view="${view}"
      aria-label="${label}"
      title="${label}"
    >

      <span class="sidebar-icon">
        ${icon(iconName)}
      </span>

      <span>
        ${label}
      </span>

    </button>
  `

}


/* =========================================================
   REFERENCES
========================================================= */

const workspaceApp =
  document.querySelector(
    '.workspace-app'
  )


const main =
  document.querySelector(
    '#workspace-main'
  )


const drawer =
  document.querySelector(
    '#element-drawer'
  )


const title =
  document.querySelector(
    '#workspace-view-title'
  )


const subtitle =
  document.querySelector(
    '#workspace-view-subtitle'
  )


const announcer =
  document.querySelector(
    '#app-announcer'
  )


const homeRoot =
  document.querySelector(
    '#home-dashboard-root'
  )


const periodicRoot =
  document.querySelector(
    '#periodic-workspace-root'
  )


const toolsRoot =
  document.querySelector(
    '#tools'
  )


const learningHost =
  document.querySelector(
    '#learning-host'
  )


const labHost =
  document.querySelector(
    '#lab-host'
  )


const commandLayer =
  document.querySelector(
    '#v5-command-layer'
  )


const commandInput =
  document.querySelector(
    '#v5-command-input'
  )


const commandResults =
  document.querySelector(
    '#v5-command-results'
  )


const routeProgress =
  document.querySelector(
    '#v5-route-progress'
  )


const appStatus =
  document.querySelector(
    '#v5-app-status'
  )


let currentView =
  null


let commandIndex =
  0


let commandMatches =
  [...COMMANDS]


/* =========================================================
   SAFE INITIALIZER
========================================================= */

function safeInit(
  name,
  initializer,
  fallbackHost = null
) {

  try {

    initializer()

    return true

  }

  catch (error) {

    console.error(
      `[ChemLab ${APP_VERSION}] ${name}:`,
      error
    )


    if (fallbackHost) {

      renderModuleError(
        fallbackHost,
        name
      )

    }


    return false

  }

}


/* =========================================================
   MODULE ERROR
========================================================= */

function renderModuleError(
  host,
  name
) {

  if (!host) {
    return
  }


  const node =
    document.createElement(
      'div'
    )


  node.className =
    'v5-module-error'


  node.innerHTML = `
    <strong>
      Không thể tải ${name}
    </strong>

    <span>
      Các phần còn lại của ChemLab vẫn hoạt động.
      Kiểm tra Console để xem lỗi.
    </span>
  `


  host.appendChild(
    node
  )

}


/* =========================================================
   PERIODIC
========================================================= */

safeInit(
  'Bảng tuần hoàn',

  () => {

    initPeriodicWorkspace({
      root:
        periodicRoot,

      drawer
    })

  },

  periodicRoot
)


/* =========================================================
   PROGRESS
========================================================= */

safeInit(
  'Progress Storage',
  initProgressStorage
)


/* =========================================================
   HOME DASHBOARD
========================================================= */

const homeDashboard =
  createHomeDashboard({
    root: homeRoot,
    getProgressSummary,
    getGradeSummary
  })


/* =========================================================
   ROUTE MODULE LOADER
========================================================= */

const routeModules =
  createRouteModuleLoader({
    version:
      APP_VERSION,

    routeProgress,

    appStatus,

    hosts: {
      home:
        homeRoot,
      periodic:
        periodicRoot,
      tools:
        toolsRoot,
      learning:
        learningHost,
      lab:
        labHost
    },

    safeInit,

    renderModuleError,

    getCurrentView:
      () => currentView
  })


/* =========================================================
   ACCESSIBILITY
========================================================= */

safeInit(
  'Accessibility',
  initAccessibility
)


safeInit(
  'User Preferences',
  initUserPreferences
)


/* =========================================================
   CHEMAI — LAZY INTEGRATION
========================================================= */

let chemAIPromise = null

async function ensureChemAI(
  initialPrompt = ''
) {

  if (!chemAIPromise) {
    chemAIPromise = import('./ai/chemAI.js')
      .then(module =>
        module.initChemAI({
          version: APP_VERSION
        })
      )
      .catch(error => {
        chemAIPromise = null
        console.error(
          `[ChemLab ${APP_VERSION}] Không thể tải ChemAI:`,
          error
        )
        announceMessage(
          'Không thể tải ChemAI. Hãy thử lại.'
        )
        throw error
      })
  }

  const api = await chemAIPromise
  api.open(initialPrompt)
  return api
}


document.addEventListener(
  'click',
  event => {
    const trigger = event.target.closest('[data-chemai-open]')
    if (!trigger) return

    void ensureChemAI()
  }
)


/* =========================================================
   VIEW SWITCH
========================================================= */

function switchView(
  viewName,
  {
    updateHistory =
      true,

    save =
      true,

    announce =
      true,

    resetScroll =
      true
  } = {}
) {

  if (
    !VALID_VIEWS.has(
      viewName
    )
  ) {

    viewName =
      'home'

  }


  const changed =
    currentView !==
    viewName


  currentView =
    viewName


  workspaceApp?.setAttribute(
    'data-current-view',
    viewName
  )


  document.documentElement.dataset.chemlabView =
    viewName


  if (viewName === 'home') {
    homeDashboard.refresh()
  }


  document
    .querySelectorAll(
      '.workspace-view'
    )
    .forEach(
      section => {

        const active =
          section.id ===
          `view-${viewName}`


        section.hidden =
          !active


        section.classList.toggle(
          'active',
          active
        )

      }
    )


  document
    .querySelectorAll(
      '.sidebar-button[data-view]'
    )
    .forEach(
      button => {

        const active =
          button.dataset.view ===
          viewName


        button.classList.toggle(
          'active',
          active
        )


        if (active) {

          button.setAttribute(
            'aria-current',
            'page'
          )

        }

        else {

          button.removeAttribute(
            'aria-current'
          )

        }

      }
    )


  const info =
    VIEW_INFO[
      viewName
    ]


  title.textContent =
    info.title


  subtitle.textContent =
    info.subtitle


  if (
    viewName !==
    'periodic'
  ) {

    closeDrawer()

  }


  if (
    changed &&
    resetScroll
  ) {

    main?.scrollTo({

      top:
        0,

      left:
        0,

      behavior:
        prefersReducedMotion()
          ? 'auto'
          : 'smooth'

    })

  }


  if (save) {

    saveLastView(
      viewName
    )

  }


  if (
    updateHistory
  ) {

    updateHash(
      viewName
    )

  }


  if (
    announce
  ) {

    announceMessage(
      `Đã mở ${info.title}`
    )

  }


  const routeStatus =
    routeModules.getStatus(
      viewName
    )


  if (
    routeStatus ===
      'ready'
  ) {

    routeModules.setAppStatus(
      'Sẵn sàng',
      'ready'
    )

  }

  else if (
    routeStatus ===
      'error'
  ) {

    routeModules.setAppStatus(
      'Có lỗi khi tải',
      'error'
    )

  }


  void routeModules.ensureViewReady(
    viewName
  )


  if (changed) {
    window.dispatchEvent(
      new CustomEvent(
        'chemlab:view-change',
        {
          detail: {
            view: viewName,
            title: info.title,
            version: APP_VERSION
          }
        }
      )
    )
  }

}


/* =========================================================
   DRAWER
========================================================= */

function closeDrawer() {

  drawer?.classList.remove(
    'open'
  )


  drawer?.setAttribute(
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

  }

}


/* =========================================================
   NAVIGATION EVENTS
========================================================= */

document.addEventListener(
  'click',
  event => {

    const retryButton =
      event.target.closest(
        '[data-retry-view]'
      )


    if (retryButton) {

      const viewName =
        retryButton.dataset.retryView


      void routeModules.retryView(
        viewName
      )


      return

    }


    const sidebar =
      event.target.closest(
        '[data-view]'
      )


    if (sidebar) {

      switchView(
        sidebar.dataset.view
      )


      return

    }


    const toolTarget =
      event.target.closest(
        '[data-app-tool]'
      )


    if (toolTarget) {
      switchView(
        'tools'
      )

      void routeModules.openToolWhenReady(
        toolTarget.dataset.appTool
      )

      return
    }


    const target =
      event.target.closest(
        '[data-app-view]'
      )


    if (target) {

      switchView(
        target.dataset.appView
      )

    }

  }
)


/* =========================================================
   COMMAND PALETTE
========================================================= */

function openCommandPalette() {

  commandLayer.hidden =
    false


  commandInput.value =
    ''


  commandIndex =
    0


  commandMatches =
    [...COMMANDS]


  renderCommands()


  requestAnimationFrame(
    () => {

      commandInput.focus()

    }
  )

}


function closeCommandPalette() {

  commandLayer.hidden =
    true


  document
    .querySelector(
      '#open-command'
    )
    ?.focus()

}


/* =========================================================
   COMMAND FILTER
========================================================= */

function filterCommands() {

  const query =
    normalizeSearch(
      commandInput.value
    )


  if (!query) {

    commandMatches =
      [...COMMANDS]

  }

  else {

    commandMatches =
      COMMANDS.filter(
        item => {

          const content =
            normalizeSearch(
              [
                item.name,
                item.description,
                item.keywords,
                item.group
              ].join(' ')
            )


          return content.includes(
            query
          )

        }
      )

  }


  commandIndex =
    0


  renderCommands()

}


/* =========================================================
   COMMAND RENDER
========================================================= */

function renderCommands() {

  if (
    !commandMatches.length
  ) {

    commandResults.innerHTML = `
      <div class="v5-command-empty">
        Không tìm thấy kết quả phù hợp.
      </div>
    `


    return

  }


  const groups =
    new Map()


  commandMatches.forEach(
    item => {

      if (
        !groups.has(
          item.group
        )
      ) {

        groups.set(
          item.group,
          []
        )

      }


      groups
        .get(
          item.group
        )
        .push(
          item
        )

    }
  )


  let runningIndex =
    0


  commandResults.innerHTML =
    [
      ...groups.entries()
    ]
      .map(
        ([group,items]) => {

          const html =
            items
              .map(
                item => {

                  const index =
                    runningIndex++


                  return `
                    <button
                      type="button"
                      class="v5-command-item"
                      data-command-index="${index}"
                      tabindex="${
                        index ===
                        commandIndex
                          ? '0'
                          : '-1'
                      }"
                    >

                      <span class="v5-command-item-icon">
                        ${icon(item.icon)}
                      </span>


                      <span class="v5-command-item-copy">

                        <strong>
                          ${item.name}
                        </strong>

                        <small>
                          ${item.description}
                        </small>

                      </span>


                      <span>
                        →
                      </span>

                    </button>
                  `

                }
              )
              .join('')


          return `
            <div class="v5-command-group">

              <div class="v5-command-group-label">
                ${group.toUpperCase()}
              </div>

              ${html}

            </div>
          `

        }
      )
      .join('')

}


/* =========================================================
   RUN COMMAND
========================================================= */

function runCommand(
  index
) {

  const item =
    commandMatches[
      index
    ]


  if (!item) {
    return
  }


  closeCommandPalette()


  if (item.ai) {
    void ensureChemAI()
    return
  }


  switchView(
    item.view,
    {
      updateHistory:
        !item.tool
    }
  )


  if (
    item.tool
  ) {

    void routeModules.openToolWhenReady(
      item.tool
    )
      .then(
        opened => {

          if (!opened) {
            return
          }


          history.replaceState(
            null,
            '',
            `#tools/${item.tool}`
          )

        }
      )

  }

}


/* =========================================================
   COMMAND EVENTS
========================================================= */

document
  .querySelector(
    '#open-command'
  )
  ?.addEventListener(
    'click',
    openCommandPalette
  )


commandInput
  ?.addEventListener(
    'input',
    filterCommands
  )


commandResults
  ?.addEventListener(
    'click',
    event => {

      const button =
        event.target.closest(
          '[data-command-index]'
        )


      if (!button) {
        return
      }


      runCommand(
        Number(
          button.dataset
            .commandIndex
        )
      )

    }
  )


commandLayer
  ?.addEventListener(
    'click',
    event => {

      if (
        event.target ===
        commandLayer
      ) {

        closeCommandPalette()

      }

    }
  )


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
  'keydown',
  event => {

    const typing =
      isTyping(
        event.target
      )


    /* CTRL / CMD + SHIFT + A — CHEMAI */

    if (
      (
        event.ctrlKey ||
        event.metaKey
      ) &&
      event.shiftKey &&
      event.key.toLowerCase() ===
        'a'
    ) {

      event.preventDefault()
      void ensureChemAI()
      return

    }


    /* CTRL / CMD + K */

    if (
      (
        event.ctrlKey ||
        event.metaKey
      ) &&
      event.key.toLowerCase() ===
        'k'
    ) {

      event.preventDefault()


      if (
        commandLayer.hidden
      ) {

        openCommandPalette()

      }

      else {

        closeCommandPalette()

      }


      return

    }


    /* COMMAND OPEN */

    if (
      !commandLayer.hidden
    ) {

      if (
        event.key ===
        'Escape'
      ) {

        event.preventDefault()

        closeCommandPalette()

        return

      }


      if (
        event.key ===
        'ArrowDown'
      ) {

        event.preventDefault()


        commandIndex =
          (
            commandIndex +
            1
          ) %
          commandMatches.length


        renderCommands()


        focusActiveCommand()


        return

      }


      if (
        event.key ===
        'ArrowUp'
      ) {

        event.preventDefault()


        commandIndex =
          (
            commandIndex -
            1 +
            commandMatches.length
          ) %
          commandMatches.length


        renderCommands()


        focusActiveCommand()


        return

      }


      if (
        event.key ===
        'Enter' &&
        document.activeElement ===
        commandInput
      ) {

        event.preventDefault()


        runCommand(
          commandIndex
        )


        return

      }

    }


    /* ALT NAVIGATION */

    if (
      event.altKey
    ) {

      const shortcuts = {

        '1':
          'periodic',

        '2':
          'tools',

        '3':
          'learning',

        '4':
          'lab'

      }


      const destination =
        shortcuts[
          event.key
        ]


      if (destination) {

        event.preventDefault()


        switchView(
          destination
        )


        return

      }

    }


    /* PERIODIC SEARCH */

    if (
      !typing &&
      currentView ===
        'periodic' &&
      event.key ===
        '/'
    ) {

      const search =
        document.querySelector(
          '#periodic-search'
        )


      if (search) {

        event.preventDefault()

        search.focus()

        search.select?.()

      }

    }

  }
)


/* =========================================================
   ACTIVE COMMAND FOCUS
========================================================= */

function focusActiveCommand() {

  requestAnimationFrame(
    () => {

      commandResults
        .querySelector(
          `[data-command-index="${commandIndex}"]`
        )
        ?.focus()

    }
  )

}


/* =========================================================
   TOOL HASH SYNC
========================================================= */

document.addEventListener(
  'click',
  event => {

    const button =
      event.target.closest(
        '.tool-selector [data-tool]'
      )


    if (!button) {
      return
    }


    if (
      currentView !==
      'tools'
    ) {
      return
    }


    history.replaceState(
      null,
      '',
      `#tools/${button.dataset.tool}`
    )

  }
)


/* =========================================================
   HASH ROUTER
========================================================= */

window.addEventListener(
  'hashchange',
  () => {

    const route =
      parseHashRoute()


    if (
      !route.view
    ) {
      return
    }


    switchView(
      route.view,
      {
        updateHistory:
          false
      }
    )


    if (
      route.view ===
        'tools' &&
      route.tool
    ) {

      void routeModules.openToolWhenReady(
        route.tool
      )

    }

  }
)


/* =========================================================
   ROUTE PARSER
========================================================= */

function parseHashRoute() {

  const raw =
    window.location.hash
      .replace(
        /^#/,
        ''
      )
      .trim()


  if (!raw) {

    return {

      view:
        null,

      tool:
        null

    }

  }


  const [
    rawView,
    rawTool
  ] =
    raw.split('/')


  return {

    view:
      VALID_VIEWS.has(
        rawView
      )
        ? rawView
        : null,

    tool:
      rawTool ||
      null

  }

}


/* =========================================================
   HASH WRITER
========================================================= */

function updateHash(
  viewName
) {

  if (
    viewName ===
      'tools'
  ) {

    const activeTool =
      window
        .ChemLabTools
        ?.current?.()


    if (activeTool) {

      history.replaceState(
        null,
        '',
        `#tools/${activeTool}`
      )


      return

    }

  }


  history.replaceState(
    null,
    '',
    `#${viewName}`
  )

}


/* =========================================================
   LAST VIEW
========================================================= */

function saveLastView(
  view
) {

  try {

    localStorage.setItem(
      STORAGE_KEYS.view,
      view
    )

  }

  catch {

    /* ignore */

  }

}


function loadLastView() {

  try {

    const value =
      localStorage.getItem(
        STORAGE_KEYS.view
      )


    return VALID_VIEWS.has(
      value
    )
      ? value
      : null

  }

  catch {

    return null

  }

}


/* =========================================================
   PUBLIC APP CONTEXT API

   Stable bridge for the final ChemAI integration in ChemLab 6.2.
========================================================= */

function getAppContext() {

  return {
    version: APP_VERSION,
    view: currentView || 'home',
    tool:
      window.ChemLabTools?.current?.() ||
      null,
    chemFlow:
      window.ChemLabContext?.current ||
      null,
    learning:
      window.ChemLabLearning?.context?.() ||
      null,
    lab:
      window.ChemLabLab?.context?.() ||
      null,
    progress:
      getProgressSummary(),
    hash:
      window.location.hash || '#home'
  }

}


window.ChemLabApp = Object.freeze({

  version:
    APP_VERSION,

  navigate(
    viewName
  ) {

    switchView(
      viewName
    )

  },

  openTool(
    toolId
  ) {

    switchView(
      'tools'
    )

    return routeModules
      .openToolWhenReady(
        toolId
      )

  },

  openChemAI(
    prompt = ''
  ) {

    return ensureChemAI(
      prompt
    )

  },

  context:
    getAppContext

})


/* =========================================================
   INITIAL ROUTE
========================================================= */

function resolveInitialRoute() {

  const hash =
    parseHashRoute()


  if (
    hash.view
  ) {

    return hash

  }


  return {

    view:
      loadLastView() ||
      'home',

    tool:
      null

  }

}


/* =========================================================
   ANNOUNCER
========================================================= */

function announceMessage(
  message
) {

  if (!announcer) {
    return
  }


  announcer.textContent =
    ''


  requestAnimationFrame(
    () => {

      announcer.textContent =
        message

    }
  )

}


/* =========================================================
   HELPERS
========================================================= */

function prefersReducedMotion() {

  return window
    .matchMedia(
      '(prefers-reduced-motion: reduce)'
    )
    .matches

}


function isTyping(
  target
) {

  return (
    target instanceof
      HTMLInputElement ||
    target instanceof
      HTMLTextAreaElement ||
    target instanceof
      HTMLSelectElement ||
    target?.isContentEditable
  )

}


function normalizeSearch(
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


/* =========================================================
   VERSION
========================================================= */

function syncVersion() {

  document.title =
    `ChemLab ${APP_VERSION}`


  document
    .documentElement
    .dataset
    .chemlabVersion =
    APP_VERSION


  document
    .querySelectorAll(
      '.v5-version'
    )
    .forEach(
      node => {

        node.textContent =
          APP_VERSION

      }
    )

}


/* =========================================================
   START APP
========================================================= */

const initialRoute =
  resolveInitialRoute()


switchView(
  initialRoute.view,
  {
    updateHistory:
      false,

    save:
      false,

    announce:
      false,

    resetScroll:
      false
  }
)


if (
  initialRoute.view ===
    'tools' &&
  initialRoute.tool
) {

  void routeModules.openToolWhenReady(
    initialRoute.tool
  )

}


renderCommands()

syncVersion()


requestAnimationFrame(
  () => {

    requestAnimationFrame(
      () => {

        workspaceApp
          ?.classList
          .remove(
            'is-booting'
          )


        workspaceApp
          ?.setAttribute(
            'aria-busy',
            'false'
          )

      }
    )

  }
)