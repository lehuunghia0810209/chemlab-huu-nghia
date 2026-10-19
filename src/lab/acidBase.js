
export const STOCK_CONCENTRATION = 0.1
export const KW = 1.0e-14
export const KA2_HSO4 = 1.0e-2

export const STRONG = {
  hcl: { acid: 1 },
  hno3: { acid: 1 },
  h2so4: { sulfate: 1 },
  naoh: { base: 1 },
  koh: { base: 1 },
  baoh2: { base: 2 }
}

export const SPECTATOR = {
  nacl: { acid: 1, base: 1 },
  kcl: { acid: 1, base: 1 },
  kbr: { acid: 1, base: 1 },
  ki: { acid: 1, base: 1 },
  nano3: { acid: 1, base: 1 },
  kno3: { acid: 1, base: 1 },
  na2so4: { base: 2, sulfate: 1 },
  k2so4: { base: 2, sulfate: 1 }
}

const DILUENT_ONLY = new Set(['water'])

export function solveStrongPH({ acid = 0, base = 0, sulfate = 0 }) {
  const excess = h => h + base - KW / h - acid - sulfate * (h + 2 * KA2_HSO4) / (h + KA2_HSO4)
  let low = -16
  let high = 2
  for (let step = 0; step < 80; step += 1) {
    const mid = (low + high) / 2
    if (excess(10 ** mid) > 0) high = mid
    else low = mid
  }
  return -(low + high) / 2
}

function estimatePH(mixture, totalVolume, reagents) {
  let balance = 0
  for (const [id, volume] of Object.entries(mixture)) {
    balance += Number(reagents[id]?.acidBase || 0) * volume
  }
  return Math.min(13, Math.max(1, 7 + balance / Math.max(totalVolume, 1) * 6))
}

export function computeAcidBase(mixture, reagents) {
  const entries = Object.entries(mixture).filter(([, volume]) => volume > 0)
  const totalVolume = entries.reduce((sum, [, volume]) => sum + volume, 0)
  if (!totalVolume) return { pH: 7, mode: 'empty', species: [] }

  const litres = totalVolume / 1000
  const totals = { acid: 0, base: 0, sulfate: 0 }
  const species = []
  let quantitative = true

  for (const [id, volume] of entries) {
    const ions = STRONG[id] || SPECTATOR[id]
    if (ions) {
      const moles = STOCK_CONCENTRATION * volume / 1000
      for (const key of Object.keys(totals)) totals[key] += (ions[key] || 0) * moles
      species.push({ id, volume, moles, stock: STOCK_CONCENTRATION, concentration: moles / litres })
    }
    else if (!DILUENT_ONLY.has(id) && reagents[id]?.family !== 'indicator') {
      quantitative = false
    }
  }

  if (!quantitative) {
    return { pH: estimatePH(mixture, totalVolume, reagents), mode: 'estimate', species: [] }
  }

  return {
    pH: solveStrongPH({
      acid: totals.acid / litres,
      base: totals.base / litres,
      sulfate: totals.sulfate / litres
    }),
    mode: 'quantitative',
    species
  }
}
