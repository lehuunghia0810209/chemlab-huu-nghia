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
 *   { status: 'qualitative', missing } when a concentration is unknown;
 *   { status: 'quantitative', reactants, limiting, excess, products } otherwise (amounts in mol)
 */
export function computeStoichiometry(reaction, mixture, reagents, concentrationOf) {
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
  return {
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
    })
  }
}
