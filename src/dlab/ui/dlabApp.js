// ChemLab 7.0 Dynamic Laboratory — workspace UI and interaction controller.
import { describe } from '../engine/domain.js'
import './dlab.css'
import { createSim, SPEEDS, snapshot, restore, carry } from '../engine/sim.js'
import { EQUIPMENT, CAPABILITIES } from '../data/equipment.js'
import { REAGENTS, REAGENT_BY_ID, HAZARD_LABELS, IONS, PRECIPITATES, LIQUIDS, INDICATORS, molarMass } from '../data/materials.js'
import { byId, isContainer, volumeOf, containerAt, containerBelow, surfaceY, label as objLabel } from '../engine/processes.js'
import { createView, render, toWorld, toScreen, hit, bounds } from './render2d.js'
import { icon, iconFor } from './icons.js'
import { LIB_SHELVES, shelfOf, TOOLS, libraryItems, searchLibrary } from './library.js'
import { observe } from './observations.js'
import { objectTitle, solidName } from './labels.js'
import { GUIDED } from '../guided.js'
import { DISCOVER } from '../data/manifest.js'
import { saveExperiment, listExperiments, loadExperiment, deleteExperiment, AUTOSAVE_ID } from '../persistence.js'
import { IDEAL_I_LIMIT } from '../engine/chemistry.js'
import { assess } from '../engine/safety.js'

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const num = (x, d = 2) => Number(x).toLocaleString('vi-VN', { maximumFractionDigits: d })
const sub = f => String(f || '').replace(/(\d+)/g, d => [...d].map(ch => '₀₁₂₃₄₅₆₇₈₉'[ch]).join('')).replace(/\^?(\d?)([+-])$/, '$1$2')

export function initDynamicLab(host) {
  if (!host || host.dataset.ready) return
  host.dataset.ready = '1'
  const sim = createSim(Date.now() >>> 0)
  const view = createView()
  const ui = { selected: null, hover: null, held: null, shelf: 'tools', group: 'all', query: '', theme: document.documentElement.dataset.theme === 'light' ? 'light' : 'dark', highlight: [], mode: 'sandbox', guided: null, render3d: false, quality: 'high', dirty: false, sideTab: 'obs' }
  host.innerHTML = template()
  host.classList.add('dlab')
  // Drawers start open only where they leave the bench wide enough; on tablets/phones they are sheets.
  // Same breakpoint as dlab.css: below it the drawers are bottom sheets over the bench.
  const wideMQ = window.matchMedia('(min-width: 1100px)')
  const wideLayout = () => wideMQ.matches
  if (wideLayout()) {
    const w = host.getBoundingClientRect().width
    host.classList.add('dlab--show-lib')
    if (w >= 1240) host.classList.add('dlab--show-side')
  }
  const $ = sel => host.querySelector(sel)
  const canvas = $('.dlab-canvas')
  const ctx = canvas.getContext('2d', { alpha: false }) // opaque: the compositor need not blend it with the page
  const stage = $('.dlab-stage')
  const live = $('.dlab-live')
  const items = libraryItems()
  let three = null

  // ── Layout & rendering loop ────────────────────────────────────────
  // Stage area covered by floating drawers, action bar and dock; framing keeps objects out of it.
  function insets() {
    const r = stage.getBoundingClientRect()
    const cover = el => {
      if (!el || el.offsetParent === null || el.hidden) return null
      const b = el.getBoundingClientRect()
      return b.width && b.height ? b : null
    }
    const out = { l: 0, r: 0, t: 0 }
    if (wideLayout()) {
      const lib = host.classList.contains('dlab--show-lib') && cover($('.dlab-lib'))
      const side = host.classList.contains('dlab--show-side') && cover($('.dlab-side'))
      if (lib) out.l = lib.right - r.left
      if (side) out.r = r.right - side.left
    }
    const bar = cover($('.dlab-actionbar'))
    out.t = bar ? Math.min(r.height * 0.3, bar.bottom - r.top) : 0
    return out
  }

  function resize() {
    const rect = stage.getBoundingClientRect()
    const oldW = view.w, oldH = view.h
    view.w = Math.max(200, rect.width)
    view.h = Math.max(240, rect.height)
    // A small height change (step strip, help text): shift the view so the bench stays where it was on the
    // page instead of jumping under the pointer. A large change or a new width is a new layout: frame again.
    const oldTop = ui.stageTop
    ui.stageTop = rect.top + window.scrollY
    if (oldW && Math.abs(view.w - oldW) < 1 && view.h !== oldH) {
      if (Math.abs(view.h - oldH) <= 160 && oldTop != null) view.y -= ((ui.stageTop - oldTop) + 0.8 * (view.h - oldH)) / view.zoom
      else if (!ui.userView) ui.framePending = true
    }
    else if (oldW && Math.abs(view.w - oldW) >= 1 && !ui.userView) ui.framePending = true
    view.dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.round(view.w * view.dpr)
    canvas.height = Math.round(view.h * view.dpr)
    canvas.style.width = `${view.w}px`
    canvas.style.height = `${view.h}px`
    if (ui.framePending) flushFrame()
    else maybeFit()
    draw()
  }

  // Frame what is on the bench so small things (a sodium piece, precipitate grains) stay visible.
  // Zooming or panning by hand turns this off until "Vừa khung" is pressed.
  function fitView() {
    const objs = sim.state.objects
    const ins = insets()
    const freeW = Math.max(160, view.w - ins.l - ins.r)
    const top = Math.max(ins.t, 8) + 14
    view.ox = (ins.l - ins.r) / 2
    view.y = 90
    if (!objs.length) { view.zoom = Math.max(0.6, Math.min(2.2, freeW / 420, view.h / 300)); view.x = 430; return }
    let x0 = Infinity, x1 = -Infinity, y1 = 0
    for (const o of objs) { const b = bounds(o, sim.state); x0 = Math.min(x0, b.x0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1) }
    const zx = freeW * 0.88 / Math.max(160, x1 - x0 + 50)
    const zy = (view.h * 0.8 - top) / Math.max(110, y1 + 60) // head-room: a vessel lifted to pour stays in view
    view.zoom = Math.max(0.55, Math.min(3, zx, zy))
    view.x = (x0 + x1) / 2
  }
  // Framing policy: the 2D view does not move under the student's pointer. A new bench (lab start, load,
  // reset) is framed once; afterwards the view changes by itself only when something on the bench would
  // be hidden behind a drawer or the action bar or cut off at the edge, never during a drag and never
  // within 900 ms of pointer activity (it waits). "Vừa khung" always re-frames; zooming by hand turns it off.
  function hiddenObject() {
    const ins = insets()
    const left = ins.l + 2, right = view.w - ins.r - 2, top = ins.t + 2
    return sim.state.objects.some(o => {
      if (o.type === 'solid' && (o.in || o.holder)) return false // drawn with their vessel or tool
      const b = bounds(o, sim.state)
      const [x0, y0] = toScreen(view, b.x0, b.y1)
      const [x1] = toScreen(view, b.x1, b.y0)
      return x0 < left || x1 > right || y0 < top
    })
  }
  let fitTimer = 0
  function maybeFit(now = false) {
    clearTimeout(fitTimer)
    if (ui.userView) return
    const idle = performance.now() - (ui.lastPointer || 0)
    if (drag || (!now && idle < 900)) { fitTimer = setTimeout(maybeFit, drag ? 400 : 920 - idle); return }
    if (hiddenObject()) fitView()
  }
  function loadSim(state) { ui.userView = false; ui.framePending = true; sim.load(state) }
  function resetSim() { ui.userView = false; ui.framePending = true; if (ui.guided) { ui.guided.done = []; ui.guided.doneH = [] } sim.reset() }
  function flushFrame() { if (ui.framePending && !drag) { ui.framePending = false; fitView() } }
  function reframe() { if (ui.framePending) flushFrame(); else maybeFit(); three?.reframe?.(insets()) }
  new ResizeObserver(resize).observe(stage)
  for (const ev of ['pointerdown', 'pointermove', 'wheel']) stage.addEventListener(ev, () => { ui.lastPointer = performance.now() }, { capture: true, passive: true })

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
    watchFrameRate(dt)
    frame = requestAnimationFrame(loop)
  }
  // A slow machine (no GPU, busy CPU): if frames stay under 25 fps for 4 s at "Cao" and the student never picked
  // a quality, switch once to "Tiết kiệm" and say so. Only the drawing changes; the chemistry is the same.
  const pace = { n: 0, sum: 0 }
  function watchFrameRate(dt) {
    if (ui.qualityChosen || ui.quality !== 'high') return
    // Not a measure of drawing: fast-forward runs many model steps per frame, and a stall (3D loading, a dialog,
    // a throttled background window) is one long gap. Either restarts the 4 s window.
    if (ui.ffwd || dt > 0.5) { pace.n = pace.sum = 0; return }
    pace.n += 1
    pace.sum += dt
    if (pace.sum < 4) return
    const fps = pace.n / pace.sum
    pace.n = pace.sum = 0
    if (fps >= 25) return
    ui.quality = 'low' // not ui.autoLow: that flag means "no GPU found" and drives the 3D message
    const qb = $('[data-hd="quality"]')
    if (qb) qb.textContent = 'Đồ họa: Tiết kiệm'
    // The 2D drawing follows ui.quality at once; an open 3D view is left as it is (its own setting is saved, and
    // 3D already starts in economy on a machine without a GPU).
    toast(`Máy đang chạy chậm (khoảng ${Math.round(fps)} khung hình/giây) nên đã chuyển sang “Đồ họa: Tiết kiệm”. Kết quả thí nghiệm không đổi; đổi lại ở menu ⋯.`)
  }
  function start() {
    if (frame == null && visible()) { last = performance.now(); frame = requestAnimationFrame(loop) }
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) autosave(); start() })
  window.addEventListener('chemlab:view-change', () => setTimeout(start, 0))
  new IntersectionObserver(() => start()).observe(host)

  // Magnifier: a real sodium piece is ~3 mm, so the vessel where a reaction runs is also drawn ×3
  // in a corner inset (same renderer, same state — a closer camera, not a bigger object).
  const loupe = $('.dlab-loupe')
  const loupeCtx = loupe.querySelector('canvas').getContext('2d')
  const loupeView = createView()
  function drawLoupe() {
    const st = sim.state
    const c = ui.loupeOff ? null : st.objects.find(o => isContainer(o) && !o.stock && Object.values(o.activeReactions || {}).some(t => st.t - t < 1.5))
    if (c) ui.loupeId = c.id
    const target = byId(st, ui.loupeId)
    const show = !ui.render3d && !ui.loupeOff && target && isContainer(target) && Object.values(target.activeReactions || {}).some(t => st.t - t < 6)
    loupe.hidden = !show
    if (!show) return
    const def = EQUIPMENT[target.type]
    const cv = loupe.querySelector('canvas')
    const size = cv.clientWidth || 220
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    if (cv.width !== Math.round(size * dpr)) { cv.width = cv.height = Math.round(size * dpr) }
    Object.assign(loupeView, { w: size, h: size, dpr, ox: 0, zoom: Math.min(3.2 * view.zoom, size * 0.8 / Math.max(def.w, def.h)) })
    loupeView.x = target.x
    loupeView.y = target.y + def.h / 2 + 90 - (0.3 * size) / loupeView.zoom
    if (loupeView.zoom / view.zoom < 1.5) { loupe.hidden = true; return } // the bench view is already close enough
    // Never cover what is on the bench: when the inset would hide an object, leave it out.
    const lr = loupe.getBoundingClientRect()
    const cr = canvas.getBoundingClientRect()
    const covers = st.objects.some(o => {
      if (o.type === 'solid' && o.in) return false
      const b = bounds(o, st)
      const [x0, y0] = toScreen(view, b.x0, b.y1)
      const [x1, y1] = toScreen(view, b.x1, b.y0)
      return cr.left + x1 > lr.left && cr.left + x0 < lr.right && cr.top + y1 > lr.top && cr.top + y0 < lr.bottom
    })
    if (covers) { loupe.hidden = true; return }
    render(loupeCtx, st, loupeView, { ...ui, selected: null, hover: null, held: null, highlight: [] })
    loupe.querySelector('.dlab-loupe-x').textContent = `×${num(loupeView.zoom / view.zoom, 1)}`
  }
  loupe.addEventListener('click', e => { if (e.target.closest('[data-loupe-close]')) { ui.loupeOff = true; loupe.hidden = true } })

  function draw() {
    ui.theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
    const selTool = byId(sim.state, ui.selected)
    ui.grabbable = selTool?.type === 'tongs' && !selTool.load ? sim.state.objects.filter(grabbable).map(o => o.id) : []
    if (!ui.render3d) { render(ctx, sim.state, view, ui); drawLoupe() }
    else loupe.hidden = true
    paintLabels()
    paintToolbar()
    if (++ui.tick % 6 === 0 || ui.forcePanel) { paintInspector(); paintObservations(); paintGuided(); paintActions(); ui.forcePanel = false }
  }
  ui.tick = 0

  ui.objCount = -1
  sim.subscribe(() => {
    ui.dirty = true
    ui.forcePanel = true
    const n = sim.state.objects.length
    // A new bench (or the first things put on an empty one) is framed after layout settles (drawers that
    // open with a lab are measured); later additions only re-frame if something would be hidden.
    // Something new on the bench is what the student just asked for: if it is out of view, frame it now
    // (not during a drag). Passive changes (panels, the action bar) wait for the pointer to rest.
    if (n !== ui.objCount) { const added = n > ui.objCount; if (ui.objCount === 0 && n) ui.framePending = true; ui.objCount = n; if (!ui.framePending) maybeFit(added) }
    // Framed at once (what is on the bench is known now) and once more after layout, when drawers that
    // open with a lab have been measured.
    if (ui.framePending && !drag) { fitView(); requestAnimationFrame(flushFrame) }
  })

  // ── Library ────────────────────────────────────────────────────────
  function paintLibrary() {
    // Search covers both shelves; otherwise the current shelf, one group or all groups under headings.
    const found = searchLibrary(items, ui.query)
    const shelf = LIB_SHELVES.find(s => s.id === ui.shelf)
    const groups = found ? [{ id: null, label: null, list: found }] : shelf.groups.filter(g => ui.group === 'all' || g.id === ui.group).map(g => ({ ...g, list: items.filter(it => it.tab === g.id) }))
    const row = it => `<li><button type="button" class="dlab-lib-item" data-key="${esc(it.key)}" title="Bấm để lấy ra bàn, hoặc kéo thả vào bàn/cốc">
        <span class="dlab-lib-icon">${iconFor(it)}</span><span class="dlab-lib-text"><span class="dlab-lib-name">${esc(it.name)}</span><span class="dlab-lib-sub">${esc(found ? `${shelfOf(it.tab).label} · ${it.sub}` : it.sub)}</span></span>
      </button></li>`
    const html = groups.map(g => {
      const seen = new Set()
      const list = g.list.filter(it => { const k = it.type || it.reagent; return !seen.has(k) && seen.add(k) })
      return list.length ? `${g.label && ui.group === 'all' ? `<li class="dlab-lib-group">${esc(g.label)}</li>` : ''}${list.map(row).join('')}` : ''
    }).join('')
    $('.dlab-lib-list').innerHTML = html || '<li class="dlab-empty">Không tìm thấy mục phù hợp. Thử tên khác, ví dụ “nước”, “natri”, “cốc”, “CuSO4”.</li>'
    host.querySelectorAll('.dlab-shelf').forEach(b => b.setAttribute('aria-selected', String(!found && b.dataset.shelf === ui.shelf)))
    $('.dlab-groups').innerHTML = found ? `<span class="dlab-lib-count">${found.length} kết quả trong cả tủ và kệ</span>` : [{ id: 'all', label: 'Tất cả' }, ...shelf.groups].map(g => `<button type="button" class="dlab-chip" data-group="${g.id}" aria-pressed="${ui.group === g.id}">${g.label}</button>`).join('')
  }
  host.querySelector('.dlab-shelves').addEventListener('click', e => {
    const b = e.target.closest('.dlab-shelf')
    if (!b) return
    ui.shelf = b.dataset.shelf
    ui.group = 'all'
    ui.query = ''
    $('.dlab-search').value = ''
    paintLibrary()
    $('.dlab-lib-list').scrollTop = 0
  })
  host.querySelector('.dlab-groups').addEventListener('click', e => {
    const b = e.target.closest('.dlab-chip')
    if (!b) return
    ui.group = b.dataset.group
    paintLibrary()
    $('.dlab-lib-list').scrollTop = 0
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
      // New equipment rests on the bench (no floating tools) unless it was dropped over a vessel.
      const over = at && containerBelow(sim.state, at.x, at.y + 40)
      if (it.type === 'litmusPaper') {
        const r = sim.dispatch({ type: 'newLitmus', x: at?.x ?? freeX() })
        byId(sim.state, r.id).y = over ? Math.max(0, at.y) : 0
        return select(r.id)
      }
      const tool = TOOLS.includes(it.type)
      const r = sim.dispatch({ type: 'add', equipmentType: it.type, x: at?.x ?? freeX(), y: tool && over ? Math.max(0, at.y) : 0 })
      if (!tool) sim.dispatch({ type: 'move', id: r.id, x: byId(sim.state, r.id).x, y: 0 }, { record: false })
      return select(r.id)
    }
    const reagent = REAGENT_BY_ID[it.reagent]
    if (reagent.kind === 'solid') {
      let target = at ? containerAt(sim.state, at.x, at.y + 2) || containerBelow(sim.state, at.x, at.y + 200) : selectedContainer()
      if (!target) {
        // No vessel chosen: use the only vessel with liquid, or ask which one.
        const wet = vessels().filter(c => volumeOf(c) > 0.5)
        const pool = wet.length ? wet : vessels()
        if (pool.length === 1) target = pool[0]
        else if (pool.length > 1) return chooseVessel(`Thả ${reagent.name} vào đâu?`, pool).then(c => c && addSolidWithTool(reagent, c))
        else return toast(`Cần một cốc hoặc ống nghiệm trên bàn trước khi thêm ${reagent.name}.`)
      }
      return addSolidWithTool(reagent, target)
    }
    const r = sim.dispatch({ type: 'add', equipmentType: 'bottle', reagent: reagent.id, x: at?.x ?? freeX() })
    select(r.id)
  }

  // Usable, non-stock vessels on the bench, nearest to x first.
  // Vessels to offer as a target. In a guided step the step's own target vessels (by object id) come
  // first, so every "Rót/Nhỏ/Thả vào" list defaults to the right vessel; then the nearest ones.
  function vessels(x = view.x, exclude = null) {
    const step = ui.guided && ui.guided.lab.steps[ui.guided.done.length]
    const want = new Set((step?.target || []).map(r => ui.guided.roles[r]))
    return sim.state.objects.filter(c => isContainer(c) && !c.stock && c.id !== exclude && c.condition !== 'UNUSABLE')
      .sort((a, b) => want.has(b.id) - want.has(a.id) || Math.abs(a.x - x) - Math.abs(b.x - x))
  }
  function chooseVessel(title, pool) {
    return choiceDialog(title, pool.map(c => ({ value: c.id, title: objLabel(c), sub: volumeOf(c) > 0.05 ? `${num(volumeOf(c), 1)} mL${c.pH != null ? ` · pH ${num(c.pH, 1)}` : ''}` : 'đang trống' }))).then(id => id && byId(sim.state, id))
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
    // Put the tool back on the bench beside the vessel and keep the vessel in focus for observing.
    sim.dispatch({ type: 'move', id: tool.id, x: container.x + EQUIPMENT[container.type].w / 2 + 22, y: 0 }, { record: false })
    select(container.id)
  }

  host.querySelector('.dlab-lib-list').addEventListener('click', e => {
    const b = e.target.closest('.dlab-lib-item')
    if (b && !ui.libDragged) {
      takeFromLibrary(b.dataset.key)
      // On phones the sheet covers the bench: close it so the student sees the result.
      if (!wideLayout()) toggleDrawer('lib', false)
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
    if (c) toggleDrawer(c.dataset.close, false)
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
    if (o) announce(`Đã chọn ${o.type === 'solid' ? solidName(o) : objLabel(o)}`)
    if (o?.type === 'tongs' && !o.load) once('chemlab-dlab-tip-tongs', () => toast('Kẹp hóa chất: bấm vào mẩu chất rắn có viền nét đứt để gắp, kéo kẹp tới cốc hoặc ra bàn rồi thả chuột để đặt xuống. Các nút trên thanh phía trên làm được việc tương tự.'))
    draw()
  }
  function once(key, fn) {
    let seen = false
    try { seen = localStorage.getItem(key) === '1'; localStorage.setItem(key, '1') } catch {}
    if (!seen) fn()
  }

  // ── Canvas interaction ─────────────────────────────────────────────
  const pointers = new Map()
  let drag = null
  function pick(x, y) {
    const st = sim.state
    const objs = st.objects
    // Small pieces win over the vessel around them (a nail in a beaker would otherwise be unreachable);
    // their target is at least ~12 px on screen whatever the zoom. A held piece is picked via its tool.
    const pad = Math.max(3, 12 / view.zoom)
    for (let i = objs.length - 1; i >= 0; i -= 1) {
      const o = objs[i]
      if (o.type === 'solid' && !o.holder && o.massG > 0 && hit(o, x, y, st, pad)) return o
    }
    for (let i = objs.length - 1; i >= 0; i -= 1) {
      const o = objs[i]
      if (o.type !== 'solid' && hit(o, x, y)) return o
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
    const o = pick(x, y)
    if (!o) { drag = { pan: true, sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y }; select(null); return }
    beginDrag(o, x, y)
  })
  // Interaction Controller shared by the 2D canvas and the 3D view: both map the pointer to world
  // (x, y) on the bench plane and end in the same simulation commands.
  function beginDrag(o, x, y) {
    const prev = byId(sim.state, ui.selected)
    if (o.type === 'solid' && o.holder) o = byId(sim.state, o.holder) || o
    if (o.type === 'solid' && grabbable(o)) {
      // Tongs already chosen: this click grabs the piece. Otherwise select it; dragging it then
      // picks it up with a free pair of tongs, the way it is done on a real bench.
      if (prev?.type === 'tongs' && !prev.load) return startGrab(prev, o, x, y)
      if (o.in) { select(o.id); drag = { grabPending: o.id, sx: x, sy: y }; host.classList.add('dlab--dragging'); return true }
    }
    select(o.id)
    if (o.type === 'solid' && o.in) return false
    if (o.condition === 'UNUSABLE') return false
    sim.record()
    drag = { id: o.id, dx: o.x - x, dy: o.y - y, start: { x: o.x, y: o.y, angle: o.angle }, moved: false }
    if (isContainer(o)) o.held = true
    ui.held = o.id
    host.classList.add('dlab--dragging') // overlays step aside so the lifted vessel and the wheel stay on the bench
    return true
  }
  function dragTo(x, y) {
    if (drag?.grabPending) {
      if (Math.hypot(x - drag.sx, y - drag.sy) < 4) return
      const s = byId(sim.state, drag.grabPending)
      drag = null
      const tongs = freeTongs(s)
      if (!s || !tongs || !startGrab(tongs, s, x, y)) host.classList.remove('dlab--dragging')
      return
    }
    const o = drag?.id && byId(sim.state, drag.id)
    if (!o) return
    const nx = x + drag.dx
    const ny = Math.max(0, y + drag.dy)
    if (o.type === 'rod') o.stroke = (o.stroke || 0) + Math.hypot(nx - o.x, ny - o.y)
    o.x = nx
    o.y = ny
    drag.moved = true
    carry(sim.state) // a held piece follows the tool even while the simulation is paused
    ui.drop = dropTargetFor(o)
  }
  // Where a carried load would go if released now (shared by 2D and 3D): the vessel and whether the
  // same safety rules as the release command allow it. Nothing to show for an empty tool.
  function dropTargetFor(o) {
    const st = sim.state
    if ((o.type === 'tongs' || o.type === 'spatula') && o.load) {
      const c = containerAt(st, o.x, o.y + 1) || containerBelow(st, o.x, o.y + 40)
      if (!c) return null
      const v = assess(st, { type: 'release', tool: o.id })
      return { id: c.id, ok: v.level !== 'block', reason: v.level === 'block' ? v.reasons[0] : '' }
    }
    if ((o.type === 'dropper' || o.type === 'pipette') && volumeOf({ contents: o.contents }) > 0) {
      const c = containerAt(st, o.x, o.y - 2) || containerBelow(st, o.x, o.y)
      return c ? { id: c.id, ok: true, reason: '' } : null
    }
    return null
  }

  // Pieces tongs can pick up: real objects that still exist (not used up) and are not held already.
  function grabbable(s) {
    return s?.type === 'solid' && !s.holder && s.massG > 0 && REAGENT_BY_ID[s.reagent].tool === 'tongs' && !(s.reagent === 'na' && s.in) // reacting sodium stays put
  }
  // Tongs to use: the selected pair if empty, else a free pair on the bench, else a new pair (not recorded
  // separately: it belongs to the same undo step as the grab).
  function freeTongs(near) {
    const sel = byId(sim.state, ui.selected)
    if (sel?.type === 'tongs' && !sel.load) return sel
    const free = sim.state.objects.filter(o => o.type === 'tongs' && !o.load).sort((a, b) => Math.abs(a.x - near.x) - Math.abs(b.x - near.x))[0]
    return free || byId(sim.state, sim.dispatch({ type: 'add', equipmentType: 'tongs', x: near.x + 30, y: 0 }, { record: false }).id)
  }
  // Grab `s` with `tongs` (one undo step), lift it just above the rim, and keep dragging the tongs if a
  // pointer is down (x, y given). Returns false, with the reason shown, when the grab is not allowed.
  function startGrab(tongs, s, x = null, y = null) {
    const from = s.in && byId(sim.state, s.in)
    sim.record()
    const r = sim.dispatch({ type: 'grab', tool: tongs.id, id: s.id }, { record: false })
    if (!r.ok) {
      sim.history.pop()
      toast(`Không gắp được: ${r.verdict.reasons.join(' ')}`, 'danger')
      select(s.id)
      return false
    }
    tongs.x = s.x
    tongs.y = from ? from.y + EQUIPMENT[from.type].h + 8 : s.y + 12
    carry(sim.state)
    select(tongs.id)
    announce(`Kẹp đang giữ ${solidName(s)}`)
    if (x == null) return true
    // moved: false — a plain click keeps the piece held above the rim; only a drag carries it elsewhere.
    drag = { id: tongs.id, dx: tongs.x - x, dy: tongs.y - y, start: { x: tongs.x, y: tongs.y, angle: 0 }, moved: false, recorded: true }
    ui.held = tongs.id
    host.classList.add('dlab--dragging')
    return true
  }
  // A clear spot on the bench near x (no vessel underneath), for putting a piece down.
  function benchSpot(x, skip) {
    const st = sim.state
    const clear = p => !containerAt(st, p, 1) && !containerBelow(st, p, 40) && !st.objects.some(o => o.id !== skip && o.type !== 'solid' && Math.abs(o.x - p) < (EQUIPMENT[o.type]?.w || 10) / 2 + 14)
    for (let d = 40; d < 400; d += 10) for (const p of [x + d, x - d]) if (clear(p)) return p
    return x + 60
  }
  // Put what the tongs hold on the bench (same release command as dropping into a vessel).
  async function putDown(tongs) {
    const s = tongs.load?.id && byId(sim.state, tongs.load.id)
    const at = benchSpot(tongs.x, tongs.id)
    sim.record()
    sim.dispatch({ type: 'move', id: tongs.id, x: at, y: 0 }, { record: false })
    const r = await run({ type: 'release', tool: tongs.id }, { record: false })
    if (!r) { sim.history.pop(); return null }
    sim.dispatch({ type: 'move', id: tongs.id, x: at + 22, y: 0 }, { record: false })
    if (s) select(s.id)
    return r
  }
  function tiltHeld(deltaY) {
    const o = drag?.id && byId(sim.state, drag.id)
    if (!o || !isContainer(o)) return false
    o.angle = Math.max(-2.2, Math.min(2.2, o.angle + Math.sign(deltaY) * 0.08))
    return true
  }
  async function endObjectDrag() {
    if (drag?.grabPending) { drag = null; host.classList.remove('dlab--dragging'); return }
    const d = drag
    drag = null
    ui.held = null
    ui.drop = null
    host.classList.remove('dlab--dragging')
    if (d?.id) await finishDrag(d)
  }
  canvas.addEventListener('pointermove', e => {
    const rect = canvas.getBoundingClientRect()
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX - rect.left, y: e.clientY - rect.top })
    if (!drag) {
      if (e.pointerType === 'mouse') {
        const [hx, hy] = toWorld(view, e.clientX - rect.left, e.clientY - rect.top)
        const h = pick(hx, hy)
        ui.hover = h?.id ?? null
        canvas.style.cursor = h ? 'grab' : ''
      }
      return
    }
    canvas.style.cursor = drag.id ? 'grabbing' : 'move'
    if (drag.pinch) { if (pointers.size === 2) { view.zoom = clampZoom(drag.zoom * pinchDist() / drag.dist); ui.userView = true } return }
    if (drag.pan) { ui.userView = true; view.x = drag.vx - (e.clientX - drag.sx) / view.zoom; view.y = drag.vy + (e.clientY - drag.sy) / view.zoom; return }
    const [x, y] = toWorld(view, e.clientX - rect.left, e.clientY - rect.top)
    dragTo(x, y)
  })
  const endDrag = async e => {
    pointers.delete(e.pointerId)
    if (!drag) return
    if (drag.pan || drag.pinch) { drag = null; return }
    await endObjectDrag()
  }
  async function finishDrag(d) {
    const o = byId(sim.state, d.id)
    if (!o) return
    o.held = false
    const wasTilted = o.angle !== 0
    if (isContainer(o)) o.angle = 0
    if (!d.moved && !wasTilted) { if (!d.recorded) sim.history.pop(); return }
    const r = sim.dispatch({ type: 'move', id: o.id, x: o.x, y: o.y }, { record: false })
    if (r.needsConfirm) {
      if (await confirmDialog('Cảnh báo an toàn', r.verdict.reasons)) sim.dispatch({ type: 'move', id: o.id, x: o.x, y: o.y }, { record: false, confirmed: true })
      else Object.assign(o, d.start)
    }
    else if (!r.ok) { Object.assign(o, d.start); toast(r.verdict.reasons.join(' '), 'danger'); settleBack(o) }
    // A loaded tool released over (or in) a container drops its solid in; tongs let go over the bench
    // put the piece down on the bench.
    if ((o.type === 'tongs' || o.type === 'spatula') && o.load && (containerBelow(sim.state, o.x, o.y + 40) || containerAt(sim.state, o.x, o.y + 1))) await run({ type: 'release', tool: o.id }, { record: false })
    else if (o.type === 'tongs' && o.load) {
      const s = byId(sim.state, o.load.id)
      if (await run({ type: 'release', tool: o.id }, { record: false })) { sim.dispatch({ type: 'move', id: o.id, x: o.x + 22, y: 0 }, { record: false }); if (s) select(s.id) }
    }
    // A tool let go in mid-air (not in or over a vessel) comes to rest on the bench instead of floating.
    if (TOOLS.includes(o.type) && o.y > 0 && !o.load && !containerAt(sim.state, o.x, o.y + 1) && !containerBelow(sim.state, o.x, o.y + 40)) sim.dispatch({ type: 'move', id: o.id, x: o.x, y: 0 }, { record: false })
  }
  function settleBack(o) { sim.dispatch({ type: 'move', id: o.id, x: o.x, y: o.y }, { record: false }) }
  canvas.addEventListener('pointerleave', () => { ui.hover = null })
  canvas.addEventListener('pointerup', endDrag)
  canvas.addEventListener('pointercancel', endDrag)
  canvas.addEventListener('wheel', e => {
    e.preventDefault()
    if (drag?.id) { tiltHeld(e.deltaY); return }
    const rect = canvas.getBoundingClientRect()
    const [wx, wy] = toWorld(view, e.clientX - rect.left, e.clientY - rect.top)
    view.zoom = clampZoom(view.zoom * (e.deltaY < 0 ? 1.1 : 0.9))
    ui.userView = true
    const [nx, ny] = toWorld(view, e.clientX - rect.left, e.clientY - rect.top)
    view.x += wx - nx
    view.y += wy - ny
  }, { passive: false })
  function pinchDist() { const [a, b] = [...pointers.values()]; return Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)) }
  const clampZoom = z => Math.max(0.35, Math.min(4, z))

  canvas.addEventListener('keydown', onKey)
  async function onKey(e) {
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
  }

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
  function patch(el, html, keepPicks = true) {
    if (keepPicks && el.dataset.html === html) return
    // Only numbers in text may change in place; any attribute change (an option's value when the list is
    // re-ordered) rebuilds the markup, or the visible name and the real target could disagree.
    const skeleton = html.replace(/>[^<]*</g, t => t.replace(/[0-9.,:−+-]+/g, '#'))
    if (keepPicks && el.dataset.skel === skeleton) {
      const next = document.createElement('div')
      next.innerHTML = html
      const a = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      const b = document.createTreeWalker(next, NodeFilter.SHOW_TEXT)
      while (a.nextNode() && b.nextNode()) if (a.currentNode.nodeValue !== b.currentNode.nodeValue) a.currentNode.nodeValue = b.currentNode.nodeValue
    }
    else {
      // Keep what the student picked in a list (target vessel, source…) if it is still offered.
      const picked = keepPicks ? [...el.querySelectorAll('select[data-qa-in]')].map(s => [s.dataset.qaIn, s.value]) : []
      el.innerHTML = html
      el.dataset.skel = skeleton
      for (const [k, v] of picked) { const s = el.querySelector(`select[data-qa-in="${k}"]`); if (s && [...s.options].some(o => o.value === v)) s.value = v }
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
      h += `<dl class="dlab-kv"><dt>Thể tích</dt><dd>${num(vol, 1)} / ${def.capacityML} mL</dd>${o.pH != null && vol > 0.05 ? `<dt>pH</dt><dd>${num(o.pH, 2)}</dd><dt>Lực ion</dt><dd>${num(o.I || 0, 3)} M</dd>` : ''}<dt>Nhiệt độ</dt><dd>${num(o.T, 1)} °C</dd></dl>`
      if (o.pH != null && vol > 0.05 && o.I > IDEAL_I_LIMIT) h += `<p class="dlab-note" data-note="ideal">pH tính theo mô hình dung dịch lý tưởng (pH = −lg[H⁺], như SGK). Lực ion ${num(o.I, 2)} M > ${IDEAL_I_LIMIT} M nên pH đo bằng máy thật có thể lệch vài phần mười.</p>`
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
      // Alternative to dragging (small screens, keyboard): dip to a chosen depth below the surface.
      const wetTargets = st.objects.filter(x => isContainer(x) && volumeOf(x) > 0.5 && x.condition !== 'UNUSABLE')
      if (wetTargets.length) h += `<fieldset class="dlab-act"><legend>Nhúng bằng thông số</legend><div class="dlab-row"><select data-in="dip-to" aria-label="Nhúng vào">${wetTargets.map(x => `<option value="${x.id}">${esc(objLabel(x))}</option>`).join('')}</select></div><div class="dlab-row"><input type="number" class="dlab-in" data-in="dip-mm" min="2" max="60" step="2" value="10" aria-label="Độ sâu nhúng (mm)"><span>mm dưới mặt thoáng</span></div><div class="dlab-row"><button type="button" class="dlab-btn" data-act="dip">Nhúng</button><button type="button" class="dlab-btn" data-act="lift" ${o.inside ? '' : 'disabled'}>Lấy ra</button></div></fieldset>`
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
    if (act === 'dip') {
      const c = byId(sim.state, val('dip-to'))
      const depth = Math.max(2, Math.min(60, Number(val('dip-mm')) || 10))
      if (c) await run({ type: 'move', id: o.id, x: c.x, y: Math.max(c.y + 3, surfaceY(c) - depth) })
    }
    if (act === 'lift') {
      const c = byId(sim.state, o.inside)
      if (c) await run({ type: 'move', id: o.id, x: c.x, y: c.y + EQUIPMENT[c.type].h + 12 })
    }
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

  // ── Observation panel: happening now → conclusion/results → safety; journal collapsed ──
  function paintObservations() {
    const m = observe(sim.state)
    const box = $('.dlab-obs')
    let html = ''
    html += `<section class="dlab-obs-block" aria-label="Hiện tượng đang diễn ra"><h4>Đang diễn ra</h4>${m.happening.length ? `<ul class="dlab-now">${m.happening.map(h => `<li><span class="dlab-pulse" aria-hidden="true"></span><span><strong>${esc(h.where)}:</strong> ${esc(h.text)}</span></li>`).join('')}</ul>` : '<p class="dlab-hint">Chưa có phản ứng nào đang xảy ra.</p>'}</section>`
    if (m.conclusions.length) html += m.conclusions.map(c => `<section class="dlab-conclusion" aria-label="Kết luận"><h4>Kết luận</h4><p class="dlab-eq">${esc(c.equation)}</p><p>${esc(c.text)}</p>${c.facts.length ? `<ul>${c.facts.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}</section>`).join('')
    if (m.safety.length) html += `<section class="dlab-obs-block dlab-obs-safety" aria-label="Cảnh báo an toàn"><h4>An toàn</h4><ul>${m.safety.map(e => `<li class="is-${e.kind}">${esc(e.text)}</li>`).join('')}</ul></section>`
    html += `<section class="dlab-obs-block" aria-label="Kết quả quan sát"><h4>Quan sát được</h4>${m.results.length ? `<ol class="dlab-log">${m.results.map(e => `<li class="dlab-log--observe"><time>${fmtTime(e.t)}</time> ${esc(e.text)}</li>`).join('')}</ol>` : '<p class="dlab-hint">Hiện tượng quan sát được sẽ ghi ở đây.</p>'}</section>`
    html += `<details class="dlab-journal"${ui.journalOpen ? ' open' : ''}><summary>Nhật ký thao tác (${m.journal.length})</summary><ol class="dlab-log">${m.journal.slice(0, 40).map(e => `<li class="dlab-log--${e.kind}"><time>${fmtTime(e.t)}</time> ${esc(e.text)}${e.n > 1 ? ` <span class="dlab-count">×${e.n}</span>` : ''}</li>`).join('') || '<li class="dlab-empty">Chưa có thao tác nào.</li>'}</ol></details>`
    patch(box, html)
    // First reaction of the session: bring the observations into view (wide screens only — on phones
    // a sheet would cover the bench, so the button gets a dot instead). The library makes room if needed.
    if (m.happening.length && !ui.autoOpened && wideLayout() && !host.classList.contains('dlab--show-side')) {
      ui.autoOpened = true
      if (host.getBoundingClientRect().width < 1240) host.classList.remove('dlab--show-lib')
      openSide('obs')
    }
    const log = sim.state.log
    const newest = log[log.length - 1]
    if (newest && newest !== ui.lastAnnounced && newest.kind !== 'action') { ui.lastAnnounced = newest; announce(newest.text) }
    // Dot on the collapsed "Quan sát" button when something new is observed.
    const count = m.results.length + m.safety.length + m.conclusions.length
    if (count !== ui.obsCount) {
      if (ui.obsCount != null && !host.classList.contains('dlab--show-side')) $('[data-hd="side"]').dataset.badge = '1'
      ui.obsCount = count
    }
  }
  $('.dlab-obs').addEventListener('toggle', e => { if (e.target.matches('.dlab-journal')) ui.journalOpen = e.target.open }, true)
  const fmtTime = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`

  // ── Contextual action bar: the main operations for the selected object, no shortcuts needed ──
  const bar = $('.dlab-actionbar')
  const opt = list => list.map(c => `<option value="${c.id}">${esc(objLabel(c))}</option>`).join('')
  function paintActions() {
    if (bar.contains(document.activeElement) && document.activeElement.matches('input, select')) return
    const o = byId(sim.state, ui.selected)
    const before = bar.offsetHeight
    if (!o) {
      const hasStuff = sim.state.objects.length > 0
      bar.dataset.kind = 'hint'
      bar.dataset.owner = ''
      patch(bar, `<p class="dlab-bar-hint">${icon('help')}<span>${hasStuff ? 'Chọn một vật trên bàn để thấy các thao tác chính. Kéo vật để di chuyển.' : 'Lấy dụng cụ và hóa chất từ Thư viện để bắt đầu.'}</span></p>`)
    }
    else {
      bar.dataset.kind = o.type
      const r = o.type === 'solid' || o.stock ? REAGENT_BY_ID[o.reagent] : null
      const name = o.type === 'solid' ? solidName(o) : objLabel(o)
      const head = `<div class="dlab-bar-head">${iconFor(r ? { reagentDef: r } : { type: o.type })}<div><strong>${esc(name)}</strong><span>${esc(summary(o))}</span></div></div>`
      // A pick is kept only while the bar still belongs to the same object (never carried to another tool).
      const same = bar.dataset.owner === o.id
      bar.dataset.owner = o.id
      patch(bar, `${head}<div class="dlab-bar-acts">${quickActions(o)}<button type="button" class="dlab-btn dlab-btn--ghost" data-qa="details">Chi tiết</button></div>`, same)
    }
    if (bar.offsetHeight !== before) reframe()
  }
  function summary(o) {
    if (o.type === 'solid') return o.massG <= 0 ? 'Đã phản ứng hết' : `${num(o.massG, 3)} g${o.holder ? ' · đang được kẹp giữ' : o.in ? ` · trong ${objLabel(byId(sim.state, o.in))}` : ' · trên bàn'}`
    if (isContainer(o)) {
      const v = volumeOf(o)
      if (o.condition === 'UNUSABLE') return 'Hỏng — không dùng được'
      if (v < 0.05) return 'Đang trống'
      return `${num(v, 1)} mL${o.pH != null ? ` · pH ${num(o.pH, 1)}` : ''} · ${num(o.T, 0)} °C`
    }
    if (o.type === 'dropper' || o.type === 'pipette') { const v = volumeOf({ contents: o.contents }); return v > 0 ? `Đang chứa ${num(v, 2)} mL` : 'Đang trống' }
    if ((o.type === 'tongs' || o.type === 'spatula') && o.load) { const p = byId(sim.state, o.load.id); return `Đang giữ ${p ? solidName(p) : REAGENT_BY_ID[o.load.reagent].name} · ${num(p ? p.massG : o.load.massG, 3)} g` }
    if (o.type === 'thermometer') return `${num(o.reading ?? 25, 1)} °C`
    if (o.type === 'phMeter') return o.reading == null ? 'Nhúng vào dung dịch để đo' : `pH ${num(o.reading, 2)}`
    if (o.type === 'litmusPaper') return o.inside ? 'Đang nhúng' : 'Nhúng vào dung dịch để thử'
    return (EQUIPMENT[o.type].caps || []).map(c => CAPABILITIES[c] || c).slice(0, 2).join(' · ')
  }
  function quickActions(o) {
    if (o.condition === 'UNUSABLE') return '<button type="button" class="dlab-btn dlab-btn--accent" data-qa="replace">Lấy dụng cụ mới</button>'
    const targets = vessels(o.x, o.id)
    // A carried solid the step assigns to its own vessel (Zn → Cốc B, Cu → Cốc C) defaults to that vessel.
    const carried = o.type === 'solid' ? o.reagent : o.load?.reagent
    const step = ui.guided && ui.guided.lab.steps[ui.guided.done.length]
    const into = carried && step?.need?.find(n => n.reagent === carried && n.into)
    const home = into && targets.find(c => c.id === ui.guided.roles[into.into])
    if (home) targets.splice(targets.indexOf(home), 1), targets.unshift(home)
    if (o.type === 'solid') return pieceActions(o, targets)
    const sel = (k, list, label) => (list.length ? `<select data-qa-in="${k}" aria-label="${label}">${opt(list)}</select>` : '')
    if (isContainer(o)) {
      const vol = volumeOf(o)
      if (vol < 0.05) return '<span class="dlab-bar-note">Rót chất lỏng vào từ chai hóa chất.</span>'
      if (!targets.length) return '<span class="dlab-bar-note">Lấy thêm một cốc để rót sang.</span>'
      const reagent = o.stock && REAGENT_BY_ID[o.reagent]
      if (reagent?.kind === 'indicator') return `<span class="dlab-bar-label">Nhỏ 3 giọt vào</span>${sel('to', targets, 'Nhỏ vào')}<button type="button" class="dlab-btn dlab-btn--accent" data-qa="drops">Nhỏ</button>`
      // Default: at most half the free room of the first target (a 20 mL tube is not offered 50 mL).
      const room = Math.max(1, EQUIPMENT[targets[0].type].capacityML - volumeOf(targets[0]))
      const amount = Math.max(1, Math.round(Math.min(o.stock ? 50 : vol, o.stock ? 50 : 20, room / 2)))
      let h = `<span class="dlab-bar-label">Rót</span><input type="number" class="dlab-in" data-qa-in="ml" min="0.5" step="5" value="${amount}" aria-label="Thể tích rót (mL)"><span class="dlab-bar-label">mL vào</span>${sel('to', targets, 'Rót vào')}<button type="button" class="dlab-btn dlab-btn--accent" data-qa="pour">Rót</button>`
      if (!o.stock) h += `<label class="dlab-tilt"><span>Nghiêng tay</span><input type="range" min="0" max="110" step="5" value="${Math.round(Math.abs(o.angle) * 180 / Math.PI)}" data-qa-in="tilt" aria-label="Nghiêng cốc để rót trực tiếp (độ)"></label><button type="button" class="dlab-btn" data-qa="stir">Khuấy</button>`
      return h
    }
    const wet = targets.filter(c => volumeOf(c) > 0.5)
    if (o.type === 'dropper' || o.type === 'pipette') {
      const vol = volumeOf({ contents: o.contents })
      // Sources include reagent bottles: a dropper is filled from the stock bottle (phenolphthalein, HCl…).
      const sources = sim.state.objects.filter(c => isContainer(c) && c.condition !== 'UNUSABLE' && volumeOf(c) > 0.5).sort((a, b) => (b.id === ui.suckFrom?.[o.id]) - (a.id === ui.suckFrom?.[o.id]) || Math.abs(a.x - o.x) - Math.abs(b.x - o.x)) // the bottle used last comes first, so refilling never draws from the target beaker by default
      if (vol <= 0) return sources.length ? `<span class="dlab-bar-label">Hút từ</span>${sel('from', sources, 'Hút từ')}<button type="button" class="dlab-btn dlab-btn--accent" data-qa="suck">Hút ${suckML(o)} mL</button>` : '<span class="dlab-bar-note">Chưa có dung dịch để hút.</span>'
      const src = byId(sim.state, ui.suckFrom?.[o.id])
      const refill = vol < suckML(o) - 0.05 && src ? `<button type="button" class="dlab-btn" data-qa="refill" title="Hút lại từ ${esc(objLabel(src))}">Hút thêm</button>` : ''
      return `<span class="dlab-bar-label">Nhỏ vào</span>${sel('to', targets, 'Nhỏ vào')}<button type="button" class="dlab-btn dlab-btn--accent" data-qa="drop1">1 giọt</button><button type="button" class="dlab-btn" data-qa="drop5">5 giọt</button><button type="button" class="dlab-btn" data-qa="drop10">10 giọt</button><span class="dlab-bar-sep" aria-hidden="true"></span><input type="number" class="dlab-in" data-qa-in="dml" min="0.05" step="0.05" value="${Math.max(0.05, Math.min(0.5, Math.floor(vol * 20) / 20))}" aria-label="Thể tích cần nhỏ (mL)"><span class="dlab-bar-label">mL</span><button type="button" class="dlab-btn" data-qa="dropml">Nhỏ</button>${refill}`
    }
    if (o.type === 'tongs' || o.type === 'spatula') {
      if (o.load) return `<span class="dlab-bar-label">Thả vào</span>${sel('to', targets, 'Thả vào')}<button type="button" class="dlab-btn dlab-btn--accent" data-qa="drop-solid">Thả</button>${o.type === 'tongs' ? '<button type="button" class="dlab-btn" data-qa="put-down">Đặt lên bàn</button>' : ''}`
      let h = ''
      // Tongs: pieces already on the bench or in a vessel can be picked up again, chosen by name and place.
      const pieces = o.type === 'tongs' ? sim.state.objects.filter(grabbable) : []
      if (pieces.length) h += `<span class="dlab-bar-label">Gắp</span><select data-qa-in="piece" aria-label="Vật cần gắp">${pieces.map(p => `<option value="${p.id}">${esc(pieceWhere(p))}</option>`).join('')}</select><button type="button" class="dlab-btn dlab-btn--accent" data-qa="grab">Gắp</button><span class="dlab-bar-sep" aria-hidden="true"></span>`
      const solids = REAGENTS.filter(r => r.kind === 'solid' && r.tool === o.type)
      const pickR = REAGENT_BY_ID[solidChoice(o.type)] || solids[0]
      const why = ui.solidChoice?.[o.type] ? '' : guidedNeed(o.type) ? ' (theo bài)' : ''
      h += `<span class="dlab-bar-label">${pieces.length ? 'Lấy mới' : 'Lấy'}</span><select data-qa-in="solid" aria-label="Chất rắn">${solids.map(r => `<option value="${r.id}"${r.id === pickR.id ? ' selected' : ''}>${esc(r.name)}${r.id === pickR.id ? why : ''}</option>`).join('')}</select><input type="number" class="dlab-in" data-qa-in="mass" min="0.01" step="0.05" value="${massFor(pickR)}" aria-label="Khối lượng (g)"><span class="dlab-bar-label">g</span><button type="button" class="dlab-btn${pieces.length ? '' : ' dlab-btn--accent'}" data-qa="pick">Lấy</button>`
      return h
    }
    if (o.type === 'litmusPaper' || o.type === 'thermometer' || o.type === 'phMeter') {
      if (o.inside) return '<button type="button" class="dlab-btn dlab-btn--accent" data-qa="lift">Lấy ra</button>'
      const word = o.type === 'litmusPaper' ? 'Nhúng' : 'Đo'
      return wet.length ? `<span class="dlab-bar-label">${word} vào</span>${sel('to', wet, `${word} vào`)}<button type="button" class="dlab-btn dlab-btn--accent" data-qa="dip">${word}</button>` : '<span class="dlab-bar-note">Chưa có dung dịch để nhúng.</span>'
    }
    if (o.type === 'rod') return wet.length ? `<span class="dlab-bar-label">Khuấy</span>${sel('to', wet, 'Khuấy cốc')}<button type="button" class="dlab-btn dlab-btn--accent" data-qa="stir-in">Khuấy</button>` : ''
    if (o.type === 'burner') return `<button type="button" class="dlab-btn dlab-btn--accent" data-qa="burner">${o.on ? 'Tắt bếp' : 'Bật bếp'}</button>`
    return ''
  }
  // A dropper fills to its bulb capacity (2 mL); a pipette takes 5 mL.
  function suckML(o) { return o.type === 'dropper' ? EQUIPMENT.dropper.capacityML : 5 }
  function pieceWhere(p) {
    const c = p.in && byId(sim.state, p.in)
    return `${solidName(p)} · ${num(p.massG, 2)} g · ${c ? `trong ${objLabel(c)}` : 'trên bàn'}`
  }
  // Actions for a piece of solid: pick it up / take it out with tongs, or why it cannot be.
  function pieceActions(o, targets) {
    const r = REAGENT_BY_ID[o.reagent]
    if (!(o.massG > 0)) return '<span class="dlab-bar-note">Đã phản ứng hết — không còn gì để gắp.</span>'
    if (o.holder) return `<span class="dlab-bar-label">Thả vào</span>${targets.length ? `<select data-qa-in="to" aria-label="Thả vào">${opt(targets)}</select>` : ''}<button type="button" class="dlab-btn dlab-btn--accent" data-qa="drop-solid">Thả</button><button type="button" class="dlab-btn" data-qa="put-down">Đặt lên bàn</button>`
    if (r.tool !== 'tongs') return o.in ? '<span class="dlab-bar-note">Chất bột/tinh thể đã cho vào dung dịch — không lấy lại được.</span>' : ''
    if (o.reagent === 'na' && o.in) return '<span class="dlab-bar-note">Natri đang phản ứng — đứng xa, không gắp ra.</span>'
    if (o.in) return '<button type="button" class="dlab-btn dlab-btn--accent" data-qa="take-out">Gắp ra, đặt lên bàn</button><button type="button" class="dlab-btn" data-qa="grab-piece">Gắp lên</button>'
    return `<button type="button" class="dlab-btn dlab-btn--accent" data-qa="grab-piece">Gắp lên</button>${targets.length ? `<span class="dlab-bar-label">hoặc thả vào</span><select data-qa-in="to" aria-label="Thả vào">${opt(targets)}</select><button type="button" class="dlab-btn" data-qa="piece-into">Thả</button>` : ''}`
  }
  // Which solid the tool's "Lấy" offers: what the student chose last, else what the current guided step
  // needs (and is not on the bench yet), else the first in the list.
  function guidedNeed(toolType) {
    const step = ui.guided && ui.guided.lab.steps[ui.guided.done.length]
    const need = (step?.need || []).filter(n => REAGENT_BY_ID[n.reagent].tool === toolType)
    return need.find(n => !sim.state.objects.some(o => o.type === 'solid' && o.reagent === n.reagent && o.massG > 0)) || need[0] || null
  }
  function solidChoice(toolType) {
    return ui.solidChoice?.[toolType] || guidedNeed(toolType)?.reagent || null
  }
  function massFor(r) {
    const need = guidedNeed(r.tool)
    return need?.reagent === r.id ? need.massG : r.defaultMass
  }
  const qa = k => bar.querySelector(`[data-qa-in="${k}"]`)?.value
  bar.addEventListener('click', async e => {
    const b = e.target.closest('[data-qa]')
    const o = b && byId(sim.state, ui.selected)
    if (!o) return
    const act = b.dataset.qa
    const t = byId(sim.state, qa('to'))
    const above = c => ({ x: c.x, y: c.y + EQUIPMENT[c.type].h + 14 })
    const beside = c => ({ x: c.x + EQUIPMENT[c.type].w / 2 + 22, y: 0 })
    if (act === 'details') { openSide('detail'); return }
    if (act === 'replace') { const r = await run({ type: 'replace', id: o.id }); if (r) select(r.id) }
    if (act === 'pour' && t) await run({ type: 'pourExact', from: o.id, to: t.id, mL: Math.max(0.1, Number(qa('ml')) || 0) })
    if (act === 'drops' && t) await run({ type: 'pourExact', from: o.id, to: t.id, mL: 3 * EQUIPMENT.dropper.dropML })
    if (act === 'stir') await run({ type: 'stir', id: o.id })
    if (act === 'stir-in' && t) { await run({ type: 'move', id: o.id, x: t.x, y: t.y + 3 }); await run({ type: 'stir', id: t.id }) }
    if (act === 'suck') {
      const c = byId(sim.state, qa('from'))
      if (c && await run({ type: 'move', id: o.id, x: c.x, y: Math.max(c.y + 3, surfaceY(c) - 10) }) && await run({ type: 'aspirate', tool: o.id, from: c.id, mL: suckML(o) })) ui.suckFrom = { ...ui.suckFrom, [o.id]: c.id }
    }
    if (act === 'refill') {
      const c = byId(sim.state, ui.suckFrom?.[o.id])
      if (c && await run({ type: 'move', id: o.id, x: c.x, y: Math.max(c.y + 3, surfaceY(c) - 10) })) await run({ type: 'aspirate', tool: o.id, from: c.id, mL: suckML(o) })
    }
    if (['drop1', 'drop5', 'drop10', 'dropml'].includes(act) && t) {
      const p = above(t)
      const cmd = act === 'dropml' ? { mL: Math.max(0.05, Number(qa('dml')) || 0) } : { drops: Number(act.slice(4)) }
      if (await run({ type: 'move', id: o.id, x: p.x, y: p.y })) await run({ type: 'dispense', tool: o.id, ...cmd })
    }
    if (act === 'pick') {
      const reagent = qa('solid')
      if (await run({ type: 'pick', tool: o.id, reagent, massG: Number(qa('mass')) })) { o.y = Math.max(o.y, 40); carry(sim.state) }
      ui.solidChoice = { ...ui.solidChoice, [o.type]: reagent }
    }
    // The piece's own buttons act through the tongs holding it.
    const tool = o.type === 'solid' && o.holder ? byId(sim.state, o.holder) : o
    if (act === 'drop-solid' && t) {
      if (await run({ type: 'move', id: tool.id, x: t.x, y: t.y + EQUIPMENT[t.type].h + 30 }) && await run({ type: 'release', tool: tool.id })) {
        const p = beside(t)
        sim.dispatch({ type: 'move', id: tool.id, x: p.x, y: 0 }, { record: false })
        select(t.id)
      }
    }
    if (act === 'put-down') await putDown(tool)
    if (act === 'grab') { const p = byId(sim.state, qa('piece')); if (p) startGrab(o, p) }
    if (act === 'grab-piece') { const k = freeTongs(o); if (k) startGrab(k, o) }
    if (act === 'take-out') { const k = freeTongs(o); if (k && startGrab(k, o)) await putDown(k) }
    if (act === 'piece-into' && t) {
      const k = freeTongs(o)
      if (k && startGrab(k, o) && await run({ type: 'move', id: k.id, x: t.x, y: t.y + EQUIPMENT[t.type].h + 30 }) && await run({ type: 'release', tool: k.id })) {
        sim.dispatch({ type: 'move', id: k.id, x: beside(t).x, y: 0 }, { record: false })
        select(t.id)
      }
    }
    if (act === 'dip' && t) await run({ type: 'move', id: o.id, x: t.x, y: Math.max(t.y + 3, surfaceY(t) - 12) })
    if (act === 'lift') { const c = byId(sim.state, o.inside); if (c) { const p = beside(c); await run({ type: 'move', id: o.id, x: p.x, y: 0 }) } }
    if (act === 'burner') await run({ type: 'burner', id: o.id, on: !o.on })
    ui.forcePanel = true
  })
  // "Nghiêng tay": hold the vessel above the chosen receiver and tilt it with the slider — the same
  // tilt the mouse wheel or [ ] keys give, so how much pours is still decided by the simulation.
  bar.addEventListener('change', e => {
    if (!e.target.matches('[data-qa-in="solid"]')) return
    const r = REAGENT_BY_ID[e.target.value]
    const m = bar.querySelector('[data-qa-in="mass"]')
    if (r && m) m.value = massFor(r) // each solid has its own sensible amount (a nail is 2 g, sodium 0.1 g)
    ui.solidChoice = { ...ui.solidChoice, [r.tool]: r.id }
  })
  bar.addEventListener('input', e => {
    if (!e.target.matches('[data-qa-in="tilt"]')) return
    const o = byId(sim.state, ui.selected)
    const t = byId(sim.state, qa('to'))
    if (!o || !t || !isContainer(o)) return
    const deg = Number(e.target.value)
    if (!ui.tilting && deg > 0) {
      ui.tilting = { id: o.id, x: o.x, y: o.y }
      sim.record()
      o.held = true
      o.x = t.x - (EQUIPMENT[o.type].w / 2 + EQUIPMENT[t.type].w * 0.12)
      o.y = t.y + EQUIPMENT[t.type].h + 22
      ui.held = o.id
    }
    if (!ui.tilting) return
    o.angle = Math.min(2.2, deg * Math.PI / 180)
    if (deg === 0) endTilt()
  })
  function endTilt() {
    const s0 = ui.tilting
    ui.tilting = null
    ui.held = null
    const o = s0 && byId(sim.state, s0.id)
    if (!o) return
    o.angle = 0
    o.held = false
    sim.dispatch({ type: 'move', id: o.id, x: s0.x, y: s0.y }, { record: false })
    ui.forcePanel = true
  }

  // ── Labels: 2D overlay anchored to world points (2D canvas or 3D camera), from the simulation state ──
  const labelBox = $('.dlab-labels')
  const LABEL_MODES = { all: 'Tất cả', auto: 'Khi chọn', off: 'Ẩn' }
  try { ui.labels = LABEL_MODES[localStorage.getItem('chemlab-dlab-labels')] ? localStorage.getItem('chemlab-dlab-labels') : 'all' } catch { ui.labels = 'all' }
  const labelEls = new Map()
  function paintLabels() {
    const st = sim.state
    labelBox.hidden = ui.labels === 'off'
    if (labelBox.hidden) return
    const box = stage.getBoundingClientRect()
    const cv = (ui.render3d ? $('.dlab-3d canvas') : canvas)?.getBoundingClientRect()
    if (!cv) return
    const project = ui.render3d
      ? (x, y) => three?.worldToScreen(x, y)
      : (x, y) => { const [sx, sy] = toScreen(view, x, y); return { x: cv.left + sx, y: cv.top + sy } }
    const hide = ui.guided?.lab.hideContents
    // Labels stay in the part of the stage not covered by open drawers or the action bar.
    const ins = insets()
    const freeL = Math.max(cv.left - box.left, ins.l), freeR = Math.min(cv.right - box.left, box.width - ins.r), freeT = Math.max(cv.top - box.top, ins.t)
    const items = []
    for (const o of st.objects) {
      if (o.type === 'solid' && (o.holder || !(o.massG > 0))) continue // a held piece is named on its tool
      const sel = ui.selected === o.id
      const hov = ui.hover === o.id
      const held = ui.held === o.id
      const grab = ui.grabbable?.includes(o.id)
      const drop = ui.drop?.id === o.id ? ui.drop : null
      // Pieces inside a vessel are listed in the vessel's label; their own label appears on demand.
      const wanted = drop || sel || hov || held || grab || (ui.labels === 'all' && !(o.type === 'solid' && o.in))
      if (!wanted) continue
      const b = bounds(o, st)
      const p = project(o.type === 'solid' ? (b.x0 + b.x1) / 2 : o.x, b.y1 + 4)
      if (!p || p.x < cv.left || p.x > cv.right || p.y < cv.top || p.y > cv.bottom) continue
      const px = p.x - box.left
      if ((px < freeL || px > freeR) && !(sel || held || drop)) continue // the object itself is under a drawer
      const text = drop ? (drop.ok ? `Thả vào ${objLabel(o)}` : `Không thả được: ${drop.reason}`) : `${objectTitle(st, o, { hideContents: hide })}${grab && !sel ? ' · bấm để gắp' : ''}`
      items.push({ id: o.id, text, x: p.x - box.left, y: p.y - box.top, rank: drop || held ? 0 : sel ? 1 : hov ? 2 : grab ? 3 : 4, cls: drop ? (drop.ok ? 'is-drop-ok' : 'is-drop-bad') : held ? 'is-held' : sel ? 'is-sel' : hov ? 'is-hover' : grab ? 'is-grab' : '' })
    }
    // Most important first; a label that would overlap a placed one moves up, and is dropped if it still collides.
    items.sort((a, b) => a.rank - b.rank || b.y - a.y)
    const placed = []
    const seen = new Set()
    for (const it of items) {
      let el = labelEls.get(it.id)
      if (!el) { el = document.createElement('span'); el.className = 'dlab-label'; labelBox.appendChild(el); labelEls.set(it.id, el) }
      if (el.textContent !== it.text) { el.textContent = it.text; el.dataset.w = '' }
      if (el.className !== `dlab-label ${it.cls}`.trim()) el.className = `dlab-label ${it.cls}`.trim()
      const w = Number(el.dataset.w) || (el.dataset.w = el.offsetWidth) || it.text.length * 7
      const h = 22
      // Keep the whole label inside the view: near an edge it slides inward along the edge.
      it.x = Math.min(Math.max(it.x, freeL + w / 2 + 4), freeR - w / 2 - 4)
      let y = it.y
      const hits = yy => placed.some(r => Math.abs(r.x - it.x) < (r.w + w) / 2 + 4 && Math.abs(r.y - yy) < h)
      for (let k = 0; k < 4 && hits(y); k += 1) y -= h + 2
      if ((hits(y) || y - h < freeT) && it.rank > 1) { el.hidden = true; seen.add(it.id); continue }
      if (y - h < freeT) y = freeT + h + 2 // the selected or held object's label stays below the action bar
      placed.push({ x: it.x, y, w })
      el.hidden = false
      el.style.transform = `translate(${Math.round(it.x - w / 2)}px, ${Math.round(y - h)}px)`
      seen.add(it.id)
    }
    for (const [id, el] of labelEls) if (!seen.has(id)) { el.remove(); labelEls.delete(id) }
  }

  // ── Toolbar ────────────────────────────────────────────────────────
  function paintToolbar() {
    const st = sim.state
    const tText = `Mô phỏng ${fmtTime(st.t)}`
    if (ui.tText !== tText) { ui.tText = tText; $('.dlab-time').textContent = tText } // avoid repainting the dock every frame
    const play = $('[data-tb="play"]')
    const label = st.paused ? 'Tiếp tục' : 'Tạm dừng'
    if (play.dataset.label !== label) {
      play.dataset.label = label
      play.innerHTML = `${icon(st.paused ? 'play' : 'pause')}<span>${label}</span>`
      play.setAttribute('aria-pressed', String(st.paused))
    }
    host.querySelectorAll('[data-speed]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.speed) === st.speed)))
    $('[data-tb="undo"]').disabled = !sim.history.length
  }
  function togglePause() { sim.state.paused = !sim.state.paused; announce(sim.state.paused ? 'Đã tạm dừng mô phỏng' : 'Tiếp tục mô phỏng'); draw() }
  $('.dlab-dock').addEventListener('click', async e => {
    const b = e.target.closest('button')
    if (!b) return
    if (b.dataset.speed) { sim.state.speed = Number(b.dataset.speed); announce(`Tốc độ ${b.textContent}`) }
    if (b.dataset.tb === 'play') togglePause()
    if (b.dataset.tb === 'undo') sim.undo()
    if (b.dataset.tb === 'reset') { if (await confirmDialog('Đặt lại thí nghiệm?', ['Bàn thí nghiệm sẽ trở về trạng thái ban đầu. Có thể hoàn tác.'])) resetSim() }
    if (b.dataset.tb === 'fit') { ui.userView = false; fitView(); three?.fit?.(insets()) }
    if (b.dataset.tb === 'home3d') three?.home?.()
    if (b.dataset.tb === 'focus3d' && ui.selected) three?.focus?.(ui.selected)
    if (b.dataset.tb === 'labels') {
      ui.labels = { all: 'auto', auto: 'off', off: 'all' }[ui.labels]
      try { localStorage.setItem('chemlab-dlab-labels', ui.labels) } catch {}
      syncLabelButton()
      announce(`Nhãn: ${LABEL_MODES[ui.labels]}`)
    }
    draw()
  })

  function syncLabelButton() {
    const b = $('[data-tb="labels"]')
    b.querySelector('span').textContent = `Nhãn: ${LABEL_MODES[ui.labels]}`
    b.setAttribute('aria-label', `Nhãn tên vật: ${LABEL_MODES[ui.labels]} (bấm để đổi)`)
  }
  syncLabelButton()

  // ── Header, drawers and menu ─────────────────────────────────────
  function openSide(tab) {
    host.classList.add('dlab--show-side')
    if (!wideLayout()) host.classList.remove('dlab--show-lib')
    delete $('[data-hd="side"]').dataset.badge
    if (tab) setSideTab(tab)
    syncDrawerButtons()
    requestAnimationFrame(reframe)
  }
  function setSideTab(tab) {
    ui.sideTab = tab
    host.querySelectorAll('[data-side-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.sideTab === tab)))
    $('.dlab-obs-pane').hidden = tab !== 'obs'
    $('.dlab-detail-pane').hidden = tab !== 'detail'
    $('.dlab-discover-pane').hidden = tab !== 'discover'
    if (tab === 'discover') paintDiscover()
    ui.forcePanel = true
  }
  function toggleDrawer(which, force) {
    const cls = `dlab--show-${which}`
    const open = force ?? !host.classList.contains(cls)
    host.classList.toggle(cls, open)
    if (open && !wideLayout()) host.classList.remove(`dlab--show-${which === 'lib' ? 'side' : 'lib'}`)
    if (which === 'side' && open) delete $('[data-hd="side"]').dataset.badge
    if (which === 'lib' && open) setTimeout(() => $('.dlab-search').focus({ preventScroll: true }), 0)
    syncDrawerButtons()
    requestAnimationFrame(reframe)
  }
  function syncDrawerButtons() {
    $('[data-hd="lib"]').setAttribute('aria-expanded', String(host.classList.contains('dlab--show-lib')))
    $('[data-hd="side"]').setAttribute('aria-expanded', String(host.classList.contains('dlab--show-side')))
  }
  host.querySelectorAll('[data-side-tab]').forEach(b => b.addEventListener('click', () => setSideTab(b.dataset.sideTab)))
  host.addEventListener('click', async e => {
    const b = e.target.closest('[data-hd]')
    if (!b) return
    const what = b.dataset.hd
    const menu = b.closest('.dlab-menu')
    if (menu) menu.open = false
    if (what === 'sandbox') startSandbox()
    if (what === 'guided') openGuidedPicker()
    if (what === 'save') saveDialog()
    if (what === 'open') openDialog()
    if (what === 'view3d') toggle3d()
    if (what === 'help') coach.start()
    if (what === 'cleanup') { const r = sim.dispatch({ type: 'cleanup' }); if (r.ok && !r.changed) toast('Bàn đã sạch, không có gì cần dọn.') }
    if (what === 'full') { if (document.fullscreenElement) document.exitFullscreen(); else host.requestFullscreen?.() }
    if (what === 'ai') askChemAI()
    if (what === 'quality') { ui.qualityChosen = true; ui.autoLow = false; ui.quality = ui.quality === 'high' ? 'low' : 'high'; b.textContent = ui.quality === 'high' ? 'Đồ họa: Cao' : 'Đồ họa: Tiết kiệm'; three?.setQuality(ui.quality) }
    if (what === 'lib' || what === 'side') toggleDrawer(what)
  })
  document.addEventListener('click', e => { const m = $('.dlab-menu'); if (m?.open && !m.contains(e.target)) m.open = false })
  host.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return
    const m = $('.dlab-menu')
    if (m?.open) { m.open = false; m.querySelector('summary').focus(); return }
    if (!wideLayout() && (host.classList.contains('dlab--show-lib') || host.classList.contains('dlab--show-side'))) { toggleDrawer('lib', false); toggleDrawer('side', false) }
  })
  syncDrawerButtons()

  function startSandbox() {
    ui.mode = 'sandbox'
    ui.guided = null
    ui.highlight = []
    paintStrip(null)
    loadSim(restore(snapshot(seedSandbox())))
    sim.markInitial()
    setModeButtons()
    toast('Thực hành tự do: lấy hóa chất và dụng cụ từ Thư viện.')
  }
  // ── Sandbox discovery: modelled phenomena to try (from the reaction manifest). Laying out a card only puts
  // the vessel, the reagent bottle and the tool on the bench; the student performs the action.
  function paintDiscover() {
    const pane = $('.dlab-discover-pane')
    if (pane.dataset.done) return
    pane.dataset.done = '1'
    const groups = [...new Set(DISCOVER.map(e => e.group))]
    pane.innerHTML = `<p class="dlab-hint">Các hiện tượng dưới đây được mô phỏng từ mô hình hóa học (không phải hoạt cảnh). Bấm “Bày dụng cụ”, rồi tự làm thí nghiệm. Tổ hợp khác vẫn thử được: mô phỏng sẽ nói rõ khi không phản ứng hoặc chưa hỗ trợ.</p>` +
      groups.map(g => `<h3 class="dlab-disc-group">${esc(g)}</h3><ul class="dlab-disc">${DISCOVER.filter(e => e.group === g).map(e => `<li><b>${esc(e.title)}</b><span>${esc(e.inputs)}</span><button type="button" class="dlab-btn dlab-btn--sm" data-discover="${esc(e.id)}">Bày dụng cụ</button></li>`).join('')}</ul>`).join('')
  }
  $('.dlab-discover-pane').addEventListener('click', e => {
    const b = e.target.closest('[data-discover]')
    const entry = b && DISCOVER.find(x => x.id === b.dataset.discover)
    if (entry) layOut(entry)
  })
  function layOut(entry) {
    const d = entry.demo
    const x = freeX()
    const v = sim.dispatch({ type: 'add', equipmentType: d.vessel, x, y: 0 })
    if (!v.ok) return
    for (const [reagent, mL] of d.fill) sim.dispatch({ type: 'addReagentTo', id: v.id, reagent, mL }, { confirmed: true })
    let next
    let task
    const vName = objLabel(byId(sim.state, v.id))
    if (d.pour) {
      const r = sim.dispatch({ type: 'add', equipmentType: 'bottle', x: x + 75, y: 0, reagent: d.pour[0] })
      next = r.id
      task = `Rót khoảng ${d.pour[1]} mL ${REAGENT_BY_ID[d.pour[0]].name} vào ${vName}.`
    }
    else if (d.solid) {
      const reagent = REAGENT_BY_ID[d.solid[0]]
      const r = sim.dispatch({ type: 'add', equipmentType: reagent.tool, x: x + 60, y: 0 })
      next = r.id
      task = `Dùng ${EQUIPMENT[reagent.tool].name.toLowerCase()} lấy ${reagent.name} (khoảng ${String(d.solid[1]).replace('.', ',')} g) rồi thả vào ${vName}.`
    }
    ui.userView = false
    fitView()
    if (next) select(next)
    toast(`${entry.title} — đã bày dụng cụ. Việc của bạn: ${task}`)
    announce(`Đã bày dụng cụ cho thí nghiệm ${entry.title}. ${task}`)
  }

  function seedSandbox() {
    const s = createSim(Date.now() >>> 0)
    const add = (equipmentType, x, extra = {}) => s.dispatch({ type: 'add', equipmentType, x, y: extra.y ?? 0, ...extra }, { record: false })
    add('beaker100', 260)
    add('beaker100', 360)
    add('testTube', 460)
    add('dropper', 530)
    add('rod', 575)
    s.state.log = []
    return s.state
  }
  function setModeButtons() {
    $('[data-hd="sandbox"]').setAttribute('aria-pressed', String(ui.mode === 'sandbox'))
    $('[data-hd="guided"]').setAttribute('aria-pressed', String(ui.mode === 'guided'))
    // "Khám phá" belongs to free practice; a guided lesson keeps its own steps.
    $('[data-side-tab="discover"]').hidden = ui.mode !== 'sandbox'
    if (ui.mode !== 'sandbox' && ui.sideTab === 'discover') setSideTab('obs')
  }

  // ── Guided Lab ─────────────────────────────────────────────────────
  async function openGuidedPicker() {
    const choice = await choiceDialog('Chọn bài thực hành có hướng dẫn', GUIDED.map(g => ({ value: g.id, title: g.title, sub: g.group })))
    if (!choice) return
    beginGuided(GUIDED.find(g => g.id === choice), Date.now() >>> 0)
  }
  function beginGuided(lab, seed) {
    const s = createSim(seed)
    const roles = lab.setup(s)
    s.state.log = []
    loadSim(restore(snapshot(s.state)))
    sim.markInitial()
    ui.mode = 'guided'
    ui.guided = { lab, roles, done: [], doneH: [], finished: false }
    ui.selected = null
    ui.solidChoice = {}
    setModeButtons()
    openSide('obs')
    ui.forcePanel = true
    return roles
  }
  function paintGuided() {
    const box = $('.dlab-guided')
    const g = ui.guided
    if (!g) { box.hidden = true; ui.highlight = []; paintStrip(null); return }
    box.hidden = false
    const st = sim.state
    // Undo/reset bring the simulation clock back: progress made after that moment is undone with it.
    g.doneH = g.doneH || []
    while (g.done.length && (g.done[g.done.length - 1] > st.t + 1e-9 || g.doneH[g.done.length - 1] > sim.history.length)) { g.done.pop(); g.doneH.pop() }
    // Replacement equipment takes over the lesson role of the one it replaced.
    for (const [role, id] of Object.entries(g.roles)) if (!byId(st, id)) { const fresh = st.objects.find(o => o.replaces === id); if (fresh) g.roles[role] = fresh.id }
    // Only the current step's own objects matter; a check that cannot read them must not stop the render loop.
    const idx = g.done.length
    const cur = g.lab.steps[idx]
    let ok = false
    g.missing = Boolean(cur && (cur.target || []).some(r => g.roles[r] && !byId(st, g.roles[r])))
    if (cur && !g.missing) { try { ok = cur.check(st, g.roles) } catch { g.missing = true } }
    if (ok) { g.done.push(st.t); g.doneH.push(sim.history.length); ui.solidChoice = {}; announce(`Hoàn thành bước ${idx + 1}`) }
    const current = g.done.length
    const step = g.lab.steps[current]
    ui.highlight = step ? (step.target || []).map(r => g.roles[r]).filter(Boolean) : []
    paintStrip(g, step, current)
    const key = `${g.lab.id}|${current}|${g.collapsed}`
    if (box.dataset.key === key) return
    box.dataset.key = key
    const finished = current >= g.lab.steps.length
    box.innerHTML = `
      <div class="dlab-guided-head"><div><span class="dlab-kicker">${esc(g.lab.group)}</span><h3>${esc(g.lab.title)}</h3></div>
      <button type="button" class="dlab-btn dlab-btn--ghost" data-g="collapse" aria-expanded="${!g.collapsed}">${g.collapsed ? 'Mở' : 'Thu gọn'}</button></div>
      ${g.collapsed ? '' : `
      <p class="dlab-alert">${esc(g.lab.safety)}</p>
      <details class="dlab-intro"><summary>Giới thiệu bài: mục tiêu, kiến thức, dụng cụ</summary><p><strong>Mục tiêu:</strong> ${esc(g.lab.goal)}</p><p><strong>Kiến thức:</strong> ${esc(g.lab.knowledge)}</p><p><strong>Dụng cụ:</strong> ${esc(g.lab.equipment.join(', '))}</p><p><strong>Hóa chất:</strong> ${esc(g.lab.chemicals.join(', '))}</p></details>
      <ol class="dlab-steps">${g.lab.steps.map((s, i) => `<li class="${i < current ? 'is-done' : i === current ? 'is-current' : ''}" ${i === current ? 'aria-current="step"' : ''}>${esc(s.text)}</li>`).join('')}</ol>
      ${finished ? `<div class="dlab-result"><p><strong>Hiện tượng:</strong> ${esc(g.lab.observe)}</p><p><strong>Giải thích:</strong> ${esc(g.lab.explain)}</p><p><strong>Kết luận:</strong> ${esc(g.lab.conclusion)}</p></div>` : ''}
      <p class="dlab-progress">Tiến độ: ${Math.min(current, g.lab.steps.length)}/${g.lab.steps.length}</p>
      <div class="dlab-meter" aria-hidden="true"><span style="width:${Math.round(100 * Math.min(current, g.lab.steps.length) / g.lab.steps.length)}%"></span></div>`}
      <div class="dlab-row"><button type="button" class="dlab-btn dlab-btn--ghost" data-g="exit">Thoát bài</button></div>`
  }
  // Step strip above the bench: step n/N, the task, the objects to use, how completion is recognised,
  // help on request, and — for steps that are only waiting — a jump to the next phenomenon.
  const strip = $('.dlab-gstrip')
  // Recovery for any step that needs a solid in a given vessel: if the piece went into another vessel,
  // say where it is and what to do, from the step's own data (need + target roles), for every lesson.
  function misplaced(st, g, step) {
    const vesselsOf = (step.target || []).map(r => byId(st, g.roles[r])).filter(c => c && isContainer(c) && !c.stock)
    if (!step.need?.length) return ''
    for (const n of step.need) {
      const target = n.into ? byId(st, g.roles[n.into]) : vesselsOf.length === 1 ? vesselsOf[0] : null
      if (!target) continue
      const wrong = st.objects.find(o => o.type === 'solid' && o.reagent === n.reagent && o.in && o.in !== target.id)
      if (wrong && !st.objects.some(o => o.type === 'solid' && o.reagent === n.reagent && o.in === target.id)) {
        return `${REAGENT_BY_ID[n.reagent].name} đang ở ${objLabel(byId(st, wrong.in))}, không phải ${objLabel(target)}. Lấy mẩu mới và thả vào ${objLabel(target)}.`
      }
    }
    return ''
  }
  function paintStrip(g, step, current) {
    if (!g) { if (!strip.hidden) { strip.hidden = true; requestAnimationFrame(resize) } return }
    const st = sim.state
    const total = g.lab.steps.length
    let html
    if (!step) {
      html = `<div class="dlab-gstrip-main"><span class="dlab-gstep is-done">Hoàn thành ${total}/${total}</span><p class="dlab-gtask">${esc(g.lab.title)} — xem hiện tượng, giải thích và kết luận ở bảng Quan sát.</p></div><div class="dlab-gacts"><button type="button" class="dlab-btn dlab-btn--accent" data-gs="result">Xem kết quả</button></div>`
    }
    else {
      const names = (step.target || []).map(r => byId(st, g.roles[r])).filter(Boolean).map(o => objectTitle(st, o, { hideContents: g.lab.hideContents }))
      let canWait = false
      try { canWait = !g.missing && step.wait?.(st, g.roles) } catch {}
      html = `<div class="dlab-gstrip-main"><span class="dlab-gstep">Bước ${current + 1}/${total}</span><p class="dlab-gtask">${esc(step.text)}</p></div>
        <p class="dlab-gmeta">${names.length ? `<span><b>Thao tác với:</b> ${esc(names.join('; '))}</span>` : ''}</p>
        ${(() => { let t; try { t = g.missing ? 'Một dụng cụ hoặc cốc của bài đã bị cất khỏi bàn. Bấm “Hoàn tác” hoặc “Đặt lại” để tiếp tục.' : step.progress?.(st, g.roles) || misplaced(st, g, step) } catch { t = '' } return t ? `<p class="dlab-gprogress" role="status">${esc(t)}</p>` : '' })()}
        <div class="dlab-gacts">${canWait ? `<button type="button" class="dlab-btn dlab-btn--accent" data-gs="ffwd" ${ui.ffwd ? 'disabled' : ''}>${icon('forward')}<span>${ui.ffwd ? `Đang tua… ${fmtTime(st.t - ui.ffwd.t0)}` : 'Tua đến hiện tượng'}</span></button>` : ''}<button type="button" class="dlab-btn dlab-btn--ghost" data-gs="help" aria-expanded="${Boolean(ui.stripHelp)}">Gợi ý</button><button type="button" class="dlab-btn dlab-btn--ghost" data-gs="lesson">Bài học</button></div>
        ${ui.stripHelp && step.help ? `<p class="dlab-ghelp">${esc(step.help)}${step.done ? `<br><b>Hoàn thành khi:</b> ${esc(step.done)}` : ''}</p>` : ''}`
    }
    const wasHidden = strip.hidden
    strip.hidden = false
    patch(strip, html)
    if (wasHidden) requestAnimationFrame(resize)
  }
  strip.addEventListener('click', e => {
    const b = e.target.closest('[data-gs]')
    if (!b || !ui.guided) return
    if (b.dataset.gs === 'help') ui.stripHelp = !ui.stripHelp
    if (b.dataset.gs === 'lesson' || b.dataset.gs === 'result') openSide('obs')
    if (b.dataset.gs === 'ffwd') fastForward()
    ui.forcePanel = true
  })
  // Run the real simulation forward (in slices, so the page stays responsive) until the current step's
  // own completion check passes, or 10 simulated minutes. Nothing is drawn that the model did not compute.
  async function fastForward(limit = 600) {
    const g = ui.guided
    const step = g?.lab.steps[g.done.length]
    if (!step?.wait?.(sim.state, g.roles) || ui.ffwd) return false
    const t0 = sim.state.t
    ui.ffwd = { t0 }
    let ok = false
    while (sim.state.t - t0 < limit && ui.guided === g) {
      if (step.check(sim.state, g.roles)) { ok = true; break }
      sim.runFor(2)
      ui.forcePanel = true
      await new Promise(r => requestAnimationFrame(r))
    }
    ui.ffwd = null
    ui.forcePanel = true
    const dt = fmtTime(sim.state.t - t0)
    toast(ok ? `Đã tua ${dt} thời gian mô phỏng. Mọi thay đổi do mô hình tính, không phải hình minh họa.` : `Đã tua ${dt} mô phỏng nhưng chưa đạt điều kiện. ${step.help || ''}`, ok ? 'info' : 'warn')
    return ok
  }

  $('.dlab-guided').addEventListener('click', e => {
    const b = e.target.closest('[data-g]')
    if (!b || !ui.guided) return
    if (b.dataset.g === 'collapse') ui.guided.collapsed = !ui.guided.collapsed
    if (b.dataset.g === 'exit') { ui.guided = null; ui.mode = 'sandbox'; setModeButtons(); paintStrip(null) }
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
      loadSim(save.state)
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
      $('[data-tb="home3d"]').hidden = true
      $('[data-tb="focus3d"]').hidden = true
      return
    }
    try {
      // No GPU (software WebGL): start in economy graphics unless the user picked a quality.
      if (!ui.qualityChosen && ui.quality === 'high' && softwareGL()) {
        ui.quality = 'low'
        const qb = $('[data-hd="quality"]')
        if (qb) qb.textContent = 'Đồ họa: Tiết kiệm'
        ui.autoLow = true
      }
      const { create3dView } = await import('./render3d.js')
      $('.dlab-3d').hidden = false
      three = create3dView($('.dlab-3d'), {
        quality: ui.quality,
        onPick: id => select(id),
        onHover: id => { ui.hover = id },
        insets: () => insets(),
        describe: id => { const o = byId(sim.state, id); return o ? objectTitle(sim.state, o, { hideContents: ui.guided?.lab.hideContents }) : '' },
        controller: {
          down: (id, x, y) => { const o = byId(sim.state, id); return o ? beginDrag(o, x, y) : false },
          move: dragTo,
          up: endObjectDrag,
          wheel: tiltHeld,
          key: onKey,
          hasSelection: () => !!byId(sim.state, ui.selected)
        }
      })
      if (!three) { $('.dlab-3d').hidden = true; return toast('Thiết bị không hỗ trợ WebGL — tiếp tục ở chế độ 2D.') }
      ui.render3d = true
      canvas.hidden = true
      btn.textContent = 'Xem 2D'
      btn.setAttribute('aria-pressed', 'true')
      $('[data-tb="home3d"]').hidden = false
      $('[data-tb="focus3d"]').hidden = false
      three.update(sim.state, ui)
      toast(`${ui.autoLow ? 'Máy không có tăng tốc đồ họa nên dùng “Đồ họa: Tiết kiệm” (đổi ở menu ⋯). ' : ''}3D: kéo vật để di chuyển; kéo vùng trống để xoay bàn; lăn chuột để phóng to. Thao tác chính có ở thanh phía trên.`)
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
      // A previous modal's queued 'close' event can arrive after this one opened; only a real close cancels.
      dialog.onclose = () => { if (!dialog.open) resolve(null) }
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

  // ── Onboarding: four short coach cards, skippable, reopened with the "?" button ──
  const COACH_KEY = 'chemlab-dlab-onboarded'
  const COACH = [
    { target: '.dlab-lib', open: 'lib', title: 'Thư viện hóa chất & dụng cụ', text: 'Gõ tên để tìm (ví dụ “nước”, “natri”) hoặc chọn nhóm. Bấm một mục để lấy ra bàn, hoặc kéo thả thẳng vào cốc.' },
    { target: '.dlab-actionbar', title: 'Bàn thí nghiệm', text: 'Kéo dụng cụ để di chuyển. Bấm chọn một vật: các thao tác chính — rót, nhỏ giọt, nhúng, thả chất rắn — hiện ở thanh này, không cần nhớ phím tắt.' },
    { target: '.dlab-side', open: 'side', title: 'Bảng Quan sát', text: 'Hiện tượng đang diễn ra, kết luận và cảnh báo an toàn hiện ở đây. Nhật ký thao tác chi tiết được thu gọn ở cuối.' },
    { target: '.dlab-mode', title: 'Bắt đầu', text: 'Chọn “Có hướng dẫn” để làm theo từng bước, hoặc thực hành tự do: lấy Nước cất rót vào cốc, nhỏ phenolphtalein, rồi thả một mẩu natri. Mở lại hướng dẫn này bằng nút “?”.' }
  ]
  const coach = (() => {
    let i = -1
    const card = $('.dlab-coach')
    function show() {
      host.querySelectorAll('.is-coach-target').forEach(el => el.classList.remove('is-coach-target'))
      if (i < 0) { card.hidden = true; return }
      const step = COACH[i]
      if (step.open) toggleDrawer(step.open, true)
      $(step.target)?.classList.add('is-coach-target')
      card.hidden = false
      card.innerHTML = `<p class="dlab-kicker">Hướng dẫn nhanh · ${i + 1}/${COACH.length}</p><h3 id="dlab-coach-title">${step.title}</h3><p>${step.text}</p>
        <div class="dlab-row"><button type="button" data-coach="skip" class="dlab-btn dlab-btn--ghost">Bỏ qua</button><span class="dlab-grow"></span>${i > 0 ? '<button type="button" data-coach="back" class="dlab-btn">Quay lại</button>' : ''}<button type="button" data-coach="next" class="dlab-btn dlab-btn--accent">${i === COACH.length - 1 ? 'Bắt đầu thực hành' : 'Tiếp'}</button></div>`
      card.querySelector('[data-coach="next"]').focus({ preventScroll: true })
    }
    function end() {
      i = -1
      show()
      try { localStorage.setItem(COACH_KEY, '1') } catch {}
      canvas.focus({ preventScroll: true })
    }
    card.addEventListener('click', e => {
      const b = e.target.closest('[data-coach]')
      if (!b) return
      if (b.dataset.coach === 'skip') end()
      if (b.dataset.coach === 'back') { i -= 1; show() }
      if (b.dataset.coach === 'next') { if (i >= COACH.length - 1) end(); else { i += 1; show() } }
    })
    card.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); end() } })
    return {
      start() { i = 0; show() },
      maybeStart() {
        let seen = false
        try { seen = localStorage.getItem(COACH_KEY) === '1' } catch {}
        if (!seen) this.start()
      },
      state: () => ({ step: i, open: i >= 0 })
    }
  })()

  // ── Boot: resume autosave if present, else a starter bench ─────────
  ;(async () => {
    try {
      const save = await loadExperiment(AUTOSAVE_ID)
      loadSim(save.state)
      sim.markInitial()
      toast('Đã khôi phục phiên làm việc trước (tự động lưu).')
    }
    catch {
      loadSim(seedSandbox())
      sim.markInitial()
    }
    setModeButtons()
    resize()
    start()
    ui.booted = true
    coach.maybeStart()
  })()

  // Test/automation hook (read-only access + commands through the same safety path).
  window.ChemLabDynamicLab = Object.freeze({
    get state() { return sim.state },
    // Foundation read API: canonical scientific state of a container and the structured observation events.
    describe: id => describe(sim.state, id),
    events: (since = 0) => (sim.state.events || []).filter(e => e.t >= since),
    get ready() { return Boolean(ui.booted) },
    dispatch: (cmd, opts) => sim.dispatch(cmd, opts),
    undo: () => sim.undo(),
    reset: () => resetSim(),
    view: () => ({ ...view }),
    surface: id => surfaceY(byId(sim.state, id)),
    markInitial: () => sim.markInitial(),
    fit: () => { ui.userView = false; fitView() },
    selected: () => ui.selected,
    worldToScreen3d: (x, y) => three?.worldToScreen(x, y) ?? null,
    camera3d: () => three?.camera?.() ?? null,
    drop: () => ui.drop ?? null,
    hiddenObject: () => hiddenObject(),
    select,
    toggle3d,
    is3d: () => ui.render3d,
    guided: () => (ui.guided ? { id: ui.guided.lab.id, done: ui.guided.done.length, total: ui.guided.lab.steps.length } : null),
    startGuided: id => beginGuided(GUIDED.find(g => g.id === id), 1),
    fastForward: limit => fastForward(limit),
    labels: () => [...labelEls.values()].filter(el => !el.hidden).map(el => el.textContent),
    save: name => saveExperiment({ name, state: sim.state }),
    list: () => listExperiments(),
    load: async id => { const s = await loadExperiment(id); loadSim(s.state); return true },
    worldToScreen: (x, y) => { const rect = canvas.getBoundingClientRect(); const [sx, sy] = toScreen(view, x, y); return { x: rect.left + sx, y: rect.top + sy } },
    coach: () => coach.state()
  })
}

// True when WebGL runs on a CPU rasteriser (SwiftShader, llvmpipe, Microsoft Basic Render).
function softwareGL() {
  try {
    const gl = document.createElement('canvas').getContext('webgl')
    if (!gl) return false
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    const name = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER))
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return /swiftshader|llvmpipe|software|basic render/i.test(name)
  }
  catch { return false }
}

function template() {
  const tabs = LIB_SHELVES.map(t => `<button type="button" role="tab" class="dlab-tab dlab-shelf" data-shelf="${t.id}">${icon(t.id === 'chem' ? 'bottle' : 'rack')}<span>${t.label}</span></button>`).join('')
  const speeds = SPEEDS.map(s => `<button type="button" class="dlab-btn" data-speed="${s}" aria-pressed="${s === 1}">${String(s).replace('.', ',')}×</button>`).join('')
  return `
  <div class="dlab-shell">
    <header class="dlab-header">
      <div class="dlab-brand"><span class="dlab-kicker">ChemLab 7.0 · Thử nghiệm</span><h2>Phòng thí nghiệm động</h2></div>
      <div class="dlab-seg dlab-mode" role="group" aria-label="Chế độ thực hành">
        <button type="button" class="dlab-btn" data-hd="sandbox" aria-pressed="true">Tự do</button>
        <button type="button" class="dlab-btn" data-hd="guided" aria-pressed="false">Có hướng dẫn</button>
      </div>
      <div class="dlab-head-actions">
        <button type="button" class="dlab-btn" data-hd="view3d" aria-pressed="false">Xem 3D</button>
        <button type="button" class="dlab-btn dlab-btn--icon" data-hd="help" aria-label="Hướng dẫn sử dụng" title="Hướng dẫn sử dụng">${icon('help')}</button>
        <details class="dlab-menu">
          <summary class="dlab-btn dlab-btn--icon" aria-label="Thêm tùy chọn" title="Thêm tùy chọn">${icon('more')}</summary>
          <div class="dlab-menu-list" role="group" aria-label="Thêm tùy chọn">
            <button type="button" class="dlab-btn dlab-btn--ghost" data-hd="save">Lưu</button>
            <button type="button" class="dlab-btn dlab-btn--ghost" data-hd="open">Mở</button>
            <button type="button" class="dlab-btn dlab-btn--ghost" data-hd="cleanup">Dọn bàn</button>
            <button type="button" class="dlab-btn dlab-btn--ghost" data-hd="quality">Đồ họa: Cao</button>
            <button type="button" class="dlab-btn dlab-btn--ghost" data-hd="full">Toàn màn hình</button>
          </div>
        </details>
        <button type="button" class="dlab-btn dlab-btn--accent" data-hd="ai">Hỏi ChemAI</button>
      </div>
    </header>
    <section class="dlab-gstrip" hidden aria-label="Bước hướng dẫn hiện tại" aria-live="polite"></section>
    <main class="dlab-stage">
      <canvas class="dlab-canvas" tabindex="0" role="application" aria-label="Bàn thí nghiệm. Chọn một vật để thấy thao tác ở thanh phía trên. Phím tắt: mũi tên di chuyển, [ ] nghiêng, Enter thao tác chính, Ctrl+Z hoàn tác, Space tạm dừng."></canvas>
      <div class="dlab-3d" hidden></div>
      <div class="dlab-labels" aria-hidden="true"></div>
      <div class="dlab-actionbar" role="toolbar" aria-label="Thao tác với vật đang chọn"></div>
      <button type="button" class="dlab-btn dlab-fab dlab-fab--lib" data-hd="lib" aria-controls="dlab-lib">${icon('library')}<span>Thư viện</span></button>
      <button type="button" class="dlab-btn dlab-fab dlab-fab--side" data-hd="side" aria-controls="dlab-insp">${icon('panel')}<span>Quan sát</span></button>
      <aside class="dlab-lib dlab-drawer" id="dlab-lib" aria-label="Thư viện dụng cụ và hóa chất">
        <div class="dlab-drawer-head"><h3>Tủ hóa chất &amp; kệ dụng cụ</h3><button type="button" class="dlab-btn dlab-btn--icon dlab-btn--ghost" data-close="lib" aria-label="Thu gọn thư viện">${icon('close')}</button></div>
        <label class="dlab-searchbox">${icon('search')}<input type="search" class="dlab-search dlab-in" placeholder="Tìm tên hoặc công thức: nước, CuSO4, kẹp…" aria-label="Tìm hóa chất hoặc dụng cụ (có dấu, không dấu, công thức)"></label>
        <div class="dlab-tabs dlab-shelves" role="tablist" aria-label="Khu vực">${tabs}</div>
        <div class="dlab-groups" role="group" aria-label="Nhóm"></div>
        <ul class="dlab-lib-list"></ul>
        <p class="dlab-hint dlab-lib-foot">Bấm để lấy ra bàn · kéo thả vào cốc</p>
      </aside>
      <aside class="dlab-side dlab-drawer" id="dlab-insp" aria-label="Quan sát và thông tin">
        <div class="dlab-drawer-head">
          <div class="dlab-sidetabs" role="tablist" aria-label="Bảng bên phải">
            <button type="button" role="tab" class="dlab-tab" data-side-tab="obs" aria-selected="true">Quan sát</button>
            <button type="button" role="tab" class="dlab-tab" data-side-tab="detail" aria-selected="false">Chi tiết vật</button>
            <button type="button" role="tab" class="dlab-tab" data-side-tab="discover" aria-selected="false">Khám phá</button>
          </div>
          <button type="button" class="dlab-btn dlab-btn--icon dlab-btn--ghost" data-close="side" aria-label="Thu gọn bảng quan sát">${icon('close')}</button>
        </div>
        <div class="dlab-obs-pane">
          <section class="dlab-guided" hidden aria-label="Hướng dẫn thực hành"></section>
          <div class="dlab-obs"></div>
        </div>
        <div class="dlab-detail-pane" hidden><div class="dlab-inspector"></div></div>
        <div class="dlab-discover-pane" hidden></div>
      </aside>
      <footer class="dlab-dock" aria-label="Điều khiển mô phỏng">
        <button type="button" class="dlab-btn" data-tb="play" aria-pressed="false">${icon('pause')}<span>Tạm dừng</span></button>
        <div class="dlab-seg dlab-speeds" role="group" aria-label="Tốc độ mô phỏng">${speeds}</div>
        <span class="dlab-time" aria-live="off" title="Thời gian trong mô phỏng, không phải thời gian thực. Ở 4×, mỗi giây thực bằng 4 giây mô phỏng.">Mô phỏng 0:00</span>
        <span class="dlab-dock-sep" aria-hidden="true"></span>
        <button type="button" class="dlab-btn" data-tb="undo">${icon('undo')}<span>Hoàn tác</span></button>
        <button type="button" class="dlab-btn" data-tb="reset">${icon('reset')}<span>Đặt lại</span></button>
        <button type="button" class="dlab-btn" data-tb="fit" title="Đưa toàn bộ dụng cụ vào khung nhìn">${icon('fit')}<span>Vừa khung</span></button>
        <button type="button" class="dlab-btn" data-tb="labels">${icon('tag')}<span>Nhãn: Tất cả</span></button>
        <button type="button" class="dlab-btn dlab-btn--cam" data-tb="home3d" hidden title="Góc mặc định: đưa camera 3D về góc nhìn ban đầu">${icon('home')}<span>Góc mặc định</span></button>
        <button type="button" class="dlab-btn dlab-btn--cam" data-tb="focus3d" hidden title="Nhìn vật chọn: phóng camera tới vật đang chọn (phím F)">${icon('search')}<span>Nhìn vật chọn</span></button>
      </footer>
      <figure class="dlab-loupe" hidden><canvas aria-hidden="true"></canvas><figcaption>Phóng to vùng phản ứng <span class="dlab-loupe-x"></span></figcaption><button type="button" class="dlab-btn dlab-btn--icon dlab-btn--ghost" data-loupe-close aria-label="Ẩn khung phóng to">${icon('close')}</button></figure>
      <section class="dlab-coach" role="dialog" aria-modal="false" aria-labelledby="dlab-coach-title" hidden></section>
      <div class="dlab-toast" hidden></div>
    </main>
    <dialog class="dlab-dialog"></dialog>
    <div class="dlab-live sr-only" aria-live="polite"></div>
  </div>`
}
