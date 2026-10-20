// Đề ôn thi tốt nghiệp THPT 2026 — đề số 6, bộ “50 đề ôn thi TN THPT 2026” của
// ThS. Dương Thành Tính (đề do giáo viên biên soạn, không phải đề chính thức).
// Source: owner-supplied “DE 6 ON TN.THPT 2026 - DTT.pdf” (pages 1–5 questions,
// pages 5–13 the author's key with worked solutions). The author's contact
// details printed in the page header are deliberately not stored. A worked
// solution printed by mistake inside the question copy (Câu 3) is left out.
// Every key item was re-solved by ChemLab: 28/28 agree. Check list:
// docs/exam/papers/dtt-2026-de-6.md

const figure = (file, width, height, displayWidth, alt) => ({ type: 'figure', src: new URL(`./assets/dtt-2026-de-6/${file}`, import.meta.url).href, width, height, displayWidth, alt })
const p = text => ({ type: 'p', text })
const list = items => ({ type: 'list', items })
const table = (head, rows) => ({ type: 'table', head, rows })
const eq = (text, condition = '') => ({ type: 'equation', text, condition })
const options = texts => ['A', 'B', 'C', 'D'].map((id, index) => ({ id, text: texts[index] }))
const solution = text => ({ text, official: false })
const meta = (...chapters) => ({ status: 'internal', chapters })

const ALLOY = 'Trong công nghiệp, các hợp kim của sắt với các kim loại chuyển tiếp dãy thứ nhất (như hợp kim Fe-Ni, Fe-Cr) được sử dụng rộng rãi nhờ độ bền nhiệt và khả năng chống ăn mòn cao. Tuy nhiên, trong môi trường nước biển hoặc không khí ẩm, sự ăn mòn điện hóa vẫn diễn ra tại các bề mặt tiếp xúc. Để bảo vệ các công trình này, phương pháp điện cực hy sinh thường được áp dụng bằng cách gắn các khối kim loại có tính khử mạnh hơn vào bề mặt thiết bị cần bảo vệ.'

export default {
  id: 'dtt-2026-de-6',
  title: 'Đề ôn thi tốt nghiệp THPT 2026 — đề số 6 (ThS. Dương Thành Tính) — Hóa học',
  kind: 'teacher-practice',
  blueprint: 'thpt-2025-hoa',
  license: 'owner-attested',
  dataVersion: 1,
  timeLimitMinutes: 50,
  source: {
    authority: 'ThS. Dương Thành Tính — Bộ 50 đề ôn thi TN THPT 2026',
    file: { name: 'DE 6 ON TN.THPT 2026 - DTT.pdf', sha256: '21e92283bc8e1b3debc94567ae3fe491da58f876fdf9dfc6f2cbe39d117f5f14' },
    originalTitle: 'Đề ôn thi TN.THPT – DTT — Đề số 6 — Môn: Hóa học'
  },
  answerKey: 'author',
  preamble: 'Cho biết nguyên tử khối: H = 1, C = 12, N = 14, O = 16, Al = 27, S = 32, K = 39; Fe = 56.',
  sections: [
    {
      part: 'I',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 18. Mỗi câu hỏi thí sinh chỉ chọn một phương án.',
      questions: [
        {
          id: 'dtt6-1',
          content: [p('Trong các nhà máy điện hạt nhân, người ta sử dụng năng lượng từ phản ứng phân hạch hạt nhân của Uranium để tạo ra điện năng. Phát biểu nào sau đây **không** đúng về nguyên tử Uranium?')],
          options: options([
            'Hạt nhân nguyên tử Uranium chứa proton và neutron.',
            'Số proton trong hạt nhân nguyên tử Uranium quyết định tính chất hóa học của nó.',
            'Theo mô hình hiện đại, electron trong nguyên tử Uranium chuyển động rất nhanh, theo quỹ đạo tròn hay bầu dục.',
            'Nguyên tử Uranium trung hòa về điện.'
          ]),
          answer: 'C',
          solution: solution('Theo mô hình hiện đại, electron chuyển động rất nhanh quanh hạt nhân không theo quỹ đạo xác định mà tạo thành đám mây electron (orbital). Quỹ đạo tròn/bầu dục là mô hình Rutherford – Bohr.'),
          meta: meta('g10-c1')
        },
        {
          id: 'dtt6-2',
          content: [
            p('Cho biết biến thiên enthalpy của phản ứng sau ở điều kiện chuẩn'),
            eq('CO(g) + ½O₂(g) → CO₂(g)   Δ_{r}H°_{298} = -283,0 kJ'),
            p('Biết nhiệt tạo thành của CO₂: Δ_{r}H°_{298}(CO₂(g)) = -393,5 kJ'),
            p('Nhiệt tạo thành chuẩn của CO là')
          ],
          options: options(['-110,5 kJ', '+110,5 kJ', '-141,5 kJ', '-221,0 kJ']),
          answer: 'A',
          solution: solution('Δ_rH = Δ_fH(CO₂) − Δ_fH(CO) ⇒ Δ_fH(CO) = −393,5 − (−283,0) = −110,5 kJ/mol. (Đề viết kí hiệu Δ_r cho nhiệt tạo thành CO₂; đúng ra là Δ_f.)'),
          meta: meta('g10-c5')
        },
        {
          id: 'dtt6-3',
          content: [p('Bác nông dân đang bón phân cho ruộng lúa của mình. Trên bao bì phân ghi NPK 20-15-10. Con số 20-15-10 trên bao bì phân bón cho biết điều gì?')],
          options: options([
            'Tỉ lệ % khối lượng các nguyên tố N, P, K lần lượt là 20%, 15%, 10%.',
            'Tỉ lệ % khối lượng N, P₂O₅, K₂O lần lượt là 20%, 15%, 10%.',
            'Khối lượng các nguyên tố N, P, K lần lượt là 20g, 15g, 10g trong mỗi bao phân.',
            'Hàm lượng các nguyên tố N, P, K trong 100g phân bón.'
          ]),
          answer: 'B',
          solution: solution('Độ dinh dưỡng của phân bón được quy ước theo % khối lượng N, P₂O₅, K₂O.'),
          meta: meta('g11-c2')
        },
        {
          id: 'dtt6-4',
          content: [p('Trong phổ hồng ngoại, phát biểu nào **sai**')],
          options: options([
            'Trục tung biểu diễn độ truyền qua hoặc hấp thụ theo %',
            'Trục hoành biểu diễn số sóng (cm⁻¹) của các bức xạ trong vùng hồng ngoại.',
            'Dựa vào cực đại hấp thụ hay cực tiểu truyền qua có thể dự đoán sự có mặt của các nhóm chức trong hợp chất nghiên cứu.',
            'Trục hoành biểu diễn số sóng (cm⁻¹) của các bức xạ trong vùng tử ngoại.'
          ]),
          answer: 'D',
          solution: solution('Phổ hồng ngoại dùng bức xạ vùng hồng ngoại, không phải tử ngoại.'),
          meta: meta('g11-c3')
        },
        {
          id: 'dtt6-5',
          content: [p('Sục khí ethylene dư vào dung dịch bromine (có màu vàng), hiện tượng quan sát được là')],
          options: options(['xuất hiện kết tủa màu trắng.', 'xuất hiện kết tủa màu vàng nhạt.', 'xuất hiện kết tủa màu nâu đen.', 'dung dịch bị mất màu.']),
          answer: 'D',
          solution: solution('CH₂=CH₂ + Br₂ → CH₂Br–CH₂Br (không màu) nên dung dịch bromine mất màu.'),
          meta: meta('g11-c4')
        },
        {
          id: 'dtt6-6',
          content: [p('Trong một thí nghiệm xà phòng hóa, học sinh thực hiện phản ứng đun nóng dầu dừa với dung dịch NaOH, sau đó làm lạnh và thêm dung dịch NaCl. Học sinh nhận thấy có lớp chất rắn màu trắng nổi lên trên. Lớp chất rắn này là gì?')],
          options: options(['Dung dịch muối ăn.', 'Glycerol.', 'Xà phòng.', 'Dầu dừa chưa phản ứng hết.']),
          answer: 'C',
          solution: solution('NaCl làm giảm độ tan của muối sodium của acid béo; xà phòng tách ra, nhẹ hơn nên nổi lên. Glycerol tan trong dung dịch.'),
          meta: meta('g12-c1')
        },
        {
          id: 'dtt6-7',
          content: [p('Một người muốn bổ sung Omega-3 để cải thiện sức khỏe tim mạch. Trong các thực phẩm sau, thực phẩm nào có hàm lượng Omega-3 cao nhất?')],
          options: options(['Dầu dừa.', 'Cá hồi.', 'Thịt bò.', 'Phô mai.']),
          answer: 'B',
          solution: solution('Cá hồi (cá béo) giàu acid béo omega-3; dầu dừa chủ yếu là chất béo no.'),
          meta: meta('g12-c1')
        },
        {
          id: 'dtt6-8',
          content: [p('Tuyến nội tiết nào sau đây giữ cho nồng độ glucose trong máu ổn định?')],
          options: options(['Tuyến yên.', 'Tuyến tụy.', 'Tuyến thượng thận.', 'Tuyến giáp.']),
          answer: 'B',
          solution: solution('Tuyến tụy tiết insulin và glucagon điều hòa nồng độ glucose trong máu.'),
          meta: meta('g12-c2')
        },
        {
          id: 'dtt6-9',
          content: [p('Chất X có các đặc điểm sau: phân tử có nhiều nhóm -OH, có vị ngọt, hoà tan Cu(OH)₂ ở nhiệt độ thường, phân tử có liên kết glycoside, không làm mất màu nước bromine. Chất X là:')],
          options: options(['saccharose .', 'tinh bột.', 'cellulose.', 'glucose.']),
          answer: 'A',
          solution: solution('Saccharose: vị ngọt, nhiều nhóm –OH, hòa tan Cu(OH)₂, có liên kết glycoside và không có nhóm –CHO nên không làm mất màu nước bromine. Glucose làm mất màu nước bromine; tinh bột, cellulose không ngọt.'),
          meta: meta('g12-c2')
        },
        {
          id: 'dtt6-10',
          content: [p('Nhóm chức nào sau đây là đặc trưng cho amine?')],
          options: options(['– OH.', '– COOH.', '– NH₂.', '– CHO.']),
          answer: 'C',
          solution: solution('Nhóm –NH₂ (amino) đặc trưng cho amine bậc một.'),
          meta: meta('g12-c3')
        },
        {
          id: 'dtt6-11',
          content: [
            p('Polypropylene PP là chất dẻo thường được sử dụng để sản xuất các sản phẩm thiết bị y tế, đồ gia dụng, ... Vật liệu được chế tạo từ PP thường có kí hiệu như hình bên, PP được tổng hợp từ monomer nào sau đây?'),
            figure('c11-ki-hieu-pp.png', 224, 268, 112, 'Kí hiệu tái chế: tam giác ba mũi tên với số 05 ở giữa, bên dưới là chữ PP.')
          ],
          options: options(['CH₂=CH₂.', 'CH₂=CH-CN.', 'CH₃-CH=CH₂.', 'C₆H₅OH và HCHO.']),
          answer: 'C',
          solution: solution('Polypropylene là sản phẩm trùng hợp propylene CH₃–CH=CH₂.'),
          meta: meta('g12-c4')
        },
        {
          id: 'dtt6-12',
          content: [
            p('Cho các cặp oxi hoá - khử của các kim loại và thế điện cực chuẩn tương ứng:'),
            table(['Cặp oxi hóa – khử', 'Li⁺/Li', 'Mg²⁺/Mg', 'Zn²⁺/Zn', 'Ag⁺/Ag'], [['Thế điện cực chuẩn, V', '-3,040', '-2,356', '-0,762', '+0,799']]),
            p('Trong số các kim loại trên, kim loại có tính khử mạnh nhất là')
          ],
          options: options(['Mg.', 'Zn.', 'Ag.', 'Li.']),
          answer: 'D',
          solution: solution('Thế điện cực chuẩn càng âm, kim loại có tính khử càng mạnh: Li (−3,040 V).'),
          meta: meta('g12-c5')
        },
        {
          id: 'dtt6-13',
          content: [p('Phát biểu nào sau đây về liên kết kim loại là đúng?')],
          options: options([
            'Liên kết kim loại là liên kết được hình thành từ lực hút tính điện giữa các cation kim loại và các electron hóa trị tự do. Vì vậy, liên kết kim loại cũng chính là liên kết ion.',
            'Liên kết kim loại được hình thành do giữa các nguyên tử kim loại có sự dùng chung các electron hóa trị tự do. Vì vậy, liên kết kim loại cũng chính là liên kết cộng hóa trị.',
            'Liên kết kim loại là liên kết được hình thành từ lực hút tính điện giữa các cation kim loại và các electron hóa trị tự do trong tinh thể kim loại.',
            'Liên kết kim loại là liên kết được hình thành do sự xen phủ các orbital chứa electron hóa trị tự do của các nguyên tử kim loại.'
          ]),
          answer: 'C',
          solution: solution('Liên kết kim loại là lực hút tĩnh điện giữa các ion dương kim loại ở nút mạng và các electron hóa trị tự do trong tinh thể; nó khác liên kết ion và liên kết cộng hóa trị.'),
          meta: meta('g12-c6')
        },
        {
          id: 'dtt6-14',
          content: [p('Hemoglobin là thành phần cấu tạo nên hồng cầu trong các mạch máu. Mỗi phân tử hemoglobin chứa 4 heme B. Mỗi heme B là phức chất với nguyên tử trung tâm là sắt (iron). Heme B kết hợp thêm một phân tử oxygen thông qua đường hô hấp để vận chuyển dưỡng khí đến mô. Mỗi lần đến mô, một phân tử hemoglobin có thể đem đến cho mô tối đa bao nhiêu nguyên tử oxygen?')],
          options: options(['2.', '4.', '8.', '16.']),
          answer: 'C',
          solution: solution('4 heme × 1 phân tử O₂ = 4 phân tử O₂ = 8 nguyên tử oxygen.'),
          meta: meta('g12-c8')
        },
        {
          id: 'dtt6-15',
          content: [
            p('Thuốc eloxatin có thành phần chính là oxaliplatin, thuộc nhóm chống ung thư có chứa platinum, sử dụng trong điều trị ung thư đại tràng, trực tràng giai đoạn 3 hoặc di căn. Cho biết cấu tạo của oxaliplatin như hình bên dưới'),
            figure('c15-oxaliplatin.png', 400, 248, 200, 'Cấu tạo oxaliplatin: nguyên tử Pt ở giữa liên kết với hai nhóm NH₂ của một vòng cyclohexane-1,2-diamine (bên trái) và với hai nguyên tử O của một gốc oxalate (bên phải).'),
            p('Cấu tạo oxaliplatin'),
            p('Thành phần phức chất oxaliplatin gồm nguyên tử platinum (Pt) là ion trung tâm liên kết với bao nhiêu phối tử?')
          ],
          options: options(['2.', '3.', '4.', '6.']),
          answer: 'A',
          solution: solution('Pt liên kết với 2 phối tử hai càng: 1,2-diaminocyclohexane (qua 2 nguyên tử N) và oxalate (qua 2 nguyên tử O). Số liên kết với Pt là 4 nhưng số phối tử là 2.'),
          meta: meta('g12-c8')
        },
        {
          id: 'dtt6-16',
          content: [p('Trong tự nhiên, các nguyên tố nhóm IA chỉ tồn tại ở dạng hợp chất là do')],
          options: options([
            'các nguyên tố nhóm IA chỉ có thể tìm được trong nước ngầm, nước biển.',
            'các nguyên tốt nhóm IA đều là những kim loại hoạt động hóa học mạnh nên không tồn tại dạng đơn chất.',
            'các nguyên tố nhóm IA thường kết hợp với nhau dể tạo thành các hợp kim bền.',
            'các nguyên tố nhóm IA có độ âm điện lớn nên dễ dàng kết hợp với các nguyên tố khác.'
          ]),
          answer: 'B',
          solution: solution('Kim loại kiềm có tính khử rất mạnh, phản ứng ngay với O₂, H₂O nên không tồn tại dạng đơn chất trong tự nhiên. Chúng có độ âm điện nhỏ (D sai).'),
          meta: meta('g12-c7')
        },
        {
          id: 'dtt6-17',
          content: [
            p('Sử dụng thông tin cho dưới đây để trả lời các câu số 17 – 18:'),
            p(ALLOY),
            p('Cho các phát biểu sau về sự ăn mòn điện hóa và phương pháp bảo vệ các thiết bị làm bằng hợp kim sắt (iron) - nickel (Fe-Ni):'),
            list([
              '(a) Trong không khí ẩm, hợp kim Fe-Ni bị ăn mòn điện hóa, trong đó sắt (iron) đóng vai trò là cực dương (anode).',
              '(b) Để bảo vệ hợp kim Fe-Ni theo phương pháp điện cực hy sinh, có thể gắn các khối kim loại kẽm (Zinc : Zn) hoặc Manganese (Mn) vào bề mặt hợp kim.',
              '(c) Khi sự ăn mòn điện hóa xảy ra, tại cực âm (cathode) của vi pin sẽ diễn ra quá trình oxi hóa các ion kim loại.',
              '(d) Nếu lớp mạ nickel trên bề mặt thép bị trầy xước sâu, sắt (iron) tiếp xúc với môi trường điện li sẽ bị ăn mòn nhanh hơn so với khi không có lớp mạ nickel.'
            ]),
            p('Số phát biểu đúng là')
          ],
          options: options(['1.', '2.', '3.', '4.']),
          answer: 'B',
          solution: solution('(a) sai: trong pin điện hóa, Fe (kim loại mạnh hơn) là anode — cực âm, không phải cực dương. (b) đúng: Zn, Mn có tính khử mạnh hơn Fe, Ni. (c) sai: ở cathode xảy ra sự khử (O₂, H₂O, H⁺). (d) đúng: cặp Fe–Ni làm Fe bị ăn mòn nhanh hơn. Có 2 phát biểu đúng.'),
          meta: meta('g12-c6')
        },
        {
          id: 'dtt6-18',
          content: [
            p('Sử dụng thông tin cho dưới đây để trả lời các câu số 17 – 18:'),
            p(ALLOY),
            p('Cho biết thế điện cực chuẩn của các cặp oxi hóa - khử sau: E°_{Cr²⁺/Cr} = -0,91V; E°_{Fe²⁺/Fe} = -0,44V; E°_{Cu²⁺/Cu} = +0,34V. Khi thảo luận về phương pháp bảo vệ vỏ tàu thủy bằng thép, một học sinh đề xuất: "Có thể sử dụng các khối kim loại đồng (Cu) thay thế cho kẽm để bảo vệ vỏ tàu thép". Một số nhận định về đề xuất này được đưa ra như sau:'),
            list([
              '(1) Không thể sử dụng đồng vì đồng có tính khử yếu hơn sắt, khi gắn vào sẽ làm sắt bị ăn mòn nhanh hơn.',
              '(2) Có thể sử dụng đồng vì đồng là kim loại chuyển tiếp bền, ít bị ăn mòn bởi nước biển hơn kẽm.',
              '(3) Dựa vào thế điện cực chuẩn, sắt có E° thấp hơn đồng nên sắt sẽ đóng vai trò là anode và bị oxi hóa trước.',
              '(4) Việc gắn đồng vào thép sẽ hình thành vi pin điện hóa mà trong đó thép đóng vai trò là cathode.'
            ]),
            p('Nhận định đúng là')
          ],
          options: options(['(1) và (3).', '(2) và (4).', '(1) và (4).', '(2) và (3).']),
          answer: 'A',
          solution: solution('Cu có E° lớn hơn Fe nên khi tiếp xúc, Fe là anode (cực âm) và bị ăn mòn nhanh hơn: (1), (3) đúng. Thép là anode, không phải cathode: (4) sai; (2) sai.'),
          meta: meta('g12-c6')
        }
      ]
    },
    {
      part: 'II',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 4. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.',
      questions: [
        {
          id: 'dtt6-ii1',
          content: [
            p('Sản phẩm tơ Sorona được điều chế từ poly(trimethylene terephthalate). Tơ này được sử dụng rộng rãi trong công nghiệp dệt, đặc biệt để sản xuất các loại đồ bơi. Poly(trimethylene terephthalate) được tổng hợp từ phản ứng trùng ngưng của terephthalic acid và propane-1,3-diol. Hãy cho biết công thức cấu tạo của poly(trimethylene terephthalate).'),
            p('Công thức dùng cho ý a):'),
            figure('ii1-sorona.png', 532, 200, 266, 'Công thức mắt xích polymer trong ngoặc với chỉ số n: nhóm C=O gắn vòng benzene ở vị trí para, vòng nối với nhóm C=O thứ hai, tiếp theo là –O–, mạch ba nhóm CH₂ (vẽ dạng zigzag) và –O–.')
          ],
          statements: [
            { id: 'a', text: 'Công thức cấu tạo của poly(trimethylene terephthalate) là công thức ở hình trên.' },
            { id: 'b', text: 'Loại tơ này không bền trong môi trường kiềm vì polymer chế tạo tơ này chứa liên kết ester, dễ bị thủy phân trong môi trường kiềm.' },
            { id: 'c', text: 'Sorona được tổng hợp từ phản ứng trùng ngưng các monomer tương ứng.' },
            { id: 'd', text: 'Sorona có cùng thành phần nguyên tố với protein.' }
          ],
          answer: { a: true, b: true, c: true, d: false },
          solution: solution('a đúng: mắt xích –CO–C₆H₄–CO–O–CH₂CH₂CH₂–O–. b, c đúng. d sai: Sorona chỉ chứa C, H, O; protein còn có N (và có thể S).'),
          meta: meta('g12-c4')
        },
        {
          id: 'dtt6-ii2',
          content: [p('Protein có nhiều dạng tồn tại và có tính chất đặc trưng')],
          statements: [
            { id: 'a', text: 'Keratin (có ở tóc, móng), myosin (cơ bắp), fibroin ( tơ) là protein dạng hình cầu.' },
            { id: 'b', text: 'Tất cả protein đều tan được trong nước và bị đông tụ khi đun nóng .' },
            { id: 'c', text: 'Hemoglobin ( máu), albumin ( lòng trắng trứng) có dạng hình cầu.' },
            { id: 'd', text: 'Insulin là hormone thuộc protein, sản sinh bởi tuyến tuỵ, có chức năng điều hoà và chuyển hoá glucose trong cơ thể .' }
          ],
          answer: { a: false, b: false, c: true, d: true },
          solution: solution('a sai: keratin, myosin, fibroin là protein dạng sợi. b sai: protein dạng sợi không tan trong nước. c, d đúng.'),
          meta: meta('g12-c3')
        },
        {
          id: 'dtt6-ii3',
          content: [
            p('Một nhóm học sinh tiến hành thí nghiệm kiểm tra độ bền hóa học của mẫu muối Mohr (Fe(NH₄)₂(SO₄)₂.6H₂O) khi để ngoài không khí. Giả thuyết là Fe²⁺ sẽ bị oxi hóa một phần thành Fe³⁺ theo thời gian. Nhóm pha 100,0 mL dung dịch muối Mohr (dung dịch X) từ mẫu muối đã để lâu ngày. Tiến hành chuẩn độ bằng dung dịch thuốc tím (KMnO₄) trong môi trường acid.'),
            p('Quy trình thực hiện:'),
            list([
              'Bước 1: Dùng pipet hút 10,00 mL dung dịch X cho vào bình tam giác, thêm 5 mL dung dịch H₂SO₄ 20%.',
              'Bước 2: Chuẩn độ bằng dung dịch KMnO₄ nồng độ 0,020 M. Tại điểm tương đương, thể tích KMnO₄ trung bình tiêu tốn sau 3 lần chuẩn độ là 15,00 mL.'
            ]),
            p('Biết phương trình ion thu gọn: 5Fe²⁺ + MnO₄⁻ + 8H⁺ → 5Fe³⁺ + Mn²⁺ + 4H₂O'),
            p('Các phát biểu sau đây là đúng hay sai?')
          ],
          statements: [
            { id: 'a', text: 'Trong thí nghiệm trên, dung dịch KMnO₄ được chứa trong dụng cụ (B) ở hình minh họa (bình tam giác).' },
            { id: 'b', text: 'Tại điểm tương đương, dung dịch trong bình tam giác chuyển từ không màu sang màu hồng nhạt bền trong khoảng 20 giây.' },
            { id: 'c', text: 'Nồng độ mol của Fe²⁺ trong dung dịch X xác định được là 0,150 M' },
            { id: 'd', text: 'Nồng độ Fe²⁺ ban đầu khi mới pha là 0,165 M, thì phần trăm Fe²⁺ đã bị oxi hóa là 9,09% .' }
          ],
          answer: { a: false, b: true, c: true, d: true },
          solution: solution('a sai: KMnO₄ (dung dịch chuẩn) được chứa trong buret, không phải bình tam giác (đề gốc không in kèm hình minh họa; theo chính lời phát biểu, (B) là bình tam giác). b đúng: một giọt KMnO₄ dư tạo màu hồng nhạt. c đúng: n(KMnO₄) = 3 × 10⁻⁴ mol ⇒ n(Fe²⁺) = 1,5 × 10⁻³ mol trong 10,00 mL ⇒ 0,150 M. d đúng: (0,165 − 0,150)/0,165 × 100 = 9,09%.'),
          meta: meta('g10-c4', 'g12-c8')
        },
        {
          id: 'dtt6-ii4',
          content: [
            p('**Tổng hợp acetic acid từ ethanol (lên men giấm)**'),
            p('Trong công nghiệp và đời sống, acetic acid (giấm ăn) thường được điều chế từ ethanol bằng phương pháp lên men oxi hóa theo sơ đồ sau:'),
            eq('C₂H₅OH + O₂ → CH₃COOH + H₂O', 'enzyme'),
            p('Trong một thí nghiệm, tiến hành lên men 10,0 mL ethanol (khối lượng riêng D = 0,80 g/mL) thu được 7,2 gam acetic acid. Hiệu suất của quá trình lên men là h%.'),
            p('Cho biết số sóng hấp thụ đặc trưng của một số liên kết trên phổ hồng ngoại (IR) như sau:'),
            table(['Liên kết', 'O-H (alcohol)', 'O-H (carboxylic acid)', 'C=O (carboxylic acid)'], [['Số sóng (cm⁻¹)', '3200-3500 (rộng)', '2500-3300 (rất rộng)', '1700-1725']]),
            p('Các phát biểu sau đây là đúng hay sai?')
          ],
          statements: [
            { id: 'a', text: 'Giá trị của h là 69,0. (Kết quả làm tròn đến hàng phần mười).' },
            { id: 'b', text: 'Trong phản ứng trên, ethanol đóng vai trò là chất oxi hóa.' },
            { id: 'c', text: 'Trên phổ hồng ngoại của sản phẩm (acetic acid), tín hiệu (peak) ở vùng 1715 cm⁻¹ đặc trưng cho liên kết C=O.' },
            { id: 'd', text: 'Acetic acid là một acid theo thuyết Brønsted – Lowry vì phân tử có khả năng nhường proton (H⁺).' }
          ],
          answer: { a: true, b: false, c: true, d: true },
          solution: solution('a đúng: m(ethanol) = 8,0 g ⇒ 0,17391 mol ⇒ acetic acid lí thuyết 10,435 g ⇒ h = 7,2/10,435 × 100 = 69,0. b sai: ethanol bị oxi hóa nên là chất khử; O₂ là chất oxi hóa. c, d đúng.'),
          meta: meta('g11-c6', 'g11-c3')
        }
      ]
    },
    {
      part: 'III',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 6.',
      questions: [
        {
          id: 'dtt6-iii1',
          content: [
            p('Vitamin C, còn gọi là ascorbic acid có vai trò quan trọng đối với cơ thể người. Các chế phẩm từ vitamin C giúp điều trị mệt mỏi, tăng sức đề kháng cho cơ thể, giúp cơ thể mau lành vết thương. Công thức cấu tạo của vitamin C được biểu diễn ở hình sau:'),
            figure('iii1-vitamin-c.png', 456, 268, 228, 'Công thức cấu tạo của vitamin C: vòng lactone 5 cạnh gồm 4 nguyên tử C và 1 nguyên tử O, có nhóm C=O, một liên kết đôi C=C mang hai nhóm OH; nguyên tử C có H của vòng gắn với mạch nhánh CH(OH)–CH₂OH.'),
            p('Tổng số nguyên tử các nguyên tố có trong vitamin C là bao nhiêu?')
          ],
          answer: '20',
          solution: solution('Vitamin C có công thức phân tử C₆H₈O₆: 6 + 8 + 6 = 20 nguyên tử.'),
          meta: meta('g11-c3')
        },
        {
          id: 'dtt6-iii2',
          content: [
            p('Bradykinin là một nonapeptide có vai trò quan trọng trong việc điều hòa huyết áp, viêm và đau. Cấu trúc như sau:'),
            figure('iii2-bradykinin.png', 1476, 484, 700, 'Công thức khung của bradykinin, một nonapeptide gồm 9 gốc amino acid nối bởi liên kết peptide, từ đầu N (nhóm H₂N bên trái) đến đầu C (nhóm COOH bên phải): Arg – Pro – Pro – Gly – Phe – Ser – Pro – Phe – Arg.'),
            p('Nếu đánh số thứ tự amino acid đầu N là số 1 thì glycine ở vị trí số mấy?')
          ],
          answer: '4',
          solution: solution('Trình tự Arg(1)–Pro(2)–Pro(3)–Gly(4)–Phe(5)–Ser(6)–Pro(7)–Phe(8)–Arg(9); glycine (không có mạch nhánh, –NH–CH₂–CO–) ở vị trí 4.'),
          meta: meta('g12-c3')
        },
        {
          id: 'dtt6-iii3',
          content: [p('Khí đốt hoá lỏng (Liquified Petroleum Gas, viết tắt là LPG) hay còn được gọi là gas, là hỗn họp khí chủ yếu gồm X và butane (C₄H₁₀) đã được hoá lỏng. Alkane X có công thức phân tử C₃H₈. Tỉ lệ khối lượng carbon với hydrogen là x. Giá trị của x là bao nhiêu?')],
          answer: '4,5',
          solution: solution('x = (3 × 12)/(8 × 1) = 4,5.'),
          meta: meta('g11-c4')
        },
        {
          id: 'dtt6-iii4',
          content: [
            p('Khí biogas (giả thiết chỉ chứa CH₄) và khí gas (chứa 40% C₃H₈ và 60% C₄H₁₀ về thể tích) được dùng phổ biến làm nhiên liệu và đun nấu. Nhiệt lượng tỏa ra khi đốt cháy hoàn toàn 1 mol các chất như bảng sau:'),
            table(['Chất', 'CH₄', 'C₃H₈', 'C₄H₁₀'], [['Nhiệt lượng tỏa ra (kJ)', '890', '2220', '2850']]),
            p('Nếu nhu cầu về năng lượng không đổi, hiệu suất sử dụng các loại nhiên liệu như nhau, khi dùng khí biogas thay thế khí gas để làm nhiên liệu đốt cháy thì lượng khí CO₂ thải ra môi trường sẽ giảm a%. Giá trị của a là bao nhiêu? (Không làm tròn kết quả các phép tính trung gian, chỉ làm tròn kết quả cuối cùng đến hàng đơn vị).')
          ],
          answer: '19',
          solution: solution('1 mol khí gas tỏa 0,4 × 2220 + 0,6 × 2850 = 2598 kJ và tạo 0,4 × 3 + 0,6 × 4 = 3,6 mol CO₂. Với 890 kJ: biogas tạo 1 mol CO₂; khí gas tạo 3,6 × 890/2598 = 1,2333 mol CO₂. a = (1,2333 − 1)/1,2333 × 100 = 18,9 ≈ 19.'),
          meta: meta('g11-c4', 'g10-c5')
        },
        {
          id: 'dtt6-iii5',
          content: [
            p('Từ một loại quặng người ta tách ra được hợp chất vô cơ X chỉ có hai nguyên tố là Cu và S. Từ 4,8 gam X có thể tạo ra lượng tối đa là 0,96 gam S. Người ra điều chế chất rắn copper (II) sulfate pentahydrate theo sơ đồ sau:'),
            p('X —(+O₂, t°)→ CuO(s) —(+ dd H₂SO₄ loãng)→ CuSO₄(aq) —(kết tinh)→ CuSO₄.5H₂O(s)'),
            p('Từ 1,0 tấn nguyên liệu chứa 80% X về khối lượng (còn lại là tạp chất trơ) sẽ điều chế được m kg copper (II) sulfate pentahydrate. Giá trị của m là bao nhiêu? biết hiệu suất cả quá trình là 85%. (Không làm tròn kết quả các phép tính trung gian, chỉ làm tròn kết quả cuối cùng đến hàng đơn vị).')
          ],
          answer: '2125',
          solution: solution('Trong 4,8 g X: S 0,96 g (0,03 mol), Cu 3,84 g (0,06 mol) ⇒ X là Cu₂S. 800 kg Cu₂S = 5 kmol ⇒ 10 kmol CuSO₄·5H₂O = 2500 kg ⇒ với hiệu suất 85%: 2125 kg (Cu = 64).'),
          meta: meta('g12-c8')
        },
        {
          id: 'dtt6-iii6',
          content: [p('Oleum Z (H₂SO₄.nSO₃) được tạo thành khi cho 200 kg dung dịch H₂SO₄ 98% hấp thụ hoàn toàn 50 kg SO₃. Phần trăm khối lượng SO₃ trong Z là b%. Xác định giá trị của b. (Không làm tròn kết quả các phép tính trung gian, chỉ làm tròn kết quả cuối cùng đến hàng phần mười).')],
          answer: '12,9',
          solution: solution('Nước 4 kg = 2/9 kmol phản ứng với 2/9 kmol SO₃ (17,78 kg). SO₃ tự do = 50 − 17,78 = 32,22 kg trong 250 kg oleum ⇒ b = 12,89 ≈ 12,9.'),
          meta: meta('g11-c2')
        }
      ]
    }
  ]
}
