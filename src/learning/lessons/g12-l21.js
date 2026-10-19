// Hóa học 12 · Chương 6 · Bài 21 — Hợp kim.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l21',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm hợp kim.',
    'So sánh được một số tính chất của hợp kim với kim loại thành phần.',
    'Nêu được thành phần, tính chất đặc trưng và ứng dụng của một số hợp kim phổ biến (gang, thép, thép không gỉ, duralumin…).'
  ],
  prerequisites: ['Bài 18 – 19: liên kết kim loại, tính chất vật lí của kim loại.'],
  sources: [
    programme('Đại cương về kim loại'),
    textbook(12, 21)
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
          text: 'Sắt nguyên chất khá mềm và dễ gỉ, nhưng dao inox lại cứng và sáng bóng nhiều năm. Nhôm nguyên chất mềm, nhưng vỏ máy bay làm từ hợp kim nhôm thì rất bền. Điều gì đã thay đổi?'
        },
        {
          type: 'list',
          items: [
            'Nêu khái niệm hợp kim.',
            'So sánh tính chất của hợp kim với kim loại thành phần.',
            'Nêu thành phần và ứng dụng của một số hợp kim.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Tính dẻo, dẫn điện của kim loại do electron tự do.', 'Fe dễ bị oxi hóa trong không khí ẩm.'] }
      ]
    },
    {
      id: 'definition',
      kind: 'concept',
      title: 'Khái niệm và tính chất của hợp kim',
      blocks: [
        {
          type: 'callout',
          title: 'Hợp kim',
          text: 'Là vật liệu kim loại có chứa một kim loại cơ bản và một số kim loại hoặc phi kim khác.'
        },
        {
          type: 'table',
          caption: 'So sánh hợp kim với kim loại thành phần (xu hướng chung)',
          head: ['Tính chất', 'Hợp kim so với kim loại thành phần'],
          rows: [
            ['Dẫn điện, dẫn nhiệt', 'Kém hơn (mật độ electron tự do giảm)'],
            ['Độ cứng', 'Thường cứng hơn'],
            ['Nhiệt độ nóng chảy', 'Thường thấp hơn'],
            ['Tính chất hóa học', 'Tương tự các đơn chất thành phần; nhiều hợp kim bền hơn với môi trường (ví dụ thép không gỉ)']
          ]
        }
      ]
    },
    {
      id: 'examples',
      kind: 'concept',
      title: 'Một số hợp kim phổ biến',
      blocks: [
        {
          type: 'table',
          caption: 'Thành phần và ứng dụng',
          head: ['Hợp kim', 'Thành phần chính', 'Đặc điểm, ứng dụng'],
          rows: [
            ['Gang', 'Fe, 2 – 5% C và một số nguyên tố khác', 'Cứng, giòn; đúc bệ máy, ống dẫn, luyện thép'],
            ['Thép', 'Fe, dưới 2% C và một số nguyên tố khác', 'Cứng, dẻo dai; xây dựng, chế tạo máy'],
            ['Thép không gỉ (inox)', 'Fe, Cr, Ni', 'Không gỉ; dụng cụ nhà bếp, y tế'],
            ['Duralumin', 'Al, Cu, Mn, Mg', 'Nhẹ, bền; công nghiệp hàng không, ô tô'],
            ['Đồng thau', 'Cu, Zn', 'Cứng hơn Cu, dễ gia công; chi tiết máy, nhạc cụ'],
            ['Vàng tây', 'Au, Ag, Cu', 'Cứng hơn vàng nguyên chất; trang sức']
          ]
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Xác định thành phần hợp kim',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho 10 g đồng thau (Cu – Zn) vào dung dịch HCl dư, thu được 1,2395 L H₂ (điều kiện chuẩn, 24,79 L/mol). Tính phần trăm khối lượng Zn trong hợp kim (Zn = 65).',
          steps: [
            'Chỉ Zn tác dụng với HCl: Zn + 2HCl → ZnCl₂ + H₂.',
            'n(H₂) = 1,2395 / 24,79 = 0,05 mol = n(Zn) ⇒ m(Zn) = 0,05 × 65 = 3,25 g.',
            '%m(Zn) = 3,25 / 10 × 100% = 32,5%.'
          ],
          answer: 'Hợp kim chứa 32,5% Zn về khối lượng.',
          equations: ['Zn + 2HCl → ZnCl₂ + H₂']
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
          id: 'g12-l21-c1',
          question: 'So với kim loại thành phần, hợp kim thường',
          options: [
            { id: 'a', text: 'dẫn điện tốt hơn' },
            { id: 'b', text: 'cứng hơn' },
            { id: 'c', text: 'có nhiệt độ nóng chảy cao hơn' },
            { id: 'd', text: 'mềm hơn' }
          ],
          correct: 'b',
          explanation: 'Hợp kim thường cứng hơn, dẫn điện kém hơn và nóng chảy ở nhiệt độ thấp hơn.'
        },
        {
          type: 'quiz',
          id: 'g12-l21-c2',
          question: 'Thép có hàm lượng carbon',
          options: [
            { id: 'a', text: 'dưới 2%' },
            { id: 'b', text: 'từ 2% đến 5%' },
            { id: 'c', text: 'trên 10%' },
            { id: 'd', text: 'bằng 0' }
          ],
          correct: 'a',
          explanation: 'Gang chứa 2 – 5% C; thép chứa dưới 2% C.'
        },
        {
          type: 'quiz',
          id: 'g12-l21-c3',
          question: 'Hợp kim dùng chế tạo thân máy bay nhờ nhẹ và bền là',
          options: [
            { id: 'a', text: 'gang' },
            { id: 'b', text: 'đồng thau' },
            { id: 'c', text: 'duralumin' },
            { id: 'd', text: 'vàng tây' }
          ],
          correct: 'c',
          explanation: 'Duralumin là hợp kim của nhôm.'
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
            'Hợp kim: kim loại cơ bản + kim loại hoặc phi kim khác.',
            'Thường cứng hơn, dẫn điện kém hơn, nóng chảy ở nhiệt độ thấp hơn kim loại thành phần.',
            'Gang (2 – 5% C), thép (< 2% C), inox (Fe – Cr – Ni), duralumin (Al – Cu – Mn – Mg), đồng thau (Cu – Zn).'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Hợp kim dẫn điện tốt hơn kim loại nguyên chất.', right: 'Hợp kim thường **dẫn điện kém hơn**; dây điện dùng đồng tinh khiết.' },
            { wrong: 'Gang chứa ít carbon hơn thép.', right: 'Gang chứa **2 – 5% C**, thép chứa **dưới 2% C**.' },
            { wrong: 'Cho đồng thau vào HCl dư thì cả Cu và Zn đều tan.', right: 'Chỉ **Zn** tan; Cu không tác dụng với HCl.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Sự ăn mòn kim loại**.'
        }
      ]
    }
  ]
}
