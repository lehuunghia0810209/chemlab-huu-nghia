// Đề thi tốt nghiệp THPT năm 2026 — Hóa học (Bộ GD&ĐT, đề thi chính thức), mã đề 0330.
// The Ministry publishes answer keys only. Question text comes from an
// owner-supplied Word file of mã đề 0330 (retyped; formulas as MathType
// objects); the key was checked item by item against the Ministry's official
// key “4. Đáp án Hóa học.pdf” (moet.gov.vn, 19/06/2026), 28/28 identical.
// Figures are taken from that file; solutions are written by ChemLab.
// Per-question check list: docs/exam/papers/tot-nghiep-2026-hoa.md

const figure = (file, width, height, displayWidth, alt) => ({ type: 'figure', src: new URL(`./assets/tot-nghiep-2026-hoa/${file}`, import.meta.url).href, width, height, displayWidth, alt })
const p = text => ({ type: 'p', text })
const list = items => ({ type: 'list', items })
const table = (head, rows) => ({ type: 'table', head, rows })
const eq = (text, condition = '') => ({ type: 'equation', text, condition })
const options = texts => ['A', 'B', 'C', 'D'].map((id, index) => ({ id, text: texts[index] }))
const solution = text => ({ text, official: false })
const meta = (...chapters) => ({ status: 'internal', chapters })

const ALUM = [
  p('Sử dụng thông tin tin cho dưới đây để trả lời các câu số 7 – 8: Phèn nhôm – kali có công thức hoá học là K₂SO₄·Al₂(SO₄)₃·24H₂O, được sử dụng phổ biến để làm giảm độ đục (làm trong nước đục) trong quá trình xử lí nước phục vụ sinh hoạt. Ứng dụng này dựa trên sự thuỷ phân của ion Al³⁺(aq) tạo ra Al(OH)₃(s) theo phương trình sau:'),
  eq('Al³⁺(aq) + 3H₂O(l) ⇌ Al(OH)₃(s) + 3H⁺(aq)'),
  p('Kết tủa Al(OH)₃ tạo thành dưới dạng keo, hấp phụ các hạt lơ lửng và lắng xuống đáy. Phèn nhôm – kali làm giảm độ đục hiệu quả đối với nước có pH khoảng 6,5 – 7,5. Trong nhiều trường hợp, pH của nước chỉ khoảng 5,0 nên trước khi xử lí nước bằng phèn nhôm – kali, cần điều chỉnh chỉnh pH phù hợp.')
]

export default {
  id: 'tot-nghiep-2026-hoa',
  title: 'Đề thi tốt nghiệp THPT năm 2026 — Hóa học (mã đề 0330)',
  kind: 'official-exam',
  blueprint: 'thpt-2025-hoa',
  license: 'owner-attested',
  dataVersion: 1,
  timeLimitMinutes: 50,
  variant: '0330',
  source: {
    authority: 'Bộ GD&ĐT — Kỳ thi tốt nghiệp THPT năm 2026',
    url: 'https://moet.gov.vn/tin-tuc/tin-tong-hop2/cong-bo-dap-an-cac-mon-thi-cua-ky-thi-tot-nghiep-thpt-2026.html',
    file: { name: '1-đề Hóa TNTHPT năm 2026-mã 0330.docx', sha256: '2b61f913a06b97bbd70a4393d3c6926f3a67bb3c0251cba112b818b4502c1718' },
    originalTitle: 'Kỳ thi tốt nghiệp trung học phổ thông năm 2026 — Đề thi chính thức — Môn thi: Hoá học — Mã đề 0330',
    publishedAt: '2026-06'
  },
  answerKey: 'official',
  editorialNote: 'Đề được số hóa từ bản đánh máy lại mã đề 0330 do chủ dự án cung cấp (Bộ GD&ĐT chỉ công bố đáp án, không công bố văn bản đề); đáp án đối chiếu với đáp án chính thức của Bộ. Chưa đối chiếu được với bản in gốc.',
  preamble: 'Cho biết nguyên tử khối: H = 1; C = 12; N = 14; O = 16; Na = 23; Al = 27; Si = 28; S = 32; Cl = 35,5; Ca = 40; Fe = 56. Các kí hiệu và chữ viết tắt: s: rắn; l: lỏng; g: khí; aq: dung dịch nước; xt: xúc tác; p: áp suất.',
  sections: [
    {
      part: 'I',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 18. Mỗi câu hỏi thí sinh chỉ chọn một phương án.',
      questions: [
        {
          id: 'tn26-1',
          content: [p('Nhôm (aluminium, Al) và natri (sodium, Na) đều là kim loại có tính khử mạnh. Tuy nhiên, các vật dụng làm bằng nhôm để được trong không khí do có lớp màng oxide bền vững bảo vệ. Trong khi đó, kim loại natri thường được bảo quản bằng cách ngâm trong dầu hỏa khan mà không để ngoài không khí. Giải thích nào sau đây phù hợp với cơ sở hoá học của phương pháp bảo quản natri?')],
          options: options([
            'Kim loại natri và oxide của nó dễ bị chuyển hoá trong không khí nhưng natri bền khi bảo quản trong dầu hoả khan.',
            'Kim loại natri không tạo được oxide khi để ngoài không khí nhưng tạo được oxide khi bảo quản trong dầu hoả khan.',
            'Kim loại natri dễ bị bay hơi khi để ngoài không khí nhưng không bị bay hơi khi bảo quản trong dầu hoả khan.',
            'Kim loại natri không bị nóng chảy khi để ngoài không khí nhưng nóng chảy khi bảo quản trong dầu hoả khan.'
          ]),
          answer: 'A',
          solution: solution('Na phản ứng nhanh với O₂, hơi nước; Na₂O tiếp tục hút ẩm, CO₂ nên không tạo được màng bảo vệ như Al₂O₃. Dầu hỏa khan không chứa nước, O₂ hòa tan rất ít nên ngăn Na tiếp xúc với không khí.'),
          meta: meta('g12-c7')
        },
        {
          id: 'tn26-2',
          content: [p('Xu hướng biến đổi tính chất của các nguyên tố và đơn chất, cũng như thành phần và tính chất của các hợp chất tạo nên từ các nguyên tố đó được nêu trong')],
          options: options(['phương pháp Solvay.', 'định luật tuần hoàn các nguyên tố hoá học.', 'nguyên lí chuyển dịch cân bằng.', 'quy tắc Zaitsev.']),
          answer: 'B',
          solution: solution('Định luật tuần hoàn: tính chất của các nguyên tố, đơn chất, thành phần và tính chất của hợp chất biến đổi tuần hoàn theo chiều tăng điện tích hạt nhân.'),
          meta: meta('g10-c2')
        },
        {
          id: 'tn26-3',
          content: [p('Các đồng vị của một nguyên tố hoá học là những nguyên tử có cùng số proton nhưng khác nhau ...(1).... Nội dung phù hợp trong chỗ trống (1) là')],
          options: options(['số neutron.', 'điện tích hạt nhân.', 'số hiệu nguyên tử.', 'số electron.']),
          answer: 'A',
          solution: solution('Đồng vị: cùng số proton, khác số neutron (nên khác số khối).'),
          meta: meta('g10-c1')
        },
        {
          id: 'tn26-4',
          content: [p('Phản ứng với thuốc thử Tollens (phản ứng tráng bạc) thể hiện tính chất của nhóm chức nào trong phân tử ethanal?')],
          options: options(['–CHO.', '–COOH.', '–OH.', '–CH₃.']),
          answer: 'A',
          solution: solution('Nhóm aldehyde –CHO bị oxi hóa bởi thuốc thử Tollens tạo kết tủa bạc.'),
          meta: meta('g11-c6')
        },
        {
          id: 'tn26-5',
          content: [
            p('Hình bên minh họa một số dụng cụ thí nghiệm với kí hiệu tương ứng. Ki hiệu nào ứng với dụng cụ bình cầu?'),
            figure('c5-dung-cu.png', 344, 245, 300, 'Bốn dụng cụ thí nghiệm: (I) bình có thân hình cầu và cổ hẹp; (II) phễu chiết hình quả lê có nút và khóa; (III) bình nón (bình tam giác); (IV) cốc thủy tinh có mỏ rót.')
          ],
          options: options(['(I).', '(II).', '(III).', '(IV).']),
          answer: 'A',
          solution: solution('Bình cầu có thân hình cầu, cổ hẹp: dụng cụ (I). (II) là phễu chiết, (III) là bình tam giác, (IV) là cốc thủy tinh.'),
          meta: meta('g11-c3')
        },
        {
          id: 'tn26-6',
          content: [p('Công thức cấu tạo thu gọn nào sau đây là của butane?')],
          options: options(['CH₃–CH₂–CH₃.', 'CH₃–CH₂–CH₂–CH₃.', 'CH₃–CH₂–CH=CH₂.', 'CH₃–CH₂–CH₂–CHO.']),
          answer: 'B',
          solution: solution('Butane là alkane mạch không phân nhánh 4 carbon: CH₃–CH₂–CH₂–CH₃. A là propane, C là but-1-ene, D là butanal.'),
          meta: meta('g11-c4')
        },
        {
          id: 'tn26-7',
          content: [
            ...ALUM,
            p('Khi thảo luận về hoá chất phù hợp để làm tăng pH của nước từ 5,0 lên khoảng 6,5 – 7,5, một số đề xuất kèm theo lí do được đưa ra như sau:'),
            list([
              '(1) Có thể sử dụng Ca(OH)₂ vì Ca(OH)₂ là base, phản ứng với ion H⁺(aq).',
              '(2) Có thể sử dụng NaCl vì dung dịch NaCl có pH = 7 nằm trong khoảng pH phù hợp với phèn nhôm – kali.',
              '(3) Có thể sử dụng NH₄Cl vì ion NH₄⁺(aq) thuỷ phân tạo ra môi trường base làm tăng pH.',
              '(4) Có thể sử dụng Fe₂(SO₄)₃ vì ion Fe³⁺(aq) thuỷ phân tạo ra Fe(OH)₃ làm tăng pH.'
            ]),
            p('Đề xuất kèm theo lí do hợp lí là')
          ],
          options: options(['đề xuất (1).', 'đề xuất (2).', 'đề xuất (3).', 'đề xuất (4).']),
          answer: 'A',
          solution: solution('Ca(OH)₂ trung hòa H⁺ nên làm tăng pH: (1) hợp lí. NaCl không làm thay đổi pH; NH₄⁺ và Fe³⁺ thủy phân tạo H⁺ nên làm giảm pH.'),
          meta: meta('g11-c1', 'g12-c7')
        },
        {
          id: 'tn26-8',
          content: [
            ...ALUM,
            p('Ở 25 °C, một mẫu nước (mẫu X) có pH = 6,5. Để làm giảm độ đục của X, người ta cho vào X một lượng phèn nhôm – kali. Cho các phát biểu sau:'),
            list([
              '(a) Mẫu X có môi trường acid.',
              '(b) Sự có mặt của các ion K⁺ và Al³⁺ làm cho nước có tính cứng toàn phần.',
              '(c) Nếu thêm acid mạnh vào mẫu X thì hiệu quả làm trong nước đục của phèn nhôm – kali tăng lên.',
              '(d) Sau khi xử lí mẫu X bằng phèn nhôm – kali, nước thu được có pH = 7,5.'
            ]),
            p('Số phát biểu đúng là')
          ],
          options: options(['2.', '4.', '1.', '3.']),
          answer: 'C',
          solution: solution('(a) đúng: pH 6,5 < 7 ở 25 °C. (b) sai: tính cứng do Ca²⁺, Mg²⁺. (c) sai: acid làm cân bằng thủy phân chuyển dịch theo chiều nghịch, ít Al(OH)₃ hơn. (d) sai: thủy phân Al³⁺ sinh H⁺ nên pH giảm. Có 1 phát biểu đúng.'),
          meta: meta('g11-c1', 'g12-c7')
        },
        {
          id: 'tn26-9',
          content: [p('Phát biểu nào sau đây **không** đúng về protein?')],
          options: options([
            'Protein đơn giản tạo nên từ các gốc β– hoặc γ–amino acid.',
            'Trong thành phần protein luôn có nguyên tố nitrogen.',
            'Protein bị thủy phân bởi acid hoặc base.',
            'Protein trong lòng trắng trứng có phản ứng màu biuret.'
          ]),
          answer: 'A',
          solution: solution('Protein đơn giản được tạo từ các gốc α-amino acid, không phải β- hay γ-amino acid. B, C, D đúng.'),
          meta: meta('g12-c3')
        },
        {
          id: 'tn26-10',
          content: [p('Polypropylene được điều chế bằng phản ứng trùng hợp chất nào sau đây?')],
          options: options(['CH₃–CH₂–Cl.', 'CH₂=CH₂.', 'CH₂=CH–Cl.', 'CH₂=CH–CH₃.']),
          answer: 'D',
          solution: solution('Polypropylene là sản phẩm trùng hợp propylene CH₂=CH–CH₃.'),
          meta: meta('g12-c4')
        },
        {
          id: 'tn26-11',
          content: [p('Amine nào sau đây là amine bậc hai?')],
          options: options(['(CH₃)₃N.', 'CH₃NH₂.', 'CH₃NHCH₃.', 'C₆H₅NH₂.']),
          answer: 'C',
          solution: solution('Amine bậc hai có nguyên tử N liên kết với hai gốc hydrocarbon: CH₃NHCH₃. (CH₃)₃N bậc ba; CH₃NH₂, C₆H₅NH₂ bậc một.'),
          meta: meta('g12-c3')
        },
        {
          id: 'tn26-12',
          content: [
            p('Dụng cụ nào cần bổ sung vào hệ được mô tả như sơ đồ ở hình bên để tạo thành pin Galvani hoạt động?'),
            figure('c12-pin.png', 306, 305, 260, 'Hai cốc: thanh Zn nhúng trong dung dịch ZnSO₄ 1,0 M và thanh Cu nhúng trong dung dịch CuSO₄ 1,0 M; hai thanh nối với nhau bằng dây dẫn điện qua một bóng đèn. Giữa hai cốc không có gì nối hai dung dịch.')
          ],
          options: options(['Nhiệt kế.', 'Ampe kế.', 'Vôn kế.', 'Cầu muối.']),
          answer: 'D',
          solution: solution('Mạch ngoài đã có dây dẫn và bóng đèn; cần cầu muối nối hai dung dịch để khép kín mạch và giữ trung hòa điện tích.'),
          meta: meta('g12-c5')
        },
        {
          id: 'tn26-13',
          content: [p('Công thức hoá học của iron(II) sulfate là')],
          options: options(['FeSO₄.', 'Fe₂(SO₄)₃.', 'FeS₂.', 'FeS.']),
          answer: 'A',
          solution: solution('Iron(II) sulfate gồm Fe²⁺ và SO₄²⁻: FeSO₄.'),
          meta: meta('g12-c8')
        },
        {
          id: 'tn26-14',
          content: [p('Điện phân nóng chảy NaCl với các điện cực trơ để sản xuất kim loại natri (sodium, Na). Quá trình nào sau đây xảy ra ở cathode (cực âm) của bể điện phân?')],
          options: options(['2H₂O → O₂ + 4H⁺ + 4e.', '2Cl⁻ → Cl₂ + 2e.', '2H₂O + 2e → H₂ + 2OH⁻.', 'Na⁺ + 1e → Na.']),
          answer: 'D',
          solution: solution('Điện phân nóng chảy không có nước; ở cathode ion Na⁺ bị khử thành Na, ở anode Cl⁻ bị oxi hóa thành Cl₂.'),
          meta: meta('g12-c5', 'g12-c7')
        },
        {
          id: 'tn26-15',
          content: [p('Ăn mòn kim loại là quá trình phá hủy kim loại hoặc hợp kim do tác dụng với các chất trong môi trường, trong đó kim loại đóng vai trò là')],
          options: options(['base.', 'chất oxi hoá.', 'chất khử.', 'chất điện li.']),
          answer: 'C',
          solution: solution('Khi bị ăn mòn, kim loại nhường electron (bị oxi hóa) nên đóng vai trò chất khử.'),
          meta: meta('g12-c6')
        },
        {
          id: 'tn26-16',
          content: [
            p('Cho công thức cấu tạo và kí hiệu của bốn amino acid sau:'),
            table(['Kí hiệu', 'Công thức cấu tạo'], [
              ['Gly', 'H₂N–CH₂–COOH'],
              ['Glu', 'HOOC–CH₂–CH₂–CH(NH₂)–COOH'],
              ['Lys', 'H₂N–[CH₂]₄–CH(NH₂)–COOH'],
              ['Ala', 'CH₃–CH(NH₂)–COOH']
            ]),
            p('Công thức cấu tạo của amino acid nào biểu diễn nhiều nhóm carboxyl nhất?')
          ],
          options: options(['Glu.', 'Lys.', 'Ala.', 'Gly.']),
          answer: 'A',
          solution: solution('Glu có hai nhóm –COOH; Gly, Lys, Ala mỗi chất có một nhóm –COOH.'),
          meta: meta('g12-c3')
        },
        {
          id: 'tn26-17',
          content: [p('Kim loại nào sau đây **không tan** trong dung dịch HCl 0,10 M?')],
          options: options(['Zn.', 'Al.', 'Au.', 'Mg.']),
          answer: 'C',
          solution: solution('Au có thế điện cực chuẩn lớn hơn của H⁺/H₂ nên không khử được H⁺; Zn, Al, Mg đều tan giải phóng H₂.'),
          meta: meta('g12-c6')
        },
        {
          id: 'tn26-18',
          content: [
            p('Khi nghiên cứu về phản ứng điều chế ethyl acetate từ cồn 96° và acetic acid với sự có mặt của dung dịch H₂SO₄ đặc, một nhóm học sinh muốn khảo sát ảnh hưởng của nhiệt độ đến khối lượng ester thu được sau cùng một thời gian phản ứng. Nhóm học sinh dự định thực hiện ba thí nghiệm lần lượt ở ba nhiệt độ 50 °C; 60 °C và 70 °C.'),
            p('Khi xây dựng kế hoạch thí nghiệm, nhóm thảo luận về một số yếu tố sau:'),
            list([
              '(1) Thời gian tiến hành phản ứng.',
              '(2) Nồng độ, thể tích ban đầu của các chất phản ứng và dung dịch H₂SO₄ đặc.',
              '(3) Màu sắc của hỗn hợp trong quá trình phản ứng.',
              '(4) Nhiệt độ tiến hành phản ứng.'
            ]),
            p('Những yếu tố nào trong số các yếu tố ở trên cần được thiết lập giống nhau ở cả ba thí nghiệm?')
          ],
          options: options(['(1), (2).', '(2), (3).', '(1), (4).', '(3), (4).']),
          answer: 'A',
          solution: solution('Nhiệt độ là biến khảo sát nên phải khác nhau; các biến cần giữ cố định là thời gian (1) và nồng độ, thể tích chất phản ứng, xúc tác (2). Màu sắc là hiện tượng quan sát, không phải yếu tố thiết lập.'),
          meta: meta('g12-c1', 'g10-c6')
        }
      ]
    },
    {
      part: 'II',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 4. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.',
      questions: [
        {
          id: 'tn26-ii1',
          content: [
            p('Các thuốc kháng acid có tác dụng làm giảm lượng acid dư trong dạ dày. Bạn Việt muốn so sánh lượng acid HCl tối đa mà một số thuốc kháng acid (chứa hoạt chất khác nhau) có thể làm giảm được. Việt sử dụng hai mẫu thuốc dạng viên nén màu trắng: viên thuốc **A** (chứa hoạt chất là CaCO₃) và viên thuốc **B** (chứa hoạt chất là NaHCO₃). Coi các thành phần còn lại trong thuốc **A** và thuốc **B** không phản ứng với dung dịch HCl và dung dịch NaOH. Dựa vào hiểu biết hoá học, Việt đề xuất giả thuyết: “Lượng acid HCl tối đa giảm được bởi một viên thuốc **A** lớn hơn bởi một viên thuốc **B**”.'),
            p('Để kiểm chứng giả thuyết này, Việt tiến hành thí nghiệm lần lượt cho mỗi loại thuốc **A** và thuốc **B** theo các bước như sau:'),
            list([
              'Bước 1: Cân khối lượng của một viên thuốc, ghi lại giá trị là m₀ gam.',
              'Bước 2: Nghiền mịn viên thuốc ở trên, cân m₁ gam thuốc này cho vào bình tam giác, thêm tiếp khoảng 10 mL nước cất và lắc đều.',
              'Bước 3: Lấy chính xác 25,0 mL dung dịch HCl 0,1017 M cho vào bình tam giác chứa thuốc để hoà tan hết hoạt chất. Lắc đều và đun nhẹ để đuổi hết CO₂, sau đó làm nguội về nhiệt độ phòng.',
              'Bước 4: Tráng rửa burette bằng nước cất, sau đó tráng lại bằng dung dịch X. Tiến hành chuẩn độ lượng acid HCl dư trong bình tam giác ở bước 3 bằng dung dịch NaOH 0,1008 M với chỉ thị phenolphthalein, thì tiêu tốn V mL dung dịch NaOH.'
            ]),
            table(['Lần thứ nhất', 'Thuốc A', 'Thuốc B'], [['m₀ (gam)', '1,503', '0,725'], ['m₁ (gam)', '0,256', '0,259'], ['V (mL)', '8,10', '4,10']]),
            p('Thí nghiệm được lặp lại thêm 2 lần. Kết quả thí nghiệm lần thứ nhất được ghi lại trong bảng bên. Cho biết: 1 mol = 10³ mmol.')
          ],
          statements: [
            { id: 'a', text: 'Theo kết quả thu được từ thí nghiệm lần thứ nhất, một viên thuốc **A** làm giảm được tối đa 1,73 mmol HCl (kết quả các phép tính trung gian không được làm tròn, chỉ kết quả cuối cùng được làm tròn tới hàng phần trăm).' },
            { id: 'b', text: 'Phản ứng hoà tan hoạt chất của thuốc **A** trong dung dịch HCl ở bước 3 là HCl + NaOH → NaCl + H₂O.' },
            { id: 'c', text: 'Ở bước 4, dung dịch X là dung dịch NaOH 0,1008 M.' },
            { id: 'd', text: 'Kết quả thu được từ thí nghiệm lần thứ nhất phù hợp với giả thuyết ban đầu của Việt.' }
          ],
          answer: { a: false, b: false, c: true, d: true },
          solution: solution('n(HCl) ban đầu = 25,0 × 0,1017 = 2,5425 mmol. Thuốc A: HCl dư = 0,1008 × 8,10 = 0,81648 mmol ⇒ 0,256 g thuốc giảm 1,72602 mmol; một viên (1,503 g) giảm 1,72602 × 1,503/0,256 = 10,13 mmol ⇒ a sai (1,73 mmol chỉ ứng với 0,256 g). b sai: hoạt chất phản ứng theo CaCO₃ + 2HCl → CaCl₂ + CO₂ + H₂O. c đúng: burette được tráng bằng chính dung dịch chuẩn NaOH. Thuốc B: 2,5425 − 0,1008 × 4,10 = 2,12922 mmol cho 0,259 g ⇒ một viên (0,725 g) giảm 5,96 mmol < 10,13 ⇒ d đúng.'),
          meta: meta('g12-c7', 'g11-c1')
        },
        {
          id: 'tn26-ii2',
          content: [
            p('Xét quá trình tạo thành các phức chất của Co(II) trong sơ đồ gồm hai giai đoạn được đánh số (1), (2) như sau:'),
            eq('(1) CoCl₂(s) → [Co(OH₂)₆]²⁺(aq)', '+ H₂O(l)'),
            eq('(2) [Co(OH₂)₆]²⁺(aq) → [CoCl₄]²⁻(aq)', '+ dung dịch HCl đặc'),
            p('Trong các phức chất [Co(OH₂)₆]²⁺ và [CoCl₄]²⁻, mỗi phối tử đều liên kết với nguyên tử trung tâm bằng một liên kết cho – nhận.')
          ],
          statements: [
            { id: 'a', text: 'Phức chất aqua [Co(OH₂)₆]²⁺ có dạng hình học tứ diện.' },
            { id: 'b', text: 'Để hình thành liên kết cho – nhận trong phức chất [Co(OH₂)₆]²⁺, các phân tử H₂O đã nhận cặp electron hoá trị riêng (cặp electron chưa liên kết) của cation Co²⁺.' },
            { id: 'c', text: 'Số liên kết cho – nhận giữa nguyên tử trung tâm với các phối tử trong hai phức chất [Co(OH₂)₆]²⁺ và [CoCl₄]²⁻ là bằng nhau.' },
            { id: 'd', text: 'Ở giai đoạn (2) có xảy ra phản ứng thay thế phối tử trong phức chất.' }
          ],
          answer: { a: false, b: false, c: false, d: true },
          solution: solution('a sai: 6 phối tử nên phức có dạng bát diện. b sai: H₂O cho cặp electron chưa liên kết của O vào orbital trống của Co²⁺. c sai: 6 liên kết so với 4 liên kết. d đúng: phối tử H₂O được thay bằng Cl⁻.'),
          meta: meta('g12-c8')
        },
        {
          id: 'tn26-ii3',
          content: [
            p('Chất béo X có trong thành phần dầu cá. Thủy phân X bằng dung dịch NaOH đun nóng, thu được các sản phẩm hữu cơ **Y**, **Z**, **T** theo phương trình hoá học sau:'),
            figure('ii3-chat-beo.png', 911, 175, 700, 'Phương trình: chất béo X (triester của glycerol, hai gốc acid no mạch dài và một gốc acid có hai liên kết đôi C=C ở vị trí giữa) + 3NaOH, đun nóng t°, tạo Y (glycerol, có ba nhóm OH), 2 phân tử Z (muối sodium của acid béo no, mạch dài, đầu COONa) và T (muối sodium của acid béo có hai liên kết đôi C=C).'),
            p('Cho biết chất **Z** và chất **T** đều có tính chất giặt rửa.')
          ],
          statements: [
            { id: 'a', text: 'Hợp chất **Y** có tên gọi là glycerol.' },
            { id: 'b', text: 'Trên mỗi phổ hồng ngoại của chất **X** và chất **Y** đều có tín hiệu đặc trưng cho các liên kết C=O và O–H.' },
            { id: 'c', text: 'Do phân tử **X** chứa gốc acid béo không no nên chất béo thu được khi hydrogen hoá hoàn toàn **X** thuộc loại chất béo no (chỉ chứa gốc acid béo no).' },
            { id: 'd', text: 'Chất **Z** và chất **T** đều có tính chất giặt rửa do các chất này đều có phần kị nước và phần ưa nước.' }
          ],
          answer: { a: true, b: false, c: true, d: true },
          solution: solution('a đúng. b sai: X (triester) có C=O nhưng không có O–H; Y (glycerol) có O–H nhưng không có C=O. c đúng: hydrogen hóa hết các liên kết C=C thì mọi gốc acid đều no. d đúng: đuôi hydrocarbon kị nước, nhóm –COO⁻Na⁺ ưa nước.'),
          meta: meta('g12-c1')
        },
        {
          id: 'tn26-ii4',
          content: [
            p('Cellulose và tinh bột đều có công thức chung là (C₆H₁₀O₅)ₙ. Tinh bột gồm hai thành phần là amylose và amylopectin. Thuỷ phân hoàn toàn cellulose và tinh bột trong môi trường acid đun nóng, thu được glucose theo phương trình hoá học sau:'),
            eq('(C₆H₁₀O₅)ₙ + nH₂O → nC₆H₁₂O₆ (1)', 'H⁺, t°')
          ],
          statements: [
            { id: 'a', text: 'Cellulose và tinh bột đều là polymer tự nhiên (polymer thiên nhiên).' },
            { id: 'b', text: 'Phản ứng thuỷ phân cellulose và tinh bột theo phương trình (1) là phản ứng cắt mạch polymer.' },
            { id: 'c', text: 'Vì cellulose và tinh bột đều có công thức chung là (C₆H₁₀O₅)ₙ nên phân tử khối của cellulose và tinh bột đều bằng nhau.' },
            { id: 'd', text: 'Cellulose và amylopectin đều cấu tạo từ các đơn vị glucose liên kết với nhau bằng các liên kết glycoside nên chúng đều có cấu tạo mạch polymer không phân nhánh.' }
          ],
          answer: { a: true, b: true, c: false, d: false },
          solution: solution('a, b đúng. c sai: n khác nhau nên phân tử khối khác nhau. d sai: amylopectin có mạch phân nhánh (liên kết α-1,6-glycoside tại điểm nhánh); cellulose không phân nhánh.'),
          meta: meta('g12-c2', 'g12-c4')
        }
      ]
    },
    {
      part: 'III',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 6.',
      questions: [
        {
          id: 'tn26-iii1',
          content: [
            p('Cho các phản ứng hoá học được đánh số như sau:'),
            eq('(1) nCH₂=CH–CN → (–CH₂–CH(CN)–)ₙ', 'xt, t°, p'),
            eq('(2) CH₂=CH₂ + Br₂ → CH₂Br–CH₂Br'),
            eq('(3) C₁₂H₂₂O₁₁ (saccharose) + H₂O → C₆H₁₂O₆ (glucose) + C₆H₁₂O₆ (fructose)', 'H⁺, t°'),
            eq('(4) nH₂N–[CH₂]₅–COOH → (–NH–[CH₂]₅–CO–)ₙ + nH₂O', 't°'),
            p('Sắp xếp số tương ứng của mỗi phản ứng theo thứ tự: phản ứng thủy phân, phản ứng trùng ngưng, phản ứng trùng hợp và phản ứng cộng, thành bộ bốn số (ví dụ: 1234, 4321,...).')
          ],
          answer: '3412',
          solution: solution('Thủy phân: (3); trùng ngưng (tách H₂O): (4); trùng hợp acrylonitrile: (1); cộng Br₂: (2) ⇒ 3412.'),
          meta: meta('g12-c4', 'g12-c2')
        },
        {
          id: 'tn26-iii2',
          content: [p('Thế điện cực chuẩn của các cặp oxi hoá – khử Zn²⁺/Zn và Pb²⁺/Pb lần lượt là –0,763 V và –0,126 V. Tính sức điện động chuẩn (theo V) của pin Galvani tạo bởi hai cặp oxi hoá – khử trên (làm tròn kết quả tới hàng phần trăm).')],
          answer: '0,64',
          solution: solution('E°pin = E°(Pb²⁺/Pb) − E°(Zn²⁺/Zn) = −0,126 − (−0,763) = 0,637 ≈ 0,64 V.'),
          meta: meta('g12-c5')
        },
        {
          id: 'tn26-iii3',
          content: [
            p('Cho các chất được đánh số như sau:'),
            list(['(1) methyl acetate; (2) propyl acetate', '(3) sodium formate; (4) sodium palmitate', '(5) methyl methacrylate; (6) methyl formate']),
            p('Liệt kê theo trình tự từ nhỏ đến lớn các số ứng với tất cả các chất là ester (ví dụ: 56, 124, 3456,...).')
          ],
          answer: '1256',
          solution: solution('Ester: methyl acetate (1), propyl acetate (2), methyl methacrylate (5), methyl formate (6). Sodium formate và sodium palmitate là muối ⇒ 1256.'),
          meta: meta('g12-c1')
        },
        {
          id: 'tn26-iii4',
          content: [
            p('Trong một nhà máy sản xuất đường saccharose, sau một số giai đoạn xử lí thu được đường ẩm (chỉ gồm saccharose và 0,90% nước theo khối lượng). Đường ẩm được đưa vào thiết bị sấy cho tiếp xúc với dòng không khí nóng (chứa 1,00% nước theo khối lượng). Tỉ lệ khối lượng không khí nóng : đường ẩm là 3 : 1. Trong quá trình sấy, chỉ xảy ra sự bay hơi của nước từ đường ẩm vào dòng không khí nóng. Sau khi sấy, dòng không khí nóng thoát ra khỏi thiết bị chứa 1,28% nước theo khối lượng và thu được đường chứa a.10⁻² %, nước theo khối lượng.'),
            p('Xác định giá trị của a (không làm tròn kết quả các phép tính trung gian, chỉ làm tròn kết quả cuối cùng tới hàng phần trăm).')
          ],
          answer: '4,95',
          solution: solution('Với 1000 g đường ẩm: 991 g saccharose, 9 g nước; 3000 g không khí gồm 2970 g khí khô, 30 g nước. Nước trong khí ra: w/(2970 + w) = 0,0128 ⇒ w = 38,509 g ⇒ đã bay hơi 8,509 g. Nước còn trong đường 0,491 g ⇒ 0,491/991,491 × 100 = 0,04952% = 4,95 × 10⁻² % ⇒ a = 4,95.'),
          meta: meta('g12-c2')
        },
        {
          id: 'tn26-iii5',
          content: [
            p('Một nhà máy sản xuất ammonia theo phương pháp Haber – Bosch. Để thu được nitrogen (N₂) và hydrogen (H₂) từ methane, không khí và nước, các giai đoạn chính được thực hiện như sau:'),
            p('- Giai đoạn 1: Cho hỗn hợp gồm khí methane và hơi nước với tỉ lệ mol tương ứng là 1 : 3 qua tháp phản ứng chứa xúc tác ở 900 °C, xảy ra phản ứng:'),
            eq('CH₄(g) + H₂O(g) ⇌ CO(g) + 3H₂(g)', 'xt, 900 °C'),
            p('Hiệu suất chuyển hoá CH₄ ở giai đoạn này là h %.'),
            p('- Giai đoạn 2: Hỗn hợp thu được sau giai đoạn 1 được trộn với không khí (chứa 80% N₂ và 20% O₂ theo thể tích) để oxi hoá hết methane theo phản ứng:'),
            eq('2CH₄(g) + O₂(g) → 2CO(g) + 4H₂(g)', 'xt, t°'),
            p('- Giai đoạn 3: Trộn hỗn hợp thu được sau giai đoạn 2 với hơi nước dư để oxi hoá hết CO thành CO₂ theo phản ứng:'),
            eq('CO(g) + H₂O(g) → CO₂(g) + H₂(g)', 't°'),
            p('- Giai đoạn 4: Dẫn hỗn hợp thu được sau giai đoạn 3 vào tháp hấp thụ để tách CO₂ và hơi nước. Hỗn hợp khí còn lại chỉ gồm N₂ và H₂ với tỉ lệ mol tương ứng là 1 : 3 được sử dụng để tổng hợp ammonia.'),
            p('Coi các phản ứng khác trong các giai đoạn từ 1 đến 4 xảy ra không đáng kể. Xác định giá trị của h (không làm tròn kết quả các phép tính trung gian, chỉ làm tròn kết quả cuối cùng tới hàng phần mười).')
          ],
          answer: '42,9',
          solution: solution('Lấy 1 mol CH₄, x = h/100. Giai đoạn 1: x mol CO, 3x mol H₂, còn 1 − x mol CH₄. Giai đoạn 2: cần (1 − x)/2 mol O₂ kèm 2(1 − x) mol N₂; tạo thêm 1 − x mol CO và 2(1 − x) mol H₂. Giai đoạn 3: 1 mol CO tạo 1 mol H₂. n(H₂) = 3x + 2(1 − x) + 1 = x + 3; n(N₂) = 2(1 − x). 3 × 2(1 − x) = x + 3 ⇒ x = 3/7 ⇒ h = 42,86 ≈ 42,9.'),
          meta: meta('g11-c2', 'g11-c1')
        },
        {
          id: 'tn26-iii6',
          content: [
            p('Xi măng Portland có thành phần được biểu diễn như sau: 3CaO·Al₂O₃ (kí hiệu là C₃A), 2CaO·SiO₂ (kí hiệu là C₂S), 3CaO·SiO₂ (kí hiệu là C₃S), 4CaO·Al₂O₃·Fe₂O₃ (kí hiệu là C₄AF), CaSO₄ (hay CaO·SO₃), còn lại là phụ gia. Thành phần của một loại xi măng Portland quy đổi về % khối lượng các chất được cho trong bảng sau:'),
            table(['Thành phần', 'CaO', 'SiO₂', 'Al₂O₃', 'Fe₂O₃', 'SO₃', 'Phụ gia'], [['% khối lượng', '67,76', '22,20', '5,61', '2,40', '1,60', '0,43']]),
            p('Phần trăm theo khối lượng của 2CaO·SiO₂ (C₂S) trong loại xi măng Portland trên là x%. Xác định giá trị của x (không làm tròn kết quả các phép tính trung gian, chỉ làm tròn kết quả cuối cùng tới hàng phần mười).')
          ],
          answer: '17,2',
          solution: solution('Xét 100 g. SO₃ 0,02 mol ⇒ CaSO₄ dùng 0,02 mol CaO. Fe₂O₃ 0,015 mol ⇒ C₄AF dùng 0,015 mol Al₂O₃ và 0,06 mol CaO. Al₂O₃ còn 0,055 − 0,015 = 0,04 mol ⇒ C₃A dùng 0,12 mol CaO. CaO còn 1,21 − 0,02 − 0,06 − 0,12 = 1,01 mol cho silicate; SiO₂ 0,37 mol. Gọi a mol C₃S, b mol C₂S: a + b = 0,37; 3a + 2b = 1,01 ⇒ b = 0,10 mol ⇒ m(C₂S) = 0,10 × 172 = 17,2 g ⇒ x = 17,2.'),
          meta: meta('g12-c7')
        }
      ]
    }
  ]
}
