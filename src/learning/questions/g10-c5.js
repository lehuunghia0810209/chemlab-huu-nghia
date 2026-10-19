// Hóa học 10 · Chương 5 — Năng lượng hóa học. Questions for Bài 17–18.
import { molarMass } from '../chemMath.js'
import { FORMATION_ENTHALPY as H } from '../lessons/g10-l17.js'

export const questions = [
  /* ----- Bài 17. Biến thiên enthalpy ----- */
  {
    id: 'g10-l17-q1',
    lessonId: 'g10-l17',
    type: 'single',
    difficulty: 'recognize',
    objective: 'Nêu ý nghĩa dấu của ΔrH.',
    content: 'Phản ứng có biến thiên enthalpy ΔrH < 0 là phản ứng',
    options: [
      { id: 'a', text: 'tỏa nhiệt' },
      { id: 'b', text: 'thu nhiệt', feedback: 'Phản ứng thu nhiệt có ΔrH > 0.' },
      { id: 'c', text: 'không xảy ra' },
      { id: 'd', text: 'luôn là phản ứng oxi hóa – khử' }
    ],
    correctAnswer: 'a',
    explanation: 'ΔrH âm: hệ giải phóng năng lượng ra môi trường.'
  },
  {
    id: 'g10-l17-q2',
    lessonId: 'g10-l17',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính ΔrH°298 từ enthalpy tạo thành.',
    content: 'Tính ΔrH°298 của phản ứng N₂(g) + 3H₂(g) → 2NH₃(g). Cho ΔfH°298(NH₃, g) = −45,9 kJ/mol.',
    correctAnswer: { value: -91.8, unit: 'kJ', tolerance: 0.1 },
    verify: () => 2 * H['NH₃(g)'],
    solution: [
      'ΔfH của N₂(g), H₂(g) (đơn chất bền) bằng 0.',
      'ΔrH°298 = 2 × (−45,9) − (0 + 0) = −91,8 kJ.'
    ],
    explanation: 'Phản ứng tổng hợp ammonia tỏa nhiệt.',
    equations: ['N₂(g) + 3H₂(g) → 2NH₃(g)']
  },
  {
    id: 'g10-l17-q3',
    lessonId: 'g10-l17',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'Nhận biết quá trình thu nhiệt.',
    content: 'Chọn tất cả quá trình thu nhiệt.',
    options: [
      { id: 'a', text: 'Nung đá vôi (CaCO₃) thành vôi sống.' },
      { id: 'b', text: 'Đốt cháy than.', feedback: 'Đốt cháy nhiên liệu tỏa nhiệt.' },
      { id: 'c', text: 'Nhiệt phân KMnO₄.' },
      { id: 'd', text: 'Trung hòa HCl bằng NaOH.', feedback: 'Phản ứng trung hòa tỏa nhiệt.' },
      { id: 'e', text: 'Hòa tan ammonium nitrate (NH₄NO₃) vào nước.' }
    ],
    correctAnswer: ['a', 'c', 'e'],
    explanation: 'Các quá trình a, c cần đun nóng liên tục; hòa tan NH₄NO₃ làm nước lạnh đi (dùng trong túi chườm lạnh).'
  },
  {
    id: 'g10-l17-q4',
    lessonId: 'g10-l17',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Hiểu điều kiện chuẩn, enthalpy tạo thành và phương trình nhiệt hóa học.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Enthalpy tạo thành chuẩn của O₂(g) bằng 0.', explanation: 'O₂(g) là đơn chất bền.' },
      { id: 'b', text: 'Khi đảo chiều phản ứng, ΔrH giữ nguyên dấu.', explanation: 'Đảo chiều thì ΔrH đổi dấu.' },
      { id: 'c', text: 'Ở điều kiện chuẩn, áp suất của chất khí là 1 bar.', explanation: 'Nhiệt độ thường chọn 298 K.' },
      { id: 'd', text: 'ΔfH°298 của H₂O(l) và H₂O(g) bằng nhau.', explanation: 'H₂O(l): −285,8; H₂O(g): −241,8 kJ/mol.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Trạng thái của chất ảnh hưởng đến enthalpy tạo thành.'
  },
  {
    id: 'g10-l17-q5',
    lessonId: 'g10-l17',
    type: 'numeric',
    difficulty: 'advanced',
    objective: 'Tính ΔrH°298 từ năng lượng liên kết.',
    content: 'Tính ΔrH°298 của phản ứng 2H₂(g) + O₂(g) → 2H₂O(g). Cho năng lượng liên kết (kJ/mol): H–H 436; O=O 498; O–H 464.',
    correctAnswer: { value: -486, unit: 'kJ', tolerance: 1 },
    verify: () => 2 * 436 + 498 - 4 * 464,
    solution: [
      'Phá vỡ liên kết: 2 × 436 + 498 = 1370 kJ.',
      'Hình thành liên kết: 2 phân tử H₂O × 2 liên kết O–H × 464 = 1856 kJ.',
      'ΔrH = 1370 − 1856 = −486 kJ.'
    ],
    explanation: 'Với năng lượng liên kết: ΔrH = Σ Eb(chất đầu) − Σ Eb(sản phẩm). Giá trị thực nghiệm là −483,6 kJ.',
    equations: ['2H₂(g) + O₂(g) → 2H₂O(g)']
  },
  {
    id: 'g10-l17-q6',
    lessonId: 'g10-l17',
    type: 'short',
    difficulty: 'recognize',
    objective: 'Kết luận phản ứng tỏa hay thu nhiệt từ dấu ΔrH.',
    content: 'Một phản ứng có ΔrH°298 = −200 kJ. Phản ứng đó tỏa nhiệt hay thu nhiệt?',
    correctAnswer: { accepted: ['tỏa nhiệt', 'toả nhiệt', 'tỏa', 'toả', 'phản ứng tỏa nhiệt'] },
    explanation: 'ΔrH < 0 nên phản ứng tỏa nhiệt.'
  },
  {
    id: 'g10-l17-q7',
    lessonId: 'g10-l17',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính ΔrH°298 của phản ứng phân hủy.',
    content: 'Tính ΔrH°298 của phản ứng CaCO₃(s) → CaO(s) + CO₂(g). Cho ΔfH°298 (kJ/mol): CaCO₃(s) −1206,9; CaO(s) −635,1; CO₂(g) −393,5.',
    correctAnswer: { value: 178.3, unit: 'kJ', tolerance: 0.1 },
    verify: () => H['CaO(s)'] + H['CO₂(g)'] - H['CaCO₃(s)'],
    solution: ['ΔrH = (−635,1 + (−393,5)) − (−1206,9).', '= −1028,6 + 1206,9 = +178,3 kJ.'],
    explanation: 'ΔrH dương: nung vôi là phản ứng thu nhiệt.',
    equations: ['CaCO₃(s) → CaO(s) + CO₂(g)']
  },

  /* ----- Bài 18. Ôn tập chương 5 ----- */
  {
    id: 'g10-l18-q1',
    lessonId: 'g10-l18',
    type: 'single',
    difficulty: 'apply',
    objective: 'Tính nhiệt lượng theo số mol chất.',
    content: 'Phản ứng C₂H₄(g) + 3O₂(g) → 2CO₂(g) + 2H₂O(l) có ΔrH°298 = −1411,0 kJ. Đốt cháy 0,5 mol C₂H₄ tỏa ra',
    options: [
      { id: 'a', text: '1411,0 kJ', feedback: 'Đó là nhiệt lượng ứng với 1 mol C₂H₄.' },
      { id: 'b', text: '705,5 kJ' },
      { id: 'c', text: '2822,0 kJ' },
      { id: 'd', text: '470,3 kJ', feedback: 'Không chia cho hệ số của O₂; nhiệt lượng tính theo C₂H₄.' }
    ],
    correctAnswer: 'b',
    explanation: 'Q = 0,5 × 1411,0 = 705,5 kJ.',
    equations: ['C₂H₄(g) + 3O₂(g) → 2CO₂(g) + 2H₂O(l)']
  },
  {
    id: 'g10-l18-q2',
    lessonId: 'g10-l18',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính nhiệt lượng tỏa ra theo khối lượng nhiên liệu.',
    content: 'Đốt cháy hoàn toàn 8 g CH₄ theo phản ứng CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l), ΔrH°298 = −890,3 kJ. Tính nhiệt lượng tỏa ra (C = 12, H = 1).',
    correctAnswer: { value: 445.15, unit: 'kJ', tolerance: 0.5 },
    verify: () => 8 / molarMass('CH4') * 890.3,
    solution: ['n(CH₄) = 8 / 16 = 0,5 mol.', 'Q = 0,5 × 890,3 = 445,15 kJ.'],
    explanation: 'Nhiệt lượng tỏa ra tỉ lệ với số mol nhiên liệu.',
    equations: ['CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l)']
  },
  {
    id: 'g10-l18-q3',
    lessonId: 'g10-l18',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Tổng hợp kiến thức về biến thiên enthalpy.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Nhiệt lượng tỏa ra tỉ lệ với lượng chất tham gia phản ứng.', explanation: 'Gấp đôi lượng chất thì gấp đôi nhiệt lượng.' },
      { id: 'b', text: 'Có thể tính ΔrH từ năng lượng liên kết cho phản ứng có chất rắn.', explanation: 'Cách tính này chỉ áp dụng khi các chất đều ở thể khí.' },
      { id: 'c', text: 'Enthalpy tạo thành chuẩn của NO(g) là +90,3 kJ/mol.', explanation: 'N₂ + O₂ → 2NO có ΔrH = +180,6 kJ cho 2 mol NO.' },
      { id: 'd', text: 'Phản ứng có ΔrH > 0 làm môi trường xung quanh nóng lên.', explanation: 'Phản ứng thu nhiệt lấy nhiệt của môi trường nên môi trường lạnh đi.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Dấu ΔrH cho biết chiều trao đổi nhiệt giữa hệ và môi trường.'
  },
  {
    id: 'g10-l18-q4',
    lessonId: 'g10-l18',
    type: 'multiple',
    difficulty: 'recognize',
    objective: 'Nhận biết chất có enthalpy tạo thành chuẩn bằng 0.',
    content: 'Chọn tất cả chất có ΔfH°298 = 0.',
    options: [
      { id: 'a', text: 'O₂(g)' },
      { id: 'b', text: 'H₂(g)' },
      { id: 'c', text: 'H₂O(l)', feedback: 'H₂O là hợp chất: ΔfH = −285,8 kJ/mol.' },
      { id: 'd', text: 'C (graphite)' },
      { id: 'e', text: 'CO₂(g)', feedback: 'CO₂ là hợp chất: ΔfH = −393,5 kJ/mol.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Đơn chất ở dạng bền nhất có ΔfH°298 = 0; graphite là dạng bền của carbon.'
  },
  {
    id: 'g10-l18-q5',
    lessonId: 'g10-l18',
    type: 'short',
    difficulty: 'recognize',
    objective: 'Nêu đơn vị của enthalpy tạo thành.',
    content: 'Enthalpy tạo thành chuẩn ΔfH°298 thường có đơn vị là gì?',
    correctAnswer: { accepted: ['kJ/mol', 'kJ.mol-1', 'kJ mol-1', 'kJ·mol-1'], compact: true },
    explanation: 'ΔfH tính cho 1 mol chất tạo thành nên có đơn vị kJ/mol; ΔrH của một phương trình có đơn vị kJ.'
  },
  {
    id: 'g10-l18-q6',
    lessonId: 'g10-l18',
    type: 'numeric',
    difficulty: 'advanced',
    objective: 'Tính khối lượng nhiên liệu cần để tỏa ra một nhiệt lượng cho trước.',
    content: 'Cần đốt cháy bao nhiêu gam C₂H₄ để tỏa ra 141,1 kJ? Biết C₂H₄(g) + 3O₂(g) → 2CO₂(g) + 2H₂O(l) có ΔrH°298 = −1411,0 kJ (C = 12, H = 1).',
    correctAnswer: { value: 2.8, unit: 'g', tolerance: 0.01 },
    verify: () => 141.1 / 1411 * molarMass('C2H4'),
    solution: ['n(C₂H₄) = 141,1 / 1411,0 = 0,1 mol.', 'm = 0,1 × 28 = 2,8 g.'],
    explanation: 'Đổi nhiệt lượng ra số mol bằng cách chia cho nhiệt ứng với 1 mol chất.'
  },
  {
    id: 'g10-l18-q7',
    lessonId: 'g10-l18',
    type: 'single',
    difficulty: 'advanced',
    objective: 'So sánh nhiệt lượng tỏa ra trên một đơn vị khối lượng nhiên liệu.',
    content: 'Đốt cháy 1 mol CH₄ tỏa 890,3 kJ; đốt cháy 1 mol C₂H₄ tỏa 1411,0 kJ. Tính theo mỗi gam nhiên liệu, nhận xét nào đúng?',
    options: [
      { id: 'a', text: 'C₂H₄ tỏa nhiều nhiệt hơn vì 1411,0 > 890,3.', feedback: 'So sánh theo mol chưa đủ; phải chia cho khối lượng mol.' },
      { id: 'b', text: 'CH₄ tỏa nhiều nhiệt hơn: khoảng 55,6 kJ/g so với 50,4 kJ/g.' },
      { id: 'c', text: 'Hai chất tỏa nhiệt như nhau theo khối lượng.' },
      { id: 'd', text: 'Không thể so sánh vì khác công thức.' }
    ],
    correctAnswer: 'b',
    explanation: 'CH₄: 890,3 / 16 ≈ 55,6 kJ/g; C₂H₄: 1411,0 / 28 ≈ 50,4 kJ/g.'
  }
]
