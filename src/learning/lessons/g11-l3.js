// Hóa học 11 · Chương 1 · Bài 3 — Ôn tập chương 1 (Cân bằng hóa học).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l3',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa phản ứng thuận nghịch, hằng số cân bằng, nguyên lí Le Chatelier, sự điện li, thuyết Brønsted – Lowry và pH.',
    'Vận dụng tính KC, dự đoán chiều chuyển dịch cân bằng, tính pH của dung dịch acid – base mạnh và hỗn hợp trung hòa.'
  ],
  prerequisites: [
    'Bài 1: Khái niệm về cân bằng hóa học.',
    'Bài 2: Cân bằng trong dung dịch nước.'
  ],
  sources: [
    programme('Cân bằng hóa học'),
    textbook(11, 3)
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
          text: 'Trộn 100 mL dung dịch HCl với 100 mL dung dịch NaOH, dung dịch thu được có pH bao nhiêu? Câu trả lời phụ thuộc vào chất nào còn dư — một bài toán kết hợp phản ứng trung hòa với khái niệm pH.'
        },
        {
          type: 'list',
          items: [
            'Hệ thống hóa kiến thức chương 1.',
            'Luyện tính KC và dự đoán chiều chuyển dịch cân bằng.',
            'Luyện tính pH của dung dịch sau khi trộn acid với base.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 1',
      blocks: [
        {
          type: 'table',
          caption: 'Cân bằng hóa học và cân bằng trong dung dịch nước',
          head: ['Nội dung', 'Ghi nhớ'],
          rows: [
            ['Cân bằng hóa học', 'v thuận = v nghịch; cân bằng động; nồng độ không đổi'],
            ['Hằng số cân bằng', 'aA + bB ⇌ cC + dD: KC = [C]ᶜ[D]ᵈ/([A]ᵃ[B]ᵇ); không ghi chất rắn; chỉ phụ thuộc nhiệt độ'],
            ['Le Chatelier', 'Cân bằng chuyển dịch theo chiều làm giảm tác động (nồng độ, nhiệt độ, áp suất); xúc tác không làm chuyển dịch'],
            ['Sự điện li', 'Điện li mạnh (→), điện li yếu (⇌), không điện li'],
            ['Brønsted – Lowry', 'Acid cho H⁺, base nhận H⁺; chất lưỡng tính'],
            ['pH', 'pH = −lg[H⁺]; [H⁺][OH⁻] = 10⁻¹⁴ ở 25 °C']
          ]
        }
      ]
    },
    {
      id: 'example-equilibrium',
      kind: 'example',
      title: 'Ví dụ 1 — Cân bằng sản xuất SO₃',
      blocks: [
        { type: 'equation', text: '2SO₂(g) + O₂(g) ⇌ 2SO₃(g)', note: 'Phản ứng thuận tỏa nhiệt (ΔrH°298 < 0), xúc tác V₂O₅.' },
        {
          type: 'worked',
          problem: '(a) Viết biểu thức KC. (b) Ở một nhiệt độ, nồng độ cân bằng: [SO₂] = 0,20 M; [O₂] = 0,10 M; [SO₃] = 0,40 M. Tính KC. (c) Nêu ba biện pháp làm cân bằng chuyển dịch theo chiều thuận.',
          steps: [
            '(a) KC = [SO₃]² / ([SO₂]²·[O₂]).',
            '(b) KC = 0,40² / (0,20² × 0,10) = 0,16 / 0,004 = 40.',
            '(c) Tăng áp suất (3 mol khí → 2 mol khí), giảm nhiệt độ (chiều thuận tỏa nhiệt), tăng nồng độ O₂ hoặc lấy bớt SO₃.'
          ],
          answer: 'KC = 40; chất xúc tác V₂O₅ chỉ giúp nhanh đạt cân bằng, không làm chuyển dịch cân bằng.'
        }
      ]
    },
    {
      id: 'example-mix',
      kind: 'example',
      title: 'Ví dụ 2 — pH sau phản ứng trung hòa',
      blocks: [
        {
          type: 'worked',
          problem: 'Trộn 100 mL dung dịch HCl 0,10 M với 100 mL dung dịch NaOH 0,08 M. Tính pH của dung dịch thu được (25 °C).',
          steps: [
            'n(H⁺) = 0,1 × 0,10 = 0,010 mol; n(OH⁻) = 0,1 × 0,08 = 0,008 mol.',
            'H⁺ + OH⁻ → H₂O: H⁺ dư 0,010 − 0,008 = 0,002 mol.',
            'Thể tích sau khi trộn: 200 mL = 0,2 L ⇒ [H⁺] = 0,002 / 0,2 = 0,01 M ⇒ pH = 2.'
          ],
          answer: 'pH = 2 (dung dịch còn dư acid).',
          equations: ['H⁺ + OH⁻ → H₂O']
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Ghi nhớ',
          text: 'Luôn tính số mol H⁺ và OH⁻ trước, xác định chất dư, rồi chia cho **tổng thể tích sau khi trộn**.'
        }
      ]
    },
    {
      id: 'example-acid-base',
      kind: 'example',
      title: 'Ví dụ 3 — Nhận biết acid, base, lưỡng tính',
      blocks: [
        {
          type: 'worked',
          problem: 'Theo thuyết Brønsted – Lowry, cho biết vai trò của HSO₄⁻ trong phản ứng HSO₄⁻ + H₂O ⇌ SO₄²⁻ + H₃O⁺ và của HCO₃⁻ trong phản ứng HCO₃⁻ + H₂O ⇌ H₂CO₃ + OH⁻.',
          steps: [
            'HSO₄⁻ nhường H⁺ cho H₂O tạo SO₄²⁻ ⇒ HSO₄⁻ là acid.',
            'HCO₃⁻ nhận H⁺ từ H₂O tạo H₂CO₃ ⇒ HCO₃⁻ là base trong phản ứng này.',
            'HCO₃⁻ cũng có thể cho H⁺ (với OH⁻ tạo CO₃²⁻) nên là chất lưỡng tính.'
          ],
          answer: 'HSO₄⁻: acid; HCO₃⁻: base trong phản ứng đã cho và là chất lưỡng tính.',
          equations: ['HSO₄⁻ + H₂O ⇌ SO₄²⁻ + H₃O⁺', 'HCO₃⁻ + H₂O ⇌ H₂CO₃ + OH⁻']
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
          id: 'g11-l3-c1',
          question: 'Với cân bằng 2SO₂(g) + O₂(g) ⇌ 2SO₃(g) (chiều thuận tỏa nhiệt), tăng nhiệt độ thì',
          options: [
            { id: 'a', text: 'cân bằng chuyển dịch theo chiều thuận' },
            { id: 'b', text: 'cân bằng chuyển dịch theo chiều nghịch' },
            { id: 'c', text: 'cân bằng không chuyển dịch' },
            { id: 'd', text: 'KC tăng' }
          ],
          correct: 'b',
          explanation: 'Tăng nhiệt độ, cân bằng chuyển dịch theo chiều thu nhiệt (chiều nghịch); KC giảm.'
        },
        {
          type: 'quiz',
          id: 'g11-l3-c2',
          question: 'Dung dịch KOH 0,01 M có pH bằng',
          options: [
            { id: 'a', text: '2' },
            { id: 'b', text: '12' },
            { id: 'c', text: '10' },
            { id: 'd', text: '7' }
          ],
          correct: 'b',
          explanation: '[OH⁻] = 10⁻² ⇒ [H⁺] = 10⁻¹² ⇒ pH = 12.'
        },
        {
          type: 'quiz',
          id: 'g11-l3-c3',
          question: 'Trộn 50 mL HCl 0,1 M với 50 mL NaOH 0,1 M. Dung dịch thu được có pH',
          options: [
            { id: 'a', text: '= 7' },
            { id: 'b', text: '< 7' },
            { id: 'c', text: '> 7' },
            { id: 'd', text: '= 1' }
          ],
          correct: 'a',
          explanation: 'n(H⁺) = n(OH⁻) = 0,005 mol: trung hòa vừa đủ, dung dịch NaCl trung tính.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 1',
      blocks: [
        {
          type: 'list',
          items: [
            'Tính KC: thay nồng độ cân bằng (không phải nồng độ ban đầu) vào biểu thức.',
            'Dự đoán chuyển dịch: xác định tác động rồi chọn chiều làm giảm tác động đó.',
            'Bài toán trộn acid – base: so sánh n(H⁺) và n(OH⁻), tính nồng độ chất dư trong tổng thể tích.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Thay nồng độ ban đầu vào biểu thức KC.', right: 'KC dùng **nồng độ tại trạng thái cân bằng**.' },
            { wrong: 'Tính [H⁺] dư bằng cách chia cho thể tích dung dịch acid ban đầu.', right: 'Chia cho **tổng thể tích sau khi trộn**.' },
            { wrong: 'Tăng nhiệt độ luôn làm KC tăng.', right: 'KC tăng nếu chiều thuận thu nhiệt, **giảm** nếu chiều thuận tỏa nhiệt.' }
          ]
        },
        {
          type: 'p',
          text: 'Chương tiếp theo: **Nitrogen và sulfur**.'
        }
      ]
    }
  ]
}
