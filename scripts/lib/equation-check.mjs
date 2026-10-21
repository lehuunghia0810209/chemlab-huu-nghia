// Element and charge balance for equations written in lessons and questions.
// Understands Unicode sub/superscripts, state symbols, hydrates and electron
// terms in half-reactions (e, 2e, ne is not allowed — mark such text check:false).
import { parseSpecies } from '../../src/chem/formula.js'

const ARROW = /\s*(?:⇌|→|⟶)\s*/

function parseTerm(raw) {
  const text = raw.trim()
  const electron = /^(\d*)\s*e(?:⁻|-)?$/.exec(text)
  if (electron) return { atoms: {}, charge: -(Number(electron[1]) || 1) }
  const species = parseSpecies(text.replace(/\((?:s|l|g|aq)\)/g, ''))
  const total = {}
  for (const [symbol, count] of Object.entries(species.atoms)) total[symbol] = count * species.coefficient
  return { atoms: total, charge: species.charge * species.coefficient }
}

function side(text) {
  const totals = { atoms: {}, charge: 0 }
  // Split on " + " between species, not on the + of a charge like Fe³⁺.
  for (const term of text.split(/\s+\+\s+/)) {
    const { atoms, charge } = parseTerm(term)
    for (const [symbol, count] of Object.entries(atoms)) totals.atoms[symbol] = (totals.atoms[symbol] || 0) + count
    totals.charge += charge
  }
  return totals
}

// Returns null when balanced, otherwise a message. Throws on unparseable text.
export function equationProblem(text) {
  const parts = String(text).split(ARROW)
  if (parts.length !== 2) throw new Error('cần đúng một mũi tên')
  const left = side(parts[0])
  const right = side(parts[1])
  const symbols = new Set([...Object.keys(left.atoms), ...Object.keys(right.atoms)])
  const off = [...symbols].filter(symbol => (left.atoms[symbol] || 0) !== (right.atoms[symbol] || 0))
  if (off.length) return `không bảo toàn ${off.join(', ')}`
  if (left.charge !== right.charge) return `điện tích ${left.charge} ≠ ${right.charge}`
  return null
}

export const hasArrow = text => /[→⇌⟶]/.test(String(text))
