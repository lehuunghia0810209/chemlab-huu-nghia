// Hóa học 11 · Chương 1 · Bài 2 — Cân bằng trong dung dịch nước.
// Kw = 1,0 × 10⁻¹⁴ at 25 °C. pH arithmetic re-checked in scripts/test-learning.mjs.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l2',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Trình bày được khái niệm sự điện li, chất điện li, chất không điện li.',
    'Trình bày được thuyết Brønsted – Lowry về acid – base.',
    'Nêu được khái niệm và ý nghĩa của pH trong thực tiễn; viết được biểu thức pH = −lg[H⁺] và sử dụng được chất chỉ thị để xác định môi trường acid, base, trung tính.',
    'Nêu được nguyên tắc xác định nồng độ acid, base mạnh bằng phương pháp chuẩn độ.',
    'Trình bày được ý nghĩa thực tiễn của cân bằng trong dung dịch nước của ion Al³⁺, Fe³⁺ và CO₃²⁻.'
  ],
  prerequisites: [
    'Bài 1: cân bằng hóa học, phản ứng thuận nghịch.',
    'Hóa 10: acid, base, muối; nồng độ mol; logarit cơ số 10 (lg 10⁻ⁿ = −n).'
  ],
  sources: [
    programme('Cân bằng trong dung dịch nước'),
    textbook(11, 2),
    'Tích số ion của nước Kw = 1,0 × 10⁻¹⁴ ở 25 °C.'
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
          text: 'Nước cất gần như không dẫn điện, nhưng hòa thêm một ít muối ăn thì dẫn điện tốt. Máu người luôn giữ pH quanh 7,4; dịch vị dạ dày lại rất chua. Điều gì xảy ra với các chất khi tan trong nước, và làm sao đo được độ “chua” đó?'
        },
        {
          type: 'list',
          items: [
            'Phân biệt chất điện li mạnh, chất điện li yếu và chất không điện li.',
            'Xác định acid, base theo thuyết Brønsted – Lowry.',
            'Tính pH của dung dịch acid mạnh, base mạnh; dùng chất chỉ thị.',
            'Hiểu nguyên tắc chuẩn độ và ý nghĩa của sự thủy phân ion Al³⁺, Fe³⁺, CO₃²⁻.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Cân bằng động: phản ứng thuận nghịch, kí hiệu ⇌.', 'lg 10⁻² = −2; lg 10⁻¹² = −12.'] }
      ]
    },
    {
      id: 'electrolytes',
      kind: 'concept',
      title: 'Sự điện li',
      blocks: [
        {
          type: 'callout',
          title: 'Sự điện li',
          text: 'Là quá trình phân li các chất trong nước (hoặc khi nóng chảy) thành ion. Chất tan trong nước phân li ra ion gọi là **chất điện li**; dung dịch của chúng dẫn được điện.'
        },
        {
          type: 'table',
          caption: 'Phân loại',
          head: ['Loại', 'Đặc điểm', 'Ví dụ'],
          rows: [
            ['Chất điện li mạnh', 'Phân li hoàn toàn, viết mũi tên một chiều (→)', 'Acid mạnh HCl, HNO₃, H₂SO₄; base mạnh NaOH, KOH, Ba(OH)₂; hầu hết muối tan'],
            ['Chất điện li yếu', 'Chỉ phân li một phần, viết mũi tên hai chiều (⇌)', 'CH₃COOH, HF, H₂S, NH₃'],
            ['Chất không điện li', 'Tan nhưng không phân li ra ion', 'Glucose, saccharose, ethanol']
          ]
        },
        { type: 'equation', text: 'NaCl → Na⁺ + Cl⁻' },
        { type: 'equation', text: 'Ba(OH)₂ → Ba²⁺ + 2OH⁻' },
        { type: 'equation', text: 'CH₃COOH ⇌ CH₃COO⁻ + H⁺', note: 'Phân li một phần: dung dịch còn nhiều phân tử CH₃COOH.' }
      ]
    },
    {
      id: 'bronsted',
      kind: 'concept',
      title: 'Thuyết Brønsted – Lowry',
      blocks: [
        {
          type: 'callout',
          title: 'Acid và base',
          text: '**Acid** là chất **cho proton (H⁺)**; **base** là chất **nhận proton**. Phản ứng acid – base là sự chuyển proton từ acid sang base.'
        },
        { type: 'equation', text: 'HCl + H₂O → H₃O⁺ + Cl⁻', note: 'HCl cho H⁺ (acid); H₂O nhận H⁺ (base).' },
        { type: 'equation', text: 'NH₃ + H₂O ⇌ NH₄⁺ + OH⁻', note: 'NH₃ nhận H⁺ (base); H₂O cho H⁺ (acid).' },
        {
          type: 'p',
          text: 'Chất vừa có thể cho, vừa có thể nhận proton là chất **lưỡng tính**, ví dụ H₂O, ion HCO₃⁻:'
        },
        { type: 'equation', text: 'HCO₃⁻ + H₃O⁺ ⇌ H₂CO₃ + H₂O', note: 'HCO₃⁻ nhận proton (base).' },
        { type: 'equation', text: 'HCO₃⁻ + OH⁻ → CO₃²⁻ + H₂O', note: 'HCO₃⁻ cho proton (acid).' }
      ]
    },
    {
      id: 'ph',
      kind: 'concept',
      title: 'pH và chất chỉ thị',
      blocks: [
        {
          type: 'p',
          text: 'Nước phân li rất ít: H₂O ⇌ H⁺ + OH⁻. Ở 25 °C, tích số ion của nước: [H⁺]·[OH⁻] = 1,0 × 10⁻¹⁴. Trong nước nguyên chất [H⁺] = [OH⁻] = 10⁻⁷ M.'
        },
        { type: 'equation', text: 'pH = −lg[H⁺]   ⇔   [H⁺] = 10⁻ᵖᴴ', check: false },
        {
          type: 'table',
          caption: 'Môi trường của dung dịch ở 25 °C',
          head: ['Môi trường', '[H⁺]', 'pH', 'Quỳ tím', 'Phenolphthalein'],
          rows: [
            ['Acid', '> 10⁻⁷ M', '< 7', 'Đỏ', 'Không màu'],
            ['Trung tính', '= 10⁻⁷ M', '= 7', 'Tím', 'Không màu'],
            ['Base', '< 10⁻⁷ M', '> 7', 'Xanh', 'Hồng (khi pH khoảng từ 8,3 trở lên)']
          ]
        },
        {
          type: 'list',
          items: [
            'Máu người có pH khoảng 7,35 – 7,45; dịch vị dạ dày có pH khoảng 1,5 – 3,5.',
            'Đất chua (pH thấp) thường được cải tạo bằng cách bón vôi.',
            'Giấy chỉ thị vạn năng đổi màu theo từng khoảng pH, cho phép ước lượng pH nhanh.'
          ]
        }
      ]
    },
    {
      id: 'example-ph',
      kind: 'example',
      title: 'Ví dụ 1 — Tính pH',
      blocks: [
        {
          type: 'worked',
          problem: 'Tính pH của: (a) dung dịch HCl 0,01 M; (b) dung dịch NaOH 0,001 M; (c) dung dịch Ba(OH)₂ 0,005 M (ở 25 °C).',
          steps: [
            '(a) HCl → H⁺ + Cl⁻ ⇒ [H⁺] = 0,01 = 10⁻² M ⇒ pH = 2.',
            '(b) NaOH → Na⁺ + OH⁻ ⇒ [OH⁻] = 10⁻³ M ⇒ [H⁺] = 10⁻¹⁴ / 10⁻³ = 10⁻¹¹ M ⇒ pH = 11.',
            '(c) Ba(OH)₂ → Ba²⁺ + 2OH⁻ ⇒ [OH⁻] = 2 × 0,005 = 0,01 M ⇒ [H⁺] = 10⁻¹² M ⇒ pH = 12.'
          ],
          answer: 'pH lần lượt là 2, 11 và 12. Chú ý Ba(OH)₂ phân li ra 2 ion OH⁻.'
        }
      ]
    },
    {
      id: 'titration',
      kind: 'example',
      title: 'Ví dụ 2 — Chuẩn độ acid – base',
      blocks: [
        {
          type: 'p',
          text: '**Chuẩn độ** là phương pháp xác định nồng độ của một dung dịch (acid hoặc base) bằng dung dịch đã biết nồng độ (dung dịch chuẩn). Ví dụ: cho dung dịch NaOH chuẩn từ burette vào bình chứa HCl có vài giọt phenolphthalein; khi dung dịch chuyển sang màu hồng nhạt bền khoảng 30 giây thì dừng (điểm cuối chuẩn độ).'
        },
        { type: 'equation', text: 'HCl + NaOH → NaCl + H₂O' },
        {
          type: 'worked',
          problem: 'Chuẩn độ 10,0 mL dung dịch HCl chưa biết nồng độ cần vừa đủ 12,5 mL dung dịch NaOH 0,100 M. Tính nồng độ HCl.',
          steps: [
            'n(NaOH) = 0,0125 L × 0,100 M = 1,25 × 10⁻³ mol.',
            'Tỉ lệ 1 : 1 ⇒ n(HCl) = 1,25 × 10⁻³ mol.',
            'C(HCl) = 1,25 × 10⁻³ / 0,0100 = 0,125 M.'
          ],
          answer: 'C(HCl) = 0,125 M (với tỉ lệ 1 : 1: C_A·V_A = C_B·V_B).'
        }
      ]
    },
    {
      id: 'hydrolysis',
      kind: 'concept',
      title: 'Ion Al³⁺, Fe³⁺, CO₃²⁻ trong nước',
      blocks: [
        {
          type: 'p',
          text: 'Một số ion phản ứng với nước (sự thủy phân), làm dung dịch có tính acid hoặc base. Các phương trình dưới đây viết ở dạng thu gọn.'
        },
        { type: 'equation', text: 'Al³⁺ + 3H₂O ⇌ Al(OH)₃ + 3H⁺', note: 'Phèn chua (chứa Al³⁺) làm trong nước: Al(OH)₃ dạng keo kéo các hạt lơ lửng lắng xuống; dung dịch có tính acid.' },
        { type: 'equation', text: 'Fe³⁺ + 3H₂O ⇌ Fe(OH)₃ + 3H⁺', note: 'Muối Fe³⁺ cũng được dùng làm trong nước; dung dịch có tính acid.' },
        { type: 'equation', text: 'CO₃²⁻ + H₂O ⇌ HCO₃⁻ + OH⁻', note: 'Dung dịch soda (Na₂CO₃) có tính base, dùng tẩy rửa dầu mỡ.' }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: pH và chất chỉ thị',
      blocks: [
        {
          type: 'p',
          text: 'Trong phòng thí nghiệm ảo, thêm HCl rồi thêm dần NaOH, theo dõi giá trị pH và màu giấy quỳ tím ở môi trường acid, trung tính và base.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Cân bằng trong dung dịch nước',
          text: 'Mở trong Phòng thí nghiệm ảo; quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'guided', grade: 11, lessonId: 'g11-l2', experimentId: 'g11-lesson-02' }
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
          id: 'g11-l2-c1',
          question: 'Chất nào là chất điện li yếu?',
          options: [
            { id: 'a', text: 'NaCl' },
            { id: 'b', text: 'HNO₃' },
            { id: 'c', text: 'CH₃COOH' },
            { id: 'd', text: 'KOH' }
          ],
          correct: 'c',
          explanation: 'CH₃COOH chỉ phân li một phần; NaCl, HNO₃, KOH phân li hoàn toàn.'
        },
        {
          type: 'quiz',
          id: 'g11-l2-c2',
          question: 'Theo thuyết Brønsted – Lowry, trong phản ứng NH₃ + H₂O ⇌ NH₄⁺ + OH⁻, chất đóng vai trò acid là',
          options: [
            { id: 'a', text: 'NH₃' },
            { id: 'b', text: 'H₂O' },
            { id: 'c', text: 'NH₄⁺ ở chiều thuận' },
            { id: 'd', text: 'Không có acid' }
          ],
          correct: 'b',
          explanation: 'H₂O cho proton cho NH₃ nên là acid trong chiều thuận.'
        },
        {
          type: 'quiz',
          id: 'g11-l2-c3',
          question: 'Dung dịch có pH = 3 có [H⁺] bằng',
          options: [
            { id: 'a', text: '3 M' },
            { id: 'b', text: '10⁻³ M' },
            { id: 'c', text: '10³ M' },
            { id: 'd', text: '10⁻¹¹ M' }
          ],
          correct: 'b',
          explanation: '[H⁺] = 10⁻ᵖᴴ = 10⁻³ M. 10⁻¹¹ M là [OH⁻] của dung dịch đó.'
        },
        {
          type: 'quiz',
          id: 'g11-l2-c4',
          question: 'Nhỏ phenolphthalein vào dung dịch có pH = 12, dung dịch có màu',
          options: [
            { id: 'a', text: 'không màu' },
            { id: 'b', text: 'hồng' },
            { id: 'c', text: 'xanh' },
            { id: 'd', text: 'đỏ' }
          ],
          correct: 'b',
          explanation: 'Phenolphthalein chuyển hồng trong môi trường base (pH khoảng từ 8,3 trở lên).'
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
            'Chất điện li mạnh phân li hoàn toàn (→); chất điện li yếu phân li một phần (⇌).',
            'Brønsted – Lowry: acid cho H⁺, base nhận H⁺; H₂O, HCO₃⁻ lưỡng tính.',
            'pH = −lg[H⁺]; [H⁺][OH⁻] = 10⁻¹⁴ (25 °C); pH < 7 acid, = 7 trung tính, > 7 base.',
            'Chuẩn độ acid – base mạnh tỉ lệ 1 : 1: C_A·V_A = C_B·V_B.',
            'Al³⁺, Fe³⁺ làm dung dịch có tính acid; CO₃²⁻ làm dung dịch có tính base.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'pH của NaOH 0,001 M là 3.', right: '[OH⁻] = 10⁻³ ⇒ [H⁺] = 10⁻¹¹ ⇒ **pH = 11**.' },
            { wrong: 'Ba(OH)₂ 0,005 M có [OH⁻] = 0,005 M.', right: 'Mỗi Ba(OH)₂ cho **2 OH⁻**: [OH⁻] = 0,01 M.' },
            { wrong: 'Chất tan được trong nước đều là chất điện li.', right: 'Glucose, ethanol, saccharose tan nhưng **không điện li**.' },
            { wrong: 'Muối luôn có môi trường trung tính.', right: 'Dung dịch Na₂CO₃ có tính **base**; dung dịch muối Al³⁺, Fe³⁺ có tính **acid**.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Ôn tập chương 1**.'
        }
      ]
    }
  ]
}
