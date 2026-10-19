// Hóa học 11 · Chương 5 — Dẫn xuất halogen – Alcohol – Phenol. Questions for Bài 19–22.
import { molarMass, GAS_VOLUME_STANDARD as VM } from '../chemMath.js'

export const questions = [
  /* ----- Bài 19. Dẫn xuất halogen ----- */
  {
    id: 'g11-l19-q1', lessonId: 'g11-l19', type: 'single', difficulty: 'recognize',
    objective: 'Nhận biết dẫn xuất halogen.',
    content: 'Chất nào sau đây là dẫn xuất halogen của hydrocarbon?',
    options: [
      { id: 'a', text: 'NaCl', feedback: 'NaCl là muối vô cơ.' },
      { id: 'b', text: 'CH₂=CHCl' },
      { id: 'c', text: 'CH₃COONa' },
      { id: 'd', text: 'HCl' }
    ],
    correctAnswer: 'b',
    explanation: 'Vinyl chloride thu được khi thay một H của ethylene bằng Cl.'
  },
  {
    id: 'g11-l19-q2', lessonId: 'g11-l19', type: 'short', difficulty: 'understand',
    objective: 'Gọi tên thay thế của dẫn xuất halogen.',
    content: 'Gọi tên theo danh pháp thay thế của CH₃–CHCl–CH₃.',
    correctAnswer: { accepted: ['2-chloropropane', '2 chloropropane'], compact: true },
    explanation: 'Mạch chính 3 C (propane), nguyên tử Cl ở C2.'
  },
  {
    id: 'g11-l19-q3', lessonId: 'g11-l19', type: 'truefalse', difficulty: 'understand',
    objective: 'Phân biệt phản ứng thế và phản ứng tách của dẫn xuất halogen.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Đun C₂H₅Br với dung dịch NaOH trong nước thu được ethanol.', explanation: 'Phản ứng thế −Br bằng −OH.' },
      { id: 'b', text: 'Đun C₂H₅Br với KOH trong ethanol thu được ethanol.', explanation: 'Trong ethanol xảy ra phản ứng tách HBr tạo ethylene.' },
      { id: 'c', text: 'Dẫn xuất halogen hầu như không tan trong nước.', explanation: 'Chúng tan tốt trong dung môi hữu cơ.' },
      { id: 'd', text: 'Các CFC bị hạn chế vì phá hủy tầng ozone.', explanation: 'Nghị định thư Montreal hạn chế CFC.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: true },
    explanation: 'Dung môi quyết định hướng phản ứng: nước → thế; ethanol → tách.',
    equations: ['C₂H₅Br + NaOH → C₂H₅OH + NaBr', 'C₂H₅Br + KOH → C₂H₄ + KBr + H₂O']
  },
  {
    id: 'g11-l19-q4', lessonId: 'g11-l19', type: 'single', difficulty: 'apply',
    objective: 'Áp dụng quy tắc Zaitsev.',
    content: 'Đun 2-bromobutane với KOH trong ethanol, sản phẩm chính là',
    options: [
      { id: 'a', text: 'but-1-ene', feedback: 'But-1-ene là sản phẩm phụ (H bị tách ở C1 bậc I).' },
      { id: 'b', text: 'but-2-ene' },
      { id: 'c', text: 'butan-2-ol', feedback: 'Butan-2-ol tạo thành khi dùng NaOH trong nước.' },
      { id: 'd', text: 'butane' }
    ],
    correctAnswer: 'b',
    explanation: 'Theo Zaitsev, Br tách cùng H ở C bên cạnh có bậc cao hơn (C3), tạo CH₃–CH=CH–CH₃.'
  },
  {
    id: 'g11-l19-q5', lessonId: 'g11-l19', type: 'multiple', difficulty: 'understand',
    objective: 'Nêu ứng dụng của dẫn xuất halogen.',
    content: 'Chọn tất cả ứng dụng đúng của dẫn xuất halogen.',
    options: [
      { id: 'a', text: 'Vinyl chloride là monomer sản xuất PVC.' },
      { id: 'b', text: 'CF₂=CF₂ dùng sản xuất Teflon chống dính.' },
      { id: 'c', text: 'CFC hiện được khuyến khích dùng trong tủ lạnh.', feedback: 'CFC đã bị hạn chế vì phá hủy tầng ozone.' },
      { id: 'd', text: 'Một số dẫn xuất chứa chlorine dùng làm thuốc bảo vệ thực vật.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Dẫn xuất halogen có nhiều ứng dụng nhưng nhiều chất bền, gây hại môi trường.'
  },
  {
    id: 'g11-l19-q6', lessonId: 'g11-l19', type: 'numeric', difficulty: 'apply',
    objective: 'Tính lượng sản phẩm của phản ứng tách HX.',
    content: 'Đun 12,9 g chloroethane với KOH trong ethanol (hiệu suất 100%). Tính thể tích ethylene thu được ở điều kiện chuẩn (24,79 L/mol; C = 12, H = 1, Cl = 35,5).',
    correctAnswer: { value: 4.958, unit: 'L', tolerance: 0.02 },
    verify: () => 12.9 / molarMass('C2H5Cl') * VM,
    solution: ['n(C₂H₅Cl) = 12,9 / 64,5 = 0,2 mol ⇒ n(C₂H₄) = 0,2 mol.', 'V = 0,2 × 24,79 ≈ 4,96 L.'],
    explanation: 'Tỉ lệ mol dẫn xuất halogen : alkene là 1 : 1.',
    equations: ['C₂H₅Cl + KOH → C₂H₄ + KCl + H₂O']
  },
  {
    id: 'g11-l19-q7', lessonId: 'g11-l19', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính khối lượng alcohol từ dẫn xuất halogen có hiệu suất.',
    content: 'Đun 21,8 g bromoethane với dung dịch NaOH dư (trong nước), hiệu suất 75%. Tính khối lượng ethanol thu được (Br = 80).',
    correctAnswer: { value: 6.9, unit: 'g', tolerance: 0.02 },
    verify: () => 21.8 / molarMass('C2H5Br') * molarMass('C2H6O') * 0.75,
    solution: ['n(C₂H₅Br) = 21,8 / 109 = 0,2 mol ⇒ ethanol lí thuyết 0,2 mol.', 'm = 0,2 × 46 × 75% = 6,9 g.'],
    explanation: 'Khối lượng thực tế = khối lượng lí thuyết × hiệu suất.',
    equations: ['C₂H₅Br + NaOH → C₂H₅OH + NaBr']
  },

  /* ----- Bài 20. Alcohol ----- */
  {
    id: 'g11-l20-q1', lessonId: 'g11-l20', type: 'single', difficulty: 'recognize',
    objective: 'Xác định bậc alcohol.',
    content: 'Alcohol (CH₃)₃C–OH có bậc là',
    options: [
      { id: 'a', text: 'bậc I' },
      { id: 'b', text: 'bậc II' },
      { id: 'c', text: 'bậc III' },
      { id: 'd', text: 'bậc IV', feedback: 'Không có alcohol bậc IV vì C mang OH chỉ liên kết tối đa 3 C khác.' }
    ],
    correctAnswer: 'c',
    explanation: 'C mang nhóm OH liên kết với 3 nguyên tử C khác nên là C bậc III.'
  },
  {
    id: 'g11-l20-q2', lessonId: 'g11-l20', type: 'short', difficulty: 'understand',
    objective: 'Gọi tên alcohol theo danh pháp thay thế.',
    content: 'Gọi tên thay thế của CH₃–CH(OH)–CH₃.',
    correctAnswer: { accepted: ['propan-2-ol', 'propan 2 ol', '2-propanol'], compact: true },
    explanation: 'Mạch 3 C, nhóm OH ở C2: propan-2-ol (isopropyl alcohol).'
  },
  {
    id: 'g11-l20-q3', lessonId: 'g11-l20', type: 'truefalse', difficulty: 'understand',
    objective: 'Trình bày tính chất của alcohol.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Ethanol có nhiệt độ sôi cao hơn dimethyl ether do có liên kết hydrogen.', explanation: 'Hai chất cùng M = 46, chỉ ethanol có O–H.' },
      { id: 'b', text: 'Ethanol hòa tan Cu(OH)₂ tạo dung dịch xanh lam.', explanation: 'Chỉ polyalcohol có các OH kề nhau như glycerol mới có phản ứng này.' },
      { id: 'c', text: 'Đun ethanol với H₂SO₄ đặc ở 140 °C tạo diethyl ether.', explanation: 'Tách nước giữa hai phân tử alcohol.' },
      { id: 'd', text: 'Oxi hóa propan-2-ol bằng CuO thu được aldehyde.', explanation: 'Alcohol bậc II bị oxi hóa thành ketone (acetone).' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Bậc alcohol quyết định sản phẩm oxi hóa; Cu(OH)₂ chỉ nhận biết polyalcohol.',
    equations: ['2C₂H₅OH → C₂H₅OC₂H₅ + H₂O']
  },
  {
    id: 'g11-l20-q4', lessonId: 'g11-l20', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định chất phản ứng được với glycerol.',
    content: 'Chọn tất cả chất phản ứng được với glycerol.',
    options: [
      { id: 'a', text: 'Na' },
      { id: 'b', text: 'Cu(OH)₂' },
      { id: 'c', text: 'Dung dịch NaOH', feedback: 'Alcohol không có tính acid đủ để phản ứng với NaOH.' },
      { id: 'd', text: 'O₂ (đốt cháy)' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Glycerol có nhóm OH (phản ứng với Na), có các OH kề nhau (hòa tan Cu(OH)₂) và cháy được.',
    equations: ['2C₃H₅(OH)₃ + Cu(OH)₂ → [C₃H₅(OH)₂O]₂Cu + 2H₂O']
  },
  {
    id: 'g11-l20-q5', lessonId: 'g11-l20', type: 'numeric', difficulty: 'apply',
    objective: 'Tính thể tích H₂ khi alcohol tác dụng với Na.',
    content: 'Cho 9,2 g ethanol tác dụng hết với Na. Tính thể tích H₂ thu được ở điều kiện chuẩn (24,79 L/mol).',
    correctAnswer: { value: 2.479, unit: 'L', tolerance: 0.02 },
    verify: () => 9.2 / molarMass('C2H6O') / 2 * VM,
    solution: ['n(C₂H₅OH) = 9,2 / 46 = 0,2 mol ⇒ n(H₂) = 0,1 mol.', 'V = 0,1 × 24,79 = 2,479 L.'],
    explanation: 'Mỗi nhóm −OH giải phóng ½ phân tử H₂.',
    equations: ['2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂']
  },
  {
    id: 'g11-l20-q6', lessonId: 'g11-l20', type: 'numeric', difficulty: 'apply',
    objective: 'Vận dụng khái niệm độ rượu.',
    content: 'Tính thể tích ethanol nguyên chất có trong 500 mL rượu 40°.',
    correctAnswer: { value: 200, unit: 'mL', tolerance: 0.01 },
    verify: () => 500 * 40 / 100,
    solution: ['Rượu 40°: 100 mL rượu chứa 40 mL ethanol.', 'V(ethanol) = 500 × 40 / 100 = 200 mL.'],
    explanation: 'Độ rượu là số mL ethanol nguyên chất trong 100 mL dung dịch.'
  },
  {
    id: 'g11-l20-q7', lessonId: 'g11-l20', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính khối lượng ethanol từ lên men glucose có hiệu suất.',
    content: 'Lên men 360 g glucose với hiệu suất 75%. Tính khối lượng ethanol thu được.',
    correctAnswer: { value: 138, unit: 'g', tolerance: 0.02 },
    verify: () => 360 / molarMass('C6H12O6') * 2 * molarMass('C2H6O') * 0.75,
    solution: ['n(glucose) = 360 / 180 = 2 mol ⇒ ethanol lí thuyết 4 mol.', 'm = 4 × 46 × 75% = 138 g.'],
    explanation: 'Mỗi mol glucose cho 2 mol ethanol.',
    equations: ['C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂']
  },

  /* ----- Bài 21. Phenol ----- */
  {
    id: 'g11-l21-q1', lessonId: 'g11-l21', type: 'single', difficulty: 'recognize',
    objective: 'Nhận biết phenol.',
    content: 'Phenol là hợp chất hữu cơ có nhóm −OH',
    options: [
      { id: 'a', text: 'liên kết với nguyên tử C no' },
      { id: 'b', text: 'liên kết trực tiếp với C của vòng benzene' },
      { id: 'c', text: 'liên kết với C của nhánh gắn vòng benzene', feedback: 'Đó là alcohol thơm, ví dụ C₆H₅CH₂OH.' },
      { id: 'd', text: 'liên kết với nhóm C=O' }
    ],
    correctAnswer: 'b',
    explanation: 'Nhóm −OH gắn trực tiếp vào vòng benzene là đặc điểm của phenol.'
  },
  {
    id: 'g11-l21-q2', lessonId: 'g11-l21', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định chất phản ứng được với phenol.',
    content: 'Chọn tất cả chất phản ứng được với phenol.',
    options: [
      { id: 'a', text: 'Dung dịch NaOH' },
      { id: 'b', text: 'Nước bromine' },
      { id: 'c', text: 'Na' },
      { id: 'd', text: 'Dung dịch NaHCO₃', feedback: 'Phenol có tính acid yếu hơn H₂CO₃ nên không phản ứng với NaHCO₃.' },
      { id: 'e', text: 'Dung dịch HCl', feedback: 'Phenol không có tính base.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Phenol có tính acid yếu (Na, NaOH) và thế dễ ở vòng (nước bromine).',
    equations: ['C₆H₅OH + NaOH → C₆H₅ONa + H₂O']
  },
  {
    id: 'g11-l21-q3', lessonId: 'g11-l21', type: 'truefalse', difficulty: 'understand',
    objective: 'Giải thích ảnh hưởng qua lại giữa nhóm −OH và vòng benzene.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Dung dịch phenol làm quỳ tím hóa đỏ.', explanation: 'Tính acid của phenol quá yếu, không làm đổi màu quỳ tím.' },
      { id: 'b', text: 'Thổi CO₂ vào dung dịch sodium phenolate thấy vẩn đục.', explanation: 'Phenol bị carbonic acid đẩy ra khỏi muối.' },
      { id: 'c', text: 'Phenol thế bromine dễ hơn benzene do ảnh hưởng của nhóm −OH lên vòng.', explanation: 'Nhóm −OH làm giàu electron ở vị trí ortho, para.' },
      { id: 'd', text: 'Phenol là chất lỏng, tan vô hạn trong nước lạnh.', explanation: 'Phenol là chất rắn, ít tan trong nước lạnh.' }
    ],
    correctAnswer: { a: false, b: true, c: true, d: false },
    explanation: 'Vòng benzene làm tăng tính acid của −OH; nhóm −OH làm vòng dễ thế hơn.',
    equations: ['C₆H₅ONa + CO₂ + H₂O → C₆H₅OH + NaHCO₃']
  },
  {
    id: 'g11-l21-q4', lessonId: 'g11-l21', type: 'single', difficulty: 'understand',
    objective: 'Nhận biết phenol bằng phản ứng đặc trưng.',
    content: 'Nhỏ nước bromine vào dung dịch phenol, hiện tượng quan sát được là',
    options: [
      { id: 'a', text: 'có khí không màu thoát ra' },
      { id: 'b', text: 'nước bromine mất màu, xuất hiện kết tủa trắng' },
      { id: 'c', text: 'dung dịch chuyển màu xanh lam' },
      { id: 'd', text: 'không có hiện tượng' }
    ],
    correctAnswer: 'b',
    explanation: 'Tạo kết tủa trắng 2,4,6-tribromophenol.',
    equations: ['C₆H₅OH + 3Br₂ → C₆H₂Br₃OH + 3HBr']
  },
  {
    id: 'g11-l21-q5', lessonId: 'g11-l21', type: 'numeric', difficulty: 'apply',
    objective: 'Tính thể tích dung dịch kiềm phản ứng với phenol.',
    content: 'Tính thể tích dung dịch NaOH 1 M vừa đủ để phản ứng với 9,4 g phenol.',
    correctAnswer: { value: 100, unit: 'mL', tolerance: 0.01 },
    verify: () => 9.4 / molarMass('C6H6O') / 1 * 1000,
    solution: ['n(C₆H₅OH) = 9,4 / 94 = 0,1 mol = n(NaOH).', 'V = 0,1 / 1 = 0,1 L = 100 mL.'],
    explanation: 'Phenol phản ứng với NaOH theo tỉ lệ 1 : 1.',
    equations: ['C₆H₅OH + NaOH → C₆H₅ONa + H₂O']
  },
  {
    id: 'g11-l21-q6', lessonId: 'g11-l21', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng phenol từ lượng kết tủa với bromine.',
    content: 'Cho dung dịch phenol tác dụng với nước bromine dư thu được 33,1 g kết tủa trắng. Tính khối lượng phenol đã phản ứng (C = 12, H = 1, O = 16, Br = 80).',
    correctAnswer: { value: 9.4, unit: 'g', tolerance: 0.02 },
    verify: () => 33.1 / molarMass('C6H3Br3O') * molarMass('C6H6O'),
    solution: ['M(C₆H₂Br₃OH) = 331 ⇒ n = 33,1 / 331 = 0,1 mol.', 'n(phenol) = 0,1 mol ⇒ m = 0,1 × 94 = 9,4 g.'],
    explanation: 'Tỉ lệ mol phenol : 2,4,6-tribromophenol là 1 : 1.',
    equations: ['C₆H₅OH + 3Br₂ → C₆H₂Br₃OH + 3HBr']
  },
  {
    id: 'g11-l21-q7', lessonId: 'g11-l21', type: 'short', difficulty: 'advanced',
    objective: 'Viết công thức sản phẩm thế bromine của phenol.',
    content: 'Viết công thức phân tử của kết tủa trắng tạo thành khi phenol tác dụng với nước bromine dư (dạng C?H?Br?O).',
    placeholder: 'Ví dụ: C6H5BrO',
    correctAnswer: { accepted: ['C6H3Br3O', 'C6H2Br3OH'], compact: true },
    explanation: 'Ba nguyên tử H ở vị trí 2, 4, 6 bị thay bằng Br: C₆H₂Br₃OH, tức C₆H₃Br₃O.'
  },

  /* ----- Bài 22. Ôn tập chương 5 ----- */
  {
    id: 'g11-l22-q1', lessonId: 'g11-l22', type: 'single', difficulty: 'understand',
    objective: 'Phân biệt alcohol và phenol theo phản ứng với NaOH.',
    content: 'Chất nào tác dụng được với dung dịch NaOH?',
    options: [
      { id: 'a', text: 'C₂H₅OH' },
      { id: 'b', text: 'C₆H₅CH₂OH', feedback: 'Benzyl alcohol là alcohol thơm, không phản ứng với NaOH.' },
      { id: 'c', text: 'C₆H₅OH' },
      { id: 'd', text: 'C₃H₅(OH)₃' }
    ],
    correctAnswer: 'c',
    explanation: 'Chỉ phenol có tính acid đủ để phản ứng với NaOH.'
  },
  {
    id: 'g11-l22-q2', lessonId: 'g11-l22', type: 'multiple', difficulty: 'apply',
    objective: 'Chọn thuốc thử nhận biết trong chương 5.',
    content: 'Chọn tất cả cặp “thuốc thử – chất nhận biết được” đúng.',
    options: [
      { id: 'a', text: 'Cu(OH)₂ – glycerol' },
      { id: 'b', text: 'Nước bromine – phenol' },
      { id: 'c', text: 'FeCl₃ – phenol' },
      { id: 'd', text: 'Cu(OH)₂ – ethanol', feedback: 'Ethanol chỉ có một nhóm OH nên không hòa tan Cu(OH)₂.' },
      { id: 'e', text: 'Quỳ tím – phenol', feedback: 'Phenol không làm đổi màu quỳ tím.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Glycerol: xanh lam với Cu(OH)₂; phenol: kết tủa trắng với nước bromine, màu tím với FeCl₃.'
  },
  {
    id: 'g11-l22-q3', lessonId: 'g11-l22', type: 'truefalse', difficulty: 'understand',
    objective: 'Hệ thống chuyển hóa giữa các hợp chất trong chương 5.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Từ C₂H₄ có thể điều chế C₂H₅Br bằng phản ứng cộng HBr.', explanation: 'C₂H₄ + HBr → C₂H₅Br.' },
      { id: 'b', text: 'Ethanol tách nước ở 170 °C (H₂SO₄ đặc) tạo ethylene.', explanation: 'Phản ứng tách nước nội phân tử.' },
      { id: 'c', text: 'Phenol và ethanol đều phản ứng với Na.', explanation: 'Cả hai đều có nhóm −OH.' },
      { id: 'd', text: 'Dẫn xuất halogen tan tốt trong nước hơn alcohol tương ứng.', explanation: 'Dẫn xuất halogen hầu như không tan; alcohol nhỏ tan nhờ liên kết hydrogen.' }
    ],
    correctAnswer: { a: true, b: true, c: true, d: false },
    explanation: 'Dẫn xuất halogen, alcohol và alkene chuyển hóa qua lại bằng phản ứng cộng, thế, tách.',
    equations: ['C₂H₄ + HBr → C₂H₅Br', 'C₂H₅OH → C₂H₄ + H₂O']
  },
  {
    id: 'g11-l22-q4', lessonId: 'g11-l22', type: 'numeric', difficulty: 'apply',
    objective: 'Tính thể tích H₂ từ polyalcohol.',
    content: 'Cho 9,2 g glycerol tác dụng với Na dư. Tính thể tích H₂ thu được ở điều kiện chuẩn (24,79 L/mol).',
    correctAnswer: { value: 3.7185, unit: 'L', tolerance: 0.02 },
    verify: () => 9.2 / molarMass('C3H8O3') * 3 / 2 * VM,
    solution: ['n(C₃H₅(OH)₃) = 9,2 / 92 = 0,1 mol ⇒ n(−OH) = 0,3 mol.', 'n(H₂) = 0,3 / 2 = 0,15 mol ⇒ V = 0,15 × 24,79 ≈ 3,72 L.'],
    explanation: 'Glycerol có 3 nhóm −OH, mỗi nhóm cho ½ H₂.',
    equations: ['2C₃H₅(OH)₃ + 6Na → 2C₃H₅(ONa)₃ + 3H₂']
  },
  {
    id: 'g11-l22-q5', lessonId: 'g11-l22', type: 'numeric', difficulty: 'advanced',
    objective: 'Giải bài toán hỗn hợp alcohol và phenol.',
    content: 'Hỗn hợp X gồm ethanol và phenol nặng 14 g, phản ứng vừa đủ với 100 mL dung dịch NaOH 1 M. Tính phần trăm khối lượng phenol trong X.',
    correctAnswer: { value: 67.14, unit: '%', tolerance: 0.01 },
    verify: () => 0.1 * molarMass('C6H6O') / 14 * 100,
    solution: ['Chỉ phenol phản ứng với NaOH ⇒ n(phenol) = 0,1 mol ⇒ m = 9,4 g.', '%m(phenol) = 9,4 / 14 × 100% ≈ 67,14%.'],
    explanation: 'Dùng phản ứng chỉ một chất tham gia để tách số mol từng chất trong hỗn hợp.'
  },
  {
    id: 'g11-l22-q6', lessonId: 'g11-l22', type: 'numeric', difficulty: 'advanced',
    objective: 'Đếm đồng phân alcohol.',
    content: 'Có bao nhiêu alcohol đồng phân cấu tạo có công thức phân tử C₄H₁₀O?',
    correctAnswer: { value: 4 },
    verify: () => 4,
    solution: ['Mạch thẳng: butan-1-ol, butan-2-ol.', 'Mạch nhánh: 2-methylpropan-1-ol, 2-methylpropan-2-ol ⇒ 4 alcohol.'],
    explanation: 'C₄H₁₀O còn có 3 đồng phân ether nhưng đề chỉ hỏi alcohol.'
  },
  {
    id: 'g11-l22-q7', lessonId: 'g11-l22', type: 'short', difficulty: 'apply',
    objective: 'Xác định sản phẩm oxi hóa alcohol bậc II.',
    content: 'Oxi hóa propan-2-ol bằng CuO, đun nóng, thu được hợp chất hữu cơ nào? (ghi tên thông thường)',
    correctAnswer: { accepted: ['acetone', 'propanone', 'dimethyl ketone'], compact: true },
    explanation: 'Alcohol bậc II bị oxi hóa thành ketone: CH₃COCH₃ (acetone, propanone).',
    equations: ['C₃H₈O + CuO → C₃H₆O + Cu + H₂O']
  }
]
