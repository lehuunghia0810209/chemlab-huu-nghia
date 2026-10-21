// Hóa học 10 · Chương 3 · Bài 11 — Liên kết ion.
// NaCl melting point 801 °C (CRC).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l11',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Trình bày được khái niệm ion, cation, anion, ion đơn nguyên tử, ion đa nguyên tử.',
    'Trình bày được sự hình thành liên kết ion: nguyên tử kim loại nhường electron, nguyên tử phi kim nhận electron, các ion trái dấu hút nhau.',
    'Nêu được cấu tạo tinh thể NaCl và giải thích được tính chất chung của hợp chất ion.'
  ],
  prerequisites: [
    'Bài 10: quy tắc octet, ion thường gặp của nguyên tố nhóm A.',
    'Lực hút tĩnh điện giữa các điện tích trái dấu.'
  ],
  sources: [
    programme('Liên kết ion'),
    textbook(10, 11),
    'Nhiệt độ nóng chảy của NaCl: CRC Handbook (801 °C).'
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
          text: 'Muối ăn là chất rắn, phải nóng tới khoảng 800 °C mới chảy lỏng, nhưng dung dịch nước muối lại dẫn điện được. Bên trong tinh thể muối, các hạt liên kết với nhau như thế nào để có những tính chất đó?'
        },
        {
          type: 'list',
          items: [
            'Phân biệt cation, anion; ion đơn nguyên tử và đa nguyên tử.',
            'Mô tả sự hình thành liên kết ion bằng sơ đồ nhường – nhận electron.',
            'Mô tả tinh thể NaCl và giải thích tính chất của hợp chất ion.',
            'Lập công thức hợp chất ion từ điện tích các ion.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Kim loại nhóm A nhường electron, phi kim nhận electron để đạt octet.', 'Na → Na⁺ + e; Cl + e → Cl⁻.'] }
      ]
    },
    {
      id: 'ions',
      kind: 'concept',
      title: 'Ion, cation và anion',
      blocks: [
        {
          type: 'p',
          text: 'Nguyên tử trung hòa về điện. Khi nguyên tử nhường hay nhận electron, nó trở thành phần tử mang điện gọi là **ion**.'
        },
        {
          type: 'list',
          items: [
            '**Cation** (ion dương): tạo thành khi nguyên tử nhường electron, ví dụ Na⁺, Mg²⁺, Al³⁺.',
            '**Anion** (ion âm): tạo thành khi nguyên tử nhận electron, ví dụ Cl⁻, O²⁻, S²⁻.'
          ]
        },
        {
          type: 'table',
          caption: 'Ion đơn nguyên tử và ion đa nguyên tử',
          head: ['Loại', 'Định nghĩa', 'Ví dụ'],
          rows: [
            ['Ion đơn nguyên tử', 'Tạo thành từ một nguyên tử', 'Na⁺, Ca²⁺, Al³⁺, F⁻, O²⁻'],
            ['Ion đa nguyên tử', 'Nhóm nhiều nguyên tử mang điện', 'NH₄⁺, OH⁻, NO₃⁻, SO₄²⁻, CO₃²⁻, PO₄³⁻']
          ]
        }
      ]
    },
    {
      id: 'formation',
      kind: 'concept',
      title: 'Sự hình thành liên kết ion',
      blocks: [
        {
          type: 'callout',
          title: 'Liên kết ion',
          text: 'Là liên kết được hình thành bởi **lực hút tĩnh điện giữa các ion mang điện tích trái dấu**. Thường gặp giữa kim loại điển hình và phi kim điển hình.'
        },
        { type: 'heading', text: 'Ví dụ: sodium chloride' },
        { type: 'equation', text: 'Na → Na⁺ + e', note: 'Nguyên tử Na nhường 1 electron.' },
        { type: 'equation', text: 'Cl + e → Cl⁻', note: 'Nguyên tử Cl nhận electron đó.' },
        { type: 'equation', text: 'Na⁺ + Cl⁻ → NaCl', note: 'Hai ion trái dấu hút nhau tạo liên kết ion.' },
        { type: 'equation', text: '2Na + Cl₂ → 2NaCl', note: 'Phương trình hóa học của phản ứng.' },
        {
          type: 'p',
          text: 'Tổng số electron nhường phải bằng tổng số electron nhận. Vì vậy công thức hợp chất ion luôn trung hòa điện: tổng điện tích cation bằng tổng điện tích anion về độ lớn.'
        }
      ]
    },
    {
      id: 'crystal',
      kind: 'concept',
      title: 'Tinh thể ion và tính chất',
      blocks: [
        { type: 'figure', figure: 'nacl-lattice' },
        {
          type: 'p',
          text: 'Ở trạng thái rắn, hợp chất ion tồn tại dưới dạng **tinh thể ion**: các cation và anion sắp xếp xen kẽ, đều đặn trong không gian. Trong tinh thể NaCl, mỗi ion Na⁺ được bao quanh bởi 6 ion Cl⁻ gần nhất và ngược lại. Không có “phân tử NaCl” riêng lẻ; công thức NaCl chỉ tỉ lệ số ion 1 : 1.'
        },
        {
          type: 'table',
          caption: 'Tính chất chung của hợp chất ion',
          head: ['Tính chất', 'Giải thích'],
          rows: [
            ['Thường là chất rắn ở điều kiện thường, nhiệt độ nóng chảy cao (NaCl: 801 °C)', 'Lực hút tĩnh điện giữa các ion trong mạng tinh thể rất mạnh'],
            ['Không dẫn điện ở trạng thái rắn', 'Các ion bị giữ cố định trong mạng tinh thể'],
            ['Dẫn điện khi nóng chảy hoặc khi tan trong nước', 'Các ion chuyển động tự do'],
            ['Nhiều hợp chất ion tan tốt trong nước', 'Phân tử nước phân cực tách các ion ra khỏi mạng tinh thể (một số như CaCO₃, BaSO₄ ít tan)']
          ]
        }
      ]
    },
    {
      id: 'example-mgo',
      kind: 'example',
      title: 'Ví dụ 1 — Sơ đồ hình thành MgO',
      blocks: [
        {
          type: 'worked',
          problem: 'Mô tả sự hình thành liên kết ion trong magnesium oxide (Mg: Z = 12; O: Z = 8). Viết phương trình phản ứng của magnesium với oxygen.',
          steps: [
            'Mg (2, 8, 2) nhường 2 electron: Mg → Mg²⁺ + 2e, đạt cấu hình như Ne.',
            'O (2, 6) nhận 2 electron: O + 2e → O²⁻, đạt cấu hình như Ne.',
            'Ion Mg²⁺ và O²⁻ hút nhau tạo liên kết ion; tỉ lệ 1 : 1 ⇒ MgO.',
            'Phân tử O₂ gồm 2 nguyên tử O nên cần 2 nguyên tử Mg: 2Mg + O₂ → 2MgO.'
          ],
          answer: 'MgO gồm các ion Mg²⁺ và O²⁻; phương trình 2Mg + O₂ → 2MgO.',
          equations: ['Mg → Mg²⁺ + 2e', 'O + 2e → O²⁻', '2Mg + O₂ → 2MgO']
        }
      ]
    },
    {
      id: 'example-formula',
      kind: 'example',
      title: 'Ví dụ 2 — Lập công thức từ điện tích ion',
      blocks: [
        {
          type: 'worked',
          problem: 'Lập công thức hợp chất ion tạo bởi: (a) Al³⁺ và O²⁻; (b) Ca²⁺ và PO₄³⁻; (c) NH₄⁺ và SO₄²⁻.',
          steps: [
            'Quy tắc: số cation × điện tích cation = số anion × |điện tích anion|; chọn số nguyên nhỏ nhất.',
            '(a) 3 và 2 ⇒ bội chung nhỏ nhất 6: 2 Al³⁺ (+6) và 3 O²⁻ (−6) ⇒ Al₂O₃.',
            '(b) 2 và 3 ⇒ 6: 3 Ca²⁺ (+6) và 2 PO₄³⁻ (−6) ⇒ Ca₃(PO₄)₂.',
            '(c) 1 và 2 ⇒ 2 NH₄⁺ (+2) và 1 SO₄²⁻ (−2) ⇒ (NH₄)₂SO₄.'
          ],
          answer: 'Al₂O₃; Ca₃(PO₄)₂; (NH₄)₂SO₄. Ion đa nguyên tử lặp lại nhiều lần được đặt trong ngoặc đơn.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Tra cứu ion',
      blocks: [
        {
          type: 'p',
          text: 'Mở công cụ Ion Engine để tra cứu điện tích của các ion đơn và đa nguyên tử, rồi tự ghép cặp cation – anion và kiểm tra công thức em lập được.'
        },
        {
          type: 'activity',
          title: 'Công cụ — Ion Engine',
          text: 'Quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'tool', tool: 'ions' }
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
          id: 'g10-l11-c1',
          question: 'Liên kết ion được tạo thành bởi',
          options: [
            { id: 'a', text: 'cặp electron dùng chung giữa hai nguyên tử' },
            { id: 'b', text: 'lực hút tĩnh điện giữa các ion trái dấu' },
            { id: 'c', text: 'lực hút giữa hạt nhân và electron của cùng nguyên tử' },
            { id: 'd', text: 'lực đẩy giữa các ion cùng dấu' }
          ],
          correct: 'b',
          explanation: 'Cặp electron dùng chung là đặc điểm của liên kết cộng hóa trị.'
        },
        {
          type: 'quiz',
          id: 'g10-l11-c2',
          question: 'Ion nào là ion đa nguyên tử?',
          options: [
            { id: 'a', text: 'Cl⁻' },
            { id: 'b', text: 'Fe³⁺' },
            { id: 'c', text: 'NO₃⁻' },
            { id: 'd', text: 'S²⁻' }
          ],
          correct: 'c',
          explanation: 'NO₃⁻ gồm 1 nguyên tử N và 3 nguyên tử O cùng mang điện tích −1.'
        },
        {
          type: 'quiz',
          id: 'g10-l11-c3',
          question: 'Vì sao NaCl rắn không dẫn điện nhưng dung dịch NaCl lại dẫn điện?',
          options: [
            { id: 'a', text: 'Vì khi tan, NaCl tạo ra electron tự do.' },
            { id: 'b', text: 'Vì trong tinh thể các ion bị giữ cố định, còn trong dung dịch các ion chuyển động tự do.' },
            { id: 'c', text: 'Vì NaCl rắn không chứa ion.' },
            { id: 'd', text: 'Vì nước tự dẫn điện tốt.' }
          ],
          correct: 'b',
          explanation: 'NaCl rắn vẫn gồm ion nhưng các ion không di chuyển được; nước nguyên chất dẫn điện rất kém.'
        },
        {
          type: 'quiz',
          id: 'g10-l11-c4',
          question: 'Công thức hợp chất tạo bởi ion K⁺ và ion SO₄²⁻ là',
          options: [
            { id: 'a', text: 'KSO₄' },
            { id: 'b', text: 'K(SO₄)₂' },
            { id: 'c', text: 'K₂SO₄' },
            { id: 'd', text: 'K₂(SO₄)₃' }
          ],
          correct: 'c',
          explanation: 'Cần 2 ion K⁺ (+2) để trung hòa 1 ion SO₄²⁻ (−2).'
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
            'Cation: ion dương (nguyên tử nhường electron); anion: ion âm (nguyên tử nhận electron).',
            'Liên kết ion: lực hút tĩnh điện giữa các ion trái dấu, thường giữa kim loại điển hình và phi kim điển hình.',
            'Tinh thể ion: các ion xếp xen kẽ; NaCl mỗi ion có 6 ion trái dấu bao quanh.',
            'Hợp chất ion: rắn, nóng chảy ở nhiệt độ cao, dẫn điện khi nóng chảy hoặc khi tan trong nước.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Tinh thể NaCl gồm các phân tử NaCl riêng biệt.', right: 'Tinh thể NaCl gồm **các ion Na⁺ và Cl⁻** xếp xen kẽ; NaCl chỉ là tỉ lệ ion.' },
            { wrong: 'Hợp chất ion dẫn điện ở mọi trạng thái.', right: 'Ở **trạng thái rắn không dẫn điện**; chỉ dẫn điện khi nóng chảy hoặc tan trong nước.' },
            { wrong: 'Công thức của Al³⁺ và O²⁻ là Al₃O₂.', right: 'Đổi chéo trị số điện tích: **Al₂O₃** (2 × 3 = 3 × 2).' },
            { wrong: 'Viết NH₄₂SO₄ khi cần hai ion NH₄⁺.', right: 'Đặt ion đa nguyên tử trong ngoặc: **(NH₄)₂SO₄**.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Liên kết cộng hóa trị** — khi các nguyên tử dùng chung electron.'
        }
      ]
    }
  ]
}
