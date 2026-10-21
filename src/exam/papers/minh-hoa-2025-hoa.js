// Đề minh họa (ĐỀ KIỂM TRA LỚP 10 — Môn: Hoá học) của Bộ GD&ĐT, công bố cùng
// cấu trúc định dạng đề thi từ năm 2025 (Cục Quản lý chất lượng, 29/12/2023).
// The paper demonstrates the new format with grade-10 content.
// Transcribed from the official scanned PDF (“4_Hoa hoc.pdf”, SHA-256
// 2868c15f88ed43bf1c38fdfb2db1cbe29d063efe32ad2b09d5980954068c54ef): pages 1–4
// questions, page 5 answer key (“ĐÁP ÁN ĐỀ KIỂM TRA LỚP 10”), page 6 an
// aggregate competence/level table (no per-question levels, so none are set).
// Figures are crops of the original pages; solutions are written by ChemLab.
// Per-question check list: docs/exam/papers/minh-hoa-2025-hoa.md

// displayWidth: on-screen width close to the printed size; narrower screens scroll the figure.
const figure = (file, width, height, displayWidth, alt) => ({ type: 'figure', src: new URL(`./assets/minh-hoa-2025-hoa/${file}`, import.meta.url).href, width, height, displayWidth, alt })
const p = text => ({ type: 'p', text })
const list = items => ({ type: 'list', items })
const table = (head, rows) => ({ type: 'table', head, rows })
const options = texts => ['A', 'B', 'C', 'D'].map((id, index) => ({ id, text: texts[index] }))
const solution = text => ({ text, official: false })
const meta = (...chapters) => ({ status: 'internal', chapters })

export default {
  id: 'minh-hoa-2025-hoa',
  title: 'Đề minh họa định dạng đề thi từ năm 2025 — Hóa học (đề kiểm tra lớp 10)',
  kind: 'official-reference',
  blueprint: 'thpt-2025-hoa',
  license: 'owner-attested',
  dataVersion: 1,
  timeLimitMinutes: 50,
  source: {
    authority: 'Bộ GD&ĐT — Cục Quản lý chất lượng',
    url: 'https://vqa.moet.gov.vn/vi/news/thong-bao/cau-truc-dinh-dang-de-thi-tot-nghiep-thpt-tu-nam-2025-74.html',
    documentUrl: 'https://drive.google.com/file/d/1ZuXbhxvdamaPrvcr1JuSpnZeVWMcndQn/view',
    originalTitle: 'Đề minh họa — Đề kiểm tra lớp 10 — Môn: Hoá học (4_Hoa hoc.pdf)',
    publishedAt: '2023-12-29'
  },
  answerKey: 'official',
  sections: [
    {
      part: 'I',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 18. Mỗi câu hỏi thí sinh chỉ chọn một phương án.',
      questions: [
        {
          id: 'mh25-1',
          content: [p('Nguyên tử gồm hạt nhân và vỏ nguyên tử. Vỏ nguyên tử chứa loại hạt nào sau đây?')],
          options: options(['Proton.', 'Electron.', 'Proton và neutron.', 'Neutron.']),
          answer: 'B',
          solution: solution('Hạt nhân chứa proton và neutron; vỏ nguyên tử chứa các electron.'),
          meta: meta('g10-c1')
        },
        {
          id: 'mh25-2',
          content: [p('Các nguyên tử của cùng một nguyên tố hoá học là đồng vị của nhau có sự khác nhau về')],
          options: options(['số neutron.', 'số proton.', 'số electron.', 'điện tích hạt nhân.']),
          answer: 'A',
          solution: solution('Đồng vị có cùng số proton (cùng điện tích hạt nhân, cùng số electron ở nguyên tử) nhưng khác số neutron.'),
          meta: meta('g10-c1')
        },
        {
          id: 'mh25-3',
          content: [p('Kí hiệu phân lớp electron nào sau đây **sai**?')],
          options: options(['3s.', '3p.', '3d.', '3f.']),
          answer: 'D',
          solution: solution('Lớp n = 3 chỉ có các phân lớp 3s, 3p, 3d; phân lớp f chỉ có từ lớp n = 4.'),
          meta: meta('g10-c1')
        },
        {
          id: 'mh25-4',
          content: [
            p('Hình bên biểu diễn hình dạng orbital nguyên tử (AO) nào sau đây?'),
            figure('c4-orbital.png', 180, 180, 150, 'Hình cầu có tâm tại gốc của ba trục tọa độ x, y, z: orbital có dạng hình cầu, đối xứng theo mọi hướng.')
          ],
          options: options(['s.', 'p_{x}.', 'p_{y}.', 'p_{z}.']),
          answer: 'A',
          solution: solution('Orbital dạng hình cầu là orbital s; các orbital p có dạng hình số tám nổi định hướng theo một trục.'),
          meta: meta('g10-c1')
        },
        {
          id: 'mh25-5',
          content: [p('Cấu hình electron của nguyên tử Al (Z = 13) là')],
          options: options(['1s²2s²2p⁶3p³.', '1s²2s²2p⁵3s²3p².', '1s²2s²2p⁶2d³.', '1s²2s²2p⁶3s²3p¹.']),
          answer: 'D',
          solution: solution('13 electron điền theo thứ tự 1s, 2s, 2p, 3s, 3p: 1s²2s²2p⁶3s²3p¹. Không có phân lớp 2d.'),
          meta: meta('g10-c1')
        },
        {
          id: 'mh25-6',
          content: [p('Phân tử nào sau đây có liên kết cộng hóa trị không phân cực?')],
          options: options(['HCl.', 'N₂.', 'SO₂.', 'HBr.']),
          answer: 'B',
          solution: solution('N₂ gồm hai nguyên tử cùng nguyên tố (hiệu độ âm điện bằng 0) nên liên kết cộng hóa trị không phân cực.'),
          meta: meta('g10-c3')
        },
        {
          id: 'mh25-7',
          content: [
            p('Biết số hiệu nguyên tử của hai nguyên tố X và Y lần lượt là 19 và 17. Cho các phát biểu sau:'),
            list([
              '(a) Độ âm điện của nguyên tử X nhỏ hơn độ âm điện của nguyên tử Y.',
              '(b) Số electron độc thân của nguyên tử X ít hơn số electron độc thân của nguyên tử Y.',
              '(c) Trong các phản ứng hóa học, nguyên tử X có xu hướng nhường 2 electron.',
              '(d) Khi hình thành liên kết với nguyên tử X, nguyên tử Y nhận 1 electron.'
            ]),
            p('Số phát biểu đúng là')
          ],
          options: options(['2.', '3.', '1.', '4.']),
          answer: 'A',
          solution: solution('X là K ([Ar]4s¹), Y là Cl ([Ne]3s²3p⁵). (a) đúng: K là kim loại kiềm, Cl là phi kim. (b) sai: mỗi nguyên tử đều có 1 electron độc thân. (c) sai: K nhường 1 electron. (d) đúng: Cl nhận 1 electron tạo Cl⁻. Có 2 phát biểu đúng.'),
          meta: meta('g10-c2', 'g10-c3')
        },
        {
          id: 'mh25-8',
          content: [p('Chất nào sau đây **không** tạo được liên kết hydrogen giữa các phân tử?')],
          options: options(['NH₃.', 'H₂O.', 'HF.', 'CH₄.']),
          answer: 'D',
          solution: solution('Liên kết hydrogen cần H liên kết với nguyên tử có độ âm điện lớn (N, O, F). Trong CH₄, H liên kết với C nên không tạo liên kết hydrogen.'),
          meta: meta('g10-c3')
        },
        {
          id: 'mh25-9',
          content: [p('Lưu huỳnh (sulfur, S) thuộc nhóm VIA trong bảng tuần hoàn các nguyên tố hóa học. Công thức của sulfuric acid (tương ứng với oxide cao nhất của S) là')],
          options: options(['H₂S.', 'SO₃.', 'H₂SO₃.', 'H₂SO₄.']),
          answer: 'D',
          solution: solution('S thuộc nhóm VIA, hóa trị cao nhất VI: oxide cao nhất SO₃, acid tương ứng H₂SO₄ (sulfuric acid).'),
          meta: meta('g10-c2')
        },
        {
          id: 'mh25-10',
          content: [
            p('Cho bảng số lượng electron, neutron và proton của các phần tử (nguyên tử hoặc ion) sau:'),
            table(['Phần tử', 'Số electron', 'Số neutron', 'Số proton'], [['(a)', '8', '8', '8'], ['(b)', '10', '12', '11'], ['(c)', '19', '20', '19'], ['(d)', '18', '18', '17']]),
            p('Những phần tử thuộc loại ion là')
          ],
          options: options(['(a) và (d).', '(a) và (b).', '(c) và (d).', '(b) và (d).']),
          answer: 'D',
          solution: solution('Ion có số electron khác số proton: (b) 11 proton, 10 electron (ion 1+); (d) 17 proton, 18 electron (ion 1−). (a), (c) là nguyên tử trung hòa.'),
          meta: meta('g10-c1')
        },
        {
          id: 'mh25-11',
          content: [
            p('Số đồng vị bền của nguyên tố neon (Ne) được suy ra từ phổ khối lượng ở hình bên là'),
            figure('c11-ms-neon.png', 675, 442, 380, 'Phổ khối lượng của neon: trục hoành là tỉ số nguyên tử khối/điện tích (m/z) từ 19 đến 23, trục tung là phần trăm số nguyên tử đồng vị. Có ba vạch: m/z = 20 (90,9%), m/z = 21 (0,3%), m/z = 22 (8,8%).')
          ],
          options: options(['1.', '2.', '3.', '4.']),
          answer: 'C',
          solution: solution('Phổ có ba vạch tại m/z = 20, 21, 22 ứng với ba đồng vị ²⁰Ne, ²¹Ne, ²²Ne.'),
          meta: meta('g10-c1')
        },
        {
          id: 'mh25-12',
          content: [p('Trong bảng tuần hoàn các nguyên tố hóa học, các nguyên tố khí hiếm thuộc nhóm')],
          options: options(['IA.', 'IIA.', 'VIIIA.', 'VIIA.']),
          answer: 'C',
          solution: solution('Khí hiếm (He, Ne, Ar, …) có lớp electron ngoài cùng bão hòa, thuộc nhóm VIIIA.'),
          meta: meta('g10-c2')
        },
        {
          id: 'mh25-13',
          content: [p('Trong phân tử carbon dioxide (O=C=O) số liên kết σ và liên kết π lần lượt là')],
          options: options(['0 và 4.', '2 và 2.', '3 và 1.', '4 và 0.']),
          answer: 'B',
          solution: solution('Mỗi liên kết đôi C=O gồm 1 liên kết σ và 1 liên kết π; CO₂ có 2 liên kết đôi nên có 2 σ và 2 π.'),
          meta: meta('g10-c3')
        },
        {
          id: 'mh25-14',
          content: [p('Trong một chu kì của bảng tuần hoàn các nguyên tố hóa học, theo chiều tăng dần điện tích hạt nhân, bán kính nguyên tử của các nguyên tố giảm dần do số lớp electron ...(I), lực hút giữa hạt nhân với electron lớp ngoài cùng ...(II). Cụm từ cần điền vào (I), (II) lần lượt là:')],
          options: options(['tăng dần, tăng dần.', 'giảm dần, giảm dần.', 'không đổi, tăng dần.', 'không đổi, giảm dần.']),
          answer: 'C',
          solution: solution('Trong một chu kì, các nguyên tố có cùng số lớp electron; điện tích hạt nhân tăng nên lực hút với electron lớp ngoài cùng tăng, bán kính giảm.'),
          meta: meta('g10-c2')
        },
        {
          id: 'mh25-15',
          content: [
            p('Cho các hình biểu diễn sự xen phủ orbital nguyên tử để tạo liên kết hóa học sau:'),
            figure('c15-xen-phu.png', 1518, 360, 800, 'Bốn hình xen phủ orbital: (a) xen phủ trục s-s (hai khối cầu chồng lên nhau); (b) xen phủ trục s-p (khối cầu xen phủ với một thùy p dọc trục nối hai hạt nhân); (c) xen phủ trục p-p (hai orbital p xen phủ dọc trục); (d) xen phủ bên p-p (hai orbital p song song xen phủ hai bên trục).'),
            p('Biết số hiệu các nguyên tử của H, F và S lần lượt là 1, 9 và 16. Sự tạo liên kết trong các phân tử H₂S và F₂ theo kiểu xen phủ tương ứng là')
          ],
          options: options(['(a) và (c).', '(b) và (c).', '(b) và (d).', '(c) và (d).']),
          answer: 'B',
          solution: solution('Trong H₂S, orbital 1s của H xen phủ trục với orbital 3p của S (s-p). Trong F₂, hai orbital 2p của F xen phủ trục (p-p) tạo liên kết σ.'),
          meta: meta('g10-c3')
        },
        {
          id: 'mh25-16',
          content: [p('Cho số hiệu nguyên tử của nguyên tố R là 7. Phát biểu nào sau đây **sai**?')],
          options: options(['Công thức oxide cao nhất của R là R₂O₅.', 'R có tính phi kim mạnh hơn Si (Z = 14).', 'R là nguyên tố p.', 'Nguyên tử R có 5 electron ở phân lớp ngoài cùng.']),
          answer: 'D',
          solution: solution('R là N: 1s²2s²2p³ (nhóm VA, chu kì 2). Oxide cao nhất N₂O₅; N là nguyên tố p, phi kim mạnh hơn Si. Phân lớp ngoài cùng 2p chỉ có 3 electron (lớp ngoài cùng có 5 electron) nên D sai.'),
          meta: meta('g10-c1', 'g10-c2')
        },
        {
          id: 'mh25-17',
          content: [p('Nguyên tố silicon (Si) thuộc chu kì 3, nhóm IVA trong bảng tuần hoàn các nguyên tố hoá học. Công thức oxide cao nhất của silicon là')],
          options: options(['SiO₂.', 'SiO.', 'H₂SiO₃.', 'SiH₄.']),
          answer: 'A',
          solution: solution('Nhóm IVA có hóa trị cao nhất với oxygen là IV: oxide cao nhất SiO₂.'),
          meta: meta('g10-c2')
        },
        {
          id: 'mh25-18',
          content: [
            p('Cho bảng số liệu sau:'),
            table(['Chất', 'Nước (H₂O)', 'Hydrogen sulfide (H₂S)'], [['Nhiệt độ sôi (°C) ở 1 atm', '100,0', '– 60,7']]),
            p('Phát biểu nào sau đây **sai**?')
          ],
          options: options([
            'Do có liên kết hydrogen giữa các phân tử nên nước có nhiệt độ sôi cao hơn hydrogen sulfide.',
            'Trong phân tử H₂O và phân tử H₂S chỉ có các liên kết cộng hóa trị.',
            'Số liên kết trong phân tử H₂O bằng số liên kết trong phân tử H₂S.',
            'Liên kết O-H trong phân tử H₂O kém phân cực hơn liên kết S-H trong phân tử H₂S.'
          ]),
          answer: 'D',
          solution: solution('O có độ âm điện lớn hơn S nhiều nên liên kết O–H phân cực hơn S–H: D sai. A, B, C đúng (mỗi phân tử có 2 liên kết cộng hóa trị).'),
          meta: meta('g10-c3')
        }
      ]
    },
    {
      part: 'II',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 4. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.',
      questions: [
        {
          id: 'mh25-ii1',
          content: [
            p('Trong lịch sử các thuyết về mô hình nguyên tử có mô hình hành tinh nguyên tử (mô hình Rutherford - Bohr) và mô hình hiện đại của nguyên tử.'),
            figure('ii1-mo-hinh.png', 768, 288, 420, 'Mô hình (1) của nguyên tử hydrogen: hạt nhân ở tâm, electron chuyển động trên một quỹ đạo tròn. Mô hình (2) của nguyên tử hydrogen: hạt nhân ở tâm, xung quanh là đám mây electron mờ dần.')
          ],
          statements: [
            { id: 'a', text: 'Với nguyên tử hydrogen, mô hình (1) là mô hình hiện đại, mô hình (2) là mô hình hành tinh nguyên tử.' },
            { id: 'b', text: 'Khái niệm về xác suất tìm thấy electron xuất phát từ mô hình hành tinh nguyên tử.' },
            { id: 'c', text: 'Theo mô hình (1), electron chuyển động trên quỹ đạo xác định xung quanh hạt nhân.' },
            { id: 'd', text: 'Khái niệm về orbital nguyên tử xuất phát từ mô hình hiện đại của nguyên tử.' }
          ],
          answer: { a: false, b: false, c: true, d: true },
          solution: solution('Mô hình (1) (quỹ đạo tròn) là mô hình hành tinh; mô hình (2) (đám mây electron) là mô hình hiện đại: a sai, c đúng. Xác suất tìm thấy electron và orbital là khái niệm của mô hình hiện đại: b sai, d đúng.'),
          meta: meta('g10-c1')
        },
        {
          id: 'mh25-ii2',
          content: [p('Natri (sodium, ₁₁Na) và magnesium (₁₂Mg) thuộc chu kì 3 trong bảng tuần hoàn các nguyên tố hóa học.')],
          statements: [
            { id: 'a', text: 'Theo xu hướng biến đổi tính kim loại, Mg có tính kim loại yếu hơn Na.' },
            { id: 'b', text: 'Dựa vào mức độ phản ứng của Na và Mg với nước ở điều kiện thường, có thể so sánh được độ hoạt động hóa học giữa Na với Mg.' },
            { id: 'c', text: 'Tính base của sodium hydroxide yếu hơn tính base của magnesium hydroxide.' },
            { id: 'd', text: 'Khi phản ứng với Cl₂, Na và Mg đều tạo ra hợp chất ion.' }
          ],
          answer: { a: true, b: true, c: false, d: true },
          solution: solution('Trong chu kì 3, tính kim loại giảm từ Na đến Mg: a đúng. Na phản ứng mạnh với nước ở điều kiện thường, Mg hầu như không: b đúng. NaOH là base mạnh hơn Mg(OH)₂: c sai. NaCl, MgCl₂ đều là hợp chất ion: d đúng.'),
          meta: meta('g10-c2', 'g10-c3')
        },
        {
          id: 'mh25-ii3',
          content: [
            p('Khi đun nóng dung dịch sodium chloride bão hòa, thu được tinh thể sodium chloride khan. Sau đó, nung nóng đến khoảng 800 °C thì tinh thể sodium chloride chảy lỏng.'),
            figure('ii3-nacl.png', 483, 337, 280, 'Cấu trúc tinh thể sodium chloride: mạng lập phương, các ion Cl⁻ (hình cầu lớn) và Na⁺ (hình cầu nhỏ) xếp xen kẽ tại các nút mạng.')
          ],
          statements: [
            { id: 'a', text: 'Quá trình hình thành tinh thể sodium chloride ở trên được gọi là sự kết tinh.' },
            { id: 'b', text: 'Quá trình hình thành tinh thể sodium chloride ở trên là quá trình sắp xếp lại các ion Na⁺, Cl⁻ từ chuyển động tự do thành cấu trúc có trật tự trong tinh thể.' },
            { id: 'c', text: 'Trong tinh thể sodium chloride, xung quanh 1 ion Na⁺ có 6 ion Cl⁻ gần nhất.' },
            { id: 'd', text: 'Tinh thể sodium chloride nóng chảy ở khoảng 800 °C, chứng tỏ lực liên kết giữa các ion trong tinh thể là yếu.' }
          ],
          answer: { a: true, b: true, c: true, d: false },
          solution: solution('a, b đúng: dung dịch bão hòa bay hơi nước, các ion sắp xếp lại thành tinh thể (kết tinh). c đúng: mỗi Na⁺ được bao quanh bởi 6 Cl⁻ gần nhất. d sai: nhiệt độ nóng chảy cao (khoảng 800 °C) chứng tỏ liên kết ion bền.'),
          meta: meta('g10-c3')
        },
        {
          id: 'mh25-ii4',
          content: [
            p('Các nguyên tố phổ biến thuộc nhóm halogen (VIIA) trong bảng tuần hoàn các nguyên tố hóa học gồm: F (Z = 9), Cl (Z = 17), Br (Z = 35) và I (Z = 53). Đơn chất halogen tồn tại dạng phân tử X₂, giữa các phân tử X₂ thường có tương tác với nhau. Cho giá trị năng lượng liên kết X-X ở bảng sau:'),
            table(['Liên kết', 'F - F', 'Cl - Cl', 'Br - Br', 'I - I'], [['Năng lượng liên kết (kJ mol⁻¹) ở 25 °C và 1 bar', '159', '243', '193', '151']]),
            p('Năng lượng liên kết X-X càng lớn thì liên kết càng bền.')
          ],
          statements: [
            { id: 'a', text: 'Cấu hình electron lớp ngoài cùng của nguyên tử X có dạng ns²np⁵.' },
            { id: 'b', text: 'Liên kết giữa các nguyên tử trong X₂ là liên kết cộng hoá trị không phân cực.' },
            { id: 'c', text: 'Tương tác giữa các phân tử X₂ là tương tác van der Waals.' },
            { id: 'd', text: 'Năng lượng liên kết Cl - Cl lớn nhất trong dãy trên vì Cl có bán kính nguyên tử nhỏ nhất.' }
          ],
          answer: { a: true, b: true, c: true, d: false },
          solution: solution('a, b, c đúng. d sai: F mới là nguyên tử có bán kính nhỏ nhất trong nhóm; năng lượng liên kết Cl–Cl lớn nhất không phải do bán kính Cl nhỏ nhất.'),
          meta: meta('g10-c3', 'g10-c7')
        }
      ]
    },
    {
      part: 'III',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 6.',
      questions: [
        {
          id: 'mh25-iii1',
          content: [p('Cho 6 nguyên tố có số hiệu nguyên tử lần lượt là 10, 13, 16, 18, 19 và 20. Trong số các nguyên tố trên có bao nhiêu nguyên tố kim loại?')],
          answer: '3',
          solution: solution('Z = 10 (Ne, khí hiếm), 13 (Al, kim loại), 16 (S, phi kim), 18 (Ar, khí hiếm), 19 (K, kim loại), 20 (Ca, kim loại): có 3 kim loại.'),
          meta: meta('g10-c2')
        },
        {
          id: 'mh25-iii2',
          content: [p('Nguyên tố Y thuộc chu kì 3 trong bảng tuần hoàn các nguyên tố hóa học. Công thức oxide cao nhất của Y là Y₂O₅. Khi cho 1 mol Y₂O₅ tác dụng với dung dịch NaOH dư thì số mol NaOH phản ứng là bao nhiêu?')],
          answer: '6',
          solution: solution('Y thuộc nhóm VA, chu kì 3 nên Y là P. P₂O₅ + 6NaOH → 2Na₃PO₄ + 3H₂O ⇒ 6 mol NaOH.'),
          meta: meta('g10-c2')
        },
        {
          id: 'mh25-iii3',
          content: [p('Có bao nhiêu hợp chất ion trong dãy các chất sau: NH₃, CaO, KCl, CH₄, NaOH?')],
          answer: '3',
          solution: solution('CaO, KCl, NaOH là hợp chất ion (tạo từ kim loại điển hình và phi kim/nhóm nguyên tử); NH₃, CH₄ là hợp chất cộng hóa trị.'),
          meta: meta('g10-c3')
        },
        {
          id: 'mh25-iii4',
          content: [p('Cho số hiệu của nguyên tố N và O lần lượt là 7 và 8. Biết rằng hóa trị của nguyên tố N trong phân tử HNO₃ bằng tổng số liên kết σ và liên kết π mà nguyên tử N tạo thành khi liên kết với các nguyên tử xung quanh. Trong phân tử HNO₃, nguyên tử N không liên kết với nguyên tử H mà liên kết với 3 nguyên tử O. Từ đó viết được công thức Lewis phù hợp của phân tử HNO₃ với hóa trị của N là n. Giá trị của n là bao nhiêu?')],
          answer: '4',
          solution: solution('Công thức Lewis của HNO₃: N liên kết đôi với một O, liên kết đơn với nhóm O–H và liên kết đơn (cho – nhận) với O còn lại. N tạo 3 liên kết σ và 1 liên kết π ⇒ n = 4.'),
          meta: meta('g10-c3')
        },
        {
          id: 'mh25-iii5',
          content: [p('Tổng số cặp electron dùng chung giữa các nguyên tử trong phân tử acetylene (C₂H₂) là bao nhiêu?')],
          answer: '5',
          solution: solution('H–C≡C–H: 2 liên kết C–H (2 cặp) và 1 liên kết ba C≡C (3 cặp) ⇒ 5 cặp electron dùng chung.'),
          meta: meta('g10-c3')
        },
        {
          id: 'mh25-iii6',
          content: [
            p('Từ phổ khối lượng (MS) của magnesium (Mg) ở hình dưới đây:'),
            figure('iii6-ms-mg.png', 528, 472, 300, 'Phổ khối lượng của magnesium: trục hoành là tỉ lệ nguyên tử khối/điện tích (m/z), trục tung là phần trăm số nguyên tử đồng vị. Ba vạch: m/z = 24 (79%), m/z = 25 (10%), m/z = 26 (11%).'),
            p('hãy cho biết giá trị nguyên tử khối trung bình của magnesium là bao nhiêu? Biết z=1. (Làm tròn kết quả đến hàng phần mười)')
          ],
          answer: '24,3',
          solution: solution('A = (24 × 79 + 25 × 10 + 26 × 11) / 100 = (1896 + 250 + 286) / 100 = 24,32 ≈ 24,3.'),
          meta: meta('g10-c1')
        }
      ]
    }
  ]
}
