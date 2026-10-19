// Hóa học 12 · Chương 4 · Bài 14 — Ôn tập chương 4 (Polymer).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l14',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa khái niệm, cấu trúc, tính chất, phương pháp tổng hợp polymer và các vật liệu polymer.',
    'Vận dụng để phân loại polymer, xác định monomer và tính hệ số polymer hóa.'
  ],
  prerequisites: ['Bài 12 – 13 của chương 4.'],
  sources: [
    programme('Polymer'),
    textbook(12, 14)
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
          text: 'Nhìn công thức một mắt xích, em có thể đoán được polymer đó điều chế bằng trùng hợp hay trùng ngưng, từ monomer nào không?'
        },
        {
          type: 'list',
          items: [
            'Tổng hợp kiến thức về polymer và vật liệu polymer.',
            'Xác định monomer từ mắt xích.',
            'Giải bài toán hệ số polymer hóa và hiệu suất trùng hợp.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 4',
      blocks: [
        {
          type: 'table',
          caption: 'Monomer và phương pháp tổng hợp',
          head: ['Polymer', 'Monomer', 'Phương pháp', 'Loại vật liệu'],
          rows: [
            ['PE', 'Ethylene', 'Trùng hợp', 'Chất dẻo'],
            ['PVC', 'Vinyl chloride', 'Trùng hợp', 'Chất dẻo'],
            ['PMMA', 'Methyl methacrylate', 'Trùng hợp', 'Chất dẻo'],
            ['Nitron', 'Acrylonitrile', 'Trùng hợp', 'Tơ tổng hợp'],
            ['Nylon-6,6', 'Hexamethylenediamine + adipic acid', 'Trùng ngưng', 'Tơ tổng hợp'],
            ['Capron (nylon-6)', 'ε-aminocaproic acid (hoặc caprolactam)', 'Trùng ngưng (hoặc trùng hợp mở vòng)', 'Tơ tổng hợp'],
            ['Cao su buna', 'Buta-1,3-diene', 'Trùng hợp', 'Cao su']
          ]
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Mẹo nhận diện',
          text: 'Mắt xích chỉ có mạch carbon (có thể mang nhóm thế) ⇒ thường là trùng hợp. Mắt xích chứa liên kết −CO−NH− hoặc −CO−O− nối các phần mạch ⇒ thường là trùng ngưng.'
        }
      ]
    },
    {
      id: 'example-monomer',
      kind: 'example',
      title: 'Ví dụ 1 — Xác định monomer',
      blocks: [
        {
          type: 'worked',
          problem: 'Xác định monomer và phương pháp tổng hợp của polymer có mắt xích (−CH₂−CH(C₆H₅)−).',
          steps: [
            'Mạch chính chỉ gồm C, không có nhóm −CO−NH− hay −CO−O− ⇒ trùng hợp.',
            'Tách mắt xích tạo lại liên kết đôi: CH₂=CH−C₆H₅.'
          ],
          answer: 'Monomer là styrene; polymer là polystyrene (PS), điều chế bằng trùng hợp.'
        }
      ]
    },
    {
      id: 'example-yield',
      kind: 'example',
      title: 'Ví dụ 2 — Hiệu suất trùng hợp',
      blocks: [
        {
          type: 'worked',
          problem: 'Trùng hợp 5,6 tấn ethylene với hiệu suất 90% thu được bao nhiêu tấn polyethylene?',
          steps: [
            'Trùng hợp không giải phóng chất nào: m(polymer) lí thuyết = m(monomer) = 5,6 tấn.',
            'Thực tế: 5,6 × 90% = 5,04 tấn.'
          ],
          answer: 'Thu được 5,04 tấn PE.'
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
          id: 'g12-l14-c1',
          question: 'Polymer nào được điều chế bằng phản ứng trùng ngưng?',
          options: [
            { id: 'a', text: 'PVC' },
            { id: 'b', text: 'Polystyrene' },
            { id: 'c', text: 'Nylon-6,6' },
            { id: 'd', text: 'Polyethylene' }
          ],
          correct: 'c',
          explanation: 'Nylon-6,6 tạo từ diamine và diacid, giải phóng nước.'
        },
        {
          type: 'quiz',
          id: 'g12-l14-c2',
          question: 'Trong phản ứng trùng hợp, khối lượng polymer (hiệu suất 100%)',
          options: [
            { id: 'a', text: 'bằng khối lượng monomer' },
            { id: 'b', text: 'nhỏ hơn khối lượng monomer do mất nước' },
            { id: 'c', text: 'lớn hơn khối lượng monomer' },
            { id: 'd', text: 'không xác định được' }
          ],
          correct: 'a',
          explanation: 'Trùng hợp không giải phóng phân tử nhỏ.'
        },
        {
          type: 'quiz',
          id: 'g12-l14-c3',
          question: 'Monomer của cao su buna là',
          options: [
            { id: 'a', text: 'isoprene' },
            { id: 'b', text: 'buta-1,3-diene' },
            { id: 'c', text: 'styrene' },
            { id: 'd', text: 'chloroprene' }
          ],
          correct: 'b',
          explanation: 'Buna = butadiene + natri (xúc tác Na trong quy trình ban đầu).'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 4',
      blocks: [
        {
          type: 'list',
          items: [
            'Hệ số polymer hóa n = M(polymer) / M(mắt xích).',
            'Trùng hợp: m(polymer) = m(monomer) × hiệu suất; trùng ngưng: trừ khối lượng phân tử nhỏ giải phóng.',
            'Vật liệu polymer: chất dẻo, composite, tơ, cao su, keo dán; sử dụng và xử lí rác thải hợp lí.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Trùng ngưng cũng có m(polymer) = m(monomer).', right: 'Trùng ngưng giải phóng phân tử nhỏ (H₂O…) nên **m(polymer) < m(monomer)**.' },
            { wrong: 'Tính n của PVC bằng M(polymer) / M(vinyl chloride + H₂O).', right: 'Mắt xích PVC có cùng thành phần với monomer: **n = M / 62,5**.' },
            { wrong: 'Mọi polymer chứa N đều tạo bằng trùng ngưng.', right: 'Tơ nitron chứa N nhưng tạo bằng **trùng hợp** acrylonitrile.' }
          ]
        },
        {
          type: 'p',
          text: 'Chương tiếp theo: **Pin điện và điện phân**.'
        }
      ]
    }
  ]
}
