// Observation model for the "Quan sát" panel: a read-only digest of the simulation state.
// Priority: what is happening now → results & explanations → safety. Repeated technical
// entries are merged (with a count) instead of dropped, so no history is lost.
import { KINETIC } from '../data/reactions.js'
import { INDICATORS, REAGENT_BY_ID } from '../data/materials.js'
import { isContainer, volumeOf, label, byId } from '../engine/processes.js'

// Short textbook explanations shown once a modelled reaction has run to completion (UI text only).
const EXPLAIN = {
  'na-water': 'Natri là kim loại rất hoạt động: khử nước tạo NaOH (dung dịch có tính bazơ) và khí H₂. Natri nhẹ hơn nước nên nổi; khí thoát ra không đều đẩy mẩu natri chạy trên mặt nước.',
  'mg-acid': 'Mg đứng trước H trong dãy hoạt động hóa học nên đẩy được H₂ ra khỏi dung dịch axit không có tính oxi hóa mạnh (như HCl, H₂SO₄ loãng).',
  'zn-acid': 'Zn đứng trước H trong dãy hoạt động hóa học nên đẩy được H₂ ra khỏi dung dịch axit không có tính oxi hóa mạnh (như HCl, H₂SO₄ loãng).',
  'fe-acid': 'Fe đứng trước H nên tác dụng với dung dịch axit không có tính oxi hóa mạnh (như HCl, H₂SO₄ loãng), tạo muối sắt(II) và khí H₂.',
  'fe-cu': 'Fe hoạt động mạnh hơn Cu nên đẩy Cu ra khỏi dung dịch muối; đồng đỏ bám lên đinh sắt, màu xanh của Cu²⁺ nhạt dần.',
  'zn-cu': 'Zn hoạt động mạnh hơn Cu nên đẩy Cu ra khỏi dung dịch muối.',
  'cu-ag': 'Cu hoạt động mạnh hơn Ag nên đẩy Ag ra khỏi dung dịch muối; dung dịch có màu xanh của Cu²⁺.',
  'caco3-acid': 'Muối cacbonat tác dụng với axit mạnh hơn H₂CO₃ (như HCl, CH₃COOH), giải phóng khí CO₂.'
}

const fmt = (x, d = 1) => Number(x).toLocaleString('vi-VN', { maximumFractionDigits: d })

// Colour word an indicator shows at this pH, using the transition ranges in materials.js.
export function indicatorReading(key, pH) {
  if (pH == null) return null
  const name = INDICATORS[key]?.name
  if (key === 'phenolphthalein') return `${name} ${pH >= 8.2 ? 'chuyển hồng' : 'không màu'}`
  if (key === 'litmus') return `${name} ${pH < 5 ? 'màu đỏ' : pH > 8.3 ? 'màu xanh' : 'màu tím'}`
  if (key === 'methylOrange') return `${name} ${pH < 3.1 ? 'màu đỏ' : pH > 4.4 ? 'màu vàng' : 'màu da cam'}`
  return name ? `${name}: màu ứng với pH ≈ ${fmt(pH)}` : null
}

function mediumWord(pH) {
  return pH < 6.5 ? 'axit' : pH > 7.5 ? 'bazơ' : 'trung tính'
}

// Merge consecutive identical entries: [{text, kind, t, n}] newest first.
export function mergeRepeats(entries) {
  const out = []
  for (const e of entries) {
    const prev = out[out.length - 1]
    if (prev && prev.text === e.text && prev.kind === e.kind) { prev.n += 1; prev.t = e.t }
    else out.push({ ...e, n: 1 })
  }
  return out.reverse()
}

export function observe(state) {
  const now = state.t
  const happening = []
  for (const c of state.objects) {
    if (!isContainer(c) || c.stock) continue
    for (const [id, t] of Object.entries(c.activeReactions || {})) {
      if (now - t > 1.2) continue
      const rule = KINETIC.find(r => r.id === id)
      if (rule) happening.push({ key: `${id}-${c.id}`, where: label(c), text: rule.observe, equation: rule.equation })
      else if (id === 'co2') happening.push({ key: `co2-${c.id}`, where: label(c), text: c.co2Feed ? 'Đang sục khí CO₂ vào dung dịch: có bọt khí.' : 'Khí CO₂ thoát ra khỏi dung dịch: sủi bọt khí không màu.' })
    }
    const solids = state.objects.filter(s => s.type === 'solid' && s.in === c.id && s.massG > 0 && REAGENT_BY_ID[s.reagent]?.dissolves)
    for (const s of solids) if (now - (state.notes[`dissolve-${s.id}`] ?? -99) < 30) happening.push({ key: `dis-${s.id}`, where: label(c), text: `${REAGENT_BY_ID[s.reagent].name} đang tan dần.` })
  }

  // Conclusions: a modelled reaction ran to completion, plus what the indicator now shows (from the real pH).
  const conclusions = []
  for (const key of Object.keys(state.notes || {})) {
    const m = /^done-(.+)-(o\d+)$/.exec(key)
    if (!m) continue
    const rule = KINETIC.find(r => r.id === m[1])
    if (!rule) continue
    const where = Object.keys(state.notes).filter(k => k.startsWith(`rx-${m[1]}-`)).map(k => byId(state, k.slice(`rx-${m[1]}-`.length))).find(Boolean)
    const facts = []
    if (where && volumeOf(where) > 0.05 && where.pH != null) {
      for (const [k, v] of Object.entries(where.contents.indicators || {})) if (v > 0.001) facts.push(indicatorReading(k, where.pH))
      facts.push(`Dung dịch có môi trường ${mediumWord(where.pH)} (pH ≈ ${fmt(where.pH)}).`)
    }
    conclusions.push({ key, equation: rule.equation, text: EXPLAIN[rule.id] || rule.observe, facts: facts.filter(Boolean) })
  }

  const log = state.log || []
  const dedupe = list => { const seen = new Set(); return list.filter(e => !seen.has(e.text) && seen.add(e.text)) }
  // "No reaction" is a result a student needs to see too, not just a journal line.
  const results = dedupe(log.filter(e => e.kind === 'observe' || (e.kind === 'info' && e.text.startsWith('Không có phản ứng'))).slice().reverse()).slice(0, 6)
  const safety = dedupe(log.filter(e => e.kind === 'warn' || e.kind === 'danger').slice().reverse()).slice(0, 2)
  const journal = mergeRepeats(log)
  return { happening, conclusions, results, safety, journal }
}
