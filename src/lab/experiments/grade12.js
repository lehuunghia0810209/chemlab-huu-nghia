/* =========================================================
   CHEMLAB — HÓA HỌC 12
   KẾT NỐI TRI THỨC
   8 chương · 30 bài

   Guided Learning + Guided Lab
========================================================= */


/* =========================================================
   HELPERS
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

    type:
      'info',

    kicker:
      'KIẾN THỨC',

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

    type:
      'add',

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

    type:
      'heat',

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

    type:
      'reaction',

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

    type:
      'observation',

    kicker:
      'QUAN SÁT & KẾT LUẬN',

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

  if (
    lesson <=
    3
  ) {

    return 'g12-c1'

  }


  if (
    lesson <=
    7
  ) {

    return 'g12-c2'

  }


  if (
    lesson <=
    11
  ) {

    return 'g12-c3'

  }


  if (
    lesson <=
    14
  ) {

    return 'g12-c4'

  }


  if (
    lesson <=
    17
  ) {

    return 'g12-c5'

  }


  if (
    lesson <=
    23
  ) {

    return 'g12-c6'

  }


  if (
    lesson <=
    26
  ) {

    return 'g12-c7'

  }


  return 'g12-c8'

}


/* =========================================================
   ACTIVITY BUILDER
========================================================= */

function G12({

  lesson,

  id =
    `g12-lesson-${
      String(
        lesson
      )
        .padStart(
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
      12,

    chapterId:
      chapterOf(
        lesson
      ),

    lessonId:
      `g12-l${lesson}`,

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
   GRADE 12
========================================================= */

export const GRADE12_EXPERIMENTS = [

  /* =====================================================
     CHƯƠNG 1
     ESTER — LIPID
  ===================================================== */

  G12({

    lesson:
      1,

    title:
      'Ester và lipid',

    subtitle:
      'Cấu tạo · thủy phân · chất béo',

    objective:
      'Hiểu cấu tạo ester, lipid và các phản ứng đặc trưng.',

    duration:
      8,

    chemicals: [
      'ethylEthanoate',
      'naoh'
    ],

    steps: [

      I(
        'Ester',
        'Ester đơn chức thường có nhóm chức –COO– nằm giữa hai gốc hydrocarbon.',
        [
          'Ester có thể được tạo từ carboxylic acid và alcohol.',
          'Nhiều ester có mùi đặc trưng.',
          'Ester có thể bị thủy phân.'
        ],
        'R–COO–R′'
      ),

      Q(
        'g12-l1-q1',
        'Nhóm chức đặc trưng của ester là:',
        [
          '–COO–',
          '–OH',
          '–CHO',
          '–NH₂'
        ],
        0,
        'Ester chứa nhóm –COO–.'
      ),

      I(
        'Lipid',
        'Chất béo là triester của glycerol với các acid béo.',
        [],
        'Glycerol + acid béo → triglyceride'
      ),

      P(
        'g12-l1-p1',
        'Khi ester phản ứng với NaOH, quá trình này được gọi là:',
        [
          'Thủy phân trong môi trường kiềm',
          'Trùng hợp',
          'Nitration',
          'Khử hoàn toàn'
        ],
        0,
        'Ester bị thủy phân bởi base tạo carboxylate và alcohol.'
      ),

      A(
        'ethylEthanoate',
        'Thêm ethyl ethanoate vào cốc.'
      ),

      A(
        'naoh',
        'Thêm dung dịch NaOH.'
      ),

      H(
        'Gia nhiệt hỗn hợp mô phỏng.'
      ),

      O(
        'Thủy phân ester',
        'Trong môi trường kiềm, ester bị thủy phân tạo muối carboxylate và alcohol.',
        [
          'Phản ứng thủy phân kiềm thường được xem là phản ứng một chiều.',
          'Quá trình thủy phân chất béo trong kiềm là cơ sở của phản ứng xà phòng hóa.'
        ]
      )

    ]

  }),


  G12({

    lesson:
      2,

    title:
      'Xà phòng và chất giặt rửa',

    subtitle:
      'Đầu ưa nước · đuôi kị nước',

    objective:
      'Hiểu cấu tạo và cơ chế làm sạch của xà phòng và chất giặt rửa.',

    duration:
      7,

    steps: [

      I(
        'Cấu tạo phân tử',
        'Phân tử chất hoạt động bề mặt gồm một đầu ưa nước và một phần hydrocarbon kị nước.',
        [
          'Đầu phân cực tương tác tốt với nước.',
          'Đuôi hydrocarbon tương tác với dầu mỡ.'
        ]
      ),

      Q(
        'g12-l2-q1',
        'Phần nào của phân tử xà phòng dễ tương tác với dầu mỡ?',
        [
          'Đuôi hydrocarbon',
          'Đầu ion',
          'Ion Na⁺ tự do',
          'Phân tử nước'
        ],
        0,
        'Đuôi hydrocarbon không phân cực tương tác với dầu mỡ.'
      ),

      I(
        'Micelle',
        'Trong nước, các phân tử chất hoạt động bề mặt có thể tập hợp tạo micelle bao quanh vết dầu mỡ.',
        [
          'Đuôi kị nước hướng vào trong.',
          'Đầu ưa nước hướng ra ngoài.'
        ]
      ),

      Q(
        'g12-l2-q2',
        'Trong micelle chứa dầu mỡ, đầu ưa nước thường hướng:',
        [
          'Ra môi trường nước',
          'Vào tâm dầu mỡ',
          'Không có hướng',
          'Vào kim loại'
        ],
        0,
        'Đầu ưa nước tiếp xúc với nước.'
      ),

      O(
        'Kết luận',
        'Cơ chế tạo micelle giúp phân tán dầu mỡ vào nước và loại bỏ vết bẩn.'
      )

    ]

  }),


  G12({

    lesson:
      3,

    title:
      'Challenge — Ester và lipid',

    objective:
      'Ôn tập ester, lipid và xà phòng.',

    difficulty:
      'Thử thách',

    duration:
      8,

    steps: [

      Q(
        'g12-l3-q1',
        'Ethyl ethanoate thuộc loại:',
        [
          'Ester',
          'Alcohol',
          'Aldehyde',
          'Amine'
        ],
        0,
        'Ethyl ethanoate là ester.'
      ),

      Q(
        'g12-l3-q2',
        'Chất béo là ester của glycerol với:',
        [
          'Acid béo',
          'Ammonia',
          'Alkane',
          'Phenol'
        ],
        0,
        'Chất béo là triester của glycerol và acid béo.'
      ),

      Q(
        'g12-l3-q3',
        'Thủy phân chất béo bằng NaOH gọi là:',
        [
          'Xà phòng hóa',
          'Hydrogen hóa',
          'Trùng hợp',
          'Điện phân'
        ],
        0,
        'Đây là phản ứng xà phòng hóa.'
      ),

      Q(
        'g12-l3-q4',
        'Đuôi của phân tử xà phòng có tính:',
        [
          'Kị nước',
          'Ưa nước mạnh',
          'Ion dương',
          'Kim loại'
        ],
        0,
        'Phần hydrocarbon là phần kị nước.'
      )

    ]

  }),


  /* =====================================================
     CHƯƠNG 2
     CARBOHYDRATE
  ===================================================== */

  G12({

    lesson:
      4,

    id:
      'g12-glucose-copper',

    title:
      'Glucose và fructose',

    subtitle:
      'Tính chất của monosaccharide',

    objective:
      'Hiểu cấu tạo và tính chất hóa học quan trọng của glucose, fructose.',

    duration:
      9,

    difficulty:
      'Trung bình',

    chemicals: [
      'glucose',
      'cuso4',
      'naoh'
    ],

    steps: [

      I(
        'Glucose',
        'Glucose là monosaccharide có nhiều nhóm –OH và một nhóm carbonyl ở dạng mạch hở.',
        [],
        'C₆H₁₂O₆'
      ),

      Q(
        'g12-l4-q1',
        'Glucose thuộc loại carbohydrate nào?',
        [
          'Monosaccharide',
          'Disaccharide',
          'Polysaccharide',
          'Protein'
        ],
        0,
        'Glucose là monosaccharide.'
      ),

      P(
        'g12-l4-p1',
        'Khi glucose phản ứng với Cu(II) trong môi trường kiềm và được gia nhiệt, hiện tượng đặc trưng là:',
        [
          'Kết tủa đỏ gạch',
          'Khí màu nâu',
          'Kết tủa đen',
          'Không thay đổi'
        ],
        0,
        'Glucose có thể khử Cu(II) tạo Cu₂O màu đỏ gạch.'
      ),

      A(
        'glucose',
        'Thêm dung dịch glucose.'
      ),

      A(
        'cuso4',
        'Thêm dung dịch CuSO₄.'
      ),

      A(
        'naoh',
        'Thêm dung dịch NaOH.'
      ),

      H(
        'Gia nhiệt hỗn hợp.'
      ),

      R(
        'glucose-cu-hot',
        'Quan sát phản ứng khi nóng.',
        'Kết tủa Cu₂O màu đỏ gạch đã xuất hiện.'
      ),

      O(
        'Kết luận',
        'Glucose có tính khử và đồng thời có tính chất của hợp chất đa chức chứa nhiều nhóm –OH.'
      )

    ]

  }),


  G12({

    lesson:
      5,

    title:
      'Saccharose và maltose',

    objective:
      'Phân biệt cấu tạo và tính chất của hai disaccharide quan trọng.',

    steps: [

      I(
        'Disaccharide',
        'Saccharose và maltose đều có công thức phân tử C₁₂H₂₂O₁₁ nhưng cấu trúc khác nhau.'
      ),

      Q(
        'g12-l5-q1',
        'Saccharose và maltose có cùng:',
        [
          'Công thức phân tử',
          'Cấu tạo hoàn toàn',
          'Tính khử hoàn toàn giống nhau',
          'Nguồn gốc duy nhất'
        ],
        0,
        'Cả hai có công thức C₁₂H₂₂O₁₁.'
      ),

      I(
        'Tính khử',
        'Maltose còn nhóm hemiacetal tự do nên có tính khử; saccharose không có tính khử tương tự.',
        [
          'Maltose: có tính khử.',
          'Saccharose: không thể hiện tính khử như maltose.'
        ]
      ),

      Q(
        'g12-l5-q2',
        'Chất nào có tính khử?',
        [
          'Maltose',
          'Saccharose',
          'Cả hai luôn không khử',
          'Cellulose'
        ],
        0,
        'Maltose có đầu khử.'
      ),

      I(
        'Thủy phân',
        'Saccharose thủy phân tạo glucose và fructose, còn maltose thủy phân tạo glucose.'
      )

    ]

  }),


  G12({

    lesson:
      6,

    id:
      'g12-starch-iodine',

    title:
      'Tinh bột và cellulose',

    subtitle:
      'Polysaccharide',

    objective:
      'Phân biệt tinh bột và cellulose về cấu tạo, tính chất và ứng dụng.',

    duration:
      8,

    chemicals: [
      'starch',
      'iodine'
    ],

    steps: [

      I(
        'Polysaccharide',
        'Tinh bột và cellulose đều là polymer tự nhiên được tạo từ nhiều đơn vị glucose.',
        [],
        '(C₆H₁₀O₅)ₙ'
      ),

      P(
        'g12-l6-p1',
        'Tinh bột tác dụng với iodine tạo màu:',
        [
          'Xanh tím đậm',
          'Đỏ gạch',
          'Không màu',
          'Xanh lá'
        ],
        0,
        'Phức tinh bột–iodine có màu xanh tím đặc trưng.'
      ),

      A(
        'starch',
        'Thêm hồ tinh bột vào cốc.'
      ),

      A(
        'iodine',
        'Thêm dung dịch iodine.'
      ),

      R(
        'starch-iodine',
        'Quan sát màu của hỗn hợp.',
        'Màu xanh tím đặc trưng đã xuất hiện.'
      ),

      Q(
        'g12-l6-q1',
        'Cellulose là thành phần quan trọng của:',
        [
          'Thành tế bào thực vật',
          'Máu người',
          'Muối ăn',
          'Không khí'
        ],
        0,
        'Cellulose là vật liệu cấu trúc quan trọng trong thành tế bào thực vật.'
      )

    ]

  }),


  G12({

    lesson:
      7,

    title:
      'Challenge — Carbohydrate',

    objective:
      'Ôn tập glucose, disaccharide và polysaccharide.',

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g12-l7-q1',
        'Glucose có công thức:',
        [
          'C₆H₁₂O₆',
          'C₁₂H₂₂O₁₁',
          'C₂H₅OH',
          'CH₃COOH'
        ],
        0,
        'Glucose có công thức C₆H₁₂O₆.'
      ),

      Q(
        'g12-l7-q2',
        'Tinh bột được nhận biết bằng:',
        [
          'Iodine',
          'NaCl',
          'KNO₃',
          'Nước cất'
        ],
        0,
        'Iodine tạo màu xanh tím với tinh bột.'
      ),

      Q(
        'g12-l7-q3',
        'Maltose thuộc loại:',
        [
          'Disaccharide',
          'Monosaccharide',
          'Protein',
          'Lipid'
        ],
        0,
        'Maltose là disaccharide.'
      ),

      Q(
        'g12-l7-q4',
        'Cellulose thuộc loại:',
        [
          'Polysaccharide',
          'Amino acid',
          'Ester',
          'Amine'
        ],
        0,
        'Cellulose là polysaccharide.'
      )

    ]

  }),


  /* =====================================================
     CHƯƠNG 3
     NITROGEN COMPOUNDS
  ===================================================== */

  G12({

    lesson:
      8,

    title:
      'Amine',

    subtitle:
      'Dẫn xuất của ammonia',

    objective:
      'Hiểu cấu tạo, phân loại và tính base của amine.',

    steps: [

      I(
        'Amine',
        'Amine có thể xem là dẫn xuất của NH₃ khi một hay nhiều nguyên tử H được thay bằng nhóm hydrocarbon.',
        [],
        'R–NH₂'
      ),

      Q(
        'g12-l8-q1',
        'CH₃NH₂ thuộc loại:',
        [
          'Amine',
          'Amide',
          'Alcohol',
          'Ester'
        ],
        0,
        'CH₃NH₂ là methylamine.'
      ),

      I(
        'Tính base',
        'Cặp electron tự do trên nguyên tử nitrogen giúp nhiều amine có khả năng nhận proton.'
      ),

      Q(
        'g12-l8-q2',
        'Tính base của amine liên quan trực tiếp đến:',
        [
          'Cặp electron tự do trên N',
          'Neutron trong carbon',
          'Liên kết kim loại',
          'Màu của chất'
        ],
        0,
        'Nitrogen có cặp electron tự do có thể nhận H⁺.'
      )

    ]

  }),


  G12({

    lesson:
      9,

    title:
      'Amino acid và peptide',

    objective:
      'Hiểu cấu tạo amino acid, ion lưỡng cực và liên kết peptide.',

    steps: [

      I(
        'Amino acid',
        'Amino acid chứa đồng thời nhóm amino và nhóm carboxyl.',
        [],
        'H₂N–R–COOH'
      ),

      Q(
        'g12-l9-q1',
        'Amino acid chứa đồng thời hai nhóm chức chính nào?',
        [
          '–NH₂ và –COOH',
          '–OH và –CHO',
          '–COO– và –OH',
          '–Cl và –Br'
        ],
        0,
        'Amino acid chứa amino và carboxyl.'
      ),

      I(
        'Liên kết peptide',
        'Liên kết –CO–NH– hình thành giữa các amino acid được gọi là liên kết peptide.',
        [],
        '–CO–NH–'
      ),

      Q(
        'g12-l9-q2',
        'Hai amino acid kết hợp có thể tạo:',
        [
          'Dipeptide',
          'Disaccharide',
          'Triglyceride',
          'Alkane'
        ],
        0,
        'Hai gốc amino acid tạo dipeptide.'
      )

    ]

  }),


  G12({

    lesson:
      10,

    id:
      'g12-protein-biuret',

    title:
      'Protein và enzyme',

    subtitle:
      'Biuret · xúc tác sinh học',

    objective:
      'Hiểu cấu tạo protein và vai trò của enzyme.',

    chemicals: [
      'albumin',
      'cuso4',
      'naoh'
    ],

    steps: [

      I(
        'Protein',
        'Protein là các polypeptide có khối lượng phân tử lớn và cấu trúc không gian đặc trưng.'
      ),

      P(
        'g12-l10-p1',
        'Phản ứng biuret của protein tạo màu:',
        [
          'Tím',
          'Vàng',
          'Đen',
          'Không màu'
        ],
        0,
        'Liên kết peptide tạo phức màu tím với Cu²⁺ trong môi trường kiềm.'
      ),

      A(
        'albumin',
        'Thêm dung dịch albumin.'
      ),

      A(
        'cuso4',
        'Thêm CuSO₄.'
      ),

      A(
        'naoh',
        'Thêm NaOH.'
      ),

      R(
        'albumin-biuret',
        'Quan sát phản ứng biuret.',
        'Màu tím đặc trưng của protein đã xuất hiện.'
      ),

      I(
        'Enzyme',
        'Enzyme là chất xúc tác sinh học có tính chọn lọc cao.',
        [
          'Enzyme làm tăng tốc độ phản ứng.',
          'Enzyme không làm thay đổi cân bằng nhiệt động của phản ứng.'
        ]
      )

    ]

  }),


  G12({

    lesson:
      11,

    title:
      'Challenge — Hợp chất chứa nitrogen',

    objective:
      'Ôn tập amine, amino acid, peptide và protein.',

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g12-l11-q1',
        'Nhóm chức đặc trưng trong methylamine là:',
        [
          '–NH₂',
          '–COOH',
          '–CHO',
          '–COO–'
        ],
        0,
        'Methylamine chứa nhóm amino.'
      ),

      Q(
        'g12-l11-q2',
        'Liên kết peptide là:',
        [
          '–CO–NH–',
          '–O–O–',
          '–C=C–',
          '–Na–Cl–'
        ],
        0,
        'Liên kết peptide có nhóm –CO–NH–.'
      ),

      Q(
        'g12-l11-q3',
        'Phản ứng biuret dùng để nhận biết:',
        [
          'Protein',
          'Alkane',
          'NaCl',
          'CO₂'
        ],
        0,
        'Protein chứa nhiều liên kết peptide cho phản ứng biuret.'
      )

    ]

  }),


  /* =====================================================
     CHƯƠNG 4
     POLYMER
  ===================================================== */

  G12({

    lesson:
      12,

    title:
      'Đại cương về polymer',

    objective:
      'Hiểu monomer, mắt xích và các phương pháp hình thành polymer.',

    steps: [

      I(
        'Polymer',
        'Polymer là hợp chất có phân tử khối rất lớn gồm nhiều đơn vị cấu trúc lặp lại.',
        [
          'Monomer là phân tử nhỏ tham gia tạo polymer.',
          'Mắt xích là đơn vị cấu trúc lặp lại trong mạch polymer.'
        ]
      ),

      Q(
        'g12-l12-q1',
        'Ethene có thể tạo polymer nào?',
        [
          'Polyethylene',
          'Protein',
          'Starch',
          'Cellulose'
        ],
        0,
        'Ethene trùng hợp tạo polyethylene.'
      ),

      I(
        'Trùng hợp và trùng ngưng',
        'Trùng hợp thường cộng các monomer không tạo phân tử nhỏ; trùng ngưng thường tạo thêm phân tử nhỏ như H₂O.'
      ),

      Q(
        'g12-l12-q2',
        'Quá trình tạo polyethylene từ ethene là:',
        [
          'Trùng hợp',
          'Thủy phân',
          'Trung hòa',
          'Điện phân'
        ],
        0,
        'Ethene tham gia phản ứng trùng hợp.'
      )

    ]

  }),


  G12({

    lesson:
      13,

    title:
      'Vật liệu polymer',

    subtitle:
      'Chất dẻo · tơ · cao su',

    objective:
      'Phân biệt các nhóm vật liệu polymer và ứng dụng.',

    steps: [

      I(
        'Chất dẻo',
        'Chất dẻo là vật liệu polymer có khả năng biến dạng khi gia công và giữ được hình dạng sau đó.'
      ),

      Q(
        'g12-l13-q1',
        'PE là viết tắt của:',
        [
          'Polyethylene',
          'Protein enzyme',
          'Polyester acid',
          'Phenol'
        ],
        0,
        'PE là polyethylene.'
      ),

      I(
        'Tơ và cao su',
        'Tơ polymer có cấu trúc mạch phù hợp để kéo thành sợi; cao su có tính đàn hồi cao.'
      ),

      Q(
        'g12-l13-q2',
        'Đặc tính nổi bật của cao su là:',
        [
          'Đàn hồi',
          'Dẫn điện như đồng',
          'Tan hoàn toàn trong nước',
          'Là kim loại'
        ],
        0,
        'Cao su có khả năng biến dạng và phục hồi tốt.'
      ),

      O(
        'Môi trường',
        'Việc sử dụng polymer cần đi kèm phân loại, tái sử dụng và tái chế để giảm chất thải.'
      )

    ]

  }),


  G12({

    lesson:
      14,

    title:
      'Challenge — Polymer',

    objective:
      'Ôn tập polymer, monomer và vật liệu polymer.',

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g12-l14-q1',
        'Đơn vị lặp lại trong polymer gọi là:',
        [
          'Mắt xích',
          'Proton',
          'Ion',
          'Đồng vị'
        ],
        0,
        'Mắt xích là đơn vị lặp lại.'
      ),

      Q(
        'g12-l14-q2',
        'Monomer của polyethylene là:',
        [
          'Ethene',
          'Ethane',
          'Ethanol',
          'Ethanoic acid'
        ],
        0,
        'Ethene CH₂=CH₂ tạo polyethylene.'
      ),

      Q(
        'g12-l14-q3',
        'Polymer có phân tử khối:',
        [
          'Thường rất lớn',
          'Luôn bằng 1',
          'Luôn nhỏ hơn nước',
          'Không có carbon'
        ],
        0,
        'Polymer có mạch dài và phân tử khối lớn.'
      )

    ]

  }),


  /* =====================================================
     CHƯƠNG 5
     PIN ĐIỆN VÀ ĐIỆN PHÂN
  ===================================================== */

  G12({

    lesson:
      15,

    title:
      'Thế điện cực và nguồn điện hóa học',

    subtitle:
      'Anode · cathode · electron',

    objective:
      'Hiểu nguyên lí của pin điện hóa và thế điện cực.',

    duration:
      8,

    steps: [

      I(
        'Pin điện hóa',
        'Pin điện hóa chuyển hóa năng lượng của phản ứng oxi hóa–khử tự diễn biến thành điện năng.',
        [
          'Oxi hóa xảy ra tại anode.',
          'Khử xảy ra tại cathode.',
          'Electron đi qua mạch ngoài từ anode sang cathode.'
        ]
      ),

      Q(
        'g12-l15-q1',
        'Trong pin điện hóa, quá trình oxi hóa xảy ra tại:',
        [
          'Anode',
          'Cathode',
          'Cầu muối',
          'Dung môi'
        ],
        0,
        'Anode là nơi xảy ra oxi hóa.'
      ),

      Q(
        'g12-l15-q2',
        'Electron trong mạch ngoài chuyển động:',
        [
          'Từ anode đến cathode',
          'Từ cathode đến anode trong pin tự phát',
          'Từ cầu muối ra ngoài',
          'Không chuyển động'
        ],
        0,
        'Electron được tạo ở anode và tiêu thụ ở cathode.'
      ),

      I(
        'Suất điện động',
        'Hiệu điện thế của pin liên quan đến sự chênh lệch thế điện cực giữa hai điện cực.',
        [],
        'Ecell = Ecathode − Eanode'
      )

    ]

  }),


  G12({

    lesson:
      16,

    title:
      'Điện phân',

    subtitle:
      'Dòng điện cưỡng bức phản ứng',

    objective:
      'Hiểu nguyên lí và sản phẩm cơ bản của quá trình điện phân.',

    steps: [

      I(
        'Điện phân',
        'Điện phân sử dụng nguồn điện ngoài để thúc đẩy một phản ứng oxi hóa–khử không tự diễn biến theo chiều mong muốn.'
      ),

      Q(
        'g12-l16-q1',
        'Trong điện phân, quá trình khử vẫn xảy ra ở:',
        [
          'Cathode',
          'Anode',
          'Cầu muối',
          'Nguồn điện'
        ],
        0,
        'Khử luôn xảy ra tại cathode.'
      ),

      I(
        'Ứng dụng',
        'Điện phân được sử dụng để điều chế kim loại, tinh luyện kim loại và mạ điện.',
        [
          'Sản xuất aluminium.',
          'Tinh luyện copper.',
          'Mạ bảo vệ hoặc trang trí bề mặt.'
        ]
      ),

      Q(
        'g12-l16-q2',
        'Ứng dụng nào liên quan trực tiếp đến điện phân?',
        [
          'Mạ kim loại',
          'Lọc bằng giấy',
          'Chưng cất nước',
          'Đo khối lượng'
        ],
        0,
        'Mạ điện sử dụng quá trình điện phân.'
      )

    ]

  }),


  G12({

    lesson:
      17,

    title:
      'Challenge — Pin điện và điện phân',

    objective:
      'Ôn tập điện cực, pin điện hóa và điện phân.',

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g12-l17-q1',
        'Oxi hóa xảy ra tại:',
        [
          'Anode',
          'Cathode',
          'Cả hai đồng thời trên cùng vị trí',
          'Dung môi'
        ],
        0,
        'Anode là nơi oxi hóa.'
      ),

      Q(
        'g12-l17-q2',
        'Khử xảy ra tại:',
        [
          'Cathode',
          'Anode',
          'Cầu muối',
          'Không xảy ra'
        ],
        0,
        'Cathode là nơi khử.'
      ),

      Q(
        'g12-l17-q3',
        'Pin điện hóa biến đổi chủ yếu:',
        [
          'Hóa năng thành điện năng',
          'Điện năng thành hóa năng cưỡng bức',
          'Cơ năng thành nhiệt',
          'Ánh sáng thành khối lượng'
        ],
        0,
        'Pin tự phát chuyển hóa hóa năng thành điện năng.'
      ),

      Q(
        'g12-l17-q4',
        'Điện phân cần:',
        [
          'Nguồn điện ngoài',
          'Không cần năng lượng',
          'Chỉ ánh sáng mặt trời',
          'Chỉ nam châm'
        ],
        0,
        'Điện phân được thúc đẩy bằng dòng điện ngoài.'
      )

    ]

  }),


  /* =====================================================
     CHƯƠNG 6
     ĐẠI CƯƠNG KIM LOẠI
  ===================================================== */

  G12({

    lesson:
      18,

    title:
      'Cấu tạo và liên kết trong tinh thể kim loại',

    objective:
      'Hiểu mô hình liên kết kim loại và mạng tinh thể.',

    steps: [

      I(
        'Liên kết kim loại',
        'Trong tinh thể kim loại, ion dương kim loại nằm tại các nút mạng và được liên kết bởi các electron hóa trị chuyển động tương đối tự do.'
      ),

      Q(
        'g12-l18-q1',
        'Electron trong kim loại có đặc điểm:',
        [
          'Có khả năng chuyển động tương đối tự do',
          'Bị cố định hoàn toàn trên một nguyên tử',
          'Không tồn tại',
          'Mang điện dương'
        ],
        0,
        'Electron delocalized góp phần tạo liên kết kim loại.'
      ),

      I(
        'Hệ quả',
        'Mô hình electron tự do giải thích nhiều tính chất của kim loại.',
        [
          'Dẫn điện.',
          'Dẫn nhiệt.',
          'Tính dẻo.',
          'Ánh kim.'
        ]
      ),

      Q(
        'g12-l18-q2',
        'Tính dẫn điện của kim loại liên quan nhiều đến:',
        [
          'Electron chuyển động',
          'Neutron',
          'Phân tử nước',
          'Anion cố định'
        ],
        0,
        'Electron dẫn có thể di chuyển dưới tác dụng điện trường.'
      )

    ]

  }),


  G12({

    lesson:
      19,

    title:
      'Tính chất vật lí và hóa học của kim loại',

    objective:
      'Liên hệ cấu tạo với tính chất và phản ứng của kim loại.',

    steps: [

      I(
        'Tính chất vật lí',
        'Nhiều kim loại có ánh kim, dẫn điện, dẫn nhiệt và có tính dẻo.'
      ),

      Q(
        'g12-l19-q1',
        'Tính chất nào là đặc trưng phổ biến của kim loại?',
        [
          'Dẫn điện',
          'Không có electron',
          'Luôn tan trong nước',
          'Luôn là khí'
        ],
        0,
        'Kim loại thường dẫn điện tốt.'
      ),

      I(
        'Tính chất hóa học',
        'Kim loại có xu hướng nhường electron và thể hiện tính khử.',
        [],
        'M → Mⁿ⁺ + ne⁻'
      ),

      Q(
        'g12-l19-q2',
        'Khi kim loại tạo cation, kim loại đã:',
        [
          'Nhường electron',
          'Nhận electron',
          'Nhận neutron',
          'Không đổi'
        ],
        0,
        'Kim loại bị oxi hóa bằng cách nhường electron.'
      )

    ]

  }),


  G12({

    lesson:
      20,

    title:
      'Kim loại trong tự nhiên và phương pháp tách',

    objective:
      'Hiểu nguyên tắc lựa chọn phương pháp điều chế kim loại.',

    steps: [

      I(
        'Kim loại trong tự nhiên',
        'Nhiều kim loại tồn tại chủ yếu dưới dạng hợp chất trong quặng và cần được tách bằng các quá trình hóa học hoặc điện hóa.'
      ),

      Q(
        'g12-l20-q1',
        'Để thu kim loại từ ion kim loại cần thực hiện quá trình:',
        [
          'Khử',
          'Oxi hóa',
          'Trung hòa',
          'Hydrolysis'
        ],
        0,
        'Ion kim loại nhận electron tạo nguyên tử kim loại.'
      ),

      I(
        'Phương pháp',
        'Tùy mức độ hoạt động của kim loại có thể dùng nhiệt luyện, thủy luyện hoặc điện phân.'
      ),

      Q(
        'g12-l20-q2',
        'Kim loại rất hoạt động như aluminium thường được điều chế bằng:',
        [
          'Điện phân hợp chất nóng chảy',
          'Lọc',
          'Dùng nước',
          'Chưng cất đơn giản'
        ],
        0,
        'Kim loại hoạt động mạnh cần phương pháp điện phân.'
      )

    ]

  }),


  G12({

    lesson:
      21,

    title:
      'Hợp kim',

    objective:
      'Hiểu khái niệm hợp kim và nguyên nhân hợp kim có tính chất khác kim loại tinh khiết.',

    steps: [

      I(
        'Hợp kim',
        'Hợp kim là vật liệu kim loại chứa một kim loại cơ bản và một hoặc nhiều nguyên tố khác.'
      ),

      Q(
        'g12-l21-q1',
        'Thép là hợp kim chủ yếu của:',
        [
          'Fe và C',
          'Cu và Zn',
          'Na và Cl',
          'Al và O'
        ],
        0,
        'Thép là hợp kim nền iron có carbon.'
      ),

      I(
        'Tính chất',
        'Thành phần và cấu trúc vi mô làm hợp kim có thể cứng hơn, bền hơn hoặc chống ăn mòn tốt hơn kim loại nguyên chất.'
      ),

      Q(
        'g12-l21-q2',
        'Brass (đồng thau) chủ yếu chứa:',
        [
          'Cu và Zn',
          'Fe và C',
          'Na và K',
          'Ca và Mg'
        ],
        0,
        'Đồng thau là hợp kim Cu–Zn.'
      )

    ]

  }),


  G12({

    lesson:
      22,

    title:
      'Sự ăn mòn kim loại',

    objective:
      'Phân biệt ăn mòn hóa học và ăn mòn điện hóa.',

    steps: [

      I(
        'Ăn mòn',
        'Ăn mòn là quá trình kim loại bị oxi hóa bởi các chất trong môi trường.'
      ),

      Q(
        'g12-l22-q1',
        'Trong quá trình ăn mòn, nguyên tử kim loại thường:',
        [
          'Nhường electron',
          'Nhận electron',
          'Nhận neutron',
          'Không thay đổi'
        ],
        0,
        'Kim loại bị oxi hóa.'
      ),

      I(
        'Ăn mòn điện hóa',
        'Ăn mòn điện hóa xuất hiện khi hình thành các vùng điện cực khác nhau và có môi trường điện li.'
      ),

      Q(
        'g12-l22-q2',
        'Biện pháp bảo vệ kim loại là:',
        [
          'Sơn phủ bề mặt',
          'Tăng độ ẩm liên tục',
          'Ngâm trong acid',
          'Tạo nhiều cặp điện hóa'
        ],
        0,
        'Lớp sơn ngăn kim loại tiếp xúc với môi trường.'
      )

    ]

  }),


  G12({

    lesson:
      23,

    title:
      'Challenge — Đại cương kim loại',

    objective:
      'Ôn tập liên kết kim loại, điều chế và ăn mòn.',

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g12-l23-q1',
        'Kim loại thường thể hiện tính:',
        [
          'Khử',
          'Oxi hóa duy nhất',
          'Acid mạnh',
          'Không phản ứng'
        ],
        0,
        'Kim loại có xu hướng nhường electron.'
      ),

      Q(
        'g12-l23-q2',
        'Ăn mòn kim loại là quá trình:',
        [
          'Oxi hóa kim loại',
          'Khử kim loại',
          'Tạo neutron',
          'Trùng hợp'
        ],
        0,
        'Kim loại mất electron trong quá trình ăn mòn.'
      ),

      Q(
        'g12-l23-q3',
        'Kim loại hoạt động mạnh thường cần:',
        [
          'Điện phân',
          'Chỉ lọc',
          'Chưng cất nước',
          'Sắc kí'
        ],
        0,
        'Điện phân dùng để điều chế nhiều kim loại hoạt động mạnh.'
      )

    ]

  }),


  /* =====================================================
     CHƯƠNG 7
     NHÓM IA VÀ IIA
  ===================================================== */

  G12({

    lesson:
      24,

    title:
      'Nguyên tố nhóm IA',

    subtitle:
      'Kim loại kiềm',

    objective:
      'Hiểu cấu hình electron và xu hướng tính chất của kim loại nhóm IA.',

    steps: [

      I(
        'Kim loại kiềm',
        'Các nguyên tố nhóm IA có một electron hóa trị và dễ nhường electron.',
        [],
        'ns¹'
      ),

      Q(
        'g12-l24-q1',
        'Kim loại nhóm IA thường tạo ion có điện tích:',
        [
          '+1',
          '+2',
          '+3',
          '−1'
        ],
        0,
        'Kim loại kiềm nhường một electron tạo M⁺.'
      ),

      I(
        'Tính hoạt động',
        'Tính khử của kim loại kiềm nhìn chung tăng từ trên xuống dưới nhóm.'
      ),

      Q(
        'g12-l24-q2',
        'Na thuộc nhóm:',
        [
          'IA',
          'IIA',
          'VIIA',
          'VIIIA'
        ],
        0,
        'Sodium là kim loại kiềm nhóm IA.'
      )

    ]

  }),


  G12({

    lesson:
      25,

    title:
      'Nguyên tố nhóm IIA',

    subtitle:
      'Kim loại kiềm thổ',

    objective:
      'Hiểu cấu hình electron và một số hợp chất quan trọng của nhóm IIA.',

    steps: [

      I(
        'Nhóm IIA',
        'Kim loại nhóm IIA có hai electron hóa trị.',
        [],
        'ns²'
      ),

      Q(
        'g12-l25-q1',
        'Kim loại nhóm IIA thường tạo cation:',
        [
          'M²⁺',
          'M⁺',
          'M³⁺',
          'M⁻'
        ],
        0,
        'Chúng thường nhường hai electron.'
      ),

      I(
        'Calcium và magnesium',
        'Ca và Mg có nhiều ứng dụng và hợp chất quan trọng trong tự nhiên.',
        [
          'CaCO₃ có trong đá vôi.',
          'Ca²⁺ và Mg²⁺ liên quan đến độ cứng của nước.'
        ]
      ),

      Q(
        'g12-l25-q2',
        'Thành phần chính của đá vôi là:',
        [
          'CaCO₃',
          'NaCl',
          'KNO₃',
          'NH₄Cl'
        ],
        0,
        'Đá vôi chủ yếu chứa calcium carbonate.'
      )

    ]

  }),


  G12({

    lesson:
      26,

    title:
      'Challenge — Nhóm IA và IIA',

    objective:
      'Ôn tập tính chất kim loại kiềm và kiềm thổ.',

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g12-l26-q1',
        'Cấu hình hóa trị của nhóm IA là:',
        [
          'ns¹',
          'ns²',
          'ns²np⁵',
          'ns²np⁶'
        ],
        0,
        'Nhóm IA có một electron hóa trị.'
      ),

      Q(
        'g12-l26-q2',
        'Cấu hình hóa trị nhóm IIA là:',
        [
          'ns²',
          'ns¹',
          'np¹',
          'np⁶'
        ],
        0,
        'Nhóm IIA có hai electron hóa trị.'
      ),

      Q(
        'g12-l26-q3',
        'CaCO₃ là:',
        [
          'Calcium carbonate',
          'Calcium chloride',
          'Sodium carbonate',
          'Magnesium sulfate'
        ],
        0,
        'CaCO₃ là calcium carbonate.'
      )

    ]

  }),


  /* =====================================================
     CHƯƠNG 8
     TRANSITION METALS & COMPLEXES
  ===================================================== */

  G12({

    lesson:
      27,

    title:
      'Kim loại chuyển tiếp dãy thứ nhất',

    objective:
      'Hiểu vị trí và một số đặc điểm của kim loại chuyển tiếp.',

    steps: [

      I(
        'Kim loại chuyển tiếp',
        'Các nguyên tố chuyển tiếp dãy thứ nhất liên quan đến quá trình điền electron vào phân lớp 3d.',
        [
          'Nhiều nguyên tố có nhiều số oxi hóa.',
          'Nhiều ion có màu.',
          'Một số kim loại và hợp chất có hoạt tính xúc tác.'
        ]
      ),

      Q(
        'g12-l27-q1',
        'Phân lớp quan trọng trong dãy chuyển tiếp thứ nhất là:',
        [
          '3d',
          '1s',
          '2p duy nhất',
          '5f'
        ],
        0,
        'Dãy chuyển tiếp thứ nhất liên quan đến phân lớp 3d.'
      ),

      Q(
        'g12-l27-q2',
        'Đặc điểm thường gặp của ion kim loại chuyển tiếp là:',
        [
          'Có thể có màu',
          'Luôn không màu',
          'Không có electron',
          'Luôn chỉ có số oxi hóa +1'
        ],
        0,
        'Chuyển mức electron d có thể tạo màu đặc trưng.'
      )

    ]

  }),


  G12({

    lesson:
      28,

    title:
      'Sơ lược về phức chất',

    subtitle:
      'Ion trung tâm · ligand',

    objective:
      'Hiểu thành phần và sự hình thành phức chất.',

    chemicals: [
      'cuso4',
      'nh3'
    ],

    steps: [

      I(
        'Phức chất',
        'Phức chất thường gồm nguyên tử hoặc ion trung tâm liên kết với các ligand.',
        [
          'Ion kim loại thường đóng vai trò trung tâm.',
          'Ligand cung cấp cặp electron để tạo liên kết phối trí.'
        ]
      ),

      Q(
        'g12-l28-q1',
        'Trong phức chất, ligand thường:',
        [
          'Cho cặp electron',
          'Cho proton vào hạt nhân',
          'Phá electron',
          'Không tương tác'
        ],
        0,
        'Ligand cung cấp cặp electron cho ion trung tâm.'
      ),

      P(
        'g12-l28-p1',
        'Khi dung dịch Cu²⁺ gặp NH₃ dư, màu dung dịch thường trở nên:',
        [
          'Xanh lam đậm',
          'Trắng',
          'Không màu',
          'Đen'
        ],
        0,
        'Phức ammine của Cu(II) có màu xanh lam đậm.'
      ),

      A(
        'cuso4',
        'Thêm dung dịch CuSO₄.'
      ),

      A(
        'nh3',
        'Thêm dung dịch NH₃.'
      ),

      R(
        'cuso4-nh3',
        'Quan sát sự thay đổi màu khi tạo phức.',
        'Phức Cu(II)–ammonia màu xanh lam đậm đã được mô phỏng.'
      )

    ]

  }),


  G12({

    lesson:
      29,

    title:
      'Tính chất và ứng dụng của phức chất',

    objective:
      'Hiểu vai trò của phức chất trong hóa học và đời sống.',

    chemicals: [
      'fecl3',
      'kscn'
    ],

    steps: [

      I(
        'Màu của phức chất',
        'Sự tạo phức có thể làm thay đổi mạnh màu sắc của dung dịch và được dùng trong nhận biết ion.'
      ),

      P(
        'g12-l29-p1',
        'Fe³⁺ kết hợp với SCN⁻ tạo hệ có màu:',
        [
          'Đỏ',
          'Xanh lá',
          'Trắng',
          'Không màu'
        ],
        0,
        'Phức Fe–SCN có màu đỏ đặc trưng.'
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
        'Quan sát sự hình thành phức màu.',
        'Màu đỏ đặc trưng của hệ phức đã xuất hiện.'
      ),

      O(
        'Ứng dụng',
        'Phức chất được ứng dụng trong phân tích hóa học, xúc tác, sinh học và nhiều quá trình công nghiệp.'
      )

    ]

  }),


  G12({

    lesson:
      30,

    title:
      'Challenge — Kim loại chuyển tiếp và phức chất',

    objective:
      'Ôn tập kim loại chuyển tiếp, ligand và phức chất.',

    difficulty:
      'Thử thách',

    steps: [

      Q(
        'g12-l30-q1',
        'Dãy chuyển tiếp thứ nhất liên quan chủ yếu đến phân lớp:',
        [
          '3d',
          '4f',
          '1s',
          '6p'
        ],
        0,
        'Các nguyên tố này liên quan đến sự điền electron vào phân lớp 3d.'
      ),

      Q(
        'g12-l30-q2',
        'Thành phần liên kết với ion trung tâm trong phức gọi là:',
        [
          'Ligand',
          'Đồng vị',
          'Neutron',
          'Anode'
        ],
        0,
        'Ligand phối trí với trung tâm kim loại.'
      ),

      Q(
        'g12-l30-q3',
        'NH₃ có thể đóng vai trò:',
        [
          'Ligand',
          'Kim loại chuyển tiếp',
          'Anode bắt buộc',
          'Polymer'
        ],
        0,
        'NH₃ có cặp electron tự do nên có thể làm ligand.'
      ),

      Q(
        'g12-l30-q4',
        'Một đặc điểm thường thấy của nhiều phức kim loại chuyển tiếp là:',
        [
          'Có màu đặc trưng',
          'Luôn không màu',
          'Không có electron',
          'Chỉ tồn tại ở thể khí'
        ],
        0,
        'Nhiều phức kim loại chuyển tiếp có màu rõ rệt.'
      )

    ]

  })

]