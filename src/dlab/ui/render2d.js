// Canvas 2D renderer. Read-only view of the simulation state: it never changes chemistry.
import { EQUIPMENT, halfWidthAt, innerHeight, levelForVolume } from '../data/equipment.js'
import { PRECIPITATES, REAGENT_BY_ID, GASES, LIQUIDS } from '../data/materials.js'
import { GW, GH, cellColor, fieldMean, volumeOf, surfaceY, solidRadiusMM, coatCoverage, isContainer, byId } from '../engine/processes.js'

export function createView() {
  return { x: 420, y: 90, zoom: 1, w: 800, h: 500, dpr: 1 }
}

export function toScreen(view, x, y) {
  const benchY = view.h * 0.8
  return [(x - view.x) * view.zoom + view.w / 2 + (view.ox || 0), benchY - (y - view.y + 90) * view.zoom]
}

// view.ox shifts the framing so objects sit in the part of the stage not covered by open drawers.
export function toWorld(view, sx, sy) {
  const benchY = view.h * 0.8
  return [(sx - view.w / 2 - (view.ox || 0)) / view.zoom + view.x, (benchY - sy) / view.zoom + view.y - 90]
}

const rgba = (c, a = c[3] ?? 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`

export function render(ctx, state, view, ui) {
  const { w, h } = view
  const dark = ui.theme === 'dark'
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)
  // Bench
  const [, benchSY] = toScreen(view, 0, 0)
  ctx.fillStyle = dark ? '#121a29' : '#eef3f9'
  ctx.fillRect(0, 0, w, benchSY)
  ctx.fillStyle = dark ? '#1d2738' : '#d9e1ec'
  ctx.fillRect(0, benchSY, w, h - benchSY)
  ctx.fillStyle = dark ? '#2b3850' : '#b9c6d8'
  ctx.fillRect(0, benchSY, w, 3)
  if (state.spill.mL > 0.05) {
    const r = Math.min(160, 12 + Math.sqrt(state.spill.mL) * 9) * view.zoom
    const [sx] = toScreen(view, ui.spillX ?? 140, 0)
    ctx.fillStyle = dark ? 'rgba(120,170,230,0.25)' : 'rgba(90,140,210,0.22)'
    ctx.beginPath()
    ctx.ellipse(sx, benchSY + 4, r, 5 * view.zoom, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.save()
  ctx.translate(0, 0)
  // Wires behind objects
  for (const wire of state.wires) {
    const a = byId(state, wire.from)
    const b = byId(state, wire.to)
    if (!a || !b) continue
    const pa = anchor(state, a)
    const pb = anchor(state, b, true)
    const [ax, ay] = toScreen(view, pa.x, pa.y)
    const [bx, by] = toScreen(view, pb.x, pb.y)
    ctx.strokeStyle = a.type === 'voltmeter' ? '#e0a030' : '#d04848'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(ax, ay)
    ctx.bezierCurveTo(ax, ay - 60, bx, by - 80, bx, by)
    ctx.stroke()
  }
  // Contact shadows: a lifted (held) object casts a fainter, wider shadow, so it reads as "in the hand".
  for (const o of state.objects) {
    if (o.in || o.inside) continue
    const b = bounds(o, state)
    const lift = Math.max(0, b.y0)
    const a = (dark ? 0.35 : 0.16) * Math.max(0.25, 1 - lift / 160)
    const [sx] = toScreen(view, (b.x0 + b.x1) / 2, 0)
    ctx.fillStyle = `rgba(15,25,45,${a})`
    ctx.beginPath()
    ctx.ellipse(sx, benchSY + 2, ((b.x1 - b.x0) / 2 + 4 + lift * 0.08) * view.zoom, (2.5 + lift * 0.02) * view.zoom, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  for (const o of state.objects) {
    if (o.type === 'solid' && o.in) continue
    drawObject(ctx, state, view, o, ui)
  }
  for (const s of state.streams) drawStream(ctx, view, s)
  for (const d of state.drops) {
    const [x, y] = toScreen(view, d.x, d.y)
    ctx.fillStyle = 'rgba(150,190,240,0.9)'
    ctx.beginPath()
    ctx.ellipse(x, y, 2.4 * view.zoom, 3.2 * view.zoom, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  // Selection, hover and guided highlights on top: soft rounded halo, not a debug box.
  for (const o of state.objects) {
    const sel = ui.selected === o.id
    const held = ui.held === o.id
    const hover = ui.hover === o.id && !sel
    const hl = ui.highlight?.includes(o.id)
    const grab = ui.grabbable?.includes(o.id) && !sel
    const drop = ui.drop?.id === o.id ? ui.drop : null
    if (drop) {
      // Drop target while carrying: green = will receive it, red = the safety rules refuse it.
      const b = bounds(o, state)
      const [x0, y0] = toScreen(view, b.x0, b.y1)
      const [x1, y1] = toScreen(view, b.x1, b.y0)
      ctx.save()
      roundRect(ctx, x0 - 8, y0 - 8, x1 - x0 + 16, y1 - y0 + 16, 10)
      ctx.fillStyle = drop.ok ? 'rgba(22,163,74,0.10)' : 'rgba(220,38,38,0.10)'
      ctx.fill()
      ctx.strokeStyle = drop.ok ? '#16a34a' : '#dc2626'
      ctx.lineWidth = 3
      if (!drop.ok) ctx.setLineDash([7, 5])
      ctx.stroke()
      ctx.restore()
      continue
    }
    if (!sel && !hl && !hover && !grab) continue
    const b = bounds(o, state)
    const [x0, y0] = toScreen(view, b.x0, b.y1)
    const [x1, y1] = toScreen(view, b.x1, b.y0)
    const accent = dark ? [124, 196, 255] : [29, 111, 216]
    ctx.save()
    roundRect(ctx, x0 - 7, y0 - 7, x1 - x0 + 14, y1 - y0 + 14, 10)
    if (grab && !hover) {
      // Pieces the selected tongs can pick up: dashed, so they read as "available", not "selected".
      ctx.setLineDash([4, 4])
      ctx.strokeStyle = rgba(accent, 0.85)
      ctx.lineWidth = 2
      ctx.stroke()
    }
    else if (hl && !sel) {
      ctx.setLineDash([6, 5])
      ctx.strokeStyle = '#e09a00'
      ctx.lineWidth = 2.5
      ctx.stroke()
    }
    else {
      ctx.fillStyle = rgba(accent, hover ? 0.05 : held ? 0.12 : 0.08)
      ctx.fill()
      ctx.strokeStyle = rgba(accent, hover ? 0.45 : 0.9)
      ctx.lineWidth = held ? 2.5 : 1.5
      ctx.stroke()
    }
    if (held) {
      const text = 'Đang cầm'
      ctx.font = '600 12px system-ui, sans-serif'
      const tw = ctx.measureText(text).width + 14
      const cx = (x0 + x1) / 2
      ctx.setLineDash([])
      ctx.fillStyle = rgba(accent, 0.95)
      roundRect(ctx, cx - tw / 2, y0 - 32, tw, 20, 10)
      ctx.fill()
      ctx.fillStyle = dark ? '#0b1220' : '#fff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, cx, y0 - 22)
    }
    ctx.restore()
  }
  ctx.restore()
}

function drawStream(ctx, view, s) {
  const [x, y0] = toScreen(view, s.x, s.y0)
  const [, y1] = toScreen(view, s.x, s.y1)
  const width = Math.max(1.5, Math.min(7, Math.sqrt(s.rate) * 1.2)) * view.zoom
  ctx.strokeStyle = rgba(s.color, Math.max(0.45, s.color[3] ?? 0.5))
  ctx.lineWidth = width
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x, y0)
  ctx.quadraticCurveTo(x + 4 * view.zoom, (y0 + y1) / 2, x + 2 * view.zoom, y1)
  ctx.stroke()
}

export function anchor(state, o, target = false) {
  const def = EQUIPMENT[o.type]
  if (o.type === 'solid') {
    const c = o.in && byId(state, o.in)
    return c ? { x: c.x + o.lx, y: c.y + EQUIPMENT[c.type].h + 10 } : { x: o.x, y: o.y }
  }
  if (target && o.type === 'electrodes') return { x: o.x, y: o.y + def.h }
  return { x: o.x, y: o.y + (def?.h || 20) * (target ? 1 : 0.7) }
}

// World box of a solid piece exactly as drawn (inside a vessel a nail is a long thin bar, not a dot),
// so hit tests and halos match what the student sees. o.x / o.y are kept in sync by the engine (carry).
export function solidBox(state, s) {
  const r = REAGENT_BY_ID[s.reagent]
  const c = s.in && state && byId(state, s.in)
  if (!c) {
    // Out of a vessel: a nail or ribbon lies flat on the bench, or hangs from the tongs that hold it.
    const len = r.shape === 'cylinder' ? 10 + s.massG * 12 : r.shape === 'ribbon' ? 12 + Math.sqrt(s.massG / (s.mass0 || s.massG)) * 30 : 0
    if (len && s.holder) return { x0: s.x - 2.5, x1: s.x + 2.5, y0: s.y - len * 0.8, y1: s.y + len * 0.2 }
    if (len) return { x0: s.x - len / 2, x1: s.x + len / 2, y0: s.y, y1: s.y + 4 }
    const rad = Math.max(2.5, solidRadiusMM(s))
    return { x0: s.x - rad, x1: s.x + rad, y0: s.y, y1: s.y + 2 * rad }
  }
  const def = EQUIPMENT[c.type]
  const H = innerHeight(def)
  if (r.shape === 'cylinder') { const len = Math.min(H * 0.8, 10 + s.massG * 12); return { x0: s.x - 2, x1: s.x + 2, y0: c.y + 2, y1: c.y + 2 + len } }
  if (r.shape === 'ribbon') { const len = Math.min(H * 0.7, 12 + Math.sqrt(s.massG / (s.mass0 || s.massG)) * 30); return { x0: s.x - 1, x1: s.x + 1, y0: s.y + 2, y1: s.y + 2 + len } }
  if (r.shape === 'powder') { const hw = Math.min(halfWidthAt(def, 0) - 2, 4 + Math.sqrt(s.massG) * 6); return { x0: s.x - hw, x1: s.x + hw, y0: c.y + 2, y1: c.y + 2 + Math.max(1, Math.sqrt(s.massG) * 2.2) } }
  const rad = Math.max(1.6, solidRadiusMM(s))
  return { x0: s.x - rad, x1: s.x + rad, y0: s.y + 2, y1: s.y + 2 + 2 * rad }
}

export function bounds(o, state) {
  const def = EQUIPMENT[o.type]
  if (o.type === 'solid') {
    const b = solidBox(state, o)
    return { x0: b.x0 - 2, x1: b.x1 + 2, y0: b.y0, y1: b.y1 + 2 }
  }
  const w = def.w
  const hgt = def.h
  if (!o.angle) return { x0: o.x - w / 2, x1: o.x + w / 2, y0: o.y, y1: o.y + hgt }
  const cx = o.x
  const cy = o.y + hgt / 2
  const corners = [[-w / 2, -hgt / 2], [w / 2, -hgt / 2], [w / 2, hgt / 2], [-w / 2, hgt / 2]].map(([px, py]) => {
    const a = -o.angle
    return [cx + px * Math.cos(a) - py * Math.sin(a), cy + px * Math.sin(a) + py * Math.cos(a)]
  })
  return { x0: Math.min(...corners.map(c => c[0])), x1: Math.max(...corners.map(c => c[0])), y0: Math.min(...corners.map(c => c[1])), y1: Math.max(...corners.map(c => c[1])) }
}

// Hit test in object-local coordinates (handles tilt). pad: extra margin (world mm) for small pieces,
// set by the caller from the zoom so a 3 mm sodium piece is still a finger-sized target on screen.
export function hit(o, x, y, state = null, pad = 4) {
  const def = EQUIPMENT[o.type]
  if (o.type === 'solid') {
    const b = solidBox(state, o)
    return x >= b.x0 - pad && x <= b.x1 + pad && y >= b.y0 - pad && y <= b.y1 + pad
  }
  const cx = o.x
  const cy = o.y + def.h / 2
  const a = o.angle
  const lx = (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a)
  const ly = (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)
  const side = def.w < 20 ? 8 : 2
  return Math.abs(lx) <= def.w / 2 + side && Math.abs(ly) <= def.h / 2 + 2
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// Draw an object in its own frame: origin at bottom-centre, y up (screen y flipped), rotated by its tilt.
function withFrame(ctx, view, o, fn) {
  const def = EQUIPMENT[o.type]
  const [sx, sy] = toScreen(view, o.x, o.y + (def?.h || 0) / 2)
  ctx.save()
  ctx.translate(sx, sy)
  ctx.rotate(o.angle || 0)
  ctx.scale(view.zoom, view.zoom)
  ctx.translate(0, (def?.h || 0) / 2)
  fn()
  ctx.restore()
}

function cavityPath(ctx, def) {
  const H = innerHeight(def)
  const steps = 24
  ctx.beginPath()
  for (let i = 0; i <= steps; i += 1) {
    const y = H * i / steps
    const x = halfWidthAt(def, y)
    if (i === 0) ctx.moveTo(-x, -2)
    ctx.lineTo(-x, -y - 2)
  }
  for (let i = steps; i >= 0; i -= 1) {
    const y = H * i / steps
    ctx.lineTo(halfWidthAt(def, y), -y - 2)
  }
  ctx.closePath()
}

function drawObject(ctx, state, view, o, ui) {
  const def = EQUIPMENT[o.type]
  const dark = ui.theme === 'dark'
  const ink = dark ? 'rgba(220,235,255,0.85)' : 'rgba(40,60,90,0.85)'
  if (o.type === 'solid') return drawLooseSolid(ctx, view, o)
  if (isContainer(o)) return drawContainer(ctx, state, view, o, ui, ink, dark)
  withFrame(ctx, view, o, () => {
    ctx.lineWidth = 1.4
    ctx.strokeStyle = ink
    switch (o.type) {
      case 'rack': {
        ctx.fillStyle = dark ? '#5a4632' : '#c79a64'
        ctx.fillRect(-def.w / 2, -8, def.w, 8)
        ctx.fillRect(-def.w / 2, -def.h * 0.6, def.w, 6)
        ctx.fillRect(-def.w / 2, -def.h * 0.6, 5, def.h * 0.6)
        ctx.fillRect(def.w / 2 - 5, -def.h * 0.6, 5, def.h * 0.6)
        break
      }
      case 'dropper':
      case 'pipette': {
        const len = def.h
        const fill = volumeTotal(o) / def.capacityML
        ctx.fillStyle = 'rgba(200,225,250,0.25)'
        ctx.fillRect(-2.5, -len * 0.8, 5, len * 0.8)
        if (fill > 0) {
          ctx.fillStyle = rgba(toolColor(o), 0.85)
          ctx.fillRect(-2, -len * 0.8 * fill, 4, len * 0.8 * fill)
        }
        ctx.strokeRect(-2.5, -len * 0.8, 5, len * 0.8)
        if (o.type === 'dropper') {
          ctx.fillStyle = '#c0392b'
          roundRect(ctx, -5, -len, 10, len * 0.22, 4)
          ctx.fill()
        }
        else {
          ctx.beginPath()
          ctx.arc(0, -len * 0.5, 6, 0, Math.PI * 2)
          ctx.stroke()
        }
        break
      }
      case 'rod':
        ctx.strokeStyle = dark ? 'rgba(220,240,255,0.9)' : 'rgba(80,120,170,0.9)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(0, -def.h)
        ctx.stroke()
        break
      case 'spatula':
      case 'tongs': {
        ctx.strokeStyle = dark ? '#c9d3e0' : '#6b7a90'
        ctx.lineWidth = 2.5
        ctx.beginPath()
        if (o.type === 'tongs') {
          ctx.moveTo(-5, -def.h); ctx.lineTo(-1.5, 0); ctx.moveTo(5, -def.h); ctx.lineTo(1.5, 0)
        }
        else {
          ctx.moveTo(0, -def.h); ctx.lineTo(0, -6)
        }
        ctx.stroke()
        if (o.type === 'spatula') {
          ctx.fillStyle = dark ? '#c9d3e0' : '#6b7a90'
          ctx.beginPath(); ctx.ellipse(0, -4, 5, 3, 0, 0, Math.PI * 2); ctx.fill()
        }
        if (o.load && !o.load.id) { // older saves: the piece is not an object of its own
          const r = REAGENT_BY_ID[o.load.reagent]
          ctx.fillStyle = rgba(r.color || [240, 240, 240])
          ctx.beginPath(); ctx.arc(0, -3, Math.max(2.5, Math.cbrt(o.load.massG / r.density) * 6), 0, Math.PI * 2); ctx.fill()
          ctx.stroke()
        }
        break
      }
      case 'litmusPaper': {
        const N = def.segments
        const segH = def.h / N
        for (let i = 0; i < N; i += 1) {
          const seg = o.seg?.[i]
          const c = seg ? seg.rgb : [130, 70, 160]
          ctx.fillStyle = rgba(c, seg && seg.wet > 0.3 ? 1 : 0.9)
          ctx.fillRect(-def.w / 2, -(i + 1) * segH, def.w, segH + 0.5)
        }
        ctx.strokeStyle = dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.35)'
        ctx.strokeRect(-def.w / 2, -def.h, def.w, def.h)
        break
      }
      case 'thermometer':
      case 'phMeter': {
        ctx.fillStyle = 'rgba(220,235,250,0.4)'
        ctx.fillRect(-3, -def.h, 6, def.h)
        ctx.strokeRect(-3, -def.h, 6, def.h)
        if (o.type === 'thermometer') {
          const f = Math.max(0, Math.min(1, ((o.reading ?? 25) + 10) / 120))
          ctx.fillStyle = '#d33'
          ctx.beginPath(); ctx.arc(0, -3, 4, 0, Math.PI * 2); ctx.fill()
          ctx.fillRect(-1.2, -def.h * 0.92 * f, 2.4, def.h * 0.92 * f)
          label(ctx, `${(o.reading ?? 25).toFixed(1)} °C`, 8, -def.h, dark)
        }
        else {
          ctx.fillStyle = dark ? '#26354d' : '#334'
          roundRect(ctx, -14, -def.h - 26, 28, 26, 4); ctx.fill()
          ctx.fillStyle = '#7ef0b0'
          ctx.font = 'bold 10px ui-monospace, monospace'
          ctx.textAlign = 'center'
          ctx.fillText(o.reading == null ? '--.-' : o.reading.toFixed(2), 0, -def.h - 9)
        }
        break
      }
      case 'burner': {
        ctx.fillStyle = dark ? '#3b4252' : '#6b7280'
        roundRect(ctx, -def.w / 2, -def.h, def.w, def.h, 5); ctx.fill()
        ctx.fillStyle = o.on ? '#ff6a2a' : (dark ? '#4b5563' : '#9ca3af')
        ctx.fillRect(-def.w / 2 + 8, -def.h, def.w - 16, 4)
        if (o.on) {
          ctx.fillStyle = 'rgba(255,120,40,0.25)'
          ctx.fillRect(-def.w / 2 + 8, -def.h - 6, def.w - 16, 6)
        }
        ctx.fillStyle = o.on ? '#ff8f5a' : '#cbd5e1'
        ctx.beginPath(); ctx.arc(def.w / 2 - 12, -def.h / 2, 4, 0, Math.PI * 2); ctx.fill()
        break
      }
      case 'power':
      case 'voltmeter': {
        ctx.fillStyle = dark ? '#273248' : '#e5e9f0'
        roundRect(ctx, -def.w / 2, -def.h, def.w, def.h, 6); ctx.fill(); ctx.stroke()
        ctx.fillStyle = '#10261c'
        roundRect(ctx, -def.w / 2 + 8, -def.h + 8, def.w - 16, 20, 3); ctx.fill()
        ctx.fillStyle = '#7ef0b0'
        ctx.font = 'bold 11px ui-monospace, monospace'
        ctx.textAlign = 'center'
        const text = o.type === 'power' ? (o.on ? `${o.volts.toFixed(1)}V ${o.current?.toFixed(2) ?? '0.00'}A` : 'OFF') : (o.reading == null ? '-.--- V' : `${o.reading.toFixed(3)} V`)
        ctx.fillText(text, 0, -def.h + 22)
        break
      }
      case 'electrodes': {
        const deposit = Math.min(1, (o.cuDeposit || 0) / 3e-4)
        ctx.fillStyle = `rgb(${50 + 150 * deposit},${50 + 60 * deposit},${50 + 10 * deposit})`
        ctx.fillRect(-14, -def.h, 6, def.h)
        ctx.fillStyle = '#333'
        ctx.fillRect(8, -def.h, 6, def.h)
        ctx.fillStyle = dark ? '#cbd5e1' : '#475569'
        ctx.fillRect(-20, -def.h - 6, 40, 6)
        ctx.font = '10px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('−', -11, -def.h - 9)
        ctx.fillText('+', 11, -def.h - 9)
        break
      }
      case 'bridge': {
        ctx.strokeStyle = dark ? 'rgba(220,235,255,0.7)' : 'rgba(60,80,110,0.7)'
        ctx.lineWidth = 8
        ctx.beginPath()
        ctx.moveTo(-def.w / 2, 0); ctx.lineTo(-def.w / 2, -def.h); ctx.lineTo(def.w / 2, -def.h); ctx.lineTo(def.w / 2, 0)
        ctx.stroke()
        ctx.strokeStyle = 'rgba(250,250,250,0.6)'
        ctx.lineWidth = 4
        ctx.stroke()
        break
      }
      case 'gasTank': {
        ctx.fillStyle = dark ? '#3a5a7a' : '#5b84b1'
        roundRect(ctx, -def.w / 2, -def.h, def.w, def.h, 8); ctx.fill()
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 11px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('CO₂', 0, -def.h / 2)
        break
      }
      default:
        ctx.strokeRect(-def.w / 2, -def.h, def.w, def.h)
    }
  })
  if (o.type === 'gasTank' && o.target) {
    const c = byId(state, o.target)
    if (c) {
      const [ax, ay] = toScreen(view, o.x, o.y + def.h)
      const [bx, by] = toScreen(view, c.x + 4, c.y + 6)
      const [tx, ty] = toScreen(view, c.x + 4, c.y + EQUIPMENT[c.type].h + 20)
      ctx.strokeStyle = 'rgba(120,140,170,0.9)'
      ctx.lineWidth = 3
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo(ax, ty - 40, tx, ty); ctx.lineTo(bx, by); ctx.stroke()
    }
  }
  if (o.type === 'bridge' && o.links?.length === 2) {
    const [a, b] = o.links.map(id => byId(state, id)).filter(Boolean)
    if (a && b) {
      const ya = Math.min(surfaceY(a), a.y + EQUIPMENT[a.type].h) - 6
      const yb = Math.min(surfaceY(b), b.y + EQUIPMENT[b.type].h) - 6
      const top = Math.max(a.y + EQUIPMENT[a.type].h, b.y + EQUIPMENT[b.type].h) + 18
      const pts = [[a.x + 6, ya], [a.x + 6, top], [b.x - 6, top], [b.x - 6, yb]].map(([x, y]) => toScreen(view, x, y))
      ctx.strokeStyle = 'rgba(230,236,245,0.85)'
      ctx.lineWidth = 7 * view.zoom
      ctx.beginPath()
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
      ctx.stroke()
    }
  }
}

function volumeTotal(o) {
  return Object.values(o.contents?.liquids || {}).reduce((s, v) => s + v, 0)
}

function toolColor(o) {
  const ind = Object.keys(o.contents?.indicators || {})[0]
  if (ind === 'phenolphthalein') return [240, 240, 250, 0.4]
  if (ind) return [200, 120, 80, 0.8]
  if ((o.contents?.ions?.['Cu2+'] || 0) > 0) return [80, 150, 230, 0.8]
  return [170, 205, 240, 0.7]
}

function label(ctx, text, x, y, dark) {
  ctx.font = '600 10px "Be Vietnam Pro", sans-serif'
  ctx.textAlign = 'left'
  ctx.fillStyle = dark ? '#e6eefb' : '#1f2a3d'
  ctx.fillText(text, x, y)
}

// The same colour as inside a vessel, so a copper-coated nail taken out still looks coated.
function solidFill(s, r) {
  const k = coatCoverage(s)
  const base = r.color || [240, 240, 240]
  const coatColor = s.coat?.Ag ? [200, 200, 205] : [190, 90, 50]
  return rgba(base.map((v, i) => v + (coatColor[i] - v) * k))
}
function drawLooseSolid(ctx, view, s) {
  if (s.massG <= 0) return
  const r = REAGENT_BY_ID[s.reagent]
  ctx.save()
  ctx.fillStyle = solidFill(s, r)
  ctx.strokeStyle = 'rgba(0,0,0,0.45)'
  ctx.lineWidth = 1
  if (r.shape === 'cylinder' || r.shape === 'ribbon') {
    // A nail: shaft with a flat head and a pointed tip; a ribbon: a thin strip. Drawn from the same box as hit tests.
    const b = solidBox(null, s)
    const [x0, y0] = toScreen(view, b.x0, b.y1)
    const [x1, y1] = toScreen(view, b.x1, b.y0)
    const vertical = (y1 - y0) > (x1 - x0)
    if (r.shape === 'ribbon') { ctx.fillRect(x0, y0, x1 - x0, y1 - y0); ctx.strokeRect(x0, y0, x1 - x0, y1 - y0) }
    else if (vertical) {
      const w = x1 - x0, cx = (x0 + x1) / 2, tip = Math.min(w * 1.6, (y1 - y0) * 0.2)
      ctx.beginPath(); ctx.moveTo(cx - w * 0.3, y0); ctx.lineTo(cx + w * 0.3, y0); ctx.lineTo(cx + w * 0.3, y1 - tip); ctx.lineTo(cx, y1); ctx.lineTo(cx - w * 0.3, y1 - tip); ctx.closePath(); ctx.fill(); ctx.stroke()
      ctx.fillRect(x0, y0 - 1, w, Math.max(2, w * 0.35)); ctx.strokeRect(x0, y0 - 1, w, Math.max(2, w * 0.35))
    }
    else {
      const h = y1 - y0, cy = (y0 + y1) / 2, tip = Math.min(h * 1.6, (x1 - x0) * 0.2)
      ctx.beginPath(); ctx.moveTo(x0 + h * 0.35, cy - h * 0.3); ctx.lineTo(x1 - tip, cy - h * 0.3); ctx.lineTo(x1, cy); ctx.lineTo(x1 - tip, cy + h * 0.3); ctx.lineTo(x0 + h * 0.35, cy + h * 0.3); ctx.closePath(); ctx.fill(); ctx.stroke()
      ctx.fillRect(x0, y0, Math.max(2, h * 0.35), h); ctx.strokeRect(x0, y0, Math.max(2, h * 0.35), h)
    }
  }
  else {
    const rad = Math.max(2.5, solidRadiusMM(s))
    const [x, y] = toScreen(view, s.x, s.y + rad)
    ctx.beginPath()
    ctx.arc(x, y, rad * view.zoom, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }
  ctx.restore()
}

let field = null
function fieldImage() {
  if (!field) {
    const canvas = document.createElement('canvas')
    canvas.width = GW
    canvas.height = GH
    const ctx = canvas.getContext('2d')
    field = { canvas, ctx, data: ctx.createImageData(GW, GH) }
  }
  return field
}

function drawContainer(ctx, state, view, c, ui, ink, dark) {
  const def = EQUIPMENT[c.type]
  const H = innerHeight(def)
  const vol = volumeOf(c)
  const level = levelForVolume(c.type, Math.min(vol, def.capacityML))
  withFrame(ctx, view, c, () => {
    // Liquid (upright: per-cell tracer colours; tilted: horizontal surface found by area bisection)
    if (vol > 0.01) {
      ctx.save()
      cavityPath(ctx, def)
      ctx.clip()
      const oil = c.contents.liquids.oil || 0
      const aq = vol - oil
      const aqLevel = levelForVolume(c.type, aq)
      if (Math.abs(c.angle) < 0.02 && ui.quality === 'low') {
        // Reduced graphics: one fill at the mean colour and fewer particles; chemistry is unchanged.
        const hw = halfWidthAt(def, 0) + 4
        const col = c.vis.displayed || c.vis.target || [220, 235, 250, 0.2]
        ctx.fillStyle = rgba(col, Math.min(0.92, col[3] + 0.05))
        ctx.fillRect(-hw, -2 - aqLevel, 2 * hw, aqLevel)
        if (oil > 0.01) { ctx.fillStyle = 'rgba(240,200,60,0.75)'; ctx.fillRect(-hw, -2 - level, 2 * hw, level - aqLevel) }
        const parts = c.vis.parts
        for (let k = 0; k < parts.length; k += Math.ceil(parts.length / 40) || 1) {
          const p = parts[k]
          ctx.fillStyle = rgba(PRECIPITATES[p.key].color, 0.95)
          ctx.fillRect(p.u * (halfWidthAt(def, p.v * aqLevel) - 2) - 1.5, -2 - p.v * aqLevel - 1.5, 3, 3)
        }
      }
      else if (Math.abs(c.angle) < 0.02) {
        // Tracer grid → a GW×GH image scaled with smoothing: one draw call per vessel instead of
        // GW·GH rects, and the colour front reads as a gradient rather than blocks.
        const hw = halfWidthAt(def, 0) + 4
        const mean = fieldMean(c)
        const img = fieldImage()
        for (let j = 0; j < GH; j += 1) {
          for (let i = 0; i < GW; i += 1) {
            const col = cellColor(c, j * GW + i, mean) || [220, 235, 250, 0.2]
            const k = ((GH - 1 - j) * GW + i) * 4
            img.data.data[k] = col[0]; img.data.data[k + 1] = col[1]; img.data.data[k + 2] = col[2]
            img.data.data[k + 3] = Math.round(255 * Math.min(0.92, col[3] + 0.05))
          }
        }
        img.ctx.putImageData(img.data, 0, 0)
        ctx.imageSmoothingEnabled = true
        ctx.drawImage(img.canvas, -hw, -2 - aqLevel, 2 * hw, Math.max(0.5, aqLevel))
        if (oil > 0.01) {
          ctx.fillStyle = 'rgba(240,200,60,0.75)'
          ctx.fillRect(-hw, -2 - level, 2 * hw, level - aqLevel)
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.55)'
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(-hw, -2 - level); ctx.lineTo(hw, -2 - level); ctx.stroke()
        // Precipitate particles and settled layer
        for (const p of c.vis.parts) {
          const ppt = PRECIPITATES[p.key]
          ctx.fillStyle = rgba(ppt.color, 0.95)
          const px = p.u * (halfWidthAt(def, p.v * aqLevel) - 2)
          ctx.fillRect(px - p.s, -2 - p.v * aqLevel - p.s, p.s * 2, p.s * 2)
        }
        const settled = c.vis.parts.filter(p => p.settled)
        if (settled.length > 4) {
          const ppt = PRECIPITATES[settled[0].key]
          ctx.fillStyle = rgba(ppt.color, 0.9)
          const layer = Math.min(H * 0.2, 1 + settled.length * 0.05)
          ctx.fillRect(-hw, -2 - layer, 2 * hw, layer)
        }
        for (const b of c.vis.bubbles) {
          const gas = GASES[b.gas]
          const by = -2 - b.v * level
          ctx.strokeStyle = gas?.visible ? rgba(gas.color, 0.9) : 'rgba(255,255,255,0.85)'
          ctx.lineWidth = 0.8
          ctx.beginPath(); ctx.arc(b.u * (halfWidthAt(def, b.v * level) - 2), by, b.r, 0, Math.PI * 2); ctx.stroke()
        }
      }
      else {
        // Tilted: liquid fills the cavity below a world-horizontal line.
        const frac = Math.min(1, vol / def.capacityML)
        const s = tiltedSurface(def, c.angle, frac)
        ctx.rotate(-c.angle)
        ctx.fillStyle = rgba(c.vis.target || [200, 220, 240, 0.3], Math.min(0.9, (c.vis.target?.[3] ?? 0.3) + 0.1))
        ctx.fillRect(-def.h * 2, s, def.h * 4, def.h * 3)
      }
      ctx.restore()
    }
    // Solids inside
    for (const s of state.objects) {
      if (s.type !== 'solid' || s.in !== c.id || s.massG <= 0) continue
      const r = REAGENT_BY_ID[s.reagent]
      const rad = Math.max(1.6, solidRadiusMM(s))
      ctx.fillStyle = solidFill(s, r)
      ctx.strokeStyle = 'rgba(0,0,0,0.25)'
      ctx.lineWidth = 0.6
      if (r.shape === 'cylinder') {
        const len = Math.min(H * 0.8, 10 + s.massG * 12)
        ctx.fillRect(s.lx - 2, -2 - len, 4, len)
      }
      else if (r.shape === 'ribbon') {
        const len = Math.min(H * 0.7, 12 + Math.sqrt(s.massG / (s.mass0 || s.massG)) * 30)
        ctx.fillRect(s.lx - 1, -2 - s.ly - len, 2, len)
      }
      else if (r.shape === 'powder') {
        const hw = Math.min(halfWidthAt(def, 0) - 2, 4 + Math.sqrt(s.massG) * 6)
        ctx.beginPath(); ctx.ellipse(s.lx, -2, hw, Math.max(1, Math.sqrt(s.massG) * 2.2), 0, Math.PI, 0); ctx.fill()
      }
      else {
        ctx.beginPath(); ctx.arc(s.lx, -2 - s.ly - rad, rad, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      }
    }
    // Glass
    ctx.lineWidth = 1.6
    ctx.strokeStyle = c.condition === 'UNUSABLE' ? 'rgba(200,80,80,0.5)' : ink
    if (c.condition === 'UNUSABLE') ctx.setLineDash([6, 5])
    glassOutline(ctx, def)
    ctx.setLineDash([])
    ctx.fillStyle = dark ? 'rgba(180,210,255,0.06)' : 'rgba(180,210,255,0.12)'
    cavityPath(ctx, def)
    ctx.fill()
    // Graduations every 10 mL (1 mL for the cylinder at 5 mL steps)
    const step = def.graduations ? 5 : (def.capacityML <= 20 ? 5 : def.capacityML <= 100 ? 10 : 50)
    ctx.strokeStyle = dark ? 'rgba(220,235,255,0.45)' : 'rgba(40,60,90,0.45)'
    ctx.fillStyle = ctx.strokeStyle
    ctx.font = '6px sans-serif'
    ctx.textAlign = 'left'
    ctx.lineWidth = 0.6
    if (c.type !== 'bottle' && c.type !== 'dish') {
      for (let mL = step; mL < def.capacityML; mL += step) {
        const y = levelForVolume(c.type, mL)
        const x = halfWidthAt(def, y)
        ctx.beginPath(); ctx.moveTo(-x, -2 - y); ctx.lineTo(-x + 5, -2 - y); ctx.stroke()
        if ((mL / step) % 2 === 0 || def.capacityML <= 20) ctx.fillText(String(mL), -x + 6, -y)
      }
    }
    // Glass sheen: a soft vertical highlight on the left wall.
    const hwMid = halfWidthAt(def, H * 0.5)
    const sheen = ctx.createLinearGradient(-hwMid, 0, -hwMid + Math.min(10, hwMid * 0.5), 0)
    sheen.addColorStop(0, dark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.75)')
    sheen.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = sheen
    ctx.fillRect(-hwMid, -H * 0.92, Math.min(10, hwMid * 0.5), H * 0.82)
    // Damage is shown by colour, shape and a text badge (not colour alone).
    if (c.condition !== 'NORMAL' && c.condition) {
      const hw = halfWidthAt(def, H * 0.4)
      if (c.condition === 'WARNING') {
        ctx.strokeStyle = 'rgba(230,140,20,0.95)'
        ctx.lineWidth = 2.2
        glassOutline(ctx, def)
      }
      if (c.condition === 'CRACKED' || c.condition === 'UNUSABLE') {
        ctx.strokeStyle = dark ? 'rgba(255,255,255,0.95)' : 'rgba(30,40,60,0.9)'
        ctx.lineWidth = 1.1
        ctx.beginPath()
        ctx.moveTo(-hw - 1, -H * 0.28); ctx.lineTo(-hw + 8, -H * 0.4); ctx.lineTo(-hw + 4, -H * 0.5); ctx.lineTo(-hw + 13, -H * 0.64); ctx.lineTo(-hw + 9, -H * 0.74)
        ctx.moveTo(-hw + 8, -H * 0.4); ctx.lineTo(-hw + 17, -H * 0.44); ctx.lineTo(-hw + 22, -H * 0.38)
        ctx.moveTo(-hw + 4, -H * 0.5); ctx.lineTo(-hw + 1, -H * 0.58)
        ctx.stroke()
      }
      if (c.condition === 'UNUSABLE') {
        ctx.fillStyle = 'rgba(200,60,60,0.22)'
        cavityPath(ctx, def)
        ctx.fill()
      }
      const text = { WARNING: '! Cảnh báo', CRACKED: 'Nứt', UNUSABLE: 'Vỡ — không dùng được' }[c.condition]
      ctx.font = '600 7px "Be Vietnam Pro", sans-serif'
      ctx.textAlign = 'center'
      const tw = ctx.measureText(text).width + 8
      ctx.fillStyle = { WARNING: '#b45309', CRACKED: '#475569', UNUSABLE: '#b91c1c' }[c.condition]
      roundRect(ctx, -tw / 2, -def.h - 14, tw, 11, 3); ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.fillText(text, 0, -def.h - 6)
    }
    if (c.type === 'bottle' && c.label) {
      ctx.fillStyle = dark ? '#f6f8fb' : '#ffffff'
      roundRect(ctx, -def.w / 2 + 4, -def.h * 0.55, def.w - 8, 22, 3); ctx.fill()
      ctx.fillStyle = '#1f2a3d'
      ctx.font = '600 7px "Be Vietnam Pro", sans-serif'
      ctx.textAlign = 'center'
      const r = REAGENT_BY_ID[c.reagent]
      ctx.fillText(formulaText(r.formula) || r.name.slice(0, 10), 0, -def.h * 0.55 + 10)
      ctx.font = '6px sans-serif'
      ctx.fillText(r.M ? `${String(r.M).replace('.', ',')} M` : r.kind === 'indicator' ? 'chỉ thị' : '', 0, -def.h * 0.55 + 18)
    }
  })
  // Gas/steam above an active vessel
  const [tx, ty] = toScreen(view, c.x, c.y + def.h)
  if (c.boiling && state.t - c.boiling < 0.5) wisps(ctx, tx, ty, view.zoom, [240, 245, 250])
  if (c.activeReactions?.electrolysis && state.t - c.activeReactions.electrolysis < 0.5) wisps(ctx, tx + 8 * view.zoom, ty, view.zoom, GASES.Cl2.color)
  if (c.T > 32) {
    ctx.fillStyle = c.T > 60 ? '#e2553b' : '#e08a3b'
    ctx.font = `600 ${Math.max(9, 10 * view.zoom)}px "Be Vietnam Pro", sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(`${c.T.toFixed(0)} °C`, tx, ty - 6)
  }
  if (c.label && c.type !== 'bottle') {
    const [lx, ly] = toScreen(view, c.x, c.y)
    ctx.fillStyle = dark ? '#c9d6ea' : '#334155'
    ctx.font = `600 ${Math.max(9, 10 * view.zoom)}px "Be Vietnam Pro", sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(c.label, lx, ly + 14)
  }
}

function wisps(ctx, x, y, z, color) {
  ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},0.55)`
  ctx.lineWidth = 2 * z
  for (let i = -1; i <= 1; i += 1) {
    ctx.beginPath()
    ctx.moveTo(x + i * 8 * z, y)
    ctx.bezierCurveTo(x + i * 8 * z - 6 * z, y - 12 * z, x + i * 8 * z + 6 * z, y - 22 * z, x + i * 8 * z, y - 32 * z)
    ctx.stroke()
  }
}

function formulaText(f) {
  if (!f) return ''
  return f.replace(/(\d+)/g, d => [...d].map(ch => '₀₁₂₃₄₅₆₇₈₉'[ch]).join(''))
}

function glassOutline(ctx, def) {
  const H = innerHeight(def)
  const steps = 24
  ctx.beginPath()
  for (let i = steps; i >= 0; i -= 1) {
    const y = H * i / steps
    const x = halfWidthAt(def, y) + 2
    if (i === steps) ctx.moveTo(-x - 2, -def.h)
    ctx.lineTo(-x, -y - 2)
  }
  ctx.lineTo(-halfWidthAt(def, 0) - 2, 0)
  ctx.lineTo(halfWidthAt(def, 0) + 2, 0)
  for (let i = 0; i <= steps; i += 1) {
    const y = H * i / steps
    ctx.lineTo(halfWidthAt(def, y) + 2, -y - 2)
  }
  ctx.lineTo(halfWidthAt(def, H) + 4, -def.h)
  ctx.stroke()
}

// Liquid surface (local y, screen-down negative) for a tilted vessel: bisection on the clipped cavity area.
const tiltCache = new Map()
function tiltedSurface(def, angle, frac) {
  const key = `${def.w}|${def.h}|${angle.toFixed(3)}|${frac.toFixed(3)}`
  if (tiltCache.has(key)) return tiltCache.get(key)
  const H = innerHeight(def)
  const pts = []
  for (let i = 0; i <= 16; i += 1) pts.push([-halfWidthAt(def, H * i / 16), -H * i / 16 - 2])
  for (let i = 16; i >= 0; i -= 1) pts.push([halfWidthAt(def, H * i / 16), -H * i / 16 - 2])
  const rot = pts.map(([x, y]) => [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)])
  const area = poly => { let a = 0; for (let i = 0; i < poly.length; i += 1) { const [x1, y1] = poly[i]; const [x2, y2] = poly[(i + 1) % poly.length]; a += x1 * y2 - x2 * y1 } return Math.abs(a) / 2 }
  const clipBelow = s => {
    const out = []
    for (let i = 0; i < rot.length; i += 1) {
      const a = rot[i]
      const b = rot[(i + 1) % rot.length]
      const ina = a[1] >= s
      const inb = b[1] >= s
      if (ina) out.push(a)
      if (ina !== inb) { const t = (s - a[1]) / (b[1] - a[1]); out.push([a[0] + (b[0] - a[0]) * t, s]) }
    }
    return out
  }
  const total = area(rot)
  let lo = Math.min(...rot.map(p => p[1]))
  let hi = Math.max(...rot.map(p => p[1]))
  for (let i = 0; i < 30; i += 1) {
    const mid = (lo + hi) / 2
    if (area(clipBelow(mid)) / total > frac) lo = mid
    else hi = mid
  }
  const s = (lo + hi) / 2
  if (tiltCache.size > 500) tiltCache.clear()
  tiltCache.set(key, s)
  return s
}

export { LIQUIDS }
