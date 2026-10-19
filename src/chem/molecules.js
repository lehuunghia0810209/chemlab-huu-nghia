
export const ATOM_STYLE = {
  H: { color: '#f1f5f9', covalent: 0.31, vdw: 1.2 },
  B: { color: '#f9a8a8', covalent: 0.84, vdw: 1.92 },
  C: { color: '#64748b', covalent: 0.76, vdw: 1.7 },
  N: { color: '#3b82f6', covalent: 0.71, vdw: 1.55 },
  O: { color: '#ef4444', covalent: 0.66, vdw: 1.52 },
  F: { color: '#84cc16', covalent: 0.57, vdw: 1.47 },
  S: { color: '#facc15', covalent: 1.05, vdw: 1.8 },
  Cl: { color: '#22c55e', covalent: 1.02, vdw: 1.75 }
}

const RAD = Math.PI / 180

function diatomic(a, b, length, order) {
  return {
    atoms: [[a, 0, 0, -length / 2], [b, 0, 0, length / 2]],
    bonds: [[0, 1, order]]
  }
}

function linear(center, ligand, length, order) {
  return {
    atoms: [[center, 0, 0, 0], [ligand, -length, 0, 0], [ligand, length, 0, 0]],
    bonds: [[0, 1, order], [0, 2, order]]
  }
}

function bent(center, ligand, length, angle) {
  const half = (angle * RAD) / 2
  return {
    atoms: [
      [center, 0, 0, 0],
      [ligand, -length * Math.sin(half), -length * Math.cos(half), 0],
      [ligand, length * Math.sin(half), -length * Math.cos(half), 0]
    ],
    bonds: [[0, 1, 1], [0, 2, 1]]
  }
}

function pyramidal(center, ligand, length, angle) {
  const cosAlpha = Math.sqrt((2 * Math.cos(angle * RAD) + 1) / 3)
  const sinAlpha = Math.sqrt(1 - cosAlpha * cosAlpha)
  const atoms = [[center, 0, 0, 0]]
  for (let i = 0; i < 3; i += 1) {
    const phi = Math.PI / 2 + (i * 2 * Math.PI) / 3
    atoms.push([ligand, length * sinAlpha * Math.cos(phi), -length * cosAlpha, length * sinAlpha * Math.sin(phi)])
  }
  return { atoms, bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]] }
}

function trigonalPlanar(center, ligand, length) {
  const atoms = [[center, 0, 0, 0]]
  for (let i = 0; i < 3; i += 1) {
    const phi = Math.PI / 2 + (i * 2 * Math.PI) / 3
    atoms.push([ligand, length * Math.cos(phi), length * Math.sin(phi), 0])
  }
  return { atoms, bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]] }
}

function tetrahedral(center, ligand, length) {
  const base = pyramidal(center, ligand, length, Math.acos(-1 / 3) / RAD)
  return {
    atoms: [...base.atoms, [ligand, 0, length, 0]],
    bonds: [...base.bonds, [0, 4, 1]]
  }
}

function octahedral(center, ligand, length) {
  const axes = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]
  return {
    atoms: [[center, 0, 0, 0], ...axes.map(([x, y, z]) => [ligand, x * length, y * length, z * length])],
    bonds: axes.map((_, index) => [0, index + 1, 1])
  }
}

function ethene(cc, ch, hch) {
  const half = (hch * RAD) / 2
  const dx = ch * Math.cos(half)
  const dy = ch * Math.sin(half)
  const c = cc / 2
  return {
    atoms: [['C', -c, 0, 0], ['C', c, 0, 0], ['H', -c - dx, dy, 0], ['H', -c - dx, -dy, 0], ['H', c + dx, dy, 0], ['H', c + dx, -dy, 0]],
    bonds: [[0, 1, 2], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]]
  }
}

function ethyne(cc, ch) {
  const c = cc / 2
  return {
    atoms: [['C', -c, 0, 0], ['C', c, 0, 0], ['H', -c - ch, 0, 0], ['H', c + ch, 0, 0]],
    bonds: [[0, 1, 3], [0, 2, 1], [1, 3, 1]]
  }
}

export const MOLECULES = [
  { formula: 'H2', name: 'Hydrogen', shape: 'Thẳng', length: ['H–H', 0.741], ...diatomic('H', 'H', 0.741, 1) },
  { formula: 'N2', name: 'Nitrogen', shape: 'Thẳng', length: ['N≡N', 1.098], ...diatomic('N', 'N', 1.098, 3) },
  { formula: 'O2', name: 'Oxygen', shape: 'Thẳng', length: ['O=O', 1.208], ...diatomic('O', 'O', 1.208, 2) },
  { formula: 'Cl2', name: 'Chlorine', shape: 'Thẳng', length: ['Cl–Cl', 1.988], ...diatomic('Cl', 'Cl', 1.988, 1) },
  { formula: 'HCl', name: 'Hydrogen chloride', shape: 'Thẳng', length: ['H–Cl', 1.275], ...diatomic('H', 'Cl', 1.275, 1) },
  { formula: 'CO2', name: 'Carbon dioxide', shape: 'Đường thẳng', angle: ['O=C=O', 180], length: ['C=O', 1.16], lonePairs: 0, ...linear('C', 'O', 1.16, 2) },
  { formula: 'H2O', name: 'Nước', shape: 'Gấp khúc (chữ V)', angle: ['H–O–H', 104.5], length: ['O–H', 0.958], lonePairs: 2, ...bent('O', 'H', 0.958, 104.5) },
  { formula: 'H2S', name: 'Hydrogen sulfide', shape: 'Gấp khúc (chữ V)', angle: ['H–S–H', 92.1], length: ['S–H', 1.336], lonePairs: 2, ...bent('S', 'H', 1.336, 92.1) },
  { formula: 'NH3', name: 'Ammonia', shape: 'Chóp tam giác', angle: ['H–N–H', 106.7], length: ['N–H', 1.012], lonePairs: 1, ...pyramidal('N', 'H', 1.012, 106.7) },
  { formula: 'CH4', name: 'Methane', shape: 'Tứ diện', angle: ['H–C–H', 109.5], length: ['C–H', 1.087], lonePairs: 0, ...tetrahedral('C', 'H', 1.087) },
  { formula: 'BF3', name: 'Boron trifluoride', shape: 'Tam giác phẳng', angle: ['F–B–F', 120], length: ['B–F', 1.307], lonePairs: 0, ...trigonalPlanar('B', 'F', 1.307) },
  { formula: 'SF6', name: 'Sulfur hexafluoride', shape: 'Bát diện', angle: ['F–S–F', 90], length: ['S–F', 1.561], lonePairs: 0, ...octahedral('S', 'F', 1.561) },
  { formula: 'C2H4', name: 'Ethene', shape: 'Phẳng', angle: ['H–C–H', 117.4], length: ['C=C', 1.339], ...ethene(1.339, 1.087, 117.4) },
  { formula: 'C2H2', name: 'Ethyne', shape: 'Đường thẳng', angle: ['H–C≡C', 180], length: ['C≡C', 1.203], ...ethyne(1.203, 1.063) }
]

function sameAtoms(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  return [...keys].every(key => (a[key] || 0) === (b[key] || 0))
}

export function countAtoms(molecule) {
  const counts = {}
  for (const [symbol] of molecule.atoms) counts[symbol] = (counts[symbol] || 0) + 1
  return counts
}

export function findMolecule(atoms) {
  return MOLECULES.find(molecule => sameAtoms(countAtoms(molecule), atoms)) || null
}
