// Hóa học 10 · Chương 1 · Bài 1 — Thành phần của nguyên tử.
// Particle data: CODATA 2018 values (rounded); worked examples are re-checked
// in scripts/test-learning.mjs.
export default {
  id: 'g10-l1',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Trình bày được thành phần của nguyên tử: nguyên tử gồm hạt nhân và lớp vỏ; hạt nhân gồm proton và neutron; lớp vỏ gồm các electron.',
    'Nêu được điện tích và khối lượng của mỗi loại hạt.',
    'So sánh được khối lượng của electron với proton và neutron, kích thước của hạt nhân với kích thước nguyên tử.'
  ],
  prerequisites: [
    'Môn Khoa học tự nhiên lớp 7: nguyên tử, mô hình Rutherford – Bohr.',
    'Biết đọc và tính với lũy thừa của 10.'
  ],
  sources: [
    'Chương trình GDPT 2018 môn Hóa học — yêu cầu cần đạt mục “Thành phần của nguyên tử” (diễn đạt lại).',
    'SGK Hóa học 10, Kết nối tri thức với cuộc sống — Bài 1.',
    'Hằng số vật lí: CODATA 2018 (NIST) — khối lượng proton, neutron, electron, đơn vị amu.'
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
          type: 'callout',
          tone: 'question',
          title: 'Câu hỏi mở đầu',
          text: 'Nếu phóng to một nguyên tử bằng cả sân vận động, hạt nhân chỉ như một hạt đậu ở giữa sân. Nguyên tử được tạo nên từ những hạt nào, và vì sao gần như toàn bộ khối lượng lại dồn vào phần nhỏ bé ấy?'
        },
        {
          type: 'list',
          items: [
            'Mô tả nguyên tử gồm những phần nào và mỗi phần chứa hạt gì.',
            'Ghi nhớ điện tích, khối lượng của proton, neutron, electron.',
            'So sánh khối lượng các hạt và kích thước hạt nhân với nguyên tử.',
            'Giải bài toán tìm số hạt trong một nguyên tử.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        {
          type: 'list',
          items: [
            'Nguyên tử là hạt vô cùng nhỏ, trung hòa về điện.',
            'Cách viết số rất nhỏ: 10⁻¹⁰ m = 0,000 000 000 1 m.'
          ]
        }
      ]
    },
    {
      id: 'structure',
      kind: 'concept',
      title: 'Nguyên tử gồm hạt nhân và lớp vỏ',
      blocks: [
        {
          type: 'p',
          text: 'Nguyên tử gồm hai phần: **hạt nhân** ở tâm và **lớp vỏ** bao quanh hạt nhân.'
        },
        {
          type: 'list',
          items: [
            'Hạt nhân chứa các hạt **proton (p)** mang điện dương và **neutron (n)** không mang điện.',
            'Lớp vỏ gồm các **electron (e)** mang điện âm, chuyển động rất nhanh xung quanh hạt nhân.'
          ]
        },
        { type: 'figure', figure: 'atom-structure' },
        {
          type: 'p',
          text: 'Các hạt được phát hiện qua những thí nghiệm nổi tiếng: electron (J. J. Thomson, 1897, thí nghiệm tia âm cực), hạt nhân (E. Rutherford, 1911, bắn phá lá vàng bằng hạt α), neutron (J. Chadwick, 1932).'
        }
      ]
    },
    {
      id: 'particles',
      kind: 'concept',
      title: 'Điện tích và khối lượng của các hạt',
      blocks: [
        {
          type: 'table',
          caption: 'Đặc điểm các hạt cơ bản (giá trị làm tròn)',
          head: ['Hạt', 'Điện tích', 'Điện tích tương đối', 'Khối lượng (kg)', 'Khối lượng (amu)'],
          rows: [
            ['Proton (p)', '+1,602 × 10⁻¹⁹ C', '+1', '1,673 × 10⁻²⁷', '≈ 1'],
            ['Neutron (n)', '0', '0', '1,675 × 10⁻²⁷', '≈ 1'],
            ['Electron (e)', '−1,602 × 10⁻¹⁹ C', '−1', '9,109 × 10⁻³¹', '≈ 0,00055']
          ]
        },
        {
          type: 'p',
          text: 'Đơn vị khối lượng nguyên tử: **1 amu = 1,6605 × 10⁻²⁷ kg**. Proton và neutron đều nặng xấp xỉ 1 amu.'
        },
        {
          type: 'callout',
          title: 'Nguyên tử trung hòa về điện',
          text: 'Điện tích của proton và electron bằng nhau về độ lớn nhưng trái dấu, nên trong nguyên tử: **số proton = số electron**.'
        }
      ]
    },
    {
      id: 'scale',
      kind: 'concept',
      title: 'Khối lượng và kích thước',
      blocks: [
        { type: 'heading', text: 'Khối lượng tập trung ở hạt nhân' },
        {
          type: 'equation',
          text: 'mₚ : mₑ ≈ 1,673 × 10⁻²⁷ : 9,109 × 10⁻³¹ ≈ 1836',
          note: 'Proton nặng gấp khoảng 1836 lần electron.'
        },
        {
          type: 'p',
          text: 'Vì electron rất nhẹ, khối lượng nguyên tử gần bằng khối lượng hạt nhân: **m(nguyên tử) ≈ số p + số n** (tính theo amu).'
        },
        { type: 'heading', text: 'Hạt nhân rất nhỏ so với nguyên tử' },
        {
          type: 'list',
          items: [
            'Đường kính nguyên tử cỡ 10⁻¹⁰ m (0,1 nm).',
            'Đường kính hạt nhân cỡ 10⁻¹⁵ – 10⁻¹⁴ m.',
            'Nguyên tử lớn hơn hạt nhân khoảng 10 000 – 100 000 lần: nếu phóng to hạt nhân bằng hạt đậu 1 cm, nguyên tử sẽ rộng 100 m đến 1 km.'
          ]
        },
        {
          type: 'p',
          text: 'Do đó phần lớn thể tích nguyên tử là khoảng không gian của lớp vỏ electron — điều Rutherford rút ra khi thấy hầu hết hạt α đi xuyên qua lá vàng.'
        }
      ]
    },
    {
      id: 'example-mass',
      kind: 'example',
      title: 'Ví dụ 1 — Khối lượng nguyên tử sodium',
      blocks: [
        {
          type: 'worked',
          problem: 'Nguyên tử sodium (Na) có 11 proton và 12 neutron. Tính gần đúng khối lượng nguyên tử theo amu và cho biết electron chiếm bao nhiêu phần trăm khối lượng.',
          steps: [
            'Số electron = số proton = 11 (nguyên tử trung hòa).',
            'Khối lượng các hạt: 11 × 1 + 12 × 1 + 11 × 0,00055 = 23 + 0,00605 = 23,006 amu.',
            'Phần trăm khối lượng electron: 0,00605 : 23,006 × 100% ≈ 0,026%.'
          ],
          answer: 'm(Na) ≈ 23 amu; electron chỉ chiếm khoảng 0,026% khối lượng nên có thể bỏ qua.'
        }
      ]
    },
    {
      id: 'example-particles',
      kind: 'example',
      title: 'Ví dụ 2 — Tìm số hạt',
      blocks: [
        {
          type: 'worked',
          problem: 'Nguyên tử X có tổng số hạt proton, neutron, electron là 40. Số hạt mang điện nhiều hơn số hạt không mang điện là 12. Tìm số mỗi loại hạt.',
          steps: [
            'Gọi số proton là p, số neutron là n. Vì số electron = p nên tổng số hạt: 2p + n = 40.',
            'Hạt mang điện là p và e, hạt không mang điện là n: 2p − n = 12.',
            'Cộng hai phương trình: 4p = 52 ⇒ p = 13. Thay vào: n = 40 − 26 = 14.'
          ],
          answer: 'X có 13 proton, 13 electron và 14 neutron (X là nguyên tố aluminium, Al).'
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Mẹo kiểm tra',
          text: 'Thay ngược kết quả: 13 + 13 + 14 = 40 và 26 − 14 = 12. Cả hai điều kiện đều đúng.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Quan sát mô hình nguyên tử',
      blocks: [
        {
          type: 'p',
          text: 'Mở mô hình 3D của nguyên tử sodium. Đếm số electron trên từng lớp và đối chiếu với số proton trong hạt nhân.'
        },
        {
          type: 'activity',
          title: 'Atomic Explorer — Sodium (Na)',
          text: 'Mô hình lớp vỏ electron. Đóng cửa sổ mô hình để quay lại đúng bước này.',
          action: { kind: 'atomic', element: 11, mode: 'shell' }
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Khám phá thành phần nguyên tử',
          text: 'Hoạt động ngắn trong Phòng thí nghiệm ảo (nội dung từ phiên bản trước).',
          action: { kind: 'guided', grade: 10, lessonId: 'g10-l1', experimentId: 'g10-lesson-01' }
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
          id: 'g10-l1-c1',
          question: 'Hạt nào không mang điện?',
          options: [
            { id: 'a', text: 'Proton' },
            { id: 'b', text: 'Neutron' },
            { id: 'c', text: 'Electron' },
            { id: 'd', text: 'Hạt nhân' }
          ],
          correct: 'b',
          explanation: 'Neutron không mang điện. Hạt nhân mang điện dương vì chứa proton.'
        },
        {
          type: 'quiz',
          id: 'g10-l1-c2',
          question: 'Nguyên tử chlorine có 17 proton và 18 neutron. Số electron và khối lượng gần đúng của nguyên tử là',
          options: [
            { id: 'a', text: '18 electron; 35 amu' },
            { id: 'b', text: '17 electron; 17 amu' },
            { id: 'c', text: '17 electron; 35 amu' },
            { id: 'd', text: '35 electron; 52 amu' }
          ],
          correct: 'c',
          explanation: 'Số electron = số proton = 17. Khối lượng ≈ 17 + 18 = 35 amu (electron rất nhẹ).'
        },
        {
          type: 'quiz',
          id: 'g10-l1-c3',
          question: 'Khối lượng của nguyên tử tập trung chủ yếu ở',
          options: [
            { id: 'a', text: 'lớp vỏ electron' },
            { id: 'b', text: 'hạt nhân' },
            { id: 'c', text: 'khoảng trống giữa hạt nhân và lớp vỏ' },
            { id: 'd', text: 'phân bố đều trong nguyên tử' }
          ],
          correct: 'b',
          explanation: 'Proton và neutron nặng gấp khoảng 1836 lần electron và đều nằm trong hạt nhân.'
        },
        {
          type: 'quiz',
          id: 'g10-l1-c4',
          question: 'Nguyên tử Y có tổng số hạt là 58, số hạt mang điện nhiều hơn số hạt không mang điện là 18. Số proton của Y là',
          options: [
            { id: 'a', text: '18' },
            { id: 'b', text: '19' },
            { id: 'c', text: '20' },
            { id: 'd', text: '39' }
          ],
          correct: 'b',
          explanation: '2p + n = 58 và 2p − n = 18 ⇒ 4p = 76 ⇒ p = 19, n = 20 (Y là potassium, K).'
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
            'Nguyên tử gồm hạt nhân (proton + neutron) và lớp vỏ (electron).',
            'Proton: +1, ≈ 1 amu. Neutron: 0, ≈ 1 amu. Electron: −1, ≈ 0,00055 amu.',
            'Trong nguyên tử: số proton = số electron.',
            'Khối lượng nguyên tử ≈ số p + số n (amu); hạt nhân nhỏ hơn nguyên tử 10⁴ – 10⁵ lần.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Nguyên tử trung hòa về điện vì số proton bằng số neutron.', right: 'Nguyên tử trung hòa vì **số proton = số electron**; số neutron có thể khác số proton.' },
            { wrong: 'Hạt mang điện trong nguyên tử chỉ là proton.', right: 'Hạt mang điện gồm proton và electron, nên **số hạt mang điện = 2p**.' },
            { wrong: 'Hạt nhân mang điện âm vì có electron.', right: 'Hạt nhân chỉ gồm proton và neutron nên **mang điện dương**; electron nằm ở lớp vỏ.' },
            { wrong: 'Khối lượng nguyên tử bằng tổng số p, n và e (amu).', right: 'Electron chỉ nặng khoảng 0,00055 amu nên **m(nguyên tử) ≈ số p + số n**.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Nguyên tố hóa học** — số hiệu nguyên tử, số khối và đồng vị.'
        }
      ]
    }
  ]
}
