// Hóa học 11 · Chương 2 · Bài 4 — Nitrogen.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l4',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được trạng thái tự nhiên của nguyên tố nitrogen.',
    'Giải thích được tính trơ của đơn chất nitrogen ở nhiệt độ thường thông qua liên kết và năng lượng liên kết.',
    'Trình bày được tính oxi hóa (tác dụng với hydrogen) và tính khử (tác dụng với oxygen) của nitrogen.',
    'Giải thích được ứng dụng của nitrogen khí và lỏng; nguồn gốc nitrogen trong tự nhiên và do con người tạo ra.'
  ],
  prerequisites: [
    'Hóa 10: liên kết ba N≡N, năng lượng liên kết; số oxi hóa, chất oxi hóa, chất khử.',
    'Hóa 11 bài 1: cân bằng hóa học, nguyên lí Le Chatelier.'
  ],
  sources: [
    programme('Nitrogen'),
    textbook(11, 4)
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
          text: 'Mỗi lần hít thở, gần 4/5 lượng khí ta hít vào là nitrogen, nhưng cơ thể không dùng được chút nitrogen nào trong số đó. Trong khi đó, sau mỗi trận mưa giông, cây cối lại “được bón phân” từ chính khí trời. Vì sao nitrogen trơ như vậy, và nó đi vào đất bằng cách nào?'
        },
        {
          type: 'list',
          items: [
            'Biết nitrogen tồn tại ở đâu trong tự nhiên.',
            'Giải thích tính trơ của N₂ bằng liên kết ba.',
            'Viết phản ứng thể hiện tính oxi hóa và tính khử của nitrogen.',
            'Hiểu chu trình nitrogen và ứng dụng của nitrogen.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['N (Z = 7): 1s² 2s² 2p³, nhóm VA.', 'Năng lượng liên kết N≡N khoảng 945 kJ/mol.'] }
      ]
    },
    {
      id: 'nature',
      kind: 'concept',
      title: 'Trạng thái tự nhiên và tính chất vật lí',
      blocks: [
        {
          type: 'list',
          items: [
            'Dạng đơn chất: N₂ chiếm khoảng 78% thể tích không khí.',
            'Dạng hợp chất: có trong protein, nucleic acid của cơ thể sống; trong khoáng vật như sodium nitrate (diêm tiêu).',
            'N₂ là khí không màu, không mùi, không vị, ít tan trong nước, hóa lỏng ở −196 °C.'
          ]
        },
        {
          type: 'table',
          caption: 'Các số oxi hóa thường gặp của nitrogen',
          head: ['−3', '0', '+1', '+2', '+4', '+5'],
          rows: [['NH₃, NH₄⁺', 'N₂', 'N₂O', 'NO', 'NO₂', 'HNO₃, NO₃⁻']]
        }
      ]
    },
    {
      id: 'inert',
      kind: 'concept',
      title: 'Vì sao nitrogen kém hoạt động?',
      blocks: [
        {
          type: 'p',
          text: 'Phân tử N₂ có liên kết ba (N≡N: 1σ + 2π) với năng lượng liên kết rất lớn, khoảng 945 kJ/mol, so với O=O khoảng 498 kJ/mol. Phải cung cấp nhiều năng lượng mới phá vỡ được liên kết này, nên **ở nhiệt độ thường nitrogen khá trơ**; khi đun nóng mạnh hoặc có xúc tác, nitrogen mới phản ứng.'
        }
      ]
    },
    {
      id: 'reactions',
      kind: 'concept',
      title: 'Tính oxi hóa và tính khử',
      blocks: [
        {
          type: 'p',
          text: 'Trong N₂, nitrogen có số oxi hóa 0, trung gian giữa −3 và +5, nên N₂ vừa có tính oxi hóa, vừa có tính khử.'
        },
        { type: 'heading', text: 'Tính oxi hóa: tác dụng với hydrogen' },
        { type: 'equation', text: 'N₂ + 3H₂ ⇌ 2NH₃', condition: 't°, p, xúc tác Fe', note: 'N: 0 → −3. Đây là phản ứng tổng hợp ammonia trong công nghiệp.' },
        { type: 'heading', text: 'Tính khử: tác dụng với oxygen' },
        { type: 'equation', text: 'N₂ + O₂ ⇌ 2NO', condition: 'khoảng 3000 °C hoặc tia lửa điện', note: 'N: 0 → +2. Xảy ra trong động cơ đốt trong và khi có sấm sét.' }
      ]
    },
    {
      id: 'cycle',
      kind: 'concept',
      title: 'Nitrogen trong tự nhiên và do con người tạo ra',
      blocks: [
        { type: 'heading', text: 'Mưa giông mang đạm về đất' },
        { type: 'equation', text: 'N₂ + O₂ → 2NO', condition: 'tia lửa điện' },
        { type: 'equation', text: '2NO + O₂ → 2NO₂' },
        { type: 'equation', text: '4NO₂ + O₂ + 2H₂O → 4HNO₃', note: 'HNO₃ theo nước mưa xuống đất tạo ion NO₃⁻ cho cây hấp thụ.' },
        {
          type: 'list',
          items: [
            'Vi khuẩn cố định đạm (ở nốt sần rễ cây họ đậu) chuyển N₂ thành hợp chất chứa nitrogen.',
            'Con người tổng hợp ammonia từ N₂ để sản xuất phân đạm, nitric acid, thuốc nổ.',
            'Hoạt động đốt nhiên liệu tạo NOₓ gây ô nhiễm; dư thừa phân bón gây ô nhiễm nguồn nước.'
          ]
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Hiệu suất tổng hợp ammonia',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho 1,0 mol N₂ và 3,0 mol H₂ vào bình phản ứng (có xúc tác, nhiệt độ và áp suất thích hợp). Khi cân bằng, hiệu suất phản ứng là 25%. Tính số mol NH₃ thu được và tổng số mol khí trong bình.',
          steps: [
            'N₂ + 3H₂ ⇌ 2NH₃; tỉ lệ ban đầu đúng hệ số nên tính hiệu suất theo N₂ (hoặc H₂).',
            'N₂ phản ứng: 1,0 × 25% = 0,25 mol ⇒ H₂ phản ứng 0,75 mol, NH₃ tạo thành 0,50 mol.',
            'Sau phản ứng: N₂ 0,75 mol; H₂ 2,25 mol; NH₃ 0,50 mol ⇒ tổng 3,50 mol.'
          ],
          answer: 'n(NH₃) = 0,50 mol; tổng số mol khí giảm từ 4,0 xuống 3,5 mol (vì 4 mol khí tạo 2 mol khí).'
        }
      ]
    },
    {
      id: 'uses',
      kind: 'concept',
      title: 'Ứng dụng của nitrogen',
      blocks: [
        {
          type: 'table',
          caption: 'Ứng dụng và tính chất tương ứng',
          head: ['Ứng dụng', 'Dựa trên tính chất'],
          rows: [
            ['Bơm vào bao bì thực phẩm, bảo quản nông sản', 'Khí trơ ở nhiệt độ thường, ngăn oxi hóa và vi khuẩn hiếu khí'],
            ['Nitrogen lỏng bảo quản mẫu sinh học, làm lạnh nhanh', 'Rất lạnh (−196 °C)'],
            ['Tổng hợp ammonia, sản xuất phân đạm, nitric acid', 'Tính oxi hóa khi có xúc tác, nhiệt độ cao'],
            ['Môi trường trơ trong luyện kim, sản xuất điện tử', 'Kém hoạt động']
          ]
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
          id: 'g11-l4-c1',
          question: 'Ở nhiệt độ thường, nitrogen khá trơ về mặt hóa học vì',
          options: [
            { id: 'a', text: 'nitrogen có độ âm điện nhỏ' },
            { id: 'b', text: 'phân tử N₂ có liên kết ba rất bền' },
            { id: 'c', text: 'nitrogen là khí hiếm' },
            { id: 'd', text: 'nitrogen không tan trong nước' }
          ],
          correct: 'b',
          explanation: 'Năng lượng liên kết N≡N khoảng 945 kJ/mol, rất khó phá vỡ.'
        },
        {
          type: 'quiz',
          id: 'g11-l4-c2',
          question: 'Trong phản ứng N₂ + 3H₂ ⇌ 2NH₃, nitrogen đóng vai trò',
          options: [
            { id: 'a', text: 'chất khử' },
            { id: 'b', text: 'chất oxi hóa' },
            { id: 'c', text: 'chất xúc tác' },
            { id: 'd', text: 'vừa oxi hóa vừa khử' }
          ],
          correct: 'b',
          explanation: 'N: 0 → −3, nhận electron nên N₂ là chất oxi hóa.'
        },
        {
          type: 'quiz',
          id: 'g11-l4-c3',
          question: 'Số oxi hóa của nitrogen trong NO₂ là',
          options: [
            { id: 'a', text: '+2' },
            { id: 'b', text: '+4' },
            { id: 'c', text: '+5' },
            { id: 'd', text: '−3' }
          ],
          correct: 'b',
          explanation: 'x + 2 × (−2) = 0 ⇒ x = +4.'
        },
        {
          type: 'quiz',
          id: 'g11-l4-c4',
          question: 'Nitrogen lỏng được dùng để bảo quản mẫu sinh học chủ yếu vì',
          options: [
            { id: 'a', text: 'có tính oxi hóa mạnh' },
            { id: 'b', text: 'có nhiệt độ rất thấp (khoảng −196 °C)' },
            { id: 'c', text: 'có tính acid' },
            { id: 'd', text: 'tan nhiều trong nước' }
          ],
          correct: 'b',
          explanation: 'Nhiệt độ rất thấp làm chậm gần như hoàn toàn các quá trình sinh hóa.'
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
            'N₂ chiếm khoảng 78% thể tích không khí; nitrogen có trong protein, nucleic acid.',
            'Liên kết ba N≡N rất bền (khoảng 945 kJ/mol) ⇒ N₂ trơ ở nhiệt độ thường.',
            'Tính oxi hóa: N₂ + 3H₂ ⇌ 2NH₃; tính khử: N₂ + O₂ ⇌ 2NO (nhiệt độ rất cao).',
            'Ứng dụng: khí bảo quản, nitrogen lỏng làm lạnh, nguyên liệu tổng hợp ammonia.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Nitrogen trơ vì là khí hiếm.', right: 'Nitrogen thuộc nhóm VA, **không phải khí hiếm**; tính trơ do liên kết ba bền.' },
            { wrong: 'N₂ cháy trong O₂ tạo NO₂.', right: 'Ở nhiệt độ rất cao, N₂ + O₂ ⇌ **2NO**; NO sau đó mới bị oxi hóa thành NO₂.' },
            { wrong: 'Trong N₂ + O₂, nitrogen là chất oxi hóa.', right: 'N: 0 → +2: nitrogen là **chất khử**.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Ammonia. Muối ammonium**.'
        }
      ]
    }
  ]
}
