// Library catalogue and search (pure: no DOM), shared by the Dynamic Lab UI and its tests.
import { EQUIPMENT } from '../data/equipment.js'
import { REAGENTS } from '../data/materials.js'

const sub = f => String(f || '').replace(/(\d+)/g, d => [...d].map(ch => '₀₁₂₃₄₅₆₇₈₉'[ch]).join('')).replace(/\^?(\d?)([+-])$/, '$1$2')

export const LIB_TABS = [
  { id: 'equipment', label: 'Dụng cụ' },
  { id: 'solution', label: 'Dung dịch' },
  { id: 'liquid', label: 'Chất lỏng' },
  { id: 'solid', label: 'Chất rắn' },
  { id: 'gas', label: 'Chất khí' },
  { id: 'indicator', label: 'Chỉ thị' },
  { id: 'measure', label: 'Đo & điện' }
]
export const TOOLS = ['dropper', 'pipette', 'rod', 'spatula', 'tongs', 'thermometer', 'phMeter', 'electrodes', 'litmusPaper']
const EQUIP_TAB = { glass: 'equipment', support: 'equipment', transfer: 'equipment', tool: 'equipment', stock: null, measure: 'measure', heat: 'measure', electro: 'measure', gas: 'gas' }

export function libraryItems() {
  const items = []
  for (const [type, def] of Object.entries(EQUIPMENT)) {
    const tab = EQUIP_TAB[def.group]
    if (!tab) continue
    items.push({ key: `eq:${type}`, tab, name: def.name, sub: def.capacityML ? `${def.capacityML} mL` : (def.caps || []).map(c => ({ dip: 'nhúng', stir: 'khuấy', grab: 'gắp', scoop: 'xúc', measure: 'đo', heat: 'cấp nhiệt', power: 'cấp điện', aspirate: 'hút/nhỏ', hold: 'giữ', electrode: 'điện cực', bridge: 'nối dung dịch', gas: 'sục khí' })[c]).filter(Boolean).join(' · '), type })
    if (type === 'litmusPaper') items.push({ key: 'eq:litmusPaper:ind', tab: 'indicator', name: def.name, sub: 'nhúng trực tiếp', type })
  }
  for (const r of REAGENTS) {
    const tab = r.kind === 'solution' ? 'solution' : r.kind === 'liquid' ? 'liquid' : r.kind === 'solid' ? 'solid' : r.kind === 'indicator' ? 'indicator' : 'gas'
    if (r.kind === 'gas') continue
    items.push({ key: `rg:${r.id}`, tab, name: r.name, sub: `${sub(r.formula) || ''}${r.M ? ` · ${String(r.M).replace('.', ',')} M` : ''}`, reagent: r.id, reagentDef: r })
  }
  return items
}

// Search: an item whose base name (before "(") is exactly the query ranks first, so "natri" finds
// sodium metal before sodium salts; then names starting with the query; then any match.
const COMBINING = new RegExp('[̀-ͯ]', 'g') // diacritics after NFD, so "nuoc" matches "nước"
const fold = t => t.toLowerCase().normalize('NFD').replace(COMBINING, '').replace(/đ/g, 'd')
export function searchLibrary(items, query) {
  const q = fold(query.trim())
  if (!q) return null
  const rank = it => {
    const name = fold(it.name)
    const base = name.split('(')[0].trim()
    if (base === q) return 0
    if (name.startsWith(q)) return 1
    if (name.includes(q)) return 2
    return fold(`${it.sub} ${it.reagentDef?.nameEn || ''} ${it.reagentDef?.formula || ''}`).includes(q) ? 3 : -1
  }
  return items.map(it => [rank(it), it]).filter(([r]) => r >= 0).sort((a, b) => a[0] - b[0] || a[1].name.length - b[1].name.length).map(([, it]) => it)
}

