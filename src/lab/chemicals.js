/* =========================================================
   CHEMLAB VIRTUAL LAB 3.1
   101-CHEMICAL DATABASE
========================================================= */

function C(
  id,
  name,
  formula,
  category,
  family,
  color = '#f8fbff',
  acidBase = 0,
  state = 'solution',
  hazards = [],
  tags = [],
  indicator = null
) {

  return {
    id,
    name,
    formula,
    category,
    family,
    state,

    color,

    solutionColor:
      color,

    acidBase,

    hazards,

    tags,

    ...(
      indicator
        ? {
            indicator
          }
        : {}
    )
  }

}


const LIST = [

  C(
    'water',
    'Water',
    'H₂O',
    'inorganic',
    'water',
    '#dff7ff',
    0,
    'liquid',
    [],
    [
      'water',
      'H2O'
    ]
  ),


  /* =======================================================
     ACIDS
  ======================================================= */

  C(
    'hcl',
    'Hydrochloric acid',
    'HCl',
    'inorganic',
    'acid',
    '#f8fbff',
    -1,
    'solution',
    [
      'corrosive'
    ],
    [
      'acid',
      'chloride'
    ]
  ),


  C(
    'h2so4',
    'Sulfuric acid',
    'H₂SO₄',
    'inorganic',
    'acid',
    '#f8fbff',
    -1.2,
    'solution',
    [
      'corrosive'
    ],
    [
      'acid',
      'sulfate'
    ]
  ),


  C(
    'hno3',
    'Nitric acid',
    'HNO₃',
    'inorganic',
    'acid',
    '#f8fbff',
    -1,
    'solution',
    [
      'corrosive',
      'oxidizing'
    ],
    [
      'acid',
      'nitrate'
    ]
  ),


  C(
    'h3po4',
    'Phosphoric acid',
    'H₃PO₄',
    'inorganic',
    'acid',
    '#f8fbff',
    -.65,
    'solution',
    [
      'irritant'
    ],
    [
      'acid',
      'phosphate'
    ]
  ),


  C(
    'h2co3',
    'Carbonic acid',
    'H₂CO₃',
    'inorganic',
    'acid',
    '#f8fbff',
    -.35,
    'solution',
    [],
    [
      'acid',
      'carbonate'
    ]
  ),


  C(
    'h2so3',
    'Sulfurous acid',
    'H₂SO₃',
    'inorganic',
    'acid',
    '#f8fbff',
    -.55,
    'solution',
    [
      'irritant'
    ],
    [
      'acid',
      'sulfite'
    ]
  ),


  C(
    'hf',
    'Hydrofluoric acid',
    'HF',
    'inorganic',
    'acid',
    '#f8fbff',
    -.7,
    'solution',
    [
      'corrosive',
      'toxic'
    ],
    [
      'acid',
      'fluoride'
    ]
  ),


  C(
    'oxalic',
    'Oxalic acid',
    'H₂C₂O₄',
    'organic',
    'dicarboxylic-acid',
    '#f8fbff',
    -.55,
    'solution',
    [
      'irritant'
    ],
    [
      'oxalic',
      'dicarboxylic'
    ]
  ),


  C(
    'methanoic',
    'Methanoic acid',
    'HCOOH',
    'organic',
    'carboxylic-acid',
    '#f8fbff',
    -.45,
    'liquid',
    [
      'irritant'
    ],
    [
      'formic acid'
    ]
  ),


  C(
    'ethanoic',
    'Ethanoic acid',
    'CH₃COOH',
    'organic',
    'carboxylic-acid',
    '#f8fbff',
    -.45,
    'liquid',
    [
      'irritant'
    ],
    [
      'acetic acid'
    ]
  ),


  C(
    'propanoic',
    'Propanoic acid',
    'C₂H₅COOH',
    'organic',
    'carboxylic-acid',
    '#f8fbff',
    -.42,
    'liquid',
    [
      'irritant'
    ]
  ),


  C(
    'benzoic',
    'Benzoic acid',
    'C₆H₅COOH',
    'organic',
    'carboxylic-acid',
    '#f8fbff',
    -.3,
    'solution',
    [
      'irritant'
    ]
  ),


  /* =======================================================
     BASES
  ======================================================= */

  C(
    'naoh',
    'Sodium hydroxide',
    'NaOH',
    'inorganic',
    'base',
    '#f8fbff',
    1,
    'solution',
    [
      'corrosive'
    ],
    [
      'base'
    ]
  ),


  C(
    'koh',
    'Potassium hydroxide',
    'KOH',
    'inorganic',
    'base',
    '#f8fbff',
    1,
    'solution',
    [
      'corrosive'
    ],
    [
      'base'
    ]
  ),


  C(
    'caoh2',
    'Calcium hydroxide',
    'Ca(OH)₂',
    'inorganic',
    'base',
    '#f8fbff',
    .8,
    'solution',
    [
      'irritant'
    ],
    [
      'limewater'
    ]
  ),


  C(
    'baoh2',
    'Barium hydroxide',
    'Ba(OH)₂',
    'inorganic',
    'base',
    '#f8fbff',
    .85,
    'solution',
    [
      'toxic',
      'corrosive'
    ]
  ),


  C(
    'nh3',
    'Ammonia solution',
    'NH₃(aq)',
    'inorganic',
    'base',
    '#f8fbff',
    .65,
    'solution',
    [
      'irritant'
    ],
    [
      'ammonia'
    ]
  ),


  C(
    'mgoh2',
    'Magnesium hydroxide',
    'Mg(OH)₂',
    'inorganic',
    'base',
    '#f8fbff',
    .35,
    'suspension'
  ),


  C(
    'aloh3',
    'Aluminium hydroxide',
    'Al(OH)₃',
    'inorganic',
    'amphoteric-hydroxide',
    '#f5f5f5',
    0,
    'suspension'
  ),


  C(
    'znoh2',
    'Zinc hydroxide',
    'Zn(OH)₂',
    'inorganic',
    'amphoteric-hydroxide',
    '#f5f5f5',
    0,
    'suspension'
  ),


  /* =======================================================
     SALTS
  ======================================================= */

  C(
    'nacl',
    'Sodium chloride',
    'NaCl',
    'inorganic',
    'salt',
    '#f8fbff',
    0,
    'solution',
    [],
    [
      'chloride'
    ]
  ),


  C(
    'kcl',
    'Potassium chloride',
    'KCl',
    'inorganic',
    'salt',
    '#f8fbff',
    0,
    'solution',
    [],
    [
      'chloride'
    ]
  ),


  C(
    'cacl2',
    'Calcium chloride',
    'CaCl₂',
    'inorganic',
    'salt',
    '#f8fbff',
    0,
    'solution',
    [],
    [
      'chloride'
    ]
  ),


  C(
    'mgcl2',
    'Magnesium chloride',
    'MgCl₂',
    'inorganic',
    'salt',
    '#f8fbff',
    0,
    'solution',
    [],
    [
      'chloride'
    ]
  ),


  C(
    'nh4cl',
    'Ammonium chloride',
    'NH₄Cl',
    'inorganic',
    'salt',
    '#f8fbff',
    -.22,
    'solution',
    [
      'irritant'
    ],
    [
      'ammonium'
    ]
  ),


  C(
    'cuso4',
    'Copper(II) sulfate',
    'CuSO₄',
    'inorganic',
    'salt',
    '#278cff',
    -.1,
    'solution',
    [
      'irritant'
    ],
    [
      'copper',
      'sulfate'
    ]
  ),


  C(
    'cucl2',
    'Copper(II) chloride',
    'CuCl₂',
    'inorganic',
    'salt',
    '#38b7a2',
    -.08,
    'solution',
    [
      'irritant'
    ],
    [
      'copper',
      'chloride'
    ]
  ),


  C(
    'fecl3',
    'Iron(III) chloride',
    'FeCl₃',
    'inorganic',
    'salt',
    '#d59a38',
    -.15,
    'solution',
    [
      'irritant'
    ],
    [
      'iron',
      'chloride'
    ]
  ),


  C(
    'fecl2',
    'Iron(II) chloride',
    'FeCl₂',
    'inorganic',
    'salt',
    '#9eb48a',
    -.05,
    'solution',
    [
      'irritant'
    ],
    [
      'iron',
      'chloride'
    ]
  ),


  C(
    'feso4',
    'Iron(II) sulfate',
    'FeSO₄',
    'inorganic',
    'salt',
    '#95bd8e',
    -.05,
    'solution',
    [
      'irritant'
    ],
    [
      'iron',
      'sulfate'
    ]
  ),


  C(
    'fe2so43',
    'Iron(III) sulfate',
    'Fe₂(SO₄)₃',
    'inorganic',
    'salt',
    '#d6b45e',
    -.12,
    'solution',
    [
      'irritant'
    ],
    [
      'iron',
      'sulfate'
    ]
  ),


  C(
    'agno3',
    'Silver nitrate',
    'AgNO₃',
    'inorganic',
    'salt',
    '#f8fbff',
    -.05,
    'solution',
    [
      'oxidizing'
    ],
    [
      'silver',
      'nitrate'
    ]
  ),


  C(
    'bacl2',
    'Barium chloride',
    'BaCl₂',
    'inorganic',
    'salt',
    '#f8fbff',
    0,
    'solution',
    [
      'toxic'
    ],
    [
      'barium',
      'chloride'
    ]
  ),


  C(
    'bano3',
    'Barium nitrate',
    'Ba(NO₃)₂',
    'inorganic',
    'salt',
    '#f8fbff',
    0,
    'solution',
    [
      'oxidizing',
      'toxic'
    ],
    [
      'barium',
      'nitrate'
    ]
  ),


  C(
    'pbno3',
    'Lead(II) nitrate',
    'Pb(NO₃)₂',
    'inorganic',
    'salt',
    '#f8fbff',
    0,
    'solution',
    [
      'toxic'
    ],
    [
      'lead',
      'nitrate'
    ]
  ),


  C(
    'na2co3',
    'Sodium carbonate',
    'Na₂CO₃',
    'inorganic',
    'salt',
    '#f8fbff',
    .45,
    'solution',
    [],
    [
      'carbonate'
    ]
  ),


  C(
    'nahco3',
    'Sodium hydrogen carbonate',
    'NaHCO₃',
    'inorganic',
    'salt',
    '#f8fbff',
    .25,
    'solution',
    [],
    [
      'bicarbonate',
      'hydrogen carbonate'
    ]
  ),


  C(
    'na2so4',
    'Sodium sulfate',
    'Na₂SO₄',
    'inorganic',
    'salt',
    '#f8fbff',
    0,
    'solution',
    [],
    [
      'sulfate'
    ]
  ),


  C(
    'k2so4',
    'Potassium sulfate',
    'K₂SO₄',
    'inorganic',
    'salt',
    '#f8fbff',
    0,
    'solution',
    [],
    [
      'sulfate'
    ]
  ),


  C(
    'na2so3',
    'Sodium sulfite',
    'Na₂SO₃',
    'inorganic',
    'salt',
    '#f8fbff',
    .25,
    'solution',
    [
      'irritant'
    ],
    [
      'sulfite'
    ]
  ),


  C(
    'na2s',
    'Sodium sulfide',
    'Na₂S',
    'inorganic',
    'salt',
    '#f8fbff',
    .35,
    'solution',
    [
      'irritant'
    ],
    [
      'sulfide'
    ]
  ),


  C(
    'na2s2o3',
    'Sodium thiosulfate',
    'Na₂S₂O₃',
    'inorganic',
    'salt',
    '#f8fbff',
    0,
    'solution',
    [],
    [
      'thiosulfate'
    ]
  ),


  C(
    'ki',
    'Potassium iodide',
    'KI',
    'inorganic',
    'salt',
    '#f8fbff',
    0,
    'solution',
    [],
    [
      'iodide'
    ]
  ),


  C(
    'kbr',
    'Potassium bromide',
    'KBr',
    'inorganic',
    'salt',
    '#f8fbff',
    0,
    'solution',
    [],
    [
      'bromide'
    ]
  ),


  C(
    'kscn',
    'Potassium thiocyanate',
    'KSCN',
    'inorganic',
    'salt',
    '#f8fbff',
    0,
    'solution',
    [
      'irritant'
    ],
    [
      'thiocyanate'
    ]
  ),


  C(
    'znso4',
    'Zinc sulfate',
    'ZnSO₄',
    'inorganic',
    'salt',
    '#f8fbff',
    -.03,
    'solution',
    [
      'irritant'
    ],
    [
      'zinc',
      'sulfate'
    ]
  ),


  C(
    'alcl3',
    'Aluminium chloride',
    'AlCl₃',
    'inorganic',
    'salt',
    '#f8fbff',
    -.2,
    'solution',
    [
      'irritant'
    ],
    [
      'aluminium',
      'chloride'
    ]
  ),


  C(
    'kno3',
    'Potassium nitrate',
    'KNO₃',
    'inorganic',
    'salt',
    '#f8fbff',
    0,
    'solution',
    [
      'oxidizing'
    ],
    [
      'nitrate'
    ]
  ),


  C(
    'nano3',
    'Sodium nitrate',
    'NaNO₃',
    'inorganic',
    'salt',
    '#f8fbff',
    0,
    'solution',
    [
      'oxidizing'
    ],
    [
      'nitrate'
    ]
  ),


  C(
    'na3po4',
    'Sodium phosphate',
    'Na₃PO₄',
    'inorganic',
    'salt',
    '#f8fbff',
    .35,
    'solution',
    [],
    [
      'phosphate'
    ]
  ),


  C(
    'k3po4',
    'Potassium phosphate',
    'K₃PO₄',
    'inorganic',
    'salt',
    '#f8fbff',
    .35,
    'solution',
    [],
    [
      'phosphate'
    ]
  ),


  C(
    'caco3',
    'Calcium carbonate',
    'CaCO₃',
    'inorganic',
    'carbonate',
    '#f4f4f4',
    0,
    'suspension',
    [],
    [
      'carbonate'
    ]
  ),


  C(
    'mgco3',
    'Magnesium carbonate',
    'MgCO₃',
    'inorganic',
    'carbonate',
    '#f4f4f4',
    0,
    'suspension',
    [],
    [
      'carbonate'
    ]
  ),


  C(
    'cuco3',
    'Copper(II) carbonate',
    'CuCO₃',
    'inorganic',
    'carbonate',
    '#67a889',
    0,
    'suspension',
    [
      'irritant'
    ],
    [
      'copper',
      'carbonate'
    ]
  ),


  C(
    'nh4no3',
    'Ammonium nitrate',
    'NH₄NO₃',
    'inorganic',
    'salt',
    '#f8fbff',
    -.15,
    'solution',
    [
      'oxidizing'
    ],
    [
      'ammonium',
      'nitrate'
    ]
  ),


  /* =======================================================
     OXIDIZERS
  ======================================================= */

  C(
    'kmno4',
    'Potassium permanganate',
    'KMnO₄',
    'inorganic',
    'oxidizer',
    '#7737b7',
    0,
    'solution',
    [
      'oxidizing'
    ],
    [
      'permanganate'
    ]
  ),


  C(
    'k2cr2o7',
    'Potassium dichromate',
    'K₂Cr₂O₇',
    'inorganic',
    'oxidizer',
    '#ef8426',
    0,
    'solution',
    [
      'oxidizing',
      'toxic'
    ],
    [
      'dichromate'
    ]
  ),


  C(
    'h2o2',
    'Hydrogen peroxide',
    'H₂O₂',
    'inorganic',
    'oxidizer',
    '#f8fbff',
    0,
    'solution',
    [
      'oxidizing'
    ],
    [
      'peroxide'
    ]
  ),


  /* =======================================================
     INDICATORS / REAGENTS
  ======================================================= */

  C(
    'iodine',
    'Iodine solution',
    'I₂',
    'indicator',
    'reagent',
    '#995e33',
    0,
    'solution',
    [
      'irritant'
    ],
    [
      'iodine',
      'starch test'
    ]
  ),


  C(
    'bromineWater',
    'Bromine water',
    'Br₂(aq)',
    'indicator',
    'reagent',
    '#b66a2a',
    0,
    'solution',
    [
      'irritant'
    ],
    [
      'bromine',
      'unsaturation'
    ]
  ),


  C(
    'phenolphthalein',
    'Phenolphthalein',
    'C₂₀H₁₂O₄',
    'indicator',
    'indicator',
    '#f8fbff',
    0,
    'solution',
    [],
    [
      'indicator'
    ],
    'phenolphthalein'
  ),


  C(
    'methylOrange',
    'Methyl orange',
    'C₁₄H₁₄N₃NaO₃S',
    'indicator',
    'indicator',
    '#e9b13f',
    0,
    'solution',
    [],
    [
      'indicator'
    ],
    'methylOrange'
  ),


  C(
    'litmus',
    'Litmus solution',
    'Indicator',
    'indicator',
    'indicator',
    '#806bb0',
    0,
    'solution',
    [],
    [
      'indicator'
    ],
    'litmus'
  ),


  C(
    'universalIndicator',
    'Universal indicator',
    'Indicator',
    'indicator',
    'indicator',
    '#4cae70',
    0,
    'solution',
    [],
    [
      'indicator',
      'universal'
    ],
    'universal'
  ),


  /* =======================================================
     HYDROCARBONS
  ======================================================= */

  C(
    'methane',
    'Methane',
    'CH₄',
    'organic',
    'alkane',
    '#f8fbff',
    0,
    'gas',
    [
      'flammable'
    ],
    [
      'alkane'
    ]
  ),


  C(
    'ethane',
    'Ethane',
    'C₂H₆',
    'organic',
    'alkane',
    '#f8fbff',
    0,
    'gas',
    [
      'flammable'
    ],
    [
      'alkane'
    ]
  ),


  C(
    'propane',
    'Propane',
    'C₃H₈',
    'organic',
    'alkane',
    '#f8fbff',
    0,
    'gas',
    [
      'flammable'
    ],
    [
      'alkane'
    ]
  ),


  C(
    'butane',
    'Butane',
    'C₄H₁₀',
    'organic',
    'alkane',
    '#f8fbff',
    0,
    'gas',
    [
      'flammable'
    ],
    [
      'alkane'
    ]
  ),


  C(
    'hexane',
    'Hexane',
    'C₆H₁₄',
    'organic',
    'alkane',
    '#f8fbff',
    0,
    'liquid',
    [
      'flammable'
    ],
    [
      'alkane'
    ]
  ),


  C(
    'cyclohexane',
    'Cyclohexane',
    'C₆H₁₂',
    'organic',
    'cycloalkane',
    '#f8fbff',
    0,
    'liquid',
    [
      'flammable'
    ],
    [
      'cycloalkane'
    ]
  ),


  C(
    'ethene',
    'Ethene',
    'C₂H₄',
    'organic',
    'alkene',
    '#f8fbff',
    0,
    'gas',
    [
      'flammable'
    ],
    [
      'alkene',
      'ethylene'
    ]
  ),


  C(
    'propene',
    'Propene',
    'C₃H₆',
    'organic',
    'alkene',
    '#f8fbff',
    0,
    'gas',
    [
      'flammable'
    ],
    [
      'alkene'
    ]
  ),


  C(
    'ethyne',
    'Ethyne',
    'C₂H₂',
    'organic',
    'alkyne',
    '#f8fbff',
    0,
    'gas',
    [
      'flammable'
    ],
    [
      'alkyne',
      'acetylene'
    ]
  ),


  C(
    'benzene',
    'Benzene',
    'C₆H₆',
    'organic',
    'aromatic',
    '#f8fbff',
    0,
    'liquid',
    [
      'flammable',
      'toxic'
    ],
    [
      'aromatic'
    ]
  ),


  C(
    'toluene',
    'Methylbenzene',
    'C₆H₅CH₃',
    'organic',
    'aromatic',
    '#f8fbff',
    0,
    'liquid',
    [
      'flammable'
    ],
    [
      'aromatic',
      'toluene'
    ]
  ),


  /* =======================================================
     ALCOHOLS / PHENOL
  ======================================================= */

  C(
    'methanol',
    'Methanol',
    'CH₃OH',
    'organic',
    'alcohol',
    '#f8fbff',
    0,
    'liquid',
    [
      'flammable',
      'toxic'
    ],
    [
      'alcohol'
    ]
  ),


  C(
    'ethanol',
    'Ethanol',
    'C₂H₅OH',
    'organic',
    'alcohol',
    '#f8fbff',
    0,
    'liquid',
    [
      'flammable'
    ],
    [
      'alcohol'
    ]
  ),


  C(
    'propan1ol',
    'Propan-1-ol',
    'C₃H₇OH',
    'organic',
    'alcohol',
    '#f8fbff',
    0,
    'liquid',
    [
      'flammable'
    ],
    [
      'alcohol'
    ]
  ),


  C(
    'propan2ol',
    'Propan-2-ol',
    'CH₃CHOHCH₃',
    'organic',
    'alcohol',
    '#f8fbff',
    0,
    'liquid',
    [
      'flammable'
    ],
    [
      'alcohol',
      'isopropanol'
    ]
  ),


  C(
    'ethyleneGlycol',
    'Ethane-1,2-diol',
    'HOCH₂CH₂OH',
    'organic',
    'polyol',
    '#f8fbff',
    0,
    'liquid',
    [
      'toxic'
    ],
    [
      'glycol',
      'polyol'
    ]
  ),


  C(
    'glycerol',
    'Glycerol',
    'C₃H₈O₃',
    'organic',
    'polyol',
    '#f8fbff',
    0,
    'liquid',
    [],
    [
      'glycerol',
      'polyol'
    ]
  ),


  C(
    'phenol',
    'Phenol',
    'C₆H₅OH',
    'organic',
    'phenol',
    '#f8fbff',
    -.18,
    'solution',
    [
      'toxic',
      'corrosive'
    ],
    [
      'phenol'
    ]
  ),


  /* =======================================================
     CARBONYL
  ======================================================= */

  C(
    'methanal',
    'Methanal',
    'HCHO',
    'organic',
    'aldehyde',
    '#f8fbff',
    0,
    'solution',
    [
      'toxic'
    ],
    [
      'formaldehyde',
      'aldehyde'
    ]
  ),


  C(
    'ethanal',
    'Ethanal',
    'CH₃CHO',
    'organic',
    'aldehyde',
    '#f8fbff',
    0,
    'liquid',
    [
      'flammable'
    ],
    [
      'aldehyde'
    ]
  ),


  C(
    'propanal',
    'Propanal',
    'C₂H₅CHO',
    'organic',
    'aldehyde',
    '#f8fbff',
    0,
    'liquid',
    [
      'flammable'
    ],
    [
      'aldehyde'
    ]
  ),


  C(
    'acetone',
    'Propanone',
    'CH₃COCH₃',
    'organic',
    'ketone',
    '#f8fbff',
    0,
    'liquid',
    [
      'flammable'
    ],
    [
      'ketone',
      'acetone'
    ]
  ),


  C(
    'butanone',
    'Butan-2-one',
    'CH₃COC₂H₅',
    'organic',
    'ketone',
    '#f8fbff',
    0,
    'liquid',
    [
      'flammable'
    ],
    [
      'ketone'
    ]
  ),


  /* =======================================================
     ESTERS
  ======================================================= */

  C(
    'methylEthanoate',
    'Methyl ethanoate',
    'CH₃COOCH₃',
    'organic',
    'ester',
    '#f8fbff',
    0,
    'liquid',
    [
      'flammable'
    ],
    [
      'ester'
    ]
  ),


  C(
    'ethylEthanoate',
    'Ethyl ethanoate',
    'CH₃COOC₂H₅',
    'organic',
    'ester',
    '#f8fbff',
    0,
    'liquid',
    [
      'flammable'
    ],
    [
      'ester'
    ]
  ),


  C(
    'ethylFormate',
    'Ethyl methanoate',
    'HCOOC₂H₅',
    'organic',
    'ester',
    '#f8fbff',
    0,
    'liquid',
    [
      'flammable'
    ],
    [
      'ester'
    ]
  ),


  /* =======================================================
     CARBOHYDRATES
  ======================================================= */

  C(
    'glucose',
    'Glucose solution',
    'C₆H₁₂O₆',
    'organic',
    'carbohydrate',
    '#f8fbff',
    0,
    'solution',
    [],
    [
      'glucose',
      'reducing sugar'
    ]
  ),


  C(
    'fructose',
    'Fructose solution',
    'C₆H₁₂O₆',
    'organic',
    'carbohydrate',
    '#f8fbff',
    0,
    'solution',
    [],
    [
      'fructose',
      'reducing sugar'
    ]
  ),


  C(
    'sucrose',
    'Sucrose solution',
    'C₁₂H₂₂O₁₁',
    'organic',
    'carbohydrate',
    '#f8fbff',
    0,
    'solution',
    [],
    [
      'sucrose',
      'sugar'
    ]
  ),


  C(
    'maltose',
    'Maltose solution',
    'C₁₂H₂₂O₁₁',
    'organic',
    'carbohydrate',
    '#f8fbff',
    0,
    'solution',
    [],
    [
      'maltose',
      'reducing sugar'
    ]
  ),


  C(
    'lactose',
    'Lactose solution',
    'C₁₂H₂₂O₁₁',
    'organic',
    'carbohydrate',
    '#f8fbff',
    0,
    'solution',
    [],
    [
      'lactose',
      'reducing sugar'
    ]
  ),


  C(
    'starch',
    'Starch solution',
    '(C₆H₁₀O₅)ₙ',
    'organic',
    'polysaccharide',
    '#f2f3f5',
    0,
    'solution',
    [],
    [
      'starch'
    ]
  ),


  C(
    'cellulose',
    'Cellulose suspension',
    '(C₆H₁₀O₅)ₙ',
    'organic',
    'polysaccharide',
    '#f2f3f5',
    0,
    'suspension',
    [],
    [
      'cellulose'
    ]
  ),


  /* =======================================================
     AMINO ACIDS / PROTEIN
  ======================================================= */

  C(
    'glycine',
    'Glycine solution',
    'NH₂CH₂COOH',
    'organic',
    'amino-acid',
    '#f8fbff',
    0,
    'solution',
    [],
    [
      'amino acid'
    ]
  ),


  C(
    'alanine',
    'Alanine solution',
    'CH₃CH(NH₂)COOH',
    'organic',
    'amino-acid',
    '#f8fbff',
    0,
    'solution',
    [],
    [
      'amino acid'
    ]
  ),


  C(
    'albumin',
    'Protein solution',
    'Protein',
    'organic',
    'protein',
    '#f4f0e8',
    0,
    'solution',
    [],
    [
      'protein',
      'biuret'
    ]
  )

]


export const CHEMICALS =
  Object.fromEntries(

    LIST.map(
      item => [
        item.id,
        item
      ]
    )

  )


export const CHEMICAL_ORDER =
  LIST.map(
    item =>
      item.id
  )


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


  return LIST.filter(
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


export function getChemicalFamilies() {

  return [
    ...new Set(
      LIST
        .map(
          item =>
            item.family
        )
        .filter(
          Boolean
        )
    )
  ]
    .sort(
      (
        a,
        b
      ) =>
        a.localeCompare(
          b
        )
    )

}