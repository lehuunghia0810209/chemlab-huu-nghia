
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
