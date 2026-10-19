// Hóa học 12 · Chương 3 — Hợp chất chứa nitrogen. Questions for Bài 8–11.
import { molarMass } from '../chemMath.js'

const GLY = 'C2H5NO2'
const ALA = 'C3H7NO2'
const LYS = 'C6H14N2O2'
const GLU = 'C5H9NO4'

export const questions = [
  /* ----- Bài 8. Amine ----- */
  {
    id: 'g12-l8-q1', lessonId: 'g12-l8', type: 'single', difficulty: 'recognize',
    objective: 'Xác định bậc amine.',
    content: 'Trimethylamine (CH₃)₃N là amine bậc',
    options: [
      { id: 'a', text: 'I' },
      { id: 'b', text: 'II' },
      { id: 'c', text: 'III' },
      { id: 'd', text: 'IV' }
    ],
    correctAnswer: 'c',
    explanation: 'N liên kết với ba gốc hydrocarbon.'
  },
  {
    id: 'g12-l8-q2', lessonId: 'g12-l8', type: 'short', difficulty: 'understand',
    objective: 'Gọi tên amine.',
    content: 'Gọi tên gốc – chức của amine C₂H₅NH₂.',
    correctAnswer: { accepted: ['ethylamine', 'ethyl amine', 'ethanamine'], compact: true },
    explanation: 'Gốc ethyl + amine (tên thay thế: ethanamine).'
  },
  {
    id: 'g12-l8-q3', lessonId: 'g12-l8', type: 'truefalse', difficulty: 'understand',
    objective: 'Trình bày tính chất của amine.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Dung dịch methylamine làm quỳ tím hóa xanh.', explanation: 'Amine béo có tính base.' },
      { id: 'b', text: 'Aniline làm quỳ tím hóa xanh.', explanation: 'Tính base của aniline rất yếu.' },
      { id: 'c', text: 'Ethylamine tác dụng với HNO₂ giải phóng khí N₂.', explanation: 'Amine béo bậc I + HNO₂ → alcohol + N₂ + H₂O.' },
      { id: 'd', text: 'Aniline là chất lỏng, tan vô hạn trong nước.', explanation: 'Aniline ít tan trong nước.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Gốc phenyl làm giảm mạnh tính base và độ tan của aniline.',
    equations: ['C₂H₅NH₂ + HNO₂ → C₂H₅OH + N₂ + H₂O']
  },
  {
    id: 'g12-l8-q4', lessonId: 'g12-l8', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định chất phản ứng với methylamine.',
    content: 'Chọn tất cả chất phản ứng được với dung dịch methylamine.',
    options: [
      { id: 'a', text: 'HCl' },
      { id: 'b', text: 'FeCl₃' },
      { id: 'c', text: 'NaOH', feedback: 'Methylamine có tính base, không phản ứng với base.' },
      { id: 'd', text: 'CH₃COOH' },
      { id: 'e', text: 'NaCl', feedback: 'Không phản ứng.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Methylamine phản ứng với acid và với dung dịch muối tạo hydroxide kết tủa.',
    equations: ['3CH₃NH₂ + FeCl₃ + 3H₂O → Fe(OH)₃ + 3CH₃NH₃Cl']
  },
  {
    id: 'g12-l8-q5', lessonId: 'g12-l8', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng muối khi amine tác dụng với HCl.',
    content: 'Cho 6,2 g methylamine tác dụng vừa đủ với HCl. Tính khối lượng muối thu được (C = 12, H = 1, N = 14, Cl = 35,5).',
    correctAnswer: { value: 13.5, unit: 'g', tolerance: 0.02 },
    verify: () => 6.2 / molarMass('CH5N') * molarMass('CH6NCl'),
    solution: ['n(CH₃NH₂) = 6,2 / 31 = 0,2 mol = n(CH₃NH₃Cl).', 'm = 0,2 × 67,5 = 13,5 g.'],
    explanation: 'Có thể dùng bảo toàn khối lượng: 6,2 + 0,2 × 36,5 = 13,5 g.',
    equations: ['CH₃NH₂ + HCl → CH₃NH₃Cl']
  },
  {
    id: 'g12-l8-q6', lessonId: 'g12-l8', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng aniline từ lượng kết tủa với bromine.',
    content: 'Cho aniline tác dụng với nước bromine dư thu được 19,8 g kết tủa trắng. Tính khối lượng aniline đã phản ứng (Br = 80).',
    correctAnswer: { value: 5.58, unit: 'g', tolerance: 0.02 },
    verify: () => 19.8 / molarMass('C6H4Br3N') * molarMass('C6H7N'),
    solution: ['M(C₆H₂Br₃NH₂) = 330 ⇒ n = 19,8 / 330 = 0,06 mol.', 'm(aniline) = 0,06 × 93 = 5,58 g.'],
    explanation: 'Tỉ lệ mol aniline : 2,4,6-tribromoaniline = 1 : 1.',
    equations: ['C₆H₅NH₂ + 3Br₂ → C₆H₂Br₃NH₂ + 3HBr']
  },
  {
    id: 'g12-l8-q7', lessonId: 'g12-l8', type: 'numeric', difficulty: 'advanced',
    objective: 'Xác định công thức amine từ phản ứng với HCl.',
    content: 'Cho 5,9 g một amine no, đơn chức, mạch hở tác dụng vừa đủ với HCl thu được 9,55 g muối. Phân tử amine có bao nhiêu nguyên tử carbon?',
    correctAnswer: { value: 3 },
    verify: () => (5.9 / ((9.55 - 5.9) / 36.5) - 17) / 14,
    solution: ['n(HCl) = (9,55 − 5,9) / 36,5 = 0,1 mol = n(amine) ⇒ M = 59.', 'CₙH₂ₙ₊₃N: 14n + 17 = 59 ⇒ n = 3 (C₃H₉N).'],
    explanation: 'Bảo toàn khối lượng cho số mol HCl, từ đó tìm phân tử khối.'
  },

  /* ----- Bài 9. Amino acid và peptide ----- */
  {
    id: 'g12-l9-q1', lessonId: 'g12-l9', type: 'single', difficulty: 'recognize',
    objective: 'Nhận biết công thức amino acid.',
    content: 'Công thức của alanine là',
    options: [
      { id: 'a', text: 'H₂NCH₂COOH', feedback: 'Đây là glycine.' },
      { id: 'b', text: 'CH₃CH(NH₂)COOH' },
      { id: 'c', text: 'H₂N[CH₂]₄CH(NH₂)COOH', feedback: 'Đây là lysine.' },
      { id: 'd', text: 'C₆H₅NH₂' }
    ],
    correctAnswer: 'b',
    explanation: 'Alanine (Ala): α-aminopropionic acid, M = 89.'
  },
  {
    id: 'g12-l9-q2', lessonId: 'g12-l9', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định tính chất của glycine.',
    content: 'Chọn tất cả tính chất của glycine.',
    options: [
      { id: 'a', text: 'Tác dụng với dung dịch HCl.' },
      { id: 'b', text: 'Tác dụng với dung dịch NaOH.' },
      { id: 'c', text: 'Là chất rắn, dễ tan trong nước.' },
      { id: 'd', text: 'Có phản ứng màu biuret.', feedback: 'Amino acid không có liên kết peptide.' },
      { id: 'e', text: 'Làm quỳ tím hóa xanh.', feedback: 'Glycine có số nhóm −NH₂ bằng số nhóm −COOH nên không làm đổi màu quỳ.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Glycine lưỡng tính, tồn tại dạng ion lưỡng cực.',
    equations: ['H₂NCH₂COOH + NaOH → H₂NCH₂COONa + H₂O']
  },
  {
    id: 'g12-l9-q3', lessonId: 'g12-l9', type: 'truefalse', difficulty: 'understand',
    objective: 'Mô tả peptide và tính chất.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Liên kết peptide là liên kết −CO−NH− giữa hai gốc α-amino acid.', explanation: 'Đúng định nghĩa.' },
      { id: 'b', text: 'Tripeptide có 3 liên kết peptide.', explanation: 'Tripeptide có 2 liên kết peptide.' },
      { id: 'c', text: 'Gly-Ala-Val có phản ứng màu biuret.', explanation: 'Có 2 liên kết peptide.' },
      { id: 'd', text: 'Thủy phân hoàn toàn peptide thu được các α-amino acid.', explanation: 'Liên kết peptide bị cắt hết.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: true },
    explanation: 'Peptide có n gốc thì có n − 1 liên kết peptide.'
  },
  {
    id: 'g12-l9-q4', lessonId: 'g12-l9', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng muối khi amino acid tác dụng với NaOH.',
    content: 'Cho 8,9 g alanine tác dụng vừa đủ với NaOH. Tính khối lượng muối thu được (C = 12, H = 1, O = 16, N = 14, Na = 23).',
    correctAnswer: { value: 11.1, unit: 'g', tolerance: 0.02 },
    verify: () => 8.9 / molarMass(ALA) * molarMass('C3H6NO2Na'),
    solution: ['n(Ala) = 8,9 / 89 = 0,1 mol.', 'Muối CH₃CH(NH₂)COONa: M = 111 ⇒ m = 11,1 g.'],
    explanation: 'Mỗi mol −COOH thành −COONa tăng 22 g.'
  },
  {
    id: 'g12-l9-q5', lessonId: 'g12-l9', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng muối khi amino acid tác dụng với HCl.',
    content: 'Cho 15 g glycine tác dụng vừa đủ với dung dịch HCl. Tính khối lượng muối thu được.',
    correctAnswer: { value: 22.3, unit: 'g', tolerance: 0.02 },
    verify: () => 15 / molarMass(GLY) * molarMass('C2H6NO2Cl'),
    solution: ['n(Gly) = 15 / 75 = 0,2 mol = n(HCl).', 'm(muối) = 15 + 0,2 × 36,5 = 22,3 g.'],
    explanation: 'Nhóm −NH₂ nhận HCl tạo −NH₃Cl.',
    equations: ['H₂NCH₂COOH + HCl → ClH₃NCH₂COOH']
  },
  {
    id: 'g12-l9-q6', lessonId: 'g12-l9', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính phân tử khối của peptide.',
    content: 'Tính phân tử khối của tripeptide Gly-Gly-Ala (Gly: 75; Ala: 89).',
    correctAnswer: { value: 203 },
    verify: () => 2 * molarMass(GLY) + molarMass(ALA) - 2 * molarMass('H2O'),
    solution: ['Tạo 2 liên kết peptide tách 2 phân tử H₂O.', 'M = 75 + 75 + 89 − 2 × 18 = 203.'],
    explanation: 'Peptide n gốc: M = tổng M các amino acid − (n − 1) × 18.'
  },
  {
    id: 'g12-l9-q7', lessonId: 'g12-l9', type: 'short', difficulty: 'apply',
    objective: 'Gọi tên peptide theo kí hiệu.',
    content: 'Dipeptide tạo từ alanine (đầu N, còn nhóm −NH₂ tự do) và glycine (đầu C) có tên viết tắt là gì?',
    placeholder: 'Ví dụ: Gly-Val',
    correctAnswer: { accepted: ['Ala-Gly', 'AlaGly'], compact: true },
    explanation: 'Tên peptide viết từ amino acid đầu N đến đầu C: Ala-Gly.'
  },

  /* ----- Bài 10. Protein và enzyme ----- */
  {
    id: 'g12-l10-q1', lessonId: 'g12-l10', type: 'single', difficulty: 'recognize',
    objective: 'Nhận biết protein bằng phản ứng màu.',
    content: 'Cho Cu(OH)₂ trong NaOH vào dung dịch lòng trắng trứng, xuất hiện màu',
    options: [
      { id: 'a', text: 'tím' },
      { id: 'b', text: 'vàng' },
      { id: 'c', text: 'xanh lam' },
      { id: 'd', text: 'đỏ gạch' }
    ],
    correctAnswer: 'a',
    explanation: 'Phản ứng màu biuret của protein.'
  },
  {
    id: 'g12-l10-q2', lessonId: 'g12-l10', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định tác nhân gây đông tụ protein.',
    content: 'Chọn tất cả tác nhân làm protein dạng cầu (như lòng trắng trứng) bị đông tụ.',
    options: [
      { id: 'a', text: 'Đun nóng' },
      { id: 'b', text: 'Thêm acid' },
      { id: 'c', text: 'Thêm muối kim loại nặng (như CuSO₄)' },
      { id: 'd', text: 'Pha loãng bằng nước cất', feedback: 'Pha loãng không làm protein biến tính.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Nhiệt, acid, base, muối kim loại nặng làm protein biến tính, đông tụ.'
  },
  {
    id: 'g12-l10-q3', lessonId: 'g12-l10', type: 'truefalse', difficulty: 'understand',
    objective: 'Nêu đặc điểm của protein và enzyme.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Keratin (tóc, móng) là protein dạng sợi, không tan trong nước.', explanation: 'Protein dạng sợi không tan.' },
      { id: 'b', text: 'Hầu hết enzyme có bản chất là protein.', explanation: 'Đúng.' },
      { id: 'c', text: 'Mỗi enzyme xúc tác được cho mọi loại phản ứng.', explanation: 'Enzyme có tính chọn lọc cao.' },
      { id: 'd', text: 'Nhỏ HNO₃ đặc vào lòng trắng trứng thấy kết tủa vàng.', explanation: 'Do nitro hóa vòng benzene trong một số gốc amino acid.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'Enzyme là xúc tác sinh học có tính chọn lọc cao.'
  },
  {
    id: 'g12-l10-q4', lessonId: 'g12-l10', type: 'numeric', difficulty: 'apply',
    objective: 'Tính số mắt xích amino acid trong protein.',
    content: 'Thủy phân hoàn toàn 1000 g protein X (phân tử khối 100 000) thu được 75 g glycine. Mỗi phân tử X có bao nhiêu gốc glycine?',
    correctAnswer: { value: 100 },
    verify: () => (75 / molarMass(GLY)) / (1000 / 100000),
    solution: ['n(X) = 1000 / 100 000 = 0,01 mol; n(Gly) = 75 / 75 = 1 mol.', 'Số gốc Gly = 1 / 0,01 = 100.'],
    explanation: 'Số gốc = n(amino acid) / n(protein).'
  },
  {
    id: 'g12-l10-q5', lessonId: 'g12-l10', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính phân tử khối protein từ thành phần nguyên tố.',
    content: 'Một loại hemoglobin chứa 0,4% Fe về khối lượng; mỗi phân tử chứa 1 nguyên tử Fe. Tính phân tử khối của hemoglobin này (Fe = 56).',
    correctAnswer: { value: 14000, tolerance: 0.01 },
    verify: () => molarMass('Fe') / 0.004,
    solution: ['M × 0,4% = 56 (khối lượng của 1 Fe).', 'M = 56 / 0,004 = 14 000.'],
    explanation: 'Phần trăm khối lượng nguyên tố = M(nguyên tố trong phân tử) / M(phân tử).'
  },
  {
    id: 'g12-l10-q6', lessonId: 'g12-l10', type: 'short', difficulty: 'understand',
    objective: 'Gọi tên phản ứng màu đặc trưng của protein.',
    content: 'Phản ứng của protein với Cu(OH)₂ trong môi trường kiềm tạo màu tím có tên là gì?',
    correctAnswer: { accepted: ['biuret', 'phản ứng biuret', 'phan ung biuret', 'màu biuret'], compact: true },
    explanation: 'Phản ứng màu biuret, dùng nhận biết peptide (từ tripeptide) và protein.'
  },
  {
    id: 'g12-l10-q7', lessonId: 'g12-l10', type: 'single', difficulty: 'apply',
    objective: 'Vận dụng tính chọn lọc của enzyme.',
    content: 'Enzyme amylase trong nước bọt xúc tác cho quá trình',
    options: [
      { id: 'a', text: 'thủy phân tinh bột' },
      { id: 'b', text: 'thủy phân chất béo' },
      { id: 'c', text: 'thủy phân protein' },
      { id: 'd', text: 'lên men glucose' }
    ],
    correctAnswer: 'a',
    explanation: 'Amylase thủy phân tinh bột; lipase thủy phân chất béo; protease thủy phân protein.'
  },

  /* ----- Bài 11. Ôn tập chương 3 ----- */
  {
    id: 'g12-l11-q1', lessonId: 'g12-l11', type: 'single', difficulty: 'understand',
    objective: 'Dự đoán màu quỳ tím với amino acid.',
    content: 'Dung dịch lysine làm quỳ tím',
    options: [
      { id: 'a', text: 'hóa xanh' },
      { id: 'b', text: 'hóa đỏ' },
      { id: 'c', text: 'không đổi màu' },
      { id: 'd', text: 'mất màu' }
    ],
    correctAnswer: 'a',
    explanation: 'Lysine có 2 nhóm −NH₂ và 1 nhóm −COOH.'
  },
  {
    id: 'g12-l11-q2', lessonId: 'g12-l11', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định chất có tính lưỡng tính.',
    content: 'Chọn tất cả chất vừa tác dụng với HCl, vừa tác dụng với NaOH.',
    options: [
      { id: 'a', text: 'Glycine' },
      { id: 'b', text: 'Alanine' },
      { id: 'c', text: 'Aniline', feedback: 'Aniline chỉ có tính base yếu.' },
      { id: 'd', text: 'Gly-Ala (khi đun nóng)' },
      { id: 'e', text: 'Methylamine', feedback: 'Methylamine không tác dụng với NaOH.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Amino acid lưỡng tính; peptide bị thủy phân trong cả acid và base khi đun nóng.'
  },
  {
    id: 'g12-l11-q3', lessonId: 'g12-l11', type: 'truefalse', difficulty: 'understand',
    objective: 'Hệ thống tính chất các hợp chất chứa nitrogen.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Glutamic acid làm quỳ tím hóa đỏ.', explanation: 'Có 2 nhóm −COOH, 1 nhóm −NH₂.' },
      { id: 'b', text: 'Aniline tác dụng với dung dịch NaOH.', explanation: 'Aniline không có tính acid.' },
      { id: 'c', text: 'Protein đơn giản thủy phân hoàn toàn tạo các α-amino acid.', explanation: 'Đúng.' },
      { id: 'd', text: 'Mọi peptide đều có phản ứng màu biuret.', explanation: 'Dipeptide không có.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Chú ý số nhóm chức và số liên kết peptide.'
  },
  {
    id: 'g12-l11-q4', lessonId: 'g12-l11', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng muối của amino acid có 2 nhóm −COOH.',
    content: 'Cho 14,7 g glutamic acid tác dụng vừa đủ với NaOH. Tính khối lượng muối thu được.',
    correctAnswer: { value: 19.1, unit: 'g', tolerance: 0.02 },
    verify: () => 14.7 / molarMass(GLU) * molarMass('C5H7NO4Na2'),
    solution: ['n(Glu) = 14,7 / 147 = 0,1 mol; có 2 nhóm −COOH ⇒ n(NaOH) = 0,2 mol.', 'm(muối) = 14,7 + 0,2 × 22 = 19,1 g.'],
    explanation: 'Mỗi nhóm −COOH tạo −COONa làm khối lượng tăng 22 g/mol.'
  },
  {
    id: 'g12-l11-q5', lessonId: 'g12-l11', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng muối của amino acid có 2 nhóm −NH₂.',
    content: 'Cho 14,6 g lysine tác dụng với HCl dư. Tính khối lượng muối thu được.',
    correctAnswer: { value: 21.9, unit: 'g', tolerance: 0.02 },
    verify: () => 14.6 / molarMass(LYS) * molarMass('C6H16N2O2Cl2'),
    solution: ['n(Lys) = 14,6 / 146 = 0,1 mol; có 2 nhóm −NH₂ ⇒ n(HCl) = 0,2 mol.', 'm(muối) = 14,6 + 0,2 × 36,5 = 21,9 g.'],
    explanation: 'Mỗi nhóm −NH₂ nhận 1 HCl.'
  },
  {
    id: 'g12-l11-q6', lessonId: 'g12-l11', type: 'numeric', difficulty: 'advanced',
    objective: 'Bảo toàn khối lượng khi thủy phân peptide.',
    content: 'Thủy phân hoàn toàn 20,3 g tripeptide Gly-Gly-Ala. Tính tổng khối lượng amino acid thu được.',
    correctAnswer: { value: 23.9, unit: 'g', tolerance: 0.02 },
    verify: () => 20.3 + 20.3 / 203 * 2 * molarMass('H2O'),
    solution: ['M(Gly-Gly-Ala) = 203 ⇒ n = 0,1 mol; thủy phân cần 2 × 0,1 = 0,2 mol H₂O.', 'm(amino acid) = 20,3 + 0,2 × 18 = 23,9 g.'],
    explanation: 'Thủy phân peptide n gốc cần n − 1 phân tử nước.'
  },
  {
    id: 'g12-l11-q7', lessonId: 'g12-l11', type: 'single', difficulty: 'advanced',
    objective: 'Đếm số dipeptide tạo thành từ hai amino acid.',
    content: 'Từ glycine và alanine có thể tạo tối đa bao nhiêu dipeptide (kể cả dipeptide tạo từ cùng một loại amino acid)?',
    options: [
      { id: 'a', text: '2' },
      { id: 'b', text: '3' },
      { id: 'c', text: '4' },
      { id: 'd', text: '6' }
    ],
    correctAnswer: 'c',
    explanation: 'Gly-Gly, Ala-Ala, Gly-Ala, Ala-Gly: thứ tự đầu N – đầu C khác nhau cho chất khác nhau.'
  }
]
