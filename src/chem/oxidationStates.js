/* =========================================================
   COMMON OXIDATION STATES
   Curated for the elements met in the Vietnamese upper-secondary
   chemistry curriculum. Values are the commonly occurring states
   (IUPAC Red Book / Greenwood & Earnshaw); 0 (free element) is
   implied for every element and listed only for noble gases.
   Elements not listed have no curated entry — the UI says so
   instead of guessing.
========================================================= */

const COMMON = Object.freeze({
  1: [-1, 1],
  2: [0], 10: [0], 18: [0], 36: [0, 2], 54: [0, 2, 4, 6], 86: [0, 2],
  3: [1], 11: [1], 19: [1], 37: [1], 55: [1], 87: [1],
  4: [2], 12: [2], 20: [2], 38: [2], 56: [2], 88: [2],
  5: [3], 13: [3], 31: [3], 49: [1, 3], 81: [1, 3],
  6: [-4, 2, 4], 14: [-4, 4], 32: [2, 4], 50: [2, 4], 82: [2, 4],
  7: [-3, 1, 2, 3, 4, 5], 15: [-3, 3, 5], 33: [-3, 3, 5], 51: [-3, 3, 5], 83: [3, 5],
  8: [-2, -1], 16: [-2, 4, 6], 34: [-2, 4, 6], 52: [-2, 4, 6],
  9: [-1], 17: [-1, 1, 3, 5, 7], 35: [-1, 1, 3, 5, 7], 53: [-1, 1, 3, 5, 7],
  21: [3], 22: [2, 3, 4], 23: [2, 3, 4, 5], 24: [2, 3, 6], 25: [2, 4, 6, 7],
  26: [2, 3], 27: [2, 3], 28: [2], 29: [1, 2], 30: [2],
  42: [4, 6], 46: [2, 4], 47: [1], 48: [2],
  74: [4, 6], 78: [2, 4], 79: [1, 3], 80: [1, 2],
  58: [3, 4], 63: [2, 3], 92: [3, 4, 5, 6]
})

export function getCommonOxidationStates(number) {
  const Z = Number(number)
  if (COMMON[Z]) return [...COMMON[Z]]
  // Every lanthanide shows +3 as its characteristic state.
  if (Z >= 57 && Z <= 71) return [3]
  return null
}

export function formatOxidationState(value) {
  if (value === 0) return '0'
  return value > 0 ? `+${value}` : `−${Math.abs(value)}`
}
