// Quantitative aqueous chemistry: charge-balance pH, Ksp equilibria, mixing heat.
// Ideal dilute solution at 25 °C for all equilibrium constants (activities = concentrations).
import { IONS, WEAK, KW, PRECIPITATES, LIQUIDS, molarMass } from '../data/materials.js'

export const NUCLEATION_LOG = 1 // Q must exceed 10·Ksp before a first precipitate forms (educational approximation)
export const NEUTRALIZATION_DH = -55840 // J/mol, H⁺ + OH⁻ → H₂O, from NBS ΔfH° (−285.83 − 0 + 229.99 kJ/mol)

export function emptyContents() {
  return { liquids: {}, ions: {}, indicators: {}, precipitates: {}, settled: {} }
}

export function aqueousLitres(contents) {
  let mL = 0
  for (const [key, value] of Object.entries(contents.liquids)) {
    if (LIQUIDS[key]?.aqueous) mL += value
  }
  return mL / 1000
}

export function totalVolumeML(contents) {
  return Object.values(contents.liquids).reduce((sum, v) => sum + v, 0)
}

function weakCharge(kind, C, h) {
  const w = WEAK[kind]
  if (kind === 'sulfate') return -C * (1 + w.Ka2 / (w.Ka2 + h))
  if (kind === 'acetate') return -C * w.Ka / (w.Ka + h)
  if (kind === 'ammonia') return C * h / (h + w.Ka)
  if (kind === 'carbonate') {
    const D = h * h + w.Ka1 * h + w.Ka1 * w.Ka2
    return -C * (w.Ka1 * h + 2 * w.Ka1 * w.Ka2) / D
  }
  return 0
}

// Free aquo-ion concentration of a hydrolysing metal with total C at [H⁺] = h.
// Mass balance C = x(1 + K1/h) + 2·β22·x²/h² is a quadratic in x.
function freeMetal(info, C, h) {
  const b = 1 + info.hydrolysisKa / h
  if (!info.dimerBeta) return C / b
  const a = 2 * info.dimerBeta / (h * h)
  return 2 * C / (b + Math.sqrt(b * b + 4 * a * C))
}

function chargeAt(h, conc) {
  let sum = h - KW / h
  for (const [ion, c] of conc) {
    const info = IONS[ion]
    if (info.weak) sum += weakCharge(info.weak, c, h)
    else {
      sum += info.z * c
      if (info.hydrolysisKa) {
        const x = freeMetal(info, c, h)
        sum -= x * info.hydrolysisKa / h + (info.dimerBeta ? 2 * info.dimerBeta * x * x / (h * h) : 0)
      }
    }
  }
  return sum
}

// Returns [H⁺] in mol/L. Charge balance is monotonic in h, so bisection on log h always converges.
export function solveH(ions, litres) {
  if (!(litres > 0)) return 1e-7
  const conc = []
  for (const [ion, mol] of Object.entries(ions)) if (mol > 0 && IONS[ion]) conc.push([ion, mol / litres])
  let lo = -16
  let hi = 1.5
  for (let i = 0; i < 56; i += 1) {
    const mid = (lo + hi) / 2
    if (chargeAt(10 ** mid, conc) > 0) hi = mid
    else lo = mid
  }
  return 10 ** ((lo + hi) / 2)
}

// Ionic strength I = ½Σc·z² (mol/L) at the solved [H⁺]. Hydrolysed metal ions are counted at full charge.
// Above IDEAL_I_LIMIT the ideal model (activity = concentration) can be off by a few tenths of a pH unit.
export const IDEAL_I_LIMIT = 0.1
export function ionicStrength(ions, litres, h) {
  if (!(litres > 0)) return 0
  let twoI = h + KW / h
  for (const [ion, mol] of Object.entries(ions)) {
    const info = IONS[ion]
    const c = mol / litres
    if (!info || !(c > 0)) continue
    if (!info.weak) { twoI += c * info.z * info.z; continue }
    if (info.weak === 'sulfate') { const f = WEAK.sulfate.Ka2 / (WEAK.sulfate.Ka2 + h); twoI += c * (4 * f + (1 - f)) }
    else if (info.weak === 'acetate') twoI += c * WEAK.acetate.Ka / (WEAK.acetate.Ka + h)
    else if (info.weak === 'ammonia') twoI += c * h / (h + WEAK.ammonia.Ka)
    else if (info.weak === 'carbonate') {
      const w = WEAK.carbonate
      const D = h * h + w.Ka1 * h + w.Ka1 * w.Ka2
      twoI += c * (w.Ka1 * h + 4 * w.Ka1 * w.Ka2) / D
    }
  }
  return twoI / 2
}

export function pHOf(contents) {
  const V = aqueousLitres(contents)
  if (V < 1e-6) return null
  return -Math.log10(solveH(contents.ions, V))
}

// Free (uncomplexed, unprotonated) concentration of an ion at the given h.
export function freeConc(ion, contents, h, V) {
  if (ion === 'OH') return KW / h
  const C = (contents.ions[ion] || 0) / V
  const info = IONS[ion]
  if (!info) return 0
  if (info.hydrolysisKa) return freeMetal(info, C, h)
  if (info.weak === 'sulfate') return C * WEAK.sulfate.Ka2 / (WEAK.sulfate.Ka2 + h)
  if (info.weak === 'carbonate') {
    const w = WEAK.carbonate
    return C * w.Ka1 * w.Ka2 / (h * h + w.Ka1 * h + w.Ka1 * w.Ka2)
  }
  if (info.weak === 'acetate') return C * WEAK.acetate.Ka / (WEAK.acetate.Ka + h)
  return C
}

// Dissolved CO₂ (H₂CO₃*) concentration, used for degassing.
export function carbonicAcid(contents, h, V) {
  const C = (contents.ions.CO3 || 0) / V
  const w = WEAK.carbonate
  return C * h * h / (h * h + w.Ka1 * h + w.Ka1 * w.Ka2)
}

function logQ(ppt, contents, V) {
  const h = solveH(contents.ions, V)
  const a = freeConc(ppt.cation, contents, h, V)
  const b = freeConc(ppt.anion, contents, h, V)
  if (a <= 0 || b <= 0) return -Infinity
  return ppt.p * Math.log10(a) + ppt.q * Math.log10(b)
}

function shift(contents, ppt, key, xi) {
  contents.ions[ppt.cation] = Math.max(0, (contents.ions[ppt.cation] || 0) - ppt.p * xi)
  if (ppt.anion !== 'OH') contents.ions[ppt.anion] = Math.max(0, (contents.ions[ppt.anion] || 0) - ppt.q * xi)
  contents.precipitates[key] = Math.max(0, (contents.precipitates[key] || 0) + xi)
}

function candidatePrecipitates(contents) {
  const out = []
  for (const [key, ppt] of Object.entries(PRECIPITATES)) {
    const hasSolid = (contents.precipitates[key] || 0) > 0
    const hasCation = (contents.ions[ppt.cation] || 0) > 0
    const hasAnion = ppt.anion === 'OH' || (contents.ions[ppt.anion] || 0) > 0
    if (hasSolid || (hasCation && hasAnion)) out.push(key)
  }
  return out
}

// Brings every sparingly soluble salt to Q = Ksp (precipitating or redissolving).
// Returns {key: Δmol} of newly formed precipitate so renderers can spawn particles.
export function equilibrate(contents) {
  const V = aqueousLitres(contents)
  const formed = {}
  if (V < 1e-6) return formed
  const keys = candidatePrecipitates(contents)
  if (!keys.length) return formed
  for (let round = 0; round < 6; round += 1) {
    let moved = 0
    for (const key of keys) {
      const ppt = PRECIPITATES[key]
      const target = Math.log10(ppt.Ksp)
      const solid = contents.precipitates[key] || 0
      let maxXi = (contents.ions[ppt.cation] || 0) / ppt.p
      if (ppt.anion !== 'OH') maxXi = Math.min(maxXi, (contents.ions[ppt.anion] || 0) / ppt.q)
      const base = structuredClone({ ions: contents.ions, precipitates: contents.precipitates })
      const trial = xi => {
        const c = { ...contents, ions: { ...base.ions }, precipitates: { ...base.precipitates } }
        shift(c, ppt, key, xi)
        return logQ(ppt, c, V) - target
      }
      let lo = -solid
      let hi = maxXi * (1 - 1e-12)
      // A new solid needs supersaturation to nucleate (metastable zone); an existing solid equilibrates at Ksp.
      if (solid <= 0 && trial(0) < NUCLEATION_LOG) continue
      if (trial(lo) <= 0) {
        if (solid > 0) { shift(contents, ppt, key, -solid); moved += solid }
        continue
      }
      if (hi <= lo) continue
      for (let i = 0; i < 48; i += 1) {
        const mid = (lo + hi) / 2
        if (trial(mid) > 0) lo = mid
        else hi = mid
      }
      const xi = (lo + hi) / 2
      if (Math.abs(xi) > 1e-15) {
        shift(contents, ppt, key, xi)
        moved += Math.abs(xi)
        if (xi > 0) formed[key] = (formed[key] || 0) + xi
      }
    }
    if (moved < 1e-14) break
  }
  for (const key of Object.keys(formed)) if (formed[key] < 1e-12) delete formed[key]
  return formed
}

// Heat capacity of the liquid in J/K (glass handled by the thermal engine).
export function liquidHeatCapacity(contents) {
  let C = 0
  for (const [key, mL] of Object.entries(contents.liquids)) C += mL * LIQUIDS[key].density * LIQUIDS[key].cp
  return C
}

export function liquidMassG(contents) {
  let m = 0
  for (const [key, mL] of Object.entries(contents.liquids)) m += mL * LIQUIDS[key].density
  return m
}

function freeProtons(contents) {
  const V = aqueousLitres(contents)
  if (V < 1e-6) return { h: 0, oh: 0 }
  const h = solveH(contents.ions, V)
  return { h: h * V, oh: (KW / h) * V }
}

export function scaleContents(contents, fraction) {
  const out = emptyContents()
  for (const group of ['liquids', 'ions', 'indicators', 'precipitates']) {
    for (const [k, v] of Object.entries(contents[group])) out[group][k] = v * fraction
  }
  return out
}

// Merge `parcel` into `target` (both contents). Returns {heatJ, formed} for the caller's thermal step.
export function mix(target, parcel) {
  const before = freeProtons(target)
  const added = freeProtons(parcel)
  for (const group of ['liquids', 'ions', 'indicators', 'precipitates']) {
    for (const [k, v] of Object.entries(parcel[group])) {
      if (v > 0) target[group][k] = (target[group][k] || 0) + v
    }
  }
  const formed = equilibrate(target)
  const after = freeProtons(target)
  const xi = Math.max(0, before.h + added.h - after.h, before.oh + added.oh - after.oh)
  // neutralised: H⁺ and OH⁻ both consumed (OH⁻ taken by a precipitate or a metal ion alone is not neutralisation).
  return { heatJ: -NEUTRALIZATION_DH * xi, waterFormed: xi, neutralised: Math.min(Math.max(0, before.h + added.h - after.h), Math.max(0, before.oh + added.oh - after.oh)), formed } // shortcut: heat still uses xi (over-heats a hydroxide precipitation by ≤ 1–2 °C), upgrade with a per-species proton balance
}

// Removes `mL` from the container, top layer first for immiscible liquids (what actually pours out).
// Suspended precipitate leaves in proportion; settled precipitate stays behind.
export function withdraw(contents, mL, settledFraction = 0) {
  const parcel = emptyContents()
  const total = totalVolumeML(contents)
  if (!(mL > 0) || total <= 0) return parcel
  let remaining = Math.min(mL, total)
  const layers = Object.keys(contents.liquids).filter(k => contents.liquids[k] > 0)
  const nonAq = layers.filter(k => !LIQUIDS[k].aqueous).sort((a, b) => LIQUIDS[a].density - LIQUIDS[b].density)
  const aq = layers.filter(k => LIQUIDS[k].aqueous)
  const aqVolume = aq.reduce((s, k) => s + contents.liquids[k], 0)
  const order = [...nonAq.filter(k => LIQUIDS[k].density < 1), 'AQ', ...nonAq.filter(k => LIQUIDS[k].density >= 1)]
  for (const layer of order) {
    if (remaining <= 0) break
    if (layer === 'AQ') {
      if (aqVolume <= 0) continue
      const take = Math.min(remaining, aqVolume)
      const f = take / aqVolume
      for (const k of aq) { parcel.liquids[k] = contents.liquids[k] * f; contents.liquids[k] -= parcel.liquids[k] }
      for (const [k, v] of Object.entries(contents.ions)) { parcel.ions[k] = v * f; contents.ions[k] = v - parcel.ions[k] }
      for (const [k, v] of Object.entries(contents.indicators)) { parcel.indicators[k] = v * f; contents.indicators[k] = v - parcel.indicators[k] }
      for (const [k, v] of Object.entries(contents.precipitates)) {
        const suspended = v * (1 - settledFraction)
        parcel.precipitates[k] = suspended * f
        contents.precipitates[k] = v - parcel.precipitates[k]
      }
      remaining -= take
    }
    else {
      const take = Math.min(remaining, contents.liquids[layer])
      parcel.liquids[layer] = take
      contents.liquids[layer] -= take
      remaining -= take
    }
  }
  for (const group of ['liquids', 'ions', 'indicators', 'precipitates']) {
    for (const k of Object.keys(contents[group])) if (contents[group][k] < 1e-15) delete contents[group][k]
  }
  return parcel
}

// Contents of a fresh library reagent portion.
export function reagentParcel(reagent, mL) {
  const parcel = emptyContents()
  if (reagent.kind === 'solution') {
    parcel.liquids.water = mL
    const mol = reagent.M * mL / 1000
    for (const [ion, n] of Object.entries(reagent.ions)) parcel.ions[ion] = mol * n
  }
  else if (reagent.kind === 'liquid') parcel.liquids[reagent.liquid] = mL
  else if (reagent.kind === 'indicator') {
    // Indicators are dosed in drops; 1 unit = one 0.05 mL drop. Solvent volume is tracked as water/ethanol.
    parcel.liquids[reagent.id === 'litmus' ? 'water' : 'ethanol'] = mL
    parcel.indicators[reagent.indicator] = mL / 0.05
  }
  return parcel
}

// Elemental inventory for conservation checks (dissolved + precipitated + solids passed in).
export function elementInventory(contents, extra = {}) {
  const inv = {}
  const add = (formula, n) => {
    if (!formula || !(n > 0)) return
    const parts = formula.match(/[A-Z][a-z]?\d*|\([^)]+\)\d*/g) || []
    const atoms = {}
    for (const p of parts) {
      const m = p.match(/^\(([^)]+)\)(\d*)$/)
      if (m) {
        for (const q of m[1].match(/[A-Z][a-z]?\d*/g)) {
          const [, s, c] = q.match(/([A-Z][a-z]?)(\d*)/)
          atoms[s] = (atoms[s] || 0) + (Number(c) || 1) * (Number(m[2]) || 1)
        }
      }
      else {
        const [, s, c] = p.match(/([A-Z][a-z]?)(\d*)/)
        atoms[s] = (atoms[s] || 0) + (Number(c) || 1)
      }
    }
    for (const [s, c] of Object.entries(atoms)) inv[s] = (inv[s] || 0) + c * n
  }
  const ionFormula = { 'Na+': 'Na', 'K+': 'K', 'Ag+': 'Ag', 'Ba2+': 'Ba', 'Ca2+': 'Ca', 'Mg2+': 'Mg', 'Zn2+': 'Zn', 'Cu2+': 'Cu', 'Fe2+': 'Fe', 'Fe3+': 'Fe', 'Cl-': 'Cl', 'NO3-': 'NO3', 'I-': 'I', SO4: 'SO4', OAc: 'C2O2', NH3: 'N', CO3: 'CO3' }
  for (const [ion, n] of Object.entries(contents.ions)) add(ionFormula[ion], n)
  for (const [key, n] of Object.entries(contents.precipitates)) {
    // Hydroxide O/H come from water, so only the metal and non-OH anion are tracked.
    const ppt = PRECIPITATES[key]
    add(ionFormula[ppt.cation], ppt.p * n)
    if (ppt.anion !== 'OH') add(ionFormula[ppt.anion], ppt.q * n)
  }
  for (const [formula, n] of Object.entries(extra)) add(formula, n)
  return inv
}

export function massOfSolid(formula, mol) {
  return mol * molarMass(formula)
}
