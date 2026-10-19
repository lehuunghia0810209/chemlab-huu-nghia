// Hóa học 11 · Chương 3 — Đại cương về hóa học hữu cơ. Questions for Bài 10–14.
import { molarMass } from '../chemMath.js'

export const questions = [
  /* ----- Bài 10. Hợp chất hữu cơ và hóa học hữu cơ ----- */
  {
    id: 'g11-l10-q1', lessonId: 'g11-l10', type: 'single', difficulty: 'recognize',
    objective: 'Phân biệt hợp chất hữu cơ và vô cơ.',
    content: 'Chất nào không phải là hợp chất hữu cơ?',
    options: [
      { id: 'a', text: 'CH₄' },
      { id: 'b', text: 'C₂H₅OH' },
      { id: 'c', text: 'Na₂CO₃' },
      { id: 'd', text: 'CH₃COOH' }
    ],
    correctAnswer: 'c',
    explanation: 'Muối carbonate tuy chứa carbon nhưng được xếp vào hợp chất vô cơ.'
  },
  {
    id: 'g11-l10-q2', lessonId: 'g11-l10', type: 'multiple', difficulty: 'understand',
    objective: 'Phân loại hydrocarbon và dẫn xuất.',
    content: 'Chọn tất cả hydrocarbon.',
    options: [
      { id: 'a', text: 'CH₄' },
      { id: 'b', text: 'C₂H₄' },
      { id: 'c', text: 'C₂H₅OH', feedback: 'Có O: là dẫn xuất (alcohol).' },
      { id: 'd', text: 'C₆H₆' },
      { id: 'e', text: 'CH₃Cl', feedback: 'Có Cl: là dẫn xuất halogen.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Hydrocarbon chỉ gồm hai nguyên tố C và H.'
  },
  {
    id: 'g11-l10-q3', lessonId: 'g11-l10', type: 'truefalse', difficulty: 'understand',
    objective: 'Nêu đặc điểm chung và nhóm chức của hợp chất hữu cơ.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Liên kết trong hợp chất hữu cơ chủ yếu là liên kết cộng hóa trị.', explanation: 'Carbon tạo liên kết cộng hóa trị với C, H, O, N…' },
      { id: 'b', text: 'Phản ứng của hợp chất hữu cơ thường xảy ra nhanh và hoàn toàn.', explanation: 'Thường chậm, không hoàn toàn, theo nhiều hướng.' },
      { id: 'c', text: '−CHO là nhóm chức aldehyde.', explanation: 'Ví dụ CH₃CHO (acetaldehyde).' },
      { id: 'd', text: 'Hợp chất hữu cơ nhất thiết phải chứa oxygen.', explanation: 'Chỉ nhất thiết có carbon; hydrocarbon không có O.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Nguyên tố bắt buộc trong hợp chất hữu cơ là carbon.'
  },
  {
    id: 'g11-l10-q4', lessonId: 'g11-l10', type: 'short', difficulty: 'recognize',
    objective: 'Viết nhóm chức của alcohol.',
    content: 'Viết nhóm chức đặc trưng của alcohol.',
    correctAnswer: { accepted: ['-OH', 'OH', 'nhóm OH', 'nhóm -OH', 'hydroxyl', 'nhóm hydroxyl'], compact: true },
    explanation: 'Alcohol có nhóm −OH liên kết với nguyên tử carbon no, ví dụ C₂H₅OH.'
  },
  {
    id: 'g11-l10-q5', lessonId: 'g11-l10', type: 'numeric', difficulty: 'apply',
    objective: 'Tính phần trăm khối lượng nguyên tố trong hợp chất hữu cơ.',
    content: 'Tính phần trăm khối lượng carbon trong methane CH₄ (C = 12, H = 1).',
    correctAnswer: { value: 75, unit: '%', tolerance: 0.1 },
    verify: () => 12 / molarMass('CH4') * 100,
    solution: ['M(CH₄) = 12 + 4 = 16 g/mol.', '%C = 12 / 16 × 100% = 75%.'],
    explanation: 'Phần còn lại 25% là hydrogen.'
  },
  {
    id: 'g11-l10-q6', lessonId: 'g11-l10', type: 'single', difficulty: 'apply',
    objective: 'Sử dụng phổ IR để xác định nhóm chức.',
    content: 'Phổ IR của một chất có tín hiệu mạnh ở 1715 cm⁻¹ và không có tín hiệu trong vùng 2500 – 3600 cm⁻¹. Chất đó có thể là',
    options: [
      { id: 'a', text: 'C₂H₅OH', feedback: 'Alcohol có tín hiệu O–H rộng ở 3200 – 3600 cm⁻¹.' },
      { id: 'b', text: 'CH₃COCH₃' },
      { id: 'c', text: 'CH₃COOH', feedback: 'Acid có thêm tín hiệu O–H rất rộng 2500 – 3300 cm⁻¹.' },
      { id: 'd', text: 'CH₄', feedback: 'CH₄ không có liên kết C=O.' }
    ],
    correctAnswer: 'b',
    explanation: 'Có C=O, không có O–H ⇒ ketone CH₃COCH₃ (acetone).'
  },
  {
    id: 'g11-l10-q7', lessonId: 'g11-l10', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính phần trăm khối lượng oxygen trong hợp chất hữu cơ.',
    content: 'Tính phần trăm khối lượng oxygen trong acetic acid CH₃COOH (C = 12, H = 1, O = 16), làm tròn đến 2 chữ số thập phân.',
    correctAnswer: { value: 53.33, unit: '%', tolerance: 0.02 },
    verify: () => 32 / molarMass('C2H4O2') * 100,
    solution: ['CH₃COOH có công thức phân tử C₂H₄O₂, M = 24 + 4 + 32 = 60 g/mol.', '%O = 32 / 60 × 100% ≈ 53,33%.'],
    explanation: 'Mỗi phân tử acetic acid có 2 nguyên tử O.'
  },

  /* ----- Bài 11. Tách biệt và tinh chế ----- */
  {
    id: 'g11-l11-q1', lessonId: 'g11-l11', type: 'single', difficulty: 'recognize',
    objective: 'Nêu nguyên tắc của phương pháp kết tinh.',
    content: 'Phương pháp kết tinh dựa vào',
    options: [
      { id: 'a', text: 'sự khác nhau về nhiệt độ sôi', feedback: 'Đó là nguyên tắc của chưng cất.' },
      { id: 'b', text: 'sự thay đổi độ tan theo nhiệt độ' },
      { id: 'c', text: 'khả năng hấp phụ khác nhau', feedback: 'Đó là nguyên tắc của sắc kí cột.' },
      { id: 'd', text: 'khối lượng riêng khác nhau' }
    ],
    correctAnswer: 'b',
    explanation: 'Chất tan nhiều ở nhiệt độ cao, ít ở nhiệt độ thấp sẽ kết tinh khi làm nguội dung dịch bão hòa.'
  },
  {
    id: 'g11-l11-q2', lessonId: 'g11-l11', type: 'multiple', difficulty: 'understand',
    objective: 'Nhận biết ứng dụng của phương pháp chưng cất.',
    content: 'Chọn tất cả quá trình sử dụng phương pháp chưng cất.',
    options: [
      { id: 'a', text: 'Nấu rượu từ hỗn hợp lên men.' },
      { id: 'b', text: 'Tách các phân đoạn từ dầu mỏ.' },
      { id: 'c', text: 'Sản xuất tinh dầu sả.' },
      { id: 'd', text: 'Sản xuất đường kính từ nước mía.', feedback: 'Đây là kết tinh.' },
      { id: 'e', text: 'Tách lớp dầu ăn khỏi nước.', feedback: 'Đây là chiết.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'Nấu rượu (chưng cất thường), dầu mỏ (chưng cất phân đoạn), tinh dầu (chưng cất lôi cuốn hơi nước).'
  },
  {
    id: 'g11-l11-q3', lessonId: 'g11-l11', type: 'truefalse', difficulty: 'understand',
    objective: 'Phân biệt các phương pháp tách biệt, tinh chế.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Chiết lỏng – lỏng dùng hai dung môi không trộn lẫn vào nhau.', explanation: 'Hai lớp tách riêng trong phễu chiết.' },
      { id: 'b', text: 'Sắc kí cột dựa vào sự khác nhau về nhiệt độ sôi.', explanation: 'Sắc kí dựa vào khả năng hấp phụ khác nhau trên pha tĩnh.' },
      { id: 'c', text: 'Có thể tách ethanol khỏi nước bằng phương pháp chiết.', explanation: 'Ethanol tan vô hạn trong nước, phải dùng chưng cất.' },
      { id: 'd', text: 'Pha trà là một ví dụ của chiết lỏng – rắn.', explanation: 'Nước nóng hòa tan các chất trong lá trà.' }
    ],
    correctAnswer: { a: true, b: false, c: false, d: true },
    explanation: 'Mỗi phương pháp dựa trên một tính chất vật lí khác nhau.'
  },
  {
    id: 'g11-l11-q4', lessonId: 'g11-l11', type: 'short', difficulty: 'recognize',
    objective: 'Gọi tên dụng cụ chiết.',
    content: 'Dụng cụ thường dùng để tách hai chất lỏng không trộn lẫn sau khi chiết là gì?',
    correctAnswer: { accepted: ['phễu chiết', 'phểu chiết'] },
    explanation: 'Phễu chiết có khóa ở đáy để cho lớp chất lỏng phía dưới chảy ra riêng.'
  },
  {
    id: 'g11-l11-q5', lessonId: 'g11-l11', type: 'numeric', difficulty: 'apply',
    objective: 'Tính lượng chất kết tinh khi làm nguội dung dịch bão hòa.',
    content: 'Độ tan của chất A là 80 g/100 g nước ở 70 °C và 20 g/100 g nước ở 10 °C. Pha dung dịch A bão hòa trong 50 g nước ở 70 °C rồi làm nguội xuống 10 °C. Tính khối lượng A kết tinh.',
    correctAnswer: { value: 30, unit: 'g', tolerance: 0.1 },
    verify: () => 0.5 * (80 - 20),
    solution: ['50 g nước ở 70 °C hòa tan tối đa 40 g A.', 'Ở 10 °C chỉ hòa tan 10 g A.', 'Khối lượng A kết tinh: 40 − 10 = 30 g.'],
    explanation: 'Lượng kết tinh bằng hiệu lượng chất tan tối đa ở hai nhiệt độ.'
  },
  {
    id: 'g11-l11-q6', lessonId: 'g11-l11', type: 'single', difficulty: 'apply',
    objective: 'Chọn phương pháp tách phù hợp.',
    content: 'Để tách riêng các sắc tố (diệp lục, carotene…) có trong dịch chiết lá cây, phương pháp phù hợp nhất là',
    options: [
      { id: 'a', text: 'kết tinh' },
      { id: 'b', text: 'sắc kí cột' },
      { id: 'c', text: 'chưng cất thường', feedback: 'Các sắc tố khó bay hơi và dễ bị phân hủy khi đun nóng.' },
      { id: 'd', text: 'lọc' }
    ],
    correctAnswer: 'b',
    explanation: 'Các sắc tố bị hấp phụ khác nhau trên cột nên đi xuống với tốc độ khác nhau.'
  },
  {
    id: 'g11-l11-q7', lessonId: 'g11-l11', type: 'numeric', difficulty: 'understand',
    objective: 'Vận dụng khái niệm thành phần thể tích khi chưng cất.',
    content: 'Một dung dịch ethanol – nước chứa 40% ethanol theo thể tích. Chưng cất 100 mL dung dịch này, tối đa thu được bao nhiêu mL ethanol nguyên chất?',
    correctAnswer: { value: 40, unit: 'mL', tolerance: 0.1 },
    verify: () => 100 * 0.4,
    solution: ['Thể tích ethanol có trong 100 mL dung dịch: 100 × 40% = 40 mL.', 'Đây là lượng tối đa có thể tách ra.'],
    explanation: 'Thực tế chưng cất thường không tách được ethanol hoàn toàn tinh khiết vì ethanol và nước cùng bay hơi.'
  },

  /* ----- Bài 12. Công thức phân tử ----- */
  {
    id: 'g11-l12-q1', lessonId: 'g11-l12', type: 'single', difficulty: 'recognize',
    objective: 'Xác định công thức đơn giản nhất.',
    content: 'Benzene có công thức phân tử C₆H₆. Công thức đơn giản nhất của benzene là',
    options: [
      { id: 'a', text: 'C₆H₆' },
      { id: 'b', text: 'CH' },
      { id: 'c', text: 'C₃H₃' },
      { id: 'd', text: 'CH₂' }
    ],
    correctAnswer: 'b',
    explanation: 'Tỉ lệ C : H = 6 : 6 = 1 : 1.'
  },
  {
    id: 'g11-l12-q2', lessonId: 'g11-l12', type: 'numeric', difficulty: 'apply',
    objective: 'Tìm số nguyên tử trong phân tử từ phần trăm khối lượng và phân tử khối.',
    content: 'Một hydrocarbon chứa 85,71% C về khối lượng, phân tử khối là 28. Phân tử hydrocarbon có bao nhiêu nguyên tử carbon?',
    correctAnswer: { value: 2 },
    verify: () => Math.round(28 * 0.8571 / 12),
    solution: ['Số nguyên tử C = M × %C / (12 × 100) = 28 × 85,71 / 1200 ≈ 2.', 'Số nguyên tử H = 28 × 14,29 / 100 ≈ 4 ⇒ C₂H₄.'],
    explanation: 'Khi biết phân tử khối, có thể tính trực tiếp số nguyên tử mỗi nguyên tố.'
  },
  {
    id: 'g11-l12-q3', lessonId: 'g11-l12', type: 'multiple', difficulty: 'understand',
    objective: 'Nhận biết các chất có cùng công thức đơn giản nhất.',
    content: 'Chọn tất cả chất có công thức đơn giản nhất là CH₂O.',
    options: [
      { id: 'a', text: 'HCHO (formaldehyde)' },
      { id: 'b', text: 'CH₃COOH' },
      { id: 'c', text: 'C₆H₁₂O₆' },
      { id: 'd', text: 'C₂H₅OH', feedback: 'C₂H₆O có tỉ lệ 2 : 6 : 1, không rút gọn về CH₂O.' },
      { id: 'e', text: 'CO₂', feedback: 'CO₂ không có hydrogen.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'CH₂O, C₂H₄O₂, C₆H₁₂O₆ đều có tỉ lệ C : H : O = 1 : 2 : 1.'
  },
  {
    id: 'g11-l12-q4', lessonId: 'g11-l12', type: 'truefalse', difficulty: 'understand',
    objective: 'Hiểu cách lập công thức phân tử.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Khi đốt cháy hợp chất hữu cơ, n(H) = 2n(H₂O).', explanation: 'Mỗi phân tử H₂O có 2 nguyên tử H.' },
      { id: 'b', text: 'Với hợp chất đơn giản, tín hiệu có m/z lớn nhất trên phổ MS cho biết phân tử khối.', explanation: 'Đó là tín hiệu của ion phân tử.' },
      { id: 'c', text: 'Công thức phân tử luôn khác công thức đơn giản nhất.', explanation: 'Có thể trùng nhau, ví dụ CH₄, C₂H₆O.' },
      { id: 'd', text: 'Khối lượng oxygen trong chất bằng tổng khối lượng oxygen trong CO₂ và H₂O tạo thành.', explanation: 'Một phần oxygen đến từ O₂ đốt cháy; phải tính bằng hiệu.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: false },
    explanation: 'Công thức phân tử = (công thức đơn giản nhất)ₙ, n có thể bằng 1.'
  },
  {
    id: 'g11-l12-q5', lessonId: 'g11-l12', type: 'short', difficulty: 'apply',
    objective: 'Lập công thức phân tử từ công thức đơn giản nhất và phân tử khối.',
    content: 'Một hydrocarbon có công thức đơn giản nhất CH₂ và phân tử khối 42. Viết công thức phân tử.',
    correctAnswer: { accepted: ['C3H6', 'C₃H₆'], caseSensitive: true, compact: true },
    explanation: '(CH₂)ₙ có M = 14n = 42 ⇒ n = 3 ⇒ C₃H₆.'
  },
  {
    id: 'g11-l12-q6', lessonId: 'g11-l12', type: 'numeric', difficulty: 'advanced',
    objective: 'Lập công thức phân tử từ kết quả đốt cháy.',
    content: 'Đốt cháy hoàn toàn 2,3 g chất hữu cơ X (C, H, O) thu được 4,4 g CO₂ và 2,7 g H₂O. Phân tử khối của X là 46. Phân tử X có bao nhiêu nguyên tử carbon?',
    correctAnswer: { value: 2 },
    verify: () => {
      const carbon = 4.4 / 44
      const sample = 2.3 / 46
      return carbon / sample
    },
    solution: [
      'n(C) = 4,4 / 44 = 0,1 mol; n(H) = 2 × 2,7 / 18 = 0,3 mol; m(O) = 2,3 − 1,2 − 0,3 = 0,8 g ⇒ n(O) = 0,05 mol.',
      'C : H : O = 0,1 : 0,3 : 0,05 = 2 : 6 : 1 ⇒ C₂H₆O (M = 46).',
      'X có 2 nguyên tử C.'
    ],
    explanation: 'n(X) = 2,3 / 46 = 0,05 mol, mỗi mol X tạo 2 mol CO₂.'
  },
  {
    id: 'g11-l12-q7', lessonId: 'g11-l12', type: 'single', difficulty: 'understand',
    objective: 'Đọc phổ khối lượng.',
    content: 'Phổ MS của một hợp chất có các tín hiệu m/z: 15, 29, 31, 45, 46. Phân tử khối của hợp chất là',
    options: [
      { id: 'a', text: '15' },
      { id: 'b', text: '31', feedback: 'Có thể là tín hiệu mạnh nhất (mảnh vỡ), nhưng không phải ion phân tử.' },
      { id: 'c', text: '46' },
      { id: 'd', text: '166', feedback: 'Không cộng các giá trị m/z.' }
    ],
    correctAnswer: 'c',
    explanation: 'Ion phân tử ứng với m/z lớn nhất: M = 46 (phù hợp với C₂H₆O).'
  },

  /* ----- Bài 13. Cấu tạo hóa học ----- */
  {
    id: 'g11-l13-q1', lessonId: 'g11-l13', type: 'single', difficulty: 'recognize',
    objective: 'Nêu hóa trị của carbon trong hợp chất hữu cơ.',
    content: 'Trong hợp chất hữu cơ, carbon có hóa trị',
    options: [
      { id: 'a', text: 'II' },
      { id: 'b', text: 'III' },
      { id: 'c', text: 'IV' },
      { id: 'd', text: 'VI' }
    ],
    correctAnswer: 'c',
    explanation: 'Nguyên tử C tạo 4 liên kết cộng hóa trị.'
  },
  {
    id: 'g11-l13-q2', lessonId: 'g11-l13', type: 'multiple', difficulty: 'understand',
    objective: 'Nhận biết các chất đồng phân.',
    content: 'Chọn tất cả các cặp chất là đồng phân của nhau.',
    options: [
      { id: 'a', text: 'CH₃CH₂OH và CH₃OCH₃' },
      { id: 'b', text: 'CH₃CH₂CH₂CH₃ và CH₃CH(CH₃)CH₃' },
      { id: 'c', text: 'CH₄ và C₂H₆', feedback: 'Hơn kém CH₂: là đồng đẳng.' },
      { id: 'd', text: 'CH₃CH₂CH₂OH và CH₃CH(OH)CH₃' },
      { id: 'e', text: 'C₂H₄ và C₂H₆', feedback: 'Khác công thức phân tử.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Đồng phân có cùng công thức phân tử: C₂H₆O, C₄H₁₀, C₃H₈O.'
  },
  {
    id: 'g11-l13-q3', lessonId: 'g11-l13', type: 'truefalse', difficulty: 'understand',
    objective: 'Hiểu thuyết cấu tạo hóa học, đồng đẳng và đồng phân.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Các chất đồng đẳng hơn kém nhau một hay nhiều nhóm CH₂.', explanation: 'Ví dụ CH₄, C₂H₆, C₃H₈.' },
      { id: 'b', text: 'Các chất đồng phân có tính chất giống hệt nhau.', explanation: 'Tính chất phụ thuộc cấu tạo nên đồng phân có tính chất khác nhau.' },
      { id: 'c', text: 'Ethanol có nhiệt độ sôi cao hơn dimethyl ether.', explanation: 'Ethanol có liên kết hydrogen giữa các phân tử.' },
      { id: 'd', text: 'Uốn cong mạch carbon tạo ra một đồng phân mới.', explanation: 'Uốn mạch không thay đổi thứ tự liên kết, vẫn là cùng một chất.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Thứ tự liên kết (cấu tạo hóa học) quyết định chất.'
  },
  {
    id: 'g11-l13-q4', lessonId: 'g11-l13', type: 'numeric', difficulty: 'apply',
    objective: 'Đếm số đồng phân cấu tạo.',
    content: 'Có bao nhiêu đồng phân cấu tạo ứng với công thức phân tử C₄H₁₀?',
    correctAnswer: { value: 2 },
    verify: () => ['CH3CH2CH2CH3', 'CH3CH(CH3)CH3'].length,
    solution: ['Mạch không nhánh: CH₃CH₂CH₂CH₃.', 'Mạch nhánh: CH₃CH(CH₃)CH₃.'],
    explanation: 'C₄H₁₀ chỉ có đồng phân mạch carbon.'
  },
  {
    id: 'g11-l13-q5', lessonId: 'g11-l13', type: 'short', difficulty: 'recognize',
    objective: 'Gọi tên đồng phân mạch nhánh của butane.',
    content: 'Đồng phân mạch nhánh CH₃CH(CH₃)CH₃ của C₄H₁₀ có tên thông thường là gì?',
    correctAnswer: { accepted: ['isobutane', '2-methylpropane', 'iso-butane'], compact: true },
    explanation: 'CH₃CH(CH₃)CH₃: isobutane, tên thay thế là 2-methylpropane.'
  },
  {
    id: 'g11-l13-q6', lessonId: 'g11-l13', type: 'numeric', difficulty: 'apply',
    objective: 'Đếm số đồng phân có các nhóm chức khác nhau.',
    content: 'Có bao nhiêu đồng phân cấu tạo (cả alcohol và ether) ứng với công thức C₃H₈O?',
    correctAnswer: { value: 3 },
    verify: () => ['CH3CH2CH2OH', 'CH3CH(OH)CH3', 'CH3OCH2CH3'].length,
    solution: ['Alcohol: CH₃CH₂CH₂OH và CH₃CH(OH)CH₃.', 'Ether: CH₃OCH₂CH₃.', 'Tổng: 3 đồng phân.'],
    explanation: 'Gồm đồng phân vị trí nhóm chức và đồng phân loại nhóm chức.'
  },
  {
    id: 'g11-l13-q7', lessonId: 'g11-l13', type: 'single', difficulty: 'advanced',
    objective: 'Viết đồng phân alcohol của C₄H₁₀O.',
    content: 'Số đồng phân alcohol ứng với công thức phân tử C₄H₁₀O là',
    options: [
      { id: 'a', text: '2', feedback: 'Còn các đồng phân có mạch nhánh.' },
      { id: 'b', text: '3' },
      { id: 'c', text: '4' },
      { id: 'd', text: '7', feedback: '7 là tổng số đồng phân alcohol và ether.' }
    ],
    correctAnswer: 'c',
    explanation: 'CH₃CH₂CH₂CH₂OH, CH₃CH₂CH(OH)CH₃, (CH₃)₂CHCH₂OH, (CH₃)₃COH.'
  },

  /* ----- Bài 14. Ôn tập chương 3 ----- */
  {
    id: 'g11-l14-q1', lessonId: 'g11-l14', type: 'single', difficulty: 'apply',
    objective: 'Kết hợp phổ IR để xác định loại hợp chất.',
    content: 'Phổ IR của chất X có tín hiệu C=O ở 1710 cm⁻¹ và tín hiệu O–H rất rộng 2500 – 3300 cm⁻¹. X thuộc loại',
    options: [
      { id: 'a', text: 'alcohol' },
      { id: 'b', text: 'ketone' },
      { id: 'c', text: 'carboxylic acid' },
      { id: 'd', text: 'hydrocarbon' }
    ],
    correctAnswer: 'c',
    explanation: 'Có đồng thời C=O và O–H rất rộng là đặc trưng của nhóm −COOH.'
  },
  {
    id: 'g11-l14-q2', lessonId: 'g11-l14', type: 'numeric', difficulty: 'advanced',
    objective: 'Lập công thức phân tử từ kết quả đốt cháy và phổ MS.',
    content: 'Đốt cháy hoàn toàn 1,8 g chất Y (C, H, O) thu được 2,64 g CO₂ và 1,08 g H₂O. Phổ MS của Y có m/z lớn nhất bằng 180. Phân tử Y có bao nhiêu nguyên tử carbon?',
    correctAnswer: { value: 6 },
    verify: () => (2.64 / 44) / (1.8 / 180),
    solution: [
      'n(C) = 2,64 / 44 = 0,06 mol; n(H) = 2 × 1,08 / 18 = 0,12 mol; m(O) = 1,8 − 0,72 − 0,12 = 0,96 g ⇒ n(O) = 0,06 mol.',
      'C : H : O = 1 : 2 : 1 ⇒ CH₂O; 30n = 180 ⇒ n = 6 ⇒ C₆H₁₂O₆.',
      'Y có 6 nguyên tử C.'
    ],
    explanation: 'Y có thể là glucose hoặc fructose (cùng C₆H₁₂O₆).'
  },
  {
    id: 'g11-l14-q3', lessonId: 'g11-l14', type: 'truefalse', difficulty: 'understand',
    objective: 'Tổng hợp kiến thức chương 3.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'C₃H₈ và CH₄ thuộc cùng dãy đồng đẳng.', explanation: 'Hơn kém 2 nhóm CH₂, đều là alkane.' },
      { id: 'b', text: 'Chưng cất dùng để tách hai chất lỏng tan lẫn có nhiệt độ sôi khác nhau.', explanation: 'Ví dụ ethanol và nước.' },
      { id: 'c', text: 'C₂H₅OH và CH₃OCH₃ là đồng đẳng.', explanation: 'Cùng công thức C₂H₆O, khác cấu tạo: là đồng phân.' },
      { id: 'd', text: 'Nhóm −NH₂ là nhóm chức của amine.', explanation: 'Ví dụ CH₃NH₂.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'Phân biệt đồng đẳng (hơn kém CH₂) và đồng phân (cùng công thức phân tử).'
  },
  {
    id: 'g11-l14-q4', lessonId: 'g11-l14', type: 'multiple', difficulty: 'understand',
    objective: 'Nhận biết hợp chất hữu cơ.',
    content: 'Chọn tất cả hợp chất hữu cơ.',
    options: [
      { id: 'a', text: 'CH₃COONa' },
      { id: 'b', text: 'C₆H₁₂O₆' },
      { id: 'c', text: 'CO', feedback: 'CO được xếp vào hợp chất vô cơ.' },
      { id: 'd', text: '(NH₂)₂CO (urea)' },
      { id: 'e', text: 'NaHCO₃', feedback: 'Muối hydrogencarbonate là hợp chất vô cơ.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Sodium acetate, glucose và urea là hợp chất hữu cơ.'
  },
  {
    id: 'g11-l14-q5', lessonId: 'g11-l14', type: 'short', difficulty: 'recognize',
    objective: 'Viết công thức đơn giản nhất.',
    content: 'Viết công thức đơn giản nhất của acetic acid C₂H₄O₂.',
    correctAnswer: { accepted: ['CH2O', 'CH₂O'], caseSensitive: true, compact: true },
    explanation: 'Chia các chỉ số cho 2: C₂H₄O₂ → CH₂O.'
  },
  {
    id: 'g11-l14-q6', lessonId: 'g11-l14', type: 'numeric', difficulty: 'apply',
    objective: 'Tính phần trăm khối lượng hydrogen trong hydrocarbon.',
    content: 'Tính phần trăm khối lượng hydrogen trong ethane C₂H₆ (C = 12, H = 1).',
    correctAnswer: { value: 20, unit: '%', tolerance: 0.1 },
    verify: () => 6 / molarMass('C2H6') * 100,
    solution: ['M(C₂H₆) = 24 + 6 = 30 g/mol.', '%H = 6 / 30 × 100% = 20%.'],
    explanation: 'Phần còn lại 80% là carbon.'
  },
  {
    id: 'g11-l14-q7', lessonId: 'g11-l14', type: 'single', difficulty: 'apply',
    objective: 'Chọn phương pháp tinh chế chất rắn.',
    content: 'Để tinh chế một chất rắn hữu cơ bị lẫn ít tạp chất, phương pháp thường dùng là',
    options: [
      { id: 'a', text: 'kết tinh lại' },
      { id: 'b', text: 'chưng cất', feedback: 'Chưng cất dùng cho chất lỏng.' },
      { id: 'c', text: 'chiết lỏng – lỏng' },
      { id: 'd', text: 'cho bay hơi hoàn toàn dung môi', feedback: 'Bay hơi hết dung môi sẽ giữ lại cả tạp chất.' }
    ],
    correctAnswer: 'a',
    explanation: 'Hòa tan trong dung môi nóng, lọc, làm nguội để chất cần tinh chế kết tinh; tạp chất ở lại dung dịch.'
  }
]
