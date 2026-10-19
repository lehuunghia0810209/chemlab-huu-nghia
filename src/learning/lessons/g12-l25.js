// Hóa học 12 · Chương 7 · Bài 25 — Nguyên tố nhóm IIA.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l25',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được trạng thái tự nhiên, cấu hình electron lớp ngoài cùng và tính chất vật lí của các kim loại nhóm IIA.',
    'Trình bày được tính khử của kim loại nhóm IIA (tác dụng với nước); màu ngọn lửa của Ca, Sr, Ba.',
    'Trình bày được xu hướng độ tan của muối sulfate, hydroxide; sự nhiệt phân muối carbonate; ứng dụng của một số hợp chất calcium.',
    'Nêu được khái niệm nước cứng, phân loại và các phương pháp làm mềm nước cứng.'
  ],
  prerequisites: [
    'Bài 24: kim loại nhóm IA.',
    'Hóa 11: phản ứng trao đổi ion trong dung dịch.'
  ],
  sources: [
    programme('Nguyên tố nhóm IA và nhóm IIA'),
    textbook(12, 25)
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
          text: 'Ấm đun nước lâu ngày đóng lớp cặn trắng; hang động đá vôi có những nhũ đá kì ảo; bác sĩ bó bột thạch cao khi gãy xương. Tất cả đều liên quan đến các hợp chất của calcium. Chúng biến đổi như thế nào?'
        },
        {
          type: 'list',
          items: [
            'Nêu cấu hình electron, tính chất của kim loại nhóm IIA.',
            'So sánh độ tan của muối sulfate và hydroxide trong nhóm.',
            'Viết phản ứng nhiệt phân CaCO₃ và phản ứng tạo hang động, thạch nhũ.',
            'Phân loại nước cứng và đề xuất cách làm mềm.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Kim loại nhóm IA có tính khử rất mạnh.', 'Phản ứng trao đổi ion xảy ra khi tạo kết tủa, khí hoặc chất điện li yếu.'] }
      ]
    },
    {
      id: 'overview',
      kind: 'concept',
      title: 'Đặc điểm chung và tính chất',
      blocks: [
        {
          type: 'list',
          items: [
            'Nhóm IIA gồm Be, Mg, Ca, Sr, Ba, Ra (Ra là nguyên tố phóng xạ). Cấu hình electron lớp ngoài cùng **ns²**; trong hợp chất có số oxi hóa **+2**.',
            'Trong tự nhiên tồn tại ở dạng hợp chất: CaCO₃ (đá vôi, đá phấn), CaSO₄·2H₂O (thạch cao), MgCO₃, CaCO₃·MgCO₃ (dolomite).',
            'Kim loại nhóm IIA có tính khử mạnh (kém kim loại kiềm cùng chu kì), tăng dần từ Be đến Ba.'
          ]
        },
        { type: 'equation', text: 'Ca + 2H₂O → Ca(OH)₂ + H₂', note: 'Ca, Sr, Ba tác dụng với nước ở nhiệt độ thường; Mg phản ứng chậm với nước nóng; Be không tác dụng với nước.' },
        {
          type: 'p',
          text: 'Màu ngọn lửa: **Ca đỏ cam, Sr đỏ son, Ba lục (vàng lục)**; được dùng trong pháo hoa.'
        }
      ]
    },
    {
      id: 'compounds',
      kind: 'concept',
      title: 'Hợp chất của kim loại nhóm IIA',
      blocks: [
        {
          type: 'table',
          caption: 'Xu hướng độ tan trong nước (từ Mg đến Ba)',
          head: ['Hợp chất', 'Xu hướng', 'Ví dụ'],
          rows: [
            ['Muối sulfate', 'Độ tan giảm dần', 'MgSO₄ tan tốt; CaSO₄ ít tan; BaSO₄ hầu như không tan'],
            ['Hydroxide', 'Độ tan tăng dần', 'Mg(OH)₂ không tan; Ca(OH)₂ ít tan; Ba(OH)₂ tan tốt']
          ]
        },
        { type: 'equation', text: 'CaCO₃ → CaO + CO₂', condition: 't°', note: 'Nung đá vôi sản xuất vôi sống; nhiệt độ phân hủy của muối carbonate tăng dần từ Mg đến Ba.' },
        { type: 'equation', text: 'CaCO₃ + CO₂ + H₂O ⇌ Ca(HCO₃)₂', note: 'Chiều thuận: nước mưa có CO₂ hòa tan đá vôi tạo hang động; chiều nghịch: tạo thạch nhũ, cặn trong ấm.' },
        {
          type: 'list',
          items: [
            'Thạch cao sống CaSO₄·2H₂O; thạch cao nung CaSO₄·H₂O (hoặc CaSO₄·0,5H₂O) dùng bó bột, đúc tượng; thạch cao khan CaSO₄.',
            'Ca(OH)₂ (vôi tôi) dùng trong xây dựng, khử chua đất; BaSO₄ dùng làm chất cản quang trong chụp X-quang.'
          ]
        }
      ]
    },
    {
      id: 'hard-water',
      kind: 'concept',
      title: 'Nước cứng',
      blocks: [
        {
          type: 'callout',
          title: 'Nước cứng',
          text: 'Là nước chứa nhiều ion **Ca²⁺ và Mg²⁺**. Nước chứa ít hoặc không chứa các ion này là nước mềm.'
        },
        {
          type: 'table',
          caption: 'Phân loại và cách làm mềm',
          head: ['Loại', 'Anion đi kèm', 'Cách làm mềm'],
          rows: [
            ['Tạm thời', 'HCO₃⁻', 'Đun sôi; dùng Ca(OH)₂ vừa đủ; Na₂CO₃; Na₃PO₄'],
            ['Vĩnh cửu', 'Cl⁻, SO₄²⁻', 'Na₂CO₃, Na₃PO₄; trao đổi ion'],
            ['Toàn phần', 'Cả hai loại trên', 'Na₂CO₃, Na₃PO₄; trao đổi ion']
          ]
        },
        { type: 'equation', text: 'Ca(HCO₃)₂ → CaCO₃ + CO₂ + H₂O', condition: 't°', note: 'Đun sôi làm mềm nước cứng tạm thời.' },
        { type: 'equation', text: 'Ca²⁺ + CO₃²⁻ → CaCO₃', note: 'Na₂CO₃ làm mềm cả nước cứng vĩnh cửu.' },
        {
          type: 'p',
          text: 'Tác hại: nước cứng làm giảm tác dụng giặt rửa của xà phòng, tạo cặn trong nồi hơi, ấm, đường ống, làm thực phẩm lâu chín.'
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Nung đá vôi và làm mềm nước',
      blocks: [
        {
          type: 'worked',
          problem: '(a) Nung 50 kg đá vôi chứa 100% CaCO₃ với hiệu suất 80%. Tính khối lượng CaO thu được. (b) Một mẫu nước chứa 0,01 mol Ca²⁺. Tính khối lượng Na₂CO₃ tối thiểu để loại hết Ca²⁺ (Ca = 40, C = 12, O = 16, Na = 23).',
          steps: [
            '(a) n(CaCO₃) = 50 / 100 = 0,5 kmol ⇒ n(CaO) = 0,5 × 80% = 0,4 kmol ⇒ m = 0,4 × 56 = 22,4 kg.',
            '(b) Ca²⁺ + CO₃²⁻ → CaCO₃ ⇒ n(Na₂CO₃) = 0,01 mol.',
            'm(Na₂CO₃) = 0,01 × 106 = 1,06 g.'
          ],
          answer: '(a) 22,4 kg CaO; (b) 1,06 g Na₂CO₃.'
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
          id: 'g12-l25-c1',
          question: 'Muối sulfate hầu như không tan trong nước là',
          options: [
            { id: 'a', text: 'MgSO₄' },
            { id: 'b', text: 'CaSO₄' },
            { id: 'c', text: 'BaSO₄' },
            { id: 'd', text: 'Na₂SO₄' }
          ],
          correct: 'c',
          explanation: 'Độ tan muối sulfate giảm từ Mg đến Ba.'
        },
        {
          type: 'quiz',
          id: 'g12-l25-c2',
          question: 'Đun sôi có thể làm mềm loại nước cứng nào?',
          options: [
            { id: 'a', text: 'Nước cứng tạm thời' },
            { id: 'b', text: 'Nước cứng vĩnh cửu' },
            { id: 'c', text: 'Mọi loại nước cứng' },
            { id: 'd', text: 'Không loại nào' }
          ],
          correct: 'a',
          explanation: 'HCO₃⁻ bị phân hủy, tạo CaCO₃, MgCO₃ kết tủa.'
        },
        {
          type: 'quiz',
          id: 'g12-l25-c3',
          question: 'Chất dùng bó bột khi gãy xương là',
          options: [
            { id: 'a', text: 'thạch cao nung' },
            { id: 'b', text: 'đá vôi' },
            { id: 'c', text: 'vôi sống' },
            { id: 'd', text: 'BaSO₄' }
          ],
          correct: 'a',
          explanation: 'Thạch cao nung kết hợp với nước, đông cứng nhanh.'
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
            'Nhóm IIA: ns², số oxi hóa +2; tính khử mạnh, tăng từ Be đến Ba; màu ngọn lửa Ca đỏ cam, Sr đỏ son, Ba lục.',
            'Độ tan: sulfate giảm, hydroxide tăng từ Mg đến Ba; CaCO₃ bị nhiệt phân tạo CaO.',
            'CaCO₃ + CO₂ + H₂O ⇌ Ca(HCO₃)₂ giải thích hang động, thạch nhũ.',
            'Nước cứng (Ca²⁺, Mg²⁺): tạm thời, vĩnh cửu, toàn phần; làm mềm bằng đun sôi, Na₂CO₃, Na₃PO₄, trao đổi ion.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Đun sôi làm mềm được mọi loại nước cứng.', right: 'Đun sôi chỉ làm mềm **nước cứng tạm thời** (chứa HCO₃⁻).' },
            { wrong: 'Độ tan của hydroxide giảm từ Mg(OH)₂ đến Ba(OH)₂.', right: 'Độ tan hydroxide **tăng** dần; độ tan sulfate mới giảm dần.' },
            { wrong: 'Nước cứng là nước chứa nhiều Na⁺, K⁺.', right: 'Nước cứng chứa nhiều **Ca²⁺ và Mg²⁺**.' }
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
