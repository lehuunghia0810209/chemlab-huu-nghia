// Hóa học 12 · Chương 3 · Bài 8 — Amine.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l8',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm amine, phân loại amine (theo bậc và theo bản chất gốc hydrocarbon); viết được công thức cấu tạo, gọi được tên một số amine đơn giản (tên gốc – chức, tên thay thế, tên thông thường).',
    'Nêu được đặc điểm cấu tạo và tính chất vật lí của amine.',
    'Trình bày được tính chất hóa học của amine: tính base (với quỳ tím, acid, dung dịch FeCl₃); phản ứng với nitrous acid; phản ứng thế ở nhân thơm của aniline với nước bromine.',
    'Trình bày được ứng dụng và phương pháp điều chế amine (alkyl hóa ammonia, khử hợp chất nitro).'
  ],
  prerequisites: [
    'Hóa 11: ammonia và tính base; phản ứng thế ở vòng benzene của phenol.',
    'Danh pháp gốc hydrocarbon.'
  ],
  sources: [
    programme('Amine'),
    textbook(12, 8)
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
          text: 'Mùi tanh của cá chủ yếu do các amine như trimethylamine gây ra; người ta thường khử mùi tanh bằng giấm hoặc chanh. Vì sao acid lại làm mất mùi tanh?'
        },
        {
          type: 'list',
          items: [
            'Phân loại, gọi tên amine; xác định bậc amine.',
            'Viết phản ứng thể hiện tính base của amine.',
            'Viết phản ứng với nitrous acid và phản ứng của aniline với nước bromine.',
            'Nêu điều chế và ứng dụng của amine.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['NH₃ có cặp electron tự do trên N nên có tính base.', 'Nhóm −OH của phenol làm vòng benzene dễ thế bromine.'] }
      ]
    },
    {
      id: 'definition',
      kind: 'concept',
      title: 'Khái niệm, phân loại và danh pháp',
      blocks: [
        {
          type: 'callout',
          title: 'Amine',
          text: 'Khi thay thế nguyên tử hydrogen trong phân tử ammonia bằng gốc hydrocarbon, ta được amine. **Bậc amine** bằng số gốc hydrocarbon liên kết với nguyên tử nitrogen.'
        },
        {
          type: 'table',
          caption: 'Một số amine',
          head: ['Công thức', 'Bậc', 'Tên gốc – chức', 'Tên thay thế'],
          rows: [
            ['CH₃NH₂', 'I', 'methylamine', 'methanamine'],
            ['C₂H₅NH₂', 'I', 'ethylamine', 'ethanamine'],
            ['(CH₃)₂NH', 'II', 'dimethylamine', 'N-methylmethanamine'],
            ['(CH₃)₃N', 'III', 'trimethylamine', 'N,N-dimethylmethanamine'],
            ['C₆H₅NH₂', 'I', 'phenylamine', 'benzenamine (tên thông thường: aniline)']
          ]
        },
        {
          type: 'p',
          text: 'Theo gốc hydrocarbon: **amine béo** (N liên kết với gốc no, như CH₃NH₂) và **amine thơm** (N liên kết trực tiếp với vòng benzene, như C₆H₅NH₂). Amine no, đơn chức, mạch hở có công thức CₙH₂ₙ₊₃N (n ≥ 1).'
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
            'Methylamine, dimethylamine, trimethylamine và ethylamine là chất khí, mùi khai khó chịu, tan nhiều trong nước.',
            'Các amine có phân tử khối lớn hơn là chất lỏng hoặc rắn, độ tan giảm khi phân tử khối tăng.',
            'Aniline là chất lỏng, không màu, ít tan trong nước, **rất độc**; để lâu ngoài không khí chuyển màu nâu đen do bị oxi hóa.'
          ]
        }
      ]
    },
    {
      id: 'reactions',
      kind: 'concept',
      title: 'Tính chất hóa học',
      blocks: [
        { type: 'heading', text: 'Tính base (do cặp electron tự do trên N)' },
        { type: 'equation', text: 'CH₃NH₂ + H₂O ⇌ CH₃NH₃⁺ + OH⁻', note: 'Dung dịch methylamine làm quỳ tím hóa xanh. Aniline có tính base rất yếu, không làm đổi màu quỳ tím.' },
        { type: 'equation', text: 'CH₃NH₂ + HCl → CH₃NH₃Cl' },
        { type: 'equation', text: 'C₆H₅NH₂ + HCl → C₆H₅NH₃Cl', note: 'Aniline tan trong dung dịch HCl tạo muối phenylammonium chloride.' },
        { type: 'equation', text: '3CH₃NH₂ + FeCl₃ + 3H₂O → Fe(OH)₃ + 3CH₃NH₃Cl', note: 'Tạo kết tủa nâu đỏ Fe(OH)₃.' },
        { type: 'heading', text: 'Phản ứng với nitrous acid (HNO₂)' },
        { type: 'equation', text: 'C₂H₅NH₂ + HNO₂ → C₂H₅OH + N₂ + H₂O', note: 'Amine béo bậc I tạo alcohol và giải phóng khí N₂.' },
        { type: 'equation', text: 'C₆H₅NH₂ + HNO₂ + HCl → C₆H₅N₂Cl + 2H₂O', condition: '0 – 5 °C', note: 'Aniline tạo muối benzenediazonium chloride.' },
        { type: 'heading', text: 'Phản ứng thế ở nhân thơm của aniline' },
        { type: 'equation', text: 'C₆H₅NH₂ + 3Br₂ → C₆H₂Br₃NH₂ + 3HBr', note: 'Tạo kết tủa trắng 2,4,6-tribromoaniline; dùng nhận biết aniline.' }
      ]
    },
    {
      id: 'uses',
      kind: 'concept',
      title: 'Điều chế và ứng dụng',
      blocks: [
        { type: 'equation', text: 'NH₃ + CH₃I → CH₃NH₂ + HI', note: 'Alkyl hóa ammonia bằng dẫn xuất halogen.' },
        { type: 'equation', text: 'C₆H₅NO₂ + 6[H] → C₆H₅NH₂ + 2H₂O', condition: 'Fe + HCl, t°', note: 'Khử nitrobenzene thành aniline; [H] là hydrogen mới sinh.', check: false },
        {
          type: 'p',
          text: 'Ứng dụng: aniline là nguyên liệu sản xuất phẩm nhuộm, polymer, dược phẩm; một số amine dùng trong tổng hợp thuốc, thuốc trừ sâu. Muối diazonium dùng sản xuất phẩm nhuộm azo.'
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Xác định amine và phản ứng của aniline',
      blocks: [
        {
          type: 'worked',
          problem: '(a) Cho 4,5 g một amine no, đơn chức, mạch hở tác dụng vừa đủ với HCl thu được 8,15 g muối. Xác định công thức phân tử của amine. (b) Cho 9,3 g aniline tác dụng với nước bromine dư. Tính khối lượng kết tủa (C = 12, H = 1, N = 14, Br = 80, Cl = 35,5).',
          steps: [
            '(a) Bảo toàn khối lượng: m(HCl) = 8,15 − 4,5 = 3,65 g ⇒ n(HCl) = n(amine) = 0,1 mol ⇒ M = 45.',
            'CₙH₂ₙ₊₃N: 14n + 17 = 45 ⇒ n = 2 ⇒ C₂H₇N.',
            '(b) n(C₆H₅NH₂) = 9,3 / 93 = 0,1 mol ⇒ n(C₆H₂Br₃NH₂) = 0,1 mol; M = 330 ⇒ m = 33 g.'
          ],
          answer: '(a) C₂H₇N; (b) 33 g kết tủa.'
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
          id: 'g12-l8-c1',
          question: 'Amine nào là amine bậc II?',
          options: [
            { id: 'a', text: 'CH₃NH₂' },
            { id: 'b', text: '(CH₃)₂NH' },
            { id: 'c', text: '(CH₃)₃N' },
            { id: 'd', text: 'C₆H₅NH₂' }
          ],
          correct: 'b',
          explanation: 'N liên kết với hai gốc methyl.'
        },
        {
          type: 'quiz',
          id: 'g12-l8-c2',
          question: 'Dung dịch chất nào làm quỳ tím hóa xanh?',
          options: [
            { id: 'a', text: 'Aniline' },
            { id: 'b', text: 'Methylamine' },
            { id: 'c', text: 'Phenol' },
            { id: 'd', text: 'Ethanol' }
          ],
          correct: 'b',
          explanation: 'Amine béo có tính base mạnh hơn ammonia; aniline base quá yếu.'
        },
        {
          type: 'quiz',
          id: 'g12-l8-c3',
          question: 'Aniline tác dụng với nước bromine tạo hiện tượng',
          options: [
            { id: 'a', text: 'kết tủa trắng' },
            { id: 'b', text: 'khí không màu' },
            { id: 'c', text: 'dung dịch xanh lam' },
            { id: 'd', text: 'không hiện tượng' }
          ],
          correct: 'a',
          explanation: 'Tạo 2,4,6-tribromoaniline kết tủa trắng.'
        },
        {
          type: 'quiz',
          id: 'g12-l8-c4',
          question: 'Khử mùi tanh của cá (do amine) bằng giấm vì',
          options: [
            { id: 'a', text: 'giấm oxi hóa amine' },
            { id: 'b', text: 'acid trong giấm tạo muối với amine, muối không bay hơi' },
            { id: 'c', text: 'giấm làm amine bay hơi nhanh hơn' },
            { id: 'd', text: 'giấm có mùi thơm át mùi tanh' }
          ],
          correct: 'b',
          explanation: 'Amine có tính base, phản ứng với acetic acid tạo muối tan, không mùi.'
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
            'Amine: thay H của NH₃ bằng gốc hydrocarbon; bậc = số gốc gắn với N; no đơn chức mạch hở CₙH₂ₙ₊₃N.',
            'Tính base: amine béo làm quỳ hóa xanh, tạo muối với acid, tạo Fe(OH)₃ với FeCl₃; aniline base rất yếu.',
            'HNO₂: amine béo bậc I → alcohol + N₂; aniline (0 – 5 °C) → muối diazonium.',
            'Aniline + nước bromine → kết tủa trắng.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Bậc amine là bậc của nguyên tử C gắn với N (như alcohol).', right: 'Bậc amine là **số gốc hydrocarbon liên kết với N**: (CH₃)₃C−NH₂ vẫn là amine bậc I.' },
            { wrong: 'Aniline có tính base nên làm quỳ tím hóa xanh.', right: 'Tính base của aniline **rất yếu**, không làm đổi màu quỳ tím.' },
            { wrong: 'Amine no đơn chức có công thức CₙH₂ₙ₊₁N.', right: 'Công thức đúng là **CₙH₂ₙ₊₃N** (ví dụ CH₅N, C₂H₇N).' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Amino acid và peptide**.'
        }
      ]
    }
  ]
}
