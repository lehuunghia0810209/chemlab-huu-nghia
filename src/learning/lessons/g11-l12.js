// Hóa học 11 · Chương 3 · Bài 12 — Công thức phân tử hợp chất hữu cơ.
// Worked arithmetic re-checked in scripts/test-learning.mjs.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l12',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm công thức phân tử và công thức đơn giản nhất của hợp chất hữu cơ.',
    'Sử dụng được kết quả phổ khối lượng (MS) để xác định phân tử khối của hợp chất hữu cơ đơn giản.',
    'Lập được công thức phân tử hợp chất hữu cơ từ dữ liệu phân tích nguyên tố và phân tử khối.'
  ],
  prerequisites: [
    'Hóa 10: tính số mol, phần trăm khối lượng nguyên tố.',
    'Bài 10: hợp chất hữu cơ cháy tạo CO₂ và H₂O.'
  ],
  sources: [
    programme('Công thức phân tử hợp chất hữu cơ'),
    textbook(11, 12)
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
          text: 'Formaldehyde (CH₂O), acetic acid (C₂H₄O₂) và glucose (C₆H₁₂O₆) có cùng tỉ lệ số nguyên tử C : H : O = 1 : 2 : 1, nhưng là ba chất hoàn toàn khác nhau. Chỉ biết thành phần phần trăm các nguyên tố thì chưa đủ — cần thêm thông tin gì để biết chính xác công thức phân tử?'
        },
        {
          type: 'list',
          items: [
            'Phân biệt công thức đơn giản nhất và công thức phân tử.',
            'Đọc phân tử khối từ phổ khối lượng (MS).',
            'Lập công thức phân tử từ phần trăm khối lượng hoặc từ kết quả đốt cháy.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['n = m / M; M(CO₂) = 44; M(H₂O) = 18 g/mol.', 'Đốt hợp chất hữu cơ: C → CO₂, H → H₂O.'] }
      ]
    },
    {
      id: 'concepts',
      kind: 'concept',
      title: 'Công thức phân tử và công thức đơn giản nhất',
      blocks: [
        {
          type: 'list',
          items: [
            '**Công thức phân tử** cho biết số nguyên tử của mỗi nguyên tố trong phân tử, ví dụ C₂H₄O₂.',
            '**Công thức đơn giản nhất** (công thức thực nghiệm) cho biết tỉ lệ tối giản số nguyên tử các nguyên tố, ví dụ CH₂O.',
            'Công thức phân tử = (công thức đơn giản nhất)ₙ, với n là số nguyên dương.'
          ]
        },
        {
          type: 'table',
          caption: 'Cùng công thức đơn giản nhất CH₂O',
          head: ['Chất', 'Công thức phân tử', 'n', 'Phân tử khối'],
          rows: [
            ['Formaldehyde', 'CH₂O', '1', '30'],
            ['Acetic acid', 'C₂H₄O₂', '2', '60'],
            ['Glucose', 'C₆H₁₂O₆', '6', '180']
          ]
        }
      ]
    },
    {
      id: 'ms',
      kind: 'concept',
      title: 'Phổ khối lượng (MS)',
      blocks: [
        {
          type: 'p',
          text: 'Trong máy khối phổ, phân tử bị bắn phá tạo thành ion mang điện, được tách ra theo tỉ số khối lượng / điện tích (m/z). Với hợp chất hữu cơ đơn giản, **tín hiệu có m/z lớn nhất** (ion phân tử, thường có điện tích +1) cho biết **phân tử khối** của chất.'
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Ví dụ',
          text: 'Phổ MS của ethanol có tín hiệu m/z lớn nhất bằng 46 ⇒ M = 46, phù hợp với C₂H₆O. Các tín hiệu nhỏ hơn là các mảnh vỡ của phân tử.'
        }
      ]
    },
    {
      id: 'method',
      kind: 'concept',
      title: 'Cách lập công thức phân tử',
      blocks: [
        {
          type: 'list',
          ordered: true,
          items: [
            'Từ phần trăm khối lượng (hoặc khối lượng) các nguyên tố, tính tỉ lệ số mol: x : y : z = %C/12 : %H/1 : %O/16.',
            'Đưa về tỉ lệ số nguyên tối giản ⇒ công thức đơn giản nhất.',
            'Dùng phân tử khối (từ MS) để tìm n ⇒ công thức phân tử.'
          ]
        },
        {
          type: 'equation',
          text: 'Công thức phân tử CₓHᵧO_z:   x = M·%C/(12·100);   y = M·%H/(1·100);   z = M·%O/(16·100)',
          note: 'Có thể tính trực tiếp nếu đã biết phân tử khối M.',
          check: false
        }
      ]
    },
    {
      id: 'example-percent',
      kind: 'example',
      title: 'Ví dụ 1 — Từ phần trăm khối lượng',
      blocks: [
        {
          type: 'worked',
          problem: 'Chất X chứa 40,00% C; 6,67% H; còn lại là O (về khối lượng). Phổ MS của X có tín hiệu m/z lớn nhất bằng 60. Lập công thức phân tử của X.',
          steps: [
            '%O = 100 − 40,00 − 6,67 = 53,33%.',
            'x : y : z = 40,00/12 : 6,67/1 : 53,33/16 = 3,333 : 6,67 : 3,333 = 1 : 2 : 1 ⇒ công thức đơn giản nhất CH₂O (M = 30).',
            'M = 60 ⇒ n = 60 / 30 = 2 ⇒ công thức phân tử C₂H₄O₂.'
          ],
          answer: 'X là C₂H₄O₂ (có thể là acetic acid CH₃COOH).'
        }
      ]
    },
    {
      id: 'example-combustion',
      kind: 'example',
      title: 'Ví dụ 2 — Từ kết quả đốt cháy',
      blocks: [
        {
          type: 'worked',
          problem: 'Đốt cháy hoàn toàn 4,4 g chất hữu cơ Y (chứa C, H, O) thu được 8,8 g CO₂ và 3,6 g H₂O. Phổ MS của Y có tín hiệu m/z lớn nhất bằng 44. Lập công thức phân tử của Y.',
          steps: [
            'n(C) = n(CO₂) = 8,8 / 44 = 0,2 mol ⇒ m(C) = 2,4 g.',
            'n(H) = 2n(H₂O) = 2 × 3,6 / 18 = 0,4 mol ⇒ m(H) = 0,4 g.',
            'm(O) = 4,4 − 2,4 − 0,4 = 1,6 g ⇒ n(O) = 0,1 mol.',
            'C : H : O = 0,2 : 0,4 : 0,1 = 2 : 4 : 1 ⇒ công thức đơn giản nhất C₂H₄O (M = 44).',
            'M = 44 ⇒ n = 1 ⇒ công thức phân tử C₂H₄O.'
          ],
          answer: 'Y là C₂H₄O (có thể là acetaldehyde CH₃CHO).'
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Lưu ý',
          text: 'Mỗi phân tử H₂O chứa **2 nguyên tử H**: n(H) = 2n(H₂O). Khối lượng O tính bằng hiệu số, không lấy từ CO₂ và H₂O vì một phần oxygen đến từ O₂ đốt cháy.'
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
          id: 'g11-l12-c1',
          question: 'Glucose có công thức phân tử C₆H₁₂O₆. Công thức đơn giản nhất của glucose là',
          options: [
            { id: 'a', text: 'C₆H₁₂O₆' },
            { id: 'b', text: 'CH₂O' },
            { id: 'c', text: 'C₃H₆O₃' },
            { id: 'd', text: 'CHO' }
          ],
          correct: 'b',
          explanation: 'Chia các chỉ số cho ước chung lớn nhất 6: C₁H₂O₁.'
        },
        {
          type: 'quiz',
          id: 'g11-l12-c2',
          question: 'Trên phổ khối lượng của một hợp chất hữu cơ đơn giản, phân tử khối thường ứng với',
          options: [
            { id: 'a', text: 'tín hiệu có cường độ lớn nhất' },
            { id: 'b', text: 'tín hiệu có giá trị m/z lớn nhất' },
            { id: 'c', text: 'tín hiệu có m/z nhỏ nhất' },
            { id: 'd', text: 'tổng các giá trị m/z' }
          ],
          correct: 'b',
          explanation: 'Ion phân tử (chưa bị phân mảnh) có m/z lớn nhất; tín hiệu mạnh nhất có thể là một mảnh vỡ.'
        },
        {
          type: 'quiz',
          id: 'g11-l12-c3',
          question: 'Đốt cháy hợp chất hữu cơ thu được 0,3 mol H₂O. Số mol nguyên tử H trong mẫu là',
          options: [
            { id: 'a', text: '0,15' },
            { id: 'b', text: '0,3' },
            { id: 'c', text: '0,6' },
            { id: 'd', text: '0,9' }
          ],
          correct: 'c',
          explanation: 'n(H) = 2n(H₂O) = 0,6 mol.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết',
      blocks: [
        {
          type: 'list',
          items: [
            'Công thức phân tử = (công thức đơn giản nhất)ₙ.',
            'Phân tử khối: tín hiệu m/z lớn nhất trên phổ MS (hợp chất đơn giản).',
            'Tỉ lệ nguyên tử: %C/12 : %H/1 : %O/16; khi đốt cháy: n(C) = n(CO₂), n(H) = 2n(H₂O), m(O) tính bằng hiệu.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'n(H) = n(H₂O).', right: 'Mỗi H₂O có 2 nguyên tử H: **n(H) = 2n(H₂O)**.' },
            { wrong: 'Tính oxygen trong chất từ tổng oxygen trong CO₂ và H₂O.', right: 'Oxygen còn đến từ O₂ đốt cháy; tính **m(O) = m(chất) − m(C) − m(H)**.' },
            { wrong: 'Tín hiệu cao nhất trên phổ MS là phân tử khối.', right: 'Phân tử khối là tín hiệu có **m/z lớn nhất**, không nhất thiết cao nhất.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Cấu tạo hóa học hợp chất hữu cơ**.'
        }
      ]
    }
  ]
}
