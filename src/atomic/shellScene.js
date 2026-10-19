
import { SHELL_LETTERS } from '../chem/electronConfiguration.js'

const PROTON = '#ef4444'
const NEUTRON = '#94a3b8'
const ELECTRON = '#67e8f9'
const VALENCE = '#facc15'

function nucleonPositions(count, diameter) {
  const positions = [[0, 0, 0]]
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let layer = 1; positions.length < count; layer += 1) {
    const radius = layer * diameter * 0.86
    const capacity = Math.max(6, Math.floor((4 * Math.PI * radius * radius) / (diameter * diameter * 1.15)))
    const take = Math.min(capacity, count - positions.length)
    const offset = layer * 0.7
    for (let i = 0; i < take; i += 1) {
      const y = 1 - (2 * (i + 0.5)) / take
      const ring = Math.sqrt(1 - y * y)
      const theta = golden * i + offset
      positions.push([Math.cos(theta) * ring * radius, y * radius, Math.sin(theta) * ring * radius])
    }
  }
  return positions.slice(0, count)
}

function label(THREE, text) {
  const canvas = document.createElement('canvas')
  canvas.width = 96
  canvas.height = 64
  const context = canvas.getContext('2d')
  context.fillStyle = 'rgba(203, 213, 225, 0.95)'
  context.font = '600 34px "Be Vietnam Pro", system-ui, sans-serif'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(text, 48, 34)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthWrite: false, transparent: true }))
  sprite.scale.set(0.84, 0.56, 1)
  return sprite
}

export function createShellScene(host, atom) {
  const { THREE, scene } = host
  const root = new THREE.Group()
  root.rotation.x = -0.35
  scene.add(root)

  scene.add(new THREE.AmbientLight(0xffffff, 0.6))
  const light = new THREE.DirectionalLight(0xffffff, 1.8)
  light.position.set(4, 6, 8)
  scene.add(light)

  const total = atom.protons + atom.neutrons
  const nucleonRadius = 0.16
  const segments = host.quality === 'low' ? 8 : 14
  const sphere = new THREE.SphereGeometry(nucleonRadius, segments, Math.round(segments * 0.75))
  const positions = nucleonPositions(total, nucleonRadius * 2)
  const ballRadius = positions.reduce((max, [x, y, z]) => Math.max(max, Math.hypot(x, y, z)), 0) + nucleonRadius

  const protons = new THREE.InstancedMesh(sphere, new THREE.MeshStandardMaterial({ color: PROTON, roughness: 0.45, metalness: 0.05 }), atom.protons)
  const neutrons = new THREE.InstancedMesh(sphere, new THREE.MeshStandardMaterial({ color: NEUTRON, roughness: 0.5, metalness: 0.05 }), Math.max(1, atom.neutrons))
  neutrons.count = atom.neutrons

  const matrix = new THREE.Matrix4()
  let p = 0
  let n = 0
  positions.forEach((position, index) => {
    matrix.makeTranslation(position[0], position[1], position[2])
    const takeProton = p < atom.protons && (n >= atom.neutrons || p < Math.round(((index + 1) * atom.protons) / total))
    if (takeProton) protons.setMatrixAt(p++, matrix)
    else neutrons.setMatrixAt(n++, matrix)
  })
  protons.instanceMatrix.needsUpdate = true
  neutrons.instanceMatrix.needsUpdate = true
  const nucleus = new THREE.Group()
  nucleus.add(protons, neutrons)
  root.add(nucleus)

  const shellGroups = []
  const electronGeometry = new THREE.SphereGeometry(0.11, 14, 10)
  const firstRadius = Math.max(1.3, ballRadius + 0.8)
  const spacing = 0.95

  atom.shells.forEach((count, index) => {
    const radius = firstRadius + index * spacing
    const isOuter = index === atom.shells.length - 1
    const group = new THREE.Group()

    const ringPoints = []
    for (let i = 0; i <= 128; i += 1) {
      const angle = (i / 128) * Math.PI * 2
      ringPoints.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0))
    }
    const ring = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(ringPoints),
      new THREE.LineBasicMaterial({ color: isOuter ? VALENCE : 0x64748b, transparent: true, opacity: isOuter ? 0.55 : 0.35 })
    )
    group.add(ring)

    const material = new THREE.MeshBasicMaterial({ color: isOuter ? VALENCE : ELECTRON })
    const electrons = new THREE.InstancedMesh(electronGeometry, material, Math.max(1, count))
    electrons.count = count
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2 + index * 0.4
      matrix.makeTranslation(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
      electrons.setMatrixAt(i, matrix)
    }
    electrons.instanceMatrix.needsUpdate = true
    group.add(electrons)

    const tag = label(THREE, `${SHELL_LETTERS[index]} ${count}`)
    tag.position.set(radius + 0.1, 0.42, 0)
    group.add(tag)

    root.add(group)
    shellGroups.push({ group, speed: 0.35 / (index + 1) })
  })

  const outerRadius = firstRadius + (atom.shells.length - 1) * spacing

  return {
    outerRadius,
    animate(time, delta, enabled) {
      if (!enabled) return false
      for (const { group, speed } of shellGroups) group.rotation.z += speed * delta
      return true
    }
  }
}
