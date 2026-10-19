// Hóa học 11 · Chương 2 · Bài 8 — Sulfuric acid và muối sulfate.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l8',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Mô tả được cấu tạo, tính chất vật lí của sulfuric acid; nêu được cách bảo quản, sử dụng an toàn và sơ cứu khi bỏng acid.',
    'Trình bày được tính acid (dung dịch loãng), tính oxi hóa mạnh và tính háo nước (acid đặc) của sulfuric acid.',
    'Trình bày được quá trình sản xuất sulfuric acid theo phương pháp tiếp xúc; ứng dụng của sulfuric acid.',
    'Nêu được ứng dụng của một số muối sulfate quan trọng; nhận biết được ion sulfate.'
  ],
  prerequisites: [
    'Bài 7: Sulfur và sulfur dioxide.',
    'Hóa 10: phản ứng oxi hóa – khử, thăng bằng electron; enthalpy (pha loãng tỏa nhiệt).'
  ],
  sources: [
    programme('Sulfuric acid và muối sulfate'),
    textbook(11, 8)
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
          text: 'Nhỏ vài giọt sulfuric acid đặc lên đường kính trắng, chỉ sau ít phút đường hóa thành một khối than đen xốp bốc hơi nóng. Vì sao cùng là sulfuric acid mà dung dịch loãng chỉ làm quỳ hóa đỏ, còn acid đặc lại “đốt cháy” được đường và cả đồng?'
        },
        {
          type: 'list',
          items: [
            'Biết tính chất vật lí và cách pha loãng, sử dụng an toàn H₂SO₄.',
            'Phân biệt tính chất của H₂SO₄ loãng và H₂SO₄ đặc.',
            'Mô tả quá trình sản xuất H₂SO₄ bằng phương pháp tiếp xúc.',
            'Nhận biết ion sulfate và biết ứng dụng của muối sulfate.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Trong H₂SO₄, S có số oxi hóa +6 (cao nhất).', 'Phản ứng oxi hóa – khử: chất oxi hóa nhận electron.'] }
      ]
    },
    {
      id: 'physical',
      kind: 'concept',
      title: 'Tính chất vật lí và an toàn',
      blocks: [
        {
          type: 'list',
          items: [
            'H₂SO₄ là chất lỏng sánh như dầu, không màu, không bay hơi, nặng gần gấp đôi nước (dung dịch 98% có khối lượng riêng khoảng 1,84 g/cm³).',
            'Tan vô hạn trong nước và **tỏa rất nhiều nhiệt**.'
          ]
        },
        {
          type: 'callout',
          title: 'Quy tắc pha loãng',
          text: '**Rót từ từ acid vào nước**, khuấy đều; tuyệt đối không làm ngược lại vì nước nhẹ hơn, nổi trên acid và sôi tức thì, làm acid bắn ra ngoài.'
        },
        {
          type: 'list',
          items: [
            'Bảo quản trong chai lọ có nút kín, để nơi thoáng mát, xa chất dễ cháy và base.',
            'Khi dùng phải đeo kính, găng tay, áo bảo hộ.',
            'Sơ cứu khi bị bỏng acid: rửa ngay với thật nhiều nước sạch, sau đó có thể rửa bằng dung dịch NaHCO₃ loãng và đến cơ sở y tế.'
          ]
        }
      ]
    },
    {
      id: 'dilute',
      kind: 'concept',
      title: 'Dung dịch H₂SO₄ loãng: tính acid mạnh',
      blocks: [
        { type: 'equation', text: 'H₂SO₄ → 2H⁺ + SO₄²⁻', note: 'Viết gọn: H₂SO₄ là acid mạnh hai nấc.', check: true },
        { type: 'equation', text: 'Fe + H₂SO₄ → FeSO₄ + H₂', note: 'Với kim loại đứng trước H: sắt chỉ lên +2.' },
        { type: 'equation', text: 'CuO + H₂SO₄ → CuSO₄ + H₂O' },
        { type: 'equation', text: '2NaOH + H₂SO₄ → Na₂SO₄ + 2H₂O' },
        { type: 'equation', text: 'Na₂CO₃ + H₂SO₄ → Na₂SO₄ + CO₂ + H₂O' }
      ]
    },
    {
      id: 'concentrated',
      kind: 'concept',
      title: 'H₂SO₄ đặc: tính oxi hóa mạnh và tính háo nước',
      blocks: [
        { type: 'heading', text: 'Tính oxi hóa mạnh (S⁺⁶ bị khử, thường tạo SO₂)' },
        { type: 'equation', text: 'Cu + 2H₂SO₄ → CuSO₄ + SO₂ + 2H₂O', condition: 't°, H₂SO₄ đặc', note: 'Oxi hóa cả kim loại đứng sau H.' },
        { type: 'equation', text: '2Fe + 6H₂SO₄ → Fe₂(SO₄)₃ + 3SO₂ + 6H₂O', condition: 't°, H₂SO₄ đặc', note: 'Sắt lên +3.' },
        { type: 'equation', text: 'C + 2H₂SO₄ → CO₂ + 2SO₂ + 2H₂O', condition: 't°, H₂SO₄ đặc' },
        {
          type: 'p',
          text: 'Fe, Al, Cr bị thụ động trong H₂SO₄ đặc, nguội, nên có thể chứa acid đặc trong thùng thép.'
        },
        { type: 'heading', text: 'Tính háo nước' },
        { type: 'equation', text: 'C₁₂H₂₂O₁₁ → 12C + 11H₂O', condition: 'H₂SO₄ đặc', note: 'H₂SO₄ đặc lấy nước của đường, để lại carbon; một phần carbon tiếp tục bị oxi hóa tạo CO₂, SO₂ làm khối than phồng lên.' },
        {
          type: 'p',
          text: 'Vì tính háo nước, H₂SO₄ đặc gây bỏng rất nặng khi dính vào da và được dùng làm chất làm khô một số khí.'
        }
      ]
    },
    {
      id: 'production',
      kind: 'concept',
      title: 'Sản xuất sulfuric acid (phương pháp tiếp xúc)',
      blocks: [
        { type: 'heading', text: 'Giai đoạn 1: tạo SO₂ từ sulfur hoặc quặng pyrite' },
        { type: 'equation', text: 'S + O₂ → SO₂', condition: 't°' },
        { type: 'equation', text: '4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂', condition: 't°' },
        { type: 'heading', text: 'Giai đoạn 2: oxi hóa SO₂ thành SO₃' },
        { type: 'equation', text: '2SO₂ + O₂ ⇌ 2SO₃', condition: 'V₂O₅, 450 – 500 °C' },
        { type: 'heading', text: 'Giai đoạn 3: hấp thụ SO₃ bằng H₂SO₄ đặc' },
        { type: 'equation', text: 'H₂SO₄ + nSO₃ → H₂SO₄·nSO₃', note: 'Tạo oleum, sau đó pha loãng oleum bằng lượng nước thích hợp để được H₂SO₄ có nồng độ mong muốn.', check: false },
        {
          type: 'p',
          text: 'Không hấp thụ SO₃ trực tiếp bằng nước vì phản ứng tỏa nhiều nhiệt, tạo sương mù acid khó thu gom.'
        }
      ]
    },
    {
      id: 'sulfates',
      kind: 'concept',
      title: 'Muối sulfate và nhận biết ion sulfate',
      blocks: [
        {
          type: 'table',
          caption: 'Một số muối sulfate quan trọng',
          head: ['Muối', 'Ứng dụng'],
          rows: [
            ['BaSO₄', 'Rất ít tan, không độc khi uống: chất cản quang khi chụp X-quang dạ dày'],
            ['CaSO₄·2H₂O (thạch cao)', 'Sản xuất xi măng, bó bột, làm khuôn đúc, tượng'],
            ['(NH₄)₂SO₄', 'Phân đạm'],
            ['MgSO₄', 'Dùng trong y tế, phân bón bổ sung magnesium'],
            ['CuSO₄', 'Thuốc diệt nấm cho cây trồng; nhận biết nước (CuSO₄ khan trắng hóa xanh)']
          ]
        },
        { type: 'equation', text: 'BaCl₂ + Na₂SO₄ → BaSO₄ + 2NaCl', note: 'Kết tủa trắng BaSO₄, không tan trong acid: dùng ion Ba²⁺ nhận biết ion SO₄²⁻.' },
        { type: 'equation', text: 'Ba²⁺ + SO₄²⁻ → BaSO₄' }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Loãng hay đặc cho kết quả khác nhau',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho 5,6 g Fe tác dụng hết với (a) dung dịch H₂SO₄ loãng dư; (b) H₂SO₄ đặc, nóng, dư. Tính thể tích khí ở điều kiện chuẩn (24,79 L/mol) trong mỗi trường hợp (Fe = 56).',
          steps: [
            'n(Fe) = 0,1 mol.',
            '(a) Fe + H₂SO₄ → FeSO₄ + H₂ ⇒ n(H₂) = 0,1 mol ⇒ V = 2,479 L.',
            '(b) Fe lên +3: Fe → Fe³⁺ + 3e ⇒ 0,3 mol e. S⁺⁶ + 2e → S⁺⁴ (SO₂) ⇒ n(SO₂) = 0,15 mol.',
            'V(SO₂) = 0,15 × 24,79 ≈ 3,72 L.'
          ],
          answer: '(a) 2,479 L H₂; (b) khoảng 3,72 L SO₂. Cùng lượng sắt nhưng sản phẩm và lượng khí khác nhau.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: nhận biết ion sulfate',
      blocks: [
        {
          type: 'p',
          text: 'Trong phòng thí nghiệm ảo, nhỏ dung dịch BaCl₂ vào dung dịch Na₂SO₄ và quan sát kết tủa trắng.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Sulfuric acid và sulfate',
          text: 'Mở trong Phòng thí nghiệm ảo; quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'guided', grade: 11, lessonId: 'g11-l8', experimentId: 'g11-lesson-08' }
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
          id: 'g11-l8-c1',
          question: 'Cách pha loãng H₂SO₄ đặc đúng là',
          options: [
            { id: 'a', text: 'rót nhanh nước vào acid' },
            { id: 'b', text: 'rót từ từ acid vào nước và khuấy đều' },
            { id: 'c', text: 'đổ đồng thời acid và nước vào cốc' },
            { id: 'd', text: 'đun nóng acid rồi thêm nước' }
          ],
          correct: 'b',
          explanation: 'Pha loãng tỏa nhiều nhiệt; rót acid vào nước giúp nhiệt phân tán vào khối nước lớn.'
        },
        {
          type: 'quiz',
          id: 'g11-l8-c2',
          question: 'Kim loại nào tác dụng với H₂SO₄ đặc, nóng nhưng không tác dụng với H₂SO₄ loãng?',
          options: [
            { id: 'a', text: 'Zn' },
            { id: 'b', text: 'Cu' },
            { id: 'c', text: 'Mg' },
            { id: 'd', text: 'Fe' }
          ],
          correct: 'b',
          explanation: 'Cu đứng sau H nên không tác dụng với H⁺ của acid loãng, nhưng bị S⁺⁶ của acid đặc oxi hóa.'
        },
        {
          type: 'quiz',
          id: 'g11-l8-c3',
          question: 'Thuốc thử dùng nhận biết ion SO₄²⁻ là dung dịch chứa ion',
          options: [
            { id: 'a', text: 'Ag⁺' },
            { id: 'b', text: 'Ba²⁺' },
            { id: 'c', text: 'Na⁺' },
            { id: 'd', text: 'H⁺' }
          ],
          correct: 'b',
          explanation: 'Ba²⁺ + SO₄²⁻ → BaSO₄ (kết tủa trắng, không tan trong acid).'
        },
        {
          type: 'quiz',
          id: 'g11-l8-c4',
          question: 'Đường kính hóa đen khi gặp H₂SO₄ đặc là do',
          options: [
            { id: 'a', text: 'tính acid' },
            { id: 'b', text: 'tính háo nước' },
            { id: 'c', text: 'tính base' },
            { id: 'd', text: 'H₂SO₄ bay hơi' }
          ],
          correct: 'b',
          explanation: 'H₂SO₄ đặc lấy các nguyên tố H và O của đường dưới dạng nước, để lại carbon.'
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
            'H₂SO₄ loãng: acid mạnh, tác dụng với kim loại trước H tạo H₂, với oxide base, base, muối.',
            'H₂SO₄ đặc: oxi hóa mạnh (tạo SO₂ với nhiều kim loại, C, S), háo nước; Fe, Al, Cr thụ động khi nguội.',
            'Sản xuất: S/FeS₂ → SO₂ → SO₃ (V₂O₅) → oleum → H₂SO₄.',
            'Nhận biết SO₄²⁻ bằng Ba²⁺ (BaSO₄ trắng).'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Fe + H₂SO₄ đặc, nóng → FeSO₄ + H₂.', right: 'Acid đặc, nóng oxi hóa Fe lên +3 và **không tạo H₂**: tạo Fe₂(SO₄)₃, SO₂.' },
            { wrong: 'Pha loãng bằng cách rót nước vào acid đặc.', right: '**Rót acid vào nước**, từ từ, khuấy đều.' },
            { wrong: 'Hấp thụ SO₃ bằng nước để tạo H₂SO₄ trong công nghiệp.', right: 'Dùng **H₂SO₄ đặc** hấp thụ SO₃ tạo oleum, tránh tạo sương mù acid.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Ôn tập chương 2**.'
        }
      ]
    }
  ]
}
