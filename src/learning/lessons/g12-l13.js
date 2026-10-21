// Hóa học 12 · Chương 4 · Bài 13 — Vật liệu polymer.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l13',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm và thành phần của chất dẻo, vật liệu composite; ứng dụng của một số chất dẻo thông dụng (PE, PP, PS, PVC, PMMA, PPF).',
    'Nêu được khái niệm, phân loại tơ; cấu tạo, tính chất và ứng dụng của một số tơ (nylon-6,6, capron, nitron, tơ visco, tơ cellulose acetate).',
    'Nêu được khái niệm cao su; cấu tạo, tính chất, ứng dụng của cao su thiên nhiên và một số cao su tổng hợp; sự lưu hóa cao su.',
    'Nêu được khái niệm và ứng dụng của keo dán; tác hại của rác thải polymer và biện pháp sử dụng hợp lí.'
  ],
  prerequisites: ['Bài 12: trùng hợp, trùng ngưng, khâu mạch.'],
  sources: [
    programme('Polymer'),
    textbook(12, 13)
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
          text: 'Áo mưa, dây dù, lốp xe, keo dán sắt và cả thân máy bay bằng sợi carbon đều làm từ vật liệu polymer. Mỗi loại vật liệu đòi hỏi tính chất gì, và chúng gây ra những vấn đề môi trường nào?'
        },
        {
          type: 'list',
          items: [
            'Nêu thành phần, ứng dụng của chất dẻo và vật liệu composite.',
            'Phân loại tơ; viết phản ứng tạo một số tơ tổng hợp.',
            'Nêu cấu tạo của cao su, ý nghĩa của sự lưu hóa.',
            'Nêu ứng dụng của keo dán; sử dụng và xử lí rác thải polymer hợp lí.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Trùng hợp cần liên kết bội; trùng ngưng cần ít nhất hai nhóm chức.', 'Lưu hóa cao su là phản ứng khâu mạch.'] }
      ]
    },
    {
      id: 'plastics',
      kind: 'concept',
      title: 'Chất dẻo và vật liệu composite',
      blocks: [
        {
          type: 'callout',
          title: 'Chất dẻo',
          text: 'Là vật liệu polymer có tính dẻo. Thành phần gồm polymer và có thể thêm chất phụ gia (chất hóa dẻo, chất độn, chất màu, chất chống oxi hóa…).'
        },
        {
          type: 'table',
          caption: 'Một số chất dẻo thông dụng',
          head: ['Chất dẻo', 'Monomer', 'Ứng dụng'],
          rows: [
            ['PE', 'CH₂=CH₂', 'Màng mỏng, túi, chai lọ'],
            ['PP', 'CH₂=CH−CH₃', 'Hộp đựng thực phẩm, chai lọ'],
            ['PS', 'C₆H₅CH=CH₂', 'Hộp xốp, vỏ thiết bị'],
            ['PVC', 'CH₂=CHCl', 'Ống dẫn nước, vỏ dây điện, áo mưa'],
            ['PMMA (thủy tinh hữu cơ)', 'CH₂=C(CH₃)COOCH₃', 'Kính ô tô, kính bảo hộ, răng giả (trong suốt, bền)'],
            ['PPF', 'Phenol + formaldehyde (trùng ngưng)', 'Nhựa bakelite: vỏ thiết bị điện, keo dán']
          ]
        },
        {
          type: 'callout',
          title: 'Vật liệu composite',
          text: 'Là vật liệu tổ hợp từ hai hay nhiều vật liệu khác nhau, gồm **vật liệu nền** (thường là polymer) và **vật liệu cốt** (sợi thủy tinh, sợi carbon, bột khoáng…). Composite có độ bền cao, nhẹ, dùng làm vỏ tàu thuyền, chi tiết máy bay, dụng cụ thể thao.'
        }
      ]
    },
    {
      id: 'fibers',
      kind: 'concept',
      title: 'Tơ',
      blocks: [
        {
          type: 'p',
          text: 'Tơ là vật liệu polymer hình sợi dài và mảnh, có độ bền nhất định. Phân tử polymer trong tơ có mạch không phân nhánh, sắp xếp song song.'
        },
        {
          type: 'table',
          caption: 'Phân loại tơ',
          head: ['Loại', 'Ví dụ'],
          rows: [
            ['Tơ thiên nhiên', 'Bông (cellulose), len, tơ tằm (protein)'],
            ['Tơ tổng hợp', 'Nylon-6,6; capron (nylon-6); nitron (olon)'],
            ['Tơ bán tổng hợp (nhân tạo)', 'Tơ visco, tơ cellulose acetate (từ cellulose)']
          ]
        },
        { type: 'equation', text: 'nH₂N[CH₂]₆NH₂ + nHOOC[CH₂]₄COOH → (−NH[CH₂]₆NHCO[CH₂]₄CO−)ₙ + 2nH₂O', condition: 't°', note: 'Trùng ngưng tạo nylon-6,6 (polyamide): bền, dai, mềm, óng mượt; kém bền với nhiệt, acid và kiềm.', check: false },
        { type: 'equation', text: 'nCH₂=CH−CN → (−CH₂−CH(CN)−)ₙ', condition: 'xt, t°, p', note: 'Trùng hợp acrylonitrile tạo tơ nitron (olon): dai, giữ nhiệt tốt, dùng dệt vải may áo ấm.', check: false }
      ]
    },
    {
      id: 'rubber',
      kind: 'concept',
      title: 'Cao su và keo dán',
      blocks: [
        {
          type: 'callout',
          title: 'Cao su',
          text: 'Là vật liệu polymer có **tính đàn hồi**. Cao su thiên nhiên là polyisoprene (−CH₂−C(CH₃)=CH−CH₂−)ₙ có cấu hình cis.'
        },
        {
          type: 'table',
          caption: 'Một số loại cao su',
          head: ['Cao su', 'Monomer', 'Đặc điểm'],
          rows: [
            ['Cao su thiên nhiên', 'Isoprene (từ mủ cây cao su)', 'Đàn hồi tốt, không dẫn điện, không thấm nước, khí'],
            ['Cao su buna', 'Buta-1,3-diene', 'Đàn hồi kém cao su thiên nhiên'],
            ['Cao su buna-S', 'Buta-1,3-diene + styrene', 'Đàn hồi cao'],
            ['Cao su buna-N', 'Buta-1,3-diene + acrylonitrile', 'Chống dầu khá tốt'],
            ['Cao su chloroprene', 'Chloroprene', 'Bền với dầu mỡ']
          ]
        },
        {
          type: 'p',
          text: '**Lưu hóa cao su**: đun cao su với sulfur, các cầu −S−S− nối các mạch thành mạng không gian. Cao su lưu hóa đàn hồi, chịu nhiệt, lâu mòn, khó tan hơn cao su thô.'
        },
        {
          type: 'p',
          text: '**Keo dán** là vật liệu có khả năng kết dính hai bề mặt vật liệu rắn với nhau mà không làm biến đổi bản chất của chúng. Ví dụ: keo epoxy (dán kim loại, gốm, thủy tinh), keo poly(phenol-formaldehyde), hồ tinh bột.'
        }
      ]
    },
    {
      id: 'environment',
      kind: 'concept',
      title: 'Rác thải polymer và sử dụng hợp lí',
      blocks: [
        {
          type: 'list',
          items: [
            'Nhiều polymer tổng hợp rất bền, khó phân hủy trong tự nhiên; vi nhựa gây ô nhiễm đất, nước và ảnh hưởng sức khỏe.',
            'Đốt rác thải nhựa (nhất là PVC) sinh ra khí độc.',
            'Biện pháp: giảm sử dụng đồ nhựa dùng một lần, tái sử dụng, phân loại và tái chế; dùng polymer phân hủy sinh học.'
          ]
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Số mắt xích trong tơ và cao su',
      blocks: [
        {
          type: 'worked',
          problem: '(a) Một đoạn mạch nylon-6,6 có phân tử khối 27 120. Tính số mắt xích. (b) Một đoạn mạch cao su thiên nhiên có phân tử khối 108 800. Tính số mắt xích isoprene (C = 12, H = 1, N = 14, O = 16).',
          steps: [
            '(a) Mắt xích −NH[CH₂]₆NHCO[CH₂]₄CO− là C₁₂H₂₂N₂O₂, M = 226 ⇒ n = 27 120 / 226 = 120.',
            '(b) Mắt xích C₅H₈ có M = 68 ⇒ n = 108 800 / 68 = 1 600.'
          ],
          answer: '(a) 120 mắt xích; (b) 1 600 mắt xích.'
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
          id: 'g12-l13-c1',
          question: 'Thủy tinh hữu cơ được điều chế bằng cách trùng hợp',
          options: [
            { id: 'a', text: 'vinyl chloride' },
            { id: 'b', text: 'methyl methacrylate' },
            { id: 'c', text: 'styrene' },
            { id: 'd', text: 'acrylonitrile' }
          ],
          correct: 'b',
          explanation: 'Thủy tinh hữu cơ là PMMA.'
        },
        {
          type: 'quiz',
          id: 'g12-l13-c2',
          question: 'Tơ nào thuộc loại tơ bán tổng hợp?',
          options: [
            { id: 'a', text: 'Tơ tằm' },
            { id: 'b', text: 'Nylon-6,6' },
            { id: 'c', text: 'Tơ visco' },
            { id: 'd', text: 'Tơ nitron' }
          ],
          correct: 'c',
          explanation: 'Tơ visco được chế biến hóa học từ cellulose thiên nhiên.'
        },
        {
          type: 'quiz',
          id: 'g12-l13-c3',
          question: 'Mục đích của lưu hóa cao su là',
          options: [
            { id: 'a', text: 'làm cao su tan tốt trong xăng' },
            { id: 'b', text: 'tạo mạng không gian, tăng tính đàn hồi và độ bền' },
            { id: 'c', text: 'cắt mạch cao su thành monomer' },
            { id: 'd', text: 'làm cao su dẫn điện' }
          ],
          correct: 'b',
          explanation: 'Cầu disulfide nối các mạch cao su.'
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
            'Chất dẻo: PE, PP, PS, PVC, PMMA, PPF; composite = vật liệu nền + vật liệu cốt.',
            'Tơ: thiên nhiên, tổng hợp (nylon-6,6, capron, nitron), bán tổng hợp (visco, cellulose acetate).',
            'Cao su: thiên nhiên (polyisoprene), buna, buna-S, buna-N, chloroprene; lưu hóa tạo mạng không gian.',
            'Keo dán kết dính bề mặt vật liệu; hạn chế, tái chế rác thải polymer.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Nylon-6,6 được điều chế bằng phản ứng trùng hợp.', right: 'Nylon-6,6 tạo bằng **trùng ngưng** hexamethylenediamine và adipic acid, giải phóng nước.' },
            { wrong: 'Tơ tằm và bông đều là protein.', right: 'Tơ tằm, len là **protein**; bông là **cellulose**.' },
            { wrong: 'Đốt rác nhựa là cách xử lí an toàn.', right: 'Đốt nhựa (đặc biệt PVC) **sinh khí độc**; nên giảm dùng, tái chế, dùng vật liệu phân hủy sinh học.' }
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
