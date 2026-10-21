// Hóa học 10 · Chương 3 · Bài 10 — Quy tắc octet.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l10',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Trình bày được quy tắc octet trong quá trình hình thành liên kết hóa học cho các nguyên tố nhóm A.',
    'Vận dụng quy tắc octet để dự đoán ion tạo thành hoặc số cặp electron dùng chung của nguyên tử.'
  ],
  prerequisites: [
    'Chương 1: cấu hình electron; chương 2: số electron lớp ngoài cùng = số thứ tự nhóm A.',
    'Khí hiếm có 8 electron lớp ngoài cùng (He có 2).'
  ],
  sources: [
    programme('Quy tắc octet'),
    textbook(10, 10)
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
          text: 'Khí hiếm như neon, argon hầu như không tham gia phản ứng, trong khi sodium và chlorine phản ứng rất mãnh liệt với nhau. Điều gì khiến lớp vỏ của khí hiếm bền đến vậy, và các nguyên tử khác “bắt chước” chúng như thế nào?'
        },
        {
          type: 'list',
          items: [
            'Phát biểu quy tắc octet.',
            'Dự đoán ion mà nguyên tử nhóm A tạo thành bằng cách nhường hoặc nhận electron.',
            'Hiểu cách các nguyên tử phi kim dùng chung electron để đạt octet.',
            'Biết một số trường hợp không tuân theo quy tắc octet.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Ne: 1s² 2s² 2p⁶; Ar: 1s² 2s² 2p⁶ 3s² 3p⁶.', 'Số electron lớp ngoài cùng của nguyên tố nhóm A = số thứ tự nhóm.'] }
      ]
    },
    {
      id: 'rule',
      kind: 'concept',
      title: 'Lớp vỏ bền của khí hiếm và quy tắc octet',
      blocks: [
        {
          type: 'p',
          text: 'Nguyên tử khí hiếm có lớp electron ngoài cùng bão hòa với 8 electron (ns²np⁶), riêng helium có 2 electron (1s²). Cấu hình này rất bền nên khí hiếm hầu như trơ về mặt hóa học ở điều kiện thường.'
        },
        {
          type: 'callout',
          title: 'Quy tắc octet',
          text: 'Khi hình thành liên kết hóa học, nguyên tử của các nguyên tố nhóm A có xu hướng **nhường, nhận hoặc góp chung electron** để đạt cấu hình electron bền vững của khí hiếm, với **8 electron ở lớp ngoài cùng** (hoặc 2 electron như helium).'
        },
        {
          type: 'p',
          text: '“Octet” nghĩa là bộ tám. Hydrogen, lithium, beryllium chỉ cần đạt 2 electron như helium (gọi là “duplet”).'
        }
      ]
    },
    {
      id: 'ions',
      kind: 'concept',
      title: 'Nhường và nhận electron',
      blocks: [
        {
          type: 'p',
          text: 'Kim loại có ít electron lớp ngoài cùng (1–3) nên dễ **nhường** hết số electron đó, tạo **cation**. Phi kim có nhiều electron lớp ngoài cùng (5–7) nên dễ **nhận thêm** electron, tạo **anion**.'
        },
        { type: 'equation', text: 'Na → Na⁺ + e', note: 'Na (2, 8, 1) → Na⁺ (2, 8): giống Ne.' },
        { type: 'equation', text: 'Mg → Mg²⁺ + 2e', note: 'Mg (2, 8, 2) → Mg²⁺ (2, 8): giống Ne.' },
        { type: 'equation', text: 'Cl + e → Cl⁻', note: 'Cl (2, 8, 7) → Cl⁻ (2, 8, 8): giống Ar.' },
        { type: 'equation', text: 'O + 2e → O²⁻', note: 'O (2, 6) → O²⁻ (2, 8): giống Ne.' },
        {
          type: 'table',
          caption: 'Điện tích ion thường gặp của nguyên tố nhóm A',
          head: ['Nhóm', 'IA', 'IIA', 'IIIA', 'VA', 'VIA', 'VIIA'],
          rows: [
            ['e lớp ngoài cùng', '1', '2', '3', '5', '6', '7'],
            ['Xu hướng', 'nhường 1', 'nhường 2', 'nhường 3', 'nhận 3', 'nhận 2', 'nhận 1'],
            ['Ion', 'M⁺', 'M²⁺', 'M³⁺', 'X³⁻', 'X²⁻', 'X⁻'],
            ['Ví dụ', 'Na⁺, K⁺', 'Mg²⁺, Ca²⁺', 'Al³⁺', 'N³⁻', 'O²⁻, S²⁻', 'F⁻, Cl⁻']
          ]
        }
      ]
    },
    {
      id: 'sharing',
      kind: 'concept',
      title: 'Góp chung electron',
      blocks: [
        {
          type: 'p',
          text: 'Hai nguyên tử phi kim đều có xu hướng nhận electron, nên chúng **góp chung** electron. Mỗi cặp electron dùng chung được tính cho cả hai nguyên tử.'
        },
        {
          type: 'table',
          caption: 'Số cặp electron dùng chung để đạt octet',
          head: ['Phân tử', 'Mỗi nguyên tử thiếu', 'Số cặp dùng chung', 'Công thức cấu tạo'],
          rows: [
            ['H₂', 'H thiếu 1e để có 2e', '1', 'H–H'],
            ['Cl₂', 'Cl thiếu 1e để có 8e', '1', 'Cl–Cl'],
            ['O₂', 'O thiếu 2e', '2', 'O=O'],
            ['N₂', 'N thiếu 3e', '3', 'N≡N'],
            ['H₂O', 'O thiếu 2e, mỗi H thiếu 1e', '2 (hai liên kết O–H)', 'H–O–H']
          ]
        },
        {
          type: 'p',
          text: 'Trong H₂O, nguyên tử O có 2 cặp electron dùng chung với 2 nguyên tử H và còn 2 cặp electron chưa liên kết: tổng 8 electron quanh O.'
        }
      ]
    },
    {
      id: 'example-ions',
      kind: 'example',
      title: 'Ví dụ 1 — Dự đoán ion và hợp chất',
      blocks: [
        {
          type: 'worked',
          problem: 'Nguyên tố X có Z = 20 và nguyên tố Y có Z = 9. Theo quy tắc octet, X và Y tạo ion gì? Viết công thức hợp chất tạo bởi X và Y.',
          steps: [
            'X (Z = 20): 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² — 2 electron lớp ngoài cùng, là kim loại (Ca) ⇒ nhường 2e tạo X²⁺, có cấu hình như Ar.',
            'Y (Z = 9): 1s² 2s² 2p⁵ — 7 electron lớp ngoài cùng, là phi kim (F) ⇒ nhận 1e tạo Y⁻, có cấu hình như Ne.',
            'Hợp chất trung hòa điện: 1 ion X²⁺ cần 2 ion Y⁻ ⇒ XY₂.'
          ],
          answer: 'X tạo Ca²⁺, Y tạo F⁻; hợp chất là CaF₂.'
        }
      ]
    },
    {
      id: 'exceptions',
      kind: 'concept',
      title: 'Giới hạn của quy tắc octet',
      blocks: [
        {
          type: 'p',
          text: 'Quy tắc octet giải thích được phần lớn hợp chất của nguyên tố nhóm A ở chu kì 2 và 3, nhưng có ngoại lệ:'
        },
        {
          type: 'list',
          items: [
            '**Ít hơn 8 electron:** trong BF₃, nguyên tử B chỉ có 6 electron xung quanh.',
            '**Nhiều hơn 8 electron:** trong PCl₅, nguyên tử P có 10 electron xung quanh (nguyên tố từ chu kì 3 trở đi có thể có hơn 8 electron xung quanh).',
            '**Số electron lẻ:** phân tử NO có tổng 11 electron hóa trị nên không thể mọi nguyên tử đều có 8 electron.'
          ]
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Ghi nhớ',
          text: 'Quy tắc octet là một quy tắc kinh nghiệm hữu ích, không phải định luật. Các nguyên tố chuyển tiếp (nhóm B) thường không tuân theo quy tắc này.'
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
          id: 'g10-l10-c1',
          question: 'Theo quy tắc octet, nguyên tử aluminium (Z = 13) có xu hướng',
          options: [
            { id: 'a', text: 'nhận 5 electron' },
            { id: 'b', text: 'nhường 3 electron' },
            { id: 'c', text: 'nhường 1 electron' },
            { id: 'd', text: 'nhận 3 electron' }
          ],
          correct: 'b',
          explanation: 'Al: 2, 8, 3 — nhường 3 electron lớp ngoài cùng tạo Al³⁺ (2, 8) giống Ne.'
        },
        {
          type: 'quiz',
          id: 'g10-l10-c2',
          question: 'Ion S²⁻ có cấu hình electron giống khí hiếm nào?',
          options: [
            { id: 'a', text: 'Ne' },
            { id: 'b', text: 'Ar' },
            { id: 'c', text: 'He' },
            { id: 'd', text: 'Kr' }
          ],
          correct: 'b',
          explanation: 'S (Z = 16) nhận 2 electron: 18 electron, cấu hình 1s²2s²2p⁶3s²3p⁶ giống Ar.'
        },
        {
          type: 'quiz',
          id: 'g10-l10-c3',
          question: 'Trong phân tử N₂, mỗi nguyên tử N góp chung bao nhiêu electron?',
          options: [
            { id: 'a', text: '1' },
            { id: 'b', text: '2' },
            { id: 'c', text: '3' },
            { id: 'd', text: '5' }
          ],
          correct: 'c',
          explanation: 'N có 5 electron lớp ngoài cùng, thiếu 3 để đạt octet ⇒ mỗi N góp 3 electron, tạo 3 cặp dùng chung (N≡N).'
        },
        {
          type: 'quiz',
          id: 'g10-l10-c4',
          question: 'Phân tử nào có nguyên tử trung tâm không đạt octet vì có ít hơn 8 electron?',
          options: [
            { id: 'a', text: 'H₂O' },
            { id: 'b', text: 'NH₃' },
            { id: 'c', text: 'BF₃' },
            { id: 'd', text: 'CH₄' }
          ],
          correct: 'c',
          explanation: 'B có 3 electron hóa trị, tạo 3 liên kết với F nên chỉ có 6 electron xung quanh.'
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
            'Quy tắc octet: nguyên tử nhóm A nhường, nhận hoặc góp chung electron để có 8 electron lớp ngoài cùng (H: 2) như khí hiếm.',
            'Kim loại nhóm IA, IIA, IIIA tạo ion M⁺, M²⁺, M³⁺; phi kim nhóm VA, VIA, VIIA tạo X³⁻, X²⁻, X⁻.',
            'Hai phi kim góp chung electron: số cặp dùng chung = số electron còn thiếu để đạt octet.',
            'Ngoại lệ: BF₃ (thiếu), PCl₅ (thừa), NO (số electron lẻ).'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Cl đạt octet bằng cách nhường 7 electron.', right: 'Cl có 7 electron lớp ngoài cùng nên **nhận thêm 1 electron** tạo Cl⁻.' },
            { wrong: 'Ion Na⁺ có cấu hình giống Ar.', right: 'Na⁺ có 10 electron, cấu hình giống **Ne**.' },
            { wrong: 'Mọi phân tử đều tuân theo quy tắc octet.', right: 'Có ngoại lệ như **BF₃, PCl₅, NO**; quy tắc chỉ là kinh nghiệm.' },
            { wrong: 'Hydrogen cũng cần 8 electron.', right: 'Hydrogen chỉ cần **2 electron** như helium.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Liên kết ion** — sự hình thành và tính chất của hợp chất ion.'
        }
      ]
    }
  ]
}
