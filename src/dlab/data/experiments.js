// Experiment Library (product phase 1): complete experiment definitions built ONLY on processes the engine already
// models. An experiment is data: the engine computes every result. Its validation status is not written by hand: it is
// the weakest status among the processes it uses (data/validation.js), so it can never be shown as better verified than
// the Scientific Validation Matrix.
//
// setup.vessels: [{ type, label, fill: [[reagent, mL]] }]; setup.bottles: reagents placed as bottles;
// steps: [{ text, act: { pour: reagent, to: vessel index, mL } }] — the same actions a student does with the action bar;
// expect: event key prefixes (state.events) that must appear in the named vessel once the steps are done.
import { MANIFEST } from './manifest.js'
import { validationOf } from './validation.js'

const RANK = ['VALIDATED', 'EDUCATIONAL APPROXIMATION', 'UNVERIFIED']
export function experimentValidation(exp) {
  const statuses = exp.processRefs.map(id => { const e = MANIFEST.find(m => m.id === id); return e ? validationOf(e)[0] : 'UNVERIFIED' })
  return statuses.reduce((worst, s) => (RANK.indexOf(s) > RANK.indexOf(worst) ? s : worst), 'VALIDATED')
}

export const EXPERIMENT_GROUPS = [{ id: 'precipitation', title: 'Kết tủa, hòa tan và tạo phức', grade: 'Hóa học 11–12' }]

export const EXPERIMENTS = [
  {
    id: 'exp-chloride-test', group: 'precipitation',
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
    id: 'exp-sulfate-test', group: 'precipitation',
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
    id: 'exp-copper-hydroxide', group: 'precipitation',
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
    id: 'exp-iron3-hydroxide', group: 'precipitation',
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
    id: 'exp-silver-halide-ammonia', group: 'precipitation',
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
    id: 'exp-copper-ammine', group: 'precipitation',
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
  }
]
