// Hóa học 10 · Chương 3 · Bài 12 — Liên kết cộng hóa trị.
// Electronegativity: Pauling. Bond energies: typical tabulated mean values (kJ/mol).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l12',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Trình bày được khái niệm liên kết cộng hóa trị; viết được công thức Lewis của một số chất.',
    'Phân biệt được liên kết đơn, đôi, ba; nêu được liên kết cho – nhận.',
    'Phân biệt được liên kết cộng hóa trị không phân cực, phân cực và liên kết ion dựa vào hiệu độ âm điện (thang Pauling).',
    'Giải thích được sự hình thành liên kết σ và π qua sự xen phủ orbital.',
    'Nêu được khái niệm năng lượng liên kết cộng hóa trị.'
  ],
  prerequisites: [
    'Bài 10: quy tắc octet, góp chung electron.',
    'Bài 6: độ âm điện; bài 3: orbital s, p.'
  ],
  sources: [
    programme('Liên kết cộng hóa trị'),
    textbook(10, 12),
    'Độ âm điện thang Pauling; năng lượng liên kết trung bình từ bảng tra cứu phổ biến (làm tròn, kJ/mol).'
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
          text: 'Khí nitrogen chiếm khoảng 78% không khí nhưng rất khó phản ứng, còn khí chlorine lại phản ứng mạnh với nhiều chất. Cả hai đều do hai nguyên tử giống nhau dùng chung electron tạo nên. Vì sao độ bền của chúng khác nhau nhiều như vậy?'
        },
        {
          type: 'list',
          items: [
            'Hiểu liên kết cộng hóa trị và viết công thức Lewis, công thức cấu tạo.',
            'Phân biệt liên kết đơn, đôi, ba và liên kết cho – nhận.',
            'Dùng hiệu độ âm điện để phân loại liên kết.',
            'Đếm liên kết σ, π và so sánh độ bền liên kết qua năng lượng liên kết.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Hai phi kim góp chung electron để đạt octet.', 'Độ âm điện: H 2,20; C 2,55; N 3,04; O 3,44; Cl 3,16.'] }
      ]
    },
    {
      id: 'concept',
      kind: 'concept',
      title: 'Liên kết cộng hóa trị và công thức Lewis',
      blocks: [
        {
          type: 'callout',
          title: 'Liên kết cộng hóa trị',
          text: 'Là liên kết được tạo nên giữa hai nguyên tử bằng **một hay nhiều cặp electron dùng chung**.'
        },
        { type: 'figure', figure: 'lewis-structures' },
        {
          type: 'table',
          caption: 'Ba cách biểu diễn phân tử',
          head: ['Phân tử', 'Số cặp dùng chung', 'Công thức cấu tạo', 'Loại liên kết'],
          rows: [
            ['H₂, Cl₂, HCl', '1', 'H–H, Cl–Cl, H–Cl', 'Liên kết đơn'],
            ['O₂, CO₂', '2 (giữa mỗi cặp nguyên tử)', 'O=O, O=C=O', 'Liên kết đôi'],
            ['N₂', '3', 'N≡N', 'Liên kết ba']
          ]
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Công thức Lewis: viết kí hiệu nguyên tố, biểu diễn mọi electron hóa trị (cặp dùng chung bằng gạch nối hoặc cặp chấm, cặp riêng bằng cặp chấm).',
            'Công thức cấu tạo: chỉ biểu diễn các cặp electron dùng chung bằng gạch nối.'
          ]
        }
      ]
    },
    {
      id: 'coordinate',
      kind: 'concept',
      title: 'Liên kết cho – nhận',
      blocks: [
        {
          type: 'p',
          text: 'Trong một số trường hợp, cặp electron dùng chung chỉ do **một nguyên tử đóng góp**. Đó là liên kết cho – nhận, biểu diễn bằng mũi tên từ nguyên tử cho đến nguyên tử nhận.'
        },
        { type: 'equation', text: 'NH₃ + H⁺ → NH₄⁺', note: 'N dùng cặp electron riêng của mình để liên kết với ion H⁺ (không có electron).' },
        {
          type: 'p',
          text: 'Sau khi hình thành, bốn liên kết N–H trong ion NH₄⁺ hoàn toàn giống nhau.'
        }
      ]
    },
    {
      id: 'polarity',
      kind: 'concept',
      title: 'Phân cực liên kết và hiệu độ âm điện',
      blocks: [
        {
          type: 'p',
          text: 'Nếu hai nguyên tử có độ âm điện khác nhau, cặp electron dùng chung bị lệch về phía nguyên tử có độ âm điện lớn hơn: liên kết **phân cực**. Hiệu độ âm điện Δχ càng lớn, liên kết càng phân cực; khi Δχ đủ lớn, electron coi như chuyển hẳn sang một nguyên tử: liên kết ion.'
        },
        {
          type: 'table',
          caption: 'Phân loại liên kết theo hiệu độ âm điện (thang Pauling)',
          head: ['Hiệu độ âm điện Δχ', 'Loại liên kết', 'Ví dụ'],
          rows: [
            ['0 ≤ Δχ < 0,4', 'Cộng hóa trị không phân cực', 'H₂, Cl₂ (Δχ = 0); C–H (0,35)'],
            ['0,4 ≤ Δχ < 1,7', 'Cộng hóa trị phân cực', 'H–Cl (0,96); O–H (1,24)'],
            ['Δχ ≥ 1,7', 'Liên kết ion', 'NaCl (2,23); MgO (2,13)']
          ]
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Lưu ý',
          text: 'Các mốc 0,4 và 1,7 chỉ có tính quy ước, dùng để phân loại gần đúng.'
        }
      ]
    },
    {
      id: 'sigma-pi',
      kind: 'concept',
      title: 'Liên kết σ, liên kết π và năng lượng liên kết',
      blocks: [
        {
          type: 'list',
          items: [
            '**Liên kết σ (sigma):** hai orbital xen phủ **trục** (dọc theo đường nối hai hạt nhân): s–s (H₂), s–p (HCl), p–p (Cl₂). Vùng xen phủ lớn, liên kết bền.',
            '**Liên kết π (pi):** hai orbital p xen phủ **bên** (song song nhau), ở hai phía đường nối hai hạt nhân. Kém bền hơn liên kết σ.'
          ]
        },
        {
          type: 'table',
          caption: 'Thành phần các loại liên kết',
          head: ['Liên kết', 'Số liên kết σ', 'Số liên kết π', 'Ví dụ'],
          rows: [
            ['Đơn', '1', '0', 'H–Cl'],
            ['Đôi', '1', '1', 'O=O'],
            ['Ba', '1', '2', 'N≡N']
          ]
        },
        {
          type: 'callout',
          title: 'Năng lượng liên kết (Eb)',
          text: 'Là năng lượng cần để phá vỡ 1 mol liên kết ở thể khí, tạo các nguyên tử ở thể khí. **Eb càng lớn, liên kết càng bền.**'
        },
        {
          type: 'table',
          caption: 'Năng lượng liên kết (kJ/mol, giá trị làm tròn)',
          head: ['H–H', 'Cl–Cl', 'H–Cl', 'O=O', 'N≡N'],
          rows: [['436', '243', '432', '498', '945']]
        },
        {
          type: 'p',
          text: 'Trả lời câu hỏi mở đầu: liên kết ba N≡N (945 kJ/mol) bền hơn nhiều so với liên kết đơn Cl–Cl (243 kJ/mol) nên N₂ rất kém hoạt động ở điều kiện thường.'
        }
      ]
    },
    {
      id: 'example-classify',
      kind: 'example',
      title: 'Ví dụ 1 — Phân loại liên kết',
      blocks: [
        {
          type: 'worked',
          problem: 'Dựa vào độ âm điện (H 2,20; C 2,55; O 3,44; F 3,98; Na 0,93; Cl 3,16), cho biết loại liên kết trong: CH₄, H₂O, NaF, Cl₂.',
          table: {
            caption: 'Tính Δχ',
            head: ['Chất', 'Liên kết', 'Δχ', 'Loại'],
            rows: [
              ['CH₄', 'C–H', '2,55 − 2,20 = 0,35', 'Cộng hóa trị không phân cực'],
              ['H₂O', 'O–H', '3,44 − 2,20 = 1,24', 'Cộng hóa trị phân cực'],
              ['NaF', 'Na–F', '3,98 − 0,93 = 3,05', 'Liên kết ion'],
              ['Cl₂', 'Cl–Cl', '0', 'Cộng hóa trị không phân cực']
            ]
          },
          steps: [
            'Tính hiệu độ âm điện của hai nguyên tử tạo liên kết (lấy số lớn trừ số nhỏ).',
            'So với các mốc 0,4 và 1,7 để phân loại.'
          ],
          answer: 'CH₄ và Cl₂: không phân cực; H₂O: phân cực; NaF: ion.'
        }
      ]
    },
    {
      id: 'example-count',
      kind: 'example',
      title: 'Ví dụ 2 — Đếm liên kết σ và π',
      blocks: [
        {
          type: 'worked',
          problem: 'Đếm số liên kết σ và π trong phân tử CO₂ (O=C=O) và C₂H₄ (H₂C=CH₂).',
          steps: [
            'CO₂ có 2 liên kết đôi C=O; mỗi liên kết đôi gồm 1σ + 1π ⇒ 2σ + 2π.',
            'C₂H₄ có 4 liên kết đơn C–H (4σ) và 1 liên kết đôi C=C (1σ + 1π).',
            'C₂H₄: 4 + 1 = 5 liên kết σ và 1 liên kết π.'
          ],
          answer: 'CO₂: 2σ, 2π. C₂H₄: 5σ, 1π.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Quan sát phân tử 3D',
      blocks: [
        {
          type: 'p',
          text: 'Mở Compound Studio, nhập H2O, CO2 hoặc N2 và xem mô hình 3D. So sánh số liên kết giữa các nguyên tử với công thức cấu tạo đã học.'
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
          id: 'g10-l12-c1',
          question: 'Phân tử nào chứa liên kết ba?',
          options: [
            { id: 'a', text: 'O₂' },
            { id: 'b', text: 'N₂' },
            { id: 'c', text: 'Cl₂' },
            { id: 'd', text: 'H₂O' }
          ],
          correct: 'b',
          explanation: 'Mỗi N thiếu 3 electron nên dùng chung 3 cặp: N≡N.'
        },
        {
          type: 'quiz',
          id: 'g10-l12-c2',
          question: 'Liên kết trong phân tử HCl (χ: H 2,20; Cl 3,16) là',
          options: [
            { id: 'a', text: 'cộng hóa trị không phân cực' },
            { id: 'b', text: 'cộng hóa trị phân cực' },
            { id: 'c', text: 'liên kết ion' },
            { id: 'd', text: 'liên kết cho – nhận' }
          ],
          correct: 'b',
          explanation: 'Δχ = 0,96, nằm trong khoảng 0,4 – 1,7; cặp electron lệch về phía Cl.'
        },
        {
          type: 'quiz',
          id: 'g10-l12-c3',
          question: 'Liên kết đôi gồm',
          options: [
            { id: 'a', text: '2 liên kết σ' },
            { id: 'b', text: '2 liên kết π' },
            { id: 'c', text: '1 liên kết σ và 1 liên kết π' },
            { id: 'd', text: '1 liên kết σ và 2 liên kết π' }
          ],
          correct: 'c',
          explanation: 'Trong mọi liên kết bội chỉ có một liên kết σ; phần còn lại là liên kết π.'
        },
        {
          type: 'quiz',
          id: 'g10-l12-c4',
          question: 'Năng lượng liên kết H–Cl là 432 kJ/mol, H–Br là 366 kJ/mol. Nhận xét nào đúng?',
          options: [
            { id: 'a', text: 'Liên kết H–Br bền hơn H–Cl.' },
            { id: 'b', text: 'Liên kết H–Cl bền hơn H–Br.' },
            { id: 'c', text: 'Hai liên kết bền như nhau.' },
            { id: 'd', text: 'Không so sánh được.' }
          ],
          correct: 'b',
          explanation: 'Năng lượng liên kết càng lớn thì càng cần nhiều năng lượng để phá vỡ, tức liên kết càng bền.'
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
            'Liên kết cộng hóa trị: cặp electron dùng chung; đơn (1 cặp), đôi (2), ba (3). Liên kết cho – nhận: cặp chung do một nguyên tử góp.',
            'Δχ < 0,4: không phân cực; 0,4 ≤ Δχ < 1,7: phân cực; Δχ ≥ 1,7: ion.',
            'Liên kết đơn = 1σ; đôi = 1σ + 1π; ba = 1σ + 2π. Liên kết σ bền hơn liên kết π.',
            'Năng lượng liên kết càng lớn, liên kết càng bền.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Liên kết ba gồm 3 liên kết σ.', right: 'Liên kết ba gồm **1 liên kết σ và 2 liên kết π**.' },
            { wrong: 'Công thức cấu tạo phải vẽ cả các cặp electron riêng.', right: 'Đó là **công thức Lewis**; công thức cấu tạo chỉ vẽ cặp electron dùng chung.' },
            { wrong: 'Liên kết giữa hai nguyên tử phi kim luôn không phân cực.', right: 'Chỉ không phân cực khi Δχ < 0,4; **H–Cl, O–H là liên kết phân cực**.' },
            { wrong: 'Liên kết N≡N gồm 3 liên kết giống hệt nhau.', right: 'Trong liên kết ba có **1σ và 2π**, khác nhau về cách xen phủ orbital.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Liên kết hydrogen và tương tác van der Waals** — lực giữa các phân tử.'
        }
      ]
    }
  ]
}
