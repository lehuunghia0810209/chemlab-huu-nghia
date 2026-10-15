/* =========================================================
   SCENE HOST — one lifecycle for every Three.js view
   - WebGL capability check with an accessible fallback
   - device-pixel-ratio cap per quality tier
   - render on demand; continuous loop only while something moves
   - pauses when the tab is hidden or the canvas leaves the viewport
   - context-loss handling, full GPU resource disposal
   - smooth camera presets, reduced-motion aware
========================================================= */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const QUALITY = Object.freeze({
  low: { label: 'Thấp', pixelRatio: 1, antialias: false, detail: 0.5 },
  balanced: { label: 'Cân bằng', pixelRatio: 1.5, antialias: true, detail: 1 },
  high: { label: 'Cao', pixelRatio: 2, antialias: true, detail: 1.6 }
})

const QUALITY_KEY = 'chemlab-3d-quality'

export function prefersReducedMotion() {
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.dataset.reduceMotion === 'true'
  )
}

export function webglAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  }
  catch {
    return false
  }
}

/* Pick a sensible default: phones and low-memory devices start on "low". */
export function defaultQuality() {
  try {
    const saved = localStorage.getItem(QUALITY_KEY)
    if (QUALITY[saved]) return saved
  }
  catch {
    /* ignore */
  }
  const memory = navigator.deviceMemory || 8
  const cores = navigator.hardwareConcurrency || 8
  const small = window.matchMedia('(max-width: 767px)').matches
  if (memory <= 2 || cores <= 2) return 'low'
  if (small || memory <= 4) return 'balanced'
  return 'high'
}

export function saveQuality(quality) {
  try {
    localStorage.setItem(QUALITY_KEY, quality)
  }
  catch {
    /* ignore */
  }
}

export function disposeObject(root) {
  root.traverse(node => {
    node.geometry?.dispose?.()
    const materials = Array.isArray(node.material) ? node.material : [node.material]
    for (const material of materials) {
      if (!material) continue
      for (const value of Object.values(material)) {
        if (value?.isTexture) value.dispose()
      }
      material.dispose?.()
    }
  })
}

function renderFallback(container, message) {
  container.innerHTML = `
    <div class="scene-fallback" role="note">
      <strong>Không thể hiển thị mô hình 3D</strong>
      <span>${message}</span>
    </div>
  `
}

/**
 * @param {object} options
 * @param {HTMLElement} options.container
 * @param {string} [options.quality]
 * @param {number} [options.fov]
 * @param {{x:number,y:number,z:number}} [options.cameraPosition]
 * @param {(time:number, delta:number) => boolean|void} [options.onFrame] return true while animating
 * @param {string} [options.label] accessible name for the canvas
 * @returns host API or null when WebGL is unavailable
 */
export function createSceneHost({
  container,
  quality = defaultQuality(),
  fov = 45,
  cameraPosition = { x: 0, y: 0, z: 10 },
  onFrame = null,
  label = 'Mô hình 3D tương tác'
}) {
  if (!webglAvailable()) {
    renderFallback(container, 'Trình duyệt hoặc thiết bị này không hỗ trợ WebGL. Thông tin dạng chữ và sơ đồ bên cạnh vẫn đầy đủ.')
    return null
  }

  let tier = QUALITY[quality] ? quality : 'balanced'
  let renderer

  try {
    renderer = new THREE.WebGLRenderer({
      antialias: QUALITY[tier].antialias,
      alpha: true,
      powerPreference: 'high-performance'
    })
  }
  catch {
    renderFallback(container, 'Không khởi tạo được WebGL trên thiết bị này.')
    return null
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, QUALITY[tier].pixelRatio))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const canvas = renderer.domElement
  canvas.className = 'scene-canvas'
  canvas.setAttribute('role', 'img')
  canvas.setAttribute('aria-label', label)
  canvas.tabIndex = 0
  // Dragging on the canvas rotates the model instead of scrolling the page.
  canvas.style.touchAction = 'none'
  container.appendChild(canvas)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.05, 2000)
  camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)

  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = !prefersReducedMotion()
  controls.dampingFactor = 0.08
  controls.rotateSpeed = 0.8
  controls.zoomSpeed = 0.9
  controls.screenSpacePanning = true
  controls.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' }
  controls.listenToKeyEvents(canvas)

  const home = { position: camera.position.clone(), target: new THREE.Vector3() }

  let frameId = null
  let lastTime = performance.now()
  let visible = true
  let inViewport = true
  let interacting = false
  let transition = null
  let disposed = false
  let contextLost = false

  function canRun() {
    return !disposed && !contextLost && visible && inViewport
  }

  function renderOnce() {
    if (!canRun()) return
    renderer.render(scene, camera)
  }

  function loop(time) {
    frameId = null
    if (!canRun()) return

    const delta = Math.min(0.1, (time - lastTime) / 1000)
    lastTime = time

    let animating = false

    if (transition) {
      const t = Math.min(1, (time - transition.start) / transition.duration)
      const eased = 1 - (1 - t) ** 3
      camera.position.lerpVectors(transition.fromPosition, transition.toPosition, eased)
      controls.target.lerpVectors(transition.fromTarget, transition.toTarget, eased)
      if (t >= 1) transition = null
      else animating = true
    }

    const controlsMoving = controls.update(delta)
    if (onFrame?.(time / 1000, delta)) animating = true

    renderer.render(scene, camera)

    if (animating || controlsMoving || interacting || controls.autoRotate) requestFrame()
  }

  function requestFrame() {
    if (frameId === null && canRun()) {
      lastTime = performance.now()
      frameId = requestAnimationFrame(loop)
    }
  }

  function resize() {
    const width = Math.max(1, container.clientWidth)
    const height = Math.max(1, container.clientHeight)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    requestFrame()
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)

  const intersectionObserver = new IntersectionObserver(entries => {
    inViewport = entries.some(entry => entry.isIntersecting)
    if (inViewport) requestFrame()
  })
  intersectionObserver.observe(container)

  function onVisibility() {
    visible = !document.hidden
    if (visible) requestFrame()
  }
  document.addEventListener('visibilitychange', onVisibility)

  controls.addEventListener('start', () => {
    interacting = true
    transition = null
    requestFrame()
  })
  controls.addEventListener('end', () => {
    interacting = false
    requestFrame()
  })
  controls.addEventListener('change', requestFrame)

  function onContextLost(event) {
    event.preventDefault()
    contextLost = true
    container.classList.add('is-context-lost')
  }

  function onContextRestored() {
    contextLost = false
    container.classList.remove('is-context-lost')
    requestFrame()
  }

  canvas.addEventListener('webglcontextlost', onContextLost)
  canvas.addEventListener('webglcontextrestored', onContextRestored)

  resize()

  const api = {
    THREE,
    scene,
    camera,
    renderer,
    controls,
    canvas,
    get quality() {
      return tier
    },
    get detail() {
      return QUALITY[tier].detail
    },

    requestRender: requestFrame,
    renderOnce,

    setQuality(next) {
      if (!QUALITY[next]) return
      tier = next
      saveQuality(next)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, QUALITY[tier].pixelRatio))
      resize()
    },

    setAutoRotate(enabled) {
      controls.autoRotate = Boolean(enabled) && !prefersReducedMotion()
      controls.autoRotateSpeed = 0.9
      requestFrame()
    },

    setHome(position, target = new THREE.Vector3()) {
      home.position.copy(position)
      home.target.copy(target)
    },

    flyTo(position, target = controls.target.clone(), duration = 520) {
      const toPosition = position.clone ? position.clone() : new THREE.Vector3(position.x, position.y, position.z)
      const toTarget = target.clone ? target.clone() : new THREE.Vector3(target.x, target.y, target.z)
      if (prefersReducedMotion()) {
        camera.position.copy(toPosition)
        controls.target.copy(toTarget)
        controls.update()
        requestFrame()
        return
      }
      transition = {
        start: performance.now(),
        duration,
        fromPosition: camera.position.clone(),
        toPosition,
        fromTarget: controls.target.clone(),
        toTarget
      }
      requestFrame()
    },

    resetView() {
      api.flyTo(home.position, home.target)
    },

    /* Look along an axis from the current distance. */
    viewAxis(axis) {
      const distance = camera.position.distanceTo(controls.target)
      const direction = {
        x: new THREE.Vector3(1, 0.0001, 0),
        y: new THREE.Vector3(0.0001, 1, 0.0001),
        z: new THREE.Vector3(0, 0.0001, 1)
      }[axis]
      if (!direction) return
      api.flyTo(direction.normalize().multiplyScalar(distance).add(controls.target), controls.target)
    },

    dispose() {
      if (disposed) return
      disposed = true
      if (frameId !== null) cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
      controls.dispose()
      disposeObject(scene)
      renderer.dispose()
      renderer.forceContextLoss?.()
      canvas.remove()
    }
  }

  return api
}
