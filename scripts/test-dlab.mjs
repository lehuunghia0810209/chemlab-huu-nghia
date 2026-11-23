// ChemLab 7.0 Dynamic Lab — unit and integration tests.
// Expected values are computed independently here (closed-form), not read back from the engine.
import assert from 'node:assert/strict'
import { molarMass, REAGENT_BY_ID, solubilityAt } from '../src/dlab/data/materials.js'
import { reagentParcel, mix, pHOf, emptyContents, equilibrate, ionicStrength, solveH, aqueousLitres } from '../src/dlab/engine/chemistry.js'
import { createSim, benchInventory, checkInvariants, snapshot, restore, H } from '../src/dlab/engine/sim.js'
import { levelForVolume, volumeBelow, EQUIPMENT } from '../src/dlab/data/equipment.js'
import { volumeOf, surfaceY, byId } from '../src/dlab/engine/processes.js'
import { migrate, validateSave } from '../src/dlab/persistence.js'
import { GUIDED } from '../src/dlab/guided.js'
import { observe, mergeRepeats, indicatorReading } from '../src/dlab/ui/observations.js'
import { libraryItems, searchLibrary } from '../src/dlab/ui/library.js'

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

const failed = results.filter(r => !r.pass)
for (const r of results) console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.pass ? '' : `\n      ${r.error}`}`)
console.log(`\nDynamic Lab: ${results.length - failed.length}/${results.length} passed`)
if (failed.length) process.exit(1)
