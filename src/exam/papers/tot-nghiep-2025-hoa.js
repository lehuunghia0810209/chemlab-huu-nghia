// Đề thi tốt nghiệp THPT năm 2025 — Hóa học (Bộ GD&ĐT, đề thi chính thức), mã đề 0338.
// The Ministry publishes answer keys only, not question papers. The question
// text comes from an owner-supplied Word file of mã đề 0338 (a retyped copy that
// embeds a photo of printed page 3); every key item matches the Ministry's
// official key for mã 0338 (Cục QLCL answer folder, 03.Hoahoc_2018.pdf).
// Part II items 1–3 follow the photographed printed page where the Word text
// differs. Two typing errors of the Word file are corrected and documented in
// docs/exam/papers/tot-nghiep-2025-hoa.md. Figures are taken from that file;
// solutions are written by ChemLab.

const figure = (file, width, height, displayWidth, alt) => ({ type: 'figure', src: new URL(`./assets/tot-nghiep-2025-hoa/${file}`, import.meta.url).href, width, height, displayWidth, alt })
const p = text => ({ type: 'p', text })
const list = items => ({ type: 'list', items })
const table = (head, rows) => ({ type: 'table', head, rows })
const eq = (text, condition = '') => ({ type: 'equation', text, condition })
const options = texts => ['A', 'B', 'C', 'D'].map((id, index) => ({ id, text: texts[index] }))
const solution = text => ({ text, official: false })
const meta = (...chapters) => ({ status: 'internal', chapters })

const STEEL_INTRO = 'Các công trình bằng thép (hợp kim của Fe và C) dễ bị ăn mòn điện hóa khi tiếp xúc với nước biển. Một trong số các phương pháp bảo vệ các công trình bằng thép khỏi sự ăn mòn điện hóa là gắn các khối nhôm (aluminium, Al), kẽm (zinc, Zn) hoặc hợp kim của chúng vào phần chìm dưới nước biển của công trình đó.'

export default {
  id: 'tot-nghiep-2025-hoa',
  title: 'Đề thi tốt nghiệp THPT năm 2025 — Hóa học (mã đề 0338)',
  kind: 'official-exam',
  blueprint: 'thpt-2025-hoa',
  license: 'owner-attested',
  dataVersion: 1,
  timeLimitMinutes: 50,
  variant: '0338',
  source: {
    authority: 'Bộ GD&ĐT — Kỳ thi tốt nghiệp THPT năm 2025',
    url: 'https://vqa.moet.gov.vn/vi/news/tin-tuc-su-kien/cong-bo-dap-an-cac-mon-thi-cua-ky-thi-tot-nghiep-thpt-2025-208.html',
    file: { name: '6-0338_ĐỀ CHÍNH THỨC MÔN HOÁ HỌC-2025.docx', sha256: '714281ad1289e637a5089d0e935923fce9495cd1a250116f6bce9830871311fb' },
    originalTitle: 'Kỳ thi tốt nghiệp trung học phổ thông năm 2025 — Đề thi chính thức — Môn thi: Hoá học — Mã đề 0338',
    publishedAt: '2025-06'
  },
  answerKey: 'official',
  editorialNote: 'Đề được số hóa từ bản đánh máy lại mã đề 0338 do chủ dự án cung cấp (Bộ GD&ĐT chỉ công bố đáp án, không công bố văn bản đề). ChemLab sửa hai lỗi đánh máy của bản này: đơn vị khối lượng riêng ở Phần II câu 4 (g mL⁻¹) và công thức butane trong bảng ở Phần III câu 4. Chưa đối chiếu được với bản in gốc.',
  preamble: 'Cho biết nguyên tử khối: H = 1; C = 12; O = 16; Al = 27; S = 32; K = 39; Mn = 55; Fe = 56. Các kí hiệu và chữ viết tắt: s: rắn; l: lỏng; g: khí; aq: dung dịch nước.',
  sections: [
    {
      part: 'I',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 18. Mỗi câu hỏi thí sinh chỉ chọn một phương án.',
      questions: [
        {
          id: 'tn25-1',
          content: [p('Ở điều kiện thường, kim loại nào sau đây tồn tại ở thể lỏng?')],
          options: options(['Ag.', 'Hg.', 'Al.', 'Cu.']),
          answer: 'B',
          solution: solution('Thủy ngân (Hg) là kim loại duy nhất ở thể lỏng trong điều kiện thường.'),
          meta: meta('g12-c6')
        },
        {
          id: 'tn25-2',
          content: [
            p('Trong phức chất, số liên kết σ (sigma) tạo thành giữa một phối tử với nguyên tử trung tâm được gọi là dung lượng phối trí của phối tử đó. Cấu tạo của phức chất [Cu(OH₂)₆]²⁺ hay [Cu(H₂O)₆]²⁺ được cho ở hình bên. Dung lượng phối trí của mỗi phối tử H₂O trong phức chất đã cho là'),
            figure('c2-phuc-chat.png', 181, 153, 170, 'Cấu tạo phức chất [Cu(OH₂)₆]²⁺: nguyên tử Cu ở tâm liên kết với sáu phân tử H₂O (hai ở trên và dưới, bốn ở mặt phẳng giữa), toàn bộ đặt trong ngoặc vuông với điện tích 2+.')
          ],
          options: options(['2.', '6.', '3.', '1.']),
          answer: 'D',
          solution: solution('Mỗi phân tử H₂O liên kết với Cu²⁺ qua một cặp electron của nguyên tử O, tạo một liên kết σ ⇒ dung lượng phối trí bằng 1.'),
          meta: meta('g12-c8')
        },
        {
          id: 'tn25-3',
          content: [p('Trong phòng thí nghiệm, dung dịch chất nào sau đây phù hợp để kiểm tra sự có mặt của ion Ca²⁺(aq)?')],
          options: options(['HCl.', 'NaNO₃.', 'NaCl.', 'Na₂CO₃.']),
          answer: 'D',
          solution: solution('Ca²⁺ + CO₃²⁻ → CaCO₃↓ (kết tủa trắng). Các dung dịch còn lại không tạo kết tủa với Ca²⁺.'),
          meta: meta('g12-c7')
        },
        {
          id: 'tn25-4',
          content: [
            p('Phản ứng điều chế ethanol từ ethene theo phương trình hóa học'),
            eq('C₂H₄ + H₂O → C₂H₅OH', 'H₃PO₄, t°'),
            p('là phản ứng')
          ],
          options: options(['hydrogen hoá.', 'trùng ngưng.', 'ester hoá.', 'hydrate hoá.']),
          answer: 'D',
          solution: solution('Cộng nước vào liên kết đôi C=C của ethene là phản ứng hydrate hóa.'),
          meta: meta('g11-c4', 'g11-c5')
        },
        {
          id: 'tn25-5',
          content: [p('Từ phổ khối lượng, phân tử khối của ester X được xác định là 88. Công thức phù hợp với X là')],
          options: options(['CH₃CH₂OH.', 'CH₃COOC₂H₅.', 'C₃H₇COOH.', 'HCOOC₂H₅.']),
          answer: 'B',
          solution: solution('CH₃COOC₂H₅ (C₄H₈O₂) là ester có M = 88. C₃H₇COOH cũng có M = 88 nhưng là carboxylic acid; HCOOC₂H₅ có M = 74; CH₃CH₂OH là alcohol.'),
          meta: meta('g12-c1', 'g11-c3')
        },
        {
          id: 'tn25-6',
          content: [p('Tên gọi theo danh pháp thay thế của chất có công thức cấu tạo CH₃–NH₂ là')],
          options: options(['methanamine.', 'ethylamine.', 'methylamine.', 'ethanamine.']),
          answer: 'A',
          solution: solution('Danh pháp thay thế: tên mạch carbon (methane) bỏ “e” + “amine” ⇒ methanamine. “Methylamine” là tên gốc – chức.'),
          meta: meta('g12-c3')
        },
        {
          id: 'tn25-7',
          content: [p('Trong phản ứng tách kim loại Cu từ CuSO₄ theo phương trình hoá học Zn(s) + CuSO₄(aq) → ZnSO₄(aq) + Cu(s), phương pháp tách kim loại nào sau đây đã được áp dụng?')],
          options: options(['Nhiệt luyện.', 'Thủy luyện.', 'Điện phân nóng chảy.', 'Điện phân dung dịch.']),
          answer: 'B',
          solution: solution('Dùng kim loại mạnh hơn (Zn) khử ion Cu²⁺ trong dung dịch là phương pháp thủy luyện.'),
          meta: meta('g12-c6')
        },
        {
          id: 'tn25-8',
          content: [
            p('Cho các phát biểu sau về tính chất của methylamine:'),
            list([
              '(a) Methylamine làm giấy quỳ tím ẩm hóa đỏ.',
              '(b) Methylamine phản ứng được với HCl trong dung dịch.',
              '(c) Methylamine không phản ứng được với dung dịch FeCl₃ ở điều kiện thường.',
              '(d) Dung dịch methylamine phản ứng được với Cu(OH)₂.'
            ]),
            p('Số phát biểu đúng là')
          ],
          options: options(['4.', '3.', '2.', '1.']),
          answer: 'C',
          solution: solution('(a) sai: methylamine làm quỳ tím ẩm hóa xanh. (b) đúng. (c) sai: 3CH₃NH₂ + FeCl₃ + 3H₂O → Fe(OH)₃↓ + 3CH₃NH₃Cl. (d) đúng: tạo phức với Cu(OH)₂. Có 2 phát biểu đúng.'),
          meta: meta('g12-c3')
        },
        {
          id: 'tn25-9',
          content: [p('Cho thế điện cực chuẩn của Ag⁺/Ag và Zn²⁺/Zn lần lượt là E°_{1} = +0,799 V và E°_{2} = –0,763 V. Sức điện động chuẩn của pin Galvani (E°_{pin}) tạo bởi hai cặp oxi hóa–khử Ag⁺/Ag và Zn²⁺/Zn được tính theo công thức nào sau đây?')],
          options: options(['E°_{pin} = E°_{1} – E°_{2}.', 'E°_{pin} = E°_{2} + E°_{1}', 'E°_{pin} = –E°_{2} – E°_{1}.', 'E°_{pin} = E°_{2} – E°_{1}.']),
          answer: 'A',
          solution: solution('E°pin = E°(cực dương) − E°(cực âm). Ag⁺/Ag (E°₁ lớn hơn) là cực dương, Zn²⁺/Zn là cực âm ⇒ E°pin = E°₁ − E°₂ = 1,562 V.'),
          meta: meta('g12-c5')
        },
        {
          id: 'tn25-10',
          content: [p('Phát biểu nào sau đây về fructose **không** đúng?')],
          options: options([
            'Fructose có công thức phân tử C₆H₁₂O₆.',
            'Fructose phản ứng được với Cu(OH)₂ trong môi trường kiềm ở điều kiện thường.',
            'Fructose thuộc loại monosaccharide.',
            'Fructose làm mất màu nước bromine ở điều kiện thường.'
          ]),
          answer: 'D',
          solution: solution('Fructose không có nhóm –CHO nên không làm mất màu nước bromine (dùng nước bromine để phân biệt glucose với fructose). A, B, C đúng.'),
          meta: meta('g12-c2')
        },
        {
          id: 'tn25-11',
          content: [
            p('Cho phản ứng thuận nghịch sau:'),
            eq('H₂(g) + I₂(g) ⇌ 2HI(g)', 't°'),
            p('Ở trạng thái cân bằng, nồng độ (mol·L⁻¹) của H₂(g), I₂(g) và HI(g) được kí hiệu lần lượt là [H₂], [I₂] và [HI]. Biểu thức hằng số cân bằng K_{C} của phản ứng là')
          ],
          options: options(['K_{C} = [H₂][I₂] / [HI]', 'K_{C} = [HI]² / ([H₂][I₂])', 'K_{C} = [H₂][I₂] / [HI]²', 'K_{C} = [HI] / ([H₂][I₂])']),
          answer: 'B',
          solution: solution('K_C bằng tích nồng độ chất sản phẩm (mũ hệ số) chia tích nồng độ chất phản ứng: K_C = [HI]² / ([H₂][I₂]).'),
          meta: meta('g11-c1')
        },
        {
          id: 'tn25-12',
          content: [p('Số lượng phối tử trong phức chất [Co(NH₃)₆]³⁺ là')],
          options: options(['6.', '7.', '3.', '1.']),
          answer: 'A',
          solution: solution('Ion trung tâm Co³⁺ liên kết với 6 phối tử NH₃.'),
          meta: meta('g12-c8')
        },
        {
          id: 'tn25-13',
          content: [p('Trong các phản ứng hữu cơ thường có sự tạo thành các tiểu phân trung gian hoạt động như gốc tự do, carbanion, carbocation. Carbocation là ion mang điện tích dương trên nguyên tử carbon. Có bao nhiêu carbocation trong số các tiểu phân (CH₃)₃C⁺, (CH₃)₂C⁻H, ĊH₃ và (CH₃)₂C⁺H?')],
          options: options(['3.', '2.', '1.', '4.']),
          answer: 'B',
          solution: solution('(CH₃)₃C⁺ và (CH₃)₂C⁺H mang điện tích dương trên carbon: 2 carbocation. (CH₃)₂C⁻H là carbanion; ĊH₃ là gốc tự do.'),
          meta: meta('g11-c4')
        },
        {
          id: 'tn25-14',
          content: [p('“…(1)… là những hợp chất hữu cơ trong phân tử có nhóm hydroxyl liên kết với nguyên tử carbon no”. Nội dung phù hợp trong chỗ trống (1) là')],
          options: options(['Ketone.', 'Phenol.', 'Aldehyde.', 'Alcohol.']),
          answer: 'D',
          solution: solution('Alcohol có nhóm –OH liên kết với nguyên tử carbon no; phenol có –OH gắn trực tiếp vào vòng benzene.'),
          meta: meta('g11-c5')
        },
        {
          id: 'tn25-15',
          content: [
            p('Nhiệt tạo thành chuẩn (Δ_{f}H°_{298}) của MgCO₃(s), MgO(s) và CO₂(g) lần lượt là –1096,0 kJ·mol⁻¹; –602,0 kJ·mol⁻¹ và –393,5 kJ·mol⁻¹.'),
            p('Biến thiên enthalpy chuẩn (Δ_{r}H°_{298}) của phản ứng'),
            eq('MgCO₃(s) → MgO(s) + CO₂(g)'),
            p('là bao nhiêu?')
          ],
          options: options(['–100,5 kJ.', '–494,0 kJ.', '+494,0 kJ.', '+100,5 kJ.']),
          answer: 'D',
          solution: solution('Δ_rH° = (−602,0) + (−393,5) − (−1096,0) = +100,5 kJ.'),
          meta: meta('g10-c5')
        },
        {
          id: 'tn25-16',
          content: [p('Silicon (Si) là chất bán dẫn quan trọng, được sử dụng rộng rãi trong chế tạo các vi mạch và thiết bị điện tử. Ở trạng thái cơ bản, cấu hình electron của nguyên tử Si (số hiệu nguyên tử bằng 14) là')],
          options: options(['1s²2s²2p⁶3s²3p¹.', '1s²2s²2p⁶3s³3p¹.', '1s²2s²2p⁶3p²3s².', '1s²2s²2p⁶3s²3p².']),
          answer: 'D',
          solution: solution('Si có 14 electron: 1s²2s²2p⁶3s²3p². Phân lớp s chứa tối đa 2 electron; 3s phải điền trước 3p.'),
          meta: meta('g10-c1')
        },
        {
          id: 'tn25-17',
          content: [
            p('Sử dụng thông tin cho dưới đây để trả lời các câu 17 – 18:'),
            p(STEEL_INTRO),
            p('Cho các phát biểu sau về ăn mòn điện hóa và phương pháp bảo vệ đối với các công trình bằng thép nêu trên:'),
            list([
              '(a) Các khối nhôm hoặc khối kẽm bảo vệ thép theo phương pháp điện hóa.',
              '(b) Khi thép bị ăn mòn điện hóa, sắt trong thép bị oxi hoá.',
              '(c) Thép bị ăn mòn điện hóa mà không cần tiếp xúc với dung dịch chất điện li.',
              '(d) Khi bảo vệ thép theo phương pháp điện hóa, nhôm hoặc kẽm đóng vai trò là cathode nên bị ăn mòn trước.'
            ]),
            p('Số phát biểu đúng là')
          ],
          options: options(['3.', '2.', '1.', '4.']),
          answer: 'B',
          solution: solution('(a) đúng. (b) đúng: Fe là anode, bị oxi hóa. (c) sai: ăn mòn điện hóa cần môi trường chất điện li. (d) sai: Al, Zn là anode (cực âm) nên bị ăn mòn trước. Có 2 phát biểu đúng.'),
          meta: meta('g12-c6')
        },
        {
          id: 'tn25-18',
          content: [
            p('Sử dụng thông tin cho dưới đây để trả lời các câu 17 – 18:'),
            p(STEEL_INTRO),
            p('Cho biết thế điện cực chuẩn của Na⁺/Na và Fe²⁺/Fe lần lượt là –2,713 V và –0,440 V. Khi thảo luận về phương pháp bảo vệ các công trình bằng thép nêu trên khỏi sự ăn mòn điện hóa, một học sinh đề xuất: “Có thể sử dụng khối kim loại natri (sodium, Na) thay thế cho các khối nhôm hoặc kẽm để bảo vệ các công trình bằng thép đó”. Một số nhận định đồng tình và không đồng tình về đề xuất này được đưa ra như sau:'),
            list([
              '(1) Sử dụng khối kim loại natri do kim loại này có tính khử mạnh hơn sắt.',
              '(2) Có thể sử dụng khối kim loại natri do kim loại này và nhôm đều có khối lượng riêng nhỏ.',
              '(3) Không thể sử dụng khối kim loại natri do kim loại này dễ phản ứng với nước biển.',
              '(4) Không thể sử dụng khối kim loại natri do kim loại này có tính khử yếu hơn sắt.'
            ]),
            p('Nhận định đúng là')
          ],
          options: options(['nhận định (4).', 'nhận định (3).', 'nhận định (2).', 'nhận định (1).']),
          answer: 'B',
          solution: solution('Na tuy có tính khử mạnh hơn Fe nhưng phản ứng mãnh liệt với nước biển (2Na + 2H₂O → 2NaOH + H₂) nên tan hết, không bảo vệ được thép: nhận định (3) đúng. (4) sai về E°; (1), (2) không phải lí do khả thi.'),
          meta: meta('g12-c6', 'g12-c7')
        }
      ]
    },
    {
      part: 'II',
      instruction: 'Thí sinh trả lời từ câu 1 đến 4. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.',
      questions: [
        {
          id: 'tn25-ii1',
          content: [
            p('Tơ capron là loại tơ có tính dai, độ đàn hồi và độ bóng cao, ít thấm nước và được sử dụng để dệt vải may mặc. Tơ capron được tổng hợp từ caprolactam theo phương trình hoá học sau:'),
            figure('ii1-capron.png', 377, 79, 377, 'Phương trình (1): n phân tử caprolactam (vòng 7 cạnh chứa nhóm –CO–NH–) với điều kiện xúc tác, t° tạo thành polymer (–HN–[CH₂]₅–CO–)ₙ.')
          ],
          statements: [
            { id: 'a', text: 'Trong phản ứng (1), các phân tử monomer bị mở vòng.' },
            { id: 'b', text: 'Tơ capron là tơ bán tổng hợp.' },
            { id: 'c', text: 'Do tơ capron và tơ nylon–6,6 đều có các nhóm –CO–NH– nên hai loại tơ này đều bền với dung dịch kiềm mạnh.' },
            { id: 'd', text: 'Do tơ capron có các nhóm –CO–NH– nên tơ capron là peptide.' }
          ],
          answer: { a: true, b: false, c: false, d: false },
          solution: solution('a đúng: trùng hợp mở vòng caprolactam. b sai: capron là tơ tổng hợp. c sai: liên kết –CO–NH– bị thủy phân trong kiềm mạnh nên tơ polyamide kém bền với kiềm. d sai: peptide tạo từ các α-amino acid; capron có mắt xích –NH–[CH₂]₅–CO–.'),
          meta: meta('g12-c4')
        },
        {
          id: 'tn25-ii2',
          content: [
            p('Một nhà máy sản xuất sodium hydroxide (NaOH) và chlorine (Cl₂) bằng phương pháp điện phân dung dịch sodium chloride (NaCl) có màng ngăn với điện cực trơ theo phương trình hoá học sau:'),
            eq('2NaCl(aq) + 2H₂O(l) → 2NaOH(aq) + H₂(g) + Cl₂(g)', 'điện phân, có màng ngăn'),
            p('Sodium hydroxide rắn thu được bằng cách cô đặc rồi hạ nhiệt độ dung dịch chứa NaOH sau điện phân.')
          ],
          statements: [
            { id: 'a', text: 'Trong quá trình điện phân, dung dịch ở khu vực cathode có pH < 7.' },
            { id: 'b', text: 'Màng ngăn giúp ngăn phản ứng giữa sodium hydroxide và chlorine trong quá trình điện phân.' },
            { id: 'c', text: 'Tại anode, khí chlorine thu được do sự oxi hoá ion chloride.' },
            { id: 'd', text: 'Sodium hydroxide rắn thu được từ dung dịch chứa NaOH bằng phương pháp chiết.' }
          ],
          answer: { a: false, b: true, c: true, d: false },
          solution: solution('a sai: ở cathode 2H₂O + 2e → H₂ + 2OH⁻ nên pH > 7. b đúng: không có màng ngăn, Cl₂ phản ứng với NaOH tạo nước Javel. c đúng: 2Cl⁻ → Cl₂ + 2e. d sai: NaOH rắn thu được bằng cô đặc, kết tinh, không phải chiết.'),
          meta: meta('g12-c5')
        },
        {
          id: 'tn25-ii3',
          content: [
            p('Trong phòng thí nghiệm, một nhóm học sinh tìm hiểu ảnh hưởng của thời gian lưu giữ tới nồng độ FeSO₄ trong dung dịch. Giả thuyết của nhóm học sinh là: “Khi để lâu, nồng độ FeSO₄ trong dung dịch giảm”. Nhóm học sinh chuẩn bị 250,0 mL dung dịch FeSO₄ (nồng độ khoảng 0,1 M) đựng trong bình kín (dán nhãn bình là Y) và tiến hành các thí nghiệm ở hai thời điểm khác nhau như sau:'),
            p('- Ngày thứ nhất:'),
            p('Bước 1: Lấy 10,00 mL dung dịch trong bình Y cho vào bình tam giác rồi thêm tiếp 5 mL dung dịch H₂SO₄ 2 M.'),
            p('Bước 2: Chuẩn độ dung dịch trong bình tam giác bằng dung dịch KMnO₄ 2,20×10⁻² M đến khi xuất hiện màu hồng nhạt (bền trong khoảng 20 giây) thì dừng. Ghi lại thể tích dung dịch KMnO₄ đã dùng.'),
            p('Lặp lại thí nghiệm chuẩn độ thêm 2 lần. Thể tích trung bình của dung dịch KMnO₄ sau 3 lần chuẩn độ là 10,70 mL. Nồng độ của Fe(II) xác định được là C₁ M.'),
            p('- Ngày thứ tám:'),
            p('Xác định lại hàm lượng Fe(II) của dung dịch chứa trong bình Y theo các bước tương tự như ngày thứ nhất. Thể tích trung bình của dung dịch KMnO₄ sau 3 lần chuẩn độ là 9,92 mL. Nồng độ của Fe(II) xác định được là C₂ M.'),
            p('Nồng độ dung dịch KMnO₄ như nhau trong các thí nghiệm chuẩn độ. Sự thay đổi nồng độ của Fe(II) (q%) được tính theo công thức: q% = (C₁ − C₂) / C₁ × 100%.'),
            figure('ii3-dung-cu.png', 132, 285, 132, 'Hình 1: ba dụng cụ thí nghiệm. (A) buret có khóa ở đầu dưới, (B) cốc có vạch chia, (C) bình tam giác (bình nón).')
          ],
          statements: [
            { id: 'a', text: 'Khi chuẩn độ, dung dịch KMnO₄ được nhỏ trực tiếp vào bình tam giác từ dụng cụ kí hiệu là (B) được minh hoạ ở Hình 1.' },
            { id: 'b', text: 'Giá trị của q là 7,9. (Kết quả các phép tính trung gian không được làm tròn, chỉ kết quả cuối cùng được làm tròn đến hàng phần mười).' },
            { id: 'c', text: 'Giá trị của C₂ là 0,109. (Kết quả các phép tính trung gian không được làm tròn, chỉ kết quả cuối cùng được làm tròn đến hàng phần nghìn).' },
            { id: 'd', text: 'Kết quả thu được từ các thí nghiệm phù hợp với giả thuyết ban đầu của nhóm học sinh.' }
          ],
          answer: { a: false, b: false, c: true, d: true },
          solution: solution('5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O. a sai: KMnO₄ được nhỏ từ buret (A). C₁ = 5 × 0,022 × 10,70 / 10,00 = 0,1177 M; C₂ = 5 × 0,022 × 9,92 / 10,00 = 0,10912 M ⇒ c đúng (0,109). q = (10,70 − 9,92)/10,70 × 100 = 7,29 ≈ 7,3 ⇒ b sai. d đúng: nồng độ Fe(II) giảm sau 8 ngày.'),
          meta: meta('g12-c8', 'g10-c4')
        },
        {
          id: 'tn25-ii4',
          content: [
            p('Trong phòng thí nghiệm, benzoic acid được điều chế từ toluene theo sơ đồ gồm hai giai đoạn được đánh số (1) và (2) như sau:'),
            eq('(1) C₆H₅CH₃ → C₆H₅COOK', '+ KMnO₄ (aq), t°'),
            eq('(2) C₆H₅COOK → C₆H₅COOH', '+ HCl(aq)'),
            p('Trong một thí nghiệm tổng hợp benzoic acid theo sơ đồ trên, từ 2,0 mL toluene (khối lượng riêng bằng 0,867 g mL⁻¹) thu được 1,40 gam benzoic acid. Biết KMnO₄ và HCl được lấy dư. Hiệu suất của quá trình tổng hợp benzoic acid từ toluene là h%.'),
            p('Cho biết số sóng hấp thụ đặc trưng của một số liên kết trên phổ hồng ngoại như sau:'),
            table(['Liên kết', 'O–H (alcohol)', 'O–H (carboxylic acid)', 'C=O (ester, carboxylic acid)'], [['Số sóng (cm⁻¹)', '3650–3200', '3300–2500', '1780–1650']])
          ],
          statements: [
            { id: 'a', text: 'Giá trị của h là 60,9. (Kết quả các phép tính trung gian không được làm tròn, chỉ kết quả cuối cùng được làm tròn đến hàng phần mười.)' },
            { id: 'b', text: 'Trong phản ứng với KMnO₄ (aq) ở giai đoạn (1), toluene đóng vai trò là chất oxi hóa.' },
            { id: 'c', text: 'Trên phổ hồng ngoại của benzoic acid, tín hiệu (peak) ở 1690 cm⁻¹ đặc trưng cho liên kết O–H.' },
            { id: 'd', text: 'Trong phản ứng ở giai đoạn (2), anion C₆H₅COO⁻ là một base theo thuyết Brønsted – Lowry.' }
          ],
          answer: { a: true, b: false, c: false, d: true },
          solution: solution('a đúng: m(toluene) = 2,0 × 0,867 = 1,734 g ⇒ n = 1,734/92 = 0,018848 mol; n(benzoic acid) = 1,40/122 = 0,011475 mol ⇒ h = 60,88 ≈ 60,9. b sai: toluene bị oxi hóa nên là chất khử. c sai: 1690 cm⁻¹ thuộc vùng C=O. d đúng: C₆H₅COO⁻ nhận H⁺ tạo C₆H₅COOH.'),
          meta: meta('g11-c4', 'g11-c6', 'g11-c3')
        }
      ]
    },
    {
      part: 'III',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 6.',
      questions: [
        {
          id: 'tn25-iii1',
          content: [p('Có bao nhiêu công thức cấu tạo của aldehyde ứng với công thức phân tử C₅H₁₀O?')],
          answer: '4',
          solution: solution('Aldehyde C₄H₉–CHO; gốc C₄H₉ có 4 cấu tạo: CH₃CH₂CH₂CH₂CHO, CH₃CH₂CH(CH₃)CHO, (CH₃)₂CHCH₂CHO, (CH₃)₃CCHO ⇒ 4.'),
          meta: meta('g11-c6')
        },
        {
          id: 'tn25-iii2',
          content: [
            p('Trong phân tử peptide cho dưới đây có bao nhiêu liên kết peptide?'),
            figure('iii2-peptide.png', 258, 70, 258, 'Công thức khung của một peptide mạch hở gồm 5 gốc α-amino acid nối nhau bởi các nhóm –CO–NH–: đầu N có nhóm NH₂, một gốc có mạch nhánh –CH₂CH₂COOH, một gốc có nhánh isopropyl, gốc cuối có nhóm COOH và mạch nhánh –(CH₂)₄–NH₂.')
          ],
          answer: '4',
          solution: solution('Peptide gồm 5 gốc α-amino acid (Ala–Gly–Glu–Val–Lys) nối bằng 4 nhóm –CO–NH– ⇒ 4 liên kết peptide.'),
          meta: meta('g12-c3')
        },
        {
          id: 'tn25-iii3',
          content: [p('Phần trăm khối lượng carbon trong benzene là a%. Giá trị của a là bao nhiêu? (Làm tròn kết quả đến hàng phần mười.)')],
          answer: '92,3',
          solution: solution('Benzene C₆H₆: %C = 72/78 × 100 = 92,31 ≈ 92,3.'),
          meta: meta('g11-c4')
        },
        {
          id: 'tn25-iii4',
          content: [
            p('Lượng nhiệt tỏa ra khi đốt cháy hoàn toàn 1 gam nhiên liệu (kí hiệu là Q, tính theo kJ g⁻¹) được sử dụng để đánh giá mức độ “giàu năng lượng” của nhiên liệu đó. Ở điều kiện chuẩn, giá trị Q của ethanol lỏng và một loại khí đốt G lần lượt là Q_{E} và Q_{G}. Cho biết: G chỉ chứa propane và butane với tỉ lệ mol tương ứng là 1 : 2; nhiệt tạo thành chuẩn (Δ_{f}H°_{298}) của các chất được cho trong bảng:'),
            table(['Chất', 'C₂H₅OH(l)', 'C₃H₈(g)', 'CH₃CH₂CH₂CH₃(g)', 'CO₂(g)', 'H₂O(l)', 'O₂(g)'], [['Δ_{f}H°_{298} (kJ mol⁻¹)', '–277,6', '–105,0', '–129,0', '–393,5', '–285,8', '0']]),
            p('Đặt k = Q_{G} / Q_{E}, giá trị của k bằng bao nhiêu? (Không làm tròn kết quả các phép tính trung gian, chỉ làm tròn kết quả cuối cùng đến hàng phần trăm.)')
          ],
          answer: '1,68',
          solution: solution('Ethanol: Δ_rH = 2(−393,5) + 3(−285,8) − (−277,6) = −1366,8 kJ/mol ⇒ Q_E = 1366,8/46 = 29,713 kJ/g. Propane: 3(−393,5) + 4(−285,8) + 105,0 = −2218,7 kJ/mol; butane: 4(−393,5) + 5(−285,8) + 129,0 = −2874,0 kJ/mol. G (1 mol C₃H₈ + 2 mol C₄H₁₀, 160 g): Q_G = (2218,7 + 2 × 2874,0)/160 = 49,792 kJ/g. k = 49,792/29,713 = 1,676 ≈ 1,68.'),
          meta: meta('g10-c5')
        },
        {
          id: 'tn25-iii5',
          content: [p('Luyện thép từ gang là quá trình làm giảm hàm lượng carbon và một số nguyên tố khác có trong gang. Một nhà máy luyện thép sử dụng loại gang nguyên liệu trong đó carbon chiếm 4,60% về khối lượng, còn lại là sắt (coi hàm lượng các nguyên tố khác không đáng kể). Khi tiến hành luyện thép, một lượng 2,88 tấn khí oxygen được thổi vào 45,0 tấn gang nguyên liệu nóng chảy để oxi hóa carbon thành CO và CO₂. Hỗn hợp khí thu được chỉ gồm CO và CO₂ có số mol bằng nhau. Phần trăm khối lượng carbon trong thép thu được là w%, còn lại là sắt. Coi sắt không bị mất đi trong quá trình luyện thép. Giá trị của w là bao nhiêu? (Không làm tròn kết quả các phép tính trung gian, chỉ làm tròn kết quả cuối cùng đến hàng phần trăm.)')],
          answer: '1,45',
          solution: solution('Xem tấn như gam: m(C) = 2,07; m(Fe) = 42,93. n(O₂) = 2,88/32 = 0,09. Với n(CO) = n(CO₂) = x: n(O₂) = x/2 + x = 1,5x ⇒ x = 0,06; carbon bị đốt = 0,12 × 12 = 1,44. Còn lại 0,63 ⇒ w = 0,63/(42,93 + 0,63) × 100 = 1,446 ≈ 1,45.'),
          meta: meta('g12-c6')
        },
        {
          id: 'tn25-iii6',
          content: [p('Oleum Z (H₂SO₄·nSO₃) được tạo thành khi cho 100 kg dung dịch H₂SO₄ 98% hấp thụ hoàn toàn 25 kg SO₃. Phần trăm khối lượng SO₃ trong Z là b%. Xác định giá trị của b. (Không làm tròn kết quả các phép tính trung gian, chỉ làm tròn kết quả cuối cùng đến hàng phần mười.)')],
          answer: '12,9',
          solution: solution('Nước trong dung dịch: 2 kg = 1/9 kmol, phản ứng với 1/9 kmol SO₃ (8,889 kg). SO₃ tự do = 25 − 8,889 = 16,111 kg trong 125 kg oleum ⇒ b = 12,89 ≈ 12,9.'),
          meta: meta('g11-c2')
        }
      ]
    }
  ]
}
