// Hóa học 11 · Chương 2 · Bài 9 — Ôn tập chương 2 (Nitrogen và sulfur).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l9',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa tính chất của nitrogen, ammonia, muối ammonium, nitric acid, sulfur, sulfur dioxide, sulfuric acid và muối sulfate.',
    'Vận dụng để nhận biết chất, viết chuỗi phản ứng và giải bài tập định lượng; liên hệ vấn đề môi trường (mưa acid, phú dưỡng).'
  ],
  prerequisites: ['Bài 4 – 8 của chương 2.'],
  sources: [
    programme('Nitrogen và sulfur'),
    textbook(11, 9)
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
          text: 'Nitrogen và sulfur đều tạo ra những acid mạnh nhất trong công nghiệp hóa chất, đều góp phần gây mưa acid, và đều là nguyên tố dinh dưỡng của cây trồng. Em có thể so sánh hai “gia đình” hợp chất này một cách có hệ thống không?'
        },
        {
          type: 'list',
          items: [
            'So sánh các hợp chất của nitrogen và sulfur theo số oxi hóa.',
            'Luyện nhận biết các khí, ion của chương.',
            'Giải bài tập chuỗi phản ứng và bảo toàn electron.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 2',
      blocks: [
        {
          type: 'table',
          caption: 'Các chất theo số oxi hóa',
          head: ['Số oxi hóa', 'Nitrogen', 'Sulfur', 'Tính chất'],
          rows: [
            ['Thấp nhất', 'NH₃, NH₄⁺ (−3)', 'H₂S (−2)', 'Chỉ có tính khử'],
            ['Trung gian', 'N₂ (0), NO (+2), NO₂ (+4)', 'S (0), SO₂ (+4)', 'Vừa oxi hóa vừa khử'],
            ['Cao nhất', 'HNO₃, NO₃⁻ (+5)', 'H₂SO₄, SO₄²⁻ (+6)', 'Chỉ có tính oxi hóa (acid đặc)']
          ]
        },
        {
          type: 'table',
          caption: 'Nhận biết',
          head: ['Chất / ion', 'Thuốc thử', 'Hiện tượng'],
          rows: [
            ['NH₄⁺', 'Dung dịch kiềm, đun nóng', 'Khí mùi khai làm quỳ ẩm hóa xanh'],
            ['NH₃', 'Khí HCl', 'Khói trắng NH₄Cl'],
            ['SO₂', 'Nước bromine', 'Mất màu vàng nâu'],
            ['SO₄²⁻', 'Dung dịch BaCl₂', 'Kết tủa trắng BaSO₄'],
            ['NO₂', 'Quan sát', 'Khí màu nâu đỏ']
          ]
        }
      ]
    },
    {
      id: 'example-chain',
      kind: 'example',
      title: 'Ví dụ 1 — Chuỗi phản ứng sản xuất acid',
      blocks: [
        {
          type: 'worked',
          problem: 'Viết phương trình theo hai chuỗi: (a) N₂ → NH₃ → NO → NO₂ → HNO₃; (b) S → SO₂ → SO₃ → H₂SO₄ → BaSO₄.',
          steps: [
            '(a) N₂ + 3H₂ ⇌ 2NH₃ (Fe, t°, p); 4NH₃ + 5O₂ → 4NO + 6H₂O (Pt); 2NO + O₂ → 2NO₂; 4NO₂ + O₂ + 2H₂O → 4HNO₃.',
            '(b) S + O₂ → SO₂; 2SO₂ + O₂ ⇌ 2SO₃ (V₂O₅); SO₃ + H₂O → H₂SO₄ (trong công nghiệp hấp thụ bằng H₂SO₄ đặc); H₂SO₄ + BaCl₂ → BaSO₄ + 2HCl.'
          ],
          answer: 'Hai quy trình đều oxi hóa dần nguyên tố lên số oxi hóa cao nhất rồi hợp nước tạo acid.',
          equations: [
            'N₂ + 3H₂ ⇌ 2NH₃', '4NH₃ + 5O₂ → 4NO + 6H₂O', '2NO + O₂ → 2NO₂', '4NO₂ + O₂ + 2H₂O → 4HNO₃',
            'S + O₂ → SO₂', '2SO₂ + O₂ ⇌ 2SO₃', 'SO₃ + H₂O → H₂SO₄', 'H₂SO₄ + BaCl₂ → BaSO₄ + 2HCl'
          ]
        }
      ]
    },
    {
      id: 'example-electron',
      kind: 'example',
      title: 'Ví dụ 2 — Bảo toàn electron với hỗn hợp kim loại',
      blocks: [
        {
          type: 'worked',
          problem: 'Hòa tan hoàn toàn hỗn hợp gồm 0,1 mol Cu và 0,1 mol Mg trong H₂SO₄ đặc, nóng, dư. Tính thể tích SO₂ (sản phẩm khử duy nhất) ở điều kiện chuẩn (24,79 L/mol).',
          steps: [
            'Cu → Cu²⁺ + 2e; Mg → Mg²⁺ + 2e ⇒ tổng electron nhường = 0,1 × 2 + 0,1 × 2 = 0,4 mol.',
            'S⁺⁶ + 2e → S⁺⁴ ⇒ n(SO₂) = 0,4 / 2 = 0,2 mol.',
            'V(SO₂) = 0,2 × 24,79 = 4,958 L.'
          ],
          answer: 'V(SO₂) ≈ 4,96 L.'
        }
      ]
    },
    {
      id: 'example-environment',
      kind: 'example',
      title: 'Ví dụ 3 — Vấn đề môi trường',
      blocks: [
        {
          type: 'worked',
          problem: 'Một nhà máy nhiệt điện đốt 100 tấn than chứa 1,6% sulfur về khối lượng. (a) Tính khối lượng SO₂ tạo ra (giả sử toàn bộ sulfur chuyển thành SO₂). (b) Nêu một biện pháp giảm phát thải.',
          steps: [
            'Khối lượng sulfur: 100 × 1,6% = 1,6 tấn.',
            'S + O₂ → SO₂: 32 tấn S tạo 64 tấn SO₂ ⇒ 1,6 tấn S tạo 3,2 tấn SO₂.',
            'Biện pháp: hấp thụ SO₂ trong khí thải bằng sữa vôi: SO₂ + Ca(OH)₂ → CaSO₃ + H₂O; hoặc dùng than ít sulfur.'
          ],
          answer: '(a) 3,2 tấn SO₂. (b) Khử SO₂ trong khí thải bằng sữa vôi, dùng nhiên liệu ít sulfur hoặc năng lượng tái tạo.',
          equations: ['S + O₂ → SO₂', 'SO₂ + Ca(OH)₂ → CaSO₃ + H₂O']
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
          id: 'g11-l9-c1',
          question: 'Chất nào chỉ có tính khử (xét nguyên tố N hoặc S)?',
          options: [
            { id: 'a', text: 'SO₂' },
            { id: 'b', text: 'NH₃' },
            { id: 'c', text: 'HNO₃' },
            { id: 'd', text: 'S' }
          ],
          correct: 'b',
          explanation: 'N trong NH₃ có số oxi hóa thấp nhất −3 nên chỉ có thể tăng.'
        },
        {
          type: 'quiz',
          id: 'g11-l9-c2',
          question: 'Để phân biệt hai dung dịch (NH₄)₂SO₄ và NH₄Cl, dùng',
          options: [
            { id: 'a', text: 'dung dịch NaOH' },
            { id: 'b', text: 'dung dịch BaCl₂' },
            { id: 'c', text: 'quỳ tím' },
            { id: 'd', text: 'dung dịch HCl' }
          ],
          correct: 'b',
          explanation: 'Chỉ (NH₄)₂SO₄ tạo kết tủa trắng BaSO₄ với BaCl₂; NaOH cho khí NH₃ với cả hai.'
        },
        {
          type: 'quiz',
          id: 'g11-l9-c3',
          question: 'Khí nào sau đây không gây mưa acid?',
          options: [
            { id: 'a', text: 'SO₂' },
            { id: 'b', text: 'NO₂' },
            { id: 'c', text: 'N₂' },
            { id: 'd', text: 'NO' }
          ],
          correct: 'c',
          explanation: 'N₂ rất trơ ở điều kiện thường; mưa acid do SO₂ và NOₓ.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 2',
      blocks: [
        {
          type: 'list',
          items: [
            'Xếp chất theo số oxi hóa để suy ra tính oxi hóa, tính khử.',
            'HNO₃ và H₂SO₄ đặc đều oxi hóa được Cu và làm Fe, Al thụ động khi nguội.',
            'Nhận biết: NH₄⁺ (kiềm, quỳ ẩm), SO₄²⁻ (Ba²⁺), SO₂ (nước bromine).',
            'Bảo toàn electron: Σ e kim loại nhường = Σ e N⁺⁵ hoặc S⁺⁶ nhận.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Dùng NaOH để phân biệt (NH₄)₂SO₄ và NH₄Cl.', right: 'Cả hai đều có NH₄⁺; phải nhận biết **anion** bằng BaCl₂.' },
            { wrong: 'Tính số mol SO₂ bằng tổng số mol kim loại.', right: 'Dùng **bảo toàn electron**: n(SO₂) = Σ(e nhường) / 2.' },
            { wrong: 'N₂ gây mưa acid vì là thành phần chính của không khí.', right: 'N₂ trơ; chỉ **NOₓ** (tạo ở nhiệt độ cao) gây mưa acid.' }
          ]
        },
        {
          type: 'p',
          text: 'Chương tiếp theo: **Đại cương về hóa học hữu cơ**.'
        }
      ]
    }
  ]
}
