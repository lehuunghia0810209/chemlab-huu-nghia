// Hóa học 12 · Chương 8 · Bài 27 — Đại cương về kim loại chuyển tiếp dãy thứ nhất.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l27',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được đặc điểm cấu hình electron của nguyên tử kim loại chuyển tiếp dãy thứ nhất (từ Sc đến Cu).',
    'Nêu được một số tính chất vật lí chung (độ cứng, khối lượng riêng, nhiệt độ nóng chảy) của kim loại chuyển tiếp dãy thứ nhất.',
    'Nêu được các số oxi hóa phổ biến và màu sắc của một số ion kim loại chuyển tiếp trong dung dịch.',
    'Trình bày được cách nhận biết một số ion kim loại chuyển tiếp (Fe²⁺, Fe³⁺, Cu²⁺) bằng dung dịch kiềm; xác định nồng độ Fe²⁺ bằng chuẩn độ với KMnO₄.'
  ],
  prerequisites: [
    'Hóa 10: cấu hình electron, phân lớp d.',
    'Hóa 10: cân bằng phản ứng oxi hóa – khử; chuẩn độ.'
  ],
  sources: [
    programme('Kim loại chuyển tiếp dãy thứ nhất và phức chất'),
    textbook(12, 27)
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
          text: 'Dung dịch CuSO₄ màu xanh, dung dịch KMnO₄ màu tím, dung dịch K₂Cr₂O₇ màu da cam. Vì sao hợp chất của kim loại chuyển tiếp thường có màu, còn hợp chất của Na, Mg thì không?'
        },
        {
          type: 'list',
          items: [
            'Viết cấu hình electron của kim loại chuyển tiếp dãy thứ nhất.',
            'Nêu tính chất vật lí chung và số oxi hóa đa dạng.',
            'Nhận biết màu của một số ion; nhận biết Fe²⁺, Fe³⁺, Cu²⁺ bằng dung dịch kiềm.',
            'Xác định nồng độ Fe²⁺ bằng chuẩn độ với KMnO₄.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Thứ tự điền electron: … 3p, 4s, 3d.', 'Trong chuẩn độ, tại điểm tương đương các chất phản ứng vừa đủ theo hệ số.'] }
      ]
    },
    {
      id: 'electron',
      kind: 'concept',
      title: 'Cấu hình electron',
      blocks: [
        {
          type: 'p',
          text: 'Kim loại chuyển tiếp dãy thứ nhất gồm các nguyên tố từ **Sc (Z = 21) đến Cu (Z = 29)**, thuộc chu kì 4. Electron cuối cùng điền vào phân lớp **3d**; cấu hình chung [Ar]3dˣ4sʸ.'
        },
        {
          type: 'table',
          caption: 'Cấu hình electron một số nguyên tố',
          head: ['Nguyên tố', 'Z', 'Cấu hình electron'],
          rows: [
            ['Sc', '21', '[Ar]3d¹4s²'],
            ['Cr', '24', '[Ar]3d⁵4s¹ (bán bão hòa bền)'],
            ['Mn', '25', '[Ar]3d⁵4s²'],
            ['Fe', '26', '[Ar]3d⁶4s²'],
            ['Cu', '29', '[Ar]3d¹⁰4s¹ (bão hòa bền)']
          ]
        },
        {
          type: 'p',
          text: 'Khi tạo ion, nguyên tử nhường electron 4s trước rồi đến 3d. Ví dụ Fe²⁺: [Ar]3d⁶; Fe³⁺: [Ar]3d⁵.'
        }
      ]
    },
    {
      id: 'properties',
      kind: 'concept',
      title: 'Tính chất vật lí và số oxi hóa',
      blocks: [
        {
          type: 'list',
          items: [
            'So với kim loại nhóm IA, IIA, kim loại chuyển tiếp dãy thứ nhất thường **cứng hơn**, có **khối lượng riêng lớn hơn** và **nhiệt độ nóng chảy cao hơn** (do cả electron 3d tham gia liên kết kim loại).',
            'Có nhiều số oxi hóa vì cả electron 4s và 3d đều có thể tham gia liên kết.'
          ]
        },
        {
          type: 'table',
          caption: 'Số oxi hóa phổ biến và màu ion trong dung dịch',
          head: ['Nguyên tố', 'Số oxi hóa phổ biến', 'Ion và màu'],
          rows: [
            ['Cr', '+2, +3, +6', 'Cr³⁺ xanh lục; CrO₄²⁻ vàng; Cr₂O₇²⁻ da cam'],
            ['Mn', '+2, +4, +7', 'Mn²⁺ hồng nhạt (gần như không màu); MnO₄⁻ tím'],
            ['Fe', '+2, +3', 'Fe²⁺ lục nhạt; Fe³⁺ vàng nâu'],
            ['Cu', '+1, +2', 'Cu²⁺ xanh']
          ]
        }
      ]
    },
    {
      id: 'identify',
      kind: 'concept',
      title: 'Nhận biết ion và chuẩn độ Fe²⁺',
      blocks: [
        { type: 'heading', text: 'Nhận biết bằng dung dịch kiềm' },
        { type: 'equation', text: 'Fe²⁺ + 2OH⁻ → Fe(OH)₂', note: 'Kết tủa trắng xanh, để ngoài không khí chuyển dần thành nâu đỏ.' },
        { type: 'equation', text: 'Fe³⁺ + 3OH⁻ → Fe(OH)₃', note: 'Kết tủa nâu đỏ.' },
        { type: 'equation', text: 'Cu²⁺ + 2OH⁻ → Cu(OH)₂', note: 'Kết tủa xanh.' },
        { type: 'heading', text: 'Chuẩn độ Fe²⁺ bằng KMnO₄ (môi trường H₂SO₄)' },
        { type: 'equation', text: '5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O', note: 'Điểm tương đương: dung dịch bắt đầu có màu hồng nhạt bền của MnO₄⁻ dư; KMnO₄ vừa là chất phản ứng vừa là chất chỉ thị.' }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Chuẩn độ Fe²⁺',
      blocks: [
        {
          type: 'worked',
          problem: 'Chuẩn độ 20,0 mL dung dịch FeSO₄ (môi trường H₂SO₄) cần vừa đủ 10,0 mL dung dịch KMnO₄ 0,02 M. Tính nồng độ mol của FeSO₄.',
          steps: [
            'n(MnO₄⁻) = 0,010 × 0,02 = 2,0 × 10⁻⁴ mol.',
            'Theo phương trình: n(Fe²⁺) = 5 × n(MnO₄⁻) = 1,0 × 10⁻³ mol.',
            'C(FeSO₄) = 1,0 × 10⁻³ / 0,020 = 0,05 M.'
          ],
          answer: 'Nồng độ FeSO₄ là 0,05 M.'
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
          id: 'g12-l27-c1',
          question: 'Cấu hình electron của Cr (Z = 24) là',
          options: [
            { id: 'a', text: '[Ar]3d⁴4s²' },
            { id: 'b', text: '[Ar]3d⁵4s¹' },
            { id: 'c', text: '[Ar]3d⁶' },
            { id: 'd', text: '[Ar]4s²4p⁴' }
          ],
          correct: 'b',
          explanation: 'Phân lớp 3d bán bão hòa (3d⁵) bền hơn.'
        },
        {
          type: 'quiz',
          id: 'g12-l27-c2',
          question: 'Cho dung dịch NaOH vào dung dịch FeCl₃ thấy',
          options: [
            { id: 'a', text: 'kết tủa trắng xanh' },
            { id: 'b', text: 'kết tủa nâu đỏ' },
            { id: 'c', text: 'kết tủa xanh' },
            { id: 'd', text: 'không hiện tượng' }
          ],
          correct: 'b',
          explanation: 'Tạo Fe(OH)₃ nâu đỏ.'
        },
        {
          type: 'quiz',
          id: 'g12-l27-c3',
          question: 'Trong chuẩn độ Fe²⁺ bằng KMnO₄, tỉ lệ mol Fe²⁺ : MnO₄⁻ là',
          options: [
            { id: 'a', text: '1 : 1' },
            { id: 'b', text: '5 : 1' },
            { id: 'c', text: '1 : 5' },
            { id: 'd', text: '2 : 1' }
          ],
          correct: 'b',
          explanation: 'Mn⁺⁷ nhận 5e; mỗi Fe²⁺ nhường 1e.'
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
            'Kim loại chuyển tiếp dãy thứ nhất: Sc → Cu, electron cuối điền vào 3d; Cr 3d⁵4s¹, Cu 3d¹⁰4s¹.',
            'Cứng, khối lượng riêng lớn, nhiệt độ nóng chảy cao; nhiều số oxi hóa; ion thường có màu.',
            'Nhận biết: Fe(OH)₂ trắng xanh, Fe(OH)₃ nâu đỏ, Cu(OH)₂ xanh.',
            'Chuẩn độ: n(Fe²⁺) = 5n(MnO₄⁻).'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Fe tạo ion Fe²⁺ bằng cách mất 2 electron 3d.', right: 'Nguyên tử nhường **electron 4s trước**: Fe²⁺ là [Ar]3d⁶.' },
            { wrong: 'Cấu hình của Cu là [Ar]3d⁹4s².', right: 'Cu có cấu hình **[Ar]3d¹⁰4s¹** (phân lớp 3d bão hòa bền hơn).' },
            { wrong: 'Trong chuẩn độ với KMnO₄, n(Fe²⁺) = n(MnO₄⁻).', right: 'Theo bảo toàn electron: **n(Fe²⁺) = 5n(MnO₄⁻)**.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Sơ lược về phức chất**.'
        }
      ]
    }
  ]
}
