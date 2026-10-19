// Hóa học 11 · Chương 2 · Bài 7 — Sulfur và sulfur dioxide.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l7',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được trạng thái tự nhiên, tính chất vật lí của sulfur; trình bày được tính oxi hóa (với kim loại, hydrogen) và tính khử (với oxygen) của sulfur; nêu được ứng dụng của sulfur.',
    'Trình bày được tính chất vật lí, hóa học của sulfur dioxide: tính oxi hóa, tính khử, oxide acid; nêu được ứng dụng và tác hại.',
    'Nêu được sự hình thành sulfur dioxide do tác động của con người, tự nhiên; tác hại và biện pháp giảm thiểu (góp phần gây mưa acid).'
  ],
  prerequisites: [
    'Hóa 10: số oxi hóa, chất oxi hóa, chất khử; S (Z = 16) nhóm VIA.',
    'Bài 6: mưa acid.'
  ],
  sources: [
    programme('Sulfur và sulfur dioxide'),
    textbook(11, 7)
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
          text: 'Khi nhiệt kế thủy tinh vỡ, người ta rắc bột sulfur lên những giọt thủy ngân rơi vãi. Còn khí thoát ra từ núi lửa và ống khói nhà máy nhiệt điện than lại có mùi hắc của sulfur dioxide. Sulfur và hợp chất của nó có tính chất gì để được dùng — và gây hại — như vậy?'
        },
        {
          type: 'list',
          items: [
            'Mô tả sulfur và các số oxi hóa của nó.',
            'Viết phản ứng thể hiện tính oxi hóa và tính khử của sulfur.',
            'Trình bày tính chất của SO₂: oxide acid, tính khử, tính oxi hóa.',
            'Biết nguồn phát thải, tác hại và cách giảm thiểu SO₂.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['S (1s² 2s² 2p⁶ 3s² 3p⁴): 6 electron lớp ngoài cùng.', 'Các số oxi hóa: −2, 0, +4, +6.'] }
      ]
    },
    {
      id: 'sulfur',
      kind: 'concept',
      title: 'Sulfur',
      blocks: [
        {
          type: 'list',
          items: [
            'Trong tự nhiên: sulfur đơn chất ở vùng núi lửa; hợp chất trong quặng (pyrite FeS₂, thạch cao CaSO₄·2H₂O), trong protein.',
            'Sulfur là chất rắn màu vàng, không tan trong nước, nóng chảy ở khoảng 113 – 119 °C (tùy dạng tinh thể).',
            'Ở số oxi hóa 0 (trung gian), sulfur vừa có tính oxi hóa vừa có tính khử.'
          ]
        },
        { type: 'heading', text: 'Tính oxi hóa (S: 0 → −2)' },
        { type: 'equation', text: 'Fe + S → FeS', condition: 't°' },
        { type: 'equation', text: 'Hg + S → HgS', note: 'Xảy ra ngay ở nhiệt độ thường: dùng xử lí thủy ngân rơi vãi.' },
        { type: 'equation', text: 'H₂ + S → H₂S', condition: 't°' },
        { type: 'heading', text: 'Tính khử (S: 0 → +4)' },
        { type: 'equation', text: 'S + O₂ → SO₂', condition: 't°', note: 'Sulfur cháy với ngọn lửa màu xanh nhạt.' },
        {
          type: 'p',
          text: 'Ứng dụng: phần lớn sulfur dùng sản xuất sulfuric acid; ngoài ra dùng lưu hóa cao su, sản xuất diêm, thuốc trừ nấm, thuốc chữa bệnh ngoài da.'
        }
      ]
    },
    {
      id: 'so2',
      kind: 'concept',
      title: 'Sulfur dioxide',
      blocks: [
        {
          type: 'p',
          text: 'SO₂ là khí không màu, mùi hắc, độc, nặng hơn không khí, tan được trong nước. Trong SO₂, S có số oxi hóa +4 (trung gian).'
        },
        { type: 'heading', text: 'Oxide acid' },
        { type: 'equation', text: 'SO₂ + H₂O ⇌ H₂SO₃', note: 'Sulfurous acid là acid yếu, kém bền.' },
        { type: 'equation', text: 'SO₂ + 2NaOH → Na₂SO₃ + H₂O', note: 'Dùng dung dịch kiềm hấp thụ SO₂ trong khí thải.' },
        { type: 'heading', text: 'Tính khử (S: +4 → +6)' },
        { type: 'equation', text: '2SO₂ + O₂ ⇌ 2SO₃', condition: 'V₂O₅, 450 °C' },
        { type: 'equation', text: 'SO₂ + Br₂ + 2H₂O → H₂SO₄ + 2HBr', note: 'SO₂ làm mất màu nước bromine: dùng để nhận biết SO₂.' },
        { type: 'heading', text: 'Tính oxi hóa (S: +4 → 0)' },
        { type: 'equation', text: 'SO₂ + 2H₂S → 3S + 2H₂O' },
        { type: 'heading', text: 'Điều chế trong phòng thí nghiệm' },
        { type: 'equation', text: 'Na₂SO₃ + 2HCl → 2NaCl + SO₂ + H₂O' }
      ]
    },
    {
      id: 'environment',
      kind: 'concept',
      title: 'Ứng dụng, tác hại và giảm thiểu',
      blocks: [
        {
          type: 'table',
          caption: 'Sulfur dioxide trong đời sống',
          head: ['Khía cạnh', 'Nội dung'],
          rows: [
            ['Ứng dụng', 'Sản xuất H₂SO₄; tẩy trắng giấy, bột giấy; chống nấm mốc cho thực phẩm (với liều lượng cho phép)'],
            ['Nguồn phát thải tự nhiên', 'Núi lửa'],
            ['Nguồn do con người', 'Đốt than, dầu có chứa sulfur; luyện kim từ quặng sulfide'],
            ['Tác hại', 'Gây kích ứng đường hô hấp; tạo mưa acid'],
            ['Giảm thiểu', 'Khử sulfur trong nhiên liệu; hấp thụ SO₂ trong khí thải bằng sữa vôi hoặc dung dịch kiềm; dùng năng lượng tái tạo']
          ]
        },
        { type: 'equation', text: 'SO₂ + Ca(OH)₂ → CaSO₃ + H₂O', note: 'Hấp thụ SO₂ trong khí thải bằng sữa vôi.' }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Hấp thụ SO₂ bằng dung dịch kiềm',
      blocks: [
        {
          type: 'worked',
          problem: 'Đốt cháy hoàn toàn 3,2 g sulfur trong oxygen dư. Dẫn toàn bộ khí sinh ra vào dung dịch NaOH dư. Tính thể tích SO₂ ở điều kiện chuẩn (24,79 L/mol) và khối lượng muối tạo thành (S = 32, Na = 23, O = 16).',
          steps: [
            'n(S) = 3,2 / 32 = 0,1 mol. S + O₂ → SO₂ ⇒ n(SO₂) = 0,1 mol.',
            'V(SO₂) = 0,1 × 24,79 = 2,479 L.',
            'NaOH dư: SO₂ + 2NaOH → Na₂SO₃ + H₂O ⇒ n(Na₂SO₃) = 0,1 mol.',
            'M(Na₂SO₃) = 46 + 32 + 48 = 126 g/mol ⇒ m = 12,6 g.'
          ],
          answer: 'V(SO₂) ≈ 2,48 L; m(Na₂SO₃) = 12,6 g. Khi NaOH dư, muối tạo thành là muối trung hòa Na₂SO₃.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: điều chế SO₂',
      blocks: [
        {
          type: 'p',
          text: 'Trong phòng thí nghiệm ảo, cho Na₂SO₃ tác dụng với dung dịch HCl và quan sát khí thoát ra.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Sulfur và sulfur dioxide',
          text: 'Mở trong Phòng thí nghiệm ảo; quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'guided', grade: 11, lessonId: 'g11-l7', experimentId: 'g11-lesson-07' }
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
          id: 'g11-l7-c1',
          question: 'Trong phản ứng Fe + S → FeS, sulfur đóng vai trò',
          options: [
            { id: 'a', text: 'chất khử' },
            { id: 'b', text: 'chất oxi hóa' },
            { id: 'c', text: 'chất xúc tác' },
            { id: 'd', text: 'môi trường' }
          ],
          correct: 'b',
          explanation: 'S: 0 → −2, nhận electron.'
        },
        {
          type: 'quiz',
          id: 'g11-l7-c2',
          question: 'Có thể dùng chất nào để nhận biết khí SO₂?',
          options: [
            { id: 'a', text: 'Nước bromine' },
            { id: 'b', text: 'Dung dịch NaCl' },
            { id: 'c', text: 'Khí O₂' },
            { id: 'd', text: 'Nước cất' }
          ],
          correct: 'a',
          explanation: 'SO₂ làm mất màu vàng nâu của nước bromine: SO₂ + Br₂ + 2H₂O → H₂SO₄ + 2HBr.'
        },
        {
          type: 'quiz',
          id: 'g11-l7-c3',
          question: 'Rắc bột sulfur lên thủy ngân rơi vãi để',
          options: [
            { id: 'a', text: 'thủy ngân bay hơi nhanh hơn' },
            { id: 'b', text: 'chuyển thủy ngân thành HgS rắn, dễ thu gom, ít độc hơn' },
            { id: 'c', text: 'tạo khí SO₂ khử trùng' },
            { id: 'd', text: 'làm thủy ngân hóa lỏng' }
          ],
          correct: 'b',
          explanation: 'Hg + S → HgS xảy ra ở nhiệt độ thường.'
        },
        {
          type: 'quiz',
          id: 'g11-l7-c4',
          question: 'SO₂ vừa có tính oxi hóa vừa có tính khử vì',
          options: [
            { id: 'a', text: 'SO₂ là chất khí' },
            { id: 'b', text: 'S trong SO₂ có số oxi hóa +4, là số oxi hóa trung gian' },
            { id: 'c', text: 'SO₂ tan trong nước' },
            { id: 'd', text: 'SO₂ là oxide acid' }
          ],
          correct: 'b',
          explanation: 'S có các số oxi hóa −2, 0, +4, +6; ở +4 có thể tăng lên +6 hoặc giảm xuống 0, −2.'
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
            'Sulfur: rắn, vàng, không tan trong nước; vừa oxi hóa (với kim loại, H₂) vừa khử (với O₂).',
            'SO₂: oxide acid; tính khử (với O₂, nước bromine); tính oxi hóa (với H₂S).',
            'SO₂ từ đốt nhiên liệu chứa sulfur gây mưa acid; giảm thiểu bằng khử sulfur, hấp thụ bằng kiềm, sữa vôi.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Sulfur chỉ có tính oxi hóa như các phi kim mạnh.', right: 'S (số oxi hóa 0) **cũng có tính khử**: S + O₂ → SO₂.' },
            { wrong: 'S cháy trong O₂ tạo trực tiếp SO₃.', right: 'S cháy tạo **SO₂**; SO₂ chỉ chuyển thành SO₃ khi có xúc tác V₂O₅, nhiệt độ cao.' },
            { wrong: 'SO₂ làm mất màu nước bromine là do tính oxi hóa.', right: 'Đó là **tính khử** của SO₂ (S: +4 → +6).' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Sulfuric acid và muối sulfate**.'
        }
      ]
    }
  ]
}
