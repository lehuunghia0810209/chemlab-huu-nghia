// Hóa học 10 · Chương 1 — Cấu tạo nguyên tử. Questions for Bài 1–4.
export const questions = [
  /* ----- Bài 1. Thành phần của nguyên tử ----- */
  {
    id: 'g10-l1-q1',
    lessonId: 'g10-l1',
    type: 'single',
    difficulty: 'recognize',
    objective: 'Nêu được điện tích của các hạt cơ bản.',
    content: 'Hạt mang điện tích dương trong nguyên tử là',
    options: [
      { id: 'a', text: 'electron', feedback: 'Electron mang điện tích âm (−1).' },
      { id: 'b', text: 'proton' },
      { id: 'c', text: 'neutron', feedback: 'Neutron không mang điện.' },
      { id: 'd', text: 'lớp vỏ electron', feedback: 'Lớp vỏ chứa electron nên mang điện âm.' }
    ],
    correctAnswer: 'b',
    explanation: 'Proton nằm trong hạt nhân và mang điện tích +1 (1,602 × 10⁻¹⁹ C).'
  },
  {
    id: 'g10-l1-q2',
    lessonId: 'g10-l1',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'Mô tả được đặc điểm của hạt nhân nguyên tử.',
    content: 'Chọn tất cả phát biểu đúng về hạt nhân nguyên tử.',
    options: [
      { id: 'a', text: 'Hạt nhân chứa proton và neutron.' },
      { id: 'b', text: 'Hạt nhân mang điện tích âm.', feedback: 'Hạt nhân chứa proton nên mang điện dương.' },
      { id: 'c', text: 'Hạt nhân chiếm gần như toàn bộ khối lượng nguyên tử.' },
      { id: 'd', text: 'Hạt nhân có kích thước gần bằng kích thước nguyên tử.', feedback: 'Hạt nhân nhỏ hơn nguyên tử khoảng 10⁴ – 10⁵ lần.' }
    ],
    correctAnswer: ['a', 'c'],
    explanation: 'Hạt nhân gồm proton và neutron, mang điện dương, rất nhỏ so với nguyên tử nhưng chứa gần như toàn bộ khối lượng.'
  },
  {
    id: 'g10-l1-q3',
    lessonId: 'g10-l1',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'So sánh khối lượng và điện tích của proton, neutron, electron.',
    content: 'Cho các phát biểu về các hạt cơ bản. Chọn Đúng hoặc Sai cho từng ý.',
    statements: [
      { id: 'a', text: 'Khối lượng electron nhỏ hơn khối lượng proton khoảng 1836 lần.', explanation: '1,673 × 10⁻²⁷ : 9,109 × 10⁻³¹ ≈ 1836.' },
      { id: 'b', text: 'Điện tích của proton và electron bằng nhau về độ lớn nhưng trái dấu.', explanation: 'Cùng độ lớn 1,602 × 10⁻¹⁹ C, proton dương, electron âm.' },
      { id: 'c', text: 'Neutron mang điện tích −1.', explanation: 'Neutron không mang điện.' },
      { id: 'd', text: 'Trong mọi nguyên tử, số proton bằng số neutron.', explanation: 'Số proton bằng số electron; số neutron có thể khác, ví dụ ²³Na có 11p, 12n.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: false },
    explanation: 'Proton và neutron nặng xấp xỉ 1 amu; electron rất nhẹ. Chỉ proton và electron mang điện.'
  },
  {
    id: 'g10-l1-q4',
    lessonId: 'g10-l1',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tìm số hạt trong nguyên tử từ tổng số hạt và hiệu số hạt.',
    content: 'Nguyên tử X có tổng số hạt proton, neutron, electron là 34; số hạt mang điện nhiều hơn số hạt không mang điện là 10. Số proton của X là bao nhiêu?',
    correctAnswer: { value: 11 },
    verify: () => (34 + 10) / 4,
    solution: [
      'Số e = số p nên: 2p + n = 34 và 2p − n = 10.',
      'Cộng hai phương trình: 4p = 44 ⇒ p = 11 (n = 12, X là sodium).'
    ],
    explanation: 'Hạt mang điện gồm proton và electron (2p), hạt không mang điện là neutron.'
  },
  {
    id: 'g10-l1-q5',
    lessonId: 'g10-l1',
    type: 'numeric',
    difficulty: 'understand',
    objective: 'Tính gần đúng khối lượng nguyên tử theo amu.',
    content: 'Nguyên tử aluminium có 13 proton và 14 neutron. Khối lượng gần đúng của nguyên tử này là bao nhiêu amu?',
    correctAnswer: { value: 27, unit: 'amu' },
    verify: () => 13 + 14,
    solution: [
      'Proton và neutron đều nặng ≈ 1 amu; electron rất nhẹ nên bỏ qua.',
      'm ≈ 13 + 14 = 27 amu.'
    ],
    explanation: 'Khối lượng nguyên tử ≈ số proton + số neutron (tính theo amu).'
  },
  {
    id: 'g10-l1-q6',
    lessonId: 'g10-l1',
    type: 'short',
    difficulty: 'recognize',
    objective: 'Gọi tên được hạt không mang điện trong hạt nhân.',
    content: 'Hạt không mang điện nằm trong hạt nhân nguyên tử có tên là gì?',
    correctAnswer: { accepted: ['neutron', 'nơtron', 'notron', 'hạt neutron'] },
    explanation: 'Neutron (n) không mang điện, nặng xấp xỉ proton, được J. Chadwick phát hiện năm 1932.'
  },
  {
    id: 'g10-l1-q7',
    lessonId: 'g10-l1',
    type: 'numeric',
    difficulty: 'advanced',
    objective: 'So sánh kích thước hạt nhân với kích thước nguyên tử.',
    content: 'Một nguyên tử có đường kính khoảng 10⁻¹⁰ m, hạt nhân của nó có đường kính khoảng 10⁻¹⁴ m. Đường kính nguyên tử lớn gấp bao nhiêu lần đường kính hạt nhân?',
    correctAnswer: { value: 10000, display: '10 000' },
    verify: () => 1e-10 / 1e-14,
    solution: [
      'Tỉ số = 10⁻¹⁰ : 10⁻¹⁴ = 10⁻¹⁰⁺¹⁴ = 10⁴.',
      'Vậy nguyên tử lớn gấp 10 000 lần hạt nhân. Có thể nhập 10000 hoặc 1e4.'
    ],
    explanation: 'Phần lớn thể tích nguyên tử là không gian của lớp vỏ electron.'
  },

  /* ----- Bài 2. Nguyên tố hóa học ----- */
  {
    id: 'g10-l2-q1',
    lessonId: 'g10-l2',
    type: 'single',
    difficulty: 'recognize',
    objective: 'Nêu được công thức tính số khối.',
    content: 'Số khối A của một nguyên tử bằng',
    options: [
      { id: 'a', text: 'số proton + số electron', feedback: 'Electron không nằm trong hạt nhân và rất nhẹ.' },
      { id: 'b', text: 'số proton + số neutron' },
      { id: 'c', text: 'số neutron − số proton', feedback: 'Đây là cách sai; N = A − Z, không phải A.' },
      { id: 'd', text: 'nguyên tử khối trung bình', feedback: 'Nguyên tử khối trung bình thường không là số nguyên, còn A luôn là số nguyên.' }
    ],
    correctAnswer: 'b',
    explanation: 'A = Z + N, tức tổng số proton và neutron trong hạt nhân.'
  },
  {
    id: 'g10-l2-q2',
    lessonId: 'g10-l2',
    type: 'numeric',
    difficulty: 'understand',
    objective: 'Đọc kí hiệu nguyên tử để tìm số neutron.',
    content: 'Nguyên tử ⁶⁵₃₀Zn có bao nhiêu neutron?',
    correctAnswer: { value: 35 },
    verify: () => 65 - 30,
    solution: ['A = 65, Z = 30.', 'N = A − Z = 65 − 30 = 35.'],
    explanation: 'Số ghi phía trên là số khối A, số ghi phía dưới là số hiệu nguyên tử Z.'
  },
  {
    id: 'g10-l2-q3',
    lessonId: 'g10-l2',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'Nhận biết các nguyên tử là đồng vị của nhau.',
    content: 'Chọn tất cả các cặp nguyên tử là đồng vị của nhau.',
    options: [
      { id: 'a', text: '¹²₆C và ¹³₆C' },
      { id: 'b', text: '⁴⁰₁₈Ar và ⁴⁰₁₉K', feedback: 'Cùng số khối nhưng khác số proton nên là hai nguyên tố khác nhau.' },
      { id: 'c', text: '³⁵₁₇Cl và ³⁷₁₇Cl' },
      { id: 'd', text: '¹₁H và ²₁H' }
    ],
    correctAnswer: ['a', 'c', 'd'],
    explanation: 'Đồng vị là các nguyên tử cùng số proton (cùng Z) nhưng khác số neutron.'
  },
  {
    id: 'g10-l2-q4',
    lessonId: 'g10-l2',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính nguyên tử khối trung bình từ thành phần đồng vị.',
    content: 'Chlorine gồm 75% ³⁵Cl và 25% ³⁷Cl (theo số nguyên tử). Tính nguyên tử khối trung bình của chlorine.',
    correctAnswer: { value: 35.5, tolerance: 0.01 },
    verify: () => (35 * 75 + 37 * 25) / 100,
    solution: ['Ā = (35 × 75 + 37 × 25) / 100.', 'Ā = (2625 + 925) / 100 = 35,5.'],
    explanation: 'Đây là giá trị 35,5 thường dùng trong bài tập; giá trị chính xác 35,45 tính từ khối lượng thật của đồng vị.'
  },
  {
    id: 'g10-l2-q5',
    lessonId: 'g10-l2',
    type: 'numeric',
    difficulty: 'advanced',
    objective: 'Tìm phần trăm đồng vị khi biết nguyên tử khối trung bình.',
    content: 'Gallium có hai đồng vị ⁶⁹Ga và ⁷¹Ga, nguyên tử khối trung bình là 69,72. Tính phần trăm số nguyên tử của đồng vị ⁶⁹Ga.',
    correctAnswer: { value: 64, unit: '%', tolerance: 0.1 },
    verify: () => (71 - 69.72) / 2 * 100,
    solution: [
      'Gọi % ⁶⁹Ga là x: (69x + 71(100 − x)) / 100 = 69,72.',
      '7100 − 2x = 6972 ⇒ x = 64.'
    ],
    explanation: '⁶⁹Ga chiếm 64%, ⁷¹Ga chiếm 36%. Ā gần 69 hơn nên ⁶⁹Ga chiếm phần lớn — hợp lí.'
  },
  {
    id: 'g10-l2-q6',
    lessonId: 'g10-l2',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Phân biệt nguyên tố, đồng vị và nguyên tử khối.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Nguyên tố hóa học là tập hợp các nguyên tử có cùng số khối.', explanation: 'Nguyên tố là tập hợp các nguyên tử có cùng số proton.' },
      { id: 'b', text: 'Các đồng vị của cùng một nguyên tố có cùng số electron.', explanation: 'Cùng Z nên cùng số electron (nguyên tử trung hòa).' },
      { id: 'c', text: '²H và ³H khác nhau về số neutron.', explanation: '²H có 1 neutron, ³H có 2 neutron.' },
      { id: 'd', text: 'Nguyên tử khối trung bình của một nguyên tố luôn là số nguyên.', explanation: 'Là trung bình có trọng số nên thường có phần thập phân, ví dụ Cl = 35,45.' }
    ],
    correctAnswer: { a: false, b: true, c: true, d: false },
    explanation: 'Z quyết định nguyên tố; đồng vị chỉ khác nhau số neutron.'
  },
  {
    id: 'g10-l2-q7',
    lessonId: 'g10-l2',
    type: 'short',
    difficulty: 'recognize',
    objective: 'Viết kí hiệu nguyên tố từ số hiệu nguyên tử.',
    content: 'Nguyên tố có số hiệu nguyên tử Z = 8 có kí hiệu hóa học là gì?',
    correctAnswer: { accepted: ['O'], caseSensitive: true, compact: true },
    explanation: 'Z = 8 là oxygen, kí hiệu O. Mọi nguyên tử có 8 proton đều là oxygen, dù có 8, 9 hay 10 neutron.'
  },

  /* ----- Bài 3. Cấu trúc lớp vỏ electron nguyên tử ----- */
  {
    id: 'g10-l3-q1',
    lessonId: 'g10-l3',
    type: 'single',
    difficulty: 'recognize',
    objective: 'Mô tả hình dạng orbital s.',
    content: 'Orbital s có dạng',
    options: [
      { id: 'a', text: 'hình cầu' },
      { id: 'b', text: 'hình số tám nổi', feedback: 'Đó là hình dạng orbital p.' },
      { id: 'c', text: 'đường tròn phẳng', feedback: 'Quỹ đạo tròn là hình ảnh của mô hình Bohr, không phải orbital.' },
      { id: 'd', text: 'hình elip', feedback: 'Orbital s đối xứng cầu quanh hạt nhân.' }
    ],
    correctAnswer: 'a',
    explanation: 'AO s đối xứng cầu; AO p gồm hai khối đối đỉnh định hướng theo trục x, y hoặc z.'
  },
  {
    id: 'g10-l3-q2',
    lessonId: 'g10-l3',
    type: 'numeric',
    difficulty: 'understand',
    objective: 'Tính số orbital trong một lớp.',
    content: 'Lớp electron thứ 3 (lớp M) có tổng cộng bao nhiêu orbital nguyên tử?',
    correctAnswer: { value: 9 },
    verify: () => 3 ** 2,
    solution: ['Lớp 3 gồm 3s (1 AO), 3p (3 AO), 3d (5 AO).', 'Tổng: 1 + 3 + 5 = 9 = n².'],
    explanation: 'Lớp n có n² orbital và chứa tối đa 2n² electron.'
  },
  {
    id: 'g10-l3-q3',
    lessonId: 'g10-l3',
    type: 'short',
    difficulty: 'apply',
    objective: 'Viết cấu hình electron của nguyên tử (Z ≤ 20).',
    content: 'Viết cấu hình electron của magnesium (Z = 12). Có thể viết số mũ như chữ số thường, ví dụ 1s2.',
    placeholder: 'Ví dụ cách nhập: 1s2 2s2 …',
    correctAnswer: { accepted: ['1s2 2s2 2p6 3s2', '[Ne]3s2', '[Ne] 3s2'], compact: true },
    explanation: '12 electron: 1s² (2) + 2s² (2) + 2p⁶ (6) + 3s² (2) = 12. Có thể viết gọn [Ne]3s².'
  },
  {
    id: 'g10-l3-q4',
    lessonId: 'g10-l3',
    type: 'single',
    difficulty: 'apply',
    objective: 'Biểu diễn electron vào ô orbital theo quy tắc Hund.',
    content: 'Nguyên tử phosphorus (Z = 15) có bao nhiêu electron độc thân?',
    options: [
      { id: 'a', text: '1', feedback: 'Có thể em đã ghép đôi electron 3p trước khi điền hết các ô.' },
      { id: 'b', text: '2' },
      { id: 'c', text: '3' },
      { id: 'd', text: '5', feedback: '5 là số electron lớp ngoài cùng (3s²3p³), không phải số electron độc thân.' }
    ],
    correctAnswer: 'c',
    explanation: 'P: 1s²2s²2p⁶3s²3p³. Theo quy tắc Hund, 3p³ là [↑][↑][↑] nên có 3 electron độc thân.'
  },
  {
    id: 'g10-l3-q5',
    lessonId: 'g10-l3',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'Dự đoán kim loại từ cấu hình electron lớp ngoài cùng.',
    content: 'Nguyên tử nào sau đây là nguyên tử của nguyên tố kim loại?',
    options: [
      { id: 'a', text: 'X: 1s² 2s² 2p⁶ 3s¹' },
      { id: 'b', text: 'Y: 1s² 2s² 2p⁶ 3s²' },
      { id: 'c', text: 'Z: 1s² 2s² 2p⁶ 3s² 3p⁴', feedback: '6 electron lớp ngoài cùng: phi kim (sulfur).' },
      { id: 'd', text: 'T: 1s² 2s² 2p⁶ 3s² 3p¹' },
      { id: 'e', text: 'Q: 1s² 2s² 2p⁶ 3s² 3p⁶', feedback: '8 electron lớp ngoài cùng: khí hiếm (argon).' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'X (Na), Y (Mg), T (Al) có 1, 2, 3 electron lớp ngoài cùng nên là kim loại.'
  },
  {
    id: 'g10-l3-q6',
    lessonId: 'g10-l3',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Vận dụng các quy tắc phân bố electron.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Phân lớp p chứa tối đa 6 electron.', explanation: 'Phân lớp p có 3 AO, mỗi AO 2 electron.' },
      { id: 'b', text: 'Phân lớp 3d được điền electron trước phân lớp 4s.', explanation: '4s có năng lượng thấp hơn 3d nên được điền trước.' },
      { id: 'c', text: 'Mỗi orbital chứa tối đa 2 electron có chiều tự quay ngược nhau.', explanation: 'Đó là nguyên lí Pauli.' },
      { id: 'd', text: 'Lớp L (n = 2) có 2 phân lớp là 2s và 2p.', explanation: 'Lớp n có n phân lớp (với n ≤ 4).' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: true },
    explanation: 'Thứ tự năng lượng: 1s 2s 2p 3s 3p 4s 3d…'
  },
  {
    id: 'g10-l3-q7',
    lessonId: 'g10-l3',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tìm số hiệu nguyên tử từ cấu hình electron.',
    content: 'Nguyên tử X có electron cuối cùng điền vào phân lớp 3p và phân lớp này có 5 electron. Số hiệu nguyên tử của X là bao nhiêu?',
    correctAnswer: { value: 17 },
    verify: () => 2 + 2 + 6 + 2 + 5,
    solution: ['Cấu hình đầy đủ: 1s² 2s² 2p⁶ 3s² 3p⁵.', 'Z = 2 + 2 + 6 + 2 + 5 = 17 (chlorine).'],
    explanation: 'Các phân lớp trước 3p đều đã bão hòa.'
  },

  /* ----- Bài 4. Ôn tập chương 1 ----- */
  {
    id: 'g10-l4-q1',
    lessonId: 'g10-l4',
    type: 'single',
    difficulty: 'understand',
    objective: 'Tính số electron của ion.',
    content: 'Ion ³²₁₆S²⁻ có bao nhiêu electron?',
    options: [
      { id: 'a', text: '14', feedback: 'Ion âm đã nhận thêm electron, không phải nhường.' },
      { id: 'b', text: '16', feedback: 'Đó là số electron của nguyên tử S trung hòa.' },
      { id: 'c', text: '18' },
      { id: 'd', text: '32', feedback: '32 là số khối.' }
    ],
    correctAnswer: 'c',
    explanation: 'Nguyên tử S có 16 electron; ion S²⁻ nhận thêm 2 electron nên có 18 electron.'
  },
  {
    id: 'g10-l4-q2',
    lessonId: 'g10-l4',
    type: 'numeric',
    difficulty: 'advanced',
    objective: 'Giải bài toán tổng hợp số hạt và số khối.',
    content: 'Nguyên tử M có tổng số hạt là 82, trong đó số hạt mang điện nhiều hơn số hạt không mang điện là 22. Số khối của M là bao nhiêu?',
    correctAnswer: { value: 56 },
    verify: () => {
      const p = (82 + 22) / 4
      return p + (82 - 2 * p)
    },
    solution: [
      '2p + n = 82 và 2p − n = 22 ⇒ 4p = 104 ⇒ p = 26.',
      'n = 82 − 52 = 30.',
      'A = p + n = 26 + 30 = 56 (M là iron, ⁵⁶Fe).'
    ],
    explanation: 'Số khối chỉ tính proton và neutron, không tính electron.'
  },
  {
    id: 'g10-l4-q3',
    lessonId: 'g10-l4',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Liên hệ cấu hình electron với vị trí lớp và tính chất.',
    content: 'Xét nguyên tử calcium (Z = 20). Chọn Đúng hoặc Sai cho từng ý.',
    statements: [
      { id: 'a', text: 'Cấu hình electron là 1s² 2s² 2p⁶ 3s² 3p⁶ 4s².', explanation: '20 electron, 4s điền trước 3d.' },
      { id: 'b', text: 'Calcium có 2 electron lớp ngoài cùng nên là kim loại.', explanation: 'Lớp ngoài cùng là 4s².' },
      { id: 'c', text: 'Nguyên tử calcium có 4 lớp electron.', explanation: 'Các electron phân bố trên lớp 1, 2, 3, 4.' },
      { id: 'd', text: 'Electron cuối cùng của calcium điền vào phân lớp 3d.', explanation: 'Electron cuối cùng điền vào 4s; 3d chưa có electron.' }
    ],
    correctAnswer: { a: true, b: true, c: true, d: false },
    explanation: 'Với Z ≤ 20, sau 3p⁶ electron điền vào 4s.'
  },
  {
    id: 'g10-l4-q4',
    lessonId: 'g10-l4',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính nguyên tử khối trung bình.',
    content: 'Lithium gồm 7,5% ⁶Li và 92,5% ⁷Li (theo số nguyên tử). Tính nguyên tử khối trung bình của lithium (làm tròn đến 2 chữ số thập phân).',
    correctAnswer: { value: 6.93, tolerance: 0.006 },
    verify: () => (6 * 7.5 + 7 * 92.5) / 100,
    solution: ['Ā = (6 × 7,5 + 7 × 92,5) / 100.', 'Ā = (45 + 647,5) / 100 = 6,925 ≈ 6,93.'],
    explanation: 'Ā gần 7 vì ⁷Li chiếm phần lớn.'
  },
  {
    id: 'g10-l4-q5',
    lessonId: 'g10-l4',
    type: 'short',
    difficulty: 'recognize',
    objective: 'Gọi tên nguyên tố từ số hiệu nguyên tử.',
    content: 'Nguyên tố có số hiệu nguyên tử Z = 11 tên là gì?',
    correctAnswer: { accepted: ['sodium', 'natri', 'Na'] },
    explanation: 'Z = 11 là sodium (natri), kí hiệu Na, cấu hình 1s²2s²2p⁶3s¹.'
  },
  {
    id: 'g10-l4-q6',
    lessonId: 'g10-l4',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'So sánh hai đồng vị.',
    content: 'So sánh hai nguyên tử ³⁵₁₇Cl và ³⁷₁₇Cl. Chọn tất cả phát biểu đúng.',
    options: [
      { id: 'a', text: 'Có cùng số proton.' },
      { id: 'b', text: 'Có cùng số khối.', feedback: 'Số khối lần lượt là 35 và 37.' },
      { id: 'c', text: 'Có cùng số electron.' },
      { id: 'd', text: 'Có số neutron khác nhau.' }
    ],
    correctAnswer: ['a', 'c', 'd'],
    explanation: 'Hai đồng vị cùng Z = 17 (17p, 17e); số neutron là 18 và 20.'
  },
  {
    id: 'g10-l4-q7',
    lessonId: 'g10-l4',
    type: 'single',
    difficulty: 'advanced',
    objective: 'Suy ra nguyên tố từ đặc điểm cấu hình electron.',
    content: 'Nguyên tử Y có tổng số electron ở các phân lớp p là 11. Y là',
    options: [
      { id: 'a', text: 'Na (Z = 11)', feedback: '11 là tổng số electron của Na; số electron p của Na chỉ là 6.' },
      { id: 'b', text: 'S (Z = 16)', feedback: 'S có 2p⁶ và 3p⁴: tổng 10 electron p.' },
      { id: 'c', text: 'Cl (Z = 17)' },
      { id: 'd', text: 'Ar (Z = 18)', feedback: 'Ar có 2p⁶ và 3p⁶: tổng 12 electron p.' }
    ],
    correctAnswer: 'c',
    explanation: 'Các phân lớp p gồm 2p⁶ (6e) và 3p⁵ (5e): tổng 11. Cấu hình 1s²2s²2p⁶3s²3p⁵ là chlorine.'
  }
]
