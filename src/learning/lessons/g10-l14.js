// Hóa học 10 · Chương 3 · Bài 14 — Ôn tập chương 3 (Liên kết hóa học).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l14',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa quy tắc octet, liên kết ion, liên kết cộng hóa trị, liên kết hydrogen và tương tác van der Waals.',
    'Vận dụng để xác định loại liên kết, viết công thức, giải thích tính chất vật lí của chất.'
  ],
  prerequisites: [
    'Bài 10: Quy tắc octet.',
    'Bài 11–12: Liên kết ion, liên kết cộng hóa trị.',
    'Bài 13: Liên kết hydrogen và tương tác van der Waals.'
  ],
  sources: [
    programme('Liên kết hóa học'),
    textbook(10, 14)
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
          text: 'Muối ăn NaCl nóng chảy ở 801 °C, nước sôi ở 100 °C, còn khí methane CH₄ sôi ở khoảng −162 °C. Em có thể giải thích sự khác biệt lớn này chỉ bằng loại liên kết và tương tác trong mỗi chất không?'
        },
        {
          type: 'list',
          items: [
            'Hệ thống hóa các loại liên kết và tương tác trong một bảng.',
            'Luyện xác định loại liên kết bằng hiệu độ âm điện.',
            'Giải thích nhiệt độ nóng chảy, sôi dựa vào loại liên kết, tương tác.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 3',
      blocks: [
        {
          type: 'table',
          caption: 'Các loại liên kết và tương tác',
          head: ['Loại', 'Bản chất', 'Điều kiện thường gặp', 'Ví dụ'],
          rows: [
            ['Liên kết ion', 'Lực hút tĩnh điện giữa ion trái dấu', 'Kim loại điển hình – phi kim điển hình; Δχ ≥ 1,7', 'NaCl, MgO, CaF₂'],
            ['Cộng hóa trị không phân cực', 'Cặp electron chung không lệch', 'Δχ < 0,4', 'H₂, Cl₂, CH₄'],
            ['Cộng hóa trị phân cực', 'Cặp electron chung lệch về nguyên tử có χ lớn hơn', '0,4 ≤ Δχ < 1,7', 'HCl, H₂O, NH₃'],
            ['Liên kết hydrogen', 'H (gắn F, O, N) hút cặp electron riêng của F, O, N', 'Giữa các phân tử có F–H, O–H, N–H', 'H₂O, HF, NH₃, C₂H₅OH'],
            ['Tương tác van der Waals', 'Lực hút yếu giữa các lưỡng cực', 'Mọi phân tử', 'I₂, CH₄, khí hiếm']
          ]
        },
        {
          type: 'list',
          items: [
            'Quy tắc octet: nhường, nhận hoặc góp chung electron để có 8 electron lớp ngoài cùng (H: 2).',
            'Liên kết đơn = 1σ; đôi = 1σ + 1π; ba = 1σ + 2π. Năng lượng liên kết lớn ⇒ liên kết bền.'
          ]
        }
      ]
    },
    {
      id: 'example-bonds',
      kind: 'example',
      title: 'Ví dụ 1 — Xác định loại liên kết',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho độ âm điện: K 0,82; Br 2,96; N 3,04; H 2,20; O 3,44; S 2,58. Xác định loại liên kết trong KBr, NH₃, SO₂ (liên kết S–O).',
          table: {
            caption: 'Hiệu độ âm điện',
            head: ['Liên kết', 'Δχ', 'Loại liên kết'],
            rows: [
              ['K–Br', '2,96 − 0,82 = 2,14', 'Ion'],
              ['N–H', '3,04 − 2,20 = 0,84', 'Cộng hóa trị phân cực'],
              ['S–O', '3,44 − 2,58 = 0,86', 'Cộng hóa trị phân cực']
            ]
          },
          steps: [
            'Tính Δχ cho từng liên kết.',
            'So với mốc 0,4 và 1,7.'
          ],
          answer: 'KBr: liên kết ion; NH₃ và SO₂: liên kết cộng hóa trị phân cực.'
        }
      ]
    },
    {
      id: 'example-ionic',
      kind: 'example',
      title: 'Ví dụ 2 — Sự hình thành hợp chất ion',
      blocks: [
        {
          type: 'worked',
          problem: 'Nguyên tố X (Z = 19) và Y (Z = 16). Viết quá trình tạo ion, công thức hợp chất tạo bởi X và Y, và cho biết loại liên kết.',
          steps: [
            'X: 1s²2s²2p⁶3s²3p⁶4s¹ (K) nhường 1 electron: K → K⁺ + e.',
            'Y: 1s²2s²2p⁶3s²3p⁴ (S) nhận 2 electron: S + 2e → S²⁻.',
            'Trung hòa điện: 2 ion K⁺ với 1 ion S²⁻ ⇒ K₂S.'
          ],
          answer: 'K₂S, liên kết ion (kim loại kiềm và phi kim); phương trình 2K + S → K₂S.',
          equations: ['K → K⁺ + e', 'S + 2e → S²⁻', '2K + S → K₂S']
        }
      ]
    },
    {
      id: 'example-properties',
      kind: 'example',
      title: 'Ví dụ 3 — Giải thích nhiệt độ sôi, nóng chảy',
      blocks: [
        {
          type: 'worked',
          problem: 'Giải thích vì sao nhiệt độ nóng chảy hoặc sôi giảm theo thứ tự NaCl (nóng chảy 801 °C) > H₂O (sôi 100 °C) > CH₄ (sôi −162 °C).',
          steps: [
            'NaCl là hợp chất ion: làm nóng chảy phải thắng lực hút tĩnh điện mạnh giữa các ion trong mạng tinh thể.',
            'H₂O là chất phân tử, giữa các phân tử có liên kết hydrogen (và van der Waals): cần ít năng lượng hơn.',
            'CH₄ là phân tử không phân cực, giữa các phân tử chỉ có tương tác van der Waals yếu.'
          ],
          answer: 'Lực giữ các hạt: ion (mạnh) > liên kết hydrogen > van der Waals (yếu), nên nhiệt độ chuyển trạng thái giảm theo cùng thứ tự.'
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
          id: 'g10-l14-c1',
          question: 'Chất nào chỉ chứa liên kết cộng hóa trị không phân cực?',
          options: [
            { id: 'a', text: 'HCl' },
            { id: 'b', text: 'N₂' },
            { id: 'c', text: 'NaCl' },
            { id: 'd', text: 'H₂O' }
          ],
          correct: 'b',
          explanation: 'Hai nguyên tử N giống nhau nên Δχ = 0.'
        },
        {
          type: 'quiz',
          id: 'g10-l14-c2',
          question: 'Phân tử C₂H₂ (H–C≡C–H) có bao nhiêu liên kết σ và π?',
          options: [
            { id: 'a', text: '3σ, 2π' },
            { id: 'b', text: '2σ, 3π' },
            { id: 'c', text: '5σ, 0π' },
            { id: 'd', text: '4σ, 1π' }
          ],
          correct: 'a',
          explanation: '2 liên kết C–H (2σ) và 1 liên kết ba C≡C (1σ + 2π): tổng 3σ và 2π.'
        },
        {
          type: 'quiz',
          id: 'g10-l14-c3',
          question: 'Ethanol (C₂H₅OH) tan vô hạn trong nước chủ yếu vì',
          options: [
            { id: 'a', text: 'ethanol là hợp chất ion' },
            { id: 'b', text: 'ethanol tạo được liên kết hydrogen với nước' },
            { id: 'c', text: 'ethanol có khối lượng phân tử lớn' },
            { id: 'd', text: 'ethanol không phân cực' }
          ],
          correct: 'b',
          explanation: 'Nhóm O–H của ethanol tạo liên kết hydrogen với phân tử H₂O.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 3',
      blocks: [
        {
          type: 'list',
          items: [
            'Bước 1: xác định loại nguyên tố (kim loại, phi kim) hoặc tính Δχ để biết loại liên kết.',
            'Bước 2: với hợp chất ion, viết quá trình nhường – nhận electron và lập công thức trung hòa điện.',
            'Bước 3: với chất phân tử, xét liên kết hydrogen và tương tác van der Waals để giải thích tính chất vật lí.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Hợp chất của hai phi kim luôn có liên kết ion nếu Δχ lớn hơn 0,4.', right: 'Từ 0,4 đến dưới 1,7 là liên kết **cộng hóa trị phân cực**; chỉ từ 1,7 trở lên mới coi là ion.' },
            { wrong: 'Nhiệt độ sôi cao của nước là do liên kết O–H bền.', right: 'Do **liên kết hydrogen giữa các phân tử**; khi sôi, liên kết O–H không bị phá vỡ.' },
            { wrong: 'Đếm liên kết π cho cả liên kết đơn.', right: 'Liên kết đơn **chỉ có σ**; π chỉ có trong liên kết đôi, ba.' }
          ]
        },
        {
          type: 'p',
          text: 'Chương tiếp theo: **Phản ứng oxi hóa – khử** — số oxi hóa, chất oxi hóa, chất khử và cân bằng phương trình.'
        }
      ]
    }
  ]
}
