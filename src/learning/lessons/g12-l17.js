// Hóa học 12 · Chương 5 · Bài 17 — Ôn tập chương 5 (Pin điện và điện phân).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l17',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa thế điện cực chuẩn, pin Galvani, nguồn điện hóa học và điện phân.',
    'Vận dụng để tính sức điện động chuẩn của pin, dự đoán sản phẩm và tính lượng chất trong điện phân.'
  ],
  prerequisites: ['Bài 15 – 16 của chương 5.'],
  sources: [
    programme('Pin điện và điện phân'),
    textbook(12, 17)
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
          text: 'Pin biến hóa năng thành điện năng, còn điện phân thì ngược lại. Hai quá trình này giống và khác nhau ở những điểm nào?'
        },
        {
          type: 'list',
          items: [
            'So sánh pin Galvani và bình điện phân.',
            'Vận dụng E° để tính sức điện động và dự đoán phản ứng.',
            'Tính lượng chất ở điện cực theo số mol electron.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 5',
      blocks: [
        {
          type: 'table',
          caption: 'Pin Galvani và bình điện phân',
          head: ['', 'Pin Galvani', 'Bình điện phân'],
          rows: [
            ['Chuyển hóa năng lượng', 'Hóa năng → điện năng', 'Điện năng → hóa năng'],
            ['Phản ứng', 'Tự xảy ra', 'Không tự xảy ra, cần dòng điện'],
            ['Anode', 'Cực âm, xảy ra oxi hóa', 'Cực dương, xảy ra oxi hóa'],
            ['Cathode', 'Cực dương, xảy ra khử', 'Cực âm, xảy ra khử']
          ]
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Bảo toàn electron',
          text: 'Trong cùng một bình điện phân, số mol electron nhận ở cathode bằng số mol electron nhường ở anode. Đây là chìa khóa của các bài toán điện phân.'
        }
      ]
    },
    {
      id: 'example-emf',
      kind: 'example',
      title: 'Ví dụ 1 — Pin Mg–Cu',
      blocks: [
        {
          type: 'worked',
          problem: 'Biết E°(Mg²⁺/Mg) = −2,37 V; E°(Cu²⁺/Cu) = +0,34 V. Xác định anode, cathode và tính sức điện động chuẩn của pin Mg–Cu.',
          steps: [
            'Mg có E° nhỏ hơn ⇒ anode (bị oxi hóa): Mg → Mg²⁺ + 2e.',
            'Cu²⁺ có E° lớn hơn ⇒ cathode: Cu²⁺ + 2e → Cu.',
            'E°pin = 0,34 − (−2,37) = 2,71 V.'
          ],
          answer: 'Anode Mg, cathode Cu; E°pin = 2,71 V; phản ứng Mg + Cu²⁺ → Mg²⁺ + Cu.',
          equations: ['Mg + Cu²⁺ → Mg²⁺ + Cu']
        }
      ]
    },
    {
      id: 'example-electrolysis',
      kind: 'example',
      title: 'Ví dụ 2 — Điện phân dung dịch NaCl',
      blocks: [
        {
          type: 'worked',
          problem: 'Điện phân dung dịch NaCl có màng ngăn, thu được 2,479 L khí Cl₂ (điều kiện chuẩn). Tính khối lượng NaOH tạo thành (Na = 23, O = 16, H = 1).',
          steps: [
            'n(Cl₂) = 2,479 / 24,79 = 0,1 mol.',
            '2NaCl + 2H₂O → 2NaOH + H₂ + Cl₂ ⇒ n(NaOH) = 2 × 0,1 = 0,2 mol.',
            'm(NaOH) = 0,2 × 40 = 8 g.'
          ],
          answer: 'Thu được 8 g NaOH.'
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
          id: 'g12-l17-c1',
          question: 'Điểm chung của pin Galvani và bình điện phân là',
          options: [
            { id: 'a', text: 'anode đều là cực âm' },
            { id: 'b', text: 'ở anode đều xảy ra sự oxi hóa' },
            { id: 'c', text: 'đều biến hóa năng thành điện năng' },
            { id: 'd', text: 'phản ứng đều tự xảy ra' }
          ],
          correct: 'b',
          explanation: 'Anode là nơi oxi hóa ở cả hai; dấu cực và chiều chuyển hóa năng lượng khác nhau.'
        },
        {
          type: 'quiz',
          id: 'g12-l17-c2',
          question: 'Điện phân dung dịch chứa Cu(NO₃)₂ và AgNO₃ (điện cực trơ), kim loại bám vào cathode đầu tiên là',
          options: [
            { id: 'a', text: 'Cu' },
            { id: 'b', text: 'Ag' },
            { id: 'c', text: 'cả hai cùng lúc' },
            { id: 'd', text: 'không có kim loại nào' }
          ],
          correct: 'b',
          explanation: 'E°(Ag⁺/Ag) = +0,80 V > E°(Cu²⁺/Cu) = +0,34 V nên Ag⁺ bị khử trước.'
        },
        {
          type: 'quiz',
          id: 'g12-l17-c3',
          question: 'Biết E°(Zn²⁺/Zn) = −0,76 V; E°(Ag⁺/Ag) = +0,80 V. Sức điện động chuẩn của pin Zn–Ag là',
          options: [
            { id: 'a', text: '0,04 V' },
            { id: 'b', text: '1,56 V' },
            { id: 'c', text: '−1,56 V' },
            { id: 'd', text: '2,36 V' }
          ],
          correct: 'b',
          explanation: 'E°pin = 0,80 − (−0,76) = 1,56 V.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 5',
      blocks: [
        {
          type: 'list',
          items: [
            'E°pin = E°(cathode) − E°(anode); phản ứng tự xảy ra giữa chất oxi hóa mạnh hơn và chất khử mạnh hơn.',
            'Điện phân: cathode (−) khử, anode (+) oxi hóa; thứ tự điện phân theo E°.',
            'Bài toán: dùng bảo toàn electron giữa hai điện cực.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Ở cathode bình điện phân, cation có E° nhỏ bị khử trước.', right: 'Cation có **E° lớn hơn** (tính oxi hóa mạnh hơn) bị khử trước.' },
            { wrong: 'Trong điện phân, n(O₂) ở anode bằng n(Cu) ở cathode.', right: 'Dùng **bảo toàn electron**: 2n(Cu) = 4n(O₂) ⇒ n(O₂) = n(Cu)/2.' },
            { wrong: 'Điện phân và pin đều tự xảy ra.', right: 'Chỉ phản ứng trong **pin** tự xảy ra; điện phân cần nguồn điện bên ngoài.' }
          ]
        },
        {
          type: 'p',
          text: 'Chương tiếp theo: **Đại cương về kim loại**.'
        }
      ]
    }
  ]
}
