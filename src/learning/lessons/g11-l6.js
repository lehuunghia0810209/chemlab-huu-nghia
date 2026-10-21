// Hóa học 11 · Chương 2 · Bài 6 — Một số hợp chất của nitrogen với oxygen.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l6',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Trình bày được sự hình thành NOₓ (do sấm sét, động cơ đốt trong) và tác hại của NOₓ; nêu được nguồn gốc gây mưa acid.',
    'Nêu được cấu tạo và tính chất của nitric acid: tính acid mạnh và tính oxi hóa mạnh (với kim loại, phi kim).',
    'Trình bày được ứng dụng của nitric acid; giải thích được hiện tượng phú dưỡng.'
  ],
  prerequisites: [
    'Bài 4: Nitrogen; số oxi hóa của nitrogen.',
    'Hóa 10: cân bằng phản ứng oxi hóa – khử bằng thăng bằng electron.'
  ],
  sources: [
    programme('Một số hợp chất của nitrogen với oxygen'),
    textbook(11, 6),
    'pH của nước mưa không ô nhiễm khoảng 5,6 (do CO₂ hòa tan); mưa có pH thấp hơn được coi là mưa acid.'
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
          text: 'Ở các thành phố đông xe cộ, những ngày nắng thường có lớp khói mù màu nâu nhạt; ở một số vùng, mưa làm hư hại tượng đá và cây cối. Khí thải của động cơ chứa những hợp chất nào của nitrogen, và vì sao chúng gây hại?'
        },
        {
          type: 'list',
          items: [
            'Biết nguồn gốc và tác hại của các oxide của nitrogen (NOₓ).',
            'Giải thích sự hình thành mưa acid.',
            'Viết phương trình thể hiện tính acid và tính oxi hóa mạnh của HNO₃.',
            'Hiểu ứng dụng của HNO₃ và hiện tượng phú dưỡng.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['N có các số oxi hóa −3, 0, +1, +2, +4, +5.', 'Chất có nguyên tố ở số oxi hóa cao nhất chỉ thể hiện tính oxi hóa.'] }
      ]
    },
    {
      id: 'nox',
      kind: 'concept',
      title: 'Oxide của nitrogen (NOₓ)',
      blocks: [
        {
          type: 'table',
          caption: 'Hai oxide thường gặp',
          head: ['Oxide', 'Số oxi hóa của N', 'Tính chất vật lí'],
          rows: [
            ['NO', '+2', 'Khí không màu, ít tan trong nước'],
            ['NO₂', '+4', 'Khí màu nâu đỏ, mùi hắc, độc']
          ]
        },
        {
          type: 'p',
          text: 'NOₓ hình thành khi N₂ và O₂ phản ứng ở nhiệt độ rất cao: trong buồng đốt của động cơ, lò nung, hoặc khi có sấm sét.'
        },
        { type: 'equation', text: 'N₂ + O₂ → 2NO', condition: 'nhiệt độ cao' },
        { type: 'equation', text: '2NO + O₂ → 2NO₂', note: 'NO bị oxi hóa nhanh trong không khí.' },
        {
          type: 'list',
          items: [
            'NO₂ gây hại đường hô hấp, tham gia tạo khói mù quang hóa.',
            'NOₓ cùng SO₂ là nguyên nhân chính gây mưa acid.'
          ]
        }
      ]
    },
    {
      id: 'acid-rain',
      kind: 'concept',
      title: 'Mưa acid',
      blocks: [
        {
          type: 'p',
          text: 'Nước mưa bình thường có pH khoảng 5,6 do hòa tan CO₂. Khi không khí chứa nhiều NOₓ và SO₂, các khí này bị oxi hóa và tan vào nước mưa tạo HNO₃, H₂SO₄, làm pH thấp hơn: đó là **mưa acid**.'
        },
        { type: 'equation', text: '4NO₂ + O₂ + 2H₂O → 4HNO₃' },
        {
          type: 'list',
          items: [
            'Tác hại: làm chua đất và nước, hư hại cây trồng, ăn mòn công trình bằng đá vôi và kim loại.',
            'Giảm thiểu: dùng bộ chuyển đổi xúc tác trên ô tô, xử lí khí thải nhà máy, dùng năng lượng sạch.'
          ]
        },
        { type: 'equation', text: 'CaCO₃ + 2HNO₃ → Ca(NO₃)₂ + CO₂ + H₂O', note: 'Mưa acid ăn mòn tượng đá vôi, đá cẩm thạch.' }
      ]
    },
    {
      id: 'nitric-acid',
      kind: 'concept',
      title: 'Nitric acid',
      blocks: [
        {
          type: 'p',
          text: 'HNO₃ là chất lỏng không màu, bốc khói mạnh trong không khí ẩm; khi để lâu ngoài ánh sáng bị phân hủy một phần tạo NO₂ nên có màu vàng. Trong HNO₃, nitrogen có số oxi hóa +5 (cao nhất).'
        },
        { type: 'heading', text: 'Tính acid mạnh' },
        { type: 'equation', text: 'HNO₃ → H⁺ + NO₃⁻' },
        { type: 'equation', text: 'CuO + 2HNO₃ → Cu(NO₃)₂ + H₂O' },
        { type: 'heading', text: 'Tính oxi hóa mạnh (do N⁺⁵)' },
        { type: 'equation', text: 'Cu + 4HNO₃ → Cu(NO₃)₂ + 2NO₂ + 2H₂O', condition: 'HNO₃ đặc', note: 'Khí màu nâu đỏ thoát ra.' },
        { type: 'equation', text: '3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O', condition: 'HNO₃ loãng', note: 'NO không màu, hóa nâu trong không khí.' },
        { type: 'equation', text: 'C + 4HNO₃ → CO₂ + 4NO₂ + 2H₂O', condition: 't°, HNO₃ đặc' },
        {
          type: 'list',
          items: [
            'HNO₃ oxi hóa được hầu hết kim loại (trừ Au, Pt), kể cả Cu, Ag đứng sau H; kim loại lên số oxi hóa cao.',
            'Fe, Al, Cr bị **thụ động** trong HNO₃ đặc, nguội (không phản ứng), nên có thể chứa HNO₃ đặc trong bình bằng nhôm.',
            'Khi tác dụng với kim loại, HNO₃ không giải phóng H₂.'
          ]
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Đồng tác dụng với nitric acid',
      blocks: [
        {
          type: 'worked',
          problem: 'Cho 6,4 g Cu tác dụng hết với dung dịch HNO₃ đặc, dư. Tính thể tích khí NO₂ (sản phẩm khử duy nhất) ở điều kiện chuẩn (24,79 L/mol) và khối lượng muối tạo thành (Cu = 64, N = 14, O = 16).',
          steps: [
            'n(Cu) = 6,4 / 64 = 0,1 mol.',
            'Cu + 4HNO₃ → Cu(NO₃)₂ + 2NO₂ + 2H₂O ⇒ n(NO₂) = 0,2 mol; n(Cu(NO₃)₂) = 0,1 mol.',
            'V(NO₂) = 0,2 × 24,79 = 4,958 L; m(Cu(NO₃)₂) = 0,1 × 188 = 18,8 g.'
          ],
          answer: 'V(NO₂) ≈ 4,96 L; m(Cu(NO₃)₂) = 18,8 g. Kiểm tra bằng bảo toàn electron: Cu nhường 0,2 mol e = N⁺⁵ nhận 0,2 mol e (mỗi NO₂ nhận 1e).'
        }
      ]
    },
    {
      id: 'uses',
      kind: 'concept',
      title: 'Ứng dụng và hiện tượng phú dưỡng',
      blocks: [
        {
          type: 'list',
          items: [
            'Phần lớn HNO₃ dùng sản xuất phân đạm (NH₄NO₃); ngoài ra để sản xuất thuốc nổ, phẩm nhuộm, dược phẩm.',
            '**Phú dưỡng**: khi nguồn nước nhận quá nhiều nitrogen (NO₃⁻, NH₄⁺) và phosphorus từ phân bón, nước thải, tảo phát triển mạnh, sau đó chết và phân hủy làm cạn kiệt oxygen hòa tan, khiến tôm cá chết.'
          ]
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Liên hệ',
          text: 'Bón phân đúng liều, đúng lúc và xử lí nước thải là các cách hạn chế phú dưỡng ở ao hồ, sông ngòi.'
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
          id: 'g11-l6-c1',
          question: 'Khí nào có màu nâu đỏ?',
          options: [
            { id: 'a', text: 'NO' },
            { id: 'b', text: 'NO₂' },
            { id: 'c', text: 'N₂' },
            { id: 'd', text: 'N₂O' }
          ],
          correct: 'b',
          explanation: 'NO₂ có màu nâu đỏ; NO, N₂, N₂O không màu.'
        },
        {
          type: 'quiz',
          id: 'g11-l6-c2',
          question: 'Kim loại nào bị thụ động trong HNO₃ đặc, nguội?',
          options: [
            { id: 'a', text: 'Cu' },
            { id: 'b', text: 'Ag' },
            { id: 'c', text: 'Al' },
            { id: 'd', text: 'Mg' }
          ],
          correct: 'c',
          explanation: 'Al, Fe, Cr bị thụ động trong HNO₃ đặc, nguội.'
        },
        {
          type: 'quiz',
          id: 'g11-l6-c3',
          question: 'Mưa acid chủ yếu do các khí nào gây ra?',
          options: [
            { id: 'a', text: 'N₂ và O₂' },
            { id: 'b', text: 'NOₓ và SO₂' },
            { id: 'c', text: 'CO₂ và H₂O' },
            { id: 'd', text: 'CH₄ và NH₃' }
          ],
          correct: 'b',
          explanation: 'NOₓ và SO₂ bị oxi hóa và tan vào nước mưa tạo HNO₃, H₂SO₄.'
        },
        {
          type: 'quiz',
          id: 'g11-l6-c4',
          question: 'Khi Cu tác dụng với HNO₃ loãng, khí thoát ra là',
          options: [
            { id: 'a', text: 'H₂' },
            { id: 'b', text: 'NO' },
            { id: 'c', text: 'NO₂' },
            { id: 'd', text: 'N₂' }
          ],
          correct: 'b',
          explanation: '3Cu + 8HNO₃ (loãng) → 3Cu(NO₃)₂ + 2NO + 4H₂O; HNO₃ không giải phóng H₂ với kim loại.'
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
            'NO (không màu) và NO₂ (nâu đỏ) hình thành ở nhiệt độ cao; gây khói mù và mưa acid (pH < 5,6).',
            'HNO₃: acid mạnh và chất oxi hóa mạnh; với kim loại không tạo H₂ mà tạo NO₂, NO… và muối nitrate.',
            'Fe, Al, Cr thụ động trong HNO₃ đặc, nguội.',
            'Dư thừa hợp chất nitrogen, phosphorus trong nước gây phú dưỡng.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Cu không tác dụng với HNO₃ vì Cu đứng sau H.', right: 'HNO₃ có tính **oxi hóa mạnh** (N⁺⁵) nên oxi hóa được cả Cu, Ag.' },
            { wrong: 'Fe + HNO₃ giải phóng H₂ như với HCl.', right: 'HNO₃ tác dụng với kim loại **không tạo H₂**; sản phẩm khử là NO₂, NO, N₂O, N₂ hoặc NH₄NO₃.' },
            { wrong: 'Mưa có pH < 7 đều là mưa acid.', right: 'Nước mưa sạch đã có pH khoảng 5,6; mưa acid có **pH < 5,6**.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Sulfur và sulfur dioxide**.'
        }
      ]
    }
  ]
}
