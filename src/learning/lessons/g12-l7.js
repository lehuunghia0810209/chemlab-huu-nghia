// Hóa học 12 · Chương 2 · Bài 7 — Ôn tập chương 2 (Carbohydrate).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l7',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa cấu tạo và tính chất của glucose, fructose, saccharose, maltose, tinh bột, cellulose.',
    'Vận dụng để nhận biết carbohydrate và giải bài tập thủy phân, lên men, tráng bạc.'
  ],
  prerequisites: ['Bài 4 – 6 của chương 2.'],
  sources: [
    programme('Carbohydrate'),
    textbook(12, 7)
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
          text: 'Có bốn lọ mất nhãn đựng dung dịch glucose, saccharose, hồ tinh bột và nước cất. Chỉ với vài thuốc thử quen thuộc, em có thể phân biệt chúng không?'
        },
        {
          type: 'list',
          items: [
            'Lập bảng so sánh các carbohydrate.',
            'Chọn thuốc thử nhận biết phù hợp.',
            'Giải bài toán chuỗi: tinh bột → glucose → ethanol.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 2',
      blocks: [
        {
          type: 'table',
          caption: 'Tính chất của các carbohydrate',
          head: ['Chất', 'Cu(OH)₂, nhiệt độ thường', 'Tráng bạc', 'Nước bromine', 'Thủy phân'],
          rows: [
            ['Glucose', 'Xanh lam', 'Có', 'Mất màu', 'Không'],
            ['Fructose', 'Xanh lam', 'Có (môi trường kiềm)', 'Không', 'Không'],
            ['Saccharose', 'Xanh lam', 'Không', 'Không', 'Glucose + fructose'],
            ['Maltose', 'Xanh lam', 'Có', 'Mất màu', '2 glucose'],
            ['Tinh bột', 'Không', 'Không', 'Không', 'Glucose (+ iodine: xanh tím)'],
            ['Cellulose', 'Không', 'Không', 'Không', 'Glucose']
          ]
        }
      ]
    },
    {
      id: 'example-identify',
      kind: 'example',
      title: 'Ví dụ 1 — Nhận biết',
      blocks: [
        {
          type: 'worked',
          problem: 'Nhận biết bốn dung dịch: glucose, saccharose, hồ tinh bột, nước cất.',
          steps: [
            'Nhỏ dung dịch iodine: hồ tinh bột chuyển màu xanh tím.',
            'Ba mẫu còn lại cho tác dụng với Cu(OH)₂ ở nhiệt độ thường: glucose và saccharose tạo dung dịch xanh lam; nước cất không hiện tượng.',
            'Hai mẫu tạo xanh lam đem tráng bạc: glucose tạo lớp Ag, saccharose không.'
          ],
          answer: 'Iodine nhận tinh bột; Cu(OH)₂ nhận nước cất; thuốc thử Tollens phân biệt glucose với saccharose.'
        }
      ]
    },
    {
      id: 'example-chain',
      kind: 'example',
      title: 'Ví dụ 2 — Từ tinh bột đến ethanol',
      blocks: [
        {
          type: 'worked',
          problem: 'Từ 81 kg tinh bột sản xuất ethanol qua hai giai đoạn: thủy phân (hiệu suất 80%) và lên men (hiệu suất 75%). Tính khối lượng ethanol thu được.',
          steps: [
            'n(C₆H₁₀O₅) = 81 / 162 = 0,5 kmol ⇒ glucose = 0,5 × 80% = 0,4 kmol.',
            'Ethanol = 2 × 0,4 × 75% = 0,6 kmol.',
            'm = 0,6 × 46 = 27,6 kg.'
          ],
          answer: 'Thu được 27,6 kg ethanol.',
          equations: ['C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂']
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
          id: 'g12-l7-c1',
          question: 'Chất nào không bị thủy phân?',
          options: [
            { id: 'a', text: 'Saccharose' },
            { id: 'b', text: 'Tinh bột' },
            { id: 'c', text: 'Fructose' },
            { id: 'd', text: 'Cellulose' }
          ],
          correct: 'c',
          explanation: 'Fructose là monosaccharide.'
        },
        {
          type: 'quiz',
          id: 'g12-l7-c2',
          question: 'Hiệu suất chung của chuỗi nhiều giai đoạn bằng',
          options: [
            { id: 'a', text: 'tổng hiệu suất các giai đoạn' },
            { id: 'b', text: 'tích hiệu suất các giai đoạn' },
            { id: 'c', text: 'hiệu suất của giai đoạn cuối' },
            { id: 'd', text: 'trung bình cộng hiệu suất các giai đoạn' }
          ],
          correct: 'b',
          explanation: 'Ví dụ 80% × 75% = 60%.'
        },
        {
          type: 'quiz',
          id: 'g12-l7-c3',
          question: 'Chất vừa hòa tan Cu(OH)₂, vừa tráng bạc, vừa bị thủy phân là',
          options: [
            { id: 'a', text: 'glucose' },
            { id: 'b', text: 'saccharose' },
            { id: 'c', text: 'maltose' },
            { id: 'd', text: 'tinh bột' }
          ],
          correct: 'c',
          explanation: 'Maltose là disaccharide còn nhóm −OH hemiacetal.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 2',
      blocks: [
        {
          type: 'list',
          items: [
            'Nhận biết: iodine (tinh bột); Cu(OH)₂ ở nhiệt độ thường (các chất có nhiều OH kề nhau, tan được); Tollens (glucose, fructose, maltose); nước bromine (glucose, maltose).',
            'Bài toán chuỗi: hiệu suất chung bằng tích hiệu suất các giai đoạn.',
            '1 glucose → 2 Ag; 1 glucose → 2 C₂H₅OH + 2 CO₂; 1 mắt xích C₆H₁₀O₅ → 1 glucose.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Cộng hiệu suất các giai đoạn: 80% + 75%.', right: 'Hiệu suất chung là **tích**: 80% × 75% = 60%.' },
            { wrong: 'Tinh bột hòa tan Cu(OH)₂ vì có nhiều nhóm OH.', right: 'Tinh bột, cellulose **không** hòa tan Cu(OH)₂ ở nhiệt độ thường.' },
            { wrong: 'Thủy phân saccharose chỉ cho glucose nên số mol Ag = 2n(saccharose).', right: 'Sản phẩm gồm glucose và fructose, **cả hai đều tráng bạc**: n(Ag) = 4n(saccharose) đã thủy phân.' }
          ]
        },
        {
          type: 'p',
          text: 'Chương tiếp theo: **Hợp chất chứa nitrogen**.'
        }
      ]
    }
  ]
}
