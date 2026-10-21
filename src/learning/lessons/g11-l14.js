// Hóa học 11 · Chương 3 · Bài 14 — Ôn tập chương 3 (Đại cương về hóa học hữu cơ).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l14',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa khái niệm hợp chất hữu cơ, nhóm chức, phương pháp tách biệt và tinh chế, công thức phân tử, cấu tạo hóa học.',
    'Vận dụng lập công thức phân tử, viết đồng phân và đọc phổ IR, MS đơn giản.'
  ],
  prerequisites: ['Bài 10 – 13 của chương 3.'],
  sources: [
    programme('Đại cương về hóa học hữu cơ'),
    textbook(11, 14)
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
          text: 'Một nhà hóa học nhận được mẫu chất lạ. Họ đốt một ít để biết thành phần nguyên tố, chụp phổ MS để biết phân tử khối, chụp phổ IR để biết nhóm chức — và từ đó vẽ ra công thức cấu tạo. Em có thể đi hết các bước ấy không?'
        },
        {
          type: 'list',
          items: [
            'Hệ thống hóa kiến thức chương 3.',
            'Giải bài tập tổng hợp: đốt cháy → công thức phân tử → nhóm chức → công thức cấu tạo.',
            'Luyện viết đồng phân.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 3',
      blocks: [
        {
          type: 'table',
          caption: 'Đại cương về hóa học hữu cơ',
          head: ['Nội dung', 'Ghi nhớ'],
          rows: [
            ['Hợp chất hữu cơ', 'Hợp chất của C (trừ CO, CO₂, carbonate, cyanide, carbide…); liên kết cộng hóa trị'],
            ['Phân loại', 'Hydrocarbon và dẫn xuất (theo nhóm chức −OH, −CHO, −COOH, −COO−, −NH₂…)'],
            ['Tách biệt, tinh chế', 'Chưng cất (nhiệt độ sôi), chiết (độ tan trong hai dung môi), kết tinh (độ tan theo nhiệt độ), sắc kí cột (hấp phụ)'],
            ['Công thức phân tử', 'MS → M; phân tích nguyên tố → công thức đơn giản nhất → (CTĐGN)ₙ'],
            ['Phổ IR', 'O–H 3200 – 3600 (alcohol), 2500 – 3300 (acid); C=O 1650 – 1750 cm⁻¹'],
            ['Cấu tạo hóa học', 'Thứ tự liên kết; đồng đẳng (hơn kém CH₂), đồng phân (cùng CTPT)']
          ]
        }
      ]
    },
    {
      id: 'example-full',
      kind: 'example',
      title: 'Ví dụ 1 — Từ dữ liệu phân tích đến công thức cấu tạo',
      blocks: [
        {
          type: 'worked',
          problem: 'Đốt cháy hoàn toàn 3,0 g chất hữu cơ Z (C, H, O) thu được 4,4 g CO₂ và 1,8 g H₂O. Phổ MS cho m/z lớn nhất bằng 60. Phổ IR có tín hiệu mạnh ở 1710 cm⁻¹ và tín hiệu rất rộng từ 2500 đến 3300 cm⁻¹. Xác định công thức phân tử và công thức cấu tạo của Z.',
          steps: [
            'n(C) = 4,4 / 44 = 0,1 mol (1,2 g); n(H) = 2 × 1,8 / 18 = 0,2 mol (0,2 g).',
            'm(O) = 3,0 − 1,2 − 0,2 = 1,6 g ⇒ n(O) = 0,1 mol. C : H : O = 1 : 2 : 1 ⇒ CH₂O.',
            'M = 60 ⇒ (CH₂O)ₙ với 30n = 60 ⇒ n = 2 ⇒ C₂H₄O₂.',
            'IR: C=O (1710) và O–H rất rộng (2500 – 3300) ⇒ nhóm −COOH ⇒ CH₃COOH.'
          ],
          answer: 'Z là C₂H₄O₂, công thức cấu tạo CH₃COOH (acetic acid).'
        }
      ]
    },
    {
      id: 'example-isomers',
      kind: 'example',
      title: 'Ví dụ 2 — Đồng phân của C₄H₁₀O',
      blocks: [
        {
          type: 'worked',
          problem: 'Viết công thức cấu tạo thu gọn các đồng phân alcohol ứng với công thức phân tử C₄H₁₀O.',
          steps: [
            'Mạch 4 C không nhánh: nhóm OH ở C1: CH₃CH₂CH₂CH₂OH; ở C2: CH₃CH₂CH(OH)CH₃.',
            'Mạch 3 C có nhánh CH₃ ở C2: nhóm OH ở C1: (CH₃)₂CHCH₂OH; ở C2: (CH₃)₃COH.',
            'Không còn vị trí nào khác (các vị trí đối xứng cho cùng một chất).'
          ],
          answer: 'C₄H₁₀O có 4 đồng phân alcohol (ngoài ra còn 3 đồng phân ether).'
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
          id: 'g11-l14-c1',
          question: 'Phương pháp nào phù hợp để tách hai chất lỏng tan vào nhau, có nhiệt độ sôi chênh lệch nhiều?',
          options: [
            { id: 'a', text: 'Chưng cất' },
            { id: 'b', text: 'Chiết' },
            { id: 'c', text: 'Kết tinh' },
            { id: 'd', text: 'Lọc' }
          ],
          correct: 'a',
          explanation: 'Chất lỏng có nhiệt độ sôi thấp hơn bay hơi trước và được ngưng tụ riêng.'
        },
        {
          type: 'quiz',
          id: 'g11-l14-c2',
          question: 'Chất nào thuộc cùng dãy đồng đẳng với CH₄?',
          options: [
            { id: 'a', text: 'C₂H₄' },
            { id: 'b', text: 'C₃H₈' },
            { id: 'c', text: 'C₂H₅OH' },
            { id: 'd', text: 'C₆H₆' }
          ],
          correct: 'b',
          explanation: 'C₃H₈ hơn CH₄ hai nhóm CH₂, cùng dãy alkane CₙH₂ₙ₊₂.'
        },
        {
          type: 'quiz',
          id: 'g11-l14-c3',
          question: 'Một chất có công thức đơn giản nhất C₂H₅ và phân tử khối 58. Công thức phân tử của chất là',
          options: [
            { id: 'a', text: 'C₂H₅' },
            { id: 'b', text: 'C₄H₁₀' },
            { id: 'c', text: 'C₆H₁₅' },
            { id: 'd', text: 'C₃H₈' }
          ],
          correct: 'b',
          explanation: 'M(C₂H₅) = 29 ⇒ n = 58 / 29 = 2 ⇒ C₄H₁₀.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 3',
      blocks: [
        {
          type: 'list',
          items: [
            'Quy trình xác định chất: phân tích nguyên tố → công thức đơn giản nhất → MS → công thức phân tử → IR → nhóm chức → công thức cấu tạo.',
            'Chọn phương pháp tách theo tính chất khác biệt rõ nhất của các chất.',
            'Viết đồng phân: thay đổi mạch carbon, vị trí nhóm chức, loại nhóm chức; tránh viết trùng.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Kết luận ngay công thức phân tử từ công thức đơn giản nhất.', right: 'Cần thêm **phân tử khối** (MS) để tìm n.' },
            { wrong: 'C₄H₁₀O chỉ có các đồng phân alcohol.', right: 'Còn có **đồng phân ether** (loại nhóm chức khác).' },
            { wrong: 'C₂H₄ cùng dãy đồng đẳng với CH₄ vì hơn kém một nguyên tử C.', right: 'Đồng đẳng hơn kém **CH₂** và có tính chất tương tự; C₂H₄ hơn CH₄ là C chứ không phải CH₂.' }
          ]
        },
        {
          type: 'p',
          text: 'Chương tiếp theo: **Hydrocarbon** — alkane, hydrocarbon không no và arene.'
        }
      ]
    }
  ]
}
