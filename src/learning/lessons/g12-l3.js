// Hóa học 12 · Chương 1 · Bài 3 — Ôn tập chương 1 (Ester – Lipid).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l3',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa kiến thức về ester, chất béo, xà phòng và chất giặt rửa.',
    'Vận dụng để giải bài tập thủy phân ester, xà phòng hóa chất béo.'
  ],
  prerequisites: ['Bài 1 – 2 của chương 1.'],
  sources: [
    programme('Ester – Lipid'),
    textbook(12, 3)
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
          text: 'Biết khối lượng NaOH đã dùng để xà phòng hóa, em có thể suy ra phân tử khối của ester. Làm thế nào để khai thác tỉ lệ mol trong các bài toán thủy phân?'
        },
        {
          type: 'list',
          items: [
            'Hệ thống kiến thức chương 1.',
            'Xác định công thức ester từ dữ kiện thủy phân.',
            'Giải bài toán xà phòng hóa chất béo bằng bảo toàn khối lượng.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 1',
      blocks: [
        {
          type: 'table',
          caption: 'Tóm tắt chương',
          head: ['Nội dung', 'Ester', 'Chất béo', 'Xà phòng / chất giặt rửa'],
          rows: [
            ['Cấu tạo', 'RCOOR′', 'Triester của glycerol và acid béo', 'Đầu ưa nước + đuôi kị nước'],
            ['Phản ứng chính', 'Thủy phân (acid: thuận nghịch; base: một chiều)', 'Xà phòng hóa; hydrogen hóa; oxi hóa (ôi)', 'Hoạt động bề mặt'],
            ['Tỉ lệ với NaOH', '1 : 1 (ester đơn chức của alcohol)', '1 : 3, tạo 1 glycerol', '—']
          ]
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Bảo toàn khối lượng khi xà phòng hóa chất béo',
          text: 'm(chất béo) + m(NaOH) = m(muối) + m(glycerol), với n(NaOH) = 3n(chất béo) = 3n(glycerol).'
        }
      ]
    },
    {
      id: 'example-formula',
      kind: 'example',
      title: 'Ví dụ 1 — Xác định công thức ester',
      blocks: [
        {
          type: 'worked',
          problem: 'Ester X no, đơn chức, mạch hở. Xà phòng hóa hoàn toàn 7,4 g X cần vừa đủ 100 mL dung dịch NaOH 1 M, thu được muối sodium acetate. Xác định công thức và tên của X.',
          steps: [
            'n(X) = n(NaOH) = 0,1 mol ⇒ M(X) = 7,4 / 0,1 = 74.',
            'CₙH₂ₙO₂: 14n + 32 = 74 ⇒ n = 3 ⇒ C₃H₆O₂.',
            'Muối là CH₃COONa ⇒ X là CH₃COOCH₃.'
          ],
          answer: 'X là CH₃COOCH₃ (methyl acetate).',
          equations: ['CH₃COOCH₃ + NaOH → CH₃COONa + CH₃OH']
        }
      ]
    },
    {
      id: 'example-fat',
      kind: 'example',
      title: 'Ví dụ 2 — Bảo toàn khối lượng khi xà phòng hóa',
      blocks: [
        {
          type: 'worked',
          problem: 'Xà phòng hóa hoàn toàn 17,24 g một chất béo cần vừa đủ 0,06 mol NaOH. Tính khối lượng muối thu được (glycerol: M = 92; NaOH: M = 40).',
          steps: [
            'n(glycerol) = n(NaOH) / 3 = 0,02 mol ⇒ m(glycerol) = 0,02 × 92 = 1,84 g.',
            'm(NaOH) = 0,06 × 40 = 2,4 g.',
            'm(muối) = 17,24 + 2,4 − 1,84 = 17,8 g.'
          ],
          answer: 'Khối lượng muối là 17,8 g.'
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
          id: 'g12-l3-c1',
          question: 'Ester no, đơn chức, mạch hở có công thức chung là',
          options: [
            { id: 'a', text: 'CₙH₂ₙO₂ (n ≥ 2)' },
            { id: 'b', text: 'CₙH₂ₙ₊₂O (n ≥ 1)' },
            { id: 'c', text: 'CₙH₂ₙO (n ≥ 1)' },
            { id: 'd', text: 'CₙH₂ₙ₋₂O₂ (n ≥ 3)' }
          ],
          correct: 'a',
          explanation: 'Ester đơn giản nhất là HCOOCH₃ (C₂H₄O₂).'
        },
        {
          type: 'quiz',
          id: 'g12-l3-c2',
          question: 'Xà phòng hóa 1 mol chất béo cần bao nhiêu mol NaOH?',
          options: [
            { id: 'a', text: '1 mol' },
            { id: 'b', text: '2 mol' },
            { id: 'c', text: '3 mol' },
            { id: 'd', text: '4 mol' }
          ],
          correct: 'c',
          explanation: 'Chất béo là triester, có 3 nhóm ester.'
        },
        {
          type: 'quiz',
          id: 'g12-l3-c3',
          question: 'Nguyên nhân dầu ăn để lâu bị ôi là',
          options: [
            { id: 'a', text: 'gốc acid béo không no bị oxi hóa bởi oxygen không khí' },
            { id: 'b', text: 'chất béo bị hydrogen hóa' },
            { id: 'c', text: 'chất béo tan vào nước' },
            { id: 'd', text: 'glycerol bay hơi' }
          ],
          correct: 'a',
          explanation: 'Liên kết C=C bị oxi hóa thành peroxide rồi aldehyde có mùi khó chịu.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 1',
      blocks: [
        {
          type: 'list',
          items: [
            'Ester đơn chức: n(NaOH) = n(ester); M(ester) suy ra công thức CₙH₂ₙO₂.',
            'Chất béo: n(NaOH) = 3n(chất béo) = 3n(glycerol); bảo toàn khối lượng tính khối lượng muối.',
            'Xà phòng và chất giặt rửa làm sạch nhờ cấu tạo đầu ưa nước, đuôi kị nước.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Quên trừ khối lượng glycerol khi tính khối lượng muối.', right: 'm(muối) = m(chất béo) + m(NaOH) **− m(glycerol)**.' },
            { wrong: 'Xà phòng hóa chất béo: n(NaOH) = n(chất béo).', right: 'Chất béo có 3 nhóm ester: **n(NaOH) = 3n(chất béo)**.' },
            { wrong: 'Ester HCOOR′ có n ≥ 1 nguyên tử C.', right: 'Ester đơn giản nhất HCOOCH₃ có **2 C**, nên CₙH₂ₙO₂ với n ≥ 2.' }
          ]
        },
        {
          type: 'p',
          text: 'Chương tiếp theo: **Carbohydrate**.'
        }
      ]
    }
  ]
}
