// Hóa học 12 · Chương 3 · Bài 11 — Ôn tập chương 3 (Hợp chất chứa nitrogen).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l11',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa cấu tạo và tính chất của amine, amino acid, peptide, protein.',
    'Vận dụng để nhận biết và giải bài tập về tính base, tính lưỡng tính, thủy phân peptide.'
  ],
  prerequisites: ['Bài 8 – 10 của chương 3.'],
  sources: [
    programme('Hợp chất chứa nitrogen'),
    textbook(12, 11)
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
          text: 'Methylamine, glycine và lòng trắng trứng đều chứa nitrogen. Một mẩu giấy quỳ và một ít Cu(OH)₂ có đủ để phân biệt chúng không?'
        },
        {
          type: 'list',
          items: [
            'So sánh amine, amino acid, peptide và protein.',
            'Chọn thuốc thử nhận biết.',
            'Giải bài toán amino acid tác dụng với acid, base.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 3',
      blocks: [
        {
          type: 'table',
          caption: 'So sánh các hợp chất chứa nitrogen',
          head: ['', 'Amine', 'Amino acid', 'Peptide, protein'],
          rows: [
            ['Nhóm đặc trưng', '−NH₂, −NH−, −N<', '−NH₂ và −COOH', 'Liên kết peptide −CO−NH−'],
            ['Tính acid – base', 'Base (amine béo làm quỳ hóa xanh)', 'Lưỡng tính', 'Thủy phân trong acid, base'],
            ['Phản ứng nhận biết', 'Aniline + nước bromine: kết tủa trắng', 'Quỳ tím tùy số nhóm −NH₂, −COOH', 'Biuret: màu tím (từ tripeptide)']
          ]
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Amino acid với quỳ tím',
          text: 'Số nhóm −NH₂ bằng số nhóm −COOH (glycine, alanine): quỳ không đổi màu. Nhiều −NH₂ hơn (lysine): quỳ hóa xanh. Nhiều −COOH hơn (glutamic acid): quỳ hóa đỏ.'
        }
      ]
    },
    {
      id: 'example-identify',
      kind: 'example',
      title: 'Ví dụ 1 — Nhận biết',
      blocks: [
        {
          type: 'worked',
          problem: 'Nhận biết ba dung dịch: methylamine, glycine, lòng trắng trứng.',
          steps: [
            'Dùng quỳ tím: methylamine làm quỳ hóa xanh.',
            'Hai mẫu còn lại cho tác dụng với Cu(OH)₂ trong NaOH: lòng trắng trứng cho màu tím (biuret).',
            'Mẫu còn lại là glycine.'
          ],
          answer: 'Quỳ tím nhận methylamine; phản ứng biuret nhận lòng trắng trứng; còn lại là glycine.'
        }
      ]
    },
    {
      id: 'example-amphoteric',
      kind: 'example',
      title: 'Ví dụ 2 — Amino acid tác dụng với acid và base',
      blocks: [
        {
          type: 'worked',
          problem: 'Amino acid X có một nhóm −NH₂ và một nhóm −COOH. Cho 8,9 g X tác dụng vừa đủ với NaOH thu được 11,1 g muối. Xác định X.',
          steps: [
            'Mỗi mol −COOH chuyển thành −COONa làm khối lượng tăng 22 g.',
            'n(X) = (11,1 − 8,9) / 22 = 0,1 mol ⇒ M(X) = 89.',
            'H₂N−R−COOH: R = 89 − 16 − 45 = 28 (C₂H₄) ⇒ α-amino acid là CH₃CH(NH₂)COOH.'
          ],
          answer: 'X là alanine.'
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
          id: 'g12-l11-c1',
          question: 'Dung dịch chất nào làm quỳ tím hóa đỏ?',
          options: [
            { id: 'a', text: 'Glycine' },
            { id: 'b', text: 'Lysine' },
            { id: 'c', text: 'Glutamic acid' },
            { id: 'd', text: 'Methylamine' }
          ],
          correct: 'c',
          explanation: 'Glutamic acid có hai nhóm −COOH và một nhóm −NH₂.'
        },
        {
          type: 'quiz',
          id: 'g12-l11-c2',
          question: 'Chất vừa tác dụng với HCl, vừa tác dụng với NaOH là',
          options: [
            { id: 'a', text: 'CH₃NH₂' },
            { id: 'b', text: 'H₂NCH₂COOH' },
            { id: 'c', text: 'C₆H₅NH₂' },
            { id: 'd', text: 'C₂H₅OH' }
          ],
          correct: 'b',
          explanation: 'Amino acid có tính lưỡng tính.'
        },
        {
          type: 'quiz',
          id: 'g12-l11-c3',
          question: 'Thủy phân hoàn toàn protein đơn giản thu được',
          options: [
            { id: 'a', text: 'glucose' },
            { id: 'b', text: 'các α-amino acid' },
            { id: 'c', text: 'các amine' },
            { id: 'd', text: 'glycerol và acid béo' }
          ],
          correct: 'b',
          explanation: 'Protein đơn giản chỉ gồm các gốc α-amino acid.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 3',
      blocks: [
        {
          type: 'list',
          items: [
            'Amine: tính base; aniline + nước bromine → kết tủa trắng.',
            'Amino acid: lưỡng tính; với NaOH khối lượng tăng 22 g/mol −COOH; với HCl tăng 36,5 g/mol −NH₂.',
            'Peptide, protein: thủy phân tạo α-amino acid; biuret màu tím; protein đông tụ khi đun nóng.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Mọi amino acid đều không làm đổi màu quỳ tím.', right: 'Phụ thuộc **số nhóm −NH₂ và −COOH**: lysine làm quỳ hóa xanh, glutamic acid làm quỳ hóa đỏ.' },
            { wrong: 'Amino acid + NaOH: khối lượng muối tăng 23 g mỗi mol.', right: 'H được thay bằng Na: tăng **22 g** cho mỗi mol nhóm −COOH.' },
            { wrong: 'Aniline phản ứng với NaOH vì có tính lưỡng tính.', right: 'Aniline chỉ có **tính base yếu**, không phản ứng với NaOH.' }
          ]
        },
        {
          type: 'p',
          text: 'Chương tiếp theo: **Polymer**.'
        }
      ]
    }
  ]
}
