/* =========================================================
   PERIODIC WORKSPACE
   Interactive table (spatial keyboard navigation, group/period
   highlighting, live preview), phone-friendly list view and an
   element detail sheet. Data lives in periodicData.js.
========================================================= */

import './periodic.css'
import {
  ELEMENTS,
  CATEGORIES,
  BLOCKS,
  STATES,
  getElement,
  formatMass,
  searchElements
} from './periodicData.js'
import { orbitalBoxes, SHELL_LETTERS } from '../chem/electronConfiguration.js'
import { getCommonOxidationStates, formatOxidationState } from '../chem/oxidationStates.js'
import { icon } from '../shell/icons.js'

const STORAGE_KEY = 'chemlab-v5-periodic'

/* IUPAC group → the A/B notation still used in Vietnamese textbooks. */
const GROUP_AB = Object.freeze({
  1: 'IA', 2: 'IIA', 3: 'IIIB', 4: 'IVB', 5: 'VB', 6: 'VIB', 7: 'VIIB', 8: 'VIIIB', 9: 'VIIIB',
  10: 'VIIIB', 11: 'IB', 12: 'IIB', 13: 'IIIA', 14: 'IVA', 15: 'VA', 16: 'VIA', 17: 'VIIA', 18: 'VIIIA'
})

const COLOR_MODES = Object.freeze({
  category: { label: 'Loại', groups: CATEGORIES, key: 'category' },
  block: { label: 'Khối', groups: BLOCKS, key: 'block' },
  state: { label: 'Trạng thái', groups: STATES, key: 'state' }
})

const TABS = Object.freeze([
  ['overview', 'Tổng quan'],
  ['electron', 'Electron'],
  ['ion', 'Ion · số oxi hóa'],
  ['isotope', 'Đồng vị'],
  ['compare', 'So sánh']
])

const QUICK_ACTIONS = Object.freeze([
  ['ion', 'ion', 'Ion Engine', 'Ghép ion thành hợp chất'],
  ['molar', 'calculator', 'Khối lượng mol', 'Tính toán với nguyên tố'],
  ['solubility', 'droplets', 'Tính tan', 'Tra muối và dung dịch'],
  ['lab', 'lab', 'Phòng thí nghiệm', 'Tìm hóa chất chứa nguyên tố']
])

const F_ROW = { lanthanide: 10, actinide: 11 }

/* Ion and isotope tables load lazily; periodicApi is set once they arrive. */
let periodicApi = null
let periodicDataPromise = null

function loadPeriodicData() {
  periodicDataPromise ??= import('../periodicDataV5.js')
    .then(module => {
      periodicApi = module
      return module
    })
    .catch(error => {
      console.error('[ChemLab] periodicDataV5:', error)
      periodicDataPromise = null
      return null
    })
  return periodicDataPromise
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char])
}

function readPreferences() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}
  }
  catch {
    return {}
  }
}

function gridPosition(element) {
  if (element.fIndex !== null) {
    return { row: element.category === 'actinide' ? F_ROW.actinide : F_ROW.lanthanide, col: element.fIndex + 4 }
  }
  return { row: element.period + 1, col: element.group + 1 }
}

function groupLabel(element) {
  if (!element.group) return element.category === 'actinide' ? 'Họ Actinide' : 'Họ Lanthanide'
  return `${element.group} (${GROUP_AB[element.group]})`
}

export function initPeriodicWorkspace({ root, drawer } = {}) {
  root ??= document.querySelector('#periodic-workspace-root')
  drawer ??= document.querySelector('#element-drawer')
  if (!root || !drawer) {
    console.error('[ChemLab] Periodic Workspace không tìm thấy root hoặc drawer.')
    return
  }

  const saved = readPreferences()
  const narrow = window.matchMedia('(max-width: 767px)')
  const state = {
    query: '',
    filter: null,
    colorMode: COLOR_MODES[saved.colorMode] ? saved.colorMode : 'category',
    layout: saved.layout === 'compact' ? 'compact' : 'standard',
    view: saved.view === 'list' ? 'list' : 'table',
    preview: 1,
    focused: 1,
    current: null,
    tab: 'overview',
    compare: null,
    returnFocus: null
  }

  root.innerHTML = `
    <section class="pt">
      <header class="ui-page-head pt-head">
        <div>
          <span class="ui-eyebrow">118 nguyên tố · 7 chu kỳ · 18 nhóm</span>
          <h1>Bảng tuần hoàn</h1>
          <p>Di chuột hoặc dùng phím mũi tên để xem nhanh; chọn một nguyên tố để mở cấu hình electron, ion, đồng vị và mô hình 3D.</p>
        </div>
      </header>

      <div class="pt-toolbar">
        <label class="pt-search">
          ${icon('search')}
          <span class="sr-only">Tìm nguyên tố</span>
          <input id="periodic-search" type="search" autocomplete="off" spellcheck="false"
            placeholder="Tìm theo tên, ký hiệu hoặc số hiệu (vd: Fe, Oxygen, 29)" aria-describedby="pt-result">
          <kbd class="ui-kbd" aria-hidden="true">/</kbd>
        </label>
        <div class="ui-segmented" role="group" aria-label="Tô màu theo" data-pt-color>
          ${Object.entries(COLOR_MODES).map(([key, mode]) => `<button type="button" data-color="${key}">${mode.label}</button>`).join('')}
        </div>
        <div class="ui-segmented" role="group" aria-label="Kiểu hiển thị" data-pt-view>
          <button type="button" data-view-mode="table">Bảng</button>
          <button type="button" data-view-mode="list">Danh sách</button>
        </div>
        <button class="ui-btn ui-btn--ghost ui-btn--sm pt-density" type="button" data-pt-layout aria-pressed="false">Thu gọn ô</button>
      </div>

      <div class="pt-filters" role="group" aria-label="Lọc nguyên tố" data-pt-filters></div>
      <p id="pt-result" class="pt-result" aria-live="polite"></p>

      <div class="pt-table-wrap" data-pt-table-wrap>
        <div class="pt-table" role="grid" aria-label="Bảng tuần hoàn các nguyên tố hóa học" data-pt-table></div>
      </div>
      <p class="pt-scroll-hint">${icon('arrowRight')} Vuốt ngang để xem toàn bộ bảng</p>

      <ol class="pt-list" data-pt-list hidden></ol>
    </section>
  `

  const table = root.querySelector('[data-pt-table]')
  const tableWrap = root.querySelector('[data-pt-table-wrap]')
  const list = root.querySelector('[data-pt-list]')
  const filters = root.querySelector('[data-pt-filters]')
  const result = root.querySelector('#pt-result')
  const search = root.querySelector('#periodic-search')
  const scrollHint = root.querySelector('.pt-scroll-hint')

  /* ---------- matching ---------- */

  function matches() {
    const ranked = state.query ? searchElements(state.query) : ELEMENTS
    const key = COLOR_MODES[state.colorMode].key
    return ranked.filter(element => !state.filter || element[key] === state.filter)
  }

  /* ---------- table ---------- */

  function cellHTML(element) {
    const { row, col } = gridPosition(element)
    const category = CATEGORIES[element.category].label
    return `
      <button class="pt-cell" type="button" role="gridcell" tabindex="-1"
        data-number="${element.number}" data-cat="${element.category}" data-block="${element.block}" data-state="${element.state}"
        data-group="${element.group ?? ''}" data-period="${element.period}" data-row="${row}" data-col="${col}"
        style="grid-row:${row};grid-column:${col}"
        aria-label="${element.number}, ${element.symbol}, ${escapeHTML(element.name)}, ${category}">
        <span class="pt-cell__z">${element.number}</span>
        <strong class="pt-cell__symbol">${element.symbol}</strong>
        <span class="pt-cell__name">${escapeHTML(element.name)}</span>
        <span class="pt-cell__mass">${formatMass(element.mass)}</span>
      </button>
    `
  }

  function renderTable() {
    const pieces = []
    for (let group = 1; group <= 18; group += 1) {
      pieces.push(`<span class="pt-label pt-label--group" data-label-group="${group}" style="grid-row:1;grid-column:${group + 1}" aria-hidden="true">${group}<small>${GROUP_AB[group]}</small></span>`)
    }
    for (let period = 1; period <= 7; period += 1) {
      pieces.push(`<span class="pt-label pt-label--period" data-label-period="${period}" style="grid-row:${period + 1};grid-column:1" aria-hidden="true">${period}</span>`)
    }
    pieces.push('<div class="pt-preview" data-pt-preview style="grid-row:2 / span 3;grid-column:4 / span 10" aria-hidden="true"></div>')

    // Grid semantics need cells inside rows; rows use display: contents so the CSS grid placement is unchanged.
    const rows = new Map()
    const addToRow = (row, html) => rows.set(row, [...(rows.get(row) || []), html])
    addToRow(7, `
      <button class="pt-series" type="button" role="gridcell" tabindex="-1" data-series="lanthanide" data-row="7" data-col="4" style="grid-row:7;grid-column:4">
        <span class="sr-only">Họ Lanthanide, nguyên tố</span><span>57–71</span><strong>La–Lu</strong>
      </button>`)
    addToRow(8, `
      <button class="pt-series" type="button" role="gridcell" tabindex="-1" data-series="actinide" data-row="8" data-col="4" style="grid-row:8;grid-column:4">
        <span class="sr-only">Họ Actinide, nguyên tố</span><span>89–103</span><strong>Ac–Lr</strong>
      </button>`)
    addToRow(F_ROW.lanthanide, `<span class="pt-f-label" role="rowheader" style="grid-row:${F_ROW.lanthanide};grid-column:1 / span 3">Họ Lanthanide</span>`)
    addToRow(F_ROW.actinide, `<span class="pt-f-label" role="rowheader" style="grid-row:${F_ROW.actinide};grid-column:1 / span 3">Họ Actinide</span>`)
    for (const element of ELEMENTS) addToRow(gridPosition(element).row, cellHTML(element))

    for (const row of [...rows.keys()].sort((a, b) => a - b)) {
      pieces.push(`<div class="pt-grid-row" role="row">${rows.get(row).join('')}</div>`)
    }
    table.innerHTML = pieces.join('')
    syncTabStop()
  }

  function applyFilters() {
    const visible = matches()
    const visibleSet = new Set(visible.map(element => element.number))
    const filtered = Boolean(state.query || state.filter)

    table.querySelectorAll('.pt-cell').forEach(cell => {
      cell.classList.toggle('is-dim', filtered && !visibleSet.has(Number(cell.dataset.number)))
    })
    table.querySelector('.pt-cell.is-top')?.classList.remove('is-top')
    if (state.query && visible[0]) table.querySelector(`.pt-cell[data-number="${visible[0].number}"]`)?.classList.add('is-top')

    result.textContent = filtered
      ? (visible.length ? `${visible.length} nguyên tố phù hợp${state.query && visible[0] ? ` · Enter để mở ${visible[0].symbol}` : ''}` : 'Không có nguyên tố phù hợp.')
      : ''
    renderList(visible)
  }

  /* ---------- list ---------- */

  function renderList(visible = matches()) {
    if (state.view !== 'list') return
    list.innerHTML = visible.length
      ? visible.map(element => `
          <li>
            <button class="pt-row" type="button" data-number="${element.number}" data-cat="${element.category}" data-block="${element.block}" data-state="${element.state}">
              <span class="pt-row__tile"><small>${element.number}</small>${element.symbol}</span>
              <span class="pt-row__copy">
                <strong>${escapeHTML(element.name)}</strong>
                <span>${CATEGORIES[element.category].label} · Chu kỳ ${element.period} · Khối ${element.block}</span>
              </span>
              <span class="pt-row__mass">${formatMass(element.mass)}</span>
            </button>
          </li>
        `).join('')
      : '<li class="ui-state"><strong>Không có nguyên tố phù hợp</strong><span>Thử từ khóa khác hoặc bỏ bộ lọc.</span></li>'
  }

  /* ---------- filters & controls ---------- */

  function renderFilters() {
    const mode = COLOR_MODES[state.colorMode]
    const counts = {}
    for (const element of ELEMENTS) counts[element[mode.key]] = (counts[element[mode.key]] || 0) + 1

    filters.innerHTML = `
      <button class="ui-chip" type="button" data-filter="" aria-pressed="${!state.filter}">Tất cả <span class="pt-count">118</span></button>
      ${Object.entries(mode.groups).filter(([key]) => counts[key]).map(([key, group]) => `
        <button class="ui-chip pt-chip" type="button" data-filter="${key}" data-${mode.key === 'category' ? 'cat' : mode.key}="${key}" aria-pressed="${state.filter === key}">
          <i aria-hidden="true"></i>${group.label} <span class="pt-count">${counts[key]}</span>
        </button>
      `).join('')}
    `
  }

  function syncControls() {
    root.querySelectorAll('[data-color]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.color === state.colorMode)))
    root.querySelectorAll('[data-view-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.viewMode === state.view)))
    root.querySelector('[data-pt-layout]').setAttribute('aria-pressed', String(state.layout === 'compact'))
    root.querySelector('.pt').dataset.colorMode = state.colorMode
    root.querySelector('.pt').dataset.layout = state.layout
    tableWrap.hidden = state.view !== 'table'
    scrollHint.hidden = state.view !== 'table'
    list.hidden = state.view !== 'list'
  }

  function savePreferences() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ layout: state.layout, colorMode: state.colorMode, view: state.view }))
    }
    catch {
      /* ignore */
    }
  }

  /* ---------- preview & relations ---------- */

  function renderPreview(number) {
    const element = getElement(number)
    const host = table.querySelector('[data-pt-preview]')
    if (!element || !host) return
    state.preview = element.number
    host.dataset.cat = element.category
    host.dataset.block = element.block
    host.dataset.state = element.state
    host.innerHTML = `
      <div class="pt-preview__tile">
        <span>${element.number}</span>
        <strong>${element.symbol}</strong>
        <small>${formatMass(element.mass)}</small>
      </div>
      <div class="pt-preview__copy">
        <strong>${escapeHTML(element.name)}</strong>
        <span>${CATEGORIES[element.category].label}</span>
        <code>${escapeHTML(element.electron.condensed)}</code>
        <span class="pt-preview__meta">Chu kỳ ${element.period} · ${element.group ? `Nhóm ${groupLabel(element)}` : groupLabel(element)} · Khối ${element.block}</span>
      </div>
    `
  }

  function highlightRelations(number) {
    const element = getElement(number)
    table.querySelectorAll('.is-related, .is-label-active').forEach(node => node.classList.remove('is-related', 'is-label-active'))
    if (!element) return
    if (element.group) {
      table.querySelectorAll(`.pt-cell[data-group="${element.group}"]`).forEach(cell => cell.classList.add('is-related'))
      table.querySelector(`[data-label-group="${element.group}"]`)?.classList.add('is-label-active')
    }
    if (element.fIndex === null) {
      table.querySelectorAll(`.pt-cell[data-period="${element.period}"][data-group]:not([data-group=""])`).forEach(cell => cell.classList.add('is-related'))
      table.querySelector(`[data-label-period="${element.period}"]`)?.classList.add('is-label-active')
    }
  }

  /* ---------- keyboard: roving tabindex + spatial arrows ---------- */

  function navigables() {
    return [...table.querySelectorAll('.pt-cell, .pt-series')]
  }

  function syncTabStop() {
    const target = table.querySelector(`.pt-cell[data-number="${state.focused}"]`) || table.querySelector('.pt-cell')
    navigables().forEach(node => {
      node.tabIndex = node === target ? 0 : -1
    })
  }

  function moveFocus(from, key) {
    const row = Number(from.dataset.row)
    const col = Number(from.dataset.col)
    const nodes = navigables().map(node => ({ node, row: Number(node.dataset.row), col: Number(node.dataset.col) }))
    let candidates = []

    if (key === 'ArrowRight') candidates = nodes.filter(item => item.row === row && item.col > col).sort((a, b) => a.col - b.col)
    else if (key === 'ArrowLeft') candidates = nodes.filter(item => item.row === row && item.col < col).sort((a, b) => b.col - a.col)
    else if (key === 'Home') candidates = nodes.filter(item => item.row === row).sort((a, b) => a.col - b.col)
    else if (key === 'End') candidates = nodes.filter(item => item.row === row).sort((a, b) => b.col - a.col)
    else {
      const down = key === 'ArrowDown'
      const rows = [...new Set(nodes.map(item => item.row))].filter(r => (down ? r > row : r < row)).sort((a, b) => (down ? a - b : b - a))
      for (const target of rows) {
        const inRow = nodes.filter(item => item.row === target).sort((a, b) => Math.abs(a.col - col) - Math.abs(b.col - col))
        if (inRow.length) {
          candidates = inRow
          break
        }
      }
    }

    const next = candidates[0]?.node
    if (!next) return
    navigables().forEach(node => {
      node.tabIndex = -1
    })
    next.tabIndex = 0
    next.focus()
    next.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    if (next.dataset.number) state.focused = Number(next.dataset.number)
  }

  function focusSeries(series) {
    const first = series === 'actinide' ? 89 : 57
    const cell = table.querySelector(`.pt-cell[data-number="${first}"]`)
    if (!cell) return
    navigables().forEach(node => {
      node.tabIndex = -1
    })
    cell.tabIndex = 0
    cell.focus()
    cell.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
    const row = Number(cell.dataset.row)
    table.querySelectorAll(`.pt-cell[data-row="${row}"]`).forEach(node => {
      node.classList.remove('is-flash')
      void node.offsetWidth
      node.classList.add('is-flash')
    })
  }

  /* =========================================================
     DETAIL SHEET
  ========================================================= */

  function ensureBackdrop() {
    let backdrop = document.querySelector('#element-drawer-backdrop')
    if (!backdrop) {
      backdrop = document.createElement('div')
      backdrop.id = 'element-drawer-backdrop'
      backdrop.className = 'ui-scrim pt-scrim'
      backdrop.hidden = true
      backdrop.addEventListener('click', closeDrawer)
      drawer.parentElement.insertBefore(backdrop, drawer)
    }
    return backdrop
  }

  drawer.classList.add('pt-drawer')
  drawer.setAttribute('role', 'dialog')
  drawer.setAttribute('aria-modal', 'true')
  drawer.setAttribute('aria-labelledby', 'ptd-title')
  drawer.setAttribute('aria-hidden', 'true')
  drawer.innerHTML = ''

  async function openElement(number, { tab = 'overview' } = {}) {
    const element = getElement(number)
    if (!element) return

    if (!drawer.classList.contains('open')) state.returnFocus = document.activeElement
    state.current = element
    state.focused = element.number
    state.tab = tab
    if (!state.compare || state.compare === element.number) state.compare = element.number < 118 ? element.number + 1 : element.number - 1

    renderDrawer()
    syncTabStop()

    const backdrop = ensureBackdrop()
    backdrop.hidden = false
    drawer.hidden = false
    drawer.setAttribute('aria-hidden', 'false')
    const focusClose = () => drawer.querySelector('[data-ptd-close]')?.focus({ preventScroll: true })
    requestAnimationFrame(() => {
      backdrop.classList.add('is-open')
      drawer.classList.add('open')
      // Reduced motion forces a 1 ms visibility transition, so the drawer can still be hidden here: retry for a few frames.
      let tries = 0
      const tryFocus = () => {
        focusClose()
        if (!drawer.contains(document.activeElement) && drawer.classList.contains('open') && tries++ < 10) requestAnimationFrame(tryFocus)
      }
      tryFocus()
    })

    if (tab === 'ion' || tab === 'isotope') {
      await loadPeriodicData()
      if (state.current === element) renderDrawer()
    }
  }

  function closeDrawer() {
    if (!drawer.classList.contains('open')) return
    drawer.classList.remove('open')
    drawer.setAttribute('aria-hidden', 'true')
    const backdrop = document.querySelector('#element-drawer-backdrop')
    if (backdrop) {
      backdrop.classList.remove('is-open')
      backdrop.hidden = true
    }
    const target = state.returnFocus?.isConnected && state.returnFocus !== document.body
      ? state.returnFocus
      : table.querySelector(`.pt-cell[data-number="${state.current?.number}"]`)
    target?.focus({ preventScroll: true })
  }

  function fact(label, value, wide = false) {
    return `<div class="${wide ? 'is-wide' : ''}"><dt>${label}</dt><dd>${value}</dd></div>`
  }

  function overviewPanel(element) {
    return `
      <dl class="ptd-facts">
        ${fact('Số hiệu nguyên tử', `Z = ${element.number}`)}
        ${fact('Nguyên tử khối', formatMass(element.mass))}
        ${fact('Chu kỳ', element.period)}
        ${fact('Nhóm', element.group ? groupLabel(element) : groupLabel(element))}
        ${fact('Khối', element.block)}
        ${fact('Trạng thái (25 °C)', STATES[element.state].label)}
        ${fact('Phân loại', CATEGORIES[element.category].label, true)}
        ${fact('Cấu hình electron', `<code>${escapeHTML(element.electron.condensed)}</code>`, true)}
      </dl>
      ${Number.isInteger(element.mass) ? '<p class="ptd-note">Số trong ngoặc vuông là số khối của đồng vị bền nhất (nguyên tố không có nguyên tử khối chuẩn).</p>' : ''}
      ${element.predicted ? '<p class="ptd-note">Nguyên tố siêu nặng: mới chỉ tạo được vài nguyên tử, nhiều tính chất là <strong>dự đoán lý thuyết</strong>.</p>' : ''}
      ${element.state === 'unknown' ? '<p class="ptd-note">Chưa thu được lượng chất đủ lớn để xác định trạng thái ở điều kiện thường.</p>' : ''}
    `
  }

  function electronPanel(element) {
    const electron = element.electron
    return `
      <div class="ptd-config">
        <span>Cấu hình đầy đủ</span>
        <code>${escapeHTML(electron.full)}</code>
        <span>Viết gọn</span>
        <code>${escapeHTML(electron.condensed)}</code>
        <span>Thứ tự điền theo năng lượng</span>
        <code class="is-muted">${escapeHTML(electron.aufbauOrder)}</code>
      </div>
      ${electron.isException ? `<p class="ptd-note ptd-note--accent"><strong>Ngoại lệ:</strong> ${escapeHTML(electron.exceptionNote)}</p>` : ''}
      ${electron.predicted ? '<p class="ptd-note">Cấu hình là dự đoán lý thuyết.</p>' : ''}

      <h3 class="ptd-subhead">Electron theo lớp</h3>
      <ol class="ptd-shells">
        ${electron.shells.map((count, index) => `<li class="${index === electron.shells.length - 1 ? 'is-outer' : ''}"><b>${SHELL_LETTERS[index]}</b><span>${count}</span></li>`).join('')}
      </ol>
      <dl class="ptd-facts">
        ${fact('Electron lớp ngoài cùng', electron.outerShellElectrons)}
        ${fact('Electron độc thân', electron.unpairedElectrons)}
      </dl>

      <h3 class="ptd-subhead">Sơ đồ ô orbital (lớp ngoài)</h3>
      <div class="ptd-boxes">
        ${electron.subshells.filter(sub => sub.n >= electron.shells.length - 1).map(sub => `
          <div class="ptd-sub">
            <span>${sub.label}<sup>${sub.electrons}</sup></span>
            <div>${orbitalBoxes(sub).map(count => `<i>${count >= 1 ? '↑' : ''}${count === 2 ? '↓' : ''}</i>`).join('')}</div>
          </div>
        `).join('')}
      </div>
      <button class="ui-btn ui-btn--block" type="button" data-ptd-orbital>${icon('atom')} Xem hình dạng orbital 3D</button>
    `
  }

  function ionPanel(element) {
    const api = periodicApi
    const list = api?.getCommonIons?.(element) || []
    const oxidation = getCommonOxidationStates(element.number)
    return `
      <h3 class="ptd-subhead">Ion đơn nguyên tử thường gặp</h3>
      ${api ? (list.length ? `
        <div class="ptd-chips">${list.map(ion => `<span class="ptd-ion"><strong>${ion.formula}</strong><small>${ion.type === 'Cation' ? 'Cation' : 'Anion'} · ${ion.charge}</small></span>`).join('')}</div>
      ` : '<p class="ptd-muted">Không thường tồn tại dưới dạng ion đơn nguyên tử trong hóa học phổ thông.</p>')
      : `<p class="ptd-muted">Đang tải dữ liệu ion…</p>`}
      <h3 class="ptd-subhead">Số oxi hóa thường gặp</h3>
      ${oxidation ? `
        <div class="ptd-chips">${oxidation.map(value => `<span class="ptd-ox ${value > 0 ? 'is-pos' : value < 0 ? 'is-neg' : ''}">${formatOxidationState(value)}</span>`).join('')}</div>
        <p class="ptd-muted">Ngoài ra, mọi nguyên tố có số oxi hóa 0 ở dạng đơn chất.</p>
      ` : '<p class="ptd-muted">ChemLab chưa có dữ liệu số oxi hóa được kiểm chứng cho nguyên tố này.</p>'}
    `
  }

  function isotopePanel(element) {
    const api = periodicApi
    if (!api) return '<p class="ptd-muted">Đang tải dữ liệu đồng vị…</p>'
    const isotopes = api.getIsotopes(element) || []
    if (!isotopes.length) return '<p class="ptd-muted">Chưa có dữ liệu đồng vị.</p>'
    const generated = isotopes.some(item => item.generated)
    return `
      <ul class="ptd-isotopes">
        ${isotopes.map(item => `
          <li>
            <strong>${item.name}</strong>
            <span>Số khối ${item.mass} · ${element.number} proton · ${item.mass - element.number} neutron</span>
            <span class="ui-badge ${item.status === 'radioactive' ? 'ui-badge--warning' : item.status === 'natural' ? 'ui-badge--success' : ''}">${escapeHTML(item.abundance)}</span>
          </li>
        `).join('')}
      </ul>
      ${generated ? '<p class="ptd-note">Chưa có bảng độ phổ biến được kiểm chứng; ChemLab chỉ hiển thị đồng vị tham khảo theo số khối.</p>' : ''}
    `
  }

  function comparePanel(element) {
    const other = getElement(state.compare) || getElement(element.number === 1 ? 2 : 1)
    const rows = [
      ['Số hiệu', element.number, other.number],
      ['Nguyên tử khối', formatMass(element.mass), formatMass(other.mass)],
      ['Chu kỳ', element.period, other.period],
      ['Nhóm', groupLabel(element), groupLabel(other)],
      ['Khối', element.block, other.block],
      ['Phân loại', CATEGORIES[element.category].label, CATEGORIES[other.category].label],
      ['Trạng thái', STATES[element.state].label, STATES[other.state].label],
      ['Cấu hình', `<code>${escapeHTML(element.electron.condensed)}</code>`, `<code>${escapeHTML(other.electron.condensed)}</code>`],
      ['e lớp ngoài cùng', element.electron.outerShellElectrons, other.electron.outerShellElectrons],
      ['e độc thân', element.electron.unpairedElectrons, other.electron.unpairedElectrons]
    ]
    return `
      <label class="ptd-compare-select">
        <span>So sánh ${element.symbol} với</span>
        <select class="ui-input ui-select" data-ptd-compare>
          ${ELEMENTS.filter(item => item.number !== element.number).map(item => `<option value="${item.number}" ${item.number === other.number ? 'selected' : ''}>${item.number} · ${item.symbol} — ${escapeHTML(item.name)}</option>`).join('')}
        </select>
      </label>
      <table class="ptd-compare">
        <thead><tr><th scope="col"><span class="sr-only">Thuộc tính</span></th><th scope="col">${element.symbol}</th><th scope="col">${other.symbol}</th></tr></thead>
        <tbody>${rows.map(([label, a, b]) => `<tr><th scope="row">${label}</th><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody>
      </table>
    `
  }

  function panelFor(element) {
    switch (state.tab) {
      case 'electron': return electronPanel(element)
      case 'ion': return ionPanel(element)
      case 'isotope': return isotopePanel(element)
      case 'compare': return comparePanel(element)
      default: return overviewPanel(element)
    }
  }

  function renderDrawer() {
    const element = state.current
    if (!element) return
    drawer.dataset.cat = element.category
    drawer.innerHTML = `
      <div class="ptd">
        <header class="ptd-head">
          <span class="ptd-pos">Nguyên tố ${element.number}/118</span>
          <div class="ptd-nav">
            <button class="ui-icon-btn" type="button" data-ptd-prev ${element.number === 1 ? 'disabled' : ''} aria-label="Nguyên tố trước">${icon('chevronRight', 'ui-icon ptd-flip')}</button>
            <button class="ui-icon-btn" type="button" data-ptd-next ${element.number === 118 ? 'disabled' : ''} aria-label="Nguyên tố sau">${icon('chevronRight')}</button>
            <button class="ui-icon-btn" type="button" data-ptd-close aria-label="Đóng thông tin nguyên tố">${icon('close')}</button>
          </div>
        </header>

        <div class="ptd-scroll">
          <section class="ptd-hero" data-cat="${element.category}">
            <div class="ptd-tile">
              <span>${element.number}</span>
              <strong>${element.symbol}</strong>
              <small>${formatMass(element.mass)}</small>
            </div>
            <div class="ptd-hero__copy">
              <h2 id="ptd-title">${escapeHTML(element.name)}</h2>
              <span class="ptd-cat"><i aria-hidden="true"></i>${CATEGORIES[element.category].label}</span>
              <p>Chu kỳ ${element.period} · ${element.group ? `Nhóm ${groupLabel(element)}` : groupLabel(element)} · Khối ${element.block}</p>
            </div>
          </section>

          <div class="ptd-actions">
            <button class="ui-btn ui-btn--primary" type="button" data-ptd-atom>${icon('atom')}Mô hình nguyên tử</button>
            <button class="ui-btn" type="button" data-ptd-orbital>${icon('sparkle')}Orbital 3D</button>
            <button class="ui-btn ui-btn--ghost" type="button" data-ptd-ai>${icon('ai')}Hỏi ChemAI</button>
          </div>

          <div class="ptd-tabs" role="tablist" aria-label="Thông tin ${escapeHTML(element.name)}">
            ${TABS.map(([id, label]) => `
              <button type="button" role="tab" id="ptd-tab-${id}" aria-controls="ptd-panel" aria-selected="${state.tab === id}" tabindex="${state.tab === id ? 0 : -1}" data-ptd-tab="${id}">${label}</button>
            `).join('')}
          </div>

          <section id="ptd-panel" class="ptd-panel" role="tabpanel" aria-labelledby="ptd-tab-${state.tab}" tabindex="0">
            ${panelFor(element)}
          </section>

          <section class="ptd-use" aria-labelledby="ptd-use-title">
            <h3 id="ptd-use-title" class="ptd-subhead">Dùng ${element.symbol} trong ChemLab</h3>
            <div class="ptd-use__grid">
              ${QUICK_ACTIONS.map(([id, iconName, title, copy]) => `
                <button type="button" data-ptd-action="${id}">
                  <span>${icon(iconName)}</span>
                  <strong>${title}</strong>
                  <small>${copy}</small>
                </button>
              `).join('')}
            </div>
          </section>
        </div>
      </div>
    `
  }

  async function selectTab(tab) {
    state.tab = tab
    if (tab === 'ion' || tab === 'isotope') {
      renderDrawer()
      await loadPeriodicData()
    }
    renderDrawer()
    drawer.querySelector(`[data-ptd-tab="${tab}"]`)?.focus()
  }

  async function runQuickAction(destination) {
    const element = state.current
    if (!element) return
    try {
      const [bridge, data] = await Promise.all([import('../chemContextBridge.js'), loadPeriodicData()])
      const ions = data?.getCommonIons?.(element) || []
      closeDrawer()
      bridge.openElementDestination(destination, element, { ions })
    }
    catch (error) {
      console.error('[ChemLab] Quick action:', error)
    }
  }

  async function openAtomic(mode) {
    const element = state.current
    if (!element) return
    const { openAtomicExplorer } = await import('../atomic/atomicExplorer.js')
    await openAtomicExplorer(element.number, { mode })
  }

  /* ---------- drawer events ---------- */

  drawer.addEventListener('click', event => {
    const target = event.target
    if (target.closest('[data-ptd-close]')) return closeDrawer()
    if (target.closest('[data-ptd-prev]') && state.current) return openElement(state.current.number - 1, { tab: state.tab })
    if (target.closest('[data-ptd-next]') && state.current) return openElement(state.current.number + 1, { tab: state.tab })
    const tab = target.closest('[data-ptd-tab]')
    if (tab) return selectTab(tab.dataset.ptdTab)
    if (target.closest('[data-ptd-atom]')) return openAtomic('shell')
    if (target.closest('[data-ptd-orbital]')) return openAtomic('orbital')
    if (target.closest('[data-ptd-ai]') && state.current) {
      const element = state.current
      return window.ChemLabApp?.openChemAI(`Giải thích giúp mình về nguyên tố ${element.name} (${element.symbol}): cấu hình electron, vị trí trong bảng tuần hoàn và tính chất hóa học đặc trưng.`)
    }
    const action = target.closest('[data-ptd-action]')
    if (action) return runQuickAction(action.dataset.ptdAction)
    return undefined
  })

  drawer.addEventListener('change', event => {
    if (event.target.matches('[data-ptd-compare]')) {
      state.compare = Number(event.target.value)
      renderDrawer()
      drawer.querySelector('[data-ptd-compare]')?.focus()
    }
  })

  drawer.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      closeDrawer()
      return
    }

    const tab = event.target.closest('[data-ptd-tab]')
    if (tab && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault()
      const ids = TABS.map(([id]) => id)
      const index = ids.indexOf(tab.dataset.ptdTab)
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? ids.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + ids.length) % ids.length
      selectTab(ids[next])
      return
    }

    if (event.key !== 'Tab') return
    const nodes = [...drawer.querySelectorAll('button:not([disabled]), select, [tabindex="0"]')]
      .filter(node => node.offsetParent !== null)
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

  /* ---------- workspace events ---------- */

  search.addEventListener('input', () => {
    state.query = search.value
    applyFilters()
  })

  search.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      const first = matches()[0]
      if (first) openElement(first.number)
    }
    if (event.key === 'Escape' && search.value) {
      event.stopPropagation()
      search.value = ''
      state.query = ''
      applyFilters()
    }
  })

  root.addEventListener('click', event => {
    const target = event.target
    const cell = target.closest('.pt-cell, .pt-row')
    if (cell) {
      openElement(Number(cell.dataset.number))
      return
    }
    const series = target.closest('[data-series]')
    if (series) {
      focusSeries(series.dataset.series)
      return
    }
    const filter = target.closest('[data-filter]')
    if (filter) {
      state.filter = filter.dataset.filter || null
      renderFilters()
      applyFilters()
      return
    }
    const color = target.closest('[data-color]')
    if (color) {
      state.colorMode = color.dataset.color
      state.filter = null
      savePreferences()
      syncControls()
      renderFilters()
      applyFilters()
      return
    }
    const view = target.closest('[data-view-mode]')
    if (view) {
      state.view = view.dataset.viewMode
      savePreferences()
      syncControls()
      applyFilters()
      return
    }
    if (target.closest('[data-pt-layout]')) {
      state.layout = state.layout === 'compact' ? 'standard' : 'compact'
      savePreferences()
      syncControls()
    }
  })

  table.addEventListener('pointerover', event => {
    const cell = event.target.closest('.pt-cell')
    if (!cell || Number(cell.dataset.number) === state.preview) return
    renderPreview(cell.dataset.number)
    highlightRelations(Number(cell.dataset.number))
  })

  table.addEventListener('pointerleave', () => highlightRelations(null))

  table.addEventListener('focusin', event => {
    const cell = event.target.closest('.pt-cell')
    if (!cell) return
    state.focused = Number(cell.dataset.number)
    renderPreview(cell.dataset.number)
    highlightRelations(state.focused)
  })

  table.addEventListener('focusout', event => {
    if (!table.contains(event.relatedTarget)) highlightRelations(null)
  })

  table.addEventListener('keydown', event => {
    const from = event.target.closest('.pt-cell, .pt-series')
    if (!from) return
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault()
      moveFocus(from, event.key)
    }
  })

  function updateScrollHint() {
    scrollHint.classList.toggle('is-visible', tableWrap.scrollWidth > tableWrap.clientWidth + 2)
  }
  new ResizeObserver(updateScrollHint).observe(tableWrap)
  narrow.addEventListener('change', updateScrollHint)

  /* ---------- public bridge ---------- */

  window.ChemLabPeriodic = Object.freeze({
    openElement: number => openElement(Number(number)),
    close: closeDrawer,
    context() {
      const element = drawer.classList.contains('open') ? state.current : null
      if (!element) return null
      return {
        number: element.number,
        symbol: element.symbol,
        name: element.name,
        category: CATEGORIES[element.category].label,
        period: element.period,
        group: element.group,
        block: element.block,
        configuration: element.electron.condensed,
        tab: state.tab
      }
    }
  })

  /* ---------- first render ---------- */

  renderTable()
  renderPreview(1)
  renderFilters()
  syncControls()
  applyFilters()

  // Warm the optional ion/isotope data after the table is on screen.
  setTimeout(loadPeriodicData, 1200)
}
