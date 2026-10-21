// Hóa học 12 · Chương 8 · Bài 28 — Sơ lược về phức chất.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l28',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm phức chất, nguyên tử trung tâm, phối tử.',
    'Mô tả được liên kết trong phức chất (liên kết cho – nhận giữa phối tử và nguyên tử trung tâm).',
    'Xác định được điện tích, số phối trí và nêu được một số dạng hình học thường gặp của phức chất (tứ diện, vuông phẳng, bát diện).'
  ],
  prerequisites: [
    'Bài 27: ion kim loại chuyển tiếp.',
    'Hóa 10: liên kết cho – nhận, cặp electron chưa liên kết.'
  ],
  sources: [
    programme('Kim loại chuyển tiếp dãy thứ nhất và phức chất'),
    textbook(12, 28)
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
          text: 'Nhỏ dung dịch ammonia vào dung dịch CuSO₄: đầu tiên xuất hiện kết tủa xanh, nhưng thêm ammonia dư thì kết tủa tan, tạo dung dịch xanh lam đậm rất đẹp. Chất nào đã được tạo thành?'
        },
        {
          type: 'list',
          items: [
            'Nêu khái niệm phức chất, nguyên tử trung tâm, phối tử.',
            'Mô tả liên kết trong phức chất.',
            'Xác định điện tích, số phối trí và dạng hình học của phức chất.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Phân tử NH₃, H₂O có cặp electron chưa liên kết trên N, O.', 'Liên kết cho – nhận: một nguyên tử góp cả cặp electron dùng chung.'] }
      ]
    },
    {
      id: 'definition',
      kind: 'concept',
      title: 'Khái niệm phức chất',
      blocks: [
        {
          type: 'callout',
          title: 'Phức chất',
          text: 'Phức chất đơn giản thường có một **nguyên tử trung tâm** (thường là ion kim loại chuyển tiếp) liên kết với các **phối tử** (phân tử hoặc anion) bao quanh. Phức chất có thể mang điện tích (ion phức) hoặc trung hòa.'
        },
        {
          type: 'table',
          caption: 'Một số phức chất',
          head: ['Phức chất', 'Nguyên tử trung tâm', 'Phối tử', 'Điện tích'],
          rows: [
            ['[Cu(NH₃)₄]²⁺', 'Cu²⁺', '4 NH₃', '+2'],
            ['[Ag(NH₃)₂]⁺', 'Ag⁺', '2 NH₃', '+1'],
            ['[Fe(OH₂)₆]³⁺', 'Fe³⁺', '6 H₂O', '+3'],
            ['[CuCl₄]²⁻', 'Cu²⁺', '4 Cl⁻', '−2'],
            ['[PtCl₂(NH₃)₂]', 'Pt²⁺', '2 Cl⁻, 2 NH₃', '0']
          ]
        },
        {
          type: 'p',
          text: 'Điện tích của phức chất bằng tổng điện tích của nguyên tử trung tâm và các phối tử. Ví dụ [CuCl₄]: (+2) + 4 × (−1) = −2.'
        }
      ]
    },
    {
      id: 'bond',
      kind: 'concept',
      title: 'Liên kết và dạng hình học',
      blocks: [
        {
          type: 'p',
          text: 'Mỗi phối tử có ít nhất một cặp electron chưa liên kết, cho vào orbital trống của nguyên tử trung tâm, tạo **liên kết cho – nhận** (liên kết phối trí). Số liên kết giữa nguyên tử trung tâm và các phối tử gọi là **số phối trí**.'
        },
        {
          type: 'table',
          caption: 'Dạng hình học thường gặp',
          head: ['Số phối trí', 'Dạng hình học', 'Ví dụ'],
          rows: [
            ['2', 'Đường thẳng', '[Ag(NH₃)₂]⁺'],
            ['4', 'Tứ diện', '[CuCl₄]²⁻ (thường được mô tả là tứ diện), [Zn(NH₃)₄]²⁺'],
            ['4', 'Vuông phẳng', '[PtCl₂(NH₃)₂], [Cu(NH₃)₄]²⁺'],
            ['6', 'Bát diện', '[Fe(OH₂)₆]³⁺, [Co(NH₃)₆]³⁺']
          ]
        }
      ]
    },
    {
      id: 'formation',
      kind: 'concept',
      title: 'Sự tạo thành phức chất trong dung dịch',
      blocks: [
        {
          type: 'p',
          text: 'Khi hòa tan muối kim loại chuyển tiếp vào nước, ion kim loại tạo phức aqua, ví dụ [Cu(OH₂)₆]²⁺ có màu xanh. Nhỏ NH₃ vào dung dịch CuSO₄: lúc đầu tạo Cu(OH)₂ kết tủa xanh; NH₃ dư hòa tan kết tủa tạo phức chất màu xanh lam đậm.'
        },
        { type: 'equation', text: 'Cu(OH)₂ + 4NH₃ → [Cu(NH₃)₄](OH)₂', note: 'Phức chất tan, màu xanh lam đậm.' }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Phân tích phức chất',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho ion phức [Co(NH₃)₅Cl]²⁺. Xác định nguyên tử trung tâm (kèm điện tích), các phối tử và số phối trí.',
          steps: [
            'Phối tử: 5 phân tử NH₃ (trung hòa) và 1 ion Cl⁻.',
            'Gọi điện tích của Co là x: x + 5 × 0 + (−1) = +2 ⇒ x = +3.',
            'Số phối trí = 5 + 1 = 6 (dạng bát diện).'
          ],
          answer: 'Nguyên tử trung tâm Co³⁺; phối tử 5 NH₃ và 1 Cl⁻; số phối trí 6.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: phức chất của đồng với ammonia',
      blocks: [
        {
          type: 'p',
          text: 'Trong phòng thí nghiệm ảo, nhỏ dung dịch NH₃ vào dung dịch CuSO₄, quan sát kết tủa xanh xuất hiện rồi tan khi NH₃ dư.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Sơ lược về phức chất',
          text: 'Mở trong Phòng thí nghiệm ảo; quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'guided', grade: 12, lessonId: 'g12-l28', experimentId: 'g12-lesson-28' }
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
          id: 'g12-l28-c1',
          question: 'Trong phức chất [Cu(NH₃)₄]²⁺, phối tử là',
          options: [
            { id: 'a', text: 'Cu²⁺' },
            { id: 'b', text: 'NH₃' },
            { id: 'c', text: 'NH₄⁺' },
            { id: 'd', text: 'OH⁻' }
          ],
          correct: 'b',
          explanation: 'NH₃ có cặp electron chưa liên kết trên N, cho vào Cu²⁺.'
        },
        {
          type: 'quiz',
          id: 'g12-l28-c2',
          question: 'Liên kết giữa phối tử và nguyên tử trung tâm là',
          options: [
            { id: 'a', text: 'liên kết ion' },
            { id: 'b', text: 'liên kết cho – nhận' },
            { id: 'c', text: 'liên kết kim loại' },
            { id: 'd', text: 'liên kết hydrogen' }
          ],
          correct: 'b',
          explanation: 'Phối tử cho cặp electron vào orbital trống của nguyên tử trung tâm.'
        },
        {
          type: 'quiz',
          id: 'g12-l28-c3',
          question: 'Phức chất [Fe(OH₂)₆]³⁺ có dạng hình học',
          options: [
            { id: 'a', text: 'đường thẳng' },
            { id: 'b', text: 'tứ diện' },
            { id: 'c', text: 'vuông phẳng' },
            { id: 'd', text: 'bát diện' }
          ],
          correct: 'd',
          explanation: 'Số phối trí 6 ứng với dạng bát diện.'
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
            'Phức chất: nguyên tử trung tâm (thường ion kim loại chuyển tiếp) + phối tử (phân tử hoặc anion có cặp electron chưa liên kết).',
            'Liên kết cho – nhận; số phối trí = số liên kết với phối tử.',
            'Điện tích phức = tổng điện tích nguyên tử trung tâm và phối tử.',
            'Dạng hình học: đường thẳng (2), tứ diện hoặc vuông phẳng (4), bát diện (6).'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Phối tử nhận electron từ nguyên tử trung tâm.', right: 'Phối tử **cho** cặp electron; nguyên tử trung tâm **nhận** vào orbital trống.' },
            { wrong: 'Điện tích của [CuCl₄] là +2 vì Cu là Cu²⁺.', right: 'Phải cộng cả điện tích phối tử: (+2) + 4 × (−1) = **−2**.' },
            { wrong: 'Số phối trí 4 luôn có dạng tứ diện.', right: 'Số phối trí 4 có thể là **tứ diện hoặc vuông phẳng** tùy phức chất.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Một số tính chất và ứng dụng của phức chất**.'
        }
      ]
    }
  ]
}
