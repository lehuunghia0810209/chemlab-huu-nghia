
import './atomicExplorer.css'
import { getElement, formatMass, CATEGORIES } from '../periodic/periodicData.js'
import { orbitalBoxes, SHELL_LETTERS } from '../chem/electronConfiguration.js'
import { orbitalVariants, nodeCounts } from '../chem/orbitalMath.js'
import { createSceneHost, disposeObject, QUALITY, prefersReducedMotion } from '../three/sceneHost.js'
import { createOrbitalScene, PHASE_COLORS, WORLD_RADIUS } from './orbitalScene.js'
import { createShellScene } from './shellScene.js'
import { icon } from '../shell/icons.js'

const L_NAMES = ['s', 'p', 'd', 'f']
const PREFERRED_VARIANT = { 0: 's', 1: 'pz', 2: 'dz2', 3: 'fz3' }

let active = null

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char])
}

function parseAbundance(text) {
  const match = String(text || '').replace(',', '.').match(/(\d+(?:\.\d+)?)\s*%/)
  return match ? Number(match[1]) : null
}

async function nucleusFor(element) {
  try {
    const { getIsotopes } = await import('../periodicDataV5.js')
    const isotopes = getIsotopes(element)
    const natural = isotopes
      .map(item => ({ ...item, percent: parseAbundance(item.abundance) }))
      .filter(item => item.percent !== null && item.status === 'natural')
      .sort((a, b) => b.percent - a.percent)
    const chosen = natural[0] || isotopes[0]
    if (chosen?.mass) {
      return {
        massNumber: chosen.mass,
        name: chosen.name,
        note: natural[0]
          ? `đồng vị phổ biến nhất (${chosen.abundance.replace('≈', '≈ ').replace(/\s+/g, ' ').trim()})`
          : chosen.status === 'radioactive' ? 'đồng vị phóng xạ tham khảo' : 'đồng vị tham khảo'
      }
    }
  }
  catch {
  }
  const massNumber = Math.round(Number(element.mass)) || element.number * 2
  return { massNumber, name: `${massNumber}${element.symbol}`, note: 'số khối làm tròn từ nguyên tử khối' }
}

function defaultSubshell(electron) {
  return electron.energyOrder[electron.energyOrder.length - 1]
}

function boxDiagram(electron, selected) {
  return electron.subshells.map(subshell => {
    const boxes = orbitalBoxes(subshell)
    const isSelected = subshell.label === selected
    return `
      <button class="ax-sub ${isSelected ? 'is-selected' : ''}" type="button" data-subshell="${subshell.label}"
        aria-pressed="${isSelected}" aria-label="Phân lớp ${subshell.label}, ${subshell.electrons} electron">
        <span class="ax-sub__label">${subshell.n}<i>${L_NAMES[subshell.l]}</i><sup>${subshell.electrons}</sup></span>
        <span class="ax-sub__boxes" aria-hidden="true">
          ${boxes.map(count => `<span class="ax-box">${count >= 1 ? '<b>↑</b>' : ''}${count === 2 ? '<b>↓</b>' : ''}</span>`).join('')}
        </span>
      </button>
    `
  }).join('')
}

export async function openAtomicExplorer(number, { mode = 'shell', subshell = null } = {}) {
  const element = getElement(number)
  if (!element) return

  active?.close({ restoreFocus: false })

  const electron = element.electron
  const returnFocus = document.activeElement
  const state = {
    mode,
    subshell: subshell || defaultSubshell(electron).label,
    variant: null,
    options: { cloud: true, surface: true, axes: true },
    rotate: !prefersReducedMotion()
  }

  const layer = document.createElement('div')
  layer.className = 'ax'
  layer.setAttribute('role', 'dialog')
  layer.setAttribute('aria-modal', 'true')
  layer.setAttribute('aria-labelledby', 'ax-title')
  layer.innerHTML = `
    <header class="ax-head">
      <div class="ax-tile" aria-hidden="true">
        <span>${element.number}</span>
        <strong>${element.symbol}</strong>
      </div>
      <div class="ax-title">
        <h2 id="ax-title">${escapeHTML(element.name)}</h2>
        <p>${CATEGORIES[element.category].label} · Z = ${element.number} · ${formatMass(element.mass)}</p>
      </div>
      <div class="ui-segmented ax-modes" role="group" aria-label="Chế độ xem">
        <button type="button" data-mode="shell">Vỏ electron</button>
        <button type="button" data-mode="orbital">Orbital</button>
      </div>
      <button class="ui-icon-btn" type="button" data-ax-close aria-label="Đóng Atomic Explorer">${icon('close')}</button>
    </header>

    <div class="ax-body">
      <section class="ax-stage" aria-label="Mô hình 3D">
        <div class="ax-canvas" data-ax-canvas></div>
        <div class="ax-legend" data-ax-legend></div>
        <div class="ax-busy" data-ax-busy hidden><span class="ax-spinner" aria-hidden="true"></span><span>Đang tính hàm sóng…</span></div>
        <div class="ax-lost">Mất kết nối đồ họa. Đóng và mở lại mô hình.</div>
        <div class="ax-toolbar" role="toolbar" aria-label="Điều khiển camera">
          <button class="ax-tool" type="button" data-ax-reset title="Đặt lại góc nhìn">${icon('target')}<span>Đặt lại</span></button>
          <span class="ax-tool-group" role="group" aria-label="Nhìn dọc trục">
            <button class="ax-tool ax-tool--axis" type="button" data-ax-axis="x">x</button>
            <button class="ax-tool ax-tool--axis" type="button" data-ax-axis="y">y</button>
            <button class="ax-tool ax-tool--axis" type="button" data-ax-axis="z">z</button>
          </span>
          <button class="ax-tool" type="button" data-ax-rotate aria-pressed="${state.rotate}" title="Tự xoay">${icon('reaction')}<span>Tự xoay</span></button>
          <label class="ax-tool ax-quality">
            <span class="sr-only">Chất lượng đồ họa</span>
            <select class="ui-select" data-ax-quality aria-label="Chất lượng đồ họa">
              ${Object.entries(QUALITY).map(([key, value]) => `<option value="${key}">${value.label}</option>`).join('')}
            </select>
          </label>
          <button class="ax-tool" type="button" data-ax-fullscreen title="Toàn màn hình">${icon('sidebar')}<span>Toàn màn hình</span></button>
        </div>
      </section>

      <aside class="ax-panel" data-ax-panel aria-live="polite"></aside>
    </div>
  `

  document.body.appendChild(layer)
  document.documentElement.classList.add('ax-open')

  const canvasHost = layer.querySelector('[data-ax-canvas]')
  const panel = layer.querySelector('[data-ax-panel]')
  const legend = layer.querySelector('[data-ax-legend]')
  const busy = layer.querySelector('[data-ax-busy]')
  const nucleus = await nucleusFor(element)

  let host = null
  let orbital = null
  let shell = null

  function buildHost() {
    host?.dispose()
    host = createSceneHost({
      container: canvasHost,
      cameraPosition: { x: 0, y: 2.2, z: 11 },
      label: `Mô hình 3D của ${element.name}`,
      onFrame: (time, delta) => shell?.animate(time, delta, state.rotate && state.mode === 'shell')
    })
    orbital = null
    shell = null
    if (!host) {
      layer.classList.add('is-no-webgl')
      return
    }
    layer.querySelector('[data-ax-quality]').value = host.quality
    host.scene.background = new host.THREE.Color(getComputedStyle(layer).getPropertyValue('--scene-bg').trim() || '#070d18')
  }

  function variantsFor(label) {
    const l = L_NAMES.indexOf(label[1])
    return orbitalVariants(l)
  }

  function renderScene() {
    if (!host) return
    orbital?.dispose()
    disposeObject(host.scene)
    host.scene.clear()
    orbital = null
    shell = null

    if (state.mode === 'shell') {
      shell = createShellScene(host, {
        shells: electron.shells,
        protons: element.number,
        neutrons: Math.max(0, nucleus.massNumber - element.number)
      })
      const distance = shell.outerRadius * 2.6 + 2
      host.setHome(new host.THREE.Vector3(0, distance * 0.18, distance))
      host.camera.position.set(0, distance * 0.18, distance)
      host.controls.target.set(0, 0, 0)
      host.controls.maxDistance = distance * 2.5
      host.controls.minDistance = 1.5
      host.setAutoRotate(false)
      host.requestRender()
      return
    }

    const sub = electron.subshells.find(item => item.label === state.subshell) || defaultSubshell(electron)
    const variants = variantsFor(sub.label)
    if (!variants.some(item => item.key === state.variant)) state.variant = PREFERRED_VARIANT[sub.l]

    busy.hidden = false
    requestAnimationFrame(() => setTimeout(() => {
      if (!host) return
      orbital = createOrbitalScene(host)
      orbital.setOptions(state.options)
      orbital.show(sub.n, sub.l, state.variant)
      const distance = WORLD_RADIUS * 3.1
      host.setHome(new host.THREE.Vector3(distance * 0.8, distance * 0.36, distance * 0.42))
      host.controls.maxDistance = distance * 2.5
      host.controls.minDistance = 2
      host.resetView()
      host.setAutoRotate(state.rotate)
      busy.hidden = true
    }, 16))
  }

  function renderLegend() {
    if (state.mode === 'shell') {
      legend.innerHTML = `
        <span><i style="--c:#ef4444"></i>Proton (${element.number})</span>
        <span><i style="--c:#94a3b8"></i>Neutron (${Math.max(0, nucleus.massNumber - element.number)})</span>
        <span><i style="--c:#67e8f9"></i>Electron</span>
        <span><i style="--c:#facc15"></i>Lớp ngoài cùng</span>
      `
      return
    }
    legend.innerHTML = `
      <span><i style="--c:${PHASE_COLORS.positive}"></i>ψ &gt; 0</span>
      <span><i style="--c:${PHASE_COLORS.negative}"></i>ψ &lt; 0</span>
    `
  }

  function renderPanel() {
    const config = `
      <section class="ax-section">
        <h3>Cấu hình electron</h3>
        <p class="ax-config">${escapeHTML(electron.full)}</p>
        <p class="ax-muted">Viết gọn: <strong>${escapeHTML(electron.condensed)}</strong></p>
        ${electron.isException ? `<p class="ax-note ax-note--info">${icon('info')}<span><strong>Ngoại lệ:</strong> ${escapeHTML(electron.exceptionNote)}</span></p>` : ''}
        ${electron.predicted ? `<p class="ax-note">${icon('info')}<span>Cấu hình của nguyên tố siêu nặng (Z ≥ 104) là kết quả <strong>dự đoán lý thuyết</strong>.</span></p>` : ''}
      </section>
    `

    if (state.mode === 'shell') {
      const neutrons = Math.max(0, nucleus.massNumber - element.number)
      panel.innerHTML = `
        <section class="ax-section">
          <h3>Thành phần nguyên tử</h3>
          <dl class="ax-facts">
            <div><dt>Proton</dt><dd>${element.number}</dd></div>
            <div><dt>Neutron</dt><dd>${neutrons}</dd></div>
            <div><dt>Electron</dt><dd>${element.number}</dd></div>
          </dl>
          <p class="ax-muted">Hạt nhân minh họa <strong>${escapeHTML(nucleus.name)}</strong> — ${escapeHTML(nucleus.note)}.</p>
        </section>

        <section class="ax-section">
          <h3>Electron theo lớp</h3>
          <ol class="ax-shells">
            ${electron.shells.map((count, index) => `
              <li class="${index === electron.shells.length - 1 ? 'is-outer' : ''}">
                <span class="ax-shells__name">Lớp ${index + 1} <b>${SHELL_LETTERS[index]}</b></span>
                <span class="ax-shells__bar"><i style="--w:${Math.min(100, (count / 32) * 100)}%"></i></span>
                <span class="ax-shells__count">${count}</span>
              </li>
            `).join('')}
          </ol>
          <p class="ax-muted">Lớp ngoài cùng có <strong>${electron.outerShellElectrons}</strong> electron · <strong>${electron.unpairedElectrons}</strong> electron độc thân.</p>
        </section>

        ${config}

        <section class="ax-section">
          <p class="ax-note">${icon('info')}<span><strong>Mô hình vỏ (Bohr) là mô hình đơn giản hóa.</strong> Electron không chuyển động trên các quỹ đạo tròn xác định; vị trí của chúng chỉ mô tả được bằng xác suất (orbital). Hạt nhân được vẽ phóng to rất nhiều — thực tế bán kính nguyên tử lớn hơn hạt nhân khoảng 10<sup>4</sup>–10<sup>5</sup> lần.</span></p>
          <button class="ui-btn ui-btn--block" type="button" data-mode="orbital">${icon('atom')} Xem orbital lượng tử</button>
        </section>
      `
      return
    }

    const sub = electron.subshells.find(item => item.label === state.subshell) || defaultSubshell(electron)
    const variants = variantsFor(sub.label)
    if (!variants.some(item => item.key === state.variant)) state.variant = PREFERRED_VARIANT[sub.l]
    const nodes = nodeCounts(sub.n, sub.l)

    panel.innerHTML = `
      <section class="ax-section">
        <h3>Chọn phân lớp</h3>
        <p class="ax-muted">Sơ đồ ô orbital theo nguyên lý Pauli và quy tắc Hund. Chạm vào một phân lớp để xem hình dạng orbital.</p>
        <div class="ax-subs">${boxDiagram(electron, sub.label)}</div>
      </section>

      <section class="ax-section">
        <h3>Orbital ${sub.n}${L_NAMES[sub.l]}</h3>
        ${variants.length > 1 ? `
          <div class="ax-variants" role="group" aria-label="Hướng orbital">
            ${variants.map(item => `
              <button class="ui-chip" type="button" data-variant="${item.key}" aria-pressed="${item.key === state.variant}">${sub.n}${item.label}</button>
            `).join('')}
          </div>` : ''}
        <dl class="ax-facts ax-facts--wide">
          <div><dt>Số lượng tử chính n</dt><dd>${sub.n}</dd></div>
          <div><dt>Số lượng tử phụ l</dt><dd>${sub.l} (${L_NAMES[sub.l]})</dd></div>
          <div><dt>Số orbital (2l + 1)</dt><dd>${sub.orbitals}</dd></div>
          <div><dt>Electron trong phân lớp</dt><dd>${sub.electrons}/${sub.capacity}</dd></div>
          <div><dt>Nút xuyên tâm (n − l − 1)</dt><dd>${nodes.radial}</dd></div>
          <div><dt>Mặt nút góc (l)</dt><dd>${nodes.angular}</dd></div>
        </dl>
      </section>

      <section class="ax-section">
        <h3>Hiển thị</h3>
        <label class="ax-toggle"><input class="ui-switch" type="checkbox" data-option="cloud" ${state.options.cloud ? 'checked' : ''}><span>Đám mây xác suất |ψ|²</span></label>
        <label class="ax-toggle"><input class="ui-switch" type="checkbox" data-option="surface" ${state.options.surface ? 'checked' : ''}><span>Bề mặt biên (chứa 90% xác suất)</span></label>
        <label class="ax-toggle"><input class="ui-switch" type="checkbox" data-option="axes" ${state.options.axes ? 'checked' : ''}><span>Trục tọa độ</span></label>
        <p class="ax-note">${icon('info')}<span>Màu thể hiện <strong>dấu (pha) của hàm sóng</strong>, không phải điện tích. Hình dạng tính từ hàm sóng kiểu nguyên tử hydro (gần đúng một electron); kích thước được chuẩn hóa để dễ quan sát.</span></p>
      </section>

      ${config}
    `
  }

  function syncModeButtons() {
    layer.querySelectorAll('.ax-modes [data-mode]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.mode === state.mode))
    })
    layer.dataset.mode = state.mode
  }

  function render() {
    syncModeButtons()
    renderLegend()
    renderPanel()
    renderScene()
  }

  function focusables() {
    return [...layer.querySelectorAll('button, select, input, [tabindex="0"]')]
      .filter(node => !node.disabled && node.offsetParent !== null)
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      if (document.fullscreenElement) return
      event.preventDefault()
      close()
      return
    }
    if (event.key !== 'Tab') return
    const nodes = focusables()
    if (!nodes.length) return
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
  }

  function close({ restoreFocus = true } = {}) {
    if (active?.layer !== layer) return
    active = null
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
    orbital?.dispose()
    host?.dispose()
    host = null
    layer.removeEventListener('keydown', onKeydown)
    layer.remove()
    document.documentElement.classList.remove('ax-open')
    if (restoreFocus && returnFocus?.isConnected) returnFocus.focus()
  }

  layer.addEventListener('keydown', onKeydown)

  layer.addEventListener('click', event => {
    const target = event.target

    if (target.closest('[data-ax-close]')) {
      close()
      return
    }

    const modeButton = target.closest('[data-mode]')
    if (modeButton && modeButton.dataset.mode !== state.mode) {
      state.mode = modeButton.dataset.mode
      render()
      return
    }

    const subButton = target.closest('[data-subshell]')
    if (subButton) {
      state.subshell = subButton.dataset.subshell
      state.variant = null
      renderPanel()
      renderScene()
      return
    }

    const variant = target.closest('[data-variant]')
    if (variant) {
      state.variant = variant.dataset.variant
      renderPanel()
      renderScene()
      return
    }

    if (target.closest('[data-ax-reset]')) {
      host?.resetView()
      return
    }

    const axis = target.closest('[data-ax-axis]')
    if (axis) {
      host?.viewAxis(axis.dataset.axAxis)
      return
    }

    const rotate = target.closest('[data-ax-rotate]')
    if (rotate) {
      state.rotate = !state.rotate
      rotate.setAttribute('aria-pressed', String(state.rotate))
      if (state.mode === 'orbital') host?.setAutoRotate(state.rotate)
      host?.requestRender()
      return
    }

    if (target.closest('[data-ax-fullscreen]')) {
      const stage = layer.querySelector('.ax-stage')
      if (document.fullscreenElement) document.exitFullscreen?.()
      else stage.requestFullscreen?.().catch(() => {})
    }
  })

  layer.addEventListener('change', event => {
    const option = event.target.closest('[data-option]')
    if (option) {
      state.options[option.dataset.option] = option.checked
      orbital?.setOptions(state.options)
      return
    }

    const quality = event.target.closest('[data-ax-quality]')
    if (quality && host) {
      host.setQuality(quality.value)
      renderScene()
    }
  })

  active = { layer, close }

  buildHost()
  render()

  requestAnimationFrame(() => {
    layer.classList.add('is-open')
    layer.querySelector('[data-ax-close]')?.focus()
  })

  return { close }
}

export function closeAtomicExplorer() {
  active?.close()
}
