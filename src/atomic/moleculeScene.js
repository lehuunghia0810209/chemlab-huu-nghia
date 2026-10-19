
import { ATOM_STYLE } from '../chem/molecules.js'

const BALL_SCALE = 0.42
const BOND_RADIUS = 0.075
const BOND_GAP = 0.16

function bondOffsets(order) {
  if (order === 2) return [-BOND_GAP / 2, BOND_GAP / 2]
  if (order === 3) return [-BOND_GAP, 0, BOND_GAP]
  return [0]
}

export function createMoleculeScene(host, molecule) {
  const { THREE, scene } = host
  const root = new THREE.Group()
  scene.add(root)

  scene.add(new THREE.AmbientLight(0xffffff, 0.7))
  const key = new THREE.DirectionalLight(0xffffff, 1.6)
  key.position.set(4, 6, 8)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0x93c5fd, 0.6)
  rim.position.set(-6, -2, -4)
  scene.add(rim)

  const segments = host.quality === 'low' ? 16 : 32
  const sphere = new THREE.SphereGeometry(1, segments, Math.round(segments * 0.75))
  const cylinder = new THREE.CylinderGeometry(BOND_RADIUS, BOND_RADIUS, 1, 16)
  const bondMaterial = new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.5, metalness: 0.1 })
  const materials = new Map()
  const material = symbol => {
    if (!materials.has(symbol)) {
      materials.set(symbol, new THREE.MeshStandardMaterial({ color: ATOM_STYLE[symbol]?.color || '#e879f9', roughness: 0.38, metalness: 0.05 }))
    }
    return materials.get(symbol)
  }

  const positions = molecule.atoms.map(([, x, y, z]) => new THREE.Vector3(x, y, z))
  const atomMeshes = molecule.atoms.map(([symbol], index) => {
    const mesh = new THREE.Mesh(sphere, material(symbol))
    mesh.position.copy(positions[index])
    root.add(mesh)
    return { mesh, style: ATOM_STYLE[symbol] || { covalent: 0.7, vdw: 1.7 } }
  })

  const bonds = new THREE.Group()
  const up = new THREE.Vector3(0, 1, 0)
  for (const [i, j, order] of molecule.bonds) {
    const start = positions[i]
    const end = positions[j]
    const axis = end.clone().sub(start)
    const length = axis.length()
    const direction = axis.clone().normalize()
    let side = new THREE.Vector3(0, 0, 1).cross(direction)
    if (side.lengthSq() < 1e-6) side = new THREE.Vector3(0, 1, 0).cross(direction)
    side.normalize()
    for (const offset of bondOffsets(order)) {
      const mesh = new THREE.Mesh(cylinder, bondMaterial)
      mesh.scale.set(1, length, 1)
      mesh.quaternion.setFromUnitVectors(up, direction)
      mesh.position.copy(start).add(end).multiplyScalar(0.5).addScaledVector(side, offset)
      bonds.add(mesh)
    }
  }
  root.add(bonds)

  const radius = positions.reduce((max, point) => Math.max(max, point.length()), 0)

  function setStyle(style) {
    const space = style === 'space'
    for (const { mesh, style: atom } of atomMeshes) {
      mesh.scale.setScalar(space ? atom.vdw : atom.covalent * BALL_SCALE + 0.12)
    }
    bonds.visible = !space
    host.requestRender()
  }

  setStyle('ball')

  return {
    radius,
    setStyle
  }
}
