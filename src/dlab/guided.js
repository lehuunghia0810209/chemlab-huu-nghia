// Guided Labs: data only. They place equipment through the same commands as Sandbox and
// check progress by reading the shared simulation state — no separate animation system.
import { surfaceY, byId, volumeOf, coatCoverage } from './engine/processes.js'
import { mix, reagentParcel, oilBelow } from './engine/chemistry.js'
import { REAGENT_BY_ID } from './data/materials.js'

const add = (sim, equipmentType, x, extra = {}) => sim.dispatch({ type: 'add', equipmentType, x, y: extra.y ?? 0, ...extra }, { record: false }).id
const fill = (sim, id, reagent, mL) => sim.dispatch({ type: 'addReagentTo', id, reagent, mL }, { record: false })
const obj = (state, id) => byId(state, id)
const fmtML = v => String(+v.toFixed(v < 10 ? 2 : 1)).replace('.', ',')
// How many more mL of a reagent the model needs before `reached(contents)` holds, found by bisection on
// copies of the vessel's contents with the same mix() the simulation uses (monotone for one added reagent).
// Returns 0 when already reached, null when even maxML is not enough.
export function moreToAdd(contents, reagentId, reached, maxML = 20) {
  const trial = mL => { const c = JSON.parse(JSON.stringify(contents)); if (mL > 0) mix(c, reagentParcel(REAGENT_BY_ID[reagentId], mL)); return reached(c) }
  if (trial(0)) return 0
  if (!trial(maxML)) return null
  let lo = 0, hi = maxML
  while (hi - lo > 0.025) { const mid = (lo + hi) / 2; if (trial(mid)) hi = mid; else lo = mid }
  return hi
}
const memo = new Map()
const memoOnce = (key, fn) => { if (!memo.has(key)) { if (memo.size > 50) memo.clear(); memo.set(key, fn()) } return memo.get(key) }
const cuOH2 = c => (c.precipitates['Cu(OH)2'] || 0) > 2e-4
const papersIn = (state, cid) => state.objects.filter(o => o.type === 'litmusPaper' && o.seg?.some(s => s.wet > 0.4) && (o.inside === cid || o.touched?.[0] === cid))
const solidsIn = (s, reagent, cid) => s.objects.filter(o => o.type === 'solid' && o.reagent === reagent && o.in === cid)
const consumedMol = o => Math.max(0, ((o.mass0 ?? o.massG) - o.massG)) / REAGENT_BY_ID[o.reagent].molarMass

export const GUIDED = [
  {
    id: 'acid-base',
    group: 'Axit, bazơ và chất chỉ thị',
    title: 'Nhận biết dung dịch axit, bazơ, trung tính',
    goal: 'Dùng giấy quỳ tím và phenolphtalein để xác định ba dung dịch không nhãn A, B, C; sau đó trung hòa dung dịch bazơ.',
    knowledge: 'Axit làm quỳ tím hóa đỏ, bazơ làm quỳ hóa xanh; phenolphtalein không màu trong axit/trung tính, hồng trong bazơ (pH > 8,2).',
    equipment: ['3 ống nghiệm trên giá', 'Giấy quỳ tím', 'Ống nhỏ giọt', 'Chai phenolphtalein', 'Chai HCl'],
    chemicals: ['HCl 0,5 M (A)', 'NaOH 0,5 M (B)', 'NaCl 0,5 M (C)', 'Phenolphtalein'],
    safety: 'HCl và NaOH ăn mòn: đeo kính, không nếm hay ngửi trực tiếp.',
    hideContents: true, // the task is to identify A, B, C: their labels must not name the solution
    setup(sim) {
      const rack = add(sim, 'rack', 330)
      const A = add(sim, 'testTube', 300, { label: 'Ống A' })
      const B = add(sim, 'testTube', 330, { label: 'Ống B' })
      const C = add(sim, 'testTube', 360, { label: 'Ống C' })
      for (const id of [A, B, C]) sim.dispatch({ type: 'move', id, x: obj(sim.state, id).x, y: 0 }, { record: false })
      fill(sim, A, 'hcl', 8)
      fill(sim, B, 'naoh', 8)
      fill(sim, C, 'nacl', 8)
      const paper = sim.dispatch({ type: 'newLitmus', x: 200 }, { record: false }).id
      const dropper = add(sim, 'dropper', 470, { y: 140 })
      const phph = add(sim, 'bottle', 560, { reagent: 'phenolphthalein' })
      const acid = add(sim, 'bottle', 630, { reagent: 'hcl' })
      return { rack, A, B, C, paper, dropper, phph, acid }
    },
    steps: [
      { text: 'Nhúng đầu giấy quỳ vào ống A rồi quan sát màu.', done: 'Giấy quỳ ướt trong ống A và đổi màu.', help: 'Chọn giấy quỳ → “Nhúng vào” Ống A → Nhúng. Hoặc kéo giấy xuống miệng ống A.', target: ['paper', 'A'], check: (s, r) => papersIn(s, r.A).length > 0 },
      { text: 'Lấy giấy quỳ mới (Tủ hóa chất → Giấy quỳ tím), nhúng vào ống B.', done: 'Có giấy quỳ đã nhúng trong ống B.', help: 'Tủ hóa chất → Giấy quỳ tím (hoặc chọn giấy cũ → Chi tiết → Lấy giấy quỳ mới), rồi nhúng vào Ống B.', target: ['B'], check: (s, r) => papersIn(s, r.B).length > 0 },
      { text: 'Lấy giấy quỳ mới, nhúng vào ống C.', done: 'Có giấy quỳ đã nhúng trong ống C.', help: 'Lấy giấy quỳ mới từ Tủ hóa chất rồi nhúng vào Ống C.', target: ['C'], check: (s, r) => papersIn(s, r.C).length > 0 },
      { text: 'Hút phenolphtalein bằng ống nhỏ giọt, nhỏ 2–3 giọt vào ống làm quỳ hóa xanh.', done: 'Ống B có phenolphtalein.', help: 'Chọn ống nhỏ giọt → “Hút từ” chai Phenolphtalein → “Nhỏ vào” Ống B → 1 giọt (vài lần).', target: ['dropper', 'phph', 'B'], check: (s, r) => (obj(s, r.B).contents.indicators.phenolphthalein || 0) > 0 },
      { text: 'Thêm từ từ HCl vào ống B đến khi vừa mất màu hồng.', done: 'Màu hồng trong ống B biến mất (pH < 8,2).', help: 'Chọn chai HCl → Rót khoảng 7 mL vào Ống B, rồi nhỏ tiếp từng ít (rót hoặc dùng ống nhỏ giọt sạch) đến khi vừa mất màu hồng.', target: ['acid', 'B'], check: (s, r) => { const b = obj(s, r.B); return (b.contents.indicators.phenolphthalein || 0) > 0 && (b.contents.ions['Cl-'] || 0) > 0 && b.pH != null && b.pH < 8.2 && s.notes[`neutral-${r.B}`] != null } }
    ],
    observe: 'A: quỳ đỏ. B: quỳ xanh, phenolphtalein hồng. C: quỳ không đổi màu. Thêm axit vào B, màu hồng biến mất khi pH < 8,2.',
    explain: 'HCl phân li tạo H⁺ (pH < 7). NaOH tạo OH⁻ (pH > 7). NaCl là muối của axit mạnh và bazơ mạnh nên trung tính. H⁺ + OH⁻ → H₂O làm pH giảm dần.',
    conclusion: 'A là dung dịch axit, B là dung dịch bazơ, C là dung dịch có môi trường trung tính (ở đây là dung dịch muối NaCl). Phản ứng trung hòa giữa axit và bazơ tạo muối và nước, tỏa nhiệt.'
  },
  {
    id: 'precipitate',
    group: 'Kết tủa, hòa tan và kết tinh',
    title: 'Tạo kết tủa Cu(OH)₂ rồi hòa tan bằng axit',
    goal: 'Quan sát kết tủa xanh lam hình thành, lắng xuống, rồi tan trong axit; hòa tan muối ăn.',
    knowledge: 'Cu²⁺ + 2OH⁻ → Cu(OH)₂↓ (xanh lam). Cu(OH)₂ là bazơ không tan, tan trong axit: Cu(OH)₂ + 2H⁺ → Cu²⁺ + 2H₂O.',
    equipment: ['Cốc 100 mL', 'Ống nhỏ giọt', 'Đũa thủy tinh', 'Chai NaOH, HCl', 'Thìa', 'Cốc nước'],
    chemicals: ['CuSO₄ 0,5 M', 'NaOH 0,5 M', 'HCl 0,5 M', 'NaCl rắn'],
    safety: 'Muối đồng độc khi nuốt; NaOH, HCl ăn mòn.',
    setup(sim) {
      const beaker = add(sim, 'beaker100', 300)
      fill(sim, beaker, 'cuso4', 20)
      const naoh = add(sim, 'bottle', 460, { reagent: 'naoh' })
      const hcl = add(sim, 'bottle', 530, { reagent: 'hcl' })
      const dropper = add(sim, 'dropper', 400, { y: 150 })
      const rod = add(sim, 'rod', 220, { y: 60 })
      const water = add(sim, 'beaker100', 640)
      fill(sim, water, 'water', 40)
      const spatula = add(sim, 'spatula', 720, { y: 120 })
      return { beaker, naoh, hcl, dropper, rod, water, spatula }
    },
    steps: [
      { text: 'Nhỏ dung dịch NaOH vào cốc CuSO₄ đến khi có kết tủa xanh lam bền. Theo mô hình cần khoảng 3 mL NaOH 0,5 M (60 giọt).', done: 'Xuất hiện kết tủa xanh lam Cu(OH)₂ trong cốc.', help: 'Chọn ống nhỏ giọt → “Hút từ” chai NaOH (mỗi lần hút đầy 2 mL) → “Nhỏ vào” Cốc A → “10 giọt” hoặc nhập số mL rồi “Nhỏ”. Hết dung dịch thì bấm “Hút thêm”. Dòng tiến độ cho biết còn thiếu bao nhiêu. Cách nhanh: chọn chai NaOH → Rót 3 mL vào Cốc A. Lưu ý mô hình: dung dịch được coi là trộn đều tức thì, nên kết tủa chỉ bền khi đủ NaOH; trong ống nghiệm thật thường thấy vẩn xanh ngay chỗ giọt rơi từ những giọt đầu.', target: ['naoh', 'dropper', 'beaker'], check: (s, r) => cuOH2(obj(s, r.beaker).contents),
        // Quantitative feedback straight from the model: what has been added and what is still needed.
        progress: (s, r) => {
          const c = obj(s, r.beaker).contents
          const added = (c.ions['Na+'] || 0) / REAGENT_BY_ID.naoh.M * 1000
          if (added < 0.01) return 'Chưa nhỏ NaOH vào Cốc A.'
          const more = memoOnce(JSON.stringify(c.ions) + volumeOf(obj(s, r.beaker)).toFixed(3), () => moreToAdd(c, 'naoh', cuOH2))
          if (more === 0) return `Đã thêm ${fmtML(added)} mL NaOH: kết tủa Cu(OH)₂ đã xuất hiện.`
          if (more == null) return `Đã thêm ${fmtML(added)} mL NaOH vào Cốc A.`
          return `Đã thêm ${fmtML(added)} mL NaOH vào Cốc A, chưa có kết tủa bền. Cần thêm khoảng ${fmtML(Math.ceil(more * 20) / 20)} mL (${Math.ceil(more / 0.05)} giọt) nữa.`
        } },
      { text: 'Để yên và quan sát kết tủa lắng xuống đáy.', done: 'Phần lớn kết tủa đã nằm ở đáy cốc.', help: 'Không khuấy. Chờ, tăng tốc 4×, hoặc bấm “Tua đến hiện tượng”.', wait: () => true, target: ['beaker'], check: (s, r) => { const v = obj(s, r.beaker).vis.parts; return v.length > 5 && v.filter(p => p.settled).length / v.length > 0.6 } },
      { text: 'Dùng đũa thủy tinh khuấy: kết tủa lơ lửng trở lại.', done: 'Kết tủa lơ lửng trở lại trong dung dịch.', help: 'Chọn đũa thủy tinh → “Khuấy” Cốc A.', target: ['rod', 'beaker'], check: (s, r) => obj(s, r.beaker).vis.stir > 0.3 },
      { text: 'Nhỏ HCl vào cốc đến khi kết tủa tan hết, dung dịch xanh trong trở lại.', done: 'Không còn kết tủa, dung dịch xanh trong.', help: 'Chọn chai HCl → Rót khoảng 10–15 mL vào Cốc A, hoặc nhỏ nhiều lần bằng ống nhỏ giọt đến khi kết tủa tan hết.', wait: (s, r) => (obj(s, r.beaker).pH ?? 7) < 4, target: ['hcl', 'beaker'], check: (s, r) => { const b = obj(s, r.beaker); const c = b.contents; return s.notes[`ppt-Cu(OH)2-${r.beaker}`] != null && !((c.precipitates['Cu(OH)2'] || 0) > 1e-7) && (c.ions['Cl-'] || 0) > 1e-4 && (c.ions['Cu2+'] || 0) > 1e-3 && b.pH != null && b.pH < 7 } },
      { text: 'Dùng thìa lấy 2 g muối ăn thả vào cốc nước, khuấy và quan sát muối tan.', done: 'Muối ăn trong cốc nước tan gần hết (còn dưới 0,2 g).', help: 'Chọn thìa → “Muối ăn (tinh thể)”, 2 g → Lấy → Thả vào Cốc B (nước). Khuấy giúp tan nhanh.', need: [{ reagent: 'nacl-s', massG: 2 }], wait: (s, r) => s.objects.some(o => o.type === 'solid' && o.reagent === 'nacl-s' && o.in === r.water), target: ['spatula', 'water'], check: (s, r) => { const p = solidsIn(s, 'nacl-s', r.water); return p.length > 0 && p.reduce((a, o) => a + (o.mass0 ?? o.massG) - o.massG, 0) >= 1.8 && p.every(o => o.massG < 0.2) } }
    ],
    observe: 'Kết tủa xanh lam xuất hiện ở chỗ giọt NaOH rơi xuống, lắng dần; khuấy thì lơ lửng. Thêm HCl, kết tủa tan. Muối ăn tan dần, nhanh hơn khi khuấy.',
    explain: 'Kết tủa tạo thành khi tích nồng độ ion vượt Ksp. Axit làm giảm [OH⁻] nên Cu(OH)₂ tan lại. Khuấy tăng tốc độ khuếch tán nên muối tan nhanh hơn.',
    conclusion: 'Bazơ không tan tác dụng với axit; độ tan và tốc độ hòa tan phụ thuộc điều kiện.'
  },
  {
    id: 'metals',
    group: 'Kim loại và phản ứng trong dung dịch',
    title: 'Kim loại tác dụng với dung dịch muối, axit và nước',
    goal: 'Quan sát Fe đẩy Cu khỏi dung dịch CuSO₄, Zn tác dụng với axit, Na tác dụng với nước.',
    knowledge: 'Dãy hoạt động: Na > Mg > Zn > Fe > (H) > Cu > Ag. Từ Mg trở về sau, kim loại hoạt động mạnh hơn đẩy kim loại yếu hơn ra khỏi dung dịch muối (kim loại kiềm như Na tác dụng với nước trước, không đẩy trực tiếp kim loại khỏi dung dịch muối). Kim loại đứng trước H đẩy H₂ ra khỏi dung dịch axit không có tính oxi hóa mạnh như HCl, H₂SO₄ loãng (không áp dụng cho HNO₃).',
    equipment: ['2 cốc 100 mL', 'Chậu thủy tinh', 'Kẹp hóa chất', 'Ống nhỏ giọt'],
    chemicals: ['CuSO₄ 0,5 M', 'HCl 0,5 M', 'Đinh sắt', 'Kẽm viên', 'Natri', 'Phenolphtalein'],
    safety: 'Natri phản ứng mãnh liệt với nước: chỉ dùng mẩu nhỏ, dùng kẹp, đứng xa.',
    setup(sim) {
      const cu = add(sim, 'beaker100', 260)
      fill(sim, cu, 'cuso4', 40)
      const acid = add(sim, 'beaker100', 360)
      fill(sim, acid, 'hcl', 40)
      const dish = add(sim, 'dish', 530)
      fill(sim, dish, 'water', 150)
      fill(sim, dish, 'phenolphthalein', 0.15)
      const tongs = add(sim, 'tongs', 680, { y: 150 })
      return { cu, acid, dish, tongs }
    },
    steps: [
      { text: 'Chọn kẹp, lấy đinh sắt và thả vào cốc CuSO₄.', done: 'Đinh sắt nằm trong Cốc A (CuSO₄).', help: 'Chọn Kẹp hóa chất → “Đinh sắt”, 2 g → Lấy → Thả vào Cốc A.', need: [{ reagent: 'fe', massG: 2 }], target: ['tongs', 'cu'], check: (s, r) => s.objects.some(o => o.type === 'solid' && o.reagent === 'fe' && o.in === r.cu) },
      { text: 'Chờ đến khi lớp đồng đỏ bám rõ trên đinh sắt.', done: 'Đinh có lớp Cu đỏ bám rõ (lớp phủ đạt hơn nửa độ đậm; với đinh 2 g là khoảng 0,8 mmol Cu).', help: 'Chờ, tăng tốc 4×, hoặc bấm “Tua đến hiện tượng”. Tốc độ tỉ lệ với diện tích bề mặt, nên độ dày lớp đồng tăng như nhau với đinh lớn hay nhỏ.', wait: () => true, target: ['cu'], check: (s, r) => s.objects.some(o => o.type === 'solid' && o.reagent === 'fe' && o.in === r.cu && coatCoverage(o) >= 8e-4 / 1.5e-3) },
      { text: 'Dùng kẹp lấy kẽm viên thả vào cốc HCl, quan sát bọt khí.', done: 'Kẽm nằm trong Cốc B (HCl) và có bọt khí H₂.', help: 'Kẹp phải đang trống. Chọn kẹp → “Kẽm (viên)” → Lấy → Thả vào Cốc B.', need: [{ reagent: 'zn', massG: 0.5 }], wait: (s, r) => s.objects.some(o => o.type === 'solid' && o.reagent === 'zn' && o.in === r.acid), target: ['tongs', 'acid'], check: (s, r) => solidsIn(s, 'zn', r.acid).reduce((a, o) => a + consumedMol(o), 0) > 2e-5 && (obj(s, r.acid).gasOut?.H2 || 0) > 2e-5 },
      { text: 'Dùng kẹp lấy mẩu natri 0,1 g thả vào chậu nước có phenolphtalein.', done: 'Mẩu natri nằm trong Chậu C.', help: 'Chọn kẹp → “Natri (mẩu)”, 0,1 g → Lấy → xác nhận cảnh báo → Thả vào Chậu C.', need: [{ reagent: 'na', massG: 0.1 }], target: ['tongs', 'dish'], check: (s, r) => s.objects.some(o => o.type === 'solid' && o.reagent === 'na' && o.in === r.dish) },
      { text: 'Quan sát đến khi natri tan hết.', done: 'Mẩu natri đã phản ứng hết.', help: 'Chờ, tăng tốc 4×, hoặc bấm “Tua đến hiện tượng”.', wait: () => true, target: ['dish'], check: (s, r) => s.objects.some(o => o.type === 'solid' && o.reagent === 'na' && o.in === r.dish && o.massG <= 0) }
    ],
    observe: 'Đinh sắt phủ lớp đỏ, dung dịch nhạt màu xanh. Kẽm sủi bọt khí. Natri nổi, chạy trên mặt nước, tan dần; vệt hồng lan ra từ vị trí mẩu natri.',
    explain: 'Fe + Cu²⁺ → Fe²⁺ + Cu. Zn + 2H⁺ → Zn²⁺ + H₂. 2Na + 2H₂O → 2NaOH + H₂; NaOH làm phenolphtalein hóa hồng. Khí sinh ra không đều đẩy mẩu natri chuyển động.',
    conclusion: 'Mức độ hoạt động của kim loại quyết định phản ứng xảy ra hay không và mạnh hay yếu.'
  },
  {
    id: 'electrolysis',
    group: 'Điện phân và điện hóa',
    title: 'Điện phân dung dịch CuCl₂ và pin Zn–Cu',
    goal: 'Quan sát đồng bám ở catot, khí clo ở anot; đo suất điện động pin Daniell.',
    knowledge: 'Điện phân CuCl₂: catot Cu²⁺ + 2e → Cu; anot 2Cl⁻ → Cl₂ + 2e. m(Cu) = A·I·t/(n·F). Pin Zn–Cu: E° = 1,10 V.',
    equipment: ['Cốc 100 mL', 'Cặp điện cực than chì', 'Nguồn điện một chiều', '2 cốc cho pin', 'Cầu muối', 'Vôn kế'],
    chemicals: ['CuCl₂ 0,5 M', 'ZnSO₄ 0,5 M', 'CuSO₄ 0,5 M', 'Thanh Zn, dây Cu'],
    safety: 'Khí Cl₂ độc: chỉ điện phân trong tủ hút, dòng nhỏ, thời gian ngắn.',
    setup(sim) {
      const cell = add(sim, 'beaker100', 260)
      fill(sim, cell, 'cucl2', 50)
      const el = add(sim, 'electrodes', 380, { y: 110 })
      const power = add(sim, 'power', 160)
      const zn = add(sim, 'beaker100', 520)
      fill(sim, zn, 'znso4', 50)
      const cuB = add(sim, 'beaker100', 660)
      fill(sim, cuB, 'cuso4', 50)
      const tongs = add(sim, 'tongs', 780, { y: 150 })
      const bridge = add(sim, 'bridge', 590, { y: 130 })
      const volt = add(sim, 'voltmeter', 590, { y: 0 })
      return { cell, el, power, zn, cuB, tongs, bridge, volt }
    },
    steps: [
      { text: 'Kéo cặp điện cực nhúng vào cốc CuCl₂.', done: 'Hai đầu điện cực ngập trong dung dịch CuCl₂.', help: 'Kéo cặp điện cực tới phía trên Cốc A rồi kéo xuống cho tới khi đầu điện cực ngập trong dung dịch.', target: ['el', 'cell'], check: (s, r) => { const e = obj(s, r.el); const c = obj(s, r.cell); return Math.abs(e.x - c.x) < 20 && surfaceY(c) >= e.y + 4 } },
      { text: 'Chọn nguồn điện, nối dây tới điện cực, đặt 6 V rồi bật nguồn.', done: 'Có dòng điện chạy qua dung dịch.', help: 'Chọn nguồn → Chi tiết → Nối dây tới điện cực → nhập 6 V → Bật nguồn → xác nhận cảnh báo khí Cl₂.', target: ['power'], check: (s, r) => (obj(s, r.power).current || 0) > 0 && s.wires.some(w => (w.from === r.power && w.to === r.el) || (w.from === r.el && w.to === r.power)) },
      { text: 'Quan sát 60 giây mô phỏng: đồng bám ở catot (−), bọt khí vàng lục ở anot (+).', done: 'Catot có lớp đồng bám (từ 0,2 mmol Cu).', help: 'Giữ nguồn bật. Chờ, tăng tốc 4×, hoặc bấm “Tua đến hiện tượng”.', wait: (s, r) => (obj(s, r.power).current || 0) > 0, target: ['el'], check: (s, r) => (obj(s, r.el).cuDeposit || 0) > 2e-4 },
      { text: 'Dùng kẹp thả kẽm vào cốc ZnSO₄ và dây đồng vào cốc CuSO₄.', done: 'Kẽm trong Cốc B (ZnSO₄), dây đồng trong Cốc C (CuSO₄).', help: 'Chọn kẹp → “Kẽm (viên)” → Lấy → Thả vào Cốc B; rồi “Dây đồng” → Lấy → Thả vào Cốc C.', need: [{ reagent: 'zn', massG: 2, into: 'zn' }, { reagent: 'cu', massG: 2, into: 'cuB' }], target: ['tongs', 'zn', 'cuB'], check: (s, r) => s.objects.some(o => o.reagent === 'zn' && o.in === r.zn) && s.objects.some(o => o.reagent === 'cu' && o.in === r.cuB) },
      { text: 'Nối cầu muối giữa hai cốc và nối hai dây vôn kế vào thanh Zn và Cu.', done: 'Vôn kế chỉ khoảng 1,1 V.', help: 'Chọn cầu muối → Chi tiết → chọn Cốc B và Cốc C → Đặt cầu muối. Chọn vôn kế → nối dây tới Kẽm, rồi tới Dây đồng.', target: ['bridge', 'volt'], check: (s, r) => obj(s, r.volt).reading > 1 }
    ],
    observe: 'Catot phủ lớp đồng đỏ, anot sủi bọt khí vàng lục; màu xanh dung dịch nhạt dần. Vôn kế chỉ khoảng 1,10 V.',
    explain: 'Dòng điện một chiều khử Cu²⁺ ở catot và oxi hóa Cl⁻ ở anot; lượng chất theo định luật Faraday. Pin Zn–Cu biến hóa năng thành điện năng; Zn là cực âm.',
    conclusion: 'Điện phân dùng điện năng gây phản ứng oxi hóa – khử; pin điện hóa sinh điện năng từ phản ứng oxi hóa – khử.'
  },
  {
    id: 'organic',
    group: 'Hóa học hữu cơ',
    title: 'Axit axetic, tính tan và phân lớp chất lỏng',
    goal: 'Nhận biết tính axit của CH₃COOH, phản ứng với NaHCO₃; so sánh etanol và dầu ăn khi trộn với nước.',
    knowledge: 'CH₃COOH là axit yếu (Ka = 1,75·10⁻⁵): làm quỳ hóa đỏ, tác dụng với muối cacbonat giải phóng CO₂. Etanol tan vô hạn trong nước; dầu ăn không tan, nhẹ hơn nước nên nổi lên trên.',
    equipment: ['3 ống nghiệm', 'Giấy quỳ', 'Thìa', 'Chai nước, etanol, dầu ăn'],
    chemicals: ['CH₃COOH 1 M', 'NaHCO₃ rắn', 'Nước', 'Etanol', 'Dầu ăn'],
    safety: 'Etanol dễ cháy; axit axetic gây kích ứng mắt.',
    setup(sim) {
      const acid = add(sim, 'testTube', 260)
      fill(sim, acid, 'ch3cooh', 8)
      const t2 = add(sim, 'testTube', 340)
      fill(sim, t2, 'water', 6)
      const t3 = add(sim, 'testTube', 400)
      fill(sim, t3, 'water', 6)
      const oil = add(sim, 'bottle', 500, { reagent: 'oil' })
      const eth = add(sim, 'bottle', 570, { reagent: 'ethanol' })
      const spatula = add(sim, 'spatula', 660, { y: 140 })
      const paper = sim.dispatch({ type: 'newLitmus', x: 180 }, { record: false }).id
      return { acid, t2, t3, oil, eth, spatula, paper }
    },
    steps: [
      { text: 'Nhúng giấy quỳ vào ống CH₃COOH.', done: 'Giấy quỳ đã nhúng trong Ống nghiệm A (CH₃COOH).', help: 'Chọn giấy quỳ → “Nhúng vào” Ống nghiệm A → Nhúng.', target: ['paper', 'acid'], check: (s, r) => papersIn(s, r.acid).length > 0 },
      { text: 'Dùng thìa lấy NaHCO₃ (0,5 g) thả vào ống axit axetic, quan sát bọt khí.', done: 'Có khí CO₂ thoát ra.', help: 'Chọn thìa → “Bột NaHCO₃”, 0,5 g → Lấy → Thả vào Ống nghiệm A.', need: [{ reagent: 'nahco3-s', massG: 0.5 }], wait: (s, r) => s.objects.some(o => o.type === 'solid' && o.reagent === 'nahco3-s' && o.in === r.acid), target: ['spatula', 'acid'], check: (s, r) => (obj(s, r.acid).gasOut?.CO2 || 0) > 1e-5 && solidsIn(s, 'nahco3-s', r.acid).length > 0 },
      { text: 'Rót khoảng 3 mL dầu ăn vào ống B (nước).', done: 'Ống nghiệm B có dầu ăn.', help: 'Chọn chai Dầu ăn → Rót 3 mL vào Ống nghiệm B.', target: ['oil', 't2'], check: (s, r) => { const c = obj(s, r.t2).contents; return (c.liquids.oil || 0) > 1 && (c.liquids.water || 0) > 1 && !oilBelow(c) } },
      { text: 'Rót khoảng 3 mL etanol vào ống C (nước).', done: 'Ống nghiệm C có etanol.', help: 'Chọn chai Etanol → Rót 3 mL vào Ống nghiệm C.', target: ['eth', 't3'], check: (s, r) => { const c = obj(s, r.t3).contents; return (c.liquids.ethanol || 0) > 1 && (c.liquids.water || 0) > 1 && !((c.liquids.oil || 0) > 0.01) } }
    ],
    observe: 'Quỳ hóa đỏ. NaHCO₃ sủi bọt khí không màu. Ống 2 tách hai lớp: dầu vàng nổi trên nước. Ống 3 đồng nhất một lớp.',
    explain: 'CH₃COOH + NaHCO₃ → CH₃COONa + CO₂ + H₂O. Dầu ăn không phân cực, không tan trong nước và có khối lượng riêng 0,92 g/mL < 1 g/mL. Etanol tạo liên kết hiđro với nước nên tan hoàn toàn.',
    conclusion: 'Axit hữu cơ có tính axit chung; tính tan phụ thuộc độ phân cực của chất.'
  }
]

export function guidedProgress(lab, state, roles) {
  let done = 0
  for (const step of lab.steps) {
    if (step.check(state, roles)) done += 1
    else break
  }
  return done
}

export { volumeOf }
