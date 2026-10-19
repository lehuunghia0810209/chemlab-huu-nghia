// Hóa học 10 · Chương 4 — Phản ứng oxi hóa – khử. Questions for Bài 15–16.
import { GAS_VOLUME_STANDARD } from '../chemMath.js'

export const questions = [
  /* ----- Bài 15. Phản ứng oxi hóa – khử ----- */
  {
    id: 'g10-l15-q1',
    lessonId: 'g10-l15',
    type: 'single',
    difficulty: 'recognize',
    objective: 'Nêu quy tắc xác định số oxi hóa trong đơn chất.',
    content: 'Số oxi hóa của nguyên tố trong đơn chất (như Fe, O₂, Cl₂) bằng',
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: '+1', feedback: '+1 là số oxi hóa thường gặp của H trong hợp chất.' },
      { id: 'c', text: 'số electron lớp ngoài cùng' },
      { id: 'd', text: 'số thứ tự nhóm', feedback: 'Số thứ tự nhóm A là số oxi hóa cao nhất thường gặp trong hợp chất, không phải trong đơn chất.' }
    ],
    correctAnswer: 'a',
    explanation: 'Trong đơn chất, các nguyên tử giống nhau nên không có sự lệch electron: số oxi hóa bằng 0.'
  },
  {
    id: 'g10-l15-q2',
    lessonId: 'g10-l15',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính số oxi hóa của nguyên tố trong hợp chất.',
    content: 'Số oxi hóa của nitrogen trong HNO₃ là bao nhiêu? (nhập số, ví dụ +3 hoặc −2)',
    correctAnswer: { value: 5, display: '+5' },
    verify: () => 0 - 1 - 3 * -2,
    solution: ['Gọi số oxi hóa của N là x: (+1) + x + 3 × (−2) = 0.', 'x = +5.'],
    explanation: 'N có số oxi hóa cao nhất là +5 (bằng số thứ tự nhóm VA).'
  },
  {
    id: 'g10-l15-q3',
    lessonId: 'g10-l15',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'Nhận biết phản ứng oxi hóa – khử.',
    content: 'Chọn tất cả phản ứng oxi hóa – khử.',
    options: [
      { id: 'a', text: '2Mg + O₂ → 2MgO' },
      { id: 'b', text: 'NaOH + HCl → NaCl + H₂O', feedback: 'Phản ứng trung hòa: không nguyên tố nào thay đổi số oxi hóa.' },
      { id: 'c', text: 'Zn + CuSO₄ → ZnSO₄ + Cu' },
      { id: 'd', text: 'CaO + H₂O → Ca(OH)₂', feedback: 'Ca (+2), O (−2), H (+1) không đổi số oxi hóa.' },
      { id: 'e', text: '2KClO₃ → 2KCl + 3O₂' }
    ],
    correctAnswer: ['a', 'c', 'e'],
    explanation: 'Mg (0 → +2), Zn (0 → +2), Cl (+5 → −1) và O (−2 → 0) thay đổi số oxi hóa.',
    equations: ['2Mg + O₂ → 2MgO', 'NaOH + HCl → NaCl + H₂O', 'Zn + CuSO₄ → ZnSO₄ + Cu', 'CaO + H₂O → Ca(OH)₂', '2KClO₃ → 2KCl + 3O₂']
  },
  {
    id: 'g10-l15-q4',
    lessonId: 'g10-l15',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Xác định chất oxi hóa, chất khử và các quá trình.',
    content: 'Xét phản ứng Fe + CuSO₄ → FeSO₄ + Cu. Chọn Đúng hoặc Sai cho từng ý.',
    statements: [
      { id: 'a', text: 'Fe là chất khử.', explanation: 'Fe: 0 → +2, nhường electron.' },
      { id: 'b', text: 'Ion Cu²⁺ bị oxi hóa.', explanation: 'Cu²⁺ nhận electron (+2 → 0) nên bị khử.' },
      { id: 'c', text: 'Mỗi nguyên tử Fe nhường 2 electron.', explanation: 'Fe → Fe²⁺ + 2e.' },
      { id: 'd', text: 'Số oxi hóa của S thay đổi trong phản ứng.', explanation: 'S giữ +6 trong ion SO₄²⁻.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Chất khử bị oxi hóa; chất oxi hóa bị khử.',
    equations: ['Fe + CuSO₄ → FeSO₄ + Cu']
  },
  {
    id: 'g10-l15-q5',
    lessonId: 'g10-l15',
    type: 'short',
    difficulty: 'understand',
    objective: 'Xác định chất oxi hóa trong phản ứng.',
    content: 'Trong phản ứng 2Na + Cl₂ → 2NaCl, chất oxi hóa là chất nào? (ghi công thức)',
    correctAnswer: { accepted: ['Cl2', 'Cl₂'], caseSensitive: true, compact: true },
    explanation: 'Cl: 0 → −1, nhận electron ⇒ Cl₂ là chất oxi hóa; Na là chất khử.',
    equations: ['2Na + Cl₂ → 2NaCl']
  },
  {
    id: 'g10-l15-q6',
    lessonId: 'g10-l15',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Cân bằng phản ứng oxi hóa – khử có môi trường.',
    content: 'Cân bằng phương trình Cu + HNO₃ → Cu(NO₃)₂ + NO + H₂O với hệ số nguyên tối giản. Hệ số của HNO₃ là bao nhiêu?',
    correctAnswer: { value: 8 },
    verify: () => {
      const copper = 3
      const nitricOxide = 2 // 3 × 2e = 2 × 3e
      return copper * 2 + nitricOxide
    },
    solution: [
      'Cu⁰ → Cu⁺² + 2e (×3); N⁺⁵ + 3e → N⁺² (×2).',
      'N trong muối: 3 × 2 = 6; N trong NO: 2 ⇒ HNO₃ = 8.',
      '3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O.'
    ],
    explanation: 'Hệ số HNO₃ gồm phần làm chất oxi hóa và phần làm môi trường tạo muối.',
    equations: ['3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O']
  },
  {
    id: 'g10-l15-q7',
    lessonId: 'g10-l15',
    type: 'single',
    difficulty: 'advanced',
    objective: 'Phân biệt vai trò chất khử và môi trường của một chất.',
    content: 'Trong phản ứng MnO₂ + 4HCl → MnCl₂ + Cl₂ + 2H₂O, tỉ lệ số phân tử HCl đóng vai trò chất khử so với tổng số phân tử HCl tham gia là',
    options: [
      { id: 'a', text: '1 : 4', feedback: 'Có 2 nguyên tử Cl chuyển thành Cl₂, không phải 1.' },
      { id: 'b', text: '1 : 2' },
      { id: 'c', text: '3 : 4' },
      { id: 'd', text: '1 : 1', feedback: '2 nguyên tử Cl vẫn giữ số oxi hóa −1 trong MnCl₂.' }
    ],
    correctAnswer: 'b',
    explanation: '2 Cl⁻ bị oxi hóa thành Cl₂ (chất khử), 2 Cl⁻ còn lại đi vào MnCl₂ (môi trường) ⇒ 2 : 4 = 1 : 2.',
    equations: ['MnO₂ + 4HCl → MnCl₂ + Cl₂ + 2H₂O']
  },

  /* ----- Bài 16. Ôn tập chương 4 ----- */
  {
    id: 'g10-l16-q1',
    lessonId: 'g10-l16',
    type: 'single',
    difficulty: 'understand',
    objective: 'Xác định vai trò của chất trong phản ứng oxi hóa – khử.',
    content: 'Trong phản ứng SO₂ + Br₂ + 2H₂O → H₂SO₄ + 2HBr, SO₂ đóng vai trò',
    options: [
      { id: 'a', text: 'chất oxi hóa', feedback: 'Br₂ (0 → −1) mới là chất oxi hóa.' },
      { id: 'b', text: 'chất khử' },
      { id: 'c', text: 'vừa là chất oxi hóa vừa là chất khử' },
      { id: 'd', text: 'môi trường' }
    ],
    correctAnswer: 'b',
    explanation: 'S: +4 (SO₂) → +6 (H₂SO₄), nhường electron ⇒ SO₂ là chất khử.',
    equations: ['SO₂ + Br₂ + 2H₂O → H₂SO₄ + 2HBr']
  },
  {
    id: 'g10-l16-q2',
    lessonId: 'g10-l16',
    type: 'numeric',
    difficulty: 'advanced',
    objective: 'Vận dụng bảo toàn electron để tính thể tích khí.',
    content: 'Hòa tan hoàn toàn 2,7 g Al trong dung dịch HNO₃ dư, thu được khí N₂O là sản phẩm khử duy nhất. Tính thể tích N₂O ở điều kiện chuẩn (25 °C, 1 bar; 24,79 L/mol) (Al = 27).',
    correctAnswer: { value: 0.93, unit: 'L', tolerance: 0.01 },
    verify: () => 2.7 / 27 * 3 / 8 * GAS_VOLUME_STANDARD,
    solution: [
      'n(Al) = 0,1 mol; Al → Al³⁺ + 3e ⇒ electron nhường = 0,3 mol.',
      '2N⁺⁵ + 8e → N₂O ⇒ n(N₂O) = 0,3 / 8 = 0,0375 mol.',
      'V = 0,0375 × 24,79 ≈ 0,93 L.'
    ],
    explanation: 'Mỗi phân tử N₂O nhận 8 electron vì có 2 nguyên tử N, mỗi nguyên tử giảm từ +5 xuống +1.',
    equations: ['8Al + 30HNO₃ → 8Al(NO₃)₃ + 3N₂O + 15H₂O']
  },
  {
    id: 'g10-l16-q3',
    lessonId: 'g10-l16',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Cân bằng phản ứng oxi hóa – khử phức tạp.',
    content: 'Phương trình 8Al + 30HNO₃ → 8Al(NO₃)₃ + 3N₂O + 15H₂O đã cân bằng. Tổng các hệ số trong phương trình là bao nhiêu?',
    correctAnswer: { value: 64 },
    verify: () => 8 + 30 + 8 + 3 + 15,
    solution: ['Cộng hệ số: 8 + 30 + 8 + 3 + 15.', '= 64.'],
    explanation: 'Kiểm tra lại: N 30 = 24 + 6; H 30 = 30; O 90 = 72 + 3 + 15.',
    equations: ['8Al + 30HNO₃ → 8Al(NO₃)₃ + 3N₂O + 15H₂O']
  },
  {
    id: 'g10-l16-q4',
    lessonId: 'g10-l16',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Phân tích phản ứng tự oxi hóa – khử.',
    content: 'Xét phản ứng Cl₂ + 2NaOH → NaCl + NaClO + H₂O. Chọn Đúng hoặc Sai cho từng ý.',
    statements: [
      { id: 'a', text: 'Cl₂ vừa là chất oxi hóa vừa là chất khử.', explanation: 'Cl: 0 → −1 và 0 → +1.' },
      { id: 'b', text: 'Số oxi hóa của Cl trong NaClO là +1.', explanation: '(+1) + x + (−2) = 0 ⇒ x = +1.' },
      { id: 'c', text: 'Na thay đổi số oxi hóa trong phản ứng.', explanation: 'Na giữ +1.' },
      { id: 'd', text: 'Đây là phản ứng oxi hóa – khử.', explanation: 'Có sự thay đổi số oxi hóa của Cl.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'Phản ứng tự oxi hóa – khử: cùng một nguyên tố vừa tăng vừa giảm số oxi hóa.',
    equations: ['Cl₂ + 2NaOH → NaCl + NaClO + H₂O']
  },
  {
    id: 'g10-l16-q5',
    lessonId: 'g10-l16',
    type: 'short',
    difficulty: 'apply',
    objective: 'Xác định sản phẩm khi kim loại tác dụng với chất oxi hóa mạnh dư.',
    content: 'Viết công thức muối sắt tạo thành khi sắt tan hoàn toàn trong dung dịch HNO₃ loãng, dư.',
    placeholder: 'Ví dụ cách nhập: Cu(NO3)2',
    correctAnswer: { accepted: ['Fe(NO3)3', 'Fe(NO₃)₃'], caseSensitive: true, compact: true },
    explanation: 'HNO₃ dư oxi hóa Fe lên số oxi hóa +3: Fe + 4HNO₃ → Fe(NO₃)₃ + NO + 2H₂O.',
    equations: ['Fe + 4HNO₃ → Fe(NO₃)₃ + NO + 2H₂O']
  },
  {
    id: 'g10-l16-q6',
    lessonId: 'g10-l16',
    type: 'multiple',
    difficulty: 'apply',
    objective: 'Nhận biết chất vừa có tính oxi hóa vừa có tính khử.',
    content: 'Chọn tất cả chất vừa có thể đóng vai trò chất oxi hóa, vừa có thể đóng vai trò chất khử.',
    options: [
      { id: 'a', text: 'SO₂' },
      { id: 'b', text: 'FeCl₂' },
      { id: 'c', text: 'Na', feedback: 'Na chỉ có thể nhường electron (0 → +1): chỉ là chất khử.' },
      { id: 'd', text: 'Cl₂' },
      { id: 'e', text: 'F₂', feedback: 'F có độ âm điện lớn nhất, F₂ chỉ là chất oxi hóa.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'S (+4), Fe (+2), Cl (0) đều ở số oxi hóa trung gian nên có thể tăng hoặc giảm.'
  },
  {
    id: 'g10-l16-q7',
    lessonId: 'g10-l16',
    type: 'single',
    difficulty: 'apply',
    objective: 'Tính thể tích khí bằng bảo toàn electron.',
    content: 'Cho 0,3 mol Zn tác dụng hết với dung dịch HCl dư. Thể tích khí H₂ thu được ở điều kiện chuẩn (24,79 L/mol) là',
    options: [
      { id: 'a', text: '3,72 L', feedback: 'Có thể em đã chia đôi số mol H₂.' },
      { id: 'b', text: '7,44 L' },
      { id: 'c', text: '14,87 L', feedback: 'Số mol electron là 0,6 nhưng mỗi H₂ nhận 2 electron.' },
      { id: 'd', text: '6,72 L', feedback: 'Đây là kết quả nếu dùng 22,4 L/mol (điều kiện tiêu chuẩn cũ).' }
    ],
    correctAnswer: 'b',
    explanation: 'Zn → Zn²⁺ + 2e: 0,6 mol e; 2H⁺ + 2e → H₂: n(H₂) = 0,3 mol; V = 0,3 × 24,79 ≈ 7,44 L.',
    equations: ['Zn + 2HCl → ZnCl₂ + H₂']
  }
]
