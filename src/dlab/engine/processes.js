// Per-step processes: transfer, kinetics, thermal, electrochemistry, physics and the visual fields.
// Everything here runs inside the fixed timestep, so results do not depend on the render frame rate.
import { EQUIPMENT, halfWidthAt, innerHeight, levelForVolume, retainedVolumeAtTilt } from '../data/equipment.js'
import { IONS, INDICATORS, PRECIPITATES, REAGENT_BY_ID, LIQUIDS, SALT_IONS, SOLUBILITY, solubilityAt, indicatorColor, mixRgb, FARADAY, HENRY_CO2, molarMass } from '../data/materials.js'
import { KINETIC, NO_REACTION, ELECTRO, UNSUPPORTED_HINTS, ION_HINTS, ION_E0, METAL_E0, ION_NAME } from '../data/reactions.js'
import { reagentParcel, aqueousLitres, totalVolumeML, solveH, mix, withdraw, equilibrate, liquidHeatCapacity, carbonicAcid, ionicStrength, emptyContents, scaleContents } from './chemistry.js'

export const ROOM_T = 25
export const GW = 10
export const GH = 14
const MAX_PARTICLES = 140
const MAX_BUBBLES = 90
const PARTICLE_MOL = 4e-6
const BUBBLE_MOL = 6e-7
const GLASS_CP = 0.84
const UA = 0.35 // W/K, heat loss to room for a bench vessel (illustrative)

export function rand(state) {
  state.rng = (state.rng + 0x6D2B79F5) >>> 0
  let t = state.rng
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export function log(state, text, kind = 'info') {
  state.log.push({ t: state.t, kind, text })
  if (state.log.length > 60) state.log.shift()
}

export function noteOnce(state, key, text, kind = 'observe') {
  if (state.notes[key]) return
  state.notes[key] = state.t
  log(state, text, kind)
}

export const isContainer = o => Boolean(o && EQUIPMENT[o.type]?.caps.includes('contain'))
export const byId = (state, id) => state.objects.find(o => o.id === id)

export function newVisual() {
  return { field: new Array(GW * GH).fill(0), base: null, prev: null, target: null, stir: 0, parts: [], bubbles: [], acc: {} }
}

export function volumeOf(c) {
  return totalVolumeML(c.contents)
}

export function surfaceY(c) {
  return c.y + levelForVolume(c.type, Math.min(volumeOf(c), EQUIPMENT[c.type].capacityML))
}

// Topmost upright container whose cavity holds the point.
export function containerAt(state, x, y, exclude = null) {
  for (let i = state.objects.length - 1; i >= 0; i -= 1) {
    const c = state.objects[i]
    if (!isContainer(c) || c.id === exclude || c.condition === 'UNUSABLE') continue
    if (Math.abs(c.angle) > 0.3) continue
    const def = EQUIPMENT[c.type]
    const ly = y - c.y
    if (ly < 0 || ly > def.h + 4) continue
    if (Math.abs(x - c.x) <= halfWidthAt(def, Math.min(ly, innerHeight(def)))) return c
  }
  return null
}

// Container whose opening a falling stream at x enters, below height y.
export function containerBelow(state, x, y, exclude) {
  let best = null
  for (const c of state.objects) {
    if (!isContainer(c) || c.id === exclude || c.condition === 'UNUSABLE' || Math.abs(c.angle) > 0.3) continue
    const def = EQUIPMENT[c.type]
    const rimY = c.y + def.h
    if (rimY > y + 2) continue
    if (Math.abs(x - c.x) > halfWidthAt(def, innerHeight(def))) continue
    if (!best || rimY > best.y + EQUIPMENT[best.type].h) best = c
  }
  return best
}

// ── Colour ────────────────────────────────────────────────────────────────
export function bulkColor(contents, pH) {
  const V = aqueousLitres(contents)
  let rgb = [222, 238, 250]
  let alpha = 0.18
  if (V > 0) {
    for (const [ion, mol] of Object.entries(contents.ions)) {
      const info = IONS[ion]
      if (!info?.color) continue
      const a = 1 - Math.exp(-info.colorPerM * mol / V)
      rgb = mixRgb(rgb, info.color, a)
      alpha = Math.max(alpha, 0.18 + 0.6 * a)
    }
    for (const [key, drops] of Object.entries(contents.indicators)) {
      if (!(drops > 0) || pH == null) continue
      const [r, g, b, a0] = indicatorColor(key, pH)
      const strength = (1 - Math.exp(-drops / (V * 1000) * 1.2)) * a0
      rgb = mixRgb(rgb, [r, g, b], strength)
      alpha = Math.max(alpha, 0.18 + 0.7 * strength)
    }
    let suspended = 0
    let pRgb = null
    for (const [key, mol] of Object.entries(contents.precipitates)) {
      if (mol <= 0) continue
      suspended += mol
      pRgb = pRgb ? mixRgb(pRgb, PRECIPITATES[key].color, 0.5) : PRECIPITATES[key].color
    }
    if (pRgb) {
      const a = 1 - Math.exp(-suspended / V * 40)
      rgb = mixRgb(rgb, pRgb, a * 0.55)
      alpha = Math.max(alpha, 0.18 + 0.5 * a)
    }
  }
  return [...rgb, alpha]
}

export function refreshDerived(c) {
  const V = aqueousLitres(c.contents)
  const h = V > 1e-6 ? solveH(c.contents.ions, V) : null
  c.pH = h ? -Math.log10(h) : null
  c.I = h ? ionicStrength(c.contents.ions, V, h) : 0
  const color = bulkColor(c.contents, c.pH)
  const vis = c.vis
  if (!vis.target) { vis.target = color; vis.prev = color }
  else vis.target = color
}

function cellAt(u, v) {
  const i = Math.max(0, Math.min(GW - 1, Math.floor((u + 1) / 2 * GW)))
  const j = Math.max(0, Math.min(GH - 1, Math.floor(v * GH)))
  return j * GW + i
}

// Tracer for colour mixing. A new discrete addition while the previous one is still mixing "bakes" the
// current per-cell colours as the new starting point; continuous inflow (pouring, reacting solids) accumulates.
function injectTracer(state, c, u, v, amount) {
  const vis = c.vis
  const f = vis.field
  let sum = 0
  let max = 0
  let min = Infinity
  for (const x of f) { sum += x; if (x > max) max = x; if (x < min) min = x }
  const mean = sum / f.length
  if (!(mean > 0) || max - min < 0.04 * mean) {
    vis.prev = mean > 0 ? vis.target : (vis.displayed || vis.target)
    vis.base = null
    f.fill(0)
  }
  else if (state.t - (vis.lastInject ?? -1) > 0.3) {
    vis.base = f.map((_, k) => cellColor(c, k, mean))
    f.fill(0)
  }
  vis.lastInject = state.t
  f[cellAt(u, v)] += amount
}

// ── Adding material ──────────────────────────────────────────────────────
export function addParcel(state, c, parcel, { u = 0, v = 1, T = ROOM_T } = {}) {
  const def = EQUIPMENT[c.type]
  const addVol = totalVolumeML(parcel)
  if (c.condition === 'UNUSABLE') { spill(state, parcel); return { spilled: addVol } }
  const before = volumeOf(c)
  // Thermal shock: hot, almost dry glass meeting cold liquid (educational rule).
  if (def.breakable && addVol > 0 && before < 5) {
    const limit = def.heatResistant ? 60 : 30
    if (Math.abs(c.T - T) > limit) damage(state, c, 'CRACKED', `Sốc nhiệt: ${def.name} đang ${c.T.toFixed(0)} °C gặp chất lỏng ${T.toFixed(0)} °C nên bị nứt.`)
  }
  const C1 = liquidHeatCapacity(c.contents) + def.glassMassG * GLASS_CP
  const C2 = liquidHeatCapacity(parcel)
  const result = mix(c.contents, parcel)
  const Ctot = C1 + C2
  if (Ctot > 0) c.T = (C1 * c.T + C2 * T + result.heatJ) / Ctot
  if (result.neutralised > 1e-5) noteOnce(state, `neutral-${c.id}`, `Phản ứng trung hòa trong ${label(c)}: H⁺ + OH⁻ → H₂O, tỏa nhiệt.`)
  for (const [key, mol] of Object.entries(result.formed)) {
    spawnParticles(state, c, key, mol, u, v)
    noteOnce(state, `ppt-${key}-${c.id}`, `Xuất hiện kết tủa ${PRECIPITATES[key].formula} (${PRECIPITATES[key].name}) trong ${label(c)}.`)
  }
  injectTracer(state, c, u, v, Math.max(0.2, addVol))
  refreshDerived(c)
  overflow(state, c)
  return { heatJ: result.heatJ, formed: result.formed }
}

function overflow(state, c) {
  const cap = EQUIPMENT[c.type].capacityML
  const vol = volumeOf(c)
  if (vol > cap + 1e-9) {
    spill(state, withdraw(c.contents, vol - cap, settledFraction(c)))
    noteOnce(state, `overflow-${c.id}-${Math.floor(state.t)}`, `${label(c)} bị tràn: chất lỏng chảy ra bàn.`, 'warn')
    refreshDerived(c)
  }
}

export function spill(state, parcel) {
  const vol = totalVolumeML(parcel)
  for (const group of ['liquids', 'ions', 'indicators', 'precipitates']) {
    for (const [k, v] of Object.entries(parcel[group])) state.spill.contents[group][k] = (state.spill.contents[group][k] || 0) + v
  }
  state.spill.mL += vol
}

const SHORT = { beaker100: 'Cốc', beaker250: 'Cốc', testTube: 'Ống nghiệm', flask: 'Bình tam giác', cylinder: 'Ống đong', dish: 'Chậu', evaporating: 'Bát sứ' }
export function label(o) {
  if (o.label) return o.label
  if (o.code && SHORT[o.type]) return `${SHORT[o.type]} ${o.code}`
  return EQUIPMENT[o.type]?.name || o.type
}

export function settledFraction(c) {
  const parts = c.vis.parts
  if (!parts.length) return 0
  return parts.filter(p => p.settled).length / parts.length
}

function spawnParticles(state, c, key, mol, u, v) {
  const n = Math.min(60, Math.max(1, Math.round(mol / PARTICLE_MOL)))
  for (let i = 0; i < n && c.vis.parts.length < MAX_PARTICLES; i += 1) {
    // Grains appear as a cloud along the plume of the added reagent, not on one line.
    c.vis.parts.push({ key, u: Math.max(-0.95, Math.min(0.95, u + (rand(state) - 0.5) * 1.1)), v: Math.max(0.02, v - rand(state) * 0.55), settled: false, s: 0.6 + rand(state) * 0.8 })
  }
}

// ── Damage ────────────────────────────────────────────────────────────────
const SEVERITY = { NORMAL: 0, WARNING: 1, CRACKED: 2, UNUSABLE: 3 }
export function damage(state, o, level, reason) {
  if (SEVERITY[level] <= SEVERITY[o.condition]) return
  o.condition = level
  o.damageReason = reason
  log(state, reason, level === 'WARNING' ? 'warn' : 'danger')
  if (level === 'UNUSABLE' && isContainer(o)) {
    spill(state, withdraw(o.contents, volumeOf(o), 0))
    for (const s of state.objects) if (s.type === 'solid' && s.in === o.id) { s.in = null; s.y = 0 }
    o.vis.parts = []
    o.vis.bubbles = []
    refreshDerived(o)
  }
}

// ── Transfer helpers used by commands ────────────────────────────────────
export function transfer(state, from, to, mL, entry) {
  const parcel = takeFrom(state, from, mL)
  if (!to) { spill(state, parcel); return parcel }
  addParcel(state, to, parcel, { ...entry, T: from.T ?? ROOM_T })
  return parcel
}

export function takeFrom(state, from, mL) {
  const parcel = withdraw(from.contents, mL, isContainer(from) ? settledFraction(from) : 0)
  if (isContainer(from)) {
    const removedPpt = Object.values(parcel.precipitates).reduce((s, v) => s + v, 0)
    if (removedPpt > 0) trimParticles(from)
    refreshDerived(from)
  }
  return parcel
}

function trimParticles(c) {
  const total = Object.values(c.contents.precipitates).reduce((s, v) => s + v, 0)
  const target = Math.min(MAX_PARTICLES, Math.round(total / PARTICLE_MOL))
  while (c.vis.parts.length > target) {
    const idx = c.vis.parts.findIndex(p => !p.settled)
    c.vis.parts.splice(idx >= 0 ? idx : c.vis.parts.length - 1, 1)
  }
}

// Dissolved species the model cannot react: say so once per vessel instead of showing nothing.
function ionHints(state, c) {
  let pH
  const has = k => (c.contents.ions[k] || 0) > 1e-7 || Object.entries(c.contents.precipitates).some(([key, mol]) => mol > 1e-7 && PRECIPITATES[key]?.cation === k)
  for (const r of ION_HINTS) {
    if (!r.all.every(has)) continue
    if (state.notes[`ionhint-${r.all.join('+')}-${c.id}`] != null) continue
    if (r.minPH != null) {
      const V = aqueousLitres(c.contents)
      if (V < 1e-6) continue
      pH ??= -Math.log10(solveH(c.contents.ions, V))
      if (!(pH >= r.minPH)) continue
    }
    noteOnce(state, `ionhint-${r.all.join('+')}-${c.id}`, `Chưa hỗ trợ mô phỏng phản ứng này: ${r.reason}`, 'warn')
  }
}

// Gas leaving a vessel: counted for the whole bench and for the vessel it came from, so a guided step
// can ask "did THIS vessel give off H₂" instead of reading a bench-wide total.
export function releaseGas(state, c, gas, mol) {
  state.gas[gas] = (state.gas[gas] || 0) + mol
  c.gasOut = c.gasOut || {}
  c.gasOut[gas] = (c.gasOut[gas] || 0) + mol
}

// ── Solids ───────────────────────────────────────────────────────────────
// Reacting area (cm²). A ribbon keeps its face area while it thins; a wire/nail thins radially;
// granules and powder shrink as spheres. Shape-based educational approximation.
export function solidArea(s) {
  const r = REAGENT_BY_ID[s.reagent]
  const m = Math.max(0, s.massG)
  const m0 = Math.max(m, s.mass0 || m)
  if (m <= 0) return 0
  const V0 = m0 / r.density
  if (r.shape === 'ribbon') return 2 * V0 / 0.02
  if (r.shape === 'cylinder') return 2 * V0 / 0.12 * Math.sqrt(m / m0)
  if (r.shape === 'powder') return 3 * V0 / 0.03 * (m / m0) ** (2 / 3)
  const rad = Math.cbrt(3 * (m / r.density) / (4 * Math.PI))
  return 4 * Math.PI * rad * rad
}

// How covered a piece looks (0–1): deposited metal per cm² of the piece's original surface, i.e. layer
// thickness — not the total amount, so a small nail with the same layer looks just as coated as a large one.
// Full colour at the layer the default 2 g nail had with 1.5 mmol (the earlier absolute scale), so the
// default nail looks and completes exactly as before. Educational approximation of a visible coating.
let coatFull = 0
export function coatCoverage(s) {
  const coat = Object.values(s.coat || {}).reduce((a, b) => a + b, 0)
  if (!(coat > 0)) return 0
  coatFull ||= 1.5e-3 / solidArea({ reagent: 'fe', massG: 2, mass0: 2 })
  const m0 = Math.max(s.mass0 || 0, s.massG || 0)
  const area0 = solidArea({ reagent: s.reagent, massG: m0, mass0: m0 })
  return Math.min(1, coat / (coatFull * Math.max(1e-6, area0)))
}

export function solidRadiusMM(s) {
  const r = REAGENT_BY_ID[s.reagent]
  const V = Math.max(0, s.massG) / r.density
  return Math.max(0.6, Math.cbrt(3 * V / (4 * Math.PI)) * 10)
}

function liquidDensity(contents) {
  let m = 0
  let v = 0
  for (const [k, mL] of Object.entries(contents.liquids)) { m += mL * LIQUIDS[k].density; v += mL }
  return v > 0 ? m / v : 0
}

function stepSolid(state, s, c, h) {
  const reagent = REAGENT_BY_ID[s.reagent]
  const def = EQUIPMENT[c.type]
  const vol = volumeOf(c)
  const level = levelForVolume(c.type, vol)
  const rho = liquidDensity(c.contents)
  const floats = vol > 0.5 && reagent.density < rho
  const rad = solidRadiusMM(s)
  const hw = Math.max(1, halfWidthAt(def, Math.max(0, s.ly)) - rad)
  // Vertical: float at the surface or sink to the bottom (simple damped motion).
  const targetY = floats ? Math.max(0, level - rad * 0.6) : 0
  s.vy += ((targetY - s.ly) * 30 - s.vy * 8) * h
  s.ly += s.vy * h
  if (s.ly < 0) { s.ly = 0; s.vy = 0 }
  s.vx *= Math.exp(-2 * h)
  s.lx += s.vx * h
  if (s.lx > hw) { s.lx = hw; s.vx = -Math.abs(s.vx) * 0.7 }
  if (s.lx < -hw) { s.lx = -hw; s.vx = Math.abs(s.vx) * 0.7 }
  if (vol < 0.05 || s.massG <= 0) return
  const submerged = s.ly < level + 1
  if (!submerged) return
  if (reagent.dissolves) return stepDissolve(state, s, c, h)
  stepKinetics(state, s, c, h, rad, level)
}

function stepDissolve(state, s, c, h) {
  const key = REAGENT_BY_ID[s.reagent].dissolves
  const sol = SOLUBILITY[key]
  const waterG = (c.contents.liquids.water || 0) * LIQUIDS.water.density
  if (waterG < 0.05) return
  const M = molarMass(sol.formula)
  const dissolvedG = Math.min(...Object.entries(SALT_IONS[key]).map(([ion, n]) => (c.contents.ions[ion] || 0) / n)) * M
  const sat = solubilityAt(key, c.T) * waterG / 100
  const driving = 1 - dissolvedG / sat
  const k = 2e-4 * (1 + 3 * c.vis.stir) * 2 ** ((c.T - ROOM_T) / 10)
  let dn = k * solidArea(s) * driving * h
  dn = Math.max(Math.min(dn, s.massG / M), -dissolvedG / M)
  if (dn > 0) {
    s.massG -= dn * M
    for (const [ion, n] of Object.entries(SALT_IONS[key])) c.contents.ions[ion] = (c.contents.ions[ion] || 0) + n * dn
    c.dirty = true
    injectTracer(state, c, s.lx / Math.max(1, halfWidthAt(EQUIPMENT[c.type], 0)), 0.05, dn * 400)
    noteOnce(state, `dissolve-${s.id}`, `${REAGENT_BY_ID[s.reagent].name} đang tan dần trong ${label(c)}.`)
    if (s.massG < 1e-6) { s.massG = 0; noteOnce(state, `dissolved-${s.id}`, `${REAGENT_BY_ID[s.reagent].name} đã tan hết.`) }
  }
  else if (dn < 0 && sol.counter !== 'CO3') {
    // Supersaturated: the crystal grows back (crystallisation).
    s.massG -= dn * M
    for (const [ion, n] of Object.entries(SALT_IONS[key])) c.contents.ions[ion] = Math.max(0, (c.contents.ions[ion] || 0) + n * dn)
    c.dirty = true
    noteOnce(state, `crystal-${s.id}`, `Tinh thể ${sol.formula} kết tinh trở lại vì dung dịch quá bão hòa.`)
  }
}

export function crystallize(state, c, h) {
  const waterG = (c.contents.liquids.water || 0) * LIQUIDS.water.density
  for (const [key, sol] of Object.entries(SOLUBILITY)) {
    const counter = sol.counter
    if (counter === 'CO3') continue // total carbonate is not bicarbonate: boiling Na₂CO₃ must not crystallise NaHCO₃
    const n = Math.min((c.contents.ions[sol.ion] || 0) / SALT_IONS[key][sol.ion], (c.contents.ions[counter] || 0) / SALT_IONS[key][counter])
    if (!(n > 0)) continue
    const M = molarMass(sol.formula)
    const sat = waterG > 0.05 ? solubilityAt(key, c.T) * waterG / 100 : 0
    if (n * M <= sat * 1.02) continue
    const has = state.objects.some(o => o.type === 'solid' && o.in === c.id && REAGENT_BY_ID[o.reagent].dissolves === key && o.massG > 0)
    if (has) continue
    // Nucleation: seed a crystal; growth continues in stepDissolve.
    const reagentId = Object.values(REAGENT_BY_ID).find(r => r.dissolves === key)?.id
    if (!reagentId) continue
    const seed = Math.min(n * M - sat, 0.01)
    const dn = seed / M
    for (const [ion, k] of Object.entries(SALT_IONS[key])) c.contents.ions[ion] = Math.max(0, c.contents.ions[ion] - k * dn)
    state.objects.push({ id: `o${state.nextId++}`, type: 'solid', reagent: reagentId, massG: seed, mass0: seed, in: c.id, lx: (rand(state) - 0.5) * 10, ly: 0, vx: 0, vy: 0, x: c.x, y: c.y, angle: 0, condition: 'NORMAL', coat: {} })
    noteOnce(state, `nucleate-${key}-${c.id}`, `Tinh thể ${sol.formula} xuất hiện trong ${label(c)} (dung dịch quá bão hòa).`)
    c.dirty = true
  }
}

function stepKinetics(state, s, c, h, rad, level) {
  const V = aqueousLitres(c.contents)
  if (V < 1e-6) return
  const hConc = solveH(c.contents.ions, V)
  const stirBoost = 1 + c.vis.stir
  const tempBoost = 2 ** ((c.T - ROOM_T) / 10)
  const area = solidArea(s)
  const present = Object.keys(c.contents.ions).filter(k => c.contents.ions[k] > 1e-7)
  const pHnow = -Math.log10(hConc)
  const hintFirst = UNSUPPORTED_HINTS.find(r => r.all.every(k => present.includes(k) || k === s.reagent) && !(r.maxPH < pHnow) && !(r.minPH > pHnow))
  if (hintFirst) {
    c.unsupported = hintFirst.reason
    noteOnce(state, `unsup-${s.reagent}-${c.id}`, `Chưa hỗ trợ mô phỏng phản ứng này: ${hintFirst.reason}`, 'warn')
    return
  }
  let anyRule = false
  for (const rule of KINETIC) {
    if (rule.solid !== s.reagent) continue
    let driver
    if (rule.driver === 'h') driver = hConc
    else if (rule.driver === 'water') driver = (c.contents.liquids.water || 0) > 0.05 ? 1 : 0
    else driver = (c.contents.ions[rule.driver] || 0) / V
    // Acid attack on metals is modelled for dilute acids (pH < 3); hydrolysed salt solutions do not count.
    if (rule.driver === 'h' && driver < 1e-3) continue
    if (!(driver > 0)) continue
    if (rule.nitrateUnsupported && (c.contents.ions['NO3-'] || 0) / V > 0.01 && hConc > 1e-3) {
      c.unsupported = 'Kim loại với HNO₃ không giải phóng H₂ mà tạo NOx — phản ứng này chưa được mô hình hóa.'
      noteOnce(state, `unsupported-hno3-${c.id}`, c.unsupported, 'warn')
      continue
    }
    anyRule = true
    let xi = rule.k * area * driver * stirBoost * tempBoost * h
    xi = Math.min(xi, s.massG / REAGENT_BY_ID[s.reagent].molarMass)
    // Acid attack cannot use more H⁺ than is free in one step (a hot, small volume used to overshoot to pH 13).
    if (rule.driver === 'h') xi = Math.min(xi, 0.5 * hConc * V / Object.entries(rule.gives || {}).reduce((z, [ion, n]) => z + n * (IONS[ion]?.z || 1), 0))
    for (const [ion, n] of Object.entries(rule.consumes || {})) xi = Math.min(xi, (c.contents.ions[ion] || 0) / n)
    if (!(xi > 0)) continue
    s.massG -= xi * REAGENT_BY_ID[s.reagent].molarMass
    for (const [ion, n] of Object.entries(rule.consumes || {})) c.contents.ions[ion] -= n * xi
    for (const [ion, n] of Object.entries(rule.gives || {})) c.contents.ions[ion] = (c.contents.ions[ion] || 0) + n * xi
    for (const [metal, n] of Object.entries(rule.deposit || {})) s.coat[metal] = (s.coat[metal] || 0) + n * xi
    const Ctot = liquidHeatCapacity(c.contents) + EQUIPMENT[c.type].glassMassG * GLASS_CP
    if (Ctot > 0) c.T += -rule.dH * xi / Ctot
    const u = s.lx / Math.max(1, halfWidthAt(EQUIPMENT[c.type], 0))
    const v = Math.min(1, s.ly / Math.max(1, level))
    for (const [gas, n] of Object.entries(rule.gas || {})) {
      releaseGas(state, c, gas, n * xi)
      emitBubbles(state, c, gas, n * xi, u, v)
    }
    if (rule.moves && s.ly > 0) {
      // Uneven gas release pushes a floating piece around the surface.
      const push = Math.min(80, (xi / h) / 1e-4 * 18)
      s.vx += (rand(state) - 0.5) * push
    }
    injectTracer(state, c, u, v, xi * 2000)
    c.dirty = true
    c.activeReactions[rule.id] = state.t
    noteOnce(state, `rx-${rule.id}-${c.id}`, `${rule.equation} — ${rule.observe}`)
    if (s.massG < 1e-6) {
      s.massG = 0
      noteOnce(state, `done-${rule.id}-${s.id}`, `${REAGENT_BY_ID[s.reagent].name} đã phản ứng hết.`)
    }
  }
  if (!anyRule && !c.unsupported) {
    const drivers = Object.keys(c.contents.ions).filter(k => c.contents.ions[k] > 0)
    const no = NO_REACTION.find(r => r.solid === s.reagent && (r.driver === 'h' ? hConc > 1e-3 : drivers.includes(r.driver)))
    const hint = UNSUPPORTED_HINTS.find(r => r.all.every(k => drivers.includes(k) || k === s.reagent) && !(r.maxPH < -Math.log10(hConc)) && !(r.minPH > -Math.log10(hConc)))
    if (no && !hint) noteOnce(state, `norx-${s.reagent}-${c.id}`, `Không có phản ứng: ${no.reason}`, 'info')
    if (hint) { c.unsupported = hint.reason; noteOnce(state, `unsup-${s.reagent}-${c.id}`, `Chưa có mô hình: ${hint.reason}`, 'warn') }
    // Any other metal + metal-ion pair: classified by E°, never silently ignored or given a guessed product.
    const Em = METAL_E0[s.reagent]
    const M = REAGENT_BY_ID[s.reagent].formula
    for (const ion of Em == null || no || hint ? [] : drivers.filter(d => ION_E0[d] != null && d !== `${M}2+` && d !== `${M}+`)) {
      if (KINETIC.some(r => r.solid === s.reagent && r.driver === ion)) continue
      if (ION_E0[ion] < Em) noteOnce(state, `norx-${s.reagent}-${ion}-${c.id}`, `Không có phản ứng: ${M} yếu hơn kim loại của ion ${ION_NAME[ion]} (E° ${ION_E0[ion].toFixed(2)} V < ${Em.toFixed(2)} V) nên không khử được ${ION_NAME[ion]}.`, 'info')
      else {
        c.unsupported = `${M} + ${ION_NAME[ion]}: theo dãy hoạt động có phản ứng (E° ${ION_E0[ion].toFixed(2)} V > ${Em.toFixed(2)} V) nhưng chưa được mô hình hóa định lượng.`
        noteOnce(state, `unsup-${s.reagent}-${ion}-${c.id}`, `Chưa hỗ trợ mô phỏng phản ứng này: ${c.unsupported}`, 'warn')
      }
    }
  }
}

function emitBubbles(state, c, gas, mol, u, v) {
  const vis = c.vis
  vis.acc[gas] = (vis.acc[gas] || 0) + mol
  while (vis.acc[gas] >= BUBBLE_MOL) {
    vis.acc[gas] -= BUBBLE_MOL
    if (vis.bubbles.length >= MAX_BUBBLES) continue
    vis.bubbles.push({ gas, u: Math.max(-0.95, Math.min(0.95, u + (rand(state) - 0.5) * 0.25)), v: Math.max(0, v), r: 0.8 + rand(state) * 1.4 })
  }
}

// ── Electrochemistry ─────────────────────────────────────────────────────
export function stepElectro(state, h) {
  for (const p of state.objects) {
    if (p.type !== 'power') continue
    p.current = 0
    const wire = state.wires.find(w => w.from === p.id)
    const el = wire && byId(state, wire.to)
    if (!p.on || !el) { p.status = p.on ? 'Chưa nối dây tới điện cực.' : 'Đang tắt.'; continue }
    const c = containerAt(state, el.x, el.y + 2)
    if (!c || surfaceY(c) < el.y + 4) { p.status = 'Điện cực chưa nhúng vào dung dịch.'; continue }
    const V = aqueousLitres(c.contents)
    const cu = c.contents.ions['Cu2+'] || 0
    const cl = c.contents.ions['Cl-'] || 0
    if (!(cu > 1e-7 && cl > 1e-7)) {
      p.status = cu > 0 || cl > 0 ? 'Đã hết Cu²⁺ hoặc Cl⁻: giai đoạn điện phân nước chưa được mô hình hóa, dòng điện ngừng.' : 'Hệ điện phân này chưa được mô hình hóa (mô hình hỗ trợ dung dịch CuCl₂).'
      continue
    }
    const e = ELECTRO.electrolysisCuCl2
    const I = Math.max(0, (p.volts - e.decomposition - e.overpotential) / e.resistance)
    p.current = I
    p.status = I > 0 ? `Đang điện phân, I = ${I.toFixed(2)} A.` : `Hiệu điện thế chưa đủ để điện phân (cần > ${(e.decomposition + e.overpotential).toFixed(2)} V).`
    if (!(I > 0) || V <= 0) continue
    let ne = I * h / FARADAY
    ne = Math.min(ne, cu * 2, cl)
    c.contents.ions['Cu2+'] = cu - ne / 2
    c.contents.ions['Cl-'] = cl - ne
    el.cuDeposit = (el.cuDeposit || 0) + ne / 2
    releaseGas(state, c, 'Cl2', ne / 2)
    el.charge = (el.charge || 0) + ne * FARADAY
    const hw = Math.max(1, halfWidthAt(EQUIPMENT[c.type], 0))
    emitBubbles(state, c, 'Cl2', ne / 2, (el.x + 10 - c.x) / hw, Math.max(0, (el.y - c.y) / Math.max(1, surfaceY(c) - c.y)))
    c.dirty = true
    c.activeReactions.electrolysis = state.t
    noteOnce(state, `electro-${c.id}`, `${e.equation}: kim loại đồng bám ở catot, khí Cl₂ màu vàng lục thoát ra ở anot.`)
  }
  for (const m of state.objects) {
    if (m.type !== 'voltmeter') continue
    m.reading = null
    const leads = state.wires.filter(w => w.from === m.id).map(w => byId(state, w.to)).filter(Boolean)
    if (leads.length < 2) { m.status = 'Nối hai dây của vôn kế vào hai điện cực kim loại.'; continue }
    const cells = leads.map(s => (s.type === 'solid' && s.in ? { s, c: byId(state, s.in) } : null))
    if (cells.some(x => !x)) { m.status = 'Dây phải nối vào thanh kim loại đang nhúng trong dung dịch.'; continue }
    const bridge = state.objects.find(b => b.type === 'bridge' && b.links?.length === 2 && cells.every(x => b.links.includes(x.c.id)))
    if (!bridge) { m.reading = 0; m.status = 'Mạch hở: chưa có cầu muối nối hai dung dịch.'; continue }
    const zn = cells.find(x => x.s.reagent === 'zn')
    const cu = cells.find(x => x.s.reagent === 'cu')
    if (!zn || !cu || zn.c.id === cu.c.id) { m.status = 'Mô hình hỗ trợ pin Zn–Cu (Daniell).'; continue }
    const Vz = aqueousLitres(zn.c.contents)
    const Vc = aqueousLitres(cu.c.contents)
    const cZn = (zn.c.contents.ions['Zn2+'] || 0) / Vz
    const cCu = (cu.c.contents.ions['Cu2+'] || 0) / Vc
    if (!(cZn > 0) || !(cCu > 0)) { m.reading = 0; m.status = 'Cần dung dịch Zn²⁺ quanh thanh Zn và Cu²⁺ quanh thanh Cu.'; continue }
    const E = ELECTRO.daniell.E0 - 0.05916 / ELECTRO.daniell.n * Math.log10(cZn / cCu)
    m.reading = E
    m.status = `Pin Zn–Cu: E = ${E.toFixed(3)} V (Nernst, 25 °C).`
    noteOnce(state, `daniell-${m.id}`, `Pin điện hóa Zn–Cu: vôn kế chỉ ≈ ${E.toFixed(2)} V. Zn là cực âm, Cu là cực dương.`)
  }
}

// ── Main per-container step ──────────────────────────────────────────────
export function stepContainer(state, c, h) {
  const def = EQUIPMENT[c.type]
  const vis = c.vis
  ionHints(state, c)
  // Pouring by tilt: liquid above what the tilted vessel can retain flows over the lower lip.
  if (Math.abs(c.angle) > 0.05 && c.condition !== 'UNUSABLE') {
    const vol = volumeOf(c)
    const keep = retainedVolumeAtTilt(c.type, c.angle)
    const excess = vol - keep
    if (excess > 0.001) {
      const flow = Math.min(excess * (1 - Math.exp(-h / 0.35)), 45 * h)
      const lip = lipPoint(c)
      const target = containerBelow(state, lip.x, lip.y, c.id)
      const parcel = takeFrom(state, c, flow)
      if (target) {
        const tdef = EQUIPMENT[target.type]
        addParcel(state, target, parcel, { u: (lip.x - target.x) / Math.max(1, halfWidthAt(tdef, innerHeight(tdef))), v: 1, T: c.T })
      }
      else spill(state, parcel)
      state.streams.push({ from: c.id, x: lip.x, y0: lip.y, y1: target ? surfaceY(target) : 0, rate: flow / h, color: vis.target || [200, 220, 240, 0.3], to: target?.id || null })
      if (c.stock && volumeOf(c) < 30) refillStock(state, c)
    }
  }
  if (c.condition === 'CRACKED' && volumeOf(c) > 0) {
    spill(state, withdraw(c.contents, Math.min(volumeOf(c), 0.25 * h), settledFraction(c)))
    c.dirty = true
  }
  // CO₂ escapes when H₂CO₃* exceeds its 1 atm solubility (effervescence).
  const V = aqueousLitres(c.contents)
  if (V > 1e-6 && (c.contents.ions.CO3 || 0) > 0) {
    const hC = solveH(c.contents.ions, V)
    const h2co3 = carbonicAcid(c.contents, hC, V)
    const sat = c.co2Feed ? HENRY_CO2 : HENRY_CO2 * 0.9
    if (h2co3 > sat) {
      const dn = Math.min((h2co3 - sat) * V * (1 - Math.exp(-h * (2 + 4 * vis.stir))), c.contents.ions.CO3)
      c.contents.ions.CO3 -= dn
      releaseGas(state, c, 'CO2', dn)
      emitBubbles(state, c, 'CO2', dn, (rand(state) - 0.5) * 1.6, rand(state) * 0.6)
      c.dirty = true
      if (dn > 1e-7) { c.activeReactions.co2 = state.t; noteOnce(state, `co2-${c.id}`, `Sủi bọt khí CO₂ không màu trong ${label(c)}.`) }
    }
  }
  if (c.co2Feed && V > 1e-6) {
    const feed = 2e-5 * h
    c.contents.ions.CO3 = (c.contents.ions.CO3 || 0) + feed
    state.co2Used = (state.co2Used || 0) + feed
    emitBubbles(state, c, 'CO2', feed * 0.3, 0, 0.05)
    c.dirty = true
  }
  // Heating, cooling and boiling.
  const burner = state.objects.find(b => b.type === 'burner' && b.on && Math.abs(b.x - c.x) < EQUIPMENT.burner.w / 2 && Math.abs(c.y - (b.y + EQUIPMENT.burner.h)) < 4)
  const Cliq = liquidHeatCapacity(c.contents)
  const C = Cliq + def.glassMassG * GLASS_CP
  let P = burner ? burner.power * 0.5 : 0
  P -= UA * (c.T - ROOM_T)
  c.T += P * h / C
  const water = c.contents.liquids.water || 0
  if (water > 0 && c.T > 100) {
    const excessJ = (c.T - 100) * C
    const evapG = Math.min(water * LIQUIDS.water.density, excessJ / 2257)
    c.contents.liquids.water = water - evapG / LIQUIDS.water.density
    c.T = 100 + (excessJ - evapG * 2257) / C
    state.steam = (state.steam || 0) + evapG
    if (evapG > 0) { c.boiling = state.t; emitBubbles(state, c, 'steam', evapG / 18 * 0.3, (rand(state) - 0.5) * 1.4, 0.02); c.dirty = true }
    noteOnce(state, `boil-${c.id}`, `Nước trong ${label(c)} sôi ở 100 °C và bay hơi.`)
  }
  if (volumeOf(c) < 0.05 && burner && def.breakable && c.T > 300) damage(state, c, 'WARNING', `${def.name} bị đun khô ở ${c.T.toFixed(0)} °C — nguy cơ nứt vỡ khi gặp chất lỏng lạnh.`)
  if (burner && c.condition === 'CRACKED') damage(state, c, 'UNUSABLE', `${def.name} đã nứt lại bị đun nóng nên vỡ — không còn sử dụng được.`)
  if (volumeOf(c) < 0.02 && water > 0) crystallizeDry(state, c)
  crystallize(state, c, h)
  // Solids inside.
  for (const s of state.objects) if (s.type === 'solid' && s.in === c.id) stepSolid(state, s, c, h)
  if (c.dirty && state.step % 6 === 0) {
    const formed = equilibrate(c.contents)
    for (const [key, mol] of Object.entries(formed)) {
      const src = c.lastSource || { u: 0, v: 0.5 }
      spawnParticles(state, c, key, mol, src.u, src.v)
      noteOnce(state, `ppt-${key}-${c.id}`, `Xuất hiện kết tủa ${PRECIPITATES[key].formula} (${PRECIPITATES[key].name}) trong ${label(c)}.`)
    }
    refreshDerived(c)
    trimParticles(c)
    c.dirty = false
  }
  stepVisual(state, c, h)
}

function crystallizeDry(state, c) {
  // Evaporated to dryness: dissolved ions become a residue on the bottom (reported, not modelled further).
  const ions = Object.entries(c.contents.ions).filter(([, v]) => v > 0)
  if (!ions.length) return
  c.residue = { ...(c.residue || {}) }
  for (const [ion, mol] of ions) { c.residue[ion] = (c.residue[ion] || 0) + mol; delete c.contents.ions[ion] }
  noteOnce(state, `dry-${c.id}`, `${label(c)} đã cạn: còn lại chất rắn kết tinh ở đáy.`)
  c.dirty = true
}

function refillStock(state, c) {
  const reagent = REAGENT_BY_ID[c.reagent]
  const parcel = reagentParcel(reagent, EQUIPMENT[c.type].capacityML * 0.8)
  c.contents = parcel
  refreshDerived(c)
}

export function lipPoint(c) {
  const def = EQUIPMENT[c.type]
  const side = Math.sign(c.angle) || 1
  const rim = halfWidthAt(def, innerHeight(def)) + 3
  const px = c.x
  const py = c.y + def.h / 2
  const lx = side * rim
  const ly = def.h / 2
  const a = -c.angle
  return { x: px + lx * Math.cos(a) - ly * Math.sin(a), y: py + lx * Math.sin(a) + ly * Math.cos(a) }
}

function stepVisual(state, c, h) {
  const vis = c.vis
  vis.stir *= Math.exp(-h / 1.6)
  const alpha = Math.min(0.24, (0.9 + 70 * vis.stir) * h)
  const f = vis.field
  if (alpha > 0) {
    const next = f.slice()
    for (let j = 0; j < GH; j += 1) {
      for (let i = 0; i < GW; i += 1) {
        const k = j * GW + i
        let lap = 0
        if (i > 0) lap += f[k - 1] - f[k]
        if (i < GW - 1) lap += f[k + 1] - f[k]
        if (j > 0) lap += f[k - GW] - f[k]
        if (j < GH - 1) lap += f[k + GW] - f[k]
        next[k] = f[k] + alpha * lap
      }
    }
    vis.field = next
  }
  const total = Math.max(0.01, volumeOf(c))
  for (const p of vis.parts) {
    if (vis.stir > 0.25 && p.settled && rand(state) < vis.stir * h * 3) { p.settled = false; p.v = 0.1 + rand(state) * 0.6; p.u = (rand(state) - 0.5) * 1.8 }
    if (p.settled) continue
    const swirl = vis.stir * 0.8
    p.u += (rand(state) - 0.5) * (0.05 + swirl) * h * 6
    p.u = Math.max(-0.95, Math.min(0.95, p.u))
    // Settling speed scales with particle density; stirring keeps particles suspended.
    const ppt = PRECIPITATES[p.key]
    p.v -= (0.012 * (ppt ? ppt.density / 3 : 1) * p.s - swirl * 0.06) * h * 2
    if (p.v > 0.98) p.v = 0.98
    if (p.v <= 0.01) { p.v = 0.005 + rand(state) * 0.02; p.settled = true }
  }
  for (const b of vis.bubbles) {
    b.v += (0.45 + b.r * 0.12) * h * (40 / Math.max(10, levelForVolume(c.type, total)))
    b.u += (rand(state) - 0.5) * 0.04
    b.r *= 1 + 0.06 * h
  }
  vis.bubbles = vis.bubbles.filter(b => b.v < 1)
  // Remember what is shown so a new episode starts from the visible colour.
  if (vis.target) {
    const acc = [0, 0, 0, 0]
    const m = fieldMean(c)
    for (let k = 0; k < f.length; k += 1) { const col = cellColor(c, k, m); for (let i = 0; i < 4; i += 1) acc[i] += col[i] }
    vis.displayed = acc.map(x => x / f.length)
  }
}

export function mixRgba(a, b, t) {
  return [0, 1, 2, 3].map(i => a[i] + (b[i] - a[i]) * t)
}

// Local colour: t = local tracer / mean. t ≤ 1 blends towards the mixed colour; t > 1 extrapolates the
// colour change (low-absorbance Beer–Lambert is ~linear), so a concentrated drop looks stronger at its contact point.
export function fieldMean(c) {
  let sum = 0
  for (const x of c.vis.field) sum += x
  return sum / c.vis.field.length
}

export function cellColor(c, k, mean = fieldMean(c)) {
  const vis = c.vis
  const f = vis.field
  const base = vis.base ? vis.base[k] : vis.prev
  if (!(mean > 0) || !base) return vis.target
  const t = f[k] / mean
  if (t <= 1) return mixRgba(base, vis.target, t)
  const diff = [0, 1, 2].map(i => vis.target[i] - base[i])
  const span = Math.max(1e-6, ...diff.map(Math.abs))
  const factor = Math.min(t, Math.max(1, 140 / span))
  const rgb = diff.map((d, i) => Math.max(0, Math.min(255, base[i] + d * factor)))
  const alpha = Math.min(0.92, Math.max(0, base[3] + (vis.target[3] - base[3]) * factor) + Math.min(0.5, span * factor / 300))
  return [...rgb, alpha]
}

// ── Tools in liquids ─────────────────────────────────────────────────────
export function stepTools(state, h) {
  for (const o of state.objects) {
    if (o.type === 'litmusPaper') stepLitmus(state, o, h)
    if (o.type === 'rod') {
      const c = containerAt(state, o.x, o.y + 1)
      const last = o.last || { x: o.x, y: o.y }
      // Pointer strokes are summed by the controller (back-and-forth within one step must not cancel out).
      const dist = Math.max(o.stroke || 0, Math.hypot(o.x - last.x, o.y - last.y))
      o.stroke = 0
      o.last = { x: o.x, y: o.y }
      if (c && o.y < surfaceY(c)) {
        // Stirring scales with the path the rod sweeps through the liquid, so it does not depend on frame rate.
        c.vis.stir = Math.min(1.5, c.vis.stir + dist / 120)
        if (dist > 0.3) noteOnce(state, `stir-${c.id}`, `Khuấy ${label(c)} bằng đũa thủy tinh: dung dịch trộn đều nhanh hơn.`, 'info')
      }
    }
    if (o.type === 'thermometer' || o.type === 'phMeter') {
      const c = containerAt(state, o.x, o.y + 1)
      const wet = c && o.y < surfaceY(c)
      o.reading = o.type === 'thermometer' ? (wet ? c.T : ROOM_T) : (wet ? c.pH : null)
    }
  }
}

function stepLitmus(state, o, h) {
  const def = EQUIPMENT.litmusPaper
  const N = def.segments
  if (!o.seg) o.seg = Array.from({ length: N }, () => ({ wet: 0, rgb: INDICATORS.litmus.neutral.slice() }))
  const c = containerAt(state, o.x, o.y + 1)
  const surf = c ? surfaceY(c) : -Infinity
  const depth = surf - o.y
  if (c && depth > 0 && c.pH != null) {
    o.inside = c.id
    o.touched = o.touched || []
    if (!o.touched.includes(c.id)) o.touched.push(c.id)
    o.dipTime = (o.dipTime || 0) + h
    const wick = Math.min(8, 2.5 * Math.sqrt(o.dipTime))
    const target = indicatorColor('litmus', c.pH).slice(0, 3)
    for (let i = 0; i < N; i += 1) {
      const y = o.y + (i + 0.5) * def.h / N
      const seg = o.seg[i]
      let rate = 0
      if (y < surf) rate = 3
      else if (y < surf + wick) rate = 0.6
      if (rate > 0) {
        seg.wet = Math.min(1, seg.wet + rate * h)
        const k = 1 - Math.exp(-rate * h)
        seg.rgb = seg.rgb.map((x, j) => x + (target[j] - x) * k)
      }
    }
    noteOnce(state, `litmus-${o.id}-${c.id}`, `Nhúng giấy quỳ vào ${label(c)} (pH ≈ ${c.pH.toFixed(1)}): ${c.pH < 5 ? 'quỳ chuyển đỏ — môi trường axit' : c.pH > 8 ? 'quỳ chuyển xanh — môi trường bazơ' : 'quỳ không đổi màu — môi trường gần trung tính'}.`)
  }
  else {
    o.inside = null
    o.dipTime = 0
    for (const seg of o.seg) seg.wet = Math.max(0, seg.wet - 0.02 * h)
  }
}

// ── Drops and held solids in the air ─────────────────────────────────────
export function stepDrops(state, h) {
  const keep = []
  for (const d of state.drops) {
    d.vy -= 9810 * h
    d.y += d.vy * h * 0.12
    // The receiving vessel is fixed when the drop leaves the tip (it may fall deep into a narrow tube).
    if (d.target === undefined) d.target = containerBelow(state, d.x, d.y + 2)?.id || null
    const target = d.target && byId(state, d.target)
    if (target && d.y <= surfaceY(target)) {
      const tdef = EQUIPMENT[target.type]
      addParcel(state, target, d.parcel, { u: (d.x - target.x) / Math.max(1, halfWidthAt(tdef, innerHeight(tdef))), v: 1 })
      target.lastSource = { u: (d.x - target.x) / Math.max(1, halfWidthAt(tdef, innerHeight(tdef))), v: 1 }
      continue
    }
    if (d.y <= 0) { spill(state, d.parcel); continue }
    keep.push(d)
  }
  state.drops = keep
  for (const s of state.objects) {
    if (s.type !== 'solid' || s.in || s.holder) continue
    if (s.y > 0) {
      s.vy = (s.vy || 0) - 9810 * h * 0.12
      s.y += s.vy * h
      const c = containerBelow(state, s.x, s.y + 20)
      if (c && s.y <= c.y + EQUIPMENT[c.type].h) {
        s.in = c.id
        s.lx = s.x - c.x
        s.ly = Math.max(0, s.y - c.y)
        s.vy = 0
        s.vx = 0
        noteOnce(state, `drop-${s.id}`, `Thả ${REAGENT_BY_ID[s.reagent].name} vào ${label(c)}.`, 'info')
        if (volumeOf(c) > 0) injectTracer(state, c, 0, 1, 0.1)
      }
      else if (s.y <= 0) { s.y = 0; s.vy = 0 }
    }
  }
}

export { emptyContents, scaleContents }
