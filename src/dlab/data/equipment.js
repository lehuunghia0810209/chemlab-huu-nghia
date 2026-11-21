// Equipment registry. Sizes in bench units (1 unit = 1 mm on screen at zoom 1).
// profile: half-width of the inner cavity from bottom (y=0) to rim (y=h), used for volume/level geometry.
// mmPerML converts cavity area (mm²) × depth into mL so the drawn level always matches the stored volume.

export const CAPABILITIES = {
  contain: 'Chứa chất',
  pour: 'Rót',
  heatable: 'Đun nóng được',
  aspirate: 'Hút chất lỏng',
  dispense: 'Nhỏ giọt / xả',
  dip: 'Nhúng',
  stir: 'Khuấy',
  grab: 'Gắp chất rắn',
  scoop: 'Lấy chất bột',
  hold: 'Giữ ống nghiệm',
  measure: 'Đo',
  heat: 'Cấp nhiệt',
  power: 'Cấp điện',
  electrode: 'Điện cực',
  bridge: 'Nối hai dung dịch'
}

const glass = { material: 'glass', breakable: true }

export const EQUIPMENT = {
  beaker100: { name: 'Cốc thủy tinh 100 mL', group: 'glass', w: 56, h: 70, capacityML: 100, shape: 'beaker', depth: 56, caps: ['contain', 'pour', 'heatable'], heatResistant: true, glassMassG: 60, ...glass },
  beaker250: { name: 'Cốc thủy tinh 250 mL', group: 'glass', w: 72, h: 92, capacityML: 250, shape: 'beaker', depth: 72, caps: ['contain', 'pour', 'heatable'], heatResistant: true, glassMassG: 110, ...glass },
  testTube: { name: 'Ống nghiệm', group: 'glass', w: 18, h: 110, capacityML: 20, shape: 'tube', depth: 18, caps: ['contain', 'pour', 'heatable'], heatResistant: true, glassMassG: 12, ...glass },
  flask: { name: 'Bình tam giác 100 mL', group: 'glass', w: 64, h: 86, capacityML: 100, shape: 'flask', depth: 64, caps: ['contain', 'pour', 'heatable'], heatResistant: true, glassMassG: 70, ...glass },
  cylinder: { name: 'Ống đong 50 mL', group: 'glass', w: 26, h: 130, capacityML: 50, shape: 'cylinder', depth: 26, caps: ['contain', 'pour'], heatResistant: false, glassMassG: 60, graduations: 1, ...glass },
  dish: { name: 'Chậu thủy tinh', group: 'glass', w: 120, h: 40, capacityML: 300, shape: 'dish', depth: 120, caps: ['contain', 'pour'], heatResistant: false, glassMassG: 200, ...glass },
  evaporating: { name: 'Bát sứ cô cạn', group: 'glass', w: 70, h: 28, capacityML: 50, shape: 'bowl', depth: 70, caps: ['contain', 'pour', 'heatable'], heatResistant: true, glassMassG: 80, material: 'porcelain', breakable: true },
  rack: { name: 'Giá ống nghiệm', group: 'support', w: 120, h: 70, caps: ['hold'], slots: 4 },
  dropper: { name: 'Ống nhỏ giọt', group: 'transfer', w: 10, h: 90, capacityML: 2, caps: ['aspirate', 'dispense'], dropML: 0.05 },
  pipette: { name: 'Pipet 10 mL', group: 'transfer', w: 8, h: 150, capacityML: 10, caps: ['aspirate', 'dispense'], dropML: 0.5 },
  rod: { name: 'Đũa thủy tinh', group: 'tool', w: 6, h: 140, caps: ['stir'] },
  spatula: { name: 'Thìa lấy hóa chất', group: 'tool', w: 10, h: 110, caps: ['scoop'] },
  tongs: { name: 'Kẹp hóa chất', group: 'tool', w: 14, h: 120, caps: ['grab'] },
  litmusPaper: { name: 'Giấy quỳ tím', group: 'tool', w: 10, h: 70, caps: ['dip'], segments: 28 },
  thermometer: { name: 'Nhiệt kế', group: 'measure', w: 8, h: 150, caps: ['measure', 'dip'], measures: 'temperature' },
  phMeter: { name: 'Máy đo pH', group: 'measure', w: 12, h: 130, caps: ['measure', 'dip'], measures: 'pH' },
  burner: { name: 'Bếp điện mini', group: 'heat', w: 90, h: 30, caps: ['heat'], powerW: 150 },
  power: { name: 'Nguồn điện một chiều', group: 'electro', w: 80, h: 50, caps: ['power'] },
  electrodes: { name: 'Cặp điện cực than chì', group: 'electro', w: 40, h: 120, caps: ['electrode', 'dip'] },
  bridge: { name: 'Cầu muối (KNO₃)', group: 'electro', w: 120, h: 60, caps: ['bridge'] },
  voltmeter: { name: 'Vôn kế', group: 'electro', w: 70, h: 50, caps: ['measure'], measures: 'voltage' },
  bottle: { name: 'Chai hóa chất', group: 'stock', w: 46, h: 80, capacityML: 500, shape: 'bottle', depth: 46, caps: ['contain', 'pour'], heatResistant: false, glassMassG: 250, ...glass }
}

// Inner half-width (mm) at height y for each shape.
export function halfWidthAt(def, y) {
  const w = def.w / 2 - 3
  switch (def.shape) {
    case 'flask': {
      const neckStart = def.h * 0.62
      const neck = w * 0.32
      if (y >= neckStart) return neck
      return neck + (w - neck) * (1 - y / neckStart)
    }
    case 'bottle': {
      const shoulder = def.h * 0.72
      if (y >= shoulder + 10) return w * 0.4
      if (y >= shoulder) return w - (w - w * 0.4) * (y - shoulder) / 10
      return w
    }
    case 'bowl': return Math.max(4, w * Math.sqrt(Math.max(0, 1 - ((def.h - y) / def.h) ** 2) * 0.9 + 0.1))
    default: return w
  }
}

export function innerHeight(def) {
  return def.h - 4
}

// Cross-section area at height y as if the vessel were a solid of revolution (mm²); volume = ∫A dy.
function areaAt(def, y) {
  const r = halfWidthAt(def, y)
  return Math.PI * r * r
}

const volumeTables = new Map()

// Cumulative volume (mL) from the bottom up to height y for an upright vessel.
export function volumeTable(type) {
  if (volumeTables.has(type)) return volumeTables.get(type)
  const def = EQUIPMENT[type]
  const H = innerHeight(def)
  const steps = 200
  const raw = [0]
  let total = 0
  for (let i = 1; i <= steps; i += 1) {
    const y = (i - 0.5) * H / steps
    total += areaAt(def, y) * H / steps
    raw.push(total)
  }
  // Scale so the full cavity holds exactly the nominal capacity (glassware is calibrated, not ideal shapes).
  const scale = def.capacityML / total
  const table = { H, steps, values: raw.map(v => v * scale) }
  volumeTables.set(type, table)
  return table
}

export function levelForVolume(type, mL) {
  const t = volumeTable(type)
  if (mL <= 0) return 0
  if (mL >= t.values[t.steps]) return t.H
  let i = 1
  while (t.values[i] < mL) i += 1
  const f = (mL - t.values[i - 1]) / (t.values[i] - t.values[i - 1])
  return (i - 1 + f) * t.H / t.steps
}

export function volumeBelow(type, y) {
  const t = volumeTable(type)
  const i = Math.max(0, Math.min(t.steps, y / t.H * t.steps))
  const lo = Math.floor(i)
  const hi = Math.min(t.steps, lo + 1)
  return t.values[lo] + (t.values[hi] - t.values[lo]) * (i - lo)
}

// When tilted by θ, liquid escapes once the volume exceeds what fits below the lower rim.
// Approximation for the cavity as a box of the rim half-width: retained = V(h_rim_eff),
// h_eff = H − w·tan θ (centre-line height of the lower lip). Educational approximation.
export function retainedVolumeAtTilt(type, angle) {
  const def = EQUIPMENT[type]
  const H = innerHeight(def)
  const a = Math.min(Math.abs(angle), Math.PI / 2 - 0.01)
  const rim = halfWidthAt(def, H)
  const effective = H - rim * Math.tan(a)
  if (effective <= 0) {
    // Past the point where the base is above the lip: keep only what the base corner traps.
    return Math.max(0, volumeBelow(type, H) * Math.max(0, 1 - a / (Math.PI / 2)) * 0.02)
  }
  return volumeBelow(type, effective)
}
