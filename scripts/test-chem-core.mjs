/* =========================================================
   CHEMLAB — CHEMISTRY CORE TESTS
   Electron configurations against NIST ground states and the
   hydrogen-like orbital math against analytic results.
   npm run check:chem
========================================================= */

import assert from 'node:assert/strict'
import {
  getElectronConfiguration,
  orbitalBoxes
} from '../src/chem/electronConfiguration.js'
import {
  createOrbital,
  harmonic,
  orbitalVariants,
  radialFunction,
  nodeCounts,
  sampleDensity,
  sampleGrid
} from '../src/chem/orbitalMath.js'

const results = []

function test(name, fn) {
  try {
    fn()
    results.push({ name, pass: true })
  }
  catch (error) {
    results.push({ name, pass: false, error: error.message })
  }
}

const config = Z => getElectronConfiguration(Z)

/* ---------- electron configuration ---------- */

test('every element 1–118 has exactly Z electrons within capacity', () => {
  for (let Z = 1; Z <= 118; Z += 1) {
    const c = config(Z)
    const total = c.subshells.reduce((sum, item) => sum + item.electrons, 0)
    assert.equal(total, Z, `Z=${Z}`)
    assert.equal(c.shells.reduce((a, b) => a + b, 0), Z, `shells Z=${Z}`)
    for (const item of c.subshells) assert.ok(item.electrons <= item.capacity, `${item.label} over capacity at Z=${Z}`)
  }
})

test('invalid atomic numbers return null', () => {
  for (const value of [0, 119, -1, 1.5, 'abc', null]) assert.equal(getElectronConfiguration(value), null)
})

const CONDENSED = {
  1: '1s¹',
  2: '1s²',
  6: '[He] 2s² 2p²',
  10: '[He] 2s² 2p⁶',
  11: '[Ne] 3s¹',
  24: '[Ar] 3d⁵ 4s¹',
  26: '[Ar] 3d⁶ 4s²',
  29: '[Ar] 3d¹⁰ 4s¹',
  30: '[Ar] 3d¹⁰ 4s²',
  35: '[Ar] 3d¹⁰ 4s² 4p⁵',
  41: '[Kr] 4d⁴ 5s¹',
  42: '[Kr] 4d⁵ 5s¹',
  44: '[Kr] 4d⁷ 5s¹',
  45: '[Kr] 4d⁸ 5s¹',
  46: '[Kr] 4d¹⁰',
  47: '[Kr] 4d¹⁰ 5s¹',
  57: '[Xe] 5d¹ 6s²',
  58: '[Xe] 4f¹ 5d¹ 6s²',
  64: '[Xe] 4f⁷ 5d¹ 6s²',
  71: '[Xe] 4f¹⁴ 5d¹ 6s²',
  74: '[Xe] 4f¹⁴ 5d⁴ 6s²',
  78: '[Xe] 4f¹⁴ 5d⁹ 6s¹',
  79: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹',
  89: '[Rn] 6d¹ 7s²',
  90: '[Rn] 6d² 7s²',
  92: '[Rn] 5f³ 6d¹ 7s²',
  96: '[Rn] 5f⁷ 6d¹ 7s²',
  103: '[Rn] 5f¹⁴ 7s² 7p¹',
  118: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶'
}

test('condensed configurations match NIST ground states', () => {
  for (const [Z, expected] of Object.entries(CONDENSED)) {
    assert.equal(config(Number(Z)).condensed, expected, `Z=${Z}`)
  }
})

test('full configuration is written in shell order (textbook form)', () => {
  assert.equal(config(26).full, '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²')
  assert.equal(config(26).aufbauOrder, '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶')
  assert.equal(config(24).full, '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹')
})

test('electrons per shell', () => {
  assert.deepEqual(config(24).shells, [2, 8, 13, 1])
  assert.deepEqual(config(26).shells, [2, 8, 14, 2])
  assert.deepEqual(config(29).shells, [2, 8, 18, 1])
  assert.deepEqual(config(46).shells, [2, 8, 18, 18])
  assert.deepEqual(config(79).shells, [2, 8, 18, 32, 18, 1])
  assert.equal(config(29).outerShellElectrons, 1)
})

test('unpaired electrons follow Hund\'s rule', () => {
  const expected = { 1: 1, 2: 0, 6: 2, 7: 3, 8: 2, 10: 0, 24: 6, 25: 5, 26: 4, 29: 1, 64: 8 }
  for (const [Z, value] of Object.entries(expected)) {
    assert.equal(config(Number(Z)).unpairedElectrons, value, `Z=${Z}`)
  }
})

test('orbital box filling (Hund) for 2p³ and 2p⁴', () => {
  const p = Z => config(Z).subshells.find(item => item.label === '2p')
  assert.deepEqual(orbitalBoxes(p(7)), [1, 1, 1])
  assert.deepEqual(orbitalBoxes(p(8)), [2, 1, 1])
})

test('exceptions are flagged with an explanation; superheavy configs marked predicted', () => {
  assert.ok(config(29).isException && config(29).exceptionNote)
  assert.ok(!config(26).isException)
  assert.ok(config(104).predicted && !config(103).predicted)
})

/* ---------- orbital math ---------- */

function sphereIntegral(fn, steps = 160) {
  let sum = 0
  for (let i = 0; i < steps; i += 1) {
    const theta = ((i + 0.5) / steps) * Math.PI
    for (let j = 0; j < 2 * steps; j += 1) {
      const phi = ((j + 0.5) / (2 * steps)) * 2 * Math.PI
      const x = Math.sin(theta) * Math.cos(phi)
      const y = Math.sin(theta) * Math.sin(phi)
      const z = Math.cos(theta)
      sum += fn(x, y, z) * Math.sin(theta)
    }
  }
  return sum * (Math.PI / steps) * (Math.PI / steps)
}

test('real spherical harmonics are orthonormal for l = 0…3', () => {
  for (let l = 0; l <= 3; l += 1) {
    const variants = orbitalVariants(l)
    assert.equal(variants.length, 2 * l + 1)
    for (const a of variants) {
      for (const b of variants) {
        const Ya = harmonic(l, a.key)
        const Yb = harmonic(l, b.key)
        const value = sphereIntegral((x, y, z) => Ya(x, y, z) * Yb(x, y, z), 90)
        assert.ok(Math.abs(value - (a.key === b.key ? 1 : 0)) < 2e-3, `l=${l} ${a.key}·${b.key} = ${value}`)
      }
    }
  }
})

test('radial functions are normalised: ∫ r²R² dr = 1', () => {
  for (const [n, l] of [[1, 0], [2, 0], [2, 1], [3, 2], [4, 3], [5, 2]]) {
    const R = radialFunction(n, l)
    let sum = 0
    const dr = 0.01
    for (let r = dr / 2; r < 120; r += dr) sum += r * r * R(r) ** 2 * dr
    assert.ok(Math.abs(sum - 1) < 1e-3, `n=${n} l=${l}: ${sum}`)
  }
})

test('radial nodes = n − l − 1', () => {
  for (let n = 1; n <= 5; n += 1) {
    for (let l = 0; l < n && l <= 3; l += 1) {
      const R = radialFunction(n, l)
      let changes = 0
      let previous = Math.sign(R(0.001))
      for (let r = 0.01; r < 80; r += 0.01) {
        const sign = Math.sign(R(r))
        if (sign && previous && sign !== previous) changes += 1
        if (sign) previous = sign
      }
      assert.equal(changes, nodeCounts(n, l).radial, `n=${n} l=${l}`)
    }
  }
})

test('phase signs: p_z follows z, d_xy follows xy, f_xyz follows xyz', () => {
  const pz = createOrbital(2, 1, 'pz').psi
  assert.ok(pz(0, 0, 2) > 0 && pz(0, 0, -2) < 0)
  const dxy = createOrbital(3, 2, 'dxy').psi
  assert.ok(dxy(2, 2, 0) > 0 && dxy(-2, 2, 0) < 0 && Math.abs(dxy(0, 3, 1)) < 1e-12)
  const fxyz = createOrbital(4, 3, 'fxyz').psi
  for (const [x, y, z] of [[1, 1, 1], [-1, 1, 1], [1, -1, 1], [1, 1, -1], [-1, -1, -1], [-1, -1, 1]]) {
    assert.equal(Math.sign(fxyz(4 * x, 4 * y, 4 * z)), Math.sign(x * y * z), `(${x},${y},${z})`)
  }
})

test('sampled density reproduces ⟨r⟩ = (3n² − l(l+1)) / 2', () => {
  for (const [n, l, key] of [[1, 0, 's'], [2, 0, 's'], [2, 1, 'pz'], [3, 2, 'dz2']]) {
    const { positions } = sampleDensity(n, l, key, 20000, 7)
    let sum = 0
    for (let i = 0; i < positions.length; i += 3) sum += Math.hypot(positions[i], positions[i + 1], positions[i + 2])
    const mean = sum / (positions.length / 3)
    const expected = (3 * n * n - l * (l + 1)) / 2
    assert.ok(Math.abs(mean - expected) / expected < 0.03, `n=${n} l=${l}: ${mean.toFixed(3)} vs ${expected}`)
  }
})

test('sampled phases match the sign of ψ', () => {
  const { positions, phases } = sampleDensity(3, 2, 'dxy', 4000, 3)
  const { psi } = createOrbital(3, 2, 'dxy')
  for (let i = 0; i < phases.length; i += 1) {
    const value = psi(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
    if (Math.abs(value) > 1e-9) assert.equal(phases[i], Math.sign(value))
  }
})

test('90% boundary-surface level encloses ~90% of the probability on the grid', () => {
  const { values, isoValue } = sampleGrid(2, 1, 'pz', 40, 0.9)
  let inside = 0
  let total = 0
  for (const value of values) {
    const density = value * value
    total += density
    if (Math.abs(value) >= isoValue) inside += density
  }
  assert.ok(Math.abs(inside / total - 0.9) < 0.02, `${(inside / total).toFixed(3)}`)
})

/* ---------- formulas & equations ---------- */

const { parseFormula, parseSpecies } = await import('../src/chem/formula.js')
const { balanceSpecies, checkEquation, parseEquation } = await import('../src/chem/equation.js')

test('formula parser: subscripts, brackets, hydrates', () => {
  assert.deepEqual(parseFormula('H2O'), { H: 2, O: 1 })
  assert.deepEqual(parseFormula('H₂O'), { H: 2, O: 1 })
  assert.deepEqual(parseFormula('Ca3(PO4)2'), { Ca: 3, P: 2, O: 8 })
  assert.deepEqual(parseFormula('CuSO4·5H2O'), { Cu: 1, S: 1, O: 9, H: 10 })
  assert.deepEqual(parseFormula('K4[Fe(CN)6]'), { K: 4, Fe: 1, C: 6, N: 6 })
  assert.deepEqual(parseFormula('Cu(OH)₂↓'), { Cu: 1, O: 2, H: 2 })
  assert.deepEqual(parseFormula('NaCl(aq)'), { Na: 1, Cl: 1 })
  // Inputs the old per-tool parsers accepted
  assert.deepEqual(parseFormula('CuSO4.5H2O'), parseFormula('CuSO₄·5H₂O'))
  assert.deepEqual(parseFormula('CuSO4∙5H2O'), parseFormula('CuSO₄·5H₂O'))
  assert.deepEqual(parseFormula('Ca{OH}2'), { Ca: 1, O: 2, H: 2 })
  assert.deepEqual(parseFormula(' H2 SO4 '), { H: 2, S: 1, O: 4 })
})

test('formula parser rejects unknown symbols and broken brackets', () => {
  for (const bad of ['Xx2', 'Hcl', 'Ca(OH]2', '(OH', 'H2O)', 'MnO4-', '']) {
    assert.throws(() => parseFormula(bad), undefined, bad)
  }
})

test('species: coefficients and ion charges', () => {
  assert.equal(parseSpecies('SO₄²⁻').charge, -2)
  assert.equal(parseSpecies('Fe^3+').charge, 3)
  assert.equal(parseSpecies('NH4^+').charge, 1)
  assert.equal(parseSpecies('OH⁻').charge, -1)
  assert.equal(parseSpecies('3H2O').coefficient, 3)
  assert.deepEqual(parseSpecies('[Cu(NH₃)₄]²⁺').atoms, { Cu: 1, N: 4, H: 12 })
})

test('balancer finds the textbook coefficients', () => {
  const cases = {
    'H2 + O2 → H2O': [2, 1, 2],
    'Fe + O2 → Fe3O4': [3, 2, 1],
    'Al + HCl → AlCl3 + H2': [2, 6, 2, 3],
    'C6H12O6 + O2 → CO2 + H2O': [1, 6, 6, 6],
    'Cu + HNO3 → Cu(NO3)2 + NO + H2O': [3, 8, 3, 2, 4],
    'KMnO4 + HCl → KCl + MnCl2 + Cl2 + H2O': [2, 16, 2, 2, 5, 8],
    'Fe^2+ + MnO4^- + H^+ → Fe^3+ + Mn^2+ + H2O': [5, 1, 8, 5, 1, 4],
    'Cr2O7^2- + Fe^2+ + H^+ → Cr^3+ + Fe^3+ + H2O': [1, 6, 14, 2, 6, 7]
  }
  for (const [equation, expected] of Object.entries(cases)) {
    const { reactants, products } = parseEquation(equation)
    const result = balanceSpecies(reactants, products)
    assert.deepEqual(result?.coefficients, expected, equation)
    assert.equal(result.unique, true, equation)
  }
})

test('balancer: impossible and non-unique equations are reported', () => {
  for (const equation of ['H2O → H2O2', 'Na → Cl2', 'NaCl → Na^+ + Cl2']) {
    const { reactants, products } = parseEquation(equation)
    assert.equal(balanceSpecies(reactants, products), null, equation)
  }
  const { reactants, products } = parseEquation('H2O2 + MnO4^- + H^+ → O2 + Mn^2+ + H2O')
  assert.equal(balanceSpecies(reactants, products).unique, false)
})

/* ---------- molecule geometry ---------- */

const { MOLECULES, findMolecule, countAtoms } = await import('../src/chem/molecules.js')
const { EXPERIMENTS } = await import('../src/lab/experiments/experiments.js')

test('molecule models reproduce their stated bond lengths and angles', () => {
  const problems = []
  for (const molecule of MOLECULES) {
    const position = index => molecule.atoms[index].slice(1)
    const vector = (from, to) => position(to).map((value, axis) => value - position(from)[axis])
    const length = v => Math.hypot(...v)
    const symbol = index => molecule.atoms[index][0]

    const [a, b] = molecule.length[0].split(/[–=≡]/)
    const hasLength = molecule.bonds.some(([i, j]) =>
      [symbol(i), symbol(j)].sort().join() === [a, b].sort().join() &&
      Math.abs(length(vector(i, j)) - molecule.length[1]) < 1e-3)
    if (!hasLength) problems.push(`${molecule.formula} length`)

    if (molecule.angle) {
      const [outer1, middle, outer2] = molecule.angle[0].split(/[–=≡]/)
      let found = false
      molecule.atoms.forEach(([element], centre) => {
        if (element !== middle) return
        const partners = molecule.bonds.filter(bond => bond.includes(centre)).map(([i, j]) => (i === centre ? j : i))
        for (const p of partners) for (const q of partners) {
          if (p >= q || [symbol(p), symbol(q)].sort().join() !== [outer1, outer2].sort().join()) continue
          const u = vector(centre, p)
          const v = vector(centre, q)
          const cos = u.reduce((sum, value, axis) => sum + value * v[axis], 0) / (length(u) * length(v))
          if (Math.abs(Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI - molecule.angle[1]) < 0.1) found = true
        }
      })
      if (!found) problems.push(`${molecule.formula} angle`)
    }

    assert.deepEqual(parseFormula(molecule.formula), countAtoms(molecule), molecule.formula)
  }
  assert.deepEqual(problems, [])
})

test('molecule lookup uses the parsed formula, not the text', () => {
  assert.equal(findMolecule(parseFormula('H₂O')).formula, 'H2O')
  assert.equal(findMolecule(parseFormula('CH4')).formula, 'CH4')
  assert.equal(findMolecule(parseFormula('H2O2')), null)
  assert.equal(findMolecule(parseFormula('C2H6')), null)
})

test('every lesson 3D model link points at a molecule in the library', () => {
  const missing = []
  for (const experiment of EXPERIMENTS) {
    for (const step of experiment.steps) {
      for (const formula of step.models || []) {
        if (!MOLECULES.some(molecule => molecule.formula === formula)) missing.push(`${experiment.id}: ${formula}`)
      }
    }
  }
  assert.deepEqual(missing, [])
})

/* ---------- lab data ---------- */

const { REACTIONS } = await import('../src/lab/reactions.js')
const { hasTranslation } = await import('../src/lab/reactionsVi.js')

test('every Virtual Lab reaction has Vietnamese display text', () => {
  const missing = REACTIONS.filter(reaction => !hasTranslation(reaction.id)).map(reaction => reaction.id)
  assert.deepEqual(missing, [])
})

const { computeAcidBase, solveStrongPH } = await import('../src/lab/acidBase.js')
const { CHEMICALS } = await import('../src/lab/chemicals.js')
const catalogue = Array.isArray(CHEMICALS) ? Object.fromEntries(CHEMICALS.map(item => [item.id, item])) : CHEMICALS
const pHOf = mixture => computeAcidBase(mixture, catalogue)
const near = (actual, expected, tolerance = 0.01) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≠ ${expected}`)

test('lab pH: strong acid/base reference cases at 25 °C', () => {
  near(pHOf({ hcl: 25 }).pH, 1)
  near(pHOf({ naoh: 25 }).pH, 13)
  near(pHOf({ water: 50 }).pH, 7)
  near(pHOf({ hcl: 25, naoh: 25 }).pH, 7)
  near(pHOf({ hcl: 25, water: 225 }).pH, 2) // tenfold dilution
  near(pHOf({ hcl: 25, naoh: 10 }).pH, -Math.log10(1.5e-3 / 0.035))
  near(pHOf({ hcl: 10, naoh: 25 }).pH, 14 + Math.log10(1.5e-3 / 0.035))
  near(pHOf({ baoh2: 25 }).pH, 14 + Math.log10(0.2))
  assert.equal(pHOf({}).mode, 'empty')
  assert.equal(pHOf({ hcl: 25, naoh: 25, phenolphthalein: 1 }).mode, 'quantitative')
})

test('lab pH: H₂SO₄ second dissociation (Ka₂ = 0.010)', () => {
  // 0.1 M: [H+] = 0.1 + x, x(0.1 + x)/(0.1 − x) = 0.01 → x ≈ 0.00844
  near(pHOf({ h2so4: 25 }).pH, -Math.log10(0.10844), 0.005)
  near(solveStrongPH({}), 7)
})

test('lab pH: weak acids, bases and hydrolysing salts are flagged as estimates', () => {
  for (const id of ['ethanoic', 'nh3', 'na2co3', 'nh4cl', 'caoh2']) {
    assert.equal(pHOf({ [id]: 25 }).mode, 'estimate', id)
  }
})

const { computeStoichiometry, molarMass } = await import('../src/lab/stoichiometry.js')
const molarMassOf = formula => molarMass(parseFormula(formula))
const { stockConcentration, SALT_SOLUBILITY } = await import('../src/lab/concentrations.js')
const reaction = id => REACTIONS.find(item => item.id === id)
const stockOf = stockConcentration
const stoich = (id, mixture) => computeStoichiometry(reaction(id), mixture, catalogue, stockOf)

test('lab stoichiometry: limiting reactant, excess and products', () => {
  const a = stoich('hcl-naoh', { hcl: 25, naoh: 10 })
  assert.deepEqual(a.limiting, ['naoh'])
  near(a.excess[0].moles * 1000, 1.5, 1e-9)
  const salt = a.products.find(item => item.formula === 'NaCl')
  near(salt.moles * 1000, 1, 1e-9)
  near(salt.mass, 0.001 * (22.990 + 35.45), 1e-6)

  // H₂SO₄ + 2NaOH: 2.5 mmol acid needs 5 mmol base; 2.5 mmol NaOH → extent 1.25 mmol
  const b = stoich('h2so4-naoh', { h2so4: 25, naoh: 25 })
  assert.deepEqual(b.limiting, ['naoh'])
  near(b.excess[0].moles * 1000, 1.25, 1e-9)
  near(b.products.find(item => item.formula === 'Na2SO4').moles * 1000, 1.25, 1e-9)

  const c = stoich('baoh2-h2so4', { baoh2: 25, h2so4: 10 })
  const barite = c.products.find(item => item.precipitate)
  assert.equal(barite.formula, 'BaSO4')
  near(barite.mass, 0.001 * (137.33 + 32.06 + 4 * 15.999), 1e-3)

  const d = stoich('hcl-naoh', { hcl: 25, naoh: 25 })
  assert.deepEqual(d.limiting.sort(), ['hcl', 'naoh'])
  assert.equal(d.excess.length, 0)
})

test('lab stoichiometry: every reaction with known concentrations maps to its equation', () => {
  const unmapped = REACTIONS
    .filter(item => item.reactants.every(id => stockOf(id) !== null))
    .map(item => [item.id, computeStoichiometry(item, Object.fromEntries(item.reactants.map(id => [id, 10])), catalogue, stockOf)])
    .filter(([, result]) => result?.status !== 'quantitative' && !result?.reason)
    .map(([id]) => id)
  assert.deepEqual(unmapped, [])
  for (const item of REACTIONS) computeStoichiometry(item, {}, catalogue, stockOf) // must not throw
})

test('lab stoichiometry: precipitation with excess, deficit and exact amounts', () => {
  const silver = stoich('agno3-nacl', { agno3: 25, nacl: 10 })
  assert.deepEqual(silver.limiting, ['nacl'])
  near(silver.excess[0].moles * 1000, 1.5, 1e-9)
  const agcl = silver.products.find(item => item.precipitate)
  assert.equal(agcl.formula, 'AgCl')
  near(agcl.mass, 0.001 * (107.87 + 35.45), 1e-3)

  const barium = stoich('bacl2-na2so4', { bacl2: 25, na2so4: 25 })
  assert.equal(barium.limiting.length, 2)
  assert.equal(barium.excess.length, 0)
  near(barium.products.find(item => item.formula === 'BaSO4').moles * 1000, 2.5, 1e-9)

  // CuSO₄ + 2NaOH: 2.5 mmol NaOH precipitates 1.25 mmol Cu(OH)₂, 1.25 mmol CuSO₄ left
  const copper = stoich('cuso4-naoh', { cuso4: 25, naoh: 25 })
  assert.deepEqual(copper.limiting, ['naoh'])
  near(copper.products.find(item => item.formula === 'Cu(OH)2').moles * 1000, 1.25, 1e-9)
  near(copper.excess[0].moles * 1000, 1.25, 1e-9)

  // Water dilutes but does not change the amounts; several additions add up.
  assert.deepEqual(stoich('agno3-nacl', { agno3: 25, nacl: 10, water: 100 }).products, silver.products)
  assert.deepEqual(stoich('agno3-nacl', { agno3: 10 + 15, nacl: 10 }).products, silver.products)
})

test('lab stoichiometry: amphoteric Al(OH)₃ / Zn(OH)₂ redissolve only in excess NaOH', () => {
  const al = naoh => stoich('alcl3-naoh', { alcl3: 25, naoh })
  const solid = result => result.products.find(item => item.formula === 'Al(OH)3').moles * 1000
  near(solid(al(25)), 2.5 / 3, 1e-9) // OH⁻ < 3 Al³⁺: no dissolution
  assert.equal(al(25).dissolved, null)
  near(solid(al(75)), 2.5, 1e-9) // exactly 3:1
  near(solid(al(80)), 2.0, 1e-9) // 0.5 mmol OH⁻ excess dissolves 0.5 mmol
  assert.equal(solid(al(100)), 0) // 4:1 dissolves all
  assert.equal(al(100).dissolved.complete, true)
  near(al(125).excess.find(item => item.id === 'naoh').moles * 1000, 2.5, 1e-9)

  const zn = stoich('znso4-naoh', { znso4: 25, naoh: 75 }) // 7.5 mmol OH⁻: 5 precipitate, 2.5 dissolve 1.25 mmol
  near(zn.products.find(item => item.formula === 'Zn(OH)2').moles * 1000, 1.25, 1e-9)

  // Cu(OH)₂ is not treated as amphoteric.
  assert.equal(stoich('cuso4-naoh', { cuso4: 25, naoh: 100 }).dissolved, null)
})

test('lab stoichiometry: unknown data, two-step and equilibrium reactions stay qualitative', () => {
  const weak = stoich('ethanoic-naoh', { ethanoic: 25, naoh: 25 })
  assert.equal(weak.status, 'qualitative')
  assert.deepEqual(weak.missing, ['CH₃COOH'])
  assert.match(stoich('na2co3-hcl', { na2co3: 25, hcl: 10 }).reason, /hai nấc/)
  assert.match(stoich('fecl3-kscn', { fecl3: 25, kscn: 25 }).reason, /cân bằng/)
  assert.match(stoich('cuso4-na2co3', { cuso4: 25, na2co3: 25 }).reason, /carbonate base/)
})

test('lab concentrations: 0.1 M only for catalogue solutions well below saturation', () => {
  for (const [id, solubility] of Object.entries(SALT_SOLUBILITY)) {
    const reagent = catalogue[id]
    assert.ok(reagent, `${id} missing from catalogue`)
    assert.equal(reagent.state, 'solution', id)
    // g/100 g water → rough mol/L; must be at least 3 × the 0.1 M stock.
    const saturation = solubility * 10 / molarMassOf(reagent.formula)
    assert.ok(saturation >= 0.3, `${id}: ~${saturation.toFixed(2)} M`)
  }
  for (const id of ['caoh2', 'mgoh2', 'caco3', 'ethanoic', 'nh3', 'kmno4', 'fe2so43']) assert.equal(stockOf(id), null, id)
})

test('lab pH: spectator salts are counted, H⁺/OH⁻-consuming salts fall back to estimate', () => {
  near(pHOf({ hcl: 25, nacl: 25 }).pH, -Math.log10(2.5 / 50))
  assert.equal(pHOf({ na2so4: 25 }).mode, 'quantitative')
  assert.equal(pHOf({ mgcl2: 25, naoh: 10 }).mode, 'estimate') // Mg(OH)₂↓ consumes OH⁻
  assert.equal(pHOf({ glucose: 25, hcl: 25 }).mode, 'estimate')
})

const { replayStepwise, STEPWISE_SYSTEMS } = await import('../src/lab/engine/stepwise.js')
const { simulateLab, SHARED_REASON, mixtureFrom: mixtureOf } = await import('../src/lab/engine/simulate.js')
const carbonate = STEPWISE_SYSTEMS.find(system => system.id === 'carbonate')
const mmolOf = value => value * 1000
const replay = additions => replayStepwise(carbonate, additions.map(([id, volume]) => ({ id, volume })), stockOf)

test('stepwise CO₃²⁻ + HCl: acid added to carbonate gives HCO₃⁻ first, gas only after', () => {
  const first = replay([['na2co3', 25], ['hcl', 10]])
  near(mmolOf(first.gas), 0, 1e-12)
  near(mmolOf(first.monobasic), 1, 1e-9)
  near(mmolOf(first.dibasic), 1.5, 1e-9)
  const more = replay([['na2co3', 25], ['hcl', 10], ['hcl', 25]])
  near(mmolOf(more.dibasic), 0, 1e-12)
  near(mmolOf(more.gas), 1, 1e-9) // 3.5 mmol H⁺: 2.5 to HCO₃⁻, 1.0 to CO₂
  near(mmolOf(more.monobasic), 1.5, 1e-9)
  const all = replay([['na2co3', 25], ['hcl', 50]])
  near(mmolOf(all.gas), 2.5, 1e-9)
  near(mmolOf(all.acid), 0, 1e-12)
})

test('stepwise CO₃²⁻ + HCl: carbonate added to acid releases gas at once (order matters)', () => {
  const excessAcid = replay([['hcl', 25], ['na2co3', 10]])
  near(mmolOf(excessAcid.gas), 1, 1e-9)
  near(mmolOf(excessAcid.acid), 0.5, 1e-9)
  const littleAcid = replay([['hcl', 10], ['na2co3', 25]])
  near(mmolOf(littleAcid.gas), 0.5, 1e-9) // n(CO₂) = n(HCl) / 2
  near(mmolOf(littleAcid.dibasic), 2, 1e-9)
  // Same totals, other order: 1 mmol HCl onto 2.5 mmol CO₃²⁻ gives no gas.
  near(mmolOf(replay([['na2co3', 25], ['hcl', 10]]).gas), 0, 1e-12)
  near(mmolOf(replay([['nahco3', 25], ['hcl', 10]]).gas), 1, 1e-9) // HCO₃⁻ + H⁺ is one step
})

test('stepwise replay conserves carbon and H⁺ for random addition sequences', () => {
  let seed = 7
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  for (let run = 0; run < 200; run += 1) {
    const additions = Array.from({ length: 1 + Math.floor(random() * 6) }, () => [['hcl', 'na2co3', 'nahco3'][Math.floor(random() * 3)], [1, 10, 25, 50][Math.floor(random() * 4)]])
    const state = replay(additions)
    const added = id => additions.filter(([item]) => item === id).reduce((sum, [, volume]) => sum + 0.1 * volume / 1000, 0)
    near(state.dibasic + state.monobasic + state.gas, added('na2co3') + added('nahco3'), 1e-12)
    near(state.acid + state.stage1 + state.stage2 + 2 * state.direct, added('hcl'), 1e-12)
    for (const value of Object.values(state)) assert.ok(value >= -1e-15, JSON.stringify(state))
  }
})

test('simulateLab: competing reactions are not computed independently', () => {
  const sim = (pairs, ids) => simulateLab({ additions: pairs.map(([id, volume]) => ({ id, volume })), triggeredIds: ids, reactions: REACTIONS, reagents: catalogue })
  const single = sim([['agno3', 25], ['nacl', 10]], ['agno3-nacl'])
  near(mmolOf(single.solidMoles), 1, 1e-9)
  const competing = sim([['hcl', 25], ['naoh', 10], ['na2co3', 25]], ['hcl-naoh', 'na2co3-hcl'])
  assert.equal(competing.results.get('hcl-naoh').reason, SHARED_REASON)
  assert.equal(competing.results.get('na2co3-hcl').reason, SHARED_REASON)
  assert.equal(competing.gasMoles, 0)
  const twoCarbonates = sim([['na2co3', 25], ['nahco3', 25], ['hcl', 50]], ['na2co3-hcl', 'nahco3-hcl'])
  assert.equal(twoCarbonates.results.get('na2co3-hcl').kind, 'stepwise') // one system, not a competition
  near(mmolOf(twoCarbonates.gasMoles), 2.5, 1e-9)
})

const { profileReaction, SUPPORT } = await import('../src/lab/engine/profiles.js')
const { PRECIPITATES } = await import('../src/lab/engine/precipitates.js')
const profiles = REACTIONS.map(reaction => profileReaction(reaction, catalogue))

test('reaction catalogue: unique ids, every reaction valid and classified', () => {
  assert.equal(new Set(REACTIONS.map(item => item.id)).size, REACTIONS.length)
  const invalid = profiles.filter(profile => profile.support === SUPPORT.INVALID).map(profile => `${profile.id}: ${profile.problems.join('; ')}`)
  assert.deepEqual(invalid, [])
  for (const profile of profiles) {
    assert.ok(Object.values(SUPPORT).includes(profile.support), profile.id)
    assert.ok(profile.categories.length, profile.id)
  }
})

test('reaction catalogue: the validator catches broken definitions (mutation check)', () => {
  const base = REACTIONS.find(item => item.id === 'agno3-nacl')
  const broken = [
    { ...base, equation: 'AgNO₃ + NaCl → AgCl↓ + NaNO₂' },
    { ...base, effects: [] },
    { ...base, effects: [{ type: 'precipitate', color: '#333333' }] },
    { ...base, effects: [...base.effects, { type: 'flash' }] },
    { ...base, reactants: ['agno3', 'notAChemical'] },
    { ...base, effects: [...base.effects, { type: 'gas' }] }
  ]
  for (const reaction of broken) assert.equal(profileReaction(reaction, catalogue).support, SUPPORT.INVALID, JSON.stringify(reaction.effects) + reaction.equation)
})

test('reaction catalogue: no generic effects; reactions without a phenomenon draw nothing', () => {
  for (const reaction of REACTIONS) {
    assert.ok(!reaction.effects.some(effect => effect.type === 'flash'), reaction.id)
    const profile = profiles.find(item => item.id === reaction.id)
    if (!profile.phenomena.visible) {
      assert.deepEqual(reaction.effects.filter(effect => effect.type !== 'message'), [], reaction.id)
    }
  }
})

test('reaction catalogue: equilibria are never quantitative; quantitative ones conserve atoms', () => {
  for (const profile of profiles) if (profile.phenomena.reversible) assert.notEqual(profile.support, SUPPORT.QUANTITATIVE, profile.id)
  for (const reaction of REACTIONS) {
    if (profiles.find(item => item.id === reaction.id).support !== SUPPORT.QUANTITATIVE) continue
    for (const volumes of [[25, 10], [10, 25], [25, 25], [1, 50]]) {
      const mixture = Object.fromEntries(reaction.reactants.map((id, index) => [id, volumes[index % 2]]))
      const result = computeStoichiometry(reaction, mixture, catalogue, stockOf)
      if (!result || result.status !== 'quantitative') continue // stepwise systems are checked by replay tests
      const atoms = {}
      const add = (formula, moles, sign) => {
        for (const [symbol, count] of Object.entries(parseFormula(formula))) atoms[symbol] = (atoms[symbol] || 0) + sign * count * moles
      }
      for (const item of result.reactants) add(item.formula, item.moles - (result.excess.find(left => left.id === item.id)?.moles || 0), 1)
      for (const item of result.products) add(item.formula, item.moles, -1)
      for (const [symbol, value] of Object.entries(atoms)) assert.ok(Math.abs(value) < 1e-12, `${reaction.id} ${volumes} ${symbol} ${value}`)
      for (const item of [...result.reactants, ...result.excess, ...result.products]) assert.ok(item.moles >= -1e-15, `${reaction.id} negative ${item.formula}`)
    }
  }
})

test('precipitate table: textbook colour names for the reference solids', () => {
  const expected = { AgCl: 'trắng', BaSO4: 'trắng', 'Cu(OH)2': 'xanh lam', 'Fe(OH)3': 'nâu đỏ', PbI2: 'vàng', Ag2S: 'đen', AgI: 'vàng', CuS: 'đen', 'Fe(OH)2': 'trắng xanh', Cu2O: 'đỏ gạch' }
  for (const [formula, label] of Object.entries(expected)) assert.equal(PRECIPITATES[formula].label, label, formula)
  // Colours must look like their name: white is light and grey-free, black is dark.
  const lightness = hex => { const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255); return (Math.max(r, g, b) + Math.min(r, g, b)) / 2 }
  for (const [formula, entry] of Object.entries(PRECIPITATES)) {
    if (entry.label === 'trắng' || entry.label === 'keo trắng') assert.ok(lightness(entry.color) > 0.9, formula)
    if (entry.label === 'đen') assert.ok(lightness(entry.color) < 0.25, formula)
  }
})

const fs = await import('node:fs')
const { buildCoverage, COVERAGE_PATH } = await import('./reaction-coverage.mjs')

test('reaction coverage matrix in docs is up to date (npm run report:reactions)', () => {
  assert.ok(fs.existsSync(COVERAGE_PATH), 'missing — run npm run report:reactions')
  assert.equal(fs.readFileSync(COVERAGE_PATH, 'utf8').replace(/\r\n/g, '\n'), buildCoverage())
})

const { findAvailableReactions } = await import('../src/lab/reactionEngine.js')
const { engineDrivesGas } = await import('../src/lab/engine/simulate.js')

test('guided experiments: observed gas / precipitate agree with the engine at the lesson volumes', () => {
  const contradictions = []
  for (const experiment of EXPERIMENTS) {
    const additions = []
    const history = []
    const triggered = new Set()
    let heating = false
    for (const step of experiment.steps) {
      if (step.type === 'heat') heating = true
      if (step.type === 'add' && catalogue[step.chemical]?.indicator !== 'litmusPaper') {
        const already = additions.filter(item => item.id === step.chemical).reduce((sum, item) => sum + item.volume, 0)
        additions.push({ id: step.chemical, volume: Math.max(25, (step.minAmount || 0) - already) })
        if (!history.includes(step.chemical)) history.push(step.chemical)
      }
      const mixture = mixtureOf(additions)
      for (const reaction of findAvailableReactions(REACTIONS, { mixture, temperature: heating ? 90 : 25, heating, pH: 7, additionHistory: history, triggeredIds: triggered, lightOn: false })) triggered.add(reaction.id)
      if (step.type !== 'observation') continue
      const simulation = simulateLab({ additions, triggeredIds: triggered, reactions: REACTIONS, reagents: catalogue })
      const text = `${step.title || ''} ${step.text || ''} ${(step.points || []).join(' ')}`
      const gasDriven = [...triggered].some(id => engineDrivesGas(REACTIONS.find(item => item.id === id), simulation))
      if (/khí|sủi bọt/i.test(text) && gasDriven && simulation.gasMoles <= 0) contradictions.push(`${experiment.id}: gas`)
      const solidDriven = [...simulation.results.values()].some(result => result.status === 'quantitative' && result.products?.some(product => product.precipitate))
      if (/kết tủa/i.test(text) && !/tan/i.test(text) && solidDriven && simulation.solidMoles <= 0) contradictions.push(`${experiment.id}: precipitate`)
    }
  }
  assert.deepEqual(contradictions, [])
})

test('engine boundary cases: zero, tiny and unknown inputs', () => {
  const sim = additions => simulateLab({ additions, triggeredIds: ['agno3-nacl'], reactions: REACTIONS, reagents: catalogue })
  assert.equal(sim([]).solidMoles, 0)
  assert.equal(sim([{ id: 'agno3', volume: 0 }, { id: 'nacl', volume: 25 }]).solidMoles, 0)
  near(mmolOf(sim([{ id: 'agno3', volume: 1 }, { id: 'nacl', volume: 25 }]).solidMoles), 0.1, 1e-12) // 1 mL × 0.1 M
  near(mmolOf(sim([{ id: 'agno3', volume: 250 }, { id: 'nacl', volume: 250 }]).solidMoles), 25, 1e-9)
  assert.equal(replayStepwise(carbonate, [{ id: 'hcl', volume: -5 }, { id: 'na2co3', volume: NaN }], stockOf).gas, 0)
  assert.equal(simulateLab({ additions: [{ id: 'notAChemical', volume: 25 }], triggeredIds: ['notAReaction'], reactions: REACTIONS, reagents: catalogue }).results.size, 0)
})

// Word equations (colour tests, R-group notation) cannot be atom-checked.
const QUALITATIVE_EQUATIONS = new Set([
  'phenol-fecl3', 'starch-iodine', 'maltose-cu-hot', 'lactose-cu-hot', 'albumin-biuret', 'triglycerideOil-naoh'
])

test('every Virtual Lab equation conserves atoms and charge', () => {
  const problems = []
  for (const reaction of REACTIONS) {
    let result = null
    try { result = checkEquation(reaction.equation) }
    catch (error) {
      if (!QUALITATIVE_EQUATIONS.has(reaction.id)) problems.push(`${reaction.id}: ${error.message}`)
      continue
    }
    if (QUALITATIVE_EQUATIONS.has(reaction.id)) problems.push(`${reaction.id} parses now — remove it from the qualitative list`)
    else if (!result.balanced) problems.push(`${reaction.id}: ${reaction.equation}`)
  }
  assert.deepEqual(problems, [])
})

const failures = results.filter(result => !result.pass)
console.log('\nChemLab chemistry core')
console.table(results.map(({ name, pass, error }) => ({ name, pass, error: error || '' })))
if (failures.length) {
  console.error(`\nFAIL — ${failures.length}/${results.length} chemistry checks failed.`)
  process.exitCode = 1
}
else {
  console.log(`\nPASS — ${results.length} chemistry core checks passed.\n`)
}
