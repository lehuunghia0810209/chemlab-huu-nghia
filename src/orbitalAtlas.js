import * as THREE from 'three'

import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'

import './orbitalAtlas.css'


const FAMILY_INFO = {
  s: {
    title: 's orbital',
    l: 0,
    capacity: 2,
    description:
      'Orbital s có tính đối xứng cầu quanh hạt nhân.'
  },

  p: {
    title: 'p orbital',
    l: 1,
    capacity: 6,
    description:
      'Orbital p gồm hai thùy nằm ở hai phía của hạt nhân.'
  },

  d: {
    title: 'd orbital',
    l: 2,
    capacity: 10,
    description:
      'Orbital d thường có cấu trúc bốn thùy hoặc hai thùy kết hợp vòng xuyến.'
  },

  f: {
    title: 'f orbital',
    l: 3,
    capacity: 14,
    description:
      'Orbital f có cấu trúc không gian phức tạp với nhiều thùy.'
  }
}


const ORBITALS = [
  {
    id: '1s',
    family: 's',
    label: '1s',
    n: 1,
    l: 0,
    ml: 0,
    shape: 's1',
    description:
      'Orbital 1s là orbital có năng lượng thấp nhất.'
  },

  {
    id: '2s',
    family: 's',
    label: '2s',
    n: 2,
    l: 0,
    ml: 0,
    shape: 's2',
    description:
      'Orbital 2s có thêm một vùng nút xuyên tâm.'
  },

  {
    id: '3s',
    family: 's',
    label: '3s',
    n: 3,
    l: 0,
    ml: 0,
    shape: 's3',
    description:
      'Orbital 3s có cấu trúc xuyên tâm phức tạp hơn 1s và 2s.'
  },

  {
    id: '2px',
    family: 'p',
    label: '2pₓ',
    n: 2,
    l: 1,
    ml: -1,
    shape: 'px',
    description:
      'Hai thùy của orbital p định hướng theo trục x.'
  },

  {
    id: '2py',
    family: 'p',
    label: '2pᵧ',
    n: 2,
    l: 1,
    ml: 0,
    shape: 'py',
    description:
      'Hai thùy của orbital p định hướng theo trục y.'
  },

  {
    id: '2pz',
    family: 'p',
    label: '2p𝓏',
    n: 2,
    l: 1,
    ml: 1,
    shape: 'pz',
    description:
      'Hai thùy của orbital p định hướng theo trục z.'
  },

  {
    id: '3dxy',
    family: 'd',
    label: '3dₓᵧ',
    n: 3,
    l: 2,
    ml: -2,
    shape: 'dxy',
    description:
      'Bốn thùy nằm giữa trục x và y.'
  },

  {
    id: '3dxz',
    family: 'd',
    label: '3dₓ𝓏',
    n: 3,
    l: 2,
    ml: -1,
    shape: 'dxz',
    description:
      'Bốn thùy phân bố trong mặt phẳng xz.'
  },

  {
    id: '3dyz',
    family: 'd',
    label: '3dᵧ𝓏',
    n: 3,
    l: 2,
    ml: 1,
    shape: 'dyz',
    description:
      'Bốn thùy phân bố trong mặt phẳng yz.'
  },

  {
    id: '3dx2y2',
    family: 'd',
    label: '3dₓ²₋ᵧ²',
    n: 3,
    l: 2,
    ml: 2,
    shape: 'dx2y2',
    description:
      'Bốn thùy hướng trực tiếp theo các trục x và y.'
  },

  {
    id: '3dz2',
    family: 'd',
    label: '3d𝓏²',
    n: 3,
    l: 2,
    ml: 0,
    shape: 'dz2',
    description:
      'Hai thùy theo trục z kết hợp một vòng xuyến quanh tâm.'
  },

  {
    id: '4f1',
    family: 'f',
    label: '4f₁',
    n: 4,
    l: 3,
    ml: -3,
    shape: 'fxyz',
    description:
      'Mô hình trực quan orbital f với tám thùy phân bố trong không gian.'
  },

  {
    id: '4f2',
    family: 'f',
    label: '4f₂',
    n: 4,
    l: 3,
    ml: -2,
    shape: 'fzxy',
    description:
      'Một dạng orbital f với các thùy xoay quanh trục z.'
  },

  {
    id: '4f3',
    family: 'f',
    label: '4f₃',
    n: 4,
    l: 3,
    ml: -1,
    shape: 'fxz',
    description:
      'Orbital f với các thùy phân bố không đối xứng đơn giản như p hoặc d.'
  },

  {
    id: '4f4',
    family: 'f',
    label: '4f₄',
    n: 4,
    l: 3,
    ml: 0,
    shape: 'fz3',
    description:
      'Orbital f định hướng mạnh theo trục z.'
  },

  {
    id: '4f5',
    family: 'f',
    label: '4f₅',
    n: 4,
    l: 3,
    ml: 1,
    shape: 'fyz',
    description:
      'Một biến thể orbital f trong không gian ba chiều.'
  },

  {
    id: '4f6',
    family: 'f',
    label: '4f₆',
    n: 4,
    l: 3,
    ml: 2,
    shape: 'fxy2',
    description:
      'Mô hình f gồm nhiều thùy và vùng nút phức tạp.'
  },

  {
    id: '4f7',
    family: 'f',
    label: '4f₇',
    n: 4,
    l: 3,
    ml: 3,
    shape: 'fx3',
    description:
      'Biến thể cuối trong nhóm bảy orbital f.'
  }
]


export function initOrbitalAtlas() {
  const tools =
    document.querySelector('#tools')

  if (!tools) return

  document
    .querySelector('#orbital-atlas')
    ?.remove()

  tools.insertAdjacentHTML(
    'beforeend',
    `
      <section
        id="orbital-atlas"
        class="orbital-atlas"
      >
        <header class="oa-head">
          <div>
            <span>SPDF ORBITAL ATLAS</span>

            <h2>
              Bản đồ orbital 3D
            </h2>

            <p>
              Khám phá hình dạng và định hướng
              của orbital s, p, d và f trong không gian.
            </p>
          </div>

          <div class="oa-live">
            <i></i>
            Three.js 3D
          </div>
        </header>


        <div class="oa-layout">

          <aside class="oa-sidebar">

            <span class="oa-label">
              PHÂN LỚP
            </span>

            <div
              id="oa-family-tabs"
              class="oa-family-tabs"
            >
              <button
                type="button"
                class="active"
                data-family="s"
              >
                <strong>s</strong>
                <small>l = 0</small>
              </button>

              <button
                type="button"
                data-family="p"
              >
                <strong>p</strong>
                <small>l = 1</small>
              </button>

              <button
                type="button"
                data-family="d"
              >
                <strong>d</strong>
                <small>l = 2</small>
              </button>

              <button
                type="button"
                data-family="f"
              >
                <strong>f</strong>
                <small>l = 3</small>
              </button>
            </div>


            <div class="oa-orbital-head">
              <span>
                ORBITAL
              </span>

              <strong id="oa-orbital-count">
                3
              </strong>
            </div>

            <div
              id="oa-orbital-list"
              class="oa-orbital-list"
            ></div>

          </aside>


          <main class="oa-stage-panel">

            <div class="oa-stage-toolbar">

              <div>
                <span>
                  ĐANG QUAN SÁT
                </span>

                <strong id="oa-current-name">
                  1s
                </strong>
              </div>

              <div class="oa-stage-actions">
                <button
                  type="button"
                  id="oa-auto-rotate"
                  class="active"
                >
                  ↻ Tự xoay
                </button>

                <button
                  type="button"
                  id="oa-reset-camera"
                >
                  ◎ Đặt lại góc
                </button>
              </div>

            </div>


            <div
              id="oa-stage"
              class="oa-stage"
            >
              <div class="oa-axis-label x">
                X
              </div>

              <div class="oa-axis-label y">
                Y
              </div>

              <div class="oa-axis-label z">
                Z
              </div>
            </div>


            <div class="oa-stage-footer">

              <div class="oa-phase">
                <span>
                  <i class="phase-a"></i>
                  Pha +
                </span>

                <span>
                  <i class="phase-b"></i>
                  Pha −
                </span>
              </div>

              <span>
                Kéo để xoay · Cuộn chuột để zoom
              </span>

            </div>

          </main>


          <aside class="oa-info">

            <span class="oa-label">
              THÔNG TIN
            </span>

            <h3 id="oa-info-title">
              1s orbital
            </h3>

            <p id="oa-info-description">
              Orbital 1s là orbital có năng lượng thấp nhất.
            </p>


            <div class="oa-quantum-grid">

              <div>
                <span>n</span>
                <strong id="oa-n">1</strong>
                <small>Số lượng tử chính</small>
              </div>

              <div>
                <span>l</span>
                <strong id="oa-l">0</strong>
                <small>Orbital</small>
              </div>

              <div>
                <span>mₗ</span>
                <strong id="oa-ml">0</strong>
                <small>Định hướng</small>
              </div>

              <div>
                <span>Sức chứa</span>
                <strong id="oa-capacity">2e⁻</strong>
                <small>Phân lớp</small>
              </div>

            </div>


            <div class="oa-family-info">

              <span>
                ĐẶC ĐIỂM
              </span>

              <strong id="oa-family-title">
                s orbital
              </strong>

              <p id="oa-family-description">
                Orbital s có tính đối xứng cầu quanh hạt nhân.
              </p>

            </div>


            <div class="oa-warning">
              <span>ⓘ</span>

              <p>
                Đây là mô hình trực quan giáo dục
                của bề mặt orbital, không phải phép đo
                trực tiếp vị trí electron.
              </p>
            </div>

          </aside>

        </div>
      </section>
    `
  )

  const section =
    tools.querySelector('#orbital-atlas')

  const stage =
    section.querySelector('#oa-stage')

  let family =
    's'

  let current =
    ORBITALS[0]

  let autoRotate =
    true


  /* =====================================================
     THREE SETUP
  ===================================================== */

  const scene =
    new THREE.Scene()


  const camera =
    new THREE.PerspectiveCamera(
      42,
      1,
      0.1,
      100
    )

  camera.position.set(
    6,
    4,
    7
  )


  const renderer =
    new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })

  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      2
    )
  )

  renderer.outputColorSpace =
    THREE.SRGBColorSpace

  stage.prepend(
    renderer.domElement
  )


  const controls =
    new OrbitControls(
      camera,
      renderer.domElement
    )

  controls.enableDamping =
    true

  controls.dampingFactor =
    .07

  controls.minDistance =
    3.2

  controls.maxDistance =
    15

  controls.autoRotate =
    true

  controls.autoRotateSpeed =
    .9


  scene.add(
    new THREE.AmbientLight(
      0xffffff,
      1.4
    )
  )


  const light =
    new THREE.DirectionalLight(
      0xffffff,
      3
    )

  light.position.set(
    5,
    7,
    6
  )

  scene.add(light)


  const light2 =
    new THREE.DirectionalLight(
      0x8b5cf6,
      2
    )

  light2.position.set(
    -5,
    -2,
    4
  )

  scene.add(light2)


  const orbitalRoot =
    new THREE.Group()

  scene.add(
    orbitalRoot
  )


  addAxes(scene)


  /* =====================================================
     MATERIALS
  ===================================================== */

  const materialA =
    new THREE.MeshPhysicalMaterial({
      color:
        0xb84cff,

      emissive:
        0x34104d,

      emissiveIntensity:
        .6,

      roughness:
        .3,

      metalness:
        .05,

      transparent:
        true,

      opacity:
        .88,

      side:
        THREE.DoubleSide
    })


  const materialB =
    new THREE.MeshPhysicalMaterial({
      color:
        0x20dff4,

      emissive:
        0x063c47,

      emissiveIntensity:
        .7,

      roughness:
        .25,

      transparent:
        true,

      opacity:
        .88,

      side:
        THREE.DoubleSide
    })


  const shellMaterial =
    new THREE.MeshPhysicalMaterial({
      color:
        0xa78bfa,

      emissive:
        0x291d50,

      transparent:
        true,

      opacity:
        .25,

      roughness:
        .25,

      side:
        THREE.DoubleSide
    })


  /* =====================================================
     EVENTS
  ===================================================== */

  section
    .querySelector(
      '#oa-family-tabs'
    )
    .addEventListener(
      'click',
      event => {
        const button =
          event.target.closest(
            '[data-family]'
          )

        if (!button) return

        family =
          button.dataset.family

        section
          .querySelectorAll(
            '[data-family]'
          )
          .forEach(item =>
            item.classList.toggle(
              'active',
              item === button
            )
          )

        const first =
          ORBITALS.find(
            orbital =>
              orbital.family ===
              family
          )

        renderOrbitalList()

        selectOrbital(first)
      }
    )


  section
    .querySelector(
      '#oa-orbital-list'
    )
    .addEventListener(
      'click',
      event => {
        const button =
          event.target.closest(
            '[data-orbital]'
          )

        if (!button) return

        const orbital =
          ORBITALS.find(
            item =>
              item.id ===
              button.dataset.orbital
          )

        if (orbital) {
          selectOrbital(
            orbital
          )
        }
      }
    )


  section
    .querySelector(
      '#oa-auto-rotate'
    )
    .addEventListener(
      'click',
      event => {
        autoRotate =
          !autoRotate

        controls.autoRotate =
          autoRotate

        event.currentTarget
          .classList.toggle(
            'active',
            autoRotate
          )
      }
    )


  section
    .querySelector(
      '#oa-reset-camera'
    )
    .addEventListener(
      'click',
      () => {
        camera.position.set(
          6,
          4,
          7
        )

        controls.target.set(
          0,
          0,
          0
        )

        controls.update()
      }
    )


  /* =====================================================
     RESIZE
  ===================================================== */

  const resize =
    () => {
      const width =
        stage.clientWidth

      const height =
        stage.clientHeight

      if (
        width <= 0 ||
        height <= 0
      ) {
        return
      }

      renderer.setSize(
        width,
        height,
        false
      )

      camera.aspect =
        width / height

      camera.updateProjectionMatrix()
    }


  const observer =
    new ResizeObserver(
      resize
    )

  observer.observe(
    stage
  )

  resize()


  /* =====================================================
     INITIAL
  ===================================================== */

  renderOrbitalList()

  selectOrbital(
    current
  )


  /* =====================================================
     ANIMATION
  ===================================================== */

  function animate() {
    requestAnimationFrame(
      animate
    )

    if (section.hidden) {
      return
    }

    controls.update()

    renderer.render(
      scene,
      camera
    )
  }

  animate()


  /* =====================================================
     LIST
  ===================================================== */

  function renderOrbitalList() {
    const list =
      section.querySelector(
        '#oa-orbital-list'
      )

    const values =
      ORBITALS.filter(
        orbital =>
          orbital.family ===
          family
      )

    section
      .querySelector(
        '#oa-orbital-count'
      )
      .textContent =
      values.length

    list.innerHTML =
      values.map(
        orbital => `
          <button
            type="button"
            data-orbital="${orbital.id}"
            class="${
              orbital.id ===
              current.id
                ? 'active'
                : ''
            }"
          >
            <strong>
              ${orbital.label}
            </strong>

            <span>
              n=${orbital.n}
              ·
              l=${orbital.l}
              ·
              mₗ=${orbital.ml}
            </span>
          </button>
        `
      ).join('')
  }


  /* =====================================================
     SELECT
  ===================================================== */

  function selectOrbital(
    orbital
  ) {
    if (!orbital) return

    current =
      orbital

    family =
      orbital.family

    clearGroup(
      orbitalRoot
    )

    buildShape(
      orbital
    )

    renderOrbitalList()

    updateInfo(
      orbital
    )
  }


  /* =====================================================
     INFO
  ===================================================== */

  function updateInfo(
    orbital
  ) {
    const info =
      FAMILY_INFO[
        orbital.family
      ]

    setText(
      '#oa-current-name',
      orbital.label
    )

    setText(
      '#oa-info-title',
      `${orbital.label} orbital`
    )

    setText(
      '#oa-info-description',
      orbital.description
    )

    setText(
      '#oa-n',
      orbital.n
    )

    setText(
      '#oa-l',
      orbital.l
    )

    setText(
      '#oa-ml',
      orbital.ml
    )

    setText(
      '#oa-capacity',
      `${info.capacity}e⁻`
    )

    setText(
      '#oa-family-title',
      info.title
    )

    setText(
      '#oa-family-description',
      info.description
    )
  }


  function setText(
    selector,
    value
  ) {
    const node =
      section.querySelector(
        selector
      )

    if (node) {
      node.textContent =
        value
    }
  }


  /* =====================================================
     SHAPES
  ===================================================== */

  function buildShape(
    orbital
  ) {
    switch (
      orbital.shape
    ) {
      case 's1':
        buildS(1)
        break

      case 's2':
        buildS(2)
        break

      case 's3':
        buildS(3)
        break

      case 'px':
        buildP(
          new THREE.Vector3(
            1,0,0
          )
        )
        break

      case 'py':
        buildP(
          new THREE.Vector3(
            0,1,0
          )
        )
        break

      case 'pz':
        buildP(
          new THREE.Vector3(
            0,0,1
          )
        )
        break

      case 'dxy':
        buildFourLobes(
          [
            [1,1,0],
            [-1,-1,0],
            [-1,1,0],
            [1,-1,0]
          ]
        )
        break

      case 'dxz':
        buildFourLobes(
          [
            [1,0,1],
            [-1,0,-1],
            [-1,0,1],
            [1,0,-1]
          ]
        )
        break

      case 'dyz':
        buildFourLobes(
          [
            [0,1,1],
            [0,-1,-1],
            [0,-1,1],
            [0,1,-1]
          ]
        )
        break

      case 'dx2y2':
        buildFourLobes(
          [
            [1,0,0],
            [-1,0,0],
            [0,1,0],
            [0,-1,0]
          ]
        )
        break

      case 'dz2':
        buildDZ2()
        break

      default:
        buildF(
          orbital.shape
        )
        break
    }

    addNucleus()
  }


  function buildS(
    level
  ) {
    const radii =
      level === 1
        ? [1.6]
        : level === 2
          ? [1.0,2.0]
          : [0.75,1.45,2.2]

    radii.forEach(
      (radius,index) => {
        const geometry =
          new THREE.SphereGeometry(
            radius,
            56,
            32
          )

        const material =
          index % 2 === 0
            ? shellMaterial.clone()
            : materialB.clone()

        material.opacity =
          .20 + index * .08

        const mesh =
          new THREE.Mesh(
            geometry,
            material
          )

        orbitalRoot.add(
          mesh
        )
      }
    )
  }


  function buildP(
    axis
  ) {
    createLobe(
      axis,
      1.2,
      materialA
    )

    createLobe(
      axis.clone()
        .multiplyScalar(-1),
      1.2,
      materialB
    )
  }


  function buildFourLobes(
    directions
  ) {
    directions.forEach(
      (direction,index) => {
        createLobe(
          new THREE.Vector3(
            ...direction
          ),
          1.35,
          index < 2
            ? materialA
            : materialB,
          .82
        )
      }
    )
  }


  function buildDZ2() {
    createLobe(
      new THREE.Vector3(
        0,0,1
      ),
      1.25,
      materialA,
      .95
    )

    createLobe(
      new THREE.Vector3(
        0,0,-1
      ),
      1.25,
      materialA,
      .95
    )

    const torus =
      new THREE.Mesh(
        new THREE.TorusGeometry(
          1.15,
          .30,
          24,
          64
        ),
        materialB
      )

    torus.rotation.x =
      Math.PI / 2

    orbitalRoot.add(
      torus
    )
  }


  function buildF(
    shape
  ) {
    const patterns = {
      fxyz: [
        [1,1,1],
        [-1,1,1],
        [1,-1,1],
        [-1,-1,1],
        [1,1,-1],
        [-1,1,-1],
        [1,-1,-1],
        [-1,-1,-1]
      ],

      fzxy: [
        [1,1,.45],
        [-1,1,.45],
        [1,-1,.45],
        [-1,-1,.45],
        [1,1,-.45],
        [-1,1,-.45],
        [1,-1,-.45],
        [-1,-1,-.45]
      ],

      fxz: [
        [1,.35,1],
        [-1,.35,1],
        [1,-.35,1],
        [-1,-.35,1],
        [1,.35,-1],
        [-1,.35,-1],
        [1,-.35,-1],
        [-1,-.35,-1]
      ],

      fz3: [
        [0,0,1],
        [0,0,-1],
        [1,0,.35],
        [-1,0,.35],
        [0,1,.35],
        [0,-1,.35],
        [1,0,-.35],
        [-1,0,-.35]
      ],

      fyz: [
        [.35,1,1],
        [.35,-1,1],
        [-.35,1,1],
        [-.35,-1,1],
        [.35,1,-1],
        [.35,-1,-1],
        [-.35,1,-1],
        [-.35,-1,-1]
      ],

      fxy2: [
        [1,.6,0],
        [-1,.6,0],
        [1,-.6,0],
        [-1,-.6,0],
        [.6,1,0],
        [-.6,1,0],
        [.6,-1,0],
        [-.6,-1,0]
      ],

      fx3: [
        [1,0,0],
        [-1,0,0],
        [1,.65,.35],
        [1,-.65,-.35],
        [-1,.65,-.35],
        [-1,-.65,.35],
        [.25,1,0],
        [-.25,-1,0]
      ]
    }

    const directions =
      patterns[
        shape
      ] ||
      patterns.fxyz

    directions.forEach(
      (direction,index) => {
        createLobe(
          new THREE.Vector3(
            ...direction
          ),
          1.45,
          index % 2 === 0
            ? materialA
            : materialB,
          .63
        )
      }
    )
  }


  function createLobe(
    direction,
    distance,
    material,
    scale = .95
  ) {
    const dir =
      direction.clone()
        .normalize()

    const geometry =
      new THREE.SphereGeometry(
        .82,
        38,
        28
      )

    geometry.scale(
      scale,
      1.55,
      scale
    )

    const mesh =
      new THREE.Mesh(
        geometry,
        material.clone()
      )

    mesh.position.copy(
      dir.clone()
        .multiplyScalar(
          distance
        )
    )

    mesh.quaternion
      .setFromUnitVectors(
        new THREE.Vector3(
          0,1,0
        ),
        dir
      )

    orbitalRoot.add(
      mesh
    )
  }


  function addNucleus() {
    const nucleus =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          .13,
          24,
          16
        ),
        new THREE.MeshBasicMaterial({
          color: 0xffffff
        })
      )

    orbitalRoot.add(
      nucleus
    )
  }
}


/* =========================================================
   HELPERS
========================================================= */

function clearGroup(
  group
) {
  while (
    group.children.length
  ) {
    const child =
      group.children.pop()

    child.geometry?.dispose()

    if (
      Array.isArray(
        child.material
      )
    ) {
      child.material.forEach(
        material =>
          material.dispose()
      )
    }
    else {
      child.material?.dispose()
    }
  }
}


function addAxes(
  scene
) {
  const materialX =
    new THREE.LineBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: .22
    })

  const materialY =
    new THREE.LineBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: .22
    })

  const materialZ =
    new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: .22
    })

  const createAxis =
    (a,b,material) => {
      const geometry =
        new THREE.BufferGeometry()
          .setFromPoints(
            [a,b]
          )

      scene.add(
        new THREE.Line(
          geometry,
          material
        )
      )
    }

  createAxis(
    new THREE.Vector3(-4,0,0),
    new THREE.Vector3(4,0,0),
    materialX
  )

  createAxis(
    new THREE.Vector3(0,-4,0),
    new THREE.Vector3(0,4,0),
    materialY
  )

  createAxis(
    new THREE.Vector3(0,0,-4),
    new THREE.Vector3(0,0,4),
    materialZ
  )
}