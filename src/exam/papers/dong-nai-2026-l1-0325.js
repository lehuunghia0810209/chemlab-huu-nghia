// Đề khảo sát chất lượng môn thi tốt nghiệp THPT năm 2026 – lần 1, Sở GD&ĐT
// Đồng Nai, môn Hóa học, ca 2 — mã đề 0325 (đề thi chính thức của kì khảo sát).
// Ca 2 has 24 codes (0325–0348) that permute the same 28 questions; one code is
// integrated. Ca 2 is a different paper from ca 1 (some shared Part II items).
// Source files were provided by the project owner: Ma_de_0325.pdf and the Sở's
// answer key (xlsx and PDF, row 0325; hashes and the per-question check list:
// docs/exam/papers/dong-nai-2026-l1-0325.md). Figures are crops of the original
// pages; solutions are written by ChemLab.

const figure = (file, width, height, displayWidth, alt) => ({ type: 'figure', src: new URL(`./assets/dong-nai-2026-l1-0325/${file}`, import.meta.url).href, width, height, displayWidth, alt })
const p = text => ({ type: 'p', text })
const list = items => ({ type: 'list', items })
const table = (head, rows) => ({ type: 'table', head, rows })
const eq = (text, condition = '') => ({ type: 'equation', text, condition })
const options = texts => ['A', 'B', 'C', 'D'].map((id, index) => ({ id, text: texts[index] }))
const solution = text => ({ text, official: false })
const meta = (...chapters) => ({ status: 'internal', chapters })

export default {
  id: 'dong-nai-2026-l1-0325',
  title: 'Đề khảo sát chất lượng tốt nghiệp THPT 2026 lần 1 — Sở GD&ĐT Đồng Nai — Hóa học (ca 2, mã đề 0325)',
  kind: 'provincial-exam',
  blueprint: 'thpt-2025-hoa',
  license: 'owner-attested',
  dataVersion: 1,
  timeLimitMinutes: 50,
  variant: '0325',
  source: {
    authority: 'Sở GD&ĐT Đồng Nai',
    file: { name: 'Ma_de_0325.pdf', sha256: '6474e57b85801853d1c7ee8d1e5c33274a6bb756f225691af82ac9d785552c75' },
    originalTitle: 'Kỳ thi khảo sát chất lượng môn thi tốt nghiệp THPT năm 2026 – lần 1 — Đề thi chính thức — Môn thi: Hóa học — Mã đề 0325',
    publishedAt: '2026-04'
  },
  answerKey: 'official',
  preamble: 'Cho biết nguyên tử khối: H = 1; C = 12; O = 16; Al = 27; S = 32; K = 39; Mn = 55; Fe = 56; Ca = 40; Mg = 24; Na = 23; N = 14. Các kí hiệu và chữ viết tắt: s: rắn; l: lỏng; g: khí; aq: dung dịch nước.',
  sections: [
    {
      part: 'I',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 18. Mỗi câu hỏi thí sinh chọn một phương án.',
      questions: [
        {
          id: 'dn2-1',
          content: [p('Trong công nghiệp luyện kim, người ta sản xuất nhôm (aluminium) bằng phương pháp điện phân nóng chảy hỗn hợp aluminium oxide (Al₂O₃) và cryolite (Na₃AlF₆). Mô tả nào sau đây đúng bản chất quá trình hoá học xảy ra tại cực âm (cathode) của bình điện phân?')],
          options: options([
            'Ion Al³⁺ di chuyển về cathode, nhận electron và bị khử thành kim loại Al.',
            'Ion O²⁻ di chuyển về cathode, nhường electron và bị oxi hoá thành khí O₂',
            'Ion Na⁺ từ cryolite di chuyển về cathode, nhận electron để tạo thành kim loại Na.',
            'Phân tử Al₂O₃ nhận trực tiếp dòng điện, phân huỷ hoàn toàn thành nguyên tử Al và O.'
          ]),
          answer: 'A',
          solution: solution('Ở cathode (cực âm): Al³⁺ + 3e → Al. Ion O²⁻ đi về anode và bị oxi hóa ở đó; cryolite chỉ làm giảm nhiệt độ nóng chảy và tăng độ dẫn điện.'),
          meta: meta('g12-c6', 'g12-c5')
        },
        {
          id: 'dn2-2',
          content: [p('Trong công nghiệp và đời sống, việc thu gom và tái chế các phế liệu kim loại như sắt, nhôm, đồng đang được đẩy mạnh toàn cầu. Lợi ích thực tiễn của tái chế kim loại so với việc khai thác và sản xuất kim loại từ quặng tự nhiên là:')],
          options: options([
            'Tạo ra các hợp kim mới có độ tinh khiết tuyệt đối, có tính chất vượt trội hoàn toàn so với kim loại được tinh luyện từ quặng.',
            'Chuyển hoá toàn bộ lượng rác thải sinh hoạt hữu cơ thành các vật liệu kim loại mới có giá trị kinh tế cao hơn.',
            'Tiết kiệm nguồn tài nguyên khoáng sản, giảm lượng tiêu thụ năng lượng và hạn chế ô nhiễm môi trường do khai thác quặng.',
            'Loại bỏ hoàn toàn hệ thống các nhà máy luyện kim công nghiệp, chuyển sang mô hình tự luyện kim tại quy mô hộ gia đình.'
          ]),
          answer: 'C',
          solution: solution('Tái chế giúp tiết kiệm tài nguyên quặng, giảm năng lượng (ví dụ không phải điện phân Al₂O₃) và giảm ô nhiễm do khai thác. Các phương án còn lại là phóng đại hoặc sai về khoa học.'),
          meta: meta('g12-c6')
        },
        {
          id: 'dn2-3',
          content: [p('Tên gốc – chức của hợp chất CH₃NHC₂H₅ là')],
          options: options(['Ethylmethylamine.', 'Methylethylamine.', 'Dimethylamine.', 'Propylamine.']),
          answer: 'A',
          solution: solution('Amine bậc hai có gốc ethyl và methyl; tên gốc – chức đọc tên các gốc theo thứ tự bảng chữ cái rồi thêm “amine”: ethylmethylamine.'),
          meta: meta('g12-c3')
        },
        {
          id: 'dn2-4',
          content: [
            p('Cho các phương trình phản ứng sau:'),
            eq('(1) C₂H₆ + Cl₂ → C₂H₅Cl + HCl', 'as'),
            eq('(2) C₄H₁₀ → C₂H₄ + C₂H₆', 'p, t°'),
            eq('(3) 2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O', 't°'),
            eq('(4) C₂H₆ + O₂ → CO + H₂O', 't°'),
            p('Các phản ứng (1), (2), (3), (4) lần lượt là:')
          ],
          options: options([
            'Thế; reforming; oxi hoá hoàn toàn; oxi hoá không hoàn toàn.',
            'Thế; cracking; oxi hoá không hoàn toàn; oxi hoá hoàn toàn.',
            'Thế; cracking; oxi hoá hoàn toàn; oxi hoá không hoàn toàn.',
            'Cộng; cracking; oxi hoá hoàn toàn; oxi hoá không hoàn toàn.'
          ]),
          answer: 'C',
          solution: solution('(1) phản ứng thế; (2) cracking butane; (3) đốt cháy tạo CO₂: oxi hóa hoàn toàn; (4) tạo CO: oxi hóa không hoàn toàn. (Phương trình (4) in trong đề chưa cân bằng; cân bằng: 2C₂H₆ + 5O₂ → 4CO + 6H₂O.)'),
          meta: meta('g11-c4')
        },
        {
          id: 'dn2-5',
          content: [p('So với kim loại kiềm (nhóm IA) cùng chu kì, kim loại kiềm thổ (nhóm IIA) có:')],
          options: options([
            'bán kính nguyên tử nhỏ hơn, khối lượng riêng và nhiệt độ nóng chảy thấp hơn.',
            'bán kính nguyên tử lớn hơn, khối lượng riêng và nhiệt độ nóng chảy thấp hơn.',
            'bán kính nguyên tử lớn hơn, khối lượng riêng và nhiệt độ nóng chảy cao hơn.',
            'bán kính nguyên tử nhỏ hơn, khối lượng riêng và nhiệt độ nóng chảy cao hơn.'
          ]),
          answer: 'D',
          solution: solution('Trong cùng chu kì, điện tích hạt nhân tăng nên bán kính nguyên tử nhóm IIA nhỏ hơn nhóm IA; liên kết kim loại mạnh hơn (2 electron hóa trị) nên khối lượng riêng và nhiệt độ nóng chảy cao hơn.'),
          meta: meta('g12-c7')
        },
        {
          id: 'dn2-6',
          content: [p('Acid béo là')],
          options: options([
            'hợp chất hữu cơ chỉ chứa C và H.',
            'hợp chất hữu cơ có mạch cacbon dài và có một nhóm –COOH.',
            'hợp chất hữu cơ chứa nhóm –OH.',
            'hợp chất hữu cơ mạch hở, chứa nhiều nhóm –COOH.'
          ]),
          answer: 'B',
          solution: solution('Acid béo là monocarboxylic acid mạch carbon dài (thường không phân nhánh, số C chẵn), có một nhóm –COOH.'),
          meta: meta('g12-c1')
        },
        {
          id: 'dn2-7',
          content: [p('Trong một pin điện hoá Galvani Zn-Cu đang hoạt động tạo ra dòng điện, điện cực đồng (Cu) có vai trò là:')],
          options: options([
            'Cathode, nơi xảy ra quá trình oxi hóa và đóng vai trò là cực dương của pin.',
            'Cathode, nơi xảy ra quá trình khử và đóng vai trò là cực dương của pin.',
            'Anode, nơi xảy ra quá trình khử và đóng vai trò là cực âm của pin.',
            'Anode, nơi xảy ra quá trình oxi hoá và đóng vai trò là cực âm của pin.'
          ]),
          answer: 'B',
          solution: solution('Ở điện cực Cu xảy ra sự khử Cu²⁺ + 2e → Cu; điện cực xảy ra sự khử là cathode, là cực dương của pin Galvani.'),
          meta: meta('g12-c5')
        },
        {
          id: 'dn2-8',
          content: [p('Cồn y tế được sử dụng rất phổ biến để sát khuẩn tay hoặc sát trùng bề mặt da trước khi tiêm. Tác dụng diệt khuẩn trong cồn y tế chủ yếu là do:')],
          options: options([
            'Ethanol có trong cồn y tế thuỷ phân protein thành các amino acid, làm vi khuẩn mất đi nguồn dinh dưỡng.',
            'Nước có trong cồn đã phản ứng với protein tạo thành phức chất màu tím, ngăn chặn vi khuẩn sinh sôi.',
            'Nước và ethanol đã oxi hoá protein thành các chất độc hại, trực tiếp phá huỷ màng tế bào vi khuẩn.',
            'Ethanol có trong cồn y tế làm đông tụ protein, khiến protein bị biến tính và làm chết vi khuẩn.'
          ]),
          answer: 'D',
          solution: solution('Ethanol làm protein của vi khuẩn bị biến tính, đông tụ nên vi khuẩn chết. Màu tím là phản ứng biuret với Cu(OH)₂, không liên quan.'),
          meta: meta('g12-c3', 'g11-c5')
        },
        {
          id: 'dn2-9',
          content: [p('Sự lạm dụng chất dẻo dùng một lần (như túi nylon, cốc nhựa, ống hút) đang gây ra vấn đề môi trường nghiêm trọng gọi là "ô nhiễm trắng" do chúng rất khó phân huỷ. Biện pháp nào sau đây được đánh giá là giải pháp bền vững và hiệu quả nhất?')],
          options: options([
            'Chôn lấp rác thải nhựa cùng với rác thải hữu cơ sinh hoạt để các vi sinh vật đẩy nhanh quá trình ăn mòn nhựa.',
            'Dùng hoá chất tẩy rửa mạnh để làm sạch các túi nylon phế liệu và tái sử dụng chúng để đựng thực phẩm chín.',
            'Thu gom tất cả rác thải nhựa và đốt ở nhiệt độ thấp tại các khu dân cư để nhanh chóng làm giảm thể tích rác.',
            'Phân loại rác tại nguồn, tăng cường tái chế nhựa và phát triển các vật liệu polymer sinh học có khả năng tự phân huỷ.'
          ]),
          answer: 'D',
          solution: solution('Phân loại, tái chế và dùng polymer phân hủy sinh học giải quyết tận gốc. Chôn lấp không làm nhựa phân hủy nhanh; đốt ở nhiệt độ thấp sinh khí độc; tái dùng túi đã tẩy rửa để đựng thực phẩm không an toàn.'),
          meta: meta('g12-c4')
        },
        {
          id: 'dn2-10',
          content: [p('Nhận định nào sau đây đúng về ammonia (NH₃)?')],
          options: options([
            'Là chất khí có màu nâu đỏ, tan ít trong nước và có tính acid.',
            'Là chất rắn, không tan trong nước và có tính oxi hóa mạnh.',
            'Là chất khí có mùi khai, tan tốt trong nước và có tính base yếu.',
            'Là chất khí không màu, không tan trong nước và không có tính base.'
          ]),
          answer: 'C',
          solution: solution('NH₃ là khí không màu, mùi khai, tan rất tốt trong nước, dung dịch có tính base yếu.'),
          meta: meta('g11-c2')
        },
        {
          id: 'dn2-11',
          content: [p('Khi đun nóng hỗn hợp bột sắt (Fe) và bột lưu huỳnh (S) trong điều kiện không có không khí, sản phẩm thu được của phản ứng kết hợp này là:')],
          options: options(['Iron(II) sulfate (FeSO₄).', 'Iron(III) sulfate (Fe₂(SO₄)₃).', 'Iron(III) sulfide (Fe₂S₃).', 'Iron(II) sulfide (FeS).']),
          answer: 'D',
          solution: solution('Fe + S → FeS (t°). Sulfur là chất oxi hóa yếu nên chỉ đưa Fe lên số oxi hóa +2; không có oxygen nên không tạo sulfate.'),
          meta: meta('g11-c2', 'g12-c8')
        },
        {
          id: 'dn2-12',
          content: [p('Khi thả vào nước ở nhiệt độ thường, magnesium (Mg) phản ứng rất chậm, trong khi Ca, Sr, Ba phản ứng mãnh liệt. Dựa vào quy luật biến đổi tính chất hợp chất, nguyên nhân chính của sự khác biệt này là do:')],
          options: options([
            'Mg(OH)₂ sinh ra rất ít tan, tạo màng bảo vệ kim loại; và độ tan của các hydroxide nhóm IIA tăng dần từ Mg đến Ba.',
            'Mg(OH)₂ sinh ra rất ít tan, tạo màng bảo vệ kim loại; và độ tan của các hydroxide nhóm IIA giảm dần từ Mg đến Ba.',
            'Mg(OH)₂ sinh ra dễ tan, tạo dung dịch bão hoà cản trở phản ứng; và độ tan của các hydroxide nhóm IIA tăng dần từ Mg đến Ba.',
            'Mg(OH)₂ sinh ra dễ tan, tạo dung dịch bão hoà cản trở phản ứng; và độ tan của các hydroxide nhóm IIA giảm dần từ Mg đến Ba.'
          ]),
          answer: 'A',
          solution: solution('Mg(OH)₂ rất ít tan, bám trên bề mặt Mg ngăn phản ứng tiếp diễn. Độ tan của hydroxide nhóm IIA tăng từ Mg(OH)₂ đến Ba(OH)₂ nên Ca, Sr, Ba phản ứng mạnh.'),
          meta: meta('g12-c7')
        },
        {
          id: 'dn2-13',
          content: [p('Vật liệu composite (vật liệu tổ hợp) đang ngày càng được ứng dụng rộng rãi trong chế tạo vỏ tàu thuyền, thân máy bay, ống dẫn nước... Phát biểu nào sau đây nêu đúng nhất khái niệm về vật liệu composite?')],
          options: options([
            'Là một loại chất dẻo được tổng hợp hoàn toàn từ các monomer chứa vòng benzene để tăng cường độ cứng cơ học.',
            'Là hợp kim của nhiều kim loại chuyển tiếp được pha trộn thêm một số nguyên tố phi kim như carbon, silicon để chống gỉ.',
            'Là vật liệu được tổ hợp từ hai hay nhiều vật liệu khác nhau, tạo ra vật liệu mới có tính chất trội hơn hẳn các vật liệu thành phần.',
            'Là vật liệu polymer thiên nhiên được lưu hóa bằng lưu huỳnh ở nhiệt độ cao để tăng tính đàn hồi và độ bền nhiệt.'
          ]),
          answer: 'C',
          solution: solution('Vật liệu composite gồm vật liệu nền và vật liệu cốt từ hai hay nhiều vật liệu khác nhau, có tính chất vượt trội so với từng thành phần.'),
          meta: meta('g12-c4')
        },
        {
          id: 'dn2-14',
          content: [p('Trong nhiều loại mỹ phẩm dưỡng da, người ta thường sử dụng hợp chất hữu cơ X để giữ ẩm, giúp da mềm mại và không bị khô. Chất X là')],
          options: options([
            'Geraniol, có trong hoa hồng, giúp các hoạt chất khác thẩm thấu tốt hơn.',
            'Hexane, vì không phân cực, nên sẽ hòa tan tốt các chất hữu cơ có trong mỹ phẩm, nên giữ ẩm tốt.',
            'Glycerol, vì có nhiều nhóm –OH nên giữ nước tốt.',
            'Phenol, vì có tính acid rất yếu nên có khả năng tái tạo làn da, làm mềm da.'
          ]),
          answer: 'C',
          solution: solution('Glycerol có ba nhóm –OH, tạo liên kết hydrogen với nước nên hút ẩm và giữ ẩm cho da.'),
          meta: meta('g11-c5')
        },
        {
          id: 'dn2-15',
          content: [p('Phân tử nào sau đây chứa liên kết ba?')],
          options: options(['CH₄', 'N₂', 'H₂O', 'CO₂']),
          answer: 'B',
          solution: solution('N₂ có cấu tạo N≡N (một liên kết ba). CO₂ có hai liên kết đôi; CH₄, H₂O chỉ có liên kết đơn.'),
          meta: meta('g10-c3')
        },
        {
          id: 'dn2-16',
          content: [p('Tinh bột là một trong những nguồn dinh dưỡng quan trọng trong chế độ ăn uống. Nhận định nào sau đây đúng về tinh bột?')],
          options: options([
            'Tinh bột là monosaccharide, tan tốt trong nước và có vị ngọt.',
            'Tinh bột là polysaccharide, gồm các đơn vị fructose liên kết β-1, glycoside 2, tan tốt trong nước.',
            'Tinh bột là disaccharide, tan nhiều trong nước và có vị ngọt.',
            'Tinh bột là polysaccharide, gồm amylose và amylopectin.'
          ]),
          answer: 'D',
          solution: solution('Tinh bột là polysaccharide tạo từ các gốc α-glucose, gồm amylose (không phân nhánh) và amylopectin (phân nhánh); không tan trong nước lạnh, không có vị ngọt.'),
          meta: meta('g12-c2')
        },
        {
          id: 'dn2-17',
          content: [p('Phát biểu nào sau đây đúng khi so sánh xà phòng và chất giặt rửa tổng hợp?')],
          options: options([
            'Cả xà phòng và chất giặt rửa đều không tạo bọt trong nước.',
            'Cả xà phòng và chất giặt rửa đều bị kết tủa trong nước cứng.',
            'Chất giặt rửa tổng hợp hoạt động tốt trong nước cứng hơn xà phòng.',
            'Xà phòng hoạt động tốt trong nước cứng hơn chất giặt rửa tổng hợp.'
          ]),
          answer: 'C',
          solution: solution('Xà phòng tạo kết tủa muối calcium, magnesium của acid béo trong nước cứng nên giảm tác dụng; chất giặt rửa tổng hợp không bị kết tủa nên dùng được với nước cứng.'),
          meta: meta('g12-c1')
        },
        {
          id: 'dn2-18',
          content: [
            p('Giá trị pH thích hợp mà tại đó hợp chất amino acid tồn tại chủ yếu ở dạng ion lưỡng cực và có tổng điện tích bằng không gọi là điểm đẳng điện (pI). Khi pH giảm dần thì dạng ion lưỡng cực chuyển dần thành dạng cation, khi pH tăng dần thì dạng ion lưỡng cực chuyển dần thành dạng anion. Dưới tác dụng của điện trường, các ion di chuyển về các điện cực trái dấu với ion.'),
            p('Một số thông tin về các amino acid cho trong bảng sau:'),
            table(['Amino acid', 'Glutamic acid', 'Alanine', 'Lysine'], [['Điểm đẳng điện (pI)', '3,1', '6,0', '9,8'], ['Dạng tồn tại', 'X', 'Y', 'Z']]),
            p('Phát biểu nào sau đây đúng?')
          ],
          options: options([
            'Ở pH = 9,8 Glutamic acid chuyển thành anion di chuyển về cực âm.',
            'Ở pH = 3,1 Alanine chuyển thành cation di chuyển về âm.',
            'Ở pH = 6,0 Lysine chuyển thành cation di chuyển về điện cực dương.',
            'Ở pH = 6,0 Glutamic acid chuyển thành anion di chuyển về cực âm.'
          ]),
          answer: 'B',
          solution: solution('Ở pH 3,1 < pI(Ala) = 6,0, alanine tồn tại dạng cation, di chuyển về cực âm: B đúng. A, D sai vì anion đi về cực dương; C sai vì cation đi về cực âm.'),
          meta: meta('g12-c3')
        }
      ]
    },
    {
      part: 'II',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 4. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.',
      questions: [
        {
          id: 'dn2-ii1',
          content: [
            p('Thép là hợp kim của sắt (Fe) và carbon, vốn dễ bị ăn mòn khi tiếp xúc với nước biển giàu oxy và muối. Để bảo vệ thép, người ta thường dùng phương pháp điện hóa (gắn khối Mg làm vật hy sinh) hoặc sơn phủ bề mặt.'),
            p('Tuy nhiên, các loại sơn truyền thống chứa chì (Pb) hoặc chromium (Cr) thường gây độc và tích tụ sinh học trong sinh vật biển. Do đó, xu hướng hiện nay là phát triển sơn bio-polymer từ nguyên liệu tái tạo kết hợp với (nano silica SiO₂). Loại sơn mới này vừa thân thiện với môi trường, vừa tạo lớp màng ngăn cách có độ bám dính và độ kín khít cao, giúp bảo vệ công trình bền vững hơn.'),
            p('**Bảng: Thế điện cực chuẩn của một số cặp oxi hóa - khử**'),
            table(['Cặp oxi hóa - khử', 'Mg²⁺/Mg', 'Fe²⁺/Fe', 'Sn²⁺/Sn'], [['E⁰ (V)', '-2,37', '-0,44', '-0,14']])
          ],
          statements: [
            { id: 'a', text: 'Việc lựa chọn sơn bio-polymer nano thay thế cho các dòng sơn chứa chì hay chromium là một phương án đề xuất phù hợp nhằm giải quyết vấn đề ô nhiễm thứ cấp từ kim loại nặng trong môi trường biển.' },
            { id: 'b', text: 'Gắn thiếc (Sn) lên vỏ tàu thép được xem là phương pháp bảo vệ điện hóa giúp ngăn ngừa quá trình ăn mòn kim loại.' },
            { id: 'c', text: 'Phương pháp bảo vệ bề mặt làm thay đổi thế điện cực chuẩn của kim loại, từ đó hạn chế quá trình oxi hóa xảy ra trên bề mặt kim loại.' },
            { id: 'd', text: 'Khi gắn khối Mg vào chân giàn khoan bằng thép, nó sẽ đóng vai trò là cathode và bị oxi hóa thay cho sắt (Fe).' }
          ],
          answer: { a: true, b: false, c: false, d: false },
          solution: solution('a đúng: sơn không chứa kim loại nặng tránh ô nhiễm thứ cấp. b sai: E⁰(Sn²⁺/Sn) = −0,14 V > E⁰(Fe²⁺/Fe) = −0,44 V nên Sn không thể làm vật hy sinh; khi tiếp xúc, Fe mới là anode và bị ăn mòn. c sai: lớp phủ chỉ ngăn tiếp xúc với môi trường, không làm thay đổi thế điện cực chuẩn. d sai: Mg là anode (bị oxi hóa thay cho Fe), thép là cathode.'),
          meta: meta('g12-c6')
        },
        {
          id: 'dn2-ii2',
          content: [
            p('Một học sinh quan sát thấy NaOH để ngoài không khí bị chảy rữa, sau đó xuất hiện lớp chất rắn màu trắng. Học sinh này tìm hiểu được hiện tượng này là do việc hấp thu nước và CO₂ trong không khí. Học sinh đặt ra giả thuyết: “khối lượng của mẫu NaOH để ngoài không khí tăng với tốc độ không đổi theo thời gian”. Để kiểm chứng giả thuyết học sinh tiến hành thí nghiệm như sau:'),
            p('Bước 1: Đặt đĩa thủy tinh lên cân và trừ bì về 0. Mở lọ NaOH, lấy một lượng NaOH cho vào đĩa thấy cân hiển thị đúng 10,350 g.'),
            p('Bước 2: Ngay khi cân xong ở bước 1, bắt đầu bấm giờ.'),
            p('Bước 3: Đặt đĩa thủy tinh lên cân để ghi lại khối lượng tại các thời điểm: t = 1, 5, 10, 20, 30 và 60 phút. Quan sát sự thay đổi vật lý của mẫu NaOH trong đĩa thủy tinh.'),
            p('Từ kết quả thu được học sinh vẽ đồ thị như sau:'),
            figure('ii2-do-thi.png', 1290, 740, 640, 'Đồ thị sự thay đổi khối lượng NaOH theo thời gian: trục hoành là thời gian t (phút), trục tung là khối lượng m (gam). Các điểm (t; m): (0; 10,350), (1; 10,816), (5; 11,592), (10; 12,317), (20; 13,093), (30; 13,662), (60; 14,594). Đường cong tăng nhanh lúc đầu rồi chậm dần.'),
            p('Tốc độ tăng khối lượng trung bình = (m_{sau} − m_{trước}) / (t_{sau} − t_{trước}) (g/phút)')
          ],
          statements: [
            { id: 'a', text: 'Chất rắn màu trắng xuất hiện là muối sinh ra từ phản ứng giữa NaOH và CO₂.' },
            { id: 'b', text: 'Ở bước 1, cần lấy NaOH nhanh chóng và đóng nắp lọ ngay lập tức sau khi lấy xong, nhằm hạn chế tối đa lượng NaOH còn lại trong lọ hấp thụ nước và CO₂.' },
            { id: 'c', text: 'Trong 5 phút đầu tiên từ lúc bấm giờ, tốc độ tăng khối lượng trung bình của mẫu NaOH ở thí nghiệm trên là 0,19 g/phút. (Kết quả các phép tính trung gian không được làm tròn, chỉ kết quả cuối cùng được làm tròn đến hàng đơn vị).' },
            { id: 'd', text: 'Kết quả thí nghiệm phù hợp với giả thuyết ban đầu của học sinh.' }
          ],
          answer: { a: true, b: true, c: false, d: false },
          solution: solution('a đúng: 2NaOH + CO₂ → Na₂CO₃ + H₂O, Na₂CO₃ là chất rắn màu trắng. b đúng. c sai: (11,592 − 10,350)/(5 − 0) = 0,2484 g/phút, không phải 0,19 g/phút. d sai: tốc độ tăng giảm dần theo thời gian (phút đầu 0,466 g/phút; từ 30 đến 60 phút khoảng 0,031 g/phút).'),
          meta: meta('g12-c7')
        },
        {
          id: 'dn2-ii3',
          content: [
            p('Trong công nghiệp, phần lớn phenol và chất A được sản xuất theo sơ đồ sau:'),
            figure('ii3-so-do.png', 1116, 274, 520, 'Sơ đồ sản xuất phenol: benzene cộng propene (xúc tác, t°, p; hiệu suất giai đoạn 95%) tạo cumene (isopropylbenzene); cumene qua hai bước 1. O₂, 2. H₂SO₄ (hiệu suất giai đoạn h%) tạo phenol và chất A có công thức CH₃–CO–CH₃.'),
            p('Để sản xuất 650 000 tấn phenol theo sơ đồ trên, nhà máy cần sử dụng 590 000 tấn benzene làm nguyên liệu đầu vào.')
          ],
          statements: [
            { id: 'a', text: 'Trong sơ đồ trên, phản ứng giữa cumene và oxygen là phản ứng oxi hóa hoàn toàn.' },
            { id: 'b', text: 'Giá trị của h là 96. (Kết quả các phép tính trung gian không được làm tròn, chỉ kết quả cuối cùng được làm tròn đến hàng đơn vị).' },
            { id: 'c', text: 'Do ảnh hưởng của nhóm –OH nên phản ứng thế nguyên tử hydrogen trên vòng benzene của phenol xảy ra dễ hơn so với benzene.' },
            { id: 'd', text: 'Chất A có tên thông thường là propan-2-one.' }
          ],
          answer: { a: false, b: true, c: true, d: false },
          solution: solution('a sai: cumene bị oxi hóa thành cumene hydroperoxide, không cháy thành CO₂ và H₂O. b đúng: xem tấn như gam, h = (650 000/94) / (590 000/78 × 0,95) × 100 ≈ 96,2 ⇒ 96. c đúng: nhóm –OH làm tăng mật độ electron trên vòng. d sai: propan-2-one là tên thay thế; tên thông thường là acetone.'),
          meta: meta('g11-c5', 'g11-c6')
        },
        {
          id: 'dn2-ii4',
          content: [
            p('Omega-3 và omega-6 là hai nhóm acid béo không no thiết yếu, cơ thể người không tự tổng hợp được mà phải lấy từ thức ăn. Omega-3 có nhiều trong dầu cá, dầu hạt lanh; omega-6 có nhiều trong dầu đậu nành, dầu hướng dương. Trong cơ thể, chất béo được thủy phân nhờ enzyme lipase, giải phóng acid béo tự do. Việc cân bằng tỉ lệ omega-6 và omega-3 trong khẩu phần ăn có ý nghĩa quan trọng trong phòng chống viêm nhiễm và bệnh tim mạch. Dưới đây là cấu trúc của hai phân tử chất béo tiêu biểu: một chất béo không no được tạo thành từ acid béo omega-6, và một chất béo no được tạo thành từ acid béo no:'),
            figure('ii4-chat-beo.png', 1560, 384, 700, 'Công thức khung của hai chất béo. Trilinolein: ba gốc acid béo mạch dài, mỗi gốc có hai liên kết đôi C=C, nối với glycerol qua liên kết ester. Tristearin: ba gốc acid béo no mạch dài (không có liên kết đôi C=C) nối với glycerol qua liên kết ester.')
          ],
          statements: [
            { id: 'a', text: 'Acid béo thuộc nhóm omega-3 và omega-6 cũng được sinh ra từ phản ứng thủy phân chất béo trong môi trường base.' },
            { id: 'b', text: 'Dầu cá chứa nhiều omega-3, còn dầu thực vật như dầu đậu nành chứa chủ yếu omega-6; do đó để phòng bệnh tim mạch, nên ưu tiên dùng dầu cá hoàn toàn thay thế dầu thực vật.' },
            { id: 'c', text: 'Chất béo tạo từ gốc acid omega-3 và omega-6 dễ bị oxi hóa trong không khí, tạo các hợp chất có mùi khó chịu do có chứa liên kết đôi C=C.' },
            { id: 'd', text: 'Trilinolein có nhiệt độ nóng chảy thấp hơn so với tristearin.' }
          ],
          answer: { a: false, b: false, c: true, d: true },
          solution: solution('a sai: thủy phân trong môi trường base tạo muối của acid béo (xà phòng), không tạo acid béo tự do. b sai: cần cân bằng tỉ lệ omega-6/omega-3, không thay thế hoàn toàn. c đúng: liên kết đôi C=C dễ bị oxi hóa (chất béo bị ôi). d đúng: gốc acid không no làm mạch gấp khúc, các phân tử xếp kém chặt nên nhiệt độ nóng chảy thấp hơn chất béo no.'),
          meta: meta('g12-c1')
        }
      ]
    },
    {
      part: 'III',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 6.',
      questions: [
        {
          id: 'dn2-iii1',
          content: [
            p('Cho cấu tạo của một đoạn mạch trong phân tử polymer X:'),
            figure('iii1-polymer.png', 530, 248, 260, 'Đoạn mạch polymer X gồm 5 nguyên tử carbon nối tiếp: mỗi carbon có một H ở trên; ở dưới lần lượt là Cl, H, Cl, H, Cl. Mắt xích lặp lại là –CH₂–CHCl–.'),
            p('Monomer tổng hợp nên polymer X có phân tử khối bằng bao nhiêu amu?')
          ],
          answer: '62,5',
          solution: solution('Mắt xích –CH₂–CHCl– là của poly(vinyl chloride); monomer là vinyl chloride CH₂=CHCl (C₂H₃Cl), M = 2 × 12 + 3 + 35,5 = 62,5 amu.'),
          meta: meta('g12-c4')
        },
        {
          id: 'dn2-iii2',
          content: [p('Amine X có công thức phân tử là C₄H₁₁N. Cho X phản ứng với hỗn hợp dung dịch HCl và NaNO₂ ở nhiệt độ thường không thấy có khí thoát ra. Có bao nhiêu công thức cấu tạo phù hợp với X?')],
          answer: '4',
          solution: solution('Chỉ amine bậc một no giải phóng N₂ với HNO₂; X là amine bậc hai hoặc bậc ba. Bậc hai: CH₃NHCH₂CH₂CH₃, CH₃NHCH(CH₃)₂, CH₃CH₂NHCH₂CH₃. Bậc ba: (CH₃)₂NCH₂CH₃. Có 4 công thức.'),
          meta: meta('g12-c3')
        },
        {
          id: 'dn2-iii3',
          content: [
            p('Để tìm hiểu những điều kiện cần thiết để ăn mòn điện hóa, một học sinh đã thiết lập thí nghiệm như hình sau:'),
            figure('iii3-ong-nghiem.png', 1510, 700, 620, 'Bốn ống nghiệm đậy nắp, mỗi ống chứa ba đinh sắt. Ống A: đinh nhúng một phần trong nước cất, phía trên là không khí. Ống B: không khí khô, đáy có CaCl₂ khan. Ống C: đinh ngập trong nước cất đã đun sôi, phủ lớp dầu hỏa, phía trên là không khí. Ống D: đinh nhúng một phần trong nước biển, phía trên là khí O₂.'),
            p('Có bao nhiêu ống nghiệm chứa đinh sắt sau vài ngày sẽ không bị gỉ ?')
          ],
          answer: '2',
          solution: solution('Sắt chỉ bị gỉ khi có đồng thời nước và O₂. Ống B (không khí khô) và ống C (nước đã đun sôi đuổi O₂, lớp dầu hỏa ngăn không khí) không bị gỉ. Ống A, D bị gỉ. Có 2 ống không bị gỉ.'),
          meta: meta('g12-c6')
        },
        {
          id: 'dn2-iii4',
          content: [
            p('Trong phòng thí nghiệm, để khảo sát phản ứng thủy phân tinh bột, một nhóm học sinh chuẩn bị ba ống nghiệm, mỗi ống chứa khoảng 2 mL dung dịch hồ tinh bột 1% (đánh số 1, 2, 3) và tiến hành thí nghiệm theo các bước sau:'),
            list([
              'Bước 1: thêm khoảng 1 mL dung dịch HCl 1M vào ống nghiệm thứ nhất.',
              'Bước 2: thêm khoảng 1 mL dung dịch HCl 2M vào ống nghiệm thứ hai.',
              'Bước 3: Thêm khoảng 1 mL nước cất vào ống nghiệm thứ ba.',
              'Bước 4: Lắc đều, rồi đặt cả 3 ống nghiệm trong nồi nước nóng, đun cách thủy trong 10 phút. Sau đó để nguội.',
              'Bước 5: Chia mỗi ống nghiệm thành hai phần:',
              '– Phần 1: cho tác dụng với dung dịch iodine.',
              '– Phần 2: thêm từng giọt dung dịch NaOH 1M cho đến môi trường kiềm, sau đó cho 1 ml thuốc thử Tollens vào, đun cách thủy.'
            ]),
            p('Sau thí nghiệm thu được bảng kết quả:'),
            table(['Ống', 'I₂', 'Tollens'], [['(1)', 'xanh tím', 'có kết tủa bạc'], ['(2)', 'không đổi màu', 'có kết tủa bạc'], ['(3)', 'xanh tím', 'không có kết tủa bạc']]),
            p('Cho các nhận định sau:'),
            list([
              '(1) Ở ống nghiệm (1), tinh bột chưa bị thủy phân',
              '(2) Ở ống nghiệm (2), hỗn hợp sau phản ứng không còn tinh bột.',
              '(3) Ở ống nghiệm (3), có glucose tạo thành.',
              '(4) Acid làm phản ứng thủy phân xảy ra nhanh hơn.',
              '(5) Dựa vào phản ứng Tollens, không thể kết luận mẫu không còn tinh bột.'
            ]),
            p('Trong các nhận định trên, số nhận định đúng là')
          ],
          answer: '3',
          solution: solution('(1) sai: ống (1) có kết tủa bạc nên tinh bột đã bị thủy phân một phần. (2) đúng: không còn màu với iodine. (3) sai: ống (3) không có kết tủa bạc. (4) đúng. (5) đúng: Tollens chỉ cho biết có glucose. Có 3 nhận định đúng.'),
          meta: meta('g12-c2')
        },
        {
          id: 'dn2-iii5',
          content: [
            p('Phương pháp trao đổi ion để làm mềm nước cứng được thực hiện bằng cách cho nước cứng đi qua lớp vật liệu hay màng vật liệu trao đổi ion. Các vật liệu này có chứa cation kim loại, như Na⁺. Khi cho nước cứng đi qua vật liệu, các cation Ca²⁺ và Mg²⁺ đẩy cation Na⁺ ra khỏi vật liệu. Các cation Ca²⁺ và Mg²⁺ bị giữ lại trên vật liệu.'),
            p('Thiết bị làm mềm nước cứng (sử dụng vật liệu trao đổi ion) cần thêm NaCl để thay thế các ion Ca²⁺ và Mg²⁺ đang bám trên vật liệu bằng ion Na⁺, giúp phục hồi vật liệu để tiếp tục làm mềm nước.'),
            p('Một thiết bị làm mềm nước cứng (sử dụng vật liệu trao đổi ion) đã hoàn toàn hết công suất và được tái tạo bằng cách cho 100 lít dung dịch sodium chloride chứa 120 g/lít NaCl chảy qua.'),
            p('Thiết bị này có thể làm mềm được bao nhiêu m³ mẫu nước cứng có số đơn vị độ cứng là 10 ? (Không làm tròn kết quả các phép tính trung gian, chỉ làm tròn kết quả cuối cùng đến hàng phần mười).'),
            p('Biết một 1 đơn vị độ cứng tương ứng với tổng số mol của các ion Ca²⁺ và Mg²⁺ bằng 0,5 mmol trong 1,0 L nước. Giả sử vật liệu trao đổi ion hoạt động với hiệu suất 100%.')
          ],
          answer: '20,5',
          solution: solution('n(NaCl) = 100 × 120 / 58,5 = 205,13 mol Na⁺ ⇒ giữ được 102,56 mol (Ca²⁺ + Mg²⁺). Nước có độ cứng 10 chứa 10 × 0,5 = 5 mmol/L. V = 102,56 / 0,005 = 20 513 L ≈ 20,5 m³ (Na = 23, Cl = 35,5).'),
          meta: meta('g12-c7')
        },
        {
          id: 'dn2-iii6',
          content: [
            p('Trinitroglycerin, C₃H₅N₃O₉ (thường gọi đơn giản là nitroglycerin) là chất nổ mạnh được Alfred Nobel chế tạo thành thuốc nổ dynamite vào năm 1866. Điều khá bất ngờ là nó cũng được sử dụng như một loại thuốc, để giảm đau thắt ngực (đau ngực do động mạch đến tim bị tắc một phần) bằng cách làm giãn mạch máu.'),
            p('Ở điều kiện chuẩn, biến thiên enthalpy của phản ứng phân hủy 1 mol trinitroglycerin tạo thành khí nitrogen, khí carbon dioxide, nước lỏng và khí oxygen là -1541,4 kJ.'),
            p('Biết biến thiên enthalpy tạo thành chuẩn của CO₂(g) và H₂O(l) lần lượt là –393,5 kJ/mol, –285,8 kJ/mol. Biến thiên enthalpy tạo thành chuẩn của trinitroglycerin là bao nhiêu kJ/mol ? (Không làm tròn kết quả các phép tính trung gian, chỉ làm tròn kết quả cuối cùng đến hàng đơn vị).')
          ],
          answer: '-354',
          solution: solution('C₃H₅N₃O₉(l) → 3/2 N₂(g) + 3CO₂(g) + 5/2 H₂O(l) + 1/4 O₂(g). ΔrH = 3(−393,5) + 2,5(−285,8) − ΔfH = −1541,4 ⇒ ΔfH = −1180,5 − 714,5 + 1541,4 = −353,6 ≈ −354 kJ/mol.'),
          meta: meta('g10-c5')
        }
      ]
    }
  ]
}
