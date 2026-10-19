// Hóa học 12 · Chương 1 · Bài 2 — Xà phòng và chất giặt rửa.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l2',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm, đặc điểm cấu tạo của xà phòng và chất giặt rửa tổng hợp.',
    'Trình bày được cơ chế hoạt động của xà phòng và chất giặt rửa.',
    'Trình bày được phương pháp sản xuất xà phòng, chất giặt rửa tổng hợp; ưu, nhược điểm và cách sử dụng hợp lí, bảo vệ môi trường.'
  ],
  prerequisites: ['Bài 1: chất béo và phản ứng xà phòng hóa.'],
  sources: [
    programme('Xà phòng và chất giặt rửa'),
    textbook(12, 2)
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
          text: 'Chỉ rửa bằng nước không thể làm sạch vết dầu mỡ trên tay, nhưng thêm một chút xà phòng thì dầu mỡ trôi đi dễ dàng. Còn ở vùng nước cứng, xà phòng lại ít bọt và để lại cặn. Xà phòng hoạt động như thế nào?'
        },
        {
          type: 'list',
          items: [
            'Mô tả cấu tạo phân tử xà phòng và chất giặt rửa tổng hợp.',
            'Giải thích cơ chế làm sạch vết bẩn dầu mỡ.',
            'So sánh xà phòng với chất giặt rửa tổng hợp; sử dụng hợp lí, bảo vệ môi trường.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Chất béo + NaOH → muối của acid béo + glycerol.', 'Nước cứng chứa nhiều ion Ca²⁺, Mg²⁺.'] }
      ]
    },
    {
      id: 'structure',
      kind: 'concept',
      title: 'Khái niệm và cấu tạo',
      blocks: [
        {
          type: 'callout',
          title: 'Xà phòng',
          text: 'Là hỗn hợp muối sodium hoặc potassium của các acid béo, có thêm một số chất phụ gia (chất tạo màu, chất tạo hương…). Ví dụ C₁₇H₃₅COONa (sodium stearate), C₁₅H₃₁COONa (sodium palmitate).'
        },
        {
          type: 'callout',
          title: 'Chất giặt rửa tổng hợp',
          text: 'Là những hợp chất không phải muối của acid béo nhưng có khả năng giặt rửa như xà phòng, ví dụ sodium dodecylbenzenesulfonate C₁₂H₂₅C₆H₄SO₃Na, sodium lauryl sulfate C₁₂H₂₅OSO₃Na.'
        },
        {
          type: 'table',
          caption: 'Hai phần của phân tử chất giặt rửa',
          head: ['Phần', 'Ví dụ', 'Tính chất'],
          rows: [
            ['Đầu ưa nước (phân cực)', '−COO⁻Na⁺, −SO₃⁻Na⁺, −OSO₃⁻Na⁺', 'Tan tốt trong nước'],
            ['Đuôi kị nước (không phân cực)', 'Gốc hydrocarbon dài như C₁₇H₃₅−', 'Tan tốt trong dầu mỡ']
          ]
        }
      ]
    },
    {
      id: 'mechanism',
      kind: 'concept',
      title: 'Cơ chế giặt rửa',
      blocks: [
        {
          type: 'list',
          ordered: true,
          items: [
            'Đuôi kị nước thâm nhập vào vết bẩn dầu mỡ, đầu ưa nước hướng ra ngoài, quay vào nước.',
            'Dưới tác dụng cơ học (vò, khuấy), vết bẩn bị chia nhỏ thành các hạt rất nhỏ được bao bọc bởi các phân tử xà phòng.',
            'Các hạt này phân tán vào nước và bị rửa trôi.'
          ]
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Với nước cứng',
          text: 'Xà phòng tạo kết tủa với ion Ca²⁺, Mg²⁺ nên giảm tác dụng giặt rửa và để lại cặn trên vải. Chất giặt rửa tổng hợp không tạo kết tủa nên dùng được với nước cứng.'
        },
        { type: 'equation', text: '2C₁₇H₃₅COO⁻ + Ca²⁺ → (C₁₇H₃₅COO)₂Ca', note: 'Kết tủa calcium stearate (cặn xà phòng).' }
      ]
    },
    {
      id: 'production',
      kind: 'concept',
      title: 'Sản xuất và sử dụng hợp lí',
      blocks: [
        {
          type: 'table',
          caption: 'So sánh',
          head: ['', 'Xà phòng', 'Chất giặt rửa tổng hợp'],
          rows: [
            ['Nguyên liệu', 'Chất béo (dầu thực vật, mỡ động vật) + NaOH/KOH', 'Chủ yếu từ sản phẩm dầu mỏ'],
            ['Với nước cứng', 'Tạo kết tủa, giảm tác dụng', 'Không tạo kết tủa'],
            ['Phân hủy sinh học', 'Dễ bị vi sinh vật phân hủy', 'Loại có mạch phân nhánh khó phân hủy, gây ô nhiễm']
          ]
        },
        { type: 'equation', text: '(C₁₇H₃₅COO)₃C₃H₅ + 3NaOH → 3C₁₇H₃₅COONa + C₃H₅(OH)₃', condition: 't°', note: 'Xà phòng hóa chất béo; sau đó thêm NaCl để tách xà phòng ra khỏi dung dịch.' },
        {
          type: 'list',
          items: [
            'Dùng lượng vừa đủ theo hướng dẫn, ưu tiên sản phẩm dễ phân hủy sinh học (mạch hydrocarbon không phân nhánh).',
            'Không thải trực tiếp nước giặt chứa nhiều chất giặt rửa ra ao hồ; đeo găng tay khi dùng chất tẩy rửa mạnh.'
          ]
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Sản xuất xà phòng',
      blocks: [
        {
          type: 'worked',
          problem: 'Xà phòng hóa hoàn toàn 89 kg tristearin bằng NaOH. Toàn bộ sodium stearate tạo thành dùng làm xà phòng chứa 72% sodium stearate về khối lượng. Tính khối lượng xà phòng thu được (C = 12, H = 1, O = 16, Na = 23).',
          steps: [
            'M(tristearin) = 890 ⇒ n = 89 / 890 = 0,1 kmol ⇒ n(C₁₇H₃₅COONa) = 0,3 kmol.',
            'M(C₁₇H₃₅COONa) = 306 ⇒ m = 0,3 × 306 = 91,8 kg.',
            'm(xà phòng) = 91,8 / 72% = 127,5 kg.'
          ],
          answer: 'Thu được 127,5 kg xà phòng.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: xà phòng hóa chất béo',
      blocks: [
        {
          type: 'p',
          text: 'Trong phòng thí nghiệm ảo, đun dầu thực vật với dung dịch NaOH, quan sát hỗn hợp chuyển dần thành khối đồng nhất.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Xà phòng và chất giặt rửa',
          text: 'Mở trong Phòng thí nghiệm ảo; quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'guided', grade: 12, lessonId: 'g12-l2', experimentId: 'g12-lesson-02' }
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
          id: 'g12-l2-c1',
          question: 'Thành phần chính của xà phòng là',
          options: [
            { id: 'a', text: 'muối sodium hoặc potassium của acid béo' },
            { id: 'b', text: 'glycerol' },
            { id: 'c', text: 'ester của acid béo' },
            { id: 'd', text: 'sodium dodecylbenzenesulfonate' }
          ],
          correct: 'a',
          explanation: 'Sodium dodecylbenzenesulfonate là chất giặt rửa tổng hợp.'
        },
        {
          type: 'quiz',
          id: 'g12-l2-c2',
          question: 'Trong cơ chế giặt rửa, phần nào của phân tử xà phòng thâm nhập vào vết dầu mỡ?',
          options: [
            { id: 'a', text: 'Nhóm −COO⁻Na⁺' },
            { id: 'b', text: 'Gốc hydrocarbon dài' },
            { id: 'c', text: 'Ion Na⁺' },
            { id: 'd', text: 'Cả phân tử tan vào nước' }
          ],
          correct: 'b',
          explanation: 'Đuôi hydrocarbon kị nước nhưng ưa dầu mỡ.'
        },
        {
          type: 'quiz',
          id: 'g12-l2-c3',
          question: 'Ưu điểm của chất giặt rửa tổng hợp so với xà phòng là',
          options: [
            { id: 'a', text: 'luôn dễ bị phân hủy sinh học hơn' },
            { id: 'b', text: 'dùng được với nước cứng' },
            { id: 'c', text: 'được sản xuất từ chất béo' },
            { id: 'd', text: 'không có phần kị nước' }
          ],
          correct: 'b',
          explanation: 'Chất giặt rửa tổng hợp không tạo kết tủa với Ca²⁺, Mg²⁺.'
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
            'Xà phòng: muối Na/K của acid béo; chất giặt rửa tổng hợp: muối sulfonate, sulfate có gốc hydrocarbon dài.',
            'Phân tử có đầu ưa nước và đuôi kị nước; đuôi bám vào dầu mỡ, đầu hướng ra nước, vết bẩn bị chia nhỏ và rửa trôi.',
            'Xà phòng kém tác dụng trong nước cứng; chất giặt rửa tổng hợp dùng được nhưng loại mạch nhánh khó phân hủy sinh học.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Xà phòng làm sạch vì phản ứng hóa học với dầu mỡ.', right: 'Xà phòng làm sạch nhờ **hoạt động bề mặt**: chia nhỏ và phân tán vết bẩn, không phản ứng với dầu mỡ.' },
            { wrong: 'Đầu ưa nước của xà phòng bám vào vết bẩn.', right: '**Đuôi kị nước** (gốc hydrocarbon) bám vào dầu mỡ; đầu ưa nước hướng ra nước.' },
            { wrong: 'Chất giặt rửa tổng hợp luôn thân thiện môi trường hơn xà phòng.', right: 'Loại có **mạch phân nhánh** khó bị phân hủy sinh học, gây ô nhiễm nguồn nước.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Ôn tập chương 1**.'
        }
      ]
    }
  ]
}
