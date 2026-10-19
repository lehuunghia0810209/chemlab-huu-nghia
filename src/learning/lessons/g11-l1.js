// Hóa học 11 · Chương 1 · Bài 1 — Khái niệm về cân bằng hóa học.
// The H₂ + I₂ ⇌ 2HI example uses KC ≈ 54 (about 430 °C, widely tabulated);
// the ICE-table arithmetic is re-checked in scripts/test-learning.mjs.
export default {
  id: 'g11-l1',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Trình bày được khái niệm phản ứng thuận nghịch và trạng thái cân bằng của một phản ứng thuận nghịch.',
    'Viết được biểu thức hằng số cân bằng (KC) của một phản ứng thuận nghịch.',
    'Vận dụng được nguyên lí chuyển dịch cân bằng Le Chatelier để giải thích ảnh hưởng của nhiệt độ, nồng độ, áp suất đến cân bằng hóa học.'
  ],
  prerequisites: [
    'Hóa học 10: tốc độ phản ứng và các yếu tố ảnh hưởng.',
    'Hóa học 10: biến thiên enthalpy, phản ứng tỏa nhiệt (ΔrH < 0) và thu nhiệt (ΔrH > 0).',
    'Nồng độ mol: C = n : V (mol/L, kí hiệu M).'
  ],
  sources: [
    'Chương trình GDPT 2018 môn Hóa học — yêu cầu cần đạt mục “Khái niệm về cân bằng hóa học” (diễn đạt lại).',
    'SGK Hóa học 11, Kết nối tri thức với cuộc sống — Bài 1.',
    'Giá trị KC ≈ 54 của phản ứng H₂ + I₂ ⇌ 2HI ở khoảng 430 °C: số liệu phổ biến trong giáo trình hóa đại cương.'
  ],
  verification: {
    level: 'internal',
    note: 'Biên soạn độc lập, các phép tính được kiểm tra tự động. Chưa qua thẩm định của giáo viên hoặc chuyên gia độc lập.',
    date: '2026-10-19'
  },
  steps: [
    {
      id: 'objectives',
      kind: 'objectives',
      title: 'Bài này giúp em',
      blocks: [
        {
          type: 'list',
          items: [
            'Phân biệt phản ứng một chiều và phản ứng thuận nghịch.',
            'Hiểu trạng thái cân bằng là một cân bằng động.',
            'Viết biểu thức và tính hằng số cân bằng KC.',
            'Dự đoán chiều chuyển dịch cân bằng bằng nguyên lí Le Chatelier.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        {
          type: 'list',
          items: [
            'Tốc độ phản ứng tăng khi tăng nồng độ, nhiệt độ hoặc áp suất (với chất khí).',
            'ΔrH < 0: phản ứng tỏa nhiệt; ΔrH > 0: phản ứng thu nhiệt.'
          ]
        }
      ]
    },
    {
      id: 'reversible',
      kind: 'concept',
      title: 'Phản ứng một chiều và phản ứng thuận nghịch',
      blocks: [
        {
          type: 'p',
          text: '**Phản ứng một chiều** chỉ xảy ra theo một chiều từ chất phản ứng tạo thành sản phẩm. Phương trình dùng mũi tên một chiều:'
        },
        { type: 'equation', text: '2KClO₃ → 2KCl + 3O₂   (t°, MnO₂)' },
        {
          type: 'p',
          text: '**Phản ứng thuận nghịch** là phản ứng xảy ra theo hai chiều ngược nhau trong cùng điều kiện. Chiều từ trái sang phải là chiều thuận, chiều từ phải sang trái là chiều nghịch:'
        },
        { type: 'equation', text: 'H₂(g) + I₂(g) ⇌ 2HI(g)' },
        { type: 'equation', text: 'Cl₂(aq) + H₂O(l) ⇌ HCl(aq) + HClO(aq)' }
      ]
    },
    {
      id: 'equilibrium',
      kind: 'concept',
      title: 'Trạng thái cân bằng',
      blocks: [
        {
          type: 'p',
          text: 'Khi bắt đầu, chỉ có H₂ và I₂ nên tốc độ phản ứng thuận lớn nhất, tốc độ phản ứng nghịch bằng 0. HI tạo ra càng nhiều thì phản ứng nghịch càng nhanh, còn phản ứng thuận chậm dần.'
        },
        { type: 'figure', figure: 'equilibrium-rates' },
        {
          type: 'callout',
          title: 'Cân bằng hóa học',
          text: 'Là trạng thái của phản ứng thuận nghịch khi **tốc độ phản ứng thuận bằng tốc độ phản ứng nghịch**. Nồng độ các chất không thay đổi nữa.'
        },
        {
          type: 'list',
          items: [
            'Cân bằng hóa học là **cân bằng động**: phản ứng thuận và nghịch vẫn tiếp tục xảy ra, chỉ là với tốc độ bằng nhau.',
            'Ở trạng thái cân bằng, nồng độ các chất không đổi nhưng **không nhất thiết bằng nhau**.'
          ]
        }
      ]
    },
    {
      id: 'constant',
      kind: 'concept',
      title: 'Hằng số cân bằng KC',
      blocks: [
        { type: 'p', text: 'Với phản ứng thuận nghịch tổng quát ở trạng thái cân bằng:' },
        { type: 'equation', text: 'aA + bB ⇌ cC + dD' },
        {
          type: 'equation',
          text: 'KC = [C]ᶜ · [D]ᵈ / ([A]ᵃ · [B]ᵇ)',
          note: '[A], [B], [C], [D] là nồng độ mol (M) của các chất tại trạng thái cân bằng.'
        },
        {
          type: 'list',
          items: [
            'Chất rắn (s) **không** có mặt trong biểu thức KC. Ví dụ: CaCO₃(s) ⇌ CaO(s) + CO₂(g) có KC = [CO₂].',
            'KC chỉ phụ thuộc vào **nhiệt độ** và bản chất phản ứng, không phụ thuộc nồng độ ban đầu.',
            'KC càng lớn thì ở trạng thái cân bằng, sản phẩm chiếm càng nhiều so với chất phản ứng.'
          ]
        }
      ]
    },
    {
      id: 'example-kc',
      kind: 'example',
      title: 'Ví dụ — Tính KC và nồng độ cân bằng',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho H₂ và I₂, mỗi chất nồng độ ban đầu 0,500 M, vào bình kín ở khoảng 430 °C. Khi cân bằng, [H₂] = [I₂] = 0,107 M. (a) Tính [HI] và KC. (b) Kiểm tra lại: biết KC = 54, tính [HI] lúc cân bằng.',
          table: {
            caption: 'Nồng độ (M) theo phương trình H₂ + I₂ ⇌ 2HI',
            head: ['', 'H₂', 'I₂', 'HI'],
            rows: [
              ['Ban đầu', '0,500', '0,500', '0'],
              ['Phản ứng', 'x', 'x', '2x'],
              ['Cân bằng', '0,500 − x', '0,500 − x', '2x']
            ]
          },
          steps: [
            'Gọi x là nồng độ H₂ đã phản ứng và lập bảng nồng độ như trên.',
            '(a) 0,500 − x = 0,107 ⇒ x = 0,393 M ⇒ [HI] = 2x = 0,786 M.',
            'KC = [HI]² / ([H₂][I₂]) = 0,786² / (0,107 × 0,107) = 0,6178 / 0,01145 ≈ 54.',
            '(b) (2x)² / (0,500 − x)² = 54 ⇒ 2x / (0,500 − x) = √54 ≈ 7,348.',
            '2x = 3,674 − 7,348x ⇒ 9,348x = 3,674 ⇒ x ≈ 0,393 M ⇒ [HI] ≈ 0,786 M.'
          ],
          answer: '[HI] = 0,786 M và KC ≈ 54. Hai cách tính cho kết quả thống nhất.'
        }
      ]
    },
    {
      id: 'le-chatelier',
      kind: 'concept',
      title: 'Chuyển dịch cân bằng — nguyên lí Le Chatelier',
      blocks: [
        {
          type: 'callout',
          title: 'Nguyên lí Le Chatelier',
          text: 'Một phản ứng thuận nghịch đang ở trạng thái cân bằng, khi chịu tác động từ bên ngoài (thay đổi nồng độ, nhiệt độ, áp suất), cân bằng sẽ chuyển dịch theo chiều **làm giảm tác động** đó.'
        },
        {
          type: 'table',
          caption: 'Áp dụng cho N₂(g) + 3H₂(g) ⇌ 2NH₃(g), ΔrH°₂₉₈ = −91,8 kJ',
          head: ['Tác động', 'Cân bằng chuyển dịch', 'Lí do'],
          rows: [
            ['Thêm N₂ hoặc H₂', 'Chiều thuận', 'Làm giảm nồng độ chất vừa thêm'],
            ['Lấy bớt NH₃ ra', 'Chiều thuận', 'Bù lại lượng NH₃ đã mất'],
            ['Tăng áp suất', 'Chiều thuận', 'Giảm số mol khí: 4 mol → 2 mol'],
            ['Tăng nhiệt độ', 'Chiều nghịch', 'Chiều thu nhiệt (chiều thuận tỏa nhiệt)'],
            ['Thêm chất xúc tác', 'Không chuyển dịch', 'Tăng tốc độ cả hai chiều như nhau']
          ]
        },
        {
          type: 'list',
          items: [
            'Áp suất chỉ ảnh hưởng tới cân bằng có chất khí và tổng số mol khí hai vế khác nhau. Với H₂ + I₂ ⇌ 2HI (2 mol khí ở mỗi vế), thay đổi áp suất không làm chuyển dịch cân bằng.',
            'Thí nghiệm: 2NO₂(g, nâu đỏ) ⇌ N₂O₄(g, không màu) có chiều thuận tỏa nhiệt. Ngâm bình vào nước đá, màu nâu nhạt dần (cân bằng chuyển dịch theo chiều thuận); ngâm vào nước nóng, màu nâu đậm lên.'
          ]
        }
      ]
    },
    {
      id: 'lab',
      kind: 'practice',
      title: 'Thực hành: cân bằng Fe³⁺ – SCN⁻',
      blocks: [
        {
          type: 'p',
          text: 'Trộn dung dịch FeCl₃ với KSCN tạo phức màu đỏ máu: Fe³⁺(aq) + SCN⁻(aq) ⇌ [Fe(SCN)]²⁺(aq). Dự đoán: nếu thêm Fe³⁺, màu đỏ đậm lên hay nhạt đi? Sau đó kiểm tra trong phòng thí nghiệm ảo.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Cân bằng Fe³⁺ – SCN⁻',
          text: 'Mở trong Phòng thí nghiệm ảo. Khi quay lại mục Học tập, em vẫn ở đúng bước này.',
          action: { kind: 'guided', grade: 11, lessonId: 'g11-l1', experimentId: 'g11-equilibrium-fescn' }
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
          id: 'g11-l1-c1',
          question: 'Phát biểu nào đúng về trạng thái cân bằng hóa học?',
          options: [
            { id: 'a', text: 'Phản ứng thuận và nghịch đều dừng lại.' },
            { id: 'b', text: 'Tốc độ phản ứng thuận bằng tốc độ phản ứng nghịch.' },
            { id: 'c', text: 'Nồng độ chất phản ứng luôn bằng nồng độ sản phẩm.' },
            { id: 'd', text: 'Chỉ còn phản ứng thuận xảy ra.' }
          ],
          correct: 'b',
          explanation: 'Cân bằng là cân bằng động: hai phản ứng vẫn xảy ra với tốc độ bằng nhau; nồng độ không đổi nhưng không nhất thiết bằng nhau.'
        },
        {
          type: 'quiz',
          id: 'g11-l1-c2',
          question: 'Biểu thức hằng số cân bằng của N₂(g) + 3H₂(g) ⇌ 2NH₃(g) là',
          options: [
            { id: 'a', text: 'KC = [NH₃] / ([N₂][H₂])' },
            { id: 'b', text: 'KC = 2[NH₃] / ([N₂] · 3[H₂])' },
            { id: 'c', text: 'KC = [NH₃]² / ([N₂][H₂]³)' },
            { id: 'd', text: 'KC = [N₂][H₂]³ / [NH₃]²' }
          ],
          correct: 'c',
          explanation: 'Nồng độ mỗi chất được lũy thừa theo hệ số tỉ lượng; sản phẩm ở tử số, chất phản ứng ở mẫu số.'
        },
        {
          type: 'quiz',
          id: 'g11-l1-c3',
          question: 'Với cân bằng có chiều thuận tỏa nhiệt (ΔrH < 0), khi tăng nhiệt độ thì cân bằng',
          options: [
            { id: 'a', text: 'chuyển dịch theo chiều thuận' },
            { id: 'b', text: 'chuyển dịch theo chiều nghịch' },
            { id: 'c', text: 'không chuyển dịch' },
            { id: 'd', text: 'dừng lại' }
          ],
          correct: 'b',
          explanation: 'Tăng nhiệt độ, cân bằng chuyển dịch theo chiều thu nhiệt để giảm tác động — ở đây là chiều nghịch.'
        },
        {
          type: 'quiz',
          id: 'g11-l1-c4',
          question: 'Cho CaCO₃(s) ⇌ CaO(s) + CO₂(g). Biểu thức KC là',
          options: [
            { id: 'a', text: 'KC = [CaO][CO₂] / [CaCO₃]' },
            { id: 'b', text: 'KC = [CO₂]' },
            { id: 'c', text: 'KC = [CaCO₃] / [CO₂]' },
            { id: 'd', text: 'KC = [CaO]' }
          ],
          correct: 'b',
          explanation: 'Chất rắn không có mặt trong biểu thức KC, chỉ còn nồng độ CO₂.'
        },
        {
          type: 'quiz',
          id: 'g11-l1-c5',
          question: 'Thêm chất xúc tác vào một hệ đang cân bằng thì',
          options: [
            { id: 'a', text: 'cân bằng chuyển dịch theo chiều thuận' },
            { id: 'b', text: 'giá trị KC tăng' },
            { id: 'c', text: 'cân bằng không chuyển dịch' },
            { id: 'd', text: 'cân bằng chuyển dịch theo chiều nghịch' }
          ],
          correct: 'c',
          explanation: 'Chất xúc tác làm tăng tốc độ cả phản ứng thuận và nghịch như nhau, chỉ giúp hệ nhanh đạt cân bằng.'
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
            'Phản ứng thuận nghịch xảy ra theo hai chiều trong cùng điều kiện, kí hiệu ⇌.',
            'Cân bằng hóa học: v thuận = v nghịch; là cân bằng động; nồng độ các chất không đổi.',
            'aA + bB ⇌ cC + dD: KC = [C]ᶜ[D]ᵈ / ([A]ᵃ[B]ᵇ); không ghi chất rắn; KC chỉ phụ thuộc nhiệt độ.',
            'Le Chatelier: cân bằng chuyển dịch theo chiều làm giảm tác động bên ngoài; chất xúc tác không làm chuyển dịch cân bằng.'
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Cân bằng trong dung dịch nước** — sự điện li, thuyết Brønsted – Lowry và pH.'
        }
      ]
    }
  ]
}
