// Simulation core: the single source of truth. Renderers only read `state`.
import { EQUIPMENT, halfWidthAt, innerHeight } from '../data/equipment.js'
import { REAGENT_BY_ID } from '../data/materials.js'
import { emptyContents, reagentParcel, totalVolumeML, elementInventory } from './chemistry.js'
import { assess } from './safety.js'
import {
  byId, isContainer, newVisual, refreshDerived, stepContainer, stepElectro, stepTools, stepDrops,
  addParcel, transfer, takeFrom, containerAt, containerBelow, surfaceY, log, label, volumeOf, ROOM_T
} from './processes.js'

export const SCHEMA = 1
export const H = 1 / 60 // fixed simulation timestep (s)
export const SPEEDS = [0.25, 0.5, 1, 2, 4]
const HISTORY_LIMIT = 40
const MAX_STEPS_PER_FRAME = 240

export function createState(seed = 20261122) {
  return {
    schema: SCHEMA,
    t: 0,
    step: 0,
    rng: seed >>> 0,
    speed: 1,
    paused: false,
    nextId: 1,
    objects: [],
    wires: [],
    drops: [],
    streams: [],
    spill: { mL: 0, contents: emptyContents() },
    gas: { H2: 0, CO2: 0, Cl2: 0 },
    log: [],
    notes: {}
  }
}

function makeObject(state, type, props = {}) {
  const def = EQUIPMENT[type]
  if (!def && type !== 'solid') throw new Error(`Không có dụng cụ ${type}`)
  const o = { id: `o${state.nextId++}`, type, x: 200, y: 0, angle: 0, condition: 'NORMAL', ...props }
  if (def?.caps.includes('contain')) {
    o.contents = o.contents || emptyContents()
    o.T = ROOM_T
    o.vis = newVisual()
    o.activeReactions = {}
    refreshDerived(o)
  }
  if (def?.caps.includes('aspirate')) o.contents = emptyContents()
  if (type === 'burner') { o.on = false; o.power = def.powerW }
  if (type === 'power') { o.on = false; o.volts = 4 }
  if (type === 'tongs' || type === 'spatula') o.load = null
  state.objects.push(o)
  return o
}

// ── Commands ─────────────────────────────────────────────────────────────
// Every command is a plain object; apply() mutates state. dispatch() runs safety first and records undo.
const COMMANDS = {
  add(state, { equipmentType: type, x = 200, y = 0, reagent, label: name }) {
    const o = makeObject(state, type, { x, y, label: name })
    if (type === 'bottle' && reagent) {
      const r = REAGENT_BY_ID[reagent]
      o.reagent = reagent
      o.stock = true
      o.label = `${r.name}${r.M ? ` ${String(r.M).replace('.', ',')} M` : ''}`
      o.contents = reagentParcel(r, EQUIPMENT.bottle.capacityML * 0.8)
      refreshDerived(o)
    }
    log(state, `Lấy ${label(o)} ra bàn.`, 'action')
    return { id: o.id }
  },
  move(state, { id, x, y }) {
    const o = byId(state, id)
    o.x = x
    o.y = Math.max(0, y)
    settle(state, o)
  },
  tilt(state, { id, angle }) {
    const o = byId(state, id)
    o.angle = Math.max(-2.2, Math.min(2.2, angle))
  },
  pourExact(state, { from, to, mL }) {
    const a = byId(state, from)
    const b = to ? byId(state, to) : null
    const amount = Math.min(mL, volumeOf(a))
    const tdef = b && EQUIPMENT[b.type]
    transfer(state, a, b, amount, { u: 0, v: 1 })
    state.streams.push({ from: a.id, x: b ? b.x : a.x, y0: b ? b.y + tdef.h + 30 : a.y + 60, y1: b ? surfaceY(b) : 0, rate: amount, color: a.vis?.target || [200, 220, 240, 0.3], to: b?.id || null, exact: true })
    log(state, `Rót ${fmt(amount)} mL từ ${label(a)} sang ${b ? label(b) : 'bàn'}.`, 'action')
  },
  aspirate(state, { tool, from, mL }) {
    const t = byId(state, tool)
    const c = byId(state, from)
    const room = EQUIPMENT[t.type].capacityML - totalVolumeML(t.contents)
    const amount = Math.min(mL, room, volumeOf(c))
    const parcel = takeFrom(state, c, amount)
    for (const group of ['liquids', 'ions', 'indicators', 'precipitates']) {
      for (const [k, v] of Object.entries(parcel[group])) t.contents[group][k] = (t.contents[group][k] || 0) + v
    }
    t.source = c.label || label(c)
    log(state, `Hút ${fmt(amount)} mL từ ${label(c)} vào ${label(t)}.`, 'action')
  },
  dispense(state, { tool, drops = 1, mL }) {
    const t = byId(state, tool)
    const def = EQUIPMENT[t.type]
    const total = totalVolumeML(t.contents)
    const amount = Math.min(mL ?? drops * def.dropML, total)
    if (!(amount > 0)) return
    const n = mL ? 1 : drops
    for (let i = 0; i < n; i += 1) {
      const share = amount / n
      const parcel = splitParcel(t.contents, share / Math.max(1e-9, totalVolumeML(t.contents)))
      state.drops.push({ x: t.x, y: t.y - 2 - i * 6, vy: 0, parcel })
    }
    log(state, mL ? `Xả ${fmt(amount)} mL từ ${label(t)}.` : `Nhỏ ${drops} giọt từ ${label(t)}.`, 'action')
  },
  pick(state, { tool, reagent, massG }) {
    const t = byId(state, tool)
    t.load = { reagent, massG }
    log(state, `${label(t)} lấy ${fmt(massG)} g ${REAGENT_BY_ID[reagent].name}.`, 'action')
  },
  release(state, { tool }) {
    const t = byId(state, tool)
    if (!t.load) return
    const r = REAGENT_BY_ID[t.load.reagent]
    const c = containerBelow(state, t.x, t.y + 40)
    const s = makeObject(state, 'solid', { reagent: r.id, massG: t.load.massG, mass0: t.load.massG, x: t.x, y: Math.max(t.y, c ? c.y + EQUIPMENT[c.type].h + 4 : 0), in: null, lx: 0, ly: 0, vx: 0, vy: 0, coat: {} })
    t.load = null
    return { id: s.id }
  },
  stir(state, { id, amount = 1 }) {
    const c = byId(state, id)
    c.vis.stir = Math.min(1.5, c.vis.stir + amount)
    log(state, `Khuấy ${label(c)}.`, 'action')
  },
  burner(state, { id, on }) {
    byId(state, id).on = Boolean(on)
    log(state, on ? 'Bật bếp điện.' : 'Tắt bếp điện.', 'action')
  },
  power(state, { id, on, volts }) {
    const p = byId(state, id)
    if (on != null) p.on = Boolean(on)
    if (volts != null) p.volts = Math.max(0, Math.min(12, Number(volts)))
    log(state, `Nguồn điện ${p.on ? 'bật' : 'tắt'}, ${p.volts} V.`, 'action')
  },
  wire(state, { from, to }) {
    const src = byId(state, from)
    const max = src.type === 'voltmeter' ? 2 : 1
    const existing = state.wires.filter(w => w.from === from)
    if (existing.length >= max) state.wires.splice(state.wires.indexOf(existing[0]), 1)
    state.wires.push({ from, to })
    log(state, `Nối dây từ ${label(src)} tới ${label(byId(state, to)) || 'vật'}.`, 'action')
  },
  link(state, { id, a, b }) {
    byId(state, id).links = [a, b]
    log(state, `Đặt cầu muối nối ${label(byId(state, a))} và ${label(byId(state, b))}.`, 'action')
  },
  co2(state, { id, on }) {
    byId(state, id).co2Feed = Boolean(on)
    log(state, on ? `Sục khí CO₂ vào ${label(byId(state, id))}.` : 'Ngừng sục CO₂.', 'action')
  },
  remove(state, { id }) {
    const o = byId(state, id)
    if (!o) return
    state.objects = state.objects.filter(x => x.id !== id && !(x.type === 'solid' && x.in === id))
    state.wires = state.wires.filter(w => w.from !== id && w.to !== id)
    log(state, `Cất ${label(o)}.`, 'action')
  },
  cleanup(state) {
    const removed = state.objects.filter(o => o.condition === 'UNUSABLE' || (o.type === 'solid' && !o.in && o.massG <= 0))
    state.objects = state.objects.filter(o => !removed.includes(o))
    state.spill = { mL: 0, contents: emptyContents() }
    log(state, `Dọn bàn: lau chất đổ${removed.length ? `, bỏ ${removed.length} vật hỏng/hết` : ''}.`, 'action')
  },
  replace(state, { id }) {
    const o = byId(state, id)
    const fresh = makeObject(state, o.type, { x: o.x + 10, y: 0 })
    state.objects = state.objects.filter(x => x !== o)
    log(state, `Thay ${label(o)} hỏng bằng dụng cụ mới.`, 'action')
    return { id: fresh.id }
  },
  newLitmus(state, { x = 300 }) {
    const o = makeObject(state, 'litmusPaper', { x, y: 120 })
    log(state, 'Lấy một tờ giấy quỳ tím mới.', 'action')
    return { id: o.id }
  },
  addReagentTo(state, { id, reagent, mL }) {
    const c = byId(state, id)
    const def = EQUIPMENT[c.type]
    addParcel(state, c, reagentParcel(REAGENT_BY_ID[reagent], mL), { u: 0, v: 1 })
    state.streams.push({ from: null, x: c.x, y0: c.y + def.h + 30, y1: surfaceY(c), rate: mL, color: c.vis.target, to: c.id, exact: true })
    log(state, `Cho ${fmt(mL)} mL ${REAGENT_BY_ID[reagent].name} vào ${label(c)}.`, 'action')
  }
}

function splitParcel(contents, fraction) {
  const out = emptyContents()
  const f = Math.min(1, Math.max(0, fraction))
  for (const group of ['liquids', 'ions', 'indicators', 'precipitates']) {
    for (const [k, v] of Object.entries(contents[group])) {
      out[group][k] = v * f
      contents[group][k] = v - out[group][k]
      if (contents[group][k] < 1e-15) delete contents[group][k]
    }
  }
  return out
}

function fmt(x) {
  return Number(x).toLocaleString('vi-VN', { maximumFractionDigits: 2 })
}

// Containers rest on a support: burner top, rack slot or bench.
function settle(state, o) {
  const def = EQUIPMENT[o.type]
  if (!def) return
  if (isContainer(o) || o.type === 'burner' || o.type === 'power' || o.type === 'voltmeter' || o.type === 'rack') {
    let floor = 0
    for (const b of state.objects) {
      if (b === o) continue
      if (b.type === 'burner' && isContainer(o) && Math.abs(b.x - o.x) < EQUIPMENT.burner.w / 2) floor = Math.max(floor, b.y + EQUIPMENT.burner.h)
      if (b.type === 'rack' && o.type === 'testTube' && Math.abs(b.x - o.x) < EQUIPMENT.rack.w / 2) {
        const slots = EQUIPMENT.rack.slots
        const slotW = EQUIPMENT.rack.w / slots
        const idx = Math.max(0, Math.min(slots - 1, Math.floor((o.x - (b.x - EQUIPMENT.rack.w / 2)) / slotW)))
        o.x = b.x - EQUIPMENT.rack.w / 2 + slotW * (idx + 0.5)
        floor = Math.max(floor, b.y + 8)
      }
    }
    if (o.angle === 0 || isContainer(o)) o.y = o.held ? o.y : floor
  }
}

export function snapshot(state) {
  return JSON.stringify(state)
}

export function restore(json) {
  return JSON.parse(json)
}

export function createSim(seed) {
  const sim = {
    state: createState(seed),
    history: [],
    future: [],
    initial: null,
    acc: 0,
    listeners: new Set(),
    pending: null,
    // Safety assessment without running the command; UI shows it before confirming.
    check(cmd) {
      return assess(sim.state, cmd)
    },
    dispatch(cmd, { confirmed = false, record = true } = {}) {
      const verdict = assess(sim.state, cmd)
      if (verdict.level === 'block') {
        log(sim.state, `Đã chặn: ${verdict.reasons.join(' ')}`, 'danger')
        sim.emit()
        return { ok: false, verdict }
      }
      if (verdict.level === 'warn' && !confirmed) return { ok: false, needsConfirm: true, verdict }
      const fn = COMMANDS[cmd.type]
      if (!fn) throw new Error(`Lệnh không hợp lệ: ${cmd.type}`)
      if (record) sim.record()
      if (verdict.level === 'warn') log(sim.state, `Cảnh báo an toàn: ${verdict.reasons.join(' ')}`, 'warn')
      const result = fn(sim.state, cmd) || {}
      const problem = checkInvariants(sim.state)
      if (problem) throw new Error(`Vi phạm bất biến: ${problem}`)
      sim.emit()
      return { ok: true, verdict, ...result }
    },
    record() {
      sim.history.push(snapshot(sim.state))
      if (sim.history.length > HISTORY_LIMIT) sim.history.shift()
      sim.future = []
    },
    undo() {
      if (!sim.history.length) return false
      sim.future.push(snapshot(sim.state))
      const keep = { speed: sim.state.speed, paused: sim.state.paused }
      sim.state = restore(sim.history.pop())
      Object.assign(sim.state, keep)
      log(sim.state, 'Hoàn tác thao tác trước.', 'action')
      sim.emit()
      return true
    },
    markInitial() {
      sim.initial = snapshot(sim.state)
    },
    reset() {
      sim.record()
      sim.state = sim.initial ? restore(sim.initial) : createState()
      log(sim.state, 'Đặt lại thí nghiệm về trạng thái ban đầu.', 'action')
      sim.emit()
    },
    load(data) {
      sim.state = data
      sim.history = []
      sim.future = []
      sim.emit()
    },
    // Advance by real elapsed seconds; speed scales the simulation clock, not just animation.
    advance(realSeconds) {
      if (sim.state.paused) return 0
      sim.acc += Math.min(realSeconds, 0.25) * sim.state.speed
      let n = 0
      while (sim.acc >= H && n < MAX_STEPS_PER_FRAME) {
        stepOnce(sim.state)
        sim.acc -= H
        n += 1
      }
      if (n) sim.emit()
      return n
    },
    runFor(simSeconds) {
      const steps = Math.round(simSeconds / H)
      for (let i = 0; i < steps; i += 1) stepOnce(sim.state)
      sim.emit()
    },
    emit() {
      for (const fn of sim.listeners) fn(sim.state)
    },
    subscribe(fn) {
      sim.listeners.add(fn)
      return () => sim.listeners.delete(fn)
    }
  }
  return sim
}

export function stepOnce(state) {
  state.streams = state.streams.filter(s => s.exact && state.t - (s.t0 ?? (s.t0 = state.t)) < 0.6)
  stepDrops(state, H)
  for (const o of state.objects) if (isContainer(o)) stepContainer(state, o, H)
  stepElectro(state, H)
  stepTools(state, H)
  state.t += H
  state.step += 1
}

// Invariants: no negative amounts anywhere; returns a message or null.
export function checkInvariants(state) {
  const bad = (v, where) => (Number.isFinite(v) && v >= -1e-12 ? null : `${where} = ${v}`)
  for (const o of state.objects) {
    const groups = o.contents ? ['liquids', 'ions', 'indicators', 'precipitates'] : []
    for (const g of groups) {
      for (const [k, v] of Object.entries(o.contents[g])) {
        const msg = bad(v, `${o.id}.${g}.${k}`)
        if (msg) return msg
      }
    }
    if (o.type === 'solid') {
      const msg = bad(o.massG, `${o.id}.massG`)
      if (msg) return msg
    }
    if (o.T != null && !(o.T > -50 && o.T < 2000)) return `${o.id}.T = ${o.T}`
  }
  return null
}

// Total element inventory on the bench (excluding stock bottles), for conservation tests.
export function benchInventory(state) {
  const total = {}
  const add = inv => { for (const [k, v] of Object.entries(inv)) total[k] = (total[k] || 0) + v }
  for (const o of state.objects) {
    if (o.stock) continue
    if (o.contents) add(elementInventory(o.contents))
    if (o.type === 'solid') {
      const r = REAGENT_BY_ID[o.reagent]
      add(elementInventory(emptyContents(), { [r.formula]: o.massG / r.molarMass, ...o.coat }))
    }
    if (o.cuDeposit) add({ Cu: o.cuDeposit })
    if (o.residue) add(elementInventory({ ...emptyContents(), ions: o.residue }))
  }
  for (const d of state.drops) add(elementInventory(d.parcel))
  add(elementInventory(state.spill.contents))
  return total
}

export { containerAt, containerBelow, surfaceY, volumeOf, byId, isContainer, label, halfWidthAt, innerHeight }
