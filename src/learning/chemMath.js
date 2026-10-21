// Rounded atomic masses used in Vietnamese textbooks and exam problems, so
// worked answers match what learners compute by hand. Used by question
// `verify()` functions to recompute numeric answers independently.
import { parseFormula } from '../chem/formula.js'

export const ATOMIC_MASS = {
  H: 1, He: 4, Li: 7, Be: 9, B: 11, C: 12, N: 14, O: 16, F: 19, Ne: 20,
  Na: 23, Mg: 24, Al: 27, Si: 28, P: 31, S: 32, Cl: 35.5, Ar: 40,
  K: 39, Ca: 40, Cr: 52, Mn: 55, Fe: 56, Co: 59, Ni: 59, Cu: 64, Zn: 65,
  Br: 80, Rb: 85.5, Sr: 88, Ag: 108, Sn: 119, I: 127, Ba: 137, Pb: 207
}

export function molarMass(formula) {
  return Object.entries(parseFormula(formula)).reduce((total, [symbol, count]) => {
    const mass = ATOMIC_MASS[symbol]
    if (mass === undefined) throw new Error(`Chưa có nguyên tử khối của ${symbol}`)
    return total + mass * count
  }, 0)
}

export const round = (value, digits = 2) => Math.round(value * 10 ** digits) / 10 ** digits

// Gas molar volume at standard conditions (25 °C, 1 bar) used by the 2018 programme.
export const GAS_VOLUME_STANDARD = 24.79
