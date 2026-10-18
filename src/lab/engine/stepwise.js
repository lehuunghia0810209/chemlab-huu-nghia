/* =========================================================
   STEPWISE PROTONATION (carbonate / sulfite + HCl)
   Teaching model with stated assumptions:
   - Acid added to the salt: each H⁺ first turns XO₃²⁻ into
     HXO₃⁻ (stage 1, no gas); only then HXO₃⁻ + H⁺ → XO₂↑ + H₂O
     (stage 2).
   - Salt added to the acid: while acid is in excess each XO₃²⁻
     takes 2 H⁺ at once and releases gas.
   Reactions are taken as complete and all gas as released
   (open beaker). Real solutions can lose a little gas earlier
   and keep some dissolved — the UI says so.
   Replays the additions in order, so the result depends on the
   mixing order exactly as in the classic textbook experiment.
========================================================= */

export const STEPWISE_SYSTEMS = [
  {
    id: 'carbonate',
    reactionIds: ['na2co3-hcl', 'nahco3-hcl'],
    acid: 'hcl',
    dibasic: 'na2co3',
    monobasic: 'nahco3',
    gas: 'CO2',
    labels: { dibasic: 'CO₃²⁻', monobasic: 'HCO₃⁻', gas: 'CO₂' },
    stage1: 'CO₃²⁻ + H⁺ → HCO₃⁻',
    stage2: 'HCO₃⁻ + H⁺ → CO₂↑ + H₂O',
    direct: 'CO₃²⁻ + 2H⁺ → CO₂↑ + H₂O'
  },
  {
    id: 'sulfite',
    reactionIds: ['na2so3-hcl'],
    acid: 'hcl',
    dibasic: 'na2so3',
    monobasic: null,
    gas: 'SO2',
    labels: { dibasic: 'SO₃²⁻', monobasic: 'HSO₃⁻', gas: 'SO₂' },
    stage1: 'SO₃²⁻ + H⁺ → HSO₃⁻',
    stage2: 'HSO₃⁻ + H⁺ → SO₂↑ + H₂O',
    direct: 'SO₃²⁻ + 2H⁺ → SO₂↑ + H₂O'
  }
]

export function stepwiseSystemFor(reactionId) {
  return STEPWISE_SYSTEMS.find(system => system.reactionIds.includes(reactionId)) || null
}

/**
 * @param system entry of STEPWISE_SYSTEMS
 * @param {{ id: string, volume: number }[]} additions in order (mL)
 * @param {(id: string) => number|null} concentrationOf mol/L
 * @returns amounts in mol: { acid, dibasic, monobasic, gas, stage1, stage2 }
 *   (acid/dibasic/monobasic = what is left in the beaker; gas = released in total;
 *   stage1/stage2 = how much reacted by each step)
 */
export function replayStepwise(system, additions, concentrationOf) {
  const state = { acid: 0, dibasic: 0, monobasic: 0, gas: 0, stage1: 0, stage2: 0, direct: 0 }

  const acidOntoSalt = () => {
    const first = Math.min(state.acid, state.dibasic)
    state.acid -= first
    state.dibasic -= first
    state.monobasic += first
    state.stage1 += first
    const second = Math.min(state.acid, state.monobasic)
    state.acid -= second
    state.monobasic -= second
    state.gas += second
    state.stage2 += second
  }

  const saltIntoAcid = () => {
    // Acid in excess: XO₃²⁻ + 2H⁺ → XO₂↑ directly, then any HXO₃⁻.
    const direct = Math.min(state.dibasic, state.acid / 2)
    state.dibasic -= direct
    state.acid -= 2 * direct
    state.gas += direct
    state.direct += direct
    const second = Math.min(state.acid, state.monobasic)
    state.acid -= second
    state.monobasic -= second
    state.gas += second
    state.stage2 += second
  }

  for (const { id, volume } of additions) {
    const moles = (concentrationOf(id) ?? 0) * Math.max(0, Number(volume) || 0) / 1000
    if (!moles) continue
    if (id === system.acid) {
      state.acid += moles
      acidOntoSalt()
    }
    else if (id === system.dibasic) {
      state.dibasic += moles
      saltIntoAcid()
    }
    else if (id === system.monobasic) {
      state.monobasic += moles
      saltIntoAcid()
    }
  }

  return state
}
