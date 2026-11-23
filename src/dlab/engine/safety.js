// Safety Engine: every command is assessed BEFORE it runs.
// level: ok | warn (needs confirmation, explained) | block (outside the safe educational model).
import { EQUIPMENT } from '../data/equipment.js'
import { REAGENT_BY_ID } from '../data/materials.js'
import { byId, containerAt, containerBelow, isContainer, volumeOf, label } from './processes.js'

const verdict = (level, reasons) => ({ level, reasons })

export function assess(state, cmd) {
  const warn = []
  const block = []
  switch (cmd.type) {
    case 'pick': {
      const tool = byId(state, cmd.tool)
      const r = REAGENT_BY_ID[cmd.reagent]
      if (!tool || !r || r.kind !== 'solid') { block.push('Dụng cụ hoặc hóa chất không hợp lệ.'); break }
      if (!(cmd.massG > 0)) block.push('Khối lượng phải lớn hơn 0.')
      if (cmd.massG > r.maxMass) block.push(`${r.name}: lượng ${cmd.massG} g vượt giới hạn an toàn của mô hình (tối đa ${r.maxMass} g).`)
      if (r.tool !== tool.type) block.push(r.tool === 'tongs' ? `${r.name} là mẩu rắn — phải dùng kẹp, không dùng thìa.` : `${r.name} là chất bột/tinh thể — dùng thìa lấy hóa chất.`)
      if (r.id === 'na') warn.push('Natri phản ứng mãnh liệt với nước, sinh khí H₂ dễ cháy và NaOH ăn mòn. Không cầm bằng tay; giữ khoảng cách; đeo kính bảo hộ.')
      break
    }
    case 'grab': {
      const tool = byId(state, cmd.tool)
      const s = byId(state, cmd.id)
      if (!tool || !s || s.type !== 'solid') { block.push('Không tìm thấy vật cần gắp.'); break }
      const r = REAGENT_BY_ID[s.reagent]
      if (tool.type !== 'tongs') block.push('Mẩu chất rắn được gắp bằng kẹp hóa chất.')
      else if (tool.load) block.push(`${label(tool)} đang giữ ${REAGENT_BY_ID[tool.load.reagent].name} — thả vật đó trước.`)
      if (!(s.massG > 0)) block.push(`${r.name} đã phản ứng hết, không còn gì để gắp.`)
      else if (r.tool !== 'tongs') block.push(`${r.name} là chất bột/tinh thể, đã vào dung dịch thì không gắp lại được bằng kẹp.`)
      else if (r.id === 'na' && s.in) block.push('Không gắp mẩu natri đang phản ứng ra khỏi nước. Đứng xa và để natri phản ứng hết.')
      if (s.holder && s.holder !== cmd.tool) block.push('Vật đang được dụng cụ khác giữ.')
      break
    }
    case 'release': {
      const tool = byId(state, cmd.tool)
      if (!tool?.load) break
      const r = REAGENT_BY_ID[tool.load.reagent]
      const c = containerAt(state, tool.x, tool.y + 1) || containerBelow(state, tool.x, tool.y + 40)
      if (r.id === 'na' && c) {
        if (c.type === 'testTube' || c.type === 'cylinder') block.push(`Không thả natri vào ${EQUIPMENT[c.type].name}: miệng hẹp làm khí và nhiệt dồn lại. Dùng chậu hoặc cốc rộng chứa nhiều nước.`)
        if (c.pH != null && c.pH < 4) block.push('Natri với dung dịch axit phản ứng quá mãnh liệt — nằm ngoài phạm vi an toàn của phòng thí nghiệm ảo.')
        if ((c.contents.liquids.water || 0) < 50 && !block.length) block.push('Cần ít nhất 50 mL nước để mẩu natri nhỏ phản ứng an toàn.')
        if (!block.length) warn.push('Phản ứng mạnh, tỏa nhiệt và sinh H₂ dễ cháy. Đứng xa, không cúi sát miệng chậu.')
      }
      if (c && c.condition === 'UNUSABLE') block.push(`${label(c)} đã hỏng, không thể chứa chất.`)
      break
    }
    case 'move': {
      const o = byId(state, cmd.id)
      if (!isContainer(o)) break
      const burner = state.objects.find(b => b.type === 'burner' && b.on && Math.abs(b.x - cmd.x) < EQUIPMENT.burner.w / 2 && cmd.y < b.y + EQUIPMENT.burner.h + 6)
      if (burner) heatChecks(o, warn, block)
      break
    }
    case 'burner': {
      if (!cmd.on) break
      const b = byId(state, cmd.id)
      const c = state.objects.find(o => isContainer(o) && Math.abs(o.x - b.x) < EQUIPMENT.burner.w / 2 && Math.abs(o.y - (b.y + EQUIPMENT.burner.h)) < 4)
      if (c) heatChecks(c, warn, block)
      break
    }
    case 'power': {
      const p = byId(state, cmd.id)
      const on = cmd.on ?? p.on
      const volts = cmd.volts ?? p.volts
      if (on && volts > 12) block.push('Nguồn chỉ được đặt tối đa 12 V.')
      if (on) {
        const wire = state.wires.find(w => w.from === p.id)
        const el = wire && byId(state, wire.to)
        const c = el && state.objects.find(o => isContainer(o) && Math.abs(o.x - el.x) < EQUIPMENT[o.type].w / 2)
        if (c && (c.contents.ions['Cl-'] || 0) > 0) warn.push('Điện phân dung dịch chứa Cl⁻ sinh khí Cl₂ độc: chỉ làm trong tủ hút, thời gian ngắn, dòng nhỏ.')
      }
      break
    }
    case 'pourExact':
    case 'addReagentTo': {
      const target = byId(state, cmd.type === 'pourExact' ? cmd.to : cmd.id)
      if (!target) break
      if (target.condition === 'UNUSABLE') block.push(`${label(target)} đã vỡ, không thể chứa chất.`)
      if (target.condition === 'CRACKED') warn.push(`${label(target)} đang bị nứt, chất lỏng sẽ rỉ ra bàn.`)
      if (target.T - 25 > 60 && volumeOf(target) < 5 && EQUIPMENT[target.type].breakable) warn.push(`${label(target)} đang rất nóng (${target.T.toFixed(0)} °C) và gần khô: cho chất lỏng lạnh vào có thể gây sốc nhiệt làm nứt dụng cụ.`)
      if (!(cmd.mL > 0)) block.push('Thể tích phải lớn hơn 0.')
      break
    }
    default:
      break
  }
  if (block.length) return verdict('block', block)
  if (warn.length) return verdict('warn', warn)
  return verdict('ok', [])
}

function heatChecks(c, warn, block) {
  const def = EQUIPMENT[c.type]
  if (!def.heatResistant) block.push(`${def.name} không chịu nhiệt — không được đun nóng.`)
  if (c.condition === 'CRACKED') block.push(`${label(c)} đang bị nứt — đun nóng sẽ làm vỡ.`)
  if (c.condition === 'UNUSABLE') block.push(`${label(c)} đã vỡ.`)
  if ((c.contents?.liquids.ethanol || 0) > 0) warn.push('Có etanol dễ cháy trong dụng cụ: hơi etanol bắt lửa khi đun. Chỉ đun cách thủy, tránh lửa trần.')
  if (volumeOf(c) < 0.05) warn.push('Đun dụng cụ rỗng làm thủy tinh rất nóng; cho chất lỏng lạnh vào sau đó có thể làm nứt.')
}
