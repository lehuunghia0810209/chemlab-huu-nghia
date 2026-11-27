// Canonical scientific view of the laboratory state (Foundation). The engine state (sim.state) stays the single source
// of truth: amounts in mol, volumes in mL, temperatures in °C. This module only names and describes it:
//   SPECIES          — one registry of every species the engine tracks (id ≠ formula ≠ display name);
//   describe()       — the scientific state of one container, with units, for renderers, Guided, Sandbox and tests;
//   classifyNote()   — the standard outcome and process of an engine observation (used for state.events).
import { IONS, PRECIPITATES, LIQUIDS, GASES, molarMass } from '../data/materials.js'
import { MANIFEST } from '../data/manifest.js'
import { validationOf } from '../data/validation.js'
import { aqueousLitres, solveH, ammineComplexes, polarPhase, ionicStrength } from './chemistry.js'
import { EQUIPMENT } from '../data/equipment.js'

const plain = f => String(f || '').replace(/[₀-₉]/g, d => '₀₁₂₃₄₅₆₇₈₉'.indexOf(d))
const safeMass = f => { try { return f ? molarMass(plain(f)) : null } catch { return null } }

// phase: aq (dissolved, analytical total), s (solid/precipitate), l (liquid), g (gas released).
// Weak systems (SO4, OAc, NH3, CO3) are stored as analytical totals; their speciation is solved from pH.
export const SPECIES = Object.freeze({
  ...Object.fromEntries(Object.entries(IONS).map(([id, i]) => [id, { id, phase: 'aq', name: i.label, charge: i.weak ? null : i.z, weakSystem: i.weak || null, ammine: Boolean(i.ammine), group: 'ions' }])),
  ...Object.fromEntries(Object.entries(PRECIPITATES).map(([id, p]) => [id, { id, phase: 's', name: p.name, formula: p.formula, charge: 0, molarMass: safeMass(p.formula), Ksp: p.Ksp ?? null, group: 'precipitates' }])),
  ...Object.fromEntries(Object.entries(LIQUIDS).map(([id, l]) => [id, { id, phase: 'l', name: l.name, formula: l.formula, charge: 0, density: l.density, unit: 'mL', group: 'liquids' }])),
  ...Object.fromEntries(Object.entries(GASES).map(([id, g]) => [id, { id, phase: 'g', name: g.name, formula: g.formula, charge: 0, group: 'gas' }]))
})

const round = (x, d = 9) => Number.isFinite(x) ? Number(x.toPrecision(d)) : x

// The scientific state of one container. Amounts: mol; liquids: mL; T: °C; pH: null where the aqueous scale does not apply.
export function describe(state, id) {
  const c = state.objects.find(o => o.id === id)
  if (!c || !c.contents) return null
  const { contents } = c
  const V = aqueousLitres(contents)
  const h = V > 1e-6 && polarPhase(contents).pHApplies ? solveH(contents.ions, V) : null
  const pick = (map, min = 1e-15) => Object.fromEntries(Object.entries(map).filter(([, v]) => v > min).map(([k, v]) => [k, round(v)]))
  return {
    id: c.id,
    type: c.type,
    label: c.label || null,
    capacityML: EQUIPMENT[c.type]?.capacityML ?? null,
    volumeML: round(Object.values(contents.liquids).reduce((s, v) => s + v, 0), 6),
    T: c.T != null ? round(c.T, 5) : null, // droppers/pipettes carry no temperature
    pH: h ? round(-Math.log10(h), 4) : null,
    ionicStrength: h ? round(ionicStrength(contents.ions, V, h), 4) : null,
    liquids: pick(contents.liquids),
    dissolved: pick(contents.ions),
    complexes: h ? pick(ammineComplexes(contents)) : {}, // stability constants are for water: none outside the pH range
    precipitates: pick(contents.precipitates),
    indicators: pick(contents.indicators),
    solids: state.objects.filter(s => s.type === 'solid' && s.in === c.id && s.massG > 0).map(s => ({ id: s.id, reagent: s.reagent, massG: round(s.massG, 6), coat: pick(s.coat || {}) })),
    residue: pick(c.residue || {}), // ions left as a dry residue after evaporation (mol)
    gasReleased: pick(c.gasOut || {}),
    unsupported: c.unsupported || null,
    units: { amount: 'mol', liquid: 'mL', T: '°C', indicators: 'giọt (0,05 mL)', ionicStrength: 'mol/L', massG: 'g', coat: 'mol' }
  }
}

// Observation key prefix → standard outcome and the manifest process it reports.
const MANIFEST_BY_ID = Object.fromEntries(MANIFEST.map(e => [e.id, e]))
const AMMINE = { 'Cu2+': 'ammine-cu', 'Ag+': 'ammine-ag', 'Zn2+': 'ammine-zn' }
function processOf(key) {
  let m
  if ((m = /^rx-(.+)-o\d+$/.exec(key))) return m[1]
  if ((m = /^done-(.+)-o\d+$/.exec(key))) return m[1]
  if ((m = /^ppt-(.+)-o\d+$/.exec(key))) return PRECIPITATES[m[1]]?.redox ? 'redox-cu-i' : `ppt-${m[1]}` // CuI is formed by the iodide redox
  if ((m = /^redox-(.+)-o\d+$/.exec(key))) return `redox-${m[1]}`
  if ((m = /^ammine-dis-(.+)-o\d+$/.exec(key))) return AMMINE[PRECIPITATES[m[1]]?.cation] || null
  if ((m = /^ammine-(.+)-o\d+$/.exec(key))) return AMMINE[m[1]] || null
  if (/^neutral-/.test(key)) return 'neutralisation'
  if (/^co2-/.test(key)) return 'co2-carbonate'
  if (/^electro-o/.test(key)) return 'electrolysis-cucl2'
  if (/^daniell-o\d+$/.test(key)) return 'daniell'
  if (/^(dissolve|dissolved|crystal)-/.test(key)) return 'dissolve-salts'
  if (/^boil-/.test(key)) return 'boiling'
  if (/^(stir|drop|litmus|overflow|dry|nucleate)-/.test(key)) return null
  return null
}
export function classifyNote(key) {
  if (/^(norx)-/.test(key)) return { outcome: 'NO_REACTION_UNDER_MODELED_CONDITIONS', process: null, validation: null }
  if (/^(unsup|ionhint|electro-unsup|unsupported-hno3)-/.test(key)) return { outcome: 'UNSUPPORTED', process: null, validation: null }
  // Outside the model's range: pH/equilibria in ethanol-rich liquid; a temperature difference between Daniell half-cells.
  if (/^(solvent-mix|solvent-eth|daniell-dT|daniell-complex|redoxrange)-/.test(key)) return { outcome: 'OUT_OF_MODEL_RANGE', process: null, validation: null }
  const process = processOf(key)
  if (!process) return { outcome: 'OBSERVATION', process: null, validation: null }
  const entry = MANIFEST_BY_ID[process]
  const validation = entry ? validationOf(entry)[0] : 'UNVERIFIED' // an unmapped process is never reported as verified
  // A modelled process whose science is not yet verified is reported as such, never as a verified result.
  return { outcome: validation === 'UNVERIFIED' ? 'UNVERIFIED' : 'APPLIED', process, validation }
}

// The container (or the solid's container) a note key refers to: keys end with an object id.
export function containerOfNote(state, key) {
  const m = /-(o\d+)$/.exec(key)
  if (!m) return null
  const o = state.objects.find(x => x.id === m[1])
  return o?.type === 'solid' ? o.in || null : o ? o.id : m[1]
}

// Experiment template schema (Foundation): a Sandbox card / suggested experiment is data, not an engine. Any manifest
// entry with a demo maps to this shape; adding a template = adding data the engine already supports.
export function experimentTemplate(entry) {
  const d = entry.demo
  if (!d) return null
  return {
    id: entry.id,
    category: entry.group,
    objective: entry.title,
    initialEquipment: [d.vessel],
    initialChemicals: d.fill.map(([reagent, mL]) => ({ reagent, mL })),
    studentAction: d.pour ? { type: 'pour', reagent: d.pour[0], mL: d.pour[1] } : d.solid ? { type: 'drop-solid', reagent: d.solid[0], massG: d.solid[1] } : null,
    expectedPhenomena: entry.observe,
    processRefs: [entry.id],
    conditions: entry.conditions,
    validationStatus: validationOf(entry)[0],
    limits: entry.limits
  }
}
