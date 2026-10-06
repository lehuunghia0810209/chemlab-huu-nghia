/* =========================================================
   CHEMLAB VIRTUAL LAB 3
   EXPANDED CHEMICAL DATABASE
========================================================= */

export const CHEMICALS = {

  /* =======================================================
     WATER
  ======================================================= */

  water: {
    id: 'water',

    name: 'Water',
    formula: 'H₂O',

    category: 'inorganic',
    family: 'water',

    state: 'liquid',

    color: '#dff7ff',
    solutionColor: '#dff7ff',

    acidBase: 0,

    molarMass: 18.015,

    hazards: [],

    tags: [
      'water',
      'H2O'
    ]
  },


  /* =======================================================
     ACIDS
  ======================================================= */

  hcl: {
    id: 'hcl',

    name: 'Hydrochloric acid',
    formula: 'HCl',

    category: 'inorganic',
    family: 'acid',

    state: 'solution',

    color: '#f8fbff',
    solutionColor: '#f8fbff',

    acidBase: -1,

    molarMass: 36.46,

    hazards: [
      'corrosive'
    ],

    tags: [
      'acid',
      'hydrochloric',
      'HCl'
    ]
  },


  h2so4: {
    id: 'h2so4',

    name: 'Sulfuric acid',
    formula: 'H₂SO₄',

    category: 'inorganic',
    family: 'acid',

    state: 'solution',

    color: '#f8fbff',
    solutionColor: '#f8fbff',

    acidBase: -1.2,

    molarMass: 98.079,

    hazards: [
      'corrosive'
    ],

    tags: [
      'acid',
      'sulfuric',
      'H2SO4'
    ]
  },


  hno3: {
    id: 'hno3',

    name: 'Nitric acid',
    formula: 'HNO₃',

    category: 'inorganic',
    family: 'acid',

    state: 'solution',

    color: '#f8fbff',
    solutionColor: '#f8fbff',

    acidBase: -1,

    molarMass: 63.012,

    hazards: [
      'corrosive',
      'oxidizing'
    ],

    tags: [
      'acid',
      'nitric',
      'HNO3'
    ]
  },


  h3po4: {
    id: 'h3po4',

    name: 'Phosphoric acid',
    formula: 'H₃PO₄',

    category: 'inorganic',
    family: 'acid',

    state: 'solution',

    color: '#f8fbff',
    solutionColor: '#f8fbff',

    acidBase: -0.65,

    molarMass: 97.994,

    hazards: [
      'irritant'
    ],

    tags: [
      'acid',
      'phosphoric',
      'H3PO4'
    ]
  },


  ethanoic: {
    id: 'ethanoic',

    name: 'Ethanoic acid',
    formula: 'CH₃COOH',

    category: 'organic',
    family: 'carboxylic-acid',

    state: 'liquid',

    color: '#f8fbff',
    solutionColor: '#f8fbff',

    acidBase: -0.45,

    molarMass: 60.052,

    hazards: [
      'irritant'
    ],

    tags: [
      'organic',
      'acid',
      'ethanoic',
      'acetic acid',
      'CH3COOH'
    ]
  },


  propanoic: {
    id: 'propanoic',

    name: 'Propanoic acid',
    formula: 'C₂H₅COOH',

    category: 'organic',
    family: 'carboxylic-acid',

    state: 'liquid',

    color: '#f8fbff',
    solutionColor: '#f8fbff',

    acidBase: -0.42,

    molarMass: 74.079,

    hazards: [
      'irritant'
    ],

    tags: [
      'acid',
      'propanoic'
    ]
  },


  benzoic: {
    id: 'benzoic',

    name: 'Benzoic acid',
    formula: 'C₆H₅COOH',

    category: 'organic',
    family: 'carboxylic-acid',

    state: 'solution',

    color: '#f8fbff',
    solutionColor: '#f8fbff',

    acidBase: -0.3,

    molarMass: 122.123,

    hazards: [
      'irritant'
    ],

    tags: [
      'acid',
      'benzoic'
    ]
  },


  /* =======================================================
     BASES
  ======================================================= */

  naoh: {
    id: 'naoh',

    name: 'Sodium hydroxide',
    formula: 'NaOH',

    category: 'inorganic',
    family: 'base',

    state: 'solution',

    color: '#f8fbff',
    solutionColor: '#f8fbff',

    acidBase: 1,

    molarMass: 40,

    hazards: [
      'corrosive'
    ],

    tags: [
      'base',
      'NaOH'
    ]
  },


  koh: {
    id: 'koh',

    name: 'Potassium hydroxide',
    formula: 'KOH',

    category: 'inorganic',
    family: 'base',

    state: 'solution',

    color: '#f8fbff',
    solutionColor: '#f8fbff',

    acidBase: 1,

    molarMass: 56.106,

    hazards: [
      'corrosive'
    ],

    tags: [
      'base',
      'KOH'
    ]
  },


  caoh2: {
    id: 'caoh2',

    name: 'Calcium hydroxide',
    formula: 'Ca(OH)₂',

    category: 'inorganic',
    family: 'base',

    state: 'solution',

    color: '#f8fbff',
    solutionColor: '#f8fbff',

    acidBase: 0.8,

    molarMass: 74.093,

    hazards: [
      'irritant'
    ],

    tags: [
      'limewater',
      'base'
    ]
  },


  nh3: {
    id: 'nh3',

    name: 'Ammonia solution',
    formula: 'NH₃(aq)',

    category: 'inorganic',
    family: 'base',

    state: 'solution',

    color: '#f8fbff',
    solutionColor: '#f8fbff',

    acidBase: 0.65,

    molarMass: 17.031,

    hazards: [
      'irritant'
    ],

    tags: [
      'ammonia',
      'NH3'
    ]
  },


  /* =======================================================
     SALTS
  ======================================================= */

  nacl: {
    id: 'nacl',
    name: 'Sodium chloride',
    formula: 'NaCl',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 58.44,
    hazards: [],
    tags: ['salt', 'NaCl']
  },


  kcl: {
    id: 'kcl',
    name: 'Potassium chloride',
    formula: 'KCl',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 74.551,
    hazards: [],
    tags: ['salt', 'KCl']
  },


  cuso4: {
    id: 'cuso4',
    name: 'Copper(II) sulfate',
    formula: 'CuSO₄',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#278cff',
    solutionColor: '#278cff',
    acidBase: -0.1,
    molarMass: 159.609,
    hazards: ['irritant'],
    tags: ['copper', 'CuSO4']
  },


  cucl2: {
    id: 'cucl2',
    name: 'Copper(II) chloride',
    formula: 'CuCl₂',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#38b7a2',
    solutionColor: '#38b7a2',
    acidBase: -0.08,
    molarMass: 134.45,
    hazards: ['irritant'],
    tags: ['copper', 'CuCl2']
  },


  fecl3: {
    id: 'fecl3',
    name: 'Iron(III) chloride',
    formula: 'FeCl₃',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#d59a38',
    solutionColor: '#d59a38',
    acidBase: -0.15,
    molarMass: 162.204,
    hazards: ['irritant'],
    tags: ['iron', 'FeCl3']
  },


  feso4: {
    id: 'feso4',
    name: 'Iron(II) sulfate',
    formula: 'FeSO₄',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#95bd8e',
    solutionColor: '#95bd8e',
    acidBase: -0.05,
    molarMass: 151.908,
    hazards: ['irritant'],
    tags: ['iron', 'FeSO4']
  },


  agno3: {
    id: 'agno3',
    name: 'Silver nitrate',
    formula: 'AgNO₃',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: -0.05,
    molarMass: 169.873,
    hazards: ['oxidizing'],
    tags: ['silver', 'AgNO3']
  },


  bacl2: {
    id: 'bacl2',
    name: 'Barium chloride',
    formula: 'BaCl₂',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 208.23,
    hazards: ['toxic'],
    tags: ['barium', 'BaCl2']
  },


  bano3: {
    id: 'bano3',
    name: 'Barium nitrate',
    formula: 'Ba(NO₃)₂',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 261.337,
    hazards: ['oxidizing', 'toxic'],
    tags: ['barium', 'nitrate']
  },


  pbno3: {
    id: 'pbno3',
    name: 'Lead(II) nitrate',
    formula: 'Pb(NO₃)₂',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 331.2,
    hazards: ['toxic'],
    tags: ['lead', 'PbNO3']
  },


  na2co3: {
    id: 'na2co3',
    name: 'Sodium carbonate',
    formula: 'Na₂CO₃',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0.45,
    molarMass: 105.988,
    hazards: [],
    tags: ['carbonate', 'Na2CO3']
  },


  nahco3: {
    id: 'nahco3',
    name: 'Sodium hydrogen carbonate',
    formula: 'NaHCO₃',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0.25,
    molarMass: 84.007,
    hazards: [],
    tags: ['bicarbonate', 'NaHCO3']
  },


  na2so4: {
    id: 'na2so4',
    name: 'Sodium sulfate',
    formula: 'Na₂SO₄',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 142.04,
    hazards: [],
    tags: ['sulfate', 'Na2SO4']
  },


  na2s: {
    id: 'na2s',
    name: 'Sodium sulfide',
    formula: 'Na₂S',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0.35,
    molarMass: 78.045,
    hazards: ['irritant'],
    tags: ['sulfide', 'Na2S']
  },


  nh4cl: {
    id: 'nh4cl',
    name: 'Ammonium chloride',
    formula: 'NH₄Cl',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: -0.22,
    molarMass: 53.491,
    hazards: ['irritant'],
    tags: ['ammonium', 'NH4Cl']
  },


  ki: {
    id: 'ki',
    name: 'Potassium iodide',
    formula: 'KI',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 166.003,
    hazards: [],
    tags: ['iodide', 'KI']
  },


  kbr: {
    id: 'kbr',
    name: 'Potassium bromide',
    formula: 'KBr',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 119.002,
    hazards: [],
    tags: ['bromide', 'KBr']
  },


  kscn: {
    id: 'kscn',
    name: 'Potassium thiocyanate',
    formula: 'KSCN',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 97.18,
    hazards: ['irritant'],
    tags: ['thiocyanate', 'KSCN']
  },


  mgcl2: {
    id: 'mgcl2',
    name: 'Magnesium chloride',
    formula: 'MgCl₂',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 95.211,
    hazards: [],
    tags: ['magnesium', 'MgCl2']
  },


  cacl2: {
    id: 'cacl2',
    name: 'Calcium chloride',
    formula: 'CaCl₂',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 110.98,
    hazards: [],
    tags: ['calcium', 'CaCl2']
  },


  znso4: {
    id: 'znso4',
    name: 'Zinc sulfate',
    formula: 'ZnSO₄',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: -0.03,
    molarMass: 161.47,
    hazards: ['irritant'],
    tags: ['zinc', 'ZnSO4']
  },


  alcl3: {
    id: 'alcl3',
    name: 'Aluminium chloride',
    formula: 'AlCl₃',
    category: 'inorganic',
    family: 'salt',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: -0.2,
    molarMass: 133.34,
    hazards: ['irritant'],
    tags: ['aluminium', 'AlCl3']
  },


  /* =======================================================
     OXIDIZERS / REAGENTS
  ======================================================= */

  kmno4: {
    id: 'kmno4',

    name: 'Potassium permanganate',
    formula: 'KMnO₄',

    category: 'inorganic',
    family: 'oxidizer',

    state: 'solution',

    color: '#7737b7',
    solutionColor: '#7737b7',

    acidBase: 0,

    molarMass: 158.034,

    hazards: [
      'oxidizing'
    ],

    tags: [
      'permanganate',
      'KMnO4'
    ]
  },


  k2cr2o7: {
    id: 'k2cr2o7',

    name: 'Potassium dichromate',
    formula: 'K₂Cr₂O₇',

    category: 'inorganic',
    family: 'oxidizer',

    state: 'solution',

    color: '#ef8426',
    solutionColor: '#ef8426',

    acidBase: 0,

    molarMass: 294.185,

    hazards: [
      'oxidizing',
      'toxic'
    ],

    tags: [
      'dichromate',
      'K2Cr2O7'
    ]
  },


  h2o2: {
    id: 'h2o2',

    name: 'Hydrogen peroxide',
    formula: 'H₂O₂',

    category: 'inorganic',
    family: 'oxidizer',

    state: 'solution',

    color: '#f8fbff',
    solutionColor: '#f8fbff',

    acidBase: 0,

    molarMass: 34.0147,

    hazards: [
      'oxidizing'
    ],

    tags: [
      'peroxide',
      'H2O2'
    ]
  },


  /* =======================================================
     INDICATORS
  ======================================================= */

  phenolphthalein: {
    id: 'phenolphthalein',

    name: 'Phenolphthalein',
    formula: 'C₂₀H₁₂O₄',

    category: 'indicator',
    family: 'indicator',

    state: 'solution',

    color: '#f8fbff',
    solutionColor: '#f8fbff',

    acidBase: 0,

    indicator:
      'phenolphthalein',

    molarMass: 318.328,

    hazards: [],

    tags: [
      'indicator',
      'phenolphthalein'
    ]
  },


  methylOrange: {
    id: 'methylOrange',

    name: 'Methyl orange',
    formula: 'C₁₄H₁₄N₃NaO₃S',

    category: 'indicator',
    family: 'indicator',

    state: 'solution',

    color: '#f0b43c',
    solutionColor: '#f0b43c',

    acidBase: 0,

    indicator:
      'methylOrange',

    molarMass: 327.33,

    hazards: [],

    tags: [
      'indicator',
      'methyl orange'
    ]
  },


  litmus: {
    id: 'litmus',

    name: 'Litmus solution',
    formula: 'Indicator',

    category: 'indicator',
    family: 'indicator',

    state: 'solution',

    color: '#7f6db7',
    solutionColor: '#7f6db7',

    acidBase: 0,

    indicator:
      'litmus',

    molarMass: null,

    hazards: [],

    tags: [
      'indicator',
      'litmus'
    ]
  },


  iodine: {
    id: 'iodine',

    name: 'Iodine solution',
    formula: 'I₂',

    category: 'indicator',
    family: 'reagent',

    state: 'solution',

    color: '#995e33',
    solutionColor: '#995e33',

    acidBase: 0,

    molarMass: 253.809,

    hazards: [
      'irritant'
    ],

    tags: [
      'iodine',
      'starch test'
    ]
  },


  bromineWater: {
    id: 'bromineWater',

    name: 'Bromine water',
    formula: 'Br₂(aq)',

    category: 'indicator',
    family: 'reagent',

    state: 'solution',

    color: '#b66a2a',
    solutionColor: '#b66a2a',

    acidBase: 0,

    molarMass: 159.808,

    hazards: [
      'irritant'
    ],

    tags: [
      'bromine',
      'alkene test'
    ]
  },


  /* =======================================================
     HYDROCARBONS
  ======================================================= */

  hexane: {
    id: 'hexane',
    name: 'Hexane',
    formula: 'C₆H₁₄',
    category: 'organic',
    family: 'alkane',
    state: 'liquid',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 86.178,
    hazards: ['flammable'],
    tags: ['alkane', 'hexane']
  },


  cyclohexane: {
    id: 'cyclohexane',
    name: 'Cyclohexane',
    formula: 'C₆H₁₂',
    category: 'organic',
    family: 'cycloalkane',
    state: 'liquid',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 84.162,
    hazards: ['flammable'],
    tags: ['cycloalkane']
  },


  ethene: {
    id: 'ethene',
    name: 'Ethene',
    formula: 'C₂H₄',
    category: 'organic',
    family: 'alkene',
    state: 'gas',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 28.054,
    hazards: ['flammable'],
    tags: ['alkene', 'ethylene']
  },


  ethyne: {
    id: 'ethyne',
    name: 'Ethyne',
    formula: 'C₂H₂',
    category: 'organic',
    family: 'alkyne',
    state: 'gas',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 26.038,
    hazards: ['flammable'],
    tags: ['alkyne', 'acetylene']
  },


  /* =======================================================
     ALCOHOLS / PHENOL
  ======================================================= */

  methanol: {
    id: 'methanol',
    name: 'Methanol',
    formula: 'CH₃OH',
    category: 'organic',
    family: 'alcohol',
    state: 'liquid',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 32.042,
    hazards: ['flammable', 'toxic'],
    tags: ['alcohol', 'methanol']
  },


  ethanol: {
    id: 'ethanol',
    name: 'Ethanol',
    formula: 'C₂H₅OH',
    category: 'organic',
    family: 'alcohol',
    state: 'liquid',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 46.069,
    hazards: ['flammable'],
    tags: ['alcohol', 'ethanol']
  },


  propan1ol: {
    id: 'propan1ol',
    name: 'Propan-1-ol',
    formula: 'C₃H₇OH',
    category: 'organic',
    family: 'alcohol',
    state: 'liquid',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 60.096,
    hazards: ['flammable'],
    tags: ['alcohol', 'propanol']
  },


  glycerol: {
    id: 'glycerol',
    name: 'Glycerol',
    formula: 'C₃H₈O₃',
    category: 'organic',
    family: 'polyol',
    state: 'liquid',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 92.094,
    hazards: [],
    tags: ['glycerol', 'polyol']
  },


  phenol: {
    id: 'phenol',
    name: 'Phenol',
    formula: 'C₆H₅OH',
    category: 'organic',
    family: 'phenol',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: -0.18,
    molarMass: 94.113,
    hazards: ['toxic', 'corrosive'],
    tags: ['phenol']
  },


  /* =======================================================
     ALDEHYDE / KETONE
  ======================================================= */

  ethanal: {
    id: 'ethanal',
    name: 'Ethanal',
    formula: 'CH₃CHO',
    category: 'organic',
    family: 'aldehyde',
    state: 'liquid',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 44.053,
    hazards: ['flammable'],
    tags: ['aldehyde']
  },


  propanal: {
    id: 'propanal',
    name: 'Propanal',
    formula: 'C₂H₅CHO',
    category: 'organic',
    family: 'aldehyde',
    state: 'liquid',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 58.08,
    hazards: ['flammable'],
    tags: ['aldehyde']
  },


  acetone: {
    id: 'acetone',
    name: 'Propanone',
    formula: 'CH₃COCH₃',
    category: 'organic',
    family: 'ketone',
    state: 'liquid',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 58.08,
    hazards: ['flammable'],
    tags: ['ketone', 'acetone']
  },


  /* =======================================================
     ESTER
  ======================================================= */

  ethylEthanoate: {
    id: 'ethylEthanoate',

    name: 'Ethyl ethanoate',
    formula: 'CH₃COOC₂H₅',

    category: 'organic',
    family: 'ester',

    state: 'liquid',

    color: '#f8fbff',
    solutionColor: '#f8fbff',

    acidBase: 0,

    molarMass: 88.106,

    hazards: [
      'flammable'
    ],

    tags: [
      'ester'
    ]
  },


  /* =======================================================
     CARBOHYDRATES
  ======================================================= */

  glucose: {
    id: 'glucose',
    name: 'Glucose solution',
    formula: 'C₆H₁₂O₆',
    category: 'organic',
    family: 'carbohydrate',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 180.156,
    hazards: [],
    tags: ['glucose', 'carbohydrate']
  },


  fructose: {
    id: 'fructose',
    name: 'Fructose solution',
    formula: 'C₆H₁₂O₆',
    category: 'organic',
    family: 'carbohydrate',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 180.156,
    hazards: [],
    tags: ['fructose', 'carbohydrate']
  },


  sucrose: {
    id: 'sucrose',
    name: 'Sucrose solution',
    formula: 'C₁₂H₂₂O₁₁',
    category: 'organic',
    family: 'carbohydrate',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 342.296,
    hazards: [],
    tags: ['sucrose', 'sugar']
  },


  starch: {
    id: 'starch',
    name: 'Starch solution',
    formula: '(C₆H₁₀O₅)ₙ',
    category: 'organic',
    family: 'carbohydrate',
    state: 'solution',
    color: '#f2f3f5',
    solutionColor: '#f2f3f5',
    acidBase: 0,
    molarMass: null,
    hazards: [],
    tags: ['starch', 'carbohydrate']
  },


  /* =======================================================
     AMINO ACID / PROTEIN
  ======================================================= */

  glycine: {
    id: 'glycine',
    name: 'Glycine solution',
    formula: 'NH₂CH₂COOH',
    category: 'organic',
    family: 'amino-acid',
    state: 'solution',
    color: '#f8fbff',
    solutionColor: '#f8fbff',
    acidBase: 0,
    molarMass: 75.067,
    hazards: [],
    tags: ['glycine', 'amino acid']
  },


  albumin: {
    id: 'albumin',
    name: 'Protein solution',
    formula: 'Protein',
    category: 'organic',
    family: 'protein',
    state: 'solution',
    color: '#f4f0e8',
    solutionColor: '#f4f0e8',
    acidBase: 0,
    molarMass: null,
    hazards: [],
    tags: ['protein', 'albumin', 'biuret']
  }

}


/* =========================================================
   DISPLAY ORDER
========================================================= */

export const CHEMICAL_ORDER = [

  'water',

  'hcl',
  'h2so4',
  'hno3',
  'h3po4',

  'naoh',
  'koh',
  'caoh2',
  'nh3',

  'nacl',
  'kcl',
  'cuso4',
  'cucl2',
  'fecl3',
  'feso4',
  'agno3',
  'bacl2',
  'bano3',
  'pbno3',

  'na2co3',
  'nahco3',
  'na2so4',
  'na2s',
  'nh4cl',
  'ki',
  'kbr',
  'kscn',
  'mgcl2',
  'cacl2',
  'znso4',
  'alcl3',

  'kmno4',
  'k2cr2o7',
  'h2o2',

  'phenolphthalein',
  'methylOrange',
  'litmus',
  'iodine',
  'bromineWater',

  'hexane',
  'cyclohexane',
  'ethene',
  'ethyne',

  'methanol',
  'ethanol',
  'propan1ol',
  'glycerol',
  'phenol',

  'ethanal',
  'propanal',
  'acetone',

  'ethanoic',
  'propanoic',
  'benzoic',
  'ethylEthanoate',

  'glucose',
  'fructose',
  'sucrose',
  'starch',

  'glycine',
  'albumin'

]


/* =========================================================
   HELPERS
========================================================= */

export function getChemical(
  id
) {

  return (
    CHEMICALS[id] ||
    null
  )

}


export function searchChemicals(
  query = ''
) {

  const text =
    String(
      query
    )
      .trim()
      .toLowerCase()


  return CHEMICAL_ORDER

    .map(
      id =>
        CHEMICALS[id]
    )

    .filter(
      Boolean
    )

    .filter(
      chemical => {

        if (!text) {
          return true
        }


        return [

          chemical.name,

          chemical.formula,

          chemical.category,

          chemical.family,

          ...(
            chemical.tags ||
            []
          )

        ]

          .join(
            ' '
          )

          .toLowerCase()

          .includes(
            text
          )

      }
    )

}