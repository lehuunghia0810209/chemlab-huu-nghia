// Hóa học 12 · Chương 6 · Bài 20 — Kim loại trong tự nhiên và phương pháp tách kim loại.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l20',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được trạng thái tự nhiên của kim loại và một số quặng kim loại phổ biến.',
    'Trình bày được nguyên tắc và các phương pháp tách kim loại: nhiệt luyện, thủy luyện, điện phân.',
    'Nêu được ý nghĩa của việc tái chế kim loại.'
  ],
  prerequisites: [
    'Bài 16: điện phân nóng chảy, điện phân dung dịch.',
    'Bài 19: kim loại tác dụng với dung dịch muối.'
  ],
  sources: [
    programme('Đại cương về kim loại'),
    textbook(12, 20)
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
          text: 'Người ta có thể đãi cát để lấy vàng, nhưng không thể “đãi” được nhôm hay sắt. Vì sao, và làm thế nào để lấy được kim loại từ quặng?'
        },
        {
          type: 'list',
          items: [
            'Nêu trạng thái tự nhiên của kim loại, một số quặng phổ biến.',
            'Trình bày nguyên tắc tách kim loại.',
            'Chọn phương pháp nhiệt luyện, thủy luyện hay điện phân phù hợp.',
            'Nêu ý nghĩa của tái chế kim loại.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Kim loại có tính khử càng mạnh thì ion của nó càng khó bị khử.', 'Điện phân nóng chảy điều chế kim loại hoạt động mạnh.'] }
      ]
    },
    {
      id: 'nature',
      kind: 'concept',
      title: 'Kim loại trong tự nhiên',
      blocks: [
        {
          type: 'p',
          text: 'Một số kim loại kém hoạt động như Au, Pt tồn tại ở dạng **đơn chất**; phần lớn kim loại tồn tại ở dạng **hợp chất** (oxide, sulfide, carbonate, muối…) trong các khoáng vật, quặng.'
        },
        {
          type: 'table',
          caption: 'Một số quặng phổ biến',
          head: ['Quặng', 'Thành phần chính', 'Kim loại'],
          rows: [
            ['Bauxite', 'Al₂O₃·2H₂O', 'Al'],
            ['Hematite đỏ', 'Fe₂O₃', 'Fe'],
            ['Magnetite', 'Fe₃O₄', 'Fe'],
            ['Pyrite', 'FeS₂', '(Fe, nguyên liệu sản xuất H₂SO₄)'],
            ['Chalcopyrite', 'CuFeS₂', 'Cu'],
            ['Sphalerite (blende)', 'ZnS', 'Zn']
          ]
        }
      ]
    },
    {
      id: 'methods',
      kind: 'concept',
      title: 'Nguyên tắc và phương pháp tách kim loại',
      blocks: [
        {
          type: 'callout',
          title: 'Nguyên tắc',
          text: 'Khử ion kim loại trong hợp chất thành nguyên tử kim loại: **Mⁿ⁺ + ne → M**.'
        },
        { type: 'heading', text: 'Nhiệt luyện' },
        {
          type: 'p',
          text: 'Dùng chất khử như C, CO, H₂ hoặc Al khử oxide kim loại ở nhiệt độ cao; dùng cho kim loại có độ hoạt động trung bình và yếu (Zn, Fe, Sn, Pb, Cu…).'
        },
        { type: 'equation', text: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂', condition: 't°' },
        { type: 'equation', text: '2ZnS + 3O₂ → 2ZnO + 2SO₂', condition: 't°', note: 'Quặng sulfide được đốt thành oxide trước.' },
        { type: 'equation', text: 'ZnO + C → Zn + CO', condition: 't°' },
        { type: 'heading', text: 'Thủy luyện' },
        {
          type: 'p',
          text: 'Hòa tan hợp chất kim loại bằng dung dịch thích hợp rồi dùng kim loại có tính khử mạnh hơn khử ion kim loại trong dung dịch; dùng cho kim loại kém hoạt động (Cu, Ag, Au…).'
        },
        { type: 'equation', text: 'Fe + CuSO₄ → FeSO₄ + Cu' },
        { type: 'heading', text: 'Điện phân' },
        {
          type: 'p',
          text: 'Điện phân nóng chảy dùng cho kim loại hoạt động mạnh (Na, K, Mg, Ca, Al); điện phân dung dịch dùng cho một số kim loại trung bình, yếu (Zn, Cu…).'
        },
        { type: 'equation', text: '2Al₂O₃ → 4Al + 3O₂', condition: 'điện phân nóng chảy, cryolite' }
      ]
    },
    {
      id: 'recycle',
      kind: 'concept',
      title: 'Tái chế kim loại',
      blocks: [
        {
          type: 'list',
          items: [
            'Tái chế giúp tiết kiệm tài nguyên quặng (có hạn), tiết kiệm năng lượng (tái chế nhôm tốn ít năng lượng hơn nhiều so với sản xuất từ bauxite), giảm rác thải và ô nhiễm môi trường.',
            'Quy trình chung: thu gom, phân loại → xử lí, làm sạch → nấu chảy, tinh chế → tạo sản phẩm mới.'
          ]
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Sản xuất sắt từ quặng hematite',
      blocks: [
        {
          type: 'worked',
          problem: 'Từ 1 tấn quặng hematite chứa 80% Fe₂O₃ sản xuất sắt bằng CO với hiệu suất 90%. Tính khối lượng Fe thu được (Fe = 56, O = 16).',
          steps: [
            'm(Fe₂O₃) = 1 × 80% = 0,8 tấn.',
            'Cứ 160 tấn Fe₂O₃ chứa 112 tấn Fe ⇒ Fe lí thuyết = 0,8 × 112 / 160 = 0,56 tấn.',
            'Fe thực tế = 0,56 × 90% = 0,504 tấn.'
          ],
          answer: 'Thu được 0,504 tấn (504 kg) Fe.'
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
          id: 'g12-l20-c1',
          question: 'Kim loại nào thường tồn tại ở dạng đơn chất trong tự nhiên?',
          options: [
            { id: 'a', text: 'Na' },
            { id: 'b', text: 'Al' },
            { id: 'c', text: 'Au' },
            { id: 'd', text: 'Fe' }
          ],
          correct: 'c',
          explanation: 'Vàng rất kém hoạt động.'
        },
        {
          type: 'quiz',
          id: 'g12-l20-c2',
          question: 'Phương pháp thích hợp để điều chế Mg từ MgCl₂ là',
          options: [
            { id: 'a', text: 'dùng CO khử ở nhiệt độ cao' },
            { id: 'b', text: 'điện phân MgCl₂ nóng chảy' },
            { id: 'c', text: 'điện phân dung dịch MgCl₂' },
            { id: 'd', text: 'dùng Fe đẩy Mg khỏi dung dịch' }
          ],
          correct: 'b',
          explanation: 'Mg hoạt động mạnh; điện phân dung dịch chỉ tạo H₂ ở cathode.'
        },
        {
          type: 'quiz',
          id: 'g12-l20-c3',
          question: 'Phản ứng Fe + CuSO₄ → FeSO₄ + Cu minh họa phương pháp',
          options: [
            { id: 'a', text: 'nhiệt luyện' },
            { id: 'b', text: 'thủy luyện' },
            { id: 'c', text: 'điện phân' },
            { id: 'd', text: 'tái chế' }
          ],
          correct: 'b',
          explanation: 'Kim loại mạnh hơn khử ion kim loại trong dung dịch.'
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
            'Au, Pt có dạng đơn chất; phần lớn kim loại ở dạng hợp chất trong quặng.',
            'Nguyên tắc: Mⁿ⁺ + ne → M.',
            'Nhiệt luyện (C, CO, H₂, Al): kim loại trung bình, yếu; thủy luyện: kim loại yếu; điện phân nóng chảy: kim loại mạnh.',
            'Tái chế kim loại tiết kiệm tài nguyên, năng lượng và bảo vệ môi trường.'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Dùng CO khử Al₂O₃ để sản xuất nhôm.', right: 'CO không khử được Al₂O₃; nhôm được sản xuất bằng **điện phân nóng chảy**.' },
            { wrong: 'Điện phân dung dịch NaCl để điều chế Na.', right: 'Phải **điện phân NaCl nóng chảy**; trong dung dịch nước bị khử tạo H₂.' },
            { wrong: 'Tính Fe theo khối lượng quặng mà quên hàm lượng Fe₂O₃.', right: 'Nhân với **hàm lượng** oxide trong quặng và **hiệu suất**.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Hợp kim**.'
        }
      ]
    }
  ]
}
