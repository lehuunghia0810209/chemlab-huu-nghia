// Hóa học 10 · Chương 7 · Bài 22 — Hydrogen halide. Muối halide.
// Boiling points (CRC, rounded); H–X bond energies: common textbook mean values.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l22',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Giải thích được xu hướng biến đổi nhiệt độ sôi của các hydrogen halide (HF bất thường do liên kết hydrogen).',
    'Nêu được xu hướng biến đổi tính acid của dãy hydrohalic acid; tính chất của hydrochloric acid (với kim loại, oxide base, base, muối).',
    'Trình bày được tính khử của các ion halide (phản ứng với H₂SO₄ đặc).',
    'Nhận biết được ion halide bằng dung dịch silver nitrate; nêu được ứng dụng của một số hydrogen halide và muối halide.'
  ],
  prerequisites: [
    'Bài 21: tính oxi hóa của halogen giảm từ F₂ đến I₂.',
    'Bài 13: liên kết hydrogen; bài 12: năng lượng liên kết.'
  ],
  sources: [
    programme('Hydrogen halide. Muối halide'),
    textbook(10, 22),
    'Nhiệt độ sôi: CRC Handbook; năng lượng liên kết H–X: giá trị trung bình thường dùng.'
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
          text: 'Dịch vị dạ dày chứa hydrochloric acid, người thợ khắc dùng hydrofluoric acid để khắc chữ lên thủy tinh, còn ở phòng thí nghiệm chỉ cần vài giọt silver nitrate là phân biệt được muối ăn với muối iodide. Các hợp chất của halogen với hydrogen và kim loại có gì đặc biệt?'
        },
        {
          type: 'list',
          items: [
            'So sánh nhiệt độ sôi và tính acid của HF, HCl, HBr, HI.',
            'Viết phản ứng thể hiện tính acid của hydrochloric acid.',
            'So sánh tính khử của ion halide.',
            'Nhận biết ion halide bằng AgNO₃.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Liên kết hydrogen làm tăng nhiệt độ sôi.', 'Năng lượng liên kết lớn ⇒ liên kết bền.'] }
      ]
    },
    {
      id: 'hydrogen-halides',
      kind: 'concept',
      title: 'Hydrogen halide và hydrohalic acid',
      blocks: [
        {
          type: 'p',
          text: 'Hydrogen halide (HX) là chất khí ở điều kiện thường, tan tốt trong nước tạo dung dịch **hydrohalic acid**: hydrofluoric acid (HF), hydrochloric acid (HCl), hydrobromic acid (HBr), hydroiodic acid (HI).'
        },
        {
          type: 'table',
          caption: 'So sánh các hydrogen halide',
          head: ['', 'HF', 'HCl', 'HBr', 'HI'],
          rows: [
            ['Nhiệt độ sôi (°C)', '20', '−85', '−67', '−35'],
            ['Năng lượng liên kết H–X (kJ/mol)', '565', '432', '366', '298'],
            ['Tính acid trong nước', 'Yếu', 'Mạnh', 'Mạnh hơn', 'Mạnh nhất']
          ]
        },
        {
          type: 'list',
          items: [
            'Nhiệt độ sôi tăng từ HCl đến HI do khối lượng phân tử tăng (van der Waals); HF cao bất thường do liên kết hydrogen giữa các phân tử.',
            'Tính acid tăng từ HF đến HI: liên kết H–X kém bền dần nên H⁺ dễ tách ra hơn.',
            'HF tuy là acid yếu nhưng ăn mòn thủy tinh (SiO₂), dùng để khắc thủy tinh.'
          ]
        },
        { type: 'equation', text: 'SiO₂ + 4HF → SiF₄ + 2H₂O' }
      ]
    },
    {
      id: 'hcl',
      kind: 'concept',
      title: 'Tính chất của hydrochloric acid',
      blocks: [
        { type: 'p', text: 'Dung dịch HCl có đầy đủ tính chất của một acid mạnh:' },
        { type: 'equation', text: 'Fe + 2HCl → FeCl₂ + H₂', note: 'Với kim loại đứng trước H: tạo muối và khí H₂ (sắt lên +2).' },
        { type: 'equation', text: 'CuO + 2HCl → CuCl₂ + H₂O', note: 'Với oxide base.' },
        { type: 'equation', text: 'NaOH + HCl → NaCl + H₂O', note: 'Với base (phản ứng trung hòa).' },
        { type: 'equation', text: 'CaCO₃ + 2HCl → CaCl₂ + CO₂ + H₂O', note: 'Với muối của acid yếu hơn.' },
        {
          type: 'p',
          text: 'Ứng dụng: tẩy gỉ kim loại, sản xuất hợp chất chlorine, điều chỉnh pH. Trong dạ dày, HCl giúp tiêu hóa thức ăn và diệt khuẩn.'
        }
      ]
    },
    {
      id: 'halide-reducing',
      kind: 'concept',
      title: 'Tính khử của ion halide',
      blocks: [
        {
          type: 'p',
          text: 'Ion halide X⁻ có thể nhường electron (bị oxi hóa thành X₂). Bán kính ion tăng từ F⁻ đến I⁻ nên electron càng dễ bị tách: **tính khử tăng dần F⁻ < Cl⁻ < Br⁻ < I⁻**.'
        },
        {
          type: 'table',
          caption: 'Muối halide rắn tác dụng với H₂SO₄ đặc',
          head: ['Muối', 'Sản phẩm', 'Nhận xét'],
          rows: [
            ['NaCl', 'NaHSO₄ + HCl', 'Cl⁻ không khử được H₂SO₄ đặc'],
            ['NaBr', 'Br₂, SO₂', 'Br⁻ khử S⁺⁶ xuống +4'],
            ['NaI', 'I₂, H₂S', 'I⁻ khử S⁺⁶ xuống −2']
          ]
        },
        { type: 'equation', text: 'NaCl + H₂SO₄ → NaHSO₄ + HCl', condition: 't°, H₂SO₄ đặc' },
        { type: 'equation', text: '2NaBr + 3H₂SO₄ → 2NaHSO₄ + Br₂ + SO₂ + 2H₂O', condition: 'H₂SO₄ đặc' },
        { type: 'equation', text: '8NaI + 9H₂SO₄ → 8NaHSO₄ + 4I₂ + H₂S + 4H₂O', condition: 'H₂SO₄ đặc' }
      ]
    },
    {
      id: 'identify',
      kind: 'concept',
      title: 'Nhận biết ion halide',
      blocks: [
        {
          type: 'table',
          caption: 'Thuốc thử: dung dịch AgNO₃',
          head: ['Ion', 'Hiện tượng', 'Kết tủa'],
          rows: [
            ['F⁻', 'Không có kết tủa', 'AgF tan'],
            ['Cl⁻', 'Kết tủa trắng', 'AgCl'],
            ['Br⁻', 'Kết tủa vàng nhạt', 'AgBr'],
            ['I⁻', 'Kết tủa vàng', 'AgI']
          ]
        },
        { type: 'equation', text: 'AgNO₃ + NaCl → AgCl + NaNO₃' },
        { type: 'equation', text: 'Ag⁺ + I⁻ → AgI', note: 'Dạng ion thu gọn.' },
        {
          type: 'callout',
          tone: 'note',
          title: 'Ứng dụng của muối halide',
          text: 'NaCl: muối ăn, nguyên liệu sản xuất Cl₂, NaOH; KCl: phân bón kali; NaF: chống sâu răng; AgBr: từng dùng làm phim ảnh vì bị phân hủy bởi ánh sáng.'
        }
      ]
    },
    {
      id: 'example-identify',
      kind: 'example',
      title: 'Ví dụ — Nhận biết và tính toán',
      blocks: [
        {
          type: 'worked',
          problem: 'Có ba lọ mất nhãn chứa dung dịch NaCl, NaBr, NaI. (a) Nêu cách nhận biết bằng một thuốc thử. (b) Cho 100 mL dung dịch NaCl 0,1 M tác dụng với AgNO₃ dư. Tính khối lượng kết tủa (Ag = 108, Cl = 35,5).',
          steps: [
            '(a) Nhỏ dung dịch AgNO₃ vào từng mẫu: kết tủa trắng là NaCl, vàng nhạt là NaBr, vàng là NaI.',
            '(b) n(NaCl) = 0,1 × 0,1 = 0,01 mol. AgNO₃ + NaCl → AgCl + NaNO₃ ⇒ n(AgCl) = 0,01 mol.',
            'M(AgCl) = 108 + 35,5 = 143,5 g/mol ⇒ m = 0,01 × 143,5 = 1,435 g.'
          ],
          answer: '(a) Dùng AgNO₃. (b) m(AgCl) ≈ 1,435 g.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: nhận biết ion chloride và iodide',
      blocks: [
        {
          type: 'p',
          text: 'Làm hai thí nghiệm có hướng dẫn: nhỏ AgNO₃ vào dung dịch chứa Cl⁻, rồi vào dung dịch chứa I⁻. So sánh màu kết tủa với bảng ở trên.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Nhận biết ion chloride',
          text: 'Mở trong Phòng thí nghiệm ảo.',
          action: { kind: 'guided', grade: 10, lessonId: 'g10-l22', experimentId: 'g10-halide-chloride' }
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Phân biệt ion iodide',
          text: 'Quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'guided', grade: 10, lessonId: 'g10-l22', experimentId: 'g10-halide-iodide' }
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
          id: 'g10-l22-c1',
          question: 'Dãy hydrohalic acid nào sắp xếp theo chiều tính acid tăng dần?',
          options: [
            { id: 'a', text: 'HI, HBr, HCl, HF' },
            { id: 'b', text: 'HF, HCl, HBr, HI' },
            { id: 'c', text: 'HCl, HF, HI, HBr' },
            { id: 'd', text: 'HF, HI, HBr, HCl' }
          ],
          correct: 'b',
          explanation: 'Liên kết H–X kém bền dần từ HF đến HI nên tính acid tăng dần.'
        },
        {
          type: 'quiz',
          id: 'g10-l22-c2',
          question: 'Thêm dung dịch AgNO₃ vào dung dịch KBr, hiện tượng quan sát được là',
          options: [
            { id: 'a', text: 'kết tủa trắng' },
            { id: 'b', text: 'kết tủa vàng nhạt' },
            { id: 'c', text: 'không có hiện tượng' },
            { id: 'd', text: 'khí màu nâu bay ra' }
          ],
          correct: 'b',
          explanation: 'Ag⁺ + Br⁻ → AgBr, kết tủa màu vàng nhạt.'
        },
        {
          type: 'quiz',
          id: 'g10-l22-c3',
          question: 'Acid nào được dùng để khắc chữ lên thủy tinh?',
          options: [
            { id: 'a', text: 'HCl' },
            { id: 'b', text: 'HF' },
            { id: 'c', text: 'HBr' },
            { id: 'd', text: 'HI' }
          ],
          correct: 'b',
          explanation: 'SiO₂ + 4HF → SiF₄ + 2H₂O; các acid còn lại không phản ứng với SiO₂.'
        },
        {
          type: 'quiz',
          id: 'g10-l22-c4',
          question: 'Ion halide có tính khử mạnh nhất là',
          options: [
            { id: 'a', text: 'F⁻' },
            { id: 'b', text: 'Cl⁻' },
            { id: 'c', text: 'Br⁻' },
            { id: 'd', text: 'I⁻' }
          ],
          correct: 'd',
          explanation: 'I⁻ có bán kính lớn nhất, electron dễ bị tách nhất; I⁻ khử được H₂SO₄ đặc đến H₂S.'
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
            'Nhiệt độ sôi: HCl < HBr < HI < HF (HF có liên kết hydrogen).',
            'Tính acid: HF (yếu) < HCl < HBr < HI.',
            'Tính khử của ion halide: F⁻ < Cl⁻ < Br⁻ < I⁻.',
            'AgNO₃ nhận biết: AgCl trắng, AgBr vàng nhạt, AgI vàng; AgF tan.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'HF là acid mạnh nhất vì F có độ âm điện lớn nhất.', right: 'HF là **acid yếu**: liên kết H–F rất bền nên khó phân li; HI mạnh nhất.' },
            { wrong: 'Dùng AgNO₃ để nhận biết ion F⁻ qua kết tủa.', right: '**AgF tan** trong nước nên không tạo kết tủa.' },
            { wrong: 'NaCl tác dụng với H₂SO₄ đặc giải phóng Cl₂.', right: 'Cl⁻ không khử được H₂SO₄ đặc; sản phẩm là **khí HCl**.' },
            { wrong: 'Fe + 2HCl tạo FeCl₃.', right: 'H⁺ chỉ oxi hóa Fe lên +2: **FeCl₂**.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Ôn tập chương 7**.'
        }
      ]
    }
  ]
}
