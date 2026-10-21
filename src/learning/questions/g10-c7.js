// Hóa học 10 · Chương 7 — Nguyên tố nhóm halogen. Questions for Bài 21–23.
import { molarMass, GAS_VOLUME_STANDARD } from '../chemMath.js'

export const questions = [
  /* ----- Bài 21. Nhóm halogen ----- */
  {
    id: 'g10-l21-q1',
    lessonId: 'g10-l21',
    type: 'single',
    difficulty: 'recognize',
    objective: 'Nêu cấu hình electron lớp ngoài cùng của halogen.',
    content: 'Cấu hình electron lớp ngoài cùng của nguyên tử các nguyên tố halogen là',
    options: [
      { id: 'a', text: 'ns²np⁴', feedback: 'Đó là nhóm VIA (oxygen, sulfur).' },
      { id: 'b', text: 'ns²np⁵' },
      { id: 'c', text: 'ns²np⁶', feedback: 'Đó là khí hiếm.' },
      { id: 'd', text: 'ns¹' }
    ],
    correctAnswer: 'b',
    explanation: 'Halogen thuộc nhóm VIIA: 7 electron lớp ngoài cùng, dễ nhận thêm 1 electron.'
  },
  {
    id: 'g10-l21-q2',
    lessonId: 'g10-l21',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'Vận dụng thứ tự tính oxi hóa của halogen.',
    content: 'Chọn tất cả phản ứng xảy ra được.',
    options: [
      { id: 'a', text: 'Cl₂ + 2NaBr → 2NaCl + Br₂' },
      { id: 'b', text: 'Br₂ + 2NaI → 2NaBr + I₂' },
      { id: 'c', text: 'I₂ + 2NaBr → 2NaI + Br₂', feedback: 'I₂ có tính oxi hóa yếu hơn Br₂.' },
      { id: 'd', text: 'Cl₂ + 2KI → 2KCl + I₂' },
      { id: 'e', text: 'Br₂ + 2NaCl → 2NaBr + Cl₂', feedback: 'Br₂ có tính oxi hóa yếu hơn Cl₂.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Halogen có tính oxi hóa mạnh hơn đẩy halogen yếu hơn khỏi dung dịch muối: Cl₂ > Br₂ > I₂.',
    equations: ['Cl₂ + 2NaBr → 2NaCl + Br₂', 'Br₂ + 2NaI → 2NaBr + I₂', 'Cl₂ + 2KI → 2KCl + I₂']
  },
  {
    id: 'g10-l21-q3',
    lessonId: 'g10-l21',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Mô tả tính chất vật lí và hóa học của halogen.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Trong hợp chất, fluorine chỉ có số oxi hóa −1.', explanation: 'F có độ âm điện lớn nhất.' },
      { id: 'b', text: 'Iodine dễ thăng hoa khi đun nóng nhẹ.', explanation: 'Tinh thể I₂ chuyển thành hơi màu tím.' },
      { id: 'c', text: 'Ở điều kiện thường, bromine là chất khí.', explanation: 'Bromine là chất lỏng màu nâu đỏ.' },
      { id: 'd', text: 'Cl₂ tác dụng với dung dịch NaOH đun nóng (khoảng 70 °C) tạo muối NaClO₃.', explanation: '3Cl₂ + 6NaOH → 5NaCl + NaClO₃ + 3H₂O.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'Trạng thái chuyển từ khí (F₂, Cl₂) sang lỏng (Br₂) và rắn (I₂).',
    equations: ['3Cl₂ + 6NaOH → 5NaCl + NaClO₃ + 3H₂O']
  },
  {
    id: 'g10-l21-q4',
    lessonId: 'g10-l21',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính lượng chlorine điều chế trong phòng thí nghiệm.',
    content: 'Cho 17,4 g MnO₂ tác dụng hết với dung dịch HCl đặc, đun nóng. Tính thể tích khí Cl₂ ở điều kiện chuẩn (24,79 L/mol) (Mn = 55, O = 16).',
    correctAnswer: { value: 4.958, unit: 'L', tolerance: 0.01 },
    verify: () => 17.4 / molarMass('MnO2') * GAS_VOLUME_STANDARD,
    solution: [
      'MnO₂ + 4HCl → MnCl₂ + Cl₂ + 2H₂O.',
      'n(MnO₂) = 17,4 / 87 = 0,2 mol ⇒ n(Cl₂) = 0,2 mol.',
      'V = 0,2 × 24,79 = 4,958 L.'
    ],
    explanation: 'Tỉ lệ mol MnO₂ : Cl₂ = 1 : 1.',
    equations: ['MnO₂ + 4HCl → MnCl₂ + Cl₂ + 2H₂O']
  },
  {
    id: 'g10-l21-q5',
    lessonId: 'g10-l21',
    type: 'short',
    difficulty: 'apply',
    objective: 'Xác định sản phẩm phản ứng của kim loại với chlorine.',
    content: 'Đốt sắt trong khí chlorine dư. Viết công thức sản phẩm.',
    correctAnswer: { accepted: ['FeCl3', 'FeCl₃'], caseSensitive: true, compact: true },
    explanation: 'Chlorine có tính oxi hóa mạnh, đưa Fe lên +3: 2Fe + 3Cl₂ → 2FeCl₃.',
    equations: ['2Fe + 3Cl₂ → 2FeCl₃']
  },
  {
    id: 'g10-l21-q6',
    lessonId: 'g10-l21',
    type: 'numeric',
    difficulty: 'advanced',
    objective: 'Tính lượng chlorine từ phản ứng của KMnO₄ với HCl đặc.',
    content: 'Cho 3,16 g KMnO₄ tác dụng hết với dung dịch HCl đặc. Tính thể tích khí Cl₂ thu được ở điều kiện chuẩn (24,79 L/mol) (K = 39, Mn = 55, O = 16).',
    correctAnswer: { value: 1.24, unit: 'L', tolerance: 0.01 },
    verify: () => 3.16 / molarMass('KMnO4') * 5 / 2 * GAS_VOLUME_STANDARD,
    solution: [
      '2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 5Cl₂ + 8H₂O.',
      'n(KMnO₄) = 3,16 / 158 = 0,02 mol ⇒ n(Cl₂) = 0,02 × 5/2 = 0,05 mol.',
      'V = 0,05 × 24,79 ≈ 1,24 L.'
    ],
    explanation: 'Có thể dùng bảo toàn electron: Mn⁺⁷ nhận 5e, mỗi Cl₂ cần 2e ⇒ n(Cl₂) = 0,02 × 5 / 2.',
    equations: ['2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 5Cl₂ + 8H₂O']
  },
  {
    id: 'g10-l21-q7',
    lessonId: 'g10-l21',
    type: 'single',
    difficulty: 'understand',
    objective: 'So sánh khả năng phản ứng với hydrogen của các halogen.',
    content: 'Halogen nào phản ứng nổ với hydrogen ngay cả trong bóng tối và ở nhiệt độ rất thấp?',
    options: [
      { id: 'a', text: 'F₂' },
      { id: 'b', text: 'Cl₂', feedback: 'Cl₂ cần chiếu sáng hoặc đốt nóng.' },
      { id: 'c', text: 'Br₂', feedback: 'Br₂ cần đun nóng.' },
      { id: 'd', text: 'I₂', feedback: 'Phản ứng của I₂ xảy ra khi đun nóng và là phản ứng thuận nghịch.' }
    ],
    correctAnswer: 'a',
    explanation: 'Tính oxi hóa giảm từ F₂ đến I₂ nên phản ứng với H₂ khó dần.',
    equations: ['H₂ + F₂ → 2HF']
  },

  /* ----- Bài 22. Hydrogen halide. Muối halide ----- */
  {
    id: 'g10-l22-q1',
    lessonId: 'g10-l22',
    type: 'single',
    difficulty: 'recognize',
    objective: 'So sánh tính acid của các hydrohalic acid.',
    content: 'Trong dung dịch nước, acid nào mạnh nhất?',
    options: [
      { id: 'a', text: 'HF', feedback: 'HF là acid yếu vì liên kết H–F rất bền.' },
      { id: 'b', text: 'HCl' },
      { id: 'c', text: 'HBr' },
      { id: 'd', text: 'HI' }
    ],
    correctAnswer: 'd',
    explanation: 'Liên kết H–I kém bền nhất (298 kJ/mol) nên HI phân li mạnh nhất.'
  },
  {
    id: 'g10-l22-q2',
    lessonId: 'g10-l22',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính khối lượng kết tủa silver halide.',
    content: 'Cho 50 mL dung dịch NaCl 0,2 M tác dụng với dung dịch AgNO₃ dư. Tính khối lượng kết tủa (Ag = 108, Cl = 35,5).',
    correctAnswer: { value: 1.435, unit: 'g', tolerance: 0.01 },
    verify: () => 0.05 * 0.2 * molarMass('AgCl'),
    solution: [
      'n(NaCl) = 0,05 × 0,2 = 0,01 mol.',
      'AgNO₃ + NaCl → AgCl + NaNO₃ ⇒ n(AgCl) = 0,01 mol.',
      'm = 0,01 × 143,5 = 1,435 g.'
    ],
    explanation: 'Đổi thể tích sang lít trước khi nhân với nồng độ mol.',
    equations: ['AgNO₃ + NaCl → AgCl + NaNO₃']
  },
  {
    id: 'g10-l22-q3',
    lessonId: 'g10-l22',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Nêu tính chất của hydrogen halide và muối halide.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Trong dãy HF, HCl, HBr, HI, HF có nhiệt độ sôi cao nhất.', explanation: 'Do liên kết hydrogen giữa các phân tử HF.' },
      { id: 'b', text: 'AgF tan trong nước.', explanation: 'Không dùng AgNO₃ để nhận biết ion F⁻.' },
      { id: 'c', text: 'Ion Cl⁻ khử được H₂SO₄ đặc thành SO₂.', explanation: 'Cl⁻ có tính khử yếu, không khử được H₂SO₄ đặc; Br⁻ và I⁻ mới khử được.' },
      { id: 'd', text: 'Hydrofluoric acid ăn mòn thủy tinh.', explanation: 'SiO₂ + 4HF → SiF₄ + 2H₂O.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'HF có nhiều tính chất khác thường so với các HX còn lại.',
    equations: ['SiO₂ + 4HF → SiF₄ + 2H₂O']
  },
  {
    id: 'g10-l22-q4',
    lessonId: 'g10-l22',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'Vận dụng tính chất của hydrochloric acid.',
    content: 'Chọn tất cả chất tác dụng được với dung dịch HCl loãng.',
    options: [
      { id: 'a', text: 'Fe' },
      { id: 'b', text: 'Cu', feedback: 'Cu đứng sau H trong dãy hoạt động hóa học, không tác dụng với HCl loãng.' },
      { id: 'c', text: 'CuO' },
      { id: 'd', text: 'CaCO₃' },
      { id: 'e', text: 'Ag', feedback: 'Ag đứng sau H, không tác dụng với HCl loãng.' }
    ],
    correctAnswer: ['a', 'c', 'd'],
    explanation: 'HCl tác dụng với kim loại đứng trước H, oxide base, base và muối của acid yếu hơn.',
    equations: ['Fe + 2HCl → FeCl₂ + H₂', 'CuO + 2HCl → CuCl₂ + H₂O', 'CaCO₃ + 2HCl → CaCl₂ + CO₂ + H₂O']
  },
  {
    id: 'g10-l22-q5',
    lessonId: 'g10-l22',
    type: 'short',
    difficulty: 'recognize',
    objective: 'Nhận biết ion iodide bằng AgNO₃.',
    content: 'Nhỏ dung dịch AgNO₃ vào dung dịch KI. Kết tủa tạo thành có màu gì?',
    correctAnswer: { accepted: ['vàng', 'màu vàng', 'vàng đậm'] },
    explanation: 'Ag⁺ + I⁻ → AgI, kết tủa vàng (AgBr vàng nhạt, AgCl trắng).',
    equations: ['Ag⁺ + I⁻ → AgI']
  },
  {
    id: 'g10-l22-q6',
    lessonId: 'g10-l22',
    type: 'single',
    difficulty: 'apply',
    objective: 'So sánh tính khử của các ion halide.',
    content: 'Cho muối halide rắn tác dụng với H₂SO₄ đặc. Muối nào tạo ra khí H₂S?',
    options: [
      { id: 'a', text: 'NaF' },
      { id: 'b', text: 'NaCl', feedback: 'NaCl tạo khí HCl.' },
      { id: 'c', text: 'NaBr', feedback: 'NaBr tạo Br₂ và SO₂.' },
      { id: 'd', text: 'NaI' }
    ],
    correctAnswer: 'd',
    explanation: 'I⁻ có tính khử mạnh nhất, khử S⁺⁶ xuống −2: 8NaI + 9H₂SO₄ → 8NaHSO₄ + 4I₂ + H₂S + 4H₂O.',
    equations: ['8NaI + 9H₂SO₄ → 8NaHSO₄ + 4I₂ + H₂S + 4H₂O']
  },
  {
    id: 'g10-l22-q7',
    lessonId: 'g10-l22',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính thể tích khí tạo thành khi HCl tác dụng với muối carbonate.',
    content: 'Cho 10 g CaCO₃ tác dụng hết với dung dịch HCl dư. Tính thể tích khí CO₂ ở điều kiện chuẩn (24,79 L/mol) (Ca = 40, C = 12, O = 16).',
    correctAnswer: { value: 2.479, unit: 'L', tolerance: 0.01 },
    verify: () => 10 / molarMass('CaCO3') * GAS_VOLUME_STANDARD,
    solution: ['n(CaCO₃) = 10 / 100 = 0,1 mol.', 'CaCO₃ + 2HCl → CaCl₂ + CO₂ + H₂O ⇒ n(CO₂) = 0,1 mol.', 'V = 0,1 × 24,79 = 2,479 L.'],
    explanation: 'HCl là acid mạnh hơn H₂CO₃ nên đẩy được CO₂ ra khỏi muối carbonate.',
    equations: ['CaCO₃ + 2HCl → CaCl₂ + CO₂ + H₂O']
  },

  /* ----- Bài 23. Ôn tập chương 7 ----- */
  {
    id: 'g10-l23-q1',
    lessonId: 'g10-l23',
    type: 'single',
    difficulty: 'understand',
    objective: 'Nhận biết muối halide bằng AgNO₃.',
    content: 'Nhỏ dung dịch AgNO₃ vào một dung dịch muối sodium thấy xuất hiện kết tủa vàng nhạt. Muối đó là',
    options: [
      { id: 'a', text: 'NaF', feedback: 'AgF tan, không có kết tủa.' },
      { id: 'b', text: 'NaCl', feedback: 'AgCl là kết tủa trắng.' },
      { id: 'c', text: 'NaBr' },
      { id: 'd', text: 'NaI', feedback: 'AgI là kết tủa vàng (đậm hơn).' }
    ],
    correctAnswer: 'c',
    explanation: 'AgBr là kết tủa màu vàng nhạt.',
    equations: ['AgNO₃ + NaBr → AgBr + NaNO₃']
  },
  {
    id: 'g10-l23-q2',
    lessonId: 'g10-l23',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính thể tích khí hydrogen từ phản ứng kim loại với HCl.',
    content: 'Hòa tan hoàn toàn 8,4 g Fe trong dung dịch HCl dư. Tính thể tích khí H₂ thu được ở điều kiện chuẩn (24,79 L/mol) (Fe = 56).',
    correctAnswer: { value: 3.7185, unit: 'L', tolerance: 0.01 },
    verify: () => 8.4 / molarMass('Fe') * GAS_VOLUME_STANDARD,
    solution: ['n(Fe) = 8,4 / 56 = 0,15 mol.', 'Fe + 2HCl → FeCl₂ + H₂ ⇒ n(H₂) = 0,15 mol.', 'V = 0,15 × 24,79 ≈ 3,72 L.'],
    explanation: 'Fe tác dụng với HCl chỉ tạo muối sắt(II).',
    equations: ['Fe + 2HCl → FeCl₂ + H₂']
  },
  {
    id: 'g10-l23-q3',
    lessonId: 'g10-l23',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'Hệ thống hóa xu hướng biến đổi trong nhóm halogen.',
    content: 'Đi từ F đến I, chọn tất cả đại lượng tăng dần.',
    options: [
      { id: 'a', text: 'Bán kính nguyên tử' },
      { id: 'b', text: 'Độ âm điện', feedback: 'Độ âm điện giảm từ 3,98 (F) xuống 2,66 (I).' },
      { id: 'c', text: 'Tính acid của dung dịch HX' },
      { id: 'd', text: 'Tính khử của ion X⁻' },
      { id: 'e', text: 'Tính oxi hóa của đơn chất X₂', feedback: 'Tính oxi hóa giảm từ F₂ đến I₂.' }
    ],
    correctAnswer: ['a', 'c', 'd'],
    explanation: 'Bán kính tăng làm X₂ khó nhận electron hơn, X⁻ dễ nhường electron hơn và liên kết H–X kém bền hơn.'
  },
  {
    id: 'g10-l23-q4',
    lessonId: 'g10-l23',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Vận dụng kiến thức về halogen trong thực tế.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Dẫn khí Cl₂ vào dung dịch KI có hồ tinh bột, dung dịch chuyển màu xanh tím.', explanation: 'Cl₂ đẩy I₂ ra; I₂ tạo màu xanh tím với hồ tinh bột.' },
      { id: 'b', text: 'Nước Javel chứa NaClO.', explanation: 'Tạo từ Cl₂ + 2NaOH ở nhiệt độ thường.' },
      { id: 'c', text: 'Trong công nghiệp, chlorine được điều chế từ MnO₂ và HCl đặc.', explanation: 'Đó là cách điều chế trong phòng thí nghiệm; công nghiệp dùng điện phân dung dịch NaCl.' },
      { id: 'd', text: 'Muối iod được bổ sung KI hoặc KIO₃ để phòng bệnh bướu cổ.', explanation: 'Iodine cần cho tuyến giáp.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'Halogen và hợp chất của chúng có nhiều ứng dụng quan trọng.',
    equations: ['Cl₂ + 2KI → 2KCl + I₂', 'Cl₂ + 2NaOH → NaCl + NaClO + H₂O']
  },
  {
    id: 'g10-l23-q5',
    lessonId: 'g10-l23',
    type: 'short',
    difficulty: 'recognize',
    objective: 'Viết công thức kết tủa khi nhận biết ion chloride.',
    content: 'Viết công thức kết tủa trắng tạo thành khi nhỏ dung dịch AgNO₃ vào dung dịch NaCl.',
    correctAnswer: { accepted: ['AgCl'], caseSensitive: true, compact: true },
    explanation: 'AgNO₃ + NaCl → AgCl + NaNO₃; AgCl là kết tủa trắng.',
    equations: ['AgNO₃ + NaCl → AgCl + NaNO₃']
  },
  {
    id: 'g10-l23-q6',
    lessonId: 'g10-l23',
    type: 'numeric',
    difficulty: 'advanced',
    objective: 'Tính khối lượng muối sau phản ứng halogen đẩy halogen.',
    content: 'Dẫn khí Cl₂ dư vào dung dịch chứa 10,3 g NaBr. Phản ứng xảy ra hoàn toàn. Tính khối lượng NaCl tạo thành (Na = 23, Br = 80, Cl = 35,5).',
    correctAnswer: { value: 5.85, unit: 'g', tolerance: 0.02 },
    verify: () => 10.3 / molarMass('NaBr') * molarMass('NaCl'),
    solution: [
      'Cl₂ + 2NaBr → 2NaCl + Br₂.',
      'n(NaBr) = 10,3 / 103 = 0,1 mol ⇒ n(NaCl) = 0,1 mol.',
      'm(NaCl) = 0,1 × 58,5 = 5,85 g.'
    ],
    explanation: 'Tỉ lệ mol NaBr : NaCl = 1 : 1.',
    equations: ['Cl₂ + 2NaBr → 2NaCl + Br₂']
  },
  {
    id: 'g10-l23-q7',
    lessonId: 'g10-l23',
    type: 'single',
    difficulty: 'apply',
    objective: 'Xác định số electron trao đổi trong phản ứng giữa halogen.',
    content: 'Trong phản ứng Cl₂ + 2NaI → 2NaCl + I₂, mỗi phân tử Cl₂ đã',
    options: [
      { id: 'a', text: 'nhường 2 electron', feedback: 'Cl giảm số oxi hóa (0 → −1) nên nhận electron.' },
      { id: 'b', text: 'nhận 2 electron' },
      { id: 'c', text: 'nhận 1 electron', feedback: 'Mỗi nguyên tử Cl nhận 1 electron; phân tử Cl₂ có 2 nguyên tử.' },
      { id: 'd', text: 'không trao đổi electron' }
    ],
    correctAnswer: 'b',
    explanation: 'Cl₂ + 2e → 2Cl⁻; Cl₂ là chất oxi hóa, I⁻ là chất khử.',
    equations: ['Cl₂ + 2NaI → 2NaCl + I₂', 'Cl₂ + 2e → 2Cl⁻']
  }
]
