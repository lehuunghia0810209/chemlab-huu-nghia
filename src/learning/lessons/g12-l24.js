// Hóa học 12 · Chương 7 · Bài 24 — Nguyên tố nhóm IA.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l24',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được trạng thái tự nhiên, cấu hình electron lớp ngoài cùng và xu hướng biến đổi tính chất vật lí của các kim loại nhóm IA.',
    'Trình bày được tính khử mạnh của kim loại nhóm IA (tác dụng với nước, chlorine, oxygen); cách bảo quản; màu ngọn lửa của Li, Na, K.',
    'Trình bày được tính chất và ứng dụng của một số hợp chất: NaCl, NaOH, NaHCO₃, Na₂CO₃; phương pháp Solvay sản xuất soda.'
  ],
  prerequisites: [
    'Bài 18 – 19: cấu tạo và tính chất chung của kim loại.',
    'Bài 16: điện phân nóng chảy và dung dịch NaCl.'
  ],
  sources: [
    programme('Nguyên tố nhóm IA và nhóm IIA'),
    textbook(12, 24)
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
          text: 'Mẩu natri thả vào chậu nước chạy vòng quanh, xèo xèo và có thể bốc cháy. Vì sao kim loại kiềm phải ngâm trong dầu hỏa, và muối ăn, bột nở, soda – những hợp chất quen thuộc của natri – được dùng thế nào?'
        },
        {
          type: 'list',
          items: [
            'Nêu cấu hình electron, xu hướng biến đổi tính chất vật lí của nhóm IA.',
            'Viết phản ứng thể hiện tính khử mạnh của kim loại kiềm; nhận biết bằng màu ngọn lửa.',
            'Nêu tính chất, ứng dụng của NaCl, NaOH, NaHCO₃, Na₂CO₃.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Kim loại có ít electron lớp ngoài cùng dễ nhường electron.', 'Điện phân NaCl nóng chảy thu được Na.'] }
      ]
    },
    {
      id: 'overview',
      kind: 'concept',
      title: 'Đặc điểm chung và tính chất vật lí',
      blocks: [
        {
          type: 'list',
          items: [
            'Nhóm IA gồm các kim loại kiềm Li, Na, K, Rb, Cs, Fr (Fr là nguyên tố phóng xạ). Cấu hình electron lớp ngoài cùng **ns¹**; trong hợp chất có số oxi hóa **+1**.',
            'Trong tự nhiên chỉ tồn tại ở dạng hợp chất (NaCl trong nước biển, mỏ muối; KCl…).',
            'Kim loại kiềm mềm (cắt được bằng dao), nhẹ, nhiệt độ nóng chảy thấp; có mạng tinh thể lập phương tâm khối. Từ Li đến Cs, nhiệt độ nóng chảy giảm dần.'
          ]
        }
      ]
    },
    {
      id: 'reactions',
      kind: 'concept',
      title: 'Tính chất hóa học',
      blocks: [
        {
          type: 'p',
          text: 'Kim loại kiềm có **tính khử rất mạnh**, tăng dần từ Li đến Cs: M → M⁺ + e.'
        },
        { type: 'equation', text: '2Na + 2H₂O → 2NaOH + H₂', note: 'Phản ứng mãnh liệt ở nhiệt độ thường; K, Rb, Cs phản ứng càng mạnh hơn.' },
        { type: 'equation', text: '2Na + Cl₂ → 2NaCl', condition: 't°' },
        { type: 'equation', text: '4Na + O₂ → 2Na₂O', note: 'Trong không khí, kim loại kiềm nhanh chóng bị oxi hóa.' },
        {
          type: 'callout',
          tone: 'note',
          title: 'Bảo quản và nhận biết',
          text: 'Kim loại kiềm được bảo quản bằng cách ngâm trong dầu hỏa. Màu ngọn lửa khi đốt hợp chất: **Li đỏ tía, Na vàng, K tím nhạt**.'
        }
      ]
    },
    {
      id: 'compounds',
      kind: 'concept',
      title: 'Một số hợp chất quan trọng',
      blocks: [
        {
          type: 'table',
          caption: 'Hợp chất của natri',
          head: ['Hợp chất', 'Tính chất', 'Ứng dụng'],
          rows: [
            ['NaCl', 'Chất rắn, tan tốt trong nước', 'Muối ăn, bảo quản thực phẩm; nguyên liệu sản xuất Na, NaOH, Cl₂'],
            ['NaOH (xút)', 'Base mạnh, ăn da, hút ẩm', 'Sản xuất xà phòng, giấy, tơ nhân tạo, chế biến dầu mỏ'],
            ['NaHCO₃', 'Ít tan, lưỡng tính, bị nhiệt phân', 'Bột nở, thuốc giảm đau dạ dày do thừa acid'],
            ['Na₂CO₃ (soda)', 'Tan tốt, dung dịch có tính base', 'Sản xuất thủy tinh, xà phòng, làm mềm nước cứng']
          ]
        },
        { type: 'equation', text: '2NaHCO₃ → Na₂CO₃ + CO₂ + H₂O', condition: 't°', note: 'Khí CO₂ làm bánh nở xốp.' },
        { type: 'heading', text: 'Phương pháp Solvay sản xuất soda' },
        { type: 'equation', text: 'NaCl + NH₃ + CO₂ + H₂O → NaHCO₃ + NH₄Cl', note: 'NaHCO₃ ít tan nên tách ra; sau đó nung NaHCO₃ thu được Na₂CO₃.' }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Natri và hợp chất',
      blocks: [
        {
          type: 'worked',
          problem: '(a) Cho 4,6 g Na vào nước dư. Tính thể tích H₂ (điều kiện chuẩn, 24,79 L/mol) và khối lượng NaOH tạo thành. (b) Nung 16,8 g NaHCO₃ đến khối lượng không đổi. Tính khối lượng chất rắn còn lại (Na = 23, H = 1, C = 12, O = 16).',
          steps: [
            '(a) n(Na) = 0,2 mol ⇒ n(H₂) = 0,1 mol, V = 2,479 L; n(NaOH) = 0,2 mol, m = 8 g.',
            '(b) n(NaHCO₃) = 16,8 / 84 = 0,2 mol ⇒ n(Na₂CO₃) = 0,1 mol.',
            'm(Na₂CO₃) = 0,1 × 106 = 10,6 g.'
          ],
          answer: '(a) 2,479 L H₂ và 8 g NaOH; (b) 10,6 g Na₂CO₃.'
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
          id: 'g12-l24-c1',
          question: 'Cấu hình electron lớp ngoài cùng của kim loại kiềm là',
          options: [
            { id: 'a', text: 'ns¹' },
            { id: 'b', text: 'ns²' },
            { id: 'c', text: 'ns²np¹' },
            { id: 'd', text: 'ns²np⁵' }
          ],
          correct: 'a',
          explanation: 'Kim loại kiềm có 1 electron lớp ngoài cùng.'
        },
        {
          type: 'quiz',
          id: 'g12-l24-c2',
          question: 'Kim loại kiềm được bảo quản bằng cách',
          options: [
            { id: 'a', text: 'ngâm trong nước' },
            { id: 'b', text: 'ngâm trong dầu hỏa' },
            { id: 'c', text: 'để ngoài không khí' },
            { id: 'd', text: 'ngâm trong ethanol' }
          ],
          correct: 'b',
          explanation: 'Dầu hỏa ngăn kim loại tiếp xúc với không khí và hơi nước.'
        },
        {
          type: 'quiz',
          id: 'g12-l24-c3',
          question: 'Đốt hợp chất của natri, ngọn lửa có màu',
          options: [
            { id: 'a', text: 'đỏ tía' },
            { id: 'b', text: 'vàng' },
            { id: 'c', text: 'tím nhạt' },
            { id: 'd', text: 'lục' }
          ],
          correct: 'b',
          explanation: 'Li đỏ tía, Na vàng, K tím nhạt.'
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
            'Nhóm IA: ns¹, số oxi hóa +1; mềm, nhẹ, nhiệt độ nóng chảy thấp.',
            'Tính khử rất mạnh, tăng từ Li đến Cs; tác dụng mạnh với nước; bảo quản trong dầu hỏa.',
            'Màu ngọn lửa: Li đỏ tía, Na vàng, K tím nhạt.',
            'NaCl, NaOH, NaHCO₃ (bột nở), Na₂CO₃ (soda, sản xuất bằng phương pháp Solvay).'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Tính khử của kim loại kiềm giảm dần từ Li đến Cs.', right: 'Bán kính tăng nên tính khử **tăng dần** từ Li đến Cs.' },
            { wrong: 'Nung Na₂CO₃ thu được Na₂O và CO₂.', right: 'Na₂CO₃ **bền nhiệt**; chỉ NaHCO₃ bị nhiệt phân thành Na₂CO₃, CO₂ và H₂O.' },
            { wrong: 'Cho Na vào dung dịch CuSO₄ thu được Cu.', right: 'Na phản ứng với **nước** trước tạo NaOH, rồi tạo Cu(OH)₂ kết tủa xanh.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Nguyên tố nhóm IIA**.'
        }
      ]
    }
  ]
}
