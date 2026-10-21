// Hóa học 12 · Chương 8 · Bài 30 — Ôn tập chương 8 (Kim loại chuyển tiếp dãy thứ nhất và phức chất).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l30',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa cấu hình electron, tính chất của kim loại chuyển tiếp dãy thứ nhất và kiến thức về phức chất.',
    'Vận dụng để nhận biết ion, phân tích phức chất và giải bài toán chuẩn độ.'
  ],
  prerequisites: ['Bài 27 – 29 của chương 8.'],
  sources: [
    programme('Kim loại chuyển tiếp dãy thứ nhất và phức chất'),
    textbook(12, 30)
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
          text: 'Chỉ với dung dịch NaOH, NH₃ và KSCN, em có phân biệt được các dung dịch chứa Fe²⁺, Fe³⁺, Cu²⁺ không?'
        },
        {
          type: 'list',
          items: [
            'Tổng hợp kiến thức chương 8.',
            'Nhận biết ion kim loại chuyển tiếp.',
            'Phân tích phức chất và giải bài toán chuẩn độ.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 8',
      blocks: [
        {
          type: 'table',
          caption: 'Nhận biết một số ion',
          head: ['Ion', 'Với NaOH', 'Với NH₃ dư', 'Thuốc thử đặc trưng'],
          rows: [
            ['Fe²⁺', 'Kết tủa trắng xanh, hóa nâu đỏ trong không khí', 'Kết tủa Fe(OH)₂', 'Làm mất màu tím của KMnO₄/H⁺'],
            ['Fe³⁺', 'Kết tủa nâu đỏ', 'Kết tủa Fe(OH)₃', 'SCN⁻: màu đỏ máu'],
            ['Cu²⁺', 'Kết tủa xanh', 'Kết tủa tan, dung dịch xanh lam đậm', 'NH₃ dư']
          ]
        },
        {
          type: 'list',
          items: [
            'Kim loại chuyển tiếp dãy thứ nhất: Sc → Cu, electron cuối điền vào 3d; nhiều số oxi hóa, ion thường có màu.',
            'Phức chất: nguyên tử trung tâm + phối tử; liên kết cho – nhận; số phối trí 2, 4, 6.'
          ]
        }
      ]
    },
    {
      id: 'example-titration',
      kind: 'example',
      title: 'Ví dụ 1 — Chuẩn độ xác định hàm lượng sắt',
      blocks: [
        {
          type: 'worked',
          problem: 'Hòa tan 1,52 g muối FeSO₄ (có lẫn tạp chất không phản ứng) vào dung dịch H₂SO₄ loãng. Chuẩn độ dung dịch thu được cần vừa đủ 15,0 mL KMnO₄ 0,1 M. Tính phần trăm khối lượng FeSO₄ trong mẫu (Fe = 56, S = 32, O = 16).',
          steps: [
            'n(MnO₄⁻) = 0,015 × 0,1 = 1,5 × 10⁻³ mol ⇒ n(Fe²⁺) = 5 × 1,5 × 10⁻³ = 7,5 × 10⁻³ mol.',
            'm(FeSO₄) = 7,5 × 10⁻³ × 152 = 1,14 g.',
            '%m = 1,14 / 1,52 × 100% = 75%.'
          ],
          answer: 'Mẫu chứa 75% FeSO₄ về khối lượng.',
          equations: ['5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O']
        }
      ]
    },
    {
      id: 'example-complex',
      kind: 'example',
      title: 'Ví dụ 2 — Phân tích phức chất',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho phức chất [Fe(CN)₆]³⁻. Xác định điện tích nguyên tử trung tâm, phối tử, số phối trí và dạng hình học.',
          steps: [
            'Phối tử: 6 ion CN⁻.',
            'x + 6 × (−1) = −3 ⇒ x = +3: nguyên tử trung tâm là Fe³⁺.',
            'Số phối trí 6 ⇒ dạng bát diện.'
          ],
          answer: 'Fe³⁺; 6 phối tử CN⁻; số phối trí 6; bát diện.'
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
          id: 'g12-l30-c1',
          question: 'Ion nào tạo dung dịch xanh lam đậm khi thêm NH₃ dư?',
          options: [
            { id: 'a', text: 'Fe²⁺' },
            { id: 'b', text: 'Fe³⁺' },
            { id: 'c', text: 'Cu²⁺' },
            { id: 'd', text: 'Mg²⁺' }
          ],
          correct: 'c',
          explanation: 'Cu²⁺ tạo phức chất ammine tan màu xanh lam đậm.'
        },
        {
          type: 'quiz',
          id: 'g12-l30-c2',
          question: 'Số phối trí của Pt trong cisplatin [PtCl₂(NH₃)₂] là',
          options: [
            { id: 'a', text: '2' },
            { id: 'b', text: '4' },
            { id: 'c', text: '6' },
            { id: 'd', text: '3' }
          ],
          correct: 'b',
          explanation: '2 Cl⁻ + 2 NH₃ = 4 phối tử, dạng vuông phẳng.'
        },
        {
          type: 'quiz',
          id: 'g12-l30-c3',
          question: 'Ion Fe³⁺ có cấu hình electron là',
          options: [
            { id: 'a', text: '[Ar]3d⁶4s²' },
            { id: 'b', text: '[Ar]3d⁶' },
            { id: 'c', text: '[Ar]3d⁵' },
            { id: 'd', text: '[Ar]3d³4s²' }
          ],
          correct: 'c',
          explanation: 'Fe nhường 2 electron 4s rồi 1 electron 3d.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 8',
      blocks: [
        {
          type: 'list',
          items: [
            'Nhận biết: NaOH (Fe(OH)₂ trắng xanh, Fe(OH)₃ nâu đỏ, Cu(OH)₂ xanh); NH₃ dư (Cu²⁺ tạo phức tan); SCN⁻ (Fe³⁺ đỏ máu).',
            'Chuẩn độ Fe²⁺ bằng KMnO₄: n(Fe²⁺) = 5n(MnO₄⁻).',
            'Phức chất: xác định điện tích nguyên tử trung tâm từ điện tích phức và phối tử.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Fe(OH)₂ và Fe(OH)₃ cùng có màu nâu đỏ.', right: 'Fe(OH)₂ **trắng xanh**, hóa nâu đỏ dần trong không khí; Fe(OH)₃ **nâu đỏ**.' },
            { wrong: 'Trong [Fe(CN)₆]³⁻, Fe có điện tích −3.', right: '−3 là điện tích **cả ion phức**; Fe là **+3** vì 6 CN⁻ mang −6.' },
            { wrong: 'Fe³⁺ có cấu hình [Ar]3d³4s².', right: 'Electron 4s bị tách trước: Fe³⁺ là **[Ar]3d⁵**.' }
          ]
        },
        {
          type: 'p',
          text: 'Em đã hoàn thành toàn bộ chương trình Hóa học 12. Hãy dùng mục Luyện tập để ôn lại những chương còn chưa vững.'
        }
      ]
    }
  ]
}
