// ChemLab 7.0 Dynamic Lab — unit and integration tests.
// Expected values are computed independently here (closed-form), not read back from the engine.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { ELECTRO } from '../src/dlab/data/reactions.js'
import { molarMass, REAGENT_BY_ID, solubilityAt } from '../src/dlab/data/materials.js'
import { reagentParcel, mix, pHOf, emptyContents, equilibrate, ionicStrength, solveH, aqueousLitres, totalVolumeML, polarPhase, boilingOf, oilBelow, withdraw, ammineComplexes } from '../src/dlab/engine/chemistry.js'
import { createSim, benchInventory, checkInvariants, snapshot, restore, H } from '../src/dlab/engine/sim.js'
import { levelForVolume, volumeBelow, EQUIPMENT } from '../src/dlab/data/equipment.js'
import { volumeOf, surfaceY, byId, label } from '../src/dlab/engine/processes.js'
import { migrate, validateSave } from '../src/dlab/persistence.js'
import { GUIDED, moreToAdd } from '../src/dlab/guided.js'
import { MANIFEST, DISCOVER } from '../src/dlab/data/manifest.js'
import { observe, mergeRepeats, indicatorReading } from '../src/dlab/ui/observations.js'
import { libraryItems, searchLibrary } from '../src/dlab/ui/library.js'
import { objectTitle, contentsName } from '../src/dlab/ui/labels.js'

const results = []
function test(name, fn) {
  try { fn(); results.push({ name, pass: true }) }
  catch (error) { results.push({ name, pass: false, error: error.stack.split('\n').slice(0, 3).join(' | ') }) }
}
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b} (±${tol})`)
const rel = (a, b, r, msg) => assert.ok(Math.abs(a - b) <= Math.abs(b) * r, `${msg}: ${a} vs ${b} (±${r * 100}%)`)
const R = id => REAGENT_BY_ID[id]
const parcel = (id, mL) => reagentParcel(R(id), mL)

function lab(seed = 1) {
  const sim = createSim(seed)
  const put = (type, x, extra = {}) => {
    const r = sim.dispatch({ type: 'add', ...extra, x, y: extra.y ?? 0, equipmentType: type }, { record: false })
    return byId(sim.state, r.id)
  }
  const fill = (o, reagent, mL) => sim.dispatch({ type: 'addReagentTo', id: o.id, reagent, mL }, { record: false })
  return { sim, put, fill, s: () => sim.state }
}

// ── Registry ─────────────────────────────────────────────────────────────
test('a failing command leaves state and undo history untouched', () => {
  const l = lab()
  const before = JSON.stringify(l.s().objects)
  const hist = l.sim.history.length
  assert.throws(() => l.sim.dispatch({ type: 'add', equipmentType: 'nope', x: 100 }))
  assert.equal(JSON.stringify(l.sim.state.objects), before)
  assert.equal(l.sim.history.length, hist)
})
test('molar masses from atomic masses', () => {
  near(molarMass('HCl'), 1.008 + 35.45, 0.01, 'HCl')
  near(molarMass('CuSO4'), 63.546 + 32.06 + 4 * 15.999, 0.02, 'CuSO4')
  near(molarMass('Ca(OH)2'), 40.078 + 2 * (15.999 + 1.008), 0.02, 'Ca(OH)2')
})
test('every reagent has a name, safety note and no invented numbers', () => {
  for (const r of Object.values(REAGENT_BY_ID)) {
    assert.ok(r.name && r.safety, r.id)
    if (r.kind === 'solution') assert.ok(r.M > 0 && Object.keys(r.ions).length, r.id)
    if (r.kind === 'solid') assert.ok(r.density > 0 && r.maxMass >= r.defaultMass, r.id)
  }
})
test('KNO3 solubility table interpolation', () => {
  near(solubilityAt('KNO3', 20), 31.6, 1e-9, '20 °C')
  near(solubilityAt('KNO3', 25), (31.6 + 45.8) / 2, 1e-9, '25 °C')
})
test('vessel geometry: level ↔ volume inverse, capacity at rim', () => {
  for (const type of ['beaker100', 'testTube', 'flask', 'cylinder']) {
    for (const mL of [1, 5, 10, EQUIPMENT[type].capacityML * 0.7]) near(volumeBelow(type, levelForVolume(type, mL)), mL, 0.02 * mL + 0.01, type)
  }
})

// ── Chemistry (independent closed-form fixtures) ─────────────────────────
test('H2SO4 0.25 M: second step with Ka2 = 1.0e-2 (CRC)', () => {
  const C = 0.25, K = 1.0e-2
  const x = (-(C + K) + Math.sqrt((C + K) ** 2 + 4 * K * C)) / 2
  near(pHOf(parcel('h2so4', 10)), -Math.log10(C + x), 0.003, 'H2SO4')
})
test('CuSO4: pH inside the measured bracket, no false Cu(OH)2, ionic strength flagged', () => {
  const cu = M => { const c = emptyContents(); c.liquids.water = 100; c.ions['Cu2+'] = M / 10; c.ions.SO4 = M / 10; return c }
  // Sigma-Aldrich/Merck: 0.1 M CuSO4 pH 4.2 (20 °C); CuSO4·5H2O 50 g/L (≈0.2 M) pH 3.7–4.5 (25 °C)
  for (const M of [0.1, 0.2]) { const p = pHOf(cu(M)); assert.ok(p >= 3.7 && p <= 4.6, `CuSO4 ${M} M pH ${p}`) }
  const c = cu(0.5)
  assert.deepEqual(equilibrate(c), {}, 'no Cu(OH)2 from a clear 0.5 M stock')
  const V = aqueousLitres(c)
  near(ionicStrength(c.ions, V, solveH(c.ions, V)), 0.5 * (0.5 * 4 + 0.5 * 4), 0.05, 'I of 0.5 M CuSO4')
})
test('pH strong acid / base', () => {
  near(pHOf(parcel('hcl', 10)), -Math.log10(0.5), 0.005, 'HCl 0.5 M')
  near(pHOf(parcel('naoh', 10)), 14 + Math.log10(0.5), 0.005, 'NaOH 0.5 M')
  near(pHOf(parcel('water', 10)), 7, 0.01, 'water')
})
test('pH weak acid / base (quadratic)', () => {
  const Ka = 1.75e-5
  const x = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * 1)) / 2
  near(pHOf(parcel('ch3cooh', 10)), -Math.log10(x), 0.01, 'CH3COOH 1 M')
  const Kb = 1e-14 / 5.6e-10
  const y = (-Kb + Math.sqrt(Kb * Kb + 4 * Kb * 0.5)) / 2
  near(pHOf(parcel('nh3', 10)), 14 + Math.log10(y), 0.01, 'NH3 0.5 M')
})
test('neutralisation: equivalence, excess and heat', () => {
  const a = parcel('hcl', 10)
  const r = mix(a, parcel('naoh', 10))
  near(pHOf(a), 7, 0.05, 'equivalence')
  rel(r.heatJ, 0.005 * 55840, 0.001, 'heat')
  const b = parcel('hcl', 10)
  mix(b, parcel('naoh', 5))
  near(pHOf(b), -Math.log10(0.0025 / 0.015), 0.01, 'excess acid')
})
test('AgCl: limiting reagent and Ksp residual', () => {
  const a = parcel('agno3', 10)
  mix(a, parcel('nacl', 10))
  rel(a.precipitates.AgCl, 1e-3, 1e-6, 'AgCl mol')
  const cl = (0.005 - 0.001) / 0.02
  rel(a.ions['Ag+'] / 0.02, 1.77e-10 / cl, 0.02, '[Ag+] = Ksp/[Cl-]')
})
test('Cu(OH)2 forms with base and redissolves in acid', () => {
  const a = parcel('cuso4', 10)
  mix(a, parcel('naoh', 10))
  rel(a.precipitates['Cu(OH)2'], 0.0025, 0.01, 'Cu(OH)2 = n(OH)/2')
  mix(a, parcel('hcl', 20))
  assert.ok(!(a.precipitates['Cu(OH)2'] > 1e-9), 'dissolved')
})
test('BaSO4 and AgI precipitate; no precipitate for NaCl + KNO3 analogue', () => {
  const a = parcel('bacl2', 10)
  mix(a, parcel('na2so4', 10))
  rel(a.precipitates.BaSO4, 0.002, 0.01, 'BaSO4')
  const b = parcel('nacl', 10)
  const r = mix(b, parcel('na2so4', 10))
  assert.deepEqual(r.formed, {}, 'no fake precipitate')
})

// ── Simulation core ──────────────────────────────────────────────────────
function makeLab(seed) { return lab(seed) }

test('exact transfer conserves volume and moles', () => {
  const { sim, put, fill } = makeLab()
  const A = put('beaker100', 200)
  const B = put('beaker100', 320)
  fill(A, 'cuso4', 50)
  sim.dispatch({ type: 'pourExact', from: A.id, to: B.id, mL: 20 }, { record: false })
  near(volumeOf(A), 30, 1e-9, 'A')
  near(volumeOf(B), 20, 1e-9, 'B')
  rel(A.contents.ions['Cu2+'] + B.contents.ions['Cu2+'], 0.025, 1e-9, 'Cu2+')
})
test('tilt pour: liquid leaves over the lip into the vessel below; volume conserved', () => {
  const { sim, put, fill, s } = makeLab()
  const A = put('beaker100', 200)
  const B = put('beaker250', 245)
  fill(A, 'naoh', 60)
  sim.dispatch({ type: 'move', id: A.id, x: 200, y: 120 }, { record: false })
  A.held = true
  A.y = 120
  sim.dispatch({ type: 'tilt', id: A.id, angle: 1.2 }, { record: false })
  sim.runFor(4)
  assert.ok(volumeOf(B) > 20, `B received ${volumeOf(B)}`)
  near(volumeOf(A) + volumeOf(B) + s().spill.mL, 60, 1e-6, 'total')
  assert.ok(volumeOf(A) < 60)
})
test('fixed timestep: 30 FPS and 60 FPS frames give identical state', () => {
  const run = fps => {
    const { sim, put, fill } = makeLab(7)
    const A = put('beaker100', 200)
    fill(A, 'hcl', 30)
    const tongs = put('tongs', 200, { y: 100 })
    sim.dispatch({ type: 'pick', tool: tongs.id, reagent: 'mg', massG: 0.05 }, { record: false, confirmed: true })
    sim.dispatch({ type: 'release', tool: tongs.id }, { record: false, confirmed: true })
    for (let i = 0; i < fps * 6; i += 1) sim.advance(1 / fps)
    const st = sim.state
    return JSON.stringify({ t: st.t.toFixed(9), ions: A.contents.ions, gas: st.gas, T: A.T })
  }
  assert.equal(run(30), run(60))
})
test('speed scales the simulation clock; pause stops it', () => {
  const a = makeLab()
  a.sim.state.speed = 2
  for (let i = 0; i < 60; i += 1) a.sim.advance(1 / 60)
  near(a.sim.state.t, 2, 1e-9, '2× for 1 s')
  a.sim.state.speed = 0.25
  for (let i = 0; i < 60; i += 1) a.sim.advance(1 / 60)
  near(a.sim.state.t, 2.25, 1e-9, '0.25×')
  a.sim.state.paused = true
  a.sim.advance(1)
  near(a.sim.state.t, 2.25, 1e-9, 'paused')
})
test('undo restores contents, position and reaction state', () => {
  const { sim, put, fill } = makeLab()
  const A = put('beaker100', 200)
  fill(A, 'hcl', 20)
  sim.dispatch({ type: 'move', id: A.id, x: 400, y: 0 })
  sim.dispatch({ type: 'addReagentTo', id: A.id, reagent: 'naoh', mL: 10 })
  sim.runFor(1)
  sim.undo()
  let a = byId(sim.state, A.id)
  near(volumeOf(a), 20, 1e-9, 'volume')
  assert.equal(a.x, 400)
  sim.undo()
  a = byId(sim.state, A.id)
  assert.equal(a.x, 200)
})
test('serialise → restore → continue equals uninterrupted run', () => {
  const build = () => {
    const l = makeLab(3)
    const A = l.put('beaker100', 200)
    l.fill(A, 'hcl', 30)
    const t = l.put('tongs', 200, { y: 100 })
    l.sim.dispatch({ type: 'pick', tool: t.id, reagent: 'zn', massG: 0.5 }, { record: false })
    l.sim.dispatch({ type: 'release', tool: t.id }, { record: false })
    return l
  }
  const a = build()
  a.sim.runFor(5)
  const b = build()
  b.sim.runFor(2)
  b.sim.load(restore(snapshot(b.sim.state)))
  b.sim.runFor(3)
  assert.equal(JSON.stringify(a.sim.state.objects), JSON.stringify(b.sim.state.objects))
})

// ── Reactions with solids ────────────────────────────────────────────────
function dropSolid(l, container, reagent, massG) {
  const tool = l.put(R(reagent).tool, container.x, { y: container.y + 140 })
  const r1 = l.sim.dispatch({ type: 'pick', tool: tool.id, reagent, massG }, { record: false, confirmed: true })
  assert.ok(r1.ok, JSON.stringify(r1.verdict))
  const r2 = l.sim.dispatch({ type: 'release', tool: tool.id }, { record: false, confirmed: true })
  assert.ok(r2.ok, JSON.stringify(r2.verdict))
  return byId(l.sim.state, r2.id)
}

test('Mg + HCl: H2 = n(Mg), Mg2+ formed, elements conserved, pH from leftover acid', () => {
  const l = makeLab()
  const A = l.put('beaker100', 200)
  l.fill(A, 'hcl', 10)
  const before = benchInventory(l.s())
  const mg = dropSolid(l, A, 'mg', 0.05)
  const nMg = 0.05 / molarMass('Mg')
  l.sim.runFor(240)
  assert.ok(mg.massG < 1e-6, `Mg left ${mg.massG}`)
  rel(l.s().gas.H2, nMg, 0.005, 'H2')
  rel(A.contents.ions['Mg2+'], nMg, 0.005, 'Mg2+')
  near(A.pH, -Math.log10((0.005 - 2 * nMg) / 0.010), 0.03, 'pH')
  const after = benchInventory(l.s())
  rel(after.Cl, before.Cl, 1e-9, 'Cl')
  rel(after.Mg, nMg, 1e-6, 'Mg')
})
test('Na + water: floats, moves, shrinks to nothing, NaOH pH and heat', () => {
  const l = makeLab()
  const D = l.put('dish', 300)
  l.fill(D, 'water', 100)
  l.sim.dispatch({ type: 'addReagentTo', id: D.id, reagent: 'phenolphthalein', mL: 0.1 }, { record: false })
  const na = dropSolid(l, D, 'na', 0.1)
  l.sim.runFor(3)
  assert.ok(na.ly > 0, 'floats on the surface')
  const xs = []
  for (let i = 0; i < 10; i += 1) { l.sim.runFor(0.5); xs.push(na.lx) }
  assert.ok(Math.max(...xs) - Math.min(...xs) > 1, 'moves across the surface')
  l.sim.runFor(120)
  assert.equal(na.massG, 0)
  const n = 0.1 / molarMass('Na')
  rel(l.s().gas.H2, n / 2, 0.005, 'H2')
  near(D.pH, 14 + Math.log10(n / 0.1001), 0.03, 'pH')
  assert.ok(D.T > 25.3, `temperature rose: ${D.T}`)
})
test('Observation panel: Na + water — happening, then a conclusion read from the real pH', () => {
  const l = makeLab()
  const D = l.put('dish', 300)
  l.fill(D, 'water', 100)
  l.sim.dispatch({ type: 'addReagentTo', id: D.id, reagent: 'phenolphthalein', mL: 0.1 }, { record: false })
  dropSolid(l, D, 'na', 0.1)
  l.sim.runFor(2)
  const during = observe(l.s())
  assert.equal(during.happening.length, 1, 'one reaction happening')
  assert.match(during.happening[0].text, /natri/i)
  assert.equal(during.conclusions.length, 0, 'no conclusion before it finishes')
  l.sim.runFor(120)
  const after = observe(l.s())
  assert.equal(after.happening.length, 0, 'nothing happening once Na is used up')
  assert.equal(after.conclusions.length, 1)
  const c = after.conclusions[0]
  assert.match(c.equation, /2Na \+ 2H₂O/)
  assert.ok(c.facts.some(f => /Phenolphtalein chuyển hồng/.test(f)), `indicator fact: ${c.facts}`)
  assert.ok(c.facts.some(f => /bazơ/.test(f) && f.includes(D.pH.toLocaleString('vi-VN', { maximumFractionDigits: 1 }))), `pH fact from state: ${c.facts}`)
})
test('Observation panel: repeated journal entries merge with a count, nothing dropped', () => {
  const merged = mergeRepeats([{ t: 1, kind: 'action', text: 'A' }, { t: 2, kind: 'action', text: 'A' }, { t: 3, kind: 'observe', text: 'B' }, { t: 4, kind: 'action', text: 'A' }])
  assert.deepEqual(merged.map(e => [e.text, e.n]), [['A', 1], ['B', 1], ['A', 2]])
  assert.equal(merged.reduce((s, e) => s + e.n, 0), 4, 'every entry is still counted')
  assert.equal(indicatorReading('phenolphthalein', 8.0), 'Phenolphtalein không màu')
  assert.equal(indicatorReading('litmus', 3), 'Quỳ tím màu đỏ')
  assert.equal(indicatorReading('methylOrange', 5), 'Metyl da cam màu vàng')
})
test('Cleanup logs only when something was cleaned', () => {
  const l = makeLab()
  l.put('beaker100', 200)
  const n = l.s().log.length
  assert.equal(l.sim.dispatch({ type: 'cleanup' }).changed, false)
  assert.equal(l.s().log.length, n, 'no log line for an already clean bench')
  l.s().spill.mL = 3
  assert.equal(l.sim.dispatch({ type: 'cleanup' }).changed, true)
  assert.match(l.s().log.at(-1).text, /lau chất đổ/)
})
test('Library search: exact base name first, accents optional', () => {
  const items = libraryItems()
  assert.equal(searchLibrary(items, 'natri')[0].name, 'Natri (mẩu)')
  assert.equal(searchLibrary(items, 'nuoc')[0].name, 'Nước cất')
  assert.ok(searchLibrary(items, 'NaOH').some(i => i.reagent === 'naoh'), 'formula search')
  assert.equal(searchLibrary(items, '  '), null, 'empty query → tabs')
  assert.equal(searchLibrary(items, 'zzzz').length, 0)
})
test('Fe + CuSO4: copper coats the nail mole-for-mole', () => {
  const l = makeLab()
  const A = l.put('beaker100', 200)
  l.fill(A, 'cuso4', 40)
  const fe = dropSolid(l, A, 'fe', 2)
  l.sim.runFor(60)
  const reacted = (2 - fe.massG) / molarMass('Fe')
  assert.ok(reacted > 1e-4)
  rel(fe.coat.Cu, reacted, 1e-4, 'Cu deposit')
  rel(A.contents.ions['Fe2+'], reacted, 1e-4, 'Fe2+')
  rel(A.contents.ions['Cu2+'] + reacted, 0.02, 1e-6, 'Cu balance')
})
test('every metal/solid rule conserves stoichiometry (Zn, Fe + acid; Zn + Cu²⁺; Cu + Ag⁺; CaCO₃ + acid)', () => {
  const cases = [
    { solid: 'zn', m: 0.5, sol: 'hcl', gives: { 'Zn2+': 1 }, h2: 1 },
    { solid: 'fe', m: 2, sol: 'hcl', gives: { 'Fe2+': 1 }, h2: 1 },
    { solid: 'zn', m: 0.5, sol: 'cuso4', gives: { 'Zn2+': 1 }, coat: { Cu: 1 }, lost: { 'Cu2+': 1 } },
    { solid: 'cu', m: 1, sol: 'agno3', gives: { 'Cu2+': 1 }, coat: { Ag: 2 }, lost: { 'Ag+': 2 } },
    { solid: 'caco3', m: 1, sol: 'hcl', gives: { 'Ca2+': 1 } }
  ]
  for (const k of cases) {
    const l = makeLab()
    const A = l.put('beaker100', 200)
    l.fill(A, k.sol, 40)
    const before = { ...A.contents.ions }
    const s = dropSolid(l, A, k.solid, k.m)
    l.sim.runFor(60)
    const xi = (k.m - s.massG) / molarMass(R(k.solid).formula)
    assert.ok(xi > 1e-5, `${k.solid}+${k.sol} reacted`)
    for (const [ion, n] of Object.entries(k.gives)) rel(A.contents.ions[ion] - (before[ion] || 0), n * xi, 1e-4, `${k.solid}+${k.sol} ${ion}`)
    for (const [ion, n] of Object.entries(k.lost || {})) rel(before[ion] - A.contents.ions[ion], n * xi, 1e-4, `${k.solid}+${k.sol} −${ion}`)
    for (const [m, n] of Object.entries(k.coat || {})) rel(s.coat[m], n * xi, 1e-4, `${k.solid}+${k.sol} coat ${m}`)
    if (k.h2) rel(l.s().gas.H2, k.h2 * xi, 1e-4, `${k.solid}+${k.sol} H2`)
  }
})
test('hydroxide precipitates: Fe(OH)3, Fe(OH)2, Mg(OH)2 take the limiting reagent', () => {
  for (const [salt, key, q] of [['fecl3', 'Fe(OH)3', 3], ['feso4', 'Fe(OH)2', 2], ['mgcl2', 'Mg(OH)2', 2]]) {
    const a = parcel(salt, 10) // 0.2 M → 2 mmol metal
    mix(a, parcel('naoh', 4 * q + 2)) // 0.5 M, OH⁻ in excess of q·2 mmol
    rel(a.precipitates[key], 2e-3, 2e-3, key)
  }
})
test('unsupported and non-reactions do not invent results', () => {
  const l = makeLab()
  const A = l.put('beaker100', 200)
  l.fill(A, 'hcl', 20)
  dropSolid(l, A, 'cu', 1)
  l.sim.runFor(10)
  assert.equal(l.s().gas.H2, 0)
  assert.ok(l.s().log.some(e => e.text.includes('Không có phản ứng')), 'explains no reaction')
  const B = l.put('beaker100', 400)
  l.fill(B, 'hno3', 20)
  dropSolid(l, B, 'zn', 0.5)
  l.sim.runFor(10)
  assert.equal(l.s().gas.H2, 0, 'no H2 from HNO3')
  assert.ok(byId(l.s(), B.id).unsupported, 'flagged unsupported')
})
test('NaCl crystals dissolve; KNO3 crystallises on cooling to the table value', () => {
  const l = makeLab()
  const A = l.put('beaker100', 200)
  l.fill(A, 'water', 20)
  const salt = dropSolid(l, A, 'nacl-s', 2)
  l.sim.runFor(60)
  assert.ok(salt.massG < 0.05, `NaCl left ${salt.massG}`)
  const B = l.put('beaker100', 400)
  l.fill(B, 'water', 20)
  B.T = 60
  dropSolid(l, B, 'kno3-s', 15)
  B.T = 60
  for (let i = 0; i < 400; i += 1) { B.T = 60; l.sim.runFor(0.25) }
  const kno3 = l.s().objects.find(o => o.type === 'solid' && o.reagent === 'kno3-s')
  assert.ok(kno3.massG < 0.1, `dissolved at 60 °C, left ${kno3.massG}`)
  for (let i = 0; i < 800; i += 1) { B.T = 25; l.sim.runFor(0.25) }
  const crystals = l.s().objects.filter(o => o.type === 'solid' && o.reagent === 'kno3-s' && o.in === B.id).reduce((s, o) => s + o.massG, 0)
  const waterG = B.contents.liquids.water * 0.997
  rel(crystals, 15 - solubilityAt('KNO3', 25) * waterG / 100, 0.05, 'crystal mass')
})
test('CO2 into limewater: turbid, then clears with excess', () => {
  const l = makeLab()
  const A = l.put('testTube', 200)
  // Diluted limewater (1:2): the ideal model's CaCO3 solubility under 1 atm CO2 is lower than saturated limewater's Ca.
  l.fill(A, 'caoh2', 5)
  l.fill(A, 'water', 10)
  l.sim.dispatch({ type: 'co2', id: A.id, on: true }, { record: false })
  let maxPpt = 0
  for (let i = 0; i < 120; i += 1) { l.sim.runFor(1); maxPpt = Math.max(maxPpt, A.contents.precipitates.CaCO3 || 0) }
  rel(maxPpt, 0.02 * 0.005, 0.1, 'max CaCO3 ≈ n(Ca)')
  assert.ok((A.contents.precipitates.CaCO3 || 0) < maxPpt * 0.3, `clears: ${A.contents.precipitates.CaCO3}`)
})

// ── Litmus paper ─────────────────────────────────────────────────────────
test('litmus: dipped part turns red in acid, top stays violet, colour kept after removal', () => {
  const l = makeLab()
  const A = l.put('beaker100', 200)
  l.fill(A, 'hcl', 40)
  const surf = surfaceY(A)
  const p = l.sim.dispatch({ type: 'newLitmus', x: 200 }, { record: false })
  const paper = byId(l.s(), p.id)
  l.sim.dispatch({ type: 'move', id: paper.id, x: 200, y: surf - 10 }, { record: false })
  l.sim.runFor(2)
  const seg = paper.seg
  assert.ok(seg[0].rgb[0] > seg[0].rgb[2] + 80, 'tip red')
  assert.ok(Math.abs(seg[seg.length - 1].rgb[0] - 130) < 5, 'top unchanged')
  const wetCount = seg.filter(s => s.wet > 0.5).length
  l.sim.dispatch({ type: 'move', id: paper.id, x: 200, y: surf - 30 }, { record: false })
  l.sim.runFor(2)
  assert.ok(paper.seg.filter(s => s.wet > 0.5).length > wetCount, 'deeper dip wets more')
  l.sim.dispatch({ type: 'move', id: paper.id, x: 500, y: 150 }, { record: false })
  l.sim.runFor(5)
  assert.ok(paper.seg[0].rgb[0] > paper.seg[0].rgb[2] + 80, 'kept red after removal')
  const B = l.put('beaker100', 400)
  l.fill(B, 'naoh', 40)
  l.sim.dispatch({ type: 'move', id: paper.id, x: 400, y: surfaceY(B) - 10 }, { record: false })
  l.sim.runFor(3)
  assert.ok(paper.seg[0].rgb[2] > paper.seg[0].rgb[0] + 60, 'reused paper turns blue in base')
  const C = l.put('beaker100', 600)
  l.fill(C, 'nacl', 40)
  const q = byId(l.s(), l.sim.dispatch({ type: 'newLitmus', x: 600 }, { record: false }).id)
  l.sim.dispatch({ type: 'move', id: q.id, x: 600, y: surfaceY(C) - 10 }, { record: false })
  l.sim.runFor(3)
  assert.ok(Math.abs(q.seg[0].rgb[0] - 130) < 25 && q.seg[0].wet > 0.5, 'neutral: wet but violet')
  const r = byId(l.s(), l.sim.dispatch({ type: 'newLitmus', x: 700 }, { record: false }).id)
  l.sim.runFor(2)
  assert.ok(r.seg.every(s => s.wet === 0), 'not touching: unchanged')
})

// ── Indicator diffusion and stirring ─────────────────────────────────────
test('indicator colour spreads from the drop point; stirring mixes faster', () => {
  const spread = stir => {
    const l = makeLab()
    const A = l.put('beaker250', 200)
    l.fill(A, 'naoh', 150)
    l.sim.runFor(1)
    const dropper = l.put('dropper', 200 + 25, { y: 200 })
    const bottle = l.put('bottle', 500, { reagent: 'phenolphthalein' })
    l.sim.dispatch({ type: 'aspirate', tool: dropper.id, from: bottle.id, mL: 1 }, { record: false })
    l.sim.dispatch({ type: 'dispense', tool: dropper.id, drops: 3 }, { record: false })
    l.sim.runFor(0.5)
    const f0 = A.vis.field.slice()
    const peak = f0.indexOf(Math.max(...f0))
    if (stir) l.sim.dispatch({ type: 'stir', id: A.id, amount: 1.2 }, { record: false })
    l.sim.runFor(2)
    const f = A.vis.field
    const mean = f.reduce((s, x) => s + x, 0) / f.length
    return { peak, spreadRatio: Math.min(...f) / mean, f0max: Math.max(...f0) / (f0.reduce((s, x) => s + x, 0) / f0.length) }
  }
  const still = spread(false)
  const stirred = spread(true)
  assert.ok(still.f0max > 5, 'concentrated at contact first')
  assert.ok(stirred.spreadRatio > still.spreadRatio + 0.2, `stirred ${stirred.spreadRatio} vs still ${still.spreadRatio}`)
})

// ── Precipitate settling ─────────────────────────────────────────────────
test('precipitate particles appear, settle, and resuspend when stirred', () => {
  const l = makeLab()
  const A = l.put('beaker100', 200)
  l.fill(A, 'cuso4', 30)
  l.sim.dispatch({ type: 'addReagentTo', id: A.id, reagent: 'naoh', mL: 20 }, { record: false })
  assert.ok(A.vis.parts.length > 10, 'particles spawned')
  l.sim.runFor(90)
  const settled = A.vis.parts.filter(p => p.settled).length / A.vis.parts.length
  assert.ok(settled > 0.8, `settled ${settled}`)
  for (let i = 0; i < 30; i += 1) { l.sim.dispatch({ type: 'stir', id: A.id, amount: 0.5 }, { record: false }); l.sim.runFor(0.1) }
  assert.ok(A.vis.parts.filter(p => !p.settled).length > A.vis.parts.length * 0.3, 'resuspended')
})

// ── Safety and damage ────────────────────────────────────────────────────
test('safety: Na blocked in test tube, too much Na blocked, warnings need confirmation', () => {
  const l = makeLab()
  const T = l.put('testTube', 200)
  l.fill(T, 'water', 15)
  const tongs = l.put('tongs', 200, { y: 150 })
  assert.equal(l.sim.dispatch({ type: 'pick', tool: tongs.id, reagent: 'na', massG: 0.5 }, { confirmed: true }).verdict.level, 'block')
  const pick = l.sim.dispatch({ type: 'pick', tool: tongs.id, reagent: 'na', massG: 0.1 })
  assert.ok(pick.needsConfirm, 'warn first')
  l.sim.dispatch({ type: 'pick', tool: tongs.id, reagent: 'na', massG: 0.1 }, { confirmed: true })
  const rel = l.sim.dispatch({ type: 'release', tool: tongs.id }, { confirmed: true })
  assert.equal(rel.verdict.level, 'block')
  const spatula = l.put('spatula', 300, { y: 150 })
  assert.equal(l.sim.dispatch({ type: 'pick', tool: spatula.id, reagent: 'na', massG: 0.1 }, { confirmed: true }).verdict.level, 'block', 'wrong tool')
})
test('damage: cylinder cannot be heated; thermal shock cracks, reheating breaks, broken vessel refuses liquid', () => {
  const l = makeLab()
  const b = l.put('burner', 200)
  const cyl = l.put('cylinder', 400)
  l.sim.dispatch({ type: 'burner', id: b.id, on: true }, { record: false })
  assert.equal(l.sim.dispatch({ type: 'move', id: cyl.id, x: 200, y: 0 }).verdict.level, 'block')
  const bk = l.put('beaker100', 600)
  l.sim.dispatch({ type: 'move', id: bk.id, x: 200, y: 0 }, { confirmed: true, record: false })
  assert.equal(bk.y, EQUIPMENT.burner.h, 'rests on the burner')
  l.sim.runFor(240)
  assert.ok(bk.T > 100, `dry glass heats: ${bk.T}`)
  const r = l.sim.dispatch({ type: 'addReagentTo', id: bk.id, reagent: 'water', mL: 20 })
  assert.ok(r.needsConfirm, 'thermal shock warning')
  l.sim.dispatch({ type: 'addReagentTo', id: bk.id, reagent: 'water', mL: 20 }, { confirmed: true, record: false })
  assert.equal(bk.condition, 'CRACKED')
  l.sim.runFor(1)
  assert.equal(bk.condition, 'UNUSABLE')
  assert.equal(volumeOf(bk), 0)
  assert.equal(l.sim.dispatch({ type: 'addReagentTo', id: bk.id, reagent: 'water', mL: 5 }).verdict.level, 'block')
  l.sim.dispatch({ type: 'cleanup' }, { record: false })
  assert.ok(!byId(l.s(), bk.id), 'cleanup removes broken glass')
})

// ── Electrochemistry ─────────────────────────────────────────────────────
test('electrolysis CuCl2 follows Faraday: n(Cu) = I·t / 2F', () => {
  const l = makeLab()
  const A = l.put('beaker100', 200)
  l.fill(A, 'cucl2', 50)
  const el = l.put('electrodes', 200, { y: 10 })
  const p = l.put('power', 400)
  l.sim.dispatch({ type: 'wire', from: p.id, to: el.id }, { record: false })
  l.sim.dispatch({ type: 'power', id: p.id, on: true, volts: 6 }, { confirmed: true, record: false })
  l.sim.runFor(60)
  const I = (6 - 1.02 - 0.4) / 4
  rel(el.cuDeposit, I * 60 / (2 * 96485), 0.01, 'Cu deposit')
  rel(l.s().gas.Cl2, I * 60 / (2 * 96485), 0.01, 'Cl2')
})
test('Daniell cell: Nernst voltage, open circuit without bridge', () => {
  const l = makeLab()
  const A = l.put('beaker100', 200)
  const B = l.put('beaker100', 400)
  l.fill(A, 'znso4', 50)
  l.fill(B, 'cuso4', 50)
  const zn = dropSolid(l, A, 'zn', 2)
  const cu = dropSolid(l, B, 'cu', 2)
  l.sim.runFor(1)
  const v = l.put('voltmeter', 300, { y: 0 })
  l.sim.dispatch({ type: 'wire', from: v.id, to: zn.id }, { record: false })
  l.sim.dispatch({ type: 'wire', from: v.id, to: cu.id }, { record: false })
  l.sim.runFor(0.1)
  assert.equal(v.reading, 0, 'open circuit')
  const bridge = l.put('bridge', 300, { y: 80 })
  l.sim.dispatch({ type: 'link', id: bridge.id, a: A.id, b: B.id }, { record: false })
  l.sim.runFor(0.1)
  near(v.reading, 1.10, 0.002, 'E at equal concentrations')
})

test('CuCl₂ + KI: 2Cu²⁺ + 4I⁻ → 2CuI↓ + I₂ before any electrolysis; atoms and charge conserved', () => {
  const l = makeLab()
  const A = l.put('beaker100', 200)
  l.fill(A, 'cucl2', 10) // 5 mmol Cu²⁺, 10 mmol Cl⁻
  l.fill(A, 'ki', 20) // 2 mmol I⁻ → limiting: ξ = 0.5 mmol
  const c = byId(l.s(), A.id).contents
  near(c.precipitates.CuI, 1e-3, 1e-9, 'CuI = n(I⁻)/2'); near((c.ions.I2 || 0) + (c.precipitates.I2s || 0), 0.5e-3, 1e-9, 'I₂ = n(I⁻)/4')
  near(c.ions.I2, 1.33e-3 * 0.030, 1e-9, 'no I⁻ left: dissolved I₂ only up to its solubility 1.33 mM (CRC), the rest is solid')
  near(c.ions['Cu2+'], 5e-3 - 1e-3, 1e-9, 'Cu²⁺ left'); assert.ok(!(c.ions['I-'] > 1e-12), 'I⁻ used up')
  near(c.ions['Cl-'], 10e-3, 1e-12, 'Cl⁻ spectator')
  // Cu: 5 mmol in, I: 2 mmol in — both conserved across CuI + I₂ + ions.
  near((c.ions['Cu2+'] || 0) + c.precipitates.CuI, 5e-3, 1e-12, 'Cu atoms'); near(c.precipitates.CuI + 2 * (c.ions.I2 + c.precipitates.I2s), 2e-3, 1e-12, 'I atoms')
  assert.ok(Object.keys(l.s().notes).some(k => k.startsWith('redox-cu-i-')), 'equation shown')
  // Electrolysis afterwards: I₂ in solution would be reduced first → refused, no Cl₂ and no copper invented.
  const el = l.put('electrodes', 200, { y: 10 }); const p = l.put('power', 400)
  l.sim.dispatch({ type: 'wire', from: p.id, to: el.id }, { record: false })
  l.sim.dispatch({ type: 'power', id: p.id, on: true, volts: 6 }, { confirmed: true, record: false })
  l.sim.runFor(10)
  assert.ok(!(l.s().gas.Cl2 > 0) && !(el.cuDeposit > 0), 'no product from the CuCl₂ model'); assert.match(p.status, /Chưa hỗ trợ.*I₂/)
  // Excess KI: all Cu²⁺ → CuI; I⁻ left would be oxidised at the anode first → also refused.
  const m = makeLab(); const B = m.put('beaker100', 200); m.fill(B, 'cucl2', 2); m.fill(B, 'ki', 40)
  const cb = byId(m.s(), B.id).contents
  assert.ok(!(cb.ions['Cu2+'] > 1e-12)); near(cb.precipitates.CuI, 1e-3, 1e-9, 'all Cu → CuI'); near(cb.ions['I-'], 4e-3 - 2e-3, 1e-9, 'I⁻ excess')
  // Fe³⁺ + I⁻: 2Fe³⁺ + 2I⁻ → 2Fe²⁺ + I₂ (no precipitate).
  const f2 = makeLab(); const F = f2.put('beaker100', 200); f2.fill(F, 'fecl3', 10); f2.fill(F, 'ki', 10)
  const cf = byId(f2.s(), F.id).contents
  near(cf.ions['Fe2+'], 1e-3, 1e-9, 'Fe²⁺'); near(cf.ions['Fe3+'], 1e-3, 1e-9, 'Fe³⁺ left'); near((cf.ions.I2 || 0) + (cf.precipitates.I2s || 0), 0.5e-3, 1e-9, 'I₂')
  // Plain CuCl₂ is still electrolysed (Faraday test above); Ag⁺ / Fe²⁺ in the cell are refused.
  const g = makeLab(); const G = g.put('beaker100', 200); g.fill(G, 'cucl2', 40); g.fill(G, 'feso4', 10)
  const e2 = g.put('electrodes', 200, { y: 10 }); const p2 = g.put('power', 400)
  g.sim.dispatch({ type: 'wire', from: p2.id, to: e2.id }, { record: false }); g.sim.dispatch({ type: 'power', id: p2.id, on: true, volts: 6 }, { confirmed: true, record: false }); g.sim.runFor(2)
  assert.ok(!(g.s().gas.Cl2 > 0)); assert.match(p2.status, /Fe²⁺/)
})

test('Daniell cell: E follows E°(T) and the Nernst slope at the cell temperature', () => {
  const run = T => {
    const l = makeLab()
    const A = l.put('beaker100', 200); const B = l.put('beaker100', 400)
    l.fill(A, 'znso4', 50); l.fill(B, 'cuso4', 5); l.fill(B, 'water', 45) // [Cu²⁺] = 0.05 M, [Zn²⁺] = 0.5 M
    const zn = dropSolid(l, A, 'zn', 2); const cu = dropSolid(l, B, 'cu', 2); l.sim.runFor(1)
    const v = l.put('voltmeter', 300, { y: 0 })
    l.sim.dispatch({ type: 'wire', from: v.id, to: zn.id }, { record: false }); l.sim.dispatch({ type: 'wire', from: v.id, to: cu.id }, { record: false })
    const bridge = l.put('bridge', 300, { y: 80 }); l.sim.dispatch({ type: 'link', id: bridge.id, a: A.id, b: B.id }, { record: false })
    byId(l.s(), A.id).T = T; byId(l.s(), B.id).T = T
    l.sim.runFor(H)
    return v
  }
  // Independent: ΔS° from NBS S° = −112.1 + 33.150 − 41.63 + 99.6; E = E°(T) − (RT ln10 / 2F)·log(0.5/0.05).
  const dS = -112.1 + 33.150 - 41.63 + 99.6
  for (const T of [25, 60]) {
    const v = run(T); const TK = 273.15 + T
    const expect = 1.10 + dS / (2 * 96485) * (TK - 298.15) - 8.314462618 * TK * Math.log(10) / (2 * 96485)
    near(v.reading, expect, 3e-3, `E at ${T} °C`) // cooling toward room T in one step is < 0.01 °C
    assert.match(v.status, new RegExp(`${T} °C`))
  }
  assert.ok(run(25).reading > run(60).reading, 'higher T lowers E for Q > 1 (and E° drops 0.11 mV/K)')
})

// ── Invariants and persistence ───────────────────────────────────────────
test('invariants hold after a long mixed run', () => {
  const l = makeLab()
  const A = l.put('beaker250', 200)
  l.fill(A, 'hcl', 80)
  dropSolid(l, A, 'caco3', 1)
  l.sim.dispatch({ type: 'addReagentTo', id: A.id, reagent: 'agno3', mL: 20 }, { record: false })
  l.sim.runFor(120)
  assert.equal(checkInvariants(l.s()), null)
  rel(l.s().gas.CO2 + (A.contents.ions.CO3 || 0), 1 / molarMass('CaCO3') - l.s().objects.find(o => o.reagent === 'caco3').massG / molarMass('CaCO3'), 1e-6, 'C balance')
})
test('save format validation and migration', () => {
  const l = makeLab()
  const A = l.put('beaker100', 200)
  l.fill(A, 'hcl', 10)
  const save = { schema: 1, name: 'x', savedAt: 1, state: JSON.parse(snapshot(l.s())) }
  assert.equal(validateSave(save), null)
  assert.ok(validateSave({ schema: 1, state: { objects: 'nope' } }))
  assert.ok(validateSave({ schema: 99, state: save.state }))
  const bad = JSON.parse(JSON.stringify(save))
  bad.state.objects[0].contents.ions['Cl-'] = -1
  assert.ok(validateSave(bad), 'negative amounts rejected')
  assert.equal(migrate(save).schema, 1)
})

// ── Guided Labs: every lab can be completed through ordinary commands ──
function runGuided(id, actions) {
  const sim = createSim(5)
  const lab = GUIDED.find(g => g.id === id)
  const roles = lab.setup(sim)
  const s = () => sim.state
  const ok = cmd => { const r = sim.dispatch(cmd, { confirmed: true, record: false }); assert.ok(r.ok, `${cmd.type}: ${JSON.stringify(r.verdict)}`); return r }
  const ctx = { sim, s, roles, ok, o: id => byId(s(), id), find: t => s().objects.find(x => x.type === t) }
  lab.steps.forEach((step, i) => {
    actions[i](ctx)
    let tries = 0
    while (!step.check(s(), roles) && tries < 600) { sim.runFor(0.5); tries += 1 }
    assert.ok(step.check(s(), roles), `${id}: step ${i + 1} not reached — ${step.text}`)
  })
}
const dipIn = c => ({ ok, o, sim }) => { const p = ok({ type: 'newLitmus', x: 100 }).id; ok({ type: 'move', id: p, x: o(c(ok)).x, y: surfaceY(o(c(ok))) - 10 }); sim.runFor(1) }
const grab = (ctx, toolType, reagent, massG, target) => {
  const t = ctx.find(toolType)
  ctx.ok({ type: 'move', id: t.id, x: ctx.o(target).x, y: 160 })
  ctx.ok({ type: 'pick', tool: t.id, reagent, massG })
  ctx.ok({ type: 'release', tool: t.id })
}
test('guided lab: acid–base can be completed', () => runGuided('acid-base', [
  c => dipIn(() => c.roles.A)(c), c => dipIn(() => c.roles.B)(c), c => dipIn(() => c.roles.C)(c),
  c => { const d = c.find('dropper'); c.ok({ type: 'move', id: d.id, x: c.o(c.roles.phph).x, y: 10 }); c.ok({ type: 'aspirate', tool: d.id, from: c.roles.phph, mL: 1 }); c.ok({ type: 'move', id: d.id, x: c.o(c.roles.B).x, y: 140 }); c.ok({ type: 'dispense', tool: d.id, drops: 3 }) },
  c => c.ok({ type: 'pourExact', from: c.roles.acid, to: c.roles.B, mL: 9 })
]))
test('guided lab: precipitate can be completed', () => runGuided('precipitate', [
  c => c.ok({ type: 'pourExact', from: c.roles.naoh, to: c.roles.beaker, mL: 4 }),
  () => {}, c => c.ok({ type: 'stir', id: c.roles.beaker, amount: 1 }),
  c => c.ok({ type: 'pourExact', from: c.roles.hcl, to: c.roles.beaker, mL: 15 }),
  c => grab(c, 'spatula', 'nacl-s', 2, c.roles.water)
]))
test('guided lab: metals can be completed', () => runGuided('metals', [
  c => grab(c, 'tongs', 'fe', 2, c.roles.cu), () => {},
  c => grab(c, 'tongs', 'zn', 0.5, c.roles.acid),
  c => grab(c, 'tongs', 'na', 0.1, c.roles.dish), () => {}
]))
test('guided lab: electrochemistry can be completed', () => runGuided('electrolysis', [
  c => c.ok({ type: 'move', id: c.roles.el, x: c.o(c.roles.cell).x, y: 10 }),
  c => { c.ok({ type: 'wire', from: c.roles.power, to: c.roles.el }); c.ok({ type: 'power', id: c.roles.power, on: true, volts: 6 }) },
  () => {},
  c => { grab(c, 'tongs', 'zn', 2, c.roles.zn); grab(c, 'tongs', 'cu', 2, c.roles.cuB) },
  c => {
    c.ok({ type: 'link', id: c.roles.bridge, a: c.roles.zn, b: c.roles.cuB })
    for (const r of ['zn', 'cu']) c.ok({ type: 'wire', from: c.roles.volt, to: c.s().objects.find(x => x.reagent === r).id })
  }
]))
test('guided lab: organic can be completed', () => runGuided('organic', [
  c => dipIn(() => c.roles.acid)(c),
  c => grab(c, 'spatula', 'nahco3-s', 0.5, c.roles.acid),
  c => c.ok({ type: 'pourExact', from: c.roles.oil, to: c.roles.t2, mL: 3 }),
  c => c.ok({ type: 'pourExact', from: c.roles.eth, to: c.roles.t3, mL: 3 })
]))

// ── Tongs: grabbing an existing piece (regression: the nail could not be taken out of the beaker) ──
function nailIn(l, beaker, massG = 2) {
  const nail = dropSolid(l, beaker, 'fe', massG)
  l.sim.runFor(1)
  return byId(l.sim.state, nail.id)
}
test('grab: piece out of an empty vessel and out of a solution; same object, chemistry kept', () => {
  const l = lab()
  const dry = l.put('beaker100', 200)
  const wet = l.put('beaker100', 320)
  l.fill(wet, 'cuso4', 40)
  for (const c of [dry, wet]) {
    const nail = nailIn(l, c)
    assert.equal(nail.in, c.id)
    if (c === wet) l.sim.runFor(20)
    const before = { massG: nail.massG, coat: { ...nail.coat }, mass0: nail.mass0 }
    const tongs = l.put('tongs', c.x + 80, { y: 0 })
    const r = l.sim.dispatch({ type: 'grab', tool: tongs.id, id: nail.id })
    assert.ok(r.ok, JSON.stringify(r.verdict))
    const held = byId(l.sim.state, nail.id)
    assert.equal(held.in, null)
    assert.equal(held.holder, tongs.id)
    assert.equal(byId(l.sim.state, tongs.id).load.id, nail.id)
    assert.deepEqual({ massG: held.massG, coat: held.coat, mass0: held.mass0 }, before, 'grabbing does not change the chemistry')
    if (c === wet) assert.ok((held.coat.Cu || 0) > 1e-4, 'reacted nail keeps its copper coat')
    // The held piece follows the tool, and stops reacting while out of the liquid.
    l.sim.dispatch({ type: 'move', id: tongs.id, x: 600, y: 100 })
    assert.equal(byId(l.sim.state, nail.id).x, 600)
    const m = byId(l.sim.state, nail.id).massG
    l.sim.runFor(5)
    assert.equal(byId(l.sim.state, nail.id).massG, m)
    // Released over the bench: on the bench, not floating; released over a vessel: falls in.
    l.sim.dispatch({ type: 'release', tool: tongs.id })
    assert.deepEqual([byId(l.sim.state, nail.id).y, byId(l.sim.state, nail.id).in, byId(l.sim.state, nail.id).holder], [0, null, null])
    l.sim.dispatch({ type: 'remove', id: nail.id })
  }
})
test('grab: refused when used up, powder in solution, sodium reacting, or tongs already full', () => {
  const l = lab()
  const A = l.put('beaker250', 200)
  l.fill(A, 'water', 100)
  const nail = nailIn(l, A)
  const tongs = l.put('tongs', 400, { y: 0 })
  byId(l.sim.state, nail.id).massG = 0
  let r = l.sim.dispatch({ type: 'grab', tool: tongs.id, id: nail.id })
  assert.equal(r.verdict.level, 'block')
  assert.match(r.verdict.reasons.join(' '), /phản ứng hết/)
  const salt = dropSolid(l, A, 'nacl-s', 2)
  l.sim.runFor(0.5)
  r = l.sim.dispatch({ type: 'grab', tool: tongs.id, id: salt.id })
  assert.equal(r.verdict.level, 'block', 'powder in solution cannot be picked back')
  const na = l.put('dish', 600)
  l.fill(na, 'water', 150)
  const piece = dropSolid(l, na, 'na', 0.1)
  l.sim.runFor(0.5)
  r = l.sim.dispatch({ type: 'grab', tool: tongs.id, id: piece.id })
  assert.equal(r.verdict.level, 'block', 'sodium reacting in water is not picked out')
  const B = l.put('beaker100', 800)
  const zn = nailIn(l, B, 1)
  const full = l.put('tongs', 820, { y: 0 })
  l.sim.dispatch({ type: 'pick', tool: full.id, reagent: 'cu', massG: 1 })
  r = l.sim.dispatch({ type: 'grab', tool: full.id, id: zn.id })
  assert.equal(r.verdict.level, 'block', 'tongs holding something must let go first')
})
test('grab: one undo step back into the vessel; element inventory conserved through grab and release', () => {
  const l = lab()
  const A = l.put('beaker100', 200)
  l.fill(A, 'cuso4', 40)
  const nail = nailIn(l, A)
  l.sim.runFor(10)
  const inv0 = benchInventory(l.sim.state)
  const tongs = l.put('tongs', 300, { y: 0 })
  const inv1 = benchInventory(l.sim.state)
  l.sim.dispatch({ type: 'grab', tool: tongs.id, id: nail.id })
  const inv2 = benchInventory(l.sim.state)
  for (const k of Object.keys(inv0)) { rel(inv1[k], inv0[k], 1e-9, `inventory ${k} before grab`); rel(inv2[k], inv0[k], 1e-9, `inventory ${k} while held`) }
  l.sim.undo()
  assert.equal(byId(l.sim.state, nail.id).in, A.id, 'undo puts the nail back in the beaker')
  assert.equal(byId(l.sim.state, tongs.id).load, null)
  // Removing the tongs while holding lets go of the piece instead of leaving it attached to nothing.
  l.sim.dispatch({ type: 'grab', tool: tongs.id, id: nail.id })
  l.sim.dispatch({ type: 'remove', id: tongs.id })
  const left = byId(l.sim.state, nail.id)
  assert.deepEqual([left.holder, left.y], [null, 0])
  assert.equal(checkInvariants(l.sim.state), null)
})
test('pick from stock creates the held piece as a real object; old saves without it still release', () => {
  const l = lab()
  const A = l.put('beaker100', 200)
  const t = l.put('tongs', 200, { y: 150 })
  const r = l.sim.dispatch({ type: 'pick', tool: t.id, reagent: 'zn', massG: 0.5 })
  assert.equal(byId(l.sim.state, r.id).holder, t.id)
  l.sim.dispatch({ type: 'release', tool: t.id })
  l.sim.runFor(1)
  assert.equal(byId(l.sim.state, r.id).in, A.id)
  const t2 = byId(l.sim.state, t.id)
  t2.load = { reagent: 'zn', massG: 0.3 } // shape of a held load in saves made before this change
  const rel2 = l.sim.dispatch({ type: 'release', tool: t.id })
  l.sim.runFor(1)
  assert.equal(byId(l.sim.state, rel2.id).in, A.id)
  assert.equal(byId(l.sim.state, rel2.id).massG, 0.3)
})
test('labels: vessel letters, names follow the contents, unknown-solution lab hides them', () => {
  const l = lab()
  const A = l.put('beaker100', 200)
  const B = l.put('beaker100', 300)
  assert.deepEqual([label(byId(l.sim.state, A.id)), label(byId(l.sim.state, B.id))], ['Cốc A', 'Cốc B'])
  assert.equal(objectTitle(l.sim.state, A), 'Cốc A — trống')
  l.fill(A, 'cuso4', 20)
  assert.equal(objectTitle(l.sim.state, A), 'Cốc A — CuSO₄')
  l.fill(A, 'hcl', 10)
  assert.equal(objectTitle(l.sim.state, A), 'Cốc A — CuSO₄ + HCl')
  l.sim.dispatch({ type: 'pourExact', from: A.id, to: B.id, mL: 10 })
  assert.equal(objectTitle(l.sim.state, B), 'Cốc B — CuSO₄ + HCl', 'label moves with the liquid, not with the place')
  const nail = dropSolid(l, byId(l.sim.state, A.id), 'fe', 2)
  l.sim.runFor(30)
  assert.match(objectTitle(l.sim.state, byId(l.sim.state, A.id)), /FeSO₄|FeCl₂/, 'reaction product appears in the name')
  assert.match(objectTitle(l.sim.state, byId(l.sim.state, A.id)), /có Đinh sắt \(Fe\)/, 'a small piece is named on its vessel')
  assert.match(objectTitle(l.sim.state, byId(l.sim.state, nail.id)), /^Đinh sắt \(Fe\) · có lớp Cu bám/)
  const sim = createSim(2)
  const roles = GUIDED.find(g => g.id === 'acid-base').setup(sim)
  assert.equal(objectTitle(sim.state, byId(sim.state, roles.A), { hideContents: true }), 'Ống A')
  assert.equal(GUIDED.find(g => g.id === 'acid-base').hideContents, true)
  assert.equal(contentsName({ contents: { liquids: { water: 150, ethanol: 0.14 }, ions: {}, indicators: { phenolphthalein: 0.15 }, precipitates: {} } }), 'Nước + phenolphtalein', 'trace solvent of the indicator is not named')
})
test('guided steps: each has a completion sign and help; waiting steps can be fast-forwarded by the model', () => {
  for (const lab of GUIDED) {
    for (const step of lab.steps) {
      assert.ok(step.done && step.help, `${lab.id}: “${step.text}” needs done + help`)
      for (const n of step.need || []) assert.ok(REAGENT_BY_ID[n.reagent]?.kind === 'solid' && n.massG <= REAGENT_BY_ID[n.reagent].maxMass, `${lab.id}: need ${n.reagent}`)
    }
  }
  // Fast-forward = running the same simulation until the step's own check passes (as the UI does).
  const sim = createSim(3)
  const lab = GUIDED.find(g => g.id === 'metals')
  const roles = lab.setup(sim)
  const t = byId(sim.state, roles.tongs)
  sim.dispatch({ type: 'move', id: t.id, x: byId(sim.state, roles.cu).x, y: 160 })
  sim.dispatch({ type: 'pick', tool: t.id, reagent: 'fe', massG: 0.1 }) // the small nail the old default produced
  sim.dispatch({ type: 'release', tool: t.id })
  sim.runFor(1)
  assert.ok(lab.steps[0].check(sim.state, roles))
  assert.ok(lab.steps[1].wait(sim.state, roles), 'the copper step is a waiting step')
  const t0 = sim.state.t
  while (!lab.steps[1].check(sim.state, roles) && sim.state.t - t0 < 600) sim.runFor(2)
  assert.ok(lab.steps[1].check(sim.state, roles), 'reached by running the model, not by changing constants')
  // Completion is a layer thickness (coat per cm²), and the rate is proportional to area, so the time to a
  // visible coat hardly depends on the nail's size; the default 2 g nail is unchanged (0.8 mmol Cu).
  const small = sim.state.t - t0
  assert.ok(small > 10 && small < 60, `0.1 g nail: ${small.toFixed(0)} s to a visible coat`)
  const sim2 = createSim(3)
  const roles2 = lab.setup(sim2)
  const t2 = byId(sim2.state, roles2.tongs)
  sim2.dispatch({ type: 'move', id: t2.id, x: byId(sim2.state, roles2.cu).x, y: 160 })
  sim2.dispatch({ type: 'pick', tool: t2.id, reagent: 'fe', massG: 2 })
  sim2.dispatch({ type: 'release', tool: t2.id })
  sim2.runFor(1)
  const t3 = sim2.state.t
  while (!lab.steps[1].check(sim2.state, roles2) && sim2.state.t - t3 < 600) sim2.runFor(0.5)
  const nail = sim2.state.objects.find(o => o.reagent === 'fe')
  near(nail.coat.Cu, 8e-4, 3e-5, '2 g nail completes at ≈ 0.8 mmol Cu, as before')
  assert.ok(Math.abs((sim2.state.t - t3) - small) < 0.6 * small, `2 g ${(sim2.state.t - t3).toFixed(0)} s vs 0.1 g ${small.toFixed(0)} s`)
})

// Findings of the independent (Antigravity) audit, reproduced as failing scenarios and fixed in the engine.
test('audit fixes: no fabricated atoms, no overshoot, unsupported before any rule, honest notes', () => {
  const naTotal = st => st.objects.reduce((a, o) => a + (o.contents?.ions['Na+'] || 0) + (o.type === 'solid' && o.reagent === 'nacl-s' ? o.massG / molarMass('NaCl') : 0), 0)
  { // NaCl crystal in HCl (no Na⁺ yet) must dissolve, never grow by "using" Na that is not there.
    const l = lab(11); const b = l.put('beaker100', 300); l.fill(b, 'hcl', 30)
    const k = l.put('spatula', 300, { y: 160 }); l.sim.dispatch({ type: 'pick', tool: k.id, reagent: 'nacl-s', massG: 1 }); l.sim.dispatch({ type: 'release', tool: k.id })
    const n0 = naTotal(l.s()); l.sim.runFor(30)
    near(naTotal(l.s()), n0, 1e-7, 'Na conserved (float rounding only)')
    assert.ok(l.s().objects.find(o => o.type === 'solid').massG < 1, 'it dissolves')
  }
  { // Boiling Na₂CO₃ must not crystallise NaHCO₃.
    const l = lab(12); const b = l.put('beaker100', 300); l.fill(b, 'na2co3', 20)
    byId(l.s(), b.id).T = 100; byId(l.s(), b.id).contents.liquids.water = 2; l.sim.runFor(5)
    assert.ok(!l.s().objects.some(o => o.type === 'solid' && o.reagent === 'nahco3-s'), 'no NaHCO₃ crystal from carbonate')
  }
  { // Mg in a small hot volume of HCl: acid attack stops when the acid is used, it never turns the solution basic.
    const l = lab(13); const b = l.put('beaker100', 300); l.fill(b, 'hcl', 5); byId(l.s(), b.id).T = 95
    const k = l.put('tongs', 300, { y: 160 }); l.sim.dispatch({ type: 'pick', tool: k.id, reagent: 'mg', massG: 0.5 }); l.sim.dispatch({ type: 'release', tool: k.id })
    for (let i = 0; i < 40; i += 1) { l.sim.runFor(0.25); assert.ok(byId(l.s(), b.id).pH < 7.5, `pH ${byId(l.s(), b.id).pH}`) }
    assert.ok(!(byId(l.s(), b.id).contents.precipitates['Mg(OH)2'] > 0), 'no Mg(OH)₂ from HCl')
    assert.ok(l.s().gas.H2 <= 5 * 0.5 / 1000 / 2 + 1e-9, 'H₂ ≤ half the HCl')
  }
  { // Iron in FeCl₃: unsupported (Fe³⁺ redox), no H₂ from its low pH.
    const l = lab(14); const b = l.put('beaker100', 300); l.fill(b, 'fecl3', 30)
    const k = l.put('tongs', 300, { y: 160 }); l.sim.dispatch({ type: 'pick', tool: k.id, reagent: 'fe', massG: 1 }); l.sim.dispatch({ type: 'release', tool: k.id })
    l.sim.runFor(10)
    assert.equal(l.s().gas.H2 || 0, 0, 'no H₂')
    assert.match(l.s().log.map(e => e.text).join('|'), /Chưa hỗ trợ mô phỏng phản ứng này: Fe \+ Fe³⁺/)
  }
  { // FeCl₃ + KI (no solid at all) is reported, not silently ignored — now modelled (2Fe³⁺ + 2I⁻ → 2Fe²⁺ + I₂).
    const l = lab(15); const b = l.put('beaker100', 300); l.fill(b, 'fecl3', 10); l.fill(b, 'ki', 10); l.sim.runFor(1)
    assert.match(l.s().log.map(e => e.text).join('|'), /2Fe³⁺ \+ 2I⁻ → 2Fe²⁺ \+ I₂/)
  }
  { // "Trung hòa" only when H⁺ and OH⁻ meet: CuSO₄ + NaOH is a precipitation, HCl + NaOH is a neutralisation.
    const l = lab(16); const a = l.put('beaker100', 200); l.fill(a, 'cuso4', 20); l.fill(a, 'naoh', 4)
    const b = l.put('beaker100', 400); l.fill(b, 'hcl', 10); l.fill(b, 'naoh', 5); l.sim.runFor(0.5)
    const text = l.s().log.map(e => e.text).join('|')
    assert.ok(!text.includes(`trung hòa trong ${label(byId(l.s(), a.id))}`), 'no neutralisation note for CuSO₄ + NaOH')
    assert.ok(text.includes(`trung hòa trong ${label(byId(l.s(), b.id))}`), 'neutralisation note for HCl + NaOH')
  }
  { // Textbook precipitates now in the registry, from Ksp (CRC).
    for (const [x, y, key] of [['znso4', 'na2co3', 'ZnCO3'], ['bacl2', 'na2co3', 'BaCO3'], ['znso4', 'naoh', 'Zn(OH)2']]) {
      const l = lab(17); const b = l.put('beaker100', 300); l.fill(b, x, 10); l.fill(b, y, 10)
      assert.ok(byId(l.s(), b.id).contents.precipitates[key] > 0, `${x} + ${y} → ${key}`)
    }
  }
  { // A save with a rounding residue (−1e−15 mol after a reactant ran out) still loads.
    const l = lab(18); const b = l.put('beaker100', 300); l.fill(b, 'hcl', 10)
    const save = { schema: 1, state: JSON.parse(JSON.stringify(l.s())) }
    save.state.objects.find(o => o.id === b.id).contents.ions['Cl-'] = -1e-15
    assert.equal(validateSave(save), null)
  }
})

// Second independent review (Antigravity) of the fixes above: each scenario it reported, now checked.
test('review 2: hints fire for real gaps only; no sulfate false positives; no mass from boiling; honest notes', () => {
  const logOf = l => l.s().log.map(e => e.text).join('|')
  const sol = (pairs, seed = 21) => { const l = lab(seed); const b = l.put('beaker250', 300); for (const [r, mL] of pairs) l.fill(b, r, mL); l.sim.runFor(0.5); return { l, b: byId(l.s(), b.id) } }
  assert.match(logOf(sol([['znso4', 20], ['naoh', 50]]).l), /Zn\(OH\)₂ lưỡng tính/, 'excess base on Zn(OH)₂ is flagged')
  assert.match(logOf(sol([['cuso4', 10], ['nh3', 60]]).l), /\[Cu\(NH₃\)₄\]²⁺/, 'Cu²⁺ + excess NH₃: the complex is reported')
  assert.doesNotMatch(logOf(sol([['agno3', 10], ['na2co3', 40]]).l), /Ag₂O/, 'Ag₂CO₃ + excess carbonate is not called Ag₂O')
  const s = sol([['na2so4', 10], ['agno3', 5]])
  assert.ok(!Object.keys(s.b.contents.precipitates).some(k => s.b.contents.precipitates[k] > 0), 'Na₂SO₄ + AgNO₃ stays clear (school Cl⁻/SO₄²⁻ test)')
  assert.doesNotMatch(logOf(sol([['cuso4', 20], ['naoh', 50]]).l), /trung hòa/, 'CuSO₄ + 50 mL NaOH is not a neutralisation')
  { // Zn in strong base: unsupported, not "no reaction because Na is stronger".
    const l = lab(22); const b = l.put('beaker100', 300); l.fill(b, 'naoh', 40)
    const k = l.put('tongs', 300, { y: 160 }); l.sim.dispatch({ type: 'pick', tool: k.id, reagent: 'zn', massG: 0.5 }); l.sim.dispatch({ type: 'release', tool: k.id }); l.sim.runFor(2)
    assert.match(logOf(l), /Zn tan trong kiềm mạnh/); assert.doesNotMatch(logOf(l), /Không có phản ứng: Zn/)
  }
  { // Boiling a salt solution down with a crystal in it never adds more salt than was dissolved.
    const l = lab(23); const b = l.put('beaker100', 300); l.fill(b, 'water', 5)
    const k = l.put('spatula', 300, { y: 160 }); l.sim.dispatch({ type: 'pick', tool: k.id, reagent: 'nacl-s', massG: 2 }); l.sim.dispatch({ type: 'release', tool: k.id }); l.sim.runFor(20)
    const before = l.s().objects.filter(o => o.type === 'solid').reduce((a, o) => a + o.massG, 0) + (byId(l.s(), b.id).contents.ions['Na+'] || 0) * molarMass('NaCl')
    const c = byId(l.s(), b.id); c.T = 100; c.contents.liquids.water = 0.1; l.sim.runFor(2)
    const after = l.s().objects.filter(o => o.type === 'solid').reduce((a, o) => a + o.massG, 0) + (byId(l.s(), b.id).contents.ions['Na+'] || 0) * molarMass('NaCl')
    near(after, before, 1e-6, 'NaCl mass conserved while boiling down')
  }
})

// Metal + metal-ion pairs without a rule are classified by E° (CRC), never silently ignored or given a product.
test('reaction coverage: unmodelled metal/ion pairs are NO_REACTION or UNSUPPORTED by E°, with no invented product', () => {
  const run = (metal, sol) => {
    const l = lab(9)
    const b = l.put('beaker100', 300)
    l.fill(b, sol, 40)
    const ions = JSON.stringify(byId(l.s(), b.id).contents.ions)
    const k = l.put('tongs', 300, { y: 160 })
    l.sim.dispatch({ type: 'pick', tool: k.id, reagent: metal, massG: 0.5 }, { confirmed: true })
    l.sim.dispatch({ type: 'release', tool: k.id }, { confirmed: true })
    l.sim.runFor(10)
    const s = l.s().objects.find(o => o.type === 'solid')
    return { text: l.s().log.map(e => e.text).join(' | '), mass: s.massG, coat: s.coat, ions, after: JSON.stringify(byId(l.s(), b.id).contents.ions) }
  }
  for (const [metal, sol] of [['mg', 'cuso4'], ['fe', 'agno3'], ['zn', 'agno3']]) {
    const r = run(metal, sol)
    assert.match(r.text, /Chưa hỗ trợ mô phỏng phản ứng này/, `${metal} + ${sol}: ${r.text}`)
    assert.equal(r.mass, 0.5, `${metal} + ${sol}: no invented consumption`)
    assert.deepEqual(r.coat, {}, `${metal} + ${sol}: no invented deposit`)
    assert.equal(r.after, r.ions, `${metal} + ${sol}: solution unchanged`)
  }
  for (const [metal, sol] of [['zn', 'mgcl2'], ['fe', 'mgcl2']]) {
    const r = run(metal, sol)
    assert.match(r.text, /Không có phản ứng: .* yếu hơn/, `${metal} + ${sol}: ${r.text}`)
    assert.equal(r.mass, 0.5)
  }
  assert.match(run('cu', 'znso4').text, /Không có phản ứng: Cu yếu hơn Zn/, 'curated NO_REACTION text still wins')
  assert.ok(run('fe', 'cuso4').coat.Cu > 0, 'a modelled pair still reacts')
})

// A guided step is completed only by evidence from its own target objects, never by a bench-wide total.
test('guided steps: gas from another vessel does not complete a step; gas is counted per vessel and conserved', () => {
  const sim = createSim(8)
  const lab = GUIDED.find(g => g.id === 'metals')
  const roles = lab.setup(sim)
  const t = byId(sim.state, roles.tongs)
  // Zinc into the WATER dish (wrong vessel) — no H₂ from zinc there; then a second acid beaker elsewhere makes H₂.
  const other = sim.dispatch({ type: 'add', equipmentType: 'beaker100', x: 120, y: 0 }, { record: false }).id
  sim.dispatch({ type: 'addReagentTo', id: other, reagent: 'hcl', mL: 40 }, { record: false })
  sim.dispatch({ type: 'move', id: t.id, x: 120, y: 160 })
  sim.dispatch({ type: 'pick', tool: t.id, reagent: 'zn', massG: 0.5 })
  sim.dispatch({ type: 'release', tool: t.id })
  sim.runFor(20)
  assert.ok(sim.state.gas.H2 > 2e-5, 'H₂ was made on the bench')
  assert.equal(lab.steps[2].check(sim.state, roles), false, 'but not in the step’s acid beaker: step 3 not done')
  const vessels = sim.state.objects.filter(o => o.gasOut)
  near(vessels.reduce((a, c) => a + (c.gasOut.H2 || 0), 0), sim.state.gas.H2, 1e-12, 'per-vessel H₂ adds up to the bench total')
  // Zinc into the right beaker completes it.
  sim.dispatch({ type: 'move', id: t.id, x: byId(sim.state, roles.acid).x, y: 160 })
  sim.dispatch({ type: 'pick', tool: t.id, reagent: 'zn', massG: 0.5 })
  sim.dispatch({ type: 'release', tool: t.id })
  let n = 0
  while (!lab.steps[2].check(sim.state, roles) && n++ < 120) sim.runFor(0.5)
  assert.ok(lab.steps[2].check(sim.state, roles))
})

// CL7-QA-001: the precipitate step states how much NaOH the model needs and reports progress from state.
test('guided precipitate: NaOH amount is stated from the model, progress is quantitative, drops reach it', () => {
  const lab = GUIDED.find(g => g.id === 'precipitate')
  const step = lab.steps[0]
  assert.ok(!/vài lần/.test(step.help), 'help must not say “vài lần” when the model has a threshold')
  const sim = createSim(4)
  const roles = lab.setup(sim)
  const beaker = () => byId(sim.state, roles.beaker)
  // Independent of the UI: bisection on copies of the vessel's contents with the engine's mix().
  const need = moreToAdd(beaker().contents, 'naoh', c => (c.precipitates['Cu(OH)2'] || 0) > 2e-4)
  assert.ok(need > 2.5 && need < 3.5, `model threshold ≈ 3 mL as the step text says (${need})`)
  assert.ok(/3 mL/.test(step.text))
  assert.match(step.progress(sim.state, roles), /Chưa nhỏ/)
  // A student fills the 2 mL dropper and dispenses 10 drops at a time.
  const d = sim.dispatch({ type: 'add', equipmentType: 'dropper', x: 400, y: 150 }, { record: false }).id
  let presses = 0, fills = 0
  while (!step.check(sim.state, roles) && presses < 40) {
    if (totalVolumeML(byId(sim.state, d).contents) < 0.5 - 1e-9) {
      sim.dispatch({ type: 'move', id: d, x: byId(sim.state, roles.naoh).x, y: 10 }, { record: false })
      sim.dispatch({ type: 'aspirate', tool: d, from: roles.naoh, mL: 2 }, { record: false }); fills += 1
    }
    sim.dispatch({ type: 'move', id: d, x: beaker().x, y: 70 + 14 }, { record: false }) // where the action bar puts it: rim + 14 mm
    sim.dispatch({ type: 'dispense', tool: d, drops: 10 }, { record: false }); presses += 1
    sim.runFor(1)
    if (!step.check(sim.state, roles)) assert.match(step.progress(sim.state, roles), /Cần thêm khoảng \d+(,\d+)? mL \(\d+ giọt\)/)
  }
  assert.ok(step.check(sim.state, roles), 'Cu(OH)₂ formed by the engine')
  assert.ok(presses <= 7 && fills <= 2, `10-drop presses ${presses}, fills ${fills}`)
  assert.match(step.progress(sim.state, roles), /đã xuất hiện/)
})

test('dropper: every drop of a 10-drop burst just above a beaker lands in it (none spill on the bench)', () => {
  const l = lab(6)
  const b = l.put('beaker100', 300)
  l.fill(b, 'water', 20)
  const bottle = l.put('bottle', 450, { reagent: 'naoh' })
  const d = l.put('dropper', 450, { y: 10 })
  l.sim.dispatch({ type: 'aspirate', tool: d.id, from: bottle.id, mL: 2 })
  for (const [y, drops] of [[70 + 14, 10], [70 + 14, 5], [70 + 2, 10]]) {
    const before = byId(l.s(), b.id).contents.ions['Na+'] || 0
    l.sim.dispatch({ type: 'move', id: d.id, x: 300, y })
    l.sim.dispatch({ type: 'dispense', tool: d.id, drops })
    l.sim.runFor(2)
    assert.equal(l.s().drops.length, 0)
    near((byId(l.s(), b.id).contents.ions['Na+'] || 0) - before, drops * 0.05 * 0.5 / 1000, 1e-9, `${drops} drops from y=${y}: NaOH that reached the beaker`)
  }
})

test('solvent: ethanol is not water — no pH, measured mixture density, oil sinks in ethanol, bp from the CRC table', () => {
  // Pure ethanol: pH does not apply; litmus/pH meter must not report an aqueous pH.
  const l = lab(31); const b = l.put('beaker100', 300); l.fill(b, 'ethanol', 20); l.sim.runFor(0.5)
  assert.equal(byId(l.s(), b.id).pH, null, 'pure ethanol has no aqueous pH')
  assert.ok(Object.keys(l.s().notes).some(k => k.startsWith('solvent-eth-')), 'says why there is no pH')
  // 50 % mass ethanol → 0.90985 g/mL at 25 °C (Lange); ideal mass-average would be 0.8794 (wrong).
  const mix50 = { ...emptyContents(), liquids: { water: 50 / 0.997, ethanol: 50 / 0.785 } }
  near(polarPhase(mix50).density, 0.90985, 1e-4, '50 wt% density')
  // Indicator drops (ethanol solvent) keep the pH scale: 1 drop in 5 mL water.
  const ind = { ...emptyContents(), liquids: { water: 5, ethanol: 0.05 } }
  assert.ok(polarPhase(ind).pHApplies)
  near(pHOf({ ...ind, ions: {} }), 7, 0.01, 'water with one indicator drop')
  assert.equal(pHOf({ ...emptyContents(), liquids: { water: 5, ethanol: 5 }, ions: {} }), null, '50 % v/v ethanol: no pH')
  // Oil (0.92) floats on water (0.997) but sinks in ethanol (0.785): the upper layer pours first.
  assert.equal(oilBelow({ ...emptyContents(), liquids: { water: 10, oil: 3 } }), false)
  const eo = { ...emptyContents(), liquids: { ethanol: 10, oil: 3 } }
  assert.equal(oilBelow(eo), true)
  const out = withdraw(eo, 2)
  near(out.liquids.ethanol || 0, 2, 1e-9, 'pouring takes the top (ethanol) layer'); assert.ok(!(out.liquids.oil > 0))
  // Boiling points (CRC): water 100, ethanol ≈ 78, 10 wt% ethanol 90 °C with 61 wt% ethanol vapour.
  near(boilingOf({ ...emptyContents(), liquids: { water: 10 } }).T, 100, 1e-9, 'water bp')
  near(boilingOf({ ...emptyContents(), liquids: { ethanol: 10 } }).T, 78.3, 1e-9, 'ethanol bp')
  const ten = { ...emptyContents(), liquids: { water: 90 / 0.997, ethanol: 10 / 0.785 } }
  near(boilingOf(ten).T, 90, 1e-6, '10 wt% bp'); near(boilingOf(ten).vapourWt, 61, 1e-6, '10 wt% vapour')
  // Heating pure ethanol on a burner: it boils near 78 °C and never reaches 100 °C while liquid remains.
  const h = lab(32); const burner = h.put('burner', 200); const bk = h.put('beaker100', 500); h.fill(bk, 'ethanol', 30)
  h.sim.dispatch({ type: 'burner', id: burner.id, on: true }, { record: false })
  h.sim.dispatch({ type: 'move', id: bk.id, x: 200, y: 0 }, { confirmed: true, record: false })
  let maxT = 0
  for (let i = 0; i < 200 && (byId(h.s(), bk.id).contents.liquids.ethanol || 0) > 5; i += 1) { h.sim.runFor(1); maxT = Math.max(maxT, byId(h.s(), bk.id).T) }
  const e = byId(h.s(), bk.id)
  assert.ok((e.contents.liquids.ethanol || 0) < 30, 'ethanol evaporated'); assert.ok(maxT < 79 && maxT > 77.5, `boils at ~78 °C, max ${maxT}`)
  assert.ok(h.s().ethanolVapour > 0 && Object.keys(h.s().notes).some(k => k.startsWith('boil-eth-')))
  // Sodium in pure ethanol: real reaction, not modelled → said so, no water reaction, no H₂ invented.
  const n = lab(33); const t = n.put('beaker100', 300); n.fill(t, 'ethanol', 20)
  const tg = n.put('tongs', 300, { y: 160 }); n.sim.dispatch({ type: 'pick', tool: tg.id, reagent: 'na', massG: 0.1 }, { confirmed: true })
  assert.equal(n.sim.dispatch({ type: 'release', tool: tg.id }, { confirmed: true }).verdict.level, 'block', 'safety: Na needs ≥ 50 mL water')
  const na = n.s().objects.find(o => o.type === 'solid'); na.in = t.id; na.ly = 0; n.sim.runFor(5) // as if it got in anyway
  assert.ok(!(n.s().gas.H2 > 0), 'no H₂ from the water rule'); assert.match(byId(n.s(), t.id).unsupported || '', /etanol/)
})

// Third independent review (Antigravity, science): each confirmed scenario, now checked.
test('review 3: salts before redox, no redox in base, indicator drops keep pH, oil layer insulates, honest electrolysis', () => {
  const mixOf = list => { const c = emptyContents(); for (const [id, mL] of list) mix(c, parcel(id, mL)); return c }
  // Ag⁺ + Cu²⁺ + I⁻: AgI (Ksp 8.5e-17) takes the iodide before Cu²⁺ can oxidise it.
  let c = mixOf([['agno3', 10], ['cuso4', 10], ['ki', 10]])
  near(c.precipitates.AgI, 1e-3, 1e-8, 'AgI'); assert.ok(!(c.precipitates.CuI > 1e-8) && !(c.ions.I2 > 1e-8), 'no CuI/I₂')
  // Excess base first: Fe(OH)₃ and no iodine.
  c = mixOf([['naoh', 20], ['ki', 10], ['fecl3', 10]])
  assert.ok(c.precipitates['Fe(OH)3'] > 1e-4 && !(c.ions.I2 > 0) && !(c.precipitates.I2s > 0) && !(c.precipitates['Fe(OH)2'] > 1e-8), 'no redox in base')
  // Three drops of phenolphthalein (50 % ethanol) in 1 mL NaOH: still an aqueous pH, still pink.
  c = mixOf([['naoh', 1], ['phenolphthalein', 0.15]])
  near(pHOf(c), 13.64, 0.05, 'pH kept'); near(c.liquids.ethanol, 0.075, 1e-9, 'half of the drops is ethanol')
  // Na under a floating oil layer rests on the water, below the oil top.
  const l = lab(41); const b = l.put('beaker250', 300); l.fill(b, 'water', 60); l.fill(b, 'oil', 40)
  const k = l.put('tongs', 300, { y: 200 }); l.sim.dispatch({ type: 'pick', tool: k.id, reagent: 'na', massG: 0.1 }, { confirmed: true }); l.sim.dispatch({ type: 'release', tool: k.id }, { confirmed: true }); l.sim.runFor(1)
  const na = l.s().objects.find(o => o.type === 'solid' && o.reagent === 'na')
  assert.ok(na.ly < levelForVolume('beaker250', 62) && na.ly > levelForVolume('beaker250', 50), `Na at the oil/water interface: ${na.ly}`)
  // Water is used by 2Na + 2H₂O.
  const w0 = 60; l.sim.runFor(60); assert.ok(byId(l.s(), b.id).contents.liquids.water < w0, 'water consumed')
  // pH meter tip only in the oil: no reading; electrodes only in oil: no current.
  const m = lab(42); const v = m.put('beaker100', 300); m.fill(v, 'cucl2', 20); m.fill(v, 'oil', 40)
  const top = surfaceY(byId(m.s(), v.id))
  const ph = m.put('phMeter', 300, { y: top - 4 }); m.sim.dispatch({ type: 'move', id: ph.id, x: 300, y: top - 4 }); m.sim.runFor(0.2)
  assert.equal(byId(m.s(), ph.id).reading, null, 'probe in oil reads nothing')
  // Electrolysis: trace chloride is outside the CuCl₂ model; plain KI is not called an interference.
  const e = lab(43); const B = e.put('beaker100', 300); e.fill(B, 'cuso4', 50); e.fill(B, 'nacl', 0.05)
  const el = e.put('electrodes', 300, { y: 10 }); const p = e.put('power', 450)
  e.sim.dispatch({ type: 'wire', from: p.id, to: el.id }); e.sim.dispatch({ type: 'power', id: p.id, on: true, volts: 6 }, { confirmed: true }); e.sim.runFor(1)
  assert.ok(!(e.s().gas.Cl2 > 0)); assert.match(byId(e.s(), p.id).status, /Cl⁻ quá loãng/)
  const k2 = lab(44); const K = k2.put('beaker100', 300); k2.fill(K, 'ki', 50)
  const el2 = k2.put('electrodes', 300, { y: 10 }); const p2 = k2.put('power', 450)
  k2.sim.dispatch({ type: 'wire', from: p2.id, to: el2.id }); k2.sim.dispatch({ type: 'power', id: p2.id, on: true, volts: 6 }, { confirmed: true }); k2.sim.runFor(1)
  assert.match(byId(k2.s(), p2.id).status, /chưa được mô hình hóa \(mô hình hỗ trợ dung dịch CuCl₂\)/)
  // AgNO₃ + a little NaOH is flagged (Ag₂O), Ag₂CO₃ in carbonate is not.
  const a = lab(45); const A = a.put('beaker100', 300); a.fill(A, 'agno3', 10); a.fill(A, 'naoh', 3); a.sim.runFor(0.5)
  assert.match(a.s().log.map(x => x.text).join('|'), /Ag₂O/)
})

// Every INVALID manifest entry: the command is refused by safety.js (blocked, not just warned).
test('safety: every blocked condition in the manifest is refused', () => {
  const block = (r, why) => { assert.equal(r.verdict?.level, 'block', JSON.stringify(r.verdict)); if (why) assert.match(r.verdict.reasons.join(' | '), why) }
  const naInto = (vessel, reagent, mL) => {
    const l = lab(61); const v = l.put(vessel, 300); if (reagent) l.fill(v, reagent, mL)
    const k = l.put('tongs', 300, { y: 160 })
    l.sim.dispatch({ type: 'pick', tool: k.id, reagent: 'na', massG: 0.1 }, { confirmed: true })
    return l.sim.dispatch({ type: 'release', tool: k.id }, { confirmed: true })
  }
  block(naInto('beaker250', 'hcl', 120), /axit/) // Na + acid
  block(naInto('testTube', 'water', 15), /miệng hẹp/); block(naInto('cylinder', 'water', 50), /miệng hẹp/) // narrow mouth
  block(naInto('beaker250', 'water', 30), /50 mL/) // < 50 mL water
  for (const type of ['cylinder', 'dish']) { // not heat-resistant
    const l = lab(62); const b = l.put('burner', 200); const v = l.put(type, 450)
    l.sim.dispatch({ type: 'burner', id: b.id, on: true }, { record: false })
    block(l.sim.dispatch({ type: 'move', id: v.id, x: 200, y: 0 }), /không chịu nhiệt/)
  }
  { const l = lab(63); const p = l.put('power', 300); block(l.sim.dispatch({ type: 'power', id: p.id, on: true, volts: 15 }, { confirmed: true }), /12 V/) } // > 12 V
  { // wrong tool both ways
    const l = lab(64); const sp = l.put('spatula', 300, { y: 160 }); const k = l.put('tongs', 400, { y: 160 })
    block(l.sim.dispatch({ type: 'pick', tool: sp.id, reagent: 'na', massG: 0.1 }, { confirmed: true }), /dùng kẹp/)
    block(l.sim.dispatch({ type: 'pick', tool: k.id, reagent: 'nacl-s', massG: 1 }, { confirmed: true }), /dùng thìa/)
    block(l.sim.dispatch({ type: 'pick', tool: k.id, reagent: 'na', massG: 0.5 }, { confirmed: true }), /giới hạn an toàn/) // over the model's safe amount
  }
  { // a cracked vessel is not heated
    const l = lab(65); const b = l.put('burner', 200); const v = l.put('beaker100', 450); l.fill(v, 'water', 20)
    l.sim.dispatch({ type: 'burner', id: b.id, on: true }, { record: false })
    v.condition = 'CRACKED' // set up the precondition directly (cracking itself is covered by the damage test)
    block(l.sim.dispatch({ type: 'move', id: v.id, x: 200, y: 0 }, { confirmed: true }), /nứt/)
  }
})

// Every electrolysis interference in the manifest: the cell refuses, and no Cu or Cl₂ is invented.
test('electrolysis refuses every interference: no Cu, no Cl₂, the reason is named', () => {
  // Amounts above the 1 % trace threshold (KI is 0,1 M). In I⁻'s case the redox on mixing leaves I₂, also refused.
  // Ag⁺ cannot stay free next to CuCl₂'s chloride (AgCl, Ksp 1,8·10⁻¹⁰), so it is checked as "no refusal" below.
  const ADD = { 'I-': [['ki', 20]], I2: [['ki', 20]], 'Fe3+': [['fecl3', 5]], 'Fe2+': [['feso4', 5]], 'NO3-': [['hno3', 10]], NH3: [['nh3', 60]] }
  for (const x of ELECTRO.electrolysisCuCl2.interferes) {
    if (!ADD[x.ion]) continue
    const l = lab(70); const B = l.put('beaker250', 300); l.fill(B, 'cucl2', x.ion === 'NH3' ? 10 : 40) // NH₃ must be in excess over 2·Cu²⁺
    for (const [r, mL] of ADD[x.ion]) l.fill(B, r, mL)
    const el = l.put('electrodes', 300, { y: 10 }); const p = l.put('power', 450)
    l.sim.dispatch({ type: 'wire', from: p.id, to: el.id }); l.sim.dispatch({ type: 'power', id: p.id, on: true, volts: 6 }, { confirmed: true }); l.sim.runFor(5)
    assert.ok(!(l.s().gas.Cl2 > 0) && !(byId(l.s(), el.id).cuDeposit > 0), `${x.ion}: nothing invented`)
    const status = byId(l.s(), p.id).status
    // I⁻ never stays in CuCl₂ (the redox on mixing turns it into CuI + I₂), so its case refuses with the I₂ reason.
    const expected = x.ion === 'I-' ? ELECTRO.electrolysisCuCl2.interferes.find(y => y.ion === 'I2').why : x.why
    assert.ok(status.includes(expected), `${x.ion}: ${status}`)
    assert.equal(checkInvariants(l.s()), null)
  }
  // Not interferences: Ag⁺ taken out as AgCl, and NH₄⁺ (a little NH₃ in the acidic CuCl₂ is all protonated).
  for (const [r, mL] of [['agno3', 20], ['nh3', 3]]) {
    const l = lab(71); const B = l.put('beaker250', 300); l.fill(B, 'cucl2', 40); l.fill(B, r, mL)
    const el = l.put('electrodes', 300, { y: 10 }); const p = l.put('power', 450)
    l.sim.dispatch({ type: 'wire', from: p.id, to: el.id }); l.sim.dispatch({ type: 'power', id: p.id, on: true, volts: 6 }, { confirmed: true }); l.sim.runFor(5)
    assert.match(byId(l.s(), p.id).status, /Đang điện phân/, `${r}: ${byId(l.s(), p.id).status}`)
  }
})

// Round 4: ammine complexes are modelled (stepwise β, Ksp, charge and NH₃ mass balance), not only flagged.
test('ammine complexes: model — Cu(OH)₂ forms then dissolves in excess NH₃, AgCl dissolves, AgI stays, mass is conserved', () => {
  const run = (vessel, steps, dt = 0.2) => {
    const l = lab(80); const B = l.put(vessel, 300)
    for (const [r, mL, n = 1] of steps) for (let i = 0; i < n; i += 1) { l.fill(B, r, mL / n); l.sim.runFor(dt) }
    const c = byId(l.s(), B.id)
    return { l, c, notes: Object.keys(l.s().notes), cx: ammineComplexes(c.contents) }
  }
  // Expected from the constants alone (independent closed form at full complexation): with all Cu as Cu(NH₃)₄²⁺ in
  // 35 mL, free NH₃ L = (C_N − 4·C_Cu) minus NH₄⁺; the solid must be gone when Ksp > [Cu²⁺]·[OH⁻]².
  { // Drop-wise NH₃ 2 M into CuSO₄: pale-blue Cu(OH)₂ first, then the deep-blue complex, no solid left.
    const a = run('beaker100', [['cuso4', 5], ['nh3-2m', 2, 4]])
    assert.ok((a.c.contents.precipitates['Cu(OH)2'] || 0) > 1e-4, 'a little NH₃: Cu(OH)₂ precipitates')
    const before = (a.c.contents.ions['Cu2+'] || 0) + (a.c.contents.precipitates['Cu(OH)2'] || 0)
    for (let i = 0; i < 28; i += 1) { a.l.fill(a.c, 'nh3-2m', 1); a.l.sim.runFor(0.1) }
    const c = byId(a.l.s(), a.c.id)
    const cx = ammineComplexes(c.contents)['Cu2+'] || 0
    assert.ok(!((c.contents.precipitates['Cu(OH)2'] || 0) > 1e-6), `excess NH₃ 2 M: Cu(OH)₂ dissolved (${c.contents.precipitates['Cu(OH)2']})`)
    rel(cx, 2.5e-3, 0.01, 'all Cu held as ammine complexes')
    rel((c.contents.ions['Cu2+'] || 0) + (c.contents.precipitates['Cu(OH)2'] || 0), before, 1e-9, 'copper conserved')
    const notes = Object.keys(a.l.s().notes)
    assert.ok(notes.some(k => k.startsWith('ammine-dis-Cu(OH)2-')), 'dissolution is reported')
    assert.ok(notes.some(k => k.startsWith('ammine-Cu2+-')), 'complex is reported')
    assert.ok(!c.vis.parts.some(p => p.key === 'Cu(OH)2'), 'no blue grains left once dissolved')
    // Colour follows the complex: darker and bluer than the same copper as Cu²⁺(aq).
    const plain = run('beaker100', [['cuso4', 5], ['water', 30]]).c
    assert.ok(c.vis.target[0] < plain.vis.target[0] && c.vis.target[1] < plain.vis.target[1], `deep blue: ${c.vis.target} vs ${plain.vis.target}`)
  }
  { // Dilute NH₃ 0,5 M cannot finish dissolving it (no NH₄⁺ buffer left for the last solid): partial, stated in the manifest.
    const { c, cx } = run('beaker250', [['cuso4', 5], ['nh3', 50, 10]])
    const share = (cx['Cu2+'] || 0) / 2.5e-3
    assert.ok(share > 0.6 && share < 0.95, `0,5 M NH₃: partial (${share})`)
    assert.ok((c.contents.precipitates['Cu(OH)2'] || 0) > 0, 'some Cu(OH)₂ stays')
  }
  { // AgCl dissolves in NH₃, AgI does not (Ksp·β₂ ≈ 3·10⁻³ vs 1·10⁻⁹).
    const agcl = run('beaker100', [['agno3', 10], ['nacl', 2], ['nh3-2m', 15, 5]])
    assert.ok(!((agcl.c.contents.precipitates.AgCl || 0) > 1e-5), `AgCl dissolved: ${agcl.c.contents.precipitates.AgCl}`)
    assert.ok(agcl.notes.some(k => k.startsWith('ammine-Ag+-')))
    const agi = run('beaker100', [['agno3', 10], ['ki', 10], ['nh3-2m', 30, 5]])
    assert.ok(agi.c.contents.precipitates.AgI > 0.99e-3, 'AgI stays')
    assert.ok(!agi.notes.some(k => k.startsWith('ammine-')), 'no complex reported over AgI')
  }
  { // Acid dissolving Cu(OH)₂ next to some complex is not called "dissolved in excess NH₃".
    const { notes } = run('beaker250', [['cuso4', 5], ['nh3', 20], ['hcl', 30, 3]])
    assert.ok(!notes.some(k => k.startsWith('ammine-dis-')), `acid: ${notes.filter(k => k.startsWith('ammine'))}`)
  }
  { // Review 4: ZnSO₄ + NH₃ 2 M is the ammine complex, not the amphoteric [Zn(OH)₄]²⁻ hint (NH₃ 2 M is pH ≈ 11,8).
    const { notes } = run('beaker100', [['znso4', 5], ['nh3-2m', 30, 5]])
    assert.ok(notes.some(k => k.startsWith('ammine-Zn2+-')))
    assert.ok(!notes.some(k => k.startsWith('ionhint-Zn2+-')), `no amphoteric hint: ${notes}`)
    const naoh = run('beaker250', [['znso4', 20], ['naoh', 50]]).notes
    assert.ok(naoh.some(k => k.startsWith('ionhint-Zn2+-')), 'excess NaOH still flagged')
  }
  { // Review 4: CuCl₂ just past 2 NH₃ : 1 Cu — almost all Cu in Cu(OH)₂, the dissolved rest is complex: not electrolysed as CuCl₂.
    const { l, c } = run('beaker250', [['cucl2', 10], ['water', 40], ['nh3-2m', 5.5]], 0.1)
    const el = l.put('electrodes', 300, { y: 10 }); const p = l.put('power', 450)
    l.sim.dispatch({ type: 'wire', from: p.id, to: el.id }); l.sim.dispatch({ type: 'power', id: p.id, on: true, volts: 6 }, { confirmed: true }); l.sim.runFor(1)
    assert.match(byId(l.s(), p.id).status, /phức/, byId(l.s(), p.id).status)
    assert.ok(!(byId(l.s(), el.id).cuDeposit > 0), 'no copper deposited')
    assert.ok(c)
  }
  { // Review 4 labels: HCl with a trace of NH₃ stays an acid; NH₃ is not named when it is all NH₄⁺.
    const t = fills => { const r = run('beaker100', fills); return contentsName(r.c) }
    assert.match(t([['hcl', 20], ['nh3', 1]]), /HCl/)
    assert.doesNotMatch(t([['cuso4', 10], ['nh3', 2]]), /NH₃(?!\))/)
    assert.match(t([['cuso4', 5], ['nh3-2m', 30]]), /\[Cu\(NH₃\)₄\]SO₄/)
  }
  { // AgNO₃ + excess NH₃: the complex, not Ag₂O as well.
    const { notes } = run('beaker100', [['agno3', 10], ['nh3', 10]])
    assert.ok(notes.some(k => k.startsWith('ammine-Ag+-')))
    assert.ok(!notes.some(k => /^ionhint-Ag\+-o/.test(k)), `no Ag₂O hint: ${notes}`)
  }
  { // Trace NH₃ over Cu(OH)₂ in strong base: negligible complex, nothing reported, solid stays.
    const { c, notes } = run('beaker250', [['cucl2', 10], ['naoh', 30], ['nh3', 0.2]])
    assert.ok(!notes.some(k => k.startsWith('ammine-')), 'trace NH₃ in NaOH')
    rel(c.contents.precipitates['Cu(OH)2'], 5e-3, 0.01, 'Cu(OH)₂ stays')
  }
  { // pH of NH₃ alone is unchanged by the speciation code (no metal): pH = 14 + log√(Kb·C).
    const { c } = run('beaker100', [['nh3', 20]])
    near(c.pH, 14 + Math.log10(Math.sqrt(1e-14 / 5.6e-10 * 0.5)), 0.02, 'pH of 0,5 M NH₃')
  }
  // Electrolysis: CuSO₄ + NH₃ (no chloride) and the trace-NH₃-in-base case are not called an ammine interference.
  for (const fills of [[['cuso4', 10], ['nh3', 30]], [['cucl2', 10], ['naoh', 30], ['nh3', 0.2]]]) {
    const { l, c } = run('beaker250', fills.map(([r, mL]) => [r, mL]), 0.1)
    const el = l.put('electrodes', 300, { y: 10 }); const p = l.put('power', 450)
    l.sim.dispatch({ type: 'wire', from: p.id, to: el.id }); l.sim.dispatch({ type: 'power', id: p.id, on: true, volts: 6 }, { confirmed: true }); l.sim.runFor(1)
    assert.doesNotMatch(byId(l.s(), p.id).status, /phức/, `${JSON.stringify(fills)}: ${byId(l.s(), p.id).status}`)
    assert.ok(!(byId(l.s(), c.id).contents.precipitates.CuI > 0))
  }
})

// Registry: every manifest entry with a demo is run on the real engine and must give what it claims.
function runDemo(d) {
  const l = lab(77)
  const v = l.put(d.vessel, 300)
  for (const [r, mL] of d.fill) l.fill(v, r, mL)
  if (d.pour) l.fill(v, d.pour[0], d.pour[1])
  if (d.solid) {
    const k = l.put(R(d.solid[0]).tool, 300, { y: 160 })
    l.sim.dispatch({ type: 'pick', tool: k.id, reagent: d.solid[0], massG: d.solid[1] }, { confirmed: true })
    const r = l.sim.dispatch({ type: 'release', tool: k.id }, { confirmed: true })
    assert.ok(r.ok, `release: ${JSON.stringify(r.verdict)}`)
  }
  l.sim.runFor(d.run)
  return { s: l.s(), c: byId(l.s(), v.id) }
}
for (const e of MANIFEST.filter(x => x.demo)) {
  test(`manifest ${e.status} ${e.id}: ${e.title}`, () => {
    const { s, c } = runDemo(e.demo)
    const x = e.demo.expect
    const solid = s.objects.find(o => o.type === 'solid' && o.in === c.id)
    if (x.gas) assert.ok((c.gasOut?.[x.gas] || 0) > 0, `${x.gas} from this vessel`)
    if (x.ion) assert.ok((c.contents.ions[x.ion] || 0) > 1e-7, `${x.ion} formed`)
    if (x.deposit) assert.ok((solid?.coat?.[x.deposit] || 0) > 0, `${x.deposit} deposited`)
    if (x.ppt) assert.ok((c.contents.precipitates[x.ppt] || 0) > 1e-9, `${x.ppt} precipitated`)
    if (x.note) assert.ok(Object.keys(s.notes).some(k => k.startsWith(x.note)), `note ${x.note}`)
    if (x.oilBelow) assert.ok(oilBelow(c.contents), 'oil below')
    if (x.unsupported) assert.ok(c.unsupported, 'reported as unsupported')
    if (x.noPH) assert.equal(c.pH, null)
    if (x.hint) assert.ok(Object.keys(s.notes).some(k => k.startsWith(x.hint)), `hint ${x.hint} reported`)
    if (e.status === 'NO_REACTION' || e.status === 'UNSUPPORTED') {
      assert.ok(!Object.values(c.gasOut || {}).some(v => v > 0), 'no gas invented')
      assert.ok(!Object.values(solid?.coat || {}).some(v => v > 0), 'no deposit invented')
    }
    assert.equal(checkInvariants(s), null)
  })
}
test('manifest: every entry is complete and every Sandbox suggestion has a demo', () => {
  for (const e of MANIFEST) for (const k of ['id', 'status', 'title', 'inputs', 'conditions', 'products', 'observe', 'model', 'source', 'limits']) assert.ok(e[k] != null && e[k] !== '', `${e.id}.${k}`)
  assert.equal(new Set(MANIFEST.map(e => e.id)).size, MANIFEST.length, 'unique ids')
  assert.ok(DISCOVER.length >= 20 && DISCOVER.every(e => e.demo))
  // An entry without a demo must name unit tests that exist; the report counts the rest as not verified.
  const titles = [...readFileSync(new URL(import.meta.url), 'utf8').matchAll(/^test\('([^']+)'/gm)].map(m => m[1])
  for (const e of MANIFEST) for (const t of e.tests || []) assert.ok(titles.some(x => x.startsWith(t)), `${e.id}: no test titled "${t}…"`)
})

const failed = results.filter(r => !r.pass)
for (const r of results) console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.pass ? '' : `\n      ${r.error}`}`)
console.log(`\nDynamic Lab: ${results.length - failed.length}/${results.length} passed`)
if (failed.length) process.exit(1)
