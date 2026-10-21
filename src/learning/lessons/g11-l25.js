// Hóa học 11 · Chương 6 · Bài 25 — Ôn tập chương 6 (Hợp chất carbonyl – Carboxylic acid).
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g11-l25',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Hệ thống hóa cấu tạo, tính chất của aldehyde, ketone và carboxylic acid.',
    'Vận dụng để nhận biết, viết sơ đồ chuyển hóa và giải bài tập định lượng.'
  ],
  prerequisites: ['Bài 23 – 24 của chương 6.'],
  sources: [
    programme('Hợp chất carbonyl – Carboxylic acid'),
    textbook(11, 25)
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
          text: 'Ethanol, acetaldehyde và acetic acid chỉ khác nhau ở mức độ oxi hóa của một nguyên tử carbon. Làm thế nào để chuyển hóa giữa chúng và phân biệt ba chất này?'
        },
        {
          type: 'list',
          items: [
            'So sánh aldehyde, ketone và carboxylic acid.',
            'Viết dãy chuyển hóa alcohol → aldehyde → carboxylic acid → ester.',
            'Luyện nhận biết và bài toán hỗn hợp.'
          ]
        }
      ]
    },
    {
      id: 'map',
      kind: 'concept',
      title: 'Hệ thống kiến thức chương 6',
      blocks: [
        {
          type: 'table',
          caption: 'So sánh các loại hợp chất',
          head: ['', 'Aldehyde', 'Ketone', 'Carboxylic acid'],
          rows: [
            ['Nhóm chức', '−CHO', '>C=O giữa hai gốc', '−COOH'],
            ['Liên kết hydrogen liên phân tử', 'Không', 'Không', 'Có (bền)'],
            ['Khử (NaBH₄, H₂)', 'Alcohol bậc I', 'Alcohol bậc II', '—'],
            ['Tráng bạc / Cu(OH)₂, t°', 'Có', 'Không', 'Không (trừ HCOOH)'],
            ['Với NaHCO₃', 'Không', 'Không', 'Có, sủi bọt CO₂']
          ]
        },
        { type: 'heading', text: 'Dãy chuyển hóa' },
        { type: 'equation', text: 'C₂H₅OH + CuO → CH₃CHO + Cu + H₂O', condition: 't°' },
        { type: 'equation', text: 'CH₃CHO + Br₂ + H₂O → CH₃COOH + 2HBr' },
        { type: 'equation', text: 'CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O', condition: 'H₂SO₄ đặc, t°' }
      ]
    },
    {
      id: 'example-identify',
      kind: 'example',
      title: 'Ví dụ 1 — Nhận biết',
      blocks: [
        {
          type: 'worked',
          problem: 'Nhận biết ba dung dịch: ethanol, acetaldehyde, acetic acid.',
          steps: [
            'Dùng quỳ tím (hoặc NaHCO₃): acetic acid làm quỳ hóa đỏ (hoặc sủi bọt khí).',
            'Hai mẫu còn lại tác dụng với AgNO₃/NH₃, đun nóng: acetaldehyde tạo lớp bạc.',
            'Mẫu không có hiện tượng là ethanol.'
          ],
          answer: 'Quỳ tím nhận acetic acid; AgNO₃/NH₃ nhận acetaldehyde; còn lại là ethanol.',
          equations: ['CH₃COOH + NaHCO₃ → CH₃COONa + CO₂ + H₂O', 'CH₃CHO + 2[Ag(NH₃)₂]OH → CH₃COONH₄ + 2Ag + 3NH₃ + H₂O']
        }
      ]
    },
    {
      id: 'example-mixture',
      kind: 'example',
      title: 'Ví dụ 2 — Hỗn hợp aldehyde và acid',
      blocks: [
        {
          type: 'worked',
          problem: 'Hỗn hợp X gồm acetaldehyde và acetic acid. Cho X tác dụng với NaHCO₃ dư thu được 2,479 L CO₂ (điều kiện chuẩn). Cũng lượng X đó tác dụng với AgNO₃/NH₃ dư thu được 10,8 g Ag. Tính khối lượng X (C = 12, H = 1, O = 16, Ag = 108).',
          steps: [
            'Chỉ acid tạo CO₂: n(CH₃COOH) = n(CO₂) = 2,479 / 24,79 = 0,1 mol.',
            'Chỉ aldehyde tráng bạc: n(Ag) = 10,8 / 108 = 0,1 mol ⇒ n(CH₃CHO) = 0,05 mol.',
            'm(X) = 0,1 × 60 + 0,05 × 44 = 6 + 2,2 = 8,2 g.'
          ],
          answer: 'Khối lượng X là 8,2 g.'
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
          id: 'g11-l25-c1',
          question: 'Chất nào vừa tác dụng với NaHCO₃, vừa tham gia phản ứng tráng bạc?',
          options: [
            { id: 'a', text: 'CH₃COOH' },
            { id: 'b', text: 'HCOOH' },
            { id: 'c', text: 'CH₃CHO' },
            { id: 'd', text: 'CH₃COCH₃' }
          ],
          correct: 'b',
          explanation: 'Formic acid có cả nhóm −COOH và nhóm −CHO.'
        },
        {
          type: 'quiz',
          id: 'g11-l25-c2',
          question: 'Dãy sắp xếp theo chiều tăng dần nhiệt độ sôi là',
          options: [
            { id: 'a', text: 'CH₃COOH < C₂H₅OH < CH₃CHO' },
            { id: 'b', text: 'CH₃CHO < C₂H₅OH < CH₃COOH' },
            { id: 'c', text: 'C₂H₅OH < CH₃CHO < CH₃COOH' },
            { id: 'd', text: 'CH₃CHO < CH₃COOH < C₂H₅OH' }
          ],
          correct: 'b',
          explanation: 'Aldehyde không có liên kết hydrogen; liên kết hydrogen của acid bền hơn alcohol.'
        },
        {
          type: 'quiz',
          id: 'g11-l25-c3',
          question: 'Khử hoàn toàn propanal bằng NaBH₄ thu được',
          options: [
            { id: 'a', text: 'propan-1-ol' },
            { id: 'b', text: 'propan-2-ol' },
            { id: 'c', text: 'propanoic acid' },
            { id: 'd', text: 'propanone' }
          ],
          correct: 'a',
          explanation: 'Aldehyde bị khử thành alcohol bậc I.'
        }
      ]
    },
    {
      id: 'summary',
      kind: 'summary',
      title: 'Tổng kết chương 6',
      blocks: [
        {
          type: 'list',
          items: [
            'Mức oxi hóa tăng dần: alcohol bậc I → aldehyde → carboxylic acid.',
            'Nhận biết: AgNO₃/NH₃ hoặc Cu(OH)₂/NaOH, t° (aldehyde); NaHCO₃ hoặc quỳ tím (acid); I₂/NaOH (nhóm CH₃CO−).',
            'Bài toán hỗn hợp: dùng phản ứng chỉ một chất tham gia (NaHCO₃ với acid, tráng bạc với aldehyde).'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Hỗn hợp có HCHO: n(Ag) = 2n(aldehyde).', right: 'Với **HCHO**, n(Ag) = 4n(HCHO); cần kiểm tra trường hợp này.' },
            { wrong: 'Ketone làm mất màu nước bromine như aldehyde.', right: 'Nước bromine oxi hóa **aldehyde**; ketone thông thường không phản ứng.' },
            { wrong: 'Acetic acid phản ứng với NaHCO₃ theo tỉ lệ 2 : 1.', right: 'CH₃COOH + NaHCO₃ theo tỉ lệ **1 : 1**; tỉ lệ 2 : 1 là với CaCO₃ hoặc Na₂CO₃.' }
          ]
        },
        {
          type: 'p',
          text: 'Hết chương trình Hóa học 11. Tiếp theo: **Hóa học 12 — Ester – Lipid**.'
        }
      ]
    }
  ]
}
