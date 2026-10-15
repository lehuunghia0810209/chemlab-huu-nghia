/* =========================================================
   ORBITAL ATLAS (Tool Center)
   Browse any hydrogen-like orbital n = 1…7, l = s…f with the
   same math and renderer as the Atomic Explorer.
========================================================= */

import './atomic/atomicExplorer.css'
import './orbitalAtlas.css'
import { orbitalVariants, nodeCounts } from './chem/orbitalMath.js'
import { createSceneHost, QUALITY, prefersReducedMotion } from './three/sceneHost.js'
import { createOrbitalScene, PHASE_COLORS, WORLD_RADIUS } from './atomic/orbitalScene.js'
import { icon } from './shell/icons.js'

const FAMILIES = Object.freeze({
  s: {
    l: 0,
    shells: [1, 2, 3, 4, 5, 6, 7],
    variant: 's',
    text: 'Orbital s đối xứng cầu: xác suất gặp electron chỉ phụ thuộc khoảng cách tới hạt nhân. Mỗi phân lớp s có 1 orbital, chứa tối đa 2 electron; orbital ns có n − 1 mặt nút hình cầu.'
  },
  p: {
    l: 1,
    shells: [2, 3, 4, 5, 6, 7],
    variant: 'pz',
    text: 'Phân lớp p có 3 orbital p<sub>x</sub>, p<sub>y</sub>, p<sub>z</sub> định hướng theo ba trục tọa độ. Mỗi orbital gồm hai thùy ngược pha, ngăn cách bởi một mặt phẳng nút đi qua hạt nhân. Tối đa 6 electron.'
  },
  d: {
    l: 2,
    shells: [3, 4, 5, 6],
    variant: 'dz2',
    text: 'Phân lớp d có 5 orbital. Bốn orbital có dạng bốn thùy; orbital d<sub>z²</sub> gồm hai thùy dọc trục z và một vành xuyến ngược pha. Có 2 mặt nút góc. Tối đa 10 electron.'
  },
  f: {
    l: 3,
    shells: [4, 5],
    variant: 'fz3',
    text: 'Phân lớp f có 7 orbital với 3 mặt nút góc, hình dạng phức tạp hơn. Electron điền vào 4f ở họ Lanthanide và 5f ở họ Actinide. Tối đa 14 electron.'
  }
})

export function initOrbitalAtlas() {
  const tools = document.querySelector('#tools')
  if (!tools) return

  document.querySelector('#orbital-atlas')?.remove()

  const state = {
    family: 'p',
    n: 2,
    variant: 'pz',
    options: { cloud: true, surface: true, axes: true },
    rotate: !prefersReducedMotion()
  }

  const section = document.createElement('section')
  section.id = 'orbital-atlas'
  section.className = 'oa'
  section.innerHTML = `
    <header class="oa-head">
      <span class="ui-eyebrow">Orbital Atlas</span>
      <h2>Bản đồ orbital 3D</h2>
      <p>Chọn phân lớp và hướng orbital để quan sát đám mây xác suất |ψ|² và bề mặt biên chứa 90% xác suất.</p>
    </header>

    <div class="oa-body">
      <section class="ax-stage oa-stage" aria-label="Mô hình orbital 3D">
        <div class="ax-canvas" data-oa-canvas></div>
        <div class="ax-legend">
          <span><i style="--c:${PHASE_COLORS.positive}"></i>ψ &gt; 0</span>
          <span><i style="--c:${PHASE_COLORS.negative}"></i>ψ &lt; 0</span>
        </div>
        <div class="ax-busy" data-oa-busy hidden><span class="ax-spinner" aria-hidden="true"></span><span>Đang tính hàm sóng…</span></div>
        <div class="ax-toolbar" role="toolbar" aria-label="Điều khiển camera">
          <button class="ax-tool" type="button" data-oa-reset title="Đặt lại góc nhìn">${icon('target')}<span>Đặt lại</span></button>
          <span class="ax-tool-group" role="group" aria-label="Nhìn dọc trục">
            <button class="ax-tool ax-tool--axis" type="button" data-oa-axis="x">x</button>
            <button class="ax-tool ax-tool--axis" type="button" data-oa-axis="y">y</button>
            <button class="ax-tool ax-tool--axis" type="button" data-oa-axis="z">z</button>
          </span>
          <button class="ax-tool" type="button" data-oa-rotate aria-pressed="${state.rotate}" title="Tự xoay">${icon('reaction')}<span>Tự xoay</span></button>
          <label class="ax-tool ax-quality">
            <select class="ui-select" data-oa-quality aria-label="Chất lượng đồ họa">
              ${Object.entries(QUALITY).map(([key, value]) => `<option value="${key}">${value.label}</option>`).join('')}
            </select>
          </label>
          <button class="ax-tool" type="button" data-oa-fullscreen title="Toàn màn hình">${icon('sidebar')}<span>Toàn màn hình</span></button>
        </div>
      </section>

      <aside class="oa-panel" data-oa-panel></aside>
    </div>
  `
  tools.appendChild(section)

  const canvasHost = section.querySelector('[data-oa-canvas]')
  const panel = section.querySelector('[data-oa-panel]')
  const busy = section.querySelector('[data-oa-busy]')
  let host = null
  let scene = null

  function renderPanel() {
    const family = FAMILIES[state.family]
    const variants = orbitalVariants(family.l)
    const nodes = nodeCounts(state.n, family.l)

    panel.innerHTML = `
      <div class="oa-field">
        <span class="oa-label" id="oa-family-label">Phân lớp</span>
        <div class="ui-segmented oa-families" role="group" aria-labelledby="oa-family-label">
          ${Object.keys(FAMILIES).map(key => `<button type="button" data-family="${key}" aria-pressed="${key === state.family}">${key}</button>`).join('')}
        </div>
      </div>

      <div class="oa-field">
        <span class="oa-label" id="oa-n-label">Lớp electron (n)</span>
        <div class="oa-chips" role="group" aria-labelledby="oa-n-label">
          ${family.shells.map(n => `<button class="ui-chip" type="button" data-n="${n}" aria-pressed="${n === state.n}">${n}${state.family}</button>`).join('')}
        </div>
      </div>

      ${variants.length > 1 ? `
        <div class="oa-field">
          <span class="oa-label" id="oa-variant-label">Hướng orbital</span>
          <div class="oa-chips" role="group" aria-labelledby="oa-variant-label">
            ${variants.map(item => `<button class="ui-chip" type="button" data-variant="${item.key}" aria-pressed="${item.key === state.variant}">${state.n}${item.label}</button>`).join('')}
          </div>
        </div>` : ''}

      <p class="oa-text">${family.text}</p>

      <dl class="ax-facts ax-facts--wide">
        <div><dt>n</dt><dd>${state.n}</dd></div>
        <div><dt>l</dt><dd>${family.l} (${state.family})</dd></div>
        <div><dt>Nút xuyên tâm (n − l − 1)</dt><dd>${nodes.radial}</dd></div>
        <div><dt>Mặt nút góc (l)</dt><dd>${nodes.angular}</dd></div>
      </dl>

      <div class="oa-field">
        <label class="ax-toggle"><input class="ui-switch" type="checkbox" data-option="cloud" ${state.options.cloud ? 'checked' : ''}><span>Đám mây xác suất |ψ|²</span></label>
        <label class="ax-toggle"><input class="ui-switch" type="checkbox" data-option="surface" ${state.options.surface ? 'checked' : ''}><span>Bề mặt biên 90%</span></label>
        <label class="ax-toggle"><input class="ui-switch" type="checkbox" data-option="axes" ${state.options.axes ? 'checked' : ''}><span>Trục tọa độ</span></label>
      </div>

      <p class="ax-note">${icon('info')}<span>Màu thể hiện dấu (pha) của hàm sóng. Hình dạng là orbital kiểu nguyên tử hydro; kích thước được chuẩn hóa để dễ so sánh hình dạng.</span></p>
    `
  }

  function renderScene() {
    if (!host) return
    busy.hidden = false
    requestAnimationFrame(() => setTimeout(() => {
      if (!host) return
      scene ??= createOrbitalScene(host)
      scene.setOptions(state.options)
      scene.show(state.n, FAMILIES[state.family].l, state.variant)
      busy.hidden = true
      host.requestRender()
    }, 16))
  }

  function ensureHost() {
    if (host || section.dataset.noWebgl) return
    host = createSceneHost({
      container: canvasHost,
      cameraPosition: { x: WORLD_RADIUS * 2.5, y: WORLD_RADIUS * 1.1, z: WORLD_RADIUS * 1.25 },
      label: 'Mô hình orbital 3D'
    })
    if (!host) {
      section.dataset.noWebgl = 'true'
      return
    }
    host.scene.background = new host.THREE.Color(getComputedStyle(section).getPropertyValue('--scene-bg').trim() || '#070d18')
    host.setHome(host.camera.position.clone())
    host.controls.minDistance = 2
    host.controls.maxDistance = WORLD_RADIUS * 8
    host.setAutoRotate(state.rotate)
    section.querySelector('[data-oa-quality]').value = host.quality
    renderScene()
  }

  // Only create a WebGL context once the atlas is actually on screen.
  const visibility = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      ensureHost()
      visibility.disconnect()
    }
  })
  visibility.observe(section)

  section.addEventListener('click', event => {
    const target = event.target
    const family = target.closest('[data-family]')
    if (family) {
      state.family = family.dataset.family
      const config = FAMILIES[state.family]
      if (!config.shells.includes(state.n)) state.n = config.shells[0]
      state.variant = config.variant
      renderPanel()
      renderScene()
      return
    }
    const n = target.closest('[data-n]')
    if (n) {
      state.n = Number(n.dataset.n)
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
    if (target.closest('[data-oa-reset]')) return host?.resetView()
    const axis = target.closest('[data-oa-axis]')
    if (axis) return host?.viewAxis(axis.dataset.oaAxis)
    const rotate = target.closest('[data-oa-rotate]')
    if (rotate) {
      state.rotate = !state.rotate
      rotate.setAttribute('aria-pressed', String(state.rotate))
      host?.setAutoRotate(state.rotate)
      return
    }
    if (target.closest('[data-oa-fullscreen]')) {
      const stage = section.querySelector('.oa-stage')
      if (document.fullscreenElement) document.exitFullscreen?.()
      else stage.requestFullscreen?.().catch(() => {})
    }
    return undefined
  })

  section.addEventListener('change', event => {
    const option = event.target.closest('[data-option]')
    if (option) {
      state.options[option.dataset.option] = option.checked
      scene?.setOptions(state.options)
      return
    }
    const quality = event.target.closest('[data-oa-quality]')
    if (quality && host) {
      host.setQuality(quality.value)
      renderScene()
    }
  })

  renderPanel()
}
