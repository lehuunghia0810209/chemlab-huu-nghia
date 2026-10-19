// Hóa học 10 · Chương 2 — Bảng tuần hoàn và định luật tuần hoàn. Questions for Bài 5–9.
import { molarMass } from '../chemMath.js'

export const questions = [
  /* ----- Bài 5. Cấu tạo của bảng tuần hoàn ----- */
  {
    id: 'g10-l5-q1',
    lessonId: 'g10-l5',
    type: 'single',
    difficulty: 'recognize',
    objective: 'Nêu được nguyên tắc xếp các nguyên tố vào cùng một chu kì.',
    content: 'Các nguyên tố được xếp vào cùng một chu kì khi nguyên tử của chúng có cùng',
    options: [
      { id: 'a', text: 'số electron lớp ngoài cùng', feedback: 'Cùng số electron hóa trị thì xếp vào cùng nhóm.' },
      { id: 'b', text: 'số lớp electron' },
      { id: 'c', text: 'số neutron', feedback: 'Số neutron không dùng để sắp xếp bảng tuần hoàn.' },
      { id: 'd', text: 'nguyên tử khối', feedback: 'Bảng tuần hoàn hiện đại sắp xếp theo Z, không theo nguyên tử khối.' }
    ],
    correctAnswer: 'b',
    explanation: 'Chu kì là dãy nguyên tố có cùng số lớp electron; số thứ tự chu kì bằng số lớp electron.'
  },
  {
    id: 'g10-l5-q2',
    lessonId: 'g10-l5',
    type: 'numeric',
    difficulty: 'understand',
    objective: 'Suy ra số lớp electron từ vị trí ô.',
    content: 'Nguyên tố ở ô số 20 trong bảng tuần hoàn có bao nhiêu lớp electron?',
    correctAnswer: { value: 4 },
    verify: () => [2, 8, 8, 2].length,
    solution: ['Z = 20: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s².', 'Electron phân bố trên 4 lớp (2, 8, 8, 2) ⇒ chu kì 4.'],
    explanation: 'Số lớp electron bằng số thứ tự chu kì. Đây là calcium.'
  },
  {
    id: 'g10-l5-q3',
    lessonId: 'g10-l5',
    type: 'short',
    difficulty: 'apply',
    objective: 'Xác định nhóm của nguyên tố từ cấu hình electron.',
    content: 'Nguyên tố có cấu hình electron 1s² 2s² 2p⁶ 3s² 3p⁵ thuộc nhóm nào? (ghi theo số La Mã, ví dụ IIA)',
    correctAnswer: { accepted: ['VIIA', '7A', 'nhóm VIIA'], compact: true },
    explanation: 'Electron cuối điền vào 3p ⇒ nhóm A; lớp ngoài cùng có 2 + 5 = 7 electron ⇒ nhóm VIIA (chlorine).'
  },
  {
    id: 'g10-l5-q4',
    lessonId: 'g10-l5',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'Phân loại nguyên tố theo khối s, p, d, f.',
    content: 'Chọn tất cả nguyên tố thuộc khối p.',
    options: [
      { id: 'a', text: 'Al (1s² 2s² 2p⁶ 3s² 3p¹)' },
      { id: 'b', text: 'Na (1s² 2s² 2p⁶ 3s¹)', feedback: 'Electron cuối điền vào 3s: khối s.' },
      { id: 'c', text: 'S (1s² 2s² 2p⁶ 3s² 3p⁴)' },
      { id: 'd', text: 'Ca (1s² 2s² 2p⁶ 3s² 3p⁶ 4s²)', feedback: 'Electron cuối điền vào 4s: khối s.' },
      { id: 'e', text: 'Ne (1s² 2s² 2p⁶)' }
    ],
    correctAnswer: ['a', 'c', 'e'],
    explanation: 'Khối được xác định theo phân lớp chứa electron cuối cùng: Al (3p), S (3p), Ne (2p) thuộc khối p.'
  },
  {
    id: 'g10-l5-q5',
    lessonId: 'g10-l5',
    type: 'truefalse',
    difficulty: 'recognize',
    objective: 'Mô tả cấu tạo bảng tuần hoàn.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu về bảng tuần hoàn.',
    statements: [
      { id: 'a', text: 'Bảng tuần hoàn có 7 chu kì.', explanation: 'Chu kì 1–3 là chu kì nhỏ, 4–7 là chu kì lớn.' },
      { id: 'b', text: 'Chu kì 3 có 18 nguyên tố.', explanation: 'Chu kì 3 có 8 nguyên tố (Na → Ar); chu kì 4 mới có 18.' },
      { id: 'c', text: 'Các nhóm A gồm các nguyên tố khối s và khối p.', explanation: 'Nhóm IA, IIA là khối s; IIIA → VIIIA là khối p.' },
      { id: 'd', text: 'Các nguyên tố khối d đều là phi kim.', explanation: 'Các nguyên tố khối d (kim loại chuyển tiếp) đều là kim loại.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: '7 chu kì có số nguyên tố 2, 8, 8, 18, 18, 32, 32; nhóm A gồm khối s, p; nhóm B gồm khối d, f.'
  },
  {
    id: 'g10-l5-q6',
    lessonId: 'g10-l5',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Suy ra số hiệu nguyên tử từ vị trí trong bảng tuần hoàn.',
    content: 'Nguyên tố X thuộc chu kì 3, nhóm VIA. Số hiệu nguyên tử của X là bao nhiêu?',
    correctAnswer: { value: 16 },
    verify: () => 2 + 8 + 6,
    solution: ['Chu kì 3 ⇒ 3 lớp; nhóm VIA ⇒ lớp ngoài cùng 3s² 3p⁴.', 'Cấu hình 1s² 2s² 2p⁶ 3s² 3p⁴ ⇒ Z = 2 + 8 + 6 = 16.'],
    explanation: 'X là sulfur: 3 lớp electron, 6 electron lớp ngoài cùng, phi kim.'
  },
  {
    id: 'g10-l5-q7',
    lessonId: 'g10-l5',
    type: 'single',
    difficulty: 'advanced',
    objective: 'Suy luận vị trí từ đặc điểm cấu hình electron.',
    content: 'Nguyên tử X có tổng số electron ở các phân lớp p là 7. Vị trí của X trong bảng tuần hoàn là',
    options: [
      { id: 'a', text: 'chu kì 2, nhóm VIIA', feedback: 'F (1s²2s²2p⁵) chỉ có 5 electron p.' },
      { id: 'b', text: 'chu kì 3, nhóm IIIA' },
      { id: 'c', text: 'chu kì 3, nhóm VIIA', feedback: 'Cl có 2p⁶ và 3p⁵: 11 electron p.' },
      { id: 'd', text: 'chu kì 3, nhóm IA', feedback: 'Na không có electron 3p, chỉ có 6 electron p.' }
    ],
    correctAnswer: 'b',
    explanation: 'Electron p: 2p⁶ (6) + 3p¹ (1) = 7 ⇒ 1s² 2s² 2p⁶ 3s² 3p¹ (Al): chu kì 3, nhóm IIIA.'
  },

  /* ----- Bài 6. Xu hướng biến đổi tính chất của nguyên tử ----- */
  {
    id: 'g10-l6-q1',
    lessonId: 'g10-l6',
    type: 'single',
    difficulty: 'recognize',
    objective: 'Nêu xu hướng biến đổi độ âm điện trong nhóm A.',
    content: 'Trong một nhóm A, theo chiều từ trên xuống dưới, độ âm điện của các nguyên tố nhìn chung',
    options: [
      { id: 'a', text: 'tăng dần', feedback: 'Độ âm điện tăng theo chiều từ trái sang phải trong chu kì, không phải từ trên xuống trong nhóm.' },
      { id: 'b', text: 'giảm dần' },
      { id: 'c', text: 'không đổi' },
      { id: 'd', text: 'tăng rồi giảm' }
    ],
    correctAnswer: 'b',
    explanation: 'Số lớp electron tăng, bán kính tăng nên khả năng hút electron giảm: F 3,98 > Cl 3,16 > Br 2,96 > I 2,66.'
  },
  {
    id: 'g10-l6-q2',
    lessonId: 'g10-l6',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'Nhận xét xu hướng biến đổi tính chất trong chu kì 3.',
    content: 'Đi từ Na đến Cl trong chu kì 3, chọn tất cả phát biểu đúng.',
    options: [
      { id: 'a', text: 'Bán kính nguyên tử giảm dần.' },
      { id: 'b', text: 'Tính kim loại tăng dần.', feedback: 'Tính kim loại giảm dần trong chu kì.' },
      { id: 'c', text: 'Độ âm điện tăng dần.' },
      { id: 'd', text: 'Tính phi kim tăng dần.' }
    ],
    correctAnswer: ['a', 'c', 'd'],
    explanation: 'Cùng 3 lớp electron, điện tích hạt nhân tăng nên bán kính giảm, độ âm điện và tính phi kim tăng.'
  },
  {
    id: 'g10-l6-q3',
    lessonId: 'g10-l6',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'So sánh tính chất các nguyên tố dựa vào vị trí.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Nguyên tử K có bán kính lớn hơn nguyên tử Na.', explanation: 'K ở dưới Na trong nhóm IA, nhiều hơn một lớp electron.' },
      { id: 'b', text: 'Fluorine có độ âm điện lớn nhất trong các nguyên tố.', explanation: 'χ(F) = 3,98, lớn nhất theo thang Pauling.' },
      { id: 'c', text: 'Trong một chu kì, nguyên tố nhóm IA có tính kim loại yếu nhất.', explanation: 'Nhóm IA đứng đầu chu kì nên có tính kim loại mạnh nhất.' },
      { id: 'd', text: 'Mg có tính kim loại mạnh hơn Ca.', explanation: 'Ca ở dưới Mg trong nhóm IIA nên tính kim loại mạnh hơn.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: false },
    explanation: 'Tính kim loại giảm trong chu kì, tăng trong nhóm A.'
  },
  {
    id: 'g10-l6-q4',
    lessonId: 'g10-l6',
    type: 'short',
    difficulty: 'apply',
    objective: 'Xác định nguyên tố có tính kim loại mạnh nhất trong một nhóm.',
    content: 'Trong các nguyên tố nhóm IA: Li, Na, K, Rb — nguyên tố nào có tính kim loại mạnh nhất? (ghi kí hiệu hóa học)',
    correctAnswer: { accepted: ['Rb'], caseSensitive: true, compact: true },
    explanation: 'Rb ở chu kì 5, có nhiều lớp electron nhất trong bốn nguyên tố nên dễ nhường electron nhất.'
  },
  {
    id: 'g10-l6-q5',
    lessonId: 'g10-l6',
    type: 'numeric',
    difficulty: 'understand',
    objective: 'Đọc và so sánh giá trị độ âm điện.',
    content: 'Độ âm điện của Cl là 3,16 và của Na là 0,93. Hiệu độ âm điện giữa hai nguyên tố này là bao nhiêu?',
    correctAnswer: { value: 2.23, tolerance: 0.005 },
    verify: () => 3.16 - 0.93,
    solution: ['Δχ = χ(Cl) − χ(Na).', 'Δχ = 3,16 − 0,93 = 2,23.'],
    explanation: 'Hiệu độ âm điện lớn như vậy sẽ được dùng ở chương 3 để giải thích vì sao NaCl là hợp chất ion.'
  },
  {
    id: 'g10-l6-q6',
    lessonId: 'g10-l6',
    type: 'single',
    difficulty: 'understand',
    objective: 'Sắp xếp bán kính nguyên tử trong một nhóm.',
    content: 'Dãy nào sắp xếp theo chiều bán kính nguyên tử tăng dần?',
    options: [
      { id: 'a', text: 'I, Br, Cl, F', feedback: 'Đây là chiều giảm dần.' },
      { id: 'b', text: 'F, Cl, Br, I' },
      { id: 'c', text: 'Cl, F, I, Br' },
      { id: 'd', text: 'Br, I, F, Cl' }
    ],
    correctAnswer: 'b',
    explanation: 'Các halogen cùng nhóm VIIA; từ F đến I số lớp electron tăng nên bán kính tăng.'
  },
  {
    id: 'g10-l6-q7',
    lessonId: 'g10-l6',
    type: 'single',
    difficulty: 'advanced',
    objective: 'Giải thích xu hướng biến đổi bán kính nguyên tử trong chu kì.',
    content: 'Nguyên nhân chính làm bán kính nguyên tử giảm từ trái sang phải trong một chu kì là',
    options: [
      { id: 'a', text: 'số lớp electron giảm dần', feedback: 'Trong một chu kì số lớp electron không đổi.' },
      { id: 'b', text: 'điện tích hạt nhân tăng trong khi số lớp electron không đổi' },
      { id: 'c', text: 'số neutron tăng dần', feedback: 'Neutron không mang điện, không ảnh hưởng trực tiếp tới lực hút electron.' },
      { id: 'd', text: 'độ âm điện giảm dần', feedback: 'Độ âm điện tăng trong chu kì, và nó là hệ quả chứ không phải nguyên nhân.' }
    ],
    correctAnswer: 'b',
    explanation: 'Hạt nhân có điện tích lớn hơn hút các electron lớp ngoài cùng (cùng một lớp) mạnh hơn, kéo chúng lại gần.'
  },

  /* ----- Bài 7. Oxide và hydroxide trong chu kì ----- */
  {
    id: 'g10-l7-q1',
    lessonId: 'g10-l7',
    type: 'single',
    difficulty: 'recognize',
    objective: 'Viết công thức oxide cao nhất từ số nhóm.',
    content: 'Phosphorus thuộc nhóm VA. Oxide cao nhất của phosphorus có công thức là',
    options: [
      { id: 'a', text: 'P₂O₃', feedback: 'P₂O₃ ứng với hóa trị III, không phải hóa trị cao nhất.' },
      { id: 'b', text: 'P₂O₅' },
      { id: 'c', text: 'PO₂' },
      { id: 'd', text: 'P₂O₇' }
    ],
    correctAnswer: 'b',
    explanation: 'Hóa trị cao nhất với oxygen = số nhóm = V ⇒ P₂O₅.'
  },
  {
    id: 'g10-l7-q2',
    lessonId: 'g10-l7',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Nhận xét tính acid – base của oxide và hydroxide chu kì 3.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Al(OH)₃ là hydroxide lưỡng tính.', explanation: 'Tác dụng được với cả acid và base mạnh.' },
      { id: 'b', text: 'NaOH là base yếu.', explanation: 'NaOH là base mạnh (kiềm).' },
      { id: 'c', text: 'H₂SO₄ có tính acid mạnh hơn H₃PO₄.', explanation: 'S đứng sau P trong chu kì 3, tính phi kim mạnh hơn.' },
      { id: 'd', text: 'Cl₂O₇ là oxide base.', explanation: 'Cl₂O₇ là oxide acid, hydroxide tương ứng là HClO₄.' }
    ],
    correctAnswer: { a: true, b: false, c: true, d: false },
    explanation: 'Trong chu kì, tính base giảm và tính acid tăng theo chiều tăng Z.'
  },
  {
    id: 'g10-l7-q3',
    lessonId: 'g10-l7',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'Phân loại oxide acid và oxide base.',
    content: 'Chọn tất cả oxide acid.',
    options: [
      { id: 'a', text: 'SO₃' },
      { id: 'b', text: 'Na₂O', feedback: 'Na₂O là oxide base, tác dụng với nước tạo NaOH.' },
      { id: 'c', text: 'P₂O₅' },
      { id: 'd', text: 'MgO', feedback: 'MgO là oxide base.' },
      { id: 'e', text: 'Cl₂O₇' }
    ],
    correctAnswer: ['a', 'c', 'e'],
    explanation: 'Oxide cao nhất của phi kim (S, P, Cl) là oxide acid; của kim loại mạnh (Na, Mg) là oxide base.'
  },
  {
    id: 'g10-l7-q4',
    lessonId: 'g10-l7',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Tính phần trăm khối lượng nguyên tố trong oxide.',
    content: 'Tính phần trăm khối lượng của aluminium trong Al₂O₃ (Al = 27, O = 16).',
    correctAnswer: { value: 52.94, unit: '%', tolerance: 0.05 },
    verify: () => 2 * 27 / molarMass('Al2O3') * 100,
    solution: ['M(Al₂O₃) = 2 × 27 + 3 × 16 = 102 g/mol.', '%Al = 54 / 102 × 100% ≈ 52,94%.'],
    explanation: 'Phần trăm khối lượng = khối lượng nguyên tố trong 1 mol chất / khối lượng mol chất.'
  },
  {
    id: 'g10-l7-q5',
    lessonId: 'g10-l7',
    type: 'short',
    difficulty: 'apply',
    objective: 'Viết công thức hydroxide tương ứng với oxide cao nhất.',
    content: 'Viết công thức hydroxide tương ứng với oxide cao nhất của chlorine (Cl₂O₇).',
    placeholder: 'Có thể viết chỉ số như chữ số thường, ví dụ H2SO4.',
    correctAnswer: { accepted: ['HClO4', 'HClO₄'], caseSensitive: true, compact: true },
    explanation: 'Cl₂O₇ + H₂O → 2HClO₄ (perchloric acid), acid mạnh nhất trong các hydroxide chu kì 3.',
    equations: ['Cl₂O₇ + H₂O → 2HClO₄']
  },
  {
    id: 'g10-l7-q6',
    lessonId: 'g10-l7',
    type: 'numeric',
    difficulty: 'advanced',
    objective: 'Xác định nguyên tố từ phần trăm khối lượng trong oxide cao nhất.',
    content: 'Nguyên tố R thuộc nhóm VIA. Trong oxide cao nhất, R chiếm 40% về khối lượng. Tính khối lượng mol nguyên tử của R (O = 16).',
    correctAnswer: { value: 32, unit: 'g/mol', tolerance: 0.3 },
    verify: () => (0.4 * 48) / 0.6,
    solution: [
      'Nhóm VIA ⇒ oxide cao nhất RO₃.',
      'M(R) / (M(R) + 48) = 0,40 ⇒ 0,6 M(R) = 19,2 ⇒ M(R) = 32 g/mol.',
      'R là sulfur, oxide cao nhất SO₃.'
    ],
    explanation: 'Xác định dạng công thức theo nhóm trước, rồi lập phương trình phần trăm.'
  },
  {
    id: 'g10-l7-q7',
    lessonId: 'g10-l7',
    type: 'single',
    difficulty: 'understand',
    objective: 'Chọn phản ứng minh họa tính acid của Al(OH)₃.',
    content: 'Phản ứng nào chứng tỏ Al(OH)₃ có tính acid?',
    options: [
      { id: 'a', text: 'Al(OH)₃ + 3HCl → AlCl₃ + 3H₂O', feedback: 'Tác dụng với acid thể hiện tính base.' },
      { id: 'b', text: 'Al(OH)₃ + NaOH → Na[Al(OH)₄]' },
      { id: 'c', text: '2Al(OH)₃ → Al₂O₃ + 3H₂O (nung nóng)', feedback: 'Đây là phản ứng nhiệt phân, không cho biết tính acid hay base.' },
      { id: 'd', text: 'Al(OH)₃ không phản ứng với base', feedback: 'Al(OH)₃ tan trong dung dịch kiềm mạnh.' }
    ],
    correctAnswer: 'b',
    explanation: 'Tác dụng với base mạnh (NaOH) là biểu hiện tính acid; cùng với phản ứng với HCl, Al(OH)₃ lưỡng tính.',
    equations: ['Al(OH)₃ + 3HCl → AlCl₃ + 3H₂O', 'Al(OH)₃ + NaOH → Na[Al(OH)₄]', '2Al(OH)₃ → Al₂O₃ + 3H₂O']
  },

  /* ----- Bài 8. Định luật tuần hoàn ----- */
  {
    id: 'g10-l8-q1',
    lessonId: 'g10-l8',
    type: 'single',
    difficulty: 'recognize',
    objective: 'Phát biểu định luật tuần hoàn.',
    content: 'Theo định luật tuần hoàn, tính chất của các nguyên tố biến đổi tuần hoàn theo chiều tăng của',
    options: [
      { id: 'a', text: 'nguyên tử khối', feedback: 'Mendeleev ban đầu dùng nguyên tử khối; định luật hiện đại dùng điện tích hạt nhân.' },
      { id: 'b', text: 'điện tích hạt nhân nguyên tử' },
      { id: 'c', text: 'số neutron' },
      { id: 'd', text: 'bán kính nguyên tử' }
    ],
    correctAnswer: 'b',
    explanation: 'Cấu hình electron lớp ngoài cùng lặp lại tuần hoàn theo Z, nên tính chất biến đổi tuần hoàn theo Z.'
  },
  {
    id: 'g10-l8-q2',
    lessonId: 'g10-l8',
    type: 'short',
    difficulty: 'apply',
    objective: 'Viết công thức hợp chất với hydrogen từ số nhóm.',
    content: 'Nitrogen thuộc nhóm VA. Viết công thức hợp chất khí của nitrogen với hydrogen.',
    placeholder: 'Có thể viết chỉ số như chữ số thường, ví dụ H2O.',
    correctAnswer: { accepted: ['NH3', 'NH₃', 'H3N'], caseSensitive: true, compact: true },
    explanation: 'Hóa trị với hydrogen = 8 − 5 = 3 ⇒ NH₃ (ammonia).'
  },
  {
    id: 'g10-l8-q3',
    lessonId: 'g10-l8',
    type: 'numeric',
    difficulty: 'advanced',
    objective: 'Xác định nguyên tố từ phần trăm khối lượng trong hợp chất với hydrogen.',
    content: 'Nguyên tố R thuộc nhóm IVA. Trong hợp chất với hydrogen, hydrogen chiếm 25% về khối lượng. Tính khối lượng mol nguyên tử của R (H = 1).',
    correctAnswer: { value: 12, unit: 'g/mol', tolerance: 0.2 },
    verify: () => 4 / 0.25 - 4,
    solution: [
      'Nhóm IVA ⇒ hợp chất với hydrogen RH₄.',
      '4 / (M(R) + 4) = 0,25 ⇒ M(R) + 4 = 16 ⇒ M(R) = 12 g/mol.',
      'R là carbon, hợp chất CH₄.'
    ],
    explanation: 'Hóa trị với hydrogen của phi kim nhóm IVA là 8 − 4 = 4.'
  },
  {
    id: 'g10-l8-q4',
    lessonId: 'g10-l8',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'Vận dụng mối liên hệ vị trí – cấu tạo – tính chất.',
    content: 'Chọn Đúng hoặc Sai cho từng phát biểu.',
    statements: [
      { id: 'a', text: 'Sulfur (nhóm VIA) có hóa trị cao nhất với oxygen là VI.', explanation: 'Bằng số thứ tự nhóm: SO₃.' },
      { id: 'b', text: 'Hợp chất của chlorine với hydrogen là HCl.', explanation: 'Hóa trị với H = 8 − 7 = 1.' },
      { id: 'c', text: 'Với phi kim nhóm IVA – VIIA, tổng hóa trị cao nhất với oxygen và hóa trị với hydrogen bằng 8.', explanation: 'Ví dụ P: V + III = 8.' },
      { id: 'd', text: 'Biết số thứ tự chu kì thì suy ra được số electron lớp ngoài cùng.', explanation: 'Số thứ tự chu kì cho biết số lớp electron; số electron lớp ngoài cùng suy ra từ số nhóm A.' }
    ],
    correctAnswer: { a: true, b: true, c: true, d: false },
    explanation: 'Chu kì ↔ số lớp; nhóm A ↔ số electron lớp ngoài cùng và hóa trị cao nhất.'
  },
  {
    id: 'g10-l8-q5',
    lessonId: 'g10-l8',
    type: 'multiple',
    difficulty: 'understand',
    objective: 'Suy ra cấu tạo và tính chất từ vị trí.',
    content: 'Nguyên tố X ở chu kì 3, nhóm IIA. Chọn tất cả thông tin suy ra đúng.',
    options: [
      { id: 'a', text: 'X có 3 lớp electron.' },
      { id: 'b', text: 'X có 2 electron lớp ngoài cùng.' },
      { id: 'c', text: 'X là phi kim.', feedback: '2 electron lớp ngoài cùng, nhóm IIA: X là kim loại.' },
      { id: 'd', text: 'Oxide cao nhất của X là XO.' },
      { id: 'e', text: 'Hydroxide tương ứng là X(OH)₂.' }
    ],
    correctAnswer: ['a', 'b', 'd', 'e'],
    explanation: 'X là magnesium: 1s²2s²2p⁶3s², kim loại, oxide MgO, hydroxide Mg(OH)₂.'
  },
  {
    id: 'g10-l8-q6',
    lessonId: 'g10-l8',
    type: 'single',
    difficulty: 'apply',
    objective: 'Dự đoán tính chất của nguyên tố từ số hiệu nguyên tử.',
    content: 'Nguyên tố Y có Z = 19. Nhận định nào đúng?',
    options: [
      { id: 'a', text: 'Y là phi kim, oxide cao nhất Y₂O₇.', feedback: 'Y có 1 electron lớp ngoài cùng nên là kim loại.' },
      { id: 'b', text: 'Y là kim loại mạnh, oxide Y₂O tác dụng với nước tạo base mạnh.' },
      { id: 'c', text: 'Y là khí hiếm.', feedback: 'Khí hiếm có 8 electron lớp ngoài cùng (trừ He).' },
      { id: 'd', text: 'Y thuộc chu kì 3, nhóm IA.', feedback: 'Y có 4 lớp electron nên thuộc chu kì 4.' }
    ],
    correctAnswer: 'b',
    explanation: 'Z = 19: …3p⁶4s¹ ⇒ chu kì 4, nhóm IA (potassium), kim loại kiềm: K₂O + H₂O → 2KOH.',
    equations: ['K₂O + H₂O → 2KOH']
  },
  {
    id: 'g10-l8-q7',
    lessonId: 'g10-l8',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Suy ra số hiệu nguyên tử từ vị trí.',
    content: 'Nguyên tố X ở chu kì 2, nhóm VIIA. Số hiệu nguyên tử của X là bao nhiêu?',
    correctAnswer: { value: 9 },
    verify: () => 2 + 7,
    solution: ['Chu kì 2 ⇒ 2 lớp; nhóm VIIA ⇒ 7 electron lớp ngoài cùng: 2s² 2p⁵.', 'Cấu hình 1s² 2s² 2p⁵ ⇒ Z = 9.'],
    explanation: 'X là fluorine, phi kim có độ âm điện lớn nhất.'
  },

  /* ----- Bài 9. Ôn tập chương 2 ----- */
  {
    id: 'g10-l9-q1',
    lessonId: 'g10-l9',
    type: 'single',
    difficulty: 'apply',
    objective: 'Xác định hai nguyên tố cùng nhóm ở hai chu kì nhỏ liên tiếp.',
    content: 'X và Y thuộc cùng một nhóm A, ở hai chu kì liên tiếp 2 và 3; tổng số proton của X và Y là 24. X và Y là',
    options: [
      { id: 'a', text: 'O và S' },
      { id: 'b', text: 'N và P', feedback: 'N (7) + P (15) = 22.' },
      { id: 'c', text: 'C và Si', feedback: 'C (6) + Si (14) = 20.' },
      { id: 'd', text: 'Mg và Ca', feedback: 'Mg và Ca ở chu kì 3 và 4.' }
    ],
    correctAnswer: 'a',
    explanation: 'Giữa chu kì 2 và 3, hai nguyên tố cùng nhóm hơn kém 8 proton: Z + Z + 8 = 24 ⇒ Z = 8 (O) và 16 (S).'
  },
  {
    id: 'g10-l9-q2',
    lessonId: 'g10-l9',
    type: 'numeric',
    difficulty: 'advanced',
    objective: 'Xác định nguyên tố từ phần trăm oxygen trong oxide cao nhất.',
    content: 'Oxide cao nhất của nguyên tố R có công thức R₂O₇, trong đó oxygen chiếm 61,2% về khối lượng. Tính khối lượng mol nguyên tử của R (O = 16).',
    correctAnswer: { value: 35.5, unit: 'g/mol', tolerance: 0.3 },
    verify: () => (112 / 0.612 - 112) / 2,
    solution: [
      '%O = 112 / (2M(R) + 112) = 0,612.',
      '2M(R) + 112 ≈ 183,0 ⇒ M(R) ≈ 35,5 g/mol.',
      'R là chlorine (nhóm VIIA), oxide Cl₂O₇.'
    ],
    explanation: 'R₂O₇ cho biết R thuộc nhóm VIIA; khối lượng mol 35,5 ứng với chlorine.'
  },
  {
    id: 'g10-l9-q3',
    lessonId: 'g10-l9',
    type: 'truefalse',
    difficulty: 'understand',
    objective: 'So sánh hai nguyên tố cùng chu kì.',
    content: 'So sánh potassium (Z = 19) và calcium (Z = 20). Chọn Đúng hoặc Sai cho từng ý.',
    statements: [
      { id: 'a', text: 'K và Ca cùng thuộc chu kì 4.', explanation: 'Cả hai có 4 lớp electron.' },
      { id: 'b', text: 'K có tính kim loại mạnh hơn Ca.', explanation: 'K đứng trước Ca trong chu kì 4.' },
      { id: 'c', text: 'Bán kính nguyên tử Ca lớn hơn K.', explanation: 'Trong chu kì bán kính giảm, nên K lớn hơn Ca.' },
      { id: 'd', text: 'Ca(OH)₂ có tính base mạnh hơn KOH.', explanation: 'Tính kim loại K > Ca nên tính base KOH > Ca(OH)₂.' }
    ],
    correctAnswer: { a: true, b: true, c: false, d: false },
    explanation: 'Trong chu kì, nguyên tố đứng trước có bán kính lớn hơn và tính kim loại mạnh hơn.'
  },
  {
    id: 'g10-l9-q4',
    lessonId: 'g10-l9',
    type: 'multiple',
    difficulty: 'apply',
    objective: 'So sánh độ âm điện của các cặp nguyên tố.',
    content: 'Chọn tất cả các cặp mà nguyên tố viết trước có độ âm điện lớn hơn nguyên tố viết sau.',
    options: [
      { id: 'a', text: 'F và Cl' },
      { id: 'b', text: 'Na và Mg', feedback: 'Mg đứng sau Na trong chu kì 3 nên độ âm điện lớn hơn.' },
      { id: 'c', text: 'O và S' },
      { id: 'd', text: 'P và S', feedback: 'S đứng sau P trong chu kì 3 nên độ âm điện lớn hơn.' },
      { id: 'e', text: 'N và P' }
    ],
    correctAnswer: ['a', 'c', 'e'],
    explanation: 'Cùng nhóm, nguyên tố ở trên có độ âm điện lớn hơn (F > Cl, O > S, N > P); cùng chu kì, nguyên tố đứng sau lớn hơn.'
  },
  {
    id: 'g10-l9-q5',
    lessonId: 'g10-l9',
    type: 'short',
    difficulty: 'recognize',
    objective: 'Gọi tên nguyên tố từ vị trí.',
    content: 'Nguyên tố ở chu kì 3, nhóm IIIA tên là gì?',
    correctAnswer: { accepted: ['aluminium', 'aluminum', 'nhôm', 'Al'] },
    explanation: 'Chu kì 3, nhóm IIIA: 1s²2s²2p⁶3s²3p¹ (Z = 13) là aluminium.'
  },
  {
    id: 'g10-l9-q6',
    lessonId: 'g10-l9',
    type: 'single',
    difficulty: 'understand',
    objective: 'So sánh tính base của các hydroxide.',
    content: 'Dãy nào sắp xếp theo chiều tính base giảm dần?',
    options: [
      { id: 'a', text: 'KOH, NaOH, Mg(OH)₂' },
      { id: 'b', text: 'Mg(OH)₂, NaOH, KOH', feedback: 'Đây là chiều tính base tăng dần.' },
      { id: 'c', text: 'NaOH, KOH, Mg(OH)₂', feedback: 'K ở dưới Na trong nhóm IA nên KOH mạnh hơn NaOH.' },
      { id: 'd', text: 'NaOH, Mg(OH)₂, KOH' }
    ],
    correctAnswer: 'a',
    explanation: 'Tính kim loại K > Na (cùng nhóm) và Na > Mg (cùng chu kì) ⇒ tính base KOH > NaOH > Mg(OH)₂.'
  },
  {
    id: 'g10-l9-q7',
    lessonId: 'g10-l9',
    type: 'numeric',
    difficulty: 'apply',
    objective: 'Suy ra số electron lớp ngoài cùng từ cấu hình electron.',
    content: 'Nguyên tố bromine có Z = 35, cấu hình electron [Ar] 3d¹⁰ 4s² 4p⁵. Nguyên tử bromine có bao nhiêu electron lớp ngoài cùng?',
    correctAnswer: { value: 7 },
    verify: () => 2 + 5,
    solution: ['Lớp ngoài cùng là lớp 4: 4s² 4p⁵.', 'Số electron lớp ngoài cùng = 2 + 5 = 7 ⇒ nhóm VIIA.'],
    explanation: 'Phân lớp 3d¹⁰ thuộc lớp 3, không tính vào lớp ngoài cùng.'
  }
]
