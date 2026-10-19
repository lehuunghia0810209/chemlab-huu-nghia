// Hóa học 12 · Chương 2 · Bài 4 — Giới thiệu về carbohydrate. Glucose và fructose.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l4',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm, cách phân loại carbohydrate; trạng thái tự nhiên của glucose, fructose.',
    'Viết được công thức cấu tạo dạng mạch hở và nêu được dạng mạch vòng của glucose, fructose.',
    'Trình bày được tính chất hóa học của glucose và fructose: phản ứng với Cu(OH)₂ ở nhiệt độ thường; tính chất của nhóm carbonyl (khử thuốc thử Tollens, Cu(OH)₂/NaOH đun nóng; glucose làm mất màu nước bromine); phản ứng lên men của glucose.',
    'Nêu được ứng dụng của glucose và fructose.'
  ],
  prerequisites: [
    'Hóa 11 bài 20: polyalcohol hòa tan Cu(OH)₂.',
    'Hóa 11 bài 23: phản ứng của aldehyde, ketone.'
  ],
  sources: [
    programme('Carbohydrate'),
    textbook(12, 4)
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
          text: 'Người bệnh mệt mỏi thường được truyền dịch glucose; mật ong ngọt hơn đường nho vì chứa nhiều fructose. Glucose và fructose có cùng công thức phân tử C₆H₁₂O₆ nhưng cấu tạo và tính chất có gì khác nhau?'
        },
        {
          type: 'list',
          items: [
            'Nêu khái niệm và phân loại carbohydrate.',
            'Viết cấu tạo mạch hở; nêu dạng mạch vòng của glucose, fructose.',
            'Viết phản ứng thể hiện tính chất polyalcohol, tính chất của nhóm carbonyl và phản ứng lên men.',
            'Phân biệt glucose và fructose.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Polyalcohol có các nhóm OH kề nhau hòa tan Cu(OH)₂ tạo dung dịch xanh lam.', 'Aldehyde tráng bạc, khử Cu(OH)₂/NaOH tạo Cu₂O đỏ gạch.'] }
      ]
    },
    {
      id: 'classification',
      kind: 'concept',
      title: 'Carbohydrate: khái niệm và phân loại',
      blocks: [
        {
          type: 'callout',
          title: 'Carbohydrate',
          text: 'Là những hợp chất hữu cơ tạp chức, thường có công thức chung **Cₙ(H₂O)ₘ**.'
        },
        {
          type: 'table',
          caption: 'Phân loại',
          head: ['Loại', 'Đặc điểm', 'Ví dụ'],
          rows: [
            ['Monosaccharide', 'Không bị thủy phân', 'Glucose, fructose (C₆H₁₂O₆)'],
            ['Disaccharide', 'Thủy phân tạo 2 phân tử monosaccharide', 'Saccharose, maltose (C₁₂H₂₂O₁₁)'],
            ['Polysaccharide', 'Thủy phân tạo nhiều phân tử monosaccharide', 'Tinh bột, cellulose ((C₆H₁₀O₅)ₙ)']
          ]
        }
      ]
    },
    {
      id: 'structure',
      kind: 'concept',
      title: 'Cấu tạo và trạng thái tự nhiên',
      blocks: [
        {
          type: 'table',
          caption: 'Glucose và fructose',
          head: ['', 'Glucose', 'Fructose'],
          rows: [
            ['Mạch hở', 'CH₂OH[CHOH]₄CHO: 5 nhóm OH + nhóm aldehyde', 'CH₂OH[CHOH]₃COCH₂OH: 5 nhóm OH + nhóm ketone'],
            ['Mạch vòng', 'Vòng 6 cạnh, hai dạng α và β', 'Vòng 5 cạnh, hai dạng α và β'],
            ['Tự nhiên', 'Quả nho chín (đường nho), máu người (khoảng 0,1%)', 'Mật ong (khoảng 40%), quả ngọt'],
            ['Tính chất vật lí', 'Chất rắn, tan tốt trong nước, vị ngọt', 'Chất rắn, tan tốt, ngọt hơn glucose']
          ]
        },
        {
          type: 'p',
          text: 'Trong dung dịch, glucose và fructose tồn tại chủ yếu ở dạng mạch vòng, cân bằng với một lượng nhỏ dạng mạch hở. Ở dạng vòng, nhóm −OH gắn với C1 của glucose gọi là **nhóm −OH hemiacetal**.'
        }
      ]
    },
    {
      id: 'reactions',
      kind: 'concept',
      title: 'Tính chất hóa học',
      blocks: [
        { type: 'heading', text: 'Tính chất của polyalcohol' },
        { type: 'equation', text: '2C₆H₁₂O₆ + Cu(OH)₂ → (C₆H₁₁O₆)₂Cu + 2H₂O', note: 'Ở nhiệt độ thường, dung dịch glucose (hoặc fructose) hòa tan Cu(OH)₂ tạo dung dịch xanh lam.' },
        { type: 'heading', text: 'Tính chất của nhóm carbonyl' },
        { type: 'equation', text: 'C₆H₁₂O₆ + 2[Ag(NH₃)₂]OH → C₆H₁₁O₇NH₄ + 2Ag + 3NH₃ + H₂O', condition: 't°', note: 'Glucose khử thuốc thử Tollens (tráng bạc), tạo ammonium gluconate.' },
        { type: 'equation', text: 'C₆H₁₂O₆ + 2Cu(OH)₂ + NaOH → C₆H₁₁O₇Na + Cu₂O + 3H₂O', condition: 't°', note: 'Tạo kết tủa đỏ gạch Cu₂O.' },
        { type: 'equation', text: 'C₆H₁₂O₆ + Br₂ + H₂O → C₆H₁₂O₇ + 2HBr', note: 'Glucose làm mất màu nước bromine, tạo gluconic acid; fructose không phản ứng.' },
        {
          type: 'callout',
          tone: 'note',
          title: 'Fructose',
          text: 'Trong môi trường kiềm, fructose chuyển hóa một phần thành glucose, nên fructose cũng khử được thuốc thử Tollens và Cu(OH)₂/NaOH đun nóng. Dùng **nước bromine** để phân biệt glucose với fructose.'
        },
        { type: 'heading', text: 'Phản ứng lên men của glucose' },
        { type: 'equation', text: 'C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂', condition: 'enzyme, 30 – 35 °C' },
        {
          type: 'p',
          text: 'Ứng dụng: glucose là chất dinh dưỡng, thuốc tăng lực, dịch truyền; dùng tráng gương, tráng ruột phích, sản xuất ethanol. Fructose dùng trong công nghiệp thực phẩm.'
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Tráng bạc và lên men',
      blocks: [
        {
          type: 'worked',
          problem: '(a) Cho 18 g glucose tác dụng với lượng dư thuốc thử Tollens, đun nóng. Tính khối lượng Ag thu được. (b) Lên men 36 g glucose với hiệu suất 80%. Tính thể tích CO₂ ở điều kiện chuẩn (24,79 L/mol).',
          steps: [
            '(a) n(C₆H₁₂O₆) = 18 / 180 = 0,1 mol ⇒ n(Ag) = 0,2 mol ⇒ m = 0,2 × 108 = 21,6 g.',
            '(b) n(glucose) = 36 / 180 = 0,2 mol ⇒ n(CO₂) = 2 × 0,2 × 80% = 0,32 mol.',
            'V(CO₂) = 0,32 × 24,79 ≈ 7,93 L.'
          ],
          answer: '(a) 21,6 g Ag; (b) khoảng 7,93 L CO₂.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: glucose và Cu(OH)₂',
      blocks: [
        {
          type: 'p',
          text: 'Trong phòng thí nghiệm ảo, tạo Cu(OH)₂ từ CuSO₄ và NaOH rồi thêm dung dịch glucose. Quan sát kết tủa tan tạo dung dịch xanh lam.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Glucose và fructose',
          text: 'Mở trong Phòng thí nghiệm ảo; quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'guided', grade: 12, lessonId: 'g12-l4', experimentId: 'g12-glucose-copper' }
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
          id: 'g12-l4-c1',
          question: 'Glucose thuộc loại',
          options: [
            { id: 'a', text: 'monosaccharide' },
            { id: 'b', text: 'disaccharide' },
            { id: 'c', text: 'polysaccharide' },
            { id: 'd', text: 'lipid' }
          ],
          correct: 'a',
          explanation: 'Glucose không bị thủy phân.'
        },
        {
          type: 'quiz',
          id: 'g12-l4-c2',
          question: 'Thuốc thử phân biệt glucose và fructose là',
          options: [
            { id: 'a', text: 'Cu(OH)₂ ở nhiệt độ thường' },
            { id: 'b', text: 'thuốc thử Tollens' },
            { id: 'c', text: 'nước bromine' },
            { id: 'd', text: 'Cu(OH)₂/NaOH đun nóng' }
          ],
          correct: 'c',
          explanation: 'Chỉ glucose làm mất màu nước bromine; các thuốc thử còn lại cho cùng hiện tượng.'
        },
        {
          type: 'quiz',
          id: 'g12-l4-c3',
          question: 'Phân tử glucose dạng mạch hở có',
          options: [
            { id: 'a', text: '5 nhóm OH và 1 nhóm CHO' },
            { id: 'b', text: '5 nhóm OH và 1 nhóm C=O ketone' },
            { id: 'c', text: '6 nhóm OH' },
            { id: 'd', text: '4 nhóm OH và 1 nhóm COOH' }
          ],
          correct: 'a',
          explanation: 'Glucose: CH₂OH[CHOH]₄CHO.'
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
            'Carbohydrate Cₙ(H₂O)ₘ: monosaccharide, disaccharide, polysaccharide.',
            'Glucose CH₂OH[CHOH]₄CHO (aldehyde); fructose CH₂OH[CHOH]₃COCH₂OH (ketone); trong dung dịch chủ yếu ở dạng vòng.',
            'Cả hai: hòa tan Cu(OH)₂ (xanh lam), tráng bạc, khử Cu(OH)₂/NaOH đun nóng (Cu₂O đỏ gạch).',
            'Chỉ glucose làm mất màu nước bromine và lên men tạo ethanol.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Fructose là ketone nên không tráng bạc.', right: 'Trong môi trường kiềm fructose chuyển thành glucose nên **vẫn tráng bạc**.' },
            { wrong: 'Dùng thuốc thử Tollens để phân biệt glucose và fructose.', right: 'Cả hai đều tráng bạc; phải dùng **nước bromine**.' },
            { wrong: 'Glucose trong dung dịch chủ yếu ở dạng mạch hở.', right: 'Glucose tồn tại chủ yếu ở **dạng mạch vòng** (α và β).' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Saccharose và maltose**.'
        }
      ]
    }
  ]
}
