// Hóa học 10 · Chương 5 · Bài 18 — Ôn tập chương 5 (Năng lượng hóa học).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l18',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa phản ứng tỏa nhiệt, thu nhiệt, điều kiện chuẩn, enthalpy tạo thành và biến thiên enthalpy.',
    'Vận dụng tính ΔrH°298 và nhiệt lượng tỏa ra hay thu vào theo lượng chất.'
  ],
  prerequisites: [
    'Bài 17: Biến thiên enthalpy trong các phản ứng hóa học.',
    'Tính số mol từ khối lượng: n = m / M.'
  ],
  sources: [
    programme('Năng lượng hóa học'),
    textbook(10, 18),
    'ΔfH°298: bảng NIST/CRC; năng lượng liên kết trung bình: C–H 414, O=O 498, C=O (trong CO₂) 799, O–H 464 kJ/mol.'
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
          text: 'Một bình gas mini chứa khoảng 220 g butane. Muốn biết bình gas đó nấu được bao nhiêu nồi nước, em cần biết lượng nhiệt mà mỗi mol nhiên liệu tỏa ra. Bài ôn tập này luyện chuyển từ ΔrH sang nhiệt lượng thực tế.'
        },
        {
          type: 'list',
          items: [
            'Nhìn lại toàn bộ kiến thức chương 5.',
            'Tính ΔrH bằng hai cách và so sánh kết quả.',
            'Tính nhiệt lượng theo khối lượng chất phản ứng.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 5',
      blocks: [
        {
          type: 'table',
          caption: 'Năng lượng hóa học',
          head: ['Nội dung', 'Ghi nhớ'],
          rows: [
            ['Tỏa nhiệt / thu nhiệt', 'ΔrH < 0 / ΔrH > 0'],
            ['Điều kiện chuẩn', '1 bar, 1 mol/L (chất tan), thường 298 K'],
            ['ΔfH°298', 'Tạo 1 mol chất từ đơn chất bền; đơn chất bền: 0'],
            ['Từ ΔfH', 'ΔrH = Σ ΔfH(sp) − Σ ΔfH(cđ)'],
            ['Từ năng lượng liên kết', 'ΔrH = Σ Eb(cđ) − Σ Eb(sp), các chất ở thể khí'],
            ['Nhiệt lượng theo lượng chất', 'Q = n × |ΔrH| / (hệ số của chất trong phương trình)']
          ]
        }
      ]
    },
    {
      id: 'example-ethylene',
      kind: 'example',
      title: 'Ví dụ 1 — Đốt cháy ethylene',
      blocks: [
        {
          type: 'worked',
          problem: 'Tính ΔrH°298 của phản ứng C₂H₄(g) + 3O₂(g) → 2CO₂(g) + 2H₂O(l). Cho ΔfH°298 (kJ/mol): C₂H₄(g) +52,4; CO₂(g) −393,5; H₂O(l) −285,8.',
          steps: [
            'Sản phẩm: 2 × (−393,5) + 2 × (−285,8) = −787,0 − 571,6 = −1358,6 kJ.',
            'Chất đầu: +52,4 + 3 × 0 = +52,4 kJ.',
            'ΔrH°298 = −1358,6 − 52,4 = −1411,0 kJ.'
          ],
          answer: 'ΔrH°298 = −1411,0 kJ: phản ứng tỏa nhiệt mạnh.',
          equations: ['C₂H₄(g) + 3O₂(g) → 2CO₂(g) + 2H₂O(l)']
        }
      ]
    },
    {
      id: 'example-heat',
      kind: 'example',
      title: 'Ví dụ 2 — Nhiệt lượng tỏa ra theo khối lượng',
      blocks: [
        {
          type: 'worked',
          problem: 'Đốt cháy hoàn toàn 3,2 g CH₄ theo phản ứng CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l), ΔrH°298 = −890,3 kJ. Tính nhiệt lượng tỏa ra (C = 12, H = 1).',
          steps: [
            'M(CH₄) = 12 + 4 = 16 g/mol ⇒ n(CH₄) = 3,2 / 16 = 0,2 mol.',
            'Theo phương trình, 1 mol CH₄ tỏa ra 890,3 kJ.',
            'Q = 0,2 × 890,3 = 178,06 kJ.'
          ],
          answer: 'Nhiệt lượng tỏa ra ≈ 178,1 kJ.'
        }
      ]
    },
    {
      id: 'example-bonds',
      kind: 'example',
      title: 'Ví dụ 3 — So sánh hai cách tính',
      blocks: [
        {
          type: 'worked',
          problem: 'Dùng năng lượng liên kết (kJ/mol: C–H 414; O=O 498; C=O trong CO₂ 799; O–H 464) tính ΔrH°298 của CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g). So sánh với giá trị từ enthalpy tạo thành (ΔfH: CH₄ −74,8; CO₂ −393,5; H₂O(g) −241,8).',
          steps: [
            'Chất đầu: 4 × 414 + 2 × 498 = 1656 + 996 = 2652 kJ.',
            'Sản phẩm: 2 × 799 + 4 × 464 = 1598 + 1856 = 3454 kJ.',
            'Theo năng lượng liên kết: ΔrH = 2652 − 3454 = −802 kJ.',
            'Theo ΔfH: (−393,5 + 2 × (−241,8)) − (−74,8) = −877,1 + 74,8 = −802,3 kJ.'
          ],
          answer: 'Hai cách cho kết quả gần như trùng nhau (−802 kJ và −802,3 kJ). Lưu ý nước ở thể khí nên khác −890,3 kJ của ví dụ 2.',
          equations: ['CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g)']
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
          id: 'g10-l18-c1',
          question: 'Phản ứng N₂(g) + O₂(g) → 2NO(g) có ΔrH°298 = +180,6 kJ. Nhận xét nào đúng?',
          options: [
            { id: 'a', text: 'Phản ứng tỏa nhiệt, xảy ra dễ dàng ở nhiệt độ thường.' },
            { id: 'b', text: 'Phản ứng thu nhiệt; enthalpy tạo thành của NO là +90,3 kJ/mol.' },
            { id: 'c', text: 'Phản ứng thu nhiệt; enthalpy tạo thành của NO là +180,6 kJ/mol.' },
            { id: 'd', text: 'Phản ứng không có biến thiên enthalpy.' }
          ],
          correct: 'b',
          explanation: 'ΔrH > 0 nên thu nhiệt. Phương trình tạo 2 mol NO nên ΔfH(NO) = 180,6 / 2 = +90,3 kJ/mol.'
        },
        {
          type: 'quiz',
          id: 'g10-l18-c2',
          question: 'Đốt 0,5 mol CH₄ (ΔrH°298 = −890,3 kJ cho 1 mol CH₄) tỏa ra khoảng',
          options: [
            { id: 'a', text: '890,3 kJ' },
            { id: 'b', text: '445,2 kJ' },
            { id: 'c', text: '1780,6 kJ' },
            { id: 'd', text: '222,6 kJ' }
          ],
          correct: 'b',
          explanation: 'Q = 0,5 × 890,3 ≈ 445,2 kJ.'
        },
        {
          type: 'quiz',
          id: 'g10-l18-c3',
          question: 'Phản ứng A → B có ΔrH = −50 kJ. Phản ứng B → A có ΔrH bằng',
          options: [
            { id: 'a', text: '−50 kJ' },
            { id: 'b', text: '+50 kJ' },
            { id: 'c', text: '0' },
            { id: 'd', text: '−100 kJ' }
          ],
          correct: 'b',
          explanation: 'Đảo chiều phản ứng thì ΔrH đổi dấu, giữ nguyên độ lớn.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 5',
      blocks: [
        {
          type: 'list',
          items: [
            'Đọc dấu ΔrH để biết tỏa hay thu nhiệt; độ lớn cho biết lượng nhiệt theo đúng số mol trong phương trình.',
            'Tính ΔrH từ ΔfH (chú ý trạng thái chất) hoặc từ năng lượng liên kết (thể khí).',
            'Nhiệt lượng thực tế: đổi lượng chất ra mol, nhân với nhiệt ứng với 1 mol chất đó.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'ΔfH(NO) = +180,6 kJ/mol vì phản ứng N₂ + O₂ → 2NO có ΔrH = +180,6 kJ.', right: 'Phương trình tạo **2 mol** NO nên ΔfH(NO) = **+90,3** kJ/mol.' },
            { wrong: 'Nhiệt lượng có dấu âm khi phản ứng tỏa nhiệt.', right: 'Nhiệt lượng Q là **độ lớn** năng lượng tỏa ra; dấu âm thuộc về ΔrH.' },
            { wrong: 'Dùng ΔrH của phản ứng tạo H₂O(l) cho đề bài tạo H₂O(g).', right: 'Trạng thái của nước làm ΔrH khác nhau: −890,3 kJ (lỏng) và **−802,3 kJ** (khí).' }
          ]
        },
        {
          type: 'p',
          text: 'Chương tiếp theo: **Tốc độ phản ứng**.'
        }
      ]
    }
  ]
}
