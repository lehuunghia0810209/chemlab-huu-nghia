// Hóa học 10 · Chương 3 · Bài 13 — Liên kết hydrogen và tương tác van der Waals.
// Boiling points at 1 atm (CRC, rounded to whole °C).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l13',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm liên kết hydrogen, các nguyên tử tham gia liên kết hydrogen.',
    'Giải thích được ảnh hưởng của liên kết hydrogen đến tính chất vật lí của nước (nhiệt độ sôi, khối lượng riêng của nước đá).',
    'Nêu được khái niệm tương tác van der Waals và ảnh hưởng của nó đến nhiệt độ nóng chảy, nhiệt độ sôi của các chất.'
  ],
  prerequisites: [
    'Bài 12: liên kết cộng hóa trị phân cực, độ âm điện.',
    'Nhiệt độ sôi càng cao khi lực hút giữa các phân tử càng mạnh.'
  ],
  sources: [
    programme('Liên kết hydrogen và tương tác van der Waals'),
    textbook(10, 13),
    'Nhiệt độ sôi ở 1 atm: CRC Handbook (làm tròn đến °C).'
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
          text: 'H₂O và H₂S có công thức giống nhau, H₂S còn nặng hơn. Thế nhưng ở nhiệt độ phòng nước là chất lỏng (sôi ở 100 °C), còn H₂S là chất khí (sôi ở khoảng −60 °C). Và vì sao nước đá lại nổi trên nước?'
        },
        {
          type: 'list',
          items: [
            'Hiểu liên kết hydrogen hình thành giữa những nguyên tử nào.',
            'Giải thích nhiệt độ sôi bất thường của H₂O, HF, NH₃ và vì sao nước đá nhẹ hơn nước.',
            'Hiểu tương tác van der Waals và xu hướng nhiệt độ sôi theo khối lượng phân tử.',
            'So sánh độ mạnh các loại liên kết và tương tác.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Liên kết O–H, N–H, F–H phân cực mạnh.', 'Nguyên tử O, N, F còn cặp electron riêng.'] }
      ]
    },
    {
      id: 'hydrogen-bond',
      kind: 'concept',
      title: 'Liên kết hydrogen',
      blocks: [
        {
          type: 'callout',
          title: 'Liên kết hydrogen',
          text: 'Là tương tác tĩnh điện giữa nguyên tử **H (đã liên kết với nguyên tử có độ âm điện lớn F, O, N)** và một nguyên tử **F, O hoặc N khác còn cặp electron riêng**.'
        },
        {
          type: 'p',
          text: 'Trong liên kết O–H, cặp electron lệch mạnh về O nên H mang một phần điện tích dương (δ+). Nguyên tử H này bị hút bởi cặp electron riêng của nguyên tử O ở phân tử nước bên cạnh. Liên kết hydrogen thường được kí hiệu bằng dấu ba chấm: O–H···O.'
        },
        {
          type: 'list',
          items: [
            'Có liên kết hydrogen giữa các phân tử: H₂O, HF, NH₃, alcohol (C₂H₅OH)…',
            'Giữa phân tử của chất này với phân tử của chất khác: ví dụ giữa C₂H₅OH và H₂O, nên ethanol tan vô hạn trong nước.',
            'Liên kết hydrogen yếu hơn nhiều so với liên kết cộng hóa trị hay liên kết ion, nhưng mạnh hơn tương tác van der Waals.'
          ]
        }
      ]
    },
    {
      id: 'water',
      kind: 'concept',
      title: 'Ảnh hưởng đến tính chất của nước',
      blocks: [
        {
          type: 'table',
          caption: 'Nhiệt độ sôi ở 1 atm (°C)',
          head: ['Chất', 'Khối lượng mol (g/mol)', 'Nhiệt độ sôi', 'Liên kết hydrogen giữa các phân tử?'],
          rows: [
            ['H₂O', '18', '100', 'Có'],
            ['H₂S', '34', '−60', 'Không đáng kể'],
            ['HF', '20', '20', 'Có'],
            ['HCl', '36,5', '−85', 'Không đáng kể']
          ]
        },
        {
          type: 'p',
          text: 'Muốn đun sôi nước phải cung cấp năng lượng để phá vỡ cả các liên kết hydrogen giữa các phân tử, nên nhiệt độ sôi của nước cao bất thường so với H₂S.'
        },
        {
          type: 'p',
          text: 'Khi nước đông đặc, mỗi phân tử H₂O liên kết hydrogen với 4 phân tử xung quanh, tạo mạng tinh thể có nhiều khoảng trống. Vì vậy nước đá có khối lượng riêng nhỏ hơn nước lỏng (khoảng 0,92 so với 1,00 g/cm³) và nổi trên mặt nước — điều giúp sinh vật dưới nước sống sót qua mùa đông.'
        }
      ]
    },
    {
      id: 'vdw',
      kind: 'concept',
      title: 'Tương tác van der Waals',
      blocks: [
        {
          type: 'callout',
          title: 'Tương tác van der Waals',
          text: 'Là lực hút tĩnh điện yếu giữa các phân tử, xuất hiện do sự phân bố electron không đều tạo nên các lưỡng cực (thường trực hoặc tạm thời) trong phân tử.'
        },
        {
          type: 'list',
          items: [
            'Có ở mọi chất phân tử, kể cả phân tử không phân cực như I₂, CH₄ và nguyên tử khí hiếm.',
            'Nhìn chung, **khối lượng phân tử càng lớn** (kích thước càng lớn), tương tác van der Waals càng mạnh, nhiệt độ nóng chảy và nhiệt độ sôi càng cao.'
          ]
        },
        {
          type: 'table',
          caption: 'Các halogen ở điều kiện thường',
          head: ['Chất', 'F₂', 'Cl₂', 'Br₂', 'I₂'],
          rows: [
            ['Khối lượng mol (g/mol)', '38', '71', '160', '254'],
            ['Nhiệt độ sôi (°C)', '−188', '−34', '59', '184'],
            ['Trạng thái ở 25 °C', 'Khí', 'Khí', 'Lỏng', 'Rắn']
          ]
        }
      ]
    },
    {
      id: 'example-explain',
      kind: 'example',
      title: 'Ví dụ — Giải thích dãy nhiệt độ sôi',
      blocks: [
        {
          type: 'worked',
          problem: 'Nhiệt độ sôi của các hydrogen halide: HF 20 °C, HCl −85 °C, HBr −67 °C, HI −35 °C. Giải thích (a) vì sao từ HCl đến HI nhiệt độ sôi tăng; (b) vì sao HF có nhiệt độ sôi cao bất thường.',
          steps: [
            '(a) HCl, HBr, HI không tạo liên kết hydrogen đáng kể; lực hút giữa các phân tử chủ yếu là tương tác van der Waals.',
            'Khối lượng phân tử tăng (36,5 < 81 < 128) nên tương tác van der Waals tăng, nhiệt độ sôi tăng.',
            '(b) F có độ âm điện lớn nhất và kích thước nhỏ, nên giữa các phân tử HF có liên kết hydrogen mạnh (F–H···F).',
            'Cần thêm năng lượng để phá vỡ liên kết hydrogen, nên HF sôi ở nhiệt độ cao nhất dù có khối lượng phân tử nhỏ nhất.'
          ],
          answer: 'HCl → HI: van der Waals tăng theo khối lượng phân tử. HF: có liên kết hydrogen giữa các phân tử nên nhiệt độ sôi cao bất thường.'
        }
      ]
    },
    {
      id: 'compare',
      kind: 'concept',
      title: 'So sánh các loại liên kết và tương tác',
      blocks: [
        {
          type: 'table',
          caption: 'Thứ tự độ mạnh (gần đúng)',
          head: ['Loại', 'Tồn tại giữa', 'Độ mạnh tương đối'],
          rows: [
            ['Liên kết ion, cộng hóa trị', 'Các nguyên tử/ion trong một chất', 'Mạnh nhất'],
            ['Liên kết hydrogen', 'H (gắn với F, O, N) và F, O, N của phân tử khác', 'Trung bình'],
            ['Tương tác van der Waals', 'Mọi phân tử', 'Yếu nhất']
          ]
        },
        {
          type: 'p',
          text: 'Khi đun sôi hay làm nóng chảy chất phân tử, chỉ các liên kết hydrogen và tương tác van der Waals giữa các phân tử bị phá vỡ; liên kết cộng hóa trị bên trong phân tử vẫn giữ nguyên. Nước sôi tạo hơi nước H₂O, không tạo H₂ và O₂.'
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
          id: 'g10-l13-c1',
          question: 'Giữa các phân tử nào sau đây có liên kết hydrogen?',
          options: [
            { id: 'a', text: 'CH₄' },
            { id: 'b', text: 'NH₃' },
            { id: 'c', text: 'H₂S' },
            { id: 'd', text: 'HCl' }
          ],
          correct: 'b',
          explanation: 'Trong NH₃, H liên kết với N (độ âm điện lớn, còn cặp electron riêng) nên tạo được liên kết N–H···N.'
        },
        {
          type: 'quiz',
          id: 'g10-l13-c2',
          question: 'Nước đá nổi trên mặt nước vì',
          options: [
            { id: 'a', text: 'nước đá có khối lượng mol nhỏ hơn nước lỏng' },
            { id: 'b', text: 'liên kết hydrogen tạo mạng tinh thể có nhiều khoảng trống' },
            { id: 'c', text: 'trong nước đá không còn liên kết hydrogen' },
            { id: 'd', text: 'nước đá chứa không khí' }
          ],
          correct: 'b',
          explanation: 'Mạng tinh thể nước đá thưa hơn nên khối lượng riêng nhỏ hơn nước lỏng; khối lượng mol vẫn là 18 g/mol.'
        },
        {
          type: 'quiz',
          id: 'g10-l13-c3',
          question: 'Ở 25 °C, Br₂ là chất lỏng còn Cl₂ là chất khí, chủ yếu vì',
          options: [
            { id: 'a', text: 'Br₂ có liên kết hydrogen' },
            { id: 'b', text: 'Br₂ có khối lượng phân tử lớn hơn nên tương tác van der Waals mạnh hơn' },
            { id: 'c', text: 'liên kết Br–Br bền hơn Cl–Cl' },
            { id: 'd', text: 'Br₂ là hợp chất ion' }
          ],
          correct: 'b',
          explanation: 'Halogen là phân tử không phân cực; lực hút giữa các phân tử là van der Waals, tăng theo khối lượng phân tử.'
        },
        {
          type: 'quiz',
          id: 'g10-l13-c4',
          question: 'Khi nước sôi, liên kết nào bị phá vỡ?',
          options: [
            { id: 'a', text: 'Liên kết cộng hóa trị O–H trong phân tử' },
            { id: 'b', text: 'Liên kết hydrogen giữa các phân tử nước' },
            { id: 'c', text: 'Liên kết ion' },
            { id: 'd', text: 'Không có liên kết nào bị phá vỡ' }
          ],
          correct: 'b',
          explanation: 'Sôi là quá trình vật lí: các phân tử H₂O tách xa nhau, liên kết O–H bên trong phân tử không bị phá vỡ.'
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
            'Liên kết hydrogen: giữa H gắn với F, O, N và nguyên tử F, O, N khác có cặp electron riêng.',
            'Liên kết hydrogen làm nhiệt độ sôi của H₂O, HF, NH₃ cao bất thường và làm nước đá nhẹ hơn nước.',
            'Tương tác van der Waals có ở mọi phân tử, tăng theo khối lượng phân tử.',
            'Độ mạnh: liên kết ion, cộng hóa trị > liên kết hydrogen > tương tác van der Waals.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Phân tử nào có nguyên tử H cũng tạo được liên kết hydrogen.', right: 'H phải liên kết với **F, O hoặc N**; CH₄, H₂S, HCl không tạo liên kết hydrogen đáng kể.' },
            { wrong: 'Liên kết hydrogen là liên kết giữa hai nguyên tử H.', right: 'Đó là tương tác giữa **H (δ+) của một phân tử** và cặp electron riêng của F, O, N ở phân tử khác.' },
            { wrong: 'Khi nước sôi, liên kết O–H bị phá vỡ.', right: 'Chỉ các **liên kết giữa các phân tử** bị phá vỡ; hơi nước vẫn là H₂O.' }
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
