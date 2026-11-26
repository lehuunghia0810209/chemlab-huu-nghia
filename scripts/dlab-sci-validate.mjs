// ChemLab 7.0 — independent scientific checks of what students are shown (not of the engine's own arithmetic):
//  1. every equation string balances in elements and charge (own parser, no engine code);
//  2. every equation agrees with the stoichiometry the engine actually uses (consumes/gives/gas/deposit/precipitate);
//  3. molar masses of every reagent/precipitate formula match IUPAC 2021 standard atomic weights (own table).
// Usage: node scripts/dlab-sci-validate.mjs → exits 1 on any failure.
import { KINETIC, ION_REDOX, ELECTRO } from '../src/dlab/data/reactions.js'
import { REAGENTS, PRECIPITATES, molarMass } from '../src/dlab/data/materials.js'
import { EXPERIMENTS } from '../src/dlab/data/experiments.js'

// IUPAC 2021 standard atomic weights (abridged/conventional values, CIAAW): independent of src/data/elements.js.
const AW = { H: 1.008, C: 12.011, N: 14.007, O: 15.999, Na: 22.990, Mg: 24.305, S: 32.06, Cl: 35.45, K: 39.098, Ca: 40.078, Fe: 55.845, Cu: 63.546, Zn: 65.38, Ag: 107.868, I: 126.904, Ba: 137.327 }
const SUB = '₀₁₂₃₄₅₆₇₈₉'
const SUP = { '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 }
const plain = s => [...s].map(ch => (SUB.includes(ch) ? String(SUB.indexOf(ch)) : ch)).join('')

// "2Cu²⁺" → { coef: 2, atoms: {Cu: 1}, charge: 2 }
function species(raw) {
  let s = raw.replace(/[↑↓]/g, '').replace(/\(.*?(catot|anot).*?\)/g, '').trim()
  const m = s.match(/^(\d*)(.+)$/)
  const coef = Number(m[1] || 1)
  s = m[2]
  let charge = 0
  const cm = s.match(/([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([⁺⁻])$/)
  if (cm) { charge = (cm[1] ? Number([...cm[1]].map(c => SUP[c]).join('')) : 1) * (cm[2] === '⁺' ? 1 : -1); s = s.slice(0, -cm[0].length) }
  return { coef, atoms: formulaAtoms(plain(s)), charge }
}
export function formulaAtoms(f) {
  const atoms = {}
  const add = (el, n) => { atoms[el] = (atoms[el] || 0) + n }
  const re = /([A-Z][a-z]?)(\d*)|\(([^()]+)\)(\d*)|\[([^\[\]]+)\](\d*)/g
  let m
  while ((m = re.exec(f))) {
    if (m[1]) add(m[1], Number(m[2] || 1))
    else { const inner = formulaAtoms(m[3] || m[5]); const k = Number(m[4] || m[6] || 1); for (const [e, n] of Object.entries(inner)) add(e, n * k) }
  }
  return atoms
}
function side(str) { return str.split(/\s\+\s/).map(x => x.trim()).filter(Boolean).map(species) }
function balance(eq) {
  const [l, r] = eq.split(',')[0].split('→').map(side)
  const tally = list => { const a = {}; let q = 0; for (const s of list) { for (const [e, n] of Object.entries(s.atoms)) a[e] = (a[e] || 0) + n * s.coef; q += s.charge * s.coef } return { a, q } }
  const L = tally(l); const R = tally(r)
  const els = new Set([...Object.keys(L.a), ...Object.keys(R.a)])
  const bad = [...els].filter(e => Math.abs((L.a[e] || 0) - (R.a[e] || 0)) > 1e-9).map(e => `${e} ${L.a[e] || 0}≠${R.a[e] || 0}`)
  if (L.q !== R.q) bad.push(`charge ${L.q}≠${R.q}`)
  return { l, r, bad }
}

// Self-check: the checker must reject known-wrong equations (a checker that never fails proves nothing).
for (const wrong of ['Fe + 2H⁺ → Fe³⁺ + H₂↑', 'Cu + Ag⁺ → Cu²⁺ + Ag', '2Na + H₂O → 2NaOH + H₂↑', 'CaCO₃ + H⁺ → Ca²⁺ + CO₂↑ + H₂O', '2Cu²⁺ + 2I⁻ → 2CuI↓ + I₂']) {
  if (!balance(wrong).bad.length) { console.error(`self-check failed: accepted ${wrong}`); process.exit(2) }
}
if (formulaAtoms('Ca(OH)2').H !== 2 || formulaAtoms('[Cu(NH3)4]SO4').N !== 4) { console.error('self-check failed: formula parser'); process.exit(2) }

const failures = []
const rows = []
const check = (id, ok, what) => { rows.push([id, ok ? 'PASS' : 'FAIL', what]); if (!ok) failures.push(`${id}: ${what}`) }

// 1 + 2. Equations shown to students, and the engine's own stoichiometry for the same rule.
const ionKey = s => plain(s).replace('⁺', '+').replace('⁻', '-')
const SOLID = { mg: 'Mg', zn: 'Zn', fe: 'Fe', cu: 'Cu', na: 'Na', caco3: 'CaCO₃' }
for (const r of KINETIC) {
  const { l, r: right, bad } = balance(r.equation)
  check(r.id, !bad.length, `balance ${r.equation}${bad.length ? ' — ' + bad.join(', ') : ''}`)
  // Engine stoichiometry per mol of the solid: gives / gas / deposit must match the equation coefficients.
  const solidSp = l.find(s => plain(s.atoms ? Object.keys(s.atoms).join('') : '') && JSON.stringify(s.atoms) === JSON.stringify(formulaAtoms(plain(SOLID[r.solid]))))
  const per = solidSp ? solidSp.coef : 1
  const coefOf = (list, formula, charge) => list.filter(s => JSON.stringify(s.atoms) === JSON.stringify(formulaAtoms(formula)) && s.charge === charge).reduce((a, s) => a + s.coef, 0) / per
  for (const [ion, n] of Object.entries(r.gives || {})) {
    const m = ion.match(/^([A-Z][a-z]?)(\d?)([+-])$/)
    const expect = m ? coefOf(right, m[1], (Number(m[2] || 1)) * (m[3] === '+' ? 1 : -1)) : coefOf(right, `${ion === 'Na+' ? 'NaOH' : ion}`, 0)
    // NaOH in the equation is Na⁺ + OH⁻ in solution.
    const alt = ion === 'Na+' ? coefOf(right, 'NaOH', 0) : 0
    check(r.id, Math.abs((expect || alt) - n) < 1e-9, `gives ${ion} ${n}/mol solid vs equation ${expect || alt}`)
  }
  for (const [g, n] of Object.entries(r.gas || {})) check(r.id, Math.abs(coefOf(right, g, 0) - n) < 1e-9, `gas ${g} ${n}/mol solid vs equation ${coefOf(right, g, 0)}`)
  for (const [m, n] of Object.entries(r.deposit || {})) check(r.id, Math.abs(coefOf(right, m, 0) - n) < 1e-9, `deposit ${m} ${n}/mol solid vs equation ${coefOf(right, m, 0)}`)
  for (const [ion, n] of Object.entries(r.consumes || {})) {
    const m = ion.match(/^([A-Z][a-z]?)(\d?)([+-])$/)
    const c = coefOf(l, m[1], (Number(m[2] || 1)) * (m[3] === '+' ? 1 : -1))
    check(r.id, Math.abs(c - n) < 1e-9, `consumes ${ion} ${n}/mol solid vs equation ${c}`)
  }
  if (r.driver === 'h') check(r.id, Math.abs(coefOf(l, 'H', 1) - 2) < 1e-9, `acid driver: 2 H⁺ per mol solid (equation ${coefOf(l, 'H', 1)})`)
}
for (const r of ION_REDOX) {
  const { l, r: right, bad } = balance(r.equation)
  check(r.id, !bad.length, `balance ${r.equation}${bad.length ? ' — ' + bad.join(', ') : ''}`)
  const coef = (list, key) => list.filter(s => ionKey(Object.entries(s.atoms).map(([e, n]) => e + (n > 1 ? n : '')).join('') + (s.charge ? `${Math.abs(s.charge) > 1 ? Math.abs(s.charge) : ''}${s.charge > 0 ? '+' : '-'}` : '')) === key).reduce((a, s) => a + s.coef, 0)
  for (const [ion, n] of Object.entries(r.reactants)) check(r.id, coef(l, ion) === n, `reactant ${ion} ${n} vs equation ${coef(l, ion)}`)
  for (const [ion, n] of Object.entries(r.products || {})) check(r.id, coef(right, ion) === n, `product ${ion} ${n} vs equation ${coef(right, ion)}`)
  for (const [k, n] of Object.entries(r.precipitate || {})) check(r.id, coef(right, k) === n, `precipitate ${k} ${n} vs equation ${coef(right, k)}`)
}
// Experiment Library: every equation a student reads balances.
for (const e of EXPERIMENTS) for (const eq of e.equation.split(';').map(x => x.trim()).filter(Boolean)) {
  const { bad } = balance(eq)
  check(e.id, !bad.length, `balance ${eq}${bad.length ? ' — ' + bad.join(', ') : ''}`)
}
check('electrolysis', !balance(ELECTRO.electrolysisCuCl2.equation).bad.length, `balance ${ELECTRO.electrolysisCuCl2.equation}`)
check('daniell', !balance(ELECTRO.daniell.equation).bad.length, `balance ${ELECTRO.daniell.equation}`)

// 3. Molar masses against IUPAC 2021 (relative 0,1 %).
const ref = f => Object.entries(formulaAtoms(plain(f))).reduce((s, [e, n]) => s + (AW[e] ?? NaN) * n, 0)
for (const r of REAGENTS) {
  if (!r.formula || !/^[A-Z(]/.test(r.formula) || r.kind === 'indicator') continue
  const a = molarMass(r.formula); const b = ref(r.formula)
  if (!Number.isFinite(b)) { rows.push([r.id, 'SKIP', `no reference weight for ${r.formula}`]); continue }
  check(`M(${r.formula})`, Math.abs(a - b) / b < 1e-3, `engine ${a.toFixed(3)} vs IUPAC ${b.toFixed(3)} g/mol`)
}
for (const p of Object.values(PRECIPITATES)) {
  const a = molarMass(p.formula); const b = ref(p.formula)
  if (Number.isFinite(b)) check(`M(${p.formula})`, Math.abs(a - b) / b < 1e-3, `engine ${a.toFixed(3)} vs IUPAC ${b.toFixed(3)} g/mol`)
  // A precipitate's formula must match its cation/anion and p:q.
  const cat = p.cation.replace(/\d?[+-]$/, ''); const an = { OH: 'OH', 'Cl-': 'Cl', 'I-': 'I', SO4: 'SO4', CO3: 'CO3' }[p.anion]
  if (an && !p.redox) {
    const expect = formulaAtoms(`${cat}${p.p > 1 ? p.p : ''}${p.q > 1 ? `(${an})${p.q}` : an}`)
    check(`ppt ${p.formula}`, JSON.stringify(Object.entries(expect).sort()) === JSON.stringify(Object.entries(formulaAtoms(plain(p.formula))).sort()), `formula vs ${p.cation} × ${p.p} + ${p.anion} × ${p.q}`)
  }
}

for (const [id, v, what] of rows) console.log(`${v.padEnd(4)}  ${id.padEnd(22)} ${what}`)
console.log(`\n${failures.length ? `FAIL — ${failures.length} problem(s)` : 'PASS'} — ${rows.filter(r => r[1] === 'PASS').length} checks passed, ${rows.filter(r => r[1] === 'SKIP').length} skipped`)
process.exit(failures.length ? 1 : 0)
