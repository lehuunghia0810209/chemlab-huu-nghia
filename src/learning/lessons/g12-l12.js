// Hóa học 12 · Chương 4 · Bài 12 — Đại cương về polymer.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l12',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm polymer, monomer, mắt xích, hệ số polymer hóa; cách phân loại polymer; gọi được tên một số polymer thông dụng.',
    'Nêu được đặc điểm cấu trúc (mạch không phân nhánh, phân nhánh, mạng không gian) và tính chất vật lí chung của polymer.',
    'Trình bày được tính chất hóa học của polymer: phản ứng giữ nguyên mạch, phản ứng cắt mạch, phản ứng khâu mạch.',
    'Trình bày được phương pháp tổng hợp polymer: trùng hợp, trùng ngưng.'
  ],
  prerequisites: [
    'Hóa 11: phản ứng cộng, trùng hợp alkene.',
    'Bài 9: amino acid trùng ngưng; Bài 6: tinh bột, cellulose.'
  ],
  sources: [
    programme('Polymer'),
    textbook(12, 12)
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
          text: 'Túi nilon, ống nước PVC, sợi tơ tằm, cao su lốp xe và cả tinh bột trong hạt gạo đều là polymer. Những phân tử khổng lồ này được tạo thành như thế nào và có những tính chất chung gì?'
        },
        {
          type: 'list',
          items: [
            'Nêu khái niệm polymer, monomer, hệ số polymer hóa.',
            'Phân loại và gọi tên polymer.',
            'Mô tả cấu trúc mạch và tính chất vật lí của polymer.',
            'Phân biệt trùng hợp và trùng ngưng; nêu các loại phản ứng của polymer.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Alkene trùng hợp nhờ liên kết đôi C=C.', 'Amino acid có hai nhóm chức −NH₂ và −COOH.'] }
      ]
    },
    {
      id: 'definition',
      kind: 'concept',
      title: 'Khái niệm, phân loại và danh pháp',
      blocks: [
        {
          type: 'callout',
          title: 'Polymer',
          text: 'Là những hợp chất có phân tử khối rất lớn do nhiều đơn vị nhỏ (gọi là **mắt xích**) liên kết với nhau tạo nên. Chất ban đầu tạo nên mắt xích gọi là **monomer**; số mắt xích **n** gọi là hệ số polymer hóa (độ polymer hóa).'
        },
        {
          type: 'table',
          caption: 'Phân loại polymer',
          head: ['Theo', 'Loại', 'Ví dụ'],
          rows: [
            ['Nguồn gốc', 'Thiên nhiên', 'Tinh bột, cellulose, cao su thiên nhiên, tơ tằm'],
            ['', 'Tổng hợp', 'Polyethylene, poly(vinyl chloride), nylon-6,6'],
            ['', 'Bán tổng hợp (nhân tạo)', 'Tơ visco, tơ cellulose acetate'],
            ['Phương pháp tổng hợp', 'Trùng hợp', 'Polyethylene, polystyrene'],
            ['', 'Trùng ngưng', 'Nylon-6,6, poly(phenol-formaldehyde)']
          ]
        },
        {
          type: 'p',
          text: 'Tên polymer = **poly** + tên monomer (đặt trong ngoặc nếu tên monomer gồm nhiều từ): polyethylene (PE), polypropylene (PP), polystyrene (PS), poly(vinyl chloride) (PVC), poly(methyl methacrylate) (PMMA).'
        }
      ]
    },
    {
      id: 'structure',
      kind: 'concept',
      title: 'Cấu trúc và tính chất vật lí',
      blocks: [
        {
          type: 'table',
          caption: 'Các dạng cấu trúc mạch',
          head: ['Dạng mạch', 'Ví dụ'],
          rows: [
            ['Không phân nhánh', 'PE, PVC, amylose, cellulose'],
            ['Phân nhánh', 'Amylopectin, glycogen'],
            ['Mạng không gian', 'Cao su lưu hóa, nhựa bakelite (rezit)']
          ]
        },
        {
          type: 'list',
          items: [
            'Hầu hết polymer là chất rắn, không bay hơi, **không có nhiệt độ nóng chảy xác định** (nóng chảy trong một khoảng nhiệt độ).',
            'Đa số không tan trong nước và các dung môi thông thường.',
            'Nhiều polymer có tính dẻo (PE, PVC), tính đàn hồi (cao su), có thể kéo sợi (nylon, tơ tằm); nhiều polymer cách điện, cách nhiệt tốt.',
            'Polymer **nhiệt dẻo** nóng chảy khi đun, để nguội lại rắn (PE, PVC); polymer **nhiệt rắn** không nóng chảy mà bị phân hủy khi đun (nhựa bakelite).'
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
          type: 'table',
          caption: 'Ba loại phản ứng của polymer',
          head: ['Loại', 'Ý nghĩa', 'Ví dụ'],
          rows: [
            ['Giữ nguyên mạch', 'Biến đổi nhóm thế, mạch chính giữ nguyên', 'Thủy phân poly(vinyl acetate) thành poly(vinyl alcohol); cộng HCl vào cao su thiên nhiên'],
            ['Cắt mạch', 'Mạch polymer bị cắt thành đoạn ngắn hoặc monomer', 'Thủy phân tinh bột, cellulose, protein, polyamide; nhiệt phân polystyrene thành styrene'],
            ['Khâu mạch', 'Các mạch nối với nhau tạo mạng không gian', 'Lưu hóa cao su bằng sulfur; nhựa rezol chuyển thành rezit khi đun nóng']
          ]
        }
      ]
    },
    {
      id: 'synthesis',
      kind: 'concept',
      title: 'Phương pháp tổng hợp polymer',
      blocks: [
        {
          type: 'callout',
          title: 'Trùng hợp',
          text: 'Quá trình kết hợp nhiều phân tử nhỏ (monomer) giống nhau hay tương tự nhau thành phân tử lớn. Monomer phải có **liên kết bội** hoặc **vòng kém bền** có thể mở ra.'
        },
        { type: 'equation', text: 'nCH₂=CH₂ → (−CH₂−CH₂−)ₙ', condition: 'xt, t°, p', note: 'Trùng hợp ethylene thành polyethylene.', check: false },
        { type: 'equation', text: 'nCH₂=CHCl → (−CH₂−CHCl−)ₙ', condition: 'xt, t°, p', note: 'Vinyl chloride thành PVC.', check: false },
        {
          type: 'callout',
          title: 'Trùng ngưng',
          text: 'Quá trình kết hợp nhiều phân tử nhỏ thành phân tử lớn, **đồng thời giải phóng** những phân tử nhỏ khác (như H₂O). Monomer phải có ít nhất **hai nhóm chức** có khả năng phản ứng.'
        },
        { type: 'equation', text: 'nH₂N[CH₂]₅COOH → (−NH[CH₂]₅CO−)ₙ + nH₂O', condition: 't°', note: 'ε-aminocaproic acid trùng ngưng thành nylon-6.', check: false }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Hệ số polymer hóa',
      blocks: [
        {
          type: 'worked',
          problem: '(a) Một mẫu polyethylene có phân tử khối trung bình 420 000. Tính hệ số polymer hóa. (b) Một mẫu PVC có phân tử khối trung bình 250 000. Tính hệ số polymer hóa (C = 12, H = 1, Cl = 35,5).',
          steps: [
            '(a) Mắt xích −CH₂−CH₂− có M = 28 ⇒ n = 420 000 / 28 = 15 000.',
            '(b) Mắt xích −CH₂−CHCl− có M = 62,5 ⇒ n = 250 000 / 62,5 = 4 000.'
          ],
          answer: '(a) n = 15 000; (b) n = 4 000.'
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
          id: 'g12-l12-c1',
          question: 'Polymer nào là polymer thiên nhiên?',
          options: [
            { id: 'a', text: 'Polyethylene' },
            { id: 'b', text: 'Cellulose' },
            { id: 'c', text: 'Tơ visco' },
            { id: 'd', text: 'Nylon-6,6' }
          ],
          correct: 'b',
          explanation: 'Tơ visco là bán tổng hợp; PE và nylon-6,6 là tổng hợp.'
        },
        {
          type: 'quiz',
          id: 'g12-l12-c2',
          question: 'Monomer tham gia phản ứng trùng hợp cần có',
          options: [
            { id: 'a', text: 'ít nhất hai nhóm chức' },
            { id: 'b', text: 'liên kết bội hoặc vòng kém bền' },
            { id: 'c', text: 'nhóm −OH' },
            { id: 'd', text: 'vòng benzene' }
          ],
          correct: 'b',
          explanation: 'Ít nhất hai nhóm chức là điều kiện của trùng ngưng.'
        },
        {
          type: 'quiz',
          id: 'g12-l12-c3',
          question: 'Lưu hóa cao su là phản ứng',
          options: [
            { id: 'a', text: 'giữ nguyên mạch' },
            { id: 'b', text: 'cắt mạch' },
            { id: 'c', text: 'khâu mạch' },
            { id: 'd', text: 'trùng ngưng' }
          ],
          correct: 'c',
          explanation: 'Cầu nối −S−S− nối các mạch cao su tạo mạng không gian.'
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
            'Polymer: nhiều mắt xích liên kết; n là hệ số polymer hóa; tên = poly + tên monomer.',
            'Phân loại theo nguồn gốc (thiên nhiên, tổng hợp, bán tổng hợp) và theo phương pháp tổng hợp (trùng hợp, trùng ngưng).',
            'Mạch không phân nhánh, phân nhánh, mạng không gian; không có nhiệt độ nóng chảy xác định.',
            'Phản ứng giữ nguyên mạch, cắt mạch, khâu mạch.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Monomer chỉ cần có liên kết đôi là trùng ngưng được.', right: 'Trùng ngưng cần monomer có **ít nhất hai nhóm chức**; liên kết đôi là điều kiện của **trùng hợp**.' },
            { wrong: 'Tơ visco là polymer tổng hợp.', right: 'Tơ visco chế biến từ cellulose thiên nhiên nên là polymer **bán tổng hợp**.' },
            { wrong: 'Polymer có nhiệt độ nóng chảy xác định như các chất tinh khiết.', right: 'Polymer là hỗn hợp các phân tử có n khác nhau nên nóng chảy **trong một khoảng nhiệt độ**.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Vật liệu polymer**.'
        }
      ]
    }
  ]
}
