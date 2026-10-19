// Hóa học 11 · Chương 1 — Cân bằng hóa học. Questions for Bài 1–3.
export const questions = [
  /* ----- Bài 1. Khái niệm về cân bằng hóa học ----- */
  {
    id: 'g11-l1-q1',
    lessonId: 'g11-l1',
    type: 'single',
    difficulty: 'recognize',
    objective: 'Nêu khái niệm phản ứng thuận nghịch.',
    content: 'Phản ứng thuận nghịch là phản ứng',
    options: [
      { id: 'a', text: 'chỉ xảy ra theo một chiều từ chất đầu sang sản phẩm', feedback: 'Đó là phản ứng một chiều.' },
      { id: 'b', text: 'xảy ra theo hai chiều ngược nhau trong cùng điều kiện' },
      { id: 'c', text: 'luôn tỏa nhiệt' },
      { id: 'd', text: 'chỉ xảy ra khi có chất xúc tác' }
    ],
    correctAnswer: 'b',
    explanation: 'Ví dụ H₂(g) + I₂(g) ⇌ 2HI(g): HI tạo thành đồng thời bị phân hủy trở lại.'
  },
  {
    id: 'g11-l1-q2',
    lessonId: 'g11-l1',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính hằng số cân bằng từ nồng độ cân bằng.',
    content: 'Cho cân bằng H₂(g) + I₂(g) ⇌ 2HI(g). Ở một nhiệt độ, nồng độ cân bằng: [H₂] = [I₂] = 0,20 M; [HI] = 1,40 M. Tính KC.',
    correctAnswer: { value: 49, tolerance: 0.1 },
    verify: () => 1.4 ** 2 / (0.2 * 0.2),
    solution: ['KC = [HI]² / ([H₂][I₂]).', 'KC = 1,40² / (0,20 × 0,20) = 1,96 / 0,04 = 49.'],
    explanation: 'Nồng độ HI có số mũ 2 vì hệ số của HI trong phương trình là 2.',
    equations: ['H₂(g) + I₂(g) ⇌ 2HI(g)']
  },
  {
    id: 'g11-l1-q3',
    lessonId: 'g11-l1',
    type: 'multiple',
    difficulty: 'apply',
    objective: 'Vận dụng nguyên lí Le Chatelier.',
    content: 'Xét cân bằng N₂(g) + 3H₂(g) ⇌ 2NH₃(g), chiều thuận tỏa nhiệt. Chọn tất cả tác động làm cân bằng chuyển dịch theo chiều thuận.',
    options: [
      { id: 'a', text: 'Tăng áp suất của hệ.' },
      { id: 'b', text: 'Giảm nhiệt độ.' },
      { id: 'c', text: 'Thêm chất xúc tác.', feedback: 'Chất xúc tác không làm chuyển dịch cân bằng.' },
      { id: 'd', text: 'Lấy bớt NH₃ ra khỏi hệ.' },
      { id: 'e', text: 'Giảm nồng độ N₂.', feedback: 'Giảm chất phản ứng làm cân bằng chuyển dịch theo chiều nghịch.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Tăng áp suất (4 mol khí → 2 mol khí), giảm nhiệt độ (chiều thuận tỏa nhiệt) và lấy bớt sản phẩm đều làm cân bằng chuyển sang phải.',
    equations: ['N₂(g) + 3H₂(g) ⇌ 2NH₃(g)']
  },
  {
    id: 'g11-l1-q4',
    lessonId: 'g11-l1',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Hiểu đặc điểm của trạng thái cân bằng và hằng số cân bằng.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Hằng số cân bằng KC phụ thuộc vào nhiệt độ.', explanation: 'KC chỉ phụ thuộc nhiệt độ và bản chất phản ứng.' },
      { id: 'b', text: 'Ở trạng thái cân bằng, phản ứng thuận và nghịch đều dừng lại.', explanation: 'Cân bằng là cân bằng động: hai phản ứng vẫn xảy ra với tốc độ bằng nhau.' },
      { id: 'c', text: 'Chất rắn không có mặt trong biểu thức KC.', explanation: 'Ví dụ CaCO₃(s) ⇌ CaO(s) + CO₂(g) có KC = [CO₂].' },
      { id: 'd', text: 'Tăng áp suất làm cân bằng H₂(g) + I₂(g) ⇌ 2HI(g) chuyển dịch theo chiều thuận.', explanation: 'Số mol khí hai vế bằng nhau (2 = 2) nên áp suất không làm chuyển dịch cân bằng.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Áp suất chỉ ảnh hưởng khi tổng số mol khí hai vế khác nhau.'
  },
  {
    id: 'g11-l1-q5',
    lessonId: 'g11-l1',
    type: 'short',
    difficulty: 'recognize',
    objective: 'Gọi tên nguyên lí chuyển dịch cân bằng.',
    content: 'Nguyên lí “cân bằng chuyển dịch theo chiều làm giảm tác động từ bên ngoài” mang tên nhà khoa học nào?',
    correctAnswer: { accepted: ['Le Chatelier', 'Le Châtelier', 'nguyên lí Le Chatelier', 'nguyên lý Le Chatelier', 'Lơ Satơliê'] },
    explanation: 'Nguyên lí Le Chatelier (Henri Louis Le Chatelier, nhà hóa học Pháp).'
  },
  {
    id: 'g11-l1-q6',
    lessonId: 'g11-l1',
    type: 'single',
    difficulty: 'understand',
    objective: 'Viết biểu thức KC cho cân bằng có chất rắn.',
    content: 'Biểu thức KC của cân bằng C(s) + CO₂(g) ⇌ 2CO(g) là',
    options: [
      { id: 'a', text: 'KC = [CO]² / ([C][CO₂])', feedback: 'Chất rắn C không có mặt trong biểu thức KC.' },
      { id: 'b', text: 'KC = [CO]² / [CO₂]' },
      { id: 'c', text: 'KC = 2[CO] / [CO₂]', feedback: 'Hệ số là số mũ, không phải hệ số nhân.' },
      { id: 'd', text: 'KC = [CO₂] / [CO]²', feedback: 'Sản phẩm ở tử số, chất phản ứng ở mẫu số.' }
    ],
    correctAnswer: 'b',
    explanation: 'Chỉ ghi nồng độ chất khí (và chất tan); số mũ bằng hệ số tỉ lượng.',
    equations: ['C(s) + CO₂(g) ⇌ 2CO(g)']
  },
  {
    id: 'g11-l1-q7',
    lessonId: 'g11-l1',
    type: 'numeric',
    difficulty: 'advanced',
    objective: 'Tính nồng độ cân bằng từ hằng số cân bằng.',
    content: 'Cho cân bằng CO(g) + H₂O(g) ⇌ CO₂(g) + H₂(g) có KC = 1 ở nhiệt độ T. Ban đầu chỉ có CO và H₂O, mỗi chất 0,10 M. Tính nồng độ CO₂ khi cân bằng.',
    correctAnswer: { value: 0.05, unit: 'M', tolerance: 0.001 },
    verify: () => {
      const root = Math.sqrt(1)
      return 0.1 * root / (1 + root)
    },
    solution: [
      'Gọi x là nồng độ CO phản ứng: cân bằng [CO] = [H₂O] = 0,10 − x; [CO₂] = [H₂] = x.',
      'KC = x² / (0,10 − x)² = 1 ⇒ x / (0,10 − x) = 1 ⇒ x = 0,05.',
      '[CO₂] = 0,05 M.'
    ],
    explanation: 'Với KC = 1 và nồng độ ban đầu bằng nhau, một nửa lượng chất phản ứng đã chuyển hóa.',
    equations: ['CO(g) + H₂O(g) ⇌ CO₂(g) + H₂(g)']
  },

  /* ----- Bài 2. Cân bằng trong dung dịch nước ----- */
  {
    id: 'g11-l2-q1',
    lessonId: 'g11-l2',
    type: 'single',
    difficulty: 'recognize',
    objective: 'Nhận biết chất không điện li.',
    content: 'Chất nào là chất không điện li?',
    options: [
      { id: 'a', text: 'NaCl' },
      { id: 'b', text: 'HCl' },
      { id: 'c', text: 'Glucose (C₆H₁₂O₆)' },
      { id: 'd', text: 'CH₃COOH', feedback: 'CH₃COOH là chất điện li yếu.' }
    ],
    correctAnswer: 'c',
    explanation: 'Glucose tan trong nước dưới dạng phân tử, không phân li ra ion nên dung dịch không dẫn điện.'
  },
  {
    id: 'g11-l2-q2',
    lessonId: 'g11-l2',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính pH của dung dịch acid mạnh.',
    content: 'Tính pH của dung dịch HNO₃ 0,001 M (25 °C).',
    correctAnswer: { value: 3, tolerance: 0.01 },
    verify: () => -Math.log10(0.001),
    solution: ['HNO₃ → H⁺ + NO₃⁻ ⇒ [H⁺] = 10⁻³ M.', 'pH = −lg(10⁻³) = 3.'],
    explanation: 'Acid mạnh phân li hoàn toàn nên [H⁺] bằng nồng độ acid (acid một nấc).',
    equations: ['HNO₃ → H⁺ + NO₃⁻']
  },
  {
    id: 'g11-l2-q3',
    lessonId: 'g11-l2',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính pH của dung dịch base mạnh hai nấc.',
    content: 'Tính pH của dung dịch Ba(OH)₂ 0,0005 M (25 °C).',
    correctAnswer: { value: 11, tolerance: 0.01 },
    verify: () => 14 + Math.log10(2 * 0.0005),
    solution: [
      'Ba(OH)₂ → Ba²⁺ + 2OH⁻ ⇒ [OH⁻] = 2 × 0,0005 = 10⁻³ M.',
      '[H⁺] = 10⁻¹⁴ / 10⁻³ = 10⁻¹¹ M ⇒ pH = 11.'
    ],
    explanation: 'Mỗi phân tử Ba(OH)₂ phân li ra hai ion OH⁻.',
    equations: ['Ba(OH)₂ → Ba²⁺ + 2OH⁻']
  },
  {
    id: 'g11-l2-q4',
    lessonId: 'g11-l2',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'Phân loại chất điện li mạnh.',
    content: 'Chọn tất cả chất điện li mạnh.',
    options: [
      { id: 'a', text: 'HCl' },
      { id: 'b', text: 'NaOH' },
      { id: 'c', text: 'CH₃COOH', feedback: 'Acid yếu, chỉ phân li một phần.' },
      { id: 'd', text: 'KNO₃' },
      { id: 'e', text: 'C₂H₅OH', feedback: 'Ethanol không điện li.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Acid mạnh, base mạnh và hầu hết muối tan là chất điện li mạnh.'
  },
  {
    id: 'g11-l2-q5',
    lessonId: 'g11-l2',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Vận dụng pH, chất chỉ thị và thuyết Brønsted – Lowry.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Quỳ tím hóa xanh trong dung dịch NaOH.', explanation: 'Môi trường base làm quỳ tím hóa xanh.' },
      { id: 'b', text: 'Dung dịch Na₂CO₃ có pH nhỏ hơn 7.', explanation: 'CO₃²⁻ + H₂O ⇌ HCO₃⁻ + OH⁻: dung dịch có tính base, pH > 7.' },
      { id: 'c', text: 'Máu người có pH khoảng 7,35 – 7,45.', explanation: 'Máu có tính base rất yếu và được giữ ổn định.' },
      { id: 'd', text: 'Ion HCO₃⁻ là chất lưỡng tính.', explanation: 'HCO₃⁻ vừa cho vừa nhận được proton.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: true },
    explanation: 'Một số muối làm dung dịch có tính acid hoặc base do ion phản ứng với nước.',
    equations: ['CO₃²⁻ + H₂O ⇌ HCO₃⁻ + OH⁻']
  },
  {
    id: 'g11-l2-q6',
    lessonId: 'g11-l2',
    type: 'numeric',
    difficulty: 'advanced',
    objective: 'Tính nồng độ từ kết quả chuẩn độ.',
    content: 'Chuẩn độ 20,0 mL dung dịch NaOH cần vừa đủ 16,0 mL dung dịch HCl 0,125 M. Tính nồng độ mol của dung dịch NaOH.',
    correctAnswer: { value: 0.1, unit: 'M', tolerance: 0.001 },
    verify: () => 0.016 * 0.125 / 0.02,
    solution: [
      'n(HCl) = 0,0160 × 0,125 = 0,002 mol.',
      'HCl + NaOH → NaCl + H₂O ⇒ n(NaOH) = 0,002 mol.',
      'C(NaOH) = 0,002 / 0,0200 = 0,100 M.'
    ],
    explanation: 'Với tỉ lệ 1 : 1: C(NaOH)·V(NaOH) = C(HCl)·V(HCl).',
    equations: ['HCl + NaOH → NaCl + H₂O']
  },
  {
    id: 'g11-l2-q7',
    lessonId: 'g11-l2',
    type: 'short',
    difficulty: 'recognize',
    objective: 'Phát biểu định nghĩa base theo Brønsted – Lowry.',
    content: 'Theo thuyết Brønsted – Lowry, base là chất nhận loại hạt nào?',
    correctAnswer: { accepted: ['proton', 'H+', 'H⁺', 'ion H+', 'proton H+', 'ion H⁺'] },
    explanation: 'Base nhận proton (H⁺); acid cho proton.'
  },

  /* ----- Bài 3. Ôn tập chương 1 ----- */
  {
    id: 'g11-l3-q1',
    lessonId: 'g11-l3',
    type: 'single',
    difficulty: 'understand',
    objective: 'Viết biểu thức hằng số cân bằng.',
    content: 'Biểu thức KC của cân bằng 2NO₂(g) ⇌ N₂O₄(g) là',
    options: [
      { id: 'a', text: 'KC = [N₂O₄] / [NO₂]²' },
      { id: 'b', text: 'KC = [NO₂]² / [N₂O₄]', feedback: 'Đây là biểu thức của chiều ngược lại.' },
      { id: 'c', text: 'KC = [N₂O₄] / 2[NO₂]' },
      { id: 'd', text: 'KC = [N₂O₄][NO₂]²' }
    ],
    correctAnswer: 'a',
    explanation: 'Sản phẩm N₂O₄ ở tử số; NO₂ có hệ số 2 nên có số mũ 2.',
    equations: ['2NO₂(g) ⇌ N₂O₄(g)']
  },
  {
    id: 'g11-l3-q2',
    lessonId: 'g11-l3',
    type: 'numeric',
    difficulty: 'advanced',
    objective: 'Tính pH của dung dịch sau phản ứng trung hòa.',
    content: 'Trộn 100 mL dung dịch HCl 0,02 M với 100 mL dung dịch NaOH 0,01 M. Tính pH của dung dịch thu được (25 °C, làm tròn 2 chữ số thập phân).',
    correctAnswer: { value: 2.3, tolerance: 0.02 },
    verify: () => -Math.log10((0.1 * 0.02 - 0.1 * 0.01) / 0.2),
    solution: [
      'n(H⁺) = 0,002 mol; n(OH⁻) = 0,001 mol ⇒ H⁺ dư 0,001 mol.',
      '[H⁺] = 0,001 / 0,2 = 0,005 M.',
      'pH = −lg 0,005 ≈ 2,30.'
    ],
    explanation: 'Tổng thể tích sau khi trộn là 200 mL.',
    equations: ['H⁺ + OH⁻ → H₂O']
  },
  {
    id: 'g11-l3-q3',
    lessonId: 'g11-l3',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Tổng hợp kiến thức về cân bằng và pH.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Thêm chất xúc tác làm tăng giá trị KC.', explanation: 'Xúc tác không làm thay đổi KC.' },
      { id: 'b', text: 'Dung dịch có [H⁺] = 10⁻⁹ M có môi trường base.', explanation: 'pH = 9 > 7.' },
      { id: 'c', text: 'Giảm thể tích bình chứa làm cân bằng 2SO₂(g) + O₂(g) ⇌ 2SO₃(g) chuyển dịch theo chiều thuận.', explanation: 'Áp suất tăng, cân bằng chuyển về phía ít mol khí hơn.' },
      { id: 'd', text: 'Sự điện li của chất điện li yếu được biểu diễn bằng mũi tên một chiều.', explanation: 'Chất điện li yếu dùng mũi tên hai chiều (⇌).' }
    ],
    correctAnswer: { a: false, b: true, c: true, d: false },
    explanation: 'Hằng số cân bằng chỉ phụ thuộc nhiệt độ.',
    equations: ['2SO₂(g) + O₂(g) ⇌ 2SO₃(g)']
  },
  {
    id: 'g11-l3-q4',
    lessonId: 'g11-l3',
    type: 'multiple',
    difficulty: 'apply',
    objective: 'Dự đoán sự thay đổi pH.',
    content: 'Cho dung dịch HCl 0,01 M. Chọn tất cả thao tác làm pH của dung dịch tăng lên.',
    options: [
      { id: 'a', text: 'Thêm một ít dung dịch NaOH.' },
      { id: 'b', text: 'Thêm một ít dung dịch HCl 0,1 M.', feedback: 'Nồng độ H⁺ tăng nên pH giảm.' },
      { id: 'c', text: 'Pha loãng bằng nước cất.' },
      { id: 'd', text: 'Thêm một ít Na₂CO₃.' },
      { id: 'e', text: 'Thêm một ít dung dịch H₂SO₄.', feedback: 'Thêm acid làm pH giảm.' }
    ],
    correctAnswer: ['a', 'c', 'd'],
    explanation: '[H⁺] giảm khi bị trung hòa (NaOH, Na₂CO₃) hoặc khi pha loãng; [H⁺] giảm thì pH tăng.',
    equations: ['Na₂CO₃ + 2HCl → 2NaCl + CO₂ + H₂O']
  },
  {
    id: 'g11-l3-q5',
    lessonId: 'g11-l3',
    type: 'short',
    difficulty: 'recognize',
    objective: 'Xác định môi trường từ pH.',
    content: 'Ở 25 °C, dung dịch có pH = 7 có môi trường gì?',
    correctAnswer: { accepted: ['trung tính', 'môi trường trung tính'] },
    explanation: 'pH = 7 ứng với [H⁺] = [OH⁻] = 10⁻⁷ M.'
  },
  {
    id: 'g11-l3-q6',
    lessonId: 'g11-l3',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính hằng số cân bằng của phản ứng tạo SO₃.',
    content: 'Cho cân bằng 2SO₂(g) + O₂(g) ⇌ 2SO₃(g). Nồng độ cân bằng: [SO₂] = 0,10 M; [O₂] = 0,05 M; [SO₃] = 0,20 M. Tính KC.',
    correctAnswer: { value: 80, tolerance: 0.1 },
    verify: () => 0.2 ** 2 / (0.1 ** 2 * 0.05),
    solution: ['KC = [SO₃]² / ([SO₂]²[O₂]).', 'KC = 0,04 / (0,01 × 0,05) = 0,04 / 0,0005 = 80.'],
    explanation: 'Số mũ của mỗi nồng độ bằng hệ số tỉ lượng.',
    equations: ['2SO₂(g) + O₂(g) ⇌ 2SO₃(g)']
  },
  {
    id: 'g11-l3-q7',
    lessonId: 'g11-l3',
    type: 'single',
    difficulty: 'advanced',
    objective: 'Vận dụng nguyên lí Le Chatelier cho phản ứng thu nhiệt.',
    content: 'Cho cân bằng N₂O₄(g, không màu) ⇌ 2NO₂(g, nâu đỏ), chiều thuận thu nhiệt. Tác động nào làm màu nâu đỏ của hỗn hợp đậm lên?',
    options: [
      { id: 'a', text: 'Giảm nhiệt độ', feedback: 'Giảm nhiệt độ làm cân bằng chuyển theo chiều tỏa nhiệt (chiều nghịch), màu nhạt đi.' },
      { id: 'b', text: 'Tăng áp suất', feedback: 'Tăng áp suất làm cân bằng chuyển về phía ít mol khí (N₂O₄).' },
      { id: 'c', text: 'Thêm chất xúc tác', feedback: 'Xúc tác không làm chuyển dịch cân bằng.' },
      { id: 'd', text: 'Tăng nhiệt độ' }
    ],
    correctAnswer: 'd',
    explanation: 'Tăng nhiệt độ, cân bằng chuyển theo chiều thu nhiệt (chiều thuận) tạo thêm NO₂ màu nâu đỏ.',
    equations: ['N₂O₄(g) ⇌ 2NO₂(g)']
  }
]
