/* =========================================================
   VIRTUAL LAB — ACID/BASE MODEL
   pH from moles, not from a colour score.

   Quantitative mode (25 °C, ideal solution, activities = 1):
   used when every substance in the beaker is a strong acid or
   base listed in STRONG, a spectator salt, water or an indicator. Those stock
   solutions are taken as 0.1 M (the lab catalogue has no
   concentrations). H₂SO₄ uses its second dissociation
   (Ka₂ = 1.0×10⁻², pKa₂ ≈ 1.99), so 0.1 M H₂SO₄ gives pH ≈ 0.96,
   not 0.70.

   Spectator salts (Na⁺/K⁺ with Cl⁻, Br⁻, I⁻, NO₃⁻, SO₄²⁻) enter
   the charge balance at 0.1 M too; water and indicators only
   dilute. Anything else — weak acids/bases, hydrolysing salts,
   Ca(OH)₂ lime water, and substances that consume H⁺/OH⁻ in a
   reaction (e.g. MgCl₂ + NaOH → Mg(OH)₂↓, ester saponification) —
   falls back to the qualitative score, flagged mode: 'estimate'.
========================================================= */

export const STOCK_CONCENTRATION = 0.1 // mol/L
export const KW = 1.0e-14
export const KA2_HSO4 = 1.0e-2

/* Per formula unit: H⁺ from monoprotic strong acids (anion
   fully free), sulfate for H₂SO₄, OH⁻ from strong bases. */
export const STRONG = {
  hcl: { acid: 1 },
  hno3: { acid: 1 },
  h2so4: { sulfate: 1 },
  naoh: { base: 1 },
  koh: { base: 1 },
  baoh2: { base: 2 }
}

/* Ions that take no part in acid/base chemistry: cation
   equivalents count as "base", anion equivalents as "acid", so
   they cancel except for sulfate's HSO₄⁻ equilibrium. */
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

/* Charge balance: [H⁺] + [M⁺] = [OH⁻] + [A⁻] + [HSO₄⁻] + 2[SO₄²⁻] */
export function solveStrongPH({ acid = 0, base = 0, sulfate = 0 }) {
  const excess = h => h + base - KW / h - acid - sulfate * (h + 2 * KA2_HSO4) / (h + KA2_HSO4)
  // excess() rises monotonically with h: bisect on log10 h.
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

/* mixture: { id: volume in mL }. Returns
   { pH, mode: 'empty' | 'quantitative' | 'estimate', species } where
   species lists the modelled solutions with mol and concentration. */
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
