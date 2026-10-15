/* =========================================================
   COMMAND PALETTE (Ctrl/⌘ K)
   Accessible combobox-style list: arrow keys move, Enter runs,
   Esc closes, focus returns to the element that opened it.
========================================================= */

import { icon } from './icons.js'

export function normalizeSearch(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .trim()
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char])
}

export function createCommandPalette({ commands, onRun }) {
  const layer = document.createElement('div')
  layer.id = 'command-palette'
  layer.className = 'app-command'
  layer.hidden = true
  layer.innerHTML = `
    <div class="app-command__scrim" data-command-dismiss></div>
    <section class="app-command__panel" role="dialog" aria-modal="true" aria-label="Tìm kiếm nhanh trong ChemLab">
      <div class="app-command__search">
        ${icon('search')}
        <input
          id="command-input"
          type="search"
          autocomplete="off"
          spellcheck="false"
          placeholder="Tìm khu vực, công cụ hoặc thao tác…"
          role="combobox"
          aria-expanded="true"
          aria-controls="command-results"
          aria-autocomplete="list"
        >
        <kbd class="ui-kbd">Esc</kbd>
      </div>
      <div id="command-results" class="app-command__results" role="listbox" aria-label="Kết quả"></div>
      <footer class="app-command__foot">
        <span><kbd class="ui-kbd">↑</kbd><kbd class="ui-kbd">↓</kbd> di chuyển</span>
        <span><kbd class="ui-kbd">Enter</kbd> mở</span>
      </footer>
    </section>
  `
  document.body.appendChild(layer)

  const input = layer.querySelector('#command-input')
  const results = layer.querySelector('#command-results')
  let matches = [...commands]
  let activeIndex = 0
  let returnFocus = null

  function render() {
    if (!matches.length) {
      results.innerHTML = '<div class="app-command__empty">Không tìm thấy kết quả phù hợp.</div>'
      input.removeAttribute('aria-activedescendant')
      return
    }

    const groups = new Map()
    matches.forEach((item, index) => {
      if (!groups.has(item.group)) groups.set(item.group, [])
      groups.get(item.group).push({ item, index })
    })

    results.innerHTML = [...groups.entries()].map(([group, items]) => `
      <div class="app-command__group" role="group" aria-label="${escapeHTML(group)}">
        <div class="app-command__group-label">${escapeHTML(group)}</div>
        ${items.map(({ item, index }) => `
          <div
            id="command-option-${index}"
            class="app-command__item"
            role="option"
            aria-selected="${index === activeIndex}"
            data-command-index="${index}"
          >
            <span class="app-command__item-icon">${icon(item.icon)}</span>
            <span class="app-command__item-copy">
              <strong>${escapeHTML(item.name)}</strong>
              <small>${escapeHTML(item.description)}</small>
            </span>
            ${icon('chevronRight', 'ui-icon app-command__item-go')}
          </div>
        `).join('')}
      </div>
    `).join('')

    input.setAttribute('aria-activedescendant', `command-option-${activeIndex}`)
    results.querySelector(`[data-command-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }

  function filter() {
    const query = normalizeSearch(input.value)
    matches = query
      ? commands.filter(item =>
          normalizeSearch([item.name, item.description, item.keywords, item.group].join(' ')).includes(query))
      : [...commands]
    activeIndex = 0
    render()
  }

  function open() {
    returnFocus = document.activeElement
    layer.hidden = false
    input.value = ''
    filter()
    requestAnimationFrame(() => {
      layer.classList.add('is-open')
      input.focus()
    })
  }

  function close() {
    layer.classList.remove('is-open')
    layer.hidden = true
    if (returnFocus?.isConnected) returnFocus.focus()
  }

  function run(index) {
    const item = matches[index]
    if (!item) return
    close()
    onRun(item)
  }

  input.addEventListener('input', filter)

  input.addEventListener('keydown', event => {
    if (!matches.length && event.key !== 'Escape') return

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      activeIndex = (activeIndex + step + matches.length) % matches.length
      render()
    }
    else if (event.key === 'Enter') {
      event.preventDefault()
      run(activeIndex)
    }
  })

  layer.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }
    // Only the input is focusable inside the dialog; keep Tab there.
    if (event.key === 'Tab') {
      event.preventDefault()
      input.focus()
    }
  })

  layer.addEventListener('click', event => {
    if (event.target.closest('[data-command-dismiss]')) {
      close()
      return
    }
    const option = event.target.closest('[data-command-index]')
    if (option) run(Number(option.dataset.commandIndex))
  })

  results.addEventListener('pointermove', event => {
    const option = event.target.closest('[data-command-index]')
    const index = Number(option?.dataset.commandIndex)
    if (option && index !== activeIndex) {
      activeIndex = index
      results.querySelectorAll('[aria-selected="true"]').forEach(node => node.setAttribute('aria-selected', 'false'))
      option.setAttribute('aria-selected', 'true')
      input.setAttribute('aria-activedescendant', option.id)
    }
  })

  return Object.freeze({
    open,
    close,
    toggle: () => (layer.hidden ? open() : close()),
    get isOpen() {
      return !layer.hidden
    }
  })
}
