// Hóa học 11 · Chương 4 — Hydrocarbon. Questions for Bài 15–18.
import { molarMass, GAS_VOLUME_STANDARD as VM } from '../chemMath.js'

export const questions = [
  /* ----- Bài 15. Alkane ----- */
  {
    id: 'g11-l15-q1', lessonId: 'g11-l15', type: 'single', difficulty: 'recognize',
    objective: 'Gọi tên alkane mạch không nhánh.',
    content: 'Alkane mạch không nhánh có công thức C₅H₁₂ có tên là',
    options: [
      { id: 'a', text: 'butane', feedback: 'Butane là C₄H₁₀.' },
      { id: 'b', text: 'pentane' },
      { id: 'c', text: 'hexane', feedback: 'Hexane là C₆H₁₄.' },
      { id: 'd', text: 'propane' }
    ],
    correctAnswer: 'b',
    explanation: 'Tiền tố pent- chỉ 5 nguyên tử C, đuôi -ane chỉ alkane.'
  },
  {
    id: 'g11-l15-q2', lessonId: 'g11-l15', type: 'numeric', difficulty: 'apply',
    objective: 'Xác định số nguyên tử carbon của alkane từ phản ứng cháy.',
    content: 'Đốt cháy hoàn toàn một alkane thu được 0,4 mol CO₂ và 0,5 mol H₂O. Phân tử alkane có bao nhiêu nguyên tử carbon?',
    correctAnswer: { value: 4 },
    verify: () => 0.4 / (0.5 - 0.4),
    solution: ['n(alkane) = n(H₂O) − n(CO₂) = 0,1 mol.', 'Số C = 0,4 / 0,1 = 4 ⇒ C₄H₁₀.'],
    explanation: 'Với alkane CₙH₂ₙ₊₂: n(H₂O) − n(CO₂) = n(alkane).'
  },
  {
    id: 'g11-l15-q3', lessonId: 'g11-l15', type: 'multiple', difficulty: 'understand',
    objective: 'Nêu tính chất của alkane.',
    content: 'Chọn tất cả tính chất của alkane.',
    options: [
      { id: 'a', text: 'Không tan trong nước.' },
      { id: 'b', text: 'Tham gia phản ứng thế với Cl₂ khi chiếu sáng.' },
      { id: 'c', text: 'Làm mất màu nước bromine.', feedback: 'Alkane không có liên kết π nên không cộng bromine.' },
      { id: 'd', text: 'Cháy tỏa nhiều nhiệt.' },
      { id: 'e', text: 'Cộng H₂ khi có xúc tác Ni.', feedback: 'Alkane đã no, không cộng H₂.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Alkane chỉ có liên kết đơn: phản ứng thế, tách (cracking) và cháy.'
  },
  {
    id: 'g11-l15-q4', lessonId: 'g11-l15', type: 'truefalse', difficulty: 'understand',
    objective: 'Mô tả cấu tạo và phản ứng của alkane.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Phân tử methane có dạng tứ diện đều.', explanation: 'Bốn liên kết C–H hướng về bốn đỉnh tứ diện.' },
      { id: 'b', text: 'Các alkane từ C1 đến C4 là chất khí ở điều kiện thường.', explanation: 'Methane, ethane, propane, butane đều là khí.' },
      { id: 'c', text: 'Cracking butane có thể tạo methane và propene.', explanation: 'C₄H₁₀ → CH₄ + C₃H₆.' },
      { id: 'd', text: 'Phân tử alkane có chứa liên kết π.', explanation: 'Alkane chỉ có liên kết đơn (σ).' }
    ],
    correctAnswer: { a: true, b: true, c: true, d: false },
    explanation: 'Alkane là hydrocarbon no, mạch hở.',
    equations: ['C₄H₁₀ → CH₄ + C₃H₆']
  },
  {
    id: 'g11-l15-q5', lessonId: 'g11-l15', type: 'short', difficulty: 'apply',
    objective: 'Gọi tên alkane mạch nhánh theo IUPAC.',
    content: 'Gọi tên theo danh pháp thay thế của alkane CH₃–CH(CH₃)–CH₂–CH₃.',
    correctAnswer: { accepted: ['2-methylbutane', '2 methylbutane', 'isopentane'], compact: true },
    explanation: 'Mạch chính 4 C (butane), nhánh methyl ở C2 khi đánh số từ đầu gần nhánh.'
  },
  {
    id: 'g11-l15-q6', lessonId: 'g11-l15', type: 'numeric', difficulty: 'apply',
    objective: 'Tính thể tích oxygen cần để đốt cháy alkane.',
    content: 'Tính thể tích O₂ (điều kiện chuẩn, 24,79 L/mol) cần để đốt cháy hoàn toàn 0,1 mol propane.',
    correctAnswer: { value: 12.395, unit: 'L', tolerance: 0.02 },
    verify: () => 0.1 * 5 * VM,
    solution: ['C₃H₈ + 5O₂ → 3CO₂ + 4H₂O.', 'n(O₂) = 5 × 0,1 = 0,5 mol ⇒ V = 0,5 × 24,79 ≈ 12,4 L.'],
    explanation: 'Tổng quát: CₙH₂ₙ₊₂ cần (3n + 1)/2 mol O₂; với n = 3 là 5 mol.',
    equations: ['C₃H₈ + 5O₂ → 3CO₂ + 4H₂O']
  },
  {
    id: 'g11-l15-q7', lessonId: 'g11-l15', type: 'single', difficulty: 'advanced',
    objective: 'Xác định số sản phẩm thế monochloro.',
    content: 'Cho propane tác dụng với Cl₂ (tỉ lệ mol 1 : 1, chiếu sáng). Số dẫn xuất monochloro (C₃H₇Cl) tối đa thu được là',
    options: [
      { id: 'a', text: '1', feedback: 'Propane có hai loại nguyên tử H khác nhau.' },
      { id: 'b', text: '2' },
      { id: 'c', text: '3' },
      { id: 'd', text: '4' }
    ],
    correctAnswer: 'b',
    explanation: 'Thế H ở C đầu mạch tạo 1-chloropropane; thế H ở C giữa tạo 2-chloropropane.',
    equations: ['C₃H₈ + Cl₂ → C₃H₇Cl + HCl']
  },

  /* ----- Bài 16. Hydrocarbon không no ----- */
  {
    id: 'g11-l16-q1', lessonId: 'g11-l16', type: 'single', difficulty: 'recognize',
    objective: 'Nêu công thức chung của alkene.',
    content: 'Công thức chung của alkene là',
    options: [
      { id: 'a', text: 'CₙH₂ₙ (n ≥ 2)' },
      { id: 'b', text: 'CₙH₂ₙ₊₂ (n ≥ 1)', feedback: 'Đó là công thức của alkane.' },
      { id: 'c', text: 'CₙH₂ₙ₋₂ (n ≥ 2)', feedback: 'Đó là công thức của alkyne.' },
      { id: 'd', text: 'CₙH₂ₙ₋₆ (n ≥ 6)' }
    ],
    correctAnswer: 'a',
    explanation: 'Alkene có một liên kết đôi C=C, mạch hở.'
  },
  {
    id: 'g11-l16-q2', lessonId: 'g11-l16', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định chất phản ứng được với ethylene.',
    content: 'Chọn tất cả chất phản ứng được với ethylene (trong điều kiện thích hợp).',
    options: [
      { id: 'a', text: 'Nước bromine' },
      { id: 'b', text: 'H₂ (xúc tác Ni, t°)' },
      { id: 'c', text: 'Dung dịch KMnO₄' },
      { id: 'd', text: 'AgNO₃ trong NH₃', feedback: 'Chỉ alk-1-yne mới tạo kết tủa với AgNO₃/NH₃.' },
      { id: 'e', text: 'Dung dịch NaOH', feedback: 'Ethylene không phản ứng với kiềm.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Liên kết đôi cộng Br₂, H₂ và bị KMnO₄ oxi hóa.'
  },
  {
    id: 'g11-l16-q3', lessonId: 'g11-l16', type: 'truefalse', difficulty: 'understand',
    objective: 'Vận dụng cấu tạo và tính chất của alkene, alkyne.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Phân tử acetylene có cấu tạo thẳng.', explanation: 'Góc liên kết H–C≡C là 180°.' },
      { id: 'b', text: 'Propene cộng HBr tạo sản phẩm chính là 2-bromopropane.', explanation: 'Theo quy tắc Markovnikov.' },
      { id: 'c', text: 'But-1-ene có đồng phân hình học.', explanation: 'C1 gắn hai nguyên tử H giống nhau nên không có cis – trans.' },
      { id: 'd', text: 'Cho đất đèn (CaC₂) vào nước thu được khí acetylene.', explanation: 'CaC₂ + 2H₂O → C₂H₂ + Ca(OH)₂.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'Đồng phân hình học cần mỗi C của liên kết đôi gắn với hai nhóm khác nhau.',
    equations: ['CaC₂ + 2H₂O → C₂H₂ + Ca(OH)₂']
  },
  {
    id: 'g11-l16-q4', lessonId: 'g11-l16', type: 'numeric', difficulty: 'apply',
    objective: 'Tính lượng bromine phản ứng với alkene.',
    content: 'Cho 2,8 g ethylene phản ứng hoàn toàn với dung dịch bromine. Tính khối lượng Br₂ đã phản ứng (C = 12, H = 1, Br = 80).',
    correctAnswer: { value: 16, unit: 'g', tolerance: 0.05 },
    verify: () => 2.8 / molarMass('C2H4') * molarMass('Br2'),
    solution: ['n(C₂H₄) = 2,8 / 28 = 0,1 mol.', 'C₂H₄ + Br₂ → C₂H₄Br₂ ⇒ n(Br₂) = 0,1 mol ⇒ m = 16 g.'],
    explanation: 'Mỗi liên kết đôi cộng một phân tử Br₂.',
    equations: ['C₂H₄ + Br₂ → C₂H₄Br₂']
  },
  {
    id: 'g11-l16-q5', lessonId: 'g11-l16', type: 'short', difficulty: 'recognize',
    objective: 'Gọi tên polymer tạo từ ethylene.',
    content: 'Trùng hợp ethylene thu được polymer có tên là gì?',
    correctAnswer: { accepted: ['polyethylene', 'PE', 'poly(ethylene)', 'polietilen'], compact: true },
    explanation: 'nCH₂=CH₂ → (–CH₂–CH₂–)ₙ: polyethylene (PE), dùng làm túi, màng bọc.'
  },
  {
    id: 'g11-l16-q6', lessonId: 'g11-l16', type: 'numeric', difficulty: 'advanced',
    objective: 'Giải bài toán hỗn hợp alkene, alkyne với bromine.',
    content: 'Hỗn hợp X gồm 0,15 mol ethylene và acetylene phản ứng vừa đủ với 0,20 mol Br₂ (cộng hoàn toàn). Tính số mol acetylene trong X.',
    correctAnswer: { value: 0.05, unit: 'mol', tolerance: 0.001 },
    verify: () => 0.2 - 0.15,
    solution: [
      'Gọi x = n(C₂H₄), y = n(C₂H₂): x + y = 0,15.',
      'C₂H₄ cộng 1 Br₂, C₂H₂ cộng 2 Br₂: x + 2y = 0,20.',
      'Trừ hai phương trình: y = 0,05 mol.'
    ],
    explanation: 'Alkyne có hai liên kết π nên cộng tối đa hai phân tử Br₂.',
    equations: ['C₂H₂ + 2Br₂ → C₂H₂Br₄']
  },
  {
    id: 'g11-l16-q7', lessonId: 'g11-l16', type: 'single', difficulty: 'understand',
    objective: 'Nêu cách điều chế ethylene trong phòng thí nghiệm.',
    content: 'Trong phòng thí nghiệm, ethylene được điều chế bằng cách',
    options: [
      { id: 'a', text: 'đun ethanol với H₂SO₄ đặc ở khoảng 170 °C' },
      { id: 'b', text: 'cho CaC₂ tác dụng với nước', feedback: 'Cách này tạo acetylene.' },
      { id: 'c', text: 'cracking dầu mỏ', feedback: 'Đây là phương pháp công nghiệp.' },
      { id: 'd', text: 'cho methane tác dụng với chlorine' }
    ],
    correctAnswer: 'a',
    explanation: 'C₂H₅OH → C₂H₄ + H₂O (H₂SO₄ đặc, 170 °C).',
    equations: ['C₂H₅OH → C₂H₄ + H₂O']
  },

  /* ----- Bài 17. Arene ----- */
  {
    id: 'g11-l17-q1', lessonId: 'g11-l17', type: 'single', difficulty: 'recognize',
    objective: 'Nêu công thức phân tử của benzene.',
    content: 'Công thức phân tử của benzene là',
    options: [
      { id: 'a', text: 'C₆H₆' },
      { id: 'b', text: 'C₆H₁₂', feedback: 'Đó là cyclohexane (sản phẩm cộng H₂ vào benzene).' },
      { id: 'c', text: 'C₇H₈', feedback: 'Đó là toluene.' },
      { id: 'd', text: 'C₆H₁₄' }
    ],
    correctAnswer: 'a',
    explanation: 'Benzene là arene đơn giản nhất, CₙH₂ₙ₋₆ với n = 6.'
  },
  {
    id: 'g11-l17-q2', lessonId: 'g11-l17', type: 'multiple', difficulty: 'understand',
    objective: 'Nêu tính chất hóa học của benzene.',
    content: 'Chọn tất cả phản ứng mà benzene tham gia được.',
    options: [
      { id: 'a', text: 'Thế với Br₂ khi có xúc tác FeBr₃, đun nóng.' },
      { id: 'b', text: 'Thế với HNO₃ đặc khi có H₂SO₄ đặc.' },
      { id: 'c', text: 'Cộng H₂ khi có xúc tác Ni, đun nóng.' },
      { id: 'd', text: 'Làm mất màu dung dịch KMnO₄ ở nhiệt độ thường.', feedback: 'Benzene không làm mất màu KMnO₄.' },
      { id: 'e', text: 'Làm mất màu nước bromine.', feedback: 'Vòng benzene bền, không cộng bromine trong nước.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Benzene dễ thế, khó cộng, bền với chất oxi hóa.',
    equations: ['C₆H₆ + Br₂ → C₆H₅Br + HBr', 'C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O', 'C₆H₆ + 3H₂ → C₆H₁₂']
  },
  {
    id: 'g11-l17-q3', lessonId: 'g11-l17', type: 'truefalse', difficulty: 'understand',
    objective: 'Phân biệt tính chất các arene.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Toluene làm mất màu dung dịch KMnO₄ khi đun nóng.', explanation: 'Nhánh CH₃ bị oxi hóa.' },
      { id: 'b', text: 'Benzene là chất độc, có thể gây ung thư.', explanation: 'Cần hạn chế tiếp xúc.' },
      { id: 'c', text: 'Công thức chung của dãy đồng đẳng benzene là CₙH₂ₙ₋₂.', explanation: 'Công thức đúng là CₙH₂ₙ₋₆.' },
      { id: 'd', text: 'Naphthalene có hai vòng benzene.', explanation: 'C₁₀H₈, dùng làm băng phiến.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'Arene là hydrocarbon chứa vòng benzene.'
  },
  {
    id: 'g11-l17-q4', lessonId: 'g11-l17', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng sản phẩm theo hiệu suất.',
    content: 'Nitro hóa 15,6 g benzene với hiệu suất 75%. Tính khối lượng nitrobenzene thu được (C = 12, H = 1, N = 14, O = 16).',
    correctAnswer: { value: 18.45, unit: 'g', tolerance: 0.05 },
    verify: () => 15.6 / molarMass('C6H6') * molarMass('C6H5NO2') * 0.75,
    solution: ['n(C₆H₆) = 15,6 / 78 = 0,2 mol ⇒ nitrobenzene lí thuyết 0,2 mol.', 'm = 0,2 × 123 × 75% = 18,45 g.'],
    explanation: 'Khối lượng sản phẩm thực tế = lí thuyết × hiệu suất.',
    equations: ['C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O']
  },
  {
    id: 'g11-l17-q5', lessonId: 'g11-l17', type: 'short', difficulty: 'recognize',
    objective: 'Viết công thức phân tử của toluene.',
    content: 'Viết công thức phân tử của toluene (methylbenzene).',
    correctAnswer: { accepted: ['C7H8', 'C₇H₈', 'C6H5CH3', 'C₆H₅CH₃'], caseSensitive: true, compact: true },
    explanation: 'Toluene C₆H₅CH₃, công thức phân tử C₇H₈.'
  },
  {
    id: 'g11-l17-q6', lessonId: 'g11-l17', type: 'numeric', difficulty: 'apply',
    objective: 'Tính lượng hydrogen cộng vào benzene.',
    content: 'Tính thể tích H₂ (điều kiện chuẩn, 24,79 L/mol) cần để chuyển hoàn toàn 7,8 g benzene thành cyclohexane (C = 12, H = 1).',
    correctAnswer: { value: 7.437, unit: 'L', tolerance: 0.02 },
    verify: () => 7.8 / molarMass('C6H6') * 3 * VM,
    solution: ['n(C₆H₆) = 0,1 mol.', 'C₆H₆ + 3H₂ → C₆H₁₂ ⇒ n(H₂) = 0,3 mol ⇒ V ≈ 7,44 L.'],
    explanation: 'Mỗi phân tử benzene cộng 3 phân tử H₂.',
    equations: ['C₆H₆ + 3H₂ → C₆H₁₂']
  },
  {
    id: 'g11-l17-q7', lessonId: 'g11-l17', type: 'single', difficulty: 'advanced',
    objective: 'Viết đồng phân arene.',
    content: 'Số đồng phân arene ứng với công thức phân tử C₈H₁₀ là',
    options: [
      { id: 'a', text: '2' },
      { id: 'b', text: '3', feedback: 'Còn ethylbenzene ngoài ba đồng phân xylene.' },
      { id: 'c', text: '4' },
      { id: 'd', text: '5' }
    ],
    correctAnswer: 'c',
    explanation: 'Ethylbenzene và ba đồng phân xylene (1,2-; 1,3-; 1,4-dimethylbenzene).'
  },

  /* ----- Bài 18. Ôn tập chương 4 ----- */
  {
    id: 'g11-l18-q1', lessonId: 'g11-l18', type: 'single', difficulty: 'understand',
    objective: 'Xác định loại hydrocarbon từ sản phẩm cháy.',
    content: 'Đốt cháy hoàn toàn một hydrocarbon mạch hở X thu được số mol CO₂ bằng số mol H₂O. X thuộc dãy',
    options: [
      { id: 'a', text: 'alkane' },
      { id: 'b', text: 'alkene' },
      { id: 'c', text: 'alkyne' },
      { id: 'd', text: 'arene' }
    ],
    correctAnswer: 'b',
    explanation: 'CₙH₂ₙ + 3n/2 O₂ → nCO₂ + nH₂O.'
  },
  {
    id: 'g11-l18-q2', lessonId: 'g11-l18', type: 'numeric', difficulty: 'apply',
    objective: 'Xác định alkene từ phản ứng cộng bromine.',
    content: '14 g một alkene phản ứng vừa đủ với 0,25 mol Br₂. Phân tử alkene có bao nhiêu nguyên tử carbon?',
    correctAnswer: { value: 4 },
    verify: () => 14 / 0.25 / 14,
    solution: ['n(alkene) = n(Br₂) = 0,25 mol ⇒ M = 14 / 0,25 = 56.', 'CₙH₂ₙ: 14n = 56 ⇒ n = 4.'],
    explanation: 'Alkene cộng Br₂ theo tỉ lệ 1 : 1.'
  },
  {
    id: 'g11-l18-q3', lessonId: 'g11-l18', type: 'truefalse', difficulty: 'understand',
    objective: 'Tổng hợp tính chất các loại hydrocarbon.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Methane không làm mất màu nước bromine.', explanation: 'Alkane không có liên kết π.' },
      { id: 'b', text: 'But-2-yne tạo kết tủa với AgNO₃ trong NH₃.', explanation: 'Liên kết ba ở giữa mạch, không có H gắn với C mang liên kết ba.' },
      { id: 'c', text: 'Một mol alkyne cộng tối đa 2 mol Br₂.', explanation: 'Liên kết ba có hai liên kết π.' },
      { id: 'd', text: 'Đốt cháy arene luôn thu được số mol H₂O lớn hơn số mol CO₂.', explanation: 'CₙH₂ₙ₋₆ cho n mol CO₂ và (n − 3) mol H₂O.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Số liên kết π quyết định khả năng cộng và tỉ lệ sản phẩm cháy.'
  },
  {
    id: 'g11-l18-q4', lessonId: 'g11-l18', type: 'multiple', difficulty: 'understand',
    objective: 'Nhận biết chất làm mất màu nước bromine.',
    content: 'Chọn tất cả chất làm mất màu nước bromine.',
    options: [
      { id: 'a', text: 'Ethylene' },
      { id: 'b', text: 'Acetylene' },
      { id: 'c', text: 'Styrene' },
      { id: 'd', text: 'Benzene', feedback: 'Vòng benzene bền, không cộng bromine.' },
      { id: 'e', text: 'Propane', feedback: 'Alkane không có liên kết π.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Các chất có liên kết C=C hoặc C≡C ngoài vòng benzene làm mất màu nước bromine.'
  },
  {
    id: 'g11-l18-q5', lessonId: 'g11-l18', type: 'short', difficulty: 'recognize',
    objective: 'Nêu thuốc thử nhận biết alk-1-yne.',
    content: 'Viết thuốc thử dùng để nhận biết acetylene (tạo kết tủa vàng nhạt).',
    correctAnswer: { accepted: ['AgNO3/NH3', 'AgNO3 trong NH3', 'dung dịch AgNO3 trong NH3', 'AgNO₃/NH₃', 'AgNO3,NH3'], compact: true },
    explanation: 'C₂H₂ + 2AgNO₃ + 2NH₃ → C₂Ag₂ + 2NH₄NO₃ (kết tủa vàng nhạt).',
    equations: ['C₂H₂ + 2AgNO₃ + 2NH₃ → C₂Ag₂ + 2NH₄NO₃']
  },
  {
    id: 'g11-l18-q6', lessonId: 'g11-l18', type: 'numeric', difficulty: 'advanced',
    objective: 'Xác định công thức hydrocarbon từ sản phẩm cháy.',
    content: 'Đốt cháy hoàn toàn 0,1 mol hydrocarbon X thu được 0,6 mol CO₂ và 0,3 mol H₂O. Phân tử X có bao nhiêu nguyên tử hydrogen?',
    correctAnswer: { value: 6 },
    verify: () => 2 * 0.3 / 0.1,
    solution: ['Số C = 0,6 / 0,1 = 6; số H = 2 × 0,3 / 0,1 = 6.', 'X là C₆H₆ (có thể là benzene).'],
    explanation: 'Mỗi phân tử H₂O chứa 2 nguyên tử H.'
  },
  {
    id: 'g11-l18-q7', lessonId: 'g11-l18', type: 'single', difficulty: 'apply',
    objective: 'Suy luận cấu tạo từ phản ứng cộng hydrogen.',
    content: 'Hydrocarbon mạch hở X cộng tối đa 2 mol H₂ cho mỗi mol X (xúc tác Ni) tạo propane. X có thể là',
    options: [
      { id: 'a', text: 'propene', feedback: 'Propene chỉ cộng 1 mol H₂.' },
      { id: 'b', text: 'propyne' },
      { id: 'c', text: 'propane' },
      { id: 'd', text: 'cyclopropane', feedback: 'Cyclopropane không phải mạch hở.' }
    ],
    correctAnswer: 'b',
    explanation: 'CH≡C–CH₃ + 2H₂ → CH₃–CH₂–CH₃.',
    equations: ['C₃H₄ + 2H₂ → C₃H₈']
  }
]
