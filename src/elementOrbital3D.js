import * as THREE
  from 'three'

import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'


/* =========================================================
   CHEMLAB 5.0
   GENERIC ELEMENT ORBITAL VIEWER
========================================================= */

let activeViewer =
  null


const ORBITAL_ORDER = [

  ['1s',2],
  ['2s',2],
  ['2p',6],
  ['3s',2],
  ['3p',6],
  ['4s',2],
  ['3d',10],
  ['4p',6],
  ['5s',2],
  ['4d',10],
  ['5p',6],
  ['6s',2],
  ['4f',14],
  ['5d',10],
  ['6p',6],
  ['7s',2],
  ['5f',14],
  ['6d',10],
  ['7p',6]

]


/* =========================================================
   OPEN
========================================================= */

export function openElementOrbital3D(
  element
) {

  closeElementOrbital3D()


  const orbital =
    getOuterOrbital(
      element.number
    )


  const overlay =
    document.createElement(
      'div'
    )


  overlay.className =
    'eo3d-overlay'


  overlay.innerHTML = `
    <section
      class="eo3d-window"
      role="dialog"
      aria-modal="true"
      aria-label="Orbital 3D"
    >

      <header class="eo3d-header">

        <div>

          <span>
            CHEMLAB ORBITAL 3D
          </span>

          <h2>
            ${element.name}
          </h2>

          <p>
            ${element.symbol}
            · Z = ${element.number}
            · orbital ngoài cùng
            ${orbital.name}
          </p>

        </div>


        <button
          type="button"
          data-eo3d-close
          aria-label="Đóng"
        >
          ×
        </button>

      </header>


      <div class="eo3d-content">

        <div
          class="eo3d-stage"
          data-eo3d-stage
        ></div>


        <aside class="eo3d-info">

          <div class="eo3d-orbital-badge">

            <span>
              ORBITAL
            </span>

            <strong>
              ${orbital.name}
            </strong>

            <small>
              ${orbital.electrons}
              electron
            </small>

          </div>


          <div class="eo3d-data">

            <div>

              <span>
                Phân lớp
              </span>

              <strong>
                ${orbital.type}
              </strong>

            </div>


            <div>

              <span>
                Sức chứa tối đa
              </span>

              <strong>
                ${orbital.capacity} e⁻
              </strong>

            </div>


            <div>

              <span>
                Electron hiện tại
              </span>

              <strong>
                ${orbital.electrons}
              </strong>

            </div>

          </div>


          <div class="eo3d-note">

            Mô hình biểu diễn hình dạng orbital
            để trực quan học tập.
            Đây không phải quỹ đạo chuyển động
            cổ điển của electron.

          </div>

        </aside>

      </div>


      <footer class="eo3d-footer">

        <span>
          Kéo để xoay · Cuộn để zoom
        </span>


        <div>

          <button
            type="button"
            data-eo3d-rotate
          >
            Tự xoay
          </button>


          <button
            type="button"
            data-eo3d-reset
          >
            Đặt lại góc nhìn
          </button>

        </div>

      </footer>

    </section>
  `


  document.body
    .appendChild(
      overlay
    )


  injectStyles()


  const stage =
    overlay.querySelector(
      '[data-eo3d-stage]'
    )


  const renderer =
    new THREE.WebGLRenderer({

      antialias:
        true,

      alpha:
        true

    })


  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      2
    )
  )


  renderer.setClearColor(
    0x000000,
    0
  )


  stage.appendChild(
    renderer.domElement
  )


  const scene =
    new THREE.Scene()


  const camera =
    new THREE.PerspectiveCamera(
      42,
      1,
      .1,
      100
    )


  camera.position.set(
    5.4,
    3.8,
    6.6
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
    3.5


  controls.maxDistance =
    13


  const ambient =
    new THREE.AmbientLight(
      0xffffff,
      1.5
    )


  scene.add(
    ambient
  )


  const keyLight =
    new THREE.DirectionalLight(
      0xb9ccff,
      3
    )


  keyLight.position.set(
    4,
    5,
    6
  )


  scene.add(
    keyLight
  )


  const rim =
    new THREE.DirectionalLight(
      0xa855f7,
      2
    )


  rim.position.set(
    -5,
    1,
    -4
  )


  scene.add(
    rim
  )


  const model =
    new THREE.Group()


  scene.add(
    model
  )


  createOrbitalShape(
    model,
    orbital.type
  )


  createNucleus(
    model
  )


  const resize = () => {

    const rect =
      stage.getBoundingClientRect()


    const width =
      Math.max(
        10,
        rect.width
      )


    const height =
      Math.max(
        10,
        rect.height
      )


    renderer.setSize(
      width,
      height,
      false
    )


    camera.aspect =
      width /
      height


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


  let autoRotate =
    true


  let animationId =
    null


  const animate = () => {

    animationId =
      requestAnimationFrame(
        animate
      )


    if (autoRotate) {

      model.rotation.y +=
        .0035


      model.rotation.x =
        Math.sin(
          performance.now() *
          .00025
        ) *
        .08

    }


    controls.update()


    renderer.render(
      scene,
      camera
    )

  }


  animate()


  const resetCamera = () => {

    camera.position.set(
      5.4,
      3.8,
      6.6
    )


    controls.target.set(
      0,
      0,
      0
    )


    controls.update()

  }


  overlay
    .querySelector(
      '[data-eo3d-reset]'
    )
    .addEventListener(
      'click',
      resetCamera
    )


  overlay
    .querySelector(
      '[data-eo3d-rotate]'
    )
    .addEventListener(
      'click',
      event => {

        autoRotate =
          !autoRotate


        event.currentTarget
          .classList
          .toggle(
            'active',
            autoRotate
          )

      }
    )


  const close =
    () => {

      observer.disconnect()


      cancelAnimationFrame(
        animationId
      )


      controls.dispose()


      disposeObject(
        scene
      )


      renderer.dispose()


      overlay.remove()


      if (
        activeViewer?.overlay ===
        overlay
      ) {

        activeViewer =
          null

      }

    }


  overlay
    .querySelector(
      '[data-eo3d-close]'
    )
    .addEventListener(
      'click',
      close
    )


  overlay.addEventListener(
    'click',
    event => {

      if (
        event.target ===
        overlay
      ) {

        close()

      }

    }
  )


  const keyboard =
    event => {

      if (
        event.key ===
        'Escape'
      ) {

        document.removeEventListener(
          'keydown',
          keyboard
        )


        close()

      }

    }


  document.addEventListener(
    'keydown',
    keyboard
  )


  activeViewer = {

    overlay,
    close

  }

}


/* =========================================================
   COMPATIBILITY EXPORTS
========================================================= */

export const openOrbital3D =
  openElementOrbital3D


export const showOrbital3D =
  openElementOrbital3D


export function closeElementOrbital3D() {

  activeViewer?.close?.()

}


/* =========================================================
   CREATE MODEL
========================================================= */

function createOrbitalShape(
  group,
  type
) {

  switch (
    type
  ) {

    case 'p':

      createPOrbital(
        group
      )

      break


    case 'd':

      createDOrbital(
        group
      )

      break


    case 'f':

      createFOrbital(
        group
      )

      break


    default:

      createSOrbital(
        group
      )

  }

}


/* =========================================================
   MATERIAL
========================================================= */

function positiveMaterial() {

  return new THREE.MeshPhysicalMaterial({

    color:
      0x5b8cff,

    emissive:
      0x173b88,

    emissiveIntensity:
      .85,

    transparent:
      true,

    opacity:
      .72,

    roughness:
      .28,

    metalness:
      .08,

    transmission:
      .05,

    side:
      THREE.DoubleSide

  })

}


function negativeMaterial() {

  return new THREE.MeshPhysicalMaterial({

    color:
      0xb05cff,

    emissive:
      0x571d89,

    emissiveIntensity:
      .72,

    transparent:
      true,

    opacity:
      .72,

    roughness:
      .28,

    metalness:
      .06,

    side:
      THREE.DoubleSide

  })

}


/* =========================================================
   S
========================================================= */

function createSOrbital(
  group
) {

  const geometry =
    new THREE.SphereGeometry(
      2,
      64,
      40
    )


  const sphere =
    new THREE.Mesh(
      geometry,
      positiveMaterial()
    )


  group.add(
    sphere
  )

}


/* =========================================================
   P
========================================================= */

function createPOrbital(
  group
) {

  createLobe(
    group,
    0,
    1.45,
    0,
    positiveMaterial(),
    1.35
  )


  createLobe(
    group,
    0,
    -1.45,
    0,
    negativeMaterial(),
    1.35
  )

}


/* =========================================================
   D
========================================================= */

function createDOrbital(
  group
) {

  const positions = [

    [1.15,1.15,0],
    [-1.15,-1.15,0],
    [-1.15,1.15,0],
    [1.15,-1.15,0]

  ]


  positions.forEach(
    (
      [x,y,z],
      index
    ) => {

      createLobe(
        group,
        x,
        y,
        z,
        index < 2
          ? positiveMaterial()
          : negativeMaterial(),
        1.05
      )

    }
  )

}


/* =========================================================
   F
========================================================= */

function createFOrbital(
  group
) {

  const positions = [

    [1,1,1],
    [-1,-1,-1],

    [-1,1,1],
    [1,-1,-1],

    [1,-1,1],
    [-1,1,-1],

    [1,1,-1],
    [-1,-1,1]

  ]


  positions.forEach(
    (
      [x,y,z],
      index
    ) => {

      createLobe(
        group,
        x,
        y,
        z,
        index % 2 === 0
          ? positiveMaterial()
          : negativeMaterial(),
        .83
      )

    }
  )

}


/* =========================================================
   LOBE
========================================================= */

function createLobe(
  group,
  x,
  y,
  z,
  material,
  scale
) {

  const geometry =
    new THREE.SphereGeometry(
      .82,
      40,
      28
    )


  const mesh =
    new THREE.Mesh(
      geometry,
      material
    )


  mesh.position.set(
    x,
    y,
    z
  )


  mesh.scale.set(
    .9 * scale,
    1.25 * scale,
    .9 * scale
  )


  mesh.lookAt(
    0,
    0,
    0
  )


  group.add(
    mesh
  )

}


/* =========================================================
   NUCLEUS
========================================================= */

function createNucleus(
  group
) {

  const geometry =
    new THREE.SphereGeometry(
      .22,
      28,
      20
    )


  const material =
    new THREE.MeshStandardMaterial({

      color:
        0xffffff,

      emissive:
        0x8b5cf6,

      emissiveIntensity:
        2

    })


  const nucleus =
    new THREE.Mesh(
      geometry,
      material
    )


  group.add(
    nucleus
  )

}


/* =========================================================
   OUTER ORBITAL
========================================================= */

function getOuterOrbital(
  atomicNumber
) {

  let remaining =
    atomicNumber


  let last = {

    name:
      '1s',

    type:
      's',

    electrons:
      1,

    capacity:
      2

  }


  for (
    const [
      name,
      capacity
    ]
    of ORBITAL_ORDER
  ) {

    if (
      remaining <=
      0
    ) {
      break
    }


    const electrons =
      Math.min(
        remaining,
        capacity
      )


    last = {

      name,

      type:
        name.slice(
          -1
        ),

      electrons,

      capacity

    }


    remaining -=
      electrons

  }


  return last

}


/* =========================================================
   DISPOSE
========================================================= */

function disposeObject(
  object
) {

  object.traverse(
    child => {

      if (
        child.geometry
      ) {

        child.geometry.dispose()

      }


      const material =
        child.material


      if (
        Array.isArray(
          material
        )
      ) {

        material.forEach(
          item =>
            item.dispose?.()
        )

      }

      else {

        material?.dispose?.()

      }

    }
  )

}


/* =========================================================
   STYLES
========================================================= */

function injectStyles() {

  if (
    document.querySelector(
      '#eo3d-style'
    )
  ) {
    return
  }


  const style =
    document.createElement(
      'style'
    )


  style.id =
    'eo3d-style'


  style.textContent = `
    .eo3d-overlay {
      position: fixed;
      inset: 0;
      z-index: 20000;

      padding: 24px;

      display: grid;
      place-items: center;

      background: rgba(3,5,10,.82);

      backdrop-filter: blur(12px);
    }


    .eo3d-window {
      width: min(1180px, 100%);
      height: min(760px, calc(100vh - 48px));

      overflow: hidden;

      display: grid;
      grid-template-rows: auto minmax(0,1fr) auto;

      border: 1px solid rgba(255,255,255,.11);
      border-radius: 22px;

      background:
        radial-gradient(
          circle at 15% 0%,
          rgba(91,140,255,.08),
          transparent 34%
        ),
        #0b0e15;

      box-shadow:
        0 45px 130px rgba(0,0,0,.65);
    }


    .eo3d-header {
      min-height: 82px;

      padding: 16px 20px;

      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;

      border-bottom: 1px solid rgba(255,255,255,.07);
    }


    .eo3d-header > div > span {
      color: #9b87d0;

      font-size: 12px;
      font-weight: 850;
      letter-spacing: .11em;
    }


    .eo3d-header h2 {
      margin: 4px 0 1px;

      color: #fff;

      font-size: 25px;
    }


    .eo3d-header p {
      margin: 0;

      color: #7f899e;

      font-size: 13px;
    }


    .eo3d-header button {
      width: 44px;
      height: 44px;

      border: 1px solid rgba(255,255,255,.09);
      border-radius: 11px;

      background: rgba(255,255,255,.025);

      color: #aeb5c4;

      font-size: 23px;

      cursor: pointer;
    }


    .eo3d-content {
      min-height: 0;

      display: grid;
      grid-template-columns: minmax(0,1.6fr) 330px;
    }


    .eo3d-stage {
      min-width: 0;
      min-height: 420px;

      position: relative;

      background:
        radial-gradient(
          circle,
          rgba(91,140,255,.06),
          transparent 44%
        );
    }


    .eo3d-stage canvas {
      width: 100%;
      height: 100%;

      display: block;
    }


    .eo3d-info {
      padding: 18px;

      border-left: 1px solid rgba(255,255,255,.07);

      background: rgba(255,255,255,.012);
    }


    .eo3d-orbital-badge {
      min-height: 170px;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      border: 1px solid rgba(155,124,255,.18);
      border-radius: 17px;

      background: rgba(124,58,237,.045);
    }


    .eo3d-orbital-badge span {
      color: #81759d;

      font-size: 11px;
      font-weight: 800;
    }


    .eo3d-orbital-badge strong {
      margin-top: 5px;

      color: #fff;

      font-size: 48px;
    }


    .eo3d-orbital-badge small {
      color: #8992a6;

      font-size: 12px;
    }


    .eo3d-data {
      margin-top: 12px;

      border: 1px solid rgba(255,255,255,.07);
      border-radius: 12px;

      overflow: hidden;
    }


    .eo3d-data > div {
      min-height: 53px;

      padding: 0 12px;

      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;

      border-bottom: 1px solid rgba(255,255,255,.055);
    }


    .eo3d-data > div:last-child {
      border-bottom: 0;
    }


    .eo3d-data span {
      color: #7b8599;

      font-size: 12px;
    }


    .eo3d-data strong {
      color: #dce0e8;

      font-size: 13px;
    }


    .eo3d-note {
      margin-top: 12px;

      padding: 12px;

      border: 1px solid rgba(255,255,255,.055);
      border-radius: 10px;

      color: #737d91;

      font-size: 11px;
      line-height: 1.6;
    }


    .eo3d-footer {
      min-height: 66px;

      padding: 10px 18px;

      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;

      border-top: 1px solid rgba(255,255,255,.07);
    }


    .eo3d-footer > span {
      color: #70798d;

      font-size: 12px;
    }


    .eo3d-footer > div {
      display: flex;
      gap: 8px;
    }


    .eo3d-footer button {
      min-height: 42px;

      padding: 0 13px;

      border: 1px solid rgba(255,255,255,.08);
      border-radius: 9px;

      background: rgba(255,255,255,.02);

      color: #9ca4b6;

      font-size: 12px;

      cursor: pointer;
    }


    .eo3d-footer button:hover,
    .eo3d-footer button.active {
      border-color: rgba(155,124,255,.30);

      background: rgba(124,58,237,.08);

      color: #ded6fa;
    }


    @media (max-width: 800px) {

      .eo3d-overlay {
        padding: 8px;
      }


      .eo3d-window {
        height: calc(100vh - 16px);
      }


      .eo3d-content {
        grid-template-columns: 1fr;
        overflow-y: auto;
      }


      .eo3d-stage {
        min-height: 420px;
      }


      .eo3d-info {
        border-left: 0;
        border-top: 1px solid rgba(255,255,255,.07);
      }

    }
  `


  document.head
    .appendChild(
      style
    )

}