// Hóa học 11 · Chương 6 · Bài 23 — Hợp chất carbonyl.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l23',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm hợp chất carbonyl (aldehyde, ketone); viết được công thức cấu tạo, gọi được tên thay thế và tên thông thường của một số hợp chất carbonyl đơn giản.',
    'Nêu được đặc điểm cấu tạo của nhóm carbonyl và tính chất vật lí của hợp chất carbonyl.',
    'Trình bày được tính chất hóa học: phản ứng khử (NaBH₄, H₂); phản ứng oxi hóa aldehyde (nước bromine, thuốc thử Tollens, Cu(OH)₂/NaOH); phản ứng cộng HCN; phản ứng tạo iodoform.',
    'Trình bày được ứng dụng và phương pháp điều chế của một số hợp chất carbonyl (formaldehyde, acetaldehyde, acetone).'
  ],
  prerequisites: [
    'Bài 20: oxi hóa alcohol bậc I, bậc II bằng CuO.',
    'Bài 12 – 13: danh pháp và đồng phân hợp chất hữu cơ.'
  ],
  sources: [
    programme('Hợp chất carbonyl'),
    textbook(11, 23)
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
          text: 'Formalin dùng bảo quản mẫu sinh vật, acetone dùng tẩy sơn móng tay. Cả hai đều có nhóm C=O, nhưng chỉ formaldehyde tạo được lớp bạc sáng bóng trên thành ống nghiệm. Vì sao aldehyde và ketone khác nhau như vậy?'
        },
        {
          type: 'list',
          items: [
            'Phân biệt aldehyde và ketone; gọi tên hợp chất carbonyl.',
            'Viết phản ứng khử và phản ứng oxi hóa aldehyde.',
            'Nhận biết aldehyde bằng thuốc thử Tollens, Cu(OH)₂/NaOH; nhận biết nhóm CH₃CO− bằng phản ứng iodoform.',
            'Nêu ứng dụng và điều chế formaldehyde, acetaldehyde, acetone.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Alcohol bậc I + CuO → aldehyde; alcohol bậc II + CuO → ketone.', 'Liên kết π dễ tham gia phản ứng cộng.'] }
      ]
    },
    {
      id: 'definition',
      kind: 'concept',
      title: 'Khái niệm, cấu tạo và danh pháp',
      blocks: [
        {
          type: 'callout',
          title: 'Hợp chất carbonyl',
          text: 'Là hợp chất hữu cơ có nhóm **C=O** (nhóm carbonyl). **Aldehyde** có nhóm −CHO liên kết với gốc hydrocarbon hoặc H (R−CHO); **ketone** có nhóm C=O liên kết với hai gốc hydrocarbon (R−CO−R′).'
        },
        {
          type: 'p',
          text: 'Liên kết C=O gồm một liên kết σ và một liên kết π, phân cực về phía O (O mang một phần điện tích âm, C mang một phần điện tích dương).'
        },
        {
          type: 'table',
          caption: 'Danh pháp một số hợp chất carbonyl',
          head: ['Công thức', 'Tên thay thế', 'Tên thông thường'],
          rows: [
            ['HCHO', 'methanal', 'formaldehyde'],
            ['CH₃CHO', 'ethanal', 'acetaldehyde'],
            ['CH₃CH₂CHO', 'propanal', 'propionaldehyde'],
            ['CH₃COCH₃', 'propanone', 'acetone'],
            ['CH₃COCH₂CH₃', 'butanone', 'methyl ethyl ketone']
          ]
        },
        {
          type: 'p',
          text: 'Aldehyde: tên hydrocarbon (bỏ e) + **al**, C của nhóm −CHO là C1. Ketone: tên hydrocarbon (bỏ e) + số chỉ vị trí C=O + **one**, ví dụ pentan-2-one.'
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
            'Ở điều kiện thường, formaldehyde và acetaldehyde là chất khí (acetaldehyde sôi ở 21 °C); acetone là chất lỏng dễ bay hơi.',
            'Không có liên kết hydrogen giữa các phân tử nên nhiệt độ sôi **thấp hơn alcohol** có cùng số C, nhưng cao hơn hydrocarbon có phân tử khối tương đương.',
            'Các chất đầu dãy tan tốt trong nước nhờ tạo liên kết hydrogen với nước. Formalin là dung dịch formaldehyde 37 – 40% trong nước.'
          ]
        }
      ]
    },
    {
      id: 'reactions',
      kind: 'concept',
      title: 'Tính chất hóa học',
      blocks: [
        { type: 'heading', text: 'Phản ứng khử' },
        {
          type: 'p',
          text: 'Với chất khử NaBH₄ hoặc H₂ (xúc tác Ni, t°): aldehyde → alcohol bậc I; ketone → alcohol bậc II.'
        },
        { type: 'equation', text: 'CH₃CHO + H₂ → CH₃CH₂OH', condition: 'Ni, t°' },
        { type: 'equation', text: 'CH₃COCH₃ + H₂ → CH₃CH(OH)CH₃', condition: 'Ni, t°' },
        { type: 'heading', text: 'Phản ứng oxi hóa aldehyde (ketone khó bị oxi hóa)' },
        { type: 'equation', text: 'CH₃CHO + Br₂ + H₂O → CH₃COOH + 2HBr', note: 'Aldehyde làm mất màu nước bromine.' },
        { type: 'equation', text: 'CH₃CHO + 2[Ag(NH₃)₂]OH → CH₃COONH₄ + 2Ag + 3NH₃ + H₂O', condition: 't°', note: 'Thuốc thử Tollens: bạc bám lên thành ống nghiệm (phản ứng tráng bạc).' },
        { type: 'equation', text: 'CH₃CHO + 2Cu(OH)₂ + NaOH → CH₃COONa + Cu₂O + 3H₂O', condition: 't°', note: 'Tạo kết tủa đỏ gạch Cu₂O.' },
        {
          type: 'callout',
          tone: 'note',
          title: 'Trường hợp đặc biệt của HCHO',
          text: 'Phân tử HCHO có thể coi như có hai nhóm −CHO, nên 1 mol HCHO tráng bạc tạo tối đa **4 mol Ag** (các aldehyde đơn chức khác tạo 2 mol Ag).'
        },
        { type: 'heading', text: 'Phản ứng cộng HCN' },
        { type: 'equation', text: 'CH₃CHO + HCN → CH₃CH(OH)CN', note: 'Tạo cyanohydrin; phản ứng làm tăng mạch thêm 1 nguyên tử C.' },
        { type: 'heading', text: 'Phản ứng tạo iodoform' },
        { type: 'equation', text: 'CH₃COCH₃ + 3I₂ + 4NaOH → CHI₃ + CH₃COONa + 3NaI + 3H₂O', note: 'Kết tủa vàng CHI₃: nhận biết hợp chất có nhóm CH₃CO− (như acetone, acetaldehyde).' }
      ]
    },
    {
      id: 'uses',
      kind: 'concept',
      title: 'Ứng dụng và điều chế',
      blocks: [
        {
          type: 'table',
          caption: 'Một số hợp chất carbonyl quan trọng',
          head: ['Chất', 'Ứng dụng', 'Điều chế'],
          rows: [
            ['Formaldehyde', 'Sản xuất nhựa (phenol-formaldehyde), formalin bảo quản mẫu sinh vật; chất độc, gây kích ứng', 'Oxi hóa methanol'],
            ['Acetaldehyde', 'Sản xuất acetic acid và nhiều hóa chất khác', 'Oxi hóa ethylene (xúc tác PdCl₂, CuCl₂)'],
            ['Acetone', 'Dung môi (sơn, keo, tẩy sơn móng tay), nguyên liệu tổng hợp hữu cơ', 'Từ cumene (cùng với phenol)']
          ]
        },
        { type: 'equation', text: '2C₂H₄ + O₂ → 2CH₃CHO', condition: 'PdCl₂, CuCl₂, t°' }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Phản ứng tráng bạc',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho 4,4 g acetaldehyde tác dụng với lượng dư dung dịch AgNO₃ trong NH₃, đun nóng. Tính khối lượng Ag thu được (C = 12, H = 1, O = 16, Ag = 108).',
          steps: [
            'n(CH₃CHO) = 4,4 / 44 = 0,1 mol.',
            'Aldehyde đơn chức (khác HCHO) tạo 2 Ag ⇒ n(Ag) = 0,2 mol.',
            'm(Ag) = 0,2 × 108 = 21,6 g.'
          ],
          answer: 'Thu được 21,6 g Ag.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: oxi hóa ethanal',
      blocks: [
        {
          type: 'p',
          text: 'Trong phòng thí nghiệm ảo, đun ethanal với dung dịch K₂Cr₂O₇ trong H₂SO₄: dung dịch chuyển từ màu da cam sang xanh lục do Cr(VI) bị khử thành Cr(III), còn ethanal bị oxi hóa thành ethanoic acid.'
        },
        { type: 'equation', text: '3CH₃CHO + K₂Cr₂O₇ + 4H₂SO₄ → 3CH₃COOH + Cr₂(SO₄)₃ + K₂SO₄ + 4H₂O', condition: 't°' },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Hợp chất carbonyl',
          text: 'Mở trong Phòng thí nghiệm ảo; quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'guided', grade: 11, lessonId: 'g11-l23', experimentId: 'g11-lesson-23' }
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
          id: 'g11-l23-c1',
          question: 'Tên thay thế của CH₃COCH₃ là',
          options: [
            { id: 'a', text: 'propanal' },
            { id: 'b', text: 'propanone' },
            { id: 'c', text: 'propan-2-ol' },
            { id: 'd', text: 'acetaldehyde' }
          ],
          correct: 'b',
          explanation: 'Ketone 3 C: propan + one (acetone).'
        },
        {
          type: 'quiz',
          id: 'g11-l23-c2',
          question: 'Khử CH₃COCH₃ bằng NaBH₄ thu được',
          options: [
            { id: 'a', text: 'propan-1-ol' },
            { id: 'b', text: 'propan-2-ol' },
            { id: 'c', text: 'propanal' },
            { id: 'd', text: 'propane' }
          ],
          correct: 'b',
          explanation: 'Ketone bị khử thành alcohol bậc II.'
        },
        {
          type: 'quiz',
          id: 'g11-l23-c3',
          question: 'Thuốc thử phân biệt ethanal và acetone là',
          options: [
            { id: 'a', text: 'dung dịch AgNO₃ trong NH₃' },
            { id: 'b', text: 'I₂ trong NaOH' },
            { id: 'c', text: 'quỳ tím' },
            { id: 'd', text: 'Na' }
          ],
          correct: 'a',
          explanation: 'Chỉ aldehyde tráng bạc; cả hai đều có nhóm CH₃CO− nên đều tạo iodoform.'
        },
        {
          type: 'quiz',
          id: 'g11-l23-c4',
          question: 'Acetaldehyde có nhiệt độ sôi thấp hơn ethanol vì',
          options: [
            { id: 'a', text: 'acetaldehyde có phân tử khối nhỏ hơn nhiều' },
            { id: 'b', text: 'giữa các phân tử acetaldehyde không có liên kết hydrogen' },
            { id: 'c', text: 'acetaldehyde không phân cực' },
            { id: 'd', text: 'acetaldehyde là hợp chất ion' }
          ],
          correct: 'b',
          explanation: 'Phân tử khối gần nhau (44 và 46); acetaldehyde không có H gắn với O nên không tạo liên kết hydrogen liên phân tử.'
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
            'Aldehyde R−CHO (tên -al), ketone R−CO−R′ (tên -one); nhóm C=O phân cực.',
            'Khử bằng NaBH₄ hoặc H₂: aldehyde → alcohol bậc I, ketone → alcohol bậc II.',
            'Aldehyde bị oxi hóa bởi nước bromine, thuốc thử Tollens (tráng bạc), Cu(OH)₂/NaOH (kết tủa đỏ gạch); ketone khó bị oxi hóa.',
            'Cộng HCN tạo cyanohydrin; nhóm CH₃CO− + I₂/NaOH tạo kết tủa vàng iodoform.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Ketone cũng tráng bạc như aldehyde.', right: 'Chỉ **aldehyde** (có −CHO) tráng bạc; ketone khó bị oxi hóa.' },
            { wrong: 'Mọi aldehyde đơn chức tạo 2 mol Ag.', right: '**HCHO** tạo tối đa 4 mol Ag cho mỗi mol aldehyde.' },
            { wrong: 'Khử ketone thu được alcohol bậc I.', right: 'Khử ketone thu được **alcohol bậc II**; khử aldehyde mới thu được alcohol bậc I.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Carboxylic acid**.'
        }
      ]
    }
  ]
}
