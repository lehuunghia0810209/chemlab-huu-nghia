// Hóa học 12 · Chương 8 — Kim loại chuyển tiếp dãy thứ nhất và phức chất. Questions for Bài 27–30.
import { molarMass } from '../chemMath.js'

export const questions = [
  /* ----- Bài 27. Đại cương về kim loại chuyển tiếp dãy thứ nhất ----- */
  {
    id: 'g12-l27-q1', lessonId: 'g12-l27', type: 'single', difficulty: 'recognize',
    objective: 'Viết cấu hình electron của kim loại chuyển tiếp.',
    content: 'Cấu hình electron của Cu (Z = 29) là',
    options: [
      { id: 'a', text: '[Ar]3d⁹4s²', feedback: 'Phân lớp 3d bão hòa (3d¹⁰) bền hơn.' },
      { id: 'b', text: '[Ar]3d¹⁰4s¹' },
      { id: 'c', text: '[Ar]3d¹⁰4s²' },
      { id: 'd', text: '[Ar]4s²4p⁹' }
    ],
    correctAnswer: 'b',
    explanation: 'Cu có cấu hình đặc biệt [Ar]3d¹⁰4s¹.'
  },
  {
    id: 'g12-l27-q2', lessonId: 'g12-l27', type: 'truefalse', difficulty: 'understand',
    objective: 'Nêu tính chất của kim loại chuyển tiếp dãy thứ nhất.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Kim loại chuyển tiếp thường có nhiều số oxi hóa.', explanation: 'Cả electron 4s và 3d tham gia liên kết.' },
      { id: 'b', text: 'Kim loại chuyển tiếp dãy thứ nhất thường mềm hơn kim loại kiềm.', explanation: 'Chúng cứng hơn nhiều.' },
      { id: 'c', text: 'Dung dịch chứa ion Fe³⁺ có màu vàng nâu.', explanation: 'Đúng.' },
      { id: 'd', text: 'Ion MnO₄⁻ có màu tím.', explanation: 'Đúng.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: true },
    explanation: 'Kim loại chuyển tiếp cứng, nhiệt độ nóng chảy cao, ion thường có màu.'
  },
  {
    id: 'g12-l27-q3', lessonId: 'g12-l27', type: 'multiple', difficulty: 'understand',
    objective: 'Nhận biết ion kim loại chuyển tiếp bằng dung dịch kiềm.',
    content: 'Nhỏ dung dịch NaOH vào các dung dịch. Chọn tất cả cặp “ion – màu kết tủa” đúng.',
    options: [
      { id: 'a', text: 'Fe³⁺ – nâu đỏ' },
      { id: 'b', text: 'Cu²⁺ – xanh' },
      { id: 'c', text: 'Fe²⁺ – trắng xanh' },
      { id: 'd', text: 'Fe²⁺ – vàng', feedback: 'Fe(OH)₂ màu trắng xanh.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Fe(OH)₃ nâu đỏ, Cu(OH)₂ xanh, Fe(OH)₂ trắng xanh.',
    equations: ['Fe³⁺ + 3OH⁻ → Fe(OH)₃']
  },
  {
    id: 'g12-l27-q4', lessonId: 'g12-l27', type: 'numeric', difficulty: 'apply',
    objective: 'Tính nồng độ Fe²⁺ bằng chuẩn độ với KMnO₄.',
    content: 'Chuẩn độ 25,0 mL dung dịch FeSO₄ (môi trường acid) cần vừa đủ 12,5 mL dung dịch KMnO₄ 0,02 M. Tính nồng độ mol của FeSO₄.',
    correctAnswer: { value: 0.05, unit: 'M', tolerance: 0.0005 },
    verify: () => 0.0125 * 0.02 * 5 / 0.025,
    solution: ['n(MnO₄⁻) = 0,0125 × 0,02 = 2,5 × 10⁻⁴ mol ⇒ n(Fe²⁺) = 1,25 × 10⁻³ mol.', 'C = 1,25 × 10⁻³ / 0,025 = 0,05 M.'],
    explanation: 'n(Fe²⁺) = 5n(MnO₄⁻).',
    equations: ['5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O']
  },
  {
    id: 'g12-l27-q5', lessonId: 'g12-l27', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính thể tích dung dịch KMnO₄ cần cho chuẩn độ.',
    content: 'Tính thể tích dung dịch KMnO₄ 0,05 M cần để oxi hóa hết 0,01 mol Fe²⁺ trong môi trường acid.',
    correctAnswer: { value: 40, unit: 'mL', tolerance: 0.4 },
    verify: () => 0.01 / 5 / 0.05 * 1000,
    solution: ['n(MnO₄⁻) = 0,01 / 5 = 0,002 mol.', 'V = 0,002 / 0,05 = 0,04 L = 40 mL.'],
    explanation: 'Mỗi MnO₄⁻ nhận 5 electron từ 5 ion Fe²⁺.'
  },
  {
    id: 'g12-l27-q6', lessonId: 'g12-l27', type: 'short', difficulty: 'apply',
    objective: 'Viết cấu hình electron của ion kim loại chuyển tiếp.',
    content: 'Viết cấu hình electron rút gọn của ion Fe²⁺ (Z(Fe) = 26).',
    placeholder: 'Ví dụ: [Ar]3d⁵',
    correctAnswer: { accepted: ['[Ar]3d6', '[Ar]3d⁶', 'Ar 3d6', '[Ar] 3d6'], compact: true },
    explanation: 'Fe: [Ar]3d⁶4s²; nhường 2 electron 4s ⇒ Fe²⁺: [Ar]3d⁶.'
  },

  /* ----- Bài 28. Sơ lược về phức chất ----- */
  {
    id: 'g12-l28-q1', lessonId: 'g12-l28', type: 'single', difficulty: 'recognize',
    objective: 'Xác định nguyên tử trung tâm của phức chất.',
    content: 'Nguyên tử trung tâm trong [Ag(NH₃)₂]⁺ là',
    options: [
      { id: 'a', text: 'Ag⁺' },
      { id: 'b', text: 'NH₃' },
      { id: 'c', text: 'N' },
      { id: 'd', text: 'H⁺' }
    ],
    correctAnswer: 'a',
    explanation: 'Ag⁺ nhận cặp electron từ 2 phân tử NH₃.'
  },
  {
    id: 'g12-l28-q2', lessonId: 'g12-l28', type: 'multiple', difficulty: 'understand',
    objective: 'Nhận biết chất có thể làm phối tử.',
    content: 'Chọn tất cả tiểu phân có thể đóng vai trò phối tử.',
    options: [
      { id: 'a', text: 'NH₃' },
      { id: 'b', text: 'H₂O' },
      { id: 'c', text: 'Cl⁻' },
      { id: 'd', text: 'CN⁻' },
      { id: 'e', text: 'Na⁺', feedback: 'Na⁺ không có cặp electron chưa liên kết để cho.' }
    ],
    correctAnswer: ['a', 'b', 'c', 'd'],
    explanation: 'Phối tử phải có cặp electron chưa liên kết.'
  },
  {
    id: 'g12-l28-q3', lessonId: 'g12-l28', type: 'truefalse', difficulty: 'understand',
    objective: 'Mô tả liên kết và hình học của phức chất.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Liên kết giữa phối tử và nguyên tử trung tâm là liên kết cho – nhận.', explanation: 'Đúng.' },
      { id: 'b', text: 'Phức chất có số phối trí 6 thường có dạng bát diện.', explanation: 'Đúng.' },
      { id: 'c', text: 'Phức chất luôn mang điện tích dương.', explanation: 'Có thể âm ([CuCl₄]²⁻) hoặc trung hòa.' },
      { id: 'd', text: 'Số phối trí của [Ag(NH₃)₂]⁺ là 2.', explanation: 'Hai phối tử NH₃.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'Điện tích phức tùy thuộc điện tích nguyên tử trung tâm và phối tử.'
  },
  {
    id: 'g12-l28-q4', lessonId: 'g12-l28', type: 'numeric', difficulty: 'apply',
    objective: 'Tính điện tích của phức chất.',
    content: 'Tính điện tích của phức chất tạo bởi Fe³⁺ và 6 phối tử CN⁻ (ghi số nguyên, có dấu).',
    correctAnswer: { value: -3 },
    verify: () => 3 + 6 * -1,
    solution: ['Điện tích = (+3) + 6 × (−1).', '= −3: phức chất là [Fe(CN)₆]³⁻.'],
    explanation: 'Điện tích phức = tổng điện tích các thành phần.'
  },
  {
    id: 'g12-l28-q5', lessonId: 'g12-l28', type: 'numeric', difficulty: 'advanced',
    objective: 'Xác định số phối trí.',
    content: 'Xác định số phối trí của Co trong ion phức [Co(NH₃)₄Cl₂]⁺.',
    correctAnswer: { value: 6 },
    verify: () => 4 + 2,
    solution: ['Phối tử: 4 NH₃ và 2 Cl⁻.', 'Số phối trí = 4 + 2 = 6.'],
    explanation: 'Mỗi phối tử đơn càng tạo một liên kết với nguyên tử trung tâm.'
  },
  {
    id: 'g12-l28-q6', lessonId: 'g12-l28', type: 'short', difficulty: 'apply',
    objective: 'Viết công thức phức chất tạo thành từ Cu²⁺ và NH₃.',
    content: 'Viết công thức ion phức tạo bởi Cu²⁺ và 4 phân tử NH₃.',
    placeholder: 'Ví dụ: [Ag(NH3)2]+',
    correctAnswer: { accepted: ['[Cu(NH3)4]2+', '[Cu(NH₃)₄]²⁺', 'Cu(NH3)4 2+', '[Cu(NH3)4]^2+'], compact: true },
    explanation: 'Điện tích: (+2) + 4 × 0 = +2.'
  },
  {
    id: 'g12-l28-q7', lessonId: 'g12-l28', type: 'single', difficulty: 'apply',
    objective: 'Mô tả hiện tượng tạo phức của Cu²⁺ với NH₃.',
    content: 'Nhỏ từ từ đến dư dung dịch NH₃ vào dung dịch CuSO₄. Hiện tượng là',
    options: [
      { id: 'a', text: 'kết tủa xanh xuất hiện, không tan' },
      { id: 'b', text: 'kết tủa xanh xuất hiện rồi tan, tạo dung dịch xanh lam đậm' },
      { id: 'c', text: 'kết tủa nâu đỏ' },
      { id: 'd', text: 'có khí thoát ra' }
    ],
    correctAnswer: 'b',
    explanation: 'Cu(OH)₂ tan trong NH₃ dư tạo phức chất [Cu(NH₃)₄]²⁺.',
    equations: ['Cu(OH)₂ + 4NH₃ → [Cu(NH₃)₄](OH)₂']
  },

  /* ----- Bài 29. Tính chất và ứng dụng của phức chất ----- */
  {
    id: 'g12-l29-q1', lessonId: 'g12-l29', type: 'single', difficulty: 'recognize',
    objective: 'Nhận biết phức chất aqua.',
    content: 'Màu xanh của dung dịch CuSO₄ loãng là màu của',
    options: [
      { id: 'a', text: 'ion SO₄²⁻' },
      { id: 'b', text: 'phức chất aqua [Cu(OH₂)₆]²⁺' },
      { id: 'c', text: 'phân tử H₂O' },
      { id: 'd', text: 'kết tủa Cu(OH)₂' }
    ],
    correctAnswer: 'b',
    explanation: 'Cu²⁺ trong nước tạo phức aqua màu xanh.'
  },
  {
    id: 'g12-l29-q2', lessonId: 'g12-l29', type: 'multiple', difficulty: 'understand',
    objective: 'Nêu ứng dụng của phức chất.',
    content: 'Chọn tất cả phát biểu đúng về ứng dụng của phức chất.',
    options: [
      { id: 'a', text: 'Hemoglobin vận chuyển O₂ trong máu.' },
      { id: 'b', text: 'Cisplatin dùng trong điều trị ung thư.' },
      { id: 'c', text: 'Thuốc thử Tollens chứa phức chất [Ag(NH₃)₂]⁺.' },
      { id: 'd', text: 'Chlorophyll là phức chất của Cu²⁺.', feedback: 'Chlorophyll là phức chất của Mg²⁺.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Phức chất có vai trò trong sinh học, y học và phân tích.'
  },
  {
    id: 'g12-l29-q3', lessonId: 'g12-l29', type: 'truefalse', difficulty: 'understand',
    objective: 'Mô tả phản ứng thay thế phối tử.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Thêm HCl đặc vào dung dịch CuSO₄ tạo [CuCl₄]²⁻.', explanation: 'Phối tử aqua bị thay bằng Cl⁻.' },
      { id: 'b', text: 'Phản ứng thay thế phối tử thường làm đổi màu dung dịch.', explanation: 'Đúng.' },
      { id: 'c', text: 'Fe²⁺ tạo dung dịch đỏ máu với SCN⁻.', explanation: 'Đây là phản ứng của Fe³⁺.' },
      { id: 'd', text: 'Phức aqua của kim loại chuyển tiếp thường có dạng bát diện.', explanation: 'Số phối trí 6.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'Phản ứng thay thế phối tử làm thay đổi màu sắc.',
    equations: ['[Cu(OH₂)₆]²⁺ + 4Cl⁻ → [CuCl₄]²⁻ + 6H₂O']
  },
  {
    id: 'g12-l29-q4', lessonId: 'g12-l29', type: 'short', difficulty: 'apply',
    objective: 'Chọn thuốc thử nhận biết Fe³⁺.',
    content: 'Muối nào (chứa ion SCN⁻) thường dùng để nhận biết ion Fe³⁺? (ghi công thức)',
    correctAnswer: { accepted: ['KSCN', 'NH4SCN', 'NaSCN'], compact: true },
    explanation: 'SCN⁻ tạo với Fe³⁺ phức chất màu đỏ máu.'
  },
  {
    id: 'g12-l29-q5', lessonId: 'g12-l29', type: 'numeric', difficulty: 'apply',
    objective: 'Đếm số phân tử nước bị thay thế.',
    content: 'Trong phản ứng [Cu(OH₂)₆]²⁺ + 4NH₃ → [Cu(NH₃)₄(OH₂)₂]²⁺ + xH₂O, giá trị của x là bao nhiêu?',
    correctAnswer: { value: 4 },
    verify: () => 6 - 2,
    solution: ['Ban đầu có 6 phối tử H₂O; sau phản ứng còn 2.', 'Số H₂O được giải phóng = 6 − 2 = 4.'],
    explanation: 'Mỗi NH₃ thay thế một phân tử H₂O.'
  },
  {
    id: 'g12-l29-q6', lessonId: 'g12-l29', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính khối lượng muối Fe³⁺ từ lượng phức chất.',
    content: 'Một dung dịch chứa 0,02 mol Fe³⁺ được tạo từ muối FeCl₃. Tính khối lượng FeCl₃ đã hòa tan (Fe = 56, Cl = 35,5).',
    correctAnswer: { value: 3.25, unit: 'g', tolerance: 0.02 },
    verify: () => 0.02 * molarMass('FeCl3'),
    solution: ['n(FeCl₃) = n(Fe³⁺) = 0,02 mol.', 'm = 0,02 × 162,5 = 3,25 g.'],
    explanation: 'Mỗi FeCl₃ tạo một ion Fe³⁺ (tồn tại dạng phức aqua).'
  },

  /* ----- Bài 30. Ôn tập chương 8 ----- */
  {
    id: 'g12-l30-q1', lessonId: 'g12-l30', type: 'single', difficulty: 'understand',
    objective: 'Chọn thuốc thử phân biệt ion.',
    content: 'Dùng dung dịch NH₃ dư có thể phân biệt dung dịch CuSO₄ với dung dịch nào sau đây vì hiện tượng khác nhau?',
    options: [
      { id: 'a', text: 'FeSO₄' },
      { id: 'b', text: 'Cu(NO₃)₂' },
      { id: 'c', text: 'CuCl₂' },
      { id: 'd', text: 'Không phân biệt được' }
    ],
    correctAnswer: 'a',
    explanation: 'Cu²⁺ tạo phức tan xanh lam đậm; Fe²⁺ tạo Fe(OH)₂ không tan. Các muối Cu²⁺ khác cho cùng hiện tượng.'
  },
  {
    id: 'g12-l30-q2', lessonId: 'g12-l30', type: 'multiple', difficulty: 'understand',
    objective: 'Hệ thống kiến thức kim loại chuyển tiếp và phức chất.',
    content: 'Chọn tất cả phát biểu đúng.',
    options: [
      { id: 'a', text: 'Fe³⁺ có cấu hình [Ar]3d⁵.' },
      { id: 'b', text: 'Cisplatin có số phối trí 4.' },
      { id: 'c', text: 'Fe(OH)₂ có màu trắng xanh.' },
      { id: 'd', text: 'Trong chuẩn độ, n(Fe²⁺) = n(MnO₄⁻).', feedback: 'n(Fe²⁺) = 5n(MnO₄⁻).' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Ôn tập cấu hình, phức chất và chuẩn độ.'
  },
  {
    id: 'g12-l30-q3', lessonId: 'g12-l30', type: 'truefalse', difficulty: 'apply',
    objective: 'Phân tích phức chất [Fe(CN)₆]³⁻.',
    content: 'Với phức chất [Fe(CN)₆]³⁻, chọn Đúng hoặc Sai.',
    statements: [
      { id: 'a', text: 'Nguyên tử trung tâm là Fe³⁺.', explanation: 'x − 6 = −3 ⇒ x = +3.' },
      { id: 'b', text: 'Số phối trí là 6.', explanation: 'Có 6 phối tử CN⁻.' },
      { id: 'c', text: 'Phức chất có dạng tứ diện.', explanation: 'Số phối trí 6 ⇒ bát diện.' },
      { id: 'd', text: 'Phối tử CN⁻ cho cặp electron vào Fe³⁺.', explanation: 'Liên kết cho – nhận.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'Điện tích nguyên tử trung tâm tính từ điện tích phức và phối tử.'
  },
  {
    id: 'g12-l30-q4', lessonId: 'g12-l30', type: 'numeric', difficulty: 'advanced',
    objective: 'Xác định hàm lượng sắt bằng chuẩn độ.',
    content: 'Hòa tan 1,52 g mẫu muối FeSO₄ có lẫn tạp chất trơ vào H₂SO₄ loãng; chuẩn độ cần vừa đủ 15,0 mL KMnO₄ 0,1 M. Tính phần trăm khối lượng FeSO₄ trong mẫu (Fe = 56, S = 32, O = 16).',
    correctAnswer: { value: 75, unit: '%', tolerance: 0.5 },
    verify: () => 0.015 * 0.1 * 5 * molarMass('FeSO4') / 1.52 * 100,
    solution: ['n(Fe²⁺) = 5 × 0,015 × 0,1 = 7,5 × 10⁻³ mol ⇒ m(FeSO₄) = 7,5 × 10⁻³ × 152 = 1,14 g.', '% = 1,14 / 1,52 × 100% = 75%.'],
    explanation: 'Dùng tỉ lệ 5 : 1 giữa Fe²⁺ và MnO₄⁻.'
  },
  {
    id: 'g12-l30-q5', lessonId: 'g12-l30', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng kết tủa khi nhận biết Fe³⁺ bằng NaOH.',
    content: 'Cho dung dịch chứa 0,05 mol FeCl₃ tác dụng với NaOH dư. Tính khối lượng kết tủa Fe(OH)₃ (Fe = 56, O = 16, H = 1).',
    correctAnswer: { value: 5.35, unit: 'g', tolerance: 0.02 },
    verify: () => 0.05 * molarMass('FeO3H3'),
    solution: ['n(Fe(OH)₃) = n(Fe³⁺) = 0,05 mol.', 'm = 0,05 × 107 = 5,35 g.'],
    explanation: 'Fe³⁺ + 3OH⁻ → Fe(OH)₃.',
    equations: ['Fe³⁺ + 3OH⁻ → Fe(OH)₃']
  },
  {
    id: 'g12-l30-q6', lessonId: 'g12-l30', type: 'short', difficulty: 'apply',
    objective: 'Xác định điện tích nguyên tử trung tâm.',
    content: 'Trong ion phức [Co(NH₃)₅Cl]²⁺, nguyên tử trung tâm là ion cobalt mang điện tích bao nhiêu? (ví dụ: +2)',
    correctAnswer: { accepted: ['+3', '3+', '3', 'Co3+'], compact: true },
    explanation: 'x + 5 × 0 + (−1) = +2 ⇒ x = +3.'
  }
]
