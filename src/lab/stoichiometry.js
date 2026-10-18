/* =========================================================
   VIRTUAL LAB — REACTION STOICHIOMETRY
   Moles of each reactant from volume × stock concentration,
   limiting reactant, excess and products from the balanced
   equation. Only for reactions whose every reactant has a
   known concentration; otherwise the result says which ones
   are missing instead of guessing.
========================================================= */

import { splitSpecies } from '../chem/equation.js'
import { parseFormula, parseSpecies } from '../chem/formula.js'
import { elements } from '../data/elements.js'

const MASS = new Map(elements.map(element => [element.symbol, element.mass]))

/* Reactions that must not be computed as a single complete reaction. */
export const NOT_SINGLE_STEP = {
  'na2co3-hcl': 'Phản ứng xảy ra theo hai nấc: HCl thiếu chỉ tạo HCO₃⁻ (chưa có khí CO₂), nên ChemLab chưa tính lượng chất.',
  'na2so3-hcl': 'Phản ứng xảy ra theo hai nấc: HCl thiếu chỉ tạo HSO₃⁻ (chưa có khí SO₂), nên ChemLab chưa tính lượng chất.',
  'cuso4-na2co3': 'Kết tủa thực tế là copper(II) carbonate base, không đúng công thức CuCO₃, nên ChemLab không tính khối lượng.',
  'mgcl2-na2co3': 'Kết tủa thực tế là magnesium carbonate base, không đúng công thức MgCO₃, nên ChemLab không tính khối lượng.'
}

/* Amphoteric hydroxides redissolve in excess hydroxide:
   Al(OH)₃ + NaOH → Na[Al(OH)₄]; Zn(OH)₂ + 2NaOH → Na₂[Zn(OH)₄]. */
export const AMPHOTERIC = {
  'alcl3-naoh': { reagent: 'naoh', solid: 'Al(OH)3', perSolid: 1, complex: 'Na[Al(OH)4]' },
  'znso4-naoh': { reagent: 'naoh', solid: 'Zn(OH)2', perSolid: 2, complex: 'Na2[Zn(OH)4]' }
}

const ARROW = /\s*(?:⇌|→)\s*/

export function molarMass(atoms) {
  return Object.entries(atoms).reduce((sum, [symbol, count]) => sum + MASS.get(symbol) * count, 0)
}

function sameAtoms(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  return [...keys].every(key => (a[key] || 0) === (b[key] || 0))
}

/**
 * @param reaction entry of REACTIONS
 * @param {Record<string, number>} mixture reagent id → volume (mL)
 * @param reagents reagent id → catalogue entry
 * @param {(id: string) => number|null} concentrationOf mol/L or null when unknown
 * @returns null when the equation cannot be matched to the reagents;
 *   { status: 'qualitative', missing | reason } when a concentration is unknown
 *   or the reaction is not one complete step;
 *   { status: 'quantitative', reactants, limiting, excess, products } otherwise (amounts in mol)
 */
export function computeStoichiometry(reaction, mixture, reagents, concentrationOf) {
  if (NOT_SINGLE_STEP[reaction.id]) return { status: 'qualitative', reason: NOT_SINGLE_STEP[reaction.id] }
  if (String(reaction.equation).includes('⇌')) {
    return { status: 'qualitative', reason: 'Đây là phản ứng thuận nghịch (cân bằng hóa học), không xảy ra hoàn toàn, nên ChemLab không tính lượng chất.' }
  }

  const sides = String(reaction.equation || '').split(ARROW)
  if (sides.length !== 2) return null

  let left
  let right
  try {
    left = splitSpecies(sides[0]).map(parseSpecies)
    right = splitSpecies(sides[1]).map(raw => ({ ...parseSpecies(raw), precipitate: raw.includes('↓'), gas: raw.includes('↑') }))
  }
  catch {
    return null
  }

  const missing = reaction.reactants.filter(id => concentrationOf(id) === null).map(id => reagents[id]?.formula || id)
  if (missing.length) return { status: 'qualitative', missing }

  const reactants = []
  for (const id of reaction.reactants) {
    const atoms = parseFormula(reagents[id].formula)
    const species = left.find(item => sameAtoms(item.atoms, atoms))
    if (!species) return null
    reactants.push({
      id,
      formula: reagents[id].formula,
      coefficient: species.coefficient,
      moles: concentrationOf(id) * (mixture[id] || 0) / 1000
    })
  }

  const extent = Math.min(...reactants.map(item => item.moles / item.coefficient))
  const tolerance = 1e-12
  const result = {
    status: 'quantitative',
    extent,
    reactants,
    limiting: reactants.filter(item => item.moles / item.coefficient - extent <= tolerance).map(item => item.id),
    excess: reactants
      .map(item => ({ id: item.id, formula: item.formula, moles: item.moles - item.coefficient * extent }))
      .filter(item => item.moles > tolerance),
    products: right.map(item => {
      const moles = item.coefficient * extent
      return { formula: item.formula, moles, mass: moles * molarMass(item.atoms), precipitate: item.precipitate, gas: item.gas }
    }),
    dissolved: null
  }

  // Second step for amphoteric hydroxides: the excess base dissolves part or all of the solid.
  const amphoteric = AMPHOTERIC[reaction.id]
  const leftover = amphoteric && result.excess.find(item => item.id === amphoteric.reagent)
  const solid = amphoteric && result.products.find(item => item.formula === amphoteric.solid)
  if (leftover && solid) {
    const dissolved = Math.min(solid.moles, leftover.moles / amphoteric.perSolid)
    solid.moles -= dissolved
    solid.mass = solid.moles * molarMass(parseFormula(solid.formula))
    leftover.moles -= dissolved * amphoteric.perSolid
    result.excess = result.excess.filter(item => item.moles > tolerance)
    result.products.push({ formula: amphoteric.complex, moles: dissolved, mass: dissolved * molarMass(parseFormula(amphoteric.complex)), precipitate: false, gas: false })
    result.dissolved = { formula: amphoteric.solid, moles: dissolved, complete: solid.moles <= tolerance }
    if (solid.moles <= tolerance) solid.moles = solid.mass = 0
  }

  return result
}
