/* =========================================================
   CHEMLAB VIRTUAL LAB 3
   EXPANDED REACTION DATABASE
========================================================= */

export const REACTIONS = [

  /* =======================================================
     ACID BASE
  ======================================================= */

  {
    id:
      'hcl-naoh',

    category:
      'acid-base',

    reactants: [
      'hcl',
      'naoh'
    ],

    priority:
      20,

    equation:
      'HCl + NaOH → NaCl + H₂O',

    title:
      'Neutralization',

    description:
      'Acid and base neutralize each other.',

    effects: [
      {
        type:
          'flash'
      }
    ]
  },


  {
    id:
      'hcl-koh',

    category:
      'acid-base',

    reactants: [
      'hcl',
      'koh'
    ],

    priority:
      20,

    equation:
      'HCl + KOH → KCl + H₂O',

    title:
      'Neutralization',

    description:
      'Hydrochloric acid reacts with potassium hydroxide.',

    effects: [
      {
        type:
          'flash'
      }
    ]
  },


  {
    id:
      'h2so4-naoh',

    category:
      'acid-base',

    reactants: [
      'h2so4',
      'naoh'
    ],

    priority:
      20,

    equation:
      'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',

    title:
      'Neutralization',

    description:
      'Sulfuric acid reacts with sodium hydroxide.',

    effects: [
      {
        type:
          'flash'
      }
    ]
  },


  {
    id:
      'h3po4-naoh',

    category:
      'acid-base',

    reactants: [
      'h3po4',
      'naoh'
    ],

    priority:
      20,

    equation:
      'H₃PO₄ + 3NaOH → Na₃PO₄ + 3H₂O',

    title:
      'Neutralization',

    description:
      'Phosphoric acid is neutralized by sodium hydroxide.',

    effects: [
      {
        type:
          'flash'
      }
    ]
  },


  {
    id:
      'ethanoic-naoh',

    category:
      'acid-base',

    reactants: [
      'ethanoic',
      'naoh'
    ],

    priority:
      20,

    equation:
      'CH₃COOH + NaOH → CH₃COONa + H₂O',

    title:
      'Neutralization',

    description:
      'Ethanoic acid reacts with sodium hydroxide.',

    effects: [
      {
        type:
          'flash'
      }
    ]
  },


  /* =======================================================
     PRECIPITATION
  ======================================================= */

  {
    id:
      'cuso4-naoh',

    category:
      'precipitation',

    reactants: [
      'cuso4',
      'naoh'
    ],

    priority:
      30,

    equation:
      'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄',

    title:
      'Blue precipitate',

    description:
      'Copper(II) hydroxide precipitate forms.',

    effects: [
      {
        type:
          'precipitate',

        color:
          '#39a9ff'
      }
    ]
  },


  {
    id:
      'cucl2-naoh',

    category:
      'precipitation',

    reactants: [
      'cucl2',
      'naoh'
    ],

    priority:
      30,

    equation:
      'CuCl₂ + 2NaOH → Cu(OH)₂↓ + 2NaCl',

    title:
      'Blue precipitate',

    description:
      'Copper(II) hydroxide precipitate forms.',

    effects: [
      {
        type:
          'precipitate',

        color:
          '#39a9ff'
      }
    ]
  },


  {
    id:
      'fecl3-naoh',

    category:
      'precipitation',

    reactants: [
      'fecl3',
      'naoh'
    ],

    priority:
      30,

    equation:
      'FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl',

    title:
      'Brown precipitate',

    description:
      'Iron(III) hydroxide precipitate forms.',

    effects: [
      {
        type:
          'precipitate',

        color:
          '#a15431'
      }
    ]
  },


  {
    id:
      'feso4-naoh',

    category:
      'precipitation',

    reactants: [
      'feso4',
      'naoh'
    ],

    priority:
      30,

    equation:
      'FeSO₄ + 2NaOH → Fe(OH)₂↓ + Na₂SO₄',

    title:
      'Green precipitate',

    description:
      'Iron(II) hydroxide precipitate forms.',

    effects: [
      {
        type:
          'precipitate',

        color:
          '#7aa66d'
      }
    ]
  },


  {
    id:
      'mgcl2-naoh',

    category:
      'precipitation',

    reactants: [
      'mgcl2',
      'naoh'
    ],

    priority:
      30,

    equation:
      'MgCl₂ + 2NaOH → Mg(OH)₂↓ + 2NaCl',

    title:
      'White precipitate',

    description:
      'Magnesium hydroxide precipitate forms.',

    effects: [
      {
        type:
          'precipitate',

        color:
          '#f5f5f5'
      }
    ]
  },


  {
    id:
      'znso4-naoh',

    category:
      'precipitation',

    reactants: [
      'znso4',
      'naoh'
    ],

    priority:
      30,

    equation:
      'ZnSO₄ + 2NaOH → Zn(OH)₂↓ + Na₂SO₄',

    title:
      'White precipitate',

    description:
      'Zinc hydroxide precipitate forms.',

    effects: [
      {
        type:
          'precipitate',

        color:
          '#f5f5f5'
      }
    ]
  },


  {
    id:
      'alcl3-naoh',

    category:
      'precipitation',

    reactants: [
      'alcl3',
      'naoh'
    ],

    priority:
      30,

    equation:
      'AlCl₃ + 3NaOH → Al(OH)₃↓ + 3NaCl',

    title:
      'White precipitate',

    description:
      'Aluminium hydroxide precipitate forms.',

    effects: [
      {
        type:
          'precipitate',

        color:
          '#f3f3f3'
      }
    ]
  },


  {
    id:
      'agno3-nacl',

    category:
      'precipitation',

    reactants: [
      'agno3',
      'nacl'
    ],

    priority:
      30,

    equation:
      'AgNO₃ + NaCl → AgCl↓ + NaNO₃',

    title:
      'White precipitate',

    description:
      'Silver chloride precipitate forms.',

    effects: [
      {
        type:
          'precipitate',

        color:
          '#f5f5f5'
      }
    ]
  },


  {
    id:
      'agno3-kbr',

    category:
      'precipitation',

    reactants: [
      'agno3',
      'kbr'
    ],

    priority:
      30,

    equation:
      'AgNO₃ + KBr → AgBr↓ + KNO₃',

    title:
      'Cream precipitate',

    description:
      'Silver bromide precipitate forms.',

    effects: [
      {
        type:
          'precipitate',

        color:
          '#eadfb2'
      }
    ]
  },


  {
    id:
      'agno3-ki',

    category:
      'precipitation',

    reactants: [
      'agno3',
      'ki'
    ],

    priority:
      30,

    equation:
      'AgNO₃ + KI → AgI↓ + KNO₃',

    title:
      'Yellow precipitate',

    description:
      'Silver iodide precipitate forms.',

    effects: [
      {
        type:
          'precipitate',

        color:
          '#efd03f'
      }
    ]
  },


  {
    id:
      'pbno3-ki',

    category:
      'precipitation',

    reactants: [
      'pbno3',
      'ki'
    ],

    priority:
      30,

    equation:
      'Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃',

    title:
      'Yellow precipitate',

    description:
      'Lead(II) iodide precipitate forms.',

    effects: [
      {
        type:
          'precipitate',

        color:
          '#f4d03f'
      }
    ]
  },


  {
    id:
      'bacl2-na2so4',

    category:
      'precipitation',

    reactants: [
      'bacl2',
      'na2so4'
    ],

    priority:
      30,

    equation:
      'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl',

    title:
      'White precipitate',

    description:
      'Barium sulfate precipitate forms.',

    effects: [
      {
        type:
          'precipitate',

        color:
          '#f4f4f4'
      }
    ]
  },


  {
    id:
      'bano3-na2so4',

    category:
      'precipitation',

    reactants: [
      'bano3',
      'na2so4'
    ],

    priority:
      30,

    equation:
      'Ba(NO₃)₂ + Na₂SO₄ → BaSO₄↓ + 2NaNO₃',

    title:
      'White precipitate',

    description:
      'Barium sulfate precipitate forms.',

    effects: [
      {
        type:
          'precipitate',

        color:
          '#f4f4f4'
      }
    ]
  },


  {
    id:
      'cacl2-na2co3',

    category:
      'precipitation',

    reactants: [
      'cacl2',
      'na2co3'
    ],

    priority:
      30,

    equation:
      'CaCl₂ + Na₂CO₃ → CaCO₃↓ + 2NaCl',

    title:
      'White precipitate',

    description:
      'Calcium carbonate precipitate forms.',

    effects: [
      {
        type:
          'precipitate',

        color:
          '#f4f4f4'
      }
    ]
  },


  /* =======================================================
     GAS
  ======================================================= */

  {
    id:
      'na2co3-hcl',

    category:
      'gas',

    reactants: [
      'na2co3',
      'hcl'
    ],

    priority:
      35,

    equation:
      'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑',

    title:
      'Carbon dioxide released',

    description:
      'Effervescence appears as carbon dioxide is produced.',

    effects: [
      {
        type:
          'gas',

        amount:
          28
      }
    ]
  },


  {
    id:
      'nahco3-hcl',

    category:
      'gas',

    reactants: [
      'nahco3',
      'hcl'
    ],

    priority:
      35,

    equation:
      'NaHCO₃ + HCl → NaCl + H₂O + CO₂↑',

    title:
      'Carbon dioxide released',

    description:
      'Bubbles of carbon dioxide are produced.',

    effects: [
      {
        type:
          'gas',

        amount:
          30
      }
    ]
  },


  {
    id:
      'ethanoic-nahco3',

    category:
      'organic',

    reactants: [
      'ethanoic',
      'nahco3'
    ],

    priority:
      40,

    equation:
      'CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂↑',

    title:
      'Ethanoic acid test',

    description:
      'Carbon dioxide bubbles appear.',

    effects: [
      {
        type:
          'gas',

        amount:
          30
      }
    ]
  },


  {
    id:
      'nh4cl-naoh',

    category:
      'gas',

    reactants: [
      'nh4cl',
      'naoh'
    ],

    priority:
      40,

    conditions: {

      heating:
        true,

      minTemperature:
        45

    },

    equation:
      'NH₄Cl + NaOH → NH₃↑ + NaCl + H₂O',

    title:
      'Ammonia released',

    description:
      'Heating releases ammonia in the simulation.',

    effects: [
      {
        type:
          'gas',

        amount:
          22
      }
    ]
  },


  /* =======================================================
     COMPLEX
  ======================================================= */

  {
    id:
      'fecl3-kscn',

    category:
      'complex',

    reactants: [
      'fecl3',
      'kscn'
    ],

    priority:
      40,

    equation:
      'Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺',

    title:
      'Red complex',

    description:
      'A deep red iron(III) thiocyanate complex forms.',

    effects: [
      {
        type:
          'solutionColor',

        color:
          '#b71d3d'
      }
    ]
  },


  /* =======================================================
     STARCH
  ======================================================= */

  {
    id:
      'starch-iodine',

    category:
      'organic-test',

    reactants: [
      'starch',
      'iodine'
    ],

    priority:
      50,

    equation:
      'Starch + I₂ → starch–iodine complex',

    title:
      'Starch test',

    description:
      'A dark blue-violet color appears.',

    effects: [
      {
        type:
          'solutionColor',

        color:
          '#18204d'
      }
    ]
  },


  /* =======================================================
     UNSATURATION
  ======================================================= */

  {
    id:
      'ethene-bromine',

    category:
      'organic-test',

    reactants: [
      'ethene',
      'bromineWater'
    ],

    priority:
      50,

    equation:
      'C₂H₄ + Br₂ → C₂H₄Br₂',

    title:
      'Bromine water decolorized',

    description:
      'The orange-brown color disappears in the simulation.',

    effects: [
      {
        type:
          'solutionColor',

        color:
          '#f8fbff'
      }
    ]
  },


  {
    id:
      'ethyne-bromine',

    category:
      'organic-test',

    reactants: [
      'ethyne',
      'bromineWater'
    ],

    priority:
      50,

    equation:
      'C₂H₂ + Br₂ → addition product',

    title:
      'Bromine water decolorized',

    description:
      'The bromine-water color fades.',

    effects: [
      {
        type:
          'solutionColor',

        color:
          '#f8fbff'
      }
    ]
  },


  /* =======================================================
     GLUCOSE
  ======================================================= */

  {
    id:
      'glucose-cu-room',

    category:
      'organic-test',

    reactants: [
      'glucose',
      'cuso4',
      'naoh'
    ],

    priority:
      35,

    conditions: {

      maxTemperature:
        50

    },

    equation:
      'Glucose + Cu(OH)₂ → blue Cu(II) complex',

    title:
      'Deep blue complex',

    description:
      'Glucose forms a deep blue complex at room temperature.',

    effects: [

      {
        type:
          'removePrecipitate'
      },

      {
        type:
          'solutionColor',

        color:
          '#185adb'
      }

    ]
  },


  {
    id:
      'glucose-cu-hot',

    category:
      'organic-test',

    reactants: [
      'glucose',
      'cuso4',
      'naoh'
    ],

    priority:
      70,

    conditions: {

      heating:
        true,

      minTemperature:
        65

    },

    equation:
      'C₆H₁₂O₆ + 2Cu(OH)₂ → C₆H₁₂O₇ + Cu₂O↓ + 2H₂O',

    title:
      'Brick-red precipitate',

    description:
      'Heating produces copper(I) oxide.',

    effects: [
      {
        type:
          'precipitate',

        color:
          '#c85a32'
      }
    ]
  },


  {
    id:
      'fructose-cu-hot',

    category:
      'organic-test',

    reactants: [
      'fructose',
      'cuso4',
      'naoh'
    ],

    priority:
      70,

    conditions: {

      heating:
        true,

      minTemperature:
        65

    },

    equation:
      'Reducing sugar + Cu(OH)₂ → Cu₂O↓',

    title:
      'Brick-red precipitate',

    description:
      'Fructose gives a reducing-sugar response in the simulation.',

    effects: [
      {
        type:
          'precipitate',

        color:
          '#c85a32'
      }
    ]
  },


  /* =======================================================
     GLYCEROL
  ======================================================= */

  {
    id:
      'glycerol-cu',

    category:
      'organic-test',

    reactants: [
      'glycerol',
      'cuso4',
      'naoh'
    ],

    priority:
      50,

    equation:
      'Glycerol + Cu(OH)₂ → blue Cu(II) complex',

    title:
      'Glycerol test',

    description:
      'A deep blue solution forms.',

    effects: [

      {
        type:
          'removePrecipitate'
      },

      {
        type:
          'solutionColor',

        color:
          '#195ecf'
      }

    ]
  },


  /* =======================================================
     ESTERIFICATION
  ======================================================= */

  {
    id:
      'esterification',

    category:
      'organic',

    reactants: [
      'ethanol',
      'ethanoic',
      'h2so4'
    ],

    priority:
      80,

    conditions: {

      heating:
        true,

      minTemperature:
        55

    },

    equation:
      'CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O',

    title:
      'Esterification',

    description:
      'Ethyl ethanoate is formed in the simulation.',

    effects: [

      {
        type:
          'flash'
      },

      {
        type:
          'message',

        text:
          'Esterification reaction completed in the simulation.'
      }

    ]
  },


  /* =======================================================
     ALCOHOL OXIDATION
  ======================================================= */

  {
    id:
      'ethanol-dichromate',

    category:
      'organic-test',

    reactants: [
      'ethanol',
      'k2cr2o7',
      'h2so4'
    ],

    priority:
      70,

    conditions: {

      heating:
        true,

      minTemperature:
        50

    },

    equation:
      'Ethanol + [O] → ethanal + H₂O',

    title:
      'Dichromate color change',

    description:
      'The orange dichromate color changes toward green in the simulation.',

    effects: [
      {
        type:
          'solutionColor',

        color:
          '#5a9b62'
      }
    ]
  },


  {
    id:
      'ethanal-dichromate',

    category:
      'organic-test',

    reactants: [
      'ethanal',
      'k2cr2o7',
      'h2so4'
    ],

    priority:
      75,

    equation:
      'Ethanal + [O] → ethanoic acid',

    title:
      'Aldehyde oxidation',

    description:
      'The oxidizing reagent changes color in the simulation.',

    effects: [
      {
        type:
          'solutionColor',

        color:
          '#5a9b62'
      }
    ]
  },


  /* =======================================================
     PROTEIN
  ======================================================= */

  {
    id:
      'albumin-biuret',

    category:
      'organic-test',

    reactants: [
      'albumin',
      'cuso4',
      'naoh'
    ],

    priority:
      60,

    equation:
      'Protein + Cu²⁺ in alkaline medium → violet complex',

    title:
      'Biuret test',

    description:
      'A violet color appears for protein.',

    effects: [

      {
        type:
          'removePrecipitate'
      },

      {
        type:
          'solutionColor',

        color:
          '#7b4bb3'
      }

    ]
  }

]