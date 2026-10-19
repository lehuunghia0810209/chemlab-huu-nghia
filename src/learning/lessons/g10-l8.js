// Hóa học 10 · Chương 2 · Bài 8 — Định luật tuần hoàn. Ý nghĩa của bảng tuần hoàn.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l8',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Phát biểu được định luật tuần hoàn.',
    'Trình bày được ý nghĩa của bảng tuần hoàn: mối liên hệ giữa vị trí (trong bảng tuần hoàn) với tính chất và ngược lại.'
  ],
  prerequisites: [
    'Bài 5: vị trí nguyên tố (ô, chu kì, nhóm) từ cấu hình electron.',
    'Bài 6–7: xu hướng biến đổi tính chất nguyên tử, oxide và hydroxide trong chu kì, nhóm.'
  ],
  sources: [
    programme('Định luật tuần hoàn. Ý nghĩa của bảng tuần hoàn các nguyên tố hóa học'),
    textbook(10, 8)
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
          text: 'Khi lập bảng, Mendeleev dự đoán khá chính xác nguyên tử khối và tính chất của một nguyên tố chưa ai tìm thấy, nằm dưới silicon. Mười lăm năm sau, germanium được phát hiện với tính chất rất gần lời dự đoán. Điều gì cho phép “đoán trước” như vậy?'
        },
        {
          type: 'list',
          items: [
            'Phát biểu định luật tuần hoàn và giải thích nguyên nhân.',
            'Dùng vị trí trong bảng tuần hoàn để suy ra cấu tạo nguyên tử và tính chất.',
            'Suy ra hóa trị cao nhất với oxygen và hóa trị với hydrogen.',
            'So sánh tính chất một nguyên tố với các nguyên tố lân cận.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        {
          type: 'list',
          items: [
            'Chu kì = số lớp electron; nhóm A = số electron lớp ngoài cùng.',
            'Trong chu kì: tính kim loại giảm, tính phi kim tăng; trong nhóm A: ngược lại.'
          ]
        }
      ]
    },
    {
      id: 'law',
      kind: 'concept',
      title: 'Định luật tuần hoàn',
      blocks: [
        {
          type: 'callout',
          title: 'Định luật tuần hoàn',
          text: 'Tính chất của các nguyên tố và đơn chất, cũng như thành phần và tính chất của các hợp chất tạo nên từ các nguyên tố đó **biến đổi tuần hoàn theo chiều tăng của điện tích hạt nhân** nguyên tử.'
        },
        {
          type: 'p',
          text: '**Nguyên nhân:** cấu hình electron lớp ngoài cùng của nguyên tử được lặp lại một cách tuần hoàn khi Z tăng. Ví dụ Li (2s¹), Na (3s¹), K (4s¹) đều có 1 electron lớp ngoài cùng nên đều là kim loại kiềm hoạt động mạnh.'
        },
        {
          type: 'table',
          caption: 'Sự lặp lại cấu hình lớp ngoài cùng',
          head: ['Nhóm', 'Chu kì 2', 'Chu kì 3', 'Chu kì 4', 'Lớp ngoài cùng'],
          rows: [
            ['IA', 'Li', 'Na', 'K', 'ns¹'],
            ['IIA', 'Be', 'Mg', 'Ca', 'ns²'],
            ['VIIA', 'F', 'Cl', 'Br', 'ns²np⁵'],
            ['VIIIA', 'Ne', 'Ar', 'Kr', 'ns²np⁶']
          ]
        }
      ]
    },
    {
      id: 'meaning',
      kind: 'concept',
      title: 'Ý nghĩa của bảng tuần hoàn',
      blocks: [
        {
          type: 'p',
          text: 'Vị trí, cấu tạo nguyên tử và tính chất liên hệ chặt chẽ với nhau. Biết một trong ba điều, có thể suy ra hai điều còn lại.'
        },
        {
          type: 'table',
          caption: 'Từ vị trí suy ra cấu tạo và tính chất (nhóm A)',
          head: ['Biết', 'Suy ra'],
          rows: [
            ['Số thứ tự ô', 'Z = số proton = số electron'],
            ['Số thứ tự chu kì', 'Số lớp electron'],
            ['Số thứ tự nhóm A', 'Số electron lớp ngoài cùng; hóa trị cao nhất với oxygen'],
            ['Vị trí trong chu kì, nhóm', 'Kim loại hay phi kim; so sánh bán kính, độ âm điện, tính acid – base của oxide, hydroxide']
          ]
        },
        { type: 'heading', text: 'Hóa trị cao nhất với oxygen và hóa trị với hydrogen' },
        {
          type: 'table',
          caption: 'Các nguyên tố phi kim nhóm IVA – VIIA',
          head: ['Nhóm', 'IVA', 'VA', 'VIA', 'VIIA'],
          rows: [
            ['Oxide cao nhất', 'RO₂', 'R₂O₅', 'RO₃', 'R₂O₇'],
            ['Hợp chất với hydrogen', 'RH₄', 'RH₃', 'H₂R', 'HR'],
            ['Ví dụ (chu kì 3)', 'SiO₂ / SiH₄', 'P₂O₅ / PH₃', 'SO₃ / H₂S', 'Cl₂O₇ / HCl']
          ]
        },
        {
          type: 'equation',
          text: 'hóa trị cao nhất với O + hóa trị với H = 8',
          note: 'Áp dụng cho phi kim nhóm IVA – VIIA. Ví dụ S: VI + II = 8.',
          check: false
        }
      ]
    },
    {
      id: 'example-sulfur',
      kind: 'example',
      title: 'Ví dụ 1 — Từ vị trí suy ra tính chất',
      blocks: [
        {
          type: 'worked',
          problem: 'Sulfur ở ô số 16, chu kì 3, nhóm VIA. Hãy cho biết: cấu hình electron, kim loại hay phi kim, công thức oxide cao nhất, hydroxide tương ứng, hợp chất với hydrogen; so sánh tính phi kim của S với P và Cl, với O.',
          steps: [
            'Ô 16 ⇒ Z = 16; chu kì 3 ⇒ 3 lớp; nhóm VIA ⇒ 6 electron lớp ngoài cùng: 1s² 2s² 2p⁶ 3s² 3p⁴.',
            '6 electron lớp ngoài cùng ⇒ S là phi kim.',
            'Hóa trị cao nhất với oxygen là VI ⇒ oxide cao nhất SO₃, hydroxide H₂SO₄ (acid mạnh). Hóa trị với hydrogen là 8 − 6 = II ⇒ H₂S.',
            'Cùng chu kì 3: P < S < Cl về tính phi kim. Cùng nhóm VIA: O ở trên S nên tính phi kim O > S.'
          ],
          answer: 'S: 1s²2s²2p⁶3s²3p⁴, phi kim; SO₃, H₂SO₄, H₂S; tính phi kim P < S < Cl và S < O.'
        }
      ]
    },
    {
      id: 'example-hydride',
      kind: 'example',
      title: 'Ví dụ 2 — Xác định nguyên tố từ hợp chất với hydrogen',
      blocks: [
        {
          type: 'worked',
          problem: 'Nguyên tố R có oxide cao nhất là R₂O₅. Trong hợp chất khí với hydrogen, R chứa 91,18% về khối lượng (H = 1). Xác định R.',
          steps: [
            'Oxide cao nhất R₂O₅ ⇒ R thuộc nhóm VA ⇒ hóa trị với hydrogen là 8 − 5 = 3 ⇒ hợp chất RH₃.',
            '%H = 100% − 91,18% = 8,82%.',
            '%H = 3 / (M(R) + 3) = 0,0882 ⇒ M(R) + 3 = 34,0 ⇒ M(R) ≈ 31.'
          ],
          answer: 'M(R) = 31 ⇒ R là phosphorus (P); hợp chất là PH₃, oxide cao nhất P₂O₅.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Kiểm tra lại trên bảng tuần hoàn',
      blocks: [
        {
          type: 'p',
          text: 'Mở thẻ nguyên tố sulfur. Đối chiếu ô, chu kì, nhóm và cấu hình electron với ví dụ 1. Sau đó xem germanium (ô 32) — nguyên tố mà Mendeleev đã dự đoán.'
        },
        {
          type: 'activity',
          title: 'Bảng tuần hoàn — Sulfur (S)',
          text: 'Quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'periodic', element: 16 }
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
          id: 'g10-l8-c1',
          question: 'Tính chất các nguyên tố biến đổi tuần hoàn theo chiều tăng của',
          options: [
            { id: 'a', text: 'nguyên tử khối' },
            { id: 'b', text: 'số neutron' },
            { id: 'c', text: 'điện tích hạt nhân nguyên tử' },
            { id: 'd', text: 'số lớp electron' }
          ],
          correct: 'c',
          explanation: 'Định luật tuần hoàn phát biểu theo chiều tăng điện tích hạt nhân (Z), vì cấu hình electron lớp ngoài cùng lặp lại theo Z.'
        },
        {
          type: 'quiz',
          id: 'g10-l8-c2',
          question: 'Nguyên tố thuộc nhóm VIIA có hợp chất với hydrogen dạng',
          options: [
            { id: 'a', text: 'RH₃' },
            { id: 'b', text: 'H₂R' },
            { id: 'c', text: 'HR' },
            { id: 'd', text: 'RH₄' }
          ],
          correct: 'c',
          explanation: 'Hóa trị với hydrogen = 8 − 7 = 1 ⇒ HR, ví dụ HCl, HBr.'
        },
        {
          type: 'quiz',
          id: 'g10-l8-c3',
          question: 'Nguyên tố X ở chu kì 2, nhóm VA. Phát biểu nào đúng?',
          options: [
            { id: 'a', text: 'X có 2 electron lớp ngoài cùng.' },
            { id: 'b', text: 'X là kim loại.' },
            { id: 'c', text: 'X có 2 lớp electron và oxide cao nhất là X₂O₅.' },
            { id: 'd', text: 'Hợp chất với hydrogen của X là XH₅.' }
          ],
          correct: 'c',
          explanation: 'Chu kì 2 ⇒ 2 lớp; nhóm VA ⇒ 5e lớp ngoài cùng, phi kim, oxide cao nhất X₂O₅, hợp chất với H là XH₃. X là nitrogen.'
        },
        {
          type: 'quiz',
          id: 'g10-l8-c4',
          question: 'Nguyên nhân của sự biến đổi tuần hoàn tính chất các nguyên tố là',
          options: [
            { id: 'a', text: 'sự lặp lại tuần hoàn cấu hình electron lớp ngoài cùng' },
            { id: 'b', text: 'nguyên tử khối tăng dần' },
            { id: 'c', text: 'số neutron tăng dần' },
            { id: 'd', text: 'số lớp electron không đổi' }
          ],
          correct: 'a',
          explanation: 'Các nguyên tố cùng nhóm có cấu hình lớp ngoài cùng tương tự nên tính chất lặp lại theo chu kì.'
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
            'Định luật tuần hoàn: tính chất nguyên tố, đơn chất, hợp chất biến đổi tuần hoàn theo chiều tăng điện tích hạt nhân.',
            'Nguyên nhân: cấu hình electron lớp ngoài cùng lặp lại tuần hoàn.',
            'Vị trí ↔ cấu tạo ↔ tính chất: biết một điều suy ra được hai điều còn lại.',
            'Phi kim nhóm IVA – VIIA: hóa trị cao nhất với O + hóa trị với H = 8.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Hợp chất với hydrogen của nguyên tố nhóm VIA là RH₆.', right: 'Hóa trị với H = 8 − 6 = 2 ⇒ **H₂R** (H₂S, H₂O).' },
            { wrong: 'Định luật tuần hoàn phát biểu theo chiều tăng nguyên tử khối.', right: 'Theo chiều tăng **điện tích hạt nhân**; Mendeleev ban đầu dùng nguyên tử khối nên phải đảo vài cặp như Ar – K.' },
            { wrong: 'Tìm M(R) từ %R nhưng quên đổi sang %H khi đề cho %R.', right: 'Kiểm tra đề cho phần trăm của nguyên tố nào trước khi lập phương trình.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Ôn tập chương 2**.'
        }
      ]
    }
  ]
}
