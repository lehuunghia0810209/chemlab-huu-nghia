// Hóa học 10 · Chương 3 — Liên kết hóa học. Questions for Bài 10–14.
import { molarMass } from '../chemMath.js'

export const questions = [
  /* ----- Bài 10. Quy tắc octet ----- */
  {
    id: 'g10-l10-q1',
    lessonId: 'g10-l10',
    type: 'single',
    difficulty: 'recognize',
    objective: 'Phát biểu được quy tắc octet.',
    content: 'Theo quy tắc octet, khi hình thành liên kết hóa học, nguyên tử của nguyên tố nhóm A có xu hướng',
    options: [
      { id: 'a', text: 'đạt 8 electron ở lớp ngoài cùng như khí hiếm (H: 2 electron)' },
      { id: 'b', text: 'luôn nhường hết electron lớp ngoài cùng', feedback: 'Phi kim thường nhận hoặc góp chung electron, không nhường.' },
      { id: 'c', text: 'đạt 18 electron ở lớp ngoài cùng', feedback: '18 là số electron tối đa của lớp M, không phải octet.' },
      { id: 'd', text: 'có số proton bằng số neutron', feedback: 'Quy tắc octet nói về electron lớp ngoài cùng.' }
    ],
    correctAnswer: 'a',
    explanation: 'Nguyên tử nhường, nhận hoặc góp chung electron để có cấu hình bền như khí hiếm.'
  },
  {
    id: 'g10-l10-q2',
    lessonId: 'g10-l10',
    type: 'short',
    difficulty: 'apply',
    objective: 'Viết kí hiệu ion tạo thành theo quy tắc octet.',
    content: 'Viết kí hiệu ion mà nguyên tử magnesium (Z = 12) tạo thành theo quy tắc octet. Có thể viết Mg2+.',
    correctAnswer: { accepted: ['Mg2+', 'Mg²⁺', 'Mg+2'], caseSensitive: true, compact: true },
    explanation: 'Mg (2, 8, 2) nhường 2 electron lớp ngoài cùng tạo Mg²⁺ có cấu hình giống Ne.'
  },
  {
    id: 'g10-l10-q3',
    lessonId: 'g10-l10',
    type: 'numeric',
    difficulty: 'understand',
    objective: 'Tính số electron của ion.',
    content: 'Ion Al³⁺ (aluminium có Z = 13) có bao nhiêu electron?',
    correctAnswer: { value: 10 },
    verify: () => 13 - 3,
    solution: ['Nguyên tử Al có 13 electron.', 'Al nhường 3 electron: 13 − 3 = 10 electron (cấu hình giống Ne).'],
    explanation: 'Ion dương có số electron bằng Z trừ điện tích ion.'
  },
  {
    id: 'g10-l10-q4',
    lessonId: 'g10-l10',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Vận dụng quy tắc octet và nhận biết ngoại lệ.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Ion Na⁺ có cấu hình electron giống khí hiếm Ne.', explanation: 'Na⁺ có 10 electron: 1s²2s²2p⁶.' },
      { id: 'b', text: 'Ion Cl⁻ có 17 electron.', explanation: 'Cl nhận thêm 1 electron: 17 + 1 = 18 electron.' },
      { id: 'c', text: 'Nguyên tử H đạt cấu hình bền khi có 2 electron như He.', explanation: 'Hydrogen theo quy tắc “duplet”.' },
      { id: 'd', text: 'Trong BF₃, nguyên tử B có đủ 8 electron xung quanh.', explanation: 'B chỉ có 6 electron xung quanh: một ngoại lệ của quy tắc octet.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Quy tắc octet đúng với đa số chất của nguyên tố nhóm A nhưng có ngoại lệ.'
  },
  {
    id: 'g10-l10-q5',
    lessonId: 'g10-l10',
    type: 'multiple',
    difficulty: 'apply',
    objective: 'Xác định ion có cấu hình electron giống khí hiếm.',
    content: 'Chọn tất cả ion có cấu hình electron giống argon (Z = 18).',
    options: [
      { id: 'a', text: 'K⁺ (Z = 19)' },
      { id: 'b', text: 'Ca²⁺ (Z = 20)' },
      { id: 'c', text: 'Na⁺ (Z = 11)', feedback: 'Na⁺ có 10 electron, giống Ne.' },
      { id: 'd', text: 'Cl⁻ (Z = 17)' },
      { id: 'e', text: 'O²⁻ (Z = 8)', feedback: 'O²⁻ có 10 electron, giống Ne.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'K⁺ (19 − 1), Ca²⁺ (20 − 2) và Cl⁻ (17 + 1) đều có 18 electron như Ar.'
  },
  {
    id: 'g10-l10-q6',
    lessonId: 'g10-l10',
    type: 'single',
    difficulty: 'apply',
    objective: 'Xác định số cặp electron dùng chung theo quy tắc octet.',
    content: 'Trong phân tử NH₃, nguyên tử N (Z = 7) dùng chung bao nhiêu cặp electron với các nguyên tử H?',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '2' },
      { id: 'c', text: '3' },
      { id: 'd', text: '5', feedback: '5 là số electron lớp ngoài cùng của N.' }
    ],
    correctAnswer: 'c',
    explanation: 'N có 5 electron lớp ngoài cùng, thiếu 3 để đạt octet ⇒ tạo 3 cặp dùng chung với 3 nguyên tử H và còn 1 cặp riêng.'
  },
  {
    id: 'g10-l10-q7',
    lessonId: 'g10-l10',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Đếm cặp electron riêng trong phân tử.',
    content: 'Trong phân tử Cl₂, mỗi nguyên tử Cl có bao nhiêu cặp electron riêng (chưa tham gia liên kết)?',
    correctAnswer: { value: 3 },
    verify: () => (7 - 1) / 2,
    solution: ['Cl có 7 electron lớp ngoài cùng, dùng 1 electron cho cặp chung Cl–Cl.', 'Còn 6 electron = 3 cặp electron riêng; tổng quanh mỗi Cl: 2 + 6 = 8.'],
    explanation: 'Cặp electron riêng được biểu diễn bằng các cặp chấm trong công thức Lewis.'
  },

  /* ----- Bài 11. Liên kết ion ----- */
  {
    id: 'g10-l11-q1',
    lessonId: 'g10-l11',
    type: 'single',
    difficulty: 'recognize',
    objective: 'Phân biệt cation và anion.',
    content: 'Theo định nghĩa, anion là',
    options: [
      { id: 'a', text: 'ion mang điện tích dương', feedback: 'Đó là cation.' },
      { id: 'b', text: 'ion mang điện tích âm' },
      { id: 'c', text: 'nguyên tử trung hòa về điện' },
      { id: 'd', text: 'hạt không mang điện trong hạt nhân', feedback: 'Đó là neutron.' }
    ],
    correctAnswer: 'b',
    explanation: 'Anion tạo thành khi nguyên tử (hoặc nhóm nguyên tử) nhận thêm electron, ví dụ Cl⁻, SO₄²⁻.'
  },
  {
    id: 'g10-l11-q2',
    lessonId: 'g10-l11',
    type: 'short',
    difficulty: 'apply',
    objective: 'Lập công thức hợp chất ion từ điện tích ion.',
    content: 'Viết công thức hợp chất ion tạo bởi ion Ca²⁺ và ion Cl⁻.',
    placeholder: 'Có thể viết chỉ số như chữ số thường, ví dụ Na2O.',
    correctAnswer: { accepted: ['CaCl2', 'CaCl₂'], caseSensitive: true, compact: true },
    explanation: 'Một ion Ca²⁺ (+2) cần hai ion Cl⁻ (−1) để trung hòa điện: CaCl₂.'
  },
  {
    id: 'g10-l11-q3',
    lessonId: 'g10-l11',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'Nêu tính chất chung của hợp chất ion.',
    content: 'Chọn tất cả tính chất chung của hợp chất ion.',
    options: [
      { id: 'a', text: 'Thường là chất rắn ở điều kiện thường.' },
      { id: 'b', text: 'Dẫn điện tốt ở trạng thái rắn.', feedback: 'Ở trạng thái rắn các ion bị giữ cố định nên không dẫn điện.' },
      { id: 'c', text: 'Có nhiệt độ nóng chảy cao.' },
      { id: 'd', text: 'Dẫn điện khi nóng chảy hoặc khi tan trong nước.' },
      { id: 'e', text: 'Thường là chất khí ở điều kiện thường.', feedback: 'Lực hút giữa các ion rất mạnh nên hợp chất ion thường là chất rắn.' }
    ],
    correctAnswer: ['a', 'c', 'd'],
    explanation: 'Lực hút tĩnh điện mạnh giữa các ion tạo mạng tinh thể bền; ion chỉ di chuyển được khi nóng chảy hoặc tan.'
  },
  {
    id: 'g10-l11-q4',
    lessonId: 'g10-l11',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Mô tả liên kết ion và tinh thể NaCl.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Trong tinh thể NaCl, mỗi ion Na⁺ được bao quanh bởi 6 ion Cl⁻ gần nhất.', explanation: 'Và ngược lại, mỗi Cl⁻ được bao quanh bởi 6 Na⁺.' },
      { id: 'b', text: 'NH₄⁺ là ion đa nguyên tử.', explanation: 'Gồm 1 nguyên tử N và 4 nguyên tử H.' },
      { id: 'c', text: 'Liên kết ion được hình thành bởi cặp electron dùng chung.', explanation: 'Liên kết ion là lực hút tĩnh điện giữa các ion trái dấu.' },
      { id: 'd', text: 'Tinh thể NaCl gồm các phân tử NaCl riêng biệt.', explanation: 'Tinh thể gồm các ion; NaCl chỉ biểu thị tỉ lệ 1 : 1.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: false },
    explanation: 'Hợp chất ion tồn tại dưới dạng mạng tinh thể ion.'
  },
  {
    id: 'g10-l11-q5',
    lessonId: 'g10-l11',
    type: 'numeric',
    difficulty: 'understand',
    objective: 'Đọc công thức hợp chất ion có ion đa nguyên tử.',
    content: 'Một đơn vị công thức Al₂(SO₄)₃ chứa tổng cộng bao nhiêu ion (cation và anion)?',
    correctAnswer: { value: 5 },
    verify: () => 2 + 3,
    solution: ['Al₂(SO₄)₃ gồm 2 ion Al³⁺ và 3 ion SO₄²⁻.', 'Tổng: 2 + 3 = 5 ion; điện tích 2 × (+3) + 3 × (−2) = 0.'],
    explanation: 'Mỗi nhóm SO₄ trong ngoặc là một ion đa nguyên tử.'
  },
  {
    id: 'g10-l11-q6',
    lessonId: 'g10-l11',
    type: 'single',
    difficulty: 'apply',
    objective: 'Lập công thức hợp chất ion có ion đa nguyên tử.',
    content: 'Công thức hợp chất tạo bởi ion Al³⁺ và ion SO₄²⁻ là',
    options: [
      { id: 'a', text: 'AlSO₄', feedback: 'Điện tích +3 và −2 chưa trung hòa.' },
      { id: 'b', text: 'Al₃(SO₄)₂', feedback: '3 × (+3) + 2 × (−2) = +5, chưa trung hòa.' },
      { id: 'c', text: 'Al₂(SO₄)₃' },
      { id: 'd', text: 'Al₂SO₄₃', feedback: 'Ion đa nguyên tử lặp lại phải đặt trong ngoặc đơn.' }
    ],
    correctAnswer: 'c',
    explanation: '2 × (+3) = 3 × (−2) ⇒ 2 Al³⁺ và 3 SO₄²⁻: Al₂(SO₄)₃.'
  },
  {
    id: 'g10-l11-q7',
    lessonId: 'g10-l11',
    type: 'numeric',
    difficulty: 'advanced',
    objective: 'Tính lượng hợp chất ion tạo thành từ phương trình phản ứng.',
    content: 'Đốt 4,6 g sodium trong khí chlorine dư. Tính khối lượng NaCl thu được (Na = 23, Cl = 35,5).',
    correctAnswer: { value: 11.7, unit: 'g', tolerance: 0.05 },
    verify: () => 4.6 / 23 * molarMass('NaCl'),
    solution: [
      '2Na + Cl₂ → 2NaCl.',
      'n(Na) = 4,6 / 23 = 0,2 mol ⇒ n(NaCl) = n(Na) = 0,2 mol.',
      'm(NaCl) = 0,2 × 58,5 = 11,7 g.'
    ],
    explanation: 'Theo phương trình, 2 mol Na tạo 2 mol NaCl (tỉ lệ 1 : 1).',
    equations: ['2Na + Cl₂ → 2NaCl']
  },

  /* ----- Bài 12. Liên kết cộng hóa trị ----- */
  {
    id: 'g10-l12-q1',
    lessonId: 'g10-l12',
    type: 'single',
    difficulty: 'recognize',
    objective: 'Nêu khái niệm liên kết cộng hóa trị.',
    content: 'Liên kết cộng hóa trị là liên kết được hình thành bởi',
    options: [
      { id: 'a', text: 'lực hút tĩnh điện giữa các ion trái dấu', feedback: 'Đó là liên kết ion.' },
      { id: 'b', text: 'một hay nhiều cặp electron dùng chung' },
      { id: 'c', text: 'lực hút giữa các phân tử', feedback: 'Đó là tương tác giữa các phân tử (van der Waals, liên kết hydrogen).' },
      { id: 'd', text: 'các electron tự do trong kim loại' }
    ],
    correctAnswer: 'b',
    explanation: 'Hai nguyên tử góp chung electron tạo cặp electron dùng chung.'
  },
  {
    id: 'g10-l12-q2',
    lessonId: 'g10-l12',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính hiệu độ âm điện của một liên kết.',
    content: 'Độ âm điện của O là 3,44 và của H là 2,20. Tính hiệu độ âm điện của liên kết O–H.',
    correctAnswer: { value: 1.24, tolerance: 0.005 },
    verify: () => 3.44 - 2.2,
    solution: ['Δχ = 3,44 − 2,20 = 1,24.', '0,4 ≤ 1,24 < 1,7 ⇒ liên kết cộng hóa trị phân cực.'],
    explanation: 'Cặp electron chung lệch về phía O, nguyên tử có độ âm điện lớn hơn.'
  },
  {
    id: 'g10-l12-q3',
    lessonId: 'g10-l12',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'Nhận biết phân tử có liên kết cộng hóa trị phân cực.',
    content: 'Chọn tất cả phân tử có liên kết cộng hóa trị phân cực.',
    options: [
      { id: 'a', text: 'HCl' },
      { id: 'b', text: 'H₂O' },
      { id: 'c', text: 'Cl₂', feedback: 'Hai nguyên tử giống nhau: Δχ = 0, không phân cực.' },
      { id: 'd', text: 'NH₃' },
      { id: 'e', text: 'O₂', feedback: 'Hai nguyên tử giống nhau: không phân cực.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'H–Cl (0,96), O–H (1,24), N–H (0,84) đều có 0,4 ≤ Δχ < 1,7.'
  },
  {
    id: 'g10-l12-q4',
    lessonId: 'g10-l12',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Phân biệt liên kết σ, π, liên kết cho – nhận và năng lượng liên kết.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Liên kết ba gồm 1 liên kết σ và 2 liên kết π.', explanation: 'Ví dụ N≡N.' },
      { id: 'b', text: 'Liên kết σ kém bền hơn liên kết π.', explanation: 'Xen phủ trục (σ) lớn hơn xen phủ bên (π) nên σ bền hơn.' },
      { id: 'c', text: 'Ion NH₄⁺ có một liên kết được hình thành theo kiểu cho – nhận.', explanation: 'N dùng cặp electron riêng liên kết với H⁺.' },
      { id: 'd', text: 'Năng lượng liên kết càng lớn thì liên kết càng kém bền.', explanation: 'Năng lượng liên kết càng lớn thì liên kết càng bền.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Mọi liên kết bội chỉ có một liên kết σ; năng lượng liên kết đo độ bền liên kết.'
  },
  {
    id: 'g10-l12-q5',
    lessonId: 'g10-l12',
    type: 'numeric',
    difficulty: 'understand',
    objective: 'Đếm số liên kết σ trong phân tử.',
    content: 'Phân tử ethylene C₂H₄ (H₂C=CH₂) có bao nhiêu liên kết σ?',
    correctAnswer: { value: 5 },
    verify: () => 4 + 1,
    solution: ['4 liên kết đơn C–H: 4σ.', 'Liên kết đôi C=C: 1σ + 1π.', 'Tổng: 5 liên kết σ (và 1 liên kết π).'],
    explanation: 'Mỗi liên kết giữa hai nguyên tử có đúng một liên kết σ.'
  },
  {
    id: 'g10-l12-q6',
    lessonId: 'g10-l12',
    type: 'short',
    difficulty: 'understand',
    objective: 'Gọi tên loại liên kết trong phân tử đơn chất.',
    content: 'Liên kết trong phân tử Cl₂ thuộc loại liên kết gì? (ghi đầy đủ tên loại liên kết)',
    correctAnswer: { accepted: ['cộng hóa trị không phân cực', 'liên kết cộng hóa trị không phân cực', 'cộng hóa trị không cực', 'liên kết cộng hóa trị không cực'] },
    explanation: 'Hai nguyên tử Cl giống nhau (Δχ = 0) nên cặp electron chung không bị lệch.'
  },
  {
    id: 'g10-l12-q7',
    lessonId: 'g10-l12',
    type: 'single',
    difficulty: 'advanced',
    objective: 'So sánh số liên kết σ và π trong các phân tử.',
    content: 'Phân tử nào có số liên kết π bằng số liên kết σ?',
    options: [
      { id: 'a', text: 'CO₂ (O=C=O)' },
      { id: 'b', text: 'N₂ (N≡N)', feedback: 'N₂ có 1σ và 2π.' },
      { id: 'c', text: 'C₂H₄ (H₂C=CH₂)', feedback: 'C₂H₄ có 5σ và 1π.' },
      { id: 'd', text: 'H₂O (H–O–H)', feedback: 'H₂O chỉ có 2 liên kết σ.' }
    ],
    correctAnswer: 'a',
    explanation: 'CO₂ có 2 liên kết đôi, mỗi liên kết đôi gồm 1σ + 1π ⇒ 2σ và 2π.'
  },

  /* ----- Bài 13. Liên kết hydrogen và tương tác van der Waals ----- */
  {
    id: 'g10-l13-q1',
    lessonId: 'g10-l13',
    type: 'single',
    difficulty: 'recognize',
    objective: 'Nêu điều kiện hình thành liên kết hydrogen.',
    content: 'Liên kết hydrogen được hình thành khi nguyên tử H liên kết trực tiếp với nguyên tử',
    options: [
      { id: 'a', text: 'C, S hoặc P', feedback: 'Độ âm điện của C, S, P không đủ lớn.' },
      { id: 'b', text: 'F, O hoặc N' },
      { id: 'c', text: 'Na, K hoặc Ca', feedback: 'Kim loại kiềm tạo hợp chất ion với hydrogen (hydride), không tạo liên kết hydrogen.' },
      { id: 'd', text: 'bất kì phi kim nào' }
    ],
    correctAnswer: 'b',
    explanation: 'F, O, N có độ âm điện lớn, kích thước nhỏ và còn cặp electron riêng.'
  },
  {
    id: 'g10-l13-q2',
    lessonId: 'g10-l13',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'Nhận biết chất có liên kết hydrogen giữa các phân tử.',
    content: 'Chọn tất cả chất có liên kết hydrogen giữa các phân tử.',
    options: [
      { id: 'a', text: 'H₂O' },
      { id: 'b', text: 'HF' },
      { id: 'c', text: 'CH₄', feedback: 'H liên kết với C, không tạo liên kết hydrogen.' },
      { id: 'd', text: 'NH₃' },
      { id: 'e', text: 'H₂S', feedback: 'Độ âm điện của S không đủ lớn để tạo liên kết hydrogen đáng kể.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'H₂O (O–H), HF (F–H), NH₃ (N–H) đều có H gắn với F, O hoặc N.'
  },
  {
    id: 'g10-l13-q3',
    lessonId: 'g10-l13',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Giải thích ảnh hưởng của liên kết hydrogen và van der Waals.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Nước đá có khối lượng riêng nhỏ hơn nước lỏng.', explanation: 'Liên kết hydrogen tạo mạng tinh thể nhiều khoảng trống.' },
      { id: 'b', text: 'Liên kết hydrogen mạnh hơn liên kết cộng hóa trị.', explanation: 'Liên kết hydrogen yếu hơn nhiều so với liên kết cộng hóa trị.' },
      { id: 'c', text: 'Tương tác van der Waals nhìn chung tăng khi khối lượng phân tử tăng.', explanation: 'Phân tử lớn có nhiều electron, dễ tạo lưỡng cực tạm thời.' },
      { id: 'd', text: 'Iodine (I₂) là chất rắn ở điều kiện thường.', explanation: 'I₂ có khối lượng phân tử lớn nhất trong các halogen thường gặp.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: true },
    explanation: 'Độ mạnh: liên kết cộng hóa trị > liên kết hydrogen > van der Waals.'
  },
  {
    id: 'g10-l13-q4',
    lessonId: 'g10-l13',
    type: 'short',
    difficulty: 'apply',
    objective: 'So sánh nhiệt độ sôi dựa vào tương tác van der Waals.',
    content: 'Trong các chất F₂, Cl₂, Br₂, I₂, chất nào có nhiệt độ sôi cao nhất? (ghi công thức)',
    correctAnswer: { accepted: ['I2', 'I₂'], caseSensitive: true, compact: true },
    explanation: 'I₂ có khối lượng phân tử lớn nhất (254 g/mol) nên tương tác van der Waals mạnh nhất; I₂ sôi ở khoảng 184 °C.'
  },
  {
    id: 'g10-l13-q5',
    lessonId: 'g10-l13',
    type: 'numeric',
    difficulty: 'understand',
    objective: 'Đọc và so sánh số liệu nhiệt độ sôi.',
    content: 'Nước sôi ở 100 °C, hydrogen sulfide sôi ở khoảng −60 °C (ở 1 atm). Nhiệt độ sôi của nước cao hơn bao nhiêu độ C?',
    correctAnswer: { value: 160, unit: '°C', units: { '°C': 1 } },
    verify: () => 100 - (-60),
    solution: ['Chênh lệch = 100 − (−60).', '= 160 °C.'],
    explanation: 'Chênh lệch lớn do giữa các phân tử H₂O có liên kết hydrogen, còn H₂S thì không đáng kể.'
  },
  {
    id: 'g10-l13-q6',
    lessonId: 'g10-l13',
    type: 'single',
    difficulty: 'understand',
    objective: 'Giải thích nhiệt độ sôi cao bất thường của HF.',
    content: 'HF có nhiệt độ sôi cao hơn HCl, HBr, HI chủ yếu vì',
    options: [
      { id: 'a', text: 'HF có khối lượng phân tử lớn nhất', feedback: 'HF có khối lượng phân tử nhỏ nhất (20 g/mol).' },
      { id: 'b', text: 'giữa các phân tử HF có liên kết hydrogen' },
      { id: 'c', text: 'HF là hợp chất ion' },
      { id: 'd', text: 'liên kết H–F kém bền' }
    ],
    correctAnswer: 'b',
    explanation: 'F có độ âm điện lớn nhất và kích thước nhỏ nên tạo liên kết hydrogen F–H···F mạnh.'
  },
  {
    id: 'g10-l13-q7',
    lessonId: 'g10-l13',
    type: 'single',
    difficulty: 'apply',
    objective: 'Sắp xếp nhiệt độ sôi của các hydrogen halide.',
    content: 'Dãy nào sắp xếp đúng theo chiều nhiệt độ sôi tăng dần?',
    options: [
      { id: 'a', text: 'HF < HCl < HBr < HI', feedback: 'HF có liên kết hydrogen nên sôi cao nhất, không thấp nhất.' },
      { id: 'b', text: 'HCl < HBr < HI < HF' },
      { id: 'c', text: 'HI < HBr < HCl < HF' },
      { id: 'd', text: 'HCl < HF < HBr < HI' }
    ],
    correctAnswer: 'b',
    explanation: 'HCl (−85 °C) < HBr (−67 °C) < HI (−35 °C) theo van der Waals; HF (20 °C) cao nhất nhờ liên kết hydrogen.'
  },

  /* ----- Bài 14. Ôn tập chương 3 ----- */
  {
    id: 'g10-l14-q1',
    lessonId: 'g10-l14',
    type: 'single',
    difficulty: 'recognize',
    objective: 'Nhận biết hợp chất có liên kết ion.',
    content: 'Hợp chất nào có liên kết ion?',
    options: [
      { id: 'a', text: 'HCl' },
      { id: 'b', text: 'CO₂' },
      { id: 'c', text: 'KCl' },
      { id: 'd', text: 'NH₃' }
    ],
    correctAnswer: 'c',
    explanation: 'KCl tạo bởi kim loại kiềm K và phi kim Cl (Δχ = 3,16 − 0,82 = 2,34 ≥ 1,7).'
  },
  {
    id: 'g10-l14-q2',
    lessonId: 'g10-l14',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính hiệu độ âm điện để phân loại liên kết.',
    content: 'Độ âm điện của Mg là 1,31 và của O là 3,44. Tính hiệu độ âm điện giữa O và Mg.',
    correctAnswer: { value: 2.13, tolerance: 0.005 },
    verify: () => 3.44 - 1.31,
    solution: ['Δχ = 3,44 − 1,31 = 2,13.', 'Δχ ≥ 1,7 ⇒ MgO có liên kết ion.'],
    explanation: 'MgO gồm các ion Mg²⁺ và O²⁻.'
  },
  {
    id: 'g10-l14-q3',
    lessonId: 'g10-l14',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Tổng hợp kiến thức về liên kết và tính chất.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Trong MgO, cả Mg²⁺ và O²⁻ đều có cấu hình electron giống Ne.', explanation: 'Cả hai ion đều có 10 electron.' },
      { id: 'b', text: 'Phân tử CO₂ có 2 liên kết π.', explanation: 'Hai liên kết đôi C=O, mỗi liên kết có 1π.' },
      { id: 'c', text: 'Giữa các phân tử CH₄ có liên kết hydrogen.', explanation: 'H gắn với C nên không tạo liên kết hydrogen; chỉ có van der Waals.' },
      { id: 'd', text: 'Nhiệt độ nóng chảy của NaCl cao hơn nhiệt độ sôi của nước.', explanation: 'NaCl nóng chảy ở 801 °C, nước sôi ở 100 °C.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'Liên kết ion trong mạng tinh thể mạnh hơn nhiều so với lực giữa các phân tử.'
  },
  {
    id: 'g10-l14-q4',
    lessonId: 'g10-l14',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'Phân loại các chất theo loại liên kết.',
    content: 'Chọn tất cả chất có liên kết ion.',
    options: [
      { id: 'a', text: 'NaF' },
      { id: 'b', text: 'K₂O' },
      { id: 'c', text: 'CO₂', feedback: 'C và O đều là phi kim; liên kết C=O là cộng hóa trị phân cực.' },
      { id: 'd', text: 'CaCl₂' },
      { id: 'e', text: 'HCl', feedback: 'Δχ = 0,96: cộng hóa trị phân cực.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'NaF, K₂O, CaCl₂ đều tạo bởi kim loại điển hình và phi kim điển hình.'
  },
  {
    id: 'g10-l14-q5',
    lessonId: 'g10-l14',
    type: 'short',
    difficulty: 'apply',
    objective: 'Lập công thức hợp chất ion từ vị trí nguyên tố.',
    content: 'Viết công thức hợp chất tạo bởi aluminium (nhóm IIIA) và fluorine (nhóm VIIA).',
    placeholder: 'Có thể viết chỉ số như chữ số thường, ví dụ MgF2.',
    correctAnswer: { accepted: ['AlF3', 'AlF₃'], caseSensitive: true, compact: true },
    explanation: 'Al tạo Al³⁺, F tạo F⁻ ⇒ cần 3 ion F⁻ cho 1 ion Al³⁺: AlF₃.'
  },
  {
    id: 'g10-l14-q6',
    lessonId: 'g10-l14',
    type: 'single',
    difficulty: 'apply',
    objective: 'Dự đoán hợp chất và loại liên kết từ số hiệu nguyên tử.',
    content: 'X có Z = 12, Y có Z = 17. Hợp chất tạo bởi X và Y có công thức và loại liên kết là',
    options: [
      { id: 'a', text: 'XY, liên kết cộng hóa trị' },
      { id: 'b', text: 'XY₂, liên kết ion' },
      { id: 'c', text: 'X₂Y, liên kết ion', feedback: 'X tạo X²⁺, Y tạo Y⁻: cần 2 Y cho 1 X.' },
      { id: 'd', text: 'XY₂, liên kết cộng hóa trị không phân cực', feedback: 'Kim loại Mg và phi kim Cl tạo liên kết ion.' }
    ],
    correctAnswer: 'b',
    explanation: 'X là Mg (tạo Mg²⁺), Y là Cl (tạo Cl⁻) ⇒ MgCl₂, liên kết ion.'
  },
  {
    id: 'g10-l14-q7',
    lessonId: 'g10-l14',
    type: 'numeric',
    difficulty: 'advanced',
    objective: 'Đếm cặp electron riêng trong công thức Lewis.',
    content: 'Trong công thức Lewis của CO₂ (O=C=O), tổng số cặp electron riêng (chưa liên kết) của cả phân tử là bao nhiêu?',
    correctAnswer: { value: 4 },
    verify: () => 2 * ((6 - 2) / 2),
    solution: [
      'Mỗi O có 6 electron lớp ngoài cùng, dùng 2 electron cho liên kết đôi với C ⇒ còn 4 electron = 2 cặp riêng.',
      'C dùng cả 4 electron cho hai liên kết đôi ⇒ không có cặp riêng.',
      'Tổng: 2 + 2 + 0 = 4 cặp electron riêng.'
    ],
    explanation: 'Mỗi nguyên tử O và C trong CO₂ đều có đủ 8 electron xung quanh.'
  }
]
