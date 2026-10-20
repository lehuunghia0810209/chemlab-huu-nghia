// Written-response tasks with explicit rubrics (Practice only, never Exam).
// The server reads the rubric from this file by id; the browser never sends
// rubric text, so feedback can only follow these criteria.
// status 'internal': written and checked by ChemLab, not yet teacher-reviewed.

export const RUBRICS = Object.freeze([
  Object.freeze({
    id: 'g11-l20-w1',
    lessonId: 'g11-l20',
    status: 'internal',
    title: 'Nhiệt độ sôi của ethanol và dimethyl ether',
    prompt: 'Ethanol (C₂H₅OH) sôi ở 78 °C, còn dimethyl ether (CH₃OCH₃) sôi ở −24 °C. Hãy giải thích vì sao hai chất có cùng công thức phân tử C₂H₆O nhưng nhiệt độ sôi khác nhau nhiều như vậy.',
    criteria: Object.freeze([
      Object.freeze({ id: 'c1', text: 'Nêu hai chất có cùng phân tử khối (cùng công thức C₂H₆O), nên khác biệt không do phân tử khối.' }),
      Object.freeze({ id: 'c2', text: 'Nêu ethanol có nhóm −OH (H liên kết với O) nên tạo liên kết hydrogen giữa các phân tử.' }),
      Object.freeze({ id: 'c3', text: 'Nêu dimethyl ether không có H liên kết với O nên không tạo liên kết hydrogen giữa các phân tử.' }),
      Object.freeze({ id: 'c4', text: 'Kết luận: cần thêm năng lượng để phá liên kết hydrogen khi sôi nên ethanol sôi ở nhiệt độ cao hơn.' })
    ]),
    alternatives: Object.freeze(['Có thể diễn đạt “lực hút giữa các phân tử ethanol mạnh hơn do liên kết hydrogen”.']),
    criticalMistakes: Object.freeze([
      'Cho rằng ethanol có phân tử khối lớn hơn.',
      'Cho rằng khi sôi các liên kết cộng hóa trị O–H trong phân tử bị phá vỡ.'
    ])
  }),
  Object.freeze({
    id: 'g12-l19-w1',
    lessonId: 'g12-l19',
    status: 'internal',
    title: 'Sắt tác dụng với HCl',
    prompt: 'Cho 5,6 g Fe tác dụng hết với dung dịch HCl dư. Trình bày lời giải để tính thể tích khí H₂ thu được ở điều kiện chuẩn (24,79 L/mol; Fe = 56).',
    criteria: Object.freeze([
      Object.freeze({ id: 'c1', text: 'Viết đúng phương trình đã cân bằng: Fe + 2HCl → FeCl₂ + H₂.' }),
      Object.freeze({ id: 'c2', text: 'Tính đúng n(Fe) = 5,6 / 56 = 0,1 mol.' }),
      Object.freeze({ id: 'c3', text: 'Suy ra n(H₂) = n(Fe) = 0,1 mol theo tỉ lệ phương trình.' }),
      Object.freeze({ id: 'c4', text: 'Tính V(H₂) = 0,1 × 24,79 = 2,479 L, ghi đơn vị.' })
    ]),
    alternatives: Object.freeze(['Có thể dùng bảo toàn electron: 2n(Fe) = 2n(H₂).', 'Kết quả làm tròn 2,48 L vẫn đúng.']),
    criticalMistakes: Object.freeze([
      'Viết sản phẩm FeCl₃ (với HCl, sắt chỉ tạo FeCl₂).',
      'Dùng 22,4 L/mol (thể tích mol ở điều kiện tiêu chuẩn cũ) thay cho 24,79 L/mol ở điều kiện chuẩn.'
    ])
  }),
  Object.freeze({
    id: 'g12-l22-w1',
    lessonId: 'g12-l22',
    status: 'internal',
    title: 'Bảo vệ vỏ tàu bằng khối kẽm',
    prompt: 'Người ta gắn các khối kẽm lên phần vỏ tàu biển bằng thép ngâm trong nước biển. Giải thích vì sao cách làm này bảo vệ được vỏ tàu khỏi bị ăn mòn.',
    criteria: Object.freeze([
      Object.freeze({ id: 'c1', text: 'Nêu Zn và Fe (thép) tiếp xúc nhau trong nước biển (dung dịch chất điện li) tạo thành pin điện hóa, xảy ra ăn mòn điện hóa.' }),
      Object.freeze({ id: 'c2', text: 'Nêu Zn có tính khử mạnh hơn Fe (E° nhỏ hơn) nên Zn là anode, bị oxi hóa: Zn → Zn²⁺ + 2e.' }),
      Object.freeze({ id: 'c3', text: 'Nêu Fe đóng vai trò cathode nên không bị oxi hóa, vỏ tàu được bảo vệ.' }),
      Object.freeze({ id: 'c4', text: 'Nêu kẽm bị ăn mòn dần (“vật hi sinh”) nên phải thay định kì.' })
    ]),
    alternatives: Object.freeze(['Có thể gọi tên “phương pháp điện hóa” hoặc “bảo vệ bằng anode hi sinh”.']),
    criticalMistakes: Object.freeze([
      'Cho rằng kẽm tạo lớp phủ ngăn nước tiếp xúc với thép (đó là phương pháp bảo vệ bề mặt, không phải cơ chế ở đây).',
      'Cho rằng sắt bị ăn mòn trước kẽm.'
    ])
  })
])

export const ANSWER_LIMITS = Object.freeze({ min: 30, max: 1500 })

export function findRubric(id) {
  return RUBRICS.find(rubric => rubric.id === id) || null
}
