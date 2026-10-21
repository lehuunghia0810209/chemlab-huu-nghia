// Hóa học 10 · Chương 2 · Bài 7 — Xu hướng biến đổi thành phần và một số tính chất
// của hợp chất trong một chu kì (oxide và hydroxide cao nhất, chu kì 3).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g10-l7',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nhận xét được xu hướng biến đổi thành phần (công thức) oxide cao nhất và hydroxide tương ứng của các nguyên tố chu kì 3.',
    'Nhận xét và giải thích được xu hướng biến đổi tính acid, tính base của các oxide và hydroxide trong một chu kì.',
    'Viết được phương trình hóa học minh họa tính acid, base, lưỡng tính của oxide và hydroxide.'
  ],
  prerequisites: [
    'Bài 6: trong chu kì, tính kim loại giảm, tính phi kim tăng.',
    'Hóa trị và cách lập công thức hóa học (KHTN lớp 7–8).',
    'Oxide base tác dụng với acid, oxide acid tác dụng với base (KHTN lớp 8).'
  ],
  sources: [
    programme('Xu hướng biến đổi thành phần và một số tính chất của hợp chất trong một chu kì'),
    textbook(10, 7)
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
          text: 'NaOH là xút ăn da, một base mạnh; H₂SO₄ là acid mạnh dùng trong acquy. Sodium và sulfur cùng ở chu kì 3. Vì sao hợp chất của chúng lại có tính chất trái ngược nhau như vậy?'
        },
        {
          type: 'list',
          items: [
            'Viết công thức oxide cao nhất và hydroxide tương ứng của các nguyên tố chu kì 3.',
            'Nhận ra quy luật hóa trị cao nhất với oxygen theo số thứ tự nhóm.',
            'Giải thích xu hướng tính base giảm, tính acid tăng trong chu kì.',
            'Viết phương trình minh họa, trong đó có tính lưỡng tính của Al(OH)₃.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Hóa trị của oxygen là II, của nhóm OH là I.', 'Oxide base + acid → muối + nước; oxide acid + base → muối + nước.'] }
      ]
    },
    {
      id: 'composition',
      kind: 'concept',
      title: 'Thành phần oxide và hydroxide cao nhất',
      blocks: [
        {
          type: 'callout',
          title: 'Hóa trị cao nhất với oxygen',
          text: 'Với nguyên tố nhóm A, **hóa trị cao nhất trong oxide = số thứ tự nhóm** (trừ một vài ngoại lệ như fluorine, oxygen).'
        },
        {
          type: 'table',
          caption: 'Chu kì 3: oxide cao nhất và hydroxide tương ứng',
          head: ['Nguyên tố', 'Nhóm', 'Oxide cao nhất', 'Hydroxide tương ứng', 'Tính chất'],
          rows: [
            ['Na', 'IA', 'Na₂O', 'NaOH', 'Base mạnh (kiềm)'],
            ['Mg', 'IIA', 'MgO', 'Mg(OH)₂', 'Base yếu'],
            ['Al', 'IIIA', 'Al₂O₃', 'Al(OH)₃', 'Lưỡng tính'],
            ['Si', 'IVA', 'SiO₂', 'H₂SiO₃', 'Acid rất yếu'],
            ['P', 'VA', 'P₂O₅', 'H₃PO₄', 'Acid trung bình'],
            ['S', 'VIA', 'SO₃', 'H₂SO₄', 'Acid mạnh'],
            ['Cl', 'VIIA', 'Cl₂O₇', 'HClO₄', 'Acid rất mạnh']
          ]
        },
        {
          type: 'p',
          text: 'Từ Na đến Cl, hóa trị cao nhất với oxygen tăng dần từ I đến VII. Hydroxide của kim loại có dạng M(OH)ₙ; hydroxide của phi kim là acid chứa oxygen.'
        }
      ]
    },
    {
      id: 'trend',
      kind: 'concept',
      title: 'Xu hướng tính acid – base',
      blocks: [
        {
          type: 'callout',
          title: 'Quy luật',
          text: 'Trong một chu kì, theo chiều tăng điện tích hạt nhân: **tính base** của oxide và hydroxide **giảm dần**, đồng thời **tính acid tăng dần**.'
        },
        {
          type: 'p',
          text: 'Giải thích: từ trái sang phải, tính kim loại của nguyên tố giảm và tính phi kim tăng (bài 6). Oxide, hydroxide của kim loại mạnh có tính base; của phi kim mạnh có tính acid. Al nằm ở ranh giới nên Al₂O₃ và Al(OH)₃ có tính lưỡng tính.'
        },
        {
          type: 'list',
          items: [
            'Na₂O, MgO là oxide base; Al₂O₃ là oxide lưỡng tính.',
            'SiO₂, P₂O₅, SO₃, Cl₂O₇ là oxide acid.',
            'NaOH > Mg(OH)₂ > Al(OH)₃ (tính base giảm); H₂SiO₃ < H₃PO₄ < H₂SO₄ < HClO₄ (tính acid tăng).'
          ]
        }
      ]
    },
    {
      id: 'equations',
      kind: 'concept',
      title: 'Phương trình minh họa',
      blocks: [
        { type: 'heading', text: 'Oxide base, oxide acid tác dụng với nước' },
        { type: 'equation', text: 'Na₂O + H₂O → 2NaOH' },
        { type: 'equation', text: 'SO₃ + H₂O → H₂SO₄' },
        { type: 'equation', text: 'P₂O₅ + 3H₂O → 2H₃PO₄' },
        { type: 'heading', text: 'Tính base và tính acid' },
        { type: 'equation', text: 'MgO + 2HCl → MgCl₂ + H₂O' },
        { type: 'equation', text: 'Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O' },
        { type: 'equation', text: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O' },
        { type: 'heading', text: 'Tính lưỡng tính của Al(OH)₃' },
        { type: 'equation', text: 'Al(OH)₃ + 3HCl → AlCl₃ + 3H₂O', note: 'Al(OH)₃ thể hiện tính base.' },
        { type: 'equation', text: 'Al(OH)₃ + NaOH → Na[Al(OH)₄]', note: 'Al(OH)₃ thể hiện tính acid; sản phẩm là sodium tetrahydroxoaluminate.' },
        {
          type: 'callout',
          tone: 'note',
          title: 'Lưu ý',
          text: 'Ở điều kiện thường, MgO tác dụng với nước rất chậm (không đáng kể), Al₂O₃ và SiO₂ không tác dụng với nước. Vì vậy chỉ viết phản ứng với nước cho Na₂O và các oxide acid tan như SO₃, P₂O₅.'
        }
      ]
    },
    {
      id: 'example-formula',
      kind: 'example',
      title: 'Ví dụ — Tìm nguyên tố từ oxide cao nhất',
      blocks: [
        {
          type: 'worked',
          problem: 'Nguyên tố R thuộc chu kì 3, oxide cao nhất có công thức R₂O₅. (a) Xác định R. (b) Viết công thức hydroxide tương ứng và cho biết tính acid hay base. (c) So sánh tính acid của hydroxide đó với H₂SO₄.',
          steps: [
            'R₂O₅ ⇒ hóa trị cao nhất của R với oxygen là V ⇒ R thuộc nhóm VA.',
            'Chu kì 3, nhóm VA ⇒ R là phosphorus (Z = 15).',
            'Hydroxide tương ứng là H₃PO₄, một acid (P là phi kim).',
            'S đứng sau P trong chu kì 3 nên tính phi kim mạnh hơn ⇒ H₂SO₄ có tính acid mạnh hơn H₃PO₄.'
          ],
          answer: 'R là P; hydroxide là acid H₃PO₄, có tính acid yếu hơn H₂SO₄.'
        }
      ]
    },
    {
      id: 'example-mass',
      kind: 'example',
      title: 'Ví dụ 2 — Phần trăm khối lượng trong oxide',
      blocks: [
        {
          type: 'worked',
          problem: 'Oxide cao nhất của nguyên tố X thuộc nhóm IIIA có chứa 52,94% X theo khối lượng. Xác định X (O = 16).',
          steps: [
            'Nhóm IIIA ⇒ oxide cao nhất có dạng X₂O₃.',
            '%X = 2M(X) / (2M(X) + 48) = 0,5294.',
            '2M(X) = 0,5294 × (2M(X) + 48) ⇒ 0,9412 M(X) = 25,41 ⇒ M(X) ≈ 27.'
          ],
          answer: 'M(X) = 27 g/mol ⇒ X là aluminium; oxide cao nhất là Al₂O₃ (oxide lưỡng tính).'
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
          id: 'g10-l7-c1',
          question: 'Oxide cao nhất của sulfur (nhóm VIA) có công thức là',
          options: [
            { id: 'a', text: 'SO₂' },
            { id: 'b', text: 'SO₃' },
            { id: 'c', text: 'S₂O₃' },
            { id: 'd', text: 'SO' }
          ],
          correct: 'b',
          explanation: 'Nhóm VIA ⇒ hóa trị cao nhất với oxygen là VI ⇒ SO₃. SO₂ là oxide nhưng không phải oxide cao nhất.'
        },
        {
          type: 'quiz',
          id: 'g10-l7-c2',
          question: 'Dãy hydroxide nào sắp xếp theo chiều tính base giảm dần?',
          options: [
            { id: 'a', text: 'Al(OH)₃, Mg(OH)₂, NaOH' },
            { id: 'b', text: 'NaOH, Mg(OH)₂, Al(OH)₃' },
            { id: 'c', text: 'Mg(OH)₂, NaOH, Al(OH)₃' },
            { id: 'd', text: 'NaOH, Al(OH)₃, Mg(OH)₂' }
          ],
          correct: 'b',
          explanation: 'Na, Mg, Al đứng theo thứ tự trong chu kì 3; tính kim loại giảm nên tính base của hydroxide giảm.'
        },
        {
          type: 'quiz',
          id: 'g10-l7-c3',
          question: 'Hydroxide nào vừa tác dụng được với dung dịch HCl, vừa tác dụng được với dung dịch NaOH?',
          options: [
            { id: 'a', text: 'Mg(OH)₂' },
            { id: 'b', text: 'NaOH' },
            { id: 'c', text: 'Al(OH)₃' },
            { id: 'd', text: 'H₂SO₄' }
          ],
          correct: 'c',
          explanation: 'Al(OH)₃ lưỡng tính: Al(OH)₃ + 3HCl → AlCl₃ + 3H₂O và Al(OH)₃ + NaOH → Na[Al(OH)₄].'
        },
        {
          type: 'quiz',
          id: 'g10-l7-c4',
          question: 'Acid nào mạnh nhất?',
          options: [
            { id: 'a', text: 'H₃PO₄' },
            { id: 'b', text: 'H₂SiO₃' },
            { id: 'c', text: 'H₂SO₄' },
            { id: 'd', text: 'HClO₄' }
          ],
          correct: 'd',
          explanation: 'Cl đứng cuối chu kì 3 (trước khí hiếm), tính phi kim mạnh nhất nên HClO₄ có tính acid mạnh nhất.'
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
            'Hóa trị cao nhất với oxygen = số thứ tự nhóm A: Na₂O, MgO, Al₂O₃, SiO₂, P₂O₅, SO₃, Cl₂O₇.',
            'Trong chu kì: tính base của oxide, hydroxide giảm dần; tính acid tăng dần.',
            'Al₂O₃ và Al(OH)₃ có tính lưỡng tính.',
            'Mạnh nhất chu kì 3: NaOH (base), HClO₄ (acid).'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Oxide cao nhất của S là SO₂.', right: 'S thuộc nhóm VIA nên oxide cao nhất là **SO₃** (hóa trị VI).' },
            { wrong: 'Al(OH)₃ là base nên chỉ tác dụng với acid.', right: 'Al(OH)₃ **lưỡng tính**: tác dụng được với cả acid và base mạnh.' },
            { wrong: 'MgO tác dụng mạnh với nước giống Na₂O.', right: 'Ở điều kiện thường MgO **hầu như không tan**, phản ứng với nước rất chậm và không đáng kể.' },
            { wrong: 'Tính acid của H₂SiO₃ mạnh hơn H₃PO₄ vì có ít nguyên tử H hơn.', right: 'So sánh theo **tính phi kim** của nguyên tố trung tâm: Si < P nên H₂SiO₃ yếu hơn H₃PO₄.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Định luật tuần hoàn. Ý nghĩa của bảng tuần hoàn các nguyên tố hóa học**.'
        }
      ]
    }
  ]
}
