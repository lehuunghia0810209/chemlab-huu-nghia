// Hóa học 10 · Chương 4 · Bài 15 — Phản ứng oxi hóa – khử.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l15',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm và xác định được số oxi hóa của nguyên tử các nguyên tố trong hợp chất.',
    'Nêu được khái niệm phản ứng oxi hóa – khử, chất oxi hóa, chất khử, quá trình oxi hóa, quá trình khử và ý nghĩa của phản ứng oxi hóa – khử.',
    'Mô tả được một số phản ứng oxi hóa – khử quan trọng gắn liền với cuộc sống.',
    'Cân bằng được phản ứng oxi hóa – khử bằng phương pháp thăng bằng electron.'
  ],
  prerequisites: [
    'Chương 3: ion, liên kết ion, liên kết cộng hóa trị phân cực.',
    'Độ âm điện: nguyên tử có độ âm điện lớn hơn hút cặp electron chung về phía mình.'
  ],
  sources: [
    programme('Phản ứng oxi hóa – khử'),
    textbook(10, 15)
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
          text: 'Đinh sắt để ngoài trời bị gỉ, bếp gas cháy cho nhiệt, cơ thể “đốt” glucose để có năng lượng, chiếc điện thoại chạy bằng pin. Những quá trình rất khác nhau ấy có một điểm chung: electron được chuyển từ chất này sang chất khác. Làm sao nhận ra và viết đúng các phản ứng đó?'
        },
        {
          type: 'list',
          items: [
            'Xác định số oxi hóa của nguyên tố trong đơn chất, hợp chất, ion.',
            'Nhận ra chất oxi hóa, chất khử, quá trình oxi hóa, quá trình khử.',
            'Cân bằng phương trình oxi hóa – khử bằng phương pháp thăng bằng electron.',
            'Nêu các phản ứng oxi hóa – khử quan trọng trong đời sống và sản xuất.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Kim loại có xu hướng nhường electron, phi kim có xu hướng nhận electron.', 'Hợp chất trung hòa điện; ion mang điện tích.'] }
      ]
    },
    {
      id: 'oxidation-number',
      kind: 'concept',
      title: 'Số oxi hóa',
      blocks: [
        {
          type: 'callout',
          title: 'Số oxi hóa',
          text: 'Là **điện tích quy ước** của nguyên tử trong phân tử, khi giả định rằng mọi liên kết đều là liên kết ion (cặp electron chung thuộc hẳn về nguyên tử có độ âm điện lớn hơn). Viết dấu trước, số sau, đặt phía trên kí hiệu: ví dụ Fe⁺³ trong Fe₂O₃.'
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Trong đơn chất, số oxi hóa của nguyên tố bằng 0: Na, Fe, H₂, O₂, Cl₂.',
            'Trong hợp chất, số oxi hóa của H thường là +1 (trừ hydride kim loại như NaH: −1); của O thường là −2 (trừ peroxide như H₂O₂: −1; OF₂: +2).',
            'Kim loại nhóm IA luôn là +1, nhóm IIA là +2, Al là +3 trong hợp chất.',
            'Tổng số oxi hóa của các nguyên tử trong phân tử bằng 0; trong ion bằng điện tích của ion.'
          ]
        }
      ]
    },
    {
      id: 'example-oxidation',
      kind: 'example',
      title: 'Ví dụ 1 — Xác định số oxi hóa',
      blocks: [
        {
          type: 'worked',
          problem: 'Xác định số oxi hóa của S trong H₂S, SO₂, H₂SO₄; của Mn trong KMnO₄; của N trong NH₄⁺ và NO₃⁻.',
          table: {
            caption: 'Gọi số oxi hóa cần tìm là x',
            head: ['Chất', 'Phương trình', 'x'],
            rows: [
              ['H₂S', '2(+1) + x = 0', '−2'],
              ['SO₂', 'x + 2(−2) = 0', '+4'],
              ['H₂SO₄', '2(+1) + x + 4(−2) = 0', '+6'],
              ['KMnO₄', '(+1) + x + 4(−2) = 0', '+7'],
              ['NH₄⁺', 'x + 4(+1) = +1', '−3'],
              ['NO₃⁻', 'x + 3(−2) = −1', '+5']
            ]
          },
          steps: [
            'Gán số oxi hóa đã biết: H = +1, O = −2, K = +1.',
            'Lập phương trình tổng số oxi hóa = 0 (phân tử) hoặc = điện tích (ion), rồi giải tìm x.'
          ],
          answer: 'S: −2, +4, +6; Mn: +7; N: −3 (NH₄⁺), +5 (NO₃⁻). Một nguyên tố có thể có nhiều số oxi hóa khác nhau.'
        }
      ]
    },
    {
      id: 'redox',
      kind: 'concept',
      title: 'Chất oxi hóa, chất khử và phản ứng oxi hóa – khử',
      blocks: [
        {
          type: 'table',
          caption: 'Các khái niệm cần phân biệt',
          head: ['', 'Chất khử', 'Chất oxi hóa'],
          rows: [
            ['Electron', 'Nhường electron', 'Nhận electron'],
            ['Số oxi hóa', 'Tăng', 'Giảm'],
            ['Quá trình xảy ra với nó', 'Quá trình oxi hóa (bị oxi hóa)', 'Quá trình khử (bị khử)']
          ]
        },
        {
          type: 'callout',
          title: 'Phản ứng oxi hóa – khử',
          text: 'Là phản ứng hóa học trong đó có sự **chuyển electron** giữa các chất, hay có sự **thay đổi số oxi hóa** của một số nguyên tố.'
        },
        { type: 'equation', text: 'Fe + CuSO₄ → FeSO₄ + Cu' },
        { type: 'equation', text: 'Fe → Fe²⁺ + 2e', note: 'Quá trình oxi hóa: Fe là chất khử (0 → +2).' },
        { type: 'equation', text: 'Cu²⁺ + 2e → Cu', note: 'Quá trình khử: Cu²⁺ (trong CuSO₄) là chất oxi hóa (+2 → 0).' },
        {
          type: 'callout',
          tone: 'note',
          title: 'Mẹo nhớ',
          text: '“Khử cho – O nhận”: chất **khử cho** electron, chất **o**xi hóa **nhận** electron. Chất khử bị oxi hóa, chất oxi hóa bị khử.'
        }
      ]
    },
    {
      id: 'balancing',
      kind: 'concept',
      title: 'Cân bằng bằng phương pháp thăng bằng electron',
      blocks: [
        {
          type: 'p',
          text: 'Nguyên tắc: **tổng số electron chất khử nhường = tổng số electron chất oxi hóa nhận**.'
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Xác định số oxi hóa, tìm các nguyên tố có số oxi hóa thay đổi; chỉ ra chất oxi hóa, chất khử.',
            'Viết quá trình oxi hóa và quá trình khử.',
            'Tìm hệ số sao cho số electron nhường bằng số electron nhận (nhân chéo, rút gọn).',
            'Đặt hệ số vào phương trình, cân bằng các nguyên tố còn lại theo thứ tự: kim loại → phi kim → H → O (kiểm tra).'
          ]
        },
        {
          type: 'worked',
          problem: 'Cân bằng: Fe₂O₃ + CO → Fe + CO₂ (nung nóng).',
          steps: [
            'Số oxi hóa thay đổi: Fe +3 → 0 (Fe₂O₃ là chất oxi hóa); C +2 → +4 (CO là chất khử).',
            'Quá trình khử: 2Fe⁺³ + 6e → 2Fe⁰ (×1). Quá trình oxi hóa: C⁺² → C⁺⁴ + 2e (×3).',
            'Đặt hệ số: 1 Fe₂O₃, 3 CO, 2 Fe, 3 CO₂. Kiểm tra O: 3 + 3 = 6 = 3 × 2.'
          ],
          answer: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂ (phản ứng trong lò luyện gang).',
          equations: ['Fe₂O₃ + 3CO → 2Fe + 3CO₂']
        }
      ]
    },
    {
      id: 'example-balance',
      kind: 'example',
      title: 'Ví dụ 2 — Cân bằng phản ứng có môi trường',
      blocks: [
        {
          type: 'worked',
          problem: 'Cân bằng: Cu + HNO₃ (loãng) → Cu(NO₃)₂ + NO + H₂O.',
          steps: [
            'Cu 0 → +2 (chất khử); N +5 → +2 trong NO (HNO₃ là chất oxi hóa).',
            'Cu⁰ → Cu⁺² + 2e (×3); N⁺⁵ + 3e → N⁺² (×2).',
            'Có 3Cu và 2NO. Số N trong Cu(NO₃)₂ là 3 × 2 = 6, cộng 2 N trong NO ⇒ cần 8HNO₃.',
            'H: 8 nguyên tử H ⇒ 4H₂O. Kiểm tra O: 24 = 18 + 2 + 4.'
          ],
          answer: '3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O. Chỉ 2 trong 8 phân tử HNO₃ đóng vai trò chất oxi hóa; 6 phân tử còn lại là môi trường tạo muối.',
          equations: ['3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O']
        },
        {
          type: 'worked',
          problem: 'Cân bằng phản ứng trong thí nghiệm ở phòng thí nghiệm ảo: FeSO₄ + KMnO₄ + H₂SO₄ → Fe₂(SO₄)₃ + K₂SO₄ + MnSO₄ + H₂O.',
          steps: [
            'Fe +2 → +3 (FeSO₄ là chất khử); Mn +7 → +2 (KMnO₄ là chất oxi hóa).',
            '2Fe⁺² → 2Fe⁺³ + 2e (×5); Mn⁺⁷ + 5e → Mn⁺² (×2).',
            'Hệ số: 10FeSO₄, 2KMnO₄ → 5Fe₂(SO₄)₃, 2MnSO₄, 1K₂SO₄.',
            'Cân bằng S: vế phải có 15 + 1 + 2 = 18 ⇒ cần thêm 8H₂SO₄; H: 16 ⇒ 8H₂O.'
          ],
          answer: '10FeSO₄ + 2KMnO₄ + 8H₂SO₄ → 5Fe₂(SO₄)₃ + K₂SO₄ + 2MnSO₄ + 8H₂O. Dạng ion thu gọn: MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O; màu tím của MnO₄⁻ mất dần.',
          equations: [
            '10FeSO₄ + 2KMnO₄ + 8H₂SO₄ → 5Fe₂(SO₄)₃ + K₂SO₄ + 2MnSO₄ + 8H₂O',
            'MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O'
          ]
        }
      ]
    },
    {
      id: 'importance',
      kind: 'concept',
      title: 'Phản ứng oxi hóa – khử trong đời sống',
      blocks: [
        { type: 'equation', text: 'CH₄ + 2O₂ → CO₂ + 2H₂O', condition: 't°', note: 'Đốt nhiên liệu (khí thiên nhiên) cung cấp năng lượng.' },
        { type: 'equation', text: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O', note: 'Hô hấp tế bào: glucose bị oxi hóa, giải phóng năng lượng cho cơ thể.' },
        { type: 'equation', text: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂', condition: 't°', note: 'Luyện gang: khử iron oxide.' },
        {
          type: 'list',
          items: [
            'Có lợi: đốt cháy nhiên liệu, hô hấp, quang hợp, sản xuất kim loại, pin và acquy.',
            'Có hại: sự gỉ sét, ăn mòn kim loại, thực phẩm bị ôi do oxi hóa, cháy nổ không kiểm soát.'
          ]
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: Fe²⁺ khử MnO₄⁻',
      blocks: [
        {
          type: 'p',
          text: 'Trong phòng thí nghiệm ảo, cho FeSO₄, H₂SO₄ rồi KMnO₄ vào cốc. Dự đoán trước màu tím của KMnO₄ sẽ thay đổi thế nào, rồi đối chiếu với phương trình ở ví dụ 2.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Oxi hóa – khử với permanganate',
          text: 'Mở trong Phòng thí nghiệm ảo. Khi quay lại mục Học tập, em vẫn ở đúng bước này.',
          action: { kind: 'guided', grade: 10, lessonId: 'g10-l15', experimentId: 'g10-redox-permanganate' }
        },
        {
          type: 'activity',
          title: 'Công cụ — Cân bằng phương trình',
          text: 'Nhập phương trình chưa cân bằng để kiểm tra hệ số em tìm được.',
          action: { kind: 'tool', tool: 'balancer' }
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
          id: 'g10-l15-c1',
          question: 'Số oxi hóa của Cr trong K₂Cr₂O₇ là',
          options: [
            { id: 'a', text: '+3' },
            { id: 'b', text: '+6' },
            { id: 'c', text: '+7' },
            { id: 'd', text: '+12' }
          ],
          correct: 'b',
          explanation: '2(+1) + 2x + 7(−2) = 0 ⇒ 2x = 12 ⇒ x = +6.'
        },
        {
          type: 'quiz',
          id: 'g10-l15-c2',
          question: 'Trong phản ứng Zn + 2HCl → ZnCl₂ + H₂, chất khử là',
          options: [
            { id: 'a', text: 'Zn' },
            { id: 'b', text: 'HCl' },
            { id: 'c', text: 'ZnCl₂' },
            { id: 'd', text: 'H₂' }
          ],
          correct: 'a',
          explanation: 'Zn: 0 → +2, nhường electron nên là chất khử; H trong HCl: +1 → 0, HCl là chất oxi hóa.'
        },
        {
          type: 'quiz',
          id: 'g10-l15-c3',
          question: 'Quá trình oxi hóa là quá trình',
          options: [
            { id: 'a', text: 'nhận electron' },
            { id: 'b', text: 'nhường electron' },
            { id: 'c', text: 'làm giảm số oxi hóa' },
            { id: 'd', text: 'tạo ra kết tủa' }
          ],
          correct: 'b',
          explanation: 'Chất khử nhường electron, số oxi hóa tăng: nó bị oxi hóa.'
        },
        {
          type: 'quiz',
          id: 'g10-l15-c4',
          question: 'Phản ứng nào không phải là phản ứng oxi hóa – khử?',
          options: [
            { id: 'a', text: 'CaCO₃ → CaO + CO₂' },
            { id: 'b', text: '2Na + Cl₂ → 2NaCl' },
            { id: 'c', text: 'Fe + CuSO₄ → FeSO₄ + Cu' },
            { id: 'd', text: '2H₂ + O₂ → 2H₂O' }
          ],
          correct: 'a',
          explanation: 'Trong CaCO₃ → CaO + CO₂, số oxi hóa của Ca (+2), C (+4), O (−2) không đổi.'
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
            'Số oxi hóa: đơn chất = 0; H thường +1, O thường −2; tổng trong phân tử = 0, trong ion = điện tích ion.',
            'Chất khử nhường e (số oxi hóa tăng, bị oxi hóa); chất oxi hóa nhận e (số oxi hóa giảm, bị khử).',
            'Thăng bằng electron: tổng e nhường = tổng e nhận.',
            'Phản ứng oxi hóa – khử có mặt trong đốt cháy, hô hấp, luyện kim, pin; và cả trong gỉ sét, ăn mòn.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Chất oxi hóa là chất bị oxi hóa.', right: 'Chất oxi hóa **bị khử** (nhận electron); chất khử mới bị oxi hóa.' },
            { wrong: 'Số oxi hóa của O trong H₂O₂ là −2.', right: 'H₂O₂ là peroxide: O có số oxi hóa **−1**.' },
            { wrong: 'Hệ số của HNO₃ bằng số phân tử HNO₃ nhận electron.', right: 'Phải cộng thêm phần HNO₃ làm **môi trường** tạo muối: 3Cu cần 8HNO₃ dù chỉ 2HNO₃ bị khử.' },
            { wrong: 'Viết số oxi hóa giống điện tích ion: Fe³⁺ trong Fe₂O₃.', right: 'Số oxi hóa viết **dấu trước, số sau**: Fe⁺³; điện tích ion viết số trước, dấu sau: Fe³⁺.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Ôn tập chương 4**.'
        }
      ]
    }
  ]
}
