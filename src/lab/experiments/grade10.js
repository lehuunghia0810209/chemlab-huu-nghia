/* =========================================================
   CHEMLAB — HÓA HỌC 10
   22 bài theo chương trình THPT

   Concept + Quiz + Reaction Lab + Challenge
========================================================= */


/* =========================================================
   STEP HELPERS
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

    type:
      'quiz',

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

    type:
      'prediction'

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


/* =========================================================
   CHAPTER MAP
========================================================= */

function chapterOf(
  lesson
) {

  if (lesson <= 4) {
    return 'g10-c1'
  }

  if (lesson <= 9) {
    return 'g10-c2'
  }

  if (lesson <= 14) {
    return 'g10-c3'
  }

  if (lesson <= 16) {
    return 'g10-c4'
  }

  if (lesson <= 18) {
    return 'g10-c5'
  }

  if (lesson <= 20) {
    return 'g10-c6'
  }

  return 'g10-c7'

}


/* =========================================================
   ACTIVITY BUILDER
========================================================= */

function G10({

  lesson,

  id =
    `g10-lesson-${
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

  duration = 6,

  difficulty =
    'Cơ bản',

  chemicals = [],

  steps

}) {

  return {

    id,

    grade:
      10,

    chapterId:
      chapterOf(
        lesson
      ),

    lessonId:
      `g10-l${lesson}`,

    title,

    subtitle,

    objective,

    duration,

    difficulty,

    chemicals,

    steps

  }

}


/* =========================================================
   GRADE 10 DATA
========================================================= */

export const GRADE10_EXPERIMENTS = [

  /* =====================================================
     CHƯƠNG 1 — CẤU TẠO NGUYÊN TỬ
  ===================================================== */

  G10({

    lesson: 1,

    title:
      'Khám phá thành phần nguyên tử',

    subtitle:
      'Proton · neutron · electron',

    objective:
      'Hiểu cấu tạo nguyên tử và đặc điểm của các hạt cơ bản.',

    duration:
      7,

    steps: [

      I(
        'Nguyên tử gồm những gì?',
        'Nguyên tử gồm hạt nhân ở tâm và lớp vỏ electron chuyển động xung quanh.',
        [
          'Hạt nhân chứa proton và neutron.',
          'Electron nằm ở lớp vỏ.',
          'Phần lớn khối lượng nguyên tử tập trung trong hạt nhân.'
        ]
      ),

      Q(
        'g10-l1-q1',
        'Hạt nào mang điện tích âm?',
        [
          'Proton',
          'Neutron',
          'Electron',
          'Hạt nhân'
        ],
        2,
        'Electron mang điện tích âm.'
      ),

      I(
        'Điện tích các hạt',
        'Proton mang điện dương, electron mang điện âm và neutron không mang điện.',
        [
          'p: +1',
          'e: −1',
          'n: 0'
        ]
      ),

      Q(
        'g10-l1-q2',
        'Trong nguyên tử trung hòa, số proton và electron có quan hệ như thế nào?',
        [
          'Số proton lớn hơn',
          'Số electron lớn hơn',
          'Bằng nhau',
          'Không liên quan'
        ],
        2,
        'Nguyên tử trung hòa có số proton bằng số electron.'
      ),

      O(
        'Kết luận',
        'Cấu tạo nguyên tử gồm hạt nhân rất nhỏ chứa proton, neutron và lớp vỏ electron.',
        [
          'Khối lượng electron rất nhỏ so với proton và neutron.',
          'Nguyên tử có cấu tạo phần lớn là khoảng trống.'
        ]
      )

    ]

  }),


  G10({

    lesson: 2,

    title:
      'Nguyên tố và đồng vị',

    subtitle:
      'Số hiệu nguyên tử · đồng vị · nguyên tử khối',

    objective:
      'Hiểu số hiệu nguyên tử, đồng vị và nguyên tử khối trung bình.',

    duration:
      7,

    steps: [

      I(
        'Số hiệu nguyên tử Z',
        'Số hiệu nguyên tử Z bằng số proton trong hạt nhân.',
        [
          'Z xác định nguyên tố hóa học.',
          'Nguyên tử trung hòa có số electron bằng Z.'
        ],
        'Z = số proton = số electron (nguyên tử trung hòa)'
      ),

      Q(
        'g10-l2-q1',
        'Nguyên tử có 11 proton thuộc nguyên tố có Z bằng bao nhiêu?',
        [
          '10',
          '11',
          '12',
          '22'
        ],
        1,
        'Z chính là số proton nên Z = 11.'
      ),

      I(
        'Đồng vị',
        'Các đồng vị của cùng một nguyên tố có cùng số proton nhưng khác số neutron.',
        [
          'Cùng Z.',
          'Khác số khối A.',
          'Tính chất hóa học gần giống nhau.'
        ]
      ),

      Q(
        'g10-l2-q2',
        'Hai nguyên tử được xem là đồng vị khi chúng có đặc điểm nào?',
        [
          'Cùng neutron, khác proton',
          'Cùng proton, khác neutron',
          'Cùng số khối',
          'Khác proton và neutron'
        ],
        1,
        'Đồng vị có cùng số proton nhưng khác số neutron.'
      ),

      I(
        'Nguyên tử khối trung bình',
        'Nguyên tử khối của một nguyên tố được tính dựa trên khối lượng và tỉ lệ các đồng vị tự nhiên.',
        [],
        'Ā = Σ(Aᵢ × %ᵢ) / 100'
      )

    ]

  }),


  G10({

    lesson: 3,

    title:
      'Cấu trúc lớp vỏ electron',

    subtitle:
      'Lớp · phân lớp · cấu hình electron',

    objective:
      'Hiểu cách electron phân bố trong lớp vỏ nguyên tử.',

    duration:
      8,

    steps: [

      I(
        'Lớp và phân lớp electron',
        'Electron được phân bố theo các lớp có mức năng lượng khác nhau.',
        [
          'Các lớp được đánh số n = 1, 2, 3...',
          'Phân lớp gồm s, p, d, f.',
          'Electron ưu tiên trạng thái năng lượng thấp trước.'
        ]
      ),

      Q(
        'g10-l3-q1',
        'Lớp electron thứ hai chứa tối đa bao nhiêu electron?',
        [
          '2',
          '8',
          '18',
          '32'
        ],
        1,
        'Theo 2n², với n = 2 thì số electron tối đa là 8.'
      ),

      I(
        'Cấu hình electron',
        'Cấu hình electron biểu diễn sự phân bố electron vào các phân lớp.',
        [],
        'Na: 1s² 2s² 2p⁶ 3s¹'
      ),

      Q(
        'g10-l3-q2',
        'Nguyên tử Na có bao nhiêu electron lớp ngoài cùng?',
        [
          '1',
          '2',
          '6',
          '8'
        ],
        0,
        'Na có cấu hình ngoài cùng 3s¹ nên có 1 electron hóa trị.'
      ),

      O(
        'Ý nghĩa',
        'Electron lớp ngoài cùng có vai trò quan trọng trong việc quyết định tính chất hóa học của nguyên tố.'
      )

    ]

  }),


  G10({

    lesson: 4,

    title:
      'Challenge — Cấu tạo nguyên tử',

    subtitle:
      'Ôn tập chương 1',

    objective:
      'Củng cố kiến thức về nguyên tử, đồng vị và cấu hình electron.',

    duration:
      8,

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g10-l4-q1',
        'Số hiệu nguyên tử bằng đại lượng nào?',
        [
          'Số neutron',
          'Số proton',
          'Số khối',
          'Tổng proton và neutron'
        ],
        1,
        'Z bằng số proton.'
      ),

      Q(
        'g10-l4-q2',
        'Số khối A được tính bằng:',
        [
          'p + n',
          'p + e',
          'n + e',
          'p − n'
        ],
        0,
        'A bằng tổng số proton và neutron.'
      ),

      Q(
        'g10-l4-q3',
        'Hai đồng vị của một nguyên tố luôn có cùng:',
        [
          'Số neutron',
          'Số khối',
          'Số proton',
          'Khối lượng'
        ],
        2,
        'Đồng vị cùng số proton.'
      ),

      Q(
        'g10-l4-q4',
        'Phân lớp p chứa tối đa bao nhiêu electron?',
        [
          '2',
          '6',
          '10',
          '14'
        ],
        1,
        'Phân lớp p có 3 orbital, chứa tối đa 6 electron.'
      ),

      Q(
        'g10-l4-q5',
        'Nguyên tử trung hòa có Z = 17 chứa bao nhiêu electron?',
        [
          '16',
          '17',
          '18',
          '34'
        ],
        1,
        'Nguyên tử trung hòa có số electron bằng Z.'
      )

    ]

  }),


  /* =====================================================
     CHƯƠNG 2 — BẢNG TUẦN HOÀN
  ===================================================== */

  G10({

    lesson: 5,

    title:
      'Cấu tạo bảng tuần hoàn',

    subtitle:
      'Ô nguyên tố · chu kì · nhóm',

    objective:
      'Hiểu nguyên tắc sắp xếp các nguyên tố trong bảng tuần hoàn.',

    steps: [

      I(
        'Nguyên tắc sắp xếp',
        'Các nguyên tố được sắp xếp theo chiều tăng dần của điện tích hạt nhân.',
        [
          'Mỗi nguyên tố nằm trong một ô.',
          'Các hàng ngang là chu kì.',
          'Các cột là nhóm.'
        ]
      ),

      Q(
        'g10-l5-q1',
        'Số thứ tự chu kì thường cho biết điều gì?',
        [
          'Số proton',
          'Số lớp electron',
          'Số neutron',
          'Số electron hóa trị của mọi nguyên tố'
        ],
        1,
        'Số thứ tự chu kì bằng số lớp electron đang được sử dụng.'
      ),

      I(
        'Nhóm nguyên tố',
        'Các nguyên tố cùng nhóm chính thường có cấu hình electron hóa trị tương tự nên có tính chất gần giống nhau.'
      ),

      Q(
        'g10-l5-q2',
        'Na và K có tính chất gần giống nhau chủ yếu vì:',
        [
          'Cùng số neutron',
          'Cùng số lớp electron',
          'Đều có 1 electron hóa trị',
          'Có cùng khối lượng'
        ],
        2,
        'Na và K đều thuộc nhóm IA với 1 electron hóa trị.'
      )

    ]

  }),


  G10({

    lesson: 6,

    title:
      'Xu hướng tuần hoàn',

    subtitle:
      'Bán kính · độ âm điện · năng lượng ion hóa',

    objective:
      'Dự đoán xu hướng biến đổi tính chất nguyên tử.',

    duration:
      7,

    steps: [

      I(
        'Trong một chu kì',
        'Khi đi từ trái sang phải, điện tích hạt nhân tăng trong khi electron được thêm vào cùng lớp.',
        [
          'Bán kính nguyên tử thường giảm.',
          'Độ âm điện thường tăng.',
          'Năng lượng ion hóa thứ nhất thường tăng.'
        ]
      ),

      Q(
        'g10-l6-q1',
        'Trong một chu kì từ trái sang phải, bán kính nguyên tử nhìn chung:',
        [
          'Tăng',
          'Giảm',
          'Không đổi',
          'Tăng rồi giảm ngẫu nhiên'
        ],
        1,
        'Lực hút hạt nhân hiệu dụng tăng làm bán kính giảm.'
      ),

      I(
        'Trong một nhóm',
        'Từ trên xuống dưới, số lớp electron tăng.',
        [
          'Bán kính tăng.',
          'Khả năng nhường electron của kim loại thường tăng.'
        ]
      ),

      Q(
        'g10-l6-q2',
        'Nguyên tố nào có độ âm điện lớn hơn trong cặp Na và Cl?',
        [
          'Na',
          'Cl',
          'Bằng nhau',
          'Không so sánh được'
        ],
        1,
        'Cl nằm về phía phải của cùng chu kì nên có độ âm điện lớn hơn.'
      )

    ]

  }),


  G10({

    lesson: 7,

    title:
      'Xu hướng tính chất hợp chất',

    subtitle:
      'Oxide · hydroxide · acid · base',

    objective:
      'Liên hệ vị trí nguyên tố với tính acid–base của oxide và hydroxide.',

    steps: [

      I(
        'Biến đổi trong chu kì',
        'Từ trái sang phải, tính kim loại giảm và tính phi kim tăng.',
        [
          'Oxide kim loại mạnh thường có tính base.',
          'Oxide phi kim thường có tính acid.',
          'Một số oxide trung gian có tính lưỡng tính.'
        ]
      ),

      Q(
        'g10-l7-q1',
        'Na₂O được xếp chủ yếu vào loại oxide nào?',
        [
          'Oxide acid',
          'Oxide base',
          'Oxide trung tính',
          'Peroxide'
        ],
        1,
        'Na₂O là oxide của kim loại kiềm nên có tính base.'
      ),

      Q(
        'g10-l7-q2',
        'Al₂O₃ thể hiện tính chất đặc trưng nào?',
        [
          'Chỉ acid',
          'Chỉ base',
          'Lưỡng tính',
          'Không phản ứng'
        ],
        2,
        'Al₂O₃ có thể phản ứng với cả acid và base mạnh.'
      )

    ]

  }),


  G10({

    lesson: 8,

    title:
      'Định luật tuần hoàn',

    subtitle:
      'Từ cấu hình electron đến dự đoán tính chất',

    objective:
      'Hiểu ý nghĩa của định luật tuần hoàn trong dự đoán tính chất nguyên tố.',

    steps: [

      I(
        'Định luật tuần hoàn',
        'Tính chất của các nguyên tố và hợp chất của chúng biến đổi tuần hoàn theo chiều tăng của điện tích hạt nhân.'
      ),

      Q(
        'g10-l8-q1',
        'Nguyên tố có cấu hình ngoài cùng ns¹ thường thuộc nhóm nào?',
        [
          'IA',
          'IIA',
          'VIIA',
          'VIIIA'
        ],
        0,
        'Các nguyên tố nhóm IA có cấu hình electron hóa trị ns¹.'
      ),

      I(
        'Ứng dụng',
        'Từ vị trí trong bảng tuần hoàn có thể dự đoán cấu hình electron, tính kim loại–phi kim và công thức hợp chất điển hình.'
      ),

      Q(
        'g10-l8-q2',
        'Một nguyên tố nằm ở nhóm VIIA thường có bao nhiêu electron hóa trị?',
        [
          '1',
          '2',
          '7',
          '8'
        ],
        2,
        'Nhóm VIIA có 7 electron lớp ngoài cùng.'
      )

    ]

  }),


  G10({

    lesson: 9,

    title:
      'Challenge — Bảng tuần hoàn',

    subtitle:
      'Ôn tập chương 2',

    objective:
      'Củng cố cấu tạo và quy luật biến đổi trong bảng tuần hoàn.',

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g10-l9-q1',
        'Trong một chu kì, độ âm điện nhìn chung:',
        [
          'Giảm',
          'Tăng',
          'Không đổi',
          'Luôn bằng 0'
        ],
        1,
        'Độ âm điện nhìn chung tăng từ trái sang phải.'
      ),

      Q(
        'g10-l9-q2',
        'Trong một nhóm chính từ trên xuống, bán kính nguyên tử:',
        [
          'Tăng',
          'Giảm',
          'Không đổi',
          'Bằng 0'
        ],
        0,
        'Số lớp electron tăng làm bán kính tăng.'
      ),

      Q(
        'g10-l9-q3',
        'Nguyên tố nhóm IIA có số electron hóa trị thường là:',
        [
          '1',
          '2',
          '6',
          '8'
        ],
        1,
        'Nhóm IIA có cấu hình hóa trị ns².'
      ),

      Q(
        'g10-l9-q4',
        'Trong chu kì, tính kim loại thường:',
        [
          'Tăng từ trái sang phải',
          'Giảm từ trái sang phải',
          'Không đổi',
          'Không có quy luật'
        ],
        1,
        'Tính kim loại nhìn chung giảm từ trái sang phải.'
      ),

      Q(
        'g10-l9-q5',
        'Oxide của phi kim mạnh thường có xu hướng:',
        [
          'Có tính acid',
          'Có tính base mạnh',
          'Là kim loại',
          'Không chứa oxygen'
        ],
        0,
        'Nhiều oxide phi kim có tính acid.'
      )

    ]

  }),


  /* =====================================================
     CHƯƠNG 3 — LIÊN KẾT HÓA HỌC
  ===================================================== */

  G10({

    lesson: 10,

    title:
      'Quy tắc octet',

    subtitle:
      'Cấu hình electron bền',

    objective:
      'Hiểu xu hướng đạt cấu hình electron bền của nguyên tử.',

    steps: [

      I(
        'Quy tắc octet',
        'Khi tạo liên kết, nhiều nguyên tử có xu hướng đạt 8 electron ở lớp ngoài cùng giống khí hiếm.'
      ),

      Q(
        'g10-l10-q1',
        'Na có xu hướng làm gì để đạt cấu hình bền?',
        [
          'Nhận 1 electron',
          'Nhường 1 electron',
          'Nhận 7 electron',
          'Nhường 8 electron'
        ],
        1,
        'Na có 1 electron hóa trị nên dễ nhường 1 electron tạo Na⁺.'
      ),

      Q(
        'g10-l10-q2',
        'Cl có xu hướng:',
        [
          'Nhận 1 electron',
          'Nhường 1 electron',
          'Nhường 7 electron',
          'Không liên kết'
        ],
        0,
        'Cl có 7 electron hóa trị nên thường nhận thêm 1 electron.'
      )

    ]

  }),


  G10({

    lesson: 11,

    title:
      'Liên kết ion',

    subtitle:
      'Cho – nhận electron và lực hút tĩnh điện',

    objective:
      'Hiểu cơ chế hình thành ion và liên kết ion.',

    steps: [

      I(
        'Hình thành ion',
        'Kim loại có thể nhường electron tạo cation, phi kim có thể nhận electron tạo anion.',
        [],
        'Na → Na⁺ + e⁻ ; Cl + e⁻ → Cl⁻'
      ),

      Q(
        'g10-l11-q1',
        'Liên kết trong NaCl hình thành chủ yếu do:',
        [
          'Dùng chung electron',
          'Lực hút giữa Na⁺ và Cl⁻',
          'Liên kết hydrogen',
          'Lực Van der Waals'
        ],
        1,
        'Liên kết ion là lực hút tĩnh điện giữa các ion trái dấu.'
      ),

      I(
        'Tinh thể ion',
        'Hợp chất ion không tồn tại dưới dạng một phân tử NaCl riêng lẻ mà tạo mạng tinh thể ion.'
      ),

      Q(
        'g10-l11-q2',
        'Hợp chất ion dẫn điện tốt trong trường hợp nào?',
        [
          'Tinh thể rắn khan',
          'Khi nóng chảy hoặc tan trong nước',
          'Ở mọi trạng thái',
          'Không bao giờ'
        ],
        1,
        'Khi nóng chảy hoặc trong dung dịch, ion có thể chuyển động.'
      )

    ]

  }),


  G10({

    lesson: 12,

    title:
      'Liên kết cộng hóa trị',

    subtitle:
      'Dùng chung cặp electron',

    objective:
      'Hiểu sự hình thành liên kết cộng hóa trị và độ phân cực liên kết.',

    steps: [

      I(
        'Cặp electron chung',
        'Liên kết cộng hóa trị được tạo thành khi hai nguyên tử dùng chung một hay nhiều cặp electron.'
      ),

      Q(
        'g10-l12-q1',
        'Trong phân tử H₂ có bao nhiêu cặp electron liên kết?',
        [
          '0',
          '1',
          '2',
          '3'
        ],
        1,
        'Hai nguyên tử H dùng chung một cặp electron.'
      ),

      I(
        'Liên kết phân cực',
        'Nếu hai nguyên tử có độ âm điện khác nhau, cặp electron chung bị lệch về phía nguyên tử có độ âm điện lớn hơn.'
      ),

      Q(
        'g10-l12-q2',
        'Liên kết H–Cl được xếp chủ yếu là:',
        [
          'Cộng hóa trị không phân cực',
          'Cộng hóa trị phân cực',
          'Liên kết kim loại',
          'Liên kết ion hoàn toàn'
        ],
        1,
        'Cl có độ âm điện lớn hơn H nên liên kết H–Cl phân cực.'
      )

    ]

  }),


  G10({

    lesson: 13,

    title:
      'Liên kết hydrogen và Van der Waals',

    subtitle:
      'Tương tác giữa các phân tử',

    objective:
      'Hiểu vai trò của tương tác giữa các phân tử đối với tính chất vật lí.',

    steps: [

      I(
        'Liên kết hydrogen',
        'Liên kết hydrogen là tương tác tương đối mạnh giữa H liên kết với nguyên tử có độ âm điện lớn và một nguyên tử giàu electron ở phân tử khác.',
        [
          'Thường gặp với O, N, F.',
          'Ảnh hưởng rõ đến nhiệt độ sôi và độ tan.'
        ]
      ),

      Q(
        'g10-l13-q1',
        'Chất nào tạo liên kết hydrogen mạnh giữa các phân tử?',
        [
          'CH₄',
          'H₂O',
          'CO₂',
          'Cl₂'
        ],
        1,
        'H₂O tạo mạng liên kết hydrogen mạnh.'
      ),

      I(
        'Tương tác Van der Waals',
        'Lực Van der Waals xuất hiện giữa các nguyên tử và phân tử do tương tác lưỡng cực tức thời hoặc vĩnh cửu.'
      ),

      Q(
        'g10-l13-q2',
        'Khi kích thước và khả năng phân cực của phân tử tăng, lực Van der Waals thường:',
        [
          'Tăng',
          'Giảm về 0',
          'Không đổi',
          'Biến mất'
        ],
        0,
        'Đám mây electron dễ phân cực hơn thường làm tương tác phân tán mạnh hơn.'
      )

    ]

  }),


  G10({

    lesson: 14,

    title:
      'Challenge — Liên kết hóa học',

    subtitle:
      'Ôn tập chương 3',

    objective:
      'Phân biệt các loại liên kết và tương tác hóa học.',

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g10-l14-q1',
        'NaCl chứa loại liên kết chính nào?',
        [
          'Ion',
          'Cộng hóa trị không phân cực',
          'Hydrogen',
          'Kim loại'
        ],
        0,
        'NaCl là hợp chất ion.'
      ),

      Q(
        'g10-l14-q2',
        'Cl₂ có liên kết:',
        [
          'Ion',
          'Cộng hóa trị không phân cực',
          'Cộng hóa trị phân cực mạnh',
          'Hydrogen'
        ],
        1,
        'Hai nguyên tử giống nhau có độ âm điện bằng nhau.'
      ),

      Q(
        'g10-l14-q3',
        'Liên kết hydrogen là:',
        [
          'Liên kết trong hạt nhân',
          'Một dạng tương tác giữa các phân tử/nhóm thích hợp',
          'Liên kết kim loại',
          'Quá trình ion hóa'
        ],
        1,
        'Liên kết hydrogen là một tương tác đặc biệt liên quan đến H.'
      ),

      Q(
        'g10-l14-q4',
        'Liên kết cộng hóa trị được hình thành chủ yếu bằng:',
        [
          'Dùng chung electron',
          'Trao đổi neutron',
          'Tạo proton',
          'Phá hạt nhân'
        ],
        0,
        'Các nguyên tử dùng chung cặp electron.'
      )

    ]

  }),


  /* =====================================================
     CHƯƠNG 4 — REDOX
  ===================================================== */

  G10({

    lesson: 15,

    id:
      'g10-redox-permanganate',

    title:
      'Oxi hóa – khử với permanganate',

    subtitle:
      'Fe²⁺ và MnO₄⁻ trong môi trường acid',

    objective:
      'Nhận biết chất oxi hóa, chất khử và sự thay đổi số oxi hóa.',

    duration:
      9,

    difficulty:
      'Trung bình',

    chemicals: [
      'feso4',
      'h2so4',
      'kmno4'
    ],

    steps: [

      I(
        'Phản ứng oxi hóa – khử',
        'Phản ứng redox có sự thay đổi số oxi hóa và sự chuyển electron giữa các chất.',
        [
          'Chất khử nhường electron.',
          'Chất oxi hóa nhận electron.'
        ]
      ),

      P(
        'g10-l15-p1',
        'Khi Fe²⁺ phản ứng với MnO₄⁻ trong môi trường acid, màu tím của permanganate sẽ:',
        [
          'Đậm hơn',
          'Nhạt dần',
          'Chuyển xanh',
          'Không đổi'
        ],
        1,
        'MnO₄⁻ bị khử nên màu tím giảm.'
      ),

      A(
        'feso4',
        'Thêm dung dịch FeSO₄ vào cốc.'
      ),

      A(
        'h2so4',
        'Thêm H₂SO₄ để tạo môi trường acid.'
      ),

      A(
        'kmno4',
        'Thêm KMnO₄ vào hỗn hợp.'
      ),

      R(
        'feso4-kmno4-acid',
        'Quan sát phản ứng oxi hóa – khử.',
        'Phản ứng redox đã được mô phỏng.'
      ),

      Q(
        'g10-l15-q1',
        'Trong phản ứng này Fe²⁺ đóng vai trò chủ yếu là:',
        [
          'Chất oxi hóa',
          'Chất khử',
          'Chất xúc tác',
          'Chất chỉ thị'
        ],
        1,
        'Fe²⁺ bị oxi hóa thành Fe³⁺ nên là chất khử.'
      )

    ]

  }),


  G10({

    lesson: 16,

    title:
      'Challenge — Phản ứng oxi hóa – khử',

    subtitle:
      'Ôn tập chương 4',

    objective:
      'Củng cố số oxi hóa và vai trò chất oxi hóa–khử.',

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g10-l16-q1',
        'Oxi hóa là quá trình:',
        [
          'Nhận electron',
          'Nhường electron',
          'Nhận proton trong mọi trường hợp',
          'Không đổi số oxi hóa'
        ],
        1,
        'Oxi hóa là quá trình nhường electron.'
      ),

      Q(
        'g10-l16-q2',
        'Khử là quá trình:',
        [
          'Nhận electron',
          'Nhường electron',
          'Tăng số oxi hóa',
          'Tạo neutron'
        ],
        0,
        'Khử là quá trình nhận electron.'
      ),

      Q(
        'g10-l16-q3',
        'Chất oxi hóa là chất:',
        [
          'Bị oxi hóa',
          'Bị khử',
          'Luôn là oxygen',
          'Không đổi'
        ],
        1,
        'Chất oxi hóa nhận electron và bị khử.'
      ),

      Q(
        'g10-l16-q4',
        'Trong ion SO₄²⁻, số oxi hóa của S là:',
        [
          '+2',
          '+4',
          '+6',
          '−2'
        ],
        2,
        'S có số oxi hóa +6.'
      )

    ]

  }),


  /* =====================================================
     CHƯƠNG 5 — NĂNG LƯỢNG HÓA HỌC
  ===================================================== */

  G10({

    lesson: 17,

    title:
      'Biến thiên enthalpy',

    subtitle:
      'Tỏa nhiệt · thu nhiệt · ΔH',

    objective:
      'Phân biệt phản ứng tỏa nhiệt và thu nhiệt, hiểu dấu của ΔH.',

    duration:
      7,

    steps: [

      I(
        'Trao đổi năng lượng',
        'Phản ứng hóa học có thể giải phóng nhiệt ra môi trường hoặc hấp thụ nhiệt từ môi trường.'
      ),

      Q(
        'g10-l17-q1',
        'Phản ứng tỏa nhiệt có ΔH thường:',
        [
          'Dương',
          'Âm',
          'Bằng +1',
          'Không xác định'
        ],
        1,
        'Hệ giải phóng năng lượng nên ΔH < 0.'
      ),

      I(
        'Phản ứng thu nhiệt',
        'Nếu hệ hấp thụ nhiệt từ môi trường thì biến thiên enthalpy mang giá trị dương.',
        [],
        'Tỏa nhiệt: ΔH < 0 · Thu nhiệt: ΔH > 0'
      ),

      Q(
        'g10-l17-q2',
        'Khi nhiệt độ môi trường quanh hệ tăng do phản ứng, phản ứng nhiều khả năng là:',
        [
          'Tỏa nhiệt',
          'Thu nhiệt',
          'Không có năng lượng',
          'Phản ứng hạt nhân'
        ],
        0,
        'Nhiệt được giải phóng ra môi trường.'
      )

    ]

  }),


  G10({

    lesson: 18,

    title:
      'Challenge — Năng lượng hóa học',

    subtitle:
      'Ôn tập chương 5',

    objective:
      'Củng cố cách nhận biết và diễn giải biến thiên enthalpy.',

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g10-l18-q1',
        'ΔH = −100 kJ biểu thị quá trình:',
        [
          'Thu nhiệt',
          'Tỏa nhiệt',
          'Không trao đổi năng lượng',
          'Không thể xác định'
        ],
        1,
        'ΔH âm là quá trình tỏa nhiệt.'
      ),

      Q(
        'g10-l18-q2',
        'ΔH = +50 kJ cho biết hệ:',
        [
          'Giải phóng 50 kJ',
          'Hấp thụ 50 kJ',
          'Không đổi năng lượng',
          'Mất 50 mol'
        ],
        1,
        'ΔH dương là hấp thụ nhiệt.'
      ),

      Q(
        'g10-l18-q3',
        'Đốt cháy nhiên liệu thường là quá trình:',
        [
          'Tỏa nhiệt',
          'Thu nhiệt',
          'Không đổi nhiệt',
          'Luôn thuận nghịch'
        ],
        0,
        'Phản ứng cháy thường giải phóng nhiều năng lượng.'
      )

    ]

  }),


  /* =====================================================
     CHƯƠNG 6 — TỐC ĐỘ PHẢN ỨNG
  ===================================================== */

  G10({

    lesson: 19,

    title:
      'Khám phá tốc độ phản ứng',

    subtitle:
      'Nồng độ · nhiệt độ · diện tích · xúc tác',

    objective:
      'Hiểu các yếu tố ảnh hưởng đến tốc độ phản ứng.',

    duration:
      8,

    chemicals: [
      'hcl',
      'na2co3'
    ],

    steps: [

      I(
        'Tốc độ phản ứng',
        'Tốc độ phản ứng cho biết mức độ nhanh hay chậm của sự biến đổi chất theo thời gian.'
      ),

      P(
        'g10-l19-p1',
        'Khi carbonate tác dụng với acid, hiện tượng dễ quan sát nhất là:',
        [
          'Có khí thoát ra',
          'Kết tủa xanh',
          'Dung dịch đông đặc',
          'Không có hiện tượng'
        ],
        0,
        'Carbonate tác dụng với acid giải phóng CO₂.'
      ),

      A(
        'hcl',
        'Thêm dung dịch HCl vào cốc.'
      ),

      A(
        'na2co3',
        'Thêm Na₂CO₃ và quan sát sự tạo khí.'
      ),

      O(
        'Quan sát tốc độ',
        'Sự xuất hiện bọt khí là một dấu hiệu trực quan để theo dõi phản ứng.',
        [
          'Tăng nhiệt độ thường làm phản ứng nhanh hơn.',
          'Tăng nồng độ chất phản ứng thường làm số va chạm hiệu quả tăng.',
          'Chất xúc tác làm giảm năng lượng hoạt hóa.'
        ]
      ),

      Q(
        'g10-l19-q1',
        'Yếu tố nào thường làm tốc độ phản ứng tăng?',
        [
          'Giảm nhiệt độ',
          'Tăng nhiệt độ',
          'Giảm nồng độ mọi chất',
          'Loại bỏ chất phản ứng'
        ],
        1,
        'Tăng nhiệt độ làm các hạt chuyển động nhanh hơn và tăng va chạm hiệu quả.'
      )

    ]

  }),


  G10({

    lesson: 20,

    title:
      'Challenge — Tốc độ phản ứng',

    subtitle:
      'Ôn tập chương 6',

    objective:
      'Nhận biết các yếu tố kiểm soát tốc độ phản ứng.',

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g10-l20-q1',
        'Nghiền nhỏ chất rắn thường làm phản ứng nhanh hơn vì:',
        [
          'Tăng diện tích tiếp xúc',
          'Giảm khối lượng mol',
          'Tạo nguyên tố mới',
          'Giảm số hạt'
        ],
        0,
        'Diện tích tiếp xúc tăng làm tăng số va chạm.'
      ),

      Q(
        'g10-l20-q2',
        'Chất xúc tác làm phản ứng nhanh hơn chủ yếu bằng cách:',
        [
          'Tăng ΔH',
          'Giảm năng lượng hoạt hóa',
          'Tăng khối lượng chất',
          'Biến thành sản phẩm'
        ],
        1,
        'Xúc tác tạo con đường phản ứng có năng lượng hoạt hóa thấp hơn.'
      ),

      Q(
        'g10-l20-q3',
        'Khi tăng nồng độ chất phản ứng trong dung dịch, số va chạm giữa các tiểu phân thường:',
        [
          'Tăng',
          'Giảm về 0',
          'Không đổi tuyệt đối',
          'Biến mất'
        ],
        0,
        'Mật độ tiểu phân lớn hơn làm số va chạm tăng.'
      )

    ]

  }),


  /* =====================================================
     CHƯƠNG 7 — HALOGEN
  ===================================================== */

  G10({

    lesson: 21,

    title:
      'Khám phá nhóm halogen',

    subtitle:
      'F · Cl · Br · I',

    objective:
      'Hiểu cấu hình electron, tính oxi hóa và xu hướng của nhóm halogen.',

    duration:
      7,

    steps: [

      I(
        'Cấu hình electron',
        'Halogen thuộc nhóm VIIA và thường có 7 electron ở lớp ngoài cùng.',
        [],
        'ns²np⁵'
      ),

      Q(
        'g10-l21-q1',
        'Halogen thường có xu hướng:',
        [
          'Nhận 1 electron',
          'Nhường 1 electron',
          'Nhận 7 proton',
          'Không tham gia phản ứng'
        ],
        0,
        'Halogen thường nhận thêm 1 electron để đạt cấu hình bền.'
      ),

      I(
        'Tính oxi hóa',
        'Khả năng oxi hóa của halogen nhìn chung giảm khi đi từ F₂ xuống I₂.',
        [
          'F₂ mạnh nhất.',
          'Cl₂ mạnh hơn Br₂.',
          'Br₂ mạnh hơn I₂.'
        ]
      ),

      Q(
        'g10-l21-q2',
        'Thứ tự tính oxi hóa giảm dần phù hợp là:',
        [
          'I₂ > Br₂ > Cl₂',
          'Cl₂ > Br₂ > I₂',
          'Br₂ > I₂ > Cl₂',
          'I₂ > Cl₂ > Br₂'
        ],
        1,
        'Trong ba chất này: Cl₂ > Br₂ > I₂.'
      )

    ]

  }),


  G10({

    lesson: 22,

    id:
      'g10-halide-chloride',

    title:
      'Nhận biết ion chloride',

    subtitle:
      'Ag⁺ + Cl⁻ → AgCl↓',

    objective:
      'Nhận biết ion chloride qua kết tủa bạc chloride màu trắng.',

    duration:
      5,

    chemicals: [
      'nacl',
      'agno3'
    ],

    steps: [

      I(
        'Thuốc thử AgNO₃',
        'Ion Ag⁺ tạo các kết tủa bạc halide có màu khác nhau với Cl⁻, Br⁻ và I⁻.'
      ),

      P(
        'g10-l22-cl-p1',
        'Khi AgNO₃ được thêm vào dung dịch NaCl, hiện tượng nào xảy ra?',
        [
          'Kết tủa trắng',
          'Khí màu nâu',
          'Dung dịch đỏ',
          'Không phản ứng'
        ],
        0,
        'AgCl là kết tủa màu trắng.'
      ),

      A(
        'nacl',
        'Thêm dung dịch NaCl.'
      ),

      A(
        'agno3',
        'Thêm dung dịch AgNO₃.'
      ),

      R(
        'agno3-nacl',
        'Quan sát kết tủa AgCl.',
        'Kết tủa trắng AgCl đã được tạo thành.'
      ),

      Q(
        'g10-l22-cl-q1',
        'Ion nào trực tiếp tạo kết tủa với Ag⁺ trong thí nghiệm?',
        [
          'Na⁺',
          'Cl⁻',
          'NO₃⁻',
          'H⁺'
        ],
        1,
        'Ag⁺ kết hợp với Cl⁻ tạo AgCl.'
      )

    ]

  }),


  G10({

    lesson: 22,

    id:
      'g10-halide-iodide',

    title:
      'Phân biệt ion iodide',

    subtitle:
      'Ag⁺ + I⁻ → AgI↓',

    objective:
      'Phân biệt ion iodide thông qua màu kết tủa AgI.',

    duration:
      5,

    chemicals: [
      'ki',
      'agno3'
    ],

    steps: [

      P(
        'g10-l22-i-p1',
        'AgI có màu đặc trưng nào?',
        [
          'Trắng',
          'Vàng',
          'Xanh lam',
          'Đỏ'
        ],
        1,
        'AgI là kết tủa màu vàng.'
      ),

      A(
        'ki',
        'Thêm dung dịch KI.'
      ),

      A(
        'agno3',
        'Thêm dung dịch AgNO₃.'
      ),

      R(
        'agno3-ki',
        'Quan sát màu kết tủa AgI.',
        'Kết tủa AgI màu vàng đã xuất hiện.'
      ),

      O(
        'So sánh',
        'Màu kết tủa giúp phân biệt một số ion halide.',
        [
          'AgCl: trắng.',
          'AgBr: màu kem/vàng nhạt.',
          'AgI: vàng.'
        ]
      )

    ]

  })

]