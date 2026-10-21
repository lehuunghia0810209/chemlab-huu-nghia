// Hóa học 10 · Chương 1 · Bài 4 — Ôn tập chương 1 (Cấu tạo nguyên tử).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l4',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa thành phần nguyên tử, nguyên tố hóa học, đồng vị và cấu hình electron.',
    'Vận dụng tổng hợp để giải bài toán về số hạt, đồng vị và dự đoán tính chất nguyên tố.'
  ],
  prerequisites: [
    'Bài 1: Thành phần của nguyên tử.',
    'Bài 2: Nguyên tố hóa học.',
    'Bài 3: Cấu trúc lớp vỏ electron nguyên tử.'
  ],
  sources: [
    programme('Cấu tạo nguyên tử'),
    textbook(10, 4)
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
          text: 'Chỉ cần biết tổng số hạt của một nguyên tử và chênh lệch giữa hạt mang điện với hạt không mang điện, em có thể tìm ra đó là nguyên tố nào, viết cấu hình electron và đoán nó là kim loại hay phi kim. Bài ôn tập này nối các bước đó lại.'
        },
        {
          type: 'list',
          items: [
            'Nhìn lại toàn bộ kiến thức chương 1 trong một bảng.',
            'Giải các bài tổng hợp: số hạt → nguyên tố → cấu hình → tính chất.',
            'Luyện bài toán đồng vị hai chiều.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 1',
      blocks: [
        {
          type: 'table',
          caption: 'Cấu tạo nguyên tử — những gì cần nhớ',
          head: ['Chủ đề', 'Nội dung chính', 'Công thức / quy tắc'],
          rows: [
            ['Thành phần', 'Hạt nhân (p, n) và lớp vỏ (e); p: +1, ≈ 1 amu; n: 0, ≈ 1 amu; e: −1, ≈ 0,00055 amu', 'Số p = số e; m ≈ p + n (amu)'],
            ['Kích thước', 'Nguyên tử ~10⁻¹⁰ m, hạt nhân ~10⁻¹⁵ – 10⁻¹⁴ m', 'Nguyên tử lớn hơn hạt nhân 10⁴ – 10⁵ lần'],
            ['Nguyên tố', 'Các nguyên tử cùng Z; kí hiệu ᴬ_Z X', 'A = Z + N'],
            ['Đồng vị', 'Cùng Z, khác N; tính chất hóa học gần như giống nhau', 'Ā = Σ(Aᵢ·xᵢ) / 100'],
            ['Lớp vỏ electron', 'AO tối đa 2e; lớp n: n² AO, 2n² e', 'Thứ tự 1s 2s 2p 3s 3p 4s 3d…'],
            ['Tính chất', 'Lớp ngoài cùng 1–3e: kim loại; 5–7e: phi kim; 8e: khí hiếm', 'Trừ H, He, B']
          ]
        }
      ]
    },
    {
      id: 'example-identify',
      kind: 'example',
      title: 'Ví dụ 1 — Từ số hạt đến tính chất',
      blocks: [
        {
          type: 'worked',
          problem: 'Nguyên tử X có tổng số hạt proton, neutron, electron là 52; số hạt mang điện nhiều hơn số hạt không mang điện là 16. Xác định X, viết cấu hình electron và cho biết X là kim loại hay phi kim.',
          steps: [
            'Gọi số proton là p (= số electron), số neutron là n: 2p + n = 52 và 2p − n = 16.',
            'Cộng hai phương trình: 4p = 68 ⇒ p = 17; n = 52 − 34 = 18. Số khối A = 17 + 18 = 35.',
            'Z = 17 ⇒ X là chlorine, kí hiệu ³⁵₁₇Cl.',
            'Cấu hình: 1s² 2s² 2p⁶ 3s² 3p⁵; lớp ngoài cùng có 2 + 5 = 7 electron.'
          ],
          answer: 'X là chlorine (Z = 17, A = 35), cấu hình 1s²2s²2p⁶3s²3p⁵, có 7 electron lớp ngoài cùng nên là phi kim.'
        }
      ]
    },
    {
      id: 'example-isotope',
      kind: 'example',
      title: 'Ví dụ 2 — Đồng vị và số nguyên tử',
      blocks: [
        {
          type: 'worked',
          problem: 'Bromine có hai đồng vị ⁷⁹Br và ⁸¹Br, nguyên tử khối trung bình là 79,91. (a) Tính phần trăm số nguyên tử ⁷⁹Br. (b) Trong 1000 nguyên tử bromine có khoảng bao nhiêu nguyên tử ⁸¹Br?',
          steps: [
            'Gọi phần trăm ⁷⁹Br là x: (79x + 81(100 − x)) / 100 = 79,91.',
            '8100 − 2x = 7991 ⇒ x = 54,5. Vậy ⁷⁹Br chiếm 54,5%, ⁸¹Br chiếm 45,5%.',
            'Số nguyên tử ⁸¹Br trong 1000 nguyên tử: 1000 × 45,5% = 455.'
          ],
          answer: '(a) ⁷⁹Br chiếm 54,5%. (b) Khoảng 455 nguyên tử ⁸¹Br.'
        }
      ]
    },
    {
      id: 'example-config',
      kind: 'example',
      title: 'Ví dụ 3 — Đọc cấu hình electron',
      blocks: [
        {
          type: 'worked',
          problem: 'Nguyên tử Y có electron cuối cùng điền vào phân lớp 3p và lớp ngoài cùng có 6 electron. Xác định Z, viết cấu hình theo ô orbital của phân lớp ngoài cùng và cho biết số electron độc thân.',
          steps: [
            'Lớp ngoài cùng là lớp 3 với 6 electron: 3s² 3p⁴.',
            'Cấu hình đầy đủ: 1s² 2s² 2p⁶ 3s² 3p⁴ ⇒ Z = 2 + 2 + 6 + 2 + 4 = 16 (sulfur).',
            '3p⁴ theo quy tắc Hund: [↑↓][↑][↑] ⇒ 2 electron độc thân.'
          ],
          answer: 'Y là sulfur (Z = 16), phi kim, có 2 electron độc thân.'
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
          id: 'g10-l4-c1',
          question: 'Ion ²⁴₁₂Mg²⁺ có số proton, neutron, electron lần lượt là',
          options: [
            { id: 'a', text: '12, 12, 12' },
            { id: 'b', text: '12, 12, 10' },
            { id: 'c', text: '12, 12, 14' },
            { id: 'd', text: '10, 12, 12' }
          ],
          correct: 'b',
          explanation: 'p = Z = 12, n = 24 − 12 = 12. Ion 2+ đã nhường 2 electron nên còn 12 − 2 = 10 electron.'
        },
        {
          type: 'quiz',
          id: 'g10-l4-c2',
          question: 'Nguyên tử nào sau đây có 2 electron lớp ngoài cùng?',
          options: [
            { id: 'a', text: 'O (Z = 8)' },
            { id: 'b', text: 'Ne (Z = 10)' },
            { id: 'c', text: 'Ca (Z = 20)' },
            { id: 'd', text: 'Al (Z = 13)' }
          ],
          correct: 'c',
          explanation: 'Ca: 1s²2s²2p⁶3s²3p⁶4s² → lớp ngoài cùng (n = 4) có 2e. O có 6, Ne có 8, Al có 3.'
        },
        {
          type: 'quiz',
          id: 'g10-l4-c3',
          question: 'Phát biểu nào sai?',
          options: [
            { id: 'a', text: 'Các đồng vị của một nguyên tố có cùng số electron.' },
            { id: 'b', text: 'Số khối bằng tổng số proton và neutron.' },
            { id: 'c', text: 'Mỗi orbital chứa tối đa 2 electron.' },
            { id: 'd', text: 'Khối lượng nguyên tử tập trung chủ yếu ở lớp vỏ electron.' }
          ],
          correct: 'd',
          explanation: 'Khối lượng nguyên tử tập trung ở hạt nhân; electron chỉ nặng khoảng 1/1836 proton.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 1',
      blocks: [
        {
          type: 'list',
          items: [
            'Bài toán số hạt: 2p + n = tổng hạt; 2p − n = chênh lệch hạt mang điện và không mang điện.',
            'Z xác định nguyên tố → viết cấu hình → đếm electron lớp ngoài cùng → dự đoán tính chất.',
            'Bài toán đồng vị hai đồng vị: đặt x% và giải Ā = (A₁x + A₂(100 − x)) / 100.',
            'Ion Mⁿ⁺ có số e = Z − n; ion Xⁿ⁻ có số e = Z + n; số p và n không đổi.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Ion Mg²⁺ có 14 electron.', right: 'Ion dương đã **nhường** electron: Mg²⁺ có 12 − 2 = **10** electron.' },
            { wrong: 'Số electron lớp ngoài cùng của Ca là 8 (lớp 3p⁶).', right: 'Lớp ngoài cùng là lớp có n lớn nhất: Ca có **4s²**, tức 2 electron.' },
            { wrong: 'Đặt ẩn là số neutron ngay rồi quên rằng số hạt mang điện gồm cả p và e.', right: 'Luôn viết **2p + n** cho tổng hạt và **2p − n** cho chênh lệch.' }
          ]
        },
        {
          type: 'p',
          text: 'Chương tiếp theo: **Bảng tuần hoàn các nguyên tố hóa học và định luật tuần hoàn**.'
        }
      ]
    }
  ]
}
