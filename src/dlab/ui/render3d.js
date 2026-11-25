// Three.js view of the same simulation state. Lazy-loaded only when the user opens 3D.
// It never changes chemistry: pointer input is mapped to bench-plane (x, y) and handed to the shared
// Interaction Controller in dlabApp.js, which issues the same commands as the 2D canvas.
// Models are procedural (lathe/tube/box geometry, canvas textures) — no downloaded assets.
import * as THREE_NS from 'three'
import { createSceneHost } from '../../three/sceneHost.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { EQUIPMENT, halfWidthAt, innerHeight, levelForVolume } from '../data/equipment.js'
import { PRECIPITATES, REAGENT_BY_ID, GASES } from '../data/materials.js'
import { oilBelow } from '../engine/chemistry.js'
import { isContainer, volumeOf, solidRadiusMM, coatCoverage, byId, GW, GH, cellColor, fieldMean } from '../engine/processes.js'

const S = 0.01 // 1 mm = 0.01 scene units
const MAX = 600

export function create3dView(container, { quality = 'high', onPick, onHover, controller, insets } = {}) {
  const high = quality === 'high'
  const host = createSceneHost({ container, quality: high ? 'high' : 'low', cameraPosition: { x: 4.3, y: 2.2, z: 6.5 }, fov: 38, label: 'Bàn thí nghiệm 3D — cùng trạng thái với chế độ 2D' })
  if (!host) return null
  const { THREE, scene, camera, controls, renderer } = host
  renderer.localClippingEnabled = true
  const seg = high ? 48 : 22

  // ── Lighting & environment (reflections make glass edges readable) ─────────
  let envTex = null
  if (high) { // reflections only in high quality: PMREM + env sampling dominate cost on weak GPUs
    const pmrem = new THREE.PMREMGenerator(renderer)
    const room = new RoomEnvironment()
    envTex = pmrem.fromScene(room, 0.04).texture
    room.dispose?.()
    pmrem.dispose()
    scene.environment = envTex
  }
  scene.add(new THREE.HemisphereLight(0xf4f7ff, 0x3b4352, high ? 0.75 : 1.2))
  const key = new THREE.DirectionalLight(0xfff6ea, high ? 1.5 : 1.7)
  key.position.set(-2.5, 5, 4.5)
  const rim = new THREE.DirectionalLight(0xdbe8ff, 0.6)
  rim.position.set(3, 3, -4)
  scene.add(key, rim)

  // ── Bench: epoxy top with a rounded front edge, and a soft back wall ─────────
  const shared = new Set()
  const mat = (m) => { m.userData.shared = true; shared.add(m); return m }
  const benchTex = speckleTexture()
  const benchMat = mat(new THREE.MeshStandardMaterial({ color: 0x7a879b, map: benchTex, roughness: 0.55, metalness: 0.05 })) // grey epoxy resin top: glass edges still read, and contact shadows are visible (they were lost on the darker top)
  const bench = new THREE.Mesh(new THREE.BoxGeometry(30, 0.12, 3.2), benchMat)
  bench.position.set(5, -0.06, 0.2)
  const edge = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 30, 16), benchMat)
  edge.rotation.z = Math.PI / 2
  edge.position.set(5, -0.06, 1.8)
  const wallTex = tileTexture()
  wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping
  wallTex.repeat.set(30 / 1.5, 6 / 1.5) // 15 cm ceramic tiles, as on a school lab wall
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(30, 6), mat(new THREE.MeshBasicMaterial({ map: wallTex, toneMapped: false })))
  wall.position.set(5, 2.9, -1.4)
  scene.add(bench, edge, wall) // the wall is one unlit quad: kept at every quality so the bench never ends in a bare diagonal edge

  // ── Shared materials ──────────────────────────────────────────────────────
  // Standard (not Physical/clearcoat) glass: the physical shader cost ~10× on software GPUs.
  const glassMat = mat(new THREE.MeshStandardMaterial({ color: 0xeef6ff, metalness: 0.1, roughness: 0.05, transparent: true, opacity: high ? 0.14 : 0.18, envMapIntensity: 1.8, side: THREE.FrontSide, depthWrite: false }))
  // Schlick-style Fresnel on alpha (3 ALU ops per fragment): thin glass looks clear face-on and bright at the edges.
  glassMat.onBeforeCompile = sh => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', `diffuseColor.a = clamp( diffuseColor.a + 0.55 * pow( 1.0 - abs( dot( normal, normalize( vViewPosition ) ) ), 3.0 ), 0.0, 0.85 );
#include <opaque_fragment>`)
  }
  glassMat.customProgramCacheKey = () => 'dlab-fresnel-glass'
  // Thin glass (rod, dropper, pipette) is a few mm across: at the vessel opacity it vanished and the tool seemed to float.
  const thinGlassMat = mat(new THREE.MeshStandardMaterial({ color: 0xdbe8f5, metalness: 0.1, roughness: 0.08, transparent: true, opacity: 0.42, envMapIntensity: 1.8, depthWrite: false }))
  const rimMat = mat(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, depthWrite: false }))
  const tickMat = mat(new THREE.MeshBasicMaterial({ color: 0x5b6b80, transparent: true, opacity: 0.7, depthWrite: false }))
  const steel = mat(new THREE.MeshStandardMaterial(high ? { color: 0xb9c0c8, metalness: 0.85, roughness: 0.28 } : { color: 0xc9d3df, metalness: 0.35, roughness: 0.32 }))
  const darkPlastic = mat(new THREE.MeshStandardMaterial({ color: 0x2b313a, roughness: 0.6 }))
  const lightPlastic = mat(new THREE.MeshStandardMaterial({ color: 0xe9edf2, roughness: 0.5 }))
  const rubber = mat(new THREE.MeshStandardMaterial({ color: 0xa3261c, roughness: 0.7 }))
  const wood = mat(new THREE.MeshStandardMaterial({ color: 0xb98a5a, roughness: 0.75 }))
  const porcelain = mat(new THREE.MeshStandardMaterial({ color: 0xf7f7f4, roughness: 0.35 }))
  const shadowTex = radialTexture()
  const shadowMat = mat(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, color: 0x0b1220, opacity: 0.5 }))
  const ringGeo = new THREE.RingGeometry(0.88, 1, 64)
  ringGeo.rotateX(-Math.PI / 2)
  // Holder for hand tools standing on the bench: a 24 × 10 × 18 mm block with a slot.
  const HELD_UPRIGHT = new Set(['rod', 'spatula', 'tongs', 'dropper', 'pipette', 'thermometer'])
  // Retort stand (unit parts, scaled per tool): base plate, pole of unit height from its foot, clamp arm.
  const noPick = () => {}
  const STAND_Z = 48 * S // behind the tool, clear of a 250 mL beaker's wall
  const standBaseGeo = new THREE.BoxGeometry(46 * S, 4 * S, 30 * S).translate(0, 2 * S, 0)
  const standPoleGeo = new THREE.CylinderGeometry(2.4 * S, 2.4 * S, 1, 12).translate(0, 0.5, 0)
  const standArmGeo = new THREE.BoxGeometry(4 * S, 4 * S, 48 * S)
  for (const geo of [standBaseGeo, standPoleGeo, standArmGeo]) geo.userData.shared = true
  const holderGeo = new THREE.BoxGeometry(24 * S, 10 * S, 18 * S)
  holderGeo.userData.shared = true
  const holeGeo = new THREE.PlaneGeometry(9 * S, 5 * S).rotateX(-Math.PI / 2)
  holeGeo.userData.shared = true
  const planeGeo = new THREE.PlaneGeometry(1, 1)
  planeGeo.rotateX(-Math.PI / 2)

  const nodes = new Map()
  const bubbleMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, roughness: 0.05, metalness: 0, envMapIntensity: 2, depthWrite: false }), MAX)
  const partMesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }), MAX)
  partMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX * 3), 3)
  bubbleMesh.frustumCulled = partMesh.frustumCulled = false
  bubbleMesh.renderOrder = 3
  const streamMeshes = []
  const streamGeo = new THREE.CylinderGeometry(1, 0.7, 1, 12, 1, true)
  scene.add(bubbleMesh, partMesh)
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const v3 = new THREE.Vector3()
  const color = new THREE.Color()
  const sc = new THREE.Vector3()

  // ── Geometry builders ──────────────────────────────────────────────────────
  // Visual half-width: equals the simulation profile, except test tubes get a round bottom.
  function hw(def, y) {
    const w = halfWidthAt(def, y)
    if (def.shape === 'tube' && y < w) return Math.sqrt(Math.max(0, w * w - (w - y) ** 2))
    return w
  }
  function innerPts(def, inset = 0) {
    const H = innerHeight(def)
    const pts = [new THREE.Vector2(0, 2 * S)]
    const n = def.shape === 'tube' ? 30 : 24
    for (let i = 0; i <= n; i += 1) {
      const y = H * i / n
      pts.push(new THREE.Vector2(Math.max(0.0001, (hw(def, y) - inset) * S), (y + 2) * S))
    }
    return pts
  }
  // Closed outline (outer wall → rim → inner wall) so glass has real thickness and a bright rim.
  function glassShell(def, thick = 1.3) {
    const inner = innerPts(def)
    const outer = inner.slice(1).map(p => new THREE.Vector2(p.x + thick * S, p.y))
    const top = inner[inner.length - 1]
    const pts = [new THREE.Vector2(outer[0].x - 1 * S, 0), new THREE.Vector2(outer[0].x, 1 * S), ...outer.slice(1)]
    pts.push(new THREE.Vector2(top.x + thick * 0.5 * S, top.y + 0.7 * S))
    pts.push(...inner.slice(1).reverse())
    return new THREE.LatheGeometry(pts, seg)
  }

  // Pouring spout: the rim is pulled out and up over ±0.45 rad around −x (where real beakers have their lip).
  function addSpout(geo, def) {
    const H = (innerHeight(def) + 2) * S
    const p = geo.attributes.position
    for (let i = 0; i < p.count; i += 1) {
      const x = p.getX(i); const y = p.getY(i); const z = p.getZ(i)
      const t = Math.max(0, 1 - (H - y) / (7 * S)) // 0 below the top 7 mm, 1 at the rim
      if (!(t > 0)) continue
      const a = Math.atan2(z, -x)
      const k = Math.max(0, 1 - Math.abs(a) / 0.45)
      if (!(k > 0)) continue
      const bump = k * k * (3 - 2 * k) * t * t
      const r = Math.hypot(x, z)
      if (!(r > 0)) continue
      const nr = r + bump * 3.2 * S
      p.setXYZ(i, x * nr / r, y + bump * 1.5 * S, z * nr / r)
    }
    geo.computeVertexNormals()
    return geo
  }
  // Printed enamel graduations: a strip of the glass wall with ticks every minor step and numbers on majors.
  // Marks come from levelForVolume, the same function the engine uses, so the scale reads the true volume.
  function graduations(o, def) {
    const cyl = def.shape === 'cylinder'
    const minor = cyl ? 1 : def.capacityML >= 250 ? 10 : 5
    const major = cyl ? 10 : def.capacityML >= 250 ? 50 : 20
    const top = cyl ? def.capacityML : def.capacityML * 0.8
    const H = innerHeight(def)
    const c = document.createElement('canvas')
    c.width = 128
    c.height = 512
    const x = c.getContext('2d')
    x.fillStyle = '#ffffff'
    x.font = 'bold 34px system-ui, sans-serif'
    x.textBaseline = 'middle'
    const py = mL => 512 - (levelForVolume(o.type, mL) + 2) / (H + 4) * 512
    for (let i = 1; i * minor <= top + 1e-9; i += 1) {
      const mL = i * minor
      const isMajor = (mL % major) === 0
      x.fillRect(0, py(mL) - (isMajor ? 2.5 : 1.5), isMajor ? 54 : 30, isMajor ? 5 : 3)
      if (isMajor) x.fillText(String(mL), 60, py(mL))
    }
    x.font = '24px system-ui, sans-serif'
    x.fillText('mL', 60, Math.max(20, py(top) - 34))
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    const r = (hw(def, H * 0.5) + 1.45) * S
    // Open partial cylinder facing the default camera (+z, slightly left), drawn after the glass.
    const geo = new THREE.CylinderGeometry(r, r, (H + 4) * S, 24, 1, true, -0.55, 0.75)
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, color: 0xf4f8ff }))
    m.position.y = (H + 4) * S / 2
    m.renderOrder = 3
    return m
  }

  function vessel(o, def) {
    const g = new THREE.Group()
    const porcelainBowl = def.material === 'porcelain'
    const shellGeo = glassShell(def)
    if (['beaker', 'cylinder'].includes(def.shape) && !o.stock) addSpout(shellGeo, def)
    const shell = new THREE.Mesh(shellGeo, porcelainBowl ? porcelain : glassMat)
    shell.renderOrder = 2
    const base = new THREE.Mesh(new THREE.CircleGeometry(Math.max(S, (hw(def, 0) + 0.6) * S), seg).rotateX(-Math.PI / 2).translate(0, 1 * S, 0), porcelainBowl ? porcelain : glassMat)
    base.renderOrder = 2
    if (def.shape !== 'tube') g.add(base)
    else base.geometry.dispose()
    const H = innerHeight(def)
    const rimR = (hw(def, H) + 0.9) * S
    const rimRing = new THREE.Mesh(new THREE.TorusGeometry(rimR, 0.55 * S, 8, seg), rimMat)
    rimRing.rotation.x = Math.PI / 2
    rimRing.position.y = (H + 2.2) * S
    g.add(shell)
    if (!porcelainBowl) g.add(rimRing)
    else rimRing.geometry.dispose()
    // Test tubes standing on the bench sit in a wire stand (thin: the liquid at the bottom stays visible).
    if (def.shape === 'tube' && !o.stock) {
      const st = new THREE.Group()
      const r = (hw(def, 20) + 1.2) * S
      const ringA = new THREE.Mesh(new THREE.TorusGeometry(r, 0.7 * S, 6, 24), steel)
      ringA.rotation.x = Math.PI / 2
      ringA.position.y = def.h * 0.45 * S
      const ringB = new THREE.Mesh(new THREE.TorusGeometry(r * 1.6, 0.8 * S, 6, 24), steel)
      ringB.rotation.x = Math.PI / 2
      ringB.position.y = 0.8 * S
      st.add(ringA, ringB)
      for (let i = 0; i < 3; i += 1) {
        const t = i * Math.PI * 2 / 3
        const top = new THREE.Vector3(Math.cos(t) * r, def.h * 0.45 * S, Math.sin(t) * r)
        const bot = new THREE.Vector3(Math.cos(t) * r * 1.6, 0.8 * S, Math.sin(t) * r * 1.6)
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.6 * S, 0.6 * S, top.distanceTo(bot), 6), steel)
        leg.position.copy(top).add(bot).multiplyScalar(0.5)
        leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), top.clone().sub(bot).normalize())
        st.add(leg)
      }
      st.traverse(m => { if (m.isMesh) m.raycast = noPick })
      g.add(st)
      g.userData.tubeStand = st
    }
    // Graduations printed at real volume marks. The flask's sloped wall keeps simple ticks
    // (a straight strip would not follow its cone).
    if (['beaker', 'cylinder'].includes(def.shape) && !o.stock) g.add(graduations(o, def))
    if (def.shape === 'cylinder') { // hexagonal foot keeps a tall cylinder from tipping
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(def.w * 0.95 * S, def.w * 1.05 * S, 4 * S, 6), glassMat)
      foot.position.y = 1 * S
      foot.renderOrder = 2
      g.add(foot)
    }
    if (def.shape === 'flask' && !o.stock) {
      for (const mL of [25, 50, 75]) {
        const y = levelForVolume(o.type, mL)
        const r = (hw(def, y) + 1.4) * S
        const tick = new THREE.Mesh(new THREE.BoxGeometry(def.w * 0.18 * S, 0.5 * S, 0.3 * S), tickMat)
        tick.position.set(-r * 0.35, (y + 2) * S, r * 0.94)
        tick.rotation.y = -0.36
        g.add(tick)
      }
    }
    // Liquid: interior surface clipped by a world-horizontal plane, plus a flat surface disc.
    const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)
    const tex = document.createElement('canvas')
    tex.width = GW
    tex.height = GH
    const map = new THREE.CanvasTexture(tex)
    map.colorSpace = THREE.SRGBColorSpace
    map.magFilter = map.minFilter = THREE.LinearFilter
    const liquidGeo = new THREE.LatheGeometry(innerPts(def, 0.6), seg)
    const liquid = new THREE.Mesh(liquidGeo, new THREE.MeshStandardMaterial({ map, transparent: true, roughness: 0.15, metalness: 0, side: THREE.DoubleSide, clippingPlanes: [plane], depthWrite: false }))
    liquid.renderOrder = 1
    const surface = new THREE.Mesh(new THREE.CircleGeometry(1, seg), new THREE.MeshStandardMaterial({ transparent: true, roughness: 0.08, metalness: 0, depthWrite: false, envMapIntensity: 1.4 }))
    surface.rotation.x = -Math.PI / 2
    surface.renderOrder = 1
    // Bright meniscus line where the liquid meets the glass: makes the level readable from any angle.
    const meniscus = new THREE.Mesh(new THREE.RingGeometry(0.96, 1, seg), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45, depthWrite: false, side: THREE.DoubleSide }))
    meniscus.position.z = 0.0003
    surface.add(meniscus)
    const settled = new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(0, 1), new THREE.Vector2(0.55, 0.92), new THREE.Vector2(0.88, 0.62), new THREE.Vector2(1, 0)], seg), new THREE.MeshStandardMaterial({ roughness: 0.95 }))
    settled.visible = false
    g.add(liquid, settled)
    scene.add(surface)
    g.userData.liq = { liquid, surface, plane, tex, map, settled, level: -1, hwMax: Math.max(...innerPts(def).map(p => p.x)) }
    if (o.stock) g.add(bottleDress(o, def))
    return g
  }

  function bottleDress(o, def) {
    const g = new THREE.Group()
    const r = REAGENT_BY_ID[o.reagent]
    const H = innerHeight(def)
    const neck = hw(def, H)
    const cap = new THREE.Mesh(new THREE.CylinderGeometry((neck + 2.6) * S, (neck + 2.6) * S, 11 * S, seg), r?.hazards?.includes('corrosive') ? rubber : darkPlastic)
    cap.position.y = (H + 7) * S
    const c = document.createElement('canvas')
    c.width = 256
    c.height = 128
    const x = c.getContext('2d')
    x.fillStyle = '#fbfbf8'
    x.fillRect(0, 0, 256, 128)
    x.fillStyle = r?.hazards?.length ? '#e07b16' : '#3b82f6'
    x.fillRect(0, 0, 256, 14)
    x.fillStyle = '#111827'
    x.textAlign = 'center'
    x.font = 'bold 44px system-ui, sans-serif'
    x.fillText(subscript(r?.formula || ''), 128, 66, 236)
    x.font = '22px system-ui, sans-serif'
    x.fillText(r?.name || '', 128, 104, 236)
    const labelTex = new THREE.CanvasTexture(c)
    labelTex.colorSpace = THREE.SRGBColorSpace
    const rr = (hw(def, 10) + 1.6) * S
    const label = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, def.h * 0.36 * S, seg, 1, true, -Math.PI * 0.42, Math.PI * 0.84), new THREE.MeshStandardMaterial({ map: labelTex, roughness: 0.7 }))
    label.position.y = def.h * 0.34 * S
    g.add(cap, label)
    return g
  }

  function tool(o, def) {
    const g = new THREE.Group()
    const h = def.h * S
    const add = (geo, m, y = 0, x = 0, z = 0) => { const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); g.add(mesh); return mesh }
    switch (o.type) {
      case 'dropper': {
        add(new THREE.CylinderGeometry(3 * S, 3 * S, h * 0.68, 16), thinGlassMat, h * 0.34 + 6 * S)
        add(new THREE.ConeGeometry(3 * S, 8 * S, 16).rotateX(Math.PI), thinGlassMat, 4 * S)
        const bulb = add(new THREE.SphereGeometry(5.2 * S, 18, 14), rubber, h * 0.82)
        bulb.scale.y = 1.6
        g.userData.fill = add(new THREE.CylinderGeometry(2.2 * S, 2.2 * S, 1, 12), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.85 }), 0)
        break
      }
      case 'pipette': {
        add(new THREE.CylinderGeometry(2.2 * S, 2.2 * S, h * 0.9, 14), thinGlassMat, h * 0.5)
        add(new THREE.SphereGeometry(5 * S, 16, 12).scale(1, 2.2, 1), thinGlassMat, h * 0.45)
        add(new THREE.ConeGeometry(2.2 * S, 10 * S, 14).rotateX(Math.PI), thinGlassMat, 5 * S)
        add(new THREE.CylinderGeometry(4 * S, 4 * S, 12 * S, 14), rubber, h * 0.96)
        g.userData.fill = add(new THREE.CylinderGeometry(1.6 * S, 1.6 * S, 1, 12), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.85 }), 0)
        break
      }
      case 'rod':
        add(new THREE.CylinderGeometry(2.6 * S, 2.6 * S, h, 16), thinGlassMat, h / 2)
        add(new THREE.SphereGeometry(2.6 * S, 12, 8), thinGlassMat, 0)
        add(new THREE.SphereGeometry(2.6 * S, 12, 8), thinGlassMat, h)
        break
      case 'spatula':
        add(new THREE.BoxGeometry(4 * S, h - 4 * S, 1.2 * S), steel, (h + 4 * S) / 2)
        add(new THREE.SphereGeometry(6 * S, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2).rotateX(Math.PI).scale(1, 0.45, 0.8), steel, 5 * S)
        add(new THREE.BoxGeometry(6 * S, 14 * S, 1.6 * S), steel, h - 7 * S) // flat blade end
        break
      case 'tongs': {
        for (const s of [-1, 1]) {
          const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(s * 1.5 * S, h - 2 * S, 0),
            new THREE.Vector3(s * 6 * S, h * 0.62, 0),
            new THREE.Vector3(s * 5 * S, h * 0.3, 0),
            new THREE.Vector3(s * 2.4 * S, 8 * S, 0)
          ])
          add(new THREE.TubeGeometry(curve, high ? 24 : 12, 1.3 * S, 8), steel)
          add(new THREE.BoxGeometry(2.6 * S, 8 * S, 3.6 * S), darkPlastic, 6 * S, s * 2.4 * S) // rubber-coated jaws
        }
        add(new THREE.CylinderGeometry(3 * S, 3 * S, 5 * S, 12).rotateX(Math.PI / 2), steel, h - 3 * S)
        break
      }
      case 'litmusPaper': {
        const tex = document.createElement('canvas')
        tex.width = 1
        tex.height = def.segments
        const map = new THREE.CanvasTexture(tex)
        map.magFilter = THREE.NearestFilter
        map.colorSpace = THREE.SRGBColorSpace
        add(new THREE.BoxGeometry(def.w * S, h, 0.4 * S), new THREE.MeshStandardMaterial({ map, roughness: 0.95 }), h / 2)
        g.userData.paper = { tex, map, key: '' }
        break
      }
      case 'thermometer':
        add(new THREE.CylinderGeometry(3.4 * S, 3.4 * S, h * 0.92, 16), glassMat, h * 0.5)
        add(new THREE.SphereGeometry(4.2 * S, 16, 12), new THREE.MeshStandardMaterial({ color: 0xd22b2b, roughness: 0.3 }), 4 * S)
        g.userData.column = add(new THREE.CylinderGeometry(1.1 * S, 1.1 * S, 1, 8), new THREE.MeshBasicMaterial({ color: 0xd22b2b }), 0)
        break
      case 'phMeter': {
        add(new THREE.CylinderGeometry(4.5 * S, 5 * S, h * 0.6, 18), darkPlastic, h * 0.62)
        add(new THREE.CylinderGeometry(3 * S, 3 * S, h * 0.32, 14), glassMat, h * 0.16)
        add(new THREE.SphereGeometry(3.4 * S, 14, 10), glassMat, 2 * S)
        g.userData.screen = screenFace(g, 14, 9, h * 0.82, 5.2)
        break
      }
      case 'burner': {
        add(new THREE.BoxGeometry(def.w * S, def.h * 0.7 * S, 60 * S), lightPlastic, def.h * 0.35 * S)
        const plate = add(new THREE.CylinderGeometry(def.w * 0.36 * S, def.w * 0.36 * S, 4 * S, seg), new THREE.MeshStandardMaterial({ color: 0x1f2329, roughness: 0.4, emissive: 0x000000 }), def.h * 0.75 * S)
        g.userData.hot = plate
        add(new THREE.CylinderGeometry(4 * S, 4 * S, 3 * S, 12).rotateX(Math.PI / 2), darkPlastic, def.h * 0.35 * S, def.w * 0.32 * S, 30 * S)
        break
      }
      case 'power':
      case 'voltmeter':
        add(new THREE.BoxGeometry(def.w * S, def.h * S, 50 * S), o.type === 'power' ? lightPlastic : new THREE.MeshStandardMaterial({ color: 0xf2c94c, roughness: 0.5 }), def.h * S / 2)
        g.userData.screen = screenFace(g, def.w * 0.7, def.h * 0.45, def.h * 0.62 * S, 25.2)
        for (const s of [-1, 1]) add(new THREE.CylinderGeometry(3 * S, 3 * S, 4 * S, 12).rotateX(Math.PI / 2), s < 0 ? darkPlastic : rubber, def.h * 0.2 * S, s * def.w * 0.3 * S, 26 * S)
        break
      case 'electrodes':
        add(new THREE.BoxGeometry(def.w * S, 6 * S, 10 * S), darkPlastic, h - 3 * S)
        for (const s of [-1, 1]) {
          const rod = add(new THREE.CylinderGeometry(2.8 * S, 2.8 * S, h - 6 * S, 12), new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.5, metalness: 0.3 }), (h - 6 * S) / 2, s * def.w * 0.32 * S)
          if (s < 0) g.userData.cathode = rod // left rod is the cathode (−), as in 2D
        }
        break
      case 'bridge': {
        const w = def.w * S / 2 - 6 * S
        const path = new THREE.CatmullRomCurve3([new THREE.Vector3(-w, 0, 0), new THREE.Vector3(-w, h * 0.8, 0), new THREE.Vector3(0, h, 0), new THREE.Vector3(w, h * 0.8, 0), new THREE.Vector3(w, 0, 0)])
        add(new THREE.TubeGeometry(path, 40, 5 * S, 12), new THREE.MeshStandardMaterial({ color: 0xf4f1e8, roughness: 0.6 }))
        break
      }
      case 'gasTank':
        add(new THREE.CylinderGeometry(def.w * 0.5 * S, def.w * 0.5 * S, h * 0.82, seg), new THREE.MeshStandardMaterial({ color: 0x3e6d9c, roughness: 0.35, metalness: 0.5 }), h * 0.41)
        add(new THREE.SphereGeometry(def.w * 0.5 * S, seg, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x3e6d9c, roughness: 0.35, metalness: 0.5 }), h * 0.82)
        add(new THREE.CylinderGeometry(4 * S, 4 * S, h * 0.12, 12), steel, h * 0.94)
        break
      case 'rack':
        add(new THREE.BoxGeometry(def.w * S, 6 * S, 40 * S), wood, def.h * 0.55 * S)
        add(new THREE.BoxGeometry(def.w * S, 5 * S, 40 * S), wood, 2.5 * S)
        for (const s of [-1, 1]) add(new THREE.BoxGeometry(5 * S, def.h * S, 40 * S), wood, def.h * S / 2, s * (def.w / 2 - 2.5) * S)
        break
      default:
        add(new THREE.CylinderGeometry(def.w * S / 3, def.w * S / 3, h, 12), lightPlastic, h / 2)
    }
    if (HELD_UPRIGHT.has(o.type) || ['electrodes', 'bridge', 'litmusPaper'].includes(o.type)) {
      // A tool parked above the bench (the labs keep tongs, droppers and electrodes ready over the vessels)
      // hangs in a retort-stand clamp; the stand reaches down to the bench, so nothing floats.
      const stand = new THREE.Group()
      const base = new THREE.Mesh(standBaseGeo, darkPlastic)
      const pole = new THREE.Mesh(standPoleGeo, steel)
      const arm = new THREE.Mesh(standArmGeo, steel)
      const gy = o.type === 'electrodes' || o.type === 'bridge' ? h * 0.95 : h * 0.72 // electrodes: the top bar; bridge: the arch
      arm.position.set(0, gy, -STAND_Z / 2)
      pole.position.z = base.position.z = -STAND_Z
      stand.add(base, pole, arm)
      for (const m of [base, pole, arm]) m.raycast = noPick // scenery: never takes a click (hidden meshes are still ray-tested)
      stand.userData = { base, pole, gy }
      g.add(stand)
      g.userData.stand = stand
    }
    if (HELD_UPRIGHT.has(o.type)) {
      const holder = new THREE.Group()
      const block = new THREE.Mesh(holderGeo, lightPlastic)
      block.position.y = 5 * S
      const hole = new THREE.Mesh(holeGeo, darkPlastic)
      hole.position.y = 10.05 * S
      holder.add(block, hole)
      block.raycast = hole.raycast = noPick
      g.add(holder)
      g.userData.holder = holder
    }
    return g
  }

  // Small canvas-textured display on the front of a meter.
  function screenFace(g, wmm, hmm, y, z) {
    const c = document.createElement('canvas')
    c.width = 128
    c.height = 64
    const map = new THREE.CanvasTexture(c)
    map.colorSpace = THREE.SRGBColorSpace
    const m = new THREE.Mesh(new THREE.PlaneGeometry(wmm * S, hmm * S), new THREE.MeshBasicMaterial({ map, toneMapped: false }))
    m.position.set(0, y, z * S)
    g.add(m)
    return { c, map, text: null }
  }
  function setScreen(scr, text) {
    if (!scr || scr.text === text) return
    scr.text = text
    const x = scr.c.getContext('2d')
    x.fillStyle = '#10261c'
    x.fillRect(0, 0, 128, 64)
    x.fillStyle = '#7dffb0'
    x.font = 'bold 34px ui-monospace, monospace'
    x.textAlign = 'center'
    x.textBaseline = 'middle'
    x.fillText(text, 64, 34, 120)
    scr.map.needsUpdate = true
  }

  // Solid samples: recognisable shapes scaled from the engine's physical radius.
  function solidModel(o) {
    const r = REAGENT_BY_ID[o.reagent]
    const metal = r.group === 'metal'
    const m = new THREE.MeshStandardMaterial({ color: new THREE.Color().setRGB(...(r.color || [240, 240, 240]).map(c => c / 255), THREE.SRGBColorSpace), roughness: metal ? 0.38 : 0.85, metalness: metal ? 0.75 : 0 })
    const g = new THREE.Group()
    let geo
    if (r.shape === 'cylinder' && o.reagent === 'fe') {
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 3.2, 14), m)
      const head = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.14, 18), m)
      head.position.y = 1.6
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 14), m)
      tip.position.y = -1.85
      tip.rotation.x = Math.PI
      const nail = new THREE.Group()
      nail.add(shaft, head, tip)
      nail.rotation.z = Math.PI / 2
      nail.position.y = 0.22
      g.add(nail)
    }
    else if (r.shape === 'cylinder') {
      const pts = []
      for (let i = 0; i <= 60; i += 1) { const a = i / 60 * Math.PI * 5; pts.push(new THREE.Vector3(Math.cos(a) * 0.6, 0.25 + i / 60 * 1.4, Math.sin(a) * 0.6)) }
      geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.1, 8)
    }
    else if (r.shape === 'ribbon') geo = new THREE.BoxGeometry(3, 0.08, 0.5).translate(0, 0.04, 0)
    else if (r.shape === 'powder') geo = new THREE.ConeGeometry(1.25, 0.8, 20).translate(0, 0.4, 0)
    else {
      geo = new THREE.IcosahedronGeometry(1, 1)
      const p = geo.attributes.position
      let k = 7
      for (let i = 0; i < p.count; i += 1) { k = (k * 9301 + 49297) % 233280; v3.fromBufferAttribute(p, i).multiplyScalar(0.82 + 0.3 * k / 233280); p.setXYZ(i, v3.x, v3.y * 0.8, v3.z) }
      geo = geo.toNonIndexed()
      geo.computeVertexNormals()
      geo.translate(0, 0.8, 0)
    }
    if (geo) g.add(new THREE.Mesh(geo, m))
    g.userData.mat = m
    g.userData.base = r.color || [240, 240, 240]
    return g
  }

  function build(o) {
    const def = EQUIPMENT[o.type]
    const g = o.type === 'solid' ? solidModel(o) : isContainer(o) ? vessel(o, def) : tool(o, def)
    const node = new THREE.Group()
    node.add(g)
    node.userData.id = o.id
    node.userData.body = g
    if (o.type !== 'solid') {
      g.position.y = -def.h * S / 2 // pivot at mid-height, like the 2D frame
      const foot = (def.w + 14) * S
      const shadow = new THREE.Mesh(planeGeo, shadowMat.clone())
      shadow.scale.set(foot * 1.25, 1, foot * (isContainer(o) ? 1.25 : 0.7))
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x2f7cf6, transparent: true, depthWrite: false }))
      ring.visible = false
      ring.scale.setScalar(Math.max((def.w / 2 + 7) * S, 0.08)) // just outside the foot: marks the object without covering the bench around it
      scene.add(shadow, ring)
      node.userData.shadow = shadow
      node.userData.ring = ring
    }
    scene.add(node)
    return node
  }

  // ── Camera framing: fit the objects into the part of the canvas not covered by drawers ──
  const home = { pos: new THREE.Vector3(), target: new THREE.Vector3() }
  let lastInsets = { l: 0, r: 0, t: 0 }
  function applyViewOffset(ins = lastInsets) {
    lastInsets = ins
    const w = Math.max(1, host.canvas.clientWidth)
    const h = Math.max(1, host.canvas.clientHeight)
    const dx = (ins.l - ins.r) / 2
    const dy = ins.t / 2
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) camera.clearViewOffset()
    else camera.setViewOffset(w, h, -dx, -dy, w, h)
  }
  function frameFor(state, ins = lastInsets) {
    const objs = state.objects.filter(o => o.type !== 'solid' || !o.in)
    if (!objs.length) return null
    let x0 = Infinity, x1 = -Infinity, top = 0.3
    for (const o of objs) {
      const def = EQUIPMENT[o.type] || { w: 10, h: 10 }
      x0 = Math.min(x0, (o.x - def.w / 2) * S)
      x1 = Math.max(x1, (o.x + def.w / 2) * S)
      top = Math.max(top, (o.y + def.h) * S)
    }
    const w = Math.max(1, host.canvas.clientWidth)
    const h = Math.max(1, host.canvas.clientHeight)
    const freeW = Math.max(0.3, (w - ins.l - ins.r) / w)
    const freeH = Math.max(0.4, (h - ins.t - 70) / h)
    const vfov = camera.fov * Math.PI / 180
    const aspect = w / h
    const spanX = (x1 - x0) + 0.35
    const spanY = top + 0.9 // head-room above the tallest object: a vessel lifted to pour must stay in view (0.55 was tried: T02 lifted out of view)
    const dist = Math.max(1.6, (spanX / 2) / (Math.tan(vfov / 2) * aspect * freeW) * 1.08, (spanY / 2) / (Math.tan(vfov / 2) * freeH) * 1.15)
    const target = new THREE.Vector3((x0 + x1) / 2, Math.min(spanY * 0.34, 1.2), 0)
    const dir = new THREE.Vector3(Math.sin(0.1), 0.48, Math.cos(0.1)).normalize() // from the front, a little above and to the side: depth without vessels hiding each other
    return { pos: target.clone().addScaledVector(dir, dist), target }
  }
  function fit(ins, animate = true) {
    if (ins) applyViewOffset(ins)
    const f = frameFor(lastState)
    if (!f) return
    home.pos.copy(f.pos)
    home.target.copy(f.target)
    host.setHome(f.pos, f.target)
    if (animate) host.flyTo(f.pos, f.target)
    else { camera.position.copy(f.pos); controls.target.copy(f.target); controls.update() }
    clampLimits()
  }
  // Sensible limits: never under the bench, never behind the wall, no wild spins.
  controls.minPolarAngle = 0.35
  controls.maxPolarAngle = 1.36
  controls.minAzimuthAngle = -1.0
  controls.maxAzimuthAngle = 1.0
  controls.minDistance = 1.2 // 120 mm: close enough to inspect a sodium piece, not inside a vessel
  controls.maxDistance = 16
  controls.zoomToCursor = true
  controls.keys = { LEFT: '', UP: '', RIGHT: '', BOTTOM: '' } // arrows are handled below (camera or selected object)
  let bounds = { x0: -2, x1: 12 }
  function clampLimits() {
    const t = controls.target
    t.x = Math.max(bounds.x0, Math.min(bounds.x1, t.x))
    t.y = Math.max(0.05, Math.min(2.4, t.y))
    t.z = Math.max(-0.6, Math.min(0.8, t.z))
  }
  controls.addEventListener('change', clampLimits)

  // ── Per-frame update from the shared simulation state ─────────────────────
  let lastState = null
  let framed = false
  let lastSel = null

  // Wires (power → electrodes, voltmeter leads): thin sagging tubes, rebuilt only when a wire or an end moves.
  const wireGroup = new THREE.Group()
  scene.add(wireGroup)
  const wireMat = mat(new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.6 }))
  let wireKey = ''
  function updateWires(state) {
    const ends = (state.wires || []).map(w => [byId(state, w.from), byId(state, w.to)]).filter(([a, b]) => a && b)
    const key = ends.map(([a, b]) => `${a.id}:${a.x | 0},${a.y | 0}-${b.id}:${b.x | 0},${b.y | 0}`).join('|')
    if (key === wireKey) return
    wireKey = key
    for (const m of [...wireGroup.children]) { wireGroup.remove(m); m.geometry.dispose() }
    for (const [a, b] of ends) {
      const top = o => { const c = o.type === 'solid' && o.in && byId(state, o.in); return new THREE.Vector3(o.x * S, (c ? c.y + EQUIPMENT[c.type].h + 6 : o.y + (EQUIPMENT[o.type]?.h || 20) * (o.type === 'electrodes' ? 1 : 0.6)) * S, 0.12) }
      const p0 = top(a)
      const p1 = top(b)
      const mid = p0.clone().lerp(p1, 0.5)
      mid.y = Math.max(0.03, Math.min(p0.y, p1.y) - 0.15) // sag, never below the bench
      wireGroup.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(p0, mid, p1), 24, 1.2 * S, 6), wireMat))
    }
  }
  function update(state, ui = {}) {
    lastState = state
    if (!framed) { fit(insets?.() || lastInsets, false); framed = true }
    updateWires(state)
    const alive = new Set()
    let b = 0
    let p = 0
    const xs = []
    for (const o of state.objects) {
      alive.add(o.id)
      let node = nodes.get(o.id)
      if (!node) { node = build(o); nodes.set(o.id, node) }
      const def = EQUIPMENT[o.type]
      xs.push(o.x * S)
      if (o.type === 'solid') {
        const c = o.in && byId(state, o.in)
        const r = Math.max(1.2, solidRadiusMM(o)) * S
        node.scale.setScalar(o.massG > 0 ? r : 0.0001)
        node.visible = o.massG > 0
        if (c) node.position.set((c.x + o.lx) * S, (c.y + o.ly + 2) * S, 0)
        else node.position.set(o.x * S, o.y * S, 0)
        const f = coatCoverage(o)
        const coatColor = o.coat?.Ag ? [200, 200, 205] : [190, 90, 50]
        const base = node.userData.body.userData.base
        node.userData.body.userData.mat.color.setRGB(...base.map((v, i) => (v + (coatColor[i] - v) * f) / 255), SRGB)
        continue
      }
      node.position.set(o.x * S, (o.y + def.h / 2) * S, 0)
      node.rotation.z = -(o.angle || 0)
      node.visible = o.condition !== 'UNUSABLE'
      node.updateMatrixWorld()
      // Contact shadow fades and spreads as the object is lifted; ring marks hover/selection/hold.
      const lift = o.y * S
      const sh = node.userData.shadow
      sh.position.set(o.x * S, 0.002, 0)
      sh.material.opacity = node.visible ? Math.max(0.08, 0.5 - lift * 0.8) : 0
      const sel = ui.selected === o.id
      const held = ui.held === o.id
      const hov = ui.hover === o.id
      const guide = ui.highlight?.includes(o.id)
      const drop = ui.drop?.id === o.id ? ui.drop : null
      const ring = node.userData.ring
      ring.visible = node.visible && (sel || hov || guide || Boolean(drop))
      ring.position.set(o.x * S, 0.004, 0)
      ring.material.color.setHex(drop ? (drop.ok ? 0x16a34a : 0xdc2626) : guide && !sel ? 0xe09a00 : 0x2f7cf6)
      ring.material.opacity = drop ? 0.95 : held ? 0.95 : sel ? 0.75 : guide ? 0.8 : 0.35
      const u = node.userData.body.userData
      if (u.paper && o.seg) {
        const k = o.seg.map(x => x.rgb.join(',')).join('|')
        if (k !== u.paper.key) {
          u.paper.key = k
          const c2 = u.paper.tex.getContext('2d')
          o.seg.forEach((sg, i) => { c2.fillStyle = `rgb(${sg.rgb.map(Math.round).join(',')})`; c2.fillRect(0, o.seg.length - 1 - i, 1, 1) })
          u.paper.map.needsUpdate = true
        }
      }
      const overVessel = state.objects.some(c => c.id !== o.id && isContainer(c) && Math.abs(c.x - o.x) < EQUIPMENT[c.type].w / 2 + 6 && o.y < c.y + EQUIPMENT[c.type].h + 4)
      const parked = !held && !o.inside && !overVessel && !(Math.abs(o.angle || 0) > 0.02)
      if (u.holder) u.holder.visible = parked && !(o.y > 1)
      if (u.tubeStand) u.tubeStand.visible = !held && !(o.y > 1) && !(Math.abs(o.angle || 0) > 0.02) && !state.objects.some(r => r.type === 'rack' && Math.abs(r.x - o.x) < EQUIPMENT.rack.w / 2)
      if (u.stand) {
        u.stand.visible = parked && o.y > 1
        if (u.stand.visible) {
          const sd = u.stand.userData
          sd.base.position.y = -o.y * S // the bench, in the tool's own frame
          sd.pole.position.y = -o.y * S
          sd.pole.scale.y = o.y * S + sd.gy + 6 * S
        }
      }
      if (u.hot) u.hot.material.emissive.setHex(o.on ? 0xb33a00 : 0x000000)
      if (u.cathode) { const d = Math.min(1, (o.cuDeposit || 0) / 3e-4); u.cathode.material.color.setRGB((50 + 150 * d) / 255, (50 + 60 * d) / 255, (50 + 10 * d) / 255, SRGB) }
      if (u.column) { const len = Math.max(2, Math.min(def.h * 0.85, (o.reading ?? 25) / 110 * def.h * 0.85)) * S; u.column.scale.y = len; u.column.position.y = 6 * S + len / 2 }
      if (u.fill) {
        const vol = volumeOf({ contents: o.contents || { liquids: {} } })
        const len = Math.min(def.h * 0.6, vol / def.capacityML * def.h * 0.6) * S
        u.fill.visible = vol > 0.001
        u.fill.scale.y = Math.max(0.0001, len)
        u.fill.position.y = 8 * S + len / 2
        const col = o.vis?.target || [200, 220, 240, 0.4]
        u.fill.material.color.setRGB(col[0] / 255, col[1] / 255, col[2] / 255, SRGB)
      }
      if (o.type === 'phMeter') setScreen(u.screen, o.reading == null ? 'pH --' : `pH ${o.reading.toFixed(1)}`)
      if (o.type === 'voltmeter') setScreen(u.screen, o.reading == null ? '-- V' : `${o.reading.toFixed(2)} V`)
      if (o.type === 'power') setScreen(u.screen, `${Number(o.volts || 0).toFixed(1)} V`)
      if (!isContainer(o)) continue
      updateLiquid(o, def, node, u.liq, state)
      if (Math.abs(o.angle) > 0.02) continue
      const vol = volumeOf(o)
      const level = levelForVolume(o.type, Math.min(vol, def.capacityML))
      for (const bub of o.vis.bubbles) {
        if (b >= MAX) break
        const y = bub.v * level + 2
        const r = hw(def, y) - 2
        const z = hashZ(b) * Math.sqrt(Math.max(0, 1 - bub.u * bub.u)) * r
        const gas = GASES[bub.gas]
        m4.compose(v3.set((o.x + bub.u * r) * S, (o.y + y) * S, z * S), q.identity(), sc.setScalar(bub.r * 1.1 * S))
        bubbleMesh.setMatrixAt(b, m4)
        bubbleMesh.setColorAt(b++, color.setRGB(...(gas?.visible ? gas.color.map(c => c / 255) : [1, 1, 1]), SRGB))
      }
      for (const part of o.vis.parts) {
        if (p >= MAX) break
        const y = part.v * level + 2
        const r = hw(def, y) - 2
        const z = hashZ(p + 17) * Math.sqrt(Math.max(0, 1 - part.u * part.u)) * r
        q.setFromAxisAngle(v3.set(0.3, 1, 0.2).normalize(), p * 1.7)
        const g = (0.9 + part.s * 1.6) * S // visualization size, not a particle-size measurement
        m4.compose(v3.set((o.x + part.u * r) * S, (o.y + y) * S, z * S), q, sc.set(g * 1.2, g * 0.55, g * 0.9))
        partMesh.setMatrixAt(p, m4)
        const c = PRECIPITATES[part.key].color
        partMesh.setColorAt(p++, color.setRGB(c[0] / 255, c[1] / 255, c[2] / 255, SRGB))
      }
    }
    bounds = xs.length ? { x0: Math.min(...xs) - 1, x1: Math.max(...xs) + 1 } : bounds
    state.streams.forEach((st, i) => {
      let m = streamMeshes[i]
      if (!m) { m = new THREE.Mesh(streamGeo, new THREE.MeshStandardMaterial({ transparent: true, roughness: 0.1, depthWrite: false })); scene.add(m); streamMeshes[i] = m }
      const len = Math.max(0.5, st.y0 - st.y1)
      const r = Math.max(0.9, Math.min(3.5, Math.sqrt(st.rate) * 0.6))
      m.visible = true
      m.scale.set(r * S, len * S, r * S)
      m.position.set(st.x * S, (st.y1 + len / 2) * S, 0)
      m.material.color.setRGB(st.color[0] / 255, st.color[1] / 255, st.color[2] / 255, SRGB)
      m.material.opacity = Math.max(0.55, st.color[3] ?? 0.5)
    })
    for (let i = state.streams.length; i < streamMeshes.length; i += 1) streamMeshes[i].visible = false
    bubbleMesh.count = b
    partMesh.count = p
    bubbleMesh.instanceMatrix.needsUpdate = true
    if (bubbleMesh.instanceColor) bubbleMesh.instanceColor.needsUpdate = true
    partMesh.instanceMatrix.needsUpdate = true
    if (partMesh.instanceColor) partMesh.instanceColor.needsUpdate = true
    for (const [id, node] of nodes) {
      if (alive.has(id)) continue
      remove(node)
      nodes.delete(id)
    }
    // Keep a newly selected object in view (pan only; the user's zoom/angle are kept). Not when it was selected by
    // grabbing it: it is already under the pointer, and panning would slide the bench under the hand mid-drag.
    if (ui.selected !== lastSel) {
      lastSel = ui.selected
      const n = dragging == null && nodes.get(ui.selected)
      if (n) {
        v3.setFromMatrixPosition(n.matrixWorld).project(camera)
        if (Math.abs(v3.x) > 0.8 || Math.abs(v3.y) > 0.85) {
          const shift = new THREE.Vector3(n.position.x - controls.target.x, 0, 0)
          host.flyTo(camera.position.clone().add(shift), controls.target.clone().add(shift), 420)
        }
      }
    }
    host.requestRender()
  }

  function updateLiquid(o, def, node, liq, state) {
    const vol = volumeOf(o)
    const level = levelForVolume(o.type, Math.min(vol, def.capacityML))
    const on = vol > 0.02 && node.visible
    liq.liquid.visible = on
    liq.surface.visible = on
    if (!on) { liq.settled.visible = false; return }
    // UVs map the 2D tracer grid onto the side view: u across the width, v from bottom to surface.
    if (Math.abs(level - liq.level) > 0.25) {
      liq.level = level
      const pos = liq.liquid.geometry.attributes.position
      const uv = liq.liquid.geometry.attributes.uv
      for (let i = 0; i < pos.count; i += 1) uv.setXY(i, pos.getX(i) / (2 * liq.hwMax) + 0.5, Math.min(1, Math.max(0, (pos.getY(i) - 2 * S) / Math.max(S, level * S))))
      uv.needsUpdate = true
    }
    const mean = fieldMean(o)
    const tilted = Math.abs(o.angle) > 0.02
    const oil = o.contents.liquids.oil || 0
    const sinks = oil > 0.01 && oilBelow(o.contents)
    // Oil band in texture rows: above aqFrac when it floats, below oilFrac when it sinks (ethanol-rich liquid).
    const aqFrac = oil > 0.01 && level > 0 && !sinks ? levelForVolume(o.type, Math.max(0, vol - oil)) / level : 1
    const oilFrac = sinks && level > 0 ? levelForVolume(o.type, oil) / level : 0
    const x = liq.tex.getContext('2d')
    const img = liq.img || (liq.img = x.createImageData(GW, GH))
    let sum = [0, 0, 0, 0]
    for (let j = 0; j < GH; j += 1) {
      for (let i = 0; i < GW; i += 1) {
        const isOil = (j + 0.5) / GH > aqFrac || (j + 0.5) / GH < oilFrac
        const c = isOil ? [240, 200, 60, 0.75] : (!tilted && cellColor(o, j * GW + i, mean)) || o.vis.displayed || o.vis.target || [200, 220, 240, 0.25]
        // A colourless solution is nearly clear (it read as grey milk over the bench): alpha eases from ×0,45 at the
        // water tint (chroma 40) to ×1 for a clearly coloured one (chroma ≥ 70), with no step in between.
        let a = (c[3] ?? 0.3) * 1.1
        if (!isOil) a *= 0.45 + 0.55 * Math.min(1, Math.max(0, (Math.max(c[0], c[1], c[2]) - Math.min(c[0], c[1], c[2]) - 40) / 30))
        const k = ((GH - 1 - j) * GW + i) * 4
        img.data[k] = c[0]; img.data[k + 1] = c[1]; img.data[k + 2] = c[2]
        img.data[k + 3] = Math.round(255 * Math.min(0.9, Math.max(0.06, a)))
        for (let n = 0; n < 4; n += 1) sum[n] += n < 3 ? c[n] : a
      }
    }
    // Upload only when the colours actually changed (a texture upload every frame is costly on weak GPUs).
    let key = 0
    for (let k = 0; k < img.data.length; k += 1) key = (key * 31 + img.data[k]) | 0
    if (key !== liq.key) { liq.key = key; x.putImageData(img, 0, 0); liq.map.needsUpdate = true }
    // Horizontal surface through the axis point at the upright level (volume-preserving for a tilted cylinder).
    const P = new THREE.Vector3(0, (level + 2) * S, 0) // body-local: the body group already carries the pivot offset
    node.userData.body.localToWorld(P)
    liq.plane.constant = P.y
    // The flat surface disc is exact for a near-upright vessel; when strongly tilted the clipped body shows the surface instead.
    const a = Math.abs(o.angle)
    liq.surface.visible = a < 0.35
    const r = Math.max(0.5, hw(def, Math.max(1, level)) - 0.6) * S
    liq.surface.position.copy(P)
    liq.surface.position.y += 0.0005
    liq.surface.scale.set(r / Math.cos(a), r, 1)
    const n = GW * GH
    if (aqFrac < 1) liq.surface.material.color.setRGB(240 / 255, 200 / 255, 60 / 255, SRGB) // seen from above: the oil on top
    else liq.surface.material.color.setRGB(sum[0] / n / 255, sum[1] / n / 255, sum[2] / n / 255, SRGB)
    liq.surface.material.opacity = Math.min(0.92, Math.max(0.22, sum[3] / n + 0.18))
    // Settled precipitate layer (same rule as 2D: a layer once enough grains have settled).
    const settled = o.vis.parts.filter(pt => pt.settled)
    liq.settled.visible = settled.length > 4 && !tilted
    if (liq.settled.visible) {
      const layer = Math.min(innerHeight(def) * 0.2, 1 + settled.length * 0.05)
      const rr = (hw(def, layer / 2) - 0.8) * S
      liq.settled.scale.set(rr, layer * S, rr)
      liq.settled.position.y = 2 * S
      const c = PRECIPITATES[settled[0].key].color
      liq.settled.material.color.setRGB(c[0] / 255, c[1] / 255, c[2] / 255, SRGB)
    }
  }

  function remove(node) {
    for (const extra of [node.userData.shadow, node.userData.ring, node.userData.body?.userData?.liq?.surface]) {
      if (!extra) continue
      scene.remove(extra)
      for (const child of extra.children) disposeTree(child) // meniscus ring
      extra.material?.dispose()
      if (extra.geometry !== planeGeo && extra.geometry !== ringGeo) extra.geometry?.dispose()
    }
    scene.remove(node)
    disposeTree(node)
  }
  function disposeTree(root) {
    root.traverse(n => {
      if (n.geometry && n.geometry !== planeGeo && n.geometry !== ringGeo && !n.geometry.userData.shared) n.geometry.dispose()
      for (const m of Array.isArray(n.material) ? n.material : [n.material]) {
        if (!m || m.userData?.shared) continue
        m.map?.dispose()
        m.dispose()
      }
    })
  }

  // ── Pointer: pick, drag on the bench plane, hover ──────────────────────────
  const raycaster = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  const benchPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0) // all objects stand on z = 0
  const hitPoint = new THREE.Vector3()
  function aim(e) {
    const rect = host.canvas.getBoundingClientRect()
    ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
    raycaster.setFromCamera(ndc, camera)
  }
  function pickId(e) {
    aim(e)
    const ids = []
    for (const h of raycaster.intersectObjects([...nodes.values()].filter(n => n.visible), true)) {
      let n = h.object
      while (n && !n.userData.id) n = n.parent
      if (n && !ids.includes(n.userData.id)) ids.push(n.userData.id)
    }
    const objs = lastState?.objects || []
    const obj = id => objs.find(o => o.id === id)
    // The ray meets the beaker wall before the nail inside it, and slips between the two arms of the
    // tongs: pieces of solid come first, and a piece or a thin tool within ~14 px on screen counts as hit.
    const rect = canvas.getBoundingClientRect()
    const toPx = (x, y) => { v3.set(x * S, y * S, 0).project(camera); return [rect.left + (v3.x + 1) / 2 * rect.width, rect.top + (1 - v3.y) / 2 * rect.height] }
    const segDist = (a, b) => {
      const [ax, ay] = a
      const [bx, by] = b
      const t = Math.max(0, Math.min(1, ((e.clientX - ax) * (bx - ax) + (e.clientY - ay) * (by - ay)) / Math.max(1e-6, (bx - ax) ** 2 + (by - ay) ** 2)))
      return Math.hypot(ax + t * (bx - ax) - e.clientX, ay + t * (by - ay) - e.clientY)
    }
    let near = null
    let best = 14
    for (const o of objs) {
      if (!nodes.get(o.id)?.visible || isContainer(o)) continue
      if (o.type === 'solid' && (o.holder || !(o.massG > 0))) continue
      const h = o.type === 'solid' ? 2 * Math.max(1.2, solidRadiusMM(o)) : EQUIPMENT[o.type].h
      const d = segDist(toPx(o.x, o.y), toPx(o.x, o.y + h)) - (o.type === 'solid' ? 4 : 0) // pieces win ties
      if (d < best) { best = d; near = o.id }
    }
    const id = ids.find(i => obj(i)?.type === 'solid') || near || ids.find(i => !isContainer(obj(i) || {})) || ids[0] || null
    const o = obj(id)
    return o?.type === 'solid' && o.holder ? o.holder : id
  }
  function worldAt(e) {
    aim(e)
    return raycaster.ray.intersectPlane(benchPlane, hitPoint) ? [hitPoint.x / S, hitPoint.y / S] : null
  }
  let dragging = null
  const canvas = host.canvas
  canvas.tabIndex = 0
  function onDown(e) {
    if (e.button !== 0 || !controller) return
    handled = false
    const id = pickId(e)
    if (!id) return // empty space: OrbitControls rotates / pans the camera
    // The controller decides first (with empty tongs selected, a click on a piece grabs it), then selects.
    const w = worldAt(e)
    if (!w || !controller.down(id, w[0], w[1])) { onPick?.(id); return } // not draggable: select; OrbitControls may still orbit
    handled = true // the click that follows this press must not re-select what is now under the cursor
    dragging = e.pointerId
    controls.enabled = false
    // Grabbing an object stops any orbit inertia left from an earlier camera drag: the view holds still while
    // the student carries something. shortcut: uses OrbitControls internals (three 0.186); re-check on upgrade.
    controls._sphericalDelta?.set(0, 0, 0)
    controls._panOffset?.set(0, 0, 0)
    canvas.setPointerCapture(e.pointerId)
    canvas.focus({ preventScroll: true })
    canvas.style.cursor = 'grabbing'
    e.stopImmediatePropagation()
  }
  function onMove(e) {
    if (dragging === e.pointerId) {
      const w = worldAt(e)
      if (w) controller.move(w[0], w[1])
      return
    }
    if (e.pointerType === 'mouse' && !e.buttons) {
      const id = pickId(e)
      canvas.style.cursor = id ? 'grab' : ''
      onHover?.(id)
    }
  }
  function onUp(e) {
    if (dragging !== e.pointerId) return
    dragging = null
    controls.enabled = true
    canvas.style.cursor = ''
    controller.up()
  }
  function onLeave() { onHover?.(null) }
  function onWheel(e) {
    if (dragging == null) return
    e.preventDefault()
    e.stopImmediatePropagation()
    controller.wheel(e.deltaY)
  }
  function onKey(e) {
    if (!controller) return
    if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && controller.hasSelection() && lastSel) {
      e.preventDefault()
      e.stopImmediatePropagation()
      api.focus(lastSel)
      return
    }
    // Arrows: move the selected object (as in 2D); without a selection they orbit the camera.
    if (!controller.hasSelection() && e.key.startsWith('Arrow')) {
      e.preventDefault()
      const step = 0.08
      const off = camera.position.clone().sub(controls.target)
      const sph = new THREE.Spherical().setFromVector3(off)
      if (e.key === 'ArrowLeft') sph.theta -= step
      if (e.key === 'ArrowRight') sph.theta += step
      if (e.key === 'ArrowUp') sph.phi -= step
      if (e.key === 'ArrowDown') sph.phi += step
      sph.theta = Math.max(controls.minAzimuthAngle, Math.min(controls.maxAzimuthAngle, sph.theta))
      sph.phi = Math.max(controls.minPolarAngle, Math.min(controls.maxPolarAngle, sph.phi))
      camera.position.copy(controls.target).add(off.setFromSpherical(sph))
      controls.update()
      return
    }
    e.stopImmediatePropagation()
    controller.key(e)
  }
  canvas.addEventListener('pointerdown', onDown, true)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', onUp)
  canvas.addEventListener('pointerleave', onLeave)
  canvas.addEventListener('wheel', onWheel, { capture: true, passive: false })
  canvas.addEventListener('keydown', onKey, true)
  let handled = false
  function onClick(e) {
    if (handled) { handled = false; return }
    const id = pickId(e)
    if (id) onPick?.(id)
  }
  canvas.addEventListener('click', onClick)
  const ro = new ResizeObserver(() => { applyViewOffset(insets?.() || lastInsets); host.requestRender() })
  ro.observe(container)

  const api = {
    update,
    fit: ins => fit(ins),
    reframe: ins => { applyViewOffset(ins); host.requestRender() },
    home: () => host.resetView(),
    camera: () => ({ pos: camera.position.toArray(), target: controls.target.toArray() }),
    // Fly to the selected object, keeping the current viewing direction; close enough to see a small piece.
    focus(id) {
      // Sized from the object's own dimensions: a node's bounding box also holds invisible helpers.
      const o = lastState?.objects.find(x => x.id === id)
      if (!o || !nodes.get(id)) return false
      const def = o.type === 'solid' ? { w: 2 * solidRadiusMM(o), h: 2 * solidRadiusMM(o) } : EQUIPMENT[o.type]
      const target = new THREE.Vector3(o.x * S, (o.y + def.h / 2) * S, 0)
      const size = Math.hypot(def.w, def.h) * S
      const dir = camera.position.clone().sub(controls.target).normalize()
      host.flyTo(target.clone().addScaledVector(dir, Math.max(controls.minDistance, size * 2.6)), target, 480)
      return true
    },
    // Test/automation hook: screen position of a world point, so 3D journeys can drive real pointer events.
    worldToScreen(x, y) {
      const v = new THREE.Vector3(x * S, y * S, 0).project(camera)
      const rect = canvas.getBoundingClientRect()
      return { x: rect.left + (v.x + 1) / 2 * rect.width, y: rect.top + (1 - v.y) / 2 * rect.height }
    },
    setQuality: q2 => host.setQuality(q2 === 'high' ? 'high' : 'low'),
    dispose() {
      ro.disconnect()
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('pointerdown', onDown, true)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('wheel', onWheel, { capture: true })
      canvas.removeEventListener('keydown', onKey, true)
      controls.removeEventListener('change', clampLimits)
      for (const node of nodes.values()) remove(node)
      nodes.clear()
      streamGeo.dispose()
      for (const m of wireGroup.children) m.geometry.dispose()
      streamMeshes.forEach(m => m.material.dispose())
      planeGeo.dispose()
      ringGeo.dispose()
      holderGeo.dispose()
      holeGeo.dispose()
      standBaseGeo.dispose()
      standPoleGeo.dispose()
      standArmGeo.dispose()
      for (const m of shared) { m.map?.dispose(); m.dispose() }
      envTex?.dispose()
      host.dispose() // disposes remaining scene geometry/materials, renderer and controls
    }
  }
  return api
}

const SRGB = THREE_NS.SRGBColorSpace
const hashZ = i => (((i * 2654435761) >>> 0) % 1000) / 500 - 1
const subscript = f => String(f).replace(/(\d+)/g, d => [...d].map(ch => '₀₁₂₃₄₅₆₇₈₉'[ch]).join(''))

// One 15 cm ceramic tile with grout lines (repeated by the material).
function tileTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const x = c.getContext('2d')
  const g = x.createLinearGradient(0, 0, 64, 64)
  g.addColorStop(0, '#e9eef4')
  g.addColorStop(1, '#dde4ec')
  x.fillStyle = g
  x.fillRect(0, 0, 64, 64)
  x.fillStyle = '#d4dbe4'
  x.fillRect(0, 63, 64, 1)
  x.fillRect(63, 0, 1, 64)
  const t = new THREE_NS.CanvasTexture(c)
  t.colorSpace = THREE_NS.SRGBColorSpace
  return t
}
// Fine speckle of an epoxy bench top (deterministic so screenshots are reproducible).
function speckleTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const x = c.getContext('2d')
  x.fillStyle = '#e4e8ec' // near-white: the material colour sets the tone, the map only adds grain
  x.fillRect(0, 0, 128, 128)
  for (let i = 0; i < 900; i += 1) {
    const h = (i * 2654435761) >>> 0
    x.fillStyle = h % 3 ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.18)'
    x.fillRect(h % 128, (h >>> 8) % 128, 1, 1)
  }
  const t = new THREE_NS.CanvasTexture(c)
  t.colorSpace = THREE_NS.SRGBColorSpace
  t.wrapS = t.wrapT = THREE_NS.RepeatWrapping
  t.repeat.set(60, 6)
  return t
}
function radialTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const x = c.getContext('2d')
  const g = x.createRadialGradient(32, 32, 2, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.55, 'rgba(255,255,255,.45)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  x.fillStyle = g
  x.fillRect(0, 0, 64, 64)
  const t = new THREE_NS.CanvasTexture(c)
  t.colorSpace = THREE_NS.SRGBColorSpace
  return t
}
