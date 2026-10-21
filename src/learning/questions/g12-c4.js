// Hóa học 12 · Chương 4 — Polymer. Questions for Bài 12–14.
import { molarMass } from '../chemMath.js'

export const questions = [
  /* ----- Bài 12. Đại cương về polymer ----- */
  {
    id: 'g12-l12-q1', lessonId: 'g12-l12', type: 'single', difficulty: 'recognize',
    objective: 'Phân loại polymer theo nguồn gốc.',
    content: 'Polymer nào sau đây là polymer tổng hợp?',
    options: [
      { id: 'a', text: 'Tinh bột' },
      { id: 'b', text: 'Tơ tằm' },
      { id: 'c', text: 'Poly(vinyl chloride)' },
      { id: 'd', text: 'Tơ visco', feedback: 'Tơ visco là bán tổng hợp.' }
    ],
    correctAnswer: 'c',
    explanation: 'PVC được tổng hợp từ vinyl chloride.'
  },
  {
    id: 'g12-l12-q2', lessonId: 'g12-l12', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định monomer có thể trùng hợp.',
    content: 'Chọn tất cả chất có thể tham gia phản ứng trùng hợp.',
    options: [
      { id: 'a', text: 'CH₂=CH₂' },
      { id: 'b', text: 'CH₂=CHCl' },
      { id: 'c', text: 'C₆H₅CH=CH₂' },
      { id: 'd', text: 'CH₃CH₃', feedback: 'Không có liên kết bội.' },
      { id: 'e', text: 'H₂N[CH₂]₅COOH', feedback: 'Chất này trùng ngưng.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Monomer trùng hợp cần liên kết bội hoặc vòng kém bền.'
  },
  {
    id: 'g12-l12-q3', lessonId: 'g12-l12', type: 'truefalse', difficulty: 'understand',
    objective: 'Mô tả cấu trúc và tính chất của polymer.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Polymer không có nhiệt độ nóng chảy xác định.', explanation: 'Nóng chảy trong một khoảng nhiệt độ.' },
      { id: 'b', text: 'Amylopectin có mạch phân nhánh.', explanation: 'Đúng.' },
      { id: 'c', text: 'Thủy phân tinh bột là phản ứng khâu mạch.', explanation: 'Thủy phân là phản ứng cắt mạch.' },
      { id: 'd', text: 'Cao su lưu hóa có cấu trúc mạng không gian.', explanation: 'Cầu −S−S− nối các mạch.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'Ba loại phản ứng của polymer: giữ nguyên mạch, cắt mạch, khâu mạch.'
  },
  {
    id: 'g12-l12-q4', lessonId: 'g12-l12', type: 'numeric', difficulty: 'apply',
    objective: 'Tính hệ số polymer hóa.',
    content: 'Một mẫu PVC có phân tử khối trung bình 125 000. Tính hệ số polymer hóa (C = 12, H = 1, Cl = 35,5).',
    correctAnswer: { value: 2000 },
    verify: () => 125000 / molarMass('C2H3Cl'),
    solution: ['Mắt xích −CH₂−CHCl− có M = 62,5.', 'n = 125 000 / 62,5 = 2 000.'],
    explanation: 'Hệ số polymer hóa = M(polymer) / M(mắt xích).'
  },
  {
    id: 'g12-l12-q5', lessonId: 'g12-l12', type: 'numeric', difficulty: 'apply',
    objective: 'Tính hệ số polymer hóa của polystyrene.',
    content: 'Một mẫu polystyrene có phân tử khối trung bình 52 000. Tính hệ số polymer hóa.',
    correctAnswer: { value: 500 },
    verify: () => 52000 / molarMass('C8H8'),
    solution: ['Mắt xích −CH₂−CH(C₆H₅)− là C₈H₈, M = 104.', 'n = 52 000 / 104 = 500.'],
    explanation: 'Mắt xích của polymer trùng hợp có cùng thành phần với monomer.'
  },
  {
    id: 'g12-l12-q6', lessonId: 'g12-l12', type: 'short', difficulty: 'understand',
    objective: 'Gọi tên polymer từ monomer.',
    content: 'Trùng hợp propylene CH₂=CH−CH₃ thu được polymer có tên là gì?',
    correctAnswer: { accepted: ['polypropylene', 'PP', 'polypropene'], compact: true },
    explanation: 'Tên polymer = poly + tên monomer.'
  },
  {
    id: 'g12-l12-q7', lessonId: 'g12-l12', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính khối lượng polymer thu được khi trùng hợp có hiệu suất.',
    content: 'Trùng hợp 28 tấn ethylene với hiệu suất 80%. Tính khối lượng polyethylene thu được.',
    correctAnswer: { value: 22.4, unit: 'tấn', units: { 'tấn': 1, 'tan': 1 }, tolerance: 0.02 },
    verify: () => 28 * 0.8,
    solution: ['Trùng hợp không giải phóng chất nào: m(PE) lí thuyết = 28 tấn.', 'Thực tế: 28 × 80% = 22,4 tấn.'],
    explanation: 'Bảo toàn khối lượng trong phản ứng trùng hợp.'
  },

  /* ----- Bài 13. Vật liệu polymer ----- */
  {
    id: 'g12-l13-q1', lessonId: 'g12-l13', type: 'single', difficulty: 'recognize',
    objective: 'Nhận biết monomer của chất dẻo.',
    content: 'Ống dẫn nước thường làm từ PVC. Monomer của PVC là',
    options: [
      { id: 'a', text: 'CH₂=CH₂' },
      { id: 'b', text: 'CH₂=CHCl' },
      { id: 'c', text: 'CH₂=CH−CN' },
      { id: 'd', text: 'CF₂=CF₂' }
    ],
    correctAnswer: 'b',
    explanation: 'PVC: poly(vinyl chloride).'
  },
  {
    id: 'g12-l13-q2', lessonId: 'g12-l13', type: 'multiple', difficulty: 'understand',
    objective: 'Phân loại tơ.',
    content: 'Chọn tất cả tơ tổng hợp.',
    options: [
      { id: 'a', text: 'Nylon-6,6' },
      { id: 'b', text: 'Tơ nitron' },
      { id: 'c', text: 'Tơ capron' },
      { id: 'd', text: 'Tơ visco', feedback: 'Bán tổng hợp.' },
      { id: 'e', text: 'Tơ tằm', feedback: 'Thiên nhiên.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Tơ tổng hợp được tạo hoàn toàn từ các monomer tổng hợp.'
  },
  {
    id: 'g12-l13-q3', lessonId: 'g12-l13', type: 'truefalse', difficulty: 'understand',
    objective: 'Nêu tính chất và ứng dụng của vật liệu polymer.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Cao su thiên nhiên là polyisoprene.', explanation: 'Có cấu hình cis.' },
      { id: 'b', text: 'Vật liệu composite gồm vật liệu nền và vật liệu cốt.', explanation: 'Đúng.' },
      { id: 'c', text: 'Nylon-6,6 bền với acid và kiềm.', explanation: 'Liên kết amide bị thủy phân trong acid, kiềm.' },
      { id: 'd', text: 'Thủy tinh hữu cơ là PMMA.', explanation: 'Poly(methyl methacrylate).' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'Polyamide kém bền trong môi trường acid, kiềm.'
  },
  {
    id: 'g12-l13-q4', lessonId: 'g12-l13', type: 'numeric', difficulty: 'apply',
    objective: 'Tính số mắt xích của nylon-6,6.',
    content: 'Một đoạn mạch nylon-6,6 có phân tử khối 45 200. Tính số mắt xích (C = 12, H = 1, N = 14, O = 16).',
    correctAnswer: { value: 200 },
    verify: () => 45200 / molarMass('C12H22N2O2'),
    solution: ['Mắt xích C₁₂H₂₂N₂O₂ có M = 226.', 'n = 45 200 / 226 = 200.'],
    explanation: 'Mắt xích nylon-6,6 = diamine + diacid − 2H₂O.'
  },
  {
    id: 'g12-l13-q5', lessonId: 'g12-l13', type: 'numeric', difficulty: 'apply',
    objective: 'Tính số mắt xích isoprene trong cao su.',
    content: 'Một đoạn mạch cao su thiên nhiên có phân tử khối 136 000. Tính số mắt xích isoprene.',
    correctAnswer: { value: 2000 },
    verify: () => 136000 / molarMass('C5H8'),
    solution: ['Mắt xích C₅H₈ có M = 68.', 'n = 136 000 / 68 = 2 000.'],
    explanation: 'Mắt xích cao su thiên nhiên có cùng thành phần với isoprene.'
  },
  {
    id: 'g12-l13-q6', lessonId: 'g12-l13', type: 'short', difficulty: 'apply',
    objective: 'Xác định monomer của tơ nitron.',
    content: 'Tơ nitron (olon) được điều chế bằng cách trùng hợp chất nào? (tên thông thường)',
    correctAnswer: { accepted: ['acrylonitrile', 'vinyl cyanide', 'acrylonitril'], compact: true },
    explanation: 'CH₂=CH−CN (acrylonitrile).'
  },
  {
    id: 'g12-l13-q7', lessonId: 'g12-l13', type: 'single', difficulty: 'understand',
    objective: 'Xử lí rác thải polymer hợp lí.',
    content: 'Biện pháp nào không phù hợp để giảm ô nhiễm do rác thải nhựa?',
    options: [
      { id: 'a', text: 'Phân loại và tái chế' },
      { id: 'b', text: 'Hạn chế đồ nhựa dùng một lần' },
      { id: 'c', text: 'Đốt rác nhựa ngoài trời' },
      { id: 'd', text: 'Dùng vật liệu phân hủy sinh học' }
    ],
    correctAnswer: 'c',
    explanation: 'Đốt nhựa ngoài trời sinh khí độc, gây ô nhiễm không khí.'
  },

  /* ----- Bài 14. Ôn tập chương 4 ----- */
  {
    id: 'g12-l14-q1', lessonId: 'g12-l14', type: 'single', difficulty: 'understand',
    objective: 'Xác định monomer từ mắt xích.',
    content: 'Polymer có mắt xích (−CH₂−CH(CN)−) được tạo từ monomer',
    options: [
      { id: 'a', text: 'CH₂=CH−CN' },
      { id: 'b', text: 'CH₂=CHCl' },
      { id: 'c', text: 'CH₂=C(CH₃)COOCH₃' },
      { id: 'd', text: 'CH₂=CH−CH=CH₂' }
    ],
    correctAnswer: 'a',
    explanation: 'Tạo lại liên kết đôi từ mắt xích: acrylonitrile.'
  },
  {
    id: 'g12-l14-q2', lessonId: 'g12-l14', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định polymer tạo bằng trùng ngưng.',
    content: 'Chọn tất cả polymer được điều chế bằng phản ứng trùng ngưng.',
    options: [
      { id: 'a', text: 'Nylon-6,6' },
      { id: 'b', text: 'Poly(phenol-formaldehyde)' },
      { id: 'c', text: 'Polyethylene', feedback: 'Trùng hợp.' },
      { id: 'd', text: 'Tơ nitron', feedback: 'Trùng hợp acrylonitrile.' }
    ],
    correctAnswer: ['a', 'b'],
    explanation: 'Trùng ngưng giải phóng phân tử nhỏ như H₂O.'
  },
  {
    id: 'g12-l14-q3', lessonId: 'g12-l14', type: 'truefalse', difficulty: 'understand',
    objective: 'Hệ thống kiến thức chương polymer.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Trùng hợp giải phóng nước.', explanation: 'Trùng ngưng mới giải phóng phân tử nhỏ.' },
      { id: 'b', text: 'Monomer của cao su buna là buta-1,3-diene.', explanation: 'Đúng.' },
      { id: 'c', text: 'PE và PVC là chất dẻo nhiệt dẻo.', explanation: 'Nóng chảy khi đun, nguội lại rắn.' },
      { id: 'd', text: 'Bông và tơ tằm đều có thành phần chính là cellulose.', explanation: 'Tơ tằm là protein.' }
    ],
    correctAnswer: { a: false, b: true, c: true, d: false },
    explanation: 'Phân biệt rõ trùng hợp – trùng ngưng và nguồn gốc vật liệu.'
  },
  {
    id: 'g12-l14-q4', lessonId: 'g12-l14', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính khối lượng polymer trong phản ứng trùng ngưng.',
    content: 'Trùng ngưng 262 g ε-aminocaproic acid H₂N[CH₂]₅COOH với hiệu suất 90%. Tính khối lượng nylon-6 thu được (C = 12, H = 1, N = 14, O = 16).',
    correctAnswer: { value: 203.4, unit: 'g', tolerance: 0.02 },
    verify: () => 262 / molarMass('C6H13NO2') * molarMass('C6H11NO') * 0.9,
    solution: ['n(monomer) = 262 / 131 = 2 mol; mỗi mắt xích −NH[CH₂]₅CO− (M = 113) tạo ra khi tách 1 H₂O.', 'm = 2 × 113 × 90% = 203,4 g.'],
    explanation: 'Trùng ngưng: m(polymer) = m(monomer) − m(H₂O), rồi nhân hiệu suất.'
  },
  {
    id: 'g12-l14-q5', lessonId: 'g12-l14', type: 'numeric', difficulty: 'apply',
    objective: 'Tính hệ số polymer hóa của polyethylene.',
    content: 'Một mẫu polyethylene có phân tử khối trung bình 56 000. Tính hệ số polymer hóa.',
    correctAnswer: { value: 2000 },
    verify: () => 56000 / molarMass('C2H4'),
    solution: ['Mắt xích −CH₂−CH₂− có M = 28.', 'n = 56 000 / 28 = 2 000.'],
    explanation: 'n = M(polymer) / M(mắt xích).'
  },
  {
    id: 'g12-l14-q6', lessonId: 'g12-l14', type: 'short', difficulty: 'apply',
    objective: 'Nhận diện polymer từ monomer.',
    content: 'Trùng hợp methyl methacrylate thu được vật liệu thường gọi là gì?',
    correctAnswer: { accepted: ['thủy tinh hữu cơ', 'thuy tinh huu co', 'PMMA', 'poly(methyl methacrylate)', 'polymethyl methacrylate'], compact: true },
    explanation: 'PMMA – thủy tinh hữu cơ, trong suốt, bền.'
  },
  {
    id: 'g12-l14-q7', lessonId: 'g12-l14', type: 'single', difficulty: 'advanced',
    objective: 'Phân biệt cấu trúc mạch polymer.',
    content: 'Polymer nào có cấu trúc mạng không gian?',
    options: [
      { id: 'a', text: 'Amylose' },
      { id: 'b', text: 'Amylopectin' },
      { id: 'c', text: 'Cao su lưu hóa' },
      { id: 'd', text: 'Polyethylene' }
    ],
    correctAnswer: 'c',
    explanation: 'Amylose, PE: không phân nhánh; amylopectin: phân nhánh; cao su lưu hóa: mạng không gian.'
  }
]
