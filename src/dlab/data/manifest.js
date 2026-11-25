// Reaction & process support manifest — the single list of what the Dynamic Lab claims to model.
// Each entry carries a runnable demo (bench setup + one student action + expected engine result), used by
//   • scripts/test-dlab.mjs (registry test: every demo is run on the real engine),
//   • the Sandbox "Gợi ý khám phá" panel (it only lays out the equipment; the student performs the action),
//   • scripts/dlab-manifest.mjs (the report table).
// status: SUPPORTED | APPROX (educational approximation) | NO_REACTION | UNSUPPORTED | INVALID (blocked by safety).
// An entry without a demo names the unit tests (title prefixes in scripts/test-dlab.mjs) that check it; the registry
// test fails if a named test does not exist, and the report marks an entry with neither as not verified.
import { KINETIC, NO_REACTION, UNSUPPORTED_HINTS, ION_HINTS, SOLVENT_HINTS, ION_REDOX, ELECTRO } from './reactions.js'
import { PRECIPITATES } from './materials.js'

export const STATUS = {
  SUPPORTED: 'Được mô hình hóa',
  APPROX: 'Xấp xỉ giáo dục',
  NO_REACTION: 'Không phản ứng (trong điều kiện mô hình)',
  UNSUPPORTED: 'Chưa hỗ trợ — báo rõ, không tạo sản phẩm',
  INVALID: 'Điều kiện không hợp lệ — bị chặn vì an toàn'
}

// Solution that supplies a driver ion for a demo.
const SOURCE = { h: 'hcl', 'Cu2+': 'cuso4', 'Ag+': 'agno3', 'Zn2+': 'znso4', 'Fe2+': 'feso4', 'Fe3+': 'fecl3', 'Mg2+': 'mgcl2' }
const SOLID_NAME = { mg: 'Mg', zn: 'Zn', fe: 'Fe', cu: 'Cu', na: 'Na', caco3: 'CaCO₃' }

const kinetic = KINETIC.map(r => ({
  id: r.id,
  status: 'SUPPORTED',
  title: r.equation,
  group: r.solid === 'na' ? 'Kim loại kiềm' : r.driver === 'h' ? 'Axit tác dụng với chất rắn' : 'Kim loại tác dụng với dung dịch muối',
  inputs: `${SOLID_NAME[r.solid]} + ${r.driver === 'water' ? 'nước' : r.driver === 'h' ? 'HCl 0,5 M' : `dung dịch chứa ${r.driver}`}`,
  conditions: r.driver === 'h' ? 'Axit loãng, pH < 3, 25 °C (tốc độ tăng gấp đôi mỗi 10 °C)' : '25 °C, chất rắn nhúng trong dung dịch',
  products: [...Object.keys(r.gives || {}), ...Object.keys(r.gas || {}).map(g => `${g}↑`), ...Object.keys(r.deposit || {}).map(m => `${m} bám`)].join(', '),
  observe: r.observe,
  model: 'Động học bề mặt: tốc độ = k·diện tích·[tác nhân]; tỉ lượng và ΔH định lượng (NBS); hằng số k là xấp xỉ giáo dục để hiện tượng diễn ra trong vài chục giây.',
  source: 'Tỉ lượng: phương trình cân bằng; ΔH: NBS Tables 1982; k: mô hình',
  limits: r.driver === 'h' ? 'Tốc độ phản ứng không phải số đo thực nghiệm; với axit yếu (CH₃COOH) tốc độ chỉ tính theo [H⁺] nên chậm hơn thực tế.' : 'Tốc độ phản ứng không phải số đo thực nghiệm.',
  demo: {
    vessel: r.solid === 'na' ? 'beaker250' : 'beaker100',
    fill: [[r.driver === 'water' ? 'water' : SOURCE[r.driver], r.solid === 'na' ? 120 : 40]],
    solid: [r.solid, r.solid === 'na' ? 0.1 : r.solid === 'fe' ? 2 : 0.5],
    run: r.solid === 'fe' ? 40 : 15,
    expect: { gas: Object.keys(r.gas || {})[0], ion: Object.keys(r.gives || {})[0], deposit: Object.keys(r.deposit || {})[0] }
  }
}))

// Precipitations from the Ksp table (redox-only CuI is listed with the iodide reaction).
const PPT_DEMO = {
  AgCl: ['agno3', 'nacl'], AgI: ['agno3', 'ki'], BaSO4: ['bacl2', 'na2so4'], CaCO3: ['cacl2', 'na2co3'],
  'Cu(OH)2': ['cuso4', 'naoh'], 'Fe(OH)3': ['fecl3', 'naoh'], 'Fe(OH)2': ['feso4', 'naoh'], 'Mg(OH)2': ['mgcl2', 'naoh'],
  BaCO3: ['bacl2', 'na2co3'], ZnCO3: ['znso4', 'na2co3'], Ag2CO3: ['agno3', 'na2co3'], 'Zn(OH)2': ['znso4', 'naoh']
}
const precipitates = Object.entries(PRECIPITATES).filter(([, p]) => !p.redox).map(([key, p]) => ({
  id: `ppt-${key}`,
  status: 'SUPPORTED',
  title: `${p.formula}↓ (${p.name})`,
  group: 'Phản ứng tạo kết tủa',
  inputs: PPT_DEMO[key] ? `${PPT_DEMO[key][0].toUpperCase()} + ${PPT_DEMO[key][1].toUpperCase()}` : `ion ${p.cation} + ${p.anion}`,
  conditions: '25 °C, dung dịch loãng; kết tủa xuất hiện khi Q > 10·Ksp, tan lại khi Q < Ksp',
  products: `${p.formula}↓`,
  observe: `Kết tủa ${p.name.toLowerCase()} xuất hiện, lắng dần, tan lại khi điều kiện làm Q < Ksp.`,
  model: 'Cân bằng Ksp với pH tính theo cân bằng điện tích; nồng độ lý tưởng (hoạt độ = nồng độ).',
  source: `Ksp = ${p.Ksp} (CRC, 25 °C)`,
  limits: 'Ngưỡng tạo mầm 10·Ksp là xấp xỉ giáo dục; lực ion > 0,1 M làm số liệu kém chính xác.',
  demo: PPT_DEMO[key] ? { vessel: 'beaker100', fill: [[PPT_DEMO[key][0], 20]], pour: [PPT_DEMO[key][1], key.includes('OH') ? 6 : 20], run: 2, expect: { ppt: key } } : null
}))

const redox = ION_REDOX.map(r => ({
  id: `redox-${r.id}`,
  status: 'SUPPORTED',
  title: r.equation,
  group: 'Phản ứng oxi hóa – khử trong dung dịch',
  inputs: r.id === 'cu-i' ? 'CuCl₂ (hoặc CuSO₄) + KI' : 'FeCl₃ + KI',
  conditions: '25 °C, xảy ra ngay khi trộn',
  products: [...Object.keys(r.products), ...Object.keys(r.precipitate || {}).map(k => `${k}↓`)].join(', '),
  observe: r.observe,
  model: 'Phản ứng hoàn toàn theo chất thiếu (K ≫ 1 theo E°).',
  source: 'E° Cu²⁺/CuI 0,86 V; Fe³⁺/Fe²⁺ 0,771 V; I₂/I⁻ 0,5355 V (CRC)',
  limits: r.id === 'fe-i' ? 'Ở nồng độ < 1 mM, cân bằng thực còn vài % Fe³⁺ chưa phản ứng.' : 'Độ tan rất nhỏ của CuI (Ksp 1,27·10⁻¹²) được bỏ qua.',
  demo: { vessel: 'beaker100', fill: [[r.id === 'cu-i' ? 'cucl2' : 'fecl3', 10]], pour: ['ki', 20], run: 1, expect: { ion: 'I2', ppt: r.id === 'cu-i' ? 'CuI' : undefined } }
}))

const processes = [
  { id: 'neutralisation', status: 'SUPPORTED', title: 'H⁺ + OH⁻ → H₂O (trung hòa)', group: 'Axit – bazơ', inputs: 'HCl + NaOH (+ phenolphtalein)', conditions: '25 °C', products: 'NaCl, H₂O, nhiệt', observe: 'Màu chỉ thị đổi theo pH; dung dịch ấm lên.', model: 'pH từ cân bằng điện tích; nhiệt trung hòa −55,84 kJ/mol.', source: 'Kw 1,0·10⁻¹⁴; ΔH từ NBS', limits: 'Nhiệt dùng tổng H⁺/OH⁻ mất đi (có thể dư 1–2 °C khi kết tủa hiđroxit).', demo: { vessel: 'beaker100', fill: [['naoh', 20]], pour: ['hcl', 20], run: 1, expect: { note: 'neutral-' } } },
  { id: 'co2-carbonate', status: 'SUPPORTED', title: 'HCO₃⁻/CO₃²⁻ + H⁺ → CO₂↑', group: 'Axit – bazơ', inputs: 'NaHCO₃ + CH₃COOH (hoặc Na₂CO₃ + HCl)', conditions: '25 °C, 1 atm', products: 'CO₂↑', observe: 'Sủi bọt khí không màu.', model: 'Phân bố H₂CO₃/HCO₃⁻/CO₃²⁻ theo pH; khí thoát khi [H₂CO₃*] vượt độ tan Henry.', source: 'Ka1, Ka2 (CRC); Henry 3,4·10⁻² mol/(L·atm)', limits: 'Tốc độ thoát khí là xấp xỉ.', demo: { vessel: 'beaker100', fill: [['na2co3', 20]], pour: ['hcl', 20], run: 3, expect: { gas: 'CO2' } } },
  { id: 'dissolve-salts', status: 'SUPPORTED', title: 'Hòa tan và kết tinh NaCl, KNO₃, NaHCO₃', group: 'Hòa tan – kết tinh', inputs: 'Tinh thể + nước', conditions: '0–100 °C', products: 'Ion trong dung dịch; tinh thể khi quá bão hòa', observe: 'Tinh thể nhỏ dần; KNO₃ kết tinh lại khi làm nguội.', model: 'Độ tan theo bảng nhiệt độ (nội suy tuyến tính).', source: 'CRC Handbook (độ tan g/100 g nước)', limits: 'Tốc độ tan là xấp xỉ.', demo: { vessel: 'beaker100', fill: [['water', 20]], solid: ['nacl-s', 2], run: 20, expect: { ion: 'Na+' } } },
  { id: 'boiling', status: 'SUPPORTED', title: 'Đun sôi nước, etanol và hỗn hợp nước–etanol', group: 'Nhiệt – chuyển pha', inputs: 'Nước / etanol + bếp', conditions: '1 atm', products: 'Hơi nước, hơi etanol', observe: 'Nước sôi ở 100 °C; etanol ~78 °C; hỗn hợp sôi giữa hai giá trị, nhiệt độ sôi tăng dần.', model: 'Cân bằng nhiệt + điểm sôi và thành phần hơi theo bảng (nước–etanol).', source: 'CRC "Boiling points of aqueous solutions"; NIST WebBook (ΔvapH)', limits: 'Ống thủy tinh hở, áp suất 1 atm; không mô hình hơi bắt lửa.', demo: null, tests: ['solvent: ethanol is not water'] },
  { id: 'layers', status: 'SUPPORTED', title: 'Hòa tan / phân lớp: nước, etanol, dầu ăn', group: 'Nhiệt – chuyển pha', inputs: 'Nước + dầu; etanol + dầu; nước + etanol', conditions: '25 °C', products: '—', observe: 'Dầu nổi trên nước, chìm dưới etanol; nước và etanol tan hoàn toàn.', model: 'Khối lượng riêng hỗn hợp nước–etanol theo bảng; dầu không tan.', source: 'Lange\'s Handbook 1967 (khối lượng riêng 25 °C)', limits: 'Bỏ qua co thể tích khi trộn (≤ 3,5 %); dầu ăn coi như không tan trong etanol.', demo: { vessel: 'beaker100', fill: [['ethanol', 30]], pour: ['oil', 10], run: 1, expect: { oilBelow: true } } },
  { id: 'electrolysis-cucl2', status: 'SUPPORTED', title: ELECTRO.electrolysisCuCl2.equation, group: 'Điện hóa', inputs: 'Dung dịch CuCl₂, điện cực than chì, nguồn 1–12 V', conditions: 'U > 1,42 V; chỉ khi không có ion điện phân trước', products: 'Cu (catot), Cl₂↑ (anot)', observe: 'Đồng đỏ bám catot, khí vàng lục ở anot.', model: 'Định luật Faraday; I = (U − 1,02 − 0,4)/R.', source: 'F = 96485 C/mol (CODATA); điện trở bình: mô hình', limits: 'Điện trở và quá thế là minh họa; giai đoạn điện phân nước không được mô hình hóa.', demo: null, tests: ['electrolysis CuCl2 follows Faraday'] },
  { id: 'daniell', status: 'SUPPORTED', title: ELECTRO.daniell.equation, group: 'Điện hóa', inputs: 'Zn/ZnSO₄ ‖ CuSO₄/Cu, cầu muối KNO₃', conditions: '0–100 °C', products: 'Suất điện động', observe: 'Vôn kế chỉ ≈ 1,1 V; Zn là cực âm.', model: 'E = E°(T) − (RT ln10/2F)·lg([Zn²⁺]/[Cu²⁺]); dE°/dT từ ΔS° (NBS).', source: 'E° 1,10 V; S° NBS 1982', limits: 'Bỏ qua thế tiếp xúc lỏng (pin thật dốc hơn ≈ −0,3 mV/K) và ΔCp.', demo: null, tests: ['Daniell cell: Nernst voltage', 'Daniell cell: E follows E°(T)'] },
  { id: 'indicators', status: 'APPROX', title: 'Chất chỉ thị: quỳ tím, phenolphtalein, metyl da cam', group: 'Axit – bazơ', inputs: 'Giấy quỳ / vài giọt chỉ thị', conditions: 'Dung dịch nước (etanol ≤ 10 %)', products: '—', observe: 'Màu theo khoảng pH.', model: 'Phenolphtalein, metyl da cam: tỉ lệ dạng axit/bazơ theo pKin; quỳ tím: bảng màu định tính.', source: 'Harris, Quantitative Chemical Analysis', limits: 'Màu quỳ là định tính.', demo: null, tests: ['litmus: dipped part turns red', 'indicator colour spreads'] },
  { id: 'redissolve', status: 'SUPPORTED', title: 'Kết tủa hiđroxit tan trong axit', group: 'Phản ứng tạo kết tủa', inputs: 'Cu(OH)₂ + HCl', conditions: '25 °C', products: 'Cu²⁺', observe: 'Kết tủa xanh tan, dung dịch xanh trong.', model: 'Ksp + cân bằng điện tích: Q < Ksp thì kết tủa tan.', source: 'Ksp (CRC)', limits: '—', demo: null, tests: ['Cu(OH)2 forms with base and redissolves in acid'] }
]

const noReaction = [
  ...NO_REACTION.map(r => ({ id: `norx-${r.solid}-${r.driver}`, status: 'NO_REACTION', title: `${SOLID_NAME[r.solid]} + ${r.driver === 'h' ? 'axit loãng' : r.driver}`, group: 'Không phản ứng', inputs: `${SOLID_NAME[r.solid]} + ${r.driver === 'h' ? 'HCl' : SOURCE[r.driver]?.toUpperCase()}`, conditions: '25 °C', products: '—', observe: r.reason, model: 'Dãy hoạt động / E°', source: 'E° (CRC)', limits: '—', demo: { vessel: 'beaker100', fill: [[SOURCE[r.driver], 30]], solid: [r.solid, 1], run: 5, expect: { note: `norx-${r.solid}-` } } })),
  { id: 'norx-e0-fe-mg', status: 'NO_REACTION', title: 'Kim loại yếu + ion kim loại mạnh hơn (tự phân loại theo E°)', group: 'Không phản ứng', inputs: 'VD: Fe + MgCl₂', conditions: '25 °C', products: '—', observe: 'Báo "Không có phản ứng" kèm so sánh E°.', model: 'So sánh E° ion/kim loại', source: 'E° (CRC)', limits: 'Chỉ cho các cặp kim loại – ion có trong bảng E°.', demo: { vessel: 'beaker100', fill: [['mgcl2', 30]], solid: ['fe', 1], run: 5, expect: { note: 'norx-fe-Mg2+' } } }
]

// Real reagents that bring each unsupported combination together (inside its pH window), so the registry test
// checks that the engine really reports it, not only that the hint exists in the table.
const SOLID_HINT_DEMO = { 'NO3-+cu': 'hno3', 'Fe3++cu': 'fecl3', 'Fe3++fe': 'fecl3', 'Fe3++zn': 'fecl3', 'Fe3++mg': 'fecl3', 'SO4+caco3': 'h2so4', zn: 'naoh' }
const ION_HINT_DEMO = {
  'Ag+': [['agno3', 10], ['naoh', 3]], 'Ag++NH3': [['agno3', 10], ['nh3', 10]], 'Zn2++NH3': [['znso4', 10], ['nh3', 30]],
  'NO3-+I-': [['hno3', 10], ['ki', 10]], 'NO3-+Fe2+': [['hno3', 10], ['feso4', 10]], 'Ag++Fe2+': [['agno3', 10], ['feso4', 10]],
  'Cu2++CO3': [['cuso4', 5], ['na2co3', 30]], I2: [['fecl3', 5], ['ki', 10], ['naoh', 20]], 'Fe3++I-': [['ki', 20], ['naoh', 5], ['fecl3', 2]],
  'Zn2+': [['znso4', 5], ['naoh', 30]], 'Cu2++NH3': [['cuso4', 10], ['nh3', 30]]
}
const unsupported = [
  ...UNSUPPORTED_HINTS.map((r, i) => {
    const solid = r.all.find(k => SOLID_NAME[k])
    const liquid = SOLID_HINT_DEMO[r.all.join('+')]
    return { id: `unsup-${i}-${r.all.join('-')}`, status: 'UNSUPPORTED', title: r.all.join(' + '), group: 'Chưa hỗ trợ', inputs: r.all.join(' + '), conditions: [r.maxPH != null && `pH < ${r.maxPH}`, r.minPH != null && `pH > ${r.minPH}`].filter(Boolean).join(', ') || '—', products: '—', observe: r.reason, model: 'Nhận diện và báo "Chưa hỗ trợ", không tạo sản phẩm', source: '—', limits: r.reason,
      demo: solid && liquid ? { vessel: 'beaker100', fill: [[liquid, 30]], solid: [solid, solid === 'fe' ? 1 : 0.2], run: 3, expect: { unsupported: true } } : null }
  }),
  ...ION_HINTS.map((r, i) => {
    const fill = ION_HINT_DEMO[r.all.join('+')]
    return { id: `ionhint-${i}-${r.all.join('-')}`, status: 'UNSUPPORTED', title: r.all.join(' + '), group: 'Chưa hỗ trợ', inputs: fill ? fill.map(([x]) => x.toUpperCase()).join(' + ') : r.all.join(' + '), conditions: [r.minPH != null && `pH > ${r.minPH}`, r.maxPH != null && `pH < ${r.maxPH}`, r.ammine && 'phức amin giữ > 5 % lượng kim loại (theo NH₃ tự do và Ksp)'].filter(Boolean).join(', ') || '—', products: '—', observe: r.reason, model: 'Nhận diện và báo "Chưa hỗ trợ"', source: '—', limits: r.reason,
      demo: fill ? { vessel: 'beaker100', fill, run: 1, expect: { hint: `ionhint-${r.all.join('+')}-` } } : null }
  }),
  ...SOLVENT_HINTS.map(r => ({ id: `solvent-${r.solid}-${r.liquid}`, status: 'UNSUPPORTED', title: `${SOLID_NAME[r.solid]} + ${r.liquid}`, group: 'Chưa hỗ trợ', inputs: `${SOLID_NAME[r.solid]} + etanol khan`, conditions: '—', products: '—', observe: r.reason, model: 'Nhận diện và báo "Chưa hỗ trợ"', source: '—', limits: r.reason, demo: null, tests: ['solvent: ethanol is not water'] })),
  ...ELECTRO.electrolysisCuCl2.interferes.map(x => ({ id: `electro-unsup-${x.ion}`, status: 'UNSUPPORTED', title: `Điện phân dung dịch có ${x.ion}`, group: 'Chưa hỗ trợ', inputs: `Dung dịch chứa ${x.ion}`, conditions: '—', products: '—', observe: x.why, model: 'Điện phân bị từ chối, không tạo Cu/Cl₂', source: 'E° (CRC)',
    // I⁻ cannot stay in CuCl₂ (Cu²⁺ oxidises it on mixing) and Ag⁺ cannot stay free next to its chloride (AgCl):
    // these two rules are guards that no bench can reach, so they are reported as not verified, not as tested.
    ...(x.ion === 'I-' || x.ion === 'Ag+'
      ? { limits: `${x.why}. Trong dung dịch CuCl₂ không thể có ${x.ion} tự do (${x.ion === 'I-' ? 'Cu²⁺ oxi hóa I⁻ thành CuI + I₂ ngay khi trộn' : 'Ag⁺ kết tủa thành AgCl'}); quy tắc giữ làm chốt chặn, không kiểm chứng được bằng thí nghiệm.`, tests: [] }
      : { limits: x.why, tests: ['electrolysis refuses every interference'] }),
    demo: null })),
  { id: 'unsup-e0-mg-zn', status: 'UNSUPPORTED', title: 'Kim loại mạnh + ion kim loại yếu hơn chưa có quy tắc', group: 'Chưa hỗ trợ', inputs: 'VD: Mg + ZnSO₄', conditions: '25 °C', products: '—', observe: 'Báo "theo dãy hoạt động có phản ứng nhưng chưa được mô hình hóa định lượng".', model: 'So sánh E°', source: 'E° (CRC)', limits: 'Không tạo sản phẩm đoán.', demo: { vessel: 'beaker100', fill: [['znso4', 30]], solid: ['mg', 0.05], run: 3, expect: { unsupported: true } } },
  { id: 'unsup-mixed-solvent', status: 'UNSUPPORTED', title: 'pH và cân bằng ion trong hỗn hợp nhiều etanol', group: 'Chưa hỗ trợ', inputs: 'Dung dịch ion + etanol > 10 %', conditions: '—', products: '—', observe: 'Không hiển thị pH; ghi rõ chỉ mang tính định tính.', model: 'pH chỉ áp dụng khi etanol ≤ 10 % thể tích', source: 'IUPAC: pH trong dung môi hỗn hợp cần thang riêng', limits: '—', demo: { vessel: 'beaker100', fill: [['hcl', 10]], pour: ['ethanol', 20], run: 1, expect: { noPH: true } } }
]

const invalid = [
  ['Na + dung dịch axit', 'Natri với dung dịch axit phản ứng quá mãnh liệt'],
  ['Na vào ống nghiệm / ống đong', 'miệng hẹp làm khí và nhiệt dồn lại'],
  ['Na vào ít hơn 50 mL nước', 'Cần ít nhất 50 mL nước'],
  ['Đun ống đong, chậu thủy tinh', 'không chịu nhiệt'],
  ['Nguồn điện > 12 V', 'tối đa 12 V'],
  ['Dùng thìa lấy mẩu kim loại / kẹp lấy bột', 'phải dùng kẹp'],
  ['Lấy quá lượng an toàn của mô hình', 'vượt giới hạn an toàn'],
  ['Đun dụng cụ đã nứt', 'đun nóng sẽ làm vỡ']
].map(([title, reason], i) => ({ id: `invalid-${i}`, status: 'INVALID', title, group: 'Bị chặn vì an toàn', inputs: title, conditions: '—', products: '—', observe: `Lệnh bị chặn: “…${reason}…”.`, model: 'Kiểm tra an toàn trước mỗi lệnh (safety.js)', source: 'Quy tắc an toàn phòng thí nghiệm trường học', limits: '—', demo: null, tests: ['safety: every blocked condition'] }))

export const MANIFEST = [...processes, ...kinetic, ...precipitates, ...redox, ...noReaction, ...unsupported, ...invalid]

// What the Sandbox suggests: modelled phenomena with a demo, one card per entry.
export const DISCOVER = MANIFEST.filter(e => e.demo && (e.status === 'SUPPORTED' || e.status === 'APPROX'))
