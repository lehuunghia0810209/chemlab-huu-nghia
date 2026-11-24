// Object names for labels (pure: no DOM). Everything is derived from the simulation state, so a label
// follows the chemistry: pour HCl into "Cốc A — CuSO₄" and it becomes "Cốc A — CuSO₄ + HCl".
import { REAGENT_BY_ID, IONS, LIQUIDS, INDICATORS, PRECIPITATES } from '../data/materials.js'
import { byId, isContainer, label, coatCoverage } from '../engine/processes.js'

const sub = f => String(f).replace(/(\d+)/g, d => [...d].map(ch => '₀₁₂₃₄₅₆₇₈₉'[ch]).join(''))
const METAL = { 'Na+': ['Na', 1], 'K+': ['K', 1], 'Ag+': ['Ag', 1], 'Ba2+': ['Ba', 2], 'Ca2+': ['Ca', 2], 'Mg2+': ['Mg', 2], 'Zn2+': ['Zn', 2], 'Cu2+': ['Cu', 2], 'Fe2+': ['Fe', 2], 'Fe3+': ['Fe', 3] }
// Anion groups: [formula, charge, polyatomic, acid name]
const ANION = { 'Cl-': ['Cl', 1, false, 'HCl'], 'NO3-': ['NO3', 1, true, 'HNO3'], 'I-': ['I', 1, false, 'HI'], SO4: ['SO4', 2, true, 'H2SO4'], CO3: ['CO3', 2, true, 'H2CO3'], OAc: ['CH3COO', 1, true, 'CH3COOH'] }
const BASE = { Na: 'NaOH', K: 'KOH', Ba: 'Ba(OH)2', Ca: 'Ca(OH)2' }
const gcd = (a, b) => (b ? gcd(b, a % b) : a)

function salt(metal, zm, anion) {
  const [a, za, poly] = anion
  const l = zm * za / gcd(zm, za)
  const nm = l / zm
  const na = l / za
  if (a === 'CH3COO') return na === 1 ? `CH3COO${metal}` : `(CH3COO)${na}${metal}`
  return `${metal}${nm > 1 ? nm : ''}${poly && na > 1 ? `(${a})${na}` : `${a}${na > 1 ? na : ''}`}`
}

// "CuSO₄", "HCl", "NaOH + phenolphtalein", "CuSO₄, FeSO₄", "Nước"…; null when empty.
export function contentsName(c) {
  const { liquids, ions, indicators, precipitates } = c.contents
  const parts = []
  const big = (map, min) => Object.entries(map).filter(([, v]) => v > min)
  const metals = big(ions, 1e-6).filter(([k]) => METAL[k])
  const anions = big(ions, 1e-6).filter(([k]) => ANION[k])
  metals.sort((a, b) => b[1] - a[1])
  anions.sort((a, b) => b[1] - a[1])
  // Charge balance: metal-ion charge is shared out over the anions (largest first). Anion charge left
  // over is the acid (HCl…); metal charge left over is the base (NaOH…).
  const charge = metals.reduce((s, [k, n]) => s + METAL[k][1] * n, 0)
  let budget = charge
  const inSalt = []
  const acid = []
  for (const [k, n] of anions) {
    const q = ANION[k][1] * n
    if (budget > q * 0.05) inSalt.push(k)
    if (budget < q * 0.95) acid.push(k)
    budget = Math.max(0, budget - q)
  }
  for (const [k] of metals) {
    const [m, z] = METAL[k]
    // A little metal ion in a lot of acid (zinc dissolving in HCl) is still named as its salt: ZnCl₂ + HCl.
    const pair = inSalt[0] || anions[0]?.[0]
    if (pair) parts.push(salt(m, z, ANION[pair]))
    if (!pair || (budget > charge * 0.03 && k === metals[0][0])) parts.push(BASE[m] || IONS[k].label)
  }
  if (metals.length) for (const k of inSalt.slice(1)) parts.push(salt(...METAL[metals[0][0]], ANION[k]))
  for (const k of acid) parts.push(ANION[k][3])
  if ((ions.NH3 || 0) > 1e-6) parts.push('NH3')
  const named = [...new Set(parts)].map(sub)
  for (const [k] of big(precipitates, 1e-7)) named.push(`${sub(PRECIPITATES[k].formula)}↓`)
  // Liquids: water only when nothing else is named; trace solvents (e.g. ethanol in an indicator) are left out.
  const vol = Object.values(liquids).reduce((s, v) => s + v, 0)
  for (const [k] of big(liquids, Math.max(0.5, vol * 0.02))) if (k !== 'water' || !named.length) named.push(LIQUIDS[k].name)
  for (const [k] of big(indicators, 0.01)) named.push(INDICATORS[k].name.toLowerCase())
  if (!named.length) return null
  return named.length > 4 ? `${named.slice(0, 3).join(' + ')} + …` : named.join(' + ')
}

// Short display name of a solid piece: "Đinh sắt (Fe)", "Natri (Na)".
export function solidName(s) {
  const r = REAGENT_BY_ID[s.reagent]
  return `${r.name.replace(/\s*\(.*\)$/, '')} (${sub(r.formula)})`
}

// Full label text for the bench overlay. hideContents: the lesson is to identify unknown solutions.
export function objectTitle(state, o, { hideContents = false } = {}) {
  if (o.type === 'solid') {
    const coat = coatCoverage(o) > 0.05 ? Object.entries(o.coat || {}).filter(([, v]) => v > 0).map(([m]) => m) : []
    return `${solidName(o)}${coat.length ? ` · có lớp ${coat.join(', ')} bám` : ''}`
  }
  const name = label(o)
  if (o.load) {
    const held = o.load.id && byId(state, o.load.id)
    return `${name} — đang gắp ${held ? solidName(held) : REAGENT_BY_ID[o.load.reagent].name}`
  }
  if (!isContainer(o) || o.stock || hideContents) return name
  const what = contentsName(o)
  const pieces = state.objects.filter(s => s.type === 'solid' && s.in === o.id && s.massG > 0).map(s => solidName(s))
  const body = [what, pieces.length ? `có ${[...new Set(pieces)].join(', ')}` : null].filter(Boolean).join(' · ')
  return body ? `${name} — ${body}` : `${name} — trống`
}

