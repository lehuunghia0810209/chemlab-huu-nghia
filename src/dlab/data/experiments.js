// Experiment Library (product phase 1): complete experiment definitions built ONLY on processes the engine already
// models. An experiment is data: the engine computes every result. Its validation status is not written by hand: it is
// the weakest status among the processes it uses (data/validation.js), so it can never be shown as better verified than
// the Scientific Validation Matrix.
//
// Schema: id, group, grade, difficulty (DIFFICULTY), safetyLevel, keywords (search), title, objective, equipment, chemicals,
// conditions, setup { vessels: [{ type, fill: [[reagent, mL]] }], bottles: [reagent], tools: [equipment type] },
// steps: [{ text, act }] with act = { pour: reagent, to: vessel index, mL }, { drops: indicator, to } (3 drops, the bottle's
// "Nhỏ 3 giọt" control) or { solid: reagent, massG, to } (the same
// actions a student does with the action bar), phenomena, equation, explanation, safety, processRefs, references, tests,
// expect: event key prefixes (state.events) that must appear in the named vessel once the steps are done,
// expectState: [{ vessel, pH: [lo, hi], indicator: [key, word], coat, gas, noGas, noCoat }] checked on the final state.
import { MANIFEST } from './manifest.js'
import { validationOf } from './validation.js'

const RANK = ['VALIDATED', 'EDUCATIONAL APPROXIMATION', 'UNVERIFIED']
export function experimentValidation(exp) {
  const statuses = exp.processRefs.map(id => { const e = MANIFEST.find(m => m.id === id); return e ? validationOf(e)[0] : 'UNVERIFIED' })
  return statuses.reduce((worst, s) => (RANK.indexOf(s) > RANK.indexOf(worst) ? s : worst), 'VALIDATED')
}

export const EXPERIMENT_GROUPS = [
  { id: 'acid-base', title: 'Axit – bazơ và chất chỉ thị', grade: 'Hóa học 11' },
  { id: 'metals', title: 'Kim loại và dãy hoạt động hóa học', grade: 'Hóa học 12' },
  { id: 'precipitation', title: 'Kết tủa, hòa tan và tạo phức', grade: 'Hóa học 11–12' }
]
export const DIFFICULTY = ['Cơ bản', 'Trung bình', 'Nâng cao']

export const EXPERIMENTS = [
  {
    id: 'exp-chloride-test', group: 'precipitation', grade: 'Hóa học 11', difficulty: 'Cơ bản', safetyLevel: 'Trung bình', keywords: ['nhận biết', 'Cl-', 'AgNO3', 'kết tủa'],
    title: 'Nhận biết ion clorua bằng dung dịch AgNO₃',
    objective: 'Nhận biết ion Cl⁻ trong dung dịch nhờ kết tủa trắng AgCl; hiểu kết tủa tạo thành khi tích nồng độ ion vượt Ksp.',
    equipment: ['Cốc thủy tinh 100 mL', 'Chai NaCl 0,5 M'], chemicals: ['AgNO₃ 0,1 M', 'NaCl 0,5 M'],
    conditions: 'Dung dịch loãng, 25 °C.',
    setup: { vessels: [{ type: 'beaker100', fill: [['agno3', 10]] }], bottles: ['nacl'] },
    steps: [{ text: 'Rót 2 mL dung dịch NaCl vào cốc chứa AgNO₃.', act: { pour: 'nacl', to: 0, mL: 2 } }],
    phenomena: 'Xuất hiện kết tủa trắng AgCl, lắng dần xuống đáy cốc.',
    equation: 'Ag⁺ + Cl⁻ → AgCl↓',
    explanation: 'AgCl rất ít tan (Ksp = 1,77·10⁻¹⁰ ở 25 °C). Khi [Ag⁺]·[Cl⁻] vượt Ksp, phần dư kết tủa; lượng kết tủa bằng lượng của chất hết trước.',
    safety: 'AgNO₃ làm đen da và độc với sinh vật nước: đeo găng, không đổ xuống cống.',
    processRefs: ['ppt-AgCl'], expect: [{ vessel: 0, key: 'ppt-AgCl' }],
    references: ['Ksp AgCl: CRC Handbook of Chemistry and Physics (25 °C)'],
    tests: ['validation: equimolar AgCl, AgI, BaSO₄ leave √Ksp dissolved', 'experiment library: every experiment runs on the engine']
  },
  {
    id: 'exp-sulfate-test', group: 'precipitation', grade: 'Hóa học 11', difficulty: 'Cơ bản', safetyLevel: 'Trung bình', keywords: ['nhận biết', 'SO4', 'BaCl2', 'kết tủa'],
    title: 'Nhận biết ion sunfat bằng dung dịch BaCl₂',
    objective: 'Nhận biết ion SO₄²⁻ nhờ kết tủa trắng BaSO₄.',
    equipment: ['Cốc thủy tinh 100 mL', 'Chai Na₂SO₄ 0,2 M'], chemicals: ['BaCl₂ 0,2 M', 'Na₂SO₄ 0,2 M'],
    conditions: 'Dung dịch loãng, 25 °C.',
    setup: { vessels: [{ type: 'beaker100', fill: [['bacl2', 10]] }], bottles: ['na2so4'] },
    steps: [{ text: 'Rót 10 mL dung dịch Na₂SO₄ vào cốc chứa BaCl₂.', act: { pour: 'na2so4', to: 0, mL: 10 } }],
    phenomena: 'Xuất hiện kết tủa trắng BaSO₄.',
    equation: 'Ba²⁺ + SO₄²⁻ → BaSO₄↓',
    explanation: 'BaSO₄ rất ít tan (Ksp = 1,08·10⁻¹⁰) và không tan trong axit loãng, nên đây là phản ứng đặc trưng để nhận biết SO₄²⁻.',
    safety: 'Hợp chất bari tan (BaCl₂) độc khi nuốt: rửa tay sau thí nghiệm.',
    processRefs: ['ppt-BaSO4'], expect: [{ vessel: 0, key: 'ppt-BaSO4' }],
    references: ['Ksp BaSO₄: CRC Handbook of Chemistry and Physics (25 °C)'],
    tests: ['validation: equimolar AgCl, AgI, BaSO₄ leave √Ksp dissolved', 'experiment library: every experiment runs on the engine']
  },
  {
    id: 'exp-copper-hydroxide', group: 'precipitation', grade: 'Hóa học 11', difficulty: 'Cơ bản', safetyLevel: 'Trung bình', keywords: ['hiđroxit', 'Cu(OH)2', 'kết tủa', 'axit'],
    title: 'Đồng(II) hiđroxit: tạo kết tủa rồi hòa tan bằng axit',
    objective: 'Quan sát Cu(OH)₂ kết tủa xanh lam khi cho kiềm vào muối đồng, rồi tan trong axit.',
    equipment: ['Cốc thủy tinh 100 mL', 'Chai NaOH 0,5 M', 'Chai HCl 0,5 M'], chemicals: ['CuSO₄ 0,5 M', 'NaOH 0,5 M', 'HCl 0,5 M'],
    conditions: 'Dung dịch loãng, 25 °C.',
    setup: { vessels: [{ type: 'beaker100', fill: [['cuso4', 10]] }], bottles: ['naoh', 'hcl'] },
    steps: [
      { text: 'Rót 15 mL NaOH vào cốc CuSO₄.', act: { pour: 'naoh', to: 0, mL: 15 } },
      { text: 'Rót 20 mL HCl vào cốc đến khi kết tủa tan hết.', act: { pour: 'hcl', to: 0, mL: 20 } }
    ],
    phenomena: 'Kết tủa xanh lam Cu(OH)₂ xuất hiện; thêm HCl, kết tủa tan, dung dịch trở lại màu xanh trong.',
    equation: 'Cu²⁺ + 2OH⁻ → Cu(OH)₂↓; Cu(OH)₂ + 2H⁺ → Cu²⁺ + 2H₂O',
    explanation: 'Cu(OH)₂ ít tan (Ksp = 2,2·10⁻²⁰) nên kết tủa khi có OH⁻. Axit lấy đi OH⁻ (tạo H₂O) làm [Cu²⁺][OH⁻]² nhỏ hơn Ksp, nên kết tủa tan.',
    safety: 'NaOH và HCl ăn mòn: đeo kính và găng. Muối đồng độc khi nuốt.',
    processRefs: ['ppt-Cu(OH)2', 'redissolve'], expect: [{ vessel: 0, key: 'ppt-Cu(OH)2' }],
    references: ['Ksp Cu(OH)₂: CRC Handbook of Chemistry and Physics (25 °C)'],
    tests: ['Cu(OH)2 forms with base and redissolves in acid', 'experiment library: every experiment runs on the engine']
  },
  {
    id: 'exp-iron3-hydroxide', group: 'precipitation', grade: 'Hóa học 11', difficulty: 'Cơ bản', safetyLevel: 'Trung bình', keywords: ['hiđroxit', 'Fe(OH)3', 'nhận biết', 'Fe3+'],
    title: 'Sắt(III) hiđroxit kết tủa nâu đỏ',
    objective: 'Nhận biết ion Fe³⁺ bằng dung dịch kiềm.',
    equipment: ['Cốc thủy tinh 100 mL', 'Chai NaOH 0,5 M'], chemicals: ['FeCl₃ 0,2 M', 'NaOH 0,5 M'],
    conditions: 'Dung dịch loãng, 25 °C.',
    setup: { vessels: [{ type: 'beaker100', fill: [['fecl3', 10]] }], bottles: ['naoh'] },
    steps: [{ text: 'Rót 15 mL NaOH vào cốc FeCl₃.', act: { pour: 'naoh', to: 0, mL: 15 } }],
    phenomena: 'Xuất hiện kết tủa nâu đỏ Fe(OH)₃.',
    equation: 'Fe³⁺ + 3OH⁻ → Fe(OH)₃↓',
    explanation: 'Fe(OH)₃ cực kỳ ít tan (Ksp = 2,79·10⁻³⁹) nên kết tủa ngay cả trong môi trường hơi axit.',
    safety: 'FeCl₃ ăn mòn, làm ố da; NaOH ăn mòn: đeo kính và găng.',
    processRefs: ['ppt-Fe(OH)3'], expect: [{ vessel: 0, key: 'ppt-Fe(OH)3' }],
    references: ['Ksp Fe(OH)₃: CRC Handbook of Chemistry and Physics (25 °C)'],
    tests: ['hydroxide precipitates: Fe(OH)3, Fe(OH)2, Mg(OH)2 take the limiting reagent', 'experiment library: every experiment runs on the engine']
  },
  {
    id: 'exp-silver-halide-ammonia', group: 'precipitation', grade: 'Hóa học 12', difficulty: 'Nâng cao', safetyLevel: 'Cao', keywords: ['phức chất', 'AgCl', 'AgI', 'NH3', 'Ksp'],
    title: 'AgCl tan trong NH₃, AgI thì không',
    objective: 'So sánh độ tan của AgCl và AgI trong dung dịch NH₃ nhờ sự tạo phức [Ag(NH₃)₂]⁺.',
    equipment: ['2 cốc thủy tinh 100 mL', 'Chai NaCl 0,5 M', 'Chai KI 0,1 M', 'Chai NH₃ 2 M'], chemicals: ['AgNO₃ 0,1 M', 'NaCl 0,5 M', 'KI 0,1 M', 'NH₃ 2 M'],
    conditions: '25 °C; NH₃ 2 M dư.',
    setup: { vessels: [{ type: 'beaker100', fill: [['agno3', 10]] }, { type: 'beaker100', fill: [['agno3', 10]] }], bottles: ['nacl', 'ki', 'nh3-2m'] },
    steps: [
      { text: 'Rót 2 mL NaCl vào cốc thứ nhất (kết tủa trắng AgCl).', act: { pour: 'nacl', to: 0, mL: 2 } },
      { text: 'Rót 10 mL KI vào cốc thứ hai (kết tủa vàng AgI).', act: { pour: 'ki', to: 1, mL: 10 } },
      { text: 'Rót 15 mL NH₃ 2 M vào cốc thứ nhất.', act: { pour: 'nh3-2m', to: 0, mL: 15 } },
      { text: 'Rót 15 mL NH₃ 2 M vào cốc thứ hai.', act: { pour: 'nh3-2m', to: 1, mL: 15 } }
    ],
    phenomena: 'Kết tủa trắng AgCl tan trong NH₃; kết tủa vàng AgI hầu như không đổi.',
    equation: 'AgCl + 2NH₃ → [Ag(NH₃)₂]⁺ + Cl⁻',
    explanation: 'NH₃ giữ Ag⁺ trong phức [Ag(NH₃)₂]⁺ (lg β₂ ≈ 7). Với AgCl, Ksp·β₂ ≈ 2·10⁻³ đủ lớn để kết tủa tan; với AgI, Ksp·β₂ ≈ 10⁻⁹ quá nhỏ nên AgI vẫn còn.',
    safety: 'Dung dịch bạc–amoniac để lâu hoặc khô có thể tạo bạc nitrua dễ nổ: dùng xong đổ bỏ ngay theo quy định. NH₃ gây kích ứng: làm nơi thoáng khí.',
    processRefs: ['ammine-ag', 'ppt-AgCl', 'ppt-AgI'], expect: [{ vessel: 0, key: 'ammine-Ag+' }, { vessel: 1, key: 'ppt-AgI' }],
    references: ['Ksp AgCl, AgI: CRC Handbook (25 °C)', 'lg β [Ag(NH₃)₂]⁺: Lange’s Handbook (Bjerrum); NIST SRD 46'],
    tests: ['validation: AgCl partly dissolved in NH₃ matches the hand solution', 'experiment library: every experiment runs on the engine']
  },
  {
    id: 'exp-copper-ammine', group: 'precipitation', grade: 'Hóa học 12', difficulty: 'Trung bình', safetyLevel: 'Trung bình', keywords: ['phức chất', 'Cu(OH)2', 'NH3', 'xanh thẫm'],
    title: 'Phức đồng–amoniac xanh thẫm',
    objective: 'Quan sát Cu(OH)₂ tạo thành rồi tan trong NH₃ dư thành phức [Cu(NH₃)₄]²⁺ xanh thẫm.',
    equipment: ['Cốc thủy tinh 100 mL', 'Chai NH₃ 2 M'], chemicals: ['CuSO₄ 0,5 M', 'NH₃ 2 M'],
    conditions: '25 °C; NH₃ 2 M dư (NH₃ 0,5 M chỉ hòa tan khoảng 80 %).',
    setup: { vessels: [{ type: 'beaker100', fill: [['cuso4', 5]] }], bottles: ['nh3-2m'] },
    steps: [
      { text: 'Rót 2 mL NH₃ 2 M vào cốc CuSO₄ (kết tủa xanh lam).', act: { pour: 'nh3-2m', to: 0, mL: 2 } },
      { text: 'Rót tiếp 28 mL NH₃ 2 M, khuấy (kết tủa tan, dung dịch xanh thẫm).', act: { pour: 'nh3-2m', to: 0, mL: 28 } }
    ],
    phenomena: 'Kết tủa xanh lam xuất hiện, sau đó tan khi NH₃ dư; dung dịch chuyển xanh thẫm.',
    equation: 'Cu²⁺ + 2NH₃ + 2H₂O → Cu(OH)₂↓ + 2NH₄⁺; Cu(OH)₂ + 4NH₃ → [Cu(NH₃)₄]²⁺ + 2OH⁻',
    explanation: 'Lúc đầu NH₃ ít, đóng vai trò bazơ tạo Cu(OH)₂. Khi dư, NH₃ liên kết với Cu²⁺ thành phức bền [Cu(NH₃)₄]²⁺, [Cu²⁺] tự do giảm dưới mức Ksp nên kết tủa tan.',
    safety: 'NH₃ gây kích ứng mắt và đường hô hấp: làm nơi thoáng khí. Muối đồng độc khi nuốt.',
    processRefs: ['ammine-cu', 'ppt-Cu(OH)2'], expect: [{ vessel: 0, key: 'ppt-Cu(OH)2' }, { vessel: 0, key: 'ammine-dis-Cu(OH)2' }],
    references: ['lg β Cu–NH₃: Lange’s Handbook (Bjerrum); NIST SRD 46 cho I = 0 (lệch tới ≈ 1,5)', 'Ksp Cu(OH)₂: CRC Handbook'],
    tests: ['ammine complexes: model', 'experiment library: every experiment runs on the engine']
  },
  // ── Nhóm 2: Axit – bazơ và chất chỉ thị ──────────────────────────────────────────────────────────────
  {
    id: 'exp-strong-acid-dilution', group: 'acid-base', grade: 'Hóa học 11', difficulty: 'Cơ bản', safetyLevel: 'Trung bình', keywords: ['pH', 'pha loãng', 'HCl', 'axit mạnh'],
    title: 'Pha loãng axit mạnh: pH tăng 1 đơn vị khi pha loãng 10 lần',
    objective: 'Liên hệ pH với nồng độ H⁺ của axit mạnh: pH = −lg[H⁺].',
    equipment: ['Cốc thủy tinh 250 mL', 'Chai nước cất'], chemicals: ['HCl 0,5 M', 'Nước cất'],
    conditions: '25 °C; HCl phân li hoàn toàn.',
    setup: { vessels: [{ type: 'beaker250', fill: [['hcl', 10]] }], bottles: ['water'] },
    steps: [{ text: 'Đọc pH của 10 mL HCl 0,5 M (≈ 0,3), rồi rót 90 mL nước cất vào cốc.', act: { pour: 'water', to: 0, mL: 90 } }],
    phenomena: 'pH tăng từ khoảng 0,3 lên khoảng 1,3 (thể tích tăng 10 lần).',
    equation: 'HCl → H⁺ + Cl⁻',
    explanation: 'HCl là axit mạnh, phân li hoàn toàn nên [H⁺] bằng nồng độ axit. Pha loãng 10 lần làm [H⁺] giảm 10 lần, nên pH tăng 1 đơn vị.',
    safety: 'HCl ăn mòn: đeo kính, găng. Khi pha loãng axit đặc ngoài đời luôn rót axit vào nước.',
    processRefs: ['acid-base-ph'], expect: [], expectState: [{ vessel: 0, pH: [1.25, 1.35] }],
    references: ['Kw: CRC Handbook (25 °C)'], tests: ['acid–base: dilution and weak-acid titration match hand solutions', 'experiment library: every experiment runs on the engine']
  },
  {
    id: 'exp-strong-vs-weak-acid', group: 'acid-base', grade: 'Hóa học 11', difficulty: 'Trung bình', safetyLevel: 'Trung bình', keywords: ['axit yếu', 'CH3COOH', 'điện li', 'pH', 'pha loãng'],
    title: 'Axit mạnh và axit yếu khi pha loãng',
    objective: 'So sánh pH của HCl (điện li mạnh) và CH₃COOH (điện li yếu); thấy axit yếu phân li nhiều hơn khi pha loãng.',
    equipment: ['2 cốc thủy tinh 100 mL', 'Chai nước cất'], chemicals: ['HCl 0,5 M', 'CH₃COOH 1 M', 'Nước cất'],
    conditions: '25 °C; Ka(CH₃COOH) = 1,75·10⁻⁵.',
    setup: { vessels: [{ type: 'beaker100', fill: [['hcl', 20]] }, { type: 'beaker100', fill: [['ch3cooh', 20]] }], bottles: ['water'] },
    steps: [
      { text: 'Đọc pH hai cốc (HCl ≈ 0,3; CH₃COOH ≈ 2,4), rồi rót 20 mL nước vào cốc HCl.', act: { pour: 'water', to: 0, mL: 20 } },
      { text: 'Rót 20 mL nước vào cốc CH₃COOH và so sánh độ tăng pH.', act: { pour: 'water', to: 1, mL: 20 } }
    ],
    phenomena: 'pH của HCl tăng khoảng 0,30; pH của CH₃COOH chỉ tăng khoảng 0,15.',
    equation: 'HCl → H⁺ + Cl⁻; CH₃COOH ⇌ CH₃COO⁻ + H⁺',
    explanation: 'CH₃COOH chỉ phân li một phần (Ka nhỏ) nên dù nồng độ gấp đôi HCl, [H⁺] vẫn nhỏ hơn rất nhiều. Khi pha loãng, cân bằng phân li chuyển sang phải nên [H⁺] giảm chậm hơn tỉ lệ pha loãng.',
    safety: 'HCl ăn mòn; CH₃COOH có mùi xốc, gây kích ứng mắt: đeo kính.',
    processRefs: ['acid-base-ph'], expect: [], expectState: [{ vessel: 0, pH: [0.55, 0.65] }, { vessel: 1, pH: [2.48, 2.58] }],
    references: ['Ka CH₃COOH: CRC Handbook (25 °C)'], tests: ['pH weak acid / base (quadratic)', 'acid–base: dilution and weak-acid titration match hand solutions', 'experiment library: every experiment runs on the engine']
  },
  {
    id: 'exp-strong-vs-weak-base', group: 'acid-base', grade: 'Hóa học 11', difficulty: 'Trung bình', safetyLevel: 'Trung bình', keywords: ['bazơ yếu', 'NH3', 'NaOH', 'pH'],
    title: 'Bazơ mạnh và bazơ yếu cùng nồng độ',
    objective: 'So sánh pH của NaOH và NH₃ cùng nồng độ 0,5 M; hiểu NH₃ là bazơ yếu.',
    equipment: ['2 cốc thủy tinh 100 mL', 'Chai nước cất'], chemicals: ['NaOH 0,5 M', 'NH₃ 0,5 M', 'Nước cất'],
    conditions: '25 °C; Ka(NH₄⁺) = 5,6·10⁻¹⁰.',
    setup: { vessels: [{ type: 'beaker100', fill: [['naoh', 20]] }, { type: 'beaker100', fill: [['nh3', 20]] }], bottles: ['water'] },
    steps: [
      { text: 'Đọc pH hai cốc (NaOH ≈ 13,7; NH₃ ≈ 11,5), rồi rót 20 mL nước vào cốc NaOH.', act: { pour: 'water', to: 0, mL: 20 } },
      { text: 'Rót 20 mL nước vào cốc NH₃.', act: { pour: 'water', to: 1, mL: 20 } }
    ],
    phenomena: 'Cùng nồng độ nhưng pH của NH₃ thấp hơn NaOH khoảng 2 đơn vị; khi pha loãng, pH của NaOH giảm khoảng 0,30 còn của NH₃ chỉ giảm khoảng 0,15.',
    equation: 'NaOH → Na⁺ + OH⁻; NH₃ + H₂O ⇌ NH₄⁺ + OH⁻',
    explanation: 'NaOH phân li hoàn toàn; NH₃ chỉ nhận proton của nước một phần (Kb ≈ 1,8·10⁻⁵) nên [OH⁻] nhỏ hơn nhiều.',
    safety: 'NaOH ăn mòn da, mắt; NH₃ gây kích ứng đường hô hấp: đeo kính, làm nơi thoáng khí.',
    processRefs: ['acid-base-ph'], expect: [], expectState: [{ vessel: 0, pH: [13.35, 13.45] }, { vessel: 1, pH: [11.25, 11.4] }],
    references: ['Ka NH₄⁺: CRC Handbook (25 °C)'], tests: ['pH weak acid / base (quadratic)', 'acid–base: dilution and weak-acid titration match hand solutions', 'experiment library: every experiment runs on the engine']
  },
  {
    id: 'exp-neutralisation-excess', group: 'acid-base', grade: 'Hóa học 11', difficulty: 'Cơ bản', safetyLevel: 'Trung bình', keywords: ['trung hòa', 'axit dư', 'bazơ dư', 'pH'],
    title: 'Trung hòa HCl bằng NaOH: axit dư, vừa đủ, bazơ dư',
    objective: 'Thấy pH sau trung hòa phụ thuộc chất nào còn dư; chỉ bằng 7 khi axit mạnh và bazơ mạnh vừa đủ.',
    equipment: ['Cốc thủy tinh 100 mL', 'Chai NaOH 0,5 M'], chemicals: ['HCl 0,5 M', 'NaOH 0,5 M'],
    conditions: '25 °C.',
    setup: { vessels: [{ type: 'beaker100', fill: [['hcl', 20]] }], bottles: ['naoh'] },
    steps: [
      { text: 'Rót 10 mL NaOH vào cốc HCl (axit còn dư, pH ≈ 0,8).', act: { pour: 'naoh', to: 0, mL: 10 } },
      { text: 'Rót thêm 10 mL NaOH (vừa đủ, pH ≈ 7).', act: { pour: 'naoh', to: 0, mL: 10 } },
      { text: 'Rót thêm 10 mL NaOH (bazơ dư, pH ≈ 13).', act: { pour: 'naoh', to: 0, mL: 10 } }
    ],
    phenomena: 'pH tăng từ khoảng 0,8 lên 7 rồi khoảng 13; cốc ấm lên.',
    equation: 'H⁺ + OH⁻ → H₂O',
    explanation: 'Với axit mạnh và bazơ mạnh, phương trình ion rút gọn là H⁺ + OH⁻ → H₂O. pH chỉ bằng 7 tại điểm vừa đủ; trước đó axit dư quyết định pH, sau đó bazơ dư.',
    safety: 'HCl và NaOH ăn mòn: đeo kính, găng. Phản ứng tỏa nhiệt.',
    processRefs: ['neutralisation'], expect: [{ vessel: 0, key: 'neutral' }], expectState: [{ vessel: 0, pH: [12.9, 13.1] }],
    references: ['Kw: CRC; ΔH trung hòa: NBS Tables'], tests: ['neutralisation: equivalence, excess and heat', 'experiment library: every experiment runs on the engine']
  },
  {
    id: 'exp-phenolphthalein-endpoint', group: 'acid-base', grade: 'Hóa học 11', difficulty: 'Cơ bản', safetyLevel: 'Trung bình', keywords: ['phenolphtalein', 'chất chỉ thị', 'trung hòa', 'chuẩn độ'],
    title: 'Phenolphtalein báo điểm kết thúc trung hòa',
    objective: 'Dùng phenolphtalein (không màu dưới pH 8,2, hồng trên khoảng 8,2–10) để nhận biết khi kiềm đã hết.',
    equipment: ['Cốc thủy tinh 100 mL', 'Chai phenolphtalein', 'Chai HCl 0,5 M'], chemicals: ['NaOH 0,5 M', 'Phenolphtalein', 'HCl 0,5 M'],
    conditions: '25 °C; chất chỉ thị pha trong etanol, lượng nhỏ (etanol < 10 %).',
    setup: { vessels: [{ type: 'beaker100', fill: [['naoh', 10]] }], bottles: ['phenolphthalein', 'hcl'] },
    steps: [
      { text: 'Nhỏ 3 giọt phenolphtalein vào cốc NaOH (dung dịch hồng).', act: { drops: 'phenolphthalein', to: 0 } },
      { text: 'Rót 5 mL HCl (vẫn còn kiềm dư: vẫn hồng).', act: { pour: 'hcl', to: 0, mL: 5 } },
      { text: 'Rót thêm 6 mL HCl (hết kiềm: mất màu hồng).', act: { pour: 'hcl', to: 0, mL: 6 } }
    ],
    phenomena: 'Dung dịch hồng khi kiềm còn dư, mất màu khi đã đủ hoặc dư axit.',
    equation: 'H⁺ + OH⁻ → H₂O',
    explanation: 'Phenolphtalein đổi màu trong khoảng pH 8,2–10. Khi kiềm còn dư (pH > 12) dung dịch hồng; khi axit đủ hoặc dư, pH xuống dưới 8,2 nên mất màu.',
    safety: 'Phenolphtalein bị xếp loại nghi gây ung thư: tránh dính da. HCl, NaOH ăn mòn.',
    processRefs: ['neutralisation', 'indicators'], expect: [{ vessel: 0, key: 'neutral' }], expectState: [{ vessel: 0, pH: [1.5, 1.8], indicator: ['phenolphthalein', 'không màu'] }],
    references: ['Khoảng chuyển màu: Harris, Quantitative Chemical Analysis'], tests: ['neutralisation: equivalence, excess and heat', 'experiment library: every experiment runs on the engine']
  },
  {
    id: 'exp-weak-acid-titration', group: 'acid-base', grade: 'Hóa học 11', difficulty: 'Nâng cao', safetyLevel: 'Trung bình', keywords: ['chuẩn độ', 'axit yếu', 'CH3COOH', 'điểm tương đương', 'đệm'],
    title: 'Trung hòa axit yếu: điểm vừa đủ có pH lớn hơn 7',
    objective: 'Thấy khi trung hòa CH₃COOH bằng NaOH, nửa chừng pH = pKa và lúc vừa đủ pH ≈ 9,1, không phải 7.',
    equipment: ['Cốc thủy tinh 100 mL', 'Chai NaOH 0,5 M', 'Chai phenolphtalein'], chemicals: ['CH₃COOH 1 M', 'NaOH 0,5 M', 'Phenolphtalein'],
    conditions: '25 °C; Ka(CH₃COOH) = 1,75·10⁻⁵.',
    setup: { vessels: [{ type: 'beaker100', fill: [['ch3cooh', 10]] }], bottles: ['naoh', 'phenolphthalein'] },
    steps: [
      { text: 'Nhỏ 3 giọt phenolphtalein vào cốc CH₃COOH.', act: { drops: 'phenolphthalein', to: 0 } },
      { text: 'Rót 10 mL NaOH (trung hòa một nửa: pH ≈ 4,8 = pKa, không màu).', act: { pour: 'naoh', to: 0, mL: 10 } },
      { text: 'Rót thêm 10 mL NaOH (vừa đủ: pH ≈ 9,1, hồng nhạt).', act: { pour: 'naoh', to: 0, mL: 10 } }
    ],
    phenomena: 'Không màu ở giữa chừng (pH ≈ 4,8); hồng nhạt khi vừa đủ (pH ≈ 9,1).',
    equation: 'CH₃COOH + OH⁻ → CH₃COO⁻ + H₂O; CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻',
    explanation: 'CH₃COOH là axit yếu nên phương trình ion rút gọn giữ dạng phân tử. Lúc vừa đủ, dung dịch chứa CH₃COO⁻; ion này nhận proton của nước tạo OH⁻ nên pH > 7. Vì vậy chuẩn độ axit yếu dùng phenolphtalein chứ không dùng metyl da cam.',
    safety: 'NaOH ăn mòn; CH₃COOH gây kích ứng: đeo kính.',
    processRefs: ['weak-acid-titration', 'indicators'], expect: [{ vessel: 0, key: 'neutral' }], expectState: [{ vessel: 0, pH: [8.95, 9.25], indicator: ['phenolphthalein', 'chuyển hồng'] }],
    references: ['Ka CH₃COOH: CRC Handbook (25 °C)'], tests: ['acid–base: dilution and weak-acid titration match hand solutions', 'experiment library: every experiment runs on the engine']
  },
  // ── Nhóm 3: Kim loại và dãy hoạt động ────────────────────────────────────────────────────────────────
  {
    id: 'exp-iron-copper-sulfate', group: 'metals', grade: 'Hóa học 12', difficulty: 'Cơ bản', safetyLevel: 'Thấp', keywords: ['dãy hoạt động', 'Fe', 'CuSO4', 'phản ứng thế'],
    title: 'Đinh sắt trong dung dịch CuSO₄',
    objective: 'Quan sát Fe đẩy Cu ra khỏi dung dịch muối: Fe đứng trước Cu trong dãy hoạt động.',
    equipment: ['Cốc thủy tinh 100 mL', 'Kẹp hóa chất'], chemicals: ['CuSO₄ 0,5 M', 'Đinh sắt'],
    conditions: '25 °C.',
    setup: { vessels: [{ type: 'beaker100', fill: [['cuso4', 40]] }], bottles: [], tools: ['tongs'] },
    steps: [{ text: 'Dùng kẹp lấy đinh sắt (2 g) thả vào cốc CuSO₄; chờ (có thể tua 4×).', act: { solid: 'fe', massG: 2, to: 0 } }],
    phenomena: 'Lớp đồng đỏ bám lên đinh sắt; màu xanh của dung dịch nhạt dần.',
    equation: 'Fe + Cu²⁺ → Fe²⁺ + Cu',
    explanation: 'Fe có tính khử mạnh hơn Cu (E° Fe²⁺/Fe = −0,44 V < E° Cu²⁺/Cu = +0,34 V) nên khử Cu²⁺ thành Cu. Tốc độ trong mô phỏng là minh họa.',
    safety: 'Muối đồng độc khi nuốt; rửa tay sau thí nghiệm.',
    processRefs: ['fe-cu'], expect: [{ vessel: 0, key: 'rx-fe-cu' }], expectState: [{ vessel: 0, coat: 'Cu' }],
    references: ['E°: CRC Handbook'], tests: ['Fe + CuSO4: copper coats the nail mole-for-mole', 'experiment library: every experiment runs on the engine']
  },
  {
    id: 'exp-zinc-copper-sulfate', group: 'metals', grade: 'Hóa học 12', difficulty: 'Cơ bản', safetyLevel: 'Thấp', keywords: ['dãy hoạt động', 'Zn', 'CuSO4', 'phản ứng thế'],
    title: 'Kẽm trong dung dịch CuSO₄',
    objective: 'Quan sát Zn đẩy Cu ra khỏi dung dịch muối.',
    equipment: ['Cốc thủy tinh 100 mL', 'Kẹp hóa chất'], chemicals: ['CuSO₄ 0,5 M', 'Kẽm viên'],
    conditions: '25 °C.',
    setup: { vessels: [{ type: 'beaker100', fill: [['cuso4', 40]] }], bottles: [], tools: ['tongs'] },
    steps: [{ text: 'Dùng kẹp lấy viên kẽm (1 g) thả vào cốc CuSO₄; chờ.', act: { solid: 'zn', massG: 1, to: 0 } }],
    phenomena: 'Kim loại đỏ (Cu) bám lên viên kẽm; màu xanh nhạt dần.',
    equation: 'Zn + Cu²⁺ → Zn²⁺ + Cu',
    explanation: 'Zn khử mạnh hơn Cu (E° Zn²⁺/Zn = −0,76 V). Tốc độ trong mô phỏng là minh họa.',
    safety: 'Muối đồng độc khi nuốt.',
    processRefs: ['zn-cu'], expect: [{ vessel: 0, key: 'rx-zn-cu' }], expectState: [{ vessel: 0, coat: 'Cu' }],
    references: ['E°: CRC Handbook'], tests: ['every metal/solid rule conserves stoichiometry (Zn, Fe + acid; Zn + Cu²⁺; Cu + Ag⁺; CaCO₃ + acid)', 'experiment library: every experiment runs on the engine']
  },
  {
    id: 'exp-copper-silver-nitrate', group: 'metals', grade: 'Hóa học 12', difficulty: 'Cơ bản', safetyLevel: 'Trung bình', keywords: ['dãy hoạt động', 'Cu', 'AgNO3', 'bạc'],
    title: 'Dây đồng trong dung dịch AgNO₃',
    objective: 'Quan sát Cu đẩy Ag ra khỏi dung dịch muối; dung dịch xuất hiện màu xanh của Cu²⁺.',
    equipment: ['Cốc thủy tinh 100 mL', 'Kẹp hóa chất'], chemicals: ['AgNO₃ 0,1 M', 'Dây đồng'],
    conditions: '25 °C.',
    setup: { vessels: [{ type: 'beaker100', fill: [['agno3', 40]] }], bottles: [], tools: ['tongs'] },
    steps: [{ text: 'Dùng kẹp lấy dây đồng (1 g) thả vào cốc AgNO₃; chờ.', act: { solid: 'cu', massG: 1, to: 0 } }],
    phenomena: 'Lớp bạc xám bám lên dây đồng; dung dịch dần có màu xanh.',
    equation: 'Cu + 2Ag⁺ → Cu²⁺ + 2Ag',
    explanation: 'Cu khử Ag⁺ (E° Ag⁺/Ag = +0,80 V > E° Cu²⁺/Cu = +0,34 V). Tốc độ trong mô phỏng là minh họa.',
    safety: 'AgNO₃ làm đen da, độc với sinh vật nước: đeo găng, không đổ xuống cống.',
    processRefs: ['cu-ag'], expect: [{ vessel: 0, key: 'rx-cu-ag' }], expectState: [{ vessel: 0, coat: 'Ag' }],
    references: ['E°: CRC Handbook'], tests: ['every metal/solid rule conserves stoichiometry (Zn, Fe + acid; Zn + Cu²⁺; Cu + Ag⁺; CaCO₃ + acid)', 'experiment library: every experiment runs on the engine']
  },
  {
    id: 'exp-metals-in-acid', group: 'metals', grade: 'Hóa học 12', difficulty: 'Trung bình', safetyLevel: 'Trung bình', keywords: ['kim loại', 'axit', 'H2', 'dãy hoạt động', 'Mg', 'Zn', 'Cu'],
    title: 'Mg, Zn, Cu với dung dịch HCl',
    objective: 'Thấy kim loại đứng trước H giải phóng H₂ từ HCl, còn Cu (đứng sau H) thì không.',
    equipment: ['3 cốc thủy tinh 100 mL', 'Kẹp hóa chất'], chemicals: ['HCl 0,5 M', 'Magie (dải)', 'Kẽm viên', 'Dây đồng'],
    conditions: '25 °C; HCl loãng (axit không có tính oxi hóa mạnh). Không áp dụng cho HNO₃.',
    setup: { vessels: [{ type: 'beaker100', fill: [['hcl', 30]] }, { type: 'beaker100', fill: [['hcl', 30]] }, { type: 'beaker100', fill: [['hcl', 30]] }], bottles: [], tools: ['tongs'] },
    steps: [
      { text: 'Thả dải magie (0,05 g) vào cốc thứ nhất.', act: { solid: 'mg', massG: 0.05, to: 0 } },
      { text: 'Thả viên kẽm (0,5 g) vào cốc thứ hai.', act: { solid: 'zn', massG: 0.5, to: 1 } },
      { text: 'Thả dây đồng (1 g) vào cốc thứ ba.', act: { solid: 'cu', massG: 1, to: 2 } }
    ],
    phenomena: 'Cốc Mg và Zn sủi bọt khí không màu (H₂); cốc Cu không có hiện tượng.',
    equation: 'Mg + 2H⁺ → Mg²⁺ + H₂↑; Zn + 2H⁺ → Zn²⁺ + H₂↑',
    explanation: 'Mg, Zn đứng trước H nên khử được H⁺ thành H₂; Cu đứng sau H (E° Cu²⁺/Cu > 0) nên không phản ứng với HCl. Mức sủi bọt trong mô phỏng là minh họa, không phải số đo tốc độ.',
    safety: 'HCl ăn mòn; H₂ dễ cháy: không để gần lửa.',
    processRefs: ['mg-acid', 'zn-acid', 'norx-cu-h'], expect: [{ vessel: 0, key: 'rx-mg-acid' }, { vessel: 1, key: 'rx-zn-acid' }, { vessel: 2, key: 'norx-cu-' }], expectState: [{ vessel: 0, gas: 'H2' }, { vessel: 1, gas: 'H2' }, { vessel: 2, noGas: true }],
    references: ['E°: CRC Handbook'], tests: ['Mg + HCl: H2 = n(Mg), Mg2+ formed, elements conserved, pH from leftover acid', 'experiment library: every experiment runs on the engine']
  },
  {
    id: 'exp-no-displacement', group: 'metals', grade: 'Hóa học 12', difficulty: 'Cơ bản', safetyLevel: 'Thấp', keywords: ['dãy hoạt động', 'không phản ứng', 'Cu', 'Fe', 'ZnSO4'],
    title: 'Khi nào không có phản ứng thế: Cu và Fe trong ZnSO₄',
    objective: 'Kim loại yếu hơn không đẩy được kim loại mạnh hơn ra khỏi dung dịch muối.',
    equipment: ['2 cốc thủy tinh 100 mL', 'Kẹp hóa chất'], chemicals: ['ZnSO₄ 0,5 M', 'Dây đồng', 'Đinh sắt'],
    conditions: '25 °C.',
    setup: { vessels: [{ type: 'beaker100', fill: [['znso4', 30]] }, { type: 'beaker100', fill: [['znso4', 30]] }], bottles: [], tools: ['tongs'] },
    steps: [
      { text: 'Thả dây đồng (1 g) vào cốc thứ nhất.', act: { solid: 'cu', massG: 1, to: 0 } },
      { text: 'Thả đinh sắt (2 g) vào cốc thứ hai.', act: { solid: 'fe', massG: 2, to: 1 } }
    ],
    phenomena: 'Không có kim loại bám, không có khí, màu dung dịch không đổi.',
    equation: '—',
    explanation: 'Zn đứng trước Fe và Cu trong dãy hoạt động (E° Zn²⁺/Zn = −0,76 V thấp hơn), nên Fe và Cu không khử được Zn²⁺.',
    safety: 'ZnSO₄ có thể gây tổn thương mắt: đeo kính.',
    processRefs: ['norx-cu-Zn2+', 'norx-fe-Zn2+'], expect: [{ vessel: 0, key: 'norx-cu-' }, { vessel: 1, key: 'norx-fe-' }], expectState: [{ vessel: 0, noGas: true, noCoat: true }, { vessel: 1, noGas: true, noCoat: true }],
    references: ['E°: CRC Handbook'], tests: ['reaction coverage: unmodelled metal/ion pairs are NO_REACTION or UNSUPPORTED by E°, with no invented product', 'experiment library: every experiment runs on the engine']
  }
]
