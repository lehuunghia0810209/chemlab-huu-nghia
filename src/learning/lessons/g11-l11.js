// Hóa học 11 · Chương 3 · Bài 11 — Phương pháp tách biệt và tinh chế hợp chất hữu cơ.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l11',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Trình bày được nguyên tắc và cách tiến hành các phương pháp tách biệt và tinh chế hợp chất hữu cơ: chưng cất, chiết, kết tinh và sắc kí cột.',
    'Vận dụng được phương pháp phù hợp để tách biệt, tinh chế một số chất trong thực tiễn (chưng cất rượu, chiết tinh dầu, làm đường…).'
  ],
  prerequisites: [
    'KHTN: nhiệt độ sôi, độ tan, chất tan và dung môi.',
    'Bài 10: đặc điểm chung của hợp chất hữu cơ (nhiệt độ sôi thấp, ít tan trong nước).'
  ],
  sources: [
    programme('Phương pháp tách biệt và tinh chế hợp chất hữu cơ'),
    textbook(11, 11),
    'Nhiệt độ sôi của ethanol (78 °C) và nước (100 °C) ở 1 atm.'
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
          text: 'Người nấu rượu thủ công đun hỗn hợp lên men và hứng lấy “giọt rượu” ngưng tụ; người làm tinh dầu sả lại chưng cất cùng hơi nước rồi tách lớp dầu nổi; người làm đường nấu cô rồi để đường kết tinh. Mỗi cách dựa trên một tính chất khác nhau của chất. Đó là những tính chất nào?'
        },
        {
          type: 'list',
          items: [
            'Hiểu nguyên tắc của chưng cất, chiết, kết tinh và sắc kí cột.',
            'Chọn phương pháp phù hợp cho từng hỗn hợp.',
            'Liên hệ các phương pháp với sản xuất và đời sống.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Chất có nhiệt độ sôi thấp hơn bay hơi trước.', 'Độ tan của chất rắn thường tăng khi tăng nhiệt độ.'] }
      ]
    },
    {
      id: 'distillation',
      kind: 'concept',
      title: 'Chưng cất',
      blocks: [
        {
          type: 'callout',
          title: 'Nguyên tắc',
          text: 'Dựa vào sự **khác nhau về nhiệt độ sôi** của các chất trong hỗn hợp lỏng. Đun nóng, chất có nhiệt độ sôi thấp hơn bay hơi trước; hơi được làm lạnh và ngưng tụ thành chất lỏng (dịch cất).'
        },
        {
          type: 'list',
          items: [
            '**Chưng cất thường**: các chất có nhiệt độ sôi khác nhau nhiều (ví dụ ethanol 78 °C và nước 100 °C).',
            '**Chưng cất phân đoạn**: các chất có nhiệt độ sôi gần nhau; dùng cột phân đoạn (ví dụ chưng cất dầu mỏ).',
            '**Chưng cất lôi cuốn hơi nước**: tách chất không tan, dễ bay hơi cùng hơi nước, ví dụ tinh dầu sả, tinh dầu tràm.'
          ]
        }
      ]
    },
    {
      id: 'extraction',
      kind: 'concept',
      title: 'Chiết',
      blocks: [
        {
          type: 'callout',
          title: 'Nguyên tắc',
          text: 'Dựa vào sự **khác nhau về độ tan** của chất trong hai dung môi **không trộn lẫn** vào nhau, để chuyển chất cần tách sang một dung môi rồi tách riêng hai lớp.'
        },
        {
          type: 'list',
          items: [
            '**Chiết lỏng – lỏng**: dùng phễu chiết; lắc hỗn hợp, để yên cho tách lớp, mở khóa cho lớp dưới chảy ra.',
            '**Chiết lỏng – rắn**: dùng dung môi hòa tan chất cần tách ra khỏi hỗn hợp rắn, ví dụ ngâm rượu thuốc, pha trà.',
            'Ví dụ: tách lớp dầu ăn ra khỏi nước; chiết iodine từ nước sang dung môi hữu cơ.'
          ]
        }
      ]
    },
    {
      id: 'crystallization',
      kind: 'concept',
      title: 'Kết tinh',
      blocks: [
        {
          type: 'callout',
          title: 'Nguyên tắc',
          text: 'Dựa vào **độ tan khác nhau theo nhiệt độ**: hòa tan chất rắn cần tinh chế trong dung môi nóng để tạo dung dịch bão hòa, lọc bỏ tạp chất không tan, rồi làm nguội để chất cần tinh chế kết tinh; tạp chất còn lại trong dung dịch.'
        },
        {
          type: 'p',
          text: 'Ví dụ: sản xuất đường kính từ nước mía (cô đặc rồi để kết tinh); tinh chế muối ăn.'
        }
      ]
    },
    {
      id: 'chromatography',
      kind: 'concept',
      title: 'Sắc kí cột',
      blocks: [
        {
          type: 'callout',
          title: 'Nguyên tắc',
          text: 'Dựa vào **khả năng hấp phụ khác nhau** của các chất trên chất hấp phụ (pha tĩnh, ví dụ silica gel nhồi trong cột) khi cho dung môi (pha động) chảy qua: chất bị hấp phụ yếu đi xuống nhanh, chất bị hấp phụ mạnh đi chậm hơn.'
        },
        {
          type: 'p',
          text: 'Hứng riêng từng phần dung dịch chảy ra ở đáy cột thu được các chất riêng biệt. Sắc kí dùng để tách các chất có tính chất rất giống nhau, ví dụ các sắc tố trong lá cây.'
        }
      ]
    },
    {
      id: 'example-choose',
      kind: 'example',
      title: 'Ví dụ 1 — Chọn phương pháp phù hợp',
      blocks: [
        {
          type: 'worked',
          problem: 'Chọn phương pháp tách biệt hoặc tinh chế phù hợp: (a) tách ethanol khỏi dung dịch ethanol – nước; (b) tách lớp dầu ăn khỏi nước; (c) thu đường tinh khiết từ nước mía; (d) tách riêng các sắc tố trong dịch chiết lá cây.',
          table: {
            caption: 'Phân tích',
            head: ['Hỗn hợp', 'Tính chất khác biệt', 'Phương pháp'],
            rows: [
              ['(a) Ethanol – nước', 'Nhiệt độ sôi 78 °C và 100 °C', 'Chưng cất'],
              ['(b) Dầu ăn – nước', 'Không trộn lẫn, tách lớp', 'Chiết (phễu chiết)'],
              ['(c) Đường – nước mía', 'Độ tan giảm khi nguội, cô đặc', 'Kết tinh'],
              ['(d) Các sắc tố', 'Khả năng hấp phụ khác nhau', 'Sắc kí cột']
            ]
          },
          steps: [
            'Xác định trạng thái của các chất (lỏng – lỏng tan lẫn, lỏng – lỏng không tan lẫn, rắn tan trong lỏng…).',
            'Tìm tính chất khác biệt rõ nhất giữa chất cần tách và phần còn lại.'
          ],
          answer: '(a) chưng cất; (b) chiết; (c) kết tinh; (d) sắc kí cột.'
        }
      ]
    },
    {
      id: 'example-crystal',
      kind: 'example',
      title: 'Ví dụ 2 — Tính lượng chất kết tinh',
      blocks: [
        {
          type: 'worked',
          problem: 'Giả sử độ tan của chất X trong nước là 60 g/100 g nước ở 80 °C và 10 g/100 g nước ở 20 °C. Pha dung dịch X bão hòa trong 200 g nước ở 80 °C rồi làm nguội xuống 20 °C. Tính khối lượng X kết tinh (coi nước không bay hơi).',
          steps: [
            'Ở 80 °C, 200 g nước hòa tan tối đa 60 × 2 = 120 g X.',
            'Ở 20 °C, 200 g nước chỉ hòa tan 10 × 2 = 20 g X.',
            'Khối lượng X kết tinh: 120 − 20 = 100 g.'
          ],
          answer: '100 g X kết tinh; tạp chất tan với lượng nhỏ vẫn ở lại trong dung dịch.'
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
          id: 'g11-l11-c1',
          question: 'Phương pháp chưng cất dựa vào sự khác nhau về',
          options: [
            { id: 'a', text: 'độ tan' },
            { id: 'b', text: 'nhiệt độ sôi' },
            { id: 'c', text: 'khối lượng riêng' },
            { id: 'd', text: 'màu sắc' }
          ],
          correct: 'b',
          explanation: 'Chất có nhiệt độ sôi thấp hơn bay hơi và được ngưng tụ trước.'
        },
        {
          type: 'quiz',
          id: 'g11-l11-c2',
          question: 'Để tách benzene (không tan, nhẹ hơn nước) ra khỏi nước, dùng',
          options: [
            { id: 'a', text: 'kết tinh' },
            { id: 'b', text: 'chiết bằng phễu chiết' },
            { id: 'c', text: 'sắc kí cột' },
            { id: 'd', text: 'lọc' }
          ],
          correct: 'b',
          explanation: 'Hai chất lỏng không trộn lẫn tách thành hai lớp; dùng phễu chiết tách riêng.'
        },
        {
          type: 'quiz',
          id: 'g11-l11-c3',
          question: 'Sản xuất tinh dầu sả thường dùng phương pháp',
          options: [
            { id: 'a', text: 'chưng cất lôi cuốn hơi nước' },
            { id: 'b', text: 'kết tinh' },
            { id: 'c', text: 'sắc kí cột' },
            { id: 'd', text: 'chưng cất phân đoạn dưới áp suất cao' }
          ],
          correct: 'a',
          explanation: 'Tinh dầu không tan trong nước, dễ bay hơi cùng hơi nước rồi tách lớp khi ngưng tụ.'
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
            'Chưng cất: khác nhau về nhiệt độ sôi (thường, phân đoạn, lôi cuốn hơi nước).',
            'Chiết: khác nhau về độ tan trong hai dung môi không trộn lẫn.',
            'Kết tinh: độ tan thay đổi theo nhiệt độ.',
            'Sắc kí cột: khả năng hấp phụ khác nhau trên pha tĩnh.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Dùng chiết để tách ethanol khỏi nước.', right: 'Ethanol tan vô hạn trong nước, không tách lớp: phải dùng **chưng cất**.' },
            { wrong: 'Kết tinh dựa vào nhiệt độ sôi khác nhau.', right: 'Kết tinh dựa vào **độ tan khác nhau theo nhiệt độ**.' },
            { wrong: 'Trong sắc kí cột, chất bị hấp phụ mạnh ra khỏi cột trước.', right: 'Chất bị hấp phụ **yếu** đi nhanh hơn và ra khỏi cột trước.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Công thức phân tử hợp chất hữu cơ**.'
        }
      ]
    }
  ]
}
