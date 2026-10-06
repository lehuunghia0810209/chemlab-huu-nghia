import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

let modal = null
let renderer = null
let scene = null
let camera = null
let controls = null
let root = null
let animationId = null
let resizeObserver = null

/* =====================================================
   MỞ ORBITAL 3D
===================================================== */

export function openOrbital3D(element) {
  cleanupOrbital3D()

  const subshells = parseElectronConfiguration(
    element.electronConfiguration
  ).filter(item =>
    ['s', 'p', 'd'].includes(item.type)
  )

  if (subshells.length === 0) {
    alert('Chưa có dữ liệu orbital cho nguyên tố này.')
    return
  }

  /*
    Mặc định chọn phân lớp cuối cùng.
    O -> 2p
    Fe -> 3d
  */

  let selectedSubshell =
    subshells[subshells.length - 1]

  let selectedVariant =
    getDefaultVariant(selectedSubshell.type)

  modal = document.createElement('div')
  modal.className = 'orbital-modal'

  modal.innerHTML = `
    <div class="orbital-window">

      <button class="orbital-close">
        ×
      </button>

      <div class="orbital-header">

        <div>

          <span class="orbital-label">
            ORBITAL 3D
          </span>

          <h2>
            ${element.name}
          </h2>

          <p>
            ${element.symbol}
            · Z = ${element.number}
          </p>

        </div>

        <div class="orbital-element-symbol">
          ${element.symbol}
        </div>

      </div>


      <div class="subshell-panel">

        <div class="subshell-title">
          Cấu hình electron
        </div>

        <div class="subshell-buttons">

          ${subshells.map((subshell, index) => `
            <button
              class="subshell-button
              ${
                index === subshells.length - 1
                  ? 'active'
                  : ''
              }"
              data-index="${index}"
            >
              ${subshell.label}
            </button>
          `).join('')}

        </div>

      </div>


      <div
        class="orbital-variant-panel"
        id="orbital-variant-panel"
      ></div>


      <div class="orbital-current">

        <span>
          Đang xem
        </span>

        <strong id="orbital-current-name">
          ${selectedSubshell.n}${selectedSubshell.type}
        </strong>

        <small id="orbital-current-electrons">
          ${selectedSubshell.electrons} electron
        </small>

      </div>


      <div
        class="orbital-canvas"
        id="orbital-canvas"
      ></div>


      <div class="orbital-info">

        <div>
          <span>Phân lớp</span>
          <strong id="orbital-info-name">
            ${selectedSubshell.n}${selectedSubshell.type}
          </strong>
        </div>

        <div>
          <span>Electron</span>
          <strong id="orbital-info-electrons">
            ${selectedSubshell.electrons}
          </strong>
        </div>

        <div>
          <span>Sức chứa tối đa</span>
          <strong id="orbital-info-capacity">
            ${getOrbitalCapacity(selectedSubshell.type)}
          </strong>
        </div>

        <div>
          <span>Loại orbital</span>
          <strong id="orbital-info-type">
            ${selectedSubshell.type.toUpperCase()}
          </strong>
        </div>

      </div>


      <div class="orbital-phase-legend">

        <span>
          <i class="phase-positive"></i>
          Pha +
        </span>

        <span>
          <i class="phase-negative"></i>
          Pha −
        </span>

      </div>


      <p class="orbital-hint">
        🖱 Kéo để xoay · Cuộn để phóng to / thu nhỏ
      </p>


      <p class="orbital-note">
        Mô hình minh họa hình dạng orbital,
        không biểu diễn kích thước nguyên tử theo tỉ lệ thực.
      </p>

    </div>
  `

  document.body.appendChild(modal)

  const canvas =
    modal.querySelector('#orbital-canvas')

  const closeButton =
    modal.querySelector('.orbital-close')

  const variantPanel =
    modal.querySelector('#orbital-variant-panel')

  closeButton.addEventListener(
    'click',
    cleanupOrbital3D
  )

  modal.addEventListener(
    'click',
    event => {
      if (event.target === modal) {
        cleanupOrbital3D()
      }
    }
  )

  /*
    Chọn phân lớp
  */

  modal
    .querySelectorAll('.subshell-button')
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          modal
            .querySelectorAll('.subshell-button')
            .forEach(item =>
              item.classList.remove('active')
            )

          button.classList.add('active')

          const index =
            Number(button.dataset.index)

          selectedSubshell =
            subshells[index]

          selectedVariant =
            getDefaultVariant(
              selectedSubshell.type
            )

          updateOrbitalInformation(
            selectedSubshell
          )

          renderVariantButtons(
            selectedSubshell,
            selectedVariant,
            variantPanel,
            variant => {

              selectedVariant = variant

              buildOrbital(
                selectedSubshell,
                selectedVariant
              )
            }
          )

          buildOrbital(
            selectedSubshell,
            selectedVariant
          )
        }
      )
    })

  createScene(canvas)

  renderVariantButtons(
    selectedSubshell,
    selectedVariant,
    variantPanel,
    variant => {

      selectedVariant = variant

      buildOrbital(
        selectedSubshell,
        selectedVariant
      )
    }
  )

  buildOrbital(
    selectedSubshell,
    selectedVariant
  )
}

/* =====================================================
   PARSE CẤU HÌNH ELECTRON
===================================================== */

function parseElectronConfiguration(configuration) {
  if (!configuration) {
    return []
  }

  const normal =
    convertSuperscripts(configuration)

  const regex =
    /(\d)([spdf])(\d+)/g

  const result = []

  let match

  while (
    (match = regex.exec(normal)) !== null
  ) {
    const n = Number(match[1])

    const type = match[2]

    const electrons =
      Number(match[3])

    result.push({
      n,
      type,
      electrons,

      label:
        `${n}${type}${toSuperscript(electrons)}`
    })
  }

  return result
}

/* =====================================================
   SUPERSCRIPT
===================================================== */

function convertSuperscripts(text) {
  const map = {
    '⁰': '0',
    '¹': '1',
    '²': '2',
    '³': '3',
    '⁴': '4',
    '⁵': '5',
    '⁶': '6',
    '⁷': '7',
    '⁸': '8',
    '⁹': '9'
  }

  return text.replace(
    /[⁰¹²³⁴⁵⁶⁷⁸⁹]/g,
    character =>
      map[character]
  )
}

function toSuperscript(number) {
  const map = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹'
  }

  return String(number)
    .split('')
    .map(number =>
      map[number]
    )
    .join('')
}

/* =====================================================
   CAPACITY
===================================================== */

function getOrbitalCapacity(type) {
  const capacity = {
    s: 2,
    p: 6,
    d: 10,
    f: 14
  }

  return capacity[type] ?? '—'
}

/* =====================================================
   VARIANT
===================================================== */

function getDefaultVariant(type) {
  if (type === 'p') {
    return 'pz'
  }

  if (type === 'd') {
    return 'dz2'
  }

  return 's'
}

function getVariants(type) {
  if (type === 'p') {
    return [
      {
        value: 'px',
        label: 'pₓ'
      },

      {
        value: 'py',
        label: 'pᵧ'
      },

      {
        value: 'pz',
        label: 'p_z'
      }
    ]
  }

  if (type === 'd') {
    return [
      {
        value: 'dxy',
        label: 'dxy'
      },

      {
        value: 'dxz',
        label: 'dxz'
      },

      {
        value: 'dyz',
        label: 'dyz'
      },

      {
        value: 'dx2y2',
        label: 'dx²−y²'
      },

      {
        value: 'dz2',
        label: 'dz²'
      }
    ]
  }

  return []
}

/* =====================================================
   NÚT CHỌN p/d
===================================================== */

function renderVariantButtons(
  subshell,
  selectedVariant,
  container,
  onSelect
) {
  const variants =
    getVariants(subshell.type)

  if (variants.length === 0) {
    container.innerHTML = ''
    container.style.display = 'none'

    return
  }

  container.style.display = 'flex'

  container.innerHTML = `
    <span>
      Kiểu orbital:
    </span>

    ${variants.map(item => `
      <button
        class="
          variant-button
          ${
            item.value === selectedVariant
              ? 'active'
              : ''
          }
        "
        data-variant="${item.value}"
      >
        ${item.label}
      </button>
    `).join('')}
  `

  container
    .querySelectorAll('.variant-button')
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          container
            .querySelectorAll('.variant-button')
            .forEach(item =>
              item.classList.remove('active')
            )

          button.classList.add('active')

          onSelect(
            button.dataset.variant
          )
        }
      )
    })
}

/* =====================================================
   UPDATE INFO
===================================================== */

function updateOrbitalInformation(subshell) {
  const name =
    `${subshell.n}${subshell.type}`

  document
    .querySelector('#orbital-current-name')
    .textContent =
      name

  document
    .querySelector('#orbital-current-electrons')
    .textContent =
      `${subshell.electrons} electron`

  document
    .querySelector('#orbital-info-name')
    .textContent =
      name

  document
    .querySelector('#orbital-info-electrons')
    .textContent =
      subshell.electrons

  document
    .querySelector('#orbital-info-capacity')
    .textContent =
      getOrbitalCapacity(
        subshell.type
      )

  document
    .querySelector('#orbital-info-type')
    .textContent =
      subshell.type.toUpperCase()
}

/* =====================================================
   CREATE SCENE
===================================================== */

function createScene(container) {
  scene =
    new THREE.Scene()

  scene.background =
    new THREE.Color(0x020205)

  camera =
    new THREE.PerspectiveCamera(
      45,

      container.clientWidth /
        container.clientHeight,

      0.1,

      100
    )

  camera.position.set(
    4.5,
    3,
    7
  )

  renderer =
    new THREE.WebGLRenderer({
      antialias: true
    })

  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      2
    )
  )

  renderer.setSize(
    container.clientWidth,
    container.clientHeight
  )

  renderer.outputColorSpace =
    THREE.SRGBColorSpace

  container.appendChild(
    renderer.domElement
  )

  controls =
    new OrbitControls(
      camera,
      renderer.domElement
    )

  controls.enableDamping = true

  controls.dampingFactor =
    0.06

  controls.enablePan = false

  controls.minDistance = 3

  controls.maxDistance = 15

  controls.target.set(
    0,
    0,
    0
  )

  /*
    Lights
  */

  scene.add(
    new THREE.AmbientLight(
      0xffffff,
      1.2
    )
  )

  const purple =
    new THREE.PointLight(
      0xa855f7,
      14,
      20
    )

  purple.position.set(
    5,
    5,
    5
  )

  scene.add(purple)

  const blue =
    new THREE.PointLight(
      0x22d3ee,
      12,
      20
    )

  blue.position.set(
    -5,
    -3,
    4
  )

  scene.add(blue)

  createStars()

  resizeObserver =
    new ResizeObserver(
      () => {

        if (!renderer) {
          return
        }

        const width =
          container.clientWidth

        const height =
          container.clientHeight

        camera.aspect =
          width / height

        camera.updateProjectionMatrix()

        renderer.setSize(
          width,
          height
        )
      }
    )

  resizeObserver.observe(
    container
  )

  animate()
}

/* =====================================================
   BACKGROUND PARTICLES
===================================================== */

function createStars() {
  const positions = []

  for (
    let i = 0;
    i < 180;
    i++
  ) {
    positions.push(
      (Math.random() - 0.5) * 18,

      (Math.random() - 0.5) * 12,

      (Math.random() - 0.5) * 12
    )
  }

  const geometry =
    new THREE.BufferGeometry()

  geometry.setAttribute(
    'position',

    new THREE.Float32BufferAttribute(
      positions,
      3
    )
  )

  const material =
    new THREE.PointsMaterial({
      color: 0x6d4aff,

      size: 0.025,

      transparent: true,

      opacity: 0.4
    })

  scene.add(
    new THREE.Points(
      geometry,
      material
    )
  )
}

/* =====================================================
   BUILD ORBITAL
===================================================== */

function buildOrbital(
  subshell,
  variant
) {
  if (root) {
    scene.remove(root)

    disposeObject(root)
  }

  root =
    new THREE.Group()

  scene.add(root)

  createNucleusPoint(root)

  /*
    n càng cao -> orbital hiển thị lớn hơn
  */

  const scale =
    1 +
    (subshell.n - 1) *
      0.11

  if (subshell.type === 's') {
    createSOrbital(
      root,
      scale,
      subshell.n
    )
  }

  if (subshell.type === 'p') {
    createPOrbital(
      root,
      variant,
      scale
    )
  }

  if (subshell.type === 'd') {
    createDOrbital(
      root,
      variant,
      scale
    )
  }
}

/* =====================================================
   NUCLEUS
===================================================== */

function createNucleusPoint(parent) {
  const geometry =
    new THREE.SphereGeometry(
      0.11,
      24,
      24
    )

  const material =
    new THREE.MeshBasicMaterial({
      color: 0xffffff
    })

  const nucleus =
    new THREE.Mesh(
      geometry,
      material
    )

  parent.add(nucleus)

  const glow =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.22,
        20,
        20
      ),

      new THREE.MeshBasicMaterial({
        color: 0xa855f7,

        transparent: true,

        opacity: 0.18
      })
    )

  parent.add(glow)
}

/* =====================================================
   MATERIALS
===================================================== */

function getPositiveMaterial(
  opacity = 0.48
) {
  return new THREE.MeshStandardMaterial({
    color: 0xa855f7,

    emissive: 0x5b167e,

    emissiveIntensity: 1.5,

    transparent: true,

    opacity,

    roughness: 0.3,

    side: THREE.DoubleSide
  })
}

function getNegativeMaterial(
  opacity = 0.48
) {
  return new THREE.MeshStandardMaterial({
    color: 0x22d3ee,

    emissive: 0x075985,

    emissiveIntensity: 1.4,

    transparent: true,

    opacity,

    roughness: 0.3,

    side: THREE.DoubleSide
  })
}

/* =====================================================
   S ORBITAL
===================================================== */

function createSOrbital(
  parent,
  scale,
  n
) {
  const geometry =
    new THREE.SphereGeometry(
      1.6 * scale,
      48,
      32
    )

  const material =
    getPositiveMaterial(0.28)

  const sphere =
    new THREE.Mesh(
      geometry,
      material
    )

  parent.add(sphere)

  /*
    Viền ngoài
  */

  const wireframe =
    new THREE.Mesh(
      geometry,

      new THREE.MeshBasicMaterial({
        color: 0xc084fc,

        wireframe: true,

        transparent: true,

        opacity: 0.055
      })
    )

  parent.add(wireframe)

  /*
    Với 2s trở lên thêm lớp mờ bên trong
    để gợi ý cấu trúc xuyên tâm.
  */

  if (n >= 2) {
    const inner =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.65 * scale,
          32,
          24
        ),

        getNegativeMaterial(0.14)
      )

    parent.add(inner)
  }
}

/* =====================================================
   P ORBITAL
===================================================== */

function createPOrbital(
  parent,
  variant,
  scale
) {
  let axis =
    new THREE.Vector3(
      0,
      0,
      1
    )

  if (variant === 'px') {
    axis =
      new THREE.Vector3(
        1,
        0,
        0
      )
  }

  if (variant === 'py') {
    axis =
      new THREE.Vector3(
        0,
        1,
        0
      )
  }

  createDoubleLobe(
    parent,
    axis,
    1.25 * scale,
    1.2 * scale
  )
}

/* =====================================================
   DOUBLE LOBE
===================================================== */

function createDoubleLobe(
  parent,
  axis,
  distance,
  length
) {
  const positive =
    createLobe(
      axis,
      distance,
      length,
      getPositiveMaterial()
    )

  const negative =
    createLobe(
      axis.clone().multiplyScalar(-1),
      distance,
      length,
      getNegativeMaterial()
    )

  parent.add(positive)
  parent.add(negative)
}

/* =====================================================
   CREATE LOBE
===================================================== */

function createLobe(
  direction,
  distance,
  length,
  material
) {
  const geometry =
    new THREE.SphereGeometry(
      1,
      40,
      28
    )

  const lobe =
    new THREE.Mesh(
      geometry,
      material
    )

  lobe.scale.set(
    0.72,
    length,
    0.72
  )

  const normalized =
    direction.clone().normalize()

  lobe.position.copy(
    normalized.clone()
      .multiplyScalar(distance)
  )

  /*
    Sphere được kéo dài theo Y,
    nên xoay Y về hướng vector.
  */

  lobe.quaternion.setFromUnitVectors(
    new THREE.Vector3(
      0,
      1,
      0
    ),

    normalized
  )

  return lobe
}

/* =====================================================
   D ORBITAL
===================================================== */

function createDOrbital(
  parent,
  variant,
  scale
) {
  if (variant === 'dz2') {
    createDZ2(
      parent,
      scale
    )

    return
  }

  const directions = []

  if (variant === 'dxy') {
    directions.push(
      [1, 1, 0],
      [-1, -1, 0],
      [-1, 1, 0],
      [1, -1, 0]
    )
  }

  if (variant === 'dxz') {
    directions.push(
      [1, 0, 1],
      [-1, 0, -1],
      [-1, 0, 1],
      [1, 0, -1]
    )
  }

  if (variant === 'dyz') {
    directions.push(
      [0, 1, 1],
      [0, -1, -1],
      [0, -1, 1],
      [0, 1, -1]
    )
  }

  if (variant === 'dx2y2') {
    directions.push(
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0]
    )
  }

  directions.forEach(
    (coordinates, index) => {

      const direction =
        new THREE.Vector3(
          ...coordinates
        )

      const material =
        index % 2 === 0
          ? getPositiveMaterial()
          : getNegativeMaterial()

      const lobe =
        createLobe(
          direction,
          1.25 * scale,
          0.95 * scale,
          material
        )

      lobe.scale.x *= 0.8
      lobe.scale.z *= 0.8

      parent.add(lobe)
    }
  )
}

/* =====================================================
   DZ2
===================================================== */

function createDZ2(
  parent,
  scale
) {
  createDoubleLobe(
    parent,

    new THREE.Vector3(
      0,
      0,
      1
    ),

    1.15 * scale,

    1.05 * scale
  )

  /*
    Vòng xuyến ở giữa
  */

  const torus =
    new THREE.Mesh(
      new THREE.TorusGeometry(
        0.95 * scale,
        0.27 * scale,
        24,
        80
      ),

      getNegativeMaterial(0.42)
    )

  parent.add(torus)
}

/* =====================================================
   ANIMATION
===================================================== */

function animate() {
  animationId =
    requestAnimationFrame(
      animate
    )

  if (root) {
    root.rotation.y +=
      0.002

    root.rotation.x =
      Math.sin(
        Date.now() *
        0.00025
      ) * 0.08
  }

  controls?.update()

  renderer?.render(
    scene,
    camera
  )
}

/* =====================================================
   DISPOSE OBJECT
===================================================== */

function disposeObject(object) {
  object.traverse(child => {

    if (child.geometry) {
      child.geometry.dispose()
    }

    if (child.material) {
      if (
        Array.isArray(
          child.material
        )
      ) {
        child.material.forEach(
          material =>
            material.dispose()
        )
      } else {
        child.material.dispose()
      }
    }
  })
}

/* =====================================================
   CLEANUP
===================================================== */

function cleanupOrbital3D() {
  if (animationId) {
    cancelAnimationFrame(
      animationId
    )

    animationId = null
  }

  if (resizeObserver) {
    resizeObserver.disconnect()

    resizeObserver = null
  }

  controls?.dispose()

  controls = null

  if (scene) {
    disposeObject(scene)
  }

  if (renderer) {
    renderer.dispose()

    renderer = null
  }

  if (modal) {
    modal.remove()

    modal = null
  }

  root = null
  scene = null
  camera = null
}