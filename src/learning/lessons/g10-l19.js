// Hóa học 10 · Chương 6 · Bài 19 — Tốc độ phản ứng.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l19',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Trình bày được khái niệm tốc độ phản ứng hóa học và cách tính tốc độ trung bình của phản ứng.',
    'Viết được biểu thức tốc độ phản ứng theo định luật tác dụng khối lượng; nêu được ý nghĩa hằng số tốc độ phản ứng.',
    'Giải thích được ảnh hưởng của nồng độ, nhiệt độ, áp suất, diện tích bề mặt, chất xúc tác đến tốc độ phản ứng.',
    'Nêu được ý nghĩa của hệ số nhiệt độ Van’t Hoff (γ).'
  ],
  prerequisites: [
    'Nồng độ mol: C = n / V (M).',
    'Cân bằng phương trình hóa học; lũy thừa.'
  ],
  sources: [
    programme('Tốc độ phản ứng'),
    textbook(10, 19)
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
          text: 'Pháo hoa cháy trong chớp mắt, còn đinh sắt phải mất nhiều tháng mới gỉ. Thức ăn để trong tủ lạnh giữ được lâu hơn để ngoài. Làm sao đo “nhanh” hay “chậm” của một phản ứng, và ta có thể điều khiển nó bằng cách nào?'
        },
        {
          type: 'list',
          items: [
            'Hiểu tốc độ phản ứng và tính tốc độ trung bình.',
            'Viết biểu thức tốc độ theo định luật tác dụng khối lượng.',
            'Giải thích ảnh hưởng của nồng độ, áp suất, nhiệt độ, diện tích bề mặt, chất xúc tác.',
            'Dùng hệ số nhiệt độ Van’t Hoff để so sánh tốc độ ở hai nhiệt độ.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Nồng độ mol tính bằng mol/L (M).', 'a² × a³ = a⁵; 2³ = 8.'] }
      ]
    },
    {
      id: 'rate',
      kind: 'concept',
      title: 'Tốc độ phản ứng',
      blocks: [
        {
          type: 'callout',
          title: 'Tốc độ phản ứng',
          text: 'Là đại lượng đặc trưng cho **độ biến thiên nồng độ** của một chất phản ứng hoặc sản phẩm **trong một đơn vị thời gian**. Đơn vị thường dùng: mol/(L·s) hay M/s.'
        },
        {
          type: 'p',
          text: 'Với phản ứng tổng quát aA + bB → cC + dD, tốc độ trung bình trong khoảng thời gian Δt:'
        },
        {
          type: 'equation',
          text: 'v̄ = −(1/a)·ΔC_A/Δt = −(1/b)·ΔC_B/Δt = (1/c)·ΔC_C/Δt = (1/d)·ΔC_D/Δt',
          note: 'Nồng độ chất phản ứng giảm (ΔC < 0) nên có dấu trừ; chia cho hệ số để mọi chất cho cùng một giá trị v̄.',
          check: false
        }
      ]
    },
    {
      id: 'example-rate',
      kind: 'example',
      title: 'Ví dụ 1 — Tính tốc độ trung bình',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho phản ứng Br₂ + HCOOH → 2HBr + CO₂. Nồng độ ban đầu của Br₂ là 0,0120 M; sau 50 giây còn 0,0101 M. Tính tốc độ trung bình của phản ứng theo Br₂ trong 50 giây đầu.',
          steps: [
            'ΔC(Br₂) = 0,0101 − 0,0120 = −0,0019 M; Δt = 50 s.',
            'Hệ số của Br₂ là 1: v̄ = −ΔC/Δt = 0,0019 / 50 = 3,8 × 10⁻⁵ M/s.',
            'Theo HBr (hệ số 2): HBr tăng 2 × 0,0019 = 0,0038 M, v̄ = (1/2) × 0,0038 / 50 = 3,8 × 10⁻⁵ M/s — cùng một giá trị.'
          ],
          answer: 'v̄ = 3,8 × 10⁻⁵ mol/(L·s). Màu vàng nâu của dung dịch bromine nhạt dần theo thời gian.',
          equations: ['Br₂ + HCOOH → 2HBr + CO₂']
        }
      ]
    },
    {
      id: 'mass-action',
      kind: 'concept',
      title: 'Định luật tác dụng khối lượng',
      blocks: [
        {
          type: 'p',
          text: 'Ở nhiệt độ không đổi, tốc độ phản ứng tỉ lệ với tích nồng độ các chất phản ứng, mỗi nồng độ có số mũ bằng hệ số tương ứng (áp dụng cho phản ứng đơn giản, xảy ra trong một giai đoạn):'
        },
        { type: 'equation', text: 'aA + bB → sản phẩm:   v = k · C_Aᵃ · C_Bᵇ', check: false },
        {
          type: 'list',
          items: [
            '**k** là hằng số tốc độ phản ứng: chỉ phụ thuộc bản chất phản ứng và nhiệt độ. Khi C_A = C_B = 1 M thì v = k.',
            'Ví dụ: H₂ + I₂ → 2HI có v = k·C(H₂)·C(I₂); tăng C(H₂) lên 2 lần thì v tăng 2 lần.',
            'Ví dụ: 2NO + O₂ → 2NO₂ có v = k·C(NO)²·C(O₂); tăng C(NO) lên 3 lần thì v tăng 3² = 9 lần.'
          ]
        }
      ]
    },
    {
      id: 'factors',
      kind: 'concept',
      title: 'Các yếu tố ảnh hưởng đến tốc độ phản ứng',
      blocks: [
        {
          type: 'table',
          caption: 'Muốn phản ứng nhanh hơn',
          head: ['Yếu tố', 'Tác động làm tăng tốc độ', 'Giải thích', 'Ví dụ'],
          rows: [
            ['Nồng độ', 'Tăng nồng độ chất phản ứng', 'Số va chạm giữa các hạt tăng', 'Than cháy trong O₂ nguyên chất mạnh hơn trong không khí'],
            ['Áp suất (chất khí)', 'Tăng áp suất', 'Tăng áp suất làm tăng nồng độ chất khí', 'Tổng hợp NH₃ ở áp suất cao'],
            ['Nhiệt độ', 'Tăng nhiệt độ', 'Hạt chuyển động nhanh hơn, nhiều va chạm hiệu quả hơn', 'Nấu bằng nồi áp suất nhanh chín'],
            ['Diện tích bề mặt', 'Chia nhỏ chất rắn', 'Tăng diện tích tiếp xúc', 'Đá vôi dạng bột tan trong acid nhanh hơn dạng viên'],
            ['Chất xúc tác', 'Thêm chất xúc tác phù hợp', 'Làm giảm năng lượng hoạt hóa; xúc tác không bị tiêu hao', 'MnO₂ làm H₂O₂ phân hủy nhanh']
          ]
        },
        { type: 'equation', text: '2H₂O₂ → 2H₂O + O₂', condition: 'MnO₂', note: 'MnO₂ là chất xúc tác: còn nguyên sau phản ứng.' }
      ]
    },
    {
      id: 'vant-hoff',
      kind: 'example',
      title: 'Ví dụ 2 — Hệ số nhiệt độ Van’t Hoff',
      blocks: [
        {
          type: 'equation',
          text: 'v₂ / v₁ = γ^((t₂ − t₁)/10)',
          note: 'γ (thường từ 2 đến 4): số lần tốc độ tăng khi nhiệt độ tăng thêm 10 °C.',
          check: false
        },
        {
          type: 'worked',
          problem: 'Một phản ứng có hệ số nhiệt độ γ = 2. Khi tăng nhiệt độ từ 20 °C lên 50 °C, tốc độ phản ứng tăng bao nhiêu lần? Nếu ở 20 °C phản ứng kết thúc sau 24 phút thì ở 50 °C mất bao lâu?',
          steps: [
            't₂ − t₁ = 50 − 20 = 30 °C ⇒ số mũ 30 / 10 = 3.',
            'v₂ / v₁ = 2³ = 8 ⇒ tốc độ tăng 8 lần.',
            'Thời gian phản ứng tỉ lệ nghịch với tốc độ: 24 / 8 = 3 phút.'
          ],
          answer: 'Tốc độ tăng 8 lần; phản ứng kết thúc sau khoảng 3 phút.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: quan sát tốc độ thoát khí',
      blocks: [
        {
          type: 'p',
          text: 'Cho Na₂CO₃ vào dung dịch HCl trong phòng thí nghiệm ảo và quan sát bọt khí CO₂. Dự đoán: nếu dùng dung dịch HCl loãng hơn, bọt khí thoát ra nhanh hơn hay chậm hơn?'
        },
        { type: 'equation', text: 'Na₂CO₃ + 2HCl → 2NaCl + CO₂ + H₂O' },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Khám phá tốc độ phản ứng',
          text: 'Mở trong Phòng thí nghiệm ảo; quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'guided', grade: 10, lessonId: 'g10-l19', experimentId: 'g10-lesson-19' }
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
          id: 'g10-l19-c1',
          question: 'Yếu tố nào không làm tăng tốc độ phản ứng giữa đá vôi và dung dịch HCl?',
          options: [
            { id: 'a', text: 'Nghiền nhỏ đá vôi' },
            { id: 'b', text: 'Tăng nồng độ HCl' },
            { id: 'c', text: 'Đun nóng hỗn hợp' },
            { id: 'd', text: 'Pha loãng dung dịch HCl bằng nước' }
          ],
          correct: 'd',
          explanation: 'Pha loãng làm giảm nồng độ HCl nên tốc độ phản ứng giảm.'
        },
        {
          type: 'quiz',
          id: 'g10-l19-c2',
          question: 'Với phản ứng đơn giản 2NO + O₂ → 2NO₂, khi tăng nồng độ NO lên 2 lần (giữ nguyên O₂), tốc độ phản ứng',
          options: [
            { id: 'a', text: 'tăng 2 lần' },
            { id: 'b', text: 'tăng 4 lần' },
            { id: 'c', text: 'tăng 8 lần' },
            { id: 'd', text: 'không đổi' }
          ],
          correct: 'b',
          explanation: 'v = k·C(NO)²·C(O₂) ⇒ v tăng 2² = 4 lần.'
        },
        {
          type: 'quiz',
          id: 'g10-l19-c3',
          question: 'Chất xúc tác làm tăng tốc độ phản ứng và',
          options: [
            { id: 'a', text: 'bị tiêu hao hoàn toàn sau phản ứng' },
            { id: 'b', text: 'không bị biến đổi về lượng và chất sau phản ứng' },
            { id: 'c', text: 'làm tăng nồng độ chất phản ứng' },
            { id: 'd', text: 'luôn làm tăng nhiệt độ' }
          ],
          correct: 'b',
          explanation: 'Chất xúc tác tham gia vào cơ chế phản ứng nhưng được tái tạo, còn nguyên khi phản ứng kết thúc.'
        },
        {
          type: 'quiz',
          id: 'g10-l19-c4',
          question: 'Phản ứng có γ = 3. Tăng nhiệt độ thêm 20 °C thì tốc độ phản ứng tăng',
          options: [
            { id: 'a', text: '6 lần' },
            { id: 'b', text: '9 lần' },
            { id: 'c', text: '27 lần' },
            { id: 'd', text: '3 lần' }
          ],
          correct: 'b',
          explanation: 'v₂ / v₁ = 3^(20/10) = 3² = 9.'
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
            'v̄ = −(1/a)ΔC(chất đầu)/Δt = (1/c)ΔC(sản phẩm)/Δt; đơn vị M/s.',
            'Phản ứng đơn giản aA + bB: v = k·C_Aᵃ·C_Bᵇ; k phụ thuộc bản chất phản ứng và nhiệt độ.',
            'Tăng nồng độ, áp suất (chất khí), nhiệt độ, diện tích bề mặt hoặc dùng xúc tác ⇒ tốc độ tăng.',
            'Van’t Hoff: v₂/v₁ = γ^((t₂ − t₁)/10).'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Tốc độ theo chất phản ứng tính bằng ΔC/Δt nên có giá trị âm.', right: 'Thêm dấu trừ: **v̄ = −ΔC/Δt** để tốc độ luôn dương.' },
            { wrong: 'Tăng nhiệt độ 30 °C với γ = 2 thì tốc độ tăng 2 × 3 = 6 lần.', right: 'Số mũ, không phải phép nhân: **2³ = 8 lần**.' },
            { wrong: 'Hằng số tốc độ k thay đổi khi thay đổi nồng độ.', right: 'k chỉ phụ thuộc **bản chất phản ứng và nhiệt độ** (và chất xúc tác).' },
            { wrong: 'Tăng áp suất làm tăng tốc độ mọi phản ứng.', right: 'Áp suất chỉ ảnh hưởng đến phản ứng có **chất khí**.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Ôn tập chương 6**.'
        }
      ]
    }
  ]
}
