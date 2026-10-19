// Hóa học 11 · Chương 3 · Bài 10 — Hợp chất hữu cơ và hóa học hữu cơ.
// IR ranges: typical textbook values (cm⁻¹), rounded.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l10',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm hợp chất hữu cơ, hóa học hữu cơ và đặc điểm chung của các hợp chất hữu cơ.',
    'Phân loại được hợp chất hữu cơ (hydrocarbon và dẫn xuất của hydrocarbon).',
    'Nêu được khái niệm nhóm chức và một số loại nhóm chức cơ bản.',
    'Sử dụng được bảng tín hiệu phổ hồng ngoại (IR) để xác định một số nhóm chức đơn giản.'
  ],
  prerequisites: [
    'Hóa 10: liên kết cộng hóa trị, độ âm điện, liên kết hydrogen.',
    'KHTN: một số chất hữu cơ quen thuộc (methane, ethanol, acetic acid, glucose).'
  ],
  sources: [
    programme('Hợp chất hữu cơ và hóa học hữu cơ'),
    textbook(11, 10),
    'Vùng hấp thụ IR: giá trị điển hình trong bảng tra cứu phổ hồng ngoại (làm tròn).'
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
          text: 'Số hợp chất hữu cơ đã biết lên tới hàng chục triệu, nhiều hơn rất nhiều so với hợp chất vô cơ — dù chúng chủ yếu chỉ được tạo nên từ vài nguyên tố C, H, O, N. Vì sao carbon tạo ra được sự đa dạng như vậy, và làm sao phân loại chúng?'
        },
        {
          type: 'list',
          items: [
            'Nêu khái niệm và đặc điểm chung của hợp chất hữu cơ.',
            'Phân loại hydrocarbon và dẫn xuất của hydrocarbon.',
            'Nhận ra các nhóm chức cơ bản.',
            'Đọc phổ IR để xác định một số nhóm chức.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['C (Z = 6) có 4 electron lớp ngoài cùng, tạo 4 liên kết cộng hóa trị.', 'Liên kết cộng hóa trị phân cực khi hai nguyên tử có độ âm điện khác nhau.'] }
      ]
    },
    {
      id: 'definition',
      kind: 'concept',
      title: 'Hợp chất hữu cơ và đặc điểm chung',
      blocks: [
        {
          type: 'callout',
          title: 'Hợp chất hữu cơ',
          text: 'Là hợp chất của carbon, **trừ** một số hợp chất như CO, CO₂, muối carbonate, cyanide, carbide… **Hóa học hữu cơ** là ngành hóa học nghiên cứu các hợp chất hữu cơ.'
        },
        {
          type: 'table',
          caption: 'Đặc điểm chung của hợp chất hữu cơ',
          head: ['Đặc điểm', 'Nội dung'],
          rows: [
            ['Thành phần', 'Nhất thiết có C, thường có H, hay gặp O, N, halogen, S, P'],
            ['Liên kết', 'Chủ yếu là liên kết cộng hóa trị'],
            ['Tính chất vật lí', 'Thường dễ bay hơi, nhiệt độ nóng chảy, nhiệt độ sôi thấp; ít tan trong nước, tan nhiều trong dung môi hữu cơ'],
            ['Tính chất hóa học', 'Kém bền với nhiệt, dễ cháy; phản ứng thường chậm, không hoàn toàn, theo nhiều hướng tạo hỗn hợp sản phẩm']
          ]
        },
        { type: 'equation', text: 'C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O', condition: 't°', note: 'Hầu hết hợp chất hữu cơ cháy được, tạo CO₂ và H₂O.' }
      ]
    },
    {
      id: 'classification',
      kind: 'concept',
      title: 'Phân loại hợp chất hữu cơ',
      blocks: [
        {
          type: 'table',
          caption: 'Hai loại chính',
          head: ['Loại', 'Thành phần', 'Ví dụ'],
          rows: [
            ['Hydrocarbon', 'Chỉ chứa C và H', 'CH₄ (methane), C₂H₄ (ethylene), C₂H₂ (acetylene), C₆H₆ (benzene)'],
            ['Dẫn xuất của hydrocarbon', 'Ngoài C, H còn có nguyên tố khác (O, N, halogen…)', 'CH₃Cl, C₂H₅OH, CH₃COOH, CH₃NH₂']
          ]
        },
        {
          type: 'p',
          text: 'Hydrocarbon được chia tiếp thành hydrocarbon no (alkane), không no (alkene, alkyne) và thơm (arene). Dẫn xuất được chia theo nhóm chức.'
        }
      ]
    },
    {
      id: 'functional-groups',
      kind: 'concept',
      title: 'Nhóm chức',
      blocks: [
        {
          type: 'callout',
          title: 'Nhóm chức',
          text: 'Là nguyên tử hoặc nhóm nguyên tử gây ra những phản ứng hóa học đặc trưng của phân tử hợp chất hữu cơ.'
        },
        {
          type: 'table',
          caption: 'Một số nhóm chức cơ bản',
          head: ['Loại hợp chất', 'Nhóm chức', 'Ví dụ'],
          rows: [
            ['Dẫn xuất halogen', '−X (F, Cl, Br, I)', 'C₂H₅Cl'],
            ['Alcohol', '−OH (gắn với C no)', 'C₂H₅OH'],
            ['Ether', '−O− (giữa hai gốc hydrocarbon)', 'CH₃OCH₃'],
            ['Aldehyde', '−CHO', 'CH₃CHO'],
            ['Ketone', '>C=O (giữa hai gốc)', 'CH₃COCH₃'],
            ['Carboxylic acid', '−COOH', 'CH₃COOH'],
            ['Ester', '−COO−', 'CH₃COOC₂H₅'],
            ['Amine', '−NH₂', 'CH₃NH₂']
          ]
        }
      ]
    },
    {
      id: 'ir',
      kind: 'concept',
      title: 'Phổ hồng ngoại (IR)',
      blocks: [
        {
          type: 'p',
          text: 'Khi chiếu bức xạ hồng ngoại qua mẫu chất, mỗi loại liên kết hấp thụ năng lượng ở một vùng số sóng (cm⁻¹) đặc trưng. Phổ IR cho biết phân tử có hay không có một số nhóm chức.'
        },
        {
          type: 'table',
          caption: 'Vùng hấp thụ đặc trưng (giá trị điển hình)',
          head: ['Liên kết', 'Hợp chất', 'Số sóng (cm⁻¹)', 'Đặc điểm tín hiệu'],
          rows: [
            ['O–H', 'Alcohol, phenol', '3200 – 3600', 'Rộng'],
            ['O–H', 'Carboxylic acid', '2500 – 3300', 'Rất rộng'],
            ['N–H', 'Amine', '3300 – 3500', 'Trung bình'],
            ['C–H', 'Hydrocarbon no', '2850 – 3000', 'Mạnh'],
            ['C=O', 'Aldehyde, ketone, acid, ester', '1650 – 1750', 'Mạnh, nhọn']
          ]
        }
      ]
    },
    {
      id: 'example-ir',
      kind: 'example',
      title: 'Ví dụ — Đọc phổ IR',
      blocks: [
        {
          type: 'worked',
          problem: 'Phổ IR của chất X có một tín hiệu mạnh, nhọn ở khoảng 1715 cm⁻¹ và một tín hiệu rất rộng trải từ khoảng 2500 đến 3300 cm⁻¹. Chất Y chỉ có tín hiệu rộng ở khoảng 3350 cm⁻¹, không có tín hiệu trong vùng 1650 – 1750 cm⁻¹. Hãy cho biết X, Y có thể thuộc loại hợp chất nào: CH₃COOH, C₂H₅OH, CH₃COCH₃?',
          steps: [
            'X: tín hiệu C=O (1715 cm⁻¹) kèm O–H rất rộng 2500 – 3300 cm⁻¹ ⇒ carboxylic acid ⇒ CH₃COOH.',
            'Y: O–H rộng ở 3350 cm⁻¹, không có C=O ⇒ alcohol ⇒ C₂H₅OH.',
            'CH₃COCH₃ (ketone) sẽ có tín hiệu C=O nhưng không có tín hiệu O–H.'
          ],
          answer: 'X là CH₃COOH, Y là C₂H₅OH.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Phân tích thành phần nguyên tố',
      blocks: [
        {
          type: 'p',
          text: 'Mở Compound Studio, lần lượt nhập C2H5OH và CH3COOH. Đọc khối lượng mol và phần trăm khối lượng từng nguyên tố: cả hai đều chỉ gồm C, H, O nhưng thuộc hai loại hợp chất khác nhau vì có nhóm chức khác nhau (−OH và −COOH).'
        },
        {
          type: 'activity',
          title: 'Công cụ — Compound Studio',
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
          id: 'g11-l10-c1',
          question: 'Chất nào là hợp chất hữu cơ?',
          options: [
            { id: 'a', text: 'CO₂' },
            { id: 'b', text: 'CaCO₃' },
            { id: 'c', text: 'CH₃COOH' },
            { id: 'd', text: 'NaCN' }
          ],
          correct: 'c',
          explanation: 'CO₂, muối carbonate, cyanide tuy chứa C nhưng được xếp vào hợp chất vô cơ.'
        },
        {
          type: 'quiz',
          id: 'g11-l10-c2',
          question: 'Nhóm chức −COOH là nhóm chức của',
          options: [
            { id: 'a', text: 'alcohol' },
            { id: 'b', text: 'aldehyde' },
            { id: 'c', text: 'carboxylic acid' },
            { id: 'd', text: 'ester' }
          ],
          correct: 'c',
          explanation: 'Nhóm carboxyl −COOH đặc trưng cho carboxylic acid.'
        },
        {
          type: 'quiz',
          id: 'g11-l10-c3',
          question: 'Tín hiệu mạnh ở khoảng 1650 – 1750 cm⁻¹ trên phổ IR cho biết phân tử có liên kết',
          options: [
            { id: 'a', text: 'O–H' },
            { id: 'b', text: 'C=O' },
            { id: 'c', text: 'C–H' },
            { id: 'd', text: 'N–H' }
          ],
          correct: 'b',
          explanation: 'Nhóm carbonyl C=O hấp thụ mạnh ở vùng 1650 – 1750 cm⁻¹.'
        },
        {
          type: 'quiz',
          id: 'g11-l10-c4',
          question: 'Đặc điểm nào không phải là đặc điểm chung của hợp chất hữu cơ?',
          options: [
            { id: 'a', text: 'Liên kết chủ yếu là liên kết cộng hóa trị' },
            { id: 'b', text: 'Thường dễ cháy' },
            { id: 'c', text: 'Phản ứng thường xảy ra nhanh và hoàn toàn theo một hướng' },
            { id: 'd', text: 'Thường có nhiệt độ sôi thấp' }
          ],
          correct: 'c',
          explanation: 'Phản ứng hữu cơ thường chậm, không hoàn toàn và theo nhiều hướng.'
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
            'Hợp chất hữu cơ là hợp chất của carbon (trừ CO, CO₂, muối carbonate, cyanide, carbide…).',
            'Đặc điểm: liên kết cộng hóa trị, dễ cháy, nhiệt độ sôi thấp, phản ứng chậm theo nhiều hướng.',
            'Phân loại: hydrocarbon (chỉ C, H) và dẫn xuất của hydrocarbon (theo nhóm chức).',
            'Phổ IR: O–H 3200 – 3600 (alcohol), 2500 – 3300 (acid); C=O 1650 – 1750 cm⁻¹.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Mọi hợp chất chứa carbon đều là hợp chất hữu cơ.', right: 'CO, CO₂, muối carbonate, cyanide, carbide… là **hợp chất vô cơ**.' },
            { wrong: 'CH₃COCH₃ và CH₃CHO có cùng nhóm chức.', right: 'CH₃CHO có nhóm **−CHO (aldehyde)**; CH₃COCH₃ có nhóm C=O giữa hai gốc (**ketone**).' },
            { wrong: 'Thấy tín hiệu C=O trên phổ IR là kết luận chất là carboxylic acid.', right: 'Aldehyde, ketone, ester cũng có C=O; acid còn có **O–H rất rộng 2500 – 3300 cm⁻¹**.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Phương pháp tách biệt và tinh chế hợp chất hữu cơ**.'
        }
      ]
    }
  ]
}
