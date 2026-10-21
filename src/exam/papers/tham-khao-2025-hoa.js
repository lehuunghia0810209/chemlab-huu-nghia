// Đề tham khảo Kỳ thi tốt nghiệp THPT từ năm 2025 — Hóa học (Bộ GD&ĐT).
// Transcribed from the official scanned PDF (04_HoaHoc.pdf, 5 pages, SHA-256
// 3f27e78f6d7afe590e481f182429d7770f907743b8dd6551a0da3fe22c63affb) linked by
// Cục Quản lý chất lượng on 18/10/2024. Question order, option order, numbers
// and the answer key (page 5, “ĐÁP ÁN ĐỀ THAM KHẢO”) follow the original.
// Figures are crops of the original pages. Solutions are written by ChemLab
// (solution.official = false); chapter tags are ChemLab-assigned (meta.status
// 'internal'); the paper publishes no per-question level, so none is set.
// Per-question check list: docs/exam/papers/tham-khao-2025-hoa.md

// displayWidth: on-screen width close to the printed size; narrower screens scroll the figure.
const figure = (file, width, height, displayWidth, alt) => ({ type: 'figure', src: new URL(`./assets/tham-khao-2025-hoa/${file}`, import.meta.url).href, width, height, displayWidth, alt })
const p = text => ({ type: 'p', text })
const list = items => ({ type: 'list', items })
const eq = (text, condition = '') => ({ type: 'equation', text, condition })
const table = (head, rows) => ({ type: 'table', head, rows })
const options = texts => ['A', 'B', 'C', 'D'].map((id, index) => ({ id, text: texts[index] }))
const solution = text => ({ text, official: false })
const meta = (...chapters) => ({ status: 'internal', chapters })

const E0_TABLE = table(
  ['Cặp oxi hóa – khử', 'Fe²⁺/Fe', 'Cu²⁺/Cu', 'Zn²⁺/Zn', 'Ag⁺/Ag', 'Pb²⁺/Pb'],
  [['Thế điện cực chuẩn (V)', '–0,44', '+0,34', '–0,76', '+0,80', '–0,13']]
)
const E0_LEAD = [
  p('**Sử dụng thông tin ở bảng dưới đây để trả lời các câu 17 – 18:**'),
  p('Cho bảng giá trị thế điện cực chuẩn của các cặp oxi hóa – khử như sau:'),
  E0_TABLE
]

export default {
  id: 'tham-khao-2025-hoa',
  title: 'Đề thi tham khảo tốt nghiệp THPT từ năm 2025 — Hóa học',
  kind: 'official-reference',
  blueprint: 'thpt-2025-hoa',
  license: 'owner-attested',
  dataVersion: 1,
  timeLimitMinutes: 50,
  source: {
    authority: 'Bộ GD&ĐT — Cục Quản lý chất lượng',
    url: 'https://vqa.moet.gov.vn/vi/news/tin-tuc-su-kien/de-thi-tham-khao-ky-thi-tot-nghiep-thpt-tu-nam-2025-159.html',
    documentUrl: 'https://drive.google.com/file/d/1VVZQh1X5W55cqg9AY43iqR5kP0exvkYu/view',
    originalTitle: 'Đề tham khảo — Kỳ thi tốt nghiệp THPT từ năm 2025 — Môn: Hóa học (04_HoaHoc.pdf)',
    publishedAt: '2024-10-18'
  },
  answerKey: 'official',
  preamble: 'Cho biết nguyên tử khối: H = 1, C = 12, N = 14, O = 16, Al = 27, S = 32, K = 39; Fe = 56.',
  sections: [
    {
      part: 'I',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 18. Mỗi câu hỏi thí sinh chỉ chọn một phương án.',
      questions: [
        {
          id: 'tk25-1',
          content: [p('“Ăn mòn hóa học là quá trình …(1)…, trong đó các electron của …(2)… chuyển trực tiếp đến các chất trong môi trường”. Nội dung phù hợp trong các ô trống (1), (2) lần lượt là')],
          options: options(['oxi hóa – khử, kim loại.', 'khử, kim loại.', 'oxi hoá, ion kim loại.', 'oxi hóa – khử, ion kim loại.']),
          answer: 'A',
          solution: solution('Ăn mòn hóa học là quá trình oxi hóa – khử; electron của kim loại chuyển trực tiếp đến các chất oxi hóa trong môi trường (không phát sinh dòng điện).'),
          meta: meta('g12-c6')
        },
        {
          id: 'tk25-2',
          content: [p('Thành phần chính của baking soda là NaHCO₃. Tên của hợp chất này là')],
          options: options(['sodium hydrogencarbonate.', 'sodium carbonate.', 'sodium hydrogensulfide.', 'potassium hydrogencarbonate.']),
          answer: 'A',
          solution: solution('NaHCO₃: cation Na⁺ (sodium) và anion HCO₃⁻ (hydrogencarbonate). Sodium carbonate là Na₂CO₃.'),
          meta: meta('g12-c7')
        },
        {
          id: 'tk25-3',
          content: [p('Polychloroprene có công thức là')],
          options: options(['(−CH₂−CH₂−)ₙ', '(−CH₂−CH=CH−CH₂−)ₙ', '(−CH₂−CHCl−)ₙ', '(−CH₂−CCl=CH−CH₂−)ₙ']),
          answer: 'D',
          solution: solution('Chloroprene là CH₂=CCl−CH=CH₂; trùng hợp (cộng 1,4) tạo mắt xích −CH₂−CCl=CH−CH₂−. Các phương án A, B, C lần lượt là polyethylene, polybutadiene, poly(vinyl chloride).'),
          meta: meta('g12-c4')
        },
        {
          id: 'tk25-4',
          content: [p('Liên kết kim loại là liên kết được hình thành giữa')],
          options: options([
            'các cation kim loại và các electron hóa trị tự do trong tinh thể kim loại.',
            'các cation và các anion trong tinh thể kim loại.',
            'các electron hoá trị trong tinh thể kim loại.',
            'các nguyên tử trong tinh thể kim loại.'
          ]),
          answer: 'A',
          solution: solution('Liên kết kim loại hình thành do lực hút tĩnh điện giữa các cation kim loại ở nút mạng và các electron hóa trị tự do chuyển động trong toàn mạng tinh thể.'),
          meta: meta('g12-c6')
        },
        {
          id: 'tk25-5',
          content: [p('Nguyên tố natri (sodium, Na) có số hiệu nguyên tử là 11. Ở trạng thái cơ bản, cấu hình electron của ion Na⁺ là')],
          options: options(['1s²2s²2p⁶3s¹.', '1s²2s²2p⁶.', '1s²2s²2p⁵.', '1s²2s²2p⁶3s².']),
          answer: 'B',
          solution: solution('Na: 1s²2s²2p⁶3s¹. Ion Na⁺ mất 1 electron lớp ngoài cùng (3s) nên có cấu hình 1s²2s²2p⁶.'),
          meta: meta('g10-c1')
        },
        {
          id: 'tk25-6',
          content: [p('Hóa chất nào sau đây **không** sử dụng để làm mềm nước cứng tạm thời?')],
          options: options(['Na₂CO₃.', 'Na₃PO₄.', 'Ca(OH)₂.', 'HCl.']),
          answer: 'D',
          solution: solution('Na₂CO₃, Na₃PO₄ kết tủa Ca²⁺, Mg²⁺; Ca(OH)₂ vừa đủ chuyển HCO₃⁻ thành CO₃²⁻ kết tủa CaCO₃. HCl không loại được Ca²⁺, Mg²⁺ nên không làm mềm nước.'),
          meta: meta('g12-c7')
        },
        {
          id: 'tk25-7',
          content: [
            p('Nhiệt độ tự bốc cháy là nhiệt độ thấp nhất ở áp suất khí quyển mà chất cháy tự cháy trong không khí dù không cần tiếp xúc với nguồn lửa. Khi nhà kho chứa các đồ vật làm bằng nhựa poly(vinyl chloride) (PVC) bị cháy sẽ tạo nên khói đám cháy có nhiệt độ rất cao và chứa các khí như HCl, CO,…. Trong khi di chuyển ra xa đám cháy, cần cúi thấp người, đồng thời dùng khăn ướt che mũi và miệng. Cho các phát biểu sau:'),
            list([
              '(a) Khăn ướt không có tác dụng hạn chế khí HCl đi vào cơ thể.',
              '(b) Việc cúi thấp người nhằm tránh khói đám cháy (có xu hướng bốc lên cao).',
              '(c) Khói từ đám cháy nhựa PVC độc hại hơn khói từ đám cháy các đồ vật làm bằng gỗ.',
              '(d) Việc sử dụng nước để chữa cháy nhằm mục đích hạ nhiệt độ đám cháy thấp hơn nhiệt độ tự bốc cháy của PVC.'
            ]),
            p('Các phát biểu đúng là')
          ],
          options: options(['(a), (b), (c).', '(a), (b), (d).', '(b), (c), (d).', '(a), (c), (d).']),
          answer: 'C',
          solution: solution('(a) sai: HCl tan rất tốt trong nước nên khăn ướt giữ lại được một phần HCl. (b) đúng: khói nóng bốc lên cao. (c) đúng: khói PVC chứa thêm HCl. (d) đúng: nước hạ nhiệt độ xuống dưới nhiệt độ tự bốc cháy.'),
          meta: meta('g12-c4')
        },
        {
          id: 'tk25-8',
          content: [p('Trong quá trình trồng trọt, người nông dân được khuyến cáo không bón vôi sống (thành phần chính là CaO) cùng với phân đạm ammonium. Nguyên nhân của khuyến cáo này là')],
          options: options(['thất thoát đạm vì giải phóng ammonia.', 'tạo thành hỗn hợp gây cháy nổ.', 'tạo acid làm ảnh hưởng tới cây trồng.', 'làm tăng độ chua của đất.']),
          answer: 'A',
          solution: solution('CaO + H₂O → Ca(OH)₂; OH⁻ + NH₄⁺ → NH₃ + H₂O: khí NH₃ bay ra làm mất đạm.'),
          meta: meta('g11-c2')
        },
        {
          id: 'tk25-9',
          content: [p('Phổ khối lượng (MS) là phương pháp hiện đại để xác định phân tử khối của các hợp chất hữu cơ. Kết quả phân tích phổ khối lượng cho thấy phân tử khối của hợp chất hữu cơ X là 74. Chất X có thể là')],
          options: options(['acetic acid.', 'methyl acetate.', 'acetone.', 'trimethylamine.']),
          answer: 'B',
          solution: solution('M: CH₃COOH = 60; CH₃COOCH₃ (C₃H₆O₂) = 74; CH₃COCH₃ = 58; (CH₃)₃N = 59. Chỉ methyl acetate có M = 74.'),
          meta: meta('g11-c3')
        },
        {
          id: 'tk25-10',
          content: [p('Phản ứng thủy phân ester trong môi trường kiềm còn được gọi là phản ứng')],
          options: options(['ester hóa.', 'xà phòng hóa.', 'trung hòa.', 'trùng ngưng.']),
          answer: 'B',
          solution: solution('Thủy phân ester trong môi trường kiềm (một chiều) gọi là phản ứng xà phòng hóa.'),
          meta: meta('g12-c1')
        },
        {
          id: 'tk25-11',
          content: [p('Công thức cấu tạo thu gọn của dimethylamine là')],
          options: options(['CH₃–NH₂.', 'CH₃–NH–CH₃.', 'CH₃–NH–CH₂–CH₃.', 'CH₃–CH₂–NH₂.']),
          answer: 'B',
          solution: solution('Dimethylamine: hai gốc methyl gắn với N (amine bậc II): CH₃–NH–CH₃.'),
          meta: meta('g12-c3')
        },
        {
          id: 'tk25-12',
          content: [p('Chất nào sau đây thuộc loại monosaccharide?')],
          options: options(['Glucose.', 'Saccharose.', 'Maltose.', 'Cellulose.']),
          answer: 'A',
          solution: solution('Glucose là monosaccharide; saccharose, maltose là disaccharide; cellulose là polysaccharide.'),
          meta: meta('g12-c2')
        },
        {
          id: 'tk25-13',
          content: [
            p('Phương trình hoá học của phản ứng hydrate hóa ethylene để điều chế ethanol là'),
            eq('CH₂=CH₂ + H₂O → CH₃CH₂OH', 'H₂SO₄, t°'),
            p('Giai đoạn (1) trong cơ chế của phản ứng trên xảy ra như sau:'),
            figure('c13-co-che.png', 750, 112, 520, 'Giai đoạn (1): phân tử ethylene (H₂C=CH₂) kết hợp với ion H⁺ tạo carbocation H₃C–C⁺H₂.'),
            p('Nhận định nào sau đây **không** đúng?')
          ],
          options: options([
            'Phản ứng hydrate hóa ethylene là phản ứng cộng.',
            'Trong giai đoạn (1) có sự phân cắt liên kết π.',
            'Trong giai đoạn (1) có sự hình thành liên kết σ.',
            'Trong phân tử ethylene có 6 liên kết σ.'
          ]),
          answer: 'D',
          solution: solution('Ethylene có 4 liên kết σ C–H và 1 liên kết đôi C=C (gồm 1 σ và 1 π) nên chỉ có 5 liên kết σ: D sai. Ở giai đoạn (1), liên kết π bị phân cắt và hình thành liên kết σ C–H mới; toàn bộ phản ứng là phản ứng cộng.'),
          meta: meta('g11-c4')
        },
        {
          id: 'tk25-14',
          content: [p('Tên gọi của ester C₂H₅COOCH₃ là')],
          options: options(['ethyl acetate.', 'methyl propionate.', 'ethyl propionate.', 'methyl acetate.']),
          answer: 'B',
          solution: solution('Gốc acid C₂H₅COO– là propionate, gốc alcohol –CH₃ là methyl: methyl propionate.'),
          meta: meta('g12-c1')
        },
        {
          id: 'tk25-15',
          content: [p('“Amino acid là hợp chất hữu cơ tạp chức, trong phân tử chứa đồng thời nhóm chức ... (1) ... và nhóm chức ... (2) ...”. Nội dung phù hợp trong ô trống (1), (2) lần lượt là')],
          options: options(['carboxyl (–COOH), amino (–NH₂).', 'carboxyl (–COOH), hydroxy (–OH).', 'hydroxy (–OH), amino (–NH₂).', 'carbonyl (–CO–), carboxyl (–COOH).']),
          answer: 'A',
          solution: solution('Amino acid chứa đồng thời nhóm carboxyl (–COOH) và nhóm amino (–NH₂).'),
          meta: meta('g12-c3')
        },
        {
          id: 'tk25-16',
          content: [
            p('Histidine là một trong những amino acid thiết yếu đối với cơ thể con người. Với mỗi môi trường có giá trị pH bằng 4,0; 7,6; 12,0, coi histidine chỉ tồn tại ở dạng cho dưới đây:'),
            figure('c16-histidine.png', 1363, 240, 820, 'Bảng dạng tồn tại của histidine: pH 4,0 — dạng (I), vòng imidazole bị proton hóa (N⁺–H), có nhóm –NH₃⁺ và –COO⁻; pH 7,6 — dạng (II), vòng imidazole trung hòa, có –NH₃⁺ và –COO⁻; pH 12,0 — dạng (III), vòng trung hòa, có –NH₂ và –COO⁻.'),
            p('Trong quá trình điện di, ion sẽ di chuyển về phía điện cực trái dấu với ion.'),
            p('Cho các nhận định sau về quá trình điện di của histidine:'),
            list([
              '(a) Với môi trường pH = 7,6 thì dạng (II) hầu như không dịch chuyển về các điện cực.',
              '(b) Với môi trường pH = 4,0 thì dạng (I) di chuyển về phía cực âm.',
              '(c) Với môi trường pH = 12,0 thì dạng (III) di chuyển về phía cực dương.',
              '(d) Với môi trường pH = 7,6 thì dạng (II) di chuyển về phía cực âm.'
            ]),
            p('Các nhận định đúng là')
          ],
          options: options(['(a), (b), (d).', '(a), (c), (d).', '(b), (c), (d).', '(a), (b), (c).']),
          answer: 'D',
          solution: solution('Dạng (I) mang điện tích +1 (hai nhóm mang điện dương, một nhóm âm) nên về cực âm: (b) đúng. Dạng (II) là ion lưỡng cực, tổng điện tích 0, hầu như không dịch chuyển: (a) đúng, (d) sai. Dạng (III) mang điện tích −1 nên về cực dương: (c) đúng.'),
          meta: meta('g12-c3')
        },
        {
          id: 'tk25-17',
          content: [
            ...E0_LEAD,
            p('Trong số các ion kim loại gồm Fe²⁺, Cu²⁺ và Zn²⁺, ở điều kiện chuẩn ion nào có tính oxi hóa yếu hơn Ag⁺, nhưng mạnh hơn Pb²⁺?')
          ],
          options: options(['Fe²⁺, Cu²⁺, Zn²⁺.', 'Fe²⁺, Cu²⁺.', 'Zn²⁺.', 'Cu²⁺.']),
          answer: 'D',
          solution: solution('Ion có tính oxi hóa yếu hơn Ag⁺ nhưng mạnh hơn Pb²⁺ phải có −0,13 V < E° < +0,80 V. Chỉ Cu²⁺/Cu (+0,34 V) thỏa mãn; Fe²⁺ (−0,44 V) và Zn²⁺ (−0,76 V) yếu hơn Pb²⁺.'),
          meta: meta('g12-c5')
        },
        {
          id: 'tk25-18',
          content: [
            ...E0_LEAD,
            p('Sức điện động chuẩn lớn nhất của pin Galvani thiết lập từ hai cặp oxi hóa – khử trong số các cặp trên là')
          ],
          options: options(['1,24 V.', '1,56 V.', '1,60 V.', '0,93 V.']),
          answer: 'B',
          solution: solution('E°pin lớn nhất khi ghép cặp có E° lớn nhất (Ag⁺/Ag, +0,80 V) làm cathode với cặp có E° nhỏ nhất (Zn²⁺/Zn, −0,76 V) làm anode: E° = 0,80 − (−0,76) = 1,56 V.'),
          meta: meta('g12-c5')
        }
      ]
    },
    {
      part: 'II',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 4. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.',
      questions: [
        {
          id: 'tk25-ii1',
          content: [
            p('Một nhóm học sinh tìm hiểu quá trình thu hồi kim loại đồng (copper) bằng phương pháp điện phân từ một đồng xu làm bằng hợp kim Cu – Zn chứa khoảng 95% đồng về khối lượng. Giả thuyết của nhóm học sinh là “khi điện phân, chỉ có tạp chất trong đồng xu tan hết vào trong dung dịch, còn lại sẽ là đồng tinh khiết”. Để kiểm tra giả thuyết này, nhóm học sinh đã thực hiện thí nghiệm như sau:'),
            list([
              'Cân để xác định khối lượng ban đầu của đồng xu (2,23 gam) và thanh đồng tinh khiết (2,55 gam).',
              'Nối đồng xu với một điện cực và thanh đồng tinh khiết với điện cực còn lại của nguồn điện một chiều, rồi nhúng vào bình điện phân chứa dung dịch copper(II) sulfate.',
              'Điện phân ở hiệu điện thế phù hợp.',
              'Sau một thời gian điện phân, làm khô, rồi cân để xác định lại khối lượng của đồng xu và thanh đồng tinh khiết, thấy khối lượng đồng xu là 1,94 gam và khối lượng thanh đồng là m₁ gam.'
            ])
          ],
          statements: [
            { id: 'a', text: 'Trong thí nghiệm trên, đồng xu được nối với cực dương, thanh đồng tinh khiết được nối với cực âm của nguồn điện.' },
            { id: 'b', text: 'Giá trị của m₁ lớn hơn 2,55.' },
            { id: 'c', text: 'Ở cực dương xảy ra quá trình khử.' },
            { id: 'd', text: 'Do khối lượng của đồng xu giảm, nên giả thuyết ban đầu của nhóm học sinh là đúng.' }
          ],
          answer: { a: true, b: true, c: false, d: false },
          solution: solution('a) Đúng: để đồng xu tan ra, đồng xu là anode (cực dương); thanh đồng tinh khiết là cathode (cực âm). b) Đúng: Cu²⁺ bị khử bám lên cathode nên m₁ > 2,55. c) Sai: ở cực dương (anode) xảy ra quá trình oxi hóa. d) Sai: đồng xu giảm 2,23 − 1,94 = 0,29 g, lớn hơn khối lượng tạp chất (khoảng 5% × 2,23 ≈ 0,11 g), chứng tỏ cả đồng trong đồng xu cũng tan; khối lượng giảm không chứng minh giả thuyết.'),
          meta: meta('g12-c5')
        },
        {
          id: 'tk25-ii2',
          content: [
            p('Enzyme amylase là một protein có khả năng xúc tác cho phản ứng thủy phân tinh bột. Hoạt tính xúc tác của enzyme càng cao thì phản ứng thủy phân tinh bột diễn ra càng nhanh. Hoạt tính xúc tác của enzyme phụ thuộc vào các yếu tố như nhiệt độ, pH,… Một nhóm học sinh dự đoán “pH càng tăng thì hoạt tính xúc tác của enzyme amylase càng cao”. Từ đó, học sinh tiến hành thí nghiệm ở nhiệt độ không đổi nhưng thay đổi pH của môi trường để kiểm tra dự đoán trên như sau:'),
            p('Bước 1: Thêm 2,0 mL dung dịch một loại enzyme amylase vào một ống nghiệm chứa 5,0 mL dung dịch có vai trò duy trì ổn định pH bằng 5.'),
            p('Bước 2: Thêm tiếp 2,0 mL dung dịch tinh bột vào ống nghiệm trên, lắc đều.'),
            p('Bước 3: Sau khoảng mỗi 10 giây, dùng ống hút lấy 1-2 giọt hỗn hợp phản ứng trong ống nghiệm và cho vào đĩa sứ chứa sẵn dung dịch iodine, quan sát để từ đó xác định thời gian tinh bột thủy phân hết.'),
            p('Lặp lại thí nghiệm theo ba bước trên, chỉ thay đổi pH dung dịch trong Bước 1 lần lượt là 6; 7; 8; 9.'),
            p('Nhóm học sinh ghi lại kết quả thời gian t (giây) mà tinh bột thủy phân hết trong môi trường pH = 5; 6; 7; 8; 9 và vẽ đồ thị như hình bên.'),
            figure('ii2-do-thi.png', 375, 311, 320, 'Đồ thị thời gian t (giây) để tinh bột thủy phân hết theo pH: pH 5 – 140 giây; pH 6 – 80 giây; pH 7 – 60 giây; pH 8 – 100 giây; pH 9 – 180 giây.')
          ],
          statements: [
            { id: 'a', text: 'Ở Bước 3, nếu dung dịch iodine chuyển sang màu xanh tím nghĩa là tinh bột thủy phân hết.' },
            { id: 'b', text: 'Theo số liệu thu được, phản ứng thủy phân tinh bột ở pH = 9 diễn ra nhanh hơn ở pH = 8.' },
            { id: 'c', text: 'Ở các giá trị pH nghiên cứu, hoạt tính xúc tác của enzyme amylase cao nhất tại pH = 7.' },
            { id: 'd', text: 'Từ kết quả thí nghiệm, kết luận được hoạt tính xúc tác của enzyme amylase tăng khi pH tăng.' }
          ],
          answer: { a: false, b: false, c: true, d: false },
          solution: solution('a) Sai: màu xanh tím chứng tỏ vẫn còn tinh bột. b) Sai: ở pH 9 cần 180 giây, ở pH 8 cần 100 giây nên pH 9 chậm hơn. c) Đúng: thời gian ngắn nhất (60 giây) tại pH 7. d) Sai: từ pH 7 trở lên, thời gian tăng (hoạt tính giảm) khi pH tăng.'),
          meta: meta('g12-c2', 'g12-c3')
        },
        {
          id: 'tk25-ii3',
          content: [
            p('Một học sinh tiến hành tổng hợp isoamyl acetate (thành phần chính của dầu chuối) từ acetic acid và isoamyl alcohol theo phương trình hóa học sau:'),
            figure('ii3-phuong-trinh.png', 975, 123, 680, 'Phương trình: acetic acid CH₃COOH + isoamyl alcohol (CH₃)₂CHCH₂CH₂OH ⇌ isoamyl acetate CH₃COOCH₂CH₂CH(CH₃)₂ + H₂O, điều kiện H₂SO₄ đặc, t°.'),
            p('Sau thí nghiệm, tiến hành phân tách sản phẩm. Ghi phổ hồng ngoại của acetic acid, isoamyl alcohol và isoamyl acetate. Cho biết số sóng hấp thụ đặc trưng của một số liên kết trên phổ hồng ngoại như sau:'),
            table(['Liên kết', 'O–H (alcohol)', 'O–H (carboxylic acid)', 'C=O (ester, carboxylic acid)'], [['Số sóng (cm⁻¹)', '3650 – 3200', '3300 – 2500', '1780 – 1650']])
          ],
          statements: [
            { id: 'a', text: 'Phản ứng tổng hợp trong thí nghiệm này là phản ứng thủy phân ester.' },
            { id: 'b', text: 'Phổ hồng ngoại có số sóng hấp thụ ở 3350 cm⁻¹ là phổ của isoamyl alcohol.' },
            { id: 'c', text: 'Phổ hồng ngoại có số sóng hấp thụ ở 1750 cm⁻¹ mà không có số sóng hấp thụ đặc trưng của liên kết O–H là phổ của isoamyl acetate.' },
            { id: 'd', text: 'Dựa vào phổ hồng ngoại, phân biệt được acetic acid, isoamyl alcohol và isoamyl acetate.' }
          ],
          answer: { a: false, b: true, c: true, d: true },
          solution: solution('a) Sai: đây là phản ứng ester hóa. b) Đúng: 3350 cm⁻¹ nằm trong vùng O–H alcohol (3650 – 3200) và ngoài vùng O–H acid (3300 – 2500). c) Đúng: có C=O nhưng không có O–H là ester. d) Đúng: alcohol chỉ có O–H alcohol, acid có O–H acid và C=O, ester chỉ có C=O.'),
          meta: meta('g12-c1', 'g11-c3')
        },
        {
          id: 'tk25-ii4',
          content: [p('Muối CoCl₂ khan có màu xanh. Hòa tan một lượng muối này vào nước, thu được dung dịch màu hồng (có chứa phức chất X). Nhúng mảnh giấy lọc vào dung dịch này, sấy khô, thu được mảnh giấy có màu xanh (giấy Y). Giấy Y được sử dụng làm giấy chỉ thị để phát hiện nước.')],
          statements: [
            { id: 'a', text: 'CoCl₂ là hợp chất của kim loại chuyển tiếp.' },
            { id: 'b', text: 'Phức chất X không chứa phối tử aqua (phối tử H₂O).' },
            { id: 'c', text: 'Trong phức chất X, liên kết giữa nguyên tử trung tâm và phối tử là liên kết ion.' },
            { id: 'd', text: 'Khi nhỏ giọt nước lên giấy Y, giấy Y chuyển màu.' }
          ],
          answer: { a: true, b: false, c: false, d: true },
          solution: solution('a) Đúng: Co là kim loại chuyển tiếp dãy thứ nhất. b) Sai: màu hồng là của phức chất aqua [Co(OH₂)₆]²⁺. c) Sai: liên kết giữa nguyên tử trung tâm và phối tử là liên kết cho – nhận. d) Đúng: giấy Y gặp nước tạo lại phức aqua nên chuyển từ xanh sang hồng.'),
          meta: meta('g12-c8')
        }
      ]
    },
    {
      part: 'III',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 6.',
      questions: [
        {
          id: 'tk25-iii1',
          content: [p('Trong công nghiệp, kim loại nhôm (aluminium, Al) được sản xuất bằng phương pháp điện phân nóng chảy aluminium oxide. Biết hiệu suất của quá trình chuyển hóa Al₂O₃ thành Al là 95,4%. Để sản xuất 5,4 tấn Al cần sử dụng bao nhiêu tấn nguyên liệu Al₂O₃ (làm tròn đến hàng phần mười)?')],
          answer: '10,7',
          solution: solution('2Al₂O₃ → 4Al + 3O₂: 204 tấn Al₂O₃ tạo 108 tấn Al ⇒ Al₂O₃ lí thuyết = 5,4 × 204/108 = 10,2 tấn. Với hiệu suất 95,4%: 10,2 / 0,954 ≈ 10,69 ≈ 10,7 tấn.'),
          meta: meta('g12-c6')
        },
        {
          id: 'tk25-iii2',
          content: [p('Đun nóng một loại mỡ động vật với dung dịch KOH, sản phẩm thu được có chứa muối potassium stearate (C₁₇H₃₅COOK). Phân tử khối của potassium stearate là bao nhiêu?')],
          answer: '322',
          solution: solution('C₁₇H₃₅COOK = C₁₈H₃₅O₂K: 18 × 12 + 35 × 1 + 2 × 16 + 39 = 216 + 35 + 32 + 39 = 322.'),
          meta: meta('g12-c1')
        },
        {
          id: 'tk25-iii3',
          content: [
            p('Cho phương trình hóa học của các phản ứng được đánh số thứ tự từ 1 tới 4 dưới đây:'),
            eq('(1) (C₆H₁₀O₅)ₙ (tinh bột) + nH₂O → nC₆H₁₂O₆ (glucose)', 'H⁺, t°'),
            eq('(2) C₆H₁₂O₆ (glucose) → 2C₂H₅OH + 2CO₂', 'enzyme'),
            eq('(3) C₆H₁₂O₆ (glucose) → 2CH₃CH(OH)COOH', 'enzyme'),
            eq('(4) C₆H₁₂O₆ (glucose) + 2[Ag(NH₃)₂]OH → CH₂OH(CHOH)₄COONH₄ + 2Ag + 3NH₃ + H₂O', 't°'),
            p('Gán số thứ tự của phương trình hoá học của các phản ứng theo tên gọi: lên men rượu, thủy phân, lên men lactic, tráng gương và sắp xếp theo trình tự thành dãy bốn số (ví dụ: 1234, 4321, ...).')
          ],
          answer: '2134',
          solution: solution('Lên men rượu: (2); thủy phân: (1); lên men lactic (tạo lactic acid CH₃CH(OH)COOH): (3); tráng gương: (4) ⇒ 2134.'),
          meta: meta('g12-c2')
        },
        {
          id: 'tk25-iii4',
          content: [p('Có tổng số bao nhiêu đồng phân cấu tạo amine bậc 1 và bậc 2 ứng với công thức phân tử C₄H₁₁N?')],
          answer: '7',
          solution: solution('Bậc 1 (4): CH₃CH₂CH₂CH₂NH₂, CH₃CH₂CH(NH₂)CH₃, (CH₃)₂CHCH₂NH₂, (CH₃)₃CNH₂. Bậc 2 (3): CH₃NHCH₂CH₂CH₃, CH₃NHCH(CH₃)₂, CH₃CH₂NHCH₂CH₃. Tổng 7.'),
          meta: meta('g12-c3')
        },
        {
          id: 'tk25-iii5',
          content: [
            p('Trong một nhà máy sản xuất ammonia theo quy trình Haber, giai đoạn sản xuất khí hydrogen bằng phản ứng của methane và nước được thực hiện theo phương trình hóa học (1) như sau:'),
            eq('(1) CH₄(g) + H₂O(g) → CO(g) + 3H₂(g)', 'xt'),
            p('Phản ứng (1) là phản ứng thu nhiệt mạnh. Lượng nhiệt này được cung cấp từ quá trình đốt cháy hoàn toàn khí methane theo phương trình hóa học (2):'),
            eq('(2) CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g)'),
            p('Xét các phản ứng ở điều kiện chuẩn và hiệu suất chuyển hóa của methane là 100%. Tính khối lượng khí methane (theo tấn, làm tròn đến hàng phần trăm) cần thiết để sản xuất 0,30 tấn H₂(g) trong giai đoạn trên. Biết 90% lượng nhiệt tỏa ra từ phản ứng (2) được cung cấp cho phản ứng (1) và các giá trị nhiệt tạo thành (Δ_{f}H°_{298}) của các chất ở điều kiện chuẩn được cho trong bảng sau:'),
            table(['Chất', 'CH₄(g)', 'CO₂(g)', 'CO(g)', 'H₂O(g)'], [['Δ_{f}H°_{298} (kJ mol⁻¹)', '–74,6', '–393,5', '–110,5', '–241,8']])
          ],
          answer: '1,03',
          solution: solution('Δ_{r}H°_{298}(1) = −110,5 − (−74,6 − 241,8) = +205,9 kJ; Δ_{r}H°_{298}(2) = −393,5 + 2 × (−241,8) − (−74,6) = −802,5 kJ. 0,30 tấn H₂ = 1,5 × 10⁵ mol ⇒ CH₄ cho (1): 5 × 10⁴ mol, cần 5 × 10⁴ × 205,9 = 1,0295 × 10⁷ kJ. CH₄ đốt cho (2): 1,0295 × 10⁷ / (0,9 × 802,5) ≈ 1,4254 × 10⁴ mol. Tổng CH₄ ≈ 6,4254 × 10⁴ mol × 16 g ≈ 1,028 × 10⁶ g ≈ 1,03 tấn.'),
          meta: meta('g10-c5')
        },
        {
          id: 'tk25-iii6',
          content: [p('Khi bảo quản trong phòng thí nghiệm, muối Mohr (FeSO₄·(NH₄)₂SO₄·6H₂O) hút ẩm và bị oxi hóa một phần bởi O₂ trong không khí thành hỗn hợp X. Để xác định phần trăm khối lượng muối Mohr trong X, tiến hành hòa tan hoàn toàn 2,656 gam X trong nước rồi pha thành 100,0 mL dung dịch Y. Chuẩn độ 10,00 mL dung dịch Y (trong môi trường sulfuric acid loãng, dư) bằng dung dịch KMnO₄ nồng độ 0,012 M đến khi xuất hiện màu hồng nhạt thì dừng. Lặp lại thí nghiệm chuẩn độ thêm 2 lần nữa. Thể tích trung bình của dung dịch KMnO₄ sau 3 lần chuẩn độ là 9,72 mL. Phần trăm khối lượng của muối Mohr trong X là a %. Tính giá trị của a (làm tròn đến hàng phần mười).')],
          answer: '86,1',
          solution: solution('5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O. n(MnO₄⁻) = 9,72 × 10⁻³ × 0,012 = 1,1664 × 10⁻⁴ mol ⇒ n(Fe²⁺) trong 10 mL = 5,832 × 10⁻⁴ mol ⇒ trong 100 mL: 5,832 × 10⁻³ mol. M(muối Mohr) = 392 ⇒ m = 2,2861 g ⇒ a = 2,2861 / 2,656 × 100 ≈ 86,1.'),
          meta: meta('g12-c8')
        }
      ]
    }
  ]
}
