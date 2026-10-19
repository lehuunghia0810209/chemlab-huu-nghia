// Hóa học 12 · Chương 3 · Bài 9 — Amino acid và peptide.
import { VERIFICATION, programme, textbook } from '../lessonMeta.js'

export default {
  id: 'g12-l9',
  contentVersion: 1,
  status: 'published',
  requirements: [
    'Nêu được khái niệm, đặc điểm cấu tạo; gọi được tên một số amino acid thông dụng (glycine, alanine, valine, lysine, glutamic acid).',
    'Nêu được tính chất vật lí của amino acid (dạng ion lưỡng cực, nhiệt độ nóng chảy, tính tan).',
    'Trình bày được tính chất hóa học của amino acid: tính lưỡng tính, phản ứng ester hóa, tính chất điện di, phản ứng trùng ngưng.',
    'Nêu được khái niệm peptide, liên kết peptide; trình bày được tính chất hóa học của peptide: phản ứng thủy phân, phản ứng màu biuret.'
  ],
  prerequisites: [
    'Bài 8: tính base của amine.',
    'Hóa 11 bài 24: tính acid và phản ứng ester hóa của carboxylic acid.'
  ],
  sources: [
    programme('Amino acid và peptide'),
    textbook(12, 9)
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
          text: 'Bột ngọt (mì chính) là muối monosodium của glutamic acid, một amino acid. Phân tử amino acid vừa có nhóm acid vừa có nhóm base. Điều đó ảnh hưởng thế nào đến tính chất của nó?'
        },
        {
          type: 'list',
          items: [
            'Nêu cấu tạo, gọi tên một số amino acid.',
            'Giải thích tính lưỡng tính, nhiệt độ nóng chảy cao của amino acid.',
            'Nêu tính chất điện di, phản ứng ester hóa, trùng ngưng.',
            'Nêu khái niệm peptide, viết phản ứng thủy phân và nhận biết bằng phản ứng biuret.'
          ]
        },
        { type: 'heading', text: 'Cần nhớ trước khi học' },
        { type: 'list', items: ['Nhóm −NH₂ có tính base; nhóm −COOH có tính acid.', 'Carboxylic acid tạo ester với alcohol khi có xúc tác acid.'] }
      ]
    },
    {
      id: 'definition',
      kind: 'concept',
      title: 'Amino acid: khái niệm và danh pháp',
      blocks: [
        {
          type: 'callout',
          title: 'Amino acid',
          text: 'Là hợp chất hữu cơ tạp chức, phân tử chứa đồng thời nhóm amino (**−NH₂**) và nhóm carboxyl (**−COOH**). Các amino acid trong tự nhiên chủ yếu là **α-amino acid** (nhóm −NH₂ gắn với C ở vị trí α so với nhóm −COOH).'
        },
        {
          type: 'table',
          caption: 'Một số α-amino acid thông dụng',
          head: ['Công thức', 'Tên thông thường', 'Kí hiệu', 'M'],
          rows: [
            ['H₂NCH₂COOH', 'glycine', 'Gly', '75'],
            ['CH₃CH(NH₂)COOH', 'alanine', 'Ala', '89'],
            ['(CH₃)₂CHCH(NH₂)COOH', 'valine', 'Val', '117'],
            ['H₂N[CH₂]₄CH(NH₂)COOH', 'lysine', 'Lys', '146'],
            ['HOOC[CH₂]₂CH(NH₂)COOH', 'glutamic acid', 'Glu', '147']
          ]
        },
        {
          type: 'p',
          text: 'Ở trạng thái rắn và trong dung dịch, amino acid tồn tại chủ yếu dạng **ion lưỡng cực**, ví dụ H₃N⁺−CH₂−COO⁻. Vì vậy amino acid là chất rắn kết tinh, nhiệt độ nóng chảy cao (thường kèm phân hủy), dễ tan trong nước.'
        }
      ]
    },
    {
      id: 'amino-reactions',
      kind: 'concept',
      title: 'Tính chất hóa học của amino acid',
      blocks: [
        { type: 'heading', text: 'Tính lưỡng tính' },
        { type: 'equation', text: 'H₂NCH₂COOH + HCl → ClH₃NCH₂COOH' },
        { type: 'equation', text: 'H₂NCH₂COOH + NaOH → H₂NCH₂COONa + H₂O' },
        { type: 'heading', text: 'Phản ứng ester hóa' },
        { type: 'equation', text: 'H₂NCH₂COOH + C₂H₅OH ⇌ H₂NCH₂COOC₂H₅ + H₂O', condition: 'HCl khí, t°' },
        { type: 'heading', text: 'Tính chất điện di' },
        {
          type: 'p',
          text: 'Trong điện trường, tùy pH của môi trường, amino acid tồn tại ở dạng cation, anion hoặc ion lưỡng cực nên di chuyển về cực âm, cực dương hoặc hầu như không di chuyển. Ví dụ ở pH = 6: lysine (dạng cation) di chuyển về cực âm, glutamic acid (dạng anion) di chuyển về cực dương, glycine hầu như không di chuyển. Tính chất này dùng để tách các amino acid.'
        },
        { type: 'heading', text: 'Phản ứng trùng ngưng' },
        {
          type: 'p',
          text: 'Các ε- và ω-amino acid tham gia trùng ngưng tạo polyamide, ví dụ ε-aminocaproic acid H₂N[CH₂]₅COOH trùng ngưng tạo nylon-6 và giải phóng nước.'
        }
      ]
    },
    {
      id: 'peptide',
      kind: 'concept',
      title: 'Peptide',
      blocks: [
        {
          type: 'callout',
          title: 'Peptide và liên kết peptide',
          text: 'Peptide là hợp chất chứa từ 2 đến 50 gốc α-amino acid liên kết với nhau bằng **liên kết peptide −CO−NH−**. Dipeptide có 2 gốc, tripeptide có 3 gốc…; peptide có n gốc thì có n − 1 liên kết peptide.'
        },
        {
          type: 'p',
          text: 'Tên peptide ghép kí hiệu các amino acid, bắt đầu từ amino acid đầu N (còn nhóm −NH₂ tự do), ví dụ Gly-Ala: H₂NCH₂CO−NHCH(CH₃)COOH.'
        },
        { type: 'heading', text: 'Phản ứng thủy phân' },
        { type: 'equation', text: 'C₅H₁₀N₂O₃ + H₂O → C₂H₅NO₂ + C₃H₇NO₂', condition: 'H⁺ hoặc OH⁻, t°; hoặc enzyme', note: 'Gly-Ala + H₂O → glycine + alanine.' },
        { type: 'heading', text: 'Phản ứng màu biuret' },
        {
          type: 'p',
          text: 'Peptide có từ **hai liên kết peptide trở lên** (từ tripeptide) tác dụng với Cu(OH)₂ trong môi trường kiềm tạo hợp chất màu **tím**. Dipeptide không có phản ứng này.'
        }
      ]
    },
    {
      id: 'example',
      kind: 'example',
      title: 'Ví dụ — Amino acid lưỡng tính và thủy phân peptide',
      blocks: [
        {
          type: 'worked',
          problem: '(a) Cho 7,5 g glycine tác dụng vừa đủ với dung dịch HCl. Tính khối lượng muối thu được. (b) Thủy phân hoàn toàn 14,6 g Gly-Ala. Tính khối lượng mỗi amino acid thu được (C = 12, H = 1, O = 16, N = 14, Cl = 35,5).',
          steps: [
            '(a) n(Gly) = 7,5 / 75 = 0,1 mol ⇒ m(muối) = 7,5 + 0,1 × 36,5 = 11,15 g.',
            '(b) M(Gly-Ala) = 75 + 89 − 18 = 146 ⇒ n = 14,6 / 146 = 0,1 mol.',
            'm(Gly) = 0,1 × 75 = 7,5 g; m(Ala) = 0,1 × 89 = 8,9 g.'
          ],
          answer: '(a) 11,15 g muối; (b) 7,5 g glycine và 8,9 g alanine.'
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
          id: 'g12-l9-c1',
          question: 'Amino acid có nhiệt độ nóng chảy cao, dễ tan trong nước vì',
          options: [
            { id: 'a', text: 'phân tử khối rất lớn' },
            { id: 'b', text: 'tồn tại chủ yếu dạng ion lưỡng cực' },
            { id: 'c', text: 'là hợp chất không phân cực' },
            { id: 'd', text: 'có liên kết peptide' }
          ],
          correct: 'b',
          explanation: 'Dạng ion lưỡng cực H₃N⁺−R−COO⁻ giống hợp chất ion.'
        },
        {
          type: 'quiz',
          id: 'g12-l9-c2',
          question: 'Ở pH = 6, amino acid di chuyển về cực âm trong điện trường là',
          options: [
            { id: 'a', text: 'glycine' },
            { id: 'b', text: 'glutamic acid' },
            { id: 'c', text: 'lysine' },
            { id: 'd', text: 'alanine' }
          ],
          correct: 'c',
          explanation: 'Lysine có thêm nhóm −NH₂ nên tồn tại dạng cation.'
        },
        {
          type: 'quiz',
          id: 'g12-l9-c3',
          question: 'Chất nào không có phản ứng màu biuret?',
          options: [
            { id: 'a', text: 'Gly-Ala' },
            { id: 'b', text: 'Gly-Ala-Val' },
            { id: 'c', text: 'Albumin (lòng trắng trứng)' },
            { id: 'd', text: 'Ala-Gly-Gly-Val' }
          ],
          correct: 'a',
          explanation: 'Dipeptide chỉ có một liên kết peptide.'
        },
        {
          type: 'quiz',
          id: 'g12-l9-c4',
          question: 'Số liên kết peptide trong một pentapeptide là',
          options: [
            { id: 'a', text: '3' },
            { id: 'b', text: '4' },
            { id: 'c', text: '5' },
            { id: 'd', text: '6' }
          ],
          correct: 'b',
          explanation: 'n gốc amino acid có n − 1 liên kết peptide.'
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
            'Amino acid có −NH₂ và −COOH; tồn tại dạng ion lưỡng cực; chất rắn, tan tốt, nóng chảy cao.',
            'Lưỡng tính (tác dụng với HCl và NaOH); ester hóa; điện di theo pH; ε-, ω-amino acid trùng ngưng tạo polyamide.',
            'Peptide: 2 – 50 gốc α-amino acid nối bằng liên kết −CO−NH−; n gốc có n − 1 liên kết.',
            'Peptide bị thủy phân tạo α-amino acid; từ tripeptide trở lên có phản ứng màu biuret (tím).'
          ]
        },
        {
          type: 'mistakes',
          items: [
            { wrong: 'Liên kết −CO−NH− giữa hai gốc amino acid bất kì đều là liên kết peptide.', right: 'Liên kết peptide là liên kết −CO−NH− giữa hai gốc **α-amino acid**.' },
            { wrong: 'Dipeptide cho phản ứng màu biuret.', right: 'Cần **từ 2 liên kết peptide** (tripeptide trở lên).' },
            { wrong: 'M(Gly-Ala) = 75 + 89 = 164.', right: 'Tạo liên kết peptide tách 1 H₂O: M = 75 + 89 − 18 = **146**.' }
          ]
        },
        {
          type: 'p',
          text: 'Bài tiếp theo: **Protein và enzyme**.'
        }
      ]
    }
  ]
}
