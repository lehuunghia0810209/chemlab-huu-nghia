// Hóa học 11 · Chương 4 · Bài 18 — Ôn tập chương 4 (Hydrocarbon).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l18',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa cấu tạo, danh pháp, tính chất của alkane, alkene, alkyne và arene.',
    'Vận dụng để nhận biết hydrocarbon, giải bài tập đốt cháy và phản ứng cộng.'
  ],
  prerequisites: ['Bài 15 – 17 của chương 4.'],
  sources: [
    programme('Hydrocarbon'),
    textbook(11, 18)
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
          text: 'Chỉ cần đốt cháy một hydrocarbon và so sánh số mol CO₂ với số mol H₂O, em đã có thể đoán nó thuộc loại alkane, alkene hay alkyne. Vì sao?'
        },
        {
          type: 'list',
          items: [
            'So sánh bốn loại hydrocarbon trong một bảng.',
            'Dùng tỉ lệ CO₂ : H₂O khi đốt cháy để xác định loại hydrocarbon.',
            'Luyện nhận biết và bài toán phản ứng cộng.'
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
          caption: 'So sánh các loại hydrocarbon',
          head: ['', 'Alkane', 'Alkene', 'Alkyne', 'Arene (dãy benzene)'],
          rows: [
            ['Công thức chung', 'CₙH₂ₙ₊₂', 'CₙH₂ₙ', 'CₙH₂ₙ₋₂', 'CₙH₂ₙ₋₆'],
            ['Đặc điểm liên kết', 'Chỉ liên kết đơn', 'Một C=C', 'Một C≡C', 'Vòng benzene'],
            ['Phản ứng đặc trưng', 'Thế (ánh sáng), cracking', 'Cộng, trùng hợp', 'Cộng; alk-1-yne + AgNO₃/NH₃', 'Thế (xúc tác); cộng khó'],
            ['Nước bromine', 'Không', 'Mất màu', 'Mất màu', 'Không'],
            ['Đốt cháy', 'n(H₂O) > n(CO₂)', 'n(H₂O) = n(CO₂)', 'n(H₂O) < n(CO₂)', 'n(H₂O) < n(CO₂)']
          ]
        }
      ]
    },
    {
      id: 'example-combustion',
      kind: 'example',
      title: 'Ví dụ 1 — Xác định hydrocarbon từ phản ứng cháy',
      blocks: [
        {
          type: 'worked',
          problem: 'Đốt cháy hoàn toàn 0,1 mol hydrocarbon mạch hở X thu được 0,3 mol CO₂ và 0,2 mol H₂O. X làm mất màu nước bromine và tạo kết tủa với AgNO₃/NH₃. Xác định X.',
          steps: [
            'Số C = 0,3 / 0,1 = 3; số H = 2 × 0,2 / 0,1 = 4 ⇒ C₃H₄.',
            'n(H₂O) < n(CO₂) và C₃H₄ = CₙH₂ₙ₋₂ ⇒ alkyne (mạch hở).',
            'Tạo kết tủa với AgNO₃/NH₃ ⇒ có liên kết ba ở đầu mạch ⇒ CH≡C–CH₃ (propyne).'
          ],
          answer: 'X là propyne CH≡C–CH₃.'
        }
      ]
    },
    {
      id: 'example-addition',
      kind: 'example',
      title: 'Ví dụ 2 — Phản ứng cộng bromine',
      blocks: [
        {
          type: 'worked',
          problem: 'Một alkene X phản ứng vừa đủ với 16 g Br₂ tạo 21,6 g sản phẩm cộng. Xác định công thức phân tử của X (Br = 80).',
          steps: [
            'n(Br₂) = 16 / 160 = 0,1 mol ⇒ n(X) = 0,1 mol (alkene cộng 1 Br₂).',
            'Bảo toàn khối lượng: m(X) = 21,6 − 16 = 5,6 g ⇒ M(X) = 56.',
            'CₙH₂ₙ: 14n = 56 ⇒ n = 4 ⇒ C₄H₈.'
          ],
          answer: 'X là C₄H₈ (một butene).'
        }
      ]
    },
    {
      id: 'example-identify',
      kind: 'example',
      title: 'Ví dụ 3 — Nhận biết các khí',
      blocks: [
        {
          type: 'worked',
          problem: 'Nhận biết ba khí đựng trong ba bình riêng: methane, ethylene, acetylene.',
          steps: [
            'Dẫn từng khí qua dung dịch AgNO₃/NH₃: acetylene tạo kết tủa vàng nhạt.',
            'Hai khí còn lại dẫn qua nước bromine: ethylene làm mất màu.',
            'Khí không có hiện tượng là methane.'
          ],
          answer: 'AgNO₃/NH₃ nhận acetylene; nước bromine nhận ethylene; còn lại là methane.',
          equations: ['C₂H₂ + 2AgNO₃ + 2NH₃ → C₂Ag₂ + 2NH₄NO₃', 'C₂H₄ + Br₂ → C₂H₄Br₂']
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
          id: 'g11-l18-c1',
          question: 'Đốt cháy một hydrocarbon mạch hở thu được n(CO₂) = n(H₂O). Hydrocarbon đó là',
          options: [
            { id: 'a', text: 'alkane' },
            { id: 'b', text: 'alkene' },
            { id: 'c', text: 'alkyne' },
            { id: 'd', text: 'arene' }
          ],
          correct: 'b',
          explanation: 'CₙH₂ₙ cháy tạo n mol CO₂ và n mol H₂O.'
        },
        {
          type: 'quiz',
          id: 'g11-l18-c2',
          question: 'Chất nào vừa làm mất màu nước bromine, vừa tạo kết tủa với AgNO₃/NH₃?',
          options: [
            { id: 'a', text: 'Ethylene' },
            { id: 'b', text: 'Propyne' },
            { id: 'c', text: 'Benzene' },
            { id: 'd', text: 'Methane' }
          ],
          correct: 'b',
          explanation: 'Propyne CH≡C–CH₃ là alk-1-yne: có liên kết ba ở đầu mạch.'
        },
        {
          type: 'quiz',
          id: 'g11-l18-c3',
          question: 'Phản ứng đặc trưng của benzene là',
          options: [
            { id: 'a', text: 'cộng nước bromine ở nhiệt độ thường' },
            { id: 'b', text: 'thế với Br₂ khi có xúc tác FeBr₃' },
            { id: 'c', text: 'trùng hợp tạo polymer' },
            { id: 'd', text: 'làm mất màu KMnO₄ ở nhiệt độ thường' }
          ],
          correct: 'b',
          explanation: 'Vòng benzene bền nên dễ thế hơn cộng.'
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
            'Đốt cháy hydrocarbon mạch hở: n(H₂O) > n(CO₂) (alkane), = (alkene), < (alkyne).',
            'Bài toán cộng: n(alkene) = n(Br₂); n(alkyne) = n(Br₂)/2 khi cộng hoàn toàn.',
            'Nhận biết: AgNO₃/NH₃ (alk-1-yne), nước bromine (C=C, C≡C), KMnO₄ đun nóng (toluene).'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Mọi alkyne đều tạo kết tủa với AgNO₃/NH₃.', right: 'Chỉ **alk-1-yne** (H gắn trên C mang liên kết ba) mới tạo kết tủa; but-2-yne không phản ứng.' },
            { wrong: 'n(H₂O) < n(CO₂) chắc chắn là alkyne.', right: 'Arene cũng cho n(H₂O) < n(CO₂); cần thêm dữ kiện (mạch hở, phản ứng cộng…).' },
            { wrong: 'Alkyne cộng tối đa 1 mol Br₂.', right: 'Liên kết ba có 2 liên kết π nên cộng tối đa **2 mol Br₂**.' }
          ]
        },
        {
          type: 'p',
          text: 'Chương tiếp theo: **Dẫn xuất halogen – Alcohol – Phenol**.'
        }
      ]
    }
  ]
}
