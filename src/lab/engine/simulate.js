/* =========================================================
   VIRTUAL LAB — CHEMISTRY STATE FROM THE ACTION LOG
   One deterministic function from (ordered additions, triggered
   reactions) to the chemical state the UI and the renderer
   show. Nothing here mutates the lab; undo/reset only change
   the log, so no amount is ever consumed twice.
========================================================= */

import { stockConcentration } from '../concentrations.js'
import { computeStoichiometry } from '../stoichiometry.js'
import { replayStepwise, stepwiseSystemFor } from './stepwise.js'

export const SHARED_REASON = 'Nhiều phản ứng dùng chung một chất trong cốc nên ChemLab không tính riêng lượng chất của từng phản ứng.'

export function mixtureFrom(additions) {
  const mixture = {}
  for (const { id, volume } of additions) mixture[id] = (mixture[id] || 0) + volume
  return mixture
}

/* Reagents a reaction (or its stepwise system) draws on. */
function reagentsOf(reaction) {
  const system = stepwiseSystemFor(reaction.id)
  return system ? [system.acid, system.dibasic, system.monobasic].filter(Boolean) : reaction.reactants
}

/**
 * @param {{ additions: {id: string, volume: number}[], triggeredIds: Iterable<string>,
 *           reactions: object[], reagents: Record<string, object>,
 *           concentrationOf?: (id: string) => number|null }} input
 * @returns {{ mixture, results: Map<string, object>, solidMoles: number, gasMoles: number }}
 *   results: reaction id → stoichiometry result, stepwise result
 *   ({ status: 'quantitative', kind: 'stepwise', system, state }) or a qualitative result.
 */
export function simulateLab({ additions, triggeredIds, reactions, reagents, concentrationOf = stockConcentration }) {
  const mixture = mixtureFrom(additions)
  const triggered = [...triggeredIds].map(id => reactions.find(item => item.id === id)).filter(Boolean)
  const results = new Map()

  // Reactions that compete for a reagent cannot be computed independently.
  const groupOf = reaction => stepwiseSystemFor(reaction.id)?.id || reaction.id
  const users = new Map()
  for (const reaction of triggered) {
    for (const reagent of reagentsOf(reaction)) {
      if (!(mixture[reagent] > 0)) continue
      users.set(reagent, new Set([...(users.get(reagent) || []), groupOf(reaction)]))
    }
  }
  const isShared = reaction => reagentsOf(reaction).some(reagent => (users.get(reagent)?.size || 0) > 1)

  let solidMoles = 0
  let gasMoles = 0
  const countedSystems = new Set()

  for (const reaction of triggered) {
    if (isShared(reaction)) {
      results.set(reaction.id, { status: 'qualitative', reason: SHARED_REASON })
      continue
    }

    const system = stepwiseSystemFor(reaction.id)
    if (system) {
      if ([system.acid, system.dibasic, system.monobasic].filter(Boolean).some(id => (mixture[id] || 0) > 0 && concentrationOf(id) === null)) {
        results.set(reaction.id, { status: 'qualitative', reason: 'Phản ứng được mô phỏng định tính: thiếu dữ liệu nồng độ.' })
        continue
      }
      const state = replayStepwise(system, additions, concentrationOf)
      results.set(reaction.id, { status: 'quantitative', kind: 'stepwise', system, state })
      if (!countedSystems.has(system.id)) {
        countedSystems.add(system.id)
        gasMoles += state.gas
      }
      continue
    }

    const result = computeStoichiometry(reaction, mixture, reagents, concentrationOf)
    results.set(reaction.id, result || { status: 'qualitative', reason: 'Phản ứng được mô phỏng định tính.' })
    if (result?.status === 'quantitative') {
      for (const product of result.products) {
        if (product.precipitate) solidMoles += product.moles
        if (product.gas) gasMoles += product.moles
      }
    }
  }

  return { mixture, results, solidMoles, gasMoles }
}

/* Does the engine (rather than the trigger) decide when this reaction's gas appears? */
export function engineDrivesGas(reaction, simulation) {
  return simulation.results.get(reaction.id)?.status === 'quantitative' &&
    (simulation.results.get(reaction.id).kind === 'stepwise' ||
      simulation.results.get(reaction.id).products?.some(product => product.gas))
}
