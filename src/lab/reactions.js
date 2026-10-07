/* =========================================================
   CHEMLAB VIRTUAL LAB 3.1
   95-REACTION DATABASE
========================================================= */

const E = (
  type,
  data = {}
) => ({
  type,
  ...data
})


const R = (
  id,
  reactants,
  title,
  equation,
  description,
  effects,
  category = 'general',
  conditions = {},
  priority = 20
) => ({
  id,
  reactants,
  title,
  equation,
  description,
  effects,
  category,
  conditions,
  priority
})


export const REACTIONS = [

  /* =======================================================
     ACID BASE
  ======================================================= */

  R(
    'hcl-naoh',
    [
      'hcl',
      'naoh'
    ],
    'Neutralization',
    'HCl + NaOH → NaCl + H₂O',
    'Acid and base neutralize each other.',
    [
      E('flash')
    ],
    'acid-base'
  ),


  R(
    'hcl-koh',
    [
      'hcl',
      'koh'
    ],
    'Neutralization',
    'HCl + KOH → KCl + H₂O',
    'Hydrochloric acid reacts with potassium hydroxide.',
    [
      E('flash')
    ],
    'acid-base'
  ),


  R(
    'h2so4-naoh',
    [
      'h2so4',
      'naoh'
    ],
    'Neutralization',
    'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
    'Sulfuric acid reacts with sodium hydroxide.',
    [
      E('flash')
    ],
    'acid-base'
  ),


  R(
    'h2so4-koh',
    [
      'h2so4',
      'koh'
    ],
    'Neutralization',
    'H₂SO₄ + 2KOH → K₂SO₄ + 2H₂O',
    'Sulfuric acid reacts with potassium hydroxide.',
    [
      E('flash')
    ],
    'acid-base'
  ),


  R(
    'hno3-naoh',
    [
      'hno3',
      'naoh'
    ],
    'Neutralization',
    'HNO₃ + NaOH → NaNO₃ + H₂O',
    'Nitric acid reacts with sodium hydroxide.',
    [
      E('flash')
    ],
    'acid-base'
  ),


  R(
    'h3po4-naoh',
    [
      'h3po4',
      'naoh'
    ],
    'Neutralization',
    'H₃PO₄ + 3NaOH → Na₃PO₄ + 3H₂O',
    'Phosphoric acid is neutralized.',
    [
      E('flash')
    ],
    'acid-base'
  ),


  R(
    'methanoic-naoh',
    [
      'methanoic',
      'naoh'
    ],
    'Neutralization',
    'HCOOH + NaOH → HCOONa + H₂O',
    'Methanoic acid reacts with sodium hydroxide.',
    [
      E('flash')
    ],
    'acid-base'
  ),


  R(
    'ethanoic-naoh',
    [
      'ethanoic',
      'naoh'
    ],
    'Neutralization',
    'CH₃COOH + NaOH → CH₃COONa + H₂O',
    'Ethanoic acid reacts with sodium hydroxide.',
    [
      E('flash')
    ],
    'acid-base'
  ),


  R(
    'propanoic-naoh',
    [
      'propanoic',
      'naoh'
    ],
    'Neutralization',
    'C₂H₅COOH + NaOH → C₂H₅COONa + H₂O',
    'Propanoic acid reacts with sodium hydroxide.',
    [
      E('flash')
    ],
    'acid-base'
  ),


  R(
    'benzoic-naoh',
    [
      'benzoic',
      'naoh'
    ],
    'Neutralization',
    'C₆H₅COOH + NaOH → C₆H₅COONa + H₂O',
    'Benzoic acid reacts with sodium hydroxide.',
    [
      E('flash')
    ],
    'acid-base'
  ),


  R(
    'oxalic-naoh',
    [
      'oxalic',
      'naoh'
    ],
    'Neutralization',
    'H₂C₂O₄ + 2NaOH → Na₂C₂O₄ + 2H₂O',
    'Oxalic acid is neutralized.',
    [
      E('flash')
    ],
    'acid-base'
  ),


  R(
    'hcl-nh3',
    [
      'hcl',
      'nh3'
    ],
    'Ammonium salt formed',
    'HCl + NH₃ → NH₄Cl',
    'Ammonia neutralizes hydrochloric acid.',
    [
      E('flash')
    ],
    'acid-base',
    {},
    22
  ),


  /* =======================================================
     PRECIPITATION
  ======================================================= */

  R(
    'cuso4-naoh',
    [
      'cuso4',
      'naoh'
    ],
    'Blue precipitate',
    'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄',
    'Copper(II) hydroxide precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#39a9ff'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'cucl2-naoh',
    [
      'cucl2',
      'naoh'
    ],
    'Blue precipitate',
    'CuCl₂ + 2NaOH → Cu(OH)₂↓ + 2NaCl',
    'Copper(II) hydroxide precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#39a9ff'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'fecl3-naoh',
    [
      'fecl3',
      'naoh'
    ],
    'Brown precipitate',
    'FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl',
    'Iron(III) hydroxide precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#a15431'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'feso4-naoh',
    [
      'feso4',
      'naoh'
    ],
    'Green precipitate',
    'FeSO₄ + 2NaOH → Fe(OH)₂↓ + Na₂SO₄',
    'Iron(II) hydroxide precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#7aa66d'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'fecl2-naoh',
    [
      'fecl2',
      'naoh'
    ],
    'Green precipitate',
    'FeCl₂ + 2NaOH → Fe(OH)₂↓ + 2NaCl',
    'Iron(II) hydroxide precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#7aa66d'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'mgcl2-naoh',
    [
      'mgcl2',
      'naoh'
    ],
    'White precipitate',
    'MgCl₂ + 2NaOH → Mg(OH)₂↓ + 2NaCl',
    'Magnesium hydroxide precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#f4f4f4'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'znso4-naoh',
    [
      'znso4',
      'naoh'
    ],
    'White precipitate',
    'ZnSO₄ + 2NaOH → Zn(OH)₂↓ + Na₂SO₄',
    'Zinc hydroxide precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#f4f4f4'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'alcl3-naoh',
    [
      'alcl3',
      'naoh'
    ],
    'White precipitate',
    'AlCl₃ + 3NaOH → Al(OH)₃↓ + 3NaCl',
    'Aluminium hydroxide precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#f4f4f4'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'agno3-nacl',
    [
      'agno3',
      'nacl'
    ],
    'White precipitate',
    'AgNO₃ + NaCl → AgCl↓ + NaNO₃',
    'Silver chloride precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#f5f5f5'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'agno3-kcl',
    [
      'agno3',
      'kcl'
    ],
    'White precipitate',
    'AgNO₃ + KCl → AgCl↓ + KNO₃',
    'Silver chloride precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#f5f5f5'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'agno3-kbr',
    [
      'agno3',
      'kbr'
    ],
    'Cream precipitate',
    'AgNO₃ + KBr → AgBr↓ + KNO₃',
    'Silver bromide precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#e8ddb4'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'agno3-ki',
    [
      'agno3',
      'ki'
    ],
    'Yellow precipitate',
    'AgNO₃ + KI → AgI↓ + KNO₃',
    'Silver iodide precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#efd03f'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'pbno3-ki',
    [
      'pbno3',
      'ki'
    ],
    'Yellow precipitate',
    'Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃',
    'Lead(II) iodide precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#f2cf35'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'bacl2-na2so4',
    [
      'bacl2',
      'na2so4'
    ],
    'White precipitate',
    'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl',
    'Barium sulfate precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#f4f4f4'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'bano3-na2so4',
    [
      'bano3',
      'na2so4'
    ],
    'White precipitate',
    'Ba(NO₃)₂ + Na₂SO₄ → BaSO₄↓ + 2NaNO₃',
    'Barium sulfate precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#f4f4f4'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'pbno3-na2so4',
    [
      'pbno3',
      'na2so4'
    ],
    'White precipitate',
    'Pb(NO₃)₂ + Na₂SO₄ → PbSO₄↓ + 2NaNO₃',
    'Lead(II) sulfate precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#f4f4f4'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'cacl2-na2co3',
    [
      'cacl2',
      'na2co3'
    ],
    'White precipitate',
    'CaCl₂ + Na₂CO₃ → CaCO₃↓ + 2NaCl',
    'Calcium carbonate precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#f4f4f4'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'mgcl2-na2co3',
    [
      'mgcl2',
      'na2co3'
    ],
    'White precipitate',
    'MgCl₂ + Na₂CO₃ → MgCO₃↓ + 2NaCl',
    'Magnesium carbonate precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#f4f4f4'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'bacl2-na2co3',
    [
      'bacl2',
      'na2co3'
    ],
    'White precipitate',
    'BaCl₂ + Na₂CO₃ → BaCO₃↓ + 2NaCl',
    'Barium carbonate precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#f4f4f4'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'cuso4-na2co3',
    [
      'cuso4',
      'na2co3'
    ],
    'Blue-green precipitate',
    'CuSO₄ + Na₂CO₃ → CuCO₃↓ + Na₂SO₄',
    'Copper(II) carbonate precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#67a889'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'agno3-na2co3',
    [
      'agno3',
      'na2co3'
    ],
    'Pale yellow precipitate',
    '2AgNO₃ + Na₂CO₃ → Ag₂CO₃↓ + 2NaNO₃',
    'Silver carbonate precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#e7d88d'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'cacl2-na3po4',
    [
      'cacl2',
      'na3po4'
    ],
    'White precipitate',
    '3CaCl₂ + 2Na₃PO₄ → Ca₃(PO₄)₂↓ + 6NaCl',
    'Calcium phosphate precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#f4f4f4'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'fecl3-na3po4',
    [
      'fecl3',
      'na3po4'
    ],
    'Pale precipitate',
    'FeCl₃ + Na₃PO₄ → FePO₄↓ + 3NaCl',
    'Iron(III) phosphate precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#e8d6a8'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'cuso4-na2s',
    [
      'cuso4',
      'na2s'
    ],
    'Black precipitate',
    'CuSO₄ + Na₂S → CuS↓ + Na₂SO₄',
    'Copper(II) sulfide precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#242424'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'fecl2-na2s',
    [
      'fecl2',
      'na2s'
    ],
    'Black precipitate',
    'FeCl₂ + Na₂S → FeS↓ + 2NaCl',
    'Iron(II) sulfide precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#303030'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'agno3-na2s',
    [
      'agno3',
      'na2s'
    ],
    'Black precipitate',
    '2AgNO₃ + Na₂S → Ag₂S↓ + 2NaNO₃',
    'Silver sulfide precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#222222'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  /* =======================================================
     GAS
  ======================================================= */

  R(
    'na2co3-hcl',
    [
      'na2co3',
      'hcl'
    ],
    'Carbon dioxide released',
    'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑',
    'Effervescence appears.',
    [
      E(
        'gas',
        {
          amount:
            28
        }
      )
    ],
    'gas',
    {},
    40
  ),


  R(
    'nahco3-hcl',
    [
      'nahco3',
      'hcl'
    ],
    'Carbon dioxide released',
    'NaHCO₃ + HCl → NaCl + H₂O + CO₂↑',
    'Carbon dioxide bubbles appear.',
    [
      E(
        'gas',
        {
          amount:
            30
        }
      )
    ],
    'gas',
    {},
    40
  ),


  R(
    'caco3-hcl',
    [
      'caco3',
      'hcl'
    ],
    'Carbon dioxide released',
    'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑',
    'Carbon dioxide bubbles appear.',
    [
      E(
        'gas',
        {
          amount:
            28
        }
      )
    ],
    'gas',
    {},
    40
  ),


  R(
    'mgco3-hcl',
    [
      'mgco3',
      'hcl'
    ],
    'Carbon dioxide released',
    'MgCO₃ + 2HCl → MgCl₂ + H₂O + CO₂↑',
    'Carbon dioxide bubbles appear.',
    [
      E(
        'gas',
        {
          amount:
            28
        }
      )
    ],
    'gas',
    {},
    40
  ),


  R(
    'na2so3-hcl',
    [
      'na2so3',
      'hcl'
    ],
    'Sulfur dioxide released',
    'Na₂SO₃ + 2HCl → 2NaCl + H₂O + SO₂↑',
    'Gas bubbles are produced in the simulation.',
    [
      E(
        'gas',
        {
          amount:
            24
        }
      )
    ],
    'gas',
    {},
    40
  ),


  R(
    'nh4cl-naoh',
    [
      'nh4cl',
      'naoh'
    ],
    'Ammonia released',
    'NH₄Cl + NaOH → NH₃↑ + NaCl + H₂O',
    'Heating releases ammonia in the simulation.',
    [
      E(
        'gas',
        {
          amount:
            24
        }
      )
    ],
    'gas',
    {
      heating:
        true,

      minTemperature:
        45
    },
    55
  ),


  R(
    'ethanoic-nahco3',
    [
      'ethanoic',
      'nahco3'
    ],
    'Carbon dioxide released',
    'CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂↑',
    'The carboxylic acid gives effervescence.',
    [
      E(
        'gas',
        {
          amount:
            30
        }
      )
    ],
    'organic-test',
    {},
    50
  ),


  R(
    'propanoic-nahco3',
    [
      'propanoic',
      'nahco3'
    ],
    'Carbon dioxide released',
    'C₂H₅COOH + NaHCO₃ → C₂H₅COONa + H₂O + CO₂↑',
    'The carboxylic acid gives effervescence.',
    [
      E(
        'gas',
        {
          amount:
            30
        }
      )
    ],
    'organic-test',
    {},
    50
  ),


  R(
    'methanoic-nahco3',
    [
      'methanoic',
      'nahco3'
    ],
    'Carbon dioxide released',
    'HCOOH + NaHCO₃ → HCOONa + H₂O + CO₂↑',
    'The carboxylic acid gives effervescence.',
    [
      E(
        'gas',
        {
          amount:
            30
        }
      )
    ],
    'organic-test',
    {},
    50
  ),


  R(
    'benzoic-nahco3',
    [
      'benzoic',
      'nahco3'
    ],
    'Carbon dioxide released',
    'C₆H₅COOH + NaHCO₃ → C₆H₅COONa + H₂O + CO₂↑',
    'The carboxylic acid gives effervescence.',
    [
      E(
        'gas',
        {
          amount:
            24
        }
      )
    ],
    'organic-test',
    {},
    50
  ),


  R(
    'h2o2-heat',
    [
      'h2o2'
    ],
    'Oxygen released',
    '2H₂O₂ → 2H₂O + O₂↑',
    'Hydrogen peroxide decomposes faster when heated in the simulation.',
    [
      E(
        'gas',
        {
          amount:
            24
        }
      )
    ],
    'decomposition',
    {
      heating:
        true,

      minTemperature:
        55
    },
    45
  ),


  /* =======================================================
     COMPLEX / COLOR TESTS
  ======================================================= */

  R(
    'fecl3-kscn',
    [
      'fecl3',
      'kscn'
    ],
    'Deep red complex',
    'Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺',
    'A deep red complex forms.',
    [
      E(
        'solutionColor',
        {
          color:
            '#b71d3d'
        }
      )
    ],
    'complex',
    {},
    60
  ),


  R(
    'cuso4-nh3',
    [
      'cuso4',
      'nh3'
    ],
    'Deep blue complex',
    'Cu²⁺ + NH₃ → copper-ammonia complex',
    'The solution becomes deep blue.',
    [
      E(
        'removePrecipitate'
      ),

      E(
        'solutionColor',
        {
          color:
            '#214fc6'
        }
      )
    ],
    'complex',
    {},
    60
  ),


  R(
    'cucl2-nh3',
    [
      'cucl2',
      'nh3'
    ],
    'Deep blue complex',
    'Cu²⁺ + NH₃ → copper-ammonia complex',
    'The solution becomes deep blue.',
    [
      E(
        'removePrecipitate'
      ),

      E(
        'solutionColor',
        {
          color:
            '#214fc6'
        }
      )
    ],
    'complex',
    {},
    60
  ),


  R(
    'phenol-fecl3',
    [
      'phenol',
      'fecl3'
    ],
    'Violet complex',
    'Phenol + Fe³⁺ → violet complex',
    'A violet coloration appears.',
    [
      E(
        'solutionColor',
        {
          color:
            '#7e4ca7'
        }
      )
    ],
    'organic-test',
    {},
    65
  ),


  R(
    'starch-iodine',
    [
      'starch',
      'iodine'
    ],
    'Starch test',
    'Starch + I₂ → starch–iodine complex',
    'A dark blue-violet color appears.',
    [
      E(
        'solutionColor',
        {
          color:
            '#18204d'
        }
      )
    ],
    'organic-test',
    {},
    70
  ),


  R(
    'iodine-thiosulfate',
    [
      'iodine',
      'na2s2o3'
    ],
    'Iodine decolorized',
    'I₂ + 2S₂O₃²⁻ → 2I⁻ + S₄O₆²⁻',
    'The brown iodine color disappears.',
    [
      E(
        'solutionColor',
        {
          color:
            '#f8fbff'
        }
      )
    ],
    'redox',
    {},
    65
  ),


  R(
    'ethene-bromine',
    [
      'ethene',
      'bromineWater'
    ],
    'Bromine water decolorized',
    'C₂H₄ + Br₂ → C₂H₄Br₂',
    'The orange-brown color disappears.',
    [
      E(
        'solutionColor',
        {
          color:
            '#f8fbff'
        }
      )
    ],
    'organic-test',
    {},
    70
  ),


  R(
    'propene-bromine',
    [
      'propene',
      'bromineWater'
    ],
    'Bromine water decolorized',
    'C₃H₆ + Br₂ → C₃H₆Br₂',
    'The orange-brown color disappears.',
    [
      E(
        'solutionColor',
        {
          color:
            '#f8fbff'
        }
      )
    ],
    'organic-test',
    {},
    70
  ),


  R(
    'ethyne-bromine',
    [
      'ethyne',
      'bromineWater'
    ],
    'Bromine water decolorized',
    'C₂H₂ + Br₂ → addition product',
    'The bromine-water color fades.',
    [
      E(
        'solutionColor',
        {
          color:
            '#f8fbff'
        }
      )
    ],
    'organic-test',
    {},
    70
  ),


  R(
    'phenol-bromine',
    [
      'phenol',
      'bromineWater'
    ],
    'Bromine water decolorized',
    'C₆H₅OH + 3Br₂ → C₆H₂Br₃OH↓ + 3HBr',
    'Bromine water is decolorized and a pale precipitate appears.',
    [
      E(
        'solutionColor',
        {
          color:
            '#f8fbff'
        }
      ),

      E(
        'precipitate',
        {
          color:
            '#f2f2e8'
        }
      )
    ],
    'organic-test',
    {},
    75
  ),


  R(
    'ethene-kmno4',
    [
      'ethene',
      'kmno4'
    ],
    'Permanganate test',
    'Alkene + KMnO₄ → oxidized products',
    'The purple color fades and brown material appears in the simulation.',
    [
      E(
        'solutionColor',
        {
          color:
            '#8b6b48'
        }
      ),

      E(
        'precipitate',
        {
          color:
            '#795b3b'
        }
      )
    ],
    'organic-test',
    {},
    65
  ),


  R(
    'propene-kmno4',
    [
      'propene',
      'kmno4'
    ],
    'Permanganate test',
    'Alkene + KMnO₄ → oxidized products',
    'The purple color fades and brown material appears.',
    [
      E(
        'solutionColor',
        {
          color:
            '#8b6b48'
        }
      ),

      E(
        'precipitate',
        {
          color:
            '#795b3b'
        }
      )
    ],
    'organic-test',
    {},
    65
  ),


  /* =======================================================
     CARBOHYDRATES / POLYOLS / PROTEIN
  ======================================================= */

  R(
    'glucose-cu-room',
    [
      'glucose',
      'cuso4',
      'naoh'
    ],
    'Deep blue complex',
    'Glucose + Cu(OH)₂ → blue Cu(II) complex',
    'A deep blue complex forms at room temperature.',
    [
      E(
        'removePrecipitate'
      ),

      E(
        'solutionColor',
        {
          color:
            '#185adb'
        }
      )
    ],
    'organic-test',
    {
      maxTemperature:
        50
    },
    58
  ),


  R(
    'glucose-cu-hot',
    [
      'glucose',
      'cuso4',
      'naoh'
    ],
    'Brick-red precipitate',
    'Reducing sugar + Cu(OH)₂ → Cu₂O↓',
    'Heating produces a brick-red copper(I) oxide precipitate.',
    [
      E(
        'precipitate',
        {
          color:
            '#c85a32'
        }
      )
    ],
    'organic-test',
    {
      heating:
        true,

      minTemperature:
        65
    },
    85
  ),


  R(
    'fructose-cu-room',
    [
      'fructose',
      'cuso4',
      'naoh'
    ],
    'Deep blue complex',
    'Fructose + Cu(OH)₂ → blue Cu(II) complex',
    'A deep blue complex forms at room temperature.',
    [
      E(
        'removePrecipitate'
      ),

      E(
        'solutionColor',
        {
          color:
            '#185adb'
        }
      )
    ],
    'organic-test',
    {
      maxTemperature:
        50
    },
    58
  ),


  R(
    'fructose-cu-hot',
    [
      'fructose',
      'cuso4',
      'naoh'
    ],
    'Brick-red precipitate',
    'Reducing sugar + Cu(OH)₂ → Cu₂O↓',
    'Heating produces a brick-red copper(I) oxide precipitate.',
    [
      E(
        'precipitate',
        {
          color:
            '#c85a32'
        }
      )
    ],
    'organic-test',
    {
      heating:
        true,

      minTemperature:
        65
    },
    85
  ),


  R(
    'maltose-cu-room',
    [
      'maltose',
      'cuso4',
      'naoh'
    ],
    'Deep blue complex',
    'Maltose + Cu(OH)₂ → blue Cu(II) complex',
    'A deep blue complex forms at room temperature.',
    [
      E(
        'removePrecipitate'
      ),

      E(
        'solutionColor',
        {
          color:
            '#185adb'
        }
      )
    ],
    'organic-test',
    {
      maxTemperature:
        50
    },
    58
  ),


  R(
    'maltose-cu-hot',
    [
      'maltose',
      'cuso4',
      'naoh'
    ],
    'Brick-red precipitate',
    'Reducing sugar + Cu(OH)₂ → Cu₂O↓',
    'Heating produces a brick-red copper(I) oxide precipitate.',
    [
      E(
        'precipitate',
        {
          color:
            '#c85a32'
        }
      )
    ],
    'organic-test',
    {
      heating:
        true,

      minTemperature:
        65
    },
    85
  ),


  R(
    'lactose-cu-room',
    [
      'lactose',
      'cuso4',
      'naoh'
    ],
    'Deep blue complex',
    'Lactose + Cu(OH)₂ → blue Cu(II) complex',
    'A deep blue complex forms at room temperature.',
    [
      E(
        'removePrecipitate'
      ),

      E(
        'solutionColor',
        {
          color:
            '#185adb'
        }
      )
    ],
    'organic-test',
    {
      maxTemperature:
        50
    },
    58
  ),


  R(
    'lactose-cu-hot',
    [
      'lactose',
      'cuso4',
      'naoh'
    ],
    'Brick-red precipitate',
    'Reducing sugar + Cu(OH)₂ → Cu₂O↓',
    'Heating produces a brick-red copper(I) oxide precipitate.',
    [
      E(
        'precipitate',
        {
          color:
            '#c85a32'
        }
      )
    ],
    'organic-test',
    {
      heating:
        true,

      minTemperature:
        65
    },
    85
  ),


  R(
    'glycerol-cu',
    [
      'glycerol',
      'cuso4',
      'naoh'
    ],
    'Glycerol test',
    'Glycerol + Cu(OH)₂ → blue Cu(II) complex',
    'A deep blue solution forms.',
    [
      E(
        'removePrecipitate'
      ),

      E(
        'solutionColor',
        {
          color:
            '#195ecf'
        }
      )
    ],
    'organic-test',
    {},
    72
  ),


  R(
    'glycol-cu',
    [
      'ethyleneGlycol',
      'cuso4',
      'naoh'
    ],
    'Polyol test',
    'Ethane-1,2-diol + Cu(OH)₂ → blue Cu(II) complex',
    'A deep blue solution forms.',
    [
      E(
        'removePrecipitate'
      ),

      E(
        'solutionColor',
        {
          color:
            '#195ecf'
        }
      )
    ],
    'organic-test',
    {},
    72
  ),


  R(
    'albumin-biuret',
    [
      'albumin',
      'cuso4',
      'naoh'
    ],
    'Biuret test',
    'Protein + Cu²⁺ in alkaline medium → violet complex',
    'A violet color appears.',
    [
      E(
        'removePrecipitate'
      ),

      E(
        'solutionColor',
        {
          color:
            '#7b4bb3'
        }
      )
    ],
    'organic-test',
    {},
    80
  ),


  /* =======================================================
     OXIDATION / REDOX
  ======================================================= */

  R(
    'ethanol-dichromate',
    [
      'ethanol',
      'k2cr2o7',
      'h2so4'
    ],
    'Alcohol oxidation',
    'C₂H₅OH + [O] → CH₃CHO + H₂O',
    'Orange dichromate changes toward green in the simulation.',
    [
      E(
        'solutionColor',
        {
          color:
            '#5a9b62'
        }
      )
    ],
    'organic-test',
    {
      heating:
        true,

      minTemperature:
        50
    },
    80
  ),


  R(
    'propan1ol-dichromate',
    [
      'propan1ol',
      'k2cr2o7',
      'h2so4'
    ],
    'Alcohol oxidation',
    'CH₃CH₂CH₂OH + [O] → CH₃CH₂CHO + H₂O',
    'The oxidizing reagent changes color.',
    [
      E(
        'solutionColor',
        {
          color:
            '#5a9b62'
        }
      )
    ],
    'organic-test',
    {
      heating:
        true,

      minTemperature:
        50
    },
    80
  ),


  R(
    'propan2ol-dichromate',
    [
      'propan2ol',
      'k2cr2o7',
      'h2so4'
    ],
    'Alcohol oxidation',
    'CH₃CHOHCH₃ + [O] → CH₃COCH₃ + H₂O',
    'The oxidizing reagent changes color.',
    [
      E(
        'solutionColor',
        {
          color:
            '#5a9b62'
        }
      )
    ],
    'organic-test',
    {
      heating:
        true,

      minTemperature:
        50
    },
    80
  ),


  R(
    'methanal-dichromate',
    [
      'methanal',
      'k2cr2o7',
      'h2so4'
    ],
    'Aldehyde oxidation',
    'HCHO + [O] → HCOOH',
    'The oxidizing reagent changes color.',
    [
      E(
        'solutionColor',
        {
          color:
            '#5a9b62'
        }
      )
    ],
    'organic-test',
    {},
    78
  ),


  R(
    'ethanal-dichromate',
    [
      'ethanal',
      'k2cr2o7',
      'h2so4'
    ],
    'Aldehyde oxidation',
    'CH₃CHO + [O] → CH₃COOH',
    'The oxidizing reagent changes color.',
    [
      E(
        'solutionColor',
        {
          color:
            '#5a9b62'
        }
      )
    ],
    'organic-test',
    {},
    78
  ),


  R(
    'propanal-dichromate',
    [
      'propanal',
      'k2cr2o7',
      'h2so4'
    ],
    'Aldehyde oxidation',
    'C₂H₅CHO + [O] → C₂H₅COOH',
    'The oxidizing reagent changes color.',
    [
      E(
        'solutionColor',
        {
          color:
            '#5a9b62'
        }
      )
    ],
    'organic-test',
    {},
    78
  ),


  R(
    'h2o2-kmno4-acid',
    [
      'h2o2',
      'kmno4',
      'h2so4'
    ],
    'Permanganate decolorized',
    'H₂O₂ + MnO₄⁻ + H⁺ → O₂ + Mn²⁺ + H₂O',
    'The purple permanganate color disappears and gas is produced.',
    [
      E(
        'solutionColor',
        {
          color:
            '#f8fbff'
        }
      ),

      E(
        'gas',
        {
          amount:
            22
        }
      )
    ],
    'redox',
    {},
    82
  ),


  R(
    'h2o2-ki-acid',
    [
      'h2o2',
      'ki',
      'h2so4'
    ],
    'Iodine formed',
    'H₂O₂ + 2I⁻ + 2H⁺ → I₂ + 2H₂O',
    'The mixture develops an iodine-like brown color.',
    [
      E(
        'solutionColor',
        {
          color:
            '#8d5b32'
        }
      )
    ],
    'redox',
    {},
    78
  ),


  R(
    'feso4-kmno4-acid',
    [
      'feso4',
      'kmno4',
      'h2so4'
    ],
    'Redox color change',
    'Fe²⁺ + MnO₄⁻ + H⁺ → Fe³⁺ + Mn²⁺ + H₂O',
    'The purple permanganate color fades.',
    [
      E(
        'solutionColor',
        {
          color:
            '#d8b66a'
        }
      )
    ],
    'redox',
    {},
    80
  ),


  /* =======================================================
     ESTERIFICATION / HYDROLYSIS
  ======================================================= */

  R(
    'ester-ethanol-ethanoic',
    [
      'ethanol',
      'ethanoic',
      'h2so4'
    ],
    'Esterification',
    'CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O',
    'Ethyl ethanoate is formed in the simulation.',
    [
      E(
        'flash'
      ),

      E(
        'message',
        {
          text:
            'Esterification simulated.'
        }
      )
    ],
    'organic',
    {
      heating:
        true,

      minTemperature:
        55
    },
    90
  ),


  R(
    'ester-methanol-ethanoic',
    [
      'methanol',
      'ethanoic',
      'h2so4'
    ],
    'Esterification',
    'CH₃COOH + CH₃OH ⇌ CH₃COOCH₃ + H₂O',
    'Methyl ethanoate is formed in the simulation.',
    [
      E(
        'flash'
      )
    ],
    'organic',
    {
      heating:
        true,

      minTemperature:
        55
    },
    90
  ),


  R(
    'ester-ethanol-methanoic',
    [
      'ethanol',
      'methanoic',
      'h2so4'
    ],
    'Esterification',
    'HCOOH + C₂H₅OH ⇌ HCOOC₂H₅ + H₂O',
    'Ethyl methanoate is formed in the simulation.',
    [
      E(
        'flash'
      )
    ],
    'organic',
    {
      heating:
        true,

      minTemperature:
        55
    },
    90
  ),


  R(
    'ethylEthanoate-naoh',
    [
      'ethylEthanoate',
      'naoh'
    ],
    'Ester hydrolysis',
    'CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH',
    'Alkaline hydrolysis is simulated.',
    [
      E(
        'flash'
      )
    ],
    'organic',
    {
      heating:
        true,

      minTemperature:
        55
    },
    75
  ),


  R(
    'methylEthanoate-naoh',
    [
      'methylEthanoate',
      'naoh'
    ],
    'Ester hydrolysis',
    'CH₃COOCH₃ + NaOH → CH₃COONa + CH₃OH',
    'Alkaline hydrolysis is simulated.',
    [
      E(
        'flash'
      )
    ],
    'organic',
    {
      heating:
        true,

      minTemperature:
        55
    },
    75
  ),


  R(
    'ethylFormate-naoh',
    [
      'ethylFormate',
      'naoh'
    ],
    'Ester hydrolysis',
    'HCOOC₂H₅ + NaOH → HCOONa + C₂H₅OH',
    'Alkaline hydrolysis is simulated.',
    [
      E(
        'flash'
      )
    ],
    'organic',
    {
      heating:
        true,

      minTemperature:
        55
    },
    75
  ),


  R(
    'sucrose-hcl-heat',
    [
      'sucrose',
      'hcl'
    ],
    'Sucrose hydrolysis',
    'C₁₂H₂₂O₁₁ + H₂O → glucose + fructose',
    'Acid-catalyzed hydrolysis is simulated.',
    [
      E(
        'message',
        {
          text:
            'Sucrose hydrolysis simulated.'
        }
      )
    ],
    'organic',
    {
      heating:
        true,

      minTemperature:
        60
    },
    60
  ),


  R(
    'maltose-hcl-heat',
    [
      'maltose',
      'hcl'
    ],
    'Maltose hydrolysis',
    'C₁₂H₂₂O₁₁ + H₂O → 2 glucose',
    'Acid-catalyzed hydrolysis is simulated.',
    [
      E(
        'message',
        {
          text:
            'Maltose hydrolysis simulated.'
        }
      )
    ],
    'organic',
    {
      heating:
        true,

      minTemperature:
        60
    },
    60
  ),


  R(
    'phenol-naoh',
    [
      'phenol',
      'naoh'
    ],
    'Phenol reacts with base',
    'C₆H₅OH + NaOH → C₆H₅ONa + H₂O',
    'Phenol reacts with sodium hydroxide.',
    [
      E(
        'flash'
      )
    ],
    'organic',
    {},
    45
  ),


  /* =======================================================
     ADDITIONAL
  ======================================================= */

  R(
    'oxalic-cacl2',
    [
      'oxalic',
      'cacl2'
    ],
    'White precipitate',
    'H₂C₂O₄ + CaCl₂ → CaC₂O₄↓ + 2HCl',
    'Calcium oxalate precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#f4f4f4'
        }
      )
    ],
    'precipitation',
    {},
    55
  ),


  R(
    'fe2so43-naoh',
    [
      'fe2so43',
      'naoh'
    ],
    'Brown precipitate',
    'Fe₂(SO₄)₃ + 6NaOH → 2Fe(OH)₃↓ + 3Na₂SO₄',
    'Iron(III) hydroxide precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#a15431'
        }
      )
    ],
    'precipitation',
    {},
    35
  ),


  R(
    'baoh2-h2so4',
    [
      'baoh2',
      'h2so4'
    ],
    'White precipitate and neutralization',
    'Ba(OH)₂ + H₂SO₄ → BaSO₄↓ + 2H₂O',
    'Barium sulfate precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#f4f4f4'
        }
      ),

      E(
        'flash'
      )
    ],
    'acid-base',
    {},
    60
  ),


  R(
    'cuso4-baoh2',
    [
      'cuso4',
      'baoh2'
    ],
    'Two precipitates simulated',
    'CuSO₄ + Ba(OH)₂ → Cu(OH)₂↓ + BaSO₄↓',
    'A blue/white precipitate mixture is simulated.',
    [
      E(
        'precipitate',
        {
          color:
            '#78bde0'
        }
      )
    ],
    'precipitation',
    {},
    55
  ),


  R(
    'agno3-kscn',
    [
      'agno3',
      'kscn'
    ],
    'White precipitate',
    'AgNO₃ + KSCN → AgSCN↓ + KNO₃',
    'Silver thiocyanate precipitate forms.',
    [
      E(
        'precipitate',
        {
          color:
            '#f1f1ed'
        }
      )
    ],
    'precipitation',
    {},
    45
  )

]