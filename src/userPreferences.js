/* =========================================================
   USER PREFERENCES
   Storage key and value format are unchanged from ChemLab 5
   so existing users keep their settings.
========================================================= */

import { icon } from './shell/icons.js'

const STORAGE_KEY = 'chemlab-v5-user-preferences'

const DEFAULTS = Object.freeze({
  theme: 'system',
  fontSize: 'normal',
  density: 'comfortable',
  reduceMotion: false,
  highContrast: false
})

const ALLOWED = Object.freeze({
  theme: ['system', 'dark', 'light'],
  fontSize: ['small', 'normal', 'large'],
  density: ['comfortable', 'compact']
})

const systemLight = window.matchMedia('(prefers-color-scheme: light)')

let prefs = loadPreferences()

function loadPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    const merged = { ...DEFAULTS, ...parsed }

    for (const [key, values] of Object.entries(ALLOWED)) {
      if (!values.includes(merged[key])) merged[key] = DEFAULTS[key]
    }
    merged.reduceMotion = Boolean(merged.reduceMotion)
    merged.highContrast = Boolean(merged.highContrast)
    return merged
  }
  catch {
    return { ...DEFAULTS }
  }
}

function savePreferences() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  }
  catch {
    /* private mode / quota — preferences still apply for this session */
  }
}

function resolveTheme(theme) {
  if (theme !== 'system') return theme
  return systemLight.matches ? 'light' : 'dark'
}

function applyPreferences() {
  const root = document.documentElement
  const theme = resolveTheme(prefs.theme)

  root.dataset.theme = theme
  root.dataset.themeMode = prefs.theme
  root.dataset.fontSize = prefs.fontSize
  root.dataset.density = prefs.density
  root.dataset.reduceMotion = prefs.reduceMotion ? 'true' : 'false'
  root.dataset.contrast = prefs.highContrast ? 'high' : 'normal'

  document.querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'light' ? '#f4f6fa' : '#0b1220')
  document.querySelector('meta[name="color-scheme"]')
    ?.setAttribute('content', theme)

  window.dispatchEvent(new CustomEvent('chemlab:preferences-change', {
    detail: { ...prefs, resolvedTheme: theme }
  }))
}

export function applySavedPreferences() {
  prefs = loadPreferences()
  applyPreferences()
}

export function getPreferences() {
  return { ...prefs }
}

export function getResolvedTheme() {
  return resolveTheme(prefs.theme)
}

export function setPreference(key, value) {
  if (!(key in DEFAULTS)) return
  if (ALLOWED[key] && !ALLOWED[key].includes(value)) return
  prefs[key] = typeof DEFAULTS[key] === 'boolean' ? Boolean(value) : value
  savePreferences()
  applyPreferences()
  syncDialog()
}

systemLight.addEventListener('change', () => {
  if (prefs.theme === 'system') applyPreferences()
})

/* =========================================================
   SETTINGS DIALOG
========================================================= */

let dialog = null
let scrim = null
let returnFocus = null

function segmented(key, options) {
  return `
    <div class="ui-segmented" role="group" data-setting="${key}">
      ${options.map(([value, label]) => `
        <button type="button" data-value="${value}" aria-pressed="false">${label}</button>
      `).join('')}
    </div>
  `
}

function toggle(key, label, description) {
  const id = `pref-${key}`
  return `
    <div class="ui-setting">
      <label class="ui-setting__copy" for="${id}">
        <strong>${label}</strong>
        <span>${description}</span>
      </label>
      <input id="${id}" class="ui-switch" type="checkbox" role="switch" data-check="${key}">
    </div>
  `
}

function syncDialog() {
  if (!dialog) return

  dialog.querySelectorAll('[data-setting]').forEach(group => {
    group.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.value === prefs[group.dataset.setting]))
    })
  })

  dialog.querySelectorAll('[data-check]').forEach(input => {
    input.checked = Boolean(prefs[input.dataset.check])
  })

  const install = dialog.querySelector('[data-pref-install]')
  if (install) install.hidden = !window.ChemLabProduct?.canInstall?.()
}

function focusables() {
  return [...dialog.querySelectorAll('button:not([hidden]), input, [tabindex="0"]')]
    .filter(node => !node.closest('[hidden]'))
}

function openDialog() {
  if (!dialog) return
  returnFocus = document.activeElement
  syncDialog()
  scrim.hidden = false
  dialog.hidden = false
  requestAnimationFrame(() => {
    scrim.classList.add('is-open')
    dialog.classList.add('is-open')
    dialog.querySelector('[data-setting="theme"] [aria-pressed="true"]')?.focus()
  })
}

function closeDialog() {
  if (!dialog || dialog.hidden) return
  scrim.classList.remove('is-open')
  dialog.classList.remove('is-open')
  const finish = () => {
    scrim.hidden = true
    dialog.hidden = true
  }
  if (getComputedStyle(dialog).transitionDuration === '0s') finish()
  else setTimeout(finish, 220)
  if (returnFocus?.isConnected) returnFocus.focus()
}

export function initUserPreferences() {
  document.querySelector('#user-settings')?.remove()
  document.querySelector('#user-settings-scrim')?.remove()

  scrim = document.createElement('div')
  scrim.id = 'user-settings-scrim'
  scrim.className = 'ui-scrim'
  scrim.hidden = true

  dialog = document.createElement('section')
  dialog.id = 'user-settings'
  dialog.className = 'ui-dialog'
  dialog.hidden = true
  dialog.setAttribute('role', 'dialog')
  dialog.setAttribute('aria-modal', 'true')
  dialog.setAttribute('aria-labelledby', 'user-settings-title')
  dialog.innerHTML = `
    <header class="ui-dialog__head">
      <div>
        <h2 id="user-settings-title">Cài đặt</h2>
        <p>Tùy chỉnh cách ChemLab hiển thị trên thiết bị này.</p>
      </div>
      <button class="ui-icon-btn" type="button" data-pref-close aria-label="Đóng cài đặt">${icon('close')}</button>
    </header>

    <div class="ui-dialog__body">
      <div class="ui-setting">
        <div class="ui-setting__copy">
          <strong>Giao diện</strong>
          <span>Sáng, tối hoặc theo thiết bị.</span>
        </div>
        ${segmented('theme', [['system', 'Thiết bị'], ['light', 'Sáng'], ['dark', 'Tối']])}
      </div>

      <div class="ui-setting">
        <div class="ui-setting__copy">
          <strong>Cỡ chữ</strong>
          <span>Áp dụng cho toàn bộ ứng dụng.</span>
        </div>
        ${segmented('fontSize', [['small', 'Nhỏ'], ['normal', 'Vừa'], ['large', 'Lớn']])}
      </div>

      <div class="ui-setting">
        <div class="ui-setting__copy">
          <strong>Mật độ</strong>
          <span>Thoáng hoặc gọn hơn.</span>
        </div>
        ${segmented('density', [['comfortable', 'Thoáng'], ['compact', 'Gọn']])}
      </div>

      ${toggle('reduceMotion', 'Giảm chuyển động', 'Tắt hiệu ứng chuyển cảnh và animation không cần thiết.')}
      ${toggle('highContrast', 'Tương phản cao', 'Chữ và đường viền rõ hơn.')}

      <div class="ui-setting ui-setting--app">
        <div class="ui-setting__copy">
          <strong>Ứng dụng</strong>
          <span>ChemLab <span data-pref-version></span> · Hữu Nghĩa Edition</span>
        </div>
        <div class="ui-setting__actions">
          <button class="ui-btn ui-btn--sm" type="button" data-pref-about>${icon('info')}Giới thiệu</button>
          <button class="ui-btn ui-btn--sm" type="button" data-pref-install hidden>Cài ứng dụng</button>
        </div>
      </div>
    </div>

    <footer class="ui-dialog__foot">
      <button class="ui-btn ui-btn--ghost" type="button" data-pref-reset>Khôi phục mặc định</button>
      <button class="ui-btn ui-btn--primary" type="button" data-pref-close>Xong</button>
    </footer>
  `

  document.body.append(scrim, dialog)

  dialog.querySelector('[data-pref-version]').textContent =
    document.documentElement.dataset.chemlabVersion || ''

  dialog.addEventListener('click', event => {
    const option = event.target.closest('[data-setting] button')
    if (option) {
      setPreference(option.closest('[data-setting]').dataset.setting, option.dataset.value)
      return
    }

    if (event.target.closest('[data-pref-close]')) {
      closeDialog()
      return
    }

    if (event.target.closest('[data-pref-reset]')) {
      prefs = { ...DEFAULTS }
      savePreferences()
      applyPreferences()
      syncDialog()
      return
    }

    if (event.target.closest('[data-pref-about]')) {
      closeDialog()
      window.ChemLabProduct?.openAbout?.()
      return
    }

    if (event.target.closest('[data-pref-install]')) {
      window.ChemLabProduct?.install?.()
    }
  })

  dialog.addEventListener('change', event => {
    const input = event.target.closest('[data-check]')
    if (input) setPreference(input.dataset.check, input.checked)
  })

  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeDialog()
      return
    }

    if (event.key !== 'Tab') return
    const nodes = focusables()
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    }
    else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  })

  scrim.addEventListener('click', closeDialog)

  window.ChemLabPreferences = Object.freeze({
    open: openDialog,
    close: closeDialog,
    get: getPreferences,
    set: setPreference
  })
}
