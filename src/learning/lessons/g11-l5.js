// Hóa học 11 · Chương 2 · Bài 5 — Ammonia. Muối ammonium.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l5',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Mô tả được cấu tạo phân tử, tính chất vật lí của ammonia.',
    'Trình bày được tính base (tác dụng với nước, acid) và tính khử (tác dụng với oxygen) của ammonia.',
    'Vận dụng được nguyên lí chuyển dịch cân bằng để giải thích điều kiện của quá trình Haber tổng hợp ammonia.',
    'Trình bày được tính chất của muối ammonium (tan, phản ứng với kiềm, nhiệt phân) và nhận biết được ion ammonium; nêu được ứng dụng của ammonia và muối ammonium.'
  ],
  prerequisites: [
    'Bài 4: Nitrogen; bài 2: thuyết Brønsted – Lowry.',
    'Hóa 10: liên kết hydrogen, phân tử phân cực.'
  ],
  sources: [
    programme('Ammonia. Muối ammonium'),
    textbook(11, 5)
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
          text: 'Phần lớn ammonia sản xuất trên thế giới được dùng làm phân bón, nuôi sống hàng tỉ người. Muốn biến khí N₂ trơ trong không khí thành ammonia, các kĩ sư phải chọn nhiệt độ, áp suất và xúc tác rất khéo. Họ đã dựa vào kiến thức nào?'
        },
        {
          type: 'list',
          items: [
            'Mô tả cấu tạo và tính chất vật lí của ammonia.',
            'Viết phản ứng thể hiện tính base và tính khử của NH₃.',
            'Giải thích điều kiện tổng hợp ammonia bằng nguyên lí Le Chatelier.',
            'Trình bày tính chất và cách nhận biết muối ammonium.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Base theo Brønsted – Lowry nhận proton.', 'Liên kết hydrogen làm chất tan tốt trong nước.'] }
      ]
    },
    {
      id: 'structure',
      kind: 'concept',
      title: 'Cấu tạo và tính chất vật lí',
      blocks: [
        {
          type: 'list',
          items: [
            'Phân tử NH₃ có dạng chóp tam giác; nguyên tử N còn một cặp electron riêng.',
            'Liên kết N–H phân cực, phân tử NH₃ phân cực.',
            'NH₃ là khí không màu, mùi khai, nhẹ hơn không khí, tan rất nhiều trong nước (nhờ liên kết hydrogen với nước).'
          ]
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Thí nghiệm thử tính tan',
          text: 'Bình chứa đầy khí NH₃ úp ngược, nối với chậu nước có phenolphthalein: nước phun mạnh vào bình thành tia và chuyển màu hồng — NH₃ tan rất nhanh và dung dịch có tính base.'
        }
      ]
    },
    {
      id: 'chemical',
      kind: 'concept',
      title: 'Tính base và tính khử',
      blocks: [
        { type: 'heading', text: 'Tính base (do cặp electron riêng của N nhận H⁺)' },
        { type: 'equation', text: 'NH₃ + H₂O ⇌ NH₄⁺ + OH⁻', note: 'Dung dịch ammonia là base yếu, làm quỳ tím hóa xanh.' },
        { type: 'equation', text: 'NH₃ + HCl → NH₄Cl', note: 'Hai khí gặp nhau tạo “khói trắng” là những hạt NH₄Cl rắn.' },
        { type: 'equation', text: '2NH₃ + H₂SO₄ → (NH₄)₂SO₄' },
        { type: 'heading', text: 'Tính khử (N có số oxi hóa thấp nhất −3)' },
        { type: 'equation', text: '4NH₃ + 3O₂ → 2N₂ + 6H₂O', condition: 't°', note: 'Đốt cháy trong oxygen.' },
        { type: 'equation', text: '4NH₃ + 5O₂ → 4NO + 6H₂O', condition: 'Pt, 850 – 900 °C', note: 'Giai đoạn đầu của quá trình sản xuất nitric acid.' }
      ]
    },
    {
      id: 'haber',
      kind: 'concept',
      title: 'Tổng hợp ammonia (quá trình Haber)',
      blocks: [
        { type: 'equation', text: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g)', note: 'ΔrH°298 = −91,8 kJ: chiều thuận tỏa nhiệt, giảm số mol khí.' },
        {
          type: 'table',
          caption: 'Lựa chọn điều kiện',
          head: ['Điều kiện', 'Theo Le Chatelier', 'Thực tế', 'Lí do'],
          rows: [
            ['Áp suất', 'Áp suất cao có lợi (4 mol → 2 mol khí)', 'Khoảng 150 – 200 bar', 'Áp suất quá cao tốn kém và nguy hiểm'],
            ['Nhiệt độ', 'Nhiệt độ thấp có lợi (tỏa nhiệt)', 'Khoảng 400 – 450 °C', 'Nhiệt độ thấp thì tốc độ quá chậm'],
            ['Xúc tác', 'Không làm chuyển dịch cân bằng', 'Fe', 'Giúp nhanh đạt cân bằng'],
            ['Tách sản phẩm', 'Lấy NH₃ ra làm cân bằng chuyển sang phải', 'Làm lạnh để NH₃ hóa lỏng', 'N₂, H₂ dư được tuần hoàn lại']
          ]
        }
      ]
    },
    {
      id: 'ammonium',
      kind: 'concept',
      title: 'Muối ammonium',
      blocks: [
        {
          type: 'p',
          text: 'Muối ammonium chứa cation NH₄⁺, ví dụ NH₄Cl, NH₄NO₃, (NH₄)₂SO₄, NH₄HCO₃. Hầu hết đều là chất rắn, tan tốt trong nước.'
        },
        { type: 'heading', text: 'Tác dụng với dung dịch kiềm — nhận biết ion NH₄⁺' },
        { type: 'equation', text: 'NH₄Cl + NaOH → NaCl + NH₃ + H₂O', condition: 't°' },
        { type: 'equation', text: 'NH₄⁺ + OH⁻ → NH₃ + H₂O', note: 'Khí NH₃ mùi khai làm giấy quỳ tím ẩm hóa xanh.' },
        { type: 'heading', text: 'Bị nhiệt phân' },
        { type: 'equation', text: 'NH₄Cl → NH₃ + HCl', condition: 't°' },
        { type: 'equation', text: 'NH₄HCO₃ → NH₃ + CO₂ + H₂O', condition: 't°', note: 'NH₄HCO₃ dùng làm bột nở trong làm bánh.' },
        {
          type: 'p',
          text: 'Ứng dụng: NH₄NO₃, (NH₄)₂SO₄, NH₄Cl làm phân đạm; ammonia dùng sản xuất phân bón, nitric acid, chất làm lạnh.'
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Lượng khí từ muối ammonium',
      blocks: [
        {
          type: 'worked',
          problem: 'Đun nóng 5,35 g NH₄Cl với dung dịch NaOH dư. Tính thể tích khí NH₃ thu được ở điều kiện chuẩn (24,79 L/mol) (N = 14, H = 1, Cl = 35,5).',
          steps: [
            'M(NH₄Cl) = 14 + 4 + 35,5 = 53,5 g/mol ⇒ n = 5,35 / 53,5 = 0,1 mol.',
            'NH₄Cl + NaOH → NaCl + NH₃ + H₂O ⇒ n(NH₃) = 0,1 mol.',
            'V(NH₃) = 0,1 × 24,79 = 2,479 L.'
          ],
          answer: 'V(NH₃) ≈ 2,48 L.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: nhận biết ion ammonium',
      blocks: [
        {
          type: 'p',
          text: 'Trong phòng thí nghiệm ảo, cho NH₄Cl tác dụng với NaOH và đun nóng. Quan sát khí thoát ra và thử bằng giấy quỳ ẩm.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Ammonia và ion ammonium',
          text: 'Mở trong Phòng thí nghiệm ảo; quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'guided', grade: 11, lessonId: 'g11-l5', experimentId: 'g11-ammonium-identification' }
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
          id: 'g11-l5-c1',
          question: 'Ammonia có tính base vì',
          options: [
            { id: 'a', text: 'phân tử có 3 nguyên tử H' },
            { id: 'b', text: 'nguyên tử N còn cặp electron riêng, nhận được H⁺' },
            { id: 'c', text: 'NH₃ tan tốt trong nước' },
            { id: 'd', text: 'N có số oxi hóa +5' }
          ],
          correct: 'b',
          explanation: 'Cặp electron riêng của N nhận proton tạo NH₄⁺; trong NH₃, N có số oxi hóa −3.'
        },
        {
          type: 'quiz',
          id: 'g11-l5-c2',
          question: 'Để nhận biết ion NH₄⁺ trong dung dịch, dùng',
          options: [
            { id: 'a', text: 'dung dịch AgNO₃' },
            { id: 'b', text: 'dung dịch NaOH, đun nóng, thử khí bằng quỳ tím ẩm' },
            { id: 'c', text: 'dung dịch BaCl₂' },
            { id: 'd', text: 'phenolphthalein' }
          ],
          correct: 'b',
          explanation: 'NH₄⁺ + OH⁻ → NH₃ + H₂O; khí NH₃ làm quỳ tím ẩm hóa xanh.'
        },
        {
          type: 'quiz',
          id: 'g11-l5-c3',
          question: 'Trong tổng hợp NH₃, người ta không dùng nhiệt độ thấp dù cân bằng chuyển dịch theo chiều thuận vì',
          options: [
            { id: 'a', text: 'ở nhiệt độ thấp tốc độ phản ứng quá chậm' },
            { id: 'b', text: 'ở nhiệt độ thấp NH₃ bị phân hủy' },
            { id: 'c', text: 'xúc tác Fe chỉ hoạt động ở nhiệt độ thấp' },
            { id: 'd', text: 'nhiệt độ không ảnh hưởng đến phản ứng' }
          ],
          correct: 'a',
          explanation: 'Phải dung hòa giữa hiệu suất (nhiệt độ thấp) và tốc độ (nhiệt độ cao): khoảng 400 – 450 °C.'
        },
        {
          type: 'quiz',
          id: 'g11-l5-c4',
          question: 'Muối nào được dùng làm bột nở?',
          options: [
            { id: 'a', text: 'NH₄Cl' },
            { id: 'b', text: 'NH₄HCO₃' },
            { id: 'c', text: '(NH₄)₂SO₄' },
            { id: 'd', text: 'NH₄NO₃' }
          ],
          correct: 'b',
          explanation: 'NH₄HCO₃ bị nhiệt phân tạo NH₃, CO₂ và hơi nước làm bánh xốp.'
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
            'NH₃: phân tử phân cực, tan rất nhiều trong nước, dung dịch có tính base yếu.',
            'Tính base: tác dụng với nước, acid; tính khử: tác dụng với O₂ (tạo N₂ hoặc NO khi có xúc tác Pt).',
            'Quá trình Haber: khoảng 150 – 200 bar, 400 – 450 °C, xúc tác Fe, tách NH₃ và tuần hoàn khí dư.',
            'Muối ammonium: tan tốt, tác dụng với kiềm giải phóng NH₃ (nhận biết), dễ bị nhiệt phân.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Dung dịch NH₃ là base mạnh như NaOH.', right: 'NH₃ là **base yếu**: NH₃ + H₂O ⇌ NH₄⁺ + OH⁻ (cân bằng).' },
            { wrong: 'Chọn nhiệt độ càng thấp càng tốt cho tổng hợp NH₃.', right: 'Nhiệt độ thấp làm **tốc độ quá chậm**; thực tế dùng 400 – 450 °C kèm xúc tác.' },
            { wrong: 'Bón phân đạm ammonium chung với vôi để tăng hiệu quả.', right: 'Vôi (base) phản ứng với NH₄⁺ giải phóng NH₃ bay mất, **làm mất đạm**.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Một số hợp chất của nitrogen với oxygen**.'
        }
      ]
    }
  ]
}
