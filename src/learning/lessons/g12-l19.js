// Hóa học 12 · Chương 6 · Bài 19 — Tính chất vật lí và tính chất hóa học của kim loại.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l19',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Giải thích được tính chất vật lí chung của kim loại (tính dẻo, dẫn điện, dẫn nhiệt, ánh kim) dựa vào electron tự do.',
    'Trình bày được tính chất hóa học cơ bản của kim loại: tác dụng với phi kim, nước, dung dịch acid (HCl, H₂SO₄ loãng; HNO₃, H₂SO₄ đặc) và dung dịch muối.',
    'Vận dụng thế điện cực chuẩn để giải thích phản ứng của kim loại với dung dịch acid và muối.'
  ],
  prerequisites: [
    'Bài 15: thế điện cực chuẩn, quy tắc chiều phản ứng.',
    'Bài 18: liên kết kim loại, electron tự do.'
  ],
  sources: [
    programme('Đại cương về kim loại'),
    textbook(12, 19)
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
          text: 'Dây điện làm bằng đồng, lá vàng có thể dát mỏng đến vài phần triệu milimét. Vì sao đồng không tan trong HCl nhưng lại tan trong HNO₃, còn nhôm để trong HNO₃ đặc nguội thì hầu như không thay đổi?'
        },
        {
          type: 'list',
          items: [
            'Giải thích tính chất vật lí chung của kim loại.',
            'Viết phản ứng của kim loại với phi kim, nước, acid và dung dịch muối.',
            'Dự đoán phản ứng dựa vào thế điện cực chuẩn.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['E° càng nhỏ, kim loại có tính khử càng mạnh.', 'Thăng bằng electron để cân bằng phản ứng oxi hóa – khử.'] }
      ]
    },
    {
      id: 'physical',
      kind: 'concept',
      title: 'Tính chất vật lí chung',
      blocks: [
        {
          type: 'table',
          caption: 'Tính chất vật lí chung do electron tự do gây ra',
          head: ['Tính chất', 'Giải thích', 'Ví dụ'],
          rows: [
            ['Tính dẻo', 'Các lớp ion trượt lên nhau nhưng vẫn được electron tự do liên kết', 'Au dẻo nhất, dát được lá rất mỏng'],
            ['Dẫn điện', 'Electron tự do chuyển động có hướng khi có hiệu điện thế', 'Ag > Cu > Au > Al > Fe'],
            ['Dẫn nhiệt', 'Electron tự do truyền năng lượng nhiệt', 'Nồi, chảo bằng kim loại'],
            ['Ánh kim', 'Electron tự do phản xạ hầu hết ánh sáng nhìn thấy', 'Mặt kim loại sáng bóng']
          ]
        },
        {
          type: 'p',
          text: 'Các tính chất riêng như khối lượng riêng, nhiệt độ nóng chảy, độ cứng khác nhau nhiều: Li nhẹ nhất, Os nặng nhất; Hg nóng chảy ở −39 °C, W ở 3 422 °C; Cs mềm, Cr cứng nhất.'
        }
      ]
    },
    {
      id: 'nonmetal-water',
      kind: 'concept',
      title: 'Tác dụng với phi kim và với nước',
      blocks: [
        { type: 'equation', text: '4Al + 3O₂ → 2Al₂O₃', condition: 't°' },
        { type: 'equation', text: '2Fe + 3Cl₂ → 2FeCl₃', condition: 't°', note: 'Cl₂ oxi hóa Fe lên số oxi hóa +3.' },
        { type: 'equation', text: 'Fe + S → FeS', condition: 't°' },
        { type: 'equation', text: '2Na + 2H₂O → 2NaOH + H₂', note: 'Kim loại nhóm IA và Ca, Sr, Ba tác dụng với nước ở nhiệt độ thường. Mg phản ứng chậm với nước nóng; Fe chỉ phản ứng với hơi nước ở nhiệt độ cao.' }
      ]
    },
    {
      id: 'acid',
      kind: 'concept',
      title: 'Tác dụng với dung dịch acid',
      blocks: [
        {
          type: 'p',
          text: 'Với HCl, H₂SO₄ loãng: kim loại có E° < 0 (đứng trước H) khử ion H⁺ thành H₂.'
        },
        { type: 'equation', text: 'Fe + 2HCl → FeCl₂ + H₂', note: 'Fe chỉ lên +2 với acid loãng thông thường.' },
        {
          type: 'p',
          text: 'Với HNO₃ và H₂SO₄ đặc: hầu hết kim loại (trừ Au, Pt) bị oxi hóa lên số oxi hóa cao, sản phẩm khử là NO₂, NO, SO₂… (không giải phóng H₂).'
        },
        { type: 'equation', text: 'Cu + 4HNO₃ → Cu(NO₃)₂ + 2NO₂ + 2H₂O', condition: 'HNO₃ đặc', note: 'Khí NO₂ màu nâu đỏ.' },
        { type: 'equation', text: '3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O', condition: 'HNO₃ loãng' },
        { type: 'equation', text: 'Cu + 2H₂SO₄ → CuSO₄ + SO₂ + 2H₂O', condition: 'H₂SO₄ đặc, t°' },
        {
          type: 'callout',
          tone: 'note',
          title: 'Thụ động hóa',
          text: 'Al, Fe, Cr bị **thụ động** trong HNO₃ đặc nguội và H₂SO₄ đặc nguội (lớp oxide bền bảo vệ), nên có thể dùng bình bằng sắt, nhôm để chứa các acid này.'
        }
      ]
    },
    {
      id: 'salt',
      kind: 'concept',
      title: 'Tác dụng với dung dịch muối',
      blocks: [
        {
          type: 'p',
          text: 'Kim loại có tính khử mạnh hơn (E° nhỏ hơn) đẩy kim loại có tính khử yếu hơn ra khỏi dung dịch muối (với điều kiện kim loại không tác dụng với nước).'
        },
        { type: 'equation', text: 'Fe + CuSO₄ → FeSO₄ + Cu', note: 'Đinh sắt phủ lớp đồng màu đỏ, màu xanh của dung dịch nhạt dần.' },
        { type: 'equation', text: 'Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag' },
        {
          type: 'callout',
          tone: 'note',
          title: 'Lưu ý với kim loại kiềm',
          text: 'Cho Na vào dung dịch CuSO₄: Na phản ứng với nước trước tạo NaOH, sau đó NaOH tạo kết tủa Cu(OH)₂; không thu được Cu.'
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Kim loại tác dụng với acid và muối',
      blocks: [
        {
          type: 'worked',
          problem: '(a) Cho 5,6 g Fe tác dụng hết với dung dịch HCl. Tính thể tích H₂ (điều kiện chuẩn, 24,79 L/mol). (b) Nhúng thanh Fe vào dung dịch CuSO₄, sau phản ứng khối lượng thanh tăng 0,8 g. Tính khối lượng Cu bám vào (Fe = 56, Cu = 64).',
          steps: [
            '(a) n(Fe) = 0,1 mol = n(H₂) ⇒ V = 0,1 × 24,79 = 2,479 L.',
            '(b) Cứ 1 mol Fe tan (56 g) thì 1 mol Cu bám vào (64 g): khối lượng tăng 8 g.',
            'n(Cu) = 0,8 / 8 = 0,1 mol ⇒ m(Cu) = 6,4 g.'
          ],
          answer: '(a) 2,479 L H₂; (b) 6,4 g Cu.'
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
          id: 'g12-l19-c1',
          question: 'Kim loại dẫn điện tốt nhất là',
          options: [
            { id: 'a', text: 'Cu' },
            { id: 'b', text: 'Ag' },
            { id: 'c', text: 'Au' },
            { id: 'd', text: 'Al' }
          ],
          correct: 'b',
          explanation: 'Thứ tự dẫn điện: Ag > Cu > Au > Al > Fe.'
        },
        {
          type: 'quiz',
          id: 'g12-l19-c2',
          question: 'Kim loại nào không tác dụng với dung dịch HCl?',
          options: [
            { id: 'a', text: 'Fe' },
            { id: 'b', text: 'Zn' },
            { id: 'c', text: 'Cu' },
            { id: 'd', text: 'Mg' }
          ],
          correct: 'c',
          explanation: 'E°(Cu²⁺/Cu) > 0: Cu không khử được H⁺.'
        },
        {
          type: 'quiz',
          id: 'g12-l19-c3',
          question: 'Kim loại bị thụ động trong HNO₃ đặc nguội là',
          options: [
            { id: 'a', text: 'Cu' },
            { id: 'b', text: 'Ag' },
            { id: 'c', text: 'Al' },
            { id: 'd', text: 'Zn' }
          ],
          correct: 'c',
          explanation: 'Al, Fe, Cr bị thụ động trong HNO₃ đặc nguội và H₂SO₄ đặc nguội.'
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
            'Tính dẻo, dẫn điện, dẫn nhiệt, ánh kim do electron tự do.',
            'Tính chất hóa học chung là tính khử: M → Mⁿ⁺ + ne.',
            'Acid loãng (HCl, H₂SO₄): kim loại trước H tạo H₂; HNO₃, H₂SO₄ đặc: oxi hóa hầu hết kim loại, không tạo H₂; Al, Fe, Cr thụ động khi nguội.',
            'Kim loại mạnh hơn đẩy kim loại yếu hơn khỏi dung dịch muối (trừ kim loại tác dụng với nước).'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Fe + HCl → FeCl₃ + H₂.', right: 'Với HCl, Fe chỉ tạo **FeCl₂**; với Cl₂ mới tạo FeCl₃.' },
            { wrong: 'Cu + HNO₃ giải phóng H₂.', right: 'HNO₃ là chất oxi hóa mạnh, sản phẩm khử là **NO₂, NO…**, không có H₂.' },
            { wrong: 'Na đẩy được Cu ra khỏi dung dịch CuSO₄.', right: 'Na phản ứng với **nước** trước, tạo Cu(OH)₂ kết tủa chứ không tạo Cu.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Kim loại trong tự nhiên và phương pháp tách kim loại**.'
        }
      ]
    }
  ]
}
