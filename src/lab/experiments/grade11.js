/* =========================================================
   CHEMLAB — HÓA HỌC 11
   25 bài theo chương trình THPT
========================================================= */

const LETTERS =
  ['a', 'b', 'c', 'd']


function I(
  title,
  text,
  points = [],
  formula = ''
) {

  return {
    type: 'info',
    kicker: 'KIẾN THỨC',
    title,
    text,
    points,
    formula
  }

}


function Q(
  id,
  question,
  answers,
  correctIndex,
  explanation
) {

  return {

    type: 'quiz',

    id,

    question,

    options:
      answers.map(
        (
          text,
          index
        ) => ({
          id:
            LETTERS[index],

          text
        })
      ),

    correct:
      LETTERS[
        correctIndex
      ],

    explanation,

    score:
      1

  }

}


function P(
  id,
  question,
  answers,
  correctIndex,
  explanation
) {

  return {
    ...Q(
      id,
      question,
      answers,
      correctIndex,
      explanation
    ),
    type: 'prediction'
  }

}


function A(
  chemical,
  text,
  hint = ''
) {

  return {
    type: 'add',
    chemical,
    text,
    hint
  }

}


function H(
  text,
  hint = ''
) {

  return {
    type: 'heat',
    text,
    hint
  }

}


function L(
  result,
  text,
  success = ''
) {

  return {
    type: 'indicator',
    indicator: 'litmusPaper',
    result,
    text,
    success
  }

}


function R(
  reaction,
  text,
  success = ''
) {

  return {
    type: 'reaction',
    reaction,
    text,
    success
  }

}


function O(
  title,
  text,
  points = []
) {

  return {
    type: 'observation',
    kicker: 'QUAN SÁT & KẾT LUẬN',
    title,
    text,
    points
  }

}


function chapterOf(
  lesson
) {

  if (lesson <= 3) {
    return 'g11-c1'
  }

  if (lesson <= 9) {
    return 'g11-c2'
  }

  if (lesson <= 14) {
    return 'g11-c3'
  }

  if (lesson <= 18) {
    return 'g11-c4'
  }

  if (lesson <= 22) {
    return 'g11-c5'
  }

  return 'g11-c6'

}


function G11({

  lesson,

  id =
    `g11-lesson-${
      String(
        lesson
      ).padStart(
        2,
        '0'
      )
    }`,

  title,

  subtitle = '',

  objective,

  duration = 7,

  difficulty =
    'Cơ bản',

  chemicals = [],

  steps

}) {

  return {

    id,

    grade:
      11,

    chapterId:
      chapterOf(
        lesson
      ),

    lessonId:
      `g11-l${lesson}`,

    title,

    subtitle,

    objective,

    duration,

    difficulty,

    chemicals,

    steps

  }

}


export const GRADE11_EXPERIMENTS = [

  /* =====================================================
     CHƯƠNG 1 — CÂN BẰNG HÓA HỌC
  ===================================================== */

  G11({

    lesson: 1,

    id:
      'g11-equilibrium-fescn',

    title:
      'Cân bằng Fe³⁺ – SCN⁻',

    subtitle:
      'Hệ cân bằng có màu',

    objective:
      'Hiểu cân bằng động và nguyên lí chuyển dịch cân bằng.',

    duration:
      8,

    chemicals: [
      'fecl3',
      'kscn'
    ],

    steps: [

      I(
        'Cân bằng động',
        'Ở trạng thái cân bằng, phản ứng thuận và nghịch vẫn diễn ra nhưng có tốc độ bằng nhau.'
      ),

      P(
        'g11-l1-p1',
        'Khi Fe³⁺ gặp SCN⁻, màu đặc trưng của hệ là:',
        [
          'Đỏ',
          'Xanh',
          'Không màu',
          'Đen'
        ],
        0,
        'Phức thiocyanate của Fe(III) có màu đỏ đặc trưng.'
      ),

      A(
        'fecl3',
        'Thêm dung dịch FeCl₃.'
      ),

      A(
        'kscn',
        'Thêm dung dịch KSCN.'
      ),

      R(
        'fecl3-kscn',
        'Quan sát màu của hệ.',
        'Dung dịch xuất hiện màu đỏ đặc trưng.'
      ),

      I(
        'Le Chatelier',
        'Khi tác động lên một hệ đang cân bằng, hệ có xu hướng chuyển dịch theo chiều làm giảm tác động đó.'
      ),

      Q(
        'g11-l1-q1',
        'Nếu tăng nồng độ Fe³⁺ trong hệ Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺, cân bằng có xu hướng:',
        [
          'Dịch sang phải',
          'Dịch sang trái',
          'Không đổi trong mọi trường hợp',
          'Ngừng phản ứng'
        ],
        0,
        'Hệ tiêu thụ bớt Fe³⁺ bằng cách chuyển dịch theo chiều thuận.'
      )

    ]

  }),


  G11({

    lesson: 2,

    title:
      'Cân bằng trong dung dịch nước',

    subtitle:
      'Acid · base · pH',

    objective:
      'Hiểu sự điện li của nước, acid–base và ý nghĩa của pH.',

    chemicals: [
      'hcl',
      'naoh',
      'litmusPaper'
    ],

    steps: [

      I(
        'pH của dung dịch',
        'pH là đại lượng dùng để biểu diễn mức độ acid hoặc base của dung dịch.',
        [
          'pH < 7: môi trường acid.',
          'pH ≈ 7: trung tính.',
          'pH > 7: môi trường base.'
        ]
      ),

      Q(
        'g11-l2-q1',
        'Dung dịch có pH = 2 thuộc môi trường:',
        [
          'Acid',
          'Base',
          'Trung tính',
          'Không xác định'
        ],
        0,
        'pH nhỏ hơn 7 biểu thị môi trường acid.'
      ),

      A(
        'hcl',
        'Thêm HCl và quan sát giá trị pH trên bảng điều khiển.'
      ),

      L(
        'acid',
        'Chọn Purple litmus paper và thử dung dịch HCl.',
        'Giấy quỳ tím chuyển đỏ: dung dịch đang ở môi trường acid.'
      ),

      O(
        'Dung dịch acid',
        'Sau khi thêm HCl, pH giảm và giấy quỳ tím chuyển đỏ.'
      ),

      A(
        'naoh',
        'Thêm một phần NaOH có thể tích tương đương HCl và quan sát pH.'
      ),

      L(
        'neutral',
        'Dùng giấy quỳ tím thử lại sau khi trung hòa.',
        'Giấy quỳ gần như giữ màu tím khi dung dịch ở gần trung tính.'
      ),

      O(
        'Trung hòa',
        'Khi lượng HCl và NaOH tương đương trong mô phỏng, pH tiến gần 7 và giấy quỳ tím gần như không đổi màu.'
      ),

      A(
        'naoh',
        'Thêm thêm NaOH để tạo môi trường base.'
      ),

      L(
        'base',
        'Dùng giấy quỳ tím thử dung dịch đang dư NaOH.',
        'Giấy quỳ tím chuyển xanh: dung dịch đang ở môi trường base.'
      ),

      O(
        'Dung dịch base',
        'Khi NaOH dư, pH lớn hơn 7 và giấy quỳ tím chuyển xanh.'
      ),

      Q(
        'g11-l2-q2',
        'Phản ứng giữa H⁺ và OH⁻ tạo thành:',
        [
          'H₂',
          'H₂O',
          'O₂',
          'H₂O₂'
        ],
        1,
        'H⁺ + OH⁻ → H₂O.'
      )

    ]

  }),


  G11({

    lesson: 3,

    title:
      'Challenge — Cân bằng hóa học',

    objective:
      'Ôn tập cân bằng, Le Chatelier và pH.',

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g11-l3-q1',
        'Ở cân bằng động, tốc độ phản ứng thuận và nghịch:',
        [
          'Bằng nhau',
          'Đều bằng 0',
          'Luôn tăng',
          'Không liên quan'
        ],
        0,
        'Hai tốc độ bằng nhau nhưng phản ứng vẫn tiếp tục ở mức vi mô.'
      ),

      Q(
        'g11-l3-q2',
        'Tăng nồng độ một chất phản ứng thường làm cân bằng:',
        [
          'Dịch theo chiều tiêu thụ chất đó',
          'Luôn dịch trái',
          'Ngừng hoàn toàn',
          'Không thể dịch'
        ],
        0,
        'Theo nguyên lí Le Chatelier.'
      ),

      Q(
        'g11-l3-q3',
        'Dung dịch pH = 11 có môi trường:',
        [
          'Acid',
          'Base',
          'Trung tính',
          'Không có ion'
        ],
        1,
        'pH > 7 là môi trường base.'
      ),

      Q(
        'g11-l3-q4',
        'Chất xúc tác ảnh hưởng thế nào đến vị trí cân bằng?',
        [
          'Dịch phải',
          'Dịch trái',
          'Không làm thay đổi vị trí cân bằng',
          'Phá hủy cân bằng'
        ],
        2,
        'Xúc tác làm tăng tốc độ đạt cân bằng nhưng không đổi hằng số cân bằng.'
      )

    ]

  }),


  /* =====================================================
     CHƯƠNG 2 — NITROGEN - SULFUR
  ===================================================== */

  G11({

    lesson: 4,

    title:
      'Nitrogen',

    subtitle:
      'N₂ và liên kết ba',

    objective:
      'Hiểu cấu tạo và tính chất đặc trưng của nitrogen.',

    steps: [

      I(
        'Phân tử N₂',
        'Hai nguyên tử nitrogen liên kết với nhau bằng liên kết ba rất bền.',
        [],
        'N≡N'
      ),

      Q(
        'g11-l4-q1',
        'Nguyên nhân chính làm N₂ khá kém hoạt động ở điều kiện thường là:',
        [
          'Liên kết ba N≡N rất bền',
          'N₂ là kim loại',
          'N₂ không có electron',
          'N₂ luôn ở trạng thái rắn'
        ],
        0,
        'Cần năng lượng lớn để phá vỡ liên kết ba.'
      ),

      I(
        'Vai trò của nitrogen',
        'Nitrogen là nguyên tố quan trọng trong protein, nucleic acid và phân bón.'
      ),

      Q(
        'g11-l4-q2',
        'Khí chiếm tỉ lệ lớn nhất trong không khí khô là:',
        [
          'O₂',
          'N₂',
          'CO₂',
          'H₂'
        ],
        1,
        'N₂ chiếm khoảng 78% thể tích không khí khô.'
      )

    ]

  }),


  G11({

    lesson: 5,

    id:
      'g11-ammonium-identification',

    title:
      'Ammonia và ion ammonium',

    subtitle:
      'Nhận biết NH₄⁺',

    objective:
      'Hiểu tính base của ammonia và cách nhận biết ion ammonium.',

    duration:
      8,

    chemicals: [
      'nh4cl',
      'naoh'
    ],

    steps: [

      I(
        'Ammonia',
        'NH₃ là một base yếu trong nước và có thể nhận proton tạo ion NH₄⁺.',
        [],
        'NH₃ + H₂O ⇌ NH₄⁺ + OH⁻'
      ),

      P(
        'g11-l5-p1',
        'Khi NH₄Cl tác dụng với NaOH và được gia nhiệt, khí tạo thành là:',
        [
          'CO₂',
          'NH₃',
          'O₂',
          'Cl₂'
        ],
        1,
        'Ion ammonium giải phóng ammonia khi tác dụng với base.'
      ),

      A(
        'nh4cl',
        'Thêm dung dịch NH₄Cl.'
      ),

      A(
        'naoh',
        'Thêm dung dịch NaOH.'
      ),

      H(
        'Bật lửa để gia nhiệt.',
        'Giữ chế độ gia nhiệt cho đến khi phản ứng được mô phỏng.'
      ),

      R(
        'nh4cl-naoh',
        'Quan sát sự tạo thành ammonia.',
        'NH₃ đã được tạo thành trong mô phỏng.'
      ),

      Q(
        'g11-l5-q1',
        'Phương trình ion rút gọn của quá trình nhận biết NH₄⁺ là:',
        [
          'NH₄⁺ + OH⁻ → NH₃ + H₂O',
          'NH₄⁺ + H⁺ → NH₃',
          'NH₄⁺ + Cl⁻ → NH₃',
          'NH₃ + O₂ → NH₄⁺'
        ],
        0,
        'NH₄⁺ phản ứng với OH⁻ tạo NH₃ và H₂O.'
      )

    ]

  }),


  G11({

    lesson: 6,

    title:
      'Hợp chất nitrogen với oxygen',

    subtitle:
      'NO · NO₂ · HNO₃',

    objective:
      'Hiểu một số oxide của nitrogen và tác động môi trường.',

    steps: [

      I(
        'Oxide của nitrogen',
        'Nitrogen tạo nhiều oxide ở các số oxi hóa khác nhau như NO và NO₂.',
        [
          'NO không màu.',
          'NO₂ có màu nâu đỏ.',
          'NOₓ là nhóm chất gây ô nhiễm không khí.'
        ]
      ),

      Q(
        'g11-l6-q1',
        'Khí NO₂ có màu đặc trưng là:',
        [
          'Không màu',
          'Nâu đỏ',
          'Xanh',
          'Tím'
        ],
        1,
        'NO₂ là khí màu nâu đỏ.'
      ),

      I(
        'Acid nitric',
        'HNO₃ là acid mạnh và có tính oxi hóa mạnh trong nhiều phản ứng.'
      ),

      Q(
        'g11-l6-q2',
        'Một tác động môi trường liên quan đến NOₓ là:',
        [
          'Mưa acid',
          'Tạo oxygen tinh khiết',
          'Giảm hoàn toàn hiệu ứng nhà kính',
          'Không ảnh hưởng'
        ],
        0,
        'NOₓ có thể tham gia tạo các acid trong khí quyển.'
      )

    ]

  }),


  G11({

    lesson: 7,

    title:
      'Sulfur và sulfur dioxide',

    subtitle:
      'SO₂ và tính chất redox',

    objective:
      'Hiểu tính chất của sulfur và sulfur dioxide.',

    chemicals: [
      'na2so3',
      'hcl'
    ],

    steps: [

      I(
        'Sulfur dioxide',
        'SO₂ là oxide acid của sulfur ở số oxi hóa +4 và có thể thể hiện cả tính oxi hóa lẫn tính khử.'
      ),

      P(
        'g11-l7-p1',
        'Khi muối sulfite tác dụng với acid, hiện tượng chính là:',
        [
          'Tạo khí',
          'Kết tủa xanh',
          'Dung dịch đông đặc',
          'Không phản ứng'
        ],
        0,
        'Acid hóa sulfite giải phóng SO₂.'
      ),

      A(
        'na2so3',
        'Thêm dung dịch Na₂SO₃.'
      ),

      A(
        'hcl',
        'Thêm HCl và quan sát hiện tượng tạo khí.'
      ),

      O(
        'Sulfur dioxide',
        'Mô phỏng cho thấy khí được tạo thành khi acid tác dụng với sulfite.',
        [
          'SO₂ tan trong nước tạo môi trường acid.',
          'SO₂ là một chất gây ô nhiễm không khí.'
        ]
      ),

      Q(
        'g11-l7-q1',
        'Số oxi hóa của S trong SO₂ là:',
        [
          '+2',
          '+4',
          '+6',
          '−2'
        ],
        1,
        'O có số oxi hóa −2 nên S trong SO₂ là +4.'
      )

    ]

  }),


  G11({

    lesson: 8,

    title:
      'Sulfuric acid và sulfate',

    subtitle:
      'Nhận biết SO₄²⁻',

    objective:
      'Hiểu tính chất của H₂SO₄ và nhận biết ion sulfate.',

    chemicals: [
      'na2so4',
      'bacl2'
    ],

    steps: [

      I(
        'Ion sulfate',
        'Ion SO₄²⁻ có thể được nhận biết bằng ion Ba²⁺ nhờ tạo BaSO₄ rất ít tan.'
      ),

      P(
        'g11-l8-p1',
        'Khi Ba²⁺ gặp SO₄²⁻, hiện tượng là:',
        [
          'Kết tủa trắng',
          'Khí màu nâu',
          'Dung dịch chuyển đỏ',
          'Không có hiện tượng'
        ],
        0,
        'BaSO₄ là kết tủa màu trắng.'
      ),

      A(
        'na2so4',
        'Thêm dung dịch Na₂SO₄.'
      ),

      A(
        'bacl2',
        'Thêm dung dịch BaCl₂.'
      ),

      O(
        'Nhận biết sulfate',
        'Sự xuất hiện kết tủa trắng BaSO₄ là dấu hiệu đặc trưng trong mô phỏng.',
        [],
        ''
      ),

      Q(
        'g11-l8-q1',
        'Phương trình ion rút gọn là:',
        [
          'Ba²⁺ + SO₄²⁻ → BaSO₄↓',
          'Na⁺ + Cl⁻ → NaCl↓',
          'Ba²⁺ + 2Cl⁻ → BaCl₂↓',
          'SO₄²⁻ → SO₂'
        ],
        0,
        'Ba²⁺ kết hợp với sulfate tạo BaSO₄ kết tủa.'
      )

    ]

  }),


  G11({

    lesson: 9,

    title:
      'Challenge — Nitrogen và Sulfur',

    objective:
      'Ôn tập nitrogen, ammonia, sulfur và sulfate.',

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g11-l9-q1',
        'Liên kết trong N₂ là:',
        [
          'Đơn',
          'Đôi',
          'Ba',
          'Ion'
        ],
        2,
        'N₂ có liên kết ba.'
      ),

      Q(
        'g11-l9-q2',
        'NH₃ trong nước thể hiện tính:',
        [
          'Base yếu',
          'Acid mạnh',
          'Oxide',
          'Muối'
        ],
        0,
        'NH₃ nhận proton từ nước.'
      ),

      Q(
        'g11-l9-q3',
        'Thuốc thử thường dùng nhận biết SO₄²⁻ là ion:',
        [
          'Ba²⁺',
          'Na⁺',
          'K⁺',
          'NH₄⁺'
        ],
        0,
        'Ba²⁺ tạo BaSO₄ kết tủa trắng.'
      ),

      Q(
        'g11-l9-q4',
        'SO₂ thuộc loại oxide:',
        [
          'Acid',
          'Base',
          'Lưỡng tính điển hình',
          'Kim loại'
        ],
        0,
        'SO₂ là oxide acid.'
      )

    ]

  }),


  /* =====================================================
     CHƯƠNG 3 — ĐẠI CƯƠNG HỮU CƠ
  ===================================================== */

  G11({

    lesson: 10,

    title:
      'Hợp chất hữu cơ',

    subtitle:
      'Carbon và nhóm chức',

    objective:
      'Hiểu khái niệm hợp chất hữu cơ và nhóm chức.',

    steps: [

      I(
        'Hóa học hữu cơ',
        'Hóa học hữu cơ nghiên cứu các hợp chất của carbon, ngoại trừ một số hợp chất carbon vô cơ đơn giản.'
      ),

      Q(
        'g11-l10-q1',
        'Chất nào là hợp chất hữu cơ?',
        [
          'CH₃CH₂OH',
          'CO₂',
          'CaCO₃',
          'CO'
        ],
        0,
        'Ethanol là hợp chất hữu cơ.'
      ),

      I(
        'Nhóm chức',
        'Nhóm chức là nguyên tử hoặc nhóm nguyên tử gây ra tính chất hóa học đặc trưng của hợp chất.',
        [
          '–OH: alcohol.',
          '–CHO: aldehyde.',
          '–COOH: carboxylic acid.'
        ]
      ),

      Q(
        'g11-l10-q2',
        'Nhóm –COOH đặc trưng cho:',
        [
          'Alcohol',
          'Carboxylic acid',
          'Alkane',
          'Ketone'
        ],
        1,
        '–COOH là nhóm carboxyl.'
      )

    ]

  }),


  G11({

    lesson: 11,

    title:
      'Tách và tinh chế hợp chất hữu cơ',

    objective:
      'Lựa chọn phương pháp tách phù hợp dựa trên tính chất vật lí.',

    steps: [

      I(
        'Các phương pháp tách',
        'Việc tách chất dựa trên sự khác biệt về nhiệt độ sôi, độ tan, khả năng hấp phụ hoặc trạng thái vật lí.',
        [
          'Chưng cất.',
          'Chiết.',
          'Kết tinh.',
          'Sắc kí.'
        ]
      ),

      Q(
        'g11-l11-q1',
        'Để tách hai chất lỏng có nhiệt độ sôi khác nhau đáng kể, phương pháp phù hợp là:',
        [
          'Chưng cất',
          'Lọc',
          'Dùng nam châm',
          'Điện phân'
        ],
        0,
        'Chưng cất dựa trên sự khác nhau về nhiệt độ sôi.'
      ),

      Q(
        'g11-l11-q2',
        'Phương pháp chiết thường dựa chủ yếu vào:',
        [
          'Sự phân bố chất giữa hai dung môi ít trộn lẫn',
          'Số proton',
          'Điện tích hạt nhân',
          'Phản ứng hạt nhân'
        ],
        0,
        'Chiết dựa trên độ tan khác nhau trong các pha.'
      )

    ]

  }),


  G11({

    lesson: 12,

    title:
      'Công thức phân tử hợp chất hữu cơ',

    objective:
      'Hiểu mối quan hệ giữa công thức đơn giản nhất và công thức phân tử.',

    steps: [

      I(
        'Công thức phân tử',
        'Công thức phân tử cho biết số nguyên tử thật sự của mỗi nguyên tố trong một phân tử.'
      ),

      I(
        'Công thức đơn giản nhất',
        'Công thức đơn giản nhất biểu diễn tỉ lệ nguyên tối giản giữa các nguyên tử.',
        [],
        'CTPT = (CTĐGN)ₙ'
      ),

      Q(
        'g11-l12-q1',
        'Glucose C₆H₁₂O₆ có công thức đơn giản nhất là:',
        [
          'CH₂O',
          'C₆H₁₂O₆',
          'C₂H₄O₂',
          'CHO'
        ],
        0,
        'Chia các chỉ số cho 6 thu được CH₂O.'
      ),

      Q(
        'g11-l12-q2',
        'Muốn xác định n trong CTPT = (CTĐGN)ₙ cần biết thêm:',
        [
          'Khối lượng mol phân tử',
          'Màu sắc',
          'Nhiệt độ phòng',
          'Tên người điều chế'
        ],
        0,
        'Khối lượng mol giúp xác định bội số n.'
      )

    ]

  }),


  G11({

    lesson: 13,

    title:
      'Cấu tạo hóa học hợp chất hữu cơ',

    subtitle:
      'Công thức cấu tạo · đồng phân',

    objective:
      'Hiểu thuyết cấu tạo và hiện tượng đồng phân.',

    steps: [

      I(
        'Cấu tạo hóa học',
        'Tính chất của hợp chất hữu cơ phụ thuộc không chỉ thành phần nguyên tố mà còn cách các nguyên tử liên kết với nhau.'
      ),

      Q(
        'g11-l13-q1',
        'Các chất có cùng công thức phân tử nhưng khác cấu tạo gọi là:',
        [
          'Đồng vị',
          'Đồng phân',
          'Ion',
          'Polymer'
        ],
        1,
        'Đó là hiện tượng đồng phân.'
      ),

      I(
        'Ví dụ',
        'C₄H₁₀ có hai đồng phân cấu tạo: butane mạch thẳng và 2-methylpropane mạch nhánh.'
      ),

      Q(
        'g11-l13-q2',
        'Nguyên nhân tạo nhiều đồng phân hữu cơ chủ yếu liên quan đến:',
        [
          'Khả năng liên kết đa dạng của carbon',
          'Carbon không tạo liên kết',
          'Carbon chỉ có một hóa trị',
          'Không liên quan cấu tạo'
        ],
        0,
        'Carbon có thể tạo mạch thẳng, nhánh, vòng và nhiều kiểu liên kết.'
      )

    ]

  }),


  G11({

    lesson: 14,

    title:
      'Challenge — Đại cương hữu cơ',

    objective:
      'Ôn tập nhóm chức, công thức và đồng phân.',

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g11-l14-q1',
        'Nhóm –OH trong ethanol đặc trưng cho:',
        [
          'Alcohol',
          'Aldehyde',
          'Acid',
          'Ester'
        ],
        0,
        'Ethanol là alcohol.'
      ),

      Q(
        'g11-l14-q2',
        'Hai chất cùng CTPT nhưng khác CTCT là:',
        [
          'Đồng phân',
          'Đồng vị',
          'Hai nguyên tố',
          'Hai ion giống nhau'
        ],
        0,
        'Đây là định nghĩa đồng phân cấu tạo.'
      ),

      Q(
        'g11-l14-q3',
        'Phương pháp tách dựa trên nhiệt độ sôi là:',
        [
          'Chưng cất',
          'Sắc kí',
          'Lọc chân không',
          'Điện phân'
        ],
        0,
        'Chưng cất khai thác sự khác biệt nhiệt độ sôi.'
      )

    ]

  }),


  /* =====================================================
     CHƯƠNG 4 — HYDROCARBON
  ===================================================== */

  G11({

    lesson: 15,

    title:
      'Alkane',

    subtitle:
      'Hydrocarbon no',

    objective:
      'Hiểu cấu tạo và phản ứng đặc trưng của alkane.',

    steps: [

      I(
        'Alkane',
        'Alkane là hydrocarbon no mạch hở chỉ chứa liên kết đơn C–C và C–H.',
        [],
        'CₙH₂ₙ₊₂'
      ),

      Q(
        'g11-l15-q1',
        'Công thức nào là alkane?',
        [
          'C₂H₆',
          'C₂H₄',
          'C₂H₂',
          'C₆H₆'
        ],
        0,
        'Ethane C₂H₆ phù hợp CₙH₂ₙ₊₂.'
      ),

      I(
        'Phản ứng đặc trưng',
        'Alkane có thể tham gia phản ứng cháy và phản ứng thế với halogen trong điều kiện thích hợp.'
      ),

      Q(
        'g11-l15-q2',
        'Khi alkane cháy hoàn toàn, sản phẩm chính là:',
        [
          'CO₂ và H₂O',
          'CO và H₂',
          'C và H₂',
          'Chỉ H₂O'
        ],
        0,
        'Hydrocarbon cháy hoàn toàn tạo CO₂ và H₂O.'
      )

    ]

  }),


  G11({

    lesson: 16,

    title:
      'Hydrocarbon không no',

    subtitle:
      'Alkene · alkyne · phản ứng cộng',

    objective:
      'Nhận biết liên kết π và phản ứng đặc trưng của hydrocarbon không no.',

    chemicals: [
      'ethene',
      'bromineWater'
    ],

    steps: [

      I(
        'Liên kết không no',
        'Alkene chứa liên kết đôi C=C, còn alkyne chứa liên kết ba C≡C.'
      ),

      P(
        'g11-l16-p1',
        'Khi ethene tiếp xúc với bromine water trong mô phỏng, màu bromine sẽ:',
        [
          'Nhạt hoặc mất màu',
          'Đậm hơn',
          'Chuyển xanh',
          'Tạo màu đen'
        ],
        0,
        'Ethene tham gia phản ứng cộng Br₂ làm mất màu bromine.'
      ),

      A(
        'ethene',
        'Thêm ethene vào cốc mô phỏng.'
      ),

      A(
        'bromineWater',
        'Thêm bromine water.'
      ),

      O(
        'Phép thử liên kết không no',
        'Sự mất màu bromine là dấu hiệu phổ biến của phản ứng cộng vào liên kết π.'
      ),

      Q(
        'g11-l16-q1',
        'Phản ứng đặc trưng của alkene là:',
        [
          'Phản ứng cộng',
          'Chỉ phản ứng thế',
          'Không phản ứng',
          'Phản ứng hạt nhân'
        ],
        0,
        'Liên kết π trong C=C dễ tham gia phản ứng cộng.'
      )

    ]

  }),


  G11({

    lesson: 17,

    title:
      'Arene',

    subtitle:
      'Benzene và hydrocarbon thơm',

    objective:
      'Hiểu cấu tạo vòng benzene và tính chất hóa học cơ bản.',

    steps: [

      I(
        'Benzene',
        'Benzene có hệ electron π liên hợp trên vòng sáu carbon, tạo cấu trúc bền đặc biệt.',
        [],
        'C₆H₆'
      ),

      Q(
        'g11-l17-q1',
        'Phản ứng đặc trưng thường gặp của benzene là:',
        [
          'Phản ứng thế',
          'Cộng rất dễ như ethene',
          'Phân li ion hoàn toàn',
          'Không cháy'
        ],
        0,
        'Benzene ưu tiên phản ứng thế để bảo toàn hệ thơm.'
      ),

      I(
        'So sánh với alkene',
        'Benzene không làm mất màu bromine water dễ dàng như alkene ở điều kiện thông thường.'
      ),

      Q(
        'g11-l17-q2',
        'Chất nào làm mất màu bromine water dễ hơn?',
        [
          'Ethene',
          'Benzene',
          'Methane ở điều kiện thường',
          'NaCl'
        ],
        0,
        'Ethene có liên kết đôi phản ứng cộng dễ hơn.'
      )

    ]

  }),


  G11({

    lesson: 18,

    title:
      'Challenge — Hydrocarbon',

    objective:
      'Phân biệt alkane, alkene, alkyne và arene.',

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g11-l18-q1',
        'C₂H₄ thuộc loại:',
        [
          'Alkene',
          'Alkane',
          'Alkyne',
          'Arene'
        ],
        0,
        'C₂H₄ là ethene.'
      ),

      Q(
        'g11-l18-q2',
        'C₂H₂ thuộc loại:',
        [
          'Alkane',
          'Alkyne',
          'Alcohol',
          'Arene'
        ],
        1,
        'C₂H₂ là ethyne.'
      ),

      Q(
        'g11-l18-q3',
        'C₆H₆ là:',
        [
          'Benzene',
          'Hexane',
          'Hexene',
          'Ethanol'
        ],
        0,
        'C₆H₆ là benzene.'
      ),

      Q(
        'g11-l18-q4',
        'Thuốc thử thường dùng nhận biết liên kết không no là:',
        [
          'Bromine water',
          'NaCl',
          'Nước tinh khiết',
          'KCl'
        ],
        0,
        'Bromine bị mất màu khi cộng vào liên kết π.'
      )

    ]

  }),


  /* =====================================================
     CHƯƠNG 5
  ===================================================== */

  G11({

    lesson: 19,

    title:
      'Dẫn xuất halogen',

    objective:
      'Hiểu cấu tạo và một số phản ứng của dẫn xuất halogen.',

    steps: [

      I(
        'Dẫn xuất halogen',
        'Dẫn xuất halogen được tạo khi một hay nhiều H trong hydrocarbon được thay bằng halogen.',
        [],
        'R–X'
      ),

      Q(
        'g11-l19-q1',
        'Trong công thức R–X, X thường biểu diễn:',
        [
          'Halogen',
          'Kim loại',
          'Oxygen',
          'Nitrogen'
        ],
        0,
        'X thường là F, Cl, Br hoặc I.'
      ),

      I(
        'Phản ứng',
        'Dẫn xuất halogen có thể tham gia phản ứng thế hoặc tách tùy cấu tạo và điều kiện.'
      ),

      Q(
        'g11-l19-q2',
        'Phản ứng tách HX từ dẫn xuất halogen có thể tạo:',
        [
          'Alkene',
          'Muối carbonate',
          'Protein',
          'Kim loại'
        ],
        0,
        'Phản ứng tách HX có thể hình thành liên kết đôi C=C.'
      )

    ]

  }),


  G11({

    lesson: 20,

    title:
      'Alcohol',

    subtitle:
      'Ethanol · polyol',

    objective:
      'Hiểu nhóm –OH và phản ứng đặc trưng của alcohol.',

    chemicals: [
      'glycerol',
      'cuso4',
      'naoh'
    ],

    steps: [

      I(
        'Alcohol',
        'Alcohol là hợp chất hữu cơ có nhóm –OH liên kết với carbon no.',
        [],
        'R–OH'
      ),

      Q(
        'g11-l20-q1',
        'Ethanol thuộc nhóm chức:',
        [
          'Alcohol',
          'Phenol',
          'Aldehyde',
          'Carboxylic acid'
        ],
        0,
        'Ethanol chứa nhóm –OH alcohol.'
      ),

      P(
        'g11-l20-p1',
        'Glycerol tác dụng với Cu(OH)₂ ở nhiệt độ thường tạo dung dịch có màu:',
        [
          'Xanh lam đậm',
          'Đỏ',
          'Đen',
          'Không màu'
        ],
        0,
        'Alcohol đa chức có các –OH kề nhau tạo phức xanh lam với Cu²⁺.'
      ),

      A(
        'glycerol',
        'Thêm glycerol.'
      ),

      A(
        'cuso4',
        'Thêm CuSO₄.'
      ),

      A(
        'naoh',
        'Thêm NaOH để tạo Cu(OH)₂ trong môi trường phản ứng.'
      ),

      O(
        'Alcohol đa chức',
        'Glycerol có nhiều nhóm –OH liền kề nên có tính chất khác ethanol trong phép thử với Cu(OH)₂.'
      )

    ]

  }),


  G11({

    lesson: 21,

    id:
      'g11-phenol-fecl3',

    title:
      'Phenol',

    subtitle:
      'Nhận biết phenol bằng FeCl₃',

    objective:
      'Phân biệt phenol với alcohol thông qua tính chất đặc trưng.',

    chemicals: [
      'phenol',
      'fecl3'
    ],

    steps: [

      I(
        'Phenol',
        'Trong phenol, nhóm –OH liên kết trực tiếp với vòng benzene nên có tính chất khác alcohol thông thường.'
      ),

      P(
        'g11-l21-p1',
        'Phenol tác dụng với FeCl₃ trong mô phỏng cho màu:',
        [
          'Tím',
          'Trắng',
          'Đen',
          'Không màu'
        ],
        0,
        'Phenol tạo phức màu tím với Fe³⁺.'
      ),

      A(
        'phenol',
        'Thêm phenol.'
      ),

      A(
        'fecl3',
        'Thêm FeCl₃.'
      ),

      R(
        'phenol-fecl3',
        'Quan sát màu dung dịch.',
        'Màu tím đặc trưng đã xuất hiện.'
      ),

      Q(
        'g11-l21-q1',
        'Phenol có tính acid so với ethanol:',
        [
          'Mạnh hơn',
          'Yếu hơn vô hạn',
          'Hoàn toàn giống',
          'Không chứa H'
        ],
        0,
        'Anion phenoxide được ổn định bởi hệ vòng thơm nên phenol acid hơn ethanol.'
      )

    ]

  }),


  G11({

    lesson: 22,

    title:
      'Challenge — Halogen derivative, Alcohol, Phenol',

    objective:
      'Ôn tập và phân biệt ba nhóm hợp chất.',

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g11-l22-q1',
        'Nhóm chức của alcohol là:',
        [
          '–OH',
          '–CHO',
          '–COOH',
          '–COO–'
        ],
        0,
        'Alcohol chứa nhóm hydroxy –OH.'
      ),

      Q(
        'g11-l22-q2',
        'Phenol khác alcohol ở điểm:',
        [
          '–OH gắn trực tiếp vào vòng thơm',
          'Không có oxygen',
          'Chỉ chứa nitrogen',
          'Không có carbon'
        ],
        0,
        'Đó là đặc điểm cấu tạo của phenol.'
      ),

      Q(
        'g11-l22-q3',
        'Thuốc thử FeCl₃ có thể dùng hỗ trợ nhận biết:',
        [
          'Phenol',
          'Methane',
          'NaCl',
          'CO₂'
        ],
        0,
        'Phenol tạo màu đặc trưng với Fe³⁺.'
      )

    ]

  }),


  /* =====================================================
     CHƯƠNG 6 — CARBONYL / CARBOXYLIC ACID
  ===================================================== */

  G11({

    lesson: 23,

    title:
      'Hợp chất carbonyl',

    subtitle:
      'Aldehyde · ketone',

    objective:
      'Phân biệt aldehyde và ketone qua cấu tạo và khả năng oxi hóa.',

    chemicals: [
      'ethanal',
      'k2cr2o7',
      'h2so4'
    ],

    steps: [

      I(
        'Nhóm carbonyl',
        'Aldehyde và ketone đều chứa nhóm C=O nhưng vị trí nhóm carbonyl khác nhau.',
        [
          'Aldehyde: –CHO.',
          'Ketone: >C=O nằm giữa hai nhóm carbon.'
        ]
      ),

      Q(
        'g11-l23-q1',
        'CH₃CHO thuộc loại:',
        [
          'Aldehyde',
          'Ketone',
          'Alcohol',
          'Ester'
        ],
        0,
        'CH₃CHO là ethanal.'
      ),

      P(
        'g11-l23-p1',
        'Aldehyde dễ bị oxi hóa hơn ketone trong các phép thử thông thường?',
        [
          'Đúng',
          'Sai',
          'Hai chất luôn giống nhau',
          'Không chứa carbon'
        ],
        0,
        'Nhóm –CHO dễ bị oxi hóa thành nhóm –COOH.'
      ),

      A(
        'ethanal',
        'Thêm ethanal.'
      ),

      A(
        'k2cr2o7',
        'Thêm potassium dichromate.'
      ),

      A(
        'h2so4',
        'Thêm H₂SO₄ để tạo môi trường acid.'
      ),

      H(
        'Gia nhiệt hỗn hợp mô phỏng.'
      ),

      O(
        'Oxi hóa aldehyde',
        'Ethanal có thể bị oxi hóa thành ethanoic acid trong điều kiện oxi hóa thích hợp.'
      )

    ]

  }),


  G11({

    lesson: 24,

    title:
      'Carboxylic acid',

    subtitle:
      'Tính acid · phản ứng với bicarbonate',

    objective:
      'Hiểu nhóm carboxyl và phản ứng đặc trưng của carboxylic acid.',

    chemicals: [
      'ethanoic',
      'nahco3'
    ],

    steps: [

      I(
        'Nhóm carboxyl',
        'Carboxylic acid chứa nhóm chức –COOH.',
        [],
        'R–COOH'
      ),

      Q(
        'g11-l24-q1',
        'Ethanoic acid có công thức:',
        [
          'CH₃COOH',
          'CH₃CHO',
          'CH₃OH',
          'CH₃COOCH₃'
        ],
        0,
        'Ethanoic acid là CH₃COOH.'
      ),

      P(
        'g11-l24-p1',
        'Khi ethanoic acid tác dụng với NaHCO₃, hiện tượng là:',
        [
          'Có khí CO₂',
          'Kết tủa xanh',
          'Tạo kim loại',
          'Không phản ứng'
        ],
        0,
        'Acid phản ứng với bicarbonate giải phóng CO₂.'
      ),

      A(
        'ethanoic',
        'Thêm ethanoic acid.'
      ),

      A(
        'nahco3',
        'Thêm NaHCO₃ và quan sát sự tạo khí.'
      ),

      O(
        'Phản ứng đặc trưng',
        'Khí CO₂ tạo thành là một dấu hiệu giúp phân biệt carboxylic acid với nhiều hợp chất hữu cơ trung tính.'
      ),

      I(
        'Esterification',
        'Carboxylic acid có thể phản ứng với alcohol tạo ester trong điều kiện thích hợp.',
        [],
        'RCOOH + R′OH ⇌ RCOOR′ + H₂O'
      )

    ]

  }),


  G11({

    lesson: 25,

    title:
      'Challenge — Carbonyl và Carboxylic acid',

    objective:
      'Ôn tập aldehyde, ketone và carboxylic acid.',

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g11-l25-q1',
        'Nhóm –CHO đặc trưng cho:',
        [
          'Aldehyde',
          'Ketone',
          'Alcohol',
          'Ester'
        ],
        0,
        '–CHO là nhóm aldehyde.'
      ),

      Q(
        'g11-l25-q2',
        'Nhóm –COOH đặc trưng cho:',
        [
          'Carboxylic acid',
          'Alkane',
          'Arene',
          'Amine'
        ],
        0,
        '–COOH là nhóm carboxyl.'
      ),

      Q(
        'g11-l25-q3',
        'Chất nào phản ứng với NaHCO₃ giải phóng CO₂?',
        [
          'Ethanoic acid',
          'Ethanol',
          'Ethane',
          'Ethene'
        ],
        0,
        'Carboxylic acid phản ứng với bicarbonate.'
      ),

      Q(
        'g11-l25-q4',
        'Aldehyde thường dễ bị oxi hóa thành:',
        [
          'Carboxylic acid',
          'Alkane',
          'Kim loại',
          'Muối chloride'
        ],
        0,
        'Nhóm –CHO có thể bị oxi hóa thành –COOH.'
      )

    ]

  })

]