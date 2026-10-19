
import { normalizeChargeNotation, parseSpecies } from './formula.js'

const ARROW = /\s*(?:⇌|⇄|⟶|→|<=>|<->|->|=>|=)\s*/

export function splitSpecies(text) {
  return normalizeChargeNotation(text)
    .split(/\s*\+\s*/)
    .map(item => item.trim())
    .filter(Boolean)
}

export function parseSide(text) {
  const species = splitSpecies(text)
  if (!species.length) throw new Error('Không tìm thấy chất hóa học.')
  return species.map(parseSpecies)
}

export function parseEquation(text) {
  const sides = String(text ?? '').split(ARROW)
  if (sides.length !== 2) throw new Error('Phương trình cần đúng một mũi tên giữa hai vế.')
  return { reactants: parseSide(sides[0]), products: parseSide(sides[1]) }
}

export function sideTotals(species, coefficients = species.map(item => item.coefficient ?? 1)) {
  const atoms = {}
  let charge = 0
  species.forEach((item, index) => {
    const coefficient = coefficients[index] ?? 1
    for (const [symbol, count] of Object.entries(item.atoms)) {
      atoms[symbol] = (atoms[symbol] || 0) + count * coefficient
    }
    charge += (item.charge || 0) * coefficient
  })
  return { atoms, charge }
}

export function compareSides(reactants, products, leftCoefficients, rightCoefficients) {
  const left = sideTotals(reactants, leftCoefficients)
  const right = sideTotals(products, rightCoefficients)
  const symbols = [...new Set([...Object.keys(left.atoms), ...Object.keys(right.atoms)])]
  const rows = symbols.map(symbol => ({
    symbol,
    left: left.atoms[symbol] || 0,
    right: right.atoms[symbol] || 0
  }))
  const charge = { left: left.charge, right: right.charge }
  return {
    rows,
    charge,
    balanced: rows.every(row => row.left === row.right) && charge.left === charge.right
  }
}

function gcd(a, b) {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) [a, b] = [b, a % b]
  return a
}

class Fraction {
  constructor(n, d = 1) {
    if (d < 0) { n = -n; d = -d }
    const divisor = gcd(n, d) || 1
    this.n = n / divisor
    this.d = d / divisor
  }
  sub(other) { return new Fraction(this.n * other.d - other.n * this.d, this.d * other.d) }
  mul(other) { return new Fraction(this.n * other.n, this.d * other.d) }
  div(other) { return new Fraction(this.n * other.d, this.d * other.n) }
  isZero() { return this.n === 0 }
}

function rref(matrix) {
  const rows = matrix.length
  const columns = matrix[0]?.length ?? 0
  const pivots = []
  let row = 0
  for (let column = 0; column < columns && row < rows; column += 1) {
    let selected = row
    while (selected < rows && matrix[selected][column].isZero()) selected += 1
    if (selected === rows) continue
    ;[matrix[row], matrix[selected]] = [matrix[selected], matrix[row]]
    const pivot = matrix[row][column]
    matrix[row] = matrix[row].map(value => value.div(pivot))
    for (let other = 0; other < rows; other += 1) {
      const factor = matrix[other][column]
      if (other === row || factor.isZero()) continue
      matrix[other] = matrix[other].map((value, c) => value.sub(factor.mul(matrix[row][c])))
    }
    pivots.push(column)
    row += 1
  }
  return pivots
}

export function balanceSpecies(reactants, products) {
  const compounds = [...reactants, ...products]
  const symbols = [...new Set(compounds.flatMap(item => Object.keys(item.atoms)))]
  const sign = index => (index < reactants.length ? 1 : -1)
  const matrix = symbols.map(symbol => compounds.map((item, index) => new Fraction(sign(index) * (item.atoms[symbol] || 0))))
  if (compounds.some(item => item.charge)) {
    matrix.push(compounds.map((item, index) => new Fraction(sign(index) * (item.charge || 0))))
  }

  const pivots = rref(matrix)
  const free = compounds.map((_, index) => index).filter(index => !pivots.includes(index))
  if (!free.length) return null

  let best = null
  const assignment = Array(free.length).fill(1)
  for (;;) {
    const vector = Array(compounds.length).fill(null)
    free.forEach((column, index) => { vector[column] = new Fraction(assignment[index]) })
    pivots.forEach((column, row) => {
      let sum = new Fraction(0)
      free.forEach(freeColumn => { sum = sum.sub(matrix[row][freeColumn].mul(vector[freeColumn])) })
      vector[column] = sum
    })
    const denominator = vector.reduce((value, fraction) => value * fraction.d / gcd(value, fraction.d), 1)
    const integers = vector.map(fraction => fraction.n * (denominator / fraction.d))
    if (integers.every(value => value > 0)) {
      const divisor = integers.reduce(gcd)
      const normalized = integers.map(value => value / divisor)
      const total = normalized.reduce((sum, value) => sum + value, 0)
      if (!best || total < best.total) best = { coefficients: normalized, total }
    }

    let position = 0
    while (position < assignment.length && assignment[position] === 5) {
      assignment[position] = 1
      position += 1
    }
    if (position === assignment.length) break
    assignment[position] += 1
  }

  return best ? { coefficients: best.coefficients, unique: free.length === 1 } : null
}

export function checkEquation(text) {
  const { reactants, products } = parseEquation(text)
  return compareSides(reactants, products)
}
