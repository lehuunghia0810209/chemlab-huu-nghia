// Hóa học 12 · Chương 6 · Bài 18 — Cấu tạo và liên kết trong tinh thể kim loại.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l18',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được vị trí của kim loại trong bảng tuần hoàn.',
    'Nêu được đặc điểm cấu hình electron lớp ngoài cùng của nguyên tử kim loại.',
    'Mô tả được đặc điểm của liên kết kim loại và cấu tạo tinh thể kim loại.'
  ],
  prerequisites: [
    'Hóa 10: cấu hình electron, bảng tuần hoàn, xu hướng biến đổi bán kính và độ âm điện.',
    'Hóa 10: liên kết ion, liên kết cộng hóa trị.'
  ],
  sources: [
    programme('Đại cương về kim loại'),
    textbook(12, 18)
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
          text: 'Hơn 80% nguyên tố đã biết là kim loại. Vì sao chúng đều có ánh kim, dễ dát mỏng và dẫn điện tốt, trong khi muối ăn hay đường thì không?'
        },
        {
          type: 'list',
          items: [
            'Xác định vị trí của kim loại trong bảng tuần hoàn.',
            'Nêu đặc điểm cấu hình electron lớp ngoài cùng của nguyên tử kim loại.',
            'Mô tả liên kết kim loại và tinh thể kim loại.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Trong một chu kì, bán kính nguyên tử giảm, độ âm điện tăng từ trái sang phải.', 'Liên kết ion hình thành nhờ lực hút tĩnh điện giữa các ion trái dấu.'] }
      ]
    },
    {
      id: 'position',
      kind: 'concept',
      title: 'Vị trí của kim loại trong bảng tuần hoàn',
      blocks: [
        {
          type: 'list',
          items: [
            'Nhóm IA (trừ H), nhóm IIA, nhóm IIIA (trừ B) và một số nguyên tố ở các nhóm IVA, VA, VIA (như Sn, Pb, Bi).',
            'Tất cả các nguyên tố nhóm B (kim loại chuyển tiếp).',
            'Họ lanthanide và họ actinide.'
          ]
        }
      ]
    },
    {
      id: 'electron',
      kind: 'concept',
      title: 'Đặc điểm cấu tạo nguyên tử kim loại',
      blocks: [
        {
          type: 'list',
          items: [
            'Nguyên tử của hầu hết các kim loại có **ít electron lớp ngoài cùng** (1, 2 hoặc 3 electron). Ví dụ Na: [Ne]3s¹; Mg: [Ne]3s²; Al: [Ne]3s²3p¹.',
            'So với phi kim cùng chu kì, kim loại có **bán kính nguyên tử lớn hơn** và **độ âm điện nhỏ hơn**.',
            'Do đó nguyên tử kim loại dễ nhường electron lớp ngoài cùng để trở thành ion dương.'
          ]
        }
      ]
    },
    {
      id: 'bond',
      kind: 'concept',
      title: 'Liên kết kim loại và tinh thể kim loại',
      blocks: [
        {
          type: 'callout',
          title: 'Liên kết kim loại',
          text: 'Là liên kết được hình thành giữa các ion dương kim loại ở các nút mạng tinh thể do sự tham gia của các **electron hóa trị tự do** chuyển động trong toàn bộ mạng tinh thể.'
        },
        {
          type: 'p',
          text: 'Ở nhiệt độ thường, các kim loại (trừ Hg là chất lỏng) đều ở trạng thái rắn và có cấu tạo tinh thể. Các ion dương sắp xếp đều đặn ở nút mạng, các electron hóa trị chuyển động tự do giữa chúng.'
        },
        {
          type: 'table',
          caption: 'Một số kiểu mạng tinh thể kim loại thường gặp',
          head: ['Kiểu mạng', 'Ví dụ'],
          rows: [
            ['Lập phương tâm khối', 'Na, K, Fe (ở nhiệt độ thường), Cr'],
            ['Lập phương tâm mặt', 'Cu, Al, Ag, Au'],
            ['Lục phương', 'Mg, Zn, Ti']
          ]
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'So sánh với liên kết ion và liên kết cộng hóa trị',
          text: 'Liên kết ion: lực hút giữa ion dương và ion âm. Liên kết cộng hóa trị: cặp electron dùng chung giữa hai nguyên tử. Liên kết kim loại: electron tự do “dùng chung” cho cả mạng tinh thể.'
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Xác định kim loại từ cấu hình electron',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho cấu hình electron của các nguyên tử: X: 1s²2s²2p⁶3s²; Y: 1s²2s²2p⁶3s²3p⁵; Z: 1s²2s²2p⁶3s²3p¹. Nguyên tố nào là kim loại? Xác định vị trí của chúng.',
          steps: [
            'X có 2 electron lớp ngoài cùng (3s²) ⇒ kim loại, chu kì 3, nhóm IIA (Mg).',
            'Y có 7 electron lớp ngoài cùng (3s²3p⁵) ⇒ phi kim (Cl).',
            'Z có 3 electron lớp ngoài cùng (3s²3p¹) ⇒ kim loại, chu kì 3, nhóm IIIA (Al).'
          ],
          answer: 'X (Mg) và Z (Al) là kim loại; Y (Cl) là phi kim.'
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
          id: 'g12-l18-c1',
          question: 'Nguyên tử kim loại thường có số electron lớp ngoài cùng là',
          options: [
            { id: 'a', text: '1, 2 hoặc 3' },
            { id: 'b', text: '5, 6 hoặc 7' },
            { id: 'c', text: '8' },
            { id: 'd', text: '4 hoặc 5' }
          ],
          correct: 'a',
          explanation: 'Kim loại có ít electron lớp ngoài cùng, dễ nhường electron.'
        },
        {
          type: 'quiz',
          id: 'g12-l18-c2',
          question: 'Liên kết kim loại được hình thành do',
          options: [
            { id: 'a', text: 'lực hút giữa ion dương và ion âm' },
            { id: 'b', text: 'cặp electron dùng chung giữa hai nguyên tử' },
            { id: 'c', text: 'electron tự do liên kết các ion dương kim loại trong mạng tinh thể' },
            { id: 'd', text: 'liên kết hydrogen' }
          ],
          correct: 'c',
          explanation: 'Electron hóa trị tự do chuyển động trong toàn mạng tinh thể.'
        },
        {
          type: 'quiz',
          id: 'g12-l18-c3',
          question: 'Ở nhiệt độ thường, kim loại nào ở trạng thái lỏng?',
          options: [
            { id: 'a', text: 'Na' },
            { id: 'b', text: 'Hg' },
            { id: 'c', text: 'Cs' },
            { id: 'd', text: 'Ga' }
          ],
          correct: 'b',
          explanation: 'Thủy ngân là kim loại duy nhất ở trạng thái lỏng ở điều kiện thường.'
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
            'Kim loại: nhóm IA (trừ H), IIA, IIIA (trừ B), một phần IVA – VIA, các nhóm B, lanthanide, actinide.',
            'Ít electron lớp ngoài cùng, bán kính lớn, độ âm điện nhỏ ⇒ dễ nhường electron.',
            'Liên kết kim loại: electron tự do liên kết các ion dương ở nút mạng tinh thể.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Mọi nguyên tố nhóm IA đều là kim loại.', right: '**Hydrogen** thuộc nhóm IA nhưng là phi kim.' },
            { wrong: 'Trong tinh thể kim loại, nút mạng là các nguyên tử trung hòa và ion âm.', right: 'Nút mạng là **nguyên tử và ion dương** kim loại; electron tự do chuyển động giữa chúng.' },
            { wrong: 'Liên kết kim loại giống liên kết cộng hóa trị vì có electron dùng chung.', right: 'Electron trong liên kết kim loại là **của chung cả mạng tinh thể**, không định chỗ giữa hai nguyên tử.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Tính chất vật lí và tính chất hóa học của kim loại**.'
        }
      ]
    }
  ]
}
