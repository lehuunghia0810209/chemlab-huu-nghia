// Hóa học 12 · Chương 5 · Bài 16 — Điện phân.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l16',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm điện phân; các quá trình xảy ra ở mỗi điện cực khi điện phân nóng chảy và điện phân dung dịch.',
    'Trình bày được thứ tự điện phân ở các điện cực (với điện cực trơ) dựa vào thế điện cực chuẩn.',
    'Trình bày được ứng dụng của điện phân: điều chế kim loại, sản xuất hóa chất (NaOH, Cl₂), tinh chế kim loại, mạ điện.'
  ],
  prerequisites: [
    'Bài 15: cặp oxi hóa – khử, thế điện cực chuẩn, pin Galvani.',
    'Hóa 10: chất oxi hóa, chất khử, thăng bằng electron.'
  ],
  sources: [
    programme('Pin điện và điện phân'),
    textbook(12, 16)
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
          text: 'Nhôm trong vỏ lon nước ngọt, xút NaOH trong nhà máy hóa chất hay lớp mạ sáng bóng trên vòi nước đều được sản xuất nhờ dòng điện. Dòng điện đã gây ra những phản ứng nào?'
        },
        {
          type: 'list',
          items: [
            'Nêu khái niệm điện phân; xác định cực và quá trình ở mỗi điện cực.',
            'Viết phương trình điện phân nóng chảy và điện phân dung dịch.',
            'Dự đoán thứ tự điện phân ở cathode và anode.',
            'Nêu ứng dụng của điện phân.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['E° càng lớn, ion có tính oxi hóa càng mạnh.', 'Trong pin Galvani, anode là cực âm.'] }
      ]
    },
    {
      id: 'definition',
      kind: 'concept',
      title: 'Khái niệm điện phân',
      blocks: [
        {
          type: 'callout',
          title: 'Điện phân',
          text: 'Là quá trình oxi hóa – khử xảy ra ở bề mặt các điện cực khi cho dòng điện một chiều đi qua chất điện li ở trạng thái nóng chảy hoặc dung dịch. Điện năng chuyển hóa thành hóa năng.'
        },
        {
          type: 'table',
          caption: 'Điện cực trong bình điện phân',
          head: ['Điện cực', 'Nối với', 'Ion di chuyển đến', 'Quá trình'],
          rows: [
            ['Cathode', 'Cực âm của nguồn', 'Cation', 'Khử'],
            ['Anode', 'Cực dương của nguồn', 'Anion', 'Oxi hóa']
          ]
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'So với pin Galvani',
          text: 'Ở cả pin và bình điện phân, **anode luôn xảy ra oxi hóa, cathode luôn xảy ra khử**; chỉ dấu cực khác nhau: trong bình điện phân anode là cực dương, cathode là cực âm.'
        }
      ]
    },
    {
      id: 'molten',
      kind: 'concept',
      title: 'Điện phân nóng chảy',
      blocks: [
        {
          type: 'p',
          text: 'Điện phân NaCl nóng chảy: ở cathode Na⁺ + e → Na; ở anode 2Cl⁻ → Cl₂ + 2e.'
        },
        { type: 'equation', text: '2NaCl → 2Na + Cl₂', condition: 'điện phân nóng chảy' },
        {
          type: 'p',
          text: 'Điện phân Al₂O₃ nóng chảy (hòa tan trong cryolite Na₃AlF₆ để hạ nhiệt độ nóng chảy, tăng độ dẫn điện): ở cathode Al³⁺ + 3e → Al; ở anode 2O²⁻ → O₂ + 4e. Anode bằng than chì bị O₂ đốt cháy dần nên phải thay định kì.'
        },
        { type: 'equation', text: '2Al₂O₃ → 4Al + 3O₂', condition: 'điện phân nóng chảy, cryolite' }
      ]
    },
    {
      id: 'solution',
      kind: 'concept',
      title: 'Điện phân dung dịch (điện cực trơ)',
      blocks: [
        {
          type: 'table',
          caption: 'Thứ tự điện phân',
          head: ['Điện cực', 'Quy tắc', 'Ví dụ'],
          rows: [
            ['Cathode', 'Cation có E° lớn hơn bị khử trước. Các ion K⁺, Na⁺, Ca²⁺, Mg²⁺, Al³⁺ không bị khử; khi đó H₂O bị khử: 2H₂O + 2e → H₂ + 2OH⁻', 'Ag⁺ bị khử trước Cu²⁺; Cu²⁺ trước H₂O'],
            ['Anode', 'Anion halide (Cl⁻, Br⁻, I⁻) bị oxi hóa trước H₂O. Anion chứa oxygen (SO₄²⁻, NO₃⁻) không bị oxi hóa; khi đó H₂O bị oxi hóa: 2H₂O → O₂ + 4H⁺ + 4e', 'Cl⁻ → Cl₂ trước H₂O']
          ]
        },
        { type: 'heading', text: 'Điện phân dung dịch CuSO₄' },
        { type: 'equation', text: '2CuSO₄ + 2H₂O → 2Cu + O₂ + 2H₂SO₄', condition: 'điện phân dung dịch', note: 'Cathode: Cu bám vào; anode: khí O₂; dung dịch có tính acid tăng dần.' },
        { type: 'heading', text: 'Điện phân dung dịch NaCl có màng ngăn' },
        { type: 'equation', text: '2NaCl + 2H₂O → 2NaOH + H₂ + Cl₂', condition: 'điện phân dung dịch, có màng ngăn', note: 'Màng ngăn không cho Cl₂ tác dụng với NaOH; đây là phương pháp sản xuất NaOH và Cl₂ trong công nghiệp.' }
      ]
    },
    {
      id: 'applications',
      kind: 'concept',
      title: 'Ứng dụng của điện phân',
      blocks: [
        {
          type: 'list',
          items: [
            '**Điều chế kim loại** hoạt động mạnh (Na, K, Mg, Ca, Al) bằng điện phân nóng chảy; một số kim loại trung bình, yếu bằng điện phân dung dịch.',
            '**Sản xuất hóa chất**: NaOH, Cl₂, H₂ từ dung dịch NaCl.',
            '**Tinh chế kim loại**: điện phân dung dịch CuSO₄ với anode là đồng thô, cathode là đồng tinh khiết; đồng ở anode tan ra và bám lên cathode, tạp chất lắng xuống.',
            '**Mạ điện**: vật cần mạ làm cathode, kim loại dùng để mạ làm anode, dung dịch chứa ion của kim loại mạ.'
          ]
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Mở rộng: lượng chất theo điện lượng',
          text: 'Số mol electron trao đổi ở điện cực n(e) = I·t / F, với F ≈ 96 485 C/mol (hằng số Faraday), I tính bằng A, t tính bằng s. Từ n(e) suy ra lượng chất ở mỗi điện cực theo bán phản ứng.'
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Điện phân dung dịch CuSO₄',
      blocks: [
        {
          type: 'worked',
          problem: 'Điện phân dung dịch CuSO₄ với điện cực trơ, sau một thời gian thấy 6,4 g Cu bám vào cathode. Tính thể tích khí thoát ra ở anode (điều kiện chuẩn, 24,79 L/mol; Cu = 64).',
          steps: [
            'n(Cu) = 6,4 / 64 = 0,1 mol; cathode: Cu²⁺ + 2e → Cu ⇒ n(e) = 0,2 mol.',
            'Anode: 2H₂O → O₂ + 4H⁺ + 4e ⇒ n(O₂) = 0,2 / 4 = 0,05 mol.',
            'V(O₂) = 0,05 × 24,79 ≈ 1,24 L.'
          ],
          answer: 'Khí O₂ thoát ra ở anode, khoảng 1,24 L.'
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
          id: 'g12-l16-c1',
          question: 'Trong bình điện phân, cathode là',
          options: [
            { id: 'a', text: 'cực dương, xảy ra sự oxi hóa' },
            { id: 'b', text: 'cực âm, xảy ra sự khử' },
            { id: 'c', text: 'cực âm, xảy ra sự oxi hóa' },
            { id: 'd', text: 'cực dương, xảy ra sự khử' }
          ],
          correct: 'b',
          explanation: 'Cathode nối với cực âm của nguồn; cation đến nhận electron (bị khử).'
        },
        {
          type: 'quiz',
          id: 'g12-l16-c2',
          question: 'Kim loại nào được điều chế bằng điện phân nóng chảy?',
          options: [
            { id: 'a', text: 'Cu' },
            { id: 'b', text: 'Ag' },
            { id: 'c', text: 'Al' },
            { id: 'd', text: 'Fe' }
          ],
          correct: 'c',
          explanation: 'Al hoạt động mạnh, điều chế bằng điện phân Al₂O₃ nóng chảy.'
        },
        {
          type: 'quiz',
          id: 'g12-l16-c3',
          question: 'Điện phân dung dịch NaCl có màng ngăn, ở cathode thu được',
          options: [
            { id: 'a', text: 'Na' },
            { id: 'b', text: 'Cl₂' },
            { id: 'c', text: 'H₂' },
            { id: 'd', text: 'O₂' }
          ],
          correct: 'c',
          explanation: 'Na⁺ không bị khử trong dung dịch; H₂O bị khử tạo H₂ và OH⁻.'
        },
        {
          type: 'quiz',
          id: 'g12-l16-c4',
          question: 'Khi mạ bạc cho một chiếc thìa, chiếc thìa được nối với',
          options: [
            { id: 'a', text: 'cực âm (làm cathode)' },
            { id: 'b', text: 'cực dương (làm anode)' },
            { id: 'c', text: 'cầu muối' },
            { id: 'd', text: 'không nối với cực nào' }
          ],
          correct: 'a',
          explanation: 'Ag⁺ bị khử bám lên vật ở cathode; anode bằng bạc tan ra bổ sung Ag⁺.'
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
            'Điện phân: dòng điện một chiều gây phản ứng oxi hóa – khử; cathode (−) khử, anode (+) oxi hóa.',
            'Điện phân nóng chảy điều chế kim loại mạnh: NaCl → Na + Cl₂; Al₂O₃ → Al + O₂.',
            'Dung dịch: cation E° lớn bị khử trước, ion từ Al³⁺ trở về trước không bị khử (H₂O bị khử); halide bị oxi hóa trước H₂O, anion có oxygen không bị oxi hóa.',
            'Ứng dụng: điều chế kim loại, sản xuất NaOH và Cl₂, tinh chế đồng, mạ điện.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Trong bình điện phân, anode là cực âm như trong pin.', right: 'Trong bình điện phân, **anode là cực dương**; nhưng ở cả hai, anode luôn là nơi xảy ra oxi hóa.' },
            { wrong: 'Điện phân dung dịch NaCl thu được Na ở cathode.', right: 'Trong dung dịch, **H₂O bị khử** tạo H₂; muốn có Na phải điện phân NaCl nóng chảy.' },
            { wrong: 'Ion SO₄²⁻ bị oxi hóa ở anode khi điện phân CuSO₄.', right: 'SO₄²⁻ không bị oxi hóa; **H₂O bị oxi hóa** tạo O₂ và H⁺.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Ôn tập chương 5**.'
        }
      ]
    }
  ]
}
