
import { checkEquation } from '../../chem/equation.js'
import { stockConcentration } from '../concentrations.js'
import { AMPHOTERIC, NOT_SINGLE_STEP } from '../stoichiometry.js'
import { PRECIPITATES, solidsOf } from './precipitates.js'
import { simulateLab } from './simulate.js'
import { stepwiseSystemFor } from './stepwise.js'

export const SUPPORT = Object.freeze({
  QUANTITATIVE: 'VERIFIED_QUANTITATIVE',
  QUALITATIVE: 'VERIFIED_QUALITATIVE',
  CONDITIONAL: 'CONDITIONAL',
  UNSUPPORTED: 'UNSUPPORTED',
  INVALID: 'INVALID'
})

export const EFFECT_TYPES = new Set(['precipitate', 'removePrecipitate', 'gas', 'foam', 'solutionColor', 'message'])

export const WORD_EQUATIONS = new Set([
  'phenol-fecl3', 'starch-iodine', 'maltose-cu-hot', 'lactose-cu-hot', 'albumin-biuret', 'triglycerideOil-naoh'
])

const REDOX = new Set([
  'h2o2-kmno4-acid', 'h2o2-ki-acid', 'feso4-kmno4-acid', 'iodine-thiosulfate', 'h2o2-heat',
  'ethene-kmno4', 'propene-kmno4',
  'ethanol-dichromate', 'propan1ol-dichromate', 'propan2ol-dichromate', 'methanal-dichromate', 'ethanal-dichromate', 'propanal-dichromate',
  'glucose-cu-hot', 'fructose-cu-hot', 'maltose-cu-hot', 'lactose-cu-hot'
])

const COMPLEX = new Set([
  'fecl3-kscn', 'cuso4-nh3', 'cucl2-nh3', 'phenol-fecl3', 'starch-iodine', 'albumin-biuret',
  'glucose-cu-room', 'fructose-cu-room', 'maltose-cu-room', 'lactose-cu-room', 'glycerol-cu', 'glycol-cu'
])

const HYDROLYSIS = new Set([
  'ethylEthanoate-naoh', 'methylEthanoate-naoh', 'ethylFormate-naoh', 'triglycerideOil-naoh', 'sucrose-hcl-heat', 'maltose-hcl-heat'
])

const ADDITION_SUBSTITUTION = new Set(['ethene-bromine', 'propene-bromine', 'ethyne-bromine', 'phenol-bromine'])

export const NOTES = {
  'cuso4-nh3': 'Cần NH₃ dư: ít NH₃ chỉ tạo Cu(OH)₂ xanh lam, NH₃ dư mới hòa tan thành phức [Cu(NH₃)₄]²⁺ xanh thẫm. Catalog chưa có nồng độ NH₃ nên mô phỏng hiện màu phức ngay.',
  'cucl2-nh3': 'Cần NH₃ dư: ít NH₃ chỉ tạo Cu(OH)₂ xanh lam, NH₃ dư mới hòa tan thành phức [Cu(NH₃)₄]²⁺ xanh thẫm. Catalog chưa có nồng độ NH₃ nên mô phỏng hiện màu phức ngay.',
  'h2o2-heat': 'H₂O₂ phân hủy chậm khi đun; trong thực hành thường dùng xúc tác MnO₂. Lượng O₂ không được tính.',
  'nh4cl-naoh': 'NH₃ tan tốt trong nước: cần đun nóng để khí thoát ra. Mô hình coi toàn bộ NH₃ thoát khỏi cốc.',
  'fecl3-kscn': 'Cân bằng tạo phức; màu đỏ máu đậm nhạt theo nồng độ, không tính được khi chưa có hằng số cân bằng đã kiểm chứng.',
  'glucose-cu-room': 'Cần Cu(OH)₂ mới điều chế trong NaOH dư.',
  'fructose-cu-room': 'Cần Cu(OH)₂ mới điều chế trong NaOH dư.',
  'maltose-cu-room': 'Cần Cu(OH)₂ mới điều chế trong NaOH dư.',
  'lactose-cu-room': 'Cần Cu(OH)₂ mới điều chế trong NaOH dư.',
  'glycerol-cu': 'Cần Cu(OH)₂ mới điều chế trong NaOH.',
  'glycol-cu': 'Cần Cu(OH)₂ mới điều chế trong NaOH.',
  'albumin-biuret': 'Phản ứng màu biuret trong môi trường kiềm.',
  'triglycerideOil-naoh': 'Bọt minh họa xà phòng tạo thành; lượng chất không tính.',
  'ester-ethanol-ethanoic': 'Thuận nghịch, cần H₂SO₄ đặc làm xúc tác và đun nóng.',
  'ester-methanol-ethanoic': 'Thuận nghịch, cần H₂SO₄ đặc làm xúc tác và đun nóng.',
  'ester-ethanol-methanoic': 'Thuận nghịch, cần H₂SO₄ đặc làm xúc tác và đun nóng.'
}

function conditionText(reaction) {
  const c = reaction.conditions || {}
  return [
    c.heating && 'đun nóng',
    c.minTemperature !== undefined && `≥ ${c.minTemperature} °C`,
    c.maxTemperature !== undefined && `≤ ${c.maxTemperature} °C`,
    c.minPH !== undefined && `pH ≥ ${c.minPH}`,
    c.maxPH !== undefined && `pH ≤ ${c.maxPH}`,
    c.light && 'chiếu sáng',
    c.catalyst && `xúc tác ${[].concat(c.catalyst).join(', ')}`
  ].filter(Boolean)
}

export function validateReaction(reaction, reagents) {
  const problems = []
  for (const id of reaction.reactants) if (!reagents[id]) problems.push(`unknown reagent ${id}`)
  for (const effect of reaction.effects || []) if (!EFFECT_TYPES.has(effect.type)) problems.push(`unknown effect ${effect.type}`)
  if (!WORD_EQUATIONS.has(reaction.id)) {
    try {
      if (!checkEquation(reaction.equation).balanced) problems.push('equation not balanced')
    }
    catch (error) {
      problems.push(`equation unreadable: ${error.message}`)
    }
  }

  const equation = String(reaction.equation)
  const hasPrecipitate = (reaction.effects || []).some(effect => effect.type === 'precipitate')
  const hasGas = (reaction.effects || []).some(effect => effect.type === 'gas')
  if (equation.includes('↓') !== hasPrecipitate) problems.push('↓ in equation and precipitate effect disagree')
  if (equation.includes('↑') !== hasGas) problems.push('↑ in equation and gas effect disagree')

  const solids = solidsOf(reaction)
  for (const solid of solids) if (!solid.label) problems.push(`precipitate ${solid.formula} missing from the table`)
  const drawn = (reaction.effects || []).find(effect => effect.type === 'precipitate')?.color
  if (solids.length === 1 && solids[0].color && drawn && solids[0].color.toLowerCase() !== drawn.toLowerCase()) {
    problems.push(`precipitate colour ${drawn} differs from ${solids[0].formula} ${solids[0].color}`)
  }
  return problems
}

function quantitativeResult(reaction, reagents) {
  const additions = reaction.reactants.map(id => ({ id, volume: 25 }))
  return simulateLab({ additions, triggeredIds: [reaction.id], reactions: [reaction], reagents, concentrationOf: stockConcentration }).results.get(reaction.id)
}

export function profileReaction(reaction, reagents) {
  const problems = validateReaction(reaction, reagents)
  const effects = reaction.effects || []
  const equation = String(reaction.equation)
  const stepwise = stepwiseSystemFor(reaction.id)

  const categories = new Set()
  if (reaction.category === 'acid-base') categories.add('acid–base')
  if (effects.some(effect => effect.type === 'precipitate')) categories.add('precipitation')
  if (effects.some(effect => effect.type === 'gas')) categories.add('gas evolution')
  if (REDOX.has(reaction.id) || reaction.category === 'redox') categories.add('redox')
  if (COMPLEX.has(reaction.id) || reaction.category === 'complex') categories.add('complex formation')
  if (effects.some(effect => effect.type === 'removePrecipitate')) categories.add('dissolution')
  if (AMPHOTERIC[reaction.id]) categories.add('amphoteric').add('dissolution').add('multi-step')
  if (stepwise) categories.add('multi-step')
  if (HYDROLYSIS.has(reaction.id)) categories.add('hydrolysis')
  if (ADDITION_SUBSTITUTION.has(reaction.id)) categories.add('organic addition/substitution')
  if (equation.includes('⇌')) categories.add('reversible/equilibrium')
  if (reaction.category === 'decomposition') categories.add('decomposition')
  if (/nahco3$/.test(reaction.id) && reaction.category === 'organic-test') categories.add('acid–base')
  if (reaction.id === 'phenol-naoh') categories.add('acid–base')
  if (!categories.size) categories.add(reaction.category)

  const phenomena = {
    precipitate: solidsOf(reaction).map(solid => solid.formula),
    gas: [...equation.matchAll(/([A-Za-z0-9₀-₉]+)↑/g)].map(match => match[1]),
    colorChange: effects.some(effect => effect.type === 'solutionColor'),
    foam: effects.some(effect => effect.type === 'foam'),
    redissolution: Boolean(AMPHOTERIC[reaction.id]) || effects.some(effect => effect.type === 'removePrecipitate'),
    multiStep: Boolean(stepwise || AMPHOTERIC[reaction.id]),
    reversible: equation.includes('⇌')
  }
  phenomena.visible = phenomena.precipitate.length > 0 || phenomena.gas.length > 0 || phenomena.colorChange || phenomena.foam || phenomena.redissolution

  const conditions = conditionText(reaction)
  const result = problems.length ? null : quantitativeResult(reaction, reagents)
  const limitations = []
  if (result?.status === 'qualitative') {
    limitations.push(result.reason || `Thiếu nồng độ: ${result.missing.join(', ')}`)
  }
  if (NOT_SINGLE_STEP[reaction.id] && !stepwise) limitations.push(NOT_SINGLE_STEP[reaction.id])
  if (NOTES[reaction.id]) limitations.push(NOTES[reaction.id])
  if (stepwise) limitations.push('Mô hình hai nấc lý tưởng theo thứ tự thêm; khí coi như thoát hết.')

  let support
  if (problems.length) support = SUPPORT.INVALID
  else if (result?.status === 'quantitative') support = SUPPORT.QUANTITATIVE
  else if (conditions.length || NOTES[reaction.id]) support = SUPPORT.CONDITIONAL
  else support = SUPPORT.QUALITATIVE

  return {
    id: reaction.id,
    equation,
    categories: [...categories],
    phenomena,
    conditions,
    support,
    quantitative: result?.status === 'quantitative',
    limitations: [...new Set(limitations)],
    problems
  }
}

export function precipitateTableFormulas() {
  return Object.keys(PRECIPITATES)
}
