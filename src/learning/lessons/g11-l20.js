// Hóa học 11 · Chương 5 · Bài 20 — Alcohol.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l20',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm, phân loại alcohol; viết được công thức cấu tạo, gọi được tên (thay thế, thông thường) của alcohol đơn giản; nêu được khái niệm độ rượu.',
    'Giải thích được tính chất vật lí của alcohol (nhiệt độ sôi, tính tan) dựa vào liên kết hydrogen.',
    'Trình bày được tính chất hóa học: phản ứng với Na; phản ứng tạo ether, tạo alkene (quy tắc Zaitsev); phản ứng oxi hóa (tạo aldehyde, ketone; cháy); phản ứng của polyalcohol với Cu(OH)₂.',
    'Trình bày được phương pháp điều chế, ứng dụng của ethanol và tác hại của việc lạm dụng đồ uống có cồn, ngộ độc methanol.'
  ],
  prerequisites: [
    'Bài 13: đồng phân vị trí nhóm chức; Hóa 10: liên kết hydrogen.',
    'Bài 19: quy tắc Zaitsev.'
  ],
  sources: [
    programme('Alcohol'),
    textbook(11, 20)
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
          text: 'Cồn 70° dùng sát trùng vết thương, xăng E5 chứa 5% ethanol, còn những vụ ngộ độc rượu giả lại do methanol gây ra. Các alcohol khác nhau thế nào về cấu tạo, và vì sao chúng có tính chất rất khác hydrocarbon?'
        },
        {
          type: 'list',
          items: [
            'Phân loại và gọi tên alcohol; hiểu độ rượu.',
            'Giải thích nhiệt độ sôi và tính tan của alcohol.',
            'Viết các phản ứng đặc trưng của alcohol.',
            'Biết điều chế, ứng dụng của ethanol và tác hại của đồ uống có cồn.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Nhóm chức alcohol: −OH gắn với C no.', 'Liên kết hydrogen giữa các nhóm O–H.'] }
      ]
    },
    {
      id: 'definition',
      kind: 'concept',
      title: 'Khái niệm, phân loại và danh pháp',
      blocks: [
        {
          type: 'callout',
          title: 'Alcohol',
          text: 'Là hợp chất hữu cơ có nhóm hydroxyl (−OH) liên kết trực tiếp với nguyên tử carbon no. Alcohol no, đơn chức, mạch hở có công thức chung **CₙH₂ₙ₊₁OH** (n ≥ 1).'
        },
        {
          type: 'table',
          caption: 'Phân loại',
          head: ['Theo', 'Loại', 'Ví dụ'],
          rows: [
            ['Bậc alcohol (bậc của C mang OH)', 'Bậc I, II, III', 'CH₃CH₂OH (I); CH₃CH(OH)CH₃ (II); (CH₃)₃COH (III)'],
            ['Số nhóm OH', 'Đơn chức, đa chức', 'C₂H₅OH; C₂H₄(OH)₂ ethylene glycol; C₃H₅(OH)₃ glycerol']
          ]
        },
        {
          type: 'p',
          text: 'Tên thay thế: tên hydrocarbon (bỏ e cuối) + số chỉ vị trí OH + ol. Ví dụ CH₃OH methanol; CH₃CH₂CH₂OH propan-1-ol; CH₃CH(OH)CH₃ propan-2-ol. Tên thông thường: alcohol + tên gốc + ic, ví dụ ethyl alcohol.'
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Độ rượu',
          text: 'Là số mL ethanol nguyên chất có trong 100 mL dung dịch ethanol. Ví dụ rượu 40° chứa 40 mL ethanol trong 100 mL rượu.'
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
            'Giữa các phân tử alcohol có **liên kết hydrogen** nên nhiệt độ sôi cao hơn nhiều so với hydrocarbon, ether có phân tử khối tương đương (ethanol sôi ở 78 °C, dimethyl ether ở −24 °C).',
            'Các alcohol nhỏ (methanol, ethanol, propanol) tan vô hạn trong nước nhờ liên kết hydrogen với nước; độ tan giảm khi gốc hydrocarbon dài ra.'
          ]
        }
      ]
    },
    {
      id: 'reactions',
      kind: 'concept',
      title: 'Tính chất hóa học',
      blocks: [
        { type: 'heading', text: 'Phản ứng với sodium (thế H của nhóm OH)' },
        { type: 'equation', text: '2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂' },
        { type: 'heading', text: 'Phản ứng tách nước (H₂SO₄ đặc)' },
        { type: 'equation', text: '2C₂H₅OH → C₂H₅OC₂H₅ + H₂O', condition: 'H₂SO₄ đặc, 140 °C', note: 'Tạo ether (diethyl ether).' },
        { type: 'equation', text: 'C₂H₅OH → C₂H₄ + H₂O', condition: 'H₂SO₄ đặc, 170 °C', note: 'Tạo alkene; với alcohol bậc cao tuân theo quy tắc Zaitsev.' },
        { type: 'heading', text: 'Phản ứng oxi hóa' },
        { type: 'equation', text: 'C₂H₅OH + CuO → CH₃CHO + Cu + H₂O', condition: 't°', note: 'Alcohol bậc I → aldehyde (CuO đen hóa đỏ).' },
        { type: 'equation', text: 'CH₃CH(OH)CH₃ + CuO → CH₃COCH₃ + Cu + H₂O', condition: 't°', note: 'Alcohol bậc II → ketone. Alcohol bậc III khó bị oxi hóa trong điều kiện này.' },
        { type: 'equation', text: 'C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O', condition: 't°', note: 'Cháy với ngọn lửa xanh nhạt, tỏa nhiều nhiệt.' },
        { type: 'heading', text: 'Phản ứng riêng của polyalcohol có các nhóm OH kề nhau' },
        { type: 'equation', text: '2C₃H₅(OH)₃ + Cu(OH)₂ → [C₃H₅(OH)₂O]₂Cu + 2H₂O', note: 'Cu(OH)₂ tan tạo dung dịch màu xanh lam đặc trưng: dùng nhận biết glycerol, ethylene glycol.' }
      ]
    },
    {
      id: 'ethanol',
      kind: 'concept',
      title: 'Điều chế, ứng dụng của ethanol và tác hại',
      blocks: [
        { type: 'equation', text: 'C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂', condition: 'enzyme, 30 – 35 °C', note: 'Lên men glucose (từ tinh bột, đường).' },
        { type: 'equation', text: 'C₂H₄ + H₂O → C₂H₅OH', condition: 'H⁺, t°', note: 'Hydrate hóa ethylene trong công nghiệp.' },
        {
          type: 'list',
          items: [
            'Ứng dụng: dung môi, nhiên liệu (xăng sinh học E5), nguyên liệu sản xuất acetic acid, dung dịch sát trùng (cồn 70°), đồ uống.',
            'Lạm dụng đồ uống có cồn gây hại gan, thần kinh, tim mạch, gây tai nạn giao thông.',
            '**Methanol** rất độc: một lượng nhỏ có thể gây mù lòa, tử vong; rượu giả pha methanol là nguyên nhân các vụ ngộ độc.'
          ]
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Lên men và phản ứng với sodium',
      blocks: [
        {
          type: 'worked',
          problem: '(a) Lên men 180 g glucose với hiệu suất 80%. Tính khối lượng ethanol thu được. (b) Cho 4,6 g ethanol tác dụng hết với Na. Tính thể tích H₂ ở điều kiện chuẩn (24,79 L/mol) (C = 12, H = 1, O = 16).',
          steps: [
            '(a) n(glucose) = 180 / 180 = 1 mol ⇒ ethanol lí thuyết 2 mol; thực tế 2 × 80% = 1,6 mol ⇒ m = 1,6 × 46 = 73,6 g.',
            '(b) n(C₂H₅OH) = 4,6 / 46 = 0,1 mol; 2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂ ⇒ n(H₂) = 0,05 mol.',
            'V(H₂) = 0,05 × 24,79 ≈ 1,24 L.'
          ],
          answer: '(a) 73,6 g ethanol; (b) khoảng 1,24 L H₂.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: nhận biết glycerol',
      blocks: [
        {
          type: 'p',
          text: 'Trong phòng thí nghiệm ảo, tạo Cu(OH)₂ từ CuSO₄ và NaOH rồi thêm glycerol. Quan sát kết tủa xanh tan thành dung dịch xanh lam.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Alcohol',
          text: 'Mở trong Phòng thí nghiệm ảo; quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'guided', grade: 11, lessonId: 'g11-l20', experimentId: 'g11-lesson-20' }
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
          id: 'g11-l20-c1',
          question: 'Chất nào là alcohol bậc II?',
          options: [
            { id: 'a', text: 'CH₃CH₂OH' },
            { id: 'b', text: 'CH₃CH(OH)CH₃' },
            { id: 'c', text: '(CH₃)₃COH' },
            { id: 'd', text: 'CH₃OH' }
          ],
          correct: 'b',
          explanation: 'Nhóm OH gắn với C liên kết với hai nguyên tử C khác (C bậc II).'
        },
        {
          type: 'quiz',
          id: 'g11-l20-c2',
          question: 'Oxi hóa ethanol bằng CuO, đun nóng, thu được',
          options: [
            { id: 'a', text: 'CH₃COOH' },
            { id: 'b', text: 'CH₃CHO' },
            { id: 'c', text: 'CH₃COCH₃' },
            { id: 'd', text: 'C₂H₄' }
          ],
          correct: 'b',
          explanation: 'Alcohol bậc I bị CuO oxi hóa thành aldehyde.'
        },
        {
          type: 'quiz',
          id: 'g11-l20-c3',
          question: 'Thuốc thử phân biệt glycerol và ethanol là',
          options: [
            { id: 'a', text: 'Na' },
            { id: 'b', text: 'Cu(OH)₂' },
            { id: 'c', text: 'quỳ tím' },
            { id: 'd', text: 'NaOH' }
          ],
          correct: 'b',
          explanation: 'Glycerol hòa tan Cu(OH)₂ tạo dung dịch xanh lam; ethanol không. Cả hai đều phản ứng với Na.'
        },
        {
          type: 'quiz',
          id: 'g11-l20-c4',
          question: 'Ethanol có nhiệt độ sôi cao hơn nhiều so với dimethyl ether vì',
          options: [
            { id: 'a', text: 'ethanol có phân tử khối lớn hơn' },
            { id: 'b', text: 'giữa các phân tử ethanol có liên kết hydrogen' },
            { id: 'c', text: 'ethanol là hợp chất ion' },
            { id: 'd', text: 'dimethyl ether có liên kết hydrogen mạnh hơn' }
          ],
          correct: 'b',
          explanation: 'Hai chất có cùng phân tử khối 46; chỉ ethanol có nhóm O–H tạo liên kết hydrogen.'
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
            'Alcohol: −OH gắn C no; no đơn chức mạch hở CₙH₂ₙ₊₁OH; bậc I, II, III; tên -ol.',
            'Liên kết hydrogen ⇒ nhiệt độ sôi cao, alcohol nhỏ tan vô hạn trong nước.',
            'Phản ứng: với Na (tạo H₂); tách nước (140 °C tạo ether, 170 °C tạo alkene); CuO oxi hóa bậc I → aldehyde, bậc II → ketone; polyalcohol + Cu(OH)₂ → xanh lam.',
            'Ethanol: lên men glucose hoặc hydrate ethylene; methanol rất độc.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Bậc của alcohol là số nhóm OH.', right: 'Bậc alcohol là **bậc của nguyên tử C mang nhóm OH**; số nhóm OH cho biết đơn chức hay đa chức.' },
            { wrong: 'Mọi alcohol đều hòa tan được Cu(OH)₂.', right: 'Chỉ polyalcohol có **các nhóm OH kề nhau** (glycerol, ethylene glycol) mới hòa tan Cu(OH)₂.' },
            { wrong: 'Rượu 40° nghĩa là 40 g ethanol trong 100 g rượu.', right: 'Độ rượu tính theo **thể tích**: 40 mL ethanol trong 100 mL dung dịch.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Phenol**.'
        }
      ]
    }
  ]
}
