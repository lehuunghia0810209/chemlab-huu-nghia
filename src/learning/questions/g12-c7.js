// Hóa học 12 · Chương 7 — Nguyên tố nhóm IA và nhóm IIA. Questions for Bài 24–26.
import { molarMass, GAS_VOLUME_STANDARD as VM } from '../chemMath.js'

export const questions = [
  /* ----- Bài 24. Nguyên tố nhóm IA ----- */
  {
    id: 'g12-l24-q1', lessonId: 'g12-l24', type: 'single', difficulty: 'recognize',
    objective: 'Nêu số oxi hóa của kim loại kiềm.',
    content: 'Trong hợp chất, kim loại kiềm có số oxi hóa là',
    options: [
      { id: 'a', text: '+1' },
      { id: 'b', text: '+2' },
      { id: 'c', text: '+3' },
      { id: 'd', text: '−1' }
    ],
    correctAnswer: 'a',
    explanation: 'Cấu hình ns¹, nhường 1 electron.'
  },
  {
    id: 'g12-l24-q2', lessonId: 'g12-l24', type: 'truefalse', difficulty: 'understand',
    objective: 'Trình bày tính chất của kim loại kiềm.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Tính khử của kim loại kiềm tăng dần từ Li đến Cs.', explanation: 'Bán kính tăng, electron ngoài cùng dễ tách.' },
      { id: 'b', text: 'Kim loại kiềm được bảo quản trong nước.', explanation: 'Phản ứng mạnh với nước; bảo quản trong dầu hỏa.' },
      { id: 'c', text: 'Kim loại kiềm mềm, có thể cắt bằng dao.', explanation: 'Liên kết kim loại yếu.' },
      { id: 'd', text: 'Hợp chất của kali cho ngọn lửa màu vàng.', explanation: 'K: tím nhạt; Na: vàng.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Kim loại kiềm có tính khử rất mạnh, mềm, nhẹ.'
  },
  {
    id: 'g12-l24-q3', lessonId: 'g12-l24', type: 'multiple', difficulty: 'understand',
    objective: 'Nêu ứng dụng của hợp chất natri.',
    content: 'Chọn tất cả ứng dụng đúng.',
    options: [
      { id: 'a', text: 'NaHCO₃ làm bột nở trong chế biến thực phẩm.' },
      { id: 'b', text: 'Na₂CO₃ dùng sản xuất thủy tinh.' },
      { id: 'c', text: 'NaOH dùng sản xuất xà phòng.' },
      { id: 'd', text: 'NaOH dùng làm thuốc giảm đau dạ dày.', feedback: 'NaOH ăn da; thuốc dạ dày dùng NaHCO₃.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Mỗi hợp chất có ứng dụng phù hợp với tính chất.'
  },
  {
    id: 'g12-l24-q4', lessonId: 'g12-l24', type: 'numeric', difficulty: 'apply',
    objective: 'Tính thể tích H₂ khi kim loại kiềm tác dụng với nước.',
    content: 'Cho 7,8 g K vào nước dư. Tính thể tích H₂ thu được (điều kiện chuẩn, 24,79 L/mol; K = 39).',
    correctAnswer: { value: 2.479, unit: 'L', tolerance: 0.02 },
    verify: () => 7.8 / molarMass('K') / 2 * VM,
    solution: ['n(K) = 7,8 / 39 = 0,2 mol ⇒ n(H₂) = 0,1 mol.', 'V = 0,1 × 24,79 = 2,479 L.'],
    explanation: '2K + 2H₂O → 2KOH + H₂.',
    equations: ['2K + 2H₂O → 2KOH + H₂']
  },
  {
    id: 'g12-l24-q5', lessonId: 'g12-l24', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng chất rắn khi nhiệt phân NaHCO₃.',
    content: 'Nung 25,2 g NaHCO₃ đến khối lượng không đổi. Tính khối lượng chất rắn thu được.',
    correctAnswer: { value: 15.9, unit: 'g', tolerance: 0.02 },
    verify: () => 25.2 / molarMass('NaHCO3') / 2 * molarMass('Na2CO3'),
    solution: ['n(NaHCO₃) = 25,2 / 84 = 0,3 mol ⇒ n(Na₂CO₃) = 0,15 mol.', 'm = 0,15 × 106 = 15,9 g.'],
    explanation: '2NaHCO₃ → Na₂CO₃ + CO₂ + H₂O.',
    equations: ['2NaHCO₃ → Na₂CO₃ + CO₂ + H₂O']
  },
  {
    id: 'g12-l24-q6', lessonId: 'g12-l24', type: 'short', difficulty: 'understand',
    objective: 'Nêu cách bảo quản kim loại kiềm.',
    content: 'Kim loại kiềm thường được ngâm trong chất lỏng nào để bảo quản?',
    correctAnswer: { accepted: ['dầu hỏa', 'dau hoa', 'dầu hoả', 'kerosene'], compact: true },
    explanation: 'Dầu hỏa ngăn kim loại tiếp xúc với O₂ và hơi nước.'
  },
  {
    id: 'g12-l24-q7', lessonId: 'g12-l24', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính nồng độ dung dịch base tạo thành.',
    content: 'Cho 2,3 g Na vào nước thu được 500 mL dung dịch. Tính nồng độ mol của NaOH.',
    correctAnswer: { value: 0.2, unit: 'M', tolerance: 0.002 },
    verify: () => 2.3 / molarMass('Na') / 0.5,
    solution: ['n(NaOH) = n(Na) = 2,3 / 23 = 0,1 mol.', 'C_M = 0,1 / 0,5 = 0,2 M.'],
    explanation: 'Thể tích dung dịch tính bằng lít.'
  },

  /* ----- Bài 25. Nguyên tố nhóm IIA ----- */
  {
    id: 'g12-l25-q1', lessonId: 'g12-l25', type: 'single', difficulty: 'recognize',
    objective: 'Nêu thành phần của nước cứng.',
    content: 'Nước cứng là nước chứa nhiều ion',
    options: [
      { id: 'a', text: 'Na⁺, K⁺' },
      { id: 'b', text: 'Ca²⁺, Mg²⁺' },
      { id: 'c', text: 'Cl⁻, SO₄²⁻' },
      { id: 'd', text: 'Fe³⁺, Al³⁺' }
    ],
    correctAnswer: 'b',
    explanation: 'Nước cứng chứa nhiều Ca²⁺ và Mg²⁺.'
  },
  {
    id: 'g12-l25-q2', lessonId: 'g12-l25', type: 'multiple', difficulty: 'understand',
    objective: 'Chọn cách làm mềm nước cứng tạm thời.',
    content: 'Chọn tất cả cách làm mềm được nước cứng tạm thời.',
    options: [
      { id: 'a', text: 'Đun sôi' },
      { id: 'b', text: 'Dùng Na₂CO₃' },
      { id: 'c', text: 'Dùng Na₃PO₄' },
      { id: 'd', text: 'Dùng NaCl', feedback: 'Không loại được Ca²⁺, Mg²⁺.' },
      { id: 'e', text: 'Dùng HCl', feedback: 'Không loại được Ca²⁺, Mg²⁺.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Các cách này chuyển Ca²⁺, Mg²⁺ thành kết tủa.'
  },
  {
    id: 'g12-l25-q3', lessonId: 'g12-l25', type: 'truefalse', difficulty: 'understand',
    objective: 'Trình bày tính chất của hợp chất nhóm IIA.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'BaSO₄ hầu như không tan trong nước.', explanation: 'Độ tan sulfate giảm từ Mg đến Ba.' },
      { id: 'b', text: 'Mg(OH)₂ tan tốt hơn Ba(OH)₂.', explanation: 'Độ tan hydroxide tăng từ Mg đến Ba.' },
      { id: 'c', text: 'Nung CaCO₃ thu được CaO và CO₂.', explanation: 'Phản ứng nhiệt phân.' },
      { id: 'd', text: 'Be tác dụng mạnh với nước ở nhiệt độ thường.', explanation: 'Be không tác dụng với nước.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Ghi nhớ xu hướng độ tan và khả năng phản ứng với nước.',
    equations: ['CaCO₃ → CaO + CO₂']
  },
  {
    id: 'g12-l25-q4', lessonId: 'g12-l25', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng vôi sống từ đá vôi.',
    content: 'Nung 100 kg đá vôi (100% CaCO₃) với hiệu suất 90%. Tính khối lượng CaO thu được (Ca = 40, C = 12, O = 16).',
    correctAnswer: { value: 50.4, unit: 'kg', tolerance: 0.2 },
    verify: () => 100 / molarMass('CaCO3') * 0.9 * molarMass('CaO'),
    solution: ['n(CaCO₃) = 1 kmol ⇒ n(CaO) = 0,9 kmol.', 'm = 0,9 × 56 = 50,4 kg.'],
    explanation: 'Mỗi mol CaCO₃ tạo 1 mol CaO.'
  },
  {
    id: 'g12-l25-q5', lessonId: 'g12-l25', type: 'numeric', difficulty: 'apply',
    objective: 'Tính lượng chất làm mềm nước cứng.',
    content: 'Một mẫu nước chứa 0,02 mol Ca²⁺ và 0,01 mol Mg²⁺. Tính khối lượng Na₂CO₃ tối thiểu để loại hết hai ion này.',
    correctAnswer: { value: 3.18, unit: 'g', tolerance: 0.02 },
    verify: () => (0.02 + 0.01) * molarMass('Na2CO3'),
    solution: ['Ca²⁺ + CO₃²⁻ → CaCO₃; Mg²⁺ + CO₃²⁻ → MgCO₃ ⇒ n(CO₃²⁻) = 0,03 mol.', 'm(Na₂CO₃) = 0,03 × 106 = 3,18 g.'],
    explanation: 'Mỗi ion M²⁺ cần một ion CO₃²⁻.'
  },
  {
    id: 'g12-l25-q6', lessonId: 'g12-l25', type: 'short', difficulty: 'understand',
    objective: 'Nêu chất cản quang trong y học.',
    content: 'Muối của bari dùng làm chất cản quang khi chụp X-quang dạ dày là chất nào? (ghi công thức)',
    correctAnswer: { accepted: ['BaSO4', 'BaSO₄', 'barium sulfate'], compact: true },
    explanation: 'BaSO₄ hầu như không tan nên không bị hấp thụ, an toàn khi uống.'
  },
  {
    id: 'g12-l25-q7', lessonId: 'g12-l25', type: 'single', difficulty: 'apply',
    objective: 'Giải thích sự hình thành thạch nhũ.',
    content: 'Phản ứng giải thích sự tạo thành thạch nhũ trong hang động là',
    options: [
      { id: 'a', text: 'CaCO₃ + CO₂ + H₂O → Ca(HCO₃)₂' },
      { id: 'b', text: 'Ca(HCO₃)₂ → CaCO₃ + CO₂ + H₂O' },
      { id: 'c', text: 'CaO + H₂O → Ca(OH)₂' },
      { id: 'd', text: 'CaCO₃ → CaO + CO₂' }
    ],
    correctAnswer: 'b',
    explanation: 'Ca(HCO₃)₂ phân hủy dần tạo CaCO₃ đọng lại thành thạch nhũ; phản ứng (a) giải thích sự hòa tan đá vôi.'
  },

  /* ----- Bài 26. Ôn tập chương 7 ----- */
  {
    id: 'g12-l26-q1', lessonId: 'g12-l26', type: 'single', difficulty: 'understand',
    objective: 'Nhận biết ion bằng màu ngọn lửa.',
    content: 'Đốt một muối cho ngọn lửa màu đỏ cam. Muối đó chứa ion',
    options: [
      { id: 'a', text: 'Na⁺' },
      { id: 'b', text: 'K⁺' },
      { id: 'c', text: 'Ca²⁺' },
      { id: 'd', text: 'Ba²⁺' }
    ],
    correctAnswer: 'c',
    explanation: 'Ca đỏ cam; Na vàng; K tím nhạt; Ba lục.'
  },
  {
    id: 'g12-l26-q2', lessonId: 'g12-l26', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định kim loại phản ứng với nước ở nhiệt độ thường.',
    content: 'Chọn tất cả kim loại tác dụng với nước ở nhiệt độ thường.',
    options: [
      { id: 'a', text: 'Na' },
      { id: 'b', text: 'K' },
      { id: 'c', text: 'Ba' },
      { id: 'd', text: 'Be', feedback: 'Be không tác dụng với nước.' },
      { id: 'e', text: 'Fe', feedback: 'Fe chỉ phản ứng với hơi nước ở nhiệt độ cao.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Kim loại kiềm và Ca, Sr, Ba tác dụng với nước ở nhiệt độ thường.'
  },
  {
    id: 'g12-l26-q3', lessonId: 'g12-l26', type: 'truefalse', difficulty: 'apply',
    objective: 'Phân tích hiện tượng CO₂ tác dụng với nước vôi trong.',
    content: 'Dẫn từ từ CO₂ đến dư vào nước vôi trong. Chọn Đúng hoặc Sai.',
    statements: [
      { id: 'a', text: 'Lúc đầu xuất hiện kết tủa trắng.', explanation: 'CO₂ + Ca(OH)₂ → CaCO₃ + H₂O.' },
      { id: 'b', text: 'Khi CO₂ dư, kết tủa tan dần.', explanation: 'CaCO₃ + CO₂ + H₂O → Ca(HCO₃)₂.' },
      { id: 'c', text: 'Kết tủa cuối cùng là Ca(HCO₃)₂.', explanation: 'Ca(HCO₃)₂ tan trong nước.' },
      { id: 'd', text: 'Đun nóng dung dịch cuối cùng lại thấy kết tủa.', explanation: 'Ca(HCO₃)₂ bị phân hủy tạo CaCO₃.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'CO₂ dư chuyển CaCO₃ thành Ca(HCO₃)₂ tan; đun nóng thì ngược lại.'
  },
  {
    id: 'g12-l26-q4', lessonId: 'g12-l26', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính kết tủa khi CO₂ dư một phần so với Ca(OH)₂.',
    content: 'Dẫn 0,25 mol CO₂ vào dung dịch chứa 0,15 mol Ca(OH)₂. Tính khối lượng kết tủa CaCO₃ (Ca = 40, C = 12, O = 16).',
    correctAnswer: { value: 5, unit: 'g', tolerance: 0.02 },
    verify: () => (2 * 0.15 - 0.25) * molarMass('CaCO3'),
    solution: ['0,15 mol Ca(OH)₂ + 0,15 mol CO₂ → 0,15 mol CaCO₃; dư 0,1 mol CO₂.', '0,1 mol CO₂ hòa tan 0,1 mol CaCO₃ ⇒ còn 0,05 mol ⇒ 5 g.'],
    explanation: 'n(CaCO₃) = 2n(Ca(OH)₂) − n(CO₂) khi n(Ca(OH)₂) < n(CO₂) < 2n(Ca(OH)₂).'
  },
  {
    id: 'g12-l26-q5', lessonId: 'g12-l26', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng kết tủa khi Ca(OH)₂ dư.',
    content: 'Dẫn 2,479 L CO₂ (điều kiện chuẩn) vào nước vôi trong dư. Tính khối lượng kết tủa.',
    correctAnswer: { value: 10, unit: 'g', tolerance: 0.02 },
    verify: () => 2.479 / VM * molarMass('CaCO3'),
    solution: ['n(CO₂) = 0,1 mol; Ca(OH)₂ dư ⇒ n(CaCO₃) = 0,1 mol.', 'm = 0,1 × 100 = 10 g.'],
    explanation: 'Khi base dư, chỉ tạo muối trung hòa CaCO₃.',
    equations: ['CO₂ + Ca(OH)₂ → CaCO₃ + H₂O']
  },
  {
    id: 'g12-l26-q6', lessonId: 'g12-l26', type: 'short', difficulty: 'apply',
    objective: 'Phân loại nước cứng.',
    content: 'Nước cứng chứa Ca²⁺, Mg²⁺ cùng các anion Cl⁻, SO₄²⁻ (không có HCO₃⁻) thuộc loại nước cứng nào?',
    correctAnswer: { accepted: ['vĩnh cửu', 'vinh cuu', 'nước cứng vĩnh cửu', 'vĩnh viễn'], compact: true },
    explanation: 'Không bị mềm khi đun sôi vì không có HCO₃⁻.'
  },
  {
    id: 'g12-l26-q7', lessonId: 'g12-l26', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng kim loại kiềm thổ từ lượng H₂.',
    content: 'Cho m gam Ba vào nước dư thu được 1,2395 L H₂ (điều kiện chuẩn). Tính m (Ba = 137).',
    correctAnswer: { value: 6.85, unit: 'g', tolerance: 0.02 },
    verify: () => 1.2395 / VM * molarMass('Ba'),
    solution: ['n(H₂) = 1,2395 / 24,79 = 0,05 mol = n(Ba).', 'm = 0,05 × 137 = 6,85 g.'],
    explanation: 'Ba + 2H₂O → Ba(OH)₂ + H₂.',
    equations: ['Ba + 2H₂O → Ba(OH)₂ + H₂']
  }
]
