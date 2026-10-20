
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import './styles/shell.css'
import './styles/dashboard.css'
import './ai/chemAI.css'

import { APP_VERSION } from './appMeta.js'
import { createRouteModuleLoader } from './routeModuleLoader.js'
import { initPeriodicWorkspace } from './periodic/periodicWorkspace.js'
import {
  initProgressStorage,
  getProgressSummary,
  getGradeSummary
} from './progress/progressStorage.js'
import { createHomeDashboard } from './final/homeDashboard.js'
import { initAccessibility } from './accessibility.js'
import {
  applySavedPreferences,
  initUserPreferences,
  getResolvedTheme,
  setPreference
} from './userPreferences.js'
import { icon, brandMark } from './shell/icons.js'
import { createCommandPalette } from './shell/commandPalette.js'

const STORAGE_KEYS = {
  view: 'chemlab-v6-last-view',
  sidebar: 'chemlab-shell-sidebar'
}

applySavedPreferences()


const VALID_VIEWS = new Set(['home', 'periodic', 'tools', 'learning', 'lab'])

const VIEW_INFO = {
  home: {
    title: 'Tổng quan',
    nav: 'Tổng quan',
    icon: 'home',
    subtitle: 'Học · khám phá · thí nghiệm'
  },
  periodic: {
    title: 'Bảng tuần hoàn',
    nav: 'Bảng',
    icon: 'table',
    subtitle: '118 nguyên tố · mô hình nguyên tử · orbital'
  },
  tools: {
    title: 'Công cụ hóa học',
    nav: 'Công cụ',
    icon: 'tools',
    subtitle: 'Tính toán · phương trình · ion · hợp chất'
  },
  learning: {
    title: 'Học tập',
    nav: 'Học tập',
    icon: 'learn',
    subtitle: 'Lớp 10–12 · học từng bước · luyện tập'
  },
  lab: {
    title: 'Phòng thí nghiệm',
    nav: 'Thí nghiệm',
    icon: 'lab',
    subtitle: 'Mô phỏng phản ứng · thí nghiệm có hướng dẫn'
  }
}

const QUICK_TOOLS = [
  { tool: 'balancer', icon: 'scale', label: 'Cân bằng PTHH' },
  { tool: 'calculator', icon: 'calculator', label: 'Máy tính hóa học' },
  { tool: 'orbital', icon: 'atom', label: 'Orbital Atlas' },
  { tool: 'compound', icon: 'compound', label: 'Compound Studio' }
]


const COMMANDS = [
  { group: 'Điều hướng', name: 'Tổng quan', description: 'Trang chủ ChemLab', icon: 'home', view: 'home', keywords: 'trang chu home dashboard tong quan' },
  { group: 'Điều hướng', name: 'Bảng tuần hoàn', description: 'Khám phá 118 nguyên tố', icon: 'table', view: 'periodic', keywords: 'bang tuan hoan periodic elements nguyen to' },
  { group: 'Điều hướng', name: 'Công cụ hóa học', description: 'Mở trung tâm công cụ', icon: 'tools', view: 'tools', keywords: 'cong cu tools chemistry' },
  { group: 'Điều hướng', name: 'Học tập', description: 'Bài học lớp 10–12 và luyện tập', icon: 'learn', view: 'learning', keywords: 'hoc learning quiz mastery bai hoc' },
  { group: 'Điều hướng', name: 'Phòng thí nghiệm', description: 'Mô phỏng phản ứng hóa học', icon: 'lab', view: 'lab', keywords: 'lab thi nghiem laboratory phong' },
  { group: 'Trợ lý', name: 'ChemAI', description: 'Hỏi trợ lý Hóa học theo ngữ cảnh', icon: 'ai', ai: true, keywords: 'ai chemai tro ly hoa hoc hoi dap tutor' },
  { group: 'Công cụ', name: 'Cân bằng PTHH', description: 'Cân bằng phương trình hóa học', icon: 'scale', view: 'tools', tool: 'balancer', keywords: 'can bang pthh equation balancer phuong trinh' },
  { group: 'Công cụ', name: 'Máy tính hóa học', description: 'Mol, nồng độ và khối lượng', icon: 'calculator', view: 'tools', tool: 'calculator', keywords: 'may tinh mol nong do concentration calculator' },
  { group: 'Công cụ', name: 'Bảng tính tan', description: 'Tra khả năng tan của hợp chất', icon: 'droplets', view: 'tools', tool: 'solubility', keywords: 'tinh tan solubility' },
  { group: 'Công cụ', name: 'Ion Engine', description: 'Tra ion và ghép công thức', icon: 'ion', view: 'tools', tool: 'ions', keywords: 'ion engine cation anion' },
  { group: 'Công cụ', name: 'Orbital Atlas', description: 'Khám phá orbital s, p, d, f trong 3D', icon: 'atom', view: 'tools', tool: 'orbital', keywords: 'orbital spdf 3d' },
  { group: 'Công cụ', name: 'Compound Studio', description: 'Phân tích công thức và hợp chất', icon: 'compound', view: 'tools', tool: 'compound', keywords: 'compound studio cong thuc hop chat molar mass' },
  { group: 'Công cụ', name: 'Reaction Studio', description: 'Phân tích và dự đoán phản ứng', icon: 'reaction', view: 'tools', tool: 'reaction', keywords: 'reaction studio phan ung du doan can bang' },
  { group: 'Giao diện', name: 'Chuyển giao diện sáng / tối', description: 'Đổi theme ngay lập tức', icon: 'moon', action: 'theme', keywords: 'theme dark light sang toi giao dien' },
  { group: 'Giao diện', name: 'Cài đặt', description: 'Cỡ chữ, mật độ, chuyển động, tương phản', icon: 'settings', action: 'settings', keywords: 'cai dat settings co chu tuong phan' }
]


const app = document.querySelector('#app')

if (!app) {
  throw new Error(`ChemLab ${APP_VERSION}: không tìm thấy #app.`)
}

function navButton(view, iconName, label) {
  return `
    <button class="app-nav__item" type="button" data-view="${view}" data-nav-item>
      <span class="app-nav__icon">${icon(iconName)}</span>
      <span class="app-nav__label">${label}</span>
    </button>
  `
}

function bottomNavButton(view) {
  const info = VIEW_INFO[view]
  return `
    <button class="app-bottom-nav__item" type="button" data-view="${view}" data-nav-item>
      ${icon(info.icon)}
      <span>${info.nav}</span>
    </button>
  `
}

function savedSidebarState() {
  try {
    return localStorage.getItem(STORAGE_KEYS.sidebar) === 'collapsed' ? 'collapsed' : 'expanded'
  }
  catch {
    return 'expanded'
  }
}

app.innerHTML = `
  <a class="skip-link" href="#workspace-main">Đến nội dung chính</a>
  <div id="app-announcer" class="sr-only" aria-live="polite" aria-atomic="true"></div>

  <div id="app-shell" class="app-shell is-booting" data-sidebar="${savedSidebarState()}" aria-busy="true">
    <div id="app-route-progress" class="app-route-progress" aria-hidden="true"><span></span></div>

    <aside class="app-sidebar" aria-label="Thanh bên ChemLab">
      <div class="app-sidebar__head">
        <button class="app-brand" type="button" data-app-view="home" aria-label="ChemLab ${APP_VERSION}, về Tổng quan">
          <span class="app-brand__mark">${brandMark()}</span>
          <span class="app-brand__text">
            <strong>ChemLab</strong>
            <small class="app-version">${APP_VERSION}</small>
          </span>
        </button>
        <button class="ui-icon-btn app-sidebar__toggle" type="button" data-sidebar-toggle aria-label="Thu gọn thanh bên" aria-expanded="true">
          ${icon('sidebar')}
        </button>
      </div>

      <button id="open-command" class="app-search" type="button">
        ${icon('search')}
        <span class="app-search__label">Tìm nhanh…</span>
        <kbd class="ui-kbd">Ctrl K</kbd>
      </button>

      <nav class="app-nav" aria-label="Điều hướng chính">
        ${navButton('home', 'home', 'Tổng quan')}
        ${navButton('periodic', 'table', 'Bảng tuần hoàn')}
        ${navButton('tools', 'tools', 'Công cụ')}
        ${navButton('learning', 'learn', 'Học tập')}
        ${navButton('lab', 'lab', 'Thí nghiệm')}
      </nav>

      <div class="app-sidebar__section" aria-labelledby="quick-tools-label">
        <span id="quick-tools-label" class="app-sidebar__label">Công cụ nhanh</span>
        ${QUICK_TOOLS.map(item => `
          <button class="app-nav__item app-nav__item--sub" type="button" data-app-tool="${item.tool}">
            <span class="app-nav__icon">${icon(item.icon)}</span>
            <span class="app-nav__label">${item.label}</span>
          </button>
        `).join('')}
      </div>

      <div class="app-sidebar__foot">
        <button class="app-ai-entry" type="button" data-chemai-open>
          <span class="app-ai-entry__orb">${icon('ai')}</span>
          <span class="app-ai-entry__copy">
            <strong>ChemAI</strong>
            <small>Hỏi theo ngữ cảnh</small>
          </span>
          <kbd class="ui-kbd">⇧ A</kbd>
        </button>

        <div class="app-sidebar__utils">
          <div id="app-product-slot" class="app-product-slot"></div>
          <div id="app-status" class="app-status is-ready" role="status" aria-live="polite">
            <i aria-hidden="true"></i><span>Sẵn sàng</span>
          </div>
          <button class="ui-icon-btn" type="button" data-theme-toggle aria-label="Chuyển giao diện sáng / tối">
            <span class="app-theme-icon app-theme-icon--light">${icon('sun')}</span>
            <span class="app-theme-icon app-theme-icon--dark">${icon('moon')}</span>
          </button>
          <button class="ui-icon-btn" type="button" data-open-settings aria-label="Cài đặt">
            ${icon('settings')}
          </button>
        </div>
      </div>
    </aside>

    <div class="app-column">
      <header class="app-topbar">
        <button class="app-topbar__brand" type="button" data-app-view="home" aria-label="ChemLab ${APP_VERSION}, về Tổng quan">
          ${brandMark()}
        </button>

        <div class="app-topbar__title">
          <span class="app-topbar__crumb" aria-hidden="true">ChemLab</span>
          <span class="app-topbar__sep" aria-hidden="true">${icon('chevronRight')}</span>
          <strong id="workspace-view-title">Tổng quan</strong>
          <span id="workspace-view-subtitle" class="app-topbar__subtitle">${VIEW_INFO.home.subtitle}</span>
        </div>

        <div class="app-topbar__actions">
          <button class="ui-icon-btn app-topbar__search" type="button" data-open-command aria-label="Tìm nhanh">
            ${icon('search')}
          </button>
          <button class="ui-icon-btn app-topbar__ai" type="button" data-chemai-open aria-label="Mở ChemAI">
            ${icon('ai')}
          </button>
          <button class="ui-icon-btn app-topbar__theme" type="button" data-theme-toggle aria-label="Chuyển giao diện sáng / tối">
            <span class="app-theme-icon app-theme-icon--light">${icon('sun')}</span>
            <span class="app-theme-icon app-theme-icon--dark">${icon('moon')}</span>
          </button>
          <button class="ui-icon-btn app-topbar__settings" type="button" data-open-settings aria-label="Cài đặt">
            ${icon('settings')}
          </button>
        </div>
      </header>

      <main id="workspace-main" class="app-main" tabindex="-1">
        <section id="view-home" class="app-view active">
          <div id="home-dashboard-root"></div>
        </section>

        <section id="view-periodic" class="app-view" hidden>
          <div id="periodic-workspace-root"></div>
        </section>

        <section id="view-tools" class="app-view" hidden>
          <header class="ui-page-head">
            <div>
              <span class="ui-eyebrow">Trung tâm công cụ</span>
              <h1>Công cụ hóa học</h1>
              <p>Tính toán, phân tích và trực quan hóa hóa học trong một không gian làm việc thống nhất.</p>
            </div>
          </header>
          <section id="tools" class="chem-tools-section"></section>
        </section>

        <section id="view-learning" class="app-view" hidden>
          <div id="learning-host"></div>
        </section>

        <section id="view-lab" class="app-view" hidden>
          <div id="lab-host"></div>
        </section>
      </main>
    </div>

    <nav class="app-bottom-nav" aria-label="Điều hướng chính">
      ${[...VALID_VIEWS].map(bottomNavButton).join('')}
    </nav>

    <aside id="element-drawer" aria-hidden="true"></aside>
  </div>
`


const shell = document.querySelector('#app-shell')
const main = document.querySelector('#workspace-main')
const drawer = document.querySelector('#element-drawer')
const title = document.querySelector('#workspace-view-title')
const subtitle = document.querySelector('#workspace-view-subtitle')
const announcer = document.querySelector('#app-announcer')
const homeRoot = document.querySelector('#home-dashboard-root')
const periodicRoot = document.querySelector('#periodic-workspace-root')
const toolsRoot = document.querySelector('#tools')
const learningHost = document.querySelector('#learning-host')
const labHost = document.querySelector('#lab-host')
const routeProgress = document.querySelector('#app-route-progress')
const appStatus = document.querySelector('#app-status')

let currentView = null


function safeInit(name, initializer, fallbackHost = null) {
  try {
    initializer()
    return true
  }
  catch (error) {
    console.error(`[ChemLab ${APP_VERSION}] ${name}:`, error)
    if (fallbackHost) renderModuleError(fallbackHost, name)
    return false
  }
}

function renderModuleError(host, name) {
  if (!host) return

  const node = document.createElement('div')
  node.className = 'ui-state ui-state--error app-module-error'
  node.setAttribute('role', 'alert')
  node.innerHTML = `
    <strong>Không thể tải ${name}</strong>
    <span>Các phần còn lại của ChemLab vẫn hoạt động. Hãy tải lại trang để thử lại.</span>
  `
  host.appendChild(node)
}


safeInit('Bảng tuần hoàn', () => {
  initPeriodicWorkspace({ root: periodicRoot, drawer })
}, periodicRoot)

safeInit('Progress Storage', initProgressStorage)

const homeDashboard = createHomeDashboard({
  root: homeRoot,
  getProgressSummary,
  getGradeSummary
})

const routeModules = createRouteModuleLoader({
  version: APP_VERSION,
  routeProgress,
  appStatus,
  hosts: {
    home: homeRoot,
    periodic: periodicRoot,
    tools: toolsRoot,
    learning: learningHost,
    lab: labHost
  },
  safeInit,
  renderModuleError,
  getCurrentView: () => currentView
})

safeInit('Accessibility', initAccessibility)
safeInit('User Preferences', initUserPreferences)


let chemAIPromise = null

async function ensureChemAI(initialPrompt = '') {
  // Set by the Exam Workspace: no AI help while an exam is running.
  if (document.documentElement.dataset.examRunning === 'true') {
    announceMessage('ChemAI tạm tắt trong lúc làm bài thi.')
    return null
  }
  if (!chemAIPromise) {
    chemAIPromise = import('./ai/chemAI.js')
      .then(module => module.initChemAI({ version: APP_VERSION }))
      .catch(error => {
        chemAIPromise = null
        console.error(`[ChemLab ${APP_VERSION}] Không thể tải ChemAI:`, error)
        announceMessage('Không thể tải ChemAI. Hãy thử lại.')
        throw error
      })
  }

  const api = await chemAIPromise
  api.open(initialPrompt)
  return api
}


function switchView(viewName, {
  updateHistory = true,
  save = true,
  announce = true,
  resetScroll = true
} = {}) {
  if (!VALID_VIEWS.has(viewName)) viewName = 'home'

  const changed = currentView !== viewName
  currentView = viewName

  shell.dataset.currentView = viewName
  document.documentElement.dataset.chemlabView = viewName

  if (viewName === 'home') homeDashboard.refresh()

  document.querySelectorAll('.app-view').forEach(section => {
    const active = section.id === `view-${viewName}`
    section.hidden = !active
    section.classList.toggle('active', active)
  })

  document.querySelectorAll('[data-nav-item][data-view]').forEach(button => {
    const active = button.dataset.view === viewName
    button.classList.toggle('active', active)
    if (active) button.setAttribute('aria-current', 'page')
    else button.removeAttribute('aria-current')
  })

  const info = VIEW_INFO[viewName]
  title.textContent = info.title
  subtitle.textContent = info.subtitle

  if (viewName !== 'periodic') closeDrawer()

  if (changed && resetScroll) {
    main.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  if (save) saveLastView(viewName)
  if (updateHistory) updateHash(viewName)
  if (announce) announceMessage(`Đã mở ${info.title}`)

  const routeStatus = routeModules.getStatus(viewName)
  if (routeStatus === 'ready') routeModules.setAppStatus('Sẵn sàng', 'ready')
  else if (routeStatus === 'error') routeModules.setAppStatus('Có lỗi khi tải', 'error')

  void routeModules.ensureViewReady(viewName)

  if (changed) {
    window.dispatchEvent(new CustomEvent('chemlab:view-change', {
      detail: { view: viewName, title: info.title, version: APP_VERSION }
    }))
  }
}

function closeDrawer() {
  drawer?.classList.remove('open')
  drawer?.setAttribute('aria-hidden', 'true')

  const backdrop = document.querySelector('#element-drawer-backdrop')
  if (backdrop) backdrop.hidden = true
}

function openTool(toolId) {
  switchView('tools')
  return routeModules.openToolWhenReady(toolId)
}


function setSidebar(state) {
  shell.dataset.sidebar = state
  const toggle = shell.querySelector('[data-sidebar-toggle]')
  const expanded = state === 'expanded'
  toggle?.setAttribute('aria-expanded', String(expanded))
  toggle?.setAttribute('aria-label', expanded ? 'Thu gọn thanh bên' : 'Mở rộng thanh bên')
  try {
    localStorage.setItem(STORAGE_KEYS.sidebar, state)
  }
  catch {
  }
}

setSidebar(shell.dataset.sidebar)

function toggleTheme() {
  const next = getResolvedTheme() === 'dark' ? 'light' : 'dark'
  setPreference('theme', next)
  announceMessage(next === 'dark' ? 'Đã chuyển sang giao diện tối' : 'Đã chuyển sang giao diện sáng')
}


const commandPalette = createCommandPalette({
  commands: COMMANDS,
  onRun(item) {
    if (item.ai) {
      void ensureChemAI()
      return
    }

    if (item.action === 'theme') {
      toggleTheme()
      return
    }

    if (item.action === 'settings') {
      window.ChemLabPreferences?.open()
      return
    }

    if (item.tool) {
      switchView(item.view, { updateHistory: false })
      void routeModules.openToolWhenReady(item.tool).then(opened => {
        if (opened) history.replaceState(null, '', `#tools/${item.tool}`)
      })
      return
    }

    switchView(item.view)
  }
})


document.addEventListener('click', event => {
  const target = event.target

  if (target.closest('[data-chemai-open]')) {
    void ensureChemAI()
    return
  }

  const retryButton = target.closest('[data-retry-view]')
  if (retryButton) {
    void routeModules.retryView(retryButton.dataset.retryView)
    return
  }

  const navItem = target.closest('[data-view][data-nav-item]')
  if (navItem) {
    switchView(navItem.dataset.view)
    return
  }

  const toolTarget = target.closest('[data-app-tool]')
  if (toolTarget) {
    void openTool(toolTarget.dataset.appTool)
    return
  }

  const viewTarget = target.closest('[data-app-view]')
  if (viewTarget) {
    const hash = viewTarget.dataset.appHash
    if (hash && window.location.hash !== hash) {
      window.location.hash = hash
      return
    }
    switchView(viewTarget.dataset.appView)
    return
  }

  if (target.closest('#open-command, [data-open-command]')) {
    commandPalette.open()
    return
  }

  if (target.closest('[data-theme-toggle]')) {
    toggleTheme()
    return
  }

  if (target.closest('[data-sidebar-toggle]')) {
    setSidebar(shell.dataset.sidebar === 'collapsed' ? 'expanded' : 'collapsed')
    return
  }

  if (target.closest('[data-open-settings]')) {
    window.ChemLabPreferences?.open()
  }
})

document.addEventListener('click', event => {
  const button = event.target.closest('.tool-selector [data-tool]')
  if (button && currentView === 'tools') {
    history.replaceState(null, '', `#tools/${button.dataset.tool}`)
  }
})


document.addEventListener('keydown', event => {
  const typing = isTyping(event.target)
  const mod = event.ctrlKey || event.metaKey
  const key = event.key.toLowerCase()

  if (mod && event.shiftKey && key === 'a') {
    event.preventDefault()
    void ensureChemAI()
    return
  }

  if (mod && key === 'k') {
    event.preventDefault()
    commandPalette.toggle()
    return
  }

  if (commandPalette.isOpen) return

  if (event.altKey && !mod) {
    const destination = { 1: 'periodic', 2: 'tools', 3: 'learning', 4: 'lab' }[event.key]
    if (destination) {
      event.preventDefault()
      switchView(destination)
    }
    return
  }

  if (!typing && currentView === 'periodic' && event.key === '/') {
    const search = document.querySelector('#periodic-search')
    if (search) {
      event.preventDefault()
      search.focus()
      search.select?.()
    }
  }
})


window.addEventListener('hashchange', () => {
  const route = parseHashRoute()
  if (!route.view) return

  switchView(route.view, { updateHistory: false })

  if (route.view === 'tools' && route.tool) {
    void routeModules.openToolWhenReady(route.tool)
  }
})

function parseHashRoute() {
  const raw = window.location.hash.replace(/^#/, '').trim()
  if (!raw) return { view: null, tool: null }

  const [rawView, rawTool] = raw.split('/')
  return {
    view: VALID_VIEWS.has(rawView) ? rawView : null,
    tool: rawTool || null
  }
}

function updateHash(viewName) {
  if (viewName === 'learning') {
    history.replaceState(null, '', window.ChemLabLearning?.route?.() || '#learning')
    return
  }

  if (viewName === 'tools') {
    const activeTool = window.ChemLabTools?.current?.()
    if (activeTool) {
      history.replaceState(null, '', `#tools/${activeTool}`)
      return
    }
  }

  history.replaceState(null, '', `#${viewName}`)
}

function saveLastView(view) {
  try {
    localStorage.setItem(STORAGE_KEYS.view, view)
  }
  catch {
  }
}

function loadLastView() {
  try {
    const value = localStorage.getItem(STORAGE_KEYS.view)
    return VALID_VIEWS.has(value) ? value : null
  }
  catch {
    return null
  }
}


function getAppContext() {
  return {
    version: APP_VERSION,
    view: currentView || 'home',
    tool: window.ChemLabTools?.current?.() || null,
    chemFlow: window.ChemLabContext?.current || null,
    learning: window.ChemLabLearning?.context?.() || null,
    lab: window.ChemLabLab?.context?.() || null,
    progress: getProgressSummary(),
    hash: window.location.hash || '#home'
  }
}

window.ChemLabApp = Object.freeze({
  version: APP_VERSION,
  navigate(viewName) {
    switchView(viewName)
  },
  openTool,
  openChemAI(prompt = '') {
    return ensureChemAI(prompt)
  },
  context: getAppContext
})


function announceMessage(message) {
  if (!announcer) return
  announcer.textContent = ''
  requestAnimationFrame(() => {
    announcer.textContent = message
  })
}

function isTyping(target) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target?.isContentEditable
  )
}


const initialRoute = (() => {
  const hash = parseHashRoute()
  return hash.view ? hash : { view: loadLastView() || 'home', tool: null }
})()

switchView(initialRoute.view, {
  updateHistory: false,
  save: false,
  announce: false,
  resetScroll: false
})

if (initialRoute.view === 'tools' && initialRoute.tool) {
  void routeModules.openToolWhenReady(initialRoute.tool)
}

document.documentElement.dataset.chemlabVersion = APP_VERSION

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    shell.classList.remove('is-booting')
    shell.setAttribute('aria-busy', 'false')
  })
})
