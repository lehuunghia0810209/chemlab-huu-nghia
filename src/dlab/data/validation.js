// Scientific validation status of each manifest entry: a reviewed judgement with the evidence that supports it.
// Default UNVERIFIED. Used by the engine (observation events carry it) and by scripts/dlab-sci-matrix.mjs.
// Rule: an entry is VALIDATED only with a source AND a quantitative check independent of the engine; never because code exists.
const T = 'scripts/test-dlab.mjs'
const SV = 'scripts/dlab-sci-validate.mjs'
const G1 = `${T} "gate 1: every manifest scenario conserves elements"`

// status, quantitative evidence (independent of the engine), conservation evidence, extra limits
export const VALIDATION = {
  'nernst-ideal': ['EDUCATIONAL APPROXIMATION', `${T} "Daniell cell: tenfold dilution of Cu²⁺ lowers E by RT·ln10/2F (hand solution)" (ideal Nernst)`, '—', 'Hoạt độ = nồng độ; ở 0,05–0,5 M độ giảm thực tế ≈ 0,014 V thay vì 0,030 V.'],
  'acid-base-ph': ['VALIDATED', `${T} "pH strong acid / base", "pH weak acid / base (quadratic)", "acid–base: dilution and weak-acid titration match hand solutions" (closed form)`, G1, 'Lý tưởng: không có hệ số hoạt độ.'],
  'weak-acid-titration': ['VALIDATED', `${T} "acid–base: dilution and weak-acid titration match hand solutions" (half-equivalence pH = pKa; equivalence from acetate hydrolysis)`, G1],
  neutralisation: ['VALIDATED', `${T} "pH strong acid / base", "pH weak acid / base (quadratic)" (closed form)`, G1],
  'co2-carbonate': ['EDUCATIONAL APPROXIMATION', `${T} "pH weak acid / base"; "CO2 into limewater" (qualitative)`, G1, 'Tốc độ thoát khí là minh họa.'],
  'dissolve-salts': ['EDUCATIONAL APPROXIMATION', `${T} "KNO3 solubility table interpolation" (vs the table in code; table values: see data audit)`, G1, 'Tốc độ tan là minh họa; bảng độ tan nội suy tuyến tính.'],
  boiling: ['EDUCATIONAL APPROXIMATION', `${T} "solvent: ethanol is not water" (CRC table points)`, '—', 'Nội suy tuyến tính bảng điểm sôi; 1 atm. Bảng (CRC cũ) có thể lệch 1,5–2,5 °C ở 5–50 % khối lượng etanol so với số liệu VLE 101,325 kPa (Carey & Lewis 1932, theo Antigravity — mới ở mức snippet, cần đối chiếu nguồn gốc rồi thay bảng).'],
  layers: ['EDUCATIONAL APPROXIMATION', `${T} "solvent: ethanol is not water" (density table)`, G1, 'Bỏ qua co thể tích khi trộn nước–etanol.'],
  'electrolysis-cucl2': ['EDUCATIONAL APPROXIMATION', `${T} "electrolysis CuCl2 follows Faraday" (n(Cu) = I·t/2F, closed form)`, `${T} "electrolysis CuCl2 follows Faraday"`, 'Khối lượng theo Faraday là định lượng; cường độ dòng (điện trở, quá thế) là minh họa.'],
  daniell: ['VALIDATED', `${T} "Daniell cell: Nernst voltage", "E follows E°(T)" (closed form)`, '—', 'Bỏ qua thế tiếp xúc lỏng. Có NH₃ tạo phức, hoặc điện cực đang phản ứng trực tiếp / bị phủ kim loại khác: không hiển thị số (OUT_OF_MODEL_RANGE).'],
  indicators: ['EDUCATIONAL APPROXIMATION', `${T} "litmus…", "indicator colour spreads…"`, '—'],
  'ammine-cu': ['EDUCATIONAL APPROXIMATION', `${T} "ammine complexes: model" (trend, conservation); constants spread ≈ 1,5 lg units between sources`, `${T} "ammine complexes: model" (Cu conserved)`],
  'ammine-ag': ['VALIDATED', `${T} "validation: AgCl partly dissolved in NH₃ matches the hand solution" (±3 %)`, G1],
  'ammine-zn': ['EDUCATIONAL APPROXIMATION', `${T} "ammine complexes: model" (trend)`, G1],
  redissolve: ['VALIDATED', `${T} "Cu(OH)2 forms with base and redissolves in acid" (n = n(OH⁻)/2)`, '—'],
  'mg-acid': ['VALIDATED', `${T} "Mg + HCl: H2 = n(Mg)…"; ${SV} (equation = engine stoichiometry)`, G1, 'Tốc độ phản ứng là minh họa.'],
  'zn-acid': ['VALIDATED', `${T} "every metal/solid rule conserves stoichiometry"; ${SV}`, G1, 'Tốc độ phản ứng là minh họa.'],
  'fe-acid': ['VALIDATED', `${T} "every metal/solid rule conserves stoichiometry"; ${SV}`, G1, 'Tốc độ phản ứng là minh họa.'],
  'fe-cu': ['VALIDATED', `${T} "Fe + CuSO4: copper coats the nail mole-for-mole"; ${SV}`, G1, 'Tốc độ phản ứng là minh họa.'],
  'zn-cu': ['VALIDATED', `${T} "every metal/solid rule conserves stoichiometry"; ${SV}`, G1, 'Tốc độ phản ứng là minh họa.'],
  'cu-ag': ['VALIDATED', `${T} "every metal/solid rule conserves stoichiometry"; ${SV}`, G1, 'Tốc độ phản ứng là minh họa.'],
  'na-water': ['VALIDATED', `${T} "Na + water: … NaOH pH and heat"; ${SV}`, G1, 'Chuyển động của mẩu natri là minh họa.'],
  'caco3-acid': ['VALIDATED', `${T} "every metal/solid rule conserves stoichiometry"; ${SV}`, G1, 'Tốc độ phản ứng là minh họa.'],
  'ppt-AgCl': ['VALIDATED', `${T} "validation: equimolar AgCl, AgI, BaSO₄ leave √Ksp dissolved"; "AgCl: limiting reagent and Ksp residual"`, G1],
  'ppt-AgI': ['VALIDATED', `${T} "validation: equimolar AgCl, AgI, BaSO₄ leave √Ksp dissolved"`, G1],
  'ppt-BaSO4': ['VALIDATED', `${T} "validation: equimolar AgCl, AgI, BaSO₄ leave √Ksp dissolved"`, G1],
  'ppt-Cu(OH)2': ['VALIDATED', `${T} "Cu(OH)2 forms with base and redissolves in acid" (n = n(OH⁻)/2)`, G1, 'Ksp của Cu(OH)₂ đã "già" (CRC); kết tủa mới tan hơn ≈ 10 lần (Hidmi & Edwards 1999).'],
  'ppt-Fe(OH)3': ['VALIDATED', `${T} "hydroxide precipitates: Fe(OH)3, Fe(OH)2, Mg(OH)2 take the limiting reagent"`, G1],
  'ppt-Fe(OH)2': ['VALIDATED', `${T} "hydroxide precipitates: …"`, G1, 'Không mô hình Fe(OH)₂ bị oxi hóa trong không khí thành Fe(OH)₃.'],
  'ppt-Mg(OH)2': ['VALIDATED', `${T} "hydroxide precipitates: …"`, G1],
  'ppt-CaCO3': ['VALIDATED', `${T} "carbonates: BaCO₃/CaCO₃ residual matches an independent Ksp + carbonate solve" (±3 %)`, G1, 'Ksp canxit (CRC); kết tủa mới (vaterit, vô định hình) tan hơn.'],
  'ppt-BaCO3': ['VALIDATED', `${T} "carbonates: BaCO₃/CaCO₃ residual matches an independent Ksp + carbonate solve" (±3 %)`, G1],
  'ppt-ZnCO3': ['UNVERIFIED', 'demo only (forms)', G1, 'Thực tế có thể tạo kẽm cacbonat bazơ.'],
  'ppt-Ag2CO3': ['UNVERIFIED', 'demo only (forms)', G1],
  'ppt-Zn(OH)2': ['UNVERIFIED', 'demo only (forms)', G1],
  'redox-cu-i': ['VALIDATED', `${T} "CuCl₂ + KI: 2Cu²⁺ + 4I⁻ → 2CuI↓ + I₂ … atoms and charge conserved"; ${SV}`, G1, 'Cổng pH ≤ 7 là chặn thô (nhiệt động: ngừng ở pH ≈ 5,6 khi có Cu(OH)₂); kết quả do Ksp chi phối vì chỉ ion tan phản ứng — đã thử trên engine.'],
  // ChemLab 7.1
  'competitive-precipitation': ['VALIDATED', `${T} "competitive precipitation: the least soluble salt forms first; AgCl turns into AgI (hand solution)"`, G1],
  'thiocyanate-complex': ['EDUCATIONAL APPROXIMATION', `${T} "thiocyanate: FeSCN²⁺ matches the 1:1 quadratic and shifts as Le Chatelier predicts" (independent quadratic)`, G1, 'K1 ở I = 0 (10^3,03); trong dung dịch đặc K thực nhỏ hơn ≈ 7 lần. Chỉ phức 1:1.'],
  'starch-iodine': ['EDUCATIONAL APPROXIMATION', `${T} "starch: blue-black needs I₂ and I⁻, fades when hot" (thresholds from the literature)`, '—', 'Định tính: ngưỡng ≈ 2·10⁻⁵ M I₂, cần I⁻, mất màu trên ≈ 65 °C.'],
  'salt-hydrolysis': ['EDUCATIONAL APPROXIMATION', `${T} "salt hydrolysis: FeCl₃ pH matches the first-hydrolysis quadratic" (closed form)`, G1, 'Hằng số ở I = 0; dung dịch 0,2–0,5 M lệch vài phần mười đơn vị pH.'],
  'rate-concentration': ['EDUCATIONAL APPROXIMATION', `${T} "rate: marble in HCl releases CO₂ in proportion to [H⁺] (model)" (trend only)`, '—', 'k minh họa; bậc 1 theo H⁺ là giả thiết.'],
  'neutralisation-heat': ['VALIDATED', `${T} "heat of neutralisation: temperature rise matches the hand calculation" (closed form, NBS ΔH)`, G1, 'Bỏ qua nhiệt pha loãng và mất nhiệt.'],
  'redox-mno4-fe': ['VALIDATED', `${T} "permanganate: MnO₄⁻ + 5Fe²⁺ end point at n(MnO₄⁻) = n(Fe²⁺)/5; stops (out of range) without acid" (hand solution); ${SV}`, G1, 'Chỉ khi pH ≤ 2; thiếu axit thì báo ngoài phạm vi (thực tế tạo MnO₂).'],
  'ppt-AgSCN': ['VALIDATED', `${T} "AgSCN: equimolar mixture leaves √Ksp dissolved"`, G1],
  'redox-fe-i': ['EDUCATIONAL APPROXIMATION', `${SV} (equation = engine stoichiometry); conversion run to completion`, G1, 'Chạy hết theo chất hạn chế; ở < 1 mM thực tế còn vài % chưa phản ứng.'],
}
export function validationOf(e) {
  if (VALIDATION[e.id]) return VALIDATION[e.id]
  if (e.status === 'NO_REACTION') return ['VALIDATED', `${T} "reaction coverage: unmodelled metal/ion pairs are NO_REACTION or UNSUPPORTED by E°"; demo`, G1, 'So sánh E° chuẩn; không xét động học hay lớp thụ động.']
  if (e.status === 'UNSUPPORTED') return ['UNSUPPORTED', `${T} "unsupported and non-reactions do not invent results"; demo / "${(e.tests || [])[0] || '—'}"`, e.demo ? G1 : '—']
  if (e.status === 'INVALID') return ['UNSUPPORTED (chặn an toàn)', `${T} "safety: every blocked condition in the manifest is refused"`, '— (lệnh bị từ chối, không có tác dụng phụ)']
  return ['UNVERIFIED', '—', '—']
}
