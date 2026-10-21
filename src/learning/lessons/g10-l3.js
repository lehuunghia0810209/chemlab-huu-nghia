// Hóa học 10 · Chương 1 · Bài 3 — Cấu trúc lớp vỏ electron nguyên tử.
// Configurations limited to Z ≤ 20 as in the programme; checked in tests
// against src/chem/electronConfiguration.js.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l3',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Trình bày và so sánh được mô hình Rutherford – Bohr với mô hình hiện đại mô tả sự chuyển động của electron trong nguyên tử.',
    'Nêu được khái niệm orbital nguyên tử (AO), hình dạng AO s, p và số electron tối đa trong một AO.',
    'Trình bày được khái niệm lớp, phân lớp electron; số phân lớp trong một lớp, số AO trong một phân lớp và một lớp.',
    'Viết được cấu hình electron theo lớp, phân lớp và theo ô orbital của 20 nguyên tố đầu tiên.',
    'Dựa vào cấu hình electron lớp ngoài cùng dự đoán được nguyên tố là kim loại, phi kim hay khí hiếm.'
  ],
  prerequisites: [
    'Bài 1–2: số electron của nguyên tử bằng số hiệu nguyên tử Z.',
    'Electron mang điện âm, chuyển động xung quanh hạt nhân.'
  ],
  sources: [
    programme('Cấu trúc lớp vỏ electron nguyên tử'),
    textbook(10, 3)
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
          text: 'Sodium (Z = 11) dễ nhường 1 electron, còn chlorine (Z = 17) dễ nhận thêm 1 electron. Cách các electron sắp xếp quanh hạt nhân giải thích điều đó như thế nào?'
        },
        {
          type: 'list',
          items: [
            'Phân biệt quỹ đạo trong mô hình Bohr với orbital trong mô hình hiện đại.',
            'Biết lớp, phân lớp, số orbital và số electron tối đa của chúng.',
            'Viết cấu hình electron và biểu diễn theo ô orbital cho Z = 1 đến 20.',
            'Dự đoán kim loại, phi kim, khí hiếm từ số electron lớp ngoài cùng.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Số electron của nguyên tử = Z.', 'Electron có năng lượng càng thấp thì càng bền.'] }
      ]
    },
    {
      id: 'models',
      kind: 'concept',
      title: 'Từ quỹ đạo Bohr đến orbital',
      blocks: [
        {
          type: 'table',
          caption: 'So sánh hai mô hình',
          head: ['', 'Mô hình Rutherford – Bohr', 'Mô hình hiện đại'],
          rows: [
            ['Chuyển động của electron', 'Trên những quỹ đạo tròn xác định, như hành tinh quanh Mặt Trời', 'Rất nhanh, không theo quỹ đạo xác định; chỉ biết xác suất có mặt ở từng vùng'],
            ['Cách mô tả', 'Bán kính quỹ đạo cố định', 'Đám mây electron, orbital nguyên tử'],
            ['Điểm còn đúng', 'Electron sắp xếp thành các mức năng lượng (lớp)', 'Giữ ý tưởng mức năng lượng và giải thích được nhiều hiện tượng hơn']
          ]
        },
        {
          type: 'callout',
          title: 'Orbital nguyên tử (AO)',
          text: 'Là khu vực không gian xung quanh hạt nhân mà xác suất tìm thấy electron là lớn nhất (khoảng 90%). **Mỗi AO chứa tối đa 2 electron** có chiều tự quay ngược nhau.'
        },
        {
          type: 'list',
          items: [
            'AO **s** có dạng hình cầu.',
            'AO **p** có dạng hai khối cầu đối đỉnh (hình số tám nổi); mỗi phân lớp p có 3 AO px, py, pz định hướng theo ba trục.'
          ]
        }
      ]
    },
    {
      id: 'shells',
      kind: 'concept',
      title: 'Lớp và phân lớp electron',
      blocks: [
        {
          type: 'p',
          text: 'Các electron có năng lượng gần bằng nhau thuộc cùng một **lớp**, đánh số n = 1, 2, 3, 4… (kí hiệu K, L, M, N…). Trong mỗi lớp, các electron có năng lượng bằng nhau thuộc cùng một **phân lớp** s, p, d, f.'
        },
        {
          type: 'table',
          caption: 'Số AO và số electron tối đa',
          head: ['Lớp (n)', 'Các phân lớp', 'Số AO (n²)', 'Số e tối đa (2n²)'],
          rows: [
            ['1 (K)', '1s', '1', '2'],
            ['2 (L)', '2s, 2p', '1 + 3 = 4', '8'],
            ['3 (M)', '3s, 3p, 3d', '1 + 3 + 5 = 9', '18'],
            ['4 (N)', '4s, 4p, 4d, 4f', '1 + 3 + 5 + 7 = 16', '32']
          ]
        },
        {
          type: 'list',
          items: [
            'Phân lớp s có 1 AO (tối đa 2e), p có 3 AO (6e), d có 5 AO (10e), f có 7 AO (14e).',
            'Phân lớp có đủ số electron tối đa gọi là **bão hòa**; có ít hơn là chưa bão hòa.'
          ]
        }
      ]
    },
    {
      id: 'rules',
      kind: 'concept',
      title: 'Viết cấu hình electron',
      blocks: [
        {
          type: 'p',
          text: 'Electron chiếm các phân lớp theo thứ tự **năng lượng tăng dần** (nguyên lí vững bền):'
        },
        {
          type: 'equation',
          text: '1s  2s  2p  3s  3p  4s  3d  4p  5s …',
          note: 'Lưu ý 4s có năng lượng thấp hơn 3d nên được điền trước.',
          check: false
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Xác định số electron (= Z).',
            'Điền lần lượt vào các phân lớp theo thứ tự trên, mỗi phân lớp không quá số electron tối đa.',
            'Viết số electron của phân lớp bằng số mũ: ví dụ 2p⁶.'
          ]
        },
        { type: 'heading', text: 'Biểu diễn theo ô orbital' },
        {
          type: 'list',
          items: [
            '**Nguyên lí Pauli:** mỗi ô (AO) chứa tối đa 2 electron có chiều tự quay ngược nhau (↑↓).',
            '**Quy tắc Hund:** trong cùng phân lớp, electron phân bố vào các ô sao cho số electron độc thân là tối đa; điền một chiều (↑) vào mọi ô trước rồi mới ghép đôi.'
          ]
        },
        {
          type: 'equation',
          text: 'N (Z = 7): 1s² 2s² 2p³   →   2p: [↑][↑][↑]',
          note: 'Ba electron 2p ở ba ô khác nhau: nitrogen có 3 electron độc thân.',
          check: false
        }
      ]
    },
    {
      id: 'example-config',
      kind: 'example',
      title: 'Ví dụ 1 — Cấu hình của Na, Cl và K',
      blocks: [
        {
          type: 'worked',
          problem: 'Viết cấu hình electron của Na (Z = 11), Cl (Z = 17) và K (Z = 19). Cho biết số electron lớp ngoài cùng và số electron độc thân của mỗi nguyên tử.',
          steps: [
            'Na có 11e: 1s² 2s² 2p⁶ 3s¹ → theo lớp 2, 8, 1. Lớp ngoài cùng có 1e, 1 electron độc thân (3s¹).',
            'Cl có 17e: 1s² 2s² 2p⁶ 3s² 3p⁵ → 2, 8, 7. Phân lớp 3p: [↑↓][↑↓][↑] nên có 1 electron độc thân.',
            'K có 19e: sau 3p⁶ (18e), electron thứ 19 vào 4s vì 4s thấp hơn 3d: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s¹ → 2, 8, 8, 1.'
          ],
          answer: 'Na: 3s¹ (1e lớp ngoài, 1 e độc thân); Cl: 3s²3p⁵ (7e lớp ngoài, 1 e độc thân); K: 4s¹ (1e lớp ngoài, 1 e độc thân).'
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Kiểm tra',
          text: 'Cộng các số mũ phải bằng Z: với Cl, 2 + 2 + 6 + 2 + 5 = 17.'
        }
      ]
    },
    {
      id: 'outer-shell',
      kind: 'concept',
      title: 'Lớp ngoài cùng và tính chất nguyên tố',
      blocks: [
        {
          type: 'table',
          caption: 'Dự đoán từ số electron lớp ngoài cùng (với các nguyên tố nhóm A)',
          head: ['Số e lớp ngoài cùng', 'Loại nguyên tố', 'Ví dụ'],
          rows: [
            ['1, 2, 3', 'Thường là kim loại (trừ H, He, B)', 'Na (3s¹), Mg (3s²), Al (3s²3p¹)'],
            ['4', 'Kim loại hoặc phi kim', 'C, Si là phi kim; Sn, Pb là kim loại'],
            ['5, 6, 7', 'Thường là phi kim', 'N (2s²2p³), O (2s²2p⁴), Cl (3s²3p⁵)'],
            ['8 (He: 2)', 'Khí hiếm, rất bền', 'Ne (2s²2p⁶), Ar (3s²3p⁶)']
          ]
        },
        {
          type: 'p',
          text: 'Trả lời câu hỏi mở đầu: Na có 1 electron lớp ngoài cùng nên dễ nhường để đạt lớp vỏ bền như Ne; Cl có 7 electron lớp ngoài cùng nên dễ nhận thêm 1 electron để đạt cấu hình như Ar.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Quan sát orbital 3D',
      blocks: [
        {
          type: 'p',
          text: 'Mở mô hình orbital của chlorine. Xoay mô hình để thấy AO s hình cầu và AO p hình số tám nổi theo ba trục x, y, z.'
        },
        {
          type: 'activity',
          title: 'Atomic Explorer — Chlorine (Cl), chế độ Orbital',
          text: 'Đóng cửa sổ mô hình để quay lại đúng bước này.',
          action: { kind: 'atomic', element: 17, mode: 'orbital' }
        },
        {
          type: 'activity',
          title: 'Atomic Explorer — Potassium (K), lớp vỏ electron',
          text: 'Đếm số electron trên từng lớp: 2, 8, 8, 1.',
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
          id: 'g10-l3-c1',
          question: 'Số electron tối đa trong lớp M (n = 3) là',
          options: [
            { id: 'a', text: '8' },
            { id: 'b', text: '9' },
            { id: 'c', text: '18' },
            { id: 'd', text: '32' }
          ],
          correct: 'c',
          explanation: 'Lớp n chứa tối đa 2n² electron: 2 × 3² = 18 (3s², 3p⁶, 3d¹⁰). Số 9 là số AO của lớp M.'
        },
        {
          type: 'quiz',
          id: 'g10-l3-c2',
          question: 'Cấu hình electron của sulfur (Z = 16) là',
          options: [
            { id: 'a', text: '1s² 2s² 2p⁶ 3s² 3p⁴' },
            { id: 'b', text: '1s² 2s² 2p⁶ 3s² 3p⁶' },
            { id: 'c', text: '1s² 2s² 2p⁶ 3p⁶' },
            { id: 'd', text: '1s² 2s² 2p⁶ 3s² 3d⁴' }
          ],
          correct: 'a',
          explanation: '16 electron điền theo thứ tự 1s, 2s, 2p, 3s, 3p: 2 + 2 + 6 + 2 + 4 = 16.'
        },
        {
          type: 'quiz',
          id: 'g10-l3-c3',
          question: 'Nguyên tử có cấu hình 1s² 2s² 2p⁶ 3s² 3p¹ là',
          options: [
            { id: 'a', text: 'phi kim vì có 1 electron p' },
            { id: 'b', text: 'kim loại vì có 3 electron lớp ngoài cùng' },
            { id: 'c', text: 'khí hiếm vì lớp trong đã bão hòa' },
            { id: 'd', text: 'phi kim vì có 13 electron' }
          ],
          correct: 'b',
          explanation: 'Lớp ngoài cùng (n = 3) có 3s²3p¹ = 3 electron, đặc trưng của kim loại. Đây là aluminium (Z = 13).'
        },
        {
          type: 'quiz',
          id: 'g10-l3-c4',
          question: 'Nguyên tử oxygen (Z = 8) có bao nhiêu electron độc thân?',
          options: [
            { id: 'a', text: '0' },
            { id: 'b', text: '1' },
            { id: 'c', text: '2' },
            { id: 'd', text: '4' }
          ],
          correct: 'c',
          explanation: '2p⁴ theo quy tắc Hund: [↑↓][↑][↑] → 2 electron độc thân.'
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
            'Orbital (AO): vùng có xác suất tìm thấy electron lớn nhất; tối đa 2e/AO. AO s hình cầu, AO p hình số tám nổi.',
            'Lớp n có n phân lớp (n ≤ 4), n² AO và tối đa 2n² electron. s: 2e, p: 6e, d: 10e, f: 14e.',
            'Thứ tự điền: 1s 2s 2p 3s 3p 4s 3d… Nguyên lí Pauli và quy tắc Hund khi điền vào ô.',
            'Lớp ngoài cùng 1–3e: kim loại; 5–7e: phi kim; 8e: khí hiếm.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Electron chuyển động trên quỹ đạo tròn xác định.', right: 'Đó là mô hình Bohr. Trong mô hình hiện đại, electron ở **orbital** — vùng có xác suất tìm thấy lớn.' },
            { wrong: 'Điền 3d trước 4s: K là 1s²2s²2p⁶3s²3p⁶3d¹.', right: '4s có năng lượng thấp hơn 3d nên **K là …3p⁶4s¹**.' },
            { wrong: 'Ghép đôi electron trong một ô trước khi điền ô khác: O là 2p [↑↓][↑↓][ ].', right: 'Theo **quy tắc Hund**: [↑↓][↑][↑], oxygen có 2 electron độc thân.' },
            { wrong: 'Lớp M chứa tối đa 8 electron.', right: 'Lớp M chứa tối đa **18** electron; 8 là số electron khi lớp M là lớp ngoài cùng của khí hiếm Ar.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Ôn tập chương 1** — hệ thống hóa cấu tạo nguyên tử, nguyên tố và cấu hình electron.'
        }
      ]
    }
  ]
}
