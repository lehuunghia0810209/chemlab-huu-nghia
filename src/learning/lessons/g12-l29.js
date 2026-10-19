// Hóa học 12 · Chương 8 · Bài 29 — Một số tính chất và ứng dụng của phức chất.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l29',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Trình bày được sự tạo thành phức chất của ion kim loại chuyển tiếp trong dung dịch (phức chất aqua).',
    'Trình bày được phản ứng thay thế phối tử trong phức chất và sự thay đổi màu sắc kèm theo.',
    'Nêu được một số ứng dụng của phức chất trong đời sống, y học, sản xuất và phân tích hóa học.'
  ],
  prerequisites: ['Bài 28: nguyên tử trung tâm, phối tử, số phối trí.'],
  sources: [
    programme('Kim loại chuyển tiếp dãy thứ nhất và phức chất'),
    textbook(12, 29)
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
          text: 'Nhỏ một giọt KSCN vào dung dịch FeCl₃, dung dịch lập tức chuyển màu đỏ như máu. Hemoglobin trong máu và chlorophyll trong lá cây cũng là phức chất. Phức chất có những tính chất gì đặc biệt?'
        },
        {
          type: 'list',
          items: [
            'Giải thích sự tạo thành phức chất aqua trong dung dịch.',
            'Viết phản ứng thay thế phối tử và mô tả sự đổi màu.',
            'Nêu ứng dụng của phức chất.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Phức chất gồm nguyên tử trung tâm và phối tử liên kết cho – nhận.', 'Số phối trí 6 ứng với dạng bát diện.'] }
      ]
    },
    {
      id: 'aqua',
      kind: 'concept',
      title: 'Phức chất aqua',
      blocks: [
        {
          type: 'p',
          text: 'Khi muối của kim loại chuyển tiếp tan trong nước, ion kim loại liên kết với các phân tử nước (phối tử aqua) tạo **phức chất aqua**, thường có dạng bát diện. Màu của dung dịch chính là màu của phức chất aqua.'
        },
        {
          type: 'table',
          caption: 'Một số phức chất aqua',
          head: ['Phức chất aqua', 'Màu'],
          rows: [
            ['[Cu(OH₂)₆]²⁺', 'Xanh'],
            ['[Fe(OH₂)₆]²⁺', 'Lục nhạt'],
            ['[Fe(OH₂)₆]³⁺', 'Vàng nâu (do có phần bị thủy phân)'],
            ['[Co(OH₂)₆]²⁺', 'Hồng']
          ]
        }
      ]
    },
    {
      id: 'substitution',
      kind: 'concept',
      title: 'Phản ứng thay thế phối tử',
      blocks: [
        {
          type: 'p',
          text: 'Trong dung dịch, phối tử của phức chất có thể bị thay thế (một phần hoặc toàn bộ) bằng phối tử khác. Sự thay thế thường làm **thay đổi màu sắc** của dung dịch.'
        },
        { type: 'equation', text: '[Cu(OH₂)₆]²⁺ + 4NH₃ → [Cu(NH₃)₄(OH₂)₂]²⁺ + 4H₂O', note: 'Màu xanh chuyển thành xanh lam đậm.' },
        { type: 'equation', text: '[Cu(OH₂)₆]²⁺ + 4Cl⁻ → [CuCl₄]²⁻ + 6H₂O', note: 'Thêm HCl đặc: màu xanh chuyển dần sang vàng (hoặc xanh lục khi còn lẫn hai phức).' },
        { type: 'equation', text: '[Fe(OH₂)₆]³⁺ + SCN⁻ → [Fe(SCN)(OH₂)₅]²⁺ + H₂O', note: 'Dung dịch màu đỏ máu: phản ứng rất nhạy dùng nhận biết ion Fe³⁺.' }
      ]
    },
    {
      id: 'applications',
      kind: 'concept',
      title: 'Ứng dụng của phức chất',
      blocks: [
        {
          type: 'table',
          caption: 'Một số ứng dụng',
          head: ['Lĩnh vực', 'Ví dụ'],
          rows: [
            ['Trong cơ thể sống', 'Hemoglobin (phức chất của Fe²⁺) vận chuyển O₂; chlorophyll (phức chất của Mg²⁺) tham gia quang hợp; vitamin B₁₂ chứa Co'],
            ['Y học', 'Cisplatin [PtCl₂(NH₃)₂] dùng trong điều trị ung thư; phức chất làm thuốc giải độc kim loại nặng'],
            ['Phân tích hóa học', 'Nhận biết Fe³⁺ bằng SCN⁻; thuốc thử Tollens [Ag(NH₃)₂]⁺ nhận biết aldehyde; nhận biết Cu²⁺ bằng NH₃'],
            ['Sản xuất', 'Mạ điện, xúc tác, tách và tinh chế kim loại (ví dụ tách vàng bằng phức cyanide), phẩm nhuộm']
          ]
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Nhận biết ion bằng phức chất',
      blocks: [
        {
          type: 'worked',
          problem: 'Có ba dung dịch loãng: FeCl₃, CuSO₄, MgSO₄. Dùng các dung dịch KSCN và NH₃, hãy nhận biết từng dung dịch.',
          steps: [
            'Nhỏ KSCN vào từng mẫu: mẫu chuyển màu đỏ máu là FeCl₃.',
            'Nhỏ từ từ NH₃ đến dư vào hai mẫu còn lại: mẫu tạo kết tủa xanh rồi tan thành dung dịch xanh lam đậm là CuSO₄.',
            'Mẫu tạo kết tủa trắng Mg(OH)₂ không tan trong NH₃ dư là MgSO₄.'
          ],
          answer: 'KSCN nhận FeCl₃; NH₃ dư phân biệt CuSO₄ (tạo phức tan xanh lam đậm) và MgSO₄ (kết tủa trắng).'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: Fe³⁺ và SCN⁻',
      blocks: [
        {
          type: 'p',
          text: 'Trong phòng thí nghiệm ảo, nhỏ dung dịch KSCN vào dung dịch FeCl₃ và quan sát màu đỏ máu xuất hiện.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Tính chất và ứng dụng của phức chất',
          text: 'Mở trong Phòng thí nghiệm ảo; quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'guided', grade: 12, lessonId: 'g12-l29', experimentId: 'g12-lesson-29' }
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
          id: 'g12-l29-c1',
          question: 'Thuốc thử dùng nhận biết ion Fe³⁺ tạo dung dịch màu đỏ máu là',
          options: [
            { id: 'a', text: 'KSCN' },
            { id: 'b', text: 'NH₃' },
            { id: 'c', text: 'NaCl' },
            { id: 'd', text: 'BaCl₂' }
          ],
          correct: 'a',
          explanation: 'Fe³⁺ + SCN⁻ tạo phức chất màu đỏ máu.'
        },
        {
          type: 'quiz',
          id: 'g12-l29-c2',
          question: 'Hemoglobin là phức chất của ion kim loại nào?',
          options: [
            { id: 'a', text: 'Mg²⁺' },
            { id: 'b', text: 'Fe²⁺' },
            { id: 'c', text: 'Cu²⁺' },
            { id: 'd', text: 'Zn²⁺' }
          ],
          correct: 'b',
          explanation: 'Hemoglobin chứa Fe²⁺; chlorophyll chứa Mg²⁺.'
        },
        {
          type: 'quiz',
          id: 'g12-l29-c3',
          question: 'Thêm HCl đặc vào dung dịch CuSO₄, màu dung dịch chuyển từ xanh sang vàng là do',
          options: [
            { id: 'a', text: 'Cu²⁺ bị khử thành Cu' },
            { id: 'b', text: 'phối tử H₂O bị thay thế bằng Cl⁻ tạo [CuCl₄]²⁻' },
            { id: 'c', text: 'tạo kết tủa CuCl₂' },
            { id: 'd', text: 'SO₄²⁻ bị oxi hóa' }
          ],
          correct: 'b',
          explanation: 'Đây là phản ứng thay thế phối tử.'
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
            'Ion kim loại chuyển tiếp trong nước tạo phức chất aqua, quyết định màu dung dịch.',
            'Phản ứng thay thế phối tử thường làm đổi màu: [Cu(OH₂)₆]²⁺ → [Cu(NH₃)₄(OH₂)₂]²⁺ (xanh lam đậm), → [CuCl₄]²⁻ (vàng); Fe³⁺ + SCN⁻ → đỏ máu.',
            'Ứng dụng: hemoglobin, chlorophyll, cisplatin, thuốc thử phân tích, mạ điện, tách kim loại.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Màu xanh của dung dịch CuSO₄ là màu của ion Cu²⁺ tự do.', right: 'Trong nước, Cu²⁺ tồn tại dạng **phức chất aqua [Cu(OH₂)₆]²⁺** có màu xanh.' },
            { wrong: 'Fe²⁺ cũng cho màu đỏ máu với SCN⁻.', right: 'Phản ứng màu đỏ máu đặc trưng cho **Fe³⁺**.' },
            { wrong: 'Chlorophyll là phức chất của sắt.', right: 'Chlorophyll là phức chất của **Mg²⁺**; hemoglobin mới là phức chất của Fe²⁺.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Ôn tập chương 8**.'
        }
      ]
    }
  ]
}
