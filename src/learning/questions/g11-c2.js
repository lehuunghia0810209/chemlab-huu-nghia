// Hóa học 11 · Chương 2 — Nitrogen và sulfur. Questions for Bài 4–9.
import { molarMass, GAS_VOLUME_STANDARD as VM } from '../chemMath.js'

export const questions = [
  /* ----- Bài 4. Nitrogen ----- */
  {
    id: 'g11-l4-q1', lessonId: 'g11-l4', type: 'single', difficulty: 'recognize',
    objective: 'Nêu trạng thái tự nhiên của nitrogen.',
    content: 'Nitrogen chiếm khoảng bao nhiêu phần trăm thể tích không khí?',
    options: [
      { id: 'a', text: '21%', feedback: '21% là phần trăm thể tích của oxygen.' },
      { id: 'b', text: '78%' },
      { id: 'c', text: '1%' },
      { id: 'd', text: '50%' }
    ],
    correctAnswer: 'b',
    explanation: 'Không khí khô gồm khoảng 78% N₂, 21% O₂ và 1% các khí khác (theo thể tích).'
  },
  {
    id: 'g11-l4-q2', lessonId: 'g11-l4', type: 'truefalse', difficulty: 'understand',
    objective: 'Giải thích tính trơ và tính chất hóa học của nitrogen.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu về nitrogen.',
    statements: [
      { id: 'a', text: 'Ở nhiệt độ thường, N₂ khá trơ do có liên kết ba bền.', explanation: 'Năng lượng liên kết N≡N khoảng 945 kJ/mol.' },
      { id: 'b', text: 'N₂ chỉ có tính oxi hóa.', explanation: 'N₂ (số oxi hóa 0) vừa có tính oxi hóa (với H₂), vừa có tính khử (với O₂).' },
      { id: 'c', text: 'Ở nhiệt độ rất cao, N₂ tác dụng với O₂ tạo NO.', explanation: 'Xảy ra trong động cơ và khi có sấm sét.' },
      { id: 'd', text: 'N₂ là khí màu nâu đỏ.', explanation: 'N₂ không màu; NO₂ mới có màu nâu đỏ.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Số oxi hóa 0 là trung gian giữa −3 và +5.',
    equations: ['N₂ + O₂ ⇌ 2NO']
  },
  {
    id: 'g11-l4-q3', lessonId: 'g11-l4', type: 'numeric', difficulty: 'understand',
    objective: 'Xác định số oxi hóa của nitrogen.',
    content: 'Số oxi hóa của nitrogen trong N₂O là bao nhiêu?',
    correctAnswer: { value: 1, display: '+1' },
    verify: () => (0 - -2) / 2,
    solution: ['Gọi số oxi hóa của N là x: 2x + (−2) = 0.', 'x = +1.'],
    explanation: 'N₂O (dinitrogen oxide) có N ở số oxi hóa +1.'
  },
  {
    id: 'g11-l4-q4', lessonId: 'g11-l4', type: 'multiple', difficulty: 'understand',
    objective: 'Nêu ứng dụng của nitrogen.',
    content: 'Chọn tất cả ứng dụng của nitrogen.',
    options: [
      { id: 'a', text: 'Bơm vào bao bì để bảo quản thực phẩm.' },
      { id: 'b', text: 'Nitrogen lỏng bảo quản mẫu sinh học.' },
      { id: 'c', text: 'Làm nhiên liệu cho bếp gas.', feedback: 'N₂ không cháy được.' },
      { id: 'd', text: 'Nguyên liệu tổng hợp ammonia.' },
      { id: 'e', text: 'Khử trùng nước sinh hoạt.', feedback: 'Khử trùng nước dùng chlorine, không phải nitrogen.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'Nitrogen trơ, nitrogen lỏng rất lạnh và là nguồn nguyên tố N cho tổng hợp ammonia.'
  },
  {
    id: 'g11-l4-q5', lessonId: 'g11-l4', type: 'numeric', difficulty: 'apply',
    objective: 'Tính lượng ammonia theo hiệu suất.',
    content: 'Cho 2,0 mol N₂ và 6,0 mol H₂ phản ứng (xúc tác Fe, nhiệt độ, áp suất thích hợp). Hiệu suất phản ứng là 30%. Tính số mol NH₃ thu được.',
    correctAnswer: { value: 1.2, unit: 'mol', tolerance: 0.01 },
    verify: () => 2 * 0.3 * 2,
    solution: ['N₂ + 3H₂ ⇌ 2NH₃.', 'N₂ phản ứng: 2,0 × 30% = 0,6 mol ⇒ NH₃ = 2 × 0,6 = 1,2 mol.'],
    explanation: 'Tỉ lệ ban đầu đúng hệ số nên tính hiệu suất theo chất nào cũng được.',
    equations: ['N₂ + 3H₂ ⇌ 2NH₃']
  },
  {
    id: 'g11-l4-q6', lessonId: 'g11-l4', type: 'short', difficulty: 'recognize',
    objective: 'Viết sản phẩm phản ứng của nitrogen với oxygen.',
    content: 'Viết công thức khí tạo thành khi N₂ tác dụng với O₂ ở nhiệt độ rất cao (hoặc tia lửa điện).',
    correctAnswer: { accepted: ['NO'], caseSensitive: true, compact: true },
    explanation: 'N₂ + O₂ ⇌ 2NO; NO sau đó bị oxi hóa trong không khí thành NO₂.',
    equations: ['N₂ + O₂ ⇌ 2NO']
  },
  {
    id: 'g11-l4-q7', lessonId: 'g11-l4', type: 'single', difficulty: 'advanced',
    objective: 'Tính thể tích nitrogen cần dùng khi biết hiệu suất.',
    content: 'Để điều chế 3,4 g NH₃ với hiệu suất phản ứng 25%, cần dùng bao nhiêu lít N₂ ở điều kiện chuẩn (24,79 L/mol)? (N = 14, H = 1)',
    options: [
      { id: 'a', text: '2,479 L', feedback: 'Đây là lượng N₂ khi hiệu suất 100%.' },
      { id: 'b', text: '9,916 L' },
      { id: 'c', text: '0,620 L', feedback: 'Phải chia (không nhân) cho hiệu suất khi tính lượng chất đầu.' },
      { id: 'd', text: '4,958 L', feedback: 'Tỉ lệ N₂ : NH₃ là 1 : 2.' }
    ],
    correctAnswer: 'b',
    explanation: 'n(NH₃) = 0,2 mol ⇒ N₂ lí thuyết 0,1 mol; hiệu suất 25% ⇒ N₂ cần 0,1 / 0,25 = 0,4 mol ⇒ V = 0,4 × 24,79 = 9,916 L.',
    equations: ['N₂ + 3H₂ ⇌ 2NH₃']
  },

  /* ----- Bài 5. Ammonia. Muối ammonium ----- */
  {
    id: 'g11-l5-q1', lessonId: 'g11-l5', type: 'single', difficulty: 'recognize',
    objective: 'Nêu tính base của dung dịch ammonia.',
    content: 'Nhúng giấy quỳ tím vào dung dịch ammonia, giấy quỳ',
    options: [
      { id: 'a', text: 'hóa đỏ', feedback: 'Quỳ hóa đỏ trong môi trường acid.' },
      { id: 'b', text: 'hóa xanh' },
      { id: 'c', text: 'không đổi màu' },
      { id: 'd', text: 'mất màu' }
    ],
    correctAnswer: 'b',
    explanation: 'NH₃ + H₂O ⇌ NH₄⁺ + OH⁻: dung dịch có tính base.',
    equations: ['NH₃ + H₂O ⇌ NH₄⁺ + OH⁻']
  },
  {
    id: 'g11-l5-q2', lessonId: 'g11-l5', type: 'numeric', difficulty: 'apply',
    objective: 'Tính thể tích ammonia giải phóng từ muối ammonium.',
    content: 'Đun nóng 10,7 g NH₄Cl với dung dịch NaOH dư. Tính thể tích NH₃ ở điều kiện chuẩn (24,79 L/mol) (N = 14, H = 1, Cl = 35,5).',
    correctAnswer: { value: 4.958, unit: 'L', tolerance: 0.01 },
    verify: () => 10.7 / molarMass('NH4Cl') * VM,
    solution: ['n(NH₄Cl) = 10,7 / 53,5 = 0,2 mol.', 'NH₄Cl + NaOH → NaCl + NH₃ + H₂O ⇒ n(NH₃) = 0,2 mol.', 'V = 0,2 × 24,79 = 4,958 L.'],
    explanation: 'Tỉ lệ mol NH₄⁺ : NH₃ = 1 : 1.',
    equations: ['NH₄Cl + NaOH → NaCl + NH₃ + H₂O']
  },
  {
    id: 'g11-l5-q3', lessonId: 'g11-l5', type: 'multiple', difficulty: 'understand',
    objective: 'Nêu tính chất của ammonia.',
    content: 'Chọn tất cả tính chất của ammonia.',
    options: [
      { id: 'a', text: 'Tan rất nhiều trong nước.' },
      { id: 'b', text: 'Dung dịch có tính base yếu.' },
      { id: 'c', text: 'Có tính khử.' },
      { id: 'd', text: 'Là khí màu nâu.', feedback: 'NH₃ là khí không màu, mùi khai.' },
      { id: 'e', text: 'Nặng hơn không khí.', feedback: 'M(NH₃) = 17 < 29 nên nhẹ hơn không khí.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'NH₃ tan tốt nhờ liên kết hydrogen, là base yếu và có tính khử (N ở số oxi hóa −3).'
  },
  {
    id: 'g11-l5-q4', lessonId: 'g11-l5', type: 'truefalse', difficulty: 'understand',
    objective: 'Vận dụng tính chất của muối ammonium và quá trình Haber.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'NH₄Cl bị nhiệt phân tạo NH₃ và HCl.', explanation: 'NH₄Cl → NH₃ + HCl (đun nóng).' },
      { id: 'b', text: 'Không nên bón phân đạm ammonium cùng với vôi.', explanation: 'Vôi giải phóng NH₃ làm mất đạm.' },
      { id: 'c', text: 'Trong công nghiệp, NH₃ được tổng hợp ở nhiệt độ càng thấp càng tốt.', explanation: 'Nhiệt độ thấp làm tốc độ quá chậm; thực tế dùng khoảng 400 – 450 °C.' },
      { id: 'd', text: 'Khí NH₃ gặp khí HCl tạo khói trắng.', explanation: 'Khói trắng là tinh thể NH₄Cl.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'Muối ammonium dễ bị nhiệt phân và phản ứng với base.',
    equations: ['NH₄Cl → NH₃ + HCl', 'NH₃ + HCl → NH₄Cl']
  },
  {
    id: 'g11-l5-q5', lessonId: 'g11-l5', type: 'short', difficulty: 'recognize',
    objective: 'Viết công thức chất tạo thành khi NH₃ gặp HCl.',
    content: 'Viết công thức chất rắn tạo thành “khói trắng” khi khí NH₃ gặp khí HCl.',
    correctAnswer: { accepted: ['NH4Cl', 'NH₄Cl'], caseSensitive: true, compact: true },
    explanation: 'NH₃ + HCl → NH₄Cl: hai khí gặp nhau tạo các hạt rắn ammonium chloride rất nhỏ.',
    equations: ['NH₃ + HCl → NH₄Cl']
  },
  {
    id: 'g11-l5-q6', lessonId: 'g11-l5', type: 'single', difficulty: 'apply',
    objective: 'Giải thích điều kiện của quá trình Haber.',
    content: 'Trong quá trình Haber, áp suất cao (khoảng 150 – 200 bar) được dùng vì',
    options: [
      { id: 'a', text: 'phản ứng thuận làm giảm số mol khí, áp suất cao làm cân bằng chuyển dịch theo chiều thuận' },
      { id: 'b', text: 'áp suất cao làm giảm tốc độ phản ứng', feedback: 'Áp suất cao làm tăng nồng độ khí, tốc độ tăng.' },
      { id: 'c', text: 'áp suất cao giúp xúc tác Fe không bị hao mòn' },
      { id: 'd', text: 'phản ứng thuận thu nhiệt', feedback: 'Phản ứng thuận tỏa nhiệt; điều này liên quan đến nhiệt độ, không phải áp suất.' }
    ],
    correctAnswer: 'a',
    explanation: 'N₂ + 3H₂ ⇌ 2NH₃: 4 mol khí → 2 mol khí; tăng áp suất có lợi cho chiều thuận.',
    equations: ['N₂(g) + 3H₂(g) ⇌ 2NH₃(g)']
  },
  {
    id: 'g11-l5-q7', lessonId: 'g11-l5', type: 'numeric', difficulty: 'advanced',
    objective: 'Tính hàm lượng nitrogen trong phân đạm.',
    content: 'Tính phần trăm khối lượng nitrogen trong phân đạm ammonium nitrate NH₄NO₃ (N = 14, H = 1, O = 16).',
    correctAnswer: { value: 35, unit: '%', tolerance: 0.1 },
    verify: () => 2 * 14 / molarMass('NH4NO3') * 100,
    solution: ['M(NH₄NO₃) = 14 + 4 + 14 + 48 = 80 g/mol.', 'Mỗi phân tử có 2 nguyên tử N: %N = 28 / 80 × 100% = 35%.'],
    explanation: 'Độ dinh dưỡng của phân đạm được đánh giá theo phần trăm khối lượng N.'
  },

  /* ----- Bài 6. Hợp chất của nitrogen với oxygen ----- */
  {
    id: 'g11-l6-q1', lessonId: 'g11-l6', type: 'single', difficulty: 'recognize',
    objective: 'Nêu tính oxi hóa mạnh của nitric acid.',
    content: 'Acid nào hòa tan được đồng (Cu)?',
    options: [
      { id: 'a', text: 'HCl loãng', feedback: 'Cu đứng sau H nên không tác dụng với HCl.' },
      { id: 'b', text: 'HNO₃ loãng' },
      { id: 'c', text: 'H₂SO₄ loãng', feedback: 'H₂SO₄ loãng chỉ có tính oxi hóa của H⁺, không oxi hóa được Cu.' },
      { id: 'd', text: 'CH₃COOH' }
    ],
    correctAnswer: 'b',
    explanation: 'N⁺⁵ trong HNO₃ có tính oxi hóa mạnh: 3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O.',
    equations: ['3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O']
  },
  {
    id: 'g11-l6-q2', lessonId: 'g11-l6', type: 'numeric', difficulty: 'apply',
    objective: 'Tính thể tích NO khi kim loại tác dụng với HNO₃ loãng.',
    content: 'Cho 9,6 g Cu tác dụng hết với dung dịch HNO₃ loãng, dư, thu được khí NO (sản phẩm khử duy nhất). Tính thể tích NO ở điều kiện chuẩn (24,79 L/mol) (Cu = 64).',
    correctAnswer: { value: 2.479, unit: 'L', tolerance: 0.01 },
    verify: () => 9.6 / molarMass('Cu') * 2 / 3 * VM,
    solution: ['n(Cu) = 9,6 / 64 = 0,15 mol ⇒ electron nhường 0,3 mol.', 'N⁺⁵ + 3e → N⁺² ⇒ n(NO) = 0,1 mol.', 'V = 0,1 × 24,79 = 2,479 L.'],
    explanation: 'Có thể dùng phương trình 3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O hoặc bảo toàn electron.',
    equations: ['3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O']
  },
  {
    id: 'g11-l6-q3', lessonId: 'g11-l6', type: 'truefalse', difficulty: 'understand',
    objective: 'Nêu tính chất của NOₓ, HNO₃ và mưa acid.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'NO₂ là khí màu nâu đỏ.', explanation: 'NO không màu, NO₂ nâu đỏ.' },
      { id: 'b', text: 'Al bị thụ động trong HNO₃ đặc, nguội.', explanation: 'Có thể chứa HNO₃ đặc trong bình nhôm.' },
      { id: 'c', text: 'Fe tác dụng với HNO₃ loãng giải phóng khí H₂.', explanation: 'HNO₃ tác dụng với kim loại không tạo H₂.' },
      { id: 'd', text: 'Mưa acid là mưa có pH nhỏ hơn 5,6.', explanation: 'Nước mưa sạch có pH khoảng 5,6.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'HNO₃ là chất oxi hóa mạnh; NOₓ là nguyên nhân gây mưa acid.'
  },
  {
    id: 'g11-l6-q4', lessonId: 'g11-l6', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định kim loại tác dụng được với nitric acid loãng.',
    content: 'Chọn tất cả kim loại tác dụng được với dung dịch HNO₃ loãng.',
    options: [
      { id: 'a', text: 'Cu' },
      { id: 'b', text: 'Ag' },
      { id: 'c', text: 'Au', feedback: 'Vàng không tác dụng với HNO₃.' },
      { id: 'd', text: 'Fe' },
      { id: 'e', text: 'Pt', feedback: 'Platinum không tác dụng với HNO₃.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'HNO₃ oxi hóa được hầu hết kim loại trừ Au, Pt.'
  },
  {
    id: 'g11-l6-q5', lessonId: 'g11-l6', type: 'short', difficulty: 'recognize',
    objective: 'Gọi tên hiện tượng phú dưỡng.',
    content: 'Hiện tượng nguồn nước dư thừa nitrogen, phosphorus làm tảo phát triển mạnh, sau đó thiếu oxygen khiến cá chết, được gọi là gì?',
    correctAnswer: { accepted: ['phú dưỡng', 'hiện tượng phú dưỡng', 'phú dưỡng hóa'] },
    explanation: 'Phú dưỡng thường do nước thải và phân bón dư thừa trôi vào ao hồ, sông ngòi.'
  },
  {
    id: 'g11-l6-q6', lessonId: 'g11-l6', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng muối nitrate tạo thành.',
    content: 'Cho 3,2 g Cu tác dụng hết với dung dịch HNO₃ đặc, dư. Tính khối lượng muối Cu(NO₃)₂ thu được (Cu = 64, N = 14, O = 16).',
    correctAnswer: { value: 9.4, unit: 'g', tolerance: 0.02 },
    verify: () => 3.2 / molarMass('Cu') * molarMass('Cu(NO3)2'),
    solution: ['n(Cu) = 3,2 / 64 = 0,05 mol ⇒ n(Cu(NO₃)₂) = 0,05 mol.', 'm = 0,05 × 188 = 9,4 g.'],
    explanation: 'Mỗi nguyên tử Cu tạo một phân tử Cu(NO₃)₂.',
    equations: ['Cu + 4HNO₃ → Cu(NO₃)₂ + 2NO₂ + 2H₂O']
  },
  {
    id: 'g11-l6-q7', lessonId: 'g11-l6', type: 'single', difficulty: 'advanced',
    objective: 'Phân biệt vai trò oxi hóa và môi trường của HNO₃.',
    content: 'Trong phản ứng Cu + 4HNO₃ (đặc) → Cu(NO₃)₂ + 2NO₂ + 2H₂O, số phân tử HNO₃ đóng vai trò chất oxi hóa là',
    options: [
      { id: 'a', text: '4', feedback: 'Hai phân tử HNO₃ chỉ tạo muối, N giữ +5.' },
      { id: 'b', text: '2' },
      { id: 'c', text: '1' },
      { id: 'd', text: '3' }
    ],
    correctAnswer: 'b',
    explanation: 'Hai N⁺⁵ bị khử thành 2NO₂ (+4); hai N còn lại nằm trong Cu(NO₃)₂ (môi trường).',
    equations: ['Cu + 4HNO₃ → Cu(NO₃)₂ + 2NO₂ + 2H₂O']
  },

  /* ----- Bài 7. Sulfur và sulfur dioxide ----- */
  {
    id: 'g11-l7-q1', lessonId: 'g11-l7', type: 'single', difficulty: 'recognize',
    objective: 'Mô tả tính chất vật lí của sulfur.',
    content: 'Ở điều kiện thường, sulfur là',
    options: [
      { id: 'a', text: 'chất khí không màu' },
      { id: 'b', text: 'chất rắn màu vàng, không tan trong nước' },
      { id: 'c', text: 'chất lỏng màu nâu đỏ', feedback: 'Đó là bromine.' },
      { id: 'd', text: 'chất rắn màu trắng, tan nhiều trong nước' }
    ],
    correctAnswer: 'b',
    explanation: 'Sulfur là chất rắn màu vàng, không tan trong nước.'
  },
  {
    id: 'g11-l7-q2', lessonId: 'g11-l7', type: 'multiple', difficulty: 'understand',
    objective: 'Xác định phản ứng thể hiện tính khử của SO₂.',
    content: 'Chọn tất cả phản ứng trong đó SO₂ đóng vai trò chất khử.',
    options: [
      { id: 'a', text: '2SO₂ + O₂ ⇌ 2SO₃' },
      { id: 'b', text: 'SO₂ + Br₂ + 2H₂O → H₂SO₄ + 2HBr' },
      { id: 'c', text: 'SO₂ + 2H₂S → 3S + 2H₂O', feedback: 'S trong SO₂ giảm từ +4 xuống 0: SO₂ là chất oxi hóa.' },
      { id: 'd', text: 'SO₂ + 2NaOH → Na₂SO₃ + H₂O', feedback: 'Không có sự thay đổi số oxi hóa: phản ứng acid – base.' },
      { id: 'e', text: 'SO₂ + Cl₂ + 2H₂O → H₂SO₄ + 2HCl' }
    ],
    correctAnswer: ['a', 'b', 'e'],
    explanation: 'Trong các phản ứng a, b, e, S tăng từ +4 lên +6.',
    equations: ['2SO₂ + O₂ ⇌ 2SO₃', 'SO₂ + Br₂ + 2H₂O → H₂SO₄ + 2HBr', 'SO₂ + 2H₂S → 3S + 2H₂O', 'SO₂ + 2NaOH → Na₂SO₃ + H₂O', 'SO₂ + Cl₂ + 2H₂O → H₂SO₄ + 2HCl']
  },
  {
    id: 'g11-l7-q3', lessonId: 'g11-l7', type: 'truefalse', difficulty: 'understand',
    objective: 'Nêu tính chất, ứng dụng và tác hại của sulfur, SO₂.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Thủy ngân tác dụng với sulfur ngay ở nhiệt độ thường.', explanation: 'Hg + S → HgS.' },
      { id: 'b', text: 'SO₂ là khí không màu, mùi hắc, độc.', explanation: 'SO₂ gây kích ứng đường hô hấp.' },
      { id: 'c', text: 'Sulfur chỉ có tính oxi hóa.', explanation: 'S cũng có tính khử: S + O₂ → SO₂.' },
      { id: 'd', text: 'Đốt nhiên liệu có chứa sulfur thải ra SO₂.', explanation: 'Là nguồn SO₂ chính do con người.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'Sulfur ở số oxi hóa 0 vừa oxi hóa vừa khử.',
    equations: ['Hg + S → HgS', 'S + O₂ → SO₂']
  },
  {
    id: 'g11-l7-q4', lessonId: 'g11-l7', type: 'numeric', difficulty: 'apply',
    objective: 'Tính thể tích SO₂ khi đốt sulfur.',
    content: 'Đốt cháy hoàn toàn 6,4 g sulfur trong oxygen dư. Tính thể tích SO₂ ở điều kiện chuẩn (24,79 L/mol) (S = 32).',
    correctAnswer: { value: 4.958, unit: 'L', tolerance: 0.01 },
    verify: () => 6.4 / molarMass('S') * VM,
    solution: ['n(S) = 6,4 / 32 = 0,2 mol.', 'S + O₂ → SO₂ ⇒ n(SO₂) = 0,2 mol ⇒ V = 4,958 L.'],
    explanation: 'Tỉ lệ mol S : SO₂ = 1 : 1.',
    equations: ['S + O₂ → SO₂']
  },
  {
    id: 'g11-l7-q5', lessonId: 'g11-l7', type: 'short', difficulty: 'apply',
    objective: 'Viết công thức muối khi SO₂ tác dụng với kiềm dư.',
    content: 'Dẫn khí SO₂ vào dung dịch NaOH dư. Viết công thức muối tạo thành.',
    correctAnswer: { accepted: ['Na2SO3', 'Na₂SO₃'], caseSensitive: true, compact: true },
    explanation: 'SO₂ + 2NaOH → Na₂SO₃ + H₂O; khi NaOH dư tạo muối trung hòa sodium sulfite.',
    equations: ['SO₂ + 2NaOH → Na₂SO₃ + H₂O']
  },
  {
    id: 'g11-l7-q6', lessonId: 'g11-l7', type: 'numeric', difficulty: 'advanced',
    objective: 'Xác định muối tạo thành khi SO₂ tác dụng với dung dịch kiềm.',
    content: 'Hấp thụ hoàn toàn 0,10 mol SO₂ vào dung dịch chứa 0,15 mol NaOH, thu được hai muối Na₂SO₃ và NaHSO₃. Tính khối lượng Na₂SO₃ (Na = 23, S = 32, O = 16).',
    correctAnswer: { value: 6.3, unit: 'g', tolerance: 0.02 },
    verify: () => {
      const sulfite = 0.15 - 0.1
      return sulfite * molarMass('Na2SO3')
    },
    solution: [
      'Gọi x = n(Na₂SO₃), y = n(NaHSO₃).',
      'Bảo toàn S: x + y = 0,10; bảo toàn Na: 2x + y = 0,15 ⇒ x = 0,05; y = 0,05.',
      'm(Na₂SO₃) = 0,05 × 126 = 6,3 g.'
    ],
    explanation: 'Tỉ lệ n(NaOH) : n(SO₂) = 1,5 nằm giữa 1 và 2 nên tạo cả hai muối.',
    equations: ['SO₂ + 2NaOH → Na₂SO₃ + H₂O', 'SO₂ + NaOH → NaHSO₃']
  },
  {
    id: 'g11-l7-q7', lessonId: 'g11-l7', type: 'single', difficulty: 'understand',
    objective: 'Giải thích vì sao SO₂ vừa oxi hóa vừa khử.',
    content: 'Số oxi hóa của sulfur trong SO₂ là',
    options: [
      { id: 'a', text: '+2' },
      { id: 'b', text: '+4' },
      { id: 'c', text: '+6', feedback: '+6 là số oxi hóa của S trong SO₃, H₂SO₄.' },
      { id: 'd', text: '−2' }
    ],
    correctAnswer: 'b',
    explanation: 'x + 2 × (−2) = 0 ⇒ x = +4, số oxi hóa trung gian nên SO₂ vừa oxi hóa vừa khử.'
  },

  /* ----- Bài 8. Sulfuric acid và muối sulfate ----- */
  {
    id: 'g11-l8-q1', lessonId: 'g11-l8', type: 'single', difficulty: 'recognize',
    objective: 'Nêu quy tắc an toàn khi pha loãng sulfuric acid.',
    content: 'Khi pha loãng sulfuric acid đặc, cần',
    options: [
      { id: 'a', text: 'rót từ từ acid vào nước và khuấy đều' },
      { id: 'b', text: 'rót nhanh nước vào acid', feedback: 'Nước sôi tức thì làm acid bắn ra ngoài, rất nguy hiểm.' },
      { id: 'c', text: 'đun nóng hỗn hợp' },
      { id: 'd', text: 'thêm đá vào acid đặc' }
    ],
    correctAnswer: 'a',
    explanation: 'H₂SO₄ tan trong nước tỏa rất nhiều nhiệt.'
  },
  {
    id: 'g11-l8-q2', lessonId: 'g11-l8', type: 'numeric', difficulty: 'apply',
    objective: 'Tính khối lượng kết tủa BaSO₄.',
    content: 'Cho 100 mL dung dịch Na₂SO₄ 0,1 M tác dụng với dung dịch BaCl₂ dư. Tính khối lượng kết tủa (Ba = 137, S = 32, O = 16).',
    correctAnswer: { value: 2.33, unit: 'g', tolerance: 0.01 },
    verify: () => 0.1 * 0.1 * molarMass('BaSO4'),
    solution: ['n(Na₂SO₄) = 0,1 × 0,1 = 0,01 mol ⇒ n(BaSO₄) = 0,01 mol.', 'm = 0,01 × 233 = 2,33 g.'],
    explanation: 'Ba²⁺ + SO₄²⁻ → BaSO₄ (kết tủa trắng).',
    equations: ['BaCl₂ + Na₂SO₄ → BaSO₄ + 2NaCl']
  },
  {
    id: 'g11-l8-q3', lessonId: 'g11-l8', type: 'multiple', difficulty: 'understand',
    objective: 'Vận dụng tính oxi hóa của H₂SO₄ đặc.',
    content: 'Chọn tất cả chất tác dụng được với H₂SO₄ đặc, nóng (giải phóng SO₂).',
    options: [
      { id: 'a', text: 'Cu' },
      { id: 'b', text: 'C' },
      { id: 'c', text: 'Au', feedback: 'Vàng không bị H₂SO₄ đặc oxi hóa.' },
      { id: 'd', text: 'Fe' },
      { id: 'e', text: 'Pt', feedback: 'Platinum không bị H₂SO₄ đặc oxi hóa.' }
    ],
    correctAnswer: ['a', 'b', 'd'],
    explanation: 'H₂SO₄ đặc, nóng oxi hóa được nhiều kim loại (trừ Au, Pt) và một số phi kim như C, S.',
    equations: ['Cu + 2H₂SO₄ → CuSO₄ + SO₂ + 2H₂O', 'C + 2H₂SO₄ → CO₂ + 2SO₂ + 2H₂O', '2Fe + 6H₂SO₄ → Fe₂(SO₄)₃ + 3SO₂ + 6H₂O']
  },
  {
    id: 'g11-l8-q4', lessonId: 'g11-l8', type: 'truefalse', difficulty: 'understand',
    objective: 'Phân biệt tính chất của H₂SO₄ loãng và đặc; ứng dụng muối sulfate.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'H₂SO₄ đặc có tính háo nước.', explanation: 'Làm đường hóa đen.' },
      { id: 'b', text: 'Fe tác dụng với H₂SO₄ loãng tạo Fe₂(SO₄)₃.', explanation: 'H⁺ chỉ oxi hóa Fe lên +2: tạo FeSO₄ và H₂.' },
      { id: 'c', text: 'BaSO₄ được dùng làm chất cản quang khi chụp X-quang dạ dày.', explanation: 'BaSO₄ rất ít tan nên không độc khi uống.' },
      { id: 'd', text: 'H₂SO₄ loãng oxi hóa được Cu.', explanation: 'Cu đứng sau H; chỉ H₂SO₄ đặc mới oxi hóa được Cu.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Tính oxi hóa của H₂SO₄ loãng do H⁺, của H₂SO₄ đặc do S⁺⁶.',
    equations: ['Fe + H₂SO₄ → FeSO₄ + H₂']
  },
  {
    id: 'g11-l8-q5', lessonId: 'g11-l8', type: 'short', difficulty: 'recognize',
    objective: 'Gọi tên phương pháp sản xuất sulfuric acid.',
    content: 'Phương pháp sản xuất sulfuric acid trong công nghiệp (oxi hóa SO₂ thành SO₃ trên xúc tác V₂O₅) có tên là gì?',
    correctAnswer: { accepted: ['tiếp xúc', 'phương pháp tiếp xúc'] },
    explanation: 'Phương pháp tiếp xúc: S hoặc FeS₂ → SO₂ → SO₃ → oleum → H₂SO₄.'
  },
  {
    id: 'g11-l8-q6', lessonId: 'g11-l8', type: 'numeric', difficulty: 'advanced',
    objective: 'Vận dụng bảo toàn electron với H₂SO₄ đặc.',
    content: 'Cho 0,10 mol Fe tác dụng hết với H₂SO₄ đặc, nóng, dư, thu được SO₂ là sản phẩm khử duy nhất. Tính thể tích SO₂ ở điều kiện chuẩn (24,79 L/mol).',
    correctAnswer: { value: 3.7185, unit: 'L', tolerance: 0.01 },
    verify: () => 0.1 * 3 / 2 * VM,
    solution: ['Fe → Fe³⁺ + 3e ⇒ 0,3 mol electron.', 'S⁺⁶ + 2e → S⁺⁴ ⇒ n(SO₂) = 0,15 mol.', 'V = 0,15 × 24,79 ≈ 3,72 L.'],
    explanation: 'H₂SO₄ đặc, nóng, dư oxi hóa Fe lên +3.',
    equations: ['2Fe + 6H₂SO₄ → Fe₂(SO₄)₃ + 3SO₂ + 6H₂O']
  },
  {
    id: 'g11-l8-q7', lessonId: 'g11-l8', type: 'single', difficulty: 'understand',
    objective: 'Nêu xúc tác của giai đoạn oxi hóa SO₂.',
    content: 'Trong sản xuất H₂SO₄, chất xúc tác cho phản ứng 2SO₂ + O₂ ⇌ 2SO₃ là',
    options: [
      { id: 'a', text: 'Fe', feedback: 'Fe là xúc tác của quá trình tổng hợp NH₃.' },
      { id: 'b', text: 'V₂O₅' },
      { id: 'c', text: 'Pt' },
      { id: 'd', text: 'MnO₂' }
    ],
    correctAnswer: 'b',
    explanation: 'Vanadium(V) oxide được dùng làm xúc tác ở khoảng 450 – 500 °C.',
    equations: ['2SO₂ + O₂ ⇌ 2SO₃']
  },

  /* ----- Bài 9. Ôn tập chương 2 ----- */
  {
    id: 'g11-l9-q1', lessonId: 'g11-l9', type: 'single', difficulty: 'recognize',
    objective: 'Nhận biết SO₂ bằng nước bromine.',
    content: 'Khí nào làm mất màu nước bromine?',
    options: [
      { id: 'a', text: 'CO₂', feedback: 'CO₂ không có tính khử.' },
      { id: 'b', text: 'SO₂' },
      { id: 'c', text: 'N₂' },
      { id: 'd', text: 'O₂' }
    ],
    correctAnswer: 'b',
    explanation: 'SO₂ + Br₂ + 2H₂O → H₂SO₄ + 2HBr.',
    equations: ['SO₂ + Br₂ + 2H₂O → H₂SO₄ + 2HBr']
  },
  {
    id: 'g11-l9-q2', lessonId: 'g11-l9', type: 'numeric', difficulty: 'advanced',
    objective: 'Vận dụng bảo toàn electron với hỗn hợp kim loại và HNO₃.',
    content: 'Hòa tan hoàn toàn hỗn hợp gồm 0,1 mol Cu và 0,1 mol Mg trong dung dịch HNO₃ loãng, dư, thu được khí NO là sản phẩm khử duy nhất. Tính thể tích NO ở điều kiện chuẩn (24,79 L/mol).',
    correctAnswer: { value: 3.305, unit: 'L', tolerance: 0.01 },
    verify: () => (0.1 * 2 + 0.1 * 2) / 3 * VM,
    solution: ['Electron nhường: 0,1 × 2 + 0,1 × 2 = 0,4 mol.', 'N⁺⁵ + 3e → N⁺² ⇒ n(NO) = 0,4 / 3 ≈ 0,1333 mol.', 'V ≈ 0,1333 × 24,79 ≈ 3,31 L.'],
    explanation: 'Bảo toàn electron không cần viết từng phương trình.'
  },
  {
    id: 'g11-l9-q3', lessonId: 'g11-l9', type: 'truefalse', difficulty: 'understand',
    objective: 'Tổng hợp tính chất các hợp chất của nitrogen và sulfur.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Xét nguyên tố N, NH₃ chỉ có tính khử.', explanation: 'N trong NH₃ có số oxi hóa thấp nhất −3.' },
      { id: 'b', text: 'Fe bị thụ động trong H₂SO₄ đặc, nguội.', explanation: 'Tương tự với HNO₃ đặc, nguội.' },
      { id: 'c', text: 'SO₂ chỉ có tính oxi hóa.', explanation: 'SO₂ (S +4) vừa có tính oxi hóa vừa có tính khử.' },
      { id: 'd', text: 'Có thể dùng BaCl₂ phân biệt dung dịch Na₂SO₄ và NaNO₃.', explanation: 'Chỉ Na₂SO₄ tạo kết tủa trắng BaSO₄.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: true },
    explanation: 'Số oxi hóa quyết định tính oxi hóa – khử của hợp chất.'
  },
  {
    id: 'g11-l9-q4', lessonId: 'g11-l9', type: 'multiple', difficulty: 'apply',
    objective: 'Nhận biết chất vừa có tính oxi hóa vừa có tính khử.',
    content: 'Xét nguyên tố N hoặc S, chọn tất cả chất vừa có tính oxi hóa vừa có tính khử.',
    options: [
      { id: 'a', text: 'SO₂' },
      { id: 'b', text: 'NO₂' },
      { id: 'c', text: 'S' },
      { id: 'd', text: 'H₂SO₄', feedback: 'S ở +6 (cao nhất) chỉ có tính oxi hóa.' },
      { id: 'e', text: 'NH₃', feedback: 'N ở −3 (thấp nhất) chỉ có tính khử.' }
    ],
    correctAnswer: ['a', 'b', 'c'],
    explanation: 'SO₂ (+4), NO₂ (+4), S (0) đều ở số oxi hóa trung gian.'
  },
  {
    id: 'g11-l9-q5', lessonId: 'g11-l9', type: 'short', difficulty: 'recognize',
    objective: 'Viết công thức khí sinh ra khi Cu tác dụng với HNO₃ đặc.',
    content: 'Cho Cu vào dung dịch HNO₃ đặc thấy khí màu nâu đỏ thoát ra. Viết công thức khí đó.',
    correctAnswer: { accepted: ['NO2', 'NO₂'], caseSensitive: true, compact: true },
    explanation: 'Cu + 4HNO₃ (đặc) → Cu(NO₃)₂ + 2NO₂ + 2H₂O.',
    equations: ['Cu + 4HNO₃ → Cu(NO₃)₂ + 2NO₂ + 2H₂O']
  },
  {
    id: 'g11-l9-q6', lessonId: 'g11-l9', type: 'numeric', difficulty: 'apply',
    objective: 'Tính phần trăm khối lượng nguyên tố trong acid.',
    content: 'Tính phần trăm khối lượng sulfur trong H₂SO₄ (H = 1, S = 32, O = 16), làm tròn đến 2 chữ số thập phân.',
    correctAnswer: { value: 32.65, unit: '%', tolerance: 0.02 },
    verify: () => 32 / molarMass('H2SO4') * 100,
    solution: ['M(H₂SO₄) = 2 + 32 + 64 = 98 g/mol.', '%S = 32 / 98 × 100% ≈ 32,65%.'],
    explanation: 'Phần trăm khối lượng = khối lượng nguyên tố trong 1 mol chất / khối lượng mol chất.'
  },
  {
    id: 'g11-l9-q7', lessonId: 'g11-l9', type: 'single', difficulty: 'apply',
    objective: 'Tính lượng SO₂ phát thải từ nhiên liệu.',
    content: 'Một nhà máy đốt 50 tấn than chứa 2% sulfur về khối lượng. Nếu toàn bộ sulfur chuyển thành SO₂ thì khối lượng SO₂ thải ra là',
    options: [
      { id: 'a', text: '1 tấn', feedback: '1 tấn là khối lượng sulfur, chưa đổi sang SO₂.' },
      { id: 'b', text: '2 tấn' },
      { id: 'c', text: '4 tấn' },
      { id: 'd', text: '0,5 tấn' }
    ],
    correctAnswer: 'b',
    explanation: 'm(S) = 50 × 2% = 1 tấn; S + O₂ → SO₂: 32 tấn S tạo 64 tấn SO₂ ⇒ 1 tấn S tạo 2 tấn SO₂.',
    equations: ['S + O₂ → SO₂']
  }
]
