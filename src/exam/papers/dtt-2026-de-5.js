// Đề ôn thi tốt nghiệp THPT 2026 — đề số 5, bộ “50 đề ôn thi TN THPT 2026” của
// ThS. Dương Thành Tính (đề do giáo viên biên soạn, không phải đề chính thức).
// Source: owner-supplied “DE 5 ON TN.THPT 2026 - DTT.pdf” (pages 1–7 questions,
// pages 7–15 the author's key with some worked solutions). The author's contact
// details printed in the page header are deliberately not stored.
// Every key item was re-solved by ChemLab: 28/28 agree. Figures are crops of the
// PDF; solutions are written by ChemLab. Check list: docs/exam/papers/dtt-2026-de-5.md

const figure = (file, width, height, displayWidth, alt) => ({ type: 'figure', src: new URL(`./assets/dtt-2026-de-5/${file}`, import.meta.url).href, width, height, displayWidth, alt })
const p = text => ({ type: 'p', text })
const list = items => ({ type: 'list', items })
const table = (head, rows) => ({ type: 'table', head, rows })
const eq = (text, condition = '') => ({ type: 'equation', text, condition })
const options = texts => ['A', 'B', 'C', 'D'].map((id, index) => ({ id, text: texts[index] }))
const solution = text => ({ text, official: false })
const meta = (...chapters) => ({ status: 'internal', chapters })

const HYDRO = 'Phương pháp thủy luyện (hydrometallurgy) là quá trình hoàn nguyên kim loại ở nhiệt độ thường bằng dung dịch. Phương pháp này thường được dùng để thu hồi các kim loại có tính khử yếu hoặc trung bình (như Cu, Zn, Cd, Ag, Au...) từ quặng nghèo hoặc phế liệu. Quá trình thường gồm hai giai đoạn: hòa tan kim loại hoặc hợp chất của chúng vào dung dịch, sau đó dùng kim loại mạnh hơn (nhưng không tan trong nước) để đẩy kim loại cần thu hồi ra khỏi dung dịch, hoặc dùng phương pháp điện phân.'

export default {
  id: 'dtt-2026-de-5',
  title: 'Đề ôn thi tốt nghiệp THPT 2026 — đề số 5 (ThS. Dương Thành Tính) — Hóa học',
  kind: 'teacher-practice',
  blueprint: 'thpt-2025-hoa',
  license: 'owner-attested',
  dataVersion: 1,
  timeLimitMinutes: 50,
  source: {
    authority: 'ThS. Dương Thành Tính — Bộ 50 đề ôn thi TN THPT 2026',
    file: { name: 'DE 5 ON TN.THPT 2026 - DTT.pdf', sha256: '4de752a6e7b59c38da6ec931deaf130c93dc34d355b62124d233e3fd86bc4d6d' },
    originalTitle: 'Đề ôn thi TN.THPT – DTT — Đề số 5 — Môn: Hóa học'
  },
  answerKey: 'author',
  preamble: 'Cho biết nguyên tử khối: H = 1, C = 12, N = 14, O = 16, Al = 27, S = 32, K = 39; Fe = 56.',
  sections: [
    {
      part: 'I',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 18. Mỗi câu hỏi thí sinh chỉ chọn một phương án.',
      questions: [
        {
          id: 'dtt5-1',
          content: [p('Ở trạng thái cơ bản, cấu hình electron lớp ngoài cùng của nguyên tử X là 3s¹. Số hiệu nguyên tử của nguyên tố X là')],
          options: options(['11.', '12.', '13.', '14.']),
          answer: 'A',
          solution: solution('1s²2s²2p⁶3s¹ có 11 electron ⇒ Z = 11 (Na).'),
          meta: meta('g10-c1')
        },
        {
          id: 'dtt5-2',
          content: [p('Khi đun nóng nước tự nhiên, muối nào sau đây bị phân huỷ tạo thành cặn đá vôi trong phích nước, ấm đun nước?')],
          options: options(['Ca₃(PO₄)₂.', 'CaCl₂.', 'CaSO₄.', 'Ca(HCO₃)₂.']),
          answer: 'D',
          solution: solution('Ca(HCO₃)₂ → CaCO₃↓ + CO₂ + H₂O khi đun nóng; CaCO₃ là cặn đá vôi.'),
          meta: meta('g12-c7')
        },
        {
          id: 'dtt5-3',
          content: [
            p('Nhựa Z là vật liệu có giá thành thấp, khá cứng vững, không mềm dẻo như PE. Đặc biệt khả năng bị xé rách dễ dàng khi có một vết cắt hoặc một vết thủng nhỏ. Bên cạnh đó là khả năng chịu được nhiệt độ cao lên tới 100 °C. Z thuộc loại polymer nhiệt dẻo có kí hiệu là PP. Vậy Z'),
            figure('c3-nhua-pp.png', 500, 256, 250, 'Ảnh minh họa: kí hiệu tái chế số 5 với chữ PP và một số đồ dùng bằng nhựa (hộp đựng thực phẩm, cốc, nắp). Chú thích dưới ảnh: “Nhựa PP loại an toàn chịu nhiệt độ cao tốt”.'),
            p('Nhựa PP loại an toàn chịu nhiệt độ cao tốt')
          ],
          options: options(['Poly(methyl methacrylate).', 'Polystyrene.', 'Cellulose.', 'Polypropylene.']),
          answer: 'D',
          solution: solution('PP là kí hiệu của polypropylene.'),
          meta: meta('g12-c4')
        },
        {
          id: 'dtt5-4',
          content: [p('Dây điện cao thế thường được dùng làm bằng nhôm là do nhôm')],
          options: options(['Là kim loại dẫn điện tốt và nhẹ.', 'Là kim loại dẫn điện tốt nhất.', 'Có giá thành rẻ.', 'Có tính trơ về mặt hoá học.']),
          answer: 'A',
          solution: solution('Nhôm dẫn điện tốt (sau Ag, Cu, Au) và nhẹ nên giảm tải cho cột điện. Ag mới là kim loại dẫn điện tốt nhất; Al không trơ về mặt hóa học.'),
          meta: meta('g12-c6')
        },
        {
          id: 'dtt5-5',
          content: [p('Cặp nguyên tử nào sau đây **không** tạo hợp chất dạng X₂⁺Y²⁻ hoặc X²⁺Y₂⁻')],
          options: options(['Na và O', 'K và S', 'Ca và O', 'Ca và Cl']),
          answer: 'C',
          solution: solution('Na₂O, K₂S có dạng X₂Y; CaCl₂ có dạng XY₂. Ca và O tạo CaO dạng XY nên không thuộc hai dạng đã cho.'),
          meta: meta('g10-c3')
        },
        {
          id: 'dtt5-6',
          content: [
            p('Barium phản ứng với nước dễ dàng hơn so với magnesium ở điều kiện thường là do các nguyên nhân nào sau đây?'),
            list([
              '(1) Barium có tính khử mạnh hơn magnesium.',
              '(2) Độ tan của barium hydroxide trong nước cao hơn nhiều so với magnesium hydroxide.',
              '(3) Bọt khí hydrogen sinh ra bám trên bề mặt magnesium nhiều hơn, cản trở phản ứng tiếp diễn.'
            ])
          ],
          options: options(['(1).', '(1), (2) và (3).', '(1) và (3).', '(1) và (2).']),
          answer: 'D',
          solution: solution('Ba có tính khử mạnh hơn Mg (1); Ba(OH)₂ tan tốt còn Mg(OH)₂ rất ít tan, bám trên bề mặt Mg ngăn phản ứng (2). (3) không phải nguyên nhân chính.'),
          meta: meta('g12-c7')
        },
        {
          id: 'dtt5-7',
          content: [
            p('Khi cháy nhựa polyamide (PA), các khí độc như CO₂ và NH₃ được giải phóng. Biện pháp nào là cần thiết?'),
            list([
              '(a) Không cúi thấp người vì khí độc thường chìm xuống dưới.',
              '(b) Dùng mặt nạ chống khí độc để hạn chế hít NH₃.',
              '(c) Sử dụng nước để làm mát khu vực cháy.',
              '(d) Khói cháy nhựa PA độc hại hơn khói từ cháy gỗ.'
            ]),
            p('Các phát biểu đúng là:')
          ],
          options: options(['(b), (c), (d).', '(a), (b), (d).', '(a), (b), (c).', '(b), (c).']),
          answer: 'A',
          solution: solution('(a) sai: khói và khí nóng bốc lên cao nên khi thoát hiểm cần cúi thấp người. (b), (c), (d) đúng theo đáp án của tác giả. Lưu ý: CO₂ không phải khí độc theo nghĩa thông thường; khí độc nguy hiểm của đám cháy là CO, HCN, NH₃.'),
          meta: meta('g12-c4')
        },
        {
          id: 'dtt5-8',
          content: [p('Cách làm nào sau đây là đúng trong việc khử chua bằng vôi và bón phân đạm cho lúa?')],
          options: options([
            'Bón đạm và vôi cùng lúc.',
            'Bón đạm trước rồi, vài ngày sau mới bón vôi khử chua.',
            'Bón vôi khử chua trước rồi vài ngày sau mới bón đạm.',
            'Bón vôi khử chua trước rồi bón đạm ngay sau khi bón vôi.'
          ]),
          answer: 'C',
          solution: solution('Vôi phản ứng với muối ammonium giải phóng NH₃ làm mất đạm, nên bón vôi trước, vài ngày sau (khi vôi đã phản ứng hết với đất chua) mới bón đạm.'),
          meta: meta('g11-c2')
        },
        {
          id: 'dtt5-9',
          content: [
            p('Dựa vào phổ IR của hợp chất X có công thức CH₃COCH₃ dưới đây, hãy chỉ ra peak nào giúp dự đoán X có nhóm C=O?'),
            figure('c9-pho-ir.png', 1400, 752, 640, 'Phổ IR của acetone CH₃COCH₃: trục hoành là số sóng từ 4000 đến khoảng 450 cm⁻¹, trục tung là độ hấp thụ (%). Bốn peak được đánh dấu: A rất mạnh ở khoảng 1715 cm⁻¹; B ở khoảng 1360 cm⁻¹; C ở khoảng 1220 cm⁻¹; D ở khoảng 530 cm⁻¹.')
          ],
          options: options(['B', 'A', 'D', 'C']),
          answer: 'B',
          solution: solution('Liên kết C=O của ketone hấp thụ mạnh ở khoảng 1715 cm⁻¹, tức peak A — phương án B.'),
          meta: meta('g11-c3', 'g11-c6')
        },
        {
          id: 'dtt5-10',
          content: [p('Dầu mỡ (thực phẩm) để lâu bị ôi thiu là do')],
          options: options(['chất béo bị vữa ra.', 'chất béo bị thủy phân với nước trong không khí.', 'bị vi khuẩn tấn công.', 'chất béo bị oxi hóa chậm bởi oxygen không khí.']),
          answer: 'D',
          solution: solution('Liên kết đôi C=C trong gốc acid béo không no bị oxi hóa chậm bởi O₂ tạo các chất có mùi khó chịu.'),
          meta: meta('g12-c1')
        },
        {
          id: 'dtt5-11',
          content: [p('Để rửa sạch chai lọ đựng aniline, nên dùng cách nào sau đây?')],
          options: options(['Rửa bằng xà phòng.', 'Rửa bằng nước.', 'Rửa bằng dung dịch NaOH, sau đó rửa lại bằng nước.', 'Rửa bằng dung dịch HCl, sau đó rửa lại bằng nước.']),
          answer: 'D',
          solution: solution('Aniline rất ít tan trong nước nhưng phản ứng với HCl tạo C₆H₅NH₃Cl tan tốt, sau đó rửa trôi bằng nước.'),
          meta: meta('g12-c3')
        },
        {
          id: 'dtt5-12',
          content: [
            p('Polymer thiên nhiên X được sinh ra trong quá trình quang hợp của cây xanh. Ở nhiệt độ thường, X tạo với dung dịch iodine hợp chất có màu xanh tím. Polymer X là'),
            figure('c12-quang-hop.png', 420, 280, 260, 'Sơ đồ quang hợp trên một chiếc lá: ánh sáng (quang năng) chiếu vào; H₂O và CO₂ được lá hấp thụ; phương trình H₂O + CO₂ → C₆H₁₂O₆ + O₂, O₂ thoát ra; glucose chuyển thành chất X (hóa năng).')
          ],
          options: options(['tinh bột.', 'cellulose.', 'saccharose.', 'glycogen.']),
          answer: 'A',
          solution: solution('Tinh bột được tạo ra trong quá trình quang hợp và tạo màu xanh tím với iodine.'),
          meta: meta('g12-c2')
        },
        {
          id: 'dtt5-13',
          content: [
            p('Phản ứng cộng của alkene theo cơ chế cộng electrophile (A_{E}) là một trong những cơ chế phản ứng quan trọng của ngành hóa hữu cơ. Cơ chế phản ứng này giúp ta xác định được những quy luật phản ứng và giúp ta dự đoán được sản phẩm của một phản ứng.'),
            p('Phát biểu nào sau đây **sai** ?')
          ],
          options: options([
            'Carbocation là các tiểu phân trung gian bền.',
            'Phản ứng cộng của alkene với X₂ (Cl₂, Br₂), với HA (HCl, HBr,…) và với H₂O (xúc tác H⁺) xảy ra theo cơ chế cộng electrophile (A_{E}) qua hai giai đoạn chính và ưu tiên xảy ra theo hướng tạo carbocation bền hơn',
            'Phản ứng cộng HBr vào alkene bất đối xứng xảy ra theo quy tắc Markovnikov.',
            'Độ bền tương đối của carbocation thường tăng khi bậc của nguyên tử carbon mang điện tích dương tăng.'
          ]),
          answer: 'A',
          solution: solution('Carbocation là tiểu phân trung gian kém bền, tồn tại rất ngắn. B, C, D đúng.'),
          meta: meta('g11-c4')
        },
        {
          id: 'dtt5-14',
          content: [p('Vì sao dung dịch xà phòng có thể loại bỏ các vết bẩn do dầu mỡ gây ra mà nước thì không thể?')],
          options: options([
            'dung dịch xà phòng có sức căng bề mặt nhỏ hơn nước.',
            'dung dịch xà phòng có sức căng bề mặt lớn hơn nước.',
            'dung dịch xà phòng có khối lượng riêng nhỏ hơn nước.',
            'dung dịch xà phòng có khối lượng riêng lớn hơn nước.'
          ]),
          answer: 'A',
          solution: solution('Chất hoạt động bề mặt trong xà phòng làm giảm sức căng bề mặt, giúp thấm ướt và phân tán vết dầu mỡ thành các hạt nhỏ.'),
          meta: meta('g12-c1')
        },
        {
          id: 'dtt5-15',
          content: [
            p('Điểm đẳng điện (pI) là giá trị của pH mà tại đó nồng độ của ion lưỡng cực lớn nhất, nồng độ cation và anion bằng nhau. Mỗi amino acid có điểm đẳng điện khác nhau: histidine (pI = 7,64), alanine (pI = 6,11) và aspartic acid (pI = 2,98).'),
            p('Đặt hỗn hợp các amino acid: histidine, alanine và aspartic acid trong môi trường pH = 7,0 vào trong điện trường. Cho các nhận định sau:'),
            list(['(a) Histidine không di chuyển.', '(b) Alanine di chuyển về cực âm.', '(c) Aspartic acid di chuyển về phía cực dương.', '(d) Tất cả các amino acid đều không di chuyển.']),
            p('Các nhận định đúng là:')
          ],
          options: options(['(a), (b), (c).', '(a), (c).', '(b), (c), (d).', '(a), (c), (d).']),
          answer: 'B',
          solution: solution('Aspartic acid (pI 2,98 ≪ 7,0) tồn tại dạng anion, di chuyển về cực dương: (c) đúng. Alanine (pI 6,11 < 7,0) không đi về cực âm: (b) sai; (d) sai. Theo đáp án của tác giả, histidine (pI 7,64 gần 7,0) được coi là hầu như không di chuyển nên (a) đúng — đây là cách hiểu gần đúng: chính xác thì ở pH 7,0 histidine mang điện dương một phần và di chuyển chậm về cực âm.'),
          meta: meta('g12-c3')
        },
        {
          id: 'dtt5-16',
          content: [p('Trong nghiên cứu y học, dược phẩm thì vai trò nào sau đây của enzyme là **không** phù hợp?')],
          options: options([
            'Xác định hàm lượng glucose, urea.',
            'Sản xuất dược phẩm như protease làm thuốc hỗ trợ trị tắc nghẽn tim mạch, làm men tiêu hoá,...',
            'Xác định hàm lượng cholesterol trong máu, nước tiểu.',
            'Cung cấp năng lượng cho cơ thể.'
          ]),
          answer: 'D',
          solution: solution('Enzyme là chất xúc tác sinh học, không phải nguồn cung cấp năng lượng. A, B, C là các ứng dụng thực tế của enzyme.'),
          meta: meta('g12-c3')
        },
        {
          id: 'dtt5-17',
          content: [
            p('Sử dụng thông tin cho dưới đây để trả lời các câu số 17 – 18:'),
            p(HYDRO),
            p('Cho các phát biểu sau về phương pháp thủy luyện và nguyên tắc thu hồi kim loại:'),
            list([
              '(a) Cơ sở hóa học của phương pháp thủy luyện là dùng các dung dịch thích hợp (như H₂SO₄, NaOH, NaCN…) để hòa tan kim loại, sau đó khử các ion kim loại này trong dung dịch.',
              '(b) Phương pháp thủy luyện chỉ áp dụng được để điều chế các kim loại hoạt động hóa học mạnh như Na, K, Ca, Ba.',
              '(c) Trong thực tế, để thu hồi đồng (Cu) từ dung dịch CuSO₄ trong công nghiệp xử lý quặng nghèo, người ta thường dùng sắt phế liệu (Fe) vì giá thành rẻ và hiệu quả.',
              '(d) Kim loại được chọn để làm chất khử trong phương pháp thủy luyện phải có thế điện cực chuẩn nhỏ hơn thế điện cực chuẩn của kim loại cần thu hồi và không phản ứng với nước.'
            ]),
            p('Số phát biểu **đúng** là:')
          ],
          options: options(['3.', '2.', '1.', '4.']),
          answer: 'A',
          solution: solution('(a), (c), (d) đúng. (b) sai: thủy luyện dùng cho kim loại hoạt động trung bình và yếu; Na, K, Ca, Ba điều chế bằng điện phân nóng chảy. Có 3 phát biểu đúng.'),
          meta: meta('g12-c6')
        },
        {
          id: 'dtt5-18',
          content: [
            p('Sử dụng thông tin cho dưới đây để trả lời các câu số 17 – 18:'),
            p(HYDRO),
            p('Cho biết thế điện cực chuẩn của Ca²⁺/Ca và Ag⁺/Ag lần lượt là -2,866 V và +0,799 V. Khi thảo luận về phương pháp thu hồi bạc (Ag) từ dung dịch nước thải chứa phức chất bạc, một học sinh đề xuất: “Có thể sử dụng kim loại canxi (Calcium, Ca) dạng hạt thay thế cho bột kẽm (Zn) hoặc sắt (Fe) để thu hồi bạc nhanh hơn do chênh lệch thế điện cực lớn hơn”. Một số nhận định đồng tình và không đồng tình với đề xuất này được đưa ra như sau:'),
            list([
              '(1) Có thể sử dụng kim loại Ca do Ca có tính khử mạnh hơn Zn và Fe, giúp phản ứng xảy ra hoàn toàn.',
              '(2) Không thể sử dụng kim loại Ca do Ca sẽ phản ứng mãnh liệt với nước trong dung dịch thay vì khử ion bạc.',
              '(3) Có thể sử dụng kim loại Ca vì sản phẩm tạo thành là Ca(OH)₂ ít tan giúp tách bạc dễ dàng hơn.',
              '(4) Không thể sử dụng kim loại Ca do Ca có tính oxi hóa yếu hơn bạc.'
            ]),
            p('Nhận định **đúng** là:')
          ],
          options: options(['(3).', '(1).', '(2).', '(4).']),
          answer: 'C',
          solution: solution('Ca phản ứng mạnh với nước: Ca + 2H₂O → Ca(OH)₂ + H₂, bị tiêu hao và tạo môi trường kiềm làm kết tủa hợp chất của bạc thay vì thu được Ag ⇒ (2) đúng.'),
          meta: meta('g12-c6', 'g12-c7')
        }
      ]
    },
    {
      part: 'II',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 4. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.',
      questions: [
        {
          id: 'dtt5-ii1',
          content: [
            p('Một nhóm học sinh tìm hiểu quá trình tinh chế kim loại bạc (silver) bằng phương pháp điện phân từ một vòng bạc làm bằng hợp kim Ag – Cu chứa khoảng 90% bạc về khối lượng. Giả thuyết của nhóm học sinh là “khi điện phân, chỉ có tạp chất trong vòng bạc tan hết vào trong dung dịch, còn lại sẽ là bạc tinh khiết”. Để kiểm tra giả thuyết này, nhóm học sinh đã thực hiện thí nghiệm như sau:'),
            list([
              'Cân để xác định khối lượng ban đầu của vòng bạc (5,15 gam) và thanh bạc tinh khiết (5,50 gam).',
              'Nối vòng bạc với một điện cực và thanh bạc tinh khiết với điện cực còn lại của nguồn điện một chiều, rồi nhúng vào bình điện phân chứa dung dịch silver nitrate (AgNO₃).',
              'Điện phân ở hiệu điện thế phù hợp.',
              'Sau một thời gian điện phân, làm khô, rồi cân để xác định lại khối lượng của vòng bạc và thanh bạc tinh khiết, thấy khối lượng vòng bạc là 3,85 gam và khối lượng thanh bạc là m₁ gam.'
            ])
          ],
          statements: [
            { id: 'a', text: 'Trong thí nghiệm trên, vòng bạc được nối với cực dương, thanh bạc tinh khiết được nối với cực âm của nguồn điện.' },
            { id: 'b', text: 'Giá trị của m₁ lớn hơn 5,50.' },
            { id: 'c', text: 'Ở cực dương xảy ra quá trình oxi hóa.' },
            { id: 'd', text: 'Do khối lượng của vòng bạc giảm, nên giả thuyết ban đầu của nhóm học sinh là đúng.' }
          ],
          answer: { a: true, b: true, c: true, d: false },
          solution: solution('a đúng: kim loại cần tinh chế làm anode (cực dương), bạc tinh khiết làm cathode. b đúng: Ag⁺ bị khử bám lên thanh bạc tinh khiết. c đúng: ở anode Ag, Cu bị oxi hóa. d sai: khối lượng vòng giảm 1,30 g, lớn hơn lượng tạp chất (khoảng 0,52 g) nên cả bạc cũng tan; giảm khối lượng không chứng minh chỉ tạp chất tan.'),
          meta: meta('g12-c5')
        },
        {
          id: 'dtt5-ii2',
          content: [
            p('Enzyme pectinase là một protein có khả năng xúc tác cho phản ứng thủy phân pectin. Hoạt tính xúc tác của enzyme càng cao thì phản ứng thủy phân pectin diễn ra càng nhanh. Hoạt tính xúc tác của enzyme phụ thuộc vào các yếu tố như nhiệt độ, pH,... Một nhóm học sinh dự đoán “pH càng giảm thì hoạt tính xúc tác của enzyme pectinase càng tăng”. Từ đó, học sinh tiến hành thí nghiệm ở nhiệt độ không đổi nhưng thay đổi pH của môi trường để kiểm tra dự đoán trên như sau:'),
            p('Bước 1: Lấy 2 mL C₂H₅OH 96% vào ống nghiệm (1).'),
            p('Bước 2: Thêm 2,0 mL dung dịch một loại enzyme pectinase vào một ống nghiệm (2) chứa 5,0 mL dung dịch có vai trò duy trì ổn định pH bằng 3.'),
            p('Bước 3: Thêm tiếp 2,0 mL dung dịch pectin vào ống nghiệm (2), lắc đều'),
            p('Bước 4: Sau khoảng mỗi 10 giây, dùng ống hút lấy 1-2 giọt hỗn hợp phản ứng trong ống nghiệm (2) và cho vào ống nghiệm (1), quan sát để từ đó xác định thời gian pectin thủy phân hết.'),
            p('Lặp lại thí nghiệm theo ba bước trên, chỉ thay đổi pH dung dịch trong Buớc 2 lần lượt là 4 ; 5; 6; 7'),
            p('Nhóm học sinh ghi lại kết quả thời gian t (giây) mà pectin thủy phân hết trong môi trường pH = 4; 5; 6; 7. Kết quả thí nghiệm được ghi lại trong bảng sau:'),
            table(['pH', '3', '4', '5', '6', '7'], [['Thời gian thủy phân (giây)', '40', '60', '80', '100', '120']]),
            p('Kết quả được biểu diễn bằng đồ thị sau:'),
            figure('ii2-do-thi.png', 1112, 644, 480, 'Đồ thị đường gấp khúc: trục hoành là môi trường pH = 3, 4, 5, 6, 7; trục tung là thời gian (giây). Các giá trị lần lượt 40, 60, 80, 100, 120 giây, tăng đều theo pH.')
          ],
          statements: [
            { id: 'a', text: 'Theo số liệu thu được, phản ứng thủy phân pectin ở pH = 3 diễn ra nhanh hơn ở pH = 4.' },
            { id: 'b', text: 'Ở các giá trị pH nghiên cứu, hoạt tính xúc tác của enzyme pectinase cao nhất tại pH = 3.' },
            { id: 'c', text: 'Dự đoán ban đầu của nhóm học sinh là đúng.' },
            { id: 'd', text: 'Từ kết quả thí nghiệm, kết luận được hoạt tính xúc tác của enzyme pectinase tăng khi pH tăng.' }
          ],
          answer: { a: true, b: true, c: true, d: false },
          solution: solution('Thời gian thủy phân càng ngắn thì hoạt tính càng cao. pH 3: 40 s < pH 4: 60 s ⇒ a, b đúng. Thời gian tăng đều khi pH tăng, tức hoạt tính tăng khi pH giảm (trong khoảng 3–7) ⇒ c đúng, d sai.'),
          meta: meta('g12-c3', 'g10-c6')
        },
        {
          id: 'dtt5-ii3',
          content: [
            p('Butyl propionate thường được sử dụng làm dung môi trong các công thức sơn và mực in. Nó giúp tăng cường độ nhớt, độ nhớt và thời gian khô của sản phẩm, đồng thời cải thiện độ pha trộn.'),
            p('Một học sinh tiến hành tổng hợp Butyl propionate từ propionic acid và butan-1-ol: theo phương trình hóa học sau:'),
            eq('CH₃CH₂COOH + CH₃CH₂CH₂CH₂OH ⇌ CH₃CH₂COOCH₂CH₂CH₂CH₃ + H₂O', 'H₂SO₄, t°'),
            p('Sau thí nghiệm, tiến hành phân tách sản phẩm. Ghi phổ hồng ngoại của propionic acid, butan-1- ol và Butyl propionate. Cho biết số sóng hấp thụ đặc trưng của một số liên kết trên phổ hồng ngoại như sau:'),
            table(['Liên kết', 'O-H (alcohol)', 'O-H (carboxylic acid)', 'C=O (ester )', 'C=O (carboxylic acid)'], [['Số sóng (cm⁻¹)', '3650 – 3200', '3300 – 2500', '1750 – 1735', '1725 – 1700']])
          ],
          statements: [
            { id: 'a', text: 'Đây là phản ứng ester hóa tạo carboxylic acid.' },
            { id: 'b', text: 'Phổ có số sóng 3280 cm⁻¹ và 1710 cm⁻¹ là phổ của propionic acid.' },
            { id: 'c', text: 'Dải hấp thụ tại 1740 cm⁻¹ và không có vùng O–H là của butyl propionate.' },
            { id: 'd', text: 'Dựa vào phổ hồng ngoại, không thể phân biệt được acid, alcohol và ester.' }
          ],
          answer: { a: false, b: true, c: true, d: false },
          solution: solution('a sai: phản ứng ester hóa tạo ester. b đúng: O–H của acid (3300–2500) và C=O của acid (1725–1700). c đúng: C=O ester ở 1740 cm⁻¹, không có O–H. d sai: ba chất có tín hiệu khác nhau nên phân biệt được.'),
          meta: meta('g12-c1', 'g11-c3')
        },
        {
          id: 'dtt5-ii4',
          content: [p('Muối CuSO₄ khan có màu trắng. Hòa tan một lượng muối này vào nước, thu được dung dịch màu xanh (có chứa phức chất X). Nhỏ từ từ dung dịch NH₃ vào X thì thu được kết tủa màu xanh nhạt (có phức chất Y). Tiếp tục nhỏ dung dịch NH₃ vào phức chất Y thì thu được dung dịch màu xanh lam (có phức chất Z).')],
          statements: [
            { id: 'a', text: 'Phức chất X có chứa [Cu(H₂O)₆]²⁺ có màu xanh.' },
            { id: 'b', text: 'Phức chất Y có chứa [Cu(OH)₂(H₂O)₄] là dung dịch xanh nhạt.' },
            { id: 'c', text: 'Phức chất Z có chứa [Cu(NH₃)₄(H₂O)₂]²⁺ là dung dịch xanh lam.' },
            { id: 'd', text: 'Nguyên tử trung tâm trong các phức chất X, Y, Z là O.' }
          ],
          answer: { a: true, b: false, c: true, d: false },
          solution: solution('a đúng. b sai: [Cu(OH)₂(H₂O)₄] là kết tủa xanh nhạt, không phải dung dịch. c đúng. d sai: nguyên tử trung tâm là Cu.'),
          meta: meta('g12-c8')
        }
      ]
    },
    {
      part: 'III',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 6.',
      questions: [
        {
          id: 'dtt5-iii1',
          content: [
            p('Từ 20 tấn quặng hematite chứa 80% Fe₂O₃ thì sản xuất được một lượng gang chứa 96% Fe để sản xuất ra x cặp nồi gang nặng 3,2kg? Biết rằng hiệu suất quá trình sản xuất là 99%. Xác định giá trị của x?'),
            figure('iii1-noi-gang.png', 368, 404, 180, 'Ảnh một chiếc nồi gang có nắp đặt trên chiếc cân đồng hồ.'),
            p('(Kết quả các phép tính trung gian không được làm tròn, chỉ kết quả cuối cùng được làm tròn đến hàng đơn vị).')
          ],
          answer: '3609',
          solution: solution('m(Fe₂O₃) = 16 tấn ⇒ m(Fe) = 16 × 112/160 × 0,99 = 11,088 tấn ⇒ m(gang) = 11,088/0,96 = 11,55 tấn = 11 550 kg ⇒ x = 11 550/3,2 = 3609,4 ≈ 3609.'),
          meta: meta('g12-c6')
        },
        {
          id: 'dtt5-iii2',
          content: [p('Một loại dầu được đun với NaOH tạo ra muối sodium stearate (C₁₇H₃₅COONa). Tính phân tử khối của sodium stearate.')],
          answer: '306',
          solution: solution('C₁₈H₃₅O₂Na: 18 × 12 + 35 + 32 + 23 = 306 (Na = 23).'),
          meta: meta('g12-c1')
        },
        {
          id: 'dtt5-iii3',
          content: [
            p('Cho phương trình hóa học của các phản ứng được đánh số thứ tự từ 1 tới 4 dưới đây:'),
            eq('(1) C₁₂H₂₂O₁₁ (saccharose) + H₂O → C₆H₁₂O₆ (glucose) + C₆H₁₂O₆ (fructose)', 'H⁺, t°'),
            eq('(2) [C₆H₇O₂(OH)₃]ₙ + 3nHNO₃ → [C₆H₇O₂(ONO₂)₃]ₙ (cellulose trinitrate) + 3nH₂O', 'H₂SO₄ đặc, t°'),
            eq('(3) CH₂OH-[CHOH]₄-CHO + 2[Ag(NH₃)₂]OH → CH₂OH-[CHOH]₄-COONH₄ + 2Ag + 3NH₃ + H₂O', 't°'),
            eq('(4) 2C₆H₁₂O₆ + Cu(OH)₂ → (C₆H₁₁O₆)₂Cu + 2H₂O'),
            p('Gán số thứ tự các phương trình theo tên gọi tên gọi: tráng gương, cellulose phản ứng với nitric acid, thủy phân saccharose và glucose (fructose) hòa tan Cu(OH)₂ tạo dung dịch xanh lam ở nhiệt độ thường')
          ],
          answer: '3214',
          solution: solution('Tráng gương: (3); cellulose + nitric acid: (2); thủy phân saccharose: (1); glucose hòa tan Cu(OH)₂: (4) ⇒ 3214.'),
          meta: meta('g12-c2')
        },
        {
          id: 'dtt5-iii4',
          content: [p('Có bao nhiêu đồng phân arylamine ứng với công thức phân tử C₇H₉N?')],
          answer: '4',
          solution: solution('Arylamine có N gắn trực tiếp vào vòng benzene: o-, m-, p-toluidine (CH₃C₆H₄NH₂) và N-methylaniline (C₆H₅NHCH₃) ⇒ 4. Benzylamine C₆H₅CH₂NH₂ không phải arylamine.'),
          meta: meta('g12-c3')
        },
        {
          id: 'dtt5-iii5',
          content: [
            p('Trong quá trình sản xuất nitric acid (HNO₃), người ta sử dụng phản ứng oxi hóa ammonia (NH₃) bằng oxygen (O₂) theo phương trình sau:'),
            eq('4NH₃(g) + 5O₂(g) → 4NO(g) + 6H₂O(g) (1)'),
            p('Phản ứng (1) là phản ứng tỏa nhiệt. Để tận dụng nhiệt lượng tỏa ra từ phản ứng (1), người ta dùng nó để đun nóng nước theo phương trình sau:'),
            eq('H₂O(l) → H₂O(g) (2)'),
            p('Xét các phản ứng ở điều kiện chuẩn và hiệu suất chuyển hóa của ammonia là 100%. Tính khối lượng ammonia (theo tấn, làm tròn đến hàng phần trăm) cần thiết để đun sôi 2,00 tấn nước. Biết 20% lượng nhiệt tỏa ra từ phản ứng (1) được sử dụng để đun sôi nước và các giá trị nhiệt tạo thành (Δ_{f}H°_{298}) của các chất ở điều kiện chuẩn được cho trong bảng sau:'),
            table(['Chất', 'NH₃(g)', 'NO(g)', 'H₂O(g)', 'H₂O(l)'], [['Δ_{f}H°_{298} (kJ mol⁻¹)', '-45,9', '90,3', '-241,8', '-285,8']]),
            p('(Kết quả các phép tính trung gian không được làm tròn, chỉ kết quả cuối cùng được làm tròn đến hàng phần trăm).')
          ],
          answer: '1,83',
          solution: solution('Δ_rH(1) = 4(90,3) + 6(−241,8) − 4(−45,9) = −906,0 kJ; Δ_rH(2) = −241,8 − (−285,8) = 44,0 kJ/mol. Xem tấn như gam: nhiệt cần = 2/18 × 44 = 4,889 kJ ⇒ nhiệt phản ứng (1) phải tỏa = 24,444 kJ ⇒ n(NH₃) = 24,444 × 4/906 = 0,10792 ⇒ m = 1,835 ≈ 1,83 tấn.'),
          meta: meta('g10-c5', 'g11-c2')
        },
        {
          id: 'dtt5-iii6',
          content: [
            p('Trong y học, oxalic acid (H₂C₂O₄) được sử dụng để điều trị một số bệnh về da. Tuy nhiên, việc sử dụng quá liều oxalic acid có thể gây ngộ độc. Để kiểm soát chất lượng của dung dịch oxalic acid, người ta thường sử dụng phương pháp chuẩn độ bằng dung dịch KMnO₄.'),
            p('Một dung dịch H₂C₂O₄ được lấy ra 10,00 mL và pha loãng thành 250,0 mL dung dịch. Lấy 25,00 mL dung dịch này cho vào bình nón, thêm H₂SO₄ loãng dư rồi chuẩn độ bằng dung dịch KMnO₄ 0,0200M. Thể tích trung bình của dung dịch KMnO₄ tiêu tốn sau 3 lần chuẩn độ là 15,60 mL.'),
            p('Tính nồng độ mol của dung dịch H₂C₂O₄ ban đầu. (Kết quả các phép tính trung gian không được làm tròn, chỉ kết quả cuối cùng được làm tròn đến hàng phần trăm).')
          ],
          answer: '0,78',
          solution: solution('2KMnO₄ + 5H₂C₂O₄ + 3H₂SO₄ → K₂SO₄ + 2MnSO₄ + 10CO₂ + 8H₂O. n(KMnO₄) = 3,12 × 10⁻⁴ mol ⇒ n(H₂C₂O₄) trong 25 mL = 7,8 × 10⁻⁴ ⇒ trong 250 mL (tức 10 mL ban đầu) = 7,8 × 10⁻³ mol ⇒ C = 0,78 M.'),
          meta: meta('g10-c4')
        }
      ]
    }
  ]
}
