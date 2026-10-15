/* =========================================================
   HYDROGEN-LIKE ORBITALS
   ψ(r,θ,φ) = R_nl(r) · Y_lm(θ,φ) in atomic units (a₀ = 1), Z = 1.
   Real spherical harmonics are used so every orbital is a real
   function with a sign (phase) that can be coloured.

   Multi-electron atoms only have approximate one-electron
   orbitals; the shapes here are the standard hydrogen-like
   teaching representation. Pure math — tested by
   scripts/test-chem-core.mjs.
========================================================= */

const PI = Math.PI

/* Real spherical harmonics, written in Cartesian form on the unit vector. */
const HARMONICS = {
  0: [
    { m: 0, key: 's', label: 's', fn: () => 0.5 * Math.sqrt(1 / PI) }
  ],
  1: [
    { m: 1, key: 'px', label: 'p<sub>x</sub>', fn: (x) => Math.sqrt(3 / (4 * PI)) * x },
    { m: -1, key: 'py', label: 'p<sub>y</sub>', fn: (x, y) => Math.sqrt(3 / (4 * PI)) * y },
    { m: 0, key: 'pz', label: 'p<sub>z</sub>', fn: (x, y, z) => Math.sqrt(3 / (4 * PI)) * z }
  ],
  2: [
    { m: -2, key: 'dxy', label: 'd<sub>xy</sub>', fn: (x, y) => 0.5 * Math.sqrt(15 / PI) * x * y },
    { m: -1, key: 'dyz', label: 'd<sub>yz</sub>', fn: (x, y, z) => 0.5 * Math.sqrt(15 / PI) * y * z },
    { m: 1, key: 'dxz', label: 'd<sub>xz</sub>', fn: (x, y, z) => 0.5 * Math.sqrt(15 / PI) * x * z },
    { m: 2, key: 'dx2y2', label: 'd<sub>x²−y²</sub>', fn: (x, y) => 0.25 * Math.sqrt(15 / PI) * (x * x - y * y) },
    { m: 0, key: 'dz2', label: 'd<sub>z²</sub>', fn: (x, y, z) => 0.25 * Math.sqrt(5 / PI) * (3 * z * z - 1) }
  ],
  3: [
    { m: 0, key: 'fz3', label: 'f<sub>z³</sub>', fn: (x, y, z) => 0.25 * Math.sqrt(7 / PI) * z * (5 * z * z - 3) },
    { m: 1, key: 'fxz2', label: 'f<sub>xz²</sub>', fn: (x, y, z) => 0.25 * Math.sqrt(21 / (2 * PI)) * x * (5 * z * z - 1) },
    { m: -1, key: 'fyz2', label: 'f<sub>yz²</sub>', fn: (x, y, z) => 0.25 * Math.sqrt(21 / (2 * PI)) * y * (5 * z * z - 1) },
    { m: -2, key: 'fxyz', label: 'f<sub>xyz</sub>', fn: (x, y, z) => 0.5 * Math.sqrt(105 / PI) * x * y * z },
    { m: 2, key: 'fzx2y2', label: 'f<sub>z(x²−y²)</sub>', fn: (x, y, z) => 0.25 * Math.sqrt(105 / PI) * z * (x * x - y * y) },
    { m: 3, key: 'fx3', label: 'f<sub>x(x²−3y²)</sub>', fn: (x, y) => 0.25 * Math.sqrt(35 / (2 * PI)) * x * (x * x - 3 * y * y) },
    { m: -3, key: 'fy3', label: 'f<sub>y(3x²−y²)</sub>', fn: (x, y) => 0.25 * Math.sqrt(35 / (2 * PI)) * y * (3 * x * x - y * y) }
  ]
}

export function orbitalVariants(l) {
  return (HARMONICS[l] || []).map(({ m, key, label }) => ({ m, key, label }))
}

export function harmonic(l, key) {
  const list = HARMONICS[l]
  if (!list) throw new RangeError(`l = ${l} is not supported (0–3).`)
  return (list.find(item => item.key === key) || list[0]).fn
}

function factorial(n) {
  let result = 1
  for (let i = 2; i <= n; i += 1) result *= i
  return result
}

/* Generalised Laguerre polynomial L_k^α(x) by recurrence. */
export function laguerre(k, alpha, x) {
  if (k === 0) return 1
  let previous = 1
  let current = 1 + alpha - x
  for (let i = 1; i < k; i += 1) {
    const next = ((2 * i + 1 + alpha - x) * current - (i + alpha) * previous) / (i + 1)
    previous = current
    current = next
  }
  return current
}

export function radialFunction(n, l) {
  if (!Number.isInteger(n) || !Number.isInteger(l) || n < 1 || l < 0 || l >= n) {
    throw new RangeError(`Invalid quantum numbers n = ${n}, l = ${l}.`)
  }
  const norm = Math.sqrt((2 / n) ** 3 * factorial(n - l - 1) / (2 * n * factorial(n + l)))
  return r => {
    const rho = (2 * r) / n
    return norm * Math.exp(-rho / 2) * rho ** l * laguerre(n - l - 1, 2 * l + 1, rho)
  }
}

/**
 * Build ψ(x, y, z) for one orbital.
 * @returns {{ psi: (x:number,y:number,z:number)=>number, R: (r:number)=>number, Y: Function }}
 */
export function createOrbital(n, l, key) {
  const R = radialFunction(n, l)
  const Y = harmonic(l, key)
  return {
    n,
    l,
    key,
    R,
    Y,
    psi(x, y, z) {
      const r = Math.hypot(x, y, z)
      if (r === 0) return l === 0 ? R(0) * Y(0, 0, 1) : 0
      return R(r) * Y(x / r, y / r, z / r)
    }
  }
}

export function nodeCounts(n, l) {
  return { radial: n - l - 1, angular: l, total: n - 1 }
}

/* Radius (a₀) inside which the radial probability reaches `fraction`. */
export function radialExtent(n, l, fraction = 0.995) {
  const R = radialFunction(n, l)
  const limit = 6 * n * n + 10
  const steps = 4000
  const dr = limit / steps
  let total = 0
  const cumulative = new Float64Array(steps + 1)
  for (let i = 1; i <= steps; i += 1) {
    const r = i * dr
    const value = R(r)
    total += r * r * value * value * dr
    cumulative[i] = total
  }
  for (let i = 1; i <= steps; i += 1) {
    if (cumulative[i] / total >= fraction) return i * dr
  }
  return limit
}

/* Deterministic PRNG so the same orbital always looks the same (and tests are stable). */
export function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Sample electron positions with probability density |ψ|².
 * Radius from the inverse CDF of r²R², direction by rejection on |Y|².
 * @returns {{ positions: Float32Array, phases: Int8Array, extent: number }}
 */
export function sampleDensity(n, l, key, count, seed = 1) {
  const R = radialFunction(n, l)
  const Y = harmonic(l, key)
  const random = mulberry32(seed)
  const extent = radialExtent(n, l)

  const steps = 2048
  const dr = extent / steps
  const cdf = new Float64Array(steps + 1)
  for (let i = 1; i <= steps; i += 1) {
    const r = (i - 0.5) * dr
    const value = R(r)
    cdf[i] = cdf[i - 1] + r * r * value * value
  }
  const total = cdf[steps]

  let maxY2 = 0
  for (let i = 0; i < 4096; i += 1) {
    const [x, y, z] = randomDirection(random)
    maxY2 = Math.max(maxY2, Y(x, y, z) ** 2)
  }
  maxY2 *= 1.05

  const positions = new Float32Array(count * 3)
  const phases = new Int8Array(count)

  for (let index = 0; index < count; index += 1) {
    const target = random() * total
    let low = 0
    let high = steps
    while (low < high) {
      const mid = (low + high) >> 1
      if (cdf[mid] < target) low = mid + 1
      else high = mid
    }
    const r = (low - random()) * dr

    let x, y, z, value
    do {
      [x, y, z] = randomDirection(random)
      value = Y(x, y, z)
    } while (random() * maxY2 > value * value)

    positions[index * 3] = x * r
    positions[index * 3 + 1] = y * r
    positions[index * 3 + 2] = z * r
    phases[index] = Math.sign(value * R(r)) || 1
  }

  return { positions, phases, extent }
}

function randomDirection(random) {
  const z = 2 * random() - 1
  const t = 2 * PI * random()
  const s = Math.sqrt(1 - z * z)
  return [s * Math.cos(t), s * Math.sin(t), z]
}

/**
 * Evaluate ψ on a cubic grid spanning [−extent, extent]³ and find the
 * |ψ| level whose enclosed region holds `fraction` of the probability.
 * Grid index order matches three.js MarchingCubes: x + y·N + z·N².
 */
export function sampleGrid(n, l, key, resolution, fraction = 0.9) {
  const { psi } = createOrbital(n, l, key)
  const extent = radialExtent(n, l, 0.99)
  const size = resolution
  const values = new Float32Array(size ** 3)
  const half = size / 2

  for (let zi = 0; zi < size; zi += 1) {
    const z = ((zi - half) / half) * extent
    for (let yi = 0; yi < size; yi += 1) {
      const y = ((yi - half) / half) * extent
      const offset = size * yi + size * size * zi
      for (let xi = 0; xi < size; xi += 1) {
        values[offset + xi] = psi(((xi - half) / half) * extent, y, z)
      }
    }
  }

  const densities = Array.from(values, value => value * value).sort((a, b) => b - a)
  const total = densities.reduce((sum, value) => sum + value, 0)
  let accumulated = 0
  let level = densities[0]
  for (const density of densities) {
    accumulated += density
    level = density
    if (accumulated >= fraction * total) break
  }

  return { values, extent, size, isoValue: Math.sqrt(level) }
}
