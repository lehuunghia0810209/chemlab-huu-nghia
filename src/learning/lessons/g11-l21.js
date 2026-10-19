// Hóa học 11 · Chương 5 · Bài 21 — Phenol.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l21',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm phenol; viết được công thức cấu tạo của phenol đơn giản (C₆H₅OH).',
    'Nêu được tính chất vật lí của phenol.',
    'Trình bày được tính chất hóa học: tính acid yếu (phản ứng với NaOH, Na₂CO₃; bị CO₂ đẩy ra khỏi muối), phản ứng thế ở vòng benzene (với nước bromine, HNO₃); giải thích ảnh hưởng qua lại giữa nhóm −OH và vòng benzene.',
    'Trình bày được ứng dụng và phương pháp điều chế phenol; tác hại của phenol.'
  ],
  prerequisites: [
    'Bài 17: arene, phản ứng thế ở vòng benzene.',
    'Bài 20: nhóm −OH của alcohol.'
  ],
  sources: [
    programme('Phenol'),
    textbook(11, 21)
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
          text: 'Phenol và ethanol đều có nhóm −OH, nhưng phenol tác dụng được với NaOH còn ethanol thì không; phenol lại làm mất màu nước bromine dễ hơn benzene rất nhiều. Vì sao cùng nhóm −OH mà tính chất khác nhau như vậy?'
        },
        {
          type: 'list',
          items: [
            'Phân biệt phenol với alcohol thơm.',
            'Viết phản ứng thể hiện tính acid yếu của phenol.',
            'Viết phản ứng thế bromine, nitro ở vòng benzene.',
            'Giải thích ảnh hưởng qua lại giữa nhóm −OH và vòng benzene.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Benzene thế bromine cần xúc tác FeBr₃.', 'Alcohol không tác dụng với dung dịch NaOH.'] }
      ]
    },
    {
      id: 'definition',
      kind: 'concept',
      title: 'Khái niệm và tính chất vật lí',
      blocks: [
        {
          type: 'callout',
          title: 'Phenol',
          text: 'Là hợp chất hữu cơ có nhóm −OH liên kết **trực tiếp với nguyên tử carbon của vòng benzene**. Chất đơn giản nhất là C₆H₅OH, cũng gọi là phenol.'
        },
        {
          type: 'p',
          text: 'Lưu ý: C₆H₅CH₂OH (benzyl alcohol) có nhóm −OH gắn vào C no của mạch nhánh nên là **alcohol thơm**, không phải phenol.'
        },
        {
          type: 'list',
          items: [
            'Phenol là chất rắn, không màu, nóng chảy ở 43 °C; để lâu ngoài không khí bị oxi hóa chuyển màu hồng.',
            'Ít tan trong nước lạnh, tan nhiều trong nước nóng và dung môi hữu cơ.',
            'Phenol **độc**, gây bỏng nặng khi tiếp xúc với da.'
          ]
        }
      ]
    },
    {
      id: 'acid',
      kind: 'concept',
      title: 'Tính acid yếu',
      blocks: [
        {
          type: 'p',
          text: 'Vòng benzene hút electron làm liên kết O–H phân cực mạnh hơn trong alcohol, nên phenol có tính acid yếu (không làm đổi màu quỳ tím).'
        },
        { type: 'equation', text: 'C₆H₅OH + NaOH → C₆H₅ONa + H₂O', note: 'Phenol tan trong dung dịch NaOH tạo sodium phenolate.' },
        { type: 'equation', text: '2C₆H₅OH + 2Na → 2C₆H₅ONa + H₂', note: 'Như alcohol, phenol cũng phản ứng với Na.' },
        { type: 'equation', text: 'C₆H₅OH + Na₂CO₃ → C₆H₅ONa + NaHCO₃' },
        { type: 'equation', text: 'C₆H₅ONa + CO₂ + H₂O → C₆H₅OH + NaHCO₃', note: 'Dung dịch vẩn đục do phenol tách ra: tính acid của phenol yếu hơn carbonic acid.' }
      ]
    },
    {
      id: 'ring',
      kind: 'concept',
      title: 'Phản ứng thế ở vòng benzene',
      blocks: [
        {
          type: 'p',
          text: 'Nhóm −OH đẩy electron vào vòng, làm các vị trí ortho và para giàu electron, nên phenol thế dễ hơn benzene: không cần xúc tác và thế đồng thời 3 nguyên tử H.'
        },
        { type: 'equation', text: 'C₆H₅OH + 3Br₂ → C₆H₂Br₃OH + 3HBr', note: 'Nước bromine mất màu, tạo kết tủa trắng 2,4,6-tribromophenol: dùng nhận biết phenol.' },
        { type: 'equation', text: 'C₆H₅OH + 3HNO₃ → C₆H₂(NO₂)₃OH + 3H₂O', condition: 'H₂SO₄ đặc', note: 'Tạo picric acid (2,4,6-trinitrophenol) màu vàng.' },
        {
          type: 'table',
          caption: 'Ảnh hưởng qua lại giữa nhóm −OH và vòng benzene',
          head: ['Ảnh hưởng', 'Hệ quả'],
          rows: [
            ['Vòng benzene → nhóm −OH', 'Liên kết O–H phân cực hơn ⇒ phenol có tính acid, phản ứng với NaOH (alcohol không).'],
            ['Nhóm −OH → vòng benzene', 'Vòng giàu electron ở vị trí o, p ⇒ thế bromine dễ hơn benzene, không cần xúc tác.']
          ]
        }
      ]
    },
    {
      id: 'uses',
      kind: 'concept',
      title: 'Ứng dụng và điều chế',
      blocks: [
        {
          type: 'list',
          items: [
            'Nguyên liệu sản xuất nhựa phenol-formaldehyde, phẩm nhuộm, thuốc nổ (picric acid), chất diệt nấm mốc, chất sát trùng.',
            'Điều chế trong công nghiệp chủ yếu từ cumene (isopropylbenzene), đồng thời thu được acetone; ngoài ra tách từ nhựa than đá.'
          ]
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Phản ứng với nước bromine',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho dung dịch chứa 4,7 g phenol tác dụng với nước bromine dư. Tính khối lượng kết tủa 2,4,6-tribromophenol thu được (C = 12, H = 1, O = 16, Br = 80).',
          steps: [
            'n(C₆H₅OH) = 4,7 / 94 = 0,05 mol.',
            'C₆H₅OH + 3Br₂ → C₆H₂Br₃OH + 3HBr ⇒ n(kết tủa) = 0,05 mol.',
            'M(C₆H₂Br₃OH) = 6 × 12 + 3 × 1 + 3 × 80 + 16 = 331 ⇒ m = 0,05 × 331 = 16,55 g.'
          ],
          answer: 'Thu được 16,55 g kết tủa trắng.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: phenol và FeCl₃',
      blocks: [
        {
          type: 'p',
          text: 'Trong phòng thí nghiệm ảo, nhỏ dung dịch FeCl₃ vào dung dịch phenol và quan sát màu tím đặc trưng — một thuốc thử khác để nhận biết phenol.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Phenol',
          text: 'Mở trong Phòng thí nghiệm ảo; quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'guided', grade: 11, lessonId: 'g11-l21', experimentId: 'g11-phenol-fecl3' }
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
          id: 'g11-l21-c1',
          question: 'Chất nào thuộc loại phenol?',
          options: [
            { id: 'a', text: 'C₆H₅CH₂OH' },
            { id: 'b', text: 'CH₃C₆H₄OH' },
            { id: 'c', text: 'C₆H₁₁OH (cyclohexanol)' },
            { id: 'd', text: 'C₂H₅OH' }
          ],
          correct: 'b',
          explanation: 'Trong cresol CH₃C₆H₄OH, nhóm −OH gắn trực tiếp vào vòng benzene; C₆H₅CH₂OH là alcohol thơm.'
        },
        {
          type: 'quiz',
          id: 'g11-l21-c2',
          question: 'Thổi CO₂ vào dung dịch sodium phenolate thấy dung dịch vẩn đục. Điều đó chứng tỏ',
          options: [
            { id: 'a', text: 'phenol có tính base' },
            { id: 'b', text: 'phenol có tính acid yếu hơn carbonic acid' },
            { id: 'c', text: 'phenol có tính acid mạnh hơn carbonic acid' },
            { id: 'd', text: 'CO₂ oxi hóa phenol' }
          ],
          correct: 'b',
          explanation: 'Acid mạnh hơn (H₂CO₃) đẩy acid yếu hơn (phenol) ra khỏi muối.'
        },
        {
          type: 'quiz',
          id: 'g11-l21-c3',
          question: 'Phenol phản ứng với nước bromine dễ hơn benzene là do',
          options: [
            { id: 'a', text: 'vòng benzene làm tăng độ phân cực của O–H' },
            { id: 'b', text: 'nhóm −OH làm tăng mật độ electron trong vòng benzene' },
            { id: 'c', text: 'phenol tan tốt trong nước' },
            { id: 'd', text: 'phenol có phân tử khối lớn hơn' }
          ],
          correct: 'b',
          explanation: 'Đây là ảnh hưởng của nhóm −OH lên vòng; ý (a) giải thích tính acid.'
        },
        {
          type: 'quiz',
          id: 'g11-l21-c4',
          question: 'Thuốc thử dùng phân biệt phenol và ethanol là',
          options: [
            { id: 'a', text: 'Na' },
            { id: 'b', text: 'nước bromine' },
            { id: 'c', text: 'quỳ tím' },
            { id: 'd', text: 'Cu(OH)₂' }
          ],
          correct: 'b',
          explanation: 'Phenol tạo kết tủa trắng với nước bromine; cả hai chất đều phản ứng với Na và không làm đổi màu quỳ tím.'
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
            'Phenol: −OH gắn trực tiếp vào vòng benzene; chất rắn, độc, ít tan trong nước lạnh.',
            'Tính acid yếu: tác dụng với Na, NaOH, Na₂CO₃; yếu hơn H₂CO₃, không làm đổi màu quỳ tím.',
            'Thế dễ ở vòng: với nước bromine tạo kết tủa trắng 2,4,6-tribromophenol; với HNO₃ tạo picric acid.',
            'Ảnh hưởng qua lại giữa −OH và vòng benzene giải thích khác biệt với alcohol và benzene.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'C₆H₅CH₂OH là phenol vì có vòng benzene và nhóm OH.', right: 'Nhóm −OH phải gắn **trực tiếp** vào C của vòng; C₆H₅CH₂OH là alcohol thơm.' },
            { wrong: 'Phenol có tính acid nên làm quỳ tím hóa đỏ.', right: 'Tính acid của phenol **rất yếu**, không làm đổi màu quỳ tím.' },
            { wrong: 'Phenol thế bromine cần xúc tác FeBr₃ như benzene.', right: 'Phenol thế với **nước bromine** ngay ở nhiệt độ thường, không cần xúc tác, tạo sản phẩm thế 3 lần.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Ôn tập chương 5**.'
        }
      ]
    }
  ]
}
