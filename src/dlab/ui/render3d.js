// Three.js view of the same simulation state (read-only). Lazy-loaded only when the user opens 3D.
import { createSceneHost, disposeObject } from '../../three/sceneHost.js'
import { EQUIPMENT, halfWidthAt, innerHeight, levelForVolume } from '../data/equipment.js'
import { PRECIPITATES, REAGENT_BY_ID } from '../data/materials.js'
import { isContainer, volumeOf, solidRadiusMM, byId } from '../engine/processes.js'

const S = 0.01 // 1 mm = 0.01 scene units

export function create3dView(container, { quality = 'high', onPick } = {}) {
  const host = createSceneHost({ container, quality: quality === 'high' ? 'high' : 'low', cameraPosition: { x: 4.3, y: 2.6, z: 6.5 }, label: 'Bàn thí nghiệm 3D — cùng trạng thái với chế độ 2D' })
  if (!host) return null
  const { THREE, scene, camera, controls } = host
  scene.add(new THREE.HemisphereLight(0xdfe9ff, 0x334055, 1.1))
  const sun = new THREE.DirectionalLight(0xffffff, 1.4)
  sun.position.set(3, 6, 4)
  scene.add(sun)
  const bench = new THREE.Mesh(new THREE.BoxGeometry(16, 0.1, 3), new THREE.MeshStandardMaterial({ color: 0x8b98ab, roughness: 0.85 }))
  bench.position.set(6, -0.05, 0)
  scene.add(bench)

  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xdfefff, transparent: true, opacity: 0.14, roughness: 0.05, metalness: 0, side: THREE.DoubleSide, depthWrite: false })
  const nodes = new Map()
  const MAX = 600
  const bubbleMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }), MAX)
  const partMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff }), MAX)
  partMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX * 3), 3)
  scene.add(bubbleMesh, partMesh)
  const m4 = new THREE.Matrix4()
  const color = new THREE.Color()

  function profile(def, top) {
    const pts = []
    const H = innerHeight(def)
    const n = 18
    for (let i = 0; i <= n; i += 1) {
      const y = Math.min(top, H * i / n)
      pts.push(new THREE.Vector2(halfWidthAt(def, y) * S, (y + 2) * S))
      if (y >= top) break
    }
    pts.unshift(new THREE.Vector2(0, 2 * S))
    return pts
  }

  function build(o) {
    const g = new THREE.Group()
    g.userData.id = o.id
    const def = EQUIPMENT[o.type]
    if (isContainer(o)) {
      const glass = new THREE.Mesh(new THREE.LatheGeometry(profile(def, innerHeight(def)).map(p => new THREE.Vector2(p.x + 0.02, p.y)), 32), glassMat)
      const liquid = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.8, toneMapped: false }))
      liquid.renderOrder = -1
      g.add(liquid, glass)
      g.userData.liquid = liquid
    }
    else if (o.type === 'solid') {
      const r = REAGENT_BY_ID[o.reagent]
      g.add(new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), new THREE.MeshStandardMaterial({ color: new THREE.Color(`rgb(${(r.color || [240, 240, 240]).join(',')})`), roughness: 0.4, metalness: 0.4 })))
    }
    else {
      const flat = ['burner', 'power', 'voltmeter', 'rack', 'bridge', 'gasTank'].includes(o.type)
      const geo = flat ? new THREE.BoxGeometry(def.w * S, def.h * S, (o.type === 'gasTank' ? def.w : 40) * S) : new THREE.CylinderGeometry(def.w * S / 3, def.w * S / 3, def.h * S, 10)
      const col = { burner: 0x6b7280, power: 0xdbe2ea, voltmeter: 0xdbe2ea, rack: 0xc79a64, litmusPaper: 0x8246a0, gasTank: 0x5b84b1, electrodes: 0x333333 }[o.type] ?? 0xcfe3ff
      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: col, transparent: !flat, opacity: flat ? 1 : 0.8 }))
      mesh.position.y = def.h * S / 2
      g.add(mesh)
      g.userData.body = mesh
    }
    scene.add(g)
    return g
  }

  let framed = false
  function frame(state) {
    const xs = state.objects.map(o => o.x * S)
    if (!xs.length) return
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2
    const span = Math.max(1.5, Math.max(...xs) - Math.min(...xs) + 1)
    camera.position.set(cx, 1.3, span * 1.15 + 1.2)
    controls.target.set(cx, 0.45, 0)
    controls.update()
    host.setHome(camera.position.clone(), controls.target.clone())
    framed = true
  }

  function update(state) {
    if (!framed) frame(state)
    const alive = new Set()
    let b = 0
    let p = 0
    for (const o of state.objects) {
      alive.add(o.id)
      let g = nodes.get(o.id)
      if (!g) { g = build(o); nodes.set(o.id, g) }
      const def = EQUIPMENT[o.type]
      if (o.type === 'solid') {
        const c = o.in && byId(state, o.in)
        const r = Math.max(1.5, solidRadiusMM(o)) * S
        g.scale.setScalar(o.massG > 0 ? r : 0.0001)
        if (c) g.position.set((c.x + o.lx) * S, (c.y + o.ly + 2) * S + r, 0)
        else g.position.set(o.x * S, o.y * S + r, 0)
        continue
      }
      g.position.set(o.x * S, (o.y + def.h / 2) * S, 0)
      g.rotation.z = -(o.angle || 0)
      g.children.forEach(ch => { if (ch.userData.offset == null) { ch.userData.offset = true; ch.position.y -= def.h / 2 * S } })
      g.visible = o.condition !== 'UNUSABLE'
      if (o.type === 'litmusPaper' && o.seg) {
        const tip = o.seg[0].rgb
        g.userData.body.material.color.setRGB(tip[0] / 255, tip[1] / 255, tip[2] / 255)
      }
      if (o.type === 'burner') g.userData.body.material.emissive?.setHex(o.on ? 0x662200 : 0)
      if (!isContainer(o)) continue
      const vol = volumeOf(o)
      const level = levelForVolume(o.type, Math.min(vol, def.capacityML))
      const liquid = g.userData.liquid
      const key = Math.round(level * 2)
      if (liquid.userData.key !== key) {
        liquid.userData.key = key
        liquid.geometry.dispose()
        liquid.geometry = level > 0.3 ? new THREE.LatheGeometry(profile(def, level), 32) : new THREE.BufferGeometry()
      }
      const col = o.vis.displayed || o.vis.target || [200, 220, 240, 0.3]
      liquid.material.color.setRGB(col[0] / 255, col[1] / 255, col[2] / 255)
      liquid.material.opacity = Math.min(0.92, 0.35 + (col[3] ?? 0.3))
      if (Math.abs(o.angle) > 0.02) continue
      for (const bub of o.vis.bubbles) {
        if (b >= MAX) break
        const y = bub.v * level + 2
        const x = bub.u * (halfWidthAt(def, y) - 2)
        m4.makeScale(bub.r * S, bub.r * S, bub.r * S).setPosition((o.x + x) * S, (o.y + y) * S, ((b * 37) % 11 - 5) * S)
        bubbleMesh.setMatrixAt(b++, m4)
      }
      for (const part of o.vis.parts) {
        if (p >= MAX) break
        const y = part.v * level + 2
        const x = part.u * (halfWidthAt(def, y) - 2)
        m4.makeScale(part.s * 2 * S, part.s * 2 * S, part.s * 2 * S).setPosition((o.x + x) * S, (o.y + y) * S, ((p * 53) % 13 - 6) * S)
        partMesh.setMatrixAt(p, m4)
        const c = PRECIPITATES[part.key].color
        partMesh.setColorAt(p++, color.setRGB(c[0] / 255, c[1] / 255, c[2] / 255))
      }
    }
    bubbleMesh.count = b
    partMesh.count = p
    bubbleMesh.instanceMatrix.needsUpdate = true
    partMesh.instanceMatrix.needsUpdate = true
    if (partMesh.instanceColor) partMesh.instanceColor.needsUpdate = true
    for (const [id, g] of nodes) {
      if (alive.has(id)) continue
      scene.remove(g)
      disposeObject(g)
      nodes.delete(id)
    }
    host.requestRender()
  }

  const raycaster = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  function onClick(e) {
    const rect = host.canvas.getBoundingClientRect()
    ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
    raycaster.setFromCamera(ndc, camera)
    const hits = raycaster.intersectObjects([...nodes.values()], true)
    for (const h of hits) {
      let n = h.object
      while (n && !n.userData.id) n = n.parent
      if (n) { onPick?.(n.userData.id); return }
    }
  }
  host.canvas.addEventListener('click', onClick)

  return {
    update,
    setQuality: q => host.setQuality(q === 'high' ? 'high' : 'low'),
    dispose() {
      host.canvas.removeEventListener('click', onClick)
      glassMat.dispose()
      host.dispose()
      nodes.clear()
    }
  }
}
