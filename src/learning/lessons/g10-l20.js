// Hóa học 10 · Chương 6 · Bài 20 — Ôn tập chương 6 (Tốc độ phản ứng).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l20',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa khái niệm tốc độ phản ứng, định luật tác dụng khối lượng và các yếu tố ảnh hưởng.',
    'Vận dụng tính tốc độ trung bình, so sánh tốc độ khi thay đổi nồng độ, nhiệt độ; giải thích hiện tượng thực tế.'
  ],
  prerequisites: ['Bài 19: Tốc độ phản ứng.'],
  sources: [
    programme('Tốc độ phản ứng'),
    textbook(10, 20)
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
          text: 'Vì sao người ta nhóm bếp than bằng than tổ ong có nhiều lỗ, quạt thêm gió khi lửa yếu, còn muốn bảo quản rau thì cho vào ngăn mát? Tất cả đều là cách điều khiển tốc độ phản ứng.'
        },
        {
          type: 'list',
          items: [
            'Nhìn lại kiến thức chương 6 trong một bảng.',
            'Luyện tính tốc độ trung bình từ số liệu thí nghiệm.',
            'Vận dụng định luật tác dụng khối lượng và hệ số Van’t Hoff.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 6',
      blocks: [
        {
          type: 'table',
          caption: 'Tốc độ phản ứng',
          head: ['Nội dung', 'Ghi nhớ'],
          rows: [
            ['Tốc độ trung bình', 'v̄ = −(1/a)·ΔC(chất đầu)/Δt = (1/c)·ΔC(sản phẩm)/Δt'],
            ['Định luật tác dụng khối lượng', 'aA + bB → …: v = k·C_Aᵃ·C_Bᵇ (phản ứng đơn giản)'],
            ['Hằng số tốc độ k', 'Phụ thuộc bản chất phản ứng, nhiệt độ; không phụ thuộc nồng độ'],
            ['Các yếu tố', 'Nồng độ, áp suất (chất khí), nhiệt độ, diện tích bề mặt, chất xúc tác'],
            ['Van’t Hoff', 'v₂/v₁ = γ^((t₂ − t₁)/10), γ thường 2 – 4']
          ]
        }
      ]
    },
    {
      id: 'example-gas',
      kind: 'example',
      title: 'Ví dụ 1 — Tốc độ từ khối lượng chất',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho 5,0 g đá vôi (CaCO₃) dạng viên vào 100 mL dung dịch HCl dư. Sau 2 phút, khối lượng CaCO₃ còn lại là 3,0 g. Tính tốc độ trung bình của phản ứng theo CaCO₃ trong 2 phút đầu (mol/phút) (Ca = 40, C = 12, O = 16).',
          steps: [
            'CaCO₃ + 2HCl → CaCl₂ + CO₂ + H₂O; khối lượng CaCO₃ đã phản ứng: 5,0 − 3,0 = 2,0 g.',
            'n(CaCO₃) phản ứng = 2,0 / 100 = 0,02 mol.',
            'v̄ = 0,02 / 2 = 0,01 mol/phút.'
          ],
          answer: 'Tốc độ trung bình theo CaCO₃ là 0,01 mol/phút. Nếu dùng đá vôi dạng bột, tốc độ sẽ lớn hơn.',
          equations: ['CaCO₃ + 2HCl → CaCl₂ + CO₂ + H₂O']
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Lưu ý',
          text: 'Với chất rắn, có thể biểu diễn tốc độ theo lượng chất (mol) hoặc khối lượng mất đi trong một đơn vị thời gian; với chất trong dung dịch hay chất khí, thường dùng nồng độ.'
        }
      ]
    },
    {
      id: 'example-law',
      kind: 'example',
      title: 'Ví dụ 2 — Thay đổi đồng thời nhiều yếu tố',
      blocks: [
        {
          type: 'worked',
          problem: 'Phản ứng đơn giản A + 2B → C có v = k·C_A·C_B². (a) Tốc độ thay đổi thế nào nếu tăng C_A lên 2 lần và giảm C_B đi 2 lần? (b) Phản ứng có γ = 2; ở 30 °C phản ứng kết thúc sau 40 phút. Ở 60 °C (nồng độ như cũ) mất bao lâu?',
          steps: [
            '(a) v′/v = 2 × (1/2)² = 2 × 1/4 = 1/2 ⇒ tốc độ giảm 2 lần.',
            '(b) v₂/v₁ = 2^((60 − 30)/10) = 2³ = 8.',
            'Thời gian tỉ lệ nghịch với tốc độ: 40 / 8 = 5 phút.'
          ],
          answer: '(a) Tốc độ giảm một nửa. (b) Khoảng 5 phút.'
        }
      ]
    },
    {
      id: 'example-life',
      kind: 'example',
      title: 'Ví dụ 3 — Giải thích hiện tượng thực tế',
      blocks: [
        {
          type: 'worked',
          problem: 'Giải thích: (a) than tổ ong có nhiều lỗ; (b) quạt gió vào bếp than làm lửa cháy to; (c) thực phẩm bảo quản trong tủ lạnh lâu hỏng hơn.',
          steps: [
            '(a) Các lỗ làm tăng diện tích tiếp xúc giữa than và không khí ⇒ tốc độ cháy tăng.',
            '(b) Quạt gió cung cấp thêm không khí, tăng nồng độ O₂ tại bề mặt than ⇒ cháy mạnh hơn.',
            '(c) Nhiệt độ thấp làm chậm các phản ứng gây hỏng thực phẩm (do vi sinh vật và enzyme).'
          ],
          answer: 'Lần lượt là ảnh hưởng của diện tích bề mặt, nồng độ và nhiệt độ.'
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
          id: 'g10-l20-c1',
          question: 'Đơn vị nào phù hợp cho tốc độ phản ứng tính theo nồng độ?',
          options: [
            { id: 'a', text: 'mol/L' },
            { id: 'b', text: 'mol/(L·s)' },
            { id: 'c', text: 'L/mol' },
            { id: 'd', text: 'g/mol' }
          ],
          correct: 'b',
          explanation: 'Tốc độ là biến thiên nồng độ (mol/L) trong một đơn vị thời gian (s).'
        },
        {
          type: 'quiz',
          id: 'g10-l20-c2',
          question: 'Nồng độ chất A giảm từ 0,50 M xuống 0,30 M trong 40 giây. Tốc độ trung bình theo A (hệ số 1) là',
          options: [
            { id: 'a', text: '0,005 M/s' },
            { id: 'b', text: '0,0075 M/s' },
            { id: 'c', text: '0,020 M/s' },
            { id: 'd', text: '8 M/s' }
          ],
          correct: 'a',
          explanation: 'v̄ = (0,50 − 0,30) / 40 = 0,005 M/s.'
        },
        {
          type: 'quiz',
          id: 'g10-l20-c3',
          question: 'Nấu thực phẩm bằng nồi áp suất nhanh chín hơn vì',
          options: [
            { id: 'a', text: 'áp suất cao làm tăng nhiệt độ sôi của nước, nhiệt độ nấu cao hơn' },
            { id: 'b', text: 'nồi áp suất có chất xúc tác' },
            { id: 'c', text: 'thực phẩm được chia nhỏ hơn' },
            { id: 'd', text: 'nồng độ thực phẩm tăng' }
          ],
          correct: 'a',
          explanation: 'Trong nồi kín, áp suất tăng làm nước sôi ở trên 100 °C; nhiệt độ cao làm các phản ứng xảy ra nhanh hơn.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 6',
      blocks: [
        {
          type: 'list',
          items: [
            'Tính v̄: lấy độ biến thiên lượng chất (hoặc nồng độ), chia cho thời gian và hệ số.',
            'So sánh tốc độ khi đổi nồng độ: dùng biểu thức v = k·C_Aᵃ·C_Bᵇ, lập tỉ số v′/v.',
            'So sánh tốc độ khi đổi nhiệt độ: v₂/v₁ = γ^(Δt/10); thời gian phản ứng tỉ lệ nghịch với tốc độ.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Tốc độ tăng 8 lần thì thời gian phản ứng tăng 8 lần.', right: 'Thời gian **giảm** 8 lần (tỉ lệ nghịch với tốc độ).' },
            { wrong: 'Giảm C_B đi 2 lần với v = k·C_A·C_B² thì v giảm 2 lần.', right: 'C_B có số mũ 2 nên v giảm **4 lần**.' },
            { wrong: 'Bảo quản lạnh làm thực phẩm không bao giờ hỏng.', right: 'Nhiệt độ thấp chỉ **làm chậm** phản ứng, không dừng hẳn.' }
          ]
        },
        {
          type: 'p',
          text: 'Chương tiếp theo: **Nguyên tố nhóm halogen**.'
        }
      ]
    }
  ]
}
