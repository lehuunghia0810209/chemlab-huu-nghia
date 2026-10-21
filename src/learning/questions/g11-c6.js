// Hóa học 11 · Chương 6 — Hợp chất carbonyl – Carboxylic acid. Questions for Bài 23–25.
import { molarMass, GAS_VOLUME_STANDARD as VM } from '../chemMath.js'

export const questions = [
  /* ----- Bài 23. Hợp chất carbonyl ----- */
  {
    id: 'g11-l23-q1', lessonId: 'g11-l23', type: 'single', difficulty: 'recognize',
    objective: 'Phân biệt aldehyde và ketone theo cấu tạo.',
    content: 'Chất nào sau đây là ketone?',
    options: [
      { id: 'a', text: 'CH₃CHO', feedback: 'CH₃CHO có nhóm −CHO, là aldehyde.' },
      { id: 'b', text: 'CH₃COCH₃' },
      { id: 'c', text: 'CH₃COOH', feedback: 'CH₃COOH là carboxylic acid.' },
      { id: 'd', text: 'HCHO' }
    ],
    correctAnswer: 'b',
    explanation: 'Trong ketone, nhóm C=O liên kết với hai gốc hydrocarbon.'
  },
  {
    id: 'g11-l23-q2', lessonId: 'g11-l23', type: 'short', difficulty: 'understand',
    objective: 'Gọi tên thay thế của aldehyde.',
    content: 'Gọi tên theo danh pháp thay thế của CH₃CH₂CHO.',
    correctAnswer: { accepted: ['propanal'], compact: true },
    explanation: 'Mạch 3 C kể cả C của nhóm −CHO: propan + al.'
  },
  {
    id: 'g11-l23-q3', lessonId: 'g11-l23', type: 'truefalse', difficulty: 'understand',
    objective: 'Trình bày tính chất của hợp chất carbonyl.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Acetaldehyde làm mất màu nước bromine.', explanation: 'Br₂ oxi hóa −CHO thành −COOH.' },
      { id: 'b', text: 'Acetone tham gia phản ứng tráng bạc.', explanation: 'Ketone khó bị oxi hóa, không tráng bạc.' },
      { id: 'c', text: 'Acetone tạo kết tủa vàng với I₂ trong NaOH.', explanation: 'Acetone có nhóm CH₃CO− nên tạo iodoform.' },
      { id: 'd', text: 'Giữa các phân tử aldehyde có liên kết hydrogen.', explanation: 'Aldehyde không có H gắn với O.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Aldehyde dễ bị oxi hóa; ketone thì không. Nhóm CH₃CO− cho phản ứng iodoform.',
    equations: ['CH₃CHO + Br₂ + H₂O → CH₃COOH + 2HBr', 'CH₃COCH₃ + 3I₂ + 4NaOH → CHI₃ + CH₃COONa + 3NaI + 3H₂O']
  },
  {
    id: 'g11-l23-q4', lessonId: 'g11-l23', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định chất phản ứng được với acetaldehyde.',
    content: 'Chọn tất cả chất phản ứng được với acetaldehyde (trong điều kiện thích hợp).',
    options: [
      { id: 'a', text: 'H₂ (Ni, t°)' },
      { id: 'b', text: 'AgNO₃ trong NH₃, t°' },
      { id: 'c', text: 'Cu(OH)₂ trong NaOH, t°' },
      { id: 'd', text: 'NaHCO₃', feedback: 'Aldehyde không có tính acid.' },
      { id: 'e', text: 'HCN' }
    ],
    correctAnswer: ['a', 'b', 'c', 'e'],
    explanation: 'Aldehyde bị khử, bị oxi hóa và cộng HCN vào liên kết C=O.',
    equations: ['CH₃CHO + 2Cu(OH)₂ + NaOH → CH₃COONa + Cu₂O + 3H₂O']
  },
  {
    id: 'g11-l23-q5', lessonId: 'g11-l23', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng Ag trong phản ứng tráng bạc.',
    content: 'Cho 2,9 g propanal tác dụng với AgNO₃ dư trong NH₃, đun nóng. Tính khối lượng Ag thu được (C = 12, H = 1, O = 16, Ag = 108).',
    correctAnswer: { value: 10.8, unit: 'g', tolerance: 0.02 },
    verify: () => 2.9 / molarMass('C3H6O') * 2 * molarMass('Ag'),
    solution: ['n(C₂H₅CHO) = 2,9 / 58 = 0,05 mol ⇒ n(Ag) = 0,1 mol.', 'm(Ag) = 0,1 × 108 = 10,8 g.'],
    explanation: 'Aldehyde đơn chức (khác HCHO) cho 2 mol Ag.'
  },
  {
    id: 'g11-l23-q6', lessonId: 'g11-l23', type: 'numeric', difficulty: 'advanced',
    objective: 'Vận dụng trường hợp đặc biệt của HCHO khi tráng bạc.',
    content: 'Cho 3 g formaldehyde tác dụng với AgNO₃ dư trong NH₃, đun nóng. Tính khối lượng Ag tối đa thu được.',
    correctAnswer: { value: 43.2, unit: 'g', tolerance: 0.02 },
    verify: () => 3 / molarMass('CH2O') * 4 * molarMass('Ag'),
    solution: ['n(HCHO) = 3 / 30 = 0,1 mol; HCHO tạo 4 Ag ⇒ n(Ag) = 0,4 mol.', 'm(Ag) = 0,4 × 108 = 43,2 g.'],
    explanation: 'HCHO tương đương hai nhóm −CHO nên cho 4 mol Ag.'
  },
  {
    id: 'g11-l23-q7', lessonId: 'g11-l23', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng kết tủa Cu₂O.',
    content: 'Đun 2,2 g acetaldehyde với Cu(OH)₂ dư trong NaOH. Tính khối lượng kết tủa đỏ gạch Cu₂O (Cu = 64).',
    correctAnswer: { value: 7.2, unit: 'g', tolerance: 0.02 },
    verify: () => 2.2 / molarMass('C2H4O') * molarMass('Cu2O'),
    solution: ['n(CH₃CHO) = 2,2 / 44 = 0,05 mol ⇒ n(Cu₂O) = 0,05 mol.', 'm = 0,05 × 144 = 7,2 g.'],
    explanation: 'Mỗi mol aldehyde tạo 1 mol Cu₂O.',
    equations: ['CH₃CHO + 2Cu(OH)₂ + NaOH → CH₃COONa + Cu₂O + 3H₂O']
  },

  /* ----- Bài 24. Carboxylic acid ----- */
  {
    id: 'g11-l24-q1', lessonId: 'g11-l24', type: 'single', difficulty: 'recognize',
    objective: 'Gọi tên thông thường của carboxylic acid.',
    content: 'Tên thông thường của HCOOH là',
    options: [
      { id: 'a', text: 'acetic acid' },
      { id: 'b', text: 'formic acid' },
      { id: 'c', text: 'propionic acid' },
      { id: 'd', text: 'benzoic acid' }
    ],
    correctAnswer: 'b',
    explanation: 'HCOOH: methanoic acid (formic acid).'
  },
  {
    id: 'g11-l24-q2', lessonId: 'g11-l24', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định chất phản ứng được với acetic acid.',
    content: 'Chọn tất cả chất phản ứng được với dung dịch acetic acid.',
    options: [
      { id: 'a', text: 'Mg' },
      { id: 'b', text: 'CaCO₃' },
      { id: 'c', text: 'Cu', feedback: 'Cu đứng sau H, không đẩy được H₂ khỏi acid.' },
      { id: 'd', text: 'NaOH' },
      { id: 'e', text: 'NaCl', feedback: 'Không tạo chất kết tủa, khí hay chất điện li yếu.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Acetic acid có đầy đủ tính chất của acid yếu.',
    equations: ['2CH₃COOH + CaCO₃ → (CH₃COO)₂Ca + CO₂ + H₂O']
  },
  {
    id: 'g11-l24-q3', lessonId: 'g11-l24', type: 'truefalse', difficulty: 'understand',
    objective: 'Giải thích tính chất vật lí và phản ứng ester hóa.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Acetic acid có nhiệt độ sôi cao hơn propan-1-ol dù cùng phân tử khối.', explanation: 'Liên kết hydrogen của acid bền hơn.' },
      { id: 'b', text: 'Phản ứng ester hóa xảy ra hoàn toàn.', explanation: 'Ester hóa là phản ứng thuận nghịch.' },
      { id: 'c', text: 'H₂SO₄ đặc vừa là xúc tác vừa hút nước trong phản ứng ester hóa.', explanation: 'Hút nước làm cân bằng chuyển dịch theo chiều tạo ester.' },
      { id: 'd', text: 'Dung dịch acetic acid làm quỳ tím hóa xanh.', explanation: 'Acid làm quỳ tím hóa đỏ.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Carboxylic acid là acid yếu, tạo liên kết hydrogen bền; ester hóa là cân bằng.',
    equations: ['CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O']
  },
  {
    id: 'g11-l24-q4', lessonId: 'g11-l24', type: 'short', difficulty: 'apply',
    objective: 'Gọi tên ester tạo thành từ phản ứng ester hóa.',
    content: 'Đun acetic acid với ethanol (H₂SO₄ đặc) thu được ester có tên là gì?',
    correctAnswer: { accepted: ['ethyl acetate', 'ethyl ethanoate', 'etyl axetat'], compact: true },
    explanation: 'CH₃COOC₂H₅: gốc ethyl + acetate (ethanoate).'
  },
  {
    id: 'g11-l24-q5', lessonId: 'g11-l24', type: 'numeric', difficulty: 'apply',
    objective: 'Tính thể tích dung dịch kiềm trung hòa carboxylic acid.',
    content: 'Tính thể tích dung dịch NaOH 0,5 M cần để trung hòa 6 g acetic acid.',
    correctAnswer: { value: 200, unit: 'mL', tolerance: 0.01 },
    verify: () => 6 / molarMass('C2H4O2') / 0.5 * 1000,
    solution: ['n(CH₃COOH) = 6 / 60 = 0,1 mol = n(NaOH).', 'V = 0,1 / 0,5 = 0,2 L = 200 mL.'],
    explanation: 'Acid đơn chức trung hòa NaOH theo tỉ lệ 1 : 1.',
    equations: ['CH₃COOH + NaOH → CH₃COONa + H₂O']
  },
  {
    id: 'g11-l24-q6', lessonId: 'g11-l24', type: 'numeric', difficulty: 'apply',
    objective: 'Tính thể tích CO₂ khi acid tác dụng với NaHCO₃.',
    content: 'Cho 12 g acetic acid tác dụng với NaHCO₃ dư. Tính thể tích CO₂ ở điều kiện chuẩn (24,79 L/mol).',
    correctAnswer: { value: 4.958, unit: 'L', tolerance: 0.02 },
    verify: () => 12 / molarMass('C2H4O2') * VM,
    solution: ['n(CH₃COOH) = 12 / 60 = 0,2 mol ⇒ n(CO₂) = 0,2 mol.', 'V = 0,2 × 24,79 ≈ 4,96 L.'],
    explanation: 'CH₃COOH + NaHCO₃ theo tỉ lệ 1 : 1 tạo 1 CO₂.',
    equations: ['CH₃COOH + NaHCO₃ → CH₃COONa + CO₂ + H₂O']
  },
  {
    id: 'g11-l24-q7', lessonId: 'g11-l24', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính khối lượng ester khi một chất dư và có hiệu suất.',
    content: 'Đun 12 g acetic acid với 13,8 g ethanol (H₂SO₄ đặc), hiệu suất ester hóa 50%. Tính khối lượng ethyl acetate thu được.',
    correctAnswer: { value: 8.8, unit: 'g', tolerance: 0.02 },
    verify: () => Math.min(12 / molarMass('C2H4O2'), 13.8 / molarMass('C2H6O')) * 0.5 * molarMass('C4H8O2'),
    solution: ['n(acid) = 0,2 mol; n(ethanol) = 13,8 / 46 = 0,3 mol ⇒ hiệu suất tính theo acid.', 'n(ester) = 0,2 × 50% = 0,1 mol ⇒ m = 0,1 × 88 = 8,8 g.'],
    explanation: 'Hiệu suất tính theo chất thiếu (theo tỉ lệ phản ứng).'
  },

  /* ----- Bài 25. Ôn tập chương 6 ----- */
  {
    id: 'g11-l25-q1', lessonId: 'g11-l25', type: 'single', difficulty: 'understand',
    objective: 'So sánh nhiệt độ sôi của các loại hợp chất.',
    content: 'Chất có nhiệt độ sôi thấp nhất là',
    options: [
      { id: 'a', text: 'CH₃CHO' },
      { id: 'b', text: 'C₂H₅OH' },
      { id: 'c', text: 'CH₃COOH' },
      { id: 'd', text: 'C₃H₇OH' }
    ],
    correctAnswer: 'a',
    explanation: 'Acetaldehyde không có liên kết hydrogen liên phân tử.'
  },
  {
    id: 'g11-l25-q2', lessonId: 'g11-l25', type: 'multiple', difficulty: 'apply',
    objective: 'Chọn thuốc thử nhận biết trong chương 6.',
    content: 'Chọn tất cả cặp “thuốc thử – chất nhận biết được” đúng.',
    options: [
      { id: 'a', text: 'AgNO₃/NH₃, t° – acetaldehyde' },
      { id: 'b', text: 'NaHCO₃ – acetic acid' },
      { id: 'c', text: 'I₂/NaOH – acetone' },
      { id: 'd', text: 'AgNO₃/NH₃, t° – acetone', feedback: 'Ketone không tráng bạc.' },
      { id: 'e', text: 'Quỳ tím – acetaldehyde', feedback: 'Aldehyde không làm đổi màu quỳ tím.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Aldehyde tráng bạc, acid tạo CO₂ với NaHCO₃, nhóm CH₃CO− tạo iodoform.'
  },
  {
    id: 'g11-l25-q3', lessonId: 'g11-l25', type: 'truefalse', difficulty: 'understand',
    objective: 'Hệ thống chuyển hóa alcohol – aldehyde – acid.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Oxi hóa ethanol bằng CuO, t° thu được acetaldehyde.', explanation: 'Alcohol bậc I → aldehyde.' },
      { id: 'b', text: 'Khử acetone bằng NaBH₄ thu được propan-1-ol.', explanation: 'Ketone bị khử thành alcohol bậc II (propan-2-ol).' },
      { id: 'c', text: 'Formic acid tham gia phản ứng tráng bạc.', explanation: 'HCOOH có nhóm −CHO.' },
      { id: 'd', text: 'Oxi hóa acetaldehyde thu được acetic acid.', explanation: '−CHO → −COOH.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: true },
    explanation: 'Alcohol bậc I → aldehyde → carboxylic acid theo mức oxi hóa tăng dần.',
    equations: ['C₂H₅OH + CuO → CH₃CHO + Cu + H₂O']
  },
  {
    id: 'g11-l25-q4', lessonId: 'g11-l25', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng Ag từ formic acid.',
    content: 'Cho 4,6 g formic acid tác dụng với AgNO₃ dư trong NH₃, đun nóng. Tính khối lượng Ag thu được.',
    correctAnswer: { value: 21.6, unit: 'g', tolerance: 0.02 },
    verify: () => 4.6 / molarMass('CH2O2') * 2 * molarMass('Ag'),
    solution: ['n(HCOOH) = 4,6 / 46 = 0,1 mol; HCOOH có một nhóm −CHO ⇒ n(Ag) = 0,2 mol.', 'm(Ag) = 0,2 × 108 = 21,6 g.'],
    explanation: 'Formic acid tráng bạc như một aldehyde đơn chức.'
  },
  {
    id: 'g11-l25-q5', lessonId: 'g11-l25', type: 'numeric', difficulty: 'advanced',
    objective: 'Giải bài toán hỗn hợp aldehyde và carboxylic acid.',
    content: 'Hỗn hợp X gồm acetaldehyde và acetic acid. X tác dụng với NaHCO₃ dư tạo 4,958 L CO₂ (điều kiện chuẩn); cũng lượng X đó tráng bạc hoàn toàn tạo 21,6 g Ag. Tính khối lượng X.',
    correctAnswer: { value: 16.4, unit: 'g', tolerance: 0.02 },
    verify: () => (4.958 / VM) * molarMass('C2H4O2') + (21.6 / molarMass('Ag') / 2) * molarMass('C2H4O'),
    solution: ['n(CH₃COOH) = 4,958 / 24,79 = 0,2 mol; n(CH₃CHO) = (21,6 / 108) / 2 = 0,1 mol.', 'm(X) = 0,2 × 60 + 0,1 × 44 = 12 + 4,4 = 16,4 g.'],
    explanation: 'Acetic acid không tráng bạc; acetaldehyde không phản ứng với NaHCO₃.'
  },
  {
    id: 'g11-l25-q6', lessonId: 'g11-l25', type: 'short', difficulty: 'apply',
    objective: 'Xác định sản phẩm khử ketone.',
    content: 'Khử butanone (CH₃COCH₂CH₃) bằng NaBH₄ thu được alcohol nào? (tên thay thế)',
    correctAnswer: { accepted: ['butan-2-ol', 'butan 2 ol', '2-butanol'], compact: true },
    explanation: 'Ketone → alcohol bậc II, nhóm OH ở vị trí C=O cũ (C2).'
  },
  {
    id: 'g11-l25-q7', lessonId: 'g11-l25', type: 'single', difficulty: 'advanced',
    objective: 'Xác định chất từ dữ kiện phản ứng.',
    content: 'Chất X (C₃H₆O) không tráng bạc, không phản ứng với Na nhưng tạo kết tủa vàng với I₂ trong NaOH. X là',
    options: [
      { id: 'a', text: 'propanal' },
      { id: 'b', text: 'acetone' },
      { id: 'c', text: 'prop-2-en-1-ol' },
      { id: 'd', text: 'propanoic acid' }
    ],
    correctAnswer: 'b',
    explanation: 'Không tráng bạc ⇒ không phải aldehyde; không có OH; có nhóm CH₃CO− ⇒ acetone CH₃COCH₃.'
  }
]
