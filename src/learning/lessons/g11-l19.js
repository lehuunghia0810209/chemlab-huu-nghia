// Hóa học 11 · Chương 5 · Bài 19 — Dẫn xuất halogen.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l19',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm dẫn xuất halogen; viết được công thức cấu tạo, gọi được tên (thay thế, gốc – chức) của một số dẫn xuất halogen đơn giản.',
    'Nêu được tính chất vật lí của dẫn xuất halogen.',
    'Trình bày được tính chất hóa học: phản ứng thế nguyên tử halogen bằng nhóm −OH, phản ứng tách hydrogen halide (quy tắc Zaitsev).',
    'Trình bày được ứng dụng và tác hại của một số dẫn xuất halogen (CFC, thuốc trừ sâu…).'
  ],
  prerequisites: [
    'Chương 4: hydrocarbon, danh pháp mạch carbon, alkene.',
    'Hóa 10: độ âm điện; liên kết C–X phân cực.'
  ],
  sources: [
    programme('Dẫn xuất halogen'),
    textbook(11, 19)
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
          text: 'Từ những năm 1930, các chất CFC (chứa chlorine, fluorine) được dùng rộng rãi trong tủ lạnh, bình xịt vì rất bền và không độc. Nhưng chính độ bền ấy khiến chúng bay lên tầng bình lưu và phá hủy tầng ozone. Dẫn xuất halogen có cấu tạo và tính chất gì?'
        },
        {
          type: 'list',
          items: [
            'Nêu khái niệm, gọi tên dẫn xuất halogen.',
            'Viết phản ứng thế halogen bằng nhóm −OH và phản ứng tách HX.',
            'Áp dụng quy tắc Zaitsev xác định sản phẩm chính.',
            'Nêu ứng dụng và tác hại của dẫn xuất halogen.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Gọi tên alkane, alkene theo danh pháp thay thế.', 'Liên kết C–X phân cực về phía X (độ âm điện lớn hơn).'] }
      ]
    },
    {
      id: 'definition',
      kind: 'concept',
      title: 'Khái niệm và danh pháp',
      blocks: [
        {
          type: 'callout',
          title: 'Dẫn xuất halogen',
          text: 'Khi thay thế một hay nhiều nguyên tử hydrogen trong phân tử hydrocarbon bằng nguyên tử halogen, ta được dẫn xuất halogen của hydrocarbon. Ví dụ CH₃Cl, CH₂=CHCl, C₆H₅Br.'
        },
        {
          type: 'table',
          caption: 'Hai cách gọi tên',
          head: ['Chất', 'Tên thay thế', 'Tên gốc – chức'],
          rows: [
            ['CH₃Cl', 'chloromethane', 'methyl chloride'],
            ['CH₃CH₂Br', 'bromoethane', 'ethyl bromide'],
            ['CH₃CHClCH₃', '2-chloropropane', 'isopropyl chloride'],
            ['CH₂=CHCl', 'chloroethene', 'vinyl chloride'],
            ['CHCl₃', 'trichloromethane', 'chloroform (tên thông thường)']
          ]
        },
        {
          type: 'p',
          text: 'Tên thay thế: số chỉ vị trí – tên halogen (fluoro, chloro, bromo, iodo) + tên hydrocarbon. Tên gốc – chức: tên gốc hydrocarbon + tên halide.'
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
            'Ở điều kiện thường, các dẫn xuất có phân tử khối nhỏ như CH₃Cl, CH₃Br, C₂H₅Cl là chất khí; phần lớn các dẫn xuất khác là chất lỏng hoặc rắn.',
            'Hầu như không tan trong nước, tan tốt trong dung môi hữu cơ.',
            'Nhiệt độ sôi cao hơn hydrocarbon có cùng số nguyên tử C và tăng theo thứ tự F < Cl < Br < I (phân tử khối tăng).'
          ]
        }
      ]
    },
    {
      id: 'reactions',
      kind: 'concept',
      title: 'Tính chất hóa học',
      blocks: [
        {
          type: 'p',
          text: 'Liên kết C–X phân cực, nguyên tử C mang một phần điện tích dương nên nguyên tử halogen dễ bị thay thế hoặc bị tách ra cùng một nguyên tử H bên cạnh.'
        },
        { type: 'heading', text: 'Phản ứng thế nguyên tử halogen bằng nhóm −OH' },
        { type: 'equation', text: 'C₂H₅Br + NaOH → C₂H₅OH + NaBr', condition: 't°, dung dịch NaOH trong nước', note: 'Tạo alcohol.' },
        { type: 'heading', text: 'Phản ứng tách hydrogen halide' },
        { type: 'equation', text: 'C₂H₅Br + KOH → C₂H₄ + KBr + H₂O', condition: 't°, KOH trong ethanol', note: 'Tạo alkene.' },
        {
          type: 'callout',
          title: 'Quy tắc Zaitsev',
          text: 'Khi tách HX, nguyên tử halogen bị tách ra cùng với nguyên tử H ở **carbon bên cạnh có bậc cao hơn** (ít H hơn), tạo sản phẩm chính là alkene có nhiều nhóm thế hơn.'
        },
        {
          type: 'p',
          text: 'Ví dụ: 2-bromobutane CH₃–CHBr–CH₂–CH₃ tách HBr tạo sản phẩm chính là but-2-ene (CH₃–CH=CH–CH₃), sản phẩm phụ là but-1-ene.'
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Cùng chất đầu, khác dung môi',
          text: 'NaOH trong **nước** ⇒ phản ứng thế tạo alcohol. KOH trong **ethanol** ⇒ phản ứng tách tạo alkene.'
        }
      ]
    },
    {
      id: 'uses',
      kind: 'concept',
      title: 'Ứng dụng và tác hại',
      blocks: [
        {
          type: 'table',
          caption: 'Một số dẫn xuất halogen',
          head: ['Chất', 'Ứng dụng', 'Lưu ý'],
          rows: [
            ['CH₂=CHCl (vinyl chloride)', 'Sản xuất nhựa PVC', 'Monomer độc'],
            ['CF₂=CF₂', 'Sản xuất Teflon (chất chống dính)', ''],
            ['CFC (ví dụ CCl₂F₂)', 'Từng dùng làm chất làm lạnh, chất đẩy bình xịt', 'Phá hủy tầng ozone, đã bị cấm theo Nghị định thư Montreal'],
            ['Một số dẫn xuất chứa chlorine', 'Thuốc trừ sâu, thuốc bảo vệ thực vật', 'Tồn lưu lâu trong môi trường (như DDT)']
          ]
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Xác định sản phẩm và lượng chất',
      blocks: [
        {
          type: 'worked',
          problem: 'Đun nóng 10,9 g bromoethane với dung dịch NaOH (trong nước) dư. (a) Viết phương trình phản ứng. (b) Tính khối lượng ethanol thu được, biết hiệu suất 80% (C = 12, H = 1, Br = 80, O = 16).',
          steps: [
            '(a) C₂H₅Br + NaOH → C₂H₅OH + NaBr (phản ứng thế).',
            '(b) M(C₂H₅Br) = 109 ⇒ n = 10,9 / 109 = 0,1 mol ⇒ ethanol lí thuyết 0,1 mol.',
            'm(C₂H₅OH) = 0,1 × 46 × 80% = 3,68 g.'
          ],
          answer: 'Thu được 3,68 g ethanol.',
          equations: ['C₂H₅Br + NaOH → C₂H₅OH + NaBr']
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
          id: 'g11-l19-c1',
          question: 'Tên thay thế của CH₃CH₂Cl là',
          options: [
            { id: 'a', text: 'ethyl chloride' },
            { id: 'b', text: 'chloroethane' },
            { id: 'c', text: 'chloromethane' },
            { id: 'd', text: '1-chloropropane' }
          ],
          correct: 'b',
          explanation: '“Ethyl chloride” là tên gốc – chức; tên thay thế là chloroethane.'
        },
        {
          type: 'quiz',
          id: 'g11-l19-c2',
          question: 'Đun bromoethane với KOH trong ethanol thu được',
          options: [
            { id: 'a', text: 'ethanol' },
            { id: 'b', text: 'ethylene' },
            { id: 'c', text: 'ethane' },
            { id: 'd', text: 'acetylene' }
          ],
          correct: 'b',
          explanation: 'KOH/ethanol gây phản ứng tách HBr tạo alkene.'
        },
        {
          type: 'quiz',
          id: 'g11-l19-c3',
          question: 'Theo quy tắc Zaitsev, sản phẩm chính khi tách HBr từ 2-bromobutane là',
          options: [
            { id: 'a', text: 'but-1-ene' },
            { id: 'b', text: 'but-2-ene' },
            { id: 'c', text: 'butane' },
            { id: 'd', text: 'butan-2-ol' }
          ],
          correct: 'b',
          explanation: 'H bị tách ở C3 (bậc cao hơn C1) tạo liên kết đôi giữa C2 và C3.'
        },
        {
          type: 'quiz',
          id: 'g11-l19-c4',
          question: 'Các chất CFC bị hạn chế sử dụng vì',
          options: [
            { id: 'a', text: 'dễ cháy nổ' },
            { id: 'b', text: 'phá hủy tầng ozone' },
            { id: 'c', text: 'tan nhiều trong nước' },
            { id: 'd', text: 'có tính acid mạnh' }
          ],
          correct: 'b',
          explanation: 'CFC bền, bay lên tầng bình lưu, giải phóng chlorine phá hủy ozone.'
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
            'Dẫn xuất halogen: thay H của hydrocarbon bằng X; tên thay thế (chloroethane) và gốc – chức (ethyl chloride).',
            'Không tan trong nước; nhiệt độ sôi cao hơn hydrocarbon tương ứng.',
            'NaOH/H₂O: thế −X bằng −OH tạo alcohol; KOH/ethanol: tách HX tạo alkene (quy tắc Zaitsev).',
            'Ứng dụng: PVC, Teflon; tác hại: CFC phá tầng ozone, thuốc trừ sâu tồn lưu.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'C₂H₅Br + KOH trong ethanol tạo ethanol.', right: 'Trong **ethanol** xảy ra phản ứng **tách** tạo ethylene; muốn tạo ethanol dùng NaOH trong nước.' },
            { wrong: 'Tách HBr từ 2-bromobutane tạo chủ yếu but-1-ene.', right: 'Theo Zaitsev, sản phẩm chính là **but-2-ene**.' },
            { wrong: 'Dẫn xuất halogen tan tốt trong nước như alcohol.', right: 'Dẫn xuất halogen **hầu như không tan** trong nước.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Alcohol**.'
        }
      ]
    }
  ]
}
