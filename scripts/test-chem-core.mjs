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
