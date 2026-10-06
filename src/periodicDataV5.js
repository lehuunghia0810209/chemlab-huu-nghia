/* =========================================================
   CHEMLAB 5.0
   PERIODIC DATA ENGINE
========================================================= */


/* =========================================================
   CURATED COMMON MONATOMIC IONS
========================================================= */

const COMMON_IONS = {

  1: [
    ['H⁺', '+1', 'Cation']
  ],

  3: [
    ['Li⁺', '+1', 'Cation']
  ],

  4: [
    ['Be²⁺', '+2', 'Cation']
  ],

  7: [
    ['N³⁻', '−3', 'Anion']
  ],

  8: [
    ['O²⁻', '−2', 'Anion']
  ],

  9: [
    ['F⁻', '−1', 'Anion']
  ],

  11: [
    ['Na⁺', '+1', 'Cation']
  ],

  12: [
    ['Mg²⁺', '+2', 'Cation']
  ],

  13: [
    ['Al³⁺', '+3', 'Cation']
  ],

  15: [
    ['P³⁻', '−3', 'Anion']
  ],

  16: [
    ['S²⁻', '−2', 'Anion']
  ],

  17: [
    ['Cl⁻', '−1', 'Anion']
  ],

  19: [
    ['K⁺', '+1', 'Cation']
  ],

  20: [
    ['Ca²⁺', '+2', 'Cation']
  ],

  21: [
    ['Sc³⁺', '+3', 'Cation']
  ],

  22: [
    ['Ti³⁺', '+3', 'Cation'],
    ['Ti⁴⁺', '+4', 'Cation']
  ],

  23: [
    ['V²⁺', '+2', 'Cation'],
    ['V³⁺', '+3', 'Cation']
  ],

  24: [
    ['Cr²⁺', '+2', 'Cation'],
    ['Cr³⁺', '+3', 'Cation']
  ],

  25: [
    ['Mn²⁺', '+2', 'Cation']
  ],

  26: [
    ['Fe²⁺', '+2', 'Cation'],
    ['Fe³⁺', '+3', 'Cation']
  ],

  27: [
    ['Co²⁺', '+2', 'Cation'],
    ['Co³⁺', '+3', 'Cation']
  ],

  28: [
    ['Ni²⁺', '+2', 'Cation']
  ],

  29: [
    ['Cu⁺', '+1', 'Cation'],
    ['Cu²⁺', '+2', 'Cation']
  ],

  30: [
    ['Zn²⁺', '+2', 'Cation']
  ],

  31: [
    ['Ga³⁺', '+3', 'Cation']
  ],

  33: [
    ['As³⁻', '−3', 'Anion']
  ],

  34: [
    ['Se²⁻', '−2', 'Anion']
  ],

  35: [
    ['Br⁻', '−1', 'Anion']
  ],

  37: [
    ['Rb⁺', '+1', 'Cation']
  ],

  38: [
    ['Sr²⁺', '+2', 'Cation']
  ],

  39: [
    ['Y³⁺', '+3', 'Cation']
  ],

  40: [
    ['Zr⁴⁺', '+4', 'Cation']
  ],

  41: [
    ['Nb⁵⁺', '+5', 'Cation']
  ],

  42: [
    ['Mo⁴⁺', '+4', 'Cation'],
    ['Mo⁶⁺', '+6', 'Cation']
  ],

  43: [
    ['Tc⁴⁺', '+4', 'Cation']
  ],

  44: [
    ['Ru³⁺', '+3', 'Cation'],
    ['Ru⁴⁺', '+4', 'Cation']
  ],

  45: [
    ['Rh³⁺', '+3', 'Cation']
  ],

  46: [
    ['Pd²⁺', '+2', 'Cation']
  ],

  47: [
    ['Ag⁺', '+1', 'Cation']
  ],

  48: [
    ['Cd²⁺', '+2', 'Cation']
  ],

  49: [
    ['In³⁺', '+3', 'Cation']
  ],

  50: [
    ['Sn²⁺', '+2', 'Cation'],
    ['Sn⁴⁺', '+4', 'Cation']
  ],

  51: [
    ['Sb³⁺', '+3', 'Cation'],
    ['Sb⁵⁺', '+5', 'Cation']
  ],

  /*
    Tellurium:
    telluride Te²⁻ là ion đơn nguyên tử
    phổ biến cần bổ sung.
  */

  52: [
    ['Te²⁻', '−2', 'Anion']
  ],

  53: [
    ['I⁻', '−1', 'Anion']
  ],

  55: [
    ['Cs⁺', '+1', 'Cation']
  ],

  56: [
    ['Ba²⁺', '+2', 'Cation']
  ],

  57: [
    ['La³⁺', '+3', 'Cation']
  ],

  58: [
    ['Ce³⁺', '+3', 'Cation'],
    ['Ce⁴⁺', '+4', 'Cation']
  ],

  59: [
    ['Pr³⁺', '+3', 'Cation']
  ],

  60: [
    ['Nd³⁺', '+3', 'Cation']
  ],

  61: [
    ['Pm³⁺', '+3', 'Cation']
  ],

  62: [
    ['Sm³⁺', '+3', 'Cation']
  ],

  63: [
    ['Eu²⁺', '+2', 'Cation'],
    ['Eu³⁺', '+3', 'Cation']
  ],

  64: [
    ['Gd³⁺', '+3', 'Cation']
  ],

  65: [
    ['Tb³⁺', '+3', 'Cation']
  ],

  66: [
    ['Dy³⁺', '+3', 'Cation']
  ],

  67: [
    ['Ho³⁺', '+3', 'Cation']
  ],

  68: [
    ['Er³⁺', '+3', 'Cation']
  ],

  69: [
    ['Tm³⁺', '+3', 'Cation']
  ],

  70: [
    ['Yb²⁺', '+2', 'Cation'],
    ['Yb³⁺', '+3', 'Cation']
  ],

  71: [
    ['Lu³⁺', '+3', 'Cation']
  ],

  72: [
    ['Hf⁴⁺', '+4', 'Cation']
  ],

  73: [
    ['Ta⁵⁺', '+5', 'Cation']
  ],

  74: [
    ['W⁴⁺', '+4', 'Cation'],
    ['W⁶⁺', '+6', 'Cation']
  ],

  75: [
    ['Re⁴⁺', '+4', 'Cation']
  ],

  76: [
    ['Os⁴⁺', '+4', 'Cation']
  ],

  77: [
    ['Ir³⁺', '+3', 'Cation'],
    ['Ir⁴⁺', '+4', 'Cation']
  ],

  78: [
    ['Pt²⁺', '+2', 'Cation'],
    ['Pt⁴⁺', '+4', 'Cation']
  ],

  79: [
    ['Au⁺', '+1', 'Cation'],
    ['Au³⁺', '+3', 'Cation']
  ],

  80: [
    ['Hg²⁺', '+2', 'Cation']
  ],

  81: [
    ['Tl⁺', '+1', 'Cation'],
    ['Tl³⁺', '+3', 'Cation']
  ],

  82: [
    ['Pb²⁺', '+2', 'Cation'],
    ['Pb⁴⁺', '+4', 'Cation']
  ],

  83: [
    ['Bi³⁺', '+3', 'Cation']
  ],

  87: [
    ['Fr⁺', '+1', 'Cation']
  ],

  88: [
    ['Ra²⁺', '+2', 'Cation']
  ],

  89: [
    ['Ac³⁺', '+3', 'Cation']
  ],

  90: [
    ['Th⁴⁺', '+4', 'Cation']
  ],

  91: [
    ['Pa⁵⁺', '+5', 'Cation']
  ],

  92: [
    ['U⁴⁺', '+4', 'Cation']
  ],

  93: [
    ['Np³⁺', '+3', 'Cation'],
    ['Np⁴⁺', '+4', 'Cation']
  ],

  94: [
    ['Pu³⁺', '+3', 'Cation'],
    ['Pu⁴⁺', '+4', 'Cation']
  ],

  95: [
    ['Am³⁺', '+3', 'Cation']
  ],

  96: [
    ['Cm³⁺', '+3', 'Cation']
  ],

  97: [
    ['Bk³⁺', '+3', 'Cation']
  ],

  98: [
    ['Cf³⁺', '+3', 'Cation']
  ],

  99: [
    ['Es³⁺', '+3', 'Cation']
  ],

  100: [
    ['Fm³⁺', '+3', 'Cation']
  ],

  101: [
    ['Md³⁺', '+3', 'Cation']
  ],

  102: [
    ['No²⁺', '+2', 'Cation'],
    ['No³⁺', '+3', 'Cation']
  ],

  103: [
    ['Lr³⁺', '+3', 'Cation']
  ]

}


/* =========================================================
   VERIFIED / CURATED ISOTOPE EXAMPLES
========================================================= */

const ISOTOPES = {

  1: [
    iso(1, '¹H', '≈ 99,9885%', 'natural'),
    iso(2, '²H', '≈ 0,0115%', 'natural'),
    iso(3, '³H', 'Phóng xạ', 'radioactive')
  ],

  2: [
    iso(3, '³He', '≈ 0,000134%', 'natural'),
    iso(4, '⁴He', '≈ 99,999866%', 'natural')
  ],

  3: [
    iso(6, '⁶Li', '≈ 7,59%', 'natural'),
    iso(7, '⁷Li', '≈ 92,41%', 'natural')
  ],

  4: [
    iso(9, '⁹Be', '≈ 100%', 'natural')
  ],

  5: [
    iso(10, '¹⁰B', '≈ 19,9%', 'natural'),
    iso(11, '¹¹B', '≈ 80,1%', 'natural')
  ],

  6: [
    iso(12, '¹²C', '≈ 98,93%', 'natural'),
    iso(13, '¹³C', '≈ 1,07%', 'natural'),
    iso(14, '¹⁴C', 'Phóng xạ', 'radioactive')
  ],

  7: [
    iso(14, '¹⁴N', '≈ 99,636%', 'natural'),
    iso(15, '¹⁵N', '≈ 0,364%', 'natural')
  ],

  8: [
    iso(16, '¹⁶O', '≈ 99,757%', 'natural'),
    iso(17, '¹⁷O', '≈ 0,038%', 'natural'),
    iso(18, '¹⁸O', '≈ 0,205%', 'natural')
  ],

  17: [
    iso(35, '³⁵Cl', '≈ 75,8%', 'natural'),
    iso(37, '³⁷Cl', '≈ 24,2%', 'natural')
  ],

  26: [
    iso(54, '⁵⁴Fe', '≈ 5,85%', 'natural'),
    iso(56, '⁵⁶Fe', '≈ 91,75%', 'natural'),
    iso(57, '⁵⁷Fe', '≈ 2,12%', 'natural'),
    iso(58, '⁵⁸Fe', '≈ 0,28%', 'natural')
  ],

  29: [
    iso(63, '⁶³Cu', '≈ 69,15%', 'natural'),
    iso(65, '⁶⁵Cu', '≈ 30,85%', 'natural')
  ],

  35: [
    iso(79, '⁷⁹Br', '≈ 50,69%', 'natural'),
    iso(81, '⁸¹Br', '≈ 49,31%', 'natural')
  ],

  /*
    Tellurium - dữ liệu natural abundance.
  */

  52: [
    iso(120, '¹²⁰Te', '≈ 0,09%', 'natural'),
    iso(122, '¹²²Te', '≈ 2,55%', 'natural'),
    iso(123, '¹²³Te', '≈ 0,89%', 'natural'),
    iso(124, '¹²⁴Te', '≈ 4,74%', 'natural'),
    iso(125, '¹²⁵Te', '≈ 7,07%', 'natural'),
    iso(126, '¹²⁶Te', '≈ 18,84%', 'natural'),
    iso(128, '¹²⁸Te', '≈ 31,74%', 'natural'),
    iso(130, '¹³⁰Te', '≈ 34,08%', 'natural')
  ],

  53: [
    iso(127, '¹²⁷I', '≈ 100%', 'natural')
  ],

  79: [
    iso(197, '¹⁹⁷Au', '≈ 100%', 'natural')
  ],

  82: [
    iso(204, '²⁰⁴Pb', '≈ 1,4%', 'natural'),
    iso(206, '²⁰⁶Pb', '≈ 24,1%', 'natural'),
    iso(207, '²⁰⁷Pb', '≈ 22,1%', 'natural'),
    iso(208, '²⁰⁸Pb', '≈ 52,4%', 'natural')
  ],

  90: [
    iso(232, '²³²Th', 'Phóng xạ', 'radioactive')
  ],

  92: [
    iso(235, '²³⁵U', '≈ 0,72%', 'natural'),
    iso(238, '²³⁸U', '≈ 99,27%', 'natural')
  ],

  100: [
    iso(257, '²⁵⁷Fm', 'Phóng xạ', 'radioactive')
  ]

}


/* =========================================================
   PUBLIC API
========================================================= */

export function getCommonIons(
  element
) {

  const explicit =
    COMMON_IONS[
      element.number
    ]


  if (
    explicit?.length
  ) {

    return explicit.map(
      item => ({

        formula:
          item[0],

        charge:
          item[1],

        type:
          item[2],

        source:
          'common'

      })
    )

  }


  /*
    Generic high-school fallback.
    Only applied when chemically sensible.
  */

  if (
    element.categoryKey ===
      'lanthanide'
  ) {

    return [
      createIon(
        element.symbol,
        3
      )
    ]

  }


  if (
    element.categoryKey ===
      'actinide' &&
    element.number <=
      103
  ) {

    return [
      createIon(
        element.symbol,
        3
      )
    ]

  }


  if (
    element.group ===
      1 &&
    element.number !==
      1
  ) {

    return [
      createIon(
        element.symbol,
        1
      )
    ]

  }


  if (
    element.group ===
      2
  ) {

    return [
      createIon(
        element.symbol,
        2
      )
    ]

  }


  if (
    element.group ===
      17
  ) {

    return [
      createIon(
        element.symbol,
        -1
      )
    ]

  }


  if (
    element.group ===
      16 &&
    element.number <=
      52
  ) {

    return [
      createIon(
        element.symbol,
        -2
      )
    ]

  }


  return []

}


/* =========================================================
   ISOTOPE DATA
========================================================= */

export function getIsotopes(
  element
) {

  const explicit =
    ISOTOPES[
      element.number
    ]


  if (
    explicit?.length
  ) {

    return explicit

  }


  /*
    Không để UI trống.

    Nếu chưa có bảng abundance curated,
    ChemLab chỉ hiển thị một isotope reference
    dựa vào giá trị mass-number của dữ liệu gốc.

    Không tuyên bố abundance.
  */

  const massNumber =
    getReferenceMassNumber(
      element
    )


  if (!massNumber) {

    return []

  }


  const radioactive =
    element.number ===
      43 ||
    element.number ===
      61 ||
    element.number >=
      84


  return [
    {

      mass:
        massNumber,

      name:
        `${toSuperscript(
          massNumber
        )}${element.symbol}`,

      abundance:
        radioactive
          ? 'Phóng xạ'
          : 'Đồng vị tham khảo',

      status:
        radioactive
          ? 'radioactive'
          : 'reference',

      generated:
        true

    }
  ]

}


/* =========================================================
   HELPERS
========================================================= */

function iso(
  mass,
  name,
  abundance,
  status
) {

  return {

    mass,
    name,
    abundance,
    status,
    generated: false

  }

}


function createIon(
  symbol,
  charge
) {

  const absolute =
    Math.abs(
      charge
    )


  const magnitude =
    absolute ===
      1
      ? ''
      : toSuperscript(
          absolute
        )


  const sign =
    charge > 0
      ? '⁺'
      : '⁻'


  return {

    formula:
      `${symbol}${magnitude}${sign}`,

    charge:
      charge > 0
        ? `+${charge}`
        : `−${absolute}`,

    type:
      charge > 0
        ? 'Cation'
        : 'Anion',

    source:
      'derived'

  }

}


function getReferenceMassNumber(
  element
) {

  const text =
    String(
      element.mass ??
      ''
    )
      .replace(
        ',',
        '.'
      )


  const match =
    text.match(
      /\d+(?:\.\d+)?/
    )


  if (!match) {

    return null

  }


  const value =
    Number(
      match[0]
    )


  if (
    !Number.isFinite(
      value
    )
  ) {

    return null

  }


  return Math.round(
    value
  )

}


function toSuperscript(
  value
) {

  const map = {

    0: '⁰',
    1: '¹',
    2: '²',
    3: '³',
    4: '⁴',
    5: '⁵',
    6: '⁶',
    7: '⁷',
    8: '⁸',
    9: '⁹'

  }


  return String(
    value
  )
    .split('')
    .map(
      character =>
        map[
          character
        ] ||
        character
    )
    .join('')

}