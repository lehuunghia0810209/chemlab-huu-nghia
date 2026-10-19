// Hóa học 12 · Chương 6 · Bài 22 — Sự ăn mòn kim loại.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l22',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm ăn mòn kim loại; phân biệt ăn mòn hóa học và ăn mòn điện hóa.',
    'Trình bày được điều kiện và cơ chế ăn mòn điện hóa (ví dụ sự gỉ sắt).',
    'Trình bày được các phương pháp chống ăn mòn kim loại: phương pháp bảo vệ bề mặt, phương pháp điện hóa.'
  ],
  prerequisites: [
    'Bài 15: pin Galvani, anode bị oxi hóa.',
    'Bài 19: tính khử của kim loại.'
  ],
  sources: [
    programme('Đại cương về kim loại'),
    textbook(12, 22)
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
          text: 'Vỏ tàu biển bằng thép được gắn những khối kẽm; cửa sắt được sơn kín; tôn lợp nhà được mạ kẽm. Tất cả nhằm chống lại quá trình nào, và vì sao kẽm lại bảo vệ được sắt?'
        },
        {
          type: 'list',
          items: [
            'Nêu khái niệm ăn mòn kim loại.',
            'Phân biệt ăn mòn hóa học và ăn mòn điện hóa; nêu điều kiện ăn mòn điện hóa.',
            'Giải thích sự gỉ sắt.',
            'Đề xuất biện pháp chống ăn mòn.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Trong pin Galvani, kim loại có E° nhỏ hơn là anode và bị oxi hóa.', 'Kim loại có tính khử: M → Mⁿ⁺ + ne.'] }
      ]
    },
    {
      id: 'definition',
      kind: 'concept',
      title: 'Khái niệm và phân loại',
      blocks: [
        {
          type: 'callout',
          title: 'Ăn mòn kim loại',
          text: 'Là sự phá hủy kim loại hoặc hợp kim do tác dụng của các chất trong môi trường. Bản chất: kim loại bị oxi hóa thành ion, **M → Mⁿ⁺ + ne**.'
        },
        {
          type: 'table',
          caption: 'Hai loại ăn mòn',
          head: ['', 'Ăn mòn hóa học', 'Ăn mòn điện hóa'],
          rows: [
            ['Bản chất', 'Electron của kim loại chuyển trực tiếp đến chất trong môi trường', 'Có dòng electron chuyển từ cực âm sang cực dương (như một pin)'],
            ['Ví dụ', 'Thiết bị trong lò đốt, chi tiết máy tiếp xúc với hơi nước, khí ở nhiệt độ cao', 'Sắt gỉ trong không khí ẩm, vỏ tàu trong nước biển'],
            ['Dòng điện', 'Không phát sinh', 'Phát sinh dòng điện']
          ]
        }
      ]
    },
    {
      id: 'electrochemical',
      kind: 'concept',
      title: 'Ăn mòn điện hóa',
      blocks: [
        {
          type: 'callout',
          title: 'Điều kiện (cần đủ cả ba)',
          text: '(1) Các điện cực khác nhau về bản chất (hai kim loại khác nhau, kim loại – phi kim như Fe – C, kim loại – hợp chất); (2) các điện cực tiếp xúc trực tiếp hoặc gián tiếp qua dây dẫn; (3) các điện cực cùng tiếp xúc với dung dịch chất điện li.'
        },
        {
          type: 'p',
          text: 'Sự gỉ sắt (gang, thép là hợp kim Fe – C) trong không khí ẩm: Fe là cực âm (anode) bị oxi hóa Fe → Fe²⁺ + 2e; ở cực dương (C), O₂ hòa tan trong lớp nước bị khử: O₂ + 2H₂O + 4e → 4OH⁻. Fe²⁺ tiếp tục bị oxi hóa tạo gỉ sắt có thành phần chính Fe₂O₃·nH₂O.'
        },
        {
          type: 'p',
          text: 'Khi hai kim loại tiếp xúc nhau trong dung dịch chất điện li, **kim loại có tính khử mạnh hơn (E° nhỏ hơn) bị ăn mòn**. Ví dụ Fe – Cu: Fe bị ăn mòn; Zn – Fe: Zn bị ăn mòn.'
        }
      ]
    },
    {
      id: 'protection',
      kind: 'concept',
      title: 'Chống ăn mòn kim loại',
      blocks: [
        {
          type: 'table',
          caption: 'Các phương pháp',
          head: ['Phương pháp', 'Cách làm', 'Ví dụ'],
          rows: [
            ['Bảo vệ bề mặt', 'Phủ lên bề mặt kim loại một lớp sơn, dầu mỡ, chất dẻo hoặc mạ kim loại khác để ngăn tiếp xúc với môi trường', 'Sơn cửa sắt; tôn mạ kẽm; sắt tây mạ thiếc'],
            ['Điện hóa', 'Gắn kim loại có tính khử mạnh hơn làm “vật hi sinh” (anode), bị ăn mòn thay cho kim loại cần bảo vệ', 'Gắn khối Zn vào vỏ tàu biển bằng thép, ống dẫn ngầm']
          ]
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Sắt tây và tôn',
          text: 'Sắt tây (Fe mạ Sn) khi bị xước sâu tới lớp Fe thì **Fe bị ăn mòn nhanh** (Fe có tính khử mạnh hơn Sn). Tôn (Fe mạ Zn) bị xước thì **Zn bị ăn mòn**, Fe vẫn được bảo vệ.'
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Xác định kim loại bị ăn mòn',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho các cặp kim loại tiếp xúc trực tiếp, đặt trong không khí ẩm: (1) Fe – Cu; (2) Fe – Zn; (3) Fe – Sn. Trường hợp nào Fe bị ăn mòn trước? (E°: Zn²⁺/Zn −0,76 V; Fe²⁺/Fe −0,44 V; Sn²⁺/Sn −0,14 V; Cu²⁺/Cu +0,34 V)',
          steps: [
            'Trong mỗi cặp, kim loại có E° nhỏ hơn là anode và bị ăn mòn.',
            '(1) E°(Fe) < E°(Cu) ⇒ Fe bị ăn mòn. (3) E°(Fe) < E°(Sn) ⇒ Fe bị ăn mòn.',
            '(2) E°(Zn) < E°(Fe) ⇒ Zn bị ăn mòn, Fe được bảo vệ.'
          ],
          answer: 'Fe bị ăn mòn trong trường hợp (1) và (3).'
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
          id: 'g12-l22-c1',
          question: 'Bản chất của sự ăn mòn kim loại là',
          options: [
            { id: 'a', text: 'kim loại bị khử' },
            { id: 'b', text: 'kim loại bị oxi hóa thành ion dương' },
            { id: 'c', text: 'kim loại tan vào nước' },
            { id: 'd', text: 'kim loại nhận electron' }
          ],
          correct: 'b',
          explanation: 'M → Mⁿ⁺ + ne.'
        },
        {
          type: 'quiz',
          id: 'g12-l22-c2',
          question: 'Để bảo vệ vỏ tàu biển bằng thép theo phương pháp điện hóa, người ta gắn vào vỏ tàu khối kim loại',
          options: [
            { id: 'a', text: 'Cu' },
            { id: 'b', text: 'Zn' },
            { id: 'c', text: 'Sn' },
            { id: 'd', text: 'Pb' }
          ],
          correct: 'b',
          explanation: 'Zn có tính khử mạnh hơn Fe nên bị ăn mòn thay cho Fe.'
        },
        {
          type: 'quiz',
          id: 'g12-l22-c3',
          question: 'Trường hợp nào xảy ra ăn mòn điện hóa?',
          options: [
            { id: 'a', text: 'Đốt dây sắt trong khí Cl₂' },
            { id: 'b', text: 'Thanh Zn nhúng vào dung dịch CuSO₄' },
            { id: 'c', text: 'Thanh Al nhúng vào dung dịch HCl' },
            { id: 'd', text: 'Sắt bị oxi hóa trong lò đốt nhiệt độ cao' }
          ],
          correct: 'b',
          explanation: 'Cu sinh ra bám lên Zn tạo cặp điện cực Zn – Cu cùng nhúng trong dung dịch chất điện li.'
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
            'Ăn mòn kim loại: M → Mⁿ⁺ + ne; gồm ăn mòn hóa học và ăn mòn điện hóa.',
            'Ăn mòn điện hóa cần: hai điện cực khác bản chất, tiếp xúc nhau, cùng trong dung dịch chất điện li; kim loại có E° nhỏ hơn bị ăn mòn.',
            'Gỉ sắt chủ yếu là Fe₂O₃·nH₂O.',
            'Chống ăn mòn: bảo vệ bề mặt (sơn, mạ, dầu mỡ), phương pháp điện hóa (vật hi sinh như Zn).'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Trong cặp Fe – Zn, Fe bị ăn mòn trước vì Fe dễ gỉ.', right: '**Zn** có tính khử mạnh hơn nên bị ăn mòn trước, Fe được bảo vệ.' },
            { wrong: 'Sắt tây bị xước vẫn được thiếc bảo vệ.', right: 'Khi xước sâu, **Fe bị ăn mòn nhanh hơn** vì Fe có tính khử mạnh hơn Sn.' },
            { wrong: 'Ăn mòn điện hóa không cần dung dịch chất điện li.', right: 'Các điện cực phải **cùng tiếp xúc với dung dịch chất điện li** (như lớp nước ẩm hòa tan khí).' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Ôn tập chương 6**.'
        }
      ]
    }
  ]
}
