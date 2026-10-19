// Hóa học 10 · Chương 2 · Bài 9 — Ôn tập chương 2 (Bảng tuần hoàn và định luật tuần hoàn).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l9',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa cấu tạo bảng tuần hoàn, xu hướng biến đổi tính chất nguyên tử và hợp chất, định luật tuần hoàn.',
    'Vận dụng mối liên hệ vị trí – cấu tạo – tính chất để giải bài tập tổng hợp.'
  ],
  prerequisites: [
    'Bài 5: Cấu tạo của bảng tuần hoàn.',
    'Bài 6–7: Xu hướng biến đổi tính chất của nguyên tử và hợp chất.',
    'Bài 8: Định luật tuần hoàn và ý nghĩa của bảng tuần hoàn.'
  ],
  sources: [
    programme('Bảng tuần hoàn các nguyên tố hóa học'),
    textbook(10, 9)
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
          text: 'Hai nguyên tố đứng cạnh nhau trong một chu kì có tổng số proton là 25. Chỉ từ thông tin đó, em có thể biết chúng là gì, nguyên tố nào kim loại mạnh hơn, và hydroxide của chúng có tính chất ra sao không?'
        },
        {
          type: 'list',
          items: [
            'Nhìn lại kiến thức chương 2 trong một bảng.',
            'Giải bài toán tìm nguyên tố từ vị trí, tổng số proton, phần trăm khối lượng.',
            'So sánh tính chất các nguyên tố và hợp chất dựa vào vị trí.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 2',
      blocks: [
        {
          type: 'table',
          caption: 'Bảng tuần hoàn — những gì cần nhớ',
          head: ['Chủ đề', 'Nội dung chính'],
          rows: [
            ['Nguyên tắc sắp xếp', 'Z tăng dần; cùng số lớp → cùng chu kì; cùng số electron hóa trị → cùng nhóm'],
            ['Cấu tạo', 'Ô = Z; 7 chu kì (2, 8, 8, 18, 18, 32, 32 nguyên tố); 8 nhóm A, 8 nhóm B; khối s, p, d, f'],
            ['Xu hướng trong chu kì (→)', 'Bán kính giảm; độ âm điện tăng; tính kim loại giảm, phi kim tăng; tính base của oxide, hydroxide giảm, tính acid tăng'],
            ['Xu hướng trong nhóm A (↓)', 'Bán kính tăng; độ âm điện giảm; tính kim loại tăng, phi kim giảm'],
            ['Hóa trị', 'Cao nhất với O = số nhóm A; phi kim IVA – VIIA: với H = 8 − số nhóm'],
            ['Định luật tuần hoàn', 'Tính chất biến đổi tuần hoàn theo Z do cấu hình lớp ngoài cùng lặp lại']
          ]
        }
      ]
    },
    {
      id: 'example-pair',
      kind: 'example',
      title: 'Ví dụ 1 — Hai nguyên tố kế tiếp',
      blocks: [
        {
          type: 'worked',
          problem: 'A và B là hai nguyên tố đứng kế tiếp nhau trong cùng một chu kì, tổng số proton của chúng là 25 (Z_A < Z_B). Xác định A, B; so sánh tính kim loại và tính base của hydroxide.',
          steps: [
            'Hai nguyên tố kế tiếp trong chu kì: Z_B = Z_A + 1 ⇒ 2Z_A + 1 = 25 ⇒ Z_A = 12, Z_B = 13.',
            'A (Z = 12): 1s²2s²2p⁶3s² ⇒ chu kì 3, nhóm IIA ⇒ Mg. B (Z = 13): 1s²2s²2p⁶3s²3p¹ ⇒ chu kì 3, nhóm IIIA ⇒ Al.',
            'Cùng chu kì 3, Mg đứng trước Al ⇒ tính kim loại Mg > Al.',
            'Hydroxide: Mg(OH)₂ là base yếu; Al(OH)₃ lưỡng tính ⇒ tính base Mg(OH)₂ > Al(OH)₃.'
          ],
          answer: 'A là Mg, B là Al; tính kim loại Mg > Al; tính base Mg(OH)₂ > Al(OH)₃ (lưỡng tính).'
        }
      ]
    },
    {
      id: 'example-oxide',
      kind: 'example',
      title: 'Ví dụ 2 — Tìm nguyên tố từ oxide cao nhất',
      blocks: [
        {
          type: 'worked',
          problem: 'Nguyên tố R thuộc nhóm IVA. Trong oxide cao nhất, oxygen chiếm 53,33% về khối lượng (O = 16). Xác định R và viết công thức hợp chất của R với hydrogen.',
          steps: [
            'Nhóm IVA ⇒ oxide cao nhất RO₂.',
            '%O = 32 / (M(R) + 32) = 0,5333 ⇒ M(R) + 32 = 60,0 ⇒ M(R) ≈ 28.',
            'M = 28 ⇒ R là silicon (Si), oxide cao nhất SiO₂.',
            'Hóa trị với hydrogen = 8 − 4 = 4 ⇒ SiH₄.'
          ],
          answer: 'R là Si; oxide cao nhất SiO₂, hợp chất với hydrogen SiH₄.'
        }
      ]
    },
    {
      id: 'example-order',
      kind: 'example',
      title: 'Ví dụ 3 — Sắp xếp nhiều nguyên tố',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho các nguyên tố F (Z = 9), Cl (Z = 17), S (Z = 16), O (Z = 8). Sắp xếp theo chiều độ âm điện tăng dần.',
          steps: [
            'Vị trí: O (chu kì 2, VIA), F (chu kì 2, VIIA), S (chu kì 3, VIA), Cl (chu kì 3, VIIA).',
            'Cùng chu kì: O < F và S < Cl. Cùng nhóm: S < O và Cl < F.',
            'S nhỏ nhất (dưới O, trước Cl); F lớn nhất. Giữa Cl và O: số liệu Pauling cho Cl 3,16 < O 3,44.'
          ],
          answer: 'S < Cl < O < F.'
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Giới hạn của suy luận theo vị trí',
          text: 'Xu hướng chỉ so sánh chắc chắn được hai nguyên tố cùng chu kì hoặc cùng nhóm. Với cặp chéo như Cl và O, cần dựa vào số liệu độ âm điện.'
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
          id: 'g10-l9-c1',
          question: 'Nguyên tố X có cấu hình electron 1s² 2s² 2p⁶ 3s² 3p⁶ 4s². X thuộc',
          options: [
            { id: 'a', text: 'chu kì 2, nhóm IVA' },
            { id: 'b', text: 'chu kì 4, nhóm IIA' },
            { id: 'c', text: 'chu kì 4, nhóm IVA' },
            { id: 'd', text: 'chu kì 2, nhóm IIA' }
          ],
          correct: 'b',
          explanation: '4 lớp electron ⇒ chu kì 4; electron cuối điền vào 4s, lớp ngoài cùng có 2 electron ⇒ nhóm IIA. X là calcium (Z = 20).'
        },
        {
          type: 'quiz',
          id: 'g10-l9-c2',
          question: 'Dãy nào sắp xếp đúng theo chiều tính acid tăng dần?',
          options: [
            { id: 'a', text: 'HClO₄, H₂SO₄, H₃PO₄' },
            { id: 'b', text: 'H₃PO₄, H₂SO₄, HClO₄' },
            { id: 'c', text: 'H₂SO₄, H₃PO₄, HClO₄' },
            { id: 'd', text: 'H₃PO₄, HClO₄, H₂SO₄' }
          ],
          correct: 'b',
          explanation: 'P, S, Cl đứng theo thứ tự trong chu kì 3, tính phi kim tăng nên tính acid của hydroxide cao nhất tăng.'
        },
        {
          type: 'quiz',
          id: 'g10-l9-c3',
          question: 'Nguyên tố nào có bán kính nguyên tử lớn nhất: Na, Mg, K, Ca?',
          options: [
            { id: 'a', text: 'Na' },
            { id: 'b', text: 'Mg' },
            { id: 'c', text: 'K' },
            { id: 'd', text: 'Ca' }
          ],
          correct: 'c',
          explanation: 'K và Ca ở chu kì 4 (nhiều lớp hơn Na, Mg); trong chu kì 4, K đứng trước Ca nên bán kính lớn hơn.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 2',
      blocks: [
        {
          type: 'list',
          items: [
            'Hai nguyên tố kế tiếp cùng chu kì: Z hơn kém 1. Cùng nhóm A, chu kì nhỏ kế tiếp: Z hơn kém 8 (giữa chu kì 2 và 3).',
            'Bài toán phần trăm khối lượng: xác định dạng công thức theo nhóm trước, rồi lập phương trình với M(R).',
            'So sánh tính chất: đưa về từng cặp cùng chu kì hoặc cùng nhóm.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Hai nguyên tố cùng nhóm A ở hai chu kì liên tiếp luôn hơn kém nhau 8 proton.', right: 'Chỉ đúng giữa chu kì 2 và 3; giữa chu kì 3 và 4 (nhóm IIIA trở đi) là **18**, ví dụ Cl (17) và Br (35).' },
            { wrong: 'Kết luận độ âm điện Cl > O vì Cl có Z lớn hơn.', right: 'Z lớn hơn không có nghĩa độ âm điện lớn hơn; theo số liệu **O (3,44) > Cl (3,16)**.' },
            { wrong: 'Dùng công thức RO₂ cho mọi bài tìm nguyên tố từ oxide.', right: 'Dạng oxide cao nhất phụ thuộc **số nhóm**: R₂O, RO, R₂O₃, RO₂, R₂O₅, RO₃, R₂O₇.' }
          ]
        },
        {
          type: 'p',
          text: 'Chương tiếp theo: **Liên kết hóa học** — quy tắc octet, liên kết ion và liên kết cộng hóa trị.'
        }
      ]
    }
  ]
}
