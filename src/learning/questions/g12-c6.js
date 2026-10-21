// Hóa học 12 · Chương 6 — Đại cương về kim loại. Questions for Bài 18–23.
import { molarMass, GAS_VOLUME_STANDARD as VM } from '../chemMath.js'

export const questions = [
  /* ----- Bài 18. Cấu tạo và liên kết trong tinh thể kim loại ----- */
  {
    id: 'g12-l18-q1', lessonId: 'g12-l18', type: 'single', difficulty: 'recognize',
    objective: 'Xác định kim loại từ cấu hình electron.',
    content: 'Nguyên tử có cấu hình electron nào sau đây là kim loại?',
    options: [
      { id: 'a', text: '1s²2s²2p⁶3s¹' },
      { id: 'b', text: '1s²2s²2p⁵' },
      { id: 'c', text: '1s²2s²2p⁶3s²3p⁴' },
      { id: 'd', text: '1s²2s²2p⁶' }
    ],
    correctAnswer: 'a',
    explanation: '3s¹: 1 electron lớp ngoài cùng (Na).'
  },
  {
    id: 'g12-l18-q2', lessonId: 'g12-l18', type: 'truefalse', difficulty: 'understand',
    objective: 'Mô tả đặc điểm nguyên tử và liên kết kim loại.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'So với phi kim cùng chu kì, kim loại có bán kính nguyên tử lớn hơn.', explanation: 'Bán kính giảm dần từ trái sang phải trong chu kì.' },
      { id: 'b', text: 'Tất cả nguyên tố nhóm IA đều là kim loại.', explanation: 'H là phi kim.' },
      { id: 'c', text: 'Liên kết kim loại có sự tham gia của electron tự do.', explanation: 'Đúng.' },
      { id: 'd', text: 'Ở điều kiện thường, mọi kim loại đều ở trạng thái rắn.', explanation: 'Hg là chất lỏng.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Kim loại có bán kính lớn, độ âm điện nhỏ, liên kết bằng electron tự do.'
  },
  {
    id: 'g12-l18-q3', lessonId: 'g12-l18', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định vị trí kim loại trong bảng tuần hoàn.',
    content: 'Chọn tất cả nhóm (hoặc họ) chỉ gồm các kim loại.',
    options: [
      { id: 'a', text: 'Nhóm IIA' },
      { id: 'b', text: 'Các nhóm B' },
      { id: 'c', text: 'Họ lanthanide' },
      { id: 'd', text: 'Nhóm IA', feedback: 'Có hydrogen là phi kim.' },
      { id: 'e', text: 'Nhóm IIIA', feedback: 'Có boron là phi kim.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Nhóm IA có H, nhóm IIIA có B là phi kim.'
  },
  {
    id: 'g12-l18-q4', lessonId: 'g12-l18', type: 'numeric', difficulty: 'apply',
    objective: 'Đếm số electron lớp ngoài cùng của nguyên tử kim loại.',
    content: 'Nguyên tử Al (Z = 13) có bao nhiêu electron lớp ngoài cùng?',
    correctAnswer: { value: 3 },
    verify: () => 13 - 10,
    solution: ['Cấu hình: 1s²2s²2p⁶3s²3p¹.', 'Lớp ngoài cùng (n = 3) có 2 + 1 = 3 electron.'],
    explanation: 'Al thuộc nhóm IIIA nên có 3 electron lớp ngoài cùng.'
  },
  {
    id: 'g12-l18-q5', lessonId: 'g12-l18', type: 'short', difficulty: 'understand',
    objective: 'Nêu thành phần tạo liên kết kim loại.',
    content: 'Trong tinh thể kim loại, các ion dương được liên kết với nhau nhờ hạt nào?',
    correctAnswer: { accepted: ['electron tự do', 'electron tu do', 'các electron tự do', 'electron hóa trị tự do', 'electron'], compact: true },
    explanation: 'Electron hóa trị tự do chuyển động trong toàn mạng tinh thể.'
  },
  {
    id: 'g12-l18-q6', lessonId: 'g12-l18', type: 'single', difficulty: 'apply',
    objective: 'Nhận biết kiểu mạng tinh thể.',
    content: 'Kim loại nào có mạng tinh thể lập phương tâm mặt?',
    options: [
      { id: 'a', text: 'Na' },
      { id: 'b', text: 'Cu' },
      { id: 'c', text: 'Mg' },
      { id: 'd', text: 'K' }
    ],
    correctAnswer: 'b',
    explanation: 'Cu, Al, Ag, Au: lập phương tâm mặt; Na, K: lập phương tâm khối; Mg: lục phương.'
  },

  /* ----- Bài 19. Tính chất của kim loại ----- */
  {
    id: 'g12-l19-q1', lessonId: 'g12-l19', type: 'single', difficulty: 'recognize',
    objective: 'Giải thích tính chất vật lí chung của kim loại.',
    content: 'Tính dẫn điện, dẫn nhiệt, ánh kim của kim loại chủ yếu do',
    options: [
      { id: 'a', text: 'các electron tự do' },
      { id: 'b', text: 'các ion dương' },
      { id: 'c', text: 'khối lượng nguyên tử lớn' },
      { id: 'd', text: 'liên kết cộng hóa trị' }
    ],
    correctAnswer: 'a',
    explanation: 'Electron tự do gây ra các tính chất vật lí chung.'
  },
  {
    id: 'g12-l19-q2', lessonId: 'g12-l19', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định kim loại tác dụng với HCl.',
    content: 'Chọn tất cả kim loại tác dụng được với dung dịch HCl.',
    options: [
      { id: 'a', text: 'Zn' },
      { id: 'b', text: 'Fe' },
      { id: 'c', text: 'Cu', feedback: 'E°(Cu²⁺/Cu) > 0.' },
      { id: 'd', text: 'Al' },
      { id: 'e', text: 'Ag', feedback: 'E°(Ag⁺/Ag) > 0.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Kim loại có E° < 0 khử được H⁺.'
  },
  {
    id: 'g12-l19-q3', lessonId: 'g12-l19', type: 'truefalse', difficulty: 'understand',
    objective: 'Trình bày phản ứng của kim loại với acid và muối.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Fe tác dụng với HCl tạo FeCl₃.', explanation: 'Tạo FeCl₂.' },
      { id: 'b', text: 'Cu tan trong dung dịch HNO₃ loãng giải phóng khí NO.', explanation: '3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O.' },
      { id: 'c', text: 'Al bị thụ động trong H₂SO₄ đặc nguội.', explanation: 'Lớp oxide bền bảo vệ.' },
      { id: 'd', text: 'Cho Na vào dung dịch CuSO₄ thu được Cu.', explanation: 'Na phản ứng với nước trước, tạo Cu(OH)₂.' }
    ],
    correctAnswer: { a: false, b: true, c: true, d: false },
    explanation: 'Sản phẩm phụ thuộc chất oxi hóa và môi trường.',
    equations: ['3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O']
  },
  {
    id: 'g12-l19-q4', lessonId: 'g12-l19', type: 'numeric', difficulty: 'apply',
    objective: 'Tính thể tích H₂ khi kim loại tác dụng với acid.',
    content: 'Cho 5,4 g Al tác dụng hết với dung dịch HCl. Tính thể tích H₂ thu được (điều kiện chuẩn, 24,79 L/mol; Al = 27).',
    correctAnswer: { value: 7.437, unit: 'L', tolerance: 0.02 },
    verify: () => 5.4 / molarMass('Al') * 1.5 * VM,
    solution: ['n(Al) = 0,2 mol; 2Al + 6HCl → 2AlCl₃ + 3H₂ ⇒ n(H₂) = 0,3 mol.', 'V = 0,3 × 24,79 ≈ 7,44 L.'],
    explanation: 'Bảo toàn electron: 3n(Al) = 2n(H₂).',
    equations: ['2Al + 6HCl → 2AlCl₃ + 3H₂']
  },
  {
    id: 'g12-l19-q5', lessonId: 'g12-l19', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính thể tích khí NO₂ khi Cu tác dụng với HNO₃ đặc.',
    content: 'Cho 3,2 g Cu tác dụng hết với HNO₃ đặc dư. Tính thể tích NO₂ (sản phẩm khử duy nhất) ở điều kiện chuẩn (24,79 L/mol).',
    correctAnswer: { value: 2.479, unit: 'L', tolerance: 0.02 },
    verify: () => 3.2 / molarMass('Cu') * 2 * VM,
    solution: ['n(Cu) = 0,05 mol; Cu nhường 2e, N⁺⁵ nhận 1e tạo NO₂ ⇒ n(NO₂) = 0,1 mol.', 'V = 0,1 × 24,79 = 2,479 L.'],
    explanation: 'Bảo toàn electron: 2n(Cu) = n(NO₂).',
    equations: ['Cu + 4HNO₃ → Cu(NO₃)₂ + 2NO₂ + 2H₂O']
  },
  {
    id: 'g12-l19-q6', lessonId: 'g12-l19', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng tăng của thanh kim loại khi tác dụng với muối.',
    content: 'Nhúng thanh Fe vào dung dịch CuSO₄, phản ứng làm 0,2 mol Cu bám vào thanh. Khối lượng thanh Fe tăng bao nhiêu gam?',
    correctAnswer: { value: 1.6, unit: 'g', tolerance: 0.02 },
    verify: () => 0.2 * (molarMass('Cu') - molarMass('Fe')),
    solution: ['Mỗi mol phản ứng: Fe tan 56 g, Cu bám 64 g ⇒ tăng 8 g.', 'Δm = 0,2 × 8 = 1,6 g.'],
    explanation: 'Δm = n × (M(Cu) − M(Fe)).',
    equations: ['Fe + CuSO₄ → FeSO₄ + Cu']
  },

  /* ----- Bài 20. Kim loại trong tự nhiên và phương pháp tách kim loại ----- */
  {
    id: 'g12-l20-q1', lessonId: 'g12-l20', type: 'single', difficulty: 'recognize',
    objective: 'Nhận biết quặng kim loại.',
    content: 'Quặng bauxite là nguyên liệu để sản xuất kim loại',
    options: [
      { id: 'a', text: 'Fe' },
      { id: 'b', text: 'Al' },
      { id: 'c', text: 'Cu' },
      { id: 'd', text: 'Zn' }
    ],
    correctAnswer: 'b',
    explanation: 'Bauxite có thành phần chính Al₂O₃·2H₂O.'
  },
  {
    id: 'g12-l20-q2', lessonId: 'g12-l20', type: 'multiple', difficulty: 'understand',
    objective: 'Chọn chất khử dùng trong nhiệt luyện.',
    content: 'Chọn tất cả chất có thể dùng làm chất khử trong phương pháp nhiệt luyện.',
    options: [
      { id: 'a', text: 'CO' },
      { id: 'b', text: 'H₂' },
      { id: 'c', text: 'C' },
      { id: 'd', text: 'Al' },
      { id: 'e', text: 'O₂', feedback: 'O₂ là chất oxi hóa.' }
    ],
    correctAnswer: ['a', 'b', 'c', 'd'],
    explanation: 'Nhiệt luyện dùng chất khử mạnh ở nhiệt độ cao.'
  },
  {
    id: 'g12-l20-q3', lessonId: 'g12-l20', type: 'truefalse', difficulty: 'understand',
    objective: 'Chọn phương pháp tách kim loại phù hợp.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Al được sản xuất bằng điện phân Al₂O₃ nóng chảy.', explanation: 'Có thêm cryolite.' },
      { id: 'b', text: 'Fe được sản xuất từ Fe₂O₃ bằng CO ở nhiệt độ cao.', explanation: 'Phương pháp nhiệt luyện.' },
      { id: 'c', text: 'Na có thể điều chế bằng CO khử Na₂O.', explanation: 'Na hoạt động mạnh, phải điện phân nóng chảy.' },
      { id: 'd', text: 'Tái chế nhôm tiết kiệm năng lượng so với sản xuất từ quặng.', explanation: 'Đúng.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'Phương pháp phụ thuộc mức hoạt động hóa học của kim loại.',
    equations: ['Fe₂O₃ + 3CO → 2Fe + 3CO₂']
  },
  {
    id: 'g12-l20-q4', lessonId: 'g12-l20', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng kim loại thu được bằng nhiệt luyện.',
    content: 'Khử hoàn toàn 16 g Fe₂O₃ bằng CO ở nhiệt độ cao. Tính khối lượng Fe thu được (Fe = 56, O = 16).',
    correctAnswer: { value: 11.2, unit: 'g', tolerance: 0.02 },
    verify: () => 16 / molarMass('Fe2O3') * 2 * molarMass('Fe'),
    solution: ['n(Fe₂O₃) = 16 / 160 = 0,1 mol ⇒ n(Fe) = 0,2 mol.', 'm = 0,2 × 56 = 11,2 g.'],
    explanation: 'Mỗi Fe₂O₃ chứa 2 Fe.'
  },
  {
    id: 'g12-l20-q5', lessonId: 'g12-l20', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính khối lượng kim loại từ quặng có hàm lượng và hiệu suất.',
    content: 'Từ 2 tấn quặng hematite chứa 64% Fe₂O₃ sản xuất được bao nhiêu tấn Fe, biết hiệu suất 80%?',
    correctAnswer: { value: 0.7168, unit: 'tấn', units: { 'tấn': 1, 'tan': 1 }, tolerance: 0.005 },
    verify: () => 2 * 0.64 * 2 * molarMass('Fe') / molarMass('Fe2O3') * 0.8,
    solution: ['m(Fe₂O₃) = 2 × 64% = 1,28 tấn ⇒ Fe lí thuyết = 1,28 × 112 / 160 = 0,896 tấn.', 'Fe thực tế = 0,896 × 80% = 0,7168 tấn.'],
    explanation: 'Nhân với hàm lượng oxide trong quặng và hiệu suất.'
  },
  {
    id: 'g12-l20-q6', lessonId: 'g12-l20', type: 'short', difficulty: 'understand',
    objective: 'Gọi tên phương pháp tách kim loại.',
    content: 'Phương pháp dùng kim loại mạnh hơn khử ion kim loại yếu trong dung dịch muối gọi là gì?',
    correctAnswer: { accepted: ['thủy luyện', 'thuy luyen', 'phương pháp thủy luyện', 'thuỷ luyện'], compact: true },
    explanation: 'Ví dụ Fe + CuSO₄ → FeSO₄ + Cu.'
  },

  /* ----- Bài 21. Hợp kim ----- */
  {
    id: 'g12-l21-q1', lessonId: 'g12-l21', type: 'single', difficulty: 'recognize',
    objective: 'Nêu thành phần của gang.',
    content: 'Gang là hợp kim của sắt với carbon, trong đó hàm lượng carbon là',
    options: [
      { id: 'a', text: 'dưới 2%' },
      { id: 'b', text: '2 – 5%' },
      { id: 'c', text: '10 – 20%' },
      { id: 'd', text: 'trên 50%' }
    ],
    correctAnswer: 'b',
    explanation: 'Gang: 2 – 5% C; thép: dưới 2% C.'
  },
  {
    id: 'g12-l21-q2', lessonId: 'g12-l21', type: 'truefalse', difficulty: 'understand',
    objective: 'So sánh tính chất hợp kim với kim loại thành phần.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Hợp kim thường cứng hơn kim loại thành phần.', explanation: 'Đúng.' },
      { id: 'b', text: 'Hợp kim thường dẫn điện tốt hơn kim loại thành phần.', explanation: 'Mật độ electron tự do giảm nên dẫn điện kém hơn.' },
      { id: 'c', text: 'Thép không gỉ có thành phần chính Fe, Cr, Ni.', explanation: 'Đúng.' },
      { id: 'd', text: 'Duralumin là hợp kim của đồng.', explanation: 'Duralumin là hợp kim của nhôm.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Ghi nhớ xu hướng tính chất và thành phần hợp kim phổ biến.'
  },
  {
    id: 'g12-l21-q3', lessonId: 'g12-l21', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định hợp kim chứa sắt.',
    content: 'Chọn tất cả hợp kim có kim loại cơ bản là sắt.',
    options: [
      { id: 'a', text: 'Gang' },
      { id: 'b', text: 'Thép' },
      { id: 'c', text: 'Thép không gỉ' },
      { id: 'd', text: 'Đồng thau', feedback: 'Cu – Zn.' },
      { id: 'e', text: 'Duralumin', feedback: 'Hợp kim nhôm.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Gang, thép, inox đều là hợp kim của sắt.'
  },
  {
    id: 'g12-l21-q4', lessonId: 'g12-l21', type: 'numeric', difficulty: 'apply',
    objective: 'Xác định thành phần hợp kim bằng phản ứng với acid.',
    content: 'Cho 20 g hợp kim Cu – Zn vào dung dịch HCl dư thu được 2,479 L H₂ (điều kiện chuẩn). Tính phần trăm khối lượng Zn (Zn = 65).',
    correctAnswer: { value: 32.5, unit: '%', tolerance: 0.2 },
    verify: () => 2.479 / VM * molarMass('Zn') / 20 * 100,
    solution: ['n(Zn) = n(H₂) = 0,1 mol ⇒ m(Zn) = 6,5 g.', '%Zn = 6,5 / 20 × 100% = 32,5%.'],
    explanation: 'Chỉ Zn phản ứng với HCl.'
  },
  {
    id: 'g12-l21-q5', lessonId: 'g12-l21', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính khối lượng nguyên tố trong hợp kim.',
    content: 'Một loại thép chứa 1,2% C về khối lượng. Tính khối lượng carbon có trong 5 tấn thép này (đơn vị kg).',
    correctAnswer: { value: 60, unit: 'kg', tolerance: 0.5 },
    verify: () => 5000 * 0.012,
    solution: ['5 tấn = 5 000 kg.', 'm(C) = 5 000 × 1,2% = 60 kg.'],
    explanation: 'Khối lượng thành phần = khối lượng hợp kim × phần trăm khối lượng.'
  },
  {
    id: 'g12-l21-q6', lessonId: 'g12-l21', type: 'short', difficulty: 'apply',
    objective: 'Nhận biết hợp kim theo ứng dụng.',
    content: 'Hợp kim nhẹ, bền của nhôm (Al – Cu – Mn – Mg) dùng trong ngành hàng không có tên là gì?',
    correctAnswer: { accepted: ['duralumin', 'đuyra', 'duyra'], compact: true },
    explanation: 'Duralumin nhẹ và bền.'
  },

  /* ----- Bài 22. Sự ăn mòn kim loại ----- */
  {
    id: 'g12-l22-q1', lessonId: 'g12-l22', type: 'single', difficulty: 'recognize',
    objective: 'Nêu thành phần của gỉ sắt.',
    content: 'Thành phần chính của gỉ sắt là',
    options: [
      { id: 'a', text: 'FeO' },
      { id: 'b', text: 'Fe₃O₄' },
      { id: 'c', text: 'Fe₂O₃·nH₂O' },
      { id: 'd', text: 'FeCl₃' }
    ],
    correctAnswer: 'c',
    explanation: 'Gỉ sắt là oxide sắt(III) ngậm nước.'
  },
  {
    id: 'g12-l22-q2', lessonId: 'g12-l22', type: 'multiple', difficulty: 'understand',
    objective: 'Nêu điều kiện ăn mòn điện hóa.',
    content: 'Chọn tất cả điều kiện cần cho ăn mòn điện hóa.',
    options: [
      { id: 'a', text: 'Các điện cực khác nhau về bản chất.' },
      { id: 'b', text: 'Các điện cực tiếp xúc trực tiếp hoặc qua dây dẫn.' },
      { id: 'c', text: 'Các điện cực cùng tiếp xúc với dung dịch chất điện li.' },
      { id: 'd', text: 'Nhiệt độ phải trên 500 °C.', feedback: 'Ăn mòn điện hóa xảy ra ở nhiệt độ thường.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Thiếu một trong ba điều kiện thì không xảy ra ăn mòn điện hóa.'
  },
  {
    id: 'g12-l22-q3', lessonId: 'g12-l22', type: 'truefalse', difficulty: 'apply',
    objective: 'Xác định kim loại bị ăn mòn trong cặp điện cực.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Cặp Fe – Cu trong không khí ẩm: Fe bị ăn mòn.', explanation: 'Fe có E° nhỏ hơn.' },
      { id: 'b', text: 'Tôn bị xước: Fe bị ăn mòn trước Zn.', explanation: 'Zn bị ăn mòn trước.' },
      { id: 'c', text: 'Sắt tây bị xước sâu: Fe bị ăn mòn.', explanation: 'Fe có tính khử mạnh hơn Sn.' },
      { id: 'd', text: 'Ăn mòn hóa học có phát sinh dòng điện.', explanation: 'Chỉ ăn mòn điện hóa phát sinh dòng điện.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Kim loại có tính khử mạnh hơn là anode, bị ăn mòn.'
  },
  {
    id: 'g12-l22-q4', lessonId: 'g12-l22', type: 'single', difficulty: 'apply',
    objective: 'Chọn kim loại bảo vệ theo phương pháp điện hóa.',
    content: 'Để bảo vệ ống thép dẫn nước ngầm theo phương pháp điện hóa, nên nối ống với',
    options: [
      { id: 'a', text: 'thanh Cu' },
      { id: 'b', text: 'thanh Mg' },
      { id: 'c', text: 'thanh Ag' },
      { id: 'd', text: 'thanh Sn' }
    ],
    correctAnswer: 'b',
    explanation: 'Mg có tính khử mạnh hơn Fe nên làm vật hi sinh.'
  },
  {
    id: 'g12-l22-q5', lessonId: 'g12-l22', type: 'short', difficulty: 'understand',
    objective: 'Phân loại ăn mòn kim loại.',
    content: 'Sắt bị gỉ trong không khí ẩm thuộc loại ăn mòn nào?',
    correctAnswer: { accepted: ['ăn mòn điện hóa', 'an mon dien hoa', 'điện hóa', 'ăn mòn điện hoá'], compact: true },
    explanation: 'Gang, thép (Fe – C) cùng tiếp xúc lớp nước có hòa tan khí tạo pin điện hóa.'
  },
  {
    id: 'g12-l22-q6', lessonId: 'g12-l22', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính khối lượng kim loại hi sinh bị ăn mòn.',
    content: 'Một khối kẽm bảo vệ vỏ tàu bị ăn mòn, giải phóng tổng cộng 0,4 mol electron. Tính khối lượng Zn đã bị ăn mòn (Zn = 65).',
    correctAnswer: { value: 13, unit: 'g', tolerance: 0.02 },
    verify: () => 0.4 / 2 * molarMass('Zn'),
    solution: ['Zn → Zn²⁺ + 2e ⇒ n(Zn) = 0,4 / 2 = 0,2 mol.', 'm = 0,2 × 65 = 13 g.'],
    explanation: 'Mỗi nguyên tử Zn nhường 2 electron.'
  },

  /* ----- Bài 23. Ôn tập chương 6 ----- */
  {
    id: 'g12-l23-q1', lessonId: 'g12-l23', type: 'single', difficulty: 'understand',
    objective: 'Chọn phương pháp điều chế kim loại.',
    content: 'Kim loại nào điều chế được bằng phương pháp nhiệt luyện?',
    options: [
      { id: 'a', text: 'Na' },
      { id: 'b', text: 'Mg' },
      { id: 'c', text: 'Fe' },
      { id: 'd', text: 'Al' }
    ],
    correctAnswer: 'c',
    explanation: 'Fe có độ hoạt động trung bình, oxide bị CO, C, H₂ khử.'
  },
  {
    id: 'g12-l23-q2', lessonId: 'g12-l23', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định phản ứng xảy ra giữa kim loại và dung dịch muối.',
    content: 'Chọn tất cả phản ứng xảy ra được.',
    options: [
      { id: 'a', text: 'Zn + CuSO₄' },
      { id: 'b', text: 'Fe + AgNO₃' },
      { id: 'c', text: 'Cu + FeSO₄', feedback: 'Cu có tính khử yếu hơn Fe.' },
      { id: 'd', text: 'Mg + FeCl₂' },
      { id: 'e', text: 'Ag + CuSO₄', feedback: 'Ag có tính khử yếu hơn Cu.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Kim loại có tính khử mạnh hơn đẩy kim loại yếu hơn khỏi muối.'
  },
  {
    id: 'g12-l23-q3', lessonId: 'g12-l23', type: 'truefalse', difficulty: 'understand',
    objective: 'Hệ thống kiến thức đại cương kim loại.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Tính chất hóa học chung của kim loại là tính khử.', explanation: 'M → Mⁿ⁺ + ne.' },
      { id: 'b', text: 'Ag dẫn điện tốt nhất trong các kim loại.', explanation: 'Đúng.' },
      { id: 'c', text: 'Hợp kim dẫn điện tốt hơn kim loại nguyên chất.', explanation: 'Thường kém hơn.' },
      { id: 'd', text: 'Phủ sơn lên sắt là phương pháp điện hóa chống ăn mòn.', explanation: 'Đó là phương pháp bảo vệ bề mặt.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: false },
    explanation: 'Ôn lại tính chất, hợp kim và chống ăn mòn.'
  },
  {
    id: 'g12-l23-q4', lessonId: 'g12-l23', type: 'numeric', difficulty: 'apply',
    objective: 'Giải bài toán hỗn hợp kim loại với acid.',
    content: 'Cho 10 g hỗn hợp Mg và Cu vào dung dịch HCl dư, thu được 2,479 L H₂ (điều kiện chuẩn). Tính khối lượng Cu (Mg = 24).',
    correctAnswer: { value: 7.6, unit: 'g', tolerance: 0.02 },
    verify: () => 10 - 2.479 / VM * molarMass('Mg'),
    solution: ['n(Mg) = n(H₂) = 0,1 mol ⇒ m(Mg) = 2,4 g.', 'm(Cu) = 10 − 2,4 = 7,6 g.'],
    explanation: 'Cu không phản ứng với HCl.'
  },
  {
    id: 'g12-l23-q5', lessonId: 'g12-l23', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính khối lượng thanh kim loại sau phản ứng với muối.',
    content: 'Nhúng thanh Zn nặng 50 g vào dung dịch CuSO₄; sau phản ứng có 0,2 mol Cu bám vào thanh. Tính khối lượng thanh kim loại sau phản ứng (Zn = 65, Cu = 64).',
    correctAnswer: { value: 49.8, unit: 'g', tolerance: 0.02 },
    verify: () => 50 - 0.2 * (molarMass('Zn') - molarMass('Cu')),
    solution: ['Mỗi mol phản ứng: Zn tan 65 g, Cu bám 64 g ⇒ giảm 1 g.', 'm = 50 − 0,2 × 1 = 49,8 g.'],
    explanation: 'Khối lượng thanh giảm vì M(Zn) > M(Cu).',
    equations: ['Zn + CuSO₄ → ZnSO₄ + Cu']
  },
  {
    id: 'g12-l23-q6', lessonId: 'g12-l23', type: 'short', difficulty: 'apply',
    objective: 'Chọn kim loại làm vật hi sinh.',
    content: 'Trong hai kim loại Zn và Cu, kim loại nào dùng làm vật hi sinh để bảo vệ vỏ tàu bằng thép? (ghi kí hiệu)',
    correctAnswer: { accepted: ['Zn', 'kẽm', 'kem', 'zinc'], compact: true },
    explanation: 'Zn có tính khử mạnh hơn Fe; Cu yếu hơn Fe sẽ làm Fe bị ăn mòn nhanh hơn.'
  }
]
