// ChemLab Engine: answers a closed set of question templates with ChemLab's own data and
// exact arithmetic, without any model call (0 Groq tokens). It answers only when it
// recognises exactly one template, exactly one substance and exactly the data that template
// needs; anything else (a reaction, a mixture, an ion, an extra number, a follow-up that
// leans on the conversation) returns null and goes to the model. A miss costs tokens, a
// wrong match costs correctness, so every rule here leans towards null.
import { elements as ELEMENTS } from '../../src/data/elements.js'
import { getElectronConfiguration, toSuperscript } from '../../src/chem/electronConfiguration.js'
import { parseSpecies } from '../../src/chem/formula.js'
import { periodicPosition } from './_knowledge.js'

// Rounded atomic masses as Vietnamese textbooks print them (SGK Hóa học 10–12). Only these
// elements are used in calculations; any other element sends the question to the model.
export const TEXTBOOK_MASS = Object.freeze({
  H: 1, He: 4, Li: 7, Be: 9, B: 11, C: 12, N: 14, O: 16, F: 19, Ne: 20,
  Na: 23, Mg: 24, Al: 27, Si: 28, P: 31, S: 32, Cl: 35.5, Ar: 40, K: 39, Ca: 40,
  Cr: 52, Mn: 55, Fe: 56, Co: 59, Ni: 59, Cu: 64, Zn: 65, Br: 80, Ag: 108, Sn: 119,
  I: 127, Ba: 137, Au: 197, Hg: 201, Pb: 207
})

// Vietnamese names students type, besides the GDPT 2018 (IUPAC English) name in elements.js.
// Words that are also ordinary Vietnamese words ("bo", "tin") are left out on purpose.
const VI_NAMES = Object.freeze({
  H: ['hiđro', 'hidro', 'hyđro'], He: ['heli'], Li: ['liti'], Be: ['beri'], C: ['cacbon'], N: ['nitơ', 'nito'],
  O: ['oxi', 'oxy'], F: ['flo'], Na: ['natri'], Mg: ['magie', 'magiê'], Al: ['nhôm'], Si: ['silic'],
  P: ['photpho', 'phốt pho'], S: ['lưu huỳnh'], Cl: ['clo'], K: ['kali'], Ca: ['canxi'], Sc: ['scandi'],
  Ti: ['titan'], V: ['vanadi'], Cr: ['crom'], Mn: ['mangan'], Fe: ['sắt'], Co: ['coban'], Ni: ['niken'],
  Cu: ['đồng'], Zn: ['kẽm'], Ga: ['gali'], Ge: ['gecmani'], As: ['asen'], Se: ['selen'], Br: ['brom'],
  Ag: ['bạc'], Sn: ['thiếc'], I: ['iot', 'iốt'], Ba: ['bari'], Au: ['vàng'], Hg: ['thủy ngân', 'thuỷ ngân'], Pb: ['chì']
})
const VI_LABEL = Object.freeze({ H: 'hiđro', N: 'nitơ', O: 'oxi', Na: 'natri', Mg: 'magie', Al: 'nhôm', P: 'photpho', S: 'lưu huỳnh', Cl: 'clo', K: 'kali', Ca: 'canxi', Cr: 'crom', Mn: 'mangan', Fe: 'sắt', Cu: 'đồng', Zn: 'kẽm', Ag: 'bạc', Ba: 'bari', Au: 'vàng', Hg: 'thủy ngân', Pb: 'chì', Br: 'brom', I: 'iot', C: 'cacbon', Si: 'silic', F: 'flo', Li: 'liti' })

const BY_SYMBOL = new Map(ELEMENTS.map(({ number, symbol, name, mass }) => [symbol, { number, symbol, name, mass }]))
const BY_NUMBER = new Map([...BY_SYMBOL.values()].map(item => [item.number, item]))
const BY_NAME = new Map()
for (const item of BY_SYMBOL.values()) {
  BY_NAME.set(item.name.toLowerCase(), item)
  for (const name of VI_NAMES[item.symbol] || []) BY_NAME.set(name, item)
}
BY_NAME.set('aluminum', BY_SYMBOL.get('Al'))

// Electron configurations are answered only inside the THPT range, where ChemLab's
// configuration engine and the textbook agree (exceptions Cr and Cu included).
const MAX_CONFIG_Z = 36

const STRONG_ACIDS = new Set(['HCl', 'HBr', 'HI', 'HNO3', 'HClO4'])
// Ca(OH)₂ is left out: barely soluble, so "x M" may describe a solution that cannot exist.
const STRONG_BASES = Object.freeze({ NaOH: 1, KOH: 1, LiOH: 1, 'Ba(OH)2': 2 })
const GASES = new Set(['H2', 'O2', 'N2', 'Cl2', 'F2', 'CO2', 'CO', 'SO2', 'NH3', 'CH4', 'NO', 'NO2', 'N2O', 'H2S', 'C2H4', 'C2H2', 'C2H6', 'C3H8', 'He', 'Ne', 'Ar'])
const MOLAR_VOLUME = Object.freeze({ dktc: { value: 22.4, label: 'đktc (0 °C, 1 atm)' }, dkc: { value: 24.79, label: 'đkc (25 °C, 1 bar)' } })

const L = '\\p{L}\\p{N}'
const word = pattern => new RegExp(`(?<![${L}])(?:${pattern})(?![${L}])`, 'iu')

// Anything that makes the problem more than one lookup or one formula, or that points at
// the conversation, or asks for reasoning: the model answers it.
const NOT_FOR_ENGINE = word([
  'phản ứng', 'tác dụng', 'hỗn hợp', 'hiệu suất', 'dư', 'tạo thành', 'sinh ra', 'thoát ra', 'kết tủa', 'nung', 'đốt',
  'điện phân', 'trộn', 'pha loãng', 'thêm', 'cô cạn', 'bay hơi', 'tinh thể', 'ngậm nước', 'hiđrat', 'tạp chất', 'độ tinh khiết',
  'phần trăm', 'khối lượng riêng', 'đồng vị', 'neutron', 'nơtron', 'số khối', 'ion', 'cation', 'anion', 'kích thích',
  'tại sao', 'vì sao', 'giải thích', 'so sánh', 'nhận xét', 'chứng minh', 'hiện tượng', 'ứng dụng', 'tính chất',
  'nó', 'chúng', 'đó', 'này', 'trên', 'vừa rồi', 'tiếp', 'còn', 'nếu', 'giả sử', 'sai', 'đúng không', 'kiểm tra',
  'lớp ngoài cùng', 'hóa trị', 'số oxi hóa', 'độ âm điện', 'bán kính', 'năng lượng', 'orbital', 'ô lượng tử'
].join('|'))

// ---------------- text helpers ----------------

const SUB = '₀₁₂₃₄₅₆₇₈₉'
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
function plain(message) {
  return String(message).normalize('NFC')
    .replace(/[₀-₉]/g, digit => String(SUB.indexOf(digit)))
    .replace(/⁻/g, '^-').replace(/⁺/g, '^+')
    .replace(/[⁰¹²³⁴-⁹]+/g, digits => `^${[...digits].map(digit => SUP.indexOf(digit)).join('')}`)
    .replace(/\^(-|\+)\^/g, '^$1')
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/\s+/g, ' ')
    .trim()
}

// Number with optional ×10ⁿ in the forms students write: 1,5.10^-3, 1,5×10^-3, 10^-3.
const NUMBER = String.raw`(?<![\w.^)\]])(?:(\d+(?:\.\d+)?)(?:\s*[.×x*·]\s*10\^\(?(-?\d+)\)?)?|10\^\(?(-?\d+)\)?)(?![\d^])`
const toNumber = (base, exp, alone) => alone !== undefined ? 10 ** Number(alone) : Number(base) * (exp !== undefined ? 10 ** Number(exp) : 1)

const UNITS = [
  ['mol', String.raw`mol(?!\s*\/)(?![\p{L}])`],
  ['g', String.raw`(?:g|gam|gram)(?![\p{L}\/])`],
  ['mL', String.raw`(?:ml|mL)(?![\p{L}])`],
  ['L', String.raw`(?:l|L|lít|lit)(?![\p{L}])`],
  ['M', String.raw`(?:M|mol\s*\/\s*[lL])(?![\p{L}])`]
]

// Every number in the text with its unit (or null). A number the engine cannot place makes
// the whole question unrecognised.
function quantities(text) {
  const out = []
  for (const match of text.matchAll(new RegExp(NUMBER, 'gu'))) {
    const value = toNumber(match[1], match[2], match[3])
    const rest = text.slice(match.index + match[0].length)
    const unit = UNITS.find(([, pattern]) => new RegExp(`^\\s*${pattern}`, 'u').test(rest))?.[0] ?? null
    const after = unit ? rest.replace(new RegExp(`^\\s*${UNITS.find(([name]) => name === unit)[1]}`, 'u'), '') : rest
    out.push({ value, unit, after: after.trimStart(), index: match.index })
  }
  return out
}

// Chemical formulas written in the text: element symbols only, validated by ChemLab's parser.
// Capitals inside Vietnamese words ("Cho", "Tính") are words, not formulas.
function formulas(text) {
  const found = text.match(/(?<![\p{L}\d^])(?:[A-Z][a-z]?\d*|\((?:[A-Z][a-z]?\d*)+\)\d*)+(?![\p{L}])/gu) || []
  const out = []
  for (const token of found) {
    try {
      const species = parseSpecies(token)
      if (species.charge || species.coefficient !== 1 || Object.keys(species.atoms).some(symbol => !BY_SYMBOL.has(symbol))) continue
      out.push({ formula: token, atoms: species.atoms })
    }
    catch {
      // "M", "CM", "IA"… are units or labels, not formulas.
    }
  }
  return out
}

const sameFormula = list => new Set(list.map(item => item.formula)).size === 1

// ---------------- formatting ----------------

const shown = formula => formula.replace(/(?<=[A-Za-z)])\d+/g, digits => [...digits].map(digit => SUB[digit]).join(''))
// Up to 5 significant figures, trailing zeros dropped, decimal comma.
export function fmt(value) {
  if (!Number.isFinite(value)) return String(value)
  if (value !== 0 && (Math.abs(value) < 1e-3 || Math.abs(value) >= 1e6)) {
    const exponent = Math.floor(Math.log10(Math.abs(value)))
    const mantissa = Number((value / 10 ** exponent).toPrecision(5))
    return `${String(mantissa).replace('.', ',')}·10${toSuperscript(exponent).replace('-', '⁻')}`
  }
  return String(Number(value.toPrecision(5))).replace('.', ',')
}
const elementLabel = item => VI_LABEL[item.symbol] && VI_LABEL[item.symbol] !== item.name.toLowerCase() ? `${item.name} – ${VI_LABEL[item.symbol]}` : item.name

function molarMassOf(atoms) {
  if (Object.keys(atoms).some(symbol => TEXTBOOK_MASS[symbol] === undefined)) return null
  const parts = Object.entries(atoms).map(([symbol, count]) => ({ symbol, count, mass: TEXTBOOK_MASS[symbol] }))
  const value = parts.reduce((sum, part) => sum + part.mass * part.count, 0)
  const steps = parts.map(part => part.count === 1 ? fmt(part.mass) : `${part.count} × ${fmt(part.mass)}`).join(' + ')
  return { value: Math.round(value * 1000) / 1000, steps }
}

const MASS_NOTE = '(Nguyên tử khối làm tròn theo SGK.)'

// ---------------- element cards ----------------

function elementCard(item, focus) {
  const lines = [`**${elementLabel(item)} (${item.symbol})** — số hiệu nguyên tử Z = ${item.number}`]
  const config = item.number <= MAX_CONFIG_Z ? getElectronConfiguration(item.number) : null
  if (config) {
    const position = periodicPosition(item.number)
    lines.push(`- Cấu hình electron: ${config.full}${config.condensed !== config.full ? ` (viết gọn: ${config.condensed})` : ''}`)
    lines.push(`- Số electron mỗi lớp: ${config.shells.join(', ')}`)
    lines.push(`- Vị trí: ô ${item.number}, chu kì ${position.period}, nhóm ${position.group}`)
    if (config.exceptionNote) lines.push(`- Lưu ý: ${config.exceptionNote}`)
  }
  if (focus === 'particles') lines.push(`- Nguyên tử trung hòa có ${item.number} proton và ${item.number} electron.`)
  const textbook = TEXTBOOK_MASS[item.symbol]
  lines.push(`- Nguyên tử khối: ${textbook !== undefined ? `${fmt(textbook)} (SGK làm tròn; giá trị chuẩn ${fmt(item.mass)})` : fmt(item.mass)}`)
  return lines.join('\n')
}

// The element a question names: by symbol (case-sensitive) or by name, exactly one.
function namedElement(text, symbols) {
  const lower = text.toLowerCase()
  const byName = [...BY_NAME.entries()].filter(([name]) => word(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(lower)).map(([, item]) => item)
  const bySymbol = symbols.filter(item => Object.keys(item.atoms).length === 1 && Object.values(item.atoms)[0] === 1).map(item => BY_SYMBOL.get(Object.keys(item.atoms)[0]))
  const all = [...new Set([...byName, ...bySymbol])]
  return all.length === 1 ? all[0] : null
}

// "1s² 2s² 2p⁶ 3s¹" or "[Ne] 3s¹" → the element, only when it is exactly the ground state.
function elementFromConfiguration(text) {
  const tokens = [...text.matchAll(/\[(He|Ne|Ar|Kr)\]|(?<![\p{L}\d])([1-7])([spdf])\^?(\d{1,2})(?!\d)/gu)]
  if (!tokens.length || tokens.filter(match => !match[1]).length < 1) return null
  const occupancy = new Map()
  for (const match of tokens) {
    if (match[1]) {
      const core = getElectronConfiguration(BY_SYMBOL.get(match[1]).number)
      for (const item of core.subshells) occupancy.set(item.label, item.electrons)
      continue
    }
    const label = `${match[2]}${match[3]}`
    if (occupancy.has(label)) return null
    occupancy.set(label, Number(match[4]))
  }
  const z = [...occupancy.values()].reduce((sum, value) => sum + value, 0)
  const ground = z >= 1 && z <= MAX_CONFIG_Z ? getElectronConfiguration(z) : null
  if (!ground || ground.subshells.length !== occupancy.size) return null
  if (ground.subshells.some(item => occupancy.get(item.label) !== item.electrons)) return null
  return BY_NUMBER.get(z)
}

// ---------------- templates ----------------

const ASKS = {
  config: word('cấu hình electron|cấu hình e'),
  molarMass: word('khối lượng mol(?: phân tử)?|phân tử khối|nguyên tử khối|khối lượng nguyên tử'),
  atomicNumber: word('số hiệu nguyên tử|điện tích hạt nhân'),
  particles: word('(?:bao nhiêu|số) (?:proton|electron|hạt proton|hạt electron)'),
  which: word('nguyên tố (?:nào|gì)|là nguyên tố|kí hiệu|ký hiệu|tên (?:gọi|nguyên tố)'),
  mol: word('số mol|bao nhiêu mol|tính n'),
  mass: word('khối lượng|bao nhiêu (?:gam|g)|tính m'),
  volume: word('thể tích|bao nhiêu (?:lít|l|ml)|tính v'),
  molarity: word('nồng độ mol|nồng độ|c_?m'),
  ph: word('ph')
}

function elementAnswer(text, found) {
  const asksConfig = ASKS.config.test(text)
  const config = elementFromConfiguration(text)
  if (config) {
    if (found.length || !ASKS.which.test(text)) return null
    return { kind: 'element:from-configuration', answer: `Cấu hình này (trạng thái cơ bản, ${config.number} electron) là của nguyên tử:\n\n${elementCard(config)}` }
  }
  const z = /(?<![\p{L}])(?:z|số hiệu nguyên tử(?: là| bằng)?)\s*=?\s*(\d{1,3})(?!\d)/iu.exec(text)
  if (z && found.length === 0) {
    const item = BY_NUMBER.get(Number(z[1]))
    if (!item || quantities(text).length !== 1) return null
    if (asksConfig && item.number > MAX_CONFIG_Z) return null
    return { kind: asksConfig ? 'element:configuration' : 'element:lookup', answer: elementCard(item) }
  }
  if (quantities(text).length) return null
  const item = namedElement(text, found)
  if (!item || found.some(entry => entry.formula !== item.symbol)) return null
  if (asksConfig) return item.number <= MAX_CONFIG_Z ? { kind: 'element:configuration', answer: elementCard(item) } : null
  if (ASKS.particles.test(text)) return { kind: 'element:particles', answer: elementCard(item, 'particles') }
  if (ASKS.atomicNumber.test(text) || ASKS.which.test(text) || ASKS.molarMass.test(text)) return { kind: ASKS.molarMass.test(text) ? 'element:atomic-mass' : 'element:lookup', answer: elementCard(item) }
  return null
}

function molarMassAnswer(text, found) {
  if (!ASKS.molarMass.test(text) || quantities(text).length || found.length !== 1) return null
  const { formula, atoms } = found[0]
  if (Object.keys(atoms).length === 1 && Object.values(atoms)[0] === 1) return null // an element: elementAnswer
  const mass = molarMassOf(atoms)
  if (!mass) return null
  return { kind: 'molar-mass', answer: `M(${shown(formula)}) = ${mass.steps} = **${fmt(mass.value)} g/mol**\n\n${MASS_NOTE}` }
}

function gasCondition(text) {
  const dktc = word('đktc|điều kiện tiêu chuẩn').test(text)
  const dkc = word('đkc|điều kiện chuẩn').test(text)
  return dktc === dkc ? null : dktc ? MOLAR_VOLUME.dktc : MOLAR_VOLUME.dkc
}

// One amount of one substance → another amount of it: mol, mass, gas volume (stated conditions).
function amountAnswer(text, found) {
  if (!found.length || !sameFormula(found) || word('dung dịch|nồng độ|ph').test(text)) return null
  const items = quantities(text)
  if (items.length !== 1 || !items[0].unit || items[0].unit === 'M') return null
  const [given] = items
  // "khối lượng mol" names M, not the mass asked for.
  const targets = ['mol', 'volume', 'mass'].filter(name => ASKS[name].test(text.replace(/khối lượng mol/giu, '')))
  if (targets.length !== 1) return null
  const target = targets[0]
  const { formula, atoms } = found[0]
  const mass = molarMassOf(atoms)
  if (!mass) return null
  const isVolume = given.unit === 'L' || given.unit === 'mL'
  const condition = gasCondition(text)
  if ((isVolume || target === 'volume') && (!GASES.has(formula) || !condition)) return null
  if ((given.unit === 'mol' && target === 'mol') || (given.unit === 'g' && target === 'mass') || (isVolume && target === 'volume')) return null
  if (given.value <= 0) return null
  const F = shown(formula)
  const lines = []
  let n
  if (given.unit === 'mol') n = given.value
  else if (given.unit === 'g') {
    n = given.value / mass.value
    lines.push(`M(${F}) = ${mass.steps} = ${fmt(mass.value)} g/mol`)
    lines.push(`n(${F}) = m/M = ${fmt(given.value)} / ${fmt(mass.value)} = ${fmt(n)} mol`)
  }
  else {
    const litres = given.unit === 'mL' ? given.value / 1000 : given.value
    n = litres / condition.value
    lines.push(`Ở ${condition.label}, 1 mol khí chiếm ${fmt(condition.value)} L.`)
    lines.push(`n(${F}) = V/${fmt(condition.value)} = ${fmt(litres)} / ${fmt(condition.value)} = ${fmt(n)} mol`)
  }
  let result
  if (target === 'mol') result = lines.length ? `**${lines.pop()}**` : `**n(${F}) = ${fmt(n)} mol**`
  else if (target === 'mass') {
    if (given.unit !== 'g') lines.push(`M(${F}) = ${mass.steps} = ${fmt(mass.value)} g/mol`)
    result = `**m(${F}) = n × M = ${fmt(n)} × ${fmt(mass.value)} = ${fmt(n * mass.value)} g**`
  }
  else {
    if (given.unit === 'g' || given.unit === 'mol') lines.push(`Ở ${condition.label}, 1 mol khí chiếm ${fmt(condition.value)} L.`)
    result = `**V(${F}) = n × ${fmt(condition.value)} = ${fmt(n)} × ${fmt(condition.value)} = ${fmt(n * condition.value)} L**`
  }
  return { kind: `amount:${given.unit}->${target}`, answer: [...lines, result].join('\n\n') + (given.unit === 'g' || target === 'mass' ? `\n\n${MASS_NOTE}` : '') }
}

// Solution volume: a number in L or mL followed by "dung dịch" (the water volume is not the solution volume).
const solutionVolume = items => items.filter(item => (item.unit === 'L' || item.unit === 'mL') && /^dung dịch/iu.test(item.after))

function solutionAnswer(text, found) {
  if (!word('dung dịch').test(text) || !found.length || !sameFormula(found) || ASKS.ph.test(text)) return null
  const items = quantities(text)
  if (items.length !== 2 || items.some(item => !item.unit)) return null
  const volumes = solutionVolume(items)
  if (volumes.length !== 1) return null
  const volume = volumes[0]
  const other = items.find(item => item !== volume)
  const litres = volume.unit === 'mL' ? volume.value / 1000 : volume.value
  if (litres <= 0 || other.value <= 0) return null
  const { formula, atoms } = found[0]
  const F = shown(formula)
  const mass = molarMassOf(atoms)
  if (!mass) return null
  const volumeLine = volume.unit === 'mL' ? `V = ${fmt(volume.value)} mL = ${fmt(litres)} L` : `V = ${fmt(litres)} L`
  const textNoMolar = text.replace(/khối lượng mol/giu, '')
  // Solute amount + solution volume → molarity.
  if ((other.unit === 'mol' || other.unit === 'g') && ASKS.molarity.test(text) && !ASKS.mol.test(text) && !ASKS.mass.test(textNoMolar)) {
    const lines = [volumeLine]
    let n = other.value
    if (other.unit === 'g') {
      n = other.value / mass.value
      lines.push(`n(${F}) = m/M = ${fmt(other.value)} / ${fmt(mass.value)} = ${fmt(n)} mol (M = ${mass.steps} = ${fmt(mass.value)} g/mol)`)
    }
    lines.push(`**CM(${F}) = n/V = ${fmt(n)} / ${fmt(litres)} = ${fmt(n / litres)} M**`)
    return { kind: `solution:${other.unit}->molarity`, answer: lines.join('\n\n') + (other.unit === 'g' ? `\n\n${MASS_NOTE}` : '') }
  }
  // Molarity + solution volume → solute amount.
  if (other.unit === 'M') {
    const targets = ['mol', 'mass'].filter(name => ASKS[name].test(textNoMolar))
    if (targets.length !== 1) return null
    const n = other.value * litres
    const lines = [volumeLine, `n(${F}) = CM × V = ${fmt(other.value)} × ${fmt(litres)} = ${fmt(n)} mol`]
    if (targets[0] === 'mol') lines[1] = `**${lines[1]}**`
    else lines.push(`**m(${F}) = n × M = ${fmt(n)} × ${fmt(mass.value)} = ${fmt(n * mass.value)} g** (M = ${mass.steps} = ${fmt(mass.value)} g/mol)`)
    return { kind: `solution:molarity->${targets[0]}`, answer: lines.join('\n\n') + (targets[0] === 'mass' ? `\n\n${MASS_NOTE}` : '') }
  }
  return null
}

// pH of one strong monoprotic acid or strong base at a stated molarity, 10⁻⁵ … 1 M, where
// water's own ions are negligible and the textbook formula pH = −log[H⁺] holds.
function phAnswer(text, found) {
  if (!ASKS.ph.test(text) || found.length === 0 || !sameFormula(found) || !word('dung dịch').test(text)) return null
  const items = quantities(text)
  if (items.length !== 1 || items[0].unit !== 'M') return null
  const c = items[0].value
  const { formula } = found[0]
  const F = shown(formula)
  const acid = STRONG_ACIDS.has(formula)
  const hydroxides = STRONG_BASES[formula]
  if (!acid && !hydroxides) return null
  const ion = acid ? c : c * hydroxides
  if (ion < 1e-5 || ion > 1) return null
  const pOH = -Math.log10(ion)
  const ph = acid ? pOH : 14 - pOH
  const round = value => fmt(Math.round(value * 100) / 100)
  const lines = acid
    ? [`${F} là acid mạnh, phân li hoàn toàn: [H⁺] = C = ${fmt(ion)} M`, `**pH = −log[H⁺] = −log(${fmt(ion)}) = ${round(ph)}**`]
    : [`${F} là base mạnh, phân li hoàn toàn: [OH⁻] = ${hydroxides > 1 ? `${hydroxides} × ${fmt(c)} = ` : ''}${fmt(ion)} M`, `pOH = −log[OH⁻] = ${round(pOH)}`, `**pH = 14 − pOH = ${round(ph)}** (ở 25 °C)`]
  return { kind: acid ? 'ph:strong-acid' : 'ph:strong-base', answer: lines.join('\n\n') }
}

const SUGGESTIONS = Object.freeze({
  element: ['Vì sao cấu hình này bền?', 'So sánh với nguyên tố cùng nhóm'],
  'molar-mass': ['Tính số mol trong 10 g chất này'],
  amount: ['Giải thích công thức n = m/M'],
  solution: ['Cách pha dung dịch này an toàn'],
  ph: ['Dung dịch này có tính acid hay base?']
})

// The engine's answer for a self-contained question, or null when the model should answer.
export function engineAnswer(message) {
  const text = plain(message)
  if (!text || text.length > 220 || (text.match(/\?/g) || []).length > 1 || /\n/.test(String(message).trim())) return null
  // Ions and charges ("Fe2+", "Fe³⁺", "SO4^2-") are outside every template.
  // An exponent (10⁻³) follows a digit; a charge follows a symbol or a formula's subscript.
  if (/[A-Za-z)\]][\d₀-₉]*\^?[\d⁰-⁹]*[+\-⁺⁻](?=\s|$|[,.;?)])/u.test(String(message))) return null
  if (NOT_FOR_ENGINE.test(text)) return null
  // Hydrates (CuSO₄·5H₂O, CuSO4.5H2O): the formula reader would see only the anhydrous salt.
  if (/[A-Za-z)]\d*(?:\.\d+|[·•∙*]\s*\d*)\s*[A-Z]/.test(text)) return null
  // A noble-gas core ([Ar]) is part of a configuration, not a substance.
  const found = formulas(text.replace(/\[(?:He|Ne|Ar|Kr)\]/g, ' '))
  for (const solve of [phAnswer, solutionAnswer, amountAnswer, molarMassAnswer, elementAnswer]) {
    const result = solve(text, found)
    if (result) return { ...result, suggestions: SUGGESTIONS[result.kind.split(':')[0]] || [] }
  }
  return null
}
