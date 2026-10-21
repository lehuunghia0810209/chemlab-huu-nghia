// Hóa học 11 · Chương 6 · Bài 24 — Carboxylic acid.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l24',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm carboxylic acid; viết được công thức cấu tạo, gọi được tên thay thế và tên thông thường của một số carboxylic acid đơn giản.',
    'Giải thích được nhiệt độ sôi và tính tan của carboxylic acid dựa vào liên kết hydrogen.',
    'Trình bày được tính chất hóa học: tính acid (phản ứng với kim loại, base, oxide base, muối carbonate) và phản ứng ester hóa.',
    'Trình bày được ứng dụng và phương pháp điều chế acetic acid.'
  ],
  prerequisites: [
    'Hóa 11 chương 1: acid yếu, cân bằng điện li.',
    'Bài 20, 23: alcohol, aldehyde.'
  ],
  sources: [
    programme('Carboxylic acid'),
    textbook(11, 24)
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
          text: 'Giấm ăn có vị chua do chứa khoảng 2 – 5% acetic acid; vết kiến đốt gây rát do formic acid. Nhóm chức nào làm các chất này có tính acid, và chúng tham gia những phản ứng gì?'
        },
        {
          type: 'list',
          items: [
            'Gọi tên carboxylic acid; giải thích nhiệt độ sôi cao.',
            'Viết phản ứng thể hiện tính acid của carboxylic acid.',
            'Viết và tính toán phản ứng ester hóa.',
            'Nêu điều chế và ứng dụng của acetic acid.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Acid yếu phân li một phần, có cân bằng điện li.', 'Oxi hóa aldehyde tạo carboxylic acid.'] }
      ]
    },
    {
      id: 'definition',
      kind: 'concept',
      title: 'Khái niệm và danh pháp',
      blocks: [
        {
          type: 'callout',
          title: 'Carboxylic acid',
          text: 'Là hợp chất hữu cơ có nhóm carboxyl (**−COOH**) liên kết với gốc hydrocarbon hoặc H. Carboxylic acid no, đơn chức, mạch hở có công thức chung **CₙH₂ₙ₊₁COOH** (n ≥ 0), hay CₘH₂ₘO₂ (m ≥ 1).'
        },
        {
          type: 'table',
          caption: 'Danh pháp một số carboxylic acid',
          head: ['Công thức', 'Tên thay thế', 'Tên thông thường'],
          rows: [
            ['HCOOH', 'methanoic acid', 'formic acid'],
            ['CH₃COOH', 'ethanoic acid', 'acetic acid'],
            ['CH₃CH₂COOH', 'propanoic acid', 'propionic acid'],
            ['CH₂=CHCOOH', 'propenoic acid', 'acrylic acid'],
            ['C₆H₅COOH', 'benzoic acid', 'benzoic acid']
          ]
        },
        {
          type: 'p',
          text: 'Tên thay thế: tên hydrocarbon tương ứng (tính cả C của nhóm −COOH) + **oic acid**; mạch đánh số từ C của nhóm −COOH.'
        }
      ]
    },
    {
      id: 'physical',
      kind: 'concept',
      title: 'Tính chất vật lí',
      blocks: [
        {
          type: 'list',
          items: [
            'Các phân tử carboxylic acid tạo **liên kết hydrogen bền** với nhau (có thể tạo dimer) nên nhiệt độ sôi cao hơn alcohol có phân tử khối tương đương: acetic acid (M = 60) sôi ở 118 °C, propan-1-ol (M = 60) sôi ở 97 °C.',
            'Các acid đầu dãy (C1 – C4) tan vô hạn trong nước; độ tan giảm khi gốc hydrocarbon dài ra.'
          ]
        }
      ]
    },
    {
      id: 'reactions',
      kind: 'concept',
      title: 'Tính chất hóa học',
      blocks: [
        { type: 'heading', text: 'Tính acid yếu' },
        { type: 'equation', text: 'CH₃COOH ⇌ CH₃COO⁻ + H⁺', note: 'Dung dịch làm quỳ tím hóa đỏ.' },
        { type: 'equation', text: '2CH₃COOH + Mg → (CH₃COO)₂Mg + H₂' },
        { type: 'equation', text: 'CH₃COOH + NaOH → CH₃COONa + H₂O' },
        { type: 'equation', text: '2CH₃COOH + CuO → (CH₃COO)₂Cu + H₂O', note: 'CuO tan, dung dịch có màu xanh.' },
        { type: 'equation', text: '2CH₃COOH + CaCO₃ → (CH₃COO)₂Ca + CO₂ + H₂O', note: 'Giấm làm sạch cặn đá vôi trong ấm đun nước.' },
        { type: 'equation', text: 'CH₃COOH + NaHCO₃ → CH₃COONa + CO₂ + H₂O', note: 'Sủi bọt khí: nhận biết carboxylic acid.' },
        { type: 'heading', text: 'Phản ứng ester hóa' },
        { type: 'equation', text: 'CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O', condition: 'H₂SO₄ đặc, t°', note: 'Tạo ethyl acetate có mùi thơm. Phản ứng thuận nghịch, H₂SO₄ đặc vừa là xúc tác vừa hút nước làm cân bằng chuyển dịch theo chiều tạo ester.' },
        {
          type: 'callout',
          tone: 'note',
          title: 'Formic acid',
          text: 'Phân tử HCOOH có nhóm −CHO nên ngoài tính acid còn có tính chất của aldehyde, ví dụ tham gia phản ứng tráng bạc.'
        }
      ]
    },
    {
      id: 'ethanoic',
      kind: 'concept',
      title: 'Điều chế và ứng dụng của acetic acid',
      blocks: [
        { type: 'equation', text: 'C₂H₅OH + O₂ → CH₃COOH + H₂O', condition: 'enzyme, 25 – 30 °C', note: 'Lên men giấm (phương pháp sinh hóa, dùng sản xuất giấm ăn).' },
        { type: 'equation', text: 'CH₃OH + CO → CH₃COOH', condition: 'xúc tác, t°', note: 'Phương pháp carbonyl hóa methanol, chủ yếu trong công nghiệp.' },
        { type: 'equation', text: '2C₄H₁₀ + 5O₂ → 4CH₃COOH + 2H₂O', condition: 'xúc tác, t°, p', note: 'Oxi hóa butane.' },
        {
          type: 'p',
          text: 'Ứng dụng: giấm ăn; nguyên liệu sản xuất tơ acetate, dược phẩm, chất dẻo, phẩm nhuộm, ester làm hương liệu và dung môi.'
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Ester hóa có hiệu suất',
      blocks: [
        {
          type: 'worked',
          problem: 'Đun 6 g acetic acid với 4,6 g ethanol (xúc tác H₂SO₄ đặc), hiệu suất phản ứng ester hóa là 60%. Tính khối lượng ethyl acetate thu được (C = 12, H = 1, O = 16).',
          steps: [
            'n(CH₃COOH) = 6 / 60 = 0,1 mol; n(C₂H₅OH) = 4,6 / 46 = 0,1 mol ⇒ tỉ lệ 1 : 1, tính theo chất nào cũng được.',
            'Ester lí thuyết 0,1 mol; thực tế 0,1 × 60% = 0,06 mol.',
            'M(CH₃COOC₂H₅) = 88 ⇒ m = 0,06 × 88 = 5,28 g.'
          ],
          answer: 'Thu được 5,28 g ethyl acetate.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: acetic acid và NaHCO₃',
      blocks: [
        {
          type: 'p',
          text: 'Trong phòng thí nghiệm ảo, cho ethanoic acid tác dụng với NaHCO₃ và quan sát khí CO₂ thoát ra.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Carboxylic acid',
          text: 'Mở trong Phòng thí nghiệm ảo; quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'guided', grade: 11, lessonId: 'g11-l24', experimentId: 'g11-lesson-24' }
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
          id: 'g11-l24-c1',
          question: 'Tên thay thế của CH₃CH₂COOH là',
          options: [
            { id: 'a', text: 'ethanoic acid' },
            { id: 'b', text: 'propanoic acid' },
            { id: 'c', text: 'propanal' },
            { id: 'd', text: 'butanoic acid' }
          ],
          correct: 'b',
          explanation: 'Mạch có 3 C kể cả C của nhóm −COOH: propanoic acid.'
        },
        {
          type: 'quiz',
          id: 'g11-l24-c2',
          question: 'Chất nào có nhiệt độ sôi cao nhất?',
          options: [
            { id: 'a', text: 'CH₃CHO' },
            { id: 'b', text: 'C₂H₅OH' },
            { id: 'c', text: 'CH₃COOH' },
            { id: 'd', text: 'C₂H₆' }
          ],
          correct: 'c',
          explanation: 'Carboxylic acid có liên kết hydrogen bền hơn alcohol.'
        },
        {
          type: 'quiz',
          id: 'g11-l24-c3',
          question: 'Phản ứng giữa CH₃COOH và C₂H₅OH (H₂SO₄ đặc, t°) gọi là',
          options: [
            { id: 'a', text: 'phản ứng trung hòa' },
            { id: 'b', text: 'phản ứng ester hóa' },
            { id: 'c', text: 'phản ứng tráng bạc' },
            { id: 'd', text: 'phản ứng cộng' }
          ],
          correct: 'b',
          explanation: 'Acid + alcohol ⇌ ester + nước.'
        },
        {
          type: 'quiz',
          id: 'g11-l24-c4',
          question: 'Dùng chất nào để phân biệt acetic acid và ethanol?',
          options: [
            { id: 'a', text: 'Na' },
            { id: 'b', text: 'NaHCO₃' },
            { id: 'c', text: 'nước' },
            { id: 'd', text: 'O₂' }
          ],
          correct: 'b',
          explanation: 'Acetic acid tạo khí CO₂ với NaHCO₃; ethanol không phản ứng. Cả hai đều tác dụng với Na.'
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
            'Carboxylic acid có nhóm −COOH; no đơn chức mạch hở CₙH₂ₙ₊₁COOH; tên -oic acid.',
            'Liên kết hydrogen bền ⇒ nhiệt độ sôi cao hơn alcohol cùng phân tử khối.',
            'Acid yếu: tác dụng với kim loại hoạt động, base, oxide base, muối carbonate/hydrogencarbonate.',
            'Ester hóa thuận nghịch, xúc tác H₂SO₄ đặc. Acetic acid: lên men giấm, carbonyl hóa methanol.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Tính hiệu suất ester hóa xong là hết, phản ứng xảy ra hoàn toàn.', right: 'Ester hóa là phản ứng **thuận nghịch**, hiệu suất luôn nhỏ hơn 100%.' },
            { wrong: 'Gọi tên CH₃CH₂COOH là ethanoic acid vì gốc là ethyl.', right: 'Tên thay thế tính **cả C của nhóm −COOH**: 3 C ⇒ propanoic acid.' },
            { wrong: 'Acid nào cũng tráng bạc được.', right: 'Chỉ **HCOOH** (có nhóm −CHO) tráng bạc; acetic acid thì không.' }
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
