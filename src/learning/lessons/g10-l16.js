// Hóa học 10 · Chương 4 · Bài 16 — Ôn tập chương 4 (Phản ứng oxi hóa – khử).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l16',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa số oxi hóa, chất oxi hóa, chất khử, phản ứng oxi hóa – khử.',
    'Cân bằng phương trình oxi hóa – khử và vận dụng bảo toàn electron trong bài tập định lượng.'
  ],
  prerequisites: [
    'Bài 15: Phản ứng oxi hóa – khử.',
    'Tính số mol: n = m / M; thể tích khí ở điều kiện chuẩn (25 °C, 1 bar): V = n × 24,79 L.'
  ],
  sources: [
    programme('Phản ứng oxi hóa – khử'),
    textbook(10, 16),
    'Thể tích mol khí ở 25 °C, 1 bar: 24,79 L/mol (theo SGK Hóa học 10 của Chương trình 2018).'
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
          text: 'Hòa tan 5,6 g sắt trong nitric acid, có bao nhiêu lít khí NO thoát ra? Không cần viết đủ phương trình — chỉ cần biết sắt nhường bao nhiêu electron và nitrogen nhận bao nhiêu. Bài ôn tập này luyện cách nghĩ đó.'
        },
        {
          type: 'list',
          items: [
            'Hệ thống hóa các khái niệm của chương 4.',
            'Luyện cân bằng phản ứng có nhiều sản phẩm.',
            'Giải bài toán định lượng bằng bảo toàn electron.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 4',
      blocks: [
        {
          type: 'table',
          caption: 'Phản ứng oxi hóa – khử',
          head: ['Khái niệm', 'Nội dung'],
          rows: [
            ['Số oxi hóa', 'Điện tích quy ước; đơn chất 0; H +1, O −2 (thường); tổng = 0 hoặc điện tích ion'],
            ['Chất khử', 'Nhường electron, số oxi hóa tăng, bị oxi hóa'],
            ['Chất oxi hóa', 'Nhận electron, số oxi hóa giảm, bị khử'],
            ['Thăng bằng electron', 'Σ e nhường = Σ e nhận; cân bằng chất oxi hóa, chất khử trước, môi trường sau'],
            ['Bảo toàn electron', 'Σ (số mol chất khử × số e nhường) = Σ (số mol chất oxi hóa × số e nhận)']
          ]
        }
      ]
    },
    {
      id: 'example-balance',
      kind: 'example',
      title: 'Ví dụ 1 — Cân bằng phản ứng tạo N₂O',
      blocks: [
        {
          type: 'worked',
          problem: 'Cân bằng: Al + HNO₃ → Al(NO₃)₃ + N₂O + H₂O.',
          steps: [
            'Al 0 → +3 (chất khử); N +5 → +1 trong N₂O (chất oxi hóa).',
            'Al⁰ → Al⁺³ + 3e (×8); 2N⁺⁵ + 8e → 2N⁺¹ (×3).',
            'Hệ số: 8Al, 8Al(NO₃)₃, 3N₂O. N: 8 × 3 + 3 × 2 = 30 ⇒ 30HNO₃; H: 30 ⇒ 15H₂O.',
            'Kiểm tra O: 30 × 3 = 90; vế phải 8 × 9 + 3 + 15 = 90.'
          ],
          answer: '8Al + 30HNO₃ → 8Al(NO₃)₃ + 3N₂O + 15H₂O.',
          equations: ['8Al + 30HNO₃ → 8Al(NO₃)₃ + 3N₂O + 15H₂O']
        }
      ]
    },
    {
      id: 'example-electron',
      kind: 'example',
      title: 'Ví dụ 2 — Bảo toàn electron',
      blocks: [
        {
          type: 'worked',
          problem: 'Hòa tan hoàn toàn 5,6 g Fe trong dung dịch HNO₃ loãng, dư, thu được khí NO là sản phẩm khử duy nhất. Tính thể tích NO ở điều kiện chuẩn (25 °C, 1 bar) (Fe = 56).',
          steps: [
            'n(Fe) = 5,6 / 56 = 0,1 mol. HNO₃ dư nên Fe lên +3: Fe → Fe³⁺ + 3e ⇒ e nhường = 0,3 mol.',
            'N⁺⁵ + 3e → N⁺² (NO) ⇒ n(NO) = 0,3 / 3 = 0,1 mol.',
            'V(NO) = 0,1 × 24,79 = 2,479 L.'
          ],
          answer: 'V(NO) ≈ 2,48 L.',
          equations: ['Fe + 4HNO₃ → Fe(NO₃)₃ + NO + 2H₂O']
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Vì sao bảo toàn electron nhanh hơn?',
          text: 'Không cần cân bằng phương trình đầy đủ: chỉ cần biết số electron mỗi chất nhường hoặc nhận. Phương pháp đặc biệt hữu ích khi có nhiều chất khử hoặc nhiều sản phẩm khử.'
        }
      ]
    },
    {
      id: 'example-roles',
      kind: 'example',
      title: 'Ví dụ 3 — Một chất, hai vai trò',
      blocks: [
        {
          type: 'worked',
          problem: 'Trong phản ứng Cl₂ + 2NaOH → NaCl + NaClO + H₂O, xác định vai trò của Cl₂.',
          steps: [
            'Cl trong Cl₂: 0. Trong NaCl: −1. Trong NaClO: Na +1, O −2 ⇒ Cl +1.',
            'Một nguyên tử Cl giảm từ 0 xuống −1 (nhận e) và một nguyên tử Cl tăng từ 0 lên +1 (nhường e).'
          ],
          answer: 'Cl₂ vừa là chất oxi hóa vừa là chất khử (phản ứng tự oxi hóa – khử). Đây là phản ứng điều chế nước Javel.',
          equations: ['Cl₂ + 2NaOH → NaCl + NaClO + H₂O']
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
          id: 'g10-l16-c1',
          question: 'Trong phản ứng 2H₂S + SO₂ → 3S + 2H₂O, vai trò của SO₂ là',
          options: [
            { id: 'a', text: 'chất khử' },
            { id: 'b', text: 'chất oxi hóa' },
            { id: 'c', text: 'vừa là chất oxi hóa vừa là chất khử' },
            { id: 'd', text: 'môi trường' }
          ],
          correct: 'b',
          explanation: 'S trong SO₂: +4 → 0 (nhận electron) ⇒ SO₂ là chất oxi hóa; H₂S (S: −2 → 0) là chất khử.'
        },
        {
          type: 'quiz',
          id: 'g10-l16-c2',
          question: 'Cho 0,2 mol Mg tác dụng hết với dung dịch HCl. Số mol electron Mg nhường là',
          options: [
            { id: 'a', text: '0,1' },
            { id: 'b', text: '0,2' },
            { id: 'c', text: '0,4' },
            { id: 'd', text: '0,8' }
          ],
          correct: 'c',
          explanation: 'Mg → Mg²⁺ + 2e: 0,2 × 2 = 0,4 mol electron.'
        },
        {
          type: 'quiz',
          id: 'g10-l16-c3',
          question: 'Tổng hệ số (nguyên, tối giản) của phương trình 3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O là',
          options: [
            { id: 'a', text: '18' },
            { id: 'b', text: '20' },
            { id: 'c', text: '22' },
            { id: 'd', text: '24' }
          ],
          correct: 'b',
          explanation: '3 + 8 + 3 + 2 + 4 = 20.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 4',
      blocks: [
        {
          type: 'list',
          items: [
            'Xác định số oxi hóa → tìm nguyên tố thay đổi → chất khử, chất oxi hóa.',
            'Cân bằng: Σ e nhường = Σ e nhận, sau đó cân bằng môi trường (acid, muối), H, kiểm tra O.',
            'Bài toán định lượng: tính số mol electron trao đổi rồi suy ra lượng chất cần tìm.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Fe tác dụng với HNO₃ dư tạo muối Fe(NO₃)₂.', right: 'HNO₃ dư oxi hóa Fe lên **+3**: Fe(NO₃)₃; dùng 3 e/Fe trong bảo toàn electron.' },
            { wrong: 'Tính số e nhận của N₂O là 4 (một nguyên tử N đổi 4).', right: 'Mỗi N đổi từ +5 xuống +1 (4e), N₂O có **2 nguyên tử N ⇒ 8e** cho mỗi phân tử.' },
            { wrong: 'Một chất chỉ có thể là chất oxi hóa hoặc chất khử.', right: 'Có phản ứng **tự oxi hóa – khử**, ví dụ Cl₂ + 2NaOH.' }
          ]
        },
        {
          type: 'p',
          text: 'Chương tiếp theo: **Năng lượng hóa học** — biến thiên enthalpy của phản ứng.'
        }
      ]
    }
  ]
}
