// Hóa học 12 · Chương 1 · Bài 1 — Ester – Lipid.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l1',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm ester; viết được công thức cấu tạo và gọi được tên một số ester đơn giản (số nguyên tử C ≤ 5), ester của glycerol.',
    'Trình bày được tính chất vật lí, tính chất hóa học của ester (phản ứng thủy phân trong môi trường acid và base); phương pháp điều chế và ứng dụng của ester.',
    'Nêu được khái niệm lipid, chất béo, acid béo; đặc điểm cấu tạo phân tử acid béo (omega-3, omega-6).',
    'Trình bày được tính chất vật lí, tính chất hóa học của chất béo (thủy phân, phản ứng hydrogen hóa chất béo lỏng, phản ứng oxi hóa) và ứng dụng.'
  ],
  prerequisites: [
    'Hóa 11 bài 24: carboxylic acid và phản ứng ester hóa.',
    'Hóa 11 bài 20: alcohol, glycerol.'
  ],
  sources: [
    programme('Ester – Lipid'),
    textbook(12, 1)
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
          text: 'Mùi thơm của chuối chín, của dứa hay của hoa nhài đều do các ester tạo nên; dầu ăn và mỡ động vật cũng là ester. Ester có cấu tạo như thế nào và vì sao dầu ăn để lâu lại bị ôi?'
        },
        {
          type: 'list',
          items: [
            'Nêu khái niệm, gọi tên ester đơn giản.',
            'Viết phản ứng thủy phân ester trong môi trường acid và base.',
            'Nêu khái niệm lipid, chất béo, acid béo (omega-3, omega-6).',
            'Viết phản ứng xà phòng hóa, hydrogen hóa chất béo; giải thích sự ôi dầu mỡ.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['RCOOH + R′OH ⇌ RCOOR′ + H₂O (H₂SO₄ đặc, t°).', 'Glycerol C₃H₅(OH)₃ có ba nhóm −OH.'] }
      ]
    },
    {
      id: 'ester',
      kind: 'concept',
      title: 'Ester: khái niệm và danh pháp',
      blocks: [
        {
          type: 'callout',
          title: 'Ester',
          text: 'Khi thay nhóm −OH ở nhóm carboxyl của carboxylic acid bằng nhóm −OR′ thì được ester. Ester đơn chức có công thức chung **RCOOR′** (R là H hoặc gốc hydrocarbon, R′ là gốc hydrocarbon). Ester no, đơn chức, mạch hở: **CₙH₂ₙO₂** (n ≥ 2).'
        },
        {
          type: 'p',
          text: 'Tên ester RCOOR′ = tên gốc R′ + tên gốc acid RCOO (đổi đuôi -ic acid thành **-ate**).'
        },
        {
          type: 'table',
          caption: 'Một số ester',
          head: ['Công thức', 'Tên', 'Ghi chú'],
          rows: [
            ['HCOOCH₃', 'methyl formate', ''],
            ['CH₃COOC₂H₅', 'ethyl acetate', 'Dung môi'],
            ['CH₃COOCH=CH₂', 'vinyl acetate', 'Monomer'],
            ['CH₂=C(CH₃)COOCH₃', 'methyl methacrylate', 'Monomer của thủy tinh hữu cơ'],
            ['CH₃COOCH₂CH₂CH(CH₃)₂', 'isoamyl acetate', 'Mùi chuối chín'],
            ['CH₃CH₂CH₂COOC₂H₅', 'ethyl butyrate', 'Mùi dứa']
          ]
        },
        {
          type: 'list',
          items: [
            'Không có liên kết hydrogen giữa các phân tử nên ester có nhiệt độ sôi **thấp hơn** alcohol và carboxylic acid có cùng số C (hoặc phân tử khối tương đương).',
            'Ester thường là chất lỏng, nhẹ hơn nước, ít tan trong nước; nhiều ester có mùi thơm của hoa quả.'
          ]
        }
      ]
    },
    {
      id: 'ester-reactions',
      kind: 'concept',
      title: 'Tính chất hóa học, điều chế và ứng dụng của ester',
      blocks: [
        { type: 'heading', text: 'Thủy phân trong môi trường acid (thuận nghịch)' },
        { type: 'equation', text: 'CH₃COOC₂H₅ + H₂O ⇌ CH₃COOH + C₂H₅OH', condition: 'H₂SO₄, t°' },
        { type: 'heading', text: 'Thủy phân trong môi trường base (phản ứng xà phòng hóa, một chiều)' },
        { type: 'equation', text: 'CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH', condition: 't°' },
        {
          type: 'callout',
          tone: 'note',
          title: 'Điều chế',
          text: 'Phần lớn ester được điều chế bằng phản ứng ester hóa giữa carboxylic acid và alcohol (xúc tác H₂SO₄ đặc, đun nóng).'
        },
        {
          type: 'p',
          text: 'Ứng dụng: dung môi (ethyl acetate, butyl acetate), hương liệu trong thực phẩm và mỹ phẩm, nguyên liệu sản xuất polymer (poly(methyl methacrylate), poly(vinyl acetate)).'
        }
      ]
    },
    {
      id: 'lipid',
      kind: 'concept',
      title: 'Lipid, chất béo và acid béo',
      blocks: [
        {
          type: 'callout',
          title: 'Lipid và chất béo',
          text: '**Lipid** là những hợp chất hữu cơ có trong tế bào sống, không tan trong nước nhưng tan trong dung môi hữu cơ không phân cực; gồm chất béo, sáp, steroid, phospholipid… **Chất béo** là triester của glycerol với acid béo (triglyceride).'
        },
        {
          type: 'p',
          text: '**Acid béo** là carboxylic acid đơn chức, thường có mạch carbon dài, không phân nhánh và số nguyên tử C chẵn (12 – 24 C).'
        },
        {
          type: 'table',
          caption: 'Một số acid béo thường gặp',
          head: ['Acid béo', 'Công thức', 'Đặc điểm'],
          rows: [
            ['Palmitic acid', 'C₁₅H₃₁COOH', 'No'],
            ['Stearic acid', 'C₁₇H₃₅COOH', 'No'],
            ['Oleic acid', 'C₁₇H₃₃COOH', '1 liên kết C=C (omega-9)'],
            ['Linoleic acid', 'C₁₇H₃₁COOH', '2 liên kết C=C (omega-6)'],
            ['Linolenic acid', 'C₁₇H₂₉COOH', '3 liên kết C=C (omega-3)']
          ]
        },
        {
          type: 'p',
          text: 'Acid béo **omega-3** (hoặc omega-6) có liên kết đôi C=C đầu tiên ở nguyên tử C số 3 (hoặc số 6) tính từ nhóm CH₃ cuối mạch. Đây là các acid béo thiết yếu, cơ thể không tự tổng hợp được, cần bổ sung qua thức ăn (cá biển, các loại hạt).'
        },
        {
          type: 'list',
          items: [
            'Chất béo chứa chủ yếu gốc acid béo no (mỡ động vật) thường là chất **rắn**; chứa chủ yếu gốc acid béo không no (dầu thực vật, dầu cá) thường là chất **lỏng**.',
            'Chất béo nhẹ hơn nước, không tan trong nước, tan trong dung môi hữu cơ như hexane, chloroform.'
          ]
        }
      ]
    },
    {
      id: 'fat-reactions',
      kind: 'concept',
      title: 'Tính chất hóa học và ứng dụng của chất béo',
      blocks: [
        { type: 'heading', text: 'Phản ứng xà phòng hóa' },
        { type: 'equation', text: '(C₁₇H₃₅COO)₃C₃H₅ + 3NaOH → 3C₁₇H₃₅COONa + C₃H₅(OH)₃', condition: 't°', note: 'Tristearin tạo sodium stearate (thành phần chính của xà phòng) và glycerol.' },
        { type: 'heading', text: 'Phản ứng hydrogen hóa chất béo lỏng' },
        { type: 'equation', text: '(C₁₇H₃₃COO)₃C₃H₅ + 3H₂ → (C₁₇H₃₅COO)₃C₃H₅', condition: 'Ni, t°, p', note: 'Triolein (lỏng) chuyển thành tristearin (rắn): dùng sản xuất bơ thực vật (margarine).' },
        { type: 'heading', text: 'Phản ứng oxi hóa' },
        {
          type: 'p',
          text: 'Liên kết C=C trong gốc acid béo không no bị oxygen không khí oxi hóa chậm, tạo các peroxide rồi phân cắt thành aldehyde có mùi khó chịu: đó là hiện tượng **dầu mỡ bị ôi**. Nên bảo quản dầu ăn nơi kín, tránh ánh sáng và không dùng lại dầu đã chiên nhiều lần.'
        },
        {
          type: 'p',
          text: 'Ứng dụng: chất béo là nguồn cung cấp và dự trữ năng lượng, hòa tan vitamin A, D, E, K; là nguyên liệu sản xuất xà phòng, glycerol, nhiên liệu sinh học (biodiesel).'
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Xà phòng hóa ester và chất béo',
      blocks: [
        {
          type: 'worked',
          problem: '(a) Xà phòng hóa hoàn toàn 8,8 g ethyl acetate bằng dung dịch NaOH vừa đủ. Tính khối lượng muối thu được. (b) Xà phòng hóa hoàn toàn 17,8 g tristearin bằng NaOH. Tính khối lượng glycerol thu được (C = 12, H = 1, O = 16, Na = 23).',
          steps: [
            '(a) n(CH₃COOC₂H₅) = 8,8 / 88 = 0,1 mol ⇒ n(CH₃COONa) = 0,1 mol ⇒ m = 0,1 × 82 = 8,2 g.',
            '(b) M((C₁₇H₃₅COO)₃C₃H₅) = 890 ⇒ n = 17,8 / 890 = 0,02 mol.',
            'n(glycerol) = n(chất béo) = 0,02 mol ⇒ m = 0,02 × 92 = 1,84 g.'
          ],
          answer: '(a) 8,2 g CH₃COONa; (b) 1,84 g glycerol.'
        }
      ]
    },
    {
      id: 'explore',
      kind: 'practice',
      title: 'Thực hành: thủy phân ester trong môi trường base',
      blocks: [
        {
          type: 'p',
          text: 'Trong phòng thí nghiệm ảo, đun ethyl acetate với dung dịch NaOH. Lớp ester ban đầu tách riêng trên mặt nước, sau phản ứng hỗn hợp trở nên đồng nhất vì sản phẩm tan trong nước.'
        },
        {
          type: 'activity',
          title: 'Hoạt động có hướng dẫn: Ester và lipid',
          text: 'Mở trong Phòng thí nghiệm ảo; quay lại mục Học tập để tiếp tục đúng bước này.',
          action: { kind: 'guided', grade: 12, lessonId: 'g12-l1', experimentId: 'g12-lesson-01' }
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
          id: 'g12-l1-c1',
          question: 'Tên của ester CH₃COOCH₃ là',
          options: [
            { id: 'a', text: 'methyl acetate' },
            { id: 'b', text: 'ethyl formate' },
            { id: 'c', text: 'methyl formate' },
            { id: 'd', text: 'ethyl acetate' }
          ],
          correct: 'a',
          explanation: 'Gốc R′ = methyl, gốc acid CH₃COO = acetate.'
        },
        {
          type: 'quiz',
          id: 'g12-l1-c2',
          question: 'Thủy phân ester trong môi trường kiềm còn gọi là phản ứng',
          options: [
            { id: 'a', text: 'ester hóa' },
            { id: 'b', text: 'xà phòng hóa' },
            { id: 'c', text: 'hydrogen hóa' },
            { id: 'd', text: 'trùng hợp' }
          ],
          correct: 'b',
          explanation: 'Phản ứng một chiều, tạo muối của acid (xà phòng khi là acid béo) và alcohol.'
        },
        {
          type: 'quiz',
          id: 'g12-l1-c3',
          question: 'Để chuyển chất béo lỏng thành chất béo rắn, người ta dùng phản ứng',
          options: [
            { id: 'a', text: 'xà phòng hóa' },
            { id: 'b', text: 'cộng H₂ (Ni, t°)' },
            { id: 'c', text: 'thủy phân trong acid' },
            { id: 'd', text: 'oxi hóa bằng O₂' }
          ],
          correct: 'b',
          explanation: 'Hydrogen hóa làm no các liên kết C=C trong gốc acid béo.'
        },
        {
          type: 'quiz',
          id: 'g12-l1-c4',
          question: 'Ethyl acetate có nhiệt độ sôi thấp hơn acetic acid và ethanol vì',
          options: [
            { id: 'a', text: 'ethyl acetate có phân tử khối nhỏ hơn' },
            { id: 'b', text: 'giữa các phân tử ester không có liên kết hydrogen' },
            { id: 'c', text: 'ester là hợp chất ion' },
            { id: 'd', text: 'ester tan tốt trong nước' }
          ],
          correct: 'b',
          explanation: 'Ester (M = 88) nặng hơn cả hai chất nhưng không có nhóm O–H nên không tạo liên kết hydrogen liên phân tử.'
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
            'Ester RCOOR′; no đơn chức mạch hở CₙH₂ₙO₂; tên = gốc R′ + gốc acid (-ate).',
            'Thủy phân trong acid: thuận nghịch; trong base (xà phòng hóa): một chiều.',
            'Chất béo là triester của glycerol và acid béo; omega-3, omega-6 là acid béo không no thiết yếu.',
            'Chất béo: xà phòng hóa tạo xà phòng + glycerol; hydrogen hóa chất béo lỏng → rắn; bị oxi hóa gây ôi.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Gọi CH₃COOC₂H₅ là “acetate ethyl” hoặc “ethyl ethylate”.', right: 'Đọc gốc alcohol trước, gốc acid sau: **ethyl acetate**.' },
            { wrong: 'Thủy phân ester trong acid và trong base đều xảy ra hoàn toàn.', right: 'Trong acid: **thuận nghịch**; chỉ trong base (xà phòng hóa) mới xảy ra một chiều.' },
            { wrong: 'Chất béo là ester của glycerol với mọi carboxylic acid.', right: 'Chất béo là triester của glycerol với **acid béo** (acid đơn chức, mạch dài, không nhánh).' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Xà phòng và chất giặt rửa**.'
        }
      ]
    }
  ]
}
