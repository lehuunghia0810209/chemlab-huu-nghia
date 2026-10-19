// Hóa học 12 · Chương 7 · Bài 26 — Ôn tập chương 7 (Nguyên tố nhóm IA và nhóm IIA).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l26',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa tính chất của kim loại nhóm IA, IIA và hợp chất quan trọng của chúng; nước cứng.',
    'Vận dụng để nhận biết, giải bài tập kim loại kiềm, kiềm thổ tác dụng với nước và bài toán CO₂ tác dụng với dung dịch kiềm.'
  ],
  prerequisites: ['Bài 24 – 25 của chương 7.'],
  sources: [
    programme('Nguyên tố nhóm IA và nhóm IIA'),
    textbook(12, 26)
  ],
  verification: VERIFICATION,
  steps: [
    {
      id: 'objectives',
      kind: 'objectives',
      title: 'Bài này giúp em',
      blocks: [
        {
          type: 'callout',
          tone: 'question',
          title: 'Câu hỏi mở đầu',
          text: 'Thổi hơi thở vào nước vôi trong, lúc đầu vẩn đục rồi lại trong dần. Vì sao lại có hiện tượng hai giai đoạn như vậy?'
        },
        {
          type: 'list',
          items: [
            'So sánh nhóm IA và nhóm IIA.',
            'Nhận biết hợp chất bằng màu ngọn lửa và phản ứng tạo kết tủa.',
            'Giải bài toán CO₂ tác dụng với dung dịch Ca(OH)₂.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 7',
      blocks: [
        {
          type: 'table',
          caption: 'So sánh nhóm IA và nhóm IIA',
          head: ['', 'Nhóm IA', 'Nhóm IIA'],
          rows: [
            ['Electron lớp ngoài cùng', 'ns¹', 'ns²'],
            ['Số oxi hóa trong hợp chất', '+1', '+2'],
            ['Với nước ở nhiệt độ thường', 'Tất cả phản ứng mạnh', 'Ca, Sr, Ba phản ứng; Mg chậm với nước nóng; Be không'],
            ['Màu ngọn lửa', 'Li đỏ tía, Na vàng, K tím nhạt', 'Ca đỏ cam, Sr đỏ son, Ba lục'],
            ['Hợp chất tiêu biểu', 'NaCl, NaOH, NaHCO₃, Na₂CO₃', 'CaCO₃, CaO, Ca(OH)₂, CaSO₄, BaSO₄']
          ]
        },
        { type: 'heading', text: 'CO₂ tác dụng với nước vôi trong' },
        { type: 'equation', text: 'CO₂ + Ca(OH)₂ → CaCO₃ + H₂O', note: 'Giai đoạn 1: vẩn đục.' },
        { type: 'equation', text: 'CaCO₃ + CO₂ + H₂O → Ca(HCO₃)₂', note: 'Giai đoạn 2 (CO₂ dư): kết tủa tan dần.' }
      ]
    },
    {
      id: 'example-water',
      kind: 'example',
      title: 'Ví dụ 1 — Kim loại tác dụng với nước',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho 4 g Ca vào nước dư. Tính thể tích H₂ (điều kiện chuẩn, 24,79 L/mol) và khối lượng Ca(OH)₂ tạo thành (Ca = 40, O = 16, H = 1).',
          steps: [
            'n(Ca) = 4 / 40 = 0,1 mol.',
            'Ca + 2H₂O → Ca(OH)₂ + H₂ ⇒ n(H₂) = n(Ca(OH)₂) = 0,1 mol.',
            'V(H₂) = 2,479 L; m(Ca(OH)₂) = 0,1 × 74 = 7,4 g.'
          ],
          answer: '2,479 L H₂ và 7,4 g Ca(OH)₂.',
          equations: ['Ca + 2H₂O → Ca(OH)₂ + H₂']
        }
      ]
    },
    {
      id: 'example-co2',
      kind: 'example',
      title: 'Ví dụ 2 — CO₂ tác dụng với dung dịch Ca(OH)₂',
      blocks: [
        {
          type: 'worked',
          problem: 'Dẫn 0,15 mol CO₂ vào dung dịch chứa 0,1 mol Ca(OH)₂. Tính khối lượng kết tủa thu được.',
          steps: [
            'Giai đoạn 1: 0,1 mol Ca(OH)₂ phản ứng với 0,1 mol CO₂ tạo 0,1 mol CaCO₃; còn dư 0,05 mol CO₂.',
            'Giai đoạn 2: 0,05 mol CO₂ hòa tan 0,05 mol CaCO₃ ⇒ còn 0,05 mol CaCO₃.',
            'm(CaCO₃) = 0,05 × 100 = 5 g.'
          ],
          answer: 'Thu được 5 g kết tủa.'
        }
      ]
    },
    {
      id: 'check',
      kind: 'check',
      title: 'Kiểm tra nhanh',
      blocks: [
        {
          type: 'quiz',
          id: 'g12-l26-c1',
          question: 'Kim loại nào không tác dụng với nước ở nhiệt độ thường?',
          options: [
            { id: 'a', text: 'Na' },
            { id: 'b', text: 'K' },
            { id: 'c', text: 'Ca' },
            { id: 'd', text: 'Be' }
          ],
          correct: 'd',
          explanation: 'Be không tác dụng với nước.'
        },
        {
          type: 'quiz',
          id: 'g12-l26-c2',
          question: 'Chất làm mềm được cả nước cứng tạm thời và vĩnh cửu là',
          options: [
            { id: 'a', text: 'Na₂CO₃' },
            { id: 'b', text: 'NaCl' },
            { id: 'c', text: 'HCl' },
            { id: 'd', text: 'Ca(OH)₂' }
          ],
          correct: 'a',
          explanation: 'CO₃²⁻ kết tủa cả Ca²⁺ và Mg²⁺.'
        },
        {
          type: 'quiz',
          id: 'g12-l26-c3',
          question: 'Đốt hợp chất của kali, ngọn lửa có màu',
          options: [
            { id: 'a', text: 'vàng' },
            { id: 'b', text: 'tím nhạt' },
            { id: 'c', text: 'đỏ cam' },
            { id: 'd', text: 'lục' }
          ],
          correct: 'b',
          explanation: 'K cho màu tím nhạt.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 7',
      blocks: [
        {
          type: 'list',
          items: [
            'IA: ns¹, +1; IIA: ns², +2; tính khử mạnh, tăng dần trong nhóm.',
            'CO₂ + Ca(OH)₂: n(CO₂) ≤ n(Ca(OH)₂) chỉ tạo CaCO₃; CO₂ dư hòa tan dần CaCO₃ tạo Ca(HCO₃)₂.',
            'Nước cứng: Ca²⁺, Mg²⁺; làm mềm bằng đun sôi (tạm thời), Na₂CO₃, Na₃PO₄, trao đổi ion.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'CO₂ dư luôn cho nhiều kết tủa hơn.', right: 'CO₂ dư **hòa tan** kết tủa CaCO₃ thành Ca(HCO₃)₂.' },
            { wrong: 'Mọi kim loại nhóm IIA đều phản ứng với nước ở nhiệt độ thường.', right: '**Be** không phản ứng; Mg phản ứng chậm với nước nóng.' },
            { wrong: 'Tính n(kết tủa) = n(CO₂) trong mọi trường hợp.', right: 'Khi CO₂ dư so với Ca(OH)₂: **n(CaCO₃) = 2n(Ca(OH)₂) − n(CO₂)** (nếu còn kết tủa).' }
          ]
        },
        {
          type: 'p',
          text: 'Chương tiếp theo: **Kim loại chuyển tiếp dãy thứ nhất và phức chất**.'
        }
      ]
    }
  ]
}
