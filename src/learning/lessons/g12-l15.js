// Hóa học 12 · Chương 5 · Bài 15 — Thế điện cực và nguồn điện hóa học.
// Standard potentials (25 °C) from the CRC Handbook table, rounded to 0,01 V
// (Fe²⁺/Fe kept at the textbook −0,44 V; CRC gives −0,447 V);
// E°pin arithmetic is re-checked in scripts/test-learning.mjs.
export const STANDARD_POTENTIALS = [
  ['K⁺/K', 'K⁺ + e ⇌ K', -2.93],
  ['Na⁺/Na', 'Na⁺ + e ⇌ Na', -2.71],
  ['Mg²⁺/Mg', 'Mg²⁺ + 2e ⇌ Mg', -2.37],
  ['Al³⁺/Al', 'Al³⁺ + 3e ⇌ Al', -1.66],
  ['Zn²⁺/Zn', 'Zn²⁺ + 2e ⇌ Zn', -0.76],
  ['Fe²⁺/Fe', 'Fe²⁺ + 2e ⇌ Fe', -0.44],
  ['Ni²⁺/Ni', 'Ni²⁺ + 2e ⇌ Ni', -0.26],
  ['Pb²⁺/Pb', 'Pb²⁺ + 2e ⇌ Pb', -0.13],
  ['2H⁺/H₂', '2H⁺ + 2e ⇌ H₂', 0],
  ['Cu²⁺/Cu', 'Cu²⁺ + 2e ⇌ Cu', 0.34],
  ['Ag⁺/Ag', 'Ag⁺ + e ⇌ Ag', 0.8]
]

const volts = value => `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toFixed(2).replace('.', ',')} V`

export default {
  id: 'g12-l15',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm cặp oxi hóa – khử của kim loại.',
    'Nêu được giá trị thế điện cực chuẩn là đại lượng đánh giá khả năng khử của dạng khử và khả năng oxi hóa của dạng oxi hóa; so sánh được tính khử, tính oxi hóa dựa vào thế điện cực chuẩn.',
    'Nêu được cấu tạo, nguyên tắc hoạt động của pin Galvani; tính được sức điện động chuẩn của pin.',
    'Nêu được nguyên tắc và ưu nhược điểm chính của một số loại pin khác như acquy, pin nhiên liệu.'
  ],
  prerequisites: [
    'Hóa học 10: chất oxi hóa, chất khử, quá trình oxi hóa và quá trình khử.',
    'Cân bằng phương trình oxi hóa – khử bằng thăng bằng electron.'
  ],
  sources: [
    'Chương trình GDPT 2018 môn Hóa học — yêu cầu cần đạt chủ đề “Pin điện và điện phân” (diễn đạt lại).',
    'SGK Hóa học 12, Kết nối tri thức với cuộc sống — Bài 15.',
    'Thế điện cực chuẩn ở 25 °C: CRC Handbook of Chemistry and Physics, bảng “Electrochemical Series”, làm tròn đến 0,01 V. Riêng Fe²⁺/Fe, CRC ghi −0,447 V; bài dùng −0,44 V như cách làm tròn phổ biến trong sách giáo khoa.'
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
          text: 'Vài quả chanh, mỗi quả cắm một thanh kẽm và một thanh đồng, nối tiếp nhau có thể làm sáng một đèn LED nhỏ. Năng lượng điện đến từ đâu, và vì sao cần hai kim loại khác nhau?'
        },
        {
          type: 'list',
          items: [
            'Viết được cặp oxi hóa – khử của kim loại.',
            'Đọc bảng thế điện cực chuẩn để so sánh tính khử, tính oxi hóa.',
            'Giải thích cách pin Zn–Cu tạo ra dòng điện và tính sức điện động chuẩn.',
            'Biết nguyên tắc của acquy chì, pin lithium-ion và pin nhiên liệu.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        {
          type: 'list',
          items: [
            'Chất khử nhường electron (bị oxi hóa); chất oxi hóa nhận electron (bị khử).',
            'Kim loại có tính khử: M → Mⁿ⁺ + ne.'
          ]
        }
      ]
    },
    {
      id: 'redox-couple',
      kind: 'concept',
      title: 'Cặp oxi hóa – khử của kim loại',
      blocks: [
        {
          type: 'p',
          text: 'Cation kim loại Mⁿ⁺ có thể nhận electron để trở thành nguyên tử kim loại M, và ngược lại. Dạng oxi hóa Mⁿ⁺ và dạng khử M tạo thành **cặp oxi hóa – khử**, kí hiệu **Mⁿ⁺/M**.'
        },
        { type: 'equation', text: 'Mⁿ⁺ + ne ⇌ M', check: false },
        {
          type: 'list',
          items: [
            'Ví dụ: Cu²⁺/Cu ứng với Cu²⁺ + 2e ⇌ Cu; Ag⁺/Ag ứng với Ag⁺ + e ⇌ Ag.',
            'Quy ước viết: dạng oxi hóa trước, dạng khử sau.'
          ]
        }
      ]
    },
    {
      id: 'galvanic',
      kind: 'concept',
      title: 'Pin Galvani Zn–Cu',
      blocks: [
        {
          type: 'p',
          text: 'Nhúng thanh Zn vào dung dịch ZnSO₄ 1 M, thanh Cu vào dung dịch CuSO₄ 1 M, nối hai dung dịch bằng cầu muối và nối hai thanh kim loại bằng dây dẫn qua vôn kế. Kim chỉ của vôn kế lệch: pin tạo ra dòng điện.'
        },
        { type: 'figure', figure: 'galvanic-cell' },
        {
          type: 'table',
          caption: 'Các quá trình trong pin Zn–Cu',
          head: ['Điện cực', 'Dấu', 'Quá trình'],
          rows: [
            ['Anode: Zn', 'Cực âm (−)', 'Oxi hóa: Zn → Zn²⁺ + 2e'],
            ['Cathode: Cu', 'Cực dương (+)', 'Khử: Cu²⁺ + 2e → Cu']
          ]
        },
        { type: 'equation', text: 'Zn + Cu²⁺ → Zn²⁺ + Cu', note: 'Phản ứng xảy ra trong pin.' },
        {
          type: 'list',
          items: [
            'Electron đi ở mạch ngoài từ anode (Zn) sang cathode (Cu).',
            'Cầu muối (ví dụ dung dịch KNO₃) cho các ion di chuyển để hai dung dịch luôn trung hòa điện, nhờ đó dòng điện được duy trì.',
            'Thanh Zn mòn dần, kim loại Cu bám lên thanh Cu, màu xanh của dung dịch CuSO₄ nhạt dần.'
          ]
        }
      ]
    },
    {
      id: 'standard-potential',
      kind: 'concept',
      title: 'Thế điện cực chuẩn',
      blocks: [
        {
          type: 'p',
          text: 'Thế điện cực chuẩn E° của cặp Mⁿ⁺/M được đo ở điều kiện chuẩn (25 °C, nồng độ ion 1 M, khí ở 1 bar), so với điện cực hydrogen chuẩn được quy ước E°(2H⁺/H₂) = 0,00 V.'
        },
        {
          type: 'table',
          caption: 'Thế điện cực chuẩn của một số cặp oxi hóa – khử ở 25 °C',
          head: ['Cặp', 'Bán phản ứng', 'E°'],
          rows: STANDARD_POTENTIALS.map(([pair, half, value]) => [pair, half, volts(value)])
        },
        {
          type: 'callout',
          title: 'Đọc bảng',
          text: 'E° càng **nhỏ**: dạng khử (kim loại) có tính khử càng **mạnh**, dạng oxi hóa (ion) có tính oxi hóa càng yếu. E° càng **lớn**: ion có tính oxi hóa càng mạnh, kim loại có tính khử càng yếu.'
        },
        {
          type: 'p',
          text: 'Phản ứng tự xảy ra theo chiều: **chất oxi hóa mạnh hơn + chất khử mạnh hơn → chất oxi hóa yếu hơn + chất khử yếu hơn**. Tức là dạng oxi hóa của cặp có E° lớn hơn oxi hóa được dạng khử của cặp có E° nhỏ hơn.'
        }
      ]
    },
    {
      id: 'example-emf',
      kind: 'example',
      title: 'Ví dụ 1 — Sức điện động chuẩn của pin',
      blocks: [
        {
          type: 'equation',
          text: 'E°pin = E°(cathode) − E°(anode)',
          note: 'Cathode là cặp có E° lớn hơn, anode là cặp có E° nhỏ hơn; E°pin luôn dương.'
        },
        {
          type: 'worked',
          problem: 'Tính sức điện động chuẩn của pin Zn–Cu và của pin Fe–Ag. Viết phản ứng xảy ra trong pin Fe–Ag.',
          steps: [
            'Pin Zn–Cu: E°(Cu²⁺/Cu) = +0,34 V > E°(Zn²⁺/Zn) = −0,76 V nên Cu là cathode, Zn là anode.',
            'E°pin = 0,34 − (−0,76) = 1,10 V.',
            'Pin Fe–Ag: E°(Ag⁺/Ag) = +0,80 V > E°(Fe²⁺/Fe) = −0,44 V nên Ag là cathode, Fe là anode.',
            'E°pin = 0,80 − (−0,44) = 1,24 V.',
            'Ở anode: Fe → Fe²⁺ + 2e. Ở cathode: Ag⁺ + e → Ag (nhân 2 để cân bằng electron).'
          ],
          answer: 'E°(Zn–Cu) = 1,10 V; E°(Fe–Ag) = 1,24 V; phản ứng: Fe + 2Ag⁺ → Fe²⁺ + 2Ag.'
        }
      ]
    },
    {
      id: 'example-predict',
      kind: 'example',
      title: 'Ví dụ 2 — Dự đoán phản ứng và tìm kim loại',
      blocks: [
        {
          type: 'worked',
          problem: '(a) Nhúng đinh sắt vào dung dịch CuSO₄ và nhúng dây đồng vào dung dịch FeSO₄. Trường hợp nào có phản ứng? (b) Pin tạo bởi kim loại X (anode) và cặp Cu²⁺/Cu có E°pin = 2,00 V. Tìm E°(Xⁿ⁺/X) và cho biết X.',
          steps: [
            '(a) E°(Cu²⁺/Cu) = +0,34 V > E°(Fe²⁺/Fe) = −0,44 V: Cu²⁺ oxi hóa được Fe ⇒ Fe + Cu²⁺ → Fe²⁺ + Cu xảy ra.',
            'Ngược lại, Fe²⁺ là chất oxi hóa yếu hơn Cu²⁺ nên không oxi hóa được Cu ⇒ dây đồng trong FeSO₄ không phản ứng.',
            '(b) X là anode nên E°pin = E°(Cu²⁺/Cu) − E°(Xⁿ⁺/X) ⇒ E°(Xⁿ⁺/X) = 0,34 − 2,00 = −1,66 V.',
            'Đối chiếu bảng: E°(Al³⁺/Al) = −1,66 V.'
          ],
          answer: '(a) Chỉ đinh sắt trong CuSO₄ phản ứng. (b) E°(Xⁿ⁺/X) = −1,66 V, X là aluminium (Al).'
        }
      ]
    },
    {
      id: 'power-sources',
      kind: 'concept',
      title: 'Một số nguồn điện hóa học',
      blocks: [
        {
          type: 'table',
          caption: 'So sánh nhanh (đặc điểm chính, đã đơn giản hóa)',
          head: ['Loại', 'Nguyên tắc', 'Ưu điểm', 'Hạn chế'],
          rows: [
            ['Acquy chì', 'Điện cực Pb và PbO₂ trong dung dịch H₂SO₄; khi phóng điện: Pb + PbO₂ + 2H₂SO₄ → 2PbSO₄ + 2H₂O. Mỗi ngăn khoảng 2 V.', 'Sạc lại được, giá thấp, dòng điện lớn', 'Nặng; chì và acid độc hại nếu thải bỏ sai cách'],
            ['Pin lithium-ion', 'Ion Li⁺ di chuyển qua chất điện li giữa hai điện cực khi sạc và khi phóng điện.', 'Nhẹ, lưu trữ nhiều năng lượng, sạc lại được', 'Có thể cháy nổ nếu hỏng hoặc quá nhiệt; giá cao hơn'],
            ['Pin nhiên liệu hydrogen', 'H₂ bị oxi hóa ở anode, O₂ bị khử ở cathode; tổng: 2H₂ + O₂ → 2H₂O.', 'Sản phẩm chỉ là nước, hiệu suất cao', 'Lưu trữ, vận chuyển H₂ khó khăn và tốn kém']
          ]
        },
        {
          type: 'p',
          text: 'Pin dùng xong cần được thu gom riêng, không bỏ chung rác sinh hoạt.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Ôn lại với hoạt động có hướng dẫn',
      blocks: [
        {
          type: 'p',
          text: 'Phòng thí nghiệm ảo hiện chưa mô phỏng được pin điện hóa có đo điện áp, nên bước này dùng hoạt động ôn tập ngắn về anode, cathode và chiều electron.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Thế điện cực và nguồn điện hóa học',
          text: 'Nội dung ngắn từ phiên bản trước. Quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'guided', grade: 12, lessonId: 'g12-l15', experimentId: 'g12-lesson-15' }
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
          id: 'g12-l15-c1',
          question: 'Trong pin Zn–Cu, điện cực bị oxi hóa là',
          options: [
            { id: 'a', text: 'Cu, đóng vai trò cathode' },
            { id: 'b', text: 'Zn, đóng vai trò anode' },
            { id: 'c', text: 'Zn, đóng vai trò cathode' },
            { id: 'd', text: 'cầu muối' }
          ],
          correct: 'b',
          explanation: 'Zn có E° nhỏ hơn nên nhường electron: Zn → Zn²⁺ + 2e. Quá trình oxi hóa xảy ra ở anode.'
        },
        {
          type: 'quiz',
          id: 'g12-l15-c2',
          question: 'Biết E°(Ni²⁺/Ni) = −0,26 V và E°(Cu²⁺/Cu) = +0,34 V. Sức điện động chuẩn của pin Ni–Cu là',
          options: [
            { id: 'a', text: '0,08 V' },
            { id: 'b', text: '0,60 V' },
            { id: 'c', text: '−0,60 V' },
            { id: 'd', text: '0,34 V' }
          ],
          correct: 'b',
          explanation: 'E°pin = E°(cathode) − E°(anode) = 0,34 − (−0,26) = 0,60 V.'
        },
        {
          type: 'quiz',
          id: 'g12-l15-c3',
          question: 'Dựa vào bảng thế điện cực chuẩn, kim loại có tính khử mạnh nhất trong dãy Mg, Zn, Fe, Cu là',
          options: [
            { id: 'a', text: 'Cu' },
            { id: 'b', text: 'Fe' },
            { id: 'c', text: 'Zn' },
            { id: 'd', text: 'Mg' }
          ],
          correct: 'd',
          explanation: 'E°(Mg²⁺/Mg) = −2,37 V là nhỏ nhất trong bốn cặp nên Mg có tính khử mạnh nhất.'
        },
        {
          type: 'quiz',
          id: 'g12-l15-c4',
          question: 'Phản ứng nào xảy ra được ở điều kiện chuẩn?',
          options: [
            { id: 'a', text: 'Cu + Fe²⁺ → Cu²⁺ + Fe' },
            { id: 'b', text: 'Fe + Cu²⁺ → Fe²⁺ + Cu' },
            { id: 'c', text: 'Cu + Zn²⁺ → Cu²⁺ + Zn' },
            { id: 'd', text: '2Ag + Cu²⁺ → 2Ag⁺ + Cu' }
          ],
          correct: 'b',
          explanation: 'Cu²⁺ (E° = +0,34 V) là chất oxi hóa mạnh hơn Fe²⁺ (E° = −0,44 V) nên oxi hóa được Fe. Ba phản ứng còn lại đi ngược quy tắc.'
        },
        {
          type: 'quiz',
          id: 'g12-l15-c5',
          question: 'Vai trò của cầu muối trong pin Galvani là',
          options: [
            { id: 'a', text: 'cung cấp electron cho cathode' },
            { id: 'b', text: 'làm chất khử ở anode' },
            { id: 'c', text: 'giữ cho hai dung dịch trung hòa điện để dòng điện được duy trì' },
            { id: 'd', text: 'tăng sức điện động của pin' }
          ],
          correct: 'c',
          explanation: 'Ion trong cầu muối di chuyển sang hai dung dịch, bù lại điện tích thay đổi do các quá trình ở điện cực. Electron chỉ đi qua mạch ngoài.'
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
            'Cặp oxi hóa – khử Mⁿ⁺/M: Mⁿ⁺ + ne ⇌ M.',
            'E° càng nhỏ, kim loại khử càng mạnh; E° càng lớn, ion oxi hóa càng mạnh.',
            'Pin Galvani: anode (−) xảy ra oxi hóa, cathode (+) xảy ra khử; electron đi qua mạch ngoài từ anode sang cathode.',
            'E°pin = E°(cathode) − E°(anode); pin Zn–Cu có E° = 1,10 V.',
            'Acquy chì, pin lithium-ion, pin nhiên liệu đều chuyển hóa năng lượng của phản ứng oxi hóa – khử thành điện năng.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Anode luôn là cực dương.', right: 'Trong pin Galvani, anode là **cực âm** (nơi xảy ra oxi hóa); cathode là cực dương.' },
            { wrong: 'E°pin = E°(anode) − E°(cathode).', right: '**E°pin = E°(cathode) − E°(anode)**, luôn dương với pin đang hoạt động.' },
            { wrong: 'Electron di chuyển qua cầu muối.', right: 'Electron đi qua **dây dẫn ở mạch ngoài**; cầu muối chỉ cho ion di chuyển.' },
            { wrong: 'Nhân hệ số của bán phản ứng thì nhân cả E°.', right: 'E° **không phụ thuộc hệ số**: Ag⁺ + e → Ag và 2Ag⁺ + 2e → 2Ag có cùng E° = +0,80 V.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Điện phân** — dùng điện năng để gây ra phản ứng oxi hóa – khử.'
        }
      ]
    }
  ]
}
