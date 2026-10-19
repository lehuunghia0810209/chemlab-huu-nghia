// Hóa học 12 · Chương 6 · Bài 23 — Ôn tập chương 6 (Đại cương về kim loại).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l23',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa cấu tạo, tính chất, phương pháp tách kim loại, hợp kim và sự ăn mòn kim loại.',
    'Vận dụng để giải bài tập kim loại tác dụng với acid, dung dịch muối và bài toán sản xuất kim loại.'
  ],
  prerequisites: ['Bài 18 – 22 của chương 6.'],
  sources: [
    programme('Đại cương về kim loại'),
    textbook(12, 23)
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
          text: 'Cho hỗn hợp bột Mg và Cu vào dung dịch HCl dư, chỉ một kim loại tan. Làm thế nào từ thể tích khí thu được, em tìm được thành phần hỗn hợp?'
        },
        {
          type: 'list',
          items: [
            'Hệ thống kiến thức chương 6.',
            'Giải bài toán hỗn hợp kim loại với acid.',
            'Giải bài toán kim loại tác dụng với dung dịch muối.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 6',
      blocks: [
        {
          type: 'table',
          caption: 'Tóm tắt chương',
          head: ['Nội dung', 'Ý chính'],
          rows: [
            ['Cấu tạo', 'Ít electron lớp ngoài cùng; liên kết kim loại nhờ electron tự do'],
            ['Tính chất vật lí chung', 'Dẻo, dẫn điện, dẫn nhiệt, ánh kim'],
            ['Tính chất hóa học', 'Tính khử: với phi kim, nước, acid, dung dịch muối'],
            ['Tách kim loại', 'Nhiệt luyện, thủy luyện, điện phân'],
            ['Hợp kim', 'Cứng hơn, dẫn điện kém hơn kim loại thành phần'],
            ['Ăn mòn', 'Hóa học, điện hóa; chống bằng bảo vệ bề mặt hoặc điện hóa']
          ]
        }
      ]
    },
    {
      id: 'example-mixture',
      kind: 'example',
      title: 'Ví dụ 1 — Hỗn hợp kim loại với acid',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho 10 g hỗn hợp Mg và Cu vào dung dịch HCl dư, thu được 4,958 L H₂ (điều kiện chuẩn, 24,79 L/mol). Tính khối lượng Cu trong hỗn hợp (Mg = 24).',
          steps: [
            'Chỉ Mg phản ứng: Mg + 2HCl → MgCl₂ + H₂.',
            'n(H₂) = 4,958 / 24,79 = 0,2 mol = n(Mg) ⇒ m(Mg) = 4,8 g.',
            'm(Cu) = 10 − 4,8 = 5,2 g.'
          ],
          answer: 'Hỗn hợp chứa 5,2 g Cu.',
          equations: ['Mg + 2HCl → MgCl₂ + H₂']
        }
      ]
    },
    {
      id: 'example-salt',
      kind: 'example',
      title: 'Ví dụ 2 — Kim loại tác dụng với dung dịch muối',
      blocks: [
        {
          type: 'worked',
          problem: 'Nhúng thanh Zn vào dung dịch CuSO₄, sau một thời gian lấy ra thấy khối lượng thanh giảm 0,1 g. Tính khối lượng Cu bám vào thanh (Zn = 65, Cu = 64).',
          steps: [
            'Zn + CuSO₄ → ZnSO₄ + Cu: cứ 1 mol Zn tan (65 g), 1 mol Cu bám vào (64 g) ⇒ khối lượng giảm 1 g.',
            'n(Cu) = 0,1 / 1 = 0,1 mol.',
            'm(Cu) = 0,1 × 64 = 6,4 g.'
          ],
          answer: 'Có 6,4 g Cu bám vào thanh Zn.',
          equations: ['Zn + CuSO₄ → ZnSO₄ + Cu']
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
          id: 'g12-l23-c1',
          question: 'Phương pháp thích hợp để điều chế Cu từ dung dịch CuSO₄ trong phòng thí nghiệm là',
          options: [
            { id: 'a', text: 'dùng Fe khử Cu²⁺' },
            { id: 'b', text: 'dùng Na khử Cu²⁺' },
            { id: 'c', text: 'điện phân nóng chảy CuSO₄' },
            { id: 'd', text: 'nhiệt phân CuSO₄' }
          ],
          correct: 'a',
          explanation: 'Thủy luyện: Fe + CuSO₄ → FeSO₄ + Cu. Na phản ứng với nước trước.'
        },
        {
          type: 'quiz',
          id: 'g12-l23-c2',
          question: 'Tôn (sắt mạ kẽm) bị xước sâu, kim loại bị ăn mòn trước là',
          options: [
            { id: 'a', text: 'Fe' },
            { id: 'b', text: 'Zn' },
            { id: 'c', text: 'cả hai cùng lúc' },
            { id: 'd', text: 'không kim loại nào' }
          ],
          correct: 'b',
          explanation: 'Zn có tính khử mạnh hơn Fe.'
        },
        {
          type: 'quiz',
          id: 'g12-l23-c3',
          question: 'Dãy kim loại đều tác dụng với dung dịch HCl là',
          options: [
            { id: 'a', text: 'Mg, Fe, Zn' },
            { id: 'b', text: 'Cu, Fe, Zn' },
            { id: 'c', text: 'Ag, Mg, Al' },
            { id: 'd', text: 'Au, Fe, Zn' }
          ],
          correct: 'a',
          explanation: 'Các kim loại đều có E° < 0.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 6',
      blocks: [
        {
          type: 'list',
          items: [
            'Hỗn hợp kim loại + acid loãng: chỉ kim loại đứng trước H phản ứng.',
            'Kim loại + dung dịch muối: tính độ tăng/giảm khối lượng thanh kim loại theo mol.',
            'Chọn phương pháp tách kim loại theo mức hoạt động; ăn mòn điện hóa: kim loại có E° nhỏ hơn bị ăn mòn.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Thanh kim loại luôn tăng khối lượng khi đẩy kim loại khác khỏi muối.', right: 'Tùy khối lượng mol: Zn (65) đẩy Cu (64) thì thanh **giảm** khối lượng; Fe (56) đẩy Cu thì thanh **tăng**.' },
            { wrong: 'Hỗn hợp Mg – Cu + HCl: n(H₂) = tổng số mol hai kim loại.', right: 'Cu không phản ứng với HCl: **n(H₂) = n(Mg)**.' },
            { wrong: 'Kim loại có E° lớn hơn bị ăn mòn trước trong ăn mòn điện hóa.', right: 'Kim loại có **E° nhỏ hơn** (tính khử mạnh hơn) là anode, bị ăn mòn.' }
          ]
        },
        {
          type: 'p',
          text: 'Chương tiếp theo: **Nguyên tố nhóm IA và nhóm IIA**.'
        }
      ]
    }
  ]
}
