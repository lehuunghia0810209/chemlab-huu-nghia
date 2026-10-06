import * as THREE
  from 'three'

import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'

import './atom3dV5.css'


/* =========================================================
   CHEMLAB 5.0
   ATOM 3D ENGINE
========================================================= */

let activeViewer =
  null


const SHELL_NAMES = [
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q'
]


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

export function openAtom3D(
  element
) {

  closeAtom3D()


  const data =
    buildAtomData(
      element
    )


  const overlay =
    document.createElement(
      'div'
    )


  overlay.className =
    'a3v5-overlay'


  overlay.innerHTML = `
    <section
      class="a3v5-window"
      role="dialog"
      aria-modal="true"
      aria-label="Mô hình nguyên tử 3D"
    >

      <header class="a3v5-header">

        <div class="a3v5-heading">

          <span>
            NGUYÊN TỬ 3D
          </span>

          <h2>
            ${data.name}
          </h2>

          <p>
            Mô hình trực quan cấu trúc nguyên tử
          </p>

        </div>


        <div class="a3v5-header-right">

          <strong class="a3v5-big-symbol">
            ${data.symbol}
          </strong>


          <button
            type="button"
            class="a3v5-close"
            data-a3-close
            aria-label="Đóng mô hình"
          >
            ×
          </button>

        </div>

      </header>


      <section class="a3v5-shell-section">

        <span class="a3v5-shell-title">
          PHÂN BỐ ELECTRON
        </span>


        <div class="a3v5-shell-list">

          ${
            data.shells
              .map(
                (
                  count,
                  index
                ) => `
                  <div class="a3v5-shell-chip">

                    <strong>
                      ${
                        SHELL_NAMES[index] ||
                        `L${index + 1}`
                      }
                    </strong>

                    <span>
                      ${count}e⁻
                    </span>

                  </div>
                `
              )
              .join('')
          }

        </div>

      </section>


      <main class="a3v5-main">

        <div
          class="a3v5-stage"
          data-a3-stage
        >


          <div class="a3v5-legend">

            <span>

              <i class="proton"></i>

              Proton

            </span>


            <span>

              <i class="neutron"></i>

              Neutron

            </span>


            <span>

              <i class="electron"></i>

              Electron

            </span>

          </div>


          <div class="a3v5-hint">
            Kéo để xoay
            <b>·</b>
            Cuộn để phóng to / thu nhỏ
          </div>

        </div>

      </main>


      <section class="a3v5-stats">

        ${statCard(
          'Số hiệu',
          data.atomicNumber
        )}

        ${statCard(
          'Proton',
          data.protons
        )}

        ${statCard(
          'Neutron*',
          data.neutrons === null
            ? '—'
            : `≈ ${data.neutrons}`
        )}

        ${statCard(
          'Electron',
          data.electrons
        )}

        ${statCard(
          'Chu kỳ',
          data.period
        )}

      </section>


      <footer class="a3v5-footer">

        <div>

          <span class="a3v5-info-icon">
            i
          </span>

          <p>
            * Số neutron được ước tính từ
            nguyên tử khối làm tròn.
            Mô hình quỹ đạo chỉ dùng để trực quan học tập.
          </p>

        </div>


        <div class="a3v5-controls">

          <button
            type="button"
            class="active"
            data-a3-rotate
          >
            Tự xoay
          </button>


          <button
            type="button"
            data-a3-reset
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


  const stage =
    overlay.querySelector(
      '[data-a3-stage]'
    )


  /* =====================================================
     THREE
  ===================================================== */

  const renderer =
    new THREE.WebGLRenderer({

      antialias:
        true,

      alpha:
        true,

      powerPreference:
        'high-performance'

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


  renderer.outputColorSpace =
    THREE.SRGBColorSpace


  stage.prepend(
    renderer.domElement
  )


  const scene =
    new THREE.Scene()


  const camera =
    new THREE.PerspectiveCamera(
      43,
      1,
      .1,
      100
    )


  const controls =
    new OrbitControls(
      camera,
      renderer.domElement
    )


  controls.enableDamping =
    true


  controls.dampingFactor =
    .065


  controls.enablePan =
    false


  controls.minDistance =
    4


  controls.maxDistance =
    22


  /* =====================================================
     LIGHT
  ===================================================== */

  scene.add(
    new THREE.AmbientLight(
      0xffffff,
      1.55
    )
  )


  const light1 =
    new THREE.DirectionalLight(
      0xffffff,
      2.7
    )


  light1.position.set(
    5,
    6,
    7
  )


  scene.add(
    light1
  )


  const light2 =
    new THREE.PointLight(
      0x7c3aed,
      25,
      18
    )


  light2.position.set(
    -4,
    1,
    3
  )


  scene.add(
    light2
  )


  const light3 =
    new THREE.PointLight(
      0x22d3ee,
      15,
      20
    )


  light3.position.set(
    5,
    -2,
    -3
  )


  scene.add(
    light3
  )


  /* =====================================================
     MODEL
  ===================================================== */

  const atom =
    new THREE.Group()


  scene.add(
    atom
  )


  createNucleus(
    atom,
    data
  )


  createElectronShells(
    atom,
    data.shells
  )


  /* =====================================================
     CAMERA
  ===================================================== */

  const outerRadius =
    getShellRadius(
      data.shells.length - 1
    )


  const cameraDistance =
    Math.max(
      7.7,
      outerRadius *
      2.15
    )


  const resetCamera =
    () => {

      camera.position.set(
        cameraDistance *
        .68,

        cameraDistance *
        .38,

        cameraDistance
      )


      controls.target.set(
        0,
        0,
        0
      )


      controls.update()

    }


  resetCamera()


  /* =====================================================
     RESIZE
  ===================================================== */

  const resize =
    () => {

      const rect =
        stage
          .getBoundingClientRect()


      if (
        rect.width <=
          0 ||
        rect.height <=
          0
      ) {
        return
      }


      renderer.setSize(
        rect.width,
        rect.height,
        false
      )


      camera.aspect =
        rect.width /
        rect.height


      camera
        .updateProjectionMatrix()

    }


  const resizeObserver =
    new ResizeObserver(
      resize
    )


  resizeObserver.observe(
    stage
  )


  resize()


  /* =====================================================
     ANIMATION
  ===================================================== */

  let autoRotate =
    true


  let animationFrame =
    null


  const animate =
    () => {

      animationFrame =
        requestAnimationFrame(
          animate
        )


      if (
        autoRotate
      ) {

        atom.rotation.y +=
          .0016

      }


      controls.update()


      renderer.render(
        scene,
        camera
      )

    }


  animate()


  /* =====================================================
     CONTROL EVENTS
  ===================================================== */

  overlay
    .querySelector(
      '[data-a3-reset]'
    )
    .addEventListener(
      'click',
      resetCamera
    )


  overlay
    .querySelector(
      '[data-a3-rotate]'
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


  /* =====================================================
     CLEANUP
  ===================================================== */

  const keyHandler =
    event => {

      if (
        event.key ===
        'Escape'
      ) {

        close()

      }

    }


  const close =
    () => {

      document.removeEventListener(
        'keydown',
        keyHandler
      )


      resizeObserver.disconnect()


      cancelAnimationFrame(
        animationFrame
      )


      controls.dispose()


      disposeScene(
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
      '[data-a3-close]'
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


  document.addEventListener(
    'keydown',
    keyHandler
  )


  activeViewer = {

    overlay,

    close

  }

}


/* =========================================================
   COMPATIBILITY
========================================================= */

export const showAtom3D =
  openAtom3D


export const initAtom3D =
  openAtom3D


export function closeAtom3D() {

  activeViewer
    ?.close?.()

}


/* =========================================================
   DATA
========================================================= */

function buildAtomData(
  element
) {

  const atomicNumber =
    Number(
      element.number ??
      element.atomicNumber ??
      element.atomic_number ??
      1
    )


  const mass =
    parseMass(
      element.mass ??
      element.atomicMass ??
      element.atomic_mass
    )


  const shells =
    buildShellDistribution(
      atomicNumber
    )


  const neutrons =
    mass === null
      ? null
      : Math.max(
          0,
          Math.round(
            mass
          ) -
          atomicNumber
        )


  return {

    atomicNumber,

    protons:
      atomicNumber,

    electrons:
      atomicNumber,

    neutrons,

    mass,

    symbol:
      element.symbol ||
      '?',

    name:
      element.name ||
      'Unknown',

    shells,

    period:
      Number(
        element.period
      ) ||
      shells.length

  }

}


/* =========================================================
   ELECTRON SHELL DISTRIBUTION
========================================================= */

function buildShellDistribution(
  atomicNumber
) {

  const shells =
    []


  let remaining =
    atomicNumber


  for (
    const [
      orbital,
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


    const count =
      Math.min(
        remaining,
        capacity
      )


    const shellIndex =
      Number(
        orbital[0]
      ) -
      1


    shells[
      shellIndex
    ] =
      (
        shells[
          shellIndex
        ] ||
        0
      ) +
      count


    remaining -=
      count

  }


  return shells
    .map(
      value =>
        value ||
        0
    )

}


/* =========================================================
   NUCLEUS
========================================================= */

function createNucleus(
  group,
  data
) {

  const protonCount =
    data.protons


  const neutronCount =
    data.neutrons ??
    data.protons


  const total =
    protonCount +
    neutronCount


  const geometry =
    new THREE.SphereGeometry(
      total > 180
        ? .105
        : .125,
      12,
      10
    )


  const protonMaterial =
    new THREE.MeshStandardMaterial({

      color:
        0xf43f5e,

      emissive:
        0x7f1238,

      emissiveIntensity:
        .55,

      roughness:
        .34

    })


  const neutronMaterial =
    new THREE.MeshStandardMaterial({

      color:
        0x3b82f6,

      emissive:
        0x1e3a8a,

      emissiveIntensity:
        .45,

      roughness:
        .36

    })


  const protonMesh =
    new THREE.InstancedMesh(
      geometry,
      protonMaterial,
      protonCount
    )


  const neutronMesh =
    new THREE.InstancedMesh(
      geometry.clone(),
      neutronMaterial,
      neutronCount
    )


  const dummy =
    new THREE.Object3D()


  const random =
    seededRandom(
      data.atomicNumber *
      911 +
      total
    )


  const radius =
    .48 +
    Math.cbrt(
      total
    ) *
    .075


  let p =
    0


  let n =
    0


  for (
    let i =
      0;

    i <
      total;

    i++
  ) {

    const position =
      randomPointInSphere(
        random,
        radius
      )


    dummy.position.copy(
      position
    )


    dummy.rotation.set(
      random() *
      Math.PI,

      random() *
      Math.PI,

      random() *
      Math.PI
    )


    const scale =
      .82 +
      random() *
      .32


    dummy.scale.setScalar(
      scale
    )


    dummy.updateMatrix()


    const proton =
      (
        i +
        data.atomicNumber
      ) %
      2 ===
      0


    if (
      proton &&
      p <
      protonCount
    ) {

      protonMesh.setMatrixAt(
        p++,
        dummy.matrix
      )

    }

    else if (
      n <
      neutronCount
    ) {

      neutronMesh.setMatrixAt(
        n++,
        dummy.matrix
      )

    }

    else if (
      p <
      protonCount
    ) {

      protonMesh.setMatrixAt(
        p++,
        dummy.matrix
      )

    }

  }


  protonMesh.instanceMatrix
    .needsUpdate =
    true


  neutronMesh.instanceMatrix
    .needsUpdate =
    true


  group.add(
    protonMesh,
    neutronMesh
  )


  const glow =
    new THREE.Mesh(

      new THREE.SphereGeometry(
        radius *
        1.30,
        32,
        24
      ),

      new THREE.MeshBasicMaterial({

        color:
          0xa855f7,

        transparent:
          true,

        opacity:
          .035,

        side:
          THREE.BackSide

      })

    )


  group.add(
    glow
  )

}


/* =========================================================
   ELECTRON SHELLS
========================================================= */

function createElectronShells(
  group,
  shells
) {

  shells.forEach(
    (
      electronCount,
      index
    ) => {

      if (
        !electronCount
      ) {
        return
      }


      const radius =
        getShellRadius(
          index
        )


      const shellGroup =
        new THREE.Group()


      shellGroup.rotation.x =
        .30 +
        index *
        .105


      shellGroup.rotation.z =
        (
          index %
          3 -
          1
        ) *
        .17


      shellGroup.rotation.y =
        index *
        .13


      group.add(
        shellGroup
      )


      /* RING */

      const points =
        []


      for (
        let i =
          0;

        i <=
          128;

        i++
      ) {

        const angle =
          (
            i /
            128
          ) *
          Math.PI *
          2


        points.push(
          new THREE.Vector3(

            Math.cos(
              angle
            ) *
            radius,

            0,

            Math.sin(
              angle
            ) *
            radius

          )
        )

      }


      const ring =
        new THREE.Line(

          new THREE.BufferGeometry()
            .setFromPoints(
              points
            ),

          new THREE.LineBasicMaterial({

            color:
              0x7c3aed,

            transparent:
              true,

            opacity:
              .45

          })

        )


      shellGroup.add(
        ring
      )


      /* ELECTRONS */

      const electronSize =
        shells.length >=
        6
          ? .085
          : .115


      const geometry =
        new THREE.SphereGeometry(
          electronSize,
          12,
          10
        )


      const material =
        new THREE.MeshStandardMaterial({

          color:
            0x22d3ee,

          emissive:
            0x0891b2,

          emissiveIntensity:
            1.6,

          roughness:
            .12

        })


      const electrons =
        new THREE.InstancedMesh(
          geometry,
          material,
          electronCount
        )


      const dummy =
        new THREE.Object3D()


      for (
        let i =
          0;

        i <
          electronCount;

        i++
      ) {

        const angle =
          (
            i /
            electronCount
          ) *
          Math.PI *
          2 +
          index *
          .43


        dummy.position.set(

          Math.cos(
            angle
          ) *
          radius,

          0,

          Math.sin(
            angle
          ) *
          radius

        )


        dummy.scale.setScalar(
          1
        )


        dummy.updateMatrix()


        electrons.setMatrixAt(
          i,
          dummy.matrix
        )

      }


      electrons.instanceMatrix
        .needsUpdate =
        true


      shellGroup.add(
        electrons
      )

    }
  )

}


/* =========================================================
   SHELL RADIUS
========================================================= */

function getShellRadius(
  index
) {

  return (
    1.35 +
    index *
    .72
  )

}


/* =========================================================
   UI CARD
========================================================= */

function statCard(
  label,
  value
) {

  return `
    <article class="a3v5-stat">

      <span>
        ${label}
      </span>

      <strong>
        ${value}
      </strong>

    </article>
  `

}


/* =========================================================
   MASS
========================================================= */

function parseMass(
  value
) {

  const match =
    String(
      value ??
      ''
    )
      .replace(
        ',',
        '.'
      )
      .match(
        /\d+(?:\.\d+)?/
      )


  if (!match) {
    return null
  }


  const number =
    Number(
      match[0]
    )


  return Number.isFinite(
    number
  )
    ? number
    : null

}


/* =========================================================
   SEEDED RANDOM
========================================================= */

function seededRandom(
  seed
) {

  let value =
    seed >>> 0


  return () => {

    value +=
      0x6D2B79F5


    let t =
      value


    t =
      Math.imul(
        t ^
        t >>> 15,
        t |
        1
      )


    t ^=
      t +
      Math.imul(
        t ^
        t >>> 7,
        t |
        61
      )


    return (
      (
        t ^
        t >>> 14
      ) >>>
      0
    ) /
    4294967296

  }

}


/* =========================================================
   RANDOM SPHERE
========================================================= */

function randomPointInSphere(
  random,
  radius
) {

  const u =
    random()


  const v =
    random()


  const w =
    random()


  const theta =
    2 *
    Math.PI *
    u


  const phi =
    Math.acos(
      2 *
      v -
      1
    )


  const r =
    radius *
    Math.cbrt(
      w
    )


  return new THREE.Vector3(

    r *
    Math.sin(
      phi
    ) *
    Math.cos(
      theta
    ),

    r *
    Math.cos(
      phi
    ),

    r *
    Math.sin(
      phi
    ) *
    Math.sin(
      theta
    )

  )

}


/* =========================================================
   DISPOSE
========================================================= */

function disposeScene(
  scene
) {

  scene.traverse(
    object => {

      object.geometry
        ?.dispose?.()


      if (
        Array.isArray(
          object.material
        )
      ) {

        object.material
          .forEach(
            material =>
              material
                ?.dispose?.()
          )

      }

      else {

        object.material
          ?.dispose?.()

      }

    }
  )

}