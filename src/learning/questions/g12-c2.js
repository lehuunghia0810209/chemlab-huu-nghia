// Hóa học 12 · Chương 2 — Carbohydrate. Questions for Bài 4–7.
import { molarMass, GAS_VOLUME_STANDARD as VM } from '../chemMath.js'

const GLUCOSE = 'C6H12O6'
const SUCROSE = 'C12H22O11'
const STARCH_UNIT = 'C6H10O5'

export const questions = [
  /* ----- Bài 4. Glucose và fructose ----- */
  {
    id: 'g12-l4-q1', lessonId: 'g12-l4', type: 'single', difficulty: 'recognize',
    objective: 'Nêu trạng thái tự nhiên của glucose.',
    content: 'Glucose có nhiều trong quả nho chín nên còn được gọi là',
    options: [
      { id: 'a', text: 'đường mía' },
      { id: 'b', text: 'đường nho' },
      { id: 'c', text: 'đường mạch nha' },
      { id: 'd', text: 'đường mật ong' }
    ],
    correctAnswer: 'b',
    explanation: 'Đường mía là saccharose, mạch nha là maltose; mật ong chứa nhiều fructose.'
  },
  {
    id: 'g12-l4-q2', lessonId: 'g12-l4', type: 'truefalse', difficulty: 'understand',
    objective: 'Mô tả cấu tạo và tính chất của glucose, fructose.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Glucose và fructose là đồng phân của nhau.', explanation: 'Cùng công thức C₆H₁₂O₆, khác cấu tạo.' },
      { id: 'b', text: 'Fructose làm mất màu nước bromine.', explanation: 'Chỉ glucose (có nhóm −CHO) làm mất màu nước bromine.' },
      { id: 'c', text: 'Trong dung dịch, glucose tồn tại chủ yếu ở dạng mạch vòng.', explanation: 'Dạng α và β vòng 6 cạnh chiếm chủ yếu.' },
      { id: 'd', text: 'Fructose có nhóm chức aldehyde.', explanation: 'Fructose có nhóm ketone ở C2.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Glucose là aldose, fructose là ketose; nước bromine phân biệt hai chất.'
  },
  {
    id: 'g12-l4-q3', lessonId: 'g12-l4', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định các phản ứng của glucose.',
    content: 'Chọn tất cả phản ứng mà glucose tham gia được.',
    options: [
      { id: 'a', text: 'Hòa tan Cu(OH)₂ ở nhiệt độ thường' },
      { id: 'b', text: 'Tráng bạc với thuốc thử Tollens' },
      { id: 'c', text: 'Thủy phân trong môi trường acid', feedback: 'Glucose là monosaccharide, không bị thủy phân.' },
      { id: 'd', text: 'Lên men tạo ethanol' },
      { id: 'e', text: 'Làm mất màu nước bromine' }
    ],
    correctAnswer: ['a', 'b', 'd', 'e'],
    explanation: 'Glucose có tính chất của polyalcohol, của aldehyde và lên men được.',
    equations: ['C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂']
  },
  {
    id: 'g12-l4-q4', lessonId: 'g12-l4', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng Ag khi glucose tráng bạc.',
    content: 'Cho 27 g glucose tác dụng với thuốc thử Tollens dư, đun nóng. Tính khối lượng Ag thu được (C = 12, H = 1, O = 16, Ag = 108).',
    correctAnswer: { value: 32.4, unit: 'g', tolerance: 0.02 },
    verify: () => 27 / molarMass(GLUCOSE) * 2 * molarMass('Ag'),
    solution: ['n(glucose) = 27 / 180 = 0,15 mol ⇒ n(Ag) = 0,3 mol.', 'm(Ag) = 0,3 × 108 = 32,4 g.'],
    explanation: '1 mol glucose tạo 2 mol Ag.'
  },
  {
    id: 'g12-l4-q5', lessonId: 'g12-l4', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng ethanol từ lên men glucose.',
    content: 'Lên men 90 g glucose với hiệu suất 80%. Tính khối lượng ethanol thu được.',
    correctAnswer: { value: 36.8, unit: 'g', tolerance: 0.02 },
    verify: () => 90 / molarMass(GLUCOSE) * 2 * 0.8 * molarMass('C2H6O'),
    solution: ['n(glucose) = 90 / 180 = 0,5 mol ⇒ ethanol = 2 × 0,5 × 80% = 0,8 mol.', 'm = 0,8 × 46 = 36,8 g.'],
    explanation: 'C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂.',
    equations: ['C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂']
  },
  {
    id: 'g12-l4-q6', lessonId: 'g12-l4', type: 'short', difficulty: 'understand',
    objective: 'Xác định sản phẩm oxi hóa glucose bằng nước bromine.',
    content: 'Glucose làm mất màu nước bromine, tạo thành acid nào?',
    correctAnswer: { accepted: ['gluconic acid', 'acid gluconic', 'gluconic'], compact: true },
    explanation: 'Nhóm −CHO bị oxi hóa thành −COOH: gluconic acid.',
    equations: ['C₆H₁₂O₆ + Br₂ + H₂O → C₆H₁₂O₇ + 2HBr']
  },
  {
    id: 'g12-l4-q7', lessonId: 'g12-l4', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính lượng glucose cần cho phản ứng tráng gương.',
    content: 'Để tráng một tấm gương cần 10,8 g Ag. Tính khối lượng glucose tối thiểu cần dùng (hiệu suất 100%).',
    correctAnswer: { value: 9, unit: 'g', tolerance: 0.02 },
    verify: () => 10.8 / molarMass('Ag') / 2 * molarMass(GLUCOSE),
    solution: ['n(Ag) = 10,8 / 108 = 0,1 mol ⇒ n(glucose) = 0,05 mol.', 'm = 0,05 × 180 = 9 g.'],
    explanation: 'Tính ngược từ sản phẩm theo tỉ lệ glucose : Ag = 1 : 2.'
  },

  /* ----- Bài 5. Saccharose và maltose ----- */
  {
    id: 'g12-l5-q1', lessonId: 'g12-l5', type: 'single', difficulty: 'recognize',
    objective: 'Nêu trạng thái tự nhiên của saccharose.',
    content: 'Saccharose có nhiều trong',
    options: [
      { id: 'a', text: 'cây mía' },
      { id: 'b', text: 'mạch nha' },
      { id: 'c', text: 'quả nho chín' },
      { id: 'd', text: 'hạt gạo', feedback: 'Gạo chứa chủ yếu tinh bột.' }
    ],
    correctAnswer: 'a',
    explanation: 'Saccharose có trong mía, củ cải đường, hoa thốt nốt.'
  },
  {
    id: 'g12-l5-q2', lessonId: 'g12-l5', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định tính chất của maltose.',
    content: 'Chọn tất cả tính chất của maltose.',
    options: [
      { id: 'a', text: 'Hòa tan Cu(OH)₂ ở nhiệt độ thường.' },
      { id: 'b', text: 'Tham gia phản ứng tráng bạc.' },
      { id: 'c', text: 'Thủy phân tạo glucose và fructose.', feedback: 'Maltose thủy phân tạo hai phân tử glucose.' },
      { id: 'd', text: 'Bị thủy phân trong môi trường acid.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Maltose gồm hai gốc α-glucose, còn nhóm −OH hemiacetal.'
  },
  {
    id: 'g12-l5-q3', lessonId: 'g12-l5', type: 'truefalse', difficulty: 'understand',
    objective: 'So sánh cấu tạo saccharose và maltose.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Saccharose và maltose có cùng công thức phân tử C₁₂H₂₂O₁₁.', explanation: 'Hai chất là đồng phân.' },
      { id: 'b', text: 'Saccharose tham gia phản ứng tráng bạc.', explanation: 'Saccharose không còn nhóm −OH hemiacetal.' },
      { id: 'c', text: 'Trong maltose, hai gốc α-glucose nối với nhau bằng liên kết α-1,4-glycoside.', explanation: 'Đúng theo cấu tạo maltose.' },
      { id: 'd', text: 'Saccharose không hòa tan được Cu(OH)₂.', explanation: 'Saccharose có nhiều OH kề nhau, hòa tan Cu(OH)₂ tạo dung dịch xanh lam.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Khác biệt chính: maltose còn nhóm −OH hemiacetal, saccharose thì không.'
  },
  {
    id: 'g12-l5-q4', lessonId: 'g12-l5', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng glucose khi thủy phân saccharose.',
    content: 'Thủy phân hoàn toàn 68,4 g saccharose. Tính khối lượng glucose thu được.',
    correctAnswer: { value: 36, unit: 'g', tolerance: 0.02 },
    verify: () => 68.4 / molarMass(SUCROSE) * molarMass(GLUCOSE),
    solution: ['n(saccharose) = 68,4 / 342 = 0,2 mol ⇒ n(glucose) = 0,2 mol.', 'm = 0,2 × 180 = 36 g.'],
    explanation: '1 saccharose → 1 glucose + 1 fructose.',
    equations: ['C₁₂H₂₂O₁₁ + H₂O → C₆H₁₂O₆ + C₆H₁₂O₆']
  },
  {
    id: 'g12-l5-q5', lessonId: 'g12-l5', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính lượng Ag sau khi thủy phân saccharose.',
    content: 'Thủy phân hoàn toàn 34,2 g saccharose, lấy toàn bộ dung dịch thu được cho tác dụng với thuốc thử Tollens dư. Tính khối lượng Ag thu được.',
    correctAnswer: { value: 43.2, unit: 'g', tolerance: 0.02 },
    verify: () => 34.2 / molarMass(SUCROSE) * 4 * molarMass('Ag'),
    solution: ['n(saccharose) = 0,1 mol ⇒ 0,1 mol glucose + 0,1 mol fructose.', 'Cả hai đều tráng bạc: n(Ag) = 2 × 0,2 = 0,4 mol ⇒ m = 43,2 g.'],
    explanation: 'Fructose cũng tráng bạc trong môi trường kiềm.'
  },
  {
    id: 'g12-l5-q6', lessonId: 'g12-l5', type: 'short', difficulty: 'understand',
    objective: 'Xác định sản phẩm thủy phân maltose.',
    content: 'Thủy phân hoàn toàn maltose chỉ thu được một loại monosaccharide. Đó là chất nào?',
    correctAnswer: { accepted: ['glucose', 'α-glucose', 'alpha-glucose'], compact: true },
    explanation: 'Maltose gồm hai gốc α-glucose.',
    equations: ['C₁₂H₂₂O₁₁ + H₂O → 2C₆H₁₂O₆']
  },
  {
    id: 'g12-l5-q7', lessonId: 'g12-l5', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng Ag khi maltose tráng bạc trực tiếp.',
    content: 'Cho 17,1 g maltose (chưa thủy phân) tác dụng với thuốc thử Tollens dư. Tính khối lượng Ag thu được.',
    correctAnswer: { value: 10.8, unit: 'g', tolerance: 0.02 },
    verify: () => 17.1 / molarMass(SUCROSE) * 2 * molarMass('Ag'),
    solution: ['n(maltose) = 17,1 / 342 = 0,05 mol; mỗi phân tử có một nhóm −CHO khi mở vòng ⇒ n(Ag) = 0,1 mol.', 'm = 0,1 × 108 = 10,8 g.'],
    explanation: 'Maltose chưa thủy phân chỉ có một đầu khử.'
  },

  /* ----- Bài 6. Tinh bột và cellulose ----- */
  {
    id: 'g12-l6-q1', lessonId: 'g12-l6', type: 'single', difficulty: 'recognize',
    objective: 'Nhận biết tinh bột bằng iodine.',
    content: 'Nhỏ dung dịch iodine vào hồ tinh bột thấy xuất hiện màu',
    options: [
      { id: 'a', text: 'xanh tím' },
      { id: 'b', text: 'đỏ gạch' },
      { id: 'c', text: 'vàng' },
      { id: 'd', text: 'xanh lam' }
    ],
    correctAnswer: 'a',
    explanation: 'Iodine hấp phụ vào mạch xoắn của tinh bột tạo màu xanh tím.'
  },
  {
    id: 'g12-l6-q2', lessonId: 'g12-l6', type: 'multiple', difficulty: 'understand',
    objective: 'So sánh tinh bột và cellulose.',
    content: 'Chọn tất cả điểm chung của tinh bột và cellulose.',
    options: [
      { id: 'a', text: 'Đều là polysaccharide.' },
      { id: 'b', text: 'Đều bị thủy phân hoàn toàn tạo glucose.' },
      { id: 'c', text: 'Đều tạo màu xanh tím với iodine.', feedback: 'Chỉ tinh bột.' },
      { id: 'd', text: 'Đều có công thức chung (C₆H₁₀O₅)ₙ.' },
      { id: 'e', text: 'Đều có mạch phân nhánh.', feedback: 'Cellulose và amylose không phân nhánh.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Hai chất khác nhau ở loại mắt xích (α hay β-glucose) và cấu trúc mạch.'
  },
  {
    id: 'g12-l6-q3', lessonId: 'g12-l6', type: 'truefalse', difficulty: 'understand',
    objective: 'Mô tả cấu tạo và ứng dụng của tinh bột, cellulose.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Amylopectin có mạch phân nhánh.', explanation: 'Có liên kết α-1,6-glycoside ở điểm nhánh.' },
      { id: 'b', text: 'Cellulose tan tốt trong nước nóng.', explanation: 'Cellulose không tan trong nước, kể cả nước nóng.' },
      { id: 'c', text: 'Cellulose tan trong nước Schweizer.', explanation: 'Dùng sản xuất tơ đồng – ammonia.' },
      { id: 'd', text: 'Mỗi mắt xích của cellulose có 3 nhóm OH.', explanation: '[C₆H₇O₂(OH)₃]ₙ.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: true },
    explanation: 'Cấu tạo mạch quyết định tính chất vật lí của tinh bột và cellulose.'
  },
  {
    id: 'g12-l6-q4', lessonId: 'g12-l6', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng glucose khi thủy phân tinh bột.',
    content: 'Thủy phân 162 g tinh bột với hiệu suất 81%. Tính khối lượng glucose thu được.',
    correctAnswer: { value: 145.8, unit: 'g', tolerance: 0.02 },
    verify: () => 162 / molarMass(STARCH_UNIT) * 0.81 * molarMass(GLUCOSE),
    solution: ['n(C₆H₁₀O₅) = 162 / 162 = 1 mol ⇒ glucose = 1 × 81% = 0,81 mol.', 'm = 0,81 × 180 = 145,8 g.'],
    explanation: 'Mỗi mắt xích C₆H₁₀O₅ tạo một phân tử glucose.'
  },
  {
    id: 'g12-l6-q5', lessonId: 'g12-l6', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng cellulose trinitrate.',
    content: 'Tính khối lượng cellulose trinitrate thu được từ 324 kg cellulose (hiệu suất 100%; C = 12, H = 1, O = 16, N = 14).',
    correctAnswer: { value: 594, unit: 'kg', tolerance: 0.02 },
    verify: () => 324 / molarMass(STARCH_UNIT) * molarMass('C6H7O11N3'),
    solution: ['n(mắt xích) = 324 / 162 = 2 kmol.', 'M(C₆H₇O₂(ONO₂)₃) = 297 ⇒ m = 2 × 297 = 594 kg.'],
    explanation: 'Mỗi mắt xích thay 3 nhóm OH bằng 3 nhóm ONO₂.'
  },
  {
    id: 'g12-l6-q6', lessonId: 'g12-l6', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính khối lượng HNO₃ cần dùng khi có hiệu suất.',
    content: 'Để sản xuất 297 kg cellulose trinitrate với hiệu suất 90%, cần bao nhiêu kg HNO₃?',
    correctAnswer: { value: 210, unit: 'kg', tolerance: 0.02 },
    verify: () => 297 / molarMass('C6H7O11N3') * 3 / 0.9 * molarMass('HNO3'),
    solution: ['n(sản phẩm) = 297 / 297 = 1 kmol ⇒ HNO₃ lí thuyết 3 kmol.', 'HNO₃ thực tế = 3 / 90% ≈ 3,333 kmol ⇒ m = 3,333 × 63 = 210 kg.'],
    explanation: 'Tính lượng chất đầu thì chia cho hiệu suất.'
  },
  {
    id: 'g12-l6-q7', lessonId: 'g12-l6', type: 'single', difficulty: 'understand',
    objective: 'Giải thích sự khác nhau giữa tinh bột và cellulose.',
    content: 'Điểm khác nhau cơ bản về cấu tạo giữa tinh bột và cellulose là',
    options: [
      { id: 'a', text: 'tinh bột tạo từ α-glucose, cellulose tạo từ β-glucose' },
      { id: 'b', text: 'tinh bột tạo từ fructose, cellulose tạo từ glucose' },
      { id: 'c', text: 'tinh bột có công thức (C₆H₁₂O₆)ₙ' },
      { id: 'd', text: 'cellulose có mạch phân nhánh' }
    ],
    correctAnswer: 'a',
    explanation: 'Loại liên kết glycoside (α hay β) quyết định cấu trúc xoắn hay duỗi thẳng.'
  },

  /* ----- Bài 7. Ôn tập chương 2 ----- */
  {
    id: 'g12-l7-q1', lessonId: 'g12-l7', type: 'single', difficulty: 'understand',
    objective: 'Chọn thuốc thử nhận biết carbohydrate.',
    content: 'Để phân biệt glucose và saccharose, dùng thuốc thử nào?',
    options: [
      { id: 'a', text: 'Cu(OH)₂ ở nhiệt độ thường' },
      { id: 'b', text: 'Thuốc thử Tollens' },
      { id: 'c', text: 'Dung dịch iodine' },
      { id: 'd', text: 'Nước' }
    ],
    correctAnswer: 'b',
    explanation: 'Cả hai hòa tan Cu(OH)₂; chỉ glucose tráng bạc.'
  },
  {
    id: 'g12-l7-q2', lessonId: 'g12-l7', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định các chất tráng bạc được.',
    content: 'Chọn tất cả chất tham gia phản ứng tráng bạc.',
    options: [
      { id: 'a', text: 'Glucose' },
      { id: 'b', text: 'Fructose' },
      { id: 'c', text: 'Maltose' },
      { id: 'd', text: 'Saccharose', feedback: 'Saccharose không có tính khử.' },
      { id: 'e', text: 'Tinh bột', feedback: 'Tinh bột không tráng bạc.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Các chất có nhóm −CHO (hoặc chuyển thành −CHO trong môi trường kiềm) tráng bạc.'
  },
  {
    id: 'g12-l7-q3', lessonId: 'g12-l7', type: 'truefalse', difficulty: 'understand',
    objective: 'Hệ thống tính chất các carbohydrate.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Thủy phân hoàn toàn tinh bột và cellulose đều thu được glucose.', explanation: 'Cả hai đều tạo từ các gốc glucose.' },
      { id: 'b', text: 'Glucose, fructose, saccharose đều hòa tan Cu(OH)₂ ở nhiệt độ thường.', explanation: 'Đều có nhiều nhóm OH kề nhau.' },
      { id: 'c', text: 'Saccharose và maltose đều có tính khử.', explanation: 'Chỉ maltose có tính khử.' },
      { id: 'd', text: 'Hiệu suất chung của chuỗi phản ứng bằng tổng hiệu suất các giai đoạn.', explanation: 'Bằng tích hiệu suất các giai đoạn.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: false },
    explanation: 'Ôn lại bảng tính chất của các carbohydrate.'
  },
  {
    id: 'g12-l7-q4', lessonId: 'g12-l7', type: 'numeric', difficulty: 'advanced',
    objective: 'Giải bài toán chuỗi tinh bột → ethanol.',
    content: 'Từ 162 kg tinh bột sản xuất ethanol: thủy phân với hiệu suất 75%, lên men với hiệu suất 80%. Tính khối lượng ethanol thu được.',
    correctAnswer: { value: 55.2, unit: 'kg', tolerance: 0.02 },
    verify: () => 162 / molarMass(STARCH_UNIT) * 0.75 * 0.8 * 2 * molarMass('C2H6O'),
    solution: ['n(C₆H₁₀O₅) = 1 kmol; hiệu suất chung 75% × 80% = 60%.', 'n(C₂H₅OH) = 2 × 1 × 60% = 1,2 kmol ⇒ m = 1,2 × 46 = 55,2 kg.'],
    explanation: '1 mắt xích → 1 glucose → 2 ethanol.'
  },
  {
    id: 'g12-l7-q5', lessonId: 'g12-l7', type: 'numeric', difficulty: 'apply',
    objective: 'Tính lượng kết tủa khi hấp thụ CO₂ từ quá trình lên men.',
    content: 'Lên men 45 g glucose với hiệu suất 80%, toàn bộ CO₂ sinh ra hấp thụ vào nước vôi trong dư. Tính khối lượng kết tủa CaCO₃.',
    correctAnswer: { value: 40, unit: 'g', tolerance: 0.02 },
    verify: () => 45 / molarMass(GLUCOSE) * 2 * 0.8 * molarMass('CaCO3'),
    solution: ['n(glucose) = 0,25 mol ⇒ n(CO₂) = 2 × 0,25 × 80% = 0,4 mol.', 'n(CaCO₃) = n(CO₂) = 0,4 mol ⇒ m = 40 g.'],
    explanation: 'Nước vôi dư: CO₂ + Ca(OH)₂ → CaCO₃ + H₂O.',
    equations: ['CO₂ + Ca(OH)₂ → CaCO₃ + H₂O']
  },
  {
    id: 'g12-l7-q6', lessonId: 'g12-l7', type: 'numeric', difficulty: 'advanced',
    objective: 'Giải bài toán hỗn hợp glucose và saccharose.',
    content: 'Hỗn hợp X gồm glucose và saccharose nặng 52,2 g. Cho X tác dụng với thuốc thử Tollens dư (không thủy phân) thu được 10,8 g Ag. Tính phần trăm khối lượng saccharose trong X.',
    correctAnswer: { value: 82.76, unit: '%', tolerance: 0.01 },
    verify: () => (52.2 - 10.8 / molarMass('Ag') / 2 * molarMass(GLUCOSE)) / 52.2 * 100,
    solution: ['Chỉ glucose tráng bạc: n(glucose) = 0,1 / 2 = 0,05 mol ⇒ 9 g.', 'm(saccharose) = 52,2 − 9 = 43,2 g ⇒ % = 43,2 / 52,2 × 100% ≈ 82,76%.'],
    explanation: 'Saccharose không có tính khử nên không đóng góp Ag.'
  },
  {
    id: 'g12-l7-q7', lessonId: 'g12-l7', type: 'numeric', difficulty: 'apply',
    objective: 'Tính thể tích CO₂ khi lên men glucose.',
    content: 'Lên men hoàn toàn 18 g glucose. Tính thể tích CO₂ thu được ở điều kiện chuẩn (24,79 L/mol).',
    correctAnswer: { value: 4.958, unit: 'L', tolerance: 0.02 },
    verify: () => 18 / molarMass(GLUCOSE) * 2 * VM,
    solution: ['n(glucose) = 0,1 mol ⇒ n(CO₂) = 0,2 mol.', 'V = 0,2 × 24,79 ≈ 4,96 L.'],
    explanation: 'Mỗi phân tử glucose lên men tạo 2 phân tử CO₂.'
  }
]
