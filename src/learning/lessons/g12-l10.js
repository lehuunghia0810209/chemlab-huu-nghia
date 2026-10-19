// Hóa học 12 · Chương 3 · Bài 10 — Protein và enzyme.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l10',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm, đặc điểm cấu tạo phân tử, tính chất vật lí của protein.',
    'Trình bày được tính chất hóa học của protein: phản ứng thủy phân, phản ứng màu biuret, phản ứng với nitric acid; sự đông tụ protein.',
    'Nêu được vai trò của protein đối với sự sống.',
    'Nêu được khái niệm, đặc điểm và ứng dụng của enzyme.'
  ],
  prerequisites: ['Bài 9: α-amino acid, liên kết peptide, phản ứng màu biuret.'],
  sources: [
    programme('Protein và enzyme'),
    textbook(12, 10)
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
          text: 'Luộc trứng thì lòng trắng đông lại; nấu canh cua thì thịt cua nổi thành từng mảng. Điều gì đã xảy ra với protein trong những trường hợp này?'
        },
        {
          type: 'list',
          items: [
            'Nêu khái niệm, cấu tạo và phân loại protein.',
            'Giải thích sự đông tụ protein.',
            'Viết được hiện tượng của phản ứng thủy phân, phản ứng màu biuret, phản ứng với HNO₃.',
            'Nêu đặc điểm và ứng dụng của enzyme.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Peptide có từ 2 liên kết peptide trở lên cho màu tím với Cu(OH)₂/OH⁻.', 'Phenol phản ứng thế ở vòng benzene.'] }
      ]
    },
    {
      id: 'protein',
      kind: 'concept',
      title: 'Protein: khái niệm, cấu tạo, tính chất vật lí',
      blocks: [
        {
          type: 'callout',
          title: 'Protein',
          text: 'Là những polypeptide cao phân tử, có phân tử khối từ vài chục nghìn đến vài triệu, được tạo thành từ các chuỗi polypeptide.'
        },
        {
          type: 'table',
          caption: 'Phân loại protein',
          head: ['Loại', 'Thành phần', 'Ví dụ'],
          rows: [
            ['Protein đơn giản', 'Chỉ gồm các gốc α-amino acid', 'Albumin (lòng trắng trứng), fibroin (tơ tằm)'],
            ['Protein phức tạp', 'Protein đơn giản + thành phần phi protein', 'Nucleoprotein, lipoprotein']
          ]
        },
        {
          type: 'list',
          items: [
            'Protein dạng sợi (keratin của tóc, móng; collagen; fibroin) không tan trong nước.',
            'Protein dạng cầu (albumin, hemoglobin) tan trong nước tạo dung dịch keo.',
            '**Sự đông tụ**: khi đun nóng hoặc thêm acid, base, muối kim loại nặng, protein dạng cầu đông tụ lại, tách ra khỏi dung dịch.'
          ]
        }
      ]
    },
    {
      id: 'reactions',
      kind: 'concept',
      title: 'Tính chất hóa học và vai trò của protein',
      blocks: [
        {
          type: 'table',
          caption: 'Các phản ứng của protein',
          head: ['Phản ứng', 'Điều kiện', 'Hiện tượng / sản phẩm'],
          rows: [
            ['Thủy phân', 'Acid, base hoặc enzyme, t°', 'Các chuỗi polypeptide → cuối cùng là các α-amino acid'],
            ['Màu biuret', 'Cu(OH)₂ trong môi trường kiềm', 'Dung dịch màu tím'],
            ['Với HNO₃ đặc', 'Nhiệt độ thường hoặc đun nhẹ', 'Kết tủa màu vàng (do vòng benzene trong một số gốc amino acid bị nitro hóa)']
          ]
        },
        {
          type: 'p',
          text: 'Vai trò: protein là thành phần cấu tạo chính của tế bào; tham gia vận chuyển (hemoglobin), bảo vệ (kháng thể), xúc tác (enzyme), điều hòa (một số hormone); là nguồn dinh dưỡng quan trọng của con người.'
        }
      ]
    },
    {
      id: 'enzyme',
      kind: 'concept',
      title: 'Enzyme',
      blocks: [
        {
          type: 'callout',
          title: 'Enzyme',
          text: 'Là chất xúc tác sinh học cho các quá trình hóa học, đặc biệt trong cơ thể sinh vật. Hầu hết enzyme có bản chất là protein.'
        },
        {
          type: 'list',
          items: [
            '**Tính chọn lọc cao**: mỗi enzyme chỉ xúc tác cho một hoặc một số phản ứng nhất định (amylase thủy phân tinh bột, lipase thủy phân chất béo, protease thủy phân protein).',
            '**Hoạt tính xúc tác rất lớn**: tốc độ phản ứng nhanh hơn nhiều so với xúc tác hóa học thông thường.',
            'Hoạt động tốt ở nhiệt độ và pH thích hợp; ở nhiệt độ cao enzyme bị biến tính, mất hoạt tính.',
            'Ứng dụng: chế biến thực phẩm (làm tương, nước mắm, bia), bột giặt sinh học, y dược, xử lí chất thải.'
          ]
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Số mắt xích trong phân tử protein',
      blocks: [
        {
          type: 'worked',
          problem: 'Thủy phân hoàn toàn 500 g protein X (phân tử khối 50 000) thu được 178 g alanine. Tính số gốc alanine trong một phân tử X (alanine: M = 89).',
          steps: [
            'n(X) = 500 / 50 000 = 0,01 mol.',
            'n(Ala) = 178 / 89 = 2 mol.',
            'Số gốc Ala trong 1 phân tử X = 2 / 0,01 = 200.'
          ],
          answer: 'Mỗi phân tử X có 200 gốc alanine.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: phản ứng màu biuret',
      blocks: [
        {
          type: 'p',
          text: 'Trong phòng thí nghiệm ảo, cho dung dịch lòng trắng trứng (albumin) tác dụng với CuSO₄ trong NaOH và quan sát màu tím.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Protein và enzyme',
          text: 'Mở trong Phòng thí nghiệm ảo; quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'guided', grade: 12, lessonId: 'g12-l10', experimentId: 'g12-protein-biuret' }
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
          id: 'g12-l10-c1',
          question: 'Đun nóng dung dịch lòng trắng trứng thấy',
          options: [
            { id: 'a', text: 'protein đông tụ' },
            { id: 'b', text: 'xuất hiện màu tím' },
            { id: 'c', text: 'có khí thoát ra' },
            { id: 'd', text: 'dung dịch chuyển màu xanh lam' }
          ],
          correct: 'a',
          explanation: 'Nhiệt làm protein dạng cầu đông tụ.'
        },
        {
          type: 'quiz',
          id: 'g12-l10-c2',
          question: 'Nhỏ HNO₃ đặc vào dung dịch lòng trắng trứng thấy',
          options: [
            { id: 'a', text: 'kết tủa màu vàng' },
            { id: 'b', text: 'màu tím' },
            { id: 'c', text: 'kết tủa trắng' },
            { id: 'd', text: 'không hiện tượng' }
          ],
          correct: 'a',
          explanation: 'Một số gốc amino acid có vòng benzene bị nitro hóa tạo hợp chất màu vàng.'
        },
        {
          type: 'quiz',
          id: 'g12-l10-c3',
          question: 'Đặc điểm nào không đúng với enzyme?',
          options: [
            { id: 'a', text: 'Hầu hết có bản chất protein' },
            { id: 'b', text: 'Có tính chọn lọc cao' },
            { id: 'c', text: 'Hoạt động càng mạnh khi nhiệt độ càng cao' },
            { id: 'd', text: 'Làm tăng tốc độ phản ứng rất lớn' }
          ],
          correct: 'c',
          explanation: 'Ở nhiệt độ cao enzyme bị biến tính và mất hoạt tính.'
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
            'Protein: polypeptide cao phân tử; đơn giản hoặc phức tạp; dạng sợi (không tan) hoặc dạng cầu (tan, tạo dung dịch keo).',
            'Đông tụ khi đun nóng, gặp acid, base, muối kim loại nặng.',
            'Thủy phân → α-amino acid; biuret → màu tím; HNO₃ → kết tủa vàng.',
            'Enzyme: xúc tác sinh học, chọn lọc cao, hoạt tính lớn, cần nhiệt độ và pH thích hợp.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Mọi protein đều tan trong nước.', right: 'Protein **dạng sợi** (keratin, fibroin) không tan; chỉ protein dạng cầu tan tạo dung dịch keo.' },
            { wrong: 'Đông tụ protein là phản ứng thủy phân.', right: 'Đông tụ là sự **biến tính**, protein tách khỏi dung dịch; thủy phân mới cắt liên kết peptide.' },
            { wrong: 'Tăng nhiệt độ luôn làm enzyme xúc tác nhanh hơn.', right: 'Quá nhiệt độ thích hợp, enzyme **bị biến tính**, mất hoạt tính.' }
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
