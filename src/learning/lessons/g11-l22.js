// Hóa học 11 · Chương 5 · Bài 22 — Ôn tập chương 5 (Dẫn xuất halogen – Alcohol – Phenol).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l22',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa cấu tạo, tính chất của dẫn xuất halogen, alcohol và phenol.',
    'Vận dụng để nhận biết, viết sơ đồ chuyển hóa và giải bài tập định lượng.'
  ],
  prerequisites: ['Bài 19 – 21 của chương 5.'],
  sources: [
    programme('Dẫn xuất halogen – Alcohol – Phenol'),
    textbook(11, 22)
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
          text: 'Từ bromoethane có thể điều chế ethanol, ethylene, rồi lại quay về ethanol. Các hợp chất trong chương 5 chuyển hóa qua lại với nhau như thế nào, và làm sao phân biệt chúng?'
        },
        {
          type: 'list',
          items: [
            'So sánh dẫn xuất halogen, alcohol và phenol.',
            'Viết sơ đồ chuyển hóa giữa các loại hợp chất.',
            'Luyện nhận biết và bài toán định lượng.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 5',
      blocks: [
        {
          type: 'table',
          caption: 'So sánh các loại hợp chất',
          head: ['', 'Dẫn xuất halogen', 'Alcohol', 'Phenol'],
          rows: [
            ['Nhóm đặc trưng', '−X gắn C', '−OH gắn C no', '−OH gắn trực tiếp vòng benzene'],
            ['Tan trong nước', 'Hầu như không', 'Alcohol nhỏ tan vô hạn', 'Ít tan trong nước lạnh'],
            ['Với Na', 'Không', 'Có, tạo H₂', 'Có, tạo H₂'],
            ['Với NaOH', 'Thế −X (đun nóng, trong nước)', 'Không', 'Có (tính acid yếu)'],
            ['Phản ứng đặc trưng', 'Thế −X bằng −OH; tách HX', 'Tách nước; oxi hóa bởi CuO; polyalcohol + Cu(OH)₂', 'Thế vòng với nước bromine (kết tủa trắng)']
          ]
        },
        { type: 'heading', text: 'Sơ đồ chuyển hóa' },
        { type: 'equation', text: 'C₂H₅Br + NaOH → C₂H₅OH + NaBr', condition: 't°, trong nước' },
        { type: 'equation', text: 'C₂H₅OH → C₂H₄ + H₂O', condition: 'H₂SO₄ đặc, 170 °C' },
        { type: 'equation', text: 'C₂H₄ + HBr → C₂H₅Br' }
      ]
    },
    {
      id: 'example-identify',
      kind: 'example',
      title: 'Ví dụ 1 — Nhận biết',
      blocks: [
        {
          type: 'worked',
          problem: 'Nhận biết ba chất lỏng: ethanol, glycerol, dung dịch phenol.',
          steps: [
            'Nhỏ nước bromine vào từng mẫu: dung dịch phenol tạo kết tủa trắng.',
            'Hai mẫu còn lại cho tác dụng với Cu(OH)₂: glycerol hòa tan tạo dung dịch xanh lam.',
            'Mẫu không có hiện tượng là ethanol.'
          ],
          answer: 'Nước bromine nhận phenol; Cu(OH)₂ nhận glycerol; còn lại là ethanol.',
          equations: ['C₆H₅OH + 3Br₂ → C₆H₂Br₃OH + 3HBr', '2C₃H₅(OH)₃ + Cu(OH)₂ → [C₃H₅(OH)₂O]₂Cu + 2H₂O']
        }
      ]
    },
    {
      id: 'example-mixture',
      kind: 'example',
      title: 'Ví dụ 2 — Hỗn hợp ethanol và phenol',
      blocks: [
        {
          type: 'worked',
          problem: 'Hỗn hợp X gồm ethanol và phenol. Cho X tác dụng với Na dư thu được 2,479 L H₂ (điều kiện chuẩn). Cũng lượng X đó phản ứng vừa đủ với 100 mL dung dịch NaOH 1 M. Tính khối lượng mỗi chất trong X (C = 12, H = 1, O = 16).',
          steps: [
            'Chỉ phenol phản ứng với NaOH ⇒ n(phenol) = n(NaOH) = 0,1 mol.',
            'n(H₂) = 2,479 / 24,79 = 0,1 mol ⇒ tổng n(−OH) = 2 × 0,1 = 0,2 mol ⇒ n(ethanol) = 0,2 − 0,1 = 0,1 mol.',
            'm(phenol) = 0,1 × 94 = 9,4 g; m(ethanol) = 0,1 × 46 = 4,6 g.'
          ],
          answer: 'X gồm 9,4 g phenol và 4,6 g ethanol.'
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
          id: 'g11-l22-c1',
          question: 'Chất nào tác dụng được với cả Na và dung dịch NaOH?',
          options: [
            { id: 'a', text: 'C₂H₅OH' },
            { id: 'b', text: 'C₆H₅OH' },
            { id: 'c', text: 'C₃H₅(OH)₃' },
            { id: 'd', text: 'C₆H₅CH₂OH' }
          ],
          correct: 'b',
          explanation: 'Phenol có tính acid yếu nên tác dụng với NaOH; các alcohol chỉ tác dụng với Na.'
        },
        {
          type: 'quiz',
          id: 'g11-l22-c2',
          question: 'Đun nóng ethanol với H₂SO₄ đặc ở 170 °C thu được sản phẩm hữu cơ chính là',
          options: [
            { id: 'a', text: 'diethyl ether' },
            { id: 'b', text: 'ethylene' },
            { id: 'c', text: 'acetaldehyde' },
            { id: 'd', text: 'acetic acid' }
          ],
          correct: 'b',
          explanation: 'Ở 170 °C là phản ứng tách nước nội phân tử tạo alkene; ở 140 °C tạo ether.'
        },
        {
          type: 'quiz',
          id: 'g11-l22-c3',
          question: 'Thứ tự đúng để điều chế ethanol từ ethylene qua dẫn xuất halogen là',
          options: [
            { id: 'a', text: 'C₂H₄ + HBr, rồi đun với NaOH trong nước' },
            { id: 'b', text: 'C₂H₄ + HBr, rồi đun với KOH trong ethanol' },
            { id: 'c', text: 'C₂H₄ + Br₂, rồi đun với CuO' },
            { id: 'd', text: 'C₂H₄ + H₂, rồi đun với NaOH' }
          ],
          correct: 'a',
          explanation: 'C₂H₄ + HBr → C₂H₅Br; C₂H₅Br + NaOH (nước) → C₂H₅OH. KOH/ethanol lại tạo về ethylene.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 5',
      blocks: [
        {
          type: 'list',
          items: [
            'Nhận biết: nước bromine (phenol, kết tủa trắng); Cu(OH)₂ (polyalcohol có OH kề nhau, xanh lam); FeCl₃ (phenol, màu tím).',
            'Bài toán hỗn hợp alcohol – phenol: NaOH chỉ tác dụng với phenol; Na tác dụng với mọi nhóm −OH, n(H₂) = n(−OH)/2.',
            'Dẫn xuất halogen ⇄ alcohol ⇄ alkene chuyển hóa qua phản ứng thế, tách và cộng.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Hỗn hợp alcohol và phenol: n(NaOH) bằng tổng số mol hai chất.', right: 'Chỉ **phenol** tác dụng với NaOH; alcohol không phản ứng.' },
            { wrong: 'n(H₂) = tổng số mol các chất có nhóm −OH.', right: 'Mỗi nhóm −OH cho ½ H₂: **n(H₂) = n(−OH) / 2**.' },
            { wrong: 'Ethanol tách nước luôn tạo ethylene.', right: 'Phụ thuộc nhiệt độ: **140 °C** tạo diethyl ether, **170 °C** tạo ethylene.' }
          ]
        },
        {
          type: 'p',
          text: 'Chương tiếp theo: **Hợp chất carbonyl – Carboxylic acid**.'
        }
      ]
    }
  ]
}
