// Hóa học 10 · Chương 7 · Bài 23 — Ôn tập chương 7 (Nguyên tố nhóm halogen).
// This lesson has no guided Lab activity; it exists only in the Learning catalog.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l23',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa tính chất của đơn chất halogen, hydrogen halide và muối halide.',
    'Vận dụng để nhận biết chất, so sánh tính chất và giải bài tập định lượng về halogen.'
  ],
  prerequisites: [
    'Bài 21: Nhóm halogen.',
    'Bài 22: Hydrogen halide. Muối halide.'
  ],
  sources: [
    programme('Nguyên tố nhóm halogen'),
    textbook(10, 23)
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
          text: 'Từ fluorine đến iodine, tính oxi hóa của đơn chất giảm dần, nhưng tính acid của HX và tính khử của X⁻ lại tăng dần. Vì sao các xu hướng này “ngược chiều” nhau, và làm sao nhớ chúng một cách có hệ thống?'
        },
        {
          type: 'list',
          items: [
            'Hệ thống hóa các xu hướng biến đổi trong nhóm halogen.',
            'Luyện nhận biết và chuỗi phản ứng của halogen.',
            'Giải bài tập định lượng kết hợp nhiều phản ứng.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 7',
      blocks: [
        {
          type: 'table',
          caption: 'Xu hướng từ F đến I',
          head: ['Tính chất', 'Xu hướng (F → I)', 'Nguyên nhân chính'],
          rows: [
            ['Bán kính nguyên tử', 'Tăng', 'Số lớp electron tăng'],
            ['Độ âm điện', 'Giảm (3,98 → 2,66)', 'Bán kính tăng, hút electron yếu hơn'],
            ['Nhiệt độ nóng chảy, sôi của X₂', 'Tăng', 'Khối lượng phân tử tăng, van der Waals mạnh hơn'],
            ['Tính oxi hóa của X₂', 'Giảm', 'Nguyên tử khó nhận electron hơn'],
            ['Tính acid của HX', 'Tăng (HF yếu)', 'Liên kết H–X kém bền dần'],
            ['Tính khử của X⁻', 'Tăng', 'Ion lớn hơn, dễ nhường electron hơn']
          ]
        },
        {
          type: 'p',
          text: 'Nguyên tử X càng khó nhận electron (tính oxi hóa X₂ yếu) thì ion X⁻ càng dễ nhường lại electron (tính khử X⁻ mạnh) — đó là lí do hai xu hướng ngược chiều nhau.'
        }
      ]
    },
    {
      id: 'example-chain',
      kind: 'example',
      title: 'Ví dụ 1 — Chuỗi phản ứng',
      blocks: [
        {
          type: 'worked',
          problem: 'Viết các phương trình thực hiện chuỗi: NaCl → Cl₂ → HCl → FeCl₂, và Cl₂ → Br₂ → I₂.',
          steps: [
            'NaCl → Cl₂: điện phân dung dịch có màng ngăn: 2NaCl + 2H₂O → 2NaOH + H₂ + Cl₂.',
            'Cl₂ → HCl: H₂ + Cl₂ → 2HCl (chiếu sáng).',
            'HCl → FeCl₂: Fe + 2HCl → FeCl₂ + H₂.',
            'Cl₂ → Br₂: Cl₂ + 2NaBr → 2NaCl + Br₂; Br₂ → I₂: Br₂ + 2NaI → 2NaBr + I₂.'
          ],
          answer: 'Mỗi bước dùng đúng tính chất: điện phân, tính oxi hóa của Cl₂, tính acid của HCl, halogen mạnh đẩy halogen yếu.',
          equations: [
            '2NaCl + 2H₂O → 2NaOH + H₂ + Cl₂',
            'H₂ + Cl₂ → 2HCl',
            'Fe + 2HCl → FeCl₂ + H₂',
            'Cl₂ + 2NaBr → 2NaCl + Br₂',
            'Br₂ + 2NaI → 2NaBr + I₂'
          ]
        }
      ]
    },
    {
      id: 'example-mixture',
      kind: 'example',
      title: 'Ví dụ 2 — Bài toán hỗn hợp',
      blocks: [
        {
          type: 'worked',
          problem: 'Hòa tan hoàn toàn 11,2 g Fe trong dung dịch HCl dư. (a) Tính thể tích H₂ ở điều kiện chuẩn (24,79 L/mol). (b) Cho dung dịch sau phản ứng tác dụng với AgNO₃ vừa đủ để kết tủa hết ion Cl⁻ của FeCl₂ tạo thành; tính khối lượng AgCl (Fe = 56, Ag = 108, Cl = 35,5). Bỏ qua phần HCl dư.',
          steps: [
            'n(Fe) = 11,2 / 56 = 0,2 mol. Fe + 2HCl → FeCl₂ + H₂ ⇒ n(H₂) = n(FeCl₂) = 0,2 mol.',
            '(a) V(H₂) = 0,2 × 24,79 = 4,958 L.',
            '(b) FeCl₂ chứa 0,2 × 2 = 0,4 mol Cl⁻ ⇒ n(AgCl) = 0,4 mol.',
            'm(AgCl) = 0,4 × 143,5 = 57,4 g.'
          ],
          answer: '(a) V(H₂) ≈ 4,96 L. (b) m(AgCl) = 57,4 g.',
          equations: ['Fe + 2HCl → FeCl₂ + H₂', 'FeCl₂ + 2AgNO₃ → Fe(NO₃)₂ + 2AgCl']
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Lưu ý',
          text: 'Trong thực tế, Fe²⁺ còn bị Ag⁺ oxi hóa (Fe²⁺ + Ag⁺ → Fe³⁺ + Ag) khi AgNO₃ dư; bài toán ở đây chỉ dùng lượng AgNO₃ vừa đủ để kết tủa ion Cl⁻.'
        }
      ]
    },
    {
      id: 'example-identify',
      kind: 'example',
      title: 'Ví dụ 3 — Nhận biết',
      blocks: [
        {
          type: 'worked',
          problem: 'Chỉ dùng thêm dung dịch AgNO₃ và giấy quỳ tím, nhận biết 4 dung dịch mất nhãn: HCl, NaCl, NaBr, NaNO₃.',
          steps: [
            'Dùng quỳ tím: dung dịch làm quỳ hóa đỏ là HCl.',
            'Ba dung dịch còn lại (trung tính) cho tác dụng với AgNO₃.',
            'Kết tủa trắng: NaCl; kết tủa vàng nhạt: NaBr; không hiện tượng: NaNO₃.'
          ],
          answer: 'Quỳ tím tách HCl; AgNO₃ phân biệt NaCl, NaBr, NaNO₃.',
          equations: ['AgNO₃ + NaBr → AgBr + NaNO₃']
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
          id: 'g10-l23-c1',
          question: 'Phát biểu nào đúng về xu hướng từ F đến I?',
          options: [
            { id: 'a', text: 'Tính oxi hóa của đơn chất tăng dần.' },
            { id: 'b', text: 'Tính khử của ion halide tăng dần.' },
            { id: 'c', text: 'Tính acid của HX giảm dần.' },
            { id: 'd', text: 'Độ âm điện tăng dần.' }
          ],
          correct: 'b',
          explanation: 'Tính oxi hóa X₂ giảm, độ âm điện giảm, tính acid HX tăng, tính khử X⁻ tăng.'
        },
        {
          type: 'quiz',
          id: 'g10-l23-c2',
          question: 'Cho khí Cl₂ vào dung dịch KI có sẵn vài giọt hồ tinh bột. Hiện tượng là',
          options: [
            { id: 'a', text: 'dung dịch không đổi màu' },
            { id: 'b', text: 'dung dịch chuyển màu xanh tím' },
            { id: 'c', text: 'có kết tủa trắng' },
            { id: 'd', text: 'có khí không màu bay ra' }
          ],
          correct: 'b',
          explanation: 'Cl₂ + 2KI → 2KCl + I₂; I₂ tạo với hồ tinh bột màu xanh tím.'
        },
        {
          type: 'quiz',
          id: 'g10-l23-c3',
          question: 'Chất nào dùng để sản xuất nước Javel?',
          options: [
            { id: 'a', text: 'Cl₂ và dung dịch NaOH ở nhiệt độ thường' },
            { id: 'b', text: 'HCl và NaOH' },
            { id: 'c', text: 'Br₂ và H₂O' },
            { id: 'd', text: 'NaCl và H₂SO₄ đặc' }
          ],
          correct: 'a',
          explanation: 'Cl₂ + 2NaOH → NaCl + NaClO + H₂O; NaClO có tính tẩy màu, sát khuẩn.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 7',
      blocks: [
        {
          type: 'list',
          items: [
            'Halogen là phi kim có tính oxi hóa mạnh, giảm dần từ F₂ đến I₂.',
            'HX: tính acid tăng từ HF đến HI; ion X⁻: tính khử tăng từ F⁻ đến I⁻.',
            'Nhận biết: AgNO₃ (AgCl trắng, AgBr vàng nhạt, AgI vàng); I₂ làm hồ tinh bột hóa xanh tím.',
            'Bài toán: viết đúng sản phẩm (FeCl₂ với HCl, FeCl₃ với Cl₂), tính theo số mol ion Cl⁻ khi tạo kết tủa.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Tính oxi hóa của X₂ và tính khử của X⁻ biến đổi cùng chiều.', right: 'Hai xu hướng **ngược chiều**: X₂ oxi hóa yếu dần, X⁻ khử mạnh dần.' },
            { wrong: 'Số mol AgCl bằng số mol FeCl₂.', right: 'Mỗi FeCl₂ có **2 ion Cl⁻** ⇒ n(AgCl) = 2n(FeCl₂).' },
            { wrong: 'Dùng quỳ tím phân biệt NaCl và NaBr.', right: 'Cả hai đều trung tính; phải dùng **AgNO₃**.' }
          ]
        },
        {
          type: 'p',
          text: 'Em đã học xong chương trình Hóa học 10. Lớp 11 bắt đầu với **Cân bằng hóa học**.'
        }
      ]
    }
  ]
}
