// Experiment Library — ChemLab 7.1 additions. Same schema and rules as experiments.js: data only, every result computed
// by the engine, validation status derived from processRefs. Numbers in the texts were checked against the engine and
// against the hand solutions named in `tests` (scripts/test-dlab.mjs).
export const GROUPS_71 = [
  { id: 'rate-energy', title: 'Tốc độ phản ứng, năng lượng và cân bằng', grade: 'Hóa học 10–11' },
  { id: 'practice', title: 'Kỹ thuật thực hành', grade: 'Hóa học 10–11' },
  { id: 'organic', title: 'Hóa học hữu cơ và sinh hóa', grade: 'Hóa học 12' }
]

const LIB = 'experiment library: every experiment runs on the engine'

export const LIBRARY_71 = [
  // ── Axit – bazơ và chất chỉ thị ──────────────────────────────────────
  {
    id: 'exp-litmus-media', group: 'acid-base', grade: 'Hóa học 11', difficulty: 'Cơ bản', safetyLevel: 'Trung bình', keywords: ['quỳ tím', 'môi trường', 'axit', 'bazơ', 'trung tính', 'chất chỉ thị'],
    title: 'Nhận biết môi trường axit, bazơ, trung tính bằng quỳ tím',
    objective: 'Dùng dung dịch quỳ tím phân biệt ba dung dịch HCl, NaCl và NaOH; nêu khoảng pH ứng với mỗi màu.',
    equipment: ['3 cốc thủy tinh 100 mL', 'Chai dung dịch quỳ tím'], chemicals: ['HCl 0,5 M', 'NaCl 0,5 M', 'NaOH 0,5 M', 'Dung dịch quỳ tím'],
    conditions: '25 °C. Quỳ tím: đỏ khi pH dưới khoảng 5, tím ở khoảng 5,5–7,5, xanh khi pH trên khoảng 8,3.',
    setup: { vessels: [{ type: 'beaker100', fill: [['hcl', 10]] }, { type: 'beaker100', fill: [['nacl', 10]] }, { type: 'beaker100', fill: [['naoh', 10]] }], bottles: ['litmus'] },
    steps: [
      { text: 'Nhỏ 3 giọt quỳ tím vào cốc A (HCl).', act: { drops: 'litmus', to: 0 } },
      { text: 'Nhỏ 3 giọt quỳ tím vào cốc B (NaCl).', act: { drops: 'litmus', to: 1 } },
      { text: 'Nhỏ 3 giọt quỳ tím vào cốc C (NaOH).', act: { drops: 'litmus', to: 2 } }
    ],
    phenomena: 'Cốc A (HCl) quỳ chuyển đỏ; cốc B (NaCl) giữ màu tím; cốc C (NaOH) chuyển xanh.',
    equation: 'HCl → H⁺ + Cl⁻; NaOH → Na⁺ + OH⁻',
    explanation: 'Quỳ tím là hỗn hợp chất màu đổi màu theo nồng độ H⁺. Dung dịch axit đủ mạnh (pH dưới khoảng 5) làm quỳ hóa đỏ, dung dịch bazơ (pH trên khoảng 8,3) làm quỳ hóa xanh, NaCl là muối của axit mạnh và bazơ mạnh nên trung tính.',
    safety: 'HCl và NaOH ăn mòn da, mắt: đeo kính bảo hộ và găng tay.',
    processRefs: ['indicators', 'acid-base-ph'], expect: [],
    expectState: [{ vessel: 0, indicator: ['litmus', 'màu đỏ'] }, { vessel: 1, indicator: ['litmus', 'màu tím'] }, { vessel: 2, indicator: ['litmus', 'màu xanh'] }],
    references: ['SGK Hóa học 11 (GDPT 2018), bài pH và chất chỉ thị', 'Khoảng đổi màu quỳ: Harris, Quantitative Chemical Analysis'], tests: ['pH strong acid / base', LIB]
  },
  {
    id: 'exp-methyl-orange', group: 'acid-base', grade: 'Hóa học 11', difficulty: 'Trung bình', safetyLevel: 'Trung bình', keywords: ['metyl da cam', 'methyl orange', 'chất chỉ thị', 'khoảng đổi màu'],
    title: 'Metyl da cam: chỉ thị đổi màu ở vùng axit',
    objective: 'Quan sát metyl da cam đỏ trong axit mạnh, vàng trong nước và trong kiềm; hiểu mỗi chất chỉ thị chỉ có một khoảng đổi màu.',
    equipment: ['3 cốc thủy tinh 100 mL', 'Chai metyl da cam'], chemicals: ['HCl 0,5 M', 'Nước cất', 'NaOH 0,5 M', 'Metyl da cam'],
    conditions: '25 °C. Metyl da cam: đỏ khi pH < 3,1; da cam 3,1–4,4; vàng khi pH > 4,4.',
    setup: { vessels: [{ type: 'beaker100', fill: [['hcl', 10]] }, { type: 'beaker100', fill: [['water', 10]] }, { type: 'beaker100', fill: [['naoh', 10]] }], bottles: ['methylOrange'] },
    steps: [
      { text: 'Nhỏ 3 giọt metyl da cam vào cốc A (HCl).', act: { drops: 'methylOrange', to: 0 } },
      { text: 'Nhỏ 3 giọt metyl da cam vào cốc B (nước cất).', act: { drops: 'methylOrange', to: 1 } },
      { text: 'Nhỏ 3 giọt metyl da cam vào cốc C (NaOH).', act: { drops: 'methylOrange', to: 2 } }
    ],
    phenomena: 'Cốc A đỏ; cốc B và cốc C đều vàng: metyl da cam không phân biệt được nước với dung dịch kiềm.',
    equation: 'HIn ⇌ H⁺ + In⁻',
    explanation: 'HIn là dạng axit (đỏ), In⁻ là dạng bazơ (vàng). Màu của chất chỉ thị đổi trong khoảng pKIn ± 1. Metyl da cam có pKIn ≈ 3,46 nên chỉ đổi màu ở vùng axit; mọi dung dịch có pH > 4,4 (nước, kiềm) đều vàng. Muốn phân biệt trung tính và kiềm phải dùng chất chỉ thị khác (phenolphtalein, quỳ tím).',
    safety: 'HCl và NaOH ăn mòn: đeo kính và găng tay. Metyl da cam độc khi nuốt.',
    processRefs: ['indicators', 'acid-base-ph'], expect: [],
    expectState: [{ vessel: 0, indicator: ['methylOrange', 'màu đỏ'] }, { vessel: 1, indicator: ['methylOrange', 'màu vàng'] }, { vessel: 2, indicator: ['methylOrange', 'màu vàng'] }],
    references: ['pKIn metyl da cam: Harris, Quantitative Chemical Analysis'], tests: ['pH strong acid / base', LIB]
  },
  {
    id: 'exp-salt-ph', group: 'acid-base', grade: 'Hóa học 11', difficulty: 'Nâng cao', safetyLevel: 'Trung bình', keywords: ['muối', 'thủy phân', 'pH', 'chỉ thị vạn năng', 'Na2CO3', 'FeCl3', 'CuSO4'],
    title: 'Môi trường của dung dịch muối',
    objective: 'Dùng chỉ thị vạn năng so sánh pH của NaCl, Na₂CO₃, ZnSO₄ và FeCl₃; giải thích bằng sự thủy phân của ion.',
    equipment: ['4 ống nghiệm', 'Chai chỉ thị vạn năng'], chemicals: ['NaCl 0,5 M', 'Na₂CO₃ 0,2 M', 'ZnSO₄ 0,5 M', 'FeCl₃ 0,2 M', 'Chỉ thị vạn năng'],
    conditions: '25 °C, dung dịch lí tưởng (bỏ qua hệ số hoạt độ). Chỉ thị vạn năng là thang màu định tính; giá trị pH xem trong Chi tiết.',
    setup: { vessels: [{ type: 'testTube', fill: [['nacl', 5]] }, { type: 'testTube', fill: [['na2co3', 5]] }, { type: 'testTube', fill: [['znso4', 5]] }, { type: 'testTube', fill: [['fecl3', 5]] }], bottles: ['universal'] },
    steps: [
      { text: 'Nhỏ 3 giọt chỉ thị vạn năng vào ống A (NaCl).', act: { drops: 'universal', to: 0 } },
      { text: 'Nhỏ 3 giọt vào ống B (Na₂CO₃).', act: { drops: 'universal', to: 1 } },
      { text: 'Nhỏ 3 giọt vào ống C (ZnSO₄).', act: { drops: 'universal', to: 2 } },
      { text: 'Nhỏ 3 giọt vào ống D (FeCl₃).', act: { drops: 'universal', to: 3 } }
    ],
    phenomena: 'NaCl: màu xanh lục (pH ≈ 7). Na₂CO₃: tím xanh (pH ≈ 11,8). ZnSO₄: vàng (pH ≈ 5,5). FeCl₃: đỏ cam (pH ≈ 1,5). (Muối có màu sẵn như CuSO₄ sẽ pha màu của nó với màu chỉ thị, nên ở đây dùng ZnSO₄ không màu.)',
    equation: 'CO₃²⁻ + H₂O ⇌ HCO₃⁻ + OH⁻; Fe³⁺ + H₂O ⇌ Fe(OH)²⁺ + H⁺; Zn²⁺ + H₂O ⇌ Zn(OH)⁺ + H⁺',
    explanation: 'Na⁺ và Cl⁻ không phản ứng với nước nên NaCl trung tính. Ion CO₃²⁻ nhận proton của nước tạo OH⁻ (môi trường bazơ). Ion kim loại có điện tích lớn, bán kính nhỏ như Fe³⁺, Zn²⁺ làm phân tử nước liên kết với nó tách H⁺ (môi trường axit); Fe³⁺ thủy phân mạnh hơn Zn²⁺ rất nhiều.',
    safety: 'FeCl₃ ăn mòn và làm ố da; ZnSO₄ có thể gây tổn thương mắt: đeo kính, găng, thu gom chất thải.',
    processRefs: ['salt-hydrolysis', 'indicators'], expect: [],
    expectState: [{ vessel: 0, pH: [6.9, 7.1] }, { vessel: 1, pH: [11.6, 12] }, { vessel: 2, pH: [5.3, 5.7] }, { vessel: 3, pH: [1.3, 1.7] }],
    references: ['Hằng số thủy phân: Baes & Mesmer, The Hydrolysis of Cations (1976); Powell và cs., IUPAC (2007)', 'Ka H₂CO₃/HCO₃⁻: CRC Handbook'], tests: ['salt hydrolysis: FeCl₃ pH matches the first-hydrolysis quadratic', LIB]
  },
  {
    id: 'exp-carbonate-order', group: 'acid-base', grade: 'Hóa học 11', difficulty: 'Nâng cao', safetyLevel: 'Trung bình', keywords: ['cacbonat', 'CO2', 'thứ tự', 'HCO3', 'Na2CO3', 'HCl', 'sủi bọt'],
    title: 'Nhỏ axit vào cacbonat hay cacbonat vào axit: khi nào sủi bọt?',
    objective: 'Thấy thứ tự thêm chất làm thay đổi hiện tượng: axit thêm từ từ vào Na₂CO₃ tạo HCO₃⁻ trước (chưa có khí), còn Na₂CO₃ cho vào axit dư sủi bọt ngay.',
    equipment: ['2 cốc thủy tinh 100 mL', 'Chai HCl', 'Chai Na₂CO₃'], chemicals: ['Na₂CO₃ 0,2 M', 'HCl 0,5 M'],
    conditions: '25 °C, 1 atm.',
    setup: { vessels: [{ type: 'beaker100', fill: [['na2co3', 20]] }, { type: 'beaker100', fill: [['hcl', 20]] }], bottles: ['hcl', 'na2co3'] },
    steps: [
      { text: 'Rót 8 mL HCl vào cốc A (4 mmol H⁺ cho 4 mmol CO₃²⁻). Quan sát: chưa có bọt khí.', act: { pour: 'hcl', to: 0, mL: 8 } },
      { text: 'Rót 5 mL Na₂CO₃ vào cốc B (HCl dư). Quan sát: sủi bọt ngay.', act: { pour: 'na2co3', to: 1, mL: 5 } },
      { text: 'Rót tiếp 12 mL HCl vào cốc A: bây giờ mới sủi bọt.', act: { pour: 'hcl', to: 0, mL: 12 } }
    ],
    phenomena: 'Cốc A: 8 mL HCl đầu không sủi bọt (pH ≈ 8,3); thêm axit mới có bọt khí CO₂. Cốc B: sủi bọt ngay khi cho Na₂CO₃.',
    equation: 'CO₃²⁻ + H⁺ → HCO₃⁻; HCO₃⁻ + H⁺ → CO₂↑ + H₂O',
    explanation: 'H⁺ phản ứng với CO₃²⁻ theo hai nấc. Khi axit thêm từ từ vào cacbonat, mỗi H⁺ gặp nhiều CO₃²⁻ nên chỉ tạo HCO₃⁻; khí chỉ thoát ra khi H⁺ đã vượt lượng CO₃²⁻. Khi cacbonat cho vào axit dư, mỗi CO₃²⁻ gặp ngay 2H⁺ nên tạo CO₂ ngay. Đây là cách nhận biết HCl và Na₂CO₃ mà không cần thuốc thử khác.',
    safety: 'HCl ăn mòn: đeo kính và găng tay.',
    processRefs: ['co2-carbonate'], expect: [{ vessel: 0, key: 'co2' }, { vessel: 1, key: 'co2' }],
    expectState: [{ vessel: 0, gas: 'CO2' }, { vessel: 1, gas: 'CO2' }],
    references: ['Ka1, Ka2 H₂CO₃: CRC Handbook', 'SGK Hóa học 11 (GDPT 2018)'], tests: ['carbonate order: HCl into Na₂CO₃ gives HCO₃⁻ first (no gas), excess acid gives CO₂ (hand solution)', LIB]
  },
  {
    id: 'exp-acetic-bicarbonate', group: 'acid-base', grade: 'Hóa học 11', difficulty: 'Cơ bản', safetyLevel: 'Thấp', keywords: ['axit axetic', 'giấm', 'NaHCO3', 'baking soda', 'CO2', 'axit cacboxylic'],
    title: 'Axit axetic tác dụng với NaHCO₃',
    objective: 'Chứng minh CH₃COOH là axit mạnh hơn axit cacbonic: nó đẩy CO₂ khỏi muối hiđrocacbonat.',
    equipment: ['Cốc thủy tinh 100 mL', 'Thìa lấy hóa chất'], chemicals: ['CH₃COOH 1 M', 'Bột NaHCO₃'],
    conditions: '25 °C, 1 atm.',
    setup: { vessels: [{ type: 'beaker100', fill: [['ch3cooh', 20]] }], bottles: [], tools: ['spatula'] },
    steps: [{ text: 'Dùng thìa lấy 1 g bột NaHCO₃ cho vào cốc axit axetic.', act: { solid: 'nahco3-s', massG: 1, to: 0 } }],
    phenomena: 'Bột tan, sủi bọt khí không màu mạnh; khí là CO₂.',
    equation: 'CH₃COOH + NaHCO₃ → CH₃COONa + CO₂↑ + H₂O',
    explanation: 'Ka(CH₃COOH) = 1,75·10⁻⁵ lớn hơn Ka1(H₂CO₃) = 4,5·10⁻⁷ nên axit axetic chuyển HCO₃⁻ thành H₂CO₃, chất này phân hủy giải phóng CO₂. 1 g NaHCO₃ (11,9 mmol) cần 11,9 mmol axit; cốc có 20 mmol nên axit dư.',
    safety: 'Axit axetic 1 M gây kích ứng mắt: đeo kính.',
    processRefs: ['co2-carbonate', 'dissolve-salts'], expect: [{ vessel: 0, key: 'co2' }],
    expectState: [{ vessel: 0, gas: 'CO2', left: 'OAc' }],
    references: ['Ka: CRC Handbook', 'SGK Hóa học 11 (GDPT 2018), bài Carboxylic acid'], tests: ['pH weak acid / base (quadratic)', LIB]
  },
  // ── Kết tủa, hòa tan và tạo phức ─────────────────────────────────────
  {
    id: 'exp-iron2-hydroxide', group: 'precipitation', grade: 'Hóa học 12', difficulty: 'Cơ bản', safetyLevel: 'Trung bình', keywords: ['Fe(OH)2', 'sắt(II)', 'hiđroxit', 'kết tủa', 'FeSO4'],
    title: 'Sắt(II) hiđroxit: kết tủa trắng xanh',
    objective: 'Nhận biết ion Fe²⁺ bằng dung dịch kiềm: kết tủa Fe(OH)₂ màu trắng xanh, khác Fe(OH)₃ nâu đỏ.',
    equipment: ['Cốc thủy tinh 100 mL', 'Chai NaOH'], chemicals: ['FeSO₄ 0,2 M', 'NaOH 0,5 M'],
    conditions: '25 °C. Mô phỏng không có không khí: không tính Fe(OH)₂ bị O₂ oxi hóa.',
    setup: { vessels: [{ type: 'beaker100', fill: [['feso4', 10]] }], bottles: ['naoh'] },
    steps: [{ text: 'Rót 10 mL NaOH vào cốc FeSO₄.', act: { pour: 'naoh', to: 0, mL: 10 } }],
    phenomena: 'Xuất hiện kết tủa trắng xanh Fe(OH)₂. Ngoài thực tế, để lâu trong không khí kết tủa chuyển dần sang nâu đỏ (mô phỏng không thể hiện bước này).',
    equation: 'Fe²⁺ + 2OH⁻ → Fe(OH)₂↓',
    explanation: '2 mmol Fe²⁺ cần 4 mmol OH⁻; cốc có 5 mmol nên Fe²⁺ kết tủa hết, dư OH⁻. Fe(OH)₂ dễ bị O₂ oxi hóa: 4Fe(OH)₂ + O₂ + 2H₂O → 4Fe(OH)₃; vì vậy màu trắng xanh chỉ thấy rõ lúc mới tạo.',
    safety: 'NaOH ăn mòn: đeo kính và găng tay.',
    processRefs: ['ppt-Fe(OH)2'], expect: [{ vessel: 0, key: 'ppt-Fe(OH)2' }],
    expectState: [{ vessel: 0, precipitate: 'Fe(OH)2', gone: 'Fe2+' }],
    references: ['Ksp Fe(OH)₂: CRC Handbook', 'SGK Hóa học 12 (GDPT 2018), bài sắt'], tests: ['hydroxide precipitates: Fe(OH)3, Fe(OH)2, Mg(OH)2 take the limiting reagent', LIB]
  },
  {
    id: 'exp-magnesium-hydroxide', group: 'precipitation', grade: 'Hóa học 12', difficulty: 'Cơ bản', safetyLevel: 'Trung bình', keywords: ['Mg(OH)2', 'magie', 'hiđroxit', 'bazơ', 'hòa tan'],
    title: 'Magie hiđroxit: kết tủa rồi tan trong axit',
    objective: 'Tạo Mg(OH)₂ từ MgCl₂ và NaOH, rồi hòa tan bằng HCl; nhận ra Mg(OH)₂ là bazơ (không tan trong kiềm dư).',
    equipment: ['Cốc thủy tinh 100 mL', 'Chai NaOH', 'Chai HCl'], chemicals: ['MgCl₂ 0,2 M', 'NaOH 0,5 M', 'HCl 0,5 M'],
    conditions: '25 °C.',
    setup: { vessels: [{ type: 'beaker100', fill: [['mgcl2', 10]] }], bottles: ['naoh', 'hcl'] },
    steps: [
      { text: 'Rót 10 mL NaOH vào cốc MgCl₂.', act: { pour: 'naoh', to: 0, mL: 10 } },
      { text: 'Rót 15 mL HCl vào cốc.', act: { pour: 'hcl', to: 0, mL: 15 } }
    ],
    phenomena: 'NaOH tạo kết tủa trắng Mg(OH)₂; thêm HCl, kết tủa tan hết, dung dịch trong suốt.',
    equation: 'Mg²⁺ + 2OH⁻ → Mg(OH)₂↓; Mg(OH)₂ + 2H⁺ → Mg²⁺ + 2H₂O',
    explanation: '2 mmol Mg²⁺ kết tủa với 4 mmol OH⁻. 7,5 mmol H⁺ trung hòa 1 mmol OH⁻ dư và hòa tan 2 mmol Mg(OH)₂ (cần 4 mmol H⁺), còn dư axit.',
    safety: 'NaOH và HCl ăn mòn: đeo kính và găng tay.',
    processRefs: ['ppt-Mg(OH)2', 'redissolve'], expect: [{ vessel: 0, key: 'ppt-Mg(OH)2' }],
    expectState: [{ vessel: 0, noPrecipitate: 'Mg(OH)2', left: 'Mg2+' }],
    references: ['Ksp Mg(OH)₂: CRC Handbook'], tests: ['hydroxide precipitates: Fe(OH)3, Fe(OH)2, Mg(OH)2 take the limiting reagent', LIB]
  },
  {
    id: 'exp-carbonate-vs-sulfate', group: 'precipitation', grade: 'Hóa học 11', difficulty: 'Trung bình', safetyLevel: 'Trung bình', keywords: ['BaCO3', 'BaSO4', 'phân biệt', 'axit', 'nhận biết', 'sunfat', 'cacbonat'],
    title: 'Phân biệt kết tủa BaCO₃ và BaSO₄ bằng axit',
    objective: 'Cả CO₃²⁻ và SO₄²⁻ đều tạo kết tủa trắng với Ba²⁺; dùng HCl để phân biệt: BaCO₃ tan và sủi bọt, BaSO₄ không tan.',
    equipment: ['2 cốc thủy tinh 100 mL', 'Chai Na₂CO₃', 'Chai Na₂SO₄', 'Chai HCl'], chemicals: ['BaCl₂ 0,2 M', 'Na₂CO₃ 0,2 M', 'Na₂SO₄ 0,2 M', 'HCl 0,5 M'],
    conditions: '25 °C.',
    setup: { vessels: [{ type: 'beaker100', fill: [['bacl2', 10]] }, { type: 'beaker100', fill: [['bacl2', 10]] }], bottles: ['na2co3', 'na2so4', 'hcl'] },
    steps: [
      { text: 'Rót 10 mL Na₂CO₃ vào cốc A.', act: { pour: 'na2co3', to: 0, mL: 10 } },
      { text: 'Rót 10 mL Na₂SO₄ vào cốc B.', act: { pour: 'na2so4', to: 1, mL: 10 } },
      { text: 'Rót 15 mL HCl vào cốc A.', act: { pour: 'hcl', to: 0, mL: 15 } },
      { text: 'Rót 15 mL HCl vào cốc B.', act: { pour: 'hcl', to: 1, mL: 15 } }
    ],
    phenomena: 'Cả hai cốc có kết tủa trắng. Thêm HCl: kết tủa ở cốc A tan, sủi bọt khí CO₂; kết tủa ở cốc B không đổi.',
    equation: 'Ba²⁺ + CO₃²⁻ → BaCO₃↓; BaCO₃ + 2H⁺ → Ba²⁺ + CO₂↑ + H₂O; Ba²⁺ + SO₄²⁻ → BaSO₄↓',
    explanation: 'Trong axit, CO₃²⁻ bị chuyển thành H₂CO₃ rồi CO₂ thoát ra, nên cân bằng hòa tan của BaCO₃ dịch chuyển đến khi tan hết. SO₄²⁻ là bazơ rất yếu (HSO₄⁻ có Ka = 10⁻²), BaSO₄ lại rất ít tan (Ksp ≈ 1,1·10⁻¹⁰) nên không tan trong axit loãng: đó là lí do BaCl₂ + axit dùng để nhận biết SO₄²⁻.',
    safety: 'Hợp chất bari tan độc khi nuốt; HCl ăn mòn: đeo kính, găng tay, rửa tay sau thí nghiệm.',
    processRefs: ['ppt-BaCO3', 'ppt-BaSO4', 'co2-carbonate'], expect: [{ vessel: 0, key: 'ppt-BaCO3' }, { vessel: 0, key: 'co2' }, { vessel: 1, key: 'ppt-BaSO4' }],
    expectState: [{ vessel: 0, noPrecipitate: 'BaCO3', gas: 'CO2' }, { vessel: 1, precipitate: 'BaSO4' }],
    references: ['Ksp BaCO₃, BaSO₄; Ka HSO₄⁻: CRC Handbook'], tests: ['carbonates: BaCO₃/CaCO₃ residual matches an independent Ksp + carbonate solve', LIB]
  },
  {
    id: 'exp-hard-water', group: 'precipitation', grade: 'Hóa học 12', difficulty: 'Cơ bản', safetyLevel: 'Thấp', keywords: ['nước cứng', 'làm mềm', 'CaCO3', 'Na2CO3', 'Ca2+'],
    title: 'Làm mềm nước cứng bằng Na₂CO₃',
    objective: 'Loại ion Ca²⁺ (nguyên nhân gây nước cứng) ra khỏi dung dịch dưới dạng CaCO₃ kết tủa.',
    equipment: ['Cốc thủy tinh 100 mL', 'Chai Na₂CO₃'], chemicals: ['CaCl₂ 0,2 M (mô phỏng nước cứng vĩnh cửu)', 'Na₂CO₃ 0,2 M'],
    conditions: '25 °C. CaCl₂ 0,2 M đậm đặc hơn nước cứng thật nhiều lần để dễ quan sát.',
    setup: { vessels: [{ type: 'beaker100', fill: [['cacl2', 10]] }], bottles: ['na2co3'] },
    steps: [{ text: 'Rót 10 mL Na₂CO₃ vào cốc CaCl₂.', act: { pour: 'na2co3', to: 0, mL: 10 } }],
    phenomena: 'Xuất hiện kết tủa trắng CaCO₃; gần như toàn bộ Ca²⁺ bị loại khỏi dung dịch.',
    equation: 'Ca²⁺ + CO₃²⁻ → CaCO₃↓',
    explanation: 'Nước chứa nhiều Ca²⁺, Mg²⁺ là nước cứng. CaCl₂ (nước cứng vĩnh cửu) không làm mềm được bằng cách đun, nhưng Na₂CO₃ chuyển Ca²⁺ thành CaCO₃ rất ít tan (Ksp ≈ 3,4·10⁻⁹). Lượng Ca²⁺ còn lại cỡ 10⁻⁴ M.',
    safety: 'Na₂CO₃ gây kích ứng mắt: đeo kính.',
    processRefs: ['ppt-CaCO3'], expect: [{ vessel: 0, key: 'ppt-CaCO3' }],
    expectState: [{ vessel: 0, precipitate: 'CaCO3' }],
    references: ['Ksp CaCO₃ (canxit): CRC Handbook', 'SGK Hóa học 12 (GDPT 2018), bài nước cứng'], tests: ['carbonates: BaCO₃/CaCO₃ residual matches an independent Ksp + carbonate solve', LIB]
  },
  {
    id: 'exp-fractional-precipitation', group: 'precipitation', grade: 'Hóa học 11', difficulty: 'Nâng cao', safetyLevel: 'Trung bình', keywords: ['kết tủa phân đoạn', 'AgI', 'AgCl', 'Ksp', 'chuyển hóa kết tủa', 'halogenua'],
    title: 'Kết tủa nào tạo trước? AgI và AgCl',
    objective: 'Thấy chất ít tan hơn kết tủa trước (AgI trước AgCl), và AgCl chuyển thành AgI khi gặp I⁻.',
    equipment: ['2 cốc thủy tinh 100 mL', 'Chai AgNO₃', 'Chai KI'], chemicals: ['NaCl 0,5 M', 'KI 0,1 M', 'AgNO₃ 0,1 M'],
    conditions: '25 °C, không có NH₃.',
    setup: { vessels: [{ type: 'beaker100', fill: [['nacl', 2], ['ki', 10]] }, { type: 'beaker100', fill: [['nacl', 5]] }], bottles: ['agno3', 'ki'] },
    steps: [
      { text: 'Rót 5 mL AgNO₃ vào cốc A (1 mmol Cl⁻, 1 mmol I⁻, chỉ 0,5 mmol Ag⁺).', act: { pour: 'agno3', to: 0, mL: 5 } },
      { text: 'Rót 5 mL AgNO₃ vào cốc B (chỉ có Cl⁻).', act: { pour: 'agno3', to: 1, mL: 5 } },
      { text: 'Rót 10 mL KI vào cốc B (đã có AgCl).', act: { pour: 'ki', to: 1, mL: 10 } }
    ],
    phenomena: 'Cốc A: chỉ có kết tủa vàng nhạt AgI, Cl⁻ vẫn ở trong dung dịch. Cốc B: kết tủa trắng AgCl, thêm KI thì chuyển thành kết tủa vàng AgI.',
    equation: 'Ag⁺ + I⁻ → AgI↓ (trước); AgCl(r) + I⁻ → AgI(r) + Cl⁻',
    explanation: 'Ksp(AgI) = 8,5·10⁻¹⁷ nhỏ hơn Ksp(AgCl) = 1,8·10⁻¹⁰ khoảng 2 triệu lần, nên với lượng Ag⁺ ít, AgI tạo thành trước; AgCl chỉ xuất hiện khi I⁻ đã gần hết. Vì AgI ít tan hơn nhiều, I⁻ lấy Ag⁺ từ AgCl: K = Ksp(AgCl)/Ksp(AgI) ≈ 2·10⁶, kết tủa trắng chuyển thành vàng.',
    safety: 'AgNO₃ làm đen da và độc với sinh vật nước: đeo găng, thu gom chất thải chứa bạc.',
    processRefs: ['ppt-AgI', 'ppt-AgCl', 'competitive-precipitation'], expect: [{ vessel: 0, key: 'ppt-AgI' }, { vessel: 1, key: 'ppt-AgCl' }, { vessel: 1, key: 'ppt-AgI' }],
    expectState: [{ vessel: 0, precipitate: 'AgI', noPrecipitate: 'AgCl', left: 'Cl-' }, { vessel: 1, precipitate: 'AgI', noPrecipitate: 'AgCl' }],
    references: ['Ksp AgCl, AgI: CRC Handbook'], tests: ['competitive precipitation: the least soluble salt forms first; AgCl turns into AgI (hand solution)', LIB]
  },
  // ── Kim loại ─────────────────────────────────────────────────────────
  {
    id: 'exp-sodium-water', group: 'metals', grade: 'Hóa học 12', difficulty: 'Trung bình', safetyLevel: 'Cao', keywords: ['natri', 'kim loại kiềm', 'nước', 'H2', 'phenolphtalein', 'NaOH'],
    title: 'Natri tác dụng với nước (giáo viên biểu diễn)',
    objective: 'Quan sát kim loại kiềm khử nước: mẩu Na chạy trên mặt nước, có khí H₂, dung dịch hóa bazơ (phenolphtalein chuyển hồng) và ấm lên.',
    equipment: ['Cốc thủy tinh 250 mL', 'Kẹp hóa chất', 'Chai phenolphtalein'], chemicals: ['Nước cất', 'Natri (mẩu 0,1 g)', 'Phenolphtalein'],
    conditions: 'Mẩu Na nhỏ (0,1 g), ít nhất 50 mL nước, cốc rộng miệng. Chỉ giáo viên biểu diễn, có tấm chắn.',
    setup: { vessels: [{ type: 'beaker250', fill: [['water', 100]] }], bottles: ['phenolphthalein'], tools: ['tongs'] },
    steps: [
      { text: 'Nhỏ 3 giọt phenolphtalein vào cốc nước.', act: { drops: 'phenolphthalein', to: 0 } },
      { text: 'Dùng kẹp thả mẩu natri 0,1 g vào cốc.', act: { solid: 'na', massG: 0.1, to: 0 } }
    ],
    phenomena: 'Mẩu natri nổi, chạy trên mặt nước, tan dần và có khí thoát ra; dung dịch chuyển hồng và ấm lên.',
    equation: '2Na + 2H₂O → 2NaOH + H₂↑',
    explanation: 'Na có tính khử rất mạnh (E° Na⁺/Na = −2,71 V) nên khử được nước ở nhiệt độ thường. NaOH sinh ra làm phenolphtalein hóa hồng. 0,1 g Na (4,35 mmol) cho 2,2 mmol H₂ và dung dịch NaOH ≈ 0,04 M (pH ≈ 12,6).',
    safety: 'Nguy hiểm: Na phản ứng mãnh liệt với nước, H₂ dễ cháy nổ, NaOH ăn mòn. Chỉ dùng mẩu bằng hạt đậu xanh, dùng kẹp (không cầm tay), đeo kính, đứng xa; không làm với mẩu lớn. Học sinh không tự làm.',
    processRefs: ['na-water', 'indicators'], expect: [{ vessel: 0, key: 'rx-na-water' }],
    expectState: [{ vessel: 0, gas: 'H2', indicator: ['phenolphthalein', 'chuyển hồng'], pH: [12.4, 12.8] }],
    references: ['E° Na⁺/Na: CRC Handbook', 'SGK Hóa học 12 (GDPT 2018), nhóm IA'], tests: ['Na + water: floats, moves', LIB]
  },
  // ── Tốc độ phản ứng, năng lượng và cân bằng ──────────────────────────
  {
    id: 'exp-rate-concentration', group: 'rate-energy', grade: 'Hóa học 10', difficulty: 'Trung bình', safetyLevel: 'Trung bình', keywords: ['tốc độ phản ứng', 'nồng độ', 'đá vôi', 'CaCO3', 'HCl', 'CO2'],
    title: 'Nồng độ ảnh hưởng đến tốc độ phản ứng',
    objective: 'So sánh tốc độ thoát khí CO₂ khi cho cùng một mẩu đá vôi vào HCl 0,5 M và HCl đã pha loãng gấp đôi.',
    equipment: ['2 cốc thủy tinh 100 mL (cốc B đã pha loãng sẵn HCl bằng nước cất)', 'Kẹp hóa chất'], chemicals: ['HCl 0,5 M', 'Nước cất', 'Đá vôi (CaCO₃) 1 g'],
    conditions: '25 °C, cùng thể tích (30 mL), cùng khối lượng đá vôi. Hằng số tốc độ là giá trị minh họa; mô hình giả sử tốc độ tỉ lệ với [H⁺] và diện tích bề mặt.',
    setup: { vessels: [{ type: 'beaker100', fill: [['hcl', 30]] }, { type: 'beaker100', fill: [['hcl', 15], ['water', 15]] }], bottles: [], tools: ['tongs'] },
    steps: [
      { text: 'Dùng kẹp thả 1 g đá vôi vào cốc A (HCl 0,5 M).', act: { solid: 'caco3', massG: 1, to: 0 } },
      { text: 'Thả 1 g đá vôi vào cốc B (HCl 0,25 M). So sánh lượng bọt khí và lượng khí đã thoát ở hai cốc.', act: { solid: 'caco3', massG: 1, to: 1 } }
    ],
    phenomena: 'Cả hai cốc sủi bọt khí CO₂; cốc A sủi mạnh hơn. Sau cùng một khoảng thời gian, lượng CO₂ ở cốc A gần gấp đôi cốc B (xem Chi tiết).',
    equation: 'CaCO₃ + 2H⁺ → Ca²⁺ + CO₂↑ + H₂O',
    explanation: 'Phản ứng xảy ra trên bề mặt đá vôi; nồng độ H⁺ lớn hơn thì số va chạm hiệu quả trong một đơn vị thời gian lớn hơn nên tốc độ lớn hơn. Tốc độ trong mô phỏng là minh họa (không phải số đo), nhưng xu hướng "nồng độ tăng thì tốc độ tăng" đúng với thực nghiệm.',
    safety: 'HCl ăn mòn: đeo kính và găng tay.',
    processRefs: ['caco3-acid', 'rate-concentration'], expect: [{ vessel: 0, key: 'rx-caco3-acid' }, { vessel: 1, key: 'rx-caco3-acid' }],
    expectState: [{ vessel: 0, gas: 'CO2' }, { vessel: 1, gas: 'CO2' }],
    references: ['SGK Hóa học 10 (GDPT 2018), chương Tốc độ phản ứng'], tests: ['rate: marble in HCl releases CO₂ in proportion to [H⁺] (model)', LIB]
  },
  {
    id: 'exp-neutralisation-heat', group: 'rate-energy', grade: 'Hóa học 10', difficulty: 'Trung bình', safetyLevel: 'Trung bình', keywords: ['tỏa nhiệt', 'enthalpy', 'trung hòa', 'nhiệt độ', 'ΔH', 'năng lượng'],
    title: 'Phản ứng trung hòa tỏa nhiệt',
    objective: 'Đo nhiệt độ tăng khi trộn HCl với NaOH và ước lượng nhiệt của phản ứng trung hòa.',
    equipment: ['Cốc thủy tinh 100 mL', 'Chai NaOH', 'Nhiệt kế (xem nhiệt độ trong Chi tiết)'], chemicals: ['HCl 0,5 M', 'NaOH 0,5 M'],
    conditions: 'Hai dung dịch cùng ở 25 °C; bỏ qua nhiệt mất ra không khí trong thời gian ngắn; cốc thủy tinh hấp thụ một phần nhiệt.',
    setup: { vessels: [{ type: 'beaker100', fill: [['hcl', 25]] }], bottles: ['naoh'] },
    steps: [{ text: 'Rót 25 mL NaOH vào cốc HCl, quan sát nhiệt độ.', act: { pour: 'naoh', to: 0, mL: 25 } }],
    phenomena: 'Nhiệt độ dung dịch tăng khoảng 2,5–3 °C; pH ≈ 7.',
    equation: 'H⁺ + OH⁻ → H₂O, ΔrH° = −55,8 kJ/mol',
    explanation: '12,5 mmol H⁺ trung hòa 12,5 mmol OH⁻ tỏa 12,5·10⁻³ × 55,8 kJ ≈ 0,70 kJ. Chia cho nhiệt dung của 50 g dung dịch (≈ 209 J/K) và cốc thủy tinh thì nhiệt độ tăng ≈ 2,7 °C. Phản ứng có ΔH < 0 là phản ứng tỏa nhiệt.',
    safety: 'HCl và NaOH ăn mòn: đeo kính và găng tay.',
    processRefs: ['neutralisation', 'neutralisation-heat'], expect: [{ vessel: 0, key: 'neutral' }],
    expectState: [{ vessel: 0, pH: [6.5, 7.5], warm: [2, 3.5] }],
    references: ['ΔfH° (H₂O, H⁺, OH⁻): NBS Tables (1982)', 'SGK Hóa học 10 (GDPT 2018), Năng lượng hóa học'], tests: ['heat of neutralisation: temperature rise matches the hand calculation', LIB]
  },
  // ── Kỹ thuật thực hành ───────────────────────────────────────────────
  {
    id: 'exp-saturated-salt', group: 'practice', grade: 'Hóa học 10', difficulty: 'Cơ bản', safetyLevel: 'Thấp', keywords: ['độ tan', 'bão hòa', 'NaCl', 'muối ăn', 'hòa tan', 'pha dung dịch'],
    title: 'Dung dịch bão hòa: muối ăn tan đến giới hạn',
    objective: 'Thấy độ tan có giới hạn: 20 mL nước ở 25 °C chỉ hòa tan được khoảng 7,2 g NaCl; phần dư nằm lại ở đáy.',
    equipment: ['Cốc thủy tinh 100 mL', 'Thìa lấy hóa chất'], chemicals: ['Nước cất', 'Muối ăn (NaCl tinh thể)'],
    conditions: '25 °C. Độ tan NaCl ≈ 36 g/100 g nước, gần như không đổi theo nhiệt độ.',
    setup: { vessels: [{ type: 'beaker100', fill: [['water', 20]] }], bottles: [], tools: ['spatula'] },
    steps: [{ text: 'Dùng thìa cho 10 g muối ăn vào cốc nước, chờ muối tan.', act: { solid: 'nacl-s', massG: 10, to: 0 } }],
    phenomena: 'Muối tan nhanh lúc đầu rồi ngừng: còn khoảng 2,8 g tinh thể không tan ở đáy cốc; dung dịch đã bão hòa.',
    equation: 'NaCl(r) ⇌ Na⁺(aq) + Cl⁻(aq)',
    explanation: '20 mL nước ≈ 19,9 g hòa tan tối đa 19,9 × 36/100 ≈ 7,2 g NaCl. Lượng dư (≈ 2,8 g) nằm cân bằng với dung dịch bão hòa: tốc độ tan bằng tốc độ kết tinh.',
    safety: 'Ít nguy hiểm.',
    processRefs: ['dissolve-salts'], expect: [{ vessel: 0, key: 'dissolve' }],
    expectState: [{ vessel: 0, left: 'Na+', solidLeft: [2.5, 3.1] }],
    references: ['Độ tan NaCl: CRC Handbook'], tests: ['saturated NaCl: undissolved salt equals mass − solubility (hand solution)', LIB]
  },
  {
    id: 'exp-liquid-layers', group: 'practice', grade: 'Hóa học 11', difficulty: 'Cơ bản', safetyLevel: 'Thấp', keywords: ['phân lớp', 'dầu ăn', 'etanol', 'tan', 'chiết', 'không tan'],
    title: 'Chất lỏng tan và không tan: nước, etanol, dầu ăn',
    objective: 'Quan sát dầu ăn không tan, nổi trên nước (phân lớp), còn etanol tan hoàn toàn trong nước (tan theo mọi tỉ lệ); liên hệ với phương pháp chiết.',
    equipment: ['2 cốc thủy tinh 100 mL', 'Chai dầu ăn', 'Chai etanol'], chemicals: ['Nước cất', 'Dầu ăn', 'Etanol'],
    conditions: '25 °C.',
    setup: { vessels: [{ type: 'beaker100', fill: [['water', 30]] }, { type: 'beaker100', fill: [['water', 30]] }], bottles: ['oil', 'ethanol'] },
    steps: [
      { text: 'Rót 10 mL dầu ăn vào cốc A.', act: { pour: 'oil', to: 0, mL: 10 } },
      { text: 'Rót 3 mL etanol vào cốc B.', act: { pour: 'ethanol', to: 1, mL: 3 } }
    ],
    phenomena: 'Cốc A: dầu ăn tách thành lớp riêng nổi trên nước. Cốc B: etanol trộn đều với nước thành một chất lỏng đồng nhất.',
    equation: '—',
    explanation: 'Etanol có nhóm –OH tạo liên kết hiđro với nước nên tan vô hạn. Dầu ăn là chất béo không phân cực, không tan trong nước và nhẹ hơn nước (≈ 0,92 g/mL) nên nổi lên. Hai chất lỏng không tan vào nhau và có khối lượng riêng khác nhau thì tách được bằng phễu chiết.',
    safety: 'Etanol dễ cháy: tránh xa ngọn lửa.',
    processRefs: ['layers'], expect: [],
    expectState: [],
    references: ['Khối lượng riêng: Lange\'s Handbook', 'SGK Hóa học 11 (GDPT 2018), Tách và tinh chế hợp chất hữu cơ'], tests: ['solvent: ethanol is not water', LIB]
  },
  // ── Mô hình mới của 7.1: MnO₄⁻/Fe²⁺, Fe³⁺/SCN⁻, hồ tinh bột – iot ─────
  {
    id: 'exp-permanganate-iron2', group: 'redox', grade: 'Hóa học 10', difficulty: 'Trung bình', safetyLevel: 'Trung bình', keywords: ['KMnO4', 'pemanganat', 'Fe2+', 'oxi hóa khử', 'chuẩn độ', 'mất màu'],
    title: 'KMnO₄ oxi hóa Fe²⁺ trong môi trường axit',
    objective: 'Quan sát màu tím của MnO₄⁻ mất khi gặp Fe²⁺ trong axit; khi Fe²⁺ hết, KMnO₄ dư làm dung dịch hồng tím (nguyên tắc chuẩn độ pemanganat, lớp 12).',
    equipment: ['Cốc thủy tinh 100 mL', 'Chai KMnO₄'], chemicals: ['FeSO₄ 0,2 M', 'H₂SO₄ loãng 0,25 M', 'KMnO₄ 0,02 M'],
    conditions: '25 °C, môi trường axit rõ (pH ≤ 2). Ít axit hơn thì thực tế tạo MnO₂ nâu đen: mô phỏng báo ngoài phạm vi mô hình.',
    setup: { vessels: [{ type: 'beaker100', fill: [['feso4', 5], ['h2so4', 10]] }], bottles: ['kmno4'] },
    steps: [
      { text: 'Rót 5 mL KMnO₄ vào cốc (0,1 mmol MnO₄⁻; 1 mmol Fe²⁺): màu tím mất ngay.', act: { pour: 'kmno4', to: 0, mL: 5 } },
      { text: 'Rót tiếp 6 mL KMnO₄: Fe²⁺ hết, dung dịch chuyển hồng tím.', act: { pour: 'kmno4', to: 0, mL: 6 } }
    ],
    phenomena: '5 mL đầu: màu tím mất ngay khi chạm dung dịch, dung dịch vàng rất nhạt (Fe³⁺). Khi đã thêm hơn 10 mL: dung dịch giữ màu hồng tím của MnO₄⁻ dư.',
    equation: 'MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O',
    explanation: 'Mn(+7) nhận 5 electron thành Mn²⁺ (gần như không màu), mỗi Fe²⁺ nhường 1 electron. 1 mmol Fe²⁺ cần đúng 0,2 mmol MnO₄⁻ (10 mL KMnO₄ 0,02 M): trước điểm đó MnO₄⁻ bị khử hết nên mất màu, sau điểm đó MnO₄⁻ dư nên có màu. Chính MnO₄⁻ là chất chỉ thị trong phép chuẩn độ. Phản ứng cần H⁺: 8 H⁺ cho mỗi MnO₄⁻.',
    safety: 'KMnO₄ là chất oxi hóa mạnh, làm ố da; H₂SO₄ ăn mòn: đeo kính và găng tay. Thu gom chất thải chứa mangan.',
    processRefs: ['redox-mno4-fe'], expect: [{ vessel: 0, key: 'redox-mno4-fe' }],
    expectState: [{ vessel: 0, gone: 'Fe2+', left: 'MnO4-' }, { vessel: 0, left: 'Fe3+', pH: [1, 2] }],
    references: ['E° MnO₄⁻/Mn²⁺, Fe³⁺/Fe²⁺: CRC Handbook', 'ε MnO₄⁻ ≈ 2400 L/(mol·cm) ở 525 nm', 'SGK Hóa học 12 (GDPT 2018): chuẩn độ FeSO₄ bằng KMnO₄'], tests: ['permanganate: MnO₄⁻ + 5Fe²⁺ end point at n(MnO₄⁻) = n(Fe²⁺)/5; stops (out of range) without acid', LIB]
  },
  {
    id: 'exp-iron3-thiocyanate-test', group: 'precipitation', grade: 'Hóa học 12', difficulty: 'Cơ bản', safetyLevel: 'Trung bình', keywords: ['KSCN', 'thioxianat', 'Fe3+', 'nhận biết', 'phức chất', 'đỏ máu'],
    title: 'Nhận biết Fe³⁺ bằng KSCN, phân biệt với Fe²⁺',
    objective: 'Dùng KSCN nhận biết ion Fe³⁺ (màu đỏ máu của phức FeSCN²⁺); Fe²⁺ không cho màu này.',
    equipment: ['2 ống nghiệm', 'Chai KSCN'], chemicals: ['FeCl₃ 0,2 M', 'FeSO₄ 0,2 M', 'KSCN 0,1 M'],
    conditions: '25 °C, dung dịch muối sắt có tính axit tự nhiên (thủy phân).',
    setup: { vessels: [{ type: 'testTube', fill: [['fecl3', 2]] }, { type: 'testTube', fill: [['feso4', 2]] }], bottles: ['kscn'] },
    steps: [
      { text: 'Rót 1 mL KSCN vào ống A (FeCl₃).', act: { pour: 'kscn', to: 0, mL: 1 } },
      { text: 'Rót 1 mL KSCN vào ống B (FeSO₄).', act: { pour: 'kscn', to: 1, mL: 1 } }
    ],
    phenomena: 'Ống A chuyển đỏ máu ngay. Ống B gần như không đổi màu (thực tế FeSO₄ để lâu có lẫn ít Fe³⁺ nên có thể hơi hồng).',
    equation: 'Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺',
    explanation: 'Fe³⁺ tạo phức FeSCN²⁺ màu đỏ máu với SCN⁻ (hằng số bền K ≈ 10³); phức hấp thụ mạnh ánh sáng xanh lam (ε ≈ 4700 L/(mol·cm) ở 450 nm) nên rất nhạy, phát hiện được Fe³⁺ ở nồng độ cỡ 10⁻⁵ M. Fe²⁺ không tạo phức màu này.',
    safety: 'FeCl₃ ăn mòn, làm ố da; KSCN độc khi nuốt: đeo găng, rửa tay sau thí nghiệm.',
    processRefs: ['thiocyanate-complex'], expect: [{ vessel: 0, key: 'scn' }],
    expectState: [{ vessel: 0, complex: ['FeSCN2+', 5e-5, 1e-4] }, { vessel: 1, noComplex: 'FeSCN2+' }],
    references: ['K1 FeSCN²⁺: Martell & Smith (NIST SRD 46)', 'ε: Frank & Oswalt, J. Am. Chem. Soc. 1947', 'SGK Hóa học 12 (GDPT 2018), phức chất'], tests: ['thiocyanate: FeSCN²⁺ matches the 1:1 quadratic and shifts as Le Chatelier predicts', LIB]
  },
  {
    id: 'exp-thiocyanate-equilibrium', group: 'rate-energy', grade: 'Hóa học 11', difficulty: 'Nâng cao', safetyLevel: 'Trung bình', keywords: ['cân bằng hóa học', 'Le Chatelier', 'chuyển dịch cân bằng', 'FeSCN', 'nồng độ', 'pha loãng'],
    title: 'Chuyển dịch cân bằng Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺ (nguyên lí Le Chatelier)',
    objective: 'Thêm Fe³⁺, thêm SCN⁻ hoặc pha loãng một dung dịch cân bằng, quan sát màu đỏ đậm lên hay nhạt đi, giải thích bằng nguyên lí Le Chatelier.',
    equipment: ['3 cốc 100 mL', '1 cốc 250 mL', 'Chai FeCl₃', 'Chai KSCN', 'Chai nước cất'], chemicals: ['Dung dịch cân bằng (FeCl₃ + KSCN rất loãng, axit hóa bằng HNO₃ loãng)', 'FeCl₃ 0,2 M', 'KSCN 0,1 M', 'Nước cất'],
    conditions: '25 °C. Axit hóa bằng HNO₃ để Fe³⁺ không thủy phân thành Fe(OH)₃; không dùng HCl vì lượng lớn Cl⁻ tạo phức FeCl²⁺ cạnh tranh (chút Cl⁻ từ FeCl₃ được bỏ qua). Hằng số K ở lực ion 0 (mô phỏng đậm màu hơn thực tế một chút).',
    setup: { vessels: [
      { type: 'beaker100', fill: [['water', 40], ['hno3', 2], ['fecl3', 0.1], ['kscn', 0.2]] },
      { type: 'beaker100', fill: [['water', 40], ['hno3', 2], ['fecl3', 0.1], ['kscn', 0.2]] },
      { type: 'beaker100', fill: [['water', 40], ['hno3', 2], ['fecl3', 0.1], ['kscn', 0.2]] },
      { type: 'beaker250', fill: [['water', 40], ['hno3', 2], ['fecl3', 0.1], ['kscn', 0.2]] }
    ], bottles: ['fecl3', 'kscn', 'water'] },
    steps: [
      { text: 'Cốc A giữ nguyên làm mẫu so sánh. Rót 0,5 mL FeCl₃ vào cốc B.', act: { pour: 'fecl3', to: 1, mL: 0.5 } },
      { text: 'Rót 0,5 mL KSCN vào cốc C.', act: { pour: 'kscn', to: 2, mL: 0.5 } },
      { text: 'Rót 40 mL nước cất vào cốc D (pha loãng gần 2 lần).', act: { pour: 'water', to: 3, mL: 40 } }
    ],
    phenomena: 'So với cốc A (cam đỏ nhạt): cốc B và cốc C đỏ đậm hơn rõ; cốc D nhạt đi nhiều hơn mức chỉ do pha loãng (số mol FeSCN²⁺ giảm khoảng 45 %).',
    equation: 'Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺',
    explanation: 'Tăng nồng độ một chất tham gia (Fe³⁺ hoặc SCN⁻), cân bằng chuyển dịch theo chiều làm giảm chất đó, tức chiều thuận: thêm FeSCN²⁺ nên màu đậm hơn. Pha loãng làm giảm nồng độ mọi chất; cân bằng chuyển dịch theo chiều làm tăng tổng số tiểu phân (2 tiểu phân ⇌ 1 tiểu phân), tức chiều nghịch: một phần phức phân li. Hằng số cân bằng không đổi trong cả ba trường hợp (cùng nhiệt độ).',
    safety: 'HNO₃ và FeCl₃ ăn mòn; KSCN độc khi nuốt: đeo kính và găng tay.',
    processRefs: ['thiocyanate-complex'], expect: [{ vessel: 0, key: 'scn' }, { vessel: 1, key: 'scn' }, { vessel: 2, key: 'scn' }],
    expectState: [{ vessel: 0, complex: ['FeSCN2+', 4e-6, 5.4e-6] }, { vessel: 1, complex: ['FeSCN2+', 1.15e-5, 1.55e-5] }, { vessel: 2, complex: ['FeSCN2+', 9e-6, 1.25e-5] }, { vessel: 3, complex: ['FeSCN2+', 2.1e-6, 3e-6] }],
    references: ['K1 FeSCN²⁺: Martell & Smith (NIST SRD 46); Laurence, Trans. Faraday Soc. 1956', 'Harvard Natural Sciences Lecture Demonstrations: FeSCN²⁺ equilibrium', 'SGK Hóa học 11 (GDPT 2018), bài 1 Cân bằng hóa học'], tests: ['thiocyanate: FeSCN²⁺ matches the 1:1 quadratic and shifts as Le Chatelier predicts', LIB]
  },
  {
    id: 'exp-starch-iodine', group: 'organic', grade: 'Hóa học 12', difficulty: 'Cơ bản', safetyLevel: 'Thấp', keywords: ['tinh bột', 'iot', 'hồ tinh bột', 'nhận biết', 'carbohydrate', 'xanh tím'],
    title: 'Nhận biết tinh bột bằng dung dịch iot',
    objective: 'Quan sát hồ tinh bột chuyển xanh tím với iot; so sánh với nước (không có tinh bột) và với KI (không có I₂).',
    equipment: ['3 cốc thủy tinh 100 mL', 'Chai dung dịch iot', 'Chai KI'], chemicals: ['Hồ tinh bột 1 %', 'Dung dịch iot (I₂ 0,01 M trong KI)', 'KI 0,1 M', 'Nước cất'],
    conditions: '25 °C, môi trường trung tính. Màu mất khi đun nóng trên khoảng 65 °C (có mô phỏng). Trong môi trường kiềm màu cũng mất do I₂ bị kiềm phân hủy: phần này chưa mô phỏng, sẽ có thông báo.',
    setup: { vessels: [{ type: 'beaker100', fill: [['water', 20], ['starch', 0.15]] }, { type: 'beaker100', fill: [['water', 20]] }, { type: 'beaker100', fill: [['water', 20], ['starch', 0.15]] }], bottles: ['iodine', 'ki'] },
    steps: [
      { text: 'Rót 1 mL dung dịch iot vào cốc A (hồ tinh bột).', act: { pour: 'iodine', to: 0, mL: 1 } },
      { text: 'Rót 1 mL dung dịch iot vào cốc B (nước).', act: { pour: 'iodine', to: 1, mL: 1 } },
      { text: 'Rót 2 mL KI vào cốc C (hồ tinh bột).', act: { pour: 'ki', to: 2, mL: 2 } }
    ],
    phenomena: 'Cốc A chuyển xanh tím đậm. Cốc B chỉ có màu vàng nhạt của iot. Cốc C không đổi màu: ion I⁻ không tạo màu với tinh bột.',
    equation: '—',
    explanation: 'Mạch amylozơ của tinh bột cuộn thành vòng xoắn; các chuỗi polyiotua (I₃⁻, I₅⁻, tạo từ I₂ và I⁻) chui vào lòng xoắn tạo phức màu xanh tím. Cần cả I₂ và I⁻; chỉ có I⁻ (cốc C) thì không có màu. Phản ứng rất nhạy (khoảng 2·10⁻⁵ M I₂) nên dùng để nhận biết tinh bột và cả I₂.',
    safety: 'Dung dịch iot gây vết bẩn và kích ứng: đeo găng.',
    processRefs: ['starch-iodine'], expect: [{ vessel: 0, key: 'starch' }],
    expectState: [{ vessel: 0, starch: true }, { vessel: 1, starch: false, left: 'I2' }, { vessel: 2, starch: false }],
    references: ['Kolthoff & Sandell: độ nhạy của phản ứng tinh bột – iot', 'SGK Hóa học 12 (GDPT 2018), Tinh bột và cellulose'], tests: ['starch: blue-black needs I₂ and I⁻, fades when hot', LIB]
  },
  {
    id: 'exp-iodide-oxidation-starch', group: 'redox', grade: 'Hóa học 10', difficulty: 'Trung bình', safetyLevel: 'Trung bình', keywords: ['tính oxi hóa', 'Fe3+', 'Fe2+', 'KI', 'hồ tinh bột', 'iot'],
    title: 'Fe³⁺ oxi hóa được I⁻, Fe²⁺ thì không (thử bằng hồ tinh bột)',
    objective: 'Dùng hồ tinh bột phát hiện I₂ sinh ra: chứng minh Fe³⁺ có tính oxi hóa đủ mạnh để oxi hóa I⁻, còn Fe²⁺ thì không.',
    equipment: ['2 cốc thủy tinh 100 mL', 'Chai hồ tinh bột', 'Chai FeCl₃', 'Chai FeSO₄'], chemicals: ['KI 0,1 M (axit hóa bằng ít H₂SO₄ loãng)', 'Hồ tinh bột 1 %', 'FeCl₃ 0,2 M', 'FeSO₄ 0,2 M'],
    conditions: '25 °C, dư I⁻; môi trường axit (vài mL H₂SO₄ loãng giữ Fe³⁺ không thủy phân thành Fe(OH)₃).',
    setup: { vessels: [{ type: 'beaker100', fill: [['ki', 10], ['h2so4', 2]] }, { type: 'beaker100', fill: [['ki', 10], ['h2so4', 2]] }], bottles: ['starch', 'fecl3', 'feso4'] },
    steps: [
      { text: 'Nhỏ 3 giọt hồ tinh bột vào cốc A.', act: { drops: 'starch', to: 0 } },
      { text: 'Nhỏ 3 giọt hồ tinh bột vào cốc B.', act: { drops: 'starch', to: 1 } },
      { text: 'Rót 1 mL FeCl₃ vào cốc A.', act: { pour: 'fecl3', to: 0, mL: 1 } },
      { text: 'Rót 1 mL FeSO₄ vào cốc B.', act: { pour: 'feso4', to: 1, mL: 1 } }
    ],
    phenomena: 'Cốc A chuyển xanh tím ngay (có I₂). Cốc B không đổi màu.',
    equation: '2Fe³⁺ + 2I⁻ → 2Fe²⁺ + I₂',
    explanation: 'E°(Fe³⁺/Fe²⁺) = +0,77 V lớn hơn E°(I₂/I⁻) = +0,54 V nên Fe³⁺ oxi hóa được I⁻ thành I₂; I₂ cùng I⁻ dư làm hồ tinh bột xanh tím. Fe²⁺ là dạng khử của cặp Fe³⁺/Fe²⁺, không thể nhận thêm electron từ I⁻, nên không có I₂.',
    safety: 'FeCl₃ ăn mòn, làm ố da; I₂ gây vết bẩn: đeo găng và kính.',
    processRefs: ['redox-fe-i', 'starch-iodine'], expect: [{ vessel: 0, key: 'redox-fe-i' }, { vessel: 0, key: 'starch' }],
    expectState: [{ vessel: 0, starch: true, left: 'Fe2+', gone: 'Fe3+' }, { vessel: 1, starch: false }],
    references: ['E°: CRC Handbook', 'SGK Hóa học 10 (GDPT 2018), phản ứng oxi hóa – khử'], tests: ['starch: blue-black needs I₂ and I⁻, fades when hot', LIB]
  }
]
