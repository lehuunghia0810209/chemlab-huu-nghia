// Hóa học 10 · Chương 6 — Tốc độ phản ứng. Questions for Bài 19–20.
import { molarMass } from '../chemMath.js'

export const questions = [
  /* ----- Bài 19. Tốc độ phản ứng ----- */
  {
    id: 'g10-l19-q1',
    lessonId: 'g10-l19',
    type: 'single',
    difficulty: 'recognize',
    objective: 'Nêu khái niệm tốc độ phản ứng.',
    content: 'Tốc độ phản ứng là đại lượng đặc trưng cho',
    options: [
      { id: 'a', text: 'độ biến thiên nồng độ của chất phản ứng hoặc sản phẩm trong một đơn vị thời gian' },
      { id: 'b', text: 'lượng nhiệt tỏa ra của phản ứng', feedback: 'Đó là biến thiên enthalpy.' },
      { id: 'c', text: 'tổng khối lượng các chất sau phản ứng', feedback: 'Khối lượng được bảo toàn, không cho biết phản ứng nhanh hay chậm.' },
      { id: 'd', text: 'số chất tham gia phản ứng' }
    ],
    correctAnswer: 'a',
    explanation: 'Tốc độ trung bình v̄ = −ΔC(chất đầu)/Δt hoặc ΔC(sản phẩm)/Δt (chia cho hệ số).'
  },
  {
    id: 'g10-l19-q2',
    lessonId: 'g10-l19',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính tốc độ trung bình của phản ứng.',
    content: 'Trong phản ứng A → B, nồng độ A giảm từ 0,80 M xuống 0,50 M sau 60 giây. Tính tốc độ trung bình của phản ứng (M/s).',
    correctAnswer: { value: 0.005, unit: 'M/s', units: { 'M/s': 1 }, tolerance: 0.0001, display: '0,005' },
    verify: () => (0.8 - 0.5) / 60,
    solution: ['ΔC(A) = 0,50 − 0,80 = −0,30 M.', 'v̄ = −ΔC/Δt = 0,30 / 60 = 0,005 M/s.'],
    explanation: 'Với chất phản ứng, thêm dấu trừ để tốc độ dương.'
  },
  {
    id: 'g10-l19-q3',
    lessonId: 'g10-l19',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'Vận dụng các yếu tố ảnh hưởng đến tốc độ phản ứng.',
    content: 'Cho kẽm tác dụng với dung dịch HCl. Chọn tất cả cách làm phản ứng xảy ra nhanh hơn.',
    options: [
      { id: 'a', text: 'Dùng kẽm bột thay cho kẽm viên.' },
      { id: 'b', text: 'Tăng nồng độ dung dịch HCl.' },
      { id: 'c', text: 'Làm lạnh hỗn hợp.', feedback: 'Giảm nhiệt độ làm tốc độ giảm.' },
      { id: 'd', text: 'Đun nóng hỗn hợp.' },
      { id: 'e', text: 'Pha loãng dung dịch HCl.', feedback: 'Giảm nồng độ làm tốc độ giảm.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Tăng diện tích bề mặt, nồng độ và nhiệt độ đều làm tăng tốc độ phản ứng.',
    equations: ['Zn + 2HCl → ZnCl₂ + H₂']
  },
  {
    id: 'g10-l19-q4',
    lessonId: 'g10-l19',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Hiểu hằng số tốc độ, chất xúc tác và ảnh hưởng của áp suất.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Chất xúc tác bị tiêu hao trong quá trình phản ứng.', explanation: 'Chất xúc tác còn nguyên về lượng và chất sau phản ứng.' },
      { id: 'b', text: 'Hằng số tốc độ k phụ thuộc vào nhiệt độ.', explanation: 'k phụ thuộc bản chất phản ứng và nhiệt độ.' },
      { id: 'c', text: 'Áp suất ảnh hưởng đến tốc độ của phản ứng có chất khí tham gia.', explanation: 'Tăng áp suất làm tăng nồng độ chất khí.' },
      { id: 'd', text: 'Tốc độ phản ứng có thể mang giá trị âm.', explanation: 'Tốc độ luôn dương; dấu trừ trong công thức để bù ΔC < 0 của chất phản ứng.' }
    ],
    correctAnswer: { a: false, b: true, c: true, d: false },
    explanation: 'Nồng độ, áp suất, nhiệt độ, diện tích bề mặt, chất xúc tác là các yếu tố ảnh hưởng.'
  },
  {
    id: 'g10-l19-q5',
    lessonId: 'g10-l19',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Vận dụng hệ số nhiệt độ Van’t Hoff.',
    content: 'Một phản ứng có hệ số nhiệt độ γ = 3. Khi tăng nhiệt độ từ 25 °C lên 55 °C, tốc độ phản ứng tăng bao nhiêu lần?',
    correctAnswer: { value: 27 },
    verify: () => 3 ** ((55 - 25) / 10),
    solution: ['v₂/v₁ = γ^((t₂ − t₁)/10) = 3^(30/10).', '= 3³ = 27 lần.'],
    explanation: 'Mỗi lần tăng 10 °C, tốc độ tăng γ lần.'
  },
  {
    id: 'g10-l19-q6',
    lessonId: 'g10-l19',
    type: 'short',
    difficulty: 'recognize',
    objective: 'Nêu ví dụ về chất xúc tác.',
    content: 'Viết công thức chất xúc tác thường dùng để làm H₂O₂ phân hủy nhanh trong phòng thí nghiệm (một oxide của manganese).',
    correctAnswer: { accepted: ['MnO2', 'MnO₂'], caseSensitive: true, compact: true },
    explanation: '2H₂O₂ → 2H₂O + O₂ xảy ra nhanh khi có MnO₂; MnO₂ còn nguyên sau phản ứng.',
    equations: ['2H₂O₂ → 2H₂O + O₂']
  },
  {
    id: 'g10-l19-q7',
    lessonId: 'g10-l19',
    type: 'numeric',
    difficulty: 'advanced',
    objective: 'Vận dụng định luật tác dụng khối lượng khi thay đổi nhiều nồng độ.',
    content: 'Phản ứng đơn giản A + 2B → C có v = k·C_A·C_B². Nếu giảm nồng độ A đi 2 lần và tăng nồng độ B lên 3 lần thì tốc độ phản ứng tăng bao nhiêu lần?',
    correctAnswer: { value: 4.5, tolerance: 0.01 },
    verify: () => 0.5 * 3 ** 2,
    solution: ['v′/v = (1/2) × 3².', '= 0,5 × 9 = 4,5 lần.'],
    explanation: 'Nồng độ của B có số mũ 2 nên ảnh hưởng mạnh hơn.'
  },

  /* ----- Bài 20. Ôn tập chương 6 ----- */
  {
    id: 'g10-l20-q1',
    lessonId: 'g10-l20',
    type: 'single',
    difficulty: 'apply',
    objective: 'Tính thời gian phản ứng ở nhiệt độ khác bằng hệ số Van’t Hoff.',
    content: 'Ở 30 °C, một phản ứng kết thúc sau 40 phút. Hệ số nhiệt độ γ = 2. Ở 50 °C, phản ứng kết thúc sau',
    options: [
      { id: 'a', text: '20 phút', feedback: 'Tăng 20 °C thì tốc độ tăng 2² = 4 lần, không phải 2 lần.' },
      { id: 'b', text: '10 phút' },
      { id: 'c', text: '160 phút', feedback: 'Tốc độ tăng thì thời gian giảm.' },
      { id: 'd', text: '5 phút' }
    ],
    correctAnswer: 'b',
    explanation: 'v₂/v₁ = 2^((50 − 30)/10) = 4 ⇒ thời gian giảm 4 lần: 40 / 4 = 10 phút.'
  },
  {
    id: 'g10-l20-q2',
    lessonId: 'g10-l20',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính tốc độ trung bình theo lượng chất rắn.',
    content: 'Cho 6,0 g magnesium vào dung dịch HCl dư. Sau 30 giây còn lại 3,6 g Mg. Tính tốc độ trung bình theo Mg (mol/s) (Mg = 24).',
    correctAnswer: { value: 0.003333, unit: 'mol/s', units: { 'mol/s': 1 }, tolerance: 0.00005, display: '0,0033' },
    verify: () => (6 - 3.6) / molarMass('Mg') / 30,
    solution: ['Khối lượng Mg đã phản ứng: 6,0 − 3,6 = 2,4 g ⇒ 0,1 mol.', 'v̄ = 0,1 / 30 ≈ 0,0033 mol/s.'],
    explanation: 'Với chất rắn, có thể tính tốc độ theo số mol chất mất đi trong một đơn vị thời gian.',
    equations: ['Mg + 2HCl → MgCl₂ + H₂']
  },
  {
    id: 'g10-l20-q3',
    lessonId: 'g10-l20',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Giải thích các ứng dụng thực tế của tốc độ phản ứng.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Than tổ ong có nhiều lỗ để tăng diện tích tiếp xúc với không khí.', explanation: 'Diện tích bề mặt lớn ⇒ cháy nhanh hơn.' },
      { id: 'b', text: 'Bảo quản thực phẩm trong tủ lạnh làm tăng tốc độ phân hủy thực phẩm.', explanation: 'Nhiệt độ thấp làm chậm các phản ứng gây hỏng.' },
      { id: 'c', text: 'Nhai kĩ thức ăn giúp tiêu hóa nhanh hơn nhờ tăng diện tích bề mặt.', explanation: 'Thức ăn nhỏ tiếp xúc với enzyme nhiều hơn.' },
      { id: 'd', text: 'Thêm chất xúc tác làm tăng lượng sản phẩm thu được cuối cùng.', explanation: 'Xúc tác chỉ làm phản ứng nhanh hơn, không làm tăng lượng sản phẩm.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Điều khiển tốc độ phản ứng có nhiều ứng dụng trong đời sống.'
  },
  {
    id: 'g10-l20-q4',
    lessonId: 'g10-l20',
    type: 'multiple',
    difficulty: 'apply',
    objective: 'Xác định yếu tố làm tăng tốc độ phản ứng giữa các chất khí.',
    content: 'Xét phản ứng 2SO₂(g) + O₂(g) → 2SO₃(g). Chọn tất cả thay đổi làm tăng tốc độ phản ứng.',
    options: [
      { id: 'a', text: 'Tăng áp suất chung của hệ.' },
      { id: 'b', text: 'Tăng nhiệt độ.' },
      { id: 'c', text: 'Dùng chất xúc tác V₂O₅.' },
      { id: 'd', text: 'Giảm nồng độ O₂.', feedback: 'Giảm nồng độ chất phản ứng làm tốc độ giảm.' },
      { id: 'e', text: 'Tăng thể tích bình chứa (giữ nguyên lượng khí).', feedback: 'Tăng thể tích làm giảm nồng độ và áp suất các khí.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Áp suất, nhiệt độ và chất xúc tác V₂O₅ đều làm tăng tốc độ của phản ứng này.',
    equations: ['2SO₂(g) + O₂(g) → 2SO₃(g)']
  },
  {
    id: 'g10-l20-q5',
    lessonId: 'g10-l20',
    type: 'short',
    difficulty: 'recognize',
    objective: 'Gọi tên đại lượng γ trong quy tắc Van’t Hoff.',
    content: 'Trong công thức v₂/v₁ = γ^((t₂ − t₁)/10), đại lượng γ được gọi là gì?',
    correctAnswer: { accepted: ['hệ số nhiệt độ', 'hệ số nhiệt độ Van’t Hoff', "hệ số nhiệt độ Van't Hoff", 'hệ số Van’t Hoff', "hệ số Van't Hoff"] },
    explanation: 'γ là hệ số nhiệt độ (Van’t Hoff): số lần tốc độ tăng khi nhiệt độ tăng 10 °C, thường từ 2 đến 4.'
  },
  {
    id: 'g10-l20-q6',
    lessonId: 'g10-l20',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính tốc độ trung bình theo nồng độ.',
    content: 'Phản ứng Br₂ + HCOOH → 2HBr + CO₂. Nồng độ Br₂ giảm từ 0,0120 M xuống 0,0082 M trong 100 giây. Tính tốc độ trung bình của phản ứng (M/s).',
    correctAnswer: { value: 0.000038, unit: 'M/s', units: { 'M/s': 1 }, tolerance: 0.000001, display: '3,8×10⁻⁵' },
    verify: () => (0.012 - 0.0082) / 100,
    solution: ['ΔC(Br₂) = 0,0082 − 0,0120 = −0,0038 M.', 'v̄ = 0,0038 / 100 = 3,8 × 10⁻⁵ M/s (có thể nhập 3,8e-5).'],
    explanation: 'Br₂ có hệ số 1 nên tốc độ phản ứng bằng tốc độ giảm nồng độ của Br₂.',
    equations: ['Br₂ + HCOOH → 2HBr + CO₂']
  },
  {
    id: 'g10-l20-q7',
    lessonId: 'g10-l20',
    type: 'single',
    difficulty: 'advanced',
    objective: 'Vận dụng định luật tác dụng khối lượng khi nén hệ khí.',
    content: 'Phản ứng đơn giản 2NO(g) + O₂(g) → 2NO₂(g). Nén thể tích bình xuống còn một nửa (nhiệt độ không đổi) thì tốc độ phản ứng',
    options: [
      { id: 'a', text: 'tăng 2 lần', feedback: 'Cả hai nồng độ đều tăng gấp đôi, và NO có số mũ 2.' },
      { id: 'b', text: 'tăng 4 lần' },
      { id: 'c', text: 'tăng 8 lần' },
      { id: 'd', text: 'không đổi' }
    ],
    correctAnswer: 'c',
    explanation: 'Thể tích giảm một nửa ⇒ mọi nồng độ tăng 2 lần: v′/v = 2² × 2 = 8.',
    equations: ['2NO(g) + O₂(g) → 2NO₂(g)']
  }
]
