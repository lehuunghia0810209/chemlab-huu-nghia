// Hóa học 10 · Chương 2 · Bài 6 — Xu hướng biến đổi một số tính chất của nguyên tử
// các nguyên tố trong một chu kì và trong một nhóm.
// Electronegativity: Pauling scale (rounded to 0,01). Radii are approximate
// atomic radii in pm; values differ between sources, only the trend matters.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l6',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Giải thích được xu hướng biến đổi bán kính nguyên tử trong một chu kì, trong một nhóm A (dựa vào lực hút của hạt nhân với electron ngoài cùng và số lớp electron).',
    'Nhận xét và giải thích được xu hướng biến đổi độ âm điện và tính kim loại, phi kim của nguyên tử các nguyên tố trong một chu kì, trong một nhóm A.'
  ],
  prerequisites: [
    'Bài 5: vị trí nguyên tố (chu kì, nhóm) từ cấu hình electron.',
    'Lực hút tĩnh điện tăng khi điện tích tăng và khoảng cách giảm.'
  ],
  sources: [
    programme('Xu hướng biến đổi một số tính chất của nguyên tử các nguyên tố trong một chu kì và trong một nhóm'),
    textbook(10, 6),
    'Độ âm điện theo thang Pauling (bảng tra cứu CRC/IUPAC, làm tròn).'
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
          text: 'Sodium và potassium đều phản ứng mạnh với nước, nhưng potassium mãnh liệt hơn hẳn. Fluorine lại là phi kim hoạt động mạnh nhất. Vị trí trong bảng tuần hoàn giúp dự đoán những điều đó như thế nào?'
        },
        {
          type: 'list',
          items: [
            'Giải thích vì sao bán kính nguyên tử giảm trong chu kì và tăng trong nhóm.',
            'Hiểu độ âm điện và xu hướng biến đổi của nó.',
            'So sánh tính kim loại, phi kim của các nguyên tố dựa vào vị trí.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Chu kì: cùng số lớp electron. Nhóm A: cùng số electron lớp ngoài cùng.', 'Z tăng dần từ trái sang phải trong chu kì.'] }
      ]
    },
    {
      id: 'radius',
      kind: 'concept',
      title: 'Bán kính nguyên tử',
      blocks: [
        {
          type: 'table',
          caption: 'Hai yếu tố quyết định',
          head: ['', 'Trong một chu kì (trái → phải)', 'Trong một nhóm A (trên → dưới)'],
          rows: [
            ['Số lớp electron', 'Không đổi', 'Tăng thêm 1 lớp mỗi chu kì'],
            ['Điện tích hạt nhân', 'Tăng dần', 'Tăng, nhưng ảnh hưởng của số lớp lớn hơn'],
            ['Bán kính nguyên tử', 'Giảm dần', 'Tăng dần']
          ]
        },
        {
          type: 'p',
          text: 'Trong chu kì, electron được thêm vào cùng một lớp ngoài cùng trong khi điện tích hạt nhân tăng, nên lực hút của hạt nhân với electron ngoài cùng mạnh dần và kéo lớp vỏ lại gần. Trong nhóm, mỗi chu kì thêm một lớp electron nên electron ngoài cùng ở xa hạt nhân hơn.'
        },
        {
          type: 'table',
          caption: 'Bán kính nguyên tử chu kì 3 (pm, giá trị gần đúng)',
          head: ['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl'],
          rows: [['186', '160', '143', '117', '110', '104', '99']]
        }
      ]
    },
    {
      id: 'electronegativity',
      kind: 'concept',
      title: 'Độ âm điện',
      blocks: [
        {
          type: 'callout',
          title: 'Độ âm điện (χ)',
          text: 'Là đại lượng đặc trưng cho **khả năng hút electron** của nguyên tử khi tạo liên kết hóa học. Thang thường dùng là thang Pauling.'
        },
        {
          type: 'table',
          caption: 'Độ âm điện Pauling của một số nguyên tố nhóm A',
          head: ['Chu kì', 'IA', 'IIA', 'IIIA', 'IVA', 'VA', 'VIA', 'VIIA'],
          rows: [
            ['2', 'Li 0,98', 'Be 1,57', 'B 2,04', 'C 2,55', 'N 3,04', 'O 3,44', 'F 3,98'],
            ['3', 'Na 0,93', 'Mg 1,31', 'Al 1,61', 'Si 1,90', 'P 2,19', 'S 2,58', 'Cl 3,16'],
            ['4', 'K 0,82', 'Ca 1,00', 'Ga 1,81', 'Ge 2,01', 'As 2,18', 'Se 2,55', 'Br 2,96']
          ]
        },
        {
          type: 'list',
          items: [
            'Trong chu kì: độ âm điện **tăng** từ trái sang phải (bán kính giảm, hạt nhân hút electron mạnh hơn).',
            'Trong nhóm A: độ âm điện nhìn chung **giảm** từ trên xuống (bán kính tăng).',
            'Fluorine có độ âm điện lớn nhất (3,98).'
          ]
        }
      ]
    },
    {
      id: 'metallic',
      kind: 'concept',
      title: 'Tính kim loại và tính phi kim',
      blocks: [
        {
          type: 'list',
          items: [
            '**Tính kim loại**: khả năng nguyên tử **nhường** electron để trở thành ion dương.',
            '**Tính phi kim**: khả năng nguyên tử **nhận** electron để trở thành ion âm.'
          ]
        },
        {
          type: 'table',
          caption: 'Xu hướng biến đổi',
          head: ['', 'Trong chu kì (trái → phải)', 'Trong nhóm A (trên → dưới)'],
          rows: [
            ['Tính kim loại', 'Giảm', 'Tăng'],
            ['Tính phi kim', 'Tăng', 'Giảm']
          ]
        },
        {
          type: 'p',
          text: 'Giải thích: bán kính càng lớn và lực hút của hạt nhân với electron ngoài cùng càng yếu thì nguyên tử càng dễ nhường electron (tính kim loại mạnh). Ngược lại, bán kính nhỏ, độ âm điện lớn thì nguyên tử dễ nhận electron (tính phi kim mạnh).'
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Trả lời câu hỏi mở đầu',
          text: 'K ở dưới Na trong nhóm IA, bán kính lớn hơn nên nhường electron dễ hơn: tính kim loại mạnh hơn. F ở góc trên bên phải (trừ khí hiếm), bán kính nhỏ và độ âm điện lớn nhất: tính phi kim mạnh nhất.'
        }
      ]
    },
    {
      id: 'example-compare',
      kind: 'example',
      title: 'Ví dụ — Sắp xếp theo xu hướng',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho các nguyên tố Mg (Z = 12), Al (Z = 13), Na (Z = 11), K (Z = 19). (a) Sắp xếp theo chiều tăng dần bán kính nguyên tử. (b) Nguyên tố nào có tính kim loại mạnh nhất?',
          steps: [
            'Xác định vị trí: Na (chu kì 3, IA), Mg (chu kì 3, IIA), Al (chu kì 3, IIIA), K (chu kì 4, IA).',
            'Trong chu kì 3, bán kính giảm từ trái sang phải: Al < Mg < Na.',
            'Trong nhóm IA, bán kính tăng từ trên xuống: Na < K.',
            'Gộp lại: Al < Mg < Na < K. Bán kính lớn nhất (K) cũng nhường electron dễ nhất.'
          ],
          answer: '(a) Al < Mg < Na < K. (b) K có tính kim loại mạnh nhất.'
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Cách làm',
          text: 'Luôn xác định chu kì và nhóm trước, so sánh từng cặp cùng chu kì hoặc cùng nhóm, rồi nối các chuỗi lại.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'So sánh lớp vỏ của Na và K',
      blocks: [
        {
          type: 'p',
          text: 'Mở mô hình lớp vỏ electron của sodium rồi của potassium. Đếm số lớp electron của mỗi nguyên tử và giải thích vì sao K có bán kính lớn hơn, nhường electron dễ hơn Na.'
        },
        {
          type: 'activity',
          title: 'Atomic Explorer — Sodium (Na)',
          text: '3 lớp electron: 2, 8, 1.',
          action: { kind: 'atomic', element: 11, mode: 'shell' }
        },
        {
          type: 'activity',
          title: 'Atomic Explorer — Potassium (K)',
          text: '4 lớp electron: 2, 8, 8, 1. Đóng mô hình để quay lại đúng bước này.',
          action: { kind: 'atomic', element: 19, mode: 'shell' }
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
          id: 'g10-l6-c1',
          question: 'Trong một chu kì, theo chiều tăng điện tích hạt nhân, bán kính nguyên tử',
          options: [
            { id: 'a', text: 'tăng dần' },
            { id: 'b', text: 'giảm dần' },
            { id: 'c', text: 'không đổi' },
            { id: 'd', text: 'tăng rồi giảm' }
          ],
          correct: 'b',
          explanation: 'Cùng số lớp electron nhưng điện tích hạt nhân tăng, lực hút electron ngoài cùng mạnh hơn nên bán kính giảm.'
        },
        {
          type: 'quiz',
          id: 'g10-l6-c2',
          question: 'Nguyên tố có độ âm điện lớn nhất trong các nguyên tố sau là',
          options: [
            { id: 'a', text: 'Cl' },
            { id: 'b', text: 'Br' },
            { id: 'c', text: 'O' },
            { id: 'd', text: 'S' }
          ],
          correct: 'c',
          explanation: 'O (3,44) > Cl (3,16) > Br (2,96) > S (2,58).'
        },
        {
          type: 'quiz',
          id: 'g10-l6-c3',
          question: 'Dãy nào sắp xếp đúng theo chiều tính phi kim tăng dần?',
          options: [
            { id: 'a', text: 'Cl, S, P, Si' },
            { id: 'b', text: 'Si, P, S, Cl' },
            { id: 'c', text: 'P, Si, Cl, S' },
            { id: 'd', text: 'S, Cl, Si, P' }
          ],
          correct: 'b',
          explanation: 'Trong chu kì 3, tính phi kim tăng từ trái sang phải: Si (IVA) < P (VA) < S (VIA) < Cl (VIIA).'
        },
        {
          type: 'quiz',
          id: 'g10-l6-c4',
          question: 'Vì sao tính kim loại tăng dần từ trên xuống trong nhóm IA?',
          options: [
            { id: 'a', text: 'Vì số electron lớp ngoài cùng tăng dần.' },
            { id: 'b', text: 'Vì số lớp electron tăng nên electron ngoài cùng ở xa hạt nhân, dễ bị tách ra hơn.' },
            { id: 'c', text: 'Vì độ âm điện tăng dần.' },
            { id: 'd', text: 'Vì điện tích hạt nhân giảm dần.' }
          ],
          correct: 'b',
          explanation: 'Các nguyên tố nhóm IA đều có 1 electron lớp ngoài cùng; số lớp tăng làm electron đó ở xa và bị hút yếu hơn.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết',
      blocks: [
        {
          type: 'table',
          caption: 'Bảng tóm tắt',
          head: ['Tính chất', 'Chu kì (trái → phải)', 'Nhóm A (trên → dưới)'],
          rows: [
            ['Bán kính nguyên tử', 'Giảm', 'Tăng'],
            ['Độ âm điện', 'Tăng', 'Giảm'],
            ['Tính kim loại', 'Giảm', 'Tăng'],
            ['Tính phi kim', 'Tăng', 'Giảm']
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Trong chu kì, Z tăng nên nguyên tử lớn hơn.', right: 'Số lớp không đổi mà hạt nhân hút mạnh hơn nên bán kính **giảm** từ trái sang phải.' },
            { wrong: 'Nguyên tố có độ âm điện lớn thì tính kim loại mạnh.', right: 'Độ âm điện lớn ⇒ dễ hút electron ⇒ **tính phi kim** mạnh.' },
            { wrong: 'So sánh ngay hai nguyên tố khác cả chu kì lẫn nhóm.', right: 'So sánh qua một nguyên tố trung gian **cùng chu kì hoặc cùng nhóm** với từng nguyên tố.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Xu hướng biến đổi thành phần và một số tính chất của hợp chất trong một chu kì** — oxide và hydroxide.'
        }
      ]
    }
  ]
}
