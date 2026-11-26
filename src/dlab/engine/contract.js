// Universal command contract: every laboratory action (2D, 3D, Guided, Sandbox, tests) goes through sim.dispatch, which
// checks this contract first, then safety (safety.js), then applies the command atomically. A rejected command changes
// nothing (no state, no undo entry, no journal line).
//
// Spec fields: refs = { field: capability | [capabilities, any of] | 'any' } (must exist and have the capability,
// EQUIPMENT[type].caps); optional = ref fields that may be omitted; qty = { field: unit } (finite, > 0);
// qtyOptional = same when present; num = { field: 'required' | 'optional' } (finite numbers: positions, angles, volts);
// reagent = allowed reagent kinds; distinct = pairs of ref fields that must differ.
import { EQUIPMENT } from '../data/equipment.js'
import { REAGENT_BY_ID } from '../data/materials.js'

const SOLUTION = ['solution', 'liquid', 'indicator']
const SOLID_TOOL = ['grab', 'scoop'] // tongs (pieces), spatula (powders); which one fits a reagent is a safety rule
export const COMMAND_CONTRACT = {
  add: { num: { x: 'optional', y: 'optional' }, doc: 'Lấy dụng cụ ra bàn (chai cần một dung dịch/chất lỏng trong tủ).' },
  move: { refs: { id: 'any' }, num: { x: 'required', y: 'required' }, doc: 'Di chuyển vật (mm).' },
  tilt: { refs: { id: 'pour' }, num: { angle: 'required' }, doc: 'Nghiêng bình để rót (rad).' },
  pourExact: { refs: { from: 'pour', to: 'contain' }, optional: ['to'], distinct: [['from', 'to']], qty: { mL: 'mL' }, doc: 'Rót đúng thể tích; thiếu "to" là đổ ra bàn.' },
  aspirate: { refs: { tool: 'aspirate', from: 'contain' }, qty: { mL: 'mL' }, doc: 'Hút vào ống nhỏ giọt/pipet.' },
  dispense: { refs: { tool: 'dispense' }, qtyOptional: { drops: 'giọt', mL: 'mL' }, doc: 'Nhỏ giọt hoặc xả một thể tích.' },
  pick: { refs: { tool: SOLID_TOOL }, qty: { massG: 'g' }, reagent: ['solid'], doc: 'Lấy chất rắn bằng kẹp (mẩu) hoặc thìa (bột); dụng cụ phải đang trống.' },
  grab: { refs: { tool: 'grab', id: 'any' }, doc: 'Gắp lại một mẩu chất rắn đã có.' },
  release: { refs: { tool: SOLID_TOOL }, doc: 'Thả chất rắn đang giữ.' },
  stir: { refs: { id: 'contain' }, qtyOptional: { amount: 'cường độ khuấy' }, doc: 'Khuấy.' },
  burner: { refs: { id: 'heat' }, doc: 'Bật/tắt bếp.' },
  power: { refs: { id: 'power' }, num: { volts: 'optional' }, doc: 'Bật/tắt nguồn, đặt hiệu điện thế (V, ≥ 0).' },
  wire: { refs: { from: 'any', to: 'any' }, distinct: [['from', 'to']], doc: 'Nối dây.' },
  link: { refs: { id: 'bridge', a: 'contain', b: 'contain' }, distinct: [['a', 'b']], doc: 'Đặt cầu muối nối hai cốc.' },
  co2: { refs: { id: 'any', target: 'contain' }, optional: ['target'], doc: 'Sục / ngừng sục CO₂ (bình khí → cốc).' },
  remove: { refs: { id: 'any' }, doc: 'Cất vật khỏi bàn.' },
  cleanup: { doc: 'Dọn chất đổ và vật hỏng.' },
  replace: { refs: { id: 'any' }, doc: 'Thay dụng cụ hỏng (không áp dụng cho chất rắn).' },
  newLitmus: { num: { x: 'optional' }, doc: 'Lấy giấy quỳ mới.' },
  addReagentTo: { refs: { id: 'contain' }, qty: { mL: 'mL' }, reagent: SOLUTION, doc: 'Cho thể tích dung dịch/chất lỏng từ tủ hóa chất vào bình.' }
}
const CAP_WORD = { contain: 'chứa chất', pour: 'rót', aspirate: 'hút chất lỏng', dispense: 'nhỏ giọt', grab: 'gắp', scoop: 'lấy chất bột', heat: 'đun', power: 'cấp điện', bridge: 'làm cầu muối', gas: 'cấp khí' }
const hasCap = (o, cap) => (Array.isArray(cap) ? cap : [cap]).some(c => EQUIPMENT[o.type]?.caps?.includes(c))

// null when the command satisfies its contract, else the list of reasons (Vietnamese, shown to the student).
export function contractProblems(state, cmd) {
  const spec = Object.hasOwn(COMMAND_CONTRACT, cmd?.type) ? COMMAND_CONTRACT[cmd.type] : null
  if (!spec) return [`Lệnh không hợp lệ: ${cmd?.type}`]
  const out = []
  const byId = id => state.objects.find(o => o.id === id)
  for (const [field, cap] of Object.entries(spec.refs || {})) {
    if (cmd[field] == null && spec.optional?.includes(field)) continue
    const o = byId(cmd[field])
    if (!o) { out.push(`Không tìm thấy vật "${cmd[field] ?? '—'}" trên bàn.`); continue }
    if (cap !== 'any' && !hasCap(o, cap)) out.push(`${EQUIPMENT[o.type]?.name || o.type} không dùng để ${(Array.isArray(cap) ? cap : [cap]).map(c => CAP_WORD[c] || c).join(' / ')}.`)
  }
  for (const [a, b] of spec.distinct || []) if (cmd[a] != null && cmd[a] === cmd[b]) out.push('Nguồn và đích phải là hai vật khác nhau.')
  for (const [field, unit] of Object.entries(spec.qty || {})) if (!(Number.isFinite(cmd[field]) && cmd[field] > 0)) out.push(`Lượng phải là số dương (${unit}).`)
  for (const [field, unit] of Object.entries(spec.qtyOptional || {})) if (cmd[field] != null && !(Number.isFinite(cmd[field]) && cmd[field] > 0)) out.push(`Lượng phải là số dương (${unit}).`)
  for (const [field, need] of Object.entries(spec.num || {})) if ((need === 'required' || cmd[field] != null) && !Number.isFinite(cmd[field])) out.push(`Giá trị "${field}" phải là một số.`)
  if (cmd.type === 'dispense' && cmd.drops != null && !Number.isInteger(cmd.drops)) out.push('Số giọt phải là số nguyên.')
  if (cmd.type === 'power' && cmd.volts != null && cmd.volts < 0) out.push('Hiệu điện thế không được âm.')
  if (spec.reagent) {
    const r = REAGENT_BY_ID[cmd.reagent]
    if (!r) out.push(`Không có hóa chất "${cmd.reagent}" trong tủ.`)
    else if (!spec.reagent.includes(r.kind)) out.push(`${r.name} không dùng được với thao tác này.`)
  }
  const ref = f => byId(cmd[f])
  if (cmd.type === 'add') {
    if (!Object.hasOwn(EQUIPMENT, cmd.equipmentType)) out.push(`Không có dụng cụ loại ${cmd.equipmentType}.`)
    else if (cmd.equipmentType === 'bottle' && cmd.reagent != null && !SOLUTION.includes(REAGENT_BY_ID[cmd.reagent]?.kind)) out.push(`Không có dung dịch/chất lỏng "${cmd.reagent}" để đựng trong chai.`)
  }
  if (cmd.type === 'pick' && ref('tool')?.load) out.push('Dụng cụ đang giữ một chất rắn: thả xuống trước khi lấy chất khác.')
  if (cmd.type === 'grab' && ref('id') && ref('id').type !== 'solid') out.push('Chỉ gắp được mẩu chất rắn.')
  if (cmd.type === 'replace' && ref('id') && !EQUIPMENT[ref('id').type]) out.push('Chỉ thay được dụng cụ.')
  if (cmd.type === 'co2' && ref('id') && !hasCap(ref('id'), cmd.target != null ? 'gas' : 'contain')) out.push(`${EQUIPMENT[ref('id').type]?.name} không cấp được khí CO₂.`)
  return out.length ? out : null
}
