// Hóa học 10 · Chương 7 · Bài 21 — Nhóm halogen.
// Physical data: CRC Handbook (rounded). Electronegativity: Pauling.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l21',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được trạng thái tự nhiên của các nguyên tố halogen.',
    'Mô tả được trạng thái, màu sắc, nhiệt độ nóng chảy, nhiệt độ sôi của các đơn chất halogen và giải thích xu hướng biến đổi.',
    'Giải thích được tính oxi hóa mạnh và xu hướng giảm tính oxi hóa từ fluorine đến iodine; viết được phương trình phản ứng với kim loại, hydrogen, nước, dung dịch kiềm, dung dịch muối halide.',
    'Trình bày được phương pháp điều chế chlorine trong phòng thí nghiệm và trong công nghiệp; nêu được ứng dụng của các halogen.'
  ],
  prerequisites: [
    'Chương 2: xu hướng biến đổi bán kính, độ âm điện trong nhóm A.',
    'Chương 3: tương tác van der Waals; chương 4: chất oxi hóa, chất khử.'
  ],
  sources: [
    programme('Nguyên tố nhóm halogen'),
    textbook(10, 21),
    'Số liệu vật lí: CRC Handbook (làm tròn).'
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
          text: '“Halogen” nghĩa là “tạo muối”: chlorine có trong muối ăn, fluorine trong kem đánh răng, iodine trong muối iod. Vì sao các nguyên tố này hoạt động mạnh đến mức trong tự nhiên chỉ tồn tại ở dạng hợp chất?'
        },
        {
          type: 'list',
          items: [
            'Mô tả trạng thái tự nhiên và tính chất vật lí của các halogen.',
            'Giải thích tính oxi hóa mạnh và xu hướng giảm từ F₂ đến I₂.',
            'Viết phương trình phản ứng của halogen với kim loại, hydrogen, nước, kiềm, muối halide.',
            'Biết cách điều chế chlorine và ứng dụng của các halogen.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Nhóm VIIA có cấu hình lớp ngoài cùng ns²np⁵.', 'Độ âm điện giảm từ F đến I.'] }
      ]
    },
    {
      id: 'overview',
      kind: 'concept',
      title: 'Trạng thái tự nhiên và tính chất vật lí',
      blocks: [
        {
          type: 'p',
          text: 'Nhóm VIIA gồm fluorine (F), chlorine (Cl), bromine (Br), iodine (I) và các nguyên tố phóng xạ astatine (At), tennessine (Ts). Vì hoạt động hóa học mạnh, halogen chỉ tồn tại ở dạng hợp chất trong tự nhiên: CaF₂ (fluorite); NaCl, KCl trong nước biển và mỏ muối; bromide trong nước biển; iodine trong rong biển và tuyến giáp.'
        },
        {
          type: 'table',
          caption: 'Đơn chất halogen (X₂)',
          head: ['', 'F₂', 'Cl₂', 'Br₂', 'I₂'],
          rows: [
            ['Trạng thái (25 °C)', 'Khí', 'Khí', 'Lỏng', 'Rắn'],
            ['Màu', 'Vàng nhạt', 'Vàng lục', 'Nâu đỏ', 'Tím đen (hơi màu tím)'],
            ['Nhiệt độ nóng chảy (°C)', '−220', '−101', '−7', '114'],
            ['Nhiệt độ sôi (°C)', '−188', '−34', '59', '184'],
            ['Độ âm điện', '3,98', '3,16', '2,96', '2,66']
          ]
        },
        {
          type: 'list',
          items: [
            'Nhiệt độ nóng chảy, nhiệt độ sôi tăng từ F₂ đến I₂ vì khối lượng phân tử tăng, tương tác van der Waals mạnh dần.',
            'Iodine dễ thăng hoa: đun nóng nhẹ, tinh thể I₂ chuyển thành hơi màu tím.',
            'Các halogen đều độc; chlorine gây tổn thương đường hô hấp.'
          ]
        }
      ]
    },
    {
      id: 'oxidizing',
      kind: 'concept',
      title: 'Tính oxi hóa mạnh',
      blocks: [
        {
          type: 'p',
          text: 'Nguyên tử halogen có 7 electron lớp ngoài cùng (ns²np⁵), dễ nhận thêm 1 electron để đạt octet: X + e → X⁻. Vì vậy halogen có **tính oxi hóa mạnh**, giảm dần từ F₂ đến I₂ (bán kính tăng, độ âm điện giảm).'
        },
        {
          type: 'list',
          items: [
            'Fluorine chỉ có số oxi hóa −1 trong hợp chất (độ âm điện lớn nhất).',
            'Cl, Br, I có số oxi hóa −1 và các số oxi hóa dương +1, +3, +5, +7 khi liên kết với nguyên tố có độ âm điện lớn hơn (như O).'
          ]
        },
        { type: 'heading', text: 'Tác dụng với kim loại' },
        { type: 'equation', text: '2Na + Cl₂ → 2NaCl', condition: 't°' },
        { type: 'equation', text: '2Fe + 3Cl₂ → 2FeCl₃', condition: 't°', note: 'Chlorine oxi hóa sắt lên +3.' },
        { type: 'equation', text: 'Fe + I₂ → FeI₂', condition: 't°', note: 'Iodine yếu hơn, chỉ đưa sắt lên +2.' },
        { type: 'heading', text: 'Tác dụng với hydrogen' },
        {
          type: 'table',
          caption: 'Phản ứng H₂ + X₂ → 2HX: khó dần từ F₂ đến I₂',
          head: ['Halogen', 'Điều kiện', 'Đặc điểm'],
          rows: [
            ['F₂', 'Ngay cả trong bóng tối, nhiệt độ rất thấp', 'Nổ mạnh'],
            ['Cl₂', 'Chiếu sáng hoặc đốt nóng', 'Có thể nổ'],
            ['Br₂', 'Đun nóng', 'Chậm hơn'],
            ['I₂', 'Đun nóng, có xúc tác', 'Thuận nghịch: H₂ + I₂ ⇌ 2HI']
          ]
        }
      ]
    },
    {
      id: 'water-base-salt',
      kind: 'concept',
      title: 'Phản ứng với nước, kiềm và muối halide',
      blocks: [
        { type: 'equation', text: 'Cl₂ + H₂O ⇌ HCl + HClO', note: 'Nước chlorine; HClO có tính oxi hóa mạnh nên dùng để khử trùng, tẩy màu.' },
        { type: 'equation', text: '2F₂ + 2H₂O → 4HF + O₂', note: 'Fluorine oxi hóa được cả nước.' },
        { type: 'equation', text: 'Cl₂ + 2NaOH → NaCl + NaClO + H₂O', note: 'Ở nhiệt độ thường: tạo nước Javel.' },
        { type: 'equation', text: '3Cl₂ + 6NaOH → 5NaCl + NaClO₃ + 3H₂O', condition: '70 °C', note: 'Khi đun nóng, tạo muối chlorate.' },
        { type: 'heading', text: 'Halogen mạnh đẩy halogen yếu khỏi dung dịch muối' },
        { type: 'equation', text: 'Cl₂ + 2NaBr → 2NaCl + Br₂' },
        { type: 'equation', text: 'Cl₂ + 2NaI → 2NaCl + I₂' },
        { type: 'equation', text: 'Br₂ + 2NaI → 2NaBr + I₂' },
        {
          type: 'p',
          text: 'Các phản ứng trên chứng minh tính oxi hóa: Cl₂ > Br₂ > I₂. I₂ sinh ra làm hồ tinh bột chuyển màu xanh tím.'
        }
      ]
    },
    {
      id: 'preparation',
      kind: 'concept',
      title: 'Điều chế và ứng dụng',
      blocks: [
        { type: 'heading', text: 'Điều chế chlorine' },
        { type: 'equation', text: 'MnO₂ + 4HCl → MnCl₂ + Cl₂ + 2H₂O', condition: 't°, HCl đặc', note: 'Trong phòng thí nghiệm (có thể thay MnO₂ bằng KMnO₄).' },
        { type: 'equation', text: '2NaCl + 2H₂O → 2NaOH + H₂ + Cl₂', condition: 'điện phân dung dịch, có màng ngăn', note: 'Trong công nghiệp; đồng thời thu được NaOH và H₂.' },
        {
          type: 'table',
          caption: 'Ứng dụng',
          head: ['Nguyên tố', 'Ứng dụng tiêu biểu'],
          rows: [
            ['Fluorine', 'Chất chống dính Teflon; NaF trong kem đánh răng; HF khắc thủy tinh'],
            ['Chlorine', 'Khử trùng nước sinh hoạt; sản xuất nhựa PVC, nước Javel, HCl'],
            ['Bromine', 'Hợp chất dùng trong dược phẩm, phẩm nhuộm'],
            ['Iodine', 'Muối iod (bổ sung KI hoặc KIO₃) phòng bướu cổ; cồn iod sát trùng']
          ]
        }
      ]
    },
    {
      id: 'example-mass',
      kind: 'example',
      title: 'Ví dụ — Lượng chlorine điều chế được',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho 8,7 g MnO₂ tác dụng hết với dung dịch HCl đặc, đun nóng. Tính thể tích khí Cl₂ thu được ở điều kiện chuẩn (25 °C, 1 bar; 24,79 L/mol). Dẫn toàn bộ lượng khí đó vào dung dịch NaBr dư thì thu được bao nhiêu gam Br₂? (Mn = 55, O = 16, Br = 80)',
          steps: [
            'n(MnO₂) = 8,7 / 87 = 0,1 mol. Theo phương trình MnO₂ + 4HCl → MnCl₂ + Cl₂ + 2H₂O: n(Cl₂) = 0,1 mol.',
            'V(Cl₂) = 0,1 × 24,79 = 2,479 L.',
            'Cl₂ + 2NaBr → 2NaCl + Br₂: n(Br₂) = n(Cl₂) = 0,1 mol ⇒ m(Br₂) = 0,1 × 160 = 16 g.'
          ],
          answer: 'V(Cl₂) ≈ 2,48 L; m(Br₂) = 16 g.'
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
          id: 'g10-l21-c1',
          question: 'Ở điều kiện thường, halogen nào là chất lỏng?',
          options: [
            { id: 'a', text: 'F₂' },
            { id: 'b', text: 'Cl₂' },
            { id: 'c', text: 'Br₂' },
            { id: 'd', text: 'I₂' }
          ],
          correct: 'c',
          explanation: 'Br₂ là chất lỏng màu nâu đỏ (nóng chảy ở −7 °C, sôi ở 59 °C).'
        },
        {
          type: 'quiz',
          id: 'g10-l21-c2',
          question: 'Phản ứng nào không xảy ra?',
          options: [
            { id: 'a', text: 'Cl₂ + 2NaBr' },
            { id: 'b', text: 'Br₂ + 2NaI' },
            { id: 'c', text: 'I₂ + 2NaCl' },
            { id: 'd', text: 'Cl₂ + 2NaI' }
          ],
          correct: 'c',
          explanation: 'I₂ có tính oxi hóa yếu hơn Cl₂ nên không đẩy được chlorine ra khỏi muối chloride.'
        },
        {
          type: 'quiz',
          id: 'g10-l21-c3',
          question: 'Khi cho sắt tác dụng với khí chlorine dư, đun nóng, sản phẩm là',
          options: [
            { id: 'a', text: 'FeCl₂' },
            { id: 'b', text: 'FeCl₃' },
            { id: 'c', text: 'Fe₂Cl₃' },
            { id: 'd', text: 'FeCl' }
          ],
          correct: 'b',
          explanation: 'Chlorine có tính oxi hóa mạnh, oxi hóa Fe lên +3: 2Fe + 3Cl₂ → 2FeCl₃.'
        },
        {
          type: 'quiz',
          id: 'g10-l21-c4',
          question: 'Trong công nghiệp, chlorine được sản xuất bằng cách',
          options: [
            { id: 'a', text: 'cho MnO₂ tác dụng với HCl đặc' },
            { id: 'b', text: 'điện phân dung dịch NaCl có màng ngăn' },
            { id: 'c', text: 'nhiệt phân NaCl' },
            { id: 'd', text: 'cho NaCl tác dụng với H₂SO₄ đặc' }
          ],
          correct: 'b',
          explanation: 'Điện phân dung dịch NaCl có màng ngăn tạo Cl₂, H₂ và NaOH; MnO₂ + HCl đặc dùng trong phòng thí nghiệm.'
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
            'Halogen (ns²np⁵) có tính oxi hóa mạnh, giảm dần F₂ > Cl₂ > Br₂ > I₂.',
            'Nhiệt độ nóng chảy, sôi tăng dần từ F₂ đến I₂ (van der Waals).',
            'Phản ứng với kim loại, H₂, H₂O, NaOH; halogen mạnh đẩy halogen yếu khỏi muối.',
            'Điều chế Cl₂: MnO₂ hoặc KMnO₄ + HCl đặc (phòng thí nghiệm); điện phân dung dịch NaCl có màng ngăn (công nghiệp).'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Fluorine cũng có số oxi hóa +1, +3, +5, +7 như chlorine.', right: 'Fluorine có độ âm điện lớn nhất nên **chỉ có số oxi hóa −1** trong hợp chất.' },
            { wrong: 'I₂ đẩy được Cl₂ ra khỏi dung dịch NaCl.', right: 'Chỉ halogen **mạnh hơn** đẩy được halogen yếu hơn: Cl₂ + 2NaI → 2NaCl + I₂.' },
            { wrong: 'Fe tác dụng với Cl₂ tạo FeCl₂.', right: 'Cl₂ oxi hóa Fe lên **+3**: FeCl₃; I₂ yếu hơn mới tạo FeI₂.' },
            { wrong: 'Cl₂ + 2NaOH ở mọi nhiệt độ đều tạo NaClO.', right: 'Ở nhiệt độ thường tạo NaClO; **đun nóng khoảng 70 °C tạo NaClO₃**.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Hydrogen halide. Muối halide**.'
        }
      ]
    }
  ]
}
