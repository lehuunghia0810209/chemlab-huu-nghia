// Quantitative aqueous chemistry: charge-balance pH, Ksp equilibria, mixing heat.
// Ideal dilute solution at 25 °C for all equilibrium constants (activities = concentrations).
import { ION_REDOX } from '../data/reactions.js'
import { IONS, WEAK, KW, PRECIPITATES, LIQUIDS, INDICATORS, molarMass, ETHANOL_WATER_DENSITY, ETHANOL_WATER_BOILING, PH_MAX_ETHANOL_FRACTION } from '../data/materials.js'

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

function interp(table, x, col = 1) {
  if (x <= table[0][0]) return table[0][col]
  for (let i = 1; i < table.length; i += 1) {
    const a = table[i - 1]
    const b = table[i]
    if (x <= b[0]) return a[col] + (b[col] - a[col]) * (x - a[0]) / (b[0] - a[0])
  }
  return table[table.length - 1][col]
}

// The water-miscible (polar) phase: water + ethanol. Mass % ethanol, measured mixture density,
// and whether the aqueous pH scale applies (ethanol ≤ PH_MAX_ETHANOL_FRACTION by volume).
export function polarPhase(contents) {
  const w = contents.liquids.water || 0
  const e = contents.liquids.ethanol || 0
  const mW = w * LIQUIDS.water.density
  const mE = e * LIQUIDS.ethanol.density
  const wt = mW + mE > 0 ? 100 * mE / (mW + mE) : 0
  return {
    mL: w + e,
    ethanolWt: wt,
    ethanolVol: w + e > 0 ? e / (w + e) : 0,
    density: w + e > 0 ? interp(ETHANOL_WATER_DENSITY, wt) : 0,
    pHApplies: w > 0.001 && e / (w + e) <= PH_MAX_ETHANOL_FRACTION
  }
}

// Bubble point (°C, 1 atm) and vapour mass fraction of ethanol for the polar phase (CRC table).
export function boilingOf(contents) {
  const { ethanolWt } = polarPhase(contents)
  return { T: interp(ETHANOL_WATER_BOILING, ethanolWt), vapourWt: interp(ETHANOL_WATER_BOILING, ethanolWt, 2) }
}

// True when the oil layer is denser than the polar phase it sits in (e.g. oil in ethanol sinks).
export function oilBelow(contents) {
  const oil = contents.liquids.oil || 0
  const p = polarPhase(contents)
  return oil > 0 && p.mL > 0 && LIQUIDS.oil.density > p.density
}

export function totalVolumeML(contents) {
  return Object.values(contents.liquids).reduce((sum, v) => sum + v, 0)
}

// Root of an increasing function on a bracket [lo, hi] with f(lo) < 0 < f(hi): Illinois steps (regula falsi with the
// stale end halved), and a bisection step whenever the bracket did not at least halve — never slower than bisection,
// usually 4–5× faster. Stops when the bracket is below tol.
function rootUp(f, lo, hi, flo, fhi, tol) {
  let side = 0
  let width = hi - lo
  let bisect = false
  for (let i = 0; i < 200 && hi - lo > tol; i += 1) {
    const x = bisect ? (lo + hi) / 2 : (lo * fhi - hi * flo) / (fhi - flo)
    const fx = f(x)
    if (fx === 0) return x
    if (fx > 0) { hi = x; fhi = fx; if (side === 1) flo /= 2; side = 1 }
    else { lo = x; flo = fx; if (side === -1) fhi /= 2; side = -1 }
    bisect = hi - lo > width / 2
    width = hi - lo
  }
  return (lo + hi) / 2
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

// Free aquo-ion concentration of a metal with total dissolved C at [H⁺] = h and ammine sum S = Σβᵢ·Lⁱ.
// Mass balance C = x(1 + K1/h + S) + 2·β22·x²/h² is a quadratic in x.
function freeMetal(info, C, h, S = 0) {
  const b = 1 + (info.hydrolysisKa ? info.hydrolysisKa / h : 0) + S
  if (!info.dimerBeta) return C / b
  const a = 2 * info.dimerBeta / (h * h)
  return 2 * C / (b + Math.sqrt(b * b + 4 * a * C))
}

// Ammine complexes M(NH₃)ᵢ (cumulative βᵢ, IONS[ion].ammine). Returns [S, D] = [Σβᵢ·Lⁱ, Σi·βᵢ·Lⁱ] at free NH₃ L.
function ammineSums(info, L) {
  let S = 0
  let D = 0
  let Li = 1
  for (let i = 0; i < info.ammine.length; i += 1) {
    Li *= L // Lⁱ⁺¹ by repeated multiplication (this is the innermost loop of the pH solve)
    const t = info.ammine[i] * Li
    S += t
    D += (i + 1) * t
  }
  return [S, D]
}

// Free NH₃ (mol/L) at [H⁺] = h. conc: [[ion, mol/L]]. Mass balance on nitrogen,
// N = L·(1 + h/Ka) + Σ x_M·D_M(L), is increasing in L: bisection on log L. Without a complexing metal, closed form.
function freeAmmonia(conc, h) {
  const N = conc.find(([ion]) => ion === 'NH3')?.[1] || 0
  if (!(N > 0)) return 0
  const Ka = WEAK.ammonia.Ka
  const metals = conc.filter(([ion, c]) => c > 0 && IONS[ion].ammine)
  if (!metals.length) return N * Ka / (Ka + h)
  const excess = lg => {
    const L = 10 ** lg
    let bound = 0
    for (const [ion, c] of metals) {
      const info = IONS[ion]
      const [S, D] = ammineSums(info, L)
      bound += freeMetal(info, c, h, S) * D
    }
    return L * (1 + h / Ka) + bound - N
  }
  const top = Math.log10(N * Ka / (Ka + h)) // L can only be lower than without metals
  const ftop = excess(top)
  if (ftop <= 0) return 10 ** top
  // Runs inside the pH root, so it sets the cost of every mix with NH₃ and a complexing metal: start from a narrow
  // bracket around the previous root (successive calls differ little) and fall back to the full one.
  const [lo, hi, flo, fhi] = warmBracket(excess, lastLgL, 0.25, Math.min(-30, top - 20), top, ftop)
  lastLgL = rootUp(excess, lo, hi, flo, fhi, 1e-9)
  return 10 ** lastLgL
}
let lastLgL = -3
let lastLgH = -7

// A bracket [lo, hi] with f(lo) < 0 < f(hi) for an increasing f: ±d around a guess when that already brackets the root,
// else the full range [min, max] (f(max) = fmax > 0 known).
function warmBracket(f, guess, d, min, max, fmax) {
  const a = Math.max(min, guess - d)
  const b = Math.min(max, guess + d)
  if (b > a) {
    const fa = f(a)
    if (fa < 0) {
      const fb = b === max ? fmax : f(b)
      if (fb > 0) return [a, b, fa, fb]
      return [b, max, fb, fmax]
    }
    return [min, a, f(min), fa]
  }
  return [min, max, f(min), fmax]
}

function chargeAt(h, conc, L) {
  let sum = h - KW / h
  for (const [ion, c] of conc) {
    const info = IONS[ion]
    if (info.weak === 'ammonia') sum += L * h / WEAK.ammonia.Ka // NH₄⁺; NH₃ bound in a complex is not protonated
    else if (info.weak) sum += weakCharge(info.weak, c, h)
    else {
      sum += info.z * c // a complex keeps the metal's charge
      if (info.hydrolysisKa) {
        const x = freeMetal(info, c, h, info.ammine && L > 0 ? ammineSums(info, L)[0] : 0)
        sum -= x * info.hydrolysisKa / h + (info.dimerBeta ? 2 * info.dimerBeta * x * x / (h * h) : 0)
      }
    }
  }
  return sum
}

// Returns [H⁺] in mol/L. Charge balance is monotonic in h, so bisection on log h always converges.
export function solveH(ions, litres) {
  if (!(litres > 0)) return 1e-7
  const conc = concList(ions, litres)
  const f = lg => chargeAt(10 ** lg, conc, freeAmmonia(conc, 10 ** lg))
  let lo = -16
  let hi = 1.5
  let flo = f(lo)
  let fhi = f(hi)
  if (!(flo < 0)) return 10 ** lo
  if (!(fhi > 0)) return 10 ** hi
  // Charge balance is monotonic in h. Warm start around the previous pH (the Ksp solve calls this many times in a row).
  const [a, b, fa, fb] = warmBracket(f, lastLgH, 0.2, lo, hi, fhi)
  lastLgH = rootUp(f, a, b, fa, fb, 1e-12)
  return 10 ** lastLgH
}

// Ionic strength I = ½Σc·z² (mol/L) at the solved [H⁺]. Hydrolysed metal ions are counted at full charge.
// Above IDEAL_I_LIMIT the ideal model (activity = concentration) can be off by a few tenths of a pH unit.
export const IDEAL_I_LIMIT = 0.1
export function ionicStrength(ions, litres, h) {
  if (!(litres > 0)) return 0
  let twoI = h + KW / h
  const L = freeAmmonia(concList(ions, litres), h)
  for (const [ion, mol] of Object.entries(ions)) {
    const info = IONS[ion]
    const c = mol / litres
    if (!info || !(c > 0)) continue
    if (!info.weak) { twoI += c * info.z * info.z; continue }
    if (info.weak === 'sulfate') { const f = WEAK.sulfate.Ka2 / (WEAK.sulfate.Ka2 + h); twoI += c * (4 * f + (1 - f)) }
    else if (info.weak === 'acetate') twoI += c * WEAK.acetate.Ka / (WEAK.acetate.Ka + h)
    else if (info.weak === 'ammonia') twoI += L * h / WEAK.ammonia.Ka
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
  if (V < 1e-6 || !polarPhase(contents).pHApplies) return null
  return -Math.log10(solveH(contents.ions, V))
}

function concList(ions, V) {
  const conc = []
  for (const [ion, mol] of Object.entries(ions)) if (mol > 0 && IONS[ion]) conc.push([ion, mol / V])
  return conc
}

// Free (uncomplexed, unprotonated) concentration of an ion at the given h.
export function freeConc(ion, contents, h, V) {
  if (ion === 'OH') return KW / h
  const C = (contents.ions[ion] || 0) / V
  const info = IONS[ion]
  if (!info) return 0
  if (info.ammine && (contents.ions.NH3 || 0) > 0) return freeMetal(info, C, h, ammineSums(info, freeAmmonia(concList(contents.ions, V), h))[0])
  if (info.ammine && !info.hydrolysisKa) return C
  if (info.hydrolysisKa) return freeMetal(info, C, h)
  if (info.weak === 'sulfate') return C * WEAK.sulfate.Ka2 / (WEAK.sulfate.Ka2 + h)
  if (info.weak === 'carbonate') {
    const w = WEAK.carbonate
    return C * w.Ka1 * w.Ka2 / (h * h + w.Ka1 * h + w.Ka1 * w.Ka2)
  }
  if (info.weak === 'acetate') return C * WEAK.acetate.Ka / (WEAK.acetate.Ka + h)
  if (info.weak === 'ammonia') return freeAmmonia(concList(contents.ions, V), h) // unprotonated, unbound NH₃
  return C
}

// Moles of each metal held as ammine complexes, Σ M(NH₃)ᵢ (the analytical total stays in contents.ions[metal]).
export function ammineComplexes(contents) {
  const out = {}
  const V = aqueousLitres(contents)
  if (V < 1e-6 || !((contents.ions.NH3 || 0) > 0)) return out
  const h = solveH(contents.ions, V)
  const L = freeAmmonia(concList(contents.ions, V), h)
  for (const [ion, mol] of Object.entries(contents.ions)) {
    const info = IONS[ion]
    if (!info?.ammine || !(mol > 0)) continue
    const [S] = ammineSums(info, L)
    const held = freeMetal(info, mol / V, h, S) * S * V
    if (held > 1e-12) out[ion] = held
  }
  return out
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
    if (ppt.redox) continue // formed by ionRedox, not by a reversible Ksp step
    const hasSolid = (contents.precipitates[key] || 0) > 0
    const hasCation = (contents.ions[ppt.cation] || 0) > 0
    const hasAnion = ppt.anion === 'OH' || (contents.ions[ppt.anion] || 0) > 0
    if (hasSolid || (hasCation && hasAnion)) out.push(key)
  }
  return out
}

// Brings every sparingly soluble salt to Q = Ksp (precipitating or redissolving).
// Returns {key: Δmol} of newly formed precipitate so renderers can spawn particles.
// Fast solution redox (ION_REDOX) to completion, limited by the scarcer reactant. Returns {ruleId: ξ}.
export function ionRedox(contents, formed = {}) {
  const ran = {}
  const V = aqueousLitres(contents)
  if (V < 1e-6) return ran
  const pH = -Math.log10(solveH(contents.ions, V))
  for (const r of ION_REDOX) {
    // Acidic/neutral solution only: in base the cation is a hydroxide (Fe(OH)₃, Cu(OH)₂) and the couple's
    // potential drops far below I₂/I⁻, so no iodine forms. Below pH 7 only the dissolved cation reacts; a
    // hydroxide redissolves through the Ksp step and is converted on later steps.
    if (pH > r.maxPH) continue
    let xi = Infinity
    for (const [ion, n] of Object.entries(r.reactants)) xi = Math.min(xi, (contents.ions[ion] || 0) / n)
    if (!(xi > 1e-12)) continue
    for (const [ion, n] of Object.entries(r.reactants)) contents.ions[ion] = Math.max(0, contents.ions[ion] - n * xi)
    for (const [ion, n] of Object.entries(r.products || {})) contents.ions[ion] = (contents.ions[ion] || 0) + n * xi
    for (const [key, n] of Object.entries(r.precipitate || {})) {
      contents.precipitates[key] = (contents.precipitates[key] || 0) + n * xi
      formed[key] = (formed[key] || 0) + n * xi
    }
    ran[r.id] = xi
  }
  iodineSolubility(contents, V)
  return ran
}

// I₂ dissolves in water only to 1.33 mM (0.34 g/L, 25 °C, CRC) but much more as I₃⁻ while I⁻ is present
// (I₂ + I⁻ ⇌ I₃⁻, K ≈ 700). shortcut: capacity = 1.33 mM·V + n(I⁻); the excess is solid iodine (I2s), which
// redissolves when capacity returns. Upgrade with the I₃⁻ equilibrium if a lesson needs exact colours.
export const I2_SOLUBILITY = 1.33e-3
const I3_K = 710
const I3_PER_IODIDE = (I3_K * I2_SOLUBILITY) / (1 + I3_K * I2_SOLUBILITY)
function iodineSolubility(contents, V) {
  const dissolved = contents.ions.I2 || 0
  const solid = contents.precipitates.I2s || 0
  if (!(dissolved + solid > 0)) return
  // At saturation [I₂(aq)] = S₀, [I₃⁻] = K·S₀·[I⁻]free and C(I⁻) = [I⁻]free + [I₃⁻] → [I₃⁻] ≤ K·S₀/(1 + K·S₀)·C(I⁻) ≈ 0,486·C(I⁻)
  // (K = 710, Harris; S₀ = 1,33 mM): about 0,05 M I₂ in 0,1 M KI, as measured.
  const cap = I2_SOLUBILITY * V + I3_PER_IODIDE * (contents.ions['I-'] || 0)
  const want = Math.min(dissolved + solid, cap)
  contents.ions.I2 = want
  const s = dissolved + solid - want
  if (s > 1e-12) contents.precipitates.I2s = s
  else delete contents.precipitates.I2s
  if (!(want > 0)) delete contents.ions.I2
}

// Order matters: sparingly soluble salts first (AgI takes I⁻ before Cu²⁺ can; hydroxides form in base),
// then the fast redox on what is left, then the salts again for the redox products.
export function equilibrate(contents) {
  const formed = {}
  if (aqueousLitres(contents) < 1e-6) return formed
  kspEquilibrium(contents, formed)
  const ran = ionRedox(contents, formed)
  if (Object.keys(ran).length) {
    Object.defineProperty(formed, 'redox', { value: ran }) // non-enumerable: callers iterate precipitates only
    kspEquilibrium(contents, formed)
  }
  for (const key of Object.keys(formed)) if (formed[key] < 1e-12) delete formed[key]
  return formed
}

function kspEquilibrium(contents, formed) {
  const V = aqueousLitres(contents)
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
      // log Q falls as more solid forms: root of −trial on [lo, hi] (trial(lo) > 0 checked above).
      const fhi = -trial(hi)
      const xi = fhi > 0 ? rootUp(x => -trial(x), lo, hi, -trial(lo), fhi, (hi - lo) * 1e-14) : hi
      if (Math.abs(xi) > 1e-15) {
        shift(contents, ppt, key, xi)
        moved += Math.abs(xi)
        if (xi > 0) formed[key] = (formed[key] || 0) + xi
      }
    }
    if (moved < 1e-14) break
  }
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
  const rho = polarPhase(contents).density
  const order = [...nonAq.filter(k => LIQUIDS[k].density < rho), 'AQ', ...nonAq.filter(k => LIQUIDS[k].density >= rho)]
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
    // Indicators are dosed in drops; 1 unit = one 0.05 mL drop. The solvent is tracked: phenolphthalein and
    // universal indicator are made up in 50 % ethanol, litmus and methyl orange in water (school preparations).
    const eth = INDICATORS[reagent.indicator]?.ethanolFraction || 0
    if (eth < 1) parcel.liquids.water = mL * (1 - eth)
    if (eth > 0) parcel.liquids.ethanol = mL * eth
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
  const ionFormula = { I2: 'I2', 'Cu+': 'Cu', 'Na+': 'Na', 'K+': 'K', 'Ag+': 'Ag', 'Ba2+': 'Ba', 'Ca2+': 'Ca', 'Mg2+': 'Mg', 'Zn2+': 'Zn', 'Cu2+': 'Cu', 'Fe2+': 'Fe', 'Fe3+': 'Fe', 'Cl-': 'Cl', 'NO3-': 'NO3', 'I-': 'I', SO4: 'SO4', OAc: 'C2O2', NH3: 'N', CO3: 'CO3' }
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
