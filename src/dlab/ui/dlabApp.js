// ChemLab 7.0 Dynamic Laboratory — workspace UI and interaction controller.
import './dlab.css'
import { createSim, SPEEDS, snapshot, restore } from '../engine/sim.js'
import { EQUIPMENT, CAPABILITIES } from '../data/equipment.js'
import { REAGENTS, REAGENT_BY_ID, HAZARD_LABELS, IONS, PRECIPITATES, LIQUIDS, INDICATORS, molarMass } from '../data/materials.js'
import { byId, isContainer, volumeOf, containerAt, containerBelow, surfaceY, label as objLabel } from '../engine/processes.js'
import { createView, render, toWorld, hit } from './render2d.js'
import { GUIDED } from '../guided.js'
import { saveExperiment, listExperiments, loadExperiment, deleteExperiment, AUTOSAVE_ID } from '../persistence.js'

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const num = (x, d = 2) => Number(x).toLocaleString('vi-VN', { maximumFractionDigits: d })
const sub = f => String(f || '').replace(/(\d+)/g, d => [...d].map(ch => '₀₁₂₃₄₅₆₇₈₉'[ch]).join('')).replace(/\^?(\d?)([+-])$/, '$1$2')

const LIB_TABS = [
  { id: 'equipment', label: 'Dụng cụ' },
  { id: 'solution', label: 'Dung dịch' },
  { id: 'liquid', label: 'Chất lỏng' },
  { id: 'solid', label: 'Chất rắn' },
  { id: 'gas', label: 'Chất khí' },
  { id: 'indicator', label: 'Chỉ thị' },
  { id: 'measure', label: 'Đo & điện' }
]
const EQUIP_TAB = { glass: 'equipment', support: 'equipment', transfer: 'equipment', tool: 'equipment', stock: null, measure: 'measure', heat: 'measure', electro: 'measure', gas: 'gas' }

function libraryItems() {
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
    items.push({ key: `rg:${r.id}`, tab, name: r.name, sub: `${sub(r.formula) || ''}${r.M ? ` · ${String(r.M).replace('.', ',')} M` : ''}`, reagent: r.id })
  }
  return items
}

export function initDynamicLab(host) {
  if (!host || host.dataset.ready) return
  host.dataset.ready = '1'
  const sim = createSim(Date.now() >>> 0)
  const view = createView()
  const ui = { selected: null, tab: 'equipment', query: '', theme: document.documentElement.dataset.theme === 'light' ? 'light' : 'dark', highlight: [], mode: 'sandbox', guided: null, render3d: false, quality: 'high', dirty: false }
  host.innerHTML = template()
  host.classList.add('dlab')
  const $ = sel => host.querySelector(sel)
  const canvas = $('.dlab-canvas')
  const ctx = canvas.getContext('2d')
  const stage = $('.dlab-stage')
  const live = $('.dlab-live')
  const items = libraryItems()

  // ── Layout & rendering loop ────────────────────────────────────────
  function resize() {
    const rect = stage.getBoundingClientRect()
    view.w = Math.max(200, rect.width)
    view.h = Math.max(240, rect.height)
    view.dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.round(view.w * view.dpr)
    canvas.height = Math.round(view.h * view.dpr)
    canvas.style.width = `${view.w}px`
    canvas.style.height = `${view.h}px`
    if (!ui.fitted && view.w > 0) {
      view.zoom = Math.max(0.55, Math.min(2, view.w / 520, view.h / 300))
      view.x = 430
      ui.fitted = true
    }
    draw()
  }
  new ResizeObserver(resize).observe(stage)

  let frame = null
  let last = performance.now()
  const visible = () => !document.hidden && host.offsetParent !== null
  function loop(now) {
    frame = null
    if (!visible()) return
    const dt = (now - last) / 1000
    last = now
    sim.advance(dt)
    draw()
    if (three) three.update(sim.state, ui)
    frame = requestAnimationFrame(loop)
  }
  function start() {
    if (frame == null && visible()) { last = performance.now(); frame = requestAnimationFrame(loop) }
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) autosave(); start() })
  window.addEventListener('chemlab:view-change', () => setTimeout(start, 0))
  new IntersectionObserver(() => start()).observe(host)

  function draw() {
    ui.theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
    if (!ui.render3d) render(ctx, sim.state, view, ui)
    paintToolbar()
    if (++ui.tick % 6 === 0 || ui.forcePanel) { paintInspector(); paintLog(); paintGuided(); ui.forcePanel = false }
  }
  ui.tick = 0

  sim.subscribe(() => { ui.dirty = true; ui.forcePanel = true })

  // ── Library ────────────────────────────────────────────────────────
  function paintLibrary() {
    const q = ui.query.trim().toLowerCase()
    const list = items.filter(it => (q ? `${it.name} ${it.sub}`.toLowerCase().includes(q) : it.tab === ui.tab))
    $('.dlab-lib-list').innerHTML = list.map(it => `
      <li><button type="button" class="dlab-lib-item" data-key="${esc(it.key)}" title="Bấm để lấy ra bàn, hoặc kéo thả vào bàn/cốc">
        <span class="dlab-lib-name">${esc(it.name)}</span><span class="dlab-lib-sub">${esc(it.sub)}</span>
      </button></li>`).join('') || '<li class="dlab-empty">Không tìm thấy mục phù hợp.</li>'
    host.querySelectorAll('.dlab-tab').forEach(b => b.setAttribute('aria-selected', String(!q && b.dataset.tab === ui.tab)))
  }
  host.querySelector('.dlab-tabs').addEventListener('click', e => {
    const b = e.target.closest('.dlab-tab')
    if (!b) return
    ui.tab = b.dataset.tab
    ui.query = ''
    $('.dlab-search').value = ''
    paintLibrary()
  })
  $('.dlab-search').addEventListener('input', e => { ui.query = e.target.value; paintLibrary() })
  paintLibrary()

  // A free spot on the visible part of the bench, nearest the centre first.
  function freeX() {
    const xs = sim.state.objects.filter(o => o.y < 5).map(o => o.x)
    const [x0] = toWorld(view, 30, 0)
    const [x1] = toWorld(view, view.w - 30, 0)
    const spots = []
    for (let x = x0 + 30; x <= x1 - 30; x += 15) spots.push(x)
    spots.sort((a, b) => Math.abs(a - view.x) - Math.abs(b - view.x))
    return Math.round(spots.find(x => !xs.some(v => Math.abs(v - x) < 50)) ?? view.x)
  }

  function takeFromLibrary(key, at = null) {
    const it = items.find(i => i.key === key)
    if (!it) return
    if (it.type) {
      if (it.type === 'litmusPaper') {
        const r = sim.dispatch({ type: 'newLitmus', x: at?.x ?? freeX() })
        if (at) byId(sim.state, r.id).y = Math.max(0, at.y)
        return select(r.id)
      }
      const tool = ['dropper', 'pipette', 'rod', 'spatula', 'tongs', 'thermometer', 'phMeter', 'electrodes'].includes(it.type)
      const r = sim.dispatch({ type: 'add', equipmentType: it.type, x: at?.x ?? freeX(), y: tool ? Math.max(40, at?.y ?? 120) : 0 })
      if (!tool) sim.dispatch({ type: 'move', id: r.id, x: byId(sim.state, r.id).x, y: 0 }, { record: false })
      return select(r.id)
    }
    const reagent = REAGENT_BY_ID[it.reagent]
    if (reagent.kind === 'solid') {
      const target = at ? containerAt(sim.state, at.x, at.y + 2) || containerBelow(sim.state, at.x, at.y + 200) : selectedContainer()
      if (!target) return toast(`Chọn hoặc kéo ${reagent.name} vào một cốc/ống nghiệm. Chất rắn được lấy bằng ${reagent.tool === 'tongs' ? 'kẹp' : 'thìa'}.`)
      return addSolidWithTool(reagent, target)
    }
    const r = sim.dispatch({ type: 'add', equipmentType: 'bottle', reagent: reagent.id, x: at?.x ?? freeX() })
    select(r.id)
  }

  function selectedContainer() {
    const o = byId(sim.state, ui.selected)
    return isContainer(o) && !o.stock ? o : null
  }

  async function addSolidWithTool(reagent, container) {
    const mass = await askNumber(`Khối lượng ${reagent.name} (g)`, reagent.defaultMass, 0.001, reagent.maxMass * 2)
    if (mass == null) return
    let tool = sim.state.objects.find(o => o.type === reagent.tool && !o.load)
    if (!tool) tool = byId(sim.state, sim.dispatch({ type: 'add', equipmentType: reagent.tool, x: container.x, y: 160 }).id)
    tool.x = container.x
    tool.y = container.y + EQUIPMENT[container.type].h + 30
    if (!(await run({ type: 'pick', tool: tool.id, reagent: reagent.id, massG: mass }))) return
    await run({ type: 'release', tool: tool.id })
    select(tool.id)
  }

  host.querySelector('.dlab-lib-list').addEventListener('click', e => {
    const b = e.target.closest('.dlab-lib-item')
    if (b && !ui.libDragged) {
      takeFromLibrary(b.dataset.key)
      host.classList.remove('dlab--show-lib')
    }
    ui.libDragged = false
  })
  // Pointer drag from library to the bench (works for touch too).
  host.querySelector('.dlab-lib-list').addEventListener('pointerdown', e => {
    const b = e.target.closest('.dlab-lib-item')
    if (!b || e.button > 0) return
    const startX = e.clientX
    const startY = e.clientY
    let ghost = null
    const move = ev => {
      if (!ghost && Math.hypot(ev.clientX - startX, ev.clientY - startY) > 8) {
        ghost = document.createElement('div')
        ghost.className = 'dlab-ghost'
        ghost.textContent = b.querySelector('.dlab-lib-name').textContent
        document.body.appendChild(ghost)
      }
      if (ghost) { ghost.style.left = `${ev.clientX + 8}px`; ghost.style.top = `${ev.clientY + 8}px` }
    }
    const up = ev => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
      if (!ghost) return
      ghost.remove()
      ui.libDragged = true
      const rect = canvas.getBoundingClientRect()
      if (ev.clientX < rect.left || ev.clientX > rect.right || ev.clientY < rect.top || ev.clientY > rect.bottom) return
      const [x, y] = toWorld(view, ev.clientX - rect.left, ev.clientY - rect.top)
      takeFromLibrary(b.dataset.key, { x, y })
    }
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', up)
  })

  host.addEventListener('click', e => {
    const c = e.target.closest('[data-close]')
    if (c) host.classList.remove(`dlab--show-${c.dataset.close}`)
  })

  // ── Commands with safety dialogs ───────────────────────────────────
  async function run(cmd, opts = {}) {
    let r = sim.dispatch(cmd, opts)
    if (r.needsConfirm) {
      const ok = await confirmDialog('Cảnh báo an toàn', r.verdict.reasons)
      if (!ok) return null
      r = sim.dispatch(cmd, { ...opts, confirmed: true })
    }
    if (!r.ok && r.verdict?.level === 'block') toast(`Không thực hiện được: ${r.verdict.reasons.join(' ')}`, 'danger')
    return r.ok ? r : null
  }

  function select(id) {
    ui.selected = id
    ui.forcePanel = true
    const o = byId(sim.state, id)
    if (o) announce(`Đã chọn ${objLabel(o)}`)
    draw()
  }

  // ── Canvas interaction ─────────────────────────────────────────────
  const pointers = new Map()
  let drag = null
  function pick(x, y) {
    const objs = sim.state.objects
    for (let i = objs.length - 1; i >= 0; i -= 1) {
      const o = objs[i]
      if (o.type === 'solid' && o.in) {
        const c = byId(sim.state, o.in)
        if (c && Math.hypot(c.x + o.lx - x, c.y + o.ly + 4 - y) < 8) return o
        continue
      }
      if (hit(o, x, y)) return o
    }
    return null
  }
  canvas.addEventListener('pointerdown', e => {
    canvas.focus({ preventScroll: true })
    canvas.setPointerCapture(e.pointerId)
    const rect = canvas.getBoundingClientRect()
    pointers.set(e.pointerId, { x: e.clientX - rect.left, y: e.clientY - rect.top })
    if (pointers.size === 2) { drag = { pinch: true, zoom: view.zoom, dist: pinchDist() }; return }
    const [x, y] = toWorld(view, e.clientX - rect.left, e.clientY - rect.top)
    let o = pick(x, y)
    if (o?.type === 'solid' && o.in) { select(o.id); o = null; return }
    if (!o) { drag = { pan: true, sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y }; select(null); return }
    select(o.id)
    if (o.condition === 'UNUSABLE') return
    sim.record()
    drag = { id: o.id, dx: o.x - x, dy: o.y - y, start: { x: o.x, y: o.y, angle: o.angle }, moved: false }
    if (isContainer(o)) o.held = true
  })
  canvas.addEventListener('pointermove', e => {
    const rect = canvas.getBoundingClientRect()
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX - rect.left, y: e.clientY - rect.top })
    if (!drag) return
    if (drag.pinch) { if (pointers.size === 2) view.zoom = clampZoom(drag.zoom * pinchDist() / drag.dist); return }
    if (drag.pan) { view.x = drag.vx - (e.clientX - drag.sx) / view.zoom; view.y = drag.vy + (e.clientY - drag.sy) / view.zoom; return }
    const o = byId(sim.state, drag.id)
    if (!o) return
    const [x, y] = toWorld(view, e.clientX - rect.left, e.clientY - rect.top)
    const nx = x + drag.dx
    const ny = Math.max(0, y + drag.dy)
    if (o.type === 'rod') o.stroke = (o.stroke || 0) + Math.hypot(nx - o.x, ny - o.y)
    o.x = nx
    o.y = ny
    drag.moved = true
  })
  const endDrag = async e => {
    pointers.delete(e.pointerId)
    if (!drag) return
    const d = drag
    drag = null
    if (d.pan || d.pinch) return
    const o = byId(sim.state, d.id)
    if (!o) return
    o.held = false
    const wasTilted = o.angle !== 0
    if (isContainer(o)) o.angle = 0
    if (!d.moved && !wasTilted) { sim.history.pop(); return }
    const r = sim.dispatch({ type: 'move', id: o.id, x: o.x, y: o.y }, { record: false })
    if (r.needsConfirm) {
      if (await confirmDialog('Cảnh báo an toàn', r.verdict.reasons)) sim.dispatch({ type: 'move', id: o.id, x: o.x, y: o.y }, { record: false, confirmed: true })
      else Object.assign(o, d.start)
    }
    else if (!r.ok) { Object.assign(o, d.start); toast(r.verdict.reasons.join(' '), 'danger'); settleBack(o) }
    // A loaded tool released over a container drops its solid in.
    if ((o.type === 'tongs' || o.type === 'spatula') && o.load && containerBelow(sim.state, o.x, o.y + 40)) await run({ type: 'release', tool: o.id }, { record: false })
  }
  function settleBack(o) { sim.dispatch({ type: 'move', id: o.id, x: o.x, y: o.y }, { record: false }) }
  canvas.addEventListener('pointerup', endDrag)
  canvas.addEventListener('pointercancel', endDrag)
  canvas.addEventListener('wheel', e => {
    e.preventDefault()
    if (drag?.id) {
      const o = byId(sim.state, drag.id)
      if (isContainer(o)) o.angle = Math.max(-2.2, Math.min(2.2, o.angle + Math.sign(e.deltaY) * 0.08))
      return
    }
    const rect = canvas.getBoundingClientRect()
    const [wx, wy] = toWorld(view, e.clientX - rect.left, e.clientY - rect.top)
    view.zoom = clampZoom(view.zoom * (e.deltaY < 0 ? 1.1 : 0.9))
    const [nx, ny] = toWorld(view, e.clientX - rect.left, e.clientY - rect.top)
    view.x += wx - nx
    view.y += wy - ny
  }, { passive: false })
  function pinchDist() { const [a, b] = [...pointers.values()]; return Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)) }
  const clampZoom = z => Math.max(0.35, Math.min(4, z))

  canvas.addEventListener('keydown', async e => {
    const o = byId(sim.state, ui.selected)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); sim.undo(); return }
    if (e.key === ' ' && !o) { e.preventDefault(); togglePause(); return }
    if (!o) return
    const step = e.shiftKey ? 20 : 5
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }
    if (moves[e.key]) {
      e.preventDefault()
      await run({ type: 'move', id: o.id, x: o.x + moves[e.key][0], y: Math.max(0, o.y + moves[e.key][1]) })
      if (isContainer(o) && moves[e.key][1] > 0) o.held = true
    }
    if ((e.key === '[' || e.key === ']') && isContainer(o)) { e.preventDefault(); o.held = true; o.y = Math.max(o.y, 60); sim.dispatch({ type: 'tilt', id: o.id, angle: o.angle + (e.key === ']' ? 0.1 : -0.1) }) }
    if (e.key === 'Escape' && isContainer(o)) { o.angle = 0; o.held = false; sim.dispatch({ type: 'move', id: o.id, x: o.x, y: o.y }) }
    if (e.key === 'Delete') run({ type: 'remove', id: o.id })
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); primaryAction(o) }
  })

  function primaryAction(o) {
    if (o.type === 'dropper' || o.type === 'pipette') return run({ type: 'dispense', tool: o.id, drops: 1 })
    if (o.type === 'rod') { const c = containerAt(sim.state, o.x, o.y + 1); if (c) return run({ type: 'stir', id: c.id }) }
    if ((o.type === 'tongs' || o.type === 'spatula') && o.load) return run({ type: 'release', tool: o.id })
    if (o.type === 'burner') return run({ type: 'burner', id: o.id, on: !o.on })
  }

  // ── Inspector ──────────────────────────────────────────────────────
  const panel = $('.dlab-inspector')
  function paintInspector() {
    if (panel.contains(document.activeElement) && document.activeElement.matches('input, select')) return
    const st = sim.state
    const o = byId(st, ui.selected)
    const options = st.objects.filter(x => x.type !== 'solid' || x.in).map(x => `<option value="${x.id}" ${x.id === ui.selected ? 'selected' : ''}>${esc(objLabel(x))}${x.type === 'solid' ? ` (${esc(REAGENT_BY_ID[x.reagent].name)})` : ''}</option>`).join('')
    let html = `<label class="dlab-field"><span>Vật trên bàn (${st.objects.length})</span><select class="dlab-select-obj"><option value="">— Chọn vật —</option>${options}</select></label>`
    if (!o) {
      html += `<div class="dlab-empty"><p>Chọn một vật trên bàn để xem thông tin và thao tác.</p><p class="dlab-hint">Kéo để di chuyển. Khi đang giữ cốc: lăn chuột (hoặc phím [ ]) để nghiêng và rót. Phím mũi tên di chuyển vật đang chọn.</p></div>`
      patch(panel, html)
      return
    }
    html += inspectorFor(o, st)
    patch(panel, html)
  }

  // Re-rendering on every tick would detach buttons mid-click; when only numbers change, update text in place.
  function patch(el, html) {
    if (el.dataset.html === html) return
    const skeleton = html.replace(/[0-9.,:−+-]+/g, '#')
    if (el.dataset.skel === skeleton) {
      const next = document.createElement('div')
      next.innerHTML = html
      const a = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      const b = document.createTreeWalker(next, NodeFilter.SHOW_TEXT)
      while (a.nextNode() && b.nextNode()) if (a.currentNode.nodeValue !== b.currentNode.nodeValue) a.currentNode.nodeValue = b.currentNode.nodeValue
    }
    else {
      el.innerHTML = html
      el.dataset.skel = skeleton
    }
    el.dataset.html = html
  }

  function stateName(r) {
    return { solution: 'Dung dịch', liquid: 'Chất lỏng', solid: 'Chất rắn', indicator: 'Chất chỉ thị', gas: 'Chất khí' }[r.kind]
  }

  function safetyBlock(r) {
    if (!r) return ''
    const hz = (r.hazards || []).map(h => `<span class="dlab-hz">${esc(HAZARD_LABELS[h])}</span>`).join('')
    return `<div class="dlab-safety"><strong>An toàn</strong>${hz ? `<div class="dlab-hzs">${hz}</div>` : ''}<p>${esc(r.safety)}</p></div>`
  }

  function compositionList(c) {
    const lines = []
    for (const [k, v] of Object.entries(c.contents.liquids)) if (v > 0.005) lines.push(`${LIQUIDS[k].name}: ${num(v, 2)} mL`)
    const V = Object.entries(c.contents.liquids).filter(([k]) => LIQUIDS[k].aqueous).reduce((s, [, v]) => s + v, 0) / 1000
    for (const [k, v] of Object.entries(c.contents.ions)) if (v > 1e-9) lines.push(`${IONS[k].label}: ${num(v * 1000, 3)} mmol${V > 0 ? ` (${num(v / V, 3)} M)` : ''}`)
    for (const [k, v] of Object.entries(c.contents.precipitates)) if (v > 1e-9) lines.push(`${sub(PRECIPITATES[k].formula)}↓: ${num(v * 1000, 3)} mmol = ${num(v * molarMass(PRECIPITATES[k].formula) * 1000, 1)} mg`)
    for (const [k, v] of Object.entries(c.contents.indicators)) if (v > 0.01) lines.push(`${INDICATORS[k].name}: ${num(v, 1)} giọt`)
    return lines
  }

  function containerTargets(o) {
    return sim.state.objects.filter(x => isContainer(x) && x.id !== o.id && x.condition !== 'UNUSABLE').map(x => `<option value="${x.id}">${esc(objLabel(x))}</option>`).join('')
  }

  function inspectorFor(o, st) {
    const def = EQUIPMENT[o.type]
    const cond = o.condition && o.condition !== 'NORMAL' ? `<span class="dlab-cond dlab-cond--${o.condition.toLowerCase()}">${{ WARNING: 'Cảnh báo', CRACKED: 'Bị nứt', UNUSABLE: 'Hỏng' }[o.condition]}</span>` : ''
    let h = ''
    if (o.type === 'solid') {
      const r = REAGENT_BY_ID[o.reagent]
      const coat = Object.entries(o.coat || {}).filter(([, v]) => v > 1e-7).map(([m, v]) => `${m}: ${num(v * 1000, 3)} mmol`).join(', ')
      h += `<h3 class="dlab-title">${esc(r.name)}</h3><p class="dlab-formula">${sub(r.formula)} · Chất rắn</p>`
      h += `<dl class="dlab-kv"><dt>Khối lượng còn</dt><dd>${num(o.massG, 4)} g</dd><dt>Ban đầu</dt><dd>${num(o.mass0, 4)} g</dd>${coat ? `<dt>Lớp bám</dt><dd>${coat}</dd>` : ''}</dl>`
      h += safetyBlock(r)
      return h
    }
    const reagent = o.reagent && REAGENT_BY_ID[o.reagent]
    h += `<h3 class="dlab-title">${esc(objLabel(o))} ${cond}</h3>`
    if (reagent) h += `<p class="dlab-formula">${sub(reagent.formula) || '—'} · ${stateName(reagent)}${reagent.nameEn ? ` · ${esc(reagent.nameEn)}` : ''}</p>`
    else h += `<p class="dlab-formula">${esc((def.caps || []).map(c => CAPABILITIES[c] || c).join(' · '))}</p>`
    if (o.damageReason) h += `<p class="dlab-alert">${esc(o.damageReason)}</p>`
    if (isContainer(o)) {
      const vol = volumeOf(o)
      h += `<dl class="dlab-kv"><dt>Thể tích</dt><dd>${num(vol, 1)} / ${def.capacityML} mL</dd>${o.pH != null && vol > 0.05 ? `<dt>pH</dt><dd>${num(o.pH, 2)}</dd>` : ''}<dt>Nhiệt độ</dt><dd>${num(o.T, 1)} °C</dd></dl>`
      if (o.unsupported) h += `<p class="dlab-alert">Chưa có mô hình: ${esc(o.unsupported)} <button type="button" class="dlab-btn dlab-btn--link" data-act="ai">Hỏi ChemAI</button></p>`
      const comp = compositionList(o)
      if (comp.length) h += `<details class="dlab-details"><summary>Định lượng</summary><ul>${comp.map(l => `<li>${l}</li>`).join('')}</ul></details>`
      if (!o.stock) {
        const solids = st.objects.filter(s => s.type === 'solid' && s.in === o.id && s.massG > 0)
        if (solids.length) h += `<p class="dlab-note">Trong cốc: ${solids.map(s => `${esc(REAGENT_BY_ID[s.reagent].name)} ${num(s.massG, 3)} g`).join(', ')}</p>`
      }
      if (o.condition !== 'UNUSABLE') {
        h += `<fieldset class="dlab-act"><legend>Rót chính xác</legend><div class="dlab-row"><input type="number" class="dlab-in" data-in="pour-ml" min="0.1" step="0.5" value="5" aria-label="Thể tích rót (mL)"><span>mL vào</span><select data-in="pour-to" aria-label="Rót vào">${containerTargets(o)}</select></div><button type="button" class="dlab-btn" data-act="pour">Rót</button></fieldset>`
        h += `<div class="dlab-row dlab-actions"><button type="button" class="dlab-btn" data-act="stir">Khuấy</button>`
        const tank = st.objects.find(x => x.type === 'gasTank')
        if (tank && !o.stock) h += `<button type="button" class="dlab-btn" data-act="co2">${o.co2Feed ? 'Ngừng sục CO₂' : 'Sục CO₂'}</button>`
        h += '</div>'
      }
      h += `<p class="dlab-hint">Rót trực tiếp: kéo cốc lên phía trên dụng cụ khác, giữ chuột và lăn bánh xe (hoặc phím [ ]) để nghiêng.</p>`
      if (reagent) h += safetyBlock(reagent)
    }
    if (o.type === 'dropper' || o.type === 'pipette') {
      const vol = volumeOf({ contents: o.contents })
      const under = containerAt(st, o.x, o.y + 1)
      h += `<dl class="dlab-kv"><dt>Đang chứa</dt><dd>${num(vol, 2)} / ${def.capacityML} mL${o.source ? ` (${esc(o.source)})` : ''}</dd><dt>Đầu ống</dt><dd>${under ? `trong ${esc(objLabel(under))}` : 'ngoài không khí'}</dd></dl>`
      h += `<div class="dlab-row dlab-actions">`
      if (under && o.y < surfaceY(under)) h += `<button type="button" class="dlab-btn" data-act="aspirate">Hút ${o.type === 'dropper' ? '1 mL' : '5 mL'}</button>`
      if (vol > 0) h += `<button type="button" class="dlab-btn" data-act="drop1">Nhỏ 1 giọt</button><button type="button" class="dlab-btn" data-act="drop5">Nhỏ 5 giọt</button><button type="button" class="dlab-btn" data-act="empty">Xả hết</button>`
      h += '</div>'
      if (!under) h += '<p class="dlab-hint">Đưa đầu ống vào dung dịch để hút; đặt phía trên cốc để nhỏ giọt.</p>'
    }
    if (o.type === 'tongs' || o.type === 'spatula') {
      const solids = REAGENTS.filter(r => r.kind === 'solid' && r.tool === o.type)
      if (o.load) h += `<p class="dlab-note">Đang giữ ${num(o.load.massG, 3)} g ${esc(REAGENT_BY_ID[o.load.reagent].name)}.</p><button type="button" class="dlab-btn" data-act="release">Thả xuống</button><p class="dlab-hint">Hoặc kéo dụng cụ tới phía trên cốc rồi thả chuột.</p>`
      else h += `<fieldset class="dlab-act"><legend>Lấy chất rắn</legend><select data-in="solid" aria-label="Chất rắn">${solids.map(r => `<option value="${r.id}">${esc(r.name)}</option>`).join('')}</select><div class="dlab-row"><input type="number" class="dlab-in" data-in="mass" min="0.01" step="0.05" value="${solids[0]?.defaultMass ?? 1}" aria-label="Khối lượng (g)"><span>g</span><button type="button" class="dlab-btn" data-act="pick">Lấy</button></div></fieldset>`
    }
    if (o.type === 'litmusPaper') {
      const wet = (o.seg || []).filter(s => s.wet > 0.4).length
      h += `<p class="dlab-note">${wet ? `${wet}/${def.segments} phần giấy đã ướt.` : 'Giấy khô, màu tím.'}</p><button type="button" class="dlab-btn" data-act="newpaper">Lấy giấy quỳ mới</button><p class="dlab-hint">Kéo giấy xuống để nhúng vào dung dịch; nhúng càng sâu, vùng đổi màu càng dài.</p>`
    }
    if (o.type === 'thermometer') h += `<dl class="dlab-kv"><dt>Số chỉ</dt><dd>${num(o.reading ?? 25, 1)} °C</dd></dl>`
    if (o.type === 'phMeter') h += `<dl class="dlab-kv"><dt>Số chỉ</dt><dd>${o.reading == null ? '—' : num(o.reading, 2)}</dd></dl><p class="dlab-hint">Máy đo theo mô hình dung dịch lý tưởng ở 25 °C.</p>`
    if (o.type === 'burner') h += `<button type="button" class="dlab-btn" data-act="burner">${o.on ? 'Tắt bếp' : 'Bật bếp'}</button><p class="dlab-hint">Đặt cốc chịu nhiệt lên mặt bếp để đun.</p>`
    if (o.type === 'power') {
      const els = st.objects.filter(x => x.type === 'electrodes')
      h += `<dl class="dlab-kv"><dt>Trạng thái</dt><dd>${esc(o.status || '')}</dd></dl><div class="dlab-row"><label class="dlab-field"><span>Hiệu điện thế (V)</span><input type="number" class="dlab-in" data-in="volts" min="0" max="12" step="0.5" value="${o.volts}"></label></div>`
      h += `<div class="dlab-row"><select data-in="wire" aria-label="Nối dây tới">${els.map(x => `<option value="${x.id}">${esc(objLabel(x))}</option>`).join('')}</select><button type="button" class="dlab-btn" data-act="wire" ${els.length ? '' : 'disabled'}>Nối dây</button></div><button type="button" class="dlab-btn" data-act="power">${o.on ? 'Tắt nguồn' : 'Bật nguồn'}</button>`
    }
    if (o.type === 'voltmeter') {
      const metals = st.objects.filter(x => x.type === 'solid' && x.in && ['zn', 'cu', 'fe', 'mg'].includes(x.reagent))
      h += `<dl class="dlab-kv"><dt>Số chỉ</dt><dd>${o.reading == null ? '—' : `${num(o.reading, 3)} V`}</dd><dt>Ghi chú</dt><dd>${esc(o.status || '')}</dd></dl>`
      h += `<div class="dlab-row"><select data-in="lead" aria-label="Nối dây vôn kế tới">${metals.map(x => `<option value="${x.id}">${esc(REAGENT_BY_ID[x.reagent].name)} trong ${esc(objLabel(byId(st, x.in)))}</option>`).join('')}</select><button type="button" class="dlab-btn" data-act="lead" ${metals.length ? '' : 'disabled'}>Nối dây</button></div>`
    }
    if (o.type === 'bridge') {
      const opts = containerTargets(o)
      h += `<div class="dlab-row"><select data-in="la" aria-label="Cốc thứ nhất">${opts}</select><select data-in="lb" aria-label="Cốc thứ hai">${opts}</select></div><button type="button" class="dlab-btn" data-act="link">Đặt cầu muối</button>`
    }
    if (o.type === 'gasTank') h += `<div class="dlab-row"><select data-in="gasTo" aria-label="Sục vào">${containerTargets(o)}</select><button type="button" class="dlab-btn" data-act="gas">${o.target ? 'Ngừng sục' : 'Sục khí'}</button></div>`
    if (o.condition === 'UNUSABLE' || o.condition === 'CRACKED') h += `<button type="button" class="dlab-btn" data-act="replace">Lấy dụng cụ thay thế</button>`
    h += `<div class="dlab-row dlab-actions"><button type="button" class="dlab-btn dlab-btn--ghost" data-act="remove">Cất khỏi bàn</button></div>`
    return h
  }

  panel.addEventListener('change', e => {
    if (e.target.matches('.dlab-select-obj')) select(e.target.value || null)
  })
  panel.addEventListener('click', async e => {
    const b = e.target.closest('[data-act]')
    if (!b) return
    const o = byId(sim.state, ui.selected)
    if (!o) return
    const val = k => panel.querySelector(`[data-in="${k}"]`)?.value
    const act = b.dataset.act
    if (act === 'pour') await run({ type: 'pourExact', from: o.id, to: val('pour-to'), mL: Number(val('pour-ml')) })
    if (act === 'stir') await run({ type: 'stir', id: o.id })
    if (act === 'co2') {
      const tank = sim.state.objects.find(x => x.type === 'gasTank')
      await run({ type: 'co2', id: tank.id, target: o.id, on: !o.co2Feed })
    }
    if (act === 'aspirate') {
      const c = containerAt(sim.state, o.x, o.y + 1)
      await run({ type: 'aspirate', tool: o.id, from: c.id, mL: o.type === 'dropper' ? 1 : 5 })
    }
    if (act === 'drop1') await run({ type: 'dispense', tool: o.id, drops: 1 })
    if (act === 'drop5') await run({ type: 'dispense', tool: o.id, drops: 5 })
    if (act === 'empty') await run({ type: 'dispense', tool: o.id, mL: 999 })
    if (act === 'pick') await run({ type: 'pick', tool: o.id, reagent: val('solid'), massG: Number(val('mass')) })
    if (act === 'release') await run({ type: 'release', tool: o.id })
    if (act === 'newpaper') { const r = await run({ type: 'newLitmus', x: o.x + 30 }); if (r) select(r.id) }
    if (act === 'burner') await run({ type: 'burner', id: o.id, on: !o.on })
    if (act === 'power') await run({ type: 'power', id: o.id, on: !o.on, volts: Number(val('volts')) })
    if (act === 'wire') await run({ type: 'wire', from: o.id, to: val('wire') })
    if (act === 'lead') await run({ type: 'wire', from: o.id, to: val('lead') })
    if (act === 'link') { if (val('la') === val('lb')) toast('Chọn hai cốc khác nhau.'); else await run({ type: 'link', id: o.id, a: val('la'), b: val('lb') }) }
    if (act === 'gas') await run({ type: 'co2', id: o.id, target: o.target || val('gasTo'), on: !o.target })
    if (act === 'replace') { const r = await run({ type: 'replace', id: o.id }); if (r) select(r.id) }
    if (act === 'remove') { await run({ type: 'remove', id: o.id }); select(null) }
    if (act === 'ai') askChemAI()
    ui.forcePanel = true
  })
  panel.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches('[data-in="volts"]')) {
      const o = byId(sim.state, ui.selected)
      run({ type: 'power', id: o.id, volts: Number(e.target.value) })
    }
  })

  // ── Log ────────────────────────────────────────────────────────────
  let lastLogLen = -1
  function paintLog() {
    const log = sim.state.log
    if (log.length === lastLogLen && !ui.logDirty) return
    lastLogLen = log.length
    const items = log.slice(-14).reverse()
    $('.dlab-log').innerHTML = items.map(e => `<li class="dlab-log--${e.kind}"><time>${fmtTime(e.t)}</time> ${esc(e.text)}</li>`).join('') || '<li class="dlab-empty">Chưa có quan sát nào.</li>'
    const newest = log[log.length - 1]
    if (newest && newest !== ui.lastAnnounced && newest.kind !== 'action') { ui.lastAnnounced = newest; announce(newest.text) }
  }
  const fmtTime = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`

  // ── Toolbar ────────────────────────────────────────────────────────
  function paintToolbar() {
    const st = sim.state
    $('.dlab-time').textContent = `t = ${fmtTime(st.t)}`
    const play = $('[data-tb="play"]')
    const label = st.paused ? 'Tiếp tục' : 'Tạm dừng'
    if (play.dataset.label !== label) { play.dataset.label = label; play.textContent = label; play.setAttribute('aria-pressed', String(st.paused)) }
    host.querySelectorAll('[data-speed]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.speed) === st.speed)))
    $('[data-tb="undo"]').disabled = !sim.history.length
  }
  function togglePause() { sim.state.paused = !sim.state.paused; announce(sim.state.paused ? 'Đã tạm dừng mô phỏng' : 'Tiếp tục mô phỏng'); draw() }
  $('.dlab-toolbar').addEventListener('click', async e => {
    const b = e.target.closest('button')
    if (!b) return
    if (b.dataset.speed) { sim.state.speed = Number(b.dataset.speed); announce(`Tốc độ ${b.textContent}`) }
    if (b.dataset.tb === 'play') togglePause()
    if (b.dataset.tb === 'undo') sim.undo()
    if (b.dataset.tb === 'reset') { if (await confirmDialog('Đặt lại thí nghiệm?', ['Bàn thí nghiệm sẽ trở về trạng thái ban đầu. Có thể hoàn tác.'])) sim.reset() }
    if (b.dataset.tb === 'cleanup') sim.dispatch({ type: 'cleanup' })
    draw()
  })

  // ── Header ─────────────────────────────────────────────────────────
  $('.dlab-header').addEventListener('click', async e => {
    const b = e.target.closest('[data-hd]')
    if (!b) return
    const what = b.dataset.hd
    if (what === 'sandbox') startSandbox()
    if (what === 'guided') openGuidedPicker()
    if (what === 'save') saveDialog()
    if (what === 'open') openDialog()
    if (what === 'view3d') toggle3d()
    if (what === 'full') { if (document.fullscreenElement) document.exitFullscreen(); else host.requestFullscreen?.() }
    if (what === 'ai') askChemAI()
    if (what === 'quality') { ui.quality = ui.quality === 'high' ? 'low' : 'high'; b.textContent = ui.quality === 'high' ? 'Đồ họa: Cao' : 'Đồ họa: Tiết kiệm'; three?.setQuality(ui.quality) }
    if (what === 'lib' || what === 'insp') {
      host.classList.toggle(`dlab--show-${what}`)
      host.classList.remove(`dlab--show-${what === 'lib' ? 'insp' : 'lib'}`)
      host.style.setProperty('--dlab-head-h', `${$('.dlab-header').offsetHeight}px`)
    }
  })

  function startSandbox() {
    ui.mode = 'sandbox'
    ui.guided = null
    ui.highlight = []
    sim.load(restore(snapshot(seedSandbox())))
    sim.markInitial()
    setModeButtons()
    toast('Chế độ Sandbox: lấy tự do hóa chất và dụng cụ từ thư viện bên trái.')
  }
  function seedSandbox() {
    const s = createSim(Date.now() >>> 0)
    const add = (equipmentType, x, extra = {}) => s.dispatch({ type: 'add', equipmentType, x, y: extra.y ?? 0, ...extra }, { record: false })
    add('beaker100', 260)
    add('beaker100', 360)
    add('testTube', 460)
    add('dropper', 540, { y: 150 })
    add('rod', 600, { y: 90 })
    s.state.log = []
    return s.state
  }
  function setModeButtons() {
    $('[data-hd="sandbox"]').setAttribute('aria-pressed', String(ui.mode === 'sandbox'))
    $('[data-hd="guided"]').setAttribute('aria-pressed', String(ui.mode === 'guided'))
  }

  // ── Guided Lab ─────────────────────────────────────────────────────
  async function openGuidedPicker() {
    const choice = await choiceDialog('Chọn bài thực hành có hướng dẫn', GUIDED.map(g => ({ value: g.id, title: g.title, sub: g.group })))
    if (!choice) return
    const lab = GUIDED.find(g => g.id === choice)
    const s = createSim(Date.now() >>> 0)
    const roles = lab.setup(s)
    s.state.log = []
    sim.load(restore(snapshot(s.state)))
    sim.markInitial()
    ui.mode = 'guided'
    ui.guided = { lab, roles, done: [], finished: false }
    setModeButtons()
    ui.forcePanel = true
  }
  function paintGuided() {
    const box = $('.dlab-guided')
    const g = ui.guided
    if (!g) { box.hidden = true; ui.highlight = []; return }
    box.hidden = false
    const st = sim.state
    const idx = g.done.length
    if (idx < g.lab.steps.length && g.lab.steps[idx].check(st, g.roles)) { g.done.push(st.t); announce(`Hoàn thành bước ${idx + 1}`) }
    const current = g.done.length
    const step = g.lab.steps[current]
    ui.highlight = step ? (step.target || []).map(r => g.roles[r]).filter(Boolean) : []
    const key = `${g.lab.id}|${current}|${g.collapsed}`
    if (box.dataset.key === key) return
    box.dataset.key = key
    const finished = current >= g.lab.steps.length
    box.innerHTML = `
      <div class="dlab-guided-head"><div><span class="dlab-kicker">${esc(g.lab.group)}</span><h3>${esc(g.lab.title)}</h3></div>
      <button type="button" class="dlab-btn dlab-btn--ghost" data-g="collapse" aria-expanded="${!g.collapsed}">${g.collapsed ? 'Mở' : 'Thu gọn'}</button></div>
      ${g.collapsed ? '' : `
      ${current === 0 ? `<p><strong>Mục tiêu:</strong> ${esc(g.lab.goal)}</p><p><strong>Kiến thức:</strong> ${esc(g.lab.knowledge)}</p><p><strong>Dụng cụ:</strong> ${esc(g.lab.equipment.join(', '))}</p><p><strong>Hóa chất:</strong> ${esc(g.lab.chemicals.join(', '))}</p><p class="dlab-alert">${esc(g.lab.safety)}</p>` : ''}
      <ol class="dlab-steps">${g.lab.steps.map((s, i) => `<li class="${i < current ? 'is-done' : i === current ? 'is-current' : ''}" ${i === current ? 'aria-current="step"' : ''}>${esc(s.text)}</li>`).join('')}</ol>
      ${finished ? `<div class="dlab-result"><p><strong>Hiện tượng:</strong> ${esc(g.lab.observe)}</p><p><strong>Giải thích:</strong> ${esc(g.lab.explain)}</p><p><strong>Kết luận:</strong> ${esc(g.lab.conclusion)}</p></div>` : ''}
      <p class="dlab-progress">Tiến độ: ${Math.min(current, g.lab.steps.length)}/${g.lab.steps.length}</p>`}
      <div class="dlab-row"><button type="button" class="dlab-btn dlab-btn--ghost" data-g="exit">Thoát bài</button></div>`
  }
  $('.dlab-guided').addEventListener('click', e => {
    const b = e.target.closest('[data-g]')
    if (!b || !ui.guided) return
    if (b.dataset.g === 'collapse') ui.guided.collapsed = !ui.guided.collapsed
    if (b.dataset.g === 'exit') { ui.guided = null; ui.mode = 'sandbox'; setModeButtons() }
    ui.forcePanel = true
  })

  // ── Persistence ────────────────────────────────────────────────────
  async function saveDialog() {
    const name = await askText('Tên thí nghiệm', ui.guided ? ui.guided.lab.title : `Thí nghiệm ${new Date().toLocaleString('vi-VN')}`)
    if (name == null) return
    try { await saveExperiment({ name, state: sim.state }); toast('Đã lưu thí nghiệm trên thiết bị này.') }
    catch (err) { toast(`Không lưu được: ${err.message}`, 'danger') }
  }
  async function openDialog() {
    let list
    try { list = await listExperiments() }
    catch (err) { return toast(`Không đọc được dữ liệu lưu: ${err.message}`, 'danger') }
    if (!list.length) return toast('Chưa có thí nghiệm nào được lưu.')
    const choice = await choiceDialog('Mở thí nghiệm đã lưu', list.map(x => ({ value: x.id, title: x.id === AUTOSAVE_ID ? `Tự động lưu — ${x.name}` : x.name, sub: `${new Date(x.savedAt).toLocaleString('vi-VN')} · ${x.objects} vật · t = ${fmtTime(x.t)}`, deletable: true })), { onDelete: async id => { await deleteExperiment(id); toast('Đã xóa.') } })
    if (!choice) return
    try {
      const save = await loadExperiment(choice)
      sim.load(save.state)
      sim.markInitial()
      ui.guided = null
      ui.mode = 'sandbox'
      setModeButtons()
      toast('Đã mở thí nghiệm. Mô phỏng tiếp tục từ thời điểm đã lưu.')
    }
    catch (err) { toast(`Không mở được: ${err.message}`, 'danger') }
  }
  let lastAutosave = 0
  async function autosave() {
    if (!ui.dirty || Date.now() - lastAutosave < 3000) return
    lastAutosave = Date.now()
    ui.dirty = false
    try { await saveExperiment({ id: AUTOSAVE_ID, name: ui.guided ? ui.guided.lab.title : 'Sandbox', state: sim.state }) }
    catch {}
  }
  setInterval(() => { if (visible()) autosave() }, 15000)

  // ── 3D view (same state, lazy-loaded) ──────────────────────────────
  let three = null
  async function toggle3d() {
    const btn = $('[data-hd="view3d"]')
    if (ui.render3d) {
      three?.dispose()
      three = null
      ui.render3d = false
      canvas.hidden = false
      $('.dlab-3d').hidden = true
      btn.textContent = 'Xem 3D'
      btn.setAttribute('aria-pressed', 'false')
      return
    }
    try {
      const { create3dView } = await import('./render3d.js')
      $('.dlab-3d').hidden = false
      three = create3dView($('.dlab-3d'), { quality: ui.quality, onPick: id => select(id) })
      if (!three) { $('.dlab-3d').hidden = true; return toast('Thiết bị không hỗ trợ WebGL — tiếp tục ở chế độ 2D.') }
      ui.render3d = true
      canvas.hidden = true
      btn.textContent = 'Xem 2D'
      btn.setAttribute('aria-pressed', 'true')
      three.update(sim.state, ui)
      toast('Chế độ 3D: xoay/phóng to để quan sát; trạng thái thí nghiệm giữ nguyên. Thao tác kéo thả thực hiện ở 2D.')
    }
    catch (err) { toast(`Không tải được 3D: ${err.message}`, 'danger') }
  }

  // ── ChemAI (on request only) ───────────────────────────────────────
  function askChemAI() {
    const st = sim.state
    const containers = st.objects.filter(o => isContainer(o) && !o.stock && volumeOf(o) > 0.1).slice(0, 4)
    const desc = containers.map(c => `${objLabel(c)}: ${compositionList(c).slice(0, 5).join('; ')}${c.pH != null ? `; pH ≈ ${c.pH.toFixed(1)}` : ''}`).join('\n')
    const obs = st.log.filter(e => e.kind === 'observe' || e.kind === 'warn').slice(-4).map(e => `- ${e.text}`).join('\n')
    const prompt = `Em đang làm thí nghiệm ảo trong ChemLab.\n${desc}\nQuan sát:\n${obs || '- (chưa có)'}\nHãy giải thích hiện tượng và viết phương trình phản ứng liên quan.`
    if (window.ChemLabApp?.openChemAI) window.ChemLabApp.openChemAI(prompt)
    else toast('ChemAI hiện không khả dụng. Phòng thí nghiệm vẫn hoạt động bình thường.')
  }

  // ── Dialogs ────────────────────────────────────────────────────────
  const dialog = $('.dlab-dialog')
  function openModal(html, wire) {
    return new Promise(resolve => {
      const prev = document.activeElement
      dialog.innerHTML = html
      const done = v => { dialog.close(); prev?.focus?.(); resolve(v) }
      dialog.onclose = () => resolve(null)
      wire(dialog, done)
      dialog.showModal()
      dialog.querySelector('[autofocus], input, button')?.focus()
    })
  }
  function confirmDialog(title, reasons) {
    return openModal(`<form method="dialog" class="dlab-modal"><h3>${esc(title)}</h3><ul>${reasons.map(r => `<li>${esc(r)}</li>`).join('')}</ul><div class="dlab-row"><button value="cancel" class="dlab-btn dlab-btn--ghost">Hủy</button><button value="ok" class="dlab-btn dlab-btn--warn" autofocus>Tôi hiểu, tiếp tục</button></div></form>`,
      (d, done) => d.querySelectorAll('button').forEach(b => b.addEventListener('click', e => { e.preventDefault(); done(b.value === 'ok') })))
  }
  function askNumber(title, value, min, max) {
    return openModal(`<form class="dlab-modal"><h3>${esc(title)}</h3><input type="number" class="dlab-in" step="any" min="${min}" max="${max}" value="${value}" aria-label="${esc(title)}" autofocus><div class="dlab-row"><button type="button" value="cancel" class="dlab-btn dlab-btn--ghost">Hủy</button><button type="submit" class="dlab-btn">Đồng ý</button></div></form>`,
      (d, done) => {
        d.querySelector('form').addEventListener('submit', e => { e.preventDefault(); const v = Number(d.querySelector('input').value); done(Number.isFinite(v) && v > 0 ? v : null) })
        d.querySelector('[value="cancel"]').addEventListener('click', () => done(null))
      })
  }
  function askText(title, value) {
    return openModal(`<form class="dlab-modal"><h3>${esc(title)}</h3><input type="text" class="dlab-in" maxlength="80" value="${esc(value)}" aria-label="${esc(title)}" autofocus><div class="dlab-row"><button type="button" value="cancel" class="dlab-btn dlab-btn--ghost">Hủy</button><button type="submit" class="dlab-btn">Lưu</button></div></form>`,
      (d, done) => {
        d.querySelector('form').addEventListener('submit', e => { e.preventDefault(); done(d.querySelector('input').value.trim() || value) })
        d.querySelector('[value="cancel"]').addEventListener('click', () => done(null))
      })
  }
  function choiceDialog(title, options, { onDelete } = {}) {
    return openModal(`<div class="dlab-modal"><h3>${esc(title)}</h3><ul class="dlab-choices">${options.map(o => `<li><button type="button" class="dlab-choice" data-v="${esc(o.value)}"><strong>${esc(o.title)}</strong><span>${esc(o.sub || '')}</span></button>${o.deletable ? `<button type="button" class="dlab-btn dlab-btn--ghost" data-del="${esc(o.value)}" aria-label="Xóa ${esc(o.title)}">Xóa</button>` : ''}</li>`).join('')}</ul><div class="dlab-row"><button type="button" class="dlab-btn dlab-btn--ghost" data-v="">Đóng</button></div></div>`,
      (d, done) => d.addEventListener('click', async e => {
        const del = e.target.closest('[data-del]')
        if (del) { await onDelete?.(del.dataset.del); del.closest('li').remove(); return }
        const b = e.target.closest('[data-v]')
        if (b) done(b.dataset.v || null)
      }))
  }
  let toastTimer = null
  function toast(text, kind = 'info') {
    const t = $('.dlab-toast')
    t.textContent = text
    t.dataset.kind = kind
    t.hidden = false
    t.setAttribute('role', kind === 'danger' ? 'alert' : 'status')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => { t.hidden = true }, kind === 'danger' ? 7000 : 4500)
  }
  function announce(text) {
    live.textContent = ''
    requestAnimationFrame(() => { live.textContent = text })
  }

  // ── Boot: resume autosave if present, else a starter bench ─────────
  ;(async () => {
    try {
      const save = await loadExperiment(AUTOSAVE_ID)
      sim.load(save.state)
      sim.markInitial()
      toast('Đã khôi phục phiên làm việc trước (tự động lưu).')
    }
    catch {
      sim.load(seedSandbox())
      sim.markInitial()
    }
    setModeButtons()
    resize()
    start()
    ui.booted = true
  })()

  // Test/automation hook (read-only access + commands through the same safety path).
  window.ChemLabDynamicLab = Object.freeze({
    get state() { return sim.state },
    get ready() { return Boolean(ui.booted) },
    dispatch: (cmd, opts) => sim.dispatch(cmd, opts),
    undo: () => sim.undo(),
    reset: () => sim.reset(),
    view: () => ({ ...view }),
    surface: id => surfaceY(byId(sim.state, id)),
    markInitial: () => sim.markInitial(),
    select,
    toggle3d,
    is3d: () => ui.render3d,
    guided: () => (ui.guided ? { id: ui.guided.lab.id, done: ui.guided.done.length, total: ui.guided.lab.steps.length } : null),
    startGuided: id => { const lab = GUIDED.find(g => g.id === id); const s = createSim(1); const roles = lab.setup(s); s.state.log = []; sim.load(restore(snapshot(s.state))); sim.markInitial(); ui.mode = 'guided'; ui.guided = { lab, roles, done: [] }; setModeButtons(); return roles },
    save: name => saveExperiment({ name, state: sim.state }),
    list: () => listExperiments(),
    load: async id => { const s = await loadExperiment(id); sim.load(s.state); return true },
    worldToScreen: (x, y) => { const rect = canvas.getBoundingClientRect(); const [sx, sy] = toScreenPublic(x, y); return { x: rect.left + sx, y: rect.top + sy } }
  })
  function toScreenPublic(x, y) {
    const benchY = view.h * 0.8
    return [(x - view.x) * view.zoom + view.w / 2, benchY - (y - view.y + 90) * view.zoom]
  }
}

function template() {
  const tabs = LIB_TABS.map(t => `<button type="button" role="tab" class="dlab-tab" data-tab="${t.id}">${t.label}</button>`).join('')
  return `
  <div class="dlab-shell">
    <header class="dlab-header">
      <div class="dlab-brand"><span class="dlab-kicker">ChemLab 7.0 · Thử nghiệm</span><h2>Phòng thí nghiệm động</h2></div>
      <div class="dlab-seg" role="group" aria-label="Chế độ">
        <button type="button" class="dlab-btn" data-hd="sandbox" aria-pressed="true">Sandbox</button>
        <button type="button" class="dlab-btn" data-hd="guided" aria-pressed="false">Guided Lab</button>
      </div>
      <div class="dlab-head-actions">
        <button type="button" class="dlab-btn dlab-mobile-only" data-hd="lib" aria-controls="dlab-lib">Thư viện</button>
        <button type="button" class="dlab-btn dlab-mobile-only" data-hd="insp" aria-controls="dlab-insp">Chi tiết</button>
        <button type="button" class="dlab-btn" data-hd="save">Lưu</button>
        <button type="button" class="dlab-btn" data-hd="open">Mở</button>
        <button type="button" class="dlab-btn" data-hd="view3d" aria-pressed="false">Xem 3D</button>
        <button type="button" class="dlab-btn" data-hd="quality">Đồ họa: Cao</button>
        <button type="button" class="dlab-btn" data-hd="full">Toàn màn hình</button>
        <button type="button" class="dlab-btn dlab-btn--accent" data-hd="ai">Hỏi ChemAI</button>
      </div>
    </header>
    <aside class="dlab-lib" id="dlab-lib" aria-label="Thư viện dụng cụ và hóa chất">
      <button type="button" class="dlab-btn dlab-btn--ghost dlab-mobile-only dlab-close" data-close="lib">Đóng thư viện</button>
      <input type="search" class="dlab-search dlab-in" placeholder="Tìm dụng cụ, hóa chất…" aria-label="Tìm trong thư viện">
      <div class="dlab-tabs" role="tablist" aria-label="Nhóm">${tabs}</div>
      <ul class="dlab-lib-list"></ul>
    </aside>
    <main class="dlab-stage">
      <canvas class="dlab-canvas" tabindex="0" role="application" aria-label="Bàn thí nghiệm. Chọn vật trong danh sách bên phải; phím mũi tên di chuyển, [ ] nghiêng, Enter thao tác chính, Ctrl+Z hoàn tác, Space tạm dừng."></canvas>
      <div class="dlab-3d" hidden></div>
      <section class="dlab-guided" hidden aria-label="Hướng dẫn thực hành"></section>
      <div class="dlab-toast" hidden></div>
    </main>
    <aside class="dlab-side" id="dlab-insp" aria-label="Thông tin vật đang chọn">
      <button type="button" class="dlab-btn dlab-btn--ghost dlab-mobile-only dlab-close" data-close="insp">Đóng chi tiết</button>
      <div class="dlab-inspector"></div>
      <h3 class="dlab-log-title">Quan sát</h3>
      <ol class="dlab-log"></ol>
    </aside>
    <footer class="dlab-toolbar" aria-label="Điều khiển thời gian">
      <button type="button" class="dlab-btn" data-tb="play" aria-pressed="false">Tạm dừng</button>
      <div class="dlab-seg" role="group" aria-label="Tốc độ mô phỏng">${SPEEDS.map(s => `<button type="button" class="dlab-btn" data-speed="${s}" aria-pressed="${s === 1}">${String(s).replace('.', ',')}×</button>`).join('')}</div>
      <span class="dlab-time" aria-live="off">t = 0:00</span>
      <button type="button" class="dlab-btn" data-tb="undo">Hoàn tác</button>
      <button type="button" class="dlab-btn" data-tb="reset">Đặt lại</button>
      <button type="button" class="dlab-btn" data-tb="cleanup">Dọn dẹp</button>
    </footer>
    <dialog class="dlab-dialog"></dialog>
    <div class="dlab-live sr-only" aria-live="polite"></div>
  </div>`
}
