// Hóa học 12 · Chương 2 · Bài 6 — Tinh bột và cellulose.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l6',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được cấu tạo, trạng thái tự nhiên, tính chất vật lí của tinh bột và cellulose.',
    'Trình bày được tính chất hóa học: thủy phân; phản ứng của tinh bột với iodine; phản ứng của cellulose với HNO₃ và với nước Schweizer.',
    'Trình bày được sự tạo thành tinh bột trong cây xanh (quang hợp) và ứng dụng của tinh bột, cellulose.'
  ],
  prerequisites: ['Bài 4 – 5: glucose, liên kết glycoside.'],
  sources: [
    programme('Carbohydrate'),
    textbook(12, 6)
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
          text: 'Hạt gạo chứa nhiều tinh bột, sợi bông gần như là cellulose nguyên chất. Cả hai đều được tạo thành từ glucose, nhưng con người tiêu hóa được tinh bột mà không tiêu hóa được cellulose. Cấu tạo của chúng khác nhau thế nào?'
        },
        {
          type: 'list',
          items: [
            'So sánh cấu tạo, tính chất vật lí của tinh bột và cellulose.',
            'Viết phản ứng thủy phân; nhận biết tinh bột bằng iodine.',
            'Nêu phản ứng của cellulose với HNO₃, nước Schweizer và ứng dụng.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Glucose có hai dạng vòng α và β.', 'Liên kết glycoside nối các gốc monosaccharide.'] }
      ]
    },
    {
      id: 'structure',
      kind: 'concept',
      title: 'Cấu tạo và tính chất vật lí',
      blocks: [
        {
          type: 'table',
          caption: 'So sánh tinh bột và cellulose (đều có công thức (C₆H₁₀O₅)ₙ)',
          head: ['', 'Tinh bột', 'Cellulose'],
          rows: [
            ['Mắt xích', 'α-glucose', 'β-glucose'],
            ['Cấu trúc', 'Amylose: mạch không phân nhánh (α-1,4), xoắn lò xo; amylopectin: mạch phân nhánh (α-1,4 và α-1,6)', 'Mạch không phân nhánh (β-1,4), duỗi thẳng, tạo sợi; mỗi mắt xích có 3 nhóm OH: [C₆H₇O₂(OH)₃]ₙ'],
            ['Tự nhiên', 'Hạt, củ, quả (gạo, ngô, khoai, sắn)', 'Thành tế bào thực vật (bông ~98%, gỗ ~40 – 50%)'],
            ['Tính chất vật lí', 'Chất rắn vô định hình, màu trắng, không tan trong nước lạnh; trong nước nóng tạo hồ tinh bột', 'Chất rắn dạng sợi, màu trắng, không tan trong nước và dung môi hữu cơ thông thường']
          ]
        }
      ]
    },
    {
      id: 'reactions',
      kind: 'concept',
      title: 'Tính chất hóa học',
      blocks: [
        { type: 'heading', text: 'Phản ứng thủy phân' },
        { type: 'equation', text: '(C₆H₁₀O₅)ₙ + nH₂O → nC₆H₁₂O₆', condition: 'H⁺, t° hoặc enzyme', note: 'Tinh bột và cellulose đều thủy phân hoàn toàn tạo glucose. Trong cơ thể, tinh bột bị thủy phân dần nhờ enzyme amylase, maltase.', check: false },
        { type: 'heading', text: 'Phản ứng màu của tinh bột với iodine' },
        {
          type: 'p',
          text: 'Hồ tinh bột tác dụng với dung dịch iodine tạo màu **xanh tím** (do iodine bị hấp phụ vào mạch xoắn của tinh bột). Đun nóng thì mất màu, để nguội màu xanh tím xuất hiện trở lại. Phản ứng dùng để nhận biết tinh bột hoặc iodine.'
        },
        { type: 'heading', text: 'Phản ứng của cellulose' },
        { type: 'equation', text: '[C₆H₇O₂(OH)₃]ₙ + 3nHNO₃ → [C₆H₇O₂(ONO₂)₃]ₙ + 3nH₂O', condition: 'H₂SO₄ đặc, t°', note: 'Cellulose trinitrate dễ cháy, nổ mạnh, dùng làm thuốc súng không khói.', check: false },
        {
          type: 'p',
          text: 'Cellulose tan trong **nước Schweizer** (dung dịch [Cu(NH₃)₄](OH)₂); tính chất này được dùng để sản xuất tơ nhân tạo (tơ đồng – ammonia). Cellulose còn là nguyên liệu sản xuất tơ visco, tơ acetate, giấy.'
        }
      ]
    },
    {
      id: 'photosynthesis',
      kind: 'concept',
      title: 'Sự tạo thành tinh bột và ứng dụng',
      blocks: [
        { type: 'equation', text: '6nCO₂ + 5nH₂O → (C₆H₁₀O₅)ₙ + 6nO₂', condition: 'ánh sáng, chlorophyll', note: 'Quá trình quang hợp trong cây xanh.', check: false },
        {
          type: 'list',
          items: [
            'Tinh bột: lương thực chính của con người; nguyên liệu sản xuất glucose, ethanol, hồ dán.',
            'Cellulose: sản xuất giấy, vải sợi (bông, lanh), tơ nhân tạo, thuốc súng không khói; ethanol sinh học từ phế phẩm nông nghiệp.'
          ]
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Sản xuất glucose và cellulose trinitrate',
      blocks: [
        {
          type: 'worked',
          problem: '(a) Thủy phân 324 kg tinh bột với hiệu suất 75%. Tính khối lượng glucose thu được. (b) Từ 162 kg cellulose sản xuất cellulose trinitrate với hiệu suất 90%. Tính khối lượng sản phẩm (C = 12, H = 1, O = 16, N = 14).',
          steps: [
            '(a) Mỗi mắt xích C₆H₁₀O₅ (M = 162) tạo 1 glucose: n = 324 / 162 = 2 kmol ⇒ m(glucose) = 2 × 75% × 180 = 270 kg.',
            '(b) n(mắt xích) = 162 / 162 = 1 kmol ⇒ 1 kmol mắt xích C₆H₇O₂(ONO₂)₃ (M = 297).',
            'm = 1 × 297 × 90% = 267,3 kg.'
          ],
          answer: '(a) 270 kg glucose; (b) 267,3 kg cellulose trinitrate.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: hồ tinh bột và iodine',
      blocks: [
        {
          type: 'p',
          text: 'Trong phòng thí nghiệm ảo, nhỏ dung dịch iodine vào hồ tinh bột và quan sát màu xanh tím.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Tinh bột và cellulose',
          text: 'Mở trong Phòng thí nghiệm ảo; quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'guided', grade: 12, lessonId: 'g12-l6', experimentId: 'g12-starch-iodine' }
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
          id: 'g12-l6-c1',
          question: 'Thuốc thử để nhận biết hồ tinh bột là',
          options: [
            { id: 'a', text: 'Cu(OH)₂' },
            { id: 'b', text: 'dung dịch iodine' },
            { id: 'c', text: 'thuốc thử Tollens' },
            { id: 'd', text: 'nước bromine' }
          ],
          correct: 'b',
          explanation: 'Tinh bột + iodine tạo màu xanh tím.'
        },
        {
          type: 'quiz',
          id: 'g12-l6-c2',
          question: 'Mắt xích của cellulose là gốc',
          options: [
            { id: 'a', text: 'α-glucose' },
            { id: 'b', text: 'β-glucose' },
            { id: 'c', text: 'α-fructose' },
            { id: 'd', text: 'β-fructose' }
          ],
          correct: 'b',
          explanation: 'Cellulose gồm các gốc β-glucose nối bằng liên kết β-1,4-glycoside.'
        },
        {
          type: 'quiz',
          id: 'g12-l6-c3',
          question: 'Cellulose trinitrate được dùng làm',
          options: [
            { id: 'a', text: 'thuốc súng không khói' },
            { id: 'b', text: 'thực phẩm' },
            { id: 'c', text: 'chất tạo ngọt' },
            { id: 'd', text: 'phân bón' }
          ],
          correct: 'a',
          explanation: 'Cellulose trinitrate dễ cháy, nổ mạnh.'
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
            'Tinh bột: α-glucose, gồm amylose (không nhánh) và amylopectin (phân nhánh); cellulose: β-glucose, mạch không nhánh, dạng sợi.',
            'Cả hai thủy phân hoàn toàn tạo glucose; tinh bột + iodine → xanh tím.',
            'Cellulose + HNO₃ → cellulose trinitrate (thuốc súng không khói); tan trong nước Schweizer.',
            'Tinh bột được tạo thành trong cây xanh nhờ quang hợp.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Tinh bột và cellulose là đồng phân vì cùng công thức (C₆H₁₀O₅)ₙ.', right: 'Giá trị **n khác nhau** và cấu tạo khác nhau nên không phải đồng phân.' },
            { wrong: 'Cellulose có phản ứng màu xanh tím với iodine.', right: 'Chỉ **tinh bột** (mạch xoắn) tạo màu xanh tím với iodine.' },
            { wrong: 'Mỗi mắt xích cellulose có 5 nhóm OH.', right: 'Mỗi mắt xích C₆H₁₀O₅ của cellulose có **3 nhóm OH**: [C₆H₇O₂(OH)₃]ₙ.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Ôn tập chương 2**.'
        }
      ]
    }
  ]
}
