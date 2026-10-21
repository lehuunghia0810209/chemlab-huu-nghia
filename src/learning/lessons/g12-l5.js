// Hóa học 12 · Chương 2 · Bài 5 — Saccharose và maltose.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l5',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được cấu tạo của saccharose và maltose; trạng thái tự nhiên, tính chất vật lí.',
    'Trình bày được tính chất hóa học: phản ứng với Cu(OH)₂, phản ứng thủy phân; maltose có tính khử, saccharose không có tính khử.',
    'Nêu được ứng dụng của saccharose, maltose.'
  ],
  prerequisites: ['Bài 4: cấu tạo dạng vòng của glucose, fructose; nhóm −OH hemiacetal.'],
  sources: [
    programme('Carbohydrate'),
    textbook(12, 5)
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
          text: 'Đường kính (saccharose) và mạch nha (maltose) có cùng công thức C₁₂H₂₂O₁₁. Thế nhưng mạch nha tráng bạc được còn đường kính thì không. Sự khác nhau trong cấu tạo nào gây ra điều đó?'
        },
        {
          type: 'list',
          items: [
            'Mô tả cấu tạo saccharose và maltose.',
            'Viết phản ứng với Cu(OH)₂ và phản ứng thủy phân.',
            'Giải thích vì sao maltose có tính khử, saccharose thì không.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Nhóm −OH hemiacetal giúp vòng mở ra thành dạng mạch hở có nhóm −CHO.', 'Disaccharide thủy phân tạo hai monosaccharide.'] }
      ]
    },
    {
      id: 'structure',
      kind: 'concept',
      title: 'Cấu tạo và trạng thái tự nhiên',
      blocks: [
        {
          type: 'table',
          caption: 'So sánh saccharose và maltose',
          head: ['', 'Saccharose', 'Maltose'],
          rows: [
            ['Cấu tạo', 'Một gốc α-glucose và một gốc β-fructose, liên kết α-1,2-glycoside', 'Hai gốc α-glucose, liên kết α-1,4-glycoside'],
            ['Nhóm −OH hemiacetal', 'Không còn', 'Còn một nhóm'],
            ['Tự nhiên', 'Mía, củ cải đường, hoa thốt nốt (đường kính, đường phèn)', 'Mạch nha (thủy phân tinh bột nhờ enzyme)'],
            ['Tính chất vật lí', 'Chất rắn, không màu, tan tốt, vị ngọt', 'Chất rắn, tan tốt, vị ngọt kém saccharose']
          ]
        }
      ]
    },
    {
      id: 'reactions',
      kind: 'concept',
      title: 'Tính chất hóa học',
      blocks: [
        { type: 'heading', text: 'Phản ứng với Cu(OH)₂ (tính chất polyalcohol)' },
        { type: 'equation', text: '2C₁₂H₂₂O₁₁ + Cu(OH)₂ → (C₁₂H₂₁O₁₁)₂Cu + 2H₂O', note: 'Cả saccharose và maltose hòa tan Cu(OH)₂ tạo dung dịch xanh lam.' },
        { type: 'heading', text: 'Phản ứng thủy phân (H⁺ hoặc enzyme, t°)' },
        { type: 'equation', text: 'C₁₂H₂₂O₁₁ + H₂O → C₆H₁₂O₆ + C₆H₁₂O₆', condition: 'H⁺, t°', note: 'Saccharose → glucose + fructose.' },
        { type: 'equation', text: 'C₁₂H₂₂O₁₁ + H₂O → 2C₆H₁₂O₆', condition: 'H⁺, t°', note: 'Maltose → 2 glucose.' },
        { type: 'heading', text: 'Tính khử' },
        {
          type: 'p',
          text: 'Maltose còn nhóm −OH hemiacetal nên vòng có thể mở ra tạo nhóm −CHO: maltose khử được thuốc thử Tollens và Cu(OH)₂/NaOH đun nóng. Saccharose không còn nhóm −OH hemiacetal nên **không có tính khử**; chỉ sau khi thủy phân, dung dịch thu được mới tráng bạc.'
        },
        {
          type: 'p',
          text: 'Ứng dụng: saccharose dùng làm thực phẩm, pha chế thuốc, sản xuất bánh kẹo, đồ uống; maltose dùng làm kẹo mạch nha, đồ uống.'
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Thủy phân saccharose',
      blocks: [
        {
          type: 'worked',
          problem: 'Thủy phân 34,2 g saccharose với hiệu suất 80%. Tính khối lượng glucose thu được (C = 12, H = 1, O = 16).',
          steps: [
            'M(C₁₂H₂₂O₁₁) = 342 ⇒ n = 34,2 / 342 = 0,1 mol.',
            'n(glucose) = 0,1 × 80% = 0,08 mol (thu được thêm 0,08 mol fructose).',
            'm(glucose) = 0,08 × 180 = 14,4 g.'
          ],
          answer: 'Thu được 14,4 g glucose.'
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
          id: 'g12-l5-c1',
          question: 'Thủy phân saccharose thu được',
          options: [
            { id: 'a', text: 'hai phân tử glucose' },
            { id: 'b', text: 'glucose và fructose' },
            { id: 'c', text: 'hai phân tử fructose' },
            { id: 'd', text: 'glucose và ethanol' }
          ],
          correct: 'b',
          explanation: 'Saccharose gồm một gốc glucose và một gốc fructose.'
        },
        {
          type: 'quiz',
          id: 'g12-l5-c2',
          question: 'Chất nào tham gia phản ứng tráng bạc?',
          options: [
            { id: 'a', text: 'Saccharose' },
            { id: 'b', text: 'Maltose' },
            { id: 'c', text: 'Tinh bột' },
            { id: 'd', text: 'Cellulose' }
          ],
          correct: 'b',
          explanation: 'Maltose còn nhóm −OH hemiacetal, mở vòng tạo nhóm −CHO.'
        },
        {
          type: 'quiz',
          id: 'g12-l5-c3',
          question: 'Saccharose và maltose đều',
          options: [
            { id: 'a', text: 'tráng bạc' },
            { id: 'b', text: 'hòa tan Cu(OH)₂ ở nhiệt độ thường' },
            { id: 'c', text: 'làm mất màu nước bromine' },
            { id: 'd', text: 'là monosaccharide' }
          ],
          correct: 'b',
          explanation: 'Cả hai có nhiều nhóm OH kề nhau.'
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
            'Saccharose: α-glucose + β-fructose (α-1,2-glycoside), không còn −OH hemiacetal ⇒ không có tính khử.',
            'Maltose: hai α-glucose (α-1,4-glycoside), còn −OH hemiacetal ⇒ có tính khử.',
            'Cả hai hòa tan Cu(OH)₂ tạo dung dịch xanh lam và bị thủy phân tạo monosaccharide.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Saccharose có gốc glucose nên tráng bạc được.', right: 'Trong saccharose, C1 của glucose đã tham gia liên kết glycoside, **không còn −OH hemiacetal** nên không tráng bạc.' },
            { wrong: 'Thủy phân maltose tạo glucose và fructose.', right: 'Maltose thủy phân tạo **hai phân tử glucose**.' },
            { wrong: 'Saccharose không phản ứng với Cu(OH)₂.', right: 'Saccharose **có** hòa tan Cu(OH)₂ ở nhiệt độ thường (tính chất polyalcohol), chỉ không khử Cu(OH)₂ khi đun nóng.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Tinh bột và cellulose**.'
        }
      ]
    }
  ]
}
