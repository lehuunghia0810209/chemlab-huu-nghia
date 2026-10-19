// Hóa học 12 · Chương 1 — Ester – Lipid. Questions for Bài 1–3.
import { molarMass, GAS_VOLUME_STANDARD as VM } from '../chemMath.js'

const TRISTEARIN = 'C57H110O6'
const TRIOLEIN = 'C57H104O6'

export const questions = [
  /* ----- Bài 1. Ester – Lipid ----- */
  {
    id: 'g12-l1-q1', lessonId: 'g12-l1', type: 'single', difficulty: 'recognize',
    objective: 'Nhận biết ester.',
    content: 'Chất nào sau đây là ester?',
    options: [
      { id: 'a', text: 'CH₃COOH', feedback: 'Đây là carboxylic acid.' },
      { id: 'b', text: 'HCOOCH₃' },
      { id: 'c', text: 'CH₃CHO' },
      { id: 'd', text: 'C₂H₅OH' }
    ],
    correctAnswer: 'b',
    explanation: 'HCOOCH₃ có dạng RCOOR′ (methyl formate).'
  },
  {
    id: 'g12-l1-q2', lessonId: 'g12-l1', type: 'short', difficulty: 'understand',
    objective: 'Gọi tên ester.',
    content: 'Gọi tên ester HCOOC₂H₅.',
    correctAnswer: { accepted: ['ethyl formate', 'ethyl methanoate'], compact: true },
    explanation: 'Gốc R′ = ethyl; gốc acid HCOO = formate (methanoate).'
  },
  {
    id: 'g12-l1-q3', lessonId: 'g12-l1', type: 'truefalse', difficulty: 'understand',
    objective: 'Trình bày tính chất của ester và chất béo.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Thủy phân ester trong môi trường acid là phản ứng thuận nghịch.', explanation: 'Ngược chiều với phản ứng ester hóa.' },
      { id: 'b', text: 'Chất béo là triester của glycerol với acid béo.', explanation: 'Còn gọi là triglyceride.' },
      { id: 'c', text: 'Dầu thực vật chứa chủ yếu gốc acid béo no nên ở trạng thái lỏng.', explanation: 'Dầu lỏng vì chứa chủ yếu gốc acid béo không no.' },
      { id: 'd', text: 'Ester có nhiệt độ sôi cao hơn carboxylic acid có cùng số C.', explanation: 'Ester không có liên kết hydrogen liên phân tử nên sôi thấp hơn.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: false },
    explanation: 'Gốc acid béo không no làm chất béo ở trạng thái lỏng; ester sôi thấp do không có liên kết hydrogen.',
    equations: ['CH₃COOC₂H₅ + H₂O ⇌ CH₃COOH + C₂H₅OH']
  },
  {
    id: 'g12-l1-q4', lessonId: 'g12-l1', type: 'multiple', difficulty: 'understand',
    objective: 'Nhận biết acid béo không no thiết yếu.',
    content: 'Chọn tất cả acid béo không no.',
    options: [
      { id: 'a', text: 'Oleic acid C₁₇H₃₃COOH' },
      { id: 'b', text: 'Stearic acid C₁₇H₃₅COOH', feedback: 'C₁₇H₃₅ có dạng CₙH₂ₙ₊₁ (n = 17) nên là gốc no.' },
      { id: 'c', text: 'Linoleic acid C₁₇H₃₁COOH' },
      { id: 'd', text: 'Palmitic acid C₁₅H₃₁COOH', feedback: 'C₁₅H₃₁ là gốc no.' },
      { id: 'e', text: 'Linolenic acid C₁₇H₂₉COOH' }
    ],
    correctAnswer: ['a', 'c', 'e'],
    explanation: 'Gốc CₙH₂ₙ₊₁ là no; thiếu 2, 4, 6 H ứng với 1, 2, 3 liên kết C=C.'
  },
  {
    id: 'g12-l1-q5', lessonId: 'g12-l1', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng muối khi xà phòng hóa ester.',
    content: 'Xà phòng hóa hoàn toàn 13,2 g ethyl acetate bằng dung dịch NaOH vừa đủ. Tính khối lượng muối thu được (C = 12, H = 1, O = 16, Na = 23).',
    correctAnswer: { value: 12.3, unit: 'g', tolerance: 0.02 },
    verify: () => 13.2 / molarMass('C4H8O2') * molarMass('C2H3O2Na'),
    solution: ['n(CH₃COOC₂H₅) = 13,2 / 88 = 0,15 mol = n(CH₃COONa).', 'm = 0,15 × 82 = 12,3 g.'],
    explanation: 'Ester đơn chức phản ứng với NaOH theo tỉ lệ 1 : 1.',
    equations: ['CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH']
  },
  {
    id: 'g12-l1-q6', lessonId: 'g12-l1', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng glycerol từ chất béo.',
    content: 'Xà phòng hóa hoàn toàn 44,5 g tristearin bằng NaOH. Tính khối lượng glycerol thu được.',
    correctAnswer: { value: 4.6, unit: 'g', tolerance: 0.02 },
    verify: () => 44.5 / molarMass(TRISTEARIN) * molarMass('C3H8O3'),
    solution: ['M(tristearin) = 890 ⇒ n = 44,5 / 890 = 0,05 mol = n(glycerol).', 'm = 0,05 × 92 = 4,6 g.'],
    explanation: 'Mỗi mol chất béo tạo 1 mol glycerol.',
    equations: ['(C₁₇H₃₅COO)₃C₃H₅ + 3NaOH → 3C₁₇H₃₅COONa + C₃H₅(OH)₃']
  },
  {
    id: 'g12-l1-q7', lessonId: 'g12-l1', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính thể tích H₂ cần để hydrogen hóa chất béo lỏng.',
    content: 'Tính thể tích H₂ (điều kiện chuẩn, 24,79 L/mol) cần để hydrogen hóa hoàn toàn 88,4 g triolein (C₁₇H₃₃COO)₃C₃H₅.',
    correctAnswer: { value: 7.437, unit: 'L', tolerance: 0.02 },
    verify: () => 88.4 / molarMass(TRIOLEIN) * 3 * VM,
    solution: ['M(triolein) = 884 ⇒ n = 0,1 mol; mỗi gốc oleic có 1 C=C ⇒ n(H₂) = 0,3 mol.', 'V = 0,3 × 24,79 ≈ 7,44 L.'],
    explanation: 'Triolein có 3 liên kết C=C trong ba gốc acid béo.',
    equations: ['(C₁₇H₃₃COO)₃C₃H₅ + 3H₂ → (C₁₇H₃₅COO)₃C₃H₅']
  },

  /* ----- Bài 2. Xà phòng và chất giặt rửa ----- */
  {
    id: 'g12-l2-q1', lessonId: 'g12-l2', type: 'single', difficulty: 'recognize',
    objective: 'Nhận biết chất giặt rửa tổng hợp.',
    content: 'Chất nào là chất giặt rửa tổng hợp?',
    options: [
      { id: 'a', text: 'C₁₇H₃₅COONa', feedback: 'Đây là xà phòng (muối của acid béo).' },
      { id: 'b', text: 'C₁₂H₂₅C₆H₄SO₃Na' },
      { id: 'c', text: 'C₁₅H₃₁COOK', feedback: 'Đây là xà phòng.' },
      { id: 'd', text: 'C₃H₅(OH)₃' }
    ],
    correctAnswer: 'b',
    explanation: 'Sodium dodecylbenzenesulfonate không phải muối của acid béo nhưng có tác dụng giặt rửa.'
  },
  {
    id: 'g12-l2-q2', lessonId: 'g12-l2', type: 'truefalse', difficulty: 'understand',
    objective: 'Giải thích cơ chế giặt rửa.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Phân tử xà phòng gồm đầu ưa nước và đuôi kị nước.', explanation: 'Đầu −COO⁻Na⁺, đuôi gốc hydrocarbon dài.' },
      { id: 'b', text: 'Xà phòng làm sạch vết dầu mỡ bằng cách phản ứng hóa học với dầu mỡ.', explanation: 'Xà phòng chia nhỏ, phân tán vết bẩn, không phản ứng với chúng.' },
      { id: 'c', text: 'Trong nước cứng, xà phòng tạo kết tủa với Ca²⁺, Mg²⁺.', explanation: 'Tạo muối calcium, magnesium của acid béo không tan.' },
      { id: 'd', text: 'Chất giặt rửa có mạch hydrocarbon phân nhánh dễ bị phân hủy sinh học.', explanation: 'Mạch phân nhánh khó bị vi sinh vật phân hủy.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Tác dụng giặt rửa là tác dụng bề mặt, không phải phản ứng hóa học.',
    equations: ['2C₁₇H₃₅COO⁻ + Ca²⁺ → (C₁₇H₃₅COO)₂Ca']
  },
  {
    id: 'g12-l2-q3', lessonId: 'g12-l2', type: 'multiple', difficulty: 'understand',
    objective: 'Sử dụng xà phòng và chất giặt rửa hợp lí.',
    content: 'Chọn tất cả cách sử dụng hợp lí, thân thiện với môi trường.',
    options: [
      { id: 'a', text: 'Dùng lượng chất giặt rửa vừa đủ theo hướng dẫn.' },
      { id: 'b', text: 'Ưu tiên sản phẩm dễ phân hủy sinh học.' },
      { id: 'c', text: 'Thải trực tiếp nước giặt đậm đặc ra ao hồ.', feedback: 'Gây ô nhiễm nguồn nước.' },
      { id: 'd', text: 'Dùng thật nhiều xà phòng để sạch hơn.', feedback: 'Lãng phí và tăng ô nhiễm, không sạch hơn đáng kể.' },
      { id: 'e', text: 'Đeo găng tay khi dùng chất tẩy rửa mạnh.' }
    ],
    correctAnswer: ['a', 'b', 'e'],
    explanation: 'Dùng đúng liều lượng, chọn sản phẩm phân hủy sinh học và bảo vệ da tay.'
  },
  {
    id: 'g12-l2-q4', lessonId: 'g12-l2', type: 'short', difficulty: 'apply',
    objective: 'Gọi tên thành phần chính của xà phòng.',
    content: 'Gọi tên muối C₁₇H₃₅COONa.',
    correctAnswer: { accepted: ['sodium stearate', 'natri stearat'], compact: true },
    explanation: 'Muối sodium của stearic acid.'
  },
  {
    id: 'g12-l2-q5', lessonId: 'g12-l2', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng xà phòng thu được từ chất béo.',
    content: 'Xà phòng hóa hoàn toàn 178 kg tristearin bằng NaOH. Tính khối lượng sodium stearate thu được.',
    correctAnswer: { value: 183.6, unit: 'kg', tolerance: 0.02 },
    verify: () => 178 / molarMass(TRISTEARIN) * 3 * molarMass('C18H35O2Na'),
    solution: ['n(tristearin) = 178 / 890 = 0,2 kmol ⇒ n(C₁₇H₃₅COONa) = 0,6 kmol.', 'm = 0,6 × 306 = 183,6 kg.'],
    explanation: 'Mỗi mol chất béo tạo 3 mol muối của acid béo.'
  },
  {
    id: 'g12-l2-q6', lessonId: 'g12-l2', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng NaOH cần cho xà phòng hóa.',
    content: 'Tính khối lượng NaOH cần để xà phòng hóa hoàn toàn 8,9 kg tristearin.',
    correctAnswer: { value: 1.2, unit: 'kg', tolerance: 0.02 },
    verify: () => 8.9 / molarMass(TRISTEARIN) * 3 * molarMass('NaOH'),
    solution: ['n(tristearin) = 8,9 / 890 = 0,01 kmol ⇒ n(NaOH) = 0,03 kmol.', 'm(NaOH) = 0,03 × 40 = 1,2 kg.'],
    explanation: 'n(NaOH) = 3n(chất béo).'
  },
  {
    id: 'g12-l2-q7', lessonId: 'g12-l2', type: 'single', difficulty: 'advanced',
    objective: 'Giải thích vì sao thêm NaCl khi sản xuất xà phòng.',
    content: 'Sau khi xà phòng hóa chất béo, người ta thêm NaCl bão hòa vào hỗn hợp nhằm',
    options: [
      { id: 'a', text: 'làm tăng tốc độ phản ứng xà phòng hóa' },
      { id: 'b', text: 'làm giảm độ tan của xà phòng để tách xà phòng nổi lên' },
      { id: 'c', text: 'trung hòa NaOH dư' },
      { id: 'd', text: 'tạo mùi thơm cho xà phòng' }
    ],
    correctAnswer: 'b',
    explanation: 'Muối của acid béo ít tan trong dung dịch NaCl bão hòa nên tách ra, nổi lên trên.'
  },

  /* ----- Bài 3. Ôn tập chương 1 ----- */
  {
    id: 'g12-l3-q1', lessonId: 'g12-l3', type: 'numeric', difficulty: 'apply',
    objective: 'Xác định số nguyên tử C của ester từ phản ứng xà phòng hóa.',
    content: 'Xà phòng hóa hoàn toàn 8,8 g một ester no, đơn chức, mạch hở cần vừa đủ 0,1 mol NaOH. Phân tử ester có bao nhiêu nguyên tử carbon?',
    correctAnswer: { value: 4 },
    verify: () => (8.8 / 0.1 - 32) / 14,
    solution: ['M(ester) = 8,8 / 0,1 = 88.', 'CₙH₂ₙO₂: 14n + 32 = 88 ⇒ n = 4 (C₄H₈O₂).'],
    explanation: 'Ester đơn chức: n(ester) = n(NaOH).'
  },
  {
    id: 'g12-l3-q2', lessonId: 'g12-l3', type: 'numeric', difficulty: 'advanced',
    objective: 'Dùng bảo toàn khối lượng khi xà phòng hóa chất béo.',
    content: 'Xà phòng hóa hoàn toàn 8,58 g một chất béo cần vừa đủ 0,03 mol NaOH. Tính khối lượng muối thu được.',
    correctAnswer: { value: 8.86, unit: 'g', tolerance: 0.02 },
    verify: () => 8.58 + 0.03 * molarMass('NaOH') - 0.03 / 3 * molarMass('C3H8O3'),
    solution: ['n(glycerol) = 0,03 / 3 = 0,01 mol ⇒ m = 0,92 g; m(NaOH) = 1,2 g.', 'm(muối) = 8,58 + 1,2 − 0,92 = 8,86 g.'],
    explanation: 'Bảo toàn khối lượng: m(chất béo) + m(NaOH) = m(muối) + m(glycerol).'
  },
  {
    id: 'g12-l3-q3', lessonId: 'g12-l3', type: 'single', difficulty: 'understand',
    objective: 'Xác định sản phẩm thủy phân ester.',
    content: 'Thủy phân CH₃COOCH₃ trong dung dịch NaOH, đun nóng, thu được',
    options: [
      { id: 'a', text: 'CH₃COONa và CH₃OH' },
      { id: 'b', text: 'HCOONa và C₂H₅OH' },
      { id: 'c', text: 'CH₃COOH và CH₃ONa' },
      { id: 'd', text: 'CH₃COONa và C₂H₅OH' }
    ],
    correctAnswer: 'a',
    explanation: 'Gốc acid tạo muối, gốc R′ tạo alcohol.',
    equations: ['CH₃COOCH₃ + NaOH → CH₃COONa + CH₃OH']
  },
  {
    id: 'g12-l3-q4', lessonId: 'g12-l3', type: 'multiple', difficulty: 'understand',
    objective: 'Hệ thống tính chất của chất béo.',
    content: 'Chọn tất cả phát biểu đúng về chất béo.',
    options: [
      { id: 'a', text: 'Không tan trong nước, nhẹ hơn nước.' },
      { id: 'b', text: 'Bị thủy phân trong môi trường kiềm tạo glycerol.' },
      { id: 'c', text: 'Chất béo lỏng có thể chuyển thành chất béo rắn bằng phản ứng cộng H₂.' },
      { id: 'd', text: 'Là ester của ethanol với acid béo.', feedback: 'Chất béo là triester của glycerol.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Chất béo là triglyceride: kị nước, bị xà phòng hóa, hydrogen hóa được nếu có gốc không no.'
  },
  {
    id: 'g12-l3-q5', lessonId: 'g12-l3', type: 'truefalse', difficulty: 'apply',
    objective: 'Vận dụng tỉ lệ mol trong phản ứng xà phòng hóa.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Xà phòng hóa 1 mol tristearin cần 3 mol NaOH.', explanation: 'Chất béo có 3 nhóm ester.' },
      { id: 'b', text: 'Xà phòng hóa 1 mol tristearin tạo 3 mol glycerol.', explanation: 'Chỉ tạo 1 mol glycerol và 3 mol muối.' },
      { id: 'c', text: 'Xà phòng hóa 1 mol ethyl acetate cần 1 mol NaOH.', explanation: 'Ester đơn chức của alcohol.' },
      { id: 'd', text: 'Thủy phân ester trong acid luôn thu được muối.', explanation: 'Trong acid thu được carboxylic acid và alcohol.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Chất béo : NaOH : glycerol = 1 : 3 : 1.'
  },
  {
    id: 'g12-l3-q6', lessonId: 'g12-l3', type: 'short', difficulty: 'apply',
    objective: 'Xác định ester từ công thức phân tử và sản phẩm thủy phân.',
    content: 'Ester X có công thức C₃H₆O₂, khi thủy phân trong NaOH tạo muối sodium formate (HCOONa). Gọi tên X.',
    correctAnswer: { accepted: ['ethyl formate', 'ethyl methanoate'], compact: true },
    explanation: 'HCOO− kết hợp gốc C₂H₅ ⇒ HCOOC₂H₅ (ethyl formate).',
    equations: ['HCOOC₂H₅ + NaOH → HCOONa + C₂H₅OH']
  },
  {
    id: 'g12-l3-q7', lessonId: 'g12-l3', type: 'single', difficulty: 'advanced',
    objective: 'Đếm đồng phân ester.',
    content: 'Số ester đồng phân cấu tạo có công thức phân tử C₃H₆O₂ là',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '2' },
      { id: 'c', text: '3' },
      { id: 'd', text: '4' }
    ],
    correctAnswer: 'b',
    explanation: 'HCOOC₂H₅ (ethyl formate) và CH₃COOCH₃ (methyl acetate).'
  }
]
