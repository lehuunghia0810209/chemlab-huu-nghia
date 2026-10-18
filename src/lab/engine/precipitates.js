/* =========================================================
   PRECIPITATES — one table for identity, colour and label
   Colours are drawing colours chosen to match the colour named
   in Vietnamese school textbooks (label). Reaction data must use
   the same colour for the same solid (test-checked), and the
   observation text uses the label, never a guess from the hex.
========================================================= */

export const PRECIPITATES = {
  'AgCl': { color: '#f5f5f5', label: 'trắng' },
  'AgBr': { color: '#e8ddb4', label: 'vàng nhạt' },
  'AgI': { color: '#efd03f', label: 'vàng' },
  'AgSCN': { color: '#f1f1ed', label: 'trắng' },
  'Ag2CO3': { color: '#e7d88d', label: 'vàng nhạt' },
  'Ag2S': { color: '#222222', label: 'đen' },
  'PbI2': { color: '#f2cf35', label: 'vàng' },
  'PbSO4': { color: '#f4f4f4', label: 'trắng' },
  'BaSO4': { color: '#f4f4f4', label: 'trắng' },
  'BaCO3': { color: '#f4f4f4', label: 'trắng' },
  'CaCO3': { color: '#f4f4f4', label: 'trắng' },
  'MgCO3': { color: '#f4f4f4', label: 'trắng' },
  'CuCO3': { color: '#67a889', label: 'xanh' },
  'Ca3(PO4)2': { color: '#f4f4f4', label: 'trắng' },
  'CaC2O4': { color: '#f4f4f4', label: 'trắng' },
  'FePO4': { color: '#e8d6a8', label: 'vàng nhạt' },
  'CuS': { color: '#242424', label: 'đen' },
  'FeS': { color: '#303030', label: 'đen' },
  'Cu(OH)2': { color: '#39a9ff', label: 'xanh lam' },
  'Fe(OH)2': { color: '#7aa66d', label: 'trắng xanh' },
  'Fe(OH)3': { color: '#a15431', label: 'nâu đỏ' },
  'Mg(OH)2': { color: '#f4f4f4', label: 'trắng' },
  'Zn(OH)2': { color: '#f4f4f4', label: 'trắng' },
  'Al(OH)3': { color: '#f4f4f4', label: 'keo trắng' },
  'Cu2O': { color: '#c85a32', label: 'đỏ gạch' },
  'MnO2': { color: '#795b3b', label: 'nâu đen' },
  'C6H2Br3OH': { color: '#f2f2e8', label: 'trắng' }
}

const SUBSCRIPT = '₀₁₂₃₄₅₆₇₈₉'
const plain = text => text.replace(/[₀-₉]/g, char => String(SUBSCRIPT.indexOf(char)))

/* Solids marked with ↓ in a reaction's equation, with their table entry
   (entry is null for a solid missing from the table). */
export function solidsOf(reaction) {
  const products = String(reaction?.equation || '').split(/→|⇌/)[1] || ''
  return [...products.matchAll(/(?:^|[\s+])(?:\d+)?([A-Za-z0-9₀-₉()[\]]+)↓/g)].map(match => {
    const formula = plain(match[1])
    return { formula, display: match[1], ...(PRECIPITATES[formula] || { color: null, label: null }) }
  })
}
