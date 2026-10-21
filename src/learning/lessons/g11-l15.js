// Hóa học 11 · Chương 4 · Bài 15 — Alkane.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l15',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm hydrocarbon, alkane; công thức chung, đồng phân và danh pháp (IUPAC, tên thông thường) của alkane mạch không nhánh C1 – C10 và một số alkane mạch nhánh.',
    'Trình bày được đặc điểm cấu tạo và tính chất vật lí của alkane.',
    'Trình bày được tính chất hóa học của alkane: phản ứng thế halogen, cracking, reforming, phản ứng oxi hóa (cháy).',
    'Trình bày được ứng dụng của alkane và vấn đề ô nhiễm môi trường do khí thải động cơ.'
  ],
  prerequisites: [
    'Bài 13: cấu tạo hóa học, đồng đẳng, đồng phân.',
    'Hóa 10: liên kết σ; phản ứng tỏa nhiệt.'
  ],
  sources: [
    programme('Alkane'),
    textbook(11, 15)
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
          text: 'Khí gas trong bình gas nấu ăn, xăng trong xe máy và nến paraffin thắp sáng đều chủ yếu là alkane. Cùng một loại hydrocarbon nhưng có chất là khí, có chất là lỏng, có chất là rắn. Alkane có cấu tạo và tính chất ra sao?'
        },
        {
          type: 'list',
          items: [
            'Viết công thức chung, gọi tên alkane.',
            'Giải thích tính chất vật lí theo số nguyên tử C.',
            'Viết phản ứng thế halogen, cracking, reforming, đốt cháy.',
            'Liên hệ nhiên liệu và ô nhiễm khí thải.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Đồng đẳng hơn kém CH₂.', 'Liên kết đơn là liên kết σ bền.'] }
      ]
    },
    {
      id: 'structure',
      kind: 'concept',
      title: 'Khái niệm, cấu tạo và danh pháp',
      blocks: [
        {
          type: 'callout',
          title: 'Alkane',
          text: 'Là **hydrocarbon no, mạch hở**, phân tử chỉ có liên kết đơn. Công thức chung **CₙH₂ₙ₊₂** (n ≥ 1). Mỗi nguyên tử C tạo 4 liên kết σ hướng về 4 đỉnh của hình tứ diện (góc liên kết khoảng 109,5°).'
        },
        {
          type: 'table',
          caption: 'Tên mười alkane mạch không nhánh đầu tiên',
          head: ['n', 'Công thức', 'Tên', 'n', 'Công thức', 'Tên'],
          rows: [
            ['1', 'CH₄', 'methane', '6', 'C₆H₁₄', 'hexane'],
            ['2', 'C₂H₆', 'ethane', '7', 'C₇H₁₆', 'heptane'],
            ['3', 'C₃H₈', 'propane', '8', 'C₈H₁₈', 'octane'],
            ['4', 'C₄H₁₀', 'butane', '9', 'C₉H₂₀', 'nonane'],
            ['5', 'C₅H₁₂', 'pentane', '10', 'C₁₀H₂₂', 'decane']
          ]
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Chọn mạch carbon dài nhất làm mạch chính.',
            'Đánh số mạch chính từ đầu gần nhánh hơn.',
            'Tên = số chỉ vị trí nhánh – tên nhánh + tên mạch chính (nhiều nhánh giống nhau thêm di-, tri-…).'
          ]
        },
        {
          type: 'p',
          text: 'Ví dụ: CH₃–CH(CH₃)–CH₂–CH₃ là **2-methylbutane**; (CH₃)₄C là **2,2-dimethylpropane**. Gốc alkyl: CH₃– (methyl), C₂H₅– (ethyl).'
        }
      ]
    },
    {
      id: 'physical',
      kind: 'concept',
      title: 'Tính chất vật lí',
      blocks: [
        {
          type: 'list',
          items: [
            'Ở điều kiện thường: C1 – C4 là chất khí; C5 – khoảng C17 là chất lỏng; từ khoảng C18 trở lên là chất rắn.',
            'Nhiệt độ sôi tăng khi số nguyên tử C tăng (tương tác van der Waals mạnh hơn); với cùng số C, alkane mạch nhánh sôi thấp hơn mạch không nhánh.',
            'Không tan trong nước, nhẹ hơn nước; tan tốt trong dung môi hữu cơ.'
          ]
        }
      ]
    },
    {
      id: 'reactions',
      kind: 'concept',
      title: 'Tính chất hóa học',
      blocks: [
        {
          type: 'p',
          text: 'Alkane chỉ có liên kết σ bền nên ở nhiệt độ thường khá trơ; khi chiếu sáng hoặc đun nóng mới tham gia phản ứng thế, tách và cháy.'
        },
        { type: 'heading', text: 'Phản ứng thế halogen' },
        { type: 'equation', text: 'CH₄ + Cl₂ → CH₃Cl + HCl', condition: 'ánh sáng', note: 'Nguyên tử H được thay thế bằng nguyên tử Cl; có thể thế tiếp tạo CH₂Cl₂, CHCl₃, CCl₄.' },
        {
          type: 'p',
          text: 'Với alkane có từ 3 nguyên tử C trở lên, phản ứng thế tạo hỗn hợp sản phẩm; nguyên tử H ở carbon bậc cao hơn dễ bị thế hơn. Ví dụ propane tạo cả 1-chloropropane và 2-chloropropane.'
        },
        { type: 'heading', text: 'Phản ứng cracking và reforming' },
        { type: 'equation', text: 'C₄H₁₀ → CH₄ + C₃H₆', condition: 't°, xúc tác', note: 'Cracking: bẻ gãy mạch dài thành alkane và alkene mạch ngắn hơn.' },
        { type: 'equation', text: 'C₄H₁₀ → C₂H₆ + C₂H₄', condition: 't°, xúc tác' },
        { type: 'equation', text: 'C₆H₁₄ → C₆H₆ + 4H₂', condition: 't°, xúc tác', note: 'Reforming: chuyển alkane mạch thẳng thành hydrocarbon mạch nhánh, mạch vòng (arene) để tăng chất lượng xăng.' },
        { type: 'heading', text: 'Phản ứng cháy' },
        { type: 'equation', text: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O', condition: 't°' },
        {
          type: 'p',
          text: 'Tổng quát: CₙH₂ₙ₊₂ + (3n + 1)/2 O₂ → nCO₂ + (n + 1)H₂O. Khi đốt cháy alkane: n(H₂O) > n(CO₂) và n(alkane) = n(H₂O) − n(CO₂).'
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Đốt cháy alkane',
      blocks: [
        {
          type: 'worked',
          problem: 'Đốt cháy hoàn toàn một alkane X thu được 6,6 g CO₂ và 3,6 g H₂O. Xác định công thức phân tử và gọi tên X (C = 12, H = 1, O = 16).',
          steps: [
            'n(CO₂) = 6,6 / 44 = 0,15 mol; n(H₂O) = 3,6 / 18 = 0,2 mol.',
            'n(X) = n(H₂O) − n(CO₂) = 0,2 − 0,15 = 0,05 mol.',
            'Số nguyên tử C = 0,15 / 0,05 = 3 ⇒ X là C₃H₈.'
          ],
          answer: 'X là C₃H₈ (propane), thành phần chính của khí hóa lỏng (LPG) cùng với butane.'
        }
      ]
    },
    {
      id: 'uses',
      kind: 'concept',
      title: 'Ứng dụng và vấn đề môi trường',
      blocks: [
        {
          type: 'table',
          caption: 'Alkane trong đời sống',
          head: ['Nguồn / sản phẩm', 'Thành phần chính', 'Ứng dụng'],
          rows: [
            ['Khí thiên nhiên', 'Methane', 'Nhiên liệu, sản xuất phân bón'],
            ['Khí hóa lỏng (LPG)', 'Propane, butane', 'Nhiên liệu đun nấu'],
            ['Xăng, dầu diesel', 'Alkane C5 – C20 (và các hydrocarbon khác)', 'Nhiên liệu động cơ'],
            ['Paraffin', 'Alkane rắn', 'Nến, chất chống thấm']
          ]
        },
        {
          type: 'p',
          text: 'Khi thiếu oxygen, alkane cháy không hoàn toàn tạo CO (rất độc) và muội than. Khí thải động cơ còn chứa NOₓ, hydrocarbon chưa cháy gây ô nhiễm; bộ chuyển đổi xúc tác giúp giảm các khí này.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Quan sát phân tử methane',
      blocks: [
        {
          type: 'p',
          text: 'Mở Compound Studio, nhập CH4 và xem mô hình 3D: bốn liên kết C–H hướng về bốn đỉnh của hình tứ diện đều.'
        },
        {
          type: 'activity',
          title: 'Công cụ — Compound Studio',
          text: 'Quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'tool', tool: 'compound' }
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
          id: 'g11-l15-c1',
          question: 'Công thức chung của alkane là',
          options: [
            { id: 'a', text: 'CₙH₂ₙ' },
            { id: 'b', text: 'CₙH₂ₙ₊₂' },
            { id: 'c', text: 'CₙH₂ₙ₋₂' },
            { id: 'd', text: 'CₙH₂ₙ₋₆' }
          ],
          correct: 'b',
          explanation: 'Alkane no, mạch hở: CₙH₂ₙ₊₂ (n ≥ 1).'
        },
        {
          type: 'quiz',
          id: 'g11-l15-c2',
          question: 'Tên của CH₃–CH(CH₃)–CH₂–CH₃ là',
          options: [
            { id: 'a', text: 'pentane' },
            { id: 'b', text: '2-methylbutane' },
            { id: 'c', text: '3-methylbutane' },
            { id: 'd', text: '2-ethylpropane' }
          ],
          correct: 'b',
          explanation: 'Mạch chính 4 C (butane), nhánh methyl ở C2 khi đánh số từ đầu gần nhánh.'
        },
        {
          type: 'quiz',
          id: 'g11-l15-c3',
          question: 'Phản ứng đặc trưng của alkane với chlorine khi chiếu sáng là phản ứng',
          options: [
            { id: 'a', text: 'cộng' },
            { id: 'b', text: 'thế' },
            { id: 'c', text: 'trùng hợp' },
            { id: 'd', text: 'trung hòa' }
          ],
          correct: 'b',
          explanation: 'Nguyên tử H bị thay thế bởi nguyên tử Cl: CH₄ + Cl₂ → CH₃Cl + HCl.'
        },
        {
          type: 'quiz',
          id: 'g11-l15-c4',
          question: 'Đốt cháy alkane luôn cho',
          options: [
            { id: 'a', text: 'n(H₂O) > n(CO₂)' },
            { id: 'b', text: 'n(H₂O) = n(CO₂)' },
            { id: 'c', text: 'n(H₂O) < n(CO₂)' },
            { id: 'd', text: 'chỉ có CO₂' }
          ],
          correct: 'a',
          explanation: 'CₙH₂ₙ₊₂ tạo n mol CO₂ và (n + 1) mol H₂O.'
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
            'Alkane CₙH₂ₙ₊₂: no, mạch hở, chỉ có liên kết σ; tên kết thúc bằng -ane.',
            'C1 – C4 khí; nhiệt độ sôi tăng theo số C; không tan trong nước.',
            'Phản ứng: thế halogen (ánh sáng), cracking, reforming, cháy (tỏa nhiều nhiệt).',
            'Đốt cháy: n(alkane) = n(H₂O) − n(CO₂).'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Đánh số mạch chính từ đầu bất kì: gọi CH₃CH(CH₃)CH₂CH₃ là 3-methylbutane.', right: 'Đánh số từ đầu **gần nhánh hơn**: 2-methylbutane.' },
            { wrong: 'Alkane làm mất màu nước bromine.', right: 'Alkane chỉ có liên kết đơn, **không** cộng bromine; hydrocarbon không no mới làm mất màu.' },
            { wrong: 'Alkane cháy luôn tạo CO₂ và H₂O.', right: 'Khi **thiếu oxygen** tạo thêm CO độc và muội than.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Hydrocarbon không no** — alkene và alkyne.'
        }
      ]
    }
  ]
}
