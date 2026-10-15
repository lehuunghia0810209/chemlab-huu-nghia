/* =========================================================
   GROUND-STATE ELECTRON CONFIGURATIONS
   Madelung (Aufbau) filling order plus the experimentally
   established exceptions (NIST Atomic Spectra Database ground
   states). Configurations for Z ≥ 104 are theoretical
   predictions and are flagged as such.

   Pure data/logic — no DOM. Tested by scripts/test-chem-core.mjs.
========================================================= */

const L_LETTERS = ['s', 'p', 'd', 'f']

/* Madelung order: increasing n + l, then increasing n. */
export const AUFBAU_ORDER = Object.freeze([
  '1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p',
  '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'
])

/* Subshell occupancies that differ from the Aufbau prediction. */
const EXCEPTIONS = Object.freeze({
  24: { '3d': 5, '4s': 1 },              // Cr  [Ar] 3d5 4s1
  29: { '3d': 10, '4s': 1 },             // Cu  [Ar] 3d10 4s1
  41: { '4d': 4, '5s': 1 },              // Nb  [Kr] 4d4 5s1
  42: { '4d': 5, '5s': 1 },              // Mo  [Kr] 4d5 5s1
  44: { '4d': 7, '5s': 1 },              // Ru  [Kr] 4d7 5s1
  45: { '4d': 8, '5s': 1 },              // Rh  [Kr] 4d8 5s1
  46: { '4d': 10, '5s': 0 },             // Pd  [Kr] 4d10
  47: { '4d': 10, '5s': 1 },             // Ag  [Kr] 4d10 5s1
  57: { '4f': 0, '5d': 1 },              // La  [Xe] 5d1 6s2
  58: { '4f': 1, '5d': 1 },              // Ce  [Xe] 4f1 5d1 6s2
  64: { '4f': 7, '5d': 1 },              // Gd  [Xe] 4f7 5d1 6s2
  78: { '5d': 9, '6s': 1 },              // Pt  [Xe] 4f14 5d9 6s1
  79: { '5d': 10, '6s': 1 },             // Au  [Xe] 4f14 5d10 6s1
  89: { '5f': 0, '6d': 1 },              // Ac  [Rn] 6d1 7s2
  90: { '5f': 0, '6d': 2 },              // Th  [Rn] 6d2 7s2
  91: { '5f': 2, '6d': 1 },              // Pa  [Rn] 5f2 6d1 7s2
  92: { '5f': 3, '6d': 1 },              // U   [Rn] 5f3 6d1 7s2
  93: { '5f': 4, '6d': 1 },              // Np  [Rn] 5f4 6d1 7s2
  96: { '5f': 7, '6d': 1 },              // Cm  [Rn] 5f7 6d1 7s2
  103: { '6d': 0, '7p': 1 }              // Lr  [Rn] 5f14 7s2 7p1
})

const EXCEPTION_NOTES = Object.freeze({
  24: 'Phân lớp 3d bán bão hòa (3d⁵) cùng 4s¹ có năng lượng thấp hơn cấu hình 3d⁴4s².',
  42: 'Phân lớp 4d bán bão hòa (4d⁵) cùng 5s¹ bền hơn cấu hình 4d⁴5s².',
  29: 'Phân lớp 3d bão hòa (3d¹⁰) cùng 4s¹ có năng lượng thấp hơn cấu hình 3d⁹4s².',
  47: 'Phân lớp 4d bão hòa (4d¹⁰) cùng 5s¹ bền hơn cấu hình 4d⁹5s².',
  79: 'Phân lớp 5d bão hòa (5d¹⁰) cùng 6s¹ bền hơn cấu hình 5d⁹6s².',
  46: 'Phân lớp 4d bão hòa hoàn toàn (4d¹⁰), không còn electron ở 5s.'
})

const GENERIC_NOTE =
  'Năng lượng các phân lớp ns, (n−1)d và (n−2)f rất gần nhau nên cấu hình thực nghiệm khác với thứ tự điền Aufbau.'

const NOBLE_GASES = Object.freeze([
  [2, 'He'], [10, 'Ne'], [18, 'Ar'], [36, 'Kr'], [54, 'Xe'], [86, 'Rn']
])

const SUPERSCRIPT = Object.freeze({
  0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹'
})

export const SHELL_LETTERS = Object.freeze(['K', 'L', 'M', 'N', 'O', 'P', 'Q'])

export function toSuperscript(value) {
  return String(value).split('').map(digit => SUPERSCRIPT[digit] ?? digit).join('')
}

export function parseSubshell(label) {
  const n = Number(label[0])
  const l = L_LETTERS.indexOf(label[1])
  return { n, l, label, capacity: 2 * (2 * l + 1), orbitals: 2 * l + 1 }
}

/* Unpaired electrons in one subshell by Hund's rule. */
export function unpairedIn(electrons, orbitals) {
  return electrons <= orbitals ? electrons : 2 * orbitals - electrons
}

function occupancyFor(atomicNumber) {
  const occupancy = new Map()
  let remaining = atomicNumber

  for (const label of AUFBAU_ORDER) {
    if (remaining <= 0) break
    const { capacity } = parseSubshell(label)
    const electrons = Math.min(remaining, capacity)
    occupancy.set(label, electrons)
    remaining -= electrons
  }

  const exception = EXCEPTIONS[atomicNumber]
  if (exception) {
    for (const [label, electrons] of Object.entries(exception)) {
      occupancy.set(label, electrons)
    }
  }

  return occupancy
}

function byShell(a, b) {
  return a.n - b.n || a.l - b.l
}

function format(subshells) {
  return subshells.map(item => `${item.label}${toSuperscript(item.electrons)}`).join(' ')
}

/**
 * @param {number} atomicNumber 1–118
 * @returns configuration descriptor, or null for invalid input
 */
export function getElectronConfiguration(atomicNumber) {
  const Z = Number(atomicNumber)
  if (!Number.isInteger(Z) || Z < 1 || Z > 118) return null

  const occupancy = occupancyFor(Z)

  const subshells = [...occupancy.entries()]
    .filter(([, electrons]) => electrons > 0)
    .map(([label, electrons]) => {
      const info = parseSubshell(label)
      return { ...info, electrons, unpaired: unpairedIn(electrons, info.orbitals) }
    })

  const shellOrder = [...subshells].sort(byShell)
  const energyOrder = AUFBAU_ORDER
    .map(label => subshells.find(item => item.label === label))
    .filter(Boolean)

  const maxN = Math.max(...subshells.map(item => item.n))
  const shells = Array.from({ length: maxN }, (_, index) =>
    subshells.filter(item => item.n === index + 1).reduce((sum, item) => sum + item.electrons, 0))

  const core = [...NOBLE_GASES].reverse().find(([coreZ]) => coreZ < Z)
  let condensed = format(shellOrder)
  if (core) {
    const coreLabels = new Set([...occupancyFor(core[0]).keys()])
    const valence = shellOrder.filter(item => !coreLabels.has(item.label) || item.electrons !== occupancyFor(core[0]).get(item.label))
    condensed = `[${core[1]}] ${format(valence)}`.trim()
  }

  const isException = Boolean(EXCEPTIONS[Z])

  return Object.freeze({
    atomicNumber: Z,
    subshells: shellOrder,
    energyOrder,
    shells,
    full: format(shellOrder),
    aufbauOrder: format(energyOrder),
    condensed,
    outerShellElectrons: shells[shells.length - 1],
    unpairedElectrons: subshells.reduce((sum, item) => sum + item.unpaired, 0),
    isException,
    exceptionNote: isException ? (EXCEPTION_NOTES[Z] || GENERIC_NOTE) : null,
    predicted: Z >= 104
  })
}

/* Electron count per (n,l) slot in the order an orbital-box diagram is drawn. */
export function orbitalBoxes(subshell) {
  const boxes = Array.from({ length: subshell.orbitals }, () => 0)
  for (let index = 0; index < subshell.electrons; index += 1) {
    boxes[index % subshell.orbitals] += 1
  }
  return boxes
}
