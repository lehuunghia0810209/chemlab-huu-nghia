// Hóa học 11 · Chương 4 · Bài 17 — Arene (hydrocarbon thơm).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l17',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm arene, công thức chung của dãy đồng đẳng benzene; gọi được tên một số arene đơn giản.',
    'Mô tả được cấu tạo phân tử benzene và tính chất vật lí của arene.',
    'Trình bày được tính chất hóa học của benzene và toluene: phản ứng thế (halogen, nitro), phản ứng cộng (H₂, Cl₂), phản ứng oxi hóa (cháy, oxi hóa nhánh của toluene).',
    'Nêu được ứng dụng của arene và tác hại của benzene đối với sức khỏe.'
  ],
  prerequisites: [
    'Bài 15 – 16: Alkane, hydrocarbon không no (phản ứng thế, cộng).',
    'Hóa 10: liên kết σ, π.'
  ],
  sources: [
    programme('Arene (hydrocarbon thơm)'),
    textbook(11, 17)
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
          text: 'Benzene C₆H₆ có tỉ lệ C : H giống acetylene, nhưng lại không làm mất màu nước bromine như các hydrocarbon không no. Vòng sáu cạnh của benzene có gì đặc biệt mà vừa “không no” vừa bền vững như vậy?'
        },
        {
          type: 'list',
          items: [
            'Mô tả cấu tạo của benzene và gọi tên một số arene.',
            'Viết phản ứng thế, cộng, oxi hóa của benzene và toluene.',
            'Nêu ứng dụng của arene và tác hại của benzene.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Alkane có phản ứng thế, alkene có phản ứng cộng.', 'Nước bromine nhận biết liên kết bội C=C, C≡C.'] }
      ]
    },
    {
      id: 'structure',
      kind: 'concept',
      title: 'Cấu tạo và danh pháp',
      blocks: [
        {
          type: 'p',
          text: '**Arene** (hydrocarbon thơm) là hydrocarbon có chứa một hay nhiều vòng benzene. Dãy đồng đẳng của benzene có công thức chung **CₙH₂ₙ₋₆** (n ≥ 6).'
        },
        {
          type: 'list',
          items: [
            'Phân tử benzene C₆H₆ có 6 nguyên tử C tạo thành một vòng sáu cạnh đều, **phẳng**; mỗi C liên kết với 1 nguyên tử H.',
            'Các electron π phân bố đều trên cả vòng (hệ liên hợp), làm vòng benzene **bền** hơn nhiều so với ba liên kết đôi riêng lẻ.',
            'Công thức thường viết: vòng sáu cạnh có ba liên kết đôi xen kẽ hoặc vòng tròn bên trong lục giác.'
          ]
        },
        {
          type: 'table',
          caption: 'Một số arene',
          head: ['Công thức', 'Tên', 'Ghi chú'],
          rows: [
            ['C₆H₆', 'benzene', 'Chất lỏng, độc'],
            ['C₆H₅CH₃', 'toluene (methylbenzene)', 'Dung môi'],
            ['C₆H₄(CH₃)₂', 'xylene (dimethylbenzene)', 'Có ba đồng phân vị trí: ortho (1,2), meta (1,3), para (1,4)'],
            ['C₆H₅CH=CH₂', 'styrene', 'Có nhánh không no, dùng sản xuất polystyrene'],
            ['C₁₀H₈', 'naphthalene', 'Hai vòng benzene, dùng làm băng phiến']
          ]
        },
        {
          type: 'p',
          text: 'Tính chất vật lí: benzene, toluene, xylene là chất lỏng không màu, mùi đặc trưng, không tan trong nước, nhẹ hơn nước, là dung môi hòa tan nhiều chất hữu cơ.'
        }
      ]
    },
    {
      id: 'substitution',
      kind: 'concept',
      title: 'Phản ứng thế',
      blocks: [
        {
          type: 'p',
          text: 'Do vòng benzene bền, arene **dễ tham gia phản ứng thế** nguyên tử H của vòng hơn phản ứng cộng.'
        },
        { type: 'equation', text: 'C₆H₆ + Br₂ → C₆H₅Br + HBr', condition: 'FeBr₃, t°', note: 'Thế halogen: cần xúc tác; benzene không phản ứng với nước bromine.' },
        { type: 'equation', text: 'C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O', condition: 'H₂SO₄ đặc, t°', note: 'Thế nitro: tạo nitrobenzene (chất lỏng màu vàng nhạt).' },
        {
          type: 'callout',
          title: 'Toluene dễ thế hơn benzene',
          text: 'Nhóm CH₃ đẩy electron vào vòng nên toluene phản ứng thế dễ hơn benzene, và nhóm thế mới ưu tiên vào vị trí **ortho** và **para** so với nhóm CH₃.'
        },
        { type: 'equation', text: 'C₆H₅CH₃ + HNO₃ → C₆H₄(CH₃)NO₂ + H₂O', condition: 'H₂SO₄ đặc, t°', note: 'Sản phẩm chính: 2-nitrotoluene và 4-nitrotoluene.' }
      ]
    },
    {
      id: 'addition-oxidation',
      kind: 'concept',
      title: 'Phản ứng cộng và phản ứng oxi hóa',
      blocks: [
        { type: 'heading', text: 'Phản ứng cộng (khó hơn alkene, cần điều kiện)' },
        { type: 'equation', text: 'C₆H₆ + 3H₂ → C₆H₁₂', condition: 'Ni, t°, p', note: 'Tạo cyclohexane.' },
        { type: 'equation', text: 'C₆H₆ + 3Cl₂ → C₆H₆Cl₆', condition: 'ánh sáng', note: 'Tạo hexachlorocyclohexane.' },
        { type: 'heading', text: 'Phản ứng oxi hóa' },
        { type: 'equation', text: '2C₆H₆ + 15O₂ → 12CO₂ + 6H₂O', condition: 't°', note: 'Arene cháy với ngọn lửa nhiều khói đen do hàm lượng carbon cao.' },
        {
          type: 'list',
          items: [
            'Benzene **không** làm mất màu dung dịch KMnO₄.',
            'Toluene làm mất màu dung dịch KMnO₄ khi **đun nóng**: nhánh CH₃ bị oxi hóa thành nhóm −COOH (tạo benzoic acid sau khi acid hóa), vòng benzene vẫn giữ nguyên.'
          ]
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Nhận biết benzene, toluene, styrene',
      blocks: [
        {
          type: 'worked',
          problem: 'Có ba chất lỏng không màu đựng trong ba lọ mất nhãn: benzene, toluene, styrene. Chỉ dùng dung dịch KMnO₄, hãy nhận biết từng chất.',
          steps: [
            'Nhỏ dung dịch KMnO₄ vào từng mẫu ở nhiệt độ thường: styrene (có nhánh C=C) làm mất màu ngay.',
            'Đun nóng hai mẫu còn lại với KMnO₄: toluene làm mất màu (nhánh CH₃ bị oxi hóa).',
            'Mẫu không làm mất màu cả khi đun nóng là benzene.'
          ],
          answer: 'Styrene mất màu KMnO₄ ở nhiệt độ thường; toluene mất màu khi đun nóng; benzene không làm mất màu.'
        },
        {
          type: 'worked',
          problem: 'Nitro hóa 7,8 g benzene thu được 9,84 g nitrobenzene. Tính hiệu suất phản ứng (C = 12, H = 1, N = 14, O = 16).',
          steps: [
            'n(C₆H₆) = 7,8 / 78 = 0,1 mol ⇒ nitrobenzene lí thuyết 0,1 mol × 123 = 12,3 g.',
            'Hiệu suất = 9,84 / 12,3 × 100% = 80%.'
          ],
          answer: 'Hiệu suất phản ứng là 80%.',
          equations: ['C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O']
        }
      ]
    },
    {
      id: 'uses',
      kind: 'concept',
      title: 'Ứng dụng và tác hại',
      blocks: [
        {
          type: 'list',
          items: [
            'Benzene, toluene là nguyên liệu sản xuất polystyrene, phẩm nhuộm, dược phẩm, thuốc nổ (TNT từ toluene); toluene, xylene là dung môi.',
            '**Benzene độc**, có thể gây ung thư máu khi tiếp xúc lâu dài; cần hạn chế dùng làm dung môi và đảm bảo thông gió khi làm việc với xăng, sơn.'
          ]
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
          id: 'g11-l17-c1',
          question: 'Công thức chung của dãy đồng đẳng benzene là',
          options: [
            { id: 'a', text: 'CₙH₂ₙ₋₂' },
            { id: 'b', text: 'CₙH₂ₙ₋₆' },
            { id: 'c', text: 'CₙH₂ₙ' },
            { id: 'd', text: 'CₙH₂ₙ₊₂' }
          ],
          correct: 'b',
          explanation: 'Benzene C₆H₆ (n = 6), toluene C₇H₈ (n = 7) đều theo CₙH₂ₙ₋₆.'
        },
        {
          type: 'quiz',
          id: 'g11-l17-c2',
          question: 'Benzene không làm mất màu nước bromine vì',
          options: [
            { id: 'a', text: 'benzene không có liên kết π' },
            { id: 'b', text: 'vòng benzene bền, khó tham gia phản ứng cộng' },
            { id: 'c', text: 'benzene tan trong nước' },
            { id: 'd', text: 'benzene là alkane' }
          ],
          correct: 'b',
          explanation: 'Hệ electron π liên hợp làm vòng bền; benzene chỉ thế bromine khi có xúc tác FeBr₃.'
        },
        {
          type: 'quiz',
          id: 'g11-l17-c3',
          question: 'Sản phẩm của phản ứng benzene với HNO₃ đặc (xúc tác H₂SO₄ đặc) là',
          options: [
            { id: 'a', text: 'C₆H₅NO₂' },
            { id: 'b', text: 'C₆H₆NO₃' },
            { id: 'c', text: 'C₆H₁₂' },
            { id: 'd', text: 'C₆H₅OH' }
          ],
          correct: 'a',
          explanation: 'Phản ứng thế nitro: C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O.'
        },
        {
          type: 'quiz',
          id: 'g11-l17-c4',
          question: 'Khi nitro hóa toluene, nhóm NO₂ ưu tiên thế vào vị trí',
          options: [
            { id: 'a', text: 'meta' },
            { id: 'b', text: 'ortho và para' },
            { id: 'c', text: 'chỉ vào nhánh CH₃' },
            { id: 'd', text: 'bất kì với tỉ lệ như nhau' }
          ],
          correct: 'b',
          explanation: 'Nhóm CH₃ định hướng nhóm thế mới vào vị trí ortho (2) và para (4).'
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
            'Arene chứa vòng benzene; dãy đồng đẳng benzene CₙH₂ₙ₋₆; benzene phẳng, vòng bền.',
            'Dễ thế (halogen với FeBr₃, nitro với HNO₃/H₂SO₄ đặc), khó cộng (H₂/Ni, Cl₂/ánh sáng).',
            'Benzene không làm mất màu KMnO₄; toluene làm mất màu khi đun nóng; styrene làm mất màu ngay.',
            'Benzene độc, có thể gây ung thư.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Benzene có 3 liên kết đôi nên tính chất giống alkene.', right: 'Electron π phân bố đều trên vòng; benzene **dễ thế, khó cộng**, không làm mất màu nước bromine.' },
            { wrong: 'Toluene bị KMnO₄ oxi hóa phá vỡ vòng benzene.', right: 'Chỉ **nhánh CH₃** bị oxi hóa thành −COOH; vòng benzene được giữ nguyên.' },
            { wrong: 'Thế bromine vào benzene bằng nước bromine ở nhiệt độ thường.', right: 'Cần **Br₂ khan với xúc tác FeBr₃**, đun nóng.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Ôn tập chương 4**.'
        }
      ]
    }
  ]
}
