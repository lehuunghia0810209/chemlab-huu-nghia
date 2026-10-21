// Đề khảo sát chất lượng môn thi tốt nghiệp THPT năm 2026 – lần 1, Sở GD&ĐT
// Đồng Nai, môn Hóa học, ca 1 — mã đề 0301 (đề thi chính thức của kì khảo sát).
// Ca 1 has 24 codes (0301–0324) that permute the same 28 questions; one code is
// integrated to avoid duplicate papers. Source files were provided by the
// project owner: Ma_de_0301.pdf and the Sở's answer key (xlsx and PDF, row 0301;
// hashes and the per-question check list: docs/exam/papers/dong-nai-2026-l1-0301.md).
// Figures are crops of the original pages; solutions are written by ChemLab.

const figure = (file, width, height, displayWidth, alt) => ({ type: 'figure', src: new URL(`./assets/dong-nai-2026-l1-0301/${file}`, import.meta.url).href, width, height, displayWidth, alt })
const p = text => ({ type: 'p', text })
const list = items => ({ type: 'list', items })
const table = (head, rows) => ({ type: 'table', head, rows })
const eq = (text, condition = '') => ({ type: 'equation', text, condition })
const options = texts => ['A', 'B', 'C', 'D'].map((id, index) => ({ id, text: texts[index] }))
const solution = text => ({ text, official: false })
const meta = (...chapters) => ({ status: 'internal', chapters })

const AMINO_INTRO = 'Giá trị pH thích hợp mà tại đó hợp chất amino acid tồn tại chủ yếu ở dạng ion lưỡng cực và có tổng điện tích bằng không gọi là điểm đẳng điện (pI). Khi pH giảm dần thì dạng ion lưỡng cực chuyển dần thành dạng cation, khi pH tăng dần thì dạng ion lưỡng cực chuyển dần thành dạng anion. Dưới tác dụng của điện trường, các ion di chuyển về các điện cực trái dấu với ion.'
const ION_EXCHANGE = [
  p('Phương pháp trao đổi ion để làm mềm nước cứng được thực hiện bằng cách cho nước cứng đi qua lớp vật liệu hay màng vật liệu trao đổi ion. Các vật liệu này có chứa cation kim loại, như Na⁺. Khi cho nước cứng đi qua vật liệu, các cation Ca²⁺ và Mg²⁺ đẩy cation Na⁺ ra khỏi vật liệu. Các cation Ca²⁺ và Mg²⁺ bị giữ lại trên vật liệu.'),
  p('Thiết bị làm mềm nước cứng (sử dụng vật liệu trao đổi ion) cần thêm NaCl để thay thế các ion Ca²⁺ và Mg²⁺ đang bám trên vật liệu bằng ion Na⁺, giúp phục hồi vật liệu để tiếp tục làm mềm nước.')
]

export default {
  id: 'dong-nai-2026-l1-0301',
  title: 'Đề khảo sát chất lượng tốt nghiệp THPT 2026 lần 1 — Sở GD&ĐT Đồng Nai — Hóa học (ca 1, mã đề 0301)',
  kind: 'provincial-exam',
  blueprint: 'thpt-2025-hoa',
  license: 'owner-attested',
  dataVersion: 1,
  timeLimitMinutes: 50,
  variant: '0301',
  source: {
    authority: 'Sở GD&ĐT Đồng Nai',
    file: { name: 'Ma_de_0301.pdf', sha256: '446f465bf6f26ae9fea5c082a5b4bd4bc9849092970367cada355e2cf283aeed' },
    originalTitle: 'Kỳ thi khảo sát chất lượng môn thi tốt nghiệp THPT năm 2026 – lần 1 — Đề thi chính thức — Môn thi: Hóa học — Mã đề 0301',
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
          id: 'dn1-1',
          content: [
            p('Cho các quá trình sau:'),
            eq('(1) CH₄ + Cl₂ → CH₃Cl + HCl', 'as'),
            eq('(2) C₃H₈ → C₂H₄ + CH₄', 'p, t°'),
            eq('(3) CH₄ + 2O₂ → CO₂ + 2H₂O', 't°'),
            eq('(4) 2CH₄ + 3O₂ → 2CO + 4H₂O', 't°'),
            p('Các quá trình 1, 2, 3, 4 lần lượt thuộc loại phản ứng nào?')
          ],
          options: options([
            'Thế; reforming; oxi hoá hoàn toàn; oxi hoá không hoàn toàn.',
            'Cộng; cracking; oxi hoá hoàn toàn; oxi hoá không hoàn toàn.',
            'Thế; cracking; oxi hoá hoàn toàn; oxi hoá không hoàn toàn.',
            'Thế; cracking; oxi hoá không hoàn toàn; oxi hoá hoàn toàn.'
          ]),
          answer: 'C',
          solution: solution('(1) Cl thay thế H của CH₄: phản ứng thế. (2) Alkane mạch dài bị bẻ gãy thành alkene và alkane ngắn hơn: cracking. (3) Đốt cháy tạo CO₂: oxi hóa hoàn toàn. (4) Tạo CO (carbon chưa đạt số oxi hóa cao nhất): oxi hóa không hoàn toàn.'),
          meta: meta('g11-c4')
        },
        {
          id: 'dn1-2',
          content: [p('Kim loại nào sau đây có tính dẻo cao nhất, có thể dát thành những màng cực mỏng (đến mức ánh sáng có thể xuyên qua được) và thường được ứng dụng để phủ (thếp) lên bề mặt các tác phẩm mĩ nghệ, tượng hoặc các công trình kiến trúc nhằm mục đích trang trí?')],
          options: options(['Ag (Bạc).', 'Cu (Đồng).', 'Al (Nhôm).', 'Au (Vàng).']),
          answer: 'D',
          solution: solution('Vàng là kim loại dẻo nhất, dát được thành lá mỏng đến mức ánh sáng xuyên qua; vàng lá dùng để thếp lên tượng, đồ mĩ nghệ.'),
          meta: meta('g12-c6')
        },
        {
          id: 'dn1-3',
          content: [p('Trong các phân tử sau, phân tử nào có chứa liên kết đôi?')],
          options: options(['CO₂', 'CH₄', 'H₂O', 'NH₃']),
          answer: 'A',
          solution: solution('CO₂ có cấu tạo O=C=O (hai liên kết đôi). CH₄, H₂O, NH₃ chỉ có liên kết đơn.'),
          meta: meta('g10-c3')
        },
        {
          id: 'dn1-4',
          content: [p('Saccharose được dùng phổ biến trong thực phẩm. Phát biểu nào sau đây **đúng** về saccharose?')],
          options: options([
            'là disaccharide, tạo từ glucose và fructose, tan tốt trong nước.',
            'là disaccharide, không tan trong nước, có vị nhạt.',
            'là polysaccharide gồm nhiều đơn vị glucose liên kết α-1,4-glycoside.',
            'là monosaccharide, tan tốt trong nước, có vị ngọt.'
          ]),
          answer: 'A',
          solution: solution('Saccharose là disaccharide gồm một gốc α-glucose và một gốc β-fructose, tan tốt trong nước và có vị ngọt.'),
          meta: meta('g12-c2')
        },
        {
          id: 'dn1-5',
          content: [p('Phát biểu nào sau đây **đúng** về tính chất của amoniac (NH₃)?')],
          options: options([
            'NH₃ không tan trong nước và có tính khử mạnh.',
            'NH₃ tan tốt trong nước và là bazơ yếu.',
            'NH₃ tan tốt trong nước nhưng không có tính khử.',
            'NH₃ không tan trong nước và không có tính bazơ.'
          ]),
          answer: 'B',
          solution: solution('NH₃ tan rất tốt trong nước, dung dịch có tính base yếu. NH₃ vẫn có tính khử (N có số oxi hóa −3) nên C sai.'),
          meta: meta('g11-c2')
        },
        {
          id: 'dn1-6',
          content: [p('Hợp chất của một kim loại nhóm IIA (nhóm kim loại kiềm thổ) được sử dụng rộng rãi làm vật liệu xây dựng (thành phần chính của đá vôi, vỏ sò, xi măng). Nguyên tố kim loại đó là:')],
          options: options(['Aluminum (Al).', 'Calcium (Ca).', 'Iron (Fe).', 'Sodium (Na).']),
          answer: 'B',
          solution: solution('Đá vôi, vỏ sò chứa chủ yếu CaCO₃; xi măng chứa các hợp chất của calcium. Ca thuộc nhóm IIA.'),
          meta: meta('g12-c7')
        },
        {
          id: 'dn1-7',
          content: [p('Quá trình lưu hoá cao su tự nhiên tạo ra sản phẩm (cao su lưu hoá) có tính đàn hồi, chịu ma sát và chịu nhiệt tốt hơn. Nguyên nhân dẫn đến sự cải thiện tính chất này là do:')],
          options: options([
            'Sự hình thành các cầu nối disulfide (-S-S-) liên kết các mạch polymer lại với nhau tạo nên cấu trúc mạng lưới không gian.',
            'Sự thay thế các nguyên tử hydrogen trong mạch polymer bằng các nguyên tử sulfur, tạo ra khối vật liệu cứng hơn.',
            'Sulfur đóng vai trò như một chất xúc tác, làm tăng lực tương tác van der Waals giữa các mạch polymer.',
            'Sự cộng hợp nguyên tử sulfur vào toàn bộ các liên kết đôi C=C làm bão hoà hoàn toàn mạch hydrocarbon của cao su.'
          ]),
          answer: 'A',
          solution: solution('Khi lưu hóa, các cầu –S–S– nối các mạch polyisoprene với nhau thành mạng không gian, nên cao su đàn hồi, bền nhiệt và chịu mài mòn tốt hơn. Chỉ một phần liên kết đôi tham gia, không bão hòa toàn bộ.'),
          meta: meta('g12-c4')
        },
        {
          id: 'dn1-8',
          content: [p('Khi quan sát các vật dụng bằng sắt (thép) như đinh, búa, xẻng để lâu ngoài không khí ẩm, ta thường thấy chúng xuất hiện lớp gỉ màu nâu đỏ, xốp và làm vật dụng trở nên giòn, dễ gãy. Phát biểu nào sau đây trình bày đúng khái niệm về hiện tượng ăn mòn kim loại xảy ra trong ví dụ trên?')],
          options: options([
            'Là sự biến đổi trạng thái vật lí của kim loại từ rắn sang lỏng do hấp thụ hơi ẩm từ môi trường.',
            'Là quá trình kim loại tự bay hơi từ từ vào không khí do sự chênh lệch nhiệt độ giữa ngày và đêm.',
            'Là sự bào mòn bề mặt kim loại do các tác động va đập cơ học trong quá trình con người sử dụng.',
            'Là sự phá huỷ kim loại hoặc hợp kim do tác dụng hoá học, điện hoá của các chất trong môi trường xung quanh.'
          ]),
          answer: 'D',
          solution: solution('Ăn mòn kim loại là sự phá hủy kim loại hoặc hợp kim do tác dụng hóa học hoặc điện hóa của môi trường; gỉ sắt là sản phẩm của quá trình đó.'),
          meta: meta('g12-c6')
        },
        {
          id: 'dn1-9',
          content: [p('Phát biểu nào sau đây đúng?')],
          options: options([
            'Ester là hợp chất chỉ chứa nguyên tố C và H.',
            'Acid béo là hợp chất hữu cơ chứa nhiều nhóm –COOH.',
            'Chất béo là triester của glycerol với acid béo.',
            'Lipid là những hợp chất hữu cơ tan tốt trong nước và không tan trong dung môi hữu cơ.'
          ]),
          answer: 'C',
          solution: solution('Chất béo là triester của glycerol với acid béo. Ester chứa cả O; acid béo là monocarboxylic acid; lipid không tan trong nước, tan trong dung môi hữu cơ.'),
          meta: meta('g12-c1')
        },
        {
          id: 'dn1-10',
          content: [p('Khi đi từ Lithium (Li) đến Cesium (Cs) trong nhóm kim loại kiềm (nhóm IA), tính khử của các nguyên tử kim loại có xu hướng tăng dần. Nguyên nhân chính giải thích cho quy luật này là:')],
          options: options([
            'Bán kính nguyên tử tăng đáng kể làm giảm lực hút của hạt nhân đối với electron hóa trị ngoài cùng.',
            'Nhiệt độ nóng chảy giảm dần, khiến cho mạng tinh thể kim loại dễ bị phá vỡ để giải phóng electron.',
            'Khối lượng nguyên tử tăng dần, làm cho các kim loại có xu hướng dễ dàng nhường electron hơn trong phản ứng.',
            'Điện tích hạt nhân tăng dần, làm cho electron hóa trị có nhiều năng lượng và càng dễ tách ra khỏi nguyên tử.'
          ]),
          answer: 'A',
          solution: solution('Từ Li đến Cs số lớp electron tăng, bán kính tăng mạnh nên lực hút của hạt nhân với electron ngoài cùng giảm, năng lượng ion hóa giảm, tính khử tăng.'),
          meta: meta('g12-c7', 'g10-c2')
        },
        {
          id: 'dn1-11',
          content: [p('Dựa vào nguồn gốc, các loại tơ được phân chia thành tơ tự nhiên, tơ tổng hợp và tơ bán tổng hợp (tơ nhân tạo). Trong các loại polymer dưới đây, chất nào thuộc loại tơ bán tổng hợp?')],
          options: options(['Tơ tằm.', 'Tơ nitron.', 'Tơ capron.', 'Tơ visco.']),
          answer: 'D',
          solution: solution('Tơ visco được chế biến từ cellulose (polymer thiên nhiên) nên là tơ bán tổng hợp. Tơ tằm là tơ thiên nhiên; nitron, capron là tơ tổng hợp.'),
          meta: meta('g12-c4')
        },
        {
          id: 'dn1-12',
          content: [p('Trong một pin điện hoá Galvani Zn-Cu đang hoạt động tạo ra dòng điện, điện cực kẽm (Zn) có vai trò là:')],
          options: options([
            'Cathode, nơi xảy ra quá trình oxi hóa và đóng vai trò là cực dương của pin.',
            'Anode, nơi xảy ra quá trình oxi hoá và đóng vai trò là cực âm của pin.',
            'Cathode, nơi xảy ra quá trình khử và đóng vai trò là cực dương của pin.',
            'Anode, nơi xảy ra quá trình khử và đóng vai trò là cực âm của pin.'
          ]),
          answer: 'B',
          solution: solution('Zn có thế điện cực chuẩn nhỏ hơn Cu nên bị oxi hóa: Zn → Zn²⁺ + 2e. Trong pin Galvani, điện cực xảy ra sự oxi hóa là anode và là cực âm.'),
          meta: meta('g12-c5')
        },
        {
          id: 'dn1-13',
          content: [
            p(AMINO_INTRO),
            p('Một số thông tin về các amino acid cho trong bảng sau:'),
            table(['Amino acid', 'Glutamic acid', 'Alanine', 'Lysine'], [['Điểm đẳng điện (pI)', '3,1', '6,0', '9,8']]),
            p('Phát biểu nào sau đây đúng?')
          ],
          options: options([
            'Ở pH = 3,1 Alanine chuyển thành cation di chuyển về cực dương.',
            'Ở pH = 6,0 Lysine chuyển thành cation di chuyển về điện cực dương.',
            'Ở pH = 6,0 Glutamic acid chuyển thành anion di chuyển về cực âm.',
            'Ở pH = 9,8 Glutamic acid chuyển thành anion di chuyển về cực dương.'
          ]),
          answer: 'D',
          solution: solution('Ở pH > pI amino acid tồn tại chủ yếu dạng anion và di chuyển về cực dương; ở pH < pI tồn tại dạng cation và di chuyển về cực âm. Ở pH 9,8 > 3,1 glutamic acid là anion, đi về cực dương: D đúng. A, B sai vì cation đi về cực âm; C sai vì anion đi về cực dương.'),
          meta: meta('g12-c3')
        },
        {
          id: 'dn1-14',
          content: [p('Bình xịt gây tê trong thể thao là dụng cụ y tế khẩn cấp giúp làm đông lạnh cục bộ, tê liệt dây thần kinh cảm giác để giảm đau, sưng tấy tức thì khi bị va chạm, bong gân hoặc căng cơ. Trong một số bình xịt gây tê, người ta sử dụng một hợp chất hữu cơ X. Chất X là')],
          options: options([
            'C₂H₅Cl, vì khi bay hơi thu nhiệt mạnh từ môi trường.',
            'C₂H₅OH, vì có khả năng tạo liên kết hydrogen và sát khuẩn.',
            'C₂H₆, vì không phân cực nên hấp thụ nhiệt tốt.',
            'CH₃OH, vì khi bay hơi tỏa nhiệt mạnh vào môi trường.'
          ]),
          answer: 'A',
          solution: solution('Chloroethane (nhiệt độ sôi khoảng 12 °C) bay hơi rất nhanh trên da và thu nhiệt mạnh, làm lạnh và gây tê tại chỗ.'),
          meta: meta('g11-c5')
        },
        {
          id: 'dn1-15',
          content: [p('Tên gốc – chức của hợp chất CH₃CH₂NH₂ là')],
          options: options(['Dimethylamine.', 'Methylamine.', 'Ethylamine.', 'Propylamine.']),
          answer: 'C',
          solution: solution('Gốc C₂H₅– (ethyl) gắn với nhóm –NH₂: ethylamine.'),
          meta: meta('g12-c3')
        },
        {
          id: 'dn1-16',
          content: [p('Phát biểu nào sau đây **đúng** khi so sánh xà phòng và chất giặt rửa tổng hợp?')],
          options: options([
            'Xà phòng là muối của axit béo, còn chất giặt rửa tổng hợp thì không.',
            'Cả hai đều là muối của axit béo.',
            'Cả hai đều không tan trong nước.',
            'Chất giặt rửa tổng hợp là este, còn xà phòng là ancol.'
          ]),
          answer: 'A',
          solution: solution('Xà phòng là muối sodium/potassium của acid béo; chất giặt rửa tổng hợp (ví dụ sodium alkylbenzenesulfonate) không phải muối của acid béo. Cả hai đều tan trong nước.'),
          meta: meta('g12-c1')
        },
        {
          id: 'dn1-17',
          content: [p('Tiến hành điện phân dung dịch CuCl₂ với các điện cực trơ. Quan sát thấy tại cathode có lớp kim loại bám vào và anode có khí thoát ra. Nhận định nào sau đây mô tả đúng bản chất các quá trình hoá học xảy ra tại các điện cực?')],
          options: options([
            'Tại cathode xảy ra quá trình khử ion Cu²⁺ và tại anode xảy ra quá trình oxi hóa phân tử H₂O.',
            'Tại cathode xảy ra quá trình khử ion Cu²⁺ và tại anode xảy ra quá trình oxi hoá ion Cl⁻.',
            'Tại cathode xảy ra quá trình oxi hóa ion Cu²⁺ và tại anode xảy ra quá trình khử ion Cl⁻.',
            'Tại cathode xảy ra quá trình khử phân tử H₂O và tại anode xảy ra quá trình oxi hóa ion Cl⁻.'
          ]),
          answer: 'B',
          solution: solution('Cathode: Cu²⁺ + 2e → Cu (kim loại bám vào). Anode: 2Cl⁻ → Cl₂ + 2e (khí thoát ra). Ion Cl⁻ bị oxi hóa trước H₂O.'),
          meta: meta('g12-c5')
        },
        {
          id: 'dn1-18',
          content: [p('Mùi tanh của cá chủ yếu do các amine (như trimethylamine) gây ra. Để khử mùi tanh này trong quá trình sơ chế, người ta thường dùng giấm ăn (chứa chất X) là do:')],
          options: options([
            'Acetic acid và nước tạo lớp màng bảo vệ trên bề mặt cá, ngăn không cho các amine tiếp xúc với không khí.',
            'Acetic acid có trong giấm ăn phản ứng với các amine tạo thành muối tan trong nước, dễ dàng bị rửa trôi.',
            'Acetic acid có trong giấm làm xúc tác cho quá trình phân hủy các amine thành những chất khí không mùi.',
            'Nước có trong giấm ăn đã hòa tan các amine thành dung dịch bão hòa, ngăn chặn sự bay hơi của mùi tanh.'
          ]),
          answer: 'B',
          solution: solution('Amine có tính base, phản ứng với acetic acid tạo muối ammonium tan trong nước, không bay hơi nên rửa trôi được và hết mùi tanh.'),
          meta: meta('g12-c3')
        }
      ]
    },
    {
      part: 'II',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 4. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.',
      questions: [
        {
          id: 'dn1-ii1',
          content: [
            p('Thép là hợp kim của sắt (Fe) và carbon, vốn dễ bị ăn mòn khi tiếp xúc với nước biển giàu oxy và muối. Để bảo vệ thép, người ta thường dùng phương pháp điện hóa (gắn khối Mg làm vật hy sinh) hoặc sơn phủ bề mặt.'),
            p('Tuy nhiên, các loại sơn truyền thống chứa chì (Pb) hoặc chromium (Cr) thường gây độc và tích tụ sinh học trong sinh vật biển. Do đó, xu hướng hiện nay là phát triển sơn bio-polymer từ nguyên liệu tái tạo kết hợp với (nano silica SiO₂). Loại sơn mới này vừa thân thiện với môi trường, vừa tạo lớp màng ngăn cách có độ bám dính và độ kín khít cao, giúp bảo vệ công trình bền vững hơn.'),
            p('**Bảng: Thế điện cực chuẩn của một số cặp oxi hóa - khử**'),
            table(['Cặp oxi hóa - khử', 'Mg²⁺/Mg', 'Fe²⁺/Fe', 'Sn²⁺/Sn'], [['E⁰ (V)', '-2,37', '-0,44', '-0,14']])
          ],
          statements: [
            { id: 'a', text: 'Phương pháp bảo vệ bề mặt làm thay đổi thế điện cực chuẩn của kim loại, từ đó hạn chế quá trình oxi hóa xảy ra trên bề mặt kim loại.' },
            { id: 'b', text: 'Việc lựa chọn sơn bio-polymer nano thay thế cho các dòng sơn chứa chì hay chromium là một phương án đề xuất phù hợp nhằm giải quyết vấn đề ô nhiễm thứ cấp từ kim loại nặng trong môi trường biển.' },
            { id: 'c', text: 'Gắn thiếc (Sn) lên vỏ tàu thép được xem là phương pháp bảo vệ điện hóa giúp ngăn ngừa quá trình ăn mòn kim loại.' },
            { id: 'd', text: 'Khi gắn khối Mg vào chân giàn khoan bằng thép, nó sẽ đóng vai trò là cathode và bị oxi hóa thay cho sắt (Fe).' }
          ],
          answer: { a: false, b: true, c: false, d: false },
          solution: solution('a sai: lớp phủ chỉ ngăn kim loại tiếp xúc với môi trường, không làm thay đổi thế điện cực chuẩn (một hằng số của cặp oxi hóa – khử). b đúng: sơn không chứa kim loại nặng tránh ô nhiễm thứ cấp. c sai: E⁰(Sn²⁺/Sn) = −0,14 V > E⁰(Fe²⁺/Fe) = −0,44 V nên Sn không thể làm vật hy sinh; khi tiếp xúc, Fe mới là anode và bị ăn mòn. d sai: Mg là anode (bị oxi hóa thay cho Fe), thép là cathode.'),
          meta: meta('g12-c6')
        },
        {
          id: 'dn1-ii2',
          content: [
            p('Một học sinh quan sát thấy NaOH để ngoài không khí bị chảy rữa, sau đó xuất hiện lớp chất rắn màu trắng. Học sinh này tìm hiểu được hiện tượng này là do việc hấp thu nước và CO₂ trong không khí. Học sinh đặt ra giả thuyết: “khối lượng của mẫu NaOH để ngoài không khí tăng với tốc độ không đổi theo thời gian”. Để kiểm chứng giả thuyết học sinh tiến hành thí nghiệm như sau:'),
            p('Bước 1: Đặt đĩa thủy tinh lên cân và trừ bì về 0. Mở lọ NaOH, lấy một lượng NaOH cho vào đĩa thấy cân hiển thị đúng 10,350 g.'),
            p('Bước 2: Ngay khi cân xong ở bước 1, bắt đầu bấm giờ.'),
            p('Bước 3: Đặt đĩa thủy tinh lên cân để ghi lại khối lượng tại các thời điểm: t = 1; 5; 10; 20; 30 và 60 phút. Quan sát sự thay đổi vật lý của mẫu NaOH trong đĩa thủy tinh.'),
            p('Từ kết quả thu được học sinh vẽ đồ thị như sau:'),
            figure('ii2-do-thi.png', 1400, 804, 640, 'Đồ thị sự thay đổi khối lượng NaOH theo thời gian: trục hoành là thời gian t (phút), trục tung là khối lượng m (gam). Các điểm (t; m): (0; 10,350), (1; 10,816), (5; 11,592), (10; 12,317), (20; 13,093), (30; 13,662), (60; 14,594). Đường cong tăng nhanh lúc đầu rồi chậm dần.'),
            p('Tốc độ tăng khối lượng trung bình = (m_{sau} − m_{trước}) / (t_{sau} − t_{trước}) (g/phút)')
          ],
          statements: [
            { id: 'a', text: 'Kết quả thí nghiệm phù hợp với giả thuyết ban đầu của học sinh.' },
            { id: 'b', text: 'Ở bước 1, cần lấy NaOH nhanh chóng và đóng nắp lọ ngay lập tức sau khi lấy xong, nhằm hạn chế tối đa lượng NaOH còn lại trong lọ hấp thụ nước và CO₂.' },
            { id: 'c', text: 'Trong 5 phút đầu tiên từ lúc bấm giờ, tốc độ tăng khối lượng trung bình của mẫu NaOH ở thí nghiệm trên là 0,19 g/phút. (Kết quả các phép tính trung gian không được làm tròn, chỉ kết quả cuối cùng được làm tròn đến hàng đơn vị).' },
            { id: 'd', text: 'Chất rắn màu trắng xuất hiện là muối sinh ra từ phản ứng giữa NaOH và CO₂.' }
          ],
          answer: { a: false, b: true, c: false, d: true },
          solution: solution('a sai: tốc độ tăng giảm dần, ví dụ phút đầu (10,816 − 10,350)/1 = 0,466 g/phút nhưng từ 30 đến 60 phút chỉ (14,594 − 13,662)/30 ≈ 0,031 g/phút. b đúng. c sai: trong 5 phút đầu, (11,592 − 10,350)/(5 − 0) = 0,2484 g/phút, không phải 0,19 g/phút. d đúng: 2NaOH + CO₂ → Na₂CO₃ + H₂O, Na₂CO₃ là chất rắn màu trắng.'),
          meta: meta('g12-c7')
        },
        {
          id: 'dn1-ii3',
          content: [
            p('Trong công nghiệp, phần lớn phenol và chất A được sản xuất theo sơ đồ sau:'),
            figure('ii3-so-do.png', 1090, 284, 520, 'Sơ đồ sản xuất phenol: benzene cộng propene (xúc tác, t°, p; hiệu suất giai đoạn 95%) tạo cumene (isopropylbenzene); cumene qua hai bước 1. O₂, 2. H₂SO₄ (hiệu suất giai đoạn h%) tạo phenol và chất A có công thức CH₃–CO–CH₃.'),
            p('Để sản xuất 650 000 tấn phenol theo sơ đồ trên, nhà máy cần sử dụng 590 000 tấn benzene làm nguyên liệu đầu vào.')
          ],
          statements: [
            { id: 'a', text: 'Giá trị của h là 96. (Kết quả các phép tính trung gian không được làm tròn, chỉ kết quả cuối cùng được làm tròn đến hàng đơn vị).' },
            { id: 'b', text: 'Chất A có tên thông thường là propan-2-one.' },
            { id: 'c', text: 'Trong sơ đồ trên, phản ứng giữa cumene và oxygen là phản ứng oxi hóa hoàn toàn.' },
            { id: 'd', text: 'Do ảnh hưởng của nhóm –OH nên phản ứng thế nguyên tử hydrogen trên vòng benzene của phenol xảy ra dễ hơn so với benzene.' }
          ],
          answer: { a: true, b: false, c: false, d: true },
          solution: solution('a đúng: xem tấn như gam: n(benzene) = 590 000/78, n(phenol) = 650 000/94. h = (650 000/94) / (590 000/78 × 0,95) × 100 ≈ 96,2 ⇒ 96. b sai: propan-2-one là tên thay thế; tên thông thường là acetone. c sai: cumene bị oxi hóa thành cumene hydroperoxide, không cháy thành CO₂ và H₂O. d đúng: nhóm –OH làm tăng mật độ electron trên vòng.'),
          meta: meta('g11-c5', 'g11-c6')
        },
        {
          id: 'dn1-ii4',
          content: [
            p('Omega-3 và omega-6 là hai nhóm acid béo không no thiết yếu, cơ thể người không tự tổng hợp được mà phải lấy từ thức ăn. Omega-3 có nhiều trong dầu cá, dầu hạt lanh; omega-6 có nhiều trong dầu đậu nành, dầu hướng dương. Trong cơ thể, chất béo được thủy phân nhờ enzyme lipase, giải phóng acid béo tự do. Việc cân bằng tỉ lệ omega-6 và omega-3 trong khẩu phần ăn có ý nghĩa quan trọng trong phòng chống viêm nhiễm và bệnh tim mạch. Dưới đây là cấu trúc của hai phân tử chất béo tiêu biểu: một chất béo không no được tạo thành từ acid béo omega-6, và một chất béo no được tạo thành từ acid béo no:'),
            figure('ii4-chat-beo.png', 1496, 380, 700, 'Công thức khung của hai chất béo. Trilinolein: ba gốc acid béo mạch dài, mỗi gốc có hai liên kết đôi C=C, nối với glycerol qua liên kết ester. Tristearin: ba gốc acid béo no mạch dài (không có liên kết đôi C=C) nối với glycerol qua liên kết ester.')
          ],
          statements: [
            { id: 'a', text: 'Trilinolein có nhiệt độ nóng chảy thấp hơn so với tristearin.' },
            { id: 'b', text: 'Chất béo tạo từ gốc acid omega-3 và omega-6 dễ bị oxi hóa trong không khí, tạo các hợp chất có mùi khó chịu do có chứa liên kết đôi C=C.' },
            { id: 'c', text: 'Dầu cá chứa nhiều omega-3, còn dầu thực vật như dầu đậu nành chứa chủ yếu omega-6; do đó để phòng bệnh tim mạch, nên ưu tiên dùng dầu cá hoàn toàn thay thế dầu thực vật.' },
            { id: 'd', text: 'Acid béo thuộc nhóm omega-3 và omega-6 cũng được sinh ra từ phản ứng thủy phân chất béo trong môi trường base.' }
          ],
          answer: { a: true, b: true, c: false, d: false },
          solution: solution('a đúng: gốc acid không no (liên kết đôi cis) làm mạch gấp khúc, các phân tử xếp kém chặt nên nhiệt độ nóng chảy thấp hơn chất béo no. b đúng: liên kết đôi C=C dễ bị oxi hóa (chất béo bị ôi). c sai: cần cân bằng tỉ lệ omega-6/omega-3 chứ không thay thế hoàn toàn. d sai: thủy phân trong môi trường base tạo muối của acid béo (xà phòng), không tạo acid béo tự do.'),
          meta: meta('g12-c1')
        }
      ]
    },
    {
      part: 'III',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 6.',
      questions: [
        {
          id: 'dn1-iii1',
          content: [
            ...ION_EXCHANGE,
            p('50 m³ một loại nước cứng đã được loại bỏ hoàn toàn độ cứng bằng cách cho nước chảy qua thiết bị làm mềm nước. Sau đó, thiết bị làm mềm nước này cần 200 lít dung dịch sodium chloride chứa 150 g/lít NaCl để tái tạo hoàn toàn. Số đơn vị độ cứng của mẫu nước cứng trên là bao nhiêu? (Không làm tròn kết quả các phép tính trung gian, chỉ làm tròn kết quả cuối cùng đến hàng đơn vị).'),
            p('Biết một 1 đơn vị độ cứng tương ứng với tổng số mol của các ion Ca²⁺ và Mg²⁺ bằng 0,5 mmol trong 1,0 L nước. Giả sử vật liệu trao đổi ion hoạt động với hiệu suất 100%.')
          ],
          answer: '10',
          solution: solution('n(NaCl) = 200 × 150 / 58,5 = 512,82 mol Na⁺. Mỗi ion M²⁺ thay cho 2 ion Na⁺ nên n(Ca²⁺ + Mg²⁺) = 256,41 mol trong 50 m³ = 50 000 L, tức 5,128 mmol/L. Số đơn vị độ cứng = 5,128 / 0,5 = 10,26 ≈ 10 (Na = 23, Cl = 35,5).'),
          meta: meta('g12-c7')
        },
        {
          id: 'dn1-iii2',
          content: [
            p('Để tìm hiểu những điều kiện cần thiết để ăn mòn điện hóa, một học sinh đã thiết lập thí nghiệm như hình sau:'),
            figure('iii2-ong-nghiem.png', 1400, 644, 620, 'Bốn ống nghiệm đậy nắp, mỗi ống chứa ba đinh sắt. Ống A: đinh nhúng một phần trong nước cất, phía trên là không khí. Ống B: không khí khô, đáy có CaCl₂ khan. Ống C: đinh ngập trong nước cất đã đun sôi, phủ lớp dầu hỏa, phía trên là không khí. Ống D: đinh nhúng một phần trong nước biển, phía trên là khí O₂.'),
            p('Có bao nhiêu ống nghiệm chứa đinh sắt sẽ bị gỉ sau vài ngày?')
          ],
          answer: '2',
          solution: solution('Sắt bị gỉ khi có đồng thời nước (dung dịch điện li) và O₂. Ống A (nước cất + không khí) và ống D (nước biển + O₂) bị gỉ. Ống B không có nước; ống C nước đun sôi đã đuổi O₂ và lớp dầu hỏa ngăn không khí. Có 2 ống.'),
          meta: meta('g12-c6')
        },
        {
          id: 'dn1-iii3',
          content: [
            p('Trinitroglycerin, C₃H₅N₃O₉ (thường gọi đơn giản là nitroglycerin) là chất nổ mạnh được Alfred Nobel chế tạo thành thuốc nổ dynamite vào năm 1866. Điều khá bất ngờ là nó cũng được sử dụng như một loại thuốc, để giảm đau thắt ngực (đau ngực do động mạch đến tim bị tắc một phần) bằng cách làm giãn mạch máu.'),
            p('Ở điều kiện chuẩn, biến thiên enthalpy của phản ứng phân hủy 1 mol trinitroglycerin tạo thành khí nitrogen, khí carbon dioxide, nước lỏng và khí oxygen là -1541,4 kJ.'),
            p('Để giảm đau thắt ngực, liều chuẩn của trinitroglycerin là 0,60 mg. Nếu liều chuẩn của trinitroglycerin bị phân hủy hoàn toàn trong cơ thể theo phản ứng phân hủy trên thì năng lượng được giải phóng là bao nhiêu J? (Không làm tròn kết quả các phép tính trung gian, chỉ làm tròn kết quả cuối cùng đến hàng phần mười).')
          ],
          answer: '4,1',
          solution: solution('M(C₃H₅N₃O₉) = 227 g/mol. n = 0,60 × 10⁻³ / 227 = 2,643 × 10⁻⁶ mol. Năng lượng = 2,643 × 10⁻⁶ × 1541,4 × 10³ J ≈ 4,07 J ≈ 4,1 J.'),
          meta: meta('g10-c5')
        },
        {
          id: 'dn1-iii4',
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
            table(['Ống', 'I₂', 'Tollens'], [['(1)', 'xanh tím', 'có kết tủa bạc'], ['(2)', 'Không đổi màu', 'có kết tủa bạc'], ['(3)', 'xanh tím', 'không có kết tủa bạc']]),
            p('Cho các nhận định sau:'),
            list([
              '(1) Ở ống nghiệm (1), tinh bột chưa bị thủy phân hoàn toàn thành glucose.',
              '(2) Ở ống nghiệm (2), toàn bộ tinh bột đã bị thủy phân hết.',
              '(3) Ở ống nghiệm (3), không có glucose tạo thành.',
              '(4) Sự có mặt của acid làm phản ứng thủy phân xảy ra nhanh hơn.',
              '(5) Dựa vào phản ứng Tollens, có thể kết luận mẫu không còn tinh bột.'
            ]),
            p('Trong các nhận định trên, có bao nhiêu nhận định **đúng**?')
          ],
          answer: '4',
          solution: solution('(1) đúng: còn màu xanh tím (còn tinh bột) và có kết tủa bạc (đã có glucose). (2) đúng: không còn màu với iodine. (3) đúng: không có kết tủa bạc. (4) đúng: so sánh ống (1), (2) với ống (3). (5) sai: Tollens chỉ cho biết có glucose, không chứng minh hết tinh bột. Có 4 nhận định đúng.'),
          meta: meta('g12-c2')
        },
        {
          id: 'dn1-iii5',
          content: [
            p('Cho cấu tạo của một đoạn mạch trong phân tử polymer X:'),
            figure('iii5-polymer.png', 930, 224, 440, 'Đoạn mạch polymer X: mạch chính lặp lại các mắt xích –CH(C₆H₅)–CH₂–, mỗi nhóm CH mang một vòng benzene (5 mắt xích được vẽ).'),
            p('Monomer tổng hợp nên polymer X có phân tử khối bằng bao nhiêu amu?')
          ],
          answer: '104',
          solution: solution('Mắt xích –CH(C₆H₅)–CH₂– là của polystyrene; monomer là styrene CH₂=CH–C₆H₅ (C₈H₈), M = 8 × 12 + 8 = 104 amu.'),
          meta: meta('g12-c4')
        },
        {
          id: 'dn1-iii6',
          content: [p('Amine X có công thức phân tử là C₄H₁₁N. Cho X phản ứng với hỗn hợp dung dịch HCl và NaNO₂ ở nhiệt độ thường thấy có khí không màu thoát ra. Có bao nhiêu công thức cấu tạo phù hợp với X?')],
          answer: '4',
          solution: solution('Amine bậc một no tác dụng với HNO₂ (từ NaNO₂ + HCl) ở nhiệt độ thường giải phóng khí N₂. Các amine bậc một C₄H₉NH₂: butan-1-amine, butan-2-amine, 2-methylpropan-1-amine, 2-methylpropan-2-amine ⇒ 4 công thức.'),
          meta: meta('g12-c3')
        }
      ]
    }
  ]
}
