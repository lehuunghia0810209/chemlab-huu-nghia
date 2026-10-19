// Hóa học 11 · Chương 3 · Bài 13 — Cấu tạo hóa học hợp chất hữu cơ.
// Boiling points (1 atm, CRC, rounded): ethanol 78 °C, dimethyl ether −24 °C,
// butane −0,5 °C, isobutane −12 °C.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l13',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được nội dung cơ bản của thuyết cấu tạo hóa học trong hóa học hữu cơ.',
    'Viết được công thức cấu tạo đầy đủ, thu gọn và công thức khung phân tử của một số hợp chất hữu cơ đơn giản.',
    'Nêu được khái niệm đồng đẳng, đồng phân; viết được công thức cấu tạo các đồng phân của hợp chất đơn giản.'
  ],
  prerequisites: [
    'Bài 12: công thức phân tử.',
    'Hóa 10: carbon tạo 4 liên kết cộng hóa trị (hóa trị IV).'
  ],
  sources: [
    programme('Cấu tạo hóa học hợp chất hữu cơ'),
    textbook(11, 13),
    'Nhiệt độ sôi ở 1 atm: CRC Handbook (làm tròn).'
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
          text: 'Ethanol (trong đồ uống có cồn) và dimethyl ether (khí đẩy trong bình xịt) có cùng công thức phân tử C₂H₆O. Thế nhưng ethanol là chất lỏng sôi ở 78 °C, còn dimethyl ether là chất khí. Sự khác biệt nằm ở đâu?'
        },
        {
          type: 'list',
          items: [
            'Nêu nội dung thuyết cấu tạo hóa học.',
            'Viết các loại công thức cấu tạo.',
            'Phân biệt đồng đẳng và đồng phân; viết đồng phân cấu tạo của chất đơn giản.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['C hóa trị IV, H hóa trị I, O hóa trị II, N hóa trị III.', 'Công thức phân tử chỉ cho biết số nguyên tử, không cho biết thứ tự liên kết.'] }
      ]
    },
    {
      id: 'theory',
      kind: 'concept',
      title: 'Thuyết cấu tạo hóa học',
      blocks: [
        {
          type: 'list',
          ordered: true,
          items: [
            'Trong phân tử hợp chất hữu cơ, các nguyên tử liên kết với nhau theo **đúng hóa trị** và theo **một thứ tự nhất định**; thứ tự liên kết đó gọi là **cấu tạo hóa học**. Thay đổi thứ tự liên kết sẽ tạo ra chất khác.',
            'Carbon có hóa trị IV. Các nguyên tử carbon có thể liên kết với nhau tạo thành **mạch carbon**: mạch không nhánh, mạch nhánh hoặc mạch vòng.',
            'Tính chất của chất phụ thuộc vào **thành phần phân tử** (bản chất, số lượng nguyên tử) và **cấu tạo hóa học** (thứ tự liên kết).'
          ]
        },
        {
          type: 'table',
          caption: 'Cùng công thức C₂H₆O, khác cấu tạo',
          head: ['Chất', 'Công thức cấu tạo thu gọn', 'Nhiệt độ sôi', 'Tác dụng với Na'],
          rows: [
            ['Ethanol', 'CH₃–CH₂–OH', '78 °C (lỏng)', 'Có, giải phóng H₂'],
            ['Dimethyl ether', 'CH₃–O–CH₃', '−24 °C (khí)', 'Không']
          ]
        },
        {
          type: 'p',
          text: 'Ethanol có nhóm O–H nên tạo liên kết hydrogen giữa các phân tử; dimethyl ether thì không — vì vậy nhiệt độ sôi khác nhau rất nhiều.'
        }
      ]
    },
    {
      id: 'formulas',
      kind: 'concept',
      title: 'Các loại công thức cấu tạo',
      blocks: [
        {
          type: 'table',
          caption: 'Biểu diễn phân tử butane C₄H₁₀ và ethanol C₂H₆O',
          head: ['Loại', 'Cách viết', 'Ví dụ'],
          rows: [
            ['Công thức cấu tạo đầy đủ', 'Biểu diễn mọi liên kết giữa các nguyên tử bằng gạch nối', 'Mỗi C nối với các H và C bên cạnh bằng gạch'],
            ['Công thức cấu tạo thu gọn', 'Viết gộp nguyên tử C và các nguyên tử liên kết với nó thành nhóm', 'CH₃–CH₂–CH₂–CH₃ hay CH₃CH₂CH₂CH₃; CH₃CH₂OH'],
            ['Công thức khung phân tử', 'Không ghi C và H gắn với C; mỗi đầu mút, chỗ gấp khúc là một nguyên tử C', 'Đường gấp khúc 4 đỉnh cho butane; nhóm OH ghi rõ']
          ]
        }
      ]
    },
    {
      id: 'homologs-isomers',
      kind: 'concept',
      title: 'Đồng đẳng và đồng phân',
      blocks: [
        {
          type: 'callout',
          title: 'Đồng đẳng',
          text: 'Những hợp chất có thành phần phân tử **hơn kém nhau một hay nhiều nhóm CH₂** nhưng có **tính chất hóa học tương tự** nhau là những chất đồng đẳng, hợp thành dãy đồng đẳng. Ví dụ: CH₄, C₂H₆, C₃H₈… (dãy alkane CₙH₂ₙ₊₂).'
        },
        {
          type: 'callout',
          title: 'Đồng phân',
          text: 'Những hợp chất khác nhau nhưng có **cùng công thức phân tử** là các chất đồng phân.'
        },
        {
          type: 'table',
          caption: 'Một số loại đồng phân cấu tạo',
          head: ['Loại', 'Khác nhau ở', 'Ví dụ'],
          rows: [
            ['Đồng phân mạch carbon', 'Mạch không nhánh / có nhánh', 'CH₃CH₂CH₂CH₃ và CH₃CH(CH₃)CH₃ (C₄H₁₀)'],
            ['Đồng phân vị trí nhóm chức', 'Vị trí nhóm chức trên mạch', 'CH₃CH₂CH₂OH và CH₃CH(OH)CH₃ (C₃H₈O)'],
            ['Đồng phân loại nhóm chức', 'Loại nhóm chức', 'CH₃CH₂OH (alcohol) và CH₃OCH₃ (ether) (C₂H₆O)']
          ]
        }
      ]
    },
    {
      id: 'example-isomers',
      kind: 'example',
      title: 'Ví dụ — Viết các đồng phân cấu tạo',
      blocks: [
        {
          type: 'worked',
          problem: 'Viết công thức cấu tạo thu gọn các đồng phân ứng với công thức phân tử (a) C₄H₁₀; (b) C₃H₈O.',
          steps: [
            '(a) C₄H₁₀ chỉ có liên kết đơn. Mạch 4 C không nhánh: CH₃–CH₂–CH₂–CH₃ (butane). Mạch 3 C có nhánh CH₃ ở C giữa: CH₃–CH(CH₃)–CH₃ (isobutane).',
            '(b) C₃H₈O, có 1 nguyên tử O. Alcohol: O–H ở đầu mạch: CH₃–CH₂–CH₂–OH; ở C giữa: CH₃–CH(OH)–CH₃.',
            'Ether: O nằm giữa hai gốc: CH₃–O–CH₂–CH₃.'
          ],
          answer: 'C₄H₁₀ có 2 đồng phân cấu tạo; C₃H₈O có 3 đồng phân cấu tạo (2 alcohol, 1 ether).'
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Mẹo tránh viết trùng',
          text: 'Uốn cong mạch không tạo ra chất mới: CH₂(OH)–CH₂–CH₃ và CH₃–CH₂–CH₂–OH là cùng một chất. Hãy đánh số mạch chính và chỉ thay đổi vị trí nhánh hoặc nhóm chức.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Hai đồng phân, cùng thành phần',
      blocks: [
        {
          type: 'p',
          text: 'Mở Compound Studio, lần lượt nhập C2H5OH và CH3OCH3. Khối lượng mol và phần trăm khối lượng các nguyên tố của hai chất giống hệt nhau — chỉ cấu tạo (vị trí nguyên tử O) khác nhau. Đó chính là đồng phân.'
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
          id: 'g11-l13-c1',
          question: 'Cặp chất nào là đồng phân của nhau?',
          options: [
            { id: 'a', text: 'CH₄ và C₂H₆' },
            { id: 'b', text: 'C₂H₅OH và CH₃OCH₃' },
            { id: 'c', text: 'CH₃OH và C₂H₅OH' },
            { id: 'd', text: 'C₂H₄ và C₂H₆' }
          ],
          correct: 'b',
          explanation: 'Cùng công thức phân tử C₂H₆O nhưng khác cấu tạo. CH₄ – C₂H₆ và CH₃OH – C₂H₅OH là các cặp đồng đẳng.'
        },
        {
          type: 'quiz',
          id: 'g11-l13-c2',
          question: 'Các chất trong một dãy đồng đẳng hơn kém nhau',
          options: [
            { id: 'a', text: 'một hay nhiều nhóm CH₂' },
            { id: 'b', text: 'một nguyên tử C' },
            { id: 'c', text: 'một nhóm OH' },
            { id: 'd', text: 'một nguyên tử H' }
          ],
          correct: 'a',
          explanation: 'Ví dụ CH₄, C₂H₆, C₃H₈ hơn kém nhau CH₂.'
        },
        {
          type: 'quiz',
          id: 'g11-l13-c3',
          question: 'Số đồng phân cấu tạo ứng với công thức C₅H₁₂ là',
          options: [
            { id: 'a', text: '2' },
            { id: 'b', text: '3' },
            { id: 'c', text: '4' },
            { id: 'd', text: '5' }
          ],
          correct: 'b',
          explanation: 'CH₃(CH₂)₃CH₃; CH₃CH(CH₃)CH₂CH₃; C(CH₃)₄.'
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
            'Thuyết cấu tạo hóa học: nguyên tử liên kết đúng hóa trị theo thứ tự xác định; C hóa trị IV tạo mạch carbon; tính chất phụ thuộc thành phần và cấu tạo.',
            'Công thức cấu tạo: đầy đủ, thu gọn, khung phân tử.',
            'Đồng đẳng: hơn kém CH₂, tính chất hóa học tương tự. Đồng phân: cùng công thức phân tử, khác cấu tạo.',
            'Các loại đồng phân cấu tạo: mạch carbon, vị trí nhóm chức, loại nhóm chức.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'CH₃OH và C₂H₅OH là đồng phân của nhau.', right: 'Hai chất khác công thức phân tử, hơn kém CH₂: là **đồng đẳng**.' },
            { wrong: 'Viết CH₂(OH)–CH₂–CH₃ như một đồng phân mới của CH₃CH₂CH₂OH.', right: 'Đó vẫn là **cùng một chất**; chỉ là cách viết khác của mạch.' },
            { wrong: 'Các đồng phân có tính chất giống nhau vì cùng công thức phân tử.', right: 'Tính chất phụ thuộc **cấu tạo**: ethanol lỏng, dimethyl ether khí.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Ôn tập chương 3**.'
        }
      ]
    }
  ]
}
