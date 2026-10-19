// Hóa học 12 · Chương 5 — Pin điện và điện phân. Questions for Bài 15–17.
import { molarMass, GAS_VOLUME_STANDARD as VM } from '../chemMath.js'

export const questions = [
  /* ----- Bài 15. Thế điện cực và nguồn điện hóa học ----- */
  {
    id: 'g12-l15-q1', lessonId: 'g12-l15', type: 'single', difficulty: 'recognize',
    objective: 'Viết cặp oxi hóa – khử của kim loại.',
    content: 'Cặp oxi hóa – khử của kim loại đồng được viết là',
    options: [
      { id: 'a', text: 'Cu/Cu²⁺', feedback: 'Quy ước viết dạng oxi hóa trước, dạng khử sau.' },
      { id: 'b', text: 'Cu²⁺/Cu' },
      { id: 'c', text: 'Cu²⁺/Cu⁺' },
      { id: 'd', text: 'CuSO₄/Cu' }
    ],
    correctAnswer: 'b',
    explanation: 'Dạng oxi hóa Cu²⁺ viết trước, dạng khử Cu viết sau: Cu²⁺ + 2e ⇌ Cu.'
  },
  {
    id: 'g12-l15-q2', lessonId: 'g12-l15', type: 'numeric', difficulty: 'apply',
    objective: 'Tính sức điện động chuẩn của pin.',
    content: 'Biết E°(Mg²⁺/Mg) = −2,37 V; E°(Cu²⁺/Cu) = +0,34 V. Tính sức điện động chuẩn của pin Mg–Cu.',
    correctAnswer: { value: 2.71, unit: 'V', tolerance: 0.005 },
    verify: () => 0.34 - (-2.37),
    solution: ['Cu²⁺/Cu có E° lớn hơn ⇒ cathode; Mg là anode.', 'E°pin = 0,34 − (−2,37) = 2,71 V.'],
    explanation: 'E°pin = E°(cathode) − E°(anode).'
  },
  {
    id: 'g12-l15-q3', lessonId: 'g12-l15', type: 'truefalse', difficulty: 'understand',
    objective: 'Mô tả hoạt động của pin Galvani.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu về pin Zn–Cu.',
    statements: [
      { id: 'a', text: 'Zn là anode, bị oxi hóa.', explanation: 'Zn → Zn²⁺ + 2e.' },
      { id: 'b', text: 'Electron đi qua cầu muối từ Zn sang Cu.', explanation: 'Electron đi qua dây dẫn mạch ngoài; cầu muối chỉ cho ion đi qua.' },
      { id: 'c', text: 'Khối lượng thanh Cu tăng dần.', explanation: 'Cu²⁺ bị khử thành Cu bám vào thanh Cu.' },
      { id: 'd', text: 'Sức điện động chuẩn của pin là 1,10 V.', explanation: '0,34 − (−0,76) = 1,10 V.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: true },
    explanation: 'Anode (−) oxi hóa, cathode (+) khử; electron đi ở mạch ngoài.',
    equations: ['Zn + Cu²⁺ → Zn²⁺ + Cu']
  },
  {
    id: 'g12-l15-q4', lessonId: 'g12-l15', type: 'multiple', difficulty: 'apply',
    objective: 'Dự đoán phản ứng dựa vào thế điện cực chuẩn.',
    content: 'Dựa vào E°: Zn²⁺/Zn −0,76 V; Fe²⁺/Fe −0,44 V; Cu²⁺/Cu +0,34 V; Ag⁺/Ag +0,80 V. Chọn tất cả phản ứng xảy ra được.',
    options: [
      { id: 'a', text: 'Zn + Fe²⁺ → Zn²⁺ + Fe' },
      { id: 'b', text: 'Cu + 2Ag⁺ → Cu²⁺ + 2Ag' },
      { id: 'c', text: 'Cu + Fe²⁺ → Cu²⁺ + Fe', feedback: 'Fe²⁺ là chất oxi hóa yếu hơn Cu²⁺.' },
      { id: 'd', text: 'Fe + Cu²⁺ → Fe²⁺ + Cu' },
      { id: 'e', text: '2Ag + Zn²⁺ → 2Ag⁺ + Zn', feedback: 'Ag là chất khử rất yếu.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Chất oxi hóa của cặp có E° lớn hơn oxi hóa chất khử của cặp có E° nhỏ hơn.'
  },
  {
    id: 'g12-l15-q5', lessonId: 'g12-l15', type: 'numeric', difficulty: 'advanced',
    objective: 'Tìm thế điện cực chuẩn từ sức điện động của pin.',
    content: 'Pin tạo bởi kim loại X (anode) và cặp Ag⁺/Ag (E° = +0,80 V) có sức điện động chuẩn 1,56 V. Tính E°(X²⁺/X).',
    correctAnswer: { value: -0.76, unit: 'V', tolerance: 0.005 },
    verify: () => 0.8 - 1.56,
    solution: ['E°pin = E°(Ag⁺/Ag) − E°(X²⁺/X).', 'E°(X²⁺/X) = 0,80 − 1,56 = −0,76 V (X là Zn).'],
    explanation: 'Biến đổi công thức E°pin = E°(cathode) − E°(anode).'
  },
  {
    id: 'g12-l15-q6', lessonId: 'g12-l15', type: 'single', difficulty: 'understand',
    objective: 'Nêu đặc điểm của nguồn điện hóa học.',
    content: 'Sản phẩm của phản ứng trong pin nhiên liệu hydrogen là',
    options: [
      { id: 'a', text: 'CO₂' },
      { id: 'b', text: 'H₂O' },
      { id: 'c', text: 'PbSO₄' },
      { id: 'd', text: 'LiOH' }
    ],
    correctAnswer: 'b',
    explanation: '2H₂ + O₂ → 2H₂O: sản phẩm chỉ là nước.'
  },
  {
    id: 'g12-l15-q7', lessonId: 'g12-l15', type: 'short', difficulty: 'apply',
    objective: 'Xác định kim loại có tính khử mạnh nhất từ bảng thế điện cực.',
    content: 'Trong các kim loại Al, Zn, Fe, Cu (E° lần lượt −1,66; −0,76; −0,44; +0,34 V), kim loại nào có tính khử mạnh nhất? (ghi kí hiệu)',
    correctAnswer: { accepted: ['Al', 'aluminium', 'nhôm'], compact: true },
    explanation: 'E° càng nhỏ, kim loại có tính khử càng mạnh.'
  },

  /* ----- Bài 16. Điện phân ----- */
  {
    id: 'g12-l16-q1', lessonId: 'g12-l16', type: 'single', difficulty: 'recognize',
    objective: 'Xác định quá trình ở anode khi điện phân.',
    content: 'Khi điện phân NaCl nóng chảy, ở anode xảy ra quá trình',
    options: [
      { id: 'a', text: 'Na⁺ + e → Na' },
      { id: 'b', text: '2Cl⁻ → Cl₂ + 2e' },
      { id: 'c', text: '2H₂O + 2e → H₂ + 2OH⁻' },
      { id: 'd', text: 'Na → Na⁺ + e' }
    ],
    correctAnswer: 'b',
    explanation: 'Anode (cực dương) xảy ra oxi hóa anion Cl⁻.'
  },
  {
    id: 'g12-l16-q2', lessonId: 'g12-l16', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định kim loại điều chế bằng điện phân nóng chảy.',
    content: 'Chọn tất cả kim loại thường được điều chế bằng điện phân nóng chảy.',
    options: [
      { id: 'a', text: 'Na' },
      { id: 'b', text: 'Mg' },
      { id: 'c', text: 'Al' },
      { id: 'd', text: 'Cu', feedback: 'Cu có thể điều chế bằng nhiệt luyện, thủy luyện hoặc điện phân dung dịch.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Kim loại hoạt động mạnh (từ Al trở về trước) chỉ điều chế được bằng điện phân nóng chảy.'
  },
  {
    id: 'g12-l16-q3', lessonId: 'g12-l16', type: 'truefalse', difficulty: 'understand',
    objective: 'Dự đoán sản phẩm điện phân dung dịch.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu (điện cực trơ).',
    statements: [
      { id: 'a', text: 'Điện phân dung dịch CuSO₄, ở cathode thu được Cu.', explanation: 'Cu²⁺ bị khử trước H₂O.' },
      { id: 'b', text: 'Điện phân dung dịch CuSO₄, ở anode thu được SO₂.', explanation: 'SO₄²⁻ không bị oxi hóa; H₂O bị oxi hóa tạo O₂.' },
      { id: 'c', text: 'Điện phân dung dịch NaCl có màng ngăn thu được NaOH.', explanation: '2NaCl + 2H₂O → 2NaOH + H₂ + Cl₂.' },
      { id: 'd', text: 'Điện phân dung dịch NaCl thu được Na ở cathode.', explanation: 'H₂O bị khử tạo H₂.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Thứ tự điện phân dựa vào khả năng oxi hóa – khử của ion so với nước.',
    equations: ['2CuSO₄ + 2H₂O → 2Cu + O₂ + 2H₂SO₄']
  },
  {
    id: 'g12-l16-q4', lessonId: 'g12-l16', type: 'numeric', difficulty: 'apply',
    objective: 'Tính lượng khí ở anode theo bảo toàn electron.',
    content: 'Điện phân dung dịch CuSO₄ (điện cực trơ) đến khi cathode tăng 12,8 g. Tính thể tích O₂ thoát ra ở anode (điều kiện chuẩn, 24,79 L/mol).',
    correctAnswer: { value: 2.479, unit: 'L', tolerance: 0.02 },
    verify: () => 12.8 / molarMass('Cu') * 2 / 4 * VM,
    solution: ['n(Cu) = 12,8 / 64 = 0,2 mol ⇒ n(e) = 0,4 mol.', 'n(O₂) = 0,4 / 4 = 0,1 mol ⇒ V = 2,479 L.'],
    explanation: 'Số mol electron ở cathode bằng ở anode.'
  },
  {
    id: 'g12-l16-q5', lessonId: 'g12-l16', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng kim loại điều chế bằng điện phân nóng chảy.',
    content: 'Điện phân nóng chảy 20,4 tấn Al₂O₃ (hiệu suất 100%). Tính khối lượng Al thu được (Al = 27, O = 16).',
    correctAnswer: { value: 10.8, unit: 'tấn', units: { 'tấn': 1, 'tan': 1 }, tolerance: 0.02 },
    verify: () => 20.4 / molarMass('Al2O3') * 2 * molarMass('Al'),
    solution: ['Theo phương trình: 2 × 102 = 204 tấn Al₂O₃ tạo 4 × 27 = 108 tấn Al.', 'm(Al) = 20,4 × 108 / 204 = 10,8 tấn.'],
    explanation: 'Mỗi Al₂O₃ cho 2 Al; tỉ lệ khối lượng giữ nguyên khi đổi đơn vị.',
    equations: ['2Al₂O₃ → 4Al + 3O₂']
  },
  {
    id: 'g12-l16-q6', lessonId: 'g12-l16', type: 'short', difficulty: 'understand',
    objective: 'Nêu chất phụ gia trong điện phân nhôm.',
    content: 'Khi điện phân Al₂O₃ nóng chảy, người ta trộn thêm chất nào để hạ nhiệt độ nóng chảy?',
    correctAnswer: { accepted: ['cryolite', 'criolit', 'Na3AlF6'], compact: true },
    explanation: 'Cryolite Na₃AlF₆ hạ nhiệt độ nóng chảy, tăng độ dẫn điện của hỗn hợp.'
  },
  {
    id: 'g12-l16-q7', lessonId: 'g12-l16', type: 'single', difficulty: 'apply',
    objective: 'Vận dụng điện phân trong tinh chế kim loại.',
    content: 'Khi tinh chế đồng bằng điện phân dung dịch CuSO₄, đồng thô được dùng làm',
    options: [
      { id: 'a', text: 'anode, tan dần' },
      { id: 'b', text: 'cathode, khối lượng tăng' },
      { id: 'c', text: 'cầu muối' },
      { id: 'd', text: 'chất điện li' }
    ],
    correctAnswer: 'a',
    explanation: 'Cu ở anode bị oxi hóa thành Cu²⁺ rồi bị khử bám lên cathode đồng tinh khiết.'
  },

  /* ----- Bài 17. Ôn tập chương 5 ----- */
  {
    id: 'g12-l17-q1', lessonId: 'g12-l17', type: 'single', difficulty: 'understand',
    objective: 'So sánh pin Galvani và bình điện phân.',
    content: 'Trong bình điện phân, quá trình ở anode là',
    options: [
      { id: 'a', text: 'sự khử' },
      { id: 'b', text: 'sự oxi hóa' },
      { id: 'c', text: 'sự trung hòa' },
      { id: 'd', text: 'không có phản ứng' }
    ],
    correctAnswer: 'b',
    explanation: 'Anode luôn là nơi xảy ra sự oxi hóa (ở cả pin và bình điện phân).'
  },
  {
    id: 'g12-l17-q2', lessonId: 'g12-l17', type: 'multiple', difficulty: 'understand',
    objective: 'Phân biệt pin và điện phân.',
    content: 'Chọn tất cả đặc điểm của pin Galvani.',
    options: [
      { id: 'a', text: 'Biến hóa năng thành điện năng.' },
      { id: 'b', text: 'Phản ứng oxi hóa – khử tự xảy ra.' },
      { id: 'c', text: 'Anode là cực âm.' },
      { id: 'd', text: 'Cần nguồn điện một chiều bên ngoài.', feedback: 'Đó là đặc điểm của điện phân.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Pin tạo ra dòng điện từ phản ứng tự xảy ra.'
  },
  {
    id: 'g12-l17-q3', lessonId: 'g12-l17', type: 'truefalse', difficulty: 'apply',
    objective: 'Vận dụng thứ tự điện phân.',
    content: 'Điện phân dung dịch hỗn hợp AgNO₃ và Cu(NO₃)₂ với điện cực trơ. Chọn Đúng hoặc Sai.',
    statements: [
      { id: 'a', text: 'Ag⁺ bị khử trước Cu²⁺.', explanation: 'E°(Ag⁺/Ag) lớn hơn.' },
      { id: 'b', text: 'Ở anode, NO₃⁻ bị oxi hóa.', explanation: 'H₂O bị oxi hóa tạo O₂.' },
      { id: 'c', text: 'Dung dịch có tính acid tăng dần.', explanation: 'H⁺ sinh ra ở anode.' },
      { id: 'd', text: 'Khí ở anode là H₂.', explanation: 'Khí ở anode là O₂.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Cation E° lớn bị khử trước; anion có oxygen không bị oxi hóa.'
  },
  {
    id: 'g12-l17-q4', lessonId: 'g12-l17', type: 'numeric', difficulty: 'apply',
    objective: 'Tính sức điện động chuẩn của pin.',
    content: 'Biết E°(Ni²⁺/Ni) = −0,26 V; E°(Ag⁺/Ag) = +0,80 V. Tính sức điện động chuẩn của pin Ni–Ag.',
    correctAnswer: { value: 1.06, unit: 'V', tolerance: 0.005 },
    verify: () => 0.8 - (-0.26),
    solution: ['Ag⁺/Ag là cathode, Ni là anode.', 'E°pin = 0,80 − (−0,26) = 1,06 V.'],
    explanation: 'E°pin luôn dương khi xác định đúng anode và cathode.'
  },
  {
    id: 'g12-l17-q5', lessonId: 'g12-l17', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng NaOH từ điện phân dung dịch NaCl.',
    content: 'Điện phân dung dịch NaCl có màng ngăn thu được 4,958 L Cl₂ (điều kiện chuẩn). Tính khối lượng NaOH tạo thành.',
    correctAnswer: { value: 16, unit: 'g', tolerance: 0.02 },
    verify: () => 4.958 / VM * 2 * molarMass('NaOH'),
    solution: ['n(Cl₂) = 4,958 / 24,79 = 0,2 mol ⇒ n(NaOH) = 0,4 mol.', 'm = 0,4 × 40 = 16 g.'],
    explanation: '2NaCl + 2H₂O → 2NaOH + H₂ + Cl₂.',
    equations: ['2NaCl + 2H₂O → 2NaOH + H₂ + Cl₂']
  },
  {
    id: 'g12-l17-q6', lessonId: 'g12-l17', type: 'numeric', difficulty: 'advanced',
    objective: 'Bảo toàn electron trong điện phân dung dịch AgNO₃.',
    content: 'Điện phân dung dịch AgNO₃ (điện cực trơ) đến khi anode thoát ra 1,2395 L O₂ (điều kiện chuẩn). Tính khối lượng Ag bám ở cathode.',
    correctAnswer: { value: 21.6, unit: 'g', tolerance: 0.02 },
    verify: () => 1.2395 / VM * 4 * molarMass('Ag'),
    solution: ['n(O₂) = 1,2395 / 24,79 = 0,05 mol ⇒ n(e) = 0,2 mol.', 'n(Ag) = n(e) = 0,2 mol ⇒ m = 21,6 g.'],
    explanation: 'Ag⁺ + e → Ag; 2H₂O → O₂ + 4H⁺ + 4e.'
  },
  {
    id: 'g12-l17-q7', lessonId: 'g12-l17', type: 'short', difficulty: 'apply',
    objective: 'Xác định khí ở cathode khi điện phân dung dịch muối của kim loại mạnh.',
    content: 'Điện phân dung dịch KNO₃ với điện cực trơ, khí thoát ra ở cathode là gì? (ghi công thức)',
    correctAnswer: { accepted: ['H2', 'H₂', 'hydrogen'], compact: true },
    explanation: 'K⁺ không bị khử trong dung dịch; H₂O bị khử: 2H₂O + 2e → H₂ + 2OH⁻.'
  }
]
