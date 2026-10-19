// Hóa học 11 · Chương 4 · Bài 16 — Hydrocarbon không no (alkene, alkyne).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l16',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm alkene, alkyne; công thức chung, đồng phân (cấu tạo, hình học) và danh pháp của alkene, alkyne đơn giản.',
    'Trình bày được đặc điểm liên kết (liên kết đôi, liên kết ba) và tính chất vật lí của hydrocarbon không no.',
    'Trình bày được tính chất hóa học: phản ứng cộng (H₂, halogen, hydrogen halide theo quy tắc Markovnikov, nước), trùng hợp, oxi hóa; phản ứng của alk-1-yne với AgNO₃/NH₃.',
    'Trình bày được phương pháp điều chế và ứng dụng của ethylene, acetylene.'
  ],
  prerequisites: [
    'Bài 15: Alkane, danh pháp mạch carbon.',
    'Hóa 10: liên kết σ và π; liên kết π kém bền hơn σ.'
  ],
  sources: [
    programme('Hydrocarbon không no'),
    textbook(11, 16)
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
          text: 'Người bán trái cây đặt vài quả chuối chín vào thùng chuối xanh để chúng chín nhanh hơn — chuối chín tỏa ra khí ethylene. Ethylene cũng là nguyên liệu làm túi nilon PE. Liên kết đôi trong phân tử ethylene khiến nó hoạt động hóa học hơn alkane như thế nào?'
        },
        {
          type: 'list',
          items: [
            'Viết công thức chung, đồng phân và gọi tên alkene, alkyne.',
            'Viết phản ứng cộng, trùng hợp, oxi hóa; áp dụng quy tắc Markovnikov.',
            'Nhận biết hydrocarbon không no và alk-1-yne.',
            'Biết điều chế và ứng dụng của ethylene, acetylene.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Liên kết đôi = 1σ + 1π; liên kết ba = 1σ + 2π.', 'Liên kết π kém bền, dễ bị phá vỡ.'] }
      ]
    },
    {
      id: 'structure',
      kind: 'concept',
      title: 'Cấu tạo, đồng phân và danh pháp',
      blocks: [
        {
          type: 'table',
          caption: 'Alkene và alkyne',
          head: ['', 'Alkene', 'Alkyne'],
          rows: [
            ['Đặc điểm', 'Một liên kết đôi C=C', 'Một liên kết ba C≡C'],
            ['Công thức chung', 'CₙH₂ₙ (n ≥ 2)', 'CₙH₂ₙ₋₂ (n ≥ 2)'],
            ['Chất đầu dãy', 'C₂H₄ ethylene (ethene), phân tử phẳng, góc 120°', 'C₂H₂ acetylene (ethyne), phân tử thẳng, góc 180°'],
            ['Đuôi tên', '-ene', '-yne']
          ]
        },
        {
          type: 'p',
          text: 'Tên thay thế: chọn mạch chính dài nhất chứa liên kết bội, đánh số từ đầu gần liên kết bội; ghi số chỉ vị trí liên kết bội trước đuôi. Ví dụ: CH₂=CH–CH₂–CH₃ là but-1-ene; CH₃–CH=CH–CH₃ là but-2-ene; CH≡C–CH₃ là propyne.'
        },
        {
          type: 'callout',
          title: 'Đồng phân hình học (cis – trans)',
          text: 'Khi mỗi nguyên tử C của liên kết đôi gắn với hai nhóm khác nhau, alkene có hai dạng: **cis** (hai nhóm thế chính cùng phía) và **trans** (khác phía). Ví dụ cis-but-2-ene và trans-but-2-ene.'
        },
        {
          type: 'p',
          text: 'Tính chất vật lí: C2 – C4 là chất khí; không tan trong nước, nhẹ hơn nước; nhiệt độ sôi tăng theo số nguyên tử C.'
        }
      ]
    },
    {
      id: 'addition',
      kind: 'concept',
      title: 'Phản ứng cộng',
      blocks: [
        {
          type: 'p',
          text: 'Liên kết π kém bền bị phá vỡ, các nguyên tử hoặc nhóm nguyên tử cộng vào hai nguyên tử C của liên kết bội.'
        },
        { type: 'equation', text: 'C₂H₄ + H₂ → C₂H₆', condition: 'Ni, t°', note: 'Cộng hydrogen tạo alkane.' },
        { type: 'equation', text: 'C₂H₄ + Br₂ → C₂H₄Br₂', note: 'Làm mất màu nước bromine: dùng để nhận biết hydrocarbon không no.' },
        { type: 'equation', text: 'C₂H₄ + H₂O → C₂H₅OH', condition: 'H⁺, t°', note: 'Cộng nước tạo alcohol.' },
        { type: 'equation', text: 'C₂H₂ + 2H₂ → C₂H₆', condition: 'Ni, t°', note: 'Alkyne có thể cộng 2 phân tử H₂ (với Pd/PbCO₃ chỉ cộng 1 phân tử tạo alkene).' },
        {
          type: 'callout',
          title: 'Quy tắc Markovnikov',
          text: 'Khi cộng HX (hoặc H₂O) vào alkene bất đối xứng, nguyên tử H chủ yếu cộng vào **nguyên tử C mang nhiều H hơn**, còn X cộng vào C mang ít H hơn.'
        },
        { type: 'equation', text: 'CH₂=CH–CH₃ + HBr → CH₃–CHBr–CH₃', check: false, note: 'Sản phẩm chính: 2-bromopropane (sản phẩm phụ: 1-bromopropane).' }
      ]
    },
    {
      id: 'other-reactions',
      kind: 'concept',
      title: 'Trùng hợp, oxi hóa và phản ứng của alk-1-yne',
      blocks: [
        { type: 'heading', text: 'Phản ứng trùng hợp' },
        { type: 'equation', text: 'nCH₂=CH₂ → (–CH₂–CH₂–)ₙ', condition: 'xt, t°, p', note: 'Tạo polyethylene (PE), dùng làm túi, màng bọc.', check: false },
        { type: 'heading', text: 'Phản ứng oxi hóa' },
        { type: 'equation', text: 'C₂H₄ + 3O₂ → 2CO₂ + 2H₂O', condition: 't°', note: 'Đốt cháy alkene: n(CO₂) = n(H₂O).' },
        { type: 'equation', text: '2C₂H₂ + 5O₂ → 4CO₂ + 2H₂O', condition: 't°', note: 'Ngọn lửa oxygen – acetylene rất nóng, dùng hàn và cắt kim loại.' },
        { type: 'equation', text: '3C₂H₄ + 2KMnO₄ + 4H₂O → 3C₂H₄(OH)₂ + 2MnO₂ + 2KOH', note: 'Làm mất màu tím của dung dịch KMnO₄, tạo kết tủa nâu đen MnO₂.' },
        { type: 'heading', text: 'Phản ứng của alk-1-yne (có H gắn ở C mang liên kết ba)' },
        { type: 'equation', text: 'C₂H₂ + 2AgNO₃ + 2NH₃ → C₂Ag₂ + 2NH₄NO₃', note: 'Tạo kết tủa vàng nhạt: dùng nhận biết acetylene và alk-1-yne.' }
      ]
    },
    {
      id: 'preparation',
      kind: 'concept',
      title: 'Điều chế và ứng dụng',
      blocks: [
        { type: 'equation', text: 'C₂H₅OH → C₂H₄ + H₂O', condition: 'H₂SO₄ đặc, 170 °C', note: 'Điều chế ethylene trong phòng thí nghiệm.' },
        { type: 'equation', text: 'CaC₂ + 2H₂O → C₂H₂ + Ca(OH)₂', note: 'Điều chế acetylene từ đất đèn (calcium carbide).' },
        {
          type: 'list',
          items: [
            'Trong công nghiệp, ethylene, propylene được sản xuất chủ yếu bằng cracking dầu mỏ.',
            'Ethylene: sản xuất PE, ethanol, PVC; kích thích quả mau chín.',
            'Acetylene: đèn xì oxygen – acetylene; nguyên liệu tổng hợp hữu cơ.'
          ]
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Hỗn hợp alkane và alkene',
      blocks: [
        {
          type: 'worked',
          problem: 'Dẫn 4,958 L hỗn hợp khí gồm ethane và ethylene (điều kiện chuẩn, 24,79 L/mol) qua dung dịch bromine dư, thấy khối lượng bình tăng 2,8 g. Tính phần trăm thể tích mỗi khí (C = 12, H = 1).',
          steps: [
            'Chỉ ethylene phản ứng và bị giữ lại trong bình: m(C₂H₄) = 2,8 g ⇒ n = 2,8 / 28 = 0,1 mol.',
            'n(hỗn hợp) = 4,958 / 24,79 = 0,2 mol ⇒ n(C₂H₆) = 0,1 mol.',
            '%V(C₂H₄) = 0,1 / 0,2 × 100% = 50%; %V(C₂H₆) = 50%.'
          ],
          answer: 'Mỗi khí chiếm 50% thể tích. Khối lượng bình bromine tăng bằng khối lượng alkene bị hấp thụ.',
          equations: ['C₂H₄ + Br₂ → C₂H₄Br₂']
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: ethylene làm mất màu nước bromine',
      blocks: [
        {
          type: 'p',
          text: 'Trong phòng thí nghiệm ảo, cho ethylene tác dụng với nước bromine và quan sát màu dung dịch. Mở thêm Compound Studio, nhập C2H4 và C2H2 để so sánh hình dạng phân tử phẳng và thẳng.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Hydrocarbon không no',
          text: 'Mở trong Phòng thí nghiệm ảo.',
          action: { kind: 'guided', grade: 11, lessonId: 'g11-l16', experimentId: 'g11-lesson-16' }
        },
        {
          type: 'activity',
          title: 'Công cụ — Compound Studio (C2H4, C2H2)',
          text: 'Quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'tool', tool: 'compound' }
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
          id: 'g11-l16-c1',
          question: 'Chất nào làm mất màu nước bromine?',
          options: [
            { id: 'a', text: 'CH₄' },
            { id: 'b', text: 'C₂H₆' },
            { id: 'c', text: 'C₂H₄' },
            { id: 'd', text: 'C₃H₈' }
          ],
          correct: 'c',
          explanation: 'Ethylene có liên kết đôi nên cộng Br₂; các alkane không phản ứng.'
        },
        {
          type: 'quiz',
          id: 'g11-l16-c2',
          question: 'Sản phẩm chính khi cho propene CH₂=CH–CH₃ cộng HCl là',
          options: [
            { id: 'a', text: 'CH₃–CH₂–CH₂Cl' },
            { id: 'b', text: 'CH₃–CHCl–CH₃' },
            { id: 'c', text: 'CH₂Cl–CHCl–CH₃' },
            { id: 'd', text: 'CH₃–CH₂–CH₃' }
          ],
          correct: 'b',
          explanation: 'Theo quy tắc Markovnikov, H cộng vào C đầu mạch (CH₂, nhiều H hơn), Cl cộng vào C giữa.'
        },
        {
          type: 'quiz',
          id: 'g11-l16-c3',
          question: 'Thuốc thử phân biệt acetylene với ethylene là',
          options: [
            { id: 'a', text: 'nước bromine' },
            { id: 'b', text: 'dung dịch AgNO₃ trong NH₃' },
            { id: 'c', text: 'dung dịch KMnO₄' },
            { id: 'd', text: 'quỳ tím' }
          ],
          correct: 'b',
          explanation: 'Chỉ acetylene (alk-1-yne) tạo kết tủa vàng nhạt C₂Ag₂; cả hai đều làm mất màu nước bromine và KMnO₄.'
        },
        {
          type: 'quiz',
          id: 'g11-l16-c4',
          question: 'Chất nào có đồng phân hình học?',
          options: [
            { id: 'a', text: 'CH₂=CH₂' },
            { id: 'b', text: 'CH₂=CH–CH₃' },
            { id: 'c', text: 'CH₃–CH=CH–CH₃' },
            { id: 'd', text: 'CH₂=C(CH₃)₂' }
          ],
          correct: 'c',
          explanation: 'Mỗi C của liên kết đôi trong but-2-ene gắn với hai nhóm khác nhau (H và CH₃) nên có cis và trans.'
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
            'Alkene CₙH₂ₙ (C=C), alkyne CₙH₂ₙ₋₂ (C≡C); đuôi -ene, -yne.',
            'Phản ứng cộng H₂, Br₂ (nhận biết), HX (quy tắc Markovnikov), H₂O; trùng hợp; làm mất màu KMnO₄.',
            'Alk-1-yne tạo kết tủa vàng nhạt với AgNO₃/NH₃.',
            'Ethylene: từ cracking hoặc tách nước ethanol; acetylene: từ CaC₂ + H₂O.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Dùng nước bromine để phân biệt ethylene và acetylene.', right: 'Cả hai đều làm mất màu nước bromine; dùng **AgNO₃/NH₃** (chỉ acetylene tạo kết tủa).' },
            { wrong: 'CH₂=CH–CH₃ cộng HBr tạo chủ yếu 1-bromopropane.', right: 'Theo Markovnikov, sản phẩm chính là **2-bromopropane**.' },
            { wrong: 'But-1-ene có đồng phân hình học.', right: 'C đầu mạch của but-1-ene gắn 2 nguyên tử H giống nhau nên **không** có cis – trans.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Arene (hydrocarbon thơm)**.'
        }
      ]
    }
  ]
}
