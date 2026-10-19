// Hóa học 10 · Chương 5 · Bài 17 — Biến thiên enthalpy trong các phản ứng hóa học.
// ΔfH°298 values: NIST/CRC standard tables (kJ/mol, rounded to 0,1).
// Bond energies: common textbook mean values (kJ/mol).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export const FORMATION_ENTHALPY = {
  'CO₂(g)': -393.5,
  'H₂O(l)': -285.8,
  'H₂O(g)': -241.8,
  'CH₄(g)': -74.8,
  'C₂H₄(g)': 52.4,
  'NH₃(g)': -45.9,
  'NO(g)': 90.3,
  'CaCO₃(s)': -1206.9,
  'CaO(s)': -635.1,
  'NaCl(s)': -411.2
}

const kj = value => `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toFixed(1).replace('.', ',')}`

export default {
  id: 'g10-l17',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Trình bày được khái niệm phản ứng tỏa nhiệt, thu nhiệt; điều kiện chuẩn (áp suất 1 bar, thường chọn nhiệt độ 25 °C hay 298 K).',
    'Trình bày được khái niệm enthalpy tạo thành (nhiệt tạo thành) ΔfH°298 và biến thiên enthalpy (nhiệt phản ứng) ΔrH°298.',
    'Nêu được ý nghĩa của dấu và giá trị ΔrH°298; biểu diễn được sơ đồ biến thiên enthalpy của phản ứng.',
    'Tính được ΔrH°298 của một phản ứng dựa vào bảng số liệu năng lượng liên kết hoặc enthalpy tạo thành.'
  ],
  prerequisites: [
    'Bài 12: năng lượng liên kết.',
    'Viết và cân bằng phương trình hóa học; trạng thái chất (s), (l), (g), (aq).'
  ],
  sources: [
    programme('Năng lượng hóa học'),
    textbook(10, 17),
    'Enthalpy tạo thành chuẩn ΔfH°298: bảng NIST/CRC (làm tròn 0,1 kJ/mol); năng lượng liên kết: giá trị trung bình thường dùng trong sách giáo khoa.'
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
          text: 'Đốt khí gas để nấu ăn thì nóng lên, còn túi chườm lạnh (ammonium nitrate hòa tan trong nước) lại lạnh đi. Làm sao đo và so sánh lượng nhiệt mà mỗi phản ứng tỏa ra hay hấp thụ?'
        },
        {
          type: 'list',
          items: [
            'Phân biệt phản ứng tỏa nhiệt và thu nhiệt; đọc dấu của ΔrH.',
            'Hiểu điều kiện chuẩn, enthalpy tạo thành ΔfH°298 và phương trình nhiệt hóa học.',
            'Tính ΔrH°298 từ enthalpy tạo thành và từ năng lượng liên kết.',
            'Vẽ sơ đồ biến thiên enthalpy.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Năng lượng liên kết: năng lượng cần để phá vỡ 1 mol liên kết ở thể khí.', 'Cân bằng phương trình hóa học.'] }
      ]
    },
    {
      id: 'exo-endo',
      kind: 'concept',
      title: 'Phản ứng tỏa nhiệt và thu nhiệt',
      blocks: [
        {
          type: 'table',
          caption: 'Hai loại phản ứng',
          head: ['', 'Tỏa nhiệt', 'Thu nhiệt'],
          rows: [
            ['Năng lượng', 'Giải phóng ra môi trường', 'Lấy từ môi trường'],
            ['Môi trường xung quanh', 'Nóng lên', 'Lạnh đi (hoặc cần đun liên tục)'],
            ['Dấu ΔrH', 'Âm (ΔrH < 0)', 'Dương (ΔrH > 0)'],
            ['Ví dụ', 'Đốt cháy nhiên liệu, phản ứng trung hòa', 'Nung đá vôi, nhiệt phân KMnO₄']
          ]
        },
        { type: 'figure', figure: 'enthalpy-diagram' },
        {
          type: 'p',
          text: '**Biến thiên enthalpy** (nhiệt phản ứng) ΔrH là nhiệt lượng tỏa ra hay thu vào của phản ứng ở áp suất không đổi, tính theo số mol các chất trong phương trình (đơn vị kJ).'
        }
      ]
    },
    {
      id: 'standard',
      kind: 'concept',
      title: 'Điều kiện chuẩn và enthalpy tạo thành',
      blocks: [
        {
          type: 'callout',
          title: 'Điều kiện chuẩn',
          text: 'Áp suất **1 bar** (với chất khí), nồng độ 1 mol/L (với chất tan), thường chọn nhiệt độ **25 °C (298 K)**. Kí hiệu ° chỉ điều kiện chuẩn: ΔrH°298.'
        },
        {
          type: 'p',
          text: '**Enthalpy tạo thành chuẩn** ΔfH°298 của một chất là biến thiên enthalpy khi tạo thành 1 mol chất đó từ các đơn chất bền nhất ở điều kiện chuẩn. ΔfH°298 của **đơn chất bền** (O₂(g), H₂(g), C(graphite), Fe(s)…) **bằng 0**.'
        },
        {
          type: 'table',
          caption: 'Enthalpy tạo thành chuẩn ΔfH°298 (kJ/mol)',
          head: ['Chất', 'ΔfH°298', 'Chất', 'ΔfH°298'],
          rows: [
            ['CO₂(g)', kj(FORMATION_ENTHALPY['CO₂(g)']), 'CH₄(g)', kj(FORMATION_ENTHALPY['CH₄(g)'])],
            ['H₂O(l)', kj(FORMATION_ENTHALPY['H₂O(l)']), 'C₂H₄(g)', kj(FORMATION_ENTHALPY['C₂H₄(g)'])],
            ['H₂O(g)', kj(FORMATION_ENTHALPY['H₂O(g)']), 'NH₃(g)', kj(FORMATION_ENTHALPY['NH₃(g)'])],
            ['CaCO₃(s)', kj(FORMATION_ENTHALPY['CaCO₃(s)']), 'NO(g)', kj(FORMATION_ENTHALPY['NO(g)'])],
            ['CaO(s)', kj(FORMATION_ENTHALPY['CaO(s)']), 'NaCl(s)', kj(FORMATION_ENTHALPY['NaCl(s)'])]
          ]
        },
        { type: 'heading', text: 'Phương trình nhiệt hóa học' },
        {
          type: 'equation',
          text: '2H₂(g) + O₂(g) → 2H₂O(l)',
          note: 'ΔrH°298 = −571,6 kJ. Ghi rõ trạng thái các chất và ΔrH ứng với đúng các hệ số trong phương trình.'
        },
        {
          type: 'p',
          text: 'Nếu nhân các hệ số lên k lần thì ΔrH cũng nhân k lần; nếu viết phản ứng theo chiều ngược lại thì ΔrH đổi dấu.'
        }
      ]
    },
    {
      id: 'from-formation',
      kind: 'example',
      title: 'Ví dụ 1 — Tính ΔrH từ enthalpy tạo thành',
      blocks: [
        {
          type: 'equation',
          text: 'ΔrH°298 = Σ ΔfH°298(sản phẩm) − Σ ΔfH°298(chất đầu)',
          note: 'Mỗi ΔfH nhân với hệ số của chất trong phương trình.',
          check: false
        },
        {
          type: 'worked',
          problem: 'Tính ΔrH°298 của phản ứng đốt cháy methane: CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l). Phản ứng tỏa nhiệt hay thu nhiệt?',
          steps: [
            'Sản phẩm: ΔfH(CO₂) + 2ΔfH(H₂O, l) = −393,5 + 2 × (−285,8) = −965,1 kJ.',
            'Chất đầu: ΔfH(CH₄) + 2ΔfH(O₂) = −74,8 + 2 × 0 = −74,8 kJ.',
            'ΔrH°298 = −965,1 − (−74,8) = −890,3 kJ.'
          ],
          answer: 'ΔrH°298 = −890,3 kJ < 0: phản ứng tỏa nhiệt; đốt 1 mol CH₄ tỏa ra 890,3 kJ.',
          equations: ['CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(l)']
        },
        {
          type: 'worked',
          problem: 'Tính ΔrH°298 của phản ứng nung đá vôi: CaCO₃(s) → CaO(s) + CO₂(g).',
          steps: [
            'ΔrH°298 = [ΔfH(CaO) + ΔfH(CO₂)] − ΔfH(CaCO₃).',
            '= (−635,1 − 393,5) − (−1206,9) = −1028,6 + 1206,9 = +178,3 kJ.'
          ],
          answer: 'ΔrH°298 = +178,3 kJ > 0: phản ứng thu nhiệt, vì vậy lò vôi phải được đốt nóng liên tục.',
          equations: ['CaCO₃(s) → CaO(s) + CO₂(g)']
        }
      ]
    },
    {
      id: 'from-bonds',
      kind: 'example',
      title: 'Ví dụ 2 — Tính ΔrH từ năng lượng liên kết',
      blocks: [
        {
          type: 'equation',
          text: 'ΔrH°298 = Σ Eb(chất đầu) − Σ Eb(sản phẩm)',
          note: 'Chỉ áp dụng cho phản ứng mà các chất đều ở thể khí. Phá vỡ liên kết cần năng lượng, hình thành liên kết giải phóng năng lượng.',
          check: false
        },
        {
          type: 'worked',
          problem: 'Tính ΔrH°298 của phản ứng H₂(g) + Cl₂(g) → 2HCl(g). Cho Eb (kJ/mol): H–H 436; Cl–Cl 243; H–Cl 432.',
          steps: [
            'Phá vỡ liên kết ở chất đầu: 1 × 436 + 1 × 243 = 679 kJ.',
            'Hình thành liên kết ở sản phẩm: 2 × 432 = 864 kJ.',
            'ΔrH°298 = 679 − 864 = −185 kJ.'
          ],
          answer: 'ΔrH°298 ≈ −185 kJ: phản ứng tỏa nhiệt (giá trị đo thực nghiệm khoảng −184,6 kJ).',
          equations: ['H₂(g) + Cl₂(g) → 2HCl(g)']
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Chú ý thứ tự phép trừ',
          text: 'Với enthalpy tạo thành: **sản phẩm trừ chất đầu**. Với năng lượng liên kết: **chất đầu trừ sản phẩm**. Kết quả tính từ năng lượng liên kết chỉ là gần đúng vì Eb là giá trị trung bình.'
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
          id: 'g10-l17-c1',
          question: 'Phản ứng có ΔrH°298 = +178,3 kJ là phản ứng',
          options: [
            { id: 'a', text: 'tỏa nhiệt' },
            { id: 'b', text: 'thu nhiệt' },
            { id: 'c', text: 'không trao đổi nhiệt' },
            { id: 'd', text: 'oxi hóa – khử' }
          ],
          correct: 'b',
          explanation: 'ΔrH > 0: hệ nhận nhiệt từ môi trường.'
        },
        {
          type: 'quiz',
          id: 'g10-l17-c2',
          question: 'Chất nào có enthalpy tạo thành chuẩn bằng 0?',
          options: [
            { id: 'a', text: 'H₂O(l)' },
            { id: 'b', text: 'O₂(g)' },
            { id: 'c', text: 'CO₂(g)' },
            { id: 'd', text: 'O₃(g)' }
          ],
          correct: 'b',
          explanation: 'O₂(g) là dạng đơn chất bền nhất của oxygen; O₃ là đơn chất nhưng không phải dạng bền nhất nên ΔfH ≠ 0.'
        },
        {
          type: 'quiz',
          id: 'g10-l17-c3',
          question: 'Biết 2H₂(g) + O₂(g) → 2H₂O(l) có ΔrH°298 = −571,6 kJ. ΔrH°298 của phản ứng H₂(g) + ½O₂(g) → H₂O(l) là',
          options: [
            { id: 'a', text: '−571,6 kJ' },
            { id: 'b', text: '−285,8 kJ' },
            { id: 'c', text: '+285,8 kJ' },
            { id: 'd', text: '−1143,2 kJ' }
          ],
          correct: 'b',
          explanation: 'Hệ số giảm một nửa thì ΔrH cũng giảm một nửa: −571,6 / 2 = −285,8 kJ (chính là ΔfH của H₂O lỏng).'
        },
        {
          type: 'quiz',
          id: 'g10-l17-c4',
          question: 'Điều kiện chuẩn dùng cho ΔrH°298 gồm',
          options: [
            { id: 'a', text: '0 °C và 1 atm' },
            { id: 'b', text: '25 °C (298 K) và áp suất 1 bar' },
            { id: 'c', text: '100 °C và 1 bar' },
            { id: 'd', text: '25 °C và 10 bar' }
          ],
          correct: 'b',
          explanation: 'Điều kiện chuẩn: áp suất 1 bar, nồng độ 1 mol/L, nhiệt độ thường chọn là 298 K.'
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
            'ΔrH < 0: tỏa nhiệt; ΔrH > 0: thu nhiệt. Điều kiện chuẩn: 1 bar, 298 K.',
            'ΔfH°298 của đơn chất bền = 0.',
            'ΔrH°298 = Σ ΔfH(sản phẩm) − Σ ΔfH(chất đầu).',
            'ΔrH°298 = Σ Eb(chất đầu) − Σ Eb(sản phẩm) (các chất ở thể khí).',
            'Nhân hệ số ⇒ nhân ΔrH; đảo chiều phản ứng ⇒ đổi dấu ΔrH.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'ΔrH âm nghĩa là phản ứng thu nhiệt.', right: 'ΔrH **âm** nghĩa là hệ mất năng lượng: phản ứng **tỏa nhiệt**.' },
            { wrong: 'Quên nhân ΔfH với hệ số: dùng −285,8 cho 2H₂O.', right: 'Phải nhân hệ số: 2 × (−285,8) = **−571,6 kJ**.' },
            { wrong: 'Dùng ΔfH của H₂O(g) khi đề cho nước lỏng.', right: 'ΔfH phụ thuộc trạng thái: H₂O(l) −285,8; H₂O(g) **−241,8** kJ/mol.' },
            { wrong: 'Tính theo năng lượng liên kết bằng “sản phẩm trừ chất đầu”.', right: 'Với năng lượng liên kết dùng **chất đầu − sản phẩm**.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Ôn tập chương 5**.'
        }
      ]
    }
  ]
}
